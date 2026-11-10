"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types";
import { ProductImage } from "../ProductImage";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  Archive,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  Download,
} from "lucide-react";

interface ProductTableProps {
  products: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  categories: Array<{ name: string; subCategories?: string[] }>;
  brands: string[];
  filters: {
    q?: string;
    category?: string;
    subCategory?: string;
    brand?: string;
    imageStatus?: string;
    dataStatus?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  onFilterChange: (newFilters: any) => void;
  onPageChange: (newPage: number) => void;
  onEditProduct: (product: ProductItem) => void;
  onCorrectMapping: (product: ProductItem) => void;
  onArchiveProduct: (id: string) => void;
  onRestoreProduct: (id: string) => void;
  onDeleteProduct: (id: string, name: string) => void;
  onOpenBulkEdit: (selectedIds: string[]) => void;
  onExportSelected: (selectedIds: string[]) => void;
}

export function ProductTable({
  products,
  total,
  page,
  totalPages,
  limit,
  loading,
  categories,
  brands,
  filters,
  onFilterChange,
  onPageChange,
  onEditProduct,
  onCorrectMapping,
  onArchiveProduct,
  onRestoreProduct,
  onDeleteProduct,
  onOpenBulkEdit,
  onExportSelected,
}: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allVisibleIds = products.map((p) => p._id || p.id || p.barcode);
  const isAllSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...allVisibleIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const currentCategoryObj = categories.find((c) => c.name === filters.category);
  const availableSubCategories = currentCategoryObj?.subCategories || [];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search products by name, brand, barcode, flavour, tags..."
              value={filters.q || ""}
              onChange={(e) => onFilterChange({ ...filters, q: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <select
              value={filters.category || "All"}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  category: e.target.value === "All" ? undefined : e.target.value,
                  subCategory: undefined,
                })
              }
              className="px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Subcategory Filter (cascading) */}
            {availableSubCategories.length > 0 && (
              <select
                value={filters.subCategory || "All"}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    subCategory: e.target.value === "All" ? undefined : e.target.value,
                  })
                }
                className="px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold"
              >
                <option value="All">All Subcategories</option>
                {availableSubCategories.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {/* Image Status Filter */}
            <select
              value={filters.imageStatus || "All"}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  imageStatus: e.target.value === "All" ? undefined : e.target.value,
                })
              }
              className="px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold"
            >
              <option value="All">All Image Statuses</option>
              <option value="VERIFIED">Verified Images</option>
              <option value="MISSING">Missing / Placeholders</option>
              <option value="UNCERTAIN">Unverified</option>
            </select>

            {/* Status (Active / Archived) */}
            <select
              value={filters.status || "active"}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold"
            >
              <option value="active">Active Only</option>
              <option value="archived">Archived Only</option>
              <option value="all">All Records</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Pill Bar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-900 dark:bg-emerald-950/80 text-white border border-stone-800 dark:border-emerald-800 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-black text-xs">
              {selectedIds.length}
            </span>
            <span>products selected across table</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenBulkEdit(selectedIds)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Bulk Edit
            </button>
            <button
              type="button"
              onClick={() => onExportSelected(selectedIds)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-stone-400 hover:text-white text-xs px-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5 w-16">Image</th>
                <th className="p-3.5">Product Details</th>
                <th className="p-3.5">Classification</th>
                <th className="p-3.5">Barcode</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-stone-400">
                    Loading catalogue records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-stone-400">
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const id = p._id || p.id || p.barcode;
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors ${
                        isSelected ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(id)}
                          className="cursor-pointer text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="p-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain mx-auto"
                          />
                        </div>
                      </td>

                      {/* Product Name & Brand */}
                      <td className="p-3.5 max-w-xs">
                        <span className="font-bold text-stone-900 dark:text-stone-100 block truncate">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {p.brand}
                          </span>
                          {p.flavour && <span>· {p.flavour}</span>}
                          {p.productType && (
                            <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                              {p.productType}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="p-3.5">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block text-xs">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {p.subCategory || "—"}
                        </span>
                      </td>

                      {/* Barcode */}
                      <td className="p-3.5 font-mono text-[11px] text-stone-600 dark:text-stone-400 font-semibold">
                        {p.barcode}
                      </td>

                      {/* Score */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-stone-900 dark:text-stone-100">
                            {p.overallScore}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-100 dark:bg-stone-800">
                            {p.nutriScore}
                          </span>
                        </div>
                      </td>

                      {/* Verification (Image & Data separated) */}
                      <td className="p-3.5 space-y-1">
                        {p.imageStatus === "VERIFIED" && !p.imageUrl?.includes("placeholder") ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Packshot Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-500">
                            Placeholder Image
                          </span>
                        )}
                        {p.verified && (
                          <span className="block text-[9px] text-stone-500 font-medium">
                            ✓ Data Audited
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {p.isArchived ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                            Archived
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onCorrectMapping(p)}
                            className="p-1.5 text-stone-400 hover:text-emerald-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Correct Product Mapping (Category/Subcategory)"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Edit Full Product Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {p.isArchived ? (
                            <button
                              type="button"
                              onClick={() => onRestoreProduct(id)}
                              className="p-1.5 text-stone-400 hover:text-emerald-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                              title="Restore to Active Directory"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onArchiveProduct(id)}
                              className="p-1.5 text-stone-400 hover:text-amber-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                              title="Archive (Soft Delete)"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(id, p.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-bold text-stone-800 dark:text-stone-200">{products.length}</span> of{" "}
            <span className="font-bold text-stone-800 dark:text-stone-200">{total}</span> products
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Page {page} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

