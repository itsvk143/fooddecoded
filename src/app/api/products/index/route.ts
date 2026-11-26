import { NextRequest, NextResponse } from "next/server";
import { getSlimProductsIndex } from "@/lib/product-service";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const products = await getSlimProductsIndex();

    // Fast deterministic fingerprint hash based on catalog length and sample product IDs
    const sample = `${products.length}:${products[0]?._id || products[0]?.id || ""}:${
      products[products.length - 1]?._id || products[products.length - 1]?.id || ""
    }:${products[Math.floor(products.length / 2)]?._id || ""}`;
    const etag = `W/"${crypto.createHash("md5").update(sample).digest("hex")}"`;

    const clientEtag = request.headers.get("if-none-match");
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Product-Count": String(products.length),
          "X-Catalog-Hash": etag,
        },
      });
    }

    return NextResponse.json(products, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Product-Count": String(products.length),
        "X-Catalog-Hash": etag,
      },
    });
  } catch (error) {
    console.error("[API /api/products/index GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch slim products index", message: (error as Error).message },
      { status: 500 }
    );
  }
}
