/**
 * Shared helper for bulk product insertion across all category expansion scripts.
 * Handles: duplicate detection, scoring, ingredient analysis, DB insertion.
 */
import { MongoClient, ObjectId, Db } from "mongodb";
import { analyzeIngredientsText } from "../../src/lib/ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness,
} from "../../src/lib/scoring-engine";
import fs from "fs";
import path from "path";

export interface ProductCandidate {
  barcode: string;
  name: string;
  brand: string;
  manufacturer: string;
  category: string;
  categorySlug: string;
  subCategory: string;
  productType: string;
  flavour?: string;
  packageSize: string;
  servingSize: string;
  remoteImageUrl?: string;
  imageVerificationNote?: string;
  sourceUrl?: string;
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
  hasHighSaturatedFat?: boolean;
  hasHighSodium?: boolean;
}

const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");

function checkLocalImage(barcode: string, customPath?: string): { url: string; found: boolean } {
  if (customPath) {
    const abs = path.join(process.cwd(), "public", customPath.replace(/^\//, ""));
    if (fs.existsSync(abs) && fs.statSync(abs).size > 100) {
      return { url: customPath, found: true };
    }
  }
  const exts = ["jpg", "jpeg", "png", "webp", "svg"];
  for (const ext of exts) {
    const p = path.join(PACKSHOT_DIR, `${barcode}.${ext}`);
    if (fs.existsSync(p) && fs.statSync(p).size > 100) {
      return { url: `/images/packshots/${barcode}.${ext}`, found: true };
    }
  }
  return { url: "/images/placeholder-product.svg", found: false };
}

export async function bulkInsertProducts(
  db: Db,
  candidates: ProductCandidate[],
  dryRun = false,
  batchSize = 20
): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  const col = db.collection("products");
  const existingBarcodes = new Set<string>(await col.distinct("barcode"));
  
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  // Deduplicate candidates by barcode
  const seen = new Set<string>();
  const unique = candidates.filter(c => {
    if (seen.has(c.barcode) || existingBarcodes.has(c.barcode)) {
      skipped++;
      return false;
    }
    seen.add(c.barcode);
    return true;
  });
  
  console.log(`  Processing ${unique.length} unique candidates (${candidates.length - unique.length} duplicates skipped)`);
  
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const docs: any[] = [];
    
    for (const c of batch) {
      try {
        const img = checkLocalImage(c.barcode, (c as any).localImageUrl);
        const match = analyzeIngredientsText(c.ingredientsText);
        const nutri = calculateNutriScore(c.nutritionPer100g);
        const nova = determineNovaGroup(match.ingredientsList, c.ingredientsText);
        const overall = calculateOverallScore({
          nutrition: c.nutritionPer100g,
          ingredients: match.ingredientsList,
          nutriScore: nutri.grade,
          novaGroup: nova,
        });
        
        const doc: any = {
          _id: new ObjectId().toHexString(),
          barcode: c.barcode,
          name: c.name,
          brand: c.brand,
          manufacturer: c.manufacturer,
          category: c.category,
          categorySlug: c.categorySlug,
          subCategory: c.subCategory,
          productType: c.productType,
          ...(c.flavour ? { flavour: c.flavour } : {}),
          packageSize: c.packageSize,
          servingSize: c.servingSize,
          imageUrl: img.url,
          imageSourceUrl: c.remoteImageUrl || null,
          imageStatus: img.found ? "VERIFIED" : "MISSING",
          imageVerifiedAt: img.found ? new Date().toISOString() : undefined,
          imageVerificationNote: img.found
            ? `Local packshot verified for ${c.name}`
            : (c.imageVerificationNote || "No verified image available; placeholder used"),
          source: "manual",
          sourceUrl: c.sourceUrl || null,
          ingredientsText: c.ingredientsText,
          ingredientsList: match.ingredientsList,
          nutritionPer100g: c.nutritionPer100g,
          nutriScore: nutri.grade,
          nutriScoreScore: nutri.score,
          novaGroup: nova,
          overallScore: overall.score,
          scoreLabel: overall.label,
          hasPalmOil: match.hasPalmOil,
          hasAddedSugar: match.hasAddedSugar,
          hasArtificialAdditives: match.hasArtificialAdditives,
          hasHighSaturatedFat: c.hasHighSaturatedFat ?? (c.nutritionPer100g.saturatedFat > 5),
          hasHighSodium: c.hasHighSodium ?? (c.nutritionPer100g.sodium > 600),
          allergens: match.allergens,
          ingredientAlerts: match.ingredientAlerts,
          dataCompleteness: 100,
          verified: true,
          verifiedBy: "FoodDecode Research Team",
          verificationDate: new Date().toISOString(),
          isSample: false,
          isUltraProcessed: nova >= 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        doc.dataCompleteness = calculateDataCompleteness(doc.nutritionPer100g, doc.ingredientsText, doc.imageUrl);
        docs.push(doc);
      } catch (err: any) {
        errors.push(`${c.barcode} (${c.name}): ${err.message}`);
      }
    }
    
    if (docs.length > 0 && !dryRun) {
      try {
        const res = await col.insertMany(docs, { ordered: false });
        inserted += res.insertedCount;
        // Add to existing set
        for (const d of docs) existingBarcodes.add(d.barcode);
        console.log(`  Batch ${Math.floor(i/batchSize)+1}: inserted ${res.insertedCount}/${docs.length}`);
      } catch (err: any) {
        // Handle partial bulk insert
        if (err.insertedDocs) {
          inserted += err.insertedDocs.length;
        }
        errors.push(`Batch insert error: ${err.message}`);
      }
    } else if (dryRun) {
      console.log(`  [DRY RUN] Batch ${Math.floor(i/batchSize)+1}: would insert ${docs.length}`);
      inserted += docs.length;
    }
  }
  
  return { inserted, skipped, errors };
}

