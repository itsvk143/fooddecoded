import fs from "fs";
import { SEED_PRODUCTS } from "../src/lib/seed-data";

const suspiciousPatterns = [
  "wallpaper", "shutterstock", "flickr", "ytimg", "youtube", "pngtree", "poojn", 
  "madrasreview", "wikimedia", "wikipedia", "freepik", "vecteezy", "pixabay", "unsplash",
  "dreamstime", "istockphoto", "alamy", "indiamart", "facebook", "twitter", "instagram",
  "recruit", "vacancy", "exam", "job", "banner", "meme", "logo", "clipart", "silhouette",
  "drawing", "vector", "sketch", "scribd", "starbucks", "xiaopiu", "pinterest"
];

const flagged: any[] = [];

for (const p of SEED_PRODUCTS) {
  const isNoice = p.brand.toLowerCase() === "noice";
  const isLetstry = p.brand.toLowerCase() === "let's try";
  const isTgscMakhana = p.barcode === "8908930002304";
  const src = (p.imageSourceUrl || "").toLowerCase();
  const img = (p.imageUrl || "").toLowerCase();

  const hit = suspiciousPatterns.find(pat => src.includes(pat) || img.includes(pat));

  if (isNoice || isLetstry || isTgscMakhana || hit) {
    flagged.push({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subCategory: p.subCategory,
      src: p.imageSourceUrl,
      img: p.imageUrl,
      reason: isNoice ? "NOICE_CATALOG" : isLetstry ? "LETSTRY_CATALOG" : isTgscMakhana ? "TGSC_MAKHANA" : `HIT_${hit}`
    });
  }
}

console.log("Total flagged products for repair:", flagged.length);
const byReason: Record<string, number> = {};
for (const f of flagged) {
  byReason[f.reason] = (byReason[f.reason] || 0) + 1;
}
console.log("Breakdown by reason:", byReason);

fs.writeFileSync("scripts/flagged_products_for_repair.json", JSON.stringify(flagged, null, 2));
