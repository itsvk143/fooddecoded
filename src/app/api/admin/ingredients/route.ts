import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { IngredientRecord } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { KNOWN_INGREDIENTS } from "@/lib/ingredient-matcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const col = await getCollection<IngredientRecord>("ingredients");
    let customIngredients: IngredientRecord[] = [];
    if (col) {
      customIngredients = await col.find({}).sort({ updatedAt: -1 }).toArray();
    }

    return NextResponse.json({
      builtinCount: KNOWN_INGREDIENTS.length,
      customIngredients: customIngredients.map((c) => ({ ...c, _id: c._id?.toString() })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list ingredients", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Ingredient name is required" }, { status: 400 });
    }

    const normalizedName = body.name.toLowerCase().trim();
    const record: IngredientRecord = {
      name: body.name.trim(),
      normalizedName,
      aliases: Array.isArray(body.aliases)
        ? body.aliases.map((a: string) => a.trim().toLowerCase())
        : (body.aliases || "").split(",").map((a: string) => a.trim().toLowerCase()).filter(Boolean),
      category: body.category || "additive",
      riskLevel: body.riskLevel || "caution",
      description: body.description || "",
      healthConcerns: Array.isArray(body.healthConcerns)
        ? body.healthConcerns
        : (body.healthConcerns || "").split("\n").map((c: string) => c.trim()).filter(Boolean),
      isPalmOil: Boolean(body.isPalmOil),
      isAddedSugar: Boolean(body.isAddedSugar),
      isAllergen: Boolean(body.isAllergen),
      allergenType: body.allergenType || "",
      regulatoryStatus: body.regulatoryStatus || "Regulated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const col = await getCollection<IngredientRecord>("ingredients");
    if (col) {
      await col.updateOne(
        { normalizedName: record.normalizedName },
        { $set: record },
        { upsert: true }
      );
    }

    await logAuditEvent({
      action: "SAVE_INGREDIENT_RULE",
      entityType: "ingredient",
      entityId: record.normalizedName,
      performedBy: auth.adminIdentifier,
      details: `Configured ingredient risk rule: ${record.name} (${record.riskLevel})`,
    });

    return NextResponse.json({ success: true, ingredient: record });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save ingredient", message: (error as Error).message },
      { status: 500 }
    );
  }
}
