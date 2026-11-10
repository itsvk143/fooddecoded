"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types";
import { ProductImage } from "../ProductImage";
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react";

interface ProductMappingModalProps {
  product: ProductItem | null;
  categories: Array<{ name: string; subCategories?: string[] }>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mappingData: {
    id: string;
    category: string;
    subCategory: string;
    productType?: string;
    brand?: string;
    flavour?: string;
    searchTags?: string[];
    reason?: string;
  }) => Promise<void>;
}

export function ProductMappingModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductMappingModalProps) {
  if (!isOpen || !product) return null;

  const [category, setCategory] = useState(product.category);
  const [subCategory, setSubCategory] = useState(product.subCategory || "");
  const [productType, setProductType] = useState(product.productType || "");
  const [brand, setBrand] = useState(product.brand);
  const [flavour, setFlavour] = useState(product.flavour || "");
  const [tagInput, setTagInput] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>(product.searchTags || []);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCatObj = categories.find((c) => c.name === category);
  const availableSubCategories = selectedCatObj?.subCategories || [];

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !searchTags.includes(t)) {
      setSearchTags([...searchTags, t]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSearchTags(searchTags.filter((t) => t !== tagToRemove));
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const catObj = categories.find((c) => c.name === newCat);
    const subs = catObj?.subCategories || [];
    // Reset or auto-select first subcategory
    setSubCategory(subs[0] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        id: product._id || product.id || product.barcode,
        category,
        subCategory,
        productType,
        brand,
        flavour,
        searchTags,
        reason,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update product mapping");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-50">
                Correct Product Mapping
              </h3>
              <p className="text-xs text-stone-500">
                Fix taxonomy misclassifications (e.g., cookies miscategorized as chocolate)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          {/* Product Header Card */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-1 flex items-center justify-center shrink-0">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <span className="font-mono text-[10px] text-stone-400">Barcode: {product.barcode}</span>
              <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">{product.name}</h4>
              <span className="text-stone-500">By {product.brand}</span>
            </div>
          </div>

          {/* Before & After Comparison Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Mapping */}
            <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Current Mapping
              </span>
              <div>
                <span className="text-stone-400 block text-[10px]">Category:</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">{product.category}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Subcategory:</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">{product.subCategory || "—"}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Product Type:</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">{product.productType || "—"}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Flavour:</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">{product.flavour || "—"}</span>
              </div>
            </div>

            {/* Proposed Mapping (Live Preview) */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                Corrected Mapping Preview
              </span>
              <div>
                <span className="text-stone-400 block text-[10px]">Category:</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">{category}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Subcategory:</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">{subCategory || "—"}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Product Type:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{productType || "—"}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Flavour:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{flavour || "—"}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Subcategory *
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                >
                  {availableSubCategories.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  {/* Allow custom entry if needed */}
                  <option value={subCategory}>{subCategory} (Current)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Product Type (e.g. Cookie, Wafer, Soda)
                </label>
                <input
                  type="text"
                  value={productType}
                  placeholder="e.g. Cookie"
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Flavour / Variant
                </label>
                <input
                  type="text"
                  value={flavour}
                  placeholder="e.g. Chocolate Chip"
                  onChange={(e) => setFlavour(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
            </div>

            {/* Search Tags (Representation vs Category rule) */}
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Search Discovery Tags
              </label>
              <p className="text-[11px] text-stone-500 mb-2">
                Tags help users discover products (e.g. searching "Chocolate" will find this cookie without making it a chocolate bar).
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add search keyword..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 font-bold cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {searchTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-stone-400 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Audit Reason */}
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Reason for Correction (Recorded in Audit History)
              </label>
              <input
                type="text"
                placeholder="e.g. Fixed chocolate-chip cookie incorrectly categorized under chocolate bar aisle"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
            >
              {saving ? "Applying Mapping..." : "Confirm & Save Mapping"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

