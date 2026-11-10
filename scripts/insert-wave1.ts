import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { bulkInsertProducts, ProductCandidate } from "./lib/insert-products-helper";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

async function main() {
  console.log("=== FOODDECODE: INSERTING WAVE 1 PRODUCTS (583 ITEMS) ===");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const rawData = fs.readFileSync(path.join(process.cwd(), "scripts/data/wave1_candidates.json"), "utf8");
  const candidates: ProductCandidate[] = JSON.parse(rawData);

  console.log(`Loaded ${candidates.length} candidates.`);

  const result = await bulkInsertProducts(db, candidates, false, 50);
  console.log("Wave 1 Insertion Result:", result);

  const postCount = await db.collection("products").countDocuments();
  console.log(`Total products in DB after Wave 1: ${postCount}`);

  await client.close();
}

main().catch(console.error);

