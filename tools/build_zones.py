#!/usr/bin/env python3
"""
build_zones.py — NYC Driver Dashboard uchun zones.json quradi.

MA'LUMOT MANBAI (ochiq, kalitsiz):
  NYC Open Data (Socrata API) — "2025 High Volume FHV Trip Data"
  dataset: nt46-nv3c  (https://data.cityofnewyork.us/resource/nt46-nv3c.json)
  Bu — Uber/Lyft (High Volume FHV) safarlari, TLC tomonidan e'lon qilinadi.
  Zona nomlari/ID: TLC taxi_zone_lookup.csv
  (https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv)

DAVR: 2025-09-01 .. 2025-09-28 (4 to'liq hafta: 20 ish kuni + 8 dam olish kuni)

CHIQISH: ../zones.json
  Har bir ilova-zonasi uchun TLC LocationID lar yig'indisidan:
    wd[24] — ish kunlarida o'rtacha pickup/soat
    we[24] — dam olish kunlarida o'rtacha pickup/soat
    daily  — o'rtacha kunlik pickup
  peakRef — barcha zonalar/soatlar bo'yicha maksimal o'rtacha (ilovada 0-100 normalash uchun)
  EWR (Newark, LocationID=1): NYC HVFHS da pickup deyarli yo'q (NJ hududi) —
  shuning uchun EWR uchun DROPOFF soni olinadi (meta da ochiq yozilgan).

Ishlatish:  python3 tools/build_zones.py
Ixtiyoriy: SOCRATA_APP_TOKEN muhit o'zgaruvchisi (bo'lmasa ham ishlaydi, sekinroq).
Talablar: faqat standart kutubxona (urllib) — qo'shimcha paket kerak emas.
"""
import json, os, sys, time, urllib.request, urllib.parse
from datetime import date, timedelta

API = "https://data.cityofnewyork.us/resource/nt46-nv3c.json"
TOKEN = os.environ.get("SOCRATA_APP_TOKEN", "")
PERIOD_START = date(2025, 9, 1)   # dushanba
PERIOD_END = date(2025, 9, 28)    # yakshanba (4 to'liq hafta)

# Ilova zonasi -> (tur, [TLC LocationID])  — ID lar taxi_zone_lookup.csv dan tekshirilgan
ZONES = {
    "Midtown Manhattan":            ("office",     [161, 163, 164, 100]),
    "Times Square / Theater":       ("nightlife",  [230]),
    "Grand Central / Midtown East": ("office",     [162, 170, 233, 229]),
    "Penn Station / Hudson Yards":  ("office",     [186, 246, 50]),
    "Financial District":           ("office",     [87, 88, 261, 12, 13]),
    "Chelsea / Meatpacking":        ("nightlife",  [68, 158, 90]),
    "SoHo / Tribeca":               ("nightlife",  [211, 231, 144]),
    "East Village / LES":           ("nightlife",  [79, 148, 4, 232]),
    "Upper East Side":              ("residential",[236, 237, 137]),
    "Upper West Side":              ("residential",[238, 239, 142, 143]),
    "Downtown Brooklyn":            ("office",     [65, 33, 97]),
    "Williamsburg":                 ("nightlife",  [255, 256, 80, 112]),
    "Harlem":                       ("residential",[41, 42, 116, 74, 75]),
    "Astoria":                      ("residential",[7, 8, 179, 145, 146]),
    "Flushing":                     ("residential",[92, 73, 171]),
    "Yankee Stadium / S. Bronx":    ("residential",[69, 247, 119, 168, 167]),
    "JFK Airport":                  ("airport",    [132]),
    "LaGuardia Airport":            ("airport",    [138]),
    "Newark Airport (EWR)":         ("airport",    [1]),   # dropoff asosida
    "St. George / SI Ferry":        ("residential",[206, 245, 221]),
}
COORDS = {  # ilova markazlari (xarita uchun)
    "Midtown Manhattan": (40.7549, -73.9840), "Times Square / Theater": (40.7590, -73.9845),
    "Grand Central / Midtown East": (40.7527, -73.9772), "Penn Station / Hudson Yards": (40.7505, -73.9934),
    "Financial District": (40.7075, -74.0113), "Chelsea / Meatpacking": (40.7420, -74.0064),
    "SoHo / Tribeca": (40.7233, -74.0020), "East Village / LES": (40.7265, -73.9815),
    "Upper East Side": (40.7736, -73.9566), "Upper West Side": (40.7870, -73.9754),
    "Downtown Brooklyn": (40.6930, -73.9870), "Williamsburg": (40.7081, -73.9571),
    "Harlem": (40.8116, -73.9465), "Astoria": (40.7720, -73.9301), "Flushing": (40.7670, -73.8331),
    "Yankee Stadium / S. Bronx": (40.8296, -73.9262), "JFK Airport": (40.6413, -73.7781),
    "LaGuardia Airport": (40.7769, -73.8740), "Newark Airport (EWR)": (40.6895, -74.1745),
    "St. George / SI Ferry": (40.6437, -74.0736),
}
ALL_PU_IDS = sorted({i for _, ids in ZONES.values() for i in ids} - {1})  # EWR alohida (dropoff)


def soql(params, retries=5):
    q = urllib.parse.urlencode(params)
    url = f"{API}?{q}"
    headers = {"User-Agent": "driver-dashboard-build/1.0"}
    if TOKEN:
        headers["X-App-Token"] = TOKEN
    for a in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=280) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            print(f"  so'rov xatosi ({a+1}/{retries}): {e}", file=sys.stderr)
            time.sleep(15 * (a + 1))
    raise SystemExit("Socrata so'rovi bajarilmadi — to'xtadim (taxmin qilinmaydi)")


