import { SlimProductItem, ProductItem } from "@/types";
import { mapToSlimProduct } from "@/lib/product-mapper";

export const DB_NAME = "fooddecode_cache_db";
export const DB_VERSION = 1;

export interface CachedProductRecord extends SlimProductItem {
  isTop25: boolean;
  priority: number; // 1 = Top 25 Category, 2 = User Viewed, 3 = Paginated
  cachedAt: number;
  lastAccessed: number;
}

export interface CachedCategoryRecord {
  name: string;
  slug: string;
  totalCount: number;
  cachedCount: number;
  icon?: string;
  description?: string;
  lastUpdated: number;
}

export interface CacheDiagnosticsReport {
  isSupported: boolean;
  productCount: number;
  categoryCount: number;
  imageCount: number;
  catalogHash: string | null;
  lastSyncedAt: number | null;
  storageUsageBytes: number;
  storageQuotaBytes: number;
  percentUsed: number;
  isPersistent: boolean;
}

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize or retrieve the open IndexedDB instance
 */
export function getIDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB is not supported in this environment"));
  }

  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // 1. Products store
      if (!db.objectStoreNames.contains("products")) {
        const productStore = db.createObjectStore("products", { keyPath: "id" });
        productStore.createIndex("category", "category", { unique: false });
        productStore.createIndex("categorySlug", "categorySlug", { unique: false });
        productStore.createIndex("priority", "priority", { unique: false });
        productStore.createIndex("lastAccessed", "lastAccessed", { unique: false });
        productStore.createIndex("cachedAt", "cachedAt", { unique: false });
      }

      // 2. Categories store
      if (!db.objectStoreNames.contains("categories")) {
        const categoryStore = db.createObjectStore("categories", { keyPath: "name" });
        categoryStore.createIndex("slug", "slug", { unique: false });
      }

      // 3. Meta store
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
        dbPromise = null;
      };
      resolve(dbInstance);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error || new Error("Failed to open IndexedDB"));
    };
  });

  return dbPromise;
}

/**
 * Persist the top 25 products from each category in a single transaction
 */
export async function saveTop25ByCategory(
  categories: { name: string; slug: string; totalCount?: number; cachedCount?: number; icon?: string; description?: string }[],
  productsByCategory: Record<string, SlimProductItem[]>,
  catalogHash: string
): Promise<{ savedCount: number }> {
  const db = await getIDB();
  const now = Date.now();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products", "categories", "meta"], "readwrite");
    const productStore = tx.objectStore("products");
    const categoryStore = tx.objectStore("categories");
    const metaStore = tx.objectStore("meta");

    let savedCount = 0;

    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve({ savedCount });

    // 1. Save Category metadata
    for (const cat of categories) {
      const catRecord: CachedCategoryRecord = {
        name: cat.name,
        slug: cat.slug,
        totalCount: cat.totalCount || 0,
        cachedCount: (productsByCategory[cat.name] || []).length,
        icon: cat.icon,
        description: cat.description,
        lastUpdated: now,
      };
      categoryStore.put(catRecord);
    }

    // 2. Save products (Priority 1 = Top 25)
    for (const [catName, products] of Object.entries(productsByCategory)) {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      for (const prod of products) {
        const prodId = prod.id || prod._id || prod.barcode;
        if (!prodId) continue;

        const record: CachedProductRecord = {
          ...prod,
          id: prodId,
          _id: prodId,
          category: catName,
          categorySlug: prod.categorySlug || slug,
          isTop25: true,
          priority: 1,
          cachedAt: now,
          lastAccessed: now,
        };

        productStore.put(record);
        savedCount++;
      }
    }

    // 3. Save sync metadata
    metaStore.put({ key: "catalog_hash", value: catalogHash });
    metaStore.put({ key: "last_sync_timestamp", value: now });
    metaStore.put({ key: "cache_version", value: "1.0" });
  });
}

/**
 * Retrieve cached products by category name or slug
 */
