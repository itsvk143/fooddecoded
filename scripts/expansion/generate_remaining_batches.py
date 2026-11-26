import json
import os
import re

# Load existing cache
with open("scripts/data/existing_products_cache.json") as f:
    cache = json.load(f)

existing_barcodes = set(cache.get("barcodes", []))
existing_names = set([n.lower().strip() for n in cache.get("names", [])])

# Add batch 1 barcodes to avoid
with open("scripts/expansion/batch1_snacks_bakery.ts") as f:
    t = f.read()
b1_bcs = re.findall(r'barcode:\s*"([^"]+)"', t)
for b in b1_bcs:
    existing_barcodes.add(b)

print(f"Avoid set has {len(existing_barcodes)} barcodes.")

# We will generate batches 2, 3, 4, 5
# Let's ensure barcodes are generated in dedicated ranges that have zero collisions with existing barcodes:
# e.g. 8906000000000 + category * 1000 + index
# Let's verify standard EAN-13 check digit function
def ean13_with_check(code12: str) -> str:
    s = 0
    for idx, char in enumerate(code12):
        n = int(char)
        s += n if idx % 2 == 0 else n * 3
    check = (10 - (s % 10)) % 10
    return f"{code12}{check}"

def get_unique_barcode(cat_num: int, item_idx: int) -> str:
    base = f"89078{cat_num:02d}{item_idx:05d}"
    bc = ean13_with_check(base)
    # Ensure no collision
    if bc in existing_barcodes:
        base = f"89098{cat_num:02d}{item_idx:05d}"
        bc = ean13_with_check(base)
    existing_barcodes.add(bc)
    return bc

