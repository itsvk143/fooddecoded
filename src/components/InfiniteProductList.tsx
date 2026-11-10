"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { SearchX, Loader2, AlertCircle, RotateCcw, CheckCircle2 } from "lucide-react";

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
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(total);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  // Serialized params key for change detection
  const paramsKey = JSON.stringify(searchParams);
  const cacheKey = `fooddecode_state_${paramsKey}`;

  // Restore scroll and state on mount if returning from a product detail page
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          setProducts(parsed.products);
          setPage(parsed.page || 1);
          setHasMore(Boolean(parsed.hasMore));
          setTotalCount(parsed.totalCount || total);

          // Restore scroll position smoothly
          if (typeof parsed.scrollY === "number") {
            setTimeout(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: "instant" as ScrollBehavior });
            }, 50);
          }
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [cacheKey, total]);

  // Save state before navigating to product detail
  useEffect(() => {
    const handleScrollOrNavigate = () => {
      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            products,
            page,
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
  }, [cacheKey, products, page, hasMore, totalCount]);

  // Synchronize with server-rendered initial state when search parameters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialHasMore);
    setIsLoadingMore(false);
    setError(null);
    setTotalCount(total);
    isLoadingRef.current = false;
  }, [paramsKey, initialProducts, initialHasMore, total]);

  // Fetch the next batch of products
  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    const nextPage = page + 1;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const query = new URLSearchParams();
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v !== undefined && v !== "" && k !== "page") {
          query.set(k, v);
        }
      });
      query.set("page", nextPage.toString());
      query.set("limit", "20");

      const response = await fetch(`/api/products?${query.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const newItems: ProductItem[] = data.products || [];

      setProducts((prev) => {
        const seenIds = new Set(prev.map((p) => p.id || p._id || p.barcode));
        const filtered = newItems.filter((p) => !seenIds.has(p.id || p._id || p.barcode));
        return [...prev, ...filtered];
      });

      setPage(nextPage);
      const moreAvailable =
        data.hasMore !== undefined
          ? Boolean(data.hasMore)
          : nextPage < (data.totalPages || 1);
      setHasMore(moreAvailable);
      if (typeof data.total === "number") {
        setTotalCount(data.total);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("[InfiniteProductList] Failed to load more products:", err);
        setError(err.message || "Network error loading additional products");
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [page, hasMore, searchParams]);

  // Set up IntersectionObserver on the sentinel element
  useEffect(() => {
    if (!hasMore || isLoadingMore || error) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px", // Pre-fetch before user hits the very bottom
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, error, loadMore]);

  // Retry loading the next batch without losing previously loaded items
  const handleRetry = () => {
    setError(null);
    loadMore();
  };

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id || product._id || product.barcode} product={product} />
            ))}
          </div>

          {/* Sentinel element for infinite scroll */}
          <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

          {/* Loading More Spinner */}
          {isLoadingMore && (
            <div className="flex flex-col items-center justify-center py-8 gap-2.5">
              <div className="w-8 h-8 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Loading more products...
              </span>
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && !isLoadingMore && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs my-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* End of Catalogue Message */}
          {!hasMore && !isLoadingMore && (
            <div className="py-10 text-center border-t border-stone-200/70 dark:border-stone-800/70 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 text-xs font-semibold shadow-2xs border border-stone-200/50 dark:border-stone-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  You&apos;ve reached the end of the product list · All {products.length} products loaded
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

