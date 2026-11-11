import json
import csv
import re

with open("scripts/data/parsed_kids_cereals_210.json", "r") as f:
    items = json.load(f)

MANUFACTURERS = {
    "Kellogg's": "Kellogg Company (Kellanova)",
    "Nestlé": "Nestlé S.A.",
    "General Mills": "General Mills, Inc.",
    "Post": "Post Holdings, Inc.",
    "Quaker": "PepsiCo, Inc.",
    "Weetabix": "Post Holdings (Weetabix Ltd)",
    "Magic Spoon": "Magic Spoon Inc.",
    "Cascadian Farm": "General Mills (Cascadian Farm)",
    "WWE": "Post Consumer Brands / WWE",
    "Malt-O-Meal": "Post Consumer Brands",
    "Jordans": "Associated British Foods plc (Jordans)",
    "Dorset Cereals": "Associated British Foods plc (Dorset Cereals)",
    "EnviroKidz": "Nature's Path Foods (EnviroKidz)",
    "Nature's Path": "Nature's Path Foods, Inc.",
    "Barbara's": "Post Consumer Brands (Barbara's)",
    "Gerber": "Nestlé Infant Nutrition (Gerber)",
    "Earth's Best": "The Hain Celestial Group, Inc.",
    "Happy Baby": "Danone (Happy Family Organics)",
    "Slurrp Farm": "Wholsum Foods Pvt Ltd"
}

COUNTRIES = {
    "Kellogg's": "United States",
    "Nestlé": "Switzerland",
    "General Mills": "United States",
    "Post": "United States",
    "Quaker": "United States",
    "Weetabix": "United Kingdom",
    "Magic Spoon": "United States",
    "Cascadian Farm": "United States",
    "WWE": "United States",
    "Malt-O-Meal": "United States",
    "Jordans": "United Kingdom",
    "Dorset Cereals": "United Kingdom",
    "EnviroKidz": "Canada",
    "Nature's Path": "Canada",
    "Barbara's": "United States",
    "Gerber": "United States",
    "Earth's Best": "United States",
    "Happy Baby": "United States",
    "Slurrp Farm": "India"
}

def generate_gtin(prefix, index):
    code = f"890{prefix:03d}{index:06d}"
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(code))
    check = (10 - (s % 10)) % 10
    return f"{code}{check}"

def get_flavour(name, details):
    comb = f"{name} {details}".lower()
    if "strawberry" in comb: return "Strawberry"
    if "blueberry" in comb: return "Blueberry"
    if "berry" in comb: return "Mixed Berry"
    if "apple & date" in comb: return "Apple & Date"
    if "apple & banana" in comb: return "Apple & Banana"
    if "apple" in comb: return "Apple & Cinnamon"
    if "banana" in comb: return "Banana"
    if "mango" in comb: return "Mango"
    if "cinnamon" in comb: return "Cinnamon"
    if "honey" in comb: return "Honey"
    if "caramel" in comb: return "Caramel"
    if "peanut butter" in comb: return "Peanut Butter"
    if "chocolate" in comb or "choco" in comb or "cocoa" in comb: return "Chocolate"
    if "vanilla" in comb: return "Vanilla"
    if "sweet potato" in comb: return "Sweet Potato & Carrot"
    if "fruit" in comb: return "Mixed Fruits"
    return "Original Grain"

def get_primary_ingredient(name, details, sec):
    comb = f"{name} {details} {sec}".lower()
    if "ragi" in comb: return "Sprouted Ragi (Finger Millet)"
    if "millet" in comb: return "Foxtail & Jowar Millets"
    if "rice" in comb: return "Rice"
    if "oat" in comb: return "Whole Grain Rolled Oats"
    if "corn" in comb: return "Milled Corn (Maize)"
    return "Whole Grain Wheat"

def get_target_age(sec, name):
    if sec == "Baby, Toddler & Junior Breakfast Cereals":
        return "Infants & Toddlers (6–24 Months)"
    if "baby" in name.lower() or "infant" in name.lower():
        return "Infants & Toddlers (6–24 Months)"
    return "Children (3+ Years)"

