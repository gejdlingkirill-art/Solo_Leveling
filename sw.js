
const CACHE = "hunter-app-v66-daily-quest-title";

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
  "./assets/shadow-elf.webp"
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

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache =>
            cache.put(event.request, copy)
          );
          return response;
        })
        .catch(() => caches.match("./index.html"))
      )
  );
});

