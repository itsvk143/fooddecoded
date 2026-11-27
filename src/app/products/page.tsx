import React, { Suspense } from "react";
import { getSlimProductsIndex } from "@/lib/product-service";
import { isMongoConfigured } from "@/lib/mongodb";
import { ProductsExplorer } from "@/components/ProductsExplorer";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/lib/seed-data";
import { ProductsDirectorySkeleton } from "./loading";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subCategory?: string;
    brand?: string;
    nutriScore?: string;
    novaGroup?: string;
    hasPalmOil?: string;
    lowSugar?: string;
    lowSodium?: string;
    proteinRange?: string;
    sugarRange?: string;
    verifiedOnly?: string;
    sortBy?: "name" | "score" | "recent" | "verified";
    page?: string;
  }>;
}

export default async function ProductsDirectoryPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<ProductsDirectorySkeleton />}>
      <ProductsContent params={params} />
    </Suspense>
  );
}

async function ProductsContent({ params }: { params: Awaited<ProductsPageProps["searchParams"]> }) {
  const products = await getSlimProductsIndex();
  const isDbConnected = isMongoConfigured();

  const categoryNames = SEED_CATEGORIES.map((c) => c.name);
  const brandNames = SEED_BRANDS.map((b) => b.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Instant 0ms Client-Side Products Explorer with Synchronized Category Heading */}
      <ProductsExplorer
        initialProducts={products}
        categories={categoryNames}
        brands={brandNames}
        initialParams={params}
        isDbConnected={isDbConnected}
      />
    </div>
  );
}
