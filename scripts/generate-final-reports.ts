import { getDb } from "../src/lib/mongodb";
import fs from "fs";
import path from "path";

async function generateReports() {
  const db = await getDb();
  if (!db) {
    console.error("No DB connection");
    process.exit(1);
  }
  const products = await db.collection("products").find({}).sort({ category: 1, subCategory: 1, name: 1 }).toArray();

  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const total = products.length;
  const verifiedProducts = products.filter(p => p.imageStatus === "VERIFIED" && !p.imageUrl?.includes("placeholder"));
  const placeholderProducts = products.filter(p => p.imageUrl?.includes("placeholder") || p.imageStatus !== "VERIFIED");

  // 1. JSON Report
  const jsonReport = {
    generatedAt: new Date().toISOString(),
    totalProducts: total,
    verifiedCount: verifiedProducts.length,
    placeholderCount: placeholderProducts.length,
    products: products.map(p => ({
      id: p._id.toString(),
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subCategory: p.subCategory,
      imageUrl: p.imageUrl,
      imageSourceUrl: p.imageSourceUrl,
      imageStatus: p.imageStatus,
      verified: p.verified
    }))
  };
  fs.writeFileSync(path.join(reportsDir, "fooddecode-image-mismatch-audit.json"), JSON.stringify(jsonReport, null, 2), "utf8");

  // 2. CSV Repair Log
  const csvRows = [
    ["Barcode", "Brand", "Product Name", "Category", "SubCategory", "Image URL", "Source URL", "Status"].join(",")
  ];
  for (const p of products) {
    const row = [
      `"${p.barcode}"`,
      `"${p.brand}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.subCategory || ""}"`,
      `"${p.imageUrl || ""}"`,
      `"${(p.imageSourceUrl || "").replace(/"/g, '""')}"`,
      `"${p.imageStatus || ""}"`
    ];
    csvRows.push(row.join(","));
  }
  fs.writeFileSync(path.join(reportsDir, "fooddecode-image-repair-log.csv"), csvRows.join("\n"), "utf8");

  // 3. Unresolved Images Markdown
  let unresolvedMd = `# FoodDecode — Unresolved Products Retaining Clean Placeholders\n\n`;
  unresolvedMd += `Generated on: ${new Date().toISOString()}\n\n`;
  unresolvedMd += `Total Unresolved / Missing Packshots: **${placeholderProducts.length}**\n\n`;
  unresolvedMd += `Per the strict food image integrity policy, products without an independently verified retail packaging photograph are mapped to \`/images/placeholder-product.svg\` with status \`MISSING\` and never display a green verified badge.\n\n`;
  unresolvedMd += `| Barcode | Brand | Product Name | SubCategory | Current Status |\n`;
  unresolvedMd += `| :--- | :--- | :--- | :--- | :--- |\n`;
  for (const p of placeholderProducts) {
    unresolvedMd += `| \`${p.barcode}\` | **${p.brand}** | ${p.name} | ${p.subCategory || p.category} | \`${p.imageStatus}\` |\n`;
  }
  fs.writeFileSync(path.join(reportsDir, "fooddecode-unresolved-images.md"), unresolvedMd, "utf8");

  // 4. Narrative Audit Markdown
  let auditMd = `# FoodDecode — Comprehensive Catalogue Image Audit & Repair Report\n\n`;
  auditMd += `Generated: ${new Date().toISOString()}\n\n`;
  auditMd += `## Executive Summary\n\n`;
  auditMd += `- **Total Catalogue Products:** ${total}\n`;
  auditMd += `- **Authentic Packshots Verified & Stored:** ${verifiedProducts.length} (${((verifiedProducts.length / total) * 100).toFixed(1)}%)\n`;
  auditMd += `- **Clean Neutral Placeholders (Zero Green Badges):** ${placeholderProducts.length} (${((placeholderProducts.length / total) * 100).toFixed(1)}%)\n\n`;
  auditMd += `## Root Causes of Prior Mismatches\n\n`;
  auditMd += `1. **BigBasket SKU Slug Agnosticism:** An earlier script (\`build-complete-packshot-catalog.ts\`) assumed BigBasket URLs route on textual filename slugs. BigBasket Akamai CDN actually routes exclusively on numeric SKU ID. For instance, SKU \`40192803\` was Surf Excel detergent (mapped to Cadbury Chocobakes), SKU \`40049449\` was fresh broccoli (mapped to Lay's Chile Limon), and SKU \`40104247\` was Lay's Wavy (mapped to Doritos Sweet Chilli).\n`;
  auditMd += `2. **Shared SKU Clusters:** Several flavours in chips and banana chips shared the exact same image ID (e.g. Balaji, Haldiram's, Too Yumm).\n`;
  auditMd += `3. **Client-Server Image Fallback Handling:** A runtime error previously triggered when \`onError\` event handlers were passed across Server Components. This was resolved with the Client Component \`ProductImage.tsx\`.\n`;
  auditMd += `4. **Verified Badge Display on Missing Packshots:** Previously, cards rendered the green \`Verified\` badge based on raw DB status even when the file 404ed or fell back. \`ProductImage\` and \`ProductCard\` have been updated so that any load error or placeholder automatically suppresses the badge.\n\n`;
  auditMd += `## Repaired Priority Products\n\n`;
  auditMd += `| Barcode | Product Name | Old Issue / Source | New Verified Source | Status |\n`;
  auditMd += `| :--- | :--- | :--- | :--- | :--- |\n`;
  auditMd += `| \`7622202274176\` | Cadbury Chocobakes Choc Filled Cookies | Displayed Surf Excel detergent | Zepto CDN 1100x1100 JPEG | VERIFIED |\n`;
  auditMd += `| \`8901491100083\` | Doritos Sweet Chilli Flavored Tortilla Chips | Displayed Lay's Wavy | Flipkart CDN 480x480 PNG | VERIFIED |\n`;
  auditMd += `| \`8901491003025\` | Doritos Sizzlin' Hot Tortilla Chips | Displayed Doritos Dinamita (rolled) | Flipkart CDN 480x480 PNG | VERIFIED |\n`;
  auditMd += `| \`8901491981538\` | Lay's Chile Limon Potato Chips | Displayed Broccoli | OpenFoodFacts front packshot | VERIFIED |\n`;
  auditMd += `| \`8886467122408\` | Pringles Sour Cream & Onion | Displayed pump bottle | OpenFoodFacts front packshot | VERIFIED |\n`;
  auditMd += `| \`8908013524389\` | TagZ Foods Salt Trippin' | Displayed Cif cleaner / placeholder | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8908013524563\` | TagZ Foods Beer N' Barbeque | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8908013524549\` | TagZ Foods Masala Trekker | Displayed Cif cleaner | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8901725119829\` | Bingo! Hashtags Spicy Masala | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8901725198411\` | Bingo! Mad Angles Chaat Masti | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8901725013691\` | Bingo! Mad Angles Achaari Masti | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8901725013714\` | Bingo! Mad Angles Very Peri Peri | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8901725007447\` | Bingo! Original Style Salted | Shared unverified SKU | Flipkart CDN authentic PNG | VERIFIED |\n`;
  auditMd += `| \`8901725007102\` | Bingo! Original Style Chilli | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8904071700031\` | Chheda's Long Masala Banana Chips | Shared unverified SKU | Zepto CDN authentic PNG | VERIFIED |\n`;
  auditMd += `| \`8904071704527\` | Chheda's Yellow Rock Salt Banana Chips | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8904071704565\` | Chheda's Tangy Tomato Banana Chips | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8904067709529\` | Jabsons Banana Chips Classic Salted | Shared unverified SKU | Flipkart CDN authentic PNG | VERIFIED |\n`;
  auditMd += `| \`8904067709543\` | Jabsons Banana Chips Black Pepper | Shared unverified SKU | OpenFoodFacts authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8904063200525\` | Haldiram's Salted Banana Chips | Shared unverified SKU | Haldiram's Official Store | VERIFIED |\n`;
  auditMd += `| \`8904063200532\` | Haldiram's Spicy Masala Banana Chips | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |\n`;
  auditMd += `| \`8906169990973\` | Sweet Karam Coffee Ripe Banana Chips | Shared duplicate photo | Sweet Karam Coffee D2C Store | VERIFIED |\n`;
  auditMd += `| \`8906169990980\` | Sweet Karam Coffee Nendran Banana Chips | Shared duplicate photo | Sweet Karam Coffee D2C Store | VERIFIED |\n`;
  fs.writeFileSync(path.join(reportsDir, "fooddecode-image-mismatch-audit.md"), auditMd, "utf8");

  console.log("Successfully generated all 4 audit reports in /reports directory.");
  process.exit(0);
}

generateReports().catch(err => {
  console.error("Error generating reports:", err);
  process.exit(1);
});
