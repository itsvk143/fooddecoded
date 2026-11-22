import { SEED_PRODUCTS } from "../src/lib/seed-data";
import { ProductItem } from "@/types";

interface BrandAuditSpec {
  brandNumber: number;
  brandName: string;
  brandAliases: string[];
  lines: {
    lineName: string;
    items: string[];
  }[];
}

const AUDIT_SPECS: BrandAuditSpec[] = [
  {
    brandNumber: 1,
    brandName: "Haldiram's",
    brandAliases: ["Haldiram", "Haldiram's", "Haldirams"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Aloo Bhujia", "Bikaneri Bhujia", "Plain Bhujia", "Bhujia Sev", "Ratlami Sev",
          "Nylon Sev", "Laung Sev", "Tikha Sev", "Barik Sev", "Bhavnagri Gathiya",
          "Papdi Gathiya", "Chana Jor Garam"
        ]
      },
      {
        lineName: "Mixtures",
        items: [
          "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Kashmiri Mixture", "Panchrattan",
          "Madras Mixture", "Cornflakes Mixture", "Bhel Puri", "Diet Chiwda", "Badam Laccha",
          "Shahi Mixture", "Falahari Chiwda"
        ]
      },
      {
        lineName: "Dals & Nuts",
        items: [
          "Moong Dal", "Chana Dal", "Masoor Dal", "Classic Salted Peanuts", "Masala Peanuts (Nut Cracker)",
          "Nimbu Masala Peanuts", "Hara Matar", "Kabuli Chana", "Roasted Chana", "Salted Cashews", "Pepper Cashews"
        ]
      },
      {
        lineName: "Extruded & Puffed (Takatak / Whoopies)",
        items: [
          "Masala Balls", "Pudina Treat", "Tangy Tomato Sticks", "Chatpata Masala Sticks", "Cheese Balls",
          "Boondi Plain", "Boondi Masala", "Boondi Pudina"
        ]
      },
      {
        lineName: "South Indian & Western",
        items: [
          "Murukku", "Chakli", "Banana Chips Salted", "Banana Chips Black Pepper", "Banana Chips Masala",
          "Tapioca Chips", "Potato Chips Classic Salted", "Potato Chips Cream & Onion", "Potato Chips Pudina", "Potato Chips Spicy Treat",
          "Soya Sticks", "Soya Katori", "Gol Kachori", "Mini Samosa", "Mini Bhakarwadi",
          "Khakhra Methi", "Khakhra Masala", "Khakhra Jeera"
        ]
      }
    ]
  },
  {
    brandNumber: 2,
    brandName: "Bikaji",
    brandAliases: ["Bikaji"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Bikaneri Bhujia", "Tana-Tan Aloo Bhujia", "Baarish Bhujia", "Ratlami Sev",
          "Nylon Sev", "Lahsun Sev", "Masala Sev", "Gathiya", "Papdi"
        ]
      },
      {
        lineName: "Mixtures",
        items: [
          "Kuch-Kuch (All-in-One)", "Subh-Kuch (Navrattan)", "Sab Kuch", "Khatta Meetha",
          "Cornflakes Mix", "Marwari Mix", "Bhel Puri", "Falahari Mix", "Diet Mixture"
        ]
      },
      {
        lineName: "Dals & Nuts",
        items: [
          "Moong Dal", "Chana Dal", "Masala Peanuts (Masti Nuts)", "Salted Peanuts",
          "Kabuli Chana", "Roasted Chana", "Hara Matar"
        ]
      },
      {
        lineName: "Regional & Fusion",
        items: [
          "Mini Samosa", "Mini Kachori", "Boondi Masala", "Boondi Plain", "Soya Sticks",
          "Makai (Corn) Chiwda", "Potato Chips", "Fun-In Puffs"
        ]
      }
    ]
  },
  {
    brandNumber: 3,
    brandName: "Bikanervala / Bikano",
    brandAliases: ["Bikano", "Bikanervala"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Ratlami Sev", "Gathiya", "Chana Jor Garam"
        ]
      },
      {
        lineName: "Mixtures",
        items: [
          "Navrattan Mixture", "Khatta Meetha", "All-in-One", "Shahi Mixture", "Kashmiri Mixture",
          "Bhel Puri", "Cornflakes Mixture", "Diet Mixture", "Badam Laccha"
        ]
      },
      {
        lineName: "Dals & Nuts",
        items: [
          "Moong Dal", "Chana Dal", "Tasty (Masala Peanuts)", "Salted Peanuts", "Hara Matar",
          "Kabuli Chana", "Roasted Peanuts"
        ]
      },
      {
        lineName: "Traditional Bites & Chips",
        items: [
          "Mini Samosa", "Dry Kachori", "Bhakarwadi", "Methi Mathri", "Shakkarpara",
          "Namakpara", "Boondi", "Soya Sticks", "Banana Chips", "Potato Chips", "Kurkure-style Tedhe Medhe"
        ]
      }
    ]
  },
  {
    brandNumber: 4,
    brandName: "Prabhuji (Haldiram Prabhuji - Kolkata)",
    brandAliases: ["Prabhuji", "Haldiram Prabhuji"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Bikaneri Bhujia", "Aloo Bhujia", "Plain Bhujia", "Tok Jhal Mishti (Sweet & Sour Bhujia)",
          "Chanachur", "Jhal Chanachur", "Special Chanachur"
        ]
      },
      {
        lineName: "Mixtures",
        items: [
          "Khatta Meetha", "Navrattan", "All-in-One", "Cornflakes Mixture", "Badam Lachha",
          "Panchratan", "Bhel Puri", "Falahari Mixture"
        ]
      },
      {
        lineName: "Dals & Nuts",
        items: [
          "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts", "Hara Matar", "Kabuli Chana", "Kaju Masala"
        ]
      },
      {
        lineName: "Traditional & Savories",
        items: [
          "Mini Samosa", "Kachori", "Bhakarwadi", "Boondi", "Papad", "Soya Sticks", "Potato Chips"
        ]
      }
    ]
  },
  {
    brandNumber: 5,
    brandName: "Balaji Wafers",
    brandAliases: ["Balaji Wafers", "Balaji"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Aloo Sev", "Tikha Sev", "Nylon Sev", "Ratlami Sev", "Bhavnagri Gathiya",
          "Vanela Gathiya", "Tikha Gathiya", "Papdi Gathiya", "Chana Jor Garam"
        ]
      },
      {
        lineName: "Mixtures & Chiwda",
        items: [
          "Farali Chiwda Sweet", "Farali Chiwda Tikha", "Khatta Meetha", "Tikha Mitha Mix",
          "Chanachur", "Bhel Mix", "Tam-Tam", "Mung Dal", "Chana Dal", "Sing Bhujia (Masala Peanuts)", "Salted Peanuts"
        ]
      },
      {
        lineName: "Wafers & Chips",
        items: [
          "Simply Salted", "Masala Masti", "Cream & Onion", "Tomato Twist", "Chaat Chaska",
          "Peri-Peri", "Kettle Chips", "Banana Wafers Salted", "Banana Wafers Mari/Pepper"
        ]
      },
      {
        lineName: "Extruded & Puffed",
        items: [
          "Crunchex", "Chataka Pataka Masala", "Chataka Pataka Chinese", "Chataka Pataka Tomato",
          "Wheels", "Scoops", "Funne", "Gippies", "Nachos"
        ]
      }
    ]
  },
  {
    brandNumber: 6,
    brandName: "Gopal Snacks",
    brandAliases: ["Gopal", "Gopal Snacks"],
    lines: [
      {
        lineName: "Gathiya & Sev",
        items: [
          "Bhavnagri Gathiya", "Vanela Gathiya", "Champakali Gathiya", "Papdi Gathiya",
          "Tikha Gathiya", "Nylon Sev", "Aloo Sev", "Ratlami Sev", "Lasaniya (Garlic) Sev"
        ]
      },
      {
        lineName: "Mixtures & Chiwda",
        items: [
          "Rajwadi Mix", "Khatta Meetha", "Tikha Mitha Mix", "Farali Chiwda", "Bhel Mix",
          "Dalmoth", "Navratan Mix", "Cornflakes Mix"
        ]
      },
      {
        lineName: "Dals & Nuts",
        items: [
          "Moong Dal", "Chana Dal", "Sing Bhujia", "Salted Peanuts", "Masala Chana", "Hara Matar"
        ]
      },
      {
        lineName: "Wafers & Pellets",
        items: [
          "Potato Wafers Salted", "Potato Wafers Masala", "Potato Wafers Cream & Onion", "Potato Wafers Tomato",
          "Banana Wafers", "Fryums Wheels", "Fryums Pasta", "Fryums Noodles", "Fryums Katori", "Fryums Pipes",
          "Khakhra", "Bhakarwadi"
        ]
      }
    ]
  },
  {
    brandNumber: 7,
    brandName: "Chitale Bandhu Mithaiwale",
    brandAliases: ["Chitale Bandhu", "Chitale Bandhu Mithaiwale", "Chitale"],
    lines: [
      {
        lineName: "Flagship Specialties",
        items: [
          "Chitale Bakarwadi Regular", "Chitale Bakarwadi Mini", "Chitale Bakarwadi Garlic",
          "Chitale Bakarwadi Jain", "Chitale Bakarwadi Masala",
          "Laxminarayan Chiwda Potato", "Laxminarayan Chiwda Cornflakes", "Laxminarayan Chiwda Poha",
          "Makai Chiwda", "Poha Chiwda", "Sabudana Chiwda (Upvas/Fasting)"
        ]
      },
      {
        lineName: "Sev & Gathiya",
        items: [
          "Tikhat Sev", "Plain Sev", "Bhavnagri Gathiya", "Lasun Sev", "Shev Chiwda"
        ]
      },
      {
        lineName: "Traditional Maharashtrian Snacks",
        items: [
          "Bhajani Chakli", "Butter Chakli", "Shankarpali Sweet", "Shankarpali Salty",
          "Kadboli", "Chirote", "Karanji", "Potato Wafers", "Banana Wafers"
        ]
      }
    ]
  },
  {
    brandNumber: 8,
    brandName: "Chheda's",
    brandAliases: ["Chheda's", "Chhedas", "Chheda"],
    lines: [
      {
        lineName: "Chips & Wafers",
        items: [
          "Yellow Banana Chips Salted", "Yellow Banana Chips Black Pepper", "Yellow Banana Chips Tomato",
          "Yellow Banana Chips Pudina", "Yellow Banana Chips Peri-Peri",
          "Kerala Banana Chips Coconut Oil", "Tapioca Chips", "Jackfruit Chips", "Potato Chips", "Sweet Potato Chips"
        ]
      },
      {
        lineName: "Farsan & Mixtures",
        items: [
          "Mini Bhakarwadi", "Methi Khakhra", "Masala Khakhra", "Jeera Khakhra",
          "Bhel Puri", "Sev Puri", "Dry Kachori", "Dry Samosa", "Masala Boondi", "Murukku", "Chakli"
        ]
      },
      {
        lineName: "Chiwda & Sev",
        items: [
          "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Nylon Sev",
          "Tikha Gathiya", "Aloo Bhujia", "Moong Dal", "Masala Peanuts"
        ]
      }
    ]
  },
  {
    brandNumber: 9,
    brandName: "Garden (CavinKare)",
    brandAliases: ["Garden", "Garden (CavinKare)", "CavinKare Garden"],
    lines: [
      {
        lineName: "Mixtures & Chiwda",
        items: [
          "Mumbai Mixture", "Khatta Meetha", "Bhel Puri", "Navrattan",
          "Diet Poha Chiwda", "Cornflakes Chiwda", "Sabudana Chiwda", "Golden Mixture"
        ]
      },
      {
        lineName: "Sev & Farsan",
        items: [
          "Aloo Bhujia", "Bikaneri Bhujia", "Nylon Sev", "Tikha Gathiya", "Bhavnagri Gathiya",
          "Mini Bhakarwadi", "Dry Samosa", "Dry Kachori", "Chakli", "Masala Boondi"
        ]
      },
      {
        lineName: "Chips & Dals",
        items: [
          "Banana Chips Salted", "Banana Chips Mari", "Banana Chips Spicy", "Potato Chips",
          "Moong Dal", "Chana Dal", "Masala Peanuts", "Salted Peanuts"
        ]
      }
    ]
  },
  {
    brandNumber: 10,
    brandName: "Adukale",
    brandAliases: ["Adukale"],
    lines: [
      {
        lineName: "Traditional Savories",
        items: [
          "Kodubale (Ring Murukku)", "Benne/Butter Chakli", "Rice Chakli",
          "Nippattu Plain", "Nippattu Masala", "Nippattu Onion",
          "Congress Kadlekai (Spicy Peanuts)", "Bombay Mixture", "Khara Mixture", "Avalakki/Poha Mixture"
        ]
      },
      {
        lineName: "Chips & Fryums",
        items: [
          "Jackfruit Chips", "Banana Chips", "Potato Chips", "Sabudana Papad", "Sandige (Rice Fryums)"
        ]
      },
      {
        lineName: "Sev & Boondi",
        items: [
          "Khara Boondi", "Ompudi (Fine Sev)", "Karasev", "Hurigalu (Roasted Gram Mix)"
        ]
      }
    ]
  },
  {
    brandNumber: 11,
    brandName: "Bansiram",
    brandAliases: ["Bansiram"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Bikaneri Bhujia", "Aloo Bhujia", "Plain Sev", "Lahsun Sev", "Ratlami Sev", "Mota Sev", "Gathiya"
        ]
      },
      {
        lineName: "Mixtures & Chiwda",
        items: [
          "Navrattan Mixture", "Khatta Meetha", "Shahi Mixture", "Panchrattan",
          "Badam Lachha", "Poha Chiwda", "Cornflakes Mixture", "Falahari Mixture"
        ]
      },
      {
        lineName: "Traditional Bites",
        items: [
          "Dry Samosa", "Dry Kachori", "Methi Mathri", "Namakpara",
          "Boondi", "Moong Dal", "Chana Dal", "Masala Peanuts", "Roasted Chana"
        ]
      }
    ]
  },
  {
    brandNumber: 12,
    brandName: "MTR",
    brandAliases: ["MTR"],
    lines: [
      {
        lineName: "Traditional Mixtures",
        items: [
          "Madras Mixture", "Bombay Mixture", "Khatta Meetha", "Cornflakes Mixture", "Poha Mixture", "Boondi Mixture"
        ]
      },
      {
        lineName: "South Indian Savories",
        items: [
          "Murukku", "Chakli", "Kodubale", "Nippattu", "Masala Peanuts (Congress Peanuts)", "Khara Boondi", "Ompudi"
        ]
      },
      {
        lineName: "Chips & Dals",
        items: [
          "Banana Chips", "Moong Dal", "Chana Dal", "Aloo Bhujia", "Bikaneri Bhujia"
        ]
      }
    ]
  },
  {
    brandNumber: 13,
    brandName: "Gits",
    brandAliases: ["Gits"],
    lines: [
      {
        lineName: "Ready-to-Eat Savories",
        items: [
          "Bhakarwadi", "Khakhra Methi", "Khakhra Masala", "Khakhra Jeera", "Khakhra Plain",
          "Bhel Puri (Ready-to-mix kit)", "Pani Puri (Ready-to-mix kit)", "Sev Puri", "Masala Peanuts"
        ]
      }
    ]
  },
  {
    brandNumber: 14,
    brandName: "Bikaner Sweets",
    brandAliases: ["Bikaner Sweets", "Bikaner Sweet"],
    lines: [
      {
        lineName: "Bhujia & Sev",
        items: [
          "Bikaneri Bhujia", "Aloo Bhujia", "Mota Sev", "Ratlami Sev", "Lahsun Sev", "Papdi Gathiya", "Bhavnagri Gathiya"
        ]
      },
      {
        lineName: "Mixtures",
        items: [
          "Navratan Mixture", "Khatta Meetha", "Dalmoth", "Shahi Mixture", "Cornflakes Chiwda", "Falahari Chiwda"
        ]
      },
      {
        lineName: "Counter Savories",
        items: [
          "Methi Mathri", "Tikoni Mathri", "Achari Mathri", "Masala Matthi",
          "Dry Samosa", "Dry Kachori", "Mini Bhakarwadi", "Namakpara", "Shakkarpara",
          "Moong Dal", "Masala Kaju", "Masala Peanuts"
        ]
      }
    ]
  }
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Find brand products first
console.log("=== FOODDECODED NAMKEEN CATALOG AUDIT (14 BRANDS) ===");
console.log(`Database snapshot contains ${SEED_PRODUCTS.length} products.`);

