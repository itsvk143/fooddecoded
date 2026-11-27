import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSession, isAdminEmail } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, demoUser, profile } = body;

    let googleProfile: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    } | null = null;

    if (credential && typeof credential === "string") {
      // Verify Google ID Token cryptographically via Google tokeninfo endpoint
      const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
      const tokenRes = await fetch(verifyUrl, { cache: "no-store" });
      if (!tokenRes.ok) {
        return NextResponse.json(
          { error: "Invalid or expired Google ID token." },
          { status: 401 }
        );
      }

      const payload = await tokenRes.json();
      const expectedAud = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const validIssuers = new Set(["accounts.google.com", "https://accounts.google.com"]);

      if (
        !payload.sub ||
        !payload.email ||
        (payload.email_verified !== true && payload.email_verified !== "true") ||
        (payload.iss && !validIssuers.has(payload.iss)) ||
        (expectedAud && payload.aud !== expectedAud) ||
        (payload.exp && Number(payload.exp) * 1000 <= Date.now())
      ) {
        return NextResponse.json(
          { error: "Google token verification failed security checks." },
          { status: 401 }
        );
      }

      googleProfile = {
        id: String(payload.sub),
        email: String(payload.email),
        name: String(payload.name || String(payload.email).split("@")[0]),
        picture: payload.picture ? String(payload.picture) : undefined,
      };
    } else if (demoUser || profile) {
      // Strictly prohibit demo/mock sign-in in production OR for any admin email
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Direct profile authentication is disabled in production. Use Google OAuth." },
          { status: 403 }
        );
      }

      const targetEmail = String(profile?.email || "community.tester@example.com").toLowerCase().trim();
      if (isAdminEmail(targetEmail)) {
        return NextResponse.json(
          { error: "Forbidden: Administrator accounts cannot authenticate via demo fallback." },
          { status: 403 }
        );
      }

      googleProfile = {
        id: profile?.id || "google_user_demo_108293810293",
        email: targetEmail,
        name: profile?.name || "Verified Community Member",
        picture:
          profile?.picture ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      };
    }

    if (!googleProfile) {
      return NextResponse.json(
        { error: "Missing valid Google authentication token" },
        { status: 400 }
      );
    }

    const user = await upsertGoogleUser(googleProfile);
    const { cookieHeader } = await createSession(user, request);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id || user._id?.toString(),
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role || "USER",
      },
    });

    response.headers.append("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    console.error("[API /api/auth/google/verify POST] Error:", error);
    return NextResponse.json(
      { error: "Google authentication failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
