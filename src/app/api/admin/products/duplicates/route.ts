import { NextRequest, NextResponse } from "next/server";
import { getDuplicateProducts, mergeProducts } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const duplicates = await getDuplicateProducts();
    return NextResponse.json({ duplicates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to detect duplicates", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { targetId, sourceId } = body;

    if (!targetId || !sourceId) {
      return NextResponse.json(
        { error: "Target product ID and Source product ID are required." },
        { status: 400 }
      );
    }

    const result = await mergeProducts(targetId, sourceId, auth.adminIdentifier);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await logAuditEvent({
      action: "ADMIN_MERGE_PRODUCTS",
      entityType: "product",
      entityId: targetId,
      performedBy: auth.adminIdentifier,
      details: `Merged duplicate record ${sourceId} into primary record ${targetId}.`,
    });

    return NextResponse.json({
      success: true,
      product: result.target,
      message: "Products successfully merged.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Merge operation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

