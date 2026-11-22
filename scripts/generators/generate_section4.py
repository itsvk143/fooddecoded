import json

def get_section4():
    items = []

    # ----------------------------------------------------
    # 16. TOO YUMM! (Guiltfree Industries Ltd / RP-Sanjiv Goenka Group) - 14 items
    # ----------------------------------------------------
    tooyumm_variants = [
        ("Too Yumm! Karare Southern Spice", "Extruded Snacks", "Southern Spice", "Baked crunchy multigrain fingers infused with aromatic curry leaves, mustard seeds, and pepper.",
         "Rice Flour, Corn Flour, Wheat Flour, Edible Vegetable Oil (Sunflower Oil), Seasoning (Curry Leaves (2.2%), Mustard, Black Pepper, Salt, Sugar, Chilli, Acidity Regulator (INS 330)).",
         {"calories": 460, "totalFat": 19.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 64.5, "sugars": 2.8, "addedSugars": 1.5, "fiber": 5.5, "protein": 7.2, "sodium": 680, "salt": 1.70}),
        ("Too Yumm! Bhoot Chips (Ghost Pepper)", "Chips", "Bhoot Jolakia", "Fiery baked potato crisps dusted with genuine Assam Bhoot Jolokia (Ghost Pepper).",
         "Potato Flakes (55%), Rice Flour, Sunflower Oil, Seasoning (Assam Ghost Chilli Powder (0.8%), Paprika, Garlic, Onion, Salt, Sugar, Acidity Regulator (INS 330), Paprika Oleoresin (INS 160c)).",
         {"calories": 470, "totalFat": 20.0, "saturatedFat": 2.9, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 2.2, "addedSugars": 1.2, "fiber": 4.5, "protein": 6.8, "sodium": 820, "salt": 2.05}),
        ("Too Yumm! Rings Tangy Tomato", "Extruded Snacks", "Tangy Tomato", "Baked multigrain circular rings with sweet and tangy sun-ripened tomato flavor.",
         "Multigrain Flour (Corn, Rice, Wheat 64%), Sunflower Oil, Seasoning (Sugar, Tomato Powder (3.0%), Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296)).",
         {"calories": 455, "totalFat": 18.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 65.5, "sugars": 5.2, "addedSugars": 4.0, "fiber": 4.8, "protein": 6.5, "sodium": 690, "salt": 1.72}),
        ("Too Yumm! Rings Spicy Masala", "Extruded Snacks", "Spicy Masala", "Baked corn and wheat rings seasoned with roasted cumin, coriander, and red chilli.",
         "Multigrain Flour (64%), Sunflower Oil, Seasoning (Spices (Chilli, Cumin, Amchur), Salt, Sugar, Black Salt, Acidity Regulator (INS 330)).",
         {"calories": 458, "totalFat": 18.8, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 2.4, "addedSugars": 1.5, "fiber": 4.9, "protein": 6.6, "sodium": 740, "salt": 1.85}),
        ("Too Yumm! Foxnuts Tandoori Makhana", "Roasted Makhana", "Tandoori", "Slow roasted popped gorgon nuts coated with smoky tandoori barbecue spices.",
         "Foxnuts (Makhana 75%), Sunflower Oil, Seasoning (Coriander, Cumin, Kasuri Methi, Garlic, Salt, Sugar, Smoked Flavour, Acidity Regulator (INS 330), Paprika Extract (INS 160c)).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 68.5, "sugars": 1.5, "addedSugars": 0.5, "fiber": 9.8, "protein": 9.5, "sodium": 510, "salt": 1.28}),
        ("Too Yumm! Foxnuts Peri Peri Makhana", "Roasted Makhana", "Peri Peri", "Gently roasted crispy foxnuts glazed with spicy African peri peri seasoning.",
         "Foxnuts (Makhana 75%), Sunflower Oil, Seasoning (Red Chilli, Garlic, Onion, Black Pepper, Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 438, "totalFat": 13.8, "saturatedFat": 2.3, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 1.8, "addedSugars": 0.8, "fiber": 9.6, "protein": 9.6, "sodium": 540, "salt": 1.35}),
        ("Too Yumm! Foxnuts Pudina Makhana", "Roasted Makhana", "Pudina", "Crunchy roasted makhana infused with dried garden mint and black salt.",
         "Foxnuts (Makhana 76%), Sunflower Oil, Seasoning (Mint Powder (3.2%), Black Salt, Dry Mango, Rock Salt, Cumin, Acidity Regulator (INS 330)).",
         {"calories": 432, "totalFat": 13.2, "saturatedFat": 2.1, "transFat": 0.0, "carbohydrates": 68.8, "sugars": 0.8, "addedSugars": 0.0, "fiber": 10.0, "protein": 9.8, "sodium": 480, "salt": 1.20}),
        ("Too Yumm! Veggie Stix Sour Cream & Onion", "Extruded Snacks", "Sour Cream & Onion", "Baked vegetable straws crafted from spinach, tomato, and corn with creamy herbs.",
         "Vegetable & Corn Flour (Corn, Rice, Spinach, Tomato 65%), Sunflower Oil, Seasoning (Milk Solids, Onion, Garlic, Parsley, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 462, "totalFat": 19.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 64.5, "sugars": 3.8, "addedSugars": 2.2, "fiber": 5.2, "protein": 7.0, "sodium": 650, "salt": 1.62}),
        ("Too Yumm! Veggie Stix Chilli Chataka", "Extruded Snacks", "Chilli Chataka", "Crispy baked vegetable straws seasoned with red chilli, dry mango, and rock salt.",
         "Vegetable Flour (Spinach, Carrot, Corn, Rice 65%), Sunflower Oil, Seasoning (Chilli, Amchur, Cumin, Black Salt, Salt, Acidity Regulator (INS 330)).",
         {"calories": 460, "totalFat": 18.8, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 2.0, "addedSugars": 1.0, "fiber": 5.4, "protein": 7.2, "sodium": 720, "salt": 1.80}),
        ("Too Yumm! Quinoa Puffs Cheesy Nachos", "Extruded Snacks", "Cheesy Nachos", "Light baked puffs made with wholesome quinoa, jowar, and rice tossed in cheddar seasoning.",
         "Quinoa Flour (22%), Jowar Flour (20%), Rice Flour (22%), Sunflower Oil, Seasoning (Cheese Powder (3.8%), Milk Solids, Salt, Sugar, Natural Color (INS 160c)).",
         {"calories": 450, "totalFat": 17.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 3.2, "addedSugars": 1.8, "fiber": 6.5, "protein": 8.8, "sodium": 620, "salt": 1.55}),
        ("Too Yumm! Quinoa Puffs Khatta Meetha", "Extruded Snacks", "Khatta Meetha", "Baked quinoa and millet puffs dusted with sweet and tangy tamarind-cumin seasoning.",
         "Quinoa Flour (22%), Jowar Flour, Rice Flour, Sunflower Oil, Seasoning (Sugar, Tamarind, Dry Mango, Black Salt, Cumin, Acidity Regulator (INS 330)).",
         {"calories": 452, "totalFat": 17.2, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 6.5, "addedSugars": 5.0, "fiber": 6.4, "protein": 8.5, "sodium": 610, "salt": 1.52}),
        ("Too Yumm! Baked Multigrain Chips Dahi Papdi Chaat", "Chips", "Dahi Papdi Chaat", "Baked multigrain chips seasoned with street chaat spices, sweet yogurt notes, and mint chutney.",
         "Multigrain Flour (Wheat, Rice, Corn, Oats 62%), Sunflower Oil, Seasoning (Yogurt Powder, Tamarind, Mint, Cumin, Black Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 465, "totalFat": 19.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 63.5, "sugars": 4.5, "addedSugars": 3.0, "fiber": 5.8, "protein": 7.8, "sodium": 690, "salt": 1.72}),
        ("Too Yumm! Baked Multigrain Chips Tangy Tomato", "Chips", "Tangy Tomato", "Baked multigrain crisps flavored with sun-ripened tomatoes and mild garden spices.",
         "Multigrain Flour (62%), Sunflower Oil, Seasoning (Tomato Powder (3.2%), Sugar, Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296)).",
         {"calories": 460, "totalFat": 19.0, "saturatedFat": 2.7, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 5.5, "addedSugars": 4.2, "fiber": 5.6, "protein": 7.5, "sodium": 670, "salt": 1.68}),
        ("Too Yumm! Baked Multigrain Chips Chinese Hot & Sweet", "Chips", "Chinese Hot & Sweet", "Baked multigrain chips glazed with spicy red chillies, ginger, garlic, and sweet plum sauce notes.",
         "Multigrain Flour (62%), Sunflower Oil, Seasoning (Chilli, Garlic, Ginger, Soya Sauce Powder, Sugar, Salt, Acidity Regulator (INS 260)).",
         {"calories": 462, "totalFat": 19.2, "saturatedFat": 2.7, "transFat": 0.0, "carbohydrates": 63.8, "sugars": 4.8, "addedSugars": 3.5, "fiber": 5.7, "protein": 7.6, "sodium": 740, "salt": 1.85})
    ]
    for nm, scat, flav, dsc, ing, nut in tooyumm_variants:
        cat = "Snacks & Spreads"
        if scat == "Roasted Makhana":
            cat = "Baked Chips, Makhana & Unjunked Indian Snacks"

        items.append({
            "brand": "Too Yumm!", "name": nm, "cat": cat, "sub": scat, "type": "Baked Smart Snacks",
            "mfr": "Guiltfree Industries Ltd", "flavour": flav, "wt": "54 g", "price": 20 if "Makhana" not in nm else 40,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Baked Not Fried", "40% Less Saturated Fat", "Wholesome Grains"]
        })

    # ----------------------------------------------------
    # 17. BRB (Big Rice Bites - Forbidden Foods Pvt Ltd) - 7 items
    # ----------------------------------------------------
    brb_variants = [
        ("BRB Popped Rice Chips Jalapeno & Tomato", "Jalapeno & Tomato", "Popped whole grain brown rice crisps with spicy pickled jalapeno and zesty tomato.",
         "Brown Rice (72%), Rice Bran Oil, Seasoning (Tomato Powder (3.0%), Jalapeno (1.5%), Onion, Garlic, Salt, Sugar, Citric Acid (INS 330)).",
         {"calories": 420, "totalFat": 12.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 3.0, "addedSugars": 1.5, "fiber": 6.5, "protein": 7.8, "sodium": 540, "salt": 1.35}),
        ("BRB Popped Rice Chips Peri Peri", "Peri Peri", "Ultra-crunchy popped brown rice chips dusted with fiery African peri peri spice.",
         "Brown Rice (72%), Rice Bran Oil, Seasoning (Chilli, Garlic, Onion, Lemon Juice, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 422, "totalFat": 12.2, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 69.8, "sugars": 2.2, "addedSugars": 1.2, "fiber": 6.6, "protein": 7.9, "sodium": 580, "salt": 1.45}),
        ("BRB Popped Rice Chips Truffle", "Truffle", "Gourmet popped brown rice chips infused with aromatic earthy black summer truffle essence and sea salt.",
         "Brown Rice (74%), Rice Bran Oil, Seasoning (Black Truffle Extract (0.5%), Sea Salt, Yeast Extract, Garlic, Mushroom Powder).",
         {"calories": 418, "totalFat": 11.5, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 70.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 8.0, "sodium": 480, "salt": 1.20}),
        ("BRB Popped Rice Chips Barbeque", "Barbeque", "Popped brown rice chips with sweet and smoky Texas-style barbeque glaze.",
         "Brown Rice (72%), Rice Bran Oil, Seasoning (Smoked Paprika, Tomato, Onion, Garlic, Sugar, Salt, Natural Smoked Flavour).",
         {"calories": 425, "totalFat": 12.5, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 69.5, "sugars": 3.8, "addedSugars": 2.5, "fiber": 6.4, "protein": 7.6, "sodium": 560, "salt": 1.40}),
        ("BRB Popped Rice Chips Cream & Onion", "Cream & Onion", "Crisp popped rice chips coated with rich sour cream, sweet onion, and chives.",
         "Brown Rice (70%), Rice Bran Oil, Seasoning (Milk Solids (Sour Cream 4.0%), Onion Powder, Chives, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 69.0, "sugars": 3.5, "addedSugars": 2.0, "fiber": 6.2, "protein": 7.8, "sodium": 520, "salt": 1.30}),
        ("BRB Popped Rice Chips Himalayan Pink Salt", "Himalayan Pink Salt", "Minimalist popped brown rice chips seasoned purely with mineral-rich Himalayan pink salt.",
         "Whole Grain Brown Rice (82%), Rice Bran Oil, Himalayan Pink Rock Salt (1.8%).",
         {"calories": 410, "totalFat": 10.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 71.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 7.2, "protein": 8.2, "sodium": 420, "salt": 1.05}),
        ("BRB Popped Rice Chips Cheese & Herbs", "Cheese & Herbs", "Popped rice chips seasoned with English cheddar cheese and fragrant rosemary and oregano.",
         "Brown Rice (70%), Rice Bran Oil, Seasoning (Cheddar Cheese Powder (4.2%), Whey, Rosemary, Oregano, Salt, Sugar, Natural Color (INS 160c)).",
         {"calories": 432, "totalFat": 13.2, "saturatedFat": 2.9, "transFat": 0.0, "carbohydrates": 68.8, "sugars": 3.0, "addedSugars": 1.5, "fiber": 6.2, "protein": 8.2, "sodium": 530, "salt": 1.32})
    ]
    for nm, flav, dsc, ing, nut in brb_variants:
        items.append({
            "brand": "BRB", "name": nm, "cat": "Baked Chips, Makhana & Unjunked Indian Snacks", "sub": "Baked Chips", "type": "Popped Rice Chips",
            "mfr": "Forbidden Foods Pvt Ltd", "flavour": flav, "wt": "48 g", "price": 40,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Popped Not Fried", "60% Less Fat", "Whole Grain Brown Rice", "Gluten Free"]
        })

    # ----------------------------------------------------
    # 18. TAGZ (TagZ Foods Pvt Ltd) - 7 items
    # ----------------------------------------------------
    tagz_variants = [
        ("TagZ Popped Potato Chips Thai Tom Yum", "Chips", "Thai Tom Yum", "Popped potato chips bursting with tangy kaffir lime, galangal, lemongrass, and fiery chilli aroma.",
         "Dried Potato Flakes (62%), Rice Flour, Sunflower Oil, Seasoning (Kaffir Lime, Lemongrass, Galangal, Chilli, Salt, Sugar, Citric Acid (INS 330), Natural Flavouring).",
         {"calories": 435, "totalFat": 13.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 2.8, "addedSugars": 1.5, "fiber": 5.2, "protein": 7.5, "sodium": 580, "salt": 1.45}),
        ("TagZ Multi-Seed Cookies (Choco Chip)", "Biscuits", "Choco Chip Multi-Seed", "Nutrient-dense crunchy cookies baked with raw seeds, dark chocolate chips, and whole oats.",
         "Whole Wheat Flour (32%), Rolled Oats (20%), Seeds Mix (Sunflower & Chia Seeds 12%), Dark Chocolate Chips (14%), Butter, Jaggery, Vanilla, Raising Agent (INS 500(ii)).",
         {"calories": 480, "totalFat": 22.0, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 20.0, "addedSugars": 18.0, "fiber": 8.2, "protein": 12.5, "sodium": 180, "salt": 0.45}),
        ("TagZ Multi-Seed Cookies (Oats)", "Biscuits", "Oats Multi-Seed", "Wholesome breakfast cookies packed with rolled oats, roasted seeds, and cinnamon.",
         "Rolled Oats (38%), Whole Wheat Flour (25%), Seeds Mix (Flax & Sunflower Seeds 15%), Butter, Raw Brown Sugar, Cinnamon Powder, Salt.",
         {"calories": 475, "totalFat": 21.0, "saturatedFat": 9.0, "transFat": 0.0, "carbohydrates": 59.0, "sugars": 18.0, "addedSugars": 16.0, "fiber": 9.0, "protein": 13.0, "sodium": 170, "salt": 0.42}),
        ("TagZ Gourmet Salsa Dip", "Spreads & Dips", "Chunky Salsa", "Fresh tomato, jalapeno, and cilantro Mexican dip with zero added preservatives.",
         "Diced Tomatoes (65%), Tomato Puree, Jalapeno Peppers (8%), Onion, Cilantro, Garlic, Lime Juice, Salt, Cumin.",
         {"calories": 45, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 9.5, "sugars": 4.5, "addedSugars": 0.0, "fiber": 2.0, "protein": 1.5, "sodium": 380, "salt": 0.95}),
        ("TagZ Gourmet Cheese Dip", "Spreads & Dips", "Cheesy Dip", "Creamy cheddar and jalapeño dipping sauce perfect for nachos and popped chips.",
         "Water, Cheddar Cheese (28%), Milk Solids, Butter, Modified Starch (INS 1442), Jalapeno, Salt, Lactic Acid (INS 270), Natural Colour (INS 160a).",
         {"calories": 210, "totalFat": 17.5, "saturatedFat": 10.5, "transFat": 0.1, "carbohydrates": 6.5, "sugars": 2.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 6.8, "sodium": 620, "salt": 1.55}),
        ("TagZ Gourmet Chipotle Dip", "Spreads & Dips", "Smoky Chipotle", "Smoky chipotle pepper mayonnaise-style plant dip with garlic and lime.",
         "Water, Sunflower Oil, Chipotle Chilli Paste (10%), Vinegar, Sugar, Salt, Mustard, Garlic, Modified Starch, Xanthan Gum (INS 415).",
         {"calories": 260, "totalFat": 24.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 9.0, "sugars": 4.5, "addedSugars": 3.5, "fiber": 1.0, "protein": 1.2, "sodium": 540, "salt": 1.35}),
        ("TagZ Popped Potato Chips Classic Salt (Extra Crisp)", "Chips", "Classic Salt", "Light-as-air popped potato crisps dusted with unrefined rock salt.",
         "Dried Potato Flakes (64%), Rice Flour, Sunflower Oil, Rock Salt (1.6%).",
         {"calories": 428, "totalFat": 12.8, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 5.4, "protein": 7.4, "sodium": 440, "salt": 1.10})
    ]
    for nm, scat, flav, dsc, ing, nut in tagz_variants:
        cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
        if scat in ["Spreads & Dips"]:
            cat = "Spreads, Dips & Sauces"
        elif scat in ["Biscuits"]:
            cat = "Wholesome Breakfast, Oats & Nut Butters"

        items.append({
            "brand": "TagZ", "name": nm, "cat": cat, "sub": scat, "type": "TagZ Clean Label Snacks",
            "mfr": "TagZ Foods Pvt Ltd", "flavour": flav, "wt": "50 g" if "Chips" in nm else "100 g", "price": 40 if "Chips" in nm else 80,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Never Fried Never Baked - Popped" if "Popped" in nm else "Superfood Hemp" if "Hemp" in nm else "Gourmet Quality", "Low Fat"]
        })

    # ----------------------------------------------------
    # 19. WICKEDGÜD (100MB Solutions Pvt Ltd) - 11 items
    # ----------------------------------------------------
    wickedgud_variants = [
        ("WickedGüd Chickpea Popped Chips Amreekan Cream & Onion", "Baked Chips", "Cream & Onion", "Popped chickpea crisps packed with 10g plant protein and creamy herbs.",
         "Chickpea Flour (Chana Flour 42%), Rice Flour, Sunflower Oil, Seasoning (Milk Solids (Sour Cream), Onion Powder (2.4%), Parsley, Salt, Sugar, Lactic Acid (INS 270)).",
         {"calories": 430, "totalFat": 13.0, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 3.2, "addedSugars": 1.8, "fiber": 8.0, "protein": 12.5, "sodium": 520, "salt": 1.30}),
        ("WickedGüd Chickpea Popped Chips Desi Masala", "Baked Chips", "Desi Masala", "High-protein popped chickpea chips coated in authentic Indian street chatpata masala.",
         "Chickpea Flour (44%), Rice Flour, Sunflower Oil, Seasoning (Coriander, Cumin, Red Chilli, Amchur, Black Salt, Iodised Salt, Acidity Regulator (INS 330)).",
         {"calories": 428, "totalFat": 12.8, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 65.5, "sugars": 2.0, "addedSugars": 1.0, "fiber": 8.2, "protein": 12.8, "sodium": 580, "salt": 1.45}),
        ("WickedGüd Chickpea Popped Chips Fiery Peri Peri", "Baked Chips", "Fiery Peri Peri", "Popped roasted chickpea crisps glazed with fiery African bird's eye chilli and lemon zest.",
         "Chickpea Flour (44%), Rice Flour, Sunflower Oil, Seasoning (Chilli, Garlic, Onion, Black Pepper, Salt, Sugar, Citric Acid (INS 330), Paprika Extract (INS 160c)).",
         {"calories": 432, "totalFat": 13.2, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 64.8, "sugars": 2.4, "addedSugars": 1.4, "fiber": 8.1, "protein": 12.6, "sodium": 610, "salt": 1.52}),
        ("WickedGüd Chickpea Popped Chips Tangy Tomato", "Baked Chips", "Tangy Tomato", "Popped chickpea chips dusted with sun-dried sweet and tangy ripe tomato powder.",
         "Chickpea Flour (42%), Rice Flour, Sunflower Oil, Seasoning (Tomato Powder (3.4%), Sugar, Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296)).",
         {"calories": 426, "totalFat": 12.5, "saturatedFat": 2.3, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 4.8, "addedSugars": 3.5, "fiber": 7.8, "protein": 12.2, "sodium": 540, "salt": 1.35}),
        ("WickedGüd Cheesy Mac & Cheese Meal Kit", "Instant Pasta", "Mac & Cheese", "Guilt-free mac and cheese made from durum wheat, red lentils, and genuine cheese sauce mix.",
         "Pasta (Durum Wheat Semolina 70%, Red Lentil Flour 15%, Chickpea Flour 5%). Cheese Sauce Mix (Cheddar Cheese Powder (40%), Milk Solids, Corn Starch, Salt, Garlic).",
         {"calories": 380, "totalFat": 6.5, "saturatedFat": 3.5, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 4.5, "addedSugars": 1.0, "fiber": 7.5, "protein": 14.5, "sodium": 590, "salt": 1.48}),
        ("WickedGüd Lentil & Brown Rice Noodles (Curry Masala)", "Instant Noodles", "Curry Masala", "Air-dried oil-free noodles made with chickpea, red lentils, and brown rice.",
         "Noodles (Brown Rice Flour, Red Lentil Flour, Chickpea Flour, Oats Flour). Tastemaker (Mixed Spices (Cumin, Coriander, Turmeric), Salt, Tomato, Onion, Garlic).",
         {"calories": 355, "totalFat": 2.5, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 9.5, "protein": 15.0, "sodium": 680, "salt": 1.70}),
        ("WickedGüd High-Protein Penne Pasta (Millet & Lentil)", "Pasta", "Protein Penne", "100% maida-free penne pasta packed with 24g protein from red lentils, chickpeas, and jowar.",
         "Durum Wheat Semolina (50%), Red Lentil Flour (25%), Chickpea Flour (15%), Jowar Flour (10%).",
         {"calories": 360, "totalFat": 2.0, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 11.0, "protein": 18.0, "sodium": 20, "salt": 0.05}),
        ("WickedGüd High-Protein Fusilli Pasta", "Pasta", "Protein Fusilli", "Spiral-cut durum wheat and lentil pasta with excellent sauce holding capacity and zero maida.",
         "Durum Wheat Semolina, Red Lentil Flour, Chickpea Flour.",
         {"calories": 360, "totalFat": 2.0, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 11.0, "protein": 18.0, "sodium": 20, "salt": 0.05}),
        ("WickedGüd High-Protein Macaroni Pasta", "Pasta", "Protein Macaroni", "Elbow macaroni enriched with plant pulses providing 3x fiber of regular pasta.",
         "Durum Wheat Semolina, Red Lentil Flour, Chickpea Flour, Brown Rice.",
         {"calories": 360, "totalFat": 2.0, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 11.0, "protein": 18.0, "sodium": 20, "salt": 0.05}),
        ("WickedGüd Brown Rice Hakka Noodles", "Hakka & Flat Noodles", "Hakka Noodles", "100% steamed air-dried hakka noodles crafted from brown rice, jowar, and durum wheat.",
         "Durum Wheat Semolina (60%), Brown Rice Flour (20%), Jowar Flour (15%), Wheat Gluten, Salt.",
         {"calories": 350, "totalFat": 1.8, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 70.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 14.0, "sodium": 310, "salt": 0.78}),
        ("WickedGüd Schezwan Lentil Noodles", "Instant Noodles", "Schezwan", "Spicy Indo-Chinese noodles powered by pulses and whole grains with fiery Sichuan seasoning.",
         "Noodles (Lentils, Brown Rice, Durum Wheat). Seasoning (Sichuan Pepper, Garlic, Soy Sauce, Chilli, Salt, Sugar, Citric Acid).",
         {"calories": 358, "totalFat": 2.8, "saturatedFat": 0.6, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 3.0, "addedSugars": 1.0, "fiber": 9.2, "protein": 14.8, "sodium": 710, "salt": 1.78})
    ]
    for nm, scat, flav, dsc, ing, nut in wickedgud_variants:
        cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
        if scat in ["Instant Pasta", "Instant Noodles", "Pasta", "Hakka & Flat Noodles"]:
            cat = "Noodles & Ready-to-Eat"

        items.append({
            "brand": "WickedGüd", "name": nm, "cat": cat, "sub": scat, "type": "Better-For-You Staples & Chips",
            "mfr": "100MB Solutions Pvt Ltd", "flavour": flav, "wt": "50 g" if "Chips" in nm else "250 g", "price": 40 if "Chips" in nm else 99,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["100% Maida Free", "Powered by Chickpea & Lentils", "High Plant Protein"]
        })

    return items

print("Section 4 part 1 written successfully.")
