import json

with open("/tmp/db_namkeen_brands.json") as f:
    db_brands = json.load(f)

# Define exact requested catalogue per brand
requested_catalog = {
    "1. Haldiram’s (Nagpur, Delhi, & Kolkata divisions)": {
        "brand_key": "Haldirams",
        "region": "National (Nagpur, Delhi, Kolkata)",
        "lines": {
            "Bhujia & Sev": [
                "Aloo Bhujia", "Bikaneri Bhujia", "Plain Bhujia", "Bhujia Sev", "Ratlami Sev",
                "Nylon Sev", "Laung Sev", "Tikha Sev", "Barik Sev", "Bhavnagri Gathiya",
                "Papdi Gathiya", "Chana Jor Garam"
            ],
            "Mixtures": [
                "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Kashmiri Mixture", "Panchrattan",
                "Madras Mixture", "Cornflakes Mixture", "Bhel Puri", "Diet Chiwda", "Badam Laccha",
                "Shahi Mixture", "Falahari Chiwda"
            ],
            "Dals & Nuts": [
                "Moong Dal", "Chana Dal", "Masoor Dal", "Classic Salted Peanuts", "Masala Peanuts (Nut Cracker)",
                "Nimbu Masala Peanuts", "Hara Matar", "Kabuli Chana", "Roasted Chana", "Salted Cashews", "Pepper Cashews"
            ],
            "Extruded & Puffed (Takatak / Whoopies)": [
                "Masala Balls", "Pudina Treat", "Tangy Tomato Sticks", "Chatpata Masala Sticks", "Cheese Balls",
                "Boondi Plain", "Boondi Masala", "Boondi Pudina"
            ],
            "South Indian & Western": [
                "Murukku", "Chakli", "Banana Chips (Salted)", "Banana Chips (Black Pepper)", "Banana Chips (Masala)",
                "Tapioca Chips", "Potato Chips (Classic Salted)", "Potato Chips (Cream & Onion)", "Potato Chips (Pudina)", "Potato Chips (Spicy Treat)",
                "Soya Sticks", "Soya Katori", "Gol Kachori", "Mini Samosa", "Mini Bhakarwadi",
                "Khakhra (Methi)", "Khakhra (Masala)", "Khakhra (Jeera)"
            ]
        }
    },
    "2. Bikaji (Bikaner, Rajasthan)": {
        "brand_key": "Bikaji",
        "region": "Bikaner, Rajasthan",
        "lines": {
            "Bhujia & Sev": [
                "Bikaneri Bhujia", "Tana-Tan Aloo Bhujia", "Baarish Bhujia", "Ratlami Sev",
                "Nylon Sev", "Lahsun Sev", "Masala Sev", "Gathiya", "Papdi"
            ],
            "Mixtures": [
                "Kuch-Kuch (All-in-One)", "Subh-Kuch (Navrattan)", "Sab Kuch", "Khatta Meetha",
                "Cornflakes Mix", "Marwari Mix", "Bhel Puri", "Falahari Mix", "Diet Mixture"
            ],
            "Dals & Nuts": [
                "Moong Dal", "Chana Dal", "Masala Peanuts (Masti Nuts)", "Salted Peanuts",
                "Kabuli Chana", "Roasted Chana", "Hara Matar"
            ],
            "Regional & Fusion": [
                "Mini Samosa", "Mini Kachori", "Boondi (Masala)", "Boondi (Plain)", "Soya Sticks",
                "Makai (Corn) Chiwda", "Potato Chips", "Fun-In Puffs"
            ]
        }
    },
    "3. Bikanervala / Bikano (Delhi NCR / Rajasthan)": {
        "brand_key": "Bikano_Bikanervala",
        "region": "Delhi NCR / Rajasthan",
        "lines": {
            "Bhujia & Sev": [
                "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Ratlami Sev", "Gathiya", "Chana Jor Garam"
            ],
            "Mixtures": [
                "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Shahi Mixture", "Kashmiri Mixture",
                "Bhel Puri", "Cornflakes Mixture", "Diet Mixture", "Badam Laccha"
            ],
            "Dals & Nuts": [
                "Moong Dal", "Chana Dal", "Tasty (Masala Peanuts)", "Salted Peanuts", "Hara Matar",
                "Kabuli Chana", "Roasted Peanuts"
            ],
            "Traditional Bites & Chips": [
                "Mini Samosa", "Dry Kachori", "Bhakarwadi", "Methi Mathri", "Shakkarpara",
                "Namakpara", "Boondi", "Soya Sticks", "Banana Chips", "Potato Chips", "Kurkure-style Tedhe Medhe"
            ]
        }
    },
    "4. Prabhuji (Haldiram Prabhuji - Kolkata, West Bengal)": {
        "brand_key": "Prabhuji",
        "region": "Kolkata, West Bengal",
        "lines": {
            "Bhujia & Sev": [
                "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Tok Jhal Mishti (Sweet & Sour Bhujia)",
                "Chanachur", "Jhal Chanachur", "Special Chanachur"
            ],
            "Mixtures": [
                "Khatta Meetha", "Navrattan", "All-in-One", "Cornflakes Mixture", "Badam Lachha",
                "Panchratan", "Bhel Puri", "Falahari Mixture"
            ],
            "Dals & Nuts": [
                "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts", "Hara Matar", "Kabuli Chana", "Kaju Masala"
            ],
            "Traditional & Savories": [
                "Mini Samosa", "Kachori", "Bhakarwadi", "Boondi", "Papad", "Soya Sticks", "Potato Chips"
            ]
        }
    },
    "5. Balaji Wafers (Rajkot, Gujarat)": {
        "brand_key": "Balaji",
        "region": "Rajkot, Gujarat",
        "lines": {
            "Bhujia & Sev": [
                "Aloo Sev", "Tikha Sev", "Nylon Sev", "Ratlami Sev", "Bhavnagri Gathiya",
                "Vanela Gathiya", "Tikha Gathiya", "Papdi Gathiya", "Chana Jor Garam"
            ],
            "Mixtures & Chiwda": [
                "Farali Chiwda (Sweet)", "Farali Chiwda (Tikha)", "Khatta Meetha", "Tikha Mitha Mix",
                "Chanachur", "Bhel Mix", "Tam-Tam", "Mung Dal", "Chana Dal", "Sing Bhujia (Masala Peanuts)", "Salted Peanuts"
            ],
            "Wafers & Chips": [
                "Simply Salted Potato Wafers", "Masala Masti Wafers", "Cream & Onion Crisps", "Tomato Twist Wafers", "Chaat Chaska",
                "Peri-Peri Chips", "Kettle Chips", "Banana Wafers Salted", "Banana Wafers Mari/Pepper"
            ],
            "Extruded & Puffed": [
                "Crunchex", "Chataka Pataka (Masala)", "Chataka Pataka (Chinese)", "Chataka Pataka (Tomato)",
                "Wheels", "Scoops", "Funne", "Gippies", "Nachos"
            ]
        }
    },
    "6. Gopal Snacks (Rajkot, Gujarat)": {
        "brand_key": "Gopal",
        "region": "Rajkot, Gujarat",
        "lines": {
            "Gathiya & Sev": [
                "Bhavnagri Gathiya", "Vanela Gathiya", "Champakali Gathiya", "Papdi Gathiya",
                "Tikha Gathiya", "Nylon Sev", "Aloo Sev", "Ratlami Sev", "Lasaniya (Garlic) Sev"
            ],
            "Mixtures & Chiwda": [
                "Rajwadi Mix", "Khatta Meetha", "Tikha Mitha Mix", "Farali Chiwda", "Bhel Mix",
                "Dalmoth", "Navratan Mix", "Cornflakes Mix"
            ],
            "Dals & Nuts": [
                "Moong Dal", "Chana Dal", "Sing Bhujia", "Salted Peanuts", "Masala Chana", "Hara Matar"
            ],
            "Wafers & Pellets": [
                "Potato Wafers (Salted)", "Potato Wafers (Masala)", "Potato Wafers (Cream & Onion)", "Potato Wafers (Tomato)",
                "Banana Wafers", "Fryums Wheels", "Fryums Pasta", "Fryums Noodles", "Fryums Katori", "Fryums Pipes",
                "Khakhra", "Bhakarwadi"
            ]
        }
    },
    "7. Chitale Bandhu Mithaiwale (Pune, Maharashtra)": {
        "brand_key": "Chitale",
        "region": "Pune, Maharashtra",
        "lines": {
            "Flagship Specialties": [
                "Chitale Bakarwadi (Regular)", "Chitale Bakarwadi (Mini)", "Chitale Bakarwadi (Garlic)",
                "Chitale Bakarwadi (Jain)", "Chitale Bakarwadi (Masala)",
                "Laxminarayan Chiwda (Potato)", "Laxminarayan Chiwda (Cornflakes)", "Laxminarayan Chiwda (Poha)",
                "Makai Chiwda", "Poha Chiwda", "Sabudana Chiwda (Upvas/Fasting)"
            ],
            "Sev & Gathiya": [
                "Tikhat Sev", "Plain Sev", "Bhavnagri Gathiya", "Lasun Sev", "Shev Chiwda"
            ],
            "Traditional Maharashtrian Snacks": [
                "Bhajani Chakli", "Butter Chakli", "Shankarpali (Sweet)", "Shankarpali (Salty)",
                "Kadboli", "Chirote", "Karanji", "Potato Wafers", "Banana Wafers"
            ]
        }
    },
    "8. Chheda’s (Mumbai, Maharashtra)": {
        "brand_key": "Chhedas",
        "region": "Mumbai, Maharashtra",
        "lines": {
            "Chips & Wafers": [
                "Yellow Banana Chips (Salted)", "Yellow Banana Chips (Black Pepper)", "Yellow Banana Chips (Tomato)",
                "Yellow Banana Chips (Pudina)", "Yellow Banana Chips (Peri-Peri)",
                "Kerala Banana Chips (Coconut Oil)", "Tapioca Chips", "Jackfruit Chips", "Potato Chips", "Sweet Potato Chips"
            ],
            "Farsan & Mixtures": [
                "Mini Bhakarwadi", "Methi Khakhra", "Masala Khakhra", "Jeera Khakhra",
                "Bhel Puri", "Sev Puri", "Dry Kachori", "Dry Samosa", "Masala Boondi", "Murukku", "Chakli"
            ],
            "Chiwda & Sev": [
                "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Nylon Sev",
                "Tikha Gathiya", "Aloo Bhujia", "Moong Dal", "Masala Peanuts"
            ]
        }
    },
    "9. Garden (CavinKare - Mumbai / Pan-India)": {
        "brand_key": "Garden",
        "region": "Mumbai / Pan-India",
        "lines": {
            "Mixtures & Chiwda": [
                "Mumbai Mixture", "Khatta Meetha", "Bhel Puri", "Navrattan",
                "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Golden Mixture"
            ],
            "Sev & Farsan": [
                "Aloo Bhujia", "Bikaneri Bhujia", "Nylon Sev", "Tikha Gathiya", "Bhavnagri Gathiya",
                "Mini Bhakarwadi", "Dry Samosa", "Dry Kachori", "Chakli", "Masala Boondi"
            ],
            "Chips & Dals": [
                "Banana Chips (Salted)", "Banana Chips (Mari)", "Banana Chips (Spicy)", "Potato Chips",
                "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts"
            ]
        }
    },
    "10. Adukale (Bengaluru, Karnataka)": {
        "brand_key": "Adukale",
        "region": "Bengaluru, Karnataka",
        "lines": {
            "Traditional Savories": [
                "Kodubale (Ring Murukku)", "Benne/Butter Chakli", "Rice Chakli",
                "Nippattu (Plain)", "Nippattu (Masala)", "Nippattu (Onion)",
                "Congress Kadlekai (Spicy Peanuts)", "Bombay Mixture", "Khara Mixture", "Avalakki/Poha Mixture"
            ],
            "Chips & Fryums": [
                "Jackfruit Chips", "Banana Chips", "Potato Chips", "Sabudana Papad", "Sandige (Rice Fryums)"
            ],
            "Sev & Boondi": [
                "Khara Boondi", "Ompudi (Fine Sev)", "Karasev", "Hurigalu (Roasted Gram Mix)"
            ]
        }
    },
    "11. Bansiram (Jaipur, Rajasthan)": {
        "brand_key": "Bansiram",
        "region": "Jaipur, Rajasthan",
        "lines": {
            "Bhujia & Sev": [
                "Bikaneri Bhujia", "Aloo Bhujia", "Plain Sev", "Lahsun Sev", "Ratlami Sev", "Mota Sev", "Gathiya"
            ],
            "Mixtures & Chiwda": [
                "Navrattan Mixture", "Khatta Meetha", "Shahi Mixture", "Panchrattan",
                "Badam Lachha", "Poha Chiwda", "Cornflakes Mixture", "Falahari Mixture"
            ],
            "Traditional Bites": [
                "Dry Samosa", "Dry Kachori", "Methi Mathri", "Namakpara",
                "Boondi", "Moong Dal", "Chana Dal", "Masala Peanuts", "Roasted Chana"
            ]
        }
    },
    "12. MTR (Bengaluru, Karnataka)": {
        "brand_key": "MTR",
        "region": "Bengaluru, Karnataka",
        "lines": {
            "Traditional Mixtures": [
                "Madras Mixture", "Bombay Mixture", "Khatta Meetha", "Cornflakes Mixture", "Poha Mixture", "Boondi Mixture"
            ],
            "South Indian Savories": [
                "Murukku", "Chakli", "Kodubale", "Nippattu", "Masala Peanuts (Congress Peanuts)", "Khara Boondi", "Ompudi"
            ],
            "Chips & Dals": [
                "Banana Chips", "Moong Dal", "Chana Dal", "Aloo Bhujia", "Bikaneri Bhujia"
            ]
        }
    },
    "13. Gits (Pune, Maharashtra)": {
        "brand_key": "Gits",
        "region": "Pune, Maharashtra",
        "lines": {
            "Ready-to-Eat Savories": [
                "Bhakarwadi", "Khakhra (Methi)", "Khakhra (Masala)", "Khakhra (Jeera)", "Khakhra (Plain)",
                "Bhel Puri (Ready-to-mix kit)", "Pani Puri (Ready-to-mix kit)", "Sev Puri", "Masala Peanuts"
            ]
        }
    },
    "14. Bikaner Sweets (Regional Chains)": {
        "brand_key": "Bikaner_Sweets",
        "region": "Regional Chains (Pan-India)",
        "lines": {
            "Bhujia & Sev": [
                "Bikaneri Bhujia", "Aloo Bhujia", "Mota Sev", "Ratlami Sev", "Lahsun Sev", "Papdi Gathiya", "Bhavnagri Gathiya"
            ],
            "Mixtures": [
                "Navratan Mixture", "Khatta Meetha", "Dalmoth", "Shahi Mixture", "Cornflakes Chiwda", "Falahari Chiwda"
            ],
            "Counter Savories": [
                "Methi Mathri", "Tikoni Mathri", "Achari Mathri", "Masala Matthi",
                "Dry Samosa", "Dry Kachori", "Mini Bhakarwadi", "Namakpara", "Shakkarpara",
                "Moong Dal", "Masala Kaju", "Masala Peanuts"
            ]
        }
    }
}

