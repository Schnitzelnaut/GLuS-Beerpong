const CACHE='glus-v144';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon.png'];
const FIREBASE_URL='https://glus-bierpong-default-rtdb.europe-west1.firebasedatabase.app';
const VAPID_PUBLIC_KEY='BFZbn5MO6W2Z7E0x7ddSY9xIzEWGYydlrHeCmxdVKHnZS9WXwPCxEyrjGLbS2ZscdCSnuTL5QHEv8_W79doWO74';

// Gleiche ID-Funktion wie in der App (djb2 über den ganzen Endpoint)!
function pushSubId(endpoint){let h=5381;for(let i=0;i<endpoint.length;i++){h=((h<<5)+h)^endpoint.charCodeAt(i);h=h&h;}return 's'+Math.abs(h).toString(36);}
function urlB64ToUint8(base64String){const padding='='.repeat((4-base64String.length%4)%4);const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');const raw=atob(base64);const arr=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);return arr;}
async function saveSub(sub){try{const id=pushSubId(sub.endpoint);const j=sub.toJSON();
// bestehende prefs behalten
let prefs={new_bet:true,bet_settled:true,new_match:true,new_season:true,garten:true};
try{const r=await fetch(FIREBASE_URL+'/push_subscriptions/'+id+'/prefs.json');const p=await r.json();if(p)prefs=p;}catch(e){}
await fetch(FIREBASE_URL+'/push_subscriptions/'+id+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:sub.endpoint,keys:{p256dh:j.keys.p256dh,auth:j.keys.auth},savedAt:Date.now(),prefs})});}catch(e){}}

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window'})).then(cs=>cs.forEach(c=>c.postMessage({type:'SW_UPDATED'}))));});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});

// KERN-FIX: Browser rotiert/erneuert Push-Subscriptions regelmäßig. Ohne diesen
// Handler stirbt die Subscription still → keine Benachrichtigungen mehr.
self.addEventListener('pushsubscriptionchange',e=>{
  e.waitUntil((async()=>{
    try{
      // Alte (tote) Subscription aus Firebase entfernen
      if(e.oldSubscription){try{await fetch(FIREBASE_URL+'/push_subscriptions/'+pushSubId(e.oldSubscription.endpoint)+'.json',{method:'DELETE'});}catch(x){}}
      // Neue Subscription holen (oder neu anlegen) und speichern
      let sub=e.newSubscription;
      if(!sub){sub=await self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlB64ToUint8(VAPID_PUBLIC_KEY)});}
      if(sub)await saveSub(sub);
    }catch(x){}
  })());
});

self.addEventListener('fetch',e=>{if(e.request.url.includes('firebasedatabase.app')||e.request.url.includes('googleapis.com')||e.request.url.includes('workers.dev'))return;e.respondWith(caches.match(e.request).then(cached=>{const fp=fetch(e.request).then(r=>{if(r&&r.status===200&&e.request.method==='GET'){caches.open(CACHE).then(c=>c.put(e.request,r.clone())).catch(()=>{});}return r;}).catch(()=>cached);return cached||fp;}));});
self.addEventListener('push',e=>{const d=e.data?e.data.json():{};e.waitUntil(self.registration.showNotification(d.title||'GLuS BeerPong',{body:d.body||'',icon:'./icon-192.png',badge:'./favicon.png',data:{url:d.url||'/GLuS-Beerpong/'},vibrate:[200,100,200]}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=e.notification.data?.url||'/GLuS-Beerpong/';e.waitUntil(clients.matchAll({type:'window'}).then(cs=>{for(const c of cs){if(c.url.includes('GLuS-Beerpong')&&'focus'in c)return c.focus();}if(clients.openWindow)return clients.openWindow(url);}));});