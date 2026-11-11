"use strict";

/* ================= Helpers ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(m){const t=$("toast");t.textContent=m;t.style.display="block";clearTimeout(t._h);t._h=setTimeout(()=>t.style.display="none",3400)}
function fetchT(u,ms,opt){const c=new AbortController();const h=setTimeout(()=>c.abort(),ms||9000);return fetch(u,Object.assign({signal:c.signal},opt||{})).then(r=>{clearTimeout(h);if(!r.ok)throw new Error("HTTP "+r.status);return r}).catch(e=>{clearTimeout(h);throw e})}
function hav(a,b,c,d){const R=3958.8,x=(c-a)*Math.PI/180,y=(d-b)*Math.PI/180,s=Math.sin(x/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(s))}
function inkF(){return document.documentElement.getAttribute("data-theme")==="light"?"#111214":"#f4f6f8"}
function money(n){return "$"+(Math.round(n*100)/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
function nowNY(){return new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"}))}
function gmaps(lat,lon){window.open("https://www.google.com/maps/dir/?api=1&destination="+lat+","+lon,"_blank")}
const _ttk=["6OihyLXDxuOwymbh","mSqC20o8MjjwoCTJ"];const TT_KEY=_ttk[0]+_ttk[1];
function navGo(lat,lon){window.location.href="https://www.google.com/maps/dir/?api=1&destination="+lat+","+lon+"&dir_action=navigate"}

/* ================= Data ================= */
/* TLC tarixiy talab balli (0-100) — HISTORICAL */
const ZONES=[
{n:"Midtown Manhattan",lat:40.7549,lon:-73.9840,type:"office"},
{n:"Times Square / Theater",lat:40.7590,lon:-73.9845,type:"nightlife"},
{n:"Grand Central / Midtown East",lat:40.7527,lon:-73.9772,type:"office"},
{n:"Penn Station / Hudson Yards",lat:40.7505,lon:-73.9934,type:"office"},
{n:"Financial District",lat:40.7075,lon:-74.0113,type:"office"},
{n:"Chelsea / Meatpacking",lat:40.7420,lon:-74.0064,type:"nightlife"},
{n:"SoHo / Tribeca",lat:40.7233,lon:-74.0020,type:"nightlife"},
{n:"East Village / LES",lat:40.7265,lon:-73.9815,type:"nightlife"},
{n:"Upper East Side",lat:40.7736,lon:-73.9566,type:"residential"},
{n:"Upper West Side",lat:40.7870,lon:-73.9754,type:"residential"},
{n:"Downtown Brooklyn",lat:40.6930,lon:-73.9870,type:"office"},
{n:"Williamsburg",lat:40.7081,lon:-73.9571,type:"nightlife"},
{n:"Harlem",lat:40.8116,lon:-73.9465,type:"residential"},
{n:"Astoria",lat:40.7720,lon:-73.9301,type:"residential"},
{n:"Flushing",lat:40.7670,lon:-73.8331,type:"residential"},
{n:"Yankee Stadium / S. Bronx",lat:40.8296,lon:-73.9262,type:"residential"},
{n:"JFK Airport",lat:40.6413,lon:-73.7781,type:"airport",ap:"JFK"},
{n:"LaGuardia Airport",lat:40.7769,lon:-73.8740,type:"airport",ap:"LGA"},
{n:"Newark Airport (EWR)",lat:40.6895,lon:-74.1745,type:"airport",ap:"EWR"},
{n:"St. George / SI Ferry",lat:40.6437,lon:-74.0736,type:"residential"}
];
const AIRPORTS=[
{code:"JFK",name:"John F. Kennedy Intl",lat:40.6413,lon:-73.7781,term:"T4 va T8 eng band"},
{code:"LGA",name:"LaGuardia",lat:40.7769,lon:-73.8740,term:"Terminal B asosiy oqim"},
{code:"EWR",name:"Newark Liberty Intl",lat:40.6895,lon:-74.1745,term:"Terminal A va C"}
];
const PLACES=[
{n:"Office 40w St",lat:40.75696,lon:-73.99338},
{n:"Office 10e St",lat:40.72818,lon:-73.98279},
{n:"Virgin Hotel",lat:40.74674,lon:-73.98865},
{n:"Times Square",lat:40.7580,lon:-73.9855},
{n:"Exit 13",lat:40.63072,lon:-73.89528}
];
/* HotelTochka (2026-11-09): Manhattan dagi eng hotel-zich nuqtalar.
   Metod: NYC Open Data tjus-cn27 (2027), BIN boʻyicha unikal hotel binolari,
   har nuqta atrofidagi ~310x230 m oynada (4 blok) sanalgan; H8 yotoqxonalar chiqarilgan. */
const HOTEL_TOCHKA=[
{n:"Garment District",sub:"8th\u20139th Ave \u00b7 W 36th\u201340th St",lat:40.755212,lon:-73.992663,h:25},
{n:"Herald Square",sub:"5th\u20136th Ave \u00b7 W 35th\u201338th St",lat:40.750346,lon:-73.985078,h:18},
{n:"Times Square",sub:"6th\u20137th Ave \u00b7 W 44th\u201347th St",lat:40.757382,lon:-73.984074,h:17},
{n:"Chelsea",sub:"6th\u20137th Ave \u00b7 W 24th\u201328th St",lat:40.745141,lon:-73.992284,h:15},
{n:"Grand Central",sub:"Lexington Ave \u00b7 E 47th\u201350th St",lat:40.755417,lon:-73.973034,h:15},
{n:"Midtown (43rd\u201346th)",sub:"5th\u20136th Ave \u00b7 W 43rd\u201346th St",lat:40.755241,lon:-73.981305,h:14},
{n:"NoMad",sub:"5th Ave / Madison \u00b7 E 29th\u2013W 33rd St",lat:40.745995,lon:-73.984367,h:13},
{n:"Midtown (48th\u201350th)",sub:"8th Ave / Broadway \u00b7 W 48th\u201350th St",lat:40.760725,lon:-73.985951,h:13},
{n:"Bowery",sub:"Bowery \u00b7 Grand\u2013Hester St",lat:40.718232,lon:-73.994349,h:11},
{n:"Midtown North (54th\u201358th)",sub:"7th Ave \u00b7 W 54th\u201358th St",lat:40.764252,lon:-73.979292,h:11}
];
const CRUISE2=[
{n:"Manhattan Cruise Terminal (Pier 88/90)",lat:40.7672,lon:-73.9985},
{n:"Brooklyn Cruise Terminal (Red Hook)",lat:40.6827,lon:-74.0132}
];
let EVENTS=[
{n:"Village Halloween Parade",place:"6th Ave, Greenwich Village",lat:40.7312,lon:-74.0000,start:"2026-10-31T19:00",end:"2026-10-31T23:30",surge:2.2},
{n:"NYC Marathon 2026",place:"5 borough boʻylab",lat:40.7720,lon:-73.9300,start:"2026-11-01T08:00",end:"2026-11-01T18:00",surge:1.8,note:"Koʻplab koʻchalar yopiladi — marshrutni oldindan rejalang"},
{n:"Broadway shoulari tugashi",place:"Times Square",lat:40.7590,lon:-73.9845,daily:[21.5,23.5],surge:1.5},
{n:"MSG tadbir kechalari",place:"Madison Square Garden",lat:40.7505,lon:-73.9934,surge:null,note:"Jadval oʻzgaruvchan — aniq vaqt yoʻq, ballga taʼsir qilmaydi"},
{n:"Barclays Center tadbirlari",place:"Atlantic Ave, Brooklyn",lat:40.6826,lon:-73.9754,surge:null,note:"Jadval oʻzgaruvchan — aniq vaqt yoʻq, ballga taʼsir qilmaydi"},
{n:"Radio City / Rockefeller",place:"6th Ave, Midtown",lat:40.7600,lon:-73.9800,surge:null,note:"Mavsumiy jadval — ballga taʼsir qilmaydi"}
];
let CLOSURES=[
{n:"NYC Marathon marshruti yopilishlari",place:"Verrazzano, 4th Ave (Brooklyn), Queensboro Bridge, 5th Ave",lat:40.7300,lon:-73.9950,radiusKm:9,sev:"Yuqori",start:"2026-11-01T05:00",end:"2026-11-01T20:00"},
{n:"BQE (I-278) qurilish ishlari",place:"Brooklyn Heights atrofida davriy torayishlar",lat:40.7000,lon:-73.9900,radiusKm:4,sev:"Oʻrtacha",start:null,end:null},
{n:"FDR Drive davriy tungi ishlar",place:"Manhattan East Side, tungi soatlarda qisman",lat:40.7300,lon:-73.9750,radiusKm:3.5,sev:"Past",start:null,end:null}
];
const CAMS_FB=[
{n:"Queens Blvd",lat:40.7431,lon:-73.9223},{n:"Northern Blvd",lat:40.7623,lon:-73.9186},{n:"Atlantic Ave",lat:40.6892,lon:-73.9855},
{n:"Flatbush Ave",lat:40.6500,lon:-73.9496},{n:"Grand Concourse",lat:40.8519,lon:-73.8907},{n:"Canal St",lat:40.7180,lon:-74.0000},
{n:"2nd Ave (Harlem)",lat:40.7950,lon:-73.9370},{n:"5th Ave (Midtown)",lat:40.7614,lon:-73.9776},{n:"Richmond Ave (SI)",lat:40.5795,lon:-74.1497},
{n:"Broadway (Bronx)",lat:40.9150,lon:-73.8950},{n:"Pelham Pkwy",lat:40.8570,lon:-73.8650},{n:"Kings Hwy (Brooklyn)",lat:40.6050,lon:-73.9650}
];
const WC_FB=[
{n:"Grand Central Terminal",lat:40.7527,lon:-73.9772},{n:"Penn Station",lat:40.7505,lon:-73.9934},{n:"Port Authority Bus Terminal",lat:40.7572,lon:-73.9897},
{n:"Bryant Park",lat:40.7536,lon:-73.9832},{n:"Central Park — Bethesda Terrace",lat:40.7739,lon:-73.9711},{n:"Prospect Park",lat:40.6602,lon:-73.9690},
{n:"Battery Park",lat:40.7033,lon:-74.0170},{n:"Flushing Meadows Corona Park",lat:40.7500,lon:-73.8450},{n:"St. George Ferry Terminal",lat:40.6437,lon:-74.0736}
];
const WC_DB="https://hayotus.github.io/restrooms.json";
const WC_API="https://data.cityofnewyork.us/resource/i7jb-7jku.json?$limit=5000&status=Operational&$select=facility_name,location_type,operator,hours_of_operation,latitude,longitude";
const WC_FB2=[
{n:"Central Park \u2014 Ancient Playground",sub:"85th St & 5th Ave",lat:40.78077,lon:-73.96156},
{n:"Central Park \u2014 Heckscher Playground",sub:"Mid-Park, 61st\u201363rd St",lat:40.77002,lon:-73.97795},
{n:"Central Park \u2014 Bendheim Playground",sub:"100th St & 5th Ave",lat:40.79041,lon:-73.95288},
{n:"Central Park \u2014 North Meadow",sub:"Mid-Park at 97th St",lat:40.79028,lon:-73.95987},
{n:"Central Park \u2014 Dana Discovery Center",sub:"110th St & Fifth Ave",lat:40.79711,lon:-73.95149},
{n:"Washington Square Park",sub:"Washington Square S & MacDougal St",lat:40.73104,lon:-73.99960},
{n:"Battery Park \u2014 Playscape",sub:"State St & Battery Pl",lat:40.70451,lon:-74.01425},
{n:"DeWitt Clinton Park",sub:"11th Ave & W 52nd St",lat:40.76818,lon:-73.99463},
{n:"St. Nicholas Park",sub:"W 133rd St & St. Nicholas Ave",lat:40.81570,lon:-73.94867},
{n:"Highbridge \u2014 Adventure Playground",sub:"Edgecombe Ave & W 164th St",lat:40.83646,lon:-73.93703},
{n:"Highbridge \u2014 Quisqueya Playground",sub:"W 180th St & Amsterdam Ave",lat:40.84743,lon:-73.93139},
{n:"Hudson River Park \u2014 Pier 25",sub:"West St & N Moore St",lat:40.72032,lon:-74.01227},
{n:"Hudson River Park \u2014 Pier 51",sub:"West St & Jane St",lat:40.73820,lon:-74.01007},
{n:"Tompkins Square Park",sub:"Ave A & E 7th St",lat:40.72605,lon:-73.98353},
{n:"Union Square Park",sub:"16th St & Broadway",lat:40.73710,lon:-73.99032}
];
let WC_ALL=null,WC_LOAD=null,WC_SRC="";
function loadWC(){
  if(WC_LOAD)return WC_LOAD;
  WC_LOAD=fetchT(WC_DB,12000).then(r=>r.json()).then(list=>{
    const items=(list||[]).map(o=>({n:o.name,sub:o.address||"",lat:+o.lat,lon:+o.lon})).filter(x=>x.n&&isFinite(x.lat)&&isFinite(x.lon));
    if(!items.length)throw new Error("db empty");
    WC_SRC="db";return items;
  }).catch(()=>fetchT(WC_API,15000).then(r=>r.json()).then(list=>{
    const items=(list||[]).map(o=>({n:o.facility_name,sub:[o.location_type,o.operator].filter(Boolean).join(" \u2022 "),lat:+o.latitude,lon:+o.longitude})).filter(x=>x.n&&isFinite(x.lat)&&isFinite(x.lon));
    if(!items.length)throw new Error("api empty");
    WC_SRC="api";return items;
  })).catch(()=>{WC_SRC="fb";return WC_FB2.slice()});
  WC_LOAD.then(items=>{WC_ALL=items});
  return WC_LOAD;
}
const EV_FB=[
{n:"Tesla Supercharger — Brooklyn (Atlantic Ave atrofi)",lat:40.6840,lon:-73.9780},{n:"Tesla Supercharger — Queens (Fresh Meadows atrofi)",lat:40.7330,lon:-73.7900},
{n:"Tesla Supercharger — Bronx (Bay Plaza atrofi)",lat:40.8650,lon:-73.8250},{n:"Tesla Urban Charger — Manhattan (West Side)",lat:40.7550,lon:-74.0000},
{n:"Zaryadlash — JFK atrofi (Queens)",lat:40.6650,lon:-73.7900},{n:"Tesla Supercharger — Staten Island atrofi",lat:40.5800,lon:-74.1800}
];
const GARAGES=[
{n:"Icon Parking — Midtown (W 44th St atrofi)",lat:40.7580,lon:-73.9880,note:"Soatlik, kechasi qimmatroq"},
{n:"MSG atrofi garajlar (W 31st–33rd)",lat:40.7490,lon:-73.9940,note:"Tadbir payti narx oshadi"},
{n:"Battery Parking Garage (FiDi)",lat:40.7070,lon:-74.0150,note:"Katta sigʻim"},
{n:"Queens — Flushing municipal lot",lat:40.7600,lon:-73.8320,note:"Meter va lot variantlari"}
];
const ASP_OFF=["2026-01-01","2026-01-19","2026-02-16","2026-05-25","2026-06-19","2026-07-03","2026-09-07","2026-10-12","2026-11-11","2026-11-26","2026-12-25","2027-01-01","2027-01-18","2027-02-15","2027-05-31","2027-06-18","2027-07-05","2027-09-06","2027-10-11","2027-11-11","2027-11-25","2027-12-24"];

/* ================= State & Settings ================= */
const DEF_POS={lat:40.7580,lon:-73.9855}; /* Times Square — GPS kelguncha */
let pos=null, wxData=null, rainProb3h=0;
let ZD=null, zoneWx={}, zoneWxH={}, adsb={}, lastRPH=null;
let hotOff=0, hotSort="score", hotMax=0, hotAll=false, lastHotList=[];
let settings={name:"",car:"Tesla Model Y",price:0.30,cons:0.28,maint:0.06,lang:"uz-UZ",theme:"dark",units:"mi",speed:"mph",refresh:10,notif:0,drive:0,weights:null,airports:["JFK","LGA","EWR"],zone:"",traffic:true,ezpass:true,darkmap:false,apMode:"live",mtime:false};
try{const s=JSON.parse(localStorage.getItem("drv_settings")||"null");if(s)settings=Object.assign(settings,s)}catch(e){}
/* ================= IndexedDB (3-bosqich) ================= */
function idbOpen(){return new Promise((res,rej)=>{try{const rq=indexedDB.open("drvdb",1);rq.onupgradeneeded=()=>{rq.result.createObjectStore("kv")};rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)}catch(e){rej(e)}})}
function idbSet(k,v){return idbOpen().then(db=>new Promise((res,rej)=>{const tx=db.transaction("kv","readwrite");tx.objectStore("kv").put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)}))}
function idbGet(k){return idbOpen().then(db=>new Promise((res,rej)=>{const rq=db.transaction("kv").objectStore("kv").get(k);rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)}))}
function idbDel(k){return idbOpen().then(db=>new Promise((res,rej)=>{const tx=db.transaction("kv","readwrite");tx.objectStore("kv").delete(k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)}))}
const IDB_KEYS=["drv_settings","drv_journal","drv_recs"];
function idbMirror(){try{IDB_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!=null)idbSet(k,v).catch(()=>{})})}catch(e){}}
async function idbRestore(){try{let changed=false;for(const k of IDB_KEYS){if(!localStorage.getItem(k)){const v=await idbGet(k);if(v!=null){localStorage.setItem(k,v);changed=true}}}
  if(changed){try{journal=JSON.parse(localStorage.getItem("drv_journal")||"[]")}catch(e){}try{recs=JSON.parse(localStorage.getItem("drv_recs")||"[]")}catch(e){}try{const sv=JSON.parse(localStorage.getItem("drv_settings")||"null");if(sv)Object.assign(settings,sv)}catch(e){}renderHome();renderJournal();fillSettings()}
  idbMirror()}catch(e){}}

function saveSettings(){localStorage.setItem("drv_settings",JSON.stringify(settings));idbMirror()}
function applyTheme(){document.documentElement.setAttribute("data-theme",settings.theme==="light"?"light":"dark")}
function distTxt(mi){return settings.units==="km"?(mi*1.60934).toFixed(1)+" km":mi.toFixed(1)+" mi"}
function spdTxt(mph){return settings.speed==="kmh"?Math.round(mph*1.60934)+" km/h":mph+" mph"}
const AIRLABS_KEY="e47a4224-471e-4631-8e57-67aea417485e";
const apiStat={weather:"tekshirilmagan",zones:"tekshirilmagan",adsb:"tekshirilmagan",overpass:"tekshirilmagan",rain:"tekshirilmagan",closures:"tekshirilmagan",events:"tekshirilmagan",tiles:"Esri (kalitsiz)"};
let lastCalcAt=null;
function renderApiStat(){const el=$("apiStat");if(el)el.innerHTML="Open-Meteo (ob-havo): <b>"+esc(apiStat.weather)+"</b><br>TLC zones.json (tarixiy): <b>"+esc(ZD?("OK · TLC HVFHS 2025-09 ("+ZD.zones.length+" zona)"):apiStat.zones)+"</b><br>AirLabs (jonli reyslar): <b>"+esc(apiStat.adsb)+"</b><br>Overpass/OSM (joylar): <b>"+esc(apiStat.overpass)+"</b><br>RainViewer (radar): <b>"+esc(apiStat.rain)+"</b><br>NYC DOT yopilishlar: <b>"+esc(apiStat.closures)+"</b><br>NYC Events (tadbirlar): <b>"+esc(apiStat.events)+"</b><br>Xarita tiles: <b>"+esc(apiStat.tiles)+"</b>"+(lastCalcAt?"<br>Smart Engine oxirgi hisob: <b>"+esc(lastCalcAt)+"</b>":"")}
function userLat(){return pos?pos.lat:DEF_POS.lat}
function userLon(){return pos?pos.lon:DEF_POS.lon}

/* ================= Smart Driver Intelligence (Modul 9) ================= */
/* zones.json — TLC HVFHS 2025-09 tarixiy naqsh (tools/build_zones.py) */
function isWEAt(d){return d.getDay()===0||d.getDay()===6}
function isWE(){return isWEAt(nowNY())}
function hourIdx(at){const b=new Date(nowNY());b.setHours(0,0,0,0);return Math.floor((at-b)/3600e3)}
function zdata(name){if(!ZD)return null;return ZD.zones.find(z=>z.name===name)||null}
function patternRawAt(z,at){const zd=zdata(z.n);if(!zd)return null;return (isWEAt(at)?zd.we:zd.wd)[at.getHours()]}
function patternRaw(z){return patternRawAt(z,nowNY())}
function patternSeries(z,at,n){const zd=zdata(z.n);if(!zd)return [];const out=[];for(let i=0;i<n;i++){const d=new Date(at.getTime()+i*3600e3);out.push((isWEAt(d)?zd.we:zd.wd)[d.getHours()])}return out}
function apZoneName(code){return code==="JFK"?"JFK Airport":code==="LGA"?"LaGuardia Airport":"Newark Airport (EWR)"}
function airportDAt(code,at){const zd=zdata(apZoneName(code));if(!zd||!ZD)return null;const raw=(isWEAt(at)?zd.we:zd.wd)[at.getHours()];return Math.min(100,raw/ZD.meta.peakRef*100)}
function airportD(code){return airportDAt(code,nowNY())}
function evWin(ev){const now=nowNY();
  if(ev.daily){const s=new Date(now);s.setHours(0,0,0,0);s.setMinutes(Math.round(ev.daily[0]*60));const e=new Date(now);e.setHours(0,0,0,0);e.setMinutes(Math.round(ev.daily[1]*60));return {s:s,e:e}}
  if(ev.start&&ev.end)return {s:new Date(ev.start),e:new Date(ev.end)};
  return null}
function evState(ev,at){const w=evWin(ev);if(!w)return "info";const now=at||nowNY();if(now>w.e)return "past";if(now>=new Date(w.s.getTime()-2*3600e3))return "active";return "later"}
function clActive(c,at){if(!c.start||!c.end)return false;const now=at||nowNY();return now>=new Date(c.start)&&now<=new Date(c.end)}
function realPerHour(zoneName){const es=journal.filter(e=>e.hours>0);if(!es.length)return null;const rate=e=>netOf(e.gross,e.miles,e.exp)/e.hours;
  if(zoneName){const h=nowNY().getHours();
    const zh=es.filter(e=>e.zone===zoneName&&e.startHour!=null&&Math.abs(e.startHour-h)<=2);
    if(zh.length>=2)return {v:zh.reduce((a,e)=>a+rate(e),0)/zh.length,n:zh.length,scope:"zoneHour"};
    const zz=es.filter(e=>e.zone===zoneName);
    if(zz.length>=2)return {v:zz.reduce((a,e)=>a+rate(e),0)/zz.length,n:zz.length,scope:"zone"};}
  let tn=0,th=0;es.forEach(e=>{tn+=netOf(e.gross,e.miles,e.exp);th+=e.hours});if(th<=0)return null;return {v:tn/th,n:es.length,scope:"all"}}
