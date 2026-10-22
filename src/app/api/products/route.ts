import { NextRequest, NextResponse } from "next/server";
import { queryProducts, saveProduct } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const nutriScore = searchParams.get("nutriScore") || undefined;
    const novaGroup = searchParams.get("novaGroup") ? Number(searchParams.get("novaGroup")) : undefined;
    const minScore = searchParams.get("minScore") ? Number(searchParams.get("minScore")) : undefined;
    const maxScore = searchParams.get("maxScore") ? Number(searchParams.get("maxScore")) : undefined;
    const hasPalmOil = searchParams.has("hasPalmOil") ? searchParams.get("hasPalmOil") === "true" : undefined;
    const hasAddedSugar = searchParams.has("hasAddedSugar") ? searchParams.get("hasAddedSugar") === "true" : undefined;
    const lowSodium = searchParams.get("lowSodium") === "true";
    const lowSugar = searchParams.get("lowSugar") === "true";
    const proteinRange = searchParams.get("proteinRange") || undefined;
    const sugarRange = searchParams.get("sugarRange") || undefined;
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sortBy = (searchParams.get("sortBy") as any) || "recent";
    const sortOrder = (searchParams.get("sortOrder") as any) || "desc";
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12;

    const result = await queryProducts({
      q,
      category,
      brand,
      nutriScore,
      novaGroup,
      minScore,
      maxScore,
      hasPalmOil,
      hasAddedSugar,
      lowSodium,
      lowSugar,
      proteinRange,
      sugarRange,
      verifiedOnly,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /api/products GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products catalogue", message: (error as Error).message },
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
    if (!body.barcode || !body.name) {
      return NextResponse.json(
        { error: "Validation Error: Barcode and Product Name are required." },
        { status: 400 }
      );
    }

    const saved = await saveProduct(body);

    await logAuditEvent({
      action: "CREATE_PRODUCT",
      entityType: "product",
      entityId: saved.barcode,
      performedBy: auth.adminIdentifier,
      details: `Created product: ${saved.name} (${saved.barcode})`,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("[API /api/products POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create product", message: (error as Error).message },
      { status: 500 }
    );
  }
}
