import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateNutriScore,
  determineNovaGroup,
  calculateOverallScore,
  getTrafficLightLevels,
} from "../src/lib/scoring-engine";
import {
  analyzeIngredientsText,
  matchSingleIngredient,
  cleanIngredientString,
  parseIngredientList,
} from "../src/lib/ingredient-matcher";

test("Nutri-Score calculation correctly grades whole foods vs high-sugar foods", () => {
  // Plain oats / whole grains -> Grade A
  const healthyOats = {
    calories: 350,
    totalFat: 5.0,
    saturatedFat: 0.8,
    carbohydrates: 65,
    sugars: 1.0,
    fiber: 10.0,
    protein: 13.0,
    sodium: 5,
    salt: 0.01,
  };
  const oatsResult = calculateNutriScore(healthyOats);
  assert.equal(oatsResult.grade, "A");

  // Soda / confectionery -> Grade E
  const soda = {
    calories: 42,
    totalFat: 0,
    saturatedFat: 0,
    carbohydrates: 11,
    sugars: 11,
    fiber: 0,
    protein: 0,
    sodium: 15,
    salt: 0.03,
  };
  const sodaResult = calculateNutriScore(soda, true);
  assert.equal(sodaResult.grade, "E");
});

test("Nova classification correctly differentiates raw vs ultra-processed formulations", () => {
  // Nova 1: Raw / single ingredient
  const rawIngredients = [
    {
      raw: "whole grain oats",
      normalized: "whole oats",
      riskLevel: "safe" as const,
    },
  ];
  const nova1 = determineNovaGroup(rawIngredients, "whole grain oats");
  assert.equal(nova1, 1);

  // Nova 4: Industrial formulation with artificial colors and preservatives
  const ultraIngredients = [
    { raw: "sugar", normalized: "sugar", riskLevel: "caution" as const },
    { raw: "artificial flavor", normalized: "artificial flavor", riskLevel: "caution" as const },
    { raw: "red 40", normalized: "red 40", riskLevel: "caution" as const },
  ];
  const nova4 = determineNovaGroup(
    ultraIngredients,
    "sugar, corn starch, artificial flavor, red 40, emulsifier"
  );
  assert.equal(nova4, 4);
});

test("FoodDecode Overall Score applies penalties and caps appropriately", () => {
  const healthyNutrition = {
    calories: 120,
    totalFat: 2.0,
    saturatedFat: 0.5,
    carbohydrates: 20,
    sugars: 2.0,
    fiber: 6.0,
    protein: 12.0,
    sodium: 60,
    salt: 0.15,
  };

  const safeIngredients = [
    { raw: "organic lentils", normalized: "lentils", riskLevel: "safe" as const },
    { raw: "water", normalized: "water", riskLevel: "safe" as const },
  ];

  const overallHealthy = calculateOverallScore({
    nutrition: healthyNutrition,
    ingredients: safeIngredients,
    nutriScore: "A",
    novaGroup: 1,
    category: "Pantry",
  });

  assert.ok(overallHealthy.score >= 80, `Expected score >= 80, got ${overallHealthy.score}`);
  assert.equal(overallHealthy.label, "Excellent");

  // Ultra-processed product with high hazard additive
  const harmfulIngredients = [
    { raw: "sugar", normalized: "sugar", riskLevel: "caution" as const, isAddedSugar: true },
    {
      raw: "titanium dioxide",
      normalized: "titanium dioxide",
      riskLevel: "avoid" as const,
    },
    { raw: "palm oil", normalized: "palm oil", riskLevel: "caution" as const, isPalmOil: true },
  ];

  const overallJunk = calculateOverallScore({
    nutrition: {
      calories: 540,
      totalFat: 32,
      saturatedFat: 14,
      carbohydrates: 60,
      sugars: 45,
      fiber: 1,
      protein: 3,
      sodium: 700,
      salt: 1.75,
    },
    ingredients: harmfulIngredients,
    nutriScore: "E",
    novaGroup: 4,
    category: "Snacks",
  });

  assert.ok(overallJunk.score < 40, `Expected junk score < 40, got ${overallJunk.score}`);
});

test("Ingredient matcher accurately detects Palm Oil, Added Sugars, Allergens and Banned Additives", () => {
  const label =
    "Whole grain wheat (gluten), palm oil, high fructose corn syrup, red 40 (allura red), skimmed milk, titanium dioxide (E171).";

  const analysis = analyzeIngredientsText(label);

  assert.equal(analysis.hasPalmOil, true, "Should detect palm oil");
  assert.equal(analysis.hasAddedSugar, true, "Should detect added sugar");
  assert.equal(analysis.hasArtificialAdditives, true, "Should detect artificial additives");

  // Allergens
  assert.ok(analysis.allergens.includes("Milk / Dairy"), "Should detect dairy allergen");
  assert.ok(analysis.allergens.includes("Wheat / Gluten"), "Should detect gluten allergen");

  // Banned additive alert
  const hasTitaniumAlert = analysis.ingredientAlerts.some((a) =>
    a.toLowerCase().includes("titanium dioxide")
  );
  assert.ok(hasTitaniumAlert, "Should alert on titanium dioxide");
});

test("Traffic light thresholds conform to FSA guidelines", () => {
  const lights = getTrafficLightLevels({
    calories: 250,
    totalFat: 1.0, // <= 3.0 -> low (green)
    saturatedFat: 6.5, // > 5.0 -> high (red)
    carbohydrates: 30,
    sugars: 12.0, // > 5.0 and <= 22.5 -> moderate (amber)
    fiber: 2,
    protein: 5,
    sodium: 40, // <= 120 -> low (green)
    salt: 0.1,
  });

  assert.equal(lights.fat.color, "green");
  assert.equal(lights.saturatedFat.color, "red");
  assert.equal(lights.sugars.color, "amber");
  assert.equal(lights.sodium.color, "green");
});
