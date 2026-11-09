#!/usr/bin/env python3
"""
build_days.py — zones.json ga hafta kuni bo'yicha pattern qo'shadi: days[7][24].

Manba/build_zones.py bilan AYNAN bir xil: NYC Open Data nt46-nv3c (TLC HVFHS),
davr 2025-09-01..2025-09-28 (har hafta kuni aniq 4 marta), o'sha tlcIds.
days[d][h] — d-kuni (0=dushanba .. 6=yakshanba) h-soatda o'rtacha pikap/soat (4 kunga bo'lingan).
EWR (id=1) — dropoff (build_zones.py dagi kabi). Mavjud wd/we/daily/peakRef SAQLANADI —
fayl qayta qurilmaydi, faqat "days" va meta.daysNote qo'shiladi.
Tekshiruv: mean(days[0..4]) ≈ wd, mean(days[5..6]) ≈ we bo'lishi shart (kichik farq = yaxlitlash).
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_zones as bz
from datetime import date, timedelta

CKPT = "/tmp/zones_days_ckpt.json"
ZONES_PATH = os.path.join(os.path.dirname(__file__), "..", "zones.json")


def fetch_day_hh(day, field, ids):
    """Bir kunlik agregatsiya: {loc: {hh: count}} (kun o'zi weekday ni beradi — dow kerak emas)."""
    idlist = ",".join(str(i) for i in ids)
    rows = bz.soql({
        "$select": f"{field} as loc, date_extract_hh(pickup_datetime) as hh, count(*) as c",
        "$where": f"pickup_datetime between '{day}T00:00:00' and '{day}T23:59:59' "
                  f"AND {field} in({idlist})",
        "$group": "loc, hh", "$limit": "50000",
    })
    out = {}
    for r in rows:
        out.setdefault(int(r["loc"]), {})[int(r["hh"])] = int(r["c"])
    return out


def main():
    # totals[(loc, weekdayIdx, hh)] = count
    totals, done_days = {}, []
    if os.path.exists(CKPT):
        ck = json.load(open(CKPT))
        done_days = ck["done"]
        for k, v in ck["totals"].items():
            loc, wd_, hh = k.split("|")
            totals[(int(loc), int(wd_), int(hh))] = v
        print("checkpointdan davom:", len(done_days), "kun tayyor", flush=True)

    day = bz.PERIOD_START
    while day <= bz.PERIOD_END:
        ds = str(day)
        if ds not in done_days:
            wdi = day.weekday()  # 0=Mon .. 6=Sun (2025-09-01 dushanba)
            for field, ids in (("pulocationid", bz.ALL_PU_IDS), ("dolocationid", [1])):
                data = fetch_day_hh(day, field, ids)
                for loc, hours in data.items():
                    for hh, c in hours.items():
                        k = (loc, wdi, hh)
                        totals[k] = totals.get(k, 0) + c
            done_days.append(ds)
            json.dump({"done": done_days,
                       "totals": {f"{l}|{w}|{h}": v for (l, w, h), v in totals.items()}},
                      open(CKPT, "w"))
            print(f"kun tayyor: {ds} (weekday {wdi}) ({len(done_days)}/28)", flush=True)
        day += timedelta(days=1)

    zdoc = json.load(open(ZONES_PATH, encoding="utf-8"))
    OCC = 4  # har hafta kuni davrda 4 marta
    problems = []
    for z in zdoc["zones"]:
        days = [[0.0] * 24 for _ in range(7)]
        for loc in z["tlcIds"]:
            for d in range(7):
                for h in range(24):
                    days[d][h] += totals.get((loc, d, h), 0) / OCC
        days = [[round(x, 1) for x in row] for row in days]
        z["days"] = days
        # muvofiqlik: Mon..Fri o'rtachasi ≈ wd, Sat..Sun ≈ we
        for h in range(24):
            mw = sum(days[d][h] for d in range(5)) / 5
            me = (days[5][h] + days[6][h]) / 2
            if abs(mw - z["wd"][h]) > max(1.0, 0.03 * z["wd"][h]):
                problems.append(f'{z["name"]} wd h{h}: days-mean {mw:.1f} vs wd {z["wd"][h]}')
            if abs(me - z["we"][h]) > max(1.0, 0.03 * z["we"][h]):
                problems.append(f'{z["name"]} we h{h}: days-mean {me:.1f} vs we {z["we"][h]}')
    zdoc["meta"]["daysNote"] = ("days[0=Du..6=Ya][24] — hafta kuni bo'yicha o'rtacha pikap/soat; "
                                "manba/davr wd/we bilan bir xil (nt46-nv3c, 2025-09-01..2025-09-28).")
    with open(ZONES_PATH, "w", encoding="utf-8") as f:
        json.dump(zdoc, f, ensure_ascii=False, separators=(",", ":"))
    print(f"\nyozildi: {os.path.abspath(ZONES_PATH)} ({os.path.getsize(ZONES_PATH)} bayt)")
    if problems:
        print(f"\n⚠️ MUVOFIQLIK OGOHLANTIRISHLARI ({len(problems)}):")
        for p in problems[:20]:
            print("  ", p)
    else:
        print("✅ muvofiqlik: barcha zona/soatlarda days o'rtachalari wd/we ga mos (3% ichida)")


if __name__ == "__main__":
    main()
