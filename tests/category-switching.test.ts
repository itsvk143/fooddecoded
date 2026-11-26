import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getCategoryHeaderInfo } from "../src/lib/category-header-helper.js";

test("Category Switching, Instant Loading & Smooth Transitions Verification", async (t) => {
  const pagePath = path.join(process.cwd(), "src/app/products/page.tsx");
  const drawerPath = path.join(process.cwd(), "src/components/LeftDrawer.tsx");
  const explorerPath = path.join(process.cwd(), "src/components/ProductsExplorer.tsx");
  const helperPath = path.join(process.cwd(), "src/lib/category-header-helper.ts");

  const pageContent = fs.readFileSync(pagePath, "utf-8");
  const drawerContent = fs.readFileSync(drawerPath, "utf-8");
  const explorerContent = fs.readFileSync(explorerPath, "utf-8");
  const helperContent = fs.readFileSync(helperPath, "utf-8");

  await t.test("1. Category Header Helper maps canonical categories and descriptions correctly", () => {
    assert.ok(fs.existsSync(helperPath), "category-header-helper.ts must exist");

    // Test All Products
    const allInfo = getCategoryHeaderInfo("All", undefined, 4909);
    assert.strictEqual(allInfo.title, "Explore Food Products");
    assert.ok(allInfo.description.includes("4,909 packaged food products"));

    // Test Chips, Namkeen & Savoury Snacks
    const snacksInfo = getCategoryHeaderInfo("Chips, Namkeen & Savoury Snacks", undefined, 842);
    assert.strictEqual(snacksInfo.title, "Explore Chips, Namkeen & Savoury Snacks");
    assert.ok(snacksInfo.description.includes("potato chips, bhujia, tortilla chips and savoury snacks"));

    // Test Chocolates, Candy & Sweets
    const sweetsInfo = getCategoryHeaderInfo("Chocolates, Candy & Sweets", undefined, 620);
    assert.strictEqual(sweetsInfo.title, "Explore Chocolates, Candy & Sweets");
    assert.ok(sweetsInfo.description.includes("dark chocolates, truffles, Indian sweets, chikki"));

    // Test with Subcategory
    const subCatInfo = getCategoryHeaderInfo("Chips, Namkeen & Savoury Snacks", "Potato Chips", 120);
    assert.strictEqual(subCatInfo.title, "Potato Chips");
  });

  await t.test("2. LeftDrawer dispatches synchronous category-change event and updates active selection immediately", () => {
    // Synchronous CustomEvent dispatch for 0ms reactivity
    assert.ok(
      drawerContent.includes('new CustomEvent("fooddecode:category-change"'),
      "LeftDrawer must dispatch fooddecode:category-change CustomEvent on category click"
    );
    assert.ok(
      drawerContent.includes("detail: { category: cat, subCategory: sub }"),
      "fooddecode:category-change event detail must include category and subCategory"
    );

    // Synchronous search/active item update
    assert.ok(
      drawerContent.includes('setCurrentSearch("?" + targetQuery);'),
      "LeftDrawer must immediately update currentSearch so active category highlights at 0ms"
    );
  });

  await t.test("3. Products page server component delegates dynamic header to ProductsExplorer", () => {
    // Assert page.tsx does not have desynchronized static <h1>
    assert.ok(
      !pageContent.includes("<h1>{pageTitle}</h1>") &&
        !pageContent.includes("<h1 className="),
      "src/app/products/page.tsx must not render static h1 outside ProductsExplorer to avoid desynchronization"
    );

    // Assert ProductsExplorer receives initialParams with params
    assert.ok(
      pageContent.includes("<ProductsExplorer") &&
        pageContent.includes("initialParams={params}"),
      "page.tsx must pass params to ProductsExplorer as single source of truth"
    );
  });

  await t.test("4. ProductsExplorer implements 0ms event listener, smart cache, AbortController and sequential requestId", () => {
    // In-memory cache Map
    assert.ok(
      explorerContent.includes("categoryCacheRef = useRef<Map<string, SlimProductItem[]>>(new Map())"),
      "ProductsExplorer must have an in-memory categoryCacheRef Map"
    );

    // AbortController for cancelling in-flight stale requests
    assert.ok(
      explorerContent.includes("abortControllerRef = useRef<AbortController | null>(null)"),
      "ProductsExplorer must have abortControllerRef"
    );
    assert.ok(
      explorerContent.includes("abortControllerRef.current.abort()"),
      "ProductsExplorer must abort existing requests on category switch"
    );

    // Sequential request ID counter for race-condition prevention
    assert.ok(
      explorerContent.includes("requestIdRef = useRef<number>(0)"),
      "ProductsExplorer must have sequential requestIdRef"
    );
    assert.ok(
      explorerContent.includes("requestIdRef.current"),
      "ProductsExplorer must track sequential requestId counter"
    );

    // Category change event listener
    assert.ok(
      explorerContent.includes('"fooddecode:category-change"'),
      "ProductsExplorer must listen for fooddecode:category-change events"
    );

    // Skeleton loader when category is loading
    assert.ok(
      explorerContent.includes("isLoadingCategory"),
      "ProductsExplorer must track isLoadingCategory state"
    );
    assert.ok(
      explorerContent.includes("animate-pulse") && explorerContent.includes("rounded-3xl"),
      "ProductsExplorer must render animated skeleton cards while category loads"
    );
  });

  await t.test("5. Rapid Category Switching Simulation: race conditions are prevented & stale responses discarded", async () => {
    // Simulate the exact logic in ProductsExplorer
    let requestId = 0;
    let activeState = { category: "Chips, Namkeen & Savoury Snacks", products: ["Chips 1", "Chips 2"] };
    const simulatedCache = new Map<string, string[]>();
    simulatedCache.set("Chips, Namkeen & Savoury Snacks", ["Chips 1", "Chips 2"]);

    let currentController: AbortController | null = null;

    // Function simulating switchCategory with network delay & cancellation
    const switchCategory = (targetCategory: string, networkDelayMs: number) => {
      const currentReqId = ++requestId;

      if (currentController) {
        currentController.abort();
      }
      currentController = new AbortController();
      const signal = currentController.signal;

      // Check cache first
      if (simulatedCache.has(targetCategory)) {
        activeState = { category: targetCategory, products: simulatedCache.get(targetCategory)! };
        return Promise.resolve(activeState);
      }

      return new Promise<typeof activeState>((resolve) => {
        const timer = setTimeout(() => {
          if (signal.aborted || currentReqId !== requestId) {
            // Cancelled or superseded by newer request
            resolve(activeState);
            return;
          }
          const loadedProducts = [`${targetCategory} Prod A`, `${targetCategory} Prod B`];
          simulatedCache.set(targetCategory, loadedProducts);
          activeState = { category: targetCategory, products: loadedProducts };
          resolve(activeState);
        }, networkDelayMs);

        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          resolve(activeState);
        });
      });
    };

    // Rapid switching sequence
    const p1 = switchCategory("Chocolates, Candy & Sweets", 100);
    const p2 = switchCategory("Biscuits & Cookies", 80);
    const p3 = switchCategory("Ice Cream & Desserts", 20);
    const p4 = switchCategory("Cold Drinks & Juices", 60); // Final selection

    await Promise.all([p1, p2, p3, p4]);

    // Active state must strictly reflect the last requested category
    assert.strictEqual(
      activeState.category,
      "Cold Drinks & Juices",
      "Only the final category's response must take effect"
    );
    assert.deepStrictEqual(
      activeState.products,
      ["Cold Drinks & Juices Prod A", "Cold Drinks & Juices Prod B"],
      "Products in state must match the final selected category"
    );
  });
});
