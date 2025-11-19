const CACHE_NAME = 'life-grid-v2';

// Install event: clear old caches immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network first, then Cache, then Fallback
// This ensures we try to get the latest version, but save it for offline.
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests for simplicity in this demo environment
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('cdn.tailwindcss.com')) {
     return; 
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Return response if valid, and clone it to cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});