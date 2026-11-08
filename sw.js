/* TLC Pro — Service Worker
   Asosiy interfeys va jurnal offline ishlashi uchun kesh.
   API javoblari keshlenmaydi (jonli ma'lumot eskirib qolmasligi uchun). */
const CACHE = "tlc-pro-v54";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg", "./zones.json", "./style.css?v=127", "./app.js?v=127",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  /* API chaqiriqlar — tarmoq avval (jonli ma'lumot) */
  if (u.hostname.indexOf("open-meteo.com") >= 0 || u.hostname.indexOf("overpass-api.de") >= 0 || u.hostname.indexOf("kumi.systems") >= 0 || u.hostname.indexOf("rainviewer.com") >= 0 || u.hostname.indexOf("adsb.lol") >= 0 || u.hostname.indexOf("airlabs.co") >= 0 || u.hostname.indexOf("data.cityofnewyork.us") >= 0 || u.hostname.indexOf("tomtom.com") >= 0 || u.hostname.indexOf("planninglabs.nyc") >= 0 || u.hostname.indexOf("komoot.io") >= 0) return;
  if (u.hostname.indexOf("arcgisonline.com") >= 0) {
    /* Xarita tile'lari — kesh avval */
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r;
    })));
    return;
  }
  /* Sahifa (navigatsiya) — avval tarmoq: yangi versiya darhol keladi; offline bo'lsa kesh */
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }
  /* Ilova qobig'i — kesh, fonda yangilash */
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
