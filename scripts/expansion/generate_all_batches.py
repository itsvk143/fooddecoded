import json
import re

# Load existing cache
with open("scripts/data/existing_products_cache.json") as f:
    cache = json.load(f)

existing_barcodes = set(cache.get("barcodes", []))
existing_names = set([n.lower().strip() for n in cache.get("names", [])])

with open("scripts/expansion/batch1_snacks_bakery.ts") as f:
    t = f.read()
for b in re.findall(r'barcode:\s*"([^"]+)"', t):
    existing_barcodes.add(b)

def ean13_with_check(code12: str) -> str:
    s = 0
    for idx, char in enumerate(code12):
        n = int(char)
        s += n if idx % 2 == 0 else n * 3
    check = (10 - (s % 10)) % 10
    return f"{code12}{check}"

def get_unique_barcode(cat_num: int, item_idx: int) -> str:
    base = f"89078{cat_num:02d}{item_idx:05d}"
    bc = ean13_with_check(base)
    if bc in existing_barcodes:
        base = f"89098{cat_num:02d}{item_idx:05d}"
        bc = ean13_with_check(base)
    existing_barcodes.add(bc)
    return bc

print("Helper ready. Existing barcodes to avoid:", len(existing_barcodes))
