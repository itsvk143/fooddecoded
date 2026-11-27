import { NextRequest } from "next/server";
import { getCollection } from "./mongodb";
import { UserRecord, SessionRecord, UserRole } from "@/types";
import crypto from "crypto";
import { ObjectId, OptionalUnlessRequiredId } from "mongodb";
import { logAuditEvent } from "./audit";

export const SESSION_COOKIE_NAME = "fooddecode_session";
export const SESSION_DURATION_DAYS = 30;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export const ADMIN_EMAILS = new Set<string>([
  "fooddecoded01@gmail.com",
  "itsvikash143@gmail.com",
  ...(process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : []),
]);

export const SUPER_ADMIN_EMAILS = new Set<string>(
  process.env.SUPER_ADMIN_EMAILS
    ? process.env.SUPER_ADMIN_EMAILS.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : []
);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.has(clean) || SUPER_ADMIN_EMAILS.has(clean);
}

export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Resolves the authoritative role for an email.
 * Non-allowlisted emails can NEVER hold or retain ADMIN / SUPER_ADMIN privileges.
 */
export function resolveEffectiveRole(email?: string | null, storedRole?: UserRole): UserRole {
  const clean = (email || "").toLowerCase().trim();
  if (SUPER_ADMIN_EMAILS.has(clean)) return "SUPER_ADMIN";
  if (isAdminEmail(clean)) return "ADMIN";
  if (storedRole === "VIEWER" || storedRole === "EDITOR") return storedRole;
  return "USER";
}

// In-memory sessions & users fallback for offline / mock testing mode
const inMemorySessions = new Map<string, SessionRecord>();
const inMemoryUsers = new Map<string, UserRecord>();

export interface SessionValidationResult {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    profilePicture?: string;
    role: UserRole;
  };
  error?: string;
  token?: string;
}

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a persistent server-managed session (30-day default validity)
 */
export async function createSession(
  user: UserRecord,
  request?: NextRequest
): Promise<{ token: string; session: SessionRecord; cookieHeader: string }> {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
  const userId = user.id || (user._id ? String(user._id) : undefined) || user.googleId;
  const role: UserRole = resolveEffectiveRole(user.email, user.role);

  const sessionRecord: SessionRecord = {
    token,
    userId,
    userEmail: user.email,
    userName: user.name,
    userAvatar: user.profilePicture,
    role,
    createdAt: now,
    lastActiveAt: now,
    expiresAt,
    isRevoked: false,
    userAgent: request?.headers.get("user-agent") || undefined,
    ip: request?.headers.get("x-forwarded-for") || undefined,
  };

  try {
    const col = await getCollection<SessionRecord>("sessions");
    if (col) {
      await col.insertOne(sessionRecord as OptionalUnlessRequiredId<SessionRecord>);
    } else {
      inMemorySessions.set(token, sessionRecord);
    }
  } catch {
    inMemorySessions.set(token, sessionRecord);
  }

  if (isAdminRole(role)) {
    void logAuditEvent({
      action: "ADMIN_LOGIN",
      entityType: "auth",
      entityId: user.email,
      performedBy: user.email,
      details: `Administrator session established with role ${role}`,
      ipAddress: sessionRecord.ip,
    }).catch(() => {});
  }

  const cookieHeader = getSessionCookieHeader(token, expiresAt);
  return { token, session: sessionRecord, cookieHeader };
}

/**
 * Configure cookie response header for persistent login session (30 days)
 */
