import fs from "fs";
import crypto from "crypto";
import { SEED_PRODUCTS } from "../src/lib/seed-data";

// 1. Check all products
console.log("Total products in SEED_PRODUCTS:", SEED_PRODUCTS.length);

const nonFoodKeywords = [
  "wallpaper", "shutterstock", "flickr", "ytimg", "youtube", "pngtree", "poojn", 
  "madrasreview", "wikimedia", "wikipedia", "freepik", "vecteezy", "pixabay", "unsplash",
  "dreamstime", "istockphoto", "alamy", "indiamart", "facebook", "twitter", "instagram",
  "recruit", "vacancy", "exam", "job", "banner", "meme", "logo", "clipart", "silhouette",
  "drawing", "vector", "sketch", "scribd", "xiaopiu", "pinterest", "untitledui", "untitled-ui",
  "pressure-cooker", "bucket", "city", "watermark"
];

// Hash of image files
const hashToProducts: Record<string, any[]> = {};
const flagged: any[] = [];

for (const p of SEED_PRODUCTS) {
  const brand = (p.brand || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  const src = (p.imageSourceUrl || "").toLowerCase();
  const imgUrl = (p.imageUrl || "").toLowerCase();

  let isFlagged = false;
  let flagReason = "";

  // Check keyword matches in source URL or image URL
  const hitKw = nonFoodKeywords.find(kw => src.includes(kw) || imgUrl.includes(kw));
  if (hitKw) {
    isFlagged = true;
    flagReason = `KEYWORD_${hitKw}`;
  }

  // Check specific brands requested by user
  if (brand === "noice") {
    isFlagged = true;
    flagReason = flagReason ? `${flagReason}+NOICE` : "NOICE";
  } else if (brand.includes("let") && brand.includes("try")) {
    isFlagged = true;
    flagReason = flagReason ? `${flagReason}+LETSTRY` : "LETSTRY";
  }

  // Check file on disk
  const diskPath = "public" + p.imageUrl;
  if (!fs.existsSync(diskPath)) {
    isFlagged = true;
    flagReason = flagReason ? `${flagReason}+MISSING_FILE` : "MISSING_FILE";
  } else {
    const buf = fs.readFileSync(diskPath);
    const hash = crypto.createHash("md5").update(buf).digest("hex");
    if (!hashToProducts[hash]) hashToProducts[hash] = [];
    hashToProducts[hash].push({ barcode: p.barcode, name: p.name, brand: p.brand });
  }

  if (isFlagged) {
    flagged.push({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      imageUrl: p.imageUrl,
      imageSourceUrl: p.imageSourceUrl,
      reason: flagReason
    });
  }
}

// Find hashes shared across products of DIFFERENT brands or DIFFERENT product types
const suspiciousDuplicates: any[] = [];
for (const [hash, prods] of Object.entries(hashToProducts)) {
  if (prods.length > 1) {
    const brands = new Set(prods.map(p => p.brand));
    // If multiple brands share the exact same image hash, that's definitely wrong
    if (brands.size > 1) {
      suspiciousDuplicates.push({ hash, count: prods.length, brands: Array.from(brands), products: prods });
    }
  }
}

console.log("Total flagged products initially:", flagged.length);
console.log("Image hashes shared across multiple DIFFERENT brands:", suspiciousDuplicates.length);
for (const s of suspiciousDuplicates) {
  console.log(`Hash ${s.hash} shared by brands: ${s.brands.join(", ")} (${s.count} prods)`);
  for (const p of s.products) {
    if (!flagged.some(f => f.barcode === p.barcode)) {
      flagged.push({
        barcode: p.barcode,
        name: p.name,
        brand: p.brand,
        imageUrl: (SEED_PRODUCTS.find(x => x.barcode === p.barcode) as any)?.imageUrl,
        reason: `SHARED_CROSS_BRAND_HASH_${s.hash}`
      });
    }
  }
}

console.log("Total flagged products after cross-brand deduplication check:", flagged.length);
fs.writeFileSync("scripts/audit_suspicious_images.json", JSON.stringify(flagged, null, 2));
