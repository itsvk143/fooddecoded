"use client";

import React, { useState } from "react";
import { IngredientMatchResult } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, XCircle, AlertCircle, X, ExternalLink } from "lucide-react";

interface IngredientTagProps {
  ingredient: IngredientMatchResult;
}

export function IngredientTag({ ingredient }: IngredientTagProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Style badge depending on risk
  let badgeStyle = "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 hover:border-stone-400";
  let icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;

  if (ingredient.isAllergen) {
    badgeStyle = "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 hover:border-purple-400";
    icon = <AlertCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
  } else if (ingredient.riskLevel === "avoid") {
    badgeStyle = "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 hover:border-rose-400 font-semibold";
    icon = <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
  } else if (ingredient.riskLevel === "caution" || ingredient.isPalmOil || ingredient.isAddedSugar) {
    badgeStyle = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 hover:border-amber-400";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500",
          badgeStyle
        )}
        title="Click to view health explanation & regulatory status"
      >
        {icon}
        <span className="capitalize">{ingredient.raw || ingredient.normalized}</span>
        {ingredient.isPalmOil && (
          <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100">
            Palm Oil
          </span>
        )}
        {ingredient.isAddedSugar && (
          <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100">
            Added Sugar
          </span>
        )}
      </button>

      {/* Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Ingredient Analysis
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide",
                      ingredient.riskLevel === "avoid"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : ingredient.riskLevel === "caution"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    )}
                  >
                    {ingredient.riskLevel.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1 capitalize">
                  {ingredient.normalized}
                </h3>
                {ingredient.raw !== ingredient.normalized && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    Label declaration: &ldquo;{ingredient.raw}&rdquo;
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  What is it?
                </h4>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {ingredient.description || "Standard recognized food additive or ingredient."}
                </p>
              </div>

              {ingredient.regulatoryStatus && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60">
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
                    Regulatory Standing
                  </span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">
                    {ingredient.regulatoryStatus}
                  </p>
                </div>
              )}

              {ingredient.healthConcerns && ingredient.healthConcerns.length > 0 && (
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4" /> Health & Toxicology Concerns
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-stone-600 dark:text-stone-400">
                    {ingredient.healthConcerns.map((c, idx) => (
                      <li key={idx} className="leading-snug">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredient.isAllergen && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block mb-1">
                    Allergen Advisory
                  </span>
                  <p className="text-purple-900 dark:text-purple-200 font-medium">
                    Contains declared allergen: {ingredient.allergenType || "Major allergen"}. Sensitive individuals should exercise caution.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-semibold hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
