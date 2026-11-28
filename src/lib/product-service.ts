import { ObjectId, Filter, AnyBulkWriteOperation } from "mongodb";
import { unstable_cache, revalidateTag } from "next/cache";
import { getCollection, isMongoConfigured } from "./mongodb";
import { ProductItem, CategoryRecord, BrandRecord, AnalysisRule, ProductSubmission, SlimProductItem } from "@/types";
import {
  generateSeedProducts,
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_RULES,
  SEED_SUBMISSIONS,
} from "./seed-data";
import { fetchFromOpenFoodFacts } from "./open-food-facts";
import { analyzeIngredientsText } from "./ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness,
} from "./scoring-engine";

// In-memory runtime cache for development / offline / mock mode
let inMemoryProducts: ProductItem[] = generateSeedProducts();
let inMemoryCategories: CategoryRecord[] = [...SEED_CATEGORIES];
let inMemoryBrands: BrandRecord[] = [...SEED_BRANDS];
let inMemoryRules: AnalysisRule[] = [...SEED_RULES];
let inMemorySubmissions: ProductSubmission[] = [...SEED_SUBMISSIONS];

// In-memory query cache for instant 0ms responses across category transitions
const QUERY_CACHE = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60s TTL

export function invalidateProductCache(): void {
  QUERY_CACHE.clear();
  cachedSlimIndex = null;
  try {
    revalidateTag("products", "max");
  } catch { }
  try {
    revalidateTag("products-catalog", "max");
  } catch { }
}

import { CATEGORY_RESOLVER } from "./category-matcher";
export { CATEGORY_RESOLVER };

export const CARD_PROJECTION = {
  _id: 1,
  id: 1,
  name: 1,
  brand: 1,
  barcode: 1,
  category: 1,
  subCategory: 1,
  categorySlug: 1,
  productType: 1,
  flavour: 1,
  overallScore: 1,
  scoreLabel: 1,
  nutriScore: 1,
  novaGroup: 1,
  imageUrl: 1,
  imageStatus: 1,
  imageVerified: 1,
  verified: 1,
  hasPalmOil: 1,
  hasAddedSugar: 1,
  hasArtificialAdditives: 1,
  cocoaPercentage: 1,
  availability: 1,
  countryOfOrigin: 1,
  searchTags: 1,
  badges: 1,
  verificationDate: 1,
  updatedAt: 1,
  createdAt: 1,
};

export const SLIM_PRODUCT_PROJECTION = {
  _id: 1,
  id: 1,
  barcode: 1,
  name: 1,
  brand: 1,
  category: 1,
  categorySlug: 1,
  subCategory: 1,
  overallScore: 1,
  scoreLabel: 1,
  nutriScore: 1,
  novaGroup: 1,
  nutritionPer100g: 1,
  hasPalmOil: 1,
  hasAddedSugar: 1,
  hasHighSodium: 1,
  hasArtificialAdditives: 1,
  verified: 1,
  imageStatus: 1,
  imageVerified: 1,
  imageUrl: 1,
  createdAt: 1,
  availability: 1,
  countryOfOrigin: 1,
  cocoaPercentage: 1,
  searchTags: 1,
};

import { mapToSlimProduct } from "./product-mapper";
export { mapToSlimProduct };

let cachedSlimIndex: { data: SlimProductItem[]; timestamp: number } | null = null;
const SLIM_INDEX_CACHE_TTL = 60 * 1000; // 60s in-memory cache

export async function fetchSlimProductsIndex(): Promise<SlimProductItem[]> {
  const now = Date.now();
  if (cachedSlimIndex && now - cachedSlimIndex.timestamp < SLIM_INDEX_CACHE_TTL) {
    return cachedSlimIndex.data;
  }

  if (isMongoConfigured()) {
    try {
      const col = await getCollection("products");
      if (col) {
        const docs = await col
          .find({}, { projection: SLIM_PRODUCT_PROJECTION })
          .sort({ overallScore: -1 })
          .toArray();

        if (docs && docs.length > 0) {
          const slim = docs.map(mapToSlimProduct);
          cachedSlimIndex = { data: slim, timestamp: now };
          return slim;
        }
      }
    } catch (e) {
      console.error("[fetchSlimProductsIndex] MongoDB error, falling back to seed:", e);
    }
  }

  const inMem = getInMemoryProducts();
  const slim = inMem.map(mapToSlimProduct);
  cachedSlimIndex = { data: slim, timestamp: now };
  return slim;
}

export const getSlimProductsIndex = unstable_cache(
  async () => fetchSlimProductsIndex(),
  ["slim-products-catalogue-index"],
  { revalidate: 60, tags: ["products", "products-catalog"] }
);

export function getInMemoryProducts(): ProductItem[] {
  if (process.env.NODE_ENV !== "production") {
    return generateSeedProducts();
  }
  return inMemoryProducts;
}

/**
 * Calculate weighted relevance score for search ranking
 * Prioritises: Exact name > Exact product type > Exact subcategory > phrase match > brand/variant > tags > ingredient
 * Strictly demotes cross-category flavour matches (e.g. ice cream in cookie queries)
 */
export function computeSearchRelevance(product: ProductItem, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  const qSingular = q.endsWith("s") && q.length > 3 ? q.slice(0, -1) : q;
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  const sub = (product.subCategory || "").toLowerCase();
  const type = (product.productType || "").toLowerCase();
  const flavour = (product.flavour || "").toLowerCase();
  const tags = (product.searchTags || []).map((t) => t.toLowerCase());

  let score = 0;

  // Cold Drinks query expansion
  if (q === "cold drinks" || q === "cold drink") {
    if (
      product.categorySlug === "cold-drinks" ||
      cat.includes("beverages") ||
      sub.includes("carbonated") ||
      sub.includes("cola") ||
      sub.includes("drinks")
    ) {
      score += 800;
    }
  }

  // 1. Exact product name match
  if (name === q || name === qSingular) {
    score += 1000;
  }

  // 2. Exact product type match
  if (type === q || type === qSingular) {
    score += 700;
  } else if (type.includes(q) || type.includes(qSingular)) {
    score += 450;
  }

  // 3. Exact subcategory match
  if (sub === q || sub === qSingular) {
    score += 600;
  } else if (sub.includes(q) || sub.includes(qSingular)) {
    score += 500;
  }

  // 4. Product name word boundary & phrase match
  const words = name.split(/[\s,–—\-+&]+/);
  if (words.includes(q) || words.includes(qSingular)) {
    score += 350;
  } else if (name.startsWith(q) || name.startsWith(qSingular)) {
    score += 300;
  } else if (name.includes(q) || name.includes(qSingular)) {
    score += 180;
  }

  // 5. Brand match
  if (brand === q || brand === qSingular) {
    score += 200;
  } else if (brand.includes(q)) {
    score += 100;
  }

  // 6. Flavour match
  if (flavour === q || flavour === qSingular) {
    score += 80;
  } else if (flavour.includes(q)) {
    score += 50;
  }

  // 7. Search tags
  if (tags.includes(q) || tags.includes(qSingular)) {
    score += 60;
  } else if (tags.some((t) => t.includes(q))) {
    score += 30;
  }

  // 8. Category match
  if (cat.includes(q) || cat.includes(qSingular)) {
    score += 40;
  }

  // Cross-category Demotions:
  // Demote Ice Cream/Frozen Desserts when searching for "cookie", "biscuit", "chips"
  if (
    (q === "cookie" || q === "cookies" || q === "biscuit" || q === "biscuits") &&
    (cat.includes("ice cream") || name.includes("ice cream") || sub.includes("ice cream") || name.includes("frozen dessert"))
  ) {
    score -= 800; // Demoted below genuine bakery/snack items
  }

  // Demote bakery/confectionery items when searching for "chips" or "crisps"
  if (
    (q === "chips" || q === "chip" || q === "crisps" || q === "crisp") &&
    (sub.includes("cookies") || name.includes("cookie") || cat.includes("ice cream") || name.includes("ice cream") || cat.includes("bakery"))
  ) {
    score -= 800;
  }

  return score;
}

