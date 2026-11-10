import { NextRequest, NextResponse } from "next/server";
import {
  saveProduct,
  deleteProduct,
  archiveProduct,
  restoreProduct,
  queryProducts,
} from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const subCategory = searchParams.get("subCategory") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const productType = searchParams.get("productType") || undefined;
  const flavour = searchParams.get("flavour") || undefined;
  const imageStatus = searchParams.get("imageStatus") || undefined;
  const dataStatus = searchParams.get("dataStatus") || undefined;
  const status = searchParams.get("status") || "active"; // "active" | "archived" | "all"
  const sortBy = (searchParams.get("sortBy") as any) || "recent";
  const sortOrder = (searchParams.get("sortOrder") as any) || "desc";
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;

  const data = await queryProducts({
    q,
    category,
    subCategory,
    brand,
    productType,
    flavour,
    imageStatus,
    dataStatus,
    includeArchived: status === "all" || status === "archived",
    archivedOnly: status === "archived",
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.barcode || !body.name) {
      return NextResponse.json({ error: "Barcode and name are required." }, { status: 400 });
    }

    const saved = await saveProduct({
      ...body,
      verified: body.verified ?? true,
      verifiedBy: auth.adminIdentifier,
      source: "admin",
      auditHistory: [
        {
          action: "ADMIN_CREATE_PRODUCT",
          timestamp: new Date().toISOString(),
          performedBy: auth.adminIdentifier || "Admin",
          details: `Created product: ${body.name}`,
        },
      ],
    });

    await logAuditEvent({
      action: "ADMIN_CREATE_PRODUCT",
      entityType: "product",
      entityId: saved.barcode,
      performedBy: auth.adminIdentifier,
      details: `Admin added product: ${saved.name} (${saved.category} / ${saved.subCategory})`,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Product creation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.barcode && !body._id && !body.id) {
      return NextResponse.json({ error: "Product ID or Barcode is required to update." }, { status: 400 });
    }

    const saved = await saveProduct(body);

    await logAuditEvent({
      action: "ADMIN_UPDATE_PRODUCT",
      entityType: "product",
      entityId: saved.barcode || saved._id,
      performedBy: auth.adminIdentifier,
      details: `Admin updated product: ${saved.name}`,
    });

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: "Product update failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const permanent = searchParams.get("permanent") === "true";

    if (!id) {
      return NextResponse.json({ error: "Missing product ID parameter" }, { status: 400 });
    }

    if (permanent) {
      const success = await deleteProduct(id);
      await logAuditEvent({
        action: "ADMIN_PERMANENT_DELETE_PRODUCT",
        entityType: "product",
        entityId: id,
        performedBy: auth.adminIdentifier,
        details: `Admin permanently deleted product ID: ${id}`,
      });
      return NextResponse.json({ success, message: "Product permanently deleted" });
    } else {
      const success = await archiveProduct(id, auth.adminIdentifier);
      await logAuditEvent({
        action: "ADMIN_ARCHIVE_PRODUCT",
        entityType: "product",
        entityId: id,
        performedBy: auth.adminIdentifier,
        details: `Admin archived product ID: ${id}`,
      });
      return NextResponse.json({ success, message: "Product archived successfully" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Product deletion failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action"); // "restore" | "archive"

    if (!id) {
      return NextResponse.json({ error: "Missing product ID parameter" }, { status: 400 });
    }

    if (action === "restore") {
      const success = await restoreProduct(id, auth.adminIdentifier);
      await logAuditEvent({
        action: "ADMIN_RESTORE_PRODUCT",
        entityType: "product",
        entityId: id,
        performedBy: auth.adminIdentifier,
        details: `Admin restored product ID: ${id}`,
      });
      return NextResponse.json({ success, message: "Product restored successfully" });
    } else if (action === "archive") {
      const success = await archiveProduct(id, auth.adminIdentifier);
      return NextResponse.json({ success, message: "Product archived successfully" });
    }

    return NextResponse.json({ error: "Invalid action. Use ?action=restore or ?action=archive" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Product action failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
