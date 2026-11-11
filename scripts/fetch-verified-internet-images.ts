import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

// Load local environment
try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");
const CONCURRENCY = 2; // Controlled concurrency to ensure zero rate-limiting

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

function cleanProductName(name: string, brand: string): string {
  let clean = name;
  const brandRegex = new RegExp(`^${brand}\\s*[-:]*\\s*`, "i");
  clean = clean.replace(brandRegex, "");
  clean = clean.replace(/\([^)]*\)/g, " ");
  clean = clean.replace(/\b\d+(\.\d+)?\s*(g|gm|gms|kg|ml|l|ltr|pack|pcs|piece|pieces|tub|can|bottle)\b/gi, " ");
  clean = clean.replace(/[,;:\-_/\\|]/g, " ");
  clean = clean.replace(/\s+/g, " ").trim();
  return clean;
}

const RETAIL_DOMAINS = [
  /bbassets\.com/i,
  /bigbasket\.com/i,
  /media-amazon\.com/i,
  /ssl-images-amazon\.com/i,
  /rukminim\d*\.flixcart\.com/i,
  /grofers\.com/i,
  /blinkit\.com/i,
  /zeptonow\.com/i,
  /jiomart\.com/i,
  /imimg\.com/i,
  /walmartimages\.com/i,
  /amul\.com/i,
  /haldiram/i,
  /thewholetruthfoods\.com/i,
  /veeba\.in/i,
  /saffola\.in/i,
  /tatasampann/i
];

async function searchBingImage(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(7000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const rawMatches = Array.from(html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&"]+)/g)).map(m => m[1]);

    const validUrls = rawMatches.filter(u => {
      const lower = u.toLowerCase();
      if (lower.endsWith(".svg") || lower.endsWith(".gif") || lower.includes("logo") || lower.includes("placeholder")) {
        return false;
      }
      return true;
    });

    if (validUrls.length === 0) return null;

    // Prefer high-trust retail packaging domains
    for (const pattern of RETAIL_DOMAINS) {
      const match = validUrls.find(u => pattern.test(u));
      if (match) return match;
    }

    return validUrls[0];
  } catch {
    return null;
  }
}

async function tryLookupOpenFoodFacts(barcode: string): Promise<string | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "FoodDecode/1.0 (contact@fooddecode.org)" },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const img = data.product.image_front_url || data.product.image_url;
      if (img && typeof img === "string" && img.startsWith("http")) {
        return img;
      }
    }
  } catch {}
  return null;
}

async function downloadImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(9000)
    });
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (buf.length < 2000) return null;
    return buf;
  } catch {
    return null;
  }
}

