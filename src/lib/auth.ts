import crypto from "crypto";
import { NextRequest } from "next/server";
import { validateSession, isAdminRole } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";

const WEAK_PLACEHOLDER_KEYS = new Set([
  "fooddecode_admin_secret_key_change_in_production",
  "replace_with_a_secure_random_string_min_32_chars",
  "changeme",
  "admin",
  "secret",
]);

function constantTimeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Resolves the active server-side Admin API Key.
 * In production, weak placeholder defaults are strictly disabled (fail closed).
 */
function getConfiguredAdminKey(): string | null {
  const envKey = process.env.ADMIN_SECRET_KEY?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!envKey) {
    return isProd ? null : "fooddecode_admin_secret_key_change_in_production";
  }

  if (isProd && (WEAK_PLACEHOLDER_KEYS.has(envKey) || envKey.length < 24)) {
    return null;
  }

  return envKey;
}

/**
 * Validates administrative requests using header/Bearer admin API key (never URL query params).
 */
export function verifyAdminAccess(request: NextRequest): {
  authorized: boolean;
  error?: string;
  adminIdentifier?: string;
} {
  const configuredKey = getConfiguredAdminKey();
  if (!configuredKey) {
    return {
      authorized: false,
      error: "Admin key access is disabled or not securely configured. Sign in as an authorized administrator.",
    };
  }

  const headerKey = request.headers.get("x-admin-key");
  const authHeader = request.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const cookieKey = request.cookies.get("admin_token")?.value;

  const providedKey = headerKey || bearerKey || cookieKey;

  if (!providedKey) {
    return {
      authorized: false,
      error: "Unauthorized: Missing administrator credentials.",
    };
  }

  if (!constantTimeMatch(providedKey, configuredKey)) {
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
 * Unified async admin authorization:
 * Accepts either a verified server-side session with ADMIN / SUPER_ADMIN role
 * OR a valid strong ADMIN_SECRET_KEY header/Bearer token.
 * Automatically audits denied access attempts.
 */
export async function verifyAdminAccessAsync(request: NextRequest): Promise<{
  authorized: boolean;
  status: number;
  error?: string;
  adminIdentifier?: string;
  role?: string;
}> {
  // 1. Check authenticated HTTP-only user session first
  const session = await validateSession(request);
  if (session.authenticated && session.user) {
    if (isAdminRole(session.user.role)) {
      return {
        authorized: true,
        status: 200,
        adminIdentifier: session.user.email,
        role: session.user.role,
      };
    }

    // Authenticated non-admin user (USER / VIEWER / EDITOR) attempting admin operation -> 403 Forbidden
    void logAuditEvent({
      action: "ADMIN_FORBIDDEN_ATTEMPT",
      entityType: "auth",
      entityId: request.nextUrl.pathname,
      performedBy: session.user.email,
      details: `Forbidden ${request.method} attempt to ${request.nextUrl.pathname} by role ${session.user.role}`,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    }).catch(() => {});

    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Administrator privileges required.",
    };
  }

  // 2. Check programmatic server-to-server ADMIN_SECRET_KEY header (only if strong key configured)
  const keyAuth = verifyAdminAccess(request);
  if (keyAuth.authorized) {
    return {
      authorized: true,
      status: 200,
      adminIdentifier: keyAuth.adminIdentifier || "admin_master",
      role: "ADMIN",
    };
  }

  // 3. Unauthenticated or invalid/expired/tampered session -> 401 Unauthorized
  void logAuditEvent({
    action: "ADMIN_UNAUTHORIZED_ATTEMPT",
    entityType: "auth",
    entityId: request.nextUrl.pathname,
    performedBy: "anonymous",
    details: `Unauthorized ${request.method} attempt to ${request.nextUrl.pathname}: ${session.error || keyAuth.error || "No credentials"}`,
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
  }).catch(() => {});

  return {
    authorized: false,
    status: 401,
    error: "Unauthorized: Valid administrator authentication required.",
  };
}
