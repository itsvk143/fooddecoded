import json
import re
from pymongo import MongoClient

with open(".env.local", "r") as f:
    env_text = f.read()
uri = re.search(r'MONGODB_URI=["\']?([^"\'\r\n]+)', env_text).group(1)

client = MongoClient(uri)
db = client["fooddecode"]
prods = list(db["products"].find({}, {
    "name": 1, "brand": 1, "category": 1, "subCategory": 1, "barcode": 1, "overallScore": 1
}))

def norm(text):
    return re.sub(r'[^a-z0-9]', '', (text or '').lower())

# Build lookup index
db_items = []
for p in prods:
    db_items.append({
        "name": p.get("name", ""),
        "brand": p.get("brand", ""),
        "category": p.get("category", ""),
        "subCategory": p.get("subCategory", ""),
        "barcode": p.get("barcode", ""),
        "score": p.get("overallScore", ""),
        "norm_name": norm(p.get("name", "")),
        "norm_brand": norm(p.get("brand", ""))
    })

# Define the user's list per brand
brand_items = {
    "Haldiram's": {
        "aliases": ["haldiram", "haldirams"],
        "items": [
            # Bhujia & Sev
            "Aloo Bhujia", "Bikaneri Bhujia", "Plain Bhujia", "Bhujia Sev", "Ratlami Sev", "Nylon Sev", "Laung Sev", "Tikha Sev", "Barik Sev", "Bhavnagri Gathiya", "Papdi Gathiya", "Chana Jor Garam",
            # Mixtures
            "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Kashmiri Mixture", "Panchrattan", "Madras Mixture", "Cornflakes Mixture", "Bhel Puri", "Diet Chiwda", "Badam Laccha", "Shahi Mixture", "Falahari Chiwda",
            # Dals & Nuts
            "Moong Dal", "Chana Dal", "Masoor Dal", "Classic Salted Peanuts", "Masala Peanuts (Nut Cracker)", "Nimbu Masala Peanuts", "Hara Matar", "Kabuli Chana", "Roasted Chana", "Salted Cashews", "Pepper Cashews",
            # Extruded & Puffed (Takatak / Whoopies)
            "Masala Balls", "Pudina Treat", "Tangy Tomato Sticks", "Chatpata Masala Sticks", "Cheese Balls", "Boondi (Plain)", "Boondi (Masala)", "Boondi (Pudina)",
            # South Indian & Western
            "Murukku", "Chakli", "Banana Chips (Salted)", "Banana Chips (Black Pepper)", "Banana Chips (Masala)", "Tapioca Chips", "Potato Chips (Classic Salted)", "Potato Chips (Cream & Onion)", "Potato Chips (Pudina)", "Potato Chips (Spicy Treat)", "Soya Sticks", "Soya Katori", "Gol Kachori", "Mini Samosa", "Mini Bhakarwadi", "Khakhra (Methi)", "Khakhra (Masala)", "Khakhra (Jeera)"
        ]
    },
    "Bikaji": {
        "aliases": ["bikaji"],
        "items": [
            # Bhujia & Sev
            "Bikaneri Bhujia", "Tana-Tan Aloo Bhujia", "Baarish Bhujia", "Ratlami Sev", "Nylon Sev", "Lahsun Sev", "Masala Sev", "Gathiya", "Papdi",
            # Mixtures
            "Kuch-Kuch (All-in-One)", "Subh-Kuch (Navrattan)", "Sab Kuch", "Khatta Meetha", "Cornflakes Mix", "Marwari Mix", "Bhel Puri", "Falahari Mix", "Diet Mixture",
            # Dals & Nuts
            "Moong Dal", "Chana Dal", "Masala Peanuts (Masti Nuts)", "Salted Peanuts", "Kabuli Chana", "Roasted Chana", "Hara Matar",
            # Regional & Fusion
            "Mini Samosa", "Mini Kachori", "Boondi (Masala)", "Boondi (Plain)", "Soya Sticks", "Makai (Corn) Chiwda", "Potato Chips", "Fun-In Puffs"
        ]
    },
    "Bikanervala / Bikano": {
        "aliases": ["bikano", "bikanervala"],
        "items": [
            # Bhujia & Sev
            "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Ratlami Sev", "Gathiya", "Chana Jor Garam",
            # Mixtures
            "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Shahi Mixture", "Kashmiri Mixture", "Bhel Puri", "Cornflakes Mixture", "Diet Mixture", "Badam Laccha",
            # Dals & Nuts
            "Moong Dal", "Chana Dal", "Tasty (Masala Peanuts)", "Salted Peanuts", "Hara Matar", "Kabuli Chana", "Roasted Peanuts",
            # Traditional Bites & Chips
            "Mini Samosa", "Dry Kachori", "Bhakarwadi", "Methi Mathri", "Shakkarpara", "Namakpara", "Boondi", "Soya Sticks", "Banana Chips", "Potato Chips", "Kurkure-style Tedhe Medhe"
        ]
    },
    "Prabhuji (Haldiram Prabhuji)": {
        "aliases": ["prabhuji"],
        "items": [
            # Bhujia & Sev
            "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Tok Jhal Mishti (Sweet & Sour Bhujia)", "Chanachur", "Jhal Chanachur", "Special Chanachur",
            # Mixtures
            "Khatta Meetha", "Navrattan", "All-in-One", "Cornflakes Mixture", "Badam Lachha", "Panchratan", "Bhel Puri", "Falahari Mixture",
            # Dals & Nuts
            "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts", "Hara Matar", "Kabuli Chana", "Kaju Masala",
            # Traditional & Savories
            "Mini Samosa", "Kachori", "Bhakarwadi", "Boondi", "Papad", "Soya Sticks", "Potato Chips"
        ]
    },
    "Balaji Wafers": {
        "aliases": ["balaji", "balajiwafers"],
        "items": [
            # Bhujia & Sev
            "Aloo Sev", "Tikha Sev", "Nylon Sev", "Ratlami Sev", "Bhavnagri Gathiya", "Vanela Gathiya", "Tikha Gathiya", "Papdi Gathiya", "Chana Jor Garam",
            # Mixtures & Chiwda
            "Farali Chiwda (Sweet & Tikha)", "Khatta Meetha", "Tikha Mitha Mix", "Chanachur", "Bhel Mix", "Tam-Tam", "Mung Dal", "Chana Dal", "Sing Bhujia (Masala Peanuts)", "Salted Peanuts",
            # Wafers & Chips
            "Simply Salted", "Masala Masti", "Cream & Onion", "Tomato Twist", "Chaat Chaska", "Peri-Peri", "Kettle Chips", "Banana Wafers (Salted)", "Banana Wafers (Mari/Pepper)",
            # Extruded & Puffed
            "Crunchex", "Chataka Pataka (Masala)", "Chataka Pataka (Chinese)", "Chataka Pataka (Tomato)", "Wheels", "Scoops", "Funne", "Gippies", "Nachos"
        ]
    },
    "Gopal Snacks": {
        "aliases": ["gopal", "gopalsnacks"],
        "items": [
            # Gathiya & Sev
            "Bhavnagri Gathiya", "Vanela Gathiya", "Champakali Gathiya", "Papdi Gathiya", "Tikha Gathiya", "Nylon Sev", "Aloo Sev", "Ratlami Sev", "Lasaniya (Garlic) Sev",
            # Mixtures & Chiwda
            "Rajwadi Mix", "Khatta Meetha", "Tikha Mitha Mix", "Farali Chiwda", "Bhel Mix", "Dalmoth", "Navratan Mix", "Cornflakes Mix",
            # Dals & Nuts
            "Moong Dal", "Chana Dal", "Sing Bhujia", "Salted Peanuts", "Masala Chana", "Hara Matar",
            # Wafers & Pellets
            "Potato Wafers (Salted)", "Potato Wafers (Masala)", "Potato Wafers (Cream & Onion)", "Potato Wafers (Tomato)", "Banana Wafers", "Fryums (Wheels)", "Fryums (Pasta)", "Fryums (Noodles)", "Fryums (Katori)", "Fryums (Pipes)", "Khakhra", "Bhakarwadi"
        ]
    },
    "Chitale Bandhu Mithaiwale": {
        "aliases": ["chitale", "chitalebandhu"],
        "items": [
            # Flagship Specialties
            "Chitale Bakarwadi (Regular)", "Chitale Bakarwadi (Mini)", "Chitale Bakarwadi (Garlic)", "Chitale Bakarwadi (Jain)", "Chitale Bakarwadi (Masala)", "Laxminarayan Chiwda (Potato)", "Laxminarayan Chiwda (Cornflakes)", "Laxminarayan Chiwda (Poha)", "Makai Chiwda", "Poha Chiwda", "Sabudana Chiwda (Upvas/Fasting)",
            # Sev & Gathiya
            "Tikhat Sev", "Plain Sev", "Bhavnagri Gathiya", "Lasun Sev", "Shev Chiwda",
            # Traditional Maharashtrian Snacks
            "Chakli (Bhajani Chakli)", "Chakli (Butter Chakli)", "Shankarpali (Sweet & Salty)", "Kadboli", "Chirote", "Karanji", "Potato Wafers", "Banana Wafers"
        ]
    },
    "Chheda’s": {
        "aliases": ["chheda", "chhedas"],
        "items": [
            # Chips & Wafers
            "Yellow Banana Chips (Salted)", "Yellow Banana Chips (Black Pepper)", "Yellow Banana Chips (Tomato)", "Yellow Banana Chips (Pudina)", "Yellow Banana Chips (Peri-Peri)", "Kerala Banana Chips (Coconut Oil)", "Tapioca Chips", "Jackfruit Chips", "Potato Chips", "Sweet Potato Chips",
            # Farsan & Mixtures
            "Mini Bhakarwadi", "Methi Khakhra", "Masala Khakhra", "Jeera Khakhra", "Bhel Puri", "Sev Puri", "Dry Kachori", "Dry Samosa", "Masala Boondi", "Murukku", "Chakli",
            # Chiwda & Sev
            "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Nylon Sev", "Tikha Gathiya", "Aloo Bhujia", "Moong Dal", "Masala Peanuts"
        ]
    },
    "Garden (CavinKare)": {
        "aliases": ["garden", "cavinkare"],
        "items": [
            # Mixtures & Chiwda
            "Mumbai Mixture", "Khatta Meetha", "Bhel Puri", "Navrattan", "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Golden Mixture",
            # Sev & Farsan
            "Aloo Bhujia", "Bikaneri Bhujia", "Nylon Sev", "Tikha Gathiya", "Bhavnagri Gathiya", "Mini Bhakarwadi", "Dry Samosa", "Dry Kachori", "Chakli", "Masala Boondi",
            # Chips & Dals
            "Banana Chips (Salted)", "Banana Chips (Mari)", "Banana Chips (Spicy)", "Potato Chips", "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts"
        ]
    },
    "Adukale": {
        "aliases": ["adukale"],
        "items": [
            # Traditional Savories
            "Kodubale (Ring Murukku)", "Chakli (Benne/Butter Chakli)", "Chakli (Rice Chakli)", "Nippattu (Thattai - Plain)", "Nippattu (Masala)", "Nippattu (Onion)", "Congress Kadlekai (Spicy Peanuts)", "Mixture (Bombay Mixture)", "Mixture (Khara Mixture)", "Mixture (Avalakki/Poha Mixture)",
            # Chips & Fryums
            "Jackfruit Chips", "Banana Chips", "Potato Chips", "Sabudana Papad", "Sandige (Rice Fryums)",
            # Sev & Boondi
            "Khara Boondi", "Ompudi (Fine Sev)", "Karasev", "Hurigalu (Roasted Gram Mix)"
        ]
    },
    "Bansiram": {
        "aliases": ["bansiram"],
        "items": [
            # Bhujia & Sev
            "Bikaneri Bhujia", "Aloo Bhujia", "Plain Sev", "Lahsun Sev", "Ratlami Sev", "Mota Sev", "Gathiya",
            # Mixtures & Chiwda
            "Navrattan Mixture", "Khatta Meetha", "Shahi Mixture", "Panchrattan", "Badam Lachha", "Poha Chiwda", "Cornflakes Mixture", "Falahari Mixture",
            # Traditional Bites
            "Dry Samosa", "Dry Kachori", "Methi Mathri", "Namakpara", "Boondi", "Moong Dal", "Chana Dal", "Masala Peanuts", "Roasted Chana"
        ]
    },
    "MTR": {
        "aliases": ["mtr"],
        "items": [
            # Traditional Mixtures
            "Madras Mixture", "Bombay Mixture", "Khatta Meetha", "Cornflakes Mixture", "Poha Mixture", "Boondi Mixture",
            # South Indian Savories
            "Murukku", "Chakli", "Kodubale", "Nippattu", "Masala Peanuts (Congress Peanuts)", "Khara Boondi", "Ompudi",
            # Chips & Dals
            "Banana Chips", "Moong Dal", "Chana Dal", "Aloo Bhujia", "Bikaneri Bhujia"
        ]
    },
    "Gits": {
        "aliases": ["gits"],
        "items": [
            # Ready-to-Eat Savories
            "Bhakarwadi", "Khakhra (Methi)", "Khakhra (Masala)", "Khakhra (Jeera)", "Khakhra (Plain)", "Bhel Puri (Ready-to-mix kit)", "Pani Puri (Ready-to-mix kit)", "Sev Puri", "Masala Peanuts"
        ]
    },
    "Bikaner Sweets": {
        "aliases": ["bikanersweets"],
        "items": [
            # Bhujia & Sev
            "Bikaneri Bhujia", "Aloo Bhujia", "Mota Sev", "Ratlami Sev", "Lahsun Sev", "Papdi Gathiya", "Bhavnagri Gathiya",
            # Mixtures
            "Navratan Mixture", "Khatta Meetha", "Dalmoth", "Shahi Mixture", "Cornflakes Chiwda", "Falahari Chiwda",
            # Counter Savories
            "Methi Mathri", "Tikoni Mathri", "Achari Mathri", "Masala Matthi", "Dry Samosa", "Dry Kachori", "Mini Bhakarwadi", "Namakpara", "Shakkarpara", "Moong Dal", "Masala Kaju", "Masala Peanuts"
        ]
    }
}

