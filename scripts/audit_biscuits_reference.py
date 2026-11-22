import json
import re

# Load SEED_PRODUCTS
with open('src/lib/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const RAW_PRODUCTS_JSON: string = (\".*?\");', text)
raw_str = json.loads(m.group(1))
products = json.loads(raw_str)

# Reference Catalog from the User Prompt
# Organized by Brand -> Category -> Products
REFERENCE_CATALOG = {
    "Oreo": [
        {"name": "Oreo Original Vanilla", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Original Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Chocolate Creme", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Chocolate Creme", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Strawberry Creme", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Strawberry Creme", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Double Stuf (Vanilla)", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Double Stuf Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Golden", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Golden Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Choco-Brownie", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Choco-Brownie", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Red Velvet", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Red Velvet", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Mint Creme", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Mint Creme", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Peanut Butter & Chocolate", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Peanut Butter & Chocolate", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cadbury Oreo Chocolate Coated", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Chocolate Coated", "type": "chocolate coated biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Mini Oreos", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Mini Cups/Pouches", "type": "mini bite cookies", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo O's Cereal", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "O's Cereal", "type": "cereal", "category": "Cereals & Breakfast", "subCategory": "Kids' Cereals"},
        {"name": "Oreo Wafer Rolls Vanilla", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Vanilla Wafer Rolls", "type": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Wafer Rolls Chocolate", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Chocolate Wafer Rolls", "type": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"}
    ],
    "Dark Fantasy": [
        {"name": "Sunfeast Dark Fantasy Original Choco Fills", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Original Choco Fills", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Luxuria", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Luxuria", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Nut Fills", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Nut Fills", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Coffee", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Coffee Fills", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Almond", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Almond Fills", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Hazelnut", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Hazelnut Fills", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Meltz", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Meltz", "type": "chocolate coated cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Chunk Cookies", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Chunk", "type": "chunk cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Bourbon", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Dark Chocolate Bourbon", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Yumfills Pie", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Marshmallow Choco Pie", "type": "choco pie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Yumfills Whoopie Pie", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Whoopie Pie", "type": "whoopie pie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Vanilla Creme", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Vanilla Creme", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Choco Creme", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Choco Creme", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Choco Wafer Sticks", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Choco Wafer Sticks", "type": "wafer stick", "category": "Snacks & Spreads", "subCategory": "Cookies"}
    ],
    "Good Day": [
        {"name": "Britannia Good Day Butter", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Cashew", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Cashew (Kaju)", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Pista Badam", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Pista Badam", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Choco Chip", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Choco Nut", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Chunkies Choco Chip", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies Choco Chip", "type": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Chunkies Triple Choco Chip", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies Triple Choco", "type": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Harmony", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Harmony Dry Fruits", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Choco Nut", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls Choco Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Butter Almond", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls Butter Almond", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Mixed Berries", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls Mixed Berries", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Fruit & Nut", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Fruit & Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Chocochip Hazelnut", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chocochip Hazelnut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"}
    ],
    "Hide & Seek": [
        {"name": "Parle Hide & Seek Original Chocolate Chip", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Original Chocolate Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Choco Rolls", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Choco Rolls", "type": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Caffe Mocha", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Caffe Mocha", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Butter", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Almond", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Almond", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Fab! Vanilla", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Fab! Vanilla", "type": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Fab! Chocolate", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Fab! Chocolate", "type": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Fab! Strawberry", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Fab! Strawberry", "type": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Fab! Orange", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Fab! Orange", "type": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Chocolate Chip", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano Chocolate Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Dark Choco", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano Dark Choco", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Butter Nut", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano Butter Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Centre-filled Hazelnut", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Centre-filled Hazelnut", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Choco Chip Minis", "brand": "Hide & Seek", "subBrand": "Mini Formats", "variant": "Choco Chip Minis", "type": "mini cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"}
    ],
    "Unibic": [
        {"name": "Unibic Choco Chip Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Butter Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Cashew Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Cashew", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Pistachio Badam Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Pistachio Badam", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Fruit & Nut Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Fruit & Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Honey Oatmeal Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Honey Oatmeal", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Ginger Nut Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Ginger Nut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Coconut Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Coconut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Doosra Jeera Ajwain Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Doosra Jeera/Ajwain", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Milk Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Milk", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Choco Kiss Center-Filled Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Kiss", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Choco Ripple Cookies", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Ripple", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Oatmeal Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free Oatmeal", "type": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Butter Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free Butter", "type": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Choco Chip Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free Choco Chip", "type": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Multigrain Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free Multigrain", "type": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Digestive High Fibre Biscuits", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Digestive High Fibre", "type": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Ragi Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Ragi", "type": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Bajra Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Bajra", "type": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Jowar Cookies", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Jowar", "type": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Snappers Potato Crackers Cream & Onion", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Snappers Cream & Onion", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Peri Peri", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Snappers Peri Peri", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Masala", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Snappers Masala", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Cheese", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Snappers Cheese", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Wafers Chocolate", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers Chocolate", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Vanilla", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers Vanilla", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Strawberry", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers Strawberry", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Orange", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers Orange", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"}
    ],
    "Bisk Farm": [
        {"name": "Bisk Farm Top Herbs Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top Herbs", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Top Butter Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top Butter", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Top Salt Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top Salt", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Just Ginger Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Ginger", "type": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Just Elaichi Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Elaichi", "type": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Spicy Jeera Ajwain", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Spicy Jeera/Ajwain", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Googly Sweet & Salty", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Googly Sweet & Salty", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Marie Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Marie", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Milk Shakti Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Milk Shakti", "type": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Ruskit Premium Rusks", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Ruskit", "type": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"},
        {"name": "Bisk Farm Rich Marie Biscuits", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Rich Marie", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Burst Center-Filled Choco", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Burst Choco", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Treat Cream Orange", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Orange Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Pineapple", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Pineapple Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Elaichi", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Elaichi Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Chocolate", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Chocolate Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Vanilla", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Vanilla Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Exotic Wafers Chocolate", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Chocolate Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Vanilla", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Vanilla Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Strawberry", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Strawberry Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Orange", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Orange Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Fruit Cake", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Fruit Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Choco Cake", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Choco Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Vanilla Cake", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Vanilla Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Marble Cake", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Marble Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Swiss Rolls", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Swiss Rolls", "type": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Muffins", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Muffins", "type": "muffin", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"}
    ],
    "Britannia": [
        {"name": "Britannia Marie Gold Original", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold Original", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Marie Gold Oats", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold Oats", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Marie Gold Vita", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold Vita", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Classic", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis Classic", "type": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Atta", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis Atta", "type": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Cream", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Glucose", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger Glucose", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Krunch Choco Chip", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger Krunch Choco Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Tiger Butter", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger Butter", "type": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Cashew", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger Cashew", "type": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Nice Time Coconut", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Nice Time Coconut", "type": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Little Hearts Sugar Glazed", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts Sugar Glazed", "type": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Little Hearts Strawberry", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts Strawberry", "type": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Digestive", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Digestive", "type": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Hi-Fibre", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Hi-Fibre", "type": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Oats with Almond & Orange", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Oats Almond/Orange", "type": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia NutriChoice 5 Grain", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice 5 Grain", "type": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Seed & Herb", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Seed & Herb", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Sugar-Free Cracker", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Sugar-Free", "type": "sugar-free cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Ragi", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice Ragi", "type": "millet biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Choco Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Choco", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Vanilla Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Strawberry Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Strawberry", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Orange Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Orange", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Pineapple Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Pineapple", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Burst", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Burst", "type": "center-filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Croissant", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat Croissant", "type": "croissant", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"},
        {"name": "Britannia Pure Magic Chocolush", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Chocolush", "type": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Pure Magic Deuce", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic Deuce", "type": "chocolate topped biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Pure Magic Stars", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic Stars", "type": "chocolate filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Pure Magic Vanilla Choco Cream", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic Vanilla/Choco", "type": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Layerz Cake", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Layerz Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Britannia Gobbles Bar Cake", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Gobbles Bar Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"}
    ],
    "Parle": [
        {"name": "Parle-G Original Glucose", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G Original", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Gold", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G Gold", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Royale", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G Royale", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Oats & Berries", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G Oats & Berries", "type": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Chhota Bheem Edition", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Chhota Bheem Edition", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Milk Shakti", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Milk Shakti", "type": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Marie", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle Marie", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Krackjack Sweet & Salty", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Krackjack Sweet & Salty", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Classic Salted", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco Classic Salted", "type": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Jeera", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco Jeera", "type": "cumin cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Pizza", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco Pizza", "type": "pizza cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Cheeslings", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco Cheeslings", "type": "cheese bites", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Top Buttery Crackers", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Top Buttery", "type": "buttery cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Nimkin Jeera Ajwain", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Nimkin Jeera/Ajwain", "type": "savoury cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle 20-20 Cashew", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 Cashew", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle 20-20 Butter", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle 20-20 Nice", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 Nice", "type": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Chocolate", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix Chocolate", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Vanilla", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Strawberry", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix Strawberry", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Orange", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix Orange", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Platina Nutricrunch Digestive", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Digestive", "type": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Platina Nutricrunch Honey Oats", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Honey Oats", "type": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Platina Nutricrunch Marie", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Marie", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Happy Happy Choco-chip", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Happy Happy Choco-chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Fab! Orange", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! Orange", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Vanilla", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Strawberry", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! Strawberry", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Golden Arcs Cakes", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Golden Arcs", "type": "cake/rusk", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"}
    ],
    "Sunfeast": [
        {"name": "Sunfeast Marie Light Original", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light Original", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Active", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light Active", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Oats", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light Oats", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Vita", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light Vita", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Glucose Biscuits", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Glucose", "type": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Nice Biscuits", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Nice Coconut", "type": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Coconut Biscuits", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Coconut", "type": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Snacky Salted Crackers", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Snacky Salted", "type": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Oats & Almonds", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite Oats & Almonds", "type": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Oats & Raisins", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite Oats & Raisins", "type": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Digestive", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite Digestive", "type": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite 5 Grain", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite 5 Grain", "type": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Veda Digestive", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite Veda Digestive", "type": "ayurvedic digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Chocolate", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce Chocolate", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Orange", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce Orange", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Pineapple", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce Pineapple", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Elaichi", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce Elaichi", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Tangy Tomato", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce Tangy Tomato", "type": "savoury biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Chocolate", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream Chocolate", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Strawberry", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream Strawberry", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Butterscotch", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream Butterscotch", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Vanilla", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Caker Swiss Roll", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker Swiss Roll", "type": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Caker Trinity", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker Trinity", "type": "triple layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Caker Choco Layer", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker Choco Layer", "type": "layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"}
    ],
    "Biscoff": [
        {"name": "Lotus Biscoff Original Caramelized Biscuits", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "Original Caramelized", "type": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Single Packs", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "Catering Single Packs", "type": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Family Pack", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "Family Pack", "type": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Cream Sandwich Biscuits", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Biscoff Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Milk Chocolate Cream Sandwich Biscuits", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Milk Chocolate Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Vanilla Cream Sandwich Biscuits", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Vanilla Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Spread Smooth", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Smooth Spread", "type": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips"},
        {"name": "Lotus Biscoff Spread Crunchy", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Crunchy Spread", "type": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips"},
        {"name": "Lotus Biscoff Crumbs", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Crushed Biscuit Crumbs", "type": "baking crumbs", "category": "Pantry & Grains", "subCategory": "Baking Supplies"}
    ],
    "Cremica": [
        {"name": "Cremica Jeera Lite Crackers", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Jeera Lite", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Ajwain Crackers", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Ajwain", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Classic Cracker", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Classic Salted", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Masala Cracker", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Masala", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Herbs & Spice Crackers", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Herbs & Spice", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Digestive Crackers", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Digestive", "type": "digestive cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Masala", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop Masala", "type": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Cheese", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop Cheese", "type": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Barbeque", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop Barbeque", "type": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Cream & Onion", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop Cream & Onion", "type": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Bourbon Sandwich Biscuits", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Bourbon", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Coconut Cookies", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Coconut", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Butter Cookies", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Cashew Cookies", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Cashew", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Choco Chip Cookies", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Choco Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Golden Cream Chocolate", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Chocolate", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Vanilla", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Vanilla", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Strawberry", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Strawberry", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Orange", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Orange", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Pineapple", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Pineapple", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Elaichi", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream Elaichi", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Opera Wafers Chocolate", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Chocolate Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Vanilla", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Vanilla Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Strawberry", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Strawberry Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Orange", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Orange Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Hazelnut", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Hazelnut Wafers", "type": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Elaichi & Suji Rusks", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Elaichi & Suji Rusks", "type": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"}
    ],
    "Mom's Magic": [
        {"name": "Sunfeast Mom's Magic Cashew & Almond", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Cashew & Almond", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Rich Butter", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Rich Butter", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Fruit & Milk", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Fruit & Milk", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Roasted Almond", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Roasted Almond", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Choco Chip", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Choco Chip", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Golden Edition", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Golden Edition Dry Fruits", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Butter Jeera", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Butter Jeera", "type": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Marie", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Marie", "type": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Mom's Magic Fruit Cake", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Fruit Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Mom's Magic Choco Cake", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Choco Cake", "type": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"}
    ],
    "Bourbon": [
        {"name": "Britannia Bourbon Original Chocolate Cream", "brand": "Bourbon", "manufacturer": "Britannia", "subBrand": "Britannia Bourbon", "variant": "Original Chocolate Cream with Sugar Crystals", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Dark Chocolate Bourbon", "brand": "Bourbon", "manufacturer": "Britannia", "subBrand": "Britannia Bourbon", "variant": "Dark Chocolate Bourbon", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Mint Chocolate Bourbon", "brand": "Bourbon", "manufacturer": "Britannia", "subBrand": "Britannia Bourbon", "variant": "Mint Chocolate Bourbon", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Bourbon", "brand": "Bourbon", "manufacturer": "Parle", "subBrand": "Parle Fab! Bourbon", "variant": "Classic Chocolate Bourbon", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Bourbon", "brand": "Bourbon", "manufacturer": "Sunfeast", "subBrand": "Sunfeast Dark Fantasy Bourbon", "variant": "Rich Dark Choco Cream", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Bourbon Sandwich", "brand": "Bourbon", "manufacturer": "Cremica", "subBrand": "Cremica Bourbon", "variant": "Classic Chocolate Cream Sandwich", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Bourbon Sandwich", "brand": "Bourbon", "manufacturer": "Bisk Farm", "subBrand": "Bisk Farm Bourbon", "variant": "Classic Chocolate Cream Sandwich", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Bourbon Sandwich", "brand": "Bourbon", "manufacturer": "Unibic", "subBrand": "Unibic Bourbon", "variant": "Classic Chocolate Cream Sandwich", "type": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"}
    ],
    "50-50": [
        {"name": "Britannia 50-50 Sweet & Salty", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Classic Crackers", "variant": "Sweet & Salty", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Maska Chaska", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Classic Crackers", "variant": "Maska Chaska (Butter & Herbs)", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Jeera", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Classic Crackers", "variant": "Jeera", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Timepass", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Classic Crackers", "variant": "Timepass Salted Snacks", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Golmaal", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Flavoured & Special", "variant": "Golmaal (Black Pepper & Sweet)", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Masala", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Flavoured & Special", "variant": "Potazos Masala Potato Biscuit", "type": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Masti", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Flavoured & Special", "variant": "Potazos Masti Potato Biscuit", "type": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Mint", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Flavoured & Special", "variant": "Potazos Mint Potato Biscuit", "type": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Chaska Maska Herbs", "brand": "50-50", "manufacturer": "Britannia", "subBrand": "Flavoured & Special", "variant": "Chaska Maska Herbs", "type": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"}
    ],
    "Jim Jam": [
        {"name": "Britannia Treat Jim Jam Original", "brand": "Jim Jam", "manufacturer": "Britannia", "subBrand": "Classic Variants", "variant": "Original (Vanilla Cream + Fruity Jam Dollop)", "type": "jam filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Jim Jam Pops", "brand": "Jim Jam", "manufacturer": "Britannia", "subBrand": "Newer Editions", "variant": "Jim Jam Pops (Open-faced)", "type": "open-faced jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Jim Jam Choco", "brand": "Jim Jam", "manufacturer": "Britannia", "subBrand": "Newer Editions", "variant": "Jim Jam Choco (Chocolate Biscuit Base)", "type": "chocolate jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"}
    ]
}

def clean_tokens(s):
    return set(re.findall(r'[a-z0-9]+', (s or '').lower()))

def match_product(ref, existing_products):
    ref_name = ref['name'].lower()
    ref_variant = ref.get('variant', '').lower()
    ref_brand = ref['brand'].lower()
    ref_tokens = clean_tokens(ref['name'] + ' ' + ref.get('variant', ''))

    # Manufacturer check for Bourbon, 50-50, Jim Jam
    ref_mfg = ref.get('manufacturer', '').lower()

    best_match = None
    best_score = 0

    for p in existing_products:
        p_name = (p.get('name') or '').lower()
        p_brand = (p.get('brand') or '').lower()
        p_flavour = (p.get('flavour') or '').lower()
        p_tokens = clean_tokens(p_name + ' ' + p_flavour + ' ' + p_brand)

        # Brand / manufacturer alignment
        brand_match = (
            ref_brand in p_brand or p_brand in ref_brand or
            ref_brand in p_name or (ref_mfg and (ref_mfg in p_brand or ref_mfg in p_name))
        )
        if not brand_match:
            continue

        # Exact or near exact substring match
        if ref_name == p_name or (ref_variant and ref_variant in p_name and ref_brand in p_name):
            return p

        # Check key distinctive keywords
        # E.g., 'mini oreos' in p_name, 'chhota bheem' in p_name, etc.
        token_overlap = len(ref_tokens & p_tokens)
        if token_overlap >= 3 and token_overlap > best_score:
            # Check variant specificity: e.g. "cashew" vs "butter"
            # If ref has 'butter', p must have 'butter'
            key_diffs = {'butter', 'cashew', 'almond', 'pista', 'badam', 'choco', 'chocolate', 'strawberry', 'orange', 'vanilla', 'pineapple', 'elaichi', 'mint', 'oats', 'multigrain', 'sugar-free', 'ragi', 'bajra', 'jowar', 'pops', 'potazos', 'golmaal', 'jeera', 'ajwain', 'chunkies', 'wonderfulls', 'milano', 'fab'}
            ref_keys = ref_tokens & key_diffs
            p_keys = p_tokens & key_diffs
            if ref_keys and not (ref_keys <= p_keys):
                continue
            best_score = token_overlap
            best_match = p

    if best_score >= 3:
        return best_match
    return None

results = {}
total_ref = 0
total_available = 0
total_missing = 0

for brand, items in REFERENCE_CATALOG.items():
    results[brand] = {"available": [], "missing": []}
    for item in items:
        total_ref += 1
        matched = match_product(item, products)
        if matched:
            results[brand]["available"].append({"ref": item, "matched": matched})
            total_available += 1
        else:
            results[brand]["missing"].append(item)
            total_missing += 1

print(f"=== INITIAL CATALOG AUDIT RESULTS ===")
print(f"Total Reference Products Checked: {total_ref}")
print(f"Already Available in Database: {total_available}")
print(f"Missing Products Identified: {total_missing}\n")

for brand, res in results.items():
    print(f"[{brand}] Total: {len(REFERENCE_CATALOG[brand])} | Available: {len(res['available'])} | Missing: {len(res['missing'])}")
    if res['missing']:
        for m in res['missing']:
            print(f"   ❌ Missing: {m['name']} ({m.get('variant')})")
