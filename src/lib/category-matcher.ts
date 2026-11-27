import { ProductItem, SlimProductItem } from "@/types";

/**
 * Canonical Category Resolver mapping both slugs and aliases
 * to canonical FoodDecode supermarket aisles.
 * Pure TypeScript with zero Node/DB dependencies (safe for browser & server).
 */
export const CATEGORY_RESOLVER: Record<string, string | string[]> = {
  // Canonical 19 Categories (names and slugs)
  "chips-namkeen-savoury-snacks": "Chips, Namkeen & Savoury Snacks",
  "chips, namkeen & savoury snacks": "Chips, Namkeen & Savoury Snacks",
  "makhana-roasted-snacks": "Makhana & Roasted Snacks",
  "makhana & roasted snacks": "Makhana & Roasted Snacks",
  "biscuits-cookies-crackers": "Biscuits, Cookies & Crackers",
  "biscuits, cookies & crackers": "Biscuits, Cookies & Crackers",
  "chocolates-candy-sweets": "Chocolates, Candy & Sweets",
  "chocolates, candy & sweets": "Chocolates, Candy & Sweets",
  "protein-bars-energy-bars-wafers": "Protein Bars, Energy Bars & Wafers",
  "protein bars, energy bars & wafers": "Protein Bars, Energy Bars & Wafers",
  "breakfast-cereals-muesli-granola": "Breakfast Cereals, Muesli & Granola",
  "breakfast cereals, muesli & granola": "Breakfast Cereals, Muesli & Granola",
  "oats-porridge": "Oats & Porridge",
  "oats & porridge": "Oats & Porridge",
  "bakery-breads": "Bakery & Breads",
  "bakery & breads": "Bakery & Breads",
  "noodles-pasta-vermicelli": "Noodles, Pasta & Vermicelli",
  "noodles, pasta & vermicelli": "Noodles, Pasta & Vermicelli",
  "ready-to-eat-meals-instant-foods": "Ready-to-Eat Meals & Instant Foods",
  "ready-to-eat meals & instant foods": "Ready-to-Eat Meals & Instant Foods",
  "ready-to-cook-mixes": "Ready-to-Cook Mixes",
  "ready-to-cook mixes": "Ready-to-Cook Mixes",
  "rice-grains-pulses-flours": "Rice, Grains, Pulses & Flours",
  "rice, grains, pulses & flours": "Rice, Grains, Pulses & Flours",
  "nuts-seeds-trail-mixes": "Nuts, Seeds & Trail Mixes",
  "nuts, seeds & trail mixes": "Nuts, Seeds & Trail Mixes",
  "nut-butters-spreads-dips": "Nut Butters, Spreads & Dips",
  "nut butters, spreads & dips": "Nut Butters, Spreads & Dips",
  "sauces-condiments-seasonings": "Sauces, Condiments & Seasonings",
  "sauces, condiments & seasonings": "Sauces, Condiments & Seasonings",
  "dairy-yogurt-dairy-alternatives": "Dairy, Yogurt & Dairy Alternatives",
  "dairy, yogurt & dairy alternatives": "Dairy, Yogurt & Dairy Alternatives",
  "beverages-drink-mixes": "Beverages & Drink Mixes",
  "beverages & drink mixes": "Beverages & Drink Mixes",
  "ice-cream-frozen-desserts": "Ice Cream & Frozen Desserts",
  "ice cream & frozen desserts": "Ice Cream & Frozen Desserts",
  "plant-based-foods-meat-alternatives": "Plant-Based Foods & Meat Alternatives",
  "plant-based foods & meat alternatives": "Plant-Based Foods & Meat Alternatives",

  // Backward-Compatible Aliases
  "cold-drinks": "Beverages & Drink Mixes",
  "cold drinks": "Beverages & Drink Mixes",
  "beverages": "Beverages & Drink Mixes",
  "beverages-drinks": "Beverages & Drink Mixes",
  "beverages & drinks": "Beverages & Drink Mixes",
  "ice-cream": "Ice Cream & Frozen Desserts",
  "ice cream": "Ice Cream & Frozen Desserts",
  "chocolate": "Chocolates, Candy & Sweets",
  "chocolates": "Chocolates, Candy & Sweets",
  "chocolates-sweets": "Chocolates, Candy & Sweets",
  "chocolates & sweets": "Chocolates, Candy & Sweets",
  "chips": "Chips, Namkeen & Savoury Snacks",
  "biscuits": "Biscuits, Cookies & Crackers",
  "biscuit": "Biscuits, Cookies & Crackers",
  "noodles-ready-to-eat": ["Noodles, Pasta & Vermicelli", "Ready-to-Eat Meals & Instant Foods"],
  "noodles & ready-to-eat": ["Noodles, Pasta & Vermicelli", "Ready-to-Eat Meals & Instant Foods"],
  "ready-to-eat-ready-to-cook": ["Ready-to-Eat Meals & Instant Foods", "Ready-to-Cook Mixes"],
  "ready-to-eat & ready-to-cook": ["Ready-to-Eat Meals & Instant Foods", "Ready-to-Cook Mixes"],
  "protein-foods-snacks": ["Protein Bars, Energy Bars & Wafers", "Chips, Namkeen & Savoury Snacks", "Biscuits, Cookies & Crackers"],
  "protein foods & snacks": ["Protein Bars, Energy Bars & Wafers", "Chips, Namkeen & Savoury Snacks", "Biscuits, Cookies & Crackers"],
  "protein-clean-label-bars-wafers": "Protein Bars, Energy Bars & Wafers",
  "protein & clean-label bars / wafers": "Protein Bars, Energy Bars & Wafers",
  "cereals-breakfast": "Breakfast Cereals, Muesli & Granola",
  "cereals & breakfast": "Breakfast Cereals, Muesli & Granola",
  "wholesome-breakfast-oats-nut-butters": ["Oats & Porridge", "Breakfast Cereals, Muesli & Granola", "Nut Butters, Spreads & Dips"],
  "wholesome breakfast, oats & nut butters": ["Oats & Porridge", "Breakfast Cereals, Muesli & Granola", "Nut Butters, Spreads & Dips"],
  "dairy-alternatives": "Dairy, Yogurt & Dairy Alternatives",
  "dairy-yogurt": "Dairy, Yogurt & Dairy Alternatives",
  "dairy & yogurt": "Dairy, Yogurt & Dairy Alternatives",
  "plant-based-foods": "Plant-Based Foods & Meat Alternatives",
  "plant-based foods": "Plant-Based Foods & Meat Alternatives",
  "pantry-staples": "Rice, Grains, Pulses & Flours",
  "pantry-grains": "Rice, Grains, Pulses & Flours",
  "pantry & grains": "Rice, Grains, Pulses & Flours",
  "condiments-sauces": "Sauces, Condiments & Seasonings",
  "condiments & sauces": "Sauces, Condiments & Seasonings",
  "spreads-dips-sauces": "Nut Butters, Spreads & Dips",
  "spreads, dips & sauces": "Nut Butters, Spreads & Dips",
  "baked-chips-makhana-unjunked-indian-snacks": ["Chips, Namkeen & Savoury Snacks", "Makhana & Roasted Snacks"],
  "baked chips, makhana & unjunked indian snacks": ["Chips, Namkeen & Savoury Snacks", "Makhana & Roasted Snacks"],
  "dry-fruits-nuts-seeds-trail-mixes": ["Nuts, Seeds & Trail Mixes", "Makhana & Roasted Snacks"],
  "dry fruits, nuts, seeds & trail mixes": ["Nuts, Seeds & Trail Mixes", "Makhana & Roasted Snacks"],
  "snacks-sweets": ["Biscuits, Cookies & Crackers", "Chips, Namkeen & Savoury Snacks"],
  "snacks-spreads": ["Biscuits, Cookies & Crackers", "Chips, Namkeen & Savoury Snacks"],
  "snacks & spreads": ["Biscuits, Cookies & Crackers", "Chips, Namkeen & Savoury Snacks"],
};

