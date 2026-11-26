import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccess } from "@/lib/auth";
import { ProductFeedbackRecord, ProductFeedbackAuditRecord } from "@/types";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const feedbackIds: string[] = body.feedbackIds;
    const reason = body.reason || "Administrative bulk removal";

    if (!Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      return NextResponse.json({ error: "Missing or empty feedbackIds array" }, { status: 400 });
    }

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const auditCol = await getCollection<ProductFeedbackAuditRecord>("product_feedback_audit");

      if (col) {
        const objectIds: ObjectId[] = [];
        for (const id of feedbackIds) {
          try {
            objectIds.push(new ObjectId(id));
          } catch {}
        }

        // Retrieve existing records to log individual audit trail
        const existingRecords = await col.find({ _id: { $in: objectIds as any } }).toArray();
        const now = new Date();

        // Perform bulk deletion
        const deleteResult = await col.deleteMany({ _id: { $in: objectIds as any } });

        // Insert audit trail for each deleted record
        if (auditCol && existingRecords.length > 0) {
          const auditEntries = existingRecords.map((rec) => ({
            feedbackId: rec._id.toString(),
            productId: rec.productId,
            adminUserId: auth.adminIdentifier || "admin_master",
            adminIdentifier: auth.adminIdentifier || "admin_master",
            action: "BULK_DELETE" as const,
            previousVote: rec.vote,
            newVote: null,
            reason,
            timestamp: now,
          }));

          await auditCol.insertMany(auditEntries as any);
        }

        return NextResponse.json({
          success: true,
          deletedCount: deleteResult.deletedCount,
          requestedCount: feedbackIds.length,
        });
      }
    }

    return NextResponse.json({ success: true, deletedCount: feedbackIds.length });
  } catch (error) {
    console.error("[API /api/admin/feedback/bulk-delete POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk delete", message: (error as Error).message },
      { status: 500 }
    );
  }
}
