import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { GET as getCategoryCache } from "../src/app/api/products/category-cache/route";
import { GET as getAdminCache, POST as postAdminCache } from "../src/app/api/admin/cache/route";
import { NextRequest } from "next/server";

test("PWA Intelligent Cache: Category cache returns top 25 products for all active categories", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await getCategoryCache(req);

  assert.equal(res.status, 200, "Should return HTTP 200");
  const data = await res.json();

  assert.equal(data.version, "1.0");
  assert.equal(data.limitPerCategory, 25);
  assert.equal(data.totalCategories, 19, "Must cover all 19 active categories");
  assert.ok(data.totalCachedProducts >= 400, "Should cache >= 400 products across 19 categories");
  assert.ok(Array.isArray(data.categories), "Categories list must be an array");
  assert.equal(data.categories.length, 19);

  // Check each category
  for (const cat of data.categories) {
    assert.ok(cat.name, "Category must have a name");
    assert.ok(cat.slug, "Category must have a slug");
    assert.ok(cat.cachedCount > 0, `Category ${cat.name} must have cached products`);

    const products = data.productsByCategory[cat.name];
    assert.ok(Array.isArray(products), `productsByCategory must contain list for ${cat.name}`);
    assert.ok(products.length <= 25, `Should not exceed limit of 25 for ${cat.name}`);
    assert.ok(products.length > 0, `Should have at least 1 product for ${cat.name}`);

    // Verify product fields
    for (const p of products) {
      assert.ok(p.id || p._id || p.barcode, "Product must have an identifier");
      assert.ok(p.name, "Product must have a name");
      assert.ok(p.category, "Product must have a category");
      assert.ok(typeof p.overallScore === "number", "Product must have an overallScore");
      assert.ok(p.nutriScore, "Product must have a nutriScore");
      assert.ok(p.novaGroup, "Product must have a novaGroup");
      assert.ok(p.imageUrl, "Product must have an imageUrl");
    }
  }
});

test("PWA Intelligent Cache: ETag validation returns 304 Not Modified when unchanged", async () => {
  const req1 = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res1 = await getCategoryCache(req1);
  const etag = res1.headers.get("ETag");
  assert.ok(etag, "Response must include an ETag header");

  const req2 = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25", {
    headers: { "if-none-match": etag },
  });
  const res2 = await getCategoryCache(req2);
  assert.equal(res2.status, 304, "Should return HTTP 304 Not Modified when ETag matches");
});

test("PWA Intelligent Cache: Payload size verification (remains lightweight under 1.5MB uncompressed)", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await getCategoryCache(req);
  const text = await res.text();
  const sizeBytes = Buffer.byteLength(text, "utf8");
  const sizeKB = sizeBytes / 1024;
  const sizeMB = sizeKB / 1024;

  console.log(`[Cache Size Report] Uncompressed JSON size: ${sizeKB.toFixed(2)} KB (${sizeMB.toFixed(3)} MB)`);
  assert.ok(sizeMB < 1.5, `Payload (${sizeMB.toFixed(2)} MB) must be strictly less than 1.5 MB for instant background loading`);
});

test("PWA Intelligent Cache: Sorting integrity (products are ranked by score descending)", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await getCategoryCache(req);
  const data = await res.json();

  for (const [catName, products] of Object.entries<any[]>(data.productsByCategory)) {
    for (let i = 0; i < products.length - 1; i++) {
      const currentScore = products[i].overallScore ?? 0;
      const nextScore = products[i + 1].overallScore ?? 0;
      assert.ok(
        currentScore >= nextScore,
        `Products in ${catName} must be ordered highest score first: ${currentScore} vs ${nextScore}`
      );
    }
  }
});

