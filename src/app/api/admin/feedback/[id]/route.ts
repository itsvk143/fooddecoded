import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { ProductFeedbackRecord, ProductFeedbackAuditRecord, FeedbackVote } from "@/types";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const newVote = body.vote as FeedbackVote;
    const reason = body.reason || "Administrative correction";

    if (newVote !== "UP" && newVote !== "DOWN") {
      return NextResponse.json({ error: "Invalid vote. Must be 'UP' or 'DOWN'." }, { status: 400 });
    }

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const auditCol = await getCollection<ProductFeedbackAuditRecord>("product_feedback_audit");

      if (col) {
        let objectId: ObjectId;
        try {
          objectId = new ObjectId(id);
        } catch {
          return NextResponse.json({ error: "Invalid feedback record ID" }, { status: 400 });
        }

        const existing = await col.findOne({ _id: objectId as any });
        if (!existing) {
          return NextResponse.json({ error: "Feedback record not found" }, { status: 404 });
        }

        const previousVote = existing.vote;
        const now = new Date();

        // Update feedback record while preserving ID
        await col.updateOne({ _id: objectId as any }, { $set: { vote: newVote, updatedAt: now } });

        // Record audit log
        if (auditCol) {
          await auditCol.insertOne({
            feedbackId: id,
            productId: existing.productId,
            adminUserId: auth.adminIdentifier || "admin_master",
            adminIdentifier: auth.adminIdentifier || "admin_master",
            action: "UPDATE",
            previousVote,
            newVote,
            reason,
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: "Feedback updated successfully",
          feedbackId: id,
          previousVote,
          newVote,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Feedback updated in memory" });
  } catch (error) {
    console.error("[API /api/admin/feedback/[id] PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update feedback record", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || "Administrative removal";

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const auditCol = await getCollection<ProductFeedbackAuditRecord>("product_feedback_audit");

      if (col) {
        let objectId: ObjectId;
        try {
          objectId = new ObjectId(id);
        } catch {
          return NextResponse.json({ error: "Invalid feedback record ID" }, { status: 400 });
        }

        const existing = await col.findOne({ _id: objectId as any });
        if (!existing) {
          return NextResponse.json({ error: "Feedback record not found" }, { status: 404 });
        }

        const previousVote = existing.vote;
        const now = new Date();

        // Delete the record
        await col.deleteOne({ _id: objectId as any });

        // Retain permanent audit record
        if (auditCol) {
          await auditCol.insertOne({
            feedbackId: id,
            productId: existing.productId,
            adminUserId: auth.adminIdentifier || "admin_master",
            adminIdentifier: auth.adminIdentifier || "admin_master",
            action: "DELETE",
            previousVote,
            newVote: null,
            reason,
            timestamp: now,
          } as any);
        }

        return NextResponse.json({
          success: true,
          message: "Feedback deleted successfully",
          feedbackId: id,
          productId: existing.productId,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Feedback deleted from memory" });
  } catch (error) {
    console.error("[API /api/admin/feedback/[id] DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback record", message: (error as Error).message },
      { status: 500 }
    );
  }
}
