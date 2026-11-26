import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Products Page UI Optimization - Acceptance Criteria Verification", async (t) => {
  const explorerPath = path.join(process.cwd(), "src/components/ProductsExplorer.tsx");
  const navbarPath = path.join(process.cwd(), "src/components/Navbar.tsx");
  const explorerContent = fs.readFileSync(explorerPath, "utf-8");
  const navbarContent = fs.readFileSync(navbarPath, "utf-8");

  await t.test("1. Header search icon & functionality remain intact in Navbar", () => {
    assert.ok(
      navbarContent.includes('placeholder="Search products, brands, or barcode..."'),
      "Navbar must retain desktop search input"
    );
    assert.ok(
      navbarContent.includes('title="Search food database"') ||
        navbarContent.includes('aria-label="Toggle search"'),
      "Navbar must retain mobile search toggle button"
    );
  });

  await t.test("2. No duplicate search input or search button in ProductsExplorer panel", () => {
    // Assert no search input inside ProductsExplorer
    assert.ok(
      !explorerContent.includes('placeholder="Search food, brands, or barcode..."'),
      "ProductsExplorer must not contain duplicate search input field"
    );
    // Assert no search button inside the panel
    assert.ok(
      !explorerContent.includes('<button type="submit"') &&
        !explorerContent.includes("Search\n                </button>"),
      "ProductsExplorer must not contain duplicate green Search button"
    );
  });

  await t.test("3. Expandable panel is collapsed by default with title 'Filters & Sorting'", () => {
    assert.ok(
      explorerContent.includes("const [isControlsExpanded, setIsControlsExpanded] = useState(false);"),
      "Expandable panel default state must be false (collapsed)"
    );
    assert.ok(
      explorerContent.includes("<span>Filters & Sorting</span>"),
      "Control header button must be titled 'Filters & Sorting'"
    );
    assert.ok(
      explorerContent.includes("Expand") && explorerContent.includes("Collapse"),
      "Control header button must have clear Expand / Collapse indicators"
    );
  });

  await t.test("4 & 5. Sort on left (~68%) and Filters on right (~32%) on a single horizontal row", () => {
    // Check single row flex container
    assert.ok(
      explorerContent.includes('className="flex items-center w-full gap-2 sm:gap-2.5"'),
      "Controls must be in a single horizontal flex row with 8-10px gap without vertical stacking"
    );

    // Check Sort dropdown is flex-[68_68_0%] and left-aligned
    assert.ok(
      explorerContent.includes("flex-[68_68_0%] min-w-0 h-11"),
      "Sort dropdown container must occupy ~68% width with min-w-0 for narrow truncation"
    );

    // Check Filters button is flex-[32_32_0%] and right-aligned
    assert.ok(
      explorerContent.includes("flex-[32_32_0%] min-w-0 h-11 min-h-[44px]"),
      "Filters button must occupy ~32% width with 44px touch target height"
    );

    // Verify Sort appears before Filters in the DOM
    const sortIndex = explorerContent.indexOf('aria-label="Sort products by"');
    const filtersIndex = explorerContent.indexOf('aria-label="Toggle advanced filters"');
    assert.ok(sortIndex !== -1 && filtersIndex !== -1, "Both controls must exist with proper aria labels");
    assert.ok(sortIndex < filtersIndex, "Sort control must appear to the left of the Filters button");
  });

  await t.test("6. Equal heights (44px) and matching 2xl rounded border styling", () => {
    assert.ok(
      explorerContent.includes("rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"),
      "Sort dropdown must have matching rounded-2xl border and styling"
    );
    assert.ok(
      explorerContent.includes("min-h-[44px]") && explorerContent.includes("h-11"),
      "Both controls must meet 44px touch target requirement"
    );
  });

  await t.test("7. All required sorting options are preserved", () => {
    assert.ok(
      explorerContent.includes('<option value="score">FoodDecode Score (High → Low)</option>'),
      "Must preserve FoodDecode Score High -> Low"
    );
    assert.ok(
      explorerContent.includes('<option value="score-asc">FoodDecode Score (Low → High)</option>'),
      "Must preserve FoodDecode Score Low -> High"
    );
    assert.ok(
      explorerContent.includes('<option value="name">Product Name (A → Z)</option>'),
      "Must preserve Product Name A -> Z"
    );
    assert.ok(
      explorerContent.includes('<option value="name-desc">Product Name (Z → A)</option>'),
      "Must preserve Product Name Z -> A"
    );
  });

  await t.test("8. Quick filter chips appear below in horizontal scrolling row", () => {
    assert.ok(
      explorerContent.includes("overflow-x-auto no-scrollbar") &&
        explorerContent.includes("whitespace-nowrap"),
      "Quick filters must have horizontal scrolling with no-scrollbar and nowrap"
    );
    assert.ok(explorerContent.includes("Palm Oil Free"), "Must retain Palm Oil Free chip");
    assert.ok(explorerContent.includes("Low Sugar (≤5g)"), "Must retain Low Sugar chip");
    assert.ok(explorerContent.includes("Low Sodium (≤120mg)"), "Must retain Low Sodium chip");
    assert.ok(explorerContent.includes("Verified Only"), "Must retain Verified Only chip");
  });

  await t.test("9. 320px narrow mobile resilience (min-w-0, truncate, ellipsis)", () => {
    assert.ok(
      explorerContent.includes("truncate") && explorerContent.includes("min-w-0"),
      "Dropdown must have truncate and min-w-0 so it gracefully truncates label at 320px without overflow"
    );
  });
});
