import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ProductItem } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all"; // "all" | "active" | "archived"
  const category = searchParams.get("category");
  const missingImagesOnly = searchParams.get("missingImages") === "true";
  const idsParam = searchParams.get("ids");

  const col = await getCollection<ProductItem>("products");
  if (!col) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  const filter: any = {};
  if (status === "active") filter.isArchived = { $ne: true };
  if (status === "archived") filter.isArchived = true;
  if (category && category !== "All") filter.category = category;
  if (missingImagesOnly) {
    filter.$or = [{ imageUrl: { $in: [null, "", "/images/placeholder-product.svg"] } }, { imageStatus: "MISSING" }];
  }
  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length > 0) {
      filter.$or = [{ barcode: { $in: ids } }, { id: { $in: ids } }];
    }
  }

  const products = await col.find(filter).sort({ brand: 1, name: 1 }).toArray();

  const headers = [
    "ID",
    "Barcode",
    "Product Name",
    "Brand",
    "Product Type",
    "Category",
    "Subcategory",
    "Flavour",
    "Package Size",
    "Package Unit",
    "Overall Score",
    "Nutri-Score",
    "Nova Group",
    "Has Palm Oil",
    "Has Added Sugar",
    "Image URL",
    "Image Status",
    "Data Verified",
    "Is Archived",
    "Search Tags",
    "Ingredients Text",
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = products.map((p) => [
    escapeCSV(p._id?.toString() || p.id),
    escapeCSV(p.barcode),
    escapeCSV(p.name),
    escapeCSV(p.brand),
    escapeCSV(p.productType || ""),
    escapeCSV(p.category),
    escapeCSV(p.subCategory || ""),
    escapeCSV(p.flavour || ""),
    escapeCSV(p.packageSize || ""),
    escapeCSV(p.packageUnit || ""),
    escapeCSV(p.overallScore),
    escapeCSV(p.nutriScore),
    escapeCSV(p.novaGroup),
    escapeCSV(p.hasPalmOil ? "Yes" : "No"),
    escapeCSV(p.hasAddedSugar ? "Yes" : "No"),
    escapeCSV(p.imageUrl || ""),
    escapeCSV(p.imageStatus || ""),
    escapeCSV(p.verified ? "Yes" : "No"),
    escapeCSV(p.isArchived ? "Yes" : "No"),
    escapeCSV((p.searchTags || []).join("; ")),
    escapeCSV(p.ingredientsText || ""),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fooddecode-products-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

