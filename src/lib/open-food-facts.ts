import { ProductItem } from "@/types";
import { analyzeIngredientsText } from "./ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness,
} from "./scoring-engine";

const OFF_BASE_URL = "https://world.openfoodfacts.org/api/v2/product";
const USER_AGENT =
  process.env.OPEN_FOOD_FACTS_USER_AGENT ||
  "FoodDecode-App/1.0 (https://fooddecode.example.com; contact@fooddecode.example.com)";

interface OpenFoodFactsNutriments {
  "energy-kcal_100g"?: number;
  "energy-kcal"?: number;
  "energy_100g"?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  "trans-fat_100g"?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  "added-sugars_100g"?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  sodium_100g?: number;
  salt_100g?: number;
}

interface OpenFoodFactsResponse {
  status: number;
  status_verbose?: string;
  code?: string;
  product?: {
    code?: string;
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    categories?: string;
    categories_tags?: string[];
    ingredients_text?: string;
    ingredients_text_en?: string;
    image_url?: string;
    image_front_url?: string;
    serving_size?: string;
    nutriscore_grade?: string;
    nutriscore_score?: number;
    nova_group?: number;
    allergens_tags?: string[];
    nutriments?: OpenFoodFactsNutriments;
  };
}

/**
 * Fetch a product by barcode from the Open Food Facts API and normalize it to our ProductItem format
 */
export async function fetchFromOpenFoodFacts(
  barcode: string
): Promise<ProductItem | null> {
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");
  if (!cleanBarcode || cleanBarcode.length < 4) {
    return null;
  }

  const endpoint = `${OFF_BASE_URL}/${encodeURIComponent(cleanBarcode)}.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s serverless timeout safety

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache on edge for 24 hours
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[OpenFoodFacts] Received HTTP ${res.status} for barcode ${cleanBarcode}`);
      return null;
    }

    const data: OpenFoodFactsResponse = await res.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const p = data.product;
    const name =
      p.product_name ||
      p.product_name_en ||
      `Product (${cleanBarcode})`;
    const brand = p.brands?.split(",")[0]?.trim() || "Unknown Brand";
    const category =
      p.categories_tags?.[0]?.replace(/^en:/, "").replace(/-/g, " ") ||
      p.categories?.split(",")[0]?.trim() ||
      "Packaged Foods";

    const ingredientsText =
      p.ingredients_text || p.ingredients_text_en || "Ingredients not listed";

    // Extract nutrition
    const n = p.nutriments || {};
    const calories =
      n["energy-kcal_100g"] ??
      (n.energy_100g ? Math.round(n.energy_100g / 4.184) : 0);
    const totalFat = n.fat_100g ?? 0;
    const saturatedFat = n["saturated-fat_100g"] ?? 0;
    const transFat = n["trans-fat_100g"] ?? 0;
    const carbohydrates = n.carbohydrates_100g ?? 0;
    const sugars = n.sugars_100g ?? 0;
    const addedSugars = n["added-sugars_100g"] ?? 0;
    const fiber = n.fiber_100g ?? 0;
    const protein = n.proteins_100g ?? 0;
    const salt = n.salt_100g ?? 0;
    const sodium =
      n.sodium_100g !== undefined
        ? Math.round(n.sodium_100g * 1000)
        : Math.round((salt / 2.5) * 1000);

    const nutritionPer100g = {
      calories,
      totalFat,
      saturatedFat,
      transFat,
      carbohydrates,
      sugars,
      addedSugars,
      fiber,
      protein,
      sodium,
      salt,
    };

    // Analyze ingredients using our matcher
    const analysis = analyzeIngredientsText(ingredientsText);

    // Nutri-Score
    let nutriScore = (p.nutriscore_grade?.toUpperCase() as any) || null;
    if (!["A", "B", "C", "D", "E"].includes(nutriScore)) {
      nutriScore = calculateNutriScore(nutritionPer100g).grade;
    }

    // Nova Group
    let novaGroup = (p.nova_group as any) || null;
    if (![1, 2, 3, 4].includes(novaGroup)) {
      novaGroup = determineNovaGroup(analysis.ingredientsList, ingredientsText);
    }

    // Overall Score
    const overall = calculateOverallScore({
      nutrition: nutritionPer100g,
      ingredients: analysis.ingredientsList,
      nutriScore,
      novaGroup,
      category,
    });

    const completeness = calculateDataCompleteness(
      nutritionPer100g,
      ingredientsText,
      p.image_url || p.image_front_url
    );

    const now = new Date().toISOString();

    const normalizedProduct: ProductItem = {
      barcode: cleanBarcode,
      name,
      brand,
      category,
      servingSize: p.serving_size || "100g",
      imageUrl: p.image_url || p.image_front_url || "",
      ingredientsText,
      ingredientsList: analysis.ingredientsList,
      nutritionPer100g,
      nutriScore,
      novaGroup,
      overallScore: overall.score,
      scoreLabel: overall.label,
      hasPalmOil: analysis.hasPalmOil,
      hasAddedSugar: analysis.hasAddedSugar,
      hasHighSodium: sodium > 600,
      hasHighSaturatedFat: saturatedFat > 5.0,
      hasArtificialAdditives: analysis.hasArtificialAdditives,
      isUltraProcessed: novaGroup === 4,
      allergens: analysis.allergens,
      ingredientAlerts: analysis.ingredientAlerts,
      dataCompleteness: completeness,
      verified: completeness > 70,
      verificationDate: now,
      verifiedBy: "Open Food Facts API",
      source: "openfoodfacts",
      sourceUrl: `https://world.openfoodfacts.org/product/${cleanBarcode}`,
      createdAt: now,
      updatedAt: now,
    };

    return normalizedProduct;
  } catch (error) {
    console.error(`[OpenFoodFacts] Request error for barcode ${barcode}:`, (error as Error).message);
    return null;
  }
}
