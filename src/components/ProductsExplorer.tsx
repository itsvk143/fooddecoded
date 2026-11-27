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
  Sparkles,
  Droplets,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Activity,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { prioritizeCategoryThumbnails } from "@/lib/pwa-cache/image-cache";
import { getAllCachedProducts, getCachedProductsByCategory } from "@/lib/pwa-cache/indexed-db";
import { getCategoryHeaderInfo } from "@/lib/category-header-helper";
import { matchesProductCategory } from "@/lib/category-matcher";
import {
  buildCategoryRequestKey,
  categoryCacheManager,
  CategoryPerformanceMetrics,
} from "@/lib/category-cache-manager";

type SortOption = "score" | "score-asc" | "name" | "name-desc" | "recent" | "verified";

function parseSortOption(val?: string | null): SortOption {
  if (
    val === "score" ||
    val === "score-asc" ||
    val === "name" ||
    val === "name-desc" ||
    val === "recent" ||
    val === "verified"
  ) {
    return val;
  }
  return "score";
}

function safePerfNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

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
      categoryCacheManager.invalidate();
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
  const lastInteractionSyncRef = useRef<number>(0);
  useEffect(() => {
    lastInteractionSyncRef.current = Date.now();
  }, []);
  const triggerBackgroundSync = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionSyncRef.current > 6000) {
      lastInteractionSyncRef.current = now;
      mutate();
    }
  }, [mutate]);

  // --- 1. Filter States Initialized from URL params ---
  const [searchQuery, setSearchQuery] = useState(initialParams.q || "");
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
  const [sortBy, setSortBy] = useState<SortOption>(parseSortOption(initialParams.sortBy));

  // Category loading & transition state
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Reliable API Request Management & Smart Category Cache refs
  const requestIdRef = useRef<number>(0);
  const activeRequestReleaseRef = useRef<((abortIfUnused?: boolean) => void) | null>(null);
  const skeletonStartRef = useRef<number | null>(null);

  // Keep stable refs for zero-re-render callback & server-prop diffing
  const productsRef = useRef<SlimProductItem[]>(products);
  const selectedCategoryRef = useRef<string>(selectedCategory);
  const prevInitialParamsRef = useRef({
    category: initialParams.category,
    subCategory: initialParams.subCategory,
    q: initialParams.q,
  });

  const filtersStateRef = useRef<{
    sortBy: SortOption;
    brand: string;
    nutriScore: string;
    novaGroup: string;
    hasPalmOil?: string;
    lowSugar?: boolean;
    lowSodium?: boolean;
    verifiedOnly?: boolean;
    proteinRange: string;
    sugarRange: string;
  }>({
    sortBy,
    brand: selectedBrand,
    nutriScore: selectedNutriScore,
    novaGroup: selectedNovaGroup,
    hasPalmOil: palmOilFreeOnly ? "false" : undefined,
    lowSugar: lowSugarOnly || undefined,
    lowSodium: lowSodiumOnly || undefined,
    verifiedOnly: verifiedOnly || undefined,
    proteinRange,
    sugarRange,
  });

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    filtersStateRef.current = {
      sortBy,
      brand: selectedBrand,
      nutriScore: selectedNutriScore,
      novaGroup: selectedNovaGroup,
      hasPalmOil: palmOilFreeOnly ? "false" : undefined,
      lowSugar: lowSugarOnly || undefined,
      lowSodium: lowSodiumOnly || undefined,
      verifiedOnly: verifiedOnly || undefined,
      proteinRange,
      sugarRange,
    };
  }, [
    sortBy,
    selectedBrand,
    selectedNutriScore,
    selectedNovaGroup,
    palmOilFreeOnly,
    lowSugarOnly,
    lowSodiumOnly,
    verifiedOnly,
    proteinRange,
    sugarRange,
  ]);

  // Controls expandable state: default COLLAPSED (false) per user requirement
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination state (Load 20 at a time in-memory)
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Clean helper to merge freshly fetched category products without duplicating IDs
  const mergeProductsIntoState = useCallback((incoming: SlimProductItem[]) => {
    if (!incoming || incoming.length === 0) return;
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id || p._id || p.barcode));
      const newItems = incoming.filter((p) => {
        const pid = p.id || p._id || p.barcode;
        if (!pid || existingIds.has(pid)) return false;
        existingIds.add(pid);
        return true;
      });
      return newItems.length > 0 ? [...prev, ...newItems] : prev;
    });
  }, []);

  // --- Category API Request with In-Flight Deduplication & Stale Rejection ---
  const fetchCategoryProducts = useCallback(
    async (
      cat: string,
      sub: string,
      reqKey: string,
      expectedReqId: number,
      clickStartMs?: number,
      isBackgroundRefresh: boolean = false
    ) => {
      if (!cat || cat === "All") return;

      // Release previous consumer lease safely (only aborts if 0 other consumers depend on it)
      activeRequestReleaseRef.current?.(true);

      const { promise, release } = categoryCacheManager.acquireRequest(reqKey, async (signal) => {
        const params = new URLSearchParams({
          category: cat,
          limit: "100",
          full: "false",
        });
        if (sub) params.set("subCategory", sub);

        const res = await fetch(`/api/products?${params.toString()}`, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching category products`);
        const data = await res.json();
        return Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];
      });

      activeRequestReleaseRef.current = release;

      try {
        const fetched = await promise;
        const now = Date.now();

        // Populate bounded LRU cache (monotonic guard prevents stale overwrite)
        if (fetched.length > 0) {
          categoryCacheManager.set(reqKey, cat, fetched, now);
        }

        // Enforce: ONLY the latest selected category response can update UI state
        if (expectedReqId === requestIdRef.current) {
          mergeProductsIntoState(fetched);
          if (!isBackgroundRefresh) {
            if (skeletonStartRef.current !== null) {
              categoryCacheManager.recordSkeletonDuration(safePerfNow() - skeletonStartRef.current);
              skeletonStartRef.current = null;
            }
            if (clickStartMs !== undefined) {
              categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStartMs);
            }
          }
          setIsLoadingCategory(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.warn("[Category Fetch] Note:", err instanceof Error ? err.message : err);
        if (expectedReqId === requestIdRef.current) {
          if (skeletonStartRef.current !== null) {
            categoryCacheManager.recordSkeletonDuration(safePerfNow() - skeletonStartRef.current);
            skeletonStartRef.current = null;
          }
          setIsLoadingCategory(false);
        }
      } finally {
        if (activeRequestReleaseRef.current === release) {
          activeRequestReleaseRef.current = null;
        }
      }
    },
    [mergeProductsIntoState]
  );

  // --- Authoritative Category Switch Function ---
  const handleCategorySwitch = useCallback(
    (
      newCategory: string,
      newSubCategory: string = "",
      pushUrl: boolean = true,
      options?: { q?: string; fromDrawer?: boolean }
    ) => {
      const clickStart = safePerfNow();
      const normalizedCat = newCategory || "All";
      const normalizedSub = newSubCategory || "";

      // Cancel active consumer & increment authoritative request identifier
      activeRequestReleaseRef.current?.(true);
      const currentReqId = ++requestIdRef.current;

      // 1. Immediately update authoritative category state & reset pagination
      setSelectedCategory(normalizedCat);
      setSelectedSubCategory(normalizedSub);
      setVisibleCount(20);
      if (options?.fromDrawer) {
        setSearchQuery(options.q ?? "");
      }

      // 2. Synchronize URL query parameter cleanly without full-page reloads
      if (pushUrl && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (options?.fromDrawer) {
          if (options.q) params.set("q", options.q);
          else params.delete("q");
        }
        if (normalizedCat && normalizedCat !== "All") {
          params.set("category", normalizedCat);
        } else {
          params.delete("category");
        }
        if (normalizedSub) {
          params.set("subCategory", normalizedSub);
        } else {
          params.delete("subCategory");
        }
        const qs = params.toString();
        const newUrl = qs ? `/products?${qs}` : "/products";
        if (window.location.pathname + window.location.search !== newUrl) {
          window.history.pushState(null, "", newUrl);
        }
      }

      if (normalizedCat === "All") {
        skeletonStartRef.current = null;
        setIsLoadingCategory(false);
        categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStart);
        return;
      }

      const currentFilterSnapshot = filtersStateRef.current;
      const reqKey = buildCategoryRequestKey({
        category: normalizedCat,
        subCategory: normalizedSub,
        page: 1,
        sortBy: currentFilterSnapshot.sortBy,
        filters: currentFilterSnapshot,
      });

      // 3. Tier 1: Bounded LRU Cache with Freshness (0ms, no redundant API call if fresh)
      const cacheLookup = categoryCacheManager.get(reqKey);
      if (cacheLookup.status === "fresh" && cacheLookup.products.length > 0) {
        categoryCacheManager.recordCacheHit("fresh");
        skeletonStartRef.current = null;
        setIsLoadingCategory(false);
        mergeProductsIntoState(cacheLookup.products);
        categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStart);
        return;
      }

      if (cacheLookup.status === "stale" && cacheLookup.products.length > 0) {
        // Stale-while-revalidate: Display cached products immediately (0ms, no skeletons), refresh quietly
        categoryCacheManager.recordCacheHit("stale");
        skeletonStartRef.current = null;
        setIsLoadingCategory(false);
        mergeProductsIntoState(cacheLookup.products);
        categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStart);
        if (typeof navigator === "undefined" || navigator.onLine) {
          fetchCategoryProducts(normalizedCat, normalizedSub, reqKey, currentReqId, clickStart, true);
        }
        return;
      }

      // 4. Tier 2: Preloaded In-Memory Catalog Index (0ms instant)
      const matchingLocal = productsRef.current.filter((p) =>
        matchesProductCategory(p, normalizedCat, normalizedSub)
      );

      if (matchingLocal.length > 0) {
        categoryCacheManager.recordCacheHit("fresh");
        categoryCacheManager.set(reqKey, normalizedCat, matchingLocal);
        skeletonStartRef.current = null;
        setIsLoadingCategory(false);
        categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStart);
        return;
      }

      // 5. Tier 3 & 4: Usable cached data unavailable -> Show Skeletons immediately & check IndexedDB
      categoryCacheManager.recordCacheMiss();
      skeletonStartRef.current = safePerfNow();
      setIsLoadingCategory(true);

      getCachedProductsByCategory(normalizedCat)
        .then((idbCached) => {
          if (currentReqId !== requestIdRef.current) return;
          const matchedIdb = (idbCached || []).filter((p) =>
            matchesProductCategory(p, normalizedCat, normalizedSub)
          );
          if (matchedIdb.length > 0) {
            categoryCacheManager.set(reqKey, normalizedCat, matchedIdb);
            mergeProductsIntoState(matchedIdb);
            if (skeletonStartRef.current !== null) {
              categoryCacheManager.recordSkeletonDuration(safePerfNow() - skeletonStartRef.current);
              skeletonStartRef.current = null;
            }
            categoryCacheManager.recordClickToFirstContent(safePerfNow() - clickStart);
            setIsLoadingCategory(false);
          }

          if (typeof navigator !== "undefined" && !navigator.onLine) {
            if (skeletonStartRef.current !== null) {
              categoryCacheManager.recordSkeletonDuration(safePerfNow() - skeletonStartRef.current);
              skeletonStartRef.current = null;
            }
            setIsLoadingCategory(false);
            return;
          }

          fetchCategoryProducts(
            normalizedCat,
            normalizedSub,
            reqKey,
            currentReqId,
            clickStart,
            matchedIdb.length > 0
          );
        })
        .catch(() => {
          categoryCacheManager.recordIdbFailure();
          if (currentReqId !== requestIdRef.current) return;
          if (typeof navigator !== "undefined" && !navigator.onLine) {
            setIsLoadingCategory(false);
            return;
          }
          fetchCategoryProducts(normalizedCat, normalizedSub, reqKey, currentReqId, clickStart, false);
        });
    },
    [fetchCategoryProducts, mergeProductsIntoState]
  );

  // Synchronous Custom Event listener (dispatched from LeftDrawer at 0ms latency)
  useEffect(() => {
    const handleCategoryEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.category !== undefined || detail.q !== undefined)) {
        handleCategorySwitch(detail.category || "All", detail.subCategory || "", false, {
          q: detail.q,
          fromDrawer: Boolean(detail.fromDrawer),
        });
      }
    };
    window.addEventListener("fooddecode:category-change", handleCategoryEvent);
    return () => window.removeEventListener("fooddecode:category-change", handleCategoryEvent);
  }, [handleCategorySwitch]);

  // Keep category in sync ONLY when Next.js server-side initialParams prop actually changes
  useEffect(() => {
    const prev = prevInitialParamsRef.current;
    const catChanged = initialParams.category !== prev.category;
    const subChanged = initialParams.subCategory !== prev.subCategory;
    const qChanged = initialParams.q !== prev.q;

    if (catChanged || subChanged) {
      prev.category = initialParams.category;
      prev.subCategory = initialParams.subCategory;
      const incomingCat = initialParams.category || "All";
      const incomingSub = initialParams.subCategory || "";
      if (incomingCat !== selectedCategoryRef.current) {
        handleCategorySwitch(incomingCat, incomingSub, false, {
          q: initialParams.q ?? "",
          fromDrawer: qChanged,
        });
      } else {
        setSelectedSubCategory(incomingSub);
      }
    }

    if (qChanged) {
      prev.q = initialParams.q;
      setSearchQuery(initialParams.q || "");
      setVisibleCount(20);
    }
  }, [initialParams.category, initialParams.subCategory, initialParams.q, handleCategorySwitch]);

  // Handle Browser Back / Forward buttons via popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("q") || "");
      const cat = params.get("category") || "All";
      const sub = params.get("subCategory") || "";
      setSelectedBrand(params.get("brand") || "All");
      setSelectedNutriScore(params.get("nutriScore") || "All");
      setSelectedNovaGroup(params.get("novaGroup") || "All");
      setPalmOilFreeOnly(params.get("hasPalmOil") === "false");
      setLowSugarOnly(params.get("lowSugar") === "true");
      setLowSodiumOnly(params.get("lowSodium") === "true");
      setVerifiedOnly(params.get("verifiedOnly") === "true");
      setProteinRange(params.get("proteinRange") || "All");
      setSugarRange(params.get("sugarRange") || "All");
      setSortBy(parseSortOption(params.get("sortBy")));
      handleCategorySwitch(cat, sub, false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [handleCategorySwitch]);

  // Cleanup active requests & expose read-only performance metrics on unmount/mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as Window & { __FOODDECODE_PERF__?: () => CategoryPerformanceMetrics }).__FOODDECODE_PERF__ =
        () => categoryCacheManager.getMetrics();
    }
    return () => {
      activeRequestReleaseRef.current?.(true);
      activeRequestReleaseRef.current = null;
    };
  }, []);

  // --- 2. URL Synchronization via window.history.replaceState for non-category filters ---
  const updateUrlParams = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
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
    if (window.location.pathname + window.location.search !== newPath) {
      window.history.replaceState(null, "", newPath);
    }
  }, [
    searchQuery,
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
        getCachedProductsByCategory(selectedCategory)
          .then((cached) => {
            if (cached && cached.length > 0) setProducts(cached);
          })
          .catch(() => categoryCacheManager.recordIdbFailure());
      } else {
        getAllCachedProducts()
          .then((cached) => {
            if (cached && cached.length > 0) setProducts(cached);
          })
          .catch(() => categoryCacheManager.recordIdbFailure());
      }
    }
  }, [products.length, selectedCategory]);

  // Trigger silent non-blocking background catalog sync when active filters change
  useEffect(() => {
    triggerBackgroundSync();
  }, [
    searchQuery,
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

  // --- 3. High-Performance Client-Side In-Memory Filtering (0ms perceived lag) ---
  const filteredProducts = useMemo(() => {
    let list = products;

    // 1. Text Search query (from Header Search / URL ?q=...)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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

    // 2 & 3. Category + SubCategory (Canonical alias-safe matcher)
    if ((selectedCategory && selectedCategory !== "All") || selectedSubCategory) {
      list = list.filter((p) =>
        matchesProductCategory(p, selectedCategory, selectedSubCategory)
      );
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

    // 8. Protein Range Filter (supports UI presets & numeric ranges)
    if (proteinRange && proteinRange !== "All") {
      if (proteinRange === "high") {
        list = list.filter((p) => p.proteinPer100g >= 15);
      } else if (proteinRange === "mod") {
        list = list.filter((p) => p.proteinPer100g >= 5 && p.proteinPer100g < 15);
      } else if (proteinRange === "<10") {
        list = list.filter((p) => p.proteinPer100g < 10);
      } else if (proteinRange === "10-20") {
        list = list.filter((p) => p.proteinPer100g >= 10 && p.proteinPer100g < 20);
      } else if (proteinRange === "20-30") {
        list = list.filter((p) => p.proteinPer100g >= 20 && p.proteinPer100g < 30);
      } else if (proteinRange === "30+") {
        list = list.filter((p) => p.proteinPer100g >= 30);
      }
    }

    // 9. Sugar Range Filter (supports UI presets & numeric ranges)
    if (sugarRange && sugarRange !== "All") {
      if (sugarRange === "low" || sugarRange === "<5") {
        list = list.filter((p) => p.sugarPer100g <= 5);
      } else if (sugarRange === "zero") {
        list = list.filter((p) => p.sugarPer100g <= 0.5);
      } else if (sugarRange === "5-15") {
        list = list.filter((p) => p.sugarPer100g > 5 && p.sugarPer100g <= 15);
      } else if (sugarRange === "15-25") {
        list = list.filter((p) => p.sugarPer100g > 15 && p.sugarPer100g <= 25);
      } else if (sugarRange === "25+") {
        list = list.filter((p) => p.sugarPer100g > 25);
      }
    }

    // Deduplicate by canonical product ID before sorting/slicing
    const seenIds = new Set<string>();
    const deduped: SlimProductItem[] = [];
    for (const item of list) {
      const pid = item.id || item._id || item.barcode;
      if (!pid || seenIds.has(pid)) continue;
      seenIds.add(pid);
      deduped.push(item);
    }

    // 10. Sorting
    const sorted = deduped;
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
    searchQuery,
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
    Boolean(searchQuery),
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
    setSearchQuery("");
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

  // Instrument product rendering duration per category / filter frame
  useEffect(() => {
    if (isLoadingCategory || visibleProducts.length === 0) return;
    const renderStart = safePerfNow();
    if (typeof requestAnimationFrame !== "function") return;
    const rafId = requestAnimationFrame(() => {
      categoryCacheManager.recordRenderDuration(safePerfNow() - renderStart);
    });
    return () => cancelAnimationFrame(rafId);
  }, [selectedCategory, selectedSubCategory, isLoadingCategory, visibleProducts.length]);

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

  // Authoritative Category Heading & Description
  const headerInfo = useMemo(() => {
    return getCategoryHeaderInfo(selectedCategory, selectedSubCategory, filteredProducts.length);
  }, [selectedCategory, selectedSubCategory, filteredProducts.length]);

  return (
    <div className="space-y-6">
      {/* Directory Heading — Synchronized with Authoritative selectedCategory */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Searchable Food Database</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
            {headerInfo.title}
          </h1>
          <p className="text-sm text-stone-500 mt-1">{headerInfo.description}</p>
        </div>

        {!isDbConnected && process.env.NODE_ENV !== "production" && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium self-start sm:self-auto shrink-0">
            ⚡ Demo Catalogue Mode · Connect MongoDB Atlas in .env.local to persist changes
          </div>
        )}
      </div>

      {/* 1. Collapsible Control Header: Product Count + Expandable Filters & Sorting Button */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-3 sm:p-4 shadow-2xs transition-all">
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
              "flex items-center justify-between sm:justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-2xs w-full sm:w-auto",
              isControlsExpanded
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            )}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters & Sorting</span>
            </div>

            <div className="flex items-center gap-1.5">
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-stone-950">
                  {activeFilterCount}
                </span>
              )}
              <span className="text-[11px] font-semibold opacity-80">
                {isControlsExpanded ? "Collapse" : "Expand"}
              </span>
              {isControlsExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform" />
              )}
            </div>
          </button>
        </div>

        {/* EXPANDED PANEL: Revealed when isControlsExpanded is true */}
        {isControlsExpanded && (
          <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-stone-800 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-250">
            {/* Row 1: Sort Dropdown (left 65-70%) + Filters Button (right 30-35%) — ALWAYS SINGLE HORIZONTAL ROW */}
            <div className="flex items-center w-full gap-2 sm:gap-2.5">
              {/* Sorting Selector (~68% width) */}
              <div className="relative flex-[68_68_0%] min-w-0 h-11">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(parseSortOption(e.target.value));
                    setVisibleCount(20);
                  }}
                  className="w-full h-full min-h-[44px] pl-2.5 sm:pl-3.5 pr-7 sm:pr-8 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs appearance-none truncate box-border transition-colors"
                  aria-label="Sort products by"
                >
                  <option value="score">FoodDecode Score (High → Low)</option>
                  <option value="score-asc">FoodDecode Score (Low → High)</option>
                  <option value="name">Product Name (A → Z)</option>
                  <option value="name-desc">Product Name (Z → A)</option>
                  <option value="recent">Recently Added</option>
                  <option value="verified">Verified Products First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
              </div>

              {/* Advanced Filters Button (~32% width) */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className={cn(
                  "flex-[32_32_0%] min-w-0 h-11 min-h-[44px] px-2 sm:px-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer border shadow-2xs box-border shrink-0 select-none",
                  showAdvancedFilters
                    ? "bg-emerald-500 text-stone-950 border-emerald-500"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-stone-300"
                )}
                aria-expanded={showAdvancedFilters}
                aria-label="Toggle advanced filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{showAdvancedFilters ? "Hide" : "Filters"}</span>
                {activeFilterCount > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 leading-none",
                      showAdvancedFilters
                        ? "bg-stone-950 text-white"
                        : "bg-emerald-500 text-stone-950"
                    )}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Row 2: Quick Filter Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => {
                  setPalmOilFreeOnly((prev) => !prev);
                  setVisibleCount(20);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer select-none",
                  palmOilFreeOnly
                    ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <Droplets className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Palm Oil Free</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({quickPillCounts.palmFree.toLocaleString()})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLowSugarOnly((prev) => !prev);
                  setVisibleCount(20);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer select-none",
                  lowSugarOnly
                    ? "bg-orange-500/15 border-orange-500 text-orange-800 dark:text-orange-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Low Sugar (≤5g)</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({quickPillCounts.lowSugar.toLocaleString()})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLowSodiumOnly((prev) => !prev);
                  setVisibleCount(20);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer select-none",
                  lowSodiumOnly
                    ? "bg-teal-500/15 border-teal-500 text-teal-800 dark:text-teal-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <Activity className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>Low Sodium (≤120mg)</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({quickPillCounts.lowSodium.toLocaleString()})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerifiedOnly((prev) => !prev);
                  setVisibleCount(20);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer select-none",
                  verifiedOnly
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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
                      handleCategorySwitch(val, "", true);
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
          searchQuery={searchQuery}
          onClearSearch={() => {
            setSearchQuery("");
            setVisibleCount(20);
          }}
          selectedCategory={selectedCategory}
          onClearCategory={() => {
            handleCategorySwitch("All", "", true);
          }}
          selectedSubCategory={selectedSubCategory}
          onClearSubCategory={() => {
            handleCategorySwitch(selectedCategory, "", true);
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

      {/* 3. Product Listing Grid (Clean, Full-Width with Layout-Matched Skeletons & Reduced-Motion Safe Transitions) */}
      <div className="space-y-4">
        {isLoadingCategory ? (
          /* High-Fidelity Skeletons matching ProductCard dimensions 1:1 to eliminate CLS */
          <div
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-pulse"
            aria-busy="true"
            aria-label="Loading category products"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="product-card flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 p-4 bg-white dark:bg-stone-900 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded-md" />
                      <div className="h-2.5 w-24 bg-stone-100 dark:bg-stone-800/60 rounded-md" />
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0" />
                  </div>

                  <div className="w-full h-44 bg-stone-100 dark:bg-stone-800/80 rounded-xl mb-3.5 flex items-center justify-center border border-stone-100 dark:border-stone-700/60">
                    <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-700/60" />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="h-3.5 w-full bg-stone-200 dark:bg-stone-800 rounded-md" />
                    <div className="h-3.5 w-2/3 bg-stone-200 dark:bg-stone-800 rounded-md" />
                  </div>

                  <div className="flex gap-1.5 mt-2.5">
                    <div className="h-5 w-16 bg-stone-100 dark:bg-stone-800 rounded-full" />
                    <div className="h-5 w-20 bg-stone-100 dark:bg-stone-800 rounded-full" />
                  </div>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                  <div className="h-5 w-16 bg-stone-200 dark:bg-stone-800 rounded-lg" />
                  <div className="h-5 w-14 bg-stone-200 dark:bg-stone-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 fd-fade-in">
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 fd-fade-in">
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
