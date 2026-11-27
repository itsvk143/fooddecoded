import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeReturnUrl,
  getOAuthOrigin,
  getGoogleRedirectUri,
  buildAuthErrorRedirectUrl,
} from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const origin = getOAuthOrigin(request);
  const redirectUri = getGoogleRedirectUri(request);

  if (!clientId) {
    return NextResponse.redirect(
      buildAuthErrorRedirectUrl(origin, returnUrl, "google_client_id_not_configured")
    );
  }

  const state = Buffer.from(JSON.stringify({ returnUrl })).toString("base64");
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl);
}
