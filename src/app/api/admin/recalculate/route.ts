import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ProductItem } from "@/types";
import { saveProduct } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const col = await getCollection<ProductItem>("products");
    let count = 0;

    if (col) {
      const allProducts = await col.find({}).toArray();
      for (const prod of allProducts) {
        await saveProduct(prod);
        count++;
      }
    }

    await logAuditEvent({
      action: "RECALCULATE_SCORES",
      entityType: "product",
      performedBy: auth.adminIdentifier,
      details: `Batch recalculated scores for ${count} products`,
    });

    return NextResponse.json({
      success: true,
      message: `Recalculated scores for ${count} products based on current active rules.`,
      recalculatedCount: count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Recalculation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
