import json
import csv
import re

with open("scripts/data/parsed_cold_drinks_500.json", "r") as f:
    items = json.load(f)

MANUFACTURERS = {
    "Coca-Cola": "The Coca-Cola Company",
    "Schweppes": "The Coca-Cola Company / Keurig Dr Pepper",
    "Pepsi": "PepsiCo, Inc.",
    "PepsiCo": "PepsiCo, Inc.",
    "Keurig Dr Pepper": "Keurig Dr Pepper Inc.",
    "A&W": "Keurig Dr Pepper Inc.",
    "Barq's": "The Coca-Cola Company",
    "Canada Dry": "Keurig Dr Pepper Inc.",
    "Vernors": "Keurig Dr Pepper Inc.",
    "Jarritos": "Novamex",
    "Bundaberg": "Bundaberg Brewed Drinks",
    "Sanpellegrino": "Sanpellegrino S.p.A. (Nestlé)",
    "San Pellegrino": "Sanpellegrino S.p.A. (Nestlé)",
    "Maaza": "The Coca-Cola Company",
    "Slice": "PepsiCo India Holdings Pvt Ltd",
    "Frooti": "Parle Agro Pvt Ltd",
    "Appy Fizz": "Parle Agro Pvt Ltd",
    "ITC B Natural": "ITC Limited",
    "Real": "Dabur India Ltd",
    "Real Activ": "Dabur India Ltd",
    "Tropicana": "Tropicana Brands Group / PepsiCo",
    "Paper Boat": "Hector Beverages Pvt Ltd",
    "Minute Maid": "The Coca-Cola Company",
    "Patanjali": "Patanjali Ayurved Ltd",
    "Rasna": "Rasna International Pvt Ltd",
    "Lahori": "Archian Foods Pvt Ltd (Lahori)",
    "Goli Soda": "Traditional Indian Soda Bottlers",
    "Kali Mark": "Kali Aerated Water Works",
    "Hajoori": "Hajoori & Sons",
    "Kashmira": "Kashmira Beverages",
    "Xalta": "Xalta Drinks",
    "Storia": "Storia Foods & Beverages Pvt Ltd",
    "Red Bull": "Red Bull GmbH",
    "Monster Energy": "Monster Beverage Corporation",
    "Rockstar": "PepsiCo, Inc. (Rockstar)",
    "NOS": "Monster Beverage Corporation (NOS)",
    "Bang Energy": "Monster Beverage Corporation (Bang)",
    "Reign": "Monster Beverage Corporation (Reign)",
    "Hell Energy": "Hell Energy Magyarország Kft",
    "Prime": "Prime Hydration LLC",
    "Celsius": "Celsius Holdings, Inc.",
    "Lipton": "PepsiCo / Unilever (Pepsi Lipton JV)",
    "Nestea": "Nestlé S.A.",
    "Fuze Tea": "The Coca-Cola Company",
    "Arizona": "Arizona Beverage Company",
    "Pure Leaf": "PepsiCo / Unilever (Pepsi Lipton JV)",
    "Gold Peak": "The Coca-Cola Company",
    "Honest Tea": "The Coca-Cola Company",
    "Teavana": "Starbucks Corporation",
    "Starbucks": "Starbucks Corporation / PepsiCo",
    "Ito En": "Ito En, Ltd.",
    "Pokka": "Pokka Corporation",
    "C2": "Universal Robina Corporation",
    "Gatorade": "PepsiCo, Inc.",
    "Powerade": "The Coca-Cola Company",
    "BodyArmor": "The Coca-Cola Company (BodyArmor)",
    "Electrolit": "Laboratorios Pisa",
    "Otsuka": "Otsuka Pharmaceutical Co., Ltd.",
    "100PLUS": "Fraser and Neave (F&N)",
    "Lucozade": "Suntory Beverage & Food",
    "ORS-L": "Johnson & Johnson / Kenvue",
    "Fast&Up": "Aeronutrix Sports Products Pvt Ltd",
    "Vita Coco": "The Vita Coco Company, Inc.",
    "ZICO": "PowerPlant Beverages (ZICO)",
    "Harmless Harvest": "Harmless Harvest Inc.",
    "C2O": "C2O Pure Coconut Water, LLC",
    "Taste Nirvana": "Taste Nirvana International Inc.",
    "FOCO": "Thai Agri Foods Public Co. Ltd",
    "Dabur": "Dabur India Ltd",
    "UFC": "Universal Robina Corporation",
    "Chaokoh": "Ampol Food Processing Ltd",
    "Cocomax": "Asiatic Agro Industry Co. Ltd",
    "King Island": "King Island Pure Coconut Water",
    "Cocobella": "Made Group Pty Ltd",
    "Naked": "Tropicana Brands Group (Naked Juice)",
    "Naked Juice": "Tropicana Brands Group (Naked Juice)",
    "Innocent": "Innocent Drinks (The Coca-Cola Company)",
    "Liquid I.V.": "Unilever (Liquid I.V.)",
    "Hydralyte": "Prestige Consumer Healthcare",
    "Pedialyte": "Abbott Laboratories",
    "DripDrop": "Drip Drop ORS Inc.",
    "Cure": "Cure Hydration Inc.",
    "Nuun": "Nestlé Health Science (Nuun)",
    "Electral": "FDC Limited",
    "Enerzal": "FDC Limited",
    "Glucon-D": "Zydus Wellness Ltd",
    "Kinley": "The Coca-Cola Company",
    "Aquafina": "PepsiCo, Inc.",
    "Bisleri": "Bisleri International Pvt Ltd",
    "Parle Agro": "Parle Agro Pvt Ltd",
    "Tata Consumer Products": "Tata Consumer Products Limited",
    "Evian": "Danone S.A.",
    "Fiji Water": "The Wonderful Company",
    "VOSS": "Voss of Norway ASA",
    "Perrier": "Nestlé Waters (Perrier)",
    "Gerolsteiner": "Gerolsteiner Brunnen GmbH & Co. KG",
    "Topo Chico": "The Coca-Cola Company (Topo Chico)",
    "LaCroix": "National Beverage Corp.",
    "Bubly": "PepsiCo, Inc.",
    "AHA": "The Coca-Cola Company",
    "Spindrift": "Spindrift Beverage Co.",
    "Waterloo": "Waterloo Sparkling Water Corp.",
    "Hint": "Hint Inc.",
    "Smartwater": "The Coca-Cola Company (Glacéau)",
    "Vitaminwater": "The Coca-Cola Company (Glacéau)",
    "Amul": "Gujarat Cooperative Milk Marketing Federation (GCMMF)",
    "Mother Dairy": "Mother Dairy Fruit & Vegetable Pvt Ltd",
    "Cavin's": "Cavinkare Pvt Ltd",
    "Hershey's": "The Hershey Company",
    "Nesquik": "Nestlé S.A.",
    "Yoo-hoo": "Keurig Dr Pepper Inc.",
    "Chocomel": "FrieslandCampina",
    "Ovaltine": "Associated British Foods / Twinings",
    "Horlicks": "Hindustan Unilever Limited (HUL)",
    "Milo": "Nestlé S.A.",
    "Nescafé": "Nestlé S.A.",
    "Odwalla": "The Coca-Cola Company (Odwalla)",
    "Bolthouse Farms": "Bolthouse Farms Inc.",
    "Suja": "Suja Life LLC",
    "Evolution Fresh": "Bolthouse Farms (Evolution Fresh)",
    "Pressed Juicery": "Pressed Juicery Inc.",
    "POM Wonderful": "The Wonderful Company",
    "Ocean Spray": "Ocean Spray Cranberries, Inc.",
    "Welch's": "National Grape Cooperative Association",
    "Dole": "Dole plc",
    "KDD": "Kuwait Food Products Co. (KDD)",
    "Simply": "The Coca-Cola Company (Simply Beverages)",
    "Country Time": "The Kraft Heinz Company",
    "Newman's Own": "Newman's Own, Inc.",
    "Fever-Tree": "Fevertree Drinks plc",
    "Monin": "Georges Monin SAS",
    "Bindu": "SG Corporates (Bindu)",
    "Catch": "Dharampal Satyapal Group (DS Group)",
    "Raw Pressery": "Rakyan Beverages Pvt Ltd (Raw Pressery)"
}

