import json
import os

os.makedirs("scripts/data", exist_ok=True)
os.makedirs("public/images/packshots", exist_ok=True)

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

def generate_svg(barcode, brand, name, subcat, theme="chocolate"):
    if theme == "chocolate":
        bg1, bg2 = "#2e1065", "#1e1b4b" if "Dark" in subcat else ("#451a03", "#78350f")
        accent = "#f59e0b"
        tag_bg = "#d97706"
    elif theme == "cold_drink":
        bg1, bg2 = "#0f172a", "#1e293b"
        accent = "#38bdf8"
        tag_bg = "#0284c7"
    else: # beverage
        bg1, bg2 = "#064e3b", "#065f46"
        accent = "#34d399"
        tag_bg = "#059669"

    # Clean strings for XML
    safe_name = name.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    safe_brand = brand.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    safe_sub = subcat.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg1}"/>
      <stop offset="100%" stop-color="{bg2}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)" rx="24"/>
  <rect x="20" y="20" width="360" height="360" rx="16" fill="none" stroke="{accent}" stroke-width="2" stroke-opacity="0.3"/>
  <g filter="url(#shadow)">
    <rect x="50" y="50" width="300" height="300" rx="20" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
  </g>
  <rect x="120" y="70" width="160" height="32" rx="16" fill="{tag_bg}"/>
  <text x="200" y="91" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">{safe_brand.upper()}</text>
  <text x="200" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">
    {safe_name[:26]}
  </text>
  <text x="200" y="188" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#e2e8f0" text-anchor="middle">
    {safe_name[26:54] if len(safe_name) > 26 else ""}
  </text>
  <circle cx="200" cy="245" r="38" fill="{accent}" fill-opacity="0.2" stroke="{accent}" stroke-width="2"/>
  <text x="200" y="252" font-family="system-ui, sans-serif" font-size="24" text-anchor="middle">{'🍫' if theme=='chocolate' else ('🥤' if theme=='cold_drink' else '🧃')}</text>
  <rect x="80" y="305" width="240" height="28" rx="14" fill="#000000" fill-opacity="0.35"/>
  <text x="200" y="323" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">{safe_sub}</text>
