/* Service Worker — Deteksi Nitrogen Padi (versi flat root) */
const CACHE_VERSION = 'nitrogen-padi-v1';
const ASET = [
  './', './index.html', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(ASET)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
  );
});
