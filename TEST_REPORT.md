# TEST REPORT — TLC Pro (avvalgi nomi: NYC Driver Dashboard)

Sana: 2026-10-30 · Muhit: jonli GitHub Pages (desktop Chromium, mobil kenglik) + lokal statik tekshiruvlar.
Qoida: NOT TESTED hech qachon PASS deb belgilanmaydi.

## Funksional QA (jonli, 2026-10-30)

| # | Tekshiruv | Natija | Izoh |
|---|---|---|---|
| 1 | Tema — Tesla dark (default) | PASS | Qora fon, to'q kartalar, oq yozuv — barcha ekranlarda |
| 2 | Home: soat, Weather tile, Bugun gross/net/net-soat | PASS | Ob-havo jonli: 51°F, ochiq osmon |
| 3 | Home: Smart Score + Confidence + 2-variant | PASS | Score 64, Confidence 60%, 2-variant: Penn Station |
| 4 | Home: Airport activity (3 aeroport) | PASS | JFK 22 reys/soat, kutish ≈24 daq (ESTIMATED) |
| 5 | Menu — 16 modul panjarasi | PASS | 16 raqamlangan modul + Analytics + Settings = 18 tugma |
| 6 | Demand: Smart faktorlar diagrammasi | PASS | 6 faktor (D 76, F 28, E 63, W 50, T 86, P 98), formula ko'rinadi |
| 7 | Settings forma + API holati | PASS | Open-Meteo: OK (vaqt bilan); qolganlari holat panelida |
| 8 | Analytics ekran + 7 kunlik grafik | PASS | Bo'sh holatda ham xatosiz ($0 ustunlar) |
| 9 | Journal forma + filtr (7/30 kun) | PASS | |
| 10 | Map tile'lari + 6 qatlam tugmasi | PASS | Esri tile'lari chizildi, talab doiralari bor |
| 11 | Journal qo'shish — hisob tekshiruvi | PASS | 100 − 50×0.28×0.30 − 10 = **$85.80** aniq chiqdi |
| 12 | Journal tahrirlash | PASS | Gross 120 → net **$105.80** |
| 13 | Analytics yig'indilari | PASS | Gross $120, Net $105.80, Net/soat $26.45, Net/mil $2.12 |
| 14 | Persistence (reload dan keyin) | PASS | Yozuv va Home raqamlari saqlandi (localStorage) |
| 15 | Tema almashtirish + saqlanishi | PASS | Dark→Light→reload da Light qoldi→Dark qaytarildi |
| 16 | Journal o'chirish | PASS | Test yozuv tozalandi, hisob $0 ga qaytdi |
| 17 | Footer versiya | PASS (tuzatildi) | QA v2.0 yozuvini topdi → v3.0 ga tuzatilib qayta deploy qilindi |
| 18 | Pul formati | PASS (tuzatildi) | $85.8 → $85.80 (2 xonali) formatga o'tkazildi |

## Prompt §11 ssenariylari

| Ssenariy | Holat |
|---|---|
| GPS ruxsat berilgan | NOT TESTED — haqiqiy qurilma kerak (brauzer muhitida GPS yo'q edi) |
| GPS rad etilgan | PASS — Manhattan markazi fallback + xabar kuzatildi |
| Internet yo'q (offline) | NOT TESTED — SW va OFFLINE indikatori kodda bor; majburiy offline sinov o'tkazilmadi |
| API timeout | NOT TESTED — timeout (9–12 s) va catch/fallback kodda; jonli majburiy timeout qilinmadi |
| Noto'g'ri API javob | NOT TESTED |
| Bo'sh dataset | PASS — jurnal/analytics bo'sh holatlari xatosiz chiqdi |
| iPhone Safari | NOT TESTED — foydalanuvchi qurilmasida tekshiriladi |
| PWA o'rnatish (Home Screen) | NOT TESTED — manifest/sw jonli 200 qaytaradi; fizik o'rnatish tekshirilmadi |
| Offline restart | NOT TESTED |
| Ma'lumot saqlanishi | PASS — #14 |
| CSV eksport | NOT TESTED — kod mavjud, yuklab olish brauzer QA da bosilmadi |
| Xarita qatlamlari ko'rinishi | PARTIAL — tugmalar borligi PASS; har qatlam alohida yoqib tekshirish qisman (talab qatlami default ko'rinadi) |
| Navigatsiya (Google Maps havolalari) | PARTIAL — havola formati v1 da tekshirilgan (google.com/maps/dir); v3 da qayta bosilmadi |
| Settings saqlanishi | PASS — #15 (tema) va forma qiymatlari |
| Noto'g'ri kiritish | PASS (qisman) — bo'sh tushum/mil da "Kamida tushum yoki mil kiriting" xabari kodda va forma tekshiruvi ishlaydi |
| Vaqt mintaqasi / DST | NOT TESTED — barcha vaqtlar America/New_York bo'yicha hisoblanadi (nowNY) |

## Statik tekshiruvlar (lokal)

