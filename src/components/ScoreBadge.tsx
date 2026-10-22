"use client";

import React from "react";
import { NutriScoreGrade, NovaGroup } from "@/types";
import { getScoreBgColor, getNovaInfo, cn } from "@/lib/utils";

interface NutriScoreProps {
  grade: NutriScoreGrade;
  size?: "sm" | "md" | "lg";
}

export function NutriScoreBadge({ grade, size = "md" }: NutriScoreProps) {
  const letters: NutriScoreGrade[] = ["A", "B", "C", "D", "E"];
  const colorMap: Record<NutriScoreGrade, string> = {
    A: "bg-emerald-600 text-white",
    B: "bg-lime-500 text-white",
    C: "bg-yellow-400 text-stone-900",
    D: "bg-orange-500 text-white",
    E: "bg-rose-600 text-white",
  };

  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
        Nutri-Score
      </span>
      <div className="inline-flex rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
        {letters.map((letter) => {
          const isActive = letter === grade;
          return (
            <div
              key={letter}
              className={cn(
                "flex items-center justify-center font-black transition-all",
                isActive
                  ? cn(colorMap[letter], isLg ? "w-10 h-10 text-xl font-extrabold scale-105 z-10 shadow" : isSm ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm")
                  : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 opacity-60",
                !isActive && (isLg ? "w-7 h-10 text-xs" : isSm ? "w-4 h-6 text-[10px]" : "w-6 h-8 text-xs")
              )}
            >
              {letter}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface NovaBadgeProps {
  group: NovaGroup;
  showDesc?: boolean;
}

export function NovaBadge({ group, showDesc = false }: NovaBadgeProps) {
  const info = getNovaInfo(group);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
        Processing
      </span>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
          info.color
        )}
      >
        <span className="w-2 h-2 rounded-full bg-current opacity-80" />
        <span>{info.label}</span>
        {showDesc && <span className="hidden sm:inline font-normal opacity-90">· {info.desc}</span>}
      </div>
    </div>
  );
}

interface OverallScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function OverallScoreGauge({ score, label, size = "md" }: OverallScoreGaugeProps) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl font-black shadow-md transition-transform hover:scale-105",
          getScoreBgColor(score),
          isLg ? "w-20 h-20 text-3xl" : isSm ? "w-11 h-11 text-base rounded-xl" : "w-14 h-14 text-xl"
        )}
      >
        <span>{score}</span>
        <span className="absolute bottom-1 text-[9px] font-bold tracking-tight opacity-90">/100</span>
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
          FoodDecode Score
        </div>
        <div className="text-base font-bold text-stone-900 dark:text-stone-100">
          {label}
        </div>
      </div>
    </div>
  );
}