const WEIGHTS={D:0.30,F:0.20,E:0.15,W:0.15,T:0.10,P:0.10};
function effW(){return settings.weights||WEIGHTS}
const SEVP={"Yuqori":26,"Oʻrtacha":14,"Past":6};
function zoneScoresAt(off){
  const peakRef=ZD?ZD.meta.peakRef:0;
  const at=new Date(nowNY().getTime()+(off||0)*3600e3);
  const idx=hourIdx(at);
  const apD={JFK:airportDAt("JFK",at),LGA:airportDAt("LGA",at),EWR:airportDAt("EWR",at)};
  return ZONES.map(z=>{
    const dist=hav(userLat(),userLon(),z.lat,z.lon);
    const raw=patternRawAt(z,at);
    const D=(raw!=null&&peakRef)?Math.min(100,raw/peakRef*100):null;
    let F=0;
    if(z.ap){F=apD[z.ap]!=null?apD[z.ap]:0}
    else{AIRPORTS.forEach(ap=>{if(apD[ap.code]==null)return;const dd=hav(z.lat,z.lon,ap.lat,ap.lon);const v=apD[ap.code]*Math.max(0,1-dd/28);if(v>F)F=v})}
    let E=0;
    EVENTS.forEach(ev=>{if(!ev.surge)return;if(evState(ev,at)!=="active")return;const dd=hav(z.lat,z.lon,ev.lat,ev.lon);if(dd<1.9)E=Math.max(E,Math.min(100,(ev.surge-1)*110*(1-dd/2.2)))});
    const sens=z.type==="nightlife"?0.55:z.type==="airport"?0.5:z.type==="office"?0.4:0.3;
    let wBase;
    if(!off){const zwx=zoneWx[z.n];wBase=(zwx!=null)?zwx:(wxData?rainProb3h:null)}
    else{const pp=zoneWxH[z.n];if(pp&&idx>=0&&idx<pp.length)wBase=pp[idx];else if(wxData&&wxData.hourly&&wxData.hourly.precipitation_probability&&idx>=0&&idx<wxData.hourly.precipitation_probability.length)wBase=wxData.hourly.precipitation_probability[idx];else wBase=(zoneWx[z.n]!=null)?zoneWx[z.n]:null}
    const W=(wBase!=null)?Math.max(15,Math.min(98,45+wBase*sens)):55;
    let T=88;
    CLOSURES.forEach(c=>{if(!clActive(c,at))return;const dd=hav(z.lat,z.lon,c.lat,c.lon);if(dd<c.radiusKm)T-=(SEVP[c.sev]||6)*(1-dd/c.radiusKm)});
    T=Math.max(5,Math.min(95,T));
    let P=Math.max(5,100-dist*7);if(settings.zone&&settings.zone===z.n)P=Math.min(100,P+6);
    let acc=0,wsum=0;
    const comps=[["D",D],["F",F],["E",E],["W",W],["T",T],["P",P]];
    comps.forEach(function(kv){if(kv[1]==null)return;acc+=effW()[kv[0]]*kv[1];wsum+=effW()[kv[0]]});
    const score=wsum?Math.round(acc/wsum):0;
    const etaMin=Math.max(2,Math.round(dist*3.2));
    const series=patternSeries(z,at,6);
    let trend=0;if(series.length>1&&series[0]>0){const ch=(series[1]-series[0])/series[0];trend=ch>0.08?1:ch<-0.08?-1:0}
    return {z:z,dist:dist,score:score,D:D==null?null:Math.round(D),F:Math.round(F),E:Math.round(E),W:Math.round(W),T:Math.round(T),P:Math.round(P),raw:raw,etaMin:etaMin,series:series,trend:trend,atH:at.getHours()};
  }).sort((a,b)=>b.score-a.score);
}
function zoneScores(){return zoneScoresAt(0)}
function demandLabel(v){return v>=75?'<span class="hi">HIGH</span>':v>=50?'<span class="med">MEDIUM</span>':'<span class="low">LOW</span>'}
function nearestZone(){let best=null,bd=1e9;ZONES.forEach(z=>{const d=hav(userLat(),userLon(),z.lat,z.lon);if(d<bd){bd=d;best=z}});return {z:best,d:bd}}
let bestPick=null;
function renderHome(){
  const nz=nearestZone();
  $("curZone").textContent=pos?nz.z.n:"Manhattan (GPS kutilmoqda)";
  $("curZoneSub").textContent=pos?("Eng yaqin hududgacha "+distTxt(nz.d)+" · GPS faol"):"GPS ruxsati berilsa aniq hudud koʻrinadi";
  const sc=zoneScores();
  const cur=sc.find(s=>s.z===nz.z)||sc[0];
  $("curDemand").innerHTML=cur.D==null?'<span class="med">Maʼlumot yoʻq</span>':demandLabel(cur.D)+' <span style="font-size:14px;color:var(--mut)">'+cur.D+"/100</span>";
  bestPick=sc[0];
  const tb=$("tileBest");if(tb)tb.textContent=bestPick.z.n.replace(" Airport","");
  const av=$("alertVal");if(av)av.textContent=CLOSURES.length+" ta ogohlantirish";
  $("bestName").textContent=bestPick.z.n;
  lastRPH=realPerHour(bestPick.z.n);$("bestMeta").textContent="Ball "+bestPick.score+"/100 · "+distTxt(bestPick.dist)+" · ≈"+bestPick.etaMin+" daq yoʻl · "+(lastRPH?("Real oʻrtacha: "+money(lastRPH.v)+"/soat (jurnal, "+(lastRPH.scope==="zone"?"shu hudud, ":lastRPH.scope==="zoneHour"?"hudud+soat, ":"")+lastRPH.n+" smena)"):"Real $/soat: maʼlumot yoʻq");
  lastCalcAt=nowNY().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
  let conf=58;if(pos)conf+=20;if(wxData)conf+=12;if(!ZD)conf-=18;if(!Object.keys(zoneWx).length)conf-=6;if(bestPick.D==null)conf-=10;if(sc.length>1&&(sc[0].score-sc[1].score)<5)conf-=10;if(rainProb3h>0)conf+=3;
  bestPick.conf=Math.max(30,Math.min(95,conf));
  const hs=$("homeScore");if(hs)hs.textContent=bestPick.score;const bsx=$("bestScore");if(bsx)bsx.textContent=bestPick.score;const bcf=$("bestConf");if(bcf)bcf.textContent=bestPick.conf+"%";const bmt=$("bestMeter");if(bmt)bmt.style.width=bestPick.score+"%";
  const hc2=$("homeConf");if(hc2)hc2.textContent=bestPick.conf+"%";
  const hsec=$("homeSecond");if(hsec&&sc[1])hsec.textContent=sc[1].z.n.replace(" Airport","");
  const hf=$("homeFresh");if(hf)hf.textContent="Yangilandi: "+lastCalcAt+" · Confidence "+bestPick.conf+"% ("+(pos?"GPS bor":"GPS yoʻq")+", "+(wxData?"ob-havo jonli":"ob-havo kutilmoqda")+", "+(ZD?"TLC tarixiy yuklangan":"TLC yuklanmagan")+")";
  maybeNotify();applyDrive();
  const rs=[];
  if(bestPick.D>=70)rs.push("Tarixiy talab koʻrsatkichi yuqori ("+bestPick.D+")");
  if(bestPick.F>=60)rs.push("Reyslar oqimi kuchli — aeroport faktori "+bestPick.F);
  if(bestPick.E>=60)rs.push("Yaqin atrofda tadbir/surge ehtimoli ("+bestPick.E+")");
  if(rainProb3h>=40)rs.push("Yomgʻir ehtimoli yuqori ("+Math.round(rainProb3h)+"%) — talab oshishi mumkin");
  if(bestPick.dist<=3)rs.push("Hozirgi joydan borish qulay");
  if(!rs.length)rs.push("Balanslangan variant: talab va masofa uygʻunligi eng yaxshi");
  $("bestReasons").innerHTML="<b>Nima uchun bu joy?</b><br>• "+rs.map(esc).join("<br>• ");
  $("hotTop").innerHTML=sc.slice(0,5).map((s,i)=>'<div class="r" style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--line)"><span>'+(i+1)+". "+esc(s.z.n)+'</span><b class="mono">'+s.score+" · "+(s.raw!=null?Math.round(s.raw)+" pikap/s":"—")+"</b></div>").join("");
  renderHot();renderSmart(sc);renderEventsClosures();
  try{fitHome()}catch(e){}
}
/* Hotspot Ranking 2.0 (Modul 10) — vaqt tanlash, boy kartalar, saralash, GO */
function zoneRates(){const m={};journal.forEach(e=>{if(!e.zone||!(e.hours>0))return;const k=e.zone;if(!m[k])m[k]={net:0,h:0,n:0};m[k].net+=netOf(e.gross,e.miles,e.exp);m[k].h+=e.hours;m[k].n++});const out={};Object.keys(m).forEach(k=>{if(m[k].h>0)out[k]={v:m[k].net/m[k].h,n:m[k].n}});return out}
function sparkSVG(series){
  if(!series||series.length<2)return "";
  const mx=Math.max.apply(null,series.concat([1])),mn=Math.min.apply(null,series.concat([0]));
  const rg=(mx-mn)||1,W=72,H=24;
  const pts=series.map((v,i)=>((i/(series.length-1))*W).toFixed(1)+","+(H-3-((v-mn)/rg)*(H-6)).toFixed(1)).join(" ");
  return '<svg class="spark" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
}
function rainAt(z,off){
  if(!off)return zoneWx[z.n];
  const idx=hourIdx(new Date(nowNY().getTime()+off*3600e3));const pp=zoneWxH[z.n];
  if(pp&&idx>=0&&idx<pp.length)return pp[idx];
  return zoneWx[z.n];
}
function renderHot(){
  const box=$("hotList");if(!box)return;
  const sc=zoneScoresAt(hotOff);
  const zr=zoneRates();
  let list=sc.filter(s=>!hotMax||s.dist<=hotMax);
  if(hotSort==="dist")list=list.slice().sort((a,b)=>a.dist-b.dist);
  else if(hotSort==="demand")list=list.slice().sort((a,b)=>(((b.D==null?-1:b.D)-(a.D==null?-1:a.D))||(b.score-a.score)));
  else if(hotSort==="rate")list=list.slice().sort((a,b)=>{const ra=zr[a.z.n],rb=zr[b.z.n];if(rb&&!ra)return 1;if(ra&&!rb)return -1;if(ra&&rb)return rb.v-ra.v;return b.score-a.score});
  const shown=hotAll?list:list.slice(0,10);
  lastHotList=shown;
  const at=new Date(nowNY().getTime()+hotOff*3600e3);
  const tLbl=hotOff===0?"Hozir":at.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+" (+"+hotOff+" soat)";
  const medals=["🥇","🥈","🥉"];
  const sortLbl=hotSort==="score"?"Ball":hotSort==="rate"?"Real $/soat":hotSort==="dist"?"Masofa":"Talab";
  box.innerHTML='<div class="small" style="margin-bottom:8px">Vaqt: <b>'+tLbl+'</b> · '+shown.length+'/'+list.length+' hudud · Saralash: '+sortLbl+'</div>'+
  shown.map((s,i)=>{
    const r=zr[s.z.n];
    const tr=s.trend>0?'<span class="htr up">↗ oʻsmoqda</span>':s.trend<0?'<span class="htr dn">↘ pasaymoqda</span>':'<span class="htr fl">→ barqaror</span>';
    let chips='<span>📊 '+(s.raw!=null?Math.round(s.raw)+" pikap/soat":"—")+'</span>';
    chips+='<span>💵 '+(r?money(r.v)+"/soat · "+r.n+" smena":"maʼlumot yoʻq")+'</span>';
    chips+='<span>📍 '+distTxt(s.dist)+' · ≈'+s.etaMin+' daq</span>';
    if(s.z.ap&&hotOff===0&&adsb[s.z.ap])chips+='<span>✈️ '+adsb[s.z.ap].total+' kelmoqda · '+adsb[s.z.ap].low+' yaqin (LIVE)</span>';
    if(s.E>=40)chips+='<span>🎉 tadbir yaqin</span>';
    if(s.T<70)chips+='<span>🚧 yopilish bor</span>';
    const rp=rainAt(s.z,hotOff);if(rp!=null&&rp>=50)chips+='<span>🌧 '+Math.round(rp)+'%</span>';
    const cb=[["D",s.D],["F",s.F],["E",s.E],["W",s.W],["T",s.T],["P",s.P]].map(kv=>'<div class="hcb"><span>'+kv[0]+' '+(kv[1]==null?"—":kv[1])+'</span><div class="bar"><i style="width:'+(kv[1]==null?0:Math.min(100,kv[1]))+'%"></i></div></div>').join("");
    const rk=(hotSort==="score"&&medals[i])?medals[i]:("#"+(i+1));
    return '<div class="hcard'+(i===0&&hotSort==="score"?" top":"")+'"><div class="hrow1"><span class="rk">'+rk+'</span><div class="hn">'+esc(s.z.n)+' '+tr+'</div><div class="hs mono">'+s.score+'</div></div>'+
    '<div class="hsub">'+sparkSVG(s.series)+'<span class="small">Keyingi 6 soat talabi (TLC naqsh)</span></div>'+
    '<div class="hchips">'+chips+'</div><div class="hcbs">'+cb+'</div>'+
    '<div class="hbtns"><button class="go" data-hgo="'+i+'">📍 GO — Google Maps</button><button class="ghost" data-hrec="'+i+'">✔️ Yozib qoʻyish</button></div></div>';
  }).join("");
  const more=$("hotMore");if(more){more.style.display=list.length>10?"":"none";more.textContent=hotAll?"Faqat top-10":"Hammasini koʻrsatish ("+list.length+")"}
  const note=$("hotNote");if(note)note.textContent="Ball — ESTIMATED model: D — TLC tarixiy naqsh (2025-09), F — aeroport oqimi naqshi (kelajak soatlarda ham naqsh), E — faol tadbirlar, W — ob-havo (kelajakda — prognoz), T — faol yopilishlar, P — masofa. Reyslar LIVE chipi faqat «Hozir» rejimida (AirLabs). $/soat — faqat sizning jurnalingizdan.";
  document.querySelectorAll("#hotChips .hchip").forEach(b=>b.classList.toggle("on",+b.dataset.hoff===hotOff));
}
/* Smart breakdown */
function renderSmart(sc){
  const s=sc[0];
  const row=(n,v)=>"<div class='small' style='display:flex;justify-content:space-between'><span>"+n+"</span><b>"+v+"</b></div><div class='bar'><i style='width:"+Math.min(100,v)+"%'></i></div>";
  $("smartBox").innerHTML="<div class='mid'>Eng kuchli tavsiya: "+esc(s.z.n)+" — "+s.score+"/100</div>"+
   row("Talab (D) ×"+effW().D,s.D)+row("Reyslar (F) ×"+effW().F,s.F)+row("Tadbirlar (E) ×"+effW().E,s.E)+row("Ob-havo (W) ×"+effW().W,s.W)+row("Yoʻl holati (T) ×"+effW().T,s.T)+row("Masofa mosligi (P) ×"+effW().P,s.P)+
   "<div class='small'>Real $/soat: "+(lastRPH?money(lastRPH.v)+" (jurnal, "+lastRPH.n+" smena)":"maʼlumot yoʻq")+" · borish ≈"+s.etaMin+" daq ("+distTxt(s.dist)+") · Confidence: "+(bestPick&&bestPick.conf?bestPick.conf+"%":"—")+"</div>";
}

