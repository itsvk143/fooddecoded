import { NextResponse } from "next/server";
import { getSlimProductsIndex } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getSlimProductsIndex();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[API /api/products/index GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch slim products index", message: (error as Error).message },
      { status: 500 }
    );
  }
}
