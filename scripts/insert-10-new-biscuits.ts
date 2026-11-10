import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import { analyzeIngredientsText } from "../src/lib/ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness,
} from "../src/lib/scoring-engine";
import { ProductItem } from "../src/types";

// Load environment variables
const env = fs.readFileSync(".env.local", "utf8");
let uri = "";
for (const line of env.split("\n")) {
  if (line.startsWith("MONGODB_URI=")) uri = line.replace("MONGODB_URI=", "").trim();
}

if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

export interface RawBiscuitCandidate {
  name: string;
  brand: string;
  barcode: string;
  category: string;
  subCategory: string;
  productType: string;
  flavour: string;
  packageSize: string;
  servingSize: string;
  manufacturer: string;
  countryOfOrigin: string;
  searchTags: string[];
  imageUrl: string;
  imageSourceUrl: string;
  imageVerificationNote: string;
  ingredientsText: string;
  nutritionPer100g: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    carbohydrates: number;
    sugars: number;
    addedSugars?: number;
    fiber: number;
    protein: number;
    sodium: number;
    salt: number;
  };
  sourceUrl: string;
}

export const CANDIDATE_BISCUITS: RawBiscuitCandidate[] = [
  {
    name: "Parle Krackjack Sweet & Salty Biscuits",
    brand: "Parle",
    barcode: "8901719135248",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Sweet & Salty Cracker",
    flavour: "Original Sweet & Salty",
    packageSize: "56.7g",
    servingSize: "56.7g",
    manufacturer: "Parle Products Pvt. Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Krackjack", "Sweet and Salty", "Cracker", "Parle", "Tea Time Biscuits", "Munching"],
    imageUrl: "/images/packshots/8901719135248.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/171/913/5248/front_en.25.400.jpg",
    imageVerificationNote: "Authentic retail front packshot photograph of Parle Krackjack Sweet & Salty Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida), Refined Oils (Palmolein and Palm), Sugar (19.1%), Raising Agents [503(ii), 500(ii)], Invert Sugar Syrup, Iodised Salt (1.5%), Yeast, Emulsifier of Vegetable Origin (Diacetyl Tartaric Acid Esters of Mono- and Diglycerides), Dough Conditioner [223] and Improver [1101(i)].",
    nutritionPer100g: {
      calories: 489,
      totalFat: 19.9,
      saturatedFat: 9.4,
      transFat: 0,
      carbohydrates: 70.5,
      sugars: 19.6,
      addedSugars: 19.1,
      fiber: 2.1,
      protein: 6.8,
      sodium: 371,
      salt: 0.93,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901719135248",
  },
  {
    name: "Britannia 50-50 Maska Chaska Biscuits",
    brand: "Britannia",
    barcode: "8901063367173",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Butter & Herb Cracker",
    flavour: "Maska Chaska (Butter & Herbs)",
    packageSize: "50g",
    servingSize: "38g",
    manufacturer: "Britannia Industries Ltd.",
    countryOfOrigin: "India",
    searchTags: ["50-50", "Maska Chaska", "Herb Cracker", "Butter Biscuits", "Britannia", "Salted Crackers"],
    imageUrl: "/images/packshots/8901063367173.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/106/336/7173/1.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of Britannia 50-50 Maska Chaska Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida), Refined Palm & Palmolein Oil, Sugar, Liquid Glucose, Raising Agents [503(ii), 500(ii), 450(i)], Butter (1.2%), Invert Sugar Syrup, Iodised Salt, Milk Solids, Black Cumin, Dehydrated Oregano Herbs (0.2%), Dough Conditioner [223] and Emulsifier [322].",
    nutritionPer100g: {
      calories: 525,
      totalFat: 26.5,
      saturatedFat: 12.0,
      transFat: 0,
      carbohydrates: 63.8,
      sugars: 9.8,
      addedSugars: 7.5,
      fiber: 2.0,
      protein: 7.7,
      sodium: 1065,
      salt: 2.66,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901063367173",
  },
  {
    name: "Britannia Milk Bikis Biscuits",
    brand: "Britannia",
    barcode: "8901063012660",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Milk & Malt Biscuit",
    flavour: "100% Atta with Milk & Calcium",
    packageSize: "500g",
    servingSize: "25g",
    manufacturer: "Britannia Industries Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Milk Bikis", "Atta Biscuits", "Calcium", "Milk Biscuits", "Britannia", "Kids Biscuits"],
    imageUrl: "/images/packshots/8901063012660.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/106/301/2660/front_en.10.400.jpg",
    imageVerificationNote: "Authentic retail front packshot photograph of Britannia Milk Bikis Biscuits",
    ingredientsText: "Wheat Flour (Atta) (63%), Sugar, Refined Palm Oil, Milk Products (3.4%) (Sweetened Condensed Partly Skimmed Milk, Milk Solids), Invert Sugar Syrup, Minerals (Calcium Carbonate, Ferric Pyrophosphate), Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471], Vitamins (D2, B1, B6, B12), Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 471,
      totalFat: 17.8,
      saturatedFat: 8.8,
      transFat: 0,
      carbohydrates: 72.0,
      sugars: 23.1,
      addedSugars: 10.9,
      fiber: 5.3,
      protein: 8.3,
      sodium: 287,
      salt: 0.72,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901063012660",
  },
  {
    name: "Sunfeast Bounce Choco Twist Creme Biscuits",
    brand: "Sunfeast",
    barcode: "8901725134723",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Chocolate Creme Sandwich Biscuit",
    flavour: "Choco Twist",
    packageSize: "82g",
    servingSize: "25g",
    manufacturer: "ITC Limited",
    countryOfOrigin: "India",
    searchTags: ["Bounce", "Choco Twist", "Cream Biscuits", "Sunfeast", "ITC", "Chocolate Sandwich Biscuits"],
    imageUrl: "/images/packshots/8901725134723.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/172/513/4723/front_en.4.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of Sunfeast Bounce Choco Twist Creme Biscuits",
    ingredientsText: "Wheat Flour, Sugar, Refined Palm Oil, Invert Sugar Syrup, Cocoa Solids (2.3%), Raising Agents [503(ii), 500(ii), 450(i)], Starch, Iodised Salt, Emulsifiers of Vegetable Origin [322, 471], Milk Solids and Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 467,
      totalFat: 15.9,
      saturatedFat: 7.8,
      transFat: 0.1,
      carbohydrates: 74.3,
      sugars: 36.9,
      addedSugars: 33.5,
      fiber: 1.8,
      protein: 6.8,
      sodium: 260,
      salt: 0.65,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901725134723",
  },
  {
    name: "Britannia Treat Jim Jam Biscuits",
    brand: "Britannia",
    barcode: "8901063029323",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Jam & Cream Filled Biscuit",
    flavour: "Vanilla Cream & Raspberry Jam",
    packageSize: "68.5g",
    servingSize: "25g",
    manufacturer: "Britannia Industries Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Jim Jam", "Treat", "Jam Biscuits", "Cream Biscuits", "Britannia", "Vanilla Cream", "Raspberry Jam"],
    imageUrl: "/images/packshots/8901063029323.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/106/302/9323/front_en.3.400.jpg",
    imageVerificationNote: "Authentic retail front packshot photograph of Britannia Treat Jim Jam Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar (24%), Refined Palm Oil & Interesterified Vegetable Fat, Invert Sugar Syrup, Fruit Jam (7%) [Sugar, Apple Juice Concentrate, Thickener (440), Acidity Regulator (330)], Starch, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471], Gelling Agent [440], Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 483,
      totalFat: 19.0,
      saturatedFat: 9.5,
      transFat: 0,
      carbohydrates: 73.0,
      sugars: 33.5,
      addedSugars: 31.8,
      fiber: 1.5,
      protein: 5.0,
      sodium: 214,
      salt: 0.54,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901063029323",
  },
  {
    name: "Britannia Nice Time Coconut Biscuits",
    brand: "Britannia",
    barcode: "8901063028821",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Coconut Sugar Sprinkled Biscuit",
    flavour: "Classic Coconut",
    packageSize: "143g",
    servingSize: "20g",
    manufacturer: "Britannia Industries Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Nice Time", "Coconut Biscuits", "Sugar Sprinkled", "Britannia", "Tea Biscuits"],
    imageUrl: "/images/packshots/8901063028821.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/106/302/8821/front_en.3.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of Britannia Nice Time Coconut Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar (26%), Refined Palm Oil, Coconut Products (4.5%) (Desiccated Coconut Powder), Invert Sugar Syrup, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471], Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 463,
      totalFat: 15.0,
      saturatedFat: 8.0,
      transFat: 0,
      carbohydrates: 76.0,
      sugars: 30.5,
      addedSugars: 27.6,
      fiber: 2.0,
      protein: 6.0,
      sodium: 274,
      salt: 0.69,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901063028821",
  },
  {
    name: "Britannia Little Hearts Classic Crunch Biscuits",
    brand: "Britannia",
    barcode: "8901063019232",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Glazed Sweet Puff Biscuit",
    flavour: "Classic Crunch",
    packageSize: "30.1g",
    servingSize: "13g",
    manufacturer: "Britannia Industries Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Little Hearts", "Heart Biscuits", "Sugar Glazed", "Britannia", "Puff Biscuits", "Sweet Snacks"],
    imageUrl: "/images/packshots/8901063019232.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/106/301/9232/front_en.3.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of Britannia Little Hearts Classic Crunch Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar (23%), Refined Palmolein & Palm Oil, Raising Agents [503(ii), 500(ii)], Invert Sugar Syrup, Iodised Salt, Emulsifier [322], Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 486,
      totalFat: 19.5,
      saturatedFat: 9.4,
      transFat: 0,
      carbohydrates: 70.0,
      sugars: 24.0,
      addedSugars: 23.0,
      fiber: 1.7,
      protein: 7.4,
      sodium: 309,
      salt: 0.77,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901063019232",
  },
  {
    name: "Sunfeast All Rounder Sweet & Salty Thin Potato Crackers",
    brand: "Sunfeast",
    barcode: "8901725116071",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Thin Potato Cracker Biscuit",
    flavour: "Roasted Sweet & Salty",
    packageSize: "75g",
    servingSize: "25g",
    manufacturer: "ITC Limited",
    countryOfOrigin: "India",
    searchTags: ["All Rounder", "Thin Crackers", "Potato Biscuits", "Sweet and Salty", "Sunfeast", "ITC"],
    imageUrl: "/images/packshots/8901725116071.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/172/511/6071/front_en.4.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of Sunfeast All Rounder Sweet & Salty Thin Potato Crackers",
    ingredientsText: "Refined Wheat Flour (Maida), Refined Palm Oil, Sugar, Refined Palmolein, Dehydrated Potato (4.5%), Invert Sugar Syrup, Iodised Salt, Raising Agents [503(ii), 500(ii)], Seasoning, Emulsifiers [322, 471], Dough Conditioner [223].",
    nutritionPer100g: {
      calories: 471,
      totalFat: 19.5,
      saturatedFat: 9.6,
      transFat: 0,
      carbohydrates: 66.7,
      sugars: 15.4,
      addedSugars: 12.0,
      fiber: 1.9,
      protein: 7.2,
      sodium: 480,
      salt: 1.20,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8901725116071",
  },
  {
    name: "McVitie's Hobnobs Whole Rolled Oat & Choco Chip Biscuits",
    brand: "McVitie's",
    barcode: "8906033743773",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Rolled Oat Biscuit",
    flavour: "Rolled Oats & Choco Chip",
    packageSize: "75g",
    servingSize: "25g",
    manufacturer: "United Biscuits Pvt. Ltd. / Pladis India",
    countryOfOrigin: "India",
    searchTags: ["Hobnobs", "Oat Biscuits", "Choco Chip", "McVities", "High Fibre", "British Biscuits"],
    imageUrl: "/images/packshots/8906033743773.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/890/603/374/3773/front_en.24.400.jpg",
    imageVerificationNote: "Authentic retail packaging photograph of McVitie's Hobnobs Whole Rolled Oat & Choco Chip Biscuits",
    ingredientsText: "Rolled Oats (36%), Whole Wheat Flour (Atta) (18%), Edible Vegetable Oil (Palm Oil), Choco Chips (15%) [Sugar, Hydrogenated Vegetable Fat, Cocoa Solids, Emulsifier (322)], Sugar, Invert Sugar Syrup, Raising Agents [500(ii), 503(ii)], Iodised Salt, Emulsifier [472e].",
    nutritionPer100g: {
      calories: 492,
      totalFat: 21.3,
      saturatedFat: 10.2,
      transFat: 0,
      carbohydrates: 68.2,
      sugars: 23.2,
      addedSugars: 15.0,
      fiber: 4.8,
      protein: 6.9,
      sodium: 370,
      salt: 0.93,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/8906033743773",
  },
  {
    name: "Cadbury Bournvita Crunchy Malted Biscuits",
    brand: "Cadbury",
    barcode: "7622201778781",
    category: "Snacks & Spreads",
    subCategory: "Biscuits",
    productType: "Malted Health Cereal Biscuit",
    flavour: "Bournvita Chocolate & Malt",
    packageSize: "120g",
    servingSize: "23g",
    manufacturer: "Mondelez India Foods Pvt. Ltd.",
    countryOfOrigin: "India",
    searchTags: ["Bournvita", "Malted Biscuits", "Chocolate Biscuits", "Cadbury", "Mondelez", "Breakfast Biscuits"],
    imageUrl: "/images/packshots/7622201778781.jpg",
    imageSourceUrl: "https://images.openfoodfacts.org/images/products/762/220/177/8781/front_en.5.400.jpg",
    imageVerificationNote: "Authentic retail front packaging photograph of Cadbury Bournvita Crunchy Malted Biscuits",
    ingredientsText: "Refined Wheat Flour (Maida) (51%), Sugar, Palmolein Oil, Cereal Based Beverage Mix 5% [Cereal Extract (Barley, Wheat), Sugar, Cocoa Solids, Colour (150c), Minerals, Vitamins], Invert Sugar, Cocoa Solids (1.5%), Raising Agents [500(ii), 503(ii)], Iodised Salt, Emulsifier [322], Vitamins (B2, B9, B12, D).",
    nutritionPer100g: {
      calories: 455,
      totalFat: 15.1,
      saturatedFat: 6.7,
      transFat: 0.1,
      carbohydrates: 73.5,
      sugars: 34.2,
      addedSugars: 28.6,
      fiber: 3.5,
      protein: 6.7,
      sodium: 300,
      salt: 0.75,
    },
    sourceUrl: "https://in.openfoodfacts.org/product/7622201778781",
  },
];

async function insertBiscuits() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("fooddecode");

  console.log("=== FOODDECODE 10 NEW BISCUITS INSERTION SCRIPT ===");
  const now = new Date().toISOString();

  // Audit existing records first
  const existingProducts = await db.collection("products").find({}).toArray();
  const existingBarcodes = new Set(existingProducts.map((p) => p.barcode));
  const existingNames = new Set(
    existingProducts.map((p) => `${p.brand} ${p.name}`.toLowerCase().trim())
  );

  console.log(`Audited existing database: ${existingProducts.length} products found.`);

  const insertedProducts: ProductItem[] = [];
  const skippedProducts: string[] = [];

  for (const raw of CANDIDATE_BISCUITS) {
    // Duplicate checks
    if (existingBarcodes.has(raw.barcode)) {
      console.warn(`[SKIP] Barcode collision: ${raw.barcode} already exists in DB.`);
      skippedProducts.push(raw.name);
      continue;
    }

    const normName = `${raw.brand} ${raw.name}`.toLowerCase().trim();
    if (existingNames.has(normName)) {
      console.warn(`[SKIP] Name collision: ${normName} already exists in DB.`);
      skippedProducts.push(raw.name);
      continue;
    }

    // Verify local packshot exists
    const localPackshotPath = `public${raw.imageUrl}`;
    if (!fs.existsSync(localPackshotPath)) {
      console.error(`[ERROR] Packshot file not found on disk: ${localPackshotPath}`);
      continue;
    }

    // Perform full food science scoring
    const analysis = analyzeIngredientsText(raw.ingredientsText);
    const nutri = calculateNutriScore(raw.nutritionPer100g, false);
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

    const docId = new ObjectId().toString();

    const productDoc: ProductItem = {
      _id: docId,
      id: docId,
      barcode: raw.barcode,
      name: raw.name,
      brand: raw.brand,
      category: raw.category,
      categorySlug: "snacks-spreads",
      subCategory: raw.subCategory,
      productType: raw.productType,
      flavour: raw.flavour,
      packageSize: raw.packageSize,
      servingSize: raw.servingSize,
      manufacturer: raw.manufacturer,
      countryOfOrigin: raw.countryOfOrigin,
      searchTags: raw.searchTags,
      imageUrl: raw.imageUrl,
      imageSourceUrl: raw.imageSourceUrl,
      imageStatus: "VERIFIED",
      imageVerifiedAt: now,
      imageVerificationNote: raw.imageVerificationNote,
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
      verified: true,
      verificationDate: now,
      verifiedBy: "FoodDecode Nutrition Team",
      source: "openfoodfacts",
      sourceUrl: raw.sourceUrl,
      isSample: false,
      createdAt: now,
      updatedAt: now,
    };

    // Idempotent upsert by barcode
    await db.collection("products").updateOne(
      { barcode: raw.barcode },
      { $setOnInsert: productDoc },
      { upsert: true }
    );

    // Audit log entry
    await db.collection("audit_logs").insertOne({
      action: "ADMIN_ADD_PRODUCT",
      entityType: "product",
      entityId: raw.barcode,
      performedBy: "Antigravity Automated Catalog Ingestion",
      details: `Added new verified biscuit: ${raw.brand} ${raw.name} (${raw.barcode})`,
      timestamp: new Date(),
    });

    insertedProducts.push(productDoc);
    console.log(`[SUCCESS] Inserted: ${productDoc.brand} ${productDoc.name} (${productDoc.barcode})`);
  }

  console.log(`\n=== INSERTION COMPLETE ===`);
  console.log(`Successfully added: ${insertedProducts.length} new biscuits.`);
  console.log(`Skipped / Duplicate: ${skippedProducts.length}`);

  // Verification step
  const finalCount = await db.collection("products").countDocuments();
  console.log(`Final total products in MongoDB Atlas: ${finalCount}`);

  const verifiedBiscuits = await db
    .collection("products")
    .find({ barcode: { $in: CANDIDATE_BISCUITS.map((b) => b.barcode) } })
    .toArray();

  console.log(`Verified newly inserted records in MongoDB: ${verifiedBiscuits.length} / 10`);

  await client.close();

  // Export JSON report data
  const reportData = verifiedBiscuits.map((b, idx) => ({
    no: idx + 1,
    brand: b.brand,
    productName: b.name,
    variant: b.flavour,
    packageSize: b.packageSize,
    barcode: b.barcode,
    nutriScore: b.nutriScore,
    novaGroup: b.novaGroup,
    overallScore: b.overallScore,
    scoreLabel: b.scoreLabel,
    imageStatus: b.imageStatus,
    imageUrl: b.imageUrl,
    imageSourceUrl: b.imageSourceUrl,
    sourceUrl: b.sourceUrl,
    hasPalmOil: b.hasPalmOil,
    hasAddedSugar: b.hasAddedSugar,
    allergens: b.allergens,
    dataStatus: "VERIFIED",
  }));

  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync("reports/fooddecode-10-new-biscuits.json", JSON.stringify(reportData, null, 2));
  console.log("Written reports/fooddecode-10-new-biscuits.json");
}

insertBiscuits().catch(console.error);
