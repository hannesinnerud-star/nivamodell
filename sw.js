// Service worker: lagrer appen lokalt slik at den virker uten nett.
// Øk VERSION når filene endres, så henter elevene den nye versjonen.
const VERSION = 'nivaregulering-v3';
const FILES = [
  './', './index.html', './manifest.webmanifest', './fonts.css',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './fonts/ibm-plex-sans-condensed-latin-400-normal.woff2',
  './fonts/ibm-plex-sans-condensed-latin-500-normal.woff2',
  './fonts/ibm-plex-sans-condensed-latin-600-normal.woff2',
  './fonts/ibm-plex-sans-condensed-latin-700-normal.woff2',
  './fonts/ibm-plex-mono-latin-400-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2',
  './fonts/ibm-plex-mono-latin-600-normal.woff2'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Nett først for selve siden (får nyeste versjon når det er nett), cache først for resten.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
