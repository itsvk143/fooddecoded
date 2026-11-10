import { MongoClient } from "mongodb";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const chocolateCategory = {
    slug: "chocolates-sweets",
    name: "Chocolates & Sweets",
    icon: "🍫",
    description: "Artisanal chocolates, dark chocolate, confectionery, toffees and Indian traditional sweets.",
    displayOrder: 14,
    isActive: true,
    subCategories: [
      "Dark Chocolate",
      "Milk Chocolate",
      "White Chocolate",
      "Chocolate Bars",
      "Chocolate Wafer Bars",
      "Chocolate Bites & Minis",
      "Chocolate Cookies & Wafers",
      "Chocolate Spread",
      "Cocoa Products",
      "Sugar-Free Chocolates",
      "Protein Chocolates",
      "Indian Traditional Sweets",
      "Packaged Indian Sweets",
      "Candy & Toffees",
      "Lollipops",
      "Gummies & Jellies",
      "Marshmallows",
      "Premium & Imported Chocolates",
      "Festival Chocolate Gift Packs",
      "Peanut Brittle & Chikki"
    ]
  };

  const res = await db.collection("categories").updateOne(
    { name: chocolateCategory.name },
    { $set: chocolateCategory },
    { upsert: true }
  );

  console.log("Upserted Chocolates & Sweets category in MongoDB:", res);

  const allCats = await db.collection("categories").find({}).toArray();
  console.log("Current categories count in DB:", allCats.length);

  await client.close();
}

main().catch(console.error);
