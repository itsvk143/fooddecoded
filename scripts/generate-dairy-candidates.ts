import fs from "fs";
import path from "path";

// Define the interface
export interface DairyCandidate {
  barcode: string;
  name: string;
  brand: string;
  manufacturer: string;
  category: "Dairy & Yogurt";
  categorySlug: "dairy-alternatives";
  subCategory:
    | "Milk"
    | "Greek Yogurt"
    | "Regular Yogurt / Dahi"
    | "Flavoured Yogurt"
    | "Probiotic Yogurt / Drinks"
    | "Paneer"
    | "Cheese"
    | "Butter"
    | "Ghee"
    | "Cream and Sour Cream"
    | "Buttermilk / Lassi"
    | "Plant-Based Milk Alternatives"
    | "Plant-Based Yogurt Alternatives"
    | "Other Dairy Products";
  productType: string;
  flavour: string;
  packageSize: string;
  servingSize: string;
  remoteImageUrl: string;
  imageSource: string;
  imageVerificationNote: string;
  sourceUrl: string;
  ingredientsText: string;
  nutritionPer100g: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat?: number;
    carbohydrates: number;
    sugars: number;
    addedSugars?: number;
    fiber: number;
    protein: number;
    sodium: number;
    salt: number;
  };
  allergens: string[];
}

console.log("Interface ready");
