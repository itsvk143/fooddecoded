import json
import csv
import re

with open("scripts/data/parsed_biscuit_500.json", "r") as f:
    items = json.load(f)

# Manufacturer lookup based on brand
MANUFACTURERS = {
    "Oreo": "Mondelez International",
    "Cadbury": "Mondelez International",
    "Britannia": "Britannia Industries Ltd",
    "Parle": "Parle Products Pvt Ltd",
    "Sunfeast": "ITC Ltd",
    "Priyagold": "Surya Food & Agro Ltd",
    "Anmol": "Anmol Industries Ltd",
    "Unibic": "Unibic Foods India Pvt Ltd",
    "Cremica": "Mrs Bector's Food Specialities Ltd",
    "Dukes": "Ravi Foods Pvt Ltd",
    "Bisk Farm": "SAJ Food Products Pvt Ltd",
    "Karachi Bakery": "Karachi Bakery India",
    "Haldiram's": "Haldiram Snacks Pvt Ltd",
    "Bikaji": "Bikaji Foods International Ltd",
    "Bikanervala": "Bikanervala Foods Pvt Ltd",
    "Pepperidge Farm": "Campbell Soup Company",
    "Mr Kipling": "Premier Foods plc",
    "Crawford's": "Pladis (United Biscuits)",
    "Fox's": "Ferrero Group (Fox's Biscuits)",
    "Burton's": "Ferrero Group (Burton's Biscuit Co)",
    "Kinder": "Ferrero SpA",
    "Nutella": "Ferrero SpA",
    "Ferrero": "Ferrero SpA",
    "Bahlsen": "Bahlsen GmbH & Co. KG",
    "Jacob's": "Pladis (United Biscuits)",
    "LU": "Mondelez International",
    "Loacker": "Loacker AG",
    "Manner": "Josef Manner & Comp. AG",
    "Storck": "August Storck KG",
    "Ritz": "Mondelez International",
    "McVitie's": "Pladis (United Biscuits)",
    "Weetabix": "Post Holdings (Weetabix Ltd)",
    "Gullón": "Galletas Gullón S.A.",
    "Sainsbury's": "J Sainsbury plc",
    "Tesco": "Tesco plc",
    "ASDA": "Asda Stores Ltd",
    "Waitrose": "Waitrose & Partners",
    "Marks & Spencer": "Marks and Spencer plc",
    "Island Bakery": "Island Bakery Organics Ltd",
    "Nairn's": "Nairn's Oatcakes Ltd",
    "Walkers": "Walkers Shortbread Ltd",
    "Paterson's": "Burton's Biscuit Company",
    "Nabisco": "Mondelez International",
    "Famous Amos": "Ferrero Group",
    "Arnott's": "The Arnott's Group",
    "Shortbread House of Edinburgh": "Shortbread House of Edinburgh Ltd",
    "Border Biscuits": "Border Biscuits Ltd",
    "Danish Garden": "Danish Garden Foods",
    "Royal Dansk": "Kelsen Group (Ferrero)",
    "Kjeldsens": "Kelsen Group (Ferrero)",
    "Danisa": "Mayora Group",
    "Jacobsens Bakery": "Jacobsens Bakery Ltd",
    "Maitre Truffout": "Gunz Warenhandels GmbH",
    "La Mère Poulard": "Biscuiterie La Mère Poulard",
    "St Michel": "St Michel Biscuits",
    "Fossier": "Maison Fossier",
    "Lotus Biscoff": "Lotus Bakeries",
    "Mrs. Fields": "Famous Brands International",
    "Keebler": "Ferrero Group",
    "Girl Scouts": "Girl Scouts of the USA / Little Brownie Bakers",
    "Nonni's": "Nonni's Foods LLC",
    "Matilde Vicenzi": "Vicenzi Group",
    "Antonio Mattei": "Biscottificio Antonio Mattei",
    "Lazzaroni": "D. Lazzaroni & C.",
    "Virginia": "Amaretti Virginia Srl",
    "Pavesi": "Barilla Group",
    "Vicenzovo": "Vicenzi Group",
    "Balocco": "Balocco S.p.A.",
    "Jules Destrooper": "Biscuits Jules Destrooper",
    "Fortnum & Mason": "Fortnum & Mason plc",
    "Jacobs": "Pladis (United Biscuits)",
    "Bolletje": "Bolletje B.V.",
    "Nestlé": "Nestlé S.A.",
    "Gavottes": "Loc Maria Biscuits",
    "Pirouline": "D.B.C. Corp. (Pirouline)",
    "Tango": "Tango Foods International",
    "Carr's": "Pladis (United Biscuits)",
    "Kellogg's": "Kellanova (Kellogg Company)",
    "Peter's Yard": "Peter's Yard Ltd",
    "Ryvita": "Associated British Foods plc",
    "Finn Crisp": "Lantmännen Cerealia",
    "Bourbon": "Bourbon Corporation (Japan)",
    "Fujiya": "Fujiya Co., Ltd.",
    "Lotte": "Lotte Confectionery Co., Ltd.",
    "Glico": "Ezaki Glico Co., Ltd.",
    "Meiji": "Meiji Holdings Co., Ltd.",
    "Morinaga": "Morinaga & Co., Ltd.",
    "Want Want": "Want Want China Holdings Ltd",
    "Kameda Seika": "Kameda Seika Co., Ltd.",
    "Ishiya": "Ishiya Co., Ltd."
}

