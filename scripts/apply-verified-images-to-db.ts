import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";

// Load local environment variables
try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

interface DryRunItem {
  productId: string;
  barcode: string;
  name: string;
  brand: string;
  proposedImageUrl: string;
  proposedImageStatus: "VERIFIED" | "PLACEHOLDER" | "MISSING" | "UNCERTAIN";
  proposedImageSourceUrl: string;
  proposedImageVerifiedAt: string;
  proposedImageVerificationNote: string;
  action: string;
}

async function applyUpdates() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

  if (!uri) {
    console.error("MONGODB_URI is not set!");
    process.exit(1);
  }

  const dryRunData: { proposals: DryRunItem[] } = JSON.parse(
    fs.readFileSync("reports/dry-run-product-images.json", "utf8")
  );

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("products");

  console.log(`Applying verified image updates to MongoDB collection (${dbName}.products)...`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of dryRunData.proposals) {
    // Match by stable _id or barcode
    const filter = item.productId
      ? { _id: new ObjectId(item.productId) }
      : { barcode: item.barcode };

    const updateDoc = {
      $set: {
        imageUrl: item.proposedImageUrl,
        imageSourceUrl: item.proposedImageSourceUrl || undefined,
        imageStatus: item.proposedImageStatus,
        imageVerifiedAt: item.proposedImageVerifiedAt,
        imageVerificationNote: item.proposedImageVerificationNote,
        updatedAt: new Date().toISOString(),
      },
    };

    const res = await col.updateOne(filter, updateDoc);
    if (res.modifiedCount > 0 || res.matchedCount > 0) {
      updatedCount++;
    } else {
      skippedCount++;
      console.warn(`Product not found for update: ${item.name} (${item.barcode})`);
    }
  }

  console.log(`\nDatabase Update Complete:`);
  console.log(`- Total Records Processed: ${dryRunData.proposals.length}`);
  console.log(`- Successfully Updated: ${updatedCount}`);
  console.log(`- Skipped / Not Found: ${skippedCount}`);

  await client.close();
}

applyUpdates().catch(err => {
  console.error("Failed to apply updates:", err);
  process.exit(1);
});