/**
 * Normalizes MongoDB ObjectId and dates to serializable plain object for Client Components
 */
function normalizeDoc<T extends Record<string, any>>(doc: T): T {
  if (!doc) return doc;
  const idStr = doc._id
    ? typeof doc._id === "string"
      ? doc._id
      : doc._id.toString()
    : doc.id
      ? String(doc.id)
      : undefined;

  const plain: any = { ...doc };
  if (idStr) {
    plain.id = idStr;
    plain._id = idStr;
  }
  if (plain.createdAt instanceof Date) {
    plain.createdAt = plain.createdAt.toISOString();
  }
  if (plain.updatedAt instanceof Date) {
    plain.updatedAt = plain.updatedAt.toISOString();
  }
  if (plain.verificationDate instanceof Date) {
    plain.verificationDate = plain.verificationDate.toISOString();
  }
  return JSON.parse(JSON.stringify(plain));
}

/**
 * Query products with server-side filters, search, pagination, and sorting
 */
export async function queryProducts(params: {
  q?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  productType?: string;
  flavour?: string;
  nutriScore?: string;
  novaGroup?: number;
  minScore?: number;
  maxScore?: number;
  hasPalmOil?: boolean;
  hasAddedSugar?: boolean;
  lowSodium?: boolean;
  lowSugar?: boolean;
  proteinRange?: "<10" | "10-20" | "21-30" | "30+" | string;
  sugarRange?: "<10" | "10-20" | "21-30" | "30+" | string;
  verifiedOnly?: boolean;
  imageStatus?: string;
  dataStatus?: string;
  includeArchived?: boolean;
  archivedOnly?: boolean;
  sortBy?: "name" | "score" | "recent" | "verified";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  projectCardOnly?: boolean;
}): Promise<{
  products: ProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  nextCursor?: string | null;
  isDbConnected: boolean;
}> {
  const cacheKey = JSON.stringify(params);
  const cached = QUERY_CACHE.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const col = await getCollection<ProductItem>("products");

  if (col) {
    const filter: Filter<ProductItem> = {};

    // Keyword Search: search across name, brand, barcode, ingredients, flavour, productType, searchTags, description
    if (params.q) {
      const qTrimmed = params.q.trim();
      const qLower = qTrimmed.toLowerCase();
      const regex = new RegExp(qTrimmed, "i");
      filter.$or = [
        { name: regex } as any,
        { brand: regex } as any,
        { barcode: regex } as any,
        { ingredientsText: regex } as any,
        { flavour: regex } as any,
        { productType: regex } as any,
        { searchTags: regex } as any,
        { description: regex } as any,
      ];
      if (qLower === "cold drinks" || qLower === "cold drink") {
        filter.$or.push(
          { categorySlug: "cold-drinks" } as any,
          { category: "Beverages & Drinks" } as any,
          { category: "Cold Drinks" } as any,
          { subCategory: "Carbonated Soft Drinks" } as any
        );
      }
      // Only search category/subcategory text in $or if explicit category filter is NOT specified
      if (!params.category || params.category === "All") {
        filter.$or.push({ subCategory: regex } as any);
        filter.$or.push({ category: regex } as any);
      }
    }

    // Category filter: strictly enforce 1:1 taxonomy so EACH item is visible under ONLY ONE category
    if (params.category && params.category !== "All") {
      const catLower = params.category.toLowerCase().trim();
      const targetCategory = CATEGORY_RESOLVER[catLower] || params.category;
      if (Array.isArray(targetCategory)) {
        filter.category = { $in: targetCategory } as any;
      } else {
        filter.category = targetCategory;
      }
    }

    // Subcategory filter: strictly enforce taxonomy
    if (params.subCategory && params.subCategory !== "All") {
      if (params.subCategory.toLowerCase() === "chips") {
        filter.subCategory = { $in: ["Chips", "Chips & Crisps"] } as any;
      } else {
        filter.subCategory = params.subCategory;
      }
    }

    if (params.brand && params.brand !== "All") {
      filter.brand = params.brand;
    }

    if (params.productType && params.productType !== "All") {
      filter.productType = params.productType;
    }

    if (params.flavour && params.flavour !== "All") {
      filter.flavour = new RegExp(params.flavour.trim(), "i") as any;
    }

    if (params.imageStatus && params.imageStatus !== "All") {
      filter.imageStatus = params.imageStatus as any;
    }

    if (params.dataStatus && params.dataStatus !== "All") {
      filter.dataStatus = params.dataStatus as any;
    }

    // Archiving filter: public directory never sees archived items unless explicitly requested
    if (params.archivedOnly) {
      filter.isArchived = true;
    } else if (!params.includeArchived) {
      filter.isArchived = { $ne: true };
    }

    if (params.nutriScore && params.nutriScore !== "All") {
      filter.nutriScore = params.nutriScore as any;
    }

    if (params.novaGroup) {
      filter.novaGroup = Number(params.novaGroup) as any;
    }

    if (params.minScore !== undefined || params.maxScore !== undefined) {
      filter.overallScore = {};
      if (params.minScore !== undefined) filter.overallScore.$gte = Number(params.minScore);
      if (params.maxScore !== undefined) filter.overallScore.$lte = Number(params.maxScore);
    }

    if (params.hasPalmOil !== undefined) {
      filter.hasPalmOil = params.hasPalmOil;
    }

    if (params.hasAddedSugar !== undefined) {
      filter.hasAddedSugar = params.hasAddedSugar;
    }

    if (params.lowSodium) {
      filter["nutritionPer100g.sodium"] = { $lte: 120 } as any;
    }

    if (params.lowSugar) {
      filter["nutritionPer100g.sugars"] = { $lte: 5.0 } as any;
    }

    if (params.proteinRange && params.proteinRange !== "All") {
      if (params.proteinRange === "<10") {
        filter["nutritionPer100g.protein"] = { $lt: 10 } as any;
      } else if (params.proteinRange === "10-20") {
        filter["nutritionPer100g.protein"] = { $gte: 10, $lte: 20 } as any;
      } else if (params.proteinRange === "21-30") {
        filter["nutritionPer100g.protein"] = { $gt: 20, $lte: 30 } as any;
      } else if (params.proteinRange === "30+") {
        filter["nutritionPer100g.protein"] = { $gt: 30 } as any;
      }
    }

    if (params.sugarRange && params.sugarRange !== "All") {
      if (params.sugarRange === "<10") {
        filter["nutritionPer100g.sugars"] = { $lt: 10 } as any;
      } else if (params.sugarRange === "10-20") {
        filter["nutritionPer100g.sugars"] = { $gte: 10, $lte: 20 } as any;
      } else if (params.sugarRange === "21-30") {
        filter["nutritionPer100g.sugars"] = { $gt: 20, $lte: 30 } as any;
      } else if (params.sugarRange === "30+") {
        filter["nutritionPer100g.sugars"] = { $gt: 30 } as any;
      }
    }

    if (params.verifiedOnly) {
      filter.verified = true;
    }

    // Sorting
    const sort: Record<string, 1 | -1> = {};
    const order = params.sortOrder === "asc" ? 1 : -1;

    switch (params.sortBy) {
      case "name":
        sort.name = order;
        break;
      case "score":
        sort.overallScore = order;
        break;
      case "verified":
        sort.verificationDate = order;
        break;
      case "recent":
      default:
        sort.updatedAt = order;
        break;
    }

    let docs: ProductItem[] = [];
    let total = 0;

    const projection = params.projectCardOnly ? CARD_PROJECTION : undefined;

    // When text query is specified without an explicit sort order, rank by search relevance
    if (params.q && !params.sortBy) {
      const queryCursor = col.find(filter);
      if (projection) queryCursor.project(projection);
      const allMatching = await queryCursor.toArray();
      allMatching.sort(
        (a, b) => computeSearchRelevance(b, params.q!) - computeSearchRelevance(a, params.q!)
      );
      total = allMatching.length;
      docs = allMatching.slice(skip, skip + limit);
    } else {
      const queryCursor = col.find(filter).sort(sort).skip(skip).limit(limit);
      if (projection) queryCursor.project(projection);

      const [totalCount, fetchedDocs] = await Promise.all([
        col.countDocuments(filter),
        queryCursor.toArray(),
      ]);
      total = totalCount;
      docs = fetchedDocs;
    }
    const totalPages = Math.ceil(total / limit) || 1;
    const hasMore = page < totalPages;
    const nextCursor = hasMore ? (page + 1).toString() : null;

    const result = {
      products: docs.map(normalizeDoc),
      total,
      page,
      limit,
      totalPages,
      hasMore,
      nextCursor,
      isDbConnected: true,
    };
    QUERY_CACHE.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
    return result;
  }

  // Fallback to in-memory seed products
  let filtered = [...getInMemoryProducts()];

  if (params.q) {
    const term = params.q.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.barcode.includes(term) ||
        p.ingredientsText.toLowerCase().includes(term) ||
        (p.flavour && p.flavour.toLowerCase().includes(term)) ||
        (p.productType && p.productType.toLowerCase().includes(term)) ||
        (p.searchTags && p.searchTags.some((t) => t.toLowerCase().includes(term))) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (!params.category && p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
        (!params.category && p.category.toLowerCase().includes(term)) ||
        ((term === "cold drinks" || term === "cold drink") &&
          (p.categorySlug === "cold-drinks" || p.category === "Beverages & Drinks" || p.category === "Cold Drinks"))
    );

    if (!params.sortBy) {
      filtered.sort(
        (a, b) => computeSearchRelevance(b, params.q!) - computeSearchRelevance(a, params.q!)
      );
    }
  }

  if (params.archivedOnly) {
    filtered = filtered.filter((p) => p.isArchived === true);
  } else if (!params.includeArchived) {
    filtered = filtered.filter((p) => p.isArchived !== true);
  }

  if (params.productType && params.productType !== "All") {
    filtered = filtered.filter((p) => p.productType === params.productType);
  }

  if (params.imageStatus && params.imageStatus !== "All") {
    filtered = filtered.filter((p) => p.imageStatus === params.imageStatus);
  }

  if (params.dataStatus && params.dataStatus !== "All") {
    filtered = filtered.filter((p) => p.dataStatus === params.dataStatus);
  }

  if (params.category && params.category !== "All") {
    const catLower = params.category.toLowerCase().trim();
    const targetCategory = CATEGORY_RESOLVER[catLower] || params.category;
    if (Array.isArray(targetCategory)) {
      filtered = filtered.filter((p) => targetCategory.includes(p.category));
    } else {
      filtered = filtered.filter((p) => p.category === targetCategory);
    }
  }

  if (params.subCategory && params.subCategory !== "All") {
    if (params.subCategory.toLowerCase() === "chips") {
      filtered = filtered.filter(
        (p) => p.subCategory === "Chips" || p.subCategory === "Chips & Crisps"
      );
    } else {
      filtered = filtered.filter(
        (p) => p.subCategory?.toLowerCase() === params.subCategory!.toLowerCase()
      );
    }
  }

  if (params.brand && params.brand !== "All") {
    filtered = filtered.filter((p) => p.brand === params.brand);
  }

  if (params.nutriScore && params.nutriScore !== "All") {
    filtered = filtered.filter((p) => p.nutriScore === params.nutriScore);
  }

  if (params.novaGroup) {
    filtered = filtered.filter((p) => p.novaGroup === Number(params.novaGroup));
  }

  if (params.minScore !== undefined) {
    filtered = filtered.filter((p) => p.overallScore >= Number(params.minScore));
  }

  if (params.maxScore !== undefined) {
    filtered = filtered.filter((p) => p.overallScore <= Number(params.maxScore));
  }

  if (params.hasPalmOil !== undefined) {
    filtered = filtered.filter((p) => p.hasPalmOil === params.hasPalmOil);
  }

  if (params.hasAddedSugar !== undefined) {
    filtered = filtered.filter((p) => p.hasAddedSugar === params.hasAddedSugar);
  }

  if (params.lowSodium) {
    filtered = filtered.filter((p) => (p.nutritionPer100g.sodium || 0) <= 120);
  }

  if (params.lowSugar) {
    filtered = filtered.filter((p) => (p.nutritionPer100g.sugars || 0) <= 5.0);
  }

  if (params.proteinRange && params.proteinRange !== "All") {
    filtered = filtered.filter((p) => {
      const v = p.nutritionPer100g?.protein ?? 0;
      if (params.proteinRange === "<10") return v < 10;
      if (params.proteinRange === "10-20") return v >= 10 && v <= 20;
      if (params.proteinRange === "21-30") return v > 20 && v <= 30;
      if (params.proteinRange === "30+") return v > 30;
      return true;
    });
  }

  if (params.sugarRange && params.sugarRange !== "All") {
    filtered = filtered.filter((p) => {
      const v = p.nutritionPer100g?.sugars ?? 0;
      if (params.sugarRange === "<10") return v < 10;
      if (params.sugarRange === "10-20") return v >= 10 && v <= 20;
      if (params.sugarRange === "21-30") return v > 20 && v <= 30;
      if (params.sugarRange === "30+") return v > 30;
      return true;
    });
  }

  if (params.verifiedOnly) {
    filtered = filtered.filter((p) => p.verified);
  }

  // Sorting
  if (params.q && !params.sortBy) {
    filtered.sort(
      (a, b) => computeSearchRelevance(b, params.q!) - computeSearchRelevance(a, params.q!)
    );
  } else {
    filtered.sort((a, b) => {
      const order = params.sortOrder === "asc" ? 1 : -1;
      if (params.sortBy === "name") {
        return a.name.localeCompare(b.name) * order;
      }
      if (params.sortBy === "score") {
        return (a.overallScore - b.overallScore) * order;
      }
      return (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) * (order * -1);
    });
  }

  const total = filtered.length;
  const paged = filtered.slice(skip, skip + limit);
  const totalPages = Math.ceil(total / limit) || 1;
  const hasMore = page < totalPages;
  const nextCursor = hasMore ? (page + 1).toString() : null;

  const result = {
    products: paged,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    nextCursor,
    isDbConnected: false,
  };
  QUERY_CACHE.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
  return result;
}

