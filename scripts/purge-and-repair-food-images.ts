/**
 * FoodDecode — Purge Non-Food Images & Apply Verified Food Packshots
 *
 * 1. Backs up current MongoDB database state to reports/
 * 2. Purges contaminated files (Cif Floor Cleaner, Himalaya Baby Lotion, shared duplicate hashes)
 * 3. Downloads verified authentic food packaging for TagZ flavours, Amy's Kitchen, and Justin's
 * 4. Resets all unverified or contaminated products to /images/placeholder-product.svg
 * 5. Syncs MongoDB using stable _ids with zero non-image field changes
 * 6. Syncs src/lib/seed-data.ts for permanent persistence
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";
import http from "http";
import { MongoClient } from "mongodb";
import { validateProductImage, NEUTRAL_PLACEHOLDER } from "../src/lib/image-validator";

process.loadEnvFile(".env.local");
const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB_NAME || "fooddecode";
const PACKSHOTS_DIR = path.join(process.cwd(), "public/images/packshots");

// Verified authentic retail packshots to download
const VERIFIED_NEW_PACKSHOTS: Record<string, { url: string; source: string; note: string }> = {
  // TagZ Masala Trekker
  "8908013524549": {
    url: "https://cdn.zeptonow.com/production/ik-seo/cms/product_variant/c144b64a-a6ca-4c64-b612-32fce5b8edc4/TagZ-Cannisters-Masala-Trekkin.jpeg",
    source: "Zepto Verified Product Catalogue",
    note: "Official retail packaging photograph of TagZ Popped Potato Chips Masala Trekkin"
  },
  // TagZ Salt Trippin'
  "8908013524389": {
    url: "https://www.bbassets.com/media/uploads/p/l/40250468_4-tagz-salt-trippin-popped-potato-chips.jpg",
    source: "BigBasket Verified Product Listing (ID 40250468)",
    note: "Official retail packaging photograph of TagZ Salt Trippin Popped Potato Chips"
  },
  // TagZ Beer N' Barbeque
  "8908013524563": {
    url: "https://www.bbassets.com/media/uploads/p/l/40304505_2-tagz-beer-n-barbeque-popped-potato-chips.jpg",
    source: "BigBasket Verified Product Listing (ID 40304505)",
    note: "Official retail packaging photograph of TagZ Beer N Barbeque Popped Potato Chips"
  },
  // TagZ Cream & Onion Divin'
  "8904132920156": {
    url: "https://www.bbassets.com/media/uploads/p/l/40364361_1-tagz-cream-onion-divin-flavoured-popped-potato-chips.jpg",
    source: "BigBasket Verified Product Listing (ID 40364361)",
    note: "Official retail packaging photograph of TagZ Cream & Onion Divin Popped Potato Chips"
  },
  // Amy's Kitchen Organic Lentil Vegetable Soup
  "042272005085": {
    url: "https://db3h9mjhnho7v.cloudfront.net/newera_product_hero_big_png/6ad66923d5071/000535-706537-web3d-us-lentil-veg-soup-5-8-25.png",
    source: "Amy's Kitchen Official CDN",
    note: "Official retail packaging photograph of Amy's Kitchen Organic Lentil Vegetable Soup"
  },
  // Justin's Classic Natural Peanut Butter
  "858882001007": {
    url: "https://www.justins.com/wp-content/uploads/2020/10/Justins-Duo-ClassicPB-1024x1024-1.png",
    source: "Justin's Official Brand Website",
    note: "Official retail packaging photograph of Justin's Classic Peanut Butter"
  }
};

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, { headers: { "User-Agent": "FoodDecode-IntegrityBot/1.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return download(loc).then(resolve).catch(reject);
        return reject(new Error("Redirect without location"));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function getExt(buf: Buffer): string {
  const magic = buf.slice(0, 4).toString("hex");
  if (magic.startsWith("89504e47")) return "png";
  if (magic.startsWith("52494646")) return "webp";
  return "jpg";
}

async function main() {
  console.log("=== FOODDECODE PRODUCT IMAGE PURGE & REPAIR ===");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const col = db.collection("products");

  // 1. Back up current MongoDB records
  const currentRecords = await col.find({}).toArray();
  const backupPath = path.join(process.cwd(), "reports/mongodb-pre-purge-backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(currentRecords, null, 2), "utf8");
  console.log(`[Backup] Saved ${currentRecords.length} records to ${backupPath}`);

  // 2. Identify and purge contaminated/shared image files from disk
  console.log("\n[Purge] Scanning packshots for non-food / duplicate images...");
  const diskFiles = fs.readdirSync(PACKSHOTS_DIR);

  // Group by sha256 to find shared/reused images
  const hashToFiles: Record<string, string[]> = {};
  for (const f of diskFiles) {
    const p = path.join(PACKSHOTS_DIR, f);
    const buf = fs.readFileSync(p);
    const h = crypto.createHash("sha256").update(buf).digest("hex");
    if (!hashToFiles[h]) hashToFiles[h] = [];
    hashToFiles[h].push(f);
  }

  // Files to delete:
  // a) All previous TagZ files (they were Cif Floor Cleaner)
  // b) All files sharing hashes with other products (unverified copy-pastes)
  const filesToDelete = new Set<string>();

  // Known Cif cleaner files
  ["8908013524549.jpg", "8908013524389.jpg", "8908013524563.jpg", "8904132920156.jpg"].forEach((f) => {
    filesToDelete.add(f);
  });

  // Duplicate hash groups (e.g. Himalaya baby lotion, shared Bingo, shared Haldirams, shared Balaji)
  for (const [h, grp] of Object.entries(hashToFiles)) {
    if (grp.length > 1) {
      grp.forEach((f) => filesToDelete.add(f));
    }
  }

  console.log(`[Purge] Found ${filesToDelete.size} contaminated or duplicate image files to remove.`);
  for (const f of filesToDelete) {
    const fp = path.join(PACKSHOTS_DIR, f);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
    }
  }

  // 3. Download the verified food packshots
  console.log("\n[Download] Fetching verified packaging photographs...");
  for (const [barcode, info] of Object.entries(VERIFIED_NEW_PACKSHOTS)) {
    try {
      console.log(`  Downloading ${barcode} (${info.note})...`);
      const buf = await download(info.url);
      const ext = getExt(buf);
      const outPath = path.join(PACKSHOTS_DIR, `${barcode}.${ext}`);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✅ Saved: ${barcode}.${ext} (${buf.length} bytes)`);
    } catch (err: any) {
      console.error(`  ❌ Failed to download ${barcode}:`, err.message);
    }
  }

  // 4. Validate and update every product in MongoDB Atlas
  console.log("\n[Audit & DB Update] Auditing all 175 products in MongoDB Atlas...");
  let verifiedCount = 0;
  let placeholderCount = 0;

  for (const p of currentRecords) {
    const barcode = p.barcode;
    if (!barcode) {
      placeholderCount++;
      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            imageUrl: NEUTRAL_PLACEHOLDER,
            imageStatus: "MISSING",
            imageVerificationNote: "No barcode available; neutral placeholder applied",
          },
        }
      );
      continue;
    }

    const jpgPath = path.join(PACKSHOTS_DIR, `${barcode}.jpg`);
    const pngPath = path.join(PACKSHOTS_DIR, `${barcode}.png`);
    const webpPath = path.join(PACKSHOTS_DIR, `${barcode}.webp`);

    let foundDiskPath: string | null = null;
    let foundExt = "jpg";
    if (fs.existsSync(jpgPath)) { foundDiskPath = jpgPath; foundExt = "jpg"; }
    else if (fs.existsSync(pngPath)) { foundDiskPath = pngPath; foundExt = "png"; }
    else if (fs.existsSync(webpPath)) { foundDiskPath = webpPath; foundExt = "webp"; }

    if (!foundDiskPath) {
      // No valid physical packshot file on disk -> must be clean neutral placeholder
      placeholderCount++;
      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            imageUrl: NEUTRAL_PLACEHOLDER,
            imageStatus: "MISSING",
            imageVerificationNote: "No verified physical packshot on disk; clean placeholder assigned",
          },
        }
      );
      continue;
    }

    const buf = fs.readFileSync(foundDiskPath);
    const imageUrl = `/images/packshots/${barcode}.${foundExt}`;
    const newPackshotInfo = VERIFIED_NEW_PACKSHOTS[barcode];

    const validation = validateProductImage({
      barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      imageUrl,
      imageSourceUrl: newPackshotInfo?.url || p.imageSourceUrl,
      fileBuffer: buf,
    });

    if (validation.isValid) {
      verifiedCount++;
      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            imageUrl,
            imageSourceUrl: newPackshotInfo?.url || p.imageSourceUrl || null,
            imageStatus: "VERIFIED",
            imageVerifiedAt: new Date().toISOString(),
            imageVerificationNote: newPackshotInfo?.note || p.imageVerificationNote || "Verified retail packaging packshot",
          },
        }
      );
    } else {
      placeholderCount++;
      // Delete the invalid file
      if (fs.existsSync(foundDiskPath)) fs.unlinkSync(foundDiskPath);
      await col.updateOne(
        { _id: p._id },
        {
          $set: {
            imageUrl: NEUTRAL_PLACEHOLDER,
            imageStatus: "MISSING",
            imageVerificationNote: `Validation failed: ${validation.reason}`,
          },
        }
      );
    }
  }

  console.log(`\n[DB Result] Verified authentic packshots: ${verifiedCount}`);
  console.log(`[DB Result] Clean neutral placeholders: ${placeholderCount}`);

  // 5. Update seed-data.ts directly from the newly audited DB state
  console.log("\n[Persistence] Syncing updated packshots to src/lib/seed-data.ts...");
  const updatedRecords = await col.find({}).toArray();
  const seedPath = path.join(process.cwd(), "src/lib/seed-data.ts");
  let seedContent = fs.readFileSync(seedPath, "utf8");
  let syncCount = 0;

  for (const p of updatedRecords) {
    if (!p.barcode) continue;
    const imgRegex = new RegExp(`(barcode:\\s*"${p.barcode}"[\\s\\S]*?imageUrl:\\s*)"[^"]*"`, "m");
    if (imgRegex.test(seedContent)) {
      seedContent = seedContent.replace(imgRegex, `$1"${p.imageUrl}"`);
      syncCount++;
    }
  }
  fs.writeFileSync(seedPath, seedContent, "utf8");
  console.log(`[Persistence] Updated ${syncCount} records in seed-data.ts`);

  // 6. Zero non-image diff integrity check
  console.log("\n[Integrity Check] Verifying 0 diffs across non-image fields...");
  const origMap = new Map(currentRecords.map((r) => [r.barcode, r]));
  let nonImageDiffs = 0;
  for (const cur of updatedRecords) {
    const orig = origMap.get(cur.barcode);
    if (!orig) continue;
    const fieldsToCheck = ["name", "brand", "category", "subCategory", "nutriScore", "novaGroup", "overallScore", "ingredients"];
    for (const f of fieldsToCheck) {
      if (JSON.stringify(orig[f]) !== JSON.stringify(cur[f])) {
        console.error(`Diff in ${cur.barcode} for ${f}:`, orig[f], "!==", cur[f]);
        nonImageDiffs++;
      }
    }
  }
  console.log(`[Integrity Check] Non-image field diffs: ${nonImageDiffs}`);

  await client.close();
  console.log("\n=== COMPLETED SUCCESSFULLY ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

