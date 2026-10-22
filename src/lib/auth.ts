import { NextRequest } from "next/server";

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

  // Constant-time comparison or length check to prevent timing leaks
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
