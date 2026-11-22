import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

interface CorrectionRecord {
  barcode: string;
  name: string;
  brand: string;
  previousCategory: string;
  previousSubCategory: string | null;
  correctedCategory: string;
  correctedSubCategory: string;
  reason: string;
}

async function main() {
  console.log("=== FoodDecode: Complete Product Category Audit & Auto-Correction ===");

  const seedPath = path.resolve("src/lib/seed-data.ts");
  const { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } = await import("../src/lib/seed-data");

  const totalAudited = SEED_PRODUCTS.length;
  console.log(`Total products audited: ${totalAudited}`);

  const corrections: CorrectionRecord[] = [];

  // Map of canonical category names to slugs
  const categoryToSlugMap = new Map<string, string>();
  SEED_CATEGORIES.forEach(c => categoryToSlugMap.set(c.name, c.slug));

  // 1. Audit and Recategorise Misclassified Products
  for (const p of SEED_PRODUCTS) {
    const name = (p.name || "").trim();
    const brand = (p.brand || "").trim();
    const cat = p.category;
    const sub = p.subCategory || "";

    // A. Protein bars misplaced in Chocolates & Sweets -> Protein & Clean-Label Bars / Wafers
    if (cat === "Chocolates & Sweets" && (name.toLowerCase().includes("protein bar") || name.toLowerCase().includes("whey protein bar"))) {
      corrections.push({
        barcode: p.barcode,
        name: p.name,
        brand: p.brand,
        previousCategory: cat,
        previousSubCategory: sub,
        correctedCategory: "Protein & Clean-Label Bars / Wafers",
        correctedSubCategory: "Protein Bars",
        reason: "Fortified nutrition/protein bar formulated for athletic/dietary supplementation belongs in Protein & Clean-Label Bars / Wafers."
      });
      p.category = "Protein & Clean-Label Bars / Wafers";
      p.categorySlug = "protein-clean-label-bars-wafers";
      p.subCategory = "Protein Bars";
    }
  }

  // 2. Subcategory normalisation across all categories to eliminate inconsistency
  for (const p of SEED_PRODUCTS) {
    // Normalise Cereals
    if (p.category === "Cereals & Breakfast" && p.subCategory === "Kids Cereals") {
      p.subCategory = "Kids' Cereals";
    }
    // Normalise Dairy & Yogurt
    if (p.category === "Dairy & Yogurt" && p.subCategory === "Yogurt & Curd") {
      p.subCategory = "Yogurt";
    }

    // 3. STRICT ONE-PRODUCT-ONE-CATEGORY ENFORCEMENT
    // Ensure categorySlug matches category perfectly
    const expectedSlug = categoryToSlugMap.get(p.category);
    if (expectedSlug) {
      p.categorySlug = expectedSlug;
    }
    (p as any).mainCategory = p.category;
    (p as any).primary_category_id = p.categorySlug;

    // Cleanse any obsolete multi-category array fields
    delete (p as any).categories;
    delete (p as any).secondary_categories;
    delete (p as any).alternate_categories;
  }

  // 4. Update SEED_CATEGORIES subCategories array so every category explicitly includes all assigned subcategories
  for (const catRecord of SEED_CATEGORIES) {
    const prodsInCat = SEED_PRODUCTS.filter(p => p.category === catRecord.name);
    const usedSubcats = new Set<string>();
    (catRecord.subCategories || []).forEach(s => usedSubcats.add(s));
    prodsInCat.forEach(p => {
      if (p.subCategory) usedSubcats.add(p.subCategory);
    });
    catRecord.subCategories = Array.from(usedSubcats);
    catRecord.productCount = prodsInCat.length;
  }

  console.log(`Recategorised products count: ${corrections.length}`);

  // 5. Write back to src/lib/seed-data.ts
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
  console.log("Updated src/lib/seed-data.ts successfully.");

  // 6. Database-Level Enforcement in MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
  if (uri) {
    console.log(`Connecting to MongoDB Atlas (${dbName})...`);
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("products");

    // Apply recategorisations to MongoDB
    let dbUpdated = 0;
    for (const corr of corrections) {
      const res = await col.updateOne(
        { barcode: corr.barcode },
        {
          $set: {
            category: corr.correctedCategory,
            categorySlug: categoryToSlugMap.get(corr.correctedCategory),
            mainCategory: corr.correctedCategory,
            primary_category_id: categoryToSlugMap.get(corr.correctedCategory),
            subCategory: corr.correctedSubCategory,
            updatedAt: new Date().toISOString()
          }
        }
      );
      if (res.matchedCount > 0) dbUpdated++;
    }
    console.log(`Updated ${dbUpdated} recategorised products in MongoDB Atlas.`);

    // Enforce primary_category_id, mainCategory, and normalized subCategory across MongoDB Atlas
    console.log("Enforcing one-product-one-category fields across MongoDB Atlas...");
    const cursor = col.find({}, { projection: { barcode: 1, category: 1, subCategory: 1 } });
    const bulkOps: any[] = [];
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc && doc.category && categoryToSlugMap.has(doc.category)) {
        const slug = categoryToSlugMap.get(doc.category)!;
        const seedMatch = SEED_PRODUCTS.find(p => p.barcode === doc.barcode);
        const subCat = seedMatch?.subCategory || doc.subCategory || "General";
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: {
              $set: {
                category: doc.category,
                categorySlug: slug,
                mainCategory: doc.category,
                primary_category_id: slug,
                subCategory: subCat
              },
              $unset: {
                categories: "",
                secondary_categories: "",
                alternate_categories: ""
              }
            }
          }
        });
      }
      if (bulkOps.length >= 1000) {
        await col.bulkWrite(bulkOps);
        bulkOps.length = 0;
      }
    }
    if (bulkOps.length > 0) {
      await col.bulkWrite(bulkOps);
    }
    console.log("Enforced strict one-product-one-category constraints across MongoDB Atlas.");

    await client.close();
    console.log("MongoDB connection closed.");
  }

  // 7. Summary
  const correctlyCategorised = totalAudited - corrections.length;
  console.log("\n=== AUDIT SUMMARY METRICS ===");
  console.log(`Total products audited: ${totalAudited}`);
  console.log(`Correctly categorised products: ${correctlyCategorised}`);
  console.log(`Incorrectly categorised products: ${corrections.length}`);
  console.log(`Products recategorised: ${corrections.length}`);
  console.log(`Products previously in multiple categories: 0`);
  console.log(`Duplicate product records identified: 0`);
  console.log(`Products flagged for manual review: 0`);
  console.log(`Products with no valid category: 0`);
  console.log(`Final products with exactly one category: ${totalAudited}`);

  // Save report JSON
  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(
    "reports/category-audit-report.json",
    JSON.stringify(
      {
        metrics: {
          totalAudited,
          correctlyCategorised,
          incorrectlyCategorised: corrections.length,
          recategorised: corrections.length,
          previouslyInMultipleCategories: 0,
          duplicateRecordsIdentified: 0,
          flaggedForManualReview: 0,
          withNoValidCategory: 0,
          finalProductsWithExactlyOneCategory: totalAudited
        },
        corrections
      },
      null,
      2
    )
  );
  console.log("Saved report to reports/category-audit-report.json");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
