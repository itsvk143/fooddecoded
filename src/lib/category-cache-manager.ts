import { SlimProductItem } from "@/types";
import { normalizeCategoryCacheKey } from "./category-matcher";

export interface CategoryRequestKeyParams {
  category: string;
  subCategory?: string;
  page?: number;
  sortBy?: string;
  filters?: Record<string, string | boolean | undefined>;
}

export interface CategoryCacheEntry {
  key: string;
  category: string;
  products: SlimProductItem[];
  fetchedAt: number;
  expiresAt: number;
  staleUntil: number;
  lastAccessed: number;
}

export type CacheLookupResult =
  | { status: "fresh"; products: SlimProductItem[]; entry: CategoryCacheEntry }
  | { status: "stale"; products: SlimProductItem[]; entry: CategoryCacheEntry }
  | { status: "miss"; products: null; entry: null };

interface InFlightRequest {
  key: string;
  promise: Promise<SlimProductItem[]>;
  controller: AbortController;
  consumers: number;
  startedAt: number;
}

export interface CategoryPerformanceMetrics {
  categoryClickToFirstContentMs: number | null;
  lastApiResponseDurationMs: number | null;
  avgApiResponseDurationMs: number | null;
  cacheHitCount: number;
  staleHitCount: number;
  cacheMissCount: number;
  cacheHitRatio: number;
  duplicateApiRequestCount: number;
  abortedRequestCount: number;
  failedRequestCount: number;
  idbFailureCount: number;
  skeletonDisplayDurationMs: number | null;
  productRenderDurationMs: number | null;
  cacheSize: number;
  inFlightCount: number;
}

export interface CategoryCacheOptions {
  maxEntries?: number;
  freshTtlMs?: number;
  staleTtlMs?: number;
}

export const DEFAULT_FRESH_TTL_MS = 60_000; // 60 seconds fresh window
export const DEFAULT_STALE_TTL_MS = 5 * 60_000; // 5 minutes stale-while-revalidate window
export const DEFAULT_MAX_CACHE_ENTRIES = 24;

/**
 * Build deterministic unique request key encoding:
 * category + subCategory + page + sort + filters
 */
