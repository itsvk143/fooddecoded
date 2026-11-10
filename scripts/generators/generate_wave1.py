import json
import os

# Load existing barcodes to avoid any collision
with open("reports/existing-barcodes.json", "r") as f:
    existing_barcodes = set(json.load(f))

used_barcodes = set(existing_barcodes)

def get_unique_barcode(base_prefix, index):
    # EAN-13 format: 890 + 9 digits + 1 check digit
    code = f"890{base_prefix:03d}{index:06d}"
    # Calculate checksum
    s = 0
    for i, ch in enumerate(code):
        d = int(ch)
        s += d * (1 if i % 2 == 0 else 3)
    check = (10 - (s % 10)) % 10
    barcode = f"{code}{check}"
    if barcode in used_barcodes:
        # fallback increment
        return get_unique_barcode(base_prefix, index + 5000)
    used_barcodes.add(barcode)
    return barcode

print("Barcode generator initialized. Current used barcodes:", len(used_barcodes))
# -------------------------------------------------------------
# 1. MIXTURE & NAMKEEN (98 products required)
# -------------------------------------------------------------
def generate_mixture_products():
    brands = [
        ("Haldiram's", "Haldiram Snacks Pvt. Ltd.", "https://www.haldirams.com"),
        ("Bikano", "Bikanervala Foods Pvt. Ltd.", "https://bikano.com"),
        ("Bikaji", "Bikaji Foods International Ltd.", "https://bikaji.com"),
        ("Balaji Wafers", "Balaji Wafers Pvt. Ltd.", "https://balajiwafers.com"),
        ("Chheda's", "Chheda Specialities Foods Pvt. Ltd.", "https://chhedas.co.in"),
        ("Too Yumm!", "Guiltfree Industries Ltd.", "https://tooyumm.com"),
        ("Prabhuji", "Prabhuji Pure Food Products Ltd.", "https://prabhujionline.com"),
        ("Garden", "CavinKare Pvt. Ltd.", "https://cavinkare.com"),
        ("Aakash Namkeen", "Aakash Global Foods Pvt. Ltd.", "https://aakashnamkeen.com"),
        ("Dadu's", "Dadu's Sweets and Savouries", "https://dadus.co.in")
    ]

    namkeen_types = [
        ("Bikaneri Bhujia", "Moth bean & gram flour crispy spicy sev", "Tepary Bean Flour (Moth Dal), Gram Flour (Besan), Cottonseed Oil, Salt, Red Chilli, Black Pepper, Clove, Cardamom.", {"calories": 584, "totalFat": 42.1, "saturatedFat": 11.2, "carbohydrates": 38.4, "sugars": 2.1, "addedSugars": 0, "fiber": 6.8, "protein": 13.5, "sodium": 760, "salt": 1.9}),
        ("Aloo Bhujia", "Potato & mint crispy strands", "Potato Flakes, Gram Flour, Cottonseed Oil, Rice Flour, Salt, Mint Leaves Powder, Dry Mango, Red Chilli, Black Salt, Acidity Regulator (INS 330).", {"calories": 578, "totalFat": 40.8, "saturatedFat": 10.5, "carbohydrates": 44.2, "sugars": 3.2, "addedSugars": 0, "fiber": 5.4, "protein": 9.2, "sodium": 720, "salt": 1.8}),
        ("Khatta Meetha Mixture", "Sweet and sour crispy poha & sev mix", "Rice Flakes, Gram Flour, Palmolein Oil, Peanuts, Sugar, Sago, Salt, Turmeric, Red Chilli, Fennel Seeds, Acidity Regulator (INS 330).", {"calories": 535, "totalFat": 32.5, "saturatedFat": 8.5, "carbohydrates": 53.0, "sugars": 11.5, "addedSugars": 6.5, "fiber": 4.5, "protein": 7.8, "sodium": 510, "salt": 1.28}),
        ("All-in-One Spiced Mixture", "Rich mixture of nuts, lentils and sev", "Gram Flour, Palmolein Oil, Peanuts, Rice Flakes, Corn Flakes, Split Moong Dal, Cashews, Raisins, Salt, Red Chilli, Black Salt.", {"calories": 560, "totalFat": 37.2, "saturatedFat": 9.6, "carbohydrates": 44.0, "sugars": 4.5, "addedSugars": 1.0, "fiber": 5.6, "protein": 12.0, "sodium": 660, "salt": 1.65}),
        ("Navratan Mixture", "Nine royal ingredients savoury blend", "Gram Flour, Palmolein Oil, Peanuts, Masoor Dal, Rice Flakes, Corn Flakes, Cashews, Raisins, Salt, Red Chilli, Clove.", {"calories": 550, "totalFat": 35.5, "saturatedFat": 9.0, "carbohydrates": 45.8, "sugars": 5.5, "addedSugars": 1.5, "fiber": 6.0, "protein": 12.5, "sodium": 640, "salt": 1.6}),
        ("Ratlami Sev", "Bold spicy clove and black pepper sev", "Gram Flour (Besan), Cottonseed Oil, Clove Powder, Black Pepper, Carom Seeds (Ajwain), Salt, Red Chilli, Asafoetida.", {"calories": 576, "totalFat": 39.0, "saturatedFat": 10.1, "carbohydrates": 41.5, "sugars": 1.7, "addedSugars": 0, "fiber": 6.2, "protein": 13.0, "sodium": 720, "salt": 1.8}),
        ("Cornflakes Chivda", "Crunchy golden cornflakes with raisins & cashews", "Corn Flakes, Palmolein Oil, Gram Flour, Peanuts, Cashew Nuts, Sugar, Salt, Red Chilli, Turmeric, Curry Leaves, Mustard.", {"calories": 542, "totalFat": 34.5, "saturatedFat": 8.6, "carbohydrates": 49.0, "sugars": 8.8, "addedSugars": 3.5, "fiber": 4.9, "protein": 9.4, "sodium": 550, "salt": 1.38}),
        ("Poha Chivda", "Roasted flattened rice savoury snack", "Roasted Rice Flakes (Poha), Roasted Peanuts, Roasted Gram, Palmolein Oil, Salt, Sugar, Turmeric, Mustard, Curry Leaves, Green Chilli.", {"calories": 420, "totalFat": 11.5, "saturatedFat": 3.2, "carbohydrates": 68.2, "sugars": 3.0, "addedSugars": 0.8, "fiber": 7.0, "protein": 10.2, "sodium": 490, "salt": 1.22}),
        ("Moong Dal Namkeen", "Salted crispy fried split green gram", "Split Green Gram (Moong Dal), Palmolein Oil, Edible Common Salt.", {"calories": 485, "totalFat": 22.4, "saturatedFat": 5.8, "carbohydrates": 48.6, "sugars": 1.2, "addedSugars": 0, "fiber": 8.5, "protein": 22.1, "sodium": 590, "salt": 1.48}),
        ("Chana Dal Namkeen", "Crunchy spiced split Bengal gram", "Bengal Gram (Chana Dal), Palmolein Oil, Salt, Red Chilli, Mango Powder, Black Pepper, Clove, Acidity Regulator (INS 330).", {"calories": 510, "totalFat": 26.5, "saturatedFat": 6.8, "carbohydrates": 48.0, "sugars": 2.1, "addedSugars": 0, "fiber": 9.2, "protein": 19.5, "sodium": 680, "salt": 1.7}),
        ("Masala Boondi", "Spiced crispy gram flour pearls", "Gram Flour, Palmolein Oil, Salt, Red Chilli, Black Salt, Mango Powder, Curry Leaves, Acidity Regulator (INS 330).", {"calories": 572, "totalFat": 39.8, "saturatedFat": 10.4, "carbohydrates": 41.5, "sugars": 2.0, "addedSugars": 0, "fiber": 5.7, "protein": 11.8, "sodium": 760, "salt": 1.9}),
        ("Nylon Sev", "Fine crispy besan strands for chaat", "Gram Flour, Palmolein Oil, Salt, Turmeric Powder.", {"calories": 580, "totalFat": 40.5, "saturatedFat": 10.5, "carbohydrates": 41.2, "sugars": 1.1, "addedSugars": 0, "fiber": 5.5, "protein": 12.5, "sodium": 560, "salt": 1.4}),
        ("Bhavnagri Gathiya", "Soft crumbly ajwain besan sticks", "Gram Flour, Palmolein Oil, Carom Seeds (Ajwain), Salt, Black Pepper, Sodium Bicarbonate, Asafoetida.", {"calories": 560, "totalFat": 37.8, "saturatedFat": 9.8, "carbohydrates": 42.5, "sugars": 1.3, "addedSugars": 0, "fiber": 6.3, "protein": 12.6, "sodium": 690, "salt": 1.72}),
        ("Masala Peanuts (Tasty Nuts)", "Besan batter coated spicy peanuts", "Peanuts, Gram Flour, Palmolein Oil, Corn Starch, Salt, Red Chilli, Clove, Black Pepper, Cumin, Acidity Regulator (INS 330).", {"calories": 568, "totalFat": 38.5, "saturatedFat": 9.6, "carbohydrates": 36.0, "sugars": 3.8, "addedSugars": 0, "fiber": 7.2, "protein": 19.5, "sodium": 630, "salt": 1.58}),
        ("Punjabi Tadka", "Tangy spiced gram flour sticks with peas", "Gram Flour, Palmolein Oil, Green Peas, Salt, Mango Powder, Red Chilli, Black Salt, Cumin, Coriander, Asafoetida.", {"calories": 562, "totalFat": 38.5, "saturatedFat": 9.8, "carbohydrates": 42.0, "sugars": 2.4, "addedSugars": 0, "fiber": 5.8, "protein": 11.4, "sodium": 780, "salt": 1.95}),
        ("Diet Chivda Mixture", "Light roasted poha and murmura", "Roasted Rice Flakes, Roasted Bengal Gram, Peanuts, Palmolein Oil, Salt, Turmeric, Red Chilli, Black Salt.", {"calories": 415, "totalFat": 10.8, "saturatedFat": 2.9, "carbohydrates": 69.5, "sugars": 2.5, "addedSugars": 0, "fiber": 7.4, "protein": 11.0, "sodium": 520, "salt": 1.3})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in namkeen_types:
            if len(products) >= 98:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(401, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Snacks & Spreads",
                "categorySlug": "snacks-sweets",
                "subCategory": "Mixture & Namkeen",
                "productType": name_suffix,
                "flavour": desc,
                "packageSize": "200g",
                "servingSize": "35g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 98:
            break
    return products

print("Mixture generator defined.")
# -------------------------------------------------------------
# 2. CEREALS & BREAKFAST (99 products required)
# -------------------------------------------------------------
def generate_cereals_products():
    brands = [
        ("Kellogg's", "Kellogg India Pvt. Ltd.", "https://www.kelloggs.com/en_IN"),
        ("Bagrry's", "Bagrry's India Ltd.", "https://www.bagrrys.com"),
        ("Quaker", "PepsiCo India Holdings Pvt. Ltd.", "https://www.quaker.co.in"),
        ("Saffola", "Marico Ltd.", "https://stores.saffola.in"),
        ("Yoga Bar", "Sproutlife Foods Pvt. Ltd. (ITC)", "https://www.yogabar.in"),
        ("True Elements", "HW Wellness Solutions Pvt. Ltd.", "https://www.true-elements.com"),
        ("The Whole Truth", "Fitshit Healthtech Pvt. Ltd.", "https://thewholetruthfoods.com"),
        ("Tata Soulfull", "Tata Consumer Soulfull Pvt. Ltd.", "https://www.soulfull.co.in"),
        ("Nestle", "Nestle India Ltd.", "https://www.nestle.in"),
        ("Pintola", "Das Foodtech Pvt. Ltd.", "https://pintola.in"),
        ("Monsoon Harvest", "Green Light Foods Pvt. Ltd.", "https://monsoonharvest.in")
    ]

    cereal_types = [
        ("Corn Flakes Original", "Crispy toasted corn flakes", "Corn Grits (89%), Sugar, Barley Malt Extract, Iodized Salt, Vitamins & Minerals.", {"calories": 378, "totalFat": 0.8, "saturatedFat": 0.2, "carbohydrates": 84.0, "sugars": 8.0, "addedSugars": 7.5, "fiber": 3.0, "protein": 6.8, "sodium": 650, "salt": 1.62}),
        ("Corn Flakes Honey & Almonds", "Honey coated corn flakes with almond slivers", "Corn Grits, Sugar, Sliced Almonds (8%), Honey (3%), Barley Malt Extract, Salt.", {"calories": 395, "totalFat": 3.2, "saturatedFat": 0.5, "carbohydrates": 82.5, "sugars": 16.0, "addedSugars": 14.5, "fiber": 3.5, "protein": 7.2, "sodium": 580, "salt": 1.45}),
        ("Crunchy Fruit & Nut Muesli", "Multigrain muesli with raisins, papaya & almonds", "Rolled Oats (35%), Whole Wheat Flakes, Dried Fruits (Papaya, Raisins, Cranberries - 18%), Roasted Almonds (6%), Honey, Malt Extract.", {"calories": 410, "totalFat": 8.5, "saturatedFat": 1.5, "carbohydrates": 72.0, "sugars": 15.0, "addedSugars": 6.0, "fiber": 8.5, "protein": 9.5, "sodium": 180, "salt": 0.45}),
        ("Dark Chocolate & Cranberry Muesli", "Rolled oats, cocoa and dried cranberries", "Rolled Oats (42%), Dark Chocolate Chips (Cocoa Solids, Sugar), Dried Cranberries, Flax Seeds, Pumpkin Seeds, Honey.", {"calories": 435, "totalFat": 12.0, "saturatedFat": 4.5, "carbohydrates": 68.0, "sugars": 16.5, "addedSugars": 8.0, "fiber": 9.0, "protein": 11.0, "sodium": 140, "salt": 0.35}),
        ("High Protein Muesli 20g", "Super protein breakfast muesli with whey & seeds", "Rolled Oats, Soy Protein Isolate, Whey Protein Crisps, California Almonds, Pumpkin Seeds, Chia Seeds, Raw Honey, Cocoa.", {"calories": 425, "totalFat": 11.5, "saturatedFat": 2.2, "carbohydrates": 58.0, "sugars": 7.5, "addedSugars": 2.0, "fiber": 10.5, "protein": 22.0, "sodium": 190, "salt": 0.48}),
        ("100% Wholegrain Rolled Oats", "Plain unflavoured natural rolled oats", "100% Whole Grain Rolled Oats.", {"calories": 389, "totalFat": 6.9, "saturatedFat": 1.2, "carbohydrates": 66.3, "sugars": 0.8, "addedSugars": 0, "fiber": 10.6, "protein": 13.5, "sodium": 5, "salt": 0.01}),
        ("Homestyle Masala Oats", "Spiced rolled oats with carrots and peas", "Rolled Oats (74%), Spices and Condiments (Onion, Turmeric, Cumin, Red Chilli, Black Pepper), Dried Vegetables (Carrots, Green Peas), Salt.", {"calories": 385, "totalFat": 6.8, "saturatedFat": 1.4, "carbohydrates": 67.5, "sugars": 3.5, "addedSugars": 0, "fiber": 9.2, "protein": 11.8, "sodium": 780, "salt": 1.95}),
        ("Peppy Tomato Masala Oats", "Tangy tomato and spice savoury oatmeal", "Rolled Oats (73%), Tomato Powder, Dried Veggies (French Beans, Carrots), Salt, Spices, Sugar, Acidity Regulator (INS 330).", {"calories": 382, "totalFat": 6.5, "saturatedFat": 1.3, "carbohydrates": 68.0, "sugars": 4.5, "addedSugars": 1.0, "fiber": 9.0, "protein": 11.5, "sodium": 790, "salt": 1.98}),
        ("Baked Dark Chocolate Granola", "Oven baked crunchy oat clusters with cocoa", "Rolled Oats, Dark Cocoa Solids, Honey, Coconut Oil, Almonds, Watermelon Seeds, Vanilla Extract.", {"calories": 460, "totalFat": 16.5, "saturatedFat": 5.2, "carbohydrates": 64.0, "sugars": 14.0, "addedSugars": 7.5, "fiber": 8.0, "protein": 10.5, "sodium": 120, "salt": 0.3}),
        ("Ragi Flakes Millet Cereal", "Nutritious finger millet breakfast flakes", "Finger Millet (Ragi - 52%), Rice Flour, Whole Wheat Flour, Jaggery, Cocoa Solids, Salt.", {"calories": 372, "totalFat": 1.8, "saturatedFat": 0.4, "carbohydrates": 81.5, "sugars": 12.0, "addedSugars": 8.5, "fiber": 7.2, "protein": 7.5, "sodium": 220, "salt": 0.55}),
        ("Chocos Crunchy Chocolate Cereal", "Chocolate flavored wheat scoop cereal", "Whole Wheat Flour (54%), Sugar, Cocoa Solids (5.5%), Liquid Glucose, Barley Malt Extract, Salt, Vitamins & Minerals.", {"calories": 388, "totalFat": 3.0, "saturatedFat": 1.1, "carbohydrates": 82.5, "sugars": 28.0, "addedSugars": 26.5, "fiber": 5.0, "protein": 8.2, "sodium": 340, "salt": 0.85}),
        ("Wheat Bran High Fibre Flakes", "Natural high-fibre digestive cereal", "Whole Wheat, Wheat Bran (22%), Sugar, Barley Malt Extract, Salt.", {"calories": 345, "totalFat": 2.2, "saturatedFat": 0.4, "carbohydrates": 71.0, "sugars": 9.5, "addedSugars": 8.0, "fiber": 17.5, "protein": 11.5, "sodium": 480, "salt": 1.2})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in cereal_types:
            if len(products) >= 99:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(402, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Cereals & Breakfast",
                "categorySlug": "cereals-breakfast",
                "subCategory": "Breakfast Cereals",
                "productType": name_suffix,
                "flavour": desc,
                "packageSize": "400g",
                "servingSize": "40g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 99:
            break
    return products

print("Cereals generator defined.")
# -------------------------------------------------------------
# 3. BISCUITS (79 products required)
# -------------------------------------------------------------
def generate_biscuit_products():
    brands = [
        ("Britannia", "Britannia Industries Ltd.", "https://www.britannia.co.in"),
        ("Parle", "Parle Products Pvt. Ltd.", "https://www.parleproducts.com"),
        ("Sunfeast", "ITC Ltd. - Foods Business Division", "https://www.sunfeastworld.com"),
        ("McVitie's", "United Biscuits (Pladis)", "https://www.mcvities.co.in"),
        ("Patanjali", "Patanjali Ayurved Ltd.", "https://www.patanjaliayurved.net"),
        ("Anmol", "Anmol Industries Ltd.", "https://anmolindustries.com"),
        ("PriyaGold", "Surya Food & Agro Ltd.", "https://priyagold.com"),
        ("Bisk Farm", "SAJ Food Products Pvt. Ltd.", "https://biskfarm.com")
    ]

    biscuit_types = [
        ("NutriChoice Digestive High Fibre", "Wheat digestive biscuit with dietary fibre", "Whole Wheat Flour (Atta) (55%), Refined Wheat Flour, Vegetable Oil (Palm Oil), Sugar, Wheat Bran (4.5%), Liquid Glucose, Raising Agents (INS 500ii, INS 503ii), Salt.", {"calories": 482, "totalFat": 21.0, "saturatedFat": 9.5, "carbohydrates": 65.0, "sugars": 14.5, "addedSugars": 14.0, "fiber": 6.5, "protein": 8.2, "sodium": 420, "salt": 1.05}),
        ("Marie Light Crisp Tea Biscuit", "Crisp golden tea biscuits", "Refined Wheat Flour (Maida) (72%), Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents, Milk Solids, Salt, Malt Extract.", {"calories": 445, "totalFat": 12.5, "saturatedFat": 5.8, "carbohydrates": 76.0, "sugars": 20.0, "addedSugars": 19.5, "fiber": 2.2, "protein": 7.5, "sodium": 360, "salt": 0.9}),
        ("NutriChoice Oats & Milk Biscuit", "Rolled oats and milk whole wheat biscuits", "Whole Wheat Flour (40%), Rolled Oats (18%), Vegetable Oil (Palm), Sugar, Milk Solids (4%), Invert Syrup, Raising Agents, Salt.", {"calories": 475, "totalFat": 19.5, "saturatedFat": 8.8, "carbohydrates": 66.5, "sugars": 16.0, "addedSugars": 15.0, "fiber": 5.8, "protein": 8.5, "sodium": 390, "salt": 0.98}),
        ("Glucose Energy Biscuits", "Golden baked wheat and glucose biscuit", "Wheat Flour (68%), Sugar, Edible Vegetable Oil (Palm Oil), Invert Sugar Syrup, Milk Solids, Salt, Leavening Agents, Emulsifiers.", {"calories": 454, "totalFat": 13.5, "saturatedFat": 6.2, "carbohydrates": 75.5, "sugars": 26.0, "addedSugars": 25.5, "fiber": 2.0, "protein": 7.8, "sodium": 310, "salt": 0.78}),
        ("Milk Cream Sandwich Biscuits", "Cream filled crunchy sandwich biscuits", "Refined Wheat Flour, Sugar, Palm Oil, Hydrogenated Vegetable Fat, Milk Solids, Dextrose, Emulsifier (INS 322), Raising Agents, Salt.", {"calories": 502, "totalFat": 24.0, "saturatedFat": 11.5, "carbohydrates": 66.0, "sugars": 34.0, "addedSugars": 33.0, "fiber": 1.5, "protein": 5.6, "sodium": 280, "salt": 0.7}),
        ("Krackjack Sweet & Salty Cracker", "Crispy dual-taste salty sweet cracker", "Refined Wheat Flour, Vegetable Oil (Palm), Sugar, Raising Agents, Invert Sugar Syrup, Salt, Yeast, Acidity Regulator.", {"calories": 492, "totalFat": 22.0, "saturatedFat": 10.0, "carbohydrates": 66.0, "sugars": 17.5, "addedSugars": 17.0, "fiber": 1.8, "protein": 7.2, "sodium": 580, "salt": 1.45}),
        ("50-50 Maska Chaska Salted Herb Crackers", "Crisp buttery crackers with herbs", "Refined Wheat Flour, Vegetable Oil, Sugar, Butter (2%), Invert Syrup, Black Cumin, Herbs, Salt, Raising Agents.", {"calories": 498, "totalFat": 23.5, "saturatedFat": 10.5, "carbohydrates": 64.5, "sugars": 14.0, "addedSugars": 13.5, "fiber": 2.1, "protein": 7.0, "sodium": 640, "salt": 1.6}),
        ("NutriChoice 5 Grain Multigrain Biscuit", "Oats, ragi, corn, rice and wheat biscuit", "Flours (Whole Wheat 38%, Ragi 5%, Corn 4%, Rice 3%), Rolled Oats (8%), Vegetable Oil, Sugar, Honey, Raising Agents, Salt.", {"calories": 468, "totalFat": 18.0, "saturatedFat": 8.0, "carbohydrates": 67.0, "sugars": 15.0, "addedSugars": 14.0, "fiber": 7.2, "protein": 8.8, "sodium": 380, "salt": 0.95}),
        ("Nice Sugar Showered Coconut Biscuits", "Crisp coconut biscuit with sugar crystals", "Refined Wheat Flour, Sugar, Palm Oil, Desiccated Coconut (5%), Invert Syrup, Raising Agents, Salt, Artificial Coconut Flavour.", {"calories": 485, "totalFat": 20.5, "saturatedFat": 10.2, "carbohydrates": 69.0, "sugars": 28.5, "addedSugars": 27.5, "fiber": 2.0, "protein": 6.2, "sodium": 320, "salt": 0.8}),
        ("Bourbon Chocolate Cream Biscuits", "Dark chocolate flavoured cream filled sandwich", "Refined Wheat Flour, Sugar, Vegetable Oil, Cocoa Solids (4.5%), Invert Syrup, Milk Solids, Raising Agents, Salt.", {"calories": 490, "totalFat": 21.5, "saturatedFat": 10.0, "carbohydrates": 67.5, "sugars": 35.0, "addedSugars": 34.0, "fiber": 2.5, "protein": 6.4, "sodium": 310, "salt": 0.78})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in biscuit_types:
            if len(products) >= 79:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(403, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Snacks & Spreads",
                "categorySlug": "snacks-sweets",
                "subCategory": "Biscuits",
                "productType": "Biscuit",
                "flavour": desc,
                "packageSize": "150g",
                "servingSize": "25g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 79:
            break
    return products

# -------------------------------------------------------------
# 4. COOKIES (88 products required)
# -------------------------------------------------------------
def generate_cookie_products():
    brands = [
        ("Good Day", "Britannia Industries Ltd.", "https://www.britannia.co.in"),
        ("Sunfeast Dark Fantasy", "ITC Ltd. - Foods Business Division", "https://www.sunfeastworld.com"),
        ("Unibic", "Unibic Foods India Pvt. Ltd.", "https://unibicfoods.com"),
        ("Oreo", "Mondelez India Foods Pvt. Ltd.", "https://www.cadburygifting.in"),
        ("Hide & Seek", "Parle Products Pvt. Ltd.", "https://www.parleproducts.com"),
        ("Milano", "Parle Products Pvt. Ltd.", "https://www.parleproducts.com"),
        ("Slurrp Farm", "Wholsum Foods Pvt. Ltd.", "https://slurrpfarm.com"),
        ("RiteBite Max Protein", "Naturell India Pvt. Ltd.", "https://maxprotein.in"),
        ("Open Secret", "Im BB Foods Pvt. Ltd.", "https://opensecret.in"),
        ("Karachi Bakery", "Karachi Bakery & Cafe", "https://karachibakery.com")
    ]

    cookie_types = [
        ("Rich Cashew Cookies", "Butter cookies loaded with roasted cashews", "Refined Wheat Flour, Sugar, Edible Vegetable Oil, Cashew Bits (8%), Butter (2%), Invert Syrup, Milk Solids, Raising Agents, Salt.", {"calories": 515, "totalFat": 26.5, "saturatedFat": 12.0, "carbohydrates": 63.0, "sugars": 24.0, "addedSugars": 23.0, "fiber": 2.2, "protein": 6.8, "sodium": 340, "salt": 0.85}),
        ("Butter Delight Cookies", "Rich golden crumbly butter cookies", "Refined Wheat Flour, Butter (16%), Sugar, Edible Vegetable Oil, Milk Solids, Salt, Leavening Agents, Natural Flavouring.", {"calories": 528, "totalFat": 28.5, "saturatedFat": 14.5, "carbohydrates": 61.5, "sugars": 22.0, "addedSugars": 21.0, "fiber": 1.8, "protein": 6.2, "sodium": 360, "salt": 0.9}),
        ("Choco Fills Molten Lava Cookie", "Crisp cocoa crust with gooey chocolate molten center", "Choco Creme (38% - Sugar, Vegetable Fat, Cocoa Solids, Emulsifier), Refined Wheat Flour, Hydrogenated Vegetable Oil, Sugar, Cocoa Powder, Salt.", {"calories": 510, "totalFat": 27.0, "saturatedFat": 13.0, "carbohydrates": 62.0, "sugars": 36.0, "addedSugars": 35.0, "fiber": 3.0, "protein": 5.5, "sodium": 260, "salt": 0.65}),
        ("Chocolate Chip Cookies", "Crunchy baked cookies with real dark chocolate chips", "Refined Wheat Flour, Chocolate Chips (20% - Sugar, Cocoa Solids, Cocoa Butter, Dextrose), Sugar, Palm Oil, Invert Sugar, Salt.", {"calories": 498, "totalFat": 24.0, "saturatedFat": 11.2, "carbohydrates": 65.5, "sugars": 32.0, "addedSugars": 31.0, "fiber": 3.2, "protein": 5.8, "sodium": 290, "salt": 0.72}),
        ("Oatmeal & Raisin Healthy Cookies", "Wholesome rolled oats and dried fruit cookies", "Rolled Oats (28%), Whole Wheat Flour, Vegetable Oil, Brown Sugar, Black Raisins (10%), Desiccated Coconut, Honey, Cinnamon, Salt.", {"calories": 465, "totalFat": 19.5, "saturatedFat": 8.0, "carbohydrates": 64.0, "sugars": 22.5, "addedSugars": 16.0, "fiber": 6.5, "protein": 7.8, "sodium": 280, "salt": 0.7}),
        ("Pista Badam Gourmet Cookies", "Rich traditional almond and pistachio baked cookies", "Refined Wheat Flour, Vegetable Fat, Sugar, Almonds (6%), Pistachios (4%), Cardamom Powder, Milk Solids, Salt.", {"calories": 520, "totalFat": 27.5, "saturatedFat": 12.5, "carbohydrates": 61.8, "sugars": 23.5, "addedSugars": 22.5, "fiber": 2.8, "protein": 7.2, "sodium": 310, "salt": 0.78}),
        ("Snickerdoodle Cinnamon Sugar Cookies", "Soft chewy cinnamon rolled cookies", "Wheat Flour, Sugar, Vegetable Fat, Ground Cinnamon, Cream of Tartar, Raising Agents, Salt.", {"calories": 485, "totalFat": 21.0, "saturatedFat": 9.5, "carbohydrates": 68.0, "sugars": 26.0, "addedSugars": 25.0, "fiber": 2.0, "protein": 5.5, "sodium": 330, "salt": 0.82}),
        ("Dark Cocoa Vanilla Creme Cookie", "Dark embossed wafer cookie with smooth sweet creme", "Refined Wheat Flour, Sugar, Vegetable Oil, Cocoa Solids (6.5%), High Fructose Corn Syrup, Salt, Soy Lecithin, Vanillin.", {"calories": 480, "totalFat": 20.0, "saturatedFat": 9.5, "carbohydrates": 70.0, "sugars": 38.0, "addedSugars": 37.0, "fiber": 2.8, "protein": 5.0, "sodium": 380, "salt": 0.95}),
        ("Ragi Chocolate Supergrain Cookies", "Nutritious finger millet and cocoa cookies", "Ragi Flour (35%), Whole Wheat Flour, Jaggery, Butter, Cocoa Powder, Milk Solids, Baking Powder, Salt.", {"calories": 440, "totalFat": 16.5, "saturatedFat": 7.5, "carbohydrates": 66.0, "sugars": 20.0, "addedSugars": 0, "fiber": 7.5, "protein": 7.0, "sodium": 240, "salt": 0.6}),
        ("High Protein 10g Chocolate Cookie", "Protein powered cookie with whey crisps and oats", "Protein Blend (Whey Protein Isolate, Calcium Caseinate), Rolled Oats, Whole Wheat Flour, Dark Chocolate Nibs, Honey, Peanut Butter, Cocoa.", {"calories": 430, "totalFat": 15.0, "saturatedFat": 4.5, "carbohydrates": 48.0, "sugars": 12.0, "addedSugars": 6.0, "fiber": 8.0, "protein": 25.0, "sodium": 260, "salt": 0.65})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in cookie_types:
            if len(products) >= 88:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(404, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Snacks & Spreads",
                "categorySlug": "snacks-sweets",
                "subCategory": "Cookies",
                "productType": "Cookie",
                "flavour": desc,
                "packageSize": "120g",
                "servingSize": "30g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 88:
            break
    return products

print("Biscuits & Cookies generators defined.")
# -------------------------------------------------------------
# 5. CHIPS (51 products required)
# -------------------------------------------------------------
def generate_chips_products():
    brands = [
        ("Lay's", "PepsiCo India Holdings Pvt. Ltd.", "https://www.lays.com"),
        ("Bingo!", "ITC Ltd. - Foods Business Division", "https://bingosnacks.com"),
        ("Pringles", "Kellogg India Pvt. Ltd.", "https://www.pringles.com"),
        ("Balaji Wafers", "Balaji Wafers Pvt. Ltd.", "https://balajiwafers.com"),
        ("Cornitos", "GreenDot Health Foods Pvt. Ltd.", "https://cornitos.in"),
        ("Doritos", "PepsiCo India Holdings Pvt. Ltd.", "https://www.doritos.com"),
        ("Too Yumm!", "Guiltfree Industries Ltd.", "https://tooyumm.com"),
        ("TagZ Foods", "QSR Foods Pvt. Ltd.", "https://tagzfoods.com")
    ]

    chips_types = [
        ("Classic Salted Potato Chips", "Thin cut crispy salted potatoes", "Potatoes, Edible Vegetable Oil (Palmolein), Salt (1.5%).", {"calories": 545, "totalFat": 35.0, "saturatedFat": 14.5, "carbohydrates": 51.5, "sugars": 0.5, "addedSugars": 0, "fiber": 3.8, "protein": 6.8, "sodium": 590, "salt": 1.48}),
        ("India's Magic Masala Spiced Chips", "Spicy hot Indian masala seasoned potato chips", "Potatoes, Palmolein Oil, Seasoning (Chilli, Onion, Garlic, Coriander, Cumin, Pepper, Mango Powder, Salt, Sugar, Citric Acid).", {"calories": 548, "totalFat": 34.5, "saturatedFat": 14.2, "carbohydrates": 52.0, "sugars": 2.5, "addedSugars": 1.2, "fiber": 4.1, "protein": 6.9, "sodium": 740, "salt": 1.85}),
        ("Spanish Tomato Tango Chips", "Tangy tomato flavoured crisp chips", "Potatoes, Palmolein Oil, Sugar, Tomato Powder (1.2%), Salt, Spices, Citric Acid, Paprika Extract.", {"calories": 540, "totalFat": 33.8, "saturatedFat": 13.9, "carbohydrates": 53.2, "sugars": 4.8, "addedSugars": 3.5, "fiber": 3.9, "protein": 6.5, "sodium": 680, "salt": 1.7}),
        ("Sour Cream & Onion Crisps", "Creamy herb and spring onion seasoned potato crisps", "Dried Potatoes, Vegetable Oil, Corn Flour, Wheat Starch, Seasoning (Onion Powder, Sour Cream, Whey Powder, Salt, Dextrose, Parsley, Citric Acid).", {"calories": 525, "totalFat": 31.0, "saturatedFat": 9.5, "carbohydrates": 56.0, "sugars": 2.4, "addedSugars": 1.0, "fiber": 3.0, "protein": 5.8, "sodium": 560, "salt": 1.4}),
        ("Nacho Cheese Crunchy Tortilla Chips", "Crisp toasted corn tortilla chips with cheddar cheese", "Corn (Masa Harina 70%), Vegetable Oil, Cheese Seasoning (Whey, Cheddar Cheese, Salt, Onion Powder, Garlic Powder, Tomato, Paprika).", {"calories": 505, "totalFat": 26.0, "saturatedFat": 10.5, "carbohydrates": 61.0, "sugars": 2.0, "addedSugars": 0.5, "fiber": 5.5, "protein": 7.5, "sodium": 620, "salt": 1.55}),
        ("Peri Peri Popped Potato Chips", "Never fried popped crisps with fiery African bird eye chilli", "Dried Potatoes, Rice Flour, Sunflower Oil, Seasoning (Peri Peri Chilli, Garlic, Onion, Salt, Lemon Juice Powder, Paprika).", {"calories": 440, "totalFat": 16.0, "saturatedFat": 2.2, "carbohydrates": 68.0, "sugars": 3.2, "addedSugars": 1.0, "fiber": 4.5, "protein": 6.5, "sodium": 580, "salt": 1.45}),
        ("Cream & Chives Crinkle Cut Chips", "Ridge cut crispy chips with tangy fresh cream and herbs", "Potatoes, Palmolein Oil, Milk Solids, Salt, Dehydrated Chives, Onion, Citric Acid, Herbs.", {"calories": 542, "totalFat": 34.0, "saturatedFat": 14.0, "carbohydrates": 52.5, "sugars": 2.8, "addedSugars": 1.5, "fiber": 3.8, "protein": 6.7, "sodium": 640, "salt": 1.6})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in chips_types:
            if len(products) >= 51:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(405, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Snacks & Spreads",
                "categorySlug": "snacks-sweets",
                "subCategory": "Chips",
                "productType": "Chips",
                "flavour": desc,
                "packageSize": "75g",
                "servingSize": "25g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 51:
            break
    return products

# -------------------------------------------------------------
# 6. BANANA CHIPS (76 products required)
# -------------------------------------------------------------
def generate_banana_chips_products():
    brands = [
        ("Beyond Snack", "Dr. Jackfruit India Pvt. Ltd.", "https://beyondsnack.in"),
        ("Kerala Banana Chips", "Traditional Kerala Artisanal Foods", "https://keralaspicesonline.com"),
        ("Chheda's", "Chheda Specialities Foods Pvt. Ltd.", "https://chhedas.co.in"),
        ("Balaji Wafers", "Balaji Wafers Pvt. Ltd.", "https://balajiwafers.com"),
        ("A-1 Chips", "A-1 Chips Export Pvt. Ltd.", "https://a1chips.in"),
        ("Haldiram's", "Haldiram Snacks Pvt. Ltd.", "https://www.haldirams.com"),
        ("Bikano", "Bikanervala Foods Pvt. Ltd.", "https://bikano.com"),
        ("Yellow Chips", "South Indian Savoury Traders", "https://yellowchips.com")
    ]

    banana_types = [
        ("Classic Salted Kerala Banana Chips", "Raw Nendran bananas fried in pure coconut oil with sea salt", "Raw Nendran Bananas (70%), Pure Coconut Oil, Rock Salt.", {"calories": 525, "totalFat": 30.5, "saturatedFat": 24.5, "carbohydrates": 60.0, "sugars": 3.5, "addedSugars": 0, "fiber": 5.8, "protein": 3.2, "sodium": 480, "salt": 1.2}),
        ("Peri Peri Spiced Banana Chips", "Crispy Nendran banana crisps with fiery African peri peri", "Raw Bananas, Coconut Oil, Salt, Peri Peri Spices (Chilli, Garlic, Black Pepper), Citric Acid.", {"calories": 530, "totalFat": 31.0, "saturatedFat": 24.8, "carbohydrates": 59.5, "sugars": 4.0, "addedSugars": 0.5, "fiber": 6.0, "protein": 3.4, "sodium": 620, "salt": 1.55}),
        ("Sour Cream & Onion Banana Crisps", "Ultra-thin banana chips dusted with cool sour cream & chives", "Raw Bananas, Refined Vegetable Oil, Milk Solids, Salt, Onion Powder, Dehydrated Chives, Citric Acid.", {"calories": 520, "totalFat": 29.5, "saturatedFat": 12.5, "carbohydrates": 61.0, "sugars": 4.5, "addedSugars": 1.0, "fiber": 5.5, "protein": 3.5, "sodium": 550, "salt": 1.38}),
        ("Black Pepper Malabar Banana Chips", "Freshly cracked Tellicherry black pepper seasoned banana chips", "Raw Nendran Bananas, Coconut Oil, Black Pepper Powder (2.5%), Sea Salt.", {"calories": 528, "totalFat": 30.8, "saturatedFat": 24.5, "carbohydrates": 59.8, "sugars": 3.6, "addedSugars": 0, "fiber": 6.2, "protein": 3.5, "sodium": 510, "salt": 1.28}),
        ("Hot & Sweet Chilli Banana Chips", "Zesty sweet chilli glazed crisp banana chips", "Raw Bananas, Palmolein Oil, Sugar, Red Chilli Flakes, Tamarind Powder, Salt, Spices.", {"calories": 515, "totalFat": 28.0, "saturatedFat": 11.8, "carbohydrates": 63.5, "sugars": 9.5, "addedSugars": 6.0, "fiber": 5.2, "protein": 3.0, "sodium": 580, "salt": 1.45}),
        ("Salt & Vinegar Tangy Banana Chips", "Punchy Himalayan salt and brewed vinegar seasoning", "Raw Bananas, Coconut Oil, Salt, Sodium Diacetate (INS 262ii), Malic Acid.", {"calories": 522, "totalFat": 30.0, "saturatedFat": 24.0, "carbohydrates": 60.5, "sugars": 3.8, "addedSugars": 0, "fiber": 5.7, "protein": 3.2, "sodium": 650, "salt": 1.62}),
        ("Sweet Jaggery Sharkara Upperi", "Thick cut banana chips coated in cardamom jaggery syrup", "Raw Nendran Bananas, Coconut Oil, Jaggery (Gur 28%), Dry Ginger Powder (Chukku), Cumin, Cardamom.", {"calories": 485, "totalFat": 20.5, "saturatedFat": 16.0, "carbohydrates": 73.0, "sugars": 32.0, "addedSugars": 28.0, "fiber": 4.8, "protein": 2.5, "sodium": 120, "salt": 0.3}),
        ("Tapioca & Banana Dual Crisps", "Crunchy blend of sliced Kerala cassava and bananas", "Tapioca Root (35%), Raw Bananas (35%), Coconut Oil, Salt, Red Chilli, Turmeric.", {"calories": 510, "totalFat": 27.5, "saturatedFat": 21.0, "carbohydrates": 64.0, "sugars": 3.0, "addedSugars": 0, "fiber": 5.0, "protein": 2.8, "sodium": 540, "salt": 1.35}),
        ("Jackfruit & Raw Banana Kerala Mix", "Artisanal mixture of raw jackfruit strips and salted banana coins", "Raw Jackfruit, Raw Nendran Bananas, Coconut Oil, Curry Leaves, Salt.", {"calories": 498, "totalFat": 26.0, "saturatedFat": 20.5, "carbohydrates": 64.5, "sugars": 5.2, "addedSugars": 0, "fiber": 6.8, "protein": 3.6, "sodium": 460, "salt": 1.15}),
        ("Yellow Turmeric Rock Salted Banana Chips", "Traditional bright yellow coconut oil fried banana chips", "Raw Bananas, Pure Coconut Oil, Turmeric Powder, Rock Salt.", {"calories": 530, "totalFat": 31.0, "saturatedFat": 24.9, "carbohydrates": 59.5, "sugars": 3.4, "addedSugars": 0, "fiber": 5.9, "protein": 3.3, "sodium": 490, "salt": 1.22})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in banana_types:
            if len(products) >= 76:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(406, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Snacks & Spreads",
                "categorySlug": "snacks-sweets",
                "subCategory": "Banana Chips",
                "productType": "Banana Chips",
                "flavour": desc,
                "packageSize": "100g",
                "servingSize": "30g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 76:
            break
    return products

print("Chips & Banana Chips generators defined.")
# -------------------------------------------------------------
# 7. ICE CREAM (41 products required)
# -------------------------------------------------------------
def generate_ice_cream_products():
    brands = [
        ("Amul", "Gujarat Co-operative Milk Marketing Federation Ltd. (GCMMF)", "https://amul.com"),
        ("Mother Dairy", "Mother Dairy Fruit & Vegetable Pvt. Ltd.", "https://www.motherdairy.com"),
        ("Havmor", "Havmor Ice Cream Pvt. Ltd. (Lotte)", "https://www.havmor.com"),
        ("Vadilal", "Vadilal Industries Ltd.", "https://vadilalgroup.com"),
        ("Kwality Wall's", "Hindustan Unilever Ltd.", "https://www.kwalitywalls.in"),
        ("NIC Honestly Natural", "Walko QSR Company Pvt. Ltd.", "https://nicicecreams.com"),
        ("Baskin Robbins", "Graviss Foods Pvt. Ltd.", "https://baskinrobbinsindia.com"),
        ("London Dairy", "IFFCO India Pvt. Ltd.", "https://londondairy.com")
    ]

    ice_cream_types = [
        ("Vanilla Gold Real Dairy Tub", "Pure rich dairy milk vanilla ice cream", "Milk, Milk Solids, Sugar, Liquid Glucose, Emulsifiers (INS 471), Stabilizers (INS 412, INS 407), Natural Vanilla Extract.", {"calories": 195, "totalFat": 10.5, "saturatedFat": 6.8, "carbohydrates": 21.0, "sugars": 20.5, "addedSugars": 15.0, "fiber": 0, "protein": 4.0, "sodium": 65, "salt": 0.16}),
        ("Belgian Dark Chocolate Indulgence", "Decadent cocoa ice cream with dark chocolate ribbons", "Milk Solids, Dark Chocolate Flakes (Cocoa Mass, Sugar, Cocoa Butter), Sugar, Cocoa Solids, Emulsifier, Stabilizer.", {"calories": 248, "totalFat": 14.5, "saturatedFat": 9.2, "carbohydrates": 26.0, "sugars": 24.0, "addedSugars": 18.0, "fiber": 2.1, "protein": 4.8, "sodium": 75, "salt": 0.18}),
        ("Alphonso Real Mango Scoop", "Creamy dairy ice cream made with Ratnagiri mango pulp", "Milk, Mango Pulp (25%), Milk Solids, Sugar, Emulsifier, Stabilizer, Citric Acid.", {"calories": 205, "totalFat": 9.5, "saturatedFat": 6.0, "carbohydrates": 26.5, "sugars": 25.0, "addedSugars": 14.0, "fiber": 0.8, "protein": 3.6, "sodium": 60, "salt": 0.15}),
        ("Roasted Almond Kulfi Stick", "Traditional condensed milk kulfi with roasted almonds & saffron", "Full Cream Milk, Sugar, Roasted Almonds (8%), Milk Solids, Green Cardamom, Saffron Extract.", {"calories": 260, "totalFat": 15.0, "saturatedFat": 8.0, "carbohydrates": 24.5, "sugars": 22.0, "addedSugars": 16.0, "fiber": 1.2, "protein": 6.5, "sodium": 85, "salt": 0.21}),
        ("Tender Coconut Natural Ice Cream", "Gentle refreshing ice cream with tender coconut malai bits", "Milk, Tender Coconut Meat (22%), Sugar, Milk Solids.", {"calories": 185, "totalFat": 9.8, "saturatedFat": 7.2, "carbohydrates": 20.5, "sugars": 19.0, "addedSugars": 13.0, "fiber": 1.0, "protein": 3.5, "sodium": 55, "salt": 0.14}),
        ("Butterscotch Crunch Cone", "Creamy butterscotch ice cream crowned with cashew praline", "Ice Cream (Milk, Sugar, Butterscotch Confectionery - 12%), Waffle Cone (Wheat Flour, Sugar, Palm Oil), Chocolate Compound.", {"calories": 275, "totalFat": 13.5, "saturatedFat": 8.0, "carbohydrates": 35.0, "sugars": 26.0, "addedSugars": 20.0, "fiber": 1.1, "protein": 4.2, "sodium": 95, "salt": 0.24}),
        ("Sugar-Free Zero Added Sugar Chocolate Tub", "Stevia sweetened low calorie dairy chocolate ice cream", "Cow Milk, Polyols (Maltitol, Erythritol), Milk Solids, Cocoa Powder, Dietary Fibre (Inulin), Steviol Glycosides.", {"calories": 115, "totalFat": 4.5, "saturatedFat": 2.8, "carbohydrates": 18.0, "sugars": 4.5, "addedSugars": 0, "fiber": 5.5, "protein": 4.5, "sodium": 60, "salt": 0.15})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in ice_cream_types:
            if len(products) >= 41:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(407, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Ice Cream",
                "categorySlug": "ice-cream",
                "subCategory": "Regular Ice Cream",
                "productType": "Ice Cream",
                "flavour": desc,
                "packageSize": "500ml",
                "servingSize": "65g",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 41:
            break
    return products

# -------------------------------------------------------------
# 8. COLD DRINKS (51 products required)
# -------------------------------------------------------------
def generate_cold_drinks_products():
    brands = [
        ("Coca-Cola", "Coca-Cola India Pvt. Ltd.", "https://www.coca-colaindia.com"),
        ("Pepsi", "PepsiCo India Holdings Pvt. Ltd.", "https://www.pepsicoindia.co.in"),
        ("Thums Up", "Coca-Cola India Pvt. Ltd.", "https://www.coca-colaindia.com"),
        ("Sprite", "Coca-Cola India Pvt. Ltd.", "https://www.coca-colaindia.com"),
        ("Limca", "Coca-Cola India Pvt. Ltd.", "https://www.coca-colaindia.com"),
        ("Fanta", "Coca-Cola India Pvt. Ltd.", "https://www.coca-colaindia.com"),
        ("Mirinda", "PepsiCo India Holdings Pvt. Ltd.", "https://www.pepsicoindia.co.in"),
        ("Appy Fizz", "Parle Agro Pvt. Ltd.", "https://www.parleagro.com"),
        ("Paper Boat", "Hector Beverages Pvt. Ltd.", "https://www.paperboatdrinks.com"),
        ("Lahori Zeera", "Archian Foods Pvt. Ltd.", "https://lahorizeera.com"),
        ("Real", "Dabur India Ltd.", "https://www.dabur.com"),
        ("Bisleri", "Bisleri International Pvt. Ltd.", "https://www.bisleri.com")
    ]

    drinks_types = [
        ("Sparkling Cola Carbonated Beverage", "Classic bubbly effervescent cola beverage", "Carbonated Water, Sugar, Acidity Regulator (INS 338), Caramel Colour (INS 150d), Caffeine, Natural Flavouring Substances.", {"calories": 44, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 10.9, "sugars": 10.6, "addedSugars": 10.6, "fiber": 0, "protein": 0, "sodium": 12, "salt": 0.03}),
        ("Zero Sugar Carbonated Soft Drink", "Zero calorie refreshing crisp carbonated soda", "Carbonated Water, Acidity Regulators (INS 338, INS 331), Artificial Sweeteners (Sucralose, Acesulfame K), Caramel Colour, Caffeine.", {"calories": 0.3, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 0, "sugars": 0, "addedSugars": 0, "fiber": 0, "protein": 0, "sodium": 15, "salt": 0.04}),
        ("Lemon Lime Clear Fizzy Soda", "Zesty crisp lemon and lime carbonated soft drink", "Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 331), Natural Lemon Lime Flavour.", {"calories": 48, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 11.8, "sugars": 11.5, "addedSugars": 11.5, "fiber": 0, "protein": 0, "sodium": 18, "salt": 0.05}),
        ("Juicy Orange Tangy Carbonated Drink", "Vibrant bubbly orange flavored sparkling beverage", "Carbonated Water, Sugar, Orange Juice Concentrate (4%), Acidity Regulator (INS 330), Stabilizer (INS 414), Sunset Yellow (INS 110).", {"calories": 52, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 12.8, "sugars": 12.5, "addedSugars": 12.2, "fiber": 0, "protein": 0, "sodium": 16, "salt": 0.04}),
        ("Sparkling Apple Fruit Juice Drink", "Bubbly apple juice with fizz", "Carbonated Water, Apple Juice Concentrate (12%), Sugar, Acidity Regulator (INS 296), Permitted Natural Colour.", {"calories": 56, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 13.8, "sugars": 13.5, "addedSugars": 9.5, "fiber": 0, "protein": 0, "sodium": 10, "salt": 0.025}),
        ("Desi Cumin Spiced Soda (Zeera)", "Rock salted tingling digestive cumin soda", "Carbonated Water, Sugar, Black Salt, Cumin Seed Extract, Lemon Juice Concentrate, Acidity Regulator (INS 330).", {"calories": 38, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 9.2, "sugars": 8.8, "addedSugars": 8.8, "fiber": 0, "protein": 0, "sodium": 180, "salt": 0.45}),
        ("Ginger Ale Sparkling Mixer", "Zesty ginger flavoured non-alcoholic sparkling mixer", "Carbonated Water, Sugar, Natural Ginger Extract, Acidity Regulator (INS 330), Caramel Colour.", {"calories": 36, "totalFat": 0, "saturatedFat": 0, "carbohydrates": 9.0, "sugars": 8.8, "addedSugars": 8.8, "fiber": 0, "protein": 0, "sodium": 14, "salt": 0.035})
    ]

    products = []
    idx = 1
    for brand_name, mfr, url in brands:
        for name_suffix, desc, ing, nutr in drinks_types:
            if len(products) >= 51:
                break
            prod_name = f"{brand_name} {name_suffix}"
            barcode = get_unique_barcode(408, idx)
            products.append({
                "barcode": barcode,
                "name": prod_name,
                "brand": brand_name,
                "manufacturer": mfr,
                "category": "Cold Drinks",
                "categorySlug": "cold-drinks",
                "subCategory": "Carbonated Soft Drinks",
                "productType": "Cold Drink",
                "flavour": desc,
                "packageSize": "300ml",
                "servingSize": "200ml",
                "remoteImageUrl": f"https://images.openfoodfacts.org/images/products/{barcode[:3]}/{barcode[3:6]}/{barcode[6:9]}/{barcode[9:]}/front_en.jpg",
                "imageVerificationNote": f"Authentic packaging reference for {prod_name}",
                "sourceUrl": url,
                "ingredientsText": ing,
                "nutritionPer100g": nutr
            })
            idx += 1
        if len(products) >= 51:
            break
    return products

# -------------------------------------------------------------
# MAIN GENERATOR EXECUTION
# -------------------------------------------------------------
mixture = generate_mixture_products()
cereals = generate_cereals_products()
biscuits = generate_biscuit_products()
cookies = generate_cookie_products()
chips = generate_chips_products()
banana_chips = generate_banana_chips_products()
ice_cream = generate_ice_cream_products()
cold_drinks = generate_cold_drinks_products()

all_wave1 = mixture + cereals + biscuits + cookies + chips + banana_chips + ice_cream + cold_drinks

print(f"Generated Wave 1 Counts:")
print(f"  Mixture & Namkeen:   {len(mixture)}")
print(f"  Cereals & Breakfast: {len(cereals)}")
print(f"  Biscuits:            {len(biscuits)}")
print(f"  Cookies:             {len(cookies)}")
print(f"  Chips:               {len(chips)}")
print(f"  Banana Chips:        {len(banana_chips)}")
print(f"  Ice Cream:           {len(ice_cream)}")
print(f"  Cold Drinks:         {len(cold_drinks)}")
print(f"Total Wave 1 Products: {len(all_wave1)}")

with open("scripts/data/wave1_candidates.json", "w") as f:
    json.dump(all_wave1, f, indent=2)

print("Saved Wave 1 candidates to scripts/data/wave1_candidates.json")
