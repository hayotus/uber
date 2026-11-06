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
