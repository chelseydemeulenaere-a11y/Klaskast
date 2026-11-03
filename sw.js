const CACHE = "klaskast-v3";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest", "./privacy.html",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  "./tess-worker.min.js", "./tess-core.wasm.js", "./nld-traineddata.bin"
];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // Online first so updates arrive; the saved copy when there is no internet
  e.respondWith(fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req).then((r) => r || caches.match("./index.html"))));
});
