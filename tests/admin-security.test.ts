import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

import { proxy } from "../src/proxy";
import { verifyAdminAccessAsync } from "../src/lib/auth";
import {
  upsertGoogleUser,
  createSession,
  revokeSession,
  validateSession,
  SESSION_COOKIE_NAME,
} from "../src/lib/session";
import { getAuditLogs } from "../src/lib/audit";

// Admin & Product Mutation API Handlers
import { POST as createProductPost } from "../src/app/api/products/route";
import { PUT as updateProductPut, DELETE as deleteProductById } from "../src/app/api/products/[id]/route";
import { GET as getAdminStats } from "../src/app/api/admin/stats/route";
import { GET as getAdminAuditLogs } from "../src/app/api/admin/audit-logs/route";
import { GET as getAdminProducts, POST as postAdminProducts, DELETE as deleteAdminProducts } from "../src/app/api/admin/products/route";
import { PATCH as patchAdminProductById, DELETE as deleteAdminProductById } from "../src/app/api/admin/products/[id]/route";
import { GET as exportAdminProducts } from "../src/app/api/admin/products/export/route";
import { POST as importAdminProducts } from "../src/app/api/admin/products/import/route";
import { POST as bulkAdminProducts } from "../src/app/api/admin/products/bulk/route";
import { GET as getAdminDuplicates, POST as postAdminDuplicates } from "../src/app/api/admin/products/duplicates/route";
import { POST as postAdminMapping } from "../src/app/api/admin/products/mapping/route";
import { POST as uploadAdminImage } from "../src/app/api/admin/products/upload-image/route";
import { PATCH as patchReviewStatus } from "../src/app/api/admin/products/[id]/review-status/route";
import { DELETE as deleteProductFeedback } from "../src/app/api/admin/products/[id]/feedback/route";
import { GET as getAdminCategories, POST as postAdminCategories } from "../src/app/api/admin/categories/route";
import { GET as getAdminBrands } from "../src/app/api/admin/brands/route";
import { GET as getAdminBrandProducts } from "../src/app/api/admin/brands/products/route";
import { GET as exportAdminBrands } from "../src/app/api/admin/brands/export/route";
import { GET as getAdminIngredients, POST as postAdminIngredients } from "../src/app/api/admin/ingredients/route";
import { GET as getAdminRules, PUT as putAdminRules } from "../src/app/api/admin/rules/route";
import { GET as getAdminSubmissions, PUT as putAdminSubmissions } from "../src/app/api/admin/submissions/route";
import { GET as getAdminCache, POST as postAdminCache } from "../src/app/api/admin/cache/route";
import { GET as getAdminFeedback } from "../src/app/api/admin/feedback/route";
import { DELETE as deleteFeedbackById } from "../src/app/api/admin/feedback/[id]/route";
import { POST as bulkDeleteFeedback } from "../src/app/api/admin/feedback/bulk-delete/route";
import { GET as getAdminComments } from "../src/app/api/admin/comments/route";
import { PATCH as patchCommentById } from "../src/app/api/admin/comments/[id]/route";
import { POST as bulkComments } from "../src/app/api/admin/comments/bulk/route";
import { POST as postAdminSeed } from "../src/app/api/admin/seed/route";
import { POST as postAdminRecalculate } from "../src/app/api/admin/recalculate/route";
import { POST as postAdminImport } from "../src/app/api/admin/import/route";
import { GET as getAdminImportJobs } from "../src/app/api/admin/import-jobs/route";
import { GET as startGoogleOAuth } from "../src/app/api/auth/google/route";
import { POST as verifyGoogleOAuth } from "../src/app/api/auth/google/verify/route";
import { POST as logoutAuth } from "../src/app/api/auth/logout/route";
import { getGoogleRedirectUri } from "../src/lib/oauth";

