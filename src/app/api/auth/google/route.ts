import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function sanitizeReturnUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/";
  }
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.redirect(
      new URL(`${returnUrl}?auth_error=google_client_id_not_configured`, request.url)
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
