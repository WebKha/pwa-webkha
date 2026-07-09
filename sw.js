// Nombre del almacenamiento en caché
const CACHE_NAME = 'webkha-cache-v1';

// Archivos mínimos obligatorios para almacenar en caché
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icono-512.png'
];

// Paso 1: Instalación del Service Worker y almacenamiento de archivos básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Paso 2: Activación y limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Paso 3: Responder con la caché o buscar en internet (Obligatorio para que sea instalable)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
