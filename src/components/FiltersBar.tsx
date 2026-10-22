"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowUpDown, Check, RefreshCw } from "lucide-react";

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
  const currentSort = searchParams.get("sortBy") || "recent";
  const currentPalmFree = searchParams.get("hasPalmOil") === "false";
  const currentLowSugar = searchParams.get("lowSugar") === "true";
  const currentLowSodium = searchParams.get("lowSodium") === "true";
  const currentVerified = searchParams.get("verifiedOnly") === "true";

  const [qInput, setQInput] = useState(currentQ);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const hasActiveFilters =
    Boolean(currentQ) ||
    currentCategory !== "All" ||
    currentBrand !== "All" ||
    currentNutri !== "All" ||
    currentPalmFree ||
    currentLowSugar ||
    currentLowSodium ||
    currentVerified;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyParam("q", qInput.trim());
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search by product name, brand, ingredient, or barcode..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
          />
          {qInput && (
            <button
              type="button"
              onClick={() => {
                setQInput("");
                applyParam("q", null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </form>

      {/* Main Selectors Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Category Dropdown */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-stone-400 font-medium">Category:</span>
          <select
            value={currentCategory}
            onChange={(e) => applyParam("category", e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* NutriScore Dropdown */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-stone-400 font-medium">Nutri-Score:</span>
          <select
            value={currentNutri}
            onChange={(e) => applyParam("nutriScore", e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Grades (A-E)</option>
            <option value="A">Grade A (Best)</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="E">Grade E (Poor)</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1 text-xs ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-400 font-medium">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => applyParam("sortBy", e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="score">Highest Score</option>
            <option value="recent">Recently Added</option>
            <option value="name">Product Name (A-Z)</option>
            <option value="verified">Verified First</option>
          </select>
        </div>
      </div>

      {/* Quick Diet & Health Checkbox Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">
          Dietary Filters:
        </span>

        <button
          type="button"
          onClick={() => toggleBooleanParam("hasPalmOil", currentPalmFree)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentPalmFree
              ? "bg-emerald-500 text-white shadow-xs"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
          }`}
        >
          {currentPalmFree && <Check className="w-3 h-3" />} Palm Oil Free
        </button>

        <button
          type="button"
          onClick={() => toggleBooleanParam("lowSugar", currentLowSugar)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentLowSugar
              ? "bg-emerald-500 text-white shadow-xs"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
          }`}
        >
          {currentLowSugar && <Check className="w-3 h-3" />} Low Sugar (≤5g)
        </button>

        <button
          type="button"
          onClick={() => toggleBooleanParam("lowSodium", currentLowSodium)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentLowSodium
              ? "bg-emerald-500 text-white shadow-xs"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
          }`}
        >
          {currentLowSodium && <Check className="w-3 h-3" />} Low Sodium (≤120mg)
        </button>

        <button
          type="button"
          onClick={() => toggleBooleanParam("verifiedOnly", currentVerified)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentVerified
              ? "bg-emerald-500 text-white shadow-xs"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
          }`}
        >
          {currentVerified && <Check className="w-3 h-3" />} Verified Only
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
