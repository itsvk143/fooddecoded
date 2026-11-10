# FoodDecode — Comprehensive Catalogue Image Audit & Repair Report

Generated: 2026-10-30T08:47:43.286Z

## Executive Summary

- **Total Catalogue Products:** 185
- **Authentic Packshots Verified & Stored:** 158 (85.4%)
- **Clean Neutral Placeholders (Zero Green Badges):** 27 (14.6%)

## Root Causes of Prior Mismatches

1. **BigBasket SKU Slug Agnosticism:** An earlier script (`build-complete-packshot-catalog.ts`) assumed BigBasket URLs route on textual filename slugs. BigBasket Akamai CDN actually routes exclusively on numeric SKU ID. For instance, SKU `40192803` was Surf Excel detergent (mapped to Cadbury Chocobakes), SKU `40049449` was fresh broccoli (mapped to Lay's Chile Limon), and SKU `40104247` was Lay's Wavy (mapped to Doritos Sweet Chilli).
2. **Shared SKU Clusters:** Several flavours in chips and banana chips shared the exact same image ID (e.g. Balaji, Haldiram's, Too Yumm).
3. **Client-Server Image Fallback Handling:** A runtime error previously triggered when `onError` event handlers were passed across Server Components. This was resolved with the Client Component `ProductImage.tsx`.
4. **Verified Badge Display on Missing Packshots:** Previously, cards rendered the green `Verified` badge based on raw DB status even when the file 404ed or fell back. `ProductImage` and `ProductCard` have been updated so that any load error or placeholder automatically suppresses the badge.

## Repaired Priority Products

| Barcode | Product Name | Old Issue / Source | New Verified Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| `7622202274176` | Cadbury Chocobakes Choc Filled Cookies | Displayed Surf Excel detergent | Zepto CDN 1100x1100 JPEG | VERIFIED |
| `8901491100083` | Doritos Sweet Chilli Flavored Tortilla Chips | Displayed Lay's Wavy | Flipkart CDN 480x480 PNG | VERIFIED |
| `8901491003025` | Doritos Sizzlin' Hot Tortilla Chips | Displayed Doritos Dinamita (rolled) | Flipkart CDN 480x480 PNG | VERIFIED |
| `8901491981538` | Lay's Chile Limon Potato Chips | Displayed Broccoli | OpenFoodFacts front packshot | VERIFIED |
| `8886467122408` | Pringles Sour Cream & Onion | Displayed pump bottle | OpenFoodFacts front packshot | VERIFIED |
| `8908013524389` | TagZ Foods Salt Trippin' | Displayed Cif cleaner / placeholder | Zepto CDN authentic JPEG | VERIFIED |
| `8908013524563` | TagZ Foods Beer N' Barbeque | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |
| `8908013524549` | TagZ Foods Masala Trekker | Displayed Cif cleaner | Zepto CDN authentic JPEG | VERIFIED |
| `8901725119829` | Bingo! Hashtags Spicy Masala | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |
| `8901725198411` | Bingo! Mad Angles Chaat Masti | Displayed placeholder | Zepto CDN authentic JPEG | VERIFIED |
| `8901725013691` | Bingo! Mad Angles Achaari Masti | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |
| `8901725013714` | Bingo! Mad Angles Very Peri Peri | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |
| `8901725007447` | Bingo! Original Style Salted | Shared unverified SKU | Flipkart CDN authentic PNG | VERIFIED |
| `8901725007102` | Bingo! Original Style Chilli | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |
| `8904071700031` | Chheda's Long Masala Banana Chips | Shared unverified SKU | Zepto CDN authentic PNG | VERIFIED |
| `8904071704527` | Chheda's Yellow Rock Salt Banana Chips | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |
| `8904071704565` | Chheda's Tangy Tomato Banana Chips | Shared unverified SKU | Zepto CDN authentic JPEG | VERIFIED |
| `8904067709529` | Jabsons Banana Chips Classic Salted | Shared unverified SKU | Flipkart CDN authentic PNG | VERIFIED |
| `8904067709543` | Jabsons Banana Chips Black Pepper | Shared unverified SKU | OpenFoodFacts authentic JPEG | VERIFIED |
| `8904063200525` | Haldiram's Salted Banana Chips | Shared unverified SKU | Haldiram's Official Store | VERIFIED |
| `8904063200532` | Haldiram's Spicy Masala Banana Chips | Shared unverified SKU | Flipkart CDN authentic JPEG | VERIFIED |
| `8906169990973` | Sweet Karam Coffee Ripe Banana Chips | Shared duplicate photo | Sweet Karam Coffee D2C Store | VERIFIED |
| `8906169990980` | Sweet Karam Coffee Nendran Banana Chips | Shared duplicate photo | Sweet Karam Coffee D2C Store | VERIFIED |
