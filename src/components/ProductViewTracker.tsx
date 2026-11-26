"use client";

import { useEffect } from "react";
import { ProductItem, SlimProductItem } from "@/types";
import { saveViewedProduct } from "@/lib/pwa-cache/indexed-db";
import { enqueueProductThumbnails } from "@/lib/pwa-cache/image-cache";

interface ProductViewTrackerProps {
  product: ProductItem | SlimProductItem;
}

/**
 * Non-blocking client-side tracker that records user-viewed products
 * into IndexedDB under Priority 2 for offline viewing.
 */
export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    if (!product) return;

    // Save product to Priority 2 viewed products in IndexedDB
    saveViewedProduct(product).catch(() => {});

    // Ensure thumbnail is cached for offline access
    if (product.imageUrl && !product.imageUrl.includes("placeholder")) {
      enqueueProductThumbnails(
        [{ imageUrl: product.imageUrl, category: product.category }],
        5 // High priority for currently viewed product
      );
    }
  }, [product]);

  return null;
}
