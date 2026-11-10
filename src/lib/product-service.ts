import { ObjectId, Filter } from "mongodb";
import { getCollection, isMongoConfigured } from "./mongodb";
import { ProductItem, CategoryRecord, BrandRecord, AnalysisRule, ProductSubmission } from "@/types";
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

function getInMemoryProducts(): ProductItem[] {
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

    // Category filter: strictly enforce taxonomy
    if (params.category && params.category !== "All") {
      const catLower = params.category.toLowerCase();
      const slugToNameMap: Record<string, string> = {
        "chocolates-sweets": "Chocolates & Sweets",
        "chocolates & sweets": "Chocolates & Sweets",
        "beverages": "Beverages & Drinks",
        "beverages & drinks": "Beverages & Drinks",
        "ready-to-eat-ready-to-cook": "Ready-to-Eat & Ready-to-Cook",
        "ready-to-eat & ready-to-cook": "Ready-to-Eat & Ready-to-Cook",
        "protein-foods-snacks": "Protein Foods & Snacks",
        "protein foods & snacks": "Protein Foods & Snacks",
        "plant-based-foods": "Plant-Based Foods",
        "plant-based foods": "Plant-Based Foods",
        "bakery-breads": "Bakery & Breads",
        "bakery & breads": "Bakery & Breads",
        "spreads-dips-sauces": "Spreads, Dips & Sauces",
        "spreads, dips & sauces": "Spreads, Dips & Sauces",
        "ice-cream": "Ice Cream",
        "ice cream": "Ice Cream",
        "cereals-breakfast": "Cereals & Breakfast",
        "cereals & breakfast": "Cereals & Breakfast",
        "dairy-alternatives": "Dairy & Yogurt",
        "dairy & yogurt": "Dairy & Yogurt",
        "pantry-staples": "Pantry & Grains",
        "pantry & grains": "Pantry & Grains",
        "condiments-sauces": "Condiments & Sauces",
        "condiments & sauces": "Condiments & Sauces",
        "snacks-sweets": "Snacks & Spreads",
        "snacks & spreads": "Snacks & Spreads",
      };

      if (catLower === "cold-drinks" || catLower === "cold drinks") {
        filter.$or = [
          { category: "Cold Drinks" },
          { categorySlug: "cold-drinks" },
          { subCategory: "Cold Drinks" },
        ] as any;
      } else if (slugToNameMap[catLower]) {
        filter.category = slugToNameMap[catLower];
      } else {
        filter.category = params.category;
      }
    }

    // Subcategory filter: strictly enforce taxonomy
    if (params.subCategory && params.subCategory !== "All") {
      if (params.subCategory.toLowerCase() === "chips") {
        filter.subCategory = { $in: ["Chips", "Chips & Crisps"] } as any;
      } else if (params.subCategory.toLowerCase() === "cold-drinks" || params.subCategory.toLowerCase() === "cold drinks") {
        filter.$or = [
          { subCategory: "Cold Drinks" },
          { categorySlug: "cold-drinks" },
          { category: "Cold Drinks" },
        ] as any;
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

    // When text query is specified without an explicit sort order, rank by search relevance
    if (params.q && !params.sortBy) {
      const allMatching = await col.find(filter).toArray();
      allMatching.sort(
        (a, b) => computeSearchRelevance(b, params.q!) - computeSearchRelevance(a, params.q!)
      );
      total = allMatching.length;
      docs = allMatching.slice(skip, skip + limit);
    } else {
      total = await col.countDocuments(filter);
      docs = await col.find(filter).sort(sort).skip(skip).limit(limit).toArray();
    }
    const totalPages = Math.ceil(total / limit) || 1;
    const hasMore = page < totalPages;
    const nextCursor = hasMore ? (page + 1).toString() : null;

    return {
      products: docs.map(normalizeDoc),
      total,
      page,
      limit,
      totalPages,
      hasMore,
      nextCursor,
      isDbConnected: true,
    };
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
    const catLower = params.category.toLowerCase();
    const slugToNameMap: Record<string, string> = {
      "chocolates-sweets": "Chocolates & Sweets",
      "chocolates & sweets": "Chocolates & Sweets",
      "beverages": "Beverages & Drinks",
      "beverages & drinks": "Beverages & Drinks",
      "ready-to-eat-ready-to-cook": "Ready-to-Eat & Ready-to-Cook",
      "ready-to-eat & ready-to-cook": "Ready-to-Eat & Ready-to-Cook",
      "protein-foods-snacks": "Protein Foods & Snacks",
      "protein foods & snacks": "Protein Foods & Snacks",
      "plant-based-foods": "Plant-Based Foods",
      "plant-based foods": "Plant-Based Foods",
      "bakery-breads": "Bakery & Breads",
      "bakery & breads": "Bakery & Breads",
      "spreads-dips-sauces": "Spreads, Dips & Sauces",
      "spreads, dips & sauces": "Spreads, Dips & Sauces",
      "ice-cream": "Ice Cream",
      "ice cream": "Ice Cream",
      "cereals-breakfast": "Cereals & Breakfast",
      "cereals & breakfast": "Cereals & Breakfast",
      "dairy-alternatives": "Dairy & Yogurt",
      "dairy & yogurt": "Dairy & Yogurt",
      "pantry-staples": "Pantry & Grains",
      "pantry & grains": "Pantry & Grains",
      "condiments-sauces": "Condiments & Sauces",
      "condiments & sauces": "Condiments & Sauces",
      "snacks-sweets": "Snacks & Spreads",
      "snacks & spreads": "Snacks & Spreads",
    };

    if (catLower === "cold-drinks" || catLower === "cold drinks") {
      filtered = filtered.filter(
        (p) => p.subCategory === "Cold Drinks" || (p as any).categorySlug === "cold-drinks"
      );
    } else if (slugToNameMap[catLower]) {
      const targetName = slugToNameMap[catLower];
      filtered = filtered.filter(
        (p) => p.category === targetName || (p as any).categorySlug === catLower
      );
    } else {
      filtered = filtered.filter(
        (p) => p.category === params.category || (p as any).categorySlug === params.category
      );
    }
  }

  if (params.subCategory && params.subCategory !== "All") {
    if (params.subCategory.toLowerCase() === "chips") {
      filtered = filtered.filter(
        (p) => p.subCategory === "Chips" || p.subCategory === "Chips & Crisps"
      );
    } else if (params.subCategory.toLowerCase() === "cold-drinks" || params.subCategory.toLowerCase() === "cold drinks") {
      filtered = filtered.filter(
        (p) => p.subCategory === "Cold Drinks" || (p as any).categorySlug === "cold-drinks"
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

  return {
    products: paged,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    nextCursor,
    isDbConnected: false,
  };
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
  return (
    getInMemoryProducts().find(
      (p) => p.id === id || p._id === id || p.barcode === id || p.barcode === cleanId
    ) || null
  );
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
    const id = res.upsertedId ? res.upsertedId.toString() : input._id || input.id;
    return { ...productData, _id: id, id };
  }

  // In-memory fallback
  const idx = inMemoryProducts.findIndex((p) => p.barcode === productData.barcode);
  if (idx >= 0) {
    inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...productData };
    return inMemoryProducts[idx];
  } else {
    productData._id = `prod_${Date.now()}`;
    productData.id = productData._id;
    inMemoryProducts.unshift(productData);
    return productData;
  }
}

/**
 * Delete a product by ID or barcode
 */
export async function deleteProduct(id: string): Promise<boolean> {
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
 * Archive product (soft-delete): removes from public directory, preserves document
 */
export async function archiveProduct(id: string, performedBy: string = "Admin"): Promise<boolean> {
  const col = await getCollection<ProductItem>("products");
  const now = new Date().toISOString();
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { $or: [{ barcode: id }, { id }] };

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
    return true;
  }
  const item = inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);
  if (item) {
    item.isArchived = true;
    item.archivedAt = now;
    item.updatedAt = now;
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
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { $or: [{ barcode: id }, { id }] };

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
    return true;
  }
  const item = inMemoryProducts.find((p) => p._id === id || p.id === id || p.barcode === id);
  if (item) {
    item.isArchived = false;
    item.archivedAt = undefined;
    item.updatedAt = now;
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
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { $or: [{ barcode: id }, { id }] };

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
    const updated = await col.findOne(query);
    return { success: true, product: updated ? normalizeDoc(updated) : undefined };
  }

  Object.assign(current, updateSet);
  if (!current.auditHistory) current.auditHistory = [];
  current.auditHistory.push(auditEntry);
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

  return { success: true, affectedCount: affected };
}

/**
 * Duplicate Product Detection: Finds potential duplicate records
 */
export async function getDuplicateProducts(): Promise<
  Array<{
    reason: "Exact Barcode" | "Brand and Product Name Match";
    key: string;
    products: ProductItem[];
  }>
> {
  const col = await getCollection<ProductItem>("products");
  const allProducts: ProductItem[] = col
    ? (await col.find({}).toArray()).map(normalizeDoc)
    : [...inMemoryProducts];

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
    flavour: target.flavour || source.flavour,
    productType: target.productType || source.productType,
    packageSize: target.packageSize || source.packageSize,
    packageUnit: target.packageUnit || source.packageUnit,
    manufacturer: target.manufacturer || source.manufacturer,
    countryOfOrigin: target.countryOfOrigin || source.countryOfOrigin,
    searchTags: Array.from(new Set([...(target.searchTags || []), ...(source.searchTags || [])])),
    imageUrl:
      target.imageUrl && !target.imageUrl.includes("placeholder")
        ? target.imageUrl
        : source.imageUrl || target.imageUrl,
    imageStatus:
      target.imageStatus === "VERIFIED"
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
    const targetQuery = ObjectId.isValid(target._id!) ? { _id: new ObjectId(target._id) as any } : { id: target._id };
    await col.updateOne(targetQuery, {
      $set: { ...mergedData, updatedAt: now },
      $push: { auditHistory: auditEntry as any },
    });

    // Soft-archive the source record with a pointer
    const sourceQuery = ObjectId.isValid(source._id!) ? { _id: new ObjectId(source._id) as any } : { id: source._id };
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
    return { success: true, target: updatedTarget ? normalizeDoc(updatedTarget) : undefined };
  }

  return { success: true, target: { ...target, ...mergedData } };
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
    ? (await col.find({}).toArray()).map(normalizeDoc)
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

  const duplicates = await getDuplicateProducts();
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
