import { MongoClient } from "mongodb";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const newCategories = [
    {
      slug: "ready-to-eat-ready-to-cook",
      name: "Ready-to-Eat & Ready-to-Cook",
      icon: "🍲",
      description: "Convenient packaged meals, instant foods and ready-to-cook products.",
      displayOrder: 9,
      isActive: true,
      subCategories: [
        "Instant Meals",
        "Ready-to-Eat Curries",
        "Instant Poha & Upma",
        "Cup Meals",
        "Frozen Parathas",
        "Ready-to-Cook Mixes",
        "Instant Soups"
      ]
    },
    {
      slug: "protein-foods-snacks",
      name: "Protein Foods & Snacks",
      icon: "💪",
      description: "Packaged foods and snacks marketed for their protein content.",
      displayOrder: 10,
      isActive: true,
      subCategories: [
        "Protein Bars",
        "Protein Cookies",
        "Protein Chips",
        "Protein Breakfast Cereals",
        "Ready-to-Drink Protein Shakes",
        "High-Protein Peanut Butter"
      ]
    },
    {
      slug: "plant-based-foods",
      name: "Plant-Based Foods",
      icon: "🌱",
      description: "Dairy alternatives, vegan foods and plant-derived packaged products.",
      displayOrder: 11,
      isActive: true,
      subCategories: [
        "Oat Milk",
        "Almond Milk",
        "Soy Milk",
        "Coconut Milk Beverages",
        "Vegan Yogurt",
        "Dairy-Free Ice Cream",
        "Plant-Based Spreads"
      ]
    },
    {
      slug: "bakery-breads",
      name: "Bakery & Breads",
      icon: "🍞",
      description: "Packaged breads, bakery products, wraps and ready-to-eat baked goods.",
      displayOrder: 12,
      isActive: true,
      subCategories: [
        "Whole Wheat Bread",
        "Multigrain Bread",
        "Sourdough Bread",
        "Burger Buns",
        "Tortilla Wraps",
        "Pita Bread",
        "Packaged Cakes & Muffins"
      ]
    },
    {
      slug: "spreads-dips-sauces",
      name: "Spreads, Dips & Sauces",
      icon: "🍯",
      description: "Packaged spreads, dips, condiments and cooking sauces.",
      displayOrder: 13,
      isActive: true,
      subCategories: [
        "Peanut Butter",
        "Almond Butter",
        "Hummus",
        "Mayonnaise",
        "Cheese Spreads",
        "Salsa",
        "Cooking Pastes",
        "Chutneys"
      ]
    }
  ];

  for (const cat of newCategories) {
    const res = await db.collection("categories").updateOne(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true }
    );
    console.log(`Upserted category: ${cat.name} (matched: ${res.matchedCount}, upserted: ${res.upsertedCount})`);
  }

  // Reassign existing misclassified products
  const oatlyRes = await db.collection("products").updateOne(
    { barcode: "7394376616532" },
    {
      $set: {
        category: "Plant-Based Foods",
        categorySlug: "plant-based-foods",
        subCategory: "Oat Milk",
        productType: "Oat Milk",
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log(`Reassigned Oatly to Plant-Based Foods: ${oatlyRes.modifiedCount}`);

  const silkRes = await db.collection("products").updateOne(
    { barcode: "025293600270" },
    {
      $set: {
        category: "Plant-Based Foods",
        categorySlug: "plant-based-foods",
        subCategory: "Soy Milk",
        productType: "Soy Milk",
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log(`Reassigned Silk to Plant-Based Foods: ${silkRes.modifiedCount}`);

  const justinRes = await db.collection("products").updateOne(
    { barcode: "858882001007" },
    {
      $set: {
        category: "Spreads, Dips & Sauces",
        categorySlug: "spreads-dips-sauces",
        subCategory: "Peanut Butter",
        productType: "Nut Butter",
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log(`Reassigned Justin's to Spreads, Dips & Sauces: ${justinRes.modifiedCount}`);

  const amysRes = await db.collection("products").updateOne(
    { barcode: "042272005085" },
    {
      $set: {
        category: "Ready-to-Eat & Ready-to-Cook",
        categorySlug: "ready-to-eat-ready-to-cook",
        subCategory: "Instant Soups",
        productType: "Canned Soup",
        updatedAt: new Date().toISOString()
      }
    }
  );
  console.log(`Reassigned Amy's Kitchen to Ready-to-Eat & Ready-to-Cook: ${amysRes.modifiedCount}`);

  await client.close();
}

main().catch(console.error);

