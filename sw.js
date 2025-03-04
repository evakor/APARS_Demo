const CACHE_NAME = "apars-cache-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/css/style.css",
    "/js/app.js",
    "https://unpkg.com/mqtt/dist/mqtt.min.js",
    "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
    "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
