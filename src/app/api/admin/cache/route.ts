import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { invalidateProductCache } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({
    authorized: true,
    adminIdentifier: auth.adminIdentifier,
    engineStatus: "active",
    configuration: {
      topProductsPerCategory: 25,
      lruProductLimit: 1000,
      thumbnailCacheLimit: 250,
      syncThrottleHours: 6,
      storageDbName: "fooddecode_cache_db",
      thumbnailCacheName: "fooddecode-thumbnails-v1",
    },
    checkedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const action = body?.action;

    if (action !== "resync" && action !== "clear" && action !== "diagnostics") {
      return NextResponse.json(
        { error: "Invalid cache action. Expected 'resync', 'clear', or 'diagnostics'." },
        { status: 400 }
      );
    }

    if (action === "resync") {
      invalidateProductCache();
      await logAuditEvent({
        action: "ADMIN_CACHE_RESYNC",
        entityType: "product",
        entityId: "offline_cache_engine",
        performedBy: auth.adminIdentifier,
        details: "Administrator triggered manual Offline Cache Engine re-sync & server catalog invalidation.",
      });
    } else if (action === "clear") {
      await logAuditEvent({
        action: "ADMIN_CACHE_CLEAR",
        entityType: "product",
        entityId: "offline_cache_engine",
        performedBy: auth.adminIdentifier,
        details: "Administrator cleared local browser Offline Cache Engine IndexedDB and thumbnail storage.",
      });
    } else {
      await logAuditEvent({
        action: "ADMIN_CACHE_DIAGNOSTICS",
        entityType: "product",
        entityId: "offline_cache_engine",
        performedBy: auth.adminIdentifier,
        details: "Administrator inspected Offline Cache Engine diagnostics.",
      });
    }

    return NextResponse.json({
      authorized: true,
      action,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process cache administration request", message: (error as Error).message },
      { status: 500 }
    );
  }
}
