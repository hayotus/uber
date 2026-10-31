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
const EVENTS=[
{n:"Village Halloween Parade",place:"6th Ave, Greenwich Village",lat:40.7312,lon:-74.0000,start:"2026-10-31T19:00",end:"2026-10-31T23:30",surge:2.2},
{n:"NYC Marathon 2026",place:"5 borough boʻylab",lat:40.7720,lon:-73.9300,start:"2026-11-01T08:00",end:"2026-11-01T18:00",surge:1.8,note:"Koʻplab koʻchalar yopiladi — marshrutni oldindan rejalang"},
{n:"Broadway shoulari tugashi",place:"Times Square",lat:40.7590,lon:-73.9845,daily:[21.5,23.5],surge:1.5},
{n:"MSG tadbir kechalari",place:"Madison Square Garden",lat:40.7505,lon:-73.9934,surge:null,note:"Jadval oʻzgaruvchan — aniq vaqt yoʻq, ballga taʼsir qilmaydi"},
{n:"Barclays Center tadbirlari",place:"Atlantic Ave, Brooklyn",lat:40.6826,lon:-73.9754,surge:null,note:"Jadval oʻzgaruvchan — aniq vaqt yoʻq, ballga taʼsir qilmaydi"},
{n:"Radio City / Rockefeller",place:"6th Ave, Midtown",lat:40.7600,lon:-73.9800,surge:null,note:"Mavsumiy jadval — ballga taʼsir qilmaydi"}
];
const CLOSURES=[
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
const ASP_OFF=["2026-01-01","2026-01-19","2026-02-16","2026-05-25","2026-06-19","2026-07-03","2026-09-07","2026-10-12","2026-11-11","2026-11-26","2026-12-25"];

/* ================= State & Settings ================= */
const DEF_POS={lat:40.7580,lon:-73.9855}; /* Times Square — GPS kelguncha */
let pos=null, wxData=null, rainProb3h=0;
let ZD=null, zoneWx={}, adsb={}, lastRPH=null;
let settings={name:"",car:"Tesla Model Y",price:0.30,cons:0.28,maint:0.06,lang:"uz-UZ",theme:"dark",units:"mi",speed:"mph",refresh:10,notif:0,drive:0,weights:null,airports:["JFK","LGA","EWR"],zone:""};
try{const s=JSON.parse(localStorage.getItem("drv_settings")||"null");if(s)settings=Object.assign(settings,s)}catch(e){}
/* ================= IndexedDB (3-bosqich) ================= */
function idbOpen(){return new Promise((res,rej)=>{try{const rq=indexedDB.open("drvdb",1);rq.onupgradeneeded=()=>{rq.result.createObjectStore("kv")};rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)}catch(e){rej(e)}})}
function idbSet(k,v){return idbOpen().then(db=>new Promise((res,rej)=>{const tx=db.transaction("kv","readwrite");tx.objectStore("kv").put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)}))}
function idbGet(k){return idbOpen().then(db=>new Promise((res,rej)=>{const rq=db.transaction("kv").objectStore("kv").get(k);rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)}))}
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
const apiStat={weather:"tekshirilmagan",zones:"tekshirilmagan",adsb:"tekshirilmagan",overpass:"tekshirilmagan",rain:"tekshirilmagan",tiles:"Esri (kalitsiz)"};
let lastCalcAt=null;
function renderApiStat(){const el=$("apiStat");if(el)el.innerHTML="Open-Meteo (ob-havo): <b>"+esc(apiStat.weather)+"</b><br>TLC zones.json (tarixiy): <b>"+esc(apiStat.zones)+"</b><br>AirLabs (jonli reyslar): <b>"+esc(apiStat.adsb)+"</b><br>Overpass/OSM (joylar): <b>"+esc(apiStat.overpass)+"</b><br>RainViewer (radar): <b>"+esc(apiStat.rain)+"</b><br>Xarita tiles: <b>"+esc(apiStat.tiles)+"</b>"+(lastCalcAt?"<br>Smart Engine oxirgi hisob: <b>"+esc(lastCalcAt)+"</b>":"")}
function userLat(){return pos?pos.lat:DEF_POS.lat}
function userLon(){return pos?pos.lon:DEF_POS.lon}

/* ================= Smart Driver Intelligence (Modul 9) ================= */
/* zones.json — TLC HVFHS 2025-09 tarixiy naqsh (tools/build_zones.py) */
function isWE(){const d=nowNY().getDay();return d===0||d===6}
function zdata(name){if(!ZD)return null;return ZD.zones.find(z=>z.name===name)||null}
function patternRaw(z){const zd=zdata(z.n);if(!zd)return null;return (isWE()?zd.we:zd.wd)[nowNY().getHours()]}
function apZoneName(code){return code==="JFK"?"JFK Airport":code==="LGA"?"LaGuardia Airport":"Newark Airport (EWR)"}
function airportD(code){const zd=zdata(apZoneName(code));if(!zd||!ZD)return null;const raw=(isWE()?zd.we:zd.wd)[nowNY().getHours()];return Math.min(100,raw/ZD.meta.peakRef*100)}
function evWin(ev){const now=nowNY();
  if(ev.daily){const s=new Date(now);s.setHours(0,0,0,0);s.setMinutes(Math.round(ev.daily[0]*60));const e=new Date(now);e.setHours(0,0,0,0);e.setMinutes(Math.round(ev.daily[1]*60));return {s:s,e:e}}
  if(ev.start&&ev.end)return {s:new Date(ev.start),e:new Date(ev.end)};
  return null}
