import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProductAlternatives } from "@/lib/product-service";
import { NutriScoreBadge, NovaBadge, OverallScoreGauge } from "@/components/ScoreBadge";
import { IngredientTag } from "@/components/IngredientTag";
import { NutritionTable } from "@/components/NutritionTable";
import { ProductCard } from "@/components/ProductCard";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  ArrowLeft,
  Barcode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Scale,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const alternatives = await getProductAlternatives(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Directory
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?id1=${product.id || product._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-semibold hover:border-emerald-500 transition-colors shadow-2xs"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-500" /> Compare Product
          </Link>
        </div>
      </div>

      {/* Main Product Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        {/* Left: Product Media */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden flex items-center justify-center border border-stone-200/60 dark:border-stone-800">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl font-black text-stone-300 dark:text-stone-600">
                FOOD
              </div>
            )}

            {product.verified && (
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-stone-900/95 text-emerald-700 dark:text-emerald-300 shadow backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Item
              </div>
            )}
          </div>

          {/* Barcode & Verification Metadata */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Barcode className="w-4 h-4" /> Barcode
              </span>
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                {product.barcode}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-500">
              <span>Data Source</span>
              <span className="font-semibold capitalize text-stone-700 dark:text-stone-300">
                {product.source || "Database"}
              </span>
            </div>
            {product.sourceUrl && (
              <div className="pt-1 border-t border-stone-200 dark:border-stone-700 flex justify-end">
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Verify Source Data <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info, Scores, and Summary */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="text-xs text-stone-400">· {product.subCategory}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
              {product.name}
            </h1>
            <p className="text-base font-semibold text-stone-500 mt-1">
              By <span className="text-stone-800 dark:text-stone-200">{product.brand}</span>
            </p>
          </div>

          {/* Core Score Bar */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-6">
            <OverallScoreGauge
              score={product.overallScore}
              label={product.scoreLabel}
              size="lg"
            />
            <div className="flex flex-wrap items-center gap-4">
              <NutriScoreBadge grade={product.nutriScore} size="lg" />
              <NovaBadge group={product.novaGroup} showDesc />
            </div>
          </div>

          {/* Data Completeness Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-500">Data Completeness & Reliability</span>
              <span className="text-stone-900 dark:text-stone-100">{product.dataCompleteness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${product.dataCompleteness}%` }}
              />
            </div>
          </div>

          {/* Critical Hazard Alert Warnings */}
          {product.ingredientAlerts && product.ingredientAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Ingredient Advisory & Health Alerts
              </div>
              <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300 pl-4 list-disc font-medium">
                {product.ingredientAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Declared Allergens Callout */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-200 block mb-0.5">
                  Declared Allergens
                </span>
                <p className="text-purple-800 dark:text-purple-300 font-medium">
                  {product.allergens.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Color-coded Ingredients vs Nutrition Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ingredients Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                Ingredients Analysis
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {product.ingredientsList.length} total ingredients
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Click any ingredient tag to view scientific background and regulatory status (FDA/EFSA).
            </p>
          </div>

          {/* Interactive Tag Cloud */}
          <div className="flex flex-wrap gap-2">
            {product.ingredientsList.map((ing, idx) => (
              <IngredientTag key={idx} ingredient={ing} />
            ))}
          </div>

          {/* Full Label Declaration Transcript */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Full Label Ingredients Statement
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-mono bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800">
              {product.ingredientsText}
            </p>
          </div>
        </div>

        {/* Nutrition Facts with Traffic Lights */}
        <div className="lg:col-span-5">
          <NutritionTable
            nutrition={product.nutritionPer100g}
            servingSize={product.servingSize}
          />
        </div>
      </div>

      {/* Healthier Alternatives in same category */}
      {alternatives.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50">
                Healthier Alternatives in {product.category}
              </h2>
              <p className="text-xs text-stone-500">
                Verified products with higher FoodDecode scores, cleaner ingredients, or lower processing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alternatives.map((alt) => (
              <ProductCard key={alt.id || alt._id} product={alt} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
