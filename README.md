# NYC Driver Dashboard — Driver Intelligence Platform

NYC Uber/TLC haydovchilari uchun professional Driver Intelligence platformasi.
Jonli sayt: **https://hayotus.github.io/uber/** · Case12 uber dashboard

> Alohida loyiha. NYC Airport Radar (hayotus.github.io) bilan aralashmaydi.

## Versiyalar

- **v6.3 (2026-10-31) — kesh tuzatishi.** Asset URL larga versiya qo'shildi (`app.js?v=63`, `style.css?v=63`) — Service Worker/CDN eski faylni tutib qolishi endi mumkin emas, har versiya darhol yetadi. (v6.2 QA sidagi "eski format" topilmasi shundan edi: kod serverda to'g'ri, profil keshi eskirgan edi — proba bilan isbotlandi.)
- **v6.2 (2026-10-31) — Radar uslubidagi reyslar ro'yxati.** Eng yaqin reyslar endi Radar dagi kabi: **qayerdan** (dep_iata → shahar nomi, Radar lug'ati) + **taxminiy qo'nish vaqti** — Radar formulasi: masofa/tezlik + 10 daq (API da vaqt yo'q; UI da "taxminiy" deb belgilangan). Manfiy balandlik 0 ft qilib qisqartirildi. Eskirgan "ADS-B" yorliqlari (tile, intro, grafik eslatmasi) AirLabs ga almashtirildi.
- **v6.1 (2026-10-31) — Aeroportlar LIVE: AirLabs.** Foydalanuvchi qarori bilan ADS-B (adsb.lol, brauzerda CORS) o'rniga Radar loyihasidagi **AirLabs** manbai ulandi (bitta umumiy so'rov, 10 daqiqa throttle — bepul kvota Radar bilan bo'lishiladi, kalit muddati 2026-11-24). Har aeroport: jonli kelayotgan reyslar soni, ≤50 mi yaqindagilar, eng yaqin 5 reys (balandlik/masofa). Tekshiruvda aniqlandi: bepul /flights javobida qo'nish vaqtlari yo'q — shuning uchun "keyingi soatda qo'nishlar" ko'rsatilmaydi, faqat real pozitsiya asosidagi sonlar. Tarixiy TLC bloki o'zgarishsiz.
- **v6.0 (2026-10-31) — 3-bosqich: UX/texnik.** Home soddalashtirildi: 3 asosiy blok (Best Next Location, Bugun/Earnings, Ogohlantirishlar) — Smart tahlil, aeroportlar, xarita, navigatsiya va TOP 5 endi "Batafsil" ochiluvchi bo'limida. **Haydash rejimi** (Settings da emas, Home hero tugmasida): tugmalar ≥48px, katta shrift, yuqori kontrast, ovozli buyruqlar ro'yxati ko'rinadi. Heatmap soat almashganda va sahifa qayta ko'ringanda yangilanadi. Kamera qatlami endi **haqiqiy OSM Overpass** dan (highway=speed_camera) — topilmasa zaxira ro'yxat "taxminiy" deb belgilanadi. `user-scalable=no` olib tashlandi. Bildirishnoma sozlamasi (ilova ichida) endi ishlaydi: yomg'ir ehtimoli ≥70% yoki faol "Yuqori" yopilish bo'lsa toast-ogohlantirish (soatiga 1 marta). **IndexedDB**: jurnal/sozlamalar/tavsiyalar IDB ga zaxira nusxalanadi (har saqlashda + 60 soniyada); localStorage tozalansa IDB dan tiklanadi. **Fayllar bo'lindi**: `index.html` (27 KB qobiq) + `style.css` + `app.js` (ES module, buildsiz); SW keshi Leaflet + zones.json + yangi fayllarni o'z ichiga oladi.
- **v5.0 (2026-10-31) — 2-bosqich: kalibrlash.** Jurnal yozuviga **hudud (zona)** va **boshlanish soati** qo'shildi (CSV eksportda ham). GO tavsiyalari endi komponentlar snapshoti (D/F/E/W/T/P) bilan yoziladi. Analytics da **"Tavsiya aniqligi"**: tavsiya + o'sha kun/hududdagi real smena solishtiriladi (bog'langan juftliklar, aniqlik %, o'rtacha $/soat vs umumiy o'rtacha). **30+ hududli smena** yig'ilganda Settings da **tavsiya etilgan koeffitsiyentlar** chiqadi (Pearson korrelyatsiyasi asosida, 0.05 qadam bilan, yig'indi=1) — **avtomatik qo'llanmaydi**, faqat foydalanuvchi "Qo'llash"ni bossa `settings.weights` ga yoziladi; "Standartga qaytarish" ham bor. $/soat endi qatlamli: hudud+soat (≥2) → hudud (≥2) → umumiy.
- **v4.0 (2026-10-30) — 1-bosqich: haqiqiy ma'lumot.** Qo'lda yozilgan talab ballari (d/f/e) olib tashlandi — talab endi **NYC TLC HVFHS** real safarlaridan hisoblangan `zones.json` dan olinadi (pastda "Ma'lumot manbai" bo'limi). `perHour = 16 + score*0.52` uydirma formulasi o'chirildi: $/soat faqat foydalanuvchi jurnalidagi real smenalardan ko'rsatiladi, bo'lmasa "ma'lumot yo'q". Aeroport seed-random modeli o'chirildi — o'rniga jonli **ADS-B (adsb.lol, LIVE)** + TLC tarixiy oqim (HISTORICAL); uydirma navbat/kutish raqamlari yo'q. Ob-havo komponenti zona koordinatasi bo'yicha (Open-Meteo ko'p nuqtali so'rov), yo'l komponenti faqat faol yopilish radiusi ichidagi zonalarga ta'sir qiladi. Events/Closures aniq start/end oynalariga ega; eskirgan tadbirlar avtomatik yashiriladi. HOUR_MULT o'chirildi — soatlik naqsh ma'lumotning o'zidan (ish kuni / dam olish kuni alohida).
- **v3.0 (2026-10-30)** — Master Development Prompt bo'yicha professional darajaga ko'tarildi: Tesla uslubidagi dark tema (Settings da Light variant ham bor), 9 ekran (Home, Map, Airports, Demand, Menu, Tools, Analytics, Settings, Journal), Smart Engine confidence + 2-variant + tavsiya logi, Journal tahrirlash/filtr, to'liq Settings, API holati paneli, offline indikatori.
- **v2.0 (2026-10-30)** — yorug' redesign (konsept skrinshoti asosida). Endi Settings → Tema → Light orqali tanlanadi.
- **v1.0 (2026-10-30)** — 16 modulli birinchi to'liq versiya (eski HTML5 UP shablon-stub o'rniga).

## Arxitektura (Phase 2)

Bitta `index.html` (200 KB dan kichik) ichida aniq qatlamlar:

1. **CONFIG/DATA** — hududlar (TLC tarixiy ball), aeroportlar, tadbirlar, zaxira ro'yxatlar, ASP kunlari.
2. **Data Service** — `fetchT` (timeout + AbortController), Overpass uchun mirror fallback, keshlash SW darajasida, `apiStat` holat kuzatuvi (Settings da ko'rinadi).
3. **Smart Engine** — barcha omillar 0–100 ga normallashtiriladi: Score = 0.30·Talab + 0.20·Reyslar + 0.15·Tadbirlar + 0.15·Ob-havo + 0.10·Yo'l + 0.10·Masofa (100 dan oshmaydi). Confidence: GPS mavjudligi, ob-havo jonliligi va 1–2-o'rin farqiga qarab 30–95 oralig'ida penaltilar bilan hisoblanadi. Har tavsiya sabablari bilan chiqadi; GO bosilsa tavsiya logga yoziladi (kelajakda kalibrlash uchun).
4. **UI modullari** — har biri alohida funksiya: DemandModule (heatmap/reyting), AirportModule, EarningsModule, EventsModule, ClosuresModule, JournalModule, VoiceModule, WeatherModule, CameraModule, RestroomModule, ParkingModule, ChargingModule, FlightModule, AnalyticsModule, SettingsModule.
5. **Storage** — `localStorage`: `drv_settings`, `drv_journal`, `drv_recs`. Server yo'q, ma'lumot qurilmadan chiqmaydi.

PWA yordamchilari: `manifest.json`, `sw.js` (kesh: driver-dash-v4; Leaflet + zones.json ham keshlanadi), `icon.svg`.

## Ekranlar

- **Home (Main Display)** — GPS hudud, talab, katta soat, ob-havo, Best Next Location + sabablar, Bugun gross/net/net-soat, Smart Score + Confidence + 2-variant, Airport activity, Demand mini-xarita, Hotspot TOP 5, Main navigation.
- **Map** — Leaflet qatlamlari: Talab, Kameralar, Zaryadlash, Hojatxona, Yomg'ir radari (RainViewer), Yopilishlar.
- **Airports** — Airport Monitor: jonli ADS-B (LIVE) + TLC tarixiy oqim kartalari + keyingi 6 soat oqim grafigi (HISTORICAL).
- **Demand** — Smart Engine tafsiloti + Hotspot Ranking jadvali.
- **Menu** — barcha 16 modul panjarasi.
- **Tools** — Earnings Calculator, Events, Closures, Voice, Weather, Camera, Restroom, Parking, EV Charging panellari.
- **Analytics** — jurnal statistikasi (jami gross/net, net/soat, net/mil, eng yaxshi kun), 7 kunlik grafik, tavsiyalar tarixi.
- **Settings** — profil, avtomobil, sarf/narx, texnik xizmat $/mil, afzal aeroportlar/hudud, tema, ovoz tili, birliklar (mi/km, mph/km-h), yangilash intervali, bildirishnoma (ilova ichida), API holati, eksport (JSON), lokal ma'lumotni tozalash, reset.
- **Journal** — qo'shish, **tahrirlash**, o'chirish, filtr (7/30 kun), CSV eksport.

## API konfiguratsiyasi (kalitlarsiz, ochiq manbalar)

| Manba | Ishlatilishi | Kalit |
|---|---|---|
| Open-Meteo | Ob-havo prognozi, yomg'ir ehtimoli | kerak emas |
| RainViewer | Yomg'ir radari tile'lari | kerak emas |
| Overpass (OSM) + kumi mirror | Hojatxona, zaryadlash, (kameralar zaxira) | kerak emas |
| Esri World Light Gray | Xarita tile'lari | kerak emas |
| NYC TLC trip records | Talab ballari — tarixiy, kodga o'rnatilgan agregat | — |

Frontend kodda **maxfiy kalit yo'q** va bo'lmaydi. Kalit talab qiladigan API kerak bo'lsa, GitHub Pages bilan mos yechim — kalitni domen+API bo'yicha cheklangan holda foydalanuvchi o'zi kiritadigan sozlama, yoki alohida backend/proxy (hozircha yo'q).

## Mavjud bo'lmagan / cheklangan API lar (halol ro'yxat)

- **Uber/Lyft navbati va surge** — yopiq ichki ma'lumot, API yo'q → modellar **ESTIMATED** deb belgilanadi.
- **AirLabs** — kalit talab qiladi; frontendga kalit qo'yilmaydi → Flight Predictor hozir ritm-modeli (ESTIMATED). Kalitli variant kerak bo'lsa, backend/proxy arxitekturasi alohida kelishiladi.
- **NYC DOT jonli yopilishlar feed'i** — ochiq API shaklida barqaror emas → ro'yxat + rasmiy havolalar (nyc.gov/dot, 511NY), ESTIMATED belgisi bilan.
- **Tesla Supercharger bandligi** — ochiq emas → OSM joylashuv + "Tesla ilovasida tekshiring" izohi.
- **Push bildirishnomalar** — PWA/GitHub Pages da to'liq push uchun server kerak → hozir faqat ilova-ichidagi holat indikatori.

## Ma'lumot ishonchliligi belgilari

**LIVE** (jonli API), **ESTIMATED** (model/taxmin), **HISTORICAL** (tarixiy), **LOCAL** (qurilmadagi ma'lumot). Taxmin hech qachon LIVE deb belgilanmaydi.

## O'rnatish

iPhone Safari → saytni ochish → Share → **Add to Home Screen**. Standalone rejimda ochiladi; interfeys va jurnal offline ham ishlaydi (jonli ma'lumot offline yangilanmaydi).

## Sinov

`TEST_REPORT.md` — funksiya kesimida PASS / FAIL / NOT TESTED ro'yxati (halol holat bilan).

## Ma'lumot manbai — zones.json (TLC)

`zones.json` qo'lda yozilmaydi. Uni `tools/build_zones.py` quradi:

- **Manba:** NYC Open Data (Socrata API) — *2025 High Volume FHV Trip Data*, dataset `nt46-nv3c` — ya'ni TLC e'lon qiladigan Uber/Lyft safarlari. Zona ID lari TLC `taxi_zone_lookup.csv` dan tekshirilgan.
- **Davr:** 2025-09-01..2025-09-28 (4 to'liq hafta: 20 ish kuni + 8 dam olish kuni).
- **Hisob:** har bir ilova-zonasi = bir nechta TLC LocationID yig'indisi (xarita skript ichida). Har zona uchun `wd[24]` (ish kuni) va `we[24]` (dam olish) — o'rtacha pikap/soat; `daily` — o'rtacha kunlik pikap; `peakRef` — normalash uchun global pik.
- **EWR (Newark, ID=1):** NJ hududi bo'lgani uchun HVFHS da pikap deyarli yo'q — EWR uchun **dropoff** soni ishlatiladi (skriptda va shu yerda ochiq yozilgan).
- **Yangilash:** `python3 tools/build_zones.py` (faqat standart kutubxona; ixtiyoriy `SOCRATA_APP_TOKEN` tezlashtiradi). Fayl ~10 KB.
- Bu **tarixiy naqsh** — jonli talab emas; ilovada HISTORICAL deb belgilanadi.

## Parvozlar — ADS-B

- **adsb.lol** (kalitsiz, ochiq ADS-B jamoat tarmog'i): aeroport atrofidagi jonli samolyotlar, past balandlikdagilar soni, eng yaqin reyslar ro'yxati — LIVE.
- Tekshirilib ishlamaganlari: **OpenSky** anonim API (yetib bo'lmadi + anonim kirish yopilgan), **FAA status** endpointi (yetib bo'lmadi). Ular ishlatilmaydi.
- Uber ichki navbat/surge ochiq emas — ilova uni uydirmaydi.
