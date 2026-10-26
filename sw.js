/* Service worker: сайт открывается без сети (удобно, когда VPN «не работает»).
   HTML — сначала сеть, потом кеш; статика — из кеша с фоновым обновлением. */
const VERSION = 'djarb-v3';
const CORE = [
  'index.html','diag.html','fix.html','vless.html','happ.html','incy.html','setup.html','glossary.html','compare.html',
  'style.css','mobile.css','mobile.js','layout.js','auth.js','config.js','catalog.js','meta.js','apps-about.js',
  'vless.js','happ.js','incy.js','extra.js','more-errors.js','fix.js','smart-diag.js',
  'page-home.js','page-diag.js','page-fix.js','page-vless.js','page-happ.js','page-incy.js','page-setup.js','page-glossary.js','setup.js',
  'icon.svg','manifest.webmanifest'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
