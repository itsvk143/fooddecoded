import json
import csv
import re

with open("scripts/data/parsed_ice_cream_500.json", "r") as f:
    items = json.load(f)

MANUFACTURERS = {
    "Amul": "Gujarat Cooperative Milk Marketing Federation (GCMMF)",
    "Mother Dairy": "Mother Dairy Fruit & Vegetable Pvt Ltd",
    "Havmor": "Havmor Ice Cream Pvt Ltd (Lotte)",
    "Kwality Wall's": "Hindustan Unilever Limited (HUL)",
    "Magnum": "Hindustan Unilever Limited (HUL)",
    "Baskin-Robbins": "Inspire Brands (Graviss Foods Pvt Ltd)",
    "Häagen-Dazs": "General Mills, Inc. / Froneri",
    "Ben & Jerry's": "Unilever (Ben & Jerry's Homemade Holdings Inc.)",
    "Tillamook": "Tillamook County Creamery Association",
    "Blue Bell": "Blue Bell Creameries",
    "Talenti": "Unilever (Talenti Gelato & Sorbetto)",
    "Jeni's": "Jeni's Splendid Ice Creams, LLC"
}

COUNTRIES = {
    "Amul": "India",
    "Mother Dairy": "India",
    "Havmor": "India",
    "Kwality Wall's": "India",
    "Magnum": "India",
    "Baskin-Robbins": "United States",
    "Häagen-Dazs": "United States",
    "Ben & Jerry's": "United States",
    "Tillamook": "United States",
    "Blue Bell": "United States",
    "Talenti": "United States",
    "Jeni's": "United States"
}

def generate_gtin(prefix, index):
    code = f"890{prefix:03d}{index:06d}"
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(code))
    check = (10 - (s % 10)) % 10
    return f"{code}{check}"

def get_subcategory(name, brand, details):
    comb = f"{name} {brand} {details}".lower()
    if "kulfi" in comb or "rabri" in comb or "matka" in comb:
        return "Kulfi"
    if "cone" in comb or "cornetto" in comb:
        return "Ice Cream Cones"
    if "bar" in comb or "stick" in comb or "magnum" in comb or "feast" in comb or "paddle pop" in comb or "pop" in comb:
        return "Ice Cream Bars & Sticks"
    if "non-dairy" in comb or "dairy-free" in comb:
        return "Dairy-Free / Vegan Ice Cream"
    if "gelato" in comb or "sorbet" in comb or "sorbetto" in comb or "sherbet" in comb:
        return "Gelato & Sorbetto"
    if "sugar free" in comb or "no sugar added" in comb:
        return "Sugar-Free Ice Cream"
    if "chocolate" in comb or "brownie" in comb or "choco" in comb or "fudge" in comb:
        return "Chocolate Ice Cream"
    if "vanilla" in comb:
        return "Vanilla Ice Cream"
    if any(k in comb for k in ["mango", "strawberry", "berry", "cherry", "raspberry", "fruit", "black currant", "pineapple", "orange", "sitaphal", "guava", "litchi"]):
        return "Fruit-Based Ice Cream"
    if brand in ["Häagen-Dazs", "Ben & Jerry's", "Jeni's", "Tillamook", "Talenti"]:
        return "Premium Ice Cream"
    return "Regular Ice Cream"

def get_ice_cream_type(name, brand, details, subcat):
    comb = f"{name} {brand} {details}".lower()
    if "sorbet" in comb or "sorbetto" in comb:
        return "Fruit Sorbet"
    if "gelato" in comb:
        return "Italian Style Gelato"
    if "kulfi" in comb:
        return "Traditional Indian Kulfi"
    if "non-dairy" in comb or "dairy-free" in comb:
        return "Plant-Based Frozen Dessert"
    if "frozen dessert" in comb or brand in ["Kwality Wall's"]:
        return "Frozen Dessert (Vegetable Oil Blended)"
    return "Dairy Ice Cream (Real Milk & Cream)"

def get_flavour(name, details):
    return details.capitalize()

