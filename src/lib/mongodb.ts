import { MongoClient, Db, Collection, Document } from "mongodb";

// Server-side guard to guarantee database secrets are never exposed on client
if (typeof window !== "undefined") {
  throw new Error("lib/mongodb.ts should only be imported on the server side.");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";

// Safe mask for diagnostics without exposing passwords or host secrets
function maskMongoUri(rawUri?: string): string {
  if (!rawUri) return "UNDEFINED";
  try {
    const parsed = new URL(rawUri.replace("mongodb+srv://", "http://").replace("mongodb://", "http://"));
    return `${rawUri.startsWith("mongodb+srv") ? "mongodb+srv" : "mongodb"}://***:***@${parsed.host}`;
  } catch {
    return "mongodb://***:***@masked-host";
  }
}

interface MongoGlobal {
  _mongoClientPromise?: Promise<MongoClient>;
  _indexesCreated?: boolean;
}

declare const globalThis: typeof global & MongoGlobal;

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  // In development and warm serverless functions, reuse existing client promise
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    globalThis._mongoClientPromise = client.connect();
    console.log(`[MongoDB] Initializing connection to cluster at: ${maskMongoUri(uri)} (DB: ${dbName})`);
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  console.warn(
    "[MongoDB] WARNING: MONGODB_URI is not set in environment variables. Falling back to in-memory seed data mode. To enable persistent MongoDB Atlas storage, configure MONGODB_URI in your Vercel Project Settings or .env.local file."
  );
}

/**
 * Returns true if MONGODB_URI is configured.
 */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/**
 * Get active MongoDB Db instance. Returns null if MongoDB is not configured or fails to connect.
 */
export async function getDb(): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Automatically ensure indexes once per warm container
    if (!globalThis._indexesCreated) {
      ensureIndexes(db).catch((err) => {
        console.warn("[MongoDB] Non-fatal index check error:", err.message);
      });
      globalThis._indexesCreated = true;
    }

    return db;
  } catch (error) {
    console.error("[MongoDB] Connection failure:", (error as Error).message);
    return null;
  }
}

/**
 * Get typed collection or null if offline
 */
export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<T>(collectionName);
}

/**
 * Verify connectivity and return server diagnostic status (safe for admin UI)
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  dbName: string;
  maskedUri: string;
  error?: string;
  collections?: string[];
}> {
  const maskedUri = maskMongoUri(uri);
  if (!clientPromise) {
    return {
      connected: false,
      dbName,
      maskedUri,
      error: "MONGODB_URI environment variable is missing. Set it in .env.local or Vercel.",
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    // Ping command
    await db.command({ ping: 1 });
    const cols = await db.listCollections().toArray();
    return {
      connected: true,
      dbName,
      maskedUri,
      collections: cols.map((c) => c.name),
    };
  } catch (err) {
    return {
      connected: false,
      dbName,
      maskedUri,
      error: (err as Error).message,
    };
  }
}

/**
 * Create indexes for high-performance serverless queries and duplicate prevention
 */
export async function ensureIndexes(db: Db): Promise<void> {
  try {
    const products = db.collection("products");
    await products.createIndex({ barcode: 1 }, { unique: true });
    await products.createIndex({ name: "text", brand: "text", category: "text" });
    await products.createIndex({ category: 1 });
    await products.createIndex({ brand: 1 });
    await products.createIndex({ overallScore: -1 });
    await products.createIndex({ nutriScore: 1 });
    await products.createIndex({ verified: 1 });
    await products.createIndex({ ingredientAlerts: 1 });
    await products.createIndex({ updatedAt: -1 });

    const ingredients = db.collection("ingredients");
    await ingredients.createIndex({ normalizedName: 1 }, { unique: true });
    await ingredients.createIndex({ aliases: 1 });
    await ingredients.createIndex({ riskLevel: 1 });

    const categories = db.collection("categories");
    await categories.createIndex({ slug: 1 }, { unique: true });

    const brands = db.collection("brands");
    await brands.createIndex({ slug: 1 }, { unique: true });

    const submissions = db.collection("productSubmissions");
    await submissions.createIndex({ barcode: 1 });
    await submissions.createIndex({ status: 1 });
    await submissions.createIndex({ createdAt: -1 });

    const jobs = db.collection("importJobs");
    await jobs.createIndex({ status: 1 });
    await jobs.createIndex({ createdAt: -1 });

    const audit = db.collection("auditLogs");
    await audit.createIndex({ timestamp: -1 });

    console.log("[MongoDB] Collections and indexes verified successfully.");
  } catch (error) {
    console.warn("[MongoDB] Index setup encountered an issue (may already exist):", (error as Error).message);
  }
}
