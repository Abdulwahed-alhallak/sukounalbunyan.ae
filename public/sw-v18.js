// @ts-nocheck
/* eslint-disable */
const CACHE_PREFIX = 'noble-pwa-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v18';
const urlsToCache = [
    './favicon.ico',
    './manifest.json'
];

// 1. Installation: Cache core assets 
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// 2. Activation: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch: Safe intercept
self.addEventListener('fetch', (event) => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // CRITICAL: NEVER intercept navigation requests to prevent reload loops
    if (event.request.mode === 'navigate') {
        return;
    }

    // Bypass conditions
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isVite = url.port === '5173' || url.pathname.includes('@vite') || url.pathname.includes('@react-refresh');
    const isAuth = url.pathname.includes('/login') || url.pathname.includes('/register');
    const isApi = url.pathname.includes('/api') || url.pathname.includes('/telescope');
    const isBuild = url.pathname.includes('/build');
    const isExternal = url.origin !== self.location.origin;

    if (isLocal || isVite || isAuth || isApi || isBuild || isExternal) {
        return;
    }

    // Only cache static assets with known extensions
    const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico|webp)$/.test(url.pathname);
    if (!isAsset) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;

            return fetch(event.request).then((networkResponse) => {
                // Verify valid response before caching
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((pwaCache) => {
                    pwaCache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                return caches.match(event.request);
            });
        })
    );
});
