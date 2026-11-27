import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { generateBrandCsvExport } from "@/lib/brand-directory-service";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type") || "brands";
  const brand = searchParams.get("brand") || undefined;

  if (typeParam !== "brands" && typeParam !== "brand_products" && typeParam !== "mapping") {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  if (typeParam === "brand_products" && !brand) {
    return NextResponse.json({ error: "Missing brand parameter for brand_products export" }, { status: 400 });
  }

  try {
    const { csv, filename, rowCount } = await generateBrandCsvExport({
      type: typeParam,
      brand,
    });

    await logAuditEvent({
      action: "ADMIN_EXPORT_BRAND_CSV",
      entityType: "brand",
      entityId: brand || typeParam,
      performedBy: auth.adminIdentifier || "admin",
      details: `Exported ${rowCount} rows for brand export type="${typeParam}"${brand ? ` (brand=${brand})` : ""}`,
    }).catch(() => {});

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate brand CSV export", message: (error as Error).message },
      { status: 500 }
    );
  }
}
