"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  ImageOff,
  FileWarning,
  Layers,
  RefreshCw,
} from "lucide-react";
import type {
  BrandDirectoryResponse,
  BrandDirectoryEntry,
  BrandProductsResponse,
  BrandDirectoryQueryOptions,
} from "@/lib/brand-directory-service";

interface BrandDirectoryViewProps {
  adminKey?: string;
}

export function BrandDirectoryView({ adminKey }: BrandDirectoryViewProps) {
  // Query & Filter state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [productCountRange, setProductCountRange] = useState<
    NonNullable<BrandDirectoryQueryOptions["productCountRange"]>
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [hasIncomplete, setHasIncomplete] = useState(false);
  const [hasMissingImages, setHasMissingImages] = useState(false);
  const [sortBy, setSortBy] = useState<
    NonNullable<BrandDirectoryQueryOptions["sortBy"]>
  >("count_desc");
  const [page, setPage] = useState(1);
  const limit = 25;

  // Data state
  const [data, setData] = useState<BrandDirectoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Expanded brand product drill-down state
  const [expandedBrandKey, setExpandedBrandKey] = useState<string | null>(null);
  const [brandProductsData, setBrandProductsData] = useState<BrandProductsResponse | null>(null);
  const [brandProductsLoading, setBrandProductsLoading] = useState(false);
  const [brandProductSearch, setBrandProductSearch] = useState("");
  const [debouncedBrandProductSearch, setDebouncedBrandProductSearch] = useState("");
  const [brandProductPage, setBrandProductPage] = useState(1);

  // Data integrity active sub-tab
  const [integrityTab, setIntegrityTab] = useState<
    "duplicates" | "missing" | "incorrect" | "multi"
  >("duplicates");

  const directoryReqSeq = useRef(0);
  const productsReqSeq = useRef(0);

  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (adminKey) headers["x-admin-key"] = adminKey;
    return headers;
  }, [adminKey]);

  // Debounce brand search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce product search inside expanded brand
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBrandProductSearch(brandProductSearch.trim());
      setBrandProductPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [brandProductSearch]);

  const fetchBrandDirectory = useCallback(async () => {
    const seq = ++directoryReqSeq.current;
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(page));
      sp.set("limit", String(limit));
      sp.set("sortBy", sortBy);
      if (debouncedQuery) sp.set("q", debouncedQuery);
      if (productCountRange !== "all") sp.set("productCountRange", productCountRange);
      if (categoryFilter && categoryFilter !== "All") sp.set("category", categoryFilter);
      if (hasIncomplete) sp.set("hasIncomplete", "true");
      if (hasMissingImages) sp.set("hasMissingImages", "true");

      const res = await fetch(`/api/admin/brands?${sp.toString()}`, {
        headers: getHeaders(),
        credentials: "same-origin",
      });

      if (seq !== directoryReqSeq.current) return;

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to load Brand Directory (${res.status})`);
      }

      const payload: BrandDirectoryResponse = await res.json();
      if (seq !== directoryReqSeq.current) return;
      setError(null);
      setData(payload);
    } catch (err) {
      if (seq !== directoryReqSeq.current) return;
      setError((err as Error).message || "Unable to load Brand Directory");
    } finally {
      if (seq === directoryReqSeq.current) {
        setLoading(false);
      }
    }
  }, [
    page,
    sortBy,
    debouncedQuery,
    productCountRange,
    categoryFilter,
    hasIncomplete,
    hasMissingImages,
    getHeaders,
  ]);

  useEffect(() => {
    let active = true;
    const seq = ++directoryReqSeq.current;
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(limit));
    sp.set("sortBy", sortBy);
    if (debouncedQuery) sp.set("q", debouncedQuery);
    if (productCountRange !== "all") sp.set("productCountRange", productCountRange);
    if (categoryFilter && categoryFilter !== "All") sp.set("category", categoryFilter);
    if (hasIncomplete) sp.set("hasIncomplete", "true");
    if (hasMissingImages) sp.set("hasMissingImages", "true");

    fetch(`/api/admin/brands?${sp.toString()}`, {
      headers: getHeaders(),
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (!active || seq !== directoryReqSeq.current) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to load Brand Directory (${res.status})`);
        }
        const payload: BrandDirectoryResponse = await res.json();
        if (!active || seq !== directoryReqSeq.current) return;
        setError(null);
        setData(payload);
      })
      .catch((err) => {
        if (!active || seq !== directoryReqSeq.current) return;
        setError((err as Error).message || "Unable to load Brand Directory");
      })
      .finally(() => {
        if (active && seq === directoryReqSeq.current) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    page,
    sortBy,
    debouncedQuery,
    productCountRange,
    categoryFilter,
    hasIncomplete,
    hasMissingImages,
    getHeaders,
  ]);

  useEffect(() => {
    if (!expandedBrandKey) return;
    let active = true;
    const seq = ++productsReqSeq.current;

    const sp = new URLSearchParams();
    sp.set("brand", expandedBrandKey);
    sp.set("page", String(brandProductPage));
    sp.set("limit", "15");
    if (debouncedBrandProductSearch) sp.set("q", debouncedBrandProductSearch);

    fetch(`/api/admin/brands/products?${sp.toString()}`, {
      headers: getHeaders(),
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (!active || seq !== productsReqSeq.current) return;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload: BrandProductsResponse = await res.json();
        if (!active || seq !== productsReqSeq.current) return;
        setBrandProductsData(payload);
      })
      .catch((err) => {
        if (!active || seq !== productsReqSeq.current) return;
        setExportMessage(`Failed loading brand products: ${(err as Error).message}`);
      })
      .finally(() => {
        if (active && seq === productsReqSeq.current) {
          setBrandProductsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [expandedBrandKey, debouncedBrandProductSearch, brandProductPage, getHeaders]);

  const handleToggleBrand = (brandKey: string) => {
    if (expandedBrandKey === brandKey) {
      setExpandedBrandKey(null);
      setBrandProductsData(null);
      return;
    }
    setBrandProductSearch("");
    setDebouncedBrandProductSearch("");
    setBrandProductPage(1);
    setBrandProductsData(null);
    setBrandProductsLoading(true);
    setExpandedBrandKey(brandKey);
  };

  const handleExportCsv = async (
    type: "brands" | "brand_products" | "mapping",
    brand?: string
  ) => {
    try {
      setExportMessage("Generating CSV export...");
      const sp = new URLSearchParams();
      sp.set("type", type);
      if (brand) sp.set("brand", brand);

      const res = await fetch(`/api/admin/brands/export?${sp.toString()}`, {
        headers: getHeaders(),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `fooddecode-brand-${type}.csv`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExportMessage(`Downloaded ${filename}`);
    } catch (err) {
      setExportMessage(`Export failed: ${(err as Error).message}`);
    }
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setDebouncedQuery("");
    setProductCountRange("all");
    setCategoryFilter("All");
    setHasIncomplete(false);
    setHasMissingImages(false);
    setSortBy("count_desc");
    setPage(1);
  };

  const analytics = data?.analytics;
  const integrity = data?.integrity;

  const renderProductStatusBadge = (
    status: "Complete" | "Incomplete" | "Missing" | "verified" | "incomplete" | "under_review"
  ) => {
    if (status === "Complete" || status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3" /> {status === "verified" ? "Verified" : "Complete"}
        </span>
      );
    }
    if (status === "Incomplete" || status === "under_review") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <AlertTriangle className="w-3 h-3" /> {status === "under_review" ? "Review" : "Incomplete"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
        <XCircle className="w-3 h-3" /> {status === "incomplete" ? "Incomplete" : "Missing"}
      </span>
    );
  };

  const renderExpandedProductPanel = (brandKey: string, titleOverride?: string) => (
    <div className="bg-stone-50/90 dark:bg-stone-950/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Brand Product Mapping
          </span>
          <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
            {titleOverride || brandProductsData?.displayName || brandKey} (
            {brandProductsLoading ? "..." : brandProductsData?.total ?? 0} products)
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={brandProductSearch}
              onChange={(e) => setBrandProductSearch(e.target.value)}
              placeholder="Search inside brand..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 w-52 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <button
            type="button"
            onClick={() => handleExportCsv("brand_products", brandKey)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" /> Export Brand CSV
          </button>

          <button
            type="button"
            onClick={() => handleToggleBrand(brandKey)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer hover:bg-stone-200/50 dark:hover:bg-stone-800"
          >
            Close <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {brandProductsLoading && !brandProductsData ? (
        <div className="py-8 text-center text-xs text-stone-500 animate-pulse">
          Loading products mapped to {brandKey}...
        </div>
      ) : (brandProductsData?.products.length ?? 0) === 0 ? (
        <div className="py-8 text-center text-xs text-stone-500">
          No matching products found for this brand query.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-800/50 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subcategory</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Image</th>
                  <th className="py-2.5 px-3">Barcode</th>
                  <th className="py-2.5 px-3">Ingredients Status</th>
                  <th className="py-2.5 px-3">Nutritional Info</th>
                  <th className="py-2.5 px-3">Data Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {brandProductsData?.products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-stone-900 dark:text-stone-100 max-w-[230px]">
                      <div className="truncate" title={prod.name}>
                        {prod.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700 dark:text-stone-300">
                      {prod.category}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 dark:text-stone-400">
                      {prod.subCategory}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-stone-700 dark:text-stone-200">
                      {prod.brand || <span className="text-rose-500 italic">Unbranded</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-contain bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0"
                        />
                        {prod.isMissingImage ? (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            Missing
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {prod.imageStatus === "VERIFIED" ? "Verified" : "Present"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {prod.barcode}
                    </td>
                    <td className="py-2.5 px-3">
                      {renderProductStatusBadge(prod.ingredientsStatus)}
                    </td>
                    <td className="py-2.5 px-3">
                      {renderProductStatusBadge(prod.nutritionStatus)}
                    </td>
                    <td className="py-2.5 px-3">
                      {renderProductStatusBadge(prod.productDataStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {brandProductsData && brandProductsData.totalPages > 1 && (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-stone-500">
                Page {brandProductsData.page} of {brandProductsData.totalPages} (
                {brandProductsData.total} products)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={brandProductsData.page <= 1}
                  onClick={() => setBrandProductPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  disabled={brandProductsData.page >= brandProductsData.totalPages}
                  onClick={() =>
                    setBrandProductPage((p) => Math.min(brandProductsData.totalPages, p + 1))
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 disabled:opacity-40 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header & Exports */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Brand Management & Mapping
          </span>
          <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2 mt-0.5">
            <Building2 className="w-5 h-5 text-emerald-500" />
            Complete Brand Directory
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Dynamic server-side aggregation of every brand in FoodDecode — including 1-product brands, unbranded items, spelling collision detection, and full CSV mapping exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleExportCsv("brands")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export All Brands CSV
          </button>

          <button
            type="button"
            onClick={() => handleExportCsv("mapping")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" /> Export Brand–Product Mapping
          </button>

          <button
            type="button"
            onClick={() => void fetchBrandDirectory()}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            title="Refresh Brand Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="px-4 py-2.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-semibold flex items-center justify-between">
          <span>{exportMessage}</span>
          <button
            type="button"
            onClick={() => setExportMessage(null)}
            className="text-stone-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Brand Analytics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          type="button"
          onClick={() => {
            setProductCountRange("all");
            setPage(1);
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold text-stone-500 block">Total Unique Brands</span>
          <span className="text-xl font-black text-stone-900 dark:text-stone-100">
            {analytics?.totalUniqueBrands ?? "—"}
          </span>
        </button>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <span className="text-[10px] font-bold text-stone-500 block">Mapped Products</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {analytics?.totalProductsMappedToBrands ?? "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setProductCountRange("1");
            setPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            productCountRange === "1"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
          }`}
        >
          <span className="text-[10px] font-bold text-stone-500 block">1 Product</span>
          <span className="text-xl font-black text-stone-900 dark:text-stone-100">
            {analytics?.brandsWith1Product ?? "—"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setProductCountRange("2-5");
            setPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            productCountRange === "2-5"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
          }`}
        >
          <span className="text-[10px] font-bold text-stone-500 block">2–5 Products</span>
          <span className="text-xl font-black text-stone-900 dark:text-stone-100">
            {analytics?.brandsWith2To5Products ?? "—"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setProductCountRange("6-10");
            setPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            productCountRange === "6-10"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
          }`}
        >
          <span className="text-[10px] font-bold text-stone-500 block">6–10 Products</span>
          <span className="text-xl font-black text-stone-900 dark:text-stone-100">
            {analytics?.brandsWith6To10Products ?? "—"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setProductCountRange("10+");
            setPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            productCountRange === "10+"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
          }`}
        >
          <span className="text-[10px] font-bold text-stone-500 block">&gt; 10 Products</span>
          <span className="text-xl font-black text-stone-900 dark:text-stone-100">
            {analytics?.brandsWithOver10Products ?? "—"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleToggleBrand("__UNBRANDED__")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            expandedBrandKey === "__UNBRANDED__"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-rose-500/50"
          }`}
        >
          <span className="text-[10px] font-bold text-stone-500 block">Unbranded Items</span>
          <span className="text-xl font-black text-rose-500">
            {analytics?.unbrandedProductsCount ?? "—"}
          </span>
        </button>
      </div>

      {/* Standalone Expanded Unbranded Panel when selected from Analytics / Integrity */}
      {expandedBrandKey === "__UNBRANDED__" &&
        renderExpandedProductPanel("__UNBRANDED__", "Products Without a Brand Assigned")}

      {/* Search, Filters & Sorting */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by brand name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <select
            value={productCountRange}
            onChange={(e) => {
              setProductCountRange(
                e.target.value as NonNullable<BrandDirectoryQueryOptions["productCountRange"]>
              );
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-100"
          >
            <option value="all">Product Count: All</option>
            <option value="1">1 product</option>
            <option value="2-5">2–5 products</option>
            <option value="6-10">6–10 products</option>
            <option value="10+">More than 10 products</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-100"
          >
            <option value="All">Category: All Categories</option>
            {(data?.availableCategories || []).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(
                e.target.value as NonNullable<BrandDirectoryQueryOptions["sortBy"]>
              );
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-100"
          >
            <option value="count_desc">Sort: Highest Product Count</option>
            <option value="count_asc">Sort: Lowest Product Count</option>
            <option value="name_asc">Sort: Brand Name (A → Z)</option>
            <option value="name_desc">Sort: Brand Name (Z → A)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={hasIncomplete}
                onChange={(e) => {
                  setHasIncomplete(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-stone-300 text-emerald-500 focus:ring-emerald-500"
              />
              <FileWarning className="w-3.5 h-3.5 text-amber-500" />
              Brands with incomplete products
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={hasMissingImages}
                onChange={(e) => {
                  setHasMissingImages(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-stone-300 text-emerald-500 focus:ring-emerald-500"
              />
              <ImageOff className="w-3.5 h-3.5 text-rose-500" />
              Brands with missing product images
            </label>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-800 dark:text-stone-200">{data?.brands.length ?? 0}</strong> of{" "}
              <strong className="text-stone-800 dark:text-stone-200">{data?.total ?? 0}</strong> matching brands
            </span>
            {(debouncedQuery ||
              productCountRange !== "all" ||
              categoryFilter !== "All" ||
              hasIncomplete ||
              hasMissingImages ||
              sortBy !== "count_desc") && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Complete Brand Directory Table */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4 w-16">S.No.</th>
                <th className="py-3.5 px-4">Brand Name</th>
                <th className="py-3.5 px-4">Total Products</th>
                <th className="py-3.5 px-4">Categories</th>
                <th className="py-3.5 px-4">Missing Images</th>
                <th className="py-3.5 px-4">Data Completeness</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {loading && !data ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 animate-pulse">
                    Running brand aggregation pipeline...
                  </td>
                </tr>
              ) : (data?.brands.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No brands matched your current filters.
                  </td>
                </tr>
              ) : (
                data?.brands.map((brand: BrandDirectoryEntry, idx: number) => {
                  const sNo = (data.page - 1) * data.limit + idx + 1;
                  const isExpanded = expandedBrandKey === brand.normalizedBrand;
                  return (
                    <React.Fragment key={brand.normalizedBrand}>
                      <tr
                        className={`hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors ${
                          isExpanded ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-stone-500">{sNo}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {brand.displayName}
                          </div>
                          {brand.hasCaseOrWhitespaceVariants && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                              {brand.variants.length} spelling variants:{" "}
                              {brand.variants.map((v) => `"${v.name}" (${v.count})`).join(", ")}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px]">
                            <Package className="w-3 h-3" /> {brand.totalProducts}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[260px]">
                          <div className="flex flex-wrap gap-1">
                            {brand.categories.slice(0, 3).map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium"
                              >
                                {cat}
                              </span>
                            ))}
                            {brand.categories.length > 3 && (
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px] font-bold">
                                +{brand.categories.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {brand.missingImages > 0 ? (
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                              {brand.missingImages} missing
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              0 missing
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  brand.dataCompleteness >= 80
                                    ? "bg-emerald-500"
                                    : brand.dataCompleteness >= 60
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${Math.min(100, brand.dataCompleteness)}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
                              {brand.dataCompleteness}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleBrand(brand.normalizedBrand)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                              isExpanded
                                ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                                : "bg-stone-100 dark:bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 text-stone-800 dark:text-stone-200"
                            }`}
                          >
                            {isExpanded ? (
                              <>
                                Hide Products <ChevronUp className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                View Products <ChevronDown className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-3 bg-stone-50/40 dark:bg-stone-950/30">
                            {renderExpandedProductPanel(brand.normalizedBrand, brand.displayName)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Directory Server-Side Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-stone-500">
              Page <strong>{data.page}</strong> of <strong>{data.totalPages}</strong> · Total{" "}
              <strong>{data.total}</strong> unique brands
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 disabled:opacity-40 cursor-pointer font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 disabled:opacity-40 cursor-pointer font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Brand Data Integrity Audit Section (Read-Only) */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Brand Data Integrity Review
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Read-only audit surfacing suspected brand spelling collisions, missing brand fields, placeholder brands, and multi-brand entries. No records are automatically merged or modified.
            </p>
          </div>
          {analytics?.highestProductBrand && analytics?.lowestProductBrand && (
            <div className="text-[11px] text-stone-500 flex flex-wrap gap-3">
              <span>
                Highest: <strong className="text-stone-800 dark:text-stone-200">{analytics.highestProductBrand.name}</strong> ({analytics.highestProductBrand.count})
              </span>
              <span>
                Lowest: <strong className="text-stone-800 dark:text-stone-200">{analytics.lowestProductBrand.name}</strong> ({analytics.lowestProductBrand.count})
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            {
              id: "duplicates",
              label: `Suspected Spelling Collisions (${integrity?.duplicateSpellingGroups.length ?? 0})`,
            },
            {
              id: "missing",
              label: `Missing Brand Field (${integrity?.missingBrandCount ?? 0})`,
            },
            {
              id: "incorrect",
              label: `Suspected Incorrect Brands (${integrity?.incorrectBrandCount ?? 0})`,
            },
            {
              id: "multi",
              label: `Multi-Brand Assignments (${integrity?.multiBrandCount ?? 0})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setIntegrityTab(tab.id as "duplicates" | "missing" | "incorrect" | "multi")
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                integrityTab === tab.id
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {integrityTab === "duplicates" && (
          <div className="space-y-2.5">
            {(integrity?.duplicateSpellingGroups.length ?? 0) === 0 ? (
              <p className="text-xs text-stone-500 py-4">
                No suspected duplicate brand spellings detected.
              </p>
            ) : (
              integrity?.duplicateSpellingGroups.map((grp) => (
                <div
                  key={grp.canonicalKey}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">
                      {grp.reason} ({grp.totalAffectedProducts} total products)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {grp.brands.map((b) => (
                        <button
                          key={`${grp.canonicalKey}-${b.displayName}`}
                          type="button"
                          onClick={() => handleToggleBrand(b.normalizedBrand)}
                          className="px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold hover:border-emerald-500 cursor-pointer"
                        >
                          {b.displayName} ({b.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {integrityTab === "missing" && (
          <div className="space-y-3">
            {(integrity?.missingBrandCount ?? 0) === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 py-4 font-semibold">
                All products in the database have a non-empty brand assigned.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Showing up to 25 of {integrity?.missingBrandCount} products missing a brand.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleBrand("__UNBRANDED__")}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold cursor-pointer"
                  >
                    Inspect All Unbranded Products
                  </button>
                </div>
                <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 dark:bg-stone-800 text-[10px] uppercase text-stone-500">
                      <tr>
                        <th className="py-2 px-3">Product Name</th>
                        <th className="py-2 px-3">Barcode</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3">Issue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {integrity?.missingBrandSamples.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-3 font-semibold">{item.name}</td>
                          <td className="py-2 px-3 font-mono">{item.barcode}</td>
                          <td className="py-2 px-3">{item.category}</td>
                          <td className="py-2 px-3 text-rose-500">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {integrityTab === "incorrect" && (
          <div className="space-y-2">
            {(integrity?.incorrectBrandSamples.length ?? 0) === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 py-4 font-semibold">
                No placeholder or malformed brand assignments detected.
              </p>
            ) : (
              <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800 text-[10px] uppercase text-stone-500">
                    <tr>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">Assigned Brand</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Flag Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {integrity?.incorrectBrandSamples.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3 font-semibold">{item.name}</td>
                        <td className="py-2 px-3 font-mono text-amber-600">{item.brand}</td>
                        <td className="py-2 px-3">{item.category}</td>
                        <td className="py-2 px-3 text-stone-500">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {integrityTab === "multi" && (
          <div className="space-y-2">
            {(integrity?.multiBrandSamples.length ?? 0) === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 py-4 font-semibold">
                No products detected with multiple brands assigned.
              </p>
            ) : (
              <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800 text-[10px] uppercase text-stone-500">
                    <tr>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">Assigned Brand Value</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Detection Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {integrity?.multiBrandSamples.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3 font-semibold">{item.name}</td>
                        <td className="py-2 px-3 font-mono text-amber-600">{item.brand}</td>
                        <td className="py-2 px-3">{item.category}</td>
                        <td className="py-2 px-3 text-stone-500">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
