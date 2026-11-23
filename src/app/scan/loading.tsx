import React from "react";
import { ScanLine } from "lucide-react";

export default function ScanLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ScanLine className="w-3.5 h-3.5" /> Loading Scanner...
        </div>
        <div className="h-10 w-64 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        <div className="h-4 w-96 max-w-full bg-stone-100 dark:bg-stone-800/60 rounded-md" />
      </div>

      {/* Camera Viewfinder Box Skeleton */}
      <div className="max-w-xl mx-auto w-full aspect-video rounded-3xl bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
          <ScanLine className="w-8 h-8 text-stone-400 dark:text-stone-600 animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>

      {/* Feature Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
          >
            <div className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
