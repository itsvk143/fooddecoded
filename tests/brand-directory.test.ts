import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

import {
  normalizeBrandKey,
  canonicalBrandSpellingKey,
  getCompleteBrandDirectory,
  getProductsByBrand,
  generateBrandCsvExport,
} from "../src/lib/brand-directory-service";
import { getInMemoryProducts } from "../src/lib/product-service";
import {
  upsertGoogleUser,
  createSession,
  revokeSession,
  SESSION_COOKIE_NAME,
} from "../src/lib/session";
import { GET as getAdminBrands } from "../src/app/api/admin/brands/route";
import { GET as getAdminBrandProducts } from "../src/app/api/admin/brands/products/route";
import { GET as exportAdminBrands } from "../src/app/api/admin/brands/export/route";

test("Complete Brand Directory & Product Mapping Suite", async (t) => {
  await t.test("1. Brand normalization & spelling canonicalization handle whitespace, case, apostrophes, and diacritics", () => {
    assert.equal(normalizeBrandKey("  Haldiram’s  "), "haldiram's");
    assert.equal(normalizeBrandKey("HALDIRAM'S"), "haldiram's");
    assert.equal(normalizeBrandKey("Ben   &   Jerry's"), "ben & jerry's");
    assert.equal(normalizeBrandKey(""), "");
    assert.equal(normalizeBrandKey(null), "");
    assert.equal(normalizeBrandKey(undefined), "");

    assert.equal(canonicalBrandSpellingKey("Lay's"), canonicalBrandSpellingKey("Lays"));
    assert.equal(canonicalBrandSpellingKey("Nestlé"), canonicalBrandSpellingKey("Nestle"));
    assert.equal(canonicalBrandSpellingKey("Haldiram's"), canonicalBrandSpellingKey("Haldiram"));
  });

  await t.test("2. Dynamic brand aggregation covers ALL brands (>8) with 100% count parity against product records", async () => {
    const dir = await getCompleteBrandDirectory({ limit: 0, sortBy: "count_desc" });
    const allProducts = getInMemoryProducts();

    assert.ok(dir.analytics.totalUniqueBrands > 8, "Must include ALL brands, not limited to Top 8");
    assert.equal(dir.brands.length, dir.analytics.totalUniqueBrands, "Unpaginated directory must return all unique brands");
    assert.equal(dir.analytics.totalProductsInDatabase, allProducts.length);
    assert.equal(
      dir.analytics.totalProductsMappedToBrands + dir.analytics.unbrandedProductsCount,
      allProducts.length,
      "Mapped + unbranded counts must equal total product records"
    );

    const bucketSum =
      dir.analytics.brandsWith1Product +
      dir.analytics.brandsWith2To5Products +
      dir.analytics.brandsWith6To10Products +
      dir.analytics.brandsWithOver10Products;
    assert.equal(bucketSum, dir.analytics.totalUniqueBrands, "Brand distribution buckets must sum to total unique brands");

    // Verify sorting default: highest product count first
    for (let i = 0; i < dir.brands.length - 1; i++) {
      assert.ok(
        dir.brands[i].totalProducts >= dir.brands[i + 1].totalProducts,
        `Brands must default sort descending: ${dir.brands[i].displayName}(${dir.brands[i].totalProducts}) >= ${dir.brands[i + 1].displayName}(${dir.brands[i + 1].totalProducts})`
      );
    }

    assert.ok(dir.analytics.highestProductBrand, "Highest product brand must be reported");
    assert.ok(dir.analytics.lowestProductBrand, "Lowest product brand must be reported");

    // Verify 100% count parity for EVERY unique brand against actual product records
    const directBrandCounts = new Map<string, number>();
    let directUnbranded = 0;
    for (const p of allProducts) {
      const k = normalizeBrandKey(p.brand);
      if (!k) directUnbranded += 1;
      else directBrandCounts.set(k, (directBrandCounts.get(k) || 0) + 1);
    }
    assert.equal(dir.analytics.unbrandedProductsCount, directUnbranded);
    assert.equal(dir.brands.length, directBrandCounts.size);

    for (const b of dir.brands) {
      assert.equal(
        b.totalProducts,
        directBrandCounts.get(b.normalizedBrand),
        `Brand "${b.displayName}" aggregated count must match exact product count`
      );
      const drill = await getProductsByBrand({ brand: b.normalizedBrand, limit: 0 });
      assert.equal(
        drill.total,
        b.totalProducts,
        `Drill-down getProductsByBrand("${b.normalizedBrand}") must match directory total`
      );
    }

    console.log(
      `[Brand Verification Metrics] uniqueBrands=${dir.analytics.totalUniqueBrands}, totalProducts=${dir.analytics.totalProductsInDatabase}, mapped=${dir.analytics.totalProductsMappedToBrands}, unbranded=${dir.analytics.unbrandedProductsCount}, highest=${dir.analytics.highestProductBrand.name}(${dir.analytics.highestProductBrand.count}), lowest=${dir.analytics.lowestProductBrand.name}(${dir.analytics.lowestProductBrand.count}), singleProductBrands=${dir.analytics.brandsWith1Product}, 2to5=${dir.analytics.brandsWith2To5Products}, 6to10=${dir.analytics.brandsWith6To10Products}, over10=${dir.analytics.brandsWithOver10Products}`
    );
  });

  await t.test("3. Server-side search, filters, sorting, and pagination work across all dimensions", async () => {
    const full = await getCompleteBrandDirectory({ limit: 0 });
    const sampleBrand = full.brands[0];
    assert.ok(sampleBrand);

    // Search by brand name
    const searched = await getCompleteBrandDirectory({ q: sampleBrand.displayName.slice(0, 4) });
    assert.ok(
      searched.brands.some((b) => b.normalizedBrand === sampleBrand.normalizedBrand),
      "Search by brand name must locate matching brand"
    );

    // Product count filter = 1
    if (full.analytics.brandsWith1Product > 0) {
      const oneProd = await getCompleteBrandDirectory({ productCountRange: "1", limit: 0 });
      assert.equal(oneProd.brands.length, full.analytics.brandsWith1Product);
      assert.ok(oneProd.brands.every((b) => b.totalProducts === 1));
    }

    // Category filter
    const targetCat = full.availableCategories[0];
    if (targetCat) {
      const byCat = await getCompleteBrandDirectory({ category: targetCat, limit: 0 });
      assert.ok(byCat.brands.length > 0);
      assert.ok(byCat.brands.every((b) => b.categories.includes(targetCat)));
    }

    // Sort ascending & alphabetical
    const countAsc = await getCompleteBrandDirectory({ sortBy: "count_asc", limit: 0 });
    for (let i = 0; i < countAsc.brands.length - 1; i++) {
      assert.ok(countAsc.brands[i].totalProducts <= countAsc.brands[i + 1].totalProducts);
    }

    const alphaAsc = await getCompleteBrandDirectory({ sortBy: "name_asc", limit: 0 });
    for (let i = 0; i < alphaAsc.brands.length - 1; i++) {
      assert.ok(alphaAsc.brands[i].displayName.localeCompare(alphaAsc.brands[i + 1].displayName) <= 0);
    }

    // Pagination
    const p1 = await getCompleteBrandDirectory({ page: 1, limit: 10 });
    const p2 = await getCompleteBrandDirectory({ page: 2, limit: 10 });
    assert.equal(p1.brands.length, 10);
    assert.ok(p2.brands.length > 0);
    assert.notEqual(p1.brands[0].normalizedBrand, p2.brands[0].normalizedBrand);
  });

  await t.test("4. Expandable brand product view exposes all required status columns & supports pagination + inner search", async () => {
    const dir = await getCompleteBrandDirectory({ productCountRange: "10+", limit: 5 });
    const target = dir.brands[0];
    assert.ok(target && target.totalProducts > 10);

    const page1 = await getProductsByBrand({ brand: target.normalizedBrand, page: 1, limit: 5 });
    const page2 = await getProductsByBrand({ brand: target.normalizedBrand, page: 2, limit: 5 });

    assert.equal(page1.products.length, 5);
    assert.equal(page1.total, target.totalProducts);
    assert.notEqual(page1.products[0].id, page2.products[0].id);

    const row = page1.products[0];
    assert.ok("name" in row && row.name);
    assert.ok("category" in row);
    assert.ok("subCategory" in row);
    assert.ok("brand" in row);
    assert.ok("imageUrl" in row);
    assert.ok("barcode" in row);
    assert.ok(["Complete", "Missing"].includes(row.ingredientsStatus));
    assert.ok(["Complete", "Incomplete", "Missing"].includes(row.nutritionStatus));
    assert.ok(["verified", "incomplete", "under_review"].includes(row.productDataStatus));

    // Inner product search within selected brand
    const term = row.name.split(" ")[0];
    const filtered = await getProductsByBrand({ brand: target.normalizedBrand, q: term, limit: 25 });
    assert.ok(filtered.total >= 1 && filtered.total <= target.totalProducts);
    assert.ok(filtered.products.some((p) => p.id === row.id));
  });

  await t.test("5. Brand CSV exports include all brands, selected brand products, and complete brand-product mapping", async () => {
    const dir = await getCompleteBrandDirectory({ limit: 0 });
    const sample = dir.brands[0];

    const brandsCsv = await generateBrandCsvExport({ type: "brands" });
    assert.equal(brandsCsv.rowCount, dir.analytics.totalUniqueBrands, "Brands CSV must export every unique brand");
    assert.ok(brandsCsv.csv.startsWith('"S.No.","Brand Name","Normalized Brand Key"'));

    const brandProductsCsv = await generateBrandCsvExport({
      type: "brand_products",
      brand: sample.normalizedBrand,
    });
    assert.equal(
      brandProductsCsv.rowCount,
      sample.totalProducts,
      "Brand products CSV must export every product for that brand"
    );

    const mappingCsv = await generateBrandCsvExport({ type: "mapping" });
    assert.equal(
      mappingCsv.rowCount,
      dir.analytics.totalProductsInDatabase,
      "Mapping CSV must cover every product in database"
    );
  });

  await t.test("6. Admin Brand API endpoints enforce 401/403 authorization and serve verified ADMIN data", async () => {
    const regularUser = await upsertGoogleUser({
      id: "google-brand-user",
      email: "brand.test.user@example.com",
      name: "Normal User",
    });
    const regularSession = await createSession(regularUser);

    const adminUser = await upsertGoogleUser({
      id: "google-brand-admin",
      email: "fooddecoded01@gmail.com",
      name: "Admin User",
    });
    const adminSession = await createSession(adminUser);

    // 401 checks
    assert.equal((await getAdminBrands(new NextRequest("http://localhost/api/admin/brands"))).status, 401);
    assert.equal(
      (await getAdminBrandProducts(new NextRequest("http://localhost/api/admin/brands/products?brand=amul"))).status,
      401
    );
    assert.equal((await exportAdminBrands(new NextRequest("http://localhost/api/admin/brands/export?type=brands"))).status, 401);

    // 403 checks
    const userHeaders = { Cookie: `${SESSION_COOKIE_NAME}=${regularSession.token}` };
    assert.equal(
      (await getAdminBrands(new NextRequest("http://localhost/api/admin/brands", { headers: userHeaders }))).status,
      403
    );
    assert.equal(
      (
        await getAdminBrandProducts(
          new NextRequest("http://localhost/api/admin/brands/products?brand=amul", { headers: userHeaders })
        )
      ).status,
      403
    );
    assert.equal(
      (
        await exportAdminBrands(
          new NextRequest("http://localhost/api/admin/brands/export?type=mapping", { headers: userHeaders })
        )
      ).status,
      403
    );

    // 200 ADMIN checks
    const adminHeaders = { Cookie: `${SESSION_COOKIE_NAME}=${adminSession.token}` };
    const brandsRes = await getAdminBrands(
      new NextRequest("http://localhost/api/admin/brands?page=1&limit=25", { headers: adminHeaders })
    );
    assert.equal(brandsRes.status, 200);
    const brandsJson = await brandsRes.json();
    assert.ok(brandsJson.brands.length === 25);
    assert.ok(brandsJson.analytics.totalUniqueBrands > 8);

    const firstKey = brandsJson.brands[0].normalizedBrand;
    const drillRes = await getAdminBrandProducts(
      new NextRequest(`http://localhost/api/admin/brands/products?brand=${encodeURIComponent(firstKey)}`, {
        headers: adminHeaders,
      })
    );
    assert.equal(drillRes.status, 200);

    const csvRes = await exportAdminBrands(
      new NextRequest("http://localhost/api/admin/brands/export?type=brands", { headers: adminHeaders })
    );
    assert.equal(csvRes.status, 200);
    assert.ok((csvRes.headers.get("content-type") || "").includes("text/csv"));

    await revokeSession(regularSession.token);
    await revokeSession(adminSession.token);
  });

  await t.test("7. Architecture preserves Top Represented Brands card, MongoDB indexes, and aggregation pipelines", () => {
    const dashboardSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/admin/ProductManagementDashboard.tsx"),
      "utf-8"
    );
    const adminClientSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/admin/AdminDashboardClient.tsx"),
      "utf-8"
    );
    const mongodbSrc = fs.readFileSync(path.join(process.cwd(), "src/lib/mongodb.ts"), "utf-8");
    const serviceSrc = fs.readFileSync(
      path.join(process.cwd(), "src/lib/brand-directory-service.ts"),
      "utf-8"
    );

    assert.ok(
      dashboardSrc.includes("Top Represented Brands"),
      "Existing Top Represented Brands dashboard card must be preserved"
    );
    assert.ok(
      adminClientSrc.includes("BrandDirectoryView"),
      "AdminDashboardClient must integrate BrandDirectoryView as a separate management section"
    );
    assert.ok(
      mongodbSrc.includes("brand: 1, category: 1") && mongodbSrc.includes("brand: 1, isArchived: 1"),
      "MongoDB indexes for brand aggregation must be registered"
    );
    assert.ok(
      serviceSrc.includes("col.aggregate<RawBrandBucket>") && serviceSrc.includes("$group"),
      "Must execute server-side MongoDB aggregation pipeline when connected"
    );
  });
});
