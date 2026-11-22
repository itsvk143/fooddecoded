import json

with open("scripts/data/phase2_noodles.json", "r") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products from phase 2.")

# ------------------------------------------------------------------------------
# 6. KNORR (Hindustan Unilever) - 18 Products
# ------------------------------------------------------------------------------
knorr_products = [
    # Soupy Noodles
    {
        "name": "Knorr Mast Masala Soupy Noodles",
        "brand": "Knorr",
        "sub": "Instant Noodles",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Mast Masala Soupy",
        "wt": "70 g",
        "price": 15,
        "veg": True,
        "desc": "Combination of slurpy noodles and wholesome spicy vegetable soup made with 100% real vegetables.",
        "ing": "Noodles: Refined Wheat Flour (Maida), Edible Vegetable Oil (Palm Oil), Salt, Wheat Gluten. Soupy Tastemaker: Dehydrated Vegetables (Carrot, Leeks), Sugar, Salt, Hydrolysed Groundnut Protein, Spices & Condiments (Coriander, Cumin, Chilli, Black Pepper, Turmeric), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 430, "totalFat": 16.0, "saturatedFat": 7.2, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 4.5, "addedSugars": 3.0, "fiber": 3.5, "protein": 8.0, "sodium": 1280, "salt": 3.20},
        "highlights": ["Soupy Broth Noodles", "Refined Maida", "Contains Palm Oil", "High Sodium"]
    },
    {
        "name": "Knorr Hong Kong Manchow Noodle Soup",
        "brand": "Knorr",
        "sub": "Instant Noodles",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Hong Kong Manchow Soupy",
        "wt": "70 g",
        "price": 18,
        "veg": True,
        "desc": "Desi Chinese style manchow soupy noodles with soya sauce, ginger, garlic, and crunchy noodles.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Tastemaker: Soy Sauce Powder, Garlic, Ginger, Spring Onion, Salt, Sugar, Flavour Enhancers (INS 627, INS 631), Caramel Colour.",
        "nut": {"calories": 435, "totalFat": 16.2, "saturatedFat": 7.3, "transFat": 0.1, "carbohydrates": 63.8, "sugars": 4.2, "addedSugars": 2.8, "fiber": 3.2, "protein": 8.2, "sodium": 1320, "salt": 3.30},
        "highlights": ["Hong Kong Manchow", "High Sodium", "Contains Palm Oil"]
    },
    # Instant Cup-a-Soup (1-Minute)
    {
        "name": "Knorr Cup-a-Soup Mixed Vegetable",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Mixed Vegetable Cup-a-Soup",
        "wt": "11 g",
        "price": 15,
        "veg": True,
        "desc": "Instant 1-minute vegetable soup packed with crunchy croutons and dehydrated green peas, corn, and carrots.",
        "ing": "Refined Wheat Flour, Sugar, Salt, Croutons (15%), Dehydrated Vegetables (Carrot, Green Peas, Sweet Corn, Cabbage), Skimmed Milk Powder, Black Pepper, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 360, "totalFat": 6.5, "saturatedFat": 2.8, "transFat": 0.05, "carbohydrates": 68.0, "sugars": 16.5, "addedSugars": 13.0, "fiber": 4.2, "protein": 7.5, "sodium": 2800, "salt": 7.00},
        "highlights": ["1-Minute Instant Soup", "Includes Croutons", "High Sodium"]
    },
    {
        "name": "Knorr Cup-a-Soup Sweet Corn Veg",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Sweet Corn Veg Cup-a-Soup",
        "wt": "12 g",
        "price": 15,
        "veg": True,
        "desc": "Rich, creamy sweet corn soup that stirs up effortlessly in a mug within 60 seconds.",
        "ing": "Corn Flour, Freeze-Dried Sweet Corn (14%), Sugar, Salt, Dairy Whitener, Croutons, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 370, "totalFat": 7.0, "saturatedFat": 3.2, "transFat": 0.05, "carbohydrates": 70.0, "sugars": 18.0, "addedSugars": 14.5, "fiber": 3.8, "protein": 7.0, "sodium": 2650, "salt": 6.62},
        "highlights": ["1-Minute Mug Soup", "Freeze-Dried Sweet Corn", "High Sodium"]
    },
    {
        "name": "Knorr Cup-a-Soup Thick Tomato",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Thick Tomato Cup-a-Soup",
        "wt": "13 g",
        "price": 15,
        "veg": True,
        "desc": "Classic thick tomato soup with crispy croutons, black pepper, and hints of clove.",
        "ing": "Tomato Paste & Powder (26%), Sugar, Croutons (16%), Corn Starch, Salt, Spices, Citric Acid, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 365, "totalFat": 6.8, "saturatedFat": 2.9, "transFat": 0.05, "carbohydrates": 69.5, "sugars": 24.0, "addedSugars": 19.0, "fiber": 4.5, "protein": 6.8, "sodium": 2720, "salt": 6.80},
        "highlights": ["1-Minute Mug Soup", "Real Tomato (26%)", "High Added Sugar", "High Sodium"]
    },
    {
        "name": "Knorr Cup-a-Soup Hot & Sour Veg",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Hot & Sour Veg Cup-a-Soup",
        "wt": "11 g",
        "price": 15,
        "veg": True,
        "desc": "Zesty and spicy Chinese broth in a cup with vinegar tang and red chilli bite.",
        "ing": "Corn Starch, Sugar, Dehydrated Vegetables, Salt, Soy Sauce Powder, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 350, "totalFat": 5.5, "saturatedFat": 2.4, "transFat": 0.05, "carbohydrates": 68.5, "sugars": 17.0, "addedSugars": 14.0, "fiber": 3.6, "protein": 6.5, "sodium": 2900, "salt": 7.25},
        "highlights": ["1-Minute Mug Soup", "Spicy & Tangy", "Very High Sodium"]
    },
    {
        "name": "Knorr Cup-a-Soup Chicken Delite",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Chicken Delite Cup-a-Soup",
        "wt": "12 g",
        "price": 20,
        "veg": False,
        "desc": "Warm, savory chicken broth with real chicken shreds, cracked pepper, and croutons.",
        "ing": "Chicken Meat Powder & Dehydrated Shreds (10%), Croutons, Corn Flour, Onion, Garlic, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 375, "totalFat": 7.5, "saturatedFat": 3.4, "transFat": 0.05, "carbohydrates": 66.0, "sugars": 14.0, "addedSugars": 11.0, "fiber": 3.0, "protein": 11.0, "sodium": 2780, "salt": 6.95},
        "highlights": ["Non-Vegetarian", "Real Chicken Shreds", "1-Minute Mug Soup", "High Sodium"]
    },
    {
        "name": "Knorr Cup-a-Soup Spicy Korean Kimchi",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Spicy Korean Kimchi Cup-a-Soup",
        "wt": "12 g",
        "price": 20,
        "veg": True,
        "desc": "Fermented Korean kimchi and gochugaru pepper broth ready in a single minute.",
        "ing": "Fermented Cabbage Powder, Red Pepper Paste Powder, Corn Starch, Garlic, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 355, "totalFat": 6.0, "saturatedFat": 2.6, "transFat": 0.05, "carbohydrates": 67.5, "sugars": 16.0, "addedSugars": 13.0, "fiber": 3.8, "protein": 7.2, "sodium": 2850, "salt": 7.12},
        "highlights": ["Korean Kimchi Broth", "1-Minute Mug Soup", "High Sodium"]
    },
    # Cook-Up Classic & International Soups
    {
        "name": "Knorr Cook-Up Thick Tomato Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Thick Tomato Cook-Up",
        "wt": "53 g",
        "price": 60,
        "veg": True,
        "desc": "India's favorite 4-serve family cook-up tomato soup packed with ripe tomato pulp and croutons.",
        "ing": "Tomato Paste & Solids (24%), Sugar, Refined Wheat Flour, Bread Croutons (14%), Salt, Spices (Black Pepper, Cinnamon), Citric Acid.",
        "nut": {"calories": 348, "totalFat": 4.5, "saturatedFat": 1.8, "transFat": 0.05, "carbohydrates": 70.0, "sugars": 22.5, "addedSugars": 18.0, "fiber": 4.2, "protein": 6.8, "sodium": 1480, "salt": 3.70},
        "highlights": ["4-Serve Family Pack", "24% Tomato Solids", "Includes Croutons", "High Added Sugar"]
    },
    {
        "name": "Knorr Cook-Up Sweet Corn Veg Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Sweet Corn Veg Cook-Up",
        "wt": "43 g",
        "price": 60,
        "veg": True,
        "desc": "Traditional restaurant-style sweet corn soup prepared with tender American corn kernels.",
        "ing": "Corn Flour, Freeze-Dried Sweet Corn (12%), Sugar, Salt, Dehydrated Vegetables (Carrot, Cabbage), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 350, "totalFat": 2.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 74.0, "sugars": 17.0, "addedSugars": 13.5, "fiber": 3.6, "protein": 5.5, "sodium": 1420, "salt": 3.55},
        "highlights": ["American Sweet Corn", "Restaurant Style", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Sweet Corn Chicken Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Sweet Corn Chicken Cook-Up",
        "wt": "42 g",
        "price": 65,
        "veg": False,
        "desc": "Hearty chicken and sweet corn soup with real chicken bits and velvety egg flower texture.",
        "ing": "Corn Flour, Dehydrated Chicken Meat (8%), Sweet Corn (10%), Egg White Solids, Sugar, Salt, Black Pepper, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 360, "totalFat": 3.5, "saturatedFat": 1.2, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 15.0, "addedSugars": 12.0, "fiber": 3.2, "protein": 10.5, "sodium": 1490, "salt": 3.72},
        "highlights": ["Non-Vegetarian", "Real Chicken & Sweet Corn", "Egg White Solids", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Hot & Sour Veg Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Hot & Sour Veg Cook-Up",
        "wt": "43 g",
        "price": 60,
        "veg": True,
        "desc": "Spicy, peppery Chinese cook-up soup infused with black mushrooms, soya sauce, and vinegar.",
        "ing": "Corn Starch, Sugar, Salt, Soy Sauce Powder, Dehydrated Mushrooms, Carrots, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 335, "totalFat": 1.8, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 72.0, "sugars": 16.0, "addedSugars": 13.0, "fiber": 3.5, "protein": 5.2, "sodium": 1620, "salt": 4.05},
        "highlights": ["Spicy & Tangy", "Dehydrated Mushrooms", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Hot & Sour Chicken Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Hot & Sour Chicken Cook-Up",
        "wt": "43 g",
        "price": 65,
        "veg": False,
        "desc": "Chinese hot and sour soup loaded with real chicken meat pieces, black pepper, and soya glaze.",
        "ing": "Corn Starch, Dehydrated Chicken Bits (8%), Soy Sauce Powder, Sugar, Salt, Chilli, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 345, "totalFat": 2.8, "saturatedFat": 0.9, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 15.0, "addedSugars": 12.0, "fiber": 3.0, "protein": 9.8, "sodium": 1650, "salt": 4.12},
        "highlights": ["Non-Vegetarian", "Real Chicken Pieces", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Mixed Vegetable Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Mixed Vegetable Cook-Up",
        "wt": "45 g",
        "price": 60,
        "veg": True,
        "desc": "Clear, nutritious garden vegetable soup with carrots, leeks, onions, and cracked pepper.",
        "ing": "Refined Wheat Flour, Dehydrated Vegetables (Carrot, Leek, Onion, Cabbage), Salt, Sugar, Spices, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 330, "totalFat": 2.0, "saturatedFat": 0.6, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 14.0, "addedSugars": 11.0, "fiber": 4.5, "protein": 5.8, "sodium": 1460, "salt": 3.65},
        "highlights": ["Garden Vegetables", "Clear Soup", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Thai Vegetable Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Thai Vegetable Cook-Up",
        "wt": "45 g",
        "price": 65,
        "veg": True,
        "desc": "Fragrant Thai Tom Yum style vegetable soup with fresh notes of lemongrass and kaffir lime.",
        "ing": "Corn Starch, Lemongrass, Kaffir Lime, Galangal, Coconut Milk Powder, Red Chilli, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 345, "totalFat": 4.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 15.5, "addedSugars": 12.5, "fiber": 3.5, "protein": 5.2, "sodium": 1520, "salt": 3.80},
        "highlights": ["Thai Lemongrass & Lime", "Coconut Notes", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Italian Mushroom Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Italian Mushroom Cook-Up",
        "wt": "48 g",
        "price": 70,
        "veg": True,
        "desc": "Rich, creamy European style soup infused with sautéed button mushrooms and Italian herbs.",
        "ing": "Refined Wheat Flour, Dehydrated Mushroom Powder & Bits (12%), Milk Solids, Salt, Sugar, Black Pepper, Oregano, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 360, "totalFat": 5.2, "saturatedFat": 2.4, "transFat": 0.05, "carbohydrates": 68.0, "sugars": 14.0, "addedSugars": 10.0, "fiber": 4.0, "protein": 7.8, "sodium": 1440, "salt": 3.60},
        "highlights": ["European Style", "Real Button Mushrooms (12%)", "Creamy Broth"]
    },
    {
        "name": "Knorr Cook-Up Cream of Broccoli Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Cream of Broccoli Cook-Up",
        "wt": "48 g",
        "price": 70,
        "veg": True,
        "desc": "Velvety green soup crafted with real dehydrated broccoli florets and dairy cream.",
        "ing": "Refined Wheat Flour, Dehydrated Broccoli Bits & Powder (14%), Dairy Cream Powder, Milk Solids, Salt, Black Pepper, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 355, "totalFat": 5.0, "saturatedFat": 2.2, "transFat": 0.05, "carbohydrates": 67.5, "sugars": 13.5, "addedSugars": 9.5, "fiber": 5.2, "protein": 8.5, "sodium": 1410, "salt": 3.52},
        "highlights": ["Real Broccoli (14%)", "High Fiber (5.2g)", "Dairy Cream"]
    },
    {
        "name": "Knorr Cook-Up Mexican Tomato Corn Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Mexican Tomato Corn Cook-Up",
        "wt": "45 g",
        "price": 65,
        "veg": True,
        "desc": "Spicy Tex-Mex soup pairing ripe tomato purée with charred sweet corn and jalapeño pepper.",
        "ing": "Tomato Powder (20%), Sweet Corn (12%), Jalapeño Chilli, Corn Starch, Sugar, Salt, Cumin, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 345, "totalFat": 3.0, "saturatedFat": 0.9, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 18.0, "addedSugars": 14.0, "fiber": 4.5, "protein": 6.2, "sodium": 1490, "salt": 3.72},
        "highlights": ["Tex-Mex Jalapeño", "Charred Sweet Corn", "High Sodium"]
    },
    {
        "name": "Knorr Cook-Up Korean Kimchi Soup",
        "brand": "Knorr",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Korean Kimchi Cook-Up",
        "wt": "45 g",
        "price": 65,
        "veg": True,
        "desc": "Spicy Korean stew base prepared with fermented napa cabbage, garlic, and gochugaru.",
        "ing": "Fermented Kimchi Powder (16%), Red Pepper Paste, Garlic, Ginger, Corn Starch, Sugar, Salt, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 338, "totalFat": 2.2, "saturatedFat": 0.6, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 15.0, "addedSugars": 12.0, "fiber": 4.0, "protein": 6.5, "sodium": 1580, "salt": 3.95},
        "highlights": ["Korean Kimchi Stew", "High Sodium"]
    },
    # Ready-to-Cook Gravy Mixes
    {
        "name": "Knorr Chinese Manchurian Gravy Mix",
        "brand": "Knorr",
        "sub": "DIY Wok Kits & Stir-Fry Cooking Sauces",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Chinese Manchurian Gravy",
        "wt": "45 g",
        "price": 40,
        "veg": True,
        "desc": "Just add water and chopped veggies/paneer to make authentic Desi Chinese Manchurian in 5 minutes.",
        "ing": "Corn Starch, Sugar, Salt, Soy Sauce Powder, Garlic, Ginger, Coriander, Black Pepper, Caramel Colour (INS 150d), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 310, "totalFat": 1.0, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 18.0, "addedSugars": 15.0, "fiber": 2.8, "protein": 4.0, "sodium": 1850, "salt": 4.62},
        "highlights": ["5-Minute Gravy Mix", "Desi Chinese Manchurian", "Very High Sodium"]
    },
    {
        "name": "Knorr Chinese Chilli Gravy Mix",
        "brand": "Knorr",
        "sub": "DIY Wok Kits & Stir-Fry Cooking Sauces",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Chinese Chilli Gravy",
        "wt": "45 g",
        "price": 40,
        "veg": True,
        "desc": "Restaurant-style Chilli Paneer or Chilli Chicken cooking sauce mix with red chillies and soy sauce.",
        "ing": "Corn Starch, Red Chilli Powder, Soy Sauce Powder, Garlic, Salt, Sugar, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 315, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 70.5, "sugars": 17.5, "addedSugars": 14.5, "fiber": 3.0, "protein": 4.2, "sodium": 1890, "salt": 4.72},
        "highlights": ["Chilli Paneer Base", "Very High Sodium"]
    },
    {
        "name": "Knorr Chinese Schezwan Gravy Mix",
        "brand": "Knorr",
        "sub": "DIY Wok Kits & Stir-Fry Cooking Sauces",
        "mfr": "Hindustan Unilever Ltd",
        "flavour": "Chinese Schezwan Gravy",
        "wt": "45 g",
        "price": 40,
        "veg": True,
        "desc": "Fiery Schezwan gravy mix seasoned with crushed Sichuan peppercorns, roasted garlic, and chillies.",
        "ing": "Corn Starch, Red Chilli Flakes, Sichuan Peppercorns, Garlic, Ginger, Salt, Sugar, Soy Sauce Powder, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 318, "totalFat": 1.5, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 18.0, "addedSugars": 15.0, "fiber": 3.2, "protein": 4.4, "sodium": 1920, "salt": 4.80},
        "highlights": ["Fiery Schezwan Base", "Sichuan Peppercorns", "Very High Sodium"]
    }
]

products.extend(knorr_products)
print(f"Added Knorr: total now {len(products)}")

with open("scripts/data/phase3_noodles.json", "w") as f:
    json.dump(products, f, indent=2)

