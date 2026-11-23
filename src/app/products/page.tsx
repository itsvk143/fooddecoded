import React, { Suspense } from "react";
import { getSlimProductsIndex } from "@/lib/product-service";
import { isMongoConfigured } from "@/lib/mongodb";
import { ProductsExplorer } from "@/components/ProductsExplorer";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/lib/seed-data";
import { Sparkles } from "lucide-react";
import { ProductsDirectorySkeleton } from "./loading";

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

  return (
    <Suspense fallback={<ProductsDirectorySkeleton />}>
      <ProductsContent params={params} />
    </Suspense>
  );
}

async function ProductsContent({ params }: { params: any }) {
  const products = await getSlimProductsIndex();
  const isDbConnected = isMongoConfigured();

  const categoryNames = SEED_CATEGORIES.map((c) => c.name);
  const brandNames = SEED_BRANDS.map((b) => b.name);

  const catParam = params.category?.toLowerCase() || "";
  const subParam = params.subCategory?.toLowerCase() || "";

  const isNoodlesReadyToEat =
    catParam === "noodles-ready-to-eat" ||
    catParam === "noodles & ready-to-eat" ||
    subParam === "instant noodles" ||
    subParam === "atta & healthy noodles" ||
    subParam === "cup & bowl noodles" ||
    subParam === "hakka & flat noodles" ||
    subParam === "instant pasta" ||
    subParam === "instant & cook-up soups" ||
    subParam === "heat & eat ready meals" ||
    subParam === "3-minute breakfast & mixes" ||
    subParam === "instant dessert & sweet mixes" ||
    subParam === "diy wok kits & stir-fry cooking sauces" ||
    subParam === "asian dips & chilli oils";

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

  const isHealthyBars =
    catParam === "protein-clean-label-bars-wafers" ||
    catParam === "protein & clean-label bars / wafers";

  const isDryFruits =
    catParam === "dry-fruits-nuts-seeds-trail-mixes" ||
    catParam === "dry fruits, nuts, seeds & trail mixes";

  const isWholesomeBreakfast =
    catParam === "wholesome-breakfast-oats-nut-butters" ||
    catParam === "wholesome breakfast, oats & nut butters";

  const isBakedChipsMakhana =
    catParam === "baked-chips-makhana-unjunked-indian-snacks" ||
    catParam === "baked chips, makhana & unjunked indian snacks";

  const pageTitle = isNoodlesReadyToEat
    ? "Explore Noodles & Ready-to-Eat"
    : isHealthyBars
    ? "Explore Protein & Clean-Label Bars / Wafers"
    : isDryFruits
    ? "Explore Dry Fruits, Nuts, Seeds & Trail Mixes"
    : isWholesomeBreakfast
    ? "Explore Wholesome Breakfast, Oats & Nut Butters"
    : isBakedChipsMakhana
    ? "Explore Baked Chips, Makhana & Unjunked Indian Snacks"
    : isColdDrinks
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
    : params.category
    ? `Explore ${params.category}`
    : "Explore Food Products";

  const total = products.length;

  const pageDesc = isNoodlesReadyToEat
    ? `Compare instant noodles, air-dried ramyun, MSG, palm oil, sodium levels, heat & eat curries, and breakfast mixes across ${total} products.`
    : isHealthyBars
    ? `Compare clean protein sources, whey isolate, date-sweetened recipes, and zero-chemical formulations across ${total} verified protein bars and wafers.`
    : isDryFruits
    ? `Inspect raw versus dry-roasted nuts, antioxidant seeds, omega-3 blends, and unpreserved dried fruits across ${total} pantry staples.`
    : isWholesomeBreakfast
    ? `Compare rolled oats, steel-cut oats, fiber-rich muesli, granola, and stone-ground nut butters across ${total} nutritious breakfast options.`
    : isBakedChipsMakhana
    ? `Explore roasted fox nuts, baked jowar puffs, roasted seeds, and palm-oil-free unjunked Indian namkeen across ${total} guilt-free snacks.`
    : isColdDrinks
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
    : `Instant directory of ${total.toLocaleString()} packaged food products with ingredient safety, Nutri-Score, and NOVA ratings.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Directory Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Searchable Food Database</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-stone-500 mt-1">{pageDesc}</p>
        </div>

        {!isDbConnected && process.env.NODE_ENV !== "production" && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium self-start sm:self-auto shrink-0">
            ⚡ Demo Catalogue Mode · Connect MongoDB Atlas in .env.local to persist changes
          </div>
        )}
      </div>

      {/* Instant 0ms Client-Side Products Explorer */}
      <ProductsExplorer
        initialProducts={products}
        categories={categoryNames}
        brands={brandNames}
        initialParams={params}
        isDbConnected={isDbConnected}
      />
    </div>
  );
}
