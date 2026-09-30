/* Service Worker de PPSSPP Web (track psp del proyecto emulador).
 * Cachea ÚNICAMENTE el shell de la app (HTML/JS/CSS/WASM/runtime/iconos/manifiesto).
 * NUNCA cachea contenido del usuario: los juegos se cargan desde archivos locales
 * del dispositivo (input file) y los guardados viven en OPFS/IndexedDB del navegador.
 * Cualquier petición que no sea parte del shell se sirve solo de red, sin cachear.
 */
const CACHE = 'ppsspp-shell-v2';
const SHELL = [
  './',
  './index.html',
  './main-MIIWU7DR.js',
  './styles-SL6FIHK4.css',
  './ppsspp-runtime.js',
  './manifest.json',
  './homebrew/catalog.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './build-wasm/PPSSPPSDL.js',
  './build-wasm/PPSSPPSDL.wasm',
  './build-wasm/PPSSPPSDL.data',
  './LICENSE.TXT'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isShellFile(url) {
  const path = new URL(url).pathname.replace(/\/$/, '/index.html');
  const base = new URL('./', self.location.href).pathname;
  const rel = './' + path.slice(base.length);
  return SHELL.includes(rel) || SHELL.includes(rel.replace('./', ''));
}

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Solo mismo origen. Nunca interceptar blob:, data:, ni otros orígenes.
  if (url.origin !== self.location.origin) return;
  if (!isShellFile(request.url)) return; // contenido del usuario: solo red, sin caché
  e.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (hit) => hit || fetch(request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
    )
  );
});
