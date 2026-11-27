import { NextRequest, NextResponse } from "next/server";
import {
  getDuplicateProducts,
  mergeProducts,
  mergeAllDuplicateProducts,
} from "@/lib/product-service";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
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
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { targetId, sourceId, action, mergeAll } = body;

    if (action === "merge_all" || mergeAll === true) {
      const batchResult = await mergeAllDuplicateProducts(auth.adminIdentifier);

      await logAuditEvent({
        action: "ADMIN_MERGE_ALL_PRODUCTS",
        entityType: "product",
        entityId: "bulk_duplicates",
        performedBy: auth.adminIdentifier,
        details: `Batch compare & merge completed: merged ${batchResult.mergedSourcesCount} duplicate records across ${batchResult.mergedGroupsCount} collision groups.`,
      });

      return NextResponse.json({
        success: true,
        mergedGroupsCount: batchResult.mergedGroupsCount,
        mergedSourcesCount: batchResult.mergedSourcesCount,
        errors: batchResult.errors,
        message: `Successfully merged ${batchResult.mergedSourcesCount} duplicate records across ${batchResult.mergedGroupsCount} groups.`,
      });
    }

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