def get_allergens(name, details, is_sorbet, is_nondairy):
    comb = f"{name} {details}".lower()
    allergens = []
    if not is_sorbet and not is_nondairy:
        allergens.append("Milk / Dairy")
    
    # Nuts
    if any(n in comb for n in ["almond", "pista", "cashew", "kaju", "pecan", "walnut", "macadamia", "praline", "hazelnut", "pistachio"]):
        allergens.append("Tree Nuts")
    if "peanut" in comb:
        allergens.append("Peanuts")
    if any(g in comb for g in ["cookie", "dough", "brownie", "cone", "waffle", "pie", "cake", "biscotti", "pretzel", "oreo"]):
        allergens.append("Wheat / Gluten")
    if any(s in comb for s in ["chocolate", "fudge", "choco", "brownie", "swirl"]):
        allergens.append("Soy")
    
    return allergens

def get_package_and_serving(name, subcat):
    comb = f"{name} {subcat}".lower()
    if subcat == "Ice Cream Cones":
        return "120 ml Cone (approx 75 g)", "120 ml"
    if subcat == "Ice Cream Bars & Sticks":
        return "80 ml Stick Bar (approx 65 g)", "80 ml"
    if "cup" in comb:
        return "100 ml Cup (approx 60 g)", "100 ml"
    if subcat == "Kulfi":
        return "70 ml Kulfi Stick / Matka (approx 60 g)", "70 ml"
    if "cake" in comb:
        return "500 ml Ice Cream Cake", "100 ml (approx 70 g)"
    return "500 ml / 1 Pint Tub", "100 ml (approx 65 g)"

def get_nutrition_and_ingredients(name, brand, subcat, ice_type, flavour):
    comb = f"{name} {brand} {subcat} {ice_type} {flavour}".lower()
    is_sorbet = "sorbet" in comb
    is_nondairy = "dairy-free" in comb or "non-dairy" in comb
    is_premium = brand in ["Häagen-Dazs", "Ben & Jerry's", "Jeni's", "Tillamook", "Talenti"]
    is_kulfi = subcat == "Kulfi"
    
    if is_sorbet:
        cals = 120
        fat = 0.2
        sat_fat = 0.0
        carbs = 29.5
        sugars = 26.0
        added_sugars = 20.0
        protein = 0.5
        sodium = 15
        ingr = f"Water, Fruit Puree & Juice ({flavour} 32%), Cane Sugar, Dextrose, Stabilizers (Pectin INS 440, Carob Bean Gum INS 410), Citric Acid (INS 330), Natural Flavouring."
    elif is_nondairy:
        cals = 220
        fat = 12.0
        sat_fat = 7.5
        carbs = 27.0
        sugars = 22.0
        added_sugars = 18.0
        protein = 2.2
        sodium = 70
        ingr = f"Almond Milk / Oat Milk Blend (Water, Almonds/Oats), Cane Sugar, Coconut Oil, Glucose Syrup, Cocoa Solids / Fruit Inclusions, Emulsifiers (Sunflower Lecithin), Stabilizers (Guar Gum INS 412, Locust Bean Gum INS 410), Sea Salt, Vanilla Extract."
    elif is_kulfi:
        cals = 235
        fat = 12.8
        sat_fat = 8.1
        carbs = 24.5
        sugars = 22.5
        added_sugars = 15.0
        protein = 5.8
        sodium = 95
        ingr = f"Condensed Milk Solids (Rabri), Pasteurized Full Cream Milk (72%), Sugar, Cardamom Powder (Elaichi), Saffron (Kesar), Pistachio & Almond Nuts (6%), Stabilizers (INS 412, INS 407)."
    elif is_premium:
        cals = 265
        fat = 16.5
        sat_fat = 10.2
        carbs = 25.8
        sugars = 23.5
        added_sugars = 17.5
        protein = 4.4
        sodium = 85
        ingr = f"Cream (38%), Pasteurized Skimmed Milk, Cane Sugar, Egg Yolks (if custard-style) or Milk Solids, Cocoa / Fruit Puree / Inclusions ({flavour}), Natural Vanilla Extract, Sea Salt."
    else: # standard dairy or frozen dessert
        cals = 205
        fat = 10.8
        sat_fat = 6.8
        carbs = 23.5
        sugars = 20.5
        added_sugars = 15.0
        protein = 3.6
        sodium = 65
        ingr = f"Milk Solids, Pasteurized Milk & Cream (or Edible Vegetable Oil 10.2% if frozen dessert), Cane Sugar, Liquid Glucose, Emulsifiers (INS 471), Stabilizers (INS 412 Guar Gum, INS 407 Carrageenan, INS 410 Locust Bean Gum), Nature Identical {flavour} Flavouring, Permitted Colours."

    allergens = get_allergens(name, flavour, is_sorbet, is_nondairy)
    nutrition = {
        "calories": round(cals, 1),
        "totalFat": round(fat, 1),
        "saturatedFat": round(sat_fat, 1),
        "transFat": 0.1 if not is_sorbet else 0.0,
        "carbohydrates": round(carbs, 1),
        "sugars": round(sugars, 1),
        "addedSugars": round(added_sugars, 1),
        "protein": round(protein, 1),
        "sodium": int(sodium),
        "salt": round(sodium * 2.5 / 1000, 3)
    }

    return nutrition, ingr, allergens

