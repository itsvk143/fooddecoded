import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ImportJob } from "@/types";
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
    const body = await request.json();
    const items: any[] = body.items || [];
    const source = body.source || "json_upload";

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided for import." }, { status: 400 });
    }

    const jobCol = await getCollection<ImportJob>("importJobs");
    const now = new Date().toISOString();

    const jobRecord: ImportJob = {
      source,
      type: items.length > 1 ? "bulk" : "single",
      status: "processing",
      totalItems: items.length,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      createdAt: now,
      updatedAt: now,
    };

    let jobId = `job_${Date.now()}`;
    if (jobCol) {
      const res = await jobCol.insertOne(jobRecord as any);
      jobId = res.insertedId.toString();
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const item of items) {
      try {
        if (!item.barcode || !item.name) {
          throw new Error("Missing barcode or product name");
        }
        await saveProduct({
          ...item,
          verified: item.verified ?? true,
          source: "admin",
        });
        successCount++;
      } catch (err) {
        errorCount++;
        errors.push(`Row (${item.barcode || "unknown"}): ${(err as Error).message}`);
      }
    }

    const updatedJob: Partial<ImportJob> = {
      status: errorCount === items.length ? "failed" : "completed",
      processedItems: items.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 50),
      updatedAt: new Date().toISOString(),
    };

    if (jobCol) {
      await jobCol.updateOne({ _id: jobId as any }, { $set: updatedJob });
    }

    await logAuditEvent({
      action: "BULK_IMPORT",
      entityType: "import",
      entityId: jobId,
      performedBy: auth.adminIdentifier,
      details: `Bulk imported ${successCount} products successfully (${errorCount} errors)`,
    });

    return NextResponse.json({
      jobId,
      status: updatedJob.status,
      totalItems: items.length,
      successCount,
      errorCount,
      errors,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Import execution failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
