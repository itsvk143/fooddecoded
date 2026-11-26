import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccess } from "@/lib/auth";
import { ProductCommentRecord, ProductCommentAuditRecord, ProductCommentStatus, CommentAuditAction } from "@/types";
import { ObjectId } from "mongodb";
import { inMemoryComments, inMemoryCommentAudit } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/comments/bulk
 * Allows administrators to bulk approve, reject, flag, or delete comments.
 */
export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const commentIds: string[] = body.commentIds;
    const action: "APPROVE" | "REJECT" | "FLAG" | "DELETE" = body.action;
    const reason = body.reason || `Administrative bulk action: ${action}`;

    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json({ error: "Missing or empty commentIds array" }, { status: 400 });
    }

    const VALID_ACTIONS = ["APPROVE", "REJECT", "FLAG", "DELETE"];
    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Invalid bulk action. Must be one of: ${VALID_ACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        const objectIds: ObjectId[] = [];
        for (const id of commentIds) {
          try {
            objectIds.push(new ObjectId(id));
          } catch {}
        }

        const query = {
          $or: [{ _id: { $in: objectIds as any } }, { _id: { $in: commentIds as any } }],
        };

        const existingRecords = await col.find(query).toArray();
        const now = new Date();

        if (action === "DELETE") {
          const deleteResult = await col.deleteMany(query);

          if (auditCol && existingRecords.length > 0) {
            const auditEntries = existingRecords.map((rec) => ({
              commentId: rec._id.toString(),
              productId: rec.productId,
              performedBy: auth.adminIdentifier || "admin_master",
              role: "ADMIN" as const,
              action: "BULK_DELETE" as const,
              previousContent: rec.comment,
              previousStatus: rec.status,
              reason,
              timestamp: now,
            }));
            await auditCol.insertMany(auditEntries as any);
          }

          return NextResponse.json({
            success: true,
            affectedCount: deleteResult.deletedCount,
            action,
          });
        } else {
          // Status update: APPROVE, REJECT, or FLAG
          const newStatus: ProductCommentStatus =
            action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "FLAGGED";

          const auditAction: CommentAuditAction =
            action === "APPROVE" ? "BULK_APPROVE" : action === "REJECT" ? "BULK_REJECT" : "FLAG";

          const updateResult = await col.updateMany(query, {
            $set: {
              status: newStatus,
              updatedAt: now,
              moderatedAt: now,
              moderatedBy: auth.adminIdentifier || "admin_master",
              moderationReason: reason,
            },
          });

          if (auditCol && existingRecords.length > 0) {
            const auditEntries = existingRecords.map((rec) => ({
              commentId: rec._id.toString(),
              productId: rec.productId,
              performedBy: auth.adminIdentifier || "admin_master",
              role: "ADMIN" as const,
              action: auditAction,
              previousContent: rec.comment,
              previousStatus: rec.status,
              newStatus,
              reason,
              timestamp: now,
            }));
            await auditCol.insertMany(auditEntries as any);
          }

          return NextResponse.json({
            success: true,
            affectedCount: updateResult.modifiedCount,
            action,
            newStatus,
          });
        }
      }
    }

    // In-memory fallback
    const now = new Date();
    let affectedCount = 0;
    for (const id of commentIds) {
      const idx = inMemoryComments.findIndex((c) => c._id === id || String(c._id) === id);
      if (idx !== -1) {
        affectedCount++;
        const rec = inMemoryComments[idx];
        if (action === "DELETE") {
          inMemoryComments.splice(idx, 1);
          inMemoryCommentAudit.unshift({
            commentId: id,
            productId: rec.productId,
            performedBy: auth.adminIdentifier || "admin_master",
            role: "ADMIN",
            action: "BULK_DELETE",
            previousContent: rec.comment,
            previousStatus: rec.status,
            reason,
            timestamp: now,
          });
        } else {
          const newStatus: ProductCommentStatus =
            action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "FLAGGED";
          rec.status = newStatus;
          rec.updatedAt = now;
          rec.moderatedAt = now;
          rec.moderatedBy = auth.adminIdentifier || "admin_master";
          inMemoryCommentAudit.unshift({
            commentId: id,
            productId: rec.productId,
            performedBy: auth.adminIdentifier || "admin_master",
            role: "ADMIN",
            action: action === "APPROVE" ? "BULK_APPROVE" : action === "REJECT" ? "BULK_REJECT" : "FLAG",
            previousContent: rec.comment,
            previousStatus: rec.status,
            newStatus,
            reason,
            timestamp: now,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      affectedCount: affectedCount || commentIds.length,
      action,
    });
  } catch (error) {
    console.error("[API /api/admin/comments/bulk POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk comment moderation", message: (error as Error).message },
      { status: 500 }
    );
  }
}