COUNTRIES = {
    "Coca-Cola": "United States",
    "Schweppes": "United Kingdom",
    "Pepsi": "United States",
    "PepsiCo": "United States",
    "Keurig Dr Pepper": "United States",
    "A&W": "United States",
    "Barq's": "United States",
    "Canada Dry": "United States",
    "Vernors": "United States",
    "Jarritos": "Mexico",
    "Bundaberg": "Australia",
    "Sanpellegrino": "Italy",
    "San Pellegrino": "Italy",
    "Maaza": "India",
    "Slice": "India",
    "Frooti": "India",
    "Appy Fizz": "India",
    "ITC B Natural": "India",
    "Real": "India",
    "Real Activ": "India",
    "Tropicana": "United States",
    "Paper Boat": "India",
    "Minute Maid": "United States",
    "Patanjali": "India",
    "Rasna": "India",
    "Lahori": "India",
    "Goli Soda": "India",
    "Kali Mark": "India",
    "Hajoori": "India",
    "Kashmira": "India",
    "Xalta": "India",
    "Storia": "India",
    "Red Bull": "Austria",
    "Monster Energy": "United States",
    "Rockstar": "United States",
    "NOS": "United States",
    "Bang Energy": "United States",
    "Reign": "United States",
    "Hell Energy": "Hungary",
    "Prime": "United States",
    "Celsius": "United States",
    "Lipton": "United Kingdom",
    "Nestea": "Switzerland",
    "Fuze Tea": "United States",
    "Arizona": "United States",
    "Pure Leaf": "United States",
    "Gold Peak": "United States",
    "Honest Tea": "United States",
    "Teavana": "United States",
    "Starbucks": "United States",
    "Ito En": "Japan",
    "Pokka": "Singapore",
    "C2": "Philippines",
    "Gatorade": "United States",
    "Powerade": "United States",
    "BodyArmor": "United States",
    "Electrolit": "Mexico",
    "Otsuka": "Japan",
    "100PLUS": "Singapore",
    "Lucozade": "United Kingdom",
    "ORS-L": "India",
    "Fast&Up": "India",
    "Vita Coco": "United States",
    "ZICO": "United States",
    "Harmless Harvest": "United States",
    "C2O": "United States",
    "Taste Nirvana": "Thailand",
    "FOCO": "Thailand",
    "Dabur": "India",
    "UFC": "Philippines",
    "Chaokoh": "Thailand",
    "Cocomax": "Thailand",
    "King Island": "Thailand",
    "Cocobella": "Australia",
    "Naked": "United States",
    "Naked Juice": "United States",
    "Innocent": "United Kingdom",
    "Liquid I.V.": "United States",
    "Hydralyte": "Australia",
    "Pedialyte": "United States",
    "DripDrop": "United States",
    "Cure": "United States",
    "Nuun": "United States",
    "Electral": "India",
    "Enerzal": "India",
    "Glucon-D": "India",
    "Kinley": "India",
    "Aquafina": "United States",
    "Bisleri": "India",
    "Parle Agro": "India",
    "Tata Consumer Products": "India",
    "Evian": "France",
    "Fiji Water": "Fiji",
    "VOSS": "Norway",
    "Perrier": "France",
    "Gerolsteiner": "Germany",
    "Topo Chico": "Mexico",
    "LaCroix": "United States",
    "Bubly": "United States",
    "AHA": "United States",
    "Spindrift": "United States",
    "Waterloo": "United States",
    "Hint": "United States",
    "Smartwater": "United States",
    "Vitaminwater": "United States",
    "Amul": "India",
    "Mother Dairy": "India",
    "Cavin's": "India",
    "Hershey's": "United States",
    "Nesquik": "Switzerland",
    "Yoo-hoo": "United States",
    "Chocomel": "Netherlands",
    "Ovaltine": "Switzerland",
    "Horlicks": "United Kingdom",
    "Milo": "Australia",
    "Nescafé": "Switzerland",
    "Odwalla": "United States",
    "Bolthouse Farms": "United States",
    "Suja": "United States",
    "Evolution Fresh": "United States",
    "Pressed Juicery": "United States",
    "POM Wonderful": "United States",
    "Ocean Spray": "United States",
    "Welch's": "United States",
    "Dole": "United States",
    "KDD": "Kuwait",
    "Simply": "United States",
    "Country Time": "United States",
    "Newman's Own": "United States",
    "Fever-Tree": "United Kingdom",
    "Monin": "France",
    "Bindu": "India",
    "Catch": "India",
    "Raw Pressery": "India"
}

