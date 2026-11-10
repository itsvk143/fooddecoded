# FoodDecode — 10 New Biscuit Products Integration & Audit Report

**Date:** 2026-10-30  
**Environment:** Next.js 16.4.2 App Router & MongoDB Atlas Production Cluster  
**Auditor:** FoodDecode Nutrition Intelligence & Automated Catalog Engine  
**Catalog Scope:** Snacks & Spreads / Biscuits  

---

## 1. Executive Summary

As requested in the master prompt, exactly **10 new, genuine, commercially available biscuit products** from leading Indian and international manufacturers have been researched, verified, and integrated into the FoodDecode MongoDB Atlas catalogue.

Each product was vetted against the existing database to prevent any barcode or normalized naming collision, classified under `Category: Snacks & Spreads` / `Subcategory: Biscuits`, accompanied by an authentic front packaging photograph downloaded to `public/images/packshots/<barcode>.jpg`, and scored using FoodDecode's scientific scoring algorithms (Nutri-Score, NOVA Group, and Overall Health Score).

- **Total products inspected before insertion:** 175
- **Number of candidate products researched:** 31
- **Number of duplicates / existing products rejected:** 4 (existing Parle-G, Britannia Marie Gold, Sunfeast Dark Fantasy, McVitie's Digestive variants)
- **Exactly 10 new products inserted:** 10
- **Final MongoDB Atlas catalogue size:** 185 products (151 with verified authentic packaging)
- **Image status for all 10 items:** `VERIFIED` (Authentic retail packshots retrieved from OpenFoodFacts verified CDN)
- **Data completeness for all 10 items:** 100% (Energy, Macronutrients, Saturated/Trans Fat, Sugars, Added Sugars, Sodium, Ingredients List, and Allergens)

---

## 2. Table of 10 New Biscuit Products

| No. | Brand | Product Name | Variant | Package Size | Barcode | Image Status | Data Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Parle** | Parle Krackjack Sweet & Salty Biscuits | Original Sweet & Salty | 56.7g | `8901719135248` | `VERIFIED` | `VERIFIED` |
| **2** | **Britannia** | Britannia 50-50 Maska Chaska Biscuits | Maska Chaska (Butter & Herbs) | 50g | `8901063367173` | `VERIFIED` | `VERIFIED` |
| **3** | **Britannia** | Britannia Milk Bikis Biscuits | 100% Atta with Milk & Calcium | 500g | `8901063012660` | `VERIFIED` | `VERIFIED` |
| **4** | **Sunfeast** | Sunfeast Bounce Choco Twist Creme Biscuits | Choco Twist | 82g | `8901725134723` | `VERIFIED` | `VERIFIED` |
| **5** | **Britannia** | Britannia Treat Jim Jam Biscuits | Vanilla Cream & Raspberry Jam | 68.5g | `8901063029323` | `VERIFIED` | `VERIFIED` |
| **6** | **Britannia** | Britannia Nice Time Coconut Biscuits | Classic Coconut Sugar Sprinkled | 143g | `8901063028821` | `VERIFIED` | `VERIFIED` |
| **7** | **Britannia** | Britannia Little Hearts Classic Crunch Biscuits | Classic Crunch Sugar Glazed | 30.1g | `8901063019232` | `VERIFIED` | `VERIFIED` |
| **8** | **Sunfeast** | Sunfeast All Rounder Sweet & Salty Thin Potato Crackers | Roasted Sweet & Salty | 75g | `8901725116071` | `VERIFIED` | `VERIFIED` |
| **9** | **McVitie's** | McVitie's Hobnobs Whole Rolled Oat & Choco Chip Biscuits | Rolled Oats & Choco Chip | 75g | `8906033743773` | `VERIFIED` | `VERIFIED` |
| **10** | **Cadbury** | Cadbury Bournvita Crunchy Malted Biscuits | Bournvita Chocolate & Malt | 120g | `7622201778781` | `VERIFIED` | `VERIFIED` |

---

## 3. Product Diversity & Classification Analysis

The 10 additions span diverse market categories, fulfilling the prompt's requirement to avoid adding 10 nearly identical items:

1. **Sweet & Salty Crackers:**
   - *Parle Krackjack* (`8901719135248`): The iconic Indian dual-flavour biscuit combining sweet notes with light sea saltiness.
2. **Herb & Butter Savoury Crackers:**
   - *Britannia 50-50 Maska Chaska* (`8901063367173`): Distinctive butter and oregano/black cumin seasoned light cracker.
3. **Malted Milk Health Biscuits:**
   - *Britannia Milk Bikis* (`8901063012660`): 100% whole wheat atta formulation with milk solids, calcium, and vitamins.
   - *Cadbury Bournvita Crunchy* (`7622201778781`): Cereal-malt beverage flavored crunchy breakfast biscuit fortified with B-vitamins and vitamin D.
4. **Creme Filled Sandwich Biscuits:**
   - *Sunfeast Bounce Choco Twist* (`8901725134723`): High-cocoa dark biscuit sandwich with rich chocolate cream filling.
5. **Speciality Jam & Glazed Biscuits:**
   - *Britannia Treat Jim Jam* (`8901063029323`): Dual-layered biscuit with a vanilla cream center and strawberry-apple fruit jam jewel topped with sugar crystals.
   - *Britannia Little Hearts* (`8901063019232`): Heart-shaped sugar-glazed puff pastry biscuit with crispy melting texture.
6. **Coconut & Specialty Tea Biscuits:**
   - *Britannia Nice Time* (`8901063028821`): Desiccated coconut biscuit coated with crystalline sugar.
7. **Thin Crisp Crackers:**
   - *Sunfeast All Rounder* (`8901725116071`): Ultra-thin potato-infused roasted crunchy savoury cracker.
8. **Rolled Oat & Multigrain Biscuits:**
   - *McVitie's Hobnobs Choco Chip* (`8906033743773`): 36% whole rolled oats and whole wheat formulation combined with rich chocolate chips.

---

## 4. Verification Evidence & Data Sources

| No. | Barcode | Product | Image File Path | Image Source URL | Data / Nutrition Source URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `8901719135248` | Parle Krackjack | `/images/packshots/8901719135248.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/171/913/5248/front_en.25.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901719135248) |
| 2 | `8901063367173` | Britannia 50-50 Maska Chaska | `/images/packshots/8901063367173.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/106/336/7173/1.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901063367173) |
| 3 | `8901063012660` | Britannia Milk Bikis | `/images/packshots/8901063012660.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/106/301/2660/front_en.10.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901063012660) |
| 4 | `8901725134723` | Sunfeast Bounce Choco Twist | `/images/packshots/8901725134723.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/172/513/4723/front_en.4.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901725134723) |
| 5 | `8901063029323` | Britannia Treat Jim Jam | `/images/packshots/8901063029323.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/106/302/9323/front_en.3.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901063029323) |
| 6 | `8901063028821` | Britannia Nice Time | `/images/packshots/8901063028821.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/106/302/8821/front_en.3.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901063028821) |
| 7 | `8901063019232` | Britannia Little Hearts | `/images/packshots/8901063019232.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/106/301/9232/front_en.3.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901063019232) |
| 8 | `8901725116071` | Sunfeast All Rounder | `/images/packshots/8901725116071.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/172/511/6071/front_en.4.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8901725116071) |
| 9 | `8906033743773` | McVitie's Hobnobs | `/images/packshots/8906033743773.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/890/603/374/3773/front_en.24.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/8906033743773) |
| 10 | `7622201778781` | Cadbury Bournvita | `/images/packshots/7622201778781.jpg` | [OFF Packshot](https://images.openfoodfacts.org/images/products/762/220/177/8781/front_en.5.400.jpg) | [OFF Product Record](https://in.openfoodfacts.org/product/7622201778781) |

---

## 5. Nutrition & Food Science Metrics Summary

| Product | Calories (kcal) | Total Fat (g) | Sat. Fat (g) | Sugars (g) | Added Sugars (g) | Sodium (mg) | Nutri-Score | NOVA Group | Overall Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Parle Krackjack** | 489 | 19.9 | 9.4 | 19.6 | 19.1 | 371 | **D** (17) | 4 | **30 / 100** (Poor) |
| **Britannia 50-50 Maska Chaska** | 525 | 26.5 | 12.0 | 9.8 | 7.5 | 1065 | **E** (22) | 4 | **13 / 100** (Bad) |
| **Britannia Milk Bikis** | 471 | 17.8 | 8.8 | 23.1 | 10.9 | 287 | **D** (11) | 4 | **34 / 100** (Poor) |
| **Sunfeast Bounce Choco Twist** | 467 | 15.9 | 7.8 | 36.9 | 33.5 | 260 | **D** (16) | 4 | **30 / 100** (Poor) |
| **Britannia Treat Jim Jam** | 483 | 19.0 | 9.5 | 33.5 | 31.8 | 214 | **E** (20) | 4 | **13 / 100** (Bad) |
| **Britannia Nice Time** | 463 | 15.0 | 8.0 | 30.5 | 27.6 | 274 | **D** (17) | 4 | **30 / 100** (Poor) |
| **Britannia Little Hearts** | 486 | 19.5 | 9.4 | 24.0 | 23.0 | 309 | **D** (18) | 4 | **30 / 100** (Poor) |
| **Sunfeast All Rounder** | 471 | 19.5 | 9.6 | 15.4 | 12.0 | 480 | **D** (16) | 4 | **26 / 100** (Poor) |
| **McVitie's Hobnobs** | 492 | 21.3 | 10.2 | 23.2 | 15.0 | 370 | **D** (16) | 4 | **26 / 100** (Poor) |
| **Cadbury Bournvita** | 455 | 15.1 | 6.7 | 34.2 | 28.6 | 300 | **D** (14) | 4 | **26 / 100** (Poor) |

---

## 6. Website Integration & Testing Results

1. **Search Integration:**
   - Every product is instantly retrievable via full-text search (`q=krackjack`, `q=maska+chaska`, `q=milk+bikis`, `q=bounce`, `q=jim+jam`, `q=nice+time`, `q=little+hearts`, `q=all+rounder`, `q=hobnobs`, `q=bournvita`).
   - All search queries returned **HTTP 200** with product cards properly rendered.
2. **Category & Subcategory Filtering:**
   - Filtering by `Category: Snacks & Spreads` and `Subcategory: Biscuits` correctly incorporates all 10 new products alongside the existing biscuit range.
3. **Product Detail Pages:**
   - Tested `/products/<id>` for all 10 products: each route loaded with **HTTP 200**, rendering the verified packshot photograph, ingredient chips, allergen warnings, Nutri-Score gauge, and nutrition table.
4. **Barcode APIs:**
   - Verified `/api/products/barcode/<barcode>` for all 10 items: each returns full JSON payload.
5. **Idempotence & Safety:**
   - Script was rerun to test idempotence; all 10 items were correctly flagged as existing barcodes and skipped, maintaining database integrity at exactly 185 products.

