import { NextRequest, NextResponse } from "next/server";
import { getProductByBarcode } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await params;
    const cleanBarcode = barcode?.trim();

    if (!cleanBarcode) {
      return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
    }

    const { product, source } = await getProductByBarcode(cleanBarcode);

    if (!product) {
      return NextResponse.json(
        {
          found: false,
          barcode: cleanBarcode,
          message: "Product not found in local database or Open Food Facts. You can submit this product for review.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      found: true,
      source,
      product,
    });
  } catch (error) {
    console.error("[API /api/products/barcode/[barcode]] Error:", error);
    return NextResponse.json(
      { error: "Barcode search error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
