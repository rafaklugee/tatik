// Offline support. The page itself is network-first (so updates arrive), everything else cache-first.
const CACHE='tatik-20261022221940';
const CORE=["./", "index.html", "manifest.webmanifest", "vendor/three.min.js", "vendor/OrbitControls.js", "vendor/supabase.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res};
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin&&(req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('.html'))){
    e.respondWith(fetch(req).then(r=>keep(req,r)).catch(()=>caches.match(req).then(m=>m||caches.match('index.html'))));return;
  }
  if(url.origin===location.origin||url.host.endsWith('fonts.googleapis.com')||url.host.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>keep(req,r))));
  }
});
