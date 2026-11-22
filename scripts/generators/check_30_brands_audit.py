import json

with open("/tmp/existing_30_brands.json") as f:
    existing_by_brand = json.load(f)

# The complete 30-brand catalogue from user request:
CATALOGUE = {
    # 1. Global & Mass-Market Potato/Corn Snack Giants
    "Lay's": {
        "key": "lays",
        "category": "Snacks & Spreads",
        "items": [
            ("Classic Potato Chips", "India’s Magic Masala"),
            ("Classic Potato Chips", "Classic Salted"),
            ("Classic Potato Chips", "American Style Cream & Onion"),
            ("Classic Potato Chips", "Spanish Tomato Tango"),
            ("Classic Potato Chips", "Chile Limon"),
            ("Classic Potato Chips", "West Indies Hot 'n' Sweet Chilli"),
            ("Classic Potato Chips", "Sizzlin' Hot"),
            ("Lay's Maxx (Ridged)", "Macho Chilli"),
            ("Lay's Maxx (Ridged)", "Sizzling Barbeque"),
            ("Lay's Maxx (Ridged)", "Pepper Barbeque"),
            ("Lay's Gourmet (Kettle Cooked)", "Thai Sweet Chilli"),
            ("Lay's Gourmet (Kettle Cooked)", "Lime & Cracked Pepper"),
            ("Lay's Gourmet (Kettle Cooked)", "Vintage Cheese & Paprika"),
            ("Lay's Crisp", "Herb & Onion"),
            ("Lay's Crisp", "Classic Salted")
        ]
    },
    "Kurkure": {
        "key": "kurkure",
        "category": "Snacks & Spreads",
        "items": [
            ("Extruded Sticks", "Masala Munch"),
            ("Extruded Sticks", "Green Chutney Rajasthani Style"),
            ("Extruded Sticks", "Chilli Chatka"),
            ("Extruded Sticks", "Naughty Tomato"),
            ("Extruded Sticks", "Hyderabadi Hungama"),
            ("Extruded Sticks", "Schezwan Chutney"),
            ("Extruded Sticks", "Sizzlin' Hot"),
            ("Solid Masti", "Twisteez (Masala)"),
            ("Playz", "Puffcorn (Yummy Cheese)"),
            ("Playz", "Pastax (Masala)"),
            ("Multigrain", "Lite & Crunchy (Masala)")
        ]
    },
    "Bingo!": {
        "key": "bingo",
        "category": "Snacks & Spreads",
        "items": [
            ("Mad Angles", "Achaari Masti"),
            ("Mad Angles", "Tomato Madness"),
            ("Mad Angles", "Masala Madness"),
            ("Mad Angles", "Very Peri Peri"),
            ("Mad Angles", "Pizza Aah"),
            ("Mad Angles", "Cheese Nachos"),
            ("Mad Angles", "Chaat Masti"),
            ("Tedhe Medhe", "Masala Tadka"),
            ("Tedhe Medhe", "Achaari Masti"),
            ("Tedhe Medhe", "Chatpata Twist"),
            ("Tedhe Medhe", "Xtra Teekha"),
            ("Original Style", "Chilli Sprinkled"),
            ("Original Style", "Salt Sprinkled"),
            ("Original Style", "Cream & Onion"),
            ("Original Style", "Chatkila Nimbu"),
            ("Original Style", "Tandoori Masala"),
            ("Hashtags", "Cream & Onion"),
            ("Hashtags", "Spicy Masala"),
            ("Street Bites", "Dahi Chaat"),
            ("Street Bites", "Pani Puri Twist")
        ]
    },
    "Pringles": {
        "key": "pringles",
        "category": "Snacks & Spreads",
        "items": [
            ("Core Canisters", "Original"),
            ("Core Canisters", "Sour Cream & Onion"),
            ("Core Canisters", "Pizza"),
            ("Core Canisters", "Peri Peri"),
            ("Core Canisters", "Desi Masala Tadka"),
            ("Core Canisters", "Schezwan Chutney"),
            ("Core Canisters", "Cheesy Cheese"),
            ("Core Canisters", "Salt & Seaweed"),
            ("Scorchin' Line", "Scorchin' BBQ"),
            ("Scorchin' Line", "Scorchin' Chili & Lime"),
            ("Fusion / Limited", "Mexican Street Corn"),
            ("Fusion / Limited", "Jalapeno")
        ]
    },
    "Doritos": {
        "key": "doritos",
        "category": "Snacks & Spreads",
        "items": [
            ("Tortilla Chips", "Nacho Cheese"),
            ("Tortilla Chips", "Sweet Chilli"),
            ("Tortilla Chips", "Masala Mayhem"),
            ("Tortilla Chips", "Sizzlin' Hot"),
            ("Tortilla Chips", "Cool Ranch"),
            ("Tortilla Chips", "Flamin' Hot Nacho"),
            ("Dinamita", "Fiery Lime & Chilli"),
            ("Dinamita", "Sizzlin' Hot")
        ]
    },
    "Cheetos": {
        "key": "cheetos",
        "category": "Snacks & Spreads",
        "items": [
            ("Puffs & Balls", "Masala Balls"),
            ("Puffs & Balls", "Cheese Puffs"),
            ("Puffs & Balls", "Whoosh (Masala)"),
            ("Puffs & Balls", "Whoosh (Cheese)"),
            ("Puffs & Balls", "X&O (Masala)"),
            ("Crunchy", "Crunchy Cheese"),
            ("Crunchy", "Flamin' Hot Crunchy")
        ]
    },
    "Uncle Chipps": {
        "key": "unclechipps",
        "category": "Snacks & Spreads",
        "items": [
            ("Ripple Potato Chips", "Spicy Treat"),
            ("Ripple Potato Chips", "Plain Salted")
        ]
    },

    # 2. Indian Regional Wafers & Extruded Snack Leaders
    "Balaji Wafers": {
        "key": "balaji",
        "category": "Snacks & Spreads",
        "items": [
            ("Potato Wafers", "Simply Salted"),
            ("Potato Wafers", "Masala Masti"),
            ("Potato Wafers", "Tomato Twist"),
            ("Potato Wafers", "Cream & Onion"),
            ("Potato Wafers", "Chaat Chaska"),
            ("Potato Wafers", "Peri Peri"),
            ("Potato Wafers", "Pizzy Masala"),
            ("Crunchex", "Simply Salted"),
            ("Crunchex", "Chilli Tadka"),
            ("Stack Up", "Salted"),
            ("Stack Up", "Sour Cream & Onion"),
            ("Stack Up", "Masala"),
            ("Rumbles & Wheelos", "Pudina Twist"),
            ("Rumbles & Wheelos", "Masala"),
            ("Extruded & Namkeen", "Gathiya"),
            ("Extruded & Namkeen", "Sev Murmura"),
            ("Extruded & Namkeen", "Aloo Sev"),
            ("Extruded & Namkeen", "Tikha Mitha Mix"),
            ("Extruded & Namkeen", "Moong Dal"),
            ("Extruded & Namkeen", "Chana Jor Garam"),
            ("Extruded & Namkeen", "Farali Chevdo"),
            ("Extruded & Namkeen", "Banana Wafers (Mari)"),
            ("Extruded & Namkeen", "Banana Wafers (Masala)")
        ]
    },
    "Crax": {
        "key": "crax",
        "category": "Snacks & Spreads",
        "items": [
            ("Corn Rings", "Masala Mania"),
            ("Corn Rings", "Tangy Tomato"),
            ("Corn Rings", "Chatpata"),
            ("Corn Rings", "Cheese"),
            ("Curls & Puffs", "Crax Curls (Chatpata Masala)"),
            ("Curls & Puffs", "Biggies (Puffs)"),
            ("Curls & Puffs", "Cheese Balls"),
            ("Curls & Puffs", "Natkhat (Classic)"),
            ("Curls & Puffs", "Natkhat (Masala)"),
            ("Chips & Pellets", "Fritts (Corn & Potato Sticks)"),
            ("Chips & Pellets", "Pipes"),
            ("Chips & Pellets", "Pasta Crunch"),
            ("Chips & Pellets", "Zero Potato Chips (Salted)"),
            ("Chips & Pellets", "Zero Potato Chips (Cream & Onion)"),
            ("Chips & Pellets", "Zero Potato Chips (Masala)")
        ]
    },
    "Gopal Snacks": {
        "key": "gopal",
        "category": "Snacks & Spreads",
        "items": [
            ("Wafers", "Plain Salted"),
            ("Wafers", "Masala Bite"),
            ("Wafers", "Creamy Onion"),
            ("Wafers", "Tomato"),
            ("Wafers", "Peri Peri"),
            ("Extruded", "Cristos (Puffs/Rings)"),
            ("Extruded", "Cornigo (Nachos)"),
            ("Extruded", "Shotz"),
            ("Extruded", "Noodle Masala"),
            ("Namkeen & Gathiya", "Bhavnagri Gathiya"),
            ("Namkeen & Gathiya", "Vanela Gathiya"),
            ("Namkeen & Gathiya", "Champakali Gathiya"),
            ("Namkeen & Gathiya", "Nylon Sev"),
            ("Namkeen & Gathiya", "Ratlami Sev"),
            ("Namkeen & Gathiya", "Fulwadi"),
            ("Namkeen & Gathiya", "Farali Chevdo"),
            ("Namkeen & Gathiya", "Sing Bhujia")
        ]
    },
    "Chheda's": {
        "key": "chhedas",
        "category": "Snacks & Spreads",
        "items": [
            ("Banana & Tapioca Chips", "Long Masala Banana Chips"),
            ("Banana & Tapioca Chips", "Yellow Banana Chips (Salted)"),
            ("Banana & Tapioca Chips", "Yellow Banana Chips (Pepper)"),
            ("Banana & Tapioca Chips", "Mari Banana Chips"),
            ("Banana & Tapioca Chips", "Spicy Tapioca Chips"),
            ("Banana & Tapioca Chips", "Potato Wafers"),
            ("Farsan & Traditional", "Bhakarwadi (Mini)"),
            ("Farsan & Traditional", "Bhakarwadi (Regular)"),
            ("Farsan & Traditional", "Methi Khakhra"),
            ("Farsan & Traditional", "Jeera Khakhra"),
            ("Farsan & Traditional", "Masala Khakhra"),
            ("Farsan & Traditional", "Cornflakes Chivda"),
            ("Farsan & Traditional", "Poha Chivda"),
            ("Farsan & Traditional", "Nylon Sev"),
            ("Farsan & Traditional", "Gathiya"),
            ("Farsan & Traditional", "Chakli"),
            ("Farsan & Traditional", "Shankarpali"),
            ("Farsan & Traditional", "Dry Fruit Kachori")
        ]
    },
    "Prabhuji": {
        "key": "prabhuji",
        "category": "Snacks & Spreads",
        "items": [
            ("Bhujia & Mixtures", "Prabhuji Bhujia"),
            ("Bhujia & Mixtures", "Aloo Bhujia"),
            ("Bhujia & Mixtures", "Chanachur (Jhal)"),
            ("Bhujia & Mixtures", "Chanachur (Tok Jhal Mishti)"),
            ("Bhujia & Mixtures", "Kaju Mixture"),
            ("Bhujia & Mixtures", "Panchratan"),
            ("Bhujia & Mixtures", "Navratan"),
            ("Bhujia & Mixtures", "Moong Dal"),
            ("Bhujia & Mixtures", "Chana Dal"),
            ("Bhujia & Mixtures", "Khatta Meetha"),
            ("Chips & Extruded", "Classic Salted Chips"),
            ("Chips & Extruded", "Masala Chips"),
            ("Chips & Extruded", "Puffitos"),
            ("Chips & Extruded", "Rings"),
            ("Sweets & Bakery", "Soan Papdi"),
            ("Sweets & Bakery", "Rasgulla"),
            ("Sweets & Bakery", "Gulab Jamun"),
            ("Sweets & Bakery", "Kaju Katli"),
            ("Sweets & Bakery", "Dry Cakes"),
            ("Sweets & Bakery", "Cookies")
        ]
    },
    "Chitale Bandhu": {
        "key": "chitale",
        "category": "Snacks & Spreads",
        "items": [
            ("Signature Farsan", "Chitale Bhakarwadi (Regular)"),
            ("Signature Farsan", "Chitale Bhakarwadi (Mini)"),
            ("Signature Farsan", "Chitale Bhakarwadi (Cheese)"),
            ("Signature Farsan", "Chitale Bhakarwadi (Garlic)"),
            ("Signature Farsan", "Lasun Shev"),
            ("Signature Farsan", "Tikhat Shev"),
            ("Signature Farsan", "Sadhi Shev"),
            ("Chivda & Sweets", "Maka Chivda"),
            ("Chivda & Sweets", "Potato Chivda"),
            ("Chivda & Sweets", "Pohe Chivda"),
            ("Chivda & Sweets", "Shankarpali (Sweet)"),
            ("Chivda & Sweets", "Shankarpali (Salted)"),
            ("Chivda & Sweets", "Khari Bundi"),
            ("Chivda & Sweets", "Amba Barfi"),
            ("Chivda & Sweets", "Kaju Katli"),
            ("Chivda & Sweets", "Pedha")
        ]
    },

    # 3. Traditional Namkeen & Bhujia Powerhouses
    "Haldiram's": {
        "key": "haldirams",
        "category": "Snacks & Spreads",
        "items": [
            ("Bhujia & Sev", "Aloo Bhujia"),
            ("Bhujia & Sev", "Bikaneri Bhujia"),
            ("Bhujia & Sev", "Bhujia Sev"),
            ("Bhujia & Sev", "Ratlami Sev"),
            ("Bhujia & Sev", "Nylon Sev"),
            ("Bhujia & Sev", "Pudina Sev"),
            ("Mixtures & Dals", "Khatta Meetha"),
            ("Mixtures & Dals", "Navratan Mix"),
            ("Mixtures & Dals", "All in One"),
            ("Mixtures & Dals", "Punjabi Tadka"),
            ("Mixtures & Dals", "Moong Dal"),
            ("Mixtures & Dals", "Chana Dal"),
            ("Mixtures & Dals", "Masala Peanuts (Nut Cracker)"),
            ("Mixtures & Dals", "Boondi"),
            ("Mixtures & Dals", "Cornflakes Mixture"),
            ("Mixtures & Dals", "Kashmiri Mixture"),
            ("Chips & Western Snacks", "Classic Salted Chips"),
            ("Chips & Western Snacks", "Mast Masala Chips"),
            ("Chips & Western Snacks", "Cream & Onion Chips"),
            ("Chips & Western Snacks", "Takatak (Masala)"),
            ("Chips & Western Snacks", "Takatak (Tomato)"),
            ("Chips & Western Snacks", "Halke Fulke (Puffs)"),
            ("Chips & Western Snacks", "Nachos"),
            ("Chips & Western Snacks", "Makhana"),
            ("Ready-to-Eat & Sweets", "Soan Papdi"),
            ("Ready-to-Eat & Sweets", "Gulab Jamun"),
            ("Ready-to-Eat & Sweets", "Rasgulla"),
            ("Ready-to-Eat & Sweets", "Kaju Katli"),
            ("Ready-to-Eat & Sweets", "Mini Dry Samosa"),
            ("Ready-to-Eat & Sweets", "Mini Dry Kachori"),
            ("Ready-to-Eat & Sweets", "Khakhra")
        ]
    },
    "Bikaji": {
        "key": "bikaji",
        "category": "Snacks & Spreads",
        "items": [
            ("Bhujia & Sev", "Bikaneri Bhujia (Tana Bana)"),
            ("Bhujia & Sev", "Aloo Bhujia"),
            ("Bhujia & Sev", "Sub Kuch (All-in-One)"),
            ("Bhujia & Sev", "Kuch Kuch"),
            ("Bhujia & Sev", "Ratlami Sev"),
            ("Bhujia & Sev", "Laung Sev"),
            ("Bhujia & Sev", "Bhavnagri Gathiya"),
            ("Mixtures & Pulses", "Navratan"),
            ("Mixtures & Pulses", "Khatta Meetha"),
            ("Mixtures & Pulses", "Moong Dal"),
            ("Mixtures & Pulses", "Chana Jor Garam"),
            ("Mixtures & Pulses", "Masala Boondi"),
            ("Mixtures & Pulses", "Shahi Mixture"),
            ("Mixtures & Pulses", "Millet Bhel"),
            ("Chips, Papads & Sweets", "Bikaji Potato Chips"),
            ("Chips, Papads & Sweets", "Corn Chips"),
            ("Chips, Papads & Sweets", "Bikaneri Papad (Moong/Urad)"),
            ("Chips, Papads & Sweets", "Rasgulla"),
            ("Chips, Papads & Sweets", "Gulab Jamun"),
            ("Chips, Papads & Sweets", "Soan Papdi"),
            ("Chips, Papads & Sweets", "Gond Pak")
        ]
    },

    # 4. Baked, Popped & Better-For-You (Clean-Label) Brands
    "Too Yumm!": {
        "key": "tooyumm",
        "category": "Snacks & Spreads",
        "items": [
            ("Baked Multigrain Chips", "Dahi Papdi Chaat"),
            ("Baked Multigrain Chips", "Tangy Tomato"),
            ("Baked Multigrain Chips", "Chilli Achari"),
            ("Baked Multigrain Chips", "Chinese Hot & Sweet"),
            ("Baked Multigrain Chips", "Sour Cream & Onion"),
            ("Karare (Baked Sticks)", "Noodle Masala"),
            ("Karare (Baked Sticks)", "Chilli Achari"),
            ("Karare (Baked Sticks)", "Garlic Peri Peri"),
            ("Karare (Baked Sticks)", "Munchy Masala"),
            ("Karare (Baked Sticks)", "Southern Spice"),
            ("Veggie Stix & Quinoa Puffs", "Sour Cream & Onion"),
            ("Veggie Stix & Quinoa Puffs", "Chilli Chataka"),
            ("Veggie Stix & Quinoa Puffs", "Cheesy Nachos"),
            ("Veggie Stix & Quinoa Puffs", "Khatta Meetha"),
            ("Potato Chips & Ring", "Bhoot Chips (Ghost Pepper)"),
            ("Potato Chips & Ring", "American Style Cream & Onion"),
            ("Potato Chips & Ring", "Classic Salted"),
            ("Potato Chips & Ring", "Rings (Tomato)"),
            ("Potato Chips & Ring", "Rings (Masala)"),
            ("Foxnuts (Makhana)", "Tandoori"),
            ("Foxnuts (Makhana)", "Peri Peri"),
            ("Foxnuts (Makhana)", "Pudina")
        ]
    },
    "BRB (Big Rice Bites)": {
        "key": "brb",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Rice Popped Chips", "Jalapeno & Tomato"),
            ("Rice Popped Chips", "Peri Peri"),
            ("Rice Popped Chips", "Truffle"),
            ("Rice Popped Chips", "Barbeque"),
            ("Rice Popped Chips", "Cream & Onion"),
            ("Rice Popped Chips", "Himalayan Pink Salt"),
            ("Rice Popped Chips", "Cheese & Herbs")
        ]
    },
    "TagZ": {
        "key": "tagz",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Popped Potato Chips", "Masala Trekking"),
            ("Popped Potato Chips", "Cream & Onion Divin'"),
            ("Popped Potato Chips", "Salt Trippin'"),
            ("Popped Potato Chips", "Thai Vodka Tom Yum"),
            ("Popped Potato Chips", "Beer N Barbeque"),
            ("Other Snacks", "Hemp Cookies (Choco Chip)"),
            ("Other Snacks", "Hemp Cookies (Oats)"),
            ("Other Snacks", "Gourmet Salsa Dip"),
            ("Other Snacks", "Gourmet Cheese Dip"),
            ("Other Snacks", "Gourmet Chipotle Dip")
        ]
    },
    "WickedGud": {
        "key": "wickedgud",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Chickpea Popped Chips", "Amreekan Cream & Onion"),
            ("Chickpea Popped Chips", "Desi Masala"),
            ("Chickpea Popped Chips", "Fiery Peri Peri"),
            ("Chickpea Popped Chips", "Tangy Tomato"),
            ("Better-For-You Staples", "Lentil & Brown Rice Noodles (Masala)"),
            ("Better-For-You Staples", "Lentil & Brown Rice Noodles (Schezwan)"),
            ("Better-For-You Staples", "Lentil & Brown Rice Noodles (Hakka)"),
            ("Better-For-You Staples", "High-Protein Pasta (Penne)"),
            ("Better-For-You Staples", "High-Protein Pasta (Fusilli)"),
            ("Better-For-You Staples", "High-Protein Pasta (Macaroni)"),
            ("Better-For-You Staples", "Mac & Cheese")
        ]
    },
    "Snackible": {
        "key": "snackible",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Chips & Puffs", "Baked Ragi Chips (Peri Peri)"),
            ("Chips & Puffs", "Baked Ragi Chips (Cream & Onion)"),
            ("Chips & Puffs", "Baked Ragi Chips (Pizza)"),
            ("Chips & Puffs", "Baked Jowar Puffs (Cheese)"),
            ("Chips & Puffs", "Baked Jowar Puffs (Masala)"),
            ("Chips & Puffs", "Baked Jowar Puffs (Pudina)"),
            ("Chips & Puffs", "Nacho Chips"),
            ("Chips & Puffs", "Quinoa Puffs"),
            ("Sweet & Savory Bites", "Whole Wheat Waffles (Dark Chocolate)"),
            ("Sweet & Savory Bites", "Whole Wheat Waffles (Coffee)"),
            ("Sweet & Savory Bites", "Whole Wheat Waffles (Nutella-style Hazelnut)"),
            ("Sweet & Savory Bites", "Flavoured Makhanas"),
            ("Sweet & Savory Bites", "Energy Bites"),
            ("Sweet & Savory Bites", "Trail Mixes"),
            ("Sweet & Savory Bites", "Dipsters (Lavash with Cheesy Dip)")
        ]
    },
    "Open Secret": {
        "key": "opensecret",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Chips & Crisps", "Veggie Chips (Beetroot)"),
            ("Chips & Crisps", "Veggie Chips (Pumpkin)"),
            ("Chips & Crisps", "Veggie Chips (Spinach)"),
            ("Chips & Crisps", "Ragi Chips (Cream & Onion)"),
            ("Chips & Crisps", "Ragi Chips (Peri Peri)"),
            ("Chips & Crisps", "Ragi Chips (Masala)"),
            ("Nutty Snacks & Cookies", "Nutty Cookies (Choco Almond)"),
            ("Nutty Snacks & Cookies", "Nutty Cookies (Peanut Butter)"),
            ("Nutty Snacks & Cookies", "Nutty Cookies (White Choco Cashew)"),
            ("Nutty Snacks & Cookies", "Nutty Chips"),
            ("Nutty Snacks & Cookies", "Tandoori Nuts"),
            ("Nutty Snacks & Cookies", "Dry Fruit Mixes"),
            ("Nutty Snacks & Cookies", "Chocolate Spreads")
        ]
    },
    "The Green Snack Co.": {
        "key": "greensnackco",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Puffs & Stix", "Roasted Quinoa Puffs (Peppy Cheese)"),
            ("Puffs & Stix", "Roasted Quinoa Puffs (Fiery Spice)"),
            ("Puffs & Stix", "Roasted Quinoa Puffs (Saucy Tomato)"),
            ("Puffs & Stix", "Roasted Quinoa Puffs (Sour Cream & Onion)"),
            ("Puffs & Stix", "6-Grain Stix (Achari Masala)"),
            ("Puffs & Stix", "6-Grain Stix (Tangy Salsa)"),
            ("Crisps & Makhanas", "Kale Crisps (Cheese & Onion)"),
            ("Crisps & Makhanas", "Kale Crisps (Sea Salt)"),
            ("Crisps & Makhanas", "Ghee-Roasted Makhanas"),
            ("Crisps & Makhanas", "Roasted Namkeen Mixes (Supergrain Mix)")
        ]
    },
    "Let's Try": {
        "key": "letstry",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("100% Groundnut Oil Chips", "Classic Salted"),
            ("100% Groundnut Oil Chips", "Cream & Onion"),
            ("100% Groundnut Oil Chips", "Peri Peri"),
            ("100% Groundnut Oil Chips", "Pudina"),
            ("100% Groundnut Oil Chips", "Banana Chips"),
            ("100% Groundnut Oil Chips", "Tapioca Chips"),
            ("Puffs & Extruded", "Ragi Puffs"),
            ("Puffs & Extruded", "Jowar Puffs"),
            ("Puffs & Extruded", "Corn Rings"),
            ("Puffs & Extruded", "Soya Sticks"),
            ("Namkeen & Vrat Snacks", "Garlic Bhujia"),
            ("Namkeen & Vrat Snacks", "Moong Dal"),
            ("Namkeen & Vrat Snacks", "Sabudana Chivda"),
            ("Namkeen & Vrat Snacks", "Farali Mixture"),
            ("Namkeen & Vrat Snacks", "Roasted Makhana")
        ]
    },
    "Snaqary": {
        "key": "snaqary",
        "category": "Baked Chips, Makhana & Unjunked Indian Snacks",
        "items": [
            ("Roasted Millet & Grain", "Jowar Cheese Balls"),
            ("Roasted Millet & Grain", "Jowar Puffs (Peri Peri)"),
            ("Roasted Millet & Grain", "Jowar Puffs (Tangy Tomato)"),
            ("Roasted Millet & Grain", "Jowar Puffs (Cream & Onion)"),
            ("Roasted Millet & Grain", "Multigrain Sticks"),
            ("Roasted Millet & Grain", "Roasted Khakhra"),
            ("Roasted Millet & Grain", "Millet Bhel"),
            ("Roasted Millet & Grain", "Roasted Chana & Peanuts")
        ]
    },

    # 5. Artisanal Banana Chips, Nachos, Nuts & Desi Treats
    "Beyond Snack": {
        "key": "beyondsnack",
        "category": "Snacks & Spreads",
        "items": [
            ("Kerala Banana Chips", "Original Style (Salted)"),
            ("Kerala Banana Chips", "Peri Peri"),
            ("Kerala Banana Chips", "Sour Cream Onion & Parsley"),
            ("Kerala Banana Chips", "Desi Masala"),
            ("Kerala Banana Chips", "Hot & Sweet Chilli"),
            ("Special Editions", "Coconut Oil & Rock Salt"),
            ("Special Editions", "Vibe (Extra Long Banana Chips)"),
            ("Special Editions", "Zero (Zero Palm Oil / Minimalist line)")
        ]
    },
    "Noice": {
        "key": "noice",
        "category": "Snacks & Spreads",
        "items": [
            ("Regional Chips & Crisps", "Kerala Nendran Banana Chips (Salted)"),
            ("Regional Chips & Crisps", "Kerala Nendran Banana Chips (Black Pepper)"),
            ("Regional Chips & Crisps", "Kerala Nendran Banana Chips (Peri Peri)"),
            ("Regional Chips & Crisps", "Spicy Tapioca Chips"),
            ("Regional Chips & Crisps", "Potato Wafers (Salted)"),
            ("Regional Chips & Crisps", "Potato Wafers (Masala)"),
            ("Farsan & Bakery", "Methi Khakhra"),
            ("Farsan & Bakery", "Masala Khakhra"),
            ("Farsan & Bakery", "Soya Sticks"),
            ("Farsan & Bakery", "Bhakarwadi"),
            ("Farsan & Bakery", "Gourmet Popcorn")
        ]
    },
    "Cornitos": {
        "key": "cornitos",
        "category": "Snacks & Spreads",
        "items": [
            ("Nacho Crisps", "Nacho Cheese"),
            ("Nacho Crisps", "Jalapeno"),
            ("Nacho Crisps", "Peri Peri"),
            ("Nacho Crisps", "Thai Sweet Chilli"),
            ("Nacho Crisps", "Sizzlin' Jalapeno"),
            ("Nacho Crisps", "Sea Salt"),
            ("Nacho Crisps", "Tomato Mexicana"),
            ("Nacho Crisps", "Tikka Masala"),
            ("Nacho Crisps", "Melted Cheese"),
            ("Mexican Range", "Taco Shells"),
            ("Mexican Range", "Tortilla Wraps"),
            ("Mexican Range", "Chunky Salsa Dip (Mild)"),
            ("Mexican Range", "Chunky Salsa Dip (Medium)"),
            ("Mexican Range", "Chunky Salsa Dip (Hot)"),
            ("Mexican Range", "Cheesy Jalapeno Dip"),
            ("Mexican Range", "Sliced Jalapenos"),
            ("Other Snacks", "Crusties (Baked Bean & Chickpea Puffs)"),
            ("Other Snacks", "Roasted Cashews"),
            ("Other Snacks", "Roasted Almonds"),
            ("Other Snacks", "Roasted Peanuts"),
            ("Other Snacks", "Pumpkin & Sunflower Seeds")
        ]
    },
    "Makino": {
        "key": "makino",
        "category": "Snacks & Spreads",
        "items": [
            ("Nachos", "Nacho Cheese"),
            ("Nachos", "Sweet Chili"),
            ("Nachos", "Jalapeno"),
            ("Nachos", "Peri Peri"),
            ("Nachos", "Roasted Masala"),
            ("Nachos", "Twistables (Corn Twists)"),
            ("Nuts & Seeds", "Coated Peanuts (Masala)"),
            ("Nuts & Seeds", "Coated Peanuts (Schezwan)"),
            ("Nuts & Seeds", "Coated Peanuts (Hing Jeera)"),
            ("Nuts & Seeds", "Coated Peanuts (Barbeque)"),
            ("Nuts & Seeds", "Roasted Almonds"),
            ("Nuts & Seeds", "Roasted Cashews"),
            ("Nuts & Seeds", "Trail Mixes")
        ]
    },
    "Farmley": {
        "key": "farmley",
        "category": "Dry Fruits, Nuts, Seeds & Trail Mixes",
        "items": [
            ("Roasted Makhanas", "Peri Peri"),
            ("Roasted Makhanas", "Cream & Onion"),
            ("Roasted Makhanas", "Pudina"),
            ("Roasted Makhanas", "Himalayan Salt & Pepper"),
            ("Roasted Makhanas", "Tangy Tomato"),
            ("Nuts, Seeds & Trail Mixes", "Roasted & Flavoured Almonds"),
            ("Nuts, Seeds & Trail Mixes", "Roasted & Flavoured Cashews"),
            ("Nuts, Seeds & Trail Mixes", "Roasted & Flavoured Pistachios"),
            ("Nuts, Seeds & Trail Mixes", "Trail Mixes"),
            ("Nuts, Seeds & Trail Mixes", "Seed Mixes"),
            ("Nuts, Seeds & Trail Mixes", "Party Mixes"),
            ("Healthy Sweets & Bars", "Date Bites (Chocolate)"),
            ("Healthy Sweets & Bars", "Date Bites (Rose)"),
            ("Healthy Sweets & Bars", "Date Bites (Dry Fruit)"),
            ("Healthy Sweets & Bars", "Fig Bites"),
            ("Healthy Sweets & Bars", "Millet Bars"),
            ("Healthy Sweets & Bars", "Paan Raisins")
        ]
    },
    "GO DESi": {
        "key": "godesi",
        "category": "Chocolates & Sweets",
        "items": [
            ("Desi Popz (Lollipops)", "Tangy Tamarind (Imli)"),
            ("Desi Popz (Lollipops)", "Kaccha Aam (Raw Mango)"),
            ("Desi Popz (Lollipops)", "Real Mango"),
            ("Desi Popz (Lollipops)", "Kala Khatta"),
            ("Desi Popz (Lollipops)", "Guava Chilli"),
            ("Desi Popz (Lollipops)", "Watermelon"),
            ("Desi Mints & Bars", "Meetha Paan"),
            ("Desi Mints & Bars", "Hing Jeera"),
            ("Desi Mints & Bars", "Aam Papad Bars"),
            ("Desi Mints & Bars", "Jackfruit Bars"),
            ("Desi Mints & Bars", "Berry Bars"),
            ("Traditional Snacks", "Jaggery Chikki (Peanut)"),
            ("Traditional Snacks", "Jaggery Chikki (Sesame)"),
            ("Traditional Snacks", "Jaggery Chikki (Dry Fruit)"),
            ("Traditional Snacks", "Banana Chips"),
            ("Traditional Snacks", "Murukku"),
            ("Traditional Snacks", "Mixture")
        ]
    }
}

