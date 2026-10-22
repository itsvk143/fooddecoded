import {
  NutritionInfo,
  NutriScoreGrade,
  NovaGroup,
  IngredientMatchResult,
} from "@/types";

export interface TrafficLightColor {
  level: "low" | "moderate" | "high";
  color: "green" | "amber" | "red";
  label: string;
}

/**
 * Traffic light thresholds according to UK FSA / EU dietary standards (per 100g solids)
 */
export function getTrafficLightLevels(nutrition: NutritionInfo): {
  fat: TrafficLightColor;
  saturatedFat: TrafficLightColor;
  sugars: TrafficLightColor;
  salt: TrafficLightColor;
  sodium: TrafficLightColor;
} {
  const fat =
    nutrition.totalFat <= 3.0
      ? { level: "low" as const, color: "green" as const, label: "Low Fat" }
      : nutrition.totalFat <= 17.5
      ? { level: "moderate" as const, color: "amber" as const, label: "Moderate Fat" }
      : { level: "high" as const, color: "red" as const, label: "High Fat" };

  const saturatedFat =
    nutrition.saturatedFat <= 1.5
      ? { level: "low" as const, color: "green" as const, label: "Low Saturated Fat" }
      : nutrition.saturatedFat <= 5.0
      ? { level: "moderate" as const, color: "amber" as const, label: "Moderate Saturated Fat" }
      : { level: "high" as const, color: "red" as const, label: "High Saturated Fat" };

  const sugars =
    nutrition.sugars <= 5.0
      ? { level: "low" as const, color: "green" as const, label: "Low Sugar" }
      : nutrition.sugars <= 22.5
      ? { level: "moderate" as const, color: "amber" as const, label: "Moderate Sugar" }
      : { level: "high" as const, color: "red" as const, label: "High Sugar" };

  const saltVal = nutrition.salt || (nutrition.sodium ? (nutrition.sodium * 2.5) / 1000 : 0);
  const salt =
    saltVal <= 0.3
      ? { level: "low" as const, color: "green" as const, label: "Low Salt" }
      : saltVal <= 1.5
      ? { level: "moderate" as const, color: "amber" as const, label: "Moderate Salt" }
      : { level: "high" as const, color: "red" as const, label: "High Salt" };

  const sodium =
    nutrition.sodium <= 120
      ? { level: "low" as const, color: "green" as const, label: "Low Sodium" }
      : nutrition.sodium <= 600
      ? { level: "moderate" as const, color: "amber" as const, label: "Moderate Sodium" }
      : { level: "high" as const, color: "red" as const, label: "High Sodium" };

  return { fat, saturatedFat, sugars, salt, sodium };
}

/**
 * Official Nutri-Score calculation based on French Public Health Authority algorithm
 */