def generate_gtin(prefix, index):
    code = f"890{prefix:03d}{index:06d}"
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(code))
    check = (10 - (s % 10)) % 10
    return f"{code}{check}"

def get_flavour(name, details):
    comb = f"{name} {details}".lower()
    if "mango" in comb: return "Mango"
    if "lemon-lime" in comb or "lemon lime" in comb or "lime" in comb: return "Lemon-Lime"
    if "lemon" in comb or "nimbu" in comb: return "Lemon"
    if "orange" in comb: return "Orange"
    if "apple" in comb: return "Apple"
    if "guava" in comb: return "Guava"
    if "pomegranate" in comb or "anar" in comb: return "Pomegranate"
    if "cranberry" in comb: return "Cranberry"
    if "grape" in comb: return "Grape"
    if "litchi" in comb or "lychee" in comb: return "Litchi"
    if "pineapple" in comb: return "Pineapple"
    if "strawberry" in comb: return "Strawberry"
    if "blueberry" in comb: return "Blueberry"
    if "raspberry" in comb: return "Raspberry"
    if "peach" in comb: return "Peach"
    if "cherry" in comb: return "Cherry"
    if "watermelon" in comb: return "Watermelon"
    if "jeera" in comb or "cumin" in comb or "zeera" in comb: return "Jeera (Cumin)"
    if "ginger" in comb: return "Ginger"
    if "cola" in comb: return "Cola"
    if "chocolate" in comb: return "Chocolate"
    if "coffee" in comb or "café" in comb or "espresso" in comb or "frappe" in comb: return "Coffee"
    if "cardamom" in comb or "elaichi" in comb: return "Cardamom"
    if "almond" in comb or "badam" in comb: return "Almond"
    if "rose" in comb: return "Rose"
    if "coconut" in comb: return "Coconut"
    if "green tea" in comb or "matcha" in comb: return "Green Tea"
    if "root beer" in comb: return "Root Beer"
    if "cream soda" in comb: return "Cream Soda"
    if "tonic" in comb: return "Quinine Tonic"
    if "mojito" in comb: return "Mint & Lime"
    return "Classic / Natural"