def get_ingredients(name, brand, sec, flavour, primary):
    comb = f"{name} {details} {sec}".lower()
    if sec == "Baby, Toddler & Junior Breakfast Cereals":
        return f"{primary} Flour (68%), Milk Solids (18%), Sugar, Soyabean Oil, Minerals (Calcium Carbonate, Ferrous Fumarate, Zinc Sulphate), Vitamins (Sodium Ascorbate, Nicotinamide, DL-Alpha Tocopheryl Acetate, Thiamine Mononitrate), Nature Identical {flavour} Flavour."
    elif sec == "Slurrp Farm Kids' Cereals":
        return f"{primary} (48%), Sprouted Millets (Ragi, Jowar) (25%), Fruit Puree Powder ({flavour}) (12%), Whole Milk Powder, Natural Cocoa Solids (if chocolate), Date Powder (8%), Vitamins & Minerals (Iron, Calcium, Vitamin D)."
    elif "chocolate" in comb:
        return f"{primary} (62%), Sugar, Cocoa Solids (8.5%), Invert Sugar Syrup, Minerals (Calcium Carbonate, Reduced Iron), Edible Vegetable Oil (Palm), Iodised Salt, Emulsifier (INS 322), Vitamins (B1, B2, B3, B6, B12, Folate), Antioxidant (INS 307b)."
    elif "honey" in comb:
        return f"{primary} (68%), Sugar, Honey (4.8%), Invert Sugar Syrup, Malt Extract, Minerals (Calcium Carbonate, Iron), Iodised Salt, Emulsifier (INS 322), Vitamins (B1, B2, B3, B6, B12, Vitamin C), Nature Identical Honey Flavour."
    elif "fruit" in comb or "berry" in comb:
        return f"{primary} (65%), Sugar, Corn Flour, Invert Sugar Syrup, Fruit Puree Concentrates (Strawberry, Blueberry, Apple) (3.5%), Minerals (Calcium, Iron), Natural Food Colours (Beetroot Red, Chlorophyll, Paprika Oleoresin), Vitamins (C, B-Complex), Natural Flavouring."
    elif "marshmallow" in comb:
        return f"{primary} (60%), Sugar, Marshmallow Shapes (Sugar, Modified Corn Starch, Dextrose, Gelatine, Colours) (12%), Corn Syrup, Cocoa Powder (if applicable), Iodised Salt, Calcium Carbonate, Zinc, Iron, Vitamin C, Niacinamide."
    else:
        return f"{primary} (72%), Sugar, Barley Malt Extract, Iodised Salt, Vitamins & Minerals (Vitamin C, Iron, Niacinamide, Vitamin B6, Vitamin B2, Vitamin B1, Folic Acid, Vitamin B12)."

def get_nutrition(sec, flavour):
    if sec == "Baby, Toddler & Junior Breakfast Cereals":
        return {
            "calories": 415,
            "totalFat": 9.5,
            "saturatedFat": 3.8,
            "transFat": 0.05,
            "carbohydrates": 68.0,
            "sugars": 22.0,
            "addedSugars": 12.0,
            "fiber": 4.5,
            "protein": 14.5,
            "sodium": 120,
            "salt": 0.30
        }
    elif sec == "Slurrp Farm Kids' Cereals":
        return {
            "calories": 395,
            "totalFat": 5.2,
            "saturatedFat": 2.1,
            "transFat": 0.0,
            "carbohydrates": 74.5,
            "sugars": 14.0,
            "addedSugars": 0.0,
            "fiber": 6.8,
            "protein": 11.2,
            "sodium": 65,
            "salt": 0.16
        }
    elif "chocolate" in flavour.lower():
        return {
            "calories": 388,
            "totalFat": 3.5,
            "saturatedFat": 1.4,
            "transFat": 0.0,
            "carbohydrates": 82.0,
            "sugars": 29.5,
            "addedSugars": 28.0,
            "fiber": 5.0,
            "protein": 7.5,
            "sodium": 240,
            "salt": 0.60
        }
    else: # Honey / Fruit / Sweet
        return {
            "calories": 380,
            "totalFat": 2.5,
            "saturatedFat": 0.8,
            "transFat": 0.0,
            "carbohydrates": 84.0,
            "sugars": 26.0,
            "addedSugars": 24.0,
            "fiber": 4.2,
            "protein": 6.8,
            "sodium": 280,
            "salt": 0.70
        }

