import { NextRequest } from "next/server";
import { validateSession } from "@/lib/session";

const DEFAULT_DEV_KEY = "fooddecode_admin_secret_key_change_in_production";

/**
 * Validates administrative requests using a secure bearer token or header
 */
export function verifyAdminAccess(request: NextRequest): {
  authorized: boolean;
  error?: string;
  adminIdentifier?: string;
} {
  const configuredKey = process.env.ADMIN_SECRET_KEY || DEFAULT_DEV_KEY;

  const headerKey = request.headers.get("x-admin-key");
  const authHeader = request.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const cookieKey = request.cookies.get("admin_token")?.value;
  const queryKey = request.nextUrl.searchParams.get("admin_key");

  const providedKey = headerKey || bearerKey || cookieKey || queryKey;

  if (!providedKey) {
    return {
      authorized: false,
      error: "Missing administration key. Pass 'x-admin-key' header or Bearer token.",
    };
  }

  if (providedKey !== configuredKey) {
    return {
      authorized: false,
      error: "Unauthorized: Invalid administrative credentials.",
    };
  }

  return {
    authorized: true,
    adminIdentifier: "admin_master",
  };
}

/**
 * Unified async admin authorization: accepts either a valid ADMIN_SECRET_KEY
 * or an authenticated Google OAuth session belonging to an ADMIN role user.
 */
export async function verifyAdminAccessAsync(request: NextRequest): Promise<{
  authorized: boolean;
  status: number;
  error?: string;
  adminIdentifier?: string;
}> {
  const keyAuth = verifyAdminAccess(request);
  if (keyAuth.authorized) {
    return {
      authorized: true,
      status: 200,
      adminIdentifier: keyAuth.adminIdentifier || "admin_master",
    };
  }

  const session = await validateSession(request);
  if (session.authenticated && session.user) {
    if (session.user.role === "ADMIN") {
      return {
        authorized: true,
        status: 200,
        adminIdentifier: session.user.email,
      };
    }
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Administrator privileges required.",
    };
  }

  return {
    authorized: false,
    status: 401,
    error: keyAuth.error || "Unauthorized: Administrator authentication required.",
  };
}
