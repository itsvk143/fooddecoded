import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CategoryRecord, ProductItem } from "@/types";
import { SEED_CATEGORIES } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const col = await getCollection<CategoryRecord>("categories");
    const prodCol = await getCollection<ProductItem>("products");

    if (col) {
      const categories = await col.find({}).toArray();
      if (categories.length > 0) {
        // Enrich with real product counts if possible
        if (prodCol) {
          const [counts, subCounts] = await Promise.all([
            prodCol
              .aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
              ])
              .toArray(),
            prodCol
              .aggregate([
                { $group: { _id: "$subCategory", count: { $sum: 1 } } },
              ])
              .toArray(),
          ]);
          const countMap = new Map(counts.map((c) => [c._id, c.count]));

          const enriched = categories.map((c) => ({
            ...c,
            _id: c._id?.toString(),
            productCount: countMap.get(c.name) || 0,
          }));

          // Append subcategory entries so subcategory badges in menus map directly
          for (const s of subCounts) {
            if (s._id) {
              enriched.push({
                slug: s._id.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                name: s._id,
                description: `${s._id} products`,
                icon: "📦",
                productCount: s.count,
                isActive: true,
              } as any);
            }
          }

          return NextResponse.json(enriched);
        }
        return NextResponse.json(categories.map((c) => ({ ...c, _id: c._id?.toString() })));
      }
    }

    return NextResponse.json(SEED_CATEGORIES);
  } catch (error) {
    return NextResponse.json(SEED_CATEGORIES);
  }
}