export function slugifyCategory(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolves any category input (canonical name, slug, legacy alias)
 * to a normalized list of canonical category names and normalized slug key.
 */
export function resolveCategoryTargets(category?: string): string[] {
  if (!category || category === "All") return [];
  const lower = category.toLowerCase().trim();
  const slug = slugifyCategory(lower);
  const resolved = CATEGORY_RESOLVER[lower] ?? CATEGORY_RESOLVER[slug];
  if (resolved) {
    return Array.isArray(resolved) ? resolved : [resolved];
  }
  return [category.trim()];
}

export function normalizeCategoryCacheKey(category?: string): string {
  if (!category || category === "All") return "All";
  const targets = resolveCategoryTargets(category);
  return targets.map((t) => t.toLowerCase().trim()).sort().join("|");
}

/**
 * Authoritative category match check shared by UI filtering, smart cache, and IndexedDB fallback.
 */
export function matchesProductCategory(
  product: Pick<SlimProductItem | ProductItem, "category" | "categorySlug" | "subCategory">,
  targetCategory?: string,
  targetSubCategory?: string
): boolean {
  if (targetCategory && targetCategory !== "All") {
    const targets = resolveCategoryTargets(targetCategory);
    const catLower = targetCategory.toLowerCase().trim();
    const catSlug = slugifyCategory(catLower);

    const pCat = (product.category || "").toLowerCase().trim();
    const pSlug = (product.categorySlug || "").toLowerCase().trim();

    const matchesCat = targets.some((t) => {
      const tLower = t.toLowerCase().trim();
      const tSlug = slugifyCategory(tLower);
      return (
        pCat === tLower ||
        pSlug === tLower ||
        pSlug === tSlug ||
        pCat === catLower ||
        pSlug === catLower ||
        pSlug === catSlug
      );
    });

    if (!matchesCat) return false;
  }

  if (targetSubCategory && targetSubCategory !== "All") {
    const subLower = targetSubCategory.toLowerCase().trim();
    const pSub = (product.subCategory || "").toLowerCase().trim();
    if (subLower === "chips") {
      if (pSub !== "chips" && pSub !== "chips & crisps" && pSub !== "potato chips") return false;
    } else if (pSub !== subLower) {
      return false;
    }
  }

  return true;
}
