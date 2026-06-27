const CACHE = 'codingrpg-v2';
const ASSETS = [
  '/coding-rpg/',
  '/coding-rpg/index.html',
  '/coding-rpg/manifest.json',
  '/coding-rpg/favicon.png',
  '/coding-rpg/favicon.ico',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Cache static assets (JS, CSS, images, fonts)
  if (/\.(js|css|png|jpg|svg|woff2?|ico)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Navigation & API: network-first, fallback to cache
  e.respondWith(
    fetch(e.request).then((res) => {
      const clone = res.clone();
      if (res.ok && res.type === 'basic') {
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request).then((cached) => cached || caches.match('/coding-rpg/index.html')))
  );
});