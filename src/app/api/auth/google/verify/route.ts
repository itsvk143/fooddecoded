import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSession } from "@/lib/session";

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
      // Decode Google JWT ID token payload
      const parts = credential.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");
        const payload = JSON.parse(payloadJson);

        if (!payload.sub || !payload.email) {
          return NextResponse.json(
            { error: "Invalid Google credential token payload" },
            { status: 400 }
          );
        }

        googleProfile = {
          id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split("@")[0],
          picture: payload.picture,
        };
      }
    } else if (demoUser || profile) {
      // Local development / demo fallback for testing before production Google credentials are set
      googleProfile = {
        id: profile?.id || "google_user_demo_108293810293",
        email: profile?.email || "community.tester@example.com",
        name: profile?.name || "Verified Community Member",
        picture: profile?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      };
    }

    if (!googleProfile) {
      return NextResponse.json(
        { error: "Missing valid Google authentication token" },
        { status: 400 }
      );
    }

    // 1. Identify or register FoodDecode user (Always USER role)
    const user = await upsertGoogleUser(googleProfile);

    // 2. Create persistent server session (30-day duration)
    const { session, cookieHeader } = await createSession(user, request);

    // 3. Return authenticated user and set persistent HTTP-only cookie
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
