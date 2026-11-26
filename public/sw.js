// FoodDecode Intelligent PWA Service Worker (v2)
const STATIC_CACHE = "fooddecode-static-v2";
const IMAGE_CACHE = "fooddecode-thumbnails-v1";
const API_CACHE = "fooddecode-api-v1";
const OFFLINE_URL = "/";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-512x512.png",
  "/icons/apple-touch-icon.png",
  "/favicon.ico",
  "/images/placeholder-product.svg"
];

// Install: Cache essential core shell assets and activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Claim clients and delete obsolete caches while preserving IMAGE_CACHE
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy based on request URL and type
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip chrome-extension, internal schemes, and non-http protocols
  if (!url.protocol.startsWith("http")) return;

  // 1. Category Top Products Batch Cache API (/api/products/category-cache): Stale-While-Revalidate
  if (url.pathname === "/api/products/category-cache") {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 2. Product Thumbnails & Packshots (/images/packshots/..., /images/..., /icons/...): Cache-First
  if (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/favicon.ico"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === "opaque")) {
            const responseToCache = networkResponse.clone();
            const targetCacheName = url.pathname.startsWith("/images/packshots/") || url.pathname.startsWith("/images/")
              ? IMAGE_CACHE
              : STATIC_CACHE;

            caches.open(targetCacheName).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If offline and requesting an image that failed, return placeholder if available
          if (url.pathname.startsWith("/images/")) {
            return caches.match("/images/placeholder-product.svg");
          }
          return null;
        });
      })
    );
    return;
  }

  // 3. Navigation requests (HTML pages): Network-first with offline shell fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(OFFLINE_URL).then((cached) => {
          return cached || new Response("You are currently offline. Please reconnect to continue using FoodDecode.", {
            headers: { "Content-Type": "text/html; charset=utf-8" }
          });
        });
      })
    );
    return;
  }

  // 4. Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
