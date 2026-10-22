import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { IngredientRecord } from "@/types";
import { KNOWN_INGREDIENTS } from "@/lib/ingredient-matcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";

    const col = await getCollection<IngredientRecord>("ingredients");
    let dbMatches: IngredientRecord[] = [];

    if (col && q) {
      dbMatches = await col
        .find({
          $or: [
            { name: new RegExp(q, "i") },
            { normalizedName: new RegExp(q, "i") },
            { aliases: new RegExp(q, "i") },
          ],
        })
        .limit(20)
        .toArray();
    }

    // Filter built-in definitions
    const builtinMatches = KNOWN_INGREDIENTS.filter(
      (k) =>
        !q ||
        k.normalized.includes(q) ||
        k.aliases.some((a) => a.includes(q)) ||
        k.description.toLowerCase().includes(q)
    ).map((k) => ({
      name: k.normalized,
      normalizedName: k.normalized,
      aliases: k.aliases,
      riskLevel: k.riskLevel,
      category: k.category,
      description: k.description,
      healthConcerns: k.healthConcerns,
      isPalmOil: k.isPalmOil,
      isAddedSugar: k.isAddedSugar,
      isAllergen: k.isAllergen,
      allergenType: k.allergenType,
      regulatoryStatus: k.regulatoryStatus,
    }));

    // Merge and deduplicate by normalizedName
    const map = new Map<string, any>();
    for (const b of builtinMatches) {
      map.set(b.normalizedName, b);
    }
    for (const d of dbMatches) {
      map.set(d.normalizedName, { ...d, _id: d._id?.toString() });
    }

    return NextResponse.json({
      query: q,
      results: Array.from(map.values()).slice(0, 50),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ingredient search failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