def get_beverage_type(sec, name, details):
    comb = f"{sec} {name} {details}".lower()
    if "carbonated soft drink" in comb or "cola" in comb or "soda" in comb or "root beer" in comb:
        return "Carbonated Soft Drink"
    if "energy drink" in comb:
        return "Energy Drink"
    if "iced tea" in comb or "tea" in comb:
        return "Iced Tea"
    if "sports" in comb or "electrolyte" in comb or "isotonic" in comb:
        return "Sports Electrolyte Drink"
    if "coconut water" in comb:
        return "Coconut Water"
    if "milkshake" in comb or "milk drink" in comb or "lassi" in comb or "chhach" in comb or "buttermilk" in comb:
        return "Packaged Milkshake / Cultured Dairy"
    if "smoothie" in comb or "cold-pressed" in comb:
        return "Cold-Pressed Juice / Smoothie"
    if "water" in comb and "sparkling" in comb:
        return "Sparkling Water"
    if "water" in comb:
        return "Packaged Mineral / Flavoured Water"
    if "mixer" in comb or "tonic" in comb or "syrup" in comb or "mocktail" in comb:
        return "Mocktail Mixer / Botanical Beverage"
    return "Fruit Juice / Nectar Drink"

def get_nutrition_and_ingredients(name, brand, sec, bev_type, flavour):
    comb = f"{name} {sec} {bev_type}".lower()
    is_zero = "zero" in comb or "diet" in comb or "sugar free" in comb or "sugarfree" in comb or "unsweetened" in comb
    
    # Defaults
    serving = "250 ml"
    package = "300 ml"
    cals = 42
    carbs = 10.5
    sugars = 10.5
    added_sugars = 10.5
    protein = 0.0
    fat = 0.0
    sat_fat = 0.0
    sodium = 12
    allergens = []
    ingr = f"Purified Water, Natural Flavourings ({flavour}), Acidity Regulator (INS 330)."
    
    if sec == "Carbonated Soft Drinks":
        serving = "250 ml"
        package = "300 ml (Can / Bottle)"
        if is_zero:
            cals = 0.8
            carbs = 0.1
            sugars = 0.0
            added_sugars = 0.0
            sodium = 18
            ingr = f"Carbonated Water, Acidity Regulators (INS 338, INS 330), Colour (INS 150d), Non-Caloric Sweeteners (INS 951 Aspartame, INS 950 Acesulfame Potassium), Preservative (INS 211), Caffeine (Natural), Natural Flavouring Substances ({flavour})."
        else:
            cals = 44
            carbs = 11.0
            sugars = 10.8
            added_sugars = 10.8
            sodium = 11
            ingr = f"Carbonated Water, Sugar (10.6%), Acidity Regulator (INS 338, INS 330), Colour (INS 150d), Caffeine, Natural Flavouring Substances ({flavour})."

    elif sec == "Indian Fruit Drinks and Juices":
        serving = "200 ml"
        package = "200 ml / 1 L Tetra Pak"
        cals = 54
        carbs = 13.5
        sugars = 12.8
        added_sugars = 6.5
        protein = 0.4
        sodium = 15
        ingr = f"Water, {flavour} Pulp / Concentrate (25%), Sugar, Acidity Regulator (INS 330), Antioxidant (INS 300 - Vitamin C), Stabilizer (INS 440), Nature Identical {flavour} Flavour."

    elif sec == "Energy Drinks":
        serving = "250 ml"
        package = "250 ml Slim Can"
        if is_zero:
            cals = 3
            carbs = 0.5
            sugars = 0.0
            added_sugars = 0.0
            sodium = 80
            ingr = f"Carbonated Water, Acid (Citric Acid INS 330), Taurine (0.4%), Acidity Regulator (Sodium Citrates INS 331), Caffeine (0.03%), Sweeteners (Sucralose INS 955, Acesulfame K INS 950), Vitamins (Niacin B3, Pantothenic Acid B5, B6, B12), Natural Flavours, Colour (INS 150a)."
        else:
            cals = 45
            carbs = 11.0
            sugars = 11.0
            added_sugars = 11.0
            sodium = 75
            ingr = f"Carbonated Water, Sucrose, Glucose, Acid (Citric Acid INS 330), Taurine (0.4%), Acidity Regulator (Sodium Citrates INS 331), Caffeine (0.03%), Vitamins (Niacin B3, Pantothenic Acid B5, B6, B12), Natural Flavourings, Colours (Caramel INS 150a, Riboflavin INS 101)."

    elif sec == "Iced Tea":
        serving = "250 ml"
        package = "250 ml / 330 ml Can"
        if is_zero:
            cals = 1
            carbs = 0.2
            sugars = 0.0
            added_sugars = 0.0
            sodium = 10
            ingr = f"Brewed Tea (Water, Black/Green Tea Solids), Acidity Regulators (INS 330, INS 296), Sweeteners (INS 955 Sucralose, INS 950), Natural {flavour} Flavour, Antioxidant (Ascorbic Acid INS 300)."
        else:
            cals = 31
            carbs = 7.5
            sugars = 7.2
            added_sugars = 7.0
            sodium = 12
            ingr = f"Water, Sugar, Black Tea Extract (0.14%), Acidity Regulators (INS 330, INS 296), Natural {flavour} Flavour, Antioxidant (INS 300 Vitamin C)."

    elif sec == "Sports and Electrolyte Drinks":
        serving = "250 ml"
        package = "500 ml PET Bottle"
        if is_zero:
            cals = 2
            carbs = 0.4
            sugars = 0.0
            added_sugars = 0.0
            sodium = 48
            ingr = f"Water, Electrolytes (Sodium Chloride, Monopotassium Phosphate), Acidity Regulators (INS 330, INS 331), Sweeteners (Sucralose INS 955, Acesulfame K INS 950), Natural {flavour} Flavour, B-Vitamins (B3, B6, B12)."
        else:
            cals = 26
            carbs = 6.0
            sugars = 5.8
            added_sugars = 5.8
            sodium = 45
            ingr = f"Water, Sugar, Dextrose, Citric Acid (INS 330), Mineral Salts (Sodium Chloride, Sodium Citrate INS 331, Monopotassium Phosphate), Natural {flavour} Flavour, Colour (INS 110/INS 133)."

    elif sec == "Coconut Water and Hydration":
        serving = "200 ml"
        package = "200 ml / 330 ml Tetra Pak / Bottle"
        cals = 20
        carbs = 4.8
        sugars = 4.2
        added_sugars = 0.0
        protein = 0.2
        sodium = 22
        ingr = f"100% Pure Tender Coconut Water (99.9%), Antioxidant (Ascorbic Acid INS 300 / Vitamin C <0.1%)."

    elif sec == "Packaged Water and Flavoured Water":
        serving = "250 ml"
        package = "500 ml / 1 L Bottle"
        if "sparkling" in comb or "lacroix" in comb or "bubly" in comb or "spindrift" in comb or "perrier" in comb:
            cals = 0
            carbs = 0.0
            sugars = 0.0
            added_sugars = 0.0
            sodium = 2
            ingr = f"Purified Carbonated Mineral Water, Natural {flavour} Essence & Botanicals."
        else:
            cals = 0
            carbs = 0.0
            sugars = 0.0
            added_sugars = 0.0
            sodium = 1
            ingr = f"Treated Purified Drinking Water, Minerals (Magnesium Sulphate, Potassium Bicarbonate, Copper Trace Minerals)."

    elif sec == "Milkshakes and Dairy Drinks":
        serving = "200 ml"
        package = "200 ml Can / Tetra Pak"
        cals = 88
        carbs = 12.8
        sugars = 12.0
        added_sugars = 7.5
        protein = 3.2
        fat = 3.1
        sat_fat = 2.0
        sodium = 45
        allergens = ["Milk / Dairy"]
        if "lassi" in comb or "chaas" in comb or "buttermilk" in comb:
            cals = 62
            carbs = 8.5
            sugars = 8.0
            added_sugars = 4.0
            protein = 2.8
            fat = 1.8
            sat_fat = 1.1
            sodium = 90
            ingr = f"Pasteurized Toned Milk Dahi (Cultured Curd), Water, Sugar (if sweet) or Iodized Salt & Spices (Jeera, Ginger, Green Chilli if savoury), Active Lactic Cultures."
        else:
            ingr = f"Standardized Milk (88%), Sugar (7.5%), Cocoa Solids / {flavour} Extracts (1.8%), Emulsifier (INS 471), Stabilizer (INS 407 Carrageenan), Acidity Regulator (INS 339), Nature Identical {flavour} Flavour."

    elif sec == "Premium Fruit and Vegetable Drinks":
        serving = "250 ml"
        package = "300 ml / 450 ml Bottle"
        cals = 52
        carbs = 12.4
        sugars = 11.2
        added_sugars = 0.0
        protein = 0.9
        sodium = 18
        ingr = f"100% Cold-Pressed Fruit & Vegetable Juices ({flavour}, Apple Puree, Banana Puree, Spinach, Ginger), Spirulina, Ascorbic Acid (Vitamin C)."

    elif sec == "Lemonades and Mocktail Mixers":
        serving = "200 ml"
        package = "200 ml / 250 ml Glass Bottle"
        if is_zero or "soda" in comb:
            cals = 2
            carbs = 0.5
            sugars = 0.0
            added_sugars = 0.0
            sodium = 14
            ingr = f"Carbonated Spring Water, Natural Botanicals ({flavour}), Quinine (from Central Africa), Citric Acid (INS 330)."
        else:
            cals = 38
            carbs = 9.2
            sugars = 8.9
            added_sugars = 8.9
            sodium = 15
            ingr = f"Carbonated Spring Water, Cane Sugar, Fruit Juices ({flavour} 8%), Natural Botanical Flavours, Citric Acid (INS 330), Antioxidant (Ascorbic Acid INS 300)."

    nutrition = {
        "calories": round(cals, 1),
        "totalFat": round(fat, 1),
        "saturatedFat": round(sat_fat, 1),
        "transFat": 0.0,
        "carbohydrates": round(carbs, 1),
        "sugars": round(sugars, 1),
        "addedSugars": round(added_sugars, 1),
        "protein": round(protein, 1),
        "sodium": int(sodium),
        "salt": round(sodium * 2.5 / 1000, 3)
    }
    
    return serving, package, nutrition, ingr, allergens

