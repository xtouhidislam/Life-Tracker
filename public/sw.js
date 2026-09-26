// ==============================================================================
// LifeQuest Service Worker (PWA Offline Engine & Web Push)
// Phase 10 & 12: Stale-while-revalidate, offline navigation fallback, and push alerts
// ==============================================================================

const STATIC_CACHE = "lifequest-static-v2";
const DYNAMIC_CACHE = "lifequest-dynamic-v2";

const STATIC_ASSETS = [
  "/",
  "/today",
  "/offline.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/maskable-icon-512.png",
  "/apple-touch-icon.png",
  "/badge-72.png",
];

// ------------------------------------------------------------------------------
// INSTALL: Pre-cache core shell assets
// ------------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ------------------------------------------------------------------------------
// ACTIVATE: Purge stale caches and claim clients
// ------------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// ------------------------------------------------------------------------------
// FETCH: Offline caching strategies
// ------------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and external API calls (e.g. Supabase DB calls)
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Ignore Next.js hot-reloading & dev endpoints
  if (url.pathname.startsWith("/_next/webpack-hmr") || url.pathname.startsWith("/api/")) {
    return;
  }

  // Strategy 1: HTML Navigation Requests -> Network First with Offline Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the latest page
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/offline.html");
          return fallback || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        })
    );
    return;
  }

  // Strategy 2: Static assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached response if available
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ------------------------------------------------------------------------------
// PUSH EVENT: Receive incoming push messages
// ------------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  let data = {
    title: "LifeQuest Reminder",
    body: "You have a scheduled objective ready for check-in.",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    url: "/today",
    tag: "lifequest-general",
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (err) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/badge-72.png",
    tag: data.tag || "lifequest-alert",
    renotify: true,
    data: {
      url: data.url || "/today",
      timestamp: Date.now(),
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Open LifeQuest" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ------------------------------------------------------------------------------
// NOTIFICATION CLICK: Focus existing window or navigate to target URL
// ------------------------------------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/today";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            if (client.url !== targetUrl && "navigate" in client) {
              client.navigate(targetUrl);
            }
            return;
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