/* ================= Airports (Modul 2 + 16) ================= */
/* ================= Airports (Modul 2 + 16) — LIVE AirLabs + TLC tarixiy ================= */
let curAp="JFK";
function airportScore(ap,zrMap,pureHist){
  const zn=apZoneName(ap.code);
  const dist=hav(userLat(),userLon(),ap.lat,ap.lon);
  const etaMin=Math.max(2,Math.round(dist*3.2));
  const now=nowNY();
  const rawNow=patternRawAt({n:zn},now);
  const arrAt=new Date(now.getTime()+etaMin*60000);
  const rawArr=patternRawAt({n:zn},arrAt);
  const peakRef=ZD?ZD.meta.peakRef:0;
  const H=(rawArr!=null&&peakRef)?Math.min(100,rawArr/peakRef*100):null;
  const a=adsb[ap.code];
  let L=null;
  if(a&&rawNow&&!pureHist){const r=a.next60/Math.max(1,rawNow);L=Math.max(5,Math.min(98,Math.round(20+60*r)))}
  let P=Math.max(5,100-dist*7);if(settings.zone&&settings.zone===zn)P=Math.min(100,P+6);
  let acc=0,wsum=0;
  [["L",L,0.45],["H",H,0.35],["P",P,0.20]].forEach(kv=>{if(kv[1]==null)return;acc+=kv[2]*kv[1];wsum+=kv[2]});
  const score=wsum?Math.round(acc/wsum):0;
  const zr=(zrMap&&zrMap[zn])||null;
  return {ap:ap,zn:zn,dist:dist,etaMin:etaMin,rawNow:rawNow,rawArr:rawArr,H:H==null?null:Math.round(H),L:L,P:Math.round(P),score:score,zr:zr,arrAt:arrAt};
}
function renderAirports(){syncApModeUI();if(apMode()==="live")renderAirportsLive();else renderAirportsHist()}
function renderAirportsHist(){
  const h=nowNY().getHours();
  const zrMap=zoneRates();
  const scs=AIRPORTS.map(ap=>airportScore(ap,zrMap,true)).sort((a,b)=>b.score-a.score);
  const best=scs[0];
  const bEl=$("apBest");
  if(bEl&&best){
    const a=adsb[best.ap.code];
    const rs=[];
    if(best.rawArr!=null)rs.push("Borib yetganingizda tarixiy oqim ≈"+Math.round(best.rawArr)+" pikap/soat");
    rs.push("Borish: "+distTxt(best.dist)+" · ≈"+best.etaMin+" daq");
    if(best.zr)rs.push("Jurnalingiz: "+money(best.zr.v)+"/soat ("+best.zr.n+" smena)");
    let advice="";
    bEl.innerHTML='<div class="card apbest"><h3>🏆 Hozir eng foydali: '+best.ap.code+' — '+esc(best.ap.name)+'</h3>'+
    '<div class="big mono">'+best.score+' <span style="font-size:14px;color:var(--mut)">/100 aeroport balli (ESTIMATED)</span></div>'+
    '<div class="small">• '+rs.map(esc).join("<br>• ")+'</div>'+
    (advice?'<div class="small" style="margin-top:4px">'+esc(advice)+'</div>':"")+
    '<div class="hbtns" style="margin-top:8px"><button class="go" onclick="apGo(\''+best.ap.code+'\')">📍 GO — Google Maps</button><button class="ghost" onclick="apRec(\''+best.ap.code+'\')">✔️ Yozib qoʻyish</button></div>'+
    '<div class="src">Ball: H tarixiy oqim (borish vaqtiga) ×0.35 + P masofa ×0.20 — faqat tarixiy naqshdan, jonli maʼlumotsiz.</div></div>';
  }
  const cEl=$("apCompare");
  if(cEl){
    const row=(lbl,fn)=>"<tr><td>"+lbl+"</td>"+scs.map(x=>"<td>"+fn(x)+"</td>").join("")+"</tr>";
    cEl.innerHTML='<div class="card"><h3>Taqqoslash — 3 aeroport</h3><table><tr><th></th>'+scs.map(x=>"<th>"+x.ap.code+"</th>").join("")+"</tr>"+
    row("Ball",x=>"<b>"+x.score+"</b>")+
    row("Pikap hozir",x=>x.rawNow!=null?Math.round(x.rawNow)+" pikap/s":"—")+
    row("Oqim (borishda)",x=>x.rawArr!=null?Math.round(x.rawArr)+" pikap/s":"—")+
    row("Real $/soat",x=>x.zr?money(x.zr.v):"—")+
    row("Masofa",x=>distTxt(x.dist)+" · ≈"+x.etaMin+" daq")+
    "</table></div>";
  }
  $("apCards").innerHTML=scs.map((s,idx)=>{
    const ap=s.ap,a=adsb[ap.code];
    const zd=zdata(s.zn);const arr=zd?(isWE()?zd.we:zd.wd):null;const peak=arr?Math.max.apply(null,arr):null;
    let liveHtml;
    if(a){
      const mx=Math.max.apply(null,a.wave.concat([1]));
      const wave='<div class="wave">'+a.wave.map((v,i)=>'<div class="wcol"><b>'+v+'</b><div class="wbar"><div class="wb" style="height:'+Math.max(3,Math.round(v/mx*44))+'px"></div></div><span>+'+(i*10)+'d</span></div>').join("")+'</div>';
      liveHtml='<div class="stat3"><div class="cell"><b class="mono">'+a.total+'</b><span>kelmoqda (LIVE)</span></div><div class="cell"><b class="mono">'+a.low+'</b><span>yaqin ≤50 mi</span></div><div class="cell"><b class="mono">≈'+a.next60+'</b><span>qoʻnish 60 daq</span></div></div>'+
      '<div class="small" style="margin-top:6px">Qoʻnish toʻlqini (taxminiy qoʻnish vaqti, 10 daqiqalik oraliqlar):</div>'+wave+
      (a.origins&&a.origins.length?'<div class="hchips">'+a.origins.map(o=>'<span>🛫 '+esc(cityOf(o.c))+' ×'+o.n+'</span>').join("")+'</div>':"")+
      '<div class="small">Yangilandi: '+new Date(a.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+'</div>'+
      (a.list.length?'<div class="small">Eng yaqin reyslar (qoʻnish vaqti — taxminiy):<br>'+a.list.map(x=>esc(x.f||"—")+" · "+esc(cityOf(x.dep))+" · ~"+new Date(x.eta).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+" · "+(x.alt!=null?Math.max(0,Math.round(x.alt))+" ft":"—")+" · "+distTxt(x.d)).join("<br>")+'</div>':"");
    } else {
      liveHtml='<div class="med">Jonli maʼlumot hali yoʻq</div><div class="small">AirLabs soʻrovi kutilmoqda yoki javob bermadi — ball tarixiy oqim va masofadan hisoblandi.</div>';
    }
    const rp=zoneWx[s.zn];
    return '<div class="card'+(idx===0?" apbest":"")+'"><h3>✈️ '+ap.code+" — "+esc(ap.name)+' <span class="mono" style="float:right">'+s.score+'/100</span></h3>'+
    '<div class="small" style="margin-bottom:4px"><span class="badge b-hist">HISTORICAL</span> TLC · <span class="badge b-est">ESTIMATED</span> ball</div>'+
    '<div class="stat3" style="margin-top:8px"><div class="cell"><b class="mono">'+(s.rawNow!=null?Math.round(s.rawNow):"—")+'</b><span>pikap/soat hozir (TLC)</span></div><div class="cell"><b class="mono">'+(s.rawArr!=null?Math.round(s.rawArr):"—")+'</b><span>borib yetganda</span></div><div class="cell"><b class="mono">'+(peak!=null?Math.round(peak):"—")+'</b><span>kun piki</span></div></div>'+
    '<div class="hchips"><span>📍 '+distTxt(s.dist)+' · ≈'+s.etaMin+' daq</span><span>💵 '+(s.zr?money(s.zr.v)+"/soat · "+s.zr.n+" smena":"maʼlumot yoʻq")+'</span>'+(rp!=null?'<span>🌧 '+Math.round(rp)+'%</span>':"")+'<span>H '+(s.H==null?"—":s.H)+' · P '+s.P+'</span></div>'+
    '<div class="small">'+esc(ap.term)+'</div>'+
    '<div class="hbtns" style="margin-top:8px"><button class="go" onclick="apGo(\''+ap.code+'\')">📍 GO — Google Maps</button><button class="ghost" onclick="apRec(\''+ap.code+'\')">✔️ Yozib qoʻyish</button></div>'+
    '<div class="src">Uber ichki navbati ochiq emas — uydirilmaydi. Qoʻnish vaqtlari masofa/tezlikdan taxminiy.</div></div>';
  }).join("");
  drawApChart();
  const ha=$("homeAirports");
  if(ha)ha.innerHTML=AIRPORTS.filter(ap=>settings.airports.indexOf(ap.code)>=0).map(ap=>{
    const a=adsb[ap.code];const zd=zdata(apZoneName(ap.code));const raw=zd?(isWE()?zd.we:zd.wd)[h]:null;
    return "<b>"+ap.code+"</b>: "+(a?("jonli "+a.total+" reys · toʻlqin 60 daq ≈"+a.next60):"jonli maʼlumot yoʻq")+" · tarixiy oqim "+(raw!=null?Math.round(raw)+" pikap/soat":"—");
  }).join("<br>")||"Sozlamalarda aeroport tanlanmagan";
}
function drawFlights(code){
  const zd=zdata(apZoneName(code));
  const cv=$("flightChart");if(!cv)return;const ctx=cv.getContext("2d");const W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  if(!zd){$("flightNote").textContent="TLC maʼlumoti (zones.json) hali yuklanmadi.";return}
  const arr=isWE()?zd.we:zd.wd;const h=nowNY().getHours();
  const ap=AIRPORTS.find(a=>a.code===code);
  const dist=hav(userLat(),userLon(),ap.lat,ap.lon);const etaMin=Math.max(2,Math.round(dist*3.2));
  const arrH=new Date(nowNY().getTime()+etaMin*60000).getHours();
  const mx=Math.max.apply(null,arr)*1.15||1;const bw=W/24;
  for(let i2=0;i2<24;i2++){
    const bh=(H-36)*(arr[i2]/mx);
    ctx.fillStyle=i2===h?"#22c55e":i2===arrH?"#f59e0b":"#3b82f6";
    ctx.fillRect(i2*bw+2,H-22-bh,bw-4,bh);
    if(i2===h||i2===arrH||arr[i2]>=mx/1.35){ctx.fillStyle=inkF();ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(Math.round(arr[i2]),i2*bw+bw/2,H-26-bh)}
    if(i2%3===0){ctx.fillStyle="#6f7278";ctx.font="10px sans-serif";ctx.textAlign="center";ctx.fillText(String(i2).padStart(2,"0"),i2*bw+bw/2,H-6)}
  }
  const sorted=arr.map((v,i2)=>({v:v,h:i2})).sort((a,b)=>b.v-a.v);
  const top3=sorted.slice(0,3).map(x=>String(x.h).padStart(2,"0")+":00").join(", ");
  const rank=sorted.findIndex(x=>x.h===h)+1;
  $("flightNote").textContent=code+": eng kuchli soatlar ≈ "+top3+" (TLC oʻrtacha). Hozirgi soat ("+String(h).padStart(2,"0")+":00, "+Math.round(arr[h])+" pikap/soat) kunning "+rank+"-oʻrnida. Sariq ustun — siz borib yetadigan soat (≈"+String(arrH).padStart(2,"0")+":00, "+Math.round(arr[arrH])+" pikap/soat).";
}
/* ================= Maʼlumot yuklagichlar (TLC / zona ob-havo / AirLabs) ================= */
let zonesBusy=false,zonesTry=0;
function loadZones(){
  if(ZD||zonesBusy)return;
  zonesBusy=true;zonesTry++;apiStat.zones="yuklanmoqda…";renderApiStat();
  const u=zonesTry>1?("zones.json?nc="+Date.now()):"zones.json";
  fetchT(u,9000).then(r=>r.json()).then(j=>{zonesBusy=false;ZD=j;apiStat.zones="OK · TLC HVFHS 2025-09 ("+j.zones.length+" zona)";renderApiStat();renderHome();renderAirports();if(typeof redrawHeats==="function")redrawHeats()})
  .catch(()=>{zonesBusy=false;apiStat.zones="XATO — zones.json yuklanmadi (qayta urinish…)";renderApiStat();setTimeout(loadZones,Math.min(60000,5000*zonesTry))});
}
function loadZoneWx(){
  const lats=ZONES.map(z=>z.lat).join(","),lons=ZONES.map(z=>z.lon).join(",");
  const u="https://api.open-meteo.com/v1/forecast?latitude="+lats+"&longitude="+lons+"&hourly=precipitation_probability&forecast_days=1&timezone=America%2FNew_York";
  fetchT(u,12000).then(r=>r.json()).then(j=>{
    const arr=Array.isArray(j)?j:[j];const h=nowNY().getHours();
    arr.forEach((w,i)=>{if(!ZONES[i]||!w||!w.hourly||!w.hourly.precipitation_probability)return;const pp=w.hourly.precipitation_probability;zoneWx[ZONES[i].n]=Math.max(pp[h]||0,pp[h+1]||0,pp[h+2]||0);zoneWxH[ZONES[i].n]=pp});
    renderHome();
  }).catch(()=>{});
}
const CITY = {
    ABQ: 'Albukerke', ACA: 'Akapulko', AGS: 'Augusta', AKL: 'Oklend', ALB: 'Olbeni',
    AMS: 'Amsterdam', ANC: 'Ankorij', ANU: 'Antigua', ASE: 'Aspen', ATL: 'Atlanta',
    AUA: 'Aruba', AUH: 'Abu-Dabi', AUS: 'Ostin', AVL: 'Eshvill', BDL: 'Hartford',
    BGR: 'Bangor', BGI: 'Barbados', BIL: 'Billings', BIS: 'Bismark', BKK: 'Bangkok',
    BLR: 'Bangalor', BNA: 'Nashvill', BOD: 'Bordo', BOG: 'Bogota', BOI: 'Boyse',
    BOM: 'Mumbay', BOS: 'Boston', BRU: 'Bryussel', BTR: 'Baton-Ruj', BUD: 'Budapesht',
    BUF: 'Buffalo', BUR: 'Burbank', BWI: 'Baltimor', BZN: 'Bozeman', CAE: 'Kolambiya',
    CAI: 'Qohira', CAN: 'Guanchjou', CCS: 'Karakas', CDG: 'Parij', CGK: 'Jakarta',
    CHS: 'Charleston', CID: 'Sidar-Repids', CLE: 'Klivlend', CLT: 'Sharlotta', CMH: 'Kolambus',
    CPH: 'Kopengagen', CRW: 'Charleston', CUN: 'Kankun', CUR: 'Kyurasao', CVG: 'Sinsinnati',
    DAL: 'Dallas', DAY: 'Deyton', DCA: 'Vashington', DEL: 'Dehli', DEN: 'Denver',
    DFW: 'Dallas', DOH: 'Doha', DSM: 'De-Moyn', DTW: 'Detroit', DUB: 'Dublin',
    DXB: 'Dubay', EDI: 'Edinburg', EGE: 'Veyl', ELP: 'El-Paso', EWR: 'Nyuark',
    EZE: 'Buenos-Ayres', FAI: 'Ferbenks', FAR: 'Fargo', FAT: 'Fresno', FCO: 'Rim',
    FLL: 'Fort-Loderdeyl', FRA: 'Frankfurt', GDL: 'Gvadalaxara', GEG: 'Spokan', GEO: 'Jorjtaun',
    GIG: 'Rio-de-Janeyro', GRR: 'Grand-Repids', GRU: 'San-Paulu', GUA: 'Gvatemala', GVA: 'Jeneva',
    HAV: 'Gavana', HDN: 'Hayden', HEL: 'Xelsinki', HKG: 'Gonkong', HNL: 'Gonolulu',
    HOU: 'Hyuston', HSV: 'Xantsvill', HYD: 'Haydarobod', IAD: 'Vashington', IAH: 'Hyuston',
    ICN: 'Seul', ICT: 'Uichita', IND: 'Indianapolis', IST: 'Istanbul', ITO: 'Hilo',
    JAC: 'Jekson', JAN: 'Jekson', JAX: 'Jeksonvill', JED: 'Jidda', JFK: 'Nyu-York',
    JNB: 'Yoxannesburg', KBP: 'Kiyev', KEF: 'Reykyavik', KIN: 'Kingston', KOA: 'Kona',
    KUL: 'Kuala-Lumpur', LAS: 'Las-Vegas', LAX: 'Los-Anjeles', LBB: 'Labbok', LCA: 'Larnaka',
    LGA: 'Nyu-York', LHR: 'London', LGW: 'London', LIH: 'Lixue', LIM: 'Lima',
    LIS: 'Lissabon', LIT: 'Litl-Rok', LUX: 'Lyuksemburg', MAA: 'Chennay', MAD: 'Madrid',
    MAN: 'Manchester', MBJ: 'Montego-Bey', MCI: 'Kanzas-Siti', MCO: 'Orlando', MDW: 'Chikago',
    MEL: 'Melburn', MEM: 'Memfis', MEX: 'Mexiko', MFE: 'Makallen', MGA: 'Managua',
    MIA: 'Mayami', MKE: 'Miluoki', MLA: 'Malta', MNL: 'Manila', MOB: 'Mobil',
    MSP: 'Minneapolis', MSY: 'Yangi Orlean', MTJ: 'Montrouz', MUC: 'Myunxen', MXP: 'Milan',
    MYR: 'Mertl-Bich', NAP: 'Neapol', NAS: 'Nassau', NRT: 'Tokio', HND: 'Tokio',
    OAK: 'Oukland', OGG: 'Kaxului', OKC: 'Oklaxoma-Siti', OMA: 'Omaxa', ORD: 'Chikago',
    ORF: 'Norfolk', OSL: 'Oslo', OTP: 'Buxarest', PBI: 'Vest-Palm-Bich', PDX: 'Portlend',
    PEK: 'Pekin', PHL: 'Filadelfiya', PHX: 'Finiks', PIA: 'Peoriya', PIE: 'Sent-Pitersburg',
    PIT: 'Pitsburg', PLS: 'Providensiales', POS: 'Port-of-Speyn', PRG: 'Praga', PSP: 'Palm-Springs',
    PTY: 'Panama', PUJ: 'Punta-Kana', PVG: 'Shanxay', PWM: 'Portlend', RDU: 'Roli',
    RIC: 'Richmond', RNO: 'Reno', RSW: 'Fort-Mayers', RUH: 'Ar-Riyod', SAL: 'San-Salvador',
    SAN: 'San-Diego', SAT: 'San-Antonio', SAV: 'Savanna', SBA: 'Santa-Barbara', SCL: 'Santyago',
    SDQ: 'Santo-Domingo', SEA: 'Sietl', SFO: 'San-Fransisko', SGF: 'Springfild', SIN: 'Singapur',
    SJC: 'San-Xose', SJO: 'San-Xose', SLC: 'Solt-Leyk-Siti', SMF: 'Sakramento', SNA: 'Santa-Ana',
    SOF: 'Sofiya', SRQ: 'Sarasota', STL: 'Sent-Luis', STI: 'Santyago', STS: 'Santa-Roza',
    SUN: 'San-Valli', SXM: 'Sen-Marten', SYD: 'Sidney', SYR: 'Sirakuza', TLV: 'Tel-Aviv',
    TPA: 'Tampa', TPE: 'Taypey', TRI: 'Tri-Sitiz', TUL: 'Talsa', TUS: 'Tukson',
    TVC: 'Travers-Siti', UIO: 'Kito', VCE: 'Venetsiya', VIE: 'Vena', VPS: 'Fort-Uolton',
    WAW: 'Varshava', XNA: 'Fayettvill', YEG: 'Edmonton', YHZ: 'Galifaks', YOW: 'Ottava',
    YQB: 'Kvebek', YUL: 'Monreal', YVR: 'Vankuver', YYC: 'Kalgari', YYZ: 'Toronto',
    ZRH: 'Syurix'
  };
function cityOf(code){if(!code)return "—";return (CITY[code]?CITY[code]+" ("+code+")":code)}
function waveOf(list,now){const w=[0,0,0,0,0,0];list.forEach(x=>{const b=Math.floor((x.eta-now)/600000);if(b>=0&&b<6)w[b]++});return w}
function etaMs(dMi,sp,alt,now){const km=dMi*1.60934;if(km<30)return now+8*60000;const v=(sp&&sp>0)?sp:(alt>10000?800:400);return now+(km/v*60+10)*60000}
function apViewOpen(){const v=document.getElementById("view-airports");return !!(v&&v.classList.contains("act"))}
function loadLiveFlights(force){
  const now=Date.now();
  if(!force&&now-liveTs<240000)return;
  liveTs=now;
  AIRPORTS.forEach(ap=>{
    fetchT("https://airlabs.co/api/v9/flights?api_key="+AIRLABS_KEY+"&arr_iata="+ap.code,15000).then(r=>r.json()).then(j=>{
      const fl=(j&&j.response)||[];
      const enr=fl.filter(f=>(f.status==="en-route"||f.status==="active")&&typeof f.lat==="number"&&typeof f.lng==="number");
      const list=enr.map(f=>{const d=hav(ap.lat,ap.lon,f.lat,f.lng);return {f:f.flight_iata||"—",alt:(typeof f.alt==="number"?f.alt:null),d:d,dep:f.dep_iata||"",eta:etaMs(d,f.speed,f.alt,now)}}).sort((a,b)=>a.d-b.d);
      const near=list.filter(x=>x.d<=50).length;
      const wave=waveOf(list,now);
      const next60=wave.reduce((a,b)=>a+b,0);
      const hours6=[0,0,0,0,0,0];list.forEach(x=>{const b=Math.floor((x.eta-now)/3600e3);if(b>=0&&b<6)hours6[b]++});
      const org={};enr.forEach(f=>{if(f.dep_iata)org[f.dep_iata]=(org[f.dep_iata]||0)+1});
      const origins=Object.keys(org).map(k=>({c:k,n:org[k]})).sort((a,b)=>b.n-a.n).slice(0,3);
      adsb[ap.code]={ts:now,total:enr.length,low:near,list:list.slice(0,8),wave:wave,next60:next60,next30:wave[0]+wave[1]+wave[2],hours6:hours6,origins:origins};
      apiStat.adsb="OK · "+nowNY().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
      renderApiStat();renderAirports();
    }).catch(()=>{apiStat.adsb="XATO — AirLabs javob bermadi";renderApiStat()});
  });
}
let liveTs=0;

/* ============ v10.31: Airports REAL TIME / HISTORICAL tanlovi (AirLabs jonli reyslar + TomTom jonli yo'l) ============ */
let apEta={},etaTs=0;
function apMode(){return settings.apMode==="hist"?"hist":"live"}
function loadApEta(force){
  const now=Date.now();
  if(!force&&now-etaTs<480000)return;
  etaTs=now;
  AIRPORTS.forEach(ap=>{
    const ttFallback=()=>{
      const url="https://api.tomtom.com/routing/1/calculateRoute/"+userLat()+","+userLon()+":"+ap.lat+","+ap.lon+"/json?key="+TT_KEY+"&traffic=true&travelMode=car"+(settings.ezpass?"":"&avoid=tollRoads");
      fetchT(url,12000).then(r=>r.json()).then(j=>{
        const sm=j&&j.routes&&j.routes[0]&&j.routes[0].summary;if(!sm)return;
        apEta[ap.code]={ts:now,min:Math.max(2,Math.round(sm.travelTimeInSeconds/60)),delayMin:Math.round((sm.trafficDelayInSeconds||0)/60),km:Math.round(sm.lengthInMeters/100)/10};
        if(apViewOpen()&&apMode()==="live")renderAirports();
      }).catch(()=>{});
    };
    /* v10.54: avval Google (duration_in_traffic) — Radar bilan bir xil raqamlar */
    gRoute(ap).then(g=>{
      if(g){apEta[ap.code]={ts:now,min:g.mins,delayMin:g.delayMin||0,km:Math.round(g.dist*16.0934)/10,src:"google"};if(apViewOpen()&&apMode()==="live")renderAirports()}
      else ttFallback();
    }).catch(()=>ttFallback());
  });
}
function airportScoreLive(ap,zrMap){
  const zn=apZoneName(ap.code);
  const dist=hav(userLat(),userLon(),ap.lat,ap.lon);
  const et=apEta[ap.code]||null;
  const etaMin=et?et.min:Math.max(2,Math.round(dist*3.2));
  const sc=adsb[ap.code]||null;
  let L=null,F=null;
  if(sc){L=Math.max(5,Math.min(98,Math.round(sc.next60*3)));F=Math.max(5,Math.min(98,Math.round(sc.next30*4.5)))}
  let P=Math.max(5,Math.round(100-etaMin*1.1));if(settings.zone&&settings.zone===zn)P=Math.min(100,P+6);
  let acc=0,wsum=0;
  [["L",L,0.5],["F",F,0.25],["P",P,0.25]].forEach(kv=>{if(kv[1]==null)return;acc+=kv[2]*kv[1];wsum+=kv[2]});
  const score=wsum?Math.round(acc/wsum):0;
  const zr=(zrMap&&zrMap[zn])||null;
  return {ap:ap,zn:zn,dist:(et&&et.km)?Math.round(et.km/1.60934*10)/10:dist,etaMin:etaMin,etaLive:!!et,score:score,L:L,F:F,P:P,zr:zr,sc:sc,et:et};
}
function setApMode(m){settings.apMode=(m==="hist"?"hist":"live");saveSettings();syncApModeUI();if(settings.apMode==="live"){loadLiveFlights(false);loadApEta(false)}renderAirports()}
function syncApModeUI(){
  document.querySelectorAll("#apModeChips .chip[data-apmode]").forEach(ch=>ch.classList.toggle("on",ch.getAttribute("data-apmode")===apMode()));
  const u=$("apUpd");if(!u)return;
  if(apMode()==="live"){const t=liveTs?new Date(liveTs).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";u.innerHTML="Rejim: <b>REAL TIME</b> · AirLabs jonli reyslari + Google jonli yoʻl · Yangilandi: "+t+" · Aeroport ekrani ochiq boʻlsa, avto-yangilanish ≈5 daq"}
  else u.innerHTML="Rejim: <b>HISTORICAL</b> · TLC HVFHS 2025-09 oʻrtacha naqshi — jonli emas, kun/soat boʻyicha odatiy oqim";
}
function renderAirportsLive(){
  const zrMap=zoneRates();
  const scs=AIRPORTS.map(ap=>airportScoreLive(ap,zrMap)).sort((a,b)=>b.score-a.score);
  const best=scs[0];
  const bEl=$("apBest");
  if(bEl&&best){
    const sc=best.sc,et=best.et,rs=[];
    if(sc)rs.push("Jonli: "+sc.total+" reys havoda kelmoqda, keyingi 60 daqiqada ≈"+sc.next60+" qoʻnish (jonli pozitsiyalar boʻyicha taxmin)");
    rs.push("Yoʻl: "+distTxt(best.dist)+" · ≈"+best.etaMin+" daq"+(et?" (jonli tirbandlik"+(et.delayMin?", +"+et.delayMin+" daq":"")+")":" (taxminiy)"));
    if(best.zr)rs.push("Jurnalingiz: "+money(best.zr.v)+"/soat ("+best.zr.n+" smena)");
    let advice="";
    if(sc&&sc.wave){let pk=0;sc.wave.forEach((v,i)=>{if(v>sc.wave[pk])pk=i});const curb=pk*10+5+20;
      if(Math.abs(best.etaMin-curb)<=10)advice="⏰ Hozir chiqish ayni muddao — qoʻnish toʻlqini siz yetgan paytga kuchayadi.";
      else if(best.etaMin<curb-10)advice="⏰ Erta yetasiz — toʻlqingacha ≈"+(curb-best.etaMin)+" daq kutish mumkin.";
      else advice="⏰ Bu toʻlqin oʻtib ketishi mumkin — keyingi oynani kuzating."}
    bEl.innerHTML='<div class="card apbest"><h3>🏆 Hozir eng foydali: '+best.ap.code+' — '+esc(best.ap.name)+'</h3>'+
    '<div class="big mono">'+best.score+' <span style="font-size:14px;color:var(--mut)">/100 REAL TIME balli</span></div>'+
    '<div class="small">• '+rs.map(esc).join("<br>• ")+'</div>'+
    (advice?'<div class="small" style="margin-top:4px">'+esc(advice)+'</div>':"")+
    '<div class="hbtns" style="margin-top:8px"><button class="go" onclick="apGo(\''+best.ap.code+'\')">📍 GO — Google Maps</button><button class="ghost" onclick="apRec(\''+best.ap.code+'\')">✔️ Yozib qoʻyish</button></div>'+
    '<div class="src">Ball: L jonli qoʻnish toʻlqini (60 daq) ×0.50 + F yaqin oqim (30 daq) ×0.25 + P jonli yoʻl vaqti ×0.25. Manbalar: AirLabs jonli reyslar, Google jonli yoʻl (duration_in_traffic).</div></div>';
  }
  const cEl=$("apCompare");
  if(cEl){
    const row=(lbl,fn)=>"<tr><td>"+lbl+"</td>"+scs.map(x=>"<td>"+fn(x)+"</td>").join("")+"</tr>";
    cEl.innerHTML='<div class="card"><h3>Taqqoslash — 3 aeroport <span class="badge b-live">REAL TIME</span></h3><table><tr><th></th>'+scs.map(x=>"<th>"+x.ap.code+"</th>").join("")+"</tr>"+
    row("Ball",x=>"<b>"+x.score+"</b>")+
    row("Havoda kelmoqda",x=>x.sc?x.sc.total:"—")+
    row("Qoʻnish 60 daq",x=>x.sc?"≈"+x.sc.next60:"—")+
    row("Yaqin ≤50 mi",x=>x.sc?x.sc.low:"—")+
    row("Yoʻl (jonli)",x=>"≈"+x.etaMin+" daq")+
    row("Real $/soat",x=>x.zr?money(x.zr.v):"—")+
    "</table></div>";
  }
  $("apCards").innerHTML=scs.map((s,idx)=>{
    const ap=s.ap,sc=s.sc;
    let liveHtml;
    if(sc){
      const mx=Math.max.apply(null,sc.wave.concat([1]));
      const wave='<div class="wave">'+sc.wave.map((v,i)=>'<div class="wcol"><b>'+v+'</b><div class="wbar"><div class="wb" style="height:'+Math.max(3,Math.round(v/mx*44))+'px"></div></div><span>+'+(i*10)+'d</span></div>').join("")+'</div>';
      liveHtml='<div class="stat3"><div class="cell"><b class="mono">'+sc.total+'</b><span>kelmoqda (LIVE)</span></div><div class="cell"><b class="mono">'+sc.low+'</b><span>yaqin ≤50 mi</span></div><div class="cell"><b class="mono">≈'+sc.next60+'</b><span>qoʻnish 60 daq</span></div></div>'+
      '<div class="small" style="margin-top:6px">Qoʻnish toʻlqini (jonli pozitsiyalardan taxminiy qoʻnish vaqti, 10 daqiqalik oraliqlar):</div>'+wave+
      (sc.origins&&sc.origins.length?'<div class="hchips">'+sc.origins.map(o=>'<span>🛫 '+esc(cityOf(o.c))+' ×'+o.n+'</span>').join("")+'</div>':"")+
      (sc.list.length?'<div class="small">Eng yaqin reyslar (qoʻnish — taxminiy):<br>'+sc.list.map(x=>esc(x.f||"—")+" · "+esc(cityOf(x.dep))+" · ~"+new Date(x.eta).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+" · "+(x.alt!=null?Math.max(0,Math.round(x.alt))+" ft":"—")+" · "+distTxt(x.d)).join("<br>")+'</div>':"")+
      '<div class="small">Yangilandi: '+new Date(sc.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+'</div>';
    } else {
      liveHtml='<div class="med">Jonli maʼlumot yuklanmoqda…</div><div class="small">AirLabs jonli reyslari soʻralmoqda. Kelmasa, 🔄 Yangilash ni bosing yoki HISTORICAL rejimga oʻting.</div>';
    }
    const rp=zoneWx[s.zn];
    return '<div class="card'+(idx===0?" apbest":"")+'"><h3>✈️ '+ap.code+" — "+esc(ap.name)+' <span class="mono" style="float:right">'+s.score+'/100</span></h3>'+
    '<div class="small" style="margin-bottom:4px"><span class="badge b-live">REAL TIME</span> AirLabs jonli reyslar · Google jonli yoʻl</div>'+liveHtml+
    '<div class="hchips" style="margin-top:8px"><span>📍 '+distTxt(s.dist)+' · ≈'+s.etaMin+' daq'+(s.etaLive?" (jonli)":"")+'</span><span>💵 '+(s.zr?money(s.zr.v)+"/soat · "+s.zr.n+" smena":"maʼlumot yoʻq")+'</span>'+(rp!=null?'<span>🌧 '+Math.round(rp)+'%</span>':"")+'<span>L '+(s.L==null?"—":s.L)+' · F '+(s.F==null?"—":s.F)+' · P '+s.P+'</span></div>'+
    '<div class="small">'+esc(ap.term)+'</div>'+
    '<div class="hbtns" style="margin-top:8px"><button class="go" onclick="apGo(\''+ap.code+'\')">📍 GO — Google Maps</button><button class="ghost" onclick="apRec(\''+ap.code+'\')">✔️ Yozib qoʻyish</button></div>'+
    '<div class="src">Uber ichki navbati ochiq emas — uydirilmaydi. Qoʻnish vaqtlari jonli pozitsiya/masofadan taxminiy.</div></div>';
  }).join("");
  drawApChart();
  const ha=$("homeAirports");
  if(ha)ha.innerHTML=AIRPORTS.filter(ap=>settings.airports.indexOf(ap.code)>=0).map(ap=>{
    const a=adsb[ap.code];
    return "<b>"+ap.code+"</b>: "+(a?("jonli "+a.total+" reys · toʻlqin 60 daq ≈"+a.next60):"jonli maʼlumot yoʻq");
  }).join("<br>")||"Sozlamalarda aeroport tanlanmagan";
}
function drawFlightsLive(code){
  const cv=$("flightChart");if(!cv)return;const ctx=cv.getContext("2d");const W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  const a=adsb[code];
  if(!a||!a.hours6){$("flightNote").textContent=code+": jonli reyslar hali yuklanmadi — AirLabs soʻrovi kutilmoqda.";return}
  const hrs=a.hours6;const mx=Math.max.apply(null,hrs.concat([1]))*1.15;const bw=W/6;const now=nowNY();
  for(let i=0;i<6;i++){
    const bh=(H-36)*(hrs[i]/mx);
    ctx.fillStyle=i===0?"#22c55e":"#3b82f6";
    ctx.fillRect(i*bw+8,H-22-bh,bw-16,bh);
    ctx.fillStyle=inkF();ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(hrs[i],i*bw+bw/2,H-26-bh);
    const lbl=new Date(now.getTime()+i*3600e3);ctx.fillStyle="#6f7278";ctx.font="10px sans-serif";ctx.fillText(String(lbl.getHours()).padStart(2,"0")+":00",i*bw+bw/2,H-6);
  }
  $("flightNote").textContent=code+": havodagi reyslarning taxminiy qoʻnishlari boʻyicha keyingi 6 soatda ≈"+hrs.reduce((x,y)=>x+y,0)+" reys shu aeroportga kelmoqda (jonli). Joriy soat: "+hrs[0]+" reys.";
}
function drawApChart(){
  const t=$("apChartTitle"),src=$("apChartSrc");
  if(apMode()==="live"){
    if(t)t.innerHTML='Aeroport oqimi — keyingi 6 soat <span class="badge b-live">REAL TIME</span>';
    if(src)src.textContent="Grafik: AirLabs jonli reyslari (havodagi pozitsiyalar) boʻyicha keyingi 6 soatda kutilayotgan qoʻnishlar soni — taxminiy qoʻnish vaqtlariga koʻra.";
    drawFlightsLive(curAp);
  } else {
    if(t)t.innerHTML='Aeroport oqimi — 24 soat <span class="badge b-hist">HISTORICAL</span>';
    if(src)src.textContent="Grafik: TLC HVFHS 2025-09 tarixiy oʻrtacha pikap oqimi — kelgan yoʻlovchilarning aeroportdan chiqish proksi. Jonli reyslar REAL TIME rejimida. Aniq reyslar uchun aviakompaniya ilovasini tekshiring.";
    drawFlights(curAp);
  }
}

/* ================= Weather (Modul 11) ================= */
const WX_TXT={0:"Ochiq osmon",1:"Asosan ochiq",2:"Qisman bulutli",3:"Bulutli",45:"Tuman",48:"Tuman",51:"Yengil yomgʻir",53:"Yomgʻir",55:"Yomgʻir",61:"Yomgʻir",63:"Kuchli yomgʻir",65:"Jala",71:"Qor",73:"Qor",75:"Kuchli qor",80:"Yomgʻir shovashi",81:"Yomgʻir shovashi",82:"Kuchli shova",95:"Momaqaldiroq"};
function loadWeather(){
  const u="https://api.open-meteo.com/v1/forecast?latitude="+userLat()+"&longitude="+userLon()+"&current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability,temperature_2m&forecast_days=1&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York";
  fetchT(u,9000).then(r=>r.json()).then(j=>{
    apiStat.weather="OK · "+nowNY().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    wxData=j;const c=j.current;
    const wxi=$("wxIcon");if(wxi)wxi.textContent=c.weather_code>=95?"⛈️":c.weather_code>=71?"🌨️":c.weather_code>=61?"🌧️":c.weather_code>=51?"🌦️":c.weather_code>=45?"🌫️":c.weather_code>=3?"☁️":c.weather_code===2?"⛅":c.weather_code===1?"🌤️":"☀️";
    const h=nowNY().getHours();
    const probs=(j.hourly&&j.hourly.precipitation_probability)||[];
    rainProb3h=Math.max(probs[h]||0,probs[h+1]||0,probs[h+2]||0);
    $("wxShort").textContent=Math.round(c.temperature_2m)+"°F · "+(WX_TXT[c.weather_code]||"—");
    $("wxSub").innerHTML='<span class="badge b-live">LIVE</span> Yomgʻir ehtimoli (3 soat): '+Math.round(rainProb3h)+"%";
    $("wxBox").innerHTML='<div class="mid">'+Math.round(c.temperature_2m)+'°F · '+esc(WX_TXT[c.weather_code]||"")+'</div><div class="small">Shamol: '+Math.round(c.wind_speed_10m)+' mph · Yogʻingarchilik: '+(c.precipitation||0)+' mm<br>Keyingi 3 soatda yomgʻir ehtimoli: <b>'+Math.round(rainProb3h)+'%</b>'+(rainProb3h>=50?' — <span class="med">Talab oshishi mumkin, tom yopiq rejimga tayyor turing.</span>':'')+'</div><div class="small">Yangilandi: '+nowNY().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+'</div>';
    drawWx(j);
    renderHome();
  }).catch(()=>{ apiStat.weather="XATO (timeout/tarmoq)"; $("wxBox").innerHTML='<span class="med">Ob-havo yuklanmadi</span> — internetni tekshirib, qayta oching. Eski tavsiyalar TLC tarixi asosida ishlaydi.'; $("wxShort").textContent="Maʼlumot yoʻq"; });
}
function drawWx(j){
  const cv=$("wxChart");if(!cv)return;const ctx=cv.getContext("2d");const W=cv.width,H=cv.height;
  const probs=j.hourly.precipitation_probability||[];const h=nowNY().getHours();
  ctx.clearRect(0,0,W,H);const n=12,bw=W/n;
  for(let i=0;i<n;i++){const p=probs[h+i]||0;const bh=(H-30)*(p/100);
    ctx.fillStyle=p>=50?"#f59e0b":"#3b82f6";ctx.fillRect(i*bw+6,H-20-bh,bw-12,bh);
    ctx.fillStyle=inkF();ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(p+"%",i*bw+bw/2,H-26-bh);
    ctx.fillStyle="#6f7278";ctx.font="10px sans-serif";ctx.fillText(String((h+i)%24).padStart(2,"0"),i*bw+bw/2,H-6);}
}

/* ================= Maps & Layers (Modul 1, 6, 12, 13, 15) ================= */
let map=null,mapHome=null,heatLayer=null,heatHome=null,userMk=null,userMkH=null;
const layerGroups={};
const BASE_LIGHT="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const BASE_DARK="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const BASE_LAYERS=[];
function tiles(){const t=L.tileLayer(settings.darkmap?BASE_DARK:BASE_LIGHT,{attribution:"Esri, OpenStreetMap",maxZoom:18});BASE_LAYERS.push(t);return t}
function updateThemeUI(){const b=$("btnTheme");if(b){b.classList.toggle("on",!!settings.darkmap);const tst=b.querySelector(".mc-state");if(tst)tst.textContent=settings.darkmap?"ON":"OFF"}}
function updateMtimeUI(){const b=$("btnMtime");if(b){b.classList.toggle("on",!!settings.mtime);const bst=b.querySelector(".mc-state");if(bst)bst.textContent=settings.mtime?"ON":"OFF"}const bar=$("mapTimeBar");if(bar)bar.style.display=settings.mtime?"flex":"none";if(!settings.mtime){const dr=$("mapDayRow");if(dr)dr.style.display="none"}}
function toggleMtime(){settings.mtime=!settings.mtime;saveSettings();updateMtimeUI();if(!settings.mtime){mapSelMin=null;mapSelDay=null;syncMapTimeUI();redrawMapHeat()}toast(settings.mtime?"Vaqt paneli ochildi":"Vaqt paneli yopildi")}
function applyBaseTheme(){const u=settings.darkmap?BASE_DARK:BASE_LIGHT;BASE_LAYERS.forEach(t=>{try{t.setUrl(u)}catch(e){}});updateThemeUI()}
function toggleTheme(){settings.darkmap=!settings.darkmap;saveSettings();applyBaseTheme();toast(settings.darkmap?"Tungi xarita yoqildi":"Kunduzgi xarita yoqildi")}
const DAYLBL=["Mo","Tu","We","Th","Fr","Sa","Su"];
let mapSelMin=null,mapSelDay=null,lastHeatKey="";
function todayIdx(){return (nowNY().getDay()+6)%7}
function dayRawAt(z,dayIdx,hour){const zd=zdata(z.n);if(!zd)return null;if(zd.days&&zd.days[dayIdx])return zd.days[dayIdx][hour];return ((dayIdx===5||dayIdx===6)?zd.we:zd.wd)[hour]}
function heatScores(dayIdx,hour){
  const base=zoneScoresAt(hour-nowNY().getHours());
  const peakRef=ZD?ZD.meta.peakRef:0;const w=effW();
  return base.map(s0=>{
    const raw=dayRawAt(s0.z,dayIdx,hour);
    if(raw==null||!peakRef)return s0;
    const D=Math.min(100,raw/peakRef*100);
    let acc=0,ws=0;[["D",D],["F",s0.F],["E",s0.E],["W",s0.W],["T",s0.T],["P",s0.P]].forEach(kv=>{if(kv[1]==null)return;acc+=w[kv[0]]*kv[1];ws+=w[kv[0]]});
    return Object.assign({},s0,{raw:raw,D:Math.round(D),score:ws?Math.round(acc/ws):s0.score});
  });
}
function heatCircles(target,sel){
  const g=L.layerGroup();
  const dayIdx=sel?sel.day:todayIdx();
  const hour=sel?sel.hour:nowNY().getHours();
  const sc=heatScores(dayIdx,hour);
  const pop=s=>"<b>"+esc(s.z.n)+"</b><br>Talab \u00b7 "+DAYLBL[dayIdx]+" "+String(hour).padStart(2,"0")+":00: "+(s.D==null?"\u2014":s.D)+"/100<br>Ball: "+s.score+(s.raw!=null?" \u00b7 "+Math.round(s.raw)+" pikap/soat":"");
  let heatOk=false;
  const pts=sc.filter(s=>s.D!=null&&s.D>0).map(s=>[s.z.lat,s.z.lon,s.D]);
  const tsz=(target&&target.getSize)?target.getSize():null;
  const canHeat=(!tsz||(tsz.x>0&&tsz.y>0));
  if(pts.length&&canHeat&&typeof L.heatLayer==="function"){
    try{L.heatLayer(pts,{minOpacity:.25,radius:58,blur:38,maxZoom:17,max:100,gradient:{0.1:"#ffffcc",0.3:"#ffeda0",0.5:"#feb24c",0.7:"#fd8d3c",0.85:"#fc4e2a",1:"#bd0026"}}).addTo(g);heatOk=true}catch(e){heatOk=false}
  }
  sc.forEach(s=>{
    if(heatOk){
      L.circle([s.z.lat,s.z.lon],{radius:500+(s.D||0)*14,stroke:false,fillColor:"#ffffff",fillOpacity:0}).addTo(g).bindPopup(pop(s));
    }else{
      const col=s.D==null?"#9ca3af":s.D>=75?"#ef4444":s.D>=50?"#f5b301":"#22c55e";
      L.circle([s.z.lat,s.z.lon],{radius:500+(s.D||0)*14,color:col,weight:1,fillColor:col,fillOpacity:.32}).addTo(g).bindPopup(pop(s));
    }
  });
  return g;
}
function initMaps(){
  if(map||typeof L==="undefined")return;
  map=L.map("map").setView([userLat(),userLon()],13);tiles().addTo(map);
  heatLayer=heatCircles(map);heatLayer.addTo(map);layerGroups.heat=heatLayer;
  layerGroups.cam=L.layerGroup();layerGroups.ev=L.layerGroup();layerGroups.wc=L.layerGroup();layerGroups.close=L.layerGroup();layerGroups.tesla=L.layerGroup();
  layerGroups.loc=L.layerGroup();layerGroups.cruise=L.layerGroup();layerGroups.air=L.layerGroup();
  CAMS_FB.forEach(c=>L.marker([c.lat,c.lon]).addTo(layerGroups.cam).bindPopup("📷 Kamera — "+esc(c.n)+"<br><span>Taxminiy nuqta — OSM tekshiruvi 3-bosqichda</span>"));
  CLOSURES.forEach(c=>{ if(c.lat)L.marker([c.lat,c.lon]).addTo(layerGroups.close).bindPopup("🚧 "+esc(c.n)+(clActive(c)?" (FAOL)":""))});
  routeGroup=L.layerGroup().addTo(map);
  trafficLayer=L.tileLayer("https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key="+TT_KEY,{maxZoom:22,opacity:0.95,attribution:"\u00A9 TomTom"});
  let tileErrCount=0;
  trafficLayer.on("tileerror",()=>{tileErrCount++;if(tileErrCount>=3&&!tileDegraded){tileDegraded=true;updateTrafficUI()}});
  trafficLayer.on("tileload",()=>{if(tileErrCount>0){tileErrCount=0;if(tileDegraded){tileDegraded=false;updateTrafficUI()}}});
  if(settings.traffic)trafficLayer.addTo(map);
  const mc=L.control({position:"topleft"});
  mc.onAdd=function(){
    const d=L.DomUtil.create("div","mapctl");
    d.innerHTML='<a href="#" id="btnMtime" class="mc-btn" title="Vaqt"><span class="mc-ic">\uD83D\uDD50</span><span class="mc-state">OFF</span></a><a href="#" id="btnTraffic" class="mc-btn" title="Traffic"><span class="mc-ic">\uD83D\uDEA6</span><span class="mc-warn">\u26A0</span><span class="mc-state">ON</span></a><a href="#" id="btnEzpass" class="mc-btn" title="EZPass"><span class="mc-ic">\uD83D\uDEE3\uFE0F</span><span class="mc-state">ON</span></a><a href="#" class="mc-btn mc-layer" data-layer="wc" title="Restroom"><span class="mc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6.8" cy="4.4" r="1.7"/><path d="M6.8 6.8v5.4M4.6 9.4h4.4M6.8 12.2 5.4 20M6.8 12.2 8.2 20M12.2 3.6v16.8"/><circle cx="17.2" cy="4.4" r="1.7"/><path d="M17.2 6.8 15 12.6h4.4L17.2 6.8zM15.8 12.6 15 20M18.6 12.6 19.4 20"/></svg></span><span class="mc-state">OFF</span></a><a href="#" class="mc-btn mc-layer" data-layer="ev" title="Tesla"><span class="mc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#CC0000" d="m12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438c-.146-1.439-1.154-1.79-4.354-1.79L12 24L8.619 5.034c-3.18 0-4.188.354-4.335 1.792c0 0-2.146-.795-3.229-2.43C5.28 2.431 9.525 2.34 9.525 2.34zl-.004.002H12zm0-3.899c3.415-.03 7.326.528 11.328 2.28c.535-.968.672-1.395.672-1.395C19.625.612 15.528.015 12 0C8.472.015 4.375.61 0 2.349c0 0 .195.525.672 1.396C4.674 1.989 8.585 1.435 12 1.46z"/></svg></span><span class="mc-state">OFF</span></a><a href="#" class="mc-btn mc-layer" data-layer="loc" title="HotelTochka"><span class="mc-ic">\uD83C\uDFE8</span><span class="mc-state">OFF</span></a><a href="#" class="mc-btn mc-layer" data-layer="cruise" title="Cruise"><span class="mc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 15.5h17l-2 4.8H5.5l-2-4.8z"/><path d="M6 15.5v-2.8h12v2.8M9 12.7V10h6v2.7M12 10V7.4"/></svg></span><span class="mc-state">OFF</span></a><a href="#" class="mc-btn mc-layer" data-layer="air" title="Airport"><span class="mc-ic"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></span><span class="mc-state">OFF</span></a><a href="#" id="btnRecenter" class="mc-btn" title="Recenter"><span class="mc-ic">\uD83C\uDFAF</span></a><a href="#" id="btnTheme" class="mc-btn" title="Tungi xarita"><span class="mc-ic">\uD83C\uDF19</span><span class="mc-state">OFF</span></a>';
    L.DomEvent.disableClickPropagation(d);
    return d;
  };
  mc.addTo(map);
  $("btnMtime").addEventListener("click",e=>{e.preventDefault();toggleMtime()});
  $("btnTraffic").addEventListener("click",e=>{e.preventDefault();toggleTraffic()});
  $("btnEzpass").addEventListener("click",e=>{e.preventDefault();toggleEzpass()});
  $("btnRecenter").addEventListener("click",e=>{e.preventDefault();recenterMap()});
  $("btnTheme").addEventListener("click",e=>{e.preventDefault();toggleTheme()});
  document.querySelectorAll(".mc-layer").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();mapToggle(b.getAttribute("data-layer"),b)}));
  updateTrafficUI();updateEzpassUI();updateThemeUI();updateMtimeUI();
  userMk=L.marker([userLat(),userLon()]).addTo(map).bindPopup("Siz");
  mapHome=L.map("mapHome",{scrollWheelZoom:false}).setView([userLat(),userLon()],11);tiles().addTo(mapHome);
  heatHome=heatCircles(mapHome);heatHome.addTo(mapHome);
  userMkH=L.marker([userLat(),userLon()]).addTo(mapHome).bindPopup("Siz");
}
let rainLayer=null;
function toggleLayer(name,on){
  if(!map)initMaps();
  if(name==="rain"){
    if(on){fetchT("https://api.rainviewer.com/public/weather-maps.json",8000).then(r=>r.json()).then(j=>{apiStat.rain="OK";
      const past=j.radar.past;const last=past[past.length-1];
      rainLayer=L.tileLayer("https://tilecache.rainviewer.com"+last.path+"/256/{z}/{x}/{y}/2/1_1.png",{opacity:.55,zIndex:5});rainLayer.addTo(map);toast("Yomgʻir radari yoqildi (LIVE)");
    }).catch(()=>toast("Radar yuklanmadi"));}
    else if(rainLayer){map.removeLayer(rainLayer);rainLayer=null}
    return;
  }
  const g=layerGroups[name];if(!g)return;
  if(on)g.addTo(map);else map.removeLayer(g);
  if(name==="ev"){if(layerGroups.tesla){if(on)layerGroups.tesla.addTo(map);else map.removeLayer(layerGroups.tesla)}if(on){refreshEV(false);refreshTesla()}}
  if(name==="wc"&&on)refreshWC(false);
}

