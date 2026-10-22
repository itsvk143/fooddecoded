"use client";

import React from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { NutriScoreBadge, NovaBadge } from "./ScoreBadge";
import { getScoreBgColor, cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Flame, Droplets } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const prodId = product.id || product._id || product.barcode;

  return (
    <Link
      href={`/products/${prodId}`}
      className="group flex flex-col justify-between bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 overflow-hidden"
    >
      <div>
        {/* Top bar: Brand & Score */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block truncate">
              {product.brand}
            </span>
            <span className="text-[10px] text-stone-500 truncate block">
              {product.category}
            </span>
          </div>

          <div
            className={cn(
              "flex flex-col items-center justify-center w-11 h-11 rounded-xl font-black text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform",
              getScoreBgColor(product.overallScore)
            )}
            title={`FoodDecode Score: ${product.overallScore}/100 (${product.scoreLabel})`}
          >
            <span>{product.overallScore}</span>
            <span className="text-[7px] uppercase font-bold tracking-tight opacity-90 leading-none">
              score
            </span>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-40 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-3xl text-stone-300 dark:text-stone-600 font-black">
              FOOD
            </div>
          )}

          {product.verified && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-stone-900/90 text-emerald-700 dark:text-emerald-300 shadow-xs backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 transition-colors">
          {product.name}
        </h3>

        {/* Flags and Alerts */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {product.hasPalmOil && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Droplets className="w-2.5 h-2.5" /> Palm Oil
            </span>
          )}
          {product.hasAddedSugar && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
              <Flame className="w-2.5 h-2.5" /> Added Sugar
            </span>
          )}
          {product.hasArtificialAdditives && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              <AlertTriangle className="w-2.5 h-2.5" /> Additives
            </span>
          )}
        </div>
      </div>

      {/* Footer Badges */}
      <div className="pt-3.5 mt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
        <NutriScoreBadge grade={product.nutriScore} size="sm" />
        <NovaBadge group={product.novaGroup} />
      </div>
    </Link>
  );
}
