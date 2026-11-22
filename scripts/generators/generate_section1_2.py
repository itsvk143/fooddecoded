import json

def get_section1_2():
    items = []
    
    # ----------------------------------------------------
    # 1. LAY'S (PepsiCo India Holdings Pvt Ltd)
    # ----------------------------------------------------
    # Lay's Maxx (3)
    items.append({
        "brand": "Lay's", "name": "Lay's Maxx Macho Chilli Ridged Potato Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Ridged Potato Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Macho Chilli", "wt": "50 g", "price": 20,
        "desc": "Deep ridged crunchy potato chips with an intense spicy red chilli burst and robust seasoning.",
        "ing": "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Spices and Condiments (Chilli Powder 1.4%), Salt, Sugar, Maltodextrin, Acidity Regulators (INS 330, INS 296), Flavour Enhancers (INS 627, INS 631), Anticaking Agent (INS 551)).",
        "nut": {"calories": 544, "totalFat": 33.2, "saturatedFat": 14.8, "transFat": 0.1, "carbohydrates": 54.6, "sugars": 2.8, "addedSugars": 2.1, "fiber": 3.4, "protein": 6.8, "sodium": 820, "salt": 2.05},
        "highlights": ["Deep Ridged Crunch", "Contains Palm Oil", "High Sodium", "Flavor Enhancers INS 627, 631"]
    })
    items.append({
        "brand": "Lay's", "name": "Lay's Maxx Sizzling Barbeque Ridged Potato Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Ridged Potato Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Sizzling Barbeque", "wt": "50 g", "price": 20,
        "desc": "Maxx ridges loaded with sweet and smoky BBQ flavor with hint of caramelized onion and paprika.",
        "ing": "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Salt, Maltodextrin, Tomato Powder, Onion Powder, Garlic Powder, Spices, Smoked Flavour, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
        "nut": {"calories": 540, "totalFat": 32.8, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 55.2, "sugars": 4.2, "addedSugars": 3.5, "fiber": 3.2, "protein": 6.5, "sodium": 790, "salt": 1.98},
        "highlights": ["Smoky Barbeque Taste", "Contains Palm Oil", "High Saturated Fat"]
    })
    items.append({
        "brand": "Lay's", "name": "Lay's Maxx Pepper Barbeque Ridged Potato Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Ridged Potato Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Pepper Barbeque", "wt": "50 g", "price": 20,
        "desc": "Thick serrated ridges coated in cracked black pepper and char-grilled barbeque seasoning.",
        "ing": "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Black Pepper Powder, Salt, Sugar, Onion Powder, Garlic Powder, Natural Smoked Flavour, Acidity Regulators (INS 330, INS 270), Flavour Enhancers (INS 627, INS 631)).",
        "nut": {"calories": 542, "totalFat": 33.0, "saturatedFat": 14.6, "transFat": 0.1, "carbohydrates": 54.8, "sugars": 3.0, "addedSugars": 2.4, "fiber": 3.5, "protein": 6.7, "sodium": 810, "salt": 2.02},
        "highlights": ["Cracked Black Pepper", "Contains Palm Oil", "Intense Ridge Cut"]
    })
    # Lay's Gourmet (3)
    items.append({
        "brand": "Lay's", "name": "Lay's Gourmet Thai Sweet Chilli Kettle Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Kettle Cooked Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Thai Sweet Chilli", "wt": "55 g", "price": 30,
        "desc": "Slow-cooked kettle potato chips seasoned with authentic Thai sweet chilli, ginger, and lemongrass notes.",
        "ing": "Potato (58%), Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Salt, Spices (Chilli, Ginger), Garlic Powder, Onion Powder, Tamarind Powder, Acidity Regulator (INS 330), Paprika Extract (INS 160c), Flavour Enhancers (INS 627, INS 631)).",
        "nut": {"calories": 528, "totalFat": 30.5, "saturatedFat": 13.8, "transFat": 0.05, "carbohydrates": 57.2, "sugars": 4.8, "addedSugars": 4.0, "fiber": 3.8, "protein": 6.2, "sodium": 680, "salt": 1.70},
        "highlights": ["Kettle Cooked Extra Crunch", "Authentic Thai Spices", "Contains Palm Oil"]
    })
    items.append({
        "brand": "Lay's", "name": "Lay's Gourmet Lime & Cracked Pepper Kettle Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Kettle Cooked Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Lime & Cracked Pepper", "wt": "55 g", "price": 30,
        "desc": "Batch-cooked thick cut potato chips tossed in zesty kaffir lime and coarsely cracked Tellicherry black pepper.",
        "ing": "Potato (58%), Edible Vegetable Oil (Palmolein), Seasoning (Black Pepper (1.8%), Lime Juice Powder (0.8%), Salt, Sugar, Maltodextrin, Acidity Regulator (INS 330), Natural Flavouring Substances).",
        "nut": {"calories": 526, "totalFat": 30.2, "saturatedFat": 13.6, "transFat": 0.05, "carbohydrates": 57.5, "sugars": 2.2, "addedSugars": 1.5, "fiber": 3.9, "protein": 6.3, "sodium": 650, "salt": 1.62},
        "highlights": ["Zesty Lime & Black Pepper", "Slow Kettle Fried", "Thick Cut"]
    })
    items.append({
        "brand": "Lay's", "name": "Lay's Gourmet Vintage Cheese & Paprika Kettle Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Kettle Cooked Chips",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Vintage Cheese & Paprika", "wt": "55 g", "price": 30,
        "desc": "Handcrafted kettle chips glazed with mature English style cheese and smoky sweet Spanish paprika.",
        "ing": "Potato (58%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (2.4%), Milk Solids, Paprika (1.2%), Salt, Sugar, Yeast Extract, Acidity Regulator (INS 270), Natural Colour (INS 160c)).",
        "nut": {"calories": 532, "totalFat": 31.0, "saturatedFat": 14.0, "transFat": 0.05, "carbohydrates": 56.5, "sugars": 3.0, "addedSugars": 1.8, "fiber": 3.6, "protein": 6.8, "sodium": 710, "salt": 1.78},
        "highlights": ["Real Vintage Cheese", "Smoky Paprika", "Dairy Solids Allergen"]
    })
    # Lay's Crisp Canister (2)
    items.append({
        "brand": "Lay's", "name": "Lay's Crisp Herb & Onion Canister Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Stackable Potato Crisps",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Herb & Onion", "wt": "110 g", "price": 99,
        "desc": "Stackable uniform potato crisps seasoned with dried chives, parsley, and sweet creamy onion in a canister.",
        "ing": "Dried Potato Flakes (48%), Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Onion Powder (1.8%), Dried Herbs (Parsley, Chives 0.6%), Salt, Sugar, Whey Powder, Flavour Enhancers (INS 627, INS 631)).",
        "nut": {"calories": 515, "totalFat": 28.5, "saturatedFat": 12.8, "transFat": 0.05, "carbohydrates": 60.0, "sugars": 3.2, "addedSugars": 2.0, "fiber": 4.0, "protein": 5.5, "sodium": 690, "salt": 1.72},
        "highlights": ["Canister Pack", "Dried Herbs & Chives", "Contains Wheat Gluten"]
    })
    items.append({
        "brand": "Lay's", "name": "Lay's Crisp Classic Salted Canister Chips",
        "cat": "Snacks & Spreads", "sub": "Chips", "type": "Stackable Potato Crisps",
        "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": "Classic Salted", "wt": "110 g", "price": 99,
        "desc": "Crispy golden stacked potato crisps made with potato flakes and sea salt in an airtight resealable canister.",
        "ing": "Dried Potato Flakes (52%), Edible Vegetable Oil (Palmolein), Rice Flour, Wheat Starch, Iodised Salt (1.6%), Emulsifier (INS 471), Dextrose.",
        "nut": {"calories": 510, "totalFat": 28.0, "saturatedFat": 12.5, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 1.0, "addedSugars": 0.5, "fiber": 4.1, "protein": 5.4, "sodium": 640, "salt": 1.60},
        "highlights": ["Stackable Crisps", "Pure Sea Salt", "Resealable Canister"]
    })

    # ----------------------------------------------------
    # 2. KURKURE (PepsiCo India Holdings Pvt Ltd) - 10 items
    # ----------------------------------------------------
    kurkure_variants = [
        ("Kurkure Green Chutney Rajasthani Style", "Extruded Snacks", "Green Chutney", "Rich mint and coriander street-style chutney spice blend on crispy corn and rice meal collets.", 
         "Rice Meal (42.8%), Edible Vegetable Oil (Palmolein), Corn Meal (19.8%), Gram Meal (3.3%), Seasoning (Spices (Mint, Coriander, Chilli), Salt, Sugar, Tamarind, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 558, "totalFat": 35.0, "saturatedFat": 15.6, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 2.4, "addedSugars": 1.5, "fiber": 2.8, "protein": 6.5, "sodium": 880, "salt": 2.20}),
        ("Kurkure Chilli Chatka", "Extruded Snacks", "Chilli Chatka", "Extra spicy red and green chilli seasoned crunchy puffed curls with tangy amchur hit.",
         "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Seasoning (Red Chilli, Dry Mango Powder, Cumin, Black Pepper, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 560, "totalFat": 35.5, "saturatedFat": 15.8, "transFat": 0.1, "carbohydrates": 53.5, "sugars": 2.0, "addedSugars": 1.2, "fiber": 2.7, "protein": 6.6, "sodium": 910, "salt": 2.28}),
        ("Kurkure Naughty Tomato", "Extruded Snacks", "Naughty Tomato", "Sweet and tangy tomato sauce flavored corn meal crunchy snack with mild spices.",
         "Rice Meal (42%), Edible Vegetable Oil (Palmolein), Corn Meal (20%), Gram Meal, Seasoning (Sugar, Tomato Powder (1.8%), Salt, Onion Powder, Garlic Powder, Acidity Regulator (INS 330, INS 296), Paprika Extract (INS 160c)).",
         {"calories": 548, "totalFat": 33.5, "saturatedFat": 15.0, "transFat": 0.1, "carbohydrates": 56.0, "sugars": 5.2, "addedSugars": 4.5, "fiber": 2.5, "protein": 6.0, "sodium": 760, "salt": 1.90}),
        ("Kurkure Hyderabadi Hungama", "Extruded Snacks", "Hyderabadi Spices", "Fiery southern spice blend featuring roasted curry leaves, black pepper, and tangy lime.",
         "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Seasoning (Spices, Curry Leaves Powder (0.8%), Black Pepper, Red Chilli, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 555, "totalFat": 34.8, "saturatedFat": 15.5, "transFat": 0.1, "carbohydrates": 54.2, "sugars": 2.2, "addedSugars": 1.4, "fiber": 2.9, "protein": 6.4, "sodium": 890, "salt": 2.22}),
        ("Kurkure Schezwan Chutney", "Extruded Snacks", "Schezwan Chutney", "Desi-Chinese fusion of Sichuan peppercorns, roasted garlic, and fiery red chillies.",
         "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Seasoning (Garlic, Sichuan Pepper, Ginger, Red Chilli, Salt, Sugar, Soya Sauce Powder, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 552, "totalFat": 34.2, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 54.8, "sugars": 3.1, "addedSugars": 2.5, "fiber": 2.6, "protein": 6.3, "sodium": 870, "salt": 2.18}),
        ("Kurkure Sizzlin' Hot", "Extruded Snacks", "Sizzlin' Hot", "PepsiCo signature scorching ghost chilli and paprika spice glaze on iconic Kurkure curls.",
         "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Seasoning (Paprika, Red Chilli, Black Pepper, Salt, Sugar, Maltodextrin, Acidity Regulator (INS 330), Natural Color (INS 160c), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 562, "totalFat": 35.8, "saturatedFat": 16.0, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 2.5, "addedSugars": 1.8, "fiber": 2.8, "protein": 6.7, "sodium": 940, "salt": 2.35}),
        ("Kurkure Solid Masti Twisteez Masala", "Extruded Snacks", "Twisteez Masala", "Thick spiraled twisted sticks offering a solid dense crunch and Chatpata masala seasoning.",
         "Rice Meal, Corn Meal, Edible Vegetable Oil (Palmolein), Gram Flour, Seasoning (Coriander, Cumin, Red Chilli, Amchur, Black Salt, Iodised Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 540, "totalFat": 33.0, "saturatedFat": 14.8, "transFat": 0.1, "carbohydrates": 55.5, "sugars": 2.8, "addedSugars": 2.0, "fiber": 3.0, "protein": 6.8, "sodium": 830, "salt": 2.08}),
        ("Kurkure Playz Puffcorn Yummy Cheese", "Extruded Snacks", "Yummy Cheese", "Melt-in-the-mouth puffed corn curls coated in creamy cheddar cheese powder.",
         "Corn Meal (52.6%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (4.2%), Milk Solids, Salt, Sugar, Maltodextrin, Yeast Extract, Acidity Regulator (INS 270), Natural Colour (INS 160c)).",
         {"calories": 535, "totalFat": 32.0, "saturatedFat": 14.2, "transFat": 0.05, "carbohydrates": 56.5, "sugars": 4.5, "addedSugars": 2.8, "fiber": 2.2, "protein": 5.8, "sodium": 720, "salt": 1.80}),
        ("Kurkure Playz Pastax Masala", "Extruded Snacks", "Masala Pastax", "Fun pasta-shaped extruded wheat and corn shells dusted with Indian street masala.",
         "Wheat Flour (Atta 38%), Corn Meal (24%), Edible Vegetable Oil (Palmolein), Gram Meal, Seasoning (Chilli, Onion, Garlic, Cumin, Black Salt, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 528, "totalFat": 31.0, "saturatedFat": 13.8, "transFat": 0.05, "carbohydrates": 57.0, "sugars": 2.6, "addedSugars": 1.8, "fiber": 3.5, "protein": 6.5, "sodium": 800, "salt": 2.00}),
        ("Kurkure Multigrain Lite & Crunchy Masala", "Extruded Snacks", "Multigrain Masala", "Lighter baked multigrain collets crafted from ragi, corn, rice, and oats with mild masala.",
         "Multigrain Flour (Corn, Rice, Ragi, Oats 62%), Edible Vegetable Oil (Rice Bran Oil), Seasoning (Spices, Salt, Dry Mango, Black Pepper, Acidity Regulator (INS 330)).",
         {"calories": 485, "totalFat": 24.5, "saturatedFat": 7.2, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 2.0, "addedSugars": 1.0, "fiber": 5.5, "protein": 7.8, "sodium": 640, "salt": 1.60})
    ]
    for nm, scat, flav, dsc, ing, nut in kurkure_variants:
        items.append({
            "brand": "Kurkure", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Extruded Corn & Rice Snacks",
            "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": flav, "wt": "45 g", "price": 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Extruded Collets", "Classic Spiced Taste", "Contains Palm Oil" if "Palmolein" in ing else "Rice Bran Oil"]
        })

    # ----------------------------------------------------
    # 3. BINGO! (ITC Limited) - 11 items
    # ----------------------------------------------------
    bingo_variants = [
        ("Bingo! Mad Angles Tomato Madness", "Chips", "Tomato Madness", "Triangle corn chips with a juicy sweet and tangy ripe tomato punch.",
         "Corn Grits (38%), Rice Grits (20%), Edible Vegetable Oil (Palmolein), Degermed Corn, Seasoning (Sugar, Tomato Powder (2.4%), Salt, Spices, Acidity Regulators (INS 330, INS 296), Paprika Extract (INS 160c)).",
         {"calories": 538, "totalFat": 31.5, "saturatedFat": 14.0, "transFat": 0.05, "carbohydrates": 58.0, "sugars": 5.8, "addedSugars": 4.8, "fiber": 3.2, "protein": 6.0, "sodium": 740, "salt": 1.85}),
        ("Bingo! Mad Angles Masala Madness", "Chips", "Masala Madness", "Iconic triangular grain chips seasoned with a proprietary blend of 12 roasted Indian spices.",
         "Corn Grits (38%), Rice Grits, Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Salt, Sugar, Maltodextrin, Black Salt, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 542, "totalFat": 32.0, "saturatedFat": 14.2, "transFat": 0.05, "carbohydrates": 57.0, "sugars": 3.0, "addedSugars": 2.2, "fiber": 3.4, "protein": 6.2, "sodium": 860, "salt": 2.15}),
        ("Bingo! Mad Angles Pizza Aah", "Chips", "Pizza Aah", "Crispy triangles packed with Italian pizza herb seasoning, tomato, oregano, and cheese notes.",
         "Corn Grits, Rice Grits, Edible Vegetable Oil (Palmolein), Seasoning (Tomato Powder, Cheese Powder, Dried Oregano, Basil, Garlic, Onion, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 536, "totalFat": 31.2, "saturatedFat": 13.9, "transFat": 0.05, "carbohydrates": 58.2, "sugars": 4.2, "addedSugars": 3.2, "fiber": 3.1, "protein": 6.1, "sodium": 760, "salt": 1.90}),
        ("Bingo! Mad Angles Cheese Nachos", "Chips", "Cheese Nachos", "Crunchy corn angles tossed in velvety melted cheddar cheese seasoning.",
         "Corn Grits (42%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.2%), Milk Solids, Salt, Sugar, Onion, Garlic, Yeast Extract, Natural Colour (INS 160c)).",
         {"calories": 540, "totalFat": 32.2, "saturatedFat": 14.5, "transFat": 0.05, "carbohydrates": 56.8, "sugars": 3.5, "addedSugars": 2.2, "fiber": 3.0, "protein": 6.5, "sodium": 780, "salt": 1.95}),
        ("Bingo! Tedhe Medhe Chatpata Twist", "Extruded Snacks", "Chatpata Twist", "Spindle-shaped spindle twists tossed with tangy amchur, black salt, and roasted cumin.",
         "Rice Grits, Edible Vegetable Oil (Palmolein), Corn Grits, Gram Grits, Seasoning (Dry Mango, Black Salt, Cumin, Red Chilli, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 55.0, "sugars": 2.5, "addedSugars": 1.8, "fiber": 2.9, "protein": 6.4, "sodium": 880, "salt": 2.20}),
        ("Bingo! Tedhe Medhe Xtra Teekha", "Extruded Snacks", "Xtra Teekha", "Extra fiery spindle curls loaded with Guntur red chillies and crushed black peppercorns.",
         "Rice Grits, Edible Vegetable Oil (Palmolein), Corn Grits, Gram Grits, Seasoning (Guntur Red Chilli (2.5%), Black Pepper, Garlic, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 554, "totalFat": 34.5, "saturatedFat": 15.5, "transFat": 0.1, "carbohydrates": 54.2, "sugars": 2.2, "addedSugars": 1.5, "fiber": 3.0, "protein": 6.6, "sodium": 920, "salt": 2.30}),
        ("Bingo! Original Style Salt Sprinkled Potato Chips", "Chips", "Salt Sprinkled", "Thin cut crispy flat potato chips seasoned with fine micro-ground table salt.",
         "Potato (62%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
         {"calories": 550, "totalFat": 34.5, "saturatedFat": 15.2, "transFat": 0.05, "carbohydrates": 53.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.8, "sodium": 590, "salt": 1.48}),
        ("Bingo! Original Style Chatkila Nimbu Potato Chips", "Chips", "Chatkila Nimbu", "Thin potato chips infused with tangy Indian lemon zest, rock salt, and green chillies.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Lemon Juice Powder (1.2%), Rock Salt, Green Chilli, Cumin, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 545, "totalFat": 33.8, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.2, "sugars": 2.0, "addedSugars": 1.4, "fiber": 3.4, "protein": 6.5, "sodium": 760, "salt": 1.90}),
        ("Bingo! Original Style Tandoori Masala Potato Chips", "Chips", "Tandoori Masala", "Potato chips capturing the smoky charcoal roasted aroma of Punjabi tandoori spices.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Coriander, Cumin, Kasuri Methi, Ginger, Garlic, Salt, Sugar, Smoked Flavour, Acidity Regulator (INS 330), Natural Colour (INS 160c)).",
         {"calories": 548, "totalFat": 34.0, "saturatedFat": 15.1, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 2.6, "addedSugars": 1.8, "fiber": 3.3, "protein": 6.6, "sodium": 820, "salt": 2.05}),
        ("Bingo! Street Bites Dahi Chaat", "Chips", "Dahi Chaat", "Street food inspired snack chips with the sweet, sour, and creamy notes of fresh dahi and tamarind chutney.",
         "Corn Grits, Rice Grits, Edible Vegetable Oil (Palmolein), Seasoning (Yogurt Powder (2.2%), Tamarind Powder, Cumin, Black Salt, Sugar, Salt, Acidity Regulators (INS 330, INS 270)).",
         {"calories": 525, "totalFat": 29.5, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 59.0, "sugars": 6.2, "addedSugars": 4.8, "fiber": 2.8, "protein": 5.8, "sodium": 710, "salt": 1.78}),
        ("Bingo! Street Bites Pani Puri Twist", "Chips", "Pani Puri Twist", "Hollow crispy bites packed with pudina water zing, tangy hing, and spicy jaljeera essence.",
         "Wheat Flour, Corn Starch, Edible Vegetable Oil (Palmolein), Seasoning (Mint Powder (1.8%), Dry Mango, Asafoetida (Hing), Black Salt, Green Chilli, Rock Salt, Acidity Regulator (INS 330)).",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.2, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 2.4, "addedSugars": 1.5, "fiber": 3.6, "protein": 6.2, "sodium": 890, "salt": 2.22})
    ]
    for nm, scat, flav, dsc, ing, nut in bingo_variants:
        items.append({
            "brand": "Bingo!", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Potato & Grain Chips",
            "mfr": "ITC Limited", "flavour": flav, "wt": "50 g", "price": 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["ITC Signature Taste", "Crispy Grain Matrix", "Contains Palm Oil"]
        })

    # ----------------------------------------------------
    # 4. PRINGLES (Kellogg India Pvt Ltd) - 7 items
    # ----------------------------------------------------
    pringles_variants = [
        ("Pringles Pizza Flavoured Potato Crisps", "Pizza", "Savory stackable crisps bursting with tomato, cheese, garlic, and Italian pizza seasonings.",
         "Dried Potato (45%), Edible Vegetable Oil (Palm Olein), Wheat Starch, Rice Flour, Seasoning (Tomato Powder (2.2%), Cheddar Cheese Powder, Onion, Garlic, Oregano, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 520, "totalFat": 30.0, "saturatedFat": 13.5, "transFat": 0.05, "carbohydrates": 57.0, "sugars": 3.8, "addedSugars": 2.5, "fiber": 3.5, "protein": 5.5, "sodium": 680, "salt": 1.70}),
        ("Pringles Schezwan Chutney Potato Crisps", "Schezwan Chutney", "Indo-Chinese spicy Sichuan peppercorn and garlic flavored curved potato crisps.",
         "Dried Potato (45%), Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Sichuan Chilli, Garlic Powder, Soy Sauce Powder, Ginger, Salt, Sugar, Acidity Regulator (INS 260), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 524, "totalFat": 30.5, "saturatedFat": 13.8, "transFat": 0.05, "carbohydrates": 56.5, "sugars": 2.8, "addedSugars": 2.0, "fiber": 3.4, "protein": 5.6, "sodium": 750, "salt": 1.88}),
        ("Pringles Salt & Seaweed Potato Crisps", "Salt & Seaweed", "Delicate umami-rich Japanese nori seaweed flakes and sea salt dusted over crispy potato saddle chips.",
         "Dried Potato, Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Roasted Seaweed Flakes (Nori 1.5%), Sea Salt, Sugar, Yeast Extract, Soy Sauce Powder).",
         {"calories": 515, "totalFat": 29.5, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 58.0, "sugars": 1.8, "addedSugars": 1.0, "fiber": 3.6, "protein": 5.8, "sodium": 620, "salt": 1.55}),
        ("Pringles Scorchin' BBQ Potato Crisps", "Scorchin' BBQ", "Intensely fiery smoky barbeque crisps with habanero heat that builds with every bite.",
         "Dried Potato, Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Habanero Chilli (1.6%), Paprika, Smoked Onion, Garlic, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 530, "totalFat": 31.0, "saturatedFat": 14.0, "transFat": 0.05, "carbohydrates": 56.0, "sugars": 3.5, "addedSugars": 2.6, "fiber": 3.3, "protein": 5.5, "sodium": 810, "salt": 2.02}),
        ("Pringles Scorchin' Chili & Lime Potato Crisps", "Scorchin' Chili & Lime", "High-heat red chilli seasoning balanced with a sharp tart lime finish on hyperbolic paraboloid crisps.",
         "Dried Potato, Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Red Chilli, Lime Juice Powder, Salt, Sugar, Acidity Regulator (INS 330), Paprika Extract (INS 160c)).",
         {"calories": 528, "totalFat": 30.8, "saturatedFat": 13.9, "transFat": 0.05, "carbohydrates": 56.2, "sugars": 2.5, "addedSugars": 1.8, "fiber": 3.4, "protein": 5.4, "sodium": 830, "salt": 2.08}),
        ("Pringles Mexican Street Corn Potato Crisps", "Mexican Street Corn", "Elote inspired potato crisps with charred corn, creamy cotija cheese, chilli powder, and lime.",
         "Dried Potato, Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Roasted Sweet Corn Powder, Cheese Powder, Lime Juice, Chilli, Salt, Sugar, Yeast Extract).",
         {"calories": 522, "totalFat": 30.2, "saturatedFat": 13.6, "transFat": 0.05, "carbohydrates": 57.2, "sugars": 3.6, "addedSugars": 2.4, "fiber": 3.5, "protein": 5.6, "sodium": 690, "salt": 1.72}),
        ("Pringles Jalapeno Potato Crisps", "Jalapeno", "Bright green spicy jalapeno pepper kick with a gentle garlicky undertone in a canister.",
         "Dried Potato, Edible Vegetable Oil (Palm Olein), Rice Flour, Wheat Starch, Seasoning (Jalapeno Pepper Powder (1.8%), Onion Powder, Garlic Powder, Salt, Sugar, Acidity Regulator (INS 330), Natural Flavouring).",
         {"calories": 518, "totalFat": 29.8, "saturatedFat": 13.4, "transFat": 0.05, "carbohydrates": 57.5, "sugars": 2.2, "addedSugars": 1.5, "fiber": 3.6, "protein": 5.5, "sodium": 710, "salt": 1.78})
    ]
    for nm, flav, dsc, ing, nut in pringles_variants:
        items.append({
            "brand": "Pringles", "name": nm, "cat": "Snacks & Spreads", "sub": "Chips", "type": "Stackable Potato Crisps",
            "mfr": "Kellogg India Pvt Ltd", "flavour": flav, "wt": "107 g", "price": 115,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Iconic Canister Packaging", "Stackable Uniform Crisps", "Contains Wheat Gluten"]
        })

    # ----------------------------------------------------
    # 5. DORITOS (PepsiCo India Holdings Pvt Ltd) - 4 items
    # ----------------------------------------------------
    doritos_variants = [
        ("Doritos Masala Mayhem Tortilla Chips", "Masala Mayhem", "Crunchy triangle corn chips coated in a vibrant Indian street masala blend.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Spices (Chilli, Cumin, Coriander), Salt, Sugar, Onion, Garlic, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 498, "totalFat": 25.5, "saturatedFat": 11.2, "transFat": 0.05, "carbohydrates": 61.2, "sugars": 2.5, "addedSugars": 1.8, "fiber": 4.5, "protein": 6.8, "sodium": 760, "salt": 1.90}),
        ("Doritos Cool Ranch Tortilla Chips", "Cool Ranch", "The international classic buttermilk, garlic, onion, and herbs seasoning on golden toasted corn tortillas.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Buttermilk Powder (2.4%), Tomato Powder, Onion Powder, Garlic Powder, Cheddar Cheese Powder, Salt, Sugar, Parsley, Acidity Regulators (INS 330, INS 296, INS 270)).",
         {"calories": 502, "totalFat": 26.0, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 3.0, "addedSugars": 2.0, "fiber": 4.2, "protein": 7.0, "sodium": 680, "salt": 1.70}),
        ("Doritos Flamin' Hot Nacho Tortilla Chips", "Flamin' Hot Nacho", "The fiery fusion of bold nacho cheese and extreme Flamin' Hot chilli crunch.",
         "Corn (67%), Edible Vegetable Oil (Palmolein), Seasoning (Cheddar Cheese Powder, Whey, Paprika, Red Chilli, Salt, Sugar, Onion, Garlic, Buttermilk, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 505, "totalFat": 26.5, "saturatedFat": 11.8, "transFat": 0.05, "carbohydrates": 59.8, "sugars": 2.8, "addedSugars": 1.8, "fiber": 4.4, "protein": 7.2, "sodium": 820, "salt": 2.05}),
        ("Doritos Dinamita Fiery Lime & Chilli Rolled Tortilla Chips", "Fiery Lime & Chilli", "Tightly rolled crispy corn taquito-style chips bursting with sharp lime and fiery chilli zest.",
         "Corn Masa Flour (70%), Edible Vegetable Oil (Palmolein), Seasoning (Lime Juice Solids (1.5%), Red Chilli Powder, Salt, Sugar, Maltodextrin, Citric Acid (INS 330), Paprika Oleoresin (INS 160c)).",
         {"calories": 512, "totalFat": 27.2, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 60.0, "sugars": 2.2, "addedSugars": 1.5, "fiber": 4.6, "protein": 6.8, "sodium": 840, "salt": 2.10})
    ]
    for nm, flav, dsc, ing, nut in doritos_variants:
        items.append({
            "brand": "Doritos", "name": nm, "cat": "Snacks & Spreads", "sub": "Chips", "type": "Tortilla Corn Chips",
            "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": flav, "wt": "60 g", "price": 30,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Authentic Toasted Corn", "Bold Flavor Glaze", "High Crunch Triangle"]
        })

    # ----------------------------------------------------
    # 6. CHEETOS (PepsiCo India Holdings Pvt Ltd) - 7 items
    # ----------------------------------------------------
    cheetos_variants = [
        ("Cheetos Masala Balls Puffed Corn Snacks", "Puffs & Balls", "Masala Balls", "Melt-in-mouth airy corn spheres seasoned with tangy Indian spices.",
         "Corn Meal (65%), Edible Vegetable Oil (Palmolein), Seasoning (Spices (Chilli, Cumin, Coriander), Salt, Sugar, Amchur, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 520, "totalFat": 29.5, "saturatedFat": 13.2, "transFat": 0.05, "carbohydrates": 58.0, "sugars": 2.6, "addedSugars": 1.8, "fiber": 3.0, "protein": 5.8, "sodium": 780, "salt": 1.95}),
        ("Cheetos Cheese Puffs Corn Snacks", "Puffs & Balls", "Cheese Puffs", "Classic light and fluffy puffed corn fingers with real cheddar cheese coating.",
         "Corn Meal (66%), Edible Vegetable Oil (Palmolein), Seasoning (Cheddar Cheese Powder (4.5%), Whey, Salt, Sugar, Natural Color (INS 160c), Acidity Regulator (INS 270)).",
         {"calories": 525, "totalFat": 30.0, "saturatedFat": 13.5, "transFat": 0.05, "carbohydrates": 57.5, "sugars": 3.8, "addedSugars": 2.0, "fiber": 2.8, "protein": 6.2, "sodium": 720, "salt": 1.80}),
        ("Cheetos Whoosh Masala Swirls", "Puffs & Balls", "Whoosh Masala", "Fun helical twisted corn spirals loaded with tangy street chatpata masala.",
         "Corn Meal, Edible Vegetable Oil (Palmolein), Rice Meal, Seasoning (Red Chilli, Dry Mango, Black Pepper, Cumin, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 518, "totalFat": 29.0, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 58.5, "sugars": 2.8, "addedSugars": 2.0, "fiber": 3.1, "protein": 5.9, "sodium": 790, "salt": 1.98}),
        ("Cheetos Whoosh Cheese Swirls", "Puffs & Balls", "Whoosh Cheese", "Spiral shaped puffed corn snacks dusted with creamy mild parmesan and cheddar cheese seasoning.",
         "Corn Meal, Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.8%), Milk Solids, Salt, Sugar, Yeast Extract, Acidity Regulator (INS 270)).",
         {"calories": 522, "totalFat": 29.8, "saturatedFat": 13.4, "transFat": 0.05, "carbohydrates": 57.8, "sugars": 3.5, "addedSugars": 2.2, "fiber": 2.9, "protein": 6.0, "sodium": 710, "salt": 1.78}),
        ("Cheetos X&O Masala Corn Puffs", "Puffs & Balls", "X&O Masala", "Fun tic-tac-toe X and O shaped crunchy corn puffs with zesty masala seasoning.",
         "Corn Meal (64%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Onion, Garlic, Turmeric, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 515, "totalFat": 28.5, "saturatedFat": 12.8, "transFat": 0.05, "carbohydrates": 59.0, "sugars": 2.5, "addedSugars": 1.8, "fiber": 3.2, "protein": 5.7, "sodium": 770, "salt": 1.92}),
        ("Cheetos Crunchy Cheese Flavoured Corn Snacks", "Crunchy", "Crunchy Cheese", "Dense, crunchy extruded corn curls covered with authentic aged cheddar cheese.",
         "Corn Meal (68%), Edible Vegetable Oil (Palmolein), Seasoning (Cheddar Cheese Powder (5.2%), Buttermilk, Salt, Sugar, Natural Colour (INS 160c), Lactic Acid (INS 270)).",
         {"calories": 535, "totalFat": 31.5, "saturatedFat": 14.2, "transFat": 0.05, "carbohydrates": 56.0, "sugars": 3.2, "addedSugars": 1.8, "fiber": 3.0, "protein": 6.8, "sodium": 760, "salt": 1.90}),
        ("Cheetos Flamin' Hot Crunchy Corn Snacks", "Crunchy", "Flamin' Hot Crunchy", "The iconic American Flamin' Hot fiery recipe adapted with Indian red chilli crunch.",
         "Corn Meal (68%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli Powder, Garlic Powder, Onion Powder, Yeast Extract, Citric Acid (INS 330), Salt, Sugar, Paprika Oleoresin (INS 160c)).",
         {"calories": 538, "totalFat": 32.0, "saturatedFat": 14.5, "transFat": 0.05, "carbohydrates": 55.5, "sugars": 2.2, "addedSugars": 1.5, "fiber": 3.1, "protein": 6.9, "sodium": 860, "salt": 2.15})
    ]
    for nm, scat, flav, dsc, ing, nut in cheetos_variants:
        items.append({
            "brand": "Cheetos", "name": nm, "cat": "Snacks & Spreads", "sub": "Extruded Snacks", "type": "Extruded Corn Snacks",
            "mfr": "PepsiCo India Holdings Pvt Ltd", "flavour": flav, "wt": "40 g", "price": 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Chester Cheetah Favorite", "Made with Whole Corn Meal", "Crispy Puffed Texture"]
        })

    # ----------------------------------------------------
    # 8. BALAJI WAFERS (Balaji Wafers Pvt Ltd) - 8 items
    # ----------------------------------------------------
    balaji_variants = [
        ("Balaji Wafers Pizzy Masala Potato Wafers", "Chips", "Pizzy Masala", "Thin cut potato chips tossed with pizza herb seasoning, dried cheese, oregano, and chilli.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder, Tomato, Oregano, Chilli, Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.5, "sugars": 3.2, "addedSugars": 2.2, "fiber": 3.2, "protein": 6.4, "sodium": 780, "salt": 1.95}),
        ("Balaji Wafers Crunchex Chilli Tadka", "Chips", "Chilli Tadka", "Kettle-style crinkle cut chips with a tempered mustard and curry-leaf infused green chilli tadka.",
         "Potato (58%), Edible Vegetable Oil (Palmolein), Seasoning (Green Chilli (1.8%), Mustard, Curry Leaves, Salt, Sugar, Dry Mango, Acidity Regulator (INS 330)).",
         {"calories": 540, "totalFat": 33.0, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 55.0, "sugars": 2.5, "addedSugars": 1.8, "fiber": 3.4, "protein": 6.5, "sodium": 810, "salt": 2.02}),
        ("Balaji Wafers Rumbles & Wheelos Pudina Twist", "Extruded Snacks", "Pudina Twist", "Wheel-shaped potato and wheat flour pellets seasoned with cooling mint and amchur.",
         "Wheat Flour, Potato Flakes, Edible Vegetable Oil (Palmolein), Seasoning (Mint Powder (2.0%), Dry Mango, Black Salt, Cumin, Salt, Acidity Regulator (INS 330)).",
         {"calories": 490, "totalFat": 24.5, "saturatedFat": 11.0, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 2.2, "addedSugars": 1.2, "fiber": 3.8, "protein": 6.2, "sodium": 790, "salt": 1.98}),
        ("Balaji Wafers Sev Murmura", "Mixture & Namkeen", "Sev Murmura", "Light Gujarati puffed rice namkeen mixed with crispy fine besan sev, peanuts, and turmeric tempering.",
         "Puffed Rice (45%), Edible Vegetable Oil (Palmolein), Gram Flour (Besan 22%), Peanuts (8%), Iodised Salt, Turmeric Powder, Curry Leaves, Mustard Seeds, Green Chilli.",
         {"calories": 485, "totalFat": 23.0, "saturatedFat": 10.2, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 4.5, "protein": 8.8, "sodium": 650, "salt": 1.62}),
        ("Balaji Wafers Aloo Sev", "Mixture & Namkeen", "Aloo Sev", "Crispy extruded snack made from boiled potatoes and gram flour seasoned with mild mint and spices.",
         "Potato Flakes (28%), Gram Flour (40%), Edible Vegetable Oil (Palmolein), Salt, Red Chilli, Dry Mango, Mint, Black Pepper, Acidity Regulator (INS 330).",
         {"calories": 555, "totalFat": 35.0, "saturatedFat": 15.5, "transFat": 0.05, "carbohydrates": 52.0, "sugars": 1.8, "addedSugars": 0.8, "fiber": 4.2, "protein": 8.0, "sodium": 820, "salt": 2.05}),
        ("Balaji Wafers Tikha Mitha Mix", "Mixture & Namkeen", "Tikha Mitha Mix", "Sweet, spicy, and tangy Gujarati farsan mixture of sev, boondi, puffed rice, flakes, and nuts.",
         "Gram Flour (Besan 30%), Edible Vegetable Oil (Palmolein), Rice Flakes (Poha 15%), Peanuts (10%), Sugar, Salt, Dry Mango, Fennel, Turmeric, Red Chilli, Citric Acid (INS 330).",
         {"calories": 530, "totalFat": 31.5, "saturatedFat": 14.0, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 8.5, "addedSugars": 7.5, "fiber": 4.0, "protein": 7.8, "sodium": 720, "salt": 1.80}),
        ("Balaji Wafers Chana Jor Garam", "Mixture & Namkeen", "Chana Jor Garam", "Flattened pressed whole black chickpeas fried and tossed in fiery amchur, cumin, and red chilli.",
         "Whole Bengal Gram (Chana 72%), Edible Vegetable Oil (Palmolein), Seasoning (Dry Mango, Black Salt, Cumin, Red Chilli, Clove, Asafoetida, Iodised Salt).",
         {"calories": 460, "totalFat": 18.5, "saturatedFat": 8.0, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 9.5, "protein": 18.5, "sodium": 710, "salt": 1.78}),
        ("Balaji Wafers Farali Chevdo", "Mixture & Namkeen", "Farali Chevdo", "Traditional fasting snack made with shredded potato sticks, sabudana pearls, roasted peanuts, and rock salt.",
         "Potato (48%), Edible Vegetable Oil (Palmolein), Peanuts (18%), Sago (Sabudana 12%), Sugar, Rock Salt (Sendha Namak), Red Chilli, Curry Leaves.",
         {"calories": 548, "totalFat": 33.5, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 54.5, "sugars": 6.5, "addedSugars": 5.5, "fiber": 3.5, "protein": 7.2, "sodium": 580, "salt": 1.45})
    ]
    for nm, scat, flav, dsc, ing, nut in balaji_variants:
        items.append({
            "brand": "Balaji Wafers", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Namkeen & Wafers",
            "mfr": "Balaji Wafers Pvt Ltd", "flavour": flav, "wt": "65 g", "price": 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Rajkot Gujarati Quality", "Freshly Cooked", "Authentic Spices"]
        })

    # ----------------------------------------------------
    # 9. CRAX (DFM Foods Ltd) - 15 items
    # ----------------------------------------------------
    crax_variants = [
        ("Crax Corn Rings Masala Mania", "Extruded Snacks", "Masala Mania", "Iconic ring-shaped crunchy corn snack with Chatpata Indian spice coating and fun toy inside.",
         "Corn Grits (62%), Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Iodised Salt, Sugar, Dry Mango, Black Salt, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.2, "transFat": 0.05, "carbohydrates": 59.5, "sugars": 3.0, "addedSugars": 2.0, "fiber": 3.8, "protein": 6.2, "sodium": 780, "salt": 1.95}),
        ("Crax Corn Rings Tangy Tomato", "Extruded Snacks", "Tangy Tomato", "Sweet and sour tomato flavored corn rings loved by kids across India.",
         "Corn Grits (62%), Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Tomato Powder (2.8%), Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296), Paprika Extract (INS 160c)).",
         {"calories": 508, "totalFat": 27.0, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 5.5, "addedSugars": 4.5, "fiber": 3.6, "protein": 6.0, "sodium": 710, "salt": 1.78}),
        ("Crax Corn Rings Chatpata", "Extruded Snacks", "Chatpata", "Tangy amchur and roasted cumin coated crunchy corn rings.",
         "Corn Grits (62%), Edible Vegetable Oil (Palmolein), Seasoning (Dry Mango Powder (2.0%), Cumin, Coriander, Black Salt, Iodised Salt, Acidity Regulator (INS 330)).",
         {"calories": 512, "totalFat": 27.8, "saturatedFat": 12.4, "transFat": 0.05, "carbohydrates": 59.2, "sugars": 2.8, "addedSugars": 1.8, "fiber": 3.7, "protein": 6.1, "sodium": 790, "salt": 1.98}),
        ("Crax Corn Rings Cheese", "Extruded Snacks", "Cheese", "Cheesy goodness dusted over golden baked corn rings.",
         "Corn Grits (64%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.5%), Milk Solids, Salt, Sugar, Yeast Extract, Natural Colour (INS 160c)).",
         {"calories": 515, "totalFat": 28.2, "saturatedFat": 12.6, "transFat": 0.05, "carbohydrates": 58.8, "sugars": 3.5, "addedSugars": 2.2, "fiber": 3.5, "protein": 6.4, "sodium": 720, "salt": 1.80}),
        ("Crax Curls Chatpata Masala", "Extruded Snacks", "Chatpata Masala", "Curled spiral corn puffs bursting with authentic street-food Chatpata masala.",
         "Corn Meal, Rice Meal, Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Mango Powder, Black Salt, Cumin, Salt, Acidity Regulator (INS 330)).",
         {"calories": 518, "totalFat": 28.5, "saturatedFat": 12.8, "transFat": 0.05, "carbohydrates": 58.5, "sugars": 2.5, "addedSugars": 1.5, "fiber": 3.5, "protein": 6.2, "sodium": 810, "salt": 2.02}),
        ("Crax Biggies Puffs", "Extruded Snacks", "Biggies Masala", "Jumbo-sized airy corn puffs with a bold spicy and crunchy bite.",
         "Corn Grits (66%), Edible Vegetable Oil (Palmolein), Seasoning (Spices, Salt, Sugar, Onion, Garlic, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.2, "transFat": 0.05, "carbohydrates": 59.8, "sugars": 2.8, "addedSugars": 1.8, "fiber": 3.6, "protein": 6.0, "sodium": 770, "salt": 1.92}),
        ("Crax Cheese Balls", "Extruded Snacks", "Cheese Balls", "Spherical melt-in-the-mouth puffed corn snacks bathed in rich cheddar cheese seasoning.",
         "Corn Grits (65%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (4.0%), Dairy Whey, Salt, Sugar, Natural Color (INS 160c)).",
         {"calories": 520, "totalFat": 29.0, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 58.0, "sugars": 3.8, "addedSugars": 2.2, "fiber": 3.2, "protein": 6.5, "sodium": 700, "salt": 1.75}),
        ("Crax Natkhat Classic Wheat Puffs", "Extruded Snacks", "Natkhat Classic", "Iconic whole wheat roasted puffs seasoned with rock salt and mild spices.",
         "Wheat Flour (Atta 68%), Edible Vegetable Oil (Palmolein), Iodised Salt, Cumin, Black Pepper, Turmeric.",
         {"calories": 475, "totalFat": 21.0, "saturatedFat": 9.2, "transFat": 0.0, "carbohydrates": 62.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 6.5, "protein": 9.2, "sodium": 640, "salt": 1.60}),
        ("Crax Natkhat Masala Wheat Puffs", "Extruded Snacks", "Natkhat Masala", "Traditional whole wheat puffed balls coated in spicy Chatpata Indian masala.",
         "Wheat Flour (Atta 66%), Edible Vegetable Oil (Palmolein), Seasoning (Spices (Chilli, Amchur, Coriander), Salt, Black Salt, Acidity Regulator (INS 330)).",
         {"calories": 480, "totalFat": 21.5, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 2.2, "addedSugars": 1.2, "fiber": 6.4, "protein": 9.0, "sodium": 760, "salt": 1.90}),
        ("Crax Fritts Corn & Potato Sticks", "Extruded Snacks", "Masala Fritts", "Crunchy french-fry shaped corn and potato sticks tossed in Indian spices.",
         "Corn Meal (35%), Potato Flakes (28%), Edible Vegetable Oil (Palmolein), Rice Flour, Seasoning (Chilli, Onion, Garlic, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 515, "totalFat": 28.0, "saturatedFat": 12.5, "transFat": 0.05, "carbohydrates": 59.2, "sugars": 2.4, "addedSugars": 1.5, "fiber": 3.8, "protein": 6.4, "sodium": 790, "salt": 1.98}),
        ("Crax Pipes", "Extruded Snacks", "Masala Pipes", "Cylindrical tube-shaped puffed wheat pellets with a light airy crunch.",
         "Refined Wheat Flour (Maida), Potato Starch, Edible Vegetable Oil (Palmolein), Seasoning (Spices, Salt, Black Salt, Acidity Regulator (INS 330)).",
         {"calories": 495, "totalFat": 25.0, "saturatedFat": 11.2, "transFat": 0.05, "carbohydrates": 61.5, "sugars": 2.0, "addedSugars": 1.0, "fiber": 3.0, "protein": 6.0, "sodium": 820, "salt": 2.05}),
        ("Crax Pasta Crunch", "Extruded Snacks", "Tomato Cheese Pasta", "Penne pasta shaped crunchy extruded snacks seasoned with tomato and cheese.",
         "Wheat Flour, Corn Starch, Edible Vegetable Oil (Palmolein), Seasoning (Tomato Powder, Cheese Powder, Oregano, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 505, "totalFat": 26.5, "saturatedFat": 11.8, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 4.2, "addedSugars": 2.8, "fiber": 3.2, "protein": 6.2, "sodium": 750, "salt": 1.88}),
        ("Crax Zero Potato Chips (Salted)", "Chips", "Zero Palm Oil Salted", "Potato chips fried in 100% sunflower oil with zero palm oil and sea salt.",
         "Potato (65%), Edible Vegetable Oil (Refined Sunflower Oil), Rock Salt (1.5%).",
         {"calories": 530, "totalFat": 30.0, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 57.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.8, "protein": 6.8, "sodium": 560, "salt": 1.40}),
        ("Crax Zero Potato Chips (Cream & Onion)", "Chips", "Zero Palm Oil Cream & Onion", "Crispy potato chips made with zero palm oil and real sour cream and herbs seasoning.",
         "Potato (62%), Edible Vegetable Oil (Refined Sunflower Oil), Seasoning (Sour Cream Powder, Onion, Chives, Salt, Sugar, Acidity Regulator (INS 270)).",
         {"calories": 535, "totalFat": 30.5, "saturatedFat": 3.6, "transFat": 0.0, "carbohydrates": 56.5, "sugars": 3.2, "addedSugars": 2.0, "fiber": 3.7, "protein": 6.7, "sodium": 650, "salt": 1.62}),
        ("Crax Zero Potato Chips (Masala)", "Chips", "Zero Palm Oil Masala", "Palm-oil free potato chips fried in healthy sunflower oil with aromatic Indian spices.",
         "Potato (62%), Edible Vegetable Oil (Refined Sunflower Oil), Seasoning (Spices & Condiments, Red Chilli, Cumin, Black Salt, Dry Mango, Acidity Regulator (INS 330)).",
         {"calories": 538, "totalFat": 31.0, "saturatedFat": 3.4, "transFat": 0.0, "carbohydrates": 56.0, "sugars": 2.5, "addedSugars": 1.6, "fiber": 3.8, "protein": 6.8, "sodium": 740, "salt": 1.85})
    ]
    for nm, scat, flav, dsc, ing, nut in crax_variants:
        items.append({
            "brand": "Crax", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Extruded Corn & Potato Snacks",
            "mfr": "DFM Foods Ltd", "flavour": flav, "wt": "40 g", "price": 10 if "Rings" in nm or "Natkhat" in nm else 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Zero Palm Oil" if "Zero" in nm else "Fun Shape", "Crunchy Corn Matrix", "Toy Inside" if "Rings" in nm else "Vegetarian"]
        })

    # ----------------------------------------------------
    # 10. GOPAL SNACKS (Gopal Snacks Ltd) - 17 items
    # ----------------------------------------------------
    gopal_variants = [
        ("Gopal Plain Salted Potato Wafers", "Chips", "Plain Salted", "Ultra-thin sliced golden potato wafers sprinkled with rock salt.",
         "Potato (64%), Edible Vegetable Oil (Palmolein), Rock Salt (1.5%).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.2, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Gopal Masala Bite Potato Wafers", "Chips", "Masala Bite", "Spicy Gujarati masala wafers packed with black pepper, dry mango, and red chilli.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Red Chilli, Black Pepper, Dry Mango, Cumin, Clove, Black Salt, Salt, Acidity Regulator (INS 330)).",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.5, "sugars": 2.2, "addedSugars": 1.4, "fiber": 3.4, "protein": 6.4, "sodium": 790, "salt": 1.98}),
        ("Gopal Creamy Onion Potato Wafers", "Chips", "Creamy Onion", "Crispy potato wafers seasoned with creamy sweet onion, milk solids, and garden herbs.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Onion Powder, Milk Solids, Salt, Sugar, Parsley, Acidity Regulator (INS 270)).",
         {"calories": 542, "totalFat": 33.0, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 55.0, "sugars": 3.4, "addedSugars": 2.0, "fiber": 3.2, "protein": 6.2, "sodium": 680, "salt": 1.70}),
        ("Gopal Tomato Potato Wafers", "Chips", "Tomato", "Tangy and sweet tomato dusted thin potato crisps.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Tomato Powder (3.0%), Sugar, Salt, Onion, Garlic, Acidity Regulator (INS 330, INS 296)).",
         {"calories": 540, "totalFat": 32.8, "saturatedFat": 14.6, "transFat": 0.05, "carbohydrates": 55.5, "sugars": 4.8, "addedSugars": 3.8, "fiber": 3.3, "protein": 6.1, "sodium": 720, "salt": 1.80}),
        ("Gopal Peri Peri Potato Wafers", "Chips", "Peri Peri", "Zesty African bird's eye chilli and lemon spiced potato wafers.",
         "Potato (60%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Garlic, Onion, Black Pepper, Salt, Sugar, Citric Acid (INS 330), Paprika Extract (INS 160c)).",
         {"calories": 546, "totalFat": 33.6, "saturatedFat": 15.1, "transFat": 0.05, "carbohydrates": 54.2, "sugars": 2.5, "addedSugars": 1.8, "fiber": 3.5, "protein": 6.5, "sodium": 810, "salt": 2.02}),
        ("Gopal Cristos Puffs", "Extruded Snacks", "Cristos Masala", "Aerated puffed corn rings dusted with tangy masala.",
         "Corn Grits, Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Amchur, Cumin, Black Salt, Acidity Regulator (INS 330)).",
         {"calories": 512, "totalFat": 27.5, "saturatedFat": 12.2, "transFat": 0.05, "carbohydrates": 59.5, "sugars": 2.4, "addedSugars": 1.5, "fiber": 3.5, "protein": 6.2, "sodium": 760, "salt": 1.90}),
        ("Gopal Cornigo Nachos", "Chips", "Cornigo Cheese", "Golden toasted triangle tortilla chips with rich cheese flavour.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.2%), Salt, Sugar, Onion, Garlic, Acidity Regulator (INS 270)).",
         {"calories": 505, "totalFat": 26.2, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 2.8, "addedSugars": 1.8, "fiber": 4.2, "protein": 6.8, "sodium": 710, "salt": 1.78}),
        ("Gopal Shotz", "Extruded Snacks", "Shotz Masala", "Bite-sized extruded cereal pellets with a fiery masala pop.",
         "Rice Flour, Wheat Flour, Corn Flour, Edible Vegetable Oil (Palmolein), Seasoning (Spices, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 500, "totalFat": 25.5, "saturatedFat": 11.2, "transFat": 0.05, "carbohydrates": 61.0, "sugars": 2.2, "addedSugars": 1.2, "fiber": 3.2, "protein": 6.4, "sodium": 790, "salt": 1.98}),
        ("Gopal Noodle Masala", "Extruded Snacks", "Noodle Masala", "Crispy extruded instant-noodle style spicy strands.",
         "Wheat Flour, Edible Vegetable Oil (Palmolein), Seasoning (Garlic, Onion, Chilli, Cumin, Turmeric, Salt, Sugar, Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 520, "totalFat": 29.0, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 57.5, "sugars": 2.0, "addedSugars": 1.0, "fiber": 3.4, "protein": 7.2, "sodium": 860, "salt": 2.15}),
        ("Gopal Bhavnagri Gathiya", "Mixture & Namkeen", "Bhavnagri Gathiya", "Soft, mildly spiced thick gram flour strands flavored with carom seeds (ajwain).",
         "Gram Flour (Besan 65%), Edible Vegetable Oil (Cottonseed & Palmolein), Carom Seeds (Ajwain 1.5%), Iodised Salt, Asafoetida (Hing), Sodium Bicarbonate (INS 500(ii)).",
         {"calories": 560, "totalFat": 36.5, "saturatedFat": 14.5, "transFat": 0.0, "carbohydrates": 44.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 5.5, "protein": 13.2, "sodium": 680, "salt": 1.70}),
        ("Gopal Vanela Gathiya", "Mixture & Namkeen", "Vanela Gathiya", "Hand-twisted melt-in-mouth traditional Gujarati gathiya seasoned with ajwain and black pepper.",
         "Gram Flour (Besan 65%), Edible Vegetable Oil (Palmolein), Black Pepper (1.2%), Ajwain, Salt, Raising Agent (INS 500(ii)).",
         {"calories": 558, "totalFat": 36.0, "saturatedFat": 14.2, "transFat": 0.0, "carbohydrates": 45.0, "sugars": 1.4, "addedSugars": 0.0, "fiber": 5.4, "protein": 13.0, "sodium": 670, "salt": 1.68}),
        ("Gopal Champakali Gathiya", "Mixture & Namkeen", "Champakali Gathiya", "Delicate floral-cut shaped crisp gram flour gathiya seasoned with carom and mild black pepper.",
         "Gram Flour (Besan 64%), Edible Vegetable Oil (Palmolein), Salt, Ajwain, Black Pepper, Hing, Raising Agent (INS 500(ii)).",
         {"calories": 562, "totalFat": 36.8, "saturatedFat": 14.6, "transFat": 0.0, "carbohydrates": 44.2, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.6, "protein": 13.5, "sodium": 690, "salt": 1.72}),
        ("Gopal Nylon Sev", "Mixture & Namkeen", "Nylon Sev", "Ultra-thin, golden besan sev strands ideal for garnishing bhel, sev puri, and poha.",
         "Gram Flour (Besan 68%), Edible Vegetable Oil (Palmolein), Iodised Salt, Turmeric Powder.",
         {"calories": 570, "totalFat": 38.0, "saturatedFat": 15.5, "transFat": 0.0, "carbohydrates": 43.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 4.8, "protein": 12.8, "sodium": 620, "salt": 1.55}),
        ("Gopal Ratlami Sev", "Mixture & Namkeen", "Ratlami Sev", "Spicy and pungent sev infused with crushed cloves (laung), black pepper, and ajwain.",
         "Gram Flour (Besan 62%), Edible Vegetable Oil (Palmolein), Clove Powder (Laung 2.2%), Black Pepper, Red Chilli, Ajwain, Asafoetida, Iodised Salt.",
         {"calories": 565, "totalFat": 37.0, "saturatedFat": 15.0, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.2, "protein": 13.5, "sodium": 760, "salt": 1.90}),
        ("Gopal Fulwadi", "Mixture & Namkeen", "Fulwadi", "Crispy, coarse gram flour rolls flavored with cracked coriander seeds, fennel, sesame, and black pepper.",
         "Gram Flour (58%), Edible Vegetable Oil (Palmolein), Sesame Seeds (Till 4%), Coriander Seeds, Fennel Seeds, Sugar, Salt, Red Chilli, Black Pepper, Raising Agent (INS 500(ii)).",
         {"calories": 540, "totalFat": 32.5, "saturatedFat": 13.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 4.5, "addedSugars": 3.5, "fiber": 6.2, "protein": 14.0, "sodium": 680, "salt": 1.70}),
        ("Gopal Farali Chevdo", "Mixture & Namkeen", "Farali Chevdo", "Gujarati fasting special chiwda with crisp shredded potatoes, peanuts, sabudana, and sendha namak.",
         "Potato (46%), Edible Vegetable Oil (Palmolein), Peanuts (20%), Sago (12%), Sugar, Rock Salt, Green Chilli, Raisins, Curry Leaves.",
         {"calories": 545, "totalFat": 33.0, "saturatedFat": 14.5, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 7.0, "addedSugars": 6.0, "fiber": 3.8, "protein": 7.8, "sodium": 560, "salt": 1.40}),
        ("Gopal Sing Bhujia", "Mixture & Namkeen", "Sing Bhujia", "Crisp gram flour battered whole peanuts seasoned with spicy Gujarati amchur and red chilli masala.",
         "Peanuts (Sing 55%), Gram Flour (Besan 28%), Edible Vegetable Oil (Palmolein), Corn Starch, Spices (Chilli, Dry Mango, Clove, Cumin), Salt, Citric Acid (INS 330).",
         {"calories": 565, "totalFat": 38.5, "saturatedFat": 12.0, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 3.0, "addedSugars": 1.5, "fiber": 6.5, "protein": 18.5, "sodium": 720, "salt": 1.80})
    ]
    for nm, scat, flav, dsc, ing, nut in gopal_variants:
        items.append({
            "brand": "Gopal Snacks", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Traditional Farsan & Namkeen",
            "mfr": "Gopal Snacks Ltd", "flavour": flav, "wt": "70 g", "price": 10 if "Gathiya" in nm else 20,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Rajkot Farsan Pioneer", "Rich in Besan Protein", "Pure Spices"]
        })

    return items

print("Section 1 & 2 definitions written successfully.")
