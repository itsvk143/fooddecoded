import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSession } from "@/lib/session";
import {
  sanitizeReturnUrl,
  getOAuthOrigin,
  getGoogleRedirectUri,
  buildAuthErrorRedirectUrl,
} from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const stateRaw = searchParams.get("state");

  let returnUrl = "/";
  if (stateRaw) {
    try {
      const parsed = JSON.parse(Buffer.from(stateRaw, "base64").toString("utf8"));
      returnUrl = sanitizeReturnUrl(typeof parsed.returnUrl === "string" ? parsed.returnUrl : null);
    } catch {}
  }

  const origin = getOAuthOrigin(request);

  if (oauthError) {
    return NextResponse.redirect(buildAuthErrorRedirectUrl(origin, returnUrl, oauthError));
  }

  if (!code) {
    return NextResponse.redirect(buildAuthErrorRedirectUrl(origin, returnUrl, "missing_code"));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri(request);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      buildAuthErrorRedirectUrl(origin, returnUrl, "missing_credentials")
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

    // 5. Redirect back to original page on the resolved canonical origin
    const redirectUrl = new URL(returnUrl, origin);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.append("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    console.error("[Google OAuth Callback] Error:", error);
    return NextResponse.redirect(
      buildAuthErrorRedirectUrl(origin, returnUrl, "oauth_exchange_failed")
    );
  }
}
