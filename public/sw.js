// @ts-nocheck
/* eslint-disable */
const CACHE_PREFIX = 'noble-pwa-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v15';
const urlsToCache = [
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Bypass conditions
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isVite = url.port === '5173' || url.pathname.includes('@vite') || url.pathname.includes('@react-refresh');
  const isAuth = url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
  const isApi = url.pathname.startsWith('/api') || url.pathname.startsWith('/telescope');
  const isBuild = url.pathname.startsWith('/build');
  const isExternal = url.origin !== self.location.origin;
  const isManualRefresh = url.search.includes('refresh_token=true');
  const isNavigation = event.request.mode === 'navigate';

  if (isLocal || isVite || isAuth || isApi || isBuild || isExternal || isManualRefresh || isNavigation) {
    return;
  }

  // Fallback for static assets only
  const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico|webp)$/.test(url.pathname);

  if (!isAsset) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      });
    })
  );
});