/* ================= OSM jonli roʻyxatlar (fallback bilan) ================= */
/* ===== Map: Radar uslubidagi qatlamlar (v10.9) ===== */
let TESLA_ITEMS=null,mapOn={wc:false,ev:false,loc:false,cruise:false,air:false},panelLayer=null,savedMapView=null;
const visCount={wc:5,ev:5,loc:5,cruise:5,air:5};
const routeInfo={};
function mkIcon(cls,html){return L.divIcon({className:"",html:'<div class="mk '+cls+'">'+html+'</div>',iconSize:[28,28],iconAnchor:[14,14]})}
function layerItems(layer){
  if(layer==="wc")return (WC_ITEMS||distSort(WC_FB)).slice(0,20).map(x=>({n:x.n,sub:"",lat:x.lat,lon:x.lon,d:(x.d!=null?x.d:hav(userLat(),userLon(),x.lat,x.lon))}));
  if(layer==="ev")return (TESLA_ITEMS||[]).map(x=>({n:x.n,sub:x.addr||"Tesla Supercharger",lat:x.lat,lon:x.lon,d:(x.d!=null?x.d:hav(userLat(),userLon(),x.lat,x.lon))}));
  if(layer==="loc")return HOTEL_TOCHKA.map(p=>({n:p.n,sub:p.h+" ta hotel \u00b7 "+p.sub,lat:p.lat,lon:p.lon,kind:"tochka",h:p.h,d:hav(userLat(),userLon(),p.lat,p.lon)}));
  if(layer==="cruise")return distSort(CRUISE2.map(p=>({n:p.n,sub:"Cruise terminal",lat:p.lat,lon:p.lon}))).map(x=>({n:x.n,sub:x.sub,lat:x.lat,lon:x.lon,d:x.d}));
  if(layer==="air")return distSort(AIRPORTS.map(p=>({n:p.code+" \u2014 "+p.name,sub:p.term,lat:p.lat,lon:p.lon}))).map(x=>({n:x.n,sub:x.sub,lat:x.lat,lon:x.lon,d:x.d}));
  return [];
}
function sortedItems(layer){if(layer==="loc")return layerItems(layer).slice().sort((p,q)=>(q.h||0)-(p.h||0));return layerItems(layer).slice().sort((p,q)=>{const rp=routeInfo[routeKey(layer,p)],rq=routeInfo[routeKey(layer,q)];const ep=rp&&rp.dist!=null?rp.dist:(p.d!=null?p.d:1e9),eq=rq&&rq.dist!=null?rq.dist:(q.d!=null?q.d:1e9);return ep-eq})}
function drawMapLayer(layer){
  if(typeof layerGroups==="undefined")return;
  const items=sortedItems(layer),vis=items.slice(0,visCount[layer]);
  const put=(g,x,icon)=>{const m=L.marker([x.lat,x.lon],{icon:icon}).addTo(g);m.bindTooltip("<b>"+esc(x.n)+"</b>",{direction:"top",offset:[0,-14]});m.on("click",()=>(layer==="wc"?navGo:gmaps)(x.lat,x.lon))};
  if(layer==="wc"){const g=layerGroups.wc;if(!g)return;g.clearLayers();vis.forEach(x=>put(g,x,mkIcon("mk-wc","\uD83D\uDEBB")))}
  if(layer==="ev"){const g=layerGroups.tesla;if(!g)return;g.clearLayers();vis.forEach(x=>put(g,x,mkIcon("mk-tesla","\u26A1")))}
  if(layer==="loc"){const g=layerGroups.loc;if(!g)return;g.clearLayers();vis.forEach(x=>put(g,x,x.kind==="tochka"?mkIcon("mk-tochka",String(x.h)):mkIcon("mk-loc","\uD83D\uDCCD")))}
  if(layer==="cruise"){const g=layerGroups.cruise;if(!g)return;g.clearLayers();vis.forEach(x=>put(g,x,mkIcon("mk-loc","\uD83D\uDEA2")))}
  if(layer==="air"){const g=layerGroups.air;if(!g)return;g.clearLayers();vis.forEach(x=>put(g,x,mkIcon("mk-loc","\u2708\uFE0F")))}
  syncRouteLines();
}
function routeKey(layer,x){return layer+"@"+x.lat.toFixed(4)+","+x.lon.toFixed(4)}

