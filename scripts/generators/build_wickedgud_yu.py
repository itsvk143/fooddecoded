import json

with open("scripts/data/phase3_noodles.json", "r") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products from phase 3.")

# ------------------------------------------------------------------------------
# 7. WICKEDGÜD (100PercentNourishment Pvt Ltd) - 16 Products
# ------------------------------------------------------------------------------
wickedgud_products = [
    # Nourishing Instant Noodles (No Maida / No Palm Oil)
    {
        "name": "WickedGüd Nourishing Masala Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Nourishing Desi Masala",
        "wt": "70 g",
        "price": 35,
        "veg": True,
        "desc": "100% Maida-free, palm-oil-free clean noodles made with whole wheat, lentils (moong & chickpea), and brown rice.",
        "ing": "Noodles: Whole Wheat Flour (50%), Lentil Flour (Moong Dal, Chickpea 25%), Brown Rice Flour (15%), Tapioca Starch, Salt. Seasoning Mix: Spices & Herbs (Coriander, Cumin, Turmeric, Ginger, Black Pepper, Clove, Cinnamon), Dehydrated Carrots, Green Peas, Onion, Garlic, Tomato Powder, Rock Salt, Raw Brown Sugar, Cold-Pressed Sunflower Oil.",
        "nut": {"calories": 375, "totalFat": 4.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.5, "addedSugars": 0.8, "fiber": 9.5, "protein": 14.2, "sodium": 680, "salt": 1.70},
        "highlights": ["Zero Maida", "Zero Palm Oil", "Air-Dried / Non-Fried", "High Protein (14.2g)", "High Fiber (9.5g)", "Clean Label"]
    },
    {
        "name": "WickedGüd Nourishing Schezwan Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Nourishing Schezwan",
        "wt": "70 g",
        "price": 38,
        "veg": True,
        "desc": "Air-dried multi-grain noodles in a fiery clean Schezwan seasoning made with cold-pressed oil and zero MSG.",
        "ing": "Noodles: Whole Wheat, Moong Dal, Brown Rice, Chickpea, Salt. Seasoning Mix: Red Chilli Flakes, Garlic, Ginger, Sichuan Pepper, Tomato, Soy Sauce Powder, Rock Salt, Sunflower Oil.",
        "nut": {"calories": 378, "totalFat": 4.8, "saturatedFat": 0.9, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 2.8, "addedSugars": 1.0, "fiber": 9.2, "protein": 14.0, "sodium": 720, "salt": 1.80},
        "highlights": ["Zero Maida", "Zero Palm Oil", "Air-Dried", "High Protein", "Clean Schezwan"]
    },
    {
        "name": "WickedGüd Nourishing Curry Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Nourishing Curry",
        "wt": "70 g",
        "price": 38,
        "veg": True,
        "desc": "Aromatic yellow curry broth loaded with whole spices and superfood grains. 100% non-fried.",
        "ing": "Noodles: Whole Wheat, Lentils, Brown Rice, Salt. Seasoning Mix: Turmeric, Coriander, Cumin, Mustard, Fenugreek, Dehydrated Veggies, Rock Salt.",
        "nut": {"calories": 372, "totalFat": 4.2, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 2.2, "addedSugars": 0.5, "fiber": 9.6, "protein": 14.5, "sodium": 660, "salt": 1.65},
        "highlights": ["Zero Maida", "Zero Palm Oil", "Air-Dried", "High Protein", "Curry Broth"]
    },
    # Spicy Korean Range
    {
        "name": "WickedGüd Fiery 2X Spicy Korean Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Fiery 2X Spicy Korean Veg",
        "wt": "80 g",
        "price": 55,
        "veg": True,
        "desc": "Guilt-free Korean fire ramyun: 100% air-dried multi-grain noodles with authentic gochugaru heat and zero palm oil.",
        "ing": "Noodles: Whole Wheat (52%), Moong Dal & Chickpea (25%), Brown Rice (15%), Salt. Korean Sauce Sachet: Korean Red Pepper (Gochugaru), Sesame Oil, Garlic, Onion, Naturally Brewed Soy Sauce, Brown Sugar, Rock Salt.",
        "nut": {"calories": 390, "totalFat": 5.5, "saturatedFat": 1.0, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 3.8, "addedSugars": 2.2, "fiber": 9.0, "protein": 14.8, "sodium": 790, "salt": 1.98},
        "highlights": ["Zero Maida", "Zero Palm Oil", "2X Spicy Korean", "Air-Dried", "Toasted Sesame Oil"]
    },
    {
        "name": "WickedGüd 3X Chilli Chicken Korean Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "3X Chilli Chicken Korean",
        "wt": "80 g",
        "price": 60,
        "veg": False,
        "desc": "Extreme 3X fire chicken noodles crafted with air-dried whole grains and clean chicken broth extract.",
        "ing": "Noodles: Whole Wheat, Lentils, Brown Rice, Salt. Korean Fire Sauce: Chicken Extract, Bhut Jolokia / Korean Red Pepper, Sesame Oil, Soy Sauce, Garlic, Salt.",
        "nut": {"calories": 398, "totalFat": 6.0, "saturatedFat": 1.2, "transFat": 0.0, "carbohydrates": 66.5, "sugars": 3.5, "addedSugars": 2.0, "fiber": 8.8, "protein": 17.5, "sodium": 840, "salt": 2.10},
        "highlights": ["Non-Vegetarian", "3X Fiery Heat", "Zero Palm Oil", "High Protein (17.5g)", "Air-Dried"]
    },
    {
        "name": "WickedGüd Chilli Cheese Korean Instant Noodles",
        "brand": "WickedGüd",
        "sub": "Atta & Healthy Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Chilli Cheese Korean",
        "wt": "80 g",
        "price": 60,
        "veg": True,
        "desc": "Harmonious blend of real melted cheddar cheese and scorching Korean chilli flakes over healthy grains.",
        "ing": "Noodles: Whole Wheat, Lentils, Brown Rice, Salt. Seasoning: Real Cheddar Cheese Powder (12%), Korean Red Chilli, Milk Solids, Garlic, Sesame, Rock Salt.",
        "nut": {"calories": 405, "totalFat": 7.2, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 67.0, "sugars": 3.6, "addedSugars": 1.8, "fiber": 8.5, "protein": 15.5, "sodium": 780, "salt": 1.95},
        "highlights": ["Real Cheddar Cheese", "Zero Palm Oil", "Zero Maida", "Air-Dried"]
    },
    # Cup Noodles
    {
        "name": "WickedGüd Nourishing Masala Cup Noodles",
        "brand": "WickedGüd",
        "sub": "Cup & Bowl Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Nourishing Masala Cuppa",
        "wt": "65 g",
        "price": 65,
        "veg": True,
        "desc": "The first truly clean cup noodle in India: zero maida, zero palm oil, with freeze-dried veggies.",
        "ing": "Noodles: Whole Wheat, Moong Dal, Chickpea, Brown Rice, Salt. Seasoning & Veggies: Freeze-Dried Sweet Corn, Green Peas, Carrots, Indian Spices, Rock Salt, Sunflower Oil.",
        "nut": {"calories": 370, "totalFat": 4.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.8, "addedSugars": 1.0, "fiber": 9.2, "protein": 14.0, "sodium": 680, "salt": 1.70},
        "highlights": ["Zero Maida Cup", "Zero Palm Oil", "Freeze-Dried Veggies", "High Protein"]
    },
    {
        "name": "WickedGüd Instant Desi Manchow Cup Noodles",
        "brand": "WickedGüd",
        "sub": "Cup & Bowl Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Desi Manchow Cuppa",
        "wt": "65 g",
        "price": 65,
        "veg": True,
        "desc": "Clean-label spicy Chinese Manchow cup noodles with natural soy sauce and crispy air-dried toppings.",
        "ing": "Noodles: Whole Wheat, Lentils, Brown Rice, Salt. Seasoning: Naturally Brewed Soy Sauce Powder, Ginger, Garlic, White Pepper, Spring Onions, Rock Salt.",
        "nut": {"calories": 372, "totalFat": 4.6, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.2, "sugars": 2.5, "addedSugars": 1.0, "fiber": 9.0, "protein": 13.8, "sodium": 710, "salt": 1.78},
        "highlights": ["Desi Manchow Cup", "Zero Maida", "Zero Palm Oil", "Zero MSG"]
    },
    {
        "name": "WickedGüd Fiery 2X Spicy Korean Cup Noodles",
        "brand": "WickedGüd",
        "sub": "Cup & Bowl Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Fiery 2X Spicy Korean Cuppa",
        "wt": "70 g",
        "price": 75,
        "veg": True,
        "desc": "On-the-go Korean fire ramyun cup powered by multi-grain noodles and sesame gochugaru paste.",
        "ing": "Noodles: Whole Wheat, Lentils, Brown Rice. Korean Seasoning: Gochugaru, Sesame Oil, Garlic, Onion, Soy Sauce, Salt.",
        "nut": {"calories": 385, "totalFat": 5.2, "saturatedFat": 1.0, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 3.5, "addedSugars": 2.0, "fiber": 8.8, "protein": 14.5, "sodium": 780, "salt": 1.95},
        "highlights": ["Korean 2X Fire Cup", "Zero Palm Oil", "Air-Dried Grains"]
    },
    # Hakka Noodles
    {
        "name": "WickedGüd Classic Hakka Noodles (Multigrain / Air-Dried)",
        "brand": "WickedGüd",
        "sub": "Hakka & Flat Noodles",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Multigrain Hakka",
        "wt": "200 g",
        "price": 75,
        "veg": True,
        "desc": "Air-dried restaurant-style hakka noodles crafted from whole wheat, brown rice, and nutrient-dense lentils.",
        "ing": "Whole Wheat Flour (60%), Lentil Flour (Chickpea, Moong 25%), Brown Rice Flour (15%), Water, Salt.",
        "nut": {"calories": 355, "totalFat": 1.8, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 9.8, "protein": 15.0, "sodium": 280, "salt": 0.70},
        "highlights": ["Zero Maida (100% Multigrain)", "Zero Palm Oil", "High Protein (15g)", "High Fiber (9.8g)", "Air-Dried Non-Fried"]
    },
    # Multigrain Durum Wheat Pasta
    {
        "name": "WickedGüd Multigrain Durum Wheat Penne Pasta",
        "brand": "WickedGüd",
        "sub": "Instant Pasta",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Multigrain Penne",
        "wt": "250 g",
        "price": 99,
        "veg": True,
        "desc": "Artisanal Italian penne pasta made with 100% durum wheat semolina, red lentils, and chickpea flour.",
        "ing": "Durum Wheat Semolina (70%), Red Lentil Flour (15%), Chickpea Flour (15%), Water.",
        "nut": {"calories": 352, "totalFat": 1.5, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 16.0, "sodium": 40, "salt": 0.10},
        "highlights": ["100% Durum Wheat + Lentils", "Zero Maida", "High Protein (16g)", "Low Sodium"]
    },
    {
        "name": "WickedGüd Multigrain Durum Wheat Fusilli Pasta",
        "brand": "WickedGüd",
        "sub": "Instant Pasta",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Multigrain Fusilli",
        "wt": "250 g",
        "price": 99,
        "veg": True,
        "desc": "Spiral fusilli pasta engineered to hold maximum sauce, boosted with plant protein.",
        "ing": "Durum Wheat Semolina, Red Lentils, Chickpea, Water.",
        "nut": {"calories": 352, "totalFat": 1.5, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 16.0, "sodium": 40, "salt": 0.10},
        "highlights": ["Durum Wheat + Super Lentils", "High Protein (16g)", "Zero Maida"]
    },
    {
        "name": "WickedGüd Multigrain Durum Wheat Macaroni Pasta",
        "brand": "WickedGüd",
        "sub": "Instant Pasta",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Multigrain Macaroni",
        "wt": "250 g",
        "price": 99,
        "veg": True,
        "desc": "Elbow macaroni pasta enriched with pulses and whole grains for healthy mac & cheese.",
        "ing": "Durum Wheat Semolina, Lentil Flour, Water.",
        "nut": {"calories": 352, "totalFat": 1.5, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 16.0, "sodium": 40, "salt": 0.10},
        "highlights": ["High Protein Macaroni (16g)", "Zero Maida", "Low Sodium"]
    },
    {
        "name": "WickedGüd Multigrain Durum Wheat Spaghetti Pasta",
        "brand": "WickedGüd",
        "sub": "Instant Pasta",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Multigrain Spaghetti",
        "wt": "250 g",
        "price": 99,
        "veg": True,
        "desc": "Long golden spaghetti strands made from high-protein durum semolina and chickpea flour.",
        "ing": "Durum Wheat Semolina, Chickpea Flour, Red Lentil Flour, Water.",
        "nut": {"calories": 352, "totalFat": 1.5, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 16.0, "sodium": 40, "salt": 0.10},
        "highlights": ["High Protein Spaghetti (16g)", "Zero Maida", "Low Sodium"]
    },
    # Wraps
    {
        "name": "WickedGüd Whole Wheat Wraps & Rolls",
        "brand": "WickedGüd",
        "sub": "Heat & Eat Ready Meals",
        "mfr": "100PercentNourishment Pvt Ltd",
        "flavour": "Whole Wheat Tortilla Wraps",
        "wt": "240 g (6 Wraps)",
        "price": 120,
        "veg": True,
        "desc": "Super soft 8-inch tortilla wraps made with 100% whole wheat atta and cold-pressed sunflower oil. Zero trans fats.",
        "ing": "Whole Wheat Flour (Atta 75%), Water, Cold-Pressed Sunflower Oil, Wheat Gluten, Salt, Baking Powder.",
        "nut": {"calories": 285, "totalFat": 5.0, "saturatedFat": 0.9, "transFat": 0.0, "carbohydrates": 51.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 9.2, "sodium": 460, "salt": 1.15},
        "highlights": ["100% Whole Wheat Atta", "Zero Maida", "Cold-Pressed Sunflower Oil", "Soft & Pliable"]
    }
]

