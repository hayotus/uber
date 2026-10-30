# NYC Driver Dashboard — Driver Intelligence

**v2.0 (2026-10-30)** — yorug' (light) redesign: oq kartalar, katta soat paneli, 2×2 asosiy kartalar (Best Location / Airports / Earnings / Road Alerts) va Main navigation panjara — foydalanuvchi yuborgan konsept skrinshoti asosida. Barcha 16 funksiya saqlangan.

NYC Uber/TLC haydovchilari uchun yagona Driver Intelligence Dashboard.
Jonli sayt: https://hayotus.github.io/uber/

> Bu loyiha **alohida** repozitoriy. NYC Airport Radar (hayotus.github.io) loyihasi bilan aralashmaydi va unga tegmaydi.

## Tuzilma

- `index.html` — butun ilova bitta faylda (200 KB dan kichik), PWA sifatida iPhone Home Screen'ga o'rnatiladi
- `manifest.json`, `sw.js`, `icon.svg` — PWA yordamchi fayllari (offline qobiq uchun)
- Ma'lumot saqlash: `localStorage` (jurnal va sozlamalar faqat qurilmada)

## 16 modul

1. Demand Heatmap — TLC tarixiy safarlari asosida talab xaritasi (HISTORICAL)
2. Airport Queue Monitor — JFK/LGA/EWR kutish bahosi (ESTIMATED — Uber ichki navbati ochiq emas)
3. Best Next Location — Smart Engine tavsiyasi
4. Driver Earnings Calculator — tushum, elektr (kWh), toll, sof foyda, $/soat, $/mil
5. Events & Surge Forecast — tadbirlar va taxminiy surge (ESTIMATED)
6. Road Closure Monitor — yopilishlar (rasmiy tekshiruv: NYC DOT / 511NY)
7. Driver Journal — smena jurnali, bugun/hafta statistikasi, CSV eksport
8. Voice Assistant — ovozli buyruqlar va tavsiyani ovoz chiqarib o'qish
9. Smart Driver Intelligence — Score = 0.30·D + 0.20·F + 0.15·E + 0.15·W + 0.10·T + 0.10·P
10. NYC Hotspot Ranking — hududlar reytingi
11. Weather & Rain Radar — Open-Meteo (LIVE) + RainViewer radar qatlami
12. Speed Limit & Traffic Camera — NYC 25 mph + OSM kamera nuqtalari
13. Restroom & Rest Stop — OSM jonli so'rov + zaxira ro'yxat
14. Parking Assistant — ASP holati, meter qoidalari, garajlar (ESTIMATED)
15. EV Charging Assistant — OSM zaryadlash stansiyalari + zaxira ro'yxat
16. Flight Arrival Predictor — kelishlar ritmi modeli (ESTIMATED)

## Ma'lumot ishonchliligi

Har bir modulda belgi bor: **LIVE** (jonli API), **ESTIMATED** (taxminiy model), **HISTORICAL** (tarixiy ma'lumot).
TLC tarixi jonli Uber talabini bildirmaydi; surge va aeroport navbati Uber'ning ichki ma'lumotisiz faqat taxmin qilinadi.

## Xavfsizlik

- HTML ichida maxfiy API kalitlari yo'q (ochiq kalitsiz manbalar ishlatiladi)
- Tashqi ma'lumot `textContent`/escape orqali chiqariladi (XSS himoyasi)
- API xatosida sayt ishdan chiqmaydi — keshlangan/zaxira ma'lumot ko'rsatiladi
- Jurnal eksporti (CSV) bor — brauzer tozalansa ma'lumot yo'qolishi mumkin