export function getSessionCookieHeader(token: string, expiresAt?: Date): string {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = expiresAt
    ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    : SESSION_DURATION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${
    isProduction ? "; Secure" : ""
  }`;
}

/**
 * Validates a server-managed session from cookies or Bearer token.
 * Rejects tampered, non-hex, revoked, or expired tokens.
 */
export async function validateSession(
  request: NextRequest | { cookies: { get: (name: string) => { value?: string } | undefined } }
): Promise<SessionValidationResult> {
  const cookieToken =
    "cookies" in request && typeof request.cookies.get === "function"
      ? request.cookies.get(SESSION_COOKIE_NAME)?.value
      : undefined;

  let headerToken: string | undefined;
  if ("headers" in request && typeof (request as NextRequest).headers?.get === "function") {
    const auth = (request as NextRequest).headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      headerToken = auth.slice(7).trim();
    }
  }

  const token = cookieToken || headerToken;
  if (!token) {
    return { authenticated: false, error: "No session token provided" };
  }

  // Reject malformed or tampered tokens early (must be 64-char hex)
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return { authenticated: false, error: "Invalid or tampered session token" };
  }

  try {
    let session: SessionRecord | null = null;
    const col = await getCollection<SessionRecord>("sessions");

    if (col) {
      session = (await col.findOne({ token })) as SessionRecord | null;
    } else {
      session = inMemorySessions.get(token) || null;
    }

    if (!session) {
      return { authenticated: false, error: "Session not found" };
    }

    if (session.isRevoked) {
      return { authenticated: false, error: "Session has been revoked" };
    }

    const now = new Date();
    const expiry = new Date(session.expiresAt);
    if (Number.isNaN(expiry.getTime()) || now > expiry) {
      return { authenticated: false, error: "Session has expired" };
    }

    // Rolling renewal: if last active > 1 hour ago, extend session by 30 days
    const lastActive = new Date(session.lastActiveAt);
    if (now.getTime() - lastActive.getTime() > 60 * 60 * 1000) {
      const newExpiry = new Date(now.getTime() + SESSION_DURATION_MS);
      if (col) {
        col.updateOne(
          { token },
          { $set: { lastActiveAt: now, expiresAt: newExpiry } }
        ).catch(() => {});
      } else {
        session.lastActiveAt = now;
        session.expiresAt = newExpiry;
      }
    }

    const effectiveRole = resolveEffectiveRole(session.userEmail, session.role);

    return {
      authenticated: true,
      token,
      user: {
        id: session.userId,
        email: session.userEmail,
        name: session.userName,
        profilePicture: session.userAvatar,
        role: effectiveRole,
      },
    };
  } catch (error) {
    console.error("[validateSession] Error:", error);
    return { authenticated: false, error: "Internal validation failure" };
  }
}

/**
 * Revokes an active session token
 */
export async function revokeSession(token: string): Promise<boolean> {
  if (!token) return false;

  inMemorySessions.delete(token);

  try {
    const col = await getCollection<SessionRecord>("sessions");
    if (col) {
      await col.updateOne({ token }, { $set: { isRevoked: true, lastActiveAt: new Date() } });
      return true;
    }
  } catch {
    // Non-fatal
  }
  return true;
}

/**
 * Upserts a Google authenticated user record.
 * Strictly preserves USER role for ordinary registrations; only server allowlist grants ADMIN/SUPER_ADMIN.
 */
export async function upsertGoogleUser(googleProfile: {
  id: string; // Google 'sub'
  email: string;
  name: string;
  picture?: string;
}): Promise<UserRecord> {
  const now = new Date();
  const cleanEmail = googleProfile.email.toLowerCase().trim();

  try {
    const col = await getCollection<UserRecord>("users");
    if (col) {
      let user = await col.findOne({ googleId: googleProfile.id });

      if (!user) {
        user = await col.findOne({ email: cleanEmail });
      }

      if (user) {
        const resolvedRole = resolveEffectiveRole(cleanEmail, user.role);
        const updatedUser: UserRecord = {
          ...user,
          id: user.id || user._id?.toString(),
          googleId: googleProfile.id,
          name: googleProfile.name || user.name,
          profilePicture: googleProfile.picture || user.profilePicture,
          lastLoginAt: now,
          role: resolvedRole,
          isActive: user.isActive !== false,
        };

        await col.updateOne(
          { _id: user._id },
          {
            $set: {
              googleId: googleProfile.id,
              name: updatedUser.name,
              profilePicture: updatedUser.profilePicture,
              role: resolvedRole,
              lastLoginAt: now,
            },
          }
        );

        return updatedUser;
      }

      const assignedRole = resolveEffectiveRole(cleanEmail);
      const newUserId = new ObjectId().toString();
      const newUser: UserRecord = {
        id: newUserId,
        googleId: googleProfile.id,
        name: googleProfile.name,
        email: cleanEmail,
        profilePicture: googleProfile.picture,
        authProvider: "GOOGLE",
        role: assignedRole,
        isActive: true,
        createdAt: now,
        lastLoginAt: now,
      };

      const insertResult = await col.insertOne(newUser as OptionalUnlessRequiredId<UserRecord>);
      newUser._id = insertResult.insertedId.toString();
      newUser.id = insertResult.insertedId.toString();

      return newUser;
    }
  } catch (e) {
    console.warn("[upsertGoogleUser] MongoDB error, falling back to memory:", e);
  }

  // In-memory fallback
  const existing = inMemoryUsers.get(googleProfile.id) || inMemoryUsers.get(cleanEmail);
  if (existing) {
    existing.lastLoginAt = now;
    existing.name = googleProfile.name || existing.name;
    existing.profilePicture = googleProfile.picture || existing.profilePicture;
    existing.role = resolveEffectiveRole(cleanEmail, existing.role);
    return existing;
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    googleId: googleProfile.id,
    name: googleProfile.name,
    email: cleanEmail,
    profilePicture: googleProfile.picture,
    authProvider: "GOOGLE",
    role: resolveEffectiveRole(cleanEmail),
    isActive: true,
    createdAt: now,
    lastLoginAt: now,
  };
  inMemoryUsers.set(googleProfile.id, newUser);
  inMemoryUsers.set(cleanEmail, newUser);
  return newUser;
}

/**
 * Configure cookie response header for persistent logout
 */
export function getLogoutCookieHeader(): string {
  const isProduction = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax${
    isProduction ? "; Secure" : ""
  }`;
}