# ------------------------------------------------------------------------------
# 8. YU (Yu Foodlabs) - 17 Products
# ------------------------------------------------------------------------------
yu_products = [
    # Instant Cup Noodles & Ramen
    {
        "name": "Yu Zingy Cheese Instant Cup Noodles",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Zingy Cheese Cuppa",
        "wt": "75 g",
        "price": 75,
        "veg": True,
        "desc": "Chef-crafted instant cup noodles with real artisan cheddar cheese and freeze-dried jalapeños.",
        "ing": "Noodles: Refined Wheat Flour, Water, Rice Bran Oil, Salt. Sauce & Seasoning: Pure Cheddar Cheese Powder (18%), Milk Solids, Freeze-Dried Jalapeños, Corn Starch, Onion, Garlic, Salt.",
        "nut": {"calories": 420, "totalFat": 14.5, "saturatedFat": 6.8, "transFat": 0.05, "carbohydrates": 61.0, "sugars": 4.5, "addedSugars": 1.8, "fiber": 3.5, "protein": 11.2, "sodium": 820, "salt": 2.05},
        "highlights": ["Real Cheddar Cheese (18%)", "Zero Preservatives", "Rice Bran Oil", "High Protein (11.2g)"]
    },
    {
        "name": "Yu Chilli Chicken Instant Cup Noodles",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Chilli Chicken Cuppa",
        "wt": "75 g",
        "price": 85,
        "veg": False,
        "desc": "Authentic Desi Chinese Chilli Chicken cup noodles with freeze-dried juicy chicken breast chunks.",
        "ing": "Noodles: Refined Wheat Flour, Water, Rice Bran Oil, Salt. Gravy: Freeze-Dried Chicken Chunks (12%), Soy Sauce, Capsicum, Green Chilli, Garlic, Ginger, Salt, Corn Starch.",
        "nut": {"calories": 435, "totalFat": 15.0, "saturatedFat": 5.2, "transFat": 0.05, "carbohydrates": 59.5, "sugars": 3.8, "addedSugars": 1.5, "fiber": 3.2, "protein": 14.8, "sodium": 860, "salt": 2.15},
        "highlights": ["Non-Vegetarian", "Freeze-Dried Chicken (12%)", "High Protein (14.8g)", "Zero Preservatives"]
    },
    {
        "name": "Yu Butter Chicken Instant Cup Noodles",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Butter Chicken Cuppa",
        "wt": "75 g",
        "price": 85,
        "veg": False,
        "desc": "Rich Delhi style makhani gravy noodles featuring real chicken pieces, dairy butter, and kasuri methi.",
        "ing": "Noodles: Refined Wheat Flour, Rice Bran Oil, Salt. Sauce: Tomato Puree, Dairy Butter (8%), Freeze-Dried Chicken (10%), Cashew Paste, Kasuri Methi, Cream, Salt.",
        "nut": {"calories": 445, "totalFat": 16.5, "saturatedFat": 7.0, "transFat": 0.05, "carbohydrates": 59.0, "sugars": 4.8, "addedSugars": 2.0, "fiber": 3.0, "protein": 14.5, "sodium": 840, "salt": 2.10},
        "highlights": ["Non-Vegetarian", "Real Dairy Butter", "Tender Chicken", "Zero Preservatives"]
    },
    {
        "name": "Yu Chilli Manchurian Instant Cup Noodles",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Chilli Manchurian Cuppa",
        "wt": "75 g",
        "price": 75,
        "veg": True,
        "desc": "Dark, spicy ginger-garlic Manchurian gravy tossed with springy noodles and crisp cabbage.",
        "ing": "Noodles: Refined Wheat Flour, Rice Bran Oil, Salt. Seasoning: Soy Sauce, Garlic, Ginger, Spring Onion, Freeze-Dried Veggies, White Pepper, Salt.",
        "nut": {"calories": 418, "totalFat": 13.8, "saturatedFat": 4.8, "transFat": 0.05, "carbohydrates": 62.0, "sugars": 3.5, "addedSugars": 1.5, "fiber": 3.6, "protein": 10.5, "sodium": 850, "salt": 2.12},
        "highlights": ["Chilli Manchurian", "Zero Preservatives", "Rice Bran Oil"]
    },
    {
        "name": "Yu Red Hot Cheese Korean Cup Ramen",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Red Hot Cheese Korean Cuppa",
        "wt": "80 g",
        "price": 85,
        "veg": True,
        "desc": "Fiery Korean gochujang broth balanced with silky melted cheese powder.",
        "ing": "Noodles: Refined Wheat Flour, Rice Bran Oil, Salt. Sauce: Korean Red Chilli Paste, Cheddar Cheese Powder (12%), Garlic, Sesame Oil, Soy Sauce, Salt.",
        "nut": {"calories": 438, "totalFat": 15.8, "saturatedFat": 6.8, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 4.5, "addedSugars": 2.5, "fiber": 3.4, "protein": 11.5, "sodium": 890, "salt": 2.22},
        "highlights": ["Korean Red Hot Cheese", "Artisan Cheddar", "Zero Palm Oil"]
    },
    {
        "name": "Yu Creamy Hot Sauce Korean Ramen",
        "brand": "Yu",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Creamy Hot Sauce Korean (Buldak Carbonara Style)",
        "wt": "80 g",
        "price": 85,
        "veg": True,
        "desc": "Korean carbonara style ramen with rich dairy cream, parmesan notes, and spicy red pepper glaze.",
        "ing": "Noodles: Refined Wheat Flour, Rice Bran Oil, Salt. Sauce: Dairy Cream Powder (14%), Parmesan Cheese, Korean Red Chilli, Garlic, Parsley, Salt.",
        "nut": {"calories": 445, "totalFat": 16.8, "saturatedFat": 7.5, "transFat": 0.05, "carbohydrates": 61.0, "sugars": 4.8, "addedSugars": 2.2, "fiber": 3.2, "protein": 11.8, "sodium": 870, "salt": 2.18},
        "highlights": ["Creamy Korean Carbonara", "Dairy Cream & Parmesan", "Zero Palm Oil"]
    },
    # Hakka Noodles
    {
        "name": "Yu Veg Hakka Noodles Chowmein Style",
        "brand": "Yu",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Chowmein Style Hakka",
        "wt": "200 g",
        "price": 55,
        "veg": True,
        "desc": "100% steam-cooked and air-dried hakka noodles made with non-GMO wheat flour.",
        "ing": "Wheat Flour, Water, Sea Salt.",
        "nut": {"calories": 350, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 74.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 3.5, "protein": 11.0, "sodium": 320, "salt": 0.80},
        "highlights": ["Steam-Cooked & Air-Dried", "Zero Palm Oil", "Zero Preservatives"]
    },
    # Instant Pasta (Cups & Pouches)
    {
        "name": "Yu Three Cheese Instant Pasta Bowl",
        "brand": "Yu",
        "sub": "Instant Pasta",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Three Cheese (Cheddar, Mozzarella, Parmesan)",
        "wt": "70 g",
        "price": 80,
        "veg": True,
        "desc": "Durum wheat semolina fusilli in a decadent sauce made of pure Cheddar, Mozzarella, and Parmesan.",
        "ing": "Pasta: 100% Durum Wheat Semolina. Sauce: Real Cheese Blend (Cheddar, Mozzarella, Parmesan 22%), Milk Solids, Butter, Sea Salt, Black Pepper.",
        "nut": {"calories": 395, "totalFat": 10.5, "saturatedFat": 5.8, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 4.0, "addedSugars": 1.5, "fiber": 4.5, "protein": 14.5, "sodium": 680, "salt": 1.70},
        "highlights": ["3 Real Cheeses (22%)", "100% Durum Wheat", "High Protein (14.5g)", "Zero Maida"]
    },
    {
        "name": "Yu Peri Peri Instant Pasta Bowl",
        "brand": "Yu",
        "sub": "Instant Pasta",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Spicy Peri Peri Pasta",
        "wt": "70 g",
        "price": 80,
        "veg": True,
        "desc": "Zesty African bird's eye chilli and herbs tossed with durum semolina pasta and cream.",
        "ing": "Pasta: 100% Durum Wheat Semolina. Sauce: Tomato Powder, African Bird's Eye Chilli, Garlic, Oregano, Milk Solids, Olive Oil, Salt.",
        "nut": {"calories": 385, "totalFat": 8.0, "saturatedFat": 3.5, "transFat": 0.05, "carbohydrates": 64.0, "sugars": 4.5, "addedSugars": 2.0, "fiber": 4.8, "protein": 13.0, "sodium": 720, "salt": 1.80},
        "highlights": ["Spicy Peri Peri", "100% Durum Wheat", "Zero Maida"]
    },
    {
        "name": "Yu Creamy Tomato Instant Pasta Bowl",
        "brand": "Yu",
        "sub": "Instant Pasta",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Creamy Tomato Pink Sauce",
        "wt": "70 g",
        "price": 80,
        "veg": True,
        "desc": "Classic Italian Pink sauce blending sun-ripened tomatoes and rich dairy cream.",
        "ing": "Pasta: Durum Wheat Semolina. Sauce: Tomato Puree, Fresh Dairy Cream, Basil, Garlic, Parmesan Cheese, Olive Oil, Salt.",
        "nut": {"calories": 388, "totalFat": 8.8, "saturatedFat": 4.0, "transFat": 0.05, "carbohydrates": 63.5, "sugars": 5.0, "addedSugars": 2.2, "fiber": 4.5, "protein": 13.2, "sodium": 700, "salt": 1.75},
        "highlights": ["Pink Sauce (Tomato + Cream)", "100% Durum Wheat", "Zero Maida"]
    },
    {
        "name": "Yu Pink Sauce Wheat Penne Instant Pasta",
        "brand": "Yu",
        "sub": "Instant Pasta",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Whole Wheat Pink Sauce Penne",
        "wt": "75 g",
        "price": 85,
        "veg": True,
        "desc": "Whole wheat penne pasta enrobed in tomato cream sauce with fragrant Italian herbs.",
        "ing": "Pasta: Whole Wheat Semolina (100%). Sauce: Tomato, Cream, Herbs, Garlic, Salt.",
        "nut": {"calories": 378, "totalFat": 7.5, "saturatedFat": 3.2, "transFat": 0.05, "carbohydrates": 64.0, "sugars": 4.2, "addedSugars": 1.8, "fiber": 7.0, "protein": 14.0, "sodium": 680, "salt": 1.70},
        "highlights": ["100% Whole Wheat Penne", "High Fiber (7g)", "Zero Maida"]
    },
    # Ready-to-Eat Bowls / Instant Mixes
    {
        "name": "Yu Instant Veg Biryani Bowl",
        "brand": "Yu",
        "sub": "Heat & Eat Ready Meals",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Hyderabadi Veg Biryani",
        "wt": "80 g",
        "price": 99,
        "veg": True,
        "desc": "Authentic fragrant Basmati rice dum biryani ready in 4 minutes by just adding hot water.",
        "ing": "Dehydrated Basmati Rice (60%), Freeze-Dried Vegetables (Carrots, Beans, Peas 18%), Ghee, Fried Onions, Saffron, Biryani Spices (Cardamom, Clove, Cinnamon, Bay Leaf), Mint, Salt.",
        "nut": {"calories": 380, "totalFat": 8.5, "saturatedFat": 4.0, "transFat": 0.05, "carbohydrates": 68.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 4.5, "protein": 8.0, "sodium": 650, "salt": 1.62},
        "highlights": ["100% Pure Basmati Rice", "Pure Desi Ghee", "Freeze-Dried Veggies", "Zero Preservatives"]
    },
    {
        "name": "Yu Instant Rajma Chawal Bowl",
        "brand": "Yu",
        "sub": "Heat & Eat Ready Meals",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Punjabi Rajma Chawal",
        "wt": "80 g",
        "price": 99,
        "veg": True,
        "desc": "Comforting Punjabi kidney bean curry and Basmati rice. Just add boiling water and enjoy in 4 minutes.",
        "ing": "Dehydrated Basmati Rice (50%), Freeze-Dried Kashmiri Rajma (30%), Tomato Puree, Onion, Ginger, Garlic, Ghee, Cumin, Garam Masala, Salt.",
        "nut": {"calories": 375, "totalFat": 7.0, "saturatedFat": 2.8, "transFat": 0.05, "carbohydrates": 67.0, "sugars": 2.8, "addedSugars": 0.0, "fiber": 7.5, "protein": 11.5, "sodium": 680, "salt": 1.70},
        "highlights": ["Kashmiri Rajma & Basmati Rice", "High Protein (11.5g)", "High Fiber (7.5g)", "Desi Ghee"]
    },
    {
        "name": "Yu Instant Dal Makhani Rice Bowl",
        "brand": "Yu",
        "sub": "Heat & Eat Ready Meals",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Dal Makhani with Basmati Rice",
        "wt": "80 g",
        "price": 99,
        "veg": True,
        "desc": "Slow-cooked black lentils in butter and cream served over fluffy Basmati rice.",
        "ing": "Dehydrated Basmati Rice, Black Lentils (Urad Dal), Kidney Beans, Dairy Butter, Fresh Cream, Tomato, Spices, Salt.",
        "nut": {"calories": 395, "totalFat": 10.2, "saturatedFat": 5.2, "transFat": 0.05, "carbohydrates": 64.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 6.8, "protein": 11.8, "sodium": 690, "salt": 1.72},
        "highlights": ["Slow Cooked Black Lentils", "Real Dairy Butter & Cream", "Zero Preservatives"]
    },
    {
        "name": "Yu Instant Moong Dal Khichdi Bowl",
        "brand": "Yu",
        "sub": "Heat & Eat Ready Meals",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Homestyle Moong Dal Khichdi",
        "wt": "75 g",
        "price": 85,
        "veg": True,
        "desc": "Comforting homestyle khichdi tempered with pure cow ghee, cumin seeds, and asafoetida.",
        "ing": "Rice (50%), Yellow Moong Dal (35%), Pure Cow Ghee (8%), Cumin Seeds, Turmeric, Ginger, Asafoetida (Hing), Rock Salt.",
        "nut": {"calories": 365, "totalFat": 7.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 5.5, "protein": 12.0, "sodium": 580, "salt": 1.45},
        "highlights": ["Pure Cow Ghee", "Yellow Moong Dal (35%)", "Easy Digestibility", "Zero Preservatives"]
    },
    {
        "name": "Yu Instant Apple Cinnamon Oats Bowl",
        "brand": "Yu",
        "sub": "3-Minute Breakfast & Mixes",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Apple Cinnamon Oatmeal",
        "wt": "65 g",
        "price": 75,
        "veg": True,
        "desc": "Rolled oats with freeze-dried real apple pieces, Ceylon cinnamon, chia seeds, and raw brown sugar.",
        "ing": "Rolled Oats (70%), Freeze-Dried Apples (12%), Chia Seeds (6%), Ceylon Cinnamon Powder, Raw Cane Sugar, Milk Solids, Salt.",
        "nut": {"calories": 372, "totalFat": 6.5, "saturatedFat": 1.5, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 14.0, "addedSugars": 8.0, "fiber": 10.5, "protein": 12.5, "sodium": 120, "salt": 0.30},
        "highlights": ["100% Rolled Oats", "Real Freeze-Dried Apples", "Chia Seeds", "High Fiber (10.5g)"]
    },
    {
        "name": "Yu Instant Gajar Halwa Dessert Bowl",
        "brand": "Yu",
        "sub": "Instant Dessert & Sweet Mixes",
        "mfr": "Yu Foodlabs Pvt Ltd",
        "flavour": "Desi Ghee Gajar Halwa",
        "wt": "80 g",
        "price": 110,
        "veg": True,
        "desc": "Authentic winter dessert crafted from sweet red carrots, pure desi ghee, khoya, and crunchy cashews & almonds.",
        "ing": "Red Carrots (55%), Pure Desi Ghee (16%), Khoya / Mawa (Milk Solids 14%), Sugar, Almonds, Cashews, Cardamom.",
        "nut": {"calories": 420, "totalFat": 18.0, "saturatedFat": 10.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 38.0, "addedSugars": 28.0, "fiber": 4.0, "protein": 7.5, "sodium": 140, "salt": 0.35},
        "highlights": ["Pure Desi Ghee (16%)", "Real Khoya & Red Carrots", "Almonds & Cashews", "Zero Preservatives"]
    }
]

products.extend(wickedgud_products)
products.extend(yu_products)
print(f"Added WickedGüd & Yu: total now {len(products)}")

with open("scripts/data/phase4_noodles.json", "w") as f:
    json.dump(products, f, indent=2)

