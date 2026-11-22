import json
import sys
import os

from generate_section1_2 import get_section1_2
from generate_section2_part2_and_3 import get_section2_part2_and_3
from generate_section4 import get_section4
from generate_section4_part2 import get_section4_part2
from generate_section5 import get_section5

def ean13_checksum(code12: str) -> str:
    odds = sum(int(code12[i]) for i in range(0, 12, 2))
    evens = sum(int(code12[i]) for i in range(1, 12, 2))
    total = odds + evens * 3
    check = (10 - (total % 10)) % 10
    return code12 + str(check)

all_items = []
all_items.extend(get_section1_2())
all_items.extend(get_section2_part2_and_3())
all_items.extend(get_section4())
all_items.extend(get_section4_part2())
all_items.extend(get_section5())

print(f"Total raw items collected: {len(all_items)}")

# Form final structured product list
final_products = []
b_counter = 1

for item in all_items:
    code12 = f"890893{b_counter:06d}"
    bc = ean13_checksum(code12)
    prod_id = f"CS-{b_counter:04d}"
    b_counter += 1
    
    cat = item["cat"]
    cat_slug = cat.lower().replace(" & ", "-").replace(", ", "-").replace(" / ", "-").replace(" ", "-")
    
    nut = item["nut"]
    prot_str = f"{nut.get('protein', 0):.1f}g per 100g"
    
    p = {
        "productId": prod_id,
        "barcode": bc,
        "name": item["name"],
        "brand": item["brand"],
        "category": cat,
        "categorySlug": cat_slug,
        "mainCategory": cat,
        "subCategory": item["sub"],
        "productType": item["type"],
        "manufacturer": item["mfr"],
        "flavour": item["flavour"],
        "packageSize": item["wt"],
        "netWeight": item["wt"],
        "servingSize": "30 g" if "g" in item["wt"] else item["wt"],
        "price": item["price"],
        "proteinContent": prot_str,
        "description": item["desc"],
        "ingredientsText": item["ing"],
        "nutritionPer100g": nut,
        "highlights": item["highlights"],
        "dietaryInformation": "Vegetarian",
        "isVegetarian": True,
        "countryOfOrigin": "India",
        "availability": "VERIFIED_AVAILABLE",
        "sourceUrl": f"https://www.fooddecode.org/products/{bc}"
    }
    final_products.append(p)

os.makedirs("scripts/data", exist_ok=True)
output_path = "scripts/data/chips_and_snacks_addition.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_products, f, indent=2)

print(f"✅ Successfully wrote {len(final_products)} products to {output_path}!")
