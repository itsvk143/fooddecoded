import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/product-service";
import { getTrafficLightLevels } from "@/lib/scoring-engine";

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

    const trafficLights = getTrafficLightLevels(product.nutritionPer100g);

    // Group ingredients by risk
    const safeIngredients = product.ingredientsList.filter((i) => i.riskLevel === "safe");
    const cautionIngredients = product.ingredientsList.filter((i) => i.riskLevel === "caution");
    const avoidIngredients = product.ingredientsList.filter((i) => i.riskLevel === "avoid");

    return NextResponse.json({
      productId: product.id || product._id,
      barcode: product.barcode,
      name: product.name,
      overallScore: product.overallScore,
      scoreLabel: product.scoreLabel,
      nutriScore: product.nutriScore,
      novaGroup: product.novaGroup,
      dataCompleteness: product.dataCompleteness,
      trafficLights,
      riskSummary: {
        totalIngredients: product.ingredientsList.length,
        safeCount: safeIngredients.length,
        cautionCount: cautionIngredients.length,
        avoidCount: avoidIngredients.length,
        allergensCount: product.allergens.length,
      },
      flaggedIngredients: {
        avoid: avoidIngredients,
        caution: cautionIngredients,
      },
      allergens: product.allergens,
      ingredientAlerts: product.ingredientAlerts,
      verified: product.verified,
      source: product.source,
      sourceUrl: product.sourceUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate analysis", message: (error as Error).message },
      { status: 500 }
    );
  }
}
