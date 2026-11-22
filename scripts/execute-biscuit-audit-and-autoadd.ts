import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

import { analyzeIngredientsText } from "../src/lib/ingredient-matcher";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  calculateDataCompleteness
} from "../src/lib/scoring-engine";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");

if (!fs.existsSync(PACKSHOT_DIR)) {
  fs.mkdirSync(PACKSHOT_DIR, { recursive: true });
}

function detectImageExt(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 4) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "webp";
  return null;
}

const RETAIL_DOMAINS = [
  /bbassets\.com/i,
  /bigbasket\.com/i,
  /media-amazon\.com/i,
  /ssl-images-amazon\.com/i,
  /rukminim\d*\.flixcart\.com/i,
  /grofers\.com/i,
  /blinkit\.com/i,
  /zeptonow\.com/i,
  /jiomart\.com/i,
  /openfoodfacts\.org/i
];

async function searchBingImage(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const rawMatches = Array.from(html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&"]+)/g)).map(m => m[1]);
    const valid = rawMatches.filter(u => {
      const low = u.toLowerCase();
      return !low.endsWith(".svg") && !low.endsWith(".gif") && !low.includes("logo") && !low.includes("placeholder");
    });
    if (valid.length === 0) return null;

    for (const pat of RETAIL_DOMAINS) {
      const m = valid.find(u => pat.test(u));
      if (m) return m;
    }
    return valid[0];
  } catch {
    return null;
  }
}

