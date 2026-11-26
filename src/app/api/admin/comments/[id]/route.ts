import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccess } from "@/lib/auth";
import { ProductCommentRecord, ProductCommentAuditRecord, ProductCommentStatus, CommentAuditAction } from "@/types";
import { ObjectId } from "mongodb";
import { inMemoryComments, inMemoryCommentAudit } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/comments/[id]
 * Allows administrators to approve, reject, flag, or edit a user comment.
 * Maintains immutable audit logs in product_comment_audit.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const newStatus = body.status as ProductCommentStatus | undefined;
    const newComment = body.comment as string | undefined;
    const reason = body.reason || "Administrative review action";

    const VALID_STATUSES: ProductCommentStatus[] = ["PENDING", "APPROVED", "REJECTED", "FLAGGED"];
    if (newStatus && !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        let objectId: ObjectId | null = null;
        try {
          objectId = new ObjectId(id);
        } catch {}

        const query: any = objectId ? { _id: objectId } : { _id: id };
        const existing = await col.findOne(query);

        if (!existing) {
          return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }

        const now = new Date();
        const updateFields: any = {
          updatedAt: now,
          moderatedAt: now,
          moderatedBy: auth.adminIdentifier || "admin_master",
          moderationReason: reason,
        };

        let auditAction: CommentAuditAction = "UPDATE";

        if (newStatus) {
          updateFields.status = newStatus;
          if (newStatus === "APPROVED") auditAction = "APPROVE";
          else if (newStatus === "REJECTED") auditAction = "REJECT";
          else if (newStatus === "FLAGGED") auditAction = "FLAG";
        }

        if (newComment && newComment.trim()) {
          updateFields.comment = newComment.trim();
        }

        await col.updateOne(query, { $set: updateFields });

        if (auditCol) {
          await auditCol.insertOne({
            commentId: id,
            productId: existing.productId,
            performedBy: auth.adminIdentifier || "admin_master",
            role: "ADMIN",
            action: auditAction,
            previousContent: existing.comment,
            newContent: updateFields.comment || existing.comment,
            previousStatus: existing.status,
            newStatus: newStatus || existing.status,
            reason,
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: `Comment updated successfully to ${newStatus || existing.status}.`,
          comment: {
            ...existing,
            ...updateFields,
            _id: id,
          },
        });
      }
    }

    // In-memory fallback
    const existing = inMemoryComments.find((c) => c._id === id || String(c._id) === id);
    if (!existing) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }
    const now = new Date();
    const previousContent = existing.comment;
    const previousStatus = existing.status;

    if (newStatus) existing.status = newStatus;
    if (newComment && newComment.trim()) existing.comment = newComment.trim();
    existing.updatedAt = now;
    existing.moderatedAt = now;
    existing.moderatedBy = auth.adminIdentifier || "admin_master";

    inMemoryCommentAudit.unshift({
      commentId: id,
      productId: existing.productId,
      performedBy: auth.adminIdentifier || "admin_master",
      role: "ADMIN",
      action:
        newStatus === "APPROVED"
          ? "APPROVE"
          : newStatus === "REJECTED"
          ? "REJECT"
          : newStatus === "FLAGGED"
          ? "FLAG"
          : "UPDATE",
      previousContent,
      newContent: existing.comment,
      previousStatus,
      newStatus: newStatus || existing.status,
      reason,
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      message: `Comment updated successfully to ${newStatus || existing.status}.`,
      comment: existing,
    });
  } catch (error) {
    console.error("[API /api/admin/comments/[id] PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to moderate comment", message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/comments/[id]
 * Allows administrators to delete inappropriate comments with an audit record.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || "Administrative removal";

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        let objectId: ObjectId | null = null;
        try {
          objectId = new ObjectId(id);
        } catch {}

        const query: any = objectId ? { _id: objectId } : { _id: id };
        const existing = await col.findOne(query);

        if (!existing) {
          return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }

        const now = new Date();
        await col.deleteOne(query);

        if (auditCol) {
          await auditCol.insertOne({
            commentId: id,
            productId: existing.productId,
            performedBy: auth.adminIdentifier || "admin_master",
            role: "ADMIN",
            action: "DELETE",
            previousContent: existing.comment,
            previousStatus: existing.status,
            reason,
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: "Comment permanently deleted and recorded in audit log.",
          commentId: id,
        });
      }
    }

    // In-memory fallback
    const existingIndex = inMemoryComments.findIndex((c) => c._id === id || String(c._id) === id);
    if (existingIndex === -1) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }
    const existing = inMemoryComments[existingIndex];
    inMemoryComments.splice(existingIndex, 1);
    const now = new Date();

    inMemoryCommentAudit.unshift({
      commentId: id,
      productId: existing.productId,
      performedBy: auth.adminIdentifier || "admin_master",
      role: "ADMIN",
      action: "DELETE",
      previousContent: existing.comment,
      previousStatus: existing.status,
      reason,
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      message: "Comment permanently deleted and recorded in audit log.",
      commentId: id,
    });
  } catch (error) {
    console.error("[API /api/admin/comments/[id] DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment", message: (error as Error).message },
      { status: 500 }
    );
  }
}
