import json

def get_section5():
    items = []

    # ----------------------------------------------------
    # 25. BEYOND SNACK (Dr. Jackfruit India Pvt Ltd) - 3 items
    # ----------------------------------------------------
    beyond_snack_variants = [
        ("Beyond Snack Kerala Banana Chips Desi Masala", "Banana Chips", "Desi Masala", "Thin cut crispy Nendran banana chips seasoned with a proprietary 12-spice Indian masala blend.",
         "Raw Nendran Banana (68%), Refined Sunflower Oil (28%), Seasoning (Spices (Chilli, Cumin, Coriander, Amchur), Rock Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 530, "totalFat": 30.5, "saturatedFat": 4.5, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 2.0, "addedSugars": 1.0, "fiber": 5.2, "protein": 3.8, "sodium": 520, "salt": 1.30}),
        ("Beyond Snack Vibe Extra Long Banana Chips (Original Salted)", "Banana Chips", "Extra Long Salted", "Vertically sliced extra-long crisp Nendran plantain strips with pure rock salt.",
         "Selected Long Nendran Bananas (70%), Refined Vegetable Oil (27%), Rock Salt (Sendha Namak 1.8%), Turmeric.",
         {"calories": 525, "totalFat": 29.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 5.5, "protein": 3.9, "sodium": 480, "salt": 1.20}),
        ("Beyond Snack Zero Palm Oil Banana Chips (Sea Salt)", "Banana Chips", "Zero Palm Oil Sea Salt", "Clean-label minimalist banana chips fried in cold-pressed oil with zero palm oil and Atlantic sea salt.",
         "Raw Nendran Banana (72%), Cold-Pressed Sunflower Oil (26%), Natural Sea Salt (1.5%).",
         {"calories": 515, "totalFat": 28.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.8, "protein": 4.0, "sodium": 440, "salt": 1.10})
    ]
    for nm, scat, flav, dsc, ing, nut in beyond_snack_variants:
        items.append({
            "brand": "Beyond Snack", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Kerala Banana Chips",
            "mfr": "Dr. Jackfruit India Pvt Ltd", "flavour": flav, "wt": "85 g", "price": 60,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Authentic Nendran Bananas", "Zero Palm Oil", "Ultra Thin Precision Cut"]
        })

    # ----------------------------------------------------
    # 26. NOICE (Swiggy Instamart House Brand - Bundl Technologies) - 11 items
    # ----------------------------------------------------
    noice_variants = [
        ("Noice Kerala Nendran Banana Chips (Classic Salted)", "Banana Chips", "Classic Salted", "Authentic golden sliced Kerala plantain chips fried in pure coconut oil and sea salt.",
         "Raw Nendran Banana (68%), Pure Coconut Oil (28%), Iodised Salt (1.8%), Turmeric.",
         {"calories": 535, "totalFat": 31.0, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 60.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.2, "protein": 4.0, "sodium": 490, "salt": 1.22}),
        ("Noice Kerala Nendran Banana Chips (Black Pepper)", "Banana Chips", "Black Pepper", "Crisp Nendran banana wafers with Malabar black pepper and rock salt.",
         "Raw Nendran Banana (68%), Coconut Oil, Crushed Black Pepper (2.2%), Rock Salt.",
         {"calories": 532, "totalFat": 30.8, "saturatedFat": 24.2, "transFat": 0.0, "carbohydrates": 60.2, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.4, "protein": 4.1, "sodium": 480, "salt": 1.20}),
        ("Noice Kerala Nendran Banana Chips (Peri Peri)", "Banana Chips", "Peri Peri", "Crisp plantain chips tossed with zesty African peri peri spices.",
         "Raw Banana (68%), Vegetable Oil, Seasoning (Chilli, Garlic, Onion, Salt, Sugar, Citric Acid).",
         {"calories": 538, "totalFat": 31.2, "saturatedFat": 13.5, "transFat": 0.05, "carbohydrates": 59.8, "sugars": 2.2, "addedSugars": 1.2, "fiber": 5.2, "protein": 4.0, "sodium": 540, "salt": 1.35}),
        ("Noice Spicy Tapioca Chips", "Banana Chips", "Spicy Tapioca", "Thinly sliced cassava roots deep fried with red chilli powder and salt.",
         "Tapioca (66%), Vegetable Oil, Red Chilli, Salt, Asafoetida.",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 62.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 4.5, "protein": 2.6, "sodium": 580, "salt": 1.45}),
        ("Noice Potato Wafers (Classic Salted)", "Chips", "Salted Wafers", "Thin golden potato wafers salted with fine table salt.",
         "Potatoes (64%), Palmolein Oil, Salt (1.5%).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Noice Potato Wafers (Masala Masti)", "Chips", "Masala Masti", "Crunchy potato wafers seasoned with tangy amchur, cumin, and red chilli.",
         "Potatoes (62%), Palmolein Oil, Seasoning (Chilli, Amchur, Cumin, Black Salt, Salt).",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 54.5, "sugars": 2.0, "addedSugars": 1.2, "fiber": 3.4, "protein": 6.4, "sodium": 780, "salt": 1.95}),
        ("Noice Crispy Methi Khakhra", "Mixture & Namkeen", "Methi Khakhra", "Handmade whole wheat roasted crackers with dried fenugreek leaves.",
         "Whole Wheat Flour (80%), Cottonseed Oil, Fenugreek Leaves (3.5%), Salt, Turmeric, Ajwain.",
         {"calories": 465, "totalFat": 18.0, "saturatedFat": 6.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 11.5, "sodium": 520, "salt": 1.30}),
        ("Noice Crispy Masala Khakhra", "Mixture & Namkeen", "Masala Khakhra", "Roasted whole wheat flat crisps with spicy red chilli and ajwain seasoning.",
         "Whole Wheat Flour (78%), Vegetable Oil, Spices (Chilli, Turmeric, Ajwain), Salt.",
         {"calories": 468, "totalFat": 18.2, "saturatedFat": 6.5, "transFat": 0.0, "carbohydrates": 63.8, "sugars": 1.4, "addedSugars": 0.0, "fiber": 8.4, "protein": 11.4, "sodium": 540, "salt": 1.35}),
        ("Noice Chatpata Soya Sticks", "Mixture & Namkeen", "Soya Sticks", "Crunchy soya flour sticks dusted with tangy Indian chaat masala.",
         "Defatted Soya Flour (44%), Tapioca Starch, Vegetable Oil, Spices, Salt, Citric Acid.",
         {"calories": 475, "totalFat": 21.0, "saturatedFat": 9.2, "transFat": 0.0, "carbohydrates": 53.5, "sugars": 2.2, "addedSugars": 1.0, "fiber": 7.0, "protein": 18.0, "sodium": 610, "salt": 1.52}),
        ("Noice Authentic Mini Bhakarwadi", "Mixture & Namkeen", "Mini Bhakarwadi", "Crispy rolled pastry stuffed with spicy coconut, sesame, and coriander filling.",
         "Wheat Flour, Gram Flour, Vegetable Oil, Coconut, Sesame Seeds, Sugar, Salt, Spices.",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 51.5, "sugars": 6.8, "addedSugars": 5.5, "fiber": 5.2, "protein": 9.5, "sodium": 670, "salt": 1.68}),
        ("Noice Gourmet Caramel Popcorn", "Popcorn & Puffs", "Gourmet Caramel", "Mushroom kernel popped corn coated in rich caramelized butter glaze.",
         "Corn (Popped 55%), Cane Sugar (32%), Butter (Dairy 8%), Brown Rice Syrup, Salt, Soy Lecithin.",
         {"calories": 480, "totalFat": 18.0, "saturatedFat": 10.5, "transFat": 0.1, "carbohydrates": 74.0, "sugars": 42.0, "addedSugars": 40.0, "fiber": 4.5, "protein": 4.5, "sodium": 280, "salt": 0.70})
    ]
    for nm, scat, flav, dsc, ing, nut in noice_variants:
        items.append({
            "brand": "Noice", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Everyday Artisanal Snacks",
            "mfr": "Bundl Technologies Pvt Ltd (Swiggy)", "flavour": flav, "wt": "100 g", "price": 49 if "Chips" in nm else 69,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Swiggy Instamart Exclusive", "Fresh Daily Batches", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 27. CORNITOS (GreenDot Health Foods Pvt Ltd) - 16 items
    # ----------------------------------------------------
    cornitos_variants = [
        ("Cornitos Nacho Crisps Thai Sweet Chilli", "Chips", "Thai Sweet Chilli", "Stone ground non-GMO corn chips with sweet chilli and lemongrass flavor.",
         "Corn (70%), Corn Oil, Seasoning (Sugar, Salt, Chilli, Garlic, Onion, Citric Acid (INS 330), Paprika (INS 160c)).",
         {"calories": 505, "totalFat": 26.0, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 61.5, "sugars": 4.2, "addedSugars": 3.2, "fiber": 5.0, "protein": 7.0, "sodium": 680, "salt": 1.70}),
        ("Cornitos Nacho Crisps Sea Salt", "Chips", "Sea Salt", "Crispy tortilla chips seasoned simply with natural sea salt.",
         "Corn (72%), Corn Oil, Sea Salt (1.6%).",
         {"calories": 500, "totalFat": 25.5, "saturatedFat": 3.6, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 5.4, "protein": 7.2, "sodium": 590, "salt": 1.48}),
        ("Cornitos Nacho Crisps Tomato Mexicana", "Chips", "Tomato Mexicana", "Mexican tomato spiced corn chips with sweet and sour notes.",
         "Corn (70%), Corn Oil, Seasoning (Tomato Powder (3.0%), Sugar, Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296)).",
         {"calories": 502, "totalFat": 25.8, "saturatedFat": 3.7, "transFat": 0.0, "carbohydrates": 61.8, "sugars": 4.5, "addedSugars": 3.5, "fiber": 5.2, "protein": 7.0, "sodium": 670, "salt": 1.68}),
        ("Cornitos Nacho Crisps Melted Cheese", "Chips", "Melted Cheese", "Warm gooey cheddar cheese flavor on crunchy corn triangles.",
         "Corn (68%), Corn Oil, Seasoning (Cheddar Cheese Powder (4.0%), Milk Solids, Salt, Sugar, Yeast Extract, Annatto (INS 160b)).",
         {"calories": 510, "totalFat": 26.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 3.2, "addedSugars": 1.8, "fiber": 5.0, "protein": 7.5, "sodium": 710, "salt": 1.78}),
        ("Cornitos Crispy Taco Shells", "Chips", "Taco Shells", "Pre-cooked hard U-shaped corn taco shells ready to fill and bake.",
         "Whole Yellow Corn (82%), Edible Vegetable Oil (Corn Oil), Water, Salt.",
         {"calories": 485, "totalFat": 22.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 7.8, "sodium": 320, "salt": 0.80}),
        ("Cornitos Soft Tortilla Wraps", "Tortilla Wraps", "Original Plain", "Soft flour tortillas ideal for burritos, quesadillas, and rolls.",
         "Wheat Flour (65%), Water, Vegetable Oil, Glycerine, Salt, Raising Agents (INS 450(i), INS 500(ii)), Preservatives (INS 282, INS 200).",
         {"calories": 290, "totalFat": 6.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 50.0, "sugars": 2.5, "addedSugars": 1.5, "fiber": 3.5, "protein": 8.0, "sodium": 590, "salt": 1.48}),
        ("Cornitos Chunky Salsa Dip (Mild)", "Spreads & Dips", "Mild Salsa", "Mexican style dip with diced tomatoes, mild jalapeños, onions, and coriander.",
         "Tomatoes (60%), Tomato Paste, Onion, Green Peppers, Jalapeno, Sugar, Salt, Vinegar, Coriander, Garlic, Thickener (INS 415).",
         {"calories": 50, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 11.0, "sugars": 6.0, "addedSugars": 3.5, "fiber": 2.0, "protein": 1.2, "sodium": 490, "salt": 1.22}),
        ("Cornitos Chunky Salsa Dip (Medium)", "Spreads & Dips", "Medium Salsa", "Spicy salsa with green serrano chillies, vine-ripened tomatoes, and cilantro.",
         "Tomatoes (60%), Onion, Serrano Peppers, Jalapeno (8%), Vinegar, Sugar, Salt, Garlic, Cilantro, Cumin.",
         {"calories": 52, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 11.2, "sugars": 6.2, "addedSugars": 3.6, "fiber": 2.2, "protein": 1.3, "sodium": 510, "salt": 1.28}),
        ("Cornitos Chunky Salsa Dip (Hot)", "Spreads & Dips", "Hot Salsa", "Fiery Mexican salsa packed with habanero and jalapeño peppers.",
         "Tomatoes (58%), Jalapeno (12%), Habanero Chillies (4%), Onion, Vinegar, Sugar, Salt, Garlic, Thickener (INS 415).",
         {"calories": 54, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 11.5, "sugars": 6.4, "addedSugars": 3.8, "fiber": 2.2, "protein": 1.4, "sodium": 540, "salt": 1.35}),
        ("Cornitos Cheesy Jalapeno Dip", "Spreads & Dips", "Cheesy Jalapeno", "Rich and creamy cheese sauce with tangy pickled jalapeno bits.",
         "Water, Cheddar Cheese (25%), Milk Solids, Soybean Oil, Pickled Jalapeno (8%), Salt, Lactic Acid (INS 270), Beta-Carotene (INS 160a).",
         {"calories": 220, "totalFat": 18.0, "saturatedFat": 9.5, "transFat": 0.1, "carbohydrates": 8.0, "sugars": 2.5, "addedSugars": 0.5, "fiber": 0.5, "protein": 6.5, "sodium": 640, "salt": 1.60}),
        ("Cornitos Sliced Pickled Jalapenos", "Spreads & Dips", "Pickled Jalapenos", "Zesty Mexican green jalapeno pepper rings brined in vinegar and sea salt.",
         "Jalapeno Peppers (55%), Water, Vinegar, Salt, Calcium Chloride (INS 509).",
         {"calories": 25, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 5.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 2.5, "protein": 1.0, "sodium": 920, "salt": 2.30}),
        ("Cornitos Crusties Baked Bean & Chickpea Puffs (Italian Cheese)", "Extruded Snacks", "Italian Cheese", "Baked puffs made from white beans, chickpeas, and rice with Italian herbs and cheese.",
         "Bean Flour (White Bean 30%), Chickpea Flour (25%), Rice Flour, Sunflower Oil, Seasoning (Cheese Powder, Milk Solids, Oregano, Salt, Sugar).",
         {"calories": 440, "totalFat": 14.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 3.0, "addedSugars": 1.2, "fiber": 8.5, "protein": 13.5, "sodium": 540, "salt": 1.35}),
        ("Cornitos Roasted & Salted Premium Cashews", "Trail Mixes", "Salted Cashews", "Whole W240 cashew nuts roasted in pure corn oil and tossed in sea salt.",
         "Cashew Nuts (96%), Corn Oil (2.5%), Sea Salt (1.5%).",
         {"calories": 590, "totalFat": 46.5, "saturatedFat": 9.0, "transFat": 0.0, "carbohydrates": 26.0, "sugars": 5.5, "addedSugars": 0.0, "fiber": 3.8, "protein": 18.0, "sodium": 420, "salt": 1.05}),
        ("Cornitos Lightly Salted California Almonds", "Trail Mixes", "Salted Almonds", "Crunchy California almonds dry-roasted with mineral sea salt.",
         "California Almonds (97%), Corn Oil (1.5%), Sea Salt (1.5%).",
         {"calories": 605, "totalFat": 50.0, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 18.0, "sugars": 4.5, "addedSugars": 0.0, "fiber": 11.5, "protein": 21.5, "sodium": 410, "salt": 1.02}),
        ("Cornitos Classic Salted Peanuts", "Trail Mixes", "Salted Peanuts", "Plump Gujarat peanuts roasted to golden perfection with sea salt.",
         "Peanuts (96%), Refined Corn Oil (2.5%), Salt (1.5%).",
         {"calories": 585, "totalFat": 48.0, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 16.0, "sugars": 4.0, "addedSugars": 0.0, "fiber": 8.5, "protein": 25.5, "sodium": 450, "salt": 1.12}),
        ("Cornitos Roasted Pumpkin & Sunflower Seeds", "Trail Mixes", "Seeds Mix", "Raw and gently roasted pumpkin and sunflower seeds packed with zinc and magnesium.",
         "Pumpkin Seeds (50%), Sunflower Seeds (48%), Sea Salt (2.0%).",
         {"calories": 570, "totalFat": 45.0, "saturatedFat": 6.8, "transFat": 0.0, "carbohydrates": 16.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 9.5, "protein": 24.5, "sodium": 390, "salt": 0.98})
    ]
    for nm, scat, flav, dsc, ing, nut in cornitos_variants:
        cat = "Snacks & Spreads"
        if scat in ["Spreads & Dips"]:
            cat = "Spreads, Dips & Sauces"
        elif scat in ["Trail Mixes"]:
            cat = "Dry Fruits, Nuts, Seeds & Trail Mixes"
        elif scat in ["Tortilla Wraps"]:
            cat = "Pantry & Grains"

        items.append({
            "brand": "Cornitos", "name": nm, "cat": cat, "sub": scat, "type": "Mexican & Premium Snacks",
            "mfr": "GreenDot Health Foods Pvt Ltd", "flavour": flav, "wt": "60 g" if "Chips" in nm or "Puffs" in nm else "150 g", "price": 40 if "Chips" in nm else 125,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Non-GMO Corn" if "Corn" in ing else "Gluten Free", "Cooked in Corn Oil", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 28. MAKINO (Ruchoks Foods / Makino Foods Pvt Ltd) - 13 items
    # ----------------------------------------------------
    makino_variants = [
        ("Makino Nacho Chips (Nacho Cheese)", "Chips", "Nacho Cheese", "Corn tortilla chips coated in savory melted cheddar cheese seasoning.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.8%), Milk Solids, Salt, Sugar, Onion, Garlic, Acidity Regulator (INS 270)).",
         {"calories": 505, "totalFat": 26.2, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 2.8, "addedSugars": 1.8, "fiber": 4.5, "protein": 6.8, "sodium": 710, "salt": 1.78}),
        ("Makino Nacho Chips (Sweet Chili)", "Chips", "Sweet Chili", "Crispy corn triangles with sweet red chilli and garlic notes.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Chilli, Salt, Garlic, Citric Acid (INS 330), Paprika (INS 160c)).",
         {"calories": 502, "totalFat": 25.8, "saturatedFat": 11.2, "transFat": 0.05, "carbohydrates": 61.2, "sugars": 4.5, "addedSugars": 3.5, "fiber": 4.4, "protein": 6.7, "sodium": 680, "salt": 1.70}),
        ("Makino Nacho Chips (Jalapeno)", "Chips", "Jalapeno", "Tangy green pickled jalapeno flavored crunchy corn nachos.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Jalapeno (2.0%), Onion, Garlic, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 500, "totalFat": 25.5, "saturatedFat": 11.0, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 2.2, "addedSugars": 1.2, "fiber": 4.6, "protein": 6.8, "sodium": 690, "salt": 1.72}),
        ("Makino Nacho Chips (Peri Peri)", "Chips", "Peri Peri", "Bold African peri peri chilli dusted over stone-ground corn chips.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Garlic, Onion, Black Pepper, Salt, Sugar, Citric Acid).",
         {"calories": 506, "totalFat": 26.4, "saturatedFat": 11.6, "transFat": 0.05, "carbohydrates": 60.2, "sugars": 2.4, "addedSugars": 1.4, "fiber": 4.5, "protein": 6.9, "sodium": 720, "salt": 1.80}),
        ("Makino Nacho Chips (Roasted Masala)", "Chips", "Roasted Masala", "Indian street chatpata masala glaze on golden corn tortillas.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Cumin, Coriander, Chilli, Black Salt, Mango Powder, Salt).",
         {"calories": 504, "totalFat": 26.0, "saturatedFat": 11.4, "transFat": 0.05, "carbohydrates": 60.8, "sugars": 2.5, "addedSugars": 1.5, "fiber": 4.5, "protein": 6.8, "sodium": 740, "salt": 1.85}),
        ("Makino Twistables Corn Twists (Tangy Tomato)", "Extruded Snacks", "Tomato Twists", "Twisted corn snacks with sweet and sour tomato burst.",
         "Corn Grits (65%), Edible Vegetable Oil (Palmolein), Seasoning (Tomato (3.2%), Sugar, Salt, Onion, Garlic, Citric Acid).",
         {"calories": 512, "totalFat": 27.5, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 59.8, "sugars": 4.8, "addedSugars": 3.8, "fiber": 3.5, "protein": 6.2, "sodium": 710, "salt": 1.78}),
        ("Makino Coated Peanuts (Masala Munch)", "Mixture & Namkeen", "Masala Coated", "Crunchy besan flour batter-coated whole peanuts seasoned with spicy amchur and red chilli.",
         "Peanuts (Sing 54%), Gram Flour (Besan 26%), Edible Vegetable Oil (Palmolein), Corn Starch, Spices (Chilli, Cumin, Amchur), Salt, Acidity Regulator (INS 330).",
         {"calories": 560, "totalFat": 38.0, "saturatedFat": 12.5, "transFat": 0.0, "carbohydrates": 36.5, "sugars": 2.8, "addedSugars": 1.2, "fiber": 6.5, "protein": 18.5, "sodium": 720, "salt": 1.80}),
        ("Makino Coated Peanuts (Schezwan)", "Mixture & Namkeen", "Schezwan Coated", "Crispy batter-coated peanuts seasoned with fiery Sichuan pepper and garlic.",
         "Peanuts (54%), Gram Flour (26%), Vegetable Oil, Seasoning (Sichuan Chilli, Garlic, Soy Sauce, Salt, Sugar, Citric Acid).",
         {"calories": 558, "totalFat": 37.8, "saturatedFat": 12.4, "transFat": 0.0, "carbohydrates": 36.8, "sugars": 3.0, "addedSugars": 1.5, "fiber": 6.4, "protein": 18.2, "sodium": 750, "salt": 1.88}),
        ("Makino Coated Peanuts (Hing Jeera)", "Mixture & Namkeen", "Hing Jeera Coated", "Savory batter-coated peanuts seasoned with fragrant roasted cumin and hing.",
         "Peanuts (54%), Gram Flour (26%), Vegetable Oil, Seasoning (Asafoetida (Hing 1.2%), Roasted Cumin (3.0%), Black Salt, Salt).",
         {"calories": 555, "totalFat": 37.5, "saturatedFat": 12.2, "transFat": 0.0, "carbohydrates": 37.0, "sugars": 2.2, "addedSugars": 0.8, "fiber": 6.6, "protein": 18.4, "sodium": 690, "salt": 1.72}),
        ("Makino Coated Peanuts (Smoky Barbeque)", "Mixture & Namkeen", "Barbeque Coated", "Crunchy besan-coated peanuts with sweet and smoky BBQ seasoning.",
         "Peanuts (54%), Gram Flour (26%), Vegetable Oil, Seasoning (Paprika, Onion, Garlic, Sugar, Salt, Smoked Flavour).",
         {"calories": 562, "totalFat": 38.2, "saturatedFat": 12.6, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 4.0, "addedSugars": 2.5, "fiber": 6.2, "protein": 18.0, "sodium": 710, "salt": 1.78}),
        ("Makino Roasted California Almonds (Salted)", "Trail Mixes", "Salted Almonds", "Slow roasted nonpareil almonds with mineral salt.",
         "California Almonds (97%), Sunflower Oil (1.5%), Sea Salt (1.5%).",
         {"calories": 605, "totalFat": 50.0, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 18.0, "sugars": 4.5, "addedSugars": 0.0, "fiber": 11.5, "protein": 21.5, "sodium": 410, "salt": 1.02}),
        ("Makino Roasted Cashews (Pepper & Salt)", "Trail Mixes", "Pepper Cashews", "Whole roasted cashews seasoned with crushed black pepper and salt.",
         "Cashew Nuts (96%), Sunflower Oil (2.0%), Black Pepper (1.0%), Salt (1.0%).",
         {"calories": 585, "totalFat": 46.0, "saturatedFat": 9.0, "transFat": 0.0, "carbohydrates": 26.5, "sugars": 5.2, "addedSugars": 0.0, "fiber": 3.8, "protein": 18.2, "sodium": 430, "salt": 1.08}),
        ("Makino Party Trail Mix (Nuts, Seeds & Berries)", "Trail Mixes", "Party Trail Mix", "Premium party blend of roasted almonds, cashews, cranberries, raisins, and pumpkin seeds.",
         "Almonds (25%), Cashews (25%), Cranberries (20%), Raisins (15%), Pumpkin Seeds (15%).",
         {"calories": 510, "totalFat": 33.5, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 39.0, "sugars": 21.0, "addedSugars": 0.0, "fiber": 9.5, "protein": 16.5, "sodium": 45, "salt": 0.11})
    ]
    for nm, scat, flav, dsc, ing, nut in makino_variants:
        cat = "Snacks & Spreads"
        if scat in ["Trail Mixes"]:
            cat = "Dry Fruits, Nuts, Seeds & Trail Mixes"

        items.append({
            "brand": "Makino", "name": nm, "cat": cat, "sub": scat, "type": "Makino Corn & Nut Snacks",
            "mfr": "Makino Foods Pvt Ltd", "flavour": flav, "wt": "60 g" if "Chips" in nm or "Twistables" in nm else "100 g", "price": 35 if "Chips" in nm else 95,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Non-GMO Corn" if "Corn" in ing else "Roasted Nuts", "Crispy & Crunchy", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 29. FARMLEY (Conn心 Health Foods Pvt Ltd) - 15 items
    # ----------------------------------------------------
    farmley_variants = [
        ("Farmley Roasted Makhana (Cream & Onion)", "Roasted Makhana", "Cream & Onion", "Slow-roasted jumbo foxnuts flavored with smooth sour cream and chives in olive oil.",
         "Foxnuts (Phool Makhana 76%), Extra Virgin Olive Oil, Seasoning (Milk Solids, Onion, Parsley, Salt, Sugar, Lactic Acid).",
         {"calories": 440, "totalFat": 14.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 3.2, "addedSugars": 1.8, "fiber": 9.5, "protein": 9.8, "sodium": 460, "salt": 1.15}),
        ("Farmley Roasted Makhana (Pudina)", "Roasted Makhana", "Garden Pudina", "Crunchy roasted foxnuts with natural dried mint and rock salt.",
         "Foxnuts (78%), Olive Oil, Seasoning (Mint Powder (3.2%), Black Salt, Dry Mango, Cumin, Salt).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 9.8, "protein": 10.0, "sodium": 450, "salt": 1.12}),
        ("Farmley Roasted Makhana (Himalayan Salt & Pepper)", "Roasted Makhana", "Salt & Pepper", "Simple and clean roasted makhana with mineral-rich Himalayan pink salt and black pepper.",
         "Foxnuts (80%), Olive Oil, Himalayan Pink Salt (1.8%), Tellicherry Black Pepper (1.5%).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 10.0, "protein": 10.2, "sodium": 410, "salt": 1.02}),
        ("Farmley Roasted Makhana (Tangy Tomato)", "Roasted Makhana", "Tangy Tomato", "Popped water lily seeds coated in sun-dried sweet and sour tomato seasoning.",
         "Foxnuts (76%), Olive Oil, Seasoning (Tomato Powder (3.5%), Sugar, Salt, Onion, Garlic, Citric Acid).",
         {"calories": 438, "totalFat": 13.6, "saturatedFat": 2.3, "transFat": 0.0, "carbohydrates": 68.2, "sugars": 4.5, "addedSugars": 3.0, "fiber": 9.6, "protein": 9.7, "sodium": 470, "salt": 1.18}),
        ("Farmley Roasted & Flavoured Almonds (Peri Peri)", "Raw Nuts", "Peri Peri Almonds", "Jumbo California almonds roasted and seasoned with zesty African peri peri spices.",
         "Almonds (94%), Sunflower Oil (2%), Seasoning (Chilli, Garlic, Onion, Salt, Sugar, Citric Acid).",
         {"calories": 605, "totalFat": 49.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 18.5, "sugars": 4.5, "addedSugars": 1.0, "fiber": 11.2, "protein": 21.5, "sodium": 460, "salt": 1.15}),
        ("Farmley Roasted & Flavoured Cashews (Black Pepper)", "Raw Nuts", "Pepper Cashews", "Whole W240 cashews roasted with cracked black pepper and rock salt.",
         "Cashew Nuts (95%), Sunflower Oil (2%), Black Pepper (1.8%), Sendha Namak (1.2%).",
         {"calories": 585, "totalFat": 46.0, "saturatedFat": 9.0, "transFat": 0.0, "carbohydrates": 26.5, "sugars": 5.0, "addedSugars": 0.0, "fiber": 3.8, "protein": 18.2, "sodium": 420, "salt": 1.05}),
        ("Farmley Roasted & Salted California Pistachios", "Raw Nuts", "Salted Pistachios", "Naturally opened in-shell California pistachios roasted with sea salt.",
         "In-shell Pistachios (98%), Sea Salt (2.0%).",
         {"calories": 560, "totalFat": 45.0, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 27.5, "sugars": 7.5, "addedSugars": 0.0, "fiber": 10.5, "protein": 20.5, "sodium": 480, "salt": 1.20}),
        ("Farmley 5-in-1 Super Seeds Mix", "Trail Mixes", "Seeds Mix", "Raw and roasted pumpkin seeds, sunflower seeds, flax seeds, chia seeds, and watermelon seeds.",
         "Pumpkin Seeds (25%), Sunflower Seeds (25%), Flax Seeds (20%), Watermelon Seeds (20%), Chia Seeds (10%).",
         {"calories": 540, "totalFat": 42.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 18.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 18.0, "protein": 22.0, "sodium": 35, "salt": 0.08}),
        ("Farmley Healthy Party Mix", "Trail Mixes", "Party Mix", "Crunchy celebration mix of almonds, cashews, roasted chickpeas, pumpkin seeds, and cranberries.",
         "Almonds (22%), Cashews (20%), Roasted Bengal Gram (20%), Pumpkin Seeds (18%), Dried Cranberries (20%).",
         {"calories": 495, "totalFat": 30.5, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 16.0, "addedSugars": 0.0, "fiber": 10.5, "protein": 17.5, "sodium": 55, "salt": 0.14}),
        ("Farmley 100% Pure Date Bites (Chocolate)", "Date Bites", "Chocolate Date Bites", "Fudge-like confection made exclusively from Arabian dates, almonds, and raw cocoa with zero added sugar.",
         "Dates (Khajoor 75%), Almonds (15%), Cashews (5%), Cocoa Powder (5%).",
         {"calories": 380, "totalFat": 11.5, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 52.0, "addedSugars": 0.0, "fiber": 9.5, "protein": 7.2, "sodium": 40, "salt": 0.10}),
        ("Farmley 100% Pure Date Bites (Rose Almond)", "Date Bites", "Rose Date Bites", "Date bites layered with edible dried rose petals, crushed almonds, and cardamom.",
         "Dates (76%), Almonds (18%), Edible Dried Rose Petals (3%), Cardamom (1%), Ghee (2%).",
         {"calories": 385, "totalFat": 12.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 51.0, "addedSugars": 0.0, "fiber": 9.2, "protein": 7.5, "sodium": 38, "salt": 0.09}),
        ("Farmley 100% Pure Date Bites (Dry Fruit Assorted)", "Date Bites", "Dry Fruit Date Bites", "Date squares filled with crushed pistachios, cashews, almonds, and walnuts.",
         "Dates (72%), Cashews (8%), Almonds (8%), Pistachios (6%), Walnuts (6%).",
         {"calories": 395, "totalFat": 14.0, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 48.0, "addedSugars": 0.0, "fiber": 9.0, "protein": 8.5, "sodium": 35, "salt": 0.08}),
        ("Farmley Dried Anjeer Fig Bites", "Date Bites", "Fig Bites", "Nutritious chewy squares prepared from Turkish figs and crushed California almonds.",
         "Dried Figs (Anjeer 78%), Almonds (18%), Cardamom, Pure Ghee (2%).",
         {"calories": 365, "totalFat": 10.5, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 46.0, "addedSugars": 0.0, "fiber": 12.5, "protein": 6.8, "sodium": 42, "salt": 0.10}),
        ("Farmley Multi-Millet Energy Bars", "Protein & Clean-Label Bars / Wafers", "Millet Energy Bar", "Wholesome snack bar crafted from puffed ragi, bajra, jowar, dates, and roasted peanuts.",
         "Dates (40%), Puffed Millets (Ragi, Bajra, Jowar 30%), Roasted Peanuts (18%), Honey (8%), Chia Seeds (4%).",
         {"calories": 410, "totalFat": 14.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 32.0, "addedSugars": 0.0, "fiber": 8.5, "protein": 10.5, "sodium": 65, "salt": 0.16}),
        ("Farmley Royal Paan Flavoured Raisins", "Trail Mixes", "Paan Raisins", "Sweet green Afghan raisins infused with Calcutta Meetha Paan extract and fennel.",
         "Green Raisins (Kishmish 92%), Natural Betel Leaf Extract (Paan 4%), Fennel Powder (2%), Rose Petal Gulkand (2%).",
         {"calories": 310, "totalFat": 0.5, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 74.0, "sugars": 62.0, "addedSugars": 0.0, "fiber": 4.5, "protein": 3.2, "sodium": 30, "salt": 0.07})
    ]
    for nm, scat, flav, dsc, ing, nut in farmley_variants:
        cat = "Dry Fruits, Nuts, Seeds & Trail Mixes"
        if scat == "Roasted Makhana":
            cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
        elif scat == "Protein & Clean-Label Bars / Wafers":
            cat = "Protein & Clean-Label Bars / Wafers"

        items.append({
            "brand": "Farmley", "name": nm, "cat": cat, "sub": scat, "type": "Farmley Dry Fruits & Healthy Snacks",
            "mfr": "Conn心 Health Foods Pvt Ltd", "flavour": flav, "wt": "50 g" if "Makhana" in nm else "200 g", "price": 45 if "Makhana" in nm else 199,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Direct from Farm Origin", "Zero Added Sugar" if "Bites" in nm or "Raisins" in nm else "Roasted Never Fried", "Clean Label"]
        })

    # ----------------------------------------------------
    # 30. GO DESI (GO DESi Mandi Pvt Ltd) - 17 items
    # ----------------------------------------------------
    godesi_variants = [
        ("GO DESi POPz Tangy Tamarind (Imli)", "Lollipops", "Tangy Imli", "Traditional South Indian spicy-sour imli candy on a stick made with raw tamarind and jaggery.",
         "Tamarind (Imli 42%), Jaggery (Gur 40%), Sugar (12%), Red Chilli Powder, Cumin, Iodised Salt.",
         {"calories": 320, "totalFat": 0.4, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 77.0, "sugars": 65.0, "addedSugars": 12.0, "fiber": 4.2, "protein": 2.2, "sodium": 680, "salt": 1.70}),
        ("GO DESi POPz Kaccha Aam (Raw Mango)", "Lollipops", "Kaccha Aam", "Tart raw green mango candy pop tempered with red chilli and rock salt.",
         "Raw Mango Pulp (42%), Jaggery (38%), Sugar (14%), Salt, Red Chilli, Cumin, Black Salt.",
         {"calories": 325, "totalFat": 0.3, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 78.0, "sugars": 66.0, "addedSugars": 14.0, "fiber": 3.8, "protein": 2.0, "sodium": 660, "salt": 1.65}),
        ("GO DESi POPz Real Mango", "Lollipops", "Real Mango", "Sweet ripe Alphonso mango fruit pop sweetened naturally with jaggery and cardamom.",
         "Ripe Mango Pulp (50%), Jaggery (40%), Sugar, Lemon Juice, Cardamom.",
         {"calories": 330, "totalFat": 0.4, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 79.5, "sugars": 68.0, "addedSugars": 10.0, "fiber": 3.5, "protein": 2.1, "sodium": 140, "salt": 0.35}),
        ("GO DESi POPz Kala Khatta", "Lollipops", "Kala Khatta", "Tangy jamun fruit and cumin street-style pop with refreshing black salt and ginger.",
         "Jamun Pulp (35%), Tamarind (15%), Jaggery (38%), Black Salt, Roasted Cumin, Ginger, Salt.",
         {"calories": 315, "totalFat": 0.3, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 76.0, "sugars": 64.0, "addedSugars": 10.0, "fiber": 4.5, "protein": 2.0, "sodium": 740, "salt": 1.85}),
        ("GO DESi POPz Guava Chilli", "Lollipops", "Guava Chilli", "Ripe pink guava fruit pop seasoned with street-style red chilli and rock salt.",
         "Pink Guava Pulp (48%), Jaggery (38%), Red Chilli Powder (2%), Rock Salt, Citric Acid.",
         {"calories": 325, "totalFat": 0.4, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 77.5, "sugars": 65.0, "addedSugars": 10.0, "fiber": 4.8, "protein": 2.2, "sodium": 590, "salt": 1.48}),
        ("GO DESi POPz Watermelon", "Lollipops", "Watermelon", "Refreshing watermelon juice pop blended with cooling mint and jaggery.",
         "Watermelon Juice Concentrate (45%), Jaggery (42%), Sugar, Mint Extract, Salt.",
         {"calories": 320, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 78.0, "sugars": 66.0, "addedSugars": 10.0, "fiber": 2.8, "protein": 1.8, "sodium": 120, "salt": 0.30}),
        ("GO DESi Mints Meetha Paan", "Candy & Toffees", "Meetha Paan", "Natural digestives made with gulkand, betel leaves, fennel, and menthol with zero artificial sweeteners.",
         "Gulkand (Rose Petal Jam 45%), Fennel Seeds (25%), Betel Leaves (15%), Coriander Seeds, Cardamom, Menthol.",
         {"calories": 340, "totalFat": 2.5, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 76.0, "sugars": 60.0, "addedSugars": 20.0, "fiber": 6.5, "protein": 4.5, "sodium": 65, "salt": 0.16}),
        ("GO DESi Mints Hing Jeera", "Candy & Toffees", "Hing Jeera Mints", "Ayurvedic digestive lozenges crafted from pungent asafoetida, roasted cumin, and black salt.",
         "Cumin (Jeera 30%), Asafoetida (Hing 4%), Dried Mango, Black Salt, Rock Salt, Ginger, Sugar, Pepper.",
         {"calories": 295, "totalFat": 3.0, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 40.0, "addedSugars": 25.0, "fiber": 8.0, "protein": 5.2, "sodium": 1200, "salt": 3.00}),
        ("GO DESi Aam Papad Fruit Bar", "Indian Traditional Sweets", "Aam Papad", "Sun-dried layered natural mango pulp leather seasoned with rock salt.",
         "Mango Pulp (82%), Jaggery (14%), Rock Salt, Citric Acid.",
         {"calories": 310, "totalFat": 0.4, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 75.0, "sugars": 62.0, "addedSugars": 0.0, "fiber": 4.5, "protein": 1.8, "sodium": 320, "salt": 0.80}),
        ("GO DESi Jackfruit Fruit Bar", "Indian Traditional Sweets", "Jackfruit Bar", "Sun-ripened Western Ghats jackfruit pulp slow-cooked into chewy golden fruit bars.",
         "Ripe Jackfruit Pulp (85%), Jaggery (12%), Pure Ghee (2%), Cardamom.",
         {"calories": 305, "totalFat": 1.2, "saturatedFat": 0.6, "transFat": 0.0, "carbohydrates": 72.0, "sugars": 58.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 2.5, "sodium": 45, "salt": 0.11}),
        ("GO DESi Wild Berry Fruit Bar", "Indian Traditional Sweets", "Berry Fruit Bar", "Tart wild berries and Cape gooseberry puree naturally dried into fruit bars.",
         "Wild Berry Pulp (Jamun, Gooseberry, Cranberry 80%), Jaggery (18%), Lemon Juice.",
         {"calories": 295, "totalFat": 0.5, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 54.0, "addedSugars": 0.0, "fiber": 8.0, "protein": 2.2, "sodium": 50, "salt": 0.12}),
        ("GO DESi Jaggery Peanut Chikki", "Peanut Brittle & Chikki", "Peanut Chikki", "Traditional brittle made with roasted Bharuch peanuts and organic jaggery.",
         "Roasted Peanuts (58%), Organic Jaggery (Gur 40%), Pure Desi Ghee (2%).",
         {"calories": 530, "totalFat": 30.5, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 36.0, "addedSugars": 0.0, "fiber": 6.5, "protein": 16.5, "sodium": 45, "salt": 0.11}),
        ("GO DESi Jaggery Sesame Chikki (Til Chikki)", "Peanut Brittle & Chikki", "Til Chikki", "Crispy sesame seed slabs bound with molten jaggery and cardamom.",
         "White Sesame Seeds (Till 56%), Jaggery (42%), Ghee (2%).",
         {"calories": 520, "totalFat": 32.0, "saturatedFat": 5.0, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 35.0, "addedSugars": 0.0, "fiber": 8.2, "protein": 13.0, "sodium": 40, "salt": 0.10}),
        ("GO DESi Jaggery Dry Fruit Chikki", "Peanut Brittle & Chikki", "Dry Fruit Chikki", "Royal brittle loaded with cashews, almonds, pistachios, and organic jaggery.",
         "Almonds (22%), Cashews (22%), Pistachios (12%), Jaggery (42%), Pure Ghee (2%).",
         {"calories": 545, "totalFat": 35.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 32.0, "addedSugars": 0.0, "fiber": 7.5, "protein": 15.5, "sodium": 42, "salt": 0.10}),
        ("GO DESi Coconut Oil Banana Chips", "Banana Chips", "Banana Chips", "Crunchy sliced Nendran bananas fried in cold-pressed coconut oil and rock salt.",
         "Raw Nendran Banana (68%), Cold-Pressed Coconut Oil (28%), Rock Salt (2%), Turmeric.",
         {"calories": 535, "totalFat": 31.0, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 60.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.2, "protein": 4.0, "sodium": 480, "salt": 1.20}),
        ("GO DESi Handmade Butter Murukku", "Mixture & Namkeen", "Butter Murukku", "Traditional South Indian spiral murukku prepared with rice flour, butter, and cumin.",
         "Rice Flour (65%), Roasted Bengal Gram Flour (20%), White Butter (Makkhan 10%), Cumin, Salt, Asafoetida.",
         {"calories": 525, "totalFat": 28.5, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 0.8, "addedSugars": 0.0, "fiber": 4.5, "protein": 8.5, "sodium": 580, "salt": 1.45}),
        ("GO DESi Traditional South Indian Mixture", "Mixture & Namkeen", "South Indian Mixture", "Crisp gram flour boondi, sev, fried curry leaves, roasted peanuts, and broken cashews.",
         "Gram Flour (Besan 40%), Edible Vegetable Oil, Roasted Peanuts (14%), Fried Cashews (6%), Curry Leaves, Garlic, Salt, Red Chilli, Hing.",
         {"calories": 545, "totalFat": 34.0, "saturatedFat": 13.5, "transFat": 0.0, "carbohydrates": 47.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 5.8, "protein": 12.2, "sodium": 710, "salt": 1.78})
    ]
    for nm, scat, flav, dsc, ing, nut in godesi_variants:
        cat = "Chocolates & Sweets"
        if scat in ["Banana Chips", "Mixture & Namkeen"]:
            cat = "Snacks & Spreads"

        items.append({
            "brand": "GO DESi", "name": nm, "cat": cat, "sub": scat, "type": "Micro-Enterprise Desi Treats",
            "mfr": "GO DESi Mandi Pvt Ltd", "flavour": flav, "wt": "15 g" if "POPz" in nm else "100 g", "price": 10 if "POPz" in nm else 60,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Desi Ingredients", "Direct from Rural Self-Help Groups", "No Preservatives", "Sweetened with Jaggery" if "Jaggery" in ing else "Natural Fruit"]
        })

    return items

print("Section 5 definitions written successfully.")
