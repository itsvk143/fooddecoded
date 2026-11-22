import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

interface IngredientItem {
  name: string;
  normalizedName?: string;
  riskLevel: "safe" | "caution" | "avoid";
  classification?: "GREEN" | "ORANGE" | "RED";
  insNumber?: string;
  origin?: "natural" | "synthetic" | "chemical" | "mineral" | "fermented" | "plant" | "animal" | "microbial";
  function?: string;
  benefits?: string;
}

const COMPOUND_DECOMPOSITIONS: Record<string, IngredientItem[]> = {
  // 1. Hershey's Nuggets Milk Chocolate
  "Hershey's Nuggets Milk Chocolate": [
    { name: "Milk Chocolate", normalizedName: "milk chocolate", riskLevel: "caution", classification: "ORANGE", function: "Confectionery Base" },
    { name: "Cane Sugar", normalizedName: "cane sugar", riskLevel: "caution", classification: "ORANGE", origin: "natural", function: "Sweetener" },
    { name: "Skim Milk Powder", normalizedName: "skim milk powder", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Dairy Solid" },
    { name: "Cocoa Butter", normalizedName: "cocoa butter", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Confectionery Fat" },
    { name: "Chocolate Mass", normalizedName: "chocolate mass", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Flavor Base" },
    { name: "Milk Fat", normalizedName: "milk fat", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Dairy Fat" },
    { name: "Lecithin (Soy)", normalizedName: "soy lecithin", riskLevel: "safe", classification: "GREEN", insNumber: "INS 322", origin: "plant", function: "Emulsifier" },
    { name: "Natural Vanilla Flavor", normalizedName: "natural vanilla flavor", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Natural Flavoring" }
  ],

  // 2. Hershey's Symphony Milk Chocolate
  "Hershey's Symphony Milk Chocolate": [
    { name: "Milk Chocolate", normalizedName: "milk chocolate", riskLevel: "caution", classification: "ORANGE", function: "Confectionery Base" },
    { name: "Cane Sugar", normalizedName: "cane sugar", riskLevel: "caution", classification: "ORANGE", origin: "natural", function: "Sweetener" },
    { name: "Whole Milk Powder", normalizedName: "whole milk powder", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Dairy Solid" },
    { name: "Cocoa Butter", normalizedName: "cocoa butter", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Confectionery Fat" },
    { name: "Chocolate Liquor", normalizedName: "chocolate liquor", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Flavor Base" },
    { name: "Milk Fat", normalizedName: "milk fat", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Dairy Fat" },
    { name: "Soy Lecithin", normalizedName: "soy lecithin", riskLevel: "safe", classification: "GREEN", insNumber: "INS 322", origin: "plant", function: "Emulsifier" },
    { name: "Natural Vanilla Flavor", normalizedName: "natural vanilla flavor", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Natural Flavoring" }
  ],

  // 3. François Pralus Le 100%
  "François Pralus Le 100%": [
    { name: "100% Single Origin Cocoa Beans (Madagascar)", normalizedName: "cocoa beans", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Single-origin Criollo/Trinitario pure cocoa mass", benefits: "Extremely rich in flavanols, polyphenols, magnesium, and dietary fiber; zero added sugar" },
    { name: "Pure Cocoa Butter", normalizedName: "cocoa butter", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Natural unrefined plant fat from pressed cocoa beans" }
  ],

  // 4. NOICE Madras Filter Coffee
  "NOICE Madras Filter Coffee": [
    { name: "Roasted Coffee Beans (Arabica & Robusta)", normalizedName: "roasted coffee beans", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Primary aromatic decoction base", benefits: "Rich in chlorogenic acid antioxidants, enhances metabolic alertness" },
    { name: "Roasted Chicory Root (15%)", normalizedName: "roasted chicory root", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Traditional body, thickness, and color enhancer", benefits: "Prebiotic inulin source, aids gut microbiome digestion" }
  ],

  // 5. Ceres 100% All Natural Apple Juice
  "Ceres 100% All Natural Apple Juice": [
    { name: "Pure Clarified Apple Juice", normalizedName: "apple juice", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "100% Cold-pressed natural fruit juice", benefits: "Natural source of vitamin C, potassium, and fruit polyphenols" },
    { name: "Vitamin C (Ascorbic Acid)", normalizedName: "ascorbic acid", riskLevel: "safe", classification: "GREEN", insNumber: "INS 300", origin: "natural", function: "Natural Antioxidant & Nutrient Fortification" }
  ],

  // 6. Real Activ 100% Mixed Fruit Juice Blend No Sugar
  "Real Activ 100% Mixed Fruit Juice Blend No Sugar": [
    { name: "Mixed Fruit Juice Concentrate Blend (Apple, Orange, Guava, Pineapple, Mango, Passionfruit)", normalizedName: "mixed fruit juice blend", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "100% natural fruit juice blend without added sugar", benefits: "Rich in multi-vitamins (A, C, E) and phytonutrients" },
    { name: "Ascorbic Acid (Vitamin C)", normalizedName: "ascorbic acid", riskLevel: "safe", classification: "GREEN", insNumber: "INS 300", origin: "natural", function: "Natural Antioxidant" }
  ],

  // 7. Sleepy Owl Cold Brew Classic Black Coffee Can
  "Sleepy Owl Cold Brew Classic Black Coffee Can": [
    { name: "100% Arabica Cold Brewed Coffee (Filtered Water, Single-Origin Arabica Coffee)", normalizedName: "arabica cold brewed coffee", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Smooth, low-acidity 18-hour cold steeped coffee decoction", benefits: "Rich in antioxidant polyphenols with zero added sugar or calories" }
  ],

  // 8. Snackible Ragi Chips Chocolate Barks
  "Snackible Ragi Chips Chocolate Barks": [
    { name: "Dark Chocolate (Cocoa Mass, Cane Sugar, Cocoa Butter, Soy Lecithin)", normalizedName: "dark chocolate", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "55% Couverture chocolate base" },
    { name: "Crispy Finger Millet (Ragi) Crisps", normalizedName: "ragi crisps", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Whole grain crunchy texture", benefits: "High in dietary fiber, iron, and bioavailable calcium" },
    { name: "Sea Salt", normalizedName: "sea salt", riskLevel: "safe", classification: "GREEN", origin: "mineral", function: "Natural Flavor Balancer" }
  ],

  // 9. WickedGüd Cheesy Mac & Cheese Meal Kit
  "WickedGüd Cheesy Mac & Cheese Meal Kit": [
    { name: "Multigrain Macaroni Pasta (Durum Wheat Semolina, Chickpea Flour, Brown Rice Flour, Red Lentil Flour)", normalizedName: "multigrain macaroni pasta", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Nutrient-dense, high-protein pasta", benefits: "High dietary fiber, plant protein from pulses, no refined maida" },
    { name: "Cheddar Cheese Seasoning Mix (Dehydrated Cheese, Skimmed Milk Powder, Onion Powder, Garlic Powder)", normalizedName: "cheese seasoning mix", riskLevel: "safe", classification: "GREEN", origin: "natural", function: "Savory Cheese Sauce Base" },
    { name: "Iodised Salt", normalizedName: "iodised salt", riskLevel: "safe", classification: "GREEN", origin: "mineral", function: "Flavor Balancer" }
  ],

  // 10. WickedGüd Lentil & Brown Rice Noodles (Curry Masala)
  "WickedGüd Lentil & Brown Rice Noodles (Curry Masala)": [
    { name: "Multigrain Noodles (Whole Wheat Flour, Red Lentil Flour, Chickpea Flour, Brown Rice Flour)", normalizedName: "multigrain noodles", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "100% steamed & air-dried noodles", benefits: "High protein, high fiber, completely un-fried" },
    { name: "Curry Masala Seasoning (Coriander, Cumin, Turmeric, Ginger, Black Pepper, Fenugreek, Clove, Cinnamon)", normalizedName: "curry masala seasoning", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Traditional whole spice aromatic blend" },
    { name: "Rock Salt", normalizedName: "rock salt", riskLevel: "safe", classification: "GREEN", origin: "mineral", function: "Natural seasoning" }
  ],

  // 11. WickedGüd Schezwan Lentil Noodles
  "WickedGüd Schezwan Lentil Noodles": [
    { name: "Multigrain Noodles (Whole Wheat Flour, Red Lentil Flour, Chickpea Flour, Brown Rice Flour)", normalizedName: "multigrain noodles", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "100% air-dried high protein noodle cake", benefits: "Rich in complex carbohydrates and plant protein" },
    { name: "Schezwan Spice Seasoning (Red Chilli, Garlic Powder, Ginger, Szechuan Peppercorn, Onion Powder, Tomato Powder, Tamari Soy Powder)", normalizedName: "schezwan seasoning", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Authentic Asian aromatic sauce mix" },
    { name: "Cold-Pressed Sesame Oil", normalizedName: "sesame oil", riskLevel: "safe", classification: "GREEN", origin: "plant", function: "Toasted Aromatic Flavor Oil" }
  ]
};

async function main() {
  console.log("=== SITE-WIDE INGREDIENT AUDIT & NORMALIZATION ===");

  const seedPath = path.join(process.cwd(), "src/lib/seed-data.ts");
  const { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } = await import("../src/lib/seed-data");
  console.log(`Auditing ${SEED_PRODUCTS.length} total products in database...`);

  let parsedCompoundCount = 0;
  let populatedClassCount = 0;
  let syncedAllergenCount = 0;
  let palmOilAlertCount = 0;
  let sugarAlertCount = 0;

  for (const p of SEED_PRODUCTS) {
    // 1. Decompose Compound Ingredients
    if (COMPOUND_DECOMPOSITIONS[p.name]) {
      p.ingredientsList = COMPOUND_DECOMPOSITIONS[p.name];
      p.ingredientsText = p.ingredientsList.map((i: any) => i.name).join(", ");
      parsedCompoundCount++;
    }

    // 2. Populate Missing Classifications
    if (Array.isArray(p.ingredientsList)) {
      for (const ing of p.ingredientsList) {
        if (!ing.classification) {
          if (ing.riskLevel === "safe") ing.classification = "GREEN";
          else if (ing.riskLevel === "caution") ing.classification = "ORANGE";
          else if (ing.riskLevel === "avoid") ing.classification = "RED";
          populatedClassCount++;
        }
      }
    }

    // 3. Derive & Sync Allergens
    const allIngNames = (p.ingredientsList || []).map((i: any) => (i.name || "").toLowerCase()).join(" ");
    const detectedAllergens = new Set<string>(p.allergens || []);

    if (/\b(milk|dairy|cheese|butter|whey|curd|paneer|ghee|cream|casein|yogurt)\b/i.test(allIngNames)) {
      detectedAllergens.add("Milk");
    }
    if (/\b(wheat|gluten|semolina|maida|atta|barley|rye|spelt)\b/i.test(allIngNames)) {
      detectedAllergens.add("Wheat / Gluten");
    }
    if (/\b(soy|soya|lecithin)\b/i.test(allIngNames)) {
      detectedAllergens.add("Soy");
    }
    if (/\b(peanut|groundnut)\b/i.test(allIngNames)) {
      detectedAllergens.add("Peanuts");
    }
    if (/\b(almond|cashew|walnut|hazelnut|pistachio|pecan|macadamia)\b/i.test(allIngNames)) {
      detectedAllergens.add("Tree Nuts");
    }
    if (/\b(sesame|til)\b/i.test(allIngNames)) {
      detectedAllergens.add("Sesame");
    }
    if (/\b(egg|albumin)\b/i.test(allIngNames)) {
      detectedAllergens.add("Eggs");
    }

    const updatedAllergens = Array.from(detectedAllergens);
    if (updatedAllergens.length !== (p.allergens || []).length) {
      p.allergens = updatedAllergens;
      syncedAllergenCount++;
    }

    // 4. Ensure Ingredient Alerts are consistent
    const alerts = new Set<string>(p.ingredientAlerts || []);
    if (p.hasPalmOil && !Array.from(alerts).some(a => a.toLowerCase().includes("palm oil"))) {
      alerts.add("Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)");
      palmOilAlertCount++;
    }
    if (p.hasAddedSugar && !Array.from(alerts).some(a => a.toLowerCase().includes("sugar"))) {
      alerts.add("Contains Added Caloric Sugars / Syrups");
      sugarAlertCount++;
    }
    p.ingredientAlerts = Array.from(alerts);
  }

  console.log(`Audit Summary:`);
  console.log(`- Decomposed compound items: ${parsedCompoundCount}`);
  console.log(`- Populated missing classifications: ${populatedClassCount}`);
  console.log(`- Synced allergen declarations: ${syncedAllergenCount}`);
  console.log(`- Added missing palm oil alerts: ${palmOilAlertCount}`);
  console.log(`- Added missing sugar alerts: ${sugarAlertCount}`);

  // Write synchronized seed-data.ts
  console.log("\nWriting updated src/lib/seed-data.ts...");
  const newSeedFile = `import { ProductItem, CategoryRecord, BrandRecord, AnalysisRule, ProductSubmission } from "@/types";

export const SEED_CATEGORIES: CategoryRecord[] = ${JSON.stringify(SEED_CATEGORIES, null, 2)};

export const SEED_BRANDS: BrandRecord[] = ${JSON.stringify(SEED_BRANDS, null, 2)};

export const SEED_RULES: AnalysisRule[] = [];

export const SEED_SUBMISSIONS: ProductSubmission[] = [];

export const SEED_PRODUCTS: ProductItem[] = ${JSON.stringify(SEED_PRODUCTS, null, 2)};
`;

  fs.writeFileSync(seedPath, newSeedFile, "utf-8");
  console.log("Saved src/lib/seed-data.ts successfully.");

  // Update MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  if (uri) {
    console.log("\nSyncing all products to MongoDB Atlas...");
    try {
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB_NAME || "fooddecode");
      const col = db.collection("products");

      const ops = SEED_PRODUCTS.map((p: any) => ({
        updateOne: {
          filter: { barcode: p.barcode },
          update: {
            $set: {
              ingredientsList: p.ingredientsList,
              ingredientsText: p.ingredientsText,
              allergens: p.allergens,
              ingredientAlerts: p.ingredientAlerts,
              hasPalmOil: p.hasPalmOil,
              hasAddedSugar: p.hasAddedSugar
            }
          }
        }
      }));

      // Bulk write in batches of 500
      for (let i = 0; i < ops.length; i += 500) {
        const batch = ops.slice(i, i + 500);
        await col.bulkWrite(batch);
      }

      console.log(`Synced ${ops.length} products to MongoDB Atlas.`);
      await client.close();
    } catch (e: any) {
      console.warn("MongoDB Atlas sync failed:", e.message);
    }
  }

  console.log("=== INGREDIENTS AUDIT & NORMALIZATION COMPLETE ===");
}

main().catch(console.error);
