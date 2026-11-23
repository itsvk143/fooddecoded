"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";

interface ActiveFilterChipsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  selectedCategory?: string;
  onClearCategory?: () => void;
  selectedSubCategory?: string;
  onClearSubCategory?: () => void;
  selectedBrand?: string;
  onClearBrand?: () => void;
  selectedNutriScore?: string;
  onClearNutriScore?: () => void;
  selectedNovaGroup?: string;
  onClearNovaGroup?: () => void;
  palmOilFree?: boolean;
  onTogglePalmOilFree?: () => void;
  lowSugar?: boolean;
  onToggleLowSugar?: () => void;
  lowSodium?: boolean;
  onToggleLowSodium?: () => void;
  verifiedOnly?: boolean;
  onToggleVerifiedOnly?: () => void;
  proteinRange?: string;
  onClearProteinRange?: () => void;
  sugarRange?: string;
  onClearSugarRange?: () => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  searchQuery,
  onClearSearch,
  selectedCategory,
  onClearCategory,
  selectedSubCategory,
  onClearSubCategory,
  selectedBrand,
  onClearBrand,
  selectedNutriScore,
  onClearNutriScore,
  selectedNovaGroup,
  onClearNovaGroup,
  palmOilFree,
  onTogglePalmOilFree,
  lowSugar,
  onToggleLowSugar,
  lowSodium,
  onToggleLowSodium,
  verifiedOnly,
  onToggleVerifiedOnly,
  proteinRange,
  onClearProteinRange,
  sugarRange,
  onClearSugarRange,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    (selectedCategory && selectedCategory !== "All") ||
    Boolean(selectedSubCategory) ||
    (selectedBrand && selectedBrand !== "All") ||
    (selectedNutriScore && selectedNutriScore !== "All") ||
    (selectedNovaGroup && selectedNovaGroup !== "All") ||
    palmOilFree ||
    lowSugar ||
    lowSodium ||
    verifiedOnly ||
    (proteinRange && proteinRange !== "All") ||
    (sugarRange && sugarRange !== "All");

  if (!hasActiveFilters) return null;

  const formatRange = (r: string) => (r === "<10" ? "<10g" : r === "30+" ? "30+g" : `${r}g`);

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mr-1">
        Active:
      </span>

      {searchQuery && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-medium">
          &quot;{searchQuery}&quot;
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove keyword"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {selectedCategory && selectedCategory !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-medium">
          Category: {selectedCategory}
          {onClearCategory && (
            <button
              type="button"
              onClick={onClearCategory}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove category filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {selectedSubCategory && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-medium">
          Aisle: {selectedSubCategory}
          {onClearSubCategory && (
            <button
              type="button"
              onClick={onClearSubCategory}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove aisle filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {selectedBrand && selectedBrand !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-medium">
          Brand: {selectedBrand}
          {onClearBrand && (
            <button
              type="button"
              onClick={onClearBrand}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove brand filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {selectedNutriScore && selectedNutriScore !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 text-xs font-bold">
          Nutri-Score {selectedNutriScore}
          {onClearNutriScore && (
            <button
              type="button"
              onClick={onClearNutriScore}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Nutri-Score"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {selectedNovaGroup && selectedNovaGroup !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700 text-xs font-bold">
          NOVA {selectedNovaGroup}
          {onClearNovaGroup && (
            <button
              type="button"
              onClick={onClearNovaGroup}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove NOVA filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {palmOilFree && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-medium">
          Palm Oil Free
          {onTogglePalmOilFree && (
            <button
              type="button"
              onClick={onTogglePalmOilFree}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Palm Oil Free filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {lowSugar && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 text-xs font-medium">
          Low Sugar (≤5g)
          {onToggleLowSugar && (
            <button
              type="button"
              onClick={onToggleLowSugar}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Low Sugar filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {lowSodium && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-medium">
          Low Sodium (≤120mg)
          {onToggleLowSodium && (
            <button
              type="button"
              onClick={onToggleLowSodium}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Low Sodium filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {verifiedOnly && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-medium">
          Verified Only
          {onToggleVerifiedOnly && (
            <button
              type="button"
              onClick={onToggleVerifiedOnly}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Verified Only filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {proteinRange && proteinRange !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800 text-xs font-medium">
          Protein: {formatRange(proteinRange)}
          {onClearProteinRange && (
            <button
              type="button"
              onClick={onClearProteinRange}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Protein filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {sugarRange && sugarRange !== "All" && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-medium">
          Sugar: {formatRange(sugarRange)}
          {onClearSugarRange && (
            <button
              type="button"
              onClick={onClearSugarRange}
              className="hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Remove Sugar filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer ml-1"
        title="Clear all active filters"
      >
        <RotateCcw className="w-3 h-3" />
        Clear all
      </button>
    </div>
  );
}