export function calculateNutriScore(
  nutrition: NutritionInfo,
  isBeverage: boolean = false
): { grade: NutriScoreGrade; score: number } {
  let energyPoints = 0;
  let sugarPoints = 0;
  let satFatPoints = Math.min(10, Math.floor(nutrition.saturatedFat / 1.0));
  if (satFatPoints < 0) satFatPoints = 0;
  let sodiumPoints = Math.min(10, Math.floor(nutrition.sodium / 90));
  if (sodiumPoints < 0) sodiumPoints = 0;

  if (isBeverage) {
    const energyKj = nutrition.calories * 4.184;
    if (energyKj <= 0) energyPoints = 0;
    else if (energyKj <= 30) energyPoints = 1;
    else if (energyKj <= 60) energyPoints = 2;
    else if (energyKj <= 90) energyPoints = 3;
    else if (energyKj <= 120) energyPoints = 4;
    else if (energyKj <= 150) energyPoints = 5;
    else if (energyKj <= 180) energyPoints = 6;
    else if (energyKj <= 210) energyPoints = 7;
    else if (energyKj <= 240) energyPoints = 8;
    else if (energyKj <= 270) energyPoints = 9;
    else energyPoints = 10;

    const s = nutrition.sugars;
    if (s <= 0) sugarPoints = 0;
    else if (s <= 0.5) sugarPoints = 1;
    else if (s <= 1.5) sugarPoints = 2;
    else if (s <= 2.5) sugarPoints = 3;
    else if (s <= 3.5) sugarPoints = 4;
    else if (s <= 4.5) sugarPoints = 5;
    else if (s <= 6.0) sugarPoints = 6;
    else if (s <= 7.5) sugarPoints = 7;
    else if (s <= 9.0) sugarPoints = 8;
    else if (s <= 10.5) sugarPoints = 9;
    else sugarPoints = 10;
  } else {
    const energyKj = nutrition.calories * 4.184;
    energyPoints = Math.min(10, Math.floor(energyKj / 335));
    if (energyPoints < 0) energyPoints = 0;

    sugarPoints = Math.min(10, Math.floor(nutrition.sugars / 4.5));
    if (sugarPoints < 0) sugarPoints = 0;
  }

  const negativePoints = energyPoints + sugarPoints + satFatPoints + sodiumPoints;

  // Fiber points (g / 0.9 up to 5)
  let fiberPoints = Math.min(5, Math.floor((nutrition.fiber || 0) / 0.9));
  if (fiberPoints < 0) fiberPoints = 0;

  // Protein points (g / 1.6 up to 5)
  let proteinPoints = Math.min(5, Math.floor((nutrition.protein || 0) / 1.6));
  if (proteinPoints < 0) proteinPoints = 0;

  const finalScore = negativePoints - (fiberPoints + proteinPoints);

  let grade: NutriScoreGrade = "C";
  if (!isBeverage) {
    if (finalScore <= -1) grade = "A";
    else if (finalScore <= 2) grade = "B";
    else if (finalScore <= 10) grade = "C";
    else if (finalScore <= 18) grade = "D";
    else grade = "E";
  } else {
    if (nutrition.calories === 0 && nutrition.sugars === 0 && !nutrition.sodium) {
      grade = "A";
    } else if (finalScore <= 1) {
      grade = "B";
    } else if (finalScore <= 5) {
      grade = "C";
    } else if (finalScore <= 9) {
      grade = "D";
    } else {
      grade = "E";
    }
  }

  return { grade, score: finalScore };
}

/**
 * Determine Nova food classification group (1-4)
 */
export function determineNovaGroup(
  ingredients: IngredientMatchResult[],
  ingredientsText: string
): NovaGroup {
  const textLower = (ingredientsText || "").toLowerCase();

  // Markers of Ultra-processed foods (Nova 4)
  const ultraProcessedMarkers = [
    "artificial flavor",
    "hydrogenated",
    "high fructose corn syrup",
    "emulsifier",
    "polysorbate",
    "carboxymethylcellulose",
    "maltodextrin",
    "flavor enhancer",
    "monosodium glutamate",
    "modified starch",
    "color",
    "preservative",
    "sweetener",
    "sucralose",
    "aspartame",
    "acesulfame",
  ];

  const hasUltraProcessedAdditives = ingredients.some(
    (i) => i.riskLevel === "avoid" || (i.category === "sweetener" && i.normalized !== "sugar")
  );

  const matchedMarkersCount = ultraProcessedMarkers.filter((marker) =>
    textLower.includes(marker)
  ).length;

  if (hasUltraProcessedAdditives || matchedMarkersCount >= 2 || ingredients.length > 8) {
    return 4; // Ultra-processed food and drink products
  }

  if (ingredients.length <= 1) {
    return 1; // Unprocessed or minimally processed foods
  }

  if (
    ingredients.length <= 3 &&
    (textLower.includes("salt") || textLower.includes("oil") || textLower.includes("sugar"))
  ) {
    return 2; // Processed culinary ingredients
  }

  return 3; // Processed foods (canned veg, simple cheeses, freshly baked breads)
}