/**
 * Get product by ID (handles both MongoDB ObjectId and custom string IDs)
 */
export async function getProductById(id: string): Promise<ProductItem | null> {
  const col = await getCollection<ProductItem>("products");
  if (col) {
    let doc: any = null;
    if (ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) as any });
    }
    if (!doc) {
      const cleanBarcode = id.replace(/^prod_/, "");
      doc = await col.findOne({
        $or: [
          { id },
          { barcode: id },
          { barcode: cleanBarcode },
          { _id: id as any },
        ],
      });
    }
    return doc ? normalizeDoc(doc) : null;
  }

  const cleanId = id.replace(/^prod_/, "");
  const matcher = (p: ProductItem) =>
    p.id === id || p._id === id || p.barcode === id || p.barcode === cleanId;
  return inMemoryProducts.find(matcher) || getInMemoryProducts().find(matcher) || null;
}

/**
 * Get product by barcode.
 * If not in database, queries Open Food Facts API, normalizes, and saves into MongoDB.
 */
export async function getProductByBarcode(barcode: string): Promise<{
  product: ProductItem | null;
  source: "database" | "openfoodfacts" | "not_found";
}> {
  const clean = barcode.trim().replace(/[^0-9]/g, "");
  if (!clean) return { product: null, source: "not_found" };

  const col = await getCollection<ProductItem>("products");

  // 1. Check local MongoDB
  if (col) {
    const found = await col.findOne({ barcode: clean });
    if (found) {
      return { product: normalizeDoc(found), source: "database" };
    }
  } else {
    const local = getInMemoryProducts().find((p) => p.barcode === clean);
    if (local) {
      return { product: local, source: "database" };
    }
  }

  // 2. Query Open Food Facts external database
  console.log(`[ProductService] Barcode ${clean} not found in DB. Querying Open Food Facts...`);
  const offProduct = await fetchFromOpenFoodFacts(clean);

  if (offProduct) {
    if (col) {
      try {
        const res = await col.insertOne(offProduct as any);
        offProduct._id = res.insertedId.toString();
        offProduct.id = res.insertedId.toString();
        console.log(`[ProductService] Successfully imported and persisted barcode ${clean} to MongoDB.`);
      } catch (err) {
        console.warn(`[ProductService] Could not persist OFF product to MongoDB:`, (err as Error).message);
      }
    } else {
      inMemoryProducts.unshift(offProduct);
    }
    return { product: offProduct, source: "openfoodfacts" };
  }

  return { product: null, source: "not_found" };
}