report = {}

for bname, bdata in brand_items.items():
    aliases = bdata["aliases"]
    items = bdata["items"]
    
    # Filter DB items for this brand
    brand_db_items = [p for p in db_items if any(al in p["norm_brand"] for al in aliases)]
    
    available = []
    missing = []
    
    for item in items:
        # Normalize item
        clean_item = re.sub(r'\(.*?\)', '', item).strip()
        n_item = norm(clean_item)
        
        # Match against brand_db_items
        match = None
        for db_p in brand_db_items:
            # Check if clean item words are in db product name
            words = [w.lower() for w in clean_item.split() if len(w) > 2]
            pname_lower = db_p["name"].lower()
            if all(w in pname_lower for w in words):
                match = db_p
                break
        
        if match:
            available.append({
                "requested": item,
                "found_name": match["name"],
                "category": match["category"],
                "subCategory": match["subCategory"],
                "barcode": match["barcode"],
                "score": match["score"]
            })
        else:
            missing.append(item)
            
    report[bname] = {
        "total_requested": len(items),
        "available_count": len(available),
        "missing_count": len(missing),
        "available": available,
        "missing": missing,
        "total_brand_in_db": len(brand_db_items)
    }

print(json.dumps({
    b: {
        "requested": data["total_requested"],
        "available": data["available_count"],
        "missing": data["missing_count"],
        "total_in_db": data["total_brand_in_db"]
    } for b, data in report.items()
}, indent=2))

with open("scripts/data/namkeen_availability_report.json", "w") as f:
    json.dump(report, f, indent=2)

print("\nWrote full report to scripts/data/namkeen_availability_report.json")
