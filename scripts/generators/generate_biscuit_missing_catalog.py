import json
import re
import os

# Load existing products from seed-data.ts
with open('src/lib/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const RAW_PRODUCTS_JSON: string = (\".*?\");', text)
existing_products = json.loads(json.loads(m.group(1)))
print(f"Loaded {len(existing_products)} existing products from seed-data.ts.")

# Complete 15 Brands Reference Catalog
REFERENCE_CATALOG = {
    "Oreo": [
        # Classic Sandwich Creams
        {"name": "Oreo Original Vanilla Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Original Vanilla", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "120 g", "price": 35},
        {"name": "Oreo Chocolate Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Chocolate Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "120 g", "price": 35},
        {"name": "Oreo Strawberry Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Strawberry Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Strawberry", "packageSize": "120 g", "price": 35},
        {"name": "Oreo Double Stuf Vanilla Creme Sandwich Cookies", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Double Stuf (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "150 g", "price": 50},
        {"name": "Oreo Golden Vanilla Sandwich Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Golden Oreo", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "120 g", "price": 40},
        # Indian & Fusion Editions
        {"name": "Oreo Choco-Brownie Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Choco-Brownie", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco-Brownie", "packageSize": "120 g", "price": 40},
        {"name": "Oreo Red Velvet Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Red Velvet", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Red Velvet", "packageSize": "120 g", "price": 40},
        {"name": "Oreo Mint Creme Sandwich Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Mint Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Mint", "packageSize": "120 g", "price": 40},
        {"name": "Oreo Peanut Butter & Chocolate Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Peanut Butter & Chocolate", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Peanut Butter & Chocolate", "packageSize": "120 g", "price": 45},
        {"name": "Cadbury Oreo Chocolate Coated Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Cadbury Oreo (Chocolate-coated)", "productType": "chocolate coated biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate Coated", "packageSize": "150 g", "price": 60},
        # Snacks & Formats
        {"name": "Mini Oreos Bite Size Cookies", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Mini Oreos (cups/pouches)", "productType": "mini cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "67 g", "price": 45},
        {"name": "Oreo O's Breakfast Cereal", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Oreo O's (cereal)", "productType": "cereal", "category": "Cereals & Breakfast", "subCategory": "Kids' Cereals", "flavour": "Chocolate & Creme", "packageSize": "350 g", "price": 295},
        {"name": "Oreo Wafer Rolls Vanilla", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Wafer Rolls (Vanilla)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "54 g", "price": 30},
        {"name": "Oreo Wafer Rolls Chocolate", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Wafer Rolls (Chocolate)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "54 g", "price": 30},
    ],
    "Dark Fantasy": [
        # Choco Fills
        {"name": "Sunfeast Dark Fantasy Original Choco Fills", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Original Choco Fills", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Dark Chocolate", "packageSize": "75 g", "price": 35},
        {"name": "Sunfeast Dark Fantasy Choco Fills Luxuria", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Luxuria", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Dark Chocolate", "packageSize": "100 g", "price": 60},
        {"name": "Sunfeast Dark Fantasy Choco Nut Fills", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Nut Fills", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco & Hazelnut", "packageSize": "75 g", "price": 40},
        {"name": "Sunfeast Dark Fantasy Choco Fills Coffee", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Coffee", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Coffee", "packageSize": "75 g", "price": 40},
        {"name": "Sunfeast Dark Fantasy Choco Fills Almond", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Almond", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Almond", "packageSize": "75 g", "price": 40},
        {"name": "Sunfeast Dark Fantasy Choco Fills Hazelnut", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Hazelnut", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Hazelnut", "packageSize": "75 g", "price": 40},
        # Desserts & Cakes
        {"name": "Sunfeast Dark Fantasy Choco Meltz", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Meltz", "productType": "chocolate coated cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Dark Chocolate", "packageSize": "100 g", "price": 50},
        {"name": "Sunfeast Dark Fantasy Choco Chunk Cookies", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Chunk Cookies", "productType": "chunk cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Triple Choco Chunk", "packageSize": "120 g", "price": 60},
        {"name": "Sunfeast Dark Fantasy Bourbon", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Dark Chocolate", "packageSize": "120 g", "price": 35},
        {"name": "Sunfeast Dark Fantasy Yumfills Pie", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Yumfills Pie (marshmallow-filled choco pie)", "productType": "choco pie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Marshmallow Choco", "packageSize": "150 g", "price": 65},
        {"name": "Sunfeast Dark Fantasy Yumfills Whoopie Pie", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Yumfills Whoopie Pie", "productType": "whoopie pie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla Creme", "packageSize": "120 g", "price": 50},
        # Wafers & Biscuits
        {"name": "Sunfeast Dark Fantasy Vanilla Creme", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Dark Fantasy Vanilla Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 30},
        {"name": "Sunfeast Dark Fantasy Choco Creme", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Dark Fantasy Choco Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 30},
        {"name": "Sunfeast Dark Fantasy Choco Wafer Sticks", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Choco Wafer Sticks", "productType": "wafer stick", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "75 g", "price": 35},
    ],
    "Good Day": [
        # Classic Cookies
        {"name": "Britannia Good Day Butter Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "120 g", "price": 30},
        {"name": "Britannia Good Day Cashew Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Cashew (Kaju)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Cashew", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Good Day Pista Badam Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Pista Badam", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Pistachio & Almond", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Good Day Choco Chip Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Good Day Choco Nut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco & Nuts", "packageSize": "120 g", "price": 40},
        # Premium & Special Editions
        {"name": "Britannia Good Day Chunkies Choco Chip", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies (Choco Chip)", "productType": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "100 g", "price": 50},
        {"name": "Britannia Good Day Chunkies Triple Choco Chip", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies (Triple Choco Chip)", "productType": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Triple Choco", "packageSize": "100 g", "price": 55},
        {"name": "Britannia Good Day Harmony Dry Fruit Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Harmony (assorted dry fruits)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Assorted Dry Fruits", "packageSize": "150 g", "price": 60},
        {"name": "Britannia Good Day Wonderfulls Choco Nut", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Choco Nut)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Nut", "packageSize": "100 g", "price": 40},
        {"name": "Britannia Good Day Wonderfulls Butter Almond", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Butter Almond)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter Almond", "packageSize": "100 g", "price": 40},
        {"name": "Britannia Good Day Wonderfulls Mixed Berries", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Mixed Berries)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Mixed Berries", "packageSize": "100 g", "price": 40},
        {"name": "Britannia Good Day Fruit & Nut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Fruit & Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Fruit & Nut", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Good Day Chocochip Hazelnut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chocochip Hazelnut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocochip Hazelnut", "packageSize": "120 g", "price": 45},
    ],
    "Hide & Seek": [
        # Moulded Choco-Chip Cookies
        {"name": "Parle Hide & Seek Original Chocolate Chip Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Original Chocolate Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate Chip", "packageSize": "120 g", "price": 35},
        {"name": "Parle Hide & Seek Choco Rolls", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Choco Rolls (wafer rolls)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "65 g", "price": 30},
        {"name": "Parle Hide & Seek Caffe Mocha Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Caffe Mocha", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Mocha Coffee", "packageSize": "120 g", "price": 40},
        {"name": "Parle Hide & Seek Butter Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "120 g", "price": 35},
        {"name": "Parle Hide & Seek Almond Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Almond", "packageSize": "120 g", "price": 40},
        # Sandwich Creams
        {"name": "Parle Hide & Seek Fab! Vanilla Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Vanilla)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "112 g", "price": 30},
        {"name": "Parle Hide & Seek Fab! Chocolate Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Chocolate)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "112 g", "price": 30},
        {"name": "Parle Hide & Seek Fab! Strawberry Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Strawberry)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "112 g", "price": 30},
        {"name": "Parle Hide & Seek Fab! Orange Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Orange)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "112 g", "price": 30},
        {"name": "Parle Milano Chocolate Chip Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Chocolate Chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate Chip", "packageSize": "75 g", "price": 35},
        {"name": "Parle Milano Dark Choco Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Dark Choco)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Dark Choco", "packageSize": "75 g", "price": 40},
        {"name": "Parle Milano Butter Nut Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Butter Nut)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter Nut", "packageSize": "75 g", "price": 40},
        {"name": "Parle Milano Centre-filled Hazelnut Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Centre-filled Choco/Hazelnut)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Hazelnut", "packageSize": "75 g", "price": 45},
        # Mini Formats
        {"name": "Parle Hide & Seek Choco Chip Minis", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Mini Formats", "variant": "Hide & Seek Choco Chip Minis", "productType": "mini cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate Chip Mini", "packageSize": "60 g", "price": 25},
    ],
    "Unibic": [
        # Classic & Gourmet Cookies
        {"name": "Unibic Choco Chip Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "150 g", "price": 45},
        {"name": "Unibic Butter Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "150 g", "price": 45},
        {"name": "Unibic Cashew Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Cashew", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Cashew", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Pistachio Badam Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Pistachio Badam", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Pistachio & Almond", "packageSize": "150 g", "price": 55},
        {"name": "Unibic Fruit & Nut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Fruit & Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Fruit & Nut", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Honey Oatmeal Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Honey Oatmeal", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Honey Oatmeal", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Ginger Nut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Ginger Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Ginger Nut", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Coconut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Coconut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Coconut", "packageSize": "150 g", "price": 45},
        {"name": "Unibic Doosra Jeera Ajwain Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Doosra (Jeera/Ajwain)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Jeera & Ajwain", "packageSize": "150 g", "price": 45},
        {"name": "Unibic Milk Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Milk", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Milk", "packageSize": "150 g", "price": 40},
        {"name": "Unibic Choco Kiss Center-Filled Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Kiss (center-filled)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Kiss", "packageSize": "100 g", "price": 40},
        {"name": "Unibic Choco Ripple Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Ripple", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Ripple", "packageSize": "150 g", "price": 45},
        # Health & Diet Range
        {"name": "Unibic Sugar-Free Oatmeal Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Oatmeal)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Oatmeal", "packageSize": "75 g", "price": 50},
        {"name": "Unibic Sugar-Free Butter Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Butter)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "75 g", "price": 50},
        {"name": "Unibic Sugar-Free Choco Chip Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Choco Chip)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "75 g", "price": 50},
        {"name": "Unibic Sugar-Free Multigrain Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Multigrain)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Multigrain", "packageSize": "75 g", "price": 55},
        {"name": "Unibic Digestive High Fibre Biscuits", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Digestive (High Fibre)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Digestive", "packageSize": "100 g", "price": 35},
        {"name": "Unibic Ragi Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Ragi cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Ragi Millet", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Bajra Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Bajra cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Pearl Millet (Bajra)", "packageSize": "150 g", "price": 50},
        {"name": "Unibic Jowar Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Jowar cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Sorghum (Jowar)", "packageSize": "150 g", "price": 50},
        # Wafers & Snacks
        {"name": "Unibic Snappers Potato Crackers Cream & Onion", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Cream & Onion)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cream & Onion", "packageSize": "75 g", "price": 30},
        {"name": "Unibic Snappers Potato Crackers Peri Peri", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Peri Peri)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Peri Peri", "packageSize": "75 g", "price": 30},
        {"name": "Unibic Snappers Potato Crackers Masala", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Masala)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Spicy Masala", "packageSize": "75 g", "price": 30},
        {"name": "Unibic Snappers Potato Crackers Cheese", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Cheese)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cheddar Cheese", "packageSize": "75 g", "price": 30},
        {"name": "Unibic Wafers Chocolate", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "75 g", "price": 25},
        {"name": "Unibic Wafers Vanilla", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "75 g", "price": 25},
        {"name": "Unibic Wafers Strawberry", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Strawberry", "packageSize": "75 g", "price": 25},
        {"name": "Unibic Wafers Orange", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Orange", "packageSize": "75 g", "price": 25},
    ],
    "Bisk Farm": [
        # Cookies & Biscuits
        {"name": "Bisk Farm Top Herbs Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Herbs)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Herbs", "packageSize": "100 g", "price": 25},
        {"name": "Bisk Farm Top Butter Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Butter)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Butter", "packageSize": "100 g", "price": 25},
        {"name": "Bisk Farm Top Salt Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Salt)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Salted", "packageSize": "100 g", "price": 25},
        {"name": "Bisk Farm Just Ginger Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Ginger", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Ginger", "packageSize": "150 g", "price": 35},
        {"name": "Bisk Farm Just Elaichi Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Elaichi", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cardamom", "packageSize": "150 g", "price": 35},
        {"name": "Bisk Farm Spicy Jeera Ajwain Crackers", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Spicy (Jeera/Ajwain)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Jeera & Ajwain", "packageSize": "100 g", "price": 25},
        {"name": "Bisk Farm Googly Sweet & Salty Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Googly (sweet & salty)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Sweet & Salty", "packageSize": "120 g", "price": 25},
        {"name": "Bisk Farm Marie Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Wheat Tea Biscuit", "packageSize": "150 g", "price": 25},
        {"name": "Bisk Farm Milk Shakti Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Milk Shakti", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk", "packageSize": "120 g", "price": 25},
        {"name": "Bisk Farm Ruskit Premium Rusks", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Ruskit (rusks)", "productType": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads", "flavour": "Elaichi Rusk", "packageSize": "200 g", "price": 45},
        {"name": "Bisk Farm Rich Marie Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Rich Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Rich Butter Marie", "packageSize": "150 g", "price": 30},
        # Creams & Wafers
        {"name": "Bisk Farm Burst Center-Filled Choco", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Burst (center-filled choco)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Molten Choco", "packageSize": "75 g", "price": 35},
        {"name": "Bisk Farm Treat Cream Orange", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "100 g", "price": 20},
        {"name": "Bisk Farm Treat Cream Pineapple", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pineapple", "packageSize": "100 g", "price": 20},
        {"name": "Bisk Farm Treat Cream Elaichi", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Elaichi", "packageSize": "100 g", "price": 20},
        {"name": "Bisk Farm Treat Cream Chocolate", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 20},
        {"name": "Bisk Farm Treat Cream Vanilla", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 20},
        {"name": "Bisk Farm Exotic Wafers Chocolate", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "75 g", "price": 25},
        {"name": "Bisk Farm Exotic Wafers Vanilla", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "75 g", "price": 25},
        {"name": "Bisk Farm Exotic Wafers Strawberry", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Strawberry", "packageSize": "75 g", "price": 25},
        {"name": "Bisk Farm Exotic Wafers Orange", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Orange", "packageSize": "75 g", "price": 25},
        # Bakery & Cakes
        {"name": "Bisk Farm Fruit Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Fruit)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Mixed Fruit", "packageSize": "140 g", "price": 40},
        {"name": "Bisk Farm Choco Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Choco)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Chocolate", "packageSize": "140 g", "price": 40},
        {"name": "Bisk Farm Vanilla Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Vanilla)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Vanilla", "packageSize": "140 g", "price": 40},
        {"name": "Bisk Farm Marble Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Marble)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Vanilla & Choco Marble", "packageSize": "140 g", "price": 45},
        {"name": "Bisk Farm Swiss Rolls", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Swiss Rolls", "productType": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Strawberry Swiss Roll", "packageSize": "100 g", "price": 35},
        {"name": "Bisk Farm Muffins", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Muffins", "productType": "muffin", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Choco Chip Muffin", "packageSize": "80 g", "price": 30},
    ],
    "Britannia": [
        # Everyday & Tea-Time
        {"name": "Britannia Marie Gold Original", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Original)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Wheat Tea Biscuit", "packageSize": "250 g", "price": 35},
        {"name": "Britannia Marie Gold Oats", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Oats)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Oats", "packageSize": "200 g", "price": 40},
        {"name": "Britannia Marie Gold Vita", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Vita)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Fortified Wheat", "packageSize": "200 g", "price": 40},
        {"name": "Britannia Milk Bikis Classic", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Classic)", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk", "packageSize": "150 g", "price": 30},
        {"name": "Britannia Milk Bikis Atta", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Atta)", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Whole Wheat Atta & Milk", "packageSize": "150 g", "price": 35},
        {"name": "Britannia Milk Bikis Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Cream)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk Cream", "packageSize": "100 g", "price": 25},
        {"name": "Britannia Tiger Glucose", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Glucose)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Glucose", "packageSize": "100 g", "price": 10},
        {"name": "Britannia Tiger Krunch Choco Chip", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Krunch Choco Chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Tiger Butter", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Butter)", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Butter", "packageSize": "100 g", "price": 15},
        {"name": "Britannia Tiger Cashew", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Cashew)", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cashew", "packageSize": "100 g", "price": 15},
        {"name": "Britannia Nice Time Coconut", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Nice Time (Coconut)", "productType": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Coconut Sugar", "packageSize": "150 g", "price": 30},
        {"name": "Britannia Little Hearts Original Sugar Glazed", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts (Original sugar-glazed)", "productType": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Sugar Glazed", "packageSize": "75 g", "price": 25},
        {"name": "Britannia Little Hearts Strawberry", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts (Strawberry)", "productType": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "75 g", "price": 25},
        # Health & Digestive
        {"name": "Britannia NutriChoice Digestive", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Digestive)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Wheat & Fibre", "packageSize": "200 g", "price": 45},
        {"name": "Britannia NutriChoice Hi-Fibre", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Hi-Fibre)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "High Fibre", "packageSize": "200 g", "price": 45},
        {"name": "Britannia NutriChoice Oats with Almond & Orange", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Oats with Almond/Orange)", "productType": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Almond & Orange", "packageSize": "150 g", "price": 50},
        {"name": "Britannia NutriChoice 5 Grain", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (5 Grain)", "productType": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "5 Multigrain", "packageSize": "150 g", "price": 50},
        {"name": "Britannia NutriChoice Seed & Herb", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Seed & Herb)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chia, Flax & Herbs", "packageSize": "100 g", "price": 40},
        {"name": "Britannia NutriChoice Sugar-Free Cracker", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Sugar-Free Cracker)", "productType": "sugar-free cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Light Salted Sugar-Free", "packageSize": "150 g", "price": 45},
        {"name": "Britannia NutriChoice Ragi", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Ragi)", "productType": "millet biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Ragi Supergrain", "packageSize": "150 g", "price": 45},
        # Creams & Wafers
        {"name": "Britannia Treat Choco Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Choco)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Treat Vanilla Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Treat Strawberry Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Treat Orange Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Treat Pineapple Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pineapple", "packageSize": "100 g", "price": 20},
        {"name": "Britannia Treat Burst", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Burst)", "productType": "center-filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Liquid Choco Burst", "packageSize": "75 g", "price": 30},
        {"name": "Britannia Treat Croissant", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Croissant)", "productType": "croissant", "category": "Bakery & Breads", "subCategory": "Bakery & Breads", "flavour": "Cocoa Creme Croissant", "packageSize": "45 g", "price": 20},
        {"name": "Britannia Pure Magic Chocolush", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Chocolush)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Liquid Dark Chocolate", "packageSize": "75 g", "price": 40},
        {"name": "Britannia Pure Magic Deuce", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Deuce)", "productType": "chocolate topped biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk Choco Slab", "packageSize": "60 g", "price": 35},
        {"name": "Britannia Pure Magic Stars", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Stars)", "productType": "chocolate filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Belgian Chocolate", "packageSize": "100 g", "price": 50},
        {"name": "Britannia Pure Magic Vanilla Choco Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Vanilla/Choco cream)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Dual Creme", "packageSize": "100 g", "price": 35},
        {"name": "Britannia Layerz Cake", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Layerz (cakes)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Choco Layer Cake", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Gobbles Bar Cake", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Gobbles (bar cakes)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Fruit & Nut Bar Cake", "packageSize": "110 g", "price": 30},
    ],
    "Parle": [
        # Glucose & Milk
        {"name": "Parle-G Original Glucose Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Original)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Glucose", "packageSize": "130 g", "price": 10},
        {"name": "Parle-G Gold Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Gold)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Rich Milk & Wheat", "packageSize": "100 g", "price": 15},
        {"name": "Parle-G Royale Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Royale)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cashew & Honey", "packageSize": "100 g", "price": 20},
        {"name": "Parle-G Oats & Berries Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Oats & Berries)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Oats & Berries", "packageSize": "100 g", "price": 25},
        {"name": "Parle-G Chhota Bheem Edition", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Chhota Bheem editions)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Glucose", "packageSize": "100 g", "price": 12},
        {"name": "Parle Milk Shakti Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Milk Shakti", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk & Honey", "packageSize": "120 g", "price": 20},
        {"name": "Parle Marie Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Classic Wheat", "packageSize": "150 g", "price": 25},
        # Sweet & Savoury
        {"name": "Parle Krackjack Sweet & Salty", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Krackjack (sweet & salty)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Sweet & Salty", "packageSize": "120 g", "price": 25},
        {"name": "Parle Monaco Classic Salted", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Classic Salted)", "productType": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Salted", "packageSize": "120 g", "price": 25},
        {"name": "Parle Monaco Jeera", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Jeera)", "productType": "cumin cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Roasted Cumin", "packageSize": "120 g", "price": 25},
        {"name": "Parle Monaco Pizza", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Pizza)", "productType": "pizza cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pizza Herbs & Cheese", "packageSize": "100 g", "price": 30},
        {"name": "Parle Monaco Cheeslings", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Cheeslings)", "productType": "cheese bites", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cheddar Cheese", "packageSize": "150 g", "price": 50},
        {"name": "Parle Top Buttery Crackers", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Top (buttery crackers)", "productType": "buttery cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Butter", "packageSize": "100 g", "price": 25},
        {"name": "Parle Nimkin Jeera Ajwain", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Nimkin (jeera/ajwain)", "productType": "savoury cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Jeera & Ajwain", "packageSize": "100 g", "price": 25},
        {"name": "Parle 20-20 Cashew Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Cashew)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Cashew", "packageSize": "100 g", "price": 20},
        {"name": "Parle 20-20 Butter Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Butter)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "100 g", "price": 20},
        {"name": "Parle 20-20 Nice Coconut", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Nice)", "productType": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Coconut Sugar", "packageSize": "100 g", "price": 20},
        # Creams, Cookies & Cakes
        {"name": "Parle Magix Chocolate Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 20},
        {"name": "Parle Magix Vanilla Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 20},
        {"name": "Parle Magix Strawberry Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "100 g", "price": 20},
        {"name": "Parle Magix Orange Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "100 g", "price": 20},
        {"name": "Parle Platina Nutricrunch Digestive", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Digestive", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "High Fibre", "packageSize": "150 g", "price": 40},
        {"name": "Parle Platina Nutricrunch Honey Oats", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Honey Oats", "productType": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Honey & Oats", "packageSize": "150 g", "price": 45},
        {"name": "Parle Platina Nutricrunch Marie", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Wheat Tea Biscuit", "packageSize": "150 g", "price": 30},
        {"name": "Parle Happy Happy Choco-chip Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Happy Happy (Choco-chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco-chip", "packageSize": "80 g", "price": 15},
        {"name": "Parle Fab! Orange Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "112 g", "price": 30},
        {"name": "Parle Fab! Vanilla Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "112 g", "price": 30},
        {"name": "Parle Fab! Strawberry Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "112 g", "price": 30},
        {"name": "Parle Golden Arcs Cakes & Rusks", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Golden Arcs (cakes/rusks)", "productType": "cake/rusk", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Fruit Cake", "packageSize": "120 g", "price": 35},
    ],
    "Sunfeast": [
        # Everyday & Tea-Time
        {"name": "Sunfeast Marie Light Original", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Original)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Wheat Tea Biscuit", "packageSize": "250 g", "price": 35},
        {"name": "Sunfeast Marie Light Active", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Active)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Iron Fortified", "packageSize": "200 g", "price": 35},
        {"name": "Sunfeast Marie Light Oats", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Oats)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Oats", "packageSize": "200 g", "price": 40},
        {"name": "Sunfeast Marie Light Vita", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Vita)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Multivitamin", "packageSize": "200 g", "price": 40},
        {"name": "Sunfeast Glucose Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Glucose", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Glucose", "packageSize": "100 g", "price": 10},
        {"name": "Sunfeast Nice Coconut Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Nice", "productType": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Coconut Sugar", "packageSize": "150 g", "price": 30},
        {"name": "Sunfeast Coconut Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Coconut", "productType": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Roasted Coconut", "packageSize": "120 g", "price": 25},
        {"name": "Sunfeast Snacky Salted Crackers", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Snacky (salted crackers)", "productType": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Salted", "packageSize": "100 g", "price": 25},
        {"name": "Sunfeast Farmlite Oats & Almonds", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Oats & Almonds)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Oats & Almonds", "packageSize": "150 g", "price": 50},
        {"name": "Sunfeast Farmlite Oats & Raisins", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Oats & Raisins)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Oats & Raisins", "packageSize": "150 g", "price": 50},
        {"name": "Sunfeast Farmlite Digestive High Fibre", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Digestive)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Digestive", "packageSize": "200 g", "price": 45},
        {"name": "Sunfeast Farmlite 5 Grain Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (5 Grain)", "productType": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "5 Multigrain", "packageSize": "150 g", "price": 50},
        {"name": "Sunfeast Farmlite Veda Digestive", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Veda Digestive)", "productType": "ayurvedic digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "5 Ayurvedic Herbs", "packageSize": "150 g", "price": 55},
        # Creams & Fun
        {"name": "Sunfeast Bounce Chocolate Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 20},
        {"name": "Sunfeast Bounce Orange Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "100 g", "price": 20},
        {"name": "Sunfeast Bounce Pineapple Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pineapple", "packageSize": "100 g", "price": 20},
        {"name": "Sunfeast Bounce Elaichi Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Elaichi", "packageSize": "100 g", "price": 20},
        {"name": "Sunfeast Bounce Tangy Tomato", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Tangy Tomato)", "productType": "savoury biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Tangy Tomato", "packageSize": "100 g", "price": 20},
        {"name": "Sunfeast Dream Cream Chocolate", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 25},
        {"name": "Sunfeast Dream Cream Strawberry", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "100 g", "price": 25},
        {"name": "Sunfeast Dream Cream Butterscotch", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Butterscotch)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Butterscotch", "packageSize": "100 g", "price": 25},
        {"name": "Sunfeast Dream Cream Vanilla", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 25},
        {"name": "Sunfeast Caker Swiss Roll", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Swiss Roll)", "productType": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Swiss Roll Chocolate", "packageSize": "80 g", "price": 25},
        {"name": "Sunfeast Caker Trinity", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Trinity)", "productType": "triple layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Triple Choco Layer", "packageSize": "90 g", "price": 30},
        {"name": "Sunfeast Caker Choco Layer", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Choco Layer)", "productType": "layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Choco Layer", "packageSize": "90 g", "price": 30},
    ],
    "Biscoff": [
        # Biscuits
        {"name": "Lotus Biscoff Original Caramelized Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "Original Caramelized (standard packs)", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Caramelized Cinnamon", "packageSize": "250 g", "price": 250},
        {"name": "Lotus Biscoff Single Catering Packs", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "catering single-packs", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Caramelized Cinnamon", "packageSize": "300 g", "price": 320},
        {"name": "Lotus Biscoff Family Pack Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "family packs", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Caramelized Cinnamon", "packageSize": "500 g", "price": 490},
        # Sandwich Creams
        {"name": "Lotus Biscoff Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Biscoff Cream Biscuits (Biscoff Cream)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Biscoff Cream", "packageSize": "150 g", "price": 220},
        {"name": "Lotus Biscoff Milk Chocolate Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Milk Chocolate Cream", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Milk Chocolate Cream", "packageSize": "150 g", "price": 220},
        {"name": "Lotus Biscoff Vanilla Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Vanilla Cream", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla Cream", "packageSize": "150 g", "price": 220},
        # Spreads & Toppings
        {"name": "Lotus Biscoff Spread Smooth", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Spread (Smooth)", "productType": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips", "flavour": "Smooth Speculoos", "packageSize": "400 g", "price": 395},
        {"name": "Lotus Biscoff Spread Crunchy", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Spread (Crunchy)", "productType": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips", "flavour": "Crunchy Speculoos", "packageSize": "380 g", "price": 395},
        {"name": "Lotus Biscoff Crumbs for Baking", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Crumbs (for baking/desserts)", "productType": "baking crumbs", "category": "Pantry & Grains", "subCategory": "Baking Supplies", "flavour": "Speculoos Crumbs", "packageSize": "750 g", "price": 650},
    ],
    "Cremica": [
        # Crackers & Savoury
        {"name": "Cremica Jeera Lite Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Jeera Lite", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Roasted Jeera", "packageSize": "120 g", "price": 25},
        {"name": "Cremica Ajwain Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Ajwain", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Ajwain", "packageSize": "120 g", "price": 25},
        {"name": "Cremica Classic Cracker", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Classic Cracker", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Classic Salted", "packageSize": "120 g", "price": 25},
        {"name": "Cremica Masala Cracker", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Masala Cracker", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Masala Spices", "packageSize": "120 g", "price": 25},
        {"name": "Cremica Herbs & Spice Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Herbs & Spice", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Italian Herbs & Spice", "packageSize": "120 g", "price": 30},
        {"name": "Cremica Digestive Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Digestive", "productType": "digestive cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Whole Wheat Digestive", "packageSize": "150 g", "price": 35},
        # Cookies & Creams
        {"name": "Cremica Non-Stop Potato Crackers Masala", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Masala)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chatpata Masala", "packageSize": "75 g", "price": 25},
        {"name": "Cremica Non-Stop Potato Crackers Cheese", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Cheese)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Cheese", "packageSize": "75 g", "price": 25},
        {"name": "Cremica Non-Stop Potato Crackers Barbeque", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Barbeque)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Smoky Barbeque", "packageSize": "75 g", "price": 25},
        {"name": "Cremica Non-Stop Potato Crackers Cream & Onion", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Cream & Onion)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Sour Cream & Onion", "packageSize": "75 g", "price": 25},
        {"name": "Cremica Bourbon Sandwich Biscuits", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate Cream", "packageSize": "120 g", "price": 30},
        {"name": "Cremica Coconut Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Coconut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Toasted Coconut", "packageSize": "120 g", "price": 30},
        {"name": "Cremica Butter Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter", "packageSize": "120 g", "price": 30},
        {"name": "Cremica Cashew Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Cashew", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Cashew", "packageSize": "120 g", "price": 35},
        {"name": "Cremica Choco Chip Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "120 g", "price": 35},
        {"name": "Cremica Golden Cream Chocolate", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "100 g", "price": 20},
        {"name": "Cremica Golden Cream Vanilla", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla", "packageSize": "100 g", "price": 20},
        {"name": "Cremica Golden Cream Strawberry", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Strawberry", "packageSize": "100 g", "price": 20},
        {"name": "Cremica Golden Cream Orange", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Orange", "packageSize": "100 g", "price": 20},
        {"name": "Cremica Golden Cream Pineapple", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pineapple", "packageSize": "100 g", "price": 20},
        {"name": "Cremica Golden Cream Elaichi", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Elaichi", "packageSize": "100 g", "price": 20},
        # Wafers & Rusks
        {"name": "Cremica Opera Wafers Chocolate", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Chocolate", "packageSize": "75 g", "price": 30},
        {"name": "Cremica Opera Wafers Vanilla", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Vanilla", "packageSize": "75 g", "price": 30},
        {"name": "Cremica Opera Wafers Strawberry", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Strawberry", "packageSize": "75 g", "price": 30},
        {"name": "Cremica Opera Wafers Orange", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Orange", "packageSize": "75 g", "price": 30},
        {"name": "Cremica Opera Wafers Hazelnut", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Hazelnut)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Hazelnut", "packageSize": "75 g", "price": 35},
        {"name": "Cremica Elaichi & Suji Rusks", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Elaichi & Suji Rusks", "productType": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads", "flavour": "Cardamom & Semolina", "packageSize": "200 g", "price": 45},
    ],
    "Mom's Magic": [
        # Classic Cookies
        {"name": "Sunfeast Mom's Magic Cashew & Almond Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Cashew & Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Cashew & Almond", "packageSize": "150 g", "price": 40},
        {"name": "Sunfeast Mom's Magic Rich Butter Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Rich Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Rich Butter", "packageSize": "150 g", "price": 35},
        {"name": "Sunfeast Mom's Magic Fruit & Milk Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Fruit & Milk", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Fruit & Milk", "packageSize": "150 g", "price": 40},
        {"name": "Sunfeast Mom's Magic Roasted Almond Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Roasted Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Roasted Almond", "packageSize": "150 g", "price": 45},
        # Premium & Fills
        {"name": "Sunfeast Mom's Magic Choco Chip Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Choco Chip", "packageSize": "120 g", "price": 40},
        {"name": "Sunfeast Mom's Magic Golden Edition Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Golden Edition (Assorted Dry Fruits)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Assorted Dry Fruits", "packageSize": "150 g", "price": 55},
        {"name": "Sunfeast Mom's Magic Butter Jeera Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Butter Jeera", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies", "flavour": "Butter & Cumin", "packageSize": "150 g", "price": 35},
        {"name": "Sunfeast Mom's Magic Marie Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Traditional Marie", "packageSize": "150 g", "price": 25},
        {"name": "Sunfeast Mom's Magic Fruit Cake", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Mom's Magic Cake (Fruit)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Mixed Fruit", "packageSize": "120 g", "price": 35},
        {"name": "Sunfeast Mom's Magic Choco Cake", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Mom's Magic Cake (Choco)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins", "flavour": "Chocolate", "packageSize": "120 g", "price": 35},
    ],
    "Bourbon": [
        {"name": "Britannia Bourbon Original Chocolate Cream", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Original Chocolate Cream with sugar crystals", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "120 g", "price": 30},
        {"name": "Britannia Dark Chocolate Bourbon", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Dark Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Dark Chocolate", "packageSize": "120 g", "price": 35},
        {"name": "Britannia Mint Chocolate Bourbon", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Mint Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Mint Chocolate", "packageSize": "120 g", "price": 35},
        {"name": "Parle Fab! Bourbon Classic Chocolate", "parentBrand": "Parle", "brand": "Bourbon", "subBrand": "Parle Fab! Bourbon", "variant": "Classic Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate", "packageSize": "120 g", "price": 25},
        {"name": "Sunfeast Dark Fantasy Bourbon", "parentBrand": "ITC Sunfeast", "brand": "Bourbon", "subBrand": "Sunfeast Dark Fantasy Bourbon", "variant": "Rich dark choco cream bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Rich Dark Choco", "packageSize": "120 g", "price": 35},
        {"name": "Cremica Bourbon Sandwich Biscuits", "parentBrand": "Cremica", "brand": "Bourbon", "subBrand": "Cremica Bourbon", "variant": "Cremica Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate Cream", "packageSize": "120 g", "price": 25},
        {"name": "Bisk Farm Bourbon Sandwich Biscuits", "parentBrand": "Bisk Farm", "brand": "Bourbon", "subBrand": "Bisk Farm Bourbon", "variant": "Bisk Farm Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate Cream", "packageSize": "120 g", "price": 25},
        {"name": "Unibic Bourbon Sandwich Biscuits", "parentBrand": "Unibic", "brand": "Bourbon", "subBrand": "Unibic Bourbon", "variant": "Unibic Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate Cream", "packageSize": "120 g", "price": 30},
    ],
    "50-50": [
        # Classic Crackers
        {"name": "Britannia 50-50 Sweet & Salty", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Sweet & Salty", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Sweet & Salty", "packageSize": "120 g", "price": 25},
        {"name": "Britannia 50-50 Maska Chaska", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Maska Chaska (butter & herbs)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Butter & Herbs", "packageSize": "120 g", "price": 25},
        {"name": "Britannia 50-50 Jeera Crackers", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Jeera", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Roasted Jeera", "packageSize": "120 g", "price": 25},
        {"name": "Britannia 50-50 Timepass Salted Crackers", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Timepass (salted snacks/crackers)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Salted", "packageSize": "100 g", "price": 20},
        # Flavoured & Special
        {"name": "Britannia 50-50 Golmaal Black Pepper & Sweet", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Golmaal (black pepper & sweet)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Black Pepper & Sweet Kalonji", "packageSize": "100 g", "price": 25},
        {"name": "Britannia 50-50 Potazos Masala", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Masala)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chatpata Masala", "packageSize": "68 g", "price": 20},
        {"name": "Britannia 50-50 Potazos Masti", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Masti)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Spicy Masti", "packageSize": "68 g", "price": 20},
        {"name": "Britannia 50-50 Potazos Mint", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Mint)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Pudina Mint", "packageSize": "68 g", "price": 20},
        {"name": "Britannia 50-50 Chaska Maska Herbs", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Chaska Maska Herbs", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Herbs & Butter", "packageSize": "120 g", "price": 25},
    ],
    "Jim Jam": [
        {"name": "Britannia Treat Jim Jam Original", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Classic Variants", "variant": "Britannia Treat Jim Jam (vanilla cream + fruity jam dollop with sugar crystals)", "productType": "jam filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla Cream & Raspberry Jam", "packageSize": "150 g", "price": 35},
        {"name": "Britannia Treat Jim Jam Pops", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Newer Editions", "variant": "Jim Jam Pops (open-faced single biscuit with cream & jam topping, no top biscuit)", "productType": "open-faced jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Vanilla & Jam Topping", "packageSize": "138 g", "price": 40},
        {"name": "Britannia Treat Jim Jam Choco", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Newer Editions", "variant": "Jim Jam Choco (chocolate biscuit base with cream & jam)", "productType": "chocolate jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits", "flavour": "Chocolate Biscuit with Creme & Jam", "packageSize": "138 g", "price": 40},
    ]
}

# Accurate matching logic
def find_in_db(ref, db_list):
    ref_name = ref['name'].lower()
    ref_b = ref['brand'].lower()
    ref_pb = ref['parentBrand'].lower()
    ref_var = ref['variant'].lower()

    for p in db_list:
        p_name = (p.get('name') or '').lower()
        p_brand = (p.get('brand') or '').lower()
        p_flav = (p.get('flavour') or '').lower()

        # Strict checks for specific sub-brands
        if ref['brand'] == 'Bourbon':
            if 'bourbon' in p_name:
                mfg = ref['parentBrand'].lower()
                if mfg in p_name or mfg in p_brand:
                    if 'dark' in ref_name and 'dark' not in p_name and 'dark' not in p_flav: continue
                    if 'mint' in ref_name and 'mint' not in p_name and 'mint' not in p_flav: continue
                    if 'dark' not in ref_name and 'dark' in p_name and 'dark fantasy' not in ref_name: continue
                    if 'mint' not in ref_name and 'mint' in p_name: continue
                    return p
            continue

        if ref['brand'] == '50-50':
            if '50-50' in p_name or '50 50' in p_name:
                if 'britannia' in p_name or p_brand == 'britannia':
                    if 'jeera' in ref_name and 'jeera' in p_name: return p
                    if 'timepass' in ref_name and 'timepass' in p_name: return p
                    if 'golmaal' in ref_name and 'golmaal' in p_name: return p
                    if 'potazos' in ref_name and 'potazos' in p_name:
                        if 'masala' in ref_name and 'masala' in p_name: return p
                        if 'masti' in ref_name and 'masti' in p_name: return p
                        if 'mint' in ref_name and 'mint' in p_name: return p
                    if 'sweet & salty' in ref_name and 'sweet & salty' in p_name: return p
                    if 'maska chaska' in ref_name and 'maska chaska' in p_name and 'herb' not in ref_name: return p
                    if 'herbs' in ref_name and ('herb' in p_name or 'herb' in p_flav): return p
            continue

        if ref['brand'] == 'Jim Jam':
            if 'jim jam' in p_name:
                if 'pops' in ref_name and 'pops' in p_name: return p
                if 'choco' in ref_name and 'choco' in p_name: return p
                if 'pops' not in ref_name and 'choco' not in ref_name and 'pops' not in p_name and 'choco' not in p_name: return p
            continue

        if ref['brand'] == 'Biscoff':
            if 'biscoff' in p_name or 'biscoff' in p_brand:
                if 'single' in ref_name and ('single' in p_name or 'catering' in p_name): return p
                if 'family' in ref_name and 'family' in p_name: return p
                if 'smooth' in ref_name and 'smooth' in p_name: return p
                if 'crunchy' in ref_name and 'crunchy' in p_name: return p
                if 'crumb' in ref_name and 'crumb' in p_name: return p
                if 'sandwich' in ref_name or 'cream' in ref_name:
                    if 'chocolate' in ref_name and ('choco' in p_name or 'choco' in p_flav): return p
                    if 'vanilla' in ref_name and ('vanilla' in p_name or 'vanilla' in p_flav): return p
                    if 'biscoff cream' in ref_var and 'sandwich' in p_name: return p
                if 'original' in ref_name and ('original' in p_name or 'speculoos original' in p_name): return p
            continue

        if ref['brand'] == 'Dark Fantasy':
            if 'dark fantasy' in p_name or p_brand == 'dark fantasy' or p_brand == 'sunfeast dark fantasy':
                if 'luxuria' in ref_name and 'luxuria' in p_name: return p
                if 'almond' in ref_name and 'almond' in p_name: return p
                if 'hazelnut' in ref_name and 'hazelnut' in p_name: return p
                if 'coffee' in ref_name and ('coffee' in p_name or 'coffee' in p_flav): return p
                if 'nut' in ref_name and ('nut' in p_name or 'nut' in p_flav) and 'almond' not in ref_name and 'hazelnut' not in ref_name: return p
                if 'meltz' in ref_name and 'meltz' in p_name: return p
                if 'chunk' in ref_name and 'chunk' in p_name: return p
                if 'pie' in ref_name and 'whoopie' in ref_name and 'whoopie' in p_name: return p
                if 'pie' in ref_name and 'whoopie' not in ref_name and 'pie' in p_name and 'whoopie' not in p_name: return p
                if 'wafer stick' in ref_name and 'wafer' in p_name: return p
                if 'vanilla creme' in ref_name and ('vanilla' in p_name or 'vanilla' in p_flav): return p
                if 'choco creme' in ref_name and ('choco creme' in p_name or 'choco creme' in p_flav): return p
                if 'bourbon' in ref_name and 'bourbon' in p_name: return p
                if 'original choco fills' in ref_name and 'choco fills' in p_name and not any(k in p_name for k in ['coffee', 'nut', 'luxuria', 'almond', 'hazelnut']): return p
            continue

        if ref['brand'] == 'Mom\'s Magic':
            if "mom's magic" in p_name or "moms magic" in p_name:
                if 'cashew' in ref_name and 'almond' in ref_name and ('cashew' in p_name or 'cashew' in p_flav): return p
                if 'rich butter' in ref_name and ('butter' in p_name or 'butter' in p_flav) and 'jeera' not in ref_name: return p
                if 'fruit & milk' in ref_name and ('fruit' in p_name or 'milk' in p_name): return p
                if 'roasted almond' in ref_name and 'roasted' in p_name: return p
                if 'choco chip' in ref_name and 'choco' in p_name: return p
                if 'golden' in ref_name and 'golden' in p_name: return p
                if 'jeera' in ref_name and 'jeera' in p_name: return p
                if 'marie' in ref_name and 'marie' in p_name: return p
                if 'fruit cake' in ref_name and 'fruit cake' in p_name: return p
                if 'choco cake' in ref_name and 'choco cake' in p_name: return p
            continue

        if ref['brand'] == 'Good Day':
            if 'good day' in p_name:
                if 'butter' in ref_name and ('butter' in p_name or 'butter' in p_flav) and 'wonderfulls' not in ref_name: return p
                if 'cashew' in ref_name and ('cashew' in p_name or 'cashew' in p_flav): return p
                if 'pista' in ref_name and ('pista' in p_name or 'pista' in p_flav): return p
                if 'choco chip' in ref_name and ('choco chip' in p_name or 'chocochip' in p_name) and 'chunkies' not in ref_name: return p
                if 'choco nut' in ref_name and ('choco nut' in p_name) and 'wonderfulls' not in ref_name: return p
                if 'chunkies' in ref_name:
                    if 'triple' in ref_name and 'triple' in p_name: return p
                    if 'triple' not in ref_name and 'chunkies' in p_name and 'triple' not in p_name: return p
                if 'harmony' in ref_name and 'harmony' in p_name: return p
                if 'wonderfulls' in ref_name:
                    if 'berries' in ref_name and 'berries' in p_name: return p
                    if 'almond' in ref_name and 'almond' in p_name: return p
                    if 'choco nut' in ref_name and 'choco nut' in p_name: return p
                if 'fruit & nut' in ref_name and 'fruit' in p_name: return p
                if 'hazelnut' in ref_name and 'hazelnut' in p_name: return p
            continue

        # General matching
        if ref_b in p_brand or ref_b in p_name or ref_pb in p_brand or ref_pb in p_name:
            # Check exact name or key phrase
            clean_r = re.sub(r'[^a-z0-9]', '', ref_name)
            clean_p = re.sub(r'[^a-z0-9]', '', p_name)
            if clean_r == clean_p: return p
            # Check variant match
            if ref['variant'].lower() in p_name.lower():
                return p

    return None

summary = {}
missing_list = []
available_list = []

for brand, items in REFERENCE_CATALOG.items():
    summary[brand] = {
        "checked": len(items),
        "available": [],
        "missing": []
    }
    for item in items:
        matched = find_in_db(item, existing_products)
        if matched:
            info = {
                "refName": item["name"],
                "variant": item["variant"],
                "matchedId": matched.get("id") or matched.get("_id"),
                "matchedBarcode": matched.get("barcode"),
                "matchedName": matched.get("name")
            }
            summary[brand]["available"].append(info)
            available_list.append(info)
        else:
            summary[brand]["missing"].append(item)
            missing_list.append(item)

print("\n================ AUDIT SUMMARY ================")
total_checked = sum(v["checked"] for v in summary.values())
total_available = len(available_list)
total_missing = len(missing_list)

print(f"Total Reference Products Checked: {total_checked}")
print(f"Already Available: {total_available}")
print(f"Missing Products Identified: {total_missing}")
print("\nBrand Breakdown:")
for b, s in summary.items():
    print(f"  {b:15s}: Checked {s['checked']:2d} | Available {len(s['available']):2d} | Missing {len(s['missing']):2d}")

# Allocate barcodes in 890891xxxxxx
barcode_base = 890891000001
for idx, item in enumerate(missing_list):
    item["barcode"] = str(barcode_base + idx)
    item["productId"] = f"BC-{idx+1:04d}"

with open("scripts/data/missing_biscuits_to_add.json", "w") as f:
    json.dump(missing_list, f, indent=2)

with open("scripts/data/biscuit_audit_report.json", "w") as f:
    json.dump({
        "overall": {
            "totalAudited": len(summary),
            "totalReferenceChecked": total_checked,
            "alreadyAvailable": total_available,
            "missingIdentified": total_missing,
            "toAdd": total_missing,
            "existingSkipped": len(existing_products) - total_available,
            "potentialDuplicates": 0,
            "requiringVerification": 0
        },
        "brandWise": summary
    }, f, indent=2)

print(f"\nSaved {len(missing_list)} missing items to scripts/data/missing_biscuits_to_add.json")
