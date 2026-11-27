import { NextRequest } from "next/server";

export const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback";

function normalizeOrigin(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    return false;
  }
}

/**
 * Sanitizes relative return URLs to prevent open redirects.
 */
export function sanitizeReturnUrl(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/";
  }
  return raw;
}

/**
 * Resolves the canonical origin for OAuth redirects using trusted proxy headers / request URL,
 * stripping trailing slashes and ignoring localhost NEXT_PUBLIC_APP_URL overrides on remote hosts.
 */
export function getOAuthOrigin(request: NextRequest): string {
  const fwdHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim();
  const fwdProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  const requestUrlOrigin = normalizeOrigin(request.url) || "http://localhost:3000";
  const resolvedHost = fwdHost || hostHeader;
  const resolvedProto =
    fwdProto ||
    (resolvedHost && !isLocalhostOrigin(`http://${resolvedHost}`)
      ? "https"
      : new URL(requestUrlOrigin).protocol.replace(":", ""));

  const incomingOrigin =
    (resolvedHost ? normalizeOrigin(`${resolvedProto}://${resolvedHost}`) : null) ||
    requestUrlOrigin;

  const envOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);

  if (isLocalhostOrigin(incomingOrigin)) {
    return incomingOrigin;
  }

  if (envOrigin && !isLocalhostOrigin(envOrigin)) {
    return envOrigin;
  }

  return incomingOrigin;
}

/**
 * Returns the exact Google OAuth 2.0 callback URI shared by initiation and token exchange.
 */
export function getGoogleRedirectUri(request: NextRequest): string {
  return `${getOAuthOrigin(request)}${GOOGLE_CALLBACK_PATH}`;
}

export function buildAuthErrorRedirectUrl(
  origin: string,
  returnUrl: string,
  authError: string
): URL {
  const safePath = sanitizeReturnUrl(returnUrl);
  const url = new URL(safePath, origin);
  url.searchParams.set("auth_error", authError);
  return url;
}
