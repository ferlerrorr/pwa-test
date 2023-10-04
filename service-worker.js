const cacheName = "SSDQue-v2"; // Use a versioned cache name to ensure updates are detected

const filesToCache = [
  "/", // Cache the root URL
  "service-worker.js",
  "js/main.js",
  "js/install-handler.js",
  "js/settings.js",
  "js/jquery.js",
  "css/style.css",
  "css/portal.css",
  "assets/icons/icon.png",
  "manifest.json",
  // Add your assets here
  // Do not add config.json here
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("clean-cache")) {
    caches.delete(cacheName);
    console.log("Service Worker: Cache cleared");
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          console.log("Service Worker: Serving from cache");
          return response;
        } else {
          console.log(
            "Service Worker: Not serving from cache",
            event.request.url
          );
          // return fetch(event.request, { mode: "no-cors" });
        }
      })
    );
  }
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== cacheName) {
            console.log("Service Worker: Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
