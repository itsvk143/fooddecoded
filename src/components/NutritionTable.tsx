"use client";

import React from "react";
import { NutritionInfo } from "@/types";
import { getTrafficLightLevels, TrafficLightColor } from "@/lib/scoring-engine";
import { formatNutrient, cn } from "@/lib/utils";

interface NutritionTableProps {
  nutrition: NutritionInfo;
  servingSize?: string;
}

export function NutritionTable({ nutrition, servingSize = "100g" }: NutritionTableProps) {
  const lights = getTrafficLightLevels(nutrition);

  const getPill = (traffic: TrafficLightColor) => {
    switch (traffic.color) {
      case "green":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300";
      case "amber":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300";
      case "red":
      default:
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300";
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Nutrition Assessment
          </h3>
          <p className="text-xs text-stone-500">
            Values standardized per 100g (Serving: {servingSize})
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-stone-500 block uppercase">Energy</span>
          <span className="text-lg font-black text-stone-900 dark:text-stone-100">
            {nutrition.calories} <span className="text-xs font-normal text-stone-500">kcal</span>
          </span>
        </div>
      </div>

      {/* Traffic Light Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className={cn("p-2.5 rounded-xl border flex flex-col justify-between", getPill(lights.fat))}>
          <span className="text-[11px] font-semibold opacity-90">Total Fat</span>
          <div className="my-1">
            <span className="text-xl font-black">{formatNutrient(nutrition.totalFat)}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{lights.fat.label}</span>
        </div>

        <div className={cn("p-2.5 rounded-xl border flex flex-col justify-between", getPill(lights.saturatedFat))}>
          <span className="text-[11px] font-semibold opacity-90">Saturated Fat</span>
          <div className="my-1">
            <span className="text-xl font-black">{formatNutrient(nutrition.saturatedFat)}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{lights.saturatedFat.label}</span>
        </div>

        <div className={cn("p-2.5 rounded-xl border flex flex-col justify-between", getPill(lights.sugars))}>
          <span className="text-[11px] font-semibold opacity-90">Total Sugars</span>
          <div className="my-1">
            <span className="text-xl font-black">{formatNutrient(nutrition.sugars)}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{lights.sugars.label}</span>
        </div>

        <div className={cn("p-2.5 rounded-xl border flex flex-col justify-between", getPill(lights.salt))}>
          <span className="text-[11px] font-semibold opacity-90">Salt (Sodium)</span>
          <div className="my-1">
            <span className="text-xl font-black">{formatNutrient(nutrition.salt)}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{lights.salt.label}</span>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="text-xs divide-y divide-stone-100 dark:divide-stone-800">
        <div className="py-2 flex justify-between">
          <span className="text-stone-600 dark:text-stone-400">Total Carbohydrates</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{formatNutrient(nutrition.carbohydrates)}</span>
        </div>
        <div className="py-2 pl-4 flex justify-between text-stone-500">
          <span>of which Sugars</span>
          <span className="font-medium text-stone-800 dark:text-stone-200">{formatNutrient(nutrition.sugars)}</span>
        </div>
        {nutrition.addedSugars !== undefined && (
          <div className="py-2 pl-8 flex justify-between text-amber-600 dark:text-amber-400">
            <span>Includes Added Sugars</span>
            <span className="font-medium">{formatNutrient(nutrition.addedSugars)}</span>
          </div>
        )}
        <div className="py-2 flex justify-between">
          <span className="text-stone-600 dark:text-stone-400">Dietary Fiber</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{formatNutrient(nutrition.fiber)}</span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="text-stone-600 dark:text-stone-400">Protein</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{formatNutrient(nutrition.protein)}</span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="text-stone-600 dark:text-stone-400">Sodium</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{nutrition.sodium || 0} mg</span>
        </div>
      </div>
    </div>
  );
}
