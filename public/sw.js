// @ts-nocheck
/// <reference types="webworker" />

const CACHE_PREFIX = 'noble-pwa-cache-';
const CACHE_NAME = `${CACHE_PREFIX}v14`;
const urlsToCache = [
  '/favicon.ico',
  '/manifest.json'
];

// @ts-ignore
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// @ts-ignore
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// @ts-ignore
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isLocalDevHost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '[::1]';
  const isViteDevRequest =
    url.pathname === '/@vite/client' ||
    url.pathname === '/@react-refresh' ||
    url.pathname.startsWith('/resources/') ||
    url.port === '5173' ||
    url.port === '5174' ||
    url.port === '5175';

  // Bypass for specific paths and external resources
  if (
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/telescope') ||
    url.pathname.startsWith('/build') || // Vite assets are handled by browser/Vite
    isLocalDevHost ||
    isViteDevRequest ||
    url.origin !== self.location.origin ||
    url.search.includes('refresh_token=true')
  ) {
    return;
  }

  // Navigation requests and redirect-sensitive requests must bypass the Service Worker.
  // These requests are often handled by the browser itself, especially when the server
  // returns a redirect response for root/document paths or auth redirects.
  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';
  const isRedirectSensitive = event.request.redirect !== 'follow';

  // Always bypass navigation requests and requests that don't follow redirects
  if (isNavigation || isRedirectSensitive) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(async response => {
        if (response) {
          return response;
        }

        try {
          const networkResponse = await fetch(event.request);

          // Do not cache redirects, or the browser can reject the response on replay.
          if (networkResponse.redirected) {
            return networkResponse;
          }

          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')
          ) {
            return networkResponse;
          }

          // Only cache static assets.
          // Do NOT cache HTML pages or Inertia JSON responses to prevent CSRF token staleness.
          const isAsset =
            /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico|webp)$/.test(url.pathname) ||
            url.pathname.startsWith('/build/');

          if (isAsset && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/broadcasting/')) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, networkResponse.clone());
          }

          return networkResponse;
        } catch (error) {
          // Fallback if network fails. Never resolve `undefined`, or the browser
          // treats it as a rejected FetchEvent response.
          const fallbackResponse = await caches.match(event.request);
          if (fallbackResponse) {
            return fallbackResponse;
          }

          return new Response('', {
            status: 503,
            statusText: 'Offline',
          });
        }
      })
  );
});
