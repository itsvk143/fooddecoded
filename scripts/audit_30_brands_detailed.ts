import fs from "fs";
import { SEED_PRODUCTS } from "../src/lib/seed-data";
import { ProductItem } from "@/types";

interface ItemSpec {
  brand: string;
  subBrand?: string;
  name: string;
  fullName: string;
  category: string;
  subCategory: string;
}

// Let's create an exact parser of the user prompt items
const PROMPT_ITEMS: ItemSpec[] = [
  // 1. Lay's
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "India's Magic Masala", fullName: "Lay's India's Magic Masala Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "Classic Salted", fullName: "Lay's Classic Salted Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "American Style Cream & Onion", fullName: "Lay's American Style Cream & Onion Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "Spanish Tomato Tango", fullName: "Lay's Spanish Tomato Tango Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "Chile Limon", fullName: "Lay's Chile Limon Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "West Indies Hot 'n' Sweet Chilli", fullName: "Lay's West Indies Hot 'n' Sweet Chilli Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Classic Potato Chips", name: "Sizzlin' Hot", fullName: "Lay's Sizzlin' Hot Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Maxx (Ridged)", name: "Macho Chilli", fullName: "Lay's Maxx Macho Chilli Ridged Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Maxx (Ridged)", name: "Sizzling Barbeque", fullName: "Lay's Maxx Sizzling Barbeque Ridged Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Maxx (Ridged)", name: "Pepper Barbeque", fullName: "Lay's Maxx Pepper Barbeque Ridged Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Gourmet (Kettle Cooked)", name: "Thai Sweet Chilli", fullName: "Lay's Gourmet Thai Sweet Chilli Kettle Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Gourmet (Kettle Cooked)", name: "Lime & Cracked Pepper", fullName: "Lay's Gourmet Lime & Cracked Pepper Kettle Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Gourmet (Kettle Cooked)", name: "Vintage Cheese & Paprika", fullName: "Lay's Gourmet Vintage Cheese & Paprika Kettle Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Crisp", name: "Herb & Onion", fullName: "Lay's Crisp Herb & Onion Canister Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Lay's", subBrand: "Lay's Crisp", name: "Classic Salted", fullName: "Lay's Crisp Classic Salted Canister Chips", category: "Snacks & Spreads", subCategory: "Chips" },

  // 2. Kurkure
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Masala Munch", fullName: "Kurkure Masala Munch Crispy Puffs", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Green Chutney Rajasthani Style", fullName: "Kurkure Green Chutney Rajasthani Style", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Chilli Chatka", fullName: "Kurkure Chilli Chatka", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Naughty Tomato", fullName: "Kurkure Naughty Tomato", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Hyderabadi Hungama", fullName: "Kurkure Hyderabadi Hungama", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Schezwan Chutney", fullName: "Kurkure Schezwan Chutney", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Extruded Sticks", name: "Sizzlin' Hot", fullName: "Kurkure Sizzlin' Hot", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Solid Masti", name: "Twisteez (Masala)", fullName: "Kurkure Solid Masti Twisteez Masala", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Playz", name: "Puffcorn (Yummy Cheese)", fullName: "Kurkure Playz Puffcorn Yummy Cheese", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Playz", name: "Pastax (Masala)", fullName: "Kurkure Playz Pastax Masala", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Kurkure", subBrand: "Multigrain", name: "Lite & Crunchy (Masala)", fullName: "Kurkure Multigrain Lite & Crunchy Masala", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },

  // 3. Bingo!
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Achaari Masti", fullName: "Bingo! Mad Angles Achaari Masti", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Tomato Madness", fullName: "Bingo! Mad Angles Tomato Madness", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Masala Madness", fullName: "Bingo! Mad Angles Masala Madness", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Very Peri Peri", fullName: "Bingo! Mad Angles Very Peri Peri", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Pizza Aah", fullName: "Bingo! Mad Angles Pizza Aah", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Cheese Nachos", fullName: "Bingo! Mad Angles Cheese Nachos", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Mad Angles", name: "Chaat Masti", fullName: "Bingo! Mad Angles Chaat Masti", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Tedhe Medhe", name: "Masala Tadka", fullName: "Bingo! Tedhe Medhe Masala Tadka", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Bingo!", subBrand: "Tedhe Medhe", name: "Achaari Masti", fullName: "Bingo! Tedhe Medhe Achaari Masti", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Bingo!", subBrand: "Tedhe Medhe", name: "Chatpata Twist", fullName: "Bingo! Tedhe Medhe Chatpata Twist", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Bingo!", subBrand: "Tedhe Medhe", name: "Xtra Teekha", fullName: "Bingo! Tedhe Medhe Xtra Teekha", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Bingo!", subBrand: "Original Style", name: "Chilli Sprinkled", fullName: "Bingo! Original Style Chilli Sprinkled Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Original Style", name: "Salt Sprinkled", fullName: "Bingo! Original Style Salt Sprinkled Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Original Style", name: "Cream & Onion", fullName: "Bingo! Original Style Cream & Onion Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Original Style", name: "Chatkila Nimbu", fullName: "Bingo! Original Style Chatkila Nimbu Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Original Style", name: "Tandoori Masala", fullName: "Bingo! Original Style Tandoori Masala Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Hashtags", name: "Cream & Onion", fullName: "Bingo! Hashtags Cream & Onion Ridged Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Hashtags", name: "Spicy Masala", fullName: "Bingo! Hashtags Spicy Masala Ridged Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Street Bites", name: "Dahi Chaat", fullName: "Bingo! Street Bites Dahi Chaat", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Bingo!", subBrand: "Street Bites", name: "Pani Puri Twist", fullName: "Bingo! Street Bites Pani Puri Twist", category: "Snacks & Spreads", subCategory: "Chips" },

  // 4. Pringles
  { brand: "Pringles", subBrand: "Core Canisters", name: "Original", fullName: "Pringles Original Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Sour Cream & Onion", fullName: "Pringles Sour Cream & Onion Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Pizza", fullName: "Pringles Pizza Flavoured Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Peri Peri", fullName: "Pringles Peri Peri Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Desi Masala Tadka", fullName: "Pringles Desi Masala Tadka Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Schezwan Chutney", fullName: "Pringles Schezwan Chutney Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Cheesy Cheese", fullName: "Pringles Cheesy Cheese Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Core Canisters", name: "Salt & Seaweed", fullName: "Pringles Salt & Seaweed Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Scorchin' Line", name: "Scorchin' BBQ", fullName: "Pringles Scorchin' BBQ Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Scorchin' Line", name: "Scorchin' Chili & Lime", fullName: "Pringles Scorchin' Chili & Lime Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Fusion / Limited", name: "Mexican Street Corn", fullName: "Pringles Mexican Street Corn Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Pringles", subBrand: "Fusion / Limited", name: "Jalapeno", fullName: "Pringles Jalapeno Potato Crisps", category: "Snacks & Spreads", subCategory: "Chips" },

  // 5. Doritos
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Nacho Cheese", fullName: "Doritos Nacho Cheese Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Sweet Chilli", fullName: "Doritos Sweet Chilli Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Masala Mayhem", fullName: "Doritos Masala Mayhem Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Sizzlin' Hot", fullName: "Doritos Sizzlin' Hot Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Cool Ranch", fullName: "Doritos Cool Ranch Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Tortilla Chips", name: "Flamin' Hot Nacho", fullName: "Doritos Flamin' Hot Nacho Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Dinamita", name: "Fiery Lime & Chilli", fullName: "Doritos Dinamita Fiery Lime & Chilli Rolled Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Doritos", subBrand: "Dinamita", name: "Sizzlin' Hot", fullName: "Doritos Dinamita Sizzlin' Hot Rolled Tortilla Chips", category: "Snacks & Spreads", subCategory: "Chips" },

  // 6. Cheetos
  { brand: "Cheetos", subBrand: "Puffs & Balls", name: "Masala Balls", fullName: "Cheetos Masala Balls Puffed Corn Snacks", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Puffs & Balls", name: "Cheese Puffs", fullName: "Cheetos Cheese Puffs Corn Snacks", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Puffs & Balls", name: "Whoosh (Masala)", fullName: "Cheetos Whoosh Masala Swirls", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Puffs & Balls", name: "Whoosh (Cheese)", fullName: "Cheetos Whoosh Cheese Swirls", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Puffs & Balls", name: "X&O (Masala)", fullName: "Cheetos X&O Masala Corn Puffs", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Crunchy", name: "Crunchy Cheese", fullName: "Cheetos Crunchy Cheese Flavoured Corn Snacks", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },
  { brand: "Cheetos", subBrand: "Crunchy", name: "Flamin' Hot Crunchy", fullName: "Cheetos Flamin' Hot Crunchy Corn Snacks", category: "Snacks & Spreads", subCategory: "Extruded Snacks" },

  // 7. Uncle Chipps
  { brand: "Uncle Chipps", subBrand: "Ripple Potato Chips", name: "Spicy Treat (Blue pack)", fullName: "Uncle Chipps Spicy Treat Ripple Cut Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
  { brand: "Uncle Chipps", subBrand: "Ripple Potato Chips", name: "Plain Salted (Green pack)", fullName: "Uncle Chipps Plain Salted Ripple Cut Potato Chips", category: "Snacks & Spreads", subCategory: "Chips" },
];

console.log(`Loaded ${PROMPT_ITEMS.length} prompt item specifications for initial verification.`);