/**
 * Find healthier alternative products in the same category
 */
export async function getProductAlternatives(product: ProductItem): Promise<ProductItem[]> {
  const col = await getCollection<ProductItem>("products");

  if (col) {
    let alternatives = await col
      .find({
        category: product.category,
        ...(product.subCategory ? { subCategory: product.subCategory } : {}),
        barcode: { $ne: product.barcode },
        overallScore: { $gt: product.overallScore },
      })
      .sort({ overallScore: -1 })
      .limit(4)
      .toArray();

    if (alternatives.length < 4) {
      const more = await col
        .find({
          category: product.category,
          barcode: { $nin: [product.barcode, ...alternatives.map((a) => a.barcode)] },
          overallScore: { $gt: product.overallScore },
        })
        .sort({ overallScore: -1 })
        .limit(4 - alternatives.length)
        .toArray();
      alternatives = alternatives.concat(more);
    }

    return alternatives.map(normalizeDoc);
  }

  const subCatMatches = inMemoryProducts
    .filter(
      (p) =>
        p.category === product.category &&
        (!product.subCategory || p.subCategory === product.subCategory) &&
        p.barcode !== product.barcode &&
        p.overallScore > product.overallScore
    )
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 4);

  if (subCatMatches.length >= 4) return subCatMatches;

  const otherMatches = inMemoryProducts
    .filter(
      (p) =>
        p.category === product.category &&
        p.subCategory !== product.subCategory &&
        p.barcode !== product.barcode &&
        p.overallScore > product.overallScore &&
        !subCatMatches.some((m) => m.barcode === p.barcode)
    )
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 4 - subCatMatches.length);

  return [...subCatMatches, ...otherMatches];
}

/**
 * Get featured healthy snacks for the home page showcase section
 */
export async function getFeaturedHealthySnacks(): Promise<ProductItem[]> {
  const col = await getCollection<ProductItem>("products");
  if (col) {
    try {
      const items = await col
        .find({ isFeatured: true })
        .sort({ overallScore: -1 })
        .limit(16)
        .toArray();
      if (items && items.length > 0) {
        return items.map((doc: any) => ({
          ...doc,
          id: doc._id?.toString() || doc.id || doc.barcode,
          _id: doc._id?.toString(),
        })) as ProductItem[];
      }
    } catch (err) {
      console.error("[getFeaturedHealthySnacks] Error querying MongoDB:", err);
    }
  }

  return inMemoryProducts.filter((p) => p.isFeatured).slice(0, 16);
}

/**
 * Create or update product in MongoDB
 */
