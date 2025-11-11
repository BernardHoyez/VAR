const CACHE_NAME = 'var-pwa-v1';
const urlsToCache = [
  '/VAR/var/',
  '/VAR/var/index.html',
  '/VAR/var/manifest.json',
  '/VAR/var/icon192.png',
  '/VAR/var/icon512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation en cours...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache: Network First avec fallback vers Cache
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Pour les fichiers Markdown sur GitHub, toujours essayer le réseau d'abord
  if (request.url.includes('raw.githubusercontent.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone la réponse pour la mettre en cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayer le cache
          return caches.match(request);
        })
    );
  } 
  // Pour les autres ressources, cache first
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            // Ne pas mettre en cache les réponses non-OK
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            
            return response;
          });
        })
        .catch(() => {
          // Page offline de secours (optionnel)
          return new Response(
            '<html><body><h1>Pas de connexion</h1><p>Veuillez vous reconnecter à Internet.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
  }
});