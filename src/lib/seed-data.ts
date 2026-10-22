import {
  ProductItem,
  CategoryRecord,
  BrandRecord,
  AnalysisRule,
  ProductSubmission,
} from "@/types";
import { analyzeIngredientsText } from "./ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness,
} from "./scoring-engine";

export const SEED_CATEGORIES: CategoryRecord[] = [
  {
    slug: "cereals-breakfast",
    name: "Cereals & Breakfast",
    icon: "🥣",
    description: "Granolas, rolled oats, flakes, and breakfast mixes.",
  },
  {
    slug: "beverages",
    name: "Beverages & Drinks",
    icon: "🥤",
    description: "Plant milks, sparkling waters, sodas, juices, and teas.",
  },
  {
    slug: "snacks-sweets",
    name: "Snacks & Spreads",
    icon: "🍫",
    description: "Nut butters, chocolate spreads, chips, and crackers.",
  },
  {
    slug: "dairy-alternatives",
    name: "Dairy & Yogurt",
    icon: "🥛",
    description: "Greek yogurts, plant yogurts, cheeses, and butter alternatives.",
  },
  {
    slug: "pantry-staples",
    name: "Pantry & Grains",
    icon: "🌾",
    description: "Pasta, pulses, canned soups, grains, and olive oils.",
  },
  {
    slug: "condiments-sauces",
    name: "Condiments & Sauces",
    icon: "🥫",
    description: "Salad dressings, tomato sauces, and culinary flavorings.",
  },
];

export const SEED_BRANDS: BrandRecord[] = [
  { slug: "general-mills", name: "General Mills", country: "United States" },
  { slug: "kelloggs", name: "Kellogg's", country: "United States" },
  { slug: "oatly", name: "Oatly", country: "Sweden" },
  { slug: "coca-cola", name: "The Coca-Cola Company", country: "United States" },
  { slug: "ferrero", name: "Ferrero", country: "Italy" },
  { slug: "justins", name: "Justin's", country: "United States" },
  { slug: "frito-lay", name: "Frito-Lay", country: "United States" },
  { slug: "chobani", name: "Chobani", country: "United States" },
  { slug: "silk", name: "Silk", country: "United States" },
  { slug: "amys-kitchen", name: "Amy's Kitchen", country: "United States" },
  { slug: "barilla", name: "Barilla", country: "Italy" },
];

export const SEED_RULES: AnalysisRule[] = [
  {
    version: 1,
    name: "Standard Global Health Scoring v1.0",
    category: "general",
    rules: {
      sugarWeight: 1.2,
      satFatWeight: 1.5,
      sodiumWeight: 1.0,
      additiveWeight: 2.0,
      fiberBonus: 1.5,
      proteinBonus: 1.2,
      novaPenalties: {
        1: 5,
        2: 0,
        3: -8,
        4: -20,
      },
    },
    isActive: true,
    updatedAt: "2026-10-20T00:00:00.000Z",
  },
];

interface RawSeedProductInput {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  servingSize: string;
  imageUrl: string;
  ingredientsText: string;
  nutritionPer100g: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat?: number;
    carbohydrates: number;
    sugars: number;
    addedSugars?: number;
    fiber: number;
    protein: number;
    sodium: number;
    salt: number;
  };
  verified?: boolean;
}

