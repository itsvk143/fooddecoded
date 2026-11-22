import json

def get_section4_part2():
    items = []

    # ----------------------------------------------------
    # 20. SNACKIBLE (LightSaber Food Ventures Pvt Ltd) - 14 items
    # ----------------------------------------------------
    snackible_variants = [
        ("Snackible Baked Ragi Chips (Peri Peri)", "Baked Chips", "Peri Peri", "Crisp baked chips crafted from finger millet (ragi) tossed with African peri peri.",
         "Ragi Flour (Finger Millet 55%), Rice Flour, Tapioca Starch, Sunflower Oil, Seasoning (Chilli, Garlic, Onion, Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 420, "totalFat": 12.0, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 2.5, "addedSugars": 1.2, "fiber": 9.2, "protein": 7.5, "sodium": 520, "salt": 1.30}),
        ("Snackible Baked Ragi Chips (Cream & Onion)", "Baked Chips", "Cream & Onion", "Healthy baked ragi crisps flavored with sour cream, chives, and sweet onion.",
         "Ragi Flour (55%), Rice Flour, Sunflower Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 425, "totalFat": 12.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 3.4, "addedSugars": 2.0, "fiber": 9.0, "protein": 7.8, "sodium": 490, "salt": 1.22}),
        ("Snackible Baked Ragi Chips (Pizza)", "Baked Chips", "Pizza Herb", "Whole grain ragi chips seasoned with sundried tomatoes, oregano, and dried cheese.",
         "Ragi Flour (55%), Rice Flour, Sunflower Oil, Seasoning (Tomato Powder, Cheese, Oregano, Basil, Salt, Sugar, Citric Acid).",
         {"calories": 422, "totalFat": 12.2, "saturatedFat": 2.3, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 3.0, "addedSugars": 1.8, "fiber": 9.1, "protein": 7.6, "sodium": 510, "salt": 1.28}),
        ("Snackible Baked Jowar Puffs (Cheese)", "Baked Chips", "Cheddar Cheese", "Popped sorghum millet puffs bathed in real cheddar cheese powder.",
         "Whole Jowar (Sorghum 72%), Sunflower Oil, Seasoning (Cheddar Cheese Powder (4.5%), Milk Solids, Salt, Sugar, Paprika (INS 160c)).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.8, "addedSugars": 1.2, "fiber": 10.5, "protein": 9.8, "sodium": 480, "salt": 1.20}),
        ("Snackible Baked Jowar Puffs (Masala)", "Baked Chips", "Indian Masala", "Crunchy roasted jowar puffs dusted with roasted cumin, coriander, and amchur.",
         "Whole Jowar (74%), Sunflower Oil, Seasoning (Spices (Chilli, Amchur, Cumin, Black Salt), Iodised Salt, Citric Acid (INS 330)).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 1.8, "addedSugars": 0.8, "fiber": 10.8, "protein": 10.0, "sodium": 540, "salt": 1.35}),
        ("Snackible Baked Jowar Puffs (Pudina)", "Baked Chips", "Garden Pudina", "Roasted sorghum puffs with cool dried mint leaves and rock salt.",
         "Whole Jowar (74%), Sunflower Oil, Seasoning (Mint Powder (3.0%), Dry Mango, Black Salt, Cumin, Salt).",
         {"calories": 428, "totalFat": 12.8, "saturatedFat": 2.1, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 11.0, "protein": 10.2, "sodium": 490, "salt": 1.22}),
        ("Snackible Roasted Nacho Chips (Salsa)", "Baked Chips", "Salsa Mexican", "Baked non-fried corn tortilla chips with Mexican salsa seasoning.",
         "Whole Corn (70%), Sunflower Oil, Seasoning (Tomato, Jalapeno, Garlic, Onion, Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 440, "totalFat": 14.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 2.5, "addedSugars": 1.5, "fiber": 6.5, "protein": 7.8, "sodium": 520, "salt": 1.30}),
        ("Snackible Quinoa Puffs (Fiery Spice)", "Baked Chips", "Fiery Spice", "Ancient grain quinoa puffs seasoned with red chilli and crushed peppercorns.",
         "Quinoa (35%), Rice, Jowar, Sunflower Oil, Seasoning (Chilli, Pepper, Garlic, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 438, "totalFat": 13.8, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 2.2, "addedSugars": 1.2, "fiber": 8.5, "protein": 10.5, "sodium": 550, "salt": 1.38}),
        ("Snackible Whole Wheat Waffle (Dark Chocolate)", "Healthy Bites", "Dark Chocolate Waffle", "Crispy toasted whole wheat waffle crisps filled with rich Belgian dark chocolate.",
         "Whole Wheat Flour (Atta 45%), Dark Chocolate (Sugar, Cocoa Solids 55%, Cocoa Butter, Emulsifier (INS 322)), Butter, Raw Brown Sugar, Salt.",
         {"calories": 490, "totalFat": 22.5, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 64.0, "sugars": 24.0, "addedSugars": 22.0, "fiber": 6.5, "protein": 8.0, "sodium": 180, "salt": 0.45}),
        ("Snackible Whole Wheat Waffle (Coffee)", "Healthy Bites", "Coffee Mocha", "Whole wheat waffle sandwiches with Arabica espresso infused dark chocolate ganache.",
         "Whole Wheat Flour (45%), Dark Chocolate, Coffee Extract (Arabica 2.5%), Butter, Raw Sugar, Salt.",
         {"calories": 488, "totalFat": 22.2, "saturatedFat": 11.8, "transFat": 0.05, "carbohydrates": 64.2, "sugars": 23.5, "addedSugars": 21.5, "fiber": 6.6, "protein": 8.1, "sodium": 175, "salt": 0.44}),
        ("Snackible Whole Wheat Waffle (Hazelnut Nutella-style)", "Healthy Bites", "Hazelnut Chocolate", "Crispy wheat waffle wafers layered with roasted hazelnut and cocoa spread.",
         "Whole Wheat Flour (44%), Roasted Hazelnut Paste (18%), Cocoa Powder, Milk Solids, Brown Sugar, Butter, Salt.",
         {"calories": 505, "totalFat": 25.0, "saturatedFat": 10.5, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 25.0, "addedSugars": 22.5, "fiber": 7.0, "protein": 9.2, "sodium": 160, "salt": 0.40}),
        ("Snackible Flavoured Makhana (Himalayan Cheese)", "Roasted Makhana", "Himalayan Cheese", "Gently popped foxnuts tossed in olive oil with Himalayan cheese seasoning.",
         "Foxnuts (Makhana 75%), Extra Virgin Olive Oil, Seasoning (Cheese Powder (4.2%), Milk Solids, Sea Salt, Paprika).",
         {"calories": 442, "totalFat": 14.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 2.0, "addedSugars": 0.5, "fiber": 9.5, "protein": 9.8, "sodium": 460, "salt": 1.15}),
        ("Snackible Berry Blast Energy Bites", "Healthy Bites", "Berry Energy Bites", "No-bake raw date, cranberry, blueberry, chia seed, and almond power balls.",
         "Dates (48%), Almonds (20%), Dried Cranberries (12%), Dried Blueberries (8%), Chia Seeds (6%), Raw Cacao, Coconut Oil.",
         {"calories": 395, "totalFat": 14.0, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 42.0, "addedSugars": 0.0, "fiber": 10.5, "protein": 8.5, "sodium": 45, "salt": 0.11}),
        ("Snackible Dipsters (Whole Wheat Lavash with Cheesy Dip)", "Baked Chips", "Lavash & Cheese", "On-the-go snack tub with baked multigrain lavash crackers and creamy jalapeno cheese dip.",
         "Lavash (Whole Wheat Flour 70%, Sesame, Olive Oil, Salt). Dip (Cheddar Cheese, Milk Solids, Jalapeno, Water, Salt, Lactic Acid).",
         {"calories": 410, "totalFat": 16.5, "saturatedFat": 7.5, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 3.2, "addedSugars": 1.0, "fiber": 6.8, "protein": 11.2, "sodium": 590, "salt": 1.48})
    ]
    for nm, scat, flav, dsc, ing, nut in snackible_variants:
        cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
        if scat in ["Healthy Bites"]:
            cat = "Wholesome Breakfast, Oats & Nut Butters"

        items.append({
            "brand": "Snackible", "name": nm, "cat": cat, "sub": scat, "type": "Clean-Label Baked Snacks",
            "mfr": "LightSaber Food Ventures Pvt Ltd", "flavour": flav, "wt": "55 g" if "Chips" in nm or "Puffs" in nm else "75 g", "price": 45 if "Chips" in nm else 70,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Baked Not Fried", "Zero Palm Oil", "High Dietary Fiber"]
        })

    # ----------------------------------------------------
    # 21. OPEN SECRET (ImBB Foods Pvt Ltd) - 10 items
    # ----------------------------------------------------
    opensecret_variants = [
        ("Open Secret Real Beetroot Veggie Chips", "Baked Chips", "Beetroot Crunch", "Vacuum-cooked genuine beetroot slices retaining vibrant ruby color, natural vitamins, and crunch.",
         "Beetroot (74%), Rice Bran Oil, Seasoning (Rock Salt, Black Pepper, Dry Mango Powder, Cumin).",
         {"calories": 430, "totalFat": 15.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 14.0, "addedSugars": 0.0, "fiber": 12.0, "protein": 6.8, "sodium": 390, "salt": 0.98}),
        ("Open Secret Real Pumpkin Veggie Chips", "Baked Chips", "Pumpkin Crunch", "Vacuum-fried fresh pumpkin chips with beta-carotene, roasted seeds, and sea salt.",
         "Pumpkin (74%), Rice Bran Oil, Seasoning (Rock Salt, Black Pepper, Paprika).",
         {"calories": 435, "totalFat": 15.5, "saturatedFat": 3.4, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 12.0, "addedSugars": 0.0, "fiber": 11.5, "protein": 6.5, "sodium": 380, "salt": 0.95}),
        ("Open Secret Real Spinach & Green Veggie Chips", "Baked Chips", "Spinach Crisp", "Crispy vacuum-cooked spinach and okra crisps with zero added artificial colours.",
         "Spinach & Okra (72%), Rice Bran Oil, Seasoning (Himalayan Pink Salt, Dry Mango, Cumin).",
         {"calories": 425, "totalFat": 14.5, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 6.5, "addedSugars": 0.0, "fiber": 14.0, "protein": 8.5, "sodium": 410, "salt": 1.02}),
        ("Open Secret Baked Ragi Chips (Cream & Onion)", "Baked Chips", "Cream & Onion", "Crunchy baked ragi crisps with cream, onion, and zero trans fat.",
         "Ragi (Finger Millet 52%), Rice Flour, Sunflower Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 422, "totalFat": 12.2, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 69.8, "sugars": 3.2, "addedSugars": 1.8, "fiber": 9.2, "protein": 7.8, "sodium": 490, "salt": 1.22}),
        ("Open Secret Baked Ragi Chips (Peri Peri)", "Baked Chips", "Peri Peri", "Baked ragi millet crisps tossed in spicy African bird's eye chilli.",
         "Ragi (52%), Rice Flour, Sunflower Oil, Seasoning (Chilli, Garlic, Onion, Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 424, "totalFat": 12.4, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 2.2, "addedSugars": 1.2, "fiber": 9.3, "protein": 7.7, "sodium": 520, "salt": 1.30}),
        ("Open Secret Baked Ragi Chips (Masala)", "Baked Chips", "Chatpata Masala", "Finger millet chips tossed in traditional Indian chaat masala.",
         "Ragi (52%), Rice Flour, Sunflower Oil, Seasoning (Cumin, Coriander, Chilli, Black Salt, Mango Powder, Salt).",
         {"calories": 420, "totalFat": 12.0, "saturatedFat": 2.3, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 2.0, "addedSugars": 1.0, "fiber": 9.5, "protein": 7.9, "sodium": 530, "salt": 1.32}),
        ("Open Secret Nutty Chips (Spicy Almond)", "Baked Chips", "Spicy Almond Chips", "Baked crisps fortified with roasted California almond flour and whole sesame seeds.",
         "Almond Flour (28%), Whole Wheat, Oats, Sesame Seeds (8%), Sunflower Oil, Spices, Sea Salt.",
         {"calories": 475, "totalFat": 23.5, "saturatedFat": 3.5, "transFat": 0.0, "carbohydrates": 51.0, "sugars": 3.0, "addedSugars": 1.0, "fiber": 9.8, "protein": 14.5, "sodium": 460, "salt": 1.15}),
        ("Open Secret Tandoori Nuts (Spiced Almonds & Cashews)", "Trail Mixes", "Tandoori Roasted", "Dry-roasted whole cashews and almonds coated in smoky tandoori marinade.",
         "Almonds (45%), Cashews (45%), Sunflower Oil (2%), Tandoori Spices (Cumin, Kasuri Methi, Coriander, Smoked Paprika), Rock Salt.",
         {"calories": 585, "totalFat": 46.0, "saturatedFat": 7.2, "transFat": 0.0, "carbohydrates": 22.0, "sugars": 5.0, "addedSugars": 0.0, "fiber": 9.0, "protein": 20.5, "sodium": 420, "salt": 1.05}),
        ("Open Secret 7-in-1 Superfood Dry Fruit & Seed Mix", "Trail Mixes", "Superfood Mix", "Raw and roasted mix of almonds, cashews, cranberries, blueberries, pumpkin, chia, and sunflower seeds.",
         "Almonds (20%), Cashews (15%), Cranberries (15%), Blueberries (10%), Pumpkin Seeds (15%), Sunflower Seeds (15%), Chia Seeds (10%).",
         {"calories": 515, "totalFat": 35.0, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 18.0, "addedSugars": 0.0, "fiber": 11.2, "protein": 17.5, "sodium": 60, "salt": 0.15}),
        ("Open Secret Dark Chocolate Almond Butter Spread", "Nut Butters", "Dark Chocolate Almond", "Clean-label stone-ground almond butter blended with 70% dark Belgian cocoa and zero palm oil.",
         "Roasted Almonds (72%), Dark Cocoa Powder (14%), Raw Organic Brown Sugar, Cocoa Butter, Sunflower Lecithin, Sea Salt.",
         {"calories": 560, "totalFat": 42.0, "saturatedFat": 7.8, "transFat": 0.0, "carbohydrates": 30.0, "sugars": 16.0, "addedSugars": 14.0, "fiber": 9.5, "protein": 17.8, "sodium": 95, "salt": 0.24})
    ]
    for nm, scat, flav, dsc, ing, nut in opensecret_variants:
        cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
        if scat in ["Trail Mixes"]:
            cat = "Dry Fruits, Nuts, Seeds & Trail Mixes"
        elif scat in ["Nut Butters"]:
            cat = "Wholesome Breakfast, Oats & Nut Butters"

        items.append({
            "brand": "Open Secret", "name": nm, "cat": cat, "sub": scat, "type": "Unjunked Healthy Snacks",
            "mfr": "ImBB Foods Pvt Ltd", "flavour": flav, "wt": "50 g" if "Chips" in nm else "150 g", "price": 49 if "Chips" in nm else 149,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Zero Maida Zero Palm Oil", "Real Veggies & Nuts", "High Plant Protein"]
        })

    # ----------------------------------------------------
    # 22. THE GREEN SNACK CO. (Green Snacks Pvt Ltd) - 10 items
    # ----------------------------------------------------
    greensnack_variants = [
        ("The Green Snack Co. Roasted Quinoa Puffs Peppy Cheese", "Baked Chips", "Peppy Cheese", "Crunchy roasted quinoa and millet puffs dusted with natural cheddar cheese.",
         "Quinoa (40%), Jowar (Sorghum 30%), Rice (15%), Olive Oil, Seasoning (Cheese Powder (4.0%), Milk Solids, Salt, Sugar, Paprika (INS 160c)).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 2.8, "addedSugars": 1.2, "fiber": 8.5, "protein": 10.5, "sodium": 480, "salt": 1.20}),
        ("The Green Snack Co. Roasted Quinoa Puffs Fiery Spice", "Baked Chips", "Fiery Spice", "Roasted quinoa puffs coated in crushed red chilli, garlic, and cumin.",
         "Quinoa (40%), Jowar (30%), Rice (15%), Olive Oil, Seasoning (Red Chilli, Garlic, Onion, Black Salt, Cumin, Citric Acid).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.0, "addedSugars": 1.0, "fiber": 8.8, "protein": 10.8, "sodium": 520, "salt": 1.30}),
        ("The Green Snack Co. Roasted Quinoa Puffs Saucy Tomato", "Baked Chips", "Saucy Tomato", "Popped quinoa snacks with sweet sun-ripened tomato powder and basil.",
         "Quinoa (40%), Jowar (30%), Rice (15%), Olive Oil, Seasoning (Tomato Powder (3.2%), Sugar, Salt, Basil, Acidity Regulator (INS 330)).",
         {"calories": 428, "totalFat": 12.8, "saturatedFat": 2.1, "transFat": 0.0, "carbohydrates": 68.8, "sugars": 4.5, "addedSugars": 3.2, "fiber": 8.6, "protein": 10.2, "sodium": 490, "salt": 1.22}),
        ("The Green Snack Co. Roasted Quinoa Puffs Sour Cream & Onion", "Baked Chips", "Sour Cream & Onion", "Airy quinoa puffs with smooth sour cream, sweet onion, and chives.",
         "Quinoa (40%), Jowar (30%), Rice (15%), Olive Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid).",
         {"calories": 432, "totalFat": 13.2, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 3.2, "addedSugars": 1.8, "fiber": 8.5, "protein": 10.4, "sodium": 470, "salt": 1.18}),
        ("The Green Snack Co. 6-Grain Stix Achari Masala", "Baked Chips", "Achari Masala", "Baked multigrain straws (ragi, oats, corn, rice, jowar, wheat) flavored with Indian mango pickle spices.",
         "6-Grain Flour (Ragi, Oats, Corn, Rice, Jowar, Wheat 72%), Olive Oil, Seasoning (Mustard, Fennel, Fenugreek, Red Chilli, Mango Powder, Salt, Turmeric).",
         {"calories": 445, "totalFat": 15.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 2.5, "addedSugars": 1.0, "fiber": 9.5, "protein": 11.2, "sodium": 560, "salt": 1.40}),
        ("The Green Snack Co. 6-Grain Stix Tangy Salsa", "Baked Chips", "Tangy Salsa", "Crispy 6-grain straws with Mexican tomato, coriander, and jalapeno seasoning.",
         "6-Grain Flour (72%), Olive Oil, Seasoning (Tomato, Coriander, Jalapeno, Garlic, Onion, Salt, Sugar, Citric Acid).",
         {"calories": 442, "totalFat": 14.8, "saturatedFat": 2.7, "transFat": 0.0, "carbohydrates": 66.5, "sugars": 3.0, "addedSugars": 1.5, "fiber": 9.4, "protein": 11.0, "sodium": 530, "salt": 1.32}),
        ("The Green Snack Co. Crispy Kale Crisps Cheese & Onion", "Baked Chips", "Cheese & Onion Kale", "Dehydrated organic whole curly kale leaves seasoned with cashew cheese and onion.",
         "Fresh Curly Kale (68%), Cashew Nut Paste (16%), Nutritional Yeast, Onion Powder, Sunflower Oil, Sea Salt, Lemon Juice.",
         {"calories": 395, "totalFat": 18.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 42.0, "sugars": 6.5, "addedSugars": 0.0, "fiber": 14.5, "protein": 16.5, "sodium": 420, "salt": 1.05}),
        ("The Green Snack Co. Crispy Kale Crisps Sea Salt", "Baked Chips", "Sea Salt Kale", "Low-temperature slow-dried whole curly kale leaves tossed with cold-pressed oil and sea salt.",
         "Fresh Curly Kale (82%), Cold-Pressed Sunflower Oil (10%), Sea Salt (2.0%), Nutritional Yeast (6%).",
         {"calories": 375, "totalFat": 15.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 43.5, "sugars": 4.0, "addedSugars": 0.0, "fiber": 16.0, "protein": 15.8, "sodium": 390, "salt": 0.98}),
        ("The Green Snack Co. Ghee-Roasted Makhanas (Himalayan Salt)", "Roasted Makhana", "Himalayan Pink Salt", "Foxnuts slow roasted in 100% pure desi cow ghee and dusted with Himalayan pink salt.",
         "Foxnuts (Makhana 82%), Pure Desi Cow Ghee (14%), Himalayan Pink Rock Salt (2.2%), Black Pepper.",
         {"calories": 465, "totalFat": 18.5, "saturatedFat": 11.2, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 9.0, "protein": 10.5, "sodium": 380, "salt": 0.95}),
        ("The Green Snack Co. Roasted Supergrain Namkeen Mix", "Baked Chips", "Supergrain Mix", "Zero-guilt mixture of roasted quinoa, puffed millets, watermelon seeds, and almonds.",
         "Puffed Quinoa (25%), Puffed Jowar (25%), Puffed Bajra (20%), Roasted Watermelon Seeds (15%), Almonds (10%), Sunflower Oil (3%), Sendha Namak, Amchur, Cumin.",
         {"calories": 455, "totalFat": 18.0, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 11.0, "protein": 14.8, "sodium": 410, "salt": 1.02})
    ]
    for nm, scat, flav, dsc, ing, nut in greensnack_variants:
        items.append({
            "brand": "The Green Snack Co.", "name": nm, "cat": "Baked Chips, Makhana & Unjunked Indian Snacks", "sub": scat, "type": "Clean Superfood Snacks",
            "mfr": "Green Snacks Pvt Ltd", "flavour": flav, "wt": "40 g", "price": 45 if "Kale" not in nm else 99,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Superfood Ingredients", "Never Deep Fried", "Gluten Free & Vegan" if "Cheese" not in nm and "Ghee" not in nm else "Vegetarian"]
        })

    # ----------------------------------------------------
    # 23. LET'S TRY (Earth Crust Pvt Ltd) - 15 items
    # ----------------------------------------------------
    letstry_variants = [
        ("Let's Try 100% Groundnut Oil Potato Chips (Classic Salted)", "Baked Chips", "Classic Salted", "Artisanal thin potato chips cooked purely in 100% cold-pressed groundnut oil with rock salt.",
         "Fresh Potatoes (68%), 100% Cold-Pressed Groundnut Oil (Peanut Oil 29%), Rock Salt (Sendha Namak 1.5%).",
         {"calories": 525, "totalFat": 29.5, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 57.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 4.2, "protein": 7.2, "sodium": 460, "salt": 1.15}),
        ("Let's Try 100% Groundnut Oil Potato Chips (Cream & Onion)", "Baked Chips", "Cream & Onion", "Groundnut oil fried potato chips with creamy sweet onion and parsley.",
         "Potatoes (64%), Cold-Pressed Groundnut Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 530, "totalFat": 30.0, "saturatedFat": 6.0, "transFat": 0.0, "carbohydrates": 57.0, "sugars": 3.0, "addedSugars": 1.8, "fiber": 4.0, "protein": 7.0, "sodium": 520, "salt": 1.30}),
        ("Let's Try 100% Groundnut Oil Potato Chips (Peri Peri)", "Baked Chips", "Peri Peri", "Groundnut oil potato chips dusted with crushed red bird's eye chilli and lemon zest.",
         "Potatoes (64%), Cold-Pressed Groundnut Oil, Seasoning (Red Chilli, Garlic, Onion, Black Pepper, Salt, Sugar, Citric Acid).",
         {"calories": 528, "totalFat": 29.8, "saturatedFat": 5.9, "transFat": 0.0, "carbohydrates": 57.2, "sugars": 2.2, "addedSugars": 1.2, "fiber": 4.1, "protein": 7.1, "sodium": 560, "salt": 1.40}),
        ("Let's Try 100% Groundnut Oil Potato Chips (Pudina)", "Baked Chips", "Pudina", "Groundnut oil potato chips flavored with natural dried mint and roasted cumin.",
         "Potatoes (64%), Cold-Pressed Groundnut Oil, Seasoning (Mint Powder (3.0%), Dry Mango, Black Salt, Cumin, Salt).",
         {"calories": 526, "totalFat": 29.6, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 57.4, "sugars": 1.8, "addedSugars": 0.8, "fiber": 4.2, "protein": 7.1, "sodium": 540, "salt": 1.35}),
        ("Let's Try 100% Groundnut Oil Banana Chips (Salted)", "Baked Chips", "Banana Chips", "Crisp Nendran banana wafers kettle-fried in pure cold-pressed groundnut oil and rock salt.",
         "Raw Banana (68%), Cold-Pressed Groundnut Oil (28%), Rock Salt (Sendha Namak 1.8%), Turmeric.",
         {"calories": 515, "totalFat": 28.0, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.2, "protein": 4.2, "sodium": 420, "salt": 1.05}),
        ("Let's Try 100% Groundnut Oil Tapioca Chips (Mari)", "Baked Chips", "Tapioca Chips", "Thinly sliced cassava root fried in groundnut oil and seasoned with crushed black pepper.",
         "Tapioca (Cassava 66%), Cold-Pressed Groundnut Oil (28%), Black Pepper (2.0%), Sendha Namak.",
         {"calories": 505, "totalFat": 26.5, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 4.8, "protein": 2.8, "sodium": 440, "salt": 1.10}),
        ("Let's Try Roasted Ragi Puffs (Cheese)", "Baked Chips", "Ragi Cheese Puffs", "Popped finger millet puffs seasoned with cheddar cheese and groundnut oil tempering.",
         "Ragi (Finger Millet 60%), Rice, Groundnut Oil, Seasoning (Cheese Powder (4.0%), Salt, Sugar).",
         {"calories": 425, "totalFat": 12.5, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 2.5, "addedSugars": 1.0, "fiber": 9.5, "protein": 8.5, "sodium": 470, "salt": 1.18}),
        ("Let's Try Roasted Jowar Puffs (Masala)", "Baked Chips", "Jowar Masala Puffs", "Roasted white sorghum puffs tossed in cold-pressed oil and chatpata spices.",
         "Jowar (Sorghum 72%), Groundnut Oil, Seasoning (Coriander, Cumin, Red Chilli, Amchur, Black Salt, Salt).",
         {"calories": 420, "totalFat": 12.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 1.8, "addedSugars": 0.6, "fiber": 10.2, "protein": 9.8, "sodium": 490, "salt": 1.22}),
        ("Let's Try Corn Rings (Tangy Tomato)", "Baked Chips", "Tomato Rings", "Zero palm oil crunchy corn rings seasoned with dehydrated tomato and amchur.",
         "Corn Meal (65%), Rice Flour, Groundnut Oil, Seasoning (Tomato (3.2%), Sugar, Salt, Citric Acid).",
         {"calories": 440, "totalFat": 14.5, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 4.5, "addedSugars": 3.0, "fiber": 4.5, "protein": 6.8, "sodium": 520, "salt": 1.30}),
        ("Let's Try Soya Sticks (Chatpata Masala)", "Baked Chips", "Soya Sticks", "High-protein extruded soya and tapioca straws fried in groundnut oil and tossed in chaat masala.",
         "Defatted Soya Flour (45%), Tapioca Starch, Groundnut Oil, Spices (Chilli, Dry Mango, Black Salt, Cumin), Salt.",
         {"calories": 470, "totalFat": 20.0, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 2.0, "addedSugars": 0.8, "fiber": 7.5, "protein": 18.5, "sodium": 580, "salt": 1.45}),
        ("Let's Try Garlic Bhujia (Groundnut Oil)", "Unjunked Indian Snacks", "Garlic Bhujia", "Traditional besan bhujia cooked in 100% peanut oil with intense roasted garlic flavor.",
         "Moth Dal Flour (40%), Gram Flour (Besan 25%), Cold-Pressed Groundnut Oil (28%), Garlic Paste (4.5%), Red Chilli, Salt, Spices.",
         {"calories": 545, "totalFat": 34.0, "saturatedFat": 6.8, "transFat": 0.0, "carbohydrates": 44.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 6.0, "protein": 14.5, "sodium": 680, "salt": 1.70}),
        ("Let's Try Salted Moong Dal (Groundnut Oil)", "Unjunked Indian Snacks", "Moong Dal", "Golden yellow moong pulses fried in cold-pressed groundnut oil and rock salt.",
         "Yellow Moong Lentils (72%), Cold-Pressed Groundnut Oil (24%), Sendha Namak (Rock Salt 1.8%).",
         {"calories": 465, "totalFat": 19.5, "saturatedFat": 4.0, "transFat": 0.0, "carbohydrates": 51.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 8.2, "protein": 21.0, "sodium": 480, "salt": 1.20}),
        ("Let's Try Sabudana Chivda (Fasting Mix)", "Unjunked Indian Snacks", "Sabudana Chivda", "Upvas namkeen mix of puffed sago pearls, peanuts, and rock salt in groundnut oil.",
         "Sago (Sabudana 52%), Roasted Peanuts (25%), Cold-Pressed Groundnut Oil, Sugar, Sendha Namak, Green Chilli, Curry Leaves.",
         {"calories": 490, "totalFat": 22.0, "saturatedFat": 4.5, "transFat": 0.0, "carbohydrates": 63.5, "sugars": 6.5, "addedSugars": 5.0, "fiber": 4.2, "protein": 8.5, "sodium": 440, "salt": 1.10}),
        ("Let's Try Farali Mixture (Groundnut Oil)", "Unjunked Indian Snacks", "Farali Mixture", "Crisp fasting farsan of potato laccha, peanuts, cashews, and sago fried in cold-pressed peanut oil.",
         "Potato (42%), Peanuts (22%), Sago (14%), Cold-Pressed Groundnut Oil, Cashews (5%), Rock Salt, Sugar, Red Chilli.",
         {"calories": 525, "totalFat": 29.5, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 6.0, "addedSugars": 4.8, "fiber": 4.0, "protein": 9.2, "sodium": 460, "salt": 1.15}),
        ("Let's Try Roasted Makhana (Salt & Pepper)", "Roasted Makhana", "Salt & Pepper Makhana", "Jumbo phool makhana slow-roasted in cold-pressed groundnut oil with rock salt and crushed black pepper.",
         "Foxnuts (Makhana 80%), Cold-Pressed Groundnut Oil (12%), Black Pepper (2.5%), Sendha Namak (1.8%).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 9.5, "protein": 9.8, "sodium": 390, "salt": 0.98})
    ]
    for nm, scat, flav, dsc, ing, nut in letstry_variants:
        items.append({
            "brand": "Let's Try", "name": nm, "cat": "Baked Chips, Makhana & Unjunked Indian Snacks", "sub": scat, "type": "100% Groundnut Oil Snacks",
            "mfr": "Earth Crust Pvt Ltd", "flavour": flav, "wt": "70 g", "price": 45 if "Chips" in nm else 65,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Cold-Pressed Groundnut Oil", "Zero Palm Oil", "Rock Salt (Sendha Namak)", "No Preservatives"]
        })

    # ----------------------------------------------------
    # 24. SNAQARY (Snaqary Foods Pvt Ltd) - 8 items
    # ----------------------------------------------------
    snaqary_variants = [
        ("Snaqary Jowar Cheese Balls", "Baked Chips", "Jowar Cheese", "Wholesome roasted sorghum puffs baked with cheddar cheese and herbs.",
         "Jowar Flour (Sorghum 68%), Rice Flour, Sunflower Oil, Seasoning (Cheddar Cheese Powder (4.2%), Milk Solids, Salt, Sugar, Natural Color (INS 160c)).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 3.0, "addedSugars": 1.5, "fiber": 10.0, "protein": 9.8, "sodium": 460, "salt": 1.15}),
        ("Snaqary Jowar Puffs (Peri Peri)", "Baked Chips", "Peri Peri Jowar", "Roasted sorghum millet puffs with spicy peri peri seasoning.",
         "Jowar (72%), Rice, Sunflower Oil, Seasoning (Chilli, Garlic, Onion, Salt, Sugar, Citric Acid).",
         {"calories": 425, "totalFat": 12.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 68.8, "sugars": 2.0, "addedSugars": 1.0, "fiber": 10.2, "protein": 9.9, "sodium": 490, "salt": 1.22}),
        ("Snaqary Jowar Puffs (Tangy Tomato)", "Baked Chips", "Tangy Tomato Jowar", "Popped whole jowar puffs glazed with sweet and sour tomato seasoning.",
         "Jowar (72%), Sunflower Oil, Seasoning (Tomato Powder (3.2%), Sugar, Salt, Acidity Regulator (INS 330)).",
         {"calories": 422, "totalFat": 12.2, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 4.5, "addedSugars": 3.2, "fiber": 10.0, "protein": 9.6, "sodium": 470, "salt": 1.18}),
        ("Snaqary Jowar Puffs (Cream & Onion)", "Baked Chips", "Cream & Onion Jowar", "Airy sorghum puffs seasoned with sour cream, chives, and sweet onion.",
         "Jowar (70%), Sunflower Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid).",
         {"calories": 428, "totalFat": 12.8, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 3.2, "addedSugars": 1.8, "fiber": 9.8, "protein": 9.7, "sodium": 460, "salt": 1.15}),
        ("Snaqary Multigrain Roasted Sticks", "Baked Chips", "Multigrain Sticks", "Roasted straws made with ragi, bajra, jowar, and whole wheat with mild spices.",
         "Multigrain Flour (Ragi, Bajra, Jowar, Whole Wheat 75%), Sunflower Oil, Seasoning (Spices, Salt, Amchur).",
         {"calories": 440, "totalFat": 14.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 66.5, "sugars": 2.0, "addedSugars": 0.8, "fiber": 11.5, "protein": 11.2, "sodium": 510, "salt": 1.28}),
        ("Snaqary Roasted Methi Khakhra Crisps", "Unjunked Indian Snacks", "Methi Khakhra", "Bite-sized roasted whole wheat and fenugreek khakhra chips with minimal cold-pressed oil.",
         "Whole Wheat Flour (Atta 82%), Cold-Pressed Oil, Dried Fenugreek (Methi 3.5%), Salt, Turmeric, Ajwain.",
         {"calories": 445, "totalFat": 15.0, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 9.5, "protein": 11.8, "sodium": 480, "salt": 1.20}),
        ("Snaqary Roasted Millet Bhel", "Unjunked Indian Snacks", "Millet Bhel", "Healthy Indian bhel made of popped jowar, bajra, and brown rice with roasted peanuts.",
         "Popped Millets (Jowar, Bajra 65%), Roasted Peanuts (15%), Sunflower Oil, Salt, Dry Mango, Cumin, Green Chilli.",
         {"calories": 445, "totalFat": 16.0, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 9.8, "protein": 11.0, "sodium": 520, "salt": 1.30}),
        ("Snaqary Roasted Chana & Peanuts Mix", "Unjunked Indian Snacks", "Chana & Peanuts", "Dry-roasted whole Bengal gram and peanuts seasoned with rock salt and black pepper.",
         "Roasted Bengal Gram (Chana 55%), Roasted Peanuts (40%), Sunflower Oil (2%), Rock Salt, Black Pepper.",
         {"calories": 480, "totalFat": 22.0, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 12.0, "protein": 22.5, "sodium": 410, "salt": 1.02})
    ]
    for nm, scat, flav, dsc, ing, nut in snaqary_variants:
        items.append({
            "brand": "Snaqary", "name": nm, "cat": "Baked Chips, Makhana & Unjunked Indian Snacks", "sub": scat, "type": "Roasted Millet Snacks",
            "mfr": "Snaqary Foods Pvt Ltd", "flavour": flav, "wt": "60 g", "price": 40,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Made with Ancient Millets", "Roasted Never Fried", "Rich in Fiber", "Zero Trans Fat"]
        })

    return items

print("Section 4 part 2 written successfully.")
