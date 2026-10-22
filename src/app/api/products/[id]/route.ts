import { NextRequest, NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing product identifier" }, { status: 400 });
    }

    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve product", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found to update" }, { status: 404 });
    }

    const updated = await saveProduct({ ...body, _id: existing._id, barcode: existing.barcode });

    await logAuditEvent({
      action: "UPDATE_PRODUCT",
      entityType: "product",
      entityId: existing.barcode,
      performedBy: auth.adminIdentifier,
      details: `Updated product fields for ${existing.name}`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json({ error: "Product not found or could not be deleted" }, { status: 404 });
    }

    await logAuditEvent({
      action: "DELETE_PRODUCT",
      entityType: "product",
      entityId: id,
      performedBy: auth.adminIdentifier,
      details: `Deleted product ID: ${id}`,
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product", message: (error as Error).message },
      { status: 500 }
    );
  }
}
