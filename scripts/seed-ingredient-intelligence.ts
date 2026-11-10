import { seedScientificIngredientsToDb, SCIENTIFIC_INGREDIENT_DATABASE } from "../src/lib/ingredient-service";
import { getDb } from "../src/lib/mongodb";

async function main() {
  console.log("Seeding Scientific Ingredient Intelligence into MongoDB Atlas...");
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed!");
    process.exit(1);
  }

  const result = await seedScientificIngredientsToDb();
  console.log(`Seeding complete: ${result.upserted} upserted, ${result.modified} modified.`);

  const count = await db.collection("ingredients").countDocuments({});
  console.log(`Total ingredients in MongoDB Atlas ingredients collection: ${count}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed ingredient intelligence:", err);
  process.exit(1);
});

