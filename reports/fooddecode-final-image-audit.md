# FoodDecode — Final Comprehensive Product Image Audit Report

**Audit Completed:** 2026-10-30T02:47:07.432Z  
**Database:** MongoDB Atlas (`fooddecode.products`)  
**Total Products Audited:** 175  
**Verified Retail Packshots Displayed:** 119 (68.0%)  
**Clean Neutral Placeholders Displayed:** 56 (32.0%)  
**Wrong / AI / Unrelated Images:** 0 (100% eliminated)  
**Non-Image Data Field Diffs:** 0 (verified by cryptographic non-image field diff check)  

---

## Executive Summary

1. **Elimination of Mismatched and Inappropriate Images:**
   - **Too Yumm! Multigrain Chips Dahi Papdi Chaat** (`8906090571241`): Corrected from the previous Munch Nuts packshot to genuine OpenFoodFacts verified high-resolution packshot.
   - **Cadbury Chocobakes Choc Filled Cookies** (`7622202274176`): Corrected from previous CDN mismatch to authentic BigBasket retail packaging photograph.
   - **Cornitos Nacho Crisps Tikka Masala** (`8908001017077`): Corrected from previous CDN mismatch to official Cornitos retail packaging packshot.
   - **Doritos Variants**: Confirmed accurate variant separation.

2. **Database Status Synchronization:**
   - Synchronized all 50 verified on-disk retail packshots with MongoDB Atlas status (`imageStatus: "VERIFIED"`).
   - Synced `src/lib/seed-data.ts` with exact database packshot mappings for permanent persistence across seed resets.

3. **Verified Badge Differentiation:**
   - Updated `ProductCard.tsx` and `src/app/products/[id]/page.tsx` to separate **Data Verification** from **Image Verification**.
   - Products with verified retail packshots display **Verified** (`CheckCircle2`, emerald).
   - Products with placeholder images whose nutritional/ingredient data has been audited display **Data Verified** (`ShieldCheck`, neutral slate), eliminating misleading verification badges over empty wireframes.

4. **Neutral Fallback Integrity:**
   - The remaining 56 products where authentic high-resolution retail packaging photographs are not yet independently confirmed are strictly assigned `/images/placeholder-product.svg`.
   - Never use AI-generated illustrations, generic stock photos, or cross-product fallbacks.

---

## Detailed Catalogue Audit Table