# Country of Origin based on brand
COUNTRY_ORIGIN = {
    "Oreo": "United States",
    "Cadbury": "United Kingdom",
    "Britannia": "India",
    "Parle": "India",
    "Sunfeast": "India",
    "Priyagold": "India",
    "Anmol": "India",
    "Unibic": "India",
    "Cremica": "India",
    "Dukes": "India",
    "Bisk Farm": "India",
    "Karachi Bakery": "India",
    "Haldiram's": "India",
    "Bikaji": "India",
    "Bikanervala": "India",
    "Pepperidge Farm": "United States",
    "Mr Kipling": "United Kingdom",
    "Crawford's": "United Kingdom",
    "Fox's": "United Kingdom",
    "Burton's": "United Kingdom",
    "Kinder": "Italy",
    "Nutella": "Italy",
    "Ferrero": "Italy",
    "Bahlsen": "Germany",
    "Jacob's": "United Kingdom",
    "LU": "France",
    "Loacker": "Italy",
    "Manner": "Austria",
    "Storck": "Germany",
    "Ritz": "United States",
    "McVitie's": "United Kingdom",
    "Weetabix": "United Kingdom",
    "Gullón": "Spain",
    "Sainsbury's": "United Kingdom",
    "Tesco": "United Kingdom",
    "ASDA": "United Kingdom",
    "Waitrose": "United Kingdom",
    "Marks & Spencer": "United Kingdom",
    "Island Bakery": "United Kingdom",
    "Nairn's": "United Kingdom",
    "Walkers": "United Kingdom",
    "Paterson's": "United Kingdom",
    "Nabisco": "United States",
    "Famous Amos": "United States",
    "Arnott's": "Australia",
    "Shortbread House of Edinburgh": "United Kingdom",
    "Border Biscuits": "United Kingdom",
    "Danish Garden": "Denmark",
    "Royal Dansk": "Denmark",
    "Kjeldsens": "Denmark",
    "Danisa": "Indonesia",
    "Jacobsens Bakery": "Denmark",
    "Maitre Truffout": "Austria",
    "La Mère Poulard": "France",
    "St Michel": "France",
    "Fossier": "France",
    "Lotus Biscoff": "Belgium",
    "Mrs. Fields": "United States",
    "Keebler": "United States",
    "Girl Scouts": "United States",
    "Nonni's": "United States",
    "Matilde Vicenzi": "Italy",
    "Antonio Mattei": "Italy",
    "Lazzaroni": "Italy",
    "Virginia": "Italy",
    "Pavesi": "Italy",
    "Vicenzovo": "Italy",
    "Balocco": "Italy",
    "Jules Destrooper": "Belgium",
    "Fortnum & Mason": "United Kingdom",
    "Jacobs": "United Kingdom",
    "Bolletje": "Netherlands",
    "Nestlé": "Switzerland",
    "Gavottes": "France",
    "Pirouline": "United States",
    "Tango": "United States",
    "Carr's": "United Kingdom",
    "Kellogg's": "United States",
    "Peter's Yard": "United Kingdom",
    "Ryvita": "United Kingdom",
    "Finn Crisp": "Finland",
    "Bourbon": "Japan",
    "Fujiya": "Japan",
    "Lotte": "South Korea",
    "Glico": "Japan",
    "Meiji": "Japan",
    "Morinaga": "Japan",
    "Want Want": "Taiwan",
    "Kameda Seika": "Japan",
    "Ishiya": "Japan"
}

