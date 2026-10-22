import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProductByBarcode } from "@/lib/product-service";
import { SearchX, PlusCircle, ArrowLeft, RefreshCw, Barcode } from "lucide-react";

export const dynamic = "force-dynamic";

interface BarcodePageProps {
  params: Promise<{ barcode: string }>;
}

export default async function ProductBarcodeLookupPage({ params }: BarcodePageProps) {
  const { barcode } = await params;
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");

  if (!cleanBarcode) {
    notFound();
  }

  const { product, source } = await getProductByBarcode(cleanBarcode);

  // If found in MongoDB or fetched and imported from Open Food Facts, redirect to product details
  if (product) {
    redirect(`/products/${product.id || product._id || product.barcode}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800 shadow-sm">
        <Barcode className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Barcode Lookup Result
        </span>
        <h1 className="text-3xl font-black text-stone-900 dark:text-stone-50">
          Product Not Yet Indexed
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          We searched our local MongoDB database and the global Open Food Facts repository for barcode{" "}
          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
            {cleanBarcode}
          </span>
          , but no verified nutrition record exists yet.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 max-w-md mx-auto">
        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
          Be the first to add this food item!
        </h3>
        <p className="text-xs text-stone-500">
          Submit the product label and ingredients list. Our analysis engine will decode and publish it for the community.
        </p>
        <Link
          href={`/submit?barcode=${encodeURIComponent(cleanBarcode)}`}
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4" /> Add Product ({cleanBarcode})
        </Link>
      </div>

      <div className="pt-2">
        <Link
          href="/scan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <ArrowLeft className="w-4 h-4" /> Scan Another Barcode
        </Link>
      </div>
    </div>
  );
}
