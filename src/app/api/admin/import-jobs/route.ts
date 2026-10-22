import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ImportJob } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const col = await getCollection<ImportJob>("importJobs");
    if (col) {
      const jobs = await col.find({}).sort({ createdAt: -1 }).limit(20).toArray();
      return NextResponse.json(jobs.map((j) => ({ ...j, _id: j._id?.toString() })));
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
