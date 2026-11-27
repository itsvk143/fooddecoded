import { NextRequest, NextResponse } from "next/server";
import { validateSession, isAdminRole } from "@/lib/session";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all /api/admin/* endpoints at the edge/proxy layer as first line of defense
  if (pathname.startsWith("/api/admin")) {
    const auth = await verifyAdminAccessAsync(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, private");
    return res;
  }

  // 2. Protect /admin and all /admin/* routes strictly on the server
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const validation = await validateSession(request);

    if (!validation.authenticated || !validation.user) {
      void logAuditEvent({
        action: "ADMIN_PAGE_UNAUTHENTICATED_REDIRECT",
        entityType: "auth",
        entityId: pathname,
        performedBy: "anonymous",
        details: `Unauthenticated request to ${pathname} redirected to /login (${validation.error || "No session"})`,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      }).catch(() => {});

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.headers.set("Cache-Control", "no-store, private");
      return redirectRes;
    }

    if (!isAdminRole(validation.user.role)) {
      void logAuditEvent({
        action: "ADMIN_PAGE_FORBIDDEN",
        entityType: "auth",
        entityId: pathname,
        performedBy: validation.user.email,
        details: `Authenticated non-admin user (${validation.user.role}) blocked with HTTP 403 on ${pathname}`,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      }).catch(() => {});

      return new NextResponse(
        `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>403 Forbidden — FoodDecode</title><meta name="robots" content="noindex" /><style>body{font-family:system-ui,-apple-system,sans-serif;background:#fafaf9;color:#1c1917;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px}main{max-width:440px;background:#fff;border:1px solid #e7e5e4;border-radius:24px;padding:32px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.06)}h1{margin:0 0 8px;font-size:22px}p{font-size:13px;color:#57534e;line-height:1.5;margin:0 0 20px}a{display:inline-block;padding:10px 18px;border-radius:12px;background:#10b981;color:#052e16;font-weight:700;font-size:12px;text-decoration:none}</style></head><body><main><h1>403 — Access Forbidden</h1><p>Your account does not have administrator privileges required to access the FoodDecode Admin Control Plane.</p><a href="/">Return to FoodDecode</a></main></body></html>`,
        {
          status: 403,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store, private",
            "X-Robots-Tag": "noindex",
          },
        }
      );
    }

    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, private");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
