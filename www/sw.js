const CACHE="orari-v3";
const CORE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./apple-touch-icon.png",
 "./exceljs.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const isPage=e.request.mode==="navigate";
  e.respondWith(
    isPage
      ? fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put("./index.html",c));return r}).catch(()=>caches.match("./index.html"))
      : caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return r}))
  );
});