function evState(ev){const w=evWin(ev);if(!w)return "info";const now=nowNY();if(now>w.e)return "past";if(now>=new Date(w.s.getTime()-2*3600e3))return "active";return "later"}
function clActive(c){if(!c.start||!c.end)return false;const now=nowNY();return now>=new Date(c.start)&&now<=new Date(c.end)}
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
function zoneScores(){
  const peakRef=ZD?ZD.meta.peakRef:0;
  const apD={JFK:airportD("JFK"),LGA:airportD("LGA"),EWR:airportD("EWR")};
  return ZONES.map(z=>{
    const dist=hav(userLat(),userLon(),z.lat,z.lon);
    const raw=patternRaw(z);
    const D=(raw!=null&&peakRef)?Math.min(100,raw/peakRef*100):null;
    let F=0;
    if(z.ap){F=apD[z.ap]!=null?apD[z.ap]:0}
    else{AIRPORTS.forEach(ap=>{if(apD[ap.code]==null)return;const dd=hav(z.lat,z.lon,ap.lat,ap.lon);const v=apD[ap.code]*Math.max(0,1-dd/28);if(v>F)F=v})}
    let E=0;
    EVENTS.forEach(ev=>{if(!ev.surge)return;if(evState(ev)!=="active")return;const dd=hav(z.lat,z.lon,ev.lat,ev.lon);if(dd<1.9)E=Math.max(E,Math.min(100,(ev.surge-1)*110*(1-dd/2.2)))});
    const zwx=zoneWx[z.n];
    const wBase=(zwx!=null)?zwx:(wxData?rainProb3h:null);
    const sens=z.type==="nightlife"?0.55:z.type==="airport"?0.5:z.type==="office"?0.4:0.3;
    const W=(wBase!=null)?Math.max(15,Math.min(98,45+wBase*sens)):55;
    let T=88;
    CLOSURES.forEach(c=>{if(!clActive(c))return;const dd=hav(z.lat,z.lon,c.lat,c.lon);if(dd<c.radiusKm)T-=(SEVP[c.sev]||6)*(1-dd/c.radiusKm)});
    T=Math.max(5,Math.min(95,T));
    let P=Math.max(5,100-dist*7);if(settings.zone&&settings.zone===z.n)P=Math.min(100,P+6);
    let acc=0,wsum=0;
    const comps=[["D",D],["F",F],["E",E],["W",W],["T",T],["P",P]];
    comps.forEach(function(kv){if(kv[1]==null)return;acc+=effW()[kv[0]]*kv[1];wsum+=effW()[kv[0]]});
    const score=wsum?Math.round(acc/wsum):0;
    const etaMin=Math.max(2,Math.round(dist*3.2));
    return {z:z,dist:dist,score:score,D:D==null?null:Math.round(D),F:Math.round(F),E:Math.round(E),W:Math.round(W),T:Math.round(T),P:Math.round(P),raw:raw,etaMin:etaMin};
  }).sort((a,b)=>b.score-a.score);
}
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
  const hs=$("homeScore");if(hs)hs.textContent=bestPick.score;
  const hc2=$("homeConf");if(hc2)hc2.textContent=bestPick.conf+"%";
  const hsec=$("homeSecond");if(hsec&&sc[1])hsec.textContent=sc[1].z.n.replace(" Airport","");
  const hf=$("homeFresh");if(hf)hf.textContent="Yangilandi: "+lastCalcAt+" · Confidence "+bestPick.conf+"% ("+(pos?"GPS bor":"GPS yoʻq")+", "+(wxData?"ob-havo jonli":"ob-havo kutilmoqda")+", "+(ZD?"TLC tarixiy yuklangan":"TLC yuklanmagan")+")";
  renderAlerts();maybeNotify();applyDrive();
  const rs=[];
  if(bestPick.D>=70)rs.push("Tarixiy talab koʻrsatkichi yuqori ("+bestPick.D+")");
  if(bestPick.F>=60)rs.push("Reyslar oqimi kuchli — aeroport faktori "+bestPick.F);
  if(bestPick.E>=60)rs.push("Yaqin atrofda tadbir/surge ehtimoli ("+bestPick.E+")");
  if(rainProb3h>=40)rs.push("Yomgʻir ehtimoli yuqori ("+Math.round(rainProb3h)+"%) — talab oshishi mumkin");
  if(bestPick.dist<=3)rs.push("Hozirgi joydan borish qulay");
  if(!rs.length)rs.push("Balanslangan variant: talab va masofa uygʻunligi eng yaxshi");
  $("bestReasons").innerHTML="<b>Nima uchun bu joy?</b><br>• "+rs.map(esc).join("<br>• ");
  $("hotTop").innerHTML=sc.slice(0,5).map((s,i)=>'<div class="r" style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--line)"><span>'+(i+1)+". "+esc(s.z.n)+'</span><b class="mono">'+s.score+" · "+(s.raw!=null?Math.round(s.raw)+" pikap/s":"—")+"</b></div>").join("");
  renderHotList(sc);renderSmart(sc);renderEventsClosures();
}
/* Hotspot Ranking (Modul 10) */
function renderHotList(sc){
  const rph=lastRPH||realPerHour();
  $("hotList").innerHTML='<table><tr><th>#</th><th>Hudud</th><th>Talab</th><th>TLC pikap/soat</th><th>Masofa</th><th>Ball</th></tr>'+
  sc.map((s,i)=>"<tr><td>"+(i+1)+"</td><td>"+esc(s.z.n)+"</td><td>"+(s.D==null?"—":s.D)+"</td><td>"+(s.raw!=null?Math.round(s.raw):"—")+"</td><td>"+distTxt(s.dist)+"</td><td><b>"+s.score+"</b></td></tr>").join("")+"</table>"+
  "<div class='small'>TLC pikap/soat — tarixiy oʻrtacha (TLC HVFHS, 2025-09). Real $/soat (jurnalingiz): "+(rph?("<b>"+money(rph.v)+"/soat</b> ("+rph.n+" smena)"):"<b>maʼlumot yoʻq</b> — jurnalga smena qoʻshing")+".</div>";
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
function renderAirports(){
  const h=nowNY().getHours();
  $("apCards").innerHTML=AIRPORTS.map(ap=>{
    const a=adsb[ap.code];
    const zd=zdata(apZoneName(ap.code));
    const arr=zd?(isWE()?zd.we:zd.wd):null;
    const raw=arr?arr[h]:null;
    const peak=arr?Math.max.apply(null,arr):null;
    let live;
    if(a){
      live='<div class="big mono">'+a.total+' <span style="font-size:14px;color:var(--mut)">ta reys kelmoqda (jonli)</span></div>'+
      '<div class="small">Yaqin atrofda (≤50 mi): <b>'+a.low+'</b> · Yangilandi: '+new Date(a.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})+'</div>'+
      (a.list.length?'<div class="small">Eng yaqin reyslar:<br>'+a.list.map(x=>esc(x.f||"—")+" · "+(x.alt!=null?Math.round(x.alt)+" ft":"—")+" · "+distTxt(x.d)).join("<br>")+'</div>':"");
    } else {
      live='<div class="med">Jonli maʼlumot hali yoʻq</div><div class="small">AirLabs soʻrovi kutilmoqda yoki javob bermadi — tarixiy naqsh pastda.</div>';
    }
    return '<div class="card"><h3>✈️ '+ap.code+" — "+esc(ap.name)+'</h3>'+
    '<div class="small" style="margin-bottom:4px"><span class="badge b-live">LIVE</span> AirLabs — jonli reyslar (Radar loyihasidagi manba)</div>'+live+
    '<div class="small" style="margin-top:8px"><span class="badge b-hist">HISTORICAL</span> TLC 2025-09: hozirgi soatda oʻrtacha '+(raw!=null?("<b>"+Math.round(raw)+" pikap</b>/soat"):"—")+" · kun pik: "+(peak!=null?Math.round(peak):"—")+" pikap/soat</div>"+
    '<div class="small">'+esc(ap.term)+'</div>'+
    '<button class="go" onclick="gmaps('+ap.lat+","+ap.lon+')">📍 Google Maps — aeroportga</button>'+
    '<div class="src">Uber ichki navbati/surge ochiq emas — bu yerda faqat ochiq manbalar: AirLabs jonli reyslar va TLC tarixi. Navbat/kutish raqamlari uydirilmaydi.</div></div>';
  }).join("");
  drawFlights(curAp);
  const ha=$("homeAirports");
  if(ha)ha.innerHTML=AIRPORTS.filter(ap=>settings.airports.indexOf(ap.code)>=0).map(ap=>{
    const a=adsb[ap.code];const zd=zdata(apZoneName(ap.code));const raw=zd?(isWE()?zd.we:zd.wd)[h]:null;
    return "<b>"+ap.code+"</b>: "+(a?("jonli "+a.total+" reys kelmoqda · yaqinda "+a.low):"jonli maʼlumot yoʻq")+" · tarixiy oqim "+(raw!=null?Math.round(raw)+" pikap/soat":"—");
  }).join("<br>")||"Sozlamalarda aeroport tanlanmagan";
}
function drawFlights(code){
  const zd=zdata(apZoneName(code));
  const cv=$("flightChart");if(!cv)return;const ctx=cv.getContext("2d");const W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  if(!zd){$("flightNote").textContent="TLC maʼlumoti (zones.json) hali yuklanmadi.";return}
  const arr=isWE()?zd.we:zd.wd;const h=nowNY().getHours();const hrs=[];
  for(let i=0;i<6;i++)hrs.push({h:(h+i)%24,v:arr[(h+i)%24]});
  const mx=Math.max.apply(null,hrs.map(x=>x.v))*1.15||1;const bw=W/hrs.length;
  hrs.forEach((x,i)=>{
    const bh=(H-34)*(x.v/mx);
    ctx.fillStyle=i===0?"#22c55e":"#3b82f6";
    ctx.fillRect(i*bw+10,H-22-bh,bw-20,bh);
    ctx.fillStyle=inkF();ctx.font="bold 12px sans-serif";ctx.textAlign="center";
    ctx.fillText(Math.round(x.v),i*bw+bw/2,H-28-bh);
    ctx.fillStyle="#6f7278";ctx.font="11px sans-serif";
    ctx.fillText(String(x.h).padStart(2,"0")+":00",i*bw+bw/2,H-6);
  });
  const peak=hrs.reduce((a,b)=>b.v>a.v?b:a);
  $("flightNote").textContent=code+": keyingi 6 soatda eng kuchli oqim ≈ "+String(peak.h).padStart(2,"0")+":00 ("+Math.round(peak.v)+" pikap/soat, TLC tarixiy oʻrtacha). Bu — kelgan yoʻlovchilarning aeroportdan chiqish oqimi proksi; reyslar jadvali emas.";
}
/* ================= Maʼlumot yuklagichlar (TLC / zona ob-havo / AirLabs) ================= */
function loadZones(){
  fetchT("zones.json",9000).then(r=>r.json()).then(j=>{ZD=j;apiStat.zones="OK · TLC HVFHS 2025-09 ("+j.zones.length+" zona)";renderApiStat();renderHome();renderAirports()})
  .catch(()=>{apiStat.zones="XATO — zones.json yuklanmadi (talab: maʼlumot yoʻq)";renderApiStat()});
}
function loadZoneWx(){
  const lats=ZONES.map(z=>z.lat).join(","),lons=ZONES.map(z=>z.lon).join(",");
  const u="https://api.open-meteo.com/v1/forecast?latitude="+lats+"&longitude="+lons+"&hourly=precipitation_probability&forecast_days=1&timezone=America%2FNew_York";
  fetchT(u,12000).then(r=>r.json()).then(j=>{
    const arr=Array.isArray(j)?j:[j];const h=nowNY().getHours();
    arr.forEach((w,i)=>{if(!ZONES[i]||!w||!w.hourly||!w.hourly.precipitation_probability)return;const pp=w.hourly.precipitation_probability;zoneWx[ZONES[i].n]=Math.max(pp[h]||0,pp[h+1]||0,pp[h+2]||0)});
    renderHome();
  }).catch(()=>{});
}
function loadLiveFlights(force){
  const now=Date.now();
  if(!force&&now-liveTs<600000)return;
  liveTs=now;
  fetchT("https://airlabs.co/api/v9/flights?api_key="+AIRLABS_KEY,15000).then(r=>r.json()).then(j=>{
    const fl=(j&&j.response)||[];
    AIRPORTS.forEach(ap=>{
      const enr=fl.filter(f=>f.arr_iata===ap.code&&(f.status==="en-route"||f.status==="active")&&typeof f.lat==="number"&&typeof f.lng==="number");
      const list=enr.map(f=>({f:f.flight_iata||"—",alt:(typeof f.alt==="number"?f.alt:null),d:hav(ap.lat,ap.lon,f.lat,f.lng)})).sort((a,b)=>a.d-b.d);
      const near=list.filter(x=>x.d<=50).length;
      adsb[ap.code]={ts:now,total:enr.length,low:near,list:list.slice(0,5)};
    });
    apiStat.adsb="OK · "+nowNY().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    renderApiStat();renderAirports();
  }).catch(()=>{apiStat.adsb="XATO — AirLabs javob bermadi";renderApiStat()});
}
let liveTs=0;

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
function tiles(){return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",{attribution:"Esri, OpenStreetMap",maxZoom:18})}
function heatCircles(target){
  const g=L.layerGroup();const sc=zoneScores();
  sc.forEach(s=>{const col=s.D==null?"#9ca3af":s.D>=75?"#ef4444":s.D>=50?"#f5b301":"#22c55e";
    L.circle([s.z.lat,s.z.lon],{radius:500+(s.D||0)*14,color:col,weight:1,fillColor:col,fillOpacity:.32}).addTo(g)
     .bindPopup("<b>"+esc(s.z.n)+"</b><br>Talab (tarixiy): "+(s.D==null?"\u2014":s.D)+"/100<br>Ball: "+s.score+(s.raw!=null?" \u00b7 TLC: "+Math.round(s.raw)+" pikap/soat":""));});
  return g;
}
function initMaps(){
  if(map)return;
  map=L.map("map").setView([userLat(),userLon()],12);tiles().addTo(map);
  heatLayer=heatCircles(map);heatLayer.addTo(map);layerGroups.heat=heatLayer;
  layerGroups.cam=L.layerGroup();layerGroups.ev=L.layerGroup();layerGroups.wc=L.layerGroup();layerGroups.close=L.layerGroup();
  CAMS_FB.forEach(c=>L.marker([c.lat,c.lon]).addTo(layerGroups.cam).bindPopup("📷 Kamera — "+esc(c.n)+"<br><span>Taxminiy nuqta — OSM tekshiruvi 3-bosqichda</span>"));
  CLOSURES.forEach(c=>{ if(c.lat)L.marker([c.lat,c.lon]).addTo(layerGroups.close).bindPopup("🚧 "+esc(c.n)+(clActive(c)?" (FAOL)":""))});
  userMk=L.marker([userLat(),userLon()]).addTo(map).bindPopup("Siz");
  mapHome=L.map("mapHome",{scrollWheelZoom:false}).setView([userLat(),userLon()],11);tiles().addTo(mapHome);
  heatHome=heatCircles(mapHome);heatHome.addTo(mapHome);
  userMkH=L.marker([userLat(),userLon()]).addTo(mapHome);
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
  if(name==="ev"&&on)refreshEV(false);
  if(name==="wc"&&on)refreshWC(false);
}

/* ================= OSM jonli roʻyxatlar (fallback bilan) ================= */
function distSort(a){return a.map(x=>Object.assign({},x,{d:hav(userLat(),userLon(),x.lat,x.lon)})).sort((x,y)=>x.d-y.d)}
function listHTML(items,icon){
  return items.slice(0,10).map(x=>'<li><div class="r"><div><b>'+icon+" "+esc(x.n)+'</b><div class="small">'+distTxt(x.d)+' uzoqlikda</div></div><button onclick="gmaps('+x.lat+","+x.lon+')">GO</button></div></li>').join("")||'<li class="small">Yaqin atrofda topilmadi</li>';
}
function overpass(q){
  const opt={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)};
  return fetchT("https://overpass-api.de/api/interpreter",12000,opt).then(r=>r.json())
   .catch(()=>fetchT("https://overpass.kumi.systems/api/interpreter",12000,opt).then(r=>r.json()));
}
function refreshWC(notify=true){
  const q='[out:json][timeout:10];node["amenity"="toilets"](around:9000,'+userLat()+","+userLon()+");out 40;";
  overpass(q).then(j=>{
    const items=j.elements.filter(e=>e.lat).map(e=>({n:(e.tags&&(e.tags.name||e.tags.operator))||"Jamoat hojatxonasi",lat:e.lat,lon:e.lon}));
    if(items.length){apiStat.overpass="OK";$("wcList").innerHTML=listHTML(distSort(items),"🚻");if(notify)toast("Hojatxonalar yangilandi (OSM)");return}
    throw new Error("empty");
  }).catch(()=>{ $("wcList").innerHTML=listHTML(distSort(WC_FB),"🚻"); if(notify)toast("Jonli OSM ishlamadi — zaxira roʻyxat"); });
}
function refreshEV(notify=true){
  const q='[out:json][timeout:10];node["amenity"="charging_station"](around:26000,'+userLat()+","+userLon()+");out 60;";
  overpass(q).then(j=>{
    const items=j.elements.filter(e=>e.lat).map(e=>{const t=e.tags||{};const tesla=/tesla/i.test((t.brand||"")+" "+(t.operator||"")+" "+(t.name||""));return {n:(t.name||t.operator||t.brand||"Zaryadlash stansiyasi")+(tesla?" ⚡Tesla":""),lat:e.lat,lon:e.lon}});
    if(items.length){apiStat.overpass="OK";$("evList").innerHTML=listHTML(distSort(items),"⚡");if(notify)toast("Zaryadlash stansiyalari yangilandi (OSM)");return}
    throw new Error("empty");
  }).catch(()=>{ $("evList").innerHTML=listHTML(distSort(EV_FB),"⚡")+'<div class="small">Zaxira roʻyxat — aniq manzil/quvvatni Tesla ilovasida tekshiring.</div>'; if(notify)toast("Jonli OSM ishlamadi — zaxira roʻyxat"); });
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
function renderCams(){ refreshCam(false); }
function renderEventsClosures(){
  const fmtD=d=>d.toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  const evs=EVENTS.map(ev=>({ev:ev,st:evState(ev),w:evWin(ev)})).filter(x=>x.st!=="past");
  $("eventList").innerHTML=evs.map(x=>{const ev=x.ev;
    const stTxt=x.st==="active"?'<span class="hi">FAOL</span>':x.st==="later"?'<span class="med">KEYINROQ</span>':'<span class="med">INFO</span>';
    const when=x.w?(fmtD(x.w.s)+" → "+fmtD(x.w.e)):"aniq vaqt yoʻq";
    return '<li><div class="r"><div><b>'+esc(ev.n)+'</b><div class="small">'+esc(ev.place)+" · "+esc(when)+'</div>'+(ev.note?'<div class="small">'+esc(ev.note)+'</div>':'')+'</div><div style="text-align:right">'+stTxt+(ev.surge?'<div class="med mono">×'+ev.surge+'</div>':'')+'</div></div></li>';
  }).join("")||'<li class="small">Yaqin tadbirlar yoʻq.</li>';
  $("closeList").innerHTML=CLOSURES.map(c=>{const act=clActive(c);
    const when=c.start?(fmtD(new Date(c.start))+" → "+fmtD(new Date(c.end))):"muddat aniqlanmagan — ballga taʼsir qilmaydi";
    return '<li><div class="r"><div><b>'+esc(c.n)+'</b><div class="small">'+esc(c.place)+" · "+esc(when)+'</div></div><span class="'+(c.sev==="Yuqori"?"hi":c.sev==="Oʻrtacha"?"med":"low")+'">'+(act?"FAOL · ":"")+esc(c.sev)+'</span></div></li>'}).join("")+
   '<li class="small">Rasmiy tekshiruv: <a href="https://www.nyc.gov/dot" style="color:var(--blu)">nyc.gov/dot</a> va 511NY ilovasi.</li>';
}

function renderParking(){
  const t=nowNY();const ds=t.toISOString().slice(0,10);const dow=t.getDay();
  const off=ASP_OFF.indexOf(ds)>=0;
  const asp=dow===0?"Yakshanba — koʻpchilik ASP qoidalari amal qilmaydi":off?"Bugun bayram — ASP (Alternate Side Parking) toʻxtatilgan, meterlar ham odatda ishlamaydi":"Bugun ASP qoidalari AMALDA — koʻcha belgisidagi vaqtga qarang";
  $("parkBox").innerHTML='<div class="mid">'+esc(asp)+'</div><div class="small" style="margin-top:6px">Meter: odatda 1 soatlik cheklov zonalarga qarab farq qiladi; yakshanba meter bepul (koʻpchilik joylarda). Belgilar va qoidalar koʻrsatiladi, boʻsh joy real vaqtda kafolatlanmaydi.</div>';
  $("garageList").innerHTML=listHTML(distSort(GARAGES),"🅿️");
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
  const sorted=[].concat(journal).sort((a,b)=>b.date<a.date?-1:1).filter(e=>{if(!fDays)return true;const d=new Date(e.date+"T12:00:00");return (nowNY()-d)<=fDays*864e5});
  $("jList").innerHTML=sorted.map(e=>{const net=netOf(e.gross,e.miles,e.exp);
    return '<li><div class="r"><div><b>'+esc(e.date)+'</b> · <span class="mono">'+money(e.gross)+'</span><div class="small">'+e.hours+' soat · '+distTxt(e.miles)+' · sof: <b>'+money(net)+'</b>'+(e.zone?" · 📍"+esc(e.zone):"")+(e.startHour!=null?" · ▶ "+String(e.startHour).padStart(2,"0")+":00":"")+(e.note?" · "+esc(e.note):"")+'</div></div><div><button class="del" data-edit="'+e.id+'" title="Tahrirlash" style="color:var(--blu)">✏️</button><button class="del" data-del="'+e.id+'" title="O\u02bbchirish">✕</button></div></div></li>'}).join("")||'<li class="small">Bu filtrda yozuv yo\u02bbq.</li>';
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{journal=journal.filter(x=>x.id!=b.getAttribute("data-del"));saveJournal();renderJournal();toast("Yozuv oʻchirildi")}));
  document.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>{
    const e=journal.find(x=>x.id==b.getAttribute("data-edit"));if(!e)return;
    editingId=e.id;$("jDate").value=e.date;$("jGross").value=e.gross;$("jHours").value=e.hours;$("jMiles").value=e.miles;$("jExp").value=e.exp;$("jZone").value=e.zone||"";$("jHour").value=e.startHour==null?"":String(e.startHour);$("jNote").value=e.note||"";
    $("jAdd").textContent="Yangilash (tahrir saqlansin)";window.scrollTo(0,0);toast("Tahrirlash rejimi — oʻzgartirib Saqlang");
  }));
}
$("jAdd").addEventListener("click",()=>{
  const e={id:editingId||Date.now(),date:$("jDate").value||dayStr(nowNY()),gross:parseFloat($("jGross").value)||0,hours:parseFloat($("jHours").value)||0,miles:parseFloat($("jMiles").value)||0,exp:parseFloat($("jExp").value)||0,zone:$("jZone").value||"",startHour:$("jHour").value===""?null:parseInt($("jHour").value,10),note:$("jNote").value.trim()};
  if(!e.gross&&!e.miles){toast("Kamida tushum yoki mil kiriting");return}
  if(editingId){const i=journal.findIndex(x=>x.id===editingId);if(i>=0)journal[i]=e;editingId=null;$("jAdd").textContent="Saqlash";toast("Yozuv yangilandi ✔")}
  else{journal.push(e);toast("Smena saqlandi ✔")}
  saveJournal();renderJournal();renderHome();renderCal();
  $("jGross").value=$("jHours").value=$("jMiles").value=$("jExp").value=$("jNote").value="";$("jZone").value="";$("jHour").value="";
});
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
function renderAlerts(){
  const el=$("alertList");if(!el)return;
  const items=[];
  CLOSURES.forEach(c=>{if(clActive(c))items.push({sev:c.sev||"Past",txt:"🚧 <b>"+esc(c.n)+"</b> — "+esc(c.place||"")})});
  EVENTS.forEach(ev=>{if(evState(ev)==="active")items.push({sev:"Tadbir",txt:"📅 <b>"+esc(ev.n)+"</b> — "+esc(ev.place||"")+" (hozir faol davr)"})});
  el.innerHTML=items.length?items.map(i=>'<div class="alertItem"><b>'+esc(i.sev)+'</b> · '+i.txt+'</div>').join(""):"Faol ogohlantirishlar yoʻq ✔";
  const av=$("alertVal");if(av)av.textContent=items.length?(items.length+" faol"):"Xavf yoʻq";
}
let notifSeen={};
function maybeNotify(){
  if(!settings.notif)return;
  const hk=nowNY().getHours();
  if(typeof rainProb3h==="number"&&rainProb3h>=70&&notifSeen.rain!==hk){notifSeen.rain=hk;toast("⚠️ Yomgʻir ehtimoli yuqori: "+Math.round(rainProb3h)+"% — talab oshishi mumkin")}
  CLOSURES.forEach((c,i)=>{if(clActive(c)&&c.sev==="Yuqori"&&notifSeen["c"+i]!==hk){notifSeen["c"+i]=hk;toast("🚧 Faol yopilish (yuqori): "+c.n)}});
}
function applyDrive(){document.body.classList.toggle("drive",!!settings.drive);const ds=$("driveState");if(ds)ds.textContent=settings.drive?"Yoniq":"Oʻchiq"}
function refreshHeat(){try{
  if(map&&heatLayer){map.removeLayer(heatLayer);heatLayer=heatCircles(map);heatLayer.addTo(map);if(typeof layerGroups!=="undefined")layerGroups.heat=heatLayer}
  if(mapHome&&heatHome){mapHome.removeLayer(heatHome);heatHome=heatCircles(mapHome);heatHome.addTo(mapHome)}
}catch(e){}}
{const db=$("driveBtn");if(db)db.addEventListener("click",()=>{settings.drive=!settings.drive;saveSettings();applyDrive();toast(settings.drive?"🚗 Haydash rejimi yoniq":"Haydash rejimi oʻchiq")});
const hm=$("homeMore");if(hm)hm.addEventListener("toggle",()=>{if(hm.open&&mapHome)setTimeout(()=>{try{mapHome.invalidateSize()}catch(e){}},80)});
let lastHour=null;
setInterval(()=>{const h=nowNY().getHours();if(lastHour===null){lastHour=h;return}if(h!==lastHour){lastHour=h;renderHome();refreshHeat()}},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)renderHome()});}