audit_summary = {}

for b_name, b_info in CATALOGUE.items():
    key = b_info["key"]
    existing = existing_by_brand.get(key, [])
    
    available = []
    missing = []
    
    for sub_brand, variant in b_info["items"]:
        # Match against existing items
        var_norm = variant.lower().replace("(", "").replace(")", "").replace("'", "").replace("&", "").strip()
        matched = None
        
        for p in existing:
            p_name = p["name"].lower().replace("'", "").replace("&", "")
            
            # Specific clean matching
            tokens = [t for t in var_norm.split() if len(t) > 2 and t not in ["style", "chips", "potato", "puffs", "flavour", "flavoured"]]
            if all(t in p_name for t in tokens):
                matched = p
                break
        
        if matched:
            available.append({
                "subBrand": sub_brand,
                "variant": variant,
                "matchedName": matched["name"],
                "barcode": matched["barcode"],
                "score": matched["score"]
            })
        else:
            missing.append({
                "subBrand": sub_brand,
                "variant": variant
            })
            
    audit_summary[b_name] = {
        "total": len(b_info["items"]),
        "available_count": len(available),
        "missing_count": len(missing),
        "available": available,
        "missing": missing
    }

print("\n=== AUDIT RESULTS FOR 30 CHIPS & SNACKS BRANDS ===")
total_all = 0
avail_all = 0
missing_all = 0

for b_name, data in audit_summary.items():
    tot = data["total"]
    av = data["available_count"]
    mi = data["missing_count"]
    total_all += tot
    avail_all += av
    missing_all += mi
    print(f"{b_name:25} | Total: {tot:2} | Avail: {av:2} | Missing: {mi:2} | ({av/tot*100:.1f}%)")

print("--------------------------------------------------------------------------------")
print(f"GRAND TOTAL: {total_all} SKUs | AVAILABLE: {avail_all} | TO BE ADDED: {missing_all}")

with open("/tmp/audit_summary_30_brands.json", "w") as out:
    json.dump(audit_summary, out, indent=2)
