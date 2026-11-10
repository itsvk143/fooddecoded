"use client";

import React, { useState } from "react";
import { IngredientMatchResult } from "@/types";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, XCircle, Info } from "lucide-react";
import { IngredientIntelligenceModal } from "./IngredientIntelligenceModal";

interface IngredientTagProps {
  ingredient: IngredientMatchResult;
  className?: string;
}

export function IngredientTag({ ingredient, className }: IngredientTagProps) {
  const [isOpen, setIsOpen] = useState(false);

  const classification = ingredient.classification || (
    ingredient.riskLevel === "avoid" ? "RED" : ingredient.riskLevel === "caution" ? "ORANGE" : "GREEN"
  );

  let badgeStyle = "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 hover:border-emerald-400";
  let icon = <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />;

  if (classification === "GREEN") {
    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 hover:shadow-xs";
    icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  } else if (classification === "ORANGE") {
    badgeStyle = "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80 hover:border-amber-500 hover:shadow-xs";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
  } else if (classification === "RED") {
    badgeStyle = "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80 hover:border-rose-500 hover:shadow-xs font-semibold";
    icon = <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 select-none",
          badgeStyle,
          ingredient.isAllergen && "ring-1 ring-purple-400 dark:ring-purple-600",
          className
        )}
        title="Click to view complete scientific analysis, ADI, and health effects"
      >
        {icon}
        <span className="capitalize font-medium">
          {ingredient.normalized || ingredient.raw}
        </span>

        {/* Declared quantity if explicitly stated on label */}
        {ingredient.declaredQuantity && (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/80 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
            {ingredient.declaredQuantity}
          </span>
        )}

        {/* Allergen Indicator */}
        {ingredient.isAllergen && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            title={`Contains declared allergen: ${ingredient.allergenType || "Allergen"}`}
          >
            Allergen
          </span>
        )}

        {/* Palm Oil Indicator */}
        {ingredient.isPalmOil && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
            Palm Oil
          </span>
        )}

        {/* Added Sugar Indicator */}
        {ingredient.isAddedSugar && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-100">
            Added Sugar
          </span>
        )}
      </button>

      {/* Ingredient Intelligence Modal */}
      <IngredientIntelligenceModal
        ingredient={ingredient}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default IngredientTag;
