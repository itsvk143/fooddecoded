import json

with open("/tmp/db_namkeen_brands.json") as f:
    db_brands = json.load(f)

# Define exact requested catalogue per brand
requested_catalog = [
    {
        "id": 1,
        "brand_name": "Haldiram’s",
        "division": "Nagpur, Delhi, & Kolkata divisions",
        "brand_key": "Haldirams",
        "sections": {
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
    {
        "id": 2,
        "brand_name": "Bikaji",
        "division": "Bikaner, Rajasthan",
        "brand_key": "Bikaji",
        "sections": {
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
    {
        "id": 3,
        "brand_name": "Bikanervala / Bikano",
        "division": "Delhi NCR / Rajasthan",
        "brand_key": "Bikano_Bikanervala",
        "sections": {
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
    {
        "id": 4,
        "brand_name": "Prabhuji (Haldiram Prabhuji)",
        "division": "Kolkata, West Bengal",
        "brand_key": "Prabhuji",
        "sections": {
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
    {
        "id": 5,
        "brand_name": "Balaji Wafers",
        "division": "Rajkot, Gujarat",
        "brand_key": "Balaji",
        "sections": {
            "Bhujia & Sev": [
                "Aloo Sev", "Tikha Sev", "Nylon Sev", "Ratlami Sev", "Bhavnagri Gathiya",
                "Vanela Gathiya", "Tikha Gathiya", "Papdi Gathiya", "Chana Jor Garam"
            ],
            "Mixtures & Chiwda": [
                "Farali Chiwda (Sweet & Tikha)", "Khatta Meetha", "Tikha Mitha Mix",
                "Chanachur", "Bhel Mix", "Tam-Tam", "Mung Dal", "Chana Dal", "Sing Bhujia (Masala Peanuts)", "Salted Peanuts"
            ],
            "Wafers & Chips": [
                "Simply Salted", "Masala Masti", "Cream & Onion", "Tomato Twist", "Chaat Chaska",
                "Peri-Peri", "Kettle Chips", "Banana Wafers (Salted)", "Banana Wafers (Mari/Pepper)"
            ],
            "Extruded & Puffed": [
                "Crunchex", "Chataka Pataka (Masala, Chinese, Tomato)",
                "Wheels", "Scoops", "Funne", "Gippies", "Nachos"
            ]
        }
    },
    {
        "id": 6,
        "brand_name": "Gopal Snacks",
        "division": "Rajkot, Gujarat",
        "brand_key": "Gopal",
        "sections": {
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
                "Potato Wafers (Salted, Masala, Cream & Onion, Tomato)",
                "Banana Wafers", "Fryums (Wheels, Pasta, Noodles, Katori, Pipes)",
                "Khakhra", "Bhakarwadi"
            ]
        }
    },
    {
        "id": 7,
        "brand_name": "Chitale Bandhu Mithaiwale",
        "division": "Pune, Maharashtra",
        "brand_key": "Chitale",
        "sections": {
            "Flagship Specialties": [
                "Chitale Bakarwadi (Regular, Mini, Garlic, Jain, Masala)",
                "Laxminarayan Chiwda (Potato, Cornflakes, Poha)",
                "Makai Chiwda", "Poha Chiwda", "Sabudana Chiwda (Upvas/Fasting)"
            ],
            "Sev & Gathiya": [
                "Tikhat Sev", "Plain Sev", "Bhavnagri Gathiya", "Lasun Sev", "Shev Chiwda"
            ],
            "Traditional Maharashtrian Snacks": [
                "Chakli (Bhajani Chakli, Butter Chakli)",
                "Shankarpali (Sweet & Salty)",
                "Kadboli", "Chirote", "Karanji", "Potato Wafers", "Banana Wafers"
            ]
        }
    },
    {
        "id": 8,
        "brand_name": "Chheda’s",
        "division": "Mumbai, Maharashtra",
        "brand_key": "Chhedas",
        "sections": {
            "Chips & Wafers": [
                "Yellow Banana Chips (Salted, Black Pepper, Tomato, Pudina, Peri-Peri)",
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
    {
        "id": 9,
        "brand_name": "Garden (CavinKare)",
        "division": "Mumbai / Pan-India",
        "brand_key": "Garden",
        "sections": {
            "Mixtures & Chiwda": [
                "Mumbai Mixture", "Khatta Meetha", "Bhel Puri", "Navrattan",
                "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Golden Mixture"
            ],
            "Sev & Farsan": [
                "Aloo Bhujia", "Bikaneri Bhujia", "Nylon Sev", "Tikha Gathiya", "Bhavnagri Gathiya",
                "Mini Bhakarwadi", "Dry Samosa", "Dry Kachori", "Chakli", "Masala Boondi"
            ],
            "Chips & Dals": [
                "Banana Chips (Salted, Mari, Spicy)", "Potato Chips",
                "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts"
            ]
        }
    },
    {
        "id": 10,
        "brand_name": "Adukale",
        "division": "Bengaluru, Karnataka",
        "brand_key": "Adukale",
        "sections": {
            "Traditional Savories": [
                "Kodubale (Ring Murukku)", "Chakli (Benne/Butter Chakli, Rice Chakli)",
                "Nippattu (Thattai - Plain, Masala, Onion)",
                "Congress Kadlekai (Spicy Peanuts)", "Mixture (Bombay Mixture, Khara Mixture, Avalakki/Poha Mixture)"
            ],
            "Chips & Fryums": [
                "Jackfruit Chips", "Banana Chips", "Potato Chips", "Sabudana Papad", "Sandige (Rice Fryums)"
            ],
            "Sev & Boondi": [
                "Khara Boondi", "Ompudi (Fine Sev)", "Karasev", "Hurigalu (Roasted Gram Mix)"
            ]
        }
    },
    {
        "id": 11,
        "brand_name": "Bansiram",
        "division": "Jaipur, Rajasthan",
        "brand_key": "Bansiram",
        "sections": {
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
    {
        "id": 12,
        "brand_name": "MTR",
        "division": "Bengaluru, Karnataka",
        "brand_key": "MTR",
        "sections": {
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
    {
        "id": 13,
        "brand_name": "Gits",
        "division": "Pune, Maharashtra",
        "brand_key": "Gits",
        "sections": {
            "Ready-to-Eat Savories": [
                "Bhakarwadi", "Khakhra (Methi, Masala, Jeera, Plain)", "Bhel Puri (Ready-to-mix kit)",
                "Pani Puri (Ready-to-mix kit)", "Sev Puri", "Masala Peanuts"
            ]
        }
    },
    {
        "id": 14,
        "brand_name": "Bikaner Sweets",
        "division": "Regional Chains (Pan-India)",
        "brand_key": "Bikaner_Sweets",
        "sections": {
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
]

# Print detailed analysis and mapping for each brand
for brand_info in requested_catalog:
    b_id = brand_info["id"]
    b_name = brand_info["brand_name"]
    div = brand_info["division"]
    b_key = brand_info["brand_key"]
    
    prods_in_db = db_brands.get(b_key, [])
    # Filter to savoury products
    savory_db = [p for p in prods_in_db if p["category"] == "Snacks & Spreads" and "Biscuits" not in p.get("subCategory", "")]
    
    print(f"\n=======================================================")
    print(f"BRAND #{b_id}: {b_name} ({div})")
    print(f"Total Database Savory SKUs found: {len(savory_db)}")
    print(f"=======================================================")
    
    for sec_name, sku_list in brand_info["sections"].items():
        print(f"\n  Section: {sec_name}")
        for sku_item in sku_list:
            # Check availability
            # We match against savory_db items
            matches = []
            for p in savory_db:
                pname = p["name"].lower()
                s_item_clean = sku_item.lower()
                
                # Check for Haldirams specific
                if b_key == "Haldirams":
                    if sku_item == "Aloo Bhujia" and "aloo bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Bikaneri Bhujia" and "bikaneri bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Bhujia Sev" and "bhujia sev" in pname:
                        matches.append(p)
                    elif sku_item == "Ratlami Sev" and "ratlami sev" in pname:
                        matches.append(p)
                    elif sku_item == "Nylon Sev" and "nylon sev" in pname:
                        matches.append(p)
                    elif sku_item == "Bhavnagri Gathiya" and "bhavnagri gathiya" in pname:
                        matches.append(p)
                    elif sku_item == "Navrattan Mixture" and "navratan" in pname:
                        matches.append(p)
                    elif sku_item == "Khatta Meetha" and "khatta meetha" in pname:
                        matches.append(p)
                    elif sku_item == "All-in-One" and "all-in-one" in pname:
                        matches.append(p)
                    elif sku_item == "Cornflakes Mixture" and "cornflakes" in pname:
                        matches.append(p)
                    elif sku_item == "Diet Chiwda" and "diet chivda" in pname:
                        matches.append(p)
                    elif sku_item == "Moong Dal" and "moong dal" in pname:
                        matches.append(p)
                    elif sku_item == "Chana Dal" and "chana dal" in pname:
                        matches.append(p)
                    elif sku_item == "Masala Peanuts (Nut Cracker)" and ("masala peanuts" in pname or "tasty nuts" in pname):
                        matches.append(p)
                    elif sku_item == "Boondi Plain" and "plain boondi" in pname:
                        matches.append(p)
                    elif sku_item == "Boondi Masala" and "masala boondi" in pname:
                        matches.append(p)
                    elif sku_item == "Banana Chips (Salted)" and ("salted banana" in pname or "salted kerala banana" in pname):
                        matches.append(p)
                    elif sku_item == "Banana Chips (Black Pepper)" and ("black pepper" in pname or "mari" in pname) and "banana" in pname:
                        matches.append(p)
                    elif sku_item == "Banana Chips (Masala)" and ("masala banana" in pname or "spicy masala banana" in pname):
                        matches.append(p)
                    elif sku_item == "Potato Chips (Classic Salted)" and "classic salted potato chips" in pname:
                        matches.append(p)
                    elif sku_item == "Potato Chips (Pudina)" and "pudina treat potato chips" in pname:
                        matches.append(p)
                
                # Check for Bikaji
                elif b_key == "Bikaji":
                    if sku_item == "Bikaneri Bhujia" and "bikaneri bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Ratlami Sev" and "ratlami sev" in pname:
                        matches.append(p)
                    elif sku_item == "Nylon Sev" and "nylon sev" in pname:
                        matches.append(p)
                    elif sku_item == "Gathiya" and "gathiya" in pname:
                        matches.append(p)
                    elif sku_item == "Kuch-Kuch (All-in-One)" and "all-in-one" in pname:
                        matches.append(p)
                    elif sku_item == "Subh-Kuch (Navrattan)" and "navratan" in pname:
                        matches.append(p)
                    elif sku_item == "Khatta Meetha" and "khatta meetha" in pname:
                        matches.append(p)
                    elif sku_item == "Cornflakes Mix" and "cornflakes" in pname:
                        matches.append(p)
                    elif sku_item == "Diet Mixture" and "diet chivda" in pname:
                        matches.append(p)
                    elif sku_item == "Moong Dal" and "moong dal" in pname:
                        matches.append(p)
                    elif sku_item == "Chana Dal" and "chana dal" in pname:
                        matches.append(p)
                    elif sku_item == "Masala Peanuts (Masti Nuts)" and ("masala peanuts" in pname or "tasty nuts" in pname):
                        matches.append(p)
                    elif sku_item == "Boondi (Masala)" and "masala boondi" in pname:
                        matches.append(p)
                
                # Check for Bikano / Bikanervala
                elif b_key == "Bikano_Bikanervala":
                    if sku_item == "Bikaneri Bhujia" and "bikaneri bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Aloo Bhujia" and "aloo bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Ratlami Sev" and "ratlami sev" in pname:
                        matches.append(p)
                    elif sku_item == "Gathiya" and "gathiya" in pname:
                        matches.append(p)
                    elif sku_item == "Navrattan Mixture" and "navratan" in pname:
                        matches.append(p)
                    elif sku_item == "Khatta Meetha" and "khatta meetha" in pname:
                        matches.append(p)
                    elif sku_item == "All-in-One" and "all-in-one" in pname:
                        matches.append(p)
                    elif sku_item == "Cornflakes Mixture" and "cornflakes" in pname:
                        matches.append(p)
                    elif sku_item == "Diet Mixture" and "diet chivda" in pname:
                        matches.append(p)
                    elif sku_item == "Moong Dal" and "moong dal" in pname:
                        matches.append(p)
                    elif sku_item == "Chana Dal" and "chana dal" in pname:
                        matches.append(p)
                    elif sku_item == "Tasty (Masala Peanuts)" and ("masala peanuts" in pname or "tasty nuts" in pname):
                        matches.append(p)
                    elif sku_item == "Boondi" and "boondi" in pname:
                        matches.append(p)
                    elif sku_item == "Banana Chips" and "banana chips" in pname:
                        matches.append(p)
                        
                # Check for Prabhuji
                elif b_key == "Prabhuji":
                    if sku_item == "Aloo Bhujia" and "aloo bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Bikaneri Bhujia" and "bikaneri bhujia" in pname:
                        matches.append(p)

                # Check for Balaji Wafers
                elif b_key == "Balaji":
                    if sku_item == "Aloo Sev" and "aloo sev" in pname:
                        matches.append(p)
                    elif sku_item == "Ratlami Sev" and "ratlami sev" in pname:
                        matches.append(p)
                    elif sku_item == "Nylon Sev" and "nylon sev" in pname:
                        matches.append(p)
                    elif sku_item == "Bhavnagri Gathiya" and "bhavnagri gathiya" in pname:
                        matches.append(p)
                    elif sku_item == "Khatta Meetha" and "khatta meetha" in pname:
                        matches.append(p)
                    elif sku_item == "Chana Dal" and "chana dal" in pname:
                        matches.append(p)
                    elif "masala peanuts" in sku_item.lower() and ("masala peanuts" in pname or "tasty nuts" in pname):
                        matches.append(p)
                    elif sku_item == "Simply Salted" and ("simply salted" in pname or "classic salted" in pname):
                        matches.append(p)
                    elif sku_item == "Masala Masti" and "masala masti" in pname:
                        matches.append(p)
                    elif sku_item == "Cream & Onion" and "cream & onion" in pname:
                        matches.append(p)
                    elif sku_item == "Tomato Twist" and "tomato twist" in pname:
                        matches.append(p)
                    elif sku_item == "Chaat Chaska" and "chaat chaska" in pname:
                        matches.append(p)
                    elif sku_item == "Peri-Peri" and "peri peri" in pname:
                        matches.append(p)
                    elif "banana wafers" in sku_item.lower():
                        if "salted" in sku_item.lower() and ("salted" in pname or "salt" in pname):
                            matches.append(p)
                        elif ("mari" in sku_item.lower() or "pepper" in sku_item.lower()) and ("mari" in pname or "pepper" in pname):
                            matches.append(p)
                    elif sku_item == "Crunchex" and "crunchex" in pname:
                        matches.append(p)

                # Check for Chheda's
                elif b_key == "Chhedas":
                    if "yellow banana chips" in sku_item.lower():
                        if "salted" in sku_item.lower() and "salted" in pname and "banana" in pname:
                            matches.append(p)
                        elif "black pepper" in sku_item.lower() and "pepper" in pname and "banana" in pname:
                            matches.append(p)
                        elif "tomato" in sku_item.lower() and "tomato" in pname and "banana" in pname:
                            matches.append(p)
                        elif "peri-peri" in sku_item.lower() and "peri peri" in pname and "banana" in pname:
                            matches.append(p)
                    elif sku_item == "Kerala Banana Chips (Coconut Oil)" and "kerala banana" in pname:
                        matches.append(p)
                    elif sku_item == "Tapioca Chips" and "tapioca" in pname:
                        matches.append(p)
                    elif sku_item == "Jackfruit Chips" and "jackfruit" in pname:
                        matches.append(p)
                    elif sku_item == "Cornflakes Chiwda" and "cornflakes" in pname:
                        matches.append(p)
                    elif sku_item == "Diet Poha Chiwda" and "diet" in pname:
                        matches.append(p)
                    elif sku_item == "Nylon Sev" and "nylon sev" in pname:
                        matches.append(p)
                    elif sku_item == "Aloo Bhujia" and "aloo bhujia" in pname:
                        matches.append(p)
                    elif sku_item == "Moong Dal" and "moong dal" in pname:
                        matches.append(p)
                    elif sku_item == "Masala Peanuts" and ("masala peanuts" in pname or "tasty nuts" in pname):
                        matches.append(p)
                    elif sku_item == "Masala Boondi" and "boondi" in pname:
                        matches.append(p)

            if matches:
                m = matches[0]
                score = m.get("healthScore", m.get("overallScore", "N/A"))
                print(f"    [AVAILABLE] {sku_item} -> \"{m['name']}\" (Barcode: {m['barcode']}, Score: {score}/100)")
            else:
                print(f"    [NOT AVAILABLE] {sku_item}")

