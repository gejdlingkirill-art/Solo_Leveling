
const CACHE = "hunter-app-v83-branding";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./assets/gear-crystal.webp",
  "./assets/shadow-assassin.webp",
  "./assets/shadow-wolf.webp",
  "./assets/gear-armor.webp",
  "./assets/boss-demon.webp",
  "./assets/boss-monarch.webp",
  "./assets/shadow-paladin.webp",
  "./assets/boss-insect.webp",
  "./assets/gear-sword.webp",
  "./assets/shadow-archer.webp",
  "./assets/gear-ring.webp",
  "./assets/shadow-mage.webp",
  "./assets/boss-ice-dragon.webp",
  "./assets/shadow-golem.webp",
  "./assets/shadow-knight.webp",
  "./assets/shadow-elf.webp",
  "./assets/01_novice_blade.png",
  "./assets/02_blueflame_blade.png",
  "./assets/03_shadow_edge.png",
  "./assets/04_hunters_cloak.png",
  "./assets/05_pursuer_armor.png",
  "./assets/06_monarch_mantle.png",
  "./assets/07_rift_ring.png",
  "./assets/08_mana_core.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Prefer the network for page navigations so deployments appear immediately;
  // keep the cached app as an offline fallback.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then(response => {
        if (!response || !response.ok) return caches.match("./index.html").then(cached => cached || response);
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put("./index.html", copy));
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});

