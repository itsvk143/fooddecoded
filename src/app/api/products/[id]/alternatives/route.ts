import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProductAlternatives } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const alternatives = await getProductAlternatives(product);

    return NextResponse.json({
      product: {
        id: product.id || product._id,
        name: product.name,
        category: product.category,
        overallScore: product.overallScore,
      },
      alternatives,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alternatives", message: (error as Error).message },
      { status: 500 }
    );
  }
}
