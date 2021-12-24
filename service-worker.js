const timestamp = 1640375865192;
const build = [
  "/notes/_app/start-5942bc17.js",
  "/notes/_app/assets/start-d5b4de3e.css",
  "/notes/_app/pages/__layout.svelte-afc317a3.js",
  "/notes/_app/assets/pages/__layout.svelte-7cb0ab73.css",
  "/notes/_app/error.svelte-ef954d4d.js",
  "/notes/_app/pages/index.svelte-7ff7f92c.js",
  "/notes/_app/assets/pages/index.svelte-3e35cdcb.css",
  "/notes/_app/chunks/vendor-8e921715.js",
  "/notes/_app/assets/vendor-86f8c920.css",
  "/notes/_app/chunks/paths-28a87002.js",
  "/notes/_app/chunks/preload-helper-b6664b8f.js",
  "/notes/_app/chunks/index-7a1bb196.js",
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
