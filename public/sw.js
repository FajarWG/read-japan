// Read Japan — Service Worker
// Strategi caching untuk offline mode

const CACHE_VERSION = "v1";
const STATIC_CACHE = `read-japan-static-${CACHE_VERSION}`;
const PAGES_CACHE = `read-japan-pages-${CACHE_VERSION}`;
const IMAGES_CACHE = `read-japan-images-${CACHE_VERSION}`;

// File yang di-pre-cache saat install
const PRECACHE_ASSETS = ["/", "/kana", "/learn", "/offline"];

// Install: pre-cache halaman utama
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// Activate: hapus cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== STATIC_CACHE &&
                key !== PAGES_CACHE &&
                key !== IMAGES_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: strategi caching per tipe request
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Abaikan request non-HTTP/HTTPS
  if (!request.url.startsWith("http")) return;

  // Abaikan request ke analytics, vercel, dll
  if (
    url.hostname.includes("vercel") ||
    url.hostname.includes("analytics") ||
    url.pathname.startsWith("/_vercel")
  )
    return;

  // Abaikan POST/PUT/DELETE (mutasi data)
  if (request.method !== "GET") return;

  // 1. Gambar → Cache First (jarang berubah)
  if (request.destination === "image") {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  // 2. Aset statis Next.js (_next/static) → Cache First
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  // 3. API routes → Network First (data terbaru), fallback ke cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // 4. Halaman navigasi → Network First, fallback cache, lalu /offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/offline")),
        ),
    );
    return;
  }
});