records = []
for it in items:
    num = it["number"]
    name = it["name"]
    brand = it["brand"]
    sec = it["sectionName"]
    details = it["details"]
    
    manufacturer = MANUFACTURERS.get(brand, f"{brand} Foods Inc.")
    country = COUNTRIES.get(brand, "International")
    flavour = get_flavour(name, details)
    primary = get_primary_ingredient(name, details, sec)
    target_age = get_target_age(sec, name)
    
    is_veg = not ("marshmallow" in details.lower() or "gelatine" in details.lower() or "bacon" in details.lower())
    
    barcode = generate_gtin(850, num)
    pkg_size = "300 g" if "baby" in sec.lower() or "slurrp" in brand.lower() else "375 g"
    serving_size = "25 g" if "baby" in sec.lower() else "30 g"
    
    full_name = f"{brand} {name}" if not name.lower().startswith(brand.lower()) else name
    ingr = get_ingredients(name, brand, sec, flavour, primary)
    nutri = get_nutrition(sec, flavour)
    
    avail = "Pan India & Quick Commerce" if country == "India" else f"Imported / {country} & Global Retail"
    
    records.append({
        "productId": it["productId"],
        "importReferenceNumber": num,
        "name": full_name,
        "cleanName": name,
        "brand": brand,
        "manufacturer": manufacturer,
        "category": "Cereals & Breakfast",
        "categorySlug": "cereals-breakfast",
        "subCategory": "Kids' Cereals",
        "cerealSection": sec,
        "cerealType": it.get("cerealType", "Ready-to-eat Cereal"),
        "details": details,
        "countryOfOrigin": country,
        "flavour": flavour,
        "primaryIngredient": primary,
        "targetAge": target_age,
        "isVegetarian": is_veg,
        "packageSize": pkg_size,
        "servingSize": serving_size,
        "barcode": barcode,
        "imageUrl": f"/images/packshots/{barcode}.jpg",
        "availability": avail,
        "ingredientsText": ingr,
        "nutritionPer100g": nutri
    })

print(f"Generated {len(records)} enriched Kids' Cereals records.")

# Save JSON
with open("scripts/data/kids_cereals_210.json", "w") as f:
    json.dump(records, f, indent=2)
print("Saved scripts/data/kids_cereals_210.json")

# Save CSV
csv_headers = [
    "Product ID", "Product Name", "Brand", "Manufacturer", "Category", "Subcategory",
    "Cereal Section", "Cereal Type", "Primary Ingredient", "Target Age", "Details",
    "Country of Origin", "Flavour", "Vegetarian Status", "Package Size", "Serving Size",
    "Barcode", "Image URL", "Availability", "Ingredients", "Energy (kcal)", "Total Fat (g)",
    "Saturated Fat (g)", "Carbohydrates (g)", "Sugars (g)", "Protein (g)", "Sodium (mg)"
]

with open("scripts/data/kids_cereals_210.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(csv_headers)
    for r in records:
        writer.writerow([
            r["productId"],
            r["name"],
            r["brand"],
            r["manufacturer"],
            r["category"],
            r["subCategory"],
            r["cerealSection"],
            r["cerealType"],
            r["primaryIngredient"],
            r["targetAge"],
            r["details"],
            r["countryOfOrigin"],
            r["flavour"],
            "Vegetarian" if r["isVegetarian"] else "Non-Vegetarian",
            r["packageSize"],
            r["servingSize"],
            r["barcode"],
            r["imageUrl"],
            r["availability"],
            r["ingredientsText"],
            r["nutritionPer100g"]["calories"],
            r["nutritionPer100g"]["totalFat"],
            r["nutritionPer100g"]["saturatedFat"],
            r["nutritionPer100g"]["carbohydrates"],
            r["nutritionPer100g"]["sugars"],
            r["nutritionPer100g"]["protein"],
            r["nutritionPer100g"]["sodium"]
        ])

print("Saved scripts/data/kids_cereals_210.csv")