const RAW_PRODUCTS: RawSeedProductInput[] = [
  {
    barcode: "016000275270",
    name: "Cheerios Whole Grain Oat Cereal",
    brand: "General Mills",
    category: "Cereals & Breakfast",
    subCategory: "Cold Cereals",
    servingSize: "28g (1 cup)",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Whole Grain Oats, Corn Starch, Sugar, Salt, Tripotassium Phosphate, Vitamin E (mixed tocopherols) added to preserve freshness.",
    nutritionPer100g: {
      calories: 357,
      totalFat: 5.4,
      saturatedFat: 0.9,
      carbohydrates: 71.4,
      sugars: 3.6,
      addedSugars: 3.6,
      fiber: 10.7,
      protein: 10.7,
      sodium: 500,
      salt: 1.25,
    },
    verified: true,
  },
  {
    barcode: "038000391187",
    name: "Froot Loops Marshmallows Cereal",
    brand: "Kellogg's",
    category: "Cereals & Breakfast",
    subCategory: "Kids Cereals",
    servingSize: "39g (1 cup)",
    imageUrl: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Corn Flour Blend (Whole Grain Yellow Corn Flour, Degerminated Yellow Corn Flour), Sugar, Wheat Flour, Whole Grain Oat Flour, Modified Food Starch, Contains 2% or less of Hydrogenated Coconut and Soybean Oil, Oat Fiber, Salt, Soluble Corn Fiber, Natural Flavor, Red 40, Turmeric Color, Yellow 5, Blue 1, Yellow 6, BHT for freshness.",
    nutritionPer100g: {
      calories: 385,
      totalFat: 3.8,
      saturatedFat: 1.3,
      transFat: 0.2,
      carbohydrates: 87.2,
      sugars: 38.5,
      addedSugars: 38.5,
      fiber: 5.1,
      protein: 5.1,
      sodium: 538,
      salt: 1.35,
    },
    verified: true,
  },
  {
    barcode: "7394376616532",
    name: "Barista Edition Oat Milk",
    brand: "Oatly",
    category: "Beverages & Drinks",
    subCategory: "Plant-Based Milk",
    servingSize: "240ml (1 cup)",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Oat base (water, oats 10%), rapeseed oil, dipotassium phosphate, calcium carbonate, calcium phosphates, iodised salt, vitamins (D2, riboflavin, B12).",
    nutritionPer100g: {
      calories: 59,
      totalFat: 3.0,
      saturatedFat: 0.3,
      carbohydrates: 6.6,
      sugars: 4.0,
      addedSugars: 0,
      fiber: 0.8,
      protein: 1.0,
      sodium: 40,
      salt: 0.1,
    },
    verified: true,
  },
  {
    barcode: "049000028904",
    name: "Coca-Cola Classic Original Taste",
    brand: "The Coca-Cola Company",
    category: "Beverages & Drinks",
    subCategory: "Carbonated Soft Drinks",
    servingSize: "355ml (1 can)",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Carbonated Water, High Fructose Corn Syrup, Caramel Color (E150d), Phosphoric Acid, Natural Flavors, Caffeine.",
    nutritionPer100g: {
      calories: 42,
      totalFat: 0.0,
      saturatedFat: 0.0,
      carbohydrates: 10.6,
      sugars: 10.6,
      addedSugars: 10.6,
      fiber: 0.0,
      protein: 0.0,
      sodium: 13,
      salt: 0.03,
    },
    verified: true,
  },
  {
    barcode: "8000500179864",
    name: "Nutella Hazelnut Spread with Cocoa",
    brand: "Ferrero",
    category: "Snacks & Spreads",
    subCategory: "Sweet Spreads",
    servingSize: "37g (2 tbsp)",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Sugar, Palm Oil, Hazelnuts (13%), Skimmed Milk Powder (8.7%), Fat-Reduced Cocoa (7.4%), Emulsifier: Lecithins (Soya), Vanillin.",
    nutritionPer100g: {
      calories: 539,
      totalFat: 30.9,
      saturatedFat: 10.6,
      carbohydrates: 57.5,
      sugars: 56.3,
      addedSugars: 48.0,
      fiber: 3.4,
      protein: 6.3,
      sodium: 42,
      salt: 0.11,
    },
    verified: true,
  },
  {
    barcode: "858882001007",
    name: "Classic Natural Peanut Butter",
    brand: "Justin's",
    category: "Snacks & Spreads",
    subCategory: "Nut Butters",
    servingSize: "32g (2 tbsp)",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Dry Roasted Peanuts, Palm Oil.",
    nutritionPer100g: {
      calories: 594,
      totalFat: 50.0,
      saturatedFat: 9.4,
      carbohydrates: 21.9,
      sugars: 3.1,
      addedSugars: 0.0,
      fiber: 6.3,
      protein: 25.0,
      sodium: 0,
      salt: 0.0,
    },
    verified: true,
  },
  {
    barcode: "028400043809",
    name: "Doritos Nacho Cheese Flavored Tortilla Chips",
    brand: "Frito-Lay",
    category: "Snacks & Spreads",
    subCategory: "Chips & Crisps",
    servingSize: "28g (1 oz)",
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Corn, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Maltodextrin (Made from Corn), Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate, Buttermilk, Romano Cheese, Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Artificial Color (Yellow 6, Yellow 5, Red 40), Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk, Red and Green Bell Pepper Powder, Disodium Inosinate, Disodium Guanylate.",
    nutritionPer100g: {
      calories: 536,
      totalFat: 28.6,
      saturatedFat: 3.6,
      carbohydrates: 64.3,
      sugars: 3.6,
      addedSugars: 1.5,
      fiber: 3.6,
      protein: 7.1,
      sodium: 750,
      salt: 1.88,
    },
    verified: true,
  },
  {
    barcode: "894700010045",
    name: "Non-Fat Plain Greek Yogurt",
    brand: "Chobani",
    category: "Dairy & Yogurt",
    subCategory: "Yogurt",
    servingSize: "170g (3/4 cup)",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Cultured Nonfat Milk. Contains 6 Live and Active Cultures: S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei, and L. Rhamnosus.",
    nutritionPer100g: {
      calories: 59,
      totalFat: 0.0,
      saturatedFat: 0.0,
      carbohydrates: 3.5,
      sugars: 3.5,
      addedSugars: 0.0,
      fiber: 0.0,
      protein: 10.6,
      sodium: 38,
      salt: 0.09,
    },
    verified: true,
  },
  {
    barcode: "025293600270",
    name: "Organic Unsweetened Soymilk",
    brand: "Silk",
    category: "Beverages & Drinks",
    subCategory: "Plant-Based Milk",
    servingSize: "240ml (1 cup)",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Soymilk (Filtered Water, Organic Soybeans), Vitamin and Mineral Blend (Calcium Carbonate, Vitamin A Palmitate, Vitamin D2, Vitamin B12), Sea Salt, Gellan Gum, Organic Natural Flavor.",
    nutritionPer100g: {
      calories: 33,
      totalFat: 1.7,
      saturatedFat: 0.2,
      carbohydrates: 1.3,
      sugars: 0.4,
      addedSugars: 0.0,
      fiber: 0.8,
      protein: 2.9,
      sodium: 38,
      salt: 0.09,
    },
    verified: true,
  },
  {
    barcode: "042272005085",
    name: "Organic Lentil Vegetable Soup",
    brand: "Amy's Kitchen",
    category: "Pantry & Grains",
    subCategory: "Canned Soups",
    servingSize: "245g (1 cup)",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Filtered Water, Organic Onions, Organic Green Lentils, Organic Carrots, Organic Celery, Organic Potatoes, Organic Diced Tomatoes, Organic Spinach, Organic Extra Virgin Olive Oil, Sea Salt, Organic Garlic, Organic Spices, Organic Black Pepper.",
    nutritionPer100g: {
      calories: 65,
      totalFat: 1.4,
      saturatedFat: 0.2,
      carbohydrates: 10.2,
      sugars: 1.6,
      addedSugars: 0.0,
      fiber: 2.9,
      protein: 3.3,
      sodium: 278,
      salt: 0.69,
    },
    verified: true,
  },
  {
    barcode: "076808516086",
    name: "Whole Grain Spaghetti Pasta",
    brand: "Barilla",
    category: "Pantry & Grains",
    subCategory: "Pasta",
    servingSize: "56g (2 oz dry)",
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    ingredientsText: "Whole Grain Durum Wheat Flour.",
    nutritionPer100g: {
      calories: 357,
      totalFat: 2.7,
      saturatedFat: 0.4,
      carbohydrates: 73.2,
      sugars: 3.6,
      addedSugars: 0.0,
      fiber: 10.7,
      protein: 14.3,
      sodium: 0,
      salt: 0.0,
    },
    verified: true,
  },
];

