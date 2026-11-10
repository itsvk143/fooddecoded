import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";

// Load local environment variables
try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

async function rollback() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

  if (!uri) {
    console.error("MONGODB_URI is not set!");
    process.exit(1);
  }

  const backupData: any[] = JSON.parse(
    fs.readFileSync("reports/mongodb-products-image-backup.json", "utf8")
  );

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("products");

  console.log(`Rolling back ${backupData.length} products to backup state...`);

  let restored = 0;
  for (const item of backupData) {
    const filter = item._id ? { _id: new ObjectId(item._id) } : { barcode: item.barcode };
    await col.updateOne(filter, {
      $set: {
        imageUrl: item.imageUrl,
        verified: item.verified,
        source: item.source,
        sourceUrl: item.sourceUrl,
      },
      $unset: {
        imageStatus: "",
        imageSourceUrl: "",
        imageVerifiedAt: "",
        imageVerificationNote: "",
      },
    });
    restored++;
  }

  console.log(`Rollback complete: ${restored} records restored.`);
  await client.close();
}

rollback().catch(err => {
  console.error("Rollback failed:", err);
  process.exit(1);
});

