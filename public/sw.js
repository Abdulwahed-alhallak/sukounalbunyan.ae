const CACHE_NAME = 'noble-pwa-cache-v7';
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
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Navigation requests: Network First, or simply don't intercept to avoid redirect issues
  if (event.request.mode === 'navigate') {
    // We let navigation requests go to the network directly to handle redirects properly
    // This fixes "redirected response was used for a request whose redirect mode is not 'follow'"
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
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Don't cache dynamic or private data paths
                if (!url.pathname.startsWith('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
        });
      })
  );
});
