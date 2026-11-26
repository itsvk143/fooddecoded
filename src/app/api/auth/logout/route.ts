import { NextRequest, NextResponse } from "next/server";
import { validateSession, revokeSession, getLogoutCookieHeader } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const validation = await validateSession(request);

  if (validation.token) {
    await revokeSession(validation.token);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.headers.append("Set-Cookie", getLogoutCookieHeader());
  return response;
}
