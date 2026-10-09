/* VAULT — service worker : l'application complète est mise en cache pour fonctionner sans réseau.
 * Version de cache : vault-2.0.0-e959171fc7 (elle change à chaque modification de l'application). */
const CACHE = 'vault-2.0.0-e959171fc7';
const PREFIX = 'vault-';
const ASSETS = [
  "./",
  "./index.html",
  "./app.js?v=e959171fc7",
  "./styles.css?v=e959171fc7",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' contourne le cache HTTP (GitHub Pages garde les fichiers 10 minutes) : on ne stocke jamais de fichier périmé.
    await Promise.all(ASSETS.map(async url => {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) throw new Error('Précache impossible : ' + url + ' (' + response.status + ')');
      await cache.put(url, response);
    }));
    // Passage depuis la version 1 (cache « vault-torch-… »), qui n'a pas de message de mise à jour : sans cela, la nouvelle version
    // attendrait la fermeture de toutes les fenêtres. Les versions 2 et suivantes, elles, laissent l'utilisateur choisir.
    const legacy = (await caches.keys()).some(k => k.startsWith(PREFIX) && k !== CACHE && !/^vault-\d+\.\d+\.\d+-/.test(k));
    if (legacy) self.skipWaiting();
  })());
  // Pas de skipWaiting ici : une nouvelle version attend que l'utilisateur accepte la mise à jour (message ci-dessous).
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // La page principale vient toujours du cache : elle ne dépend d'aucun réseau.
    if (request.mode === 'navigate') {
      const shell = (await cache.match('./index.html')) || (await cache.match('./'));
      if (shell) return shell;
    }
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const response = await fetch(request);
      if (response.ok && !response.redirected) cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (request.mode === 'navigate') { const shell = await cache.match('./index.html'); if (shell) return shell; }
      throw error;
    }
  })());
});
