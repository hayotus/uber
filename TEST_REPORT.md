# TEST REPORT — NYC Driver Dashboard v3.0

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