export async function getCachedProductsByCategory(categoryOrSlug: string): Promise<SlimProductItem[]> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readonly");
      const store = tx.objectStore("products");

      const trimmed = categoryOrSlug.trim();
      const isSlug = trimmed.includes("-") && trimmed === trimmed.toLowerCase();
      const indexName = isSlug ? "categorySlug" : "category";
      const index = store.index(indexName);

      const request = index.getAll(IDBKeyRange.only(trimmed));

      request.onsuccess = () => {
        let results = request.result as CachedProductRecord[];
        if ((!results || results.length === 0) && isSlug) {
          // Fallback: search all products if slug didn't match exact index
          const allReq = store.getAll();
          allReq.onsuccess = () => {
            const all = allReq.result as CachedProductRecord[];
            const matched = all.filter(
              (p) =>
                p.categorySlug === trimmed ||
                p.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === trimmed
            );
            matched.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
            resolve(matched);
          };
          allReq.onerror = () => resolve([]);
          return;
        }

        results.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
        resolve(results);
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Retrieve all cached products across all categories
 */
export async function getAllCachedProducts(): Promise<SlimProductItem[]> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readonly");
      const store = tx.objectStore("products");
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as CachedProductRecord[];
        results.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
        resolve(results);
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Retrieve a single product by ID or barcode from cache and update lastAccessed
 */
export async function getCachedProductById(idOrBarcode: string): Promise<CachedProductRecord | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readwrite");
      const store = tx.objectStore("products");
      const request = store.get(idOrBarcode);

      request.onsuccess = () => {
        const item = request.result as CachedProductRecord | undefined;
        if (item) {
          item.lastAccessed = Date.now();
          store.put(item);
          resolve(item);
        } else {
          // If not found by key, search by barcode
          const allReq = store.getAll();
          allReq.onsuccess = () => {
            const found = (allReq.result as CachedProductRecord[]).find(
              (p) => p.barcode === idOrBarcode || p._id === idOrBarcode
            );
            if (found) {
              found.lastAccessed = Date.now();
              store.put(found);
            }
            resolve(found || null);
          };
          allReq.onerror = () => resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

/**
 * Cache a product viewed by the user (Priority 2)
 */
export async function saveViewedProduct(product: ProductItem | SlimProductItem): Promise<void> {
  try {
    const db = await getIDB();
    const prodId = product.id || product._id || product.barcode;
    if (!prodId) return;

    const now = Date.now();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readwrite");
      const store = tx.objectStore("products");

      const getReq = store.get(prodId);
      getReq.onsuccess = () => {
        const existing = getReq.result as CachedProductRecord | undefined;
        const slim = mapToSlimProduct(product);
        const record: CachedProductRecord = {
          ...slim,
          id: prodId,
          _id: prodId,
          // Preserve priority 1 if it was already in top 25; otherwise mark priority 2 (user viewed)
          priority: existing?.priority === 1 ? 1 : 2,
          isTop25: existing?.isTop25 ?? false,
          cachedAt: existing?.cachedAt || now,
          lastAccessed: now,
        };

        store.put(record);
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Non-blocking fail-safe
  }
}

/**
 * Retrieve all cached categories
 */
export async function getAllCachedCategories(): Promise<CachedCategoryRecord[]> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("categories", "readonly");
      const store = tx.objectStore("categories");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as CachedCategoryRecord[]);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Get meta value from IndexedDB
 */
export async function getCacheMeta<T = any>(key: string): Promise<T | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("meta", "readonly");
      const store = tx.objectStore("meta");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

/**
 * Set meta value in IndexedDB
 */
export async function setCacheMeta(key: string, value: any): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("meta", "readwrite");
      const store = tx.objectStore("meta");
      store.put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
}

/**
 * LRU Eviction: When cache exceeds maxProducts, delete lowest priority and oldest items.
 * Preserves Priority 1 (Top 25) products unless strictly necessary.
 */
export async function evictLRU(maxProducts: number = 1000): Promise<number> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readwrite");
      const store = tx.objectStore("products");
      const request = store.getAll();

      request.onsuccess = () => {
        const all = request.result as CachedProductRecord[];
        if (all.length <= maxProducts) {
          resolve(0);
          return;
        }

        const overflow = all.length - maxProducts;

        // Sort items by priority descending (Priority 3 first, then 2, then 1), then oldest lastAccessed
        const candidates = all
          .filter((p) => p.priority > 1) // First consider paginated and viewed items
          .sort((a, b) => b.priority - a.priority || a.lastAccessed - b.lastAccessed);

        let evicted = 0;
        for (let i = 0; i < overflow && i < candidates.length; i++) {
          store.delete(candidates[i].id);
          evicted++;
        }

        resolve(evicted);
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    return 0;
  }
}

/**
 * Query browser Storage API quota
 */
export async function getStorageQuota(): Promise<{
  usageBytes: number;
  quotaBytes: number;
  percentUsed: number;
  isPersistent: boolean;
}> {
  if (typeof window === "undefined" || !navigator.storage || !navigator.storage.estimate) {
    return { usageBytes: 0, quotaBytes: 0, percentUsed: 0, isPersistent: false };
  }

  try {
    const [estimate, isPersistent] = await Promise.all([
      navigator.storage.estimate(),
      navigator.storage.persisted ? navigator.storage.persisted() : Promise.resolve(false),
    ]);

    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percent = quota > 0 ? (usage / quota) * 100 : 0;

    return {
      usageBytes: usage,
      quotaBytes: quota,
      percentUsed: Math.round(percent * 10) / 10,
      isPersistent,
    };
  } catch {
    return { usageBytes: 0, quotaBytes: 0, percentUsed: 0, isPersistent: false };
  }
}

/**
 * Request persistent browser storage so Safari / Chrome won't evict the cache
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.storage || !navigator.storage.persist) {
    return false;
  }

  try {
    const isAlreadyPersisted = await navigator.storage.persisted();
    if (isAlreadyPersisted) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/**
 * Clear all IndexedDB stores
 */
export async function clearAllCache(): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["products", "categories", "meta"], "readwrite");
      tx.objectStore("products").clear();
      tx.objectStore("categories").clear();
      tx.objectStore("meta").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
}

