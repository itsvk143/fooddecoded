import React from "react";

export function ProductsDirectorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Directory Title & Subtitle Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-900 rounded" />
          <div className="h-3.5 w-40 bg-emerald-100 dark:bg-emerald-950/80 rounded-full" />
        </div>
        <div className="h-9 sm:h-10 w-72 sm:w-96 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        <div className="h-4 w-full max-w-xl bg-stone-100 dark:bg-stone-800/60 rounded-md" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 flex-1 bg-stone-100 dark:bg-stone-800 rounded-xl" />
          <div className="h-10 w-28 bg-stone-100 dark:bg-stone-800 rounded-xl" />
          <div className="h-10 w-24 bg-stone-100 dark:bg-stone-800 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-7 w-24 bg-stone-100 dark:bg-stone-800 rounded-full" />
          <div className="h-7 w-28 bg-stone-100 dark:bg-stone-800 rounded-full" />
          <div className="h-7 w-20 bg-stone-100 dark:bg-stone-800 rounded-full" />
          <div className="h-7 w-32 bg-stone-100 dark:bg-stone-800 rounded-full" />
        </div>
      </div>

      {/* Product Cards Grid Skeleton (12 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 p-4 bg-white dark:bg-stone-900 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-2.5 w-24 bg-stone-100 dark:bg-stone-800/60 rounded" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0" />
              </div>

              {/* Image Skeleton Box */}
              <div className="w-full h-44 bg-stone-100 dark:bg-stone-800/80 rounded-xl mb-3.5 flex items-center justify-center border border-stone-100 dark:border-stone-700/50">
                <div className="w-12 h-12 rounded-lg bg-stone-200 dark:bg-stone-700/60" />
              </div>

              {/* Title & Badge lines */}
              <div className="space-y-2 mb-3">
                <div className="h-3.5 w-full bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-3.5 w-2/3 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>

              <div className="flex gap-1.5">
                <div className="h-5 w-16 bg-stone-100 dark:bg-stone-800 rounded-full" />
                <div className="h-5 w-20 bg-stone-100 dark:bg-stone-800 rounded-full" />
              </div>
            </div>

            <div className="pt-3.5 mt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
              <div className="h-6 w-20 bg-stone-200 dark:bg-stone-800 rounded-lg" />
              <div className="h-6 w-16 bg-stone-200 dark:bg-stone-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return <ProductsDirectorySkeleton />;
}
