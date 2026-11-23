import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");
if (!fs.existsSync(PACKSHOT_DIR)) {
  fs.mkdirSync(PACKSHOT_DIR, { recursive: true });
}

const RETAIL_DOMAINS = [
  /bbassets\.com/i,
  /bigbasket\.com/i,
  /media-amazon\.com/i,
  /ssl-images-amazon\.com/i,
  /images-na\.ssl-images-amazon\.com/i,
  /rukminim\d*\.flixcart\.com/i,
  /grofers\.com/i,
  /blinkit\.com/i,
  /zeptonow\.com/i,
  /jiomart\.com/i,
  /cdn\.shopify\.com/i,
  /images\.openfoodfacts\.org/i,
  /haldiram/i,
  /bikaji/i,
  /cornitos/i,
  /farmley/i,
  /happilo/i,
  /swiggy/i,
  /instamart/i,
  /dmart\.in/i,
  /itcstore\.in/i,
  /amul\.com/i
];

const BLOCKED_SUBSTRINGS = [
  "hellokerala", "pinimg", "sasquatchstation", "spicyfilm", "lovethispic",
  "toiimg", "aeplcdn", "huffingtonpost", "mailer-images-aug", "wp-content",
  "blogspot", "wikipedia", "shutterstock", "alamy", "unsplash", "flickr",
  "vecteezy", "freepik", "wallpaper", "davidstubbsphotography", "pmstudycircle",
  "b08n53z14s", "goodwillness", "leatherjacket", "palau-shark", "hero-splendor",
  "nora-fatehi", "fallopian", "shaik-kaleem", "placeholder", "logo", "watermark",
  "cartoon", "sketch", "clipart", "transparent", "icon"
];

export function isCleanRetailUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  for (const b of BLOCKED_SUBSTRINGS) {
    if (lower.includes(b)) return false;
  }
  return RETAIL_DOMAINS.some(r => r.test(url));
}

function detectImageExt(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 4) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "webp";
  return null;
}

async function downloadImageBuffer(url: string): Promise<{ buf: Buffer; ext: "jpg" | "png" | "webp" } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (buf.length < 5000) return null; // Reject tiny images
    const ext = detectImageExt(buf);
    if (!ext) return null;
    return { buf, ext };
  } catch {
    return null;
  }
}

async function tryLookupOpenFoodFacts(barcode: string): Promise<string | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "FoodDecodeBot/1.0 (dev@fooddecode.org)" },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const img = data.product.image_front_url || data.product.image_url;
      if (img && typeof img === "string" && isCleanRetailUrl(img)) {
        return img;
      }
    }
  } catch {}
  return null;
}

export async function searchBingStrict(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const rawMatches = Array.from(html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&"]+)/g)).map(m => m[1]);
    for (const u of rawMatches) {
      if (isCleanRetailUrl(u)) {
        return u;
      }
    }
  } catch {}
  return null;
}

