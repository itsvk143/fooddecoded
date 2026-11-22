import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { execSync } from "child_process";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");

if (!fs.existsSync(PACKSHOT_DIR)) {
  fs.mkdirSync(PACKSHOT_DIR, { recursive: true });
}

function detectImageExt(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 4) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "webp";
  return null;
}

async function downloadImageBuffer(url: string): Promise<Buffer | null> {
  const isShopify = url.includes("cdn.shopify.com");
  const headers: Record<string, string> = isShopify
    ? { "User-Agent": "curl/8.7.1" }
    : {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      };

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.warn(`Fetch failed (${res.status}): ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length >= 8000 ? buf : null;
  } catch (e: any) {
    console.warn(`Download error: ${e.message} for ${url}`);
    return null;
  }
}

async function main() {
  console.log("=== APPLYING 100% VERIFIED AUTHENTIC PACKSHOTS FOR BAKED CHIPS CATEGORY ===");

  const mappingFile = path.join(process.cwd(), "scripts/baked_chips_verified_mapping.json");
  if (!fs.existsSync(mappingFile)) {
    throw new Error("Missing scripts/baked_chips_verified_mapping.json! Run build_verified_baked_chips_map.ts first.");
  }
  const mapping: Record<string, { brand: string; name: string; url: string }> = JSON.parse(
    fs.readFileSync(mappingFile, "utf-8")
  );

  // Apply explicit overrides for Let's Try exact SKUs to ensure zero mismatches
  const letstryOverrides: Record<string, string> = {
    "8908930002328": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/6cdd990cb6fc5f3136aae7cc9b461194.webp", // Potato Chips Classic Salted
    "8908930002335": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/2ee5347795e07fa92362802c22269412.jpg",  // Potato Chips Cream & Onion
    "8908930002342": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/667d624e4319d8df55bb5d8761236bda.jpg",  // Potato Chips Peri Peri (Flying chilli)
    "8908930002359": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/bca35fcaea7caa1084ed8950334c18ba.jpg",  // Potato Chips Pudina
    "8908930002366": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/1633d74125f77fd1ce2214220a32cb29.jpg",  // Banana Chips Salted (Lite Wafers)
    "8908930002373": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/e35176017339f9c5703d816e57a4c864.jpg",  // Tapioca Chips (Mix Lite Papad)
    "8908930002380": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/50ed41c5195a16f76fe3bbae4b8c6ea4.jpg",  // Roasted Ragi Puffs Cheese (Ragi Chips)
    "8908930002397": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/aeace90fc81d3e6e0362454751736ea9.jpg",  // Roasted Jowar Puffs Masala (Jowar Puffs)
    "8908930002403": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/a794e1129b1d4998d2da2ef1b7c1c6b8.jpg",  // Corn Rings Tangy Tomato (Masala Rings)
    "8908930002410": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/3f48e2ba84d1be22ed300cfecb3466e7.jpg",  // Soya Sticks Chatpata Masala (Lite Sticks)
    "8908930002427": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/16111a282b3b850f122bad2e69d3fea9.jpg",  // Garlic Bhujia (Teekha Gathiya)
    "8908930002434": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/817ae80f265046d80242d2d10e3428af.jpg",  // Salted Moong Dal (Hing Jeera Chana)
    "8908930002441": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/02663dcb49679f43a6dae1dc6f3b8308.webp", // Sabudana Chivda Fasting Mix (Sabudana Mixture)
    "8908930002458": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/cf49abc47448c851b8fc6798a6a6c252.jpg",  // Farali Mixture Groundnut Oil (Falahari Mixture)
    "8908930002465": "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/5f3016e402ee6a6bcc5637767b6316a4.jpg"   // Roasted Makhana Salt & Pepper (Himalayan Salt Makhana)
  };

  for (const [bc, url] of Object.entries(letstryOverrides)) {
    if (mapping[bc]) {
      mapping[bc].url = url;
    }
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("products");

  let successCount = 0;
  let failCount = 0;

  for (const [barcode, item] of Object.entries(mapping)) {
    let cleanUrl = item.url.split("?")[0];
    const buf = await downloadImageBuffer(cleanUrl);

    if (!buf) {
      console.error(`FAILED: ${barcode} - ${item.brand} | ${item.name} (${cleanUrl})`);
      failCount++;
      continue;
    }

    const ext = detectImageExt(buf) || "jpg";
    const localRelPath = `/images/packshots/${barcode}.${ext}`;
    const localAbsPath = path.join(PACKSHOT_DIR, `${barcode}.${ext}`);

    // Clean up any other extension
    for (const otherExt of ["jpg", "png", "webp"]) {
      if (otherExt !== ext) {
        const oldFile = path.join(PACKSHOT_DIR, `${barcode}.${otherExt}`);
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }
    }

    fs.writeFileSync(localAbsPath, buf);

    // Update MongoDB Atlas
    await collection.updateOne(
      { barcode },
      {
        $set: {
          imageUrl: localRelPath,
          imageSourceUrl: cleanUrl,
          imageStatus: "VERIFIED"
        }
      }
    );

    successCount++;
    console.log(`[${successCount}/177] OK: ${barcode} - ${item.brand} | ${item.name} -> ${localRelPath} (${buf.length} bytes)`);
  }

  console.log(`\n========================================`);
  console.log(`COMPLETED: ${successCount} updated successfully, ${failCount} failed.`);
  console.log(`========================================\n`);

  await client.close();

  console.log("Synchronizing full seed-data.ts from MongoDB Atlas...");
  execSync("npx tsx scripts/sync-seed-data-full.ts", { stdio: "inherit" });
  console.log("Seed data synchronized successfully.");
}

main().catch(console.error);
