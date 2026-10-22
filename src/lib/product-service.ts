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

/**
 * Normalizes MongoDB ObjectId to string
 */
function normalizeDoc<T extends { _id?: any; id?: string }>(doc: T): T {
  if (doc._id) {
    doc.id = doc._id.toString();
  }
  return doc;
}

/**
 * Query products with server-side filters, search, pagination, and sorting
 */
export async function queryProducts(params: {
  q?: string;
  category?: string;
  brand?: string;
  nutriScore?: string;
  novaGroup?: number;
  minScore?: number;
  maxScore?: number;
  hasPalmOil?: boolean;
  hasAddedSugar?: boolean;
  lowSodium?: boolean;
  lowSugar?: boolean;
  verifiedOnly?: boolean;
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
  isDbConnected: boolean;
}> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 12));
  const skip = (page - 1) * limit;

  const col = await getCollection<ProductItem>("products");

  if (col) {
    const filter: Filter<ProductItem> = {};

    if (params.q) {
      const regex = new RegExp(params.q.trim(), "i");
      filter.$or = [
        { name: regex } as any,
        { brand: regex } as any,
        { barcode: regex } as any,
        { ingredientsText: regex } as any,
      ];
    }

    if (params.category && params.category !== "All") {
      filter.category = params.category;
    }

    if (params.brand && params.brand !== "All") {
      filter.brand = params.brand;
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

    const total = await col.countDocuments(filter);
    const docs = await col.find(filter).sort(sort).skip(skip).limit(limit).toArray();

    return {
      products: docs.map(normalizeDoc),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      isDbConnected: true,
    };
  }

  // Fallback to in-memory seed products
  let filtered = [...inMemoryProducts];

  if (params.q) {
    const term = params.q.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.barcode.includes(term) ||
        p.ingredientsText.toLowerCase().includes(term)
    );
  }

  if (params.category && params.category !== "All") {
    filtered = filtered.filter((p) => p.category === params.category);
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

  if (params.verifiedOnly) {
    filtered = filtered.filter((p) => p.verified);
  }

  // Sorting
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

  const total = filtered.length;
  const paged = filtered.slice(skip, skip + limit);

  return {
    products: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
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
      doc = await col.findOne({ $or: [{ id }, { barcode: id }, { _id: id as any }] });
    }
    return doc ? normalizeDoc(doc) : null;
  }

  return inMemoryProducts.find((p) => p.id === id || p._id === id || p.barcode === id) || null;
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
    const local = inMemoryProducts.find((p) => p.barcode === clean);
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
    const alternatives = await col
      .find({
        category: product.category,
        barcode: { $ne: product.barcode },
        overallScore: { $gt: product.overallScore },
      })
      .sort({ overallScore: -1 })
      .limit(4)
      .toArray();

    return alternatives.map(normalizeDoc);
  }

  return inMemoryProducts
    .filter(
      (p) =>
        p.category === product.category &&
        p.barcode !== product.barcode &&
        p.overallScore > product.overallScore
    )
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 4);
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