export async function saveProduct(input: Partial<ProductItem>): Promise<ProductItem> {
  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();

  // Re-calculate scores
  const ingredientsText = input.ingredientsText || "";
  const analysis = analyzeIngredientsText(ingredientsText);
  const nutrition = input.nutritionPer100g || {
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
    salt: 0,
  };

  const nutri = calculateNutriScore(nutrition, input.category?.includes("Beverages"));
  const nova = determineNovaGroup(analysis.ingredientsList, ingredientsText);
  const overall = calculateOverallScore({
    nutrition,
    ingredients: analysis.ingredientsList,
    nutriScore: nutri.grade,
    novaGroup: nova,
    category: input.category,
  });
  const completeness = calculateDataCompleteness(nutrition, ingredientsText, input.imageUrl);

  const productData: ProductItem = {
    barcode: input.barcode?.trim() || "",
    name: input.name?.trim() || "Untitled Product",
    brand: input.brand?.trim() || "Independent",
    category: input.category || "Packaged Foods",
    subCategory: input.subCategory || "",
    servingSize: input.servingSize || "100g",
    imageUrl: input.imageUrl || "",
    ingredientsText,
    ingredientsList: analysis.ingredientsList,
    nutritionPer100g: nutrition,
    nutriScore: nutri.grade,
    nutriScoreScore: nutri.score,
    novaGroup: nova,
    overallScore: overall.score,
    scoreLabel: overall.label,
    hasPalmOil: analysis.hasPalmOil,
    hasAddedSugar: analysis.hasAddedSugar,
    hasHighSodium: (nutrition.sodium || 0) > 600,
    hasHighSaturatedFat: (nutrition.saturatedFat || 0) > 5.0,
    hasArtificialAdditives: analysis.hasArtificialAdditives,
    isUltraProcessed: nova === 4,
    allergens: analysis.allergens,
    ingredientAlerts: analysis.ingredientAlerts,
    dataCompleteness: completeness,
    verified: input.verified ?? false,
    verificationDate: input.verified ? now : undefined,
    verifiedBy: input.verified ? (input.verifiedBy || "Admin") : undefined,
    source: input.source || "manual",
    // Extended Catalogue & Management Fields
    productType: input.productType || "",
    flavour: input.flavour || "",
    packageSize: input.packageSize || "",
    packageUnit: input.packageUnit || "",
    manufacturer: input.manufacturer || "",
    countryOfOrigin: input.countryOfOrigin || "",
    searchTags: Array.isArray(input.searchTags) ? input.searchTags : [],
    isArchived: input.isArchived ?? false,
    archivedAt: input.archivedAt,
    dataStatus: input.dataStatus || (input.verified ? "verified" : completeness < 60 ? "incomplete" : "under_review"),
    description: input.description || "",
    imageStatus: input.imageStatus || (input.imageUrl?.includes("placeholder") ? "MISSING" : "VERIFIED"),
    imageSourceUrl: input.imageSourceUrl,
    imageVerificationNote: input.imageVerificationNote,
    imageVerifiedAt: input.imageVerifiedAt,
    auditHistory: input.auditHistory || [],

    createdAt: input.createdAt || now,
    updatedAt: now,
  };

  if (col) {
    if (input._id && ObjectId.isValid(input._id)) {
      await col.updateOne({ _id: new ObjectId(input._id) as any }, { $set: productData });
      return { ...productData, _id: input._id, id: input._id };
    }

    // Upsert by barcode
    const res = await col.updateOne(
      { barcode: productData.barcode },
      { $set: productData },
      { upsert: true }
    );
    invalidateProductCache();
    const id = res.upsertedId ? res.upsertedId.toString() : input._id || input.id;
    return { ...productData, _id: id, id };
  }

  // In-memory fallback
  invalidateProductCache();
  const idx = inMemoryProducts.findIndex((p) => p.barcode === productData.barcode);
  if (idx >= 0) {
    inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...productData };
    return inMemoryProducts[idx];
  } else {
    productData._id = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    productData.id = productData._id;
    inMemoryProducts.unshift(productData);
    return productData;
  }
}

/**
 * Delete a product by ID or barcode
 */
export async function deleteProduct(id: string): Promise<boolean> {
  invalidateProductCache();
  const col = await getCollection<ProductItem>("products");
  if (col) {
    let res;
    if (ObjectId.isValid(id)) {
      res = await col.deleteOne({ _id: new ObjectId(id) as any });
    } else {
      res = await col.deleteOne({ $or: [{ barcode: id }, { id }] });
    }
    return (res.deletedCount || 0) > 0;
  }

  const initialLen = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((p) => p._id !== id && p.id !== id && p.barcode !== id);
  return inMemoryProducts.length < initialLen;
}

/**
 * Builds a MongoDB filter matching a product by ObjectId _id, string _id, custom id, or barcode.
 */
function buildProductLookupFilter(id: string): Filter<ProductItem> {
  const cleanBarcode = id.replace(/^prod_/, "");
  const orClauses: Record<string, unknown>[] = [
    { _id: id },
    { id },
    { barcode: id },
    { barcode: cleanBarcode },
  ];
  if (ObjectId.isValid(id)) {
    orClauses.unshift({ _id: new ObjectId(id) });
  }
  return { $or: orClauses } as unknown as Filter<ProductItem>;
}

function buildExactRecordFilter(id: string): Filter<ProductItem> {
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { id }] } as unknown as Filter<ProductItem>;
  }
  return { $or: [{ _id: id }, { id }] } as unknown as Filter<ProductItem>;
}

/**
 * Archive product (soft-delete): removes from public directory, preserves document
 */
export async function archiveProduct(id: string, performedBy: string = "Admin"): Promise<boolean> {
  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();
  const query = buildProductLookupFilter(id);

  if (col) {
    const prod = await col.findOne(query);
    if (!prod) return false;
    const auditEntry = {
      action: "ARCHIVE_PRODUCT",
      timestamp: now,
      performedBy,
      details: `Product archived: ${prod.name}`,
    };
    await col.updateOne(query, {
      $set: {
        isArchived: true,
        archivedAt: now,
        updatedAt: now,
      },
      $push: { auditHistory: auditEntry as any },
    });
    invalidateProductCache();
    return true;
  }
  const item = inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);
  if (item) {
    item.isArchived = true;
    item.archivedAt = now;
    item.updatedAt = now;
    invalidateProductCache();
    return true;
  }
  return false;
}

/**
 * Restore product (re-activates archived product)
 */
export async function restoreProduct(id: string, performedBy: string = "Admin"): Promise<boolean> {
  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();
  const query = buildProductLookupFilter(id);

  if (col) {
    const prod = await col.findOne(query);
    if (!prod) return false;
    const auditEntry = {
      action: "RESTORE_PRODUCT",
      timestamp: now,
      performedBy,
      details: `Product restored to active catalogue: ${prod.name}`,
    };
    await col.updateOne(query, {
      $set: {
        isArchived: false,
        archivedAt: undefined,
        updatedAt: now,
      },
      $push: { auditHistory: auditEntry as any },
    });
    invalidateProductCache();
    return true;
  }
  const item = inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);
  if (item) {
    item.isArchived = false;
    item.archivedAt = undefined;
    item.updatedAt = now;
    invalidateProductCache();
    return true;
  }
  return false;
}

/**
 * Permanent Delete Product
 */
export async function permanentDeleteProduct(id: string, performedBy: string = "Admin"): Promise<boolean> {
  return deleteProduct(id);
}

/**
 * Correct Product Mapping with before/after audit tracking
 */
export async function updateProductMapping(
  id: string,
  mapping: {
    category: string;
    subCategory: string;
    productType?: string;
    brand?: string;
    flavour?: string;
    searchTags?: string[];
  },
  performedBy: string = "Admin",
  reason?: string
): Promise<{ success: boolean; product?: ProductItem; error?: string }> {
  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();
  const query = buildProductLookupFilter(id);

  const current = col
    ? await col.findOne(query)
    : inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);

  if (!current) {
    return { success: false, error: "Product not found" };
  }

  const changes: Record<string, { old: any; new: any }> = {};
  if (current.category !== mapping.category) changes.category = { old: current.category, new: mapping.category };
  if (current.subCategory !== mapping.subCategory) changes.subCategory = { old: current.subCategory, new: mapping.subCategory };
  if (mapping.productType !== undefined && current.productType !== mapping.productType) changes.productType = { old: current.productType, new: mapping.productType };
  if (mapping.brand && current.brand !== mapping.brand) changes.brand = { old: current.brand, new: mapping.brand };
  if (mapping.flavour !== undefined && current.flavour !== mapping.flavour) changes.flavour = { old: current.flavour, new: mapping.flavour };
  if (mapping.searchTags && JSON.stringify(current.searchTags) !== JSON.stringify(mapping.searchTags)) {
    changes.searchTags = { old: current.searchTags || [], new: mapping.searchTags };
  }

  const auditEntry = {
    action: "CORRECT_PRODUCT_MAPPING",
    timestamp: now,
    performedBy,
    details: reason || `Updated mapping: Category (${mapping.category}), Subcategory (${mapping.subCategory})`,
    changes,
  };

  const updateSet: Partial<ProductItem> = {
    category: mapping.category,
    subCategory: mapping.subCategory,
    updatedAt: now,
  };
  if (mapping.productType !== undefined) updateSet.productType = mapping.productType;
  if (mapping.brand) updateSet.brand = mapping.brand;
  if (mapping.flavour !== undefined) updateSet.flavour = mapping.flavour;
  if (mapping.searchTags !== undefined) updateSet.searchTags = mapping.searchTags;

  if (col) {
    await col.updateOne(query, {
      $set: updateSet,
      $push: { auditHistory: auditEntry as any },
    });
    invalidateProductCache();
    const updated = await col.findOne(query);
    return { success: true, product: updated ? normalizeDoc(updated) : undefined };
  }

  Object.assign(current, updateSet);
  if (!current.auditHistory) current.auditHistory = [];
  current.auditHistory.push(auditEntry);
  invalidateProductCache();
  return { success: true, product: current };
}

