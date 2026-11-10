import json
import os

with open("reports/existing-barcodes.json", "r") as f:
    existing_barcodes = set(json.load(f))

used_barcodes = set(existing_barcodes)

def get_unique_barcode(base_prefix, index):
    code = f"890{base_prefix:03d}{index:06d}"
    s = 0
    for i, ch in enumerate(code):
        d = int(ch)
        s += d * (1 if i % 2 == 0 else 3)
    check = (10 - (s % 10)) % 10
    barcode = f"{code}{check}"
    if barcode in used_barcodes:
        return get_unique_barcode(base_prefix, index + 5000)
    used_barcodes.add(barcode)
    return barcode

print("Barcode generator initialized. Current used barcodes:", len(used_barcodes))
