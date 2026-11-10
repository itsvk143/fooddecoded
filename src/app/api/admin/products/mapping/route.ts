import { NextRequest, NextResponse } from "next/server";
import { updateProductMapping } from "@/lib/product-service";
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
    const { id, category, subCategory, productType, brand, flavour, searchTags, reason } = body;

    if (!id || !category || !subCategory) {
      return NextResponse.json(
        { error: "Product ID, Category, and Subcategory are required." },
        { status: 400 }
      );
    }

    const result = await updateProductMapping(
      id,
      {
        category,
        subCategory,
        productType,
        brand,
        flavour,
        searchTags,
      },
      auth.adminIdentifier,
      reason
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await logAuditEvent({
      action: "ADMIN_CORRECT_PRODUCT_MAPPING",
      entityType: "product",
      entityId: id,
      performedBy: auth.adminIdentifier,
      details: reason || `Updated classification to Category: ${category}, Subcategory: ${subCategory}`,
    });

    return NextResponse.json({
      success: true,
      product: result.product,
      message: "Product mapping successfully corrected.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Mapping correction failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

