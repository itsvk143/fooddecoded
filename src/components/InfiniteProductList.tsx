"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { SearchX, AlertCircle, RotateCcw, CheckCircle2 } from "lucide-react";

interface InfiniteProductListProps {
  initialProducts: ProductItem[];
  total: number;
  initialHasMore: boolean;
  searchParams: Record<string, string | undefined>;
}

export function InfiniteProductList({
  initialProducts,
  total,
  initialHasMore,
  searchParams,
}: InfiniteProductListProps) {
  // 1. Two-Tiered State: Visible Products (rendered) & Prefetched Buffer (in-memory queue)
  const [visibleProducts, setVisibleProducts] = useState<ProductItem[]>(initialProducts);
  const [prefetchedBuffer, setPrefetchedBuffer] = useState<ProductItem[]>([]);
  const [nextPage, setNextPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isFetchingDirect, setIsFetchingDirect] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(total);

  // References to guarantee single-request execution and race-condition prevention
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPrefetchingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(initialHasMore);
  const nextPageRef = useRef<number>(2);
  const bufferRef = useRef<ProductItem[]>([]);
  const seenIdsRef = useRef<Set<string>>(
    new Set(initialProducts.map((p) => p.id || p._id || p.barcode))
  );

  // Keep refs synchronized with state
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);

  useEffect(() => {
    bufferRef.current = prefetchedBuffer;
  }, [prefetchedBuffer]);

  // Serialized params key for cache and change detection
  const paramsKey = JSON.stringify(searchParams);
  const cacheKey = `fooddecode_state_${paramsKey}`;

  // Helper for background scheduling (requestIdleCallback with setTimeout fallback)
  const scheduleBackground = useCallback((cb: () => void) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as any).requestIdleCallback(cb, { timeout: 300 });
    } else {
      setTimeout(cb, 100);
    }
  }, []);

  // Restore scroll and state on mount if returning from a product detail page
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          setVisibleProducts(parsed.products);
          seenIdsRef.current = new Set(
            parsed.products.map((p: ProductItem) => p.id || p._id || p.barcode)
          );
          setNextPage(parsed.nextPage || (parsed.page ? parsed.page + 1 : 2));
          setHasMore(Boolean(parsed.hasMore));
          setTotalCount(parsed.totalCount || total);

          // Restore scroll position instantly
          if (typeof parsed.scrollY === "number") {
            setTimeout(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: "instant" as ScrollBehavior });
            }, 50);
          }
        }
      }
    } catch {
      // Ignore sessionStorage access errors
    }
  }, [cacheKey, total]);

  // Save state before navigating away
  useEffect(() => {
    const handleScrollOrNavigate = () => {
      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            products: visibleProducts,
            nextPage,
            hasMore,
            totalCount,
            scrollY: window.scrollY,
          })
        );
      } catch {
        // Storage quota exceeded or disabled
      }
    };

    window.addEventListener("scroll", handleScrollOrNavigate, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollOrNavigate);
    };
  }, [cacheKey, visibleProducts, nextPage, hasMore, totalCount]);

  // 2. Predictive Prefetch: Fetch next batch silently into prefetchedBuffer
  const prefetchNextBatch = useCallback(async () => {
    if (
      isPrefetchingRef.current ||
      !hasMoreRef.current ||
      bufferRef.current.length > 0
    ) {
      return;
    }

    isPrefetchingRef.current = true;
    const pageToFetch = nextPageRef.current;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const query = new URLSearchParams();
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v !== undefined && v !== "" && k !== "page" && k !== "limit") {
          query.set(k, v);
        }
      });
      query.set("page", pageToFetch.toString());
      query.set("limit", "24");

      const response = await fetch(`/api/products?${query.toString()}`, {
        signal: controller.signal,
        priority: "low",
      } as RequestInit);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const newItems: ProductItem[] = data.products || [];

      // Filter out any duplicates against currently visible or seen items
      const uniqueItems = newItems.filter((p) => {
        const id = p.id || p._id || p.barcode;
        return !seenIdsRef.current.has(id);
      });

      setPrefetchedBuffer(uniqueItems);
      setNextPage(pageToFetch + 1);

      const moreAvailable =
        data.hasMore !== undefined
          ? Boolean(data.hasMore)
          : pageToFetch < (data.totalPages || 1);
      setHasMore(moreAvailable);

      if (typeof data.total === "number") {
        setTotalCount(data.total);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("[InfiniteProductList] Predictive prefetch warning:", err.message);
      }
    } finally {
      isPrefetchingRef.current = false;
    }
  }, [searchParams]);

  // 3. Instant Buffer Flush: Appends buffer with 0ms latency and schedules next prefetch
  const flushBuffer = useCallback(() => {
    const buffered = bufferRef.current;
    if (buffered.length === 0) return;

    // Append buffered items to visible state
    setVisibleProducts((prev) => {
      const filtered = buffered.filter((p) => {
        const id = p.id || p._id || p.barcode;
        if (seenIdsRef.current.has(id)) return false;
        seenIdsRef.current.add(id);
        return true;
      });
      return [...prev, ...filtered];
    });

    // Clear buffer in state and ref
    setPrefetchedBuffer([]);
    bufferRef.current = [];

    // Immediately schedule background fetch for the following page
    scheduleBackground(() => {
      prefetchNextBatch();
    });
  }, [prefetchNextBatch, scheduleBackground]);

  // Direct fetch fallback if user scrolls faster than network prefetch
  const fetchAndAppendDirectly = useCallback(async () => {
    if (isPrefetchingRef.current || !hasMoreRef.current) return;

    setIsFetchingDirect(true);
    isPrefetchingRef.current = true;
    setError(null);

    const pageToFetch = nextPageRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const query = new URLSearchParams();
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v !== undefined && v !== "" && k !== "page" && k !== "limit") {
          query.set(k, v);
        }
      });
      query.set("page", pageToFetch.toString());
      query.set("limit", "24");

      const response = await fetch(`/api/products?${query.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const newItems: ProductItem[] = data.products || [];

      setVisibleProducts((prev) => {
        const uniqueItems = newItems.filter((p) => {
          const id = p.id || p._id || p.barcode;
          if (seenIdsRef.current.has(id)) return false;
          seenIdsRef.current.add(id);
          return true;
        });
        return [...prev, ...uniqueItems];
      });

      setNextPage(pageToFetch + 1);
      const moreAvailable =
        data.hasMore !== undefined
          ? Boolean(data.hasMore)
          : pageToFetch < (data.totalPages || 1);
      setHasMore(moreAvailable);

      if (typeof data.total === "number") {
        setTotalCount(data.total);
      }

      // Schedule subsequent background prefetch
      scheduleBackground(() => {
        prefetchNextBatch();
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("[InfiniteProductList] Direct load failed:", err);
        setError(err.message || "Network error loading additional products");
      }
    } finally {
      isPrefetchingRef.current = false;
      setIsFetchingDirect(false);
    }
  }, [searchParams, prefetchNextBatch, scheduleBackground]);

  // Synchronize on searchParams change & immediately prefetch page 2
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setVisibleProducts(initialProducts);
    setPrefetchedBuffer([]);
    bufferRef.current = [];
    setNextPage(2);
    nextPageRef.current = 2;
    setHasMore(initialHasMore);
    hasMoreRef.current = initialHasMore;
    setIsFetchingDirect(false);
    setError(null);
    setTotalCount(total);
    isPrefetchingRef.current = false;
    seenIdsRef.current = new Set(
      initialProducts.map((p) => p.id || p._id || p.barcode)
    );

    // Silently prefetch the second batch immediately after initial render
    if (initialHasMore) {
      scheduleBackground(() => {
        prefetchNextBatch();
      });
    }
  }, [paramsKey, initialProducts, initialHasMore, total, prefetchNextBatch, scheduleBackground]);

  // 4. Sentinel IntersectionObserver (~1200px ahead of the bottom)
  useEffect(() => {
    if (!hasMore || error) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (bufferRef.current.length > 0) {
            // Buffer ready -> 0ms instantaneous render
            flushBuffer();
          } else if (hasMoreRef.current && !isPrefetchingRef.current) {
            // Buffer not yet ready -> fetch directly
            fetchAndAppendDirectly();
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 1200px 0px", // Trigger ~2-3 rows BEFORE the user hits the bottom
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, error, flushBuffer, fetchAndAppendDirectly]);

  // If buffer populates while user is already intersecting sentinel, flush immediately
  useEffect(() => {
    if (prefetchedBuffer.length > 0) {
      const sentinel = sentinelRef.current;
      if (sentinel) {
        const rect = sentinel.getBoundingClientRect();
        // If sentinel is within 1200px of viewport bottom
        if (rect.top <= window.innerHeight + 1200) {
          flushBuffer();
        }
      }
    }
  }, [prefetchedBuffer, flushBuffer]);

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id || product._id || product.barcode}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>

          {/* Sentinel element placed at the bottom with 1200px prefetch rootMargin */}
          <div ref={sentinelRef} className="h-6 w-full pointer-events-none" aria-hidden="true" />

          {/* Subtle low-profile loading indicator only if network is slower than fast scroll */}
          {isFetchingDirect && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Updating directory...</span>
              </div>
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && !isFetchingDirect && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs my-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={fetchAndAppendDirectly}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Clean End of Catalogue State: No obtrusive spinners or trailing placeholders */}
          {!hasMore && (
            <div className="py-8 text-center border-t border-stone-200/70 dark:border-stone-800/70 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 text-xs font-semibold shadow-2xs border border-stone-200/50 dark:border-stone-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  All {visibleProducts.length} verified products loaded
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty Search State */
        <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            No products matched your search
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing dietary filters, or submit a new unlisted product to our catalogue.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/products"
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              Reset Filters
            </Link>
            <Link
              href="/submit"
              className="px-4 py-2 bg-emerald-500 text-stone-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors"
            >
              Submit New Product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfiniteProductList;
