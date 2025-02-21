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

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Requests from Cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Clear Old Caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Clearing old cache...");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