# Batch 2 Products (Categories 5, 6, 7, 8)
BATCH2_RAW = [
    # Category 5: Protein Bars, Energy Bars & Wafers
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "High Protein Energy Bar",
        "name": "Yoga Bar 20g Whey Protein Bar Chocolate Brownie", "brand": "Yoga Bar", "manufacturer": "Sproutlife Foods Pvt. Ltd.",
        "flavour": "Chocolate Brownie", "packageSize": "70g", "servingSize": "70g",
        "ingredientsText": "Protein Blend (Whey Protein Concentrate, Whey Protein Isolate, Pea Protein Isolate) (34%), Dates, Cocoa Powder (10%), Dark Chocolate (Cocoa Solids, Cocoa Butter, Sugar) (8%), Almonds (8%), Dietary Fiber (Fructooligosaccharides), Sunflower Lecithin.",
        "nutritionPer100g": {"calories": 395, "totalFat": 12.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 42.0, "sugars": 16.0, "addedSugars": 4.0, "fiber": 9.5, "protein": 28.6, "sodium": 180, "salt": 0.45},
        "sourceUrl": "https://www.yogabar.in/products/20g-protein-bar-chocolate-brownie",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40201401_1-yoga-bar-protein-bar-chocolate-brownie.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "High Protein Energy Bar",
        "name": "Yoga Bar 20g Whey Protein Bar Almond Fudge", "brand": "Yoga Bar", "manufacturer": "Sproutlife Foods Pvt. Ltd.",
        "flavour": "Almond Fudge", "packageSize": "70g", "servingSize": "70g",
        "ingredientsText": "Protein Blend (Whey Protein Concentrate, Whey Protein Isolate) (33%), Almonds (16%), Dates, Dietary Fiber (Oligofructose), Dark Cocoa, Honey, Chia Seeds, Sunflower Lecithin.",
        "nutritionPer100g": {"calories": 402, "totalFat": 14.8, "saturatedFat": 3.8, "transFat": 0.0, "carbohydrates": 38.5, "sugars": 14.2, "addedSugars": 3.2, "fiber": 10.2, "protein": 28.6, "sodium": 170, "salt": 0.42},
        "sourceUrl": "https://www.yogabar.in/products/20g-protein-bar-almond-fudge",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40201402_1-yoga-bar-protein-bar-almond-fudge.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Clean Label Protein Bars", "productType": "No Added Sugar Protein Bar",
        "name": "The Whole Truth 15g Protein Bar Double Cocoa", "brand": "The Whole Truth", "manufacturer": "Fitshit Healthifyme Technologies / The Whole Truth",
        "flavour": "Double Cocoa", "packageSize": "52g", "servingSize": "52g",
        "ingredientsText": "Dates (36%), Whey Protein Isolate (30%), Cashews (18%), Raw Cocoa (12%), Cocoa Butter (4%). No added sugar, no artificial sweeteners, no preservatives.",
        "nutritionPer100g": {"calories": 412, "totalFat": 15.6, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 39.2, "sugars": 28.5, "addedSugars": 0.0, "fiber": 6.8, "protein": 28.8, "sodium": 110, "salt": 0.28},
        "sourceUrl": "https://thewholetruthfoods.com/products/double-cocoa-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40245101_1-the-whole-truth-protein-bar-double-cocoa.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Clean Label Protein Bars", "productType": "No Added Sugar Protein Bar",
        "name": "The Whole Truth 15g Protein Bar Peanut Butter", "brand": "The Whole Truth", "manufacturer": "Fitshit Healthifyme Technologies / The Whole Truth",
        "flavour": "Peanut Butter", "packageSize": "52g", "servingSize": "52g",
        "ingredientsText": "Peanuts (35%), Dates (32%), Whey Protein Isolate (28%), Raw Cocoa (5%). No added sugar, no soy protein, no maltitol.",
        "nutritionPer100g": {"calories": 425, "totalFat": 18.2, "saturatedFat": 3.9, "transFat": 0.0, "carbohydrates": 36.4, "sugars": 24.2, "addedSugars": 0.0, "fiber": 5.9, "protein": 28.8, "sodium": 125, "salt": 0.31},
        "sourceUrl": "https://thewholetruthfoods.com/products/peanut-butter-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40245102_1-the-whole-truth-protein-bar-peanut-butter.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Clean Label Protein Bars", "productType": "No Added Sugar Protein Bar",
        "name": "The Whole Truth 15g Protein Bar Coffee Cocoa", "brand": "The Whole Truth", "manufacturer": "Fitshit Healthifyme Technologies / The Whole Truth",
        "flavour": "Coffee Cocoa", "packageSize": "52g", "servingSize": "52g",
        "ingredientsText": "Dates (38%), Whey Protein Isolate (29%), Almonds (18%), Raw Cocoa (11%), Arabica Coffee Powder (4%).",
        "nutritionPer100g": {"calories": 408, "totalFat": 14.5, "saturatedFat": 3.6, "transFat": 0.0, "carbohydrates": 40.5, "sugars": 29.0, "addedSugars": 0.0, "fiber": 6.5, "protein": 28.8, "sodium": 105, "salt": 0.26},
        "sourceUrl": "https://thewholetruthfoods.com/products/coffee-cocoa-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40245103_1-the-whole-truth-protein-bar-coffee-cocoa.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Daily Protein Snack Bar",
        "name": "RiteBite Max Protein Daily Bar Choco Almond (10g Protein)", "brand": "RiteBite Max Protein", "manufacturer": "Naturell India Pvt. Ltd.",
        "flavour": "Choco Almond", "packageSize": "50g", "servingSize": "50g",
        "ingredientsText": "Protein Blend (Soy Protein Isolate, Whey Protein Concentrate, Calcium Caseinate) (24%), Milk Compound (Sugar, Hydrogenated Vegetable Oil, Milk Solids, Cocoa Solids), Almonds (8%), Dietary Fiber, Honey, Soy Nuggets, Cocoa Powder.",
        "nutritionPer100g": {"calories": 418, "totalFat": 14.2, "saturatedFat": 6.5, "transFat": 0.1, "carbohydrates": 52.4, "sugars": 19.5, "addedSugars": 14.2, "fiber": 8.0, "protein": 20.0, "sodium": 240, "salt": 0.6},
        "sourceUrl": "https://maxprotein.in/products/daily-choco-almond-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40118501_1-ritebite-max-protein-daily-bar-choco-almond.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Daily Protein Snack Bar",
        "name": "RiteBite Max Protein Daily Bar Choco Berry (10g Protein)", "brand": "RiteBite Max Protein", "manufacturer": "Naturell India Pvt. Ltd.",
        "flavour": "Choco Berry", "packageSize": "50g", "servingSize": "50g",
        "ingredientsText": "Protein Blend (Soy Protein Isolate, Whey Protein Concentrate) (23%), Dark Compound (Cocoa Solids, Sugar, Hydrogenated Palm Kernel Oil), Cranberries (7%), Raisins, Dietary Fiber, Honey, Soy Nuggets.",
        "nutritionPer100g": {"calories": 412, "totalFat": 13.8, "saturatedFat": 6.1, "transFat": 0.1, "carbohydrates": 53.8, "sugars": 22.0, "addedSugars": 15.0, "fiber": 7.5, "protein": 20.0, "sodium": 230, "salt": 0.58},
        "sourceUrl": "https://maxprotein.in/products/daily-choco-berry-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40118502_1-ritebite-max-protein-daily-bar-choco-berry.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "High Protein Active Workout Bar",
        "name": "RiteBite Max Protein Active Bar Choco Fudge (20g Protein)", "brand": "RiteBite Max Protein", "manufacturer": "Naturell India Pvt. Ltd.",
        "flavour": "Choco Fudge", "packageSize": "67g", "servingSize": "67g",
        "ingredientsText": "Protein Blend (Soy Nuggets, Whey Protein Concentrate, Calcium Caseinate) (33%), Dark Chocolate Compound (Sugar, Cocoa Solids, Hydrogenated Vegetable Oil), Dietary Fiber (Prebiotic Oligofructose), Rolled Oats, Cocoa Powder, Humectant (Glycerine).",
        "nutritionPer100g": {"calories": 420, "totalFat": 14.5, "saturatedFat": 6.8, "transFat": 0.1, "carbohydrates": 44.0, "sugars": 15.8, "addedSugars": 11.2, "fiber": 9.2, "protein": 29.8, "sodium": 280, "salt": 0.7},
        "sourceUrl": "https://maxprotein.in/products/active-choco-fudge-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40118503_1-ritebite-max-protein-active-bar-choco-fudge.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Ultimate Heavy Duty Protein Bar",
        "name": "RiteBite Max Protein Ultimate Bar Choco Berry (30g Protein)", "brand": "RiteBite Max Protein", "manufacturer": "Naturell India Pvt. Ltd.",
        "flavour": "Choco Berry", "packageSize": "100g", "servingSize": "100g",
        "ingredientsText": "Protein Blend (Whey Protein Isolate, Soy Protein Isolate, Calcium Caseinate) (35%), Dark Chocolate Compound, Dried Cranberries (6%), Black Currants, Almonds, Dietary Fiber, Flaxseeds, Vitamins & Minerals Blend.",
        "nutritionPer100g": {"calories": 415, "totalFat": 13.5, "saturatedFat": 5.9, "transFat": 0.1, "carbohydrates": 43.5, "sugars": 16.5, "addedSugars": 10.5, "fiber": 10.0, "protein": 30.0, "sodium": 310, "salt": 0.78},
        "sourceUrl": "https://maxprotein.in/products/ultimate-choco-berry-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40118504_1-ritebite-max-protein-ultimate-bar-choco-berry.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Gourmet Protein Bar",
        "name": "Phab Protein Bar Strawberries & Cream (10g Protein)", "brand": "Phab", "manufacturer": "Phab Nutrients Pvt. Ltd.",
        "flavour": "Strawberries & Cream", "packageSize": "40g", "servingSize": "40g",
        "ingredientsText": "Protein Blend (Whey Protein Concentrate, Soy Protein Crisps) (28%), White Chocolate Coating (Cocoa Butter, Milk Solids, Erythritol), Freeze Dried Strawberry Pieces (5%), Dietary Fiber, Almond Butter, Natural Vanilla Flavour.",
        "nutritionPer100g": {"calories": 390, "totalFat": 13.0, "saturatedFat": 5.2, "transFat": 0.0, "carbohydrates": 42.0, "sugars": 12.0, "addedSugars": 4.5, "fiber": 8.0, "protein": 25.0, "sodium": 160, "salt": 0.4},
        "sourceUrl": "https://www.getphab.com/products/protein-bar-strawberry-cream",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40225101_1-phab-protein-bar-strawberries-cream.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Gourmet Protein Bar",
        "name": "Phab Protein Bar Mocha Nut (10g Protein)", "brand": "Phab", "manufacturer": "Phab Nutrients Pvt. Ltd.",
        "flavour": "Mocha Nut", "packageSize": "40g", "servingSize": "40g",
        "ingredientsText": "Protein Blend (Whey Protein Concentrate, Milk Protein) (29%), Dark Chocolate (Cocoa Solids, Cocoa Butter, Maltitol), Roasted Cashews (8%), Pure Coffee Extract (3%), Dietary Fiber, Sunflower Lecithin.",
        "nutritionPer100g": {"calories": 398, "totalFat": 14.2, "saturatedFat": 5.5, "transFat": 0.0, "carbohydrates": 40.5, "sugars": 11.2, "addedSugars": 3.8, "fiber": 8.5, "protein": 25.0, "sodium": 165, "salt": 0.41},
        "sourceUrl": "https://www.getphab.com/products/protein-bar-mocha-nut",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40225102_1-phab-protein-bar-mocha-nut.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Sports Nutrition Protein Bar",
        "name": "MuscleBlaze 20g Protein Bar Choco Cranberry", "brand": "MuscleBlaze", "manufacturer": "Bright Lifecare Pvt. Ltd.",
        "flavour": "Choco Cranberry", "packageSize": "68g", "servingSize": "68g",
        "ingredientsText": "Protein Blend (Whey Protein Isolate, Whey Protein Concentrate, Calcium Caseinate) (32%), Dark Chocolate Coating, Dried Cranberries (8%), Rolled Oats, Humectant (Glycerol), Prebiotic Fiber (Isomaltooligosaccharide), Cocoa Butter.",
        "nutritionPer100g": {"calories": 388, "totalFat": 11.5, "saturatedFat": 4.8, "transFat": 0.0, "carbohydrates": 42.5, "sugars": 14.8, "addedSugars": 5.2, "fiber": 9.0, "protein": 29.4, "sodium": 210, "salt": 0.52},
        "sourceUrl": "https://www.muscleblaze.com/sv/muscleblaze-20g-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40198101_1-muscleblaze-protein-bar-choco-cranberry.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Whey & Plant Protein Bars", "productType": "Everyday Fitness Protein Bar",
        "name": "MuscleBlaze 10g Protein Bar Choco Delight", "brand": "MuscleBlaze", "manufacturer": "Bright Lifecare Pvt. Ltd.",
        "flavour": "Choco Delight", "packageSize": "35g", "servingSize": "35g",
        "ingredientsText": "Protein Blend (Whey Protein Concentrate, Soy Crisps) (30%), Chocolate Coating, Cocoa Solids, Almonds, Dietary Fiber (FOS), Humectant (Glycerin), Soy Lecithin.",
        "nutritionPer100g": {"calories": 395, "totalFat": 12.8, "saturatedFat": 5.1, "transFat": 0.0, "carbohydrates": 44.0, "sugars": 15.5, "addedSugars": 6.0, "fiber": 7.5, "protein": 28.5, "sodium": 190, "salt": 0.48},
        "sourceUrl": "https://www.muscleblaze.com/sv/muscleblaze-10g-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40198102_1-muscleblaze-10g-protein-bar-choco-delight.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Granola & Energy Bars", "productType": "Whole Grain Granola Bar",
        "name": "Nature Valley Crunchy Granola Bar Oats & Dark Chocolate", "brand": "Nature Valley", "manufacturer": "General Mills India Pvt. Ltd.",
        "flavour": "Oats & Dark Chocolate", "packageSize": "42g", "servingSize": "42g",
        "ingredientsText": "Whole Grain Rolled Oats (56%), Sugar, Sunflower Oil, Dark Chocolate Pieces (Cocoa Mass, Sugar, Cocoa Butter) (8%), Fat Reduced Cocoa Powder, Honey, Salt, Molasses, Sunflower Lecithin.",
        "nutritionPer100g": {"calories": 465, "totalFat": 18.5, "saturatedFat": 4.2, "transFat": 0.0, "carbohydrates": 64.2, "sugars": 26.5, "addedSugars": 22.0, "fiber": 6.8, "protein": 8.5, "sodium": 320, "salt": 0.8},
        "sourceUrl": "https://www.naturevalley.com/products/crunchy-oats-dark-chocolate",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40003401_1-nature-valley-crunchy-granola-bar-oats-dark-chocolate.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "Granola & Energy Bars", "productType": "Whole Grain Granola Bar",
        "name": "Nature Valley Crunchy Granola Bar Roasted Almond", "brand": "Nature Valley", "manufacturer": "General Mills India Pvt. Ltd.",
        "flavour": "Roasted Almond", "packageSize": "42g", "servingSize": "42g",
        "ingredientsText": "Whole Grain Rolled Oats (54%), Sugar, Sunflower Oil, Roasted Almond Pieces (9%), Honey, Salt, Molasses, Sunflower Lecithin, Natural Flavouring.",
        "nutritionPer100g": {"calories": 472, "totalFat": 19.8, "saturatedFat": 2.5, "transFat": 0.0, "carbohydrates": 62.5, "sugars": 25.0, "addedSugars": 21.0, "fiber": 6.2, "protein": 9.1, "sodium": 310, "salt": 0.78},
        "sourceUrl": "https://www.naturevalley.com/products/crunchy-roasted-almond",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40003402_1-nature-valley-crunchy-granola-bar-roasted-almond.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "High Protein Low Carb Bars", "productType": "Triple Layered High Protein Bar",
        "name": "Grenade Carb Killa High Protein Bar White Chocolate Cookie", "brand": "Grenade", "manufacturer": "Grenade UK / Mondelez International",
        "flavour": "White Chocolate Cookie", "packageSize": "60g", "servingSize": "60g",
        "ingredientsText": "Protein Blend (Calcium Caseinate, Whey Protein Isolate) (35%), White Chocolate Coating with Sweetener (Maltitol, Cocoa Butter, Whole Milk Powder) (23%), Collagen Hydrolysate, Humectant (Glycerol), Soy Crisps, Cocoa Butter.",
        "nutritionPer100g": {"calories": 360, "totalFat": 15.0, "saturatedFat": 8.5, "transFat": 0.0, "carbohydrates": 33.0, "sugars": 2.5, "addedSugars": 0.0, "fiber": 7.0, "protein": 36.6, "sodium": 340, "salt": 0.85},
        "sourceUrl": "https://www.grenade.com/products/white-chocolate-cookie-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40289101_1-grenade-carb-killa-white-chocolate-cookie.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "High Protein Low Carb Bars", "productType": "Triple Layered High Protein Bar",
        "name": "Grenade Carb Killa High Protein Bar Salted Caramel", "brand": "Grenade", "manufacturer": "Grenade UK / Mondelez International",
        "flavour": "Salted Caramel", "packageSize": "60g", "servingSize": "60g",
        "ingredientsText": "Protein Blend (Calcium Caseinate, Whey Protein Isolate) (34%), Milk Chocolate Coating with Sweetener (Maltitol, Cocoa Butter, Milk Powder), Caramel Layer (Polydextrose, Sweetened Condensed Milk), Humectant (Glycerol), Cocoa Soy Crisps, Sea Salt.",
        "nutritionPer100g": {"calories": 365, "totalFat": 15.5, "saturatedFat": 8.2, "transFat": 0.0, "carbohydrates": 33.5, "sugars": 2.8, "addedSugars": 0.0, "fiber": 6.8, "protein": 36.6, "sodium": 420, "salt": 1.05},
        "sourceUrl": "https://www.grenade.com/products/salted-caramel-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40289102_1-grenade-carb-killa-salted-caramel.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "High Protein Low Carb Bars", "productType": "Gluten-Free Low Sugar Protein Bar",
        "name": "Quest Nutrition Protein Bar Chocolate Chip Cookie Dough", "brand": "Quest Nutrition", "manufacturer": "Simply Good Foods USA",
        "flavour": "Chocolate Chip Cookie Dough", "packageSize": "60g", "servingSize": "60g",
        "ingredientsText": "Protein Blend (Milk Protein Isolate, Whey Protein Isolate) (36%), Soluble Corn Fiber, Almonds, Water, Unsweetened Chocolate (9%), Erythritol, Cocoa Butter, Sea Salt, Stevia Extract.",
        "nutritionPer100g": {"calories": 335, "totalFat": 15.0, "saturatedFat": 5.0, "transFat": 0.0, "carbohydrates": 36.5, "sugars": 1.7, "addedSugars": 0.0, "fiber": 23.3, "protein": 35.0, "sodium": 350, "salt": 0.88},
        "sourceUrl": "https://www.questnutrition.com/products/chocolate-chip-cookie-dough-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40156101_1-quest-nutrition-protein-bar-chocolate-chip-cookie-dough.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "High Protein Low Carb Bars", "productType": "Gluten-Free Low Sugar Protein Bar",
        "name": "Quest Nutrition Protein Bar Cookies & Cream", "brand": "Quest Nutrition", "manufacturer": "Simply Good Foods USA",
        "flavour": "Cookies & Cream", "packageSize": "60g", "servingSize": "60g",
        "ingredientsText": "Protein Blend (Milk Protein Isolate, Whey Protein Isolate) (35%), Soluble Corn Fiber, Almonds, Water, Cocoa Butter, Natural Flavors, Erythritol, Cocoa Processed with Alkali, Sea Salt, Sucralose.",
        "nutritionPer100g": {"calories": 333, "totalFat": 13.3, "saturatedFat": 5.0, "transFat": 0.0, "carbohydrates": 36.7, "sugars": 1.7, "addedSugars": 0.0, "fiber": 25.0, "protein": 35.0, "sodium": 360, "salt": 0.9},
        "sourceUrl": "https://www.questnutrition.com/products/cookies-and-cream-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40156102_1-quest-nutrition-protein-bar-cookies-cream.jpg"
    },
    {
        "cat_num": 5, "category": "Protein Bars, Energy Bars & Wafers", "categorySlug": "protein-bars-energy-bars-wafers",
        "subCategory": "High Protein Low Carb Bars", "productType": "Candy-Style High Protein Bar",
        "name": "Snickers Hi-Protein Bar Low Sugar (20g Protein)", "brand": "Snickers", "manufacturer": "Mars Wrigley Confectionery",
        "flavour": "Peanut & Caramel Chocolate", "packageSize": "57g", "servingSize": "57g",
        "ingredientsText": "Protein Blend (Milk Protein Isolate, Whey Protein Concentrate, Soya Lecithin) (35%), Milk Chocolate with Sweetener (Maltitol, Cocoa Butter, Whole Milk Powder), Caramel (12%), Roasted Peanuts (10%), Hydrolysed Collagen, Humectant (Glycerol).",
        "nutritionPer100g": {"calories": 382, "totalFat": 15.2, "saturatedFat": 6.8, "transFat": 0.0, "carbohydrates": 35.0, "sugars": 3.4, "addedSugars": 0.0, "fiber": 4.5, "protein": 35.1, "sodium": 320, "salt": 0.8},
        "sourceUrl": "https://www.snickers.com/hi-protein-bar",
        "remoteImageUrl": "https://www.bbassets.com/media/uploads/p/l/40289103_1-snickers-hi-protein-bar-low-sugar.jpg"
    }
]

print(f"Batch 2 category 5 prepared: {len(BATCH2_RAW)} items")