for (const spec of AUDIT_SPECS) {
  const brandProducts = SEED_PRODUCTS.filter(p => {
    return spec.brandAliases.some(alias => {
      const pBrand = p.brand.toLowerCase();
      const a = alias.toLowerCase();
      return pBrand === a || pBrand.startsWith(a + " ") || pBrand.includes(a);
    });
  });

  console.log(`\n======================================================`);
  console.log(`BRAND ${spec.brandNumber}: ${spec.brandName} (Found ${brandProducts.length} total brand items in DB)`);
  console.log(`======================================================`);

  let totalBrandItems = 0;
  let availableBrandItems = 0;

  for (const line of spec.lines) {
    console.log(`\n-- Subcategory / Line: ${line.lineName} --`);
    for (const item of line.items) {
      totalBrandItems++;
      const itemNorm = normalize(item);
      
      // Keywords for searching
      // e.g. "aloo bhujia" -> tokens ["aloo", "bhujia"]
      const cleanTokens = item.toLowerCase()
        .replace(/[(),/&]/g, " ")
        .split(/\s+/)
        .filter(t => t.length > 2 && !["plain", "mix", "chips", "wafers"].includes(t));

      // Attempt match in brandProducts
      let match: ProductItem | undefined = undefined;

      // 1. Direct includes
      match = brandProducts.find(p => {
        const pNorm = normalize(p.name);
        if (pNorm.includes(itemNorm)) return true;
        // check specific token combinations
        return cleanTokens.length > 0 && cleanTokens.every(tok => pNorm.includes(tok));
      });

      // Special handling for specific item names like "Moong Dal", "Chana Dal"
      if (!match && item.includes("Dal")) {
        match = brandProducts.find(p => {
          const pName = p.name.toLowerCase();
          if (item.toLowerCase().includes("moong dal") && pName.includes("moong dal")) return true;
          if (item.toLowerCase().includes("chana dal") && pName.includes("chana dal")) return true;
          if (item.toLowerCase().includes("masoor dal") && pName.includes("masoor dal")) return true;
          return false;
        });
      }

      // Special handling for Bhujia / Sev
      if (!match && item.includes("Bhujia")) {
        match = brandProducts.find(p => {
          const pName = p.name.toLowerCase();
          if (item.toLowerCase().includes("aloo bhujia") && pName.includes("aloo bhujia")) return true;
          if (item.toLowerCase().includes("bikaneri bhujia") && (pName.includes("bikaneri bhujia") || pName.includes("bhujia"))) return true;
          return false;
        });
      }

      if (match) {
        availableBrandItems++;
        console.log(`  [AVAILABLE] ${item} -> Found: "${match.name}" (Barcode: ${match.barcode}, Category: ${match.category} > ${match.subCategory}, Score: ${(match as any).healthScore ?? match.overallScore}/100)`);
      } else {
        console.log(`  [NOT AVAILABLE] ${item}`);
      }
    }
  }

  console.log(`\nSummary for ${spec.brandName}: ${availableBrandItems}/${totalBrandItems} available (${((availableBrandItems/totalBrandItems)*100).toFixed(1)}%)`);
}