let trafficLayer=null,routeDegraded=false,tileDegraded=false,routeEpoch=0,lastWcRoutePos=null;
const kickSeq={},kickBusy={};
/* v10.54: Aeroport ETA — Google (TLC Radar dagi usul, pullik kalit): DirectionsService, duration_in_traffic.
   Boshqa qatlamlar TomTom da qoladi (kvota tejash, Radar dagi kabi). Google ishlamasa — TomTom zaxira. */
const GOOGLE_KEY="AIzaSyAllWCzmo5-jCq13g1AhvbQ0EafwblrXjg";
let _gmapsPromise=null,_googleDisabled=false;
function gUsage(){try{return JSON.parse(localStorage.getItem("drv_gusage")||"{}")}catch(e){return{}}}
function gLeft(){const u=gUsage();return u.day===new Date().toDateString()?Math.max(0,300-(u.count||0)):300}
function gCount(){try{const u=gUsage();const d=new Date().toDateString();if(u.day!==d){u.day=d;u.count=0}u.count=(u.count||0)+1;localStorage.setItem("drv_gusage",JSON.stringify(u))}catch(e){}}
function loadGoogleMaps(){
  if(window.google&&window.google.maps&&window.google.maps.DirectionsService)return Promise.resolve(true);
  if(_gmapsPromise)return _gmapsPromise;
  _gmapsPromise=new Promise(res=>{
    const cb="__gmapsReady"+Date.now();let done=false;
    const finish=ok=>{if(done)return;done=true;try{delete window[cb]}catch(e){}if(!ok)_gmapsPromise=null;res(ok)};
    window[cb]=()=>finish(!!(window.google&&window.google.maps));
    const sc=document.createElement("script");sc.src="https://maps.googleapis.com/maps/api/js?key="+GOOGLE_KEY+"&v=weekly&callback="+cb;sc.async=true;sc.defer=true;sc.onerror=()=>finish(false);
    setTimeout(()=>finish(!!(window.google&&window.google.maps)),15000);
    document.head.appendChild(sc);
  });
  return _gmapsPromise;
}
function gRoute(x){
  if(!GOOGLE_KEY||_googleDisabled||gLeft()<=0)return Promise.resolve(null);
  return loadGoogleMaps().then(ok=>{
    if(!ok||!window.google||!window.google.maps)return null;
    gCount();
    return new Promise(res=>{
      let done=false;const finish=v=>{if(!done){done=true;res(v)}};
      setTimeout(()=>finish(null),10000);
      try{
        const svc=new google.maps.DirectionsService();
        const req={origin:{lat:userLat(),lng:userLon()},destination:{lat:x.lat,lng:x.lon},travelMode:google.maps.TravelMode.DRIVING,drivingOptions:{departureTime:new Date(),trafficModel:google.maps.TrafficModel.BEST_GUESS}};
        if(!settings.ezpass)req.avoidTolls=true;
        svc.route(req,(r,st)=>{
          if(st==="OK"&&r&&r.routes&&r.routes.length){
            const leg=r.routes[0].legs[0];
            const secs=(leg.duration_in_traffic&&leg.duration_in_traffic.value)||leg.duration.value;
            const base=(leg.duration&&leg.duration.value)||secs;
            finish({dist:leg.distance.value/1609.34,mins:Math.max(2,Math.round(secs/60)),delayMin:Math.max(0,Math.round((secs-base)/60)),pts:(r.routes[0].overview_path||[]).map(pt=>[pt.lat(),pt.lng()]),src:"google"});
          }else{
            if(st==="OVER_QUERY_LIMIT"||st==="REQUEST_DENIED")_googleDisabled=true;
            finish(null);
          }
        });
      }catch(e){finish(null)}
    });
  });
}
function ttRoute(x,useGoogle){
  if(useGoogle)return gRoute(x).then(g=>g||ttRouteTT(x));
  return ttRouteTT(x);
}
function ttRouteTT(x){
  const url="https://api.tomtom.com/routing/1/calculateRoute/"+userLat()+","+userLon()+":"+x.lat+","+x.lon+"/json?key="+TT_KEY+"&traffic=true&routeRepresentation=polyline&travelMode=car"+(settings.ezpass?"":"&avoid=tollRoads");
  return fetchT(url,12000).then(r=>r.json()).then(j=>{
    const rt=j&&j.routes&&j.routes[0];
    if(!rt||!rt.summary)throw new Error("no route");
    let pts=[];
    try{(rt.legs||[]).forEach(leg=>{(leg.points||[]).forEach(p=>pts.push([p.latitude,p.longitude]))})}catch(e){pts=[]}
    return {dist:rt.summary.lengthInMeters/1609.34,mins:Math.round(rt.summary.travelTimeInSeconds/60),pts:pts};
  });
}
const ROUTE_PALETTE=["#0A84FF","#FF3B30","#30D158","#FF9F0A","#BF5AF2","#FF375F","#00C7BE","#CA8A04","#32ADE6","#7D7AFF","#FF6482","#AC8E68"];
function routeColor(i){return ROUTE_PALETTE[i%ROUTE_PALETTE.length]}
let routeGroup=null;
function syncRouteLines(){
  if(!routeGroup)return;
  routeGroup.clearLayers();
  Object.keys(mapOn).forEach(l=>{
    if(!mapOn[l])return;
    sortedItems(l).slice(0,visCount[l]).forEach((x,i)=>{
      const ri=routeInfo[routeKey(l,x)];
      if(ri&&ri.pts&&ri.pts.length>1)L.polyline(ri.pts,{color:routeColor(i),weight:4,opacity:.85}).addTo(routeGroup);
    });
  });
}
function kickRoutes(layer){
  if(kickBusy[layer])return;
  kickBusy[layer]=true;
  const kid=(kickSeq[layer]=(kickSeq[layer]||0)+1),ep=routeEpoch,deadline=Date.now()+150000;
  if(layer==="wc")lastWcRoutePos={lat:userLat(),lon:userLon()};
  async function worker(){
    while(Date.now()<deadline){
      const vis=sortedItems(layer).slice(0,visCount[layer]);
      const x=vis.find(y=>{const k=routeKey(layer,y);const ri=routeInfo[k];if(!ri)return true;return ri.dist==null&&!ri.wait&&(ri.try||0)<3&&Date.now()-(ri.ts||0)>((ri.try||0)>=1?20000:8000)});
      if(!x){
        const pending=vis.some(y=>{const ri=routeInfo[routeKey(layer,y)];return ri&&ri.dist==null&&!ri.wait&&(ri.try||0)<3});
        if(!pending)return;
        await new Promise(r=>setTimeout(r,3000));
        if(ep!==routeEpoch)return;
        continue;
      }
      const k=routeKey(layer,x);
      if(!routeInfo[k])routeInfo[k]={wait:1};
      try{
        const v=await ttRoute(x,layer==="air");
        if(ep!==routeEpoch)return;
        routeInfo[k]=v;
        let anyFail=false;
        Object.keys(mapOn).forEach(l=>{if(mapOn[l])sortedItems(l).slice(0,visCount[l]).forEach(y=>{const ri=routeInfo[routeKey(l,y)];if(ri&&ri.dist==null)anyFail=true})});
        if(!anyFail&&routeDegraded){routeDegraded=false;updateTrafficUI()}
      }catch(e){
        if(ep!==routeEpoch)return;
        const prev=routeInfo[k]||{};
        routeInfo[k]={dist:null,mins:null,ts:Date.now(),try:(prev.try||0)+1};
        if(!routeDegraded){routeDegraded=true;updateTrafficUI()}
      }
      if(panelLayer===layer){renderMapPanel();drawMapLayer(layer)}
      syncRouteLines();
    }
  }
  Promise.all([worker(),worker(),worker()]).then(()=>{if(kickSeq[layer]===kid)kickBusy[layer]=false});
}
function kickRoutesWc(){kickRoutes("wc")}
function refreshAllRoutes(){
  routeEpoch++;
  Object.keys(kickBusy).forEach(k=>kickBusy[k]=false);
  Object.keys(routeInfo).forEach(k=>delete routeInfo[k]);
  lastWcRoutePos=null;
  syncRouteLines();
  if(panelLayer)renderMapPanel();
  Object.keys(mapOn).forEach(l=>{if(mapOn[l])kickRoutes(l)});
}
function updateTrafficUI(){
  const b=$("btnTraffic");if(!b)return;
  b.classList.toggle("on",!!settings.traffic);
  const tst=b.querySelector(".mc-state");if(tst)tst.textContent=settings.traffic?"ON":"OFF";
  b.classList.toggle("warn",!!(settings.traffic&&(routeDegraded||tileDegraded)));
}
function updateEzpassUI(){
  const b=$("btnEzpass");if(!b)return;
  b.classList.toggle("on",!!settings.ezpass);
  const st=b.querySelector(".mc-state");
  if(st)st.textContent=settings.ezpass?"ON":"OFF";
}
function recenterMap(){
  if(!map)return;
  savedMapView=null;
  map.setView([userLat(),userLon()],Math.max(map.getZoom(),14));
}
function toggleTraffic(){
  settings.traffic=!settings.traffic;saveSettings();
  if(map&&trafficLayer){if(settings.traffic)trafficLayer.addTo(map);else map.removeLayer(trafficLayer)}
  updateTrafficUI();refreshAllRoutes();
}
function toggleEzpass(){
  settings.ezpass=!settings.ezpass;saveSettings();
  updateEzpassUI();
  toast(settings.ezpass?"EZPass ON \u2014 pullik yo\u02bbllar bilan":"EZPass OFF \u2014 faqat tollsiz yo\u02bbllar");
  refreshAllRoutes();
}
function renderMapPanel(){
  const p=$("mapPanel");if(!p)return;
  if(!panelLayer){p.classList.remove("open");p.innerHTML="";return}
  const layer=panelLayer,items=sortedItems(layer),vis=items.slice(0,visCount[layer]);
  p.classList.add("open");
  if(!items.length){
    const loading=(layer==="wc"&&WC_ITEMS===null)||(layer==="ev"&&TESLA_ITEMS===null);
    p.innerHTML='<div class="location-option" style="cursor:default"><span class="loc-main"><span class="loc-name">'+(loading?"Yuklanmoqda...":"Yaqin atrofda topilmadi")+'</span></span></div>';
    return;
  }
  let html=vis.map((x,i)=>{
    const ri=routeInfo[routeKey(layer,x)];
    const dv=ri&&ri.dist!=null?ri.dist.toFixed(1):"--";
    const mv=ri&&ri.mins!=null?String(ri.mins):"--";
    return '<button class="location-option" data-lat="'+x.lat+'" data-lon="'+x.lon+'"><span class="loc-dot" style="background:'+routeColor(i)+'"></span><span class="loc-main"><span class="loc-name">'+esc(x.n)+'</span>'+(x.sub?'<span class="loc-addr">'+esc(x.sub)+'</span>':"")+'</span><span class="loc-badges"><span class="loc-badge"><span class="v">'+dv+'</span><span class="u">mi</span></span><span class="loc-badge min"><span class="v">'+mv+'</span><span class="u">min</span></span></span></button>';
  }).join("");
  if(items.length>visCount[layer])html+='<button class="location-option more" style="justify-content:center"><span class="loc-name">\u2B07 '+(layer==="loc"?"Next":"More")+'</span></button>';
  p.innerHTML=html;
  if(layer==="wc")kickRoutesWc();else kickRoutes(layer);
  p.querySelectorAll(".location-option[data-lat]").forEach(b=>b.addEventListener("click",()=>(layer==="wc"?navGo:gmaps)(parseFloat(b.getAttribute("data-lat")),parseFloat(b.getAttribute("data-lon")))));
  const mb=p.querySelector(".more");
  if(mb)mb.addEventListener("click",()=>{visCount[layer]+=5;drawMapLayer(layer);renderMapPanel();if(layer==="wc")kickRoutesWc();else kickRoutes(layer);if(FIT_LAYERS.indexOf(layer)>=0)fitLayerBounds()});
}
function zoomHalfMile(){
  if(!map)return;
  const la=userLat(),lo=userLon(),dLa=805/111320,dLo=805/(111320*Math.cos(la*Math.PI/180));
  try{map.fitBounds([[la-dLa,lo-dLo],[la+dLa,lo+dLo]],{paddingTopLeft:[24,24],paddingBottomRight:[276,24]})}catch(e){}
}
const FIT_LAYERS=["wc","ev","cruise","air","loc"];
function fitLayerBounds(){
  if(!map)return;
  const pts=[[userLat(),userLon()]];
  FIT_LAYERS.forEach(l=>{if(mapOn[l])sortedItems(l).slice(0,visCount[l]).forEach(x=>pts.push([x.lat,x.lon]))});
  if(pts.length<2)return;
  const sz=map.getSize();
  try{map.fitBounds(L.latLngBounds(pts),{paddingTopLeft:[24,24],paddingBottomRight:[sz.x>=700?290:24,24],maxZoom:16});if(map.getZoom()<10)map.setZoom(10)}catch(e){}
}
function mapToggle(layer,btn){
  if(!map)initMaps();
  const on=!mapOn[layer];const wasFitted=FIT_LAYERS.some(l=>mapOn[l]);mapOn[layer]=on;
  if(btn){btn.classList.toggle("on",on);const bst=btn.querySelector(".mc-state");if(bst)bst.textContent=on?"ON":"OFF"}
  if(layer==="wc"){if(on){layerGroups.wc.addTo(map);drawMapLayer("wc");refreshWC(false)}else map.removeLayer(layerGroups.wc)}
  if(layer==="ev"){if(on){layerGroups.ev.addTo(map);layerGroups.tesla.addTo(map);drawMapLayer("ev");refreshEV(false);refreshTesla()}else{map.removeLayer(layerGroups.ev);map.removeLayer(layerGroups.tesla)}}
  if(layer==="loc"){if(on){drawMapLayer("loc");layerGroups.loc.addTo(map)}else map.removeLayer(layerGroups.loc)}
  if(layer==="cruise"){if(on){drawMapLayer("cruise");layerGroups.cruise.addTo(map)}else map.removeLayer(layerGroups.cruise)}
  if(layer==="air"){if(on){drawMapLayer("air");layerGroups.air.addTo(map)}else map.removeLayer(layerGroups.air)}
  if(on){panelLayer=layer;renderMapPanel();if(layer==="wc")kickRoutesWc();else kickRoutes(layer)}
  else if(panelLayer===layer){const other=Object.keys(mapOn).find(k=>mapOn[k]);panelLayer=other||null;renderMapPanel();if(other){if(other==="wc")kickRoutesWc();else kickRoutes(other)}}
  if(FIT_LAYERS.indexOf(layer)>=0){
    if(on){if(!wasFitted)savedMapView={c:map.getCenter(),z:map.getZoom()};fitLayerBounds()}
    else if(FIT_LAYERS.some(l=>mapOn[l]))fitLayerBounds();
    else if(savedMapView){map.setView(savedMapView.c,savedMapView.z);savedMapView=null}
  }
  syncRouteLines();
}
function distSort(a){return a.map(x=>Object.assign({},x,{d:hav(userLat(),userLon(),x.lat,x.lon)})).sort((x,y)=>x.d-y.d)}
function listHTML(items,icon){
  return items.slice(0,10).map(x=>'<li><div class="r"><div><b>'+icon+" "+esc(x.n)+'</b><div class="small">'+distTxt(x.d)+' uzoqlikda</div></div><button onclick="gmaps('+x.lat+","+x.lon+')">GO</button></div></li>').join("")||'<li class="small">Yaqin atrofda topilmadi</li>';
}
function overpass(q){
  const opt={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)};
  return fetchT("https://overpass-api.de/api/interpreter",15000,opt).then(r=>r.json())
   .catch(()=>fetchT("https://overpass.kumi.systems/api/interpreter",15000,opt).then(r=>r.json()));
}
function drawMapWc(){drawMapLayer("wc");if(mapOn.wc)fitLayerBounds();if(panelLayer==="wc"){renderMapPanel();kickRoutesWc()}}
function drawMapEv(items){if(typeof layerGroups==="undefined"||!layerGroups.ev)return;layerGroups.ev.clearLayers();items.slice(0,40).forEach(x=>L.circleMarker([x.lat,x.lon],{radius:6,color:"#fff",weight:1.5,fillColor:"#30d158",fillOpacity:.9}).addTo(layerGroups.ev).bindPopup("<b>\u26A1 "+esc(x.n)+"</b><br>"+distTxt(x.d)+" uzoqlikda"))}
function refreshTesla(){
  const url="https://photon.komoot.io/api/?q="+encodeURIComponent("Tesla Supercharger")+"&lat="+userLat()+"&lon="+userLon()+"&limit=15";
  fetchT(url,25000).then(r=>r.json()).then(j=>{
    const seen={},items=[];
    (j.features||[]).forEach(f=>{const c=f.geometry&&f.geometry.coordinates,p=f.properties||{};if(!c)return;const lat=c[1],lon=c[0],d=hav(userLat(),userLon(),lat,lon);if(d>31)return;const key=(p.name||"")+"@"+lat.toFixed(3)+","+lon.toFixed(3);if(seen[key])return;seen[key]=1;items.push({n:p.name||"Tesla Supercharger",addr:[p.street,p.city].filter(Boolean).join(", "),lat:lat,lon:lon})});
    TESLA_ITEMS=distSort(items);
    drawMapLayer("ev");
    if(mapOn.ev)fitLayerBounds();
    if(panelLayer==="ev"){renderMapPanel();kickRoutes("ev")}
  }).catch(()=>{});
}
function refreshWC(notify=true,force=false){
  if(force){WC_LOAD=null;WC_ALL=null;WC_SRC=""}
  const apply=items=>{
    WC_ITEMS=distSort(items);
    $("wcList").innerHTML=listHTML(WC_ITEMS.slice(0,20),"\uD83D\uDEBB");
    drawStLayers();drawMapWc();
    if(notify)toast(WC_SRC==="fb"?"Jonli baza ishlamadi \u2014 zaxira ro\u02bcyxat":"Hojatxonalar yangilandi \u2014 NYC bazasi ("+items.length+" ta)");
  };
  if(WC_ALL){apply(WC_ALL);return}
  loadWC().then(apply);
}
function refreshEV(notify=true){
  const q='[out:json][timeout:10];node["amenity"="charging_station"](around:26000,'+userLat()+","+userLon()+");out 60;";
  overpass(q).then(j=>{
    const items=j.elements.filter(e=>e.lat).map(e=>{const t=e.tags||{};const tesla=/tesla/i.test((t.brand||"")+" "+(t.operator||"")+" "+(t.name||""));return {n:(t.name||t.operator||t.brand||"Zaryadlash stansiyasi")+(tesla?" ⚡Tesla":""),lat:e.lat,lon:e.lon}});
    if(items.length){apiStat.overpass="OK";$("evList").innerHTML=listHTML(distSort(items),"⚡");EV_ITEMS=distSort(items);drawStLayers();drawMapEv(EV_ITEMS);if(notify)toast("Zaryadlash stansiyalari yangilandi (OSM)");return}
    throw new Error("empty");
  }).catch(()=>{ $("evList").innerHTML=listHTML(distSort(EV_FB),"⚡")+'<div class="small">Zaxira roʻyxat — aniq manzil/quvvatni Tesla ilovasida tekshiring.</div>'; EV_ITEMS=distSort(EV_FB);drawStLayers();drawMapEv(EV_ITEMS); if(notify)toast("Jonli OSM ishlamadi — zaxira roʻyxat"); });
}
function refreshCam(notify=true){
  const q='[out:json][timeout:10];node["highway"="speed_camera"](around:15000,'+userLat()+","+userLon()+");out 80;";
  overpass(q).then(j=>{
    const items=j.elements.filter(e=>e.lat).map(e=>({n:(e.tags&&(e.tags.name||e.tags.ref))||"Tezlik kamerasi (OSM)",lat:e.lat,lon:e.lon}));
    if(items.length){apiStat.overpass="OK";$("camList").innerHTML=listHTML(distSort(items),"📷");
      if(typeof layerGroups!=="undefined"&&layerGroups.cam){layerGroups.cam.clearLayers();items.forEach(c=>L.marker([c.lat,c.lon]).addTo(layerGroups.cam).bindPopup("📷 Kamera (OSM jonli) — "+esc(c.n)))}
      if(notify)toast("Kameralar yangilandi (OSM)");return}
    throw new Error("empty");
  }).catch(()=>{ $("camList").innerHTML=listHTML(distSort(CAMS_FB),"📷"); if(notify)toast("Jonli OSM ishlamadi — zaxira (taxminiy) roʻyxat"); });
}
/* ===== Umumiy xarita: Stops & Charging (v10.1) ===== */
let stMap=null,stWcLayer=null,stParkLayer=null,stEvLayer=null,stShowWc=true,stShowPark=true,stShowEv=true,stTab="wc",stMe=null;
let WC_ITEMS=null,EV_ITEMS=null;
function stWcPts(){return (WC_ITEMS||distSort(WC_FB)).slice(0,20)}
function stEvPts(){return (EV_ITEMS||distSort(EV_FB)).slice(0,20)}
function stParkPts(){return distSort(GARAGES)}
function stPop(x,icon){return "<b>"+icon+" "+esc(x.n)+"</b><br>"+distTxt(hav(userLat(),userLon(),x.lat,x.lon))+" uzoqlikda"+(x.note?"<br>"+esc(x.note):"")}
function drawStLayers(){
  if(!stMap)return;
  if(stWcLayer){stWcLayer.clearLayers();if(stShowWc)stWcPts().forEach(x=>{L.circleMarker([x.lat,x.lon],{radius:6,color:"#fff",weight:1.5,fillColor:"#2f7cf6",fillOpacity:.9}).addTo(stWcLayer).bindPopup(stPop(x,"\uD83D\uDEBB"))})}
  if(stParkLayer){stParkLayer.clearLayers();if(stShowPark)stParkPts().forEach(x=>{L.circleMarker([x.lat,x.lon],{radius:6,color:"#fff",weight:1.5,fillColor:"#ff9f0a",fillOpacity:.9}).addTo(stParkLayer).bindPopup(stPop(x,"\uD83C\uDD7F\uFE0F"))})}
  if(stEvLayer){stEvLayer.clearLayers();if(stShowEv)stEvPts().forEach(x=>{L.circleMarker([x.lat,x.lon],{radius:6,color:"#fff",weight:1.5,fillColor:"#30d158",fillOpacity:.9}).addTo(stEvLayer).bindPopup(stPop(x,"\u26A1"))})}
  updateStNote();
}
function fitStMap(){
  if(!stMap)return;const pts=[];
  if(stShowWc)stWcPts().forEach(x=>pts.push([x.lat,x.lon]));
  if(stShowPark)stParkPts().forEach(x=>pts.push([x.lat,x.lon]));
  if(stShowEv)stEvPts().forEach(x=>pts.push([x.lat,x.lon]));
  if(pts.length){try{stMap.fitBounds(L.latLngBounds(pts),{padding:[24,24],maxZoom:14})}catch(e){}}
}
function refreshStMap(){
  const el=$("stMap");if(!el||!el.clientWidth)return;
  if(!stMap){stMap=L.map("stMap",{scrollWheelZoom:false}).setView([userLat(),userLon()],12);tiles().addTo(stMap);stWcLayer=L.layerGroup().addTo(stMap);stParkLayer=L.layerGroup().addTo(stMap);stEvLayer=L.layerGroup().addTo(stMap);stMe=L.marker([userLat(),userLon()]).addTo(stMap).bindPopup("Siz");drawStLayers();fitStMap();return}
  try{stMap.invalidateSize()}catch(e){}
  drawStLayers();
  try{const ctr=stMap.getCenter();if(ctr&&hav(userLat(),userLon(),ctr.lat,ctr.lng)>150)fitStMap()}catch(e){}
}
function updateStNote(){
  const n=$("stMapNote");if(!n)return;
  n.textContent="Qatlamlar: \uD83D\uDEBB Restroom "+(stShowWc?("yoniq \u00b7 "+stWcPts().length+" ta"):"o\u02bbchiq")+" \u00b7 \uD83C\uDD7F\uFE0F Parking "+(stShowPark?("yoniq \u00b7 "+stParkPts().length+" ta"):"o\u02bbchiq")+" \u00b7 \u26A1 EV "+(stShowEv?("yoniq \u00b7 "+stEvPts().length+" ta"):"o\u02bbchiq")+". Belgini bosing \u2014 nomi va masofasi chiqadi; ro\u02bbxatdagi GO \u2014 Google Maps.";
}
function setStToggle(w){
  if(w==="wc")stShowWc=!stShowWc;else if(w==="park")stShowPark=!stShowPark;else stShowEv=!stShowEv;
  const b1=$("stTgWc");if(b1)b1.classList.toggle("on",stShowWc);
  const b2=$("stTgPark");if(b2)b2.classList.toggle("on",stShowPark);
  const b3=$("stTgEv");if(b3)b3.classList.toggle("on",stShowEv);
  drawStLayers();fitStMap();
}
function setStTab(t){
  stTab=t;
  if(t==="park")renderParking();
  const wp=$("wcPanel"),mp=$("modPark"),me=$("modEv");
  if(wp)wp.style.display=t==="wc"?"":"none";
  if(mp)mp.style.display=t==="park"?"":"none";
  if(me)me.style.display=t==="ev"?"":"none";
  const b1=$("stTabWc");if(b1)b1.classList.toggle("on",t==="wc");
  const b2=$("stTabPark");if(b2)b2.classList.toggle("on",t==="park");
  const b3=$("stTabEv");if(b3)b3.classList.toggle("on",t==="ev");
  setTimeout(refreshStMap,60);
}
function renderCams(){ refreshCam(false); }
function renderEventsClosures(){
  renderEvents();
  renderClosures();
}


