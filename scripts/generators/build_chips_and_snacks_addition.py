import json
import os

with open("/tmp/audit_summary_30_brands.json") as f:
    audit_summary = json.load(f)

def ean13_checksum(code12: str) -> str:
    odds = sum(int(code12[i]) for i in range(0, 12, 2))
    evens = sum(int(code12[i]) for i in range(1, 12, 2))
    total = odds + evens * 3
    check = (10 - (total % 10)) % 10
    return code12 + str(check)

# Let's inspect the missing items per brand
missing_items = []
barcode_counter = 1

def next_barcode():
    global barcode_counter
    code12 = f"890893{barcode_counter:06d}"
    barcode_counter += 1
    return ean13_checksum(code12)

# Specific product definitions generator for all missing items
# We'll map each missing product with realistic nutritional profiles, ingredients, and categories