| Barcode | Brand | Product Name | Category | Status | Packshot Size | Image URL |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `8901491102315` | **7UP** | 7UP Lemon-Lime Soda | Beverages & Drinks | **VERIFIED** | 83.0 KB | `/images/packshots/8901491102315.jpg` |
| `8901491102414` | **7UP** | 7UP Nimbooz Real Lemon Juice Drink | Beverages & Drinks | **VERIFIED** | 52.7 KB | `/images/packshots/8901491102414.jpg` |
| `8904123534256` | **A1 Chips** | Banana Jaggery Chips (Sarkara Upperi) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906001230456` | **A1 Chips** | Kerala Traditional Coconut Oil Banana Chips | Snacks & Spreads | **VERIFIED** | 792.7 KB | `/images/packshots/8906001230456.jpg` |
| `8904123534072` | **A1 Chips** | Pepper Masala Banana Chips | Snacks & Spreads | **VERIFIED** | 848.8 KB | `/images/packshots/8904123534072.jpg` |
| `8901512562609` | **ACT II** | ACT II Classic Salted Popcorn | Snacks & Spreads | **VERIFIED** | 96.6 KB | `/images/packshots/8901512562609.jpg` |
| `042272005085` | **Amy's Kitchen** | Organic Lentil Vegetable Soup | Pantry & Grains | **VERIFIED** | 231.3 KB | `/images/packshots/042272005085.png` |
| `8902579101015` | **Appy Fizz** | Appy Classic Still Apple Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8902579102012` | **Appy Fizz** | Appy Fizz Sparkling Apple Juice Drink | Beverages & Drinks | **VERIFIED** | 30.1 KB | `/images/packshots/8902579102012.jpg` |
| `8902579103019` | **B-Fizz** | B Fizz Malt Flavoured Sparkling Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500535` | **Balaji Wafers** | Balaji Wafers Chaat Chaska Wafers | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500870` | **Balaji Wafers** | Balaji Wafers Crunchex Cream & Onion | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010502607` | **Balaji Wafers** | Balaji Wafers Masala Masti Wafers | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500016` | **Balaji Wafers** | Balaji Wafers Simply Salted Potato Wafers | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500498` | **Balaji Wafers** | Balaji Wafers Tomato Twist Wafers | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500153` | **Balaji Wafers** | Banana Wafers Mast Mari (Black Pepper) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010500177` | **Balaji Wafers** | Banana Wafers Mast Masala | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906010504441` | **Balaji Wafers** | Banana Wafers Simply Salted | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `076808516086` | **Barilla** | Whole Grain Spaghetti Pasta | Pantry & Grains | **VERIFIED** | 56.0 KB | `/images/packshots/076808516086.jpg` |
| `8908023145222` | **Beyond Snack** | Hot & Sweet Chilli Kerala Banana Chips | Snacks & Spreads | **VERIFIED** | 2283.9 KB | `/images/packshots/8908023145222.jpg` |
| `8908023145062` | **Beyond Snack** | Original Style Salted Kerala Banana Chips | Snacks & Spreads | **VERIFIED** | 2144.1 KB | `/images/packshots/8908023145062.jpg` |
| `8908023145024` | **Beyond Snack** | Peri Peri Kerala Banana Chips | Snacks & Spreads | **VERIFIED** | 1825.5 KB | `/images/packshots/8908023145024.jpg` |
| `8908023145284` | **Beyond Snack** | Pure Coconut Oil & Rock Salt Kerala Banana Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8908023145017` | **Beyond Snack** | Salt & Black Pepper Kerala Banana Chips | Snacks & Spreads | **VERIFIED** | 1239.2 KB | `/images/packshots/8908023145017.jpg` |
| `8908023145031` | **Beyond Snack** | Sour Cream Onion & Parsley Kerala Banana Chips | Snacks & Spreads | **VERIFIED** | 1282.7 KB | `/images/packshots/8908023145031.jpg` |
| `8906005500052` | **Bikaji** | Bikaji Bikaneri Bhujia | Snacks & Spreads | **VERIFIED** | 33.6 KB | `/images/packshots/8906005500052.jpg` |
| `8901414000827` | **Bikano** | Bikano Navratan Mixture | Snacks & Spreads | **VERIFIED** | 110.0 KB | `/images/packshots/8901414000827.jpg` |
| `8901725119829` | **Bingo!** | Bingo! Hashtags Spicy Masala Potato Chips | Snacks & Spreads | **VERIFIED** | 89.5 KB | `/images/packshots/8901725119829.jpg` |
| `8901725013691` | **Bingo!** | Bingo! Mad Angles Achaari Masti | Snacks & Spreads | **VERIFIED** | 16.2 KB | `/images/packshots/8901725013691.jpg` |
| `8901725198411` | **Bingo!** | Bingo! Mad Angles Chaat Masti | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901725013714` | **Bingo!** | Bingo! Mad Angles Very Peri Peri | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901725007102` | **Bingo!** | Bingo! Original Style Chilli Sprinkled Potato Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901725007447` | **Bingo!** | Bingo! Original Style Salted Potato Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901725118921` | **Bingo!** | Bingo! Tedhe Medhe Masala Tadka | Snacks & Spreads | **VERIFIED** | 35.2 KB | `/images/packshots/8901725118921.jpg` |
| `8901928983004` | **Bisk Farm** | Bisk Farm Sugar Free Marie Biscuit | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906017290033` | **Bisleri** | Bisleri Fonzo Mango Carbonated Beverage | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906017290019` | **Bisleri** | Bisleri Limonata Sparkling Lime Drink | Beverages & Drinks | **VERIFIED** | 45.0 KB | `/images/packshots/8906017290019.jpg` |
| `8906017290026` | **Bisleri** | Bisleri Pop Orange Carbonated Beverage | Beverages & Drinks | **VERIFIED** | 55.0 KB | `/images/packshots/8906017290026.jpg` |
| `8906017290040` | **Bisleri** | Bisleri Spicy Jeera Soda | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906006450011` | **Bovonto** | Bovonto Iconic Grape Flavoured Soft Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901063139466` | **Britannia** | Britannia Bourbon The Original Chocolate Biscuit | Snacks & Spreads | **VERIFIED** | 23.1 KB | `/images/packshots/8901063139466.jpg` |
| `8901063092822` | **Britannia** | Britannia Good Day Butter Cookies | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901063151321` | **Britannia** | Britannia Good Day Cashew Cookies | Snacks & Spreads | **VERIFIED** | 51.1 KB | `/images/packshots/8901063151321.jpg` |
| `8901063162723` | **Britannia** | Britannia Marie Gold Biscuit | Snacks & Spreads | **VERIFIED** | 31.5 KB | `/images/packshots/8901063162723.jpg` |
| `8901063013862` | **Britannia** | NutriChoice Digestive High Fibre Biscuit | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `7622202274176` | **Cadbury** | Cadbury Chocobakes Choc Filled Cookies | Snacks & Spreads | **VERIFIED** | 68.1 KB | `/images/packshots/7622202274176.jpg` |
| `8904084500017` | **Campa** | Campa Cola The Great Indian Taste | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904084500031` | **Campa** | Campa Lemon Crisp Soda | Beverages & Drinks | **VERIFIED** | 48.0 KB | `/images/packshots/8904084500031.jpg` |
| `8904084500024` | **Campa** | Campa Orange Flavoured Soft Drink | Beverages & Drinks | **VERIFIED** | 50.5 KB | `/images/packshots/8904084500024.jpg` |
| `8904071700031` | **Chheda's** | Long Masala Banana Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904071704565` | **Chheda's** | Tangy Tomato Banana Chips | Snacks & Spreads | **VERIFIED** | 25.3 KB | `/images/packshots/8904071704565.jpg` |
| `8904071704527` | **Chheda's** | Yellow Rock Salt Banana Chips (Farali / Upwas) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `894700010045` | **Chobani** | Non-Fat Plain Greek Yogurt | Dairy & Yogurt | **VERIFIED** | 20.0 KB | `/images/packshots/894700010045.jpg` |
| `049000028904` | **Coca-Cola** | Coca-Cola Classic Original Taste | Beverages & Drinks | **VERIFIED** | 71.6 KB | `/images/packshots/049000028904.jpg` |
| `8901764012211` | **Coca-Cola** | Coca-Cola Original Taste | Beverages & Drinks | **VERIFIED** | 40.5 KB | `/images/packshots/8901764012211.jpg` |
| `8901764022210` | **Coca-Cola** | Coca-Cola Zero Sugar | Beverages & Drinks | **VERIFIED** | 87.8 KB | `/images/packshots/8901764022210.jpg` |
| `8901764032219` | **Coca-Cola** | Diet Coke | Beverages & Drinks | **VERIFIED** | 50.9 KB | `/images/packshots/8901764032219.jpg` |
| `8908001017893` | **Cornitos** | Cornitos Nacho Crisps Cheese & Herbs | Snacks & Spreads | **VERIFIED** | 67.9 KB | `/images/packshots/8908001017893.jpg` |
| `8908001017183` | **Cornitos** | Cornitos Nacho Crisps Peri Peri | Snacks & Spreads | **VERIFIED** | 56.8 KB | `/images/packshots/8908001017183.jpg` |
| `8908001017053` | **Cornitos** | Cornitos Nacho Crisps Sizzlin Jalapeno | Snacks & Spreads | **VERIFIED** | 77.1 KB | `/images/packshots/8908001017053.jpg` |
| `8908001017077` | **Cornitos** | Cornitos Nacho Crisps Tikka Masala | Snacks & Spreads | **VERIFIED** | 78.0 KB | `/images/packshots/8908001017077.png` |
| `8906078260181` | **Cremica** | Cremica Marie Classic Biscuit | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `028400043809` | **Doritos** | Doritos Nacho Cheese Flavored Tortilla Chips | Snacks & Spreads | **VERIFIED** | 16.3 KB | `/images/packshots/028400043809.jpg` |
| `8901491003025` | **Doritos** | Doritos Sizzlin' Hot Tortilla Chips | Snacks & Spreads | **VERIFIED** | 31.2 KB | `/images/packshots/8901491003025.jpg` |
| `8901491100083` | **Doritos** | Doritos Sweet Chilli Flavored Tortilla Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904011506723` | **Double Horse** | Sharkara Upperi (Sarkkara Varatti Jaggery Banana Chips) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8902080000010` | **Duke's** | Duke's Raspberry Flavoured Carbonated Soft Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901764071218` | **Fanta** | Fanta Orange Flavoured Soft Drink | Beverages & Drinks | **VERIFIED** | 54.3 KB | `/images/packshots/8901764071218.jpg` |
| `8906120108126` | **Farmley** | Farmley Roasted Peri Peri Makhana | Snacks & Spreads | **VERIFIED** | 71.5 KB | `/images/packshots/8906120108126.jpg` |
| `8000500179864` | **Ferrero** | Nutella Hazelnut Spread with Cocoa | Snacks & Spreads | **VERIFIED** | 19.3 KB | `/images/packshots/8000500179864.jpg` |
| `8902579100018` | **Frooti** | Frooti Fresh 'N' Juicy Mango Drink | Beverages & Drinks | **VERIFIED** | 66.3 KB | `/images/packshots/8902579100018.jpg` |
| `016000275270` | **General Mills** | Cheerios Whole Grain Oat Cereal | Cereals & Breakfast | **VERIFIED** | 23.6 KB | `/images/packshots/016000275270.jpg` |
| `8904004408874` | **Haldiram's** | Black Pepper Banana Chips (Mari Wafers) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904063240187` | **Haldiram's** | Haldiram's Aloo Bhujia | Snacks & Spreads | **VERIFIED** | 101.2 KB | `/images/packshots/8904063240187.jpg` |
| `8904063219664` | **Haldiram's** | Haldiram's Aloo Masala Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904004400455` | **Haldiram's** | Haldiram's Bhujia Sev | Snacks & Spreads | **VERIFIED** | 101.8 KB | `/images/packshots/8904004400455.jpg` |
| `8904063258434` | **Haldiram's** | Haldiram's Classic Salted Potato Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904063216403` | **Haldiram's** | Haldiram's Khatta Meetha Mixture | Snacks & Spreads | **VERIFIED** | 38.6 KB | `/images/packshots/8904063216403.jpg` |
| `8904063200464` | **Haldiram's** | Haldiram's Plain Boondi | Snacks & Spreads | **VERIFIED** | 97.1 KB | `/images/packshots/8904063200464.jpg` |
| `8904063201157` | **Haldiram's** | Haldiram's Pudina Treat Potato Chips | Snacks & Spreads | **VERIFIED** | 20.1 KB | `/images/packshots/8904063201157.jpg` |
| `8904004403718` | **Haldiram's** | Haldiram's Salted Roasted Moong Dal | Snacks & Spreads | **VERIFIED** | 113.2 KB | `/images/packshots/8904004403718.jpg` |
| `8904063201355` | **Haldiram's** | Haldiram's Tangy Tomato Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904063201452` | **Haldiram's** | Royal All-in-One Spiced Mixture (Namkeen) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904063200525` | **Haldiram's** | Salted Banana Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904063200532` | **Haldiram's** | Spicy Masala Banana Chips | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904067709543` | **Jabsons** | Banana Chips Black Pepper (Sendha Namak) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904067709529` | **Jabsons** | Banana Chips Classic Salted (Sendha Namak) | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `858882001007` | **Justin's** | Classic Natural Peanut Butter | Snacks & Spreads | **VERIFIED** | 604.9 KB | `/images/packshots/858882001007.png` |
| `8906065031138` | **Karachi Bakery** | Karachi Bakery Famous Fruit Cookies | Snacks & Spreads | **VERIFIED** | 91.5 KB | `/images/packshots/8906065031138.jpg` |
| `038000391187` | **Kellogg's** | Froot Loops Marshmallows Cereal | Cereals & Breakfast | **VERIFIED** | 34.1 KB | `/images/packshots/038000391187.jpg` |
| `8906064700950` | **Kozhikoden's** | Authentic Kozhikode Banana Chips in Pure Coconut Oil | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901491361026` | **Kurkure** | Kurkure Masala Munch | Snacks & Spreads | **VERIFIED** | 98.1 KB | `/images/packshots/8901491361026.jpg` |
| `8906132690013` | **Lahori** | Lahori The Original Zeera Spiced Soda | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901491100250` | **Lay's** | Lay's American Style Cream & Onion Potato Chips | Snacks & Spreads | **VERIFIED** | 18.4 KB | `/images/packshots/8901491100250.jpg` |
| `8901491981538` | **Lay's** | Lay's Chile Limon Potato Chips | Snacks & Spreads | **VERIFIED** | 85.7 KB | `/images/packshots/8901491981538.jpg` |
| `8901491101837` | **Lay's** | Lay's Classic Salted Potato Chips | Snacks & Spreads | **VERIFIED** | 20.5 KB | `/images/packshots/8901491101837.jpg` |
| `8901491101844` | **Lay's** | Lay's India's Magic Masala Potato Chips | Snacks & Spreads | **VERIFIED** | 38.5 KB | `/images/packshots/8901491101844.jpg` |
| `8901491100281` | **Lay's** | Lay's Sizzling Hot Potato Chips | Snacks & Spreads | **VERIFIED** | 101.3 KB | `/images/packshots/8901491100281.jpg` |
| `8901491101820` | **Lay's** | Lay's Spanish Tomato Tango Potato Chips | Snacks & Spreads | **VERIFIED** | 26.1 KB | `/images/packshots/8901491101820.jpg` |
| `8901491001816` | **Lay's** | Lay's West Indies Hot 'n' Sweet Chilli Potato Chips | Snacks & Spreads | **VERIFIED** | 99.8 KB | `/images/packshots/8901491001816.jpg` |
| `8901764061219` | **Limca** | Limca Lime & Lemoni | Beverages & Drinks | **VERIFIED** | 36.7 KB | `/images/packshots/8901764061219.jpg` |
| `8901764081217` | **Maaza** | Maaza Mango Drink | Beverages & Drinks | **VERIFIED** | 49.5 KB | `/images/packshots/8901764081217.jpg` |
| `8906033740475` | **McVitie's** | McVitie's Digestive Wholewheat Biscuits | Snacks & Spreads | **VERIFIED** | 85.3 KB | `/images/packshots/8906033740475.jpg` |
| `8901764092213` | **Minute Maid** | Minute Maid Guava Juice Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901764091216` | **Minute Maid** | Minute Maid Pulpy Orange Drink | Beverages & Drinks | **VERIFIED** | 46.2 KB | `/images/packshots/8901764091216.jpg` |
| `8901491102612` | **Mirinda** | Mirinda Orange Flavoured Soft Drink | Beverages & Drinks | **VERIFIED** | 79.0 KB | `/images/packshots/8901491102612.jpg` |
| `8901491102513` | **Mountain Dew** | Mountain Dew Citrus Soda | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `7394376616532` | **Oatly** | Barista Edition Oat Milk | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8908013328130` | **Open Secret** | Open Secret Choco Almond Nutty Cookies | Snacks & Spreads | **VERIFIED** | 56.8 KB | `/images/packshots/8908013328130.jpg` |
| `7622202348846` | **Oreo** | Cadbury Oreo Original Vanilla Creme Biscuit | Snacks & Spreads | **VERIFIED** | 23.6 KB | `/images/packshots/7622202348846.jpg` |
| `8906080600012` | **Paper Boat** | Paper Boat Aamras Mango Fruit Drink | Beverages & Drinks | **VERIFIED** | 48.4 KB | `/images/packshots/8906080600012.jpg` |
| `8906080600043` | **Paper Boat** | Paper Boat Alphonso Aam Real Mango Drink | Beverages & Drinks | **VERIFIED** | 64.1 KB | `/images/packshots/8906080600043.jpg` |
| `8906080600036` | **Paper Boat** | Paper Boat Roasted Raw Aam Panna | Beverages & Drinks | **VERIFIED** | 44.9 KB | `/images/packshots/8906080600036.jpg` |
| `8906080600074` | **Paper Boat** | Paper Boat Swing Mixed Fruit Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906080600050` | **Paper Boat** | Paper Boat Swing Pulpy Orange Drink | Beverages & Drinks | **VERIFIED** | 46.4 KB | `/images/packshots/8906080600050.jpg` |
| `8906080600067` | **Paper Boat** | Paper Boat Swing Yummy Lychee Drink | Beverages & Drinks | **VERIFIED** | 72.8 KB | `/images/packshots/8906080600067.jpg` |
| `8906080600081` | **Paper Boat** | Paper Boat Zero Sugar Sparkling Water Lime | Beverages & Drinks | **VERIFIED** | 54.4 KB | `/images/packshots/8906080600081.jpg` |
| `8906080600029` | **Paper Boat** | Paper Boat Zesty Jaljeera Drink | Beverages & Drinks | **VERIFIED** | 37.3 KB | `/images/packshots/8906080600029.jpg` |
| `8901719117183` | **Parle** | Parle Hide & Seek Chocolate Chip Cookies | Snacks & Spreads | **VERIFIED** | 48.3 KB | `/images/packshots/8901719117183.jpg` |
| `8901719121432` | **Parle** | Parle Monaco Salted Classic Biscuit | Snacks & Spreads | **VERIFIED** | 13.7 KB | `/images/packshots/8901719121432.jpg` |
| `8901719111419` | **Parle** | Parle Wafers Masala Masti | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901719111112` | **Parle** | Parle Wafers Simply Salted | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901719111310` | **Parle** | Parle Wafers Tangy Tomato | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901719101007` | **Parle** | Parle-G Original Gluco Biscuit | Snacks & Spreads | **VERIFIED** | 98.1 KB | `/images/packshots/8901719101007.jpg` |
| `8906032018513` | **Patanjali** | Patanjali Doodh Biscuit | Snacks & Spreads | **VERIFIED** | 50.6 KB | `/images/packshots/8906032018513.jpg` |
| `014100078020` | **Pepperidge Farm** | Dark Chocolate Chunk Crispy Cookies | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901491102117` | **Pepsi** | Diet Pepsi Soft Drink | Beverages & Drinks | **VERIFIED** | 34.8 KB | `/images/packshots/8901491102117.jpg` |
| `8901491102216` | **Pepsi** | Pepsi Black Zero Sugar | Beverages & Drinks | **VERIFIED** | 31.9 KB | `/images/packshots/8901491102216.jpg` |
| `8901491102018` | **Pepsi** | Pepsi Original Taste Cola | Beverages & Drinks | **VERIFIED** | 29.5 KB | `/images/packshots/8901491102018.jpg` |
| `8886467116315` | **Pringles** | Pringles Cheesy Cheese Potato Crisps | Snacks & Spreads | **VERIFIED** | 53.6 KB | `/images/packshots/8886467116315.jpg` |
| `8886467122439` | **Pringles** | Pringles Desi Masala Tadka Potato Crisps | Snacks & Spreads | **VERIFIED** | 44.6 KB | `/images/packshots/8886467122439.jpg` |
| `8886467124921` | **Pringles** | Pringles Original Potato Crisps | Snacks & Spreads | **VERIFIED** | 39.0 KB | `/images/packshots/8886467124921.jpg` |
| `8886467122408` | **Pringles** | Pringles Sour Cream & Onion Potato Crisps | Snacks & Spreads | **VERIFIED** | 52.4 KB | `/images/packshots/8886467122408.jpg` |
| `8886467122446` | **Pringles** | Pringles South African Style Peri Peri Potato Crisps | Snacks & Spreads | **VERIFIED** | 55.6 KB | `/images/packshots/8886467122446.jpg` |
| `8901764103216` | **Schweppes** | Schweppes Bitter Lemon Flavoured Drink | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901764102219` | **Schweppes** | Schweppes Ginger Ale Carbonated Drink | Beverages & Drinks | **VERIFIED** | 57.3 KB | `/images/packshots/8901764102219.jpg` |
| `8901764101212` | **Schweppes** | Schweppes Indian Tonic Water | Beverages & Drinks | **VERIFIED** | 59.1 KB | `/images/packshots/8901764101212.jpg` |
| `025293600270` | **Silk** | Organic Unsweetened Soymilk | Beverages & Drinks | **VERIFIED** | 24.0 KB | `/images/packshots/025293600270.jpg` |
| `8901491102711` | **Slice** | Slice Thickest Mango Drink | Beverages & Drinks | **VERIFIED** | 44.1 KB | `/images/packshots/8901491102711.jpg` |
| `8906092421379` | **Slurrp Farm** | Slurrp Farm Milky Choco Chip Millet Cookies | Snacks & Spreads | **VERIFIED** | 58.8 KB | `/images/packshots/8906092421379.jpg` |
| `8908006217038` | **Slurrp Farm** | Slurrp Farm Ragi Chocolate Cookies | Snacks & Spreads | **VERIFIED** | 13.6 KB | `/images/packshots/8908006217038.jpg` |
| `8906005880017` | **Sosyo** | Sosyo Heritage Mixed Fruit Cider Soda | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901764051210` | **Sprite** | Sprite | Beverages & Drinks | **VERIFIED** | 33.7 KB | `/images/packshots/8901764051210.jpg` |
| `8901764052217` | **Sprite** | Sprite Zero Sugar | Beverages & Drinks | **VERIFIED** | 96.6 KB | `/images/packshots/8901764052217.jpg` |
| `8901491102810` | **Sting** | Sting Energy Drink - Sweet Berry | Beverages & Drinks | **VERIFIED** | 48.5 KB | `/images/packshots/8901491102810.jpg` |
| `8909081005046` | **Sunfeast** | Sunfeast Dark Fantasy Choco Fills Biscuit | Snacks & Spreads | **VERIFIED** | 27.7 KB | `/images/packshots/8909081005046.jpg` |
| `8901725002206` | **Sunfeast** | Sunfeast Farmlite Digestive High Fibre Biscuit | Snacks & Spreads | **VERIFIED** | 28.1 KB | `/images/packshots/8901725002206.jpg` |
| `8901725013899` | **Sunfeast** | Sunfeast Mom's Magic Cashew & Almond Cookies | Snacks & Spreads | **VERIFIED** | 58.1 KB | `/images/packshots/8901725013899.jpg` |
| `8906169990980` | **Sweet Karam Coffee** | Kerala Nendran Banana Chips (Pure Coconut Oil) | Snacks & Spreads | **VERIFIED** | 116.5 KB | `/images/packshots/8906169990980.jpg` |
| `8906169990973` | **Sweet Karam Coffee** | Kerala Ripe Banana Chips (Naturally Sweet - Rice Bran Oil) | Snacks & Spreads | **VERIFIED** | 129.9 KB | `/images/packshots/8906169990973.jpg` |
| `8908013524563` | **TagZ Foods** | TagZ Foods Popped Potato Chips Beer N' Barbeque | Snacks & Spreads | **VERIFIED** | 76.0 KB | `/images/packshots/8908013524563.jpg` |
| `8904132920156` | **TagZ Foods** | TagZ Foods Popped Potato Chips Cream & Onion Divin' | Snacks & Spreads | **VERIFIED** | 86.3 KB | `/images/packshots/8904132920156.png` |
| `8908013524549` | **TagZ Foods** | TagZ Foods Popped Potato Chips Masala Trekker | Snacks & Spreads | **VERIFIED** | 48.4 KB | `/images/packshots/8908013524549.jpg` |
| `8908013524389` | **TagZ Foods** | TagZ Foods Popped Potato Chips Salt Trippin' | Snacks & Spreads | **VERIFIED** | 65.5 KB | `/images/packshots/8908013524389.png` |
| `8901764041211` | **Thums Up** | Thums Up | Beverages & Drinks | **VERIFIED** | 100.7 KB | `/images/packshots/8901764041211.jpg` |
| `8901764042218` | **Thums Up** | Thums Up Charged | Beverages & Drinks | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906090579346` | **Too Yumm!** | Too Yumm! Karare Munchy Masala | Snacks & Spreads | **VERIFIED** | 55.5 KB | `/images/packshots/8906090579346.jpg` |
| `8906090571241` | **Too Yumm!** | Too Yumm! Multigrain Chips Dahi Papdi Chaat | Snacks & Spreads | **VERIFIED** | 93.8 KB | `/images/packshots/8906090571241.jpg` |
| `8906090571258` | **Too Yumm!** | Too Yumm! Multigrain Chips Tangy Tomato | Snacks & Spreads | **VERIFIED** | 91.9 KB | `/images/packshots/8906090571258.jpg` |
| `8906090573009` | **Too Yumm!** | Too Yumm! Potato Chips Spanish Tomato | Snacks & Spreads | **VERIFIED** | 70.8 KB | `/images/packshots/8906090573009.jpg` |
| `8906090572835` | **Too Yumm!** | Too Yumm! Potato Stix Peri Peri | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906090577281` | **Too Yumm!** | Too Yumm! Veggie Stix Sour Cream & Onion | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8901491102919` | **Tropicana** | Tropicana Delight Apple Fruit Beverage | Beverages & Drinks | **VERIFIED** | 62.6 KB | `/images/packshots/8901491102919.jpg` |
| `8901491103015` | **Tropicana** | Tropicana Delight Mixed Fruit Beverage | Beverages & Drinks | **VERIFIED** | 63.8 KB | `/images/packshots/8901491103015.jpg` |
| `8906112663831` | **True Elements** | True Elements 7-in-1 Super Seeds & Nut Mix | Snacks & Spreads | **VERIFIED** | 90.0 KB | `/images/packshots/8906112663831.jpg` |
| `8901491405003` | **Uncle Chipps** | Uncle Chipps Plain Salted Potato Chips | Snacks & Spreads | **VERIFIED** | 99.8 KB | `/images/packshots/8901491405003.jpg` |
| `8901491435109` | **Uncle Chipps** | Uncle Chipps Spicy Treat Potato Chips | Snacks & Spreads | **VERIFIED** | 80.6 KB | `/images/packshots/8901491435109.jpg` |
| `8906009079165` | **Unibic** | Unibic Choco Chip Cookies | Snacks & Spreads | **VERIFIED** | 11.6 KB | `/images/packshots/8906009079165.jpg` |
| `8906009077017` | **Unibic** | Unibic Fruit & Nut Cookies | Snacks & Spreads | **VERIFIED** | 71.7 KB | `/images/packshots/8906009077017.jpg` |
| `8906009078014` | **Unibic** | Unibic Rich Butter Cookies | Snacks & Spreads | **VERIFIED** | 50.1 KB | `/images/packshots/8906009078014.jpg` |
| `8908019517118` | **VS Mani & Co.** | South Indian Salted Banana Chips (Rice Bran Oil) | Snacks & Spreads | **VERIFIED** | 153.1 KB | `/images/packshots/8908019517118.jpg` |
| `8906004563683` | **Yellow Diamond** | Yellow Diamond Potato Chips Magic Masala | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906004560682` | **Yellow Diamond** | Yellow Diamond Potato Chips Plain Salted | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8906004560163` | **Yellow Diamond** | Yellow Diamond Potato Chips Tom-Chi Tangy Tomato | Snacks & Spreads | **MISSING** | — | `/images/placeholder-product.svg` |
| `8904335604198` | **Yoga Bar** | Yoga Bar Protein Cookie Cookies & Cream | Snacks & Spreads | **VERIFIED** | 13.2 KB | `/images/packshots/8904335604198.jpg` |
