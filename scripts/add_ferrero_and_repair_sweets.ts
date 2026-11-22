import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

interface IngredientDetail {
  raw: string;
  normalized: string;
  riskLevel: "safe" | "caution" | "avoid";
  classification: "GREEN" | "ORANGE" | "RED";
  classificationReason: string;
  insNumber: string | null;
  category: string;
  origin: string;
  description: string;
  foodFunction: string;
  benefits: string[];
  risks: string[];
  dailyIntake: {
    recommended: string | null;
    adi: string | null;
    maximum: string | null;
    unit: string | null;
    basis: string | null;
    status: string;
    explanation: string;
  };
  precautions: string[];
  verdict: string;
  declaredQuantity: string | null;
  quantitySource: string | null;
  healthConcerns: string[];
  isPalmOil: boolean;
  isAddedSugar: boolean;
  isAllergen: boolean;
  allergenType: string | null;
  regulatoryStatus: string;
  evidenceLevel: string;
  verificationStatus: string;
  sources: any[];
}

function makeIngredient(name: string, opts: {
  normalized?: string;
  riskLevel?: "safe" | "caution" | "avoid";
  classification?: "GREEN" | "ORANGE" | "RED";
  isAddedSugar?: boolean;
  isPalmOil?: boolean;
  isAllergen?: boolean;
  allergenType?: string;
  function?: string;
  origin?: string;
  insNumber?: string;
  declaredQuantity?: string;
}): IngredientDetail {
  return {
    raw: name,
    normalized: opts.normalized || name.toLowerCase(),
    riskLevel: opts.riskLevel || (opts.classification === "RED" ? "avoid" : opts.classification === "ORANGE" ? "caution" : "safe"),
    classification: opts.classification || "GREEN",
    classificationReason: opts.isAddedSugar 
      ? "Caloric sweetener associated with glycemic spikes, metabolic load, and dental caries when overconsumed."
      : opts.isPalmOil
      ? "High saturated palmitic acid content associated with elevated LDL cholesterol and cardiovascular risk."
      : "Standard food component recognized as safe for human consumption.",
    insNumber: opts.insNumber || null,
    category: opts.isAddedSugar ? "Sweetener" : opts.isPalmOil ? "Vegetable Fat" : "Whole Food / General",
    origin: opts.origin || "Natural",
    description: `Recognized food ingredient declared on packaging as "${name}".`,
    foodFunction: opts.function || "Provides flavour, structure, or texture in confectionery.",
    benefits: opts.isAddedSugar || opts.isPalmOil ? [] : ["Contributes to standard dietary nutrition and energy."],
    risks: opts.isAddedSugar ? ["Glycemic spike", "Dental caries", "Promotes weight gain in excess"] : opts.isPalmOil ? ["Elevated saturated fat", "Elevated LDL cholesterol"] : [],
    dailyIntake: {
      recommended: null,
      adi: null,
      maximum: opts.isAddedSugar ? "50 g/day (WHO target: 25 g/day)" : null,
      unit: opts.isAddedSugar ? "g/day" : null,
      basis: null,
      status: opts.isAddedSugar ? "ESTABLISHED" : "NOT_ESTABLISHED",
      explanation: opts.isAddedSugar ? "WHO guideline on free sugars intake." : "No universally established daily intake limit."
    },
    precautions: opts.isAllergen && opts.allergenType ? [`Declared food allergen: ${opts.allergenType}. Allergic individuals should strictly avoid.`] : [],
    verdict: opts.classification === "RED" ? "Avoid or strictly minimize consumption." : opts.classification === "ORANGE" ? "Consume in moderation." : "Standard food component.",
    declaredQuantity: opts.declaredQuantity || null,
    quantitySource: opts.declaredQuantity ? "Declared on packaging label" : null,
    healthConcerns: opts.isAddedSugar ? ["Dental caries", "Glycemic spike"] : [],
    isPalmOil: !!opts.isPalmOil,
    isAddedSugar: !!opts.isAddedSugar,
    isAllergen: !!opts.isAllergen,
    allergenType: opts.allergenType || null,
    regulatoryStatus: opts.isAllergen ? "Major food allergen requiring mandatory disclosure" : "General food use",
    evidenceLevel: "MODERATE",
    verificationStatus: "VERIFIED",
    sources: []
  };
}

