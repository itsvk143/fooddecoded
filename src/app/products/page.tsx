import React from "react";
import Link from "next/link";
import { queryProducts } from "@/lib/product-service";
import { ProductCard } from "@/components/ProductCard";
import { FiltersBar } from "@/components/FiltersBar";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/lib/seed-data";
import { SearchX, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    nutriScore?: string;
    novaGroup?: string;
    hasPalmOil?: string;
    lowSugar?: string;
    lowSodium?: string;
    verifiedOnly?: string;
    sortBy?: "name" | "score" | "recent" | "verified";
    page?: string;
  }>;
}

export default async function ProductsDirectoryPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 12;

  const { products, total, totalPages, isDbConnected } = await queryProducts({
    q: params.q,
    category: params.category,
    brand: params.brand,
    nutriScore: params.nutriScore,
    novaGroup: params.novaGroup ? Number(params.novaGroup) : undefined,
    hasPalmOil: params.hasPalmOil !== undefined ? params.hasPalmOil === "true" : undefined,
    lowSugar: params.lowSugar === "true",
    lowSodium: params.lowSodium === "true",
    verifiedOnly: params.verifiedOnly === "true",
    sortBy: params.sortBy || "score",
    sortOrder: params.sortBy === "name" ? "asc" : "desc",
    page,
    limit,
  });

  const categoryNames = SEED_CATEGORIES.map((c) => c.name);
  const brandNames = SEED_BRANDS.map((b) => b.name);

  // Pagination URL helper
  const createPageUrl = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.brand) sp.set("brand", params.brand);
    if (params.nutriScore) sp.set("nutriScore", params.nutriScore);
    if (params.hasPalmOil) sp.set("hasPalmOil", params.hasPalmOil);
    if (params.lowSugar) sp.set("lowSugar", params.lowSugar);
    if (params.lowSodium) sp.set("lowSodium", params.lowSodium);
    if (params.verifiedOnly) sp.set("verifiedOnly", params.verifiedOnly);
    if (params.sortBy) sp.set("sortBy", params.sortBy);
    sp.set("page", targetPage.toString());
    return `/products?${sp.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Searchable Food Database</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">
            Explore Food Products
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Showing {products.length} of {total} products matching your criteria.
          </p>
        </div>

        {!isDbConnected && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium self-start sm:self-auto">
            ⚡ Demo Catalogue Mode · Connect MongoDB Atlas in .env.local to persist changes
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <FiltersBar
        categories={categoryNames}
        brands={brandNames}
        totalResults={total}
      />

      {/* Product Cards Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            No products matched your search
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing dietary filters, or submit a new unlisted product to our catalogue.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/products"
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold hover:bg-stone-200"
            >
              Reset Filters
            </Link>
            <Link
              href="/submit"
              className="px-4 py-2 bg-emerald-500 text-stone-950 rounded-xl text-xs font-bold hover:bg-emerald-400"
            >
              Submit New Product
            </Link>
          </div>
        </div>
      )}

      {/* Server-Side Pagination */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={createPageUrl(page - 1)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            ) : (
              <span className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-700 text-xs font-semibold cursor-not-allowed">
                Previous
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={createPageUrl(page + 1)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1 shadow-2xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-700 text-xs font-semibold cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
