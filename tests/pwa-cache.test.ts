import { test } from "node:test";
import assert from "node:assert/strict";
import { GET } from "../src/app/api/products/category-cache/route";
import { NextRequest } from "next/server";

test("PWA Intelligent Cache: Category cache returns top 25 products for all active categories", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await GET(req);

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
  // First request: get ETag
  const req1 = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res1 = await GET(req1);
  const etag = res1.headers.get("ETag");
  assert.ok(etag, "Response must include an ETag header");

  // Second request: send ETag
  const req2 = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25", {
    headers: { "if-none-match": etag },
  });
  const res2 = await GET(req2);
  assert.equal(res2.status, 304, "Should return HTTP 304 Not Modified when ETag matches");
});

test("PWA Intelligent Cache: Payload size verification (remains lightweight under 1.5MB uncompressed)", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await GET(req);
  const text = await res.text();
  const sizeBytes = Buffer.byteLength(text, "utf8");
  const sizeKB = sizeBytes / 1024;
  const sizeMB = sizeKB / 1024;

  console.log(`[Cache Size Report] Uncompressed JSON size: ${sizeKB.toFixed(2)} KB (${sizeMB.toFixed(3)} MB)`);
  assert.ok(sizeMB < 1.5, `Payload (${sizeMB.toFixed(2)} MB) must be strictly less than 1.5 MB for instant background loading`);
});

test("PWA Intelligent Cache: Sorting integrity (products are ranked by score descending)", async () => {
  const req = new NextRequest("http://localhost:3000/api/products/category-cache?limit=25");
  const res = await GET(req);
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
