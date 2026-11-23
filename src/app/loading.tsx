import React from "react";

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 bg-emerald-100 dark:bg-emerald-950/60 rounded-full" />
        <div className="h-9 w-64 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        <div className="h-4 w-96 max-w-full bg-stone-100 dark:bg-stone-900 rounded-md" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 p-4 bg-white dark:bg-stone-900 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-2.5 w-24 bg-stone-100 dark:bg-stone-800/60 rounded" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0" />
            </div>
            <div className="w-full h-40 bg-stone-100 dark:bg-stone-800/80 rounded-xl" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3.5 w-3/4 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="h-6 w-14 bg-stone-200 dark:bg-stone-800 rounded-full" />
              <div className="h-6 w-14 bg-stone-200 dark:bg-stone-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
