import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");

  let returnUrl = "/";
  if (stateRaw) {
    try {
      const parsed = JSON.parse(Buffer.from(stateRaw, "base64").toString("utf8"));
      if (
        typeof parsed.returnUrl === "string" &&
        parsed.returnUrl.startsWith("/") &&
        !parsed.returnUrl.startsWith("//") &&
        !parsed.returnUrl.includes("://")
      ) {
        returnUrl = parsed.returnUrl;
      }
    } catch {}
  }

  if (!code) {
    return NextResponse.redirect(new URL(`${returnUrl}?auth_error=missing_code`, request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`${returnUrl}?auth_error=missing_credentials`, request.url)
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokens = await tokenRes.json();

    // 2. Retrieve user profile using access token
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userinfoRes.ok) {
      throw new Error("Failed to fetch user profile from Google");
    }

    const profile = await userinfoRes.json();

    if (!profile.sub || !profile.email || profile.email_verified === false) {
      throw new Error("Google account email could not be verified");
    }

    // 3. Upsert user in database (only server-side allowlist grants admin role)
    const user = await upsertGoogleUser({
      id: profile.sub,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture,
    });

    // 4. Create persistent session (30 days)
    const { cookieHeader } = await createSession(user, request);

    // 5. Redirect back to original product page
    const redirectUrl = new URL(returnUrl, request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.append("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    console.error("[Google OAuth Callback] Error:", error);
    return NextResponse.redirect(
      new URL(`${returnUrl}?auth_error=oauth_exchange_failed`, request.url)
    );
  }
}
