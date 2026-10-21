import json, time, urllib.parse, urllib.request, string, sys

# More seeds than v1 to cover all clusters (logistics, pallets, vehicles, weights, law, freight cost, bulk density).
SEEDS = json.load(open(sys.argv[2], encoding="utf-8"))
EXPAND = set(json.load(open(sys.argv[3], encoding="utf-8")))

def fetch(q):
    url = "https://suggestqueries.google.com/complete/search?client=firefox&hl=de&gl=de&q=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8", "replace"))[1]

data = {}  # suggestion -> {"calls": n, "best_rank": r, "seeds": set}
def add(seed, q):
    try:
        res = fetch(q)
    except Exception as e:
        print("ERR", q, e, file=sys.stderr)
        res = []
    for i, s in enumerate(res, 1):
        d = data.setdefault(s, {"calls": 0, "best_rank": 99, "seeds": set()})
        d["calls"] += 1
        d["best_rank"] = min(d["best_rank"], i)
        d["seeds"].add(seed)
    time.sleep(0.3)

for seed in SEEDS:
    add(seed, seed)
    add(seed, seed + " ")
    if seed in EXPAND:
        for ch in string.ascii_lowercase:
            add(seed, f"{seed} {ch}")

out = {k: {"calls": v["calls"], "best_rank": v["best_rank"], "seeds": sorted(v["seeds"])} for k, v in sorted(data.items())}
json.dump(out, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(out), "unique suggestions")