/**
 * Calculate comprehensive FoodDecode Overall Score (0-100)
 */
export function calculateOverallScore(params: {
  nutrition: NutritionInfo;
  ingredients: IngredientMatchResult[];
  nutriScore: NutriScoreGrade;
  novaGroup: NovaGroup;
  category?: string;
}): {
  score: number;
  label: "Excellent" | "Good" | "Moderate" | "Poor" | "Bad";
  breakdown: Record<string, number>;
} {
  const { nutrition, ingredients, nutriScore, novaGroup } = params;

  let baseScore = 100;
  const breakdown: Record<string, number> = {};

  // 1. Nutri-Score Penalty
  const nutriScoreDeductions: Record<NutriScoreGrade, number> = {
    A: 0,
    B: -8,
    C: -18,
    D: -32,
    E: -45,
  };
  const nutriDeduction = nutriScoreDeductions[nutriScore];
  baseScore += nutriDeduction;
  breakdown["nutriScoreAdjustment"] = nutriDeduction;

  // 2. Nova Group Processing Penalty
  const novaDeductions: Record<NovaGroup, number> = {
    1: 5,   // Bonus for whole food
    2: 0,
    3: -8,
    4: -20, // Major penalty for ultra-processed
  };
  const novaAdjustment = novaDeductions[novaGroup];
  baseScore += novaAdjustment;
  breakdown["novaProcessingAdjustment"] = novaAdjustment;

  // 3. Additive Risks
  let additivePenalty = 0;
  for (const item of ingredients) {
    if (item.riskLevel === "avoid") {
      additivePenalty -= 10;
    } else if (item.riskLevel === "caution") {
      additivePenalty -= 4;
    }
  }
  // Cap additive penalty to -30
  additivePenalty = Math.max(-30, additivePenalty);
  baseScore += additivePenalty;
  breakdown["additivesAdjustment"] = additivePenalty;

  // 4. Palm Oil deduction
  const hasPalmOil = ingredients.some((i) => i.isPalmOil);
  if (hasPalmOil) {
    baseScore -= 6;
    breakdown["palmOilDeduction"] = -6;
  }

  // 5. Positive Nutrient Bonuses
  let nutrientBonus = 0;
  if ((nutrition.fiber || 0) >= 5) nutrientBonus += 4;
  if ((nutrition.protein || 0) >= 10) nutrientBonus += 4;
  baseScore += nutrientBonus;
  breakdown["fiberAndProteinBonus"] = nutrientBonus;

  // Clamp 0 to 100
  const finalScore = Math.max(5, Math.min(100, Math.round(baseScore)));

  let label: "Excellent" | "Good" | "Moderate" | "Poor" | "Bad" = "Moderate";
  if (finalScore >= 80) label = "Excellent";
  else if (finalScore >= 65) label = "Good";
  else if (finalScore >= 45) label = "Moderate";
  else if (finalScore >= 25) label = "Poor";
  else label = "Bad";

  return {
    score: finalScore,
    label,
    breakdown,
  };
}

/**
 * Quantifies data completeness percentage based on present nutrition metrics and ingredients
 */
export function calculateDataCompleteness(
  nutrition?: Partial<NutritionInfo>,
  ingredientsText?: string,
  imageUrl?: string
): number {
  let fieldsCount = 0;
  let filledCount = 0;

  const check = (val: unknown) => {
    fieldsCount++;
    if (val !== undefined && val !== null && val !== "") filledCount++;
  };

  check(nutrition?.calories);
  check(nutrition?.totalFat);
  check(nutrition?.saturatedFat);
  check(nutrition?.carbohydrates);
  check(nutrition?.sugars);
  check(nutrition?.fiber);
  check(nutrition?.protein);
  check(nutrition?.sodium || nutrition?.salt);
  check(ingredientsText);
  check(imageUrl);

  return Math.round((filledCount / fieldsCount) * 100);
}
