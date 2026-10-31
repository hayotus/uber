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
