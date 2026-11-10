"use client";

import React, { useState } from "react";
import { IngredientMatchResult } from "@/types";
import { IngredientTag } from "./IngredientTag";
import { ShieldCheck, AlertTriangle, XCircle, AlertCircle, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface IngredientIntelligenceSectionProps {
  ingredients: IngredientMatchResult[];
  ingredientsText: string;
}

export function IngredientIntelligenceSection({
  ingredients,
  ingredientsText,
}: IngredientIntelligenceSectionProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "GREEN" | "ORANGE" | "RED" | "ALLERGEN">("ALL");

  // Calculate summary counts
  const greenCount = ingredients.filter(
    (i) => (i.classification === "GREEN" || (!i.classification && i.riskLevel === "safe"))
  ).length;

  const orangeCount = ingredients.filter(
    (i) => (i.classification === "ORANGE" || (!i.classification && i.riskLevel === "caution"))
  ).length;

  const redCount = ingredients.filter(
    (i) => (i.classification === "RED" || (!i.classification && i.riskLevel === "avoid"))
  ).length;

  const allergenCount = ingredients.filter((i) => i.isAllergen).length;

  // Filtered ingredients
  const displayedIngredients = ingredients.filter((i) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "GREEN") {
      return i.classification === "GREEN" || (!i.classification && i.riskLevel === "safe");
    }
    if (activeFilter === "ORANGE") {
      return i.classification === "ORANGE" || (!i.classification && i.riskLevel === "caution");
    }
    if (activeFilter === "RED") {
      return i.classification === "RED" || (!i.classification && i.riskLevel === "avoid");
    }
    if (activeFilter === "ALLERGEN") {
      return i.isAllergen;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header and Summary Counts */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Ingredient Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 mt-0.5">
              Ingredients & Additive Safety Analysis
            </h2>
          </div>

          <span className="text-xs text-stone-500 font-medium self-start sm:self-auto">
            {ingredients.length} identified components
          </span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          Click any ingredient chip to open detailed scientific evidence, Acceptable Daily Intake (ADI), recommended limits, and health impact.
        </p>
      </div>

      {/* Product-Level Ingredient Intelligence Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
        <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {/* All Filter */}
        <button
          type="button"
          onClick={() => setActiveFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border",
            activeFilter === "ALL"
              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs"
              : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400"
          )}
        >
          All ({ingredients.length})
        </button>

        {/* Green Filter */}
        <button
          type="button"
          onClick={() => setActiveFilter("GREEN")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border inline-flex items-center gap-1.5",
            activeFilter === "GREEN"
              ? "bg-emerald-600 text-white border-transparent shadow-xs"
              : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400"
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Beneficial ({greenCount})</span>
        </button>

        {/* Orange Filter */}
        <button
          type="button"
          onClick={() => setActiveFilter("ORANGE")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border inline-flex items-center gap-1.5",
            activeFilter === "ORANGE"
              ? "bg-amber-500 text-stone-950 border-transparent shadow-xs"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:border-amber-400"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Moderate ({orangeCount})</span>
        </button>

        {/* Red Filter */}
        {redCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter("RED")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border inline-flex items-center gap-1.5",
              activeFilter === "RED"
                ? "bg-rose-600 text-white border-transparent shadow-xs"
                : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:border-rose-400"
            )}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Avoid / Restrict ({redCount})</span>
          </button>
        )}

        {/* Allergen Filter */}
        {allergenCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter("ALLERGEN")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border inline-flex items-center gap-1.5",
              activeFilter === "ALLERGEN"
                ? "bg-purple-600 text-white border-transparent shadow-xs"
                : "bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 hover:border-purple-400"
            )}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Allergens ({allergenCount})</span>
          </button>
        )}
      </div>

      {/* Interactive Tag Cloud */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        {displayedIngredients.length > 0 ? (
          displayedIngredients.map((ing, idx) => (
            <IngredientTag key={idx} ingredient={ing} />
          ))
        ) : (
          <p className="text-xs text-stone-400 italic py-2">
            No ingredients matched this filter.
          </p>
        )}
      </div>

      {/* Full Label Declaration Transcript */}
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Full Label Ingredients Statement
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-mono bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800 select-text">
          {ingredientsText}
        </p>
      </div>
    </div>
  );
}

export default IngredientIntelligenceSection;

