import { NextRequest, NextResponse } from "next/server";
import { queryProducts } from "@/lib/product-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q || q.trim().length < 1) {
      return NextResponse.json({ results: [] });
    }

    const { products } = await queryProducts({
      q,
      limit: 6,
    });

    const results = products.map((p) => ({
      id: p.id || p._id,
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      overallScore: p.overallScore,
      scoreLabel: p.scoreLabel,
      nutriScore: p.nutriScore,
      imageUrl: p.imageUrl,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Search query failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