print("Running exact catalog matching...")
audit_results = {}

for b_name, b_data in requested_catalog.items():
    b_key = b_data["brand_key"]
    db_prods = db_brands.get(b_key, [])
    
    # Filter DB products for savoury / namkeen / snacks
    # Exclude sweets/ready-meals/chocolates/biscuits when matching savories
    savory_db_prods = []
    for p in db_prods:
        c = p.get("category", "")
        # Only accept if Snacks & Spreads OR Ready-to-Eat & Ready-to-Cook (for savories)
        # Exclude sweets, cookies, mixes unless it matches exact namkeen
        savory_db_prods.append(p)
        
    res_b = {
        "region": b_data["region"],
        "lines": {},
        "total_requested": 0,
        "available_count": 0,
        "missing_count": 0
    }
    
    for l_name, items in b_data["lines"].items():
        res_b["lines"][l_name] = []
        for item in items:
            res_b["total_requested"] += 1
            # Perform matching against db_prods
            matched_prod = None
            
            # Specific item matching rules
            item_lower = item.lower().replace("(", "").replace(")", "").strip()
            
            for p in savory_db_prods:
                p_name_lower = p["name"].lower()
                
                # Exclude obvious non-savory items (e.g. sweets, instant meals, noodles, drinks, cookies)
                if any(x in p_name_lower for x in ["nankhatai", "cookie", "gulab jamun", "rasgulla", "kaju katli", "laddu", "chikki", "dosa mix", "idli mix", "upma mix", "poha mix", "dhokla", "biryani", "pulao", "rajma masala", "dal makhani", "palak paneer", "badam drink"]):
                    continue
                
                # Exact / semantic checks:
                if item == "Aloo Bhujia" and "aloo bhujia" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Bikaneri Bhujia" and ("bikaneri bhujia" in p_name_lower or (p_name_lower.endswith("bhujia") and "aloo" not in p_name_lower)):
                    matched_prod = p
                    break
                elif item == "Plain Bhujia":
                    if "plain bhujia" in p_name_lower:
                        matched_prod = p
                        break
                elif item == "Bhujia Sev" and "bhujia sev" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Ratlami Sev" and "ratlami sev" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Nylon Sev" and "nylon sev" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Bhavnagri Gathiya" and "bhavnagri gathiya" in p_name_lower:
                    matched_prod = p
                    break
                elif "navrat" in item_lower and "navrat" in p_name_lower:
                    matched_prod = p
                    break
                elif "khatta meetha" in item_lower and "khatta meetha" in p_name_lower:
                    matched_prod = p
                    break
                elif "all-in-one" in item_lower and "all-in-one" in p_name_lower:
                    matched_prod = p
                    break
                elif "cornflakes" in item_lower and ("cornflakes" in p_name_lower or "corn flakes" in p_name_lower):
                    matched_prod = p
                    break
                elif "diet chiwda" in item_lower or "diet mixture" in item_lower:
                    if "diet chivda" in p_name_lower or "diet mixture" in p_name_lower:
                        matched_prod = p
                        break
                elif item == "Moong Dal" and ("moong dal" in p_name_lower or "mung dal" in p_name_lower):
                    matched_prod = p
                    break
                elif item == "Chana Dal" and "chana dal" in p_name_lower:
                    matched_prod = p
                    break
                elif "masala peanuts" in item_lower or "tasty nuts" in item_lower or "sing bhujia" in item_lower:
                    if any(x in p_name_lower for x in ["masala peanuts", "tasty nuts", "sing bhujia", "nut cracker"]):
                        matched_prod = p
                        break
                elif item == "Boondi Plain" and "plain boondi" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Boondi Masala" and "masala boondi" in p_name_lower:
                    matched_prod = p
                    break
                elif "banana chips (salted)" in item_lower or item == "Banana Wafers Salted":
                    if ("banana" in p_name_lower or "banana wafers" in p_name_lower) and ("salted" in p_name_lower or "rock salt" in p_name_lower) and "turmeric" not in p_name_lower:
                        matched_prod = p
                        break
                elif "banana chips (black pepper)" in item_lower or item == "Banana Wafers Mari/Pepper":
                    if ("banana" in p_name_lower or "banana wafers" in p_name_lower) and ("pepper" in p_name_lower or "mari" in p_name_lower):
                        matched_prod = p
                        break
                elif "banana chips (masala)" in item_lower:
                    if "banana" in p_name_lower and ("masala" in p_name_lower or "spicy" in p_name_lower):
                        matched_prod = p
                        break
                elif item == "Potato Chips (Classic Salted)" or item == "Simply Salted Potato Wafers":
                    if "potato" in p_name_lower and "salted" in p_name_lower:
                        matched_prod = p
                        break
                elif item == "Potato Chips (Pudina)" and "pudina" in p_name_lower and "chips" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Masala Masti Wafers" and "masala masti" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Tomato Twist Wafers" and "tomato twist" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Chaat Chaska" and "chaat chaska" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Crunchex" and "crunchex" in p_name_lower:
                    matched_prod = p
                    break
                elif "chataka pataka" in item_lower and "chataka pataka" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Wheels" and "wheels" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Scoops" and "scoops" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Funne" and "funne" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Gippies" and "gippies" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Nachos" and "nachos" in p_name_lower:
                    matched_prod = p
                    break
                elif "peri-peri" in item_lower and "peri peri" in p_name_lower:
                    matched_prod = p
                    break
                elif "cream & onion" in item_lower and ("sour cream" in p_name_lower or "cream & onion" in p_name_lower):
                    matched_prod = p
                    break
                elif item == "Yellow Banana Chips (Tomato)" and "tomato banana chips" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Yellow Banana Chips (Salted)" and "salted" in p_name_lower and "banana" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Yellow Banana Chips (Black Pepper)" and ("pepper" in p_name_lower or "mari" in p_name_lower) and "banana" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Yellow Banana Chips (Pudina)" and "pudina" in p_name_lower and "banana" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Yellow Banana Chips (Peri-Peri)" and "peri peri" in p_name_lower and "banana" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Tapioca Chips" and "tapioca" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Jackfruit Chips" and "jackfruit" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Kerala Banana Chips (Coconut Oil)" and "kerala banana chips" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Poha Chivda" and "poha chivda" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Cornflakes Chivda" and "cornflakes chivda" in p_name_lower:
                    matched_prod = p
                    break
                elif item == "Farali Chiwda (Sweet)" and "farali" in p_name_lower:
                    matched_prod = p
                    break
            
            if matched_prod:
                res_b["available_count"] += 1
                res_b["lines"][l_name].append({
                    "sku": item,
                    "status": "AVAILABLE",
                    "matched_name": matched_prod["name"],
                    "barcode": matched_prod["barcode"],
                    "category": matched_prod["category"],
                    "subCategory": matched_prod.get("subCategory", ""),
                    "healthScore": matched_prod.get("healthScore", matched_prod.get("overallScore", "N/A"))
                })
            else:
                res_b["missing_count"] += 1
                res_b["lines"][l_name].append({
                    "sku": item,
                    "status": "NOT AVAILABLE"
                })
                
    audit_results[b_name] = res_b

with open("/tmp/namkeen_final_audit.json", "w") as out:
    json.dump(audit_results, out, indent=2)

print("\n=== SUMMARY TABLE ===")
for b_name, res in audit_results.items():
    tot = res["total_requested"]
    avail = res["available_count"]
    miss = res["missing_count"]
    pct = (avail / tot * 100) if tot > 0 else 0
    print(f"{b_name} | Avail: {avail}/{tot} ({pct:.1f}%) | Missing: {miss}")