test("Offline Cache Engine: Public UI Separation & Admin Access Control Verification", async (t) => {
  const navbarContent = fs.readFileSync(path.join(process.cwd(), "src/components/Navbar.tsx"), "utf-8");
  const providerContent = fs.readFileSync(path.join(process.cwd(), "src/components/PwaCacheProvider.tsx"), "utf-8");
  const adminPageContent = fs.readFileSync(path.join(process.cwd(), "src/app/admin/page.tsx"), "utf-8");
  const adminClientContent = fs.readFileSync(
    path.join(process.cwd(), "src/components/admin/AdminDashboardClient.tsx"),
    "utf-8"
  );
  const adminPanelContent = fs.readFileSync(
    path.join(process.cwd(), "src/components/admin/OfflineCacheAdminPanel.tsx"),
    "utf-8"
  );

  await t.test("1. Public UI removes database diagnostics trigger, modal, and storage numbers", () => {
    assert.ok(!navbarContent.includes("openDiagnosticsModal"), "Navbar must not trigger cache diagnostics modal");
    assert.ok(!navbarContent.includes("Offline Cache & Storage Status"), "Navbar must not expose cache status button");
    assert.ok(!navbarContent.includes("<Database"), "Navbar must not render Database diagnostics icon");

    assert.ok(!providerContent.includes("CacheDiagnosticsModal"), "PwaCacheProvider must not render CacheDiagnosticsModal");
    assert.ok(!providerContent.includes("Storage Status"), "Public offline bar must not link to Storage Status");
    assert.ok(!providerContent.includes("productCount} cached"), "Public offline bar must not expose cached product counts");
    assert.ok(
      providerContent.includes("Offline Mode:") && providerContent.includes("Browsing cached content"),
      "Public offline bar must show discreet non-technical offline message"
    );
  });

  await t.test("2. Automatic background caching, offline sync, and image caching remain intact", () => {
    assert.ok(providerContent.includes("initializePwaCache"), "Automatic initializePwaCache must remain intact");
    assert.ok(providerContent.includes("setupBackgroundSyncListeners"), "Background sync listeners must remain intact");
    assert.ok(providerContent.includes("connectionStatus"), "Discreet connection status state should be exposed");
  });

  await t.test("3. Unauthorized visitors are rejected by /api/admin/cache server authorization", async () => {
    const reqGetUnauth = new NextRequest("http://localhost:3000/api/admin/cache");
    const resGetUnauth = await getAdminCache(reqGetUnauth);
    assert.equal(resGetUnauth.status, 401, "Unauthenticated GET /api/admin/cache must return 401");

    const reqPostUnauth = new NextRequest("http://localhost:3000/api/admin/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
    const resPostUnauth = await postAdminCache(reqPostUnauth);
    assert.equal(resPostUnauth.status, 401, "Unauthenticated POST /api/admin/cache must return 401");

    const reqInvalidKey = new NextRequest("http://localhost:3000/api/admin/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": "invalid-visitor-key" },
      body: JSON.stringify({ action: "resync" }),
    });
    const resInvalidKey = await postAdminCache(reqInvalidKey);
    assert.equal(resInvalidKey.status, 401, "Invalid key POST /api/admin/cache must return 401");
  });

  await t.test("4. Authorized administrators can access /api/admin/cache diagnostics & controls", async () => {
    const validKey = process.env.ADMIN_SECRET_KEY || "fooddecode_admin_secret_key_change_in_production";

    const reqGetAuth = new NextRequest("http://localhost:3000/api/admin/cache", {
      headers: { "x-admin-key": validKey },
    });
    const resGetAuth = await getAdminCache(reqGetAuth);
    assert.equal(resGetAuth.status, 200, "Authorized GET /api/admin/cache must return 200");
    const getBody = await resGetAuth.json();
    assert.equal(getBody.authorized, true);
    assert.equal(getBody.configuration.topProductsPerCategory, 25);
    assert.equal(getBody.configuration.lruProductLimit, 1000);
    assert.equal(getBody.configuration.thumbnailCacheLimit, 250);

    const reqResync = new NextRequest("http://localhost:3000/api/admin/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": validKey },
      body: JSON.stringify({ action: "resync" }),
    });
    const resResync = await postAdminCache(reqResync);
    assert.equal(resResync.status, 200, "Authorized resync must succeed");
    const resyncBody = await resResync.json();
    assert.equal(resyncBody.action, "resync");

    assert.ok(adminPageContent.includes("AdminDashboardClient"), "Admin page must render AdminDashboardClient only after server auth");
    assert.ok(adminPageContent.includes("isAdminRole"), "Admin page must enforce server-side admin role verification");
    assert.ok(adminClientContent.includes("OfflineCacheAdminPanel"), "Admin dashboard must host OfflineCacheAdminPanel");
    assert.ok(
      adminPanelContent.includes("Clear Offline Data") && adminPanelContent.includes("Re-sync Now"),
      "Admin Offline Cache Engine must retain Clear Offline Data & Re-sync Now controls"
    );
  });
});
