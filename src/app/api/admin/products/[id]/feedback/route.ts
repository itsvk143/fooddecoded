import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { ProductFeedbackRecord, ProductFeedbackAuditRecord } from "@/types";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || "Administrative clear of all product feedback";

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const auditCol = await getCollection<ProductFeedbackAuditRecord>("product_feedback_audit");

      if (col) {
        const count = await col.countDocuments({ productId: id });
        const result = await col.deleteMany({ productId: id });
        const now = new Date();

        if (auditCol) {
          await auditCol.insertOne({
            productId: id,
            adminUserId: auth.adminIdentifier || "admin_master",
            adminIdentifier: auth.adminIdentifier || "admin_master",
            action: "CLEAR_PRODUCT",
            previousVote: "UP",
            newVote: null,
            reason: `${reason} (${result.deletedCount} records deleted)`,
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          productId: id,
          deletedCount: result.deletedCount,
        });
      }
    }

    return NextResponse.json({ success: true, productId: id, deletedCount: 0 });
  } catch (error) {
    console.error("[API /api/admin/products/[id]/feedback DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to clear product feedback", message: (error as Error).message },
      { status: 500 }
    );
  }
}