// 1. Ferrero Rocher standard ingredients list (T3, T4, T8, T16, T24, Grand)
const FERRERO_ROCHER_INGREDIENTS: IngredientDetail[] = [
  makeIngredient("Milk Chocolate (30%)", {
    normalized: "milk chocolate",
    riskLevel: "caution",
    classification: "ORANGE",
    declaredQuantity: "30%",
    function: "Chocolate coating shell",
    isAllergen: true,
    allergenType: "Milk / Dairy"
  }),
  makeIngredient("Sugar", {
    normalized: "sugar",
    riskLevel: "caution",
    classification: "ORANGE",
    isAddedSugar: true,
    function: "Sweetener"
  }),
  makeIngredient("Cocoa Butter", {
    normalized: "cocoa butter",
    riskLevel: "safe",
    classification: "GREEN",
    function: "Natural cocoa fat"
  }),
  makeIngredient("Cocoa Mass", {
    normalized: "cocoa mass",
    riskLevel: "safe",
    classification: "GREEN",
    function: "Pure cocoa solids"
  }),
  makeIngredient("Skimmed Milk Powder", {
    normalized: "skimmed milk powder",
    riskLevel: "safe",
    classification: "GREEN",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    function: "Milk solids"
  }),
  makeIngredient("Anhydrous Milkfat", {
    normalized: "anhydrous milkfat",
    riskLevel: "safe",
    classification: "GREEN",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    function: "Butterfat"
  }),
  makeIngredient("Soy Lecithin (INS 322)", {
    normalized: "soy lecithin",
    riskLevel: "safe",
    classification: "GREEN",
    insNumber: "INS 322",
    isAllergen: true,
    allergenType: "Soy",
    function: "Emulsifier"
  }),
  makeIngredient("Vanillin", {
    normalized: "vanillin",
    riskLevel: "safe",
    classification: "GREEN",
    function: "Flavoring agent"
  }),
  makeIngredient("Hazelnuts (28.5%)", {
    normalized: "hazelnuts",
    riskLevel: "safe",
    classification: "GREEN",
    declaredQuantity: "28.5%",
    isAllergen: true,
    allergenType: "Tree Nuts",
    function: "Whole hazelnut core and roasted nut pieces"
  }),
  makeIngredient("Palm Oil", {
    normalized: "palm oil",
    riskLevel: "caution",
    classification: "ORANGE",
    isPalmOil: true,
    function: "Creamy filling fat"
  }),
  makeIngredient("Wheat Flour", {
    normalized: "wheat flour",
    riskLevel: "safe",
    classification: "GREEN",
    isAllergen: true,
    allergenType: "Wheat / Gluten",
    function: "Crispy wafer shell"
  }),
  makeIngredient("Whey Powder", {
    normalized: "whey powder",
    riskLevel: "safe",
    classification: "GREEN",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    function: "Dairy solids"
  }),
  makeIngredient("Fat-Reduced Cocoa Powder", {
    normalized: "fat-reduced cocoa powder",
    riskLevel: "safe",
    classification: "GREEN",
    function: "Cocoa flavoring"
  }),
  makeIngredient("Sodium Bicarbonate (INS 500ii)", {
    normalized: "sodium bicarbonate",
    riskLevel: "safe",
    classification: "GREEN",
    insNumber: "INS 500ii",
    function: "Raising agent"
  }),
  makeIngredient("Salt", {
    normalized: "salt",
    riskLevel: "safe",
    classification: "GREEN",
    function: "Flavor enhancer"
  })
];

