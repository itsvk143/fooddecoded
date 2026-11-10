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

    let insertedCount = 0;
    let updatedCount = 0;
    let biscuitCount = 0;
    let cookieCount = 0;
    let snackCount = 0;
    let bananaChipsCount = 0;
    let chipsCount = 0;
    let coldDrinksCount = 0;

    for (const p of products) {
      if (p.subCategory === "Biscuits") biscuitCount++;
      if (p.subCategory === "Cookies") cookieCount++;
      if (p.subCategory === "Banana Chips") bananaChipsCount++;
      if (p.subCategory === "Chips" || p.subCategory === "Chips & Crisps") chipsCount++;
      if (["Chips & Crisps", "Namkeen & Savouries", "Roasted Snacks", "Mixture & Namkeen"].includes(p.subCategory || "")) snackCount++;
      if (p.subCategory === "Cold Drinks" || p.categorySlug === "cold-drinks") coldDrinksCount++;
      const { _id, id, ...cleanDoc } = p;
      const res = await prodCol.updateOne({ barcode: p.barcode }, { $set: cleanDoc }, { upsert: true });
      if (res.upsertedCount > 0) insertedCount++;
      else if (res.modifiedCount > 0) updatedCount++;
    }
    console.log(`✓ Products seeded (${products.length} total: ${coldDrinksCount} cold drinks, ${chipsCount} chips, ${bananaChipsCount} banana chips, ${biscuitCount} biscuits, ${cookieCount} cookies, ${snackCount} snacks; Inserted: ${insertedCount}, Updated: ${updatedCount})`);

    // 2. Ingredients Knowledge Base
    const ingCol = db.collection("ingredients");
    await ingCol.createIndex({ normalizedName: 1 }, { unique: true });
    const { KNOWN_INGREDIENTS } = await import("../src/lib/ingredient-matcher");
    let ingCount = 0;
    for (const ing of KNOWN_INGREDIENTS) {
      await ingCol.updateOne(
        { normalizedName: ing.normalized },
        {
          $set: {
            name: ing.normalized,
            normalizedName: ing.normalized,
            aliases: ing.aliases,
            category: ing.category,
            riskLevel: ing.riskLevel,
            description: ing.description,
            healthConcerns: ing.healthConcerns,
            isPalmOil: ing.isPalmOil,
            isAddedSugar: ing.isAddedSugar,
            isAllergen: ing.isAllergen,
            allergenType: ing.allergenType,
            regulatoryStatus: ing.regulatoryStatus,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
      ingCount++;
    }
    console.log(`✓ Ingredient intelligence database seeded (${ingCount} records)`);

    // 3. Categories
    const catCol = db.collection("categories");
    await catCol.createIndex({ slug: 1 }, { unique: true });
    for (const c of SEED_CATEGORIES) {
      await catCol.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
    }
    console.log(`✓ Categories seeded (${SEED_CATEGORIES.length} items)`);

    // 4. Brands
    const brandCol = db.collection("brands");
    await brandCol.createIndex({ slug: 1 }, { unique: true });
    for (const b of SEED_BRANDS) {
      await brandCol.updateOne({ slug: b.slug }, { $set: b }, { upsert: true });
    }
    console.log(`✓ Brands seeded (${SEED_BRANDS.length} items)`);

    // 5. Analysis Rules
    const ruleCol = db.collection("analysisRules");
    for (const r of SEED_RULES) {
      await ruleCol.updateOne({ version: r.version }, { $set: r }, { upsert: true });
    }
    console.log(`✓ Analysis rules seeded (${SEED_RULES.length} versioned rules)`);

    // 6. Submissions
    const subCol = db.collection("productSubmissions");
    for (const s of SEED_SUBMISSIONS) {
      const { _id, ...cleanSub } = s;
      await subCol.updateOne({ barcode: s.barcode }, { $set: cleanSub }, { upsert: true });
    }
    console.log(`✓ Sample product submissions seeded`);

    console.log("\n🎉 All FoodDecode data has been initialized in MongoDB Atlas!");
  } catch (err) {
    const errorMsg = (err as Error).message;
    console.error("❌ Seeding failed:", errorMsg);
    if (errorMsg.includes("alert number 80") || errorMsg.includes("tlsv1 alert")) {
      console.error("\n💡 DIAGNOSTIC NOTE: MongoDB Atlas actively terminated the TLS handshake with 'SSL alert number 80'.");
      console.error("This occurs when your public IP address is not authorized in Atlas Network Access.");
      console.error("To resolve: Log in to cloud.mongodb.com -> Select Project -> Network Access -> Add IP Address (Add current IP or 0.0.0.0/0).");
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
