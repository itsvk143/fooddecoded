"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Check,
  RefreshCw,
  ChevronDown,
  Dumbbell,
  Candy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  categories: string[];
  brands: string[];
  totalResults: number;
}

export function FiltersBar({ categories, brands, totalResults }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "All";
  const currentBrand = searchParams.get("brand") || "All";
  const currentNutri = searchParams.get("nutriScore") || "All";
  const currentProtein = searchParams.get("proteinRange") || "All";
  const currentSugar = searchParams.get("sugarRange") || "All";
  const currentSort = searchParams.get("sortBy") || "recent";
  const currentPalmFree = searchParams.get("hasPalmOil") === "false";
  const currentLowSugar = searchParams.get("lowSugar") === "true";
  const currentLowSodium = searchParams.get("lowSodium") === "true";
  const currentVerified = searchParams.get("verifiedOnly") === "true";

  const [qInput, setQInput] = useState(currentQ);
  // Minimized by default - user expands on demand
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Synchronize input value if query param changes externally (e.g. from LeftDrawer)
  useEffect(() => {
    setQInput(currentQ);
  }, [currentQ]);

  const applyParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change
    if (value === null || value === "" || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const toggleBooleanParam = (key: string, currentValue: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (currentValue) {
      params.delete(key);
    } else {
      if (key === "hasPalmOil") {
        params.set(key, "false"); // Palm Oil Free filter
      } else {
        params.set(key, "true");
      }
    }
    router.push(`/products?${params.toString()}`);
  };

  const resetAllFilters = () => {
    setQInput("");
    router.push("/products");
  };

  // Count active non-default filters
  const filterCount = [
    currentCategory !== "All",
    currentBrand !== "All",
    currentNutri !== "All",
    currentProtein !== "All",
    currentSugar !== "All",
    currentSort !== "recent" && currentSort !== "score",
    currentPalmFree,
    currentLowSugar,
    currentLowSodium,
    currentVerified,
  ].filter(Boolean).length;

  const hasAnyFilter = Boolean(currentQ) || filterCount > 0;

  // Format label for nutrient range badges
  const formatRangeLabel = (range: string) => {
    if (range === "<10") return "less than 10g";
    if (range === "30+") return "30+g";
    return `${range}g`;
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-3 sm:p-4 shadow-xs transition-all">
      {/* Minimized Top Row: Compact Search Input + Search Button + Advance Filters Toggle */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyParam("q", qInput.trim());
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search products, brands, ingredients, barcode..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
          />
          {qInput && (
            <button
              type="button"
              onClick={() => {
                setQInput("");
                applyParam("q", null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded-full cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-2xl transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          Search
        </button>

        {/* Expand / Advance Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 border",
            showAdvanced
              ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
              : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700"
          )}
          title={showAdvanced ? "Collapse advance filters" : "Expand advance filters"}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {showAdvanced ? "Hide Filters" : "Advance Filters"}
          </span>
          <span className="sm:hidden">
            {showAdvanced ? "Hide" : "Filters"}
          </span>
          {filterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-stone-950">
              {filterCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              showAdvanced && "rotate-180"
            )}
          />
        </button>
      </form>

      {/* Minimized State with Active Filters: Show compact badges row */}
      {!showAdvanced && hasAnyFilter && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2.5 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">
            Active:
          </span>

          {currentQ && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
              &quot;{currentQ}&quot;
              <button
                type="button"
                onClick={() => {
                  setQInput("");
                  applyParam("q", null);
                }}
                className="hover:text-emerald-900 dark:hover:text-white cursor-pointer ml-0.5"
                title="Remove keyword"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentCategory !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-medium">
              {currentCategory}
              <button
                type="button"
                onClick={() => applyParam("category", null)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove category"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentBrand !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-medium">
              Brand: {currentBrand}
              <button
                type="button"
                onClick={() => applyParam("brand", null)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove brand"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentNutri !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
              Grade {currentNutri}
              <button
                type="button"
                onClick={() => applyParam("nutriScore", null)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove Nutri-Score"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Protein Filter Badge */}
          {currentProtein !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-medium">
              Protein: {formatRangeLabel(currentProtein)}
              <button
                type="button"
                onClick={() => applyParam("proteinRange", null)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove protein filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Sugar Filter Badge */}
          {currentSugar !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-medium">
              Sugar: {formatRangeLabel(currentSugar)}
              <button
                type="button"
                onClick={() => applyParam("sugarRange", null)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove sugar filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentPalmFree && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-medium">
              Palm Oil Free
              <button
                type="button"
                onClick={() => toggleBooleanParam("hasPalmOil", true)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentLowSugar && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-medium">
              Low Sugar
              <button
                type="button"
                onClick={() => toggleBooleanParam("lowSugar", true)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentLowSodium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-medium">
              Low Sodium
              <button
                type="button"
                onClick={() => toggleBooleanParam("lowSodium", true)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
              Verified Only
              <button
                type="button"
                onClick={() => toggleBooleanParam("verifiedOnly", true)}
                className="hover:text-rose-500 cursor-pointer ml-0.5"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 dark:text-rose-400 font-bold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}

      {/* Expanded State: Reveals Full Filter Deck */}
      {showAdvanced && (
        <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 space-y-4 animate-in fade-in duration-200">
          {/* Row 1: Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => applyParam("category", e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate">
                Brand
              </label>
              <select
                value={currentBrand}
                onChange={(e) => applyParam("brand", e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
              >
                <option value="All">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Nutri-Score Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate">
                Nutri-Score
              </label>
              <select
                value={currentNutri}
                onChange={(e) => applyParam("nutriScore", e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
              >
                <option value="All">All Grades (A-E)</option>
                <option value="A">Grade A (Best)</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
                <option value="E">Grade E (Poor)</option>
              </select>
            </div>

            {/* Protein per 100g Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-sky-500" />
                <span>Protein / 100g</span>
              </label>
              <select
                value={currentProtein}
                onChange={(e) => applyParam("proteinRange", e.target.value)}
                className={cn(
                  "w-full px-2.5 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs",
                  currentProtein !== "All"
                    ? "border-sky-500 ring-1 ring-sky-500/50 bg-sky-50/30 dark:bg-sky-950/30"
                    : "border-stone-200 dark:border-stone-700"
                )}
              >
                <option value="All">All Protein Amounts</option>
                <option value="<10">Less than 10g (&lt;10g)</option>
                <option value="10-20">10g – 20g</option>
                <option value="21-30">21g – 30g</option>
                <option value="30+">30+g (High Protein)</option>
              </select>
            </div>

            {/* Sugar per 100g Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate flex items-center gap-1">
                <Candy className="w-3 h-3 text-amber-500" />
                <span>Sugar / 100g</span>
              </label>
              <select
                value={currentSugar}
                onChange={(e) => applyParam("sugarRange", e.target.value)}
                className={cn(
                  "w-full px-2.5 py-2 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs",
                  currentSugar !== "All"
                    ? "border-amber-500 ring-1 ring-amber-500/50 bg-amber-50/30 dark:bg-amber-950/30"
                    : "border-stone-200 dark:border-stone-700"
                )}
              >
                <option value="All">All Sugar Amounts</option>
                <option value="<10">Less than 10g (&lt;10g)</option>
                <option value="10-20">10g – 20g</option>
                <option value="21-30">21g – 30g</option>
                <option value="30+">30+g (High Sugar)</option>
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-stone-500 dark:text-stone-400 font-semibold truncate flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-stone-400" />
                <span>Sort Products</span>
              </label>
              <select
                value={currentSort}
                onChange={(e) => applyParam("sortBy", e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
              >
                <option value="score">Highest Overall Score</option>
                <option value="recent">Recently Added</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="verified">Verified First</option>
              </select>
            </div>
          </div>

          {/* Row 2: Dietary & Clean-Label Flag Pills */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Dietary & Health Filters
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleBooleanParam("hasPalmOil", currentPalmFree)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentPalmFree
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-xs"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700"
                }`}
              >
                {currentPalmFree && <Check className="w-3.5 h-3.5" />} Palm Oil Free
              </button>

              <button
                type="button"
                onClick={() => toggleBooleanParam("lowSugar", currentLowSugar)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentLowSugar
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-xs"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700"
                }`}
              >
                {currentLowSugar && <Check className="w-3.5 h-3.5" />} Low Sugar (≤5g)
              </button>

              <button
                type="button"
                onClick={() => toggleBooleanParam("lowSodium", currentLowSodium)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentLowSodium
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-xs"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700"
                }`}
              >
                {currentLowSodium && <Check className="w-3.5 h-3.5" />} Low Sodium (≤120mg)
              </button>

              <button
                type="button"
                onClick={() => toggleBooleanParam("verifiedOnly", currentVerified)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentVerified
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-xs"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700"
                }`}
              >
                {currentVerified && <Check className="w-3.5 h-3.5" />} Verified Only
              </button>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-bold cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
