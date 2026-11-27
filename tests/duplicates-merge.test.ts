import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  getDuplicateProducts,
  pickBestPrimaryProduct,
  saveProduct,
} from "../src/lib/product-service";
import { POST as postDuplicates, GET as getDuplicates } from "../src/app/api/admin/products/duplicates/route";
import { ProductItem } from "../src/types";

function makeTestProduct(overrides: Partial<ProductItem>): ProductItem {
  return {
    barcode: overrides.barcode || `890${Math.floor(Math.random() * 1e10)}`,
    name: overrides.name || "Test Duplicate Snack",
    brand: overrides.brand || "TestBrand",
    category: "Chips, Namkeen & Savoury Snacks",
    ingredientsText: overrides.ingredientsText || "Potatoes, Edible Oil",
    ingredientsList: [],
    nutritionPer100g: {
      calories: 500,
      totalFat: 30,
      saturatedFat: 10,
      carbohydrates: 50,
      sugars: 2,
      fiber: 3,
      protein: 6,
      sodium: 400,
      salt: 1,
    },
    nutriScore: "C",
    novaGroup: 3,
    overallScore: overrides.overallScore ?? 55,
    scoreLabel: "Moderate",
    hasPalmOil: false,
    hasAddedSugar: false,
    hasHighSodium: false,
    hasHighSaturatedFat: false,
    hasArtificialAdditives: false,
    isUltraProcessed: false,
    allergens: [],
    ingredientAlerts: [],
    dataCompleteness: overrides.dataCompleteness ?? 80,
    source: "admin",
    verified: overrides.verified ?? false,
    imageUrl: overrides.imageUrl || "/images/placeholder-product.svg",
    imageStatus: overrides.imageStatus || "PLACEHOLDER",
    isArchived: overrides.isArchived ?? false,
    createdAt: overrides.createdAt || "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt || "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("Duplicate Detection & Compare & Merge All Suite", async (t) => {
  await t.test("1. getDuplicateProducts excludes soft-archived / already merged products", async () => {
    const active = makeTestProduct({ id: "dup-a", _id: "dup-a", barcode: "8901112223334", isArchived: false });
    const archived = makeTestProduct({ id: "dup-b", _id: "dup-b", barcode: "8901112223334", isArchived: true });

    const groups = await getDuplicateProducts([active, archived]);
    assert.equal(groups.length, 0, "Already merged/archived duplicates must not appear as active collisions");
  });

  await t.test("2. pickBestPrimaryProduct picks record with verified image, barcode, higher score and ingredients", () => {
    const weak = makeTestProduct({
      id: "weak-1",
      _id: "weak-1",
      overallScore: 40,
      verified: false,
      imageUrl: "/images/placeholder-product.svg",
      ingredientsText: "Oil",
    });
    const strong = makeTestProduct({
      id: "strong-1",
      _id: "strong-1",
      overallScore: 78,
      verified: true,
      imageUrl: "/images/packshots/real.jpg",
      imageStatus: "VERIFIED",
      ingredientsText: "Potatoes, Cold-pressed Sunflower Oil, Sea Salt, Black Pepper",
    });

    const winner = pickBestPrimaryProduct([weak, strong]);
    assert.equal(winner.id, "strong-1", "Richest verified record must be selected as primary target");
  });

  await t.test("3. Batch Compare & Merge All merges active collisions via API & requires Admin auth", async () => {
    // Reject unauthorized caller
    const unauthReq = new NextRequest("http://localhost:3000/api/admin/products/duplicates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "merge_all" }),
    });
    const unauthRes = await postDuplicates(unauthReq);
    assert.equal(unauthRes.status, 401, "Unauthorized batch merge must be rejected with 401");

    // Seed two active duplicate records in in-memory seed store
    const dup1 = await saveProduct({
      barcode: "8909998887771",
      name: "Test Batch Cookie",
      brand: "TestBatchBrand",
      category: "Biscuits, Cookies & Crackers",
      ingredientsText: "Whole Wheat Flour, Butter",
      imageUrl: "/images/packshots/cookie-real.jpg",
      imageStatus: "VERIFIED",
      verified: true,
      overallScore: 72,
    });
    const dup2 = await saveProduct({
      barcode: "8909998887772",
      name: "Test Batch Cookie",
      brand: "TestBatchBrand",
      category: "Biscuits, Cookies & Crackers",
      ingredientsText: "Wheat",
      imageUrl: "/images/placeholder-product.svg",
      verified: false,
      overallScore: 50,
    });

    assert.ok(dup1 && dup2);

    const adminKey = process.env.ADMIN_SECRET_KEY || "fooddecode_admin_secret_key_change_in_production";
    const batchReq = new NextRequest("http://localhost:3000/api/admin/products/duplicates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ action: "merge_all" }),
    });

    const batchRes = await postDuplicates(batchReq);
    assert.equal(batchRes.status, 200, "Authorized batch merge_all must succeed with 200");
    const body = await batchRes.json();
    assert.equal(body.success, true);
    assert.ok(body.mergedGroupsCount >= 1);
    assert.ok(body.mergedSourcesCount >= 1);

    // Re-check GET /api/admin/products/duplicates: should now have 0 active duplicates
    const verifyReq = new NextRequest("http://localhost:3000/api/admin/products/duplicates", {
      headers: { "x-admin-key": adminKey },
    });
    const verifyRes = await getDuplicates(verifyReq);
    assert.equal(verifyRes.status, 200);
    const verifyBody = await verifyRes.json();
    assert.equal(verifyBody.duplicates.length, 0, "All duplicate groups must be resolved after merge_all");
  });
});