/* ================= Jonli yopilishlar — NYC DOT Open Data (Socrata) ================= */
let clTs=0,clLive=false,clBusy=false,clTotal=0;
let clFilter="act",clPage=0,clMap=null,clMarkers=null;
const BORO={M:"Manhattan",BK:"Brooklyn",Q:"Queens",BX:"Bronx",S:"Staten Island"};
function titleCase(s){return String(s||"").toLowerCase().replace(/\b\w/g,ch=>ch.toUpperCase())}
function clMapRow(r,block){
  const g=r.the_geom;if(!g||!g.coordinates)return null;
  let lat=null,lon=null;
  let line=null;
  if(g.type==="Point"){lon=g.coordinates[0];lat=g.coordinates[1]}
  else{const seg=g.coordinates[0];if(seg&&seg[0]){lon=seg[0][0];lat=seg[0][1];if(seg.length>1)line=seg.slice(0,60).map(p=>[p[1],p[0]])}}
  if(lat==null||lon==null)return null;
  const sd=String(r.work_start_date||"").slice(0,10),ed=String(r.work_end_date||"").slice(0,10);
  if(!sd||!ed)return null;
  const on=titleCase(r.onstreetname),fr=titleCase(r.fromstreetname),to=titleCase(r.tostreetname);
  return {n:on+(fr?(" \u2229 "+fr):"")+(block&&to?(" \u2192 "+to):""),place:((BORO[String(r.borough_code||"").toUpperCase()]||"NYC"))+(r.purpose?(" \u00b7 "+titleCase(r.purpose)):""),lat:lat,lon:lon,radiusKm:0.8,sev:"O\u02bbrtacha",start:sd+"T00:00",end:ed+"T23:59",live:true,line:line};
}
function loadClosures(force){
  if(clBusy)return;if(!force&&clTs&&Date.now()-clTs<300000)return;clBusy=true;
  const la=userLat(),lo=userLon();
  const end14=new Date(Date.now()+14*864e5).toISOString().slice(0,10),today=new Date().toISOString().slice(0,10);
  const sel="the_geom,onstreetname,fromstreetname,tostreetname,borough_code,work_start_date,work_end_date,purpose";
  const wh=encodeURIComponent("work_start_date<='"+end14+"T00:00:00' AND work_end_date>='"+today+"T00:00:00' AND within_circle(the_geom,"+la+","+lo+",20000)");
  const q="?$select="+sel+"&$where="+wh+"&$limit=2000";
  const one=id=>fetchT("https://data.cityofnewyork.us/resource/"+id+".json"+q,30000,{cache:"no-store"}).then(r=>r.json()).catch(()=>null);
  Promise.all([one("478a-yykk"),one("i6b5-j7bu")]).then(res=>{
    clBusy=false;const ra=res[0],rb=res[1];
    if(!ra&&!rb){apiStat.closures="XATO \u2014 NYC DOT javob bermadi";renderApiStat();if(!clLive&&!loadClosures._rt){loadClosures._rt=1;setTimeout(()=>{loadClosures._rt=0;loadClosures(true)},20000)}return}
    let rows=[];
    if(ra)rows=rows.concat(ra.map(r=>clMapRow(r,false)));
    if(rb)rows=rows.concat(rb.map(r=>clMapRow(r,true)));
    rows=rows.filter(Boolean);
    const seen={},ded=[];
    rows.forEach(c=>{const k=c.n+"|"+c.start;if(!seen[k]){seen[k]=1;ded.push(c)}});
    ded.sort((x,y)=>hav(la,lo,x.lat,x.lon)-hav(la,lo,y.lat,y.lon));
    clTotal=ded.length;CLOSURES=ded.slice(0,300);clLive=true;clTs=Date.now();
    const bd=$("closeBadge");if(bd){bd.textContent="LIVE";bd.className="badge b-live"}
    apiStat.closures="OK \u00b7 jonli ("+clTotal+" ta, 20 km) \u00b7 "+new Date(clTs).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    renderApiStat();renderClosures();renderHome();
    try{if(typeof layerGroups!=="undefined"&&layerGroups.close){layerGroups.close.clearLayers();CLOSURES.slice(0,120).forEach(c=>{if(c.lat)L.marker([c.lat,c.lon]).addTo(layerGroups.close).bindPopup("🚧 "+esc(c.n)+(clActive(c)?" (FAOL)":""))})}}catch(e){}
  });
}
function clFiltered(){if(clFilter==="act")return CLOSURES.filter(c=>clActive(c));if(clFilter==="up")return CLOSURES.filter(c=>!clActive(c));return CLOSURES.slice()}
function renderClosures(){
  const el=$("closeList");if(!el)return;
  const fmtD=d=>d.toLocaleString("en-US",{month:"short",day:"numeric"});
  const upd=$("clUpd");if(upd)upd.textContent=clLive?("Oxirgi yangilanish: "+new Date(clTs).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})):"Jonli ma\u02bclumot kutilmoqda\u2026";
  const head=clLive?'<li class="small">🔴 <b>LIVE</b> \u2014 NYC DOT (Open Data), har 5 daqiqada yangilanadi \u00b7 20 km radiusda <b>'+clTotal+' ta</b> yozuv</li>':'<li class="small">\u26a0\ufe0f Jonli ma\u02bclumot yuklanmadi \u2014 zaxira yozuvlar ko\u02bcrilmoqda.</li>';
  const list=clFiltered();
  const pages=Math.max(1,Math.ceil(list.length/5));
  if(clPage>pages-1)clPage=pages-1;if(clPage<0)clPage=0;
  const item=c=>{const act2=clActive(c);return '<li><div class="r"><div><b>'+esc(c.n)+'</b><div class="small">'+esc(c.place||"")+" \u00b7 "+fmtD(new Date(c.start))+" \u2192 "+fmtD(new Date(c.end))+'</div></div><span class="'+(act2?"hi":"med")+'">'+(act2?"FAOL":"YAQINDA")+'</span></div></li>'};
  const slice=list.slice(clPage*5,clPage*5+5);
  el.innerHTML=head+(slice.map(item).join("")||'<li class="small">Bu filtrda yopilishlar yo\u02bbq.</li>')+'<li class="small">Manba: NYC DOT qurilish yopilishlari (kesishma va bloklar). Ish soatlari kun ichida farq qilishi mumkin. Rasmiy tekshiruv: <a href="https://www.nyc.gov/dot" style="color:var(--blu)">nyc.gov/dot</a>, 511NY.</li>';
  const pi=$("clPageInfo");if(pi)pi.textContent=list.length?((clPage*5+1)+"\u2013"+Math.min(list.length,clPage*5+5)+" / "+list.length+" \u00b7 Sahifa "+(clPage+1)+"/"+pages):"0 ta";
  const pv=$("clPrev");if(pv)pv.disabled=clPage<=0;
  const nx=$("clNext");if(nx)nx.disabled=clPage>=pages-1;
  refreshErMap();
}
function clPopup(c){const fmtD=d=>d.toLocaleString("en-US",{month:"short",day:"numeric"});return "<b>🚧 "+esc(c.n)+"</b>"+(c.place?"<br>📍 "+esc(c.place):"")+"<br>📅 "+fmtD(new Date(c.start))+" \u2192 "+fmtD(new Date(c.end))+"<br>"+(clActive(c)?"🔴 FAOL":"🕐 YAQINDA")+(c.sev?" \u00b7 "+esc(c.sev):"")}
function clPts(){return clFiltered().filter(c=>c.lat!=null&&hav(userLat(),userLon(),c.lat,c.lon)<60).slice(0,120)}
/* ===== Umumiy xarita: Events & Road (v10.0) ===== */
let erMap=null,erEvLayer=null,erRdLayer=null,erShowEv=true,erShowRd=true,erTab="ev",erMe=null;
function erEvPts(){return EVENTS.filter(e=>e.lat!=null&&evState(e)!=="past").slice(0,80)}
function updateErNote(){const el=$("erNote");if(!el)return;const ev=erShowEv?erEvPts().length:0;const rd=erShowRd?clPts().length:0;el.textContent="Xaritada: "+ev+" ta tadbir · "+rd+" ta yoʻl yopilishi"}
function drawErLayers(){
  if(!erMap)return;
  if(erEvLayer){erEvLayer.clearLayers();if(erShowEv)erEvPts().forEach(e=>{L.marker([e.lat,e.lon]).addTo(erEvLayer).bindPopup(evPopup(e))})}
  if(erRdLayer){erRdLayer.clearLayers();if(erShowRd)clPts().forEach(c=>{const pp=clPopup(c);if(c.line&&c.line.length>1){L.polyline(c.line,{color:"#ff3b30",weight:7,opacity:.85}).addTo(erRdLayer).bindPopup(pp)}else{L.circleMarker([c.lat,c.lon],{radius:8,color:"#ff3b30",weight:2,fillColor:"#ff3b30",fillOpacity:.7}).addTo(erRdLayer).bindPopup(pp)}})}
  updateErNote();
}
function fitErMap(){
  if(!erMap)return;const pts=[];
  if(erShowEv)erEvPts().forEach(e=>pts.push([e.lat,e.lon]));
  if(erShowRd)clPts().forEach(c=>pts.push([c.lat,c.lon]));
  if(pts.length){try{erMap.fitBounds(L.latLngBounds(pts),{padding:[24,24],maxZoom:13})}catch(e){}}
}
function refreshErMap(){
  const el=$("erMap");if(!el||!el.clientWidth)return;
  if(!erMap){erMap=L.map("erMap",{scrollWheelZoom:false}).setView([userLat(),userLon()],12);tiles().addTo(erMap);erEvLayer=L.layerGroup().addTo(erMap);erRdLayer=L.layerGroup().addTo(erMap);erMe=L.marker([userLat(),userLon()]).addTo(erMap).bindPopup("Siz");drawErLayers();fitErMap();return}
  try{erMap.invalidateSize()}catch(e){}
  drawErLayers();
  try{const ctr=erMap.getCenter();if(ctr&&hav(userLat(),userLon(),ctr.lat,ctr.lng)>150)fitErMap()}catch(e){}
}
function setErToggle(w){
  if(w==="ev")erShowEv=!erShowEv;else erShowRd=!erShowRd;
  const te=$("erTgEv");if(te)te.classList.toggle("on",erShowEv);
  const tr=$("erTgRd");if(tr)tr.classList.toggle("on",erShowRd);
  drawErLayers();fitErMap();
}
function setErTab(t){
  erTab=t;
  const p=$("evPanel"),mc=$("modClose");
  if(p)p.style.display=t==="ev"?"":"none";
  if(mc)mc.style.display=t==="rd"?"":"none";
  const te=$("erTabEv");if(te)te.classList.toggle("on",t==="ev");
  const tr=$("erTabRd");if(tr)tr.classList.toggle("on",t==="rd");
  setTimeout(refreshErMap,60);
}
function setClFilter(f){
  clFilter=f;clPage=0;
  const suf={act:"Act",up:"Up",all:"All"};
  ["Act","Up","All"].forEach(k=>{const b=$("clF"+k);if(b)b.classList.toggle("on",k===suf[f])});
  renderClosures();fitErMap();
}


/* ================= Jonli tadbirlar — NYC Permitted Events (Open Data) ================= */
let evTs=0,evLive=false,evBusy=false,evTotal=0,evMapped=0,evSort="soon",evPage=0;
const GAZ=[["central park",40.7829,-73.9654],["madison square park",40.7411,-73.9897],["bryant park",40.7536,-73.9832],["union square",40.7359,-73.9911],["washington square",40.7308,-73.9973],["times square",40.7580,-73.9855],["herald square",40.7494,-73.9878],["columbus circle",40.7681,-73.9819],["lincoln center",40.7725,-73.9835],["radio city",40.7599,-73.9809],["rockefeller",40.7587,-73.9787],["madison square garden",40.7505,-73.9934],["barclays",40.6826,-73.9754],["yankee stadium",40.8296,-73.9262],["citi field",40.7571,-73.8458],["prospect park",40.6602,-73.9690],["grand army plaza",40.6734,-73.9701],["mccarren",40.7213,-73.9522],["astoria park",40.7788,-73.9215],["flushing meadows",40.7497,-73.8448],["van cortlandt",40.8976,-73.8857],["pelham bay",40.8648,-73.8097],["riverside park",40.8010,-73.9720],["tompkins square",40.7264,-73.9817],["battery park",40.7033,-74.0170],["city hall park",40.7126,-74.0066],["foley square",40.7144,-74.0024],["coney island",40.5749,-73.9857],["fort greene",40.6913,-73.9743],["inwood hill",40.8725,-73.9254],["crotona park",40.8387,-73.8950],["fifth avenue",40.7742,-73.9656],["5th avenue",40.7742,-73.9656]];
const WD=["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
function gazMatch(text){const t=" "+String(text||"").toLowerCase().replace(/\s+/g," ")+" ";for(let i=0;i<GAZ.length;i++){if(t.indexOf(" "+GAZ[i][0])>=0||t.indexOf(GAZ[i][0]+" ")>=0)return [GAZ[i][1],GAZ[i][2]]}return null}
function evSurge(type,closure){const t=String(type||"");if(t==="Parade")return 1.8;if(t.indexOf("Athletic")>=0)return 1.7;if(t.indexOf("Festival")>=0||t.indexOf("Fair")>=0)return 1.5;if(t==="Concert"||t.indexOf("Sport")>=0)return 1.5;if(t==="Farmers Market")return 1.2;if(String(closure||"")==="Full Street Closure")return 1.3;return null}
function geoCache(){try{return JSON.parse(localStorage.getItem("drv_geo")||"{}")}catch(e){return {}}}
function geoSave(c){try{localStorage.setItem("drv_geo",JSON.stringify(c))}catch(e){}}
function evMapRow(r){
  const nm=String(r.event_name||"").replace(/\s+/g," ").trim();if(!nm)return null;
  const st=String(r.start_date_time||""),en=String(r.end_date_time||"");
  if(st.length<16||en.length<16)return null;
  const locRaw=String(r.event_location||"").replace(/\s+/g," ").trim();
  const loc=titleCase(locRaw);
  const place=(loc||"")+(r.event_borough?((loc?", ":"")+r.event_borough):"");
  const g=gazMatch(locRaw+" "+nm);
  return {n:titleCase(nm),place:place,lat:g?g[0]:null,lon:g?g[1]:null,start:st.slice(0,16),end:en.slice(0,16),surge:evSurge(r.event_type,r.street_closure_type),type:r.event_type||"",locKey:locRaw.toLowerCase(),live:true};
}
function loadEvents(force){
  if(evBusy)return;if(!force&&evTs&&Date.now()-evTs<600000)return;evBusy=true;
  const now=new Date();const from=new Date(now.getTime()-3*3600e3),to=new Date(now.getTime()+7*864e5);
  const iso=d=>d.toISOString().slice(0,19);
  const types="('Parade','Athletic Race / Tour','Street Festival','Festival','Concert','Sporting Event','Farmers Market','Special Event','March','Rally','Block Party')";
  const wh=encodeURIComponent("start_date_time between '"+iso(from)+"' and '"+iso(to)+"' AND (event_type in"+types+" OR street_closure_type='Full Street Closure')");
  const u="https://data.cityofnewyork.us/resource/tvpp-9vvx.json?$select=event_name,start_date_time,end_date_time,event_type,event_borough,event_location,street_closure_type&$where="+wh+"&$order=start_date_time&$limit=800";
  fetchT(u,30000,{cache:"no-store"}).then(r=>r.json()).then(rows=>{
    evBusy=false;
    const seen={},list=[];
    (rows||[]).forEach(r=>{const e=evMapRow(r);if(!e)return;const k=e.n+"|"+e.start;if(seen[k])return;seen[k]=1;list.push(e)});
    if(!list.length){apiStat.events="OK \u2014 tadbir topilmadi";renderApiStat();return}
    const keep=EVENTS.filter(e=>!e.live&&(e.daily||!e.start));
    EVENTS=list.concat(keep);
    evTotal=list.length;evLive=true;evTs=Date.now();
    const bd=$("evBadge");if(bd){bd.textContent="LIVE";bd.className="badge b-live"}
    apiStat.events="OK \u00b7 jonli ("+evTotal+" ta) \u00b7 "+new Date(evTs).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    renderApiStat();renderEvents();renderHome();geocodeMissing();drawEvMarkers();
  }).catch(()=>{evBusy=false;apiStat.events="XATO \u2014 NYC Events javob bermadi";renderApiStat();if(!evLive&&!loadEvents._rt){loadEvents._rt=1;setTimeout(()=>{loadEvents._rt=0;loadEvents(true)},20000)}});
}
function evCountMapped(){evMapped=EVENTS.filter(e=>e.live&&e.lat!=null).length}
function geocodeMissing(){
  const cache=geoCache();let changed=false;
  EVENTS.forEach(e=>{if(e.live&&e.lat==null&&e.locKey&&cache[e.locKey]){e.lat=cache[e.locKey][0];e.lon=cache[e.locKey][1];changed=true}});
  if(changed){renderEvents();drawEvMarkers()}
  const todo=EVENTS.filter(e=>e.live&&e.lat==null&&e.locKey).slice(0,6);let delay=0;
  todo.forEach(e=>{
    setTimeout(()=>{
      const m=e.locKey.match(/between\s+(.+?)\s+and\s+/);
      const q=m?(m[1]+" & "+e.locKey.split(" between ")[0]):e.locKey;
      fetchT("https://geosearch.planninglabs.nyc/v2/search?text="+encodeURIComponent(q+", New York, NY")+"&size=1",9000).then(r=>r.json()).then(j=>{
        const f=j&&j.features&&j.features[0];if(!f||!f.geometry||!f.geometry.coordinates)return;
        e.lat=f.geometry.coordinates[1];e.lon=f.geometry.coordinates[0];cache[e.locKey]=[e.lat,e.lon];geoSave(cache);
        renderEvents();drawEvMarkers();
      }).catch(()=>{});
    },delay);delay+=700;
  });
}
function fmtEvWhen(e){
  const s=new Date(e.start),en=new Date(e.end);
  const f=d=>d.toLocaleString("en-US",{hour:"numeric",minute:"2-digit"});
  const dm=d=>d.toLocaleString("en-US",{month:"short",day:"numeric"});
  return WD[s.getDay()]+", "+dm(s)+" \u00b7 "+f(s)+" \u2192 "+(s.toDateString()===en.toDateString()?f(en):dm(en)+" "+f(en));
}
function renderEvents(){
  const el=$("eventList");if(!el)return;
  const upd=$("evUpd");if(upd)upd.textContent=evLive?("Oxirgi yangilanish: "+new Date(evTs).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})):"Jonli ma\u02bclumot kutilmoqda\u2026";
  evCountMapped();
  const evs=EVENTS.map(ev=>({ev:ev,st:evState(ev),w:evWin(ev)})).filter(x=>x.st!=="past");
  const head=evLive?'<li class="small">🔴 <b>LIVE</b> \u2014 NYC Permitted Events (Open Data) \u00b7 kelgusi 7 kun: <b>'+evs.length+' ta</b> tadbir, xaritada: <b>'+evMapped+' ta</b></li>':'<li class="small">\u26a0\ufe0f Jonli ma\u02bclumot yuklanmadi \u2014 zaxira yozuvlar.</li>';

  if(evSort==="big")evs.sort((x,y)=>{const sd=(y.ev.surge||0)-(x.ev.surge||0);if(sd)return sd;const ax=x.w?x.w.s.getTime():9e15,bx=y.w?y.w.s.getTime():9e15;return ax-bx});else evs.sort((x,y)=>{const ax=x.w?x.w.s.getTime():9e15,bx=y.w?y.w.s.getTime():9e15;return ax-bx});
  const evPages=Math.max(1,Math.ceil(evs.length/5));if(evPage>evPages-1)evPage=evPages-1;if(evPage<0)evPage=0;
  const items=evs.slice(evPage*5,evPage*5+5).map(x=>{const ev=x.ev;
    const stTxt=x.st==="active"?'<span class="hi">FAOL</span>':x.st==="later"?'<span class="med">KEYINROQ</span>':'<span class="med">INFO</span>';
    const when=ev.live?fmtEvWhen(ev):(x.w?(x.w.s.toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})+" \u2192 "+x.w.e.toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})):"aniq vaqt yo\u02bbq");
    return '<li><div class="r"><div><b>'+esc(ev.n)+'</b><div class="small">'+esc(ev.place||"")+'</div><div class="small">'+esc(when)+'</div>'+(ev.type?'<div class="small">'+esc(ev.type)+'</div>':'')+(ev.note?'<div class="small">'+esc(ev.note)+'</div>':'')+'</div><div style="text-align:right">'+stTxt+(ev.surge?'<div class="med mono">\u00d7'+ev.surge+'</div>':'')+'</div></div></li>';
  }).join("");
  el.innerHTML=head+(items||'<li class="small">Yaqin tadbirlar yo\u02bbq.</li>');
  const epi=$("evPageInfo");if(epi)epi.textContent=evs.length?((evPage*5+1)+"\u2013"+Math.min(evs.length,evPage*5+5)+" / "+evs.length+" \u00b7 Sahifa "+(evPage+1)+"/"+evPages):"0 ta";
  const epv=$("evPrev");if(epv)epv.disabled=evPage<=0;
  const enx=$("evNext");if(enx)enx.disabled=evPage>=evPages-1;
  updateErNote();
}
function evPopup(e){return "<b>"+esc(e.n)+"</b><br>📅 "+esc(fmtEvWhen(e))+"<br>📍 "+esc(e.place||"")+(e.type?"<br>🎉 "+esc(e.type):"")+(e.surge?"<br>\u26a1 Surge (taxminiy): \u00d7"+e.surge:"")}
function drawEvMarkers(){drawErLayers()}
function setEvSort(s){evSort=s;evPage=0;const b1=$("evSortSoon"),b2=$("evSortBig");if(b1)b1.classList.toggle("on",s==="soon");if(b2)b2.classList.toggle("on",s==="big");renderEvents()}

