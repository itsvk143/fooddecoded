import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { bulkInsertProducts, ProductCandidate } from "./lib/insert-products-helper";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

async function main() {
  console.log("=== FOODDECODE: INSERTING WAVE 3 PRODUCTS (212 ITEMS) ===");
  console.log("Categories: Chocolates & Sweets (108), Cold Drinks (52), Beverages & Drinks (52)");
  
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const rawData = fs.readFileSync(path.join(process.cwd(), "scripts/data/wave3_candidates.json"), "utf8");
  const candidates: ProductCandidate[] = JSON.parse(rawData);

  console.log(`Loaded ${candidates.length} candidates from wave3_candidates.json.`);

  const result = await bulkInsertProducts(db, candidates, false, 50);
  console.log("Wave 3 Insertion Result:", result);

  const postCount = await db.collection("products").countDocuments();
  console.log(`Total products in DB after Wave 3: ${postCount}`);

  // Print category counts
  const categoryAgg = await db.collection("products").aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  console.log("\nCategory counts after insertion:");
  for (const c of categoryAgg) {
    console.log(`  - ${c._id}: ${c.count} items`);
  }

  await client.close();
}

main().catch(console.error);