/**
 * Bulk product updates (category, subcategory, brand, search tags, archive, restore, delete)
 */
export async function bulkUpdateProducts(
  params: {
    ids: string[];
    action?: "update" | "archive" | "restore" | "delete";
    category?: string;
    subCategory?: string;
    brand?: string;
    productType?: string;
    addSearchTags?: string[];
    removeSearchTags?: string[];
    isArchived?: boolean;
  },
  performedBy: string = "Admin"
): Promise<{ success: boolean; affectedCount: number; error?: string }> {
  const { ids, action = "update" } = params;
  if (!ids || ids.length === 0) return { success: true, affectedCount: 0 };

  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();

  if (action === "delete") {
    let deleted = 0;
    for (const id of ids) {
      const ok = await deleteProduct(id);
      if (ok) deleted++;
    }
    return { success: true, affectedCount: deleted };
  }

  if (action === "archive") {
    let count = 0;
    for (const id of ids) {
      const ok = await archiveProduct(id, performedBy);
      if (ok) count++;
    }
    return { success: true, affectedCount: count };
  }

  if (action === "restore") {
    let count = 0;
    for (const id of ids) {
      const ok = await restoreProduct(id, performedBy);
      if (ok) count++;
    }
    return { success: true, affectedCount: count };
  }

  // Update operation
  const updateFields: any = { updatedAt: now };
  if (params.category) updateFields.category = params.category;
  if (params.subCategory) updateFields.subCategory = params.subCategory;
  if (params.brand) updateFields.brand = params.brand;
  if (params.productType) updateFields.productType = params.productType;
  if (params.isArchived !== undefined) {
    updateFields.isArchived = params.isArchived;
    if (params.isArchived) updateFields.archivedAt = now;
    else updateFields.archivedAt = null;
  }

  let affected = 0;

  for (const id of ids) {
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { $or: [{ barcode: id }, { id }] };
    if (col) {
      const prod = await col.findOne(query);
      if (prod) {
        let tags = prod.searchTags || [];
        if (params.addSearchTags?.length) {
          tags = Array.from(new Set([...tags, ...params.addSearchTags]));
        }
        if (params.removeSearchTags?.length) {
          tags = tags.filter((t) => !params.removeSearchTags!.includes(t));
        }

        const auditEntry = {
          action: "BULK_UPDATE_PRODUCT",
          timestamp: now,
          performedBy,
          details: `Bulk updated fields: ${Object.keys(updateFields).join(", ")}`,
        };

        await col.updateOne(query, {
          $set: { ...updateFields, searchTags: tags },
          $push: { auditHistory: auditEntry as any },
        });
        affected++;
      }
    } else {
      const prod = inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);
      if (prod) {
        Object.assign(prod, updateFields);
        if (params.addSearchTags?.length) {
          prod.searchTags = Array.from(new Set([...(prod.searchTags || []), ...params.addSearchTags]));
        }
        if (params.removeSearchTags?.length) {
          prod.searchTags = (prod.searchTags || []).filter((t) => !params.removeSearchTags!.includes(t));
        }
        affected++;
      }
    }
  }

  invalidateProductCache();
  return { success: true, affectedCount: affected };
}

/**
 * Duplicate Product Detection: Finds potential duplicate records among ACTIVE products.
 * Automatically excludes already soft-archived / merged records.
 */
export async function getDuplicateProducts(existingProducts?: ProductItem[]): Promise<
  Array<{
    reason: "Exact Barcode" | "Brand and Product Name Match";
    key: string;
    products: ProductItem[];
  }>
> {
  let allProducts: ProductItem[];
  if (existingProducts) {
    allProducts = existingProducts.filter((p) => p.isArchived !== true);
  } else {
    const col = await getCollection<ProductItem>("products");
    allProducts = col
      ? (
          await col
            .find({ isArchived: { $ne: true } })
            .project({
              barcode: 1,
              name: 1,
              brand: 1,
              _id: 1,
              id: 1,
              overallScore: 1,
              nutriScore: 1,
              imageUrl: 1,
              imageStatus: 1,
              verified: 1,
              dataCompleteness: 1,
              ingredientsText: 1,
              isArchived: 1,
            })
            .toArray()
        ).map((d) => normalizeDoc(d as unknown as ProductItem))
      : inMemoryProducts.filter((p) => p.isArchived !== true);
  }

  const barcodeMap = new Map<string, ProductItem[]>();
  const nameMap = new Map<string, ProductItem[]>();

  for (const p of allProducts) {
    if (p.barcode) {
      if (!barcodeMap.has(p.barcode)) barcodeMap.set(p.barcode, []);
      barcodeMap.get(p.barcode)!.push(p);
    }
    const normKey = `${p.brand?.toLowerCase().trim()}::${p.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()}`;
    if (!nameMap.has(normKey)) nameMap.set(normKey, []);
    nameMap.get(normKey)!.push(p);
  }

  const duplicates: Array<{
    reason: "Exact Barcode" | "Brand and Product Name Match";
    key: string;
    products: ProductItem[];
  }> = [];

  for (const [barcode, group] of barcodeMap.entries()) {
    if (group.length > 1) {
      duplicates.push({
        reason: "Exact Barcode",
        key: barcode,
        products: group,
      });
    }
  }

  for (const [normKey, group] of nameMap.entries()) {
    if (group.length > 1 && !duplicates.some((d) => d.key === group[0].barcode)) {
      duplicates.push({
        reason: "Brand and Product Name Match",
        key: normKey,
        products: group,
      });
    }
  }

  return duplicates;
}

/**
 * Deterministic primary target scorer for duplicate merge resolution.
 * Prefers records with verified images, real images, barcode, higher score, and richer metadata.
 */
export function pickBestPrimaryProduct(products: ProductItem[]): ProductItem {
  const rankProduct = (p: ProductItem): number => {
    let rank = 0;
    if (p.verified) rank += 35;
    if (p.imageStatus === "VERIFIED" || p.imageStatus === "IMAGE_VERIFIED" || p.imageStatus === "FULLY_VERIFIED") {
      rank += 30;
    }
    if (p.imageUrl && !p.imageUrl.includes("placeholder")) rank += 50;
    if (p.barcode) rank += 20;
    rank += (p.overallScore ?? 0) / 10;
    rank += (p.dataCompleteness ?? 0) / 10;
    if (p.ingredientsText) rank += Math.min(20, p.ingredientsText.length / 20);
    return rank;
  };

  return [...products].sort((a, b) => rankProduct(b) - rankProduct(a))[0];
}

