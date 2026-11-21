"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { ProductImage } from "./ProductImage";
import { NutriScoreBadge, NovaBadge } from "./ScoreBadge";
import { getScoreBgColor, cn } from "@/lib/utils";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
} from "lucide-react";

interface FeaturedHealthySnacksProps {
  products: ProductItem[];
}

export function FeaturedHealthySnacks({ products }: FeaturedHealthySnacksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Editor&apos;s Verified Selection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
            FEATURED HEALTHY SNACKS – TOP PICKS
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Clean-label protein bars, unjunked roasted makhanas, antioxidant trail mixes, and stone-ground nut butters with zero palm oil.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/products?category=protein-clean-label-bars-wafers"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mr-2 transition-colors"
          >
            View All Snacks &rarr;
          </Link>
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => {
          const prodId = product.id || product._id || product.barcode;

          return (
            <div
              key={product.barcode}
              className="min-w-[280px] max-w-[280px] sm:min-w-[310px] sm:max-w-[310px] shrink-0 snap-start flex flex-col justify-between bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 group"
            >
              <div>
                {/* Header: Brand & Score */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block truncate">
                      {product.brand}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate block mt-0.5">
                      {product.subCategory || product.category}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-11 h-11 rounded-xl font-black text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform",
                      getScoreBgColor(product.overallScore)
                    )}
                    title={`FoodDecode Score: ${product.overallScore}/100`}
                  >
                    <span>{product.overallScore}</span>
                    <span className="text-[7px] uppercase font-bold tracking-tight opacity-90 leading-none">
                      score
                    </span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-44 bg-white dark:bg-stone-800/80 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3 border border-stone-100 dark:border-stone-700/60">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    showVerifiedBadge={true}
                    badgeText="Verified Image"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mx-auto"
                  />

                  {product.proteinContent && (
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                      <Zap className="w-3 h-3" /> {product.proteinContent}
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link href={`/products/${prodId}`}>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Flavour / Highlights Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {product.flavour && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {product.flavour}
                    </span>
                  )}
                  {product.highlights?.slice(0, 2).map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                    >
                      {h}
                    </span>
                  ))}
                  {product.price && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                      ₹{product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Scores & Footer */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NutriScoreBadge grade={product.nutriScore} size="sm" />
                  <NovaBadge group={product.novaGroup} />
                </div>
                <Link
                  href={`/products/${prodId}`}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedHealthySnacks;
