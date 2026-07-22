const CACHE = "flipx-tools-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./risk-reward-calculator.html",
  "./candle-pattern-validator.html",
  "./position-size-calculator.html",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./rr-manifest.json",
  "./candle-manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) => cached || new Response("Offline", { status: 503, statusText: "Offline" })
        )
      )
  );
});
