import { NextRequest, NextResponse } from "next/server";
import { getCatalogManagementStats } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const stats = await getCatalogManagementStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate catalogue statistics", message: (error as Error).message },
      { status: 500 }
    );
  }
}

