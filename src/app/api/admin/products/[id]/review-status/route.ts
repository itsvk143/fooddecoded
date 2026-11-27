import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { ProductReviewStatus } from "@/types";
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
    const reviewStatus: ProductReviewStatus = body.reviewStatus;
    const notes = body.notes || "";

    const VALID_STATUSES: ProductReviewStatus[] = [
      "NOT_REVIEWED",
      "UNDER_REVIEW",
      "VERIFIED",
      "CORRECTION_REQUIRED",
      "CORRECTED",
    ];

    if (!VALID_STATUSES.includes(reviewStatus)) {
      return NextResponse.json(
        { error: `Invalid review status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    if (isMongoConfigured()) {
      const col = await getCollection("products");
      const auditCol = await getCollection("auditLogs");

      if (col) {
        let objectId: ObjectId | null = null;
        try {
          objectId = new ObjectId(id);
        } catch {}

        const filter: any = {
          $or: [{ id }, { barcode: id }],
        };
        if (objectId) {
          filter.$or.push({ _id: objectId });
        }

        const now = new Date();
        const updateResult = await col.updateOne(filter, {
          $set: {
            reviewStatus,
            reviewNotes: notes,
            reviewedAt: now,
            reviewedBy: auth.adminIdentifier || "admin_master",
          },
        });

        if (auditCol) {
          await auditCol.insertOne({
            action: "UPDATE_PRODUCT_REVIEW_STATUS",
            entityType: "product",
            entityId: id,
            performedBy: auth.adminIdentifier || "admin_master",
            details: `Updated review status to '${reviewStatus}'. Notes: ${notes || "None"}`,
            timestamp: now.toISOString(),
          } as any);
        }

        return NextResponse.json({
          success: true,
          productId: id,
          reviewStatus,
          modifiedCount: updateResult.modifiedCount,
        });
      }
    }

    return NextResponse.json({ success: true, productId: id, reviewStatus });
  } catch (error) {
    console.error("[API /api/admin/products/[id]/review-status PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update review status", message: (error as Error).message },
      { status: 500 }
    );
  }
}