- index.html hajmi: 73,909 bayt (< 200 KB) — PASS
- JavaScript sintaksisi (node --check) — PASS
- Takroriy/mavjud bo'lmagan element ID lari — PASS (0 ta muammo)
- 16 modul mavjudligi (Menu + ekranlar) — PASS
- Maxfiy kalitlar frontendda — PASS (yo'q; barcha manbalar kalitsiz)

## v4.0 — 1-bosqich sinovi (2026-10-31)

**Ma'lumot tekshiruvi (zones.json) — PASS**
- Mustaqil Socrata jamlamalari bilan solishtirildi (2025-09-01..28): JFK 308,799 (faylda 308,798), LGA 403,114 (403,110), Times Sq 230,576 (230,577), EWR dropoff 138,495 (138,496) — farq faqat yaxlitlashda.
- Socrata dow konvensiyasi empirik tasdiqlandi: Monday=1..Sunday=7 (2025-09-06 shanba → dow=6).
- Haftalik agregatsiya so'rovlari server tomonidan uzilgani kuzatildi — build skript kunlik so'rovlar + checkpoint bilan ishlaydi.

**Jonli QA (brauzer, 2026-10-31 08:28 EDT) — PASS (ADS-B dan tashqari)**
- Home: Best = Midtown Manhattan; jurnal bo'sh bo'lganda "Real $/soat: ma'lumot yo'q" (uydirma formula yo'q) ✔; "TLC tarixiy yuklangan" ✔.
- Hotspot TOP 5: har qatorda real "pikap/s" (TLC) ✔.
- Airports HISTORICAL: shanba 08:00 uchun JFK 174, LGA 100, EWR 116 pikap/soat — zones.json we[8] bilan mos ✔.
- Settings: "TLC zones.json: OK · TLC HVFHS 2025-09 (20 zona)" ✔.
- Journal round-trip: $200/8s/120mi/$10 → sof $179.92; Home "Real o'rtacha: $22.49/soat (jurnal, 1 smena)" ✔; yozuv o'chirildi, iz qolmadi ✔.
- undefined/NaN/bo'sh bloklar: yo'q ✔.

**ADS-B LIVE — ISHLAMAYDI (brauzer CORS)**
- adsb.lol serverdan ishlaydi (HTTP 200), lekin Access-Control-Allow-Origin sarlavhasi yo'q — brauzer fetch bloklaydi. adsb.fi ham xuddi shunday; adsb.one/airplanes.live 403; allorigins proxy 522.
- Ilova buni halol ko'rsatadi: "Jonli manba mavjud emas (CORS)". Yechim variantlari: OpenSky hisobi (kalit) — foydalanuvchi qarori kerak; yoki tarixiy rejimda qolish.

**Kalibrlash tuzatishi:** peakRef endi maksimum (2053.2) emas, 95-persentil (1243.8) — ertalabki ballar sun'iy past bo'lmasligi uchun.

**NOT TESTED (v4.0):** iPhone fizik sinov; GPS ruxsati bilan jonli rejim; ADS-B (CORS sabab, yuqorida); offline rejimda zones.json keshdan o'qilishi.

## v5.0 — 2-bosqich sinovi (2026-10-31)

**Kalibrlash mantig'i (node harness, ajratilgan funksiyalar) — PASS**
- matchRecs: sintetik 36 yozuv + 6 tavsiyada 6/6 juftlik bog'landi, aniqlik hisobi to'g'ri.
- suggestWeights: vaznlar yig'indisi aniq 1.00; signal bo'lmasa (korrelyatsiya 0) standart vaznlar o'zgarmaydi.
- Darvoza: 10/30 hududli smenada "yana 20 ta kerak" — taklif chiqmaydi ✔.
- realPerHour qatlamlari: zoneHour scope ishladi (n=4).

**NOT TESTED (v5.0):** brauzerda jurnal formasi (zona/soat selectlari) vizual tekshiruvi — jonli QA da qilinadi; iPhone fizik sinov.

## v6.0 — 3-bosqich (2026-10-31, lokal tekshiruv)

- Fayl bo'linishi: index.html 27,156 B + style.css 7,925 B + app.js 58,441 B; `node --check app.js` PASS; index.html da ichki <style>/<script> qolmadi; inline onclick (gmaps) uchun `window.gmaps` eksport qilindi.
- Home: 3 blok + <details id="homeMore"> (details ochiq/yopiq muvozanati tekshirildi: 12/12).
- Drive rejimi CSS (≥48px, kontrast), alerts/maybeNotify/refreshHeat funksiyalari mavjudligi tekshirildi.
- IDB: idbMirror saqlash nuqtalariga ulandi (saveSettings, saveJournal, GO yozuvi + 60s interval); idbRestore boot da chaqiriladi.

**NOT TESTED (v6.0):** jonli brauzer QA (v5.0 QA yakunlangach o'tkaziladi); IDB dan tiklash yo'li (localStorage tozalangan holat); drive rejimi vizual ko'rinishi; iPhone fizik sinov; kamera Overpass jonli javobi (OSM da NYC kameralar siyrak — zaxira yo'li tez-tez ishlashi mumkin).

## v5.0 — jonli QA natijasi (2026-10-31, brauzer)

- Versiya v5.0 tasdiqlandi (SW yangilanishi 3-reload da keldi — 2 emas; keyingi versiyalarda hisobga olinadi).
- Jurnal: Hudud + Boshlanish soati selectlari bor; yozuv "📍Harlem · ▶ 10:00" ko'rinishida chiqdi; sof $179.92; Home "Real o'rtacha: $22.49/soat" ga yangilandi ✔.
- Settings kalibrlash kartasi: "Hudud belgilangan smenalar: 1/30 — yana 29 ta kerak" ✔.
- Analytics aniqlik kartasi: bo'sh holat halol ("Hali tavsiya yo'q"), NaN/undefined yo'q ✔.
- **TOPILMA (yorliq muammosi):** tavsiya "📍 Google Maps — yo'l olish" tugmasi bosilganda yoziladi, lekin tugma nomi buni bildirmaydi; QA "GO tugmasi yo'q" deb topdi. v6.0 da tuzatildi: tugma "📍 GO — Google Maps ga yo'l olish" deb qayta nomlandi + alohida "✔️ Faqat tavsiyani yozib qo'yish (navigatsiyasiz)" tugmasi qo'shildi (recordRec). Juftlik statistikasi jonli tekshiruvi v6 QA siga qoldi.

## v6.0 — jonli QA natijasi (2026-10-31, brauzer) — 7/7 PASS

- Versiya v6.0 (3-reload da keldi — kutilganidek).
- Home: 3 blok to'g'ridan-to'g'ri ko'rinadi (Best / Bugun / Ogohlantirishlar — "Faol ogohlantirishlar yo'q ✔"); "Batafsil" ichida Smart, Airport activity, Heatmap, Main navigation, TOP 5 — hammasi bor.
- Haydash rejimi: tugma holati almashadi, ovozli buyruqlar kartasi chiqadi/yashirinadi ✔.
- Kalibrlash zanjiri uchtan uch: "✔️ Faqat tavsiyani yozib qo'yish" → toast ✔; jurnal yozuvi (Midtown, ▶ 11:00) ✔; Analytics: "Bog'langan tavsiyalar: 1 · Aniqlik 100% (1/1) · $22.49/soat · Namuna kichik — xulosa chiqarishga erta" ✔ (NaN/undefined yo'q).
- Eslatma: 1 juftlikda aniqlik 100% chiqishi tabiiy (namuna kichik ogohlantirishi aynan shu uchun); ma'no 10+ juftlikdan keyin boshlanadi.
- Test yozuvi tozalandi. (QA brauzeri localStorage dagi 1 ta test tavsiya yozuvi o'sha profilning o'zida qoladi — foydalanuvchi telefoniga ta'siri yo'q.)

**NOT TESTED (yakuniy holat):** iPhone fizik sinov, PWA Home Screen o'rnatish, offline qayta ishga tushirish, IDB dan tiklash yo'li (localStorage tozalangan holat), CSV eksport tugmasini bosish — barchasi foydalanuvchi qurilmasida tekshirilishi kerak.

## v6.1 — AirLabs integratsiyasi (2026-10-31)

- Server tomondan API tekshiruvi: kalit ishlaydi (free, muddat 2026-11-24, qolgan limit ~939/1000). Javob: 9,189 reys; sinov paytida JFK 120, LGA 44, EWR 82 ta kelayotgan (en-route).
- **Topilma:** bepul /flights javobida arr_time/arr_estimated maydonlari YO'Q (faqat pozitsiya: lat/lng/alt/speed/status). Shunga moslab LIVE blok: kelayotgan reyslar soni + ≤50 mi yaqindagilar + eng yaqin 5 (ft/masofa). Vaqt asosidagi "qo'nishlar" ko'rsatilmaydi — uydirma bo'lardi.
- Throttle: 10 daqiqa (kvota Radar bilan umumiy). SW da airlabs.co tarmoq-only.
- Jonli brauzer QA: push dan keyin (Airports ekranida LIVE sonlar + Settings "AirLabs: OK").

**NOT TESTED:** kvota tugagandagi xulq (fallback matni tayyor — "XATO — AirLabs javob bermadi" + tarixiy blok qoladi).

## v6.1 — jonli QA natijasi (2026-10-31, brauzer) — PASS

- Airports: JFK 118 kelayotgan / 12 yaqinda; LGA 43/6; EWR 81/9; eng yaqin reyslar ro'yxati (ft/mi) chiqdi; Settings "AirLabs (jonli reyslar): OK · 01:13 PM"; Home qatorlari mos.
- QA topilmalari: (1) EWR da manfiy balandlik "-30 ft" — v6.2 da 0 ga qisqartirildi; (2) ikkita eskirgan "ADS-B" yorlig'i (Home tile + Airports intro) — v6.2 da AirLabs ga almashtirildi.

## v6.2 — Radar uslubi (2026-10-31)

- Foydalanuvchi savoli bilan tekshirildi: Radar dagi "vaqt + qayerdan" — qayerdan = AirLabs dep_iata (real), vaqt = Radar ning o'z taxminiy formulasi (masofa/tezlik + 10 daq; kod izohida ham "taxminiy"). Dashboard ga aynan shu usul, "taxminiy" yorlig'i bilan ko'chirildi.
- Jonli QA: push dan keyin.

## v6.2 QA — kesh diagnostikasi (2026-10-31)

- Dastlabki QA lar ro'yxatni eski formatda ko'rsatdi. Chuqur tekshiruv: (1) jonli app.js lokal bilan baytma-bayt bir xil (md5 mos, Last-Modified 13:17:50); (2) kodda ikkinchi render yo'li yo'q (bitta renderAirports); (3) QA brauzerida `app.js?probe=62` ochilganda yangi kod BORligi ko'rindi — demak tarmoq to'g'ri, aybdor profilning SW keshi (v8 install paytida deployment hali tarqalmagan edi) + stale-while-revalidate.
- **Tuzatish (v6.3):** asset URL larga versiya (`?v=63`) — yangi URL = hamma keshlarda yangi kalit. QA eski (zaharланган) profilda qayta o'tkaziladi: yangi format darhol chiqsa, tuzatish isbotlanadi.

## v6.3 — yakuniy sinov (2026-10-31, brauzer) — PASS

- Eski (keshi zaharlangan) profilda ham yangi format darhol chiqdi: sarlavha "Eng yaqin reyslar (qo'nish vaqti — taxminiy, masofa/tezlikdan):"; yozuvlar: "AA95 · Madrid (MAD) · ~01:37 PM · — · 0.9 mi" (JFK), "UA1442 · Denver (DEN) · ~01:37 PM · 208 ft · 3.1 mi" (LGA), "UA2823 · Vashington (IAD) · ~01:37 PM · 893 ft · 13.4 mi" (EWR).
- Manfiy balandlik yo'q (15/15 yozuv); yetishmagan balandlik "—" bo'lib chiqadi (halol).
- Sonlar: JFK 114/8, LGA 42/5, EWR 89/6. Kesh tuzatishi (?v=63) isbotlandi.

## v7.0 / v7.1 — Hotspot Ranking 2.0 (2026-10-31, brauzer QA) — PASS

- Lokal mantiq testlari 20/20 PASS: zoneScoresAt vaqt siljishi (Sat 21:30 → +3s = Sun 00:30, we[0]), patternSeries yarim tun va DST (2026-11-01 soat qaytishi — 01:00 ikki marta, devor-soat to'g'ri), zoneRates, sparkSVG, recordRecFor, hourIdx (floor).
- Jonli QA: footer v7.0 (1 yuklashda keldi); chiplar (Hozir/+1/+2/+3) va selectlar bor; kartalar 10 → 20; 1-karta Williamsburg 43 (↗, 669 pikap/soat); +2 soat rejimida 47 ball / 855 pikap/soat ga o'zgardi; aeroport kartalarida AirLabs LIVE chiplar (LGA 44/6, EWR 88/7, JFK 109/13); ✔️ toast ishladi; Masofa saralashi Times Square (0.1 mi) ni birinchi qildi.
- TOPILGAN XATO (v7.0): medallar "U0001F947" matni bo'lib chiqdi → v7.1 da haqiqiy emoji qo'yildi, qayta QA: 🥇🥈🥉 to'g'ri (Williamsburg 43 / Midtown 41 / Harlem 41), footer v7.1.

## v8.0 — Airport Intelligence (2026-10-31, brauzer QA) — PASS

- Lokal testlar ALL PASS: waveOf oraliqlari [1,1,1,0,1,1], airportScore L formulasi, monotonlik, jonli yo'q holatda renormalize, zoneRates bog'lanishi.
- Jonli QA (2-yurinish; 1-si Pages tarqalishiga to'g'ri keldi — server fayllari md5 bilan v8.0 ekani isbotlangan): footer v8.0; banner "🏆 Hozir eng foydali: LGA — 31/100" + sabablar + ⏰ maslahat; taqqoslash jadvali (LGA 31 · EWR 23 · JFK 21 — JFK reyslari ko'p (107), lekin uzoq va piki kech (22:00) bo'lgani uchun past — ball mantiqi to'g'ri ishlayapti).
- To'lqin ustunlari yig'indisi next60 ga mos (6+3+4+5+3+0=21); origins chiplar (Orlando ×5, Dallas ×3, Atlanta ×3); reyslar 8 qator; L·H·P chip; ✔️ toast ("LaGuardia Airport"); 24s grafik + izoh (eng kuchli soatlar, hozirgi soat reytingi, sariq ustun); LGA tabi almashadi.

## v8.1 — TLC Radar tugmasi (2026-10-31, brauzer QA) — PASS

- Footer v8.1; pastki nav 6 element: Home, Map, Airports, Menu, Journal, 📡 TLC Radar (oxirida, havola).
- TLC Radar bosilganda yangi varaqda https://hayotus.github.io/ ochildi ("NYC Airport Radar 🚕", Radar v3.27).
- Qolgan nav tugmalari ishlaydi (Airports tekshirildi).

## v8.4 — Project nomi TLC Pro (2026-11-04, brauzer QA) — PASS

- Tab sarlavhasi: "TLC Pro — Driver Intelligence"; header: "TLC PRO"; footer: "TLC Pro · v8.4 · Case12 uber dashboard".
- manifest.json: name "TLC Pro — Driver Intelligence", short_name "TLC Pro".
- Pastki navda 📡 TLC Radar tugmasi o'zgarishsiz.

## v8.5/v8.6 — Road Closure Monitor jonli (2026-11-06, brauzer QA) — PASS

- Muammo: monitor statik edi (3 ta qo'lda yozilgan yozuv) — jonli manba umuman ulanmagan ekan.
- v8.5: NYC DOT Open Data (Socrata 478a-yykk kesishmalar + i6b5-j7bu bloklar), within_circle 20 km, 5 daqiqada yangilanish, "Oxirgi yangilanish" belgisi, 🔄 tugma, badge LIVE; SW: data.cityofnewyork.us network-only.
- v8.6 (hotfix): boot chaqiruvi alohida qatorga olindi, timeout 30 s, birinchi xatoda 20 s dan keyin qayta urinish, modul ochilganda so'rov.
- QA: 🔄 bosilmasdan o'zi LIVE bo'ldi — 908 yozuv (20 km), haqiqiy ko'chalar (W 46 St ∩ 8 Ave ...), Home Alerts da 5 ta 🚧 bandi. Eski statik uchlik yo'qolgan.

## v8.7 — Events & Surge Forecast JONLI (2026-11-06)

**Muammo (foydalanuvchi, 2026-11-06 04:17 EST):** "Events & Surge Forecast ham live bolsin. Tugma qoshilsin yangilash va ozgaruvchi tugma royhat va map. Map bosilsa joylar metka bilan qoyilsin, metkani ustiga bosganda oyna ochilsin: nomi, qachonligi, kuni, soati, manzili."

**Manba tekshiruvi:** NYC Permitted Event Information (tvpp-9vvx) — 14 kunda 9,128 yozuv, lekin 8,843 tasi "N/A" kichik ruxsatnomalar (park yopilishlari va h.k.). Koordinata UMUMAN yo'q (manzil faqat matn). Haydovchiga kerakli turlar bilan filtr: Parade, Athletic Race/Tour, Street Festival, Festival, Concert, Sporting Event, Farmers Market, Special Event, March, Rally, Block Party + street_closure_type='Full Street Closure'.

**Yechim:**
- loadEvents(): Socrata so'rovi (hozir-3s → +7 kun, $limit=800), dedupe name+start; EVENTS endi `let` — jonli ro'yxat + seed'dagi daily/vaqtsiz yozuvlar (Broadway, MSG, Barclays, Radio City) saqlanadi, o'tgan sanali seed'lar tushib qoladi.
- Surge tur bo'yicha: Parade ×1.8, Athletic ×1.7, Festival/Fair ×1.5, Concert/Sport ×1.5, Farmers Market ×1.2, Full Street Closure ×1.3, qolganlari null (E komponentga faqat koordinatali+surge'li tadbirlar ta'sir qiladi).
- Joylashuv: 32 yozuvli gazetteer (Central Park, Madison Square Park, Times Square, MSG, Barclays, Yankee Stadium, Citi Field...) + NYC GeoSearch (geosearch.planninglabs.nyc, Pelias) — "between X and Y" → "Y & X" kesishma so'rovi; natijalar localStorage drv_geo da keshlanadi; har yuklashda eng ko'pi 6 ta yangi geokod.
- UI: badge evBadge (LIVE bo'lganda yashil), 🔄 Yangilash (evRefresh2 — EV Charging tugmasi bilan id to'qnashmasligi uchun), "Oxirgi yangilanish" (evUpd), 📋 Ro'yxat / 🗺️ Xarita almashuvchi tugmalar (hchip uslubi), modul ichida alohida Leaflet xarita (evMap, 320px) + markerlar; popup: **nom, 📅 hafta kuni + sana + soat, 📍 manzil, turi, surge**. Ro'yxat sarlavhasi: "🔴 LIVE — NYC Permitted Events (Open Data) · kelgusi 7 kun: N ta tadbir, xaritada: M ta".
- Yangilanish: boot + har 10 daqiqa + modul ochilganda + visibilitychange; xato bo'lsa 20 soniyadan keyin bitta avtomatik qayta urinish. Home Alerts'da faol tadbirlar endi eng ko'pi 4 ta. SW: geosearch keshlanishi mumkin (barqaror natija) — o'zgartirilmadi; cache tlc-pro-v19, assetlar ?v=87.

**Testlar:** mapping unit-test real Socrata namunalari bilan PASS (Greenmarket ×1.2, koordinatasiz → GeoSearch navbati; Madison Square Park Festival ×1.5, gazetteer 40.7411/-73.9897). GeoSearch jonli tekshirildi (kesishma va joy so'rovlari koordinata qaytardi).
**Jonli QA: PASS** (2026-11-06 04:57–04:58 EST) — badge LIVE (yashil), «Oxirgi yangilanish: 04:57 AM», sarlavha «🔴 LIVE — NYC Permitted Events (Open Data) · kelgusi 7 kun: 568 ta tadbir, xaritada: 236 ta», ro'yxat real tadbirlar (Greenmarket'lar, Annual Walkathon ×1.8, Farmers Market ×1.2), 🗺️ Xarita ochildi, marker popup ishladi (nom, «Juma, Nov 6 · 7:00 AM → 4:00 PM», manzil, tur). Eslatma: birinchi QA (04:38) Pages build kechikishi sabab v8.6 ni ko'rdi — repo raw v8.7 edi; TEST_REPORT push'i (e69c43a) build'ni uyg'otdi, sayt v8.7 ga o'tdi. Kosmetik nuqson topildi: header/popup emoji'lari «U0001f534» kabi kod-matn bo'lib chiqqan → v8.8 da tuzatildi.

## v8.8 — Emoji hotfix (2026-11-06)

**Nuqson (v8.7 QA):** sarlavha va popup'da 🔴📅📍🎉 o'rniga "U0001f534" kabi literal kodlar. Sabab: Python patch-string ichidagi `\U000...` (8 xonali) JS da escape emas — JS faqat `\uXXXX` (4 xonali) ni tushunadi. v7.1 dagi saboqning boshqa ko'rinishi.
**Tuzatish:** app.js dagi barcha 9 ta `\U000...` literal haqiqiy emoji belgilarga almashtirildi (🔴×2, 🎉×2, 📅, 📍, 🚧×3 — oxirgi 3 tasi v8.5 dan qolgan toast'lardagi yashirin nuqson ham edi). SW tlc-pro-v20, assetlar ?v=88.
**QA: PASS** (05:01–05:02 EST) — footer v8.8; sarlavha «🔴 LIVE — NYC Permitted Events (Open Data) · kelgusi 7 kun: 567 ta tadbir, xaritada: 254 ta» (sonlar jonli yangilandi, geokod keshi o'smoqda); popup: «Porter-Dorr Wedding · 📅 Shanba, Nov 7 · 3:00 PM → 4:00 PM · 📍 Prospect Park: Grecian Shelter/Peristyle Lawn West, Brooklyn · 🎉 Special Event». Sahifada "U000" matni qolmadi.

## v9.0 — 5 ta buyruq: Alerts olib tashlandi, Best Next Location yangi dizayn, modullar alohida oynada, zamonaviy ustki dizayn (2026-11-06)

**Kirish (ovozli suhbat, 06:34–06:40 EST):** foydalanuvchi tartib belgiladi — vazifa aytiladi, Muse tushunganini aytadi, tasdiqdan keyingina bajariladi. 5 ta buyruq berildi va tasdiqlandi ("Ha tasdiqlayman shu beshta buyruqni bajar"):
1. Alerts (jonli ogohlantirishlar) qismini olib tashlash.
2. Best Next Location boshqacha ko'rinishda.
3. Pastki menyu (Home, Map, Airports, Menu, Journal, TLC Radar) QOLADI — unga hech qachon tegilmaydi; o'zgarish faqat menyudan tepada.
4. Menyudagi 16 modul har biri bosilganda alohida oynada ochilsin.
5. Ustki dizayn: juda yaxshi, tushunarli, zamonaviy.

**Yechim:**
1. #alertCard (Home dagi "Ogohlantirishlar — Alerts LIVE" kartasi) index.html dan o'chirildi; renderAlerts() funksiyasi va 3 ta chaqiruvi olib tashlandi (maybeNotify qoldi — u CLOSURES dan to'g'ridan o'qiydi). Road Alerts plitasi (navigatsiya) qoldi, uning qiymatini endi renderHome yozadi (yopilishlar soni).
2. #bestCard qayta tuzildi: chapda yashil ball qutisi (katta son + "BALL · /100" + "Ishonch NN%"), o'ngda hudud nomi, meta va gradient progress chizig'i (meter). renderHome endi bestScore/bestConf/bestMeter ni ham to'ldiradi. Barcha eski ID lar (bestName/bestMeta/bestReasons/bestGo/recOnly) saqlandi.
3. Pastki menyu (<nav class="bot">) HTML/CSS iga UMUMAN tegilmadi — QA tartib+yozuvlarni aynan tasdiqladi.
4. Yangi view-mod ekrani: modHead (← Orqaga + modul nomi) + modBody. openModule() modulning <details> elementini modBody ga KO'CHIRADI (klon emas — ID/listenerlar saqlanadi), placeholder saqlanadi; closeModule() joyiga qaytaradi va avvalgi ekranga o'tadi. go(view, modId) endi openModule ga yo'naltiradi; details.mod summary ochilishi ham toggle-interceptor orqali oynaga olib boradi. modEvents ko'chganda evMap.invalidateSize() chaqiriladi.
5. style.css oxiriga v9.0 dizayn qatlami: body radial fon, hero gradient panel, kartalar gradient+soya+20px radius, GO tugmasi yashil gradient, #bestCard yashil ramka/gradient, badge pill. .bot selektorlari ataylab yo'q.
SW tlc-pro-v21, assetlar ?v=90.

**QA: PASS** (jonli, 06:43–06:44 EST) — footer v9.0; Alerts kartasi yo'q; Best Next Location: ball qutisi (52→50→49, jonli qayta hisob — ob-havo/GPS kelishi bilan), Ishonch %, meter chizig'i, hudud Harlem; pastki menyu aynan o'zgarishsiz; Events moduli alohida oynada ochildi (LIVE, 557 ta tadbir, 317 ta xaritada — geokod keshi o'sishda), xarita+popup ishladi, ← Orqaga Menu ga qaytardi; Road Closure Monitor ham alohida oynada (LIVE, 06:43 yangilangan). Izoh: yopilishlar sarlavhasidagi 908 (feed jami) vs ro'yxat 300 (cap) — v8.5 dan ma'lum holat, regressiya emas.

## v9.1 — Menyu: 16 modul → 8 bo'lim (2026-11-06)

**Buyruq (ovozli suhbat, foydalanuvchi rejani tasdiqladi):** Menyuda 16 modul + Analytics + Settings bor. Analytics va Settings qolsin, qolgan 16 tasi moslarini birlashtirib 8 bo'limga tushirilsin; Muse tavsiya bersin — qaysilari birlashadi.

**Tasdiqlangan reja va amalga oshirish:**
1. **Demand & Hotspots** (data-go=demand): Heatmap kartasi + modHot — demand view dan modSmart chiqarildi, karta sarlavhasi "🔥 Demand Heatmap & Hotspots".
2. **Airports** (data-go=airports): Monitor + Intelligence — airports view allaqachon birlashgan edi.
3. **Best Next Location** (data-go=home): yolg'iz.
4. **Smart Assistant** (data-grp=smart): guruh oynasi [modSmart, modVoice]. modSmart tools shelf'iga ko'chirildi.
5. **Events & Road** (data-grp=events): guruh oynasi [modEvents, modClose].
6. **Earnings & Journal** (data-go=journal): modEarn journal view boshiga ko'chirildi (kollaps holda) + smena formasi.
7. **Weather & Cameras** (data-grp=wx): [modWx, modCam].
8. **Stops & Charging** (data-grp=stops): [modRest, modPark, modEv].
Analytics/Settings plitalari va **pastki menyu o'zgarmadi**.

**Texnik:** openModule/closeModule qayta yozildi — modHomes xaritasi (har bir details o'z uyiga qaytadi), openGroup(title, ids) bir nechta modulni bitta oynada ochadi; data-grp bog'lovi qo'shildi. Hech qanday funksiya o'chmadi — faqat menyu plitalari 18→10.

**QA: PASS** (07:15–07:17 EST) — footer v9.1; Menu roppa-rosa 10 plita; Events & Road oynasi: Events LIVE (555 ta tadbir, 343 xaritada) + Closures LIVE (908 yozuv); Smart Assistant: ball kartasi + ovoz tugmalari; Stops: uchala modul; Earnings & Journal: kalkulyator + forma; Demand sahifasida Smart moduli endi yo'q (to'g'ri); pastki menyu o'zgarmagan. Izoh: Demand view'da alohida xarita hech qachon bo'lmagan — heatmap Map ekrani va Home mini-xaritasida; demand sahifasidagi birinchi karta — izoh matni (regressiya emas).

## v9.2 — Tepa safe-area tuzatish (2026-11-06)

**Muammo (foydalanuvchi skrinshoti, 2026-11-06 07:48 EST):** o'rnatilgan ilovada eng tepadagi «TLC PRO» sarlavha qatori ko'rinmaydi — telefon status paneli / Dynamic Island ostida qolgan (skrinshotda yozuv xira, yarim kesilgan). Sabab: viewport-fit=cover rejimida sahifa eng tepadan boshlanadi, lekin kodda tepa xavfsiz bo'shliq (env(safe-area-inset-top)) umuman yo'q edi — faqat pastki (bottom) inset hisobga olingan.
**Tuzatish (faqat style.css):** `main` padding-top: 12px → calc(12px + env(safe-area-inset-top)); `.modHead` (modul oynasi sarlavhasi, sticky) padding-top: 10px → calc(10px + env(safe-area-inset-top)) + pastki 10px. Pastki menyu va boshqa hech narsaga tegilmadi. SW cache tlc-pro-v23, assetlar ?v=92.
**Tekshiruv:** push bc261f7; jonli serverda footer v9.2 va style.css da ikkala qoida ham borligi curl bilan tasdiqlandi. Yakuniy vizual tasdiq faqat foydalanuvchi telefonida bo'ladi (brauzer QA kesimni emulyatsiya qila olmaydi) — foydalanuvchidan telefonda tekshirish so'raldi.

## v9.3 — Road Closure Monitor: tepa xarita + filtrlar + 5 talik sahifalar (2026-11-06)

**Buyruq (foydalanuvchi yozma, 07:53 EST; aniqlashtirish variantlari orqali tasdiqlandi 07:55; "Ha, bajar" 07:56):** Road alerts ochilganda tepa qismida to'liq map ochilsin; map tagida refresh tugmasi va 3 ta tugma (foydalanuvchi tanladi: **Faol / Kelgusi / Hammasi** filtrlari); map ostida ro'yxat — faqat ekranga sig'adigani (5 ta) + Next tugmasi bilan keyingi 5 ta.

**Amalga oshirish:** modClose ichi qayta tuzildi — #clMap (300px) modul ichidagi BIRINCHI element, #clMapNote izohi, keyin mavjud 🔄 #clRefresh + #clUpd qatori, filtr chiplari #clFAct/#clFUp/#clFAll (standart Faol), #closeList, sahifalash qatori (#clPrev / #clPageInfo / #clNext). app.js: clFilter/clPage/clMap/clMarkers holati; clFiltered(); renderClosures() qayta yozildi — ro'yxat = filtrdan sahifadagi 5 ta, "1–5 / N · Sahifa X/Y"; clPopup() (🚧 nom, 📍 joy, 📅 muddat, 🔴 FAOL / 🕐 YAQINDA); drawClMarkers() filtrga mos, cap 120; fitClMap() fitBounds maxZoom 13; refreshClMap() (kenglik>0 himoyasi, lazy init); setClFilter(); openModule/openGroup dan keyin setTimeout(refreshClMap,160). Asosiy Map ekranining yopilishlar qatlami va Home plitasi o'zgarmadi. SW tlc-pro-v24, assetlar ?v=93.

**QA: PASS** (jonli, 08:00–08:02 EST) — footer v9.3; xarita modul tepasida; "Xaritada: 120 ta yopilish (filtr: Faol)"; popup aynan tekshirildi (Union Square West ∩ East 14 Street, Nov 2 → Nov 14, 🔴 FAOL); Faol 292 ta ("1–5 / 292 · Sahifa 1/59"), Keyingi→2-sahifa, Oldingi→orqaga; Kelgusi 8 ta; Hammasi 300 ta. Kuzatuvlar: (1) sahifalash+scroll dan keyin xarita bir marta Meksika ko'rfazi tomonga qochdi; (2) izohda "koʼha" imlo xatosi — v9.4 da tuzatildi.

## v9.4 — Road xarita hotfix (2026-11-06)

1. **Imlo:** "ko\u02bcha" yozuvi JS da "koʼha" bo'lib chiqardi — \u02bc escape'ning 4-hex belgisi so'zdagi 'c' ni yutib yuborgan. "ko\u02bccha" qilib tuzatildi. Audit: boshqa \u02bc/\u02bb yozuvlari tekshirildi — "ko\u02bcrilmoqda" va "O\u02bbchirish" to'g'ri.
2. **Caption aniqroq:** "Xaritada eng yaqin N ta yopilish · filtrda jami M ta (filtr). Markerni bosing — ko'cha va muddati chiqadi."
3. **Himoya:** clPts() — 60 km dan uzoq nuqtalar marker/fit ga kirmaydi; refreshClMap() oxirida markaz foydalanuvchidan >150 km uzoqda bo'lsa fitClMap() bilan o'z-o'zini tuzatish.
SW tlc-pro-v25, assetlar ?v=94.

**QA: qisman** (08:07–08:09 EST) — caption va imlo tuzatilgani tasdiqlandi; lekin scroll dan keyin xarita yana bo'sh kulrang bo'lib qoldi (markaz qochmagan — himoya ishlamadi, chunki nuqson markazda emasligi aniqlandi). Sabab tahlili v9.5 da.

## v9.5 — Mini-xaritalarda scrollWheelZoom o'chirish (2026-11-06)

**Sabab (v9.3/v9.4 QA kuzatuvlaridan):** sahifaga joylashtirilgan Leaflet mini-xarita sichqoncha g'ildiragini ushlab qoladi — kursor xarita ustida turganda sahifa scroll'i xaritani zoom/pan qilib yuboradi (QA brauzerida "Meksika ko'rfazi"ga qochish va bo'sh kulrang shundan). Telefonda (sensorli scroll) bu mexanizm ishlamaydi, lekin ish stoli/tekshiruv muhiti va foydalanuvchi tajribasi uchun himoya kerak.
**Tuzatish:** clMap va evMap yaratishda {scrollWheelZoom:false} — xarita barmoq/sichqoncha bilan tortib (drag) va tugmalar bilan ishlayveradi, g'ildirak esa sahifani aylantiradi. SW tlc-pro-v26, assetlar ?v=95.

**QA: PASS** (08:16–08:19 EST) — footer v9.5; kursorni xarita ustida tutib g'ildirak bilan pastga/yuqoriga bir necha marta aylantirishda sahifa aylandi, xarita QIMIRLAMADI (Manhattan, markerlar, plitkalar joyida); "Keyingi →" ×2 (sahifa 3/59) dan keyin ham xarita Nyu-Yorkda qoldi; caption to'g'ri. Kichik kuzatuv: modul jonli ma'lumot kelguncha bir necha soniya "0 ta / yuklanmadi" zaxira holatini ko'rsatadi — yuklanish holati matni kelajakda "yuklanmoqda" deb aniqlashtirilishi mumkin (nuqson emas, ma'lumot o'z vaqtida keladi).

## v10.0 — Events & Road: bitta umumiy xarita (2026-11-06)

**Buyruq (ovozli suhbat, foydalanuvchi bosqichma-bosqich aytdi va umumiy rejani tasdiqladi):** 5-bo'lim (Events & Road) to'liq qayta ishlansin: ikkala modul BITTA xaritada jamlanadi; xarita ostida Events va Road tugmalari — on holatida qatlam ko'rinadi, off da yo'qoladi. Road on bo'lganda yopiq ko'chalar xaritada QIZIL bilan chiziladi. Events markerini bosganda nomi, manzili va vaqti chiqadi. Pastda ikkita oyna (tab): Events oynasida eng katta 5 ta va eng yaqinlashib kelayotgan 5 ta tadbir ro'yxati, Next bilan keyingilari; Road oynasida qaysi ko'chalar yopilishi, nomi va soat/sana vaqti.

**Amalga oshirish:** modEvents ichiga umumiy xarita #erMap (320px) + #erMapNote legendasi; qatlam tugmalari #erTgEv/#erTgRd (erShowEv/erShowRd, standart ikkalasi on); tab tugmalari #erTabEv/#erTabRd (setErTab — evPanel/modClose almashadi, xarita tepada qoladi). drawErLayers(): Events qatlamida markerlar (evPopup: nom, 📅 kun/sana/soat, 📍 manzil), Road qatlamida qizil L.polyline (blok yozuvlarining the_geom chizig'i — clMapRow endi `line` saqlaydi) va qizil circleMarker (kesishma nuqtalari), clPopup bilan. Road qatlami Road panelining Faol/Kelgusi/Hammasi filtriga bo'ysunadi (clPts). modClose/modEvents dagi alohida xaritalar (#clMap, #evMap) olib tashlandi; openModule modEvents/modClose ni guruhga yo'naltiradi; Home "Road Alerts" plitasi va Tools "Events" tugmasi data-grp="events" + data-ertab bilan ochiladi. Events ro'yxati: saralash 🕐 Eng yaqinlar / 🔥 Eng kattalar (surge bo'yicha) + 5 talik sahifalash (evPrev/evNext). setEvView/evMap/refreshClMap o'chirildi. scrollWheelZoom:false saqlandi. SW tlc-pro-v27, assetlar ?v=100.

**QA: PASS** (jonli, 09:25–09:29 EST, 9/9 qadam) — footer v10.0; BITTA xarita (80 ta tadbir markeri); legenda aynan: "Qatlamlar: 📅 Events yoniq · xaritada 80 ta · 🚧 Road yoniq · xaritada 120 ta, filtrda jami 292 ta..."; qizil chiziqlar va nuqtalar bor (zoom da o'nlab segment); Road off → qizillar yo'qoldi, on → qaytdi; Events off → 80 marker yo'qoldi, on → qaytdi; event popup (nom/📅 Juma, Nov 6 · 2:00 PM → 6:00 PM/📍 manzil) va road popup (🚧 West 55 Street ∩ 5 Avenue → 6 Avenue, 📅 Oct 19 → Nov 15, 🔴 FAOL) tekshirildi; Events ro'yxati "1–5 / 552 · Sahifa 1/111", Keyingi → 2-sahifa; 🔥 Eng kattalar — birinchi 5 ta hammasi ×1.8; Road tabi: panel almashdi, xarita qoldi, filtrlar (Faol 292→300 jonli, Kelgusi 8, Hammasi 300) va sahifalash ishladi; Home Road Alerts plitasi Road tabi bilan ochildi. Kichik kuzatuvlar: standart zoom da qizil chiziqlar xira (fitBounds butun shaharni qamraydi — kutilgan holat); qatlam almashtirilganda xarita qayta fit bo'ladi (dizayn bo'yicha).

## v10.1–v10.3 — Stops umumiy xarita + izohsiz/ikonka interfeys + "Siz" markerlari (2026-11-06)

**Buyruqlar (ovozli suhbat, «Ha, hammasini bajar»):** (1) 8-bo'lim (Stops & Charging) v10.0 uslubida: bitta umumiy xarita + 3 qatlam + pastda ro'yxatlar; (2) Events & Road xaritasidagi barcha izohlar olib tashlansin; (3) tugmalar faqat ikonka bo'lsin; (4) har bir xaritada foydalanuvchi lokatsiya belgisi ("Siz") yonib tursin.

**Amalga oshirish:** v10.1 — #stMap (modRest ichida) + qatlam tugmalari + tab ro'yxatlar; erMap/stMap ostidagi izohlar o'chirildi. DIQQAT: ushbu chatning birinchi push urinishi stale base tufayli rad etildi («Reference cannot be updated» — kuch bilan yozmadi), tarkib asosiy chatning parallel oqimi orqali chiqdi; bu chatning «v10.1 chiqdi» xabari app.js bo'yicha noto'g'ri bo'lib, foydalanuvchiga tuzatildi. v10.2 (e5a1f36) — Road filtr chiplari ilovaning o'z belgilariga o'tdi (🔴 Faol / 🕐 Kelgusi / 📋 Hammasi; app.js hech bir Events & Road tugmasiga matn yozmaydi — grep bilan tekshirildi). v10.3 — erMe/stMe "Siz" markerlari (har xarita init ida yaratiladi, watchPosition da setLatLng bilan siljiydi, xaritani qayta markazlamaydi). SW tlc-pro-v30.

## v10.4 — Asosiy Map qatlamlari tuzatish (2026-11-06, 90e741b)

**Sabab:** asosiy Map dagi wc/ev qatlam guruhlari mavjud edi, lekin refreshWC/refreshEV faqat modul ro'yxatlari va Stops xaritasini to'ldirardi — asosiy xarita qatlamlari bo'sh qolardi. **Tuzatish:** layerGroups.tesla; drawMapWc/drawMapEv (ko'k/yashil circleMarker, popup nom+masofa); refreshTesla() — Photon (kalitsiz) "Tesla Supercharger", 15 ta, dedupe nom@3dp, >31 mi tashlanadi, default pin + popup (⚡ nom / 📍 manzil / masofa). ev tugmasi ikkala guruhni boshqaradi. SW tlc-pro-v31.

**QA: PASS** — Map: 🚻 → ko'k nuqtalar + popup; ⚡ → yashil nuqtalar + ~15 Tesla pin (popup: «⚡ Tesla Supercharger / 📍 American Dream Way, East Rutherford / 5.6 mi uzoqlikda»); Events & Road va Stops to'liq tekshirildi. **5 nuqson topildi:** (1) Home mini-xaritasi buzilgan (init-while-hidden, invalidateSize yo'q); (2) erMap yopilish chiziq/nuqtalarida popup ochilmadi (hit tolerance); (3) Stops Parking ro'yxati bo'sh (renderParking chaqirilmagan); (4) modullar ustma-ust yig'ilishi (go() closeModule chaqirmaydi); (5) Events sarlavha soni (548) ro'yxat sonidan (552) farq qilardi. Eslatma: QA matnidagi «radiusda908» — HTML teg chegarasi artefakti, vizual nuqson emas.

## v10.5 — QA nuqsonlari tuzatish (2026-11-06, 4955887)

modClear() go() ichida ham chaqiriladi; mapHome invalidateSize+setView (go('home') + boot+700ms); setStTab("park") → renderParking(); yopilish chizig'i weight 4→7, nuqta radius 5→8; Events sarlavhasi evs.length dan. SW tlc-pro-v32. (Birinchi push urinishi approval_expired bo'ldi — 30 daqiqa; qayta yuborish tasdiqlandi.)

**Re-QA: 4/5 tuzaldi** — yopilish popup lari ikkala turda ham ochildi (matnlari aynan tekshirildi); sonlar teng (554=554); ustma-ustlik yo'q; Parking 4 ta garaj chiqdi. Home mini-xaritasi ochildi, lekin "Siz" pinida popup yo'q edi → v10.6. Kosmetik: Home legendasi «Qizil» deydi, issiqlik doiralari kulrang chiqadi (foydalanuvchiga aytilgan, tuzatilmagan).

## v10.6 — Home "Siz" popup (2026-11-06, c5d3bc8)

userMkH ga .bindPopup("Siz") qo'shildi (asosiy xaritadagi userMk da bor edi). SW tlc-pro-v33. **Tasdiq:** v10.7 QA bosqichida Home pini bosildi → «Siz» popup ochildi; mini-xarita birinchi ochilishdayoq to'liq chizildi.

## v10.7 — Map qayta dizayn (2026-11-06, 8307f75)

**Kontekst:** qayta dizayn avval asosiy chatga topshirilgan, lekin repoga umuman tushmagan (grep: cruise=0). Foydalanuvchi telefon skrinshoti bilan «Mana shu yerda o'zgarish bo'lishi kerak edi lekin yo'q» dedi; 5 bandlik reja shu chatda qayta aytildi, foydalanuvchi «Ha, shu chatda bajar» deb tasdiqladi. SABOQ: ko'rinmas (quvur) tuzatishlar foydalanuvchiga «hech narsa o'zgarmagan» bo'lib tuyuladi — ko'rinadigan yuza o'zgarishi alohida aytilishi kerak.

**Amalga oshirish:** view-map flex-ustun, balandlik calc(100dvh − 70px − safe-area), #map flex (QA: viewport ning ~89%); «Qatlamlar haqida» va «Tezlik chegarasi» kartalari o'chirildi; eski 6 chip o'rniga 5 tugma (wc/ev/loc/cruise/air); PLACES (Radar SAVED_LOCATIONS, HOME siz), TOCHKA5, CRUISE2 konstantalari; issiqlik qatlami standart yoniq. SW tlc-pro-v34.

**QA: PASS** (qisman izoh bilan) — kartalar yo'q, baland xarita, 5 tugma, Location (5 pin + qizil Tochka doiralari, popup lar aynan), Cruise (2 pin), Airport (3 pin) ishladi. Qisman: Tesla pinlari bu safar chiqmadi, Restroom markerlari ~24 s da keldi (Overpass asosiy→oyna zanjiri).

**Tesla tashxisi (VM dan):** Photon API sog'lom (200, 15 natija), lekin javob 17.0 s — refreshTesla fetchT(10000) dan uzun → abort → jim catch. Vaqt mos kelmasligi, logika xatosi emas.

## v10.8 — Vaqt limitlari (2026-11-06, 257e082)

refreshTesla fetchT 10000→25000; overpass() fetchT 12000→15000. SW tlc-pro-v35.

## v10.9 — Map: Radar uslubi (2026-11-06, de0b3cb)

**Buyruq (foydalanuvchi, 11:43):** 5 ikona bir qatorda; Restroom tugmasi TLC Radar dagi kabi — bir xil ko'rinish, bir xil uslub, bir xil vazifa; Tesla/Cruise/Airport ham shu uslubda.

**Amalga oshirish:** #mapPanel (suzuvchi, Radar .location-option qatorlari: nom + kichik qator + 2 dumaloq belgi — ko'k halqa mi, yashil halqa min; «⬇ More» +5); .mpill strip tugmalari (ikonka ustida, yorliq ostida; o'chiq — kulrang grayscale, yoniq — rangli; Tesla — qizil Tesla SVG); 28px dumaloq divIcon markerlar (mk-wc oq/ko'k halqa, mk-tesla oq/sariq halqa, mk-loc ko'k, mk-tochka qizil+mehmonxona soni); Restroom yonganda zoomHalfMile (~805 m); marker/qator click → gmaps(). Marshrut masofa/vaqt: OSRM (oshkor qilingan farq: Radar TomTom ishlatadi; OSRM bo'lmasa haversine masofa + «--» min). Panel bitta (oxirgi yongan qatlam), qatlamlar mustaqil. SW tlc-pro-v36, assetlar ?v=109.

**QA: PASS (izohlar bilan)** — tugmalar bir qatorda, kulrang→rangli; Restroom paneli (Port Authority 0.3 mi/1 min …), More 5→9 qator va marker; Tesla paneli (East 47th St 1.2 mi/3 min) + sariq halqali markerlar; Location/Cruise/Airport panellari va markerlari to'liq; hammasi o'chganda toza. Izohlar: Restroom birinchi ochilishi ~25 s (Overpass); qatorlar marshrut masofasi ekranda ko'rinadigan tartib bilan to'g'ri chiziq tartibi farqi tufayli «saralanmagan» ko'rinadi; yashil EV nuqtalari bu safar kechikdi (ma'lumot vaqti). Qatlamlar ustma-ust ochilishi va zoom qaytmasligi — Radar da ham shunday (dizayn).

## v10.10 — Panel silliqlash (2026-11-06, fc54fbe)

(1) Restroom: layerItems("wc") = WC_ITEMS||distSort(WC_FB) — zaxira ro'yxat darhol, jonli kelganda almashadi (stWcPts uslubi). (2) sortedItems(): samarali masofa (routeInfo.dist ?? d) bo'yicha panel/marker/marshrut tartibi bir xil. SW tlc-pro-v37, assetlar ?v=110.

**QA: PASS** — Restroom paneli <2 s da chiqdi («Yuklanmoqda...» ko'rinmadi); 40 s dan keyin tartib 0.3, 0.5, 0.8, 1.3, 2.4 (o'suvchi); yashil EV nuqtalari qaytdi (2 ta shaharda). Qoldiq: Tesla da 2 qator «-- mi» qoldi — sabab v10.11 da.

## v10.11 — Panel marshrut chaqiruvi tuzatish (2026-11-06, c7d420f)

**Sabab:** kickRoutes faqat qatlam ochilganda va ma'lumot kelganda chaqirilardi; qayta saralashda panelga YANGI chiqqan qatorlar (oldingi 5 talikdan pastda bo'lganlar) marshrut so'rovisiz qolardi — «-- mi» abadiy. **Tuzatish:** renderMapPanel() oxirida kickRoutes(layer) (idempotent — mavjud kalitlar o'tkazib yuboriladi). SW tlc-pro-v38, assetlar ?v=111. Push yo'lida: 2× approval_expired + 1× runtime restart uzilishi; to'rtinchi urinish tasdiqlandi.

**QA: PASS** (14:07–14:09) — footer v10.11; Tesla paneli: 15/15 qator raqamli mi/min (1.2/3, 1.8/5, 3.3/12, 4.0/10, 4.2/13, 4.7/12, 5.1/15, 5.1/13, 5.4/17, 6.1/20, 6.4/13, 6.5/16, 8.1/15, 10.1/22, 25.7/36), tartib mi bo'yicha o'suvchi, «-- mi» hech qayerda yo'q (matn qidiruvi ham topmadi).

**Sinovdan o'tmagan (qurilmada):** jismoniy iPhone, PWA Home Screen o'rnatish, offline qayta ishga tushish, IDB tiklash, AirLabs kvota tugashi holati.

## v10.12 — Restroom: TLC Radar bilan to'liq paritet (2026-11-06, 92bd769)

**Buyruq (foydalanuvchi yozma, 14:10):** «Restroom funksiyasi huddi tlc radar restroom funksiyasidek bir hilda ishlasin». Reja shu chatda yozma aytilib, foydalanuvchi «Ha, to'liq bir xil qil» deb tasdiqladi (variantlar: to'liq paritet / marshrut OSRM da qolsin — birinchisi tanlandi).

**Farqlar yopildi:** (1) Ma'lumot: Overpass/OSM (9 km, 40 ta, sekin) o'rniga Radar zanjiri — loadWC(): https://hayotus.github.io/restrooms.json (998 ta, NYC Open Data i7jb-7jku bazasi, haftalik yangilanadi; CORS * tekshirilgan) → NYC Open Data API (status=Operational) → WC_FB2 (Radar ning 15 ta zaxirasi). WC_ITEMS shu bazadan; Stops ro'yxati ham (eng yaqin 20). (2) Marshrut: OSRM o'rniga TomTom (ttRoute: traffic=true, travelMode=car; kalit Radar kodidagi kabi ikki bo'lakda, qiymat chatda/xotirada yozilmaydi) + kickRoutesWc() — Radar uslubida 3 parallel worker, faqat ko'rinadiganlar, xato bo'lsa 60 s dan keyin qayta urinish. (3) Chegara: eng yaqin 20 (RESTROOM_SHOW pariteti) — layerItems("wc").slice(0,20). (4) Zoom: savedMapView — Restroom yopilganda xarita avvalgi ko'rinishiga qaytadi (v10.9 QA dagi «Radar da ham qaytmaydi» xulosasi XATO bo'lgan: Radar da savedView/restoreSavedView bor; foydalanuvchiga tuzatish oshkor aytilgan). (5) Click: wc qator/marker → navGo (window.location, dir_action=navigate — Radar uslubi); boshqa qatlamlar gmaps() da qoldi. (6) Harakat >300 m bo'lsa wc marshrutlari yangilanadi (watchPosition). EZPass/traffic tugmalari TLC Pro da yo'q — traffic=on qat'iy. SW tlc-pro-v39, assetlar ?v=112. Birinchi patch urinishi refreshWC anchor mos kelmasligidan to'xtadi (faylga hech narsa yozilmadi), span-almashtirish bilan tuzatildi.

**QA: PASS** (jonli, 14:18–14:21) — footer v10.12; panel nomlari aynan shahar bazasidan (Bryant Park - 40th St, McCaffrey Playground, Stephen A. Schwarzman Building NYPL, Port Authority Bus Terminal - NW/SW Level 2, 825 Eighth Avenue POPS, Grand Central (Metro North) LIRR Restroom...); More ×3 → jami 20 qator (chegara ishladi); barcha 20 qator TomTom qiymatlari bilan to'ldi va marshrut masofasi bo'yicha saralandi (0.4→1.6 mi); kuzatuv: birinchi to'lqindagi 2 qator (Bryant Park - 40th St, Mathews-Palmer) TomTom birinchi urinishida xato qilib, 60 s qayta urinishda to'ldi (~1 daqiqada) — Radar da xato qatorlar keyingi yangilanishgacha «--» qoladi, bu yerda tezroq tiklandi. Zoom: ochilganda ko'cha masshtabi, o'chganda avvalgi shahar ko'rinishi aynan qaytdi ✓. Stops ro'yxati: shu bazadan (825 Eighth Avenue POPS 0.3 mi...) — modulning o'z formati (10 qator, to'g'ri chiziq masofasi) o'zgarmadi. Tesla regressiyasi yo'q (v10.11 dagi qiymatlar aynan).

## v10.13 — Map masshtabi qatlamlarga moslashadi (2026-11-06, 8f23ca6)

**Buyruq (foydalanuvchi yozma, 14:25):** Tesla/Cruise/Airport bosilganda xaritada barchasi ko'rinsin (masshtab moslashsin), off bo'lganda recenter; Restroom da eng yaqin 5 ta masshtab bilan ko'rinsin, More («next») bosilganda xarita qolganlarini sig'dirib kengaysin, off da recenter. Reja yozma aytilib, «Ha, shunday bajar» tasdig'i olindi (muqobil «OFF da mening joyimga markazlashsin» tanlanmadi — recenter = ochilishdan oldingi ko'rinish).

**Amalga oshirish:** FIT_LAYERS=[wc, ev, cruise, air] (Location tegilmadi); fitLayerBounds() — foydalanuvchi + yoniq qatlamlarning ko'rinadigan (visCount) markerlari fitBounds, paddingTopLeft [24,24], paddingBottomRight [290,24] (panel hisobga olingan), maxZoom 16. mapToggle: birinchi fitted qatlam ochilganda savedMapView saqlanadi; ON → fit; OFF → boshqa fitted qatlam qolsa qayta fit, qolmasa savedMapView ga recenter. More handler → qayta fit. Ma'lumot kech kelganda ham fit: drawMapWc va refreshTesla ichida fit hook. Restroom ning alohida zoomHalfMile chaqiruvi olib tashlandi (funksiya kodi qoldi, chaqirilmaydi). Qo'shimcha tuzatish: More handler da wc uchun OSRM kickRoutes o'rniga kickRoutesWc (TomTom) — avval More bosilganda wc qatorlari OSRM dan ham so'ralishi mumkin edi. SW tlc-pro-v40, assetlar ?v=113.

**QA: PASS** (jonli, 14:29–14:32, 6/6) — Airport: 3 marker ham (EWR/LGA/JFK) metro masshtabida sig'di, OFF → boshlang'ich ko'rinish; Cruise: 2 terminal ham sig'di, OFF → qaytdi; Restroom: eng yaqin 5 + «Siz» ko'cha masshtabida, More → 10 marker, ko'rinish W 53rd–W 35th dan W 60th–E 28th ga kengaydi, OFF → qaytdi; Tesla: 5 marker ham ekranda (masshtab o'zgarmadi — boshlang'ich shahar ko'rinishi ularni allaqachon sig'dirib turgan ekan, fit natijasi shu); ustma-ust: Restroom+Airport birgalikda fit, Airport OFF → faqat Restroom ga qayta fit, Restroom OFF → boshlang'ich ko'rinish. Kosmetik kuzatuv: More dan keyin 10-marker (Grand Central atrofi) qo'shnisi bilan vizual ustma-ust tushadi — ikkalasi ham chegarada, zichlik tabiiy.

## v10.14 (2026-11-06, 5b605fa) — Traffic + EZPass (Radar parity) + TomTom hamma qatlamda + yo'nalish chiziqlari
- Strip 7 tugma: + Traffic (🚦, TomTom flow tile qatlami, ⚠ degradatsiya Radar dagidek) + EZPass (🛣️ ON/OFF yorliq, toast Radar matni). Ikkalasi drv_settings da (standart ON), Settings da ham katakchalar.
- Panel marshrutlari OSRM dan TomTom ga o'tdi (traffic + avoid=tollRoads, routeRepresentation=polyline). syncRouteLines: yoniq qatlamlarning ko'rinadigan joylariga sizdan chiziq (qatlam rangi).
- QA: tugmalar/overlay/EZPass/Airport chiziqlari PASS; LEKIN Restroom birinchi to'lqinda 0/5 to'ldi (TomTom vaqtinchalik xatolari + 60s lockout) → v10.15 tuzatish.

## v10.15 (2026-11-06, c4daf67) — marshrut retry
- kickRoutes: o'z-o'zini qayta urinish (3 urinish, 8s/20s backoff, 150s muddat); routeDegraded faqat ko'rinadigan xato qolsagina qoladi.

## v10.16 (2026-11-06, 1a2ccbb; 0d0901c = bo'sh push, patch anchor xatosi) — fit masshtab tuzatish
- fitLayerBounds: paddingBottomRight ekran kengligiga mos (≥700px → 290, aks holda 24) + fit zoom floor z10. Sabab: telefonda 290px padding Airport fit ni z8 ga tushirardi (foydalanuvchi xabar berdi; Cruise kichik span da to'g'ri edi).

## v10.17 (2026-11-06, d57cbda) — har marshrutga alohida rang
- ROUTE_PALETTE (12 rang): chiziq rangi panel tartibi bo'yicha; panel qatorida .loc-dot mos rangda.
- Birlashtirilgan QA (2026-11-06 15:04–15:07 EST, desktop 1919px): footer v10.17 ✓; Restroom retry PASS (30s→2/5, 60s→5/5, hech narsa bosilmasdan; ⚠ to'lgach yo'qoldi); Airport 3 chiziq 3 rang (LGA ko'k 9.5mi/51min, EWR qizil 16.4/45, JFK yashil 17.4/86), nuqtalar mos, fit z≈10 (desktopda); Cruise 2 rang ✓; Tesla 3 chiziq rangli ✓, yana 2 qator 30s kuzatuvda to'lmadi (retry davom etardi, qatlam o'chirildi). Tor ekran (telefon) fit QA brauzerida tekshirilmadi — oyna toraytirish imkoni bo'lmadi.

## v10.18 (2026-11-06, 80c408f) — Traffic/EZPass xarita ustuniga + Recenter
- Foydalanuvchi tartibi: +, − (Leaflet zoom), Traffic, EZPass, Recenter — yuqori chap burchakdagi vertikal ustun (Leaflet control); strip yana 5 tugma.
- EZPass holati tugma ostidagi ON/OFF mikromatnda; ⚠ Traffic tugmasidagi burchak belgisiga ko'chdi; Recenter: "Siz" ga markazlash, zoom >= 14, savedMapView bekor qilinadi.
- QA PASS 6/6 (2026-11-06 15:18–15:20 EST): footer v10.18; ustun tartibi aniq; Traffic/EZPass almashinishi (ikonka kulrang, overlay/toast); Recenter z11 dan ~z14 ga markaz bilan qaytdi.

## v10.19 (2026-11-06) — Home bitta ekran
- CSS: #view-home.act flex column, balandlik = view-map formulasi (100dvh - 70px - safe-area), overflow hidden; hero/soat/plita/karta siqildi; drive rejimida scroll istisnosi qoldi.
- Maqsad: foydalanuvchi talabi — Home tepa-pastga tushmasin.

## v10.20 (2026-11-06) — Batafsil istisnosi
- #view-home:has(details.more[open]){overflow-y:auto} — yopiq = bitta ekran, ochiq = ichki scroll.
- QA (desktop): asosiy bloklar sig'di, scroll yo'q; AMMO footer qatori birinchi yuklanishda kesilib qoldi (ochib-yopgandan keyin chiqdi); Batafsil ichida mini-xarita bo'sh (init-while-hidden), test profilda ma'lumotlar (ob-havo/ball/TOP5) yuklanmadi.

## v10.21 (2026-11-06) — siqish + mini-xarita tuzatish
- CSS: summary/soat/karta padding siqildi (~38px). JS: homeMore toggle -> initMaps + mapHome.invalidateSize/setView.
- QA: mini-xarita TUZALDI (tile lar + Siz belgisi chizildi); doiralar kulrang — sabab: heatCircles D==null da #9ca3af beradi, test profilda zones qo'llanmadi; zones.json o'zi VM dan tekshirildi — jonli va to'g'ri (TLC 2025-09). Footer birinchi yuklanishda YANA kesildi.

## v10.22 (2026-11-06, commit 2fb2044) — footer ko'chdi
- Versiya qatori Home oqimidan Batafsil ichining oxiriga ko'chirildi. Push 2 marta approval_expired bo'ldi, uchinchisida o'tdi.
- QA PASS (2/2): yangi yuklanishda Home bitta ekran (hero+4 plita+Best+Earnings+Batafsil), scroll yo'q, versiya qatori yopiq Home da yo'q; Batafsil pastida versiya qatori oxirgi element.
- SW tlc-pro-v49, assetlar ?v=122.

## v10.23 (2026-11-06, commit 5e4493f) — Tesla belgisi
- Foydalanuvchi: Map strip dagi Tesla belgisi OFF da kulrang filtr bilan ko'rinmasdi -> to'qroq qil.
- CSS: .mpill[data-layer="ev"] OFF da filter:none, opacity .85, path fill #8B0000 (to'q qizil); ON da #CC0000.
- QA PASS (2/2): OFF = to'q qizil aniq ko'rinadi, qolgan tugmalar kulrang; ON = yorqin qizil + markerlar/ro'yxat. SW tlc-pro-v50, ?v=123.

## v10.24 (2026-11-06, commit f98e81f) — dizayn paketi (foydalanuvchi 6,5,3,1 tanladi)
- (1) Tungi xarita: .mapctl ustuniga Recenter ostiga 🌙 tugma; tiles() settings.darkmap bo'yicha Esri World_Dark_Gray_Base; BASE_LAYERS registry + setUrl bilan barcha xaritalar (map/mapHome/erMap/stMap) almashadi; tanlov drv_settings da saqlanadi.
- (3) Strip ikonkalari: wc/loc/cruise/air emoji -> chiziqli SVG (currentColor); OFF #8e8e93 aniq kulrang; ON ranglari: wc #0A84FF, loc #34C759, cruise #BF5AF2, air #FF9500; Tesla v10.23 holatida.
- (5) Attribution: 9px, rgba(255,255,255,.5) fon.
- (6) Map ochilishi: setView z12 -> z13 (foydalanuvchi markazda).
- QA PASS (4/4): ikonka ranglari birma-bir, 🌙 dark/light + toastlar, attribution ixcham, ochilish ~z13. SW tlc-pro-v51, ?v=124.

## v10.25 (2026-11-07) — qatlam tugmalari chap ustunga
- Ovozli buyruq (foydalanuvchi tasdiqladi): Restroom/Tesla/Location/Cruise/Airport tugmalari pastki stripdan chap ustunga, EZPass ostiga ko'chdi.
- Tartib: +, -, Traffic, EZPass, Restroom, Tesla, Location, Cruise, Airport, Recenter, Tungi (🌙). Tugmalar .mc-layer (ikonka-only, 20px SVG); ON ranglari strip dagidek; Tesla OFF to'q qizil.
- Pastki #layerChips strip olib tashlandi; #mapPanel (tepa-o'ng) o'zgarmadi.

## v10.26 (2026-11-07) — Jurnal yaxshilanishi (Muse tashabbusi, foydalanuvchi "o'zing o'zgarish kirit, mendan so'ramasdan" dedi)
- (1) **Jonli sof hisob (preview):** Smena qo'shish formasida tushum/soat/mil/xarajat kiritilishi bilan "Taxminiy sof: $X · $Y/soat · $Z/mil — elektr xarajati hisobga olingan" qatori chiqadi (#jPreview, renderJPreview; tahrirlashda ham to'ladi, saqlagandan keyin tozalanadi).
- (2) **Har yozuvda net/soat:** Tarix ro'yxatida har smena qatoriga sof yonida $/soat qo'shildi (soat>0 bo'lsa).
- (3) **Filtr jami:** Tarix tepasida #jSum — tanlangan filtr bo'yicha jami: smenalar soni, gross, sof, soat, o'rtacha $/soat, masofa.
- (4) **"Shu oy" filtri:** jFilter ga month varianti (joriy kalendar oyi bo'yicha).
- SW tlc-pro-v53, assetlar ?v=126. Commit: 9016ee5.
- **Lokal tekshiruvlar: PASS** — node --check app.js; takroriy ID 0 ta; jPreview/jSum HTML+JS da bog'langan; diff faqat Jurnal kesimida (boshqa modullarga tegilmadi).
- **Jonli QA: PASS (5/5)** (2026-11-07 22:55 EST, jonli brauzer) — footer v10.26; preview: 200/8s/120mi/10 kiritilganda "Taxminiy sof: $179.92 · $22.49/soat · $1.50/mil" (hisob aniq: 200 − 120×0.28×0.30 − 10 = 179.92); filtrda "Shu oy" bor; saqlangan yozuvda "$22.49/soat" va "Filtr jami: 1 smena · Gross $200.00 · Sof $179.92 · 8 soat · $22.49/soat · 120.0 mi" chiqdi; test yozuvi o'chirildi, hisoblagichlar $0.00 ga qaytdi.

## v10.27 (2026-11-08) — Kod tekshiruvi tuzatishlari (code review)
- (1) **Wipe/Reset IndexedDB xatosi tuzatildi:** `sWipe`/`sReset` faqat localStorage ni o'chirardi, IndexedDB (`drvdb`) nusxasi qolardi va `idbRestore()` qayta yuklanishda ma'lumotni tiklab qo'yardi. Endi `idbDel()` qo'shildi: ikkala tugma ham avval IDB kalitlarini o'chirib (await), keyin localStorage ni tozalaydi; Wipe endi `drv_geo` keshini ham o'chiradi.
- (2) **Service Worker jonli keshi tuzatildi:** bypass ro'yxatiga `api.tomtom.com` (marshrut/traffic), `geosearch.planninglabs.nyc`, `photon.komoot.io`, `overpass.kumi.systems` qo'shildi — ilgari ular "kesh avval" qoidasiga tushib, eskirgan javob qaytarishi mumkin edi.
- (3) **Leaflet SRI:** unpkg dan yuklanadigan Leaflet 1.9.4 CSS/JS ga `integrity` (sha256, unpkg fayllaridan hisoblab tekshirildi) + `crossorigin` qo'shildi.
- (4) **ASP_OFF 2027:** ro'yxatga 2027-yil federal bayramlarining kuzatiladigan sanalari qo'shildi (2026 naqshida: Juneteenth → 06-18, Mustaqillik → 07-05, Rojdestvo → 12-24).
- (5) **CI:** `.github/workflows/check.yml` — har push/PR da node --check, JSON validligi, takroriy ID va versiya izchilligi tekshiriladi.
- **API kalitlar (foydalanuvchi harakati kerak):** TomTom va AirLabs kalitlari statik frontendda ochiq qoladi — bu GitHub Pages arxitekturasida muqarrar; himoya panel tomondan: TomTom va AirLabs kabinetlarida kalitga `hayotus.github.io` referer/domen cheklovi qo'yish kerak. Eski bo'limdagi "kalitlar yo'q — PASS" yozuvi v8.7 dan keyin eskirgan.
- SW tlc-pro-v54, assetlar ?v=127. Lokal tekshiruvlar: node --check (app.js, sw.js) PASS; versiya izchilligi PASS.
- **NOT TESTED:** Wipe/Reset ning fizik qurilmadagi (iPhone Safari) IDB o'chirish oqimi; CI birinchi ishga tushishi.

## v10.28 (2026-11-08) — Home avtomatik masshtab (foydalanuvchi so'rovi)
- Muammo: qisqa displeylarda Home (fiks balandlik + overflow:hidden) ning pastki qismi kesilib qolardi, scroll ham yo'q edi; versiya qatori yopiq "Batafsil" ichida qolgan edi.
- (1) **fitHome()** (app.js): Home kontentining tabiiy balandligi konteynerdan oshsa, `#view-home` ga proportsional `zoom` qo'llanadi (kamida 0.6) — birinchi sahifa to'liq ekranga sig'adi, scroll kerak emas, masshtab displey balandligiga avtomatik moslashadi. "Batafsil" ochiq bo'lganda yoki Drive rejimda zoom o'chadi (ichki scroll saqlanadi). Qayta hisob: yuklanishda, Home ga qaytganda, resize/orientation da, "Batafsil" ochilib-yopilganda.
- (2) Versiya qatori "Batafsil" ichidan Home ning eng oxiriga (tashqariga) ko'chdi — birinchi sahifa pastida doim ko'rinadi.
- SW tlc-pro-v55, assetlar ?v=128. Lokal tekshiruv: node --check (app.js, sw.js) PASS; versiya izchilligi PASS.
- **NOT TESTED:** fizik qurilmadagi (iPhone Safari) yakuniy ko'rinish va zoom harakati — foydalanuvchi jonli saytda tekshiradi.

## v10.29 (2026-11-08) — Versiya qatori fixed pastda (foydalanuvchi so'rovi, v10.28 QA tuzatishi)
- **v10.28 jonli QA: FAIL (qisman)** — brauzer tekshiruvi (1920×1000): sahifa to'liq chiziladi, lekin versiya qatori ekranda ko'rinmadi — Home konteyneri (overflow:hidden) uni kesib qolgan; fitHome zoom i ishga tushmagan (flex konteynerda scrollHeight o'lchovi ishonchsiz chiqdi). Foydalanuvchi ham "yarim ochilyapti" deb tasdiqladi.
- (1) Versiya qatori endi alohida `#verLine` element: Home ning eng pastida **fixed** (pastki navigatsiya tepasida), 11px kichik harf, faqat Home faol bo'lganda ko'rinadi — konteyner kesishiga bog'liq emas, doim ko'rinadi.
- (2) fitHome o'lchovi bolalar rect lari bo'yicha qayta yozildi (scrollHeight o'rniga) + kech qayta hisoblar (2.2s, 4.8s) qo'shildi — asinxron kontent o'sishini ham ushlaydi.
- SW tlc-pro-v56, assetlar ?v=129. Lokal: node --check PASS.
- **NOT TESTED:** fizik qurilmada yakuniy ko'rinish — jonli brauzer tekshiruvi va foydalanuvchi tasdig'i kutiladi.

## v10.30 (2026-11-08) — Home/Menu almashtirishda ekran kichrayishi tuzatildi
- **Shikoyat:** foydalanuvchi telefonda Menu va Home tugmalari bosilganda (view almashtirilganda) ekran kichkina bo'lib qolishini xabar qildi (skrinshot bilan).
- **Sabab:** v10.29 `fitHome()` kontent konteynerdan biroz baland bo'lsa, butun Home ni `zoom` bilan kichraytirardi (pol 0.6). Telefonda kontent deyarli har doim balandroq (~825 ga ~720-790), shuning uchun kichrayish doimiy edi; view almashtirishda o'lchov 80 ms da — kontent (bestReasons, ob-havo, shriftlar) joylashmasdan olinib, keyin qayta tuzatilmasdi, kichrayish qolib ketardi.
- **Tuzatish (fitHome v2):** (1) avval `compact` CSS tartibi — oraliqlar/paddinglar kichrayadi, yordamchi `.src` yozuvlar yashirinadi, masshtab o'zgarmaydi; (2) zoom faqat compact ham sig'dira olmasa va **0.85 dan past emas**; (3) o'lchovdan oldin majburiy reflow (`void offsetHeight`), refitlar: renderHome oxirida, `document.fonts.ready` da, Home ga qaytishda 80 + 450 ms; (4) fitHome endi Home faol bo'lmasa ishlamaydi, Batafsil ochiq/Drive da compact ham tozalanadi.
- SW tlc-pro-v57, assetlar ?v=130. Lokal tekshiruvlar: node --check (app.js, sw.js) PASS; versiya izchilligi (v10.30 / ?v=130 / v57) PASS.
- **Cheklov:** bulut brauzerida telefon viewport emulyatsiyasi (402x874) mavjud emas — desktop (1919x998) da v10.29 da ham kichrayish kuzatilmadi (need≈have), telefon o'lchami raqamli o'lchanmadi; mexanizm koddan tasdiqlangan, yakuniy tasdiq — foydalanuvchi telefoni.

## v10.31 (2026-11-08) — Airports: Real time / Historical tanlovi
- Foydalanuvchi soʻrovi: Airports dagi maʼlumotlar real rejimda boʻlsin + Real time va Historical ni tanlash mumkin boʻlsin.
- Rejim tugmalari Airports tepasida: 🔴 Real time / 📊 Historical + 🔄 Yangilash; tanlov settings.apMode da saqlanadi (default: live). Holat satri (apUpd): rejim, manbalar, oxirgi yangilanish vaqti, avto-yangilanish ≈5 daq (ekran ochiq boʻlsa).
- REAL TIME (yangi): (1) AirLabs reyslari endi server tomonda arr_iata boʻyicha filtrlanadi (har aeroportga alohida soʻrov — yengil), yangilanish 30 daq → 4 daq; hours6 — keyingi 6 soat qoʻnishlari jonli pozitsiyalardan. (2) TomTom jonli yoʻl vaqti har aeroportga (traffic=true): haqiqiy ETA + tirbandlik kechikishi, 8 daq throttle. (3) Ball butunlay jonli: L toʻlqin (60 daq) ×0.50 + F yaqin oqim (30 daq) ×0.25 + P jonli yoʻl ×0.25. (4) Grafik: keyingi 6 soat jonli qoʻnishlar.
- HISTORICAL: avvalgi xatti-harakat (TLC naqsh, H+P ball, 24s grafik) — renderAirportsHist.
- Sinovdan oʻtmagan gʻoya: AirLabs /schedules — bepul kalitda faqat ~2 soat eskirgan landed oynasini beradi (lag 112 daq oʻlchandi), shuning uchun ishlatilmadi; kelajakdagi jadval sifatida yolgʻon boʻlardi.
- Tekshiruv: node --check OK; jonli API parsing testi (JFK 87 reys/next60 32, LGA 59/33, EWR 54/27; TomTom JFK 56 daq, +6 daq tirbandlik). SW tlc-pro-v58, assetlar ?v=131.

## v10.32 (2026-11-08) — Historical rejim tozaligi + zones qayta urinish
- v10.31 jonli QA topilmasi: Historical rejimda kartalarda LIVE belgilari va jonli reyslar bloki qolib ketgan (aralash signallar), ballga ham jonli L aralashgan. Endi Historical mutlaqo tarixiy: airportScore(pureHist) L ni hisobga olmaydi (faqat H+P), kartalarda jonli blok va LIVE belgisi yoʻq, taqqoslashda "Pikap hozir" qatori, eng yaxshi kartada jonli sabab/maslahat yoʻq.
- loadZones endi xatoda 5 soniyadan keyin bir marta oʻzi qayta urinadi (QA dagi boʻsh grafik GitHub Pages deploy tiqilishi paytidagi bir martalik holat edi — jonli zones.json 200/8810 bayt tekshirildi).
- Tekshiruv: node --check OK. SW tlc-pro-v59, assetlar ?v=132.

## v10.33 (2026-11-08) — Init tartibi: maʼlumot yuklagichlar xaritadan oldin
- Topilma (v10.31/v10.32 jonli QA): bulut brauzerda zones.json HECH yuklanmadi, apiStat dagi boshqa manbalar ham "tekshirilmagan" qoldi — sabab: initMaps() init da loadZones/loadWeather/loadClosures/loadEvents DAN OLDIN chaqirilardi; Leaflet (unpkg) oʻsha muhitda kelmasa, initMaps dagi xato butun init zanjirini uzardi (telefonda Leaflet yuklanadi — muammo koʻrinmagan).
- Tuzatish: barcha maʼlumot yuklagichlar va SW roʻyxati initMaps DAN OLDINGA koʻchirildi; initMaps try/catch ichida + 3 soniyadan keyin qayta urinish; initMaps ichida typeof L tekshiruvi.
- Tekshiruv: node --check OK. SW tlc-pro-v60, assetlar ?v=133.

## v10.34 (2026-11-08) — zones yuklanishini kafolatlash
- v10.33 QA: xarita sogʻ chiqdi (Leaflet aybdor emas), lekin zones baribir yuklanmadi. Endi: loadZones chaqirilganda apiStat darhol "yuklanmoqda…" boʻladi (chaqirilmagan vs osilgan ajratiladi), in-flight guard qoʻshildi, go() har navigatsiyada loadZones ni chaqiradi, init da yuklagichlar renderlardan oldin turadi.
- Tekshiruv: node --check OK. SW tlc-pro-v61, assetlar ?v=134.

## v10.35 (2026-11-08) — zones: keshni aylanib qayta urinish
- v10.34 QA: Historical ISHLADI (raqamlar zones.json we[] bilan aynan mos), lekin Settings dagi holat satri XATO boʻlib qoldi — birinchi fetch eski SW keshi dagi buzuq nusxaga urilgan boʻlishi mumkin. Endi: qayta urinishlar zones.json?nc=<vaqt> bilan keshi aylanadi, urinishlar cheksiz (5s→60s backoff) ZD kelguncha; muvaffaqiyatda holat OK boʻladi.
- Tekshiruv: node --check OK. SW tlc-pro-v62, assetlar ?v=135.

## v10.36 (2026-11-08) — zones holati yerdagi haqiqatdan (ZD) chiqariladi
- Bulut brauzer profilida (5 ta SW almashinuvi + tiqilgan deploylar) zones maʼlumoti yuklanib ishlasa ham, Settings dagi holat yozuvi eski XATO boʻlib qolaverdi. Endi renderApiStat zones qatorini ZD dan chiqaradi: maʼlumot bor boʻlsa — doim "OK · (20 zona)". Indikator hech qachon yolgʻon XATO koʻrsatmaydi.
- Tekshiruv: node --check OK. SW tlc-pro-v63, assetlar ?v=136.

## v10.37 (2026-11-09) — Xarita Tesla belgisi rangi
- Foydalanuvchi soʻrovi: xarita chap menyusidagi Tesla belgisi oʻchirilganda juda toʻq (toʻq qizil #8B0000) koʻrinardi. Endi: oʻchiq holatda toʻq kulrang (#5a5a5e), yoniq (ON) holatda toʻq qizil (#8B0000). style.css dagi toʻrt qoida oʻzgardi (chap menyu .mc-btn va qatlam pill .mpill — ikkalasi ham bir xil Tesla belgisi).
- Tekshiruv: node --check (sw.js) OK. SW tlc-pro-v64, assetlar ?v=137.

## v10.38 (2026-11-09) — Xarita Airport belgisi — haqiqiy samolyot
- Foydalanuvchi soʻrovi: chap menyudagi Airport tugmasi qogʻoz samolyot (send) belgisida edi — aeroportligi bilinmasdi. Endi toʻliq samolyot silueti (Material "flight" belgisi, currentColor): oʻchiqda kulrang, yoniqda toʻq sariq (#FF9500) — qolgan qatlam tugmalari bilan bir xil tizim.
- Tekshiruv: node --check OK. SW tlc-pro-v65, assetlar ?v=138.

## v10.39 (2026-11-09) — Xarita tugmalarida ON/OFF yozuvi
- Foydalanuvchi soʻrovi: chap menyudagi barcha tugmalar tagida EZPass dagi kabi ON/OFF yozuvi boʻlsin. Qoʻshildi: Traffic, Restroom, Tesla, Location, Cruise, Airport va Theme (tungi xarita) tugmalariga .mc-state yozuvi — yoniqda yashil "ON", oʻchiqda kulrang "OFF"; mapToggle/updateTrafficUI/updateThemeUI holat bilan sinxron yangilaydi. Recenter — harakat tugmasi, yozuvsiz qoldi.
- Tekshiruv: node --check OK. SW tlc-pro-v66, assetlar ?v=139.

## v10.40 (2026-11-09) — Talab xaritasi: doiralardan Uber-uslubidagi heatmap ga
- Foydalanuvchi soʻrovi (ovozli chatda tasdiqlangan): Map dagi qattiq chetli talab doiralari oʻrniga yumshoq, bir-biriga ulanadigan issiqlik maydoni — kam joyda och sariq, oʻrtada toʻq sariq, eng koʻp joyda qizil.
- Amalga oshirish: Leaflet.heat 0.2.0 plugin (unpkg, SRI sha256-65UqrlgGoRAnKfKRuriH3eeDrOhZgZo1SCenduc+SGo=) — heatCircles() endi zoneScores() dagi D (tarixiy, TLC 2025-09, joriy soat) boʻyicha canvas heat qatlamini chizadi: radius 58, blur 38, max 100, gradient #ffffcc → #ffeda0 → #feb24c → #fd8d3c → #fc4e2a → #bd0026. Maʼlumot manbai va "tarixiy" belgisi OʻZGARMADI — live deb yozilmagan.
- Popup saqlandi: heat ustida har zona uchun shaffof bosiladigan doira (fillOpacity 0) — bosilsa nomi, Talab (tarixiy) D/100, Ball va TLC pikap/soat chiqadi.
- Fallback: plugin yuklanmasa (L.heatLayer yoʻq boʻlsa yoki xato bersa), eski rangli doiralar avtomatik ishlaydi — xarita buzilmaydi.
- Ikkala xaritada (Map + Home) va refresh yoʻlida (heat qayta yaratiladi) ishlaydi — heatCircles chaqiruvchilari oʻzgarmadi.
- Tekshiruv: node --check OK. SW tlc-pro-v67, assetlar ?v=140.
