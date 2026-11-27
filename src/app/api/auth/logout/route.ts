import { NextRequest, NextResponse } from "next/server";
import { validateSession, revokeSession, getLogoutCookieHeader, isAdminRole } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const validation = await validateSession(request);

  if (validation.token) {
    await revokeSession(validation.token);
    if (validation.user) {
      await logAuditEvent({
        action: isAdminRole(validation.user.role) ? "ADMIN_LOGOUT" : "USER_LOGOUT",
        entityType: "auth",
        entityId: validation.user.email,
        performedBy: validation.user.email,
        details: `Session revoked on logout (role=${validation.user.role})`,
      }).catch(() => {});
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.headers.append("Set-Cookie", getLogoutCookieHeader());
  return response;
}