/**
 * Controlled Product Merge: Merges source product into target product
 */
export async function mergeProducts(
  targetId: string,
  sourceId: string,
  performedBy: string = "Admin"
): Promise<{ success: boolean; target?: ProductItem; error?: string }> {
  if (targetId === sourceId) {
    return { success: false, error: "Cannot merge a product into itself" };
  }

  const target = await getProductById(targetId);
  const source = await getProductById(sourceId);

  if (!target || !source) {
    return { success: false, error: "One or both products not found" };
  }

  // Preserve target, backfill any empty fields from source
  const mergedData: Partial<ProductItem> = {
    barcode: target.barcode || source.barcode,
    flavour: target.flavour || source.flavour,
    productType: target.productType || source.productType,
    packageSize: target.packageSize || source.packageSize,
    packageUnit: target.packageUnit || source.packageUnit,
    manufacturer: target.manufacturer || source.manufacturer,
    countryOfOrigin: target.countryOfOrigin || source.countryOfOrigin,
    ingredientsText: target.ingredientsText || source.ingredientsText,
    ingredientsList:
      target.ingredientsList && target.ingredientsList.length > 0
        ? target.ingredientsList
        : source.ingredientsList,
    searchTags: Array.from(new Set([...(target.searchTags || []), ...(source.searchTags || [])])),
    imageUrl:
      target.imageUrl && !target.imageUrl.includes("placeholder")
        ? target.imageUrl
        : source.imageUrl || target.imageUrl,
    imageStatus:
      target.imageStatus === "VERIFIED" || target.imageStatus === "FULLY_VERIFIED"
        ? target.imageStatus
        : source.imageStatus || target.imageStatus,
    imageSourceUrl: target.imageSourceUrl || source.imageSourceUrl,
    imageVerificationNote: target.imageVerificationNote || source.imageVerificationNote,
  };

  const now = new Date().toISOString();
  const auditEntry = {
    action: "MERGE_PRODUCT",
    timestamp: now,
    performedBy,
    details: `Merged data from duplicate product "${source.name}" (${source._id}) into primary record.`,
  };

  const col = await getCollection<ProductItem>("products");
  if (col) {
    const targetQuery = buildExactRecordFilter(target._id || targetId);
    await col.updateOne(targetQuery, {
      $set: { ...mergedData, updatedAt: now },
      $push: { auditHistory: auditEntry as any },
    });

    // Soft-archive the source record with a pointer (handles both ObjectId and string _id)
    const sourceQuery = buildExactRecordFilter(source._id || sourceId);
    await col.updateOne(sourceQuery, {
      $set: {
        isArchived: true,
        archivedAt: now,
        description: `[MERGED into ${target._id}] ${source.description || ""}`,
        updatedAt: now,
      },
      $push: {
        auditHistory: {
          action: "MERGED_OUT",
          timestamp: now,
          performedBy,
          details: `Archived as duplicate merged into ${target._id}`,
        } as any,
      },
    });

    const updatedTarget = await col.findOne(targetQuery);
    invalidateProductCache();
    return { success: true, target: updatedTarget ? normalizeDoc(updatedTarget) : undefined };
  }

  // Update in-memory catalog in fallback/test mode
  const targetIdx = inMemoryProducts.findIndex((p) => p._id === target._id || p.id === target.id);
  const sourceIdx = inMemoryProducts.findIndex((p) => p._id === source._id || p.id === source.id);
  const updatedTarget: ProductItem = { ...target, ...mergedData, updatedAt: now };
  if (targetIdx !== -1) {
    inMemoryProducts[targetIdx] = updatedTarget;
  }
  if (sourceIdx !== -1) {
    inMemoryProducts[sourceIdx] = {
      ...inMemoryProducts[sourceIdx],
      isArchived: true,
      archivedAt: now,
      updatedAt: now,
    };
  }

  invalidateProductCache();
  return { success: true, target: updatedTarget };
}

/**
 * Batch Compare & Merge All Duplicate Groups safely.
 * Automatically picks the highest-completeness primary target per group and archives duplicate sources.
 */
