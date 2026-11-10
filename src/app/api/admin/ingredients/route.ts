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
    const classification = body.classification || (
      body.riskLevel === "avoid" ? "RED" : body.riskLevel === "caution" ? "ORANGE" : "GREEN"
    );
    const riskLevel = body.riskLevel || (
      classification === "RED" ? "avoid" : classification === "ORANGE" ? "caution" : "safe"
    );

    const record: IngredientRecord = {
      name: body.name.trim(),
      normalizedName,
      aliases: Array.isArray(body.aliases)
        ? body.aliases.map((a: string) => a.trim().toLowerCase())
        : (body.aliases || "").split(",").map((a: string) => a.trim().toLowerCase()).filter(Boolean),
      insNumber: body.insNumber || null,
      category: body.category || "additive",
      origin: body.origin || "Manufactured / Synthetic",
      classification,
      classificationReason: body.classificationReason || body.description || "",
      riskLevel,
      description: body.description || "",
      foodFunction: body.foodFunction || "",
      benefits: Array.isArray(body.benefits)
        ? body.benefits
        : (body.benefits || "").split("\n").map((b: string) => b.trim()).filter(Boolean),
      risks: Array.isArray(body.risks)
        ? body.risks
        : (body.risks || "").split("\n").map((r: string) => r.trim()).filter(Boolean),
      dailyIntake: body.dailyIntake || {
        recommended: body.recommendedIntake || null,
        adi: body.adi || null,
        maximum: body.maximumLimit || null,
        unit: body.unit || null,
        basis: body.basis || null,
        status: body.adi || body.recommendedIntake ? "ESTABLISHED" : "NOT_ESTABLISHED",
        explanation: body.dailyIntakeExplanation || "No universally established recommended daily intake.",
      },
      precautions: Array.isArray(body.precautions)
        ? body.precautions
        : (body.precautions || "").split("\n").map((p: string) => p.trim()).filter(Boolean),
      verdict: body.verdict || "",
      healthConcerns: Array.isArray(body.healthConcerns)
        ? body.healthConcerns
        : (body.healthConcerns || "").split("\n").map((c: string) => c.trim()).filter(Boolean),
      isPalmOil: Boolean(body.isPalmOil),
      isAddedSugar: Boolean(body.isAddedSugar),
      isAllergen: Boolean(body.isAllergen),
      allergenType: body.allergenType || "",
      regulatoryStatus: body.regulatoryStatus || "Regulated",
      evidenceLevel: body.evidenceLevel || "MODERATE",
      verificationStatus: body.verificationStatus || "VERIFIED",
      sources: Array.isArray(body.sources) ? body.sources : [],
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastReviewedAt: new Date().toISOString(),
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
