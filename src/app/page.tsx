import React from "react";
import Link from "next/link";
import {
  ScanLine,
  Search,
  ShieldCheck,
  Flame,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Database,
  ExternalLink,
} from "lucide-react";
import { queryProducts } from "@/lib/product-service";
import { ProductCard } from "@/components/ProductCard";
import { SEED_CATEGORIES } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products, total } = await queryProducts({ limit: 6, sortBy: "score", sortOrder: "desc" });

  const demoItems = [
    { label: "Cheerios Cereal", code: "016000275270", icon: "🥣" },
    { label: "Oatly Oat Milk", code: "7394376616532", icon: "🥛" },
    { label: "Nutella Spread", code: "8000500179864", icon: "🍫" },
    { label: "Coca-Cola", code: "049000028904", icon: "🥤" },
    { label: "Doritos Chips", code: "028400043809", icon: "🧀" },
    { label: "Amy's Lentil Soup", code: "042272005085", icon: "🥫" },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20 dark:via-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Serverless Food Intelligence Engine · Powered by MongoDB Atlas</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
            Decode Every Ingredient. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Eat with Complete Clarity.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            Instantly scan food barcodes or search our verified catalogue to unmask ultra-processed foods, high-hazard additives, palm oil, added sugars, and allergens.
          </p>

          {/* Primary Action Group */}
          <div className="max-w-2xl mx-auto pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
            >
              <ScanLine className="w-5 h-5" /> Launch Camera Barcode Scanner
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm transition-all shadow-sm"
            >
              <Search className="w-4 h-4 text-stone-400" /> Explore {total} Food Products
            </Link>
          </div>

          {/* 1-Click Demo Barcode Pills */}
          <div className="pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2.5">
              Click any demo barcode to test instant analysis:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {demoItems.map((item) => (
                <Link
                  key={item.code}
                  href={`/products/barcode/${item.code}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-all shadow-2xs"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of FoodDecode Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
            A Multi-Dimensional Health Lens
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
            Most apps only count calories. FoodDecode evaluates the biochemical and industrial reality of your food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
              A-E
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Nutri-Score Algorithm
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Calculates positive nutrients (fiber, protein) against saturated fat, sugars, sodium, and high calorie density.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              NOVA 4 Ultra-Processing
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Detects industrial emulsifiers, artificial flavors, hydrogenated oils, and chemical texturizers not found in home kitchens.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Palm Oil & Sat Fat Flags
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Instant alerts on refined palm oil, palmitate, and high palmitic acid saturated fats impacting cardiovascular health.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Additives & Allergens
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Identifies EU-banned preservatives like Titanium Dioxide (E171), synthetic azo dyes (Red 40, Yellow 5), and 9 major allergens.
            </p>
          </div>
        </div>
      </section>

      {/* Featured High-Scoring Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50">
              Featured Clean-Label Foods
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Top verified items evaluated by our scoring algorithm
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            Browse all directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Explore by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50">
            Browse by Food Category
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Discover clean alternatives in every supermarket aisle
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SEED_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/60 transition-all text-center group shadow-2xs"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon || "🍽️"}
              </div>
              <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Serverless & MongoDB Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" /> Next.js + Vercel + MongoDB Atlas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Cloud-Native Serverless Food Architecture
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Engineered with zero permanent server overhead. Every barcode lookup, ingredient analysis, and catalogue query runs on low-latency Vercel Route Handlers connected to persistent MongoDB Atlas collections with warm pool connection reuse.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Global CDN Edge Caching
              </div>
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-4 h-4" /> Open Food Facts API Sync
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" /> Role-Based Admin Operations
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
