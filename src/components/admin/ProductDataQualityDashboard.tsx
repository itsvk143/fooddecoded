"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Layers,
  Search,
  ExternalLink,
  Edit2,
  Save,
  RotateCcw,
  Check,
  Tag,
  Barcode,
  Sparkles,
} from "lucide-react";
import { ProductItem } from "@/types";

interface ProductDataQualityDashboardProps {
  products: ProductItem[];
  adminSecret: string;
  onRefresh: () => void;
  onEditProduct?: (product: ProductItem) => void;
}

type QualityFilter = "ALL" | "MISSING_IMAGE" | "IMAGE_MISMATCH" | "CATEGORY_ISSUE" | "NEEDS_REVIEW";

export function ProductDataQualityDashboard({
  products,
  adminSecret,
  onRefresh,
  onEditProduct,
}: ProductDataQualityDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<QualityFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Compute issue classifications
  const missingImages = products.filter(
    (p) => !p.imageUrl || p.imageUrl.includes("placeholder") || p.imageStatus === "IMAGE_MISSING" || p.imageStatus === "MISSING"
  );

  const imageMismatches = products.filter(
    (p) => p.imageStatus === "IMAGE_MISMATCH" || p.imageStatus === "MISMATCH"
  );

  const categoryIssues = products.filter((p) => {
    const nameLower = (p.name || "").toLowerCase();
    const catLower = (p.category || "").toLowerCase();
    const subLower = (p.subCategory || "").toLowerCase();
    
    // Cookie in Biscuits
    if (nameLower.includes("cookie") && !catLower.includes("ice cream") && subLower === "biscuits") return true;
    // Biscuit in Cookies
    if (nameLower.includes("biscuit") && subLower === "cookies") return true;
    // Chips in Roasted snacks
    if (nameLower.includes("chips") && subLower === "roasted snacks") return true;
    return false;
  });

  const needsReview = products.filter(
    (p) => p.verificationStatus === "NEEDS_REVIEW" || p.imageStatus === "NEEDS_REVIEW" || p.imageStatus === "UNCERTAIN"
  );

  // Filter products based on selected tab and search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "MISSING_IMAGE":
        return !p.imageUrl || p.imageUrl.includes("placeholder") || p.imageStatus === "IMAGE_MISSING" || p.imageStatus === "MISSING";
      case "IMAGE_MISMATCH":
        return p.imageStatus === "IMAGE_MISMATCH" || p.imageStatus === "MISMATCH";
      case "CATEGORY_ISSUE": {
        const nameLower = (p.name || "").toLowerCase();
        const catLower = (p.category || "").toLowerCase();
        const subLower = (p.subCategory || "").toLowerCase();
        return (
          (nameLower.includes("cookie") && !catLower.includes("ice cream") && subLower === "biscuits") ||
          (nameLower.includes("biscuit") && subLower === "cookies") ||
          (nameLower.includes("chips") && subLower === "roasted snacks")
        );
      }
      case "NEEDS_REVIEW":
        return p.verificationStatus === "NEEDS_REVIEW" || p.imageStatus === "NEEDS_REVIEW" || p.imageStatus === "UNCERTAIN";
      case "ALL":
      default:
        return (
          !p.imageUrl ||
          p.imageUrl.includes("placeholder") ||
          p.imageStatus === "IMAGE_MISSING" ||
          p.imageStatus === "MISSING" ||
          p.imageStatus === "IMAGE_MISMATCH" ||
          p.imageStatus === "MISMATCH" ||
          p.verificationStatus === "NEEDS_REVIEW" ||
          p.imageStatus === "NEEDS_REVIEW" ||
          p.imageStatus === "UNCERTAIN"
        );
    }
  });

  // Action handlers
  const handleStartEdit = (product: ProductItem) => {
    setEditingId(product.id || product._id || product.barcode);
    setEditImageUrl(product.imageUrl || "");
    setEditCategory(product.category || "");
    setEditSubCategory(product.subCategory || "");
  };

  const handleSaveInline = async (product: ProductItem) => {
    setSaving(true);
    setStatusMessage(null);
    const prodId = product.id || product._id || product.barcode;

    try {
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminSecret,
        },
        body: JSON.stringify({
          imageUrl: editImageUrl,
          category: editCategory,
          subCategory: editSubCategory,
          imageStatus: editImageUrl && !editImageUrl.includes("placeholder") ? "VERIFIED" : "IMAGE_MISSING",
          imageVerified: Boolean(editImageUrl && !editImageUrl.includes("placeholder")),
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      // Log to audit log
      await fetch("/api/admin/audit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminSecret,
        },
        body: JSON.stringify({
          action: "UPDATE_PRODUCT_DATA_QUALITY",
          targetType: "product",
          targetId: prodId,
          details: `Updated image URL and taxonomy via Data Quality Dashboard for "${product.name}"`,
          changes: {
            imageUrl: { old: product.imageUrl, new: editImageUrl },
            category: { old: product.category, new: editCategory },
            subCategory: { old: product.subCategory, new: editSubCategory },
          },
        }),
      }).catch(() => {});

      setStatusMessage(`Saved updates for "${product.name}"`);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      alert(`Error updating product: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickVerifyImage = async (product: ProductItem, verified: boolean) => {
    const prodId = product.id || product._id || product.barcode;
    try {
      const res = await fetch(`/api/admin/products/${prodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminSecret,
        },
        body: JSON.stringify({
          imageVerified: verified,
          imageStatus: verified ? "VERIFIED" : "IMAGE_MISMATCH",
          verificationStatus: verified ? "FULLY_VERIFIED" : "NEEDS_REVIEW",
        }),
      });

      if (!res.ok) throw new Error("Failed to update verification status");
      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Product Data Quality
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Catalogue-wide data integrity audit, image verification, category mapping, and conflict management.
          </p>
        </div>

        {statusMessage && (
          <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {statusMessage}
          </span>
        )}
      </div>

      {/* KPI Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveFilter("MISSING_IMAGE")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeFilter === "MISSING_IMAGE"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Missing Images</span>
            <ImageIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{missingImages.length}</div>
          <div className="text-[10px] text-stone-400 mt-1">Placeholder or missing image file</div>
        </button>

        <button
          onClick={() => setActiveFilter("IMAGE_MISMATCH")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeFilter === "IMAGE_MISMATCH"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 ring-2 ring-rose-500/20"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Wrong Images</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{imageMismatches.length}</div>
          <div className="text-[10px] text-stone-400 mt-1">Reported image mismatches</div>
        </button>

        <button
          onClick={() => setActiveFilter("CATEGORY_ISSUE")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeFilter === "CATEGORY_ISSUE"
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Category Issues</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{categoryIssues.length}</div>
          <div className="text-[10px] text-stone-400 mt-1">Mismatched category / subcategory</div>
        </button>

        <button
          onClick={() => setActiveFilter("NEEDS_REVIEW")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeFilter === "NEEDS_REVIEW"
              ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500/20"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Manual Review</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{needsReview.length}</div>
          <div className="text-[10px] text-stone-400 mt-1">Pending admin confirmation</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: `All Quality Issues (${filteredProducts.length})` },
            { id: "MISSING_IMAGE", label: `Missing Images (${missingImages.length})` },
            { id: "IMAGE_MISMATCH", label: `Mismatches (${imageMismatches.length})` },
            { id: "CATEGORY_ISSUE", label: `Category Issues (${categoryIssues.length})` },
            { id: "NEEDS_REVIEW", label: `Pending Review (${needsReview.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search quality queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product Identity</th>
                <th className="py-3 px-4">Taxonomy</th>
                <th className="py-3 px-4">Image Status</th>
                <th className="py-3 px-4">Quality Issue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    No quality issues found for the active filter. Catalogue data is fully verified.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const prodId = p.id || p._id || p.barcode;
                  const isEditing = editingId === prodId;
                  const isPlaceholder = !p.imageUrl || p.imageUrl.includes("placeholder");

                  return (
                    <tr key={prodId} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                      {/* Product Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 overflow-hidden flex items-center justify-center p-1">
                            {isPlaceholder ? (
                              <ImageIcon className="w-4 h-4 text-stone-400" />
                            ) : (
                              <img
                                src={p.imageUrl!}
                                alt={p.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block truncate">
                              {p.brand}
                            </span>
                            <div className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-xs" title={p.name}>
                              {p.name}
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                              GTIN: {p.barcode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Taxonomy */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="text-xs px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 w-full"
                              placeholder="Category"
                            />
                            <input
                              type="text"
                              value={editSubCategory}
                              onChange={(e) => setEditSubCategory(e.target.value)}
                              className="text-xs px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 w-full"
                              placeholder="SubCategory"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                              {p.category}
                            </span>
                            <span className="text-stone-500 text-[11px] block">
                              {p.subCategory || "None"}
                            </span>
                            {p.productType && (
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                Type: {p.productType}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Image Status */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="text-xs px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 w-full"
                            placeholder="Image URL (/images/...)"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {p.imageStatus === "VERIFIED" || p.imageVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Verified Image
                              </span>
                            ) : p.imageStatus === "IMAGE_MISMATCH" || p.imageStatus === "MISMATCH" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                <XCircle className="w-3 h-3" /> Image Mismatch
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                <AlertTriangle className="w-3 h-3" /> Missing Packshot
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Quality Issue Type */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {isPlaceholder && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50">
                              Placeholder Image
                            </span>
                          )}
                          {p.subCategory === "Biscuits" && p.name.toLowerCase().includes("cookie") && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50">
                              Cookie in Biscuits
                            </span>
                          )}
                          {p.subCategory === "American Bakery" && p.name.toLowerCase().includes("cookie") && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50">
                              Bakery in Cookies
                            </span>
                          )}
                          {p.imageStatus === "IMAGE_MISMATCH" && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/50">
                              Reported Image Mismatch
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveInline(p)}
                              disabled={saving}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 font-semibold text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(p)}
                              title="Edit Image URL & Category"
                              className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {!isPlaceholder && (
                              <button
                                onClick={() => handleQuickVerifyImage(p, true)}
                                title="Approve Image Verification"
                                className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <a
                              href={`/products/${prodId}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View Public Product Page"
                              className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

