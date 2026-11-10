"use client";

import React from "react";
import {
  Package,
  Layers,
  AlertOctagon,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Archive,
  Copy,
  Plus,
  ExternalLink,
  Tag,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  archivedProducts: number;
  missingImages: number;
  unverifiedImages: number;
  verifiedImages: number;
  incompleteProducts: number;
  potentialDuplicates: number;
  categoryBreakdown: Array<{ name: string; count: number }>;
  subCategoryBreakdown: Array<{ name: string; category: string; count: number }>;
  brandBreakdown: Array<{ name: string; count: number }>;
}

interface ProductManagementDashboardProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigateTab: (tab: string, filter?: any) => void;
  onAddNewProduct: () => void;
}

export function ProductManagementDashboard({
  stats,
  loading,
  onNavigateTab,
  onAddNewProduct,
}: ProductManagementDashboardProps) {
  if (loading && !stats) {
    return (
      <div className="p-12 text-center text-stone-400 animate-pulse text-sm">
        Calculating real-time database catalogue metrics...
      </div>
    );
  }

  const s = stats || {
    totalProducts: 0,
    activeProducts: 0,
    archivedProducts: 0,
    missingImages: 0,
    unverifiedImages: 0,
    verifiedImages: 0,
    incompleteProducts: 0,
    potentialDuplicates: 0,
    categoryBreakdown: [],
    subCategoryBreakdown: [],
    brandBreakdown: [],
  };

  const completenessPercentage = s.totalProducts > 0
    ? Math.round(((s.totalProducts - s.incompleteProducts) / s.totalProducts) * 100)
    : 100;

  const imageVerificationRate = s.totalProducts > 0
    ? Math.round((s.verifiedImages / s.totalProducts) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-900/30">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Catalogue Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100">
            {s.totalProducts} Food Products Monitored
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Real-time synchronization across MongoDB Atlas. Manage classifications, verified packaging photographs, nutrition data, and search discovery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onAddNewProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("products")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Browse Table <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab("products", { status: "active" })}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500">Active Products</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {s.activeProducts}
          </div>
          <span className="text-[10px] text-stone-400">Live in public directory</span>
        </div>

        <div
          onClick={() => onNavigateTab("images", { imageStatus: "MISSING" })}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500">Missing Images</span>
            <ImageIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {s.missingImages}
          </div>
          <span className="text-[10px] text-stone-400">Clean neutral placeholder</span>
        </div>

        <div
          onClick={() => onNavigateTab("images", { imageStatus: "VERIFIED" })}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500">Verified Packshots</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {s.verifiedImages}
          </div>
          <span className="text-[10px] text-stone-400">{imageVerificationRate}% verification rate</span>
        </div>

        <div
          onClick={() => onNavigateTab("duplicates")}
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-rose-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500">Suspected Duplicates</span>
            <Copy className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-500">
            {s.potentialDuplicates}
          </div>
          <span className="text-[10px] text-stone-400">Candidate records for merge</span>
        </div>
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Data Completeness</span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{completenessPercentage}%</span>
        </div>

        <div
          onClick={() => onNavigateTab("products", { status: "archived" })}
          className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Archived Records</span>
          <span className="text-xs font-black text-stone-500">{s.archivedProducts}</span>
        </div>

        <div
          onClick={() => onNavigateTab("products", { dataStatus: "incomplete" })}
          className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Incomplete Records</span>
          <span className="text-xs font-black text-amber-500">{s.incompleteProducts}</span>
        </div>

        <div
          onClick={() => onNavigateTab("categories")}
          className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Categories</span>
          <span className="text-xs font-black text-stone-900 dark:text-stone-100">{s.categoryBreakdown.length}</span>
        </div>
      </div>

      {/* Visual Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                Products by Primary Category
              </h3>
              <p className="text-[11px] text-stone-500">Distribution across FoodDecode taxonomy</p>
            </div>
            <button
              onClick={() => onNavigateTab("categories")}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Manage Categories
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {s.categoryBreakdown.map((cat) => {
              const pct = s.totalProducts > 0 ? Math.round((cat.count / s.totalProducts) * 100) : 0;
              return (
                <div
                  key={cat.name}
                  onClick={() => onNavigateTab("products", { category: cat.name })}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-700 dark:text-stone-200 group-hover:text-emerald-500 transition-colors">
                      {cat.name}
                    </span>
                    <span className="font-mono text-stone-500">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Brands Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-stone-100">
                Top Represented Brands
              </h3>
              <p className="text-[11px] text-stone-500">Highest catalogue density</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {s.brandBreakdown.slice(0, 8).map((b, idx) => (
              <div
                key={b.name}
                onClick={() => onNavigateTab("products", { brand: b.name })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-[10px] text-stone-500">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{b.name}</span>
                </div>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[10px]">
                  {b.count} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

