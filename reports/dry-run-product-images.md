# FoodDecode — Product Image Update Dry-Run Report

**Generated At:** 2026-10-29T12:16:15.899Z
**Total Records Proposed:** 175
**Verified Packaging Photos:** 97
**Neutral Placeholders Assigned:** 78

## 1. Summary of Actions

| Action | Count | Notes |
|---|---|---|
| **UPDATE_VERIFIED_PHOTO** | 97 | Verified retail packshot downloaded, checked for magic bytes and hash uniqueness, mapped to `/images/packshots/<barcode>.jpg` |
| **SET_NEUTRAL_PLACEHOLDER** | 78 | Set to clean `/images/placeholder-product.svg` (no misleading substitute photos or AI drawings) |

## 2. Proposed Changes Table (First 50 Sample Records)

| Barcode | Product Name | Brand | Current Image | Proposed Image | Proposed Status | Action |
|---|---|---|---|---|---|---|
| `8901491102315` | **7UP Lemon-Lime Soda** | 7UP | `/images/cold-drinks/7up.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491102414` | **7UP Nimbooz Real Lemon Juice Drink** | 7UP | `/images/cold-drinks/7up-nimbooz.svg` | `/images/packshots/8901491102414.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8902579101015` | **Appy Classic Still Apple Drink** | Appy Fizz | `/images/cold-drinks/appy.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8902579102012` | **Appy Fizz Sparkling Apple Juice Drink** | Appy Fizz | `/images/cold-drinks/appy-fizz.svg` | `/images/packshots/8902579102012.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8902579103019` | **B Fizz Malt Flavoured Sparkling Drink** | B-Fizz | `/images/cold-drinks/b-fizz.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906017290033` | **Bisleri Fonzo Mango Carbonated Beverage** | Bisleri | `/images/cold-drinks/bisleri-fonzo.svg` | `/images/packshots/8906017290033.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906017290019` | **Bisleri Limonata Sparkling Lime Drink** | Bisleri | `/images/cold-drinks/bisleri-limonata.svg` | `/images/packshots/8906017290019.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906017290026` | **Bisleri Pop Orange Carbonated Beverage** | Bisleri | `/images/cold-drinks/bisleri-pop.svg` | `/images/packshots/8906017290026.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906017290040` | **Bisleri Spicy Jeera Soda** | Bisleri | `/images/cold-drinks/bisleri-jeera.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906006450011` | **Bovonto Iconic Grape Flavoured Soft Drink** | Bovonto | `/images/cold-drinks/bovonto.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904084500017` | **Campa Cola The Great Indian Taste** | Campa | `/images/cold-drinks/campa-cola.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904084500031` | **Campa Lemon Crisp Soda** | Campa | `/images/cold-drinks/campa-lemon.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904084500024` | **Campa Orange Flavoured Soft Drink** | Campa | `/images/cold-drinks/campa-orange.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `049000028904` | **Coca-Cola Classic Original Taste** | Coca-Cola | `/images/cold-drinks/coca-cola-classic.svg` | `/images/packshots/049000028904.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764012211` | **Coca-Cola Original Taste** | Coca-Cola | `/images/cold-drinks/coca-cola-india.svg` | `/images/packshots/8901764012211.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764022210` | **Coca-Cola Zero Sugar** | Coca-Cola | `/images/cold-drinks/coca-cola-zero.svg` | `/images/packshots/8901764022210.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764032219` | **Diet Coke** | Coca-Cola | `/images/cold-drinks/diet-coke.svg` | `/images/packshots/8901764032219.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102117` | **Diet Pepsi Soft Drink** | Pepsi | `/images/cold-drinks/diet-pepsi.svg` | `/images/packshots/8901491102117.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8902080000010` | **Duke's Raspberry Flavoured Carbonated Soft Drink** | Duke's | `/images/cold-drinks/dukes-raspberry.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901764071218` | **Fanta Orange Flavoured Soft Drink** | Fanta | `/images/cold-drinks/fanta-orange.svg` | `/images/packshots/8901764071218.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8902579100018` | **Frooti Fresh 'N' Juicy Mango Drink** | Frooti | `/images/cold-drinks/frooti.svg` | `/images/packshots/8902579100018.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906132690013` | **Lahori The Original Zeera Spiced Soda** | Lahori | `/images/cold-drinks/lahori-zeera.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901764061219` | **Limca Lime & Lemoni** | Limca | `/images/cold-drinks/limca.svg` | `/images/packshots/8901764061219.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764081217` | **Maaza Mango Drink** | Maaza | `/images/cold-drinks/maaza.svg` | `/images/packshots/8901764081217.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764092213` | **Minute Maid Guava Juice Drink** | Minute Maid | `/images/cold-drinks/minutemaid-guava.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901764091216` | **Minute Maid Pulpy Orange Drink** | Minute Maid | `/images/cold-drinks/minutemaid-orange.svg` | `/images/packshots/8901764091216.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102612` | **Mirinda Orange Flavoured Soft Drink** | Mirinda | `/images/cold-drinks/mirinda.svg` | `/images/packshots/8901491102612.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102513` | **Mountain Dew Citrus Soda** | Mountain Dew | `/images/cold-drinks/mountain-dew.svg` | `/images/packshots/8901491102513.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600012` | **Paper Boat Aamras Mango Fruit Drink** | Paper Boat | `/images/cold-drinks/paperboat-aamras.svg` | `/images/packshots/8906080600012.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600043` | **Paper Boat Alphonso Aam Real Mango Drink** | Paper Boat | `/images/cold-drinks/paperboat-alphonso.svg` | `/images/packshots/8906080600043.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600036` | **Paper Boat Roasted Raw Aam Panna** | Paper Boat | `/images/cold-drinks/paperboat-aam-panna.svg` | `/images/packshots/8906080600036.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600074` | **Paper Boat Swing Mixed Fruit Drink** | Paper Boat | `/images/cold-drinks/paperboat-swing-mixed.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906080600050` | **Paper Boat Swing Pulpy Orange Drink** | Paper Boat | `/images/cold-drinks/paperboat-swing-orange.svg` | `/images/packshots/8906080600050.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600067` | **Paper Boat Swing Yummy Lychee Drink** | Paper Boat | `/images/cold-drinks/paperboat-swing-lychee.svg` | `/images/packshots/8906080600067.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600081` | **Paper Boat Zero Sugar Sparkling Water Lime** | Paper Boat | `/images/cold-drinks/paperboat-zero-lime.svg` | `/images/packshots/8906080600081.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906080600029` | **Paper Boat Zesty Jaljeera Drink** | Paper Boat | `/images/cold-drinks/paperboat-jaljeera.svg` | `/images/packshots/8906080600029.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102216` | **Pepsi Black Zero Sugar** | Pepsi | `/images/cold-drinks/pepsi-black.svg` | `/images/packshots/8901491102216.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102018` | **Pepsi Original Taste Cola** | Pepsi | `/images/cold-drinks/pepsi-original.svg` | `/images/packshots/8901491102018.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764103216` | **Schweppes Bitter Lemon Flavoured Drink** | Schweppes | `/images/cold-drinks/schweppes-bitter-lemon.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901764102219` | **Schweppes Ginger Ale Carbonated Drink** | Schweppes | `/images/cold-drinks/schweppes-ginger-ale.svg` | `/images/packshots/8901764102219.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764101212` | **Schweppes Indian Tonic Water** | Schweppes | `/images/cold-drinks/schweppes-tonic.svg` | `/images/packshots/8901764101212.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102711` | **Slice Thickest Mango Drink** | Slice | `/images/cold-drinks/slice.svg` | `/images/packshots/8901491102711.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906005880017` | **Sosyo Heritage Mixed Fruit Cider Soda** | Sosyo | `/images/cold-drinks/sosyo.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901764051210` | **Sprite** | Sprite | `/images/cold-drinks/sprite.svg` | `/images/packshots/8901764051210.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764052217` | **Sprite Zero Sugar** | Sprite | `/images/cold-drinks/sprite-zero.svg` | `/images/packshots/8901764052217.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491102810` | **Sting Energy Drink - Sweet Berry** | Sting | `/images/cold-drinks/sting.svg` | `/images/packshots/8901491102810.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764041211` | **Thums Up** | Thums Up | `/images/cold-drinks/thums-up.svg` | `/images/packshots/8901764041211.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901764042218` | **Thums Up Charged** | Thums Up | `/images/cold-drinks/thums-up-charged.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491102919` | **Tropicana Delight Apple Fruit Beverage** | Tropicana | `/images/cold-drinks/tropicana-apple.svg` | `/images/packshots/8901491102919.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491103015` | **Tropicana Delight Mixed Fruit Beverage** | Tropicana | `/images/cold-drinks/tropicana-mixed-fruit.svg` | `/images/packshots/8901491103015.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `7394376616532` | **Barista Edition Oat Milk** | Oatly | `https://upload.wikimedia.org/wikipedia/commons/8/84/Oatly_oatmilk-_barista_edition.jpg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `025293600270` | **Organic Unsweetened Soymilk** | Silk | `https://www.bbassets.com/media/uploads/p/l/40023068_2-silk-soy-milk-unsweet-organic-non-gmo-imported.jpg` | `/images/packshots/025293600270.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `016000275270` | **Cheerios Whole Grain Oat Cereal** | General Mills | `https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80` | `/images/packshots/016000275270.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `038000391187` | **Froot Loops Marshmallows Cereal** | Kellogg's | `https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80` | `/images/packshots/038000391187.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `894700010045` | **Non-Fat Plain Greek Yogurt** | Chobani | `https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `042272005085` | **Organic Lentil Vegetable Soup** | Amy's Kitchen | `https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `076808516086` | **Whole Grain Spaghetti Pasta** | Barilla | `https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80` | `/images/packshots/076808516086.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `014100078020` | **Dark Chocolate Chunk Crispy Cookies** | Pepperidge Farm | `https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906064700950` | **Authentic Kozhikode Banana Chips in Pure Coconut Oil** | Kozhikoden's | `/images/banana-chips/kozhikodens-coconut-oil.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904067709543` | **Banana Chips Black Pepper (Sendha Namak)** | Jabsons | `/images/banana-chips/jabsons-black-pepper.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904067709529` | **Banana Chips Classic Salted (Sendha Namak)** | Jabsons | `/images/banana-chips/jabsons-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904123534256` | **Banana Jaggery Chips (Sarkara Upperi)** | A1 Chips | `/images/banana-chips/a1-jaggery.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500153` | **Banana Wafers Mast Mari (Black Pepper)** | Balaji Wafers | `/images/banana-chips/balaji-mast-mari.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500177` | **Banana Wafers Mast Masala** | Balaji Wafers | `/images/banana-chips/balaji-mast-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010504441` | **Banana Wafers Simply Salted** | Balaji Wafers | `/images/banana-chips/balaji-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904004408874` | **Black Pepper Banana Chips (Mari Wafers)** | Haldiram's | `/images/banana-chips/haldirams-pepper.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908023145222` | **Hot & Sweet Chilli Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-sweet-chilli.svg` | `/images/packshots/8908023145222.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906169990980` | **Kerala Nendran Banana Chips (Pure Coconut Oil)** | Sweet Karam Coffee | `/images/banana-chips/sweet-karam-coffee-nendran.svg` | `/images/packshots/8906169990980.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906169990973` | **Kerala Ripe Banana Chips (Naturally Sweet - Rice Bran Oil)** | Sweet Karam Coffee | `/images/banana-chips/sweet-karam-coffee-ripe.svg` | `/images/packshots/8906169990973.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906001230456` | **Kerala Traditional Coconut Oil Banana Chips** | A1 Chips | `/images/banana-chips/a1-coconut-oil.svg` | `/images/packshots/8906001230456.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904071700031` | **Long Masala Banana Chips** | Chheda's | `/images/banana-chips/chhedas-long-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908023145062` | **Original Style Salted Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-original.svg` | `/images/packshots/8908023145062.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904123534072` | **Pepper Masala Banana Chips** | A1 Chips | `/images/banana-chips/a1-pepper-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908023145024` | **Peri Peri Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-peri-peri.svg` | `/images/packshots/8908023145024.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908023145284` | **Pure Coconut Oil & Rock Salt Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-coconut-oil.svg` | `/images/packshots/8908023145284.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908023145017` | **Salt & Black Pepper Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-pepper.svg` | `/images/packshots/8908023145017.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063200525` | **Salted Banana Chips** | Haldiram's | `/images/banana-chips/haldirams-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904011506723` | **Sharkara Upperi (Sarkkara Varatti Jaggery Banana Chips)** | Double Horse | `/images/banana-chips/double-horse-sharkara-upperi.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908023145031` | **Sour Cream Onion & Parsley Kerala Banana Chips** | Beyond Snack | `/images/banana-chips/beyond-snack-sour-cream.svg` | `/images/packshots/8908023145031.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908019517118` | **South Indian Salted Banana Chips (Rice Bran Oil)** | VS Mani & Co. | `/images/banana-chips/vs-mani-salted.svg` | `/images/packshots/8908019517118.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063200532` | **Spicy Masala Banana Chips** | Haldiram's | `/images/banana-chips/haldirams-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904071704565` | **Tangy Tomato Banana Chips** | Chheda's | `/images/banana-chips/chhedas-tomato.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904071704527` | **Yellow Rock Salt Banana Chips (Farali / Upwas)** | Chheda's | `/images/banana-chips/chhedas-yellow-rock-salt.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901928983004` | **Bisk Farm Sugar Free Marie Biscuit** | Bisk Farm | `/images/biscuits/biskfarm-sugarfree.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901063139466` | **Britannia Bourbon The Original Chocolate Biscuit** | Britannia | `/images/biscuits/britannia-bourbon.svg` | `/images/packshots/8901063139466.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901063162723` | **Britannia Marie Gold Biscuit** | Britannia | `/images/biscuits/marie-gold.svg` | `/images/packshots/8901063162723.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `7622202348846` | **Cadbury Oreo Original Vanilla Creme Biscuit** | Oreo | `/images/biscuits/oreo-original.svg` | `/images/packshots/7622202348846.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906078260181` | **Cremica Marie Classic Biscuit** | Cremica | `/images/biscuits/cremica-marie.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906033740475` | **McVitie's Digestive Wholewheat Biscuits** | McVitie's | `/images/biscuits/mcvities-digestive.svg` | `/images/packshots/8906033740475.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901063013862` | **NutriChoice Digestive High Fibre Biscuit** | Britannia | `/images/biscuit.jpg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901719121432` | **Parle Monaco Salted Classic Biscuit** | Parle | `/images/biscuits/parle-monaco.svg` | `/images/packshots/8901719121432.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901719101007` | **Parle-G Original Gluco Biscuit** | Parle | `/images/biscuits/parle-g.svg` | `/images/packshots/8901719101007.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906032018513` | **Patanjali Doodh Biscuit** | Patanjali | `/images/biscuits/patanjali-doodh.svg` | `/images/packshots/8906032018513.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908006217038` | **Slurrp Farm Ragi Chocolate Cookies** | Slurrp Farm | `/images/biscuits/slurrp-farm-ragi.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8909081005046` | **Sunfeast Dark Fantasy Choco Fills Biscuit** | Sunfeast | `/images/biscuits/dark-fantasy.svg` | `/images/packshots/8909081005046.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901725002206` | **Sunfeast Farmlite Digestive High Fibre Biscuit** | Sunfeast | `/images/biscuits/farmlite-digestive.svg` | `/images/packshots/8901725002206.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906009079165` | **Unibic Choco Chip Cookies** | Unibic | `/images/biscuits/unibic-choco-chip.svg` | `/images/packshots/8906009079165.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904335604198` | **Yoga Bar Protein Cookie Cookies & Cream** | Yoga Bar | `/images/biscuits/yogabar-cookie.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500535` | **Balaji Wafers Chaat Chaska Wafers** | Balaji Wafers | `/images/chips/balaji-chaat-chaska.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500870` | **Balaji Wafers Crunchex Cream & Onion** | Balaji Wafers | `/images/chips/balaji-crunchex-cream-onion.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010502607` | **Balaji Wafers Masala Masti Wafers** | Balaji Wafers | `/images/chips/balaji-masala-wafers.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500016` | **Balaji Wafers Simply Salted Potato Wafers** | Balaji Wafers | `/images/chips/balaji-simply-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906010500498` | **Balaji Wafers Tomato Twist Wafers** | Balaji Wafers | `/images/chips/balaji-tomato-twist.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725119829` | **Bingo! Hashtags Spicy Masala Potato Chips** | Bingo! | `/images/chips/bingo-hashtags-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725013691` | **Bingo! Mad Angles Achaari Masti** | Bingo! | `/images/chips/bingo-mad-angles-chaat.svg` | `/images/packshots/8901725013691.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901725198411` | **Bingo! Mad Angles Chaat Masti** | Bingo! | `/images/chips/bingo-mad-angles-chaat.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725013714` | **Bingo! Mad Angles Very Peri Peri** | Bingo! | `/images/chips/bingo-mad-angles-peri-peri.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725007102` | **Bingo! Original Style Chilli Sprinkled Potato Chips** | Bingo! | `/images/chips/bingo-original-chilli.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725007447` | **Bingo! Original Style Salted Potato Chips** | Bingo! | `/images/chips/bingo-original-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908001017893` | **Cornitos Nacho Crisps Cheese & Herbs** | Cornitos | `/images/chips/cornitos-peri-peri.svg` | `/images/packshots/8908001017893.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908001017183` | **Cornitos Nacho Crisps Peri Peri** | Cornitos | `/images/chips/cornitos-peri-peri.svg` | `/images/packshots/8908001017183.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908001017053` | **Cornitos Nacho Crisps Sizzlin Jalapeno** | Cornitos | `/images/chips/cornitos-jalapeno.svg` | `/images/packshots/8908001017053.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908001017077` | **Cornitos Nacho Crisps Tikka Masala** | Cornitos | `/images/chips/cornitos-tikka-masala.svg` | `/images/packshots/8908001017077.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `028400043809` | **Doritos Nacho Cheese Flavored Tortilla Chips** | Doritos | `/images/chips/doritos-nacho-cheese.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491003025` | **Doritos Sizzlin' Hot Tortilla Chips** | Doritos | `/images/chips/doritos-sizzlin-hot.svg` | `/images/packshots/8901491003025.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491100083` | **Doritos Sweet Chilli Flavored Tortilla Chips** | Doritos | `/images/chips/doritos-sweet-chilli.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904063219664` | **Haldiram's Aloo Masala Chips** | Haldiram's | `/images/chips/haldirams-aloo-masala.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904063258434` | **Haldiram's Classic Salted Potato Chips** | Haldiram's | `/images/chips/haldirams-potato-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904063201157` | **Haldiram's Pudina Treat Potato Chips** | Haldiram's | `/images/chips/haldirams-pudina-treat.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904063201355` | **Haldiram's Tangy Tomato Chips** | Haldiram's | `/images/chips/haldirams-tangy-tomato.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491100250` | **Lay's American Style Cream & Onion Potato Chips** | Lay's | `/images/chips/lays-cream-onion.svg` | `/images/packshots/8901491100250.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491981538` | **Lay's Chile Limon Potato Chips** | Lay's | `/images/chips/lays-chile-limon.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491101837` | **Lay's Classic Salted Potato Chips** | Lay's | `/images/chips/lays-classic-salted.svg` | `/images/packshots/8901491101837.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491101844` | **Lay's India's Magic Masala Potato Chips** | Lay's | `/images/chips/lays-magic-masala.svg` | `/images/packshots/8901491101844.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491100281` | **Lay's Sizzling Hot Potato Chips** | Lay's | `/images/chips/lays-sizzling-hot.svg` | `/images/packshots/8901491100281.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491101820` | **Lay's Spanish Tomato Tango Potato Chips** | Lay's | `/images/chips/lays-spanish-tomato.svg` | `/images/packshots/8901491101820.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491001816` | **Lay's West Indies Hot 'n' Sweet Chilli Potato Chips** | Lay's | `/images/chips/lays-hot-sweet-chilli.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901719111419` | **Parle Wafers Masala Masti** | Parle | `/images/chips/parle-wafers-masala-masti.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901719111112` | **Parle Wafers Simply Salted** | Parle | `/images/chips/parle-wafers-simply-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901719111310` | **Parle Wafers Tangy Tomato** | Parle | `/images/chips/parle-wafers-tangy-tomato.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8886467116315` | **Pringles Cheesy Cheese Potato Crisps** | Pringles | `/images/chips/pringles-cheesy-cheese.svg` | `/images/packshots/8886467116315.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8886467122439` | **Pringles Desi Masala Tadka Potato Crisps** | Pringles | `/images/chips/pringles-desi-masala.svg` | `/images/packshots/8886467122439.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8886467124921` | **Pringles Original Potato Crisps** | Pringles | `/images/chips/pringles-original.svg` | `/images/packshots/8886467124921.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8886467122408` | **Pringles Sour Cream & Onion Potato Crisps** | Pringles | `/images/chips/pringles-sour-cream.svg` | `/images/packshots/8886467122408.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8886467122446` | **Pringles South African Style Peri Peri Potato Crisps** | Pringles | `/images/chips/pringles-peri-peri.svg` | `/images/packshots/8886467122446.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908013524563` | **TagZ Foods Popped Potato Chips Beer N' Barbeque** | TagZ Foods | `/images/chips/tagz-beer-barbeque.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904132920156` | **TagZ Foods Popped Potato Chips Cream & Onion Divin'** | TagZ Foods | `/images/chips/tagz-cream-onion.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908013524549` | **TagZ Foods Popped Potato Chips Masala Trekker** | TagZ Foods | `/images/chips/tagz-masala-trekker.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8908013524389` | **TagZ Foods Popped Potato Chips Salt Trippin'** | TagZ Foods | `/images/chips/tagz-salt-trippin.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906090571241` | **Too Yumm! Multigrain Chips Dahi Papdi Chaat** | Too Yumm! | `/images/chips/tooyumm-dahi-papdi.svg` | `/images/packshots/8906090571241.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906090571258` | **Too Yumm! Multigrain Chips Tangy Tomato** | Too Yumm! | `/images/chips/tooyumm-multigrain-tomato.svg` | `/images/packshots/8906090571258.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906090573009` | **Too Yumm! Potato Chips Spanish Tomato** | Too Yumm! | `/images/chips/tooyumm-potato-tomato.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906090572835` | **Too Yumm! Potato Stix Peri Peri** | Too Yumm! | `/images/chips/tooyumm-stix-peri-peri.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491405003` | **Uncle Chipps Plain Salted Potato Chips** | Uncle Chipps | `/images/chips/uncle-chipps-plain-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901491435109` | **Uncle Chipps Spicy Treat Potato Chips** | Uncle Chipps | `/images/chips/uncle-chipps-spicy-treat.svg` | `/images/packshots/8901491435109.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906004563683` | **Yellow Diamond Potato Chips Magic Masala** | Yellow Diamond | `/images/chips/yellow-diamond-chips.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906004560682` | **Yellow Diamond Potato Chips Plain Salted** | Yellow Diamond | `/images/chips/yellow-diamond-plain-salted.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906004560163` | **Yellow Diamond Potato Chips Tom-Chi Tangy Tomato** | Yellow Diamond | `/images/chips/yellow-diamond-tom-chi.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901063092822` | **Britannia Good Day Butter Cookies** | Britannia | `/images/cookies/good-day-butter.svg` | `/images/packshots/8901063092822.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901063151321` | **Britannia Good Day Cashew Cookies** | Britannia | `/images/cookies/good-day-cashew.svg` | `/images/packshots/8901063151321.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `7622202274176` | **Cadbury Chocobakes Choc Filled Cookies** | Cadbury | `/images/cookies/cadbury-chocobakes.svg` | `/images/packshots/7622202274176.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906065031138` | **Karachi Bakery Famous Fruit Cookies** | Karachi Bakery | `/images/cookies/karachi-fruit.svg` | `/images/packshots/8906065031138.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8908013328130` | **Open Secret Choco Almond Nutty Cookies** | Open Secret | `/images/cookies/open-secret-choco.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901719117183` | **Parle Hide & Seek Chocolate Chip Cookies** | Parle | `/images/cookies/hide-and-seek.svg` | `/images/packshots/8901719117183.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906092421379` | **Slurrp Farm Milky Choco Chip Millet Cookies** | Slurrp Farm | `/images/cookies/slurrp-choco-millet.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901725013899` | **Sunfeast Mom's Magic Cashew & Almond Cookies** | Sunfeast | `/images/cookies/moms-magic-cashew.svg` | `/images/packshots/8901725013899.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906009077017` | **Unibic Fruit & Nut Cookies** | Unibic | `/images/cookies/unibic-fruit-nut.svg` | `/images/packshots/8906009077017.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906009078014` | **Unibic Rich Butter Cookies** | Unibic | `/images/cookies/unibic-butter.svg` | `/images/packshots/8906009078014.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901414000827` | **Bikano Navratan Mixture** | Bikano | `/images/snacks/bikano-navratan.svg` | `/images/packshots/8901414000827.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063216403` | **Haldiram's Khatta Meetha Mixture** | Haldiram's | `/images/snacks/haldirams-khatta-meetha.svg` | `/images/packshots/8904063216403.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063201452` | **Royal All-in-One Spiced Mixture (Namkeen)** | Haldiram's | `/images/namkeen_mixture.png` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906005500052` | **Bikaji Bikaneri Bhujia** | Bikaji | `/images/snacks/bikaji-bhujia.svg` | `/images/packshots/8906005500052.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901725118921` | **Bingo! Tedhe Medhe Masala Tadka** | Bingo! | `/images/snacks/bingo-tedhe-medhe.svg` | `/images/packshots/8901725118921.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063240187` | **Haldiram's Aloo Bhujia** | Haldiram's | `/images/snacks/haldirams-aloo-bhujia.svg` | `/images/packshots/8904063240187.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904004400455` | **Haldiram's Bhujia Sev** | Haldiram's | `/images/snacks/haldirams-bhujia-sev.svg` | `/images/packshots/8904004400455.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8904063200464` | **Haldiram's Plain Boondi** | Haldiram's | `/images/snacks/haldirams-boondi.svg` | `/images/packshots/8904063200464.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8901491361026` | **Kurkure Masala Munch** | Kurkure | `/images/snacks/kurkure-masala-munch.svg` | `/images/packshots/8901491361026.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906090579346` | **Too Yumm! Karare Munchy Masala** | Too Yumm! | `/images/snacks/tooyumm-karare.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `858882001007` | **Classic Natural Peanut Butter** | Justin's | `https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8901512562609` | **ACT II Classic Salted Popcorn** | ACT II | `/images/snacks/act-ii-popcorn.svg` | `/images/packshots/8901512562609.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906120108126` | **Farmley Roasted Peri Peri Makhana** | Farmley | `/images/snacks/farmley-peri-peri-makhana.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8904004403718` | **Haldiram's Salted Roasted Moong Dal** | Haldiram's | `/images/snacks/haldirams-moong-dal.svg` | `/images/packshots/8904004403718.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
| `8906090577281` | **Too Yumm! Veggie Stix Sour Cream & Onion** | Too Yumm! | `/images/snacks/tooyumm-veggie-stix.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8906112663831` | **True Elements 7-in-1 Super Seeds & Nut Mix** | True Elements | `/images/snacks/true-elements-super-seeds.svg` | `/images/placeholder-product.svg` | **MISSING** | `SET_NEUTRAL_PLACEHOLDER` |
| `8000500179864` | **Nutella Hazelnut Spread with Cocoa** | Ferrero | `https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80` | `/images/packshots/8000500179864.jpg` | **VERIFIED** | `UPDATE_VERIFIED_PHOTO` |