test("Admin Security & Authorization Comprehensive Verification", async (t) => {
  // Create test users and sessions
  const regularUser = await upsertGoogleUser({
    id: "google-sec-user-001",
    email: "security.regular.user@example.com",
    name: "Regular Test User",
  });
  assert.equal(regularUser.role, "USER", "Public OAuth signup must receive USER role");

  const regularSession = await createSession(regularUser);

  const adminUser1 = await upsertGoogleUser({
    id: "google-sec-admin-001",
    email: "fooddecoded01@gmail.com",
    name: "FoodDecode Admin",
  });
  assert.equal(adminUser1.role, "ADMIN", "Allowlisted admin fooddecoded01@gmail.com must receive ADMIN role");

  const adminUser2 = await upsertGoogleUser({
    id: "google-sec-admin-002",
    email: "itsvikash143@gmail.com",
    name: "Vikash Admin",
  });
  assert.equal(adminUser2.role, "ADMIN", "Allowlisted admin itsvikash143@gmail.com must receive ADMIN role");

  const adminSession = await createSession(adminUser1);

  const withCookie = (
    url: string,
    opts: { method?: string; headers?: Record<string, string>; body?: string } = {},
    token?: string
  ) => {
    const headers = new Headers(opts.headers);
    if (token) {
      headers.set("Cookie", `${SESSION_COOKIE_NAME}=${token}`);
    }
    return new NextRequest(url, {
      method: opts.method,
      body: opts.body,
      headers,
    });
  };

  await t.test("Scenario 1 & 2: Unauthenticated /admin page requests redirect to /login and API requests return 401", async () => {
    const pageReq = new NextRequest("https://fooddecoded.vercel.app/admin");
    const proxyRes = await proxy(pageReq);
    assert.ok(proxyRes.status === 307 || proxyRes.status === 302, "Unauthenticated /admin must redirect");
    const location = proxyRes.headers.get("location") || "";
    assert.ok(location.includes("/login"), `Redirect location must target /login, got: ${location}`);
    assert.ok(location.includes("redirect=%2Fadmin"), "Redirect must preserve return destination");

    const apiReq = new NextRequest("https://fooddecoded.vercel.app/api/admin/stats");
    const apiProxyRes = await proxy(apiReq);
    assert.equal(apiProxyRes.status, 401, "Proxy must reject unauthenticated /api/admin/* with 401");
  });

  await t.test("Scenario 3: Authenticated non-admin (USER) is rejected with 403 on /admin and all /api/admin/*", async () => {
    const pageReq = withCookie("https://fooddecoded.vercel.app/admin", {}, regularSession.token);
    const proxyRes = await proxy(pageReq);
    assert.equal(proxyRes.status, 403, "Non-admin user accessing /admin must receive HTTP 403");

    const statsRes = await getAdminStats(
      withCookie("https://fooddecoded.vercel.app/api/admin/stats", {}, regularSession.token)
    );
    assert.equal(statsRes.status, 403, "GET /api/admin/stats must return 403 for USER");

    const exportRes = await exportAdminProducts(
      withCookie("https://fooddecoded.vercel.app/api/admin/products/export", {}, regularSession.token)
    );
    assert.equal(exportRes.status, 403, "GET /api/admin/products/export must return 403 for USER");

    const createProdRes = await createProductPost(
      withCookie(
        "https://fooddecoded.vercel.app/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Hack", brand: "Fake", barcode: "000" }),
        },
        regularSession.token
      )
    );
    assert.equal(createProdRes.status, 403, "POST /api/products must return 403 for USER");

    // Verify a non-allowlisted email cannot retain a poisoned/legacy ADMIN role in session or DB
    const legacyPoisonedSession = await createSession({
      id: "legacy-non-admin",
      googleId: "legacy-non-admin-google-id",
      email: "lvtaxconsultant@gmail.com",
      name: "LV TAX",
      authProvider: "GOOGLE",
      role: "ADMIN",
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });
    assert.equal(
      legacyPoisonedSession.session.role,
      "USER",
      "Non-allowlisted email must be downgraded from ADMIN to USER"
    );
    const poisonedProxyRes = await proxy(
      withCookie("https://fooddecoded.vercel.app/admin", {}, legacyPoisonedSession.token)
    );
    assert.equal(poisonedProxyRes.status, 403, "Non-allowlisted email must receive 403 on /admin");
    await revokeSession(legacyPoisonedSession.token);
  });

  await t.test("Scenario 4: Every admin & product mutation route independently rejects unauthenticated callers with 401", async () => {
    const idCtx = { params: Promise.resolve({ id: "test-id" }) };
    const checks: Array<{ name: string; run: () => Promise<Response> }> = [
      { name: "GET /api/admin/stats", run: () => getAdminStats(new NextRequest("http://localhost/api/admin/stats")) },
      { name: "GET /api/admin/audit-logs", run: () => getAdminAuditLogs(new NextRequest("http://localhost/api/admin/audit-logs")) },
      { name: "GET /api/admin/products", run: () => getAdminProducts(new NextRequest("http://localhost/api/admin/products")) },
      { name: "POST /api/admin/products", run: () => postAdminProducts(new NextRequest("http://localhost/api/admin/products", { method: "POST", body: "{}" })) },
      { name: "DELETE /api/admin/products", run: () => deleteAdminProducts(new NextRequest("http://localhost/api/admin/products?id=1", { method: "DELETE" })) },
      { name: "PATCH /api/admin/products/[id]", run: () => patchAdminProductById(new NextRequest("http://localhost/api/admin/products/1", { method: "PATCH", body: "{}" }), idCtx) },
      { name: "DELETE /api/admin/products/[id]", run: () => deleteAdminProductById(new NextRequest("http://localhost/api/admin/products/1", { method: "DELETE" }), idCtx) },
      { name: "GET /api/admin/products/export", run: () => exportAdminProducts(new NextRequest("http://localhost/api/admin/products/export")) },
      { name: "POST /api/admin/products/import", run: () => importAdminProducts(new NextRequest("http://localhost/api/admin/products/import", { method: "POST", body: "{}" })) },
      { name: "POST /api/admin/products/bulk", run: () => bulkAdminProducts(new NextRequest("http://localhost/api/admin/products/bulk", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/products/duplicates", run: () => getAdminDuplicates(new NextRequest("http://localhost/api/admin/products/duplicates")) },
      { name: "POST /api/admin/products/duplicates", run: () => postAdminDuplicates(new NextRequest("http://localhost/api/admin/products/duplicates", { method: "POST", body: "{}" })) },
      { name: "POST /api/admin/products/mapping", run: () => postAdminMapping(new NextRequest("http://localhost/api/admin/products/mapping", { method: "POST", body: "{}" })) },
      { name: "POST /api/admin/products/upload-image", run: () => uploadAdminImage(new NextRequest("http://localhost/api/admin/products/upload-image", { method: "POST", body: "{}" })) },
      { name: "PATCH /api/admin/products/[id]/review-status", run: () => patchReviewStatus(new NextRequest("http://localhost/api/admin/products/1/review-status", { method: "PATCH", body: "{}" }), idCtx) },
      { name: "DELETE /api/admin/products/[id]/feedback", run: () => deleteProductFeedback(new NextRequest("http://localhost/api/admin/products/1/feedback", { method: "DELETE" }), idCtx) },
      { name: "GET /api/admin/categories", run: () => getAdminCategories(new NextRequest("http://localhost/api/admin/categories")) },
      { name: "POST /api/admin/categories", run: () => postAdminCategories(new NextRequest("http://localhost/api/admin/categories", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/brands", run: () => getAdminBrands(new NextRequest("http://localhost/api/admin/brands")) },
      { name: "GET /api/admin/brands/products", run: () => getAdminBrandProducts(new NextRequest("http://localhost/api/admin/brands/products?brand=amul")) },
      { name: "GET /api/admin/brands/export", run: () => exportAdminBrands(new NextRequest("http://localhost/api/admin/brands/export?type=brands")) },
      { name: "GET /api/admin/ingredients", run: () => getAdminIngredients(new NextRequest("http://localhost/api/admin/ingredients")) },
      { name: "POST /api/admin/ingredients", run: () => postAdminIngredients(new NextRequest("http://localhost/api/admin/ingredients", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/rules", run: () => getAdminRules(new NextRequest("http://localhost/api/admin/rules")) },
      { name: "PUT /api/admin/rules", run: () => putAdminRules(new NextRequest("http://localhost/api/admin/rules", { method: "PUT", body: "{}" })) },
      { name: "GET /api/admin/submissions", run: () => getAdminSubmissions(new NextRequest("http://localhost/api/admin/submissions")) },
      { name: "PUT /api/admin/submissions", run: () => putAdminSubmissions(new NextRequest("http://localhost/api/admin/submissions", { method: "PUT", body: "{}" })) },
      { name: "GET /api/admin/cache", run: () => getAdminCache(new NextRequest("http://localhost/api/admin/cache")) },
      { name: "POST /api/admin/cache", run: () => postAdminCache(new NextRequest("http://localhost/api/admin/cache", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/feedback", run: () => getAdminFeedback(new NextRequest("http://localhost/api/admin/feedback")) },
      { name: "DELETE /api/admin/feedback/[id]", run: () => deleteFeedbackById(new NextRequest("http://localhost/api/admin/feedback/1", { method: "DELETE" }), idCtx) },
      { name: "POST /api/admin/feedback/bulk-delete", run: () => bulkDeleteFeedback(new NextRequest("http://localhost/api/admin/feedback/bulk-delete", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/comments", run: () => getAdminComments(new NextRequest("http://localhost/api/admin/comments")) },
      { name: "PATCH /api/admin/comments/[id]", run: () => patchCommentById(new NextRequest("http://localhost/api/admin/comments/1", { method: "PATCH", body: "{}" }), idCtx) },
      { name: "POST /api/admin/comments/bulk", run: () => bulkComments(new NextRequest("http://localhost/api/admin/comments/bulk", { method: "POST", body: "{}" })) },
      { name: "POST /api/admin/seed", run: () => postAdminSeed(new NextRequest("http://localhost/api/admin/seed", { method: "POST" })) },
      { name: "POST /api/admin/recalculate", run: () => postAdminRecalculate(new NextRequest("http://localhost/api/admin/recalculate", { method: "POST" })) },
      { name: "POST /api/admin/import", run: () => postAdminImport(new NextRequest("http://localhost/api/admin/import", { method: "POST", body: "{}" })) },
      { name: "GET /api/admin/import-jobs", run: () => getAdminImportJobs(new NextRequest("http://localhost/api/admin/import-jobs")) },
      { name: "POST /api/products", run: () => createProductPost(new NextRequest("http://localhost/api/products", { method: "POST", body: "{}" })) },
      { name: "PUT /api/products/[id]", run: () => updateProductPut(new NextRequest("http://localhost/api/products/1", { method: "PUT", body: "{}" }), idCtx) },
      { name: "DELETE /api/products/[id]", run: () => deleteProductById(new NextRequest("http://localhost/api/products/1", { method: "DELETE" }), idCtx) },
    ];

    for (const check of checks) {
      const res = await check.run();
      assert.equal(res.status, 401, `${check.name} must return HTTP 401 without valid credentials`);
    }
  });

  await t.test("Scenario 5: Authenticated ADMIN session grants full access to /admin and /api/admin/*", async () => {
    const proxyRes = await proxy(withCookie("https://fooddecoded.vercel.app/admin", {}, adminSession.token));
    assert.equal(proxyRes.status, 200, "Admin session on /admin passes proxy without redirect or 403");

    const statsRes = await getAdminStats(
      withCookie("https://fooddecoded.vercel.app/api/admin/stats", {}, adminSession.token)
    );
    assert.equal(statsRes.status, 200, "GET /api/admin/stats returns 200 for authenticated ADMIN");

    const logsRes = await getAdminAuditLogs(
      withCookie("https://fooddecoded.vercel.app/api/admin/audit-logs", {}, adminSession.token)
    );
    assert.equal(logsRes.status, 200, "GET /api/admin/audit-logs returns 200 for authenticated ADMIN");

    const catRes = await getAdminCategories(
      withCookie("https://fooddecoded.vercel.app/api/admin/categories", {}, adminSession.token)
    );
    assert.equal(catRes.status, 200, "GET /api/admin/categories returns 200 for authenticated ADMIN");
  });

  await t.test("Scenario 6, 7 & 8: Tampered tokens, expired tokens, and logged-out sessions are rejected", async () => {
    // Tampered / malformed tokens
    const invalidTokens = [
      "not-a-valid-hex-token",
      "a".repeat(63),
      "a".repeat(65),
      "z".repeat(64),
      "0".repeat(64),
      `${adminSession.token.slice(0, -1)}${adminSession.token.endsWith("0") ? "1" : "0"}`,
    ];

    for (const badToken of invalidTokens) {
      const badReq = withCookie("https://fooddecoded.vercel.app/admin", {}, badToken);
      const validation = await validateSession(badReq);
      assert.equal(validation.authenticated, false, `Tampered token '${badToken.slice(0, 12)}...' must fail`);
      const res = await getAdminStats(badReq);
      assert.equal(res.status, 401, "Tampered cookie must return 401");
    }

    // Expired session simulation (expire in-memory session record)
    const expiredSession = await createSession(adminUser1);
    expiredSession.session.expiresAt = new Date(Date.now() - 60_000);
    const expiredReq = withCookie("https://fooddecoded.vercel.app/api/admin/stats", {}, expiredSession.token);
    const expiredValidation = await validateSession(expiredReq);
    assert.equal(expiredValidation.authenticated, false, "Expired session token must fail validation");
    const expiredApiRes = await getAdminStats(expiredReq);
    assert.equal(expiredApiRes.status, 401, "Expired session token must return 401");

    // Logout revokes token server-side and clears cookie
    const tempAdminSession = await createSession(adminUser2);
    const validTempReq = withCookie("https://fooddecoded.vercel.app/admin", {}, tempAdminSession.token);
    assert.equal((await validateSession(validTempReq)).authenticated, true, "Temp session should initially be valid");

    const logoutRes = await logoutAuth(
      withCookie("https://fooddecoded.vercel.app/api/auth/logout", { method: "POST" }, tempAdminSession.token)
    );
    assert.equal(logoutRes.status, 200);
    const setCookieHeader = logoutRes.headers.get("set-cookie") || "";
    assert.ok(setCookieHeader.includes("Max-Age=0"), "Logout must clear session cookie");
    assert.equal((await validateSession(validTempReq)).authenticated, false, "Session must be revoked after logout");

    const afterLogoutApi = await getAdminStats(
      withCookie("https://fooddecoded.vercel.app/api/admin/stats", {}, tempAdminSession.token)
    );
    assert.equal(afterLogoutApi.status, 401, "Revoked session token after logout must return 401");
  });

  await t.test("Scenario 9: Google OAuth /verify rejects spoofed demo admin impersonation & unverified JWTs", async () => {
    const spoofReq = new NextRequest("https://fooddecoded.vercel.app/api/auth/google/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demoUser: true,
        profile: { email: "fooddecoded01@gmail.com", name: "Fake Admin", id: "spoof" },
      }),
    });
    const spoofRes = await verifyGoogleOAuth(spoofReq);
    assert.equal(spoofRes.status, 403, "Demo admin email impersonation must be rejected with 403");

    // Forged unsigned JWT payload without Google verification
    const fakeHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const fakePayload = Buffer.from(
      JSON.stringify({ sub: "999", email: "fooddecoded01@gmail.com", email_verified: true })
    ).toString("base64url");
    const forgedTokenReq = new NextRequest("https://fooddecoded.vercel.app/api/auth/google/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: `${fakeHeader}.${fakePayload}.forgedsig` }),
    });
    const origFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({ error: "invalid_token" }), { status: 400 });
    try {
      const forgedRes = await verifyGoogleOAuth(forgedTokenReq);
      assert.equal(forgedRes.status, 401, "Forged Google JWT must be rejected with 401");
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  await t.test("Scenario 10: Query parameter admin_key and production weak/default admin key are rejected", async () => {
    const queryKeyReq = new NextRequest(
      "https://fooddecoded.vercel.app/api/admin/stats?admin_key=fooddecode_admin_secret_key_change_in_production"
    );
    const queryAuth = await verifyAdminAccessAsync(queryKeyReq);
    assert.equal(queryAuth.authorized, false);
    assert.equal(queryAuth.status, 401, "admin_key URL query parameter must never authorize requests");

    const prevEnv = process.env.NODE_ENV;
    const prevKey = process.env.ADMIN_SECRET_KEY;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      process.env.ADMIN_SECRET_KEY = "fooddecode_admin_secret_key_change_in_production";

      const prodWeakReq = new NextRequest("https://fooddecoded.vercel.app/api/admin/stats", {
        headers: { "x-admin-key": "fooddecode_admin_secret_key_change_in_production" },
      });
      const weakAuth = await verifyAdminAccessAsync(prodWeakReq);
      assert.equal(weakAuth.authorized, false);
      assert.equal(weakAuth.status, 401, "Weak default admin key must be rejected in production");

      const prodValidSecret = "prod_super_strong_random_key_9a8b7c6d5e4f";
      process.env.ADMIN_SECRET_KEY = prodValidSecret;
      const prodStrongReq = new NextRequest("https://fooddecoded.vercel.app/api/admin/stats", {
        headers: { "x-admin-key": prodValidSecret },
      });
      const strongAuth = await verifyAdminAccessAsync(prodStrongReq);
      assert.equal(strongAuth.authorized, true, "Strong configured ADMIN_SECRET_KEY works in production");

      const prodMissingKeyReq = new NextRequest("https://fooddecoded.vercel.app/api/admin/stats", {
        headers: { "x-admin-key": "wrong-key" },
      });
      const wrongAuth = await verifyAdminAccessAsync(prodMissingKeyReq);
      assert.equal(wrongAuth.authorized, false);
      assert.equal(wrongAuth.status, 401);
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
      if (prevKey === undefined) delete process.env.ADMIN_SECRET_KEY;
      else process.env.ADMIN_SECRET_KEY = prevKey;
    }
  });

  await t.test("Scenario 11: Client bundle, public nav & .env.example contain zero hardcoded keys, DB secrets, or unauthenticated admin links", () => {
    const adminPageSrc = fs.readFileSync(path.join(process.cwd(), "src/app/admin/page.tsx"), "utf-8");
    const adminClientSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/admin/AdminDashboardClient.tsx"),
      "utf-8"
    );
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), "src/components/Navbar.tsx"), "utf-8");
    const footerSrc = fs.readFileSync(path.join(process.cwd(), "src/components/Footer.tsx"), "utf-8");
    const drawerSrc = fs.readFileSync(path.join(process.cwd(), "src/components/LeftDrawer.tsx"), "utf-8");
    const envExampleSrc = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf-8");

    assert.ok(!adminPageSrc.includes('"use client"'), "src/app/admin/page.tsx must be a Server Component");
    assert.ok(!adminPageSrc.includes("fooddecode_admin_secret_key"), "src/app/admin/page.tsx must not contain secret keys");
    assert.ok(
      !adminClientSrc.includes("fooddecode_admin_secret_key"),
      "AdminDashboardClient must never ship hardcoded admin secret key"
    );
    assert.ok(!adminClientSrc.includes("admin_key="), "AdminDashboardClient must not place admin keys in query URLs");
    assert.ok(
      navbarSrc.includes('user?.role === "ADMIN"') && navbarSrc.includes('user?.role === "SUPER_ADMIN"'),
      "Navbar must gate Admin link by authenticated ADMIN/SUPER_ADMIN role"
    );
    assert.ok(!footerSrc.includes('href="/admin"'), "Public Footer must not expose /admin route link");
    assert.ok(
      drawerSrc.includes('user?.role === "ADMIN"') && drawerSrc.includes('user?.role === "SUPER_ADMIN"'),
      "LeftDrawer must gate Admin link by authenticated ADMIN/SUPER_ADMIN role"
    );
    assert.ok(
      !envExampleSrc.includes("vikash81680") && !envExampleSrc.includes("fooddecode_admin_secret_key"),
      ".env.example must never contain live DB credentials or real secret keys"
    );
  });

  await t.test("Scenario 12: Audit logs record unauthorized access, forbidden attempts, login, and logout", async () => {
    const forbiddenRes = await getAdminStats(
      withCookie("https://fooddecoded.vercel.app/api/admin/stats", {}, regularSession.token)
    );
    assert.equal(forbiddenRes.status, 403);
    // Allow fire-and-forget audit promise microtasks to flush
    await new Promise((r) => setTimeout(r, 20));
    const logs = await getAuditLogs(100);
    const actions = new Set(logs.map((l) => l.action));
    assert.ok(actions.has("ADMIN_UNAUTHORIZED_ATTEMPT"), "Audit log must capture ADMIN_UNAUTHORIZED_ATTEMPT");
    assert.ok(actions.has("ADMIN_FORBIDDEN_ATTEMPT"), "Audit log must capture ADMIN_FORBIDDEN_ATTEMPT");
    assert.ok(actions.has("ADMIN_LOGIN"), "Audit log must capture ADMIN_LOGIN");
    assert.ok(actions.has("ADMIN_LOGOUT"), "Audit log must capture ADMIN_LOGOUT");
  });

  await t.test("Scenario 13: Google OAuth redirect_uri matches canonical production & local origins without double slashes", async () => {
    const prevAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const prevClientId = process.env.GOOGLE_CLIENT_ID;
    try {
      process.env.GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com";

      // Trailing slash in NEXT_PUBLIC_APP_URL must be stripped
      process.env.NEXT_PUBLIC_APP_URL = "https://fooddecoded.vercel.app/";
      const prodReq = new NextRequest("https://fooddecoded.vercel.app/api/auth/google?returnUrl=%2Fadmin", {
        headers: {
          "x-forwarded-host": "fooddecoded.vercel.app",
          "x-forwarded-proto": "https",
        },
      });
      assert.equal(
        getGoogleRedirectUri(prodReq),
        "https://fooddecoded.vercel.app/api/auth/google/callback"
      );
      const oauthRes = await startGoogleOAuth(prodReq);
      const location = new URL(oauthRes.headers.get("location") || "");
      assert.equal(
        location.searchParams.get("redirect_uri"),
        "https://fooddecoded.vercel.app/api/auth/google/callback"
      );

      // Accidental localhost NEXT_PUBLIC_APP_URL in Vercel must NOT override production proxy host
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
      assert.equal(
        getGoogleRedirectUri(prodReq),
        "https://fooddecoded.vercel.app/api/auth/google/callback"
      );

      // Local dev localhost request must stay on localhost even if production NEXT_PUBLIC_APP_URL is set
      process.env.NEXT_PUBLIC_APP_URL = "https://fooddecoded.vercel.app";
      const localReq = new NextRequest("http://localhost:3000/api/auth/google", {
        headers: { host: "localhost:3000" },
      });
      assert.equal(
        getGoogleRedirectUri(localReq),
        "http://localhost:3000/api/auth/google/callback"
      );
    } finally {
      if (prevAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
      else process.env.NEXT_PUBLIC_APP_URL = prevAppUrl;
      if (prevClientId === undefined) delete process.env.GOOGLE_CLIENT_ID;
      else process.env.GOOGLE_CLIENT_ID = prevClientId;
    }
  });

  // Cleanup temp admin session
  await revokeSession(adminSession.token);
  await revokeSession(regularSession.token);
});
