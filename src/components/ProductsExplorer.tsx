"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SearchableCombobox, ComboboxOption } from "@/components/SearchableCombobox";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { SlimProductItem, ProductItem } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Sparkles,
  Droplets,
  Flame,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Activity,
  HeartHandshake
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsExplorerProps {
  initialProducts: SlimProductItem[];
  categories: string[];
  brands: string[];
  initialParams?: Record<string, string | undefined>;
  isDbConnected?: boolean;
}

export function ProductsExplorer({
  initialProducts,
  categories,
  brands,
  initialParams = {},
  isDbConnected = true,
}: ProductsExplorerProps) {
  // --- 1. Filter States Initialized from URL params ---
  const [searchInput, setSearchInput] = useState(initialParams.q || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || "All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialParams.subCategory || "");
  const [selectedBrand, setSelectedBrand] = useState(initialParams.brand || "All");
  const [selectedNutriScore, setSelectedNutriScore] = useState(initialParams.nutriScore || "All");
  const [selectedNovaGroup, setSelectedNovaGroup] = useState(initialParams.novaGroup || "All");
  const [palmOilFreeOnly, setPalmOilFreeOnly] = useState(initialParams.hasPalmOil === "false");
  const [lowSugarOnly, setLowSugarOnly] = useState(initialParams.lowSugar === "true");
  const [lowSodiumOnly, setLowSodiumOnly] = useState(initialParams.lowSodium === "true");
  const [verifiedOnly, setVerifiedOnly] = useState(initialParams.verifiedOnly === "true");
  const [proteinRange, setProteinRange] = useState(initialParams.proteinRange || "All");
  const [sugarRange, setSugarRange] = useState(initialParams.sugarRange || "All");
  const [sortBy, setSortBy] = useState<"score" | "name" | "recent" | "verified">(
    (initialParams.sortBy as any) || "score"
  );

  // Pagination state (Load 20 at a time in-memory)
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Mobile collapsed filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- 2. Live Debounced Search (150ms) ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
      setVisibleCount(20); // Reset page on search change
    }, 150);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Flush search on Enter / Form Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchInput.trim());
    setVisibleCount(20);
  };

  // --- 3. URL Synchronization via window.history.replaceState (0ms lag, no server round-trip) ---
  const updateUrlParams = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();

    if (debouncedQuery) params.set("q", debouncedQuery);
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedSubCategory) params.set("subCategory", selectedSubCategory);
    if (selectedBrand && selectedBrand !== "All") params.set("brand", selectedBrand);
    if (selectedNutriScore && selectedNutriScore !== "All") params.set("nutriScore", selectedNutriScore);
    if (selectedNovaGroup && selectedNovaGroup !== "All") params.set("novaGroup", selectedNovaGroup);
    if (palmOilFreeOnly) params.set("hasPalmOil", "false");
    if (lowSugarOnly) params.set("lowSugar", "true");
    if (lowSodiumOnly) params.set("lowSodium", "true");
    if (verifiedOnly) params.set("verifiedOnly", "true");
    if (proteinRange && proteinRange !== "All") params.set("proteinRange", proteinRange);
    if (sugarRange && sugarRange !== "All") params.set("sugarRange", sugarRange);
    if (sortBy && sortBy !== "score") params.set("sortBy", sortBy);

    const queryString = params.toString();
    const newPath = queryString ? `/products?${queryString}` : "/products";
    window.history.replaceState(null, "", newPath);
  }, [
    debouncedQuery,
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedNutriScore,
    selectedNovaGroup,
    palmOilFreeOnly,
    lowSugarOnly,
    lowSodiumOnly,
    verifiedOnly,
    proteinRange,
    sugarRange,
    sortBy,
  ]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  // Handle Browser Back / Forward buttons via popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchInput(params.get("q") || "");
      setDebouncedQuery(params.get("q") || "");
      setSelectedCategory(params.get("category") || "All");
      setSelectedSubCategory(params.get("subCategory") || "");
      setSelectedBrand(params.get("brand") || "All");
      setSelectedNutriScore(params.get("nutriScore") || "All");
      setSelectedNovaGroup(params.get("novaGroup") || "All");
      setPalmOilFreeOnly(params.get("hasPalmOil") === "false");
      setLowSugarOnly(params.get("lowSugar") === "true");
      setLowSodiumOnly(params.get("lowSodium") === "true");
      setVerifiedOnly(params.get("verifiedOnly") === "true");
      setProteinRange(params.get("proteinRange") || "All");
      setSugarRange(params.get("sugarRange") || "All");
      setSortBy((params.get("sortBy") as any) || "score");
      setVisibleCount(20);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // --- 4. High-Performance Client-Side In-Memory Filtering (0ms perceived lag) ---
  const filteredProducts = useMemo(() => {
    let list = initialProducts;

    // 1. Text Search query
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const sub = (p.subCategory || "").toLowerCase();
        const barcode = p.barcode || "";
        return (
          name.includes(q) ||
          brand.includes(q) ||
          cat.includes(q) ||
          sub.includes(q) ||
          barcode === q
        );
      });
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase();
      list = list.filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        const pSlug = (p.categorySlug || "").toLowerCase();
        return pCat === catLower || pSlug === catLower;
      });
    }

    // 3. SubCategory (Aisle) Filter
    if (selectedSubCategory) {
      const subLower = selectedSubCategory.toLowerCase();
      list = list.filter((p) => (p.subCategory || "").toLowerCase() === subLower);
    }

    // 4. Brand Filter
    if (selectedBrand && selectedBrand !== "All") {
      const brandLower = selectedBrand.toLowerCase();
      list = list.filter((p) => (p.brand || "").toLowerCase() === brandLower);
    }

    // 5. Nutri-Score Filter
    if (selectedNutriScore && selectedNutriScore !== "All") {
      list = list.filter((p) => p.nutriScore === selectedNutriScore);
    }

    // 6. NOVA Group Filter
    if (selectedNovaGroup && selectedNovaGroup !== "All") {
      const novaNum = Number(selectedNovaGroup);
      list = list.filter((p) => p.novaGroup === novaNum);
    }

    // 7. Dietary & Health Pills
    if (palmOilFreeOnly) {
      list = list.filter((p) => p.isPalmOilFree);
    }

    if (lowSugarOnly) {
      list = list.filter((p) => p.sugarPer100g <= 5);
    }

    if (lowSodiumOnly) {
      list = list.filter((p) => p.sodiumPer100g <= 120);
    }

    if (verifiedOnly) {
      list = list.filter((p) => p.isVerified);
    }

    // 8. Protein Range Filter
    if (proteinRange && proteinRange !== "All") {
      if (proteinRange === "<10") {
        list = list.filter((p) => p.proteinPer100g < 10);
      } else if (proteinRange === "10-20") {
        list = list.filter((p) => p.proteinPer100g >= 10 && p.proteinPer100g < 20);
      } else if (proteinRange === "20-30") {
        list = list.filter((p) => p.proteinPer100g >= 20 && p.proteinPer100g < 30);
      } else if (proteinRange === "30+") {
        list = list.filter((p) => p.proteinPer100g >= 30);
      }
    }

    // 9. Sugar Range Filter
    if (sugarRange && sugarRange !== "All") {
      if (sugarRange === "<5") {
        list = list.filter((p) => p.sugarPer100g <= 5);
      } else if (sugarRange === "5-15") {
        list = list.filter((p) => p.sugarPer100g > 5 && p.sugarPer100g <= 15);
      } else if (sugarRange === "15-25") {
        list = list.filter((p) => p.sugarPer100g > 15 && p.sugarPer100g <= 25);
      } else if (sugarRange === "25+") {
        list = list.filter((p) => p.sugarPer100g > 25);
      }
    }

    // 10. Sorting
    const sorted = [...list];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "verified") {
      sorted.sort(
        (a, b) =>
          (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.overallScore - a.overallScore
      );
    } else {
      // Default: FoodDecode overall score descending
      sorted.sort((a, b) => b.overallScore - a.overallScore);
    }

    return sorted;
  }, [
    initialProducts,
    debouncedQuery,
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedNutriScore,
    selectedNovaGroup,
    palmOilFreeOnly,
    lowSugarOnly,
    lowSodiumOnly,
    verifiedOnly,
    proteinRange,
    sugarRange,
    sortBy,
  ]);

  // Dynamic Product Counts for Category & Brand Options
  const { categoryOptions, brandOptions, quickPillCounts } = useMemo(() => {
    const catMap: Record<string, number> = {};
    const brandMap: Record<string, number> = {};
    let palmFree = 0;
    let lowSugar = 0;
    let lowSodium = 0;
    let verified = 0;

    for (const p of initialProducts) {
      if (p.category) catMap[p.category] = (catMap[p.category] || 0) + 1;
      if (p.brand) brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      if (p.isPalmOilFree) palmFree++;
      if (p.sugarPer100g <= 5) lowSugar++;
      if (p.sodiumPer100g <= 120) lowSodium++;
      if (p.isVerified) verified++;
    }

    const catOpts: ComboboxOption[] = categories.map((cat) => ({
      value: cat,
      label: cat,
      count: catMap[cat] || 0,
    }));

    const brandOpts: ComboboxOption[] = brands.map((b) => ({
      value: b,
      label: b,
      count: brandMap[b] || 0,
    }));

    return {
      categoryOptions: catOpts,
      brandOptions: brandOpts,
      quickPillCounts: {
        palmFree,
        lowSugar,
        lowSodium,
        verified,
      },
    };
  }, [initialProducts, categories, brands]);

  // Active filter count for badge
  const activeFilterCount = [
    Boolean(debouncedQuery),
    selectedCategory !== "All",
    Boolean(selectedSubCategory),
    selectedBrand !== "All",
    selectedNutriScore !== "All",
    selectedNovaGroup !== "All",
    palmOilFreeOnly,
    lowSugarOnly,
    lowSodiumOnly,
    verifiedOnly,
    proteinRange !== "All",
    sugarRange !== "All",
    sortBy !== "score",
  ].filter(Boolean).length;

  // Clear all filters
  const handleClearAll = () => {
    setSearchInput("");
    setDebouncedQuery("");
    setSelectedCategory("All");
    setSelectedSubCategory("");
    setSelectedBrand("All");
    setSelectedNutriScore("All");
    setSelectedNovaGroup("All");
    setPalmOilFreeOnly(false);
    setLowSugarOnly(false);
    setLowSodiumOnly(false);
    setVerifiedOnly(false);
    setProteinRange("All");
    setSugarRange("All");
    setSortBy("score");
    setVisibleCount(20);
  };

  // Visible sliced products
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length));
  }, [filteredProducts.length]);

  // IntersectionObserver for seamless infinite scrolling
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // Category Title
  const categoryHeaderTitle = useMemo(() => {
    if (selectedCategory && selectedCategory !== "All") {
      return `Explore ${selectedCategory}`;
    }
    return "Explore Food Products";
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Top Mobile Bar: Search + Filter Toggle + Horizontal Pills */}
      <div className="lg:hidden space-y-3">
        {/* Search input + Filter button */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search food, brands, or barcode..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 shadow-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedQuery("");
                  setVisibleCount(20);
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
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-2xl transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={cn(
              "px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border shadow-xs",
              mobileFiltersOpen || activeFilterCount > 0
                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-stone-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </form>

        {/* Quick Horizontal Scrollable Row of Dietary Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setPalmOilFreeOnly(!palmOilFreeOnly)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
              palmOilFreeOnly
                ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 shadow-xs"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300"
            )}
          >
            <Droplets className="w-3 h-3 text-amber-500" />
            <span>Palm Oil Free</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({quickPillCounts.palmFree.toLocaleString()})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLowSugarOnly(!lowSugarOnly)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
              lowSugarOnly
                ? "bg-orange-500/15 border-orange-500 text-orange-800 dark:text-orange-300 shadow-xs"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300"
            )}
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span>Low Sugar</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({quickPillCounts.lowSugar.toLocaleString()})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLowSodiumOnly(!lowSodiumOnly)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
              lowSodiumOnly
                ? "bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-300 shadow-xs"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300"
            )}
          >
            <Activity className="w-3 h-3 text-teal-500" />
            <span>Low Sodium</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({quickPillCounts.lowSodium.toLocaleString()})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
              verifiedOnly
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300"
            )}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Verified Only</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({quickPillCounts.verified.toLocaleString()})
            </span>
          </button>
        </div>

        {/* Mobile Filter Sheet Dropdown */}
        {mobileFiltersOpen && (
          <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Filter Products
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <SearchableCombobox
              label="Category"
              placeholder="Filter by category..."
              value={selectedCategory}
              options={categoryOptions}
              onChange={(val) => {
                setSelectedCategory(val);
                setSelectedSubCategory("");
                setVisibleCount(20);
              }}
            />

            <SearchableCombobox
              label="Brand"
              placeholder="Search 100+ brands..."
              value={selectedBrand}
              options={brandOptions}
              onChange={(val) => {
                setSelectedBrand(val);
                setVisibleCount(20);
              }}
            />

            {/* Nutri-Score Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                Nutri-Score
              </label>
              <div className="grid grid-cols-6 gap-1">
                {["All", "A", "B", "C", "D", "E"].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      setSelectedNutriScore(grade);
                      setVisibleCount(20);
                    }}
                    className={cn(
                      "py-1.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer",
                      selectedNutriScore === grade
                        ? "bg-emerald-500 text-stone-950 border-emerald-500 shadow-xs"
                        : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setVisibleCount(20);
                }}
                className="w-full px-3 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200"
              >
                <option value="score">Highest FoodDecode Score</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="recent">Recently Added</option>
                <option value="verified">Verified Products First</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-xs"
            >
              Apply & Close Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout on Desktop */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">
        {/* Sticky Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-5 p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Filters
              </span>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Desktop Search Input with Debounce & Clear */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
              Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Product, brand, barcode..."
                className="w-full pl-8.5 pr-8 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedQuery("");
                    setVisibleCount(20);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Searchable Combobox for Category */}
          <SearchableCombobox
            label="Category"
            placeholder="Search category..."
            value={selectedCategory}
            options={categoryOptions}
            onChange={(val) => {
              setSelectedCategory(val);
              setSelectedSubCategory("");
              setVisibleCount(20);
            }}
          />

          {/* Searchable Combobox for Brand */}
          <SearchableCombobox
            label="Brand"
            placeholder="Search 100+ brands..."
            value={selectedBrand}
            options={brandOptions}
            onChange={(val) => {
              setSelectedBrand(val);
              setVisibleCount(20);
            }}
          />

          {/* Nutri-Score Grade Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
              Nutri-Score Grade
            </label>
            <div className="grid grid-cols-6 gap-1">
              {["All", "A", "B", "C", "D", "E"].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    setSelectedNutriScore(grade);
                    setVisibleCount(20);
                  }}
                  className={cn(
                    "py-1.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer",
                    selectedNutriScore === grade
                      ? "bg-emerald-500 text-stone-950 border-emerald-500 shadow-xs"
                      : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                  )}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary & Health Pills */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
              Dietary & Health
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setPalmOilFreeOnly(!palmOilFreeOnly)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  palmOilFreeOnly
                    ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-amber-500" />
                  <span>Palm Oil Free</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {quickPillCounts.palmFree.toLocaleString()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLowSugarOnly(!lowSugarOnly)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  lowSugarOnly
                    ? "bg-orange-500/15 border-orange-500 text-orange-800 dark:text-orange-300"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Low Sugar (≤5g)</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {quickPillCounts.lowSugar.toLocaleString()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLowSodiumOnly(!lowSodiumOnly)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  lowSodiumOnly
                    ? "bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-300"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-500" />
                  <span>Low Sodium (≤120mg)</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {quickPillCounts.lowSodium.toLocaleString()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  verifiedOnly
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Only</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {quickPillCounts.verified.toLocaleString()}
                </span>
              </button>
            </div>
          </div>

          {/* Protein & Sugar Ranges */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                Protein / 100g
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "All", label: "Any" },
                  { id: "<10", label: "< 10g" },
                  { id: "10-20", label: "10–20g" },
                  { id: "20-30", label: "20–30g" },
                  { id: "30+", label: "30+g" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setProteinRange(item.id);
                      setVisibleCount(20);
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer",
                      proteinRange === item.id
                        ? "bg-sky-500/15 border-sky-500 text-sky-800 dark:text-sky-300 font-bold"
                        : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                Sugar / 100g
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "All", label: "Any" },
                  { id: "<5", label: "< 5g" },
                  { id: "5-15", label: "5–15g" },
                  { id: "15-25", label: "15–25g" },
                  { id: "25+", label: "25+g" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSugarRange(item.id);
                      setVisibleCount(20);
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer",
                      sugarRange === item.id
                        ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 font-bold"
                        : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Column: Active Chips + Product Grid + Instant Pagination */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Top Bar above Product Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200/80 dark:border-stone-800">
            <div>
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Showing{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.min(visibleCount, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {filteredProducts.length.toLocaleString()}
                </span>{" "}
                products matching criteria
              </p>
            </div>

            {/* Sort Selector on Desktop */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setVisibleCount(20);
                  }}
                  className="pl-3 pr-8 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
                >
                  <option value="score">FoodDecode Score (High → Low)</option>
                  <option value="name">Product Name (A → Z)</option>
                  <option value="recent">Recently Added</option>
                  <option value="verified">Verified Products First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          <ActiveFilterChips
            searchQuery={debouncedQuery}
            onClearSearch={() => {
              setSearchInput("");
              setDebouncedQuery("");
              setVisibleCount(20);
            }}
            selectedCategory={selectedCategory}
            onClearCategory={() => {
              setSelectedCategory("All");
              setSelectedSubCategory("");
              setVisibleCount(20);
            }}
            selectedSubCategory={selectedSubCategory}
            onClearSubCategory={() => {
              setSelectedSubCategory("");
              setVisibleCount(20);
            }}
            selectedBrand={selectedBrand}
            onClearBrand={() => {
              setSelectedBrand("All");
              setVisibleCount(20);
            }}
            selectedNutriScore={selectedNutriScore}
            onClearNutriScore={() => {
              setSelectedNutriScore("All");
              setVisibleCount(20);
            }}
            selectedNovaGroup={selectedNovaGroup}
            onClearNovaGroup={() => {
              setSelectedNovaGroup("All");
              setVisibleCount(20);
            }}
            palmOilFree={palmOilFreeOnly}
            onTogglePalmOilFree={() => setPalmOilFreeOnly(false)}
            lowSugar={lowSugarOnly}
            onToggleLowSugar={() => setLowSugarOnly(false)}
            lowSodium={lowSodiumOnly}
            onToggleLowSodium={() => setLowSodiumOnly(false)}
            verifiedOnly={verifiedOnly}
            onToggleVerifiedOnly={() => setVerifiedOnly(false)}
            proteinRange={proteinRange}
            onClearProteinRange={() => setProteinRange("All")}
            sugarRange={sugarRange}
            onClearSugarRange={() => setSugarRange("All")}
            onClearAll={handleClearAll}
          />

          {/* Product Grid */}
          {visibleProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                No products match your active filters
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try loosening your filters, selecting a different brand or category, or clearing the search term.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {visibleProducts.map((p, index) => (
                <ProductCard
                  key={p.id || p._id || p.barcode}
                  product={p as unknown as ProductItem}
                  priority={index < 4}
                />
              ))}
            </div>
          )}

          {/* Load More Button and Infinite Scroll Sentinel */}
          {hasMore && (
            <div className="pt-6 pb-12 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={loadMore}
                className="px-6 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all border border-stone-200 dark:border-stone-700 shadow-xs cursor-pointer"
              >
                Load More Products ({filteredProducts.length - visibleCount} remaining)
              </button>
              <div ref={sentinelRef} className="h-4 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
