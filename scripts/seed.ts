/**
 * FoodDecode Database Seed Script
 * Run with: npm run db:seed
 */
import { MongoClient } from "mongodb";
import {
  generateSeedProducts,
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_RULES,
  SEED_SUBMISSIONS,
} from "../src/lib/seed-data";

// Automatically load local .env.local if present
try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

  if (!uri) {
    console.error("❌ Error: MONGODB_URI environment variable is not defined.");
    console.error("Please export MONGODB_URI or run: MONGODB_URI='your-cluster-uri' npm run db:seed");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")} (DB: ${dbName})...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("Connected successfully! Seeding collections...");

    // 1. Products
    const products = generateSeedProducts();
    const prodCol = db.collection("products");
    await prodCol.createIndex({ barcode: 1 }, { unique: true });
    await prodCol.createIndex({ name: "text", brand: "text" });

    for (const p of products) {
      const { _id, id, ...cleanDoc } = p;
      await prodCol.updateOne({ barcode: p.barcode }, { $set: cleanDoc }, { upsert: true });
    }
    console.log(`✓ Products seeded (${products.length} items)`);

    // 2. Categories
    const catCol = db.collection("categories");
    await catCol.createIndex({ slug: 1 }, { unique: true });
    for (const c of SEED_CATEGORIES) {
      await catCol.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
    }
    console.log(`✓ Categories seeded (${SEED_CATEGORIES.length} items)`);

    // 3. Brands
    const brandCol = db.collection("brands");
    await brandCol.createIndex({ slug: 1 }, { unique: true });
    for (const b of SEED_BRANDS) {
      await brandCol.updateOne({ slug: b.slug }, { $set: b }, { upsert: true });
    }
    console.log(`✓ Brands seeded (${SEED_BRANDS.length} items)`);

    // 4. Analysis Rules
    const ruleCol = db.collection("analysisRules");
    for (const r of SEED_RULES) {
      await ruleCol.updateOne({ version: r.version }, { $set: r }, { upsert: true });
    }
    console.log(`✓ Analysis rules seeded (${SEED_RULES.length} versioned rules)`);

    // 5. Submissions
    const subCol = db.collection("productSubmissions");
    for (const s of SEED_SUBMISSIONS) {
      const { _id, ...cleanSub } = s;
      await subCol.updateOne({ barcode: s.barcode }, { $set: cleanSub }, { upsert: true });
    }
    console.log(`✓ Sample product submissions seeded`);

    console.log("\n All FoodDecode data has been initialized in MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Seeding failed:", (err as Error).message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
