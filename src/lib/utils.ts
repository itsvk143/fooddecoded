import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNutrient(val?: number, unit: string = "g"): string {
  if (val === undefined || val === null) return "--";
  return `${Number(val).toFixed(1).replace(/\.0$/, "")}${unit}`;
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500 text-white";
  if (score >= 65) return "bg-teal-500 text-white";
  if (score >= 45) return "bg-amber-500 text-white";
  if (score >= 25) return "bg-orange-500 text-white";
  return "bg-rose-500 text-white";
}

export function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 65) return "text-teal-600 dark:text-teal-400";
  if (score >= 45) return "text-amber-600 dark:text-amber-400";
  if (score >= 25) return "text-orange-600 dark:text-orange-400";
  return "text-rose-600 dark:text-rose-400";
}

export function getNutriScoreColor(grade: string): { bg: string; text: string; border: string } {
  switch (grade?.toUpperCase()) {
    case "A":
      return { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-700" };
    case "B":
      return { bg: "bg-lime-500", text: "text-white", border: "border-lime-600" };
    case "C":
      return { bg: "bg-yellow-400", text: "text-stone-900", border: "border-yellow-500" };
    case "D":
      return { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" };
    case "E":
    default:
      return { bg: "bg-rose-600", text: "text-white", border: "border-rose-700" };
  }
}

export function getNovaInfo(group: number): { label: string; desc: string; color: string } {
  switch (group) {
    case 1:
      return {
        label: "Nova 1",
        desc: "Unprocessed or Minimally Processed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      };
    case 2:
      return {
        label: "Nova 2",
        desc: "Processed Culinary Ingredients",
        color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
      };
    case 3:
      return {
        label: "Nova 3",
        desc: "Processed Foods",
        color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      };
    case 4:
    default:
      return {
        label: "Nova 4",
        desc: "Ultra-Processed Food Product",
        color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
      };
  }
}
