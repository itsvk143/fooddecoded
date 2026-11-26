import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { validateSession } from "@/lib/session";
import { ProductCommentRecord, ProductCommentAuditRecord } from "@/types";
import { ObjectId } from "mongodb";
import { inMemoryComments, inMemoryCommentAudit } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string; commentId: string }>;
}

/**
 * PUT /api/products/[id]/comments/[commentId]
 * Authenticated endpoint. Allows author to edit their own comment.
 * Resets status to PENDING for re-moderation and preserves immutable audit trail.
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: productId, commentId } = await context.params;

    // 1. Authentication Check
    const session = await validateSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { error: "Authentication required to edit comment." },
        { status: 401 }
      );
    }

    const { user } = session;

    // 2. Validate input
    const body = await request.json().catch(() => ({}));
    const rawComment = body.comment;

    if (typeof rawComment !== "string") {
      return NextResponse.json(
        { error: "Invalid comment format. Text string required." },
        { status: 400 }
      );
    }

    const trimmedComment = rawComment.trim();

    if (trimmedComment.length < 3) {
      return NextResponse.json(
        { error: "Comment must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: "Comment cannot exceed 1,000 characters." },
        { status: 400 }
      );
    }

    const now = new Date();

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        let objectId: ObjectId | null = null;
        try {
          objectId = new ObjectId(commentId);
        } catch {}

        const query: any = objectId
          ? { _id: objectId, productId }
          : { _id: commentId, productId };

        const existing = await col.findOne(query);

        if (!existing) {
          return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }

        // Strict Ownership IDOR check
        if (existing.userId !== user.id) {
          return NextResponse.json(
            { error: "Forbidden. You can only edit your own comments." },
            { status: 403 }
          );
        }

        const previousContent = existing.comment;
        const previousStatus = existing.status;

        await col.updateOne(query, {
          $set: {
            comment: trimmedComment,
            status: "PENDING", // Resets to PENDING for moderation review
            updatedAt: now,
          },
        });

        if (auditCol) {
          await auditCol.insertOne({
            commentId,
            productId,
            performedBy: user.id,
            role: "USER",
            action: "UPDATE",
            previousContent,
            newContent: trimmedComment,
            previousStatus,
            newStatus: "PENDING",
            reason: "User self-edited comment",
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: "Comment updated and submitted for moderation review.",
          comment: {
            ...existing,
            comment: trimmedComment,
            status: "PENDING",
            updatedAt: now,
            isOwn: true,
          },
        });
      }
    }

    // In-memory fallback
    const existing = inMemoryComments.find(
      (c) => (c._id === commentId || String(c._id) === commentId) && c.productId === productId
    );

    if (!existing) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only edit your own comments." },
        { status: 403 }
      );
    }

    const previousContent = existing.comment;
    const previousStatus = existing.status;
    existing.comment = trimmedComment;
    existing.status = "PENDING";
    existing.updatedAt = now;

    inMemoryCommentAudit.unshift({
      commentId,
      productId,
      performedBy: user.id,
      role: "USER",
      action: "UPDATE",
      previousContent,
      newContent: trimmedComment,
      previousStatus,
      newStatus: "PENDING",
      reason: "User self-edited comment (in-memory)",
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      message: "Comment updated and submitted for moderation review.",
      comment: {
        ...existing,
        isOwn: true,
      },
    });
  } catch (error) {
    console.error("[API /api/products/[id]/comments/[commentId] PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update comment", message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]/comments/[commentId]
 * Authenticated endpoint. Allows author to delete their own comment.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: productId, commentId } = await context.params;

    // 1. Authentication Check
    const session = await validateSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { error: "Authentication required to delete comment." },
        { status: 401 }
      );
    }

    const { user } = session;
    const now = new Date();

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        let objectId: ObjectId | null = null;
        try {
          objectId = new ObjectId(commentId);
        } catch {}

        const query: any = objectId
          ? { _id: objectId, productId }
          : { _id: commentId, productId };

        const existing = await col.findOne(query);

        if (!existing) {
          return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }

        // Strict Ownership IDOR check
        if (existing.userId !== user.id) {
          return NextResponse.json(
            { error: "Forbidden. You can only delete your own comments." },
            { status: 403 }
          );
        }

        await col.deleteOne(query);

        if (auditCol) {
          await auditCol.insertOne({
            commentId,
            productId,
            performedBy: user.id,
            role: "USER",
            action: "DELETE",
            previousContent: existing.comment,
            previousStatus: existing.status,
            reason: "User self-deleted comment",
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: "Comment deleted successfully.",
        });
      }
    }

    // In-memory fallback
    const existingIndex = inMemoryComments.findIndex(
      (c) => (c._id === commentId || String(c._id) === commentId) && c.productId === productId
    );

    if (existingIndex === -1) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    const existing = inMemoryComments[existingIndex];
    if (existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own comments." },
        { status: 403 }
      );
    }

    inMemoryComments.splice(existingIndex, 1);

    inMemoryCommentAudit.unshift({
      commentId,
      productId,
      performedBy: user.id,
      role: "USER",
      action: "DELETE",
      previousContent: existing.comment,
      previousStatus: existing.status,
      reason: "User self-deleted comment (in-memory)",
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("[API /api/products/[id]/comments/[commentId] DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment", message: (error as Error).message },
      { status: 500 }
    );
  }
}