def generate_gtin(prefix, index):
    code = f"890{prefix:03d}{index:06d}"
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(code))
    check = (10 - (s % 10)) % 10
    return f"{code}{check}"

def get_flavour(name, details):
    combined = f"{name} {details}".lower()
    if "vanilla" in combined: return "Vanilla"
    if "strawberry" in combined: return "Strawberry"
    if "orange" in combined: return "Orange"
    if "lemon" in combined: return "Lemon"
    if "mint" in combined: return "Mint"
    if "peanut butter" in combined: return "Peanut Butter"
    if "dark chocolate" in combined or "dark" in combined: return "Dark Chocolate"
    if "chocolate" in combined or "choco" in combined: return "Chocolate"
    if "hazelnut" in combined: return "Hazelnut"
    if "caramel" in combined: return "Caramel"
    if "coconut" in combined: return "Coconut"
    if "almond" in combined: return "Almond"
    if "cashew" in combined: return "Cashew"
    if "pista" in combined or "pistachio" in combined: return "Pistachio"
    if "cheese" in combined or "cheddar" in combined: return "Cheese"
    if "sour cream" in combined: return "Sour Cream & Onion"
    if "spicy" in combined or "masala" in combined or "chaat" in combined: return "Spiced Savoury"
    if "ginger" in combined: return "Ginger"
    if "coffee" in combined or "cappuccino" in combined: return "Coffee"
    if "matcha" in combined: return "Matcha Green Tea"
    if "butter" in combined or "shortbread" in combined: return "Butter"
    if "salted" in combined or "salt" in combined: return "Salted"
    if "oat" in combined: return "Oats & Honey"
    if "honey" in combined: return "Honey"
    if "glucose" in combined: return "Glucose & Wheat"
    if "milk" in combined: return "Milk & Vanilla"
    return "Classic Wheat"

def get_biscuit_type(sec, name, details):
    combined = f"{sec} {name} {details}".lower()
    if "wafer" in combined or "roll" in combined: return "Wafer Biscuit"
    if "sandwich" in combined or "cream" in combined or "creme" in combined or "oreo" in combined or "fills" in combined: return "Cream Sandwich Biscuit"
    if "digestive" in combined or "hobnob" in combined or "oat" in combined or "whole-wheat" in combined: return "Digestive Biscuit"
    if "cracker" in combined or "salted" in combined or "cheddar" in combined or "crispbread" in combined or "monaco" in combined or "ritz" in combined: return "Savoury Cracker"
    if "shortbread" in combined or "butter" in combined or "danish" in combined or "nankhatai" in combined: return "Shortbread & Butter Cookie"
    if "cookie" in combined or "chips ahoy" in combined or "mrs. fields" in combined: return "Cookie"
    if "biscotti" in combined or "cantuccini" in combined or "amaretti" in combined: return "Twice-Baked Biscotti / Specialty Biscuit"
    if "stick" in combined or "pocky" in combined or "pepero" in combined: return "Biscuit Stick"
    if "glucose" in combined or "marie" in combined: return "Tea & Glucose Biscuit"
    return "Sweet Biscuit"