export async function mergeAllDuplicateProducts(performedBy: string = "Admin"): Promise<{
  mergedGroupsCount: number;
  mergedSourcesCount: number;
  errors: string[];
}> {
  const duplicates = await getDuplicateProducts();
  let mergedGroupsCount = 0;
  let mergedSourcesCount = 0;
  const errors: string[] = [];

  const col = await getCollection<ProductItem>("products");
  if (col && duplicates.length > 0) {
    const allIds = new Set<string>();
    for (const group of duplicates) {
      for (const p of group.products) {
        const pid = p._id || p.id;
        if (pid) allIds.add(pid);
      }
    }

    const idOrClauses: Record<string, unknown>[] = [
      { _id: { $in: Array.from(allIds) } },
      { id: { $in: Array.from(allIds) } },
    ];
    const objectIds = Array.from(allIds)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    if (objectIds.length > 0) {
      idOrClauses.push({ _id: { $in: objectIds } });
    }

    const fullDocsRaw = await col.find({ $or: idOrClauses } as unknown as Filter<ProductItem>).toArray();
    const docById = new Map<string, ProductItem>();
    for (const d of fullDocsRaw) {
      const normalized = normalizeDoc(d as unknown as ProductItem);
      if (normalized._id) docById.set(normalized._id, normalized);
      if (normalized.id) docById.set(normalized.id, normalized);
    }

    const bulkOps: AnyBulkWriteOperation<ProductItem>[] = [];
    const now = new Date().toISOString();

    for (const group of duplicates) {
      if (!group.products || group.products.length < 2) continue;
      const hydrated = group.products
        .map((p) => docById.get(p._id || p.id || "") || p)
        .filter((p) => p.isArchived !== true);

      if (hydrated.length < 2) continue;

      const primary = pickBestPrimaryProduct(hydrated);
      const primaryId = primary._id || primary.id;
      if (!primaryId) continue;

      let currentMerged: ProductItem = { ...primary };
      let groupArchivedCount = 0;

      for (const candidate of hydrated) {
        const candidateId = candidate._id || candidate.id;
        if (!candidateId || candidateId === primaryId) continue;

        currentMerged = {
          ...currentMerged,
          barcode: currentMerged.barcode || candidate.barcode,
          flavour: currentMerged.flavour || candidate.flavour,
          productType: currentMerged.productType || candidate.productType,
          packageSize: currentMerged.packageSize || candidate.packageSize,
          packageUnit: currentMerged.packageUnit || candidate.packageUnit,
          manufacturer: currentMerged.manufacturer || candidate.manufacturer,
          countryOfOrigin: currentMerged.countryOfOrigin || candidate.countryOfOrigin,
          ingredientsText: currentMerged.ingredientsText || candidate.ingredientsText,
          ingredientsList:
            currentMerged.ingredientsList && currentMerged.ingredientsList.length > 0
              ? currentMerged.ingredientsList
              : candidate.ingredientsList,
          searchTags: Array.from(
            new Set([...(currentMerged.searchTags || []), ...(candidate.searchTags || [])])
          ),
          imageUrl:
            currentMerged.imageUrl && !currentMerged.imageUrl.includes("placeholder")
              ? currentMerged.imageUrl
              : candidate.imageUrl || currentMerged.imageUrl,
          imageStatus:
            currentMerged.imageStatus === "VERIFIED" ||
            currentMerged.imageStatus === "FULLY_VERIFIED"
              ? currentMerged.imageStatus
              : candidate.imageStatus || currentMerged.imageStatus,
          imageSourceUrl: currentMerged.imageSourceUrl || candidate.imageSourceUrl,
          imageVerificationNote:
            currentMerged.imageVerificationNote || candidate.imageVerificationNote,
        };

        bulkOps.push({
          updateOne: {
            filter: buildExactRecordFilter(candidateId),
            update: {
              $set: {
                isArchived: true,
                archivedAt: now,
                description: `[MERGED into ${primaryId}] ${candidate.description || ""}`,
                updatedAt: now,
              },
              $push: {
                auditHistory: {
                  action: "MERGED_OUT",
                  timestamp: now,
                  performedBy,
                  details: `Archived as duplicate merged into ${primaryId}`,
                } as any,
              },
            },
          },
        });
        groupArchivedCount++;
      }

      if (groupArchivedCount > 0) {
        bulkOps.push({
          updateOne: {
            filter: buildExactRecordFilter(primaryId),
            update: {
              $set: {
                barcode: currentMerged.barcode,
                flavour: currentMerged.flavour,
                productType: currentMerged.productType,
                packageSize: currentMerged.packageSize,
                packageUnit: currentMerged.packageUnit,
                manufacturer: currentMerged.manufacturer,
                countryOfOrigin: currentMerged.countryOfOrigin,
                ingredientsText: currentMerged.ingredientsText,
                ingredientsList: currentMerged.ingredientsList,
                searchTags: currentMerged.searchTags,
                imageUrl: currentMerged.imageUrl,
                imageStatus: currentMerged.imageStatus,
                imageSourceUrl: currentMerged.imageSourceUrl,
                imageVerificationNote: currentMerged.imageVerificationNote,
                updatedAt: now,
              },
              $push: {
                auditHistory: {
                  action: "MERGE_PRODUCT",
                  timestamp: now,
                  performedBy,
                  details: `Batch merged ${groupArchivedCount} duplicate record(s) into primary record.`,
                } as any,
              },
            },
          },
        });
        mergedGroupsCount++;
        mergedSourcesCount += groupArchivedCount;
      }
    }

    if (bulkOps.length > 0) {
      await col.bulkWrite(bulkOps, { ordered: false });
    }

    invalidateProductCache();
    return { mergedGroupsCount, mergedSourcesCount, errors };
  }

  for (const group of duplicates) {
    if (!group.products || group.products.length < 2) continue;
    const primary = pickBestPrimaryProduct(group.products);
    const primaryId = primary._id || primary.id;
    if (!primaryId) continue;

    let groupMergedAny = false;
    for (const candidate of group.products) {
      const candidateId = candidate._id || candidate.id;
      if (!candidateId || candidateId === primaryId) continue;

      const res = await mergeProducts(primaryId, candidateId, performedBy);
      if (res.success) {
        mergedSourcesCount++;
        groupMergedAny = true;
      } else if (res.error) {
        errors.push(`${group.key}: ${res.error}`);
      }
    }
    if (groupMergedAny) {
      mergedGroupsCount++;
    }
  }

  invalidateProductCache();
  return { mergedGroupsCount, mergedSourcesCount, errors };
}

/**
 * Catalogue Management Real-time Statistics
 */
export async function getCatalogManagementStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  archivedProducts: number;
  missingImages: number;
  unverifiedImages: number;
  verifiedImages: number;
  incompleteProducts: number;
  potentialDuplicates: number;
  categoryBreakdown: Array<{ name: string; count: number }>;
  subCategoryBreakdown: Array<{ name: string; category: string; count: number }>;
  brandBreakdown: Array<{ name: string; count: number }>;
}> {
  const col = await getCollection<ProductItem>("products");
  const all: ProductItem[] = col
    ? (await col.find({}).project({
      _id: 1, barcode: 1, name: 1, brand: 1, category: 1, subCategory: 1,
      isArchived: 1, imageUrl: 1, imageStatus: 1, dataCompleteness: 1, ingredientsText: 1
    }).toArray()).map((d) => normalizeDoc(d as unknown as ProductItem))
    : [...inMemoryProducts];

  const totalProducts = all.length;
  const activeProducts = all.filter((p) => p.isArchived !== true).length;
  const archivedProducts = all.filter((p) => p.isArchived === true).length;
  const missingImages = all.filter(
    (p) => !p.imageUrl || p.imageUrl.includes("placeholder") || p.imageStatus === "MISSING"
  ).length;
  const verifiedImages = all.filter(
    (p) => p.imageStatus === "VERIFIED" && p.imageUrl && !p.imageUrl.includes("placeholder")
  ).length;
  const unverifiedImages = totalProducts - verifiedImages - missingImages;
  const incompleteProducts = all.filter(
    (p) => (p.dataCompleteness ?? 100) < 60 || !p.barcode || !p.ingredientsText
  ).length;

  const duplicates = await getDuplicateProducts(all);
  const potentialDuplicates = duplicates.reduce((acc, d) => acc + d.products.length, 0);

  // Group by category
  const catMap = new Map<string, number>();
  const subCatMap = new Map<string, { category: string; count: number }>();
  const brandMap = new Map<string, number>();

  for (const p of all) {
    const cat = p.category || "Uncategorized";
    catMap.set(cat, (catMap.get(cat) || 0) + 1);

    const sub = p.subCategory || "None";
    const subKey = `${cat}::${sub}`;
    if (!subCatMap.has(subKey)) subCatMap.set(subKey, { category: cat, count: 0 });
    subCatMap.get(subKey)!.count += 1;

    const brand = p.brand || "Independent";
    brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
  }

  const categoryBreakdown = Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const subCategoryBreakdown = Array.from(subCatMap.entries())
    .map(([key, val]) => ({ name: key.split("::")[1], category: val.category, count: val.count }))
    .sort((a, b) => b.count - a.count);

  const brandBreakdown = Array.from(brandMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalProducts,
    activeProducts,
    archivedProducts,
    missingImages,
    unverifiedImages,
    verifiedImages,
    incompleteProducts,
    potentialDuplicates,
    categoryBreakdown,
    subCategoryBreakdown,
    brandBreakdown,
  };
}

/**
 * Seed all sample items into MongoDB collection if empty
 */
export async function seedDatabaseIfEmpty(): Promise<{
  insertedCount: number;
  message: string;
}> {
  const col = await getCollection<ProductItem>("products");
  if (!col) {
    return {
      insertedCount: 0,
      message: "MongoDB not connected. Operating in memory demo mode.",
    };
  }

  const count = await col.countDocuments();
  if (count > 0) {
    return {
      insertedCount: 0,
      message: `Database already contains ${count} products. Skipping initial seed.`,
    };
  }

  const seed = generateSeedProducts();
  const docsToInsert = seed.map((p) => {
    const { _id, id, ...rest } = p;
    return rest;
  });

  const res = await col.insertMany(docsToInsert as any);
  return {
    insertedCount: res.insertedCount,
    message: `Successfully seeded ${res.insertedCount} verified products into MongoDB Atlas!`,
  };
}