enriched = []
for idx, it in enumerate(items, 1):
    num = it["number"]
    name = it["name"]
    brand = it["brand"]
    details = it["details"]
    sec = it["section"]
    
    product_id = f"ICM-{num:04d}"
    barcode = generate_gtin(870, num)
    manufacturer = MANUFACTURERS.get(brand, f"{brand} Creameries Inc.")
    country = COUNTRIES.get(brand, "India" if brand in ["Amul", "Mother Dairy", "Havmor", "Kwality Wall's"] else "United States")
    
    subcat = get_subcategory(name, brand, details)
    ice_type = get_ice_cream_type(name, brand, details, subcat)
    flavour = get_flavour(name, details)
    package, serving = get_package_and_serving(name, subcat)
    nutrition, ingr, allergens = get_nutrition_and_ingredients(name, brand, subcat, ice_type, flavour)
    
    enriched.append({
        "productId": product_id,
        "name": name,
        "brand": brand,
        "details": details,
        "iceCreamSection": sec,
        "iceCreamType": ice_type,
        "flavour": flavour,
        "category": "Ice Cream",
        "subCategory": subcat,
        "manufacturer": manufacturer,
        "countryOfOrigin": country,
        "packageSize": package,
        "servingSize": serving,
        "barcode": barcode,
        "imageUrl": f"/images/packshots/{barcode}.jpg",
        "ingredientsText": ingr,
        "nutritionPer100g": nutrition,
        "allergens": allergens,
        "isVegetarian": True,
        "availability": "In Stock / National Retail & Quick Commerce"
    })

print(f"Enriched {len(enriched)} ice cream products.")

with open("scripts/data/ice_cream_500.json", "w") as f:
    json.dump(enriched, f, indent=2)

with open("scripts/data/ice_cream_500.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=[
        "productId", "name", "brand", "iceCreamSection", "iceCreamType", "flavour",
        "category", "subCategory", "manufacturer", "countryOfOrigin", "packageSize",
        "servingSize", "barcode", "imageUrl", "ingredientsText", "calories",
        "sugars", "addedSugars", "totalFat", "saturatedFat", "protein", "sodium", "allergens"
    ])
    writer.writeheader()
    for row in enriched:
        nut = row["nutritionPer100g"]
        writer.writerow({
            "productId": row["productId"],
            "name": row["name"],
            "brand": row["brand"],
            "iceCreamSection": row["iceCreamSection"],
            "iceCreamType": row["iceCreamType"],
            "flavour": row["flavour"],
            "category": row["category"],
            "subCategory": row["subCategory"],
            "manufacturer": row["manufacturer"],
            "countryOfOrigin": row["countryOfOrigin"],
            "packageSize": row["packageSize"],
            "servingSize": row["servingSize"],
            "barcode": row["barcode"],
            "imageUrl": row["imageUrl"],
            "ingredientsText": row["ingredientsText"],
            "calories": nut["calories"],
            "sugars": nut["sugars"],
            "addedSugars": nut["addedSugars"],
            "totalFat": nut["totalFat"],
            "saturatedFat": nut["saturatedFat"],
            "protein": nut["protein"],
            "sodium": nut["sodium"],
            "allergens": "; ".join(row["allergens"])
        })

print("Generated scripts/data/ice_cream_500.json and scripts/data/ice_cream_500.csv successfully!")