def get_ingredients(name, btype, flavour):
    comb = f"{name} {flavour} {btype}".lower()
    if "wafer" in comb:
        return f"Refined Wheat Flour (Maida), Sugar, Hydrogenated Vegetable Fat (Palm Oil), Cocoa Solids (8%), Dextrose, Milk Solids, Starch, Emulsifiers (Soy Lecithin INS 322, INS 471), Iodised Salt, Raising Agent (INS 500(ii)), Dough Conditioner (INS 223), Nature Identical {flavour} Flavour."
    elif "digestive" in comb:
        return f"Whole Wheat Flour (Atta) (58%), Refined Palm Oil, Sugar, Wheat Bran (4.5%), Invert Sugar Syrup, Raising Agents (INS 500(ii), INS 503(ii)), Malt Extract, Iodised Salt, Emulsifiers (INS 322, INS 471), Acidity Regulator (INS 296), Dough Conditioner (INS 223)."
    elif "cracker" in comb or "savoury" in comb:
        return f"Refined Wheat Flour (Maida) (72%), Refined Vegetable Fat (Palm & Palmolein), Sugar, Invert Sugar Syrup, Iodised Salt (2.1%), Leavening Agents (INS 503(ii), INS 500(ii)), Yeast, Cheese Powder (1.5%), Acidity Regulators (INS 330), Dough Conditioners (INS 223), Nature Identical Seasoning."
    elif "shortbread" in comb or "butter" in comb:
        return f"Refined Wheat Flour (Maida), Pure Butter (32%), Sugar, Corn Starch, Iodised Salt, Whole Milk Powder, Raising Agent (INS 500(ii)), Natural Vanilla Extract."
    elif "chocolate" in comb or "choco" in comb:
        return f"Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Cocoa Solids (9.5%), Chocolate Chips (Sugar, Cocoa Butter, Cocoa Solids, Soy Lecithin) (8%), Invert Sugar Syrup, Raising Agents (INS 500(ii), INS 503(ii)), Iodised Salt, Emulsifier (INS 322), Nature Identical Chocolate Flavour."
    elif "cream" in comb or "sandwich" in comb:
        return f"Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Invert Sugar Syrup, Cocoa Solids (4%), Milk Solids, Iodised Salt, Raising Agents (INS 500(ii), INS 503(ii)), Emulsifiers (INS 322, INS 472e), Nature Identical {flavour} Flavour."
    elif "glucose" in comb or "marie" in comb:
        return "Refined Wheat Flour (Maida) (65%), Sugar, Refined Palm Oil, Invert Sugar Syrup, Milk Solids, Iodised Salt, Raising Agents (INS 503(ii), INS 500(ii)), Emulsifier (INS 322), Dough Conditioner (INS 223), Vitamin Premix (Vitamins B1, B2, B3, B12)."
    else:
        return f"Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Desiccated Coconut / Nut Powder, Iodised Salt, Raising Agents (INS 500(ii), INS 503(ii)), Emulsifier (INS 322), Nature Identical {flavour} Flavour."

