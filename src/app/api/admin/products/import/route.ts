import { NextRequest, NextResponse } from "next/server";
import { saveProduct } from "@/lib/product-service";
import { getCollection } from "@/lib/mongodb";
import { ProductItem } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get("preview") === "true";
    const body = await request.json();
    const { items, rawCsv } = body;

    let parsedItems: any[] = [];

    if (Array.isArray(items)) {
      parsedItems = items;
    } else if (typeof rawCsv === "string") {
      // Basic CSV parser
      const lines = rawCsv.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        return NextResponse.json({ error: "CSV file must contain a header row and at least one data row." }, { status: 400 });
      }

      const headers = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        // Regex parse CSV handling quotes
        const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

        const row: string[] = [];
        let match;
        while ((match = re_value.exec(lines[i])) !== null) {
          row.push(match[1] || match[2] || match[3] || "");
        }

        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] || "";
        });

        parsedItems.push({
          barcode: obj.barcode || obj.gtin || obj.upc,
          name: obj.name || obj["product name"] || obj.productname,
          brand: obj.brand || obj.manufacturer,
          category: obj.category || "Packaged Foods",
          subCategory: obj.subcategory || obj["sub category"] || "",
          productType: obj.producttype || obj["product type"] || "",
          flavour: obj.flavour || obj.flavor || "",
          ingredientsText: obj.ingredients || obj["ingredients text"] || "",
          imageUrl: obj.imageurl || obj["image url"] || "",
          packageSize: obj.packagesize || obj["package size"] || "",
        });
      }
    }

    if (parsedItems.length === 0) {
      return NextResponse.json({ error: "No valid product records provided to import." }, { status: 400 });
    }

    // Validation & Duplicate Detection
    const col = await getCollection<ProductItem>("products");
    const existingBarcodes = new Set<string>();
    if (col) {
      const records = await col.find({}, { projection: { barcode: 1 } }).toArray();
      records.forEach((r) => {
        if (r.barcode) existingBarcodes.add(r.barcode);
      });
    }

    const validatedItems: any[] = [];
    const errors: Array<{ row: number; barcode?: string; error: string }> = [];

    parsedItems.forEach((item, idx) => {
      const rowNum = idx + 1;
      if (!item.barcode?.trim()) {
        errors.push({ row: rowNum, error: "Missing barcode" });
        return;
      }
      if (!item.name?.trim()) {
        errors.push({ row: rowNum, barcode: item.barcode, error: "Missing product name" });
        return;
      }

      const isExisting = existingBarcodes.has(item.barcode.trim());
      validatedItems.push({
        ...item,
        isExistingDuplicate: isExisting,
        status: isExisting ? "Update Existing" : "Create New",
      });
    });

    // If Preview mode, return validation report and preview items
    if (isPreview) {
      return NextResponse.json({
        isPreview: true,
        totalSubmitted: parsedItems.length,
        validCount: validatedItems.length,
        newProductsCount: validatedItems.filter((i) => !i.isExistingDuplicate).length,
        updateCount: validatedItems.filter((i) => i.isExistingDuplicate).length,
        errorCount: errors.length,
        errors,
        previewItems: validatedItems.slice(0, 10),
      });
    }

    // Commit Import
    let successCount = 0;
    let failCount = 0;

    for (const item of validatedItems) {
      try {
        await saveProduct({
          ...item,
          verified: item.verified ?? true,
          source: "admin",
        });
        successCount++;
      } catch (e) {
        failCount++;
        errors.push({ row: 0, barcode: item.barcode, error: (e as Error).message });
      }
    }

    await logAuditEvent({
      action: "ADMIN_IMPORT_PRODUCTS",
      entityType: "import",
      entityId: `success_${successCount}`,
      performedBy: auth.adminIdentifier,
      details: `Imported ${successCount} products (${failCount} failures).`,
    });

    return NextResponse.json({
      success: true,
      successCount,
      failCount,
      errors,
      message: `Successfully processed ${successCount} products.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Import processing failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