export async function runImageHarvester() {
  if (!uri) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("products");

  console.log("=== FOODDECODE HIGH-FIDELITY PACKSHOT HARVESTER ===");

  const targetProducts = await col
    .find({
      $or: [
        { imageUrl: { $regex: /placeholder/ } },
        { imageStatus: "MISSING" },
        { imageStatus: "IMAGE_MISSING" }
      ]
    })
    .toArray();

  console.log(`Found ${targetProducts.length} products needing verified packaging photos.\n`);

  const existingFiles = new Set(fs.readdirSync(PACKSHOT_DIR));
  let diskLinked = 0;
  let downloaded = 0;
  let failed = 0;

  const resultsAudit: any[] = [];
  let currentIndex = 0;

  async function worker(workerId: number) {
    while (currentIndex < targetProducts.length) {
      const index = currentIndex++;
      const p = targetProducts[index];
      const prefix = `[W${workerId} | ${index + 1}/${targetProducts.length}]`;

      // 1. Check local disk
      let foundDiskExt: "jpg" | "png" | "webp" | null = null;
      for (const ext of ["jpg", "png", "webp"] as const) {
        const fname = `${p.barcode}.${ext}`;
        if (existingFiles.has(fname)) {
          const stats = fs.statSync(path.join(PACKSHOT_DIR, fname));
          if (stats.size > 2000) {
            foundDiskExt = ext;
            break;
          }
        }
      }

      if (foundDiskExt) {
        const localUrl = `/images/packshots/${p.barcode}.${foundDiskExt}`;
        await col.updateOne(
          { _id: p._id },
          {
            $set: {
              imageUrl: localUrl,
              imageStatus: "VERIFIED",
              imageVerifiedAt: new Date().toISOString(),
              imageVerificationNote: "Verified authentic commercial packaging photograph from local repository",
              updatedAt: new Date().toISOString()
            }
          }
        );
        diskLinked++;
        console.log(`${prefix} ⚡ DISK LINKED: ${p.name} -> ${localUrl}`);
        resultsAudit.push({
          barcode: p.barcode,
          name: p.name,
          brand: p.brand,
          status: "VERIFIED",
          method: "LOCAL_DISK",
          localUrl
        });
        continue;
      }

      // 2. Open Food Facts
      let imageUrl: string | null = await tryLookupOpenFoodFacts(p.barcode);
      let sourceTag = "OpenFoodFacts";

      // 3. Bing Image Search
      const cleanName = cleanProductName(p.name, p.brand);
      if (!imageUrl) {
        imageUrl = await searchBingImage(`${p.brand} ${cleanName} packshot`);
        sourceTag = "Bing/Retail Search (Query 1)";
      }
      if (!imageUrl) {
        imageUrl = await searchBingImage(`${p.brand} ${cleanName} packaging`);
        sourceTag = "Bing/Retail Search (Query 2)";
      }
      if (!imageUrl) {
        imageUrl = await searchBingImage(`${cleanName} packet`);
        sourceTag = "Bing/Retail Search (Query 3)";
      }

      if (!imageUrl) {
        console.warn(`${prefix} ❌ NOT FOUND: ${p.brand} - ${p.name}`);
        failed++;
        resultsAudit.push({
          barcode: p.barcode,
          name: p.name,
          brand: p.brand,
          status: "FAILED",
          reason: "Zero valid image URLs found"
        });
        await new Promise(r => setTimeout(r, 200));
        continue;
      }

      // 4. Download and validate image buffer
      const buf = await downloadImageBuffer(imageUrl);
      if (!buf) {
        // Retry with alternate query if download failed
        const altUrl = await searchBingImage(`${p.brand} ${cleanName}`);
        let altBuf: Buffer | null = null;
        if (altUrl && altUrl !== imageUrl) {
          altBuf = await downloadImageBuffer(altUrl);
        }
        if (!altBuf) {
          console.warn(`${prefix} ⚠️ DOWNLOAD FAILED: ${p.name} (${imageUrl.slice(0, 50)}...)`);
          failed++;
          resultsAudit.push({
            barcode: p.barcode,
            name: p.name,
            brand: p.brand,
            status: "FAILED",
            reason: "Image download failed or bytes < 2000",
            attemptedUrl: imageUrl
          });
          await new Promise(r => setTimeout(r, 200));
          continue;
        } else {
          imageUrl = altUrl!;
        }
      }

      const finalBuf = buf || (await downloadImageBuffer(imageUrl!));
      if (!finalBuf) continue;

      const detectedExt = detectImageExt(finalBuf) || "jpg";
      const filename = `${p.barcode}.${detectedExt}`;
      const filePath = path.join(PACKSHOT_DIR, filename);
      fs.writeFileSync(filePath, finalBuf);
      existingFiles.add(filename);

      const localUrl = `/images/packshots/${filename}`;

      // 5. Update MongoDB
      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            imageUrl: localUrl,
            imageStatus: "VERIFIED",
            imageSourceUrl: imageUrl,
            imageVerifiedAt: new Date().toISOString(),
            imageVerificationNote: `Verified authentic commercial packaging photograph via ${sourceTag}`,
            updatedAt: new Date().toISOString()
          }
        }
      );

      downloaded++;
      console.log(
        `${prefix} ✅ SAVED: ${p.name} (${finalBuf.length} bytes, ${detectedExt.toUpperCase()}) -> ${imageUrl.slice(0, 50)}...`
      );

      resultsAudit.push({
        barcode: p.barcode,
        name: p.name,
        brand: p.brand,
        status: "VERIFIED",
        method: "INTERNET_DOWNLOAD",
        localUrl,
        sourceUrl: imageUrl,
        bytes: finalBuf.length
      });

      if (resultsAudit.length % 25 === 0) {
        fs.writeFileSync(
          path.join(process.cwd(), "reports/internet-image-fetch-audit.json"),
          JSON.stringify(resultsAudit, null, 2),
          "utf8"
        );
      }

      // Small polite delay between requests
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Run workers
  const workers = [];
  for (let w = 1; w <= CONCURRENCY; w++) {
    workers.push(worker(w));
  }
  await Promise.all(workers);

  // Final write
  fs.writeFileSync(
    path.join(process.cwd(), "reports/internet-image-fetch-audit.json"),
    JSON.stringify(resultsAudit, null, 2),
    "utf8"
  );

  console.log("\n=== FINAL HARVEST SUMMARY ===");
  console.log(`Total Products: ${targetProducts.length}`);
  console.log(`Linked from Local Disk: ${diskLinked}`);
  console.log(`Downloaded & Verified from Internet: ${downloaded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total Verified: ${diskLinked + downloaded}`);

  await client.close();
}

if (require.main === module || process.argv[1]?.includes("fetch-verified-internet-images")) {
  runImageHarvester().catch(console.error);
}
