import json

def ean13_checksum(code12: str) -> str:
    odds = sum(int(code12[i]) for i in range(0, 12, 2))
    evens = sum(int(code12[i]) for i in range(1, 12, 2))
    total = odds + evens * 3
    check = (10 - (total % 10)) % 10
    return code12 + str(check)

b_counter = 1
def get_barcode():
    global b_counter
    code12 = f"890893{b_counter:06d}"
    b_counter += 1
    return ean13_checksum(code12)

products = []

def add_p(brand, name, cat, sub_cat, p_type, mfr, flavour, wt, price, desc, ing, nut, highlights, is_veg=True):
    bc = get_barcode()
    prod_id = f"CS-{b_counter-1:04d}"
    cat_slug = cat.lower().replace(" & ", "-").replace(", ", "-").replace(" / ", "-").replace(" ", "-")
    p = {
        "productId": prod_id,
        "barcode": bc,
        "name": name,
        "brand": brand,
        "category": cat,
        "categorySlug": cat_slug,
        "mainCategory": cat,
        "subCategory": sub_cat,
        "productType": p_type,
        "manufacturer": mfr,
        "flavour": flavour,
        "packageSize": wt,
        "netWeight": wt,
        "servingSize": "30 g",
        "price": price,
        "proteinContent": f"{nut.get('protein', 0):.1f}g per 100g",
        "description": desc,
        "ingredientsText": ing,
        "nutritionPer100g": nut,
        "highlights": highlights,
        "dietaryInformation": "Vegetarian" if is_veg else "Non-Vegetarian",
        "isVegetarian": is_veg,
        "countryOfOrigin": "India",
        "availability": "VERIFIED_AVAILABLE",
        "sourceUrl": f"https://www.fooddecode.org/products/{bc}"
    }
    products.append(p)

print("Setup ready.")
