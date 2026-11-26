import {
  saveTop25ByCategory,
  getCacheMeta,
  setCacheMeta,
  requestPersistentStorage,
  evictLRU,
} from "./indexed-db";
import { enqueueProductThumbnails } from "./image-cache";

const SYNC_THROTTLE_MS = 6 * 60 * 60 * 1000; // 6 hours between full checks unless forced

let isSyncInProgress = false;
let hasInitializedListeners = false;

export interface SyncResult {
  status: "synced" | "unmodified" | "offline" | "error";
  savedCount?: number;
  totalCategories?: number;
  catalogHash?: string;
  message?: string;
}

/**
 * Initialize or synchronize the PWA product cache
 */
export async function initializePwaCache(options?: { force?: boolean }): Promise<SyncResult> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return { status: "error", message: "IndexedDB not supported" };
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { status: "offline", message: "Device is currently offline" };
  }

  if (isSyncInProgress) {
    return { status: "error", message: "Sync already in progress" };
  }

  const now = Date.now();
  const lastSync = (await getCacheMeta<number>("last_sync_timestamp")) || 0;
  const storedHash = (await getCacheMeta<string>("catalog_hash")) || "";

  // Skip if synced recently unless force flag is set
  if (!options?.force && now - lastSync < SYNC_THROTTLE_MS && storedHash) {
    return { status: "unmodified", catalogHash: storedHash, message: "Cache is fresh" };
  }

  isSyncInProgress = true;

  try {
    const headers: Record<string, string> = {};
    if (storedHash && !options?.force) {
      headers["if-none-match"] = storedHash;
    }

    const res = await fetch("/api/products/category-cache?limit=25", {
      headers,
      cache: "no-store", // We manage cache explicitly via IndexedDB & ETag
    });

    if (res.status === 304) {
      // 304 Not Modified: Everything is up-to-date
      await setCacheMeta("last_sync_timestamp", now);
      dispatchSyncEvent({ status: "unmodified", catalogHash: storedHash });
      return { status: "unmodified", catalogHash: storedHash };
    }

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const { categories, productsByCategory, catalogHash, totalCachedProducts } = data;

    // 1. Save all category products and metadata to IndexedDB
    const { savedCount } = await saveTop25ByCategory(categories, productsByCategory, catalogHash);

    // 2. Request persistent storage from browser
    requestPersistentStorage().catch(() => {});

    // 3. Enqueue thumbnails for background pre-caching
    const allProducts = Object.values(productsByCategory).flat() as any[];
    enqueueProductThumbnails(allProducts, 1);

    // 4. Run LRU eviction check to keep storage healthy
    evictLRU(1000).catch(() => {});

    const result: SyncResult = {
      status: "synced",
      savedCount,
      totalCategories: categories.length,
      catalogHash,
    };

    dispatchSyncEvent(result);
    return result;
  } catch (err) {
    console.warn("[PWA Cache] Background sync error:", err);
    return { status: "error", message: (err as Error).message };
  } finally {
    isSyncInProgress = false;
  }
}

function dispatchSyncEvent(detail: SyncResult) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fooddecode:cache-synced", { detail }));
  }
}

/**
 * Setup background event listeners for network changes and app resume
 */
export function setupBackgroundSyncListeners(): void {
  if (typeof window === "undefined" || hasInitializedListeners) return;
  hasInitializedListeners = true;

  // On coming online: re-check cache
  window.addEventListener("online", () => {
    // Wait 2s for connection stability
    setTimeout(() => {
      initializePwaCache().catch(() => {});
    }, 2000);
  });

  // On app focus / tab visibility change:
  let lastFocusTime = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const elapsed = Date.now() - lastFocusTime;
      // If returning after more than 2 hours, run a check
      if (elapsed > 2 * 60 * 60 * 1000) {
        lastFocusTime = Date.now();
        initializePwaCache().catch(() => {});
      }
    } else {
      lastFocusTime = Date.now();
    }
  });
}
