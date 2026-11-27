import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { getProductsByBrand } from "@/lib/brand-directory-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  if (!brand) {
    return NextResponse.json({ error: "Missing required query parameter: brand" }, { status: 400 });
  }

  try {
    const result = await getProductsByBrand({
      brand,
      q: searchParams.get("q") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 25,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products for brand", message: (error as Error).message },
      { status: 500 }
    );
  }
}
