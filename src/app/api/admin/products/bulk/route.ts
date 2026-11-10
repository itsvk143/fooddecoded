import { NextRequest, NextResponse } from "next/server";
import { bulkUpdateProducts } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      ids,
      action = "update",
      category,
      subCategory,
      brand,
      productType,
      addSearchTags,
      removeSearchTags,
      isArchived,
    } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Product IDs array is required." }, { status: 400 });
    }

    const result = await bulkUpdateProducts(
      {
        ids,
        action,
        category,
        subCategory,
        brand,
        productType,
        addSearchTags,
        removeSearchTags,
        isArchived,
      },
      auth.adminIdentifier
    );

    await logAuditEvent({
      action: "ADMIN_BULK_UPDATE_PRODUCTS",
      entityType: "product",
      entityId: `count_${result.affectedCount}`,
      performedBy: auth.adminIdentifier,
      details: `Bulk action "${action}" applied to ${result.affectedCount} products.`,
    });

    return NextResponse.json({
      success: true,
      affectedCount: result.affectedCount,
      message: `Bulk action applied to ${result.affectedCount} products.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Bulk operation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