/* ================= Navigation & Geo ================= */
function go(view,modId){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("act"));
  $("view-"+view).classList.add("act");
  document.querySelectorAll("[data-nav]").forEach(b=>b.classList.toggle("on",b.getAttribute("data-nav")===view));
  if(view==="map"){initMaps();setTimeout(()=>{map.invalidateSize();map.setView([userLat(),userLon()],12)},80)}
  if(view==="airports"){loadLiveFlights(false);renderAirports()}
  if(view==="analytics")renderAnalytics();
  if(view==="settings")renderApiStat();
  if(modId){const d=$(modId);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({behavior:"smooth"}),60)}}
  window.scrollTo(0,0);
}
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>go(b.getAttribute("data-nav"))));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.getAttribute("data-go"),b.getAttribute("data-mod")||undefined)));
document.querySelectorAll("#layerChips .chip").forEach(ch=>ch.addEventListener("click",()=>{ch.classList.toggle("on");toggleLayer(ch.getAttribute("data-layer"),ch.classList.contains("on"))}));
document.querySelectorAll("#apTabs .chip").forEach(ch=>ch.addEventListener("click",()=>{document.querySelectorAll("#apTabs .chip").forEach(x=>x.classList.remove("on"));ch.classList.add("on");curAp=ch.getAttribute("data-ap");drawFlights(curAp)}));
let recs=[];try{recs=JSON.parse(localStorage.getItem("drv_recs")||"[]")}catch(e){recs=[]}
function recordRec(){if(!bestPick)return false;recs.unshift({t:new Date().toISOString(),zone:bestPick.z.n,score:bestPick.score,conf:bestPick.conf||null,c:{D:bestPick.D,F:bestPick.F,E:bestPick.E,W:bestPick.W,T:bestPick.T,P:bestPick.P}});recs=recs.slice(0,50);try{localStorage.setItem("drv_recs",JSON.stringify(recs));idbMirror()}catch(e){}renderCal();return true}
$("bestGo").addEventListener("click",()=>{if(recordRec())gmaps(bestPick.z.lat,bestPick.z.lon)});
{const ro=$("recOnly");if(ro)ro.addEventListener("click",()=>{if(recordRec())toast("✔️ Tavsiya yozib qoʻyildi — kalibrlash uchun")});}
$("tileBestBtn").addEventListener("click",()=>{const b=$("bestCard");if(b)b.scrollIntoView({behavior:"smooth"})});
$("camMapBtn").addEventListener("click",()=>{go("map");const ch=document.querySelector('[data-layer="cam"]');if(ch&&!ch.classList.contains("on"))ch.click()});
$("wcRefresh").addEventListener("click",()=>refreshWC(true));
$("evRefresh").addEventListener("click",()=>refreshEV(true));
function tickClock(){const t=nowNY();const hc=$("heroClock");if(hc)hc.textContent=t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});const hd=$("heroDate");if(hd)hd.textContent="New York City · Live overview · "+t.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
if(navigator.geolocation){
  navigator.geolocation.watchPosition(p=>{
    pos={lat:p.coords.latitude,lon:p.coords.longitude};
    renderHome();
    if(map){map.setView([pos.lat,pos.lon],12);if(userMk)userMk.setLatLng([pos.lat,pos.lon])}
    if(mapHome){mapHome.setView([pos.lat,pos.lon],11);if(userMkH)userMkH.setLatLng([pos.lat,pos.lon])}
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
  saveSettings();applyTheme();armWx();renderHome();renderAirports();renderJournal();renderApiStat();
  toast("Sozlamalar saqlandi ✔");
});
$("sExport").addEventListener("click",()=>{
  const data=JSON.stringify({settings:settings,journal:journal,recommendations:recs},null,1);
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download="driver-dashboard-export.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
});
$("sWipe").addEventListener("click",()=>{if(confirm("Barcha lokal maʼlumot (jurnal, sozlamalar, tavsiyalar) oʻchirilsinmi?")){localStorage.removeItem("drv_journal");localStorage.removeItem("drv_settings");localStorage.removeItem("drv_recs");location.reload()}});
$("sReset").addEventListener("click",()=>{if(confirm("Sozlamalar standart qiymatlarga qaytarilsinmi? (Jurnal saqlanadi)")){localStorage.removeItem("drv_settings");location.reload()}});

/* ================= Online/Offline ================= */
function setOnline(){const pl=$("livePill");if(!pl)return;if(navigator.onLine){pl.innerHTML="<i></i>LIVE";pl.style.color="var(--grn)";pl.style.borderColor="rgba(34,197,94,.4)"}else{pl.innerHTML="<i></i>OFFLINE";pl.style.color="var(--red)";pl.style.borderColor="var(--red)"}}
window.addEventListener("online",()=>{setOnline();toast("Internet qaytdi — maʼlumot yangilanadi");loadWeather()});
window.addEventListener("offline",()=>{setOnline();toast("Offline — keshdagi maʼlumot koʻrsatiladi; jonli maʼlumot eskirgan boʻlishi mumkin")});
let wxTimer=null;function armWx(){if(wxTimer)clearInterval(wxTimer);wxTimer=setInterval(loadWeather,(settings.refresh||10)*60000)}

/* ================= Init ================= */
$("jDate").value=dayStr(nowNY());
{const jz=$("jZone");if(jz)jz.innerHTML='<option value="">— belgilanmagan —</option>'+ZONES.map(z=>'<option value="'+esc(z.n)+'">'+esc(z.n)+'</option>').join("");
const jh=$("jHour");if(jh)jh.innerHTML='<option value="">—</option>'+Array.from({length:24},(_,i)=>'<option value="'+i+'">'+String(i).padStart(2,"0")+":00</option>").join("");}
applyTheme();fillSettings();setOnline();
tickClock();setInterval(tickClock,30000);
renderEventsClosures();renderParking();renderCams();
$("wcList").innerHTML=listHTML(distSort(WC_FB),"🚻");
$("evList").innerHTML=listHTML(distSort(EV_FB),"⚡");
renderJournal();renderHome();renderAirports();initMaps();
loadZones();loadZoneWx();loadLiveFlights(true);
loadWeather();armWx();
setInterval(()=>loadLiveFlights(false),600000);setInterval(idbMirror,60000);idbRestore();setInterval(loadZoneWx,1800000);
refreshWC(false);refreshEV(false);
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}

/* Fayl ajratilgach (3-bosqich): generatsiya qilingan HTML dagi inline onclick uchun */
window.gmaps=gmaps;
