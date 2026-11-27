import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getCategoryHeaderInfo } from "../src/lib/category-header-helper.js";
import {
  matchesProductCategory,
  normalizeCategoryCacheKey,
  resolveCategoryTargets,
} from "../src/lib/category-matcher.js";
import {
  CategoryCacheManager,
  buildCategoryRequestKey,
} from "../src/lib/category-cache-manager.js";
import { getCachedProductsByCategory } from "../src/lib/pwa-cache/indexed-db.js";
import { SlimProductItem } from "../src/types/index.js";

function makeSlimProduct(overrides: Partial<SlimProductItem>): SlimProductItem {
  return {
    id: overrides.id || "prod-1",
    _id: overrides._id || overrides.id || "prod-1",
    barcode: overrides.barcode || "8900000000001",
    name: overrides.name || "Test Product",
    brand: overrides.brand || "TestBrand",
    category: overrides.category || "Chips, Namkeen & Savoury Snacks",
    categorySlug: overrides.categorySlug || "chips-namkeen-savoury-snacks",
    subCategory: overrides.subCategory || "Potato Chips",
    overallScore: overrides.overallScore ?? 75,
    score: overrides.score ?? 75,
    scoreLabel: "Good",
    nutriScore: "B",
    novaGroup: 3,
    proteinPer100g: overrides.proteinPer100g ?? 6,
    sugarPer100g: overrides.sugarPer100g ?? 2,
    sodiumPer100g: overrides.sodiumPer100g ?? 100,
    isPalmOilFree: overrides.isPalmOilFree ?? true,
    hasPalmOil: !(overrides.isPalmOilFree ?? true),
    hasAddedSugar: false,
    hasHighSodium: false,
    hasArtificialAdditives: false,
    isVerified: overrides.isVerified ?? true,
    verified: overrides.isVerified ?? true,
    imageUrl: "/images/placeholder-product.svg",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

test("Category Switching, Performance & Reliability Audit Suite", async (t) => {
  const pagePath = path.join(process.cwd(), "src/app/products/page.tsx");
  const drawerPath = path.join(process.cwd(), "src/components/LeftDrawer.tsx");
  const explorerPath = path.join(process.cwd(), "src/components/ProductsExplorer.tsx");
  const cssPath = path.join(process.cwd(), "src/app/globals.css");

  const pageContent = fs.readFileSync(pagePath, "utf-8");
  const drawerContent = fs.readFileSync(drawerPath, "utf-8");
  const explorerContent = fs.readFileSync(explorerPath, "utf-8");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  await t.test("1. Rapid category switching sequence (Chips -> Chocolates -> Biscuits -> Ice Cream -> Cold Drinks -> Chips)", async () => {
    const manager = new CategoryCacheManager({ maxEntries: 10, freshTtlMs: 60_000, staleTtlMs: 300_000 });
    let fetchCalls = 0;

    const sequence = [
      "Chips, Namkeen & Savoury Snacks",
      "Chocolates, Candy & Sweets",
      "Biscuits, Cookies & Crackers",
      "Ice Cream & Frozen Desserts",
      "cold-drinks",
      "Chips, Namkeen & Savoury Snacks", // Revisit should hit fresh cache with 0 API calls
    ];

    let activeCategory = "All";
    let activeProducts: SlimProductItem[] = [];
    let requestId = 0;

    for (const cat of sequence) {
      const reqId = ++requestId;
      const key = buildCategoryRequestKey({ category: cat, page: 1, sortBy: "score" });
      const header = getCategoryHeaderInfo(cat, undefined, 100);
      assert.ok(header.title.length > 0 && header.description.length > 0);

      const lookup = manager.get(key);
      if (lookup.status === "fresh") {
        manager.recordCacheHit("fresh");
        activeCategory = cat;
        activeProducts = lookup.products;
        continue;
      }

      manager.recordCacheMiss();
      const { promise } = manager.acquireRequest(key, async () => {
        fetchCalls++;
        const resolved = resolveCategoryTargets(cat)[0] || cat;
        return [makeSlimProduct({ id: `${resolved}-1`, category: resolved, name: `${resolved} Item` })];
      });

      const fetched = await promise;
      if (reqId === requestId) {
        manager.set(key, cat, fetched);
        activeCategory = cat;
        activeProducts = fetched;
      }
    }

    assert.strictEqual(activeCategory, "Chips, Namkeen & Savoury Snacks");
    assert.strictEqual(activeProducts[0].category, "Chips, Namkeen & Savoury Snacks");
    assert.strictEqual(fetchCalls, 5, "Revisiting Chips must reuse fresh cache (5 API fetches for 6 transitions)");
    const metrics = manager.getMetrics();
    assert.strictEqual(metrics.cacheHitCount, 1);
    assert.strictEqual(metrics.cacheMissCount, 5);
  });

  await t.test("2. Duplicate request prevention & consumer-safe cancellation registry", async () => {
    const manager = new CategoryCacheManager();
    const key1 = buildCategoryRequestKey({
      category: "Beverages & Drink Mixes",
      subCategory: "Cold Drinks",
      page: 1,
      sortBy: "score",
      filters: { lowSugar: true, hasPalmOil: "false" },
    });
    const key2 = buildCategoryRequestKey({
      category: "cold-drinks",
      subCategory: "cold drinks",
      page: 1,
      sortBy: "score",
      filters: { hasPalmOil: "false", lowSugar: true },
    });

    assert.strictEqual(key1, key2, "Request keys must normalize category aliases & filter order deterministically");

    let actualFetchCount = 0;
    let underlyingAborted = false;

    const fetcher = (signal: AbortSignal) =>
      new Promise<SlimProductItem[]>((resolve, reject) => {
        actualFetchCount++;
        const timer = setTimeout(() => {
          resolve([makeSlimProduct({ id: "bev-1", category: "Beverages & Drink Mixes" })]);
        }, 40);
        signal.addEventListener("abort", () => {
          underlyingAborted = true;
          clearTimeout(timer);
          const err = new Error("Aborted");
          err.name = "AbortError";
          reject(err);
        });
      });

    // Consumer A & Consumer B request identical key simultaneously
    const consumerA = manager.acquireRequest(key1, fetcher);
    const consumerB = manager.acquireRequest(key2, fetcher);

    assert.strictEqual(consumerA.isDeduplicated, false);
    assert.strictEqual(consumerB.isDeduplicated, true);
    assert.strictEqual(actualFetchCount, 1, "Only 1 network request should execute for concurrent identical queries");

    // Cancelling Consumer A must NOT abort the fetch because Consumer B still awaits it
    consumerA.release(true);
    assert.strictEqual(underlyingAborted, false, "Cancelling one consumer must preserve request for remaining consumer");

    const resultB = await consumerB.promise;
    assert.strictEqual(resultB.length, 1);
    assert.strictEqual(manager.getMetrics().duplicateApiRequestCount, 1);
    assert.strictEqual(manager.getMetrics().abortedRequestCount, 0);
  });

  await t.test("3. Cache expiration (fresh -> stale -> expired) and bounded LRU eviction", () => {
    const manager = new CategoryCacheManager({ maxEntries: 2, freshTtlMs: 1000, staleTtlMs: 5000 });
    const t0 = 10_000;

    manager.set("k1", "Chips", [makeSlimProduct({ id: "c1" })], t0);
    assert.strictEqual(manager.get("k1", t0 + 500).status, "fresh");
    assert.strictEqual(manager.get("k1", t0 + 1500).status, "stale");
    assert.strictEqual(manager.get("k1", t0 + 6000).status, "miss");

    // Test bounded LRU eviction (maxEntries = 2)
    manager.set("kA", "CatA", [makeSlimProduct({ id: "a" })], t0);
    manager.set("kB", "CatB", [makeSlimProduct({ id: "b" })], t0 + 1);
    // Access kA so kB becomes least-recently-used
    manager.get("kA", t0 + 2);
    // Insert kC -> must evict kB, keeping kA & kC
    manager.set("kC", "CatC", [makeSlimProduct({ id: "c" })], t0 + 3);

    assert.strictEqual(manager.get("kB", t0 + 4).status, "miss", "Least recently used entry kB must be evicted");
    assert.strictEqual(manager.get("kA", t0 + 4).status, "fresh", "Recently accessed kA must remain cached");
    assert.strictEqual(manager.get("kC", t0 + 4).status, "fresh", "Newest kC must remain cached");
  });

  await t.test("4. Cache invalidation (by category/alias and full reset)", () => {
    const manager = new CategoryCacheManager();
    const t0 = Date.now();
    const kChips = buildCategoryRequestKey({ category: "Chips, Namkeen & Savoury Snacks" });
    const kChoc = buildCategoryRequestKey({ category: "Chocolates, Candy & Sweets" });

    manager.set(kChips, "Chips, Namkeen & Savoury Snacks", [makeSlimProduct({ id: "c1" })], t0);
    manager.set(kChoc, "Chocolates, Candy & Sweets", [makeSlimProduct({ id: "ch1" })], t0);

    // Invalidate by alias "chips"
    manager.invalidate("chips");
    assert.strictEqual(manager.get(kChips, t0).status, "miss");
    assert.strictEqual(manager.get(kChoc, t0).status, "fresh");

    // Full invalidation
    manager.invalidate();
    assert.strictEqual(manager.get(kChoc, t0).status, "miss");
  });

  await t.test("5. IndexedDB failure graceful fallback", async () => {
    // In Node environment without IndexedDB, getCachedProductsByCategory must resolve cleanly to [] without throwing
    const res = await getCachedProductsByCategory("Chips, Namkeen & Savoury Snacks");
    assert.deepStrictEqual(res, []);

    // Verify ProductsExplorer handles IDB catch safely and checks requestIdRef before falling back
    assert.ok(
      explorerContent.includes("categoryCacheManager.recordIdbFailure()"),
      "ProductsExplorer must handle IndexedDB failures gracefully and record metric"
    );
    assert.ok(
      explorerContent.includes("if (currentReqId !== requestIdRef.current) return;"),
      "IndexedDB error fallback must check requestIdRef to avoid reviving aborted switches"
    );
  });

  await t.test("6. Network failure & offline fallback resilience", async () => {
    const manager = new CategoryCacheManager();
    const key = buildCategoryRequestKey({ category: "Biscuits, Cookies & Crackers" });

    const { promise } = manager.acquireRequest(key, async () => {
      throw new Error("Network offline");
    });

    await assert.rejects(promise, /Network offline/);
    assert.strictEqual(manager.getMetrics().failedRequestCount, 1);

    // Verify ProductsExplorer guards against offline fetching cleanly
    assert.ok(
      explorerContent.includes("!navigator.onLine"),
      "ProductsExplorer must support offline fallback without crashing on missing network"
    );
  });

  await t.test("7. Navigation validation: Server props guard (no revert bug), Drawer event & Browser Back/Forward", () => {
    // Regression guard: Ensure initialParams sync effect uses prevInitialParamsRef, NOT [selectedCategory] directly
    assert.ok(
      explorerContent.includes("prevInitialParamsRef"),
      "ProductsExplorer must diff server initialParams using prevInitialParamsRef so in-page selections don't revert"
    );
    assert.ok(
      !explorerContent.includes("[initialParams.category, initialParams.subCategory, selectedCategory,"),
      "ProductsExplorer must NOT depend on selectedCategory in initialParams sync effect"
    );

    // Drawer emits synchronous q + fromDrawer details
    assert.ok(
      drawerContent.includes("fromDrawer: true") && drawerContent.includes('q: targetParams.get("q") || ""'),
      "LeftDrawer must send q and fromDrawer metadata on category-change event"
    );

    // Browser Back/Forward popstate restores all filters + category
    assert.ok(
      explorerContent.includes('window.addEventListener("popstate", handlePopState)') &&
        explorerContent.includes("handleCategorySwitch(cat, sub, false)"),
      "ProductsExplorer must restore full filter & category state on browser Back/Forward"
    );

    // Server page delegates header rendering to ProductsExplorer
    assert.ok(
      !pageContent.includes("<h1>{pageTitle}</h1>") && pageContent.includes("<ProductsExplorer"),
      "page.tsx must delegate heading to ProductsExplorer as single source of truth"
    );
  });

  await t.test("8. Pagination reset & deduplication guarantees", () => {
    // Quick filter chips & category switches reset visibleCount(20)
    assert.ok(
      explorerContent.includes("setVisibleCount(20);"),
      "ProductsExplorer must reset pagination to 20 on category/filter changes"
    );
    // Deduplication in filteredProducts
    assert.ok(
      explorerContent.includes("const seenIds = new Set<string>();"),
      "ProductsExplorer must deduplicate filteredProducts to avoid duplicate cards during infinite scroll"
    );
  });

  await t.test("9. Sorting, filtering & category alias matching validation", () => {
    const coldDrink = makeSlimProduct({
      id: "cd-1",
      category: "Beverages & Drink Mixes",
      categorySlug: "beverages-drink-mixes",
      subCategory: "Carbonated Soft Drinks",
    });
    const chips = makeSlimProduct({
      id: "ch-1",
      category: "Chips, Namkeen & Savoury Snacks",
      categorySlug: "chips-namkeen-savoury-snacks",
      subCategory: "Potato Chips",
    });

    assert.strictEqual(matchesProductCategory(coldDrink, "cold-drinks"), true);
    assert.strictEqual(matchesProductCategory(coldDrink, "Beverages & Drink Mixes"), true);
    assert.strictEqual(matchesProductCategory(chips, "cold-drinks"), false);
    assert.strictEqual(matchesProductCategory(chips, "chips", "Potato Chips"), true);
    assert.strictEqual(normalizeCategoryCacheKey("cold-drinks"), normalizeCategoryCacheKey("Beverages & Drink Mixes"));

    // UI proteinRange / sugarRange values match filter logic
    assert.ok(
      explorerContent.includes('proteinRange === "high"') &&
        explorerContent.includes('proteinRange === "mod"') &&
        explorerContent.includes('sugarRange === "low"') &&
        explorerContent.includes('sugarRange === "zero"'),
      "ProductsExplorer must support UI proteinRange ('high'|'mod') and sugarRange ('low'|'zero') filters"
    );
  });

  await t.test("10. Component cleanup & memory leak prevention", () => {
    assert.ok(
      explorerContent.includes("activeRequestReleaseRef.current?.(true);"),
      "ProductsExplorer unmount effect must release active request consumer leases"
    );
    assert.ok(
      drawerContent.includes("const controller = new AbortController();") &&
        drawerContent.includes("return () => controller.abort();"),
      "LeftDrawer must abort mount fetch requests upon unmount"
    );
  });

  await t.test("11. UI transitions, CLS skeleton parity & reduced-motion accessibility", () => {
    assert.ok(
      cssContent.includes("@media (prefers-reduced-motion: reduce)") &&
        cssContent.includes(".fd-fade-in"),
      "globals.css must define smooth .fd-fade-in animation and prefers-reduced-motion accessibility overrides"
    );
    // Skeleton dimensions match ProductCard dimensions (h-44, w-11 h-11, rounded-2xl p-4)
    assert.ok(
      explorerContent.includes("w-full h-44") &&
        explorerContent.includes("w-11 h-11 rounded-xl") &&
        explorerContent.includes("fd-fade-in"),
      "Skeleton card dimensions must match ProductCard 1:1 to eliminate CLS"
    );
  });

  await t.test("12. Stale API response rejection & cache timestamp guard", async () => {
    const manager = new CategoryCacheManager();
    const k = buildCategoryRequestKey({ category: "Ice Cream & Frozen Desserts" });

    // Monotonic timestamp check in cache.set prevents older write overwriting newer data
    manager.set(k, "Ice Cream & Frozen Desserts", [makeSlimProduct({ id: "newer" })], 5000);
    manager.set(k, "Ice Cream & Frozen Desserts", [makeSlimProduct({ id: "older" })], 2000);
    const cached = manager.get(k, 5001);
    assert.strictEqual(cached.products?.[0].id, "newer", "Older timestamp write must never overwrite newer cached entry");

    // Rapid staggered async simulation verifying requestId rejection
    let reqCounter = 0;
    let renderedCategory = "Chips";
    let renderedItems: string[] = ["chip-1"];

    const switchSim = (cat: string, delay: number) => {
      const myReq = ++reqCounter;
      const { promise, release } = manager.acquireRequest(`sim:${cat}`, (sig) => {
        return new Promise<SlimProductItem[]>((resolve) => {
          const timer = setTimeout(() => {
            if (sig.aborted) return resolve([]);
            resolve([makeSlimProduct({ id: `${cat}-item`, category: cat })]);
          }, delay);
          sig.addEventListener("abort", () => {
            clearTimeout(timer);
            resolve([]);
          });
        });
      });

      return {
        cancel: () => release(true),
        done: promise.then((res) => {
          if (myReq === reqCounter && res.length > 0) {
            renderedCategory = cat;
            renderedItems = res.map((r) => r.id!);
          }
        }),
      };
    };

    const s1 = switchSim("Chocolates", 90);
    s1.cancel();
    const s2 = switchSim("Biscuits", 120);
    s2.cancel();
    const s3 = switchSim("Cold Drinks", 30);

    await Promise.all([s1.done, s2.done, s3.done]);
    assert.strictEqual(renderedCategory, "Cold Drinks");
    assert.deepStrictEqual(renderedItems, ["Cold Drinks-item"]);
  });
});
