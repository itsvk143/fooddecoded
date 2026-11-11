import fs from "fs";
import { MongoClient } from "mongodb";

process.loadEnvFile(".env.local");
const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const rawCats = await db.collection("categories").find({}).toArray();
  rawCats.sort((a, b) => ((a.displayOrder || 0) - (b.displayOrder || 0)) || (a.name || "").localeCompare(b.name || ""));

  const rawProds = await db.collection("products").find({}).toArray();
  rawProds.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const categories = rawCats.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon || "📦",
    description: c.description || "",
    displayOrder: c.displayOrder,
    subCategories: c.subCategories || [],
    isActive: c.isActive ?? true,
  }));

  const products = rawProds.map((p) => {
    const copy: any = { ...p };
    copy.id = p._id.toString();
    copy._id = p._id.toString();
    return copy;
  });

  // Extract SEED_BRANDS, SEED_RULES, SEED_SUBMISSIONS from current file
  const currentContent = fs.readFileSync("src/lib/seed-data.ts", "utf8");

  const brandsMatch = currentContent.match(/export const SEED_BRANDS: BrandRecord\[\] = \[([\s\S]*?)\];/);
  const rulesMatch = currentContent.match(/export const SEED_RULES: AnalysisRule\[\] = \[([\s\S]*?)\];/);
  const submissionsMatch = currentContent.match(/export const SEED_SUBMISSIONS: ProductSubmission\[\] = \[([\s\S]*?)\];/);

  const brandsBlock = brandsMatch ? brandsMatch[0] : "export const SEED_BRANDS: BrandRecord[] = [];";
  const rulesBlock = rulesMatch ? rulesMatch[0] : "export const SEED_RULES: AnalysisRule[] = [];";
  const submissionsBlock = submissionsMatch ? submissionsMatch[0] : "export const SEED_SUBMISSIONS: ProductSubmission[] = [];";

  const newFileContent = `import { ProductItem, CategoryRecord, BrandRecord, AnalysisRule, ProductSubmission } from "@/types";

export const SEED_CATEGORIES: CategoryRecord[] = ${JSON.stringify(categories, null, 2)};

${brandsBlock}

${rulesBlock}

${submissionsBlock}

export const SEED_PRODUCTS: ProductItem[] = (${JSON.stringify(products, null, 2)}) as unknown as ProductItem[];

export function generateSeedProducts(): ProductItem[] {
  return SEED_PRODUCTS;
}
`;

  fs.writeFileSync("src/lib/seed-data.ts", newFileContent, "utf8");
  console.log(`Synced seed-data.ts with ${categories.length} categories and ${products.length} products.`);

  await client.close();
}

main().catch(console.error);