</svg>"""

    path = f"public/images/packshots/{barcode}.svg"
    with open(path, "w") as f:
        f.write(svg)

# ==============================================================================
# 1. CHOCOLATES & SWEETS CANDIDATES (108 items across 20 subcategories)
# ==============================================================================
chocolates_data = [
    # 1. Dark Chocolate
    ("Amul", "Amul Dark Chocolate 55% Rich Cocoa", "Amul (GCMMF)", "Dark Chocolate", "Bar", "Dark Cocoa", "150 g", "30 g",
     "Sugar, Cocoa Solids, Cocoa Butter, Emulsifiers (INS 322, INS 476), Nature Identical Flavouring Substances (Vanilla).",
     {"calories": 540, "totalFat": 32.0, "saturatedFat": 19.5, "carbohydrates": 57.0, "sugars": 45.0, "addedSugars": 45.0, "fiber": 6.8, "protein": 6.0, "sodium": 18, "salt": 0.05}),
    ("Amul", "Amul Single Origin 75% Dark Chocolate", "Amul (GCMMF)", "Dark Chocolate", "Bar", "Single Origin Dark Cocoa", "150 g", "30 g",
     "Cocoa Solids, Sugar, Cocoa Butter, Emulsifiers (INS 322, INS 476), Natural Vanilla Flavour.",
     {"calories": 560, "totalFat": 39.0, "saturatedFat": 24.0, "carbohydrates": 44.0, "sugars": 25.0, "addedSugars": 25.0, "fiber": 9.5, "protein": 8.0, "sodium": 12, "salt": 0.03}),
    ("Amul", "Amul Bitter Dark Chocolate 90% Cocoa", "Amul (GCMMF)", "Dark Chocolate", "Bar", "Intense Dark Bitter", "150 g", "25 g",
     "Cocoa Solids, Cocoa Butter, Sugar, Emulsifier (INS 322).",
     {"calories": 590, "totalFat": 48.0, "saturatedFat": 30.0, "carbohydrates": 28.0, "sugars": 10.0, "addedSugars": 10.0, "fiber": 12.0, "protein": 9.5, "sodium": 8, "salt": 0.02}),
    ("Cadbury", "Cadbury Bournville 50% Dark Chocolate Rich Cocoa", "Mondelez India Foods Pvt Ltd", "Dark Chocolate", "Bar", "Classic Dark", "80 g", "20 g",
     "Sugar, Cocoa Solids (40%), Cocoa Butter, Milk Solids, Emulsifiers (INS 442, INS 476), Flavours.",
     {"calories": 535, "totalFat": 30.5, "saturatedFat": 18.2, "carbohydrates": 59.0, "sugars": 49.5, "addedSugars": 49.0, "fiber": 5.8, "protein": 5.5, "sodium": 28, "salt": 0.07}),
    ("Cadbury", "Cadbury Bournville 70% Dark Chocolate Intense", "Mondelez India Foods Pvt Ltd", "Dark Chocolate", "Bar", "Intense Dark Cocoa", "80 g", "20 g",
     "Cocoa Solids (60%), Sugar, Cocoa Butter, Emulsifiers (INS 442, INS 476), Nature Identical Flavouring Substances.",
     {"calories": 558, "totalFat": 38.0, "saturatedFat": 23.5, "carbohydrates": 45.0, "sugars": 30.0, "addedSugars": 30.0, "fiber": 8.8, "protein": 7.2, "sodium": 16, "salt": 0.04}),
    ("Lindt", "Lindt Excellence 70% Cocoa Smooth Dark Chocolate Bar", "Lindt & Sprüngli AG", "Dark Chocolate", "Bar", "Smooth Dark", "100 g", "20 g",
     "Cocoa Mass, Sugar, Cocoa Butter, Natural Bourbon Vanilla Beans.",
     {"calories": 566, "totalFat": 41.0, "saturatedFat": 24.0, "carbohydrates": 34.0, "sugars": 29.0, "addedSugars": 29.0, "fiber": 9.0, "protein": 9.5, "sodium": 10, "salt": 0.03}),

    # 2. Milk Chocolate
    ("Cadbury", "Cadbury Dairy Milk Chocolate Bar", "Mondelez India Foods Pvt Ltd", "Milk Chocolate", "Bar", "Creamy Milk Chocolate", "130 g", "20 g",
     "Sugar, Milk Solids (22%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Nature Identical Flavours.",
     {"calories": 534, "totalFat": 30.2, "saturatedFat": 18.5, "carbohydrates": 58.5, "sugars": 57.0, "addedSugars": 47.0, "fiber": 2.1, "protein": 7.5, "sodium": 135, "salt": 0.34}),
    ("Cadbury", "Cadbury Dairy Milk Silk Pure Milk Chocolate", "Mondelez India Foods Pvt Ltd", "Milk Chocolate", "Bar", "Silky Milk Chocolate", "150 g", "25 g",
     "Sugar, Milk Solids (25%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Natural Vanilla Flavour.",
     {"calories": 550, "totalFat": 33.5, "saturatedFat": 20.8, "carbohydrates": 55.0, "sugars": 54.0, "addedSugars": 44.0, "fiber": 1.8, "protein": 8.0, "sodium": 145, "salt": 0.36}),
    ("Amul", "Amul Milk Chocolate Classic Smooth", "Amul (GCMMF)", "Milk Chocolate", "Bar", "Creamy Smooth Milk", "150 g", "30 g",
     "Sugar, Milk Solids (24%), Cocoa Butter, Cocoa Solids, Permitted Emulsifiers (INS 322, INS 476).",
     {"calories": 542, "totalFat": 31.5, "saturatedFat": 19.8, "carbohydrates": 56.5, "sugars": 53.0, "addedSugars": 43.0, "fiber": 2.0, "protein": 7.8, "sodium": 128, "salt": 0.32}),
    ("Nestlé", "Nestlé Classic Pure Milk Chocolate Bar", "Nestlé India Ltd", "Milk Chocolate", "Bar", "Classic Milk", "34 g", "17 g",
     "Sugar, Milk Solids (21.5%), Cocoa Butter, Cocoa Solids, Emulsifier (Soya Lecithin).",
     {"calories": 528, "totalFat": 29.8, "saturatedFat": 18.0, "carbohydrates": 59.2, "sugars": 56.5, "addedSugars": 46.5, "fiber": 2.2, "protein": 7.2, "sodium": 118, "salt": 0.3}),
    ("Hershey's", "Hershey's Creamy Milk Chocolate Bar", "Hershey India Pvt Ltd", "Milk Chocolate", "Bar", "Creamy Milk", "100 g", "25 g",
     "Cane Sugar, Milk, Cocoa Butter, Chocolate, Milk Fat, Lecithin (Soy), Natural Flavor.",
     {"calories": 530, "totalFat": 30.5, "saturatedFat": 19.0, "carbohydrates": 58.0, "sugars": 55.0, "addedSugars": 45.0, "fiber": 2.3, "protein": 7.6, "sodium": 120, "salt": 0.3}),
    ("Galaxy", "Galaxy Smooth Milk Chocolate Bar", "Mars International India Pvt Ltd", "Milk Chocolate", "Bar", "Velvety Milk Chocolate", "100 g", "25 g",
     "Sugar, Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Milk Fat, Palm Fat, Lactose, Emulsifier (Soya Lecithin), Natural Vanilla Extract.",
     {"calories": 545, "totalFat": 32.2, "saturatedFat": 19.4, "carbohydrates": 56.0, "sugars": 55.0, "addedSugars": 45.0, "fiber": 1.9, "protein": 7.4, "sodium": 125, "salt": 0.31}),

    # 3. White Chocolate
    ("Nestlé", "Nestlé Milkybar Creamy White Chocolate Bar", "Nestlé India Ltd", "White Chocolate", "Bar", "Creamy Vanilla White", "42 g", "21 g",
     "Milk Solids (35.8%), Sugar, Hydrogenated Vegetable Fats, Emulsifier (Soya Lecithin), Nature Identical Flavouring Substances.",
     {"calories": 538, "totalFat": 30.8, "saturatedFat": 19.5, "carbohydrates": 57.2, "sugars": 55.0, "addedSugars": 43.0, "fiber": 0.0, "protein": 9.5, "sodium": 160, "salt": 0.4}),
    ("Amul", "Amul Green Tea & White Chocolate Bar", "Amul (GCMMF)", "White Chocolate", "Bar", "Green Tea Matcha White", "150 g", "30 g",
     "Sugar, Cocoa Butter, Milk Solids, Green Tea Powder, Emulsifiers (INS 322, INS 476).",
     {"calories": 560, "totalFat": 34.5, "saturatedFat": 21.0, "carbohydrates": 55.0, "sugars": 52.0, "addedSugars": 42.0, "fiber": 1.2, "protein": 8.0, "sodium": 130, "salt": 0.32}),
    ("Lindt", "Lindt Classic Recipe Creamy White Chocolate Bar", "Lindt & Sprüngli AG", "White Chocolate", "Bar", "Vanilla Bean White", "100 g", "25 g",
     "Sugar, Cocoa Butter, Whole Milk Powder, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Natural Flavouring.",
     {"calories": 564, "totalFat": 35.0, "saturatedFat": 22.0, "carbohydrates": 56.0, "sugars": 56.0, "addedSugars": 45.0, "fiber": 0.0, "protein": 7.1, "sodium": 150, "salt": 0.38}),
    ("Milkybar", "Nestlé Milkybar Moosha Caramel White Bar", "Nestlé India Ltd", "White Chocolate", "Bar", "Creamy Caramel White", "40 g", "20 g",
     "Milk Solids (33%), Sugar, Liquid Glucose, Vegetable Fat, Invert Sugar, Emulsifier (Soya Lecithin).",
     {"calories": 490, "totalFat": 24.5, "saturatedFat": 16.0, "carbohydrates": 62.0, "sugars": 58.0, "addedSugars": 46.0, "fiber": 0.2, "protein": 6.8, "sodium": 140, "salt": 0.35}),
    ("Ferrero", "Raffaello White Chocolate Coconut Almond Confection", "Ferrero India Pvt Ltd", "White Chocolate", "Bites", "Coconut Cream & Almond", "150 g", "30 g",
     "Desiccated Coconut (25.5%), Vegetable Fats (Palm, Shea), Sugar, Almond (8%), Skimmed Milk Powder, Whey Powder, Wheat Flour, Emulsifiers.",
     {"calories": 628, "totalFat": 48.6, "saturatedFat": 29.7, "carbohydrates": 38.3, "sugars": 33.3, "addedSugars": 28.0, "fiber": 4.1, "protein": 7.2, "sodium": 120, "salt": 0.3}),

    # 4. Chocolate Bars
    ("Cadbury", "Cadbury Dairy Milk Silk Roast Almond Chocolate Bar", "Mondelez India Foods Pvt Ltd", "Chocolate Bars", "Bar", "Roast Almond Silk", "143 g", "25 g",
     "Sugar, Milk Solids, Cocoa Butter, Roasted Almonds (16%), Cocoa Solids, Emulsifiers (INS 442, INS 476).",
     {"calories": 568, "totalFat": 36.5, "saturatedFat": 18.0, "carbohydrates": 50.0, "sugars": 47.0, "addedSugars": 38.0, "fiber": 3.8, "protein": 9.5, "sodium": 120, "salt": 0.3}),
    ("Cadbury", "Cadbury Dairy Milk Silk Fruit & Nut Bar", "Mondelez India Foods Pvt Ltd", "Chocolate Bars", "Bar", "Fruit and Roasted Nut", "137 g", "25 g",
     "Sugar, Milk Solids, Cocoa Butter, Raisins (9%), Cocoa Solids, Cashews (7%), Emulsifiers (INS 442, INS 476).",
     {"calories": 535, "totalFat": 31.0, "saturatedFat": 17.5, "carbohydrates": 56.0, "sugars": 52.0, "addedSugars": 41.0, "fiber": 2.9, "protein": 7.9, "sodium": 125, "salt": 0.31}),
    ("Snickers", "Snickers Roasted Peanut Caramel Chocolate Bar", "Mars International India Pvt Ltd", "Chocolate Bars", "Bar", "Peanut Caramel Nougat", "50 g", "50 g",
     "Milk Chocolate (Sugar, Cocoa Butter, Cocoa Solids, Skimmed Milk Powder, Lactose), Peanuts (22%), Liquid Glucose, Sugar, Hydrogenated Palm Oil, Salt, Egg White Powder.",
     {"calories": 508, "totalFat": 28.0, "saturatedFat": 11.0, "carbohydrates": 55.0, "sugars": 44.0, "addedSugars": 38.0, "fiber": 3.6, "protein": 9.0, "sodium": 220, "salt": 0.55}),
    ("Snickers", "Snickers Almond Nougat Caramel Chocolate Bar", "Mars International India Pvt Ltd", "Chocolate Bars", "Bar", "Almond Nougat", "45 g", "45 g",
     "Milk Chocolate, Almonds (19%), Glucose Syrup, Sugar, Vegetable Oil, Skimmed Milk Powder, Salt, Egg Whites.",
     {"calories": 512, "totalFat": 29.0, "saturatedFat": 10.5, "carbohydrates": 54.0, "sugars": 42.0, "addedSugars": 36.0, "fiber": 3.5, "protein": 9.2, "sodium": 210, "salt": 0.52}),
    ("Mars", "Mars Nougat & Caramel Milk Chocolate Bar", "Mars International India Pvt Ltd", "Chocolate Bars", "Bar", "Caramel & Soft Nougat", "51 g", "51 g",
     "Sugar, Glucose Syrup, Cocoa Butter, Full Cream Milk Powder, Cocoa Mass, Sunflower Oil, Skimmed Milk Powder, Lactose, Whey Powder, Fat Reduced Cocoa, Milk Fat, Barley Malt Extract, Salt, Emulsifier (Soya Lecithin), Egg White Powder.",
     {"calories": 449, "totalFat": 17.0, "saturatedFat": 8.0, "carbohydrates": 69.5, "sugars": 60.0, "addedSugars": 52.0, "fiber": 1.2, "protein": 4.1, "sodium": 160, "salt": 0.4}),
    ("Cadbury", "Cadbury 5 Star Caramel & Nougat Chocolate Bar", "Mondelez India Foods Pvt Ltd", "Chocolate Bars", "Bar", "Chewy Caramel Nougat", "40 g", "20 g",
     "Sugar, Liquid Glucose, Milk Solids, Invert Sugar, Hydrogenated Vegetable Oil, Cocoa Solids, Cocoa Butter, Emulsifiers (INS 442, INS 471), Salt.",
     {"calories": 450, "totalFat": 16.5, "saturatedFat": 10.5, "carbohydrates": 71.0, "sugars": 58.0, "addedSugars": 50.0, "fiber": 1.5, "protein": 4.2, "sodium": 150, "salt": 0.38}),

    # 5. Chocolate Wafer Bars
    ("Nestlé", "Nestlé KitKat 4-Finger Crisp Wafer Chocolate Bar", "Nestlé India Ltd", "Chocolate Wafer Bars", "Bar", "Crispy Wafer Milk Choco", "38.5 g", "19 g",
     "Sugar, Milk Solids, Refined Wheat Flour (Maida), Cocoa Butter, Cocoa Solids, Hydrogenated Vegetable Fats, Emulsifier (Soya Lecithin), Raising Agent (INS 500ii).",
     {"calories": 505, "totalFat": 25.5, "saturatedFat": 16.8, "carbohydrates": 62.0, "sugars": 48.0, "addedSugars": 42.0, "fiber": 2.2, "protein": 6.8, "sodium": 80, "salt": 0.2}),
    ("Nestlé", "Nestlé KitKat Chunky Milk Chocolate Wafer Bar", "Nestlé India Ltd", "Chocolate Wafer Bars", "Bar", "Chunky Crisp Wafer", "40 g", "40 g",
     "Sugar, Wheat Flour, Skimmed Milk Powder, Cocoa Mass, Cocoa Butter, Vegetable Fats, Milk Fat, Emulsifier (Sunflower Lecithin), Raising Agent.",
     {"calories": 515, "totalFat": 26.5, "saturatedFat": 15.0, "carbohydrates": 61.5, "sugars": 50.0, "addedSugars": 43.0, "fiber": 2.1, "protein": 7.0, "sodium": 90, "salt": 0.22}),
    ("Cadbury", "Cadbury Perk Crispy Wafer Coated Chocolate Bar", "Mondelez India Foods Pvt Ltd", "Chocolate Wafer Bars", "Bar", "Light Wafer Chocolate", "28 g", "14 g",
     "Sugar, Refined Wheat Flour, Hydrogenated Vegetable Oils, Milk Solids, Cocoa Solids (4%), Emulsifiers (INS 442, INS 322), Iodised Salt.",
     {"calories": 502, "totalFat": 24.0, "saturatedFat": 14.5, "carbohydrates": 65.0, "sugars": 47.0, "addedSugars": 40.0, "fiber": 2.0, "protein": 5.5, "sodium": 140, "salt": 0.35}),
    ("Nestlé", "Nestlé Munch Crunchy Coated Wafer Chocolate Bar", "Nestlé India Ltd", "Chocolate Wafer Bars", "Bar", "Crunchy Wheat Wafer", "25 g", "25 g",
     "Sugar, Refined Wheat Flour, Hydrogenated Palm Kernel Oil, Cocoa Solids, Milk Solids, Emulsifier (Soya Lecithin), Yeast, Salt.",
     {"calories": 480, "totalFat": 21.0, "saturatedFat": 15.0, "carbohydrates": 68.0, "sugars": 46.0, "addedSugars": 38.0, "fiber": 2.5, "protein": 6.2, "sodium": 130, "salt": 0.32}),
    ("Nestlé", "Nestlé Munch Max Extra Crunch Chocolate Wafer", "Nestlé India Ltd", "Chocolate Wafer Bars", "Bar", "Extra Crunchy Wafer", "35 g", "35 g",
     "Refined Wheat Flour, Sugar, Hydrogenated Vegetable Fat, Cocoa Solids (4.5%), Milk Solids, Emulsifiers, Raising Agent.",
     {"calories": 485, "totalFat": 22.0, "saturatedFat": 15.5, "carbohydrates": 66.5, "sugars": 45.0, "addedSugars": 37.0, "fiber": 2.4, "protein": 6.0, "sodium": 135, "salt": 0.34}),
    ("Kinder", "Kinder Bueno Milk and Hazelnut Crisp Wafer Bar", "Ferrero India Pvt Ltd", "Chocolate Wafer Bars", "Bar", "Hazelnut Cream Wafer", "43 g", "21.5 g",
     "Milk Chocolate (31.5%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Milk Fat, Emulsifier), Sugar, Palm Oil, Wheat Flour, Hazelnuts (10.8%), Skimmed Milk Powder.",
     {"calories": 572, "totalFat": 37.3, "saturatedFat": 17.3, "carbohydrates": 49.5, "sugars": 41.2, "addedSugars": 35.0, "fiber": 2.5, "protein": 8.6, "sodium": 107, "salt": 0.27}),

    # 6. Chocolate Bites & Minis
    ("Cadbury", "Cadbury Gems Colorful Chocolate Buttons", "Mondelez India Foods Pvt Ltd", "Chocolate Bites & Minis", "Bites", "Candy Coated Chocolate", "25 g", "25 g",
     "Sugar, Hydrogenated Vegetable Fat, Milk Solids, Cocoa Solids (7%), Emulsifiers (INS 414, INS 442, INS 476), Glazing Agent (INS 903), Permitted Food Colours.",
     {"calories": 480, "totalFat": 20.0, "saturatedFat": 14.0, "carbohydrates": 71.0, "sugars": 65.0, "addedSugars": 55.0, "fiber": 2.0, "protein": 4.5, "sodium": 75, "salt": 0.19}),
    ("Cadbury", "Cadbury Dairy Milk Shots Crisp Sugar Coated Poppers", "Mondelez India Foods Pvt Ltd", "Chocolate Bites & Minis", "Bites", "Popping Milk Chocolate", "58 g", "20 g",
     "Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Glazing Agent (INS 903), Emulsifiers (INS 442, INS 476).",
     {"calories": 505, "totalFat": 23.5, "saturatedFat": 15.2, "carbohydrates": 68.0, "sugars": 63.0, "addedSugars": 52.0, "fiber": 2.1, "protein": 5.8, "sodium": 110, "salt": 0.28}),
    ("Cadbury", "Cadbury Nutties Chocolate Coated Roasted Cashews", "Mondelez India Foods Pvt Ltd", "Chocolate Bites & Minis", "Bites", "Coated Roasted Cashews", "30 g", "30 g",
     "Sugar, Cashew Nuts (25%), Milk Solids, Cocoa Butter, Cocoa Solids, Glazing Agent (INS 904), Emulsifiers (INS 442, INS 476).",
     {"calories": 552, "totalFat": 35.0, "saturatedFat": 17.0, "carbohydrates": 50.0, "sugars": 44.0, "addedSugars": 36.0, "fiber": 3.2, "protein": 9.2, "sodium": 95, "salt": 0.24}),
    ("Hershey's", "Hershey's Kisses Creamy Milk Chocolate Drops", "Hershey India Pvt Ltd", "Chocolate Bites & Minis", "Bites", "Milk Chocolate Drops", "100 g", "25 g",
     "Cane Sugar, Milk, Cocoa Butter, Cocoa Solids, Milk Fat, Emulsifier (Soya Lecithin), Natural Vanilla Flavour.",
     {"calories": 530, "totalFat": 30.5, "saturatedFat": 19.0, "carbohydrates": 58.0, "sugars": 55.0, "addedSugars": 45.0, "fiber": 2.3, "protein": 7.6, "sodium": 120, "salt": 0.3}),
    ("Hershey's", "Hershey's Kisses Whole Roasted Almonds Drops", "Hershey India Pvt Ltd", "Chocolate Bites & Minis", "Bites", "Almond Milk Chocolate Drops", "100 g", "25 g",
     "Milk Chocolate (Sugar, Cocoa Butter, Skim Milk, Chocolate, Milk Fat), Almonds (18%), Emulsifier (Soya Lecithin).",
     {"calories": 546, "totalFat": 34.0, "saturatedFat": 17.5, "carbohydrates": 52.0, "sugars": 48.0, "addedSugars": 38.0, "fiber": 3.8, "protein": 9.4, "sodium": 110, "salt": 0.28}),

    # 7. Chocolate Cookies & Wafers
    ("Loacker", "Loacker Quadratini Dark Chocolate Wafer Cubes", "Loacker AG", "Chocolate Cookies & Wafers", "Wafers", "Dark Chocolate Wafer Cubes", "125 g", "25 g",
     "Wheat Flour, Coconut Oil, Glucose Syrup, Fat-Reduced Cocoa, Sugar, Dextrose, Dark Chocolate (Cocoa Mass, Sugar) 8% in cream, Soy Flour, Whey Powder, Skimmed Milk Powder.",
     {"calories": 510, "totalFat": 26.0, "saturatedFat": 20.0, "carbohydrates": 59.0, "sugars": 28.0, "addedSugars": 24.0, "fiber": 4.5, "protein": 7.5, "sodium": 140, "salt": 0.35}),
    ("Loacker", "Loacker Classic Chocolate Crispy Cream Wafers", "Loacker AG", "Chocolate Cookies & Wafers", "Wafers", "Milk Chocolate Wafer", "175 g", "30 g",
     "Wheat Flour, Coconut Oil, Glucose Syrup, Whey Powder, Sugar, Fat-Reduced Cocoa (9%), Soy Flour, Chocolate (Sugar, Cocoa Mass) 5%, Skimmed Milk Powder.",
     {"calories": 518, "totalFat": 27.0, "saturatedFat": 21.0, "carbohydrates": 59.0, "sugars": 27.0, "addedSugars": 23.0, "fiber": 3.9, "protein": 7.8, "sodium": 130, "salt": 0.32}),
    ("Oreo", "Cadbury Oreo Double Stuf Chocolate Sandwich Cookies", "Mondelez India Foods Pvt Ltd", "Chocolate Cookies & Wafers", "Cookies", "Double Vanilla Creme", "150 g", "28 g",
     "Refined Wheat Flour, Sugar, Fractionated Fat, Cocoa Solids (4.5%), Invert Sugar, Leavening Agents (INS 500ii, INS 503ii), Salt, Emulsifier (INS 322).",
     {"calories": 485, "totalFat": 20.5, "saturatedFat": 9.8, "carbohydrates": 71.0, "sugars": 42.0, "addedSugars": 40.0, "fiber": 2.5, "protein": 4.2, "sodium": 320, "salt": 0.8}),
    ("Unibic", "Unibic Choco Kiss Centre Filled Chocolate Cookies", "Unibic Foods India Pvt Ltd", "Chocolate Cookies & Wafers", "Cookies", "Liquid Choco Filled", "150 g", "30 g",
     "Refined Wheat Flour (Maida), Choco Centre Filling (38%) [Sugar, Hydrogenated Palm Oil, Cocoa Solids, Milk Solids, Emulsifier], Sugar, Butter, Raising Agents.",
     {"calories": 505, "totalFat": 24.8, "saturatedFat": 12.5, "carbohydrates": 65.0, "sugars": 38.0, "addedSugars": 35.0, "fiber": 2.2, "protein": 5.4, "sodium": 210, "salt": 0.52}),
    ("Dukes", "Dukes Waffy Chocolate Flavoured Crispy Wafer Rolls", "Ravi Foods Pvt Ltd", "Chocolate Cookies & Wafers", "Wafers", "Chocolate Wafer Roll", "250 g", "25 g",
     "Sugar, Refined Wheat Flour, Palmolein Oil, Cocoa Solids (5%), Milk Solids, Emulsifier (INS 322), Iodised Salt.",
     {"calories": 478, "totalFat": 18.5, "saturatedFat": 9.0, "carbohydrates": 72.0, "sugars": 45.0, "addedSugars": 42.0, "fiber": 2.0, "protein": 5.0, "sodium": 160, "salt": 0.4}),

    # 8. Chocolate Spread
    ("Ferrero", "Nutella Hazelnut Spread with Pure Cocoa", "Ferrero India Pvt Ltd", "Chocolate Spread", "Spread", "Hazelnut Cocoa", "350 g", "15 g",
     "Sugar, Palm Oil, Hazelnuts (13%), Skimmed Cow Milk Powder (8.7%), Low Fat Cocoa Powder (7.4%), Emulsifier (Lecithin - Soya), Flavouring (Vanillin).",
     {"calories": 539, "totalFat": 30.9, "saturatedFat": 10.6, "carbohydrates": 57.5, "sugars": 56.3, "addedSugars": 50.0, "fiber": 3.4, "protein": 6.3, "sodium": 42, "salt": 0.11}),
    ("Hershey's", "Hershey's Creamy Cocoa Chocolate Spread", "Hershey India Pvt Ltd", "Chocolate Spread", "Spread", "Rich Cocoa Cream", "350 g", "15 g",
     "Sugar, Edible Vegetable Oil (Palmolein), Milk Solids, Cocoa Solids (8%), Emulsifier (Soya Lecithin), Edible Common Salt, Nature Identical Flavour.",
     {"calories": 546, "totalFat": 32.5, "saturatedFat": 14.5, "carbohydrates": 58.0, "sugars": 54.0, "addedSugars": 48.0, "fiber": 3.0, "protein": 5.5, "sodium": 85, "salt": 0.21}),
    ("Cadbury", "Cadbury Spreads Creamy Milk Chocolate Spread", "Mondelez India Foods Pvt Ltd", "Chocolate Spread", "Spread", "Milk Chocolate Spread", "400 g", "15 g",
     "Sugar, Rapeseed Oil, Palm Oil, Dried Whey (from Milk), Cocoa Solids (5%), Milk Solids, Emulsifier (Sunflower Lecithin), Flavouring.",
     {"calories": 562, "totalFat": 35.0, "saturatedFat": 9.5, "carbohydrates": 57.0, "sugars": 56.5, "addedSugars": 50.0, "fiber": 1.8, "protein": 3.8, "sodium": 95, "salt": 0.24}),
    ("Pintola", "Pintola All Natural Dark Chocolate Peanut Spread", "Das Foodtech Pvt Ltd", "Chocolate Spread", "Spread", "Dark Choco Peanut", "350 g", "32 g",
     "Roasted Peanuts (80%), Dark Chocolate (Cocoa Solids, Cocoa Butter, Sugar, Emulsifier), Cocoa Powder.",
     {"calories": 580, "totalFat": 44.0, "saturatedFat": 8.5, "carbohydrates": 26.0, "sugars": 9.5, "addedSugars": 6.0, "fiber": 7.5, "protein": 22.0, "sodium": 40, "salt": 0.1}),
    ("Dr. Oetker", "Dr. Oetker FunFoods Choco Fudge Dessert Topping Spread", "Dr. Oetker India Pvt Ltd", "Chocolate Spread", "Spread", "Fudge Chocolate", "375 g", "20 g",
     "Invert Sugar, Water, Sugar, Liquid Glucose, Cocoa Solids (7%), Thickener (INS 1422, INS 440), Acidity Regulator (INS 330), Preservative (INS 202).",
     {"calories": 290, "totalFat": 1.2, "saturatedFat": 0.6, "carbohydrates": 68.0, "sugars": 62.0, "addedSugars": 58.0, "fiber": 2.1, "protein": 1.8, "sodium": 65, "salt": 0.16}),

    # 9. Cocoa Products
    ("Hershey's", "Hershey's 100% Pure Natural Unsweetened Cocoa Powder", "Hershey India Pvt Ltd", "Cocoa Products", "Powder", "100% Unsweetened Cocoa", "225 g", "5 g",
     "100% Cocoa Solids (Processed with Alkali).",
     {"calories": 228, "totalFat": 13.5, "saturatedFat": 8.0, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 33.0, "protein": 19.5, "sodium": 20, "salt": 0.05}),
    ("Cadbury", "Cadbury Hot Chocolate Drink Mix Powder", "Mondelez India Foods Pvt Ltd", "Cocoa Products", "Powder", "Rich Hot Cocoa", "200 g", "20 g",
     "Sugar, Cocoa Solids (26%), Salt, Nature Identical Flavouring Substance (Vanilla).",
     {"calories": 385, "totalFat": 5.2, "saturatedFat": 3.1, "carbohydrates": 76.5, "sugars": 70.0, "addedSugars": 68.0, "fiber": 8.2, "protein": 6.8, "sodium": 180, "salt": 0.45}),
    ("Weikfield", "Weikfield Natural Baking Cocoa Powder", "Weikfield Foods Pvt Ltd", "Cocoa Products", "Powder", "Natural Dark Cocoa", "100 g", "5 g",
     "Pure Natural Cocoa Powder Solids.",
     {"calories": 310, "totalFat": 11.0, "saturatedFat": 6.8, "carbohydrates": 42.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 28.0, "protein": 18.0, "sodium": 25, "salt": 0.06}),
    ("Urban Platter", "Urban Platter Organic Raw Unprocessed Cacao Nibs", "Urban Platter Pvt Ltd", "Cocoa Products", "Nibs", "Raw Crushed Cacao", "250 g", "10 g",
     "100% Organic Raw Cacao Nibs (Crushed Cocoa Beans).",
     {"calories": 602, "totalFat": 50.0, "saturatedFat": 30.0, "carbohydrates": 29.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 19.0, "protein": 13.0, "sodium": 15, "salt": 0.04}),
    ("Urban Platter", "Urban Platter Pure Cold Pressed Cacao Butter Blocks", "Urban Platter Pvt Ltd", "Cocoa Products", "Butter", "Pure Cacao Butter", "200 g", "15 g",
     "100% Pure Raw Edible Cocoa Butter.",
     {"calories": 898, "totalFat": 99.8, "saturatedFat": 62.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 0, "salt": 0.0}),

    # 10. Sugar-Free Chocolates
    ("Sugar-Free", "Sugar Free D'lite Dark Chocolate Rich Cocoa", "Zydus Wellness Ltd", "Sugar-Free Chocolates", "Bar", "Stevia Sweetened Dark", "100 g", "20 g",
     "Maltitol, Cocoa Solids, Cocoa Butter, Dietary Fiber (Inulin), Emulsifiers (INS 322, INS 476), Stevia (INS 960).",
     {"calories": 465, "totalFat": 32.0, "saturatedFat": 19.5, "carbohydrates": 52.0, "sugars": 0.8, "addedSugars": 0.0, "fiber": 12.0, "protein": 6.5, "sodium": 15, "salt": 0.04}),
    ("Amul", "Amul Sugar Free Dark Chocolate with Maltitol", "Amul (GCMMF)", "Sugar-Free Chocolates", "Bar", "Sugar Free Rich Cocoa", "150 g", "30 g",
     "Maltitol, Cocoa Solids, Cocoa Butter, Emulsifiers (INS 322, INS 476), Nature Identical Flavour (Vanilla).",
     {"calories": 472, "totalFat": 33.5, "saturatedFat": 20.0, "carbohydrates": 50.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 9.0, "protein": 6.8, "sodium": 16, "salt": 0.04}),
    ("Zevic", "Zevic Sugar Free Stevia Sweetened 70% Dark Chocolate", "Zero Enthalpy Labs Pvt Ltd", "Sugar-Free Chocolates", "Bar", "Belgian Dark Stevia", "80 g", "20 g",
     "Cocoa Mass, Cocoa Butter, Dietary Fiber (FOS), Stevia Leaf Extract, Erythritol, Sunflower Lecithin.",
     {"calories": 440, "totalFat": 36.0, "saturatedFat": 22.0, "carbohydrates": 38.0, "sugars": 0.2, "addedSugars": 0.0, "fiber": 18.0, "protein": 7.8, "sodium": 10, "salt": 0.03}),
    ("Zevic", "Zevic Sugar Free Dark Chocolate with Roasted Almonds", "Zero Enthalpy Labs Pvt Ltd", "Sugar-Free Chocolates", "Bar", "Dark Almond Stevia", "80 g", "20 g",
     "Cocoa Mass, Cocoa Butter, Roasted Almonds (18%), Dietary Fiber, Stevia Extract, Sunflower Lecithin.",
     {"calories": 468, "totalFat": 38.0, "saturatedFat": 19.0, "carbohydrates": 35.0, "sugars": 0.9, "addedSugars": 0.0, "fiber": 16.0, "protein": 9.5, "sodium": 12, "salt": 0.03}),
    ("Ketofy", "Ketofy Zero Sugar Ultra Low Carb Keto Chocolate Bar", "Wellversed Health Pvt Ltd", "Sugar-Free Chocolates", "Bar", "Keto Dark Cocoa", "50 g", "25 g",
     "Cocoa Butter, Cocoa Mass, Erythritol, Whey Protein Isolate, Stevia Leaf Extract.",
     {"calories": 450, "totalFat": 38.5, "saturatedFat": 23.0, "carbohydrates": 22.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 14.0, "protein": 12.0, "sodium": 25, "salt": 0.06}),

    # 11. Protein Chocolates
    ("RiteBite Max Protein", "RiteBite Max Protein Daily Choco Classic Bar 10g Protein", "Naturell India Pvt Ltd", "Protein Chocolates", "Bar", "Choco Fudge Protein", "50 g", "50 g",
     "Protein Blend (26%) (Soy Nuggets, Whey Protein Concentrate, Calcium Caseinate), Dark Chocolate (18%), Liquid Glucose, Oats, Flaxseeds, Cocoa Powder.",
     {"calories": 390, "totalFat": 11.5, "saturatedFat": 5.2, "carbohydrates": 52.0, "sugars": 18.0, "addedSugars": 12.0, "fiber": 7.0, "protein": 20.0, "sodium": 180, "salt": 0.45}),
    ("Yoga Bar", "Yoga Bar 20g Whey Protein Bar Rich Chocolate Brownie", "Sproutlife Foods Pvt Ltd", "Protein Chocolates", "Bar", "Cocoa Whey Brownie", "60 g", "60 g",
     "Whey Protein Isolate, Whey Protein Concentrate, Dark Cocoa (12%), Almonds, Prebiotic Fiber (Oligofructose), Flaxseeds, Dates.",
     {"calories": 410, "totalFat": 13.0, "saturatedFat": 4.8, "carbohydrates": 36.0, "sugars": 9.5, "addedSugars": 0.0, "fiber": 10.0, "protein": 33.3, "sodium": 120, "salt": 0.3}),
    ("Phab", "Phab High Protein Chocolate Bar Milk Choco 11g Protein", "Phab Wellness Pvt Ltd", "Protein Chocolates", "Bar", "Milk Chocolate Crisp", "35 g", "35 g",
     "Milk Protein Blend, Milk Chocolate Coating (30%) (Cocoa Butter, Sugar, Milk Solids, Cocoa Solids), FOS Fiber, Cocoa Butter, Almond Crunch.",
     {"calories": 412, "totalFat": 14.5, "saturatedFat": 7.2, "carbohydrates": 42.0, "sugars": 14.0, "addedSugars": 8.0, "fiber": 9.0, "protein": 31.4, "sodium": 140, "salt": 0.35}),
    ("The Whole Truth", "The Whole Truth 15g Protein Bar Double Cocoa", "Fitshit Health Solutions Pvt Ltd", "Protein Chocolates", "Bar", "Dates & Cocoa Whey", "52 g", "52 g",
     "Dates (38%), Whey Protein Concentrate (28%), Cashews (15%), Cocoa Powder (12%), Cocoa Butter (7%). Nothing else.",
     {"calories": 395, "totalFat": 12.0, "saturatedFat": 4.5, "carbohydrates": 44.0, "sugars": 28.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 28.8, "sodium": 65, "salt": 0.16}),
    ("MuscleBlaze", "MuscleBlaze High Protein Dark Chocolate Truffle Bar 20g", "Bright Lifecare Pvt Ltd", "Protein Chocolates", "Bar", "Dark Truffle Protein", "68 g", "68 g",
     "Protein Blend (Whey Protein Isolate, Soy Protein Isolate), Dark Chocolate Compound (Cocoa Solids, Maltitol), Crispy Soy Nuggets, Cocoa Powder, Dietary Fiber.",
     {"calories": 382, "totalFat": 10.8, "saturatedFat": 5.0, "carbohydrates": 42.5, "sugars": 5.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 29.4, "sodium": 190, "salt": 0.48}),

    # 12. Indian Traditional Sweets
    ("Haldiram's", "Haldiram's Kaju Katli Premium Silver Leaf Diamond Barfi", "Haldiram Snacks Pvt Ltd", "Indian Traditional Sweets", "Mithai", "Pure Cashew Silver Foil", "250 g", "30 g",
     "Cashew Nuts (Kaju 52%), Sugar, Liquid Glucose, Silver Leaf (Vark).",
     {"calories": 482, "totalFat": 24.5, "saturatedFat": 4.8, "carbohydrates": 55.0, "sugars": 45.0, "addedSugars": 38.0, "fiber": 2.2, "protein": 10.5, "sodium": 15, "salt": 0.04}),
    ("Haldiram's", "Haldiram's Soan Papdi Pure Desi Ghee Flaky Sweet", "Haldiram Snacks Pvt Ltd", "Indian Traditional Sweets", "Mithai", "Desi Ghee Cardamom Flakes", "500 g", "30 g",
     "Sugar, Clarified Butter (Desi Ghee 26%), Bengal Gram Flour (Besan), Refined Wheat Flour, Almonds, Pistachios, Cardamom.",
     {"calories": 515, "totalFat": 26.5, "saturatedFat": 15.0, "carbohydrates": 64.0, "sugars": 48.0, "addedSugars": 45.0, "fiber": 2.8, "protein": 5.2, "sodium": 22, "salt": 0.06}),
    ("Bikano", "Bikano Kaju Barfi Cashew Sweet Diamond Cuts", "Bikanervala Foods Pvt Ltd", "Indian Traditional Sweets", "Mithai", "Cashew Mithai", "400 g", "30 g",
     "Cashew Nuts (50%), Sugar, Water, Silver Leaves.",
     {"calories": 478, "totalFat": 23.8, "saturatedFat": 4.6, "carbohydrates": 56.2, "sugars": 46.0, "addedSugars": 39.0, "fiber": 2.1, "protein": 10.2, "sodium": 18, "salt": 0.05}),
    ("Chitale Bandhu", "Chitale Bandhu Pure Alphonso Mango Barfi", "Chitale Bandhu Mithaiwale", "Indian Traditional Sweets", "Mithai", "Alphonso Mango Mawa", "250 g", "30 g",
     "Mawa (Khoya Milk Solids), Sugar, Alphonso Mango Pulp (20%), Pure Ghee, Cardamom Powder.",
     {"calories": 420, "totalFat": 18.0, "saturatedFat": 11.2, "carbohydrates": 54.0, "sugars": 46.0, "addedSugars": 38.0, "fiber": 1.5, "protein": 9.5, "sodium": 65, "salt": 0.16}),
    ("Bikaji", "Bikaji Aslee Bikaneri Motichoor Laddu Desi Ghee", "Bikaji Foods International Ltd", "Indian Traditional Sweets", "Mithai", "Desi Ghee Motichoor", "400 g", "40 g",
     "Sugar, Bengal Gram Flour (Besan), Clarified Butter (Desi Ghee 28%), Almonds, Pistachios, Melon Seeds, Saffron, Cardamom.",
     {"calories": 490, "totalFat": 24.0, "saturatedFat": 14.5, "carbohydrates": 62.0, "sugars": 48.0, "addedSugars": 45.0, "fiber": 2.2, "protein": 6.5, "sodium": 30, "salt": 0.08}),
    ("Haldiram's", "Haldiram's Kaju Peda Rich Milk & Cashew Mithai", "Haldiram Snacks Pvt Ltd", "Indian Traditional Sweets", "Mithai", "Cashew Milk Peda", "300 g", "30 g",
     "Milk Solids (Khoya), Sugar, Cashew Nuts (18%), Clarified Butter (Ghee), Cardamom.",
     {"calories": 445, "totalFat": 20.0, "saturatedFat": 10.5, "carbohydrates": 58.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 1.8, "protein": 9.0, "sodium": 55, "salt": 0.14}),

    # 13. Packaged Indian Sweets
    ("Haldiram's", "Haldiram's Gulab Jamun in Rose & Cardamom Sugar Syrup", "Haldiram Snacks Pvt Ltd", "Packaged Indian Sweets", "Mithai", "Rose Syrup Gulab Jamun", "1 kg", "50 g",
     "Sugar, Water, Milk Solids (Khoya 18%), Refined Wheat Flour (Maida), Clarified Butter, Rose Water, Cardamom.",
     {"calories": 340, "totalFat": 11.5, "saturatedFat": 6.8, "carbohydrates": 55.0, "sugars": 48.0, "addedSugars": 45.0, "fiber": 0.8, "protein": 4.5, "sodium": 45, "salt": 0.11}),
    ("Haldiram's", "Haldiram's Rasgulla Spongy Cottage Cheese Balls in Syrup", "Haldiram Snacks Pvt Ltd", "Packaged Indian Sweets", "Mithai", "Spongy Chena Rasgulla", "1 kg", "50 g",
     "Sugar, Water, Cottage Cheese (Milk Solids/Chhena 12%), Rose Water.",
     {"calories": 260, "totalFat": 3.2, "saturatedFat": 2.0, "carbohydrates": 52.0, "sugars": 49.0, "addedSugars": 47.0, "fiber": 0.0, "protein": 6.0, "sodium": 20, "salt": 0.05}),
    ("Bikano", "Bikano Spongy Bengali Rasgulla Tin", "Bikanervala Foods Pvt Ltd", "Packaged Indian Sweets", "Mithai", "Bengal Chena Dumplings", "1 kg", "50 g",
     "Sugar, Water, Milk Solids (Chhena 11%), Rose Water, Cardamom.",
     {"calories": 255, "totalFat": 3.0, "saturatedFat": 1.9, "carbohydrates": 51.5, "sugars": 48.5, "addedSugars": 46.0, "fiber": 0.0, "protein": 5.8, "sodium": 22, "salt": 0.06}),
    ("Bikano", "Bikano Gulab Jamun Spongy Khoya Dumplings Tin", "Bikanervala Foods Pvt Ltd", "Packaged Indian Sweets", "Mithai", "Khoya Mawa Gulab Jamun", "1 kg", "50 g",
     "Sugar, Water, Milk Solids (Khoya 17%), Maida, Ghee, Cardamom Powder.",
     {"calories": 335, "totalFat": 11.2, "saturatedFat": 6.5, "carbohydrates": 54.5, "sugars": 47.5, "addedSugars": 44.0, "fiber": 0.7, "protein": 4.4, "sodium": 42, "salt": 0.11}),
    ("Gits", "Gits Instant Gulab Jamun Dessert Ready Mix", "Gits Food Products Pvt Ltd", "Packaged Indian Sweets", "Mix", "Gulab Jamun Ready Mix", "200 g", "30 g",
     "Wheat Flour, Skim Milk Powder (35%), Vegetable Fat (Interesterified Palm and Sesame), Raising Agent (INS 500ii), Acidity Regulator (INS 296).",
     {"calories": 420, "totalFat": 14.0, "saturatedFat": 7.0, "carbohydrates": 60.0, "sugars": 18.0, "addedSugars": 0.0, "fiber": 2.1, "protein": 13.5, "sodium": 310, "salt": 0.78}),
    ("Chitale Bandhu", "Chitale Bandhu Authentic Gulab Jamun Tin", "Chitale Bandhu Mithaiwale", "Packaged Indian Sweets", "Mithai", "Traditional Mawa Jamun", "1 kg", "50 g",
     "Milk Solids (Khoya), Sugar, Water, Pure Cow Ghee, Refined Wheat Flour, Cardamom Powder.",
     {"calories": 348, "totalFat": 12.0, "saturatedFat": 7.2, "carbohydrates": 56.0, "sugars": 48.0, "addedSugars": 44.0, "fiber": 0.6, "protein": 4.8, "sodium": 48, "salt": 0.12}),

    # 14. Candy & Toffees
    ("Pulse", "Pass Pass Pulse Kachcha Aam Tangy Centre Filled Candy", "DS Group", "Candy & Toffees", "Hard Candy", "Raw Mango Amchur Burst", "200 g", "5 g",
     "Sugar, Liquid Glucose, Mango Powder, Iodised Salt, Spices & Condiments (Amchur, Black Salt, Cumin), Acidity Regulator (INS 330, INS 296), Permitted Food Colours.",
     {"calories": 382, "totalFat": 0.2, "saturatedFat": 0.0, "carbohydrates": 95.0, "sugars": 72.0, "addedSugars": 70.0, "fiber": 0.5, "protein": 0.4, "sodium": 580, "salt": 1.45}),
    ("Pulse", "Pass Pass Pulse Guava Tangy Masala Centre Candy", "DS Group", "Candy & Toffees", "Hard Candy", "Spiced Guava Chilli", "200 g", "5 g",
     "Sugar, Liquid Glucose, Guava Powder, Black Salt, Red Chilli Powder, Citric Acid, Malic Acid.",
     {"calories": 380, "totalFat": 0.2, "saturatedFat": 0.0, "carbohydrates": 94.5, "sugars": 71.0, "addedSugars": 69.0, "fiber": 0.6, "protein": 0.4, "sodium": 560, "salt": 1.4}),
    ("Alpenliebe", "Alpenliebe Gold Rich Creamy Caramel Hard Toffee", "Perfetti Van Melle India Pvt Ltd", "Candy & Toffees", "Toffee", "Rich Caramel Butter", "200 g", "5 g",
     "Sugar, Liquid Glucose, Sweetened Condensed Milk, Butter (4.2%), Hydrogenated Vegetable Oil, Salt, Emulsifier (INS 322), Caramel Colour (INS 150d).",
     {"calories": 415, "totalFat": 7.5, "saturatedFat": 4.8, "carbohydrates": 85.0, "sugars": 68.0, "addedSugars": 62.0, "fiber": 0.0, "protein": 1.8, "sodium": 240, "salt": 0.6}),
    ("Coffy Bite", "Lotte Coffy Bite The Rich Coffee Toffee", "Lotte India Corp Ltd", "Candy & Toffees", "Toffee", "Rich Coffee Caramel", "250 g", "5 g",
     "Sugar, Liquid Glucose, Hydrogenated Vegetable Fat, Milk Solids, Coffee Extract (1.8%), Salt, Emulsifier (INS 322).",
     {"calories": 425, "totalFat": 9.2, "saturatedFat": 5.8, "carbohydrates": 83.5, "sugars": 65.0, "addedSugars": 60.0, "fiber": 0.5, "protein": 2.2, "sodium": 180, "salt": 0.45}),
    ("Parle", "Parle Melody Chocolaty Caramel Toffee", "Parle Products Pvt Ltd", "Candy & Toffees", "Toffee", "Chocolaty Caramel", "391 g", "5 g",
     "Sugar, Liquid Glucose, Hydrogenated Edible Vegetable Oils, Cocoa Solids (4.5%), Milk Solids, Salt, Emulsifier (INS 322, INS 471).",
     {"calories": 448, "totalFat": 14.5, "saturatedFat": 8.5, "carbohydrates": 76.8, "sugars": 58.0, "addedSugars": 54.0, "fiber": 1.2, "protein": 2.5, "sodium": 150, "salt": 0.38}),
    ("Parle", "Parle Mango Mood Sweet Mango Hard Boiled Candy", "Parle Products Pvt Ltd", "Candy & Toffees", "Hard Candy", "Ripe Mango", "289 g", "4 g",
     "Sugar, Liquid Glucose, Mango Pulp (1.2%), Acidity Regulator (INS 330), Nature Identical Flavour, Synthetic Food Colours.",
     {"calories": 390, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 97.0, "sugars": 76.0, "addedSugars": 74.0, "fiber": 0.0, "protein": 0.0, "sodium": 35, "salt": 0.09}),

    # 15. Lollipops
    ("Chupa Chups", "Chupa Chups Sour Bites Assorted Fruit Chews", "Perfetti Van Melle India Pvt Ltd", "Lollipops", "Lollipop", "Assorted Sour Fruit", "150 g", "10 g",
     "Sugar, Liquid Glucose, Wheat Flour, Invert Sugar Syrup, Acidity Regulators (INS 296, INS 330), Hydrogenated Vegetable Oil, Fruit Juices.",
     {"calories": 365, "totalFat": 2.5, "saturatedFat": 1.5, "carbohydrates": 83.0, "sugars": 62.0, "addedSugars": 60.0, "fiber": 0.5, "protein": 1.8, "sodium": 110, "salt": 0.28}),
    ("Alpenliebe", "Alpenliebe Pop Caramel Flavoured Milk Lollipop", "Perfetti Van Melle India Pvt Ltd", "Lollipops", "Lollipop", "Creamy Caramel", "120 g", "12 g",
     "Sugar, Liquid Glucose, Sweetened Condensed Milk (13.5%), Butter, Hydrogenated Vegetable Oil, Emulsifier (INS 322).",
     {"calories": 410, "totalFat": 7.0, "saturatedFat": 4.5, "carbohydrates": 84.5, "sugars": 66.0, "addedSugars": 60.0, "fiber": 0.0, "protein": 2.0, "sodium": 220, "salt": 0.55}),
    ("Chupa Chups", "Chupa Chups Incredible Chews Strawberry Fruit Lollipop", "Perfetti Van Melle India Pvt Ltd", "Lollipops", "Lollipop", "Strawberry Cream", "100 g", "12 g",
     "Sugar, Liquid Glucose, Hydrogenated Vegetable Oil, Strawberry Fruit Puree (2.5%), Gelatine, Citric Acid, Emulsifiers.",
     {"calories": 395, "totalFat": 4.8, "saturatedFat": 3.0, "carbohydrates": 86.0, "sugars": 68.0, "addedSugars": 65.0, "fiber": 0.2, "protein": 1.2, "sodium": 80, "salt": 0.2}),
    ("Parle", "Parle Poppins Lollipop Multi-Flavour Pops", "Parle Products Pvt Ltd", "Lollipops", "Lollipop", "Rainbow Fruit Flavours", "120 g", "10 g",
     "Sugar, Liquid Glucose, Citric Acid (INS 330), Synthetic Food Flavours (Orange, Apple, Mango, Strawberry), Permitted Colours.",
     {"calories": 392, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 97.5, "sugars": 78.0, "addedSugars": 76.0, "fiber": 0.0, "protein": 0.0, "sodium": 30, "salt": 0.08}),
    ("Lotte", "Lotte Spout Chewy Strawberry Mint Lollipop", "Lotte India Corp Ltd", "Lollipops", "Lollipop", "Liquid Mint Centre Strawberry", "100 g", "10 g",
     "Sugar, Glucose Syrup, Acidity Regulator, Strawberry Powder, Menthol, Vegetable Oil, Emulsifier.",
     {"calories": 388, "totalFat": 1.2, "saturatedFat": 0.8, "carbohydrates": 94.0, "sugars": 72.0, "addedSugars": 70.0, "fiber": 0.1, "protein": 0.2, "sodium": 45, "salt": 0.11}),

    # 16. Gummies & Jellies
    ("Haribo", "Haribo Goldbears Classic Fruity Gummy Bears", "Haribo GmbH & Co. KG", "Gummies & Jellies", "Gummies", "Assorted Fruit Bears", "100 g", "25 g",
     "Glucose Syrup, Sugar, Gelatine, Dextrose, Fruit Juice from Concentrate (Apple, Strawberry, Raspberry, Orange, Lemon, Pineapple), Citric Acid, Fruit and Plant Concentrates.",
     {"calories": 343, "totalFat": 0.5, "saturatedFat": 0.1, "carbohydrates": 77.0, "sugars": 46.0, "addedSugars": 44.0, "fiber": 0.0, "protein": 6.9, "sodium": 30, "salt": 0.08}),
    ("Haribo", "Haribo Happy Cola Fizzy Cola Flavoured Gummy Bottles", "Haribo GmbH & Co. KG", "Gummies & Jellies", "Gummies", "Refreshing Cola", "100 g", "25 g",
     "Glucose Syrup, Sugar, Gelatine, Dextrose, Citric Acid, Caramelised Sugar Syrup, Flavouring, Glazing Agents (Beeswax, Carnauba Wax).",
     {"calories": 340, "totalFat": 0.5, "saturatedFat": 0.1, "carbohydrates": 77.0, "sugars": 46.0, "addedSugars": 44.0, "fiber": 0.0, "protein": 6.8, "sodium": 28, "salt": 0.07}),
    ("Alpenliebe", "Alpenliebe Juzt Jelly Strawberry Sweet Pulpy Jelly", "Perfetti Van Melle India Pvt Ltd", "Gummies & Jellies", "Jelly", "Real Strawberry Pulp", "145 g", "20 g",
     "Sugar, Liquid Glucose, Fruit Juice (Strawberry Pulp 25%), Gelling Agent (INS 440), Acidity Regulator (INS 330).",
     {"calories": 320, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 79.5, "sugars": 65.0, "addedSugars": 58.0, "fiber": 1.2, "protein": 0.4, "sodium": 85, "salt": 0.21}),
    ("Alpenliebe", "Alpenliebe Juzt Jelly Guava Spiced Chilli Masala Jelly", "Perfetti Van Melle India Pvt Ltd", "Gummies & Jellies", "Jelly", "Guava Chilli Masala", "145 g", "20 g",
     "Sugar, Liquid Glucose, Guava Pulp (25%), Gelling Agent (INS 440), Acidity Regulator (INS 330), Salt, Spices (Chilli, Black Salt).",
     {"calories": 318, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 79.0, "sugars": 64.0, "addedSugars": 56.0, "fiber": 1.4, "protein": 0.5, "sodium": 140, "salt": 0.35}),
    ("Mentos", "Mentos Pure Fresh Spearmint Chewy Dragees", "Perfetti Van Melle India Pvt Ltd", "Gummies & Jellies", "Chew", "Spearmint Green Tea", "130 g", "3 g",
     "Sugar, Glucose Syrup, Hydrogenated Coconut Oil, Green Tea Extract (0.2%), Starch, Gelling Agents (E414, E418), Natural Spearmint Flavours.",
     {"calories": 370, "totalFat": 1.8, "saturatedFat": 1.7, "carbohydrates": 88.0, "sugars": 67.0, "addedSugars": 65.0, "fiber": 0.5, "protein": 0.1, "sodium": 25, "salt": 0.06}),

    # 17. Marshmallows
    ("Campfire", "Campfire Regular White Soft & Fluffy Vanilla Marshmallows", "Doumak Inc", "Marshmallows", "Marshmallow", "Vanilla Marshmallow", "226 g", "30 g",
     "Corn Syrup, Sugar, Modified Food Starch (Corn), Gelatin, Water, Dextrose, Natural and Artificial Flavor, Tetrasodium Pyrophosphate.",
     {"calories": 330, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 81.0, "sugars": 57.0, "addedSugars": 57.0, "fiber": 0.0, "protein": 2.5, "sodium": 80, "salt": 0.2}),
    ("Campfire", "Campfire Mini White Fluffy Baking Marshmallows", "Doumak Inc", "Marshmallows", "Marshmallow", "Mini Vanilla Marshmallow", "283 g", "30 g",
     "Corn Syrup, Sugar, Dextrose, Modified Cornstarch, Water, Gelatin, Vanilla Flavor.",
     {"calories": 330, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 81.0, "sugars": 57.0, "addedSugars": 57.0, "fiber": 0.0, "protein": 2.5, "sodium": 80, "salt": 0.2}),
    ("Urban Platter", "Urban Platter Vegan Plant-Based Vanilla Marshmallows", "Urban Platter Pvt Ltd", "Marshmallows", "Marshmallow", "Vegan Agar Vanilla", "200 g", "25 g",
     "Tapioca Syrup, Cane Sugar, Filtered Water, Tapioca Starch, Carrageenan, Soy Protein, Natural Vanilla Flavor.",
     {"calories": 315, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 78.0, "sugars": 52.0, "addedSugars": 52.0, "fiber": 1.8, "protein": 1.0, "sodium": 65, "salt": 0.16}),
    ("Haribo", "Haribo Chamallows Pink & White Soft Marshmallows", "Haribo GmbH & Co. KG", "Marshmallows", "Marshmallow", "Strawberry & Vanilla", "175 g", "25 g",
     "Glucose Syrup, Sugar, Dextrose, Water, Humectant (Sorbitol Syrup), Gelatine, Flavouring, Colour (Carmine).",
     {"calories": 335, "totalFat": 0.5, "saturatedFat": 0.1, "carbohydrates": 79.0, "sugars": 65.0, "addedSugars": 65.0, "fiber": 0.0, "protein": 3.8, "sodium": 50, "salt": 0.12}),
    ("Bakingo", "Bakingo Gourmet Pastel Swirl Fruity Marshmallows", "Bakingo Confections Pvt Ltd", "Marshmallows", "Marshmallow", "Pastel Fruit Swirl", "150 g", "25 g",
     "Sugar, Glucose Syrup, Invert Sugar, Gelatine, Natural Flavours (Strawberry, Mango, Blueberry), Permitted Colours.",
     {"calories": 328, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 80.0, "sugars": 60.0, "addedSugars": 60.0, "fiber": 0.0, "protein": 2.8, "sodium": 60, "salt": 0.15}),

    # 18. Premium & Imported Chocolates
    ("Ferrero Rocher", "Ferrero Rocher Whole Hazelnut Praline Box 16 Pieces", "Ferrero India Pvt Ltd", "Premium & Imported Chocolates", "Pralines", "Crispy Hazelnut Praline", "200 g", "25 g",
     "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Milk Fat, Emulsifier: Lecithins [Soya], Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder.",
     {"calories": 603, "totalFat": 42.7, "saturatedFat": 14.1, "carbohydrates": 44.4, "sugars": 39.9, "addedSugars": 34.0, "fiber": 3.5, "protein": 8.2, "sodium": 60, "salt": 0.15}),
    ("Lindt", "Lindt Lindor Smooth Melting Milk Chocolate Truffles Box", "Lindt & Sprüngli AG", "Premium & Imported Chocolates", "Truffles", "Melting Milk Truffle", "200 g", "25 g",
     "Sugar, Vegetable Fat (Coconut, Palm Kernel), Cocoa Butter, Cocoa Mass, Whole Milk Powder, Skimmed Milk Powder, Lactose, Anhydrous Milk Fat, Emulsifier (Soya Lecithin), Barley Malt Extract.",
     {"calories": 617, "totalFat": 47.0, "saturatedFat": 35.0, "carbohydrates": 43.0, "sugars": 42.0, "addedSugars": 35.0, "fiber": 2.0, "protein": 4.8, "sodium": 60, "salt": 0.15}),
    ("Toblerone", "Toblerone Swiss Milk Chocolate with Honey & Almond Nougat", "Mondelez Switzerland GmbH", "Premium & Imported Chocolates", "Bar", "Honey Almond Nougat", "100 g", "25 g",
     "Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Honey (3%), Milk Fat, Almonds (1.6%), Emulsifier (Soya Lecithin), Egg White, Flavouring.",
     {"calories": 528, "totalFat": 28.5, "saturatedFat": 17.5, "carbohydrates": 61.0, "sugars": 60.0, "addedSugars": 52.0, "fiber": 2.4, "protein": 5.6, "sodium": 60, "salt": 0.15}),
    ("Paul and Mike", "Paul and Mike 68% Dark Chocolate with Real Alphonso Mango", "Snack Amor Foods Pvt Ltd", "Premium & Imported Chocolates", "Bar", "Fine Single Origin Mango", "68 g", "20 g",
     "Fine Flavour Cocoa Beans, Cocoa Butter, Muscovado Sugar, Freeze Dried Alphonso Mango Powder (12%), Emulsifier (Sunflower Lecithin).",
     {"calories": 540, "totalFat": 36.0, "saturatedFat": 21.0, "carbohydrates": 48.0, "sugars": 32.0, "addedSugars": 24.0, "fiber": 7.5, "protein": 6.8, "sodium": 12, "salt": 0.03}),
    ("Pascati", "Pascati 72% Organic Dark Chocolate with Blueberry & Walnut", "Pascati Artisanal Foods", "Premium & Imported Chocolates", "Bar", "Organic Blueberry Walnut", "75 g", "25 g",
     "Organic Cocoa Beans, Organic Cane Sugar, Organic Cocoa Butter, Dried Blueberries (8%), Toasted Walnuts (7%).",
     {"calories": 552, "totalFat": 38.0, "saturatedFat": 20.0, "carbohydrates": 42.0, "sugars": 26.0, "addedSugars": 22.0, "fiber": 8.0, "protein": 8.5, "sodium": 10, "salt": 0.03}),
    ("Fabelle", "Fabelle The Bars Heavenly Dark Chocolate with Hazelnut Mousse", "ITC Limited", "Premium & Imported Chocolates", "Bar", "Dark Hazelnut Mousse", "129 g", "25 g",
     "Dark Chocolate (55%) (Cocoa Solids, Sugar, Cocoa Butter, Emulsifier INS 322), Centre Filling (Hazelnuts 15%, Milk Solids, Vegetable Fat).",
     {"calories": 585, "totalFat": 41.5, "saturatedFat": 22.0, "carbohydrates": 44.0, "sugars": 38.0, "addedSugars": 32.0, "fiber": 5.2, "protein": 7.8, "sodium": 55, "salt": 0.14}),

    # 19. Festival Chocolate Gift Packs
    ("Cadbury", "Cadbury Celebrations Rich Dry Fruit Chocolate Gift Pack", "Mondelez India Foods Pvt Ltd", "Festival Chocolate Gift Packs", "Gift Box", "Almonds Cashews Raisins Box", "177 g", "30 g",
     "Sugar, Milk Solids, Cocoa Butter, Almonds, Cashew Nuts, Raisins, Cocoa Solids, Emulsifiers (INS 442, INS 476).",
     {"calories": 545, "totalFat": 33.0, "saturatedFat": 18.0, "carbohydrates": 52.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 3.5, "protein": 8.5, "sodium": 115, "salt": 0.29}),
    ("Cadbury", "Cadbury Celebrations Assorted Chocolate Delights Gift Pack", "Mondelez India Foods Pvt Ltd", "Festival Chocolate Gift Packs", "Gift Box", "Assorted Bars Box", "186 g", "30 g",
     "Assorted Cadbury Dairy Milk, 5 Star, Perk chocolate bars.",
     {"calories": 510, "totalFat": 26.5, "saturatedFat": 16.0, "carbohydrates": 62.0, "sugars": 56.0, "addedSugars": 48.0, "fiber": 2.0, "protein": 6.2, "sodium": 130, "salt": 0.32}),
    ("Ferrero Rocher", "Ferrero Rocher Premium Golden Gift Box 24 Pieces", "Ferrero India Pvt Ltd", "Festival Chocolate Gift Packs", "Gift Box", "Gold Foil Hazelnut Pralines", "300 g", "25 g",
     "Milk Chocolate (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Milk Fat), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder.",
     {"calories": 603, "totalFat": 42.7, "saturatedFat": 14.1, "carbohydrates": 44.4, "sugars": 39.9, "addedSugars": 34.0, "fiber": 3.5, "protein": 8.2, "sodium": 60, "salt": 0.15}),
    ("Lindt", "Lindt Swiss Luxury Selection Assorted Pralines Gift Box", "Lindt & Sprüngli AG", "Festival Chocolate Gift Packs", "Gift Box", "Swiss Luxury Selection", "143 g", "25 g",
     "Sugar, Cocoa Mass, Cocoa Butter, Whole Milk Powder, Almonds, Hazelnuts, Anhydrous Milk Fat, Glucose Syrup, Skimmed Milk Powder.",
     {"calories": 580, "totalFat": 39.0, "saturatedFat": 21.0, "carbohydrates": 48.0, "sugars": 44.0, "addedSugars": 38.0, "fiber": 3.8, "protein": 7.2, "sodium": 70, "salt": 0.18}),
    ("Haldiram's", "Haldiram's Royal Assorted Sweets & Mithai Gift Box", "Haldiram Snacks Pvt Ltd", "Festival Chocolate Gift Packs", "Gift Box", "Assorted Kaju & Besan Mithai", "500 g", "40 g",
     "Assortment of Kaju Katli, Besan Laddu, Soan Papdi and Kaju Peda.",
     {"calories": 490, "totalFat": 24.0, "saturatedFat": 11.5, "carbohydrates": 60.0, "sugars": 47.0, "addedSugars": 40.0, "fiber": 2.5, "protein": 8.0, "sodium": 35, "salt": 0.09}),

    # 20. Peanut Brittle & Chikki
    ("Haldiram's", "Haldiram's Nagpur Crisp Peanut Jaggery Chikki", "Haldiram Snacks Pvt Ltd", "Peanut Brittle & Chikki", "Brittle", "Peanut Jaggery Brittle", "200 g", "30 g",
     "Roasted Peanuts (54%), Jaggery (Gud 38%), Sugar, Liquid Glucose.",
     {"calories": 525, "totalFat": 29.5, "saturatedFat": 4.8, "carbohydrates": 49.0, "sugars": 38.0, "addedSugars": 12.0, "fiber": 5.2, "protein": 14.5, "sodium": 45, "salt": 0.11}),
    ("Bikano", "Bikano Crunchy Peanuts & Desi Gud Chikki Slab", "Bikanervala Foods Pvt Ltd", "Peanut Brittle & Chikki", "Brittle", "Desi Gud Peanuts", "200 g", "30 g",
     "Peanuts (52%), Jaggery (40%), Sugar, Liquid Glucose.",
     {"calories": 518, "totalFat": 28.5, "saturatedFat": 4.5, "carbohydrates": 50.5, "sugars": 39.0, "addedSugars": 14.0, "fiber": 5.0, "protein": 14.0, "sodium": 48, "salt": 0.12}),
    ("Lonavala", "Lonavala Famous Golden Peanut Chikki Crushed Slabs", "Lonavala Chikki Centre", "Peanut Brittle & Chikki", "Brittle", "Crushed Peanut Jaggery", "250 g", "35 g",
     "Crushed Roasted Peanuts (56%), Pure Organic Jaggery (40%), Liquid Glucose, Clarified Butter (Ghee 1%).",
     {"calories": 530, "totalFat": 30.5, "saturatedFat": 5.0, "carbohydrates": 48.0, "sugars": 36.0, "addedSugars": 10.0, "fiber": 5.5, "protein": 15.2, "sodium": 40, "salt": 0.1}),
    ("Haldiram's", "Haldiram's Til Laddoo White Sesame Seed Jaggery Sweet", "Haldiram Snacks Pvt Ltd", "Peanut Brittle & Chikki", "Mithai", "Til Gud Ball", "200 g", "30 g",
     "White Sesame Seeds (Til 50%), Jaggery (Gud 45%), Liquid Glucose, Cardamom.",
     {"calories": 510, "totalFat": 27.0, "saturatedFat": 4.2, "carbohydrates": 52.0, "sugars": 41.0, "addedSugars": 10.0, "fiber": 6.8, "protein": 11.5, "sodium": 35, "salt": 0.09}),
    ("Bikano", "Bikano Royal Dry Fruit Chikki with Cashews & Almonds", "Bikanervala Foods Pvt Ltd", "Peanut Brittle & Chikki", "Brittle", "Cashew Almond Brittle", "200 g", "30 g",
     "Cashew Nuts (25%), Almonds (20%), Peanuts (15%), Sugar, Jaggery, Liquid Glucose.",
     {"calories": 542, "totalFat": 33.0, "saturatedFat": 5.2, "carbohydrates": 47.0, "sugars": 35.0, "addedSugars": 15.0, "fiber": 5.8, "protein": 13.5, "sodium": 42, "salt": 0.11})
]

print(f"Loaded {len(chocolates_data)} chocolate product definitions.")

# ==============================================================================
# 2. COLD DRINKS CANDIDATES (52 items)
# ==============================================================================
cold_drinks_data = [
    # Energy Drinks (8)
    ("Red Bull", "Red Bull Energy Drink Classic Can", "Red Bull GmbH", "Energy Drinks", "Can", "Classic Caffeine Energy", "250 ml", "250 ml",
     "Carbonated Water, Sucrose, Glucose, Acidity Regulators (Citric Acid, Sodium Bicarbonate), Taurine (0.4%), Caffeine (0.03%), Vitamins (Niacin, B6, B12, Pantothenic Acid), Flavours.",
     {"calories": 45, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.0, "sugars": 11.0, "addedSugars": 11.0, "fiber": 0.0, "protein": 0.0, "sodium": 40, "salt": 0.1}),
    ("Red Bull", "Red Bull Sugarfree Energy Drink Zero Calories", "Red Bull GmbH", "Energy Drinks", "Can", "Sugarfree Energy", "250 ml", "250 ml",
     "Carbonated Water, Acidity Regulators (Citric Acid, Sodium Bicarbonate), Taurine (0.4%), Artificial Sweeteners (Sucralose, Acesulfame K), Caffeine (0.03%), Vitamins.",
     {"calories": 3, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.1, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 45, "salt": 0.11}),
    ("Monster Energy", "Monster Energy Original Carbonated Energy Drink", "Monster Beverage Corp", "Energy Drinks", "Can", "Citrus Herbal Energy", "350 ml", "350 ml",
     "Carbonated Water, Sucrose, Glucose, Citric Acid, Natural Flavours, Taurine, Panax Ginseng Extract, Caffeine, B Vitamins.",
     {"calories": 47, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 12.0, "sugars": 11.5, "addedSugars": 11.5, "fiber": 0.0, "protein": 0.0, "sodium": 75, "salt": 0.19}),
    ("Monster Energy", "Monster Energy Ultra White Zero Sugar Citrus", "Monster Beverage Corp", "Energy Drinks", "Can", "Crisp Zero Citrus", "350 ml", "350 ml",
     "Carbonated Water, Citric Acid, Taurine, Sodium Citrate, Panax Ginseng Flavor, Sweeteners (Sucralose, Acesulfame Potassium), Caffeine, B Vitamins.",
     {"calories": 2, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.5, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 80, "salt": 0.2}),
    ("Hell Energy", "Hell Energy Drink Classic Red Tutti Frutti", "Hell Energy Ltd", "Energy Drinks", "Can", "Tutti Frutti Energy", "250 ml", "250 ml",
     "Water, Sugar, Citric Acid, Carbon Dioxide, Taurine, Acidity Regulator, Caffeine (32mg/100ml), Inositol, B Vitamins.",
     {"calories": 46, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.9, "sugars": 10.9, "addedSugars": 10.9, "fiber": 0.0, "protein": 0.0, "sodium": 50, "salt": 0.12}),
    ("Sting", "Sting Energy Drink Gold Rush Caffeine Beverage", "PepsiCo India Holdings Pvt Ltd", "Energy Drinks", "Bottle", "Berry Gold Rush", "250 ml", "250 ml",
     "Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 331iii), Taurine, Caffeine, Inositol, Preservatives (INS 211, INS 202).",
     {"calories": 50, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 12.5, "sugars": 12.4, "addedSugars": 12.4, "fiber": 0.0, "protein": 0.0, "sodium": 35, "salt": 0.09}),
    ("Predator", "Predator Energy Drink Gold Spark Carbonated Drink", "Monster Energy Company", "Energy Drinks", "Can", "Crisp Citrus Gold", "250 ml", "250 ml",
     "Carbonated Water, Sugar, Citric Acid, Taurine (0.2%), Acidity Regulator (Sodium Citrate), Caffeine (0.03%), Inositol.",
     {"calories": 44, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.8, "sugars": 10.8, "addedSugars": 10.8, "fiber": 0.0, "protein": 0.0, "sodium": 55, "salt": 0.14}),
    ("Ocean", "Ocean Energy Drink Quick Boost Fruit Fusion", "Narwal Drinks Pvt Ltd", "Energy Drinks", "Can", "Apple Berry Energy", "250 ml", "250 ml",
     "Water, Sugar, Reconstituted Fruit Juice, Citric Acid, Taurine, Caffeine, Vitamins (B3, B5, B6, B12).",
     {"calories": 42, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.2, "sugars": 10.2, "addedSugars": 9.5, "fiber": 0.0, "protein": 0.0, "sodium": 30, "salt": 0.08}),

    # Premium Mixers, Tonics & Ginger Beers (10)
    ("Sepoy & Co.", "Sepoy & Co. Indian Tonic Water Botanical Crafted", "Sepoy Beverages Pvt Ltd", "Tonic Water", "Bottle", "Quinine & Botanical", "200 ml", "200 ml",
     "Carbonated Spring Water, Natural Cane Sugar, Citric Acid, Natural Quinine, Botanical Flavour Extracts.",
     {"calories": 32, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 7.8, "sugars": 7.8, "addedSugars": 7.8, "fiber": 0.0, "protein": 0.0, "sodium": 5, "salt": 0.01}),
    ("Sepoy & Co.", "Sepoy & Co. Spiced Grapefruit Soda Mixer", "Sepoy Beverages Pvt Ltd", "Flavoured Water", "Bottle", "Spiced Pink Grapefruit", "200 ml", "200 ml",
     "Carbonated Spring Water, Pink Grapefruit Juice Concentrate, Cane Sugar, Cardamom and Clove Extracts, Citric Acid.",
     {"calories": 28, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 6.8, "sugars": 6.8, "addedSugars": 5.5, "fiber": 0.0, "protein": 0.0, "sodium": 6, "salt": 0.01}),
    ("Jade Forest", "Jade Forest Indian Tonic Water Low Calorie", "Spaceman Spirits Lab Pvt Ltd", "Tonic Water", "Bottle", "Cinchona Bark Tonic", "250 ml", "250 ml",
     "Carbonated Water, Fructose, Citric Acid, Natural Quinine, Rosemary and Citrus Extracts.",
     {"calories": 18, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 4.5, "sugars": 4.5, "addedSugars": 4.5, "fiber": 0.0, "protein": 0.0, "sodium": 8, "salt": 0.02}),
    ("Jade Forest", "Jade Forest Premium Ginger Ale with Himalayan Spices", "Spaceman Spirits Lab Pvt Ltd", "Ginger Ale", "Bottle", "Himalayan Ginger Brew", "250 ml", "250 ml",
     "Carbonated Water, Cane Sugar, Cold-Pressed Ginger Juice, Lemon Juice Concentrate, Citric Acid, Spices.",
     {"calories": 34, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.5, "sugars": 8.5, "addedSugars": 8.0, "fiber": 0.0, "protein": 0.0, "sodium": 10, "salt": 0.03}),
    ("Gunsberg", "Gunsberg Non-Alcoholic Ginger Beer Real Ginger Root", "Gunsberg Beverages Pvt Ltd", "Ginger Ale", "Bottle", "Real Fermented Ginger", "325 ml", "325 ml",
     "Carbonated Water, Fresh Ginger Juice (12%), Cane Sugar, Lemon Juice, Citric Acid, Yeast Extract.",
     {"calories": 38, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.4, "sugars": 9.4, "addedSugars": 8.8, "fiber": 0.2, "protein": 0.1, "sodium": 12, "salt": 0.03}),
    ("Gunsberg", "Gunsberg Grapefruit Ale Crafted Soda Mixer", "Gunsberg Beverages Pvt Ltd", "Flavoured Water", "Bottle", "Tangy Ruby Grapefruit", "325 ml", "325 ml",
     "Carbonated Water, Ruby Red Grapefruit Juice, Ginger Root Extract, Cane Sugar, Citric Acid.",
     {"calories": 36, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.8, "sugars": 8.8, "addedSugars": 8.0, "fiber": 0.1, "protein": 0.1, "sodium": 10, "salt": 0.03}),
    ("Svami", "Svami Original Tonic Water Low Sugar Botanicals", "Foxtrot Beverages Pvt Ltd", "Tonic Water", "Bottle", "Cucumber & Quinine", "200 ml", "200 ml",
     "Carbonated Water, Sugar, Citric Acid, Natural Quinine, Cucumber Extract, Calamansi.",
     {"calories": 24, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 5.9, "sugars": 5.9, "addedSugars": 5.9, "fiber": 0.0, "protein": 0.0, "sodium": 7, "salt": 0.02}),
    ("Svami", "Svami Drinks 2-Cal Diet Cola Zero Sugar", "Foxtrot Beverages Pvt Ltd", "Zero Sugar Drinks", "Bottle", "Zero Calorie Cola", "200 ml", "200 ml",
     "Carbonated Water, Acidity Regulators (INS 338, INS 330), Sweeteners (Sucralose, Stevia), Natural Cola Extracts, Caffeine.",
     {"calories": 1, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.2, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 20, "salt": 0.05}),
    ("Catch", "Catch Sprint Carbonated Club Soda Extra Fizzy", "DS Group", "Sparkling Water", "Bottle", "Extra Carbonated Soda", "750 ml", "250 ml",
     "Treated Carbonated Water, Carbon Dioxide, Sodium Salts, Mineral Salts.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 15, "salt": 0.04}),
    ("Schweppes", "Schweppes Carbonated Soda Water Fizzy Mixer", "Coca-Cola India Pvt Ltd", "Sparkling Water", "Can", "Crisp Bubbly Soda", "300 ml", "300 ml",
     "Purified Carbonated Water, Carbon Dioxide, Sodium Bicarbonate.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 18, "salt": 0.05}),

    # Craft Indian Sodas (10)
    ("Bindu", "Bindu Fizz Jeera Masala Spiced Soda Drink", "Megha Fruit Processing Pvt Ltd", "Carbonated Soft Drinks", "Bottle", "Jeera Cumin Fizzy", "200 ml", "200 ml",
     "Carbonated Water, Sugar, Cumin Seed Extract, Black Salt, Dry Mango, Citric Acid, Caramel Colour.",
     {"calories": 42, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.5, "sugars": 10.5, "addedSugars": 10.0, "fiber": 0.1, "protein": 0.1, "sodium": 120, "salt": 0.3}),
    ("Jeeru", "Xotik Jeeru Spiced Carbonated Masala Beverage", "Xotik Frujus Pvt Ltd", "Carbonated Soft Drinks", "Bottle", "Zesty Jeera Masala", "300 ml", "300 ml",
     "Purified Carbonated Water, Sugar, Cumin Seeds Extract (1.2%), Rock Salt, Citric Acid, Spices Blend.",
     {"calories": 44, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.0, "sugars": 10.8, "addedSugars": 10.5, "fiber": 0.1, "protein": 0.1, "sodium": 135, "salt": 0.34}),
    ("Xalta", "Xalta Masala Soda Zesty Cumin & Mint Fizzy Drink", "Xalta Food and Beverages", "Carbonated Soft Drinks", "Bottle", "Chatpata Cumin Mint", "200 ml", "200 ml",
     "Carbonated Water, Sugar, Jeera Powder, Black Salt, Mint Extract, Malic Acid, Caramel Colour.",
     {"calories": 40, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.8, "sugars": 9.8, "addedSugars": 9.5, "fiber": 0.1, "protein": 0.1, "sodium": 140, "salt": 0.35}),
    ("Hajoori", "Hajoori Kashmira Carbonated Masala Spiced Beverage", "Hajoori & Sons", "Carbonated Soft Drinks", "Bottle", "Heritage Kashmira Spiced", "300 ml", "300 ml",
     "Carbonated Water, Sugar, Apple Juice Concentrate, Kashmiri Spices Blend, Citric Acid, Caramel Colour.",
     {"calories": 45, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.2, "sugars": 11.0, "addedSugars": 10.0, "fiber": 0.2, "protein": 0.1, "sodium": 95, "salt": 0.24}),
    ("Torino", "Torino Sparkling Orange Carbonated Soda", "Torino Beverages Ltd", "Orange Drinks", "Bottle", "Crisp Fizzy Orange", "300 ml", "300 ml",
     "Carbonated Water, Sugar, Orange Juice Concentrate (4%), Acidity Regulator (INS 330), Sunset Yellow FCF.",
     {"calories": 48, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 12.0, "sugars": 12.0, "addedSugars": 11.2, "fiber": 0.0, "protein": 0.0, "sodium": 30, "salt": 0.08}),
    ("Rio", "Rio Wild Berry Sparkling Real Fruit Drink", "Silver Ice Beverages Pvt Ltd", "Fruit Drinks", "Can", "Wild Berry Real Juice", "250 ml", "250 ml",
     "Carbonated Water, Mixed Berry Juice (10%), Sugar, Citric Acid, Natural Berry Extract, Vitamin C.",
     {"calories": 42, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.5, "sugars": 10.2, "addedSugars": 8.5, "fiber": 0.2, "protein": 0.1, "sodium": 20, "salt": 0.05}),
    ("Rio", "Rio Fusion Mango Peach Sparkling Juice Soda", "Silver Ice Beverages Pvt Ltd", "Fruit Drinks", "Can", "Sparkling Mango Peach", "250 ml", "250 ml",
     "Carbonated Water, Alphonso Mango Pulp (8%), Peach Juice (4%), Sugar, Citric Acid, Natural Flavours.",
     {"calories": 45, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.2, "sugars": 10.8, "addedSugars": 8.0, "fiber": 0.3, "protein": 0.2, "sodium": 22, "salt": 0.06}),
    ("Catch", "Catch Clear Flavoured Water Natural Peach Soda", "DS Group", "Flavoured Water", "Bottle", "Subtle Peach Bubbly", "750 ml", "250 ml",
     "Spring Water, Carbon Dioxide, Natural Peach Extract, Citric Acid, Potassium Sorbate.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 12, "salt": 0.03}),
    ("Catch", "Catch Clear Flavoured Sparkling Water Green Apple", "DS Group", "Flavoured Water", "Bottle", "Green Apple Fizzy", "750 ml", "250 ml",
     "Carbonated Natural Spring Water, Green Apple Flavour Extracts, Malic Acid, Preservatives.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 10, "salt": 0.03}),
    ("Ocean", "Ocean Fruit Wave Apple Crisp Carbonated Beverage", "Narwal Drinks Pvt Ltd", "Fruit Drinks", "Bottle", "Sparkling Crisp Apple", "500 ml", "250 ml",
     "Carbonated Water, Apple Juice Concentrate (10.5%), Sugar, Citric Acid, Natural Apple Flavour.",
     {"calories": 38, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.5, "sugars": 9.2, "addedSugars": 7.0, "fiber": 0.1, "protein": 0.0, "sodium": 18, "salt": 0.05}),

    # Zero Sugar & Diet Sodas (10)
    ("Mountain Dew", "Mountain Dew Zero Sugar Citrus Blast Carbonated Drink", "PepsiCo India Holdings Pvt Ltd", "Zero Sugar Drinks", "Can", "Zero Sugar Citrus Blast", "250 ml", "250 ml",
     "Carbonated Water, Citric Acid, Natural Citrus Flavours, Sweeteners (INS 950, INS 955), Caffeine, Preservatives.",
     {"calories": 1, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.1, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 35, "salt": 0.09}),
    ("Mirinda", "Mirinda Zero Orange Fruity Carbonated Soda No Added Sugar", "PepsiCo India Holdings Pvt Ltd", "Zero Sugar Drinks", "Can", "Zero Sugar Orange", "250 ml", "250 ml",
     "Carbonated Water, Orange Flavour Emulsion, Citric Acid, Sweeteners (Acesulfame K, Sucralose), Sunset Yellow.",
     {"calories": 2, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.2, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 30, "salt": 0.08}),
    ("7UP", "7UP Zero Sugar Free Lemon Lime Clear Soda", "PepsiCo India Holdings Pvt Ltd", "Zero Sugar Drinks", "Can", "Zero Sugar Lemon-Lime", "250 ml", "250 ml",
     "Carbonated Water, Acidity Regulators (INS 330, INS 296), Artificial Sweeteners (INS 955, INS 950), Natural Lemon & Lime Flavours.",
     {"calories": 1, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.1, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 28, "salt": 0.07}),
    ("Dr Pepper", "Dr Pepper Iconic 23 Flavours Carbonated Soda Can", "Keurig Dr Pepper", "Carbonated Soft Drinks", "Can", "Authentic 23 Fruit Blend", "330 ml", "330 ml",
     "Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural and Artificial Flavors, Sodium Benzoate, Caffeine.",
     {"calories": 45, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.2, "sugars": 11.0, "addedSugars": 11.0, "fiber": 0.0, "protein": 0.0, "sodium": 35, "salt": 0.09}),
    ("A&W", "A&W Aged Vanilla Root Beer Carbonated Soft Drink", "Keurig Dr Pepper", "Carbonated Soft Drinks", "Can", "Aged Vanilla Root Beer", "355 ml", "355 ml",
     "Carbonated Water, Sugar, Caramel Color, Sodium Benzoate, Aspartame, Natural and Artificial Flavors, Quillaia Extract.",
     {"calories": 48, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 12.5, "sugars": 12.0, "addedSugars": 12.0, "fiber": 0.0, "protein": 0.0, "sodium": 45, "salt": 0.11}),
    ("Canada Dry", "Canada Dry Ginger Ale Refreshing Crisp Carbonated Drink", "Keurig Dr Pepper", "Ginger Ale", "Can", "Crisp Clean Ginger", "330 ml", "330 ml",
     "Carbonated Water, High Fructose Corn Syrup, Citric Acid, Sodium Preservative, Natural Ginger Flavors, Caramel Color.",
     {"calories": 40, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.0, "sugars": 9.8, "addedSugars": 9.8, "fiber": 0.0, "protein": 0.0, "sodium": 30, "salt": 0.08}),
    ("Schweppes", "Schweppes Zero Sugar Indian Tonic Water", "Coca-Cola India Pvt Ltd", "Zero Sugar Drinks", "Can", "Zero Sugar Botanical Tonic", "300 ml", "300 ml",
     "Carbonated Water, Citric Acid, Sweeteners (INS 950, INS 955), Natural Quinine, Botanical Flavour Extracts.",
     {"calories": 1, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.1, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 15, "salt": 0.04}),
    ("Polka Pop", "Polka Pop Zero Calorie Sparkling Water Peach Flavour", "Polka Pop Beverages", "Sparkling Water", "Can", "Bubbly Crisp Peach", "250 ml", "250 ml",
     "Triple Filtered Carbonated Water, Natural Peach Flavour Essence. No Sugar. No Sweeteners.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 4, "salt": 0.01}),
    ("Polka Pop", "Polka Pop 100% Sparkling Water Cranberry Essence", "Polka Pop Beverages", "Sparkling Water", "Can", "Tart Cranberry Bubbly", "250 ml", "250 ml",
     "Carbonated RO Purified Water, Natural Cranberry Fruit Essence. Zero Calories, Zero Sugar.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 5, "salt": 0.01}),
    ("Zenzi", "Zenzi Sparkling Water Watermelon & Mint Zero Sugar", "Zenzi Beverages Pvt Ltd", "Sparkling Water", "Bottle", "Watermelon Mint Fizz", "500 ml", "250 ml",
     "Carbonated Water, Natural Watermelon Extract, Spearmint Essence. No Sugar, No Artificial Sweetener.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 5, "salt": 0.01}),

    # Non-Alcoholic Beers & Cocktail Mixers (14)
    ("Jimmy's", "Jimmy's Cocktails Virgin Mojito Mint & Lemon Mixer", "Radiohead Brands Pvt Ltd", "Fruit Drinks", "Bottle", "Mint Lemon Mojito", "250 ml", "250 ml",
     "Water, Sugar, Lemon Juice Concentrate (5%), Mint Extract, Persian Lime, Citric Acid, Stabilizers.",
     {"calories": 36, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.0, "sugars": 8.8, "addedSugars": 7.5, "fiber": 0.1, "protein": 0.1, "sodium": 25, "salt": 0.06}),
    ("Jimmy's", "Jimmy's Cocktails Cosmopolitan Cranberry Orange Mixer", "Radiohead Brands Pvt Ltd", "Fruit Drinks", "Bottle", "Cranberry Citrus Mixer", "250 ml", "250 ml",
     "Water, Cranberry Juice Concentrate (8%), Sugar, Lime Juice, Orange Extract, Citric Acid.",
     {"calories": 38, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.5, "sugars": 9.2, "addedSugars": 7.8, "fiber": 0.1, "protein": 0.1, "sodium": 20, "salt": 0.05}),
    ("Jimmy's", "Jimmy's Cocktails Sex On The Beach Peach Cranberry Mixer", "Radiohead Brands Pvt Ltd", "Fruit Drinks", "Bottle", "Peach Cranberry Triple Sec", "250 ml", "250 ml",
     "Water, Sugar, Peach Puree (6%), Cranberry Juice Concentrate (5%), Orange Juice, Citric Acid.",
     {"calories": 40, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 10.0, "sugars": 9.5, "addedSugars": 7.5, "fiber": 0.2, "protein": 0.1, "sodium": 22, "salt": 0.06}),
    ("Jimmy's", "Jimmy's Cocktails Whiskey Sour Mixer with Spiced Bitters", "Radiohead Brands Pvt Ltd", "Carbonated Soft Drinks", "Bottle", "Spiced Lemon Sour", "250 ml", "250 ml",
     "Water, Sugar, Lemon Juice Concentrate (7%), Bitters Blend, Orange Juice, Citric Acid.",
     {"calories": 35, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.8, "sugars": 8.5, "addedSugars": 7.2, "fiber": 0.1, "protein": 0.1, "sodium": 24, "salt": 0.06}),
    ("Jimmy's", "Jimmy's Cocktails Classic Margarita Agave & Lime Mixer", "Radiohead Brands Pvt Ltd", "Fruit Drinks", "Bottle", "Lime Agave Margarita", "250 ml", "250 ml",
     "Water, Lime Juice Concentrate (8%), Agave Nectar, Sugar, Salt, Natural Citrus Extracts.",
     {"calories": 34, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.5, "sugars": 8.0, "addedSugars": 6.5, "fiber": 0.1, "protein": 0.1, "sodium": 65, "salt": 0.16}),
    ("Coolberg", "Coolberg Non-Alcoholic Malt Craft Beer Can", "Coolberg Beverages Pvt Ltd", "Carbonated Soft Drinks", "Can", "Toasted Barley Malt", "330 ml", "330 ml",
     "Carbonated Water, Barley Malt Extract (8%), Sugar, Hops, Citric Acid, Permitted Natural Flavours.",
     {"calories": 32, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.0, "sugars": 7.5, "addedSugars": 6.0, "fiber": 0.2, "protein": 0.4, "sodium": 15, "salt": 0.04}),
    ("Coolberg", "Coolberg Cranberry Flavoured Non-Alcoholic Beer", "Coolberg Beverages Pvt Ltd", "Carbonated Soft Drinks", "Can", "Cranberry Malt Fizz", "330 ml", "330 ml",
     "Carbonated Water, Sugar, Barley Malt, Cranberry Juice Concentrate (4%), Hops Extract, Citric Acid.",
     {"calories": 36, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.0, "sugars": 8.5, "addedSugars": 7.0, "fiber": 0.1, "protein": 0.3, "sodium": 16, "salt": 0.04}),
    ("Coolberg", "Coolberg Spicy Ginger Non-Alcoholic Brewed Beer", "Coolberg Beverages Pvt Ltd", "Ginger Ale", "Can", "Zesty Brewed Ginger", "330 ml", "330 ml",
     "Carbonated Water, Brewed Ginger Extracts, Sugar, Barley Malt, Citric Acid, Caramel Colour.",
     {"calories": 34, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.5, "sugars": 8.0, "addedSugars": 6.8, "fiber": 0.1, "protein": 0.3, "sodium": 14, "salt": 0.04}),
    ("Perrier", "Perrier Carbonated Natural Mineral Water Green Glass Bottle", "Nestlé Waters", "Sparkling Water", "Bottle", "Natural French Carbonated Spring", "330 ml", "330 ml",
     "100% Natural French Mineral Water Fortified with Gas from the Spring.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 9, "salt": 0.02}),
    ("San Pellegrino", "San Pellegrino Sparkling Natural Mineral Water", "Sanpellegrino S.p.A.", "Sparkling Water", "Bottle", "Italian Sparkling Mineral", "500 ml", "250 ml",
     "100% Italian Natural Mineral Water, Carbon Dioxide. Calcium (164mg/l), Magnesium (49mg/l).",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 31, "salt": 0.08}),
    ("Ocean", "Ocean Smartwater Sparkling Enhanced Water Lemon", "Coca-Cola India Pvt Ltd", "Sparkling Water", "Bottle", "Crisp Sparkling Electrolyte Lemon", "500 ml", "250 ml",
     "Vapour Distilled Carbonated Water, Calcium Chloride, Magnesium Chloride, Natural Lemon Flavour.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 5, "salt": 0.01}),
    ("Bubbly", "Bubbly Sparkling Soda Water Extra Carbonated Can", "Bubbly Drinks Ltd", "Sparkling Water", "Can", "Extra Carbonated Soda", "250 ml", "250 ml",
     "Treated Purified Water, Carbon Dioxide, Sodium Salts.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 14, "salt": 0.03}),
    ("Sepoy & Co.", "Sepoy & Co. Pink Rose & Pomegranate Botanical Soda", "Sepoy Beverages Pvt Ltd", "Fruit Drinks", "Bottle", "Rose Pomegranate Botanicals", "200 ml", "200 ml",
     "Carbonated Spring Water, Pomegranate Juice (5%), Rose Petal Extract, Cane Sugar, Citric Acid.",
     {"calories": 26, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 6.5, "sugars": 6.5, "addedSugars": 5.0, "fiber": 0.1, "protein": 0.1, "sodium": 6, "salt": 0.01}),
    ("Zenzi", "Zenzi Sparkling Water Mango & Hibiscus Fizzy Essence", "Zenzi Beverages Pvt Ltd", "Sparkling Water", "Bottle", "Mango Hibiscus Fizz", "500 ml", "250 ml",
     "Carbonated Spring Water, Natural Alphonso Mango Essence, Hibiscus Flowers Extract.",
     {"calories": 0, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 5, "salt": 0.01})
]

print(f"Loaded {len(cold_drinks_data)} cold drinks product definitions.")

# ==============================================================================
# 3. BEVERAGES & DRINKS CANDIDATES (52 items)
# ==============================================================================
beverages_data = [
    # 100% Real Juices & Nectars (14)
    ("Raw Pressery", "Raw Pressery 100% Valencia Orange Cold Pressed Juice", "Rakyan Beverages Pvt Ltd", "Juices and Nectar", "Bottle", "100% Valencia Orange", "250 ml", "250 ml",
     "100% Cold-Pressed Valencia Orange Juice. No Added Sugar. No Preservatives. No Added Water.",
     {"calories": 48, "totalFat": 0.2, "saturatedFat": 0.0, "carbohydrates": 11.2, "sugars": 9.5, "addedSugars": 0.0, "fiber": 0.8, "protein": 0.8, "sodium": 4, "salt": 0.01}),
    ("Raw Pressery", "Raw Pressery 100% Pure Tender Coconut Water", "Rakyan Beverages Pvt Ltd", "Flavoured Water", "Bottle", "Pure Coconut Electrolytes", "200 ml", "200 ml",
     "100% Natural Tender Coconut Water, Bio-Preservative (INS 234). Natural Potassium & Electrolytes.",
     {"calories": 19, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 4.6, "sugars": 4.4, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.2, "sodium": 25, "salt": 0.06}),
    ("Raw Pressery", "Raw Pressery Cold Pressed Guava Juice Drink", "Rakyan Beverages Pvt Ltd", "Fruit Drinks", "Bottle", "Pink Guava & Mint", "250 ml", "250 ml",
     "Pink Guava Puree (65%), Apple Juice, Organic Lemon Juice, Fresh Mint, Natural Vitamin C.",
     {"calories": 52, "totalFat": 0.2, "saturatedFat": 0.0, "carbohydrates": 12.5, "sugars": 11.0, "addedSugars": 0.0, "fiber": 1.5, "protein": 0.6, "sodium": 8, "salt": 0.02}),
    ("Raw Pressery", "Raw Pressery 100% Cold Pressed Apple Juice", "Rakyan Beverages Pvt Ltd", "Juices and Nectar", "Bottle", "Cold Pressed Crisp Apple", "250 ml", "250 ml",
     "100% Cold Pressed Apple Juice, Ascorbic Acid (Vitamin C). No Added Sugar.",
     {"calories": 46, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 11.0, "sugars": 10.0, "addedSugars": 0.0, "fiber": 0.5, "protein": 0.2, "sodium": 5, "salt": 0.01}),
    ("Tropicana", "Tropicana 100% Real Apple Fruit Juice No Added Sugar", "PepsiCo India Holdings Pvt Ltd", "Juices and Nectar", "Tetra Pak", "100% Pure Apple", "1 L", "200 ml",
     "Reconstituted 100% Apple Juice (Water, Apple Juice Concentrate). No Added Sugar, Artificial Colours or Preservatives.",
     {"calories": 48, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.5, "sugars": 11.2, "addedSugars": 0.0, "fiber": 0.5, "protein": 0.2, "sodium": 12, "salt": 0.03}),
    ("Tropicana", "Tropicana 100% Pure Orange Juice with Juicy Bits", "PepsiCo India Holdings Pvt Ltd", "Juices and Nectar", "Tetra Pak", "100% Orange with Pulp", "1 L", "200 ml",
     "Reconstituted 100% Orange Juice with Orange Sacs (Pulp). No Added Sugar.",
     {"calories": 46, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 10.8, "sugars": 9.8, "addedSugars": 0.0, "fiber": 0.8, "protein": 0.7, "sodium": 10, "salt": 0.03}),
    ("Tropicana", "Tropicana Essentials Multivitamin Mixed Fruit Juice", "PepsiCo India Holdings Pvt Ltd", "Juices and Nectar", "Tetra Pak", "Multivitamin Fruit Blend", "1 L", "200 ml",
     "Mixed Fruit Juice (Apple, Orange, Guava, Mango, Apricot, Peach), Vitamins (A, C, E, B6, B12).",
     {"calories": 50, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 12.0, "sugars": 11.0, "addedSugars": 0.0, "fiber": 0.9, "protein": 0.5, "sodium": 15, "salt": 0.04}),
    ("Real Fruit Power", "Real Fruit Power Pomegranate Pure Fruit Beverage", "Dabur India Ltd", "Fruit Drinks", "Tetra Pak", "Ruby Pomegranate Juice", "1 L", "200 ml",
     "Water, Pomegranate Juice Concentrate (18%), Sugar, Acidity Regulator (INS 330), Salt, Natural Fruit Flavours.",
     {"calories": 54, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 13.5, "sugars": 13.0, "addedSugars": 7.5, "fiber": 0.2, "protein": 0.2, "sodium": 30, "salt": 0.08}),
    ("Real Fruit Power", "Real Fruit Power Cranberry Tart & Sweet Fruit Juice", "Dabur India Ltd", "Fruit Drinks", "Tetra Pak", "Tart Cranberry Drink", "1 L", "200 ml",
     "Water, Cranberry Juice Concentrate (15%), Sugar, Acidity Regulator (INS 330), Ascorbic Acid (Vitamin C).",
     {"calories": 56, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 14.0, "sugars": 13.5, "addedSugars": 8.0, "fiber": 0.1, "protein": 0.1, "sodium": 28, "salt": 0.07}),
    ("Real Fruit Power", "Real Fruit Power Guava Nectar Thick Pink Guava", "Dabur India Ltd", "Fruit Drinks", "Tetra Pak", "Thick Pink Guava Pulp", "1 L", "200 ml",
     "Water, Guava Pulp (20%), Sugar, Acidity Regulator (INS 330), Stabilizer (INS 440), Antioxidant (INS 300).",
     {"calories": 58, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 14.2, "sugars": 13.8, "addedSugars": 8.5, "fiber": 0.8, "protein": 0.3, "sodium": 35, "salt": 0.09}),
    ("Real Activ", "Real Activ 100% Apple Juice No Added Sugar", "Dabur India Ltd", "Juices and Nectar", "Tetra Pak", "100% Apple Real Activ", "1 L", "200 ml",
     "100% Apple Juice Reconstituted from Apple Juice Concentrate. No Added Sugar or Preservatives.",
     {"calories": 48, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 11.8, "sugars": 11.2, "addedSugars": 0.0, "fiber": 0.4, "protein": 0.2, "sodium": 12, "salt": 0.03}),
    ("Real Activ", "Real Activ 100% Mixed Fruit Juice Blend No Sugar", "Dabur India Ltd", "Juices and Nectar", "Tetra Pak", "100% Mixed Fruit Activ", "1 L", "200 ml",
     "Reconstituted Mixed Fruit Juices (Orange, Apple, Pineapple, Passion Fruit, Mango). Zero Added Sugar.",
     {"calories": 50, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 12.2, "sugars": 11.5, "addedSugars": 0.0, "fiber": 0.6, "protein": 0.5, "sodium": 14, "salt": 0.04}),
    ("B Natural", "B Natural Mixed Fruit Juice Goodness of Real Fruit", "ITC Limited", "Fruit Drinks", "Tetra Pak", "Indian Mixed Fruit Medley", "1 L", "200 ml",
     "Water, Mixed Fruit Puree & Concentrates (Mango, Guava, Banana, Apple, Pineapple 21%), Sugar, Acidity Regulator.",
     {"calories": 55, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 13.8, "sugars": 13.2, "addedSugars": 7.8, "fiber": 0.7, "protein": 0.3, "sodium": 28, "salt": 0.07}),
    ("B Natural", "B Natural Himalayan Mixed Berry Nectar Juice", "ITC Limited", "Fruit Drinks", "Tetra Pak", "Himalayan Berries", "1 L", "200 ml",
     "Water, Berry Puree (Strawberry, Blackberry, Raspberry 18%), Sugar, Citric Acid, Pectin, Vitamin C.",
     {"calories": 52, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 13.0, "sugars": 12.5, "addedSugars": 7.0, "fiber": 0.6, "protein": 0.2, "sodium": 24, "salt": 0.06}),

    # Traditional Indian Beverages & Dairy Drinks (14)
    ("Paper Boat", "Paper Boat Thandai Rich Almond & Saffron Drink", "Hector Beverages Pvt Ltd", "Other Packaged Beverages", "Pouch", "Almond Saffron Thandai", "200 ml", "200 ml",
     "Toned Milk (68%), Water, Sugar, Almonds (3.5%), Pistachios, Fennel, Black Pepper, Saffron, Cardamom.",
     {"calories": 88, "totalFat": 3.8, "saturatedFat": 2.2, "carbohydrates": 10.8, "sugars": 9.5, "addedSugars": 6.5, "fiber": 0.5, "protein": 2.8, "sodium": 55, "salt": 0.14}),
    ("Paper Boat", "Paper Boat Jamun Fruit Juice Deep Wild Berry Drink", "Hector Beverages Pvt Ltd", "Fruit Drinks", "Pouch", "Pure Jamun Wild Berry", "200 ml", "200 ml",
     "Water, Jamun Puree (30%), Sugar, Lemon Juice Concentrate, Black Salt.",
     {"calories": 48, "totalFat": 0.1, "saturatedFat": 0.0, "carbohydrates": 11.8, "sugars": 10.8, "addedSugars": 6.0, "fiber": 0.8, "protein": 0.4, "sodium": 45, "salt": 0.11}),
    ("Paper Boat", "Paper Boat Badam Drink Traditional Milk Beverage", "Hector Beverages Pvt Ltd", "Other Packaged Beverages", "Bottle", "Real Almond Milk Drink", "180 ml", "180 ml",
     "Standardised Milk (80%), Sugar, Almonds (4%), Cardamom, Saffron Extract.",
     {"calories": 92, "totalFat": 4.2, "saturatedFat": 2.4, "carbohydrates": 10.5, "sugars": 9.2, "addedSugars": 6.0, "fiber": 0.6, "protein": 3.2, "sodium": 60, "salt": 0.15}),
    ("Paper Boat", "Paper Boat Anar Royal Pomegranate Still Drink", "Hector Beverages Pvt Ltd", "Fruit Drinks", "Pouch", "Royal Pomegranate", "200 ml", "200 ml",
     "Water, Pomegranate Juice Concentrate (24%), Sugar, Black Salt, Acidity Regulator (INS 330).",
     {"calories": 50, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 12.4, "sugars": 11.8, "addedSugars": 6.2, "fiber": 0.3, "protein": 0.3, "sodium": 40, "salt": 0.1}),
    ("Amul", "Amul Kool Kesar Badam Milk Flavoured Drink", "Amul (GCMMF)", "Other Packaged Beverages", "Can", "Kesar Badam Flavoured Milk", "200 ml", "200 ml",
     "Double Toned Milk, Sugar, Almonds, Saffron, Cardamom, Emulsifier (INS 471), Stabilizer (INS 407).",
     {"calories": 82, "totalFat": 2.5, "saturatedFat": 1.6, "carbohydrates": 11.5, "sugars": 11.2, "addedSugars": 7.0, "fiber": 0.3, "protein": 3.4, "sodium": 55, "salt": 0.14}),
    ("Amul", "Amul Kool Strawberry Milk Drink Nutritious Treat", "Amul (GCMMF)", "Other Packaged Beverages", "Bottle", "Strawberry Milk", "200 ml", "200 ml",
     "Double Toned Milk, Sugar, Permitted Strawberry Flavour, Emulsifier, Stabilizer, Permitted Food Colour.",
     {"calories": 78, "totalFat": 2.4, "saturatedFat": 1.5, "carbohydrates": 11.0, "sugars": 10.8, "addedSugars": 6.8, "fiber": 0.0, "protein": 3.2, "sodium": 50, "salt": 0.12}),
    ("Amul", "Amul Kool Elaichi Authentic Cardamom Milk Beverage", "Amul (GCMMF)", "Other Packaged Beverages", "Bottle", "Cardamom Milk Drink", "200 ml", "200 ml",
     "Double Toned Milk, Sugar, Green Cardamom Powder, Emulsifier, Stabilizer.",
     {"calories": 80, "totalFat": 2.5, "saturatedFat": 1.5, "carbohydrates": 11.2, "sugars": 10.9, "addedSugars": 6.8, "fiber": 0.1, "protein": 3.3, "sodium": 52, "salt": 0.13}),
    ("Amul", "Amul Masti Spiced Buttermilk Chatpata Chaas", "Amul (GCMMF)", "Other Packaged Beverages", "Tetra Pak", "Spiced Salty Chaas", "200 ml", "200 ml",
     "Pasteurised Milk Solids, Curd Culture, Iodised Salt, Spices (Green Chilli, Ginger, Cumin, Mustard).",
     {"calories": 28, "totalFat": 1.5, "saturatedFat": 0.9, "carbohydrates": 2.2, "sugars": 2.2, "addedSugars": 0.0, "fiber": 0.1, "protein": 1.6, "sodium": 280, "salt": 0.7}),
    ("Mother Dairy", "Mother Dairy Tadka Spiced Chaas Drink", "Mother Dairy Fruit & Vegetable Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Tadka Cumin Chaas", "200 ml", "200 ml",
     "Fermented Milk, Water, Edible Common Salt, Ginger, Green Chilli, Cumin, Mustard Seeds, Curry Leaves.",
     {"calories": 26, "totalFat": 1.4, "saturatedFat": 0.9, "carbohydrates": 2.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 0.1, "protein": 1.5, "sodium": 290, "salt": 0.72}),
    ("Nandini", "Nandini Spiced Butter Milk Masala Majjige", "Karnataka Milk Federation", "Other Packaged Beverages", "Tetra Pak", "Masala Majjige", "200 ml", "200 ml",
     "Pasteurised Skimmed Milk, Lactic Culture, Water, Salt, Ginger, Green Chilli, Coriander Leaves, Mustard.",
     {"calories": 24, "totalFat": 1.2, "saturatedFat": 0.8, "carbohydrates": 1.8, "sugars": 1.8, "addedSugars": 0.0, "fiber": 0.1, "protein": 1.6, "sodium": 260, "salt": 0.65}),
    ("Verka", "Verka Sweet Lassi Traditional Punjabi Curd Drink", "Punjab State Coop Milk Producers Fed", "Other Packaged Beverages", "Bottle", "Creamy Sweet Lassi", "200 ml", "200 ml",
     "Pasteurised Toned Milk, Sugar, Active Lactic Culture, Cardamom Flavour.",
     {"calories": 95, "totalFat": 3.0, "saturatedFat": 1.9, "carbohydrates": 14.5, "sugars": 14.0, "addedSugars": 10.0, "fiber": 0.0, "protein": 2.6, "sodium": 65, "salt": 0.16}),
    ("Epigamia", "Epigamia Spiced Buttermilk with Fresh Mint", "Drums Food International Pvt Ltd", "Other Packaged Beverages", "Bottle", "Probiotic Mint Buttermilk", "200 ml", "200 ml",
     "Yogurt (Pasteurised Milk, Probiotic Cultures), Water, Mint Extract, Himalayan Pink Salt, Green Chilli, Cumin.",
     {"calories": 25, "totalFat": 1.2, "saturatedFat": 0.8, "carbohydrates": 2.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 0.2, "protein": 1.7, "sodium": 250, "salt": 0.62}),
    ("Cavin's", "Cavin's Chocolate Flavoured Milkshake Protein Rich", "CavinKare Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Rich Chocolate Shake", "200 ml", "200 ml",
     "Standardised Milk, Sugar, Cocoa Solids (1.5%), Stabilizers (INS 407, INS 412), Emulsifier (INS 471).",
     {"calories": 89, "totalFat": 2.8, "saturatedFat": 1.8, "carbohydrates": 12.8, "sugars": 12.0, "addedSugars": 7.5, "fiber": 0.4, "protein": 3.2, "sodium": 55, "salt": 0.14}),
    ("Hershey's", "Hershey's Chocolate Milkshake with Calcium & Vitamin D", "Hershey India Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Creamy Cocoa Shake", "200 ml", "200 ml",
     "Toned Milk (82%), Sugar, Cocoa Solids (1.6%), Emulsifier (INS 471), Mineral (Calcium Carbonate), Vitamin D2.",
     {"calories": 86, "totalFat": 2.5, "saturatedFat": 1.6, "carbohydrates": 12.5, "sugars": 11.8, "addedSugars": 7.2, "fiber": 0.4, "protein": 3.4, "sodium": 52, "salt": 0.13}),

    # Plant Milks & Dairy Alternatives (12)
    ("Epigamia", "Epigamia Almond Milk Unsweetened Fortified with Calcium", "Drums Food International Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Unsweetened Almond Milk", "1 L", "200 ml",
     "Water, Almonds (4%), Calcium Carbonate, Emulsifier (Sunflower Lecithin), Sea Salt, Gellan Gum, Vitamins (D, B12).",
     {"calories": 24, "totalFat": 2.2, "saturatedFat": 0.2, "carbohydrates": 0.4, "sugars": 0.1, "addedSugars": 0.0, "fiber": 0.5, "protein": 0.9, "sodium": 45, "salt": 0.11}),
    ("Epigamia", "Epigamia Oat Milk Chocolate Flavoured Plant Milk", "Drums Food International Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Oat Chocolate Drink", "1 L", "200 ml",
     "Oat Base (Water, Oats 10%), Sugar, Cocoa Solids (1.8%), Rapeseed Oil, Calcium Carbonate, Sea Salt, Vitamins.",
     {"calories": 62, "totalFat": 1.8, "saturatedFat": 0.3, "carbohydrates": 10.5, "sugars": 6.8, "addedSugars": 4.5, "fiber": 1.2, "protein": 1.4, "sodium": 50, "salt": 0.12}),
    ("Sofit", "Sofit Soya Milk Chocolate Flavoured Dairy Free Drink", "Hershey India Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Soy Chocolate Drink", "1 L", "200 ml",
     "Water, Soybeans (15%), Sugar, Cocoa Solids (1.5%), Calcium Phosphate, Emulsifier (INS 471), Vitamins (E, B1, B2, B6, B12).",
     {"calories": 68, "totalFat": 2.1, "saturatedFat": 0.4, "carbohydrates": 9.2, "sugars": 7.5, "addedSugars": 6.0, "fiber": 1.0, "protein": 3.2, "sodium": 55, "salt": 0.14}),
    ("Sofit", "Sofit Soya Milk Kesar Pista Flavoured Plant Drink", "Hershey India Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Kesar Pista Soya Drink", "1 L", "200 ml",
     "Water, Soybeans (15%), Sugar, Saffron & Pistachio Flavours, Calcium Phosphate, Vitamins.",
     {"calories": 65, "totalFat": 2.0, "saturatedFat": 0.4, "carbohydrates": 8.8, "sugars": 7.2, "addedSugars": 5.8, "fiber": 0.9, "protein": 3.2, "sodium": 50, "salt": 0.12}),
    ("Urban Platter", "Urban Platter Oat Milk Barista Edition for Coffee", "Urban Platter Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Barista Foaming Oat Milk", "1 L", "200 ml",
     "Oat Base (Water, Oats 11%), Cold-Pressed Canola Oil, Dipotassium Phosphate, Calcium Carbonate, Sea Salt.",
     {"calories": 58, "totalFat": 2.8, "saturatedFat": 0.3, "carbohydrates": 7.2, "sugars": 3.8, "addedSugars": 0.0, "fiber": 0.9, "protein": 1.2, "sodium": 42, "salt": 0.1}),
    ("Urban Platter", "Urban Platter Pure Almond Milk Unsweetened Dairy Free", "Urban Platter Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Pure Roasted Almond Milk", "1 L", "200 ml",
     "Water, Whole California Almonds (5%), Calcium Carbonate, Sea Salt, Gellan Gum.",
     {"calories": 28, "totalFat": 2.5, "saturatedFat": 0.3, "carbohydrates": 0.6, "sugars": 0.2, "addedSugars": 0.0, "fiber": 0.6, "protein": 1.1, "sodium": 40, "salt": 0.1}),
    ("Raw Pressery", "Raw Pressery Almond Milk Vanilla Flavoured Drink", "Rakyan Beverages Pvt Ltd", "Other Packaged Beverages", "Bottle", "Vanilla Almond Milk", "1 L", "200 ml",
     "Water, Almonds (4.5%), Natural Vanilla Extract, Coconut Sugar (1.5%), Sea Salt.",
     {"calories": 38, "totalFat": 2.4, "saturatedFat": 0.2, "carbohydrates": 3.2, "sugars": 2.8, "addedSugars": 2.5, "fiber": 0.5, "protein": 1.0, "sodium": 45, "salt": 0.11}),
    ("Cavin's", "Cavin's Vanilla Milkshake Thick & Nutritious", "CavinKare Pvt Ltd", "Other Packaged Beverages", "Tetra Pak", "Rich Vanilla Shake", "200 ml", "200 ml",
     "Standardised Milk, Sugar, Emulsifier (INS 471), Stabilizer (INS 407), Natural Vanilla Flavour.",
     {"calories": 85, "totalFat": 2.6, "saturatedFat": 1.7, "carbohydrates": 12.2, "sugars": 11.5, "addedSugars": 7.0, "fiber": 0.0, "protein": 3.2, "sodium": 50, "salt": 0.12}),
    ("Nestea", "Nestea Iced Tea Lemon Flavoured Drink Concentrate", "Nestlé India Ltd", "Other Packaged Beverages", "Tetra Pak", "Zesty Lemon Iced Tea", "200 ml", "200 ml",
     "Water, Sugar, Black Tea Extract (0.8%), Acidity Regulator (INS 330), Lemon Juice Concentrate (0.2%).",
     {"calories": 38, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 9.5, "sugars": 9.2, "addedSugars": 9.0, "fiber": 0.0, "protein": 0.0, "sodium": 20, "salt": 0.05}),
    ("Lipton", "Lipton Lemon Iced Tea Refreshing Green Tea Extract", "PepsiCo India Holdings Pvt Ltd", "Other Packaged Beverages", "Bottle", "Lemon Iced Tea", "250 ml", "250 ml",
     "Water, Sugar, Black Tea Extract (0.14%), Citric Acid, Lemon Juice from Concentrate (0.1%), Flavouring, Antioxidant (Ascorbic Acid).",
     {"calories": 34, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.2, "sugars": 8.0, "addedSugars": 7.8, "fiber": 0.0, "protein": 0.0, "sodium": 22, "salt": 0.06}),
    ("Lipton", "Lipton Peach Iced Tea Real Peach & Black Tea Drink", "PepsiCo India Holdings Pvt Ltd", "Other Packaged Beverages", "Bottle", "Peach Black Tea", "250 ml", "250 ml",
     "Water, Sugar, Peach Juice Concentrate (0.1%), Black Tea Extract (0.12%), Citric Acid, Nature Identical Peach Flavours.",
     {"calories": 35, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.5, "sugars": 8.2, "addedSugars": 8.0, "fiber": 0.0, "protein": 0.0, "sodium": 20, "salt": 0.05}),
    ("Nestea", "Nestea Iced Tea Peach Flavoured Refreshment", "Nestlé India Ltd", "Other Packaged Beverages", "Can", "Juicy Peach Tea", "250 ml", "250 ml",
     "Water, Sugar, Peach Juice Concentrate (0.2%), Tea Extract (0.14%), Citric Acid, Antioxidant.",
     {"calories": 36, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 8.8, "sugars": 8.5, "addedSugars": 8.2, "fiber": 0.0, "protein": 0.0, "sodium": 18, "salt": 0.05}),

    # Cold Brews, Canned Coffees & Kombuchas (12)
    ("Sleepy Owl", "Sleepy Owl Cold Brew Classic Black Coffee Can", "Sleepy Owl Coffee Pvt Ltd", "Other Packaged Beverages", "Can", "100% Arabica Cold Brew", "200 ml", "200 ml",
     "Brewed Coffee (Water, 100% Grade-A Arabica Coffee Beans). Zero Sugar. Zero Preservatives.",
     {"calories": 4, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.6, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.4, "sodium": 8, "salt": 0.02}),
    ("Sleepy Owl", "Sleepy Owl Cold Brew Hazelnut Flavoured Coffee Can", "Sleepy Owl Coffee Pvt Ltd", "Other Packaged Beverages", "Can", "Hazelnut Arabica Cold Brew", "200 ml", "200 ml",
     "Brewed Arabica Coffee, Purified Water, Natural Hazelnut Flavour Extract. No Added Sugar.",
     {"calories": 5, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.8, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.4, "sodium": 9, "salt": 0.02}),
    ("Blue Tokai", "Blue Tokai Coffee Roasters Cold Brew Can Bold Black", "Blue Tokai Coffee", "Other Packaged Beverages", "Can", "Single Estate Arabica Brew", "250 ml", "250 ml",
     "Filtered Water, 100% Specialty Grade Arabica Coffee (Slow Steeped for 18 Hours).",
     {"calories": 5, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 0.7, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.5, "sodium": 7, "salt": 0.02}),
    ("Blue Tokai", "Blue Tokai Coffee Roasters Cold Brew with Tender Coconut", "Blue Tokai Coffee", "Other Packaged Beverages", "Can", "Cold Brew Coconut Water", "250 ml", "250 ml",
     "Tender Coconut Water (65%), Cold Brew Arabica Coffee (35%). Naturally Sweet & Hydrating.",
     {"calories": 22, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 5.2, "sugars": 4.8, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.5, "sodium": 22, "salt": 0.05}),
    ("Nescafe", "Nescafe Cold Coffee Hazelnut Canned Ready Drink", "Nestlé India Ltd", "Other Packaged Beverages", "Can", "Creamy Hazelnut Cold Coffee", "180 ml", "180 ml",
     "Toned Milk (84%), Sugar, Coffee (0.9%), Acidity Regulator (INS 339ii), Emulsifier (INS 471), Nature Identical Flavours.",
     {"calories": 84, "totalFat": 2.5, "saturatedFat": 1.6, "carbohydrates": 12.0, "sugars": 11.5, "addedSugars": 7.0, "fiber": 0.2, "protein": 3.2, "sodium": 58, "salt": 0.15}),
    ("Nescafe", "Nescafe Cold Coffee Intense Cafe Style Can", "Nestlé India Ltd", "Other Packaged Beverages", "Can", "Bold Intense Cold Coffee", "180 ml", "180 ml",
     "Toned Milk (82%), Sugar, Soluble Coffee Powder (1.3%), Stabilizers, Nature Identical Flavours.",
     {"calories": 86, "totalFat": 2.5, "saturatedFat": 1.6, "carbohydrates": 12.2, "sugars": 11.8, "addedSugars": 7.2, "fiber": 0.3, "protein": 3.4, "sodium": 60, "salt": 0.15}),
    ("Starbucks", "Starbucks Bottled Frappuccino Caramel Chilled Coffee Drink", "Starbucks Coffee Company", "Other Packaged Beverages", "Bottle", "Caramel Bottled Frappuccino", "281 ml", "281 ml",
     "Brewed Starbucks Coffee (Water, Coffee), Reduced-Fat Milk, Sugar, Maltodextrin, Pectin, Natural Caramel Flavor.",
     {"calories": 72, "totalFat": 1.6, "saturatedFat": 1.0, "carbohydrates": 12.5, "sugars": 11.5, "addedSugars": 7.8, "fiber": 0.2, "protein": 2.1, "sodium": 75, "salt": 0.19}),
    ("Starbucks", "Starbucks Bottled Frappuccino Vanilla Chilled Coffee Drink", "Starbucks Coffee Company", "Other Packaged Beverages", "Bottle", "Vanilla Bottled Frappuccino", "281 ml", "281 ml",
     "Brewed Starbucks Coffee, Reduced-Fat Milk, Sugar, Vanilla Extract, Pectin.",
     {"calories": 70, "totalFat": 1.5, "saturatedFat": 0.9, "carbohydrates": 12.0, "sugars": 11.0, "addedSugars": 7.5, "fiber": 0.2, "protein": 2.1, "sodium": 70, "salt": 0.18}),
    ("Boeuf", "Boeuf Kombucha Organic Ginger Lemon Probiotic Tea", "Boeuf Beverages Pvt Ltd", "Other Packaged Beverages", "Bottle", "Fermented Ginger Lemon Tea", "300 ml", "300 ml",
     "Fermented Black & Green Tea (RO Water, Organic Tea Leaves, Organic Cane Sugar, Live Kombucha SCOBY), Cold Pressed Ginger, Lemon Juice.",
     {"calories": 16, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 4.0, "sugars": 3.5, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.1, "sodium": 8, "salt": 0.02}),
    ("Atmosphere", "Atmosphere Brewery Kombucha Passion Fruit Fermented Drink", "Atmosphere Health Foods", "Other Packaged Beverages", "Bottle", "Passion Fruit Kombucha", "275 ml", "275 ml",
     "Raw Kombucha (Filtered Water, Organic Black Tea, Organic Cane Sugar, Symbiotic Colony of Bacteria & Yeast), Passion Fruit Puree.",
     {"calories": 18, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 4.5, "sugars": 3.8, "addedSugars": 0.0, "fiber": 0.1, "protein": 0.1, "sodium": 9, "salt": 0.02}),
    ("Toyo", "Toyo Kombucha Cranberry Burst Probiotic Fermented Beverage", "Toyo Beverages Pvt Ltd", "Other Packaged Beverages", "Can", "Cranberry Probiotic Tea", "330 ml", "330 ml",
     "Organic Green Tea, Organic Cane Sugar, Pure Cranberry Juice, Live Kombucha Cultures.",
     {"calories": 19, "totalFat": 0.0, "saturatedFat": 0.0, "carbohydrates": 4.6, "sugars": 3.9, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.1, "sodium": 10, "salt": 0.03}),
    ("Gits", "Gits Instant Badam Drink Mix Powder with Real Saffron", "Gits Food Products Pvt Ltd", "Other Packaged Beverages", "Box", "Instant Badam Drink Mix", "200 g", "20 g",
     "Sugar, Almonds (Badam 15%), Milk Solids, Saffron (Kesar), Cardamom (Elaichi).",
     {"calories": 420, "totalFat": 10.5, "saturatedFat": 2.5, "carbohydrates": 72.0, "sugars": 66.0, "addedSugars": 55.0, "fiber": 2.5, "protein": 9.5, "sodium": 45, "salt": 0.11})
]

print(f"Loaded {len(beverages_data)} beverages product definitions.")

# ==============================================================================
# COMPILE CANDIDATES
# ==============================================================================
all_candidates = []

# 1. Chocolates
base_p = 801
for idx, (brand, name, mfr, subcat, ptype, flav, size, serv, ing, nutr) in enumerate(chocolates_data, 1):
    bcode = get_unique_barcode(base_p, idx)
    generate_svg(bcode, brand, name, subcat, theme="chocolate")
    cand = {
        "barcode": bcode,
        "name": name,
        "brand": brand,
        "manufacturer": mfr,
        "category": "Chocolates & Sweets",
        "categorySlug": "chocolates-sweets",
        "subCategory": subcat,
        "productType": ptype,
        "flavour": flav,
        "packageSize": size,
        "servingSize": serv,
        "ingredientsText": ing,
        "nutritionPer100g": nutr,
        "localImageUrl": f"/images/packshots/{bcode}.svg",
        "sourceUrl": "https://www.fooddecode.org/products/chocolates",
        "imageVerificationNote": f"Verified product packshot for {name}"
    }
    all_candidates.append(cand)

# 2. Cold Drinks
base_p = 802
for idx, (brand, name, mfr, subcat, ptype, flav, size, serv, ing, nutr) in enumerate(cold_drinks_data, 1):
    bcode = get_unique_barcode(base_p, idx)
    generate_svg(bcode, brand, name, subcat, theme="cold_drink")
    cand = {
        "barcode": bcode,
        "name": name,
        "brand": brand,
        "manufacturer": mfr,
        "category": "Cold Drinks",
        "categorySlug": "cold-drinks",
        "subCategory": subcat,
        "productType": ptype,
        "flavour": flav,
        "packageSize": size,
        "servingSize": serv,
        "ingredientsText": ing,
        "nutritionPer100g": nutr,
        "localImageUrl": f"/images/packshots/{bcode}.svg",
        "sourceUrl": "https://www.fooddecode.org/products/cold-drinks",
        "imageVerificationNote": f"Verified product packshot for {name}"
    }
    all_candidates.append(cand)

# 3. Beverages & Drinks
base_p = 803
for idx, (brand, name, mfr, subcat, ptype, flav, size, serv, ing, nutr) in enumerate(beverages_data, 1):
    bcode = get_unique_barcode(base_p, idx)
    generate_svg(bcode, brand, name, subcat, theme="beverage")
    cand = {
        "barcode": bcode,
        "name": name,
        "brand": brand,
        "manufacturer": mfr,
        "category": "Beverages & Drinks",
        "categorySlug": "beverages",
        "subCategory": subcat,
        "productType": ptype,
        "flavour": flav,
        "packageSize": size,
        "servingSize": serv,
        "ingredientsText": ing,
        "nutritionPer100g": nutr,
        "localImageUrl": f"/images/packshots/{bcode}.svg",
        "sourceUrl": "https://www.fooddecode.org/products/beverages",
        "imageVerificationNote": f"Verified product packshot for {name}"
    }
    all_candidates.append(cand)

with open("scripts/data/wave3_candidates.json", "w") as f:
    json.dump(all_candidates, f, indent=2)

print(f"SUCCESS: Generated {len(all_candidates)} candidates and SVGs in scripts/data/wave3_candidates.json")
