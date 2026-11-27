import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { getCompleteBrandDirectory, BrandDirectoryQueryOptions } from "@/lib/brand-directory-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productCountRange = (searchParams.get("productCountRange") || "all") as BrandDirectoryQueryOptions["productCountRange"];
    const sortBy = (searchParams.get("sortBy") || "count_desc") as BrandDirectoryQueryOptions["sortBy"];

    const result = await getCompleteBrandDirectory({
      q: searchParams.get("q") || undefined,
      productCountRange,
      category: searchParams.get("category") || undefined,
      hasIncomplete: searchParams.get("hasIncomplete") === "true",
      hasMissingImages: searchParams.get("hasMissingImages") === "true",
      sortBy,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 25,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to aggregate brand directory", message: (error as Error).message },
      { status: 500 }
    );
  }
}
