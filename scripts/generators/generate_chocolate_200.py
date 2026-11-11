import json
import os

os.makedirs("scripts/data", exist_ok=True)

# 200 Chocolates Master Catalog Definitions
# List 1: 1-100 Initial Chocolate Catalogue
# List 2: 101-150 Additional Chocolate Products
# List 3: 151-200 Premium Worldwide Chocolate Collection

items_meta = [
    # --- Cadbury (1-22) ---
    (1, "Initial Catalogue", "Cadbury", "Cadbury Dairy Milk", "Milk Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Milk Chocolate", "Classic Milk", "50g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (22%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Flavours (Natural, Nature Identical and Artificial (Vanilla) Flavouring Substances).",
     {"calories": 534, "totalFat": 30.5, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 57.5, "sugars": 56.0, "addedSugars": 47.0, "fiber": 2.1, "protein": 8.0, "sodium": 145, "salt": 0.36},
     ["Milk"], ["Tree Nuts", "Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (2, "Initial Catalogue", "Cadbury", "Cadbury Dairy Milk Fruit & Nut", "Fruit Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Fruit & Nut Milk Chocolate", "Raisins & Almonds", "80g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (18%), Raisins (10%), Cocoa Butter, Cocoa Solids, Almonds (9%), Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 518, "totalFat": 28.5, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 52.0, "addedSugars": 42.0, "fiber": 3.8, "protein": 8.5, "sodium": 120, "salt": 0.3},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (3, "Initial Catalogue", "Cadbury", "Cadbury Dairy Milk Roast Almond", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Nut Milk Chocolate", "Roasted Almonds", "80g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (19%), Almonds (16%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 542, "totalFat": 32.8, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 48.0, "addedSugars": 39.0, "fiber": 3.5, "protein": 9.5, "sodium": 125, "salt": 0.31},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (4, "Initial Catalogue", "Cadbury", "Cadbury Dairy Milk Crackle", "Milk Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Rice Crispies Milk Chocolate", "Rice Crispies", "75g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (20%), Cocoa Butter, Cocoa Solids, Rice Crispies (11%) (Rice Flour, Sugar, Barley Malt Extract, Salt), Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 526, "totalFat": 28.5, "saturatedFat": 17.2, "transFat": 0.1, "carbohydrates": 61.0, "sugars": 52.0, "addedSugars": 44.0, "fiber": 2.2, "protein": 7.5, "sodium": 160, "salt": 0.4},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (5, "Initial Catalogue", "Cadbury", "Cadbury Dairy Milk Silk", "Milk Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Silky Smooth Milk Chocolate", "Classic Smooth", "60g", 26, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (25%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 551, "totalFat": 33.4, "saturatedFat": 20.1, "transFat": 0.1, "carbohydrates": 55.8, "sugars": 54.5, "addedSugars": 45.0, "fiber": 1.9, "protein": 7.8, "sodium": 140, "salt": 0.35},
     ["Milk"], ["Tree Nuts", "Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (6, "Initial Catalogue", "Cadbury", "Cadbury Silk Oreo", "Filled Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Filled Chocolate Bar", "Vanilla Creme & Oreo", "60g", 24, "VERIFIED_AVAILABLE",
     "Milk Chocolate (60%) (Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Emulsifiers), Vanilla Flavour Creme (25%) (Sugar, Hydrogenated Vegetable Fat, Milk Solids), Oreo Biscuit Pieces (15%) (Refined Wheat Flour, Sugar, Cocoa Solids, Palm Oil).",
     {"calories": 558, "totalFat": 34.2, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 57.0, "sugars": 50.0, "addedSugars": 42.0, "fiber": 2.0, "protein": 6.8, "sodium": 170, "salt": 0.43},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (7, "Initial Catalogue", "Cadbury", "Cadbury Silk Bubbly", "Milk Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Aerated Milk Chocolate", "Aerated Bubbly", "50g", 26, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (25%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 551, "totalFat": 33.4, "saturatedFat": 20.1, "transFat": 0.1, "carbohydrates": 55.8, "sugars": 54.5, "addedSugars": 45.0, "fiber": 1.9, "protein": 7.8, "sodium": 140, "salt": 0.35},
     ["Milk"], ["Tree Nuts", "Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (8, "Initial Catalogue", "Cadbury", "Cadbury Silk Fruit & Nut", "Fruit Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Silky Fruit & Nut Milk Chocolate", "Raisins & Almonds", "55g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (21%), Raisins (9%), Cocoa Butter, Cocoa Solids, Almonds (8%), Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 535, "totalFat": 31.0, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 56.5, "sugars": 51.0, "addedSugars": 41.0, "fiber": 3.2, "protein": 8.2, "sodium": 128, "salt": 0.32},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (9, "Initial Catalogue", "Cadbury", "Cadbury Silk Roast Almond", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Silky Nut Milk Chocolate", "Roasted Almonds", "58g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (21%), Almonds (15%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 555, "totalFat": 34.5, "saturatedFat": 18.2, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 47.0, "addedSugars": 38.0, "fiber": 3.4, "protein": 9.2, "sodium": 130, "salt": 0.33},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (10, "Initial Catalogue", "Cadbury", "Cadbury Silk Ganache", "Filled Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Filled Chocolate Bar", "Velvety Dark Ganache", "50g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Solids, Milk Solids, Cocoa Butter, Hydrogenated Vegetable Fat, Emulsifiers (INS 442, INS 476), Flavours (Vanilla, Cocoa).",
     {"calories": 560, "totalFat": 35.8, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 3.5, "protein": 7.5, "sodium": 115, "salt": 0.29},
     ["Milk"], ["Tree Nuts", "Soy", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (11, "Initial Catalogue", "Cadbury", "Cadbury Bournville Rich Cocoa", "Dark Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Dark Chocolate Bar", "Rich Cocoa 50%", "80g", 50, "VERIFIED_AVAILABLE",
     "Cocoa Solids (50%), Sugar, Cocoa Butter, Milk Solids, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 540, "totalFat": 32.0, "saturatedFat": 19.5, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 46.0, "addedSugars": 45.0, "fiber": 6.8, "protein": 6.2, "sodium": 45, "salt": 0.11},
     ["Milk"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (12, "Initial Catalogue", "Cadbury", "Cadbury Bournville 50% Dark", "Dark Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Dark Chocolate Bar", "50% Dark", "80g", 50, "VERIFIED_AVAILABLE",
     "Cocoa Solids (50%), Sugar, Cocoa Butter, Emulsifiers (INS 442, INS 476), Flavours (Vanilla).",
     {"calories": 538, "totalFat": 31.8, "saturatedFat": 19.2, "transFat": 0.0, "carbohydrates": 58.5, "sugars": 46.5, "addedSugars": 45.5, "fiber": 7.0, "protein": 6.0, "sodium": 42, "salt": 0.1},
     ["Milk"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (13, "Initial Catalogue", "Cadbury", "Cadbury Temptations Rum & Raisin", "Fruit Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Flavoured Chocolate Bar", "Rum & Raisin", "72g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Raisins (15%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Nature Identical Rum Flavour, Vanilla Flavour.",
     {"calories": 510, "totalFat": 27.5, "saturatedFat": 16.0, "transFat": 0.1, "carbohydrates": 61.0, "sugars": 55.0, "addedSugars": 44.0, "fiber": 3.0, "protein": 7.2, "sodium": 120, "salt": 0.3},
     ["Milk"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (14, "Initial Catalogue", "Cadbury", "Cadbury Temptations Cashew Appeal", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Nut Milk Chocolate", "Cashew Nuts", "72g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Cashew Nuts (18%), Cocoa Butter, Cocoa Solids, Emulsifiers (INS 442, INS 476), Vanilla Flavour.",
     {"calories": 545, "totalFat": 33.5, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 47.0, "addedSugars": 38.0, "fiber": 3.2, "protein": 9.0, "sodium": 125, "salt": 0.31},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (15, "Initial Catalogue", "Cadbury", "Cadbury Temptations Roast Almond Coffee", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Nut & Coffee Chocolate", "Almond Coffee", "72g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Almonds (16%), Cocoa Butter, Cocoa Solids, Coffee Extract (2%), Emulsifiers (INS 442, INS 476), Flavours.",
     {"calories": 548, "totalFat": 34.0, "saturatedFat": 17.8, "transFat": 0.1, "carbohydrates": 52.5, "sugars": 46.0, "addedSugars": 37.0, "fiber": 3.4, "protein": 9.4, "sodium": 122, "salt": 0.3},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (16, "Initial Catalogue", "Cadbury", "Cadbury 5 Star", "Caramel Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Caramel Nougat Bar", "Caramel & Nougat", "40g", 15, "VERIFIED_AVAILABLE",
     "Sugar, Liquid Glucose, Milk Solids, Invert Sugar, Hydrogenated Palm Kernel Oil, Cocoa Solids, Emulsifiers (INS 471, INS 442, INS 476), Hydrolyzed Vegetable Protein, Salt, Flavours.",
     {"calories": 478, "totalFat": 20.8, "saturatedFat": 12.5, "transFat": 0.1, "carbohydrates": 68.5, "sugars": 55.0, "addedSugars": 48.0, "fiber": 1.5, "protein": 3.8, "sodium": 185, "salt": 0.46},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (17, "Initial Catalogue", "Cadbury", "Cadbury 5 Star Crunch", "Wafer Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Crispy Nougat Bar", "Crunchy Crispies & Caramel", "35g", 15, "VERIFIED_AVAILABLE",
     "Sugar, Liquid Glucose, Milk Solids, Wheat Crispies (12%) (Refined Wheat Flour, Sugar, Salt), Hydrogenated Vegetable Fat, Cocoa Solids, Emulsifiers (INS 442, INS 476), Salt.",
     {"calories": 485, "totalFat": 21.5, "saturatedFat": 13.0, "transFat": 0.1, "carbohydrates": 69.0, "sugars": 52.0, "addedSugars": 45.0, "fiber": 1.8, "protein": 4.5, "sodium": 210, "salt": 0.52},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (18, "Initial Catalogue", "Cadbury", "Cadbury Perk", "Wafer Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Coated Wafer Bar", "Light Crispy Wafer", "28g", 12, "VERIFIED_AVAILABLE",
     "Sugar, Refined Wheat Flour (Maida), Hydrogenated Vegetable Fats, Milk Solids, Cocoa Solids (4%), Emulsifiers (INS 442, INS 322), Leavening Agent (INS 500(ii)), Salt, Flavours.",
     {"calories": 512, "totalFat": 25.5, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 65.0, "sugars": 48.0, "addedSugars": 43.0, "fiber": 1.4, "protein": 5.2, "sodium": 140, "salt": 0.35},
     ["Wheat", "Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (19, "Initial Catalogue", "Cadbury", "Cadbury Gems", "Milk Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Sugar Shell Milk Chocolate Buttons", "Chocolate Buttons", "23g", 18, "VERIFIED_AVAILABLE",
     "Sugar, Hydrogenated Vegetable Fat, Milk Solids, Cocoa Solids (8%), Refined Wheat Flour, Emulsifiers (INS 414, INS 442, INS 476), Glazing Agent (INS 903), Permitted Synthetic Food Colours.",
     {"calories": 490, "totalFat": 20.5, "saturatedFat": 13.8, "transFat": 0.1, "carbohydrates": 72.0, "sugars": 65.0, "addedSugars": 58.0, "fiber": 1.8, "protein": 4.2, "sodium": 110, "salt": 0.28},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (20, "Initial Catalogue", "Cadbury", "Cadbury Nutties", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Chocolate Coated Cashews", "Coated Cashews", "30g", 22, "VERIFIED_AVAILABLE",
     "Sugar, Cashew Nuts (25%), Milk Solids, Cocoa Butter, Cocoa Solids, Glazing Agent (INS 904, INS 414), Emulsifiers (INS 442, INS 476), Flavours.",
     {"calories": 540, "totalFat": 33.0, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 45.0, "addedSugars": 38.0, "fiber": 3.1, "protein": 9.8, "sodium": 115, "salt": 0.29},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (21, "Initial Catalogue", "Cadbury", "Cadbury Fuse", "Nut Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Peanut & Caramel Chocolate Bar", "Peanuts & Fudge", "45g", 18, "VERIFIED_AVAILABLE",
     "Peanuts (21%), Sugar, Milk Solids, Liquid Glucose, Cocoa Butter, Cocoa Solids, Hydrogenated Vegetable Oil, Rice Crispies, Emulsifiers (INS 442, INS 476, INS 471), Salt, Flavours.",
     {"calories": 530, "totalFat": 31.5, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 52.5, "sugars": 42.0, "addedSugars": 35.0, "fiber": 4.2, "protein": 10.5, "sodium": 195, "salt": 0.49},
     ["Milk", "Peanuts"], ["Tree Nuts", "Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (22, "Initial Catalogue", "Cadbury", "Cadbury Crispello", "Wafer Chocolate", "Mondelez India Foods Pvt Ltd", "India", "Crispy Center Chocolate", "Crispy Balls", "35g", 20, "VERIFIED_AVAILABLE",
     "Milk Chocolate (65%) (Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Emulsifiers), Crispy Centre (35%) (Refined Wheat Flour, Sugar, Palm Oil, Cocoa Powder, Leavening Agent, Salt).",
     {"calories": 524, "totalFat": 29.0, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 60.5, "sugars": 50.0, "addedSugars": 42.0, "fiber": 2.1, "protein": 6.5, "sodium": 150, "salt": 0.38},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # --- Nestlé (23-31) ---
    (23, "Initial Catalogue", "Nestlé", "Nestlé KitKat", "Wafer Chocolate", "Nestlé India Ltd", "India", "Coated Wafer Finger Bar", "Crisp Wafer in Milk Chocolate", "37g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Refined Wheat Flour (Maida), Cocoa Butter, Cocoa Solids (4.5%), Hydrogenated Vegetable Fats, Emulsifier (Soya Lecithin), Yeast, Raising Agent (INS 500(ii)), Salt, Flavours.",
     {"calories": 515, "totalFat": 26.5, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 49.5, "addedSugars": 43.0, "fiber": 2.2, "protein": 6.2, "sodium": 130, "salt": 0.33},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (24, "Initial Catalogue", "Nestlé", "Nestlé KitKat Mini", "Wafer Chocolate", "Nestlé India Ltd", "India", "Mini Wafer Bar", "Crisp Wafer Finger", "18g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Refined Wheat Flour, Cocoa Butter, Cocoa Solids, Hydrogenated Vegetable Fats, Emulsifier (Soya Lecithin), Yeast, Salt.",
     {"calories": 515, "totalFat": 26.5, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 49.5, "addedSugars": 43.0, "fiber": 2.2, "protein": 6.2, "sodium": 130, "salt": 0.33},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (25, "Initial Catalogue", "Nestlé", "Nestlé Munch", "Wafer Chocolate", "Nestlé India Ltd", "India", "Crunchy Coated Wafer Bar", "Crunchy Coated Wafer", "25g", 12, "VERIFIED_AVAILABLE",
     "Sugar, Refined Wheat Flour (Maida), Hydrogenated Vegetable Fats, Milk Solids, Cocoa Solids (3.8%), Emulsifier (Soya Lecithin), Leavening Agent (INS 500(ii)), Salt, Yeast.",
     {"calories": 485, "totalFat": 22.5, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 66.0, "sugars": 44.0, "addedSugars": 38.0, "fiber": 1.8, "protein": 5.5, "sodium": 165, "salt": 0.41},
     ["Wheat", "Milk", "Soy"], ["Tree Nuts", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (26, "Initial Catalogue", "Nestlé", "Nestlé Milkybar", "White Chocolate", "Nestlé India Ltd", "India", "White Chocolate Confectionery", "Creamy White", "25g", 0, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (34%), Hydrogenated Vegetable Fats, Emulsifier (Soya Lecithin), Flavours (Vanilla).",
     {"calories": 532, "totalFat": 29.8, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 57.5, "addedSugars": 46.0, "fiber": 0.0, "protein": 8.5, "sodium": 160, "salt": 0.4},
     ["Milk", "Soy"], ["Wheat", "Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (27, "Initial Catalogue", "Nestlé", "Nestlé Bar One", "Caramel Chocolate", "Nestlé India Ltd", "India", "Nougat Caramel Chocolate Bar", "Caramel & Nougat", "40g", 15, "VERIFIED_AVAILABLE",
     "Sugar, Liquid Glucose, Milk Solids, Hydrogenated Vegetable Oil, Cocoa Solids (4.5%), Emulsifiers (Soya Lecithin, INS 471), Salt, Hydrolyzed Peanut Protein, Flavours.",
     {"calories": 472, "totalFat": 19.5, "saturatedFat": 12.0, "transFat": 0.1, "carbohydrates": 70.0, "sugars": 54.0, "addedSugars": 47.0, "fiber": 1.2, "protein": 4.2, "sodium": 175, "salt": 0.44},
     ["Milk", "Soy"], ["Peanuts", "Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (28, "Initial Catalogue", "Nestlé", "Nestlé Classic Milk Chocolate", "Milk Chocolate", "Nestlé India Ltd", "India", "Milk Chocolate Bar", "Smooth Milk", "34g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (24%), Cocoa Butter, Cocoa Solids (10%), Emulsifier (Soya Lecithin), Flavours (Vanilla).",
     {"calories": 538, "totalFat": 30.5, "saturatedFat": 18.8, "transFat": 0.1, "carbohydrates": 57.5, "sugars": 56.0, "addedSugars": 45.0, "fiber": 2.0, "protein": 7.8, "sodium": 135, "salt": 0.34},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (29, "Initial Catalogue", "Nestlé", "Nestlé KitKat Chunky", "Wafer Chocolate", "Nestlé International / Import", "UK", "Thick Wafer Finger Bar", "Chunky Crisp Wafer", "40g", 28, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Sugar, Wheat Flour, Skimmed Milk Powder, Cocoa Mass, Cocoa Butter, Vegetable Fats (Palm, Shea), Butterfat (Milk), Emulsifier (Lecithins), Raising Agent (Sodium Bicarbonate).",
     {"calories": 518, "totalFat": 27.2, "saturatedFat": 15.8, "transFat": 0.1, "carbohydrates": 61.5, "sugars": 50.5, "addedSugars": 44.0, "fiber": 2.3, "protein": 6.4, "sodium": 120, "salt": 0.3},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (30, "Initial Catalogue", "Nestlé", "Nestlé KitKat Dark", "Dark Chocolate", "Nestlé International / Import", "Germany", "Dark Wafer Bar", "Dark Chocolate 70%", "41.5g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass, Sugar, Wheat Flour, Vegetable Fats (Palm, Shea), Butterfat (Milk), Cocoa Butter, Emulsifier (Lecithins), Cocoa Powder, Yeast, Raising Agent (Sodium Bicarbonate).",
     {"calories": 512, "totalFat": 30.0, "saturatedFat": 18.0, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 38.0, "addedSugars": 36.0, "fiber": 6.5, "protein": 6.8, "sodium": 40, "salt": 0.1},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (31, "Initial Catalogue", "Nestlé", "Nestlé Milkybar Moosha", "White Chocolate", "Nestlé India Ltd", "India", "Caramel Filled White Chocolate", "Caramel & Nougat White", "40g", 0, "VERIFIED_AVAILABLE",
     "White Confectionery (Sugar, Milk Solids, Hydrogenated Fats, Soya Lecithin), Liquid Glucose, Caramel (Sugar, Milk Solids, Palm Oil), Salt, Flavours.",
     {"calories": 490, "totalFat": 22.0, "saturatedFat": 13.5, "transFat": 0.1, "carbohydrates": 68.0, "sugars": 61.0, "addedSugars": 52.0, "fiber": 0.0, "protein": 5.2, "sodium": 165, "salt": 0.41},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # --- Amul (32-45) ---
    (32, "Initial Catalogue", "Amul", "Amul Milk Chocolate", "Milk Chocolate", "Gujarat Co-operative Milk Marketing Federation Ltd (GCMMF)", "India", "Milk Chocolate Bar", "Pure Milk Chocolate", "150g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (25%), Cocoa Butter, Cocoa Solids, Permitted Emulsifiers (INS 322, INS 476), Added Flavours (Artificial Flavouring Substances - Vanilla).",
     {"calories": 558, "totalFat": 34.2, "saturatedFat": 21.0, "transFat": 0.0, "carbohydrates": 54.5, "sugars": 52.0, "addedSugars": 42.0, "fiber": 2.2, "protein": 8.0, "sodium": 130, "salt": 0.33},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (33, "Initial Catalogue", "Amul", "Amul Dark Chocolate", "Dark Chocolate", "GCMMF", "India", "Dark Chocolate Bar", "Rich Dark 55%", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (55%), Sugar, Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Added Flavours (Vanilla).",
     {"calories": 556, "totalFat": 34.0, "saturatedFat": 21.5, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 44.0, "addedSugars": 42.0, "fiber": 7.5, "protein": 5.5, "sodium": 35, "salt": 0.09},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (34, "Initial Catalogue", "Amul", "Amul 55% Dark Chocolate", "Dark Chocolate", "GCMMF", "India", "Dark Chocolate Bar", "55% Cocoa", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (55%), Sugar, Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Added Vanilla Flavour.",
     {"calories": 556, "totalFat": 34.0, "saturatedFat": 21.5, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 44.0, "addedSugars": 42.0, "fiber": 7.5, "protein": 5.5, "sodium": 35, "salt": 0.09},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (35, "Initial Catalogue", "Amul", "Amul 90% Bitter Chocolate", "Dark Chocolate", "GCMMF", "India", "Bitter Dark Chocolate Bar", "90% Cocoa Bitter", "150g", 90, "VERIFIED_AVAILABLE",
     "Cocoa Solids (90%), Cocoa Butter, Sugar, Permitted Emulsifiers (INS 322), Vanilla Flavour.",
     {"calories": 612, "totalFat": 52.0, "saturatedFat": 32.5, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 9.5, "addedSugars": 8.0, "fiber": 14.5, "protein": 9.5, "sodium": 20, "salt": 0.05},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (36, "Initial Catalogue", "Amul", "Amul 99% Cacao Dark Chocolate", "Dark Chocolate", "GCMMF", "India", "Super Bitter Single Origin Dark", "99% Cacao", "150g", 99, "VERIFIED_AVAILABLE",
     "Cocoa Solids (99%), Cocoa Butter, Sugar, Permitted Emulsifiers (INS 322).",
     {"calories": 635, "totalFat": 56.5, "saturatedFat": 35.0, "transFat": 0.0, "carbohydrates": 16.0, "sugars": 1.0, "addedSugars": 0.8, "fiber": 17.5, "protein": 11.0, "sodium": 15, "salt": 0.04},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (37, "Initial Catalogue", "Amul", "Amul Belgian Chocolate", "Belgian Chocolate", "GCMMF", "India", "Belgian Dark Chocolate Bar", "Belgian Cocoa", "125g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (55%), Sugar, Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Vanilla Flavour.",
     {"calories": 550, "totalFat": 33.5, "saturatedFat": 21.0, "transFat": 0.0, "carbohydrates": 54.0, "sugars": 43.0, "addedSugars": 41.0, "fiber": 7.2, "protein": 6.0, "sodium": 30, "salt": 0.08},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (38, "Initial Catalogue", "Amul", "Amul Hazelnut Dark Chocolate", "Nut Chocolate", "GCMMF", "India", "Nut Dark Chocolate Bar", "Roasted Hazelnuts", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (48%), Sugar, Hazelnuts (12%), Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Flavours.",
     {"calories": 568, "totalFat": 37.0, "saturatedFat": 19.5, "transFat": 0.0, "carbohydrates": 49.0, "sugars": 41.0, "addedSugars": 38.0, "fiber": 7.8, "protein": 7.5, "sodium": 32, "salt": 0.08},
     ["Tree Nuts", "Soy"], ["Milk"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (39, "Initial Catalogue", "Amul", "Amul Tropical Orange Dark Chocolate", "Fruit Chocolate", "GCMMF", "India", "Citrus Dark Chocolate Bar", "Tropical Orange Peel", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (55%), Sugar, Candied Orange Peel (8%), Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Natural Orange Flavour.",
     {"calories": 545, "totalFat": 32.5, "saturatedFat": 20.0, "transFat": 0.0, "carbohydrates": 56.5, "sugars": 46.0, "addedSugars": 44.0, "fiber": 7.0, "protein": 5.4, "sodium": 35, "salt": 0.09},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (40, "Initial Catalogue", "Amul", "Amul Fruit & Nut Dark Chocolate", "Fruit Chocolate", "GCMMF", "India", "Fruit & Nut Dark Chocolate Bar", "Almonds & Raisins", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (50%), Sugar, Raisins (10%), Almonds (8%), Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Vanilla Flavour.",
     {"calories": 535, "totalFat": 31.5, "saturatedFat": 18.0, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 45.0, "addedSugars": 39.0, "fiber": 6.8, "protein": 7.0, "sodium": 38, "salt": 0.1},
     ["Tree Nuts", "Soy"], ["Milk"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (41, "Initial Catalogue", "Amul", "Amul Raisin & Almond Milk Chocolate", "Nut Chocolate", "GCMMF", "India", "Fruit & Nut Milk Chocolate", "Raisins & Almonds", "150g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (22%), Cocoa Butter, Raisins (10%), Almonds (8%), Cocoa Solids, Permitted Emulsifiers (INS 322, INS 476), Vanilla Flavour.",
     {"calories": 538, "totalFat": 31.8, "saturatedFat": 18.5, "transFat": 0.0, "carbohydrates": 55.0, "sugars": 50.0, "addedSugars": 40.0, "fiber": 2.8, "protein": 8.5, "sodium": 120, "salt": 0.3},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (42, "Initial Catalogue", "Amul", "Amul Velvett Milk Chocolate", "Milk Chocolate", "GCMMF", "India", "Ultra Creamy Milk Chocolate", "Velvety Cream", "125g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (28%), Cocoa Butter, Cocoa Solids, Permitted Emulsifiers (INS 322, INS 476), Flavours (Vanilla).",
     {"calories": 565, "totalFat": 35.5, "saturatedFat": 22.0, "transFat": 0.0, "carbohydrates": 53.0, "sugars": 51.0, "addedSugars": 40.0, "fiber": 1.8, "protein": 8.8, "sodium": 145, "salt": 0.36},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (43, "Initial Catalogue", "Amul", "Amul Sugar-Free Dark Chocolate", "Sugar-Free Chocolate", "GCMMF", "India", "Sugar Free Dark Chocolate Bar", "Zero Added Sugar Maltitol", "150g", 55, "VERIFIED_AVAILABLE",
     "Cocoa Solids (55%), Maltitol (INS 965(i)), Cocoa Butter, Permitted Emulsifiers (INS 322, INS 476), Vanilla Flavour.",
     {"calories": 470, "totalFat": 34.0, "saturatedFat": 21.5, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 7.5, "protein": 5.8, "sodium": 30, "salt": 0.08},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": True, "isOrganic": False}),

    (44, "Initial Catalogue", "Amul", "Amul India Origin Dark Chocolate", "Single-Origin Chocolate", "GCMMF", "India", "Single Origin Indian Cocoa Bar", "Indian Cocoa Beans", "125g", 70, "VERIFIED_AVAILABLE",
     "Indian Cocoa Solids (70%), Sugar, Cocoa Butter, Permitted Emulsifiers (INS 322), Vanilla Flavour.",
     {"calories": 575, "totalFat": 38.5, "saturatedFat": 24.0, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 9.2, "protein": 7.2, "sodium": 25, "salt": 0.06},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (45, "Initial Catalogue", "Amul", "Amul Almondo Chocolate-Coated Almonds", "Nut Chocolate", "GCMMF", "India", "Panned Chocolate Coated Nuts", "Roasted California Almonds", "100g", 28, "VERIFIED_AVAILABLE",
     "Roasted Almonds (40%), Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Glazing Agent (INS 904, INS 414), Emulsifiers (INS 322, INS 476), Vanilla Flavour.",
     {"calories": 560, "totalFat": 38.0, "saturatedFat": 16.0, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 38.0, "addedSugars": 32.0, "fiber": 5.5, "protein": 11.5, "sodium": 95, "salt": 0.24},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # --- Ferrero & Kinder (46-55) ---
    (46, "Initial Catalogue", "Ferrero", "Ferrero Rocher", "Chocolate Pralines", "Ferrero India Pvt Ltd / Ferrero SpA", "Italy", "Whole Hazelnut Praline", "Hazelnut Crisp", "200g (16 Pcs)", 28, "VERIFIED_AVAILABLE",
     "Milk Chocolate (30%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Hazelnuts (28.5%), Sugar, Palm Oil, Wheat Flour, Whey Powder (Milk), Fat-Reduced Cocoa Powder, Emulsifier: Lecithins (Soy), Raising Agent (Sodium Bicarbonate), Salt, Vanillin.",
     {"calories": 603, "totalFat": 42.7, "saturatedFat": 14.1, "transFat": 0.1, "carbohydrates": 44.4, "sugars": 39.9, "addedSugars": 35.0, "fiber": 4.1, "protein": 8.2, "sodium": 60, "salt": 0.15},
     ["Milk", "Tree Nuts", "Wheat", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (47, "Initial Catalogue", "Ferrero", "Ferrero Raffaello", "White Chocolate", "Ferrero SpA", "Poland", "Coconut Almond Praline", "White Almond Coconut", "150g", 0, "VERIFIED_AVAILABLE",
     "Desiccated Coconut (25.5%), Vegetable Fats (Palm, Shea), Sugar, Almond (8%), Skimmed Milk Powder, Whey Powder (Milk), Wheat Flour, Tapioca Starch, Emulsifier: Lecithins (Soy), Flavourings, Raising Agent (Sodium Bicarbonate), Salt.",
     {"calories": 628, "totalFat": 48.6, "saturatedFat": 29.7, "transFat": 0.1, "carbohydrates": 38.3, "sugars": 33.3, "addedSugars": 30.0, "fiber": 4.0, "protein": 7.2, "sodium": 120, "salt": 0.3},
     ["Milk", "Tree Nuts", "Wheat", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (48, "Initial Catalogue", "Ferrero", "Ferrero Rondnoir", "Dark Chocolate", "Ferrero SpA", "Italy", "Dark Pearl Praline", "Dark Hazelnut", "138g", 50, "VERIFIED_AVAILABLE",
     "Dark Chocolate (40.5%) (Sugar, Cocoa Mass, Cocoa Butter, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Palm Oil, Wheat Flour, Fat-Reduced Cocoa Powder (5.5%), Whey Powder (Milk), Skimmed Milk Powder, Milk Chocolate, Wheat Starch, Sunflower Oil, Cocoa Butter, Emulsifier: Lecithins (Soy), Glazing Agent (Gum Arabic), Whey Proteins (Milk), Cocoa Mass, Raising Agents, Salt, Vanillin.",
     {"calories": 559, "totalFat": 35.0, "saturatedFat": 18.8, "transFat": 0.1, "carbohydrates": 52.5, "sugars": 43.5, "addedSugars": 38.0, "fiber": 5.8, "protein": 6.2, "sodium": 90, "salt": 0.23},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (49, "Initial Catalogue", "Kinder", "Kinder Joy", "Milk Chocolate", "Ferrero India Pvt Ltd", "India", "Egg Confectionery with Toy", "Milky & Cocoa Creams with Wafer Bites", "20g", 15, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fats (Palm, Sal), Skimmed Milk Powder (19.5%), Fat-Reduced Cocoa Powder (4%), Wheat Flour, Wheat Germ, Wheat Starch, Powdered Barley Malt Extract, Emulsifier (Lecithins - Soy), Whey Proteins (Milk), Cocoa Butter, Flavourings, Raising Agents (INS 503ii, INS 500ii), Salt.",
     {"calories": 550, "totalFat": 32.0, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 56.5, "sugars": 51.0, "addedSugars": 43.0, "fiber": 1.5, "protein": 8.2, "sodium": 140, "salt": 0.35},
     ["Milk", "Wheat", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (50, "Initial Catalogue", "Kinder", "Kinder Bueno", "Wafer Chocolate", "Ferrero SpA", "Italy", "Crispy Hazelnut Wafer Bar", "Hazelnut Cream & Crisp Wafer", "43g", 31, "VERIFIED_AVAILABLE",
     "Milk Chocolate (31.5%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Palm Oil, Wheat Flour, Hazelnuts (10.5%), Skimmed Milk Powder, Milk Powder, Chocolate (Sugar, Cocoa Mass, Cocoa Butter, Emulsifier: Lecithins (Soy), Vanillin), Fat-Reduced Cocoa, Emulsifier: Lecithins (Soy), Raising Agents (Sodium Bicarbonate, Ammonium Bicarbonate), Salt, Vanillin.",
     {"calories": 572, "totalFat": 37.3, "saturatedFat": 17.3, "transFat": 0.1, "carbohydrates": 49.5, "sugars": 41.2, "addedSugars": 36.0, "fiber": 2.0, "protein": 8.6, "sodium": 105, "salt": 0.26},
     ["Milk", "Wheat", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (51, "Initial Catalogue", "Kinder", "Kinder Chocolate", "Milk Chocolate", "Ferrero SpA", "Germany", "Filled Milk Bar", "Milky Filling", "100g", 33, "VERIFIED_AVAILABLE",
     "Fine Milk Chocolate (40%) (Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Skimmed Milk Powder (18%), Palm Oil, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin.",
     {"calories": 566, "totalFat": 35.0, "saturatedFat": 22.6, "transFat": 0.1, "carbohydrates": 53.5, "sugars": 53.3, "addedSugars": 45.0, "fiber": 0.9, "protein": 8.7, "sodium": 125, "salt": 0.31},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (52, "Initial Catalogue", "Kinder", "Kinder Schoko-Bons", "Filled Chocolate", "Ferrero SpA", "Belgium", "Chocolate Bonbons", "Milk & Hazelnut Bites", "125g", 32, "VERIFIED_AVAILABLE",
     "Fine Milk Chocolate (50%) (Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Skimmed Milk Powder (12.5%), Palm Oil, Hazelnuts (5.8%), Anhydrous Milkfat, Dark Chocolate, Glazing Agents (Gum Arabic, Shellac), Glucose Syrup, Emulsifier: Lecithins (Soy), Flavourings.",
     {"calories": 576, "totalFat": 36.6, "saturatedFat": 21.2, "transFat": 0.1, "carbohydrates": 52.5, "sugars": 52.2, "addedSugars": 45.0, "fiber": 1.5, "protein": 8.3, "sodium": 110, "salt": 0.28},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (53, "Initial Catalogue", "Kinder", "Kinder Country", "Milk Chocolate", "Ferrero SpA", "Italy", "Cereal Milk Bar", "5 Puffed Cereals", "23.5g", 30, "VERIFIED_AVAILABLE",
     "Fine Milk Chocolate (33.5%) (Sugar, Cocoa Butter, Milk Powder, Cocoa Mass, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Skimmed Milk Powder (17.5%), Palm Oil, Cereals (7.5%) (Barley, Rice, Wheat, Spelt, Buckwheat), Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin.",
     {"calories": 561, "totalFat": 33.8, "saturatedFat": 21.9, "transFat": 0.1, "carbohydrates": 54.9, "sugars": 49.1, "addedSugars": 41.0, "fiber": 1.5, "protein": 8.6, "sodium": 110, "salt": 0.28},
     ["Milk", "Wheat", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (54, "Initial Catalogue", "Kinder", "Kinder Happy Hippo", "Wafer Chocolate", "Ferrero SpA", "Germany", "Hippo Shaped Wafer Bar", "Cocoa & Milk Cream", "20.7g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fats (Palm, Shea), Wheat Flour, Whole Milk Powder (7.5%), Fat-Reduced Cocoa Powder (5%), Skimmed Milk Powder (4.5%), Hazelnuts, Whey Powder (Milk), Chocolate (Sugar, Cocoa Mass, Cocoa Butter, Emulsifier: Lecithins (Soy), Vanillin), Wheat Starch, Sunflower Oil, Emulsifier: Lecithins (Soy), Whey Proteins (Milk), Raising Agents, Salt, Vanillin.",
     {"calories": 593, "totalFat": 38.6, "saturatedFat": 17.6, "transFat": 0.1, "carbohydrates": 53.6, "sugars": 45.1, "addedSugars": 38.0, "fiber": 2.2, "protein": 6.7, "sodium": 105, "salt": 0.26},
     ["Milk", "Wheat", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (55, "Initial Catalogue", "Kinder", "Kinder Cards", "Wafer Chocolate", "Ferrero SpA", "Italy", "Filled Thin Wafer Biscuit", "Cocoa & Milky Filling", "25.6g", 28, "VERIFIED_AVAILABLE",
     "Skimmed Milk Powder (28%), Sugar, Palm Oil, Wheat Flour (15.5%), Fat-Reduced Cocoa Powder (4%), Sunflower Oil, Emulsifier: Lecithins (Soy), Salt, Powdered Barley Malt Extract, Raising Agent (Sodium Bicarbonate), Vanillin.",
     {"calories": 510, "totalFat": 26.0, "saturatedFat": 12.3, "transFat": 0.1, "carbohydrates": 55.5, "sugars": 43.0, "addedSugars": 36.0, "fiber": 2.5, "protein": 11.9, "sodium": 170, "salt": 0.43},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # --- Mars (56-65) ---
    (56, "Initial Catalogue", "Mars", "Snickers Original", "Nut Chocolate", "Mars Wrigley Confectionery India Pvt Ltd", "India", "Peanut Nougat Bar", "Peanuts & Caramel", "45g", 20, "VERIFIED_AVAILABLE",
     "Milk Chocolate (35%) (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Lactose, Whey Powder, Milkfat, Soya Lecithin), Peanuts (24%), Glucose Syrup, Sugar, Vegetable Oil (Palm Oil), Skimmed Milk Powder, Salt, Egg White Powder, Flavour.",
     {"calories": 488, "totalFat": 25.1, "saturatedFat": 10.2, "transFat": 0.1, "carbohydrates": 56.0, "sugars": 47.5, "addedSugars": 40.0, "fiber": 3.8, "protein": 8.6, "sodium": 210, "salt": 0.53},
     ["Milk", "Peanuts", "Soy", "Eggs"], ["Tree Nuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (57, "Initial Catalogue", "Mars", "Snickers Almond", "Nut Chocolate", "Mars Wrigley Confectionery", "USA", "Almond Nougat Bar", "Almonds & Caramel", "49.9g", 20, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Cocoa Butter, Chocolate, Skim Milk, Lactose, Milkfat, Soy Lecithin), Almonds, Corn Syrup, Sugar, Palm Oil, Skim Milk, Less Than 2% - Lactose, Salt, Hydrogenated Palm Kernel Oil, Egg Whites, Artificial Flavor.",
     {"calories": 480, "totalFat": 24.0, "saturatedFat": 8.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 46.0, "addedSugars": 40.0, "fiber": 3.2, "protein": 7.5, "sodium": 180, "salt": 0.45},
     ["Milk", "Tree Nuts", "Soy", "Eggs"], ["Peanuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (58, "Initial Catalogue", "Mars", "Mars Chocolate Bar", "Caramel Chocolate", "Mars Wrigley Confectionery", "UK", "Nougat Caramel Bar", "Soft Nougat & Caramel", "51g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Sunflower Oil, Milkfat, Palm Fat, Lactose and Protein from Whey (from Milk), Whey Powder (from Milk), Fat Reduced Cocoa, Barley Malt Extract, Emulsifier (Soya Lecithin), Salt, Egg White Powder, Milk Protein, Natural Vanilla Extract.",
     {"calories": 448, "totalFat": 16.7, "saturatedFat": 8.1, "transFat": 0.1, "carbohydrates": 69.3, "sugars": 59.9, "addedSugars": 52.0, "fiber": 1.1, "protein": 4.4, "sodium": 160, "salt": 0.4},
     ["Milk", "Soy", "Eggs", "Wheat"], ["Peanuts", "Tree Nuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (59, "Initial Catalogue", "Mars", "Twix Original", "Caramel Chocolate", "Mars Wrigley Confectionery", "UK", "Biscuit Caramel Chocolate Finger", "Crunchy Biscuit & Caramel", "50g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Wheat Flour (17%), Palm Fat, Cocoa Butter, Skimmed Milk Powder, Cocoa Mass, Lactose, Milkfat, Whey Powder (from Milk), Fat Reduced Cocoa, Salt, Emulsifier (Soya Lecithin), Raising Agent (E500), Natural Vanilla Extract.",
     {"calories": 495, "totalFat": 23.6, "saturatedFat": 13.9, "transFat": 0.1, "carbohydrates": 64.6, "sugars": 48.8, "addedSugars": 42.0, "fiber": 1.6, "protein": 4.5, "sodium": 175, "salt": 0.44},
     ["Wheat", "Milk", "Soy"], ["Tree Nuts", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (60, "Initial Catalogue", "Mars", "Bounty Milk Chocolate", "Filled Chocolate", "Mars Wrigley Confectionery", "Netherlands", "Coconut Chocolate Bar", "Moist Tender Coconut in Milk Chocolate", "57g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Desiccated Coconut (21%), Glucose Syrup, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Emulsifiers (Soya Lecithin, E471), Lactose, Milkfat, Whey Powder (from Milk), Humectant (Glycerol), Salt, Natural Vanilla Extract.",
     {"calories": 487, "totalFat": 25.7, "saturatedFat": 21.2, "transFat": 0.1, "carbohydrates": 58.9, "sugars": 48.2, "addedSugars": 40.0, "fiber": 3.5, "protein": 3.7, "sodium": 100, "salt": 0.25},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (61, "Initial Catalogue", "Mars", "Bounty Dark Chocolate", "Dark Chocolate", "Mars Wrigley Confectionery", "Netherlands", "Dark Coconut Chocolate Bar", "Tender Coconut in Dark Chocolate", "57g", 50, "VERIFIED_AVAILABLE",
     "Sugar, Desiccated Coconut (21%), Glucose Syrup, Cocoa Mass, Cocoa Butter, Emulsifiers (Soya Lecithin, E471), Skimmed Milk Powder, Humectant (Glycerol), Milkfat, Salt, Natural Vanilla Extract.",
     {"calories": 488, "totalFat": 26.0, "saturatedFat": 21.4, "transFat": 0.0, "carbohydrates": 58.3, "sugars": 47.8, "addedSugars": 40.0, "fiber": 4.2, "protein": 3.5, "sodium": 95, "salt": 0.24},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (62, "Initial Catalogue", "Mars", "M&M's Milk Chocolate", "Milk Chocolate", "Mars Wrigley Confectionery", "USA", "Candy Coated Chocolate Buttons", "Milk Chocolate in Crisp Shell", "45g", 28, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Chocolate, Skim Milk, Cocoa Butter, Lactose, Milkfat, Soy Lecithin, Salt, Artificial Flavors), Sugar, Cornstarch, Less Than 1% - Corn Syrup, Dextrin, Coloring (Includes Blue 1 Lake, Yellow 6, Red 40, Yellow 5), Gum Acacia.",
     {"calories": 492, "totalFat": 20.8, "saturatedFat": 12.8, "transFat": 0.1, "carbohydrates": 70.2, "sugars": 65.2, "addedSugars": 59.0, "fiber": 2.8, "protein": 5.0, "sodium": 75, "salt": 0.19},
     ["Milk", "Soy"], ["Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (63, "Initial Catalogue", "Mars", "M&M's Peanut", "Nut Chocolate", "Mars Wrigley Confectionery", "USA", "Candy Coated Peanut Chocolate", "Peanuts in Milk Chocolate Shell", "45g", 25, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Chocolate, Skim Milk, Cocoa Butter, Lactose, Milkfat, Peanuts, Soy Lecithin, Salt, Artificial Flavors), Peanuts, Sugar, Cornstarch, Less Than 1% - Palm Oil, Corn Syrup, Dextrin, Coloring, Gum Acacia.",
     {"calories": 516, "totalFat": 28.0, "saturatedFat": 11.2, "transFat": 0.1, "carbohydrates": 58.8, "sugars": 51.5, "addedSugars": 45.0, "fiber": 3.8, "protein": 9.8, "sodium": 65, "salt": 0.16},
     ["Milk", "Peanuts", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (64, "Initial Catalogue", "Mars", "Maltesers", "Milk Chocolate", "Mars Wrigley Confectionery", "UK", "Malted Honeycomb Chocolate Balls", "Crunchy Honeycomb Spheres", "37g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Skimmed Milk Powder, Cocoa Butter, Glucose Syrup, Barley Malt Extract, Cocoa Mass, Palm Fat, Lactose and Protein from Whey (from Milk), Whey Powder (from Milk), Milkfat, Emulsifiers (Soya Lecithin, E492), Wheat Flour, Palm Kernel Fat, Palm Kernel Oil, Raising Agents (E341, E500, E501), Wheat Gluten, Salt, Glazing Agent (Pectins), Natural Vanilla Extract.",
     {"calories": 504, "totalFat": 24.8, "saturatedFat": 15.2, "transFat": 0.1, "carbohydrates": 61.8, "sugars": 51.9, "addedSugars": 44.0, "fiber": 1.2, "protein": 7.3, "sodium": 160, "salt": 0.4},
     ["Milk", "Wheat", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (65, "Initial Catalogue", "Mars", "Galaxy Smooth Milk", "Milk Chocolate", "Mars Wrigley Confectionery India Pvt Ltd", "India", "Silky Smooth Milk Chocolate", "Smooth Pure Milk", "56g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Skimmed Milk Powder, Cocoa Mass, Milkfat, Lactose and Protein from Whey (from Milk), Whey Powder (from Milk), Palm Fat, Emulsifier (Soya Lecithin), Natural Vanilla Extract.",
     {"calories": 546, "totalFat": 32.4, "saturatedFat": 19.8, "transFat": 0.1, "carbohydrates": 56.1, "sugars": 55.0, "addedSugars": 46.0, "fiber": 1.8, "protein": 6.8, "sodium": 130, "salt": 0.33},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # --- Hershey's (66-73) ---
    (66, "Initial Catalogue", "Hershey's", "Hershey's Milk Chocolate", "Milk Chocolate", "Hershey India Pvt Ltd", "India", "Classic Milk Chocolate Bar", "Creamy Milk", "40g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (20%), Cocoa Butter, Cocoa Solids (11%), Emulsifiers (INS 322, INS 476), Flavours (Vanilla).",
     {"calories": 540, "totalFat": 31.0, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 56.0, "addedSugars": 46.0, "fiber": 2.1, "protein": 7.5, "sodium": 125, "salt": 0.31},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (67, "Initial Catalogue", "Hershey's", "Hershey's Kisses", "Milk Chocolate", "Hershey India Pvt Ltd", "India", "Tear Drop Milk Chocolates", "Milk Chocolate Kisses", "33g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Emulsifiers (Soy Lecithin, Polyglycerol Polyricinoleate), Artificial Flavor (Vanillin).",
     {"calories": 535, "totalFat": 30.5, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 56.5, "addedSugars": 47.0, "fiber": 2.0, "protein": 7.8, "sodium": 120, "salt": 0.3},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (68, "Initial Catalogue", "Hershey's", "Hershey's Cookies 'N' Creme", "White Chocolate", "Hershey India Pvt Ltd", "India", "White Chocolate Bar with Cookies", "White Creme & Choco Cookie Bits", "40g", 0, "VERIFIED_AVAILABLE",
     "Sugar, Hydrogenated Vegetable Oil, Milk Solids, Cookies (16%) (Wheat Flour, Sugar, Palm Oil, Cocoa Powder, Invert Sugar, Salt, Leavening Agent), Emulsifiers (Soy Lecithin, Polyglycerol Polyricinoleate), Vanillin.",
     {"calories": 530, "totalFat": 29.5, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 60.5, "sugars": 53.0, "addedSugars": 44.0, "fiber": 1.2, "protein": 6.0, "sodium": 185, "salt": 0.46},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (69, "Initial Catalogue", "Hershey's", "Hershey's Special Dark", "Dark Chocolate", "The Hershey Company", "USA", "Mildly Sweet Dark Chocolate", "Special Dark", "41g", 45, "VERIFIED_AVAILABLE",
     "Sugar, Chocolate, Cocoa Butter, Cocoa Processed with Alkali, Milk Fat, Emulsifier (Lecithin - Soy), PGPR, Natural Flavor, Milk.",
     {"calories": 500, "totalFat": 31.0, "saturatedFat": 19.0, "transFat": 0.0, "carbohydrates": 60.0, "sugars": 48.0, "addedSugars": 46.0, "fiber": 7.0, "protein": 5.0, "sodium": 15, "salt": 0.04},
     ["Milk", "Soy"], ["Tree Nuts", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (70, "Initial Catalogue", "Hershey's", "Hershey's Nuggets Milk Chocolate", "Milk Chocolate", "The Hershey Company", "USA", "Bite Size Thick Chocolates", "Solid Milk Chocolate", "52g", 30, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Skim Milk, Cocoa Butter, Chocolate, Milk Fat, Lecithin (Soy), PGPR, Vanillin, Artificial Flavor).",
     {"calories": 530, "totalFat": 30.5, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 56.0, "addedSugars": 46.0, "fiber": 2.0, "protein": 7.5, "sodium": 120, "salt": 0.3},
     ["Milk", "Soy"], ["Tree Nuts", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (71, "Initial Catalogue", "Hershey's", "Hershey's Nuggets Almond", "Nut Chocolate", "The Hershey Company", "USA", "Nut Bite Size Chocolates", "Toffee & Roasted Almonds", "52g", 30, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Skim Milk, Cocoa Butter, Chocolate, Milk Fat, Lecithin, PGPR), Almonds, Sunflower Oil.",
     {"calories": 545, "totalFat": 34.0, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 47.0, "addedSugars": 38.0, "fiber": 3.8, "protein": 9.2, "sodium": 110, "salt": 0.28},
     ["Milk", "Tree Nuts", "Soy"], ["Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (72, "Initial Catalogue", "Hershey's", "Hershey's Symphony Milk Chocolate", "Milk Chocolate", "The Hershey Company", "USA", "Creamy Milk Chocolate Bar", "Almonds & Toffee Symphony", "42g", 28, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Skim Milk, Cocoa Butter, Chocolate, Milk Fat, Lecithin, PGPR, Vanillin).",
     {"calories": 540, "totalFat": 31.5, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 57.0, "sugars": 55.0, "addedSugars": 45.0, "fiber": 2.0, "protein": 7.8, "sodium": 130, "salt": 0.33},
     ["Milk", "Soy"], ["Tree Nuts", "Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (73, "Initial Catalogue", "Hershey's", "Hershey's Chocolate with Almonds", "Nut Chocolate", "The Hershey Company", "USA", "Whole Almond Chocolate Bar", "Roasted Whole Almonds", "43g", 30, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Milk, Chocolate, Cocoa Butter, Milk Fat, Soy Lecithin, PGPR, Natural Flavor), Almonds, Sunflower Oil.",
     {"calories": 535, "totalFat": 33.0, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 51.5, "sugars": 45.0, "addedSugars": 38.0, "fiber": 4.0, "protein": 9.5, "sodium": 110, "salt": 0.28},
     ["Milk", "Tree Nuts", "Soy"], ["Peanuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # --- Lindt (74-83) ---
    (74, "Initial Catalogue", "Lindt", "Lindt Excellence 70% Dark", "Dark Chocolate", "Chocoladefabriken Lindt & Sprüngli AG", "Switzerland", "Intense Dark Chocolate Tablet", "70% Cocoa Smooth Dark", "100g", 70, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Cocoa Butter, Vanilla.",
     {"calories": 566, "totalFat": 41.0, "saturatedFat": 24.0, "transFat": 0.0, "carbohydrates": 34.0, "sugars": 29.0, "addedSugars": 28.0, "fiber": 10.0, "protein": 9.5, "sodium": 20, "salt": 0.05},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (75, "Initial Catalogue", "Lindt", "Lindt Excellence 85% Dark", "Dark Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Extra Dark Chocolate Tablet", "85% Cocoa Robust Dark", "100g", 85, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Fat-Reduced Cocoa, Cocoa Butter, Demerara Sugar, Vanilla.",
     {"calories": 584, "totalFat": 46.0, "saturatedFat": 27.0, "transFat": 0.0, "carbohydrates": 19.0, "sugars": 12.0, "addedSugars": 11.0, "fiber": 14.0, "protein": 11.0, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (76, "Initial Catalogue", "Lindt", "Lindt Excellence 90% Dark", "Dark Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Supreme Dark Chocolate Tablet", "90% Cocoa Supreme", "100g", 90, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Cocoa Butter, Fat-Reduced Cocoa, Sugar, Vanilla.",
     {"calories": 592, "totalFat": 55.0, "saturatedFat": 30.0, "transFat": 0.0, "carbohydrates": 14.0, "sugars": 7.0, "addedSugars": 6.0, "fiber": 13.0, "protein": 10.0, "sodium": 12, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (77, "Initial Catalogue", "Lindt", "Lindt Excellence 99% Dark", "Dark Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Pure Cacao Dark Chocolate", "99% Cocoa Absolute", "50g", 99, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Fat-Reduced Cocoa, Cocoa Butter, Demerara Sugar.",
     {"calories": 605, "totalFat": 54.0, "saturatedFat": 32.0, "transFat": 0.0, "carbohydrates": 8.0, "sugars": 1.0, "addedSugars": 0.8, "fiber": 17.0, "protein": 13.0, "sodium": 10, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (78, "Initial Catalogue", "Lindt", "Lindt Lindor Milk Truffles", "Chocolate Truffles", "Lindt & Sprüngli AG", "Switzerland", "Smooth Melting Milk Chocolate Truffles", "Smooth Melting Core", "200g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fat (Coconut, Palm Kernel), Cocoa Butter, Cocoa Mass, Whole Milk Powder, Skimmed Milk Powder, Lactose, Anhydrous Milk Fat, Emulsifier (Soy Lecithin), Barley Malt Extract, Flavourings.",
     {"calories": 617, "totalFat": 47.0, "saturatedFat": 35.0, "transFat": 0.1, "carbohydrates": 43.0, "sugars": 42.0, "addedSugars": 36.0, "fiber": 2.0, "protein": 4.9, "sodium": 80, "salt": 0.2},
     ["Milk", "Soy", "Wheat"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (79, "Initial Catalogue", "Lindt", "Lindt Lindor Assorted Truffles", "Chocolate Truffles", "Lindt & Sprüngli AG", "Switzerland", "Assorted Melting Truffles", "Milk, Dark, White & Hazelnut", "200g", 35, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fat (Coconut, Palm Kernel), Cocoa Butter, Cocoa Mass, Whole Milk Powder, Skimmed Milk Powder, Hazelnuts, Lactose, Anhydrous Milk Fat, Emulsifier (Soy Lecithin), Barley Malt Extract, Vanilla, Flavourings.",
     {"calories": 622, "totalFat": 48.0, "saturatedFat": 35.0, "transFat": 0.1, "carbohydrates": 42.0, "sugars": 40.0, "addedSugars": 34.0, "fiber": 2.5, "protein": 5.2, "sodium": 75, "salt": 0.19},
     ["Milk", "Tree Nuts", "Soy", "Wheat"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (80, "Initial Catalogue", "Lindt", "Lindt Swiss Classic Milk", "Swiss Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Swiss Milk Chocolate Tablet", "Swiss Milk", "100g", 31, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Whole Milk Powder, Cocoa Mass, Lactose, Skimmed Milk Powder, Emulsifier (Soy Lecithin), Barley Malt Extract, Flavouring.",
     {"calories": 550, "totalFat": 32.0, "saturatedFat": 20.0, "transFat": 0.1, "carbohydrates": 57.0, "sugars": 56.0, "addedSugars": 47.0, "fiber": 2.0, "protein": 7.2, "sodium": 120, "salt": 0.3},
     ["Milk", "Soy", "Wheat"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (81, "Initial Catalogue", "Lindt", "Lindt Hazelnut Milk Chocolate", "Nut Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Whole Roasted Hazelnut Tablet", "Roasted Hazelnuts", "100g", 31, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Hazelnuts (15%), Whole Milk Powder, Cocoa Mass, Lactose, Skimmed Milk Powder, Emulsifier (Soy Lecithin), Barley Malt Extract, Flavouring.",
     {"calories": 570, "totalFat": 37.0, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 50.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 3.0, "protein": 8.5, "sodium": 105, "salt": 0.26},
     ["Milk", "Tree Nuts", "Soy", "Wheat"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (82, "Initial Catalogue", "Lindt", "Lindt Excellence Orange Intense", "Fruit Chocolate", "Lindt & Sprüngli AG", "France", "Dark Chocolate with Orange & Almonds", "Orange & Almond Slivers", "100g", 48, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Candied Orange (7%) (Orange Peel, Sugar, Glucose-Fructose Syrup, Acid (Citric Acid)), Almonds (7%), Cocoa Butter, Anhydrous Milk Fat, Emulsifier (Soy Lecithin), Natural Orange Flavouring, Vanilla.",
     {"calories": 535, "totalFat": 31.0, "saturatedFat": 17.0, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 48.0, "addedSugars": 42.0, "fiber": 7.0, "protein": 6.8, "sodium": 35, "salt": 0.09},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (83, "Initial Catalogue", "Lindt", "Lindt White Chocolate", "White Chocolate", "Lindt & Sprüngli AG", "Switzerland", "Pure White Chocolate Tablet", "Creamy Swiss White", "100g", 0, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Whole Milk Powder, Skimmed Milk Powder, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 565, "totalFat": 35.0, "saturatedFat": 22.0, "transFat": 0.1, "carbohydrates": 55.0, "sugars": 55.0, "addedSugars": 45.0, "fiber": 0.0, "protein": 7.5, "sodium": 140, "salt": 0.35},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # --- Other International Brands (84-92) ---
    (84, "Initial Catalogue", "Toblerone", "Toblerone Milk Chocolate", "Swiss Chocolate", "Mondelez International", "Switzerland", "Triangular Swiss Honey Almond Bar", "Honey & Almond Nougat", "100g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Honey (3.0%), Milk Fat, Almonds (1.6%), Emulsifier (Soy Lecithins), Egg White, Flavouring.",
     {"calories": 535, "totalFat": 29.5, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 60.5, "sugars": 59.5, "addedSugars": 49.0, "fiber": 2.2, "protein": 5.6, "sodium": 80, "salt": 0.2},
     ["Milk", "Tree Nuts", "Soy", "Eggs"], [], {"isVegetarian": False, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (85, "Initial Catalogue", "Toblerone", "Toblerone Dark Chocolate", "Swiss Chocolate", "Mondelez International", "Switzerland", "Dark Triangular Honey Almond Bar", "Dark Honey Nougat 50%", "100g", 50, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Milk Fat, Honey (3.0%), Almonds (1.6%), Cocoa Butter, Emulsifier (Soy Lecithins), Egg White.",
     {"calories": 535, "totalFat": 32.5, "saturatedFat": 19.0, "transFat": 0.0, "carbohydrates": 50.0, "sugars": 47.0, "addedSugars": 42.0, "fiber": 7.5, "protein": 6.0, "sodium": 40, "salt": 0.1},
     ["Milk", "Tree Nuts", "Soy", "Eggs"], [], {"isVegetarian": False, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (86, "Initial Catalogue", "Milka", "Milka Alpine Milk", "Swiss Chocolate", "Mondelez International", "Germany", "Alpine Milk Chocolate Bar", "100% Alpine Milk", "100g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Skimmed Milk Powder, Cocoa Mass, Sweet Whey Powder (from Milk), Milkfat, Hazelnut Paste, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 530, "totalFat": 29.0, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 59.0, "sugars": 58.0, "addedSugars": 48.0, "fiber": 1.8, "protein": 6.3, "sodium": 140, "salt": 0.35},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (87, "Initial Catalogue", "Milka", "Milka Oreo Chocolate", "Filled Chocolate", "Mondelez International", "Germany", "Alpine Milk with Oreo Filling", "Alpine Milk & Oreo Biscuit Bits", "100g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Palm Oil, Cocoa Butter, Skimmed Milk Powder, Wheat Flour, Sweet Whey Powder (from Milk), Cocoa Mass, Milkfat, Fat-Reduced Cocoa Powder (0.7%), Emulsifiers (Soy Lecithins), Glucose-Fructose Syrup, Wheat Starch, Hazelnut Paste, Raising Agents, Salt, Flavourings.",
     {"calories": 553, "totalFat": 34.0, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 56.0, "sugars": 49.0, "addedSugars": 41.0, "fiber": 1.5, "protein": 5.4, "sodium": 190, "salt": 0.48},
     ["Milk", "Wheat", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (88, "Initial Catalogue", "Ritter Sport", "Ritter Sport Whole Hazelnuts", "Nut Chocolate", "Alfred Ritter GmbH & Co. KG", "Germany", "Square Chocolate Bar", "Hand-picked Whole Hazelnuts", "100g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Hazelnuts (23%), Cocoa Butter, Cocoa Mass, Whole Milk Powder, Lactose, Skimmed Milk Powder, Butterfat, Emulsifier (Soya Lecithins).",
     {"calories": 575, "totalFat": 39.0, "saturatedFat": 15.0, "transFat": 0.1, "carbohydrates": 45.0, "sugars": 43.0, "addedSugars": 35.0, "fiber": 4.1, "protein": 8.7, "sodium": 50, "salt": 0.13},
     ["Milk", "Tree Nuts", "Soy"], ["Peanuts", "Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (89, "Initial Catalogue", "Ritter Sport", "Ritter Sport Marzipan", "Dark Chocolate", "Alfred Ritter GmbH & Co. KG", "Germany", "Filled Dark Chocolate Square", "California Marzipan", "100g", 50, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Almonds (16%), Cocoa Butter, Invert Sugar Syrup, Emulsifier (Soya Lecithins), Humectant (Invertase).",
     {"calories": 493, "totalFat": 28.0, "saturatedFat": 13.0, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 51.0, "addedSugars": 44.0, "fiber": 6.0, "protein": 6.3, "sodium": 20, "salt": 0.05},
     ["Tree Nuts", "Soy"], ["Peanuts", "Milk", "Wheat", "Eggs"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (90, "Initial Catalogue", "Godiva", "Godiva Milk Chocolate", "Belgian Chocolate", "Godiva Chocolatier", "Belgium", "Belgian Milk Chocolate Tablet", "Pure Belgian Milk", "90g", 31, "VERIFIED_AVAILABLE",
     "Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Milk Fat, Emulsifier (Soy Lecithin), Natural Vanilla Flavoring.",
     {"calories": 545, "totalFat": 32.5, "saturatedFat": 20.0, "transFat": 0.1, "carbohydrates": 55.5, "sugars": 54.0, "addedSugars": 45.0, "fiber": 2.2, "protein": 7.6, "sodium": 120, "salt": 0.3},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (91, "Initial Catalogue", "Reese's", "Reese's Peanut Butter Cups", "American Chocolate", "The Hershey Company", "USA", "Peanut Butter Cups", "Creamy Peanut Butter in Milk Chocolate", "42g (2 Cups)", 25, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Cocoa Butter, Chocolate, Skim Milk, Milk Fat, Lactose, Lecithin (Soy), PGPR), Peanuts, Sugar, Dextrose, Salt, TBHQ and Citric Acid (to maintain freshness).",
     {"calories": 509, "totalFat": 29.5, "saturatedFat": 10.8, "transFat": 0.1, "carbohydrates": 57.0, "sugars": 50.0, "addedSugars": 44.0, "fiber": 3.8, "protein": 11.2, "sodium": 360, "salt": 0.9},
     ["Milk", "Peanuts", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (92, "Initial Catalogue", "Loacker", "Loacker Chocolate Bar", "Wafer Chocolate", "Loacker AG", "Italy", "Filled Wafer Chocolate Bar", "Crispy Wafer Milk Chocolate", "55g", 30, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier Soy Lecithins), Crispy Wafers (Wheat Flour, Coconut Oil, Glucose Syrup, Sugar, Fat-Reduced Cocoa, Soy Flour, Whey Powder (Milk), Skimmed Milk Powder, Barley Malt Extract, Raising Agents, Salt).",
     {"calories": 535, "totalFat": 31.0, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 56.0, "sugars": 46.0, "addedSugars": 38.0, "fiber": 2.8, "protein": 8.0, "sodium": 150, "salt": 0.38},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # --- Premium Indian Chocolate Brands (93-100) ---
    (93, "Initial Catalogue", "Fabelle", "Fabelle Choco Deck", "Premium Chocolate", "ITC Limited", "India", "Layered Gourmet Chocolate Bar", "French Milk Chocolate with Choco Creme", "124g", 35, "VERIFIED_AVAILABLE",
     "Milk Chocolate (65%) (Cane Sugar, Cocoa Butter, Milk Solids, Cocoa Solids, Emulsifier (INS 322)), Choco Creme (35%) (Sugar, Hydrogenated Vegetable Fat, Cocoa Solids, Milk Solids, Emulsifier (INS 322), Vanilla).",
     {"calories": 560, "totalFat": 36.0, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 3.0, "protein": 7.2, "sodium": 110, "salt": 0.28},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (94, "Initial Catalogue", "Fabelle", "Fabelle Ganache", "Filled Chocolate", "ITC Limited", "India", "Soft Centered Chocolate Pralines", "Rich Dark Velvety Ganache", "100g", 60, "VERIFIED_AVAILABLE",
     "Dark Chocolate Shell (55%) (Cocoa Solids, Cane Sugar, Cocoa Butter, Emulsifier (INS 322)), Soft Ganache Filling (45%) (Cocoa Solids, Milk Solids, Butterfat, Glucose Syrup, Vanilla Extract).",
     {"calories": 570, "totalFat": 38.5, "saturatedFat": 23.5, "transFat": 0.1, "carbohydrates": 48.0, "sugars": 38.0, "addedSugars": 32.0, "fiber": 6.2, "protein": 6.5, "sodium": 45, "salt": 0.11},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (95, "Initial Catalogue", "SMOOR", "SMOOR Dark Chocolate Bar", "Artisan Chocolate", "Bliss Chocolates India Pvt Ltd", "India", "Artisanal Dark Chocolate Bar", "True Bar 70% Dark", "80g", 70, "VERIFIED_AVAILABLE",
     "Cocoa Solids (70%), Cocoa Butter, Sugar, Emulsifier (INS 322), Natural Vanilla Flavour.",
     {"calories": 565, "totalFat": 40.0, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 9.5, "protein": 8.5, "sodium": 20, "salt": 0.05},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (96, "Initial Catalogue", "SMOOR", "SMOOR Milk Chocolate Bar", "Artisan Chocolate", "Bliss Chocolates India Pvt Ltd", "India", "Artisanal Milk Chocolate Bar", "Creamy Biscuit Crunch", "80g", 34, "VERIFIED_AVAILABLE",
     "Sugar, Milk Solids (24%), Cocoa Butter, Cocoa Solids, Biscuit Crunch (8%) (Wheat Flour, Butter, Sugar, Salt), Emulsifier (INS 322), Natural Vanilla Extract.",
     {"calories": 548, "totalFat": 33.0, "saturatedFat": 20.0, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 48.0, "addedSugars": 39.0, "fiber": 2.2, "protein": 7.8, "sodium": 135, "salt": 0.34},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (97, "Initial Catalogue", "Paul & Mike", "Paul & Mike Dark Chocolate", "Indian Craft Chocolate", "Paul And Mike Farm to Bar", "India", "Farm to Bar Dark Chocolate", "68% Kerala Cocoa", "68g", 68, "VERIFIED_AVAILABLE",
     "Fine Flavour Cocoa Beans (68%), Muscovado Sugar, Cocoa Butter, Natural Sunflower Lecithin.",
     {"calories": 578, "totalFat": 42.0, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 26.0, "addedSugars": 25.0, "fiber": 10.2, "protein": 8.0, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (98, "Initial Catalogue", "Paul & Mike", "Paul & Mike Mango Chocolate", "Indian Craft Chocolate", "Paul And Mike Farm to Bar", "India", "Craft Fruit Chocolate Bar", "Alphonso Mango & 49% Milk Chocolate", "68g", 49, "VERIFIED_AVAILABLE",
     "Fine Flavour Cocoa Beans, Cocoa Butter, Milk Solids, Real Freeze-Dried Alphonso Mango (12%), Muscovado Sugar, Sunflower Lecithin.",
     {"calories": 554, "totalFat": 36.0, "saturatedFat": 21.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 40.0, "addedSugars": 30.0, "fiber": 4.5, "protein": 7.5, "sodium": 95, "salt": 0.24},
     ["Milk"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (99, "Initial Catalogue", "Mason & Co", "Mason & Co 70% Dark Chocolate", "Indian Craft Chocolate", "Mason & Co Bean to Bar", "India", "Organic Bean to Bar Tablet", "70% Single Origin Tamil Nadu", "70g", 70, "VERIFIED_AVAILABLE",
     "Organic Whole Cacao Beans (70%), Organic Whole Cane Sugar, Organic Cocoa Butter.",
     {"calories": 560, "totalFat": 39.5, "saturatedFat": 23.5, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 9.8, "protein": 8.2, "sodium": 12, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (100, "Initial Catalogue", "Pascati", "Pascati Organic Dark Chocolate", "Organic Chocolate", "Pascati Artisanal Bean to Bar", "India", "Fair Trade Certified Dark Bar", "72% Dark Organic Cacao", "75g", 72, "VERIFIED_AVAILABLE",
     "Organic Cocoa Mass (72%), Organic Cane Sugar, Organic Cocoa Butter.",
     {"calories": 570, "totalFat": 41.0, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 37.0, "sugars": 26.0, "addedSugars": 25.0, "fiber": 10.0, "protein": 8.0, "sodium": 10, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    # --- List 2: 101-150 Additional Chocolate Products ---
    # Galaxy (101-106)
    (101, "Additional Catalogue", "Galaxy", "Galaxy Caramel", "Caramel Chocolate", "Mars Wrigley Confectionery", "UK", "Caramel Filled Chocolate Bar", "Soft Flowing Caramel", "48g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Skimmed Milk Powder, Cocoa Butter, Milkfat, Cocoa Mass, Palm Fat, Lactose, Whey Powder (from Milk), Emulsifier (Soya Lecithin), Salt, Natural Vanilla Extract.",
     {"calories": 482, "totalFat": 22.8, "saturatedFat": 13.9, "transFat": 0.1, "carbohydrates": 64.2, "sugars": 56.5, "addedSugars": 48.0, "fiber": 1.2, "protein": 4.5, "sodium": 160, "salt": 0.4},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (102, "Additional Catalogue", "Galaxy", "Galaxy Ripple", "Milk Chocolate", "Mars Wrigley Confectionery", "UK", "Folded Ribbons Chocolate Bar", "Silky Ripple Folds", "33g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Skimmed Milk Powder, Cocoa Mass, Milkfat, Lactose and Protein from Whey (from Milk), Whey Powder (from Milk), Palm Fat, Emulsifiers (Soya Lecithin, E476), Natural Vanilla Extract.",
     {"calories": 535, "totalFat": 30.5, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 57.5, "sugars": 56.0, "addedSugars": 47.0, "fiber": 1.8, "protein": 7.0, "sodium": 130, "salt": 0.33},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (103, "Additional Catalogue", "Galaxy", "Galaxy Smooth Dark", "Dark Chocolate", "Mars Wrigley Confectionery", "UK", "Silky Dark Chocolate Tablet", "Smooth Dark 50%", "100g", 50, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Cocoa Butter, Milkfat, Emulsifier (Soya Lecithin), Natural Vanilla Extract.",
     {"calories": 530, "totalFat": 32.0, "saturatedFat": 19.5, "transFat": 0.0, "carbohydrates": 52.0, "sugars": 46.0, "addedSugars": 44.0, "fiber": 6.8, "protein": 6.0, "sodium": 35, "salt": 0.09},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (104, "Additional Catalogue", "Galaxy", "Galaxy Flutes", "Wafer Chocolate", "Mars Wrigley Confectionery", "Egypt", "Crispy Wafer Rolls in Chocolate", "Milk Cream Wafer Flutes", "22.5g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fat (Palm), Wheat Flour, Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Lactose, Milkfat, Fat-Reduced Cocoa, Emulsifier (Soya Lecithin), Salt, Natural Vanilla Extract.",
     {"calories": 515, "totalFat": 26.5, "saturatedFat": 15.5, "transFat": 0.1, "carbohydrates": 62.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 2.0, "protein": 6.5, "sodium": 145, "salt": 0.36},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (105, "Additional Catalogue", "Galaxy", "Galaxy Minstrels", "Milk Chocolate", "Mars Wrigley Confectionery", "UK", "Crisp Shell Milk Chocolate Drops", "Shell Coated Smooth Milk", "42g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Palm Fat, Milkfat, Lactose, Whey Powder (from Milk), Emulsifier (Soya Lecithin), Dextrin, Natural Colours (Curcumin, Anthocyanins, Carotenes), Glazing Agent (Carnauba Wax), Palm Kernel Oil, Vanilla Extract.",
     {"calories": 500, "totalFat": 22.0, "saturatedFat": 13.5, "transFat": 0.1, "carbohydrates": 68.0, "sugars": 67.0, "addedSugars": 58.0, "fiber": 1.9, "protein": 6.5, "sodium": 115, "salt": 0.29},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (106, "Additional Catalogue", "Galaxy", "Galaxy Fusions", "Premium Chocolate", "Mars Wrigley Confectionery", "UK", "Dark Chocolate with Blonde Chocolate", "Blonde Caramel & Dark", "100g", 54, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Cocoa Butter, Skimmed Milk Powder, Milkfat, Caramelised Milk Powder, Emulsifier (Soya Lecithin), Natural Vanilla Extract.",
     {"calories": 540, "totalFat": 34.5, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 49.0, "sugars": 42.0, "addedSugars": 38.0, "fiber": 5.8, "protein": 6.8, "sodium": 70, "salt": 0.18},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # Cadbury International (107-111)
    (107, "Additional Catalogue", "Cadbury", "Cadbury Dairy Milk Whole Nut", "British Chocolate", "Mondelez UK", "UK", "British Milk Chocolate with Hazelnuts", "Whole Roasted Hazelnuts", "120g", 24, "VERIFIED_AVAILABLE",
     "Milk, Sugar, Roasted Hazelnuts (16%), Cocoa Butter, Cocoa Mass, Vegetable Fats (Palm, Shea), Emulsifiers (E442, E476), Flavourings.",
     {"calories": 546, "totalFat": 34.0, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 49.5, "sugars": 48.0, "addedSugars": 38.0, "fiber": 3.5, "protein": 9.1, "sodium": 110, "salt": 0.28},
     ["Milk", "Tree Nuts"], ["Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (108, "Additional Catalogue", "Cadbury", "Cadbury Dairy Milk Caramel", "British Chocolate", "Mondelez UK", "UK", "Caramel Filled Milk Chocolate", "Soft Flowing Caramel", "120g", 24, "VERIFIED_AVAILABLE",
     "Milk, Sugar, Glucose Syrup, Cocoa Butter, Vegetable Fats (Palm, Shea), Glucose-Fructose Syrup, Cocoa Mass, Whey Powder (from Milk), Emulsifiers (E442, E471, E476), Salt, Flavourings, Sodium Carbonates.",
     {"calories": 486, "totalFat": 23.5, "saturatedFat": 13.5, "transFat": 0.1, "carbohydrates": 62.5, "sugars": 49.5, "addedSugars": 42.0, "fiber": 1.2, "protein": 4.8, "sodium": 160, "salt": 0.4},
     ["Milk"], ["Wheat", "Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (109, "Additional Catalogue", "Cadbury", "Cadbury Boost", "British Chocolate", "Mondelez UK", "UK", "Caramel Biscuit Energy Bar", "Caramel & Crisp Biscuit Center", "48.5g", 22, "VERIFIED_AVAILABLE",
     "Milk, Sugar, Palm Oil, Glucose Syrup, Dextrose, Dried Skimmed Milk, Cocoa Butter, Cocoa Mass, Wheat Flour (with Added Calcium, Iron, Niacin, Thiamin), Fat-Reduced Cocoa Powder, Humectant (Glycerol), Soluble Maize Fibre, Emulsifiers (E442, E471, E476), Flavourings, Salt, Thickener (Dried Cellulose), Raising Agents, Barley Malt Syrup.",
     {"calories": 512, "totalFat": 28.0, "saturatedFat": 16.0, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 48.0, "addedSugars": 40.0, "fiber": 2.8, "protein": 5.4, "sodium": 140, "salt": 0.35},
     ["Milk", "Wheat"], ["Tree Nuts", "Peanuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (110, "Additional Catalogue", "Cadbury", "Cadbury Wispa", "British Chocolate", "Mondelez UK", "UK", "Aerated Milk Chocolate Bar", "Velvety Bubbly Center", "36g", 24, "VERIFIED_AVAILABLE",
     "Milk, Sugar, Cocoa Butter, Cocoa Mass, Vegetable Fats (Palm, Shea), Emulsifier (E442), Flavourings.",
     {"calories": 554, "totalFat": 34.0, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 53.5, "addedSugars": 44.0, "fiber": 2.2, "protein": 7.0, "sodium": 120, "salt": 0.3},
     ["Milk"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (111, "Additional Catalogue", "Cadbury", "Cadbury Double Decker", "British Chocolate", "Mondelez UK", "UK", "Two Layered Candy Bar", "Crispy Cereal & Chewy Nougat", "54.5g", 22, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Glucose-Fructose Syrup, Vegetable Fats (Palm, Shea, Sunflower, Rapeseed), Wheat Flour, Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Whey Permeate Powder (from Milk), Fat-Reduced Cocoa Powder, Milk Fat, Emulsifiers, Anti-Caking Agent, Flavourings, Salt, Barley Malt Extract.",
     {"calories": 465, "totalFat": 18.0, "saturatedFat": 9.5, "transFat": 0.1, "carbohydrates": 70.0, "sugars": 54.0, "addedSugars": 46.0, "fiber": 1.9, "protein": 4.1, "sodium": 150, "salt": 0.38},
     ["Milk", "Wheat"], ["Tree Nuts", "Peanuts", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # Mars International (112-117)
    (112, "Additional Catalogue", "Mars", "Milky Way Original", "American Chocolate", "Mars Wrigley Confectionery", "USA", "Nougat Caramel Bar", "Chocolate Malt Nougat", "52g", 24, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Cocoa Butter, Skim Milk, Chocolate, Lactose, Milkfat, Soy Lecithin), Corn Syrup, Sugar, Palm Oil, Skim Milk, Less Than 2% - Milkfat, Cocoa Powder Processed with Alkali, Barley Malt Extract, Salt, Egg Whites, Artificial Flavor.",
     {"calories": 454, "totalFat": 16.5, "saturatedFat": 10.0, "transFat": 0.1, "carbohydrates": 71.5, "sugars": 61.5, "addedSugars": 53.0, "fiber": 1.2, "protein": 3.8, "sodium": 170, "salt": 0.43},
     ["Milk", "Soy", "Eggs", "Wheat"], ["Peanuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (113, "Additional Catalogue", "Mars", "Milky Way Midnight", "American Chocolate", "Mars Wrigley Confectionery", "USA", "Dark Chocolate Nougat Bar", "Golden Caramel & Vanilla Nougat in Dark Chocolate", "50g", 45, "VERIFIED_AVAILABLE",
     "Semisweet Chocolate (Sugar, Chocolate Processed with Alkali, Cocoa Butter, Milkfat, Soy Lecithin, Natural Flavor), Corn Syrup, Sugar, Palm Oil, Skim Milk, Less Than 1.5% - Milkfat, Salt, Egg Whites, Artificial Flavor.",
     {"calories": 450, "totalFat": 16.0, "saturatedFat": 9.8, "transFat": 0.0, "carbohydrates": 72.0, "sugars": 62.0, "addedSugars": 54.0, "fiber": 2.5, "protein": 3.2, "sodium": 150, "salt": 0.38},
     ["Milk", "Soy", "Eggs"], ["Peanuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (114, "Additional Catalogue", "Mars", "Mars Peanut Butter", "American Chocolate", "Mars Wrigley Confectionery", "USA", "Peanut Butter Caramel Bar", "Peanut Butter & Caramel in Milk Chocolate", "48g", 24, "VERIFIED_AVAILABLE",
     "Milk Chocolate (Sugar, Cocoa Butter, Chocolate, Skim Milk, Lactose, Milkfat, Soy Lecithin), Peanut Butter (Peanuts, Palm Oil), Corn Syrup, Sugar, Invert Sugar, Salt, Artificial Flavor.",
     {"calories": 515, "totalFat": 29.5, "saturatedFat": 13.0, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 44.0, "addedSugars": 38.0, "fiber": 3.5, "protein": 9.5, "sodium": 240, "salt": 0.6},
     ["Milk", "Peanuts", "Soy"], ["Tree Nuts", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (115, "Additional Catalogue", "Mars", "Mars Caramel", "Caramel Chocolate", "Mars Wrigley Confectionery", "UK", "Pure Caramel Filled Bar", "Smooth Caramel Filling", "45g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Cocoa Butter, Full Cream Milk Powder, Cocoa Mass, Sunflower Oil, Skimmed Milk Powder, Lactose, Whey Powder (from Milk), Fat Reduced Cocoa, Milkfat, Barley Malt Extract, Salt, Emulsifier (Soya Lecithin), Egg White Powder.",
     {"calories": 455, "totalFat": 18.0, "saturatedFat": 9.2, "transFat": 0.1, "carbohydrates": 68.0, "sugars": 61.0, "addedSugars": 52.0, "fiber": 1.2, "protein": 3.9, "sodium": 160, "salt": 0.4},
     ["Milk", "Soy", "Eggs", "Wheat"], ["Peanuts", "Tree Nuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (116, "Additional Catalogue", "Mars", "Topic Chocolate Bar", "British Chocolate", "Mars Wrigley Confectionery", "UK", "Hazelnut Nougat Caramel Bar", "Hazelnuts, Nougat & Caramel", "47g", 24, "VERIFIED_AVAILABLE",
     "Sugar, Glucose Syrup, Hazelnuts (14%), Skimmed Milk Powder, Cocoa Butter, Cocoa Mass, Sunflower Oil, Milkfat, Lactose, Whey Powder (from Milk), Barley Malt Extract, Salt, Emulsifier (Soya Lecithin), Egg White Powder.",
     {"calories": 485, "totalFat": 24.5, "saturatedFat": 8.5, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 49.0, "addedSugars": 41.0, "fiber": 2.8, "protein": 6.8, "sodium": 150, "salt": 0.38},
     ["Milk", "Tree Nuts", "Soy", "Eggs", "Wheat"], ["Peanuts"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (117, "Additional Catalogue", "Mars", "Galaxy Cookie Crumble", "Milk Chocolate", "Mars Wrigley Confectionery", "UK", "Milk Chocolate with Cookie Pieces", "Cocoa Cookie Crumb", "114g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Skimmed Milk Powder, Milkfat, Cocoa Mass, Lactose, Whey Powder (from Milk), Wheat Flour, Cocoa Powder, Emulsifier (Soya Lecithin), Palm Oil, Sunflower Oil, Glucose Syrup, Natural Colour (Vegetable Carbon), Salt, Raising Agent (E503, E500).",
     {"calories": 542, "totalFat": 32.0, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 56.5, "sugars": 52.0, "addedSugars": 44.0, "fiber": 2.0, "protein": 6.5, "sodium": 140, "salt": 0.35},
     ["Milk", "Wheat", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # Nestlé International (118-123)
    (118, "Additional Catalogue", "Nestlé", "Nestlé Aero Milk", "British Chocolate", "Nestlé UK", "UK", "Aerated Milk Chocolate Bar", "Feel the Bubbly Melt", "36g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Dried Whole Milk, Cocoa Mass, Cocoa Butter, Vegetable Fat (Palm/Shea/Illipe/Mango Kernel/Kokum Gurgi/Sal), Whey Powder (from Milk), Skimmed Milk Powder, Butterfat (from Milk), Emulsifier (Sunflower Lecithin), Natural Flavourings.",
     {"calories": 535, "totalFat": 30.5, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 57.0, "sugars": 56.0, "addedSugars": 46.0, "fiber": 2.0, "protein": 7.0, "sodium": 110, "salt": 0.28},
     ["Milk"], ["Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (119, "Additional Catalogue", "Nestlé", "Nestlé Aero Peppermint", "Filled Chocolate", "Nestlé UK", "UK", "Peppermint Aerated Bar", "Bubbly Peppermint Center in Milk Chocolate", "36g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fats (Palm, Shea, Sal), Dried Whole Milk, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Whey Powder (from Milk), Butterfat (from Milk), Emulsifier (Sunflower Lecithin), Natural Peppermint Oil, Natural Colours (Copper Complexes of Chlorophyllins, Curcumin).",
     {"calories": 532, "totalFat": 30.0, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 58.5, "sugars": 57.5, "addedSugars": 47.0, "fiber": 1.5, "protein": 6.2, "sodium": 115, "salt": 0.29},
     ["Milk"], ["Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (120, "Additional Catalogue", "Nestlé", "Nestlé Lion Bar", "Wafer Chocolate", "Nestlé France", "Poland", "Chewy Caramel & Cereal Wafer Bar", "Caramel & Wheat Cereal Crisp", "50g", 22, "VERIFIED_AVAILABLE",
     "Glucose-Fructose Syrup, Sugar, Wheat Flour, Sweetened Condensed Milk, Cocoa Butter, Whole Milk Powder, Cocoa Mass, Palm Oil, Crisp Cereals (5%) (Wheat Flour, Sugar, Wheat Starch, Raising Agent E500ii, Salt), Whey Powder (from Milk), Salt, Emulsifier (Sunflower Lecithin), Raising Agent (E500ii), Natural Vanilla Flavour.",
     {"calories": 486, "totalFat": 22.0, "saturatedFat": 11.5, "transFat": 0.1, "carbohydrates": 65.5, "sugars": 44.5, "addedSugars": 38.0, "fiber": 1.8, "protein": 5.8, "sodium": 200, "salt": 0.5},
     ["Wheat", "Milk"], ["Peanuts", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (121, "Additional Catalogue", "Nestlé", "Nestlé Yorkie Original", "British Chocolate", "Nestlé UK", "UK", "Solid Chunky Milk Chocolate Bar", "Solid Chunky Milk", "46g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Dried Whole Milk, Cocoa Butter, Cocoa Mass, Vegetable Fat (Palm/Shea/Illipe/Mango Kernel/Kokum Gurgi/Sal), Lactose and Proteins from Whey (from Milk), Whey Powder (from Milk), Butterfat (from Milk), Emulsifier (Sunflower Lecithin).",
     {"calories": 540, "totalFat": 31.0, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 58.0, "sugars": 56.5, "addedSugars": 47.0, "fiber": 2.2, "protein": 6.8, "sodium": 125, "salt": 0.31},
     ["Milk"], ["Wheat", "Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (122, "Additional Catalogue", "Nestlé", "Nestlé Drifter", "British Chocolate", "Nestlé UK", "UK", "Chewy Caramel Wafer Bar", "Caramel Coated Wafers", "45g", 24, "VERIFIED_DISCONTINUED",
     "Sugar, Glucose Syrup, Wheat Flour, Vegetable Fat (Palm/Shea/Sal), Sweetened Condensed Skimmed Milk, Cocoa Butter, Dried Whole Milk, Cocoa Mass, Dried Whey (from Milk), Emulsifiers (Sunflower Lecithin, E471), Salt, Raising Agent (Sodium Bicarbonate), Flavourings.",
     {"calories": 480, "totalFat": 21.0, "saturatedFat": 11.5, "transFat": 0.1, "carbohydrates": 67.0, "sugars": 48.0, "addedSugars": 42.0, "fiber": 1.5, "protein": 5.0, "sodium": 180, "salt": 0.45},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (123, "Additional Catalogue", "Nestlé", "Nestlé Toffee Crisp", "British Chocolate", "Nestlé UK", "UK", "Crispy Cereal Toffee Bar", "Crispy Cereal & Toffee in Chocolate", "38g", 22, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fat (Palm/Shea/Illipe/Mango Kernel/Sal), Glucose Syrup, Rice Flour, Sweetened Condensed Milk, Cocoa Butter, Dried Whole Milk, Cocoa Mass, Invert Sugar Syrup, Wheat Flour, Whey Powder (from Milk), Emulsifiers (Sunflower Lecithin, E471), Salt, Barley Malt Extract, Flavouring.",
     {"calories": 510, "totalFat": 26.5, "saturatedFat": 14.5, "transFat": 0.1, "carbohydrates": 62.0, "sugars": 48.5, "addedSugars": 41.0, "fiber": 1.6, "protein": 4.8, "sodium": 150, "salt": 0.38},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # Ferrero & Kinder International (124-128)
    (124, "Additional Catalogue", "Kinder", "Kinder Bueno White", "White Chocolate", "Ferrero SpA", "Italy", "White Hazelnut Wafer Bar", "Hazelnut Cream in White Chocolate", "39g", 28, "VERIFIED_AVAILABLE",
     "White Chocolate (28%) (Cocoa Butter, Sugar, Skimmed Milk Powder, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Palm Oil, Wheat Flour, Skimmed Milk Powder, Milk Powder, Hazelnuts (5%), Whey Powder (Milk), Wheat Starch, Fat-Reduced Cocoa, Sunflower Oil, Emulsifier: Lecithins (Soy), Salt, Vanillin.",
     {"calories": 571, "totalFat": 35.9, "saturatedFat": 16.8, "transFat": 0.1, "carbohydrates": 53.0, "sugars": 43.9, "addedSugars": 36.0, "fiber": 1.5, "protein": 8.5, "sodium": 120, "salt": 0.3},
     ["Milk", "Wheat", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (125, "Additional Catalogue", "Kinder", "Kinder Maxi", "Milk Chocolate", "Ferrero SpA", "Germany", "Extra Large Milk Bar", "Extra Milky Cream Center", "21g", 33, "VERIFIED_AVAILABLE",
     "Fine Milk Chocolate (40%) (Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Skimmed Milk Powder (18%), Palm Oil, Anhydrous Milkfat, Emulsifier: Lecithins (Soy), Vanillin.",
     {"calories": 566, "totalFat": 35.0, "saturatedFat": 22.6, "transFat": 0.1, "carbohydrates": 53.5, "sugars": 53.3, "addedSugars": 45.0, "fiber": 0.9, "protein": 8.7, "sodium": 125, "salt": 0.31},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (126, "Additional Catalogue", "Kinder", "Kinder Delice", "Filled Chocolate", "Ferrero SpA", "Italy", "Chocolate Coated Sponge Cake", "Milk Cream Cocoa Sponge", "39g", 25, "VERIFIED_AVAILABLE",
     "Sugar, Vegetable Fats (Palm, Shea, Sal), Glucose-Fructose Syrup, Humectant (Glycerol), Rehydrated Milk Powder (7%), Wheat Flour, Skimmed Milk Powder (5.5%), Dextrose, Fat-Reduced Cocoa (3%), Cocoa (2.5%), Eggs, Whey Powder (Milk), Anhydrous Milkfat, Emulsifiers, Flavourings, Salt.",
     {"calories": 455, "totalFat": 27.9, "saturatedFat": 16.5, "transFat": 0.1, "carbohydrates": 46.2, "sugars": 35.8, "addedSugars": 30.0, "fiber": 2.2, "protein": 5.4, "sodium": 140, "salt": 0.35},
     ["Milk", "Wheat", "Eggs", "Soy"], [], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (127, "Additional Catalogue", "Kinder", "Kinder Pingui", "Filled Chocolate", "Ferrero SpA", "Germany", "Chilled Cocoa Sponge Cake", "Crisp Dark Chocolate Coating & Fresh Milk", "30g", 24, "VERIFIED_AVAILABLE",
     "Pasteurised Milk (24%), Chocolate (22%) (Sugar, Cocoa Mass, Cocoa Butter, Emulsifier: Lecithins (Soy), Vanillin), Sugar, Palm Oil, Skimmed Milk Powder (9.5%), Wheat Flour, Cocoa Butter, Anhydrous Milkfat, Dextrose, Cocoa Powder, Egg Powder, Yeast, Flavourings.",
     {"calories": 450, "totalFat": 29.7, "saturatedFat": 19.8, "transFat": 0.1, "carbohydrates": 37.8, "sugars": 33.1, "addedSugars": 28.0, "fiber": 1.8, "protein": 7.0, "sodium": 130, "salt": 0.33},
     ["Milk", "Wheat", "Eggs", "Soy"], [], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (128, "Additional Catalogue", "Ferrero", "Ferrero Pocket Coffee", "Italian Chocolate", "Ferrero SpA", "Italy", "Liquid Espresso Filled Chocolate", "Real 100% Arabica Espresso Liquid Center", "62.5g (5 Pcs)", 45, "VERIFIED_AVAILABLE",
     "Liquid Espresso Coffee (54%) (Sugar, Liquid Espresso Coffee), Dark Chocolate (23%) (Cocoa Mass, Sugar, Cocoa Butter, Coffee Extract, Emulsifier: Lecithins (Soy), Vanillin), Fine Milk Chocolate (14.5%) (Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Coffee Extract, Emulsifier: Lecithins (Soy), Vanillin), Cocoa Butter, Cocoa Mass, Lactose, Sugar, Coffee Extract, Emulsifier: Lecithins (Soy), Vanillin.",
     {"calories": 440, "totalFat": 20.5, "saturatedFat": 13.0, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 56.5, "addedSugars": 48.0, "fiber": 4.5, "protein": 3.5, "sodium": 35, "salt": 0.09},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # Premium International Chocolates (129-136)
    (129, "Additional Catalogue", "Ghirardelli", "Ghirardelli Intense Dark 72%", "Dark Chocolate", "Ghirardelli Chocolate Company", "USA", "San Francisco Dark Chocolate Tablet", "72% Cacao Twilight Delight", "100g", 72, "VERIFIED_AVAILABLE",
     "Unsweetened Chocolate, Sugar, Cocoa Butter, Vanilla Extract, Soy Lecithin.",
     {"calories": 560, "totalFat": 42.0, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 40.0, "sugars": 28.0, "addedSugars": 26.0, "fiber": 10.0, "protein": 8.0, "sodium": 15, "salt": 0.04},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (130, "Additional Catalogue", "Ghirardelli", "Ghirardelli Caramel Squares", "Caramel Chocolate", "Ghirardelli Chocolate Company", "USA", "Caramel Filled Squares", "Luscious Caramel & Milk Chocolate", "150g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Whole Milk Powder, Cocoa Butter, Corn Syrup, Unsweetened Chocolate, Sweetened Condensed Milk, Palm Oil, Water, Butter, Natural Flavor, Soy Lecithin, Salt, Disodium Phosphate, Vanilla Extract.",
     {"calories": 485, "totalFat": 26.0, "saturatedFat": 16.0, "transFat": 0.1, "carbohydrates": 60.0, "sugars": 54.0, "addedSugars": 46.0, "fiber": 1.5, "protein": 5.5, "sodium": 160, "salt": 0.4},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (131, "Additional Catalogue", "Guylian", "Guylian Original Sea Shells", "Belgian Chocolate", "Chocolaterie Guylian NV", "Belgium", "Belgian Chocolate Pralines", "Hazelnut Praline Marbled Shells", "250g", 34, "VERIFIED_AVAILABLE",
     "Sugar, Hazelnuts (23%), Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier: Sunflower Lecithin, Natural Vanilla Flavouring.",
     {"calories": 553, "totalFat": 35.0, "saturatedFat": 14.0, "transFat": 0.1, "carbohydrates": 50.0, "sugars": 49.0, "addedSugars": 42.0, "fiber": 3.8, "protein": 8.3, "sodium": 50, "salt": 0.13},
     ["Milk", "Tree Nuts"], ["Soy", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (132, "Additional Catalogue", "Guylian", "Guylian Dark Sea Shells", "Belgian Chocolate", "Chocolaterie Guylian NV", "Belgium", "Dark Belgian Pralines", "72% Dark Hazelnut Praline", "225g", 72, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Hazelnuts (18%), Fat-Reduced Cocoa Powder, Cocoa Butter, Anhydrous Milk Fat, Emulsifier: Sunflower Lecithin, Natural Vanilla Flavouring.",
     {"calories": 548, "totalFat": 38.0, "saturatedFat": 18.0, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 32.0, "addedSugars": 28.0, "fiber": 9.5, "protein": 8.0, "sodium": 25, "salt": 0.06},
     ["Milk", "Tree Nuts"], ["Soy", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (133, "Additional Catalogue", "Venchi", "Venchi Cremino", "Italian Chocolate", "Venchi S.p.A.", "Italy", "Layered Gianduja Praline", "1878 Piedmont Hazelnut Cremino", "110g", 36, "VERIFIED_AVAILABLE",
     "Sugar, Piedmont Hazelnut Paste (33%), Cocoa Butter, Whole Milk Powder, Cocoa Mass, Whey Powder (from Milk), Anhydrous Milk Fat, Emulsifier: Soy Lecithin, Natural Vanilla Flavor.",
     {"calories": 594, "totalFat": 42.5, "saturatedFat": 16.8, "transFat": 0.0, "carbohydrates": 41.5, "sugars": 39.5, "addedSugars": 32.0, "fiber": 4.5, "protein": 8.8, "sodium": 60, "salt": 0.15},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (134, "Additional Catalogue", "Venchi", "Venchi Gianduja", "Italian Chocolate", "Venchi S.p.A.", "Italy", "Turin Gianduiotto Chocolate", "Piedmont Hazelnuts & Cocoa", "100g", 32, "VERIFIED_AVAILABLE",
     "Piedmont Hazelnut Paste (33%), Sugar, Cocoa Mass, Cocoa Butter, Whole Milk Powder, Emulsifier: Soy Lecithin, Natural Vanilla Flavor.",
     {"calories": 585, "totalFat": 41.0, "saturatedFat": 15.5, "transFat": 0.0, "carbohydrates": 43.0, "sugars": 38.5, "addedSugars": 30.0, "fiber": 5.2, "protein": 9.0, "sodium": 45, "salt": 0.11},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (135, "Additional Catalogue", "Neuhaus", "Neuhaus Belgian Pralines", "Belgian Chocolate", "Neuhaus NV", "Belgium", "Luxury Belgian Praline Gift Box", "Assorted Pralines & Ganaches", "250g", 40, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Hazelnuts, Butter (Milk), Glucose Syrup, Almonds, Cream (Milk), Coconut Fat, Humectant (Glycerol), Emulsifier: Soy Lecithin, Natural Flavours, Salt.",
     {"calories": 535, "totalFat": 34.5, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 48.0, "sugars": 45.0, "addedSugars": 38.0, "fiber": 4.8, "protein": 6.8, "sodium": 80, "salt": 0.2},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (136, "Additional Catalogue", "Leonidas", "Leonidas Manon Café", "Belgian Chocolate", "Confiserie Leonidas S.A.", "Belgium", "White Chocolate Coffee Praline", "Coffee Buttercream & Whole Hazelnut", "150g", 28, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Butter, Whole Milk Powder, Butter (Milk), Hazelnuts, Glucose Syrup, Cocoa Mass, Coffee (0.8%), Emulsifier: Soya Lecithin, Natural Flavouring.",
     {"calories": 542, "totalFat": 36.0, "saturatedFat": 20.5, "transFat": 0.1, "carbohydrates": 49.0, "sugars": 47.0, "addedSugars": 39.0, "fiber": 1.8, "protein": 5.8, "sodium": 95, "salt": 0.24},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # Specialty & Artisan Chocolates (137-143)
    (137, "Additional Catalogue", "Tony's Chocolonely", "Tony's Chocolonely Milk Chocolate", "Specialty Chocolate", "Tony's Chocolonely", "Netherlands", "Fairtrade Ethical Chocolate Bar", "32% Belgian Milk Chocolate", "180g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Dried Whole Milk, Cocoa Butter, Cocoa Mass, Emulsifier: Soy Lecithin.",
     {"calories": 545, "totalFat": 33.2, "saturatedFat": 20.0, "transFat": 0.1, "carbohydrates": 51.9, "sugars": 50.7, "addedSugars": 42.0, "fiber": 2.8, "protein": 7.7, "sodium": 80, "salt": 0.21},
     ["Milk", "Soy"], ["Tree Nuts", "Peanuts", "Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (138, "Additional Catalogue", "Tony's Chocolonely", "Tony's Chocolonely Dark Almond Sea Salt", "Specialty Chocolate", "Tony's Chocolonely", "Netherlands", "Ethical Dark Bar", "51% Dark Chocolate with Almonds & Sea Salt", "180g", 51, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Almonds (10%), Cocoa Butter, Sea Salt (0.5%), Emulsifier: Soy Lecithin.",
     {"calories": 543, "totalFat": 36.0, "saturatedFat": 18.0, "transFat": 0.0, "carbohydrates": 41.0, "sugars": 38.0, "addedSugars": 35.0, "fiber": 8.5, "protein": 8.0, "sodium": 200, "salt": 0.5},
     ["Tree Nuts", "Soy"], ["Milk", "Peanuts", "Wheat", "Eggs"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (139, "Additional Catalogue", "Valrhona", "Valrhona Guanaja 70%", "French Chocolate", "Valrhona SAS", "France", "Grand Cru Dark Chocolate Bar", "70% Grand Cru Blend", "70g", 70, "VERIFIED_AVAILABLE",
     "Cocoa Beans (70%), Sugar, Cocoa Butter, Emulsifier: Sunflower Lecithin, Natural Vanilla Extract.",
     {"calories": 570, "totalFat": 42.0, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 34.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 11.0, "protein": 8.5, "sodium": 10, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (140, "Additional Catalogue", "Valrhona", "Valrhona Jivara 40%", "French Chocolate", "Valrhona SAS", "France", "Grand Cru Milk Chocolate Bar", "40% Creamy Cocoa & Malt", "70g", 40, "VERIFIED_AVAILABLE",
     "Cocoa Butter, Whole Milk Powder, Sugar, Cocoa Beans, Brown Sugar, Natural Vanilla Extract, Emulsifier: Sunflower Lecithin, Barley Malt Extract.",
     {"calories": 575, "totalFat": 40.0, "saturatedFat": 24.0, "transFat": 0.1, "carbohydrates": 45.0, "sugars": 44.0, "addedSugars": 36.0, "fiber": 3.0, "protein": 8.0, "sodium": 80, "salt": 0.2},
     ["Milk", "Wheat"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (141, "Additional Catalogue", "Green & Black's", "Green & Black's Organic Milk Chocolate", "Organic Chocolate", "Green & Black's", "UK", "Organic Fairtrade Milk Bar", "37% Cocoa Organic Milk", "100g", 37, "VERIFIED_AVAILABLE",
     "Organic Raw Cane Sugar, Organic Whole Milk Powder, Organic Cocoa Mass, Organic Cocoa Butter, Emulsifier (Organic Soya Lecithin), Organic Vanilla Extract.",
     {"calories": 555, "totalFat": 35.0, "saturatedFat": 21.5, "transFat": 0.1, "carbohydrates": 50.0, "sugars": 49.0, "addedSugars": 40.0, "fiber": 2.5, "protein": 8.5, "sodium": 95, "salt": 0.24},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (142, "Additional Catalogue", "Green & Black's", "Green & Black's Organic Dark Chocolate", "Organic Chocolate", "Green & Black's", "UK", "Organic Intense Dark Chocolate", "85% Cocoa Trinitario Beans", "100g", 85, "VERIFIED_AVAILABLE",
     "Organic Cocoa Mass (85%), Organic Cocoa Butter, Organic Fat-Reduced Cocoa Powder, Organic Raw Cane Sugar, Organic Vanilla Extract.",
     {"calories": 630, "totalFat": 53.5, "saturatedFat": 32.5, "transFat": 0.0, "carbohydrates": 20.0, "sugars": 13.5, "addedSugars": 13.0, "fiber": 12.5, "protein": 10.5, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (143, "Additional Catalogue", "Hotel Chocolat", "Hotel Chocolat Salted Caramel Chocolate", "British Chocolate", "Hotel Chocolat Group", "UK", "Luxury Salted Caramel Slab", "40% Milk with Gooey Sea Salt Caramel", "100g", 40, "VERIFIED_AVAILABLE",
     "Cocoa Solids (40%), Cocoa Butter, Whole Milk Powder, Sugar, Caramel (Sugar, Glucose Syrup, Butter (Milk), Cream (Milk), Water, Sea Salt), Emulsifier (Soya Lecithin), Flavouring.",
     {"calories": 545, "totalFat": 34.0, "saturatedFat": 20.5, "transFat": 0.1, "carbohydrates": 51.0, "sugars": 48.0, "addedSugars": 40.0, "fiber": 3.0, "protein": 7.2, "sodium": 190, "salt": 0.48},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    # Indian Premium & Craft (144-150)
    (144, "Additional Catalogue", "Manam", "Manam 70% Dark Chocolate", "Indian Craft Chocolate", "Manam Chocolate Kakinada", "India", "Single Origin Andhra Farm Tablet", "West Godavari 70% Dark", "80g", 70, "VERIFIED_AVAILABLE",
     "Fine Flavour West Godavari Cacao (70%), Organic Cane Sugar, Cocoa Butter.",
     {"calories": 572, "totalFat": 41.5, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 37.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 9.8, "protein": 8.0, "sodium": 12, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (145, "Additional Catalogue", "Manam", "Manam Milk Chocolate", "Indian Craft Chocolate", "Manam Chocolate Kakinada", "India", "Craft Whole Milk Tablet", "45% Indian Cacao Single Estate", "80g", 45, "VERIFIED_AVAILABLE",
     "Indian Cacao Beans (45%), A2 Cow Milk Powder, Cocoa Butter, Unrefined Cane Sugar.",
     {"calories": 560, "totalFat": 36.5, "saturatedFat": 22.0, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 42.0, "addedSugars": 32.0, "fiber": 4.0, "protein": 8.5, "sodium": 90, "salt": 0.23},
     ["Milk"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (146, "Additional Catalogue", "Soklet", "Soklet 70% Dark Chocolate", "Indian Craft Chocolate", "Annamalai Cacao Pvt Ltd", "India", "Tree to Bar Indian Dark Chocolate", "70% Single Origin Pollachi", "70g", 70, "VERIFIED_AVAILABLE",
     "Estate Grown Cacao Beans (70%), Cane Sugar, Cocoa Butter.",
     {"calories": 568, "totalFat": 40.5, "saturatedFat": 24.0, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 27.5, "addedSugars": 26.5, "fiber": 10.0, "protein": 8.2, "sodium": 15, "salt": 0.04},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (147, "Additional Catalogue", "Soklet", "Soklet Milk Chocolate", "Indian Craft Chocolate", "Annamalai Cacao Pvt Ltd", "India", "Tree to Bar Indian Milk Chocolate", "55% Dark Milk Chocolate", "70g", 55, "VERIFIED_AVAILABLE",
     "Estate Grown Cacao Beans (55%), Organic Cane Sugar, Whole Milk Powder, Cocoa Butter.",
     {"calories": 558, "totalFat": 37.0, "saturatedFat": 22.5, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 38.0, "addedSugars": 28.0, "fiber": 5.2, "protein": 9.0, "sodium": 85, "salt": 0.21},
     ["Milk"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (148, "Additional Catalogue", "Mason & Co", "Mason & Co 85% Dark Chocolate", "Indian Craft Chocolate", "Mason & Co Bean to Bar", "India", "Intense Organic Dark Tablet", "85% Intense Cacao", "70g", 85, "VERIFIED_AVAILABLE",
     "Organic Whole Cacao Beans (85%), Organic Whole Cane Sugar, Organic Cocoa Butter.",
     {"calories": 595, "totalFat": 48.0, "saturatedFat": 29.0, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 13.0, "addedSugars": 12.0, "fiber": 13.5, "protein": 10.2, "sodium": 10, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (149, "Additional Catalogue", "Pascati", "Pascati 75% Dark Chocolate", "Indian Craft Chocolate", "Pascati Artisanal Bean to Bar", "India", "Single Origin Dark Chocolate", "75% Malabar Cocoa", "75g", 75, "VERIFIED_AVAILABLE",
     "Organic Cocoa Beans (75%), Organic Cane Sugar, Organic Cocoa Butter.",
     {"calories": 575, "totalFat": 42.0, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 23.0, "addedSugars": 22.0, "fiber": 10.5, "protein": 8.5, "sodium": 10, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (150, "Additional Catalogue", "Naviluna", "Naviluna Dark Chocolate", "Indian Craft Chocolate", "Naviluna Artisan Chocolatier Mysore", "India", "Artisanal Craft Tablet", "72% Malabar Forest Cacao", "60g", 72, "VERIFIED_AVAILABLE",
     "Organically Certified Malabar Cacao (72%), Unrefined Khandsari Sugar, Cacao Butter.",
     {"calories": 565, "totalFat": 41.0, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 36.5, "sugars": 26.0, "addedSugars": 25.0, "fiber": 10.0, "protein": 8.1, "sodium": 12, "salt": 0.03},
     [], ["Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    # --- List 3: 151-200 Premium Worldwide Chocolate Collection ---
    # Ultra-luxury and rare cacao (151-160)
    (151, "Premium Worldwide Collection", "To'ak", "To'ak Vintage Edition Dark Chocolate", "Luxury Chocolate", "To'ak Chocolate", "Ecuador", "Aged Vintage Single Origin Tablet", "100% Ancient Nacional Cacao 78%", "50g", 78, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Ecuadorian Heirloom Nacional Cacao Beans (78%), Cane Sugar, Cacao Butter.",
     {"calories": 580, "totalFat": 44.0, "saturatedFat": 26.5, "transFat": 0.0, "carbohydrates": 34.0, "sugars": 21.0, "addedSugars": 20.0, "fiber": 11.5, "protein": 8.8, "sodium": 10, "salt": 0.03},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (152, "Premium Worldwide Collection", "To'ak", "To'ak Art Series Guayasamín", "Luxury Chocolate", "To'ak Chocolate", "Ecuador", "Art Edition Single Origin Dark", "Piedra de Plata 77% Dark", "50g", 77, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Organic Nacional Cacao Beans (77%), Organic Cane Sugar, Cacao Butter.",
     {"calories": 578, "totalFat": 43.5, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 22.0, "addedSugars": 21.0, "fiber": 11.0, "protein": 8.5, "sodium": 10, "salt": 0.03},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (153, "Premium Worldwide Collection", "Amedei", "Amedei Porcelana", "Luxury Chocolate", "Amedei Tuscany", "Italy", "Pure White Criollo Dark Chocolate", "Porcelana Criollo 70%", "50g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass (Porcelana Variety), Cane Sugar, Cocoa Butter, Vanilla.",
     {"calories": 570, "totalFat": 41.5, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 10.0, "protein": 8.2, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (154, "Premium Worldwide Collection", "Amedei", "Amedei Chuao", "Luxury Chocolate", "Amedei Tuscany", "Italy", "Rare Venezuelan Criollo Dark", "Chuao Village Cacao 70%", "50g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Chuao Cocoa Mass (70%), Cane Sugar, Cocoa Butter, Vanilla.",
     {"calories": 572, "totalFat": 42.0, "saturatedFat": 25.5, "transFat": 0.0, "carbohydrates": 35.5, "sugars": 27.5, "addedSugars": 26.5, "fiber": 10.2, "protein": 8.4, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (155, "Premium Worldwide Collection", "Amedei", "Amedei Toscano Black", "Luxury Chocolate", "Amedei Tuscany", "Italy", "Tuscan Extra Dark Chocolate", "70% Extra Dark Blend", "50g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass, Cane Sugar, Cocoa Butter, Vanilla.",
     {"calories": 568, "totalFat": 41.0, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 37.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 9.8, "protein": 8.0, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (156, "Premium Worldwide Collection", "Domori", "Domori Criollo 70%", "Luxury Chocolate", "Domori S.p.A.", "Italy", "Single Variety Criollo Dark", "100% Pure Criollo 70%", "50g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Criollo Cocoa Paste (70%), Cane Sugar.",
     {"calories": 580, "totalFat": 43.0, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 34.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 10.5, "protein": 8.6, "sodium": 12, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (157, "Premium Worldwide Collection", "Domori", "Domori Puertofino", "Luxury Chocolate", "Domori S.p.A.", "Italy", "Criollo Single Origin Bar", "Puertofino Criollo 70%", "50g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Puertofino Criollo Cocoa Paste (70%), Cane Sugar.",
     {"calories": 578, "totalFat": 42.5, "saturatedFat": 25.8, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 10.2, "protein": 8.5, "sodium": 12, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (158, "Premium Worldwide Collection", "François Pralus", "François Pralus Le 100%", "French Chocolate", "Chocolaterie Pralus", "France", "Zero Sugar 100% Pure Criollo", "100% Pure Cocoa Criollo", "100g", 100, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "100% Selected Cocoa (Cocoa Mass, Cocoa Butter).",
     {"calories": 610, "totalFat": 54.0, "saturatedFat": 33.5, "transFat": 0.0, "carbohydrates": 10.0, "sugars": 0.5, "addedSugars": 0.0, "fiber": 18.0, "protein": 12.0, "sodium": 10, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": True, "isOrganic": False}),

    (159, "Premium Worldwide Collection", "Bonnat", "Chocolat Bonnat Madagascar", "French Chocolate", "Chocolat Bonnat Voiron", "France", "Single Origin Historical Dark", "75% Madagascar Grand Cru", "100g", 75, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Madagascar Cocoa (75%), Cocoa Butter, Sugar.",
     {"calories": 585, "totalFat": 43.5, "saturatedFat": 26.5, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 24.0, "addedSugars": 23.0, "fiber": 10.8, "protein": 8.5, "sodium": 12, "salt": 0.03},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (160, "Premium Worldwide Collection", "Original Beans", "Original Beans Cru Virunga", "Organic Chocolate", "Original Beans", "Netherlands", "Direct-Trade Conservation Dark", "70% Rare Congo Dark", "70g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Direct-Trade Cacao Mass (70%), Raw Cane Sugar, Cacao Butter.",
     {"calories": 575, "totalFat": 42.0, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 10.5, "protein": 8.2, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    # Luxury European chocolatiers (161-170)
    (161, "Premium Worldwide Collection", "Pierre Marcolini", "Pierre Marcolini Grand Cru Collection", "Luxury Chocolate", "Maison Pierre Marcolini", "Belgium", "Haute Chocolaterie Grand Cru Tablet", "Grand Cru Rare Beans 78%", "80g", 78, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Beans, Sugar, Cocoa Butter, Emulsifier: Sunflower Lecithin, Vanilla Pods.",
     {"calories": 565, "totalFat": 43.0, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 33.0, "sugars": 21.0, "addedSugars": 20.0, "fiber": 11.0, "protein": 8.5, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (162, "Premium Worldwide Collection", "Pierre Marcolini", "Pierre Marcolini Assorted Bonbons", "Chocolate Pralines", "Maison Pierre Marcolini", "Belgium", "Luxury Belgian Bonbon Collection", "Grand Cru Ganaches & Pralines", "200g", 50, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Beans, Sugar, Cream (Milk), Butter (Milk), Cocoa Butter, Hazelnuts, Almonds, Pistachios, Fruit Purees, Invert Sugar, Emulsifier: Sunflower Lecithin, Vanilla.",
     {"calories": 520, "totalFat": 35.0, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 44.0, "sugars": 40.0, "addedSugars": 32.0, "fiber": 5.0, "protein": 6.8, "sodium": 65, "salt": 0.16},
     ["Milk", "Tree Nuts"], ["Soy", "Gluten"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (163, "Premium Worldwide Collection", "La Maison du Chocolat", "La Maison du Chocolat Ganache Collection", "French Chocolate", "La Maison du Chocolat Paris", "France", "Parisian Artisanal Ganache Box", "Pure Origin Silky Ganaches", "180g", 60, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Paste, Sugar, Cocoa Butter, Emulsifier (Soy Lecithin), Vanilla Natural Flavouring), Cream (Milk), Butter (Milk), Sugar, Sweetener (Sorbitol), Invert Sugar.",
     {"calories": 510, "totalFat": 36.0, "saturatedFat": 22.0, "transFat": 0.1, "carbohydrates": 38.0, "sugars": 34.0, "addedSugars": 28.0, "fiber": 5.5, "protein": 6.0, "sodium": 50, "salt": 0.13},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (164, "Premium Worldwide Collection", "La Maison du Chocolat", "La Maison du Chocolat Truffles", "Chocolate Truffles", "La Maison du Chocolat Paris", "France", "Whipped Chocolate Truffles", "Plain Whipped Dark Ganache in Cocoa Dust", "145g", 65, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Paste, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin), Cream (Milk), Cocoa Powder, Butter (Milk), Invert Sugar, Vanilla Extract.",
     {"calories": 525, "totalFat": 38.0, "saturatedFat": 23.5, "transFat": 0.1, "carbohydrates": 36.0, "sugars": 30.0, "addedSugars": 25.0, "fiber": 6.2, "protein": 6.5, "sodium": 40, "salt": 0.1},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (165, "Premium Worldwide Collection", "Neuhaus", "Neuhaus Belgian Praline Collection", "Belgian Chocolate", "Neuhaus NV", "Belgium", "Belgian Heritage Praline Box", "Ballotin Handcrafted Pralines", "250g", 42, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Roasted Hazelnuts, Butter (Milk), Cream (Milk), Almonds, Glucose Syrup, Humectant (Glycerol), Emulsifier: Soy Lecithin, Natural Vanilla.",
     {"calories": 538, "totalFat": 35.0, "saturatedFat": 19.8, "transFat": 0.1, "carbohydrates": 47.5, "sugars": 44.5, "addedSugars": 37.0, "fiber": 4.5, "protein": 7.0, "sodium": 75, "salt": 0.19},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (166, "Premium Worldwide Collection", "Neuhaus", "Neuhaus Cornet Doré", "Belgian Chocolate", "Neuhaus NV", "Belgium", "Gianduja Chocolate Cone", "Golden Wrapped Gianduja", "150g", 35, "VERIFIED_AVAILABLE",
     "Hazelnuts (38%), Sugar, Cocoa Mass, Cocoa Butter, Whole Milk Powder, Emulsifier: Soy Lecithin, Natural Vanilla Flavor.",
     {"calories": 590, "totalFat": 42.0, "saturatedFat": 16.0, "transFat": 0.0, "carbohydrates": 41.0, "sugars": 38.0, "addedSugars": 30.0, "fiber": 5.0, "protein": 9.2, "sodium": 45, "salt": 0.11},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (167, "Premium Worldwide Collection", "Teuscher", "Teuscher Champagne Truffles", "Swiss Chocolate", "Confiserie Teuscher Zürich", "Switzerland", "Fresh Dom Pérignon Champagne Truffles", "Dom Pérignon Champagne & Dark Ganache", "160g", 55, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Vanilla), Fresh Cream (Milk), Butter (Milk), Dom Pérignon Champagne (5%), Powdered Sugar.",
     {"calories": 520, "totalFat": 37.0, "saturatedFat": 22.5, "transFat": 0.1, "carbohydrates": 39.0, "sugars": 34.0, "addedSugars": 28.0, "fiber": 4.8, "protein": 5.5, "sodium": 40, "salt": 0.1},
     ["Milk"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (168, "Premium Worldwide Collection", "Michel Cluizel", "Michel Cluizel Plantation Chocolate", "French Chocolate", "Manufacture Cluizel", "France", "Single Plantation Dark Chocolate", "Los Anconès 73% Organic Dark", "70g", 73, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Plantation Los Anconès Cocoa Beans (73%), Sugar, Cocoa Butter, Bourbon Vanilla Pod.",
     {"calories": 580, "totalFat": 42.5, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 34.0, "sugars": 26.0, "addedSugars": 25.0, "fiber": 10.5, "protein": 8.5, "sodium": 12, "salt": 0.03},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (169, "Premium Worldwide Collection", "Richart", "Richart Intense Chocolate Collection", "French Chocolate", "Maison Richart", "France", "Gourmet Aromatic Dark Chocolate", "72% Single Origin Venezuelan Criollo", "120g", 72, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soya Lecithin, Natural Vanilla Extract.",
     {"calories": 570, "totalFat": 41.5, "saturatedFat": 25.0, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 10.0, "protein": 8.0, "sodium": 15, "salt": 0.04},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (170, "Premium Worldwide Collection", "Debauve & Gallais", "Debauve & Gallais Le Livre Chocolat", "French Chocolate", "Debauve & Gallais Paris 1800", "France", "Historical Royal Dark Chocolate", "Pistoles de Marie-Antoinette 85%", "150g", 85, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Selected Cocoa Paste, Cocoa Butter, Pure Cane Sugar, Vanilla.",
     {"calories": 590, "totalFat": 48.0, "saturatedFat": 29.5, "transFat": 0.0, "carbohydrates": 24.0, "sugars": 14.0, "addedSugars": 13.0, "fiber": 13.5, "protein": 9.8, "sodium": 10, "salt": 0.03},
     [], ["Tree Nuts", "Milk"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # Swiss and Belgian premium collection (171-178)
    (171, "Premium Worldwide Collection", "Läderach", "Läderach FrischSchoggi Dark Selection", "Swiss Chocolate", "Läderach Chocolatier Suisse", "Switzerland", "Fresh Broken Artisan Slab", "Grand Cru Dark with Roasted Nuts", "250g", 64, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Whole Almonds (12%), Hazelnuts (10%), Cocoa Butter, Butterfat (Milk), Emulsifier: Soy Lecithin, Vanilla Pod Extract.",
     {"calories": 575, "totalFat": 42.0, "saturatedFat": 20.5, "transFat": 0.1, "carbohydrates": 37.0, "sugars": 32.0, "addedSugars": 28.0, "fiber": 7.5, "protein": 9.2, "sodium": 40, "salt": 0.1},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (172, "Premium Worldwide Collection", "Läderach", "Läderach Milk Hazelnut Chocolate", "Nut Chocolate", "Läderach Chocolatier Suisse", "Switzerland", "Fresh Swiss Milk Chocolate Slab", "Piedmont Caramelised Hazelnuts", "250g", 36, "VERIFIED_AVAILABLE",
     "Sugar, Whole Milk Powder, Cocoa Butter, Hazelnuts (22%), Cocoa Mass, Skimmed Milk Powder, Emulsifier: Soy Lecithin, Natural Vanilla.",
     {"calories": 578, "totalFat": 39.5, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 45.0, "sugars": 42.0, "addedSugars": 34.0, "fiber": 3.8, "protein": 9.5, "sodium": 95, "salt": 0.24},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (173, "Premium Worldwide Collection", "Cailler", "Cailler Ambassador Milk Chocolate", "Swiss Chocolate", "Maison Cailler / Nestlé Suisse", "Switzerland", "Heritage Swiss Praline Box", "Alpine Milk Pralines & Truffles", "245g", 32, "VERIFIED_AVAILABLE",
     "Sweetened Condensed Milk (Milk, Skimmed Milk, Sugar), Sugar, Cocoa Butter, Cocoa Mass, Hazelnuts, Almonds, Butterfat (Milk), Cocoa Powder, Emulsifier: Sunflower Lecithin, Vanilla Extract.",
     {"calories": 548, "totalFat": 34.0, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 49.0, "addedSugars": 40.0, "fiber": 3.2, "protein": 7.5, "sodium": 110, "salt": 0.28},
     ["Milk", "Tree Nuts"], ["Wheat", "Soy", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (174, "Premium Worldwide Collection", "Cailler", "Cailler Dark Chocolate", "Swiss Chocolate", "Maison Cailler", "Switzerland", "Swiss Alpine Dark Tablet", "Crémant 64% Dark", "100g", 64, "VERIFIED_AVAILABLE",
     "Cocoa Mass, Sugar, Cocoa Butter, Butterfat (Milk), Emulsifier: Sunflower Lecithin, Vanilla Extract.",
     {"calories": 560, "totalFat": 38.5, "saturatedFat": 23.0, "transFat": 0.1, "carbohydrates": 42.0, "sugars": 35.0, "addedSugars": 34.0, "fiber": 8.0, "protein": 6.8, "sodium": 20, "salt": 0.05},
     ["Milk"], ["Tree Nuts", "Wheat", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (175, "Premium Worldwide Collection", "Leonidas", "Leonidas Gianduja Praline", "Belgian Chocolate", "Confiserie Leonidas S.A.", "Belgium", "Pure Hazelnut Gianduja Foil Wrapped", "Piedmont Hazelnut Paste & Milk", "150g", 30, "VERIFIED_AVAILABLE",
     "Sugar, Hazelnuts (30%), Whole Milk Powder, Cocoa Butter, Cocoa Mass, Emulsifier: Soya Lecithin.",
     {"calories": 575, "totalFat": 39.0, "saturatedFat": 14.5, "transFat": 0.0, "carbohydrates": 46.0, "sugars": 44.0, "addedSugars": 36.0, "fiber": 4.2, "protein": 8.8, "sodium": 60, "salt": 0.15},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (176, "Premium Worldwide Collection", "Leonidas", "Leonidas Forever Pralines", "Belgian Chocolate", "Confiserie Leonidas S.A.", "Belgium", "Assorted Belgian Chocolates Box", "Pure Fresh Cocoa Butter Pralines", "200g", 38, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Hazelnuts, Butter (Milk), Almonds, Glucose Syrup, Emulsifier: Soya Lecithin, Natural Vanilla.",
     {"calories": 535, "totalFat": 34.0, "saturatedFat": 18.0, "transFat": 0.1, "carbohydrates": 48.0, "sugars": 45.0, "addedSugars": 37.0, "fiber": 4.2, "protein": 6.5, "sodium": 80, "salt": 0.2},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (177, "Premium Worldwide Collection", "Godiva", "Godiva Gold Collection", "Belgian Chocolate", "Godiva Chocolatier", "Belgium", "Classic Gold Ballotin Box", "Signature Ganaches, Pralines & Caramels", "200g", 42, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Full Cream Milk Powder, Cocoa Butter, Hazelnuts, Butter Oil (Milk), Cream (Milk), Invert Sugar Syrup, Glucose Syrup, Emulsifier: Soy Lecithin, Natural Vanilla.",
     {"calories": 530, "totalFat": 33.5, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 49.0, "sugars": 46.0, "addedSugars": 38.0, "fiber": 4.5, "protein": 6.8, "sodium": 75, "salt": 0.19},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (178, "Premium Worldwide Collection", "Delafee", "Delafée Gold Leaf Chocolate", "Luxury Chocolate", "Delafée of Switzerland", "Switzerland", "Edible 24-Karat Gold Leaf Chocolate", "Grand Cru Swiss Dark with 24K Gold", "50g", 56, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin, Vanilla, Edible Gold Flakes (24-Karat Gold).",
     {"calories": 558, "totalFat": 36.5, "saturatedFat": 22.5, "transFat": 0.0, "carbohydrates": 48.0, "sugars": 42.0, "addedSugars": 40.0, "fiber": 7.8, "protein": 6.0, "sodium": 20, "salt": 0.05},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # American luxury and artisan (179-186)
    (179, "Premium Worldwide Collection", "Knipschildt", "Knipschildt La Madeline au Truffe", "Luxury Chocolate", "Chocopologie by Knipschildt", "USA", "World Record French Black Truffle Ganache", "Valrhona Dark Ganache with Périgord Truffle", "45g", 70, "LIMITED_EDITION",
     "Valrhona 70% Dark Chocolate (Cocoa Beans, Sugar, Cocoa Butter, Sunflower Lecithin), Heavy Cream (Milk), French Black Périgord Truffle Oil & Real Truffle (Tuber melanosporum), Cocoa Powder.",
     {"calories": 540, "totalFat": 39.0, "saturatedFat": 24.0, "transFat": 0.1, "carbohydrates": 38.0, "sugars": 28.0, "addedSugars": 25.0, "fiber": 8.0, "protein": 6.5, "sodium": 35, "salt": 0.09},
     ["Milk"], ["Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (180, "Premium Worldwide Collection", "MarieBelle", "MarieBelle Ganache Collection", "Artisan Chocolate", "MarieBelle New York", "USA", "Artisan Art-Printed Ganache Box", "Single Origin Cocoa with Infused Ganache", "120g", 65, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Soy Lecithin), Heavy Cream (Milk), Butter (Milk), Cane Sugar, Passionfruit/Coffee/Espresso/Spices Extracts, Cocoa Butter Food Colours.",
     {"calories": 525, "totalFat": 36.0, "saturatedFat": 22.0, "transFat": 0.1, "carbohydrates": 42.0, "sugars": 36.0, "addedSugars": 30.0, "fiber": 5.0, "protein": 6.2, "sodium": 45, "salt": 0.11},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (181, "Premium Worldwide Collection", "MarieBelle", "MarieBelle Aztec Dark Chocolate", "Artisan Chocolate", "MarieBelle New York", "USA", "Authentic Spiced Aztec Chocolate", "South American Cacao with Ancho Chilli & Cinnamon", "80g", 65, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass (65%), Cane Sugar, Cocoa Butter, Ground Cinnamon, Ancho Chilli Flakes, Vanilla Beans.",
     {"calories": 550, "totalFat": 37.0, "saturatedFat": 22.5, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 34.0, "addedSugars": 33.0, "fiber": 8.5, "protein": 7.0, "sodium": 15, "salt": 0.04},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (182, "Premium Worldwide Collection", "Vosges", "Vosges Haut-Chocolat Exotic Truffle Collection", "Artisan Chocolate", "Vosges Haut-Chocolat", "USA", "Botanical & Exotic Spiced Truffles", "Ginger, Wasabi, Cardamom & Dark Ganache", "180g", 62, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Beans, Sugar, Cocoa Butter, Soy Lecithin), Heavy Cream (Milk), Hungarian Paprika, Organic Matcha Green Tea, Toasted Sesame Seeds, Wasabi, Ginger, Vanilla.",
     {"calories": 515, "totalFat": 35.0, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 43.0, "sugars": 35.0, "addedSugars": 30.0, "fiber": 5.2, "protein": 6.0, "sodium": 60, "salt": 0.15},
     ["Milk", "Soy"], ["Tree Nuts", "Sesame"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (183, "Premium Worldwide Collection", "Vosges", "Vosges Haut-Chocolat Mo's Milk Chocolate Bacon Bar", "Specialty Chocolate", "Vosges Haut-Chocolat", "USA", "Smoked Bacon & Alderwood Salt Bar", "Applewood Smoked Bacon in 45% Deep Milk", "85g", 45, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Milk Chocolate (Sugar, Cocoa Butter, Whole Milk Powder, Unsweetened Chocolate, Soy Lecithin, Vanilla), Cured Applewood Smoked Bacon (Pork, Water, Salt, Sodium Phosphate, Sodium Erythorbate, Sodium Nitrite), Alderwood Smoked Salt.",
     {"calories": 535, "totalFat": 34.0, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 48.0, "sugars": 44.0, "addedSugars": 36.0, "fiber": 2.5, "protein": 8.8, "sodium": 340, "salt": 0.85},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": False, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (184, "Premium Worldwide Collection", "Dandelion", "Dandelion Chocolate Single-Origin Bar", "Single-Origin Chocolate", "Dandelion Chocolate San Francisco", "USA", "Bean to Bar 2-Ingredient Chocolate", "Cahabón Guatemala 70%", "56g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Beans (70%), Organic Cane Sugar.",
     {"calories": 570, "totalFat": 42.0, "saturatedFat": 25.5, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 28.0, "addedSugars": 27.0, "fiber": 10.0, "protein": 8.2, "sodium": 8, "salt": 0.02},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (185, "Premium Worldwide Collection", "Compartes", "Compartés California Love Chocolate Bar", "American Chocolate", "Compartés Chocolatier Los Angeles", "USA", "Artisan Gourmet Dark Pretzel Bar", "Dark Chocolate & Salty Pretzels", "85g", 55, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Dark Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Soy Lecithin, Vanilla), San Francisco Pretzels (Wheat Flour, Salt, Sunflower Oil, Yeast), Sea Salt.",
     {"calories": 520, "totalFat": 29.0, "saturatedFat": 17.5, "transFat": 0.0, "carbohydrates": 58.0, "sugars": 42.0, "addedSugars": 38.0, "fiber": 5.5, "protein": 7.0, "sodium": 280, "salt": 0.7},
     ["Wheat", "Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (186, "Premium Worldwide Collection", "Dick Taylor", "Dick Taylor Belize Dark Chocolate", "Single-Origin Chocolate", "Dick Taylor Craft Chocolate", "USA", "Micro-Batch Craft Chocolate", "72% Toledo Belize Dark", "57g", 72, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Organic Cacao (72%), Organic Cane Sugar.",
     {"calories": 565, "totalFat": 40.5, "saturatedFat": 24.5, "transFat": 0.0, "carbohydrates": 38.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 9.5, "protein": 8.0, "sodium": 10, "salt": 0.03},
     [], [], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    # Japanese and Asian premium (187-192)
    (187, "Premium Worldwide Collection", "Royce'", "Royce' Nama Chocolate Au Lait", "Japanese Chocolate", "Royce' Confect Co., Ltd.", "Japan", "Hokkaido Fresh Cream Ganache Squares", "Au Lait with Cherry Marnier Liqueur", "125g (20 Pcs)", 36, "VERIFIED_AVAILABLE",
     "Fresh Cream (Milk) (32%), Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Liqueur (Cherry Marnier), Cocoa Powder, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 530, "totalFat": 39.0, "saturatedFat": 24.0, "transFat": 0.1, "carbohydrates": 38.0, "sugars": 34.0, "addedSugars": 26.0, "fiber": 2.5, "protein": 6.8, "sodium": 75, "salt": 0.19},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (188, "Premium Worldwide Collection", "Royce'", "Royce' Nama Chocolate Champagne Pierre Mignon", "Japanese Chocolate", "Royce' Confect Co., Ltd.", "Japan", "Champagne Infused Fresh Cream Squares", "Champagne Pierre Mignon & Milk Chocolate", "125g (20 Pcs)", 36, "VERIFIED_AVAILABLE",
     "Fresh Cream (Milk), Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Champagne Pierre Mignon (5%), Cocoa Powder, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 525, "totalFat": 38.0, "saturatedFat": 23.5, "transFat": 0.1, "carbohydrates": 39.0, "sugars": 34.0, "addedSugars": 26.0, "fiber": 2.4, "protein": 6.5, "sodium": 70, "salt": 0.18},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (189, "Premium Worldwide Collection", "Royce'", "Royce' Potatochip Chocolate", "Japanese Chocolate", "Royce' Confect Co., Ltd.", "Japan", "Chocolate Coated Ridged Chips", "Crispy Salty Potato Chips in Milk Chocolate", "190g", 28, "VERIFIED_AVAILABLE",
     "Potato Chips (Potato, Vegetable Oil, Salt), Sugar, Cocoa Butter, Cocoa Mass, Whole Milk Powder, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 602, "totalFat": 42.8, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 49.0, "sugars": 35.0, "addedSugars": 28.0, "fiber": 3.2, "protein": 5.2, "sodium": 320, "salt": 0.8},
     ["Milk", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (190, "Premium Worldwide Collection", "Meiji", "Meiji The Chocolate Cacao 70", "Japanese Chocolate", "Meiji Holdings Co., Ltd.", "Japan", "Bean to Bar Aroma Dark Chocolate", "70% Nutty & Floral Aroma", "50g", 70, "VERIFIED_AVAILABLE",
     "Cocoa Mass (70%), Sugar, Cocoa Butter, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 590, "totalFat": 45.0, "saturatedFat": 27.5, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 25.0, "addedSugars": 24.0, "fiber": 9.5, "protein": 9.0, "sodium": 15, "salt": 0.04},
     ["Soy"], ["Milk", "Tree Nuts"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (191, "Premium Worldwide Collection", "Morozoff", "Morozoff Premium Chocolate Collection", "Japanese Chocolate", "Morozoff Limited Kobe", "Japan", "Kobe Confectionery Assorted Box", "Assorted Japanese Pralines & Truffles", "150g", 38, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Hazelnuts, Almonds, Fresh Cream (Milk), Butter, Emulsifier (Soy Lecithin), Vanilla Extract.",
     {"calories": 540, "totalFat": 34.5, "saturatedFat": 19.5, "transFat": 0.1, "carbohydrates": 49.0, "sugars": 44.0, "addedSugars": 36.0, "fiber": 3.8, "protein": 7.5, "sodium": 80, "salt": 0.2},
     ["Milk", "Tree Nuts", "Soy"], ["Wheat", "Eggs"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (192, "Premium Worldwide Collection", "Lotte", "Lotte Ghana Premium Chocolate", "Japanese Chocolate", "Lotte Co., Ltd.", "Japan", "Extra Micro-ground Milk Chocolate", "Ghana Milk Cacao", "50g", 32, "VERIFIED_AVAILABLE",
     "Sugar, Whole Milk Powder, Cocoa Mass, Cocoa Butter, Vegetable Fats, Emulsifier (Soy Lecithin), Flavouring.",
     {"calories": 558, "totalFat": 34.5, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 54.0, "sugars": 52.0, "addedSugars": 42.0, "fiber": 2.2, "protein": 7.8, "sodium": 110, "salt": 0.28},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    # Premium British, Austrian and Middle Eastern (193-200)
    (193, "Premium Worldwide Collection", "Hotel Chocolat", "Hotel Chocolat Rabot Estate Dark Chocolate", "British Chocolate", "Hotel Chocolat Group", "UK", "Single Estate Saint Lucia Dark", "Single Estate 70% Cacao", "70g", 70, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Cocoa Mass (Saint Lucia Rabot Estate 70%), Sugar, Cocoa Butter.",
     {"calories": 570, "totalFat": 42.0, "saturatedFat": 25.5, "transFat": 0.0, "carbohydrates": 36.0, "sugars": 27.0, "addedSugars": 26.0, "fiber": 10.2, "protein": 8.0, "sodium": 12, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (194, "Premium Worldwide Collection", "Hotel Chocolat", "Hotel Chocolat Velvetised Chocolate", "British Chocolate", "Hotel Chocolat Group", "UK", "Drinking Chocolate & Solid Chocolate Melt", "50% Velvetised Drinking Cocoa", "250g", 50, "VERIFIED_AVAILABLE",
     "Cocoa Solids (50%), Sugar, Cocoa Butter, Whole Milk Powder, Emulsifier (Soya Lecithin), Flavouring.",
     {"calories": 510, "totalFat": 28.5, "saturatedFat": 17.5, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 46.0, "addedSugars": 38.0, "fiber": 6.5, "protein": 7.5, "sodium": 80, "salt": 0.2},
     ["Milk", "Soy"], ["Tree Nuts"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (195, "Premium Worldwide Collection", "Zotter", "Zotter Labooko 100% Cacao", "Artisan Chocolate", "Zotter Schokoladen Manufaktur", "Austria", "Pure Zero Sugar Organic Dark", "100% Maya Cocoa Single Origin", "70g (2x35g)", 100, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Organic Cocoa Mass (100%), Organic Cocoa Butter.",
     {"calories": 625, "totalFat": 56.0, "saturatedFat": 34.5, "transFat": 0.0, "carbohydrates": 9.5, "sugars": 0.5, "addedSugars": 0.0, "fiber": 17.0, "protein": 13.0, "sodium": 10, "salt": 0.03},
     [], ["Milk", "Tree Nuts", "Soy"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": True, "isOrganic": True}),

    (196, "Premium Worldwide Collection", "Zotter", "Zotter Hand-Scooped Chocolate", "Artisan Chocolate", "Zotter Schokoladen Manufaktur", "Austria", "Layered Hand-Scooped Chocolate", "ButterCaramel with Crunchy Almonds", "70g", 50, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Raw Cane Sugar, Cocoa Butter, Butter (Milk), Cream (Milk), Almonds, Cocoa Mass, Full Cream Milk Powder, Invert Sugar Syrup, Caramelised Milk Powder, Salt, Emulsifier (Soy Lecithin), Vanilla.",
     {"calories": 545, "totalFat": 36.5, "saturatedFat": 21.0, "transFat": 0.1, "carbohydrates": 47.0, "sugars": 44.0, "addedSugars": 37.0, "fiber": 3.2, "protein": 6.8, "sodium": 180, "salt": 0.45},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True}),

    (197, "Premium Worldwide Collection", "Patchi", "Patchi Luxury Assorted Chocolate Collection", "Luxury Chocolate", "Patchi SAL", "Lebanon", "Middle Eastern Luxury Pralines", "Assorted Gianduja, Praline & Ganache", "250g", 40, "VERIFIED_AVAILABLE",
     "Sugar, Cocoa Mass, Whole Milk Powder, Cocoa Butter, Hazelnuts, Almonds, Pistachios, Anhydrous Milk Fat, Emulsifier (Soya Lecithin), Natural Vanilla.",
     {"calories": 545, "totalFat": 35.0, "saturatedFat": 18.5, "transFat": 0.1, "carbohydrates": 48.0, "sugars": 45.0, "addedSugars": 36.0, "fiber": 4.5, "protein": 7.8, "sodium": 70, "salt": 0.18},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (198, "Premium Worldwide Collection", "Patchi", "Patchi Gianduja Chocolate", "Luxury Chocolate", "Patchi SAL", "Lebanon", "Smooth Hazelnut Paste Chocolate", "Pure Piedmont Hazelnut Paste & Cocoa", "200g", 35, "VERIFIED_AVAILABLE",
     "Hazelnuts (32%), Sugar, Cocoa Butter, Cocoa Mass, Whole Milk Powder, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Vanillin.",
     {"calories": 585, "totalFat": 41.5, "saturatedFat": 15.0, "transFat": 0.0, "carbohydrates": 42.0, "sugars": 38.0, "addedSugars": 29.0, "fiber": 4.8, "protein": 9.0, "sodium": 60, "salt": 0.15},
     ["Milk", "Tree Nuts", "Soy"], [], {"isVegetarian": True, "isVegan": False, "isGlutenFree": True, "isSugarFree": False, "isOrganic": False}),

    (199, "Premium Worldwide Collection", "House of Dorchester", "House of Dorchester Heritage Collection", "British Chocolate", "House of Dorchester Ltd", "UK", "Royal British Chocolate Collection", "Heritage Milk, Dark & Salted Caramel", "160g", 38, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Sugar, Cocoa Mass, Cocoa Butter, Whole Milk Powder, Sweetened Condensed Skimmed Milk, Glucose Syrup, Butter (Milk), Sea Salt, Emulsifier (Soya Lecithin), Natural Flavouring.",
     {"calories": 525, "totalFat": 32.0, "saturatedFat": 19.0, "transFat": 0.1, "carbohydrates": 52.0, "sugars": 49.0, "addedSugars": 40.0, "fiber": 3.8, "protein": 6.5, "sodium": 120, "salt": 0.3},
     ["Milk", "Soy"], ["Tree Nuts", "Wheat"], {"isVegetarian": True, "isVegan": False, "isGlutenFree": False, "isSugarFree": False, "isOrganic": False}),

    (200, "Premium Worldwide Collection", "House of Grauer", "House of Grauer Aficionado Collection", "Swiss Chocolate", "House of Grauer Geneva", "Switzerland", "Aficionado Dark Chocolate Pairing", "Grand Cru Venezuelan 74% Dark", "100g", 74, "IMPORTED_AVAILABILITY_UNCONFIRMED",
     "Single Origin Venezuelan Cacao Mass (74%), Organic Cane Sugar, Cocoa Butter, Bourbon Vanilla.",
     {"calories": 578, "totalFat": 42.5, "saturatedFat": 26.0, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 24.5, "addedSugars": 23.5, "fiber": 10.5, "protein": 8.4, "sodium": 12, "salt": 0.03},
     [], ["Tree Nuts", "Milk"], {"isVegetarian": True, "isVegan": True, "isGlutenFree": True, "isSugarFree": False, "isOrganic": True})
]

# Ensure exactly 200 products
assert len(items_meta) == 200, f"Expected 200 items, got {len(items_meta)}"

# Barcode generation helper
used_barcodes = set()
def make_barcode(ref_num):
    # Prefix 890820 for Chocolate 200 Collection
    code = f"890820{ref_num:06d}"
    s = 0
    for i, ch in enumerate(code):
        d = int(ch)
        s += d * (1 if i % 2 == 0 else 3)
    check = (10 - (s % 10)) % 10
    barcode = f"{code}{check}"
    return barcode

products = []
for item in items_meta:
    (ref, src_cat, brand, name, subcat, mfr, country, ptype, flavour, pkg, cocoa, avail, ings, nutr, cont_allergens, may_allergens, dietary) = item
    
    barcode = make_barcode(ref)
    
    # Nutritional flags
    has_high_sat_fat = nutr.get("saturatedFat", 0) > 5.0
    has_high_sodium = nutr.get("sodium", 0) > 400
    has_added_sugar = nutr.get("addedSugars", 0) > 0
    
    prod = {
        "importReferenceNumber": ref,
        "sourceCatalogue": src_cat,
        "barcode": barcode,
        "name": name,
        "brand": brand,
        "manufacturer": mfr,
        "category": "Chocolates & Sweets",
        "categorySlug": "chocolates-sweets",
        "subCategory": subcat,
        "productType": ptype,
        "flavour": flavour,
        "packageSize": pkg,
        "servingSize": "25g",
        "countryOfOrigin": country,
        "cocoaPercentage": cocoa if cocoa > 0 else None,
        "availability": avail,
        "ingredientsText": ings,
        "nutritionPer100g": nutr,
        "allergens": {
            "contains": cont_allergens,
            "mayContain": may_allergens
        },
        "dietarySuitability": dietary,
        "hasHighSaturatedFat": has_high_sat_fat,
        "hasHighSodium": has_high_sodium,
        "hasAddedSugar": has_added_sugar,
        "imageStatus": "PENDING_DOWNLOAD"
    }
    products.append(prod)

with open("scripts/data/chocolate_200_candidates.json", "w") as f:
    json.dump(products, f, indent=2)

print(f"✅ Successfully compiled {len(products)} Chocolate products to scripts/data/chocolate_200_candidates.json")