enriched = []
for idx, it in enumerate(items, 1):
    num = it["number"]
    name = it["name"]
    brand = it["brand"]
    details = it["details"]
    sec = it["section"]
    
    product_id = f"CLD-{num:04d}"
    barcode = generate_gtin(860, num)
    manufacturer = MANUFACTURERS.get(brand, f"{brand} Beverages Co.")
    country = COUNTRIES.get(brand, "India" if "Indian" in sec or "Paper Boat" in brand or "Amul" in brand or "Real" in brand else "United States")
    
    flavour = get_flavour(name, details)
    bev_type = get_beverage_type(sec, name, details)
    serving, package, nutrition, ingr, allergens = get_nutrition_and_ingredients(name, brand, sec, bev_type, flavour)
    
    enriched.append({
        "productId": product_id,
        "name": name,
        "brand": brand,
        "details": details,
        "drinkSection": sec,
        "beverageType": bev_type,
        "flavour": flavour,
        "category": "Cold Drinks",
        "subCategory": sec,
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

print(f"Enriched {len(enriched)} cold drinks.")

with open("scripts/data/cold_drinks_500.json", "w") as f:
    json.dump(enriched, f, indent=2)

with open("scripts/data/cold_drinks_500.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=[
        "productId", "name", "brand", "drinkSection", "beverageType", "flavour",
        "category", "subCategory", "manufacturer", "countryOfOrigin", "packageSize",
        "servingSize", "barcode", "imageUrl", "ingredientsText", "calories",
        "sugars", "addedSugars", "totalFat", "protein", "sodium", "allergens"
    ])
    writer.writeheader()
    for row in enriched:
        nut = row["nutritionPer100g"]
        writer.writerow({
            "productId": row["productId"],
            "name": row["name"],
            "brand": row["brand"],
            "drinkSection": row["drinkSection"],
            "beverageType": row["beverageType"],
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
            "protein": nut["protein"],
            "sodium": nut["sodium"],
            "allergens": "; ".join(row["allergens"])
        })

print("Generated scripts/data/cold_drinks_500.json and scripts/data/cold_drinks_500.csv successfully!")
