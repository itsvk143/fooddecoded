import React from "react";
import { queryProducts } from "@/lib/product-service";
import { FiltersBar } from "@/components/FiltersBar";
import { InfiniteProductList } from "@/components/InfiniteProductList";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/lib/seed-data";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subCategory?: string;
    brand?: string;
    nutriScore?: string;
    novaGroup?: string;
    hasPalmOil?: string;
    lowSugar?: string;
    lowSodium?: string;
    proteinRange?: string;
    sugarRange?: string;
    verifiedOnly?: string;
    sortBy?: "name" | "score" | "recent" | "verified";
    page?: string;
  }>;
}

export default async function ProductsDirectoryPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const page = 1;
  const limit = 20;

  const { products, total, totalPages, isDbConnected } = await queryProducts({
    q: params.q,
    category: params.category,
    subCategory: params.subCategory,
    brand: params.brand,
    nutriScore: params.nutriScore,
    novaGroup: params.novaGroup ? Number(params.novaGroup) : undefined,
    hasPalmOil: params.hasPalmOil !== undefined ? params.hasPalmOil === "true" : undefined,
    lowSugar: params.lowSugar === "true",
    lowSodium: params.lowSodium === "true",
    proteinRange: params.proteinRange,
    sugarRange: params.sugarRange,
    verifiedOnly: params.verifiedOnly === "true",
    sortBy: params.sortBy || "score",
    sortOrder: params.sortBy === "name" ? "asc" : "desc",
    page,
    limit,
  });

  const categoryNames = SEED_CATEGORIES.map((c) => c.name);
  const brandNames = SEED_BRANDS.map((b) => b.name);

  const catParam = params.category?.toLowerCase() || "";
  const subParam = params.subCategory?.toLowerCase() || "";

  const isColdDrinks =
    catParam === "cold-drinks" ||
    catParam === "cold drinks" ||
    subParam === "cold drinks" ||
    subParam === "cold-drinks";

  const isChips = catParam === "chips" || subParam === "chips";

  const isIceCream =
    catParam === "ice-cream" ||
    catParam === "ice cream" ||
    subParam === "ice cream" ||
    subParam === "frozen desserts" ||
    subParam === "kulfi" ||
    subParam === "low sugar & healthy frozen";

  const isReadyToEat =
    catParam === "ready-to-eat-ready-to-cook" ||
    catParam === "ready-to-eat & ready-to-cook" ||
    subParam === "instant meals" ||
    subParam === "ready-to-eat curries" ||
    subParam === "instant poha & upma" ||
    subParam === "cup meals" ||
    subParam === "frozen parathas" ||
    subParam === "ready-to-cook mixes" ||
    subParam === "instant soups";

  const isProtein =
    catParam === "protein-foods-snacks" ||
    catParam === "protein foods & snacks" ||
    subParam === "protein bars" ||
    subParam === "protein cookies" ||
    subParam === "protein chips" ||
    subParam === "protein breakfast cereals" ||
    subParam === "ready-to-drink protein shakes" ||
    subParam === "high-protein peanut butter";

  const isPlantBased =
    catParam === "plant-based-foods" ||
    catParam === "plant-based foods" ||
    subParam === "oat milk" ||
    subParam === "almond milk" ||
    subParam === "soy milk" ||
    subParam === "coconut milk beverages" ||
    subParam === "vegan yogurt" ||
    subParam === "dairy-free ice cream" ||
    subParam === "plant-based spreads";

  const isBakery =
    catParam === "bakery-breads" ||
    catParam === "bakery & breads" ||
    subParam === "whole wheat bread" ||
    subParam === "multigrain bread" ||
    subParam === "sourdough bread" ||
    subParam === "burger buns" ||
    subParam === "tortilla wraps" ||
    subParam === "pita bread" ||
    subParam === "packaged cakes & muffins";

  const isSpreads =
    catParam === "spreads-dips-sauces" ||
    catParam === "spreads, dips & sauces" ||
    catParam === "spreads & dips" ||
    subParam === "peanut butter" ||
    subParam === "almond butter" ||
    subParam === "hummus" ||
    subParam === "mayonnaise" ||
    subParam === "cheese spreads" ||
    subParam === "salsa" ||
    subParam === "cooking pastes" ||
    subParam === "chutneys";

  const isChocolates =
    catParam === "chocolates-sweets" ||
    catParam === "chocolates & sweets" ||
    catParam === "chocolate" ||
    catParam === "chocolates";

  const isBeverages =
    catParam === "beverages" ||
    catParam === "beverages & drinks";

  const pageTitle = isColdDrinks
    ? "Explore Cold Drinks"
    : isChips
    ? "Explore Chips & Crisps"
    : isIceCream
    ? "Explore Ice Cream & Frozen Desserts"
    : isReadyToEat
    ? "Explore Ready-to-Eat & Ready-to-Cook"
    : isProtein
    ? "Explore Protein Foods & Snacks"
    : isPlantBased
    ? "Explore Plant-Based Foods"
    : isBakery
    ? "Explore Bakery & Breads"
    : isSpreads
    ? "Explore Spreads, Dips & Sauces"
    : isChocolates
    ? "Explore Chocolates & Sweets"
    : isBeverages
    ? "Explore Beverages & Drinks"
    : "Explore Food Products";

  const pageDesc = isColdDrinks
    ? `Compare ingredients, sugar content, additives, nutritional facts, and ultra-processing levels across ${total} cold drinks.`
    : isIceCream
    ? `Compare ingredients, dairy fat, sugar content, additives, Nutri-Score, and ultra-processing levels across ${total} verified ice creams & frozen desserts.`
    : isReadyToEat
    ? `Compare ingredients, sodium, additives, and nutritional facts across ${total} instant meals, curries, poha, cup noodles, parathas, mixes and soups.`
    : isProtein
    ? `Compare protein sources, BCAAs, sugars, sweeteners, and processing levels across ${total} verified protein bars, cookies, chips, shakes, cereals and peanut butters.`
    : isPlantBased
    ? `Compare plant milks, fortification (B12, D, Calcium), vegan yogurts, dairy-free ice creams, and plant-based spreads across ${total} products.`
    : isBakery
    ? `Inspect whole wheat percentage, refined maida status, preservatives, and nutritional profiles across ${total} breads, sourdough, buns, wraps and bakery goods.`
    : isSpreads
    ? `Compare healthy fats, palm oil status, added sugars, and sodium levels across ${total} peanut butters, almond butters, hummus, mayonnaise, cheese spreads, salsas and chutneys.`
    : isChocolates
    ? `Compare cocoa solids, sugar content, palm oil status, additives, and nutritional facts across ${total} dark chocolates, truffles, Indian sweets, chikki and confections.`
    : isBeverages
    ? `Compare real fruit juice percentage, added sugar, artificial sweeteners, and nutrition across ${total} juices, sparkling waters, plant drinks, iced teas and cold brews.`
    : `Showing ${products.length} of ${total} products matching your criteria.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Searchable Food Database</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">
            {pageTitle}
          </h1>
          <p className="text-sm text-stone-500 mt-1">{pageDesc}</p>
        </div>

        {!isDbConnected && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium self-start sm:self-auto">
            ⚡ Demo Catalogue Mode · Connect MongoDB Atlas in .env.local to persist changes
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <FiltersBar
        categories={categoryNames}
        brands={brandNames}
        totalResults={total}
      />

      {/* Infinite Scrolling Product List */}
      <InfiniteProductList
        initialProducts={products}
        total={total}
        initialHasMore={page < totalPages}
        searchParams={params}
      />
    </div>
  );
}
