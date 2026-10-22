import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { BrandRecord } from "@/types";
import { SEED_BRANDS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const col = await getCollection<BrandRecord>("brands");
    if (col) {
      const brands = await col.find({}).toArray();
      if (brands.length > 0) {
        return NextResponse.json(brands.map((b) => ({ ...b, _id: b._id?.toString() })));
      }
    }
    return NextResponse.json(SEED_BRANDS);
  } catch {
    return NextResponse.json(SEED_BRANDS);
  }
}
