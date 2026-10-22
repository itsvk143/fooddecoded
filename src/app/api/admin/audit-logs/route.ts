import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/audit";
import { verifyAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;

    const logs = await getAuditLogs(limit);
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch audit logs", message: (error as Error).message },
      { status: 500 }
    );
  }
}
