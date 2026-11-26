import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const validation = await validateSession(request);

  if (!validation.authenticated || !validation.user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: validation.user,
  });
}
