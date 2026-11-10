"use client";

import React, { useState } from "react";
import { Layers, X, AlertTriangle, CheckCircle2 } from "lucide-react";

interface BulkEditModalProps {
  selectedIds: string[];
  categories: Array<{ name: string; subCategories?: string[] }>;
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: {
    ids: string[];
    action?: "update" | "archive" | "restore" | "delete";
    category?: string;
    subCategory?: string;
    brand?: string;
    productType?: string;
    addSearchTags?: string[];
    removeSearchTags?: string[];
    isArchived?: boolean;
  }) => Promise<void>;
}

export function BulkEditModal({
  selectedIds,
  categories,
  isOpen,
  onClose,
  onApply,
}: BulkEditModalProps) {
  if (!isOpen) return null;

  const [operationType, setOperationType] = useState<"classification" | "tags" | "status" | "delete">("classification");
  const [targetCategory, setTargetCategory] = useState<string>("NO_CHANGE");
  const [targetSubCategory, setTargetSubCategory] = useState<string>("NO_CHANGE");
  const [targetBrand, setTargetBrand] = useState("");
  const [targetProductType, setTargetProductType] = useState("");

  const [tagsToAdd, setTagsToAdd] = useState("");
  const [tagsToRemove, setTagsToRemove] = useState("");

  const [statusAction, setStatusAction] = useState<"archive" | "restore">("archive");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCatObj = categories.find((c) => c.name === targetCategory);
  const availableSubs = selectedCatObj?.subCategories || [];

  const handleCategoryChange = (val: string) => {
    setTargetCategory(val);
    if (val === "NO_CHANGE") {
      setTargetSubCategory("NO_CHANGE");
    } else {
      const catObj = categories.find((c) => c.name === val);
      setTargetSubCategory(catObj?.subCategories?.[0] || "");
    }
  };

  const handleExecute = async () => {
    setSaving(true);
    setError(null);

    try {
      if (operationType === "delete") {
        if (!confirmDelete) {
          setError("Please check the confirmation box to authorize bulk permanent deletion.");
          setSaving(false);
          return;
        }
        await onApply({ ids: selectedIds, action: "delete" });
        onClose();
        return;
      }

      if (operationType === "status") {
        await onApply({
          ids: selectedIds,
          action: statusAction,
        });
        onClose();
        return;
      }

      if (operationType === "classification") {
        await onApply({
          ids: selectedIds,
          category: targetCategory !== "NO_CHANGE" ? targetCategory : undefined,
          subCategory: targetSubCategory !== "NO_CHANGE" ? targetSubCategory : undefined,
          brand: targetBrand.trim() || undefined,
          productType: targetProductType.trim() || undefined,
        });
        onClose();
        return;
      }

      if (operationType === "tags") {
        const toAdd = tagsToAdd
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const toRemove = tagsToRemove
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        await onApply({
          ids: selectedIds,
          addSearchTags: toAdd.length > 0 ? toAdd : undefined,
          removeSearchTags: toRemove.length > 0 ? toRemove : undefined,
        });
        onClose();
        return;
      }
    } catch (err: any) {
      setError(err.message || "Bulk operation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-stone-900 dark:text-stone-50">
              Bulk Product Management
            </h3>
            <p className="text-xs text-stone-500">
              Applying changes to <span className="font-bold text-emerald-500">{selectedIds.length}</span> selected products
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operation Picker */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 px-6 pt-3 gap-2 overflow-x-auto text-xs">
          {[
            { id: "classification", label: "Change Category / Brand" },
            { id: "tags", label: "Add / Remove Tags" },
            { id: "status", label: "Archive / Restore" },
            { id: "delete", label: "Delete Products" },
          ].map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => setOperationType(op.id as any)}
              className={`px-3 py-2 font-bold rounded-t-xl border-b-2 transition-colors cursor-pointer ${
                operationType === op.id
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20"
                  : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          {/* CLASSIFICATION */}
          {operationType === "classification" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    New Primary Category
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                  >
                    <option value="NO_CHANGE">— Keep Existing Category —</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    New Subcategory
                  </label>
                  <select
                    value={targetSubCategory}
                    disabled={targetCategory === "NO_CHANGE"}
                    onChange={(e) => setTargetSubCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold disabled:opacity-40"
                  >
                    <option value="NO_CHANGE">— Keep Existing Subcategory —</option>
                    {availableSubs.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Change Brand (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep current brands"
                    value={targetBrand}
                    onChange={(e) => setTargetBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Change Product Type (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cookie, Chips, Soda"
                    value={targetProductType}
                    onChange={(e) => setTargetProductType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAGS */}
          {operationType === "tags" && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Add Search Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Snack, High Protein, Crunchy"
                  value={tagsToAdd}
                  onChange={(e) => setTagsToAdd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Remove Search Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. OutdatedTag, LegacyKeyword"
                  value={tagsToRemove}
                  onChange={(e) => setTagsToRemove(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
            </div>
          )}

          {/* STATUS */}
          {operationType === "status" && (
            <div className="space-y-3">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">
                Directory Visibility Action
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStatusAction("archive")}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    statusAction === "archive"
                      ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200"
                      : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <span className="font-bold block text-sm">Archive Products</span>
                  <span className="text-[11px] opacity-80 mt-1 block">
                    Soft-deletes products from public directory while preserving MongoDB documents.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusAction("restore")}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    statusAction === "restore"
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
                      : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <span className="font-bold block text-sm">Restore to Active</span>
                  <span className="text-[11px] opacity-80 mt-1 block">
                    Re-activates archived records and restores public visibility.
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* DELETE */}
          {operationType === "delete" && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-rose-700 dark:text-rose-400 text-sm">
                    Permanent Deletion Warning
                  </h4>
                  <p className="text-rose-600 dark:text-rose-300 text-[11px] mt-1">
                    You are about to permanently delete {selectedIds.length} products from MongoDB. This action cannot be undone. We recommend archiving products instead.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 text-rose-800 dark:text-rose-300 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600"
                />
                <span>I understand and confirm permanent deletion of {selectedIds.length} products.</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold text-stone-600 dark:text-stone-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={saving}
            className={`px-5 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
              operationType === "delete"
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 text-stone-950"
            }`}
          >
            {saving ? "Applying..." : "Apply Bulk Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