def detect_monday_dow():
    """2025-09-01 — dushanba. Shu sanadagi dow kodi = dushanba kodi (avto-aniqlash)."""
    rows = soql({
        "$select": "date_extract_dow(pickup_datetime) as dow, count(*) as c",
        "$where": "pickup_datetime between '2025-09-01T00:00:00' and '2025-09-01T23:59:59'",
        "$group": "dow", "$limit": "10",
    })
    if len(rows) != 1:
        raise SystemExit(f"dow aniqlanmadi: {rows}")
    code = int(rows[0]["dow"])
    print(f"dow avto-aniqlash: dushanba kodi = {code}")
    return code


def fetch_day(day, field, ids):
    """Bir kunlik agregatsiya: {locid: {(hh, dow): count}} — yengil so'rov, qayta urinish arzon."""
    idlist = ",".join(str(i) for i in ids)
    rows = soql({
        "$select": f"{field} as loc, date_extract_hh(pickup_datetime) as hh, "
                   f"date_extract_dow(pickup_datetime) as dow, count(*) as c",
        "$where": f"pickup_datetime between '{day}T00:00:00' and '{day}T23:59:59' "
                  f"AND {field} in({idlist})",
        "$group": "loc, hh, dow", "$limit": "50000",
    })
    out = {}
    for r in rows:
        out.setdefault(int(r["loc"]), {})[(int(r["hh"]), int(r["dow"]))] = int(r["c"])
    return out


def main():
    monday = detect_monday_dow()
    weekend_codes = {(monday + 5) % 7 or 7, (monday + 6) % 7 or 7}  # shanba, yakshanba kodlari (1-7 sikl)
    # dow kodlari 1..7 siklik: shanba = monday+5, yakshanba = monday+6 (7 dan oshsa -7)
    def norm(x):
        while x > 7: x -= 7
        while x < 1: x += 7
        return x
    weekend_codes = {norm(monday + 5), norm(monday + 6)}
    print("dam olish dow kodlari:", weekend_codes)

    import os as _os
    ckpt_path = "/tmp/zones_ckpt.json"
    totals, done_days = {}, []
    if _os.path.exists(ckpt_path):
        ck = json.load(open(ckpt_path))
        done_days = ck["done"]
        for loc, cells in ck["totals"].items():
            totals[int(loc)] = {(int(h), bool(w)): c for (h, w), c in
                                ((eval(k), v) for k, v in cells.items())}
        print("checkpointdan davom:", len(done_days), "kun tayyor", flush=True)
    day = PERIOD_START
    while day <= PERIOD_END:
        ds = str(day)
        if ds not in done_days:
            for field, ids, tag in (("pulocationid", ALL_PU_IDS, "pickup"), ("dolocationid", [1], "EWR dropoff")):
                data = fetch_day(day, field, ids)
                for loc, cells in data.items():
                    for (hh, dow), c in cells.items():
                        k = (hh, dow in weekend_codes)
                        totals.setdefault(loc, {})[k] = totals.setdefault(loc, {}).get(k, 0) + c
            done_days.append(ds)
            ck_out = {"done": done_days, "totals": {str(loc): {str(k): v for k, v in cells.items()}
                                                    for loc, cells in totals.items()}}
            json.dump(ck_out, open(ckpt_path, "w"))
            print(f"kun tayyor: {ds} ({len(done_days)}/28)", flush=True)
        day += timedelta(days=1)

    WD_DAYS, WE_DAYS = 20, 8
    zones_out, peak = [], 0.0
    for name, (typ, ids) in ZONES.items():
        wd, we = [0.0] * 24, [0.0] * 24
        for loc in ids:
            for (hh, is_we), c in totals.get(loc, {}).items():
                if is_we: we[hh] += c / WE_DAYS
                else: wd[hh] += c / WD_DAYS
        wd = [round(x, 1) for x in wd]; we = [round(x, 1) for x in we]
        daily = round((sum(wd) * WD_DAYS + sum(we) * WE_DAYS) / (WD_DAYS + WE_DAYS), 1)
        peak = max(peak, max(wd + we))
        lat, lon = COORDS[name]
        zones_out.append({"name": name, "lat": lat, "lon": lon, "type": typ,
                          "tlcIds": ids, "wd": wd, "we": we, "daily": daily})
        print(f"{name}: kunlik o'rtacha {daily}, pik soat {max(wd + we)}")

    out = {
        "meta": {
            "source": "NYC Open Data — 2025 High Volume FHV Trip Data (TLC), dataset nt46-nv3c",
            "sourceUrl": "https://data.cityofnewyork.us/resource/nt46-nv3c.json",
            "period": "2025-09-01..2025-09-28 (4 hafta)",
            "generatedAt": time.strftime("%Y-%m-%d"),
            "note": "wd/we — o'rtacha pickup/soat (ish kuni / dam olish). EWR (id=1) uchun dropoff soni. "
                    "Bu TARIXIY naqsh — jonli talab emas.",
            "peakRef": round(peak, 1),
        },
        "zones": zones_out,
    }
    path = os.path.join(os.path.dirname(__file__), "..", "zones.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"\nyozildi: {os.path.abspath(path)} ({os.path.getsize(path)} bayt), peakRef={peak}")


if __name__ == "__main__":
    main()
