const CACHE_NAME = 'noble-pwa-cache-v11';
const urlsToCache = [
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass for specific paths and external resources
  if (
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/telescope') ||
    url.pathname.startsWith('/build') || // Vite assets are handled by browser/Vite
    url.origin !== self.location.origin ||
    url.search.includes('refresh_token=true')
  ) {
    return;
  }

  // Navigation requests: Bypass Service Worker to handle redirects correctly
  if (event.request.mode === 'navigate') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
            // If the response is redirected, do NOT cache it and return it as is
            // This prevents "redirected response was used for a request whose redirect mode is not 'follow'"
            if (response.redirected) {
              return response;
            }

            // Check if we received a valid response.
            if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Only cache static assets (js, css, images, fonts)
                // Do NOT cache HTML pages or Inertia JSON responses to prevent CSRF token staleness
                const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico|webp)$/.test(url.pathname) || 
                                url.pathname.startsWith('/build/');
                
                if (isAsset && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/broadcasting/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(error => {
          // Fallback if network fails
          return caches.match(event.request);
        });
      })
  );
});
