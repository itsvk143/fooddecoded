import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/product-service";
import { ProductItem } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = body.ids || body.barcodes || [];

    if (!Array.isArray(ids) || ids.length < 2) {
      return NextResponse.json(
        { error: "Provide an array of at least 2 product IDs or barcodes to compare." },
        { status: 400 }
      );
    }

    if (ids.length > 4) {
      return NextResponse.json(
        { error: "Comparison limit is 4 products maximum." },
        { status: 400 }
      );
    }

    const products: ProductItem[] = [];
    for (const id of ids) {
      const prod = await getProductById(id);
      if (prod) {
        products.push(prod);
      }
    }

    if (products.length < 2) {
      return NextResponse.json(
        { error: "Could not find enough matching products to perform a comparison." },
        { status: 404 }
      );
    }

    // Determine comparison highlights
    const bestOverall = [...products].sort((a, b) => b.overallScore - a.overallScore)[0];
    const lowestSugar = [...products].sort((a, b) => a.nutritionPer100g.sugars - b.nutritionPer100g.sugars)[0];
    const lowestSodium = [...products].sort((a, b) => a.nutritionPer100g.sodium - b.nutritionPer100g.sodium)[0];
    const highestProtein = [...products].sort((a, b) => b.nutritionPer100g.protein - a.nutritionPer100g.protein)[0];

    return NextResponse.json({
      products,
      highlights: {
        bestOverallId: bestOverall.id || bestOverall._id,
        lowestSugarId: lowestSugar.id || lowestSugar._id,
        lowestSodiumId: lowestSodium.id || lowestSodium._id,
        highestProteinId: highestProtein.id || highestProtein._id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Comparison calculation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
