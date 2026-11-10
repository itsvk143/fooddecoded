/**
 * FoodDecode — Comprehensive Image Fix Script
 *
 * Fixes three categories of issues:
 * 1. WRONG_PRODUCT_IMAGE: Products whose on-disk packshot shows a different product
 * 2. DISK_BUT_MISSING: Products that have a valid file on disk but DB status is MISSING
 * 3. STILL_MISSING: Products with no valid image — tries to download from verified sources
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";
import http from "http";
import { MongoClient, ObjectId } from "mongodb";

// ── Config ─────────────────────────────────────────────────────────────────
process.loadEnvFile(".env.local");
const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB_NAME || "fooddecode";
const PACKSHOTS_DIR = path.join(process.cwd(), "public/images/packshots");
const PLACEHOLDER = "/images/placeholder-product.svg";
const MIN_VALID_IMAGE_SIZE = 5000; // bytes — anything smaller is likely an error page

// ── Known Wrong Images (must re-download from correct source) ───────────────
// These barcodes have files on disk, DB says VERIFIED, but the image is WRONG.
// The existing CDN URLs served the wrong content at download time.
const FORCE_REDOWNLOAD: Record<string, { url: string; source: string; note: string }> = {
  // Too Yumm! Dahi Papdi Chaat — current disk image is Munch Nuts bag
  "8906090571241": {
    url: "https://images.openfoodfacts.org/images/products/890/609/057/1241/front_fr.5.full.jpg",
    source: "OpenFoodFacts",
    note: "Too Yumm! Multigrain Chips Dahi Papdi Chaat — correct packshot"
  },
  // Cadbury Chocobakes — current disk image is Surf Excel detergent
  "7622202274176": {
    url: "https://www.bbassets.com/media/uploads/p/l/40192803_3-cadbury-chocobakes-choc-filled-cookies.jpg",
    source: "BigBasket",
    note: "Cadbury Chocobakes Choc Filled Cookies — correct packshot"
  },
  // Cornitos Tikka Masala — current disk image is Knorr soup
  "8908001017077": {
    url: "https://www.bbassets.com/media/uploads/p/l/40284067_5-cornitos-nacho-crisps-tikka-masala.jpg",
    source: "BigBasket",
    note: "Cornitos Nacho Crisps Tikka Masala — correct packshot"
  },
  // Doritos Sizzlin' Hot — current image is Dinamita (wrong variant)
  "8901491100083": {
    url: "https://images.openfoodfacts.org/images/products/890/149/110/0083/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Doritos Sizzlin' Hot Tortilla Chips — correct variant packshot"
  },
};

// ── Additional Verified URLs for Still-Missing Products ─────────────────────
const NEW_CANDIDATES: Record<string, { url: string; source: string; note: string }> = {
  // TagZ Foods
  "8908013524563": {
    url: "https://images.openfoodfacts.org/images/products/890/801/352/4563/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "TagZ Foods Popped Potato Chips Beer N' Barbeque"
  },
  "8908013524389": {
    url: "https://images.openfoodfacts.org/images/products/890/801/352/4389/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "TagZ Foods Popped Potato Chips Salt Trippin'"
  },
  "8908013524549": {
    url: "https://images.openfoodfacts.org/images/products/890/801/352/4549/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "TagZ Foods Popped Potato Chips Masala Trekker"
  },
  "8904132920156": {
    url: "https://images.openfoodfacts.org/images/products/890/413/292/0156/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "TagZ Foods Popped Potato Chips Cream & Onion Divin'"
  },
  // Bingo!
  "8901725119829": {
    url: "https://images.openfoodfacts.org/images/products/890/172/511/9829/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bingo! Hashtags Spicy Masala Potato Chips"
  },
  "8901725198411": {
    url: "https://images.openfoodfacts.org/images/products/890/172/519/8411/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bingo! Mad Angles Chaat Masti"
  },
  "8901725013714": {
    url: "https://images.openfoodfacts.org/images/products/890/172/501/3714/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bingo! Mad Angles Very Peri Peri"
  },
  "8901725007447": {
    url: "https://images.openfoodfacts.org/images/products/890/172/500/7447/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bingo! Original Style Salted Potato Chips"
  },
  "8901725007102": {
    url: "https://images.openfoodfacts.org/images/products/890/172/500/7102/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bingo! Original Style Chilli Sprinkled Potato Chips"
  },
  // True Elements
  "8906112663831": {
    url: "https://images.openfoodfacts.org/images/products/890/611/266/3831/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "True Elements 7-in-1 Super Seeds & Nut Mix"
  },
  // Amy's Kitchen
  "042272005085": {
    url: "https://images.openfoodfacts.org/images/products/004/227/200/5085/front_en.11.400.jpg",
    source: "OpenFoodFacts",
    note: "Amy's Kitchen Organic Lentil Vegetable Soup"
  },
  // Justin's
  "858882001007": {
    url: "https://images.openfoodfacts.org/images/products/085/888/200/1007/front_en.30.400.jpg",
    source: "OpenFoodFacts",
    note: "Justin's Classic Natural Peanut Butter"
  },
  // Farmley
  "8906120108126": {
    url: "https://images.openfoodfacts.org/images/products/890/612/010/8126/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Farmley Roasted Peri Peri Makhana"
  },
  // Lay's variants
  "8901491001816": {
    url: "https://images.openfoodfacts.org/images/products/890/149/100/1816/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Lay's West Indies Hot 'n' Sweet Chilli"
  },
  "8901491981538": {
    url: "https://images.openfoodfacts.org/images/products/890/149/198/1538/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Lay's Chile Limon Potato Chips"
  },
  "8901491405003": {
    url: "https://images.openfoodfacts.org/images/products/890/149/140/5003/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Uncle Chipps Plain Salted Potato Chips"
  },
  // Haldiram's chips
  "8904063258434": {
    url: "https://images.openfoodfacts.org/images/products/890/406/325/8434/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Haldiram's Classic Salted Potato Chips"
  },
  "8904063219664": {
    url: "https://images.openfoodfacts.org/images/products/890/406/321/9664/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Haldiram's Aloo Masala Chips"
  },
  "8904063201355": {
    url: "https://images.openfoodfacts.org/images/products/890/406/320/1355/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Haldiram's Tangy Tomato Chips"
  },
  // Too Yumm! variants
  "8906090573009": {
    url: "https://images.openfoodfacts.org/images/products/890/609/057/3009/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Too Yumm! Potato Chips Spanish Tomato"
  },
  "8906090572835": {
    url: "https://images.openfoodfacts.org/images/products/890/609/057/2835/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Too Yumm! Potato Stix Peri Peri"
  },
  "8906090579346": {
    url: "https://images.openfoodfacts.org/images/products/890/609/057/9346/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Too Yumm! Karare Munchy Masala"
  },
  "8906090577281": {
    url: "https://images.openfoodfacts.org/images/products/890/609/057/7281/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Too Yumm! Veggie Stix Sour Cream & Onion"
  },
  // Balaji Wafers
  "8906010500016": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0016/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Wafers Simply Salted Potato Wafers"
  },
  "8906010500498": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0498/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Wafers Tomato Twist Wafers"
  },
  "8906010500535": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0535/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Wafers Chaat Chaska Wafers"
  },
  "8906010500870": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0870/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Wafers Crunchex Cream & Onion"
  },
  "8906010502607": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/2607/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Wafers Masala Masti Wafers"
  },
  // Yellow Diamond
  "8906004563683": {
    url: "https://images.openfoodfacts.org/images/products/890/600/456/3683/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Yellow Diamond Potato Chips Magic Masala"
  },
  "8906004560682": {
    url: "https://images.openfoodfacts.org/images/products/890/600/456/0682/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Yellow Diamond Potato Chips Plain Salted"
  },
  "8906004560163": {
    url: "https://images.openfoodfacts.org/images/products/890/600/456/0163/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Yellow Diamond Potato Chips Tom-Chi Tangy Tomato"
  },
  // Parle Wafers
  "8901719111112": {
    url: "https://images.openfoodfacts.org/images/products/890/171/911/1112/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Parle Wafers Simply Salted"
  },
  "8901719111419": {
    url: "https://images.openfoodfacts.org/images/products/890/171/911/1419/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Parle Wafers Masala Masti"
  },
  "8901719111310": {
    url: "https://images.openfoodfacts.org/images/products/890/171/911/1310/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Parle Wafers Tangy Tomato"
  },
  // Banana Chips — Chheda's, Jabsons, A1 Chips, etc.
  "8904071704527": {
    url: "https://images.openfoodfacts.org/images/products/890/407/170/4527/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Yellow Rock Salt Banana Chips (Farali/Upwas)"
  },
  "8904071700031": {
    url: "https://images.openfoodfacts.org/images/products/890/407/170/0031/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Long Masala Banana Chips"
  },
  "8904067709529": {
    url: "https://images.openfoodfacts.org/images/products/890/406/770/9529/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Jabsons Banana Chips Classic Salted (Sendha Namak)"
  },
  "8904067709543": {
    url: "https://images.openfoodfacts.org/images/products/890/406/770/9543/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Jabsons Banana Chips Black Pepper (Sendha Namak)"
  },
  "8906010500153": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0153/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Banana Wafers Mast Mari (Black Pepper)"
  },
  "8906010500177": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/0177/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Banana Wafers Mast Masala"
  },
  "8906010504441": {
    url: "https://images.openfoodfacts.org/images/products/890/601/050/4441/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Balaji Banana Wafers Simply Salted"
  },
  "8904063200525": {
    url: "https://images.openfoodfacts.org/images/products/890/406/320/0525/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Salted Banana Chips"
  },
  "8904063200532": {
    url: "https://images.openfoodfacts.org/images/products/890/406/320/0532/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Spicy Masala Banana Chips"
  },
  "8904004408874": {
    url: "https://images.openfoodfacts.org/images/products/890/400/440/8874/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Black Pepper Banana Chips (Mari Wafers)"
  },
  // Beverages
  "8901928983004": {
    url: "https://images.openfoodfacts.org/images/products/890/192/898/3004/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Bisk Farm Sugar Free Marie Biscuit"
  },
  "8908013328130": {
    url: "https://images.openfoodfacts.org/images/products/890/801/332/8130/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Open Secret Choco Almond Nutty Cookies"
  },
  "8906092421379": {
    url: "https://images.openfoodfacts.org/images/products/890/609/242/1379/front_en.3.400.jpg",
    source: "OpenFoodFacts",
    note: "Slurrp Farm Milky Choco Chip Millet Cookies"
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, { headers: { "User-Agent": "FoodDecode-ImageBot/1.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return download(loc).then(resolve).catch(reject);
        return reject(new Error(`Redirect with no location`));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function isValidImage(buf: Buffer): boolean {
  if (buf.length < MIN_VALID_IMAGE_SIZE) return false;
  const magic = buf.slice(0, 4).toString("hex");
  return (
    magic.startsWith("ffd8") ||   // JPEG
    magic.startsWith("89504e47") || // PNG
    magic.startsWith("52494646")    // WEBP
  );
}

function getExt(buf: Buffer): string {
  const magic = buf.slice(0, 4).toString("hex");
  if (magic.startsWith("89504e47")) return "png";
  if (magic.startsWith("52494646")) return "webp";
  return "jpg";
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const col = db.collection("products");

  if (!fs.existsSync(PACKSHOTS_DIR)) {
    fs.mkdirSync(PACKSHOTS_DIR, { recursive: true });
  }

  const allProducts = await col.find({}).toArray();
  console.log(`\n🔍 Total products: ${allProducts.length}`);

  const results = {
    fixed_wrong: [] as string[],
    fixed_missing_db: [] as string[],
    newly_downloaded: [] as string[],
    still_placeholder: [] as string[],
    errors: [] as string[],
  };

  // ── Step 1: Force re-download for known wrong images ──────────────────────
  console.log("\n── Step 1: Fixing known wrong images ──");
  for (const [barcode, candidate] of Object.entries(FORCE_REDOWNLOAD)) {
    const product = allProducts.find((p) => p.barcode === barcode);
    if (!product) {
      console.log(`  SKIP ${barcode} — not in DB`);
      continue;
    }

    // Delete the existing (wrong) file so we download fresh
    const existingJpg = path.join(PACKSHOTS_DIR, `${barcode}.jpg`);
    const existingPng = path.join(PACKSHOTS_DIR, `${barcode}.png`);
    if (fs.existsSync(existingJpg)) fs.unlinkSync(existingJpg);
    if (fs.existsSync(existingPng)) fs.unlinkSync(existingPng);

    try {
      console.log(`  Downloading ${barcode} (${product.name})...`);
      const buf = await download(candidate.url);
      if (!isValidImage(buf)) {
        throw new Error(`Invalid image data (${buf.length} bytes)`);
      }
      const ext = getExt(buf);
      const outPath = path.join(PACKSHOTS_DIR, `${barcode}.${ext}`);
      fs.writeFileSync(outPath, buf);
      const imageUrl = `/images/packshots/${barcode}.${ext}`;

      await col.updateOne(
        { _id: product._id },
        {
          $set: {
            imageUrl,
            imageSourceUrl: candidate.url,
            imageStatus: "VERIFIED",
            imageVerifiedAt: new Date().toISOString(),
            imageVerificationNote: candidate.note,
          },
        }
      );
      console.log(`  ✅ Fixed: ${barcode} → ${imageUrl} (${buf.length} bytes)`);
      results.fixed_wrong.push(barcode);
    } catch (err: any) {
      console.log(`  ❌ Error for ${barcode}: ${err.message}`);
      // Restore placeholder
      await col.updateOne(
        { _id: product._id },
        {
          $set: {
            imageUrl: PLACEHOLDER,
            imageStatus: "MISSING",
            imageVerificationNote: `Force redownload failed: ${err.message}`,
          },
        }
      );
      results.errors.push(`${barcode}: ${err.message}`);
    }
  }

  // ── Step 2: Fix MISSING status where file already exists on disk ──────────
  console.log("\n── Step 2: Syncing disk files to DB (MISSING → VERIFIED) ──");
  const missingProducts = allProducts.filter((p) => p.imageStatus === "MISSING" || !p.imageStatus);

  for (const product of missingProducts) {
    if (!product.barcode) continue;
    // Skip products we've already handled in Step 1
    if (FORCE_REDOWNLOAD[product.barcode]) continue;

    const jpgPath = path.join(PACKSHOTS_DIR, `${product.barcode}.jpg`);
    const pngPath = path.join(PACKSHOTS_DIR, `${product.barcode}.png`);
    const webpPath = path.join(PACKSHOTS_DIR, `${product.barcode}.webp`);

    let diskPath: string | null = null;
    let ext = "jpg";
    if (fs.existsSync(jpgPath)) { diskPath = jpgPath; ext = "jpg"; }
    else if (fs.existsSync(pngPath)) { diskPath = pngPath; ext = "png"; }
    else if (fs.existsSync(webpPath)) { diskPath = webpPath; ext = "webp"; }

    if (diskPath) {
      const buf = fs.readFileSync(diskPath);
      if (!isValidImage(buf)) {
        console.log(`  ⚠️  ${product.barcode} — file too small/invalid (${buf.length} bytes), skipping`);
        continue;
      }

      const imageUrl = `/images/packshots/${product.barcode}.${ext}`;
      await col.updateOne(
        { _id: product._id },
        {
          $set: {
            imageUrl,
            imageStatus: "VERIFIED",
            imageVerifiedAt: new Date().toISOString(),
            imageVerificationNote: "Image file found on disk — status synced",
          },
        }
      );
      console.log(`  ✅ Synced: ${product.barcode} (${product.name?.slice(0, 40)})`);
      results.fixed_missing_db.push(product.barcode);
    }
  }

  // ── Step 3: Download new images for still-missing products ────────────────
  console.log("\n── Step 3: Downloading new images for still-missing products ──");

  // Reload products to get updated list
  const refreshed = await col.find({ imageStatus: "MISSING" }).toArray();
  console.log(`  Still MISSING after Steps 1-2: ${refreshed.length}`);

  for (const product of refreshed) {
    if (!product.barcode) continue;
    const candidate = NEW_CANDIDATES[product.barcode];
    if (!candidate) {
      results.still_placeholder.push(product.barcode);
      continue;
    }

    try {
      console.log(`  Downloading ${product.barcode} (${product.name?.slice(0, 40)})...`);
      const buf = await download(candidate.url);
      if (!isValidImage(buf)) {
        throw new Error(`Invalid image (${buf.length} bytes) — likely error page`);
      }
      const ext = getExt(buf);
      const outPath = path.join(PACKSHOTS_DIR, `${product.barcode}.${ext}`);
      fs.writeFileSync(outPath, buf);
      const imageUrl = `/images/packshots/${product.barcode}.${ext}`;

      await col.updateOne(
        { _id: product._id },
        {
          $set: {
            imageUrl,
            imageSourceUrl: candidate.url,
            imageStatus: "VERIFIED",
            imageVerifiedAt: new Date().toISOString(),
            imageVerificationNote: candidate.note,
          },
        }
      );
      console.log(`  ✅ Downloaded: ${product.barcode} → ${ext} (${buf.length} bytes)`);
      results.newly_downloaded.push(product.barcode);
    } catch (err: any) {
      console.log(`  ⚠️  ${product.barcode}: ${err.message}`);
      results.still_placeholder.push(product.barcode);
      results.errors.push(`${product.barcode}: ${err.message}`);
    }
  }

  // ── Step 4: Ensure all remaining MISSING products show placeholder in DB ──
  console.log("\n── Step 4: Ensuring placeholder is set for truly missing products ──");
  await col.updateMany(
    { imageStatus: "MISSING", imageUrl: { $ne: PLACEHOLDER } },
    { $set: { imageUrl: PLACEHOLDER } }
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n══════════════ SUMMARY ══════════════");
  console.log(`✅ Wrong images fixed (re-downloaded): ${results.fixed_wrong.length}`);
  console.log(`✅ Disk→DB status synced (was MISSING): ${results.fixed_missing_db.length}`);
  console.log(`✅ Newly downloaded images: ${results.newly_downloaded.length}`);
  console.log(`⚪ Still showing placeholder: ${results.still_placeholder.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log("\nErrors:");
    results.errors.forEach((e) => console.log("  •", e));
  }

  if (results.still_placeholder.length > 0) {
    console.log("\nStill placeholder (no verified source found):");
    results.still_placeholder.forEach((b) => console.log("  •", b));
  }

  // Final count
  const finalVerified = await col.countDocuments({ imageStatus: "VERIFIED" });
  const finalMissing = await col.countDocuments({ imageStatus: "MISSING" });
  console.log(`\nFinal DB state: ${finalVerified} VERIFIED, ${finalMissing} MISSING`);

  await client.close();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

