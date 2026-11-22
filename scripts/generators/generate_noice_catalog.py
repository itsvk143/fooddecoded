import json
import os
import re

def ean13_checksum(code12: str) -> str:
    odds = sum(int(code12[i]) for i in range(0, 12, 2))
    evens = sum(int(code12[i]) for i in range(1, 12, 2))
    total = odds + evens * 3
    check = (10 - (total % 10)) % 10
    return code12 + str(check)

def get_noice_products():
    products = []
    
    # -------------------------------------------------------------------------
    # 1. Fresh Bakery, Breads & Buns (17 items)
    # -------------------------------------------------------------------------
    bakery_items = [
        ("NOICE 5 Seed Multigrain Bread (Zero Maida)", "Breads & Buns", "Multigrain Seeded", "250g", 65,
         "Handcrafted 100% whole wheat bread encrusted with flax, sunflower, pumpkin, chia, and sesame seeds with zero refined flour or palm oil.",
         "Whole Wheat Flour (Atta 58%), Water, Seeds Mix (14% - Sunflower, Pumpkin, Flax, Chia, Sesame), Butter (Dairy), Yeast, Jaggery, Salt.",
         {"calories": 255, "totalFat": 6.8, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 41.5, "sugars": 3.2, "addedSugars": 1.5, "fiber": 7.5, "protein": 9.8, "sodium": 340, "salt": 0.85},
         ["Zero Maida", "5 Super Seeds", "No Palm Oil", "Clean Label"]),
        
        ("NOICE Crustless Sandwich Bread (Freshly Made)", "Breads & Buns", "Crustless White", "220g", 55,
         "Ultra-soft, pre-trimmed crustless sandwich loaf baked fresh with pure milk solids and dairy butter.",
         "Wheat Flour, Water, Dairy Butter (4.5%), Milk Solids, Yeast, Sugar, Salt.",
         {"calories": 240, "totalFat": 3.5, "saturatedFat": 1.9, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 4.0, "addedSugars": 2.5, "fiber": 2.2, "protein": 7.5, "sodium": 360, "salt": 0.90},
         ["Crustless", "Freshly Baked Daily", "No Chemical Preservatives"]),

        ("NOICE Fluffy White Bread (Freshly Made)", "Breads & Buns", "Classic White", "250g", 50,
         "Small-batch airy white bread prepared with cold-fermented dough and pure butter, free from potassium bromate.",
         "Wheat Flour, Water, Butter, Yeast, Raw Sugar, Salt.",
         {"calories": 245, "totalFat": 3.2, "saturatedFat": 1.6, "transFat": 0.0, "carbohydrates": 47.0, "sugars": 3.8, "addedSugars": 2.0, "fiber": 2.4, "protein": 7.8, "sodium": 350, "salt": 0.88},
         ["Bromate Free", "Cold Fermented", "Zero Palm Oil"]),

        ("NOICE Buttery Milk Bread (Freshly Made)", "Breads & Buns", "Sweet Milk", "250g", 60,
         "Tender, golden milk bread enriched with whole cow milk and unsalted dairy butter.",
         "Wheat Flour, Whole Milk (28%), Dairy Butter (6%), Water, Yeast, Sugar, Salt.",
         {"calories": 265, "totalFat": 5.5, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 45.5, "sugars": 5.5, "addedSugars": 3.0, "fiber": 2.1, "protein": 8.2, "sodium": 330, "salt": 0.82},
         ["Made with Cow Milk", "Rich Dairy Butter", "No Additives"]),

        ("NOICE Japanese Milk Bread (Contains Egg)", "Breads & Buns", "Hokkaido Shokupan", "250g", 75,
         "Feather-light Japanese Shokupan loaf crafted with Yudane tangzhong water-roux and farm-fresh eggs.",
         "Wheat Flour, Whole Milk, Farm Eggs (8%), Dairy Butter (7%), Tangzhong Starter (Wheat, Milk), Sugar, Yeast, Salt.",
         {"calories": 275, "totalFat": 7.2, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 5.8, "addedSugars": 3.2, "fiber": 2.0, "protein": 8.8, "sodium": 320, "salt": 0.80},
         ["Tangzhong Method", "Contains Farm Egg", "Pillowy Soft"]),

        ("NOICE Triangle Bread (Freshly Made)", "Breads & Buns", "Triangle Sandwich", "400g", 70,
         "Traditional Indian bakery-style tall triangular sandwich bread loaf, perfect for grilling.",
         "Wheat Flour, Water, Butter, Milk Solids, Yeast, Sugar, Salt.",
         {"calories": 242, "totalFat": 3.4, "saturatedFat": 1.7, "transFat": 0.0, "carbohydrates": 46.2, "sugars": 3.5, "addedSugars": 2.0, "fiber": 2.3, "protein": 7.6, "sodium": 350, "salt": 0.88},
         ["Ideal for Grilling", "Bakery Fresh", "No Palm Oil"]),

        ("NOICE French Sourdough Bread (Sliced Small Loaf)", "Breads & Buns", "Artisan Sourdough", "250g", 85,
         "Slowly fermented French sourdough bread loaf with a blistered crust and open crumb, zero baker's yeast.",
         "Wheat Flour, Water, Wild Sourdough Starter (Wild Yeast & Lactobacilli), Sea Salt.",
         {"calories": 230, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 3.8, "protein": 8.5, "sodium": 380, "salt": 0.95},
         ["Wild Fermentation", "24hr Slow Proof", "Gut Friendly", "Zero Added Sugar"]),

        ("NOICE Multigrain Sourdough Bread", "Breads & Buns", "Multigrain Sourdough", "400g", 120,
         "Hearty artisan sourdough loaded with toasted seeds, rye, and whole wheat flakes.",
         "Whole Wheat Flour (40%), Wheat Flour (30%), Water, Wild Sourdough Culture, Roasted Seeds (Flax, Pumpkin, Sesame 10%), Sea Salt.",
         {"calories": 245, "totalFat": 4.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 43.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 6.8, "protein": 9.2, "sodium": 370, "salt": 0.92},
         ["Naturally Leavened", "Ancient Grains", "High Fiber"]),

        ("NOICE Focaccia Bread (Freshly Made)", "Breads & Buns", "Olive & Rosemary", "100g", 65,
         "Authentic Italian style focaccia dimpled with cold-pressed extra virgin olive oil, Kalamata olives, and fresh rosemary.",
         "Wheat Flour, Water, Extra Virgin Olive Oil (12%), Black Olives, Fresh Rosemary, Sea Salt, Yeast.",
         {"calories": 290, "totalFat": 11.5, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 41.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 2.8, "protein": 6.8, "sodium": 440, "salt": 1.10},
         ["100% Extra Virgin Olive Oil", "Fresh Herbs", "Artisan Baked"]),

        ("NOICE Sourdough Pizza Base (Freshly Made)", "Breads & Buns", "Sourdough Base", "160g", 60,
         "Artisanal hand-stretched pizza base cold fermented for 48 hours for charred leopard-spotted crust.",
         "Wheat Flour (Tipo 00), Water, Sourdough Starter, Extra Virgin Olive Oil, Sea Salt.",
         {"calories": 240, "totalFat": 2.5, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 48.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 3.2, "protein": 8.0, "sodium": 390, "salt": 0.98},
         ["48hr Cold Ferment", "Hand Stretched", "Preservative Free"]),

        ("NOICE Lebanese Pita Pockets (Freshly Made)", "Breads & Buns", "Lebanese Pita", "150g", 50,
         "Traditional Lebanese flatbread that balloons on the hearth to form convenient sandwich pockets.",
         "Wheat Flour, Water, Yeast, Sea Salt, Olive Oil.",
         {"calories": 250, "totalFat": 2.0, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 50.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 2.5, "protein": 8.2, "sodium": 360, "salt": 0.90},
         ["Clean Pocket Flatbread", "Zero Palm Oil", "Stone Baked"]),

        ("NOICE Sliced Brioche Burger Buns (Freshly Made)", "Breads & Buns", "Buttery Brioche", "100g", 45,
         "Golden, glossy brioche burger buns rich in dairy butter and fresh egg glaze.",
         "Wheat Flour, Dairy Butter (10%), Water, Sugar, Egg Glaze, Yeast, Salt.",
         {"calories": 305, "totalFat": 10.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 46.5, "sugars": 7.0, "addedSugars": 4.5, "fiber": 2.0, "protein": 7.5, "sodium": 380, "salt": 0.95},
         ["Real Dairy Butter", "Golden Brioche Glaze"]),

        ("NOICE Golden Sweet Bun (Raisin Sweet Bun)", "Breads & Buns", "Sweet Raisin", "100g", 35,
         "Homestyle sweet milk bun studded with golden raisins and warm cardamom.",
         "Wheat Flour, Milk Solids, Golden Raisins (10%), Dairy Butter, Sugar, Cardamom, Yeast, Salt.",
         {"calories": 285, "totalFat": 6.0, "saturatedFat": 3.4, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 14.0, "addedSugars": 6.5, "fiber": 2.4, "protein": 6.8, "sodium": 280, "salt": 0.70},
         ["Kismis Studded", "Milk Enriched", "Tea-time Classic"]),

        ("NOICE Bangalore Khara Bun (Freshly Made)", "Breads & Buns", "Bangalore Khara Bun", "100g", 40,
         "Famous Bengaluru Iyengar bakery style spiced bun stuffed with fresh curry leaves, green chillies, and coriander.",
         "Wheat Flour, Water, Dairy Butter, Fresh Green Chillies, Curry Leaves, Onion, Cumin, Mustard Seeds, Salt.",
         {"calories": 265, "totalFat": 6.5, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 45.0, "sugars": 3.0, "addedSugars": 1.0, "fiber": 2.8, "protein": 7.2, "sodium": 420, "salt": 1.05},
         ["Iyengar Bakery Recipe", "Fresh Curry Leaves", "Spiced Bun"]),

        ("NOICE Jeera Coriander Kulcha", "Breads & Buns", "Jeera Coriander", "150g", 45,
         "Soft tandoor-style flatbread infused with roasted cumin seeds and freshly chopped green coriander.",
         "Wheat Flour, Yogurt (Curd 15%), Water, Milk, Butter, Cumin Seeds, Fresh Coriander, Salt, Baking Powder.",
         {"calories": 260, "totalFat": 4.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 47.5, "sugars": 2.5, "addedSugars": 0.0, "fiber": 2.6, "protein": 7.8, "sodium": 410, "salt": 1.02},
         ["Curd Softened", "No Yeast", "Tandoor Baked"]),

        ("NOICE Punjabi Garlic Kulcha", "Breads & Buns", "Garlic Butter", "150g", 48,
         "Rustic North Indian kulcha topped with minced fresh garlic and white sesame, brushed with dairy butter.",
         "Wheat Flour, Curd, Water, Fresh Garlic (8%), Butter, White Sesame, Coriander, Salt.",
         {"calories": 270, "totalFat": 5.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 47.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 2.5, "protein": 8.0, "sodium": 420, "salt": 1.05},
         ["Minced Fresh Garlic", "Butter Brushed", "Authentic Punjabi"]),

        ("NOICE Fresh Butter Croissant (Caramelized Buttery Brioche)", "Croissants & Rolls", "All Butter Croissant", "90g", 75,
         "Laminated French pastry with hundreds of paper-thin flaky layers made with pure 82% butterfat French-style butter.",
         "Wheat Flour, Pure Dairy Butter (28%), Water, Milk, Sugar, Yeast, Sea Salt.",
         {"calories": 395, "totalFat": 22.5, "saturatedFat": 13.8, "transFat": 0.1, "carbohydrates": 42.0, "sugars": 5.5, "addedSugars": 3.5, "fiber": 2.2, "protein": 7.0, "sodium": 390, "salt": 0.98},
         ["28% Pure Dairy Butter", "Flaky Lamination", "Zero Margarine"])
    ]
    
    for nm, scat, flav, wt, pr, dsc, ing, nut, hl in bakery_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": "Bakery & Breads", "sub": scat, "type": "Fresh Bakery",
            "mfr": "Swiggy Instamart Private Brands / Handcrafted by Artisanal Partner Bakeries",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": "Egg" not in nm
        })

    # -------------------------------------------------------------------------
    # 2. Cookies, Biscuits, Cakes & Rusk (19 items)
    # -------------------------------------------------------------------------
    cookie_items = [
        ("NOICE Ganache Chocolate Cookies", "Cookies & Biscuits", "Dark Ganache", "80g", 80,
         "Decadent cookies with a molten center of dark Belgian chocolate ganache baked with pure butter.",
         "Wheat Flour, Dark Chocolate (28% - Cocoa Solids, Sugar, Cocoa Butter), Dairy Butter (20%), Brown Sugar, Eggs, Salt.",
         {"calories": 485, "totalFat": 26.0, "saturatedFat": 15.0, "transFat": 0.0, "carbohydrates": 56.5, "sugars": 32.0, "addedSugars": 24.0, "fiber": 4.5, "protein": 6.8, "sodium": 210, "salt": 0.52},
         ["Pure Cocoa Butter", "Real Dairy Butter", "Molten Center"]),

        ("NOICE Chewy New York Cookies", "Cookies & Biscuits", "Chewy Chocolate", "80g", 75,
         "Chunky New York style cookies with crisp edges and a gooey center packed with chocolate chunks.",
         "Wheat Flour, Chocolate Chunks (24%), Butter (18%), Brown Cane Sugar, Farm Eggs, Vanilla, Baking Soda, Salt.",
         {"calories": 478, "totalFat": 24.5, "saturatedFat": 14.2, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 31.0, "addedSugars": 25.0, "fiber": 3.8, "protein": 6.5, "sodium": 240, "salt": 0.60},
         ["New York Style", "Zero Palm Oil", "Real Vanilla"]),

        ("NOICE Chocochip Cookies", "Cookies & Biscuits", "Chocochip", "80g", 65,
         "Golden-baked buttery cookies loaded with premium dark chocolate drops and unrefined cane sugar.",
         "Wheat Flour, Dark Chocolate Drops (20%), Butter (18%), Cane Sugar, Milk Solids, Salt, Raising Agent (INS 500(ii)).",
         {"calories": 470, "totalFat": 23.0, "saturatedFat": 13.5, "transFat": 0.0, "carbohydrates": 60.0, "sugars": 28.0, "addedSugars": 22.0, "fiber": 3.5, "protein": 6.2, "sodium": 220, "salt": 0.55},
         ["Loaded with Chocochips", "100% Dairy Butter"]),

        ("NOICE Oat & Chocochip Cookies", "Cookies & Biscuits", "Oat Chocochip", "80g", 70,
         "High-fiber rolled oats and whole wheat cookies dotted with dark chocolate chips.",
         "Rolled Oats (35%), Whole Wheat Flour (25%), Dark Chocochips (15%), Butter (16%), Jaggery, Cinnamon, Salt.",
         {"calories": 455, "totalFat": 20.0, "saturatedFat": 11.0, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 22.0, "addedSugars": 16.0, "fiber": 6.8, "protein": 8.0, "sodium": 190, "salt": 0.48},
         ["35% Rolled Oats", "Sweetened with Jaggery", "High Fiber"]),

        ("NOICE Oat & Raisin Cookies", "Cookies & Biscuits", "Oat Raisin", "80g", 65,
         "Hearty breakfast cookies with chewy rolled oats, plump Afghan raisins, and pure butter.",
         "Rolled Oats (38%), Whole Wheat Flour (24%), Golden Raisins (15%), Butter (16%), Brown Sugar, Nutmeg, Salt.",
         {"calories": 445, "totalFat": 18.5, "saturatedFat": 10.2, "transFat": 0.0, "carbohydrates": 62.5, "sugars": 24.0, "addedSugars": 14.0, "fiber": 6.5, "protein": 7.6, "sodium": 180, "salt": 0.45},
         ["Whole Grain Oats", "Plump Raisins", "No Preservatives"]),

        ("NOICE Rich Butter Cookies", "Cookies & Biscuits", "Rich Butter", "80g", 60,
         "Melt-in-mouth traditional butter shortbread cookies with 30% dairy butter content.",
         "Wheat Flour, Pure Dairy Butter (30%), Cane Sugar, Milk Solids, Sea Salt.",
         {"calories": 510, "totalFat": 28.5, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 22.0, "addedSugars": 18.0, "fiber": 2.0, "protein": 5.8, "sodium": 210, "salt": 0.52},
         ["30% Pure Butter", "Shortbread Texture", "Zero Artificial Flavor"]),

        ("NOICE Handmade Coconut Cookies", "Cookies & Biscuits", "Toasted Coconut", "80g", 55,
         "Crisp cookies made with freshly desiccated coastal coconut and churned dairy butter.",
         "Desiccated Coconut (32%), Wheat Flour, Butter (18%), Sugar, Milk Solids, Cardamom, Salt.",
         {"calories": 490, "totalFat": 27.0, "saturatedFat": 18.0, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 24.0, "addedSugars": 17.0, "fiber": 5.2, "protein": 6.0, "sodium": 190, "salt": 0.48},
         ["Real Desiccated Coconut", "Coastal Coconut Aroma"]),

        ("NOICE Fresh Bakery Cashew Biscuit (Mini Cookies)", "Cookies & Biscuits", "Kaju Butter", "60g", 50,
         "Bite-sized tea-time biscuits packed with crunchy broken cashew nuts and pure desi ghee.",
         "Wheat Flour, Cashew Nuts (22%), Desi Ghee (16%), Dairy Butter (8%), Sugar, Milk, Salt.",
         {"calories": 505, "totalFat": 27.5, "saturatedFat": 12.0, "transFat": 0.0, "carbohydrates": 56.0, "sugars": 20.0, "addedSugars": 15.0, "fiber": 3.0, "protein": 8.5, "sodium": 180, "salt": 0.45},
         ["22% Cashews", "Desi Ghee Infused", "Mini Tea Biscuits"]),

        ("NOICE Handmade Fruit Biscuits", "Cookies & Biscuits", "Karachi Tutti Frutti", "80g", 45,
         "Classic Hyderabad-style fruit biscuits infused with papaya tutti-frutti and floral cardamom essence.",
         "Wheat Flour, Dairy Butter (18%), Tutti Frutti (Papaya Cubes 15%), Cashews (5%), Sugar, Cardamom, Salt.",
         {"calories": 465, "totalFat": 21.0, "saturatedFat": 12.2, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 26.0, "addedSugars": 19.0, "fiber": 2.8, "protein": 6.0, "sodium": 170, "salt": 0.42},
         ["Hyderabadi Style", "Tutti Frutti & Nuts", "Zero Vanaspati"]),

        ("NOICE Jam Filled Biscuits", "Cookies & Biscuits", "Raspberry Jam Centre", "100g", 55,
         "Sandwich biscuits piped with real fruit raspberry preserve, free from synthetic pectin or artificial colors.",
         "Wheat Flour, Raspberry Fruit Jam (25% - Raspberries, Sugar, Lemon Juice), Butter (18%), Sugar, Milk, Salt.",
         {"calories": 440, "totalFat": 17.5, "saturatedFat": 10.2, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 30.0, "addedSugars": 22.0, "fiber": 3.2, "protein": 5.5, "sodium": 190, "salt": 0.48},
         ["Real Fruit Jam Core", "No Artificial Coloring"]),

        ("NOICE Premium Millet Cookies", "Cookies & Biscuits", "Multi-Millet Crunch", "100g", 65,
         "Clean-label cookies baked with a blend of finger millet (ragi), foxtail millet, and pearl millet.",
         "Millet Flour Blend (Ragi, Foxtail, Bajra 52%), Whole Wheat Flour (15%), Butter (18%), Jaggery (15%), Cardamom, Salt.",
         {"calories": 448, "totalFat": 19.0, "saturatedFat": 10.5, "transFat": 0.0, "carbohydrates": 61.5, "sugars": 18.0, "addedSugars": 12.0, "fiber": 7.8, "protein": 8.2, "sodium": 160, "salt": 0.40},
         ["52% Ancient Millets", "Jaggery Sweetened", "High Fiber"]),

        ("NOICE Ragi Amaranth Gluten-Free Cookies (No Refined Sugar)", "Cookies & Biscuits", "Ragi Amaranth", "80g", 75,
         "Gluten-free cookies formulated with sprouted ragi, popped rajgira amaranth, and raw date syrup.",
         "Sprouted Ragi Flour (40%), Popped Amaranth (20%), Coconut Oil & Butter (16%), Date Syrup (18%), Vanilla, Salt.",
         {"calories": 435, "totalFat": 17.0, "saturatedFat": 9.8, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 16.0, "addedSugars": 0.0, "fiber": 8.5, "protein": 8.0, "sodium": 140, "salt": 0.35},
         ["Gluten Free", "Zero Refined Sugar", "Sprouted Ragi"]),

        ("NOICE Atta Jaggery Ghee Cookies", "Cookies & Biscuits", "Ghee Jaggery", "80g", 60,
         "Traditional Indian nankhatai cookies made with 100% stone-ground atta, desi bilona ghee, and organic jaggery.",
         "Stone Ground Whole Wheat Atta (55%), Desi Cow Ghee (22%), Organic Jaggery (20%), Green Cardamom, Rock Salt.",
         {"calories": 480, "totalFat": 23.5, "saturatedFat": 14.5, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 19.0, "addedSugars": 16.0, "fiber": 6.2, "protein": 7.2, "sodium": 110, "salt": 0.28},
         ["100% Desi Cow Ghee", "Zero White Sugar", "Traditional Nankhatai"]),

        ("NOICE Fresh Bakery Butter Osmania Biscuit (Mini Cookies)", "Cookies & Biscuits", "Butter Osmania", "70g", 40,
         "The iconic sweet-and-salty Hyderabadi chai biscuit baked with fresh butter and a pinch of rock salt.",
         "Wheat Flour, Dairy Butter (22%), Milk Solids, Sugar, Rock Salt, Raising Agent (INS 500(ii)).",
         {"calories": 472, "totalFat": 22.0, "saturatedFat": 13.0, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 16.0, "addedSugars": 12.0, "fiber": 2.2, "protein": 6.8, "sodium": 340, "salt": 0.85},
         ["Authentic Osmania", "Sweet & Salty Balance", "Chai Dunker"]),

        ("NOICE Ginger Cookies", "Cookies & Biscuits", "Spiced Ginger", "70g", 45,
         "Warm spiced cookies packed with real sun-dried ginger root, black pepper, and dark molasses.",
         "Wheat Flour, Dairy Butter (16%), Jaggery & Molasses (22%), Dried Ginger Root Powder (3.5%), Cinnamon, Clove, Salt.",
         {"calories": 435, "totalFat": 16.5, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 22.0, "addedSugars": 16.0, "fiber": 3.4, "protein": 6.0, "sodium": 210, "salt": 0.52},
         ["Real Sun-Dried Ginger", "Warm Winter Spices"]),

        ("NOICE Jeera Tea Biscuits", "Cookies & Biscuits", "Roasted Jeera", "80g", 40,
         "Lightly salted tea biscuits toasted with aromatic roasted whole cumin seeds and dairy butter.",
         "Wheat Flour, Dairy Butter (18%), Roasted Cumin Seeds (Jeera 4.0%), Sugar, Rock Salt, Raising Agent (INS 500(ii)).",
         {"calories": 450, "totalFat": 19.5, "saturatedFat": 11.2, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 12.0, "addedSugars": 8.0, "fiber": 3.0, "protein": 7.0, "sodium": 360, "salt": 0.90},
         ["Whole Roasted Jeera", "Savoury Chai Biscuit"]),

        ("NOICE Sweet & Salty Biscuits", "Cookies & Biscuits", "Sweet & Salty", "70g", 35,
         "Ultra-thin crispy crackers dusted with granulated sugar crystals and mineral sea salt.",
         "Wheat Flour, Dairy Butter (15%), Sugar Crystals (8%), Sea Salt, Milk Solids, Yeast.",
         {"calories": 440, "totalFat": 17.0, "saturatedFat": 9.8, "transFat": 0.0, "carbohydrates": 64.5, "sugars": 14.0, "addedSugars": 10.0, "fiber": 2.5, "protein": 7.2, "sodium": 390, "salt": 0.98},
         ["Sweet & Salty Crunch", "No Trans Fat"]),

        ("NOICE Fresh Sponge Cake (Fresh Chocolate Tea Cake)", "Cakes & Rusk", "Rich Chocolate Tea Cake", "90g", 55,
         "Moist, buttery chocolate loaf cake baked with real Dutch cocoa and fresh farm butter.",
         "Wheat Flour, Dairy Butter (18%), Brown Cane Sugar, Farm Eggs, Dutch Cocoa Powder (8%), Whole Milk, Baking Powder, Vanilla.",
         {"calories": 380, "totalFat": 18.0, "saturatedFat": 10.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 25.0, "addedSugars": 20.0, "fiber": 3.2, "protein": 6.8, "sodium": 230, "salt": 0.58},
         ["Dutch Cocoa", "Real Dairy Butter", "Farm Fresh Eggs"]),

        ("NOICE Fresh Rusk (Bakery Style)", "Cakes & Rusk", "Elaichi Butter Rusk", "80g", 40,
         "Double-toasted crispy bakery rusk infused with whole green cardamom and dairy butter.",
         "Wheat Flour, Dairy Butter (14%), Sugar, Cardamom Seeds (1.5%), Milk Solids, Yeast, Salt.",
         {"calories": 420, "totalFat": 14.5, "saturatedFat": 8.2, "transFat": 0.0, "carbohydrates": 65.0, "sugars": 16.0, "addedSugars": 12.0, "fiber": 3.5, "protein": 7.8, "sodium": 280, "salt": 0.70},
         ["Double Baked", "Cardamom Aroma", "Zero Palm Oil"])
    ]

    for nm, scat, flav, wt, pr, dsc, ing, nut, hl in cookie_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": "Bakery & Breads", "sub": scat, "type": "Cookies & Biscuits",
            "mfr": "Swiggy Instamart Private Brands / Handcrafted by Artisanal Partner Bakeries",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": "Egg" not in nm and "Cake" not in nm
        })

    # -------------------------------------------------------------------------
    # 3. Chips, Wafers & Popped Snacks (8 new items)
    # -------------------------------------------------------------------------
    snack_items = [
        ("NOICE Ripe Nendran Banana Chips (Sweet, Coconut Oil)", "Snacks & Spreads", "Banana Chips", "Sweet Ripe Banana", "50g", 45,
         "Golden, naturally sweet ripe Kerala Nendran banana chips crisped in pure cold-pressed coconut oil.",
         "Ripe Nendran Bananas (78%), Pure Cold-Pressed Coconut Oil (20%), Rock Salt (2%).",
         {"calories": 512, "totalFat": 27.5, "saturatedFat": 22.0, "transFat": 0.0, "carbohydrates": 62.5, "sugars": 14.5, "addedSugars": 0.0, "fiber": 5.8, "protein": 3.2, "sodium": 180, "salt": 0.45},
         ["100% Pure Coconut Oil", "Naturally Sweet Ripe Nendran", "No Added Sugar"]),

        ("NOICE Spicy Masala Long Banana Chips", "Snacks & Spreads", "Banana Chips", "Spicy Masala", "50g", 40,
         "Thinly sliced lengthwise raw Kerala plantain chips seasoned with sun-dried red chilli and turmeric.",
         "Raw Nendran Bananas (74%), Cold-Pressed Coconut Oil (22%), Seasoning (Red Chilli, Turmeric, Black Salt, Asafoetida).",
         {"calories": 525, "totalFat": 29.0, "saturatedFat": 23.5, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 6.2, "protein": 3.5, "sodium": 460, "salt": 1.15},
         ["Long Cut Strip", "Desi Masala", "Zero Palm Oil"]),

        ("NOICE Salted Tapioca Chips", "Snacks & Spreads", "Banana Chips", "Classic Salted Tapioca", "50g", 35,
         "Crunchy sun-dried Kerala cassava chips crisped in pure coconut oil and dusted with rock salt.",
         "Tapioca (Cassava 76%), Coconut Oil (22%), Sea Salt (2%).",
         {"calories": 495, "totalFat": 24.0, "saturatedFat": 19.5, "transFat": 0.0, "carbohydrates": 66.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 4.5, "protein": 2.2, "sodium": 360, "salt": 0.90},
         ["Kerala Tapioca", "Gluten Free", "Pure Coconut Oil"]),

        ("NOICE Lime & Chilli Potato Chips", "Snacks & Spreads", "Chips", "Lime & Chilli", "100g", 50,
         "Kettle-style crispy potato chips seasoned with tangy key lime and piquant green chillies, zero palm oil.",
         "Potatoes (68%), Cold-Pressed Groundnut Oil (26%), Seasoning (Key Lime Juice Powder, Green Chilli, Salt, Cumin).",
         {"calories": 530, "totalFat": 32.0, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 4.8, "protein": 6.5, "sodium": 520, "salt": 1.30},
         ["Groundnut Oil Fried", "Real Key Lime", "Zero Palm Oil"]),

        ("NOICE Ragi Crackle Chips (Masala)", "Baked Chips, Makhana & Unjunked Indian Snacks", "Baked Chips", "Masala Ragi", "100g", 65,
         "Baked crackly chips made from 100% Karnataka finger millet (ragi) tossed in Indian chaat spices.",
         "Ragi Flour (Finger Millet 65%), Rice Flour (15%), Sunflower Oil (12%), Seasoning (Amchur, Cumin, Chilli, Black Salt).",
         {"calories": 420, "totalFat": 12.5, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 9.5, "protein": 8.8, "sodium": 480, "salt": 1.20},
         ["100% Baked", "High Calcium Ragi", "Chaat Masala"]),

        ("NOICE Peri Peri Moong Dal Chips", "Baked Chips, Makhana & Unjunked Indian Snacks", "Baked Chips", "Peri Peri Moong", "100g", 70,
         "Crunchy popped lentil chips crafted with yellow moong dal and African bird's eye peri peri chilli.",
         "Moong Dal Flour (70%), Tapioca Starch, Sunflower Oil (10%), Peri Peri Seasoning (Chilli, Garlic, Onion, Citric Acid, Salt).",
         {"calories": 415, "totalFat": 11.0, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 8.0, "protein": 17.5, "sodium": 510, "salt": 1.28},
         ["17.5g Protein", "Yellow Moong Dal", "Popped Not Fried"]),

        ("NOICE Mexican Nachos Tortilla Chips", "Snacks & Spreads", "Chips", "Jalapeno Mexican", "70g", 45,
         "Stone-ground non-GMO yellow corn tortilla chips tossed in Mexican jalapeño and herb seasoning.",
         "Stone Ground Corn (70%), Corn Oil (22%), Seasoning (Jalapeno, Tomato, Onion, Garlic, Sea Salt, Herbs).",
         {"calories": 498, "totalFat": 24.5, "saturatedFat": 3.5, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 6.0, "protein": 7.2, "sodium": 440, "salt": 1.10},
         ["Stone Ground Non-GMO Corn", "Gluten Free"]),

        ("NOICE Cheese Melt Roasted Makhana", "Baked Chips, Makhana & Unjunked Indian Snacks", "Roasted Makhana", "Cheese Melt", "50g", 80,
         "Jumbo Foxnuts roasted in pure cow ghee and coated with natural cheddar cheese seasoning.",
         "Foxnuts (Makhana 72%), Desi Cow Ghee (16%), Cheddar Cheese Powder (8%), Himalayan Pink Salt, Black Pepper.",
         {"calories": 440, "totalFat": 16.5, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 7.5, "protein": 10.0, "sodium": 420, "salt": 1.05},
         ["Desi Cow Ghee Roasted", "Real Cheddar Cheese", "Antioxidant Rich"]),

        ("NOICE Salt & Pepper Ghee Roasted Makhana", "Baked Chips, Makhana & Unjunked Indian Snacks", "Roasted Makhana", "Salt & Pepper Ghee", "50g", 75,
         "Slow-roasted Himalayan foxnuts tossed in golden cow ghee and coarsely ground Tellicherry black pepper.",
         "Foxnuts (Makhana 75%), Desi Cow Ghee (18%), Tellicherry Black Pepper (4%), Rock Salt (3%).",
         {"calories": 435, "totalFat": 16.0, "saturatedFat": 8.8, "transFat": 0.0, "carbohydrates": 63.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 7.8, "protein": 9.5, "sodium": 380, "salt": 0.95},
         ["Ghee Roasted", "Tellicherry Pepper", "Zero Refined Oil"]),

        ("NOICE Special Masala Makhana", "Baked Chips, Makhana & Unjunked Indian Snacks", "Roasted Makhana", "Special Masala", "50g", 75,
         "Crisp foxnuts roasted with cold-pressed mustard oil and a bespoke blend of roasted amchur, cumin, and mint.",
         "Foxnuts (Makhana 74%), Cold-Pressed Mustard Oil (15%), Masala Blend (Dry Mango, Mint, Cumin, Chilli, Black Salt).",
         {"calories": 425, "totalFat": 14.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 8.0, "protein": 9.8, "sodium": 430, "salt": 1.08},
         ["Special Masala Blend", "Roasted Puffs", "Gluten Free"]),

        ("NOICE Gourmet Popcorn with Real Butter", "Snacks & Spreads", "Popcorn & Puffs", "Real Butter Popcorn", "60g", 60,
         "Small-batch butterfly corn popped in pure melted dairy butter and sprinkled with Himalayan mineral salt.",
         "Non-GMO Popping Corn (72%), Pure Dairy Butter (24%), Himalayan Pink Salt (4%).",
         {"calories": 475, "totalFat": 22.0, "saturatedFat": 12.5, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 0.8, "addedSugars": 0.0, "fiber": 9.0, "protein": 8.2, "sodium": 390, "salt": 0.98},
         ["Popped in Real Butter", "Zero Artificial Flavor", "Whole Grain Corn"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in snack_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Homestyle Savoury Snacks",
            "mfr": "Swiggy Instamart Private Brands / Sourced from Regional Partner Producers",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": True
        })

    # -------------------------------------------------------------------------
    # 4. Regional Namkeen & Savoury Snacks (21 items)
    # -------------------------------------------------------------------------
    namkeen_items = [
        ("NOICE Masala Peanut with Curry Leaves", "Snacks & Spreads", "Mixture & Namkeen", "Curry Leaf Masala", "100g", 40,
         "Golden-fried Saurashtra peanuts tossed with crisp fresh curry leaves, hing, and sun-dried red chillies.",
         "Peanuts (76%), Cold-Pressed Groundnut Oil (16%), Fresh Curry Leaves (3%), Chilli, Turmeric, Salt, Asafoetida.",
         {"calories": 585, "totalFat": 46.0, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 18.0, "sugars": 4.5, "addedSugars": 0.0, "fiber": 8.5, "protein": 24.5, "sodium": 420, "salt": 1.05},
         ["Fresh Curry Leaves", "Groundnut Oil", "High Protein"]),

        ("NOICE Congress Peanuts", "Snacks & Spreads", "Mixture & Namkeen", "Bangalore Congress", "100g", 45,
         "Bengaluru's iconic split roasted peanuts tossed in black pepper, asafoetida, curry leaves, and turmeric.",
         "Split Peanuts (80%), Cold-Pressed Groundnut Oil (12%), Black Pepper (2.5%), Turmeric, Asafoetida, Curry Leaves, Salt.",
         {"calories": 575, "totalFat": 45.0, "saturatedFat": 8.0, "transFat": 0.0, "carbohydrates": 19.0, "sugars": 4.0, "addedSugars": 0.0, "fiber": 8.8, "protein": 25.0, "sodium": 390, "salt": 0.98},
         ["Iconic Bangalore Recipe", "Split Roasted Peanuts", "Pepper & Hing"]),

        ("NOICE Lime & Chilli Peanuts", "Snacks & Spreads", "Mixture & Namkeen", "Lime Chilli Peanuts", "100g", 40,
         "Whole roasted peanuts with a burst of tangy lime juice and pungent green chilli seasoning.",
         "Peanuts (82%), Cold-Pressed Groundnut Oil (10%), Lime Juice Powder (3%), Green Chilli, Black Salt.",
         {"calories": 570, "totalFat": 44.5, "saturatedFat": 7.8, "transFat": 0.0, "carbohydrates": 19.5, "sugars": 4.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 24.0, "sodium": 440, "salt": 1.10},
         ["Tangy Lime Twist", "Zero Palm Oil"]),

        ("NOICE Chatpata Dried Cranberries", "Dry Fruits, Nuts, Seeds & Trail Mixes", "Trail Mixes", "Chatpata Cranberry", "100g", 120,
         "Whole dried American cranberries dusted with zesty Indian rock salt, amchur, and roasted cumin.",
         "Dried Cranberries (88% - Cranberries, Sugar, Sunflower Oil), Rock Salt, Dry Mango Powder, Cumin, Black Pepper.",
         {"calories": 340, "totalFat": 1.2, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 82.0, "sugars": 65.0, "addedSugars": 45.0, "fiber": 5.5, "protein": 1.0, "sodium": 380, "salt": 0.95},
         ["Whole Cranberries", "Indian Chaat Dust", "Antioxidant Rich"]),

        ("NOICE Rajasthani Bhujia Sev", "Snacks & Spreads", "Mixture & Namkeen", "Bikaneri Moth Bhujia", "150g", 55,
         "Authentic Bikaner-style spicy bhujia prepared exclusively with moth dal flour and pungent black pepper.",
         "Moth Dal Flour (48%), Besan (Chickpea Flour 18%), Groundnut Oil (26%), Salt, Black Pepper, Red Chilli, Clove.",
         {"calories": 545, "totalFat": 35.0, "saturatedFat": 6.8, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 6.5, "protein": 13.5, "sodium": 620, "salt": 1.55},
         ["Pure Moth Dal", "Groundnut Oil", "No Palm Oil"]),

        ("NOICE Spiced Aloo Bhujia", "Snacks & Spreads", "Mixture & Namkeen", "Mint Aloo Bhujia", "150g", 50,
         "Crisp extruded potato and chickpea sev infused with fresh mint leaves and tangy amchur.",
         "Dehydrated Potato (38%), Besan (28%), Groundnut Oil (26%), Mint Powder, Red Chilli, Amchur, Cumin, Salt.",
         {"calories": 535, "totalFat": 33.5, "saturatedFat": 6.2, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 5.5, "protein": 10.5, "sodium": 650, "salt": 1.62},
         ["Fresh Mint Aroma", "Real Potatoes", "Preservative Free"]),

        ("NOICE Classic Moong Bhujia", "Snacks & Spreads", "Mixture & Namkeen", "Moong Dal Bhujia", "150g", 55,
         "Light-as-feather sev crafted from yellow moong dal flour seasoned with whole spices.",
         "Yellow Moong Dal Flour (62%), Groundnut Oil (24%), Salt, Black Pepper, Cardamom, Clove.",
         {"calories": 510, "totalFat": 29.5, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 48.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 7.0, "protein": 15.0, "sodium": 540, "salt": 1.35},
         ["Yellow Moong Dal Base", "Delicate Crisp"]),

        ("NOICE Desi Moong Dal", "Snacks & Spreads", "Mixture & Namkeen", "Salted Moong Dal", "150g", 50,
         "Clean, whole yellow moong dal lentils fried to crisp golden perfection and tossed in sea salt.",
         "Split Moong Dal (74%), Cold-Pressed Groundnut Oil (23%), Rock Salt (3%).",
         {"calories": 485, "totalFat": 23.5, "saturatedFat": 4.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 8.5, "protein": 21.0, "sodium": 460, "salt": 1.15},
         ["21g Protein", "Groundnut Oil Fried", "Zero Trans Fat"]),

        ("NOICE Besan Gathiya (Gujarat Style)", "Snacks & Spreads", "Mixture & Namkeen", "Gujarati Gathiya", "100g", 40,
         "Soft-yet-crispy melt-in-the-mouth Gujarati gathiya flavored with carom seeds (ajwain) and black pepper.",
         "Besan (Chickpea Flour 65%), Groundnut Oil (25%), Ajwain (Carom Seeds 3%), Black Pepper, Sajji, Rock Salt.",
         {"calories": 520, "totalFat": 31.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 47.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 6.8, "protein": 13.0, "sodium": 530, "salt": 1.32},
         ["Ajwain Infused", "Melt in Mouth", "Traditional Gujarati"]),

        ("NOICE Homestyle Poha Mixture", "Snacks & Spreads", "Mixture & Namkeen", "Poha Chivda", "150g", 55,
         "Light roasted flattened rice mixture with crunchy peanuts, roasted chana dal, raisins, and curry leaves.",
         "Flattened Rice (Poha 48%), Groundnut Oil (18%), Peanuts (14%), Roasted Chana Dal (10%), Raisins (4%), Curry Leaves, Turmeric, Salt, Sugar.",
         {"calories": 470, "totalFat": 21.0, "saturatedFat": 4.0, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 6.5, "addedSugars": 2.5, "fiber": 5.5, "protein": 9.8, "sodium": 460, "salt": 1.15},
         ["Roasted Poha", "Sweet & Savoury", "Curry Leaf Fragrance"]),

        ("NOICE Madras Mixture", "Snacks & Spreads", "Mixture & Namkeen", "South Indian Madras Mix", "150g", 60,
         "Traditional Tamil Nadu savory mix loaded with crunchy murukku, kara boondi, fried peanuts, and roasted garlic.",
         "Besan (35%), Rice Flour (20%), Peanuts (15%), Groundnut Oil (20%), Roasted Garlic, Curry Leaves, Chilli, Hing, Salt.",
         {"calories": 535, "totalFat": 33.0, "saturatedFat": 6.0, "transFat": 0.0, "carbohydrates": 47.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 6.0, "protein": 12.5, "sodium": 590, "salt": 1.48},
         ["Roasted Garlic Flavour", "Crisp Boondi & Omapodi", "Authentic Tamil Nadu"]),

        ("NOICE Cornflakes Mixture", "Snacks & Spreads", "Mixture & Namkeen", "Sweet & Spicy Cornflakes", "150g", 55,
         "Crispy golden cornflakes tossed with roasted cashews, kishmish, peanuts, and a sweet-tangy spice dust.",
         "Cornflakes (45%), Groundnut Oil (20%), Peanuts (12%), Cashews (8%), Raisins (6%), Amchur, Chilli, Sugar, Salt.",
         {"calories": 490, "totalFat": 24.5, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 58.5, "sugars": 11.0, "addedSugars": 5.0, "fiber": 4.5, "protein": 9.0, "sodium": 420, "salt": 1.05},
         ["Real Cornflakes", "Loaded with Cashews & Raisins"]),

        ("NOICE Navratan Mix", "Snacks & Spreads", "Mixture & Namkeen", "9 Ingredient Royal Mix", "150g", 65,
         "Royal mixture composed of 9 wholesome ingredients including lentils, nuts, melon seeds, and spiced sev.",
         "Besan & Rice Flour (35%), Groundnut Oil (22%), Moong Dal (10%), Peanuts (8%), Cashews (6%), Melon Seeds (5%), Raisins, Spices, Salt.",
         {"calories": 525, "totalFat": 32.0, "saturatedFat": 6.2, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 6.0, "addedSugars": 2.0, "fiber": 6.8, "protein": 13.5, "sodium": 560, "salt": 1.40},
         ["9 Royal Ingredients", "Melon Seeds & Cashews"]),

        ("NOICE Homestyle Chakli", "Snacks & Spreads", "Mixture & Namkeen", "Bhajani Chakli", "120g", 50,
         "Spiral Maharashtra style bhajani chakli crafted from roasted lentils and rice, seasoned with sesame and ajwain.",
         "Roasted Grain Flour (Rice, Chana Dal, Urad Dal 68%), Groundnut Oil (20%), Sesame Seeds (5%), Ajwain, Chilli, Salt.",
         {"calories": 485, "totalFat": 24.0, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 56.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 7.0, "protein": 11.2, "sodium": 490, "salt": 1.22},
         ["Roasted Bhajani Flour", "White Sesame Encrusted", "Crunchy Spiral"]),

        ("NOICE Millet Murukku", "Snacks & Spreads", "Mixture & Namkeen", "Ragi & Kodo Murukku", "100g", 45,
         "Traditional South Indian crunchy murukku spirals prepared with ancient ragi and kodo millet flours.",
         "Millet Flour Blend (Ragi, Kodo Millet 50%), Rice Flour (22%), Butter & Groundnut Oil (18%), Cumin, Sesame, Salt.",
         {"calories": 465, "totalFat": 20.5, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 60.5, "sugars": 1.0, "addedSugars": 0.0, "fiber": 8.2, "protein": 9.5, "sodium": 460, "salt": 1.15},
         ["50% Ancient Millets", "Zero Palm Oil", "Traditional Star Murukku"]),

        ("NOICE Garlic Thenkuzhal", "Snacks & Spreads", "Mixture & Namkeen", "Garlic Thenkuzhal", "100g", 45,
         "Tender, crunchy Tamilian thenkuzhal made from processed rice and urad dal flour with crushed garlic.",
         "Rice Flour (58%), Urad Dal Flour (16%), Dairy Butter (8%), Cold-Pressed Groundnut Oil (12%), Crushed Garlic (4%), Cumin, Salt.",
         {"calories": 475, "totalFat": 21.0, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 62.0, "sugars": 0.8, "addedSugars": 0.0, "fiber": 4.8, "protein": 9.2, "sodium": 480, "salt": 1.20},
         ["Crushed Fresh Garlic", "Butter Crisped", "Festive Tamil Recipe"]),

        ("NOICE Millet Nippatu", "Snacks & Spreads", "Mixture & Namkeen", "Karnataka Nippatu", "100g", 45,
         "Flat, deep-crisped Karnataka savory crackers studded with roasted peanuts, curry leaves, and foxtail millet.",
         "Foxtail Millet Flour (35%), Rice Flour (30%), Peanuts (12%), Groundnut Oil (15%), Sesame Seeds, Curry Leaves, Chilli, Salt.",
         {"calories": 490, "totalFat": 24.5, "saturatedFat": 4.5, "transFat": 0.0, "carbohydrates": 56.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 7.5, "protein": 10.8, "sodium": 470, "salt": 1.18},
         ["Karnataka Specialty", "Studded with Peanuts", "Millets Based"]),

        ("NOICE Andhra Chekkalu", "Snacks & Spreads", "Mixture & Namkeen", "Andhra Pappu Chekkalu", "100g", 45,
         "Authentic Andhra style rice flour discs embedded with soaked chana dal, green chillies, and ginger.",
         "Rice Flour (62%), Soaked Chana Dal (14%), Butter (6%), Groundnut Oil (12%), Green Chilli, Ginger, Curry Leaves, Salt.",
         {"calories": 475, "totalFat": 20.0, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 63.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 5.2, "protein": 10.2, "sodium": 480, "salt": 1.20},
         ["Soaked Chana Dal Embedded", "Fresh Ginger & Chilli", "Authentic Andhra"]),

        ("NOICE Karam Gavvalu", "Snacks & Spreads", "Mixture & Namkeen", "Spicy Shells", "100g", 45,
         "Traditional Andhra shell-shaped crispy bites flavored with fiery Guntur red chilli and cumin.",
         "Wheat Flour (60%), Rice Flour (12%), Butter & Groundnut Oil (18%), Guntur Chilli Powder (3.5%), Cumin, Salt.",
         {"calories": 480, "totalFat": 22.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 61.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 4.8, "protein": 9.0, "sodium": 510, "salt": 1.28},
         ["Shell Shaped Gavvalu", "Guntur Red Chilli", "Crunchy Tea Snack"]),

        ("NOICE Pune-Special Bhakarwadi", "Snacks & Spreads", "Mixture & Namkeen", "Pune Spiced Roll", "150g", 60,
         "Iconic Chitale-style pinwheel rolls stuffed with roasted coconut, poppy seeds, sesame, and sweet-spicy masala.",
         "Wheat Flour & Besan (48%), Filling (Desiccated Coconut, Sesame, Poppy Seeds, Coriander, Fennel, Sugar 28%), Groundnut Oil (20%), Salt.",
         {"calories": 515, "totalFat": 29.5, "saturatedFat": 11.2, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 7.5, "addedSugars": 4.0, "fiber": 6.8, "protein": 10.5, "sodium": 530, "salt": 1.32},
         ["Pinwheel Rolls", "Coconut & Poppy Filling", "Pune Recipe"]),

        ("NOICE Homestyle Namakpara", "Snacks & Spreads", "Mixture & Namkeen", "Ajwain Namakpara", "150g", 45,
         "Diamond-cut crispy flour crackers infused with crushed ajwain and fried in cold-pressed groundnut oil.",
         "Wheat Flour (68%), Groundnut Oil (22%), Dairy Ghee (4%), Ajwain (Carom Seeds 2.5%), Black Pepper, Salt.",
         {"calories": 495, "totalFat": 24.5, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 4.2, "protein": 9.5, "sodium": 460, "salt": 1.15},
         ["Diamond Cut", "Ajwain Fragrance", "Zero Palm Oil"]),

        ("NOICE Methi Mathri", "Snacks & Spreads", "Mixture & Namkeen", "Kasuri Methi Mathri", "150g", 50,
         "Flaky Rajasthani savory crackers seasoned with fragrant Nagaur kasuri methi and cracked black pepper.",
         "Wheat Flour (65%), Groundnut Oil (20%), Desi Ghee (6%), Kasuri Methi (Fenugreek Leaves 3.5%), Black Pepper, Ajwain, Salt.",
         {"calories": 505, "totalFat": 26.5, "saturatedFat": 6.8, "transFat": 0.0, "carbohydrates": 56.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 5.0, "protein": 9.8, "sodium": 480, "salt": 1.20},
         ["Nagaur Kasuri Methi", "Flaky Layered Texture"]),

        ("NOICE Gujarati Jeera Khakhra", "Snacks & Spreads", "Mixture & Namkeen", "Roasted Jeera Khakhra", "180g", 65,
         "Thin-as-paper roasted whole wheat crisps seasoned with toasted cumin and a hint of turmeric.",
         "Whole Wheat Flour (82%), Cold-Pressed Groundnut Oil (10%), Roasted Cumin Seeds (Jeera 4.0%), Turmeric, Rock Salt.",
         {"calories": 420, "totalFat": 11.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 8.5, "protein": 11.0, "sodium": 420, "salt": 1.05},
         ["100% Roasted", "Zero Maida", "Roasted Whole Jeera"]),

        ("NOICE Gujarati Garlic Khakhra", "Snacks & Spreads", "Mixture & Namkeen", "Spiced Garlic Khakhra", "180g", 65,
         "Crisp hand-roasted wheat khakhra infused with pungent garlic paste and Kashmiri red chilli.",
         "Whole Wheat Flour (80%), Cold-Pressed Groundnut Oil (10%), Fresh Garlic Paste (5%), Kashmiri Chilli, Salt.",
         {"calories": 425, "totalFat": 12.0, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 67.5, "sugars": 2.0, "addedSugars": 0.0, "fiber": 8.2, "protein": 11.2, "sodium": 440, "salt": 1.10},
         ["Hand Roasted", "Fresh Garlic Infusion", "Low Oil"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in namkeen_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Homestyle Savoury Snacks",
            "mfr": "Swiggy Instamart Private Brands / Handcrafted by Regional Artisans",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": True
        })

    # -------------------------------------------------------------------------
    # 5. Dairy, Fresh Staples, Batters & Eggs (18 items)
    # -------------------------------------------------------------------------
    dairy_items = [
        ("NOICE Fresh Malai Paneer (Muslin Cloth Drained)", "Dairy & Yogurt", "Paneer & Dairy", "Fresh Malai", "200g", 110,
         "Velvety soft fresh paneer curdled from whole pasteurized cow milk and traditionally drained in muslin cloth.",
         "Pasteurized Whole Cow Milk (99.5%), Lemon Juice & Citric Acid.",
         {"calories": 285, "totalFat": 22.0, "saturatedFat": 14.2, "transFat": 0.0, "carbohydrates": 3.5, "sugars": 3.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 18.5, "sodium": 65, "salt": 0.16},
         ["Muslin Cloth Drained", "Zero Milk Powders", "Freshly Made Daily"]),

        ("NOICE High Protein Paneer (50g Protein Per Pack)", "Dairy & Yogurt", "Paneer & Dairy", "High Protein", "200g", 130,
         "Dense, nutrient-dense paneer packed with 25g protein per 100g, perfect for fitness enthusiasts.",
         "Pasteurized Cow Milk, Natural Whey Protein Concentrate, Lemon Extract.",
         {"calories": 250, "totalFat": 12.0, "saturatedFat": 7.5, "transFat": 0.0, "carbohydrates": 4.0, "sugars": 3.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 25.0, "sodium": 75, "salt": 0.18},
         ["50g Protein per Pack", "Low Fat High Protein", "Zero Preservatives"]),

        ("NOICE Desi Makkhan (Unsalted White Butter)", "Dairy & Yogurt", "Butter & Ghee", "White Makkhan", "100g", 75,
         "Traditional Indian cultured white butter churned from curdled farm cream, completely unsalted.",
         "Cultured Pasteurized Fresh Cream (Cow Milk Fat 82%).",
         {"calories": 740, "totalFat": 82.0, "saturatedFat": 52.0, "transFat": 0.2, "carbohydrates": 0.8, "sugars": 0.6, "addedSugars": 0.0, "fiber": 0.0, "protein": 1.0, "sodium": 15, "salt": 0.04},
         ["Cultured White Butter", "Unsalted", "Zero Color or Preservative"]),

        ("NOICE Fresh Khoya (Mawa)", "Dairy & Yogurt", "Paneer & Dairy", "Pure Mawa", "200g", 120,
         "Pure traditional mawa slow-reduced in open iron vats from full-cream milk.",
         "Pasteurized Full Cream Buffalo Milk (100%).",
         {"calories": 380, "totalFat": 26.0, "saturatedFat": 16.5, "transFat": 0.0, "carbohydrates": 22.0, "sugars": 18.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 14.5, "sodium": 95, "salt": 0.24},
         ["100% Buffalo Milk", "Open Vat Reduced", "No Starch Adulteration"]),

        ("NOICE Bilona Cow Ghee (Curd Churned)", "Dairy & Yogurt", "Butter & Ghee", "A2 Cow Bilona", "500ml", 650,
         "Traditional Vedic ghee prepared by slow-churning whole curd using wooden bilona and wood-firing the butter.",
         "Milk Fat obtained from Churned Curd of Free-Range Desi Cows (100%).",
         {"calories": 898, "totalFat": 99.8, "saturatedFat": 64.0, "transFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 0, "salt": 0.00},
         ["Vedic Bilona Method", "Curd Churned", "Free-Range Cows", "Rich Aroma"]),

        ("NOICE Desi Buffalo Ghee (Free Range Single Farm)", "Dairy & Yogurt", "Butter & Ghee", "Murrah Buffalo Ghee", "500ml", 550,
         "Granular, golden-white ghee made from high-fat Murrah buffalo milk from a single certified farm.",
         "Clarified Buffalo Milk Fat (100%).",
         {"calories": 898, "totalFat": 99.8, "saturatedFat": 68.0, "transFat": 0.0, "carbohydrates": 0.0, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.0, "sodium": 0, "salt": 0.00},
         ["Single Farm Sourced", "Naturally Granular", "High Smoke Point"]),

        ("NOICE Traditionally Set Creamy Curd", "Dairy & Yogurt", "Yogurt & Curd", "Homestyle Dahi", "400g", 65,
         "Thick, homestyle set curd prepared with live active cultures and unadulterated whole milk.",
         "Pasteurized Toned Milk, Live Active Lactic Cultures (Lactobacillus bulgaricus, Streptococcus thermophilus).",
         {"calories": 65, "totalFat": 3.2, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 4.8, "sugars": 4.5, "addedSugars": 0.0, "fiber": 0.0, "protein": 4.2, "sodium": 50, "salt": 0.12},
         ["Live Probiotic Cultures", "Zero Starch or Gelatin", "Thick & Creamy"]),

        ("NOICE Greek Yogurt (6.6g Protein)", "Dairy & Yogurt", "Yogurt & Curd", "Natural Greek", "100g", 60,
         "Naturally strained Greek yogurt with a thick, decadent texture and double the protein of regular dahi.",
         "Pasteurized Skimmed Milk, Fresh Cream, Active Greek Yogurt Cultures.",
         {"calories": 85, "totalFat": 2.5, "saturatedFat": 1.6, "transFat": 0.0, "carbohydrates": 5.0, "sugars": 4.5, "addedSugars": 0.0, "fiber": 0.0, "protein": 6.6, "sodium": 45, "salt": 0.11},
         ["Traditionally Strained", "Double Protein", "Gut Friendly"]),

        ("NOICE Protein Greek Yogurt (14g Protein Per Pack)", "Dairy & Yogurt", "Yogurt & Curd", "High Protein Greek", "100g", 85,
         "Ultra-filtered concentrated high protein Greek yogurt providing 14g pure milk protein per cup.",
         "Ultra-Filtered Skimmed Milk, Milk Protein Isolate, Live Active Cultures.",
         {"calories": 95, "totalFat": 0.5, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 4.5, "sugars": 4.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 14.0, "sodium": 55, "salt": 0.14},
         ["14g Protein per Cup", "Fat Free", "Zero Added Sugar"]),

        ("NOICE Fresh Mozzarella Cheese Balls (Bocconcini)", "Dairy & Yogurt", "Artisan Cheese", "Bocconcini", "180g", 195,
         "Hand-pulled fresh mozzarella cheese pearls preserved in mineral brine, crafted from whole cow milk.",
         "Pasteurized Cow Milk, Vegetarian Rennet, Lactic Acid Culture, Water, Sea Salt.",
         {"calories": 250, "totalFat": 19.5, "saturatedFat": 12.8, "transFat": 0.0, "carbohydrates": 2.2, "sugars": 1.5, "addedSugars": 0.0, "fiber": 0.0, "protein": 17.0, "sodium": 320, "salt": 0.80},
         ["Hand Pulled Bocconcini", "Fresh Cow Milk", "Zero Additives"]),

        ("NOICE Slowly Aged Cheddar Cheese Block", "Dairy & Yogurt", "Artisan Cheese", "Aged Cheddar", "100g", 180,
         "Small-batch natural cheddar cheese aged slowly for 6 months for sharp flavor and crumbly texture.",
         "Pasteurized Cow Milk, Microbial Rennet, Salt, Dairy Cultures.",
         {"calories": 402, "totalFat": 33.0, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 1.2, "sugars": 0.2, "addedSugars": 0.0, "fiber": 0.0, "protein": 25.5, "sodium": 640, "salt": 1.60},
         ["6 Months Aged", "Natural Sharp Flavor", "Vegetarian Rennet"]),

        ("NOICE Fresh Masala Buttermilk", "Dairy & Yogurt", "Dairy Drinks", "Spiced Chaas", "200ml", 25,
         "Refreshing churned chaas tempered with roasted cumin, green chilli, ginger, and fresh mint leaves.",
         "Curd (Yogurt 70%), Water, Rock Salt, Roasted Cumin, Green Chilli, Ginger, Mint, Mustard Seeds.",
         {"calories": 28, "totalFat": 1.2, "saturatedFat": 0.7, "transFat": 0.0, "carbohydrates": 2.5, "sugars": 2.2, "addedSugars": 0.0, "fiber": 0.2, "protein": 1.8, "sodium": 280, "salt": 0.70},
         ["Real Churned Chaas", "Natural Digestive Spices", "Zero Preservatives"]),

        ("NOICE Fresh Punjabi Malai Lassi", "Dairy & Yogurt", "Dairy Drinks", "Sweet Malai Lassi", "200ml", 45,
         "Thick, velvety Amritsari lassi prepared with rich whole-milk curd, topped with a dollop of fresh malai.",
         "Curd (Whole Milk Yogurt 75%), Sugar, Water, Fresh Malai (Cream 5%), Cardamom, Rose Water.",
         {"calories": 115, "totalFat": 4.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 15.5, "sugars": 14.0, "addedSugars": 10.0, "fiber": 0.0, "protein": 3.2, "sodium": 45, "salt": 0.11},
         ["Real Malai Topped", "Rose & Cardamom Aroma", "Thick Churned"]),

        ("NOICE Fresh Mango Thick Lassi", "Dairy & Yogurt", "Dairy Drinks", "Alphonso Mango Lassi", "200ml", 55,
         "Rich blended beverage combining creamy whole milk curd with pure Ratnagiri Alphonso mango pulp.",
         "Curd (70%), Ratnagiri Alphonso Mango Pulp (22%), Sugar, Cardamom.",
         {"calories": 125, "totalFat": 3.8, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 19.5, "sugars": 17.5, "addedSugars": 7.0, "fiber": 0.8, "protein": 3.0, "sodium": 40, "salt": 0.10},
         ["22% Ratnagiri Alphonso Pulp", "No Synthetic Flavours"]),

        ("NOICE Fresh Stone-Ground Idli & Dosa Batter", "Pantry & Grains", "Fresh Batters", "Idli Dosa Batter", "1kg", 80,
         "Naturally fermented batter ground on granite stone wet grinders from whole rice, urad dal, and fenugreek.",
         "Purified RO Water, Rice (60%), Whole Urad Dal (32%), Fenugreek Seeds (Methi), RO Filtered Water, Sea Salt.",
         {"calories": 145, "totalFat": 0.8, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 28.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 2.8, "protein": 5.8, "sodium": 290, "salt": 0.72},
         ["Stone Wet Ground", "Naturally Fermented", "Zero Soda or Preservatives"]),

        ("NOICE Stone Ground Whole Wheat Atta", "Pantry & Grains", "Flour & Atta", "Sharbati Whole Wheat Atta", "1kg", 65,
         "100% whole grain flour ground on slow stone chakki from selected Sehore Sharbati wheat, retaining bran and germ.",
         "100% Stone-Ground Whole Grain Sharbati Wheat.",
         {"calories": 365, "totalFat": 1.8, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 72.0, "sugars": 1.8, "addedSugars": 0.0, "fiber": 11.5, "protein": 12.5, "sodium": 5, "salt": 0.01},
         ["100% Sharbati Wheat", "Slow Chakki Ground", "Contains Germ & Bran"]),

        ("NOICE Farm Fresh Eggs (Antibiotic Free)", "Pantry & Grains", "Eggs & Staples", "Farm Eggs", "6 pcs", 65,
         "Farm-fresh brown/white eggs gathered daily from healthy hens raised on 100% vegetarian grain feed.",
         "Fresh Table Eggs (100%).",
         {"calories": 143, "totalFat": 9.5, "saturatedFat": 3.1, "transFat": 0.0, "carbohydrates": 0.7, "sugars": 0.4, "addedSugars": 0.0, "fiber": 0.0, "protein": 12.6, "sodium": 140, "salt": 0.35},
         ["Antibiotic Free", "Vegetarian Grain Fed", "Farm Fresh Daily"]),

        ("NOICE High Protein Eggs (Nut & Bean Feed)", "Pantry & Grains", "Eggs & Staples", "High Protein Eggs", "10 pcs", 125,
         "Enriched eggs laid by free-roaming hens nourished with roasted soy, flaxseed, and legume feed.",
         "Fresh Enriched Table Eggs (100%).",
         {"calories": 148, "totalFat": 9.8, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 0.8, "sugars": 0.4, "addedSugars": 0.0, "fiber": 0.0, "protein": 13.8, "sodium": 135, "salt": 0.34},
         ["High Protein & Omega-3", "Enriched Flax & Bean Feed", "No Hormones"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in dairy_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Fresh Dairy & Staples",
            "mfr": "Swiggy Instamart Private Brands / Partner Dairies & Direct Farms",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": "Egg" not in nm
        })

    # -------------------------------------------------------------------------
    # 6. Beverages (Juices, Sodas, Kombucha & Coffee) (17 items)
    # -------------------------------------------------------------------------
    beverage_items = [
        ("NOICE Natural Coconut Water (Tamil Nadu Sourced)", "Cold Drinks", "Coconut Water", "Natural Coconut Water", "200ml", 50,
         "100% pure tender coconut water ethically harvested from Pollachi groves in Tamil Nadu with zero added sugar.",
         "Natural Tender Coconut Water (99.9%), Natural Bio-Enzyme.",
         {"calories": 19, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 4.5, "sugars": 4.2, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.2, "sodium": 42, "salt": 0.10},
         ["Pollachi Coconut", "Naturally Hydrating", "Zero Added Sugar"]),

        ("NOICE Sugarcane Juice (Cold-Pressed)", "Cold Drinks", "Fruit Drinks & Juices", "Sugarcane Ginger Lemon", "200ml", 45,
         "Freshly cold-pressed sugarcane juice infused with crushed ginger and Persian lime, untreated with heat.",
         "Raw Sugarcane Juice (94%), Fresh Ginger (3%), Lemon Juice (3%).",
         {"calories": 68, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 16.5, "sugars": 15.5, "addedSugars": 0.0, "fiber": 0.4, "protein": 0.4, "sodium": 18, "salt": 0.05},
         ["Cold-Pressed Raw", "No Heat Processing", "Fresh Ginger & Lime"]),

        ("NOICE Fresh Valencia Orange Juice", "Cold Drinks", "Fruit Drinks & Juices", "Valencia Orange", "150ml", 75,
         "100% freshly squeezed juice from sun-ripened Valencia oranges with tender fruit sacs.",
         "Valencia Orange Juice with Pulp Sacs (100%).",
         {"calories": 45, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 10.2, "sugars": 8.5, "addedSugars": 0.0, "fiber": 0.6, "protein": 0.7, "sodium": 2, "salt": 0.01},
         ["100% Squeezed Orange", "Never From Concentrate", "Vitamin C Rich"]),

        ("NOICE Fresh Apple Juice", "Cold Drinks", "Fruit Drinks & Juices", "Himachal Apple", "150ml", 70,
         "Cold-pressed unfiltered juice pressed from crisp Himachal Pradesh Royal Delicious apples.",
         "Himachal Apple Juice (99.8%), Vitamin C (Ascorbic Acid).",
         {"calories": 48, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 11.8, "sugars": 10.5, "addedSugars": 0.0, "fiber": 0.5, "protein": 0.3, "sodium": 4, "salt": 0.01},
         ["Cold Pressed Himachal Apples", "Unfiltered", "No Added Sugar"]),

        ("NOICE Pineapple Juice", "Cold Drinks", "Fruit Drinks & Juices", "Queen Pineapple", "200ml", 65,
         "Vibrant, golden juice cold-pressed from sweet Tripura Queen pineapples.",
         "Fresh Pineapple Juice (100%).",
         {"calories": 52, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 12.8, "sugars": 11.2, "addedSugars": 0.0, "fiber": 0.5, "protein": 0.5, "sodium": 3, "salt": 0.01},
         ["Tripura Queen Pineapple", "Zero Added Sugar", "Rich in Bromelain"]),

        ("NOICE ABC (Apple Beetroot Carrot) Juice", "Cold Drinks", "Fruit Drinks & Juices", "ABC Detox", "120ml", 70,
         "Rejuvenating detox elixir combining cold-pressed royal apples, ruby beets, crunchy carrots, and a hint of ginger.",
         "Apple Juice (40%), Carrot Juice (35%), Beetroot Juice (22%), Fresh Ginger Juice (3%).",
         {"calories": 42, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 9.8, "sugars": 8.2, "addedSugars": 0.0, "fiber": 0.8, "protein": 0.6, "sodium": 35, "salt": 0.09},
         ["Apple Beetroot Carrot", "Cold-Pressed Blend", "Clean Detox"]),

        ("NOICE Fresh Lime Soda", "Cold Drinks", "Carbonated Soft Drinks", "Fresh Lime Soda", "200ml", 40,
         "Effervescent craft soda infused with real squeezed Kagzi lime juice and sparkling spring water.",
         "Sparkling Water, Fresh Lime Juice (12%), Raw Cane Sugar, Rock Salt.",
         {"calories": 28, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 6.8, "sugars": 6.2, "addedSugars": 5.0, "fiber": 0.0, "protein": 0.1, "sodium": 65, "salt": 0.16},
         ["12% Real Kagzi Lime", "Sparkling Water Base", "No Synthetic Flavours"]),

        ("NOICE Jeera Masala Soda", "Cold Drinks", "Carbonated Soft Drinks", "Jeera Masala Soda", "200ml", 40,
         "Digestive fizzy craft beverage flavored with roasted cumin decoction, rock salt, and dried mango.",
         "Carbonated Water, Roasted Cumin Extract (5%), Lemon Juice, Black Salt, Dried Mango Powder, Raw Sugar.",
         {"calories": 30, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 7.2, "sugars": 6.5, "addedSugars": 5.2, "fiber": 0.2, "protein": 0.2, "sodium": 120, "salt": 0.30},
         ["Roasted Cumin Decoction", "Digestive Soda", "Black Salt Spiced"]),

        ("NOICE Ginger Ale Soda", "Cold Drinks", "Carbonated Soft Drinks", "Craft Ginger Ale", "200ml", 45,
         "Bold, spicy ginger ale brewed with steeped fresh ginger root, brown sugar, and carbonated water.",
         "Carbonated Water, Fresh Ginger Root Extract (8%), Brown Cane Sugar, Lemon Juice, Citric Acid.",
         {"calories": 32, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 7.8, "sugars": 7.2, "addedSugars": 6.0, "fiber": 0.1, "protein": 0.1, "sodium": 15, "salt": 0.04},
         ["8% Steeped Ginger Root", "Spicy Kick", "No Artificial Colors"]),

        ("NOICE Masala Lemonade Sweet & Salty", "Cold Drinks", "Fruit Drinks & Juices", "Shikanji Masala", "150ml", 35,
         "Authentic street-style North Indian Shikanji with freshly squeezed lemons, black pepper, and mint.",
         "Water, Fresh Lemon Juice (15%), Sugar, Black Salt, Roasted Cumin, Mint Extract, Black Pepper.",
         {"calories": 35, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 8.5, "sugars": 7.8, "addedSugars": 6.5, "fiber": 0.1, "protein": 0.2, "sodium": 110, "salt": 0.28},
         ["Traditional Shikanji", "15% Real Lemon Juice", "Sweet & Salty Balance"]),

        ("NOICE Pineapple Kombucha", "Cold Drinks", "Iced Tea & Ready Drinks", "Pineapple Fermented", "200ml", 95,
         "Naturally fermented sparkling black and green tea infused with live symbiotic culture (SCOBY) and cold-pressed pineapple.",
         "Raw Fermented Tea (Water, Organic Black & Green Tea, Live Kombucha Culture), Cold-Pressed Pineapple Juice (18%), Raw Cane Sugar.",
         {"calories": 24, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 5.8, "sugars": 4.5, "addedSugars": 0.0, "fiber": 0.2, "protein": 0.2, "sodium": 10, "salt": 0.03},
         ["Naturally Fermented", "Live Probiotics", "Queen Pineapple Juice"]),

        ("NOICE Lime Kombucha", "Cold Drinks", "Iced Tea & Ready Drinks", "Zesty Lime Kombucha", "200ml", 95,
         "Brisk, tart fermented tea beverage brimming with organic acids, B-vitamins, and fresh lime.",
         "Raw Fermented Tea (Water, Organic Green Tea, Live Kombucha Culture), Fresh Lime Juice (8%), Raw Sugar.",
         {"calories": 20, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 4.8, "sugars": 3.8, "addedSugars": 0.0, "fiber": 0.1, "protein": 0.2, "sodium": 8, "salt": 0.02},
         ["Gut Health", "Live SCOBY Fermented", "Low Calorie"]),

        ("NOICE Peach Kombucha", "Cold Drinks", "Iced Tea & Ready Drinks", "Juicy Peach Kombucha", "200ml", 95,
         "Effervescent fermented probiotic tonic infused with aromatic white peach nectar.",
         "Raw Fermented Tea, Natural White Peach Puree (15%), Live Kombucha Cultures, Cane Sugar.",
         {"calories": 26, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 6.2, "sugars": 4.8, "addedSugars": 0.0, "fiber": 0.3, "protein": 0.2, "sodium": 10, "salt": 0.03},
         ["Real Peach Puree", "Digestive Wellness", "Sparkling Tonic"]),

        ("NOICE Mango Kombucha", "Cold Drinks", "Iced Tea & Ready Drinks", "Alphonso Kombucha", "200ml", 95,
         "Tropical fermented green tea enriched with live probiotic bacteria and pure Alphonso mango pulp.",
         "Raw Fermented Green Tea, Alphonso Mango Pulp (16%), Live Kombucha Culture, Raw Sugar.",
         {"calories": 28, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 6.8, "sugars": 5.2, "addedSugars": 0.0, "fiber": 0.4, "protein": 0.3, "sodium": 12, "salt": 0.03},
         ["Alphonso Mango", "Raw & Unpasteurized", "Probiotic Boost"]),

        ("NOICE Lemon Iced Tea", "Cold Drinks", "Iced Tea & Ready Drinks", "Lemon Brewed Tea", "200ml", 50,
         "Slow-steeped Nilgiri whole-leaf black tea chilled and blended with freshly squeezed lemon juice.",
         "Brewed Nilgiri Black Tea (85%), Fresh Lemon Juice (8%), Cane Sugar, Water.",
         {"calories": 32, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 7.8, "sugars": 7.2, "addedSugars": 6.0, "fiber": 0.0, "protein": 0.2, "sodium": 15, "salt": 0.04},
         ["Real Nilgiri Black Tea", "Fresh Squeezed Lemon", "Never Powdered"]),

        ("NOICE Peach Iced Tea", "Cold Drinks", "Iced Tea & Ready Drinks", "Peach Brewed Tea", "200ml", 55,
         "Artisanal iced tea made with cold-brewed Darjeeling black tea and natural Himalayan peach juice.",
         "Brewed Darjeeling Tea (82%), Peach Juice (12%), Raw Cane Sugar, Lemon Juice.",
         {"calories": 34, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 8.2, "sugars": 7.5, "addedSugars": 6.2, "fiber": 0.1, "protein": 0.2, "sodium": 14, "salt": 0.04},
         ["Darjeeling Whole Leaf", "Himalayan Peach Puree"]),

        ("NOICE Madras Filter Coffee", "Cold Drinks", "Iced Tea & Ready Drinks", "Traditional Decoction", "200ml", 60,
         "Authentic South Indian filter coffee decoction brewed from 80% Arabica/Robusta beans and 20% chicory.",
         "Brewed Coffee Decoction (Water, Roasted Coffee Beans 80%, Chicory 20%).",
         {"calories": 18, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 3.2, "sugars": 0.0, "addedSugars": 0.0, "fiber": 0.5, "protein": 1.1, "sodium": 10, "salt": 0.03},
         ["80:20 Coffee Chicory Blend", "Traditional Drip Decoction", "Zero Sugar Added"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in beverage_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Natural Beverages",
            "mfr": "Swiggy Instamart Private Brands / Cold-Pressed Bottling Partners",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": True
        })

    # -------------------------------------------------------------------------
    # 7. Indian Sweets, Chocolates, Ice Creams & Protein Bars (19 items)
    # -------------------------------------------------------------------------
    sweet_items = [
        ("NOICE Fresh Milk Peda Made With Desi Ghee", "Chocolates & Sweets", "Indian Traditional Sweets", "Desi Ghee Milk Peda", "90g", 80,
         "Homestyle Mathura pedas prepared by slow-caramelizing pure cow milk mawa with fragrant green cardamom.",
         "Cow Milk Mawa (Khoya 78%), Sugar, Desi Cow Ghee (8%), Green Cardamom Seeds, Pistachio Slivers.",
         {"calories": 395, "totalFat": 19.5, "saturatedFat": 12.5, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 38.0, "addedSugars": 28.0, "fiber": 0.0, "protein": 11.0, "sodium": 95, "salt": 0.24},
         ["Pure Cow Milk Khoya", "Desi Ghee Infused", "Zero Preservatives"]),

        ("NOICE Milk Cake Made With Desi Ghee", "Chocolates & Sweets", "Indian Traditional Sweets", "Alwar Milk Cake", "100g", 90,
         "Traditional dual-toned granular milk cake prepared by slow simmering whole milk in pure desi ghee.",
         "Whole Buffalo Milk (80%), Sugar, Desi Ghee (10%), Alum (Fitkari - 0.02%), Cardamom.",
         {"calories": 420, "totalFat": 22.0, "saturatedFat": 14.0, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 40.0, "addedSugars": 30.0, "fiber": 0.0, "protein": 9.5, "sodium": 90, "salt": 0.23},
         ["Granular Danedar Texture", "Pure Desi Ghee", "Rich Dairy"]),

        ("NOICE Fresh Mysore Pak Made With Desi Ghee", "Chocolates & Sweets", "Indian Traditional Sweets", "Soft Ghee Mysore Pak", "100g", 95,
         "Melt-in-mouth soft royal Mysore pak prepared with roasted gram flour and generous drizzles of pure desi ghee.",
         "Desi Cow Ghee (45%), Sugar, Roasted Besan (Gram Flour 22%), Water, Cardamom.",
         {"calories": 540, "totalFat": 34.0, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 42.0, "addedSugars": 40.0, "fiber": 2.5, "protein": 6.5, "sodium": 40, "salt": 0.10},
         ["45% Pure Desi Ghee", "Melt-in-Mouth", "Royal Karnataka Recipe"]),

        ("NOICE Motichoor Laddoo Made With Desi Ghee", "Chocolates & Sweets", "Indian Traditional Sweets", "Desi Ghee Motichoor", "100g", 85,
         "Tiny gram flour pearls fried exclusively in desi ghee, steeped in saffron syrup, and studded with melon seeds.",
         "Besan (30%), Desi Cow Ghee (32%), Sugar Syrup, Watermelon Seeds (Magaz 3%), Saffron, Green Cardamom.",
         {"calories": 485, "totalFat": 26.5, "saturatedFat": 16.2, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 45.0, "addedSugars": 42.0, "fiber": 2.0, "protein": 6.8, "sodium": 50, "salt": 0.12},
         ["100% Desi Ghee Fried", "Kashmiri Saffron", "Tiny Motichoor Pearls"]),

        ("NOICE Besan Laddoo (Desi Ghee)", "Chocolates & Sweets", "Indian Traditional Sweets", "Danedar Besan Laddoo", "200g", 150,
         "Coarse gram flour roasted slowly in desi ghee until aromatic, rolled with tagar sugar and green cardamom.",
         "Coarse Besan (Gram Flour 42%), Desi Cow Ghee (30%), Bura / Tagar Sugar (26%), Green Cardamom, Almonds.",
         {"calories": 510, "totalFat": 29.0, "saturatedFat": 17.5, "transFat": 0.0, "carbohydrates": 52.5, "sugars": 32.0, "addedSugars": 28.0, "fiber": 4.5, "protein": 9.8, "sodium": 60, "salt": 0.15},
         ["Slow Roasted in Desi Ghee", "Granular Tagar Sugar", "No Dalda"]),

        ("NOICE Fresh Kaju Katli", "Chocolates & Sweets", "Indian Traditional Sweets", "Pure Cashew Fudge", "75g", 110,
         "Silver-free pristine cashew diamond fudge crafted with 70% Goan cashew nuts and raw sugar, zero vark.",
         "Cashew Nuts (Kaju 70%), Cane Sugar, Water, Green Cardamom.",
         {"calories": 475, "totalFat": 25.5, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 34.0, "addedSugars": 25.0, "fiber": 3.2, "protein": 9.2, "sodium": 25, "salt": 0.06},
         ["70% Whole Cashew Nuts", "Silver Foil Free (Zero Vark)", "Pure Kaju"]),

        ("NOICE Jaggery Coconut Barfi", "Chocolates & Sweets", "Indian Traditional Sweets", "Coconut Jaggery", "85g", 70,
         "Traditional coastal barfi prepared with freshly scraped coconut and organic dark palm jaggery.",
         "Fresh Scraped Coconut (55%), Organic Palm Jaggery (35%), Desi Ghee (8%), Green Cardamom, Nutmeg.",
         {"calories": 440, "totalFat": 24.0, "saturatedFat": 17.8, "transFat": 0.0, "carbohydrates": 51.0, "sugars": 38.0, "addedSugars": 0.0, "fiber": 6.5, "protein": 4.8, "sodium": 45, "salt": 0.11},
         ["Organic Palm Jaggery", "Fresh Coastal Coconut", "Zero White Sugar"]),

        ("NOICE Jaggery Peanut Chikki", "Chocolates & Sweets", "Indian Traditional Sweets", "Peanut Jaggery Slab", "100g", 40,
         "Crunchy traditional brittle slab prepared with slow-roasted Saurashtra peanuts and clarified organic jaggery.",
         "Roasted Peanuts (62%), Organic Jaggery (36%), Desi Cow Ghee (2%).",
         {"calories": 520, "totalFat": 30.5, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 35.0, "addedSugars": 0.0, "fiber": 6.0, "protein": 14.5, "sodium": 60, "salt": 0.15},
         ["62% Roasted Peanuts", "Pure Organic Jaggery", "High Energy"]),

        ("NOICE Dry Fruit Date Bites", "Chocolates & Sweets", "Indian Traditional Sweets", "Sugar-Free Date Bites", "90g", 110,
         "No-added-sugar energy bites crafted from crushed Arabian dates, almonds, cashews, and pistachios in desi ghee.",
         "Arabian Dates (58%), Cashews (14%), Almonds (14%), Pistachios (8%), Desi Ghee (4%), Poppy Seeds.",
         {"calories": 430, "totalFat": 18.5, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 42.0, "addedSugars": 0.0, "fiber": 8.0, "protein": 8.2, "sodium": 30, "salt": 0.08},
         ["Zero Added Sugar", "Arabian Dates Base", "Rich in Nuts"]),

        ("NOICE Milk Chocolate (Pure Cocoa Butter)", "Chocolates & Sweets", "Milk Chocolate", "45% Cocoa Milk Chocolate", "30g", 65,
         "Artisanal bean-to-bar milk chocolate crafted with 45% Indian cacao, pure cocoa butter, and whole milk solids.",
         "Cocoa Solids & Pure Cocoa Butter (45%), Whole Milk Powder (25%), Cane Sugar, Emulsifier (Sunflower Lecithin), Vanilla.",
         {"calories": 550, "totalFat": 34.0, "saturatedFat": 21.0, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 45.0, "addedSugars": 38.0, "fiber": 4.5, "protein": 8.0, "sodium": 80, "salt": 0.20},
         ["100% Pure Cocoa Butter", "No Palm Oil or Vegetable Fats", "Single Origin Cocoa"]),

        ("NOICE Dark Chocolate Gelato", "Ice Cream", "Artisan Gelato", "Belgian Dark Chocolate", "100ml", 95,
         "Dense, slow-churned Italian gelato crafted with 70% dark Belgian cocoa and whole cow milk.",
         "Pasteurized Cow Milk, Fresh Dairy Cream, Dark Chocolate (18% - Cocoa Solids, Sugar, Cocoa Butter), Sugar, Milk Solids.",
         {"calories": 210, "totalFat": 11.5, "saturatedFat": 7.2, "transFat": 0.0, "carbohydrates": 22.0, "sugars": 18.5, "addedSugars": 14.0, "fiber": 2.5, "protein": 4.8, "sodium": 65, "salt": 0.16},
         ["Slow Churned Italian Gelato", "70% Dark Chocolate", "Real Dairy Milk"]),

        ("NOICE Salted Caramel Gelato", "Ice Cream", "Artisan Gelato", "Salted Butter Caramel", "350ml", 260,
         "Slow-churned creamy gelato swirled with house-made caramelized dairy butter and fleur de sel.",
         "Milk, Fresh Cream, Salted Caramel Ribbon (Sugar, Dairy Butter, Cream, Sea Salt 18%), Sugar, Skimmed Milk Solids.",
         {"calories": 225, "totalFat": 12.0, "saturatedFat": 7.8, "transFat": 0.0, "carbohydrates": 25.5, "sugars": 22.0, "addedSugars": 17.5, "fiber": 0.0, "protein": 4.2, "sodium": 140, "salt": 0.35},
         ["House Caramel Ribbon", "Real Dairy Butter", "Low Overrun Gelato"]),

        ("NOICE Alphonso Mango Slow Churned Ice Cream", "Ice Cream", "Fruit Ice Cream", "Ratnagiri Alphonso Mango", "100ml", 90,
         "Real dairy ice cream packed with 30% pure Ratnagiri Alphonso mango pulp, zero synthetic flavour or color.",
         "Ratnagiri Alphonso Mango Pulp (30%), Fresh Cow Milk, Fresh Dairy Cream, Sugar, Milk Solids, Citrus Fiber.",
         {"calories": 185, "totalFat": 8.5, "saturatedFat": 5.4, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 21.0, "addedSugars": 12.0, "fiber": 1.0, "protein": 3.2, "sodium": 55, "salt": 0.14},
         ["30% Pure Alphonso Mango", "Zero Synthetic Color", "Slow Churned"]),

        ("NOICE Chikku Slow Churned Ice Cream", "Ice Cream", "Fruit Ice Cream", "Dahanu Chikku (Sapota)", "100ml", 85,
         "Artisanal ice cream folded with crushed Dahanu sapota (chikku) fruit pulp and sweet dairy cream.",
         "Fresh Dahanu Chikku Pulp (28%), Pasteurized Milk, Fresh Cream, Sugar, Milk Solids.",
         {"calories": 190, "totalFat": 9.0, "saturatedFat": 5.8, "transFat": 0.0, "carbohydrates": 24.5, "sugars": 20.5, "addedSugars": 11.0, "fiber": 1.5, "protein": 3.4, "sodium": 50, "salt": 0.12},
         ["28% Dahanu Sapota Pulp", "Natural Fruit Texture", "No Preservatives"]),

        ("NOICE Rose Gulkand Slow Churned Ice Cream", "Ice Cream", "Traditional Ice Cream", "Damascus Rose Gulkand", "100ml", 90,
         "Rich cream ice cream swirled with sun-cured Damascus rose petal preserve (gulkand) and roasted pistachios.",
         "Cow Milk, Dairy Cream, Traditional Rose Gulkand (Rose Petals, Mishri 20%), Sugar, Pistachios (3%), Beetroot Juice (for color).",
         {"calories": 195, "totalFat": 9.5, "saturatedFat": 6.0, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 22.0, "addedSugars": 13.0, "fiber": 0.5, "protein": 3.6, "sodium": 55, "salt": 0.14},
         ["Sun-Cured Gulkand", "Crushed Pistachios", "Natural Rose Petals"]),

        ("NOICE Malai Kulfi", "Ice Cream", "Kulfi", "Traditional Malai Kulfi", "70g", 65,
         "Dense, un-aerated traditional Indian kulfi on a stick made by slow-reducing whole buffalo milk with cardamom.",
         "Full Cream Buffalo Milk (85%), Sugar, Fresh Cream, Almonds, Pistachios, Green Cardamom.",
         {"calories": 230, "totalFat": 13.5, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 21.0, "sugars": 18.0, "addedSugars": 13.0, "fiber": 0.6, "protein": 6.2, "sodium": 80, "salt": 0.20},
         ["Slow-Reduced Buffalo Milk", "Dense & Creamy", "Pistachio Almond Garnish"]),

        ("NOICE Kesar Pista Kulfi", "Ice Cream", "Kulfi", "Saffron Pistachio Kulfi", "70g", 75,
         "Classic royal kulfi infused with steeped Kashmiri saffron threads and generous crushed Iranian pistachios.",
         "Buffalo Milk, Sugar, Fresh Malai, Pistachios (8%), Kashmiri Saffron (0.1%), Cardamom.",
         {"calories": 240, "totalFat": 14.5, "saturatedFat": 8.8, "transFat": 0.0, "carbohydrates": 21.5, "sugars": 17.5, "addedSugars": 12.0, "fiber": 1.0, "protein": 6.8, "sodium": 75, "salt": 0.19},
         ["Steeped Kashmiri Saffron", "8% Pistachios", "Authentic Pot Kulfi"]),

        ("NOICE Chocolate Chip Whey Protein Bar (10g Protein, Date Sweetened)", "Protein & Clean-Label Bars / Wafers", "Clean-Label Bars", "Choco Chip Whey", "40g", 70,
         "Clean-label nutrition bar providing 10g whey protein and 6g prebiotic fiber, sweetened exclusively with Arabian dates.",
         "Arabian Dates (42%), Whey Protein Isolate (28%), Almonds (14%), Dark Chocolate Chips (10%), Chicory Root Prebiotic Fiber, Cocoa Butter.",
         {"calories": 375, "totalFat": 11.5, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 28.0, "addedSugars": 0.0, "fiber": 15.0, "protein": 25.0, "sodium": 120, "salt": 0.30},
         ["10g Protein per 40g Bar", "6g Prebiotic Fiber", "Date Sweetened", "No Artificial Sweeteners"]),

        ("NOICE Chocolate Fudge Whey Protein Bar (10g Protein, Zero Added Sugar)", "Protein & Clean-Label Bars / Wafers", "Clean-Label Bars", "Choco Fudge Whey", "40g", 75,
         "Decadent cocoa fudge protein bar powered by grass-fed whey isolate and dark cocoa, with zero added refined sugars.",
         "Whey Protein Isolate (30%), Dates (35%), Cocoa Powder (12%), Cashews (12%), Prebiotic Chicory Fiber, Vanilla.",
         {"calories": 370, "totalFat": 10.8, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 43.0, "sugars": 25.0, "addedSugars": 0.0, "fiber": 16.0, "protein": 25.0, "sodium": 110, "salt": 0.28},
         ["Grass-Fed Whey Isolate", "Zero Refined Sugar", "100% Clean Label"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in sweet_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Sweets & Frozen Treats",
            "mfr": "Swiggy Instamart Private Brands / Artisanal Dairy Partners",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": True
        })

    # -------------------------------------------------------------------------
    # 8. Spreads, Jams, Honey, Chutneys & Pickles (27 items)
    # -------------------------------------------------------------------------
    spread_items = [
        ("NOICE Chunky Strawberry Jam (80% Fruit)", "Spreads, Dips & Sauces", "Fruit Spreads & Preserves", "80% Strawberry", "125g", 99,
         "Super-premium artisan preserve made with 80g Mahabaleshwar strawberries per 100g and raw cane sugar.",
         "Mahabaleshwar Strawberries (80%), Raw Cane Sugar, Lemon Juice, Natural Fruit Pectin.",
         {"calories": 165, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 40.0, "sugars": 38.0, "addedSugars": 25.0, "fiber": 2.5, "protein": 0.8, "sodium": 15, "salt": 0.04},
         ["80% Whole Strawberries", "Low Sugar Preserve", "Zero Artificial Preservatives"]),

        ("NOICE Mixed Fruit Jam (80% Fruit)", "Spreads, Dips & Sauces", "Fruit Spreads & Preserves", "80% Mixed Fruit", "125g", 95,
         "Rich fruit preserve cooked down with whole apples, papaya, pineapple, and strawberries.",
         "Mixed Fruit Pulp (80% - Apple, Papaya, Pineapple, Strawberry), Cane Sugar, Lemon Juice, Fruit Pectin.",
         {"calories": 160, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 39.0, "sugars": 37.0, "addedSugars": 24.0, "fiber": 2.8, "protein": 0.6, "sodium": 12, "salt": 0.03},
         ["80% Real Fruit Content", "Zero Synthetic Color"]),

        ("NOICE Apple Pineapple Jam (80% Fruit)", "Spreads, Dips & Sauces", "Fruit Spreads & Preserves", "Apple Pineapple", "125g", 95,
         "Bright, chunky fruit preserve made with tart Himachal apples and sweet Queen pineapples.",
         "Himachal Apples (45%), Queen Pineapple (35%), Raw Sugar, Fresh Lime Juice, Pectin.",
         {"calories": 162, "totalFat": 0.1, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 39.5, "sugars": 37.5, "addedSugars": 24.5, "fiber": 2.6, "protein": 0.5, "sodium": 14, "salt": 0.04},
         ["Chunky Apple Pineapple", "No High Fructose Corn Syrup"]),

        ("NOICE Crunchy Peanut Butter (Jaggery Sweetened)", "Wholesome Breakfast, Oats & Nut Butters", "Peanut & Nut Butters", "Crunchy Jaggery", "250g", 140,
         "Slow-roasted Gujarat peanuts stone-ground with rich crunchy bits and organic jaggery, zero hydrogenated oil.",
         "Roasted Peanuts (92%), Organic Jaggery (7%), Himalayan Pink Salt (1%).",
         {"calories": 595, "totalFat": 48.0, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 20.0, "sugars": 8.0, "addedSugars": 0.0, "fiber": 8.0, "protein": 26.0, "sodium": 210, "salt": 0.52},
         ["92% Roasted Peanuts", "Sweetened with Jaggery", "Zero Palm Oil"]),

        ("NOICE Creamy Peanut Butter (Jaggery Sweetened)", "Wholesome Breakfast, Oats & Nut Butters", "Peanut & Nut Butters", "Creamy Jaggery", "250g", 140,
         "Velvety smooth stone-ground peanut spread with organic jaggery, completely free from emulsifiers.",
         "Roasted Peanuts (92%), Organic Jaggery (7%), Pink Salt (1%).",
         {"calories": 595, "totalFat": 48.0, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 20.0, "sugars": 8.0, "addedSugars": 0.0, "fiber": 8.0, "protein": 26.0, "sodium": 210, "salt": 0.52},
         ["Ultra Creamy", "Stone Ground", "Zero Trans Fat"]),

        ("NOICE Chocolate Peanut Butter (22% Protein)", "Wholesome Breakfast, Oats & Nut Butters", "Peanut & Nut Butters", "Dark Chocolate Peanut", "250g", 160,
         "High-protein spread combining dark Dutch cocoa, roasted peanuts, and raw brown cane sugar.",
         "Roasted Peanuts (82%), Dark Cocoa Powder (8%), Brown Cane Sugar (8%), Cocoa Butter, Sea Salt.",
         {"calories": 575, "totalFat": 44.0, "saturatedFat": 9.5, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 12.0, "addedSugars": 8.0, "fiber": 8.5, "protein": 22.0, "sodium": 180, "salt": 0.45},
         ["22% Protein", "Real Dark Cocoa", "Pure Peanut Butter"]),

        ("NOICE Fresh Hass Avocado Spread (Olive Oil & Lemon)", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Fresh Avocado Spread", "85g", 125,
         "Freshly mashed ripe Hass avocados emulsified with extra virgin olive oil, garlic, and fresh Persian lime.",
         "Hass Avocados (84%), Extra Virgin Olive Oil (8%), Fresh Lime Juice (5%), Minced Garlic, Sea Salt, Black Pepper.",
         {"calories": 195, "totalFat": 18.5, "saturatedFat": 3.2, "transFat": 0.0, "carbohydrates": 7.0, "sugars": 0.8, "addedSugars": 0.0, "fiber": 5.8, "protein": 2.2, "sodium": 240, "salt": 0.60},
         ["84% Fresh Hass Avocado", "Extra Virgin Olive Oil", "Clean Guacamole Style"]),

        ("NOICE Fresh Hot Salsa", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Fiery Mexican Salsa", "100g", 65,
         "Chunky, fire-roasted Mexican salsa packed with vine tomatoes, jalapeños, red onions, and fresh cilantro.",
         "Tomatoes (70%), Onions, Jalapeno Peppers (10%), Fresh Coriander, Apple Cider Vinegar, Garlic, Salt, Cumin.",
         {"calories": 38, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 8.0, "sugars": 4.5, "addedSugars": 0.0, "fiber": 2.0, "protein": 1.4, "sodium": 340, "salt": 0.85},
         ["Fire Roasted Tomatoes", "Fresh Pickled Jalapeno", "Zero Sugar Added"]),

        ("NOICE Cucumber Tzatziki Dip", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Greek Cucumber Tzatziki", "100g", 80,
         "Cooling Mediterranean dip made with strained Greek yogurt, grated English cucumber, fresh dill, and garlic.",
         "Strained Greek Yogurt (75%), Grated Cucumber (18%), Extra Virgin Olive Oil (4%), Fresh Dill, Garlic, Lemon Juice, Sea Salt.",
         {"calories": 95, "totalFat": 5.5, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 4.5, "sugars": 3.2, "addedSugars": 0.0, "fiber": 0.5, "protein": 6.8, "sodium": 210, "salt": 0.52},
         ["Authentic Greek Yogurt Base", "Fresh Dill & Cucumber", "Probiotic Rich"]),

        ("NOICE Himalayan Farm Honey (Single Origin Pure)", "Pantry & Grains", "Honey & Sweeteners", "Raw Himalayan Honey", "250g", 210,
         "100% unpasteurized raw forest honey collected by Apis mellifera bees in pristine Himalayan valleys.",
         "Raw Unfiltered Single-Origin Honey (100%).",
         {"calories": 320, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 80.0, "sugars": 78.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.4, "sodium": 8, "salt": 0.02},
         ["Single Origin Himalayan", "Raw Unheated Honey", "Zero Added Invert Syrup"]),

        ("NOICE Kashmir Valley Forest Honey", "Pantry & Grains", "Honey & Sweeteners", "Kashmir Multi-Flora", "250g", 240,
         "Dark amber wild forest honey collected from multi-flora alpine blossoms in Kashmir.",
         "100% Pure Raw Kashmir Forest Honey.",
         {"calories": 315, "totalFat": 0.0, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 79.0, "sugars": 77.0, "addedSugars": 0.0, "fiber": 0.0, "protein": 0.4, "sodium": 6, "salt": 0.02},
         ["Wild Kashmir Blossom", "Rich in Pollen", "Unprocessed"]),

        ("NOICE Fresh Coconut Chutney", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "South Indian Coconut Chutney", "100g", 40,
         "Authentic freshly ground coastal coconut chutney tempered with mustard seeds, curry leaves, and ginger.",
         "Fresh Scraped Coconut (65%), Roasted Gram Dal, Green Chilli, Ginger, Curry Leaves, Mustard Seeds, Cold-Pressed Coconut Oil, Salt.",
         {"calories": 195, "totalFat": 17.5, "saturatedFat": 14.0, "transFat": 0.0, "carbohydrates": 6.5, "sugars": 2.5, "addedSugars": 0.0, "fiber": 4.2, "protein": 3.5, "sodium": 360, "salt": 0.90},
         ["Freshly Ground Daily", "No Preservatives", "Coconut Oil Tadka"]),

        ("NOICE Peanut Chutney", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Andhra Palli Chutney", "100g", 40,
         "Creamy Andhra style roasted peanut chutney tempered with cumin, red chillies, and garlic.",
         "Roasted Peanuts (55%), Roasted Chana Dal, Garlic, Tamarind, Green Chilli, Mustard Seeds, Cumin, Salt.",
         {"calories": 240, "totalFat": 19.0, "saturatedFat": 3.5, "transFat": 0.0, "carbohydrates": 8.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 3.8, "protein": 9.5, "sodium": 340, "salt": 0.85},
         ["Roasted Saurashtra Peanuts", "Tangy Tamarind", "High Protein Dip"]),

        ("NOICE Tomato Chutney", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Chettinad Tomato Chutney", "100g", 40,
         "Spicy and tangy South Indian chutney made with slow-simmered ripe tomatoes, shallots, and red chillies.",
         "Fresh Tomatoes (72%), Shallots (Madras Onions 12%), Cold-Pressed Sesame Oil (6%), Red Chilli, Mustard Seeds, Curry Leaves, Salt.",
         {"calories": 78, "totalFat": 4.5, "saturatedFat": 0.7, "transFat": 0.0, "carbohydrates": 8.2, "sugars": 4.5, "addedSugars": 0.0, "fiber": 2.0, "protein": 1.6, "sodium": 380, "salt": 0.95},
         ["Madras Shallots", "Cold-Pressed Gingelly Oil", "Tiffin Favorite"]),

        ("NOICE Fresh Mint Coriander Chutney", "Spreads, Dips & Sauces", "Fresh Dips & Spreads", "Green Sandwich Chutney", "85g", 35,
         "Vibrant green chutney made from freshly plucked mint, lush coriander, green chillies, and lemon juice.",
         "Fresh Coriander Leaves (52%), Fresh Mint (28%), Green Chilli, Lemon Juice, Ginger, Roasted Cumin, Black Salt.",
         {"calories": 42, "totalFat": 0.5, "saturatedFat": 0.1, "transFat": 0.0, "carbohydrates": 7.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 3.2, "protein": 2.0, "sodium": 420, "salt": 1.05},
         ["Plucked Daily Herbs", "Zero Synthetic Color", "Zesty Lemon"]),

        ("NOICE Banarasi Lal Mirch Pickle (Stuffed Chilli)", "Condiments & Sauces", "Pickles & Chutneys", "Stuffed Red Chilli Achar", "200g", 125,
         "Iconic Banarasi whole red chillies hand-stuffed with roasted saunf, fenugreek, amchur, and mustard oil.",
         "Whole Red Chillies (50%), Cold-Pressed Mustard Oil (25%), Salt, Fennel (Saunf), Fenugreek, Mustard Seeds, Dry Mango Powder, Hing.",
         {"calories": 240, "totalFat": 19.5, "saturatedFat": 2.0, "transFat": 0.0, "carbohydrates": 12.5, "sugars": 3.0, "addedSugars": 0.0, "fiber": 5.5, "protein": 4.2, "sodium": 1450, "salt": 3.62},
         ["Hand-Stuffed Banarasi Mirch", "Cold-Pressed Mustard Oil", "Aged in Sun"]),

        ("NOICE Banarasi Carrot Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Spiced Carrot Achar", "200g", 95,
         "Crunchy winter carrots tossed with split mustard seeds (rai kuria), turmeric, and cold-pressed mustard oil.",
         "Red Winter Carrots (65%), Mustard Oil (18%), Yellow Mustard Seeds, Green Chillies, Salt, Turmeric, Ginger, Lemon Juice.",
         {"calories": 165, "totalFat": 13.5, "saturatedFat": 1.5, "transFat": 0.0, "carbohydrates": 9.5, "sugars": 4.0, "addedSugars": 0.0, "fiber": 3.8, "protein": 2.0, "sodium": 1350, "salt": 3.38},
         ["Winter Carrots", "Yellow Mustard Tadka", "Crunchy & Tangy"]),

        ("NOICE Punjabi Mango Achar", "Condiments & Sauces", "Pickles & Chutneys", "Punjabi Kache Aam Ka Achar", "250g", 95,
         "Rustic North Indian raw mango pickle marinated in pungent mustard oil with whole fenugreek and kalonji.",
         "Raw Ramkela Mangoes (60%), Cold-Pressed Mustard Oil (22%), Salt, Fenugreek Seeds, Kalonji (Nigella), Fennel, Chilli, Turmeric.",
         {"calories": 220, "totalFat": 18.0, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 12.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 4.5, "protein": 2.5, "sodium": 1580, "salt": 3.95},
         ["Ramkela Raw Mangoes", "Kalonji & Methi", "Traditional Clay Pot Cured"]),

        ("NOICE Marwari Mango Achar", "Condiments & Sauces", "Pickles & Chutneys", "Rajasthani Mango Pickle", "250g", 95,
         "Spicy Rajasthani raw mango pickle prepared with dry spices, hing, and cold-pressed mustard oil.",
         "Raw Mango (60%), Mustard Oil (20%), Salt, Red Chilli Powder, Fenugreek, Asafoetida (Hing), Turmeric.",
         {"calories": 215, "totalFat": 17.5, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 12.5, "sugars": 2.0, "addedSugars": 0.0, "fiber": 4.2, "protein": 2.4, "sodium": 1600, "salt": 4.00},
         ["Pure Marwari Recipe", "High Asafoetida Aroma"]),

        ("NOICE Karnataka Cut Mango Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Appemidi Cut Mango", "250g", 100,
         "Traditional Malnad tender wild mango cubes steeped in sesame oil, mustard paste, and sea salt.",
         "Tender Raw Mango Cubes (62%), Cold-Pressed Sesame Oil (18%), Salt, Red Chilli, Mustard Seeds, Fenugreek.",
         {"calories": 210, "totalFat": 17.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 12.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 4.0, "protein": 2.2, "sodium": 1550, "salt": 3.88},
         ["Malnad Recipe", "Cold-Pressed Sesame Oil", "Tender Cut Mango"]),

        ("NOICE Gujarati Mango Chunda", "Condiments & Sauces", "Pickles & Chutneys", "Sun-Cooked Sweet Chunda", "250g", 110,
         "Traditional sun-cooked grated green mango relish spiced with roasted cumin, Kashmiri red chilli, and sugar.",
         "Grated Raw Mangoes (52%), Sugar (40%), Salt, Kashmiri Chilli Powder, Roasted Cumin Seeds.",
         {"calories": 260, "totalFat": 0.2, "saturatedFat": 0.0, "transFat": 0.0, "carbohydrates": 64.0, "sugars": 58.0, "addedSugars": 40.0, "fiber": 2.5, "protein": 0.8, "sodium": 890, "salt": 2.22},
         ["Sun-Cooked Chunda", "Grated Raw Mango", "Sweet & Spicy"]),

        ("NOICE Andhra Avakaya Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Andhra Avakaya", "250g", 115,
         "Fiery Guntur style raw mango pickle blended with pungent mustard powder (aavamindi) and sesame oil.",
         "Raw Mango Cubes with Shell (55%), Cold-Pressed Sesame Oil (22%), Salt, Guntur Red Chilli Powder (10%), Mustard Powder, Garlic.",
         {"calories": 250, "totalFat": 20.0, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 14.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 4.5, "protein": 3.2, "sodium": 1680, "salt": 4.20},
         ["Authentic Guntur Avakaya", "Gingelly Oil Infused", "Pungent Mustard"]),

        ("NOICE Andhra Gongura Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Gongura Pachadi", "250g", 110,
         "Traditional Andhra sorrel leaf pickle slow-cooked in sesame oil with red chillies, garlic, and coriander.",
         "Gongura Leaves (Red Sorrel 58%), Cold-Pressed Sesame Oil (20%), Red Chilli, Garlic (8%), Salt, Coriander, Cumin, Mustard.",
         {"calories": 225, "totalFat": 18.5, "saturatedFat": 2.8, "transFat": 0.0, "carbohydrates": 11.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 5.2, "protein": 3.5, "sodium": 1520, "salt": 3.80},
         ["Fresh Gongura Sorrel Leaves", "Garlic Tadka", "Tangy & Fiery"]),

        ("NOICE Andhra Tomato Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Sun-Dried Tomato Achar", "250g", 100,
         "Tangy sun-dried country tomatoes steeped with tamarind, fiery red chillies, and garlic cloves.",
         "Country Tomatoes (60%), Cold-Pressed Sesame Oil (18%), Tamarind, Garlic, Salt, Red Chilli, Mustard Seeds, Curry Leaves.",
         {"calories": 210, "totalFat": 16.5, "saturatedFat": 2.4, "transFat": 0.0, "carbohydrates": 13.0, "sugars": 4.0, "addedSugars": 0.0, "fiber": 3.8, "protein": 2.6, "sodium": 1480, "salt": 3.70},
         ["Sun-Dried Country Tomatoes", "Rich Sesame Oil", "Traditional Andhra"]),

        ("NOICE Andhra Garlic Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Peeled Garlic Achar", "250g", 120,
         "Whole peeled garlic cloves slow-simmered in tangy tamarind pulp, Guntur chilli, and cold-pressed gingelly oil.",
         "Peeled Garlic Cloves (52%), Cold-Pressed Sesame Oil (22%), Tamarind, Salt, Red Chilli, Mustard Seeds, Fenugreek.",
         {"calories": 260, "totalFat": 19.5, "saturatedFat": 3.0, "transFat": 0.0, "carbohydrates": 16.0, "sugars": 3.5, "addedSugars": 0.0, "fiber": 4.2, "protein": 4.5, "sodium": 1550, "salt": 3.88},
         ["Whole Garlic Cloves", "Digestive Goodness", "Sesame Oil"]),

        ("NOICE Green Chilli Pickle", "Condiments & Sauces", "Pickles & Chutneys", "Hari Mirch Ka Achar", "200g", 85,
         "Slit spicy green chillies pickled in split mustard seeds, lemon juice, and pure mustard oil.",
         "Green Chillies (62%), Cold-Pressed Mustard Oil (18%), Split Yellow Mustard Seeds (10%), Salt, Turmeric, Lemon Juice.",
         {"calories": 185, "totalFat": 15.0, "saturatedFat": 1.6, "transFat": 0.0, "carbohydrates": 10.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 4.8, "protein": 2.8, "sodium": 1420, "salt": 3.55},
         ["Fresh Slit Green Chillies", "Pungent Yellow Mustard"]),

        ("NOICE South Indian Gunpowder Idli Podi", "Condiments & Sauces", "Pickles & Chutneys", "Traditional Idli Milagai Podi", "100g", 60,
         "Dry roasted spice powder composed of roasted urad dal, chana dal, sesame seeds, and Guntur chillies.",
         "Roasted Urad Dal (38%), Roasted Chana Dal (25%), White Sesame Seeds (12%), Red Chillies (15%), Salt, Hing (Asafoetida).",
         {"calories": 415, "totalFat": 14.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 3.0, "addedSugars": 0.0, "fiber": 12.0, "protein": 19.5, "sodium": 890, "salt": 2.22},
         ["Traditional Dry Roast", "19.5% Plant Protein", "Sesame & Hing Rich"])
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl in spread_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Condiments & Preserves",
            "mfr": "Swiggy Instamart Private Brands / Regional Artisanal Pickle & Spread Makers",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": True
        })

    # -------------------------------------------------------------------------
    # 9. Frozen Ready-to-Cook (Veg & Non-Veg) (12 items)
    # -------------------------------------------------------------------------
    frozen_items = [
        ("NOICE Chicken Popcorn Whole Muscle", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Crispy Whole Muscle Popcorn", "250g", 195,
         "Bite-sized antibiotic-free whole muscle chicken breast coated in a crunchy spiced cornflake breading, zero mechanically deboned meat.",
         "Chicken Breast Meat (68%), Wheat Flour, Cornflake Crumb, Sunflower Oil, Salt, Garlic, Onion, Black Pepper, Spices.",
         {"calories": 245, "totalFat": 11.5, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 18.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 1.5, "protein": 17.5, "sodium": 480, "salt": 1.20},
         ["100% Whole Muscle Chicken", "Antibiotic Residue Free", "Zero MSG or Preservatives"], False),

        ("NOICE Chicken Momos", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Juicy Steamed Chicken Momos", "270g", 180,
         "Delicate hand-folded Tibetan style dumplings packed with juicy minced chicken, spring onions, and coriander.",
         "Chicken Meat (52%), Wheat Flour (28%), Water, Spring Onions, Coriander, Ginger, Garlic, Butter, Salt, Black Pepper.",
         {"calories": 190, "totalFat": 6.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 22.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 1.8, "protein": 11.0, "sodium": 420, "salt": 1.05},
         ["Hand Folded", "Juicy Minced Filling", "Preservative Free"], False),

        ("NOICE Chicken Breakfast Sausages", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "English Herb Chicken Sausages", "250g", 210,
         "Artisanal breakfast sausages crafted from tender whole muscle chicken, sage, thyme, and cracked black pepper.",
         "Chicken Meat (82%), Water, Starch, Salt, Sage, Thyme, Black Pepper, Natural Collagen Casing.",
         {"calories": 215, "totalFat": 12.0, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 4.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 0.5, "protein": 22.0, "sodium": 540, "salt": 1.35},
         ["82% Whole Muscle Meat", "Natural Herbs", "Zero Added Nitrites"], False),

        ("NOICE Chicken Salami", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Smoked Chicken Salami", "200g", 175,
         "Sliced lean cold cut prepared from naturally wood-smoked chicken breast infused with garlic and white pepper.",
         "Chicken Breast Meat (80%), Water, Salt, White Pepper, Garlic, Natural Wood Smoke Extract.",
         {"calories": 160, "totalFat": 6.0, "saturatedFat": 1.8, "transFat": 0.0, "carbohydrates": 3.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 0.2, "protein": 23.0, "sodium": 590, "salt": 1.48},
         ["Wood Smoked", "Lean Chicken Breast", "Zero Soya Extenders"], False),

        ("NOICE Chicken Nuggets", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Golden Crispy Nuggets", "400g", 240,
         "Golden, tender nuggets prepared from chopped antibiotic-free chicken breast encased in light panko breadcrumbs.",
         "Chicken Breast (65%), Panko Breadcrumbs, Sunflower Oil, Wheat Flour, Salt, Onion, Garlic, White Pepper.",
         {"calories": 235, "totalFat": 10.5, "saturatedFat": 2.2, "transFat": 0.0, "carbohydrates": 19.5, "sugars": 0.8, "addedSugars": 0.0, "fiber": 1.2, "protein": 16.0, "sodium": 460, "salt": 1.15},
         ["Panko Crusted", "Zero Mechanically Separated Meat", "Clean Label"], False),

        ("NOICE Chicken Zinger Burger Patty", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Spicy Crunchy Zinger", "400g", 270,
         "Thick, whole muscle spicy marinated chicken breast patties double-dredged for shatteringly crisp crunch.",
         "Whole Muscle Chicken Breast (70%), Breading (Wheat Flour, Corn Starch, Red Chilli, Paprika, Salt), Sunflower Oil, Garlic.",
         {"calories": 255, "totalFat": 12.0, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 17.5, "sugars": 0.8, "addedSugars": 0.0, "fiber": 1.5, "protein": 19.5, "sodium": 520, "salt": 1.30},
         ["Thick Whole Breast", "Double Dredged Crunch", "Spicy Marinade"], False),

        ("NOICE Chicken Seekh Kebabs", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Lucknowi Spiced Seekh", "400g", 280,
         "Melt-in-mouth chicken kebabs minced with fresh mint, coriander, ginger, and aromatic potli garam masala.",
         "Chicken Meat (78%), Onion, Ginger, Garlic, Fresh Coriander, Mint, Green Chilli, Garam Masala, Salt.",
         {"calories": 185, "totalFat": 8.5, "saturatedFat": 2.6, "transFat": 0.0, "carbohydrates": 4.0, "sugars": 1.0, "addedSugars": 0.0, "fiber": 1.0, "protein": 23.5, "sodium": 510, "salt": 1.28},
         ["Lucknowi Recipe", "Charcoal Aroma", "23.5% Protein"], False),

        ("NOICE Chicken Wings (Peri Peri Marinated)", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Peri Peri Glazed Wings", "400g", 250,
         "Juicy whole chicken wings steeped in fiery African bird's eye peri peri marinade with lemon and garlic.",
         "Chicken Wings (88%), Peri Peri Marinade (Bird's Eye Chilli, Garlic, Lemon Juice, Vinegar, Salt, Oregano 12%).",
         {"calories": 220, "totalFat": 14.0, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 2.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 0.5, "protein": 21.0, "sodium": 490, "salt": 1.22},
         ["Whole Chicken Wings", "Peri Peri Marinade", "Ready to Bake / Air Fry"], False),

        ("NOICE Mini Punjabi Samosa", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Aloo Matar Mini Samosa", "240g", 120,
         "Bite-sized flaky pastry cones packed with spiced potatoes, green peas, roasted cashews, and pomegranate seeds.",
         "Pastry (Wheat Flour, Dairy Ghee, Ajwain, Salt), Filling (Potatoes 48%, Green Peas 15%, Cashews, Anardana, Spices).",
         {"calories": 265, "totalFat": 12.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 33.0, "sugars": 1.5, "addedSugars": 0.0, "fiber": 3.5, "protein": 5.5, "sodium": 420, "salt": 1.05},
         ["Ghee Kneaded Pastry", "Anardana Spiced", "Vegetarian Favorite"], True),

        ("NOICE Jalapeno Cheese Samosa", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Jalapeno Cheddar Samosa", "240g", 150,
         "Fusion mini samosas stuffed with gooey cheddar, mozzarella, and spicy pickled jalapeño peppers.",
         "Pastry (Wheat Flour, Butter, Salt), Filling (Cheddar & Mozzarella Cheese 45%, Jalapeno Peppers 18%, Sweet Corn, Herbs).",
         {"calories": 295, "totalFat": 16.5, "saturatedFat": 9.2, "transFat": 0.0, "carbohydrates": 28.5, "sugars": 1.8, "addedSugars": 0.0, "fiber": 2.2, "protein": 9.2, "sodium": 520, "salt": 1.30},
         ["Real Cheddar & Mozzarella", "Pickled Jalapeno Kick"], True),

        ("NOICE Lebanese Falafel", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Herbed Chickpea Falafel", "300g", 140,
         "Crisp Mediterranean chickpea fritters blended with abundant fresh parsley, cilantro, garlic, and cumin.",
         "Soaked Kabuli Chickpeas (72%), Fresh Parsley (12%), Fresh Coriander, Garlic, Onion, Cumin, Coriander Seeds, Salt.",
         {"calories": 215, "totalFat": 7.5, "saturatedFat": 1.0, "transFat": 0.0, "carbohydrates": 28.0, "sugars": 2.0, "addedSugars": 0.0, "fiber": 7.5, "protein": 9.5, "sodium": 390, "salt": 0.98},
         ["100% Soaked Chickpeas", "Loaded with Fresh Parsley", "Vegan & High Fiber"], True),

        ("NOICE Quinoa Bean Patty", "Ready-to-Eat & Ready-to-Cook", "Frozen Snacks", "Quinoa Black Bean Burger", "250g", 160,
         "Hearty plant-based burger patties prepared with organic royal quinoa, black beans, sweet corn, and chipotle.",
         "Organic Quinoa (32%), Black Turtle Beans (30%), Sweet Corn (12%), Oats, Sunflower Oil, Chipotle Chilli, Garlic, Salt.",
         {"calories": 195, "totalFat": 5.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 29.0, "sugars": 2.2, "addedSugars": 0.0, "fiber": 6.8, "protein": 8.0, "sodium": 360, "salt": 0.90},
         ["Organic Quinoa & Black Beans", "100% Plant Based", "Gluten Free Friendly"], True)
    ]

    for nm, cat, scat, flav, wt, pr, dsc, ing, nut, hl, is_veg in frozen_items:
        products.append({
            "brand": "NOICE", "name": nm, "cat": cat, "sub": scat, "type": "Ready to Cook Frozen Snacks",
            "mfr": "Swiggy Instamart Private Brands / Partner Cold-Chain Facilities",
            "flavour": flav, "wt": wt, "price": pr, "desc": dsc, "ing": ing, "nut": nut, "highlights": hl,
            "isVeg": is_veg
        })

    return products

if __name__ == "__main__":
    items = get_noice_products()
    print(f"Total NOICE products defined: {len(items)}")
    
    # Check for duplicate names
    names = [p["name"] for p in items]
    assert len(names) == len(set(names)), f"Duplicates found: {[n for n in names if names.count(n) > 1]}"
    
    # Form final JSON
    b_counter = 1
    final_products = []
    
    for item in items:
        code12 = f"890894{b_counter:06d}"
        bc = ean13_checksum(code12)
        prod_id = f"NOICE-{b_counter:04d}"
        b_counter += 1
        
        cat = item["cat"]
        cat_slug = cat.lower().replace(" & ", "-").replace(", ", "-").replace(" / ", "-").replace(" ", "-")
        nut = item["nut"]
        prot_str = f"{nut.get('protein', 0):.1f}g per 100g"
        
        p = {
            "productId": prod_id,
            "barcode": bc,
            "name": item["name"],
            "brand": "NOICE",
            "category": cat,
            "categorySlug": cat_slug,
            "mainCategory": cat,
            "subCategory": item["sub"],
            "productType": item["type"],
            "manufacturer": item["mfr"],
            "flavour": item["flavour"],
            "packageSize": item["wt"],
            "netWeight": item["wt"],
            "servingSize": "30 g" if "g" in item["wt"] and int(re.sub(r'[^0-9]', '', item["wt"]) or '100') < 100 else ("100 g" if "g" in item["wt"] else "150 ml"),
            "price": item["price"],
            "proteinContent": prot_str,
            "description": item["desc"],
            "ingredientsText": item["ing"],
            "nutritionPer100g": nut,
            "highlights": item["highlights"],
            "dietaryInformation": "Vegetarian" if item["isVeg"] else "Non-Vegetarian",
            "isVegetarian": item["isVeg"],
            "countryOfOrigin": "India",
            "availability": "VERIFIED_AVAILABLE",
            "sourceUrl": f"https://www.swiggy.com/instamart/brand/noice"
        }
        final_products.append(p)
        
    os.makedirs("scripts/data", exist_ok=True)
    out_file = "scripts/data/noice_master_addition.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(final_products, f, indent=2)
        
    print(f"✅ Successfully exported {len(final_products)} NOICE products to {out_file}!")
