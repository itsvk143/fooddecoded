"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import useSWR from "swr";
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
  ChevronUp,
  RotateCcw,
  Activity,
  HeartHandshake,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { prioritizeCategoryThumbnails } from "@/lib/pwa-cache/image-cache";
import { getAllCachedProducts, getCachedProductsByCategory } from "@/lib/pwa-cache/indexed-db";

const catalogFetcher = async (url: string): Promise<SlimProductItem[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch product catalog");
  return res.json();
};

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
  // --- 0. SWR Optimistic State with Background Sync ---
  const [products, setProducts] = useState<SlimProductItem[]>(initialProducts);
  const [syncToast, setSyncToast] = useState<{ visible: boolean; count: number } | null>(null);

  // Fingerprint ref to track whether background catalog actually changed
  const lastFingerprintRef = useRef<string>(
    `${initialProducts.length}:${initialProducts[0]?.id || initialProducts[0]?._id || ""}:${
      initialProducts[initialProducts.length - 1]?.id || initialProducts[initialProducts.length - 1]?._id || ""
    }`
  );

  // SWR background revalidation hook with 0ms fallback hydration
  const { data: remoteCatalog, isValidating, mutate } = useSWR<SlimProductItem[]>(
    "/api/products/index",
    catalogFetcher,
    {
      fallbackData: initialProducts,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
    }
  );

  // Seamlessly swap in-memory products when remote catalog data updates
  useEffect(() => {
    if (!remoteCatalog || !Array.isArray(remoteCatalog) || remoteCatalog.length === 0) return;

    const newFingerprint = `${remoteCatalog.length}:${remoteCatalog[0]?.id || remoteCatalog[0]?._id || ""}:${
      remoteCatalog[remoteCatalog.length - 1]?.id || remoteCatalog[remoteCatalog.length - 1]?._id || ""
    }`;

    if (newFingerprint !== lastFingerprintRef.current) {
      lastFingerprintRef.current = newFingerprint;
      setProducts(remoteCatalog);
      setSyncToast({
        visible: true,
        count: remoteCatalog.length,
      });
      const timer = setTimeout(() => {
        setSyncToast((prev) => (prev ? { ...prev, visible: false } : null));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [remoteCatalog]);

  // Non-blocking background sync trigger on user interactions (throttled to at most once per 6s)
  const lastInteractionSyncRef = useRef<number>(Date.now());
  const triggerBackgroundSync = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionSyncRef.current > 6000) {
      lastInteractionSyncRef.current = now;
      mutate();
    }
  }, [mutate]);

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
  const [sortBy, setSortBy] = useState<
    "score" | "score-asc" | "name" | "name-desc" | "recent" | "verified"
  >((initialParams.sortBy as any) || "score");

  // Controls expandable state: default COLLAPSED (false) per user requirement
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination state (Load 20 at a time in-memory)
  const [visibleCount, setVisibleCount] = useState<number>(20);

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

  // Prioritize caching thumbnails of the currently selected category
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      prioritizeCategoryThumbnails(selectedCategory);
    }
  }, [selectedCategory]);

  // Offline fallback: If offline and products list is empty, read from IndexedDB
  useEffect(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine && products.length === 0) {
      if (selectedCategory && selectedCategory !== "All") {
        getCachedProductsByCategory(selectedCategory).then((cached) => {
          if (cached && cached.length > 0) setProducts(cached);
        });
      } else {
        getAllCachedProducts().then((cached) => {
          if (cached && cached.length > 0) setProducts(cached);
        });
      }
    }
  }, [products.length, selectedCategory]);

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

  // Trigger silent non-blocking background catalog sync when active filters change
  useEffect(() => {
    triggerBackgroundSync();
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
    triggerBackgroundSync,
  ]);

  // --- 4. High-Performance Client-Side In-Memory Filtering (0ms perceived lag) ---
  const filteredProducts = useMemo(() => {
    let list = products;

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
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "score-asc") {
      sorted.sort((a, b) => a.overallScore - b.overallScore);
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
      // Default: FoodDecode overall score descending (High -> Low)
      sorted.sort((a, b) => b.overallScore - a.overallScore);
    }

    return sorted;
  }, [
    products,
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

    for (const p of products) {
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
  }, [products, categories, brands]);

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
      {/* 1. Collapsible Control Header: Product Count + Expandable Search & Filter Button */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-3.5 sm:p-4 shadow-2xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Product Count & Status Indicator */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              Showing{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {Math.min(visibleCount, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {filteredProducts.length.toLocaleString()}
              </span>{" "}
              products
            </span>

            {isValidating ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Syncing...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Instant 0ms</span>
              </span>
            )}
          </div>

          {/* Expand / Collapse Control Button */}
          <button
            type="button"
            onClick={() => setIsControlsExpanded((prev) => !prev)}
            aria-expanded={isControlsExpanded}
            className={cn(
              "flex items-center justify-between sm:justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-2xs",
              isControlsExpanded
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            )}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {isControlsExpanded ? "Hide Search & Filters" : "Search & Filter Products"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-stone-950">
                  {activeFilterCount}
                </span>
              )}
              {isControlsExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform" />
              )}
            </div>
          </button>
        </div>

        {/* When Collapsed AND filters are active: Show Active Filter Mini-Summary */}
        {!isControlsExpanded && activeFilterCount > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-400">Active:</span>
              {debouncedQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  "{debouncedQuery}"
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                  {selectedCategory}
                </span>
              )}
              {selectedBrand !== "All" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {selectedBrand}
                </span>
              )}
              {selectedNutriScore !== "All" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Nutri-Score {selectedNutriScore}
                </span>
              )}
              {palmOilFreeOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                  Palm Oil Free
                </span>
              )}
              {lowSugarOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300">
                  Low Sugar
                </span>
              )}
              {lowSodiumOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                  Low Sodium
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                  Verified
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}

        {/* EXPANDED PANEL: Revealed when isControlsExpanded is true */}
        {isControlsExpanded && (
          <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-stone-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Row 1: Search Bar + Advance Filters Toggle + Sorting Dropdown */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              {/* Search input with Clear & Submit */}
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search food, brands, or barcode..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 shadow-2xs"
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
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-2xl transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  Search
                </button>
              </form>

              {/* Advanced Filters Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className={cn(
                  "px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 border shadow-2xs",
                  showAdvancedFilters
                    ? "bg-emerald-500 text-stone-950 border-emerald-500"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-stone-300"
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvancedFilters ? "Hide Filters" : "Filters"}</span>
                {activeFilterCount > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-black",
                      showAdvancedFilters
                        ? "bg-stone-950 text-white"
                        : "bg-emerald-500 text-stone-950"
                    )}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-stone-400 font-medium hidden sm:inline">Sort:</span>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setVisibleCount(20);
                    }}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs appearance-none"
                  >
                    <option value="score">FoodDecode Score (High → Low)</option>
                    <option value="score-asc">FoodDecode Score (Low → High)</option>
                    <option value="name">Product Name (A → Z)</option>
                    <option value="name-desc">Product Name (Z → A)</option>
                    <option value="recent">Recently Added</option>
                    <option value="verified">Verified Products First</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setPalmOilFreeOnly(!palmOilFreeOnly)}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                  palmOilFreeOnly
                    ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
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
                    ? "bg-orange-500/15 border-orange-500 text-orange-800 dark:text-orange-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <Flame className="w-3 h-3 text-orange-500" />
                <span>Low Sugar (≤5g)</span>
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
                    ? "bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <Activity className="w-3 h-3 text-teal-500" />
                <span>Low Sodium (≤120mg)</span>
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
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Verified Only</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({quickPillCounts.verified.toLocaleString()})
                </span>
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-auto shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Row 3: Advanced Filter Panel (Category, Brand, Nutri-Score, NOVA, Protein, Sugar) */}
            {showAdvancedFilters && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SearchableCombobox
                    label="Category"
                    placeholder="All Categories"
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Nutri-Score */}
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
                              ? "bg-emerald-500 text-stone-950 border-emerald-500 shadow-2xs"
                              : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                          )}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* NOVA Group */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                      NOVA Food Processing
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {["All", "1", "2", "3", "4"].map((nova) => (
                        <button
                          key={nova}
                          type="button"
                          onClick={() => {
                            setSelectedNovaGroup(nova);
                            setVisibleCount(20);
                          }}
                          className={cn(
                            "py-1.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer",
                            selectedNovaGroup === nova
                              ? "bg-emerald-500 text-stone-950 border-emerald-500 shadow-2xs"
                              : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300"
                          )}
                        >
                          {nova === "All" ? "All" : `G${nova}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Protein */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                      Protein / 100g
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "All", label: "All" },
                        { id: "high", label: "High (≥15g)" },
                        { id: "mod", label: "Mod (5-15g)" },
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
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                              : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sugar */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                      Sugar / 100g
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "All", label: "All" },
                        { id: "low", label: "Low (≤5g)" },
                        { id: "zero", label: "Zero (≤0.5g)" },
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
                              : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Active Filter Chips Bar (Shown when controls are expanded and any filters are active) */}
      {isControlsExpanded && (
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
      )}

      {/* 3. Product Listing Grid (Clean, Full-Width) */}
      <div className="space-y-4">
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


      {/* Subtle non-blocking background catalog sync toast */}
      {syncToast?.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/90 dark:bg-stone-800/95 text-white shadow-xl backdrop-blur-md border border-stone-700/60 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">
            Catalog synced in background ({syncToast.count.toLocaleString()} products active)
          </span>
          <button
            onClick={() => setSyncToast((prev) => (prev ? { ...prev, visible: false } : null))}
            className="p-1 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white cursor-pointer ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