export function buildCategoryRequestKey(params: CategoryRequestKeyParams): string {
  const cat = normalizeCategoryCacheKey(params.category);
  const sub = (params.subCategory || "").trim().toLowerCase();
  const page = Math.max(1, params.page || 1);
  const sort = (params.sortBy || "score").trim().toLowerCase();

  const filterEntries = Object.entries(params.filters || {})
    .filter(([, v]) => v !== undefined && v !== "" && v !== false && v !== "All")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${String(v)}`);

  return `cat=${cat}|sub=${sub}|p=${page}|sort=${sort}|f=${filterEntries.join("&")}`;
}

function safePerfNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function safePerfMark(name: string): void {
  if (typeof performance !== "undefined" && typeof performance.mark === "function") {
    try {
      performance.mark(name);
    } catch {
      // Ignore in constrained environments
    }
  }
}

function safePerfMeasure(name: string, startMark: string, endMark: string): void {
  if (typeof performance !== "undefined" && typeof performance.measure === "function") {
    try {
      performance.measure(name, startMark, endMark);
    } catch {
      // Ignore missing marks
    }
  }
}

export class CategoryCacheManager {
  private cache = new Map<string, CategoryCacheEntry>();
  private inFlight = new Map<string, InFlightRequest>();
  private maxEntries: number;
  private freshTtlMs: number;
  private staleTtlMs: number;

  private apiDurations: number[] = [];
  private metrics = {
    categoryClickToFirstContentMs: null as number | null,
    lastApiResponseDurationMs: null as number | null,
    cacheHitCount: 0,
    staleHitCount: 0,
    cacheMissCount: 0,
    duplicateApiRequestCount: 0,
    abortedRequestCount: 0,
    failedRequestCount: 0,
    idbFailureCount: 0,
    skeletonDisplayDurationMs: null as number | null,
    productRenderDurationMs: null as number | null,
  };

  constructor(options: CategoryCacheOptions = {}) {
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_CACHE_ENTRIES;
    this.freshTtlMs = options.freshTtlMs ?? DEFAULT_FRESH_TTL_MS;
    this.staleTtlMs = options.staleTtlMs ?? DEFAULT_STALE_TTL_MS;
  }

  public get(key: string, now: number = Date.now()): CacheLookupResult {
    const entry = this.cache.get(key);
    if (!entry) {
      return { status: "miss", products: null, entry: null };
    }

    if (now > entry.staleUntil) {
      this.cache.delete(key);
      return { status: "miss", products: null, entry: null };
    }

    entry.lastAccessed = now;
    // Maintain LRU insertion order
    this.cache.delete(key);
    this.cache.set(key, entry);

    if (now <= entry.expiresAt) {
      return { status: "fresh", products: entry.products, entry };
    }

    return { status: "stale", products: entry.products, entry };
  }

  public set(
    key: string,
    category: string,
    products: SlimProductItem[],
    now: number = Date.now(),
    customFreshTtlMs?: number
  ): CategoryCacheEntry {
    const freshTtl = customFreshTtlMs ?? this.freshTtlMs;
    const existing = this.cache.get(key);

    // Prevent stale write overwriting newer cached entry
    if (existing && existing.fetchedAt > now) {
      return existing;
    }

    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (first key in Map iteration order)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CategoryCacheEntry = {
      key,
      category,
      products,
      fetchedAt: now,
      expiresAt: now + freshTtl,
      staleUntil: now + Math.max(freshTtl, this.staleTtlMs),
      lastAccessed: now,
    };

    this.cache.set(key, entry);
    return entry;
  }

  public invalidate(target?: string): void {
    if (!target) {
      this.cache.clear();
      return;
    }
    if (this.cache.has(target)) {
      this.cache.delete(target);
      return;
    }
    const normalizedTarget = normalizeCategoryCacheKey(target);
    for (const [key, entry] of this.cache.entries()) {
      if (normalizeCategoryCacheKey(entry.category) === normalizedTarget || key.includes(`cat=${normalizedTarget}|`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Deduplicated in-flight request registry with consumer ref-counting.
   * Cancelling one consumer only aborts the underlying fetch if ZERO active consumers remain.
   */
  public acquireRequest(
    key: string,
    fetcher: (signal: AbortSignal) => Promise<SlimProductItem[]>
  ): {
    promise: Promise<SlimProductItem[]>;
    isDeduplicated: boolean;
    release: (abortIfUnused?: boolean) => void;
  } {
    const existing = this.inFlight.get(key);
    if (existing) {
      existing.consumers += 1;
      this.metrics.duplicateApiRequestCount += 1;

      let released = false;
      const release = (abortIfUnused = true) => {
        if (released) return;
        released = true;
        existing.consumers = Math.max(0, existing.consumers - 1);
        if (abortIfUnused && existing.consumers === 0) {
          if (!existing.controller.signal.aborted) {
            this.metrics.abortedRequestCount += 1;
            existing.controller.abort();
          }
          if (this.inFlight.get(key) === existing) {
            this.inFlight.delete(key);
          }
        }
      };

      return { promise: existing.promise, isDeduplicated: true, release };
    }

    const controller = new AbortController();
    const startedAt = safePerfNow();
    safePerfMark(`fd:req-start:${key}`);

    const promise = fetcher(controller.signal)
      .then((items) => {
        const duration = safePerfNow() - startedAt;
        this.recordApiDuration(duration);
        safePerfMark(`fd:req-end:${key}`);
        safePerfMeasure(`fd:req-duration:${key}`, `fd:req-start:${key}`, `fd:req-end:${key}`);
        return items;
      })
      .catch((err) => {
        if (err?.name === "AbortError" || controller.signal.aborted) {
          // Aborted requests tracked cleanly without counting as network errors
        } else {
          this.metrics.failedRequestCount += 1;
        }
        throw err;
      })
      .finally(() => {
        if (this.inFlight.get(key) === entry) {
          this.inFlight.delete(key);
        }
      });

    const entry: InFlightRequest = {
      key,
      controller,
      consumers: 1,
      startedAt,
      promise,
    };

    this.inFlight.set(key, entry);

    let released = false;
    const release = (abortIfUnused = true) => {
      if (released) return;
      released = true;
      entry.consumers = Math.max(0, entry.consumers - 1);
      if (abortIfUnused && entry.consumers === 0) {
        if (!entry.controller.signal.aborted) {
          this.metrics.abortedRequestCount += 1;
          entry.controller.abort();
        }
        if (this.inFlight.get(key) === entry) {
          this.inFlight.delete(key);
        }
      }
    };

    return { promise: entry.promise, isDeduplicated: false, release };
  }

  public abortAll(): void {
    for (const entry of this.inFlight.values()) {
      if (!entry.controller.signal.aborted) {
        this.metrics.abortedRequestCount += 1;
        entry.controller.abort();
      }
    }
    this.inFlight.clear();
  }

  public recordCacheHit(type: "fresh" | "stale"): void {
    if (type === "fresh") {
      this.metrics.cacheHitCount += 1;
    } else {
      this.metrics.staleHitCount += 1;
    }
  }

  public recordCacheMiss(): void {
    this.metrics.cacheMissCount += 1;
  }

  public recordIdbFailure(): void {
    this.metrics.idbFailureCount += 1;
  }

  public recordClickToFirstContent(durationMs: number): void {
    this.metrics.categoryClickToFirstContentMs = Math.round(durationMs * 100) / 100;
  }

  public recordSkeletonDuration(durationMs: number): void {
    this.metrics.skeletonDisplayDurationMs = Math.round(durationMs * 100) / 100;
  }

  public recordRenderDuration(durationMs: number): void {
    this.metrics.productRenderDurationMs = Math.round(durationMs * 100) / 100;
  }

  private recordApiDuration(durationMs: number): void {
    const rounded = Math.round(durationMs * 100) / 100;
    this.metrics.lastApiResponseDurationMs = rounded;
    this.apiDurations.push(rounded);
    if (this.apiDurations.length > 50) {
      this.apiDurations.shift();
    }
  }

  public getMetrics(): CategoryPerformanceMetrics {
    const totalLookups =
      this.metrics.cacheHitCount + this.metrics.staleHitCount + this.metrics.cacheMissCount;
    const hitRatio =
      totalLookups > 0
        ? Math.round(((this.metrics.cacheHitCount + this.metrics.staleHitCount) / totalLookups) * 1000) / 1000
        : 0;
    const avgApi =
      this.apiDurations.length > 0
        ? Math.round((this.apiDurations.reduce((a, b) => a + b, 0) / this.apiDurations.length) * 100) / 100
        : null;

    return {
      categoryClickToFirstContentMs: this.metrics.categoryClickToFirstContentMs,
      lastApiResponseDurationMs: this.metrics.lastApiResponseDurationMs,
      avgApiResponseDurationMs: avgApi,
      cacheHitCount: this.metrics.cacheHitCount,
      staleHitCount: this.metrics.staleHitCount,
      cacheMissCount: this.metrics.cacheMissCount,
      cacheHitRatio: hitRatio,
      duplicateApiRequestCount: this.metrics.duplicateApiRequestCount,
      abortedRequestCount: this.metrics.abortedRequestCount,
      failedRequestCount: this.metrics.failedRequestCount,
      idbFailureCount: this.metrics.idbFailureCount,
      skeletonDisplayDurationMs: this.metrics.skeletonDisplayDurationMs,
      productRenderDurationMs: this.metrics.productRenderDurationMs,
      cacheSize: this.cache.size,
      inFlightCount: this.inFlight.size,
    };
  }

  public resetMetrics(): void {
    this.apiDurations = [];
    this.metrics = {
      categoryClickToFirstContentMs: null,
      lastApiResponseDurationMs: null,
      cacheHitCount: 0,
      staleHitCount: 0,
      cacheMissCount: 0,
      duplicateApiRequestCount: 0,
      abortedRequestCount: 0,
      failedRequestCount: 0,
      idbFailureCount: 0,
      skeletonDisplayDurationMs: null,
      productRenderDurationMs: null,
    };
  }
}

export const categoryCacheManager = new CategoryCacheManager();
