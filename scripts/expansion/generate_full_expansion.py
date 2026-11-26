import json
import os
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

def format_ts_file(var_name: str, items: list) -> str:
    lines = [
        'import { ProductCandidate } from "../lib/insert-products-helper";',
        '',
        f'export const {var_name}: ProductCandidate[] = ['
    ]
    current_cat = None
    for idx, item in enumerate(items):
        cat = item['category']
        if cat != current_cat:
            current_cat = cat
            lines.append(f"  // =========================================================================")
            lines.append(f"  // CATEGORY: {cat}")
            lines.append(f"  // =========================================================================")
        
        bc = item.get('barcode') or get_unique_barcode(item['cat_num'], idx + 1)
        name = item['name'].replace('"', '\\"')
        brand = item['brand'].replace('"', '\\"')
        manufacturer = item['manufacturer'].replace('"', '\\"')
        sub = item['subCategory'].replace('"', '\\"')
        ptype = item['productType'].replace('"', '\\"')
        flavour_line = f'    flavour: "{item["flavour"]}",\n' if item.get('flavour') else ''
        nutri = item['nutritionPer100g']
        
        lines.append('  {')
        lines.append(f'    barcode: "{bc}",')
        lines.append(f'    name: "{name}",')
        lines.append(f'    brand: "{brand}",')
        lines.append(f'    manufacturer: "{manufacturer}",')
        lines.append(f'    category: "{item["category"]}",')
        lines.append(f'    categorySlug: "{item["categorySlug"]}",')
        lines.append(f'    subCategory: "{sub}",')
        lines.append(f'    productType: "{ptype}",')
        if flavour_line:
            lines.append(flavour_line.rstrip())
        lines.append(f'    packageSize: "{item["packageSize"]}",')
        lines.append(f'    servingSize: "{item["servingSize"]}",')
        lines.append(f'    remoteImageUrl: "{item.get("remoteImageUrl", "")}",')
        lines.append(f'    sourceUrl: "{item.get("sourceUrl", "")}",')
        lines.append(f'    ingredientsText: "{item["ingredientsText"].replace(chr(34), chr(92)+chr(34))}",')
        lines.append(f'    nutritionPer100g: {{ calories: {nutri["calories"]}, totalFat: {nutri["totalFat"]}, saturatedFat: {nutri["saturatedFat"]}, transFat: {nutri.get("transFat", 0.0)}, carbohydrates: {nutri["carbohydrates"]}, sugars: {nutri["sugars"]}, addedSugars: {nutri.get("addedSugars", 0.0)}, fiber: {nutri.get("fiber", 0.0)}, protein: {nutri["protein"]}, sodium: {nutri["sodium"]}, salt: {nutri["salt"]} }}')
        lines.append('  },')
    
    lines.append('];')
    return '\n'.join(lines)