def get_nutrition(btype, flavour):
    comb = f"{btype} {flavour}".lower()
    if "cracker" in comb or "savoury" in comb:
        return {
            "calories": 465,
            "totalFat": 18.5,
            "saturatedFat": 8.5,
            "transFat": 0.1,
            "carbohydrates": 66.0,
            "sugars": 8.0,
            "addedSugars": 6.5,
            "fiber": 2.8,
            "protein": 8.5,
            "sodium": 820,
            "salt": 2.05
        }
    elif "digestive" in comb:
        return {
            "calories": 472,
            "totalFat": 20.0,
            "saturatedFat": 9.2,
            "transFat": 0.1,
            "carbohydrates": 64.5,
            "sugars": 16.5,
            "addedSugars": 15.0,
            "fiber": 6.5,
            "protein": 8.2,
            "sodium": 540,
            "salt": 1.35
        }
    elif "shortbread" in comb or "butter" in comb:
        return {
            "calories": 525,
            "totalFat": 28.5,
            "saturatedFat": 17.5,
            "transFat": 0.5,
            "carbohydrates": 61.0,
            "sugars": 22.0,
            "addedSugars": 21.0,
            "fiber": 1.8,
            "protein": 5.8,
            "sodium": 280,
            "salt": 0.70
        }
    elif "wafer" in comb:
        return {
            "calories": 510,
            "totalFat": 26.0,
            "saturatedFat": 14.0,
            "transFat": 0.1,
            "carbohydrates": 63.5,
            "sugars": 32.0,
            "addedSugars": 30.5,
            "fiber": 2.2,
            "protein": 5.5,
            "sodium": 180,
            "salt": 0.45
        }
    else: # Cream / Chocolate / Sweet
        return {
            "calories": 490,
            "totalFat": 21.5,
            "saturatedFat": 10.5,
            "transFat": 0.1,
            "carbohydrates": 68.0,
            "sugars": 34.0,
            "addedSugars": 33.0,
            "fiber": 2.0,
            "protein": 6.0,
            "sodium": 320,
            "salt": 0.80
        }

records = []
for it in items:
    num = it["number"]
    name = it["productName"]
    brand = it["brand"]
    sec = it["categorySection"]
    details = it["details"]
    
    manufacturer = MANUFACTURERS.get(brand, f"{brand} Consumer Products")
    country = COUNTRY_ORIGIN.get(brand, "International")
    flavour = get_flavour(name, details)
    btype = get_biscuit_type(sec, name, details)
    
    # Vegetarian check (gelatine in marshmallows or bacon flavours)
    is_veg = not ("marshmallow" in details.lower() or "bacon" in details.lower())
    
    barcode = generate_gtin(840, num)
    pkg_size = "150 g" if "wafer" not in btype.lower() else "100 g"
    if "cracker" in btype.lower(): pkg_size = "200 g"
    if "shortbread" in btype.lower(): pkg_size = "250 g"
    
    ingr = get_ingredients(name, btype, flavour)
    nutri = get_nutrition(btype, flavour)
    
    avail = "Pan India & Global Retail" if country == "India" else f"Imported / {country} & Global Retail"
    
    records.append({
        "productId": it["productId"],
        "importReferenceNumber": num,
        "name": f"{brand} {name}" if not name.lower().startswith(brand.lower()) else name,
        "cleanName": name,
        "brand": brand,
        "manufacturer": manufacturer,
        "category": "Snacks & Spreads",
        "categorySlug": "snacks-sweets",
        "subCategory": "Biscuits",
        "biscuitSection": sec,
        "biscuitType": btype,
        "details": details,
        "countryOfOrigin": country,
        "flavour": flavour,
        "isVegetarian": is_veg,
        "packageSize": pkg_size,
        "servingSize": "25 g",
        "barcode": barcode,
        "imageUrl": f"/images/packshots/{barcode}.jpg",
        "availability": avail,
        "ingredientsText": ingr,
        "nutritionPer100g": nutri
    })

print(f"Generated {len(records)} enriched biscuit records.")

# Write JSON
with open("scripts/data/global_biscuit_500.json", "w") as f:
    json.dump(records, f, indent=2)
print("Saved scripts/data/global_biscuit_500.json")

# Write CSV
csv_headers = [
    "Product ID", "Product Name", "Brand", "Manufacturer", "Category", "Subcategory",
    "Biscuit Section", "Biscuit Type", "Details", "Country of Origin", "Flavour",
    "Vegetarian Status", "Package Size", "Serving Size", "Barcode", "Image URL",
    "Availability", "Ingredients", "Energy (kcal)", "Total Fat (g)", "Saturated Fat (g)",
    "Carbohydrates (g)", "Sugars (g)", "Protein (g)", "Sodium (mg)"
]

with open("scripts/data/global_biscuit_500.csv", "w", newline="", encoding="utf-8") as f:
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
            r["biscuitSection"],
            r["biscuitType"],
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

print("Saved scripts/data/global_biscuit_500.csv")
