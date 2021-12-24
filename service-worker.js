const timestamp = 1640380447946;
const build = [
  "/notes/_app/start-8918ec4c.js",
  "/notes/_app/assets/start-d5b4de3e.css",
  "/notes/_app/pages/__layout.svelte-3cb45a39.js",
  "/notes/_app/assets/pages/__layout.svelte-b3bc0113.css",
  "/notes/_app/error.svelte-f415c75b.js",
  "/notes/_app/pages/index.svelte-ba4fbbf2.js",
  "/notes/_app/assets/pages/index.svelte-3e35cdcb.css",
  "/notes/_app/chunks/vendor-6caafef3.js",
  "/notes/_app/assets/vendor-86f8c920.css",
  "/notes/_app/chunks/paths-28a87002.js",
  "/notes/_app/chunks/preload-helper-b6664b8f.js",
  "/notes/_app/chunks/index-6f94a413.js",
  "/notes/_app/chunks/widget-3e963cc8.js"
];
const files = [
  "/notes/favicon.png",
  "/notes/icon.png",
  "/notes/manifest.json",
  "/notes/robots.txt"
];
const CACHE_NAME = `static-cache-v${timestamp}`;
const FILES_TO_CACHE = [...build, ...files];
self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    console.log("[ServiceWorker] Pre-caching offline page");
    return cache.addAll(FILES_TO_CACHE);
  }));
  self.skipWaiting();
});
self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");
  evt.waitUntil(caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
    if (key !== CACHE_NAME) {
      console.log("[ServiceWorker] Removing old cache", key);
      return caches.delete(key);
    }
  }))));
  self.clients.claim();
});
self.addEventListener("fetch", (evt) => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.mode !== "navigate") {
    return;
  }
  evt.respondWith(fetch(evt.request).catch(() => caches.open(CACHE_NAME).then((cache) => cache.match("offline.html"))));
});
