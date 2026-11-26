export const IMAGE_CACHE_NAME = "fooddecode-thumbnails-v1";
export const MAX_CACHED_IMAGES = 250;
const CONCURRENT_DOWNLOAD_LIMIT = 3;

interface QueueItem {
  url: string;
  category?: string;
  priority: number; // Higher number = higher priority
}

class ThumbnailCacheQueue {
  private queue: QueueItem[] = [];
  private inFlight = 0;
  private isProcessing = false;
  private enqueuedUrls = new Set<string>();

  /**
   * Enqueue image URLs for background caching
   */
  public enqueueImages(images: { url: string; category?: string }[], priority: number = 1): void {
    if (typeof window === "undefined" || !("caches" in window)) return;

    for (const item of images) {
      if (!item.url || item.url.includes("placeholder")) continue;
      if (this.enqueuedUrls.has(item.url)) continue;

      this.enqueuedUrls.add(item.url);
      this.queue.push({
        url: item.url,
        category: item.category,
        priority,
      });
    }

    // Sort queue by priority descending
    this.queue.sort((a, b) => b.priority - a.priority);

    this.processQueue();
  }

  /**
   * Prioritize thumbnails of a specific category immediately
   */
  public prioritizeCategory(categoryName: string): void {
    for (const item of this.queue) {
      if (item.category === categoryName) {
        item.priority += 10;
      }
    }
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  /**
   * Process queue with concurrency control and idle scheduling
   */
  private processQueue(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const scheduleNext = () => {
      // Don't download images if offline or user requested data saver
      if (typeof navigator !== "undefined") {
        if (!navigator.onLine) {
          this.isProcessing = false;
          return;
        }

        const conn = (navigator as any).connection;
        if (conn && (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g")) {
          this.isProcessing = false;
          return;
        }
      }

      while (this.inFlight < CONCURRENT_DOWNLOAD_LIMIT && this.queue.length > 0) {
        const item = this.queue.shift();
        if (!item) break;

        this.inFlight++;
        this.cacheSingleThumbnail(item.url)
          .catch(() => {})
          .finally(() => {
            this.inFlight--;
            this.runOnIdle(scheduleNext);
          });
      }

      if (this.inFlight === 0 && this.queue.length === 0) {
        this.isProcessing = false;
        this.pruneImageCache(MAX_CACHED_IMAGES).catch(() => {});
      }
    };

    this.runOnIdle(scheduleNext);
  }

  /**
   * Cache a single thumbnail if not already present
   */
  private async cacheSingleThumbnail(url: string): Promise<boolean> {
    try {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const existing = await cache.match(url);
      if (existing) {
        return true; // Already cached
      }

      // Fetch with timeout and relaxed credentials
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        mode: url.startsWith("http") && !url.includes(window.location.host) ? "cors" : "no-cors",
        credentials: "omit",
      });

      clearTimeout(timeoutId);

      if (response && (response.status === 200 || response.type === "opaque")) {
        await cache.put(url, response);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Prune image cache if it exceeds max allowed images
   */
  public async pruneImageCache(maxItems: number = MAX_CACHED_IMAGES): Promise<number> {
    if (typeof window === "undefined" || !("caches" in window)) return 0;
    try {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const keys = await cache.keys();
      if (keys.length <= maxItems) return 0;

      const toDelete = keys.slice(0, keys.length - maxItems);
      let deleted = 0;
      for (const req of toDelete) {
        const ok = await cache.delete(req);
        if (ok) deleted++;
      }
      return deleted;
    } catch {
      return 0;
    }
  }

  /**
   * Helper to schedule work during browser idle periods
   */
  private runOnIdle(callback: () => void): void {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(callback, { timeout: 1000 });
    } else {
      setTimeout(callback, 60);
    }
  }
}

// Global singleton instance
export const thumbnailCacheQueue = new ThumbnailCacheQueue();

/**
 * Convenience helper to enqueue thumbnails for a set of products
 */
export function enqueueProductThumbnails(
  products: { imageUrl?: string | null; category?: string }[],
  priority: number = 1
): void {
  const images = products
    .filter((p) => Boolean(p.imageUrl) && !p.imageUrl?.includes("placeholder"))
    .map((p) => ({ url: p.imageUrl!, category: p.category }));

  thumbnailCacheQueue.enqueueImages(images, priority);
}

/**
 * Prioritize images for the active category
 */
export function prioritizeCategoryThumbnails(categoryName: string): void {
  thumbnailCacheQueue.prioritizeCategory(categoryName);
}
