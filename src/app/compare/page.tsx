"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductItem } from "@/types";
import { NutriScoreBadge, NovaBadge } from "@/components/ScoreBadge";
import { getScoreBgColor, formatNutrient, cn } from "@/lib/utils";
import {
  Scale,
  Plus,
  Trash2,
  Sparkles,
  Trophy,
  AlertTriangle,
  Flame,
  Droplets,
  ArrowRight,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [highlights, setHighlights] = useState<any>({});
  const [catalogueList, setCatalogueList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Load available products for picker
  useEffect(() => {
    fetch("/api/products?limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setCatalogueList(data.products);
      })
      .catch((e) => console.warn(e));
  }, []);

  // Initialize from URL search params (e.g. ?id1=...&id2=...)
  useEffect(() => {
    const id1 = searchParams.get("id1");
    const id2 = searchParams.get("id2");
    const initial: string[] = [];
    if (id1) initial.push(id1);
    if (id2) initial.push(id2);

    if (initial.length === 0) {
      // Default to first two demo products for instant preview
      initial.push("016000275270", "038000391187"); // Cheerios vs Froot Loops
    }
    setSelectedIds(initial);
  }, [searchParams]);

  // Fetch comparison data when selectedIds changes
  useEffect(() => {
    if (selectedIds.length < 2) {
      setProducts([]);
      return;
    }

    setLoading(true);
    fetch("/api/products/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setHighlights(data.highlights || {});
        }
      })
      .catch((err) => console.error("Compare error", err))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  const addProduct = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
    setPickerOpen(false);
  };

  const removeProduct = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Scale className="w-3.5 h-3.5" /> Product Comparison Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">
            Side-by-Side Analysis
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Compare nutrients, additives, Nutri-Scores, and processing degrees across up to 4 foods.
          </p>
        </div>

        {selectedIds.length < 4 && (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Product to Compare
          </button>
        )}
      </div>

      {/* Product Selection Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Choose a product to add
              </h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto">
              {catalogueList
                .filter((p) => !selectedIds.includes(p.id) && !selectedIds.includes(p.barcode))
                .map((p) => (
                  <div
                    key={p.id || p.barcode}
                    onClick={() => addProduct(p.id || p.barcode)}
                    className="flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-stone-500">{p.brand} · Score: {p.overallScore}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Add +</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      {products.length >= 2 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800">
                <th className="p-4 w-48 text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-50 dark:bg-stone-800/40">
                  Metric / Product
                </th>
                {products.map((p) => {
                  const id = p.id || p._id || p.barcode;
                  const isBestOverall = highlights.bestOverallId === id;

                  return (
                    <th key={id} className="p-4 align-top w-64 border-l border-stone-200 dark:border-stone-800">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate">
                            {p.brand}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProduct(id)}
                            className="text-stone-400 hover:text-rose-500 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="relative aspect-video w-full rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-stone-400">NO IMAGE</span>
                          )}
                          {isBestOverall && (
                            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 shadow">
                              <Trophy className="w-3 h-3" /> Top Pick
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${id}`}
                          className="font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-emerald-500 line-clamp-2"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              <tr className="bg-stone-50/50 dark:bg-stone-800/20 font-semibold">
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  FoodDecode Score
                </td>
                {products.map((p) => {
                  const id = p.id || p._id || p.barcode;
                  return (
                    <td key={id} className="p-4 border-l border-stone-200 dark:border-stone-800">
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2.5 py-1 rounded-lg font-black text-sm", getScoreBgColor(p.overallScore))}>
                          {p.overallScore}/100
                        </span>
                        <span className="text-stone-600 dark:text-stone-400 font-medium">
                          {p.scoreLabel}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Nutri-Score Grade
                </td>
                {products.map((p) => (
                  <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800">
                    <NutriScoreBadge grade={p.nutriScore} size="sm" />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  NOVA Processing Level
                </td>
                {products.map((p) => (
                  <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800">
                    <NovaBadge group={p.novaGroup} showDesc />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Total Sugars (per 100g)
                </td>
                {products.map((p) => {
                  const id = p.id || p._id || p.barcode;
                  const isLowest = highlights.lowestSugarId === id;
                  return (
                    <td key={id} className="p-4 border-l border-stone-200 dark:border-stone-800 font-medium">
                      <span className={isLowest ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                        {formatNutrient(p.nutritionPer100g.sugars)}
                      </span>
                      {isLowest && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Lowest
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Saturated Fat (per 100g)
                </td>
                {products.map((p) => (
                  <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800 font-medium">
                    {formatNutrient(p.nutritionPer100g.saturatedFat)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Sodium (mg per 100g)
                </td>
                {products.map((p) => {
                  const id = p.id || p._id || p.barcode;
                  const isLowest = highlights.lowestSodiumId === id;
                  return (
                    <td key={id} className="p-4 border-l border-stone-200 dark:border-stone-800 font-medium">
                      <span className={isLowest ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                        {p.nutritionPer100g.sodium || 0} mg
                      </span>
                      {isLowest && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Lowest
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Protein (per 100g)
                </td>
                {products.map((p) => {
                  const id = p.id || p._id || p.barcode;
                  const isHighest = highlights.highestProteinId === id;
                  return (
                    <td key={id} className="p-4 border-l border-stone-200 dark:border-stone-800 font-medium">
                      <span className={isHighest ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                        {formatNutrient(p.nutritionPer100g.protein)}
                      </span>
                      {isHighest && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Highest
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Dietary Fiber (per 100g)
                </td>
                {products.map((p) => (
                  <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800 font-medium">
                    {formatNutrient(p.nutritionPer100g.fiber)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Palm Oil Presence
                </td>
                {products.map((p) => (
                  <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800">
                    {p.hasPalmOil ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Droplets className="w-3.5 h-3.5" /> Contains Palm Oil
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Palm Oil Free
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-stone-700 dark:text-stone-300">
                  Identified Additives
                </td>
                {products.map((p) => {
                  const avoidOrCaution = p.ingredientsList.filter(
                    (i) => i.riskLevel === "avoid" || i.riskLevel === "caution"
                  );
                  return (
                    <td key={p.id || p._id} className="p-4 border-l border-stone-200 dark:border-stone-800">
                      <span className={avoidOrCaution.length > 0 ? "text-rose-600 font-semibold" : "text-emerald-600 font-semibold"}>
                        {avoidOrCaution.length} additives flagged
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <Scale className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold">Select at least 2 products to compare</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Choose foods from our catalogue to analyze differences in sugar, sodium, fiber, and ultra-processing markers.
          </p>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 text-stone-950 rounded-xl text-xs font-bold"
          >
            Choose First Product
          </button>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
          Loading product comparison matrix...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