function renderParking(){
  const t=nowNY();const ds=t.toISOString().slice(0,10);const dow=t.getDay();
  const off=ASP_OFF.indexOf(ds)>=0;
  const asp=dow===0?"Yakshanba — koʻpchilik ASP qoidalari amal qilmaydi":off?"Bugun bayram — ASP (Alternate Side Parking) toʻxtatilgan, meterlar ham odatda ishlamaydi":"Bugun ASP qoidalari AMALDA — koʻcha belgisidagi vaqtga qarang";
  $("parkBox").innerHTML='<div class="mid">'+esc(asp)+'</div><div class="small" style="margin-top:6px">Meter: odatda 1 soatlik cheklov zonalarga qarab farq qiladi; yakshanba meter bepul (koʻpchilik joylarda). Belgilar va qoidalar koʻrsatiladi, boʻsh joy real vaqtda kafolatlanmaydi.</div>';
  $("garageList").innerHTML=listHTML(distSort(GARAGES),"🅿️");drawStLayers();
}

/* ================= Earnings Calculator (Modul 4) ================= */
function netOf(gross,miles,exp){return gross-(miles*settings.cons*settings.price)-exp}
$("eCalc").addEventListener("click",()=>{
  const g=parseFloat($("eGross").value)||0,h=parseFloat($("eHours").value)||0,mi=parseFloat($("eMiles").value)||0;
  const exp=(parseFloat($("eTolls").value)||0)+(parseFloat($("ePark").value)||0)+(parseFloat($("eOther").value)||0);
  const kwh=mi*settings.cons,ecost=kwh*settings.price,net=g-ecost-exp;
  const maint=mi*(settings.maint||0),netFull=net-maint;
  $("eOut").innerHTML='<table><tr><td>Elektr sarfi</td><td class="mono">'+kwh.toFixed(1)+' kWh</td></tr>'+
  '<tr><td>Elektr xarajati (haqiqiy)</td><td class="mono">'+money(ecost)+'</td></tr>'+
  '<tr><td>Toll/parking/boshqa (haqiqiy)</td><td class="mono">'+money(exp)+'</td></tr>'+
  '<tr><td><b>Sof foyda (haqiqiy xarajatlar)</b></td><td class="mono"><b>'+money(net)+'</b></td></tr>'+
  '<tr><td>Texnik xizmat (TAXMINIY, '+money(settings.maint||0)+'/mil)</td><td class="mono">'+money(maint)+'</td></tr>'+
  '<tr><td><b>Sof foyda (taxmin bilan)</b></td><td class="mono"><b>'+money(netFull)+'</b></td></tr>'+
  '<tr><td>Sof / soat (taxmin bilan)</td><td class="mono">'+(h>0?money(netFull/h):"—")+'</td></tr>'+
  '<tr><td>Sof / mil (taxmin bilan)</td><td class="mono">'+(mi>0?money(netFull/mi):"—")+'</td></tr></table>';
});

/* ================= Driver Journal (Modul 7) ================= */
let journal=[];try{journal=JSON.parse(localStorage.getItem("drv_journal")||"[]")}catch(e){journal=[]}
function saveJournal(){localStorage.setItem("drv_journal",JSON.stringify(journal));idbMirror()}
function dayStr(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
let editingId=null;
function renderJournal(){
  const today=dayStr(nowNY());
  const weekAgo=new Date(nowNY().getTime()-6*864e5);
  let tSum=0,wSum=0,tGross=0,tHours=0;
  journal.forEach(e=>{const net=netOf(e.gross,e.miles,e.exp);if(e.date===today){tSum+=net;tGross+=e.gross;tHours+=e.hours}if(new Date(e.date+"T12:00:00")>=weekAgo)wSum+=net});
  $("jToday").textContent=money(tSum);$("jWeek").textContent=money(wSum);$("todayEarn").textContent=money(tSum);
  const tg=$("todayGross");if(tg)tg.textContent=money(tGross);
  const tn=$("todayNet2");if(tn)tn.textContent=money(tSum);
  const tp=$("todayPerHour");if(tp)tp.textContent=tHours>0?money(tSum/tHours):"—";
  const fEl=$("jFilter");const f=fEl?fEl.value:"all";
  const fDays=f==="all"?null:parseInt(f,10);
  const sorted=[].concat(journal).sort((a,b)=>b.date<a.date?-1:1).filter(e=>{const d=new Date(e.date+"T12:00:00");if(f==="month"){const n=nowNY();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()}if(!fDays)return true;return (nowNY()-d)<=fDays*864e5});
  const jsm=$("jSum");
  if(jsm){let sg=0,sn=0,sh=0,smi=0;sorted.forEach(e=>{sg+=e.gross;sn+=netOf(e.gross,e.miles,e.exp);sh+=e.hours;smi+=e.miles});
    jsm.innerHTML=sorted.length?("Filtr jami: <b>"+sorted.length+" smena</b> · Gross "+money(sg)+" · Sof <b>"+money(sn)+"</b> · "+(Math.round(sh*10)/10)+" soat"+(sh>0?" · "+money(sn/sh)+"/soat":"")+" · "+distTxt(smi)):""}
  $("jList").innerHTML=sorted.map(e=>{const net=netOf(e.gross,e.miles,e.exp);
    return '<li><div class="r"><div><b>'+esc(e.date)+'</b> · <span class="mono">'+money(e.gross)+'</span><div class="small">'+e.hours+' soat · '+distTxt(e.miles)+' · sof: <b>'+money(net)+'</b>'+(e.hours>0?' · '+money(net/e.hours)+'/soat':'')+(e.zone?" · 📍"+esc(e.zone):"")+(e.startHour!=null?" · ▶ "+String(e.startHour).padStart(2,"0")+":00":"")+(e.note?" · "+esc(e.note):"")+'</div></div><div><button class="del" data-edit="'+e.id+'" title="Tahrirlash" style="color:var(--blu)">✏️</button><button class="del" data-del="'+e.id+'" title="O\u02bbchirish">✕</button></div></div></li>'}).join("")||'<li class="small">Bu filtrda yozuv yo\u02bbq.</li>';
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{journal=journal.filter(x=>x.id!=b.getAttribute("data-del"));saveJournal();renderJournal();toast("Yozuv oʻchirildi")}));
  document.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>{
    const e=journal.find(x=>x.id==b.getAttribute("data-edit"));if(!e)return;
    editingId=e.id;$("jDate").value=e.date;$("jGross").value=e.gross;$("jHours").value=e.hours;$("jMiles").value=e.miles;$("jExp").value=e.exp;$("jZone").value=e.zone||"";$("jHour").value=e.startHour==null?"":String(e.startHour);$("jNote").value=e.note||"";
    $("jAdd").textContent="Yangilash (tahrir saqlansin)";renderJPreview();window.scrollTo(0,0);toast("Tahrirlash rejimi — oʻzgartirib Saqlang");
  }));
}
$("jAdd").addEventListener("click",()=>{
  const e={id:editingId||Date.now(),date:$("jDate").value||dayStr(nowNY()),gross:parseFloat($("jGross").value)||0,hours:parseFloat($("jHours").value)||0,miles:parseFloat($("jMiles").value)||0,exp:parseFloat($("jExp").value)||0,zone:$("jZone").value||"",startHour:$("jHour").value===""?null:parseInt($("jHour").value,10),note:$("jNote").value.trim()};
  if(!e.gross&&!e.miles){toast("Kamida tushum yoki mil kiriting");return}
  if(editingId){const i=journal.findIndex(x=>x.id===editingId);if(i>=0)journal[i]=e;editingId=null;$("jAdd").textContent="Saqlash";toast("Yozuv yangilandi ✔")}
  else{journal.push(e);toast("Smena saqlandi ✔")}
  saveJournal();renderJournal();renderHome();renderCal();
  $("jGross").value=$("jHours").value=$("jMiles").value=$("jExp").value=$("jNote").value="";$("jZone").value="";$("jHour").value="";renderJPreview();
});
function renderJPreview(){
  const el=$("jPreview");if(!el)return;
  const g=parseFloat($("jGross").value)||0,h=parseFloat($("jHours").value)||0,mi=parseFloat($("jMiles").value)||0,ex=parseFloat($("jExp").value)||0;
  if(!g&&!h&&!mi){el.textContent="";return}
  const net=netOf(g,mi,ex);
  el.innerHTML="Taxminiy sof: <b>"+money(net)+"</b>"+(h>0?" · "+money(net/h)+"/soat":"")+(mi>0?" · "+money(net/mi)+"/mil":"")+" — elektr xarajati hisobga olingan";
}
["jGross","jHours","jMiles","jExp"].forEach(id=>{const n=$(id);if(n)n.addEventListener("input",renderJPreview)});
const jf=$("jFilter");if(jf)jf.addEventListener("change",renderJournal);
$("jExport").addEventListener("click",()=>{
  if(!journal.length){toast("Eksport uchun yozuv yoʻq");return}
  let csv="date,gross,hours,miles,expenses,net,zone,start_hour,note\n"+journal.map(e=>[e.date,e.gross,e.hours,e.miles,e.exp,netOf(e.gross,e.miles,e.exp).toFixed(2),'"'+String(e.zone||"").replace(/"/g,'""')+'"',e.startHour==null?"":e.startHour,'"'+String(e.note||"").replace(/"/g,'""')+'"'].join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="driver-journal.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
});
$("jClear").addEventListener("click",()=>{if(confirm("Barcha jurnal yozuvlari oʻchirilsinmi?")){journal=[];saveJournal();renderJournal();renderHome();toast("Jurnal tozalandi")}});

/* ================= Voice Assistant (Modul 8) ================= */
function speak(txt){
  try{const u=new SpeechSynthesisUtterance(txt);u.lang=settings.lang;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){toast("Ovoz chiqarish ishlamadi")}
}
function voiceSummary(){
  if(!bestPick)renderHome();
  const t=$("jToday").textContent;
  return "Eng yaxshi keyingi joy: "+bestPick.z.n+". Ball "+bestPick.score+". Masofa "+bestPick.dist.toFixed(1)+" mil, taxminiy "+bestPick.etaMin+" daqiqa. Bugungi sof daromad: "+t+".";
}
$("vSpeak").addEventListener("click",()=>speak(voiceSummary()));
$("vListen").addEventListener("click",()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){$("vStat").textContent="Bu brauzerda ovoz tanish qoʻllab-quvvatlanmaydi (iOS Safari cheklashi mumkin). Tugmalar bilan davom eting.";return}
  const r=new SR();r.lang=settings.lang;r.interimResults=false;
  $("vStat").textContent="🎤 Tinglayapman… buyruq ayting";
  r.onresult=ev=>{
    const txt=ev.results[0][0].transcript.toLowerCase();$("vStat").textContent="Eshitildi: «"+txt+"»";
    if(/aeroport|airport|jfk|lga|ewr/.test(txt)){go("airports");speak("Aeroportlar boʻlimi ochildi")}
    else if(/ob-havo|ob havo|yomgʻir|yomgir|weather/.test(txt)){go("tools","modWx");speak($("wxShort").textContent+". Yomgʻir ehtimoli "+Math.round(rainProb3h)+" foiz")}
    else if(/eng yaxshi|qayerga|next|joy/.test(txt)){go("home");speak(voiceSummary())}
    else if(/daromad|bugun|pul|earnings/.test(txt)){go("journal");speak("Bugungi sof daromad: "+$("jToday").textContent)}
    else if(/xarita|map/.test(txt)){go("map");speak("Xarita ochildi")}
    else{speak("Tushunmadim. Aeroport, ob-havo, eng yaxshi joy yoki daromad deng")}
  };
  r.onerror=()=>{$("vStat").textContent="Ovoz tanishda xato — qayta urining yoki tugmalardan foydalaning"};
  r.start();
});

/* ================= 3-bosqich: alerts, notif, drive, refresh ================= */
let notifSeen={};
function maybeNotify(){
  if(!settings.notif)return;
  const hk=nowNY().getHours();
  if(typeof rainProb3h==="number"&&rainProb3h>=70&&notifSeen.rain!==hk){notifSeen.rain=hk;toast("⚠️ Yomgʻir ehtimoli yuqori: "+Math.round(rainProb3h)+"% — talab oshishi mumkin")}
  CLOSURES.forEach((c,i)=>{if(clActive(c)&&c.sev==="Yuqori"&&notifSeen["c"+i]!==hk){notifSeen["c"+i]=hk;toast("🚧 Faol yopilish (yuqori): "+c.n)}});
}
function applyDrive(){document.body.classList.toggle("drive",!!settings.drive);const ds=$("driveState");if(ds)ds.textContent=settings.drive?"Yoniq":"Oʻchiq"}
function refreshHeat(){try{
  if(map&&heatLayer){map.removeLayer(heatLayer);heatLayer=heatCircles(map,heatSel());heatLayer.addTo(map);if(typeof layerGroups!=="undefined")layerGroups.heat=heatLayer}
  if(mapHome&&heatHome){mapHome.removeLayer(heatHome);heatHome=heatCircles(mapHome);heatHome.addTo(mapHome)}
}catch(e){}}
{const db=$("driveBtn");if(db)db.addEventListener("click",()=>{settings.drive=!settings.drive;saveSettings();applyDrive();toast(settings.drive?"🚗 Haydash rejimi yoniq":"Haydash rejimi oʻchiq")});
const hm=$("homeMore");if(hm)hm.addEventListener("toggle",()=>{if(hm.open&&mapHome)setTimeout(()=>{try{mapHome.invalidateSize()}catch(e){} redrawHomeHeat()},80)});
let lastHour=null;
setInterval(()=>{const h=nowNY().getHours();if(lastHour===null){lastHour=h;return}if(h!==lastHour){lastHour=h;renderHome();refreshHeat()}},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden){renderHome();loadClosures(false);loadEvents(false)}});}

{const cb=$("clRefresh");if(cb)cb.addEventListener("click",()=>{loadClosures(true);toast("🚧 Yopilishlar yangilanmoqda\u2026")});}
{const fa=$("clFAct");if(fa)fa.addEventListener("click",()=>setClFilter("act"));}
{const fu=$("clFUp");if(fu)fu.addEventListener("click",()=>setClFilter("up"));}
{const fl=$("clFAll");if(fl)fl.addEventListener("click",()=>setClFilter("all"));}
{const pv=$("clPrev");if(pv)pv.addEventListener("click",()=>{if(clPage>0){clPage--;renderClosures()}});}
{const nx=$("clNext");if(nx)nx.addEventListener("click",()=>{clPage++;renderClosures()});}
{const eb=$("evRefresh2");if(eb)eb.addEventListener("click",()=>{loadEvents(true);toast("🎉 Tadbirlar yangilanmoqda\u2026")});}
{const tg1=$("erTgEv");if(tg1)tg1.addEventListener("click",()=>setErToggle("ev"));}
{const tg2=$("erTgRd");if(tg2)tg2.addEventListener("click",()=>setErToggle("rd"));}
{const tb1=$("erTabEv");if(tb1)tb1.addEventListener("click",()=>setErTab("ev"));}
{const tb2=$("erTabRd");if(tb2)tb2.addEventListener("click",()=>setErTab("rd"));}
{const s1=$("evSortSoon");if(s1)s1.addEventListener("click",()=>setEvSort("soon"));}
{const s2=$("evSortBig");if(s2)s2.addEventListener("click",()=>setEvSort("big"));}
{const ep=$("evPrev");if(ep)ep.addEventListener("click",()=>{if(evPage>0){evPage--;renderEvents()}});}
{const en=$("evNext");if(en)en.addEventListener("click",()=>{evPage++;renderEvents()});}
{const g1=$("stTgWc");if(g1)g1.addEventListener("click",()=>setStToggle("wc"));}
{const g2=$("stTgPark");if(g2)g2.addEventListener("click",()=>setStToggle("park"));}
{const g3=$("stTgEv");if(g3)g3.addEventListener("click",()=>setStToggle("ev"));}
{const t1=$("stTabWc");if(t1)t1.addEventListener("click",()=>setStTab("wc"));}
{const t2=$("stTabPark");if(t2)t2.addEventListener("click",()=>setStTab("park"));}
{const t3=$("stTabEv");if(t3)t3.addEventListener("click",()=>setStTab("ev"));}
{const me2=$("modEvents");if(me2)me2.addEventListener("toggle",()=>{if(me2.open)loadEvents(false)});}
{const md=$("modClose");if(md)md.addEventListener("toggle",()=>{if(md.open)loadClosures(false)});}

/* ================= Navigation & Geo ================= */
/* v10.41: Map vaqt slayderi + kun tanlash — faqat heat qatlami (kunlik tarixiy naqsh, zones.json days) */
function heatSel(){
  const mins=(mapSelMin==null)?(nowNY().getHours()*60+nowNY().getMinutes()):mapSelMin;
  const day=(mapSelDay==null?todayIdx():mapSelDay);
  return {day:(day+(mins>=1440?1:0))%7,hour:Math.floor(mins/60)%24};
}
function redrawMapHeat(){
  if(!map||!heatLayer)return;
  const sel=heatSel();const key=sel.day+"|"+sel.hour;
  map.removeLayer(heatLayer);heatLayer=heatCircles(map,sel);heatLayer.addTo(map);if(typeof layerGroups!=="undefined")layerGroups.heat=heatLayer;
  lastHeatKey=key;
}
function redrawHomeHeat(){
  if(mapHome&&heatHome){mapHome.removeLayer(heatHome);heatHome=heatCircles(mapHome);heatHome.addTo(mapHome)}
}
function redrawHeats(){
  if(map&&heatLayer){map.removeLayer(heatLayer);heatLayer=heatCircles(map,heatSel());heatLayer.addTo(map);if(typeof layerGroups!=="undefined")layerGroups.heat=heatLayer}
  redrawHomeHeat();
}
function syncMapTimeUI(){
  const sl=$("mapTimeSlider");if(!sl)return;
  const n=nowNY();
  const mins=(mapSelMin==null)?(n.getHours()*60+n.getMinutes()):mapSelMin;
  sl.value=String(mins);
  const val=$("mapTimeVal");if(val)val.textContent=String(Math.floor(mins/60)).padStart(2,"0")+":"+String(mins%60).padStart(2,"0");
  const sel=heatSel();
  const nw=$("mapTimeNow");if(nw)nw.textContent=(mapSelMin==null&&mapSelDay==null)?" \u00b7 Hozir":"";
  const db=$("mapDayBtn");if(db)db.textContent="\uD83D\uDCC5 "+DAYLBL[sel.day];
  document.querySelectorAll("#mapDayRow .chip").forEach(c=>c.classList.toggle("on",+c.dataset.mday===sel.day));
}
function applyMapMinutes(v){
  mapSelMin=parseInt(v,10)||0;
  const sel=heatSel();const key=sel.day+"|"+sel.hour;
  syncMapTimeUI();
  if(key!==lastHeatKey)redrawMapHeat();
}
function applyMapDay(d){
  mapSelDay=(+d===todayIdx())?null:+d;
  syncMapTimeUI();redrawMapHeat();
}
function resetMapTime(){
  mapSelMin=null;mapSelDay=null;
  syncMapTimeUI();redrawMapHeat();
}
function go(view,modId){
  loadZones();
  if(modId){openModule(modId);return}
  if($("modBody")&&$("modBody").querySelector("details.mod"))modClear();
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("act"));
  $("view-"+view).classList.add("act");
  document.querySelectorAll("[data-nav]").forEach(b=>b.classList.toggle("on",b.getAttribute("data-nav")===view));
  if(view==="map"){initMaps();setTimeout(()=>{map.invalidateSize();map.setView([userLat(),userLon()],12)},80)}
  if(view==="home"){setTimeout(()=>{if(mapHome){try{mapHome.invalidateSize()}catch(e){} mapHome.setView([userLat(),userLon()],11);redrawHomeHeat()} fitHome()},80);setTimeout(fitHome,450)}
  if(view==="airports"){loadLiveFlights(false);if(apMode()==="live"){loadApEta(false)}renderAirports()}
  if(view==="map"){resetMapTime()}
  if(view==="analytics")renderAnalytics();
  if(view==="settings")renderApiStat();

  window.scrollTo(0,0);
}

/* ================= Modul oynasi (har bir modul alohida ekran) ================= */
let modHomes={},modPrev="menu";
function showModView(){document.querySelectorAll(".view").forEach(v=>v.classList.remove("act"));$("view-mod").classList.add("act");window.scrollTo(0,0)}
function modMoveIn(d){const body=$("modBody");if(!body)return;if(d.parentElement!==body){modHomes[d.id]={p:d.parentNode,n:d.nextSibling};body.appendChild(d)}d.open=true}
function openModule(id){
  const d=$(id);if(!d)return;
  if(id==="modEvents"||id==="modClose"){openGroup("events");setTimeout(()=>setErTab(id==="modClose"?"rd":"ev"),40);return}
  if(id==="modRest"||id==="modPark"||id==="modEv"){openGroup("stops");setTimeout(()=>setStTab(id==="modPark"?"park":id==="modEv"?"ev":"wc"),40);return}
  const cur=document.querySelector(".view.act");if(cur)modPrev=cur.id.replace("view-","");
  const t=d.querySelector("summary span");$("modTitle").textContent=t?t.textContent.replace(/\s+/g," ").trim():"Modul";
  modMoveIn(d);showModView();
}
const GRPS={smart:["Smart Assistant",["modSmart","modVoice"]],events:["Events & Road",["modEvents","modClose"]],wx:["Weather & Cameras",["modWx","modCam"]],stops:["Stops & Charging",["modRest","modPark","modEv"]]};
function openGroup(key){
  const g=GRPS[key];if(!g)return;
  const cur=document.querySelector(".view.act");if(cur)modPrev=cur.id.replace("view-","");
  $("modTitle").textContent=g[0];
  g[1].forEach(id=>{const d=$(id);if(d)modMoveIn(d)});
  showModView();
  if(key==="events")setTimeout(()=>setErTab("ev"),40);
  if(key==="stops")setTimeout(()=>setStTab("wc"),40);
  setTimeout(refreshErMap,160);setTimeout(refreshStMap,160);
}
function modClear(){
  const body=$("modBody");if(!body)return;
  body.querySelectorAll("details.mod").forEach(d=>{const hm=modHomes[d.id];d.open=false;d.style.display="";const _ep=$("evPanel");if(_ep)_ep.style.display="";const _wp=$("wcPanel");if(_wp)_wp.style.display="";if(hm){if(hm.n&&hm.n.parentNode===hm.p)hm.p.insertBefore(d,hm.n);else hm.p.appendChild(d);delete modHomes[d.id]}});
}
function closeModule(){modClear();go(modPrev||"menu")}
{const mb=$("modBack");if(mb)mb.addEventListener("click",closeModule);}
document.querySelectorAll("details.mod").forEach(d=>d.addEventListener("toggle",()=>{if(d.open&&d.parentElement!==$("modBody"))openModule(d.id)}));
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>go(b.getAttribute("data-nav"))));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.getAttribute("data-go"),b.getAttribute("data-mod")||undefined)));
document.querySelectorAll("[data-grp]").forEach(b=>b.addEventListener("click",()=>{openGroup(b.getAttribute("data-grp"));const tb=b.getAttribute("data-ertab");if(tb)setTimeout(()=>setErTab(tb),60);const sb=b.getAttribute("data-sttab");if(sb)setTimeout(()=>setStTab(sb),60)}));
const hm=$("homeMore");
if(hm)hm.addEventListener("toggle",()=>{if(hm.open){if(!map)initMaps();if(mapHome)setTimeout(()=>{try{mapHome.invalidateSize();mapHome.setView([userLat(),userLon()],11)}catch(e){} redrawHomeHeat()},60)}});