/**
 * Full diagnostics summary
 */
export async function getCacheDiagnostics(): Promise<CacheDiagnosticsReport> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return {
      isSupported: false,
      productCount: 0,
      categoryCount: 0,
      imageCount: 0,
      catalogHash: null,
      lastSyncedAt: null,
      storageUsageBytes: 0,
      storageQuotaBytes: 0,
      percentUsed: 0,
      isPersistent: false,
    };
  }

  try {
    const [db, quota, catalogHash, lastSyncedAt] = await Promise.all([
      getIDB(),
      getStorageQuota(),
      getCacheMeta<string>("catalog_hash"),
      getCacheMeta<number>("last_sync_timestamp"),
    ]);

    const [productCount, categoryCount] = await Promise.all([
      new Promise<number>((res) => {
        const tx = db.transaction("products", "readonly");
        const req = tx.objectStore("products").count();
        req.onsuccess = () => res(req.result);
        req.onerror = () => res(0);
      }),
      new Promise<number>((res) => {
        const tx = db.transaction("categories", "readonly");
        const req = tx.objectStore("categories").count();
        req.onsuccess = () => res(req.result);
        req.onerror = () => res(0);
      }),
    ]);

    // Check Cache Storage for image count
    let imageCount = 0;
    if ("caches" in window) {
      try {
        const imageCache = await caches.open("fooddecode-thumbnails-v1");
        const keys = await imageCache.keys();
        imageCount = keys.length;
      } catch {}
    }

    return {
      isSupported: true,
      productCount,
      categoryCount,
      imageCount,
      catalogHash,
      lastSyncedAt,
      storageUsageBytes: quota.usageBytes,
      storageQuotaBytes: quota.quotaBytes,
      percentUsed: quota.percentUsed,
      isPersistent: quota.isPersistent,
    };
  } catch {
    return {
      isSupported: true,
      productCount: 0,
      categoryCount: 0,
      imageCount: 0,
      catalogHash: null,
      lastSyncedAt: null,
      storageUsageBytes: 0,
      storageQuotaBytes: 0,
      percentUsed: 0,
      isPersistent: false,
    };
  }
}