async function downloadImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Accept": "image/*,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length >= 2500 ? buf : null;
  } catch {
    return null;
  }
}

// 15 Brands Reference Definition
export interface ReferenceItem {
  id?: string;
  name: string;
  parentBrand: string;
  brand: string;
  subBrand: string;
  variant: string;
  productType: string;
  category: string;
  subCategory: string;
  flavour: string;
  packageSize: string;
  netWeight: string;
  price: number;
  description: string;
  ingredientsText: string;
  nutritionPer100g: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    carbohydrates: number;
    sugars: number;
    protein: number;
    sodium: number;
    fiber: number;
    salt: number;
  };
}

export const REFERENCE_CATALOG: Record<string, ReferenceItem[]> = {
  "Oreo": [
    // Classic Sandwich Creams
    {
      name: "Oreo Original Vanilla Creme Biscuit",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Classic Sandwich Creams",
      variant: "Original Vanilla",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Vanilla",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 35,
      description: "Classic rich dark chocolate biscuit discs sandwiched with smooth vanilla cream.",
      ingredientsText: "Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Cocoa Solids (2.3%), Invert Sugar, Leavening Agents (INS 500(ii), INS 503(ii)), Edible Common Salt, Emulsifier (INS 322).",
      nutritionPer100g: { calories: 485, totalFat: 20.0, saturatedFat: 9.8, carbohydrates: 71.0, sugars: 38.0, protein: 5.2, sodium: 430, fiber: 2.5, salt: 1.07 }
    },
    {
      name: "Oreo Chocolate Creme Biscuit",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Classic Sandwich Creams",
      variant: "Chocolate Creme",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Chocolate",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 35,
      description: "Crunchy cocoa biscuits filled with smooth double-chocolate cream.",
      ingredientsText: "Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Cocoa Solids (4.1%), Invert Sugar, Leavening Agents (INS 500(ii), INS 503(ii)), Salt, Emulsifier (INS 322).",
      nutritionPer100g: { calories: 488, totalFat: 20.5, saturatedFat: 10.1, carbohydrates: 70.0, sugars: 37.5, protein: 5.5, sodium: 420, fiber: 3.0, salt: 1.05 }
    },
    {
      name: "Oreo Strawberry Creme Biscuit",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Classic Sandwich Creams",
      variant: "Strawberry Creme",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Strawberry",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 35,
      description: "Chocolate biscuit shells filled with sweet strawberry flavoured cream.",
      ingredientsText: "Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Cocoa Solids, Strawberry Fruit Powder, Invert Sugar, Leavening Agents, Emulsifier (Soy Lecithin).",
      nutritionPer100g: { calories: 482, totalFat: 19.8, saturatedFat: 9.6, carbohydrates: 71.5, sugars: 38.5, protein: 5.1, sodium: 410, fiber: 2.2, salt: 1.02 }
    },
    {
      name: "Oreo Double Stuf Vanilla Creme Sandwich Cookies",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Classic Sandwich Creams",
      variant: "Double Stuf (Vanilla)",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Vanilla",
      packageSize: "150 g",
      netWeight: "150 g",
      price: 50,
      description: "Double the quantity of signature sweet vanilla creme between two classic crunchy chocolate wafers.",
      ingredientsText: "Sugar, Refined Wheat Flour (Maida), Fractionated Palm Oil, Cocoa Solids, Invert Sugar, Salt, Emulsifier (INS 322), Leavening Agents.",
      nutritionPer100g: { calories: 495, totalFat: 22.0, saturatedFat: 11.2, carbohydrates: 70.0, sugars: 44.0, protein: 4.4, sodium: 390, fiber: 2.0, salt: 0.98 }
    },
    {
      name: "Oreo Golden Vanilla Sandwich Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Classic Sandwich Creams",
      variant: "Golden Oreo (Vanilla wafer with vanilla creme)",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Golden Vanilla",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 40,
      description: "Crispy golden vanilla wafers sandwiched with classic smooth vanilla cream.",
      ingredientsText: "Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm), Invert Sugar, Corn Starch, Salt, Leavening Agents, Natural Vanilla Flavour.",
      nutritionPer100g: { calories: 480, totalFat: 19.5, saturatedFat: 9.2, carbohydrates: 72.0, sugars: 36.0, protein: 5.0, sodium: 380, fiber: 1.8, salt: 0.95 }
    },
    // Indian & Fusion Editions
    {
      name: "Oreo Choco-Brownie Creme Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Indian & Fusion Editions",
      variant: "Choco-Brownie",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Choco-Brownie",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 40,
      description: "Rich chocolate cookie shells filled with decadent fudge brownie flavoured cream.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids (5.2%), Brownie Flavor, Invert Sugar, Salt, Emulsifier (INS 322).",
      nutritionPer100g: { calories: 490, totalFat: 21.0, saturatedFat: 10.4, carbohydrates: 69.5, sugars: 38.0, protein: 5.6, sodium: 420, fiber: 3.2, salt: 1.05 }
    },
    {
      name: "Oreo Red Velvet Creme Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Indian & Fusion Editions",
      variant: "Red Velvet",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Red Velvet & Cheese Creme",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 40,
      description: "Crimson red velvet cookies filled with cream cheese flavoured smooth creme.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Powder, Cheese Cream Flavor, Natural Food Colour (INS 129), Salt, Emulsifier.",
      nutritionPer100g: { calories: 486, totalFat: 20.2, saturatedFat: 9.9, carbohydrates: 71.0, sugars: 38.5, protein: 5.0, sodium: 400, fiber: 2.1, salt: 1.00 }
    },
    {
      name: "Oreo Mint Creme Sandwich Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Indian & Fusion Editions",
      variant: "Mint Creme",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Mint Creme",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 40,
      description: "Cool refreshing mint flavoured green cream sandwiched between dark cocoa cookies.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids, Natural Peppermint Oil, Natural Colour (INS 141(i)), Emulsifier (INS 322).",
      nutritionPer100g: { calories: 484, totalFat: 20.0, saturatedFat: 9.7, carbohydrates: 71.0, sugars: 37.0, protein: 5.2, sodium: 415, fiber: 2.4, salt: 1.03 }
    },
    {
      name: "Oreo Peanut Butter & Chocolate Creme Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Indian & Fusion Editions",
      variant: "Peanut Butter & Chocolate",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Peanut Butter & Chocolate",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 45,
      description: "Dual-flavoured cream featuring roasted peanut butter cream paired with rich chocolate cream.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Roasted Peanut Paste (12%), Cocoa Solids, Salt, Leavening Agents, Emulsifier.",
      nutritionPer100g: { calories: 505, totalFat: 24.5, saturatedFat: 10.2, carbohydrates: 64.0, sugars: 34.0, protein: 7.5, sodium: 440, fiber: 3.5, salt: 1.10 }
    },
    {
      name: "Cadbury Oreo Chocolate Coated Biscuits",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Indian & Fusion Editions",
      variant: "Cadbury Oreo (Chocolate-coated)",
      productType: "chocolate coated biscuit",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Milk Chocolate Enrobed",
      packageSize: "150 g",
      netWeight: "150 g",
      price: 60,
      description: "Original vanilla Oreo sandwich biscuit enrobed in a thick, velvety layer of Cadbury Dairy Milk chocolate.",
      ingredientsText: "Milk Chocolate Coating (Sugar, Cocoa Butter, Milk Solids, Cocoa Mass, Emulsifiers), Oreo Biscuit (Wheat Flour, Sugar, Palm Oil, Cocoa Solids).",
      nutritionPer100g: { calories: 515, totalFat: 26.0, saturatedFat: 14.5, carbohydrates: 65.0, sugars: 46.0, protein: 5.8, sodium: 320, fiber: 2.8, salt: 0.80 }
    },
    // Snacks & Formats
    {
      name: "Mini Oreos Bite Size Cookies",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Snacks & Formats",
      variant: "Mini Oreos (cups/pouches)",
      productType: "mini cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Vanilla Mini",
      packageSize: "67 g",
      netWeight: "67 g",
      price: 45,
      description: "Bite-sized mini vanilla cream sandwich cookies packed in convenient on-the-go cups and pouches.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids, Invert Sugar, Salt, Leavening Agents, Emulsifier (Soy Lecithin).",
      nutritionPer100g: { calories: 485, totalFat: 20.0, saturatedFat: 9.8, carbohydrates: 71.0, sugars: 38.0, protein: 5.2, sodium: 430, fiber: 2.5, salt: 1.07 }
    },
    {
      name: "Oreo O's Breakfast Cereal",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Snacks & Formats",
      variant: "Oreo O's (cereal)",
      productType: "cereal",
      category: "Cereals & Breakfast",
      subCategory: "Kids' Cereals",
      flavour: "Chocolate & Creme Loops",
      packageSize: "350 g",
      netWeight: "350 g",
      price: 295,
      description: "Crunchy Oreo-flavoured cocoa loops made with whole grain corn and wheat flour with vanilla marshmallow bits.",
      ingredientsText: "Whole Grain Corn Flour, Sugar, Wheat Flour, Whole Oat Flour, Cocoa Powder (processed with alkali), Canola Oil, Salt, Natural Flavor.",
      nutritionPer100g: { calories: 390, totalFat: 4.5, saturatedFat: 0.8, carbohydrates: 82.0, sugars: 32.0, protein: 6.0, sodium: 380, fiber: 4.5, salt: 0.95 }
    },
    {
      name: "Oreo Wafer Rolls Vanilla",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Snacks & Formats",
      variant: "Oreo Wafer Rolls (Vanilla)",
      productType: "wafer roll",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Vanilla Creme",
      packageSize: "54 g",
      netWeight: "54 g",
      price: 30,
      description: "Crispy cocoa wafer rolls filled with luscious vanilla cream center.",
      ingredientsText: "Sugar, Refined Wheat Flour, Vegetable Oil, Cocoa Powder (6%), Whey Powder, Milk Solids, Emulsifier (Soy Lecithin), Salt.",
      nutritionPer100g: { calories: 475, totalFat: 18.0, saturatedFat: 8.5, carbohydrates: 73.0, sugars: 42.0, protein: 5.0, sodium: 290, fiber: 2.2, salt: 0.72 }
    },
    {
      name: "Oreo Wafer Rolls Chocolate",
      parentBrand: "Mondelez",
      brand: "Oreo",
      subBrand: "Snacks & Formats",
      variant: "Oreo Wafer Rolls (Chocolate)",
      productType: "wafer roll",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Double Chocolate",
      packageSize: "54 g",
      netWeight: "54 g",
      price: 30,
      description: "Crispy dark chocolate wafer tube filled with rich chocolate fudge cream.",
      ingredientsText: "Sugar, Wheat Flour, Palm Oil, Cocoa Powder (9.5%), Skimmed Milk Powder, Emulsifier, Salt, Vanilla Flavour.",
      nutritionPer100g: { calories: 478, totalFat: 18.5, saturatedFat: 8.8, carbohydrates: 72.0, sugars: 41.0, protein: 5.4, sodium: 280, fiber: 2.6, salt: 0.70 }
    }
  ],

  "Dark Fantasy": [
    {
      name: "Sunfeast Dark Fantasy Original Choco Fills",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Original Choco Fills",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Molten Dark Choco",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 35,
      description: "Golden baked crunchy crust encasing a luscious molten chocolate center that melts in your mouth.",
      ingredientsText: "Choco Creme (Sugar, Edible Vegetable Oil, Cocoa Solids, Emulsifier (INS 322)), Refined Wheat Flour (Maida), Hydrogenated Vegetable Oil, Sugar, Invert Syrup, Salt.",
      nutritionPer100g: { calories: 508, totalFat: 26.2, saturatedFat: 12.8, carbohydrates: 63.8, sugars: 36.5, protein: 4.8, sodium: 185, fiber: 2.1, salt: 0.46 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Fills Luxuria",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Choco Fills Luxuria",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Belgian Dark Chocolate",
      packageSize: "100 g",
      netWeight: "100 g",
      price: 60,
      description: "Artisanal luxury cookies crafted with deep cocoa crust and rich Belgian-style dark chocolate filling.",
      ingredientsText: "Dark Cocoa Crust, Belgian Style Choco Creme (42%), Sugar, Cocoa Butter, Emulsifier, Natural Vanilla Extract.",
      nutritionPer100g: { calories: 518, totalFat: 28.0, saturatedFat: 14.0, carbohydrates: 61.0, sugars: 35.0, protein: 5.5, sodium: 170, fiber: 3.2, salt: 0.42 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Nut Fills",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Choco Nut Fills",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Choco & Roasted Hazelnut",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 40,
      description: "Crispy cookie crust with a nutty chocolate center packed with roasted hazelnut bits.",
      ingredientsText: "Choco Nut Creme (Sugar, Vegetable Fat, Roasted Hazelnuts (10%), Cocoa Solids), Wheat Flour, Butter, Emulsifier.",
      nutritionPer100g: { calories: 520, totalFat: 28.5, saturatedFat: 12.5, carbohydrates: 60.5, sugars: 34.0, protein: 6.2, sodium: 180, fiber: 3.0, salt: 0.45 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Fills Coffee",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Choco Fills Coffee",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Mocha Coffee & Choco",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 40,
      description: "Aromatic blend of roasted Arabica coffee and molten chocolate filled inside a dark cocoa shell.",
      ingredientsText: "Coffee Choco Creme (Sugar, Palm Oil, Coffee Extract (2.5%), Cocoa Solids), Refined Wheat Flour, Butter, Leavening Agents.",
      nutritionPer100g: { calories: 510, totalFat: 26.5, saturatedFat: 13.0, carbohydrates: 63.0, sugars: 35.5, protein: 5.0, sodium: 180, fiber: 2.3, salt: 0.45 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Fills Almond",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Choco Fills Almond",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Almond Choco Fills",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 40,
      description: "Rich crunchy crust with a velvety chocolate filling studded with roasted California almond slivers.",
      ingredientsText: "Choco Almond Creme (Sugar, Palm Fat, Roasted Almonds (8%), Cocoa Solids), Wheat Flour, Sugar, Salt, Emulsifier.",
      nutritionPer100g: { calories: 516, totalFat: 27.8, saturatedFat: 12.2, carbohydrates: 61.2, sugars: 34.8, protein: 6.0, sodium: 175, fiber: 2.8, salt: 0.44 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Fills Hazelnut",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Choco Fills",
      variant: "Choco Fills Hazelnut",
      productType: "center-filled cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Hazelnut Praline",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 40,
      description: "Decadent cookie stuffed with creamy chocolate hazelnut praline paste.",
      ingredientsText: "Hazelnut Choco Filling (Roasted Hazelnuts (12%), Cocoa Solids, Sugar, Vegetable Fat), Wheat Flour, Butter, Salt.",
      nutritionPer100g: { calories: 524, totalFat: 29.0, saturatedFat: 12.0, carbohydrates: 59.8, sugars: 33.5, protein: 6.5, sodium: 170, fiber: 3.1, salt: 0.42 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Meltz",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Desserts & Cakes",
      variant: "Choco Meltz",
      productType: "chocolate coated cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Dark Chocolate Enrobed",
      packageSize: "100 g",
      netWeight: "100 g",
      price: 50,
      description: "Crunchy cocoa cookie layered with rich chocolate creme and completely enrobed in glossy dark chocolate.",
      ingredientsText: "Dark Chocolate Coating (40%) (Sugar, Cocoa Mass, Cocoa Butter, Emulsifier), Wheat Flour, Sugar, Palm Oil, Cocoa Powder.",
      nutritionPer100g: { calories: 525, totalFat: 28.5, saturatedFat: 15.2, carbohydrates: 62.0, sugars: 42.0, protein: 5.2, sodium: 210, fiber: 3.5, salt: 0.52 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Chunk Cookies",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Desserts & Cakes",
      variant: "Choco Chunk Cookies",
      productType: "chunk cookie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Triple Choco Chunk",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 60,
      description: "Thick bakery-style cookies packed with oversized chunks of bittersweet dark chocolate.",
      ingredientsText: "Refined Wheat Flour, Dark Chocolate Chunks (24%), Butter, Brown Sugar, Cocoa Solids, Salt, Leavening Agents.",
      nutritionPer100g: { calories: 498, totalFat: 24.0, saturatedFat: 13.5, carbohydrates: 65.0, sugars: 36.0, protein: 5.8, sodium: 260, fiber: 3.4, salt: 0.65 }
    },
    {
      name: "Sunfeast Dark Fantasy Bourbon",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Desserts & Cakes",
      variant: "Bourbon",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Biscuits",
      flavour: "Rich Dark Chocolate Bourbon",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 35,
      description: "Rich dark chocolate cream sandwich biscuits topped with shimmering sugar crystals.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids (6.5%), Invert Sugar, Salt, Leavening Agents, Natural Flavour.",
      nutritionPer100g: { calories: 486, totalFat: 20.0, saturatedFat: 9.8, carbohydrates: 71.0, sugars: 37.0, protein: 5.5, sodium: 340, fiber: 2.8, salt: 0.85 }
    },
    {
      name: "Sunfeast Dark Fantasy Yumfills Pie",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Desserts & Cakes",
      variant: "Yumfills Pie (marshmallow-filled choco pie)",
      productType: "choco pie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Marshmallow Choco Pie",
      packageSize: "150 g",
      netWeight: "150 g",
      price: 65,
      description: "Soft spongy cake sandwiches filled with fluffy white marshmallow and dipped in rich dark chocolate.",
      ingredientsText: "Compound Chocolate (Sugar, Hydrogenated Vegetable Fat, Cocoa Solids, Milk Solids), Wheat Flour, Glucose Syrup, Sugar, Gelatin / Marshmallow.",
      nutritionPer100g: { calories: 460, totalFat: 18.0, saturatedFat: 11.5, carbohydrates: 70.0, sugars: 46.0, protein: 4.5, sodium: 180, fiber: 1.5, salt: 0.45 }
    },
    {
      name: "Sunfeast Dark Fantasy Yumfills Whoopie Pie",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Desserts & Cakes",
      variant: "Yumfills Whoopie Pie",
      productType: "whoopie pie",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Vanilla Creme Whoopie",
      packageSize: "120 g",
      netWeight: "120 g",
      price: 50,
      description: "Soft pillowy double chocolate cake mounds sandwiched with sweet fluffy vanilla cream.",
      ingredientsText: "Chocolate Sponge Cake (Wheat Flour, Sugar, Eggs / Whey Solids, Cocoa Powder), Vanilla Cream Filling (Sugar, Vegetable Fat, Vanilla).",
      nutritionPer100g: { calories: 450, totalFat: 17.5, saturatedFat: 9.0, carbohydrates: 68.0, sugars: 42.0, protein: 5.0, sodium: 210, fiber: 2.0, salt: 0.52 }
    },
    {
      name: "Sunfeast Dark Fantasy Vanilla Creme",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Wafers & Biscuits",
      variant: "Dark Fantasy Vanilla Creme",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Biscuits",
      flavour: "Bourbon Vanilla Creme",
      packageSize: "100 g",
      netWeight: "100 g",
      price: 30,
      description: "Crispy dark chocolate biscuits loaded with rich Madagascar-style vanilla cream.",
      ingredientsText: "Refined Wheat Flour, Sugar, Vegetable Oil, Cocoa Solids, Corn Starch, Leavening Agents, Natural Vanilla Flavour.",
      nutritionPer100g: { calories: 480, totalFat: 19.8, saturatedFat: 9.5, carbohydrates: 71.0, sugars: 36.5, protein: 5.0, sodium: 350, fiber: 2.2, salt: 0.88 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Creme",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Wafers & Biscuits",
      variant: "Dark Fantasy Choco Creme",
      productType: "cream biscuit",
      category: "Snacks & Spreads",
      subCategory: "Biscuits",
      flavour: "Deep Cocoa Creme",
      packageSize: "100 g",
      netWeight: "100 g",
      price: 30,
      description: "Dark chocolate cookies paired with rich cocoa creme filling for maximum chocolate intensity.",
      ingredientsText: "Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids (5.5%), Invert Sugar, Emulsifier, Salt.",
      nutritionPer100g: { calories: 485, totalFat: 20.2, saturatedFat: 9.9, carbohydrates: 70.0, sugars: 37.0, protein: 5.4, sodium: 340, fiber: 2.7, salt: 0.85 }
    },
    {
      name: "Sunfeast Dark Fantasy Choco Wafer Sticks",
      parentBrand: "ITC Sunfeast",
      brand: "Dark Fantasy",
      subBrand: "Wafers & Biscuits",
      variant: "Choco Wafer Sticks",
      productType: "wafer stick",
      category: "Snacks & Spreads",
      subCategory: "Cookies",
      flavour: "Choco Filled Wafer Roll",
      packageSize: "75 g",
      netWeight: "75 g",
      price: 35,
      description: "Crispy spiral-baked wafer rolls injected with rich molten dark chocolate cream.",
      ingredientsText: "Sugar, Wheat Flour, Palm Fat, Cocoa Powder (8%), Skimmed Milk Powder, Soy Lecithin, Salt.",
      nutritionPer100g: { calories: 472, totalFat: 18.0, saturatedFat: 8.6, carbohydrates: 73.0, sugars: 41.5, protein: 5.2, sodium: 270, fiber: 2.4, salt: 0.68 }
    }
  ]
};

// More brands can be appended cleanly in data scripts.