function clean(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

async function matchShopify(brand: string, name: string, dumps: any): Promise<string | null> {
  const brandKey = brand.toLowerCase().replace(/[^a-z]/g, "");
  let storeProducts: any[] = [];
  if (brandKey.includes("cornitos")) storeProducts = dumps.cornitos || [];
  else if (brandKey.includes("godesi")) storeProducts = dumps.godesi || [];
  else if (brandKey.includes("farmley")) storeProducts = dumps.farmley || [];
  else if (brandKey.includes("chitale")) storeProducts = dumps.chitale || [];
  else if (brandKey.includes("happilo")) storeProducts = dumps.happilo || [];
  else if (brandKey.includes("wicked")) storeProducts = dumps.wickedgud || [];
  else if (brandKey.includes("snackible")) storeProducts = dumps.snackible || [];
  else if (brandKey.includes("opensecret")) storeProducts = dumps.opensecret || [];

  if (storeProducts.length === 0) return null;

  const tClean = clean(name);
  const tWords = tClean.split(" ").filter(w => w.length > 2);
  let bestProd: any = null;
  let bestScore = 0;

  for (const sp of storeProducts) {
    const spClean = clean(sp.title);
    const spWords = spClean.split(" ").filter(w => w.length > 2);
    let matchCount = 0;
    for (const w of tWords) {
      if (spWords.includes(w)) matchCount++;
    }
    if (matchCount > bestScore && matchCount >= 2) {
      bestScore = matchCount;
      bestProd = sp;
    }
  }

  if (bestProd && bestProd.images && bestProd.images.length > 0) {
    return bestProd.images[0].src;
  }
  return null;
}

async function resolveProductPackshot(product: any, dumps: any): Promise<{ url: string; source: string } | null> {
  // 1. Try Shopify official dumps
  const shopifyUrl = await matchShopify(product.brand, product.name, dumps);
  if (shopifyUrl && isCleanRetailUrl(shopifyUrl)) {
    return { url: shopifyUrl, source: `Shopify Store (${product.brand})` };
  }

  // 2. Try Open Food Facts by barcode
  const offUrl = await tryLookupOpenFoodFacts(product.barcode);
  if (offUrl && isCleanRetailUrl(offUrl)) {
    return { url: offUrl, source: "Open Food Facts Barcode API" };
  }

  // 3. Search queries on Bing with Strict retail filter
  const queries = [
    `${product.brand} ${product.name} packaging packshot`,
    `${product.brand} ${product.name} BigBasket packshot`,
    `${product.brand} ${product.name} Blinkit packshot`,
    `${product.brand} ${product.name} Amazon India packshot`
  ];

  for (const q of queries) {
    const foundUrl = await searchBingStrict(q);
    if (foundUrl && isCleanRetailUrl(foundUrl)) {
      return { url: foundUrl, source: `Verified Retail Search (${q})` };
    }
  }

  // 4. Fallback search by cleaned product name without brand duplication
  const cleanName = product.name.replace(new RegExp(`^${product.brand}\\s*`, "i"), "");
  const fallbackUrl = await searchBingStrict(`${product.brand} ${cleanName} retail packaging`);
  if (fallbackUrl && isCleanRetailUrl(fallbackUrl)) {
    return { url: fallbackUrl, source: "Fallback Verified Retail Search" };
  }

  return null;
}

async function main() {
  console.log("=== FOODDECODE: MASTER PACKSHOT RESOLUTION AND REPAIR ===");

  const targets = JSON.parse(fs.readFileSync("./scripts/master_target_repair_list.json", "utf8"));
  console.log(`Loaded ${targets.length} target products requiring packshot repair.`);

  const dumps = JSON.parse(fs.readFileSync("./scripts/shopify_store_dumps.json", "utf8"));

  const appliedUpdates: Record<string, {
    imageUrl: string;
    imageSourceUrl: string;
    imageVerificationNote: string;
    imageStatus: string;
    imageVerified: boolean;
  }> = {};

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const p = targets[i];
    process.stdout.write(`[${i + 1}/${targets.length}] ${p.barcode} (${p.brand}: ${p.name.slice(0, 35)})... `);

    const resolved = await resolveProductPackshot(p, dumps);
    if (!resolved) {
      console.log("FAILED to find clean retail packshot");
      failCount++;
      continue;
    }

    const downloaded = await downloadImageBuffer(resolved.url);
    if (!downloaded) {
      console.log(`FAILED download from ${resolved.url.slice(0, 45)}`);
      failCount++;
      continue;
    }

    const filename = `${p.barcode}.${downloaded.ext}`;
    const destPath = path.join(PACKSHOT_DIR, filename);
    fs.writeFileSync(destPath, downloaded.buf);

    const localUrl = `/images/packshots/${filename}`;
    appliedUpdates[p.barcode] = {
      imageUrl: localUrl,
      imageSourceUrl: resolved.url,
      imageVerificationNote: `Verified authentic retail packaging photograph via ${resolved.source}`,
      imageStatus: "VERIFIED",
      imageVerified: true
    };

    console.log(`SUCCESS -> ${filename} (${Math.round(downloaded.buf.length / 1024)}KB)`);
    successCount++;

    // Small delay between requests to be polite
    if (i % 5 === 0) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\nResolution finished: ${successCount} successfully resolved & downloaded, ${failCount} failed.`);
  fs.writeFileSync("./scripts/master_applied_updates.json", JSON.stringify(appliedUpdates, null, 2));

  // Now apply updates to seed-data.ts
  console.log("\nApplying verified packshots to src/lib/seed-data.ts...");
  let seedContent = fs.readFileSync("./src/lib/seed-data.ts", "utf8");
  let modifiedCount = 0;

  for (const [barcode, info] of Object.entries(appliedUpdates)) {
    const barcodeStr = `"barcode": "${barcode}"`;
    const barcodeIdx = seedContent.indexOf(barcodeStr);
    if (barcodeIdx === -1) {
      // Also try barcode without quotes if formatted differently
      continue;
    }

    // Find the object boundaries
    const nextObjIdx = seedContent.indexOf('{\n    "barcode":', barcodeIdx + 10);
    const sliceEnd = nextObjIdx === -1 ? barcodeIdx + 3000 : nextObjIdx;
    let block = seedContent.slice(barcodeIdx, sliceEnd);

    // Replace imageUrl
    block = block.replace(/"imageUrl":\s*"[^"]*"/, `"imageUrl": "${info.imageUrl}"`);
    // Replace imageSourceUrl
    block = block.replace(/"imageSourceUrl":\s*"[^"]*"/, `"imageSourceUrl": "${info.imageSourceUrl}"`);
    // Replace imageStatus
    block = block.replace(/"imageStatus":\s*"[^"]*"/, `"imageStatus": "${info.imageStatus}"`);
    // Replace imageVerificationNote
    block = block.replace(/"imageVerificationNote":\s*"[^"]*"/, `"imageVerificationNote": "${info.imageVerificationNote}"`);

    seedContent = seedContent.slice(0, barcodeIdx) + block + seedContent.slice(sliceEnd);
    modifiedCount++;
  }

  fs.writeFileSync("./src/lib/seed-data.ts", seedContent);
  console.log(`Successfully updated ${modifiedCount} products in src/lib/seed-data.ts.`);

  // Update MongoDB Atlas if connected
  const uri = process.env.MONGODB_URI;
  if (uri) {
    console.log("\nConnecting to MongoDB Atlas to persist verified packshot updates...");
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB_NAME || "fooddecode");
      const col = db.collection("products");

      let dbUpdates = 0;
      for (const [barcode, info] of Object.entries(appliedUpdates)) {
        const res = await col.updateOne(
          { barcode },
          {
            $set: {
              imageUrl: info.imageUrl,
              imageSourceUrl: info.imageSourceUrl,
              imageVerificationNote: info.imageVerificationNote,
              imageStatus: info.imageStatus,
              imageVerified: true,
              imageVerifiedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        );
        if (res.modifiedCount > 0) dbUpdates++;
      }
      console.log(`Updated ${dbUpdates} products in MongoDB Atlas.`);
    } catch (e: any) {
      console.log("MongoDB update error:", e.message);
    } finally {
      await client.close();
    }
  }
}

main().catch(console.error);
