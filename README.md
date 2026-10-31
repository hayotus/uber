# NYC Driver Dashboard — Driver Intelligence Platform

NYC Uber/TLC haydovchilari uchun professional Driver Intelligence platformasi.
Jonli sayt: **https://hayotus.github.io/uber/** · Case12 uber dashboard

> Alohida loyiha. NYC Airport Radar (hayotus.github.io) bilan aralashmaydi.

## Versiyalar

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

PWA yordamchilari: `manifest.json`, `sw.js` (kesh: driver-dash-v3), `icon.svg`.

## Ekranlar

- **Home (Main Display)** — GPS hudud, talab, katta soat, ob-havo, Best Next Location + sabablar, Bugun gross/net/net-soat, Smart Score + Confidence + 2-variant, Airport activity, Demand mini-xarita, Hotspot TOP 5, Main navigation.
- **Map** — Leaflet qatlamlari: Talab, Kameralar, Zaryadlash, Hojatxona, Yomg'ir radari (RainViewer), Yopilishlar.
- **Airports** — Queue Monitor (ESTIMATED) + Flight Arrival Predictor grafigi.
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
