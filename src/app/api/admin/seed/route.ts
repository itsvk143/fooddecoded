import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import {
  generateSeedProducts,
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_RULES,
  SEED_SUBMISSIONS,
} from "@/lib/seed-data";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "MONGODB_URI is not set in environment variables. Database seeding requires a valid MongoDB connection string. Currently serving in-memory demo data.",
      },
      { status: 400 }
    );
  }

  try {
    const prodCol = await getCollection("products");
    const catCol = await getCollection("categories");
    const brandCol = await getCollection("brands");
    const ruleCol = await getCollection("analysisRules");
    const subCol = await getCollection("productSubmissions");

    let seededCount = 0;

    if (prodCol) {
      const seedProducts = generateSeedProducts();
      for (const p of seedProducts) {
        const { _id, id, ...cleanDoc } = p;
        await prodCol.updateOne(
          { barcode: p.barcode },
          { $set: cleanDoc },
          { upsert: true }
        );
        seededCount++;
      }
    }

    if (catCol) {
      for (const c of SEED_CATEGORIES) {
        await catCol.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
      }
    }

    if (brandCol) {
      for (const b of SEED_BRANDS) {
        await brandCol.updateOne({ slug: b.slug }, { $set: b }, { upsert: true });
      }
    }

    if (ruleCol) {
      for (const r of SEED_RULES) {
        await ruleCol.updateOne({ version: r.version }, { $set: r }, { upsert: true });
      }
    }

    if (subCol) {
      for (const s of SEED_SUBMISSIONS) {
        const { _id, ...cleanSub } = s;
        await subCol.updateOne({ barcode: s.barcode }, { $set: cleanSub }, { upsert: true });
      }
    }

    await logAuditEvent({
      action: "SEED_DATABASE",
      entityType: "product",
      performedBy: auth.adminIdentifier,
      details: `Seeded ${seededCount} starter products, categories, brands, and rules into MongoDB Atlas`,
    });

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with ${seededCount} products, categories, brands, and rules!`,
      productsSeeded: seededCount,
    });
  } catch (error) {
    console.error("[API /api/admin/seed POST] Error:", error);
    return NextResponse.json(
      { error: "Seeding failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
