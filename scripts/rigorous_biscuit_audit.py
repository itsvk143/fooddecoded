import json
import re

# Load SEED_PRODUCTS
with open('src/lib/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const RAW_PRODUCTS_JSON: string = (\".*?\");', text)
raw_str = json.loads(m.group(1))
existing_products = json.loads(raw_str)

# Complete Reference Catalog of 15 Brands / Sub-brands from Master Prompt
REFERENCE_CATALOG = {
    "Oreo": [
        # Classic Sandwich Creams
        {"name": "Oreo Original Vanilla Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Original Vanilla", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Chocolate Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Chocolate Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Strawberry Creme Biscuit", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Strawberry Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Double Stuf Vanilla Creme Sandwich Cookies", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Double Stuf (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Golden Vanilla Sandwich Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Classic Sandwich Creams", "variant": "Golden Oreo", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Indian & Fusion Editions
        {"name": "Oreo Choco-Brownie Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Choco-Brownie", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Red Velvet Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Red Velvet", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Mint Creme Sandwich Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Mint Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Peanut Butter & Chocolate Creme Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Peanut Butter & Chocolate", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cadbury Oreo Chocolate Coated Biscuits", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Indian & Fusion Editions", "variant": "Cadbury Oreo (Chocolate-coated)", "productType": "chocolate coated biscuit", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Snacks & Formats
        {"name": "Mini Oreos Bite Size Cookies", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Mini Oreos (cups/pouches)", "productType": "mini cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo O's Breakfast Cereal", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Oreo O's (cereal)", "productType": "cereal", "category": "Cereals & Breakfast", "subCategory": "Kids' Cereals"},
        {"name": "Oreo Wafer Rolls Vanilla", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Wafer Rolls (Vanilla)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Oreo Wafer Rolls Chocolate", "parentBrand": "Mondelez", "brand": "Oreo", "subBrand": "Snacks & Formats", "variant": "Wafer Rolls (Chocolate)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"},
    ],
    "Dark Fantasy": [
        # Choco Fills
        {"name": "Sunfeast Dark Fantasy Original Choco Fills", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Original Choco Fills", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Luxuria", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Luxuria", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Nut Fills", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Nut Fills", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Coffee", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Coffee", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Almond", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Almond", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Fills Hazelnut", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Choco Fills", "variant": "Choco Fills Hazelnut", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Desserts & Cakes
        {"name": "Sunfeast Dark Fantasy Choco Meltz", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Meltz", "productType": "chocolate coated cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Choco Chunk Cookies", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Choco Chunk Cookies", "productType": "chunk cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Bourbon", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Yumfills Pie", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Yumfills Pie (marshmallow-filled choco pie)", "productType": "choco pie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Dark Fantasy Yumfills Whoopie Pie", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Desserts & Cakes", "variant": "Yumfills Whoopie Pie", "productType": "whoopie pie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Wafers & Biscuits
        {"name": "Sunfeast Dark Fantasy Vanilla Creme", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Dark Fantasy Vanilla Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Choco Creme", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Dark Fantasy Choco Creme", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Choco Wafer Sticks", "parentBrand": "ITC Sunfeast", "brand": "Dark Fantasy", "subBrand": "Wafers & Biscuits", "variant": "Choco Wafer Sticks", "productType": "wafer stick", "category": "Snacks & Spreads", "subCategory": "Cookies"},
    ],
    "Good Day": [
        # Classic Cookies
        {"name": "Britannia Good Day Butter Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Cashew Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Cashew (Kaju)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Pista Badam Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Pista Badam", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Choco Chip Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Choco Nut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Classic Cookies", "variant": "Choco Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Premium & Special Editions
        {"name": "Britannia Good Day Chunkies Choco Chip", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies (Choco Chip)", "productType": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Chunkies Triple Choco Chip", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chunkies (Triple Choco Chip)", "productType": "chunky cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Harmony Dry Fruit Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Harmony (assorted dry fruits)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Choco Nut", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Choco Nut)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Butter Almond", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Butter Almond)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Wonderfulls Mixed Berries", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Wonderfulls (Mixed Berries)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Fruit & Nut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Fruit & Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Good Day Chocochip Hazelnut Cookies", "parentBrand": "Britannia", "brand": "Good Day", "subBrand": "Premium & Special Editions", "variant": "Chocochip Hazelnut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
    ],
    "Hide & Seek": [
        # Moulded Choco-Chip Cookies
        {"name": "Parle Hide & Seek Original Chocolate Chip Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Original Chocolate Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Choco Rolls", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Choco Rolls (wafer rolls)", "productType": "wafer roll", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Caffe Mocha Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Caffe Mocha", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Butter Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Hide & Seek Almond Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Moulded Choco-Chip Cookies", "variant": "Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Sandwich Creams
        {"name": "Parle Hide & Seek Fab! Vanilla Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Vanilla)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Hide & Seek Fab! Chocolate Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Chocolate)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Hide & Seek Fab! Strawberry Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Strawberry)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Hide & Seek Fab! Orange Creme", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Sandwich Creams", "variant": "Hide & Seek Fab! (Orange)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Milano Chocolate Chip Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Chocolate Chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Dark Choco Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Dark Choco)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Butter Nut Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Butter Nut)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Milano Centre-filled Hazelnut Cookies", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Milano Series", "variant": "Milano (Centre-filled Choco/Hazelnut)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Mini Formats
        {"name": "Parle Hide & Seek Choco Chip Minis", "parentBrand": "Parle", "brand": "Hide & Seek", "subBrand": "Mini Formats", "variant": "Hide & Seek Choco Chip Minis", "productType": "mini cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
    ],
    "Unibic": [
        # Classic & Gourmet Cookies
        {"name": "Unibic Choco Chip Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Butter Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Cashew Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Cashew", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Pistachio Badam Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Pistachio Badam", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Fruit & Nut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Fruit & Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Honey Oatmeal Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Honey Oatmeal", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Ginger Nut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Ginger Nut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Coconut Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Coconut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Doosra Jeera Ajwain Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Doosra (Jeera/Ajwain)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Milk Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Milk", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Choco Kiss Center-Filled Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Kiss (center-filled)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Choco Ripple Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Classic & Gourmet Cookies", "variant": "Choco Ripple", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Health & Diet Range
        {"name": "Unibic Sugar-Free Oatmeal Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Oatmeal)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Butter Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Butter)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Choco Chip Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Choco Chip)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Sugar-Free Multigrain Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Sugar-Free (Multigrain)", "productType": "sugar-free cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Digestive High Fibre Biscuits", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Digestive (High Fibre)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Ragi Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Ragi cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Bajra Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Bajra cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Jowar Cookies", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Health & Diet Range", "variant": "Jowar cookies", "productType": "millet cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Wafers & Snacks
        {"name": "Unibic Snappers Potato Crackers Cream & Onion", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Cream & Onion)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Peri Peri", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Peri Peri)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Masala", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Masala)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Snappers Potato Crackers Cheese", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Unibic Snappers (Cheese)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Wafers Chocolate", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Vanilla", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Strawberry", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Unibic Wafers Orange", "parentBrand": "Unibic", "brand": "Unibic", "subBrand": "Wafers & Snacks", "variant": "Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
    ],
    "Bisk Farm": [
        # Cookies & Biscuits
        {"name": "Bisk Farm Top Herbs Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Herbs)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Top Butter Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Butter)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Top Salt Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Top (Salt)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Just Ginger Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Ginger", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Just Elaichi Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Just Elaichi", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Spicy Jeera Ajwain Crackers", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Spicy (Jeera/Ajwain)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Googly Sweet & Salty Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Googly (sweet & salty)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Marie Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Milk Shakti Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Milk Shakti", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Ruskit Premium Rusks", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Ruskit (rusks)", "productType": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"},
        {"name": "Bisk Farm Rich Marie Biscuits", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Cookies & Biscuits", "variant": "Rich Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Creams & Wafers
        {"name": "Bisk Farm Burst Center-Filled Choco", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Burst (center-filled choco)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Treat Cream Orange", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Pineapple", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Elaichi", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Chocolate", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Treat Cream Vanilla", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Treat-style Creams (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Exotic Wafers Chocolate", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Vanilla", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Strawberry", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Bisk Farm Exotic Wafers Orange", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Creams & Wafers", "variant": "Exotic Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Bakery & Cakes
        {"name": "Bisk Farm Fruit Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Fruit)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Choco Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Choco)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Vanilla Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Vanilla)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Marble Cake", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Bisk Farm Cake (Marble)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Swiss Rolls", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Swiss Rolls", "productType": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Bisk Farm Muffins", "parentBrand": "Bisk Farm", "brand": "Bisk Farm", "subBrand": "Bakery & Cakes", "variant": "Muffins", "productType": "muffin", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
    ],
    "Britannia": [
        # Everyday & Tea-Time
        {"name": "Britannia Marie Gold Original", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Original)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Marie Gold Oats", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Oats)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Marie Gold Vita", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Marie Gold (Vita)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Classic", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Classic)", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Atta", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Atta)", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Milk Bikis Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Milk Bikis (Cream)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Glucose", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Glucose)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Krunch Choco Chip", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Krunch Choco Chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Tiger Butter", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Butter)", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Tiger Cashew", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Tiger (Cashew)", "productType": "biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Nice Time Coconut", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Nice Time (Coconut)", "productType": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Little Hearts Original Sugar Glazed", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts (Original sugar-glazed)", "productType": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Little Hearts Strawberry", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Everyday & Tea-Time", "variant": "Little Hearts (Strawberry)", "productType": "puff biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Health & Digestive
        {"name": "Britannia NutriChoice Digestive", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Digestive)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Hi-Fibre", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Hi-Fibre)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Oats with Almond & Orange", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Oats with Almond/Orange)", "productType": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia NutriChoice 5 Grain", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (5 Grain)", "productType": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Seed & Herb", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Seed & Herb)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Sugar-Free Cracker", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Sugar-Free Cracker)", "productType": "sugar-free cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia NutriChoice Ragi", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Health & Digestive", "variant": "NutriChoice (Ragi)", "productType": "millet biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Creams & Wafers
        {"name": "Britannia Treat Choco Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Choco)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Vanilla Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Strawberry Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Orange Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Pineapple Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Burst", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Burst)", "productType": "center-filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Croissant", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Treat (Croissant)", "productType": "croissant", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"},
        {"name": "Britannia Pure Magic Chocolush", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Chocolush)", "productType": "center-filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Pure Magic Deuce", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Deuce)", "productType": "chocolate topped biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Pure Magic Stars", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Stars)", "productType": "chocolate filled cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Britannia Pure Magic Vanilla Choco Cream", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Pure Magic (Vanilla/Choco cream)", "productType": "sandwich cream", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Layerz Cake", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Layerz (cakes)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Britannia Gobbles Bar Cake", "parentBrand": "Britannia", "brand": "Britannia", "subBrand": "Creams & Wafers", "variant": "Gobbles (bar cakes)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
    ],
    "Parle": [
        # Glucose & Milk
        {"name": "Parle-G Original Glucose Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Original)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Gold Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Gold)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Royale Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Royale)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Oats & Berries Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Oats & Berries)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle-G Chhota Bheem Edition", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle-G (Chhota Bheem editions)", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Milk Shakti Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Milk Shakti", "productType": "milk biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Marie Biscuits", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Glucose & Milk", "variant": "Parle Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Sweet & Savoury
        {"name": "Parle Krackjack Sweet & Salty", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Krackjack (sweet & salty)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Classic Salted", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Classic Salted)", "productType": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Jeera", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Jeera)", "productType": "cumin cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Pizza", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Pizza)", "productType": "pizza cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Monaco Cheeslings", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Monaco (Cheeslings)", "productType": "cheese bites", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Top Buttery Crackers", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Top (buttery crackers)", "productType": "buttery cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Nimkin Jeera Ajwain", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "Nimkin (jeera/ajwain)", "productType": "savoury cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle 20-20 Cashew Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Cashew)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle 20-20 Butter Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Butter)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle 20-20 Nice Coconut", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Sweet & Savoury", "variant": "20-20 (Nice)", "productType": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Creams, Cookies & Cakes
        {"name": "Parle Magix Chocolate Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Vanilla Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Strawberry Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Magix Orange Cream", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Magix (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Platina Nutricrunch Digestive", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Digestive", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Platina Nutricrunch Honey Oats", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Honey Oats", "productType": "oat cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Platina Nutricrunch Marie", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Nutricrunch Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Happy Happy Choco-chip Cookies", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Happy Happy (Choco-chip)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Parle Fab! Orange Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Vanilla Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Strawberry Creme", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Fab! (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Golden Arcs Cakes & Rusks", "parentBrand": "Parle", "brand": "Parle", "subBrand": "Creams, Cookies & Cakes", "variant": "Golden Arcs (cakes/rusks)", "productType": "cake/rusk", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
    ],
    "Sunfeast": [
        # Everyday & Tea-Time
        {"name": "Sunfeast Marie Light Original", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Original)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Active", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Active)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Oats", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Oats)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Marie Light Vita", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Marie Light (Vita)", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Glucose Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Glucose", "productType": "glucose biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Nice Coconut Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Nice", "productType": "sugar-showered biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Coconut Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Coconut", "productType": "coconut biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Snacky Salted Crackers", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Snacky (salted crackers)", "productType": "salted cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Oats & Almonds", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Oats & Almonds)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Oats & Raisins", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Oats & Raisins)", "productType": "health biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Digestive High Fibre", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Digestive)", "productType": "digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite 5 Grain Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (5 Grain)", "productType": "multigrain biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Farmlite Veda Digestive", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Everyday & Tea-Time", "variant": "Farmlite (Veda Digestive)", "productType": "ayurvedic digestive biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Creams & Fun
        {"name": "Sunfeast Bounce Chocolate Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Orange Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Pineapple Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Elaichi Creme", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Bounce Tangy Tomato", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Bounce (Tangy Tomato)", "productType": "savoury biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Chocolate", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Strawberry", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Butterscotch", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Butterscotch)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dream Cream Vanilla", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Dream Cream (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Caker Swiss Roll", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Swiss Roll)", "productType": "swiss roll", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Caker Trinity", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Trinity)", "productType": "triple layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Caker Choco Layer", "parentBrand": "ITC Sunfeast", "brand": "Sunfeast", "subBrand": "Creams & Fun", "variant": "Caker (Choco Layer)", "productType": "layer cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
    ],
    "Biscoff": [
        # Biscuits
        {"name": "Lotus Biscoff Original Caramelized Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "Original Caramelized (standard packs)", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Single Catering Packs", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "catering single-packs", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Family Pack Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Biscuits", "variant": "family packs", "productType": "speculoos biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Sandwich Creams
        {"name": "Lotus Biscoff Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Biscoff Cream Biscuits (Biscoff Cream)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Milk Chocolate Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Milk Chocolate Cream", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Lotus Biscoff Vanilla Cream Sandwich Biscuits", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Sandwich Creams", "variant": "Vanilla Cream", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Spreads & Toppings
        {"name": "Lotus Biscoff Spread Smooth", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Spread (Smooth)", "productType": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips"},
        {"name": "Lotus Biscoff Spread Crunchy", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Spread (Crunchy)", "productType": "cookie butter spread", "category": "Snacks & Spreads", "subCategory": "Spreads & Dips"},
        {"name": "Lotus Biscoff Crumbs for Baking", "parentBrand": "Lotus Bakeries", "brand": "Lotus Biscoff", "subBrand": "Spreads & Toppings", "variant": "Biscoff Crumbs (for baking/desserts)", "productType": "baking crumbs", "category": "Pantry & Grains", "subCategory": "Baking Supplies"},
    ],
    "Cremica": [
        # Crackers & Savoury
        {"name": "Cremica Jeera Lite Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Jeera Lite", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Ajwain Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Ajwain", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Classic Cracker", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Classic Cracker", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Masala Cracker", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Masala Cracker", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Herbs & Spice Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Herbs & Spice", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Digestive Crackers", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Crackers & Savoury", "variant": "Digestive", "productType": "digestive cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Cookies & Creams
        {"name": "Cremica Non-Stop Potato Crackers Masala", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Masala)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Cheese", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Cheese)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Barbeque", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Barbeque)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Non-Stop Potato Crackers Cream & Onion", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Non-Stop (Cream & Onion)", "productType": "potato cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Bourbon Sandwich Biscuits", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Coconut Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Coconut", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Butter Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Cashew Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Cashew", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Choco Chip Cookies", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Golden Cream Chocolate", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Chocolate)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Vanilla", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Vanilla)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Strawberry", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Strawberry)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Orange", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Orange)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Pineapple", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Pineapple)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Golden Cream Elaichi", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Cookies & Creams", "variant": "Golden Cream (Elaichi)", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Wafers & Rusks
        {"name": "Cremica Opera Wafers Chocolate", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Chocolate)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Vanilla", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Vanilla)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Strawberry", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Strawberry)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Orange", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Orange)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Opera Wafers Hazelnut", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Opera Wafers (Hazelnut)", "productType": "wafer", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Cremica Elaichi & Suji Rusks", "parentBrand": "Cremica", "brand": "Cremica", "subBrand": "Wafers & Rusks", "variant": "Elaichi & Suji Rusks", "productType": "rusk", "category": "Bakery & Breads", "subCategory": "Bakery & Breads"},
    ],
    "Mom's Magic": [
        # Classic Cookies
        {"name": "Sunfeast Mom's Magic Cashew & Almond Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Cashew & Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Rich Butter Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Rich Butter", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Fruit & Milk Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Fruit & Milk", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Roasted Almond Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Classic Cookies", "variant": "Roasted Almond", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        # Premium & Fills
        {"name": "Sunfeast Mom's Magic Choco Chip Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Choco Chip", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Golden Edition Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Golden Edition (Assorted Dry Fruits)", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Butter Jeera Cookies", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Butter Jeera", "productType": "cookie", "category": "Snacks & Spreads", "subCategory": "Cookies"},
        {"name": "Sunfeast Mom's Magic Marie Biscuits", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Marie", "productType": "tea biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Mom's Magic Fruit Cake", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Mom's Magic Cake (Fruit)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
        {"name": "Sunfeast Mom's Magic Choco Cake", "parentBrand": "ITC Sunfeast", "brand": "Mom's Magic", "subBrand": "Premium & Fills", "variant": "Mom's Magic Cake (Choco)", "productType": "cake", "category": "Bakery & Breads", "subCategory": "Packaged Cakes & Muffins"},
    ],
    "Bourbon": [
        {"name": "Britannia Bourbon Original Chocolate Cream", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Original Chocolate Cream with sugar crystals", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Dark Chocolate Bourbon", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Dark Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Mint Chocolate Bourbon", "parentBrand": "Britannia", "brand": "Bourbon", "subBrand": "Britannia Bourbon", "variant": "Mint Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Parle Fab! Bourbon Classic Chocolate", "parentBrand": "Parle", "brand": "Bourbon", "subBrand": "Parle Fab! Bourbon", "variant": "Classic Chocolate Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Sunfeast Dark Fantasy Bourbon", "parentBrand": "ITC Sunfeast", "brand": "Bourbon", "subBrand": "Sunfeast Dark Fantasy Bourbon", "variant": "Rich dark choco cream bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Cremica Bourbon Sandwich Biscuits", "parentBrand": "Cremica", "brand": "Bourbon", "subBrand": "Cremica Bourbon", "variant": "Cremica Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Bisk Farm Bourbon Sandwich Biscuits", "parentBrand": "Bisk Farm", "brand": "Bourbon", "subBrand": "Bisk Farm Bourbon", "variant": "Bisk Farm Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Unibic Bourbon Sandwich Biscuits", "parentBrand": "Unibic", "brand": "Bourbon", "subBrand": "Unibic Bourbon", "variant": "Unibic Bourbon", "productType": "cream biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
    ],
    "50-50": [
        # Classic Crackers
        {"name": "Britannia 50-50 Sweet & Salty", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Sweet & Salty", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Maska Chaska", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Maska Chaska (butter & herbs)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Jeera Crackers", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Jeera", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Timepass Salted Crackers", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Classic Crackers", "variant": "Timepass (salted snacks/crackers)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        # Flavoured & Special
        {"name": "Britannia 50-50 Golmaal Black Pepper & Sweet", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Golmaal (black pepper & sweet)", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Masala", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Masala)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Masti", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Masti)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Potazos Mint", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Potazos (Mint)", "productType": "potato biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia 50-50 Chaska Maska Herbs", "parentBrand": "Britannia", "brand": "50-50", "subBrand": "Flavoured & Special", "variant": "Chaska Maska Herbs", "productType": "cracker", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
    ],
    "Jim Jam": [
        {"name": "Britannia Treat Jim Jam Original", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Classic Variants", "variant": "Britannia Treat Jim Jam (vanilla cream + fruity jam dollop with sugar crystals)", "productType": "jam filled biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Jim Jam Pops", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Newer Editions", "variant": "Jim Jam Pops (open-faced single biscuit with cream & jam topping, no top biscuit)", "productType": "open-faced jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
        {"name": "Britannia Treat Jim Jam Choco", "parentBrand": "Britannia", "brand": "Jim Jam", "subBrand": "Newer Editions", "variant": "Jim Jam Choco (chocolate biscuit base with cream & jam)", "productType": "chocolate jam biscuit", "category": "Snacks & Spreads", "subCategory": "Biscuits"},
    ]
}

# Strict Variant Matcher
def clean_tokens(s):
    return set(re.findall(r'[a-z0-9]+', (s or '').lower()))

def strict_find_existing(ref, existing_list):
    ref_name = ref['name'].lower()
    ref_b = ref['brand'].lower()
    ref_pb = ref.get('parentBrand', '').lower()
    ref_var = ref.get('variant', '').lower()

    # Special logic for Bourbon
    if ref['brand'] == 'Bourbon':
        mfg = ref['parentBrand'].lower()
        for p in existing_list:
            p_name = p.get('name', '').lower()
            p_brand = p.get('brand', '').lower()
            if 'bourbon' in p_name or 'bourbon' in p_brand:
                if mfg in p_name or mfg in p_brand:
                    # check if dark or mint
                    if 'mint' in ref_name and 'mint' not in p_name: continue
                    if 'dark' in ref_name and 'dark' not in p_name: continue
                    if 'mint' not in ref_name and 'mint' in p_name: continue
                    if 'dark' not in ref_name and 'dark' in p_name and 'dark fantasy' not in ref_name: continue
                    return p
        return None

    # Special logic for 50-50
    if ref['brand'] == '50-50':
        for p in existing_list:
            p_name = p.get('name', '').lower()
            if '50-50' in p_name or '50 50' in p_name:
                if 'britannia' in p_name or p.get('brand', '').lower() == 'britannia':
                    if 'maska chaska' in ref_name and 'maska chaska' in p_name and 'salted herb' not in ref_name:
                        return p
                    if 'sweet & salty' in ref_name and 'sweet & salty' in p_name:
                        return p
                    if 'jeera' in ref_name and 'jeera' in p_name:
                        return p
                    if 'timepass' in ref_name and 'timepass' in p_name:
                        return p
                    if 'golmaal' in ref_name and 'golmaal' in p_name:
                        return p
                    if 'potazos' in ref_name and 'potazos' in p_name:
                        if 'masala' in ref_name and 'masala' in p_name: return p
                        if 'masti' in ref_name and 'masti' in p_name: return p
                        if 'mint' in ref_name and 'mint' in p_name: return p
                    if 'herbs' in ref_name and 'herbs' in p_name:
                        return p
        return None

    # Special logic for Jim Jam
    if ref['brand'] == 'Jim Jam':
        for p in existing_list:
            p_name = p.get('name', '').lower()
            if 'jim jam' in p_name:
                if 'pops' in ref_name and 'pops' in p_name:
                    return p
                if 'choco' in ref_name and 'choco' in p_name:
                    return p
                if 'pops' not in ref_name and 'choco' not in ref_name and 'pops' not in p_name and 'choco' not in p_name:
                    return p
        return None

    # General Brand matching
    for p in existing_list:
        p_name = p.get('name', '').lower()
        p_brand = p.get('brand', '').lower()

        # Must match brand or parentBrand
        if ref_b not in p_brand and ref_b not in p_name and ref_pb not in p_brand and ref_pb not in p_name:
            continue

        # Exact name match
        if ref_name == p_name:
            return p

        # Check key distinguishing flavour/variant keywords
        ref_toks = clean_tokens(ref['name'] + ' ' + ref_var)
        p_toks = clean_tokens(p_name + ' ' + (p.get('flavour') or ''))

        # Check if the specific variant words match
        key_distinguishers = [
            'original', 'vanilla', 'chocolate', 'choco', 'strawberry', 'orange', 'pineapple', 'elaichi',
            'mint', 'butter', 'cashew', 'almond', 'pista', 'badam', 'wafer', 'rolls', 'cereal',
            'brownie', 'red velvet', 'peanut butter', 'mini', 'chunkies', 'triple', 'harmony',
            'wonderfulls', 'luxuria', 'meltz', 'yumfills', 'pie', 'whoopie', 'sticks', 'hazelnut',
            'fab', 'milano', 'rolls', 'caffe mocha', 'doosra', 'honey oatmeal', 'ginger nut', 'coconut',
            'kiss', 'ripple', 'sugar-free', 'ragi', 'bajra', 'jowar', 'snappers', 'potato', 'herbs',
            'salt', 'spicy', 'googly', 'ruskit', 'burst', 'cake', 'swiss roll', 'muffins', 'marie',
            'shakti', 'vita', 'atta', 'glucose', 'krunch', 'nice', 'little hearts', 'digestive',
            '5 grain', 'seed & herb', 'croissant', 'chocolush', 'deuce', 'stars', 'gold', 'royale',
            'chhota bheem', 'krackjack', 'monaco', 'cheeslings', 'pizza', 'nimkin', '20-20', 'magix',
            'happy happy', 'golden arcs', 'farmlite', 'bounce', 'dream cream', 'trinity', 'crumbs',
            'spread', 'caramelized', 'non-stop', 'barbeque', 'opera', 'suji'
        ]

        # Extract which key words are in ref
        ref_keys = {k for k in key_distinguishers if k in ref_name or k in ref_var}
        if not ref_keys:
            continue

        # All key words in ref must be present in p
        p_str = p_name + ' ' + (p.get('flavour') or '')
        all_keys_match = True
        for k in ref_keys:
            if ' ' in k:
                if k not in p_str:
                    all_keys_match = False
                    break
            else:
                if k not in p_toks:
                    all_keys_match = False
                    break

        if all_keys_match:
            # Also check negative constraint: p should not have a conflicting variant keyword
            # e.g. ref is 'butter', p should not be 'cashew'
            mutually_exclusive = [
                {'butter', 'cashew', 'almond', 'pista', 'badam'},
                {'chocolate', 'strawberry', 'orange', 'pineapple', 'elaichi', 'vanilla', 'mint'},
                {'oatmeal', 'multigrain', 'ragi', 'bajra', 'jowar'},
                {'masala', 'cheese', 'barbeque', 'cream & onion', 'peri peri'}
            ]
            conflict = False
            for group in mutually_exclusive:
                ref_group = ref_keys & group
                p_group = {k for k in group if k in p_toks or (' ' in k and k in p_str)}
                if ref_group and p_group and ref_group != p_group:
                    conflict = True
                    break
            if not conflict:
                return p

    return None

audit_summary = {}
missing_to_add = []

for brand, items in REFERENCE_CATALOG.items():
    audit_summary[brand] = {
        "checked": len(items),
        "available": [],
        "missing": []
    }
    for item in items:
        matched = strict_find_existing(item, existing_products)
        if matched:
            audit_summary[brand]["available"].append({
                "item": item,
                "matchedId": matched.get('id') or matched.get('_id'),
                "matchedBarcode": matched.get('barcode'),
                "matchedName": matched.get('name')
            })
        else:
            audit_summary[brand]["missing"].append(item)
            missing_to_add.append(item)

print(f"Total Reference Products: {sum(v['checked'] for v in audit_summary.values())}")
print(f"Total Available: {sum(len(v['available']) for v in audit_summary.values())}")
print(f"Total Missing: {len(missing_to_add)}")
print("\nBrand Breakdown:")
for b, s in audit_summary.items():
    print(f"  {b}: Checked {s['checked']} | Available {len(s['available'])} | Missing {len(s['missing'])}")

with open('scripts/data/audit_biscuit_summary.json', 'w') as f:
    json.dump({"summary": audit_summary, "missing": missing_to_add}, f, indent=2)

print("\nSaved audit summary to scripts/data/audit_biscuit_summary.json")
