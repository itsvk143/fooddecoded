import json
import os

def calc_check_digit(code12):
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(code12))
    return str((10 - (s % 10)) % 10)

def make_barcode(seq):
    code12 = f"890892{seq:06d}"
    return f"{code12}{calc_check_digit(code12)}"

CAT_NAME = "Noodles & Ready-to-Eat"
CAT_SLUG = "noodles-ready-to-eat"

# We load phase 1 products from phase1_noodles.json if present, or create the full list.
# Let's inspect phase 1
with open("scripts/data/phase1_noodles.json", "r") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products from phase 1.")

# ------------------------------------------------------------------------------
# 5. CHING'S SECRET (Capital Foods) - 25 Products
# ------------------------------------------------------------------------------
chings_products = [
    # Desi Chinese Instant Noodles
    {
        "name": "Ching's Secret Schezwan Instant Noodles",
        "brand": "Ching's Secret",
        "sub": "Instant Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Desi Chinese Schezwan",
        "wt": "60 g",
        "price": 15,
        "veg": True,
        "desc": "Fiery Desi Chinese noodles loaded with Sichuan peppers, garlic, ginger, and red chillies.",
        "ing": "Noodles: Refined Wheat Flour (Maida), Palm Oil, Salt, Gluten. Seasoning Mix: Red Chilli, Garlic, Ginger, Sichuan Pepper, Soy Sauce Powder, Onion, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 448, "totalFat": 17.5, "saturatedFat": 7.9, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 3.0, "addedSugars": 2.0, "fiber": 3.4, "protein": 8.5, "sodium": 1250, "salt": 3.12},
        "highlights": ["Desi Chinese Schezwan", "Sichuan Pepper Heat", "Refined Maida", "Contains Palm Oil", "High Sodium"]
    },
    {
        "name": "Ching's Secret Hot Garlic Instant Noodles",
        "brand": "Ching's Secret",
        "sub": "Instant Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Hot Garlic",
        "wt": "60 g",
        "price": 15,
        "veg": True,
        "desc": "Pungent slow-cooked garlic paired with spicy red chilli sauce and non-sticky noodle strands.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Seasoning Mix: Dehydrated Garlic Granules (15%), Red Chilli, Celery, Soy Sauce, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 445, "totalFat": 17.2, "saturatedFat": 7.8, "transFat": 0.1, "carbohydrates": 63.8, "sugars": 2.8, "addedSugars": 1.8, "fiber": 3.5, "protein": 8.4, "sodium": 1220, "salt": 3.05},
        "highlights": ["Pungent Hot Garlic", "Refined Maida", "Contains Palm Oil", "High Sodium"]
    },
    {
        "name": "Ching's Secret Manchurian Instant Noodles",
        "brand": "Ching's Secret",
        "sub": "Instant Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Manchurian",
        "wt": "60 g",
        "price": 15,
        "veg": True,
        "desc": "Rich dark soy gravy noodles with ginger, spring onion, and crunchy coriander bits.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Seasoning Mix: Soy Sauce Powder, Ginger, Garlic, White Pepper, Onion, Salt, Sugar, Flavour Enhancers (INS 627, INS 631), Caramel Colour (INS 150d).",
        "nut": {"calories": 440, "totalFat": 16.8, "saturatedFat": 7.5, "transFat": 0.1, "carbohydrates": 64.0, "sugars": 3.2, "addedSugars": 2.2, "fiber": 3.3, "protein": 8.2, "sodium": 1240, "salt": 3.10},
        "highlights": ["Desi Manchurian", "Refined Maida", "Contains Palm Oil", "High Sodium"]
    },
    {
        "name": "Ching's Secret Singapore Curry Instant Noodles",
        "brand": "Ching's Secret",
        "sub": "Instant Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Singapore Curry",
        "wt": "60 g",
        "price": 15,
        "veg": True,
        "desc": "Fragrant Southeast Asian yellow curry broth with mild spices, coconut milk solids, and lemongrass.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Seasoning Mix: Curry Powder (Turmeric, Coriander, Cumin, Mustard, Fenugreek), Coconut Milk Powder, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 442, "totalFat": 17.0, "saturatedFat": 7.8, "transFat": 0.1, "carbohydrates": 64.0, "sugars": 2.6, "addedSugars": 1.6, "fiber": 3.4, "protein": 8.3, "sodium": 1180, "salt": 2.95},
        "highlights": ["Singapore Yellow Curry", "Coconut Notes", "Refined Maida", "High Sodium"]
    },
    # Pad Thai & Cup Noodles
    {
        "name": "Ching's Secret Pad Thai Original",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Pad Thai Original Tamarind",
        "wt": "180 g",
        "price": 85,
        "veg": True,
        "desc": "Thai street style flat rice noodles with tangy tamarind glaze, roasted peanuts, and lime zest.",
        "ing": "Noodles: Rice Flour (88%), Tapioca Starch, Water. Pad Thai Sauce: Tamarind Puree, Brown Sugar, Soy Sauce, Chilli, Garlic, Crushed Peanuts, Salt.",
        "nut": {"calories": 365, "totalFat": 4.5, "saturatedFat": 1.0, "transFat": 0.0, "carbohydrates": 74.0, "sugars": 8.5, "addedSugars": 6.0, "fiber": 2.8, "protein": 6.8, "sodium": 890, "salt": 2.22},
        "highlights": ["100% Rice Noodles (Gluten-Free)", "Tangy Tamarind Glaze", "Crushed Peanuts"]
    },
    {
        "name": "Ching's Secret Pad Thai Green Curry",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Pad Thai Green Curry",
        "wt": "180 g",
        "price": 85,
        "veg": True,
        "desc": "Flat rice noodles paired with aromatic Thai green curry paste, kaffir lime, and coconut cream.",
        "ing": "Noodles: Rice Flour, Tapioca Starch. Sauce: Coconut Cream, Green Chilli Paste, Lemongrass, Galangal, Kaffir Lime, Basil, Salt, Sugar.",
        "nut": {"calories": 380, "totalFat": 7.5, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 6.0, "addedSugars": 4.0, "fiber": 3.0, "protein": 6.5, "sodium": 920, "salt": 2.30},
        "highlights": ["Thai Green Curry", "Real Coconut Cream & Galangal", "Gluten-Free Rice Noodles"]
    },
    {
        "name": "Ching's Secret Pad Thai Extra Hot Thai Chilli",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Extra Hot Bird's Eye Chilli",
        "wt": "180 g",
        "price": 85,
        "veg": True,
        "desc": "Fiery flat rice noodles coated in scorching Thai bird's eye chilli oil and garlic.",
        "ing": "Noodles: Rice Flour, Tapioca Starch. Sauce: Bird's Eye Chilli (Prik Kee Noo), Garlic, Shallots, Soy Sauce, Sesame Oil, Palm Sugar, Salt.",
        "nut": {"calories": 370, "totalFat": 5.2, "saturatedFat": 1.2, "transFat": 0.0, "carbohydrates": 73.0, "sugars": 6.5, "addedSugars": 4.5, "fiber": 2.9, "protein": 6.6, "sodium": 960, "salt": 2.40},
        "highlights": ["Thai Bird's Eye Chilli", "Scorching Heat", "Gluten-Free Rice Noodles"]
    },
    {
        "name": "Ching's Secret Pad Thai Lemon Grass & Chilli",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Lemongrass & Chilli",
        "wt": "180 g",
        "price": 85,
        "veg": True,
        "desc": "Zesty citrus notes of fresh lemongrass balanced with warm red chillies and flat noodles.",
        "ing": "Noodles: Rice Flour, Water. Sauce: Fresh Lemongrass Extract, Red Chilli, Kaffir Lime, Soy Sauce, Garlic, Salt.",
        "nut": {"calories": 368, "totalFat": 4.8, "saturatedFat": 1.1, "transFat": 0.0, "carbohydrates": 73.5, "sugars": 6.0, "addedSugars": 4.0, "fiber": 3.0, "protein": 6.8, "sodium": 910, "salt": 2.28},
        "highlights": ["Fresh Lemongrass", "Gluten-Free Rice Noodles"]
    },
    {
        "name": "Ching's Secret Manchurian Cup Noodles",
        "brand": "Ching's Secret",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Manchurian Cuppa",
        "wt": "70 g",
        "price": 50,
        "veg": True,
        "desc": "Instant cup noodles with hearty Desi Chinese Manchurian flavor and dehydrated vegetables.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Seasoning: Dark Soy Sauce Powder, Ginger, Garlic, Spring Onions, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 445, "totalFat": 17.5, "saturatedFat": 7.8, "transFat": 0.1, "carbohydrates": 63.5, "sugars": 3.0, "addedSugars": 2.0, "fiber": 3.2, "protein": 8.0, "sodium": 1260, "salt": 3.15},
        "highlights": ["Desi Manchurian Cup", "On-The-Go", "High Sodium"]
    },
    {
        "name": "Ching's Secret Schezwan Cup Noodles",
        "brand": "Ching's Secret",
        "sub": "Cup & Bowl Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Schezwan Cuppa",
        "wt": "70 g",
        "price": 50,
        "veg": True,
        "desc": "On-the-go fiery Schezwan cup noodles with visible red chilli flakes and spring onions.",
        "ing": "Noodles: Refined Wheat Flour, Palm Oil, Salt. Seasoning: Red Chilli, Sichuan Pepper, Garlic, Dehydrated Carrots, Cabbage, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 450, "totalFat": 17.8, "saturatedFat": 8.0, "transFat": 0.1, "carbohydrates": 63.2, "sugars": 3.2, "addedSugars": 2.2, "fiber": 3.3, "protein": 8.2, "sodium": 1280, "salt": 3.20},
        "highlights": ["Schezwan Cuppa", "Sichuan Heat", "High Sodium"]
    },
    # Hakka Noodles
    {
        "name": "Ching's Secret Veg Hakka Noodles",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Classic Veg Hakka",
        "wt": "150 g",
        "price": 35,
        "veg": True,
        "desc": "India's favorite wok noodles for making authentic street-style vegetable chowmein at home.",
        "ing": "Refined Wheat Flour (Maida), Water, Iodised Salt.",
        "nut": {"calories": 355, "totalFat": 1.0, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 76.5, "sugars": 1.2, "addedSugars": 0.0, "fiber": 3.2, "protein": 10.5, "sodium": 350, "salt": 0.88},
        "highlights": ["Non-Sticky Wok Strands", "Zero Palm Oil", "Zero MSG", "Low Fat (1.0g)"]
    },
    {
        "name": "Ching's Secret Egg Hakka Noodles",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Egg Hakka",
        "wt": "150 g",
        "price": 40,
        "veg": False,
        "desc": "Chinese egg noodles crafted with real egg powder for extra springiness and firmness.",
        "ing": "Refined Wheat Flour (Maida), Whole Egg Powder (4%), Water, Iodised Salt.",
        "nut": {"calories": 368, "totalFat": 2.5, "saturatedFat": 0.7, "transFat": 0.0, "carbohydrates": 74.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 3.0, "protein": 12.8, "sodium": 380, "salt": 0.95},
        "highlights": ["Non-Vegetarian", "Whole Egg Powder", "High Protein (12.8g)", "Zero Palm Oil"]
    },
    {
        "name": "Ching's Secret Whole Wheat Hakka Noodles",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Whole Wheat Atta Hakka",
        "wt": "150 g",
        "price": 45,
        "veg": True,
        "desc": "Healthy 100% whole wheat flour hakka noodles delivering superior dietary fiber.",
        "ing": "Whole Wheat Flour (Atta 98%), Water, Iodised Salt.",
        "nut": {"calories": 348, "totalFat": 1.8, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 71.5, "sugars": 1.5, "addedSugars": 0.0, "fiber": 8.5, "protein": 12.0, "sodium": 320, "salt": 0.80},
        "highlights": ["Whole Wheat Atta (98%)", "Zero Maida", "High Fiber (8.5g)", "Zero Palm Oil"]
    },
    {
        "name": "Ching's Secret Just Soak Hakka Noodles",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Just Soak",
        "wt": "150 g",
        "price": 40,
        "veg": True,
        "desc": "Convenient instant-prep hakka noodles that need only 5 minutes of soaking in boiling water without cooking.",
        "ing": "Refined Wheat Flour (Maida), Water, Salt.",
        "nut": {"calories": 358, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 76.0, "sugars": 1.2, "addedSugars": 0.0, "fiber": 3.2, "protein": 10.8, "sodium": 360, "salt": 0.90},
        "highlights": ["No Boiling Needed (Just Soak)", "Zero Palm Oil", "Non-Sticky"]
    },
    {
        "name": "Ching's Secret Hakka Noodles with Masala Kit",
        "brand": "Ching's Secret",
        "sub": "Hakka & Flat Noodles",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Hakka Noodles + Chowmein Masala",
        "wt": "240 g",
        "price": 60,
        "veg": True,
        "desc": "Complete meal kit containing premium hakka noodles and Desi Chinese Chowmein Masala seasoning.",
        "ing": "Noodles: Refined Wheat Flour, Water, Salt. Masala Sachet: Spices & Condiments (Garlic, Ginger, Red Chilli, White Pepper), Salt, Sugar, Soy Sauce Powder, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 362, "totalFat": 2.0, "saturatedFat": 0.5, "transFat": 0.0, "carbohydrates": 74.5, "sugars": 3.5, "addedSugars": 2.0, "fiber": 3.5, "protein": 11.2, "sodium": 820, "salt": 2.05},
        "highlights": ["Complete Meal Kit", "Includes Chowmein Seasoning", "Zero Palm Oil in Noodles"]
    },
    # Instant & Cook-Up Soups
    {
        "name": "Ching's Secret Manchow Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Manchow Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Dark, spicy Chinese broth loaded with garlic, ginger, soya sauce, and crunchy noodles.",
        "ing": "Corn Starch, Sugar, Dehydrated Vegetables (Carrot, Cabbage), Soy Sauce Powder, Garlic, Ginger, Salt, Red Chilli, Flavour Enhancers (INS 627, INS 631), Caramel Colour.",
        "nut": {"calories": 320, "totalFat": 1.5, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 72.0, "sugars": 16.0, "addedSugars": 14.0, "fiber": 3.0, "protein": 4.5, "sodium": 1650, "salt": 4.12},
        "highlights": ["Desi Chinese Manchow", "Very High Sodium (1650mg)", "Contains Added Sugar"]
    },
    {
        "name": "Ching's Secret Hot & Sour Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Hot & Sour Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Lip-smacking balance of fiery red chillies and sharp acetic tang with garden vegetables.",
        "ing": "Corn Starch, Sugar, Salt, Dehydrated Carrots, Green Peas, Acidity Regulator (INS 260), Soy Sauce Powder, Red Chilli, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 315, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 71.5, "sugars": 15.5, "addedSugars": 13.5, "fiber": 3.2, "protein": 4.2, "sodium": 1680, "salt": 4.20},
        "highlights": ["Spicy & Tangy Acetic Acid", "Very High Sodium", "Contains Added Sugar"]
    },
    {
        "name": "Ching's Secret Sweet Corn Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Sweet Corn Veg Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Golden sweet corn kernels swimming in velvety corn broth with white pepper hints.",
        "ing": "Corn Starch, Sugar, Freeze-Dried Sweet Corn Kernels (12%), Salt, Milk Solids, Onion, Celery, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 330, "totalFat": 2.0, "saturatedFat": 0.6, "transFat": 0.0, "carbohydrates": 73.0, "sugars": 18.0, "addedSugars": 15.0, "fiber": 3.5, "protein": 4.8, "sodium": 1420, "salt": 3.55},
        "highlights": ["Real Freeze-Dried Sweet Corn", "Velvety Texture", "High Sodium"]
    },
    {
        "name": "Ching's Secret Tomato Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Tangy Tomato Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Rich red ripe tomato soup with homestyle crouton crunch and mild Indian spices.",
        "ing": "Tomato Paste & Powder (28%), Corn Starch, Sugar, Salt, Bread Croutons (Refined Wheat Flour, Palm Oil, Salt), Spices (Black Pepper, Clove, Cinnamon), Citric Acid.",
        "nut": {"calories": 335, "totalFat": 3.0, "saturatedFat": 1.2, "transFat": 0.05, "carbohydrates": 72.0, "sugars": 22.0, "addedSugars": 18.0, "fiber": 4.0, "protein": 4.5, "sodium": 1450, "salt": 3.62},
        "highlights": ["Real Tomato Solids (28%)", "Includes Crunchy Croutons", "High Added Sugar"]
    },
    {
        "name": "Ching's Secret Mix Veg Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Mixed Vegetable Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Wholesome clear vegetable soup packed with carrots, cabbage, green peas, and cracked black pepper.",
        "ing": "Corn Starch, Dehydrated Vegetables (Carrot, Cabbage, Green Peas, Onion), Salt, Sugar, Black Pepper, Coriander, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 310, "totalFat": 1.0, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 14.0, "addedSugars": 12.0, "fiber": 4.5, "protein": 4.0, "sodium": 1500, "salt": 3.75},
        "highlights": ["Garden Vegetables", "High Sodium", "Low Fat"]
    },
    {
        "name": "Ching's Secret Lemon Coriander Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Lemon Coriander Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Zingy, fragrant lemon broth bursting with crushed green coriander and crisp cabbage.",
        "ing": "Corn Starch, Lemon Juice Powder, Dried Coriander Leaves (8%), Dehydrated Cabbage, Garlic, Ginger, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 305, "totalFat": 0.8, "saturatedFat": 0.2, "transFat": 0.0, "carbohydrates": 70.5, "sugars": 13.5, "addedSugars": 11.5, "fiber": 3.8, "protein": 3.8, "sodium": 1480, "salt": 3.70},
        "highlights": ["Zesty Lemon & Fresh Coriander", "Clear Broth", "High Sodium"]
    },
    {
        "name": "Ching's Secret Tomato Oats Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Tomato Oats Soup",
        "wt": "55 g",
        "price": 20,
        "veg": True,
        "desc": "Fiber-rich blend of rolled oats and tangy sun-ripened tomatoes.",
        "ing": "Rolled Oat Flakes (30%), Tomato Powder (22%), Corn Starch, Sugar, Salt, Black Pepper, Cumin, Citric Acid.",
        "nut": {"calories": 340, "totalFat": 3.2, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 18.0, "addedSugars": 14.0, "fiber": 6.8, "protein": 7.5, "sodium": 1280, "salt": 3.20},
        "highlights": ["Rolled Oat Flakes (30%)", "High Fiber (6.8g)", "Tomato Solids"]
    },
    {
        "name": "Ching's Secret Asian Hot Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Asian Hot Spicy Soup",
        "wt": "55 g",
        "price": 15,
        "veg": True,
        "desc": "Southeast Asian red curry soup with galangal, lemongrass, and crushed red chillies.",
        "ing": "Corn Starch, Red Chilli Powder, Lemongrass, Shallots, Soy Sauce Powder, Sugar, Salt, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 315, "totalFat": 1.2, "saturatedFat": 0.3, "transFat": 0.0, "carbohydrates": 71.0, "sugars": 14.5, "addedSugars": 12.5, "fiber": 3.5, "protein": 4.5, "sodium": 1620, "salt": 4.05},
        "highlights": ["Southeast Asian Flavors", "Fiery Broth", "Very High Sodium"]
    },
    {
        "name": "Ching's Secret Korean Kimchi Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Korean Kimchi Soup",
        "wt": "55 g",
        "price": 20,
        "veg": True,
        "desc": "Fermented Korean kimchi cabbage soup featuring pungent garlic and gochugaru pepper.",
        "ing": "Corn Starch, Fermented Kimchi Powder (14%), Red Pepper Paste Powder, Garlic, Ginger, Sugar, Salt, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 320, "totalFat": 1.5, "saturatedFat": 0.4, "transFat": 0.0, "carbohydrates": 71.5, "sugars": 15.0, "addedSugars": 13.0, "fiber": 3.8, "protein": 5.0, "sodium": 1590, "salt": 3.98},
        "highlights": ["Fermented Kimchi Powder", "Korean Gochugaru", "High Sodium"]
    },
    {
        "name": "Ching's Secret Chicken Manchow Instant Soup",
        "brand": "Ching's Secret",
        "sub": "Instant & Cook-Up Soups",
        "mfr": "Capital Foods Pvt Ltd",
        "flavour": "Chicken Manchow Soup",
        "wt": "55 g",
        "price": 20,
        "veg": False,
        "desc": "Authentic chicken broth with real dehydrated chicken meat, garlic, ginger, and soy sauce.",
        "ing": "Corn Starch, Chicken Meat Powder (9%), Dehydrated Chicken Bits, Soy Sauce Powder, Garlic, Ginger, Salt, Sugar, Flavour Enhancers (INS 627, INS 631).",
        "nut": {"calories": 335, "totalFat": 2.5, "saturatedFat": 0.8, "transFat": 0.0, "carbohydrates": 68.0, "sugars": 14.0, "addedSugars": 11.5, "fiber": 3.0, "protein": 8.5, "sodium": 1680, "salt": 4.20},
        "highlights": ["Non-Vegetarian", "Real Chicken Extract", "Very High Sodium", "Contains Added Sugar"]
    }
]

products.extend(chings_products)
print(f"Added Ching's Secret: total now {len(products)}")

with open("scripts/data/phase2_noodles.json", "w") as f:
    json.dump(products, f, indent=2)

