const SHELL_CACHE = 'crii-shell-v2';
const DATA_CACHE = 'crii-data-v2';
const ASSET_CACHE = 'crii-assets-v2';

const CORE_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/curiomas-no-bg.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/Eyekons.otf'
];

const CACHEABLE_API_PREFIXES = [
  '/api/academics',
  '/api/posts',
  '/api/divisions',
  '/api/cohorts',
  '/api/interns',
  '/api/datasets',
  '/api/settings',
  '/api/recruit'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(CORE_PRECACHE).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, DATA_CACHE, ASSET_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (msg.type === 'CACHE_OFFLINE_PACK') {
    const extraUrls = Array.isArray(msg.urls) ? msg.urls : [];
    const apiUrls = ['/api/academics', '/api/posts', '/api/divisions', '/api/settings'];
    event.waitUntil(
      Promise.all([
        caches.open(SHELL_CACHE).then((c) => c.addAll([...CORE_PRECACHE, ...extraUrls].filter(Boolean)).catch(() => {})),
        caches.open(DATA_CACHE).then((c) => Promise.all(apiUrls.map((u) => fetch(u).then((r) => r.ok ? c.put(u, r) : null).catch(() => null))))
      ]).then(() => {
        if (event.source && event.source.postMessage) {
          event.source.postMessage({ type: 'OFFLINE_PACK_READY', ts: Date.now() });
        }
      })
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/')))
    );
    return;
  }

  if (url.pathname.startsWith('/api/images/') || url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const netFetch = fetch(req).then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || netFetch;
        })
      )
    );
    return;
  }

  if (CACHEABLE_API_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cache.match(req).then((cached) => cached || new Response(JSON.stringify({ offline: true, error: 'Offline and not yet cached' }), { status: 503, headers: { 'Content-Type': 'application/json' } })))
      )
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