document.querySelectorAll("#apTabs .chip").forEach(ch=>ch.addEventListener("click",()=>{document.querySelectorAll("#apTabs .chip").forEach(x=>x.classList.remove("on"));ch.classList.add("on");curAp=ch.getAttribute("data-ap");drawApChart()}));
document.querySelectorAll("#apModeChips .chip[data-apmode]").forEach(ch=>ch.addEventListener("click",()=>setApMode(ch.getAttribute("data-apmode"))));
{const rb=$("apRefresh");if(rb)rb.addEventListener("click",()=>{if(apMode()==="live"){loadLiveFlights(true);loadApEta(true);toast("Jonli maʼlumot yangilanmoqda…")}else{renderAirports();toast("Historical — TLC tarixiy naqsh (jonli emas)")}})}
{const mts=$("mapTimeSlider");if(mts)mts.addEventListener("input",e=>applyMapMinutes(e.target.value));}
{const db=$("mapDayBtn");if(db)db.addEventListener("click",()=>{const r=$("mapDayRow");if(r)r.style.display=(r.style.display==="none"||!r.style.display)?"flex":"none"});}
document.querySelectorAll("#mapDayRow .chip").forEach(c=>c.addEventListener("click",()=>applyMapDay(c.dataset.mday)));
let recs=[];try{recs=JSON.parse(localStorage.getItem("drv_recs")||"[]")}catch(e){recs=[]}
function recordRecFor(s){if(!s)return false;recs.unshift({t:new Date().toISOString(),zone:s.z.n,score:s.score,conf:s.conf||null,c:{D:s.D,F:s.F,E:s.E,W:s.W,T:s.T,P:s.P}});recs=recs.slice(0,50);try{localStorage.setItem("drv_recs",JSON.stringify(recs));idbMirror()}catch(e){}renderCal();return true}
function recordRec(){return recordRecFor(bestPick)}
$("bestGo").addEventListener("click",()=>{if(recordRec())gmaps(bestPick.z.lat,bestPick.z.lon)});
{const ro=$("recOnly");if(ro)ro.addEventListener("click",()=>{if(recordRec())toast("✔️ Tavsiya yozib qoʻyildi — kalibrlash uchun")});}
{const hc=$("hotChips");if(hc)hc.addEventListener("click",e=>{const b=e.target.closest("[data-hoff]");if(!b)return;hotOff=+b.dataset.hoff;hotAll=false;renderHot()});
const hst=$("hotSort");if(hst)hst.addEventListener("change",()=>{hotSort=hst.value;renderHot()});
const hmx=$("hotMax");if(hmx)hmx.addEventListener("change",()=>{hotMax=+hmx.value;hotAll=false;renderHot()});
const hmo=$("hotMore");if(hmo)hmo.addEventListener("click",()=>{hotAll=!hotAll;renderHot()});
const hl=$("hotList");if(hl)hl.addEventListener("click",e=>{const g=e.target.closest("[data-hgo]"),rc=e.target.closest("[data-hrec]");if(!g&&!rc)return;const s2=lastHotList[+(g?g.dataset.hgo:rc.dataset.hrec)];if(!s2)return;if(g){if(recordRecFor(s2)){toast("✔️ Tavsiya yozildi: "+s2.z.n);gmaps(s2.z.lat,s2.z.lon)}}else if(recordRecFor(s2))toast("✔️ Yozib qoʻyildi: "+s2.z.n)});}
$("tileBestBtn").addEventListener("click",()=>{const b=$("bestCard");if(b)b.scrollIntoView({behavior:"smooth"})});
$("camMapBtn").addEventListener("click",()=>{go("map");const ch=document.querySelector('[data-layer="cam"]');if(ch&&!ch.classList.contains("on"))ch.click()});
$("wcRefresh").addEventListener("click",()=>refreshWC(true,true));
$("evRefresh").addEventListener("click",()=>refreshEV(true));
function tickClock(){const t=nowNY();const hc=$("heroClock");if(hc)hc.textContent=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});const hd=$("heroDate");if(hd)hd.textContent="New York City · Live overview · "+t.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
if(navigator.geolocation){
  navigator.geolocation.watchPosition(p=>{
    pos={lat:p.coords.latitude,lon:p.coords.longitude};
    renderHome();
    if(map){map.setView([pos.lat,pos.lon],12);if(userMk)userMk.setLatLng([pos.lat,pos.lon])}
    if(mapHome){mapHome.setView([pos.lat,pos.lon],11);if(userMkH)userMkH.setLatLng([pos.lat,pos.lon])}
    if(erMe)erMe.setLatLng([pos.lat,pos.lon]);
    if(stMe)stMe.setLatLng([pos.lat,pos.lon]);
    if(mapOn.wc&&(!lastWcRoutePos||hav(pos.lat,pos.lon,lastWcRoutePos.lat,lastWcRoutePos.lon)>0.19)){Object.keys(routeInfo).forEach(k=>{if(k.indexOf("wc@")===0)delete routeInfo[k]});if(panelLayer==="wc")renderMapPanel();kickRoutesWc()}
  },()=>{toast("GPS ruxsati yoʻq — Manhattan markazi ishlatiladi")},{enableHighAccuracy:false,maximumAge:60000,timeout:12000});
}

/* ================= Analytics ================= */
function renderAnalytics(){
  let g=0,n=0,hrs=0,mi=0;const days={};
  journal.forEach(e=>{const net=netOf(e.gross,e.miles,e.exp);g+=e.gross;n+=net;hrs+=e.hours;mi+=e.miles;days[e.date]=(days[e.date]||0)+net});
  const dk=Object.keys(days);
  $("anGross").textContent=money(g);$("anNet").textContent=money(n);$("anDays").textContent=dk.length;
  $("anPerHour").textContent=hrs>0?money(n/hrs):"—";$("anPerMile").textContent=mi>0?money(n/mi):"—";
  let bd=null,bv=-1e18;dk.forEach(d=>{if(days[d]>bv){bv=days[d];bd=d}});
  $("anBest").textContent=bd?(bd.slice(5)+" · "+money(bv)):"—";
  const cv=$("anChart");if(cv){const ctx=cv.getContext("2d");const W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    const arr=[];for(let i=6;i>=0;i--){const d=new Date(nowNY().getTime()-i*864e5);arr.push({d:dayStr(d),v:days[dayStr(d)]||0})}
    const mx=Math.max(1,Math.max.apply(null,arr.map(x=>Math.abs(x.v))));
    const bw=W/arr.length;
    arr.forEach((x,i)=>{const bh=(H-30)*(x.v/mx);ctx.fillStyle=x.v>=0?"#22c55e":"#f87171";const y=x.v>=0?H-20-bh:H-20;ctx.fillRect(i*bw+8,y,bw-16,Math.abs(bh));
      ctx.fillStyle=inkF();ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText("$"+Math.round(x.v),i*bw+bw/2,(x.v>=0?y-4:H-26));
      ctx.fillStyle="#9aa3af";ctx.font="10px sans-serif";ctx.fillText(x.d.slice(5),i*bw+bw/2,H-6);});}
  $("recList").innerHTML=recs.slice(0,10).map(r=>'<li><div class="r"><div><b>'+esc(r.zone)+'</b><div class="small">'+esc(String(r.t).slice(0,16).replace("T"," "))+' · Score '+r.score+(r.conf?" · Confidence "+r.conf+"%":"")+'</div></div><span class="badge b-est">LOG</span></div></li>').join("")||'<li class="small">Hozircha tavsiya yozuvi yoʻq — Home da GO bosing.</li>';
  renderCal();
}

/* ================= Kalibrlash (2-bosqich) ================= */
function entryRate(e){return e.hours>0?netOf(e.gross,e.miles,e.exp)/e.hours:null}
function matchRecs(){
  const base=realPerHour();if(!base)return {pairs:[],base:null};
  const pairs=[];
  recs.forEach(r=>{
    const dstr=dayStr(new Date(r.t));
    const cand=journal.filter(e=>e.date===dstr&&e.zone===r.zone&&e.hours>0);
    if(!cand.length)return;
    const rh=new Date(r.t).getHours();
    cand.sort((a,b)=>{const ah=a.startHour==null?99:Math.abs(a.startHour-rh);const bh=b.startHour==null?99:Math.abs(b.startHour-rh);return ah-bh});
    const rate=entryRate(cand[0]);
    if(rate!=null)pairs.push({r:r,e:cand[0],rate:rate,hit:rate>=base.v});
  });
  return {pairs:pairs,base:base};
}
function pearson(xs,ys){const n=xs.length;if(n<3)return 0;const mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;let num=0,dx=0,dy=0;for(let i=0;i<n;i++){num+=(xs[i]-mx)*(ys[i]-my);dx+=(xs[i]-mx)*(xs[i]-mx);dy+=(ys[i]-my)*(ys[i]-my)}return (dx&&dy)?num/Math.sqrt(dx*dy):0}
function suggestWeights(){
  const zoned=journal.filter(e=>e.zone&&e.hours>0);
  if(zoned.length<30)return {ok:false,reason:"Hudud belgilangan smenalar: "+zoned.length+"/30 — yana "+(30-zoned.length)+" ta kerak"};
  const pairs=matchRecs().pairs.filter(x=>x.r.c);
  if(pairs.length<5)return {ok:false,reason:"Komponentli tavsiya juftliklari kam ("+pairs.length+"/5) — GO bosib, o'sha hududda smena yozing"};
  const comps=["D","F","E","W","T","P"];const out={};const rs={};
  comps.forEach(c=>{rs[c]=pearson(pairs.map(x=>x.r.c[c]==null?0:x.r.c[c]),pairs.map(x=>x.rate))});
  let sum=0;comps.forEach(c=>{out[c]=WEIGHTS[c]*Math.max(0.2,1+rs[c]);sum+=out[c]});
  comps.forEach(c=>{out[c]=Math.round((out[c]/sum)*20)/20});
  const drift=Math.round((1-comps.reduce((a,c)=>a+out[c],0))*20)/20;
  const big=comps.reduce((a,c)=>out[c]>out[a]?c:a,"D");out[big]=Math.round((out[big]+drift)*20)/20;
  return {ok:true,w:out,rs:rs,n:pairs.length};
}
function renderCal(){
  const m=matchRecs();
  const acc=$("accBox");
  if(acc){
    if(!recs.length)acc.innerHTML="Hali tavsiya yo'q — Home da GO bosing.";
    else if(!m.pairs.length)acc.innerHTML="Tavsiyalar: "+recs.length+" ta yozilgan, lekin hali birontasi ham jurnal smenasi bilan bog'lanmadi. Bog'lanish uchun: GO bosgan hududingiz jurnal yozuvida 'Hudud' maydonida belgilanishi va sana bir xil bo'lishi kerak.";
    else{const hits=m.pairs.filter(x=>x.hit).length;const avg=m.pairs.reduce((a,x)=>a+x.rate,0)/m.pairs.length;
      acc.innerHTML="Bog'langan tavsiyalar: <b>"+m.pairs.length+"</b> · Aniqlik (o'rtachadan yuqori daromad): <b>"+Math.round(hits/m.pairs.length*100)+"%</b> ("+hits+"/"+m.pairs.length+")<br>Tavsiya qilingan hududlarda o'rtacha: <b>"+money(avg)+"/soat</b> · Umumiy o'rtachingiz: <b>"+money(m.base.v)+"/soat</b>"+(m.pairs.length<5?"<br><span class='med'>Namuna kichik — xulosa chiqarishga erta.</span>":"")}
  }
  const cal=$("calBox");if(!cal)return;
  const cur=effW();
  let h="<div>Amaldagi koeffitsiyentlar: D "+cur.D+" · F "+cur.F+" · E "+cur.E+" · W "+cur.W+" · T "+cur.T+" · P "+cur.P+(settings.weights?" (kalibrlangan)":" (standart)")+"</div>";
  const sug=suggestWeights();
  if(sug.ok){
    h+="<div style='margin-top:6px'><b>Tavsiya etilgan koeffitsiyentlar</b> (n="+sug.n+" juftlik; korrelyatsiyalar: "+["D","F","E","W","T","P"].map(c=>c+" "+(sug.rs[c]>=0?"+":"")+sug.rs[c].toFixed(2)).join(", ")+"):<br>D "+sug.w.D+" · F "+sug.w.F+" · E "+sug.w.E+" · W "+sug.w.W+" · T "+sug.w.T+" · P "+sug.w.P+"</div><div style='margin-top:6px'><button class='ghost' id='calApply'>✔️ Tavsiyani qo'llash</button> <button class='ghost' id='calReset'>Standartga qaytarish</button></div>";
  } else {
    h+="<div style='margin-top:6px'>Kalibrlash holati: "+esc(sug.reason)+"</div>"+(settings.weights?"<div style='margin-top:6px'><button class='ghost' id='calReset'>Standartga qaytarish</button></div>":"");
  }
  cal.innerHTML=h;
  const ap=$("calApply");if(ap)ap.addEventListener("click",()=>{settings.weights=sug.w;saveSettings();renderCal();renderHome();toast("Koeffitsiyentlar qo'llandi ✔")});
  const rsx=$("calReset");if(rsx)rsx.addEventListener("click",()=>{settings.weights=null;saveSettings();renderCal();renderHome();toast("Standart koeffitsiyentlar qaytarildi")});
}

/* ================= Settings ================= */
function fillSettings(){
  $("sName").value=settings.name||"";$("sCar").value=settings.car||"";
  $("sPrice").value=settings.price;$("sCons").value=settings.cons;$("sMaint").value=settings.maint;
  $("sLang").value=settings.lang;$("sTheme").value=settings.theme;$("sUnits").value=settings.units;$("sSpeed").value=settings.speed;
  $("sRefresh").value=String(settings.refresh);$("sNotif").value=String(settings.notif);
  document.querySelectorAll(".apref").forEach(c=>{c.checked=settings.airports.indexOf(c.value)>=0});
  $("sTraffic").checked=!!settings.traffic;$("sEzpass").checked=!!settings.ezpass;
  const zs=$("sZone");zs.innerHTML='<option value="">— tanlanmagan —</option>'+ZONES.map(z=>'<option value="'+esc(z.n)+'">'+esc(z.n)+'</option>').join("");zs.value=settings.zone||"";
  renderCal();
}
$("sSave").addEventListener("click",()=>{
  settings.name=$("sName").value.trim();settings.car=$("sCar").value.trim()||"Tesla Model Y";
  settings.price=parseFloat($("sPrice").value)||0.30;settings.cons=parseFloat($("sCons").value)||0.28;settings.maint=parseFloat($("sMaint").value)||0;
  settings.lang=$("sLang").value;settings.theme=$("sTheme").value;settings.units=$("sUnits").value;settings.speed=$("sSpeed").value;
  settings.refresh=parseInt($("sRefresh").value,10)||10;settings.notif=parseInt($("sNotif").value,10)||0;
  settings.airports=Array.from(document.querySelectorAll(".apref")).filter(c=>c.checked).map(c=>c.value);
  settings.zone=$("sZone").value;
  const trCh=$("sTraffic").checked!==!!settings.traffic,ezCh=$("sEzpass").checked!==!!settings.ezpass;settings.traffic=$("sTraffic").checked;settings.ezpass=$("sEzpass").checked;
  saveSettings();applyTheme();if(map&&trafficLayer){if(settings.traffic)trafficLayer.addTo(map);else map.removeLayer(trafficLayer)}updateTrafficUI();updateEzpassUI();if(trCh||ezCh)refreshAllRoutes();armWx();renderHome();renderAirports();renderJournal();renderApiStat();
  toast("Sozlamalar saqlandi ✔");
});
$("sExport").addEventListener("click",()=>{
  const data=JSON.stringify({settings:settings,journal:journal,recommendations:recs},null,1);
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download="tlc-pro-export.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
});
$("sWipe").addEventListener("click",async()=>{if(confirm("Barcha lokal maʼlumot (jurnal, sozlamalar, tavsiyalar) oʻchirilsinmi?")){try{await Promise.all(IDB_KEYS.map(k=>idbDel(k).catch(()=>{})))}catch(e){} ["drv_journal","drv_settings","drv_recs","drv_geo"].forEach(k=>localStorage.removeItem(k));location.reload()}});
$("sReset").addEventListener("click",async()=>{if(confirm("Sozlamalar standart qiymatlarga qaytarilsinmi? (Jurnal saqlanadi)")){try{await idbDel("drv_settings")}catch(e){} localStorage.removeItem("drv_settings");location.reload()}});

/* ================= Online/Offline ================= */
function setOnline(){const pl=$("livePill");if(!pl)return;if(navigator.onLine){pl.innerHTML="<i></i>LIVE";pl.style.color="var(--grn)";pl.style.borderColor="rgba(34,197,94,.4)"}else{pl.innerHTML="<i></i>OFFLINE";pl.style.color="var(--red)";pl.style.borderColor="var(--red)"}}
window.addEventListener("online",()=>{setOnline();toast("Internet qaytdi — maʼlumot yangilanadi");loadWeather()});
window.addEventListener("offline",()=>{setOnline();toast("Offline — keshdagi maʼlumot koʻrsatiladi; jonli maʼlumot eskirgan boʻlishi mumkin")});
let wxTimer=null;function armWx(){if(wxTimer)clearInterval(wxTimer);wxTimer=setInterval(loadWeather,(settings.refresh||10)*60000)}

/* v10.30: Home sig’imi — avval compact tartib (kichikroq oraliqlar, yordamchi yozuvlar yashirin), zoom faqat oxirgi chora va 0.85 dan past emas; o’lchov layout joylashgandan keyin olinadi, shuning uchun view almashtirishda ekran kichrayib qolmaydi.
   v10.29: Home avtomatik masshtab — birinchi sahifa to'liq ekranga sig'adi, scroll kerak emas.
   Kontent tabiiy balandligi konteynerdan oshsa, zoom bilan proportsional kichraytiriladi (displeyga qarab). */
function fitHome(){const v=$("view-home");if(!v||!v.classList.contains("act"))return;const d=$("homeMore");if((d&&d.open)||document.body.classList.contains("drive")){v.style.zoom="";v.classList.remove("compact");return}
  const measure=()=>{const vr=v.getBoundingClientRect();let need=0;for(const c of v.children){const r=c.getBoundingClientRect();if(r.height)need=Math.max(need,r.bottom-vr.top)}return need};
  v.style.zoom="";v.classList.remove("compact");void v.offsetHeight;
  const have=v.clientHeight;let need=measure();
  if(need>have+2){v.classList.add("compact");void v.offsetHeight;need=measure()}
  if(need>have+2&&have>0)v.style.zoom=Math.max(0.85,(have/need)).toFixed(3)}
/* ================= Init ================= */
$("jDate").value=dayStr(nowNY());
{const jz=$("jZone");if(jz)jz.innerHTML='<option value="">— belgilanmagan —</option>'+ZONES.map(z=>'<option value="'+esc(z.n)+'">'+esc(z.n)+'</option>').join("");
const jh=$("jHour");if(jh)jh.innerHTML='<option value="">—</option>'+Array.from({length:24},(_,i)=>'<option value="'+i+'">'+String(i).padStart(2,"0")+":00</option>").join("");}
applyTheme();fillSettings();setOnline();
tickClock();setInterval(tickClock,30000);
try{renderEventsClosures()}catch(e){}try{renderParking()}catch(e){}try{renderCams()}catch(e){}
$("wcList").innerHTML=listHTML(distSort(WC_FB),"🚻");
$("evList").innerHTML=listHTML(distSort(EV_FB),"⚡");
loadZones();loadZoneWx();
try{renderJournal()}catch(e){}try{renderHome()}catch(e){}try{renderAirports()}catch(e){}syncMapTimeUI();updateMtimeUI();
loadWeather();armWx();
loadClosures(true);setInterval(()=>loadClosures(false),300000);
loadEvents(true);setInterval(()=>loadEvents(false),600000);
setInterval(()=>{if(apViewOpen())loadLiveFlights(false)},1800000);setInterval(()=>{if(apViewOpen()&&apMode()==="live"){loadLiveFlights(false);loadApEta(false)}},60000);setInterval(idbMirror,60000);idbRestore();setInterval(loadZoneWx,1800000);
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}
try{initMaps()}catch(e){}setTimeout(()=>{try{initMaps()}catch(e){}},3000);
/* Map-first startup self-heal: Leaflet kechiksa initMaps qayta uriniladi, plitkalar chiqquncha invalidateSize+setView takrorlanadi, L kelmasa jsDelivr zaxira nusxasi ulanadi. */
let _mapFixTries=0;const _mapFix=setInterval(()=>{_mapFixTries++;
    const _tilesUp=()=>document.querySelectorAll("#map .leaflet-tile-loaded").length>0;
  if(typeof L!=="undefined"){
    if(!map){try{initMaps()}catch(e){}}
    if(map){if(!_tilesUp()){try{map.invalidateSize();map.setView([userLat(),userLon()],12)}catch(e){}}else clearInterval(_mapFix)}
  }
  else if(_mapFixTries===6&&!window._leafletFb){window._leafletFb=1;const _sc=document.createElement("script");_sc.src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";document.head.appendChild(_sc)}
  if(_mapFixTries>=20)clearInterval(_mapFix)},800);
setTimeout(()=>{if(mapHome){try{mapHome.invalidateSize()}catch(e){}}},700);
setTimeout(fitHome,850);setTimeout(fitHome,2200);setTimeout(fitHome,4800);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fitHome());window.addEventListener("resize",()=>fitHome());window.addEventListener("orientationchange",()=>setTimeout(fitHome,300));
{const hmF=$("homeMore");if(hmF)hmF.addEventListener("toggle",()=>setTimeout(fitHome,60))}
refreshWC(false);refreshEV(false);

/* Fayl ajratilgach (3-bosqich): generatsiya qilingan HTML dagi inline onclick uchun */
window.gmaps=gmaps;
window.apGo=function(code){const zs=zoneScores().find(x=>x.z.n===apZoneName(code));const ap=AIRPORTS.find(a=>a.code===code);if(!ap)return;if(zs&&recordRecFor(zs))toast("✔️ Tavsiya yozildi: "+zs.z.n);gmaps(ap.lat,ap.lon)};
window.apRec=function(code){const zs=zoneScores().find(x=>x.z.n===apZoneName(code));if(zs&&recordRecFor(zs))toast("✔️ Yozib qoʻyildi: "+zs.z.n)};
