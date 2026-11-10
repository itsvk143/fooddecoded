import fs from "fs";
import { getCollection } from "../src/lib/mongodb";
import { ProductItem } from "../src/types";

export interface CatalogueAuditChange {
  id: string;
  name: string;
  barcode: string;
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

export async function runCatalogueAuditRepairs() {
  const col = await getCollection<ProductItem>("products");
  if (!col) {
    throw new Error("Unable to connect to MongoDB products collection");
  }

  const allProducts = await col.find({}).toArray();
  console.log(`Auditing and repairing catalogue of ${allProducts.length} products...`);

  const changes: CatalogueAuditChange[] = [];

  for (const p of allProducts) {
    const id = p._id ? p._id.toString() : (p.id as string);
    const updates: Partial<ProductItem> = {};

    // 1. Unibic Choco Chip Cookies
    if (p.name.includes("Unibic Choco Chip Cookies") && p.subCategory !== "Cookies") {
      changes.push({
        id,
        name: p.name,
        barcode: p.barcode,
        field: "subCategory",
        oldValue: p.subCategory,
        newValue: "Cookies",
        reason: "Taxonomy correction: product is a cookie, not a tea biscuit.",
      });
      updates.subCategory = "Cookies";
      updates.productType = "Cookie";
    }

    // 2. Slurrp Farm Ragi Chocolate Cookies
    if (p.name.includes("Slurrp Farm Ragi Chocolate Cookies") && p.subCategory !== "Cookies") {
      changes.push({
        id,
        name: p.name,
        barcode: p.barcode,
        field: "subCategory",
        oldValue: p.subCategory,
        newValue: "Cookies",
        reason: "Taxonomy correction: product is a millet cookie, not a tea biscuit.",
      });
      updates.subCategory = "Cookies";
      updates.productType = "Millet Cookie";
    }

    // 3. Pepperidge Farm Dark Chocolate Chunk Crispy Cookies
    if (p.name.includes("Dark Chocolate Chunk Crispy Cookies") && p.subCategory !== "Cookies") {
      changes.push({
        id,
        name: p.name,
        barcode: p.barcode,
        field: "subCategory",
        oldValue: p.subCategory,
        newValue: "Cookies",
        reason: "Taxonomy correction: genuine cookie product, mapped to Cookies subcategory.",
      });
      updates.subCategory = "Cookies";
      updates.productType = "Crispy Cookie";
    }

    // 4. Yoga Bar Protein Cookie Cookies & Cream
    if (p.name.includes("Yoga Bar Protein Cookie") && (p.subCategory !== "Protein Cookies" || p.category !== "Protein Foods & Snacks")) {
      changes.push({
        id,
        name: p.name,
        barcode: p.barcode,
        field: "category & subCategory",
        oldValue: `${p.category} > ${p.subCategory}`,
        newValue: "Protein Foods & Snacks > Protein Cookies",
        reason: "Taxonomy correction: high-protein functional cookie mapped to Protein Foods aisle.",
      });
      updates.category = "Protein Foods & Snacks";
      updates.categorySlug = "protein-foods-snacks";
      updates.subCategory = "Protein Cookies";
      updates.productType = "Protein Cookie";
    }

    // 5. RiteBite Max Protein 7 Grain Breakfast Cookie Choco Chips
    if (p.name.includes("RiteBite Max Protein 7 Grain Breakfast Cookie")) {
      if (p.barcode !== "8906009533148") {
        changes.push({
          id,
          name: p.name,
          barcode: p.barcode,
          field: "barcode",
          oldValue: p.barcode,
          newValue: "8906009533148",
          reason: "Fixed barcode collision: corrected from Unibic manufacturer code to genuine Naturell/RiteBite GTIN.",
        });
        updates.barcode = "8906009533148";
      }
      if (p.imageUrl !== "/images/packshots/8906009533148.jpg") {
        changes.push({
          id,
          name: p.name,
          barcode: "8906009533148",
          field: "imageUrl",
          oldValue: p.imageUrl,
          newValue: "/images/packshots/8906009533148.jpg",
          reason: "Assigned genuine verified retail packshot from Open Food Facts.",
        });
        updates.imageUrl = "/images/packshots/890609533148.jpg".replace("890609533148", "8906009533148");
        updates.imageStatus = "VERIFIED";
        updates.imageVerified = true;
        updates.verificationStatus = "FULLY_VERIFIED";
      }
      updates.productType = "Protein Cookie";
    }

    // 6. Too Yumm! Multigrain Chips Tangy Tomato
    if (p.name.includes("Too Yumm! Multigrain Chips Tangy Tomato")) {
      if (p.imageUrl !== "/images/packshots/8906090571258.jpg") {
        changes.push({
          id,
          name: p.name,
          barcode: p.barcode,
          field: "imageUrl",
          oldValue: p.imageUrl,
          newValue: "/images/packshots/8906090571258.jpg",
          reason: "Assigned genuine verified retail packshot from Open Food Facts.",
        });
        updates.imageUrl = "/images/packshots/8906090571258.jpg";
        updates.imageStatus = "VERIFIED";
        updates.imageVerified = true;
        updates.verificationStatus = "FULLY_VERIFIED";
      }
      updates.productType = "Multigrain Chips";
    }

    // 7. Too Yumm! Potato Chips Spanish Tomato
    if (p.name.includes("Too Yumm! Potato Chips Spanish Tomato")) {
      if (p.imageUrl !== "/images/packshots/8906090573009.jpg") {
        changes.push({
          id,
          name: p.name,
          barcode: p.barcode,
          field: "imageUrl",
          oldValue: p.imageUrl,
          newValue: "/images/packshots/8906090573009.jpg",
          reason: "Assigned genuine verified retail packshot from Zepto/FMCG distribution.",
        });
        updates.imageUrl = "/images/packshots/8906090573009.jpg";
        updates.imageStatus = "VERIFIED";
        updates.imageVerified = true;
        updates.verificationStatus = "FULLY_VERIFIED";
      }
      updates.productType = "Potato Chips";
    }

    // 8. Bisk Farm Sugar Free Marie Biscuit
    if (p.name.includes("Bisk Farm Sugar Free Marie")) {
      if (p.imageUrl !== "/images/packshots/8901928983004.jpg") {
        changes.push({
          id,
          name: p.name,
          barcode: p.barcode,
          field: "imageUrl",
          oldValue: p.imageUrl,
          newValue: "/images/packshots/8901928983004.jpg",
          reason: "Assigned genuine verified retail packshot from Flipkart grocery catalogue.",
        });
        updates.imageUrl = "/images/packshots/8901928983004.jpg";
        updates.imageStatus = "VERIFIED";
        updates.imageVerified = true;
        updates.verificationStatus = "FULLY_VERIFIED";
      }
      updates.productType = "Marie Biscuit";
    }

    // 9. Too Yumm! Potato Stix Peri Peri (Ensure explicit missing status and flag for review)
    if (p.name.includes("Too Yumm! Potato Stix Peri Peri")) {
      updates.productType = "Potato Sticks";
      updates.imageStatus = "IMAGE_MISSING";
      updates.imageVerified = false;
      updates.verificationStatus = "DATA_VERIFIED";
      updates.imageUrl = "/images/placeholder-product.svg";
    }

    // 10. Cornitos Nacho Crisps product types
    if (p.name.includes("Cornitos Nacho Crisps") && (!p.productType || p.productType === "Chips")) {
      updates.productType = "Tortilla / Nacho Chips";
    }

    // 11. Too Yumm! Veggie Stix
    if (p.name.includes("Too Yumm! Veggie Stix") && (!p.productType || p.productType === "Snacks")) {
      updates.productType = "Veggie Sticks";
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date().toISOString();
      await col.updateOne({ _id: p._id }, { $set: updates });
    }
  }

  console.log(`Completed database updates. Total fields modified: ${changes.length}`);
  return changes;
}

if (require.main === module || process.argv[1]?.endsWith("apply-catalogue-audit-repairs.ts")) {
  runCatalogueAuditRepairs()
    .then((changes) => {
      console.log("Catalogue repair complete.");
      console.log(JSON.stringify(changes, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error applying catalogue repairs:", err);
      process.exit(1);
    });
}

