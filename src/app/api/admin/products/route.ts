import { NextRequest, NextResponse } from "next/server";
import { saveProduct, deleteProduct, queryProducts } from "@/lib/product-service";
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
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;

  const data = await queryProducts({ q, page, limit });
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
    });

    await logAuditEvent({
      action: "ADMIN_CREATE_PRODUCT",
      entityType: "product",
      entityId: saved.barcode,
      performedBy: auth.adminIdentifier,
      details: `Admin added verified product: ${saved.name}`,
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
    if (!body.barcode) {
      return NextResponse.json({ error: "Barcode is required to update." }, { status: 400 });
    }

    const saved = await saveProduct(body);

    await logAuditEvent({
      action: "ADMIN_UPDATE_PRODUCT",
      entityType: "product",
      entityId: saved.barcode,
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
    if (!id) {
      return NextResponse.json({ error: "Missing product ID parameter" }, { status: 400 });
    }

    const success = await deleteProduct(id);

    await logAuditEvent({
      action: "ADMIN_DELETE_PRODUCT",
      entityType: "product",
      entityId: id,
      performedBy: auth.adminIdentifier,
      details: `Admin deleted product ID: ${id}`,
    });

    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Product deletion failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
