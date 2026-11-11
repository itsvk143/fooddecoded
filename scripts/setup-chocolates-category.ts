import { MongoClient } from "mongodb";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

export const CHOCOLATE_28_SUBCATEGORIES = [
  "Milk Chocolate",
  "Dark Chocolate",
  "White Chocolate",
  "Ruby Chocolate",
  "Premium Chocolate",
  "Luxury Chocolate",
  "Artisan Chocolate",
  "Single-Origin Chocolate",
  "Swiss Chocolate",
  "Belgian Chocolate",
  "French Chocolate",
  "Italian Chocolate",
  "Japanese Chocolate",
  "American Chocolate",
  "British Chocolate",
  "Indian Craft Chocolate",
  "Chocolate Truffles",
  "Chocolate Pralines",
  "Filled Chocolate",
  "Nut Chocolate",
  "Caramel Chocolate",
  "Fruit Chocolate",
  "Wafer Chocolate",
  "Sugar-Free Chocolate",
  "Vegan Chocolate",
  "Organic Chocolate",
  "Baking Chocolate",
  "Specialty Chocolate"
];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const chocolateCategory = {
    slug: "chocolates-sweets",
    name: "Chocolates & Sweets",
    icon: "🍫",
    description: "Premium, artisanal, luxury and commercial chocolates, single-origin cacao, pralines and confectionery.",
    displayOrder: 14,
    isActive: true,
    subCategories: CHOCOLATE_28_SUBCATEGORIES
  };

  const res = await db.collection("categories").updateOne(
    { $or: [{ name: "Chocolates & Sweets" }, { slug: "chocolates-sweets" }] },
    { $set: chocolateCategory },
    { upsert: true }
  );

  console.log("Upserted Chocolates & Sweets category in MongoDB with 28 subcategories:", res);
  await client.close();
}

if (require.main === module || process.argv[1]?.includes("setup-chocolates-category")) {
  main().catch(console.error);
}
