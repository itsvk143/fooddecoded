import { NextRequest, NextResponse } from "next/server";
import { fetchSlimProductsIndex } from "@/lib/product-service";
import { SEED_CATEGORIES } from "@/lib/seed-data";
import { getCollection } from "@/lib/mongodb";
import { CategoryRecord, SlimProductItem } from "@/types";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));

    // 1. Fetch all products in slim representation (cached in memory on server)
    const allProducts = await fetchSlimProductsIndex();

    // 2. Fetch categories (from MongoDB if available, otherwise SEED_CATEGORIES)
    let categoriesList: { name: string; slug: string; description?: string; icon?: string }[] = [];
    try {
      const col = await getCollection<CategoryRecord>("categories");
      if (col) {
        const docs = await col.find({}).sort({ displayOrder: 1 }).toArray();
        if (docs && docs.length > 0) {
          categoriesList = docs.map((c) => ({
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            description: c.description,
            icon: c.icon,
          }));
        }
      }
    } catch {
      // Fallback below
    }

    if (categoriesList.length === 0) {
      categoriesList = SEED_CATEGORIES.map((c) => ({
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        description: c.description,
        icon: c.icon,
      }));
    }

    // 3. Group and slice the top products per category (sorted by overallScore descending)
    const sorted = [...allProducts].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));

    const productsByCategory: Record<string, SlimProductItem[]> = {};
    const totalCountByCategory: Record<string, number> = {};

    // Initialize map with known categories
    for (const cat of categoriesList) {
      productsByCategory[cat.name] = [];
      totalCountByCategory[cat.name] = 0;
    }

    for (const p of sorted) {
      const cat = p.category || "Other";
      totalCountByCategory[cat] = (totalCountByCategory[cat] || 0) + 1;

      if (!productsByCategory[cat]) {
        productsByCategory[cat] = [];
      }

      if (productsByCategory[cat].length < limit) {
        productsByCategory[cat].push(p);
      }
    }

    // Build enriched categories metadata
    const categories = categoriesList.map((c) => ({
      ...c,
      cachedCount: (productsByCategory[c.name] || []).length,
      totalCount: totalCountByCategory[c.name] || 0,
    }));

    const totalCachedProducts = Object.values(productsByCategory).reduce(
      (sum, list) => sum + list.length,
      0
    );

    // 4. Generate deterministic ETag & hash based on product IDs and scores
    const sampleFingerprint = `${totalCachedProducts}:${categoriesList.length}:${
      Object.keys(productsByCategory)
        .map((cat) => {
          const list = productsByCategory[cat];
          const firstId = list[0]?.id || list[0]?._id || "";
          const lastId = list[list.length - 1]?.id || list[list.length - 1]?._id || "";
          return `${cat}:${list.length}:${firstId}:${lastId}`;
        })
        .join("|")
    }`;

    const etag = `W/"${crypto.createHash("md5").update(sampleFingerprint).digest("hex")}"`;

    const clientEtag = request.headers.get("if-none-match");
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Total-Cached": String(totalCachedProducts),
          "X-Total-Categories": String(categories.length),
        },
      });
    }

    const payload = {
      version: "1.0",
      catalogHash: etag,
      timestamp: Date.now(),
      limitPerCategory: limit,
      totalCategories: categories.length,
      totalCachedProducts,
      categories,
      productsByCategory,
    };

    return NextResponse.json(payload, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Total-Cached": String(totalCachedProducts),
        "X-Total-Categories": String(categories.length),
      },
    });
  } catch (error) {
    console.error("[API /api/products/category-cache GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate category cache payload", message: (error as Error).message },
      { status: 500 }
    );
  }
}