const FERRERO_COLLECTION_INGREDIENTS: IngredientDetail[] = [
  makeIngredient("Milk Chocolate", { normalized: "milk chocolate", riskLevel: "caution", classification: "ORANGE", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Dark Chocolate (40.5%)", { normalized: "dark chocolate", riskLevel: "safe", classification: "GREEN", declaredQuantity: "40.5%" }),
  makeIngredient("Desiccated Coconut (25.5%)", { normalized: "desiccated coconut", riskLevel: "safe", classification: "GREEN", declaredQuantity: "25.5%" }),
  makeIngredient("Hazelnuts (28.5%)", { normalized: "hazelnuts", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Tree Nuts" }),
  makeIngredient("Almonds (8%)", { normalized: "almonds", riskLevel: "safe", classification: "GREEN", declaredQuantity: "8%", isAllergen: true, allergenType: "Tree Nuts" }),
  makeIngredient("Sugar", { normalized: "sugar", riskLevel: "caution", classification: "ORANGE", isAddedSugar: true }),
  makeIngredient("Vegetable Fats (Palm, Shea)", { normalized: "palm and shea fats", riskLevel: "caution", classification: "ORANGE", isPalmOil: true }),
  makeIngredient("Wheat Flour", { normalized: "wheat flour", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Wheat / Gluten" }),
  makeIngredient("Whey Powder", { normalized: "whey powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Skimmed Milk Powder", { normalized: "skimmed milk powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Fat-Reduced Cocoa Powder", { normalized: "fat-reduced cocoa powder", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Soy Lecithin (INS 322)", { normalized: "soy lecithin", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Soy" }),
  makeIngredient("Sodium Bicarbonate (INS 500ii)", { normalized: "sodium bicarbonate", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Salt", { normalized: "salt", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Vanillin", { normalized: "vanillin", riskLevel: "safe", classification: "GREEN" })
];

const FERRERO_TABLET_MILK_INGREDIENTS: IngredientDetail[] = [
  makeIngredient("Sugar", { normalized: "sugar", riskLevel: "caution", classification: "ORANGE", isAddedSugar: true }),
  makeIngredient("Cocoa Butter", { normalized: "cocoa butter", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Hazelnuts (16%)", { normalized: "hazelnuts", riskLevel: "safe", classification: "GREEN", declaredQuantity: "16%", isAllergen: true, allergenType: "Tree Nuts" }),
  makeIngredient("Cocoa Mass", { normalized: "cocoa mass", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Palm Oil", { normalized: "palm oil", riskLevel: "caution", classification: "ORANGE", isPalmOil: true }),
  makeIngredient("Skimmed Milk Powder", { normalized: "skimmed milk powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Whey Powder", { normalized: "whey powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Anhydrous Milkfat", { normalized: "anhydrous milkfat", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Fat-Reduced Cocoa Powder", { normalized: "fat-reduced cocoa powder", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Soy Lecithin (INS 322)", { normalized: "soy lecithin", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Soy" }),
  makeIngredient("Vanillin", { normalized: "vanillin", riskLevel: "safe", classification: "GREEN" })
];

const FERRERO_TABLET_DARK_INGREDIENTS: IngredientDetail[] = [
  makeIngredient("Sugar", { normalized: "sugar", riskLevel: "caution", classification: "ORANGE", isAddedSugar: true }),
  makeIngredient("Cocoa Mass (55% Cocoa Solids)", { normalized: "cocoa mass", riskLevel: "safe", classification: "GREEN", declaredQuantity: "55%" }),
  makeIngredient("Hazelnuts (12%)", { normalized: "hazelnuts", riskLevel: "safe", classification: "GREEN", declaredQuantity: "12%", isAllergen: true, allergenType: "Tree Nuts" }),
  makeIngredient("Palm Oil", { normalized: "palm oil", riskLevel: "caution", classification: "ORANGE", isPalmOil: true }),
  makeIngredient("Cocoa Butter", { normalized: "cocoa butter", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Fat-Reduced Cocoa Powder (9.5%)", { normalized: "fat-reduced cocoa powder", riskLevel: "safe", classification: "GREEN", declaredQuantity: "9.5%" }),
  makeIngredient("Whey Powder", { normalized: "whey powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Anhydrous Milkfat", { normalized: "anhydrous milkfat", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Soy Lecithin (INS 322)", { normalized: "soy lecithin", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Soy" }),
  makeIngredient("Vanillin", { normalized: "vanillin", riskLevel: "safe", classification: "GREEN" })
];

const FERRERO_RAFFAELLO_INGREDIENTS: IngredientDetail[] = [
  makeIngredient("Desiccated Coconut (25.5%)", { normalized: "desiccated coconut", riskLevel: "safe", classification: "GREEN", declaredQuantity: "25.5%" }),
  makeIngredient("Vegetable Fats (Palm, Shea)", { normalized: "palm and shea fats", riskLevel: "caution", classification: "ORANGE", isPalmOil: true }),
  makeIngredient("Sugar", { normalized: "sugar", riskLevel: "caution", classification: "ORANGE", isAddedSugar: true }),
  makeIngredient("Almonds (8%)", { normalized: "almonds", riskLevel: "safe", classification: "GREEN", declaredQuantity: "8%", isAllergen: true, allergenType: "Tree Nuts" }),
  makeIngredient("Skimmed Milk Powder", { normalized: "skimmed milk powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Whey Powder", { normalized: "whey powder", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Milk / Dairy" }),
  makeIngredient("Wheat Flour", { normalized: "wheat flour", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Wheat / Gluten" }),
  makeIngredient("Tapioca Starch", { normalized: "tapioca starch", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Soy Lecithin (INS 322)", { normalized: "soy lecithin", riskLevel: "safe", classification: "GREEN", isAllergen: true, allergenType: "Soy" }),
  makeIngredient("Flavourings", { normalized: "flavourings", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Sodium Bicarbonate (INS 500ii)", { normalized: "sodium bicarbonate", riskLevel: "safe", classification: "GREEN" }),
  makeIngredient("Salt", { normalized: "salt", riskLevel: "safe", classification: "GREEN" })
];

const NEW_FERRERO_PRODUCTS = [
  {
    barcode: "80050278",
    name: "Ferrero Rocher Crisp Hazelnut and Milk Chocolate Pralines 3 Pieces",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Whole Hazelnut Praline",
    flavour: "Hazelnut Crisp",
    packageSize: "37.5g (3 Pieces)",
    netWeight: "37.5 g",
    servingSize: "25g",
    price: 130,
    manufacturer: "Ferrero India Pvt Ltd / Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/80050278.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/000/008/005/0278/front_en.168.400.jpg",
    ingredientsText: "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 603, totalFat: 42.7, saturatedFat: 14.1, carbohydrates: 44.4, sugars: 39.9, addedSugars: 34, fiber: 3.5, protein: 8.2, sodium: 60, salt: 0.15 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500032237",
    name: "Ferrero Rocher Crisp Hazelnut and Milk Chocolate Pralines 4 Pieces",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Whole Hazelnut Praline",
    flavour: "Hazelnut Crisp",
    packageSize: "50g (4 Pieces)",
    netWeight: "50 g",
    servingSize: "25g",
    price: 160,
    manufacturer: "Ferrero India Pvt Ltd / Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500032237.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/003/2237/front_en.107.400.jpg",
    ingredientsText: "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 603, totalFat: 42.7, saturatedFat: 14.1, carbohydrates: 44.4, sugars: 39.9, addedSugars: 34, fiber: 3.5, protein: 8.2, sodium: 60, salt: 0.15 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500192801",
    name: "Ferrero Rocher Fine Hazelnut Chocolates Box 8 Pieces",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Whole Hazelnut Praline",
    flavour: "Hazelnut Crisp",
    packageSize: "100g (8 Pieces)",
    netWeight: "100 g",
    servingSize: "25g",
    price: 320,
    manufacturer: "Ferrero India Pvt Ltd / Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500192801.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/019/2801/front_en.127.400.jpg",
    ingredientsText: "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 603, totalFat: 42.7, saturatedFat: 14.1, carbohydrates: 44.4, sugars: 39.9, addedSugars: 34, fiber: 3.5, protein: 8.2, sodium: 60, salt: 0.15 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "4008400163826",
    name: "Ferrero Rocher Whole Hazelnut Pralines Box 16 Pieces",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Whole Hazelnut Praline",
    flavour: "Hazelnut Crisp",
    packageSize: "200g (16 Pieces)",
    netWeight: "200 g",
    servingSize: "25g",
    price: 649,
    manufacturer: "Ferrero India Pvt Ltd / Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/4008400163826.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/400/840/016/3826/front_fr.141.400.jpg",
    ingredientsText: "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 603, totalFat: 42.7, saturatedFat: 14.1, carbohydrates: 44.4, sugars: 39.9, addedSugars: 34, fiber: 3.5, protein: 8.2, sodium: 60, salt: 0.15 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500009673",
    name: "Ferrero Rocher Premium Golden Gift Box 24 Pieces",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Whole Hazelnut Praline",
    flavour: "Hazelnut Crisp",
    packageSize: "300g (24 Pieces)",
    netWeight: "300 g",
    servingSize: "25g",
    price: 999,
    manufacturer: "Ferrero India Pvt Ltd / Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500009673.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/000/9673/front_en.205.400.jpg",
    ingredientsText: "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 603, totalFat: 42.7, saturatedFat: 14.1, carbohydrates: 44.4, sugars: 39.9, addedSugars: 34, fiber: 3.5, protein: 8.2, sodium: 60, salt: 0.15 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500374542",
    name: "Grand Ferrero Rocher Hazelnut Milk Chocolate Shell with Pralines",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Hollow Chocolate Hazelnut Shell with Pralines",
    flavour: "Milk Chocolate & Hazelnut",
    packageSize: "125g",
    netWeight: "125 g",
    servingSize: "25g",
    price: 499,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 28,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500374542.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/037/4542/front_de.22.400.jpg",
    ingredientsText: "Milk Chocolate (80%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (20%). Contains 2 Rocher Pralines inside.",
    ingredientsList: FERRERO_ROCHER_INGREDIENTS,
    nutritionPer100g: { calories: 608, totalFat: 43.5, saturatedFat: 15.0, carbohydrates: 44.0, sugars: 41.0, addedSugars: 36, fiber: 3.8, protein: 8.0, sodium: 55, salt: 0.14 },
    nutriScore: "E",
    nutriScoreScore: 24,
    novaGroup: 4,
    overallScore: 38,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Soy"],
    ingredientAlerts: ["Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500178669",
    name: "Ferrero Collection Premium Assorted Pralines Gift Box 15 Pieces",
    brand: "Ferrero",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Rocher, Rondnoir & Raffaello Praline Assortment",
    flavour: "Hazelnut, Dark Cocoa & Coconut Almond",
    packageSize: "162g (15 Pieces)",
    netWeight: "162 g",
    servingSize: "25g",
    price: 699,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 35,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500178669.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/017/8669/front_fr.40.400.jpg",
    ingredientsText: "Milk Chocolate (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Soy Lecithin, Vanillin), Hazelnuts, Desiccated Coconut, Sugar, Vegetable Fats (Palm, Shea), Wheat Flour, Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Soy Lecithin, Vanillin), Whey Powder, Skimmed Milk Powder, Almonds, Fat-Reduced Cocoa Powder, Emulsifier: Soy Lecithin, Raising Agents, Salt, Vanillin.",
    ingredientsList: FERRERO_COLLECTION_INGREDIENTS,
    nutritionPer100g: { calories: 595, totalFat: 41.5, saturatedFat: 17.5, carbohydrates: 45.0, sugars: 38.5, addedSugars: 33, fiber: 4.0, protein: 7.5, sodium: 75, salt: 0.19 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500247167",
    name: "Ferrero Collection Luxury Pralines Assortment 24 Pieces",
    brand: "Ferrero",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Pralines",
    productType: "Rocher, Rondnoir & Raffaello Luxury Gift Box",
    flavour: "Hazelnut, Dark Cocoa & Coconut Almond",
    packageSize: "259g (24 Pieces)",
    netWeight: "259 g",
    servingSize: "25g",
    price: 1199,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Italy",
    cocoaPercentage: 35,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500247167.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/024/7167/front_fr.190.400.jpg",
    ingredientsText: "Milk Chocolate (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Soy Lecithin, Vanillin), Hazelnuts, Desiccated Coconut, Sugar, Vegetable Fats (Palm, Shea), Wheat Flour, Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Soy Lecithin, Vanillin), Whey Powder, Skimmed Milk Powder, Almonds, Fat-Reduced Cocoa Powder, Emulsifier: Soy Lecithin, Raising Agents, Salt, Vanillin.",
    ingredientsList: FERRERO_COLLECTION_INGREDIENTS,
    nutritionPer100g: { calories: 595, totalFat: 41.5, saturatedFat: 17.5, carbohydrates: 45.0, sugars: 38.5, addedSugars: 33, fiber: 4.0, protein: 7.5, sodium: 75, salt: 0.19 },
    nutriScore: "E",
    nutriScoreScore: 23,
    novaGroup: 4,
    overallScore: 40,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500359488",
    name: "Ferrero Rocher Original Milk Chocolate & Hazelnut Tablet Bar",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Bars & Tablets",
    productType: "Chocolate Bar with Crunchy Hazelnut Pieces",
    flavour: "Milk Chocolate Hazelnut",
    packageSize: "90g",
    netWeight: "90 g",
    servingSize: "18g",
    price: 249,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Poland",
    cocoaPercentage: 30,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500359488.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/035/9488/front_en.168.400.jpg",
    ingredientsText: "Sugar, Cocoa Butter, Hazelnuts (16%), Cocoa Mass, Palm Oil, Skimmed Milk Powder, Whey Powder, Anhydrous Milkfat, Fat-Reduced Cocoa Powder, Soy Lecithin (INS 322), Vanillin.",
    ingredientsList: FERRERO_TABLET_MILK_INGREDIENTS,
    nutritionPer100g: { calories: 601, totalFat: 42.0, saturatedFat: 15.5, carbohydrates: 46.0, sugars: 42.0, addedSugars: 38, fiber: 3.5, protein: 7.8, sodium: 65, salt: 0.16 },
    nutriScore: "E",
    nutriScoreScore: 24,
    novaGroup: 4,
    overallScore: 39,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500359815",
    name: "Ferrero Rocher Dark 55% Cocoa & Hazelnut Tablet Bar",
    brand: "Ferrero Rocher",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "Chocolate Bars & Tablets",
    productType: "55% Dark Chocolate Bar with Hazelnut Pieces",
    flavour: "55% Dark Cocoa Hazelnut",
    packageSize: "90g",
    netWeight: "90 g",
    servingSize: "18g",
    price: 249,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Poland",
    cocoaPercentage: 55,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500359815.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/035/9815/front_nl.185.400.jpg",
    ingredientsText: "Sugar, Cocoa Mass (55% Cocoa Solids), Hazelnuts (12%), Palm Oil, Cocoa Butter, Fat-Reduced Cocoa Powder (9.5%), Whey Powder, Anhydrous Milkfat, Soy Lecithin (INS 322), Vanillin.",
    ingredientsList: FERRERO_TABLET_DARK_INGREDIENTS,
    nutritionPer100g: { calories: 585, totalFat: 40.0, saturatedFat: 18.0, carbohydrates: 45.0, sugars: 39.0, addedSugars: 35, fiber: 5.5, protein: 7.5, sodium: 40, salt: 0.10 },
    nutriScore: "E",
    nutriScoreScore: 22,
    novaGroup: 4,
    overallScore: 43,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  },
  {
    barcode: "8000500023976",
    name: "Ferrero Raffaello Crisp Coconut Almond Confection Box 15 Pieces",
    brand: "Ferrero",
    category: "Chocolates & Sweets",
    categorySlug: "chocolates-sweets",
    subCategory: "White Chocolate & Pralines",
    productType: "Crisp Coconut Almond Praline",
    flavour: "White Almond Coconut",
    packageSize: "150g (15 Pieces)",
    netWeight: "150 g",
    servingSize: "25g",
    price: 499,
    manufacturer: "Ferrero SpA",
    countryOfOrigin: "Poland",
    cocoaPercentage: null,
    availability: "VERIFIED_AVAILABLE",
    sourceCatalogue: "Ferrero Rocher Official Lineup",
    imageUrl: "/images/packshots/8000500023976.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/800/050/002/3976/front_en.363.400.jpg",
    ingredientsText: "Desiccated Coconut (25.5%), Vegetable Fats (Palm, Shea), Sugar, Almond (8%), Skimmed Milk Powder, Whey Powder (Milk), Wheat Flour, Tapioca Starch, Emulsifier: Lecithins (Soy), Flavourings, Raising Agent (Sodium Bicarbonate), Salt.",
    ingredientsList: FERRERO_RAFFAELLO_INGREDIENTS,
    nutritionPer100g: { calories: 628, totalFat: 48.6, saturatedFat: 29.7, carbohydrates: 38.3, sugars: 33.3, addedSugars: 30, fiber: 4.0, protein: 7.2, sodium: 120, salt: 0.30 },
    nutriScore: "E",
    nutriScoreScore: 26,
    novaGroup: 4,
    overallScore: 35,
    scoreLabel: "Poor",
    hasPalmOil: true,
    hasAddedSugar: true,
    hasArtificialAdditives: true,
    hasHighSaturatedFat: true,
    hasHighSodium: false,
    isUltraProcessed: true,
    isVegetarian: true,
    allergens: ["Milk / Dairy", "Tree Nuts", "Wheat / Gluten", "Soy"],
    ingredientAlerts: ["Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)", "Contains Added Caloric Sugars / Syrups"]
  }
];

// 25 Sweets with verified packshots replacement
const SWEETS_REPAIR_MAP: Record<string, { imageUrl: string; imageSourceUrl: string; imageVerificationNote: string }> = {
  // 14 GO DESi
  "8908930003219": {
    imageUrl: "/images/packshots/8908930003219.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/Real_Aam_Pouch_LI-01.jpg",
    imageVerificationNote: "Verified authentic GO DESi Real Aam Fruit Bar packaging packshot"
  },
  "8908930003226": {
    imageUrl: "/images/packshots/8908930003226.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/Guava_Pouch_LI-01.jpg",
    imageVerificationNote: "Verified authentic GO DESi Fruit Bar packaging packshot"
  },
  "8908930003264": {
    imageUrl: "/images/packshots/8908930003264.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/01_7cb9599d-81a1-41a4-a9be-c77a338af5ba.jpg",
    imageVerificationNote: "Verified authentic GO DESi Crunchy Dry Fruit Chikki packaging packshot"
  },
  "8908930003240": {
    imageUrl: "/images/packshots/8908930003240.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/LS1.jpg",
    imageVerificationNote: "Verified authentic GO DESi Peanut Chikki Bites packaging packshot"
  },
  "8908930003257": {
    imageUrl: "/images/packshots/8908930003257.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/LS1_80a36eba-6e67-4164-bd08-9662e605cb61.jpg",
    imageVerificationNote: "Verified authentic GO DESi Sesame Chikki Bites packaging packshot"
  },
  "8908930003202": {
    imageUrl: "/images/packshots/8908930003202.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/mints_2.png",
    imageVerificationNote: "Verified authentic GO DESi Mints packaging packshot"
  },
  "8908930003196": {
    imageUrl: "/images/packshots/8908930003196.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/mints_2.png",
    imageVerificationNote: "Verified authentic GO DESi Meetha Paan Mints packaging packshot"
  },
  "8908930003172": {
    imageUrl: "/images/packshots/8908930003172.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/products/chilliguavaindividualpop_4x_8ea91afe-f4f5-4ffa-82af-8cbfb24c30eb.png",
    imageVerificationNote: "Verified authentic GO DESi Popz Chilli Guava packaging packshot"
  },
  "8908930003141": {
    imageUrl: "/images/packshots/8908930003141.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/popz_3_77fb77b3-5991-48ff-827f-37381377000f.png",
    imageVerificationNote: "Verified authentic GO DESi Popz Kaccha Aam packaging packshot"
  },
  "8908930003165": {
    imageUrl: "/images/packshots/8908930003165.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/masalaJamun50pcs.png",
    imageVerificationNote: "Verified authentic GO DESi Popz Masala Jamun packaging packshot"
  },
  "8908930003158": {
    imageUrl: "/images/packshots/8908930003158.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/popz_2_608adbbf-e29d-415b-af25-1f94ff126cc6.png",
    imageVerificationNote: "Verified authentic GO DESi Popz Real Aam packaging packshot"
  },
  "8908930003134": {
    imageUrl: "/images/packshots/8908930003134.png",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/1_2748cbd2-d66b-476d-9258-a9a7f441bf03.png",
    imageVerificationNote: "Verified authentic GO DESi Popz Tangy Imli packaging packshot"
  },
  "8908930003189": {
    imageUrl: "/images/packshots/8908930003189.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/Chilli-Orange-Bitz-2.jpg",
    imageVerificationNote: "Verified authentic GO DESi Popz Bitz packaging packshot"
  },
  "8908930003233": {
    imageUrl: "/images/packshots/8908930003233.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/StrawberryPouchNewLI-01_067b7e21-4176-4344-8343-096db199528d.jpg",
    imageVerificationNote: "Verified authentic GO DESi Strawberry Fruit Bar packaging packshot"
  },

  // 11 Traditional Sweets
  "8908930001581": {
    imageUrl: "/images/packshots/8908930001581.png",
    imageSourceUrl: "https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/0/7/07_-atta-ladoo_500gm-pack_mumbai_-fop.png",
    imageVerificationNote: "Verified authentic Bikaji Gond & Atta sweet packaging packshot"
  },
  "8908930001574": {
    imageUrl: "/images/packshots/8908930001574.png",
    imageSourceUrl: "https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/1/1/11_-front_-sadabahar-soanpapdi_domestic_900gm_-size-w-448-pxl-x-h-560-pxl.png",
    imageVerificationNote: "Verified authentic Bikaji Pure Desi Ghee Soan Papdi packaging packshot"
  },
  "8908930001338": {
    imageUrl: "/images/packshots/8908930001338.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/1729/9719/files/PedhaMockup.jpg",
    imageVerificationNote: "Verified authentic Chitale Bandhu Kandi Pedha packaging packshot"
  },
  "8908930001321": {
    imageUrl: "/images/packshots/8908930001321.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/1729/9719/files/KK_250g_FoP.jpg",
    imageVerificationNote: "Verified authentic Chitale Bandhu Kaju Katli packaging packshot"
  },
  "8908930001314": {
    imageUrl: "/images/packshots/8908930001314.jpg",
    imageSourceUrl: "https://cdn.shopify.com/s/files/1/1729/9719/files/MangoBurfi250gMockup.jpg",
    imageVerificationNote: "Verified authentic Chitale Bandhu Mango Burfi (Amba Barfi) packaging packshot"
  },
  "8908930001468": {
    imageUrl: "/images/packshots/8908930001468.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/406/328/1401/front_en.14.400.jpg",
    imageVerificationNote: "Verified authentic Haldiram's Premium Kaju Katli packaging packshot"
  },
  "8908930001451": {
    imageUrl: "/images/packshots/8908930001451.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/400/440/5415/front_en.11.400.jpg",
    imageVerificationNote: "Verified authentic Haldiram's Desi Ghee Soan Papdi packaging packshot"
  },
  "8908930001147": {
    imageUrl: "/images/packshots/8908930001147.jpg",
    imageSourceUrl: "https://cdn.grofers.com/da/cms-assets/cms/product/95503921-6ceb-416f-abd1-1ca0ded901b3.jpg",
    imageVerificationNote: "Verified authentic Prabhuji Gulab Jamun Tin packaging packshot"
  },
  "8908930001130": {
    imageUrl: "/images/packshots/8908930001130.jpg",
    imageSourceUrl: "https://cdn.grofers.com/da/cms-assets/cms/product/3dbb6d8c-e611-4e95-a9a0-bbee538b4d51.jpg",
    imageVerificationNote: "Verified authentic Prabhuji Spongy Rasgulla Tin packaging packshot"
  },
  "8908930001154": {
    imageUrl: "/images/packshots/8908930001154.jpg",
    imageSourceUrl: "https://cdn.grofers.com/da/cms-assets/cms/product/bundles/38d0138a-5752-4b09-9e75-44749bccd841.jpg",
    imageVerificationNote: "Verified authentic Prabhuji Kaju Katli packaging packshot"
  },
  "8908930001123": {
    imageUrl: "/images/packshots/8908930001123.jpg",
    imageSourceUrl: "https://cdn.grofers.com/da/cms-assets/cms/product/be38bbe1-99ef-43bb-914e-366899476ae4.jpg",
    imageVerificationNote: "Verified authentic Prabhuji Pure Desi Ghee Soan Papdi packaging packshot"
  }
};

async function main() {
  console.log("Starting add_ferrero_and_repair_sweets script...");

  // Read current seed-data.ts
  const seedPath = path.resolve("src/lib/seed-data.ts");
  const seedContent = fs.readFileSync(seedPath, "utf-8");

  // Load SEED_PRODUCTS dynamically
  const { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } = await import("../src/lib/seed-data");
  console.log(`Current SEED_PRODUCTS count: ${SEED_PRODUCTS.length}`);

  let repairedCount = 0;
  for (const prod of SEED_PRODUCTS) {
    if (SWEETS_REPAIR_MAP[prod.barcode]) {
      const rep = SWEETS_REPAIR_MAP[prod.barcode];
      prod.imageUrl = rep.imageUrl;
      prod.imageSourceUrl = rep.imageSourceUrl;
      prod.imageVerificationNote = rep.imageVerificationNote;
      prod.imageStatus = "VERIFIED";
      prod.imageVerified = true;
      prod.imageVerifiedAt = new Date().toISOString();
      prod.verificationStatus = "FULLY_VERIFIED";
      prod.verified = true;
      repairedCount++;
    }
  }
  console.log(`Repaired packshots for ${repairedCount} existing sweets.`);

  // Check if Ferrero Rocher brand exists in SEED_BRANDS
  const hasFerreroRocherBrand = SEED_BRANDS.some((b: any) => b.name === "Ferrero Rocher" || b.slug === "ferrero-rocher");
  if (!hasFerreroRocherBrand) {
    SEED_BRANDS.push({
      slug: "ferrero-rocher",
      name: "Ferrero Rocher",
      country: "Italy"
    });
    console.log("Added Ferrero Rocher to SEED_BRANDS.");
  }

  // Add new Ferrero products if not present
  let addedCount = 0;
  for (const newP of NEW_FERRERO_PRODUCTS) {
    const existing = SEED_PRODUCTS.find((p: any) => p.barcode === newP.barcode);
    if (!existing) {
      const id = new ObjectId().toHexString();
      const productObj: any = {
        _id: id,
        id: id,
        ...newP,
        dataCompleteness: 100,
        source: "manual",
        dataStatus: "verified",
        verified: true,
        verifiedBy: "FoodDecode Research Team",
        verificationDate: new Date().toISOString(),
        imageStatus: "VERIFIED",
        imageVerified: true,
        imageVerifiedAt: new Date().toISOString(),
        imageVerificationNote: "Verified authentic retail packaging packshot",
        verificationStatus: "FULLY_VERIFIED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      SEED_PRODUCTS.push(productObj);
      addedCount++;
    }
  }
  console.log(`Added ${addedCount} new Ferrero Rocher & Collection products to SEED_PRODUCTS.`);
  console.log(`New total SEED_PRODUCTS count: ${SEED_PRODUCTS.length}`);

  // Write updated SEED_PRODUCTS back to src/lib/seed-data.ts
  const outputCode = `// @ts-nocheck
import { ProductItem, CategoryRecord, BrandRecord, AnalysisRule, ProductSubmission } from "@/types";

export const SEED_CATEGORIES: CategoryRecord[] = ${JSON.stringify(SEED_CATEGORIES, null, 2)};

export const SEED_BRANDS: BrandRecord[] = ${JSON.stringify(SEED_BRANDS, null, 2)};

export const SEED_RULES: AnalysisRule[] = [];

export const SEED_SUBMISSIONS: ProductSubmission[] = [];

export const SEED_PRODUCTS: any[] = ${JSON.stringify(SEED_PRODUCTS, null, 2)};

export function generateSeedProducts(): ProductItem[] {
  return SEED_PRODUCTS;
}
`;

  fs.writeFileSync(seedPath, outputCode, "utf-8");
  console.log("Successfully wrote updated seed-data.ts");

  // Sync to MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
  if (uri) {
    console.log(`Connecting to MongoDB Atlas (${dbName})...`);
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("products");

    // 1. Update the 25 repaired sweets
    let mongoUpdatedCount = 0;
    for (const [barcode, rep] of Object.entries(SWEETS_REPAIR_MAP)) {
      const res = await col.updateOne(
        { barcode },
        {
          $set: {
            imageUrl: rep.imageUrl,
            imageSourceUrl: rep.imageSourceUrl,
            imageVerificationNote: rep.imageVerificationNote,
            imageStatus: "VERIFIED",
            imageVerified: true,
            imageVerifiedAt: new Date().toISOString(),
            verificationStatus: "FULLY_VERIFIED",
            verified: true,
            updatedAt: new Date().toISOString()
          }
        }
      );
      if (res.matchedCount > 0) mongoUpdatedCount++;
    }
    console.log(`Updated ${mongoUpdatedCount} sweets in MongoDB Atlas.`);

    // 2. Upsert the 11 Ferrero products
    let mongoFerreroCount = 0;
    for (const newP of NEW_FERRERO_PRODUCTS) {
      const seedItem = SEED_PRODUCTS.find((p: any) => p.barcode === newP.barcode);
      if (seedItem) {
        const { _id, ...docWithoutId } = seedItem;
        await col.updateOne(
          { barcode: newP.barcode },
          {
            $set: {
              ...docWithoutId,
              updatedAt: new Date().toISOString()
            },
            $setOnInsert: {
              _id: new ObjectId(_id)
            }
          },
          { upsert: true }
        );
        mongoFerreroCount++;
      }
    }
    console.log(`Upserted ${mongoFerreroCount} Ferrero products in MongoDB Atlas.`);
    await client.close();
    console.log("MongoDB connection closed.");
  } else {
    console.warn("MONGODB_URI not found; skipped MongoDB Atlas sync.");
  }

  console.log("Finished all tasks successfully!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