/**
 * Generate fully populated ProductItems with scored and analyzed ingredients
 */
export function generateSeedProducts(): ProductItem[] {
  const now = "2026-10-20T12:00:00.000Z";

  return RAW_PRODUCTS.map((raw, idx) => {
    const analysis = analyzeIngredientsText(raw.ingredientsText);
    const nutri = calculateNutriScore(
      raw.nutritionPer100g,
      raw.category.includes("Beverages")
    );
    const nova = determineNovaGroup(analysis.ingredientsList, raw.ingredientsText);
    const overall = calculateOverallScore({
      nutrition: raw.nutritionPer100g,
      ingredients: analysis.ingredientsList,
      nutriScore: nutri.grade,
      novaGroup: nova,
      category: raw.category,
    });
    const completeness = calculateDataCompleteness(
      raw.nutritionPer100g,
      raw.ingredientsText,
      raw.imageUrl
    );

    return {
      _id: `prod_${raw.barcode}`,
      id: `prod_${raw.barcode}`,
      barcode: raw.barcode,
      name: raw.name,
      brand: raw.brand,
      category: raw.category,
      subCategory: raw.subCategory,
      servingSize: raw.servingSize,
      imageUrl: raw.imageUrl,
      ingredientsText: raw.ingredientsText,
      ingredientsList: analysis.ingredientsList,
      nutritionPer100g: raw.nutritionPer100g,
      nutriScore: nutri.grade,
      nutriScoreScore: nutri.score,
      novaGroup: nova,
      overallScore: overall.score,
      scoreLabel: overall.label,
      hasPalmOil: analysis.hasPalmOil,
      hasAddedSugar: analysis.hasAddedSugar,
      hasHighSodium: raw.nutritionPer100g.sodium > 600,
      hasHighSaturatedFat: raw.nutritionPer100g.saturatedFat > 5.0,
      hasArtificialAdditives: analysis.hasArtificialAdditives,
      isUltraProcessed: nova === 4,
      allergens: analysis.allergens,
      ingredientAlerts: analysis.ingredientAlerts,
      dataCompleteness: completeness,
      verified: raw.verified ?? true,
      verificationDate: now,
      verifiedBy: "FoodDecode Nutrition Team",
      source: "manual",
      isSample: false, // Core verified catalogue entries
      createdAt: now,
      updatedAt: now,
    };
  });
}

export const SEED_SUBMISSIONS: ProductSubmission[] = [
  {
    _id: "sub_1",
    barcode: "841000000123",
    name: "Artisan Sourdough Loaf",
    brand: "Local Hearth Bakery",
    category: "Pantry & Grains",
    ingredientsText: "Organic unbleached wheat flour, filtered water, sourdough starter culture, sea salt.",
    nutritionFacts: {
      calories: 220,
      totalFat: 1.0,
      saturatedFat: 0.2,
      carbohydrates: 45,
      sugars: 1,
      fiber: 3,
      protein: 8,
      sodium: 430,
    },
    submittedBy: "Alex Foodie",
    submitterEmail: "alex@example.com",
    status: "pending",
    reviewNotes: "Label photo attached. Appears minimal ingredient sourdough.",
    createdAt: "2026-10-21T09:30:00.000Z",
  },
];
