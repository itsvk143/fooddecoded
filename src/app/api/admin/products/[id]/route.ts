import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  saveProduct,
  deleteProduct,
  archiveProduct,
  restoreProduct,
} from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const saved = await saveProduct({
      ...existing,
      ...body,
      _id: existing._id || id,
      id: existing.id || id,
    });

    await logAuditEvent({
      action: "ADMIN_UPDATE_PRODUCT_DETAIL",
      entityType: "product",
      entityId: id,
      performedBy: auth.adminIdentifier,
      details: `Admin updated product: ${saved.name}`,
    });

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action"); // "archive" | "restore"

    if (action === "archive") {
      const ok = await archiveProduct(id, auth.adminIdentifier);
      return NextResponse.json({ success: ok, message: "Product archived" });
    } else if (action === "restore") {
      const ok = await restoreProduct(id, auth.adminIdentifier);
      return NextResponse.json({ success: ok, message: "Product restored" });
    }

    return NextResponse.json({ error: "Unknown action parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Action failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const ok = await deleteProduct(id);
      await logAuditEvent({
        action: "ADMIN_PERMANENT_DELETE_PRODUCT",
        entityType: "product",
        entityId: id,
        performedBy: auth.adminIdentifier,
        details: `Permanently deleted product ID: ${id}`,
      });
      return NextResponse.json({ success: ok, message: "Product permanently deleted" });
    } else {
      const ok = await archiveProduct(id, auth.adminIdentifier);
      await logAuditEvent({
        action: "ADMIN_ARCHIVE_PRODUCT",
        entityType: "product",
        entityId: id,
        performedBy: auth.adminIdentifier,
        details: `Archived product ID: ${id}`,
      });
      return NextResponse.json({ success: ok, message: "Product archived" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

