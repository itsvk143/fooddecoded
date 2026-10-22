import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { AnalysisRule } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { SEED_RULES } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const col = await getCollection<AnalysisRule>("analysisRules");
    if (col) {
      const activeRule = await col.findOne({ isActive: true });
      if (activeRule) {
        return NextResponse.json({ ...activeRule, _id: activeRule._id?.toString() });
      }
    }
    return NextResponse.json(SEED_RULES[0]);
  } catch (error) {
    return NextResponse.json(SEED_RULES[0]);
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const col = await getCollection<AnalysisRule>("analysisRules");

    const updatedRule: AnalysisRule = {
      version: (body.version || 1) + 1,
      name: body.name || "Updated Global Health Scoring",
      category: body.category || "general",
      rules: {
        sugarWeight: Number(body.rules?.sugarWeight ?? 1.2),
        satFatWeight: Number(body.rules?.satFatWeight ?? 1.5),
        sodiumWeight: Number(body.rules?.sodiumWeight ?? 1.0),
        additiveWeight: Number(body.rules?.additiveWeight ?? 2.0),
        fiberBonus: Number(body.rules?.fiberBonus ?? 1.5),
        proteinBonus: Number(body.rules?.proteinBonus ?? 1.2),
        novaPenalties: body.rules?.novaPenalties || { 1: 5, 2: 0, 3: -8, 4: -20 },
      },
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    if (col) {
      await col.updateMany({}, { $set: { isActive: false } });
      await col.insertOne(updatedRule as any);
    }

    await logAuditEvent({
      action: "UPDATE_SCORING_RULE",
      entityType: "rule",
      performedBy: auth.adminIdentifier,
      details: `Updated scoring algorithm rule version ${updatedRule.version}`,
    });

    return NextResponse.json({ success: true, rule: updatedRule });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update scoring rules", message: (error as Error).message },
      { status: 500 }
    );
  }
}
