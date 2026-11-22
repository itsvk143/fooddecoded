import json

def get_section2_part2_and_3():
    items = []

    # ----------------------------------------------------
    # 11. CHHEDA'S (Chheda Specialities Foods Pvt Ltd) - 12 items
    # ----------------------------------------------------
    chhedas_variants = [
        ("Chheda's Yellow Banana Chips (Pepper)", "Banana Chips", "Black Pepper Banana", "Thin sliced raw Nendran bananas fried in vegetable oil and seasoned with crushed black pepper.",
         "Raw Banana (68%), Edible Vegetable Oil (Palmolein), Black Pepper Powder (2.0%), Rock Salt.",
         {"calories": 535, "totalFat": 32.0, "saturatedFat": 14.5, "transFat": 0.05, "carbohydrates": 57.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 4.5, "protein": 3.8, "sodium": 480, "salt": 1.20}),
        ("Chheda's Mari Banana Chips", "Banana Chips", "Mari Banana", "Traditional Gujarati style banana wafers seasoned with pungent coarse black pepper and rock salt.",
         "Raw Banana (68%), Edible Vegetable Oil (Palmolein), Black Pepper (Mari 2.2%), Sendha Namak (Rock Salt).",
         {"calories": 532, "totalFat": 31.8, "saturatedFat": 14.2, "transFat": 0.05, "carbohydrates": 57.2, "sugars": 1.0, "addedSugars": 0.0, "fiber": 4.6, "protein": 3.9, "sodium": 470, "salt": 1.18}),
        ("Chheda's Spicy Tapioca Chips", "Banana Chips", "Spicy Tapioca", "Crunchy sliced cassava tapioca sticks seasoned with fiery red chilli and rock salt.",
         "Tapioca (Cassava 65%), Edible Vegetable Oil (Palmolein), Red Chilli, Salt, Dry Mango, Asafoetida.",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 62.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 4.0, "protein": 2.5, "sodium": 590, "salt": 1.48}),
        ("Chheda's Potato Wafers", "Chips", "Salted Potato Wafers", "Thin and crunchy salted potato chips made Mumbai farsan style.",
         "Potato (65%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Chheda's Mini Bhakarwadi", "Mixture & Namkeen", "Mini Bhakarwadi", "Bite-sized Maharashtrian spiral fried rolls stuffed with roasted coconut, sesame, and spices.",
         "Wheat Flour (Maida 35%), Gram Flour (Besan 15%), Edible Vegetable Oil (Palmolein), Coconut (12%), Sesame Seeds (Till 6%), Coriander Seeds, Fennel, Sugar, Salt, Red Chilli, Garam Masala.",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 15.5, "transFat": 0.05, "carbohydrates": 51.5, "sugars": 6.8, "addedSugars": 5.5, "fiber": 5.0, "protein": 9.5, "sodium": 680, "salt": 1.70}),
        ("Chheda's Regular Bhakarwadi", "Mixture & Namkeen", "Regular Bhakarwadi", "Full-sized traditional spiral rolls filled with a sweet, spicy, and tangy coconut-poppy seed masala.",
         "Wheat Flour, Gram Flour, Edible Vegetable Oil (Palmolein), Dry Coconut, Sesame Seeds, Poppy Seeds, Sugar, Tamarind, Salt, Spices.",
         {"calories": 540, "totalFat": 33.0, "saturatedFat": 15.2, "transFat": 0.05, "carbohydrates": 52.0, "sugars": 7.0, "addedSugars": 5.8, "fiber": 5.2, "protein": 9.2, "sodium": 670, "salt": 1.68}),
        ("Chheda's Methi Khakhra", "Mixture & Namkeen", "Methi Khakhra", "Thin whole wheat roasted flatbread crackers enriched with dried fenugreek leaves (kasuri methi).",
         "Whole Wheat Flour (Atta 78%), Edible Vegetable Oil (Cottonseed & Palmolein), Fenugreek Leaves (Methi 3.5%), Iodised Salt, Turmeric, Red Chilli.",
         {"calories": 465, "totalFat": 18.0, "saturatedFat": 6.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 8.5, "protein": 11.5, "sodium": 520, "salt": 1.30}),
        ("Chheda's Jeera Khakhra", "Mixture & Namkeen", "Jeera Khakhra", "Roasted whole wheat crisps flavored with aromatic whole roasted cumin seeds.",
         "Whole Wheat Flour (Atta 80%), Edible Vegetable Oil, Cumin Seeds (Jeera 3.0%), Iodised Salt, Turmeric Powder.",
         {"calories": 460, "totalFat": 17.5, "saturatedFat": 6.2, "transFat": 0.0, "carbohydrates": 64.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.6, "protein": 11.2, "sodium": 510, "salt": 1.28}),
        ("Chheda's Masala Khakhra", "Mixture & Namkeen", "Masala Khakhra", "Crispy roasted wheat flatbread dusted with spicy red chilli, ajwain, and turmeric.",
         "Whole Wheat Flour (78%), Edible Vegetable Oil, Spices (Chilli, Turmeric, Ajwain, Black Pepper), Iodised Salt.",
         {"calories": 468, "totalFat": 18.2, "saturatedFat": 6.5, "transFat": 0.0, "carbohydrates": 63.8, "sugars": 1.4, "addedSugars": 0.0, "fiber": 8.4, "protein": 11.4, "sodium": 550, "salt": 1.38}),
        ("Chheda's Chakli", "Mixture & Namkeen", "Bhajani Chakli", "Crisp spiral snack prepared from multi-lentil and rice flour bhajani tempered with sesame and ajwain.",
         "Rice Flour (45%), Split Chickpeas (Chana Dal 20%), Black Gram (Urad Dal 10%), Edible Vegetable Oil (Palmolein), Sesame Seeds (4%), Cumin, Salt, Red Chilli, Ajwain.",
         {"calories": 520, "totalFat": 28.5, "saturatedFat": 12.0, "transFat": 0.0, "carbohydrates": 56.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.5, "protein": 9.5, "sodium": 620, "salt": 1.55}),
        ("Chheda's Shankarpali", "Mixture & Namkeen", "Sweet Shankarpali", "Diamond-cut fried sweet biscuits made with wheat flour, pure ghee, and sugar.",
         "Refined Wheat Flour (Maida 58%), Sugar (24%), Edible Vegetable Oil (Palmolein), Ghee (4%), Cardamom, Salt.",
         {"calories": 510, "totalFat": 26.0, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 62.0, "sugars": 22.0, "addedSugars": 20.5, "fiber": 2.2, "protein": 6.5, "sodium": 180, "salt": 0.45}),
        ("Chheda's Dry Fruit Kachori", "Mixture & Namkeen", "Dry Fruit Kachori", "Crisp spherical pastry stuffed with dried fruits, coconut, nuts, and sweet-sour Marwari masala.",
         "Wheat Flour (Maida), Edible Vegetable Oil (Palmolein), Cashews, Raisins, Almonds, Coconut, Sugar, Fennel, Clove, Cinnamon, Salt, Spices.",
         {"calories": 535, "totalFat": 32.0, "saturatedFat": 13.5, "transFat": 0.05, "carbohydrates": 53.0, "sugars": 12.5, "addedSugars": 9.0, "fiber": 4.5, "protein": 8.5, "sodium": 540, "salt": 1.35})
    ]
    for nm, scat, flav, dsc, ing, nut in chhedas_variants:
        items.append({
            "brand": "Chheda's", "name": nm, "cat": "Snacks & Spreads", "sub": scat, "type": "Mumbai Farsan & Chips",
            "mfr": "Chheda Specialities Foods Pvt Ltd", "flavour": flav, "wt": "170 g", "price": 50 if "Khakhra" in nm else 75,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Mumbai Traditional Taste", "Crispy Authentic Snack", "Pure Ingredients"]
        })

    # ----------------------------------------------------
    # 12. PRABHUJI (Haldiram Bhujiawala Ltd - Kolkata) - 18 items
    # ----------------------------------------------------
    prabhuji_variants = [
        ("Prabhuji Jhal Chanachur", "Mixture & Namkeen", "Jhal Chanachur", "Signature fiery Kolkata street-style Chanachur with fried dal, flattened rice, peanuts, and mustard oil aroma.",
         "Gram Flour (Besan 40%), Edible Vegetable Oil (Palmolein & Mustard Oil), Peanuts (12%), Flattened Rice (Poha 10%), Lentils (Masoor 8%), Red Chilli Powder, Black Salt, Cumin, Amchur, Acidity Regulator (INS 330).",
         {"calories": 540, "totalFat": 33.5, "saturatedFat": 13.5, "transFat": 0.0, "carbohydrates": 47.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 6.5, "protein": 12.8, "sodium": 820, "salt": 2.05}),
        ("Prabhuji Tok Jhal Mishti Chanachur", "Mixture & Namkeen", "Tok Jhal Mishti", "Traditional Bengali sweet, sour, and spicy Chanachur loaded with crunchy fried chickpeas and raisins.",
         "Gram Flour, Edible Vegetable Oil (Palmolein), Peanuts, Poha, Sugar (6.5%), Raisins, Tamarind, Chilli, Black Salt, Cumin, Acidity Regulator (INS 330).",
         {"calories": 525, "totalFat": 31.0, "saturatedFat": 12.8, "transFat": 0.0, "carbohydrates": 51.5, "sugars": 8.5, "addedSugars": 6.5, "fiber": 5.8, "protein": 11.5, "sodium": 740, "salt": 1.85}),
        ("Prabhuji Kaju Mixture", "Mixture & Namkeen", "Kaju Mixture", "Royal Kolkata namkeen blend rich in whole fried cashews, potato laccha, and dry spices.",
         "Cashew Nuts (22%), Potato Flakes (20%), Gram Flour (Besan 25%), Edible Vegetable Oil (Palmolein), Raisins, Sugar, Rock Salt, Black Pepper.",
         {"calories": 560, "totalFat": 38.0, "saturatedFat": 13.0, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 6.0, "addedSugars": 4.5, "fiber": 4.5, "protein": 11.0, "sodium": 620, "salt": 1.55}),
        ("Prabhuji Panchratan Mixture", "Mixture & Namkeen", "Panchratan", "Sweet and salty fasting mixture of potato sticks, peanuts, cashews, raisins, and sago pearls.",
         "Potato (35%), Edible Vegetable Oil (Palmolein), Peanuts (18%), Cashews (8%), Sago (10%), Raisins (6%), Sugar, Rock Salt, Red Chilli.",
         {"calories": 552, "totalFat": 36.0, "saturatedFat": 13.8, "transFat": 0.0, "carbohydrates": 49.0, "sugars": 9.5, "addedSugars": 8.0, "fiber": 4.0, "protein": 8.0, "sodium": 540, "salt": 1.35}),
        ("Prabhuji Navratan Mixture", "Mixture & Namkeen", "Navratan", "Nine-ingredient crunchy snack mix with besan sev, moong dal, peanuts, and savory spices.",
         "Gram Flour, Edible Vegetable Oil, Peanuts, Moong Dal, Lentils, Puffed Rice, Spices, Salt, Citric Acid (INS 330).",
         {"calories": 535, "totalFat": 32.5, "saturatedFat": 14.0, "transFat": 0.0, "carbohydrates": 49.5, "sugars": 3.0, "addedSugars": 1.5, "fiber": 6.0, "protein": 12.0, "sodium": 780, "salt": 1.95}),
        ("Prabhuji Moong Dal", "Mixture & Namkeen", "Moong Dal", "Crisp, golden salted yellow moong pulses fried to perfection.",
         "Yellow Moong Lentils (76%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
         {"calories": 470, "totalFat": 21.0, "saturatedFat": 9.0, "transFat": 0.0, "carbohydrates": 51.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 8.0, "protein": 22.0, "sodium": 610, "salt": 1.52}),
        ("Prabhuji Chana Dal", "Mixture & Namkeen", "Chana Dal", "Crunchy fried split Bengal gram seasoned with red chilli and tangy amchur.",
         "Split Chickpeas (Chana Dal 74%), Edible Vegetable Oil (Palmolein), Red Chilli, Salt, Dry Mango, Black Pepper, Acidity Regulator (INS 330).",
         {"calories": 480, "totalFat": 22.5, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 50.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 9.0, "protein": 19.5, "sodium": 720, "salt": 1.80}),
        ("Prabhuji Khatta Meetha", "Mixture & Namkeen", "Khatta Meetha", "Sweet and sour blend of crisp besan noodles, rice flakes, green peas, and tamarind flavoring.",
         "Gram Flour (Besan 32%), Edible Vegetable Oil (Palmolein), Rice Flakes (18%), Peanuts (10%), Sugar, Salt, Dry Mango, Turmeric, Citric Acid (INS 330).",
         {"calories": 528, "totalFat": 31.0, "saturatedFat": 13.5, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 9.0, "addedSugars": 8.0, "fiber": 4.5, "protein": 8.0, "sodium": 690, "salt": 1.72}),
        ("Prabhuji Classic Salted Chips", "Chips", "Classic Salted", "Crisp potato chips fried in vegetable oil and seasoned with sea salt.",
         "Potato (65%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Prabhuji Masala Chips", "Chips", "Masala Chips", "Kolkata spicy potato wafers tossed with red chilli, dry mango, and roasted cumin.",
         "Potato (62%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Amchur, Cumin, Black Salt, Salt, Acidity Regulator (INS 330)).",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 54.5, "sugars": 2.0, "addedSugars": 1.2, "fiber": 3.4, "protein": 6.4, "sodium": 790, "salt": 1.98}),
        ("Prabhuji Puffitos", "Extruded Snacks", "Puffitos Masala", "Light aerated corn and rice puffs with chatpata seasoning.",
         "Corn Grits, Rice Grits, Edible Vegetable Oil (Palmolein), Seasoning (Spices, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 510, "totalFat": 27.5, "saturatedFat": 12.0, "transFat": 0.05, "carbohydrates": 59.5, "sugars": 2.5, "addedSugars": 1.5, "fiber": 3.2, "protein": 6.0, "sodium": 750, "salt": 1.88}),
        ("Prabhuji Rings", "Extruded Snacks", "Tomato Rings", "Crispy extruded snack rings seasoned with sweet and tangy tomato.",
         "Corn Grits, Edible Vegetable Oil (Palmolein), Seasoning (Tomato Powder, Sugar, Salt, Acidity Regulator (INS 330)).",
         {"calories": 508, "totalFat": 27.0, "saturatedFat": 11.8, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 5.2, "addedSugars": 4.0, "fiber": 3.0, "protein": 5.8, "sodium": 710, "salt": 1.78}),
        ("Prabhuji Pure Desi Ghee Soan Papdi", "Chocolates & Sweets", "Soan Papdi", "Flaky ribbon-like traditional sweet crafted from roasted gram flour, pure desi ghee, and pistachios.",
         "Sugar, Clarified Butter (Desi Ghee 26%), Gram Flour (Besan 16%), Refined Wheat Flour (Maida 12%), Almonds, Pistachios, Cardamom.",
         {"calories": 515, "totalFat": 27.0, "saturatedFat": 16.5, "transFat": 0.2, "carbohydrates": 63.0, "sugars": 48.0, "addedSugars": 45.0, "fiber": 2.0, "protein": 5.5, "sodium": 40, "salt": 0.10}),
        ("Prabhuji Spongy Rasgulla Tin", "Chocolates & Sweets", "Rasgulla", "Authentic soft and spongy cottage cheese dumplings soaked in light rose and cardamom scented sugar syrup.",
         "Water, Sugar (42%), Chhana (Cottage Cheese from Cow Milk 12%), Rose Water, Cardamom.",
         {"calories": 260, "totalFat": 4.0, "saturatedFat": 2.5, "transFat": 0.05, "carbohydrates": 52.0, "sugars": 50.0, "addedSugars": 48.0, "fiber": 0.0, "protein": 5.0, "sodium": 50, "salt": 0.12}),
        ("Prabhuji Gulab Jamun Tin", "Chocolates & Sweets", "Gulab Jamun", "Classic khoya dumplings fried in desi ghee and steeped in cardamom sugar syrup.",
         "Sugar (44%), Water, Khoya (Milk Solids 20%), Chhana, Refined Wheat Flour, Ghee, Cardamom.",
         {"calories": 330, "totalFat": 10.5, "saturatedFat": 6.8, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 48.0, "addedSugars": 46.0, "fiber": 0.5, "protein": 6.0, "sodium": 75, "salt": 0.18}),
        ("Prabhuji Kaju Katli", "Chocolates & Sweets", "Kaju Katli", "Silver foiled diamond-shaped cashew confection made with pulverized premium Goan cashews.",
         "Cashew Nuts (Kaju 55%), Sugar (42%), Clarified Butter (Ghee), Silver Leaf (Varq).",
         {"calories": 480, "totalFat": 24.5, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 38.0, "addedSugars": 36.0, "fiber": 2.5, "protein": 11.5, "sodium": 60, "salt": 0.15}),
        ("Prabhuji Rich Fruit Dry Cake", "Bakery & Breads", "Dry Fruit Cake", "Soft golden eggless sponge loaf packed with candied cherries, raisins, and tutti frutti.",
         "Refined Wheat Flour, Sugar, Condensed Milk, Edible Vegetable Oil, Tutti Frutti (Papaya Cubes 10%), Raisins, Cashews, Raising Agents (INS 500(ii), INS 541).",
         {"calories": 410, "totalFat": 16.0, "saturatedFat": 5.5, "transFat": 0.05, "carbohydrates": 60.0, "sugars": 32.0, "addedSugars": 28.0, "fiber": 1.8, "protein": 6.2, "sodium": 220, "salt": 0.55}),
        ("Prabhuji Pure Butter Nankhatai Cookies", "Bakery & Breads", "Nankhatai", "Traditional spiced Indian shortbread biscuits baked with pure butter, gram flour, and green cardamom.",
         "Refined Wheat Flour (40%), Butter (24%), Sugar, Gram Flour (10%), Semolina, Cardamom Powder (0.5%), Salt.",
         {"calories": 510, "totalFat": 26.5, "saturatedFat": 16.0, "transFat": 0.2, "carbohydrates": 62.0, "sugars": 26.0, "addedSugars": 24.0, "fiber": 2.2, "protein": 6.0, "sodium": 140, "salt": 0.35})
    ]
    for nm, scat, flav, dsc, ing, nut in prabhuji_variants:
        cat = "Snacks & Spreads"
        sub = scat
        if flav in ["Soan Papdi", "Rasgulla", "Gulab Jamun", "Kaju Katli"]:
            cat = "Chocolates & Sweets"
            sub = "Indian Traditional Sweets" if "Katli" in nm or "Papdi" in nm else "Packaged Indian Sweets"
        elif flav in ["Dry Fruit Cake", "Nankhatai"]:
            cat = "Bakery & Breads"
            sub = "Packaged Cakes & Muffins" if "Cake" in nm else "Biscuits"

        items.append({
            "brand": "Prabhuji", "name": nm, "cat": cat, "sub": sub, "type": "Kolkata Haldiram Prabhuji Specialties",
            "mfr": "Haldiram Bhujiawala Ltd", "flavour": flav, "wt": "200 g" if "Tin" in nm or "Sweets" in cat else "150 g", "price": 40 if "Chanachur" in nm else 120,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Heritage Kolkata Brand", "Desi Ghee" if "Ghee" in ing else "Traditional Spices", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 13. CHITALE BANDHU (Chitale Bandhu Mithaiwale) - 16 items
    # ----------------------------------------------------
    chitale_variants = [
        ("Chitale Bandhu Bakarwadi (Regular)", "Mixture & Namkeen", "Regular Bakarwadi", "Iconic Pune bakarwadi with crunchy rolled crust filled with roasted coconut, sesame seeds, poppy seeds, and tangy spices.",
         "Refined Wheat Flour (Maida 34%), Gram Flour (Besan 16%), Edible Vegetable Oil (Cottonseed & Palmolein), Dried Coconut (14%), Sesame Seeds (Till 8%), Poppy Seeds (Khas Khas), Sugar, Salt, Red Chilli, Fennel, Coriander Seeds, Tamarind.",
         {"calories": 548, "totalFat": 34.0, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 50.5, "sugars": 6.8, "addedSugars": 5.5, "fiber": 5.4, "protein": 9.8, "sodium": 670, "salt": 1.68}),
        ("Chitale Bandhu Bakarwadi (Mini)", "Mixture & Namkeen", "Mini Bakarwadi", "Bite-sized version of Chitale's iconic Pune bakarwadi spirals with the same authentic spicy filling.",
         "Wheat Flour, Gram Flour, Edible Vegetable Oil, Dry Coconut, Sesame Seeds, Poppy Seeds, Sugar, Iodised Salt, Chilli, Tamarind, Spices.",
         {"calories": 546, "totalFat": 33.8, "saturatedFat": 14.8, "transFat": 0.05, "carbohydrates": 51.0, "sugars": 6.6, "addedSugars": 5.4, "fiber": 5.3, "protein": 9.6, "sodium": 660, "salt": 1.65}),
        ("Chitale Bandhu Bakarwadi (Cheese)", "Mixture & Namkeen", "Cheese Bakarwadi", "Modern twist on the Pune classic infused with dried cheese powder in the savory filling.",
         "Wheat Flour, Gram Flour, Edible Vegetable Oil, Dry Coconut, Cheese Powder (4.5%), Sesame Seeds, Sugar, Salt, Chilli, Spices.",
         {"calories": 552, "totalFat": 34.5, "saturatedFat": 15.4, "transFat": 0.05, "carbohydrates": 50.0, "sugars": 6.0, "addedSugars": 4.8, "fiber": 5.0, "protein": 10.2, "sodium": 710, "salt": 1.78}),
        ("Chitale Bandhu Bakarwadi (Garlic)", "Mixture & Namkeen", "Garlic Bakarwadi", "Robust roasted garlic flavored bakarwadi with fragrant Maharashtrian spices.",
         "Wheat Flour, Gram Flour, Edible Vegetable Oil, Coconut, Sesame Seeds, Garlic Powder (3.2%), Sugar, Salt, Red Chilli, Garam Masala.",
         {"calories": 545, "totalFat": 33.6, "saturatedFat": 14.6, "transFat": 0.05, "carbohydrates": 51.2, "sugars": 6.2, "addedSugars": 5.0, "fiber": 5.2, "protein": 9.7, "sodium": 680, "salt": 1.70}),
        ("Chitale Bandhu Lasun Shev", "Mixture & Namkeen", "Lasun Shev", "Spicy gram flour sev heavily infused with fresh roasted garlic (lasun) and red chillies.",
         "Gram Flour (Besan 65%), Edible Vegetable Oil, Garlic Paste (5.5%), Red Chilli Powder, Salt, Ajwain, Turmeric.",
         {"calories": 565, "totalFat": 37.0, "saturatedFat": 14.8, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.2, "protein": 13.5, "sodium": 780, "salt": 1.95}),
        ("Chitale Bandhu Tikhat Shev", "Mixture & Namkeen", "Tikhat Shev", "Extra fiery Maharashtrian sev seasoned with Lavangi chillies and black pepper.",
         "Gram Flour (Besan 66%), Edible Vegetable Oil, Red Chilli Powder (3.0%), Black Pepper, Salt, Carom Seeds (Ajwain).",
         {"calories": 568, "totalFat": 37.5, "saturatedFat": 15.0, "transFat": 0.0, "carbohydrates": 43.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.4, "protein": 13.8, "sodium": 820, "salt": 2.05}),
        ("Chitale Bandhu Sadhi Shev", "Mixture & Namkeen", "Sadhi Shev", "Mild, golden-yellow besan sev seasoned simply with turmeric, carom seeds, and salt.",
         "Gram Flour (Besan 68%), Edible Vegetable Oil, Ajwain, Iodised Salt, Turmeric Powder.",
         {"calories": 560, "totalFat": 36.5, "saturatedFat": 14.5, "transFat": 0.0, "carbohydrates": 44.8, "sugars": 0.8, "addedSugars": 0.0, "fiber": 5.0, "protein": 13.0, "sodium": 580, "salt": 1.45}),
        ("Chitale Bandhu Maka Chivda", "Mixture & Namkeen", "Maka Chivda", "Crisp deep-fried yellow corn flakes tossed with peanuts, dried coconut slices, green chillies, and curry leaves.",
         "Corn Flakes (Maka Poha 52%), Edible Vegetable Oil, Peanuts (14%), Dry Coconut (8%), Raisins, Green Chilli, Curry Leaves, Sugar, Turmeric, Salt, Mustard.",
         {"calories": 530, "totalFat": 31.0, "saturatedFat": 13.0, "transFat": 0.05, "carbohydrates": 55.5, "sugars": 7.5, "addedSugars": 6.0, "fiber": 4.8, "protein": 7.5, "sodium": 610, "salt": 1.52}),
        ("Chitale Bandhu Potato Chivda (Batata Chivda)", "Mixture & Namkeen", "Batata Chivda", "Delicate shredded potato fries mixed with roasted peanuts, cashews, and mild rock salt for upvas.",
         "Potato Sticks (54%), Edible Vegetable Oil, Peanuts (22%), Cashews (5%), Sugar, Rock Salt (Sendha Namak), Green Chilli.",
         {"calories": 555, "totalFat": 35.5, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 52.0, "sugars": 6.0, "addedSugars": 5.0, "fiber": 3.6, "protein": 7.2, "sodium": 490, "salt": 1.22}),
        ("Chitale Bandhu Pohe Chivda", "Mixture & Namkeen", "Pohe Chivda", "Crisp roasted thin rice flakes tempered with mustard, peanuts, roasted gram, and green chillies.",
         "Thin Beaten Rice (Poha 55%), Edible Vegetable Oil, Roasted Peanuts (12%), Fried Gram (Dalva 8%), Coconut Slices, Turmeric, Green Chilli, Curry Leaves, Salt, Sugar.",
         {"calories": 485, "totalFat": 23.5, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 59.5, "sugars": 4.5, "addedSugars": 3.5, "fiber": 5.2, "protein": 8.8, "sodium": 590, "salt": 1.48}),
        ("Chitale Bandhu Sweet Shankarpali", "Mixture & Namkeen", "Sweet Shankarpali", "Traditional diamond sweet biscuits prepared from refined flour, milk, sugar, and pure ghee.",
         "Refined Wheat Flour (56%), Sugar (25%), Ghee (8%), Edible Vegetable Oil, Milk, Cardamom, Salt.",
         {"calories": 505, "totalFat": 25.0, "saturatedFat": 12.0, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 23.0, "addedSugars": 22.0, "fiber": 2.0, "protein": 6.5, "sodium": 150, "salt": 0.38}),
        ("Chitale Bandhu Salted Shankarpali (Khare Tukde)", "Mixture & Namkeen", "Salted Shankarpali", "Savory crisp diamond pastry pieces seasoned with roasted carom seeds and rock salt.",
         "Refined Wheat Flour (Maida 72%), Edible Vegetable Oil, Carom Seeds (Ajwain 2.0%), Iodised Salt, Cumin.",
         {"calories": 515, "totalFat": 27.0, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 58.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 3.0, "protein": 9.5, "sodium": 640, "salt": 1.60}),
        ("Chitale Bandhu Khari Bundi", "Mixture & Namkeen", "Khari Bundi", "Crispy fried gram flour droplets seasoned with black salt, cumin, and mild chilli for raita and snacks.",
         "Gram Flour (Besan 70%), Edible Vegetable Oil, Iodised Salt, Black Salt, Cumin Powder, Red Chilli.",
         {"calories": 560, "totalFat": 36.0, "saturatedFat": 14.5, "transFat": 0.0, "carbohydrates": 45.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.0, "protein": 13.0, "sodium": 680, "salt": 1.70}),
        ("Chitale Bandhu Pure Alphonso Mango Barfi (Amba Barfi)", "Chocolates & Sweets", "Amba Barfi", "Exquisite Konkan Alphonso mango pulp cooked with condensed milk, mawa, and sugar into decadent golden squares.",
         "Alphonso Mango Pulp (40%), Khoya (Milk Solids 32%), Sugar (24%), Pure Desi Ghee, Cardamom.",
         {"calories": 395, "totalFat": 14.0, "saturatedFat": 8.5, "transFat": 0.1, "carbohydrates": 60.0, "sugars": 52.0, "addedSugars": 38.0, "fiber": 1.8, "protein": 7.5, "sodium": 80, "salt": 0.20}),
        ("Chitale Bandhu Kaju Katli", "Chocolates & Sweets", "Kaju Katli", "Premium diamond cashew fudge crafted from 100% whole cashews and refined sugar.",
         "Cashew Nuts (55%), Sugar, Ghee, Silver Leaf.",
         {"calories": 482, "totalFat": 24.8, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 53.8, "sugars": 38.0, "addedSugars": 36.0, "fiber": 2.6, "protein": 11.8, "sodium": 55, "salt": 0.14}),
        ("Chitale Bandhu Kandi Pedha", "Chocolates & Sweets", "Kandi Pedha", "Caramelized slow-cooked khoya pedha with the signature smoky aroma of Satara and Pune tradition.",
         "Concentrated Milk Solids (Khoya/Mawa 72%), Sugar (26%), Cardamom, Nutmeg.",
         {"calories": 415, "totalFat": 16.5, "saturatedFat": 10.2, "transFat": 0.1, "carbohydrates": 55.0, "sugars": 44.0, "addedSugars": 40.0, "fiber": 0.5, "protein": 11.5, "sodium": 110, "salt": 0.28})
    ]
    for nm, scat, flav, dsc, ing, nut in chitale_variants:
        cat = "Snacks & Spreads"
        sub = scat
        if flav in ["Amba Barfi", "Kaju Katli", "Kandi Pedha"]:
            cat = "Chocolates & Sweets"
            sub = "Indian Traditional Sweets"

        items.append({
            "brand": "Chitale Bandhu", "name": nm, "cat": cat, "sub": sub, "type": "Iconic Pune Mithai & Farsan",
            "mfr": "Chitale Bandhu Mithaiwale", "flavour": flav, "wt": "250 g", "price": 95 if "Bakarwadi" in nm else 160,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Pune Heritage Brand", "Authentic Maharashtrian Recipe", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 14. HALDIRAM'S (Nagpur & Delhi) - 13 missing items
    # ----------------------------------------------------
    haldiram_variants = [
        ("Haldiram's Pudina Sev", "Mixture & Namkeen", "Pudina Sev", "Crunchy besan sev infused with refreshing garden mint, rock salt, and amchur.",
         "Gram Flour (Besan 65%), Edible Vegetable Oil (Cottonseed & Palmolein), Mint Powder (Pudina 3.5%), Salt, Dry Mango, Black Pepper, Acidity Regulator (INS 330).",
         {"calories": 560, "totalFat": 36.5, "saturatedFat": 15.0, "transFat": 0.0, "carbohydrates": 44.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.0, "protein": 13.0, "sodium": 760, "salt": 1.90}),
        ("Haldiram's Kashmiri Mixture", "Mixture & Namkeen", "Kashmiri Mixture", "Royal sweet and savory snack loaded with split green gram, cashews, potato sticks, and melon seeds.",
         "Split Green Gram (Moong Dal 30%), Potato (22%), Edible Vegetable Oil (Palmolein), Cashews (10%), Watermelon Seeds (Magaz 5%), Spinach, Salt, Sugar, Mango Powder, Spices.",
         {"calories": 545, "totalFat": 34.0, "saturatedFat": 14.2, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 5.2, "addedSugars": 4.0, "fiber": 5.8, "protein": 11.8, "sodium": 640, "salt": 1.60}),
        ("Haldiram's Mast Masala Potato Chips", "Chips", "Mast Masala", "Thin cut crispy potato chips seasoned with authentic Haldiram's proprietary chaat masala.",
         "Potato (62%), Edible Vegetable Oil (Palmolein), Seasoning (Spices (Chilli, Cumin, Coriander, Amchur), Salt, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
         {"calories": 545, "totalFat": 33.5, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.2, "sugars": 2.5, "addedSugars": 1.6, "fiber": 3.4, "protein": 6.5, "sodium": 820, "salt": 2.05}),
        ("Haldiram's Takatak Chatpata Masala", "Extruded Snacks", "Takatak Masala", "Crunchy extruded corn and rice sticks coated with fiery street masala.",
         "Rice Meal (40%), Corn Meal (25%), Edible Vegetable Oil (Palmolein), Seasoning (Chilli, Onion, Garlic, Dry Mango, Black Salt, Cumin, Acidity Regulator (INS 330)).",
         {"calories": 550, "totalFat": 34.5, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 2.2, "addedSugars": 1.4, "fiber": 2.8, "protein": 6.2, "sodium": 890, "salt": 2.22}),
        ("Haldiram's Takatak Tangy Tomato", "Extruded Snacks", "Takatak Tomato", "Crunchy textured extruded sticks dusted with rich sweet and tangy tomato spices.",
         "Rice Meal, Corn Meal, Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Tomato Powder (2.4%), Salt, Onion, Garlic, Citric Acid (INS 330), Paprika Extract (INS 160c)).",
         {"calories": 542, "totalFat": 33.0, "saturatedFat": 14.8, "transFat": 0.1, "carbohydrates": 55.5, "sugars": 5.0, "addedSugars": 4.2, "fiber": 2.7, "protein": 6.0, "sodium": 760, "salt": 1.90}),
        ("Haldiram's Halke Fulke Puffs", "Extruded Snacks", "Halke Fulke", "Airy, melt-in-mouth potato puffs tossed in light savory spice seasoning.",
         "Potato Flakes (45%), Rice Flour, Edible Vegetable Oil (Palmolein), Seasoning (Spices, Salt, Sugar, Acidity Regulator (INS 330)).",
         {"calories": 505, "totalFat": 26.5, "saturatedFat": 11.5, "transFat": 0.05, "carbohydrates": 61.0, "sugars": 2.0, "addedSugars": 1.2, "fiber": 3.0, "protein": 5.5, "sodium": 720, "salt": 1.80}),
        ("Haldiram's Nachos Cheese", "Chips", "Nacho Cheese", "Authentic stone-ground corn tortilla chips seasoned with rich cheese.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Seasoning (Cheese Powder (3.8%), Milk Solids, Salt, Sugar, Onion, Garlic, Acidity Regulator (INS 270)).",
         {"calories": 502, "totalFat": 25.8, "saturatedFat": 11.2, "transFat": 0.05, "carbohydrates": 60.5, "sugars": 2.8, "addedSugars": 1.8, "fiber": 4.4, "protein": 6.9, "sodium": 700, "salt": 1.75}),
        ("Haldiram's Roasted Makhana (Salt & Pepper)", "Baked Chips, Makhana & Unjunked Indian Snacks", "Salt & Pepper", "Popped water lily seeds slow-roasted in vegetable oil with rock salt and crushed black pepper.",
         "Foxnuts (Makhana 75%), Edible Vegetable Oil (Sunflower Oil), Black Pepper (2.5%), Rock Salt (Sendha Namak 2.0%).",
         {"calories": 440, "totalFat": 14.0, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 9.5, "protein": 9.8, "sodium": 420, "salt": 1.05}),
        ("Haldiram's Mini Dry Samosa", "Mixture & Namkeen", "Mini Samosa", "Crisp triangular pastry pockets filled with spicy cashew, raisin, and lentil filling.",
         "Refined Wheat Flour (Maida 42%), Edible Vegetable Oil (Palmolein), Split Green Gram (Moong Dal), Cashews, Raisins, Sugar, Salt, Red Chilli, Fennel, Cloves, Garam Masala.",
         {"calories": 530, "totalFat": 31.5, "saturatedFat": 13.5, "transFat": 0.05, "carbohydrates": 53.0, "sugars": 4.5, "addedSugars": 3.2, "fiber": 4.2, "protein": 8.5, "sodium": 650, "salt": 1.62}),
        ("Haldiram's Mini Dry Kachori", "Mixture & Namkeen", "Mini Kachori", "Spherical golden flaky pastry filled with sweet and spicy lentil, tamarind, and whole spice mixture.",
         "Wheat Flour (40%), Edible Vegetable Oil (Palmolein), Yellow Moong Dal, Gram Flour, Sugar, Tamarind, Cashews, Raisins, Salt, Red Chilli, Fennel, Coriander, Black Pepper.",
         {"calories": 535, "totalFat": 32.0, "saturatedFat": 13.8, "transFat": 0.05, "carbohydrates": 52.5, "sugars": 5.0, "addedSugars": 3.8, "fiber": 4.5, "protein": 8.8, "sodium": 660, "salt": 1.65}),
        ("Haldiram's Methi Khakhra", "Mixture & Namkeen", "Methi Khakhra", "Vacuum packed whole wheat roasted flatbread crackers enriched with fragrant fenugreek leaves.",
         "Whole Wheat Flour (Atta 80%), Edible Vegetable Oil, Fenugreek (Methi 3.0%), Salt, Turmeric, Red Chilli.",
         {"calories": 465, "totalFat": 18.0, "saturatedFat": 6.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 11.5, "sodium": 520, "salt": 1.30}),
        ("Haldiram's Desi Ghee Soan Papdi", "Chocolates & Sweets", "Soan Papdi", "Iconic flaky Haldiram's sweet made with 100% pure desi ghee, gram flour, and pistachio garnish.",
         "Sugar (42%), Clarified Butter (Desi Ghee 26%), Gram Flour (16%), Refined Wheat Flour (12%), Almonds, Pistachios, Cardamom.",
         {"calories": 515, "totalFat": 27.5, "saturatedFat": 16.8, "transFat": 0.2, "carbohydrates": 62.5, "sugars": 48.0, "addedSugars": 45.0, "fiber": 2.0, "protein": 5.6, "sodium": 40, "salt": 0.10}),
        ("Haldiram's Premium Kaju Katli", "Chocolates & Sweets", "Kaju Katli", "Melt-in-mouth cashew diamond confection made with rich Goan cashews and pure ghee.",
         "Cashew Nuts (55%), Sugar, Clarified Butter, Silver Leaf.",
         {"calories": 485, "totalFat": 25.0, "saturatedFat": 5.4, "transFat": 0.0, "carbohydrates": 53.5, "sugars": 38.0, "addedSugars": 36.0, "fiber": 2.5, "protein": 11.5, "sodium": 55, "salt": 0.14})
    ]
    for nm, scat, flav, dsc, ing, nut in haldiram_variants:
        cat = "Snacks & Spreads"
        sub = scat
        if flav in ["Soan Papdi", "Kaju Katli"]:
            cat = "Chocolates & Sweets"
            sub = "Indian Traditional Sweets"
        elif flav == "Salt & Pepper":
            cat = "Baked Chips, Makhana & Unjunked Indian Snacks"
            sub = "Roasted Makhana"

        items.append({
            "brand": "Haldiram's", "name": nm, "cat": cat, "sub": sub, "type": "Traditional Indian Savories & Snacks",
            "mfr": "Haldiram Snacks Pvt Ltd", "flavour": flav, "wt": "150 g", "price": 45 if "Chips" in nm or "Takatak" in nm else 85,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Haldiram's Master Recipe", "Authentic Indian Flavors", "Vegetarian"]
        })

    # ----------------------------------------------------
    # 15. BIKAJI (Bikaji Foods International Ltd) - 12 missing items
    # ----------------------------------------------------
    bikaji_variants = [
        ("Bikaji Bikaneri Bhujia Tana Bana", "Mixture & Namkeen", "Tana Bana Bhujia", "Bikaji's premium GI-tagged Bikaneri bhujia crafted with moth dal and desert spices.",
         "Moth Dal Flour (44%), Gram Flour (Besan 18%), Edible Vegetable Oil (Palmolein & Cottonseed), Iodised Salt, Red Chilli, Black Pepper, Clove, Cardamom, Asafoetida.",
         {"calories": 575, "totalFat": 40.0, "saturatedFat": 16.5, "transFat": 0.0, "carbohydrates": 41.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 6.2, "protein": 13.5, "sodium": 780, "salt": 1.95}),
        ("Bikaji Sub Kuch All-in-One Mixture", "Mixture & Namkeen", "Sub Kuch", "Everything-in-one Marwari mixture with besan sev, flakes, dry fruits, lentils, and spices.",
         "Gram Flour, Edible Vegetable Oil, Rice Flakes, Corn Flakes, Peanuts, Cashews, Raisins, Moong Dal, Salt, Sugar, Spices, Citric Acid (INS 330).",
         {"calories": 535, "totalFat": 32.5, "saturatedFat": 14.0, "transFat": 0.0, "carbohydrates": 50.0, "sugars": 6.5, "addedSugars": 5.0, "fiber": 5.5, "protein": 10.8, "sodium": 740, "salt": 1.85}),
        ("Bikaji Kuch Kuch Namkeen Mix", "Mixture & Namkeen", "Kuch Kuch", "Crunchy namkeen mix of sev, boondi, and fried dal seasoned with Bikaneri masala.",
         "Gram Flour (Besan 45%), Edible Vegetable Oil, Peanuts, Moong Dal, Spices, Salt, Citric Acid (INS 330).",
         {"calories": 540, "totalFat": 33.0, "saturatedFat": 14.2, "transFat": 0.0, "carbohydrates": 49.0, "sugars": 3.0, "addedSugars": 1.8, "fiber": 5.4, "protein": 11.5, "sodium": 760, "salt": 1.90}),
        ("Bikaji Laung Sev", "Mixture & Namkeen", "Laung Sev", "Thick gram flour sev generously infused with crushed fragrant cloves (laung) and black pepper.",
         "Gram Flour (Besan 65%), Edible Vegetable Oil, Clove (Laung 2.5%), Black Pepper, Red Chilli, Salt, Ajwain, Asafoetida.",
         {"calories": 565, "totalFat": 37.0, "saturatedFat": 15.2, "transFat": 0.0, "carbohydrates": 43.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.0, "protein": 13.2, "sodium": 740, "salt": 1.85}),
        ("Bikaji Chana Jor Garam", "Mixture & Namkeen", "Chana Jor Garam", "Pressed black chickpeas roasted and seasoned with tangy Marwari amchur and red chilli.",
         "Bengal Gram (Chana 75%), Edible Vegetable Oil (Palmolein), Salt, Red Chilli, Dry Mango Powder, Cumin, Black Pepper, Clove, Rock Salt.",
         {"calories": 465, "totalFat": 19.0, "saturatedFat": 8.0, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 10.0, "protein": 18.0, "sodium": 690, "salt": 1.72}),
        ("Bikaji Shahi Mixture", "Mixture & Namkeen", "Shahi Mixture", "Royal Marwari treat packed with whole cashews, almonds, raisins, and golden potato strands.",
         "Cashews (18%), Almonds (10%), Potato Sticks (25%), Gram Flour, Edible Vegetable Oil, Raisins, Sugar, Rock Salt, Spices.",
         {"calories": 558, "totalFat": 37.0, "saturatedFat": 12.8, "transFat": 0.0, "carbohydrates": 45.0, "sugars": 8.0, "addedSugars": 6.0, "fiber": 4.8, "protein": 11.2, "sodium": 580, "salt": 1.45}),
        ("Bikaji Millet Bhel", "Mixture & Namkeen", "Millet Bhel", "Healthy roasted multi-millet bhel made from popped bajra, jowar, and ragi with low oil.",
         "Puffed Millets (Jowar, Bajra, Ragi 60%), Roasted Peanuts (12%), Rice Flakes, Sunflower Oil, Salt, Dry Mango, Cumin, Chilli.",
         {"calories": 450, "totalFat": 16.5, "saturatedFat": 3.5, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 9.0, "protein": 10.5, "sodium": 580, "salt": 1.45}),
        ("Bikaji Potato Chips (Salted)", "Chips", "Salted Chips", "Crispy potato chips made in Rajasthan with fine sea salt.",
         "Potato (64%), Edible Vegetable Oil (Palmolein), Salt (1.5%).",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 15.0, "transFat": 0.05, "carbohydrates": 54.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Bikaji Corn Chips", "Chips", "Corn Chips", "Toasted corn chips dusted with Marwari chatpata masala.",
         "Corn (68%), Edible Vegetable Oil (Palmolein), Spices, Salt, Sugar, Citric Acid (INS 330).",
         {"calories": 498, "totalFat": 25.5, "saturatedFat": 11.0, "transFat": 0.05, "carbohydrates": 61.0, "sugars": 2.2, "addedSugars": 1.2, "fiber": 4.2, "protein": 6.8, "sodium": 720, "salt": 1.80}),
        ("Bikaji Bikaneri Papad (Moong & Urad)", "Mixture & Namkeen", "Bikaneri Papad", "Authentic sun-dried Rajasthani thin lentil discs heavily spiked with black pepper and sajji khar.",
         "Moong Dal Flour (60%), Urad Dal Flour (25%), Black Pepper (4.5%), Iodised Salt, Sajji Khar (Alkaline Salt), Asafoetida (Hing), Cottonseed Oil.",
         {"calories": 320, "totalFat": 2.0, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 12.5, "protein": 23.5, "sodium": 1450, "salt": 3.62}),
        ("Bikaji Pure Desi Ghee Soan Papdi", "Chocolates & Sweets", "Soan Papdi", "Traditional melt-in-mouth flaky sweet made in Bikaner with pure desi ghee.",
         "Sugar, Desi Ghee (26%), Gram Flour, Wheat Flour, Almonds, Pistachios, Cardamom.",
         {"calories": 515, "totalFat": 27.5, "saturatedFat": 16.5, "transFat": 0.2, "carbohydrates": 62.5, "sugars": 48.0, "addedSugars": 45.0, "fiber": 2.0, "protein": 5.5, "sodium": 40, "salt": 0.10}),
        ("Bikaji Gond Pak", "Chocolates & Sweets", "Gond Pak", "Traditional winter nutritional sweet packed with edible gum (gond), dry fruits, pure ghee, and warming spices.",
         "Edible Gum (Gond 20%), Desi Ghee (25%), Wheat Flour, Almonds, Cashews, Sugar, Nutmeg, Mace, Cardamom.",
         {"calories": 525, "totalFat": 30.0, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 38.0, "addedSugars": 35.0, "fiber": 4.0, "protein": 6.8, "sodium": 60, "salt": 0.15})
    ]
    for nm, scat, flav, dsc, ing, nut in bikaji_variants:
        cat = "Snacks & Spreads"
        sub = scat
        if flav in ["Soan Papdi", "Gond Pak"]:
            cat = "Chocolates & Sweets"
            sub = "Indian Traditional Sweets"

        items.append({
            "brand": "Bikaji", "name": nm, "cat": cat, "sub": sub, "type": "Bikaneri Farsan & Sweets",
            "mfr": "Bikaji Foods International Ltd", "flavour": flav, "wt": "200 g", "price": 50 if "Bhujia" in nm else 110,
            "desc": dsc, "ing": ing, "nut": nut,
            "highlights": ["Bikaneri Specialty", "GI Tagged Bikaneri Heritage" if "Bikaneri" in nm else "Vegetarian", "Pure Spices"]
        })

    return items

print("Section 2 part 2 and 3 definitions written successfully.")
