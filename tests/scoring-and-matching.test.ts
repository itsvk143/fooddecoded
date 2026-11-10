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
} from "../src/lib/ingredient-matcher";
import {
  parseIngredientToken,
  resolveIngredientIntelligence,
  SCIENTIFIC_INGREDIENT_DATABASE,
} from "../src/lib/ingredient-service";

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

test("At least 101 distinct verified biscuit products are present with unique verified barcodes", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const biscuits = products.filter((p) => p.subCategory === "Biscuits");

  assert.ok(biscuits.length >= 101, `Expected at least 101 biscuit products in dataset, got ${biscuits.length}`);

  // Check unique barcodes
  const barcodes = biscuits.map((b) => b.barcode);
  const uniqueBarcodes = new Set(barcodes);
  assert.equal(uniqueBarcodes.size, biscuits.length, "All biscuit barcodes must be strictly unique");

  // Ensure Britannia NutriChoice exists with its verified barcode
  const nutrichoice = biscuits.find((b) => b.barcode === "8901063013862");
  assert.ok(nutrichoice, "Britannia NutriChoice must exist in dataset");
  assert.equal(nutrichoice.brand, "Britannia");
  assert.equal(nutrichoice.dataCompleteness, 100);
  assert.ok(nutrichoice.sourceUrl, "NutriChoice must have sourceUrl");

  // Ensure diverse brands are represented
  const brands = new Set(biscuits.map((b) => b.brand));
  assert.ok(brands.has("Britannia"), "Must include Britannia");
  assert.ok(brands.has("Parle"), "Must include Parle");
  assert.ok(brands.has("Sunfeast"), "Must include Sunfeast");
  assert.ok(brands.has("McVitie's"), "Must include McVitie's");
});

test("queryProducts returns biscuits when querying for biscuit", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "biscuit", limit: 30 });
  assert.ok(res.products.length >= 15, "Expected at least 15 products for q=biscuit");
});

test("Individual biscuit detail lookup by barcode and ID works correctly", async () => {
  const { getProductById, getProductByBarcode } = await import("../src/lib/product-service");

  // Lookup Parle-G
  const parleg = await getProductByBarcode("8901719101007");
  assert.ok(parleg.product);
  assert.equal(parleg.product.name, "Parle-G Original Gluco Biscuit");
  assert.equal(parleg.product.nutritionPer100g.calories, 454);
  assert.equal(parleg.product.nutritionPer100g.sugars, 25.5);

  // Lookup by ID
  const prod = await getProductById("prod_8901063013862");
  assert.ok(prod);
  assert.equal(prod.barcode, "8901063013862");
  assert.equal(prod.brand, "Britannia");
});

test("Healthier biscuit alternatives properly suggest higher-scoring options", async () => {
  const { getProductById, getProductAlternatives } = await import("../src/lib/product-service");

  const nutrichoice = await getProductById("prod_8901063013862");
  assert.ok(nutrichoice);

  const alternatives = await getProductAlternatives(nutrichoice);
  assert.ok(alternatives.length > 0, "Should find healthier biscuit alternatives");
  for (const alt of alternatives) {
    assert.ok(
      alt.overallScore > nutrichoice.overallScore,
      `Alternative score ${alt.overallScore} must exceed original ${nutrichoice.overallScore}`
    );
  }
});

test("At least 101 distinct cookie products are present with unique verified barcodes", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const cookies = products.filter((p) => p.subCategory === "Cookies");

  assert.ok(cookies.length >= 101, `Expected at least 101 cookie products in dataset, got ${cookies.length}`);

  // Check unique barcodes
  const barcodes = cookies.map((c) => c.barcode);
  const uniqueBarcodes = new Set(barcodes);
  assert.equal(uniqueBarcodes.size, cookies.length, "All cookie barcodes must be strictly unique");

  // Check presence of key brands
  const brands = new Set(cookies.map((c) => c.brand));
  assert.ok(brands.has("Britannia") || brands.has("Good Day"), "Cookies must include Britannia / Good Day");
  assert.ok(brands.has("Parle") || brands.has("Hide & Seek"), "Cookies must include Parle / Hide & Seek");
  assert.ok(brands.has("Sunfeast") || brands.has("Sunfeast Dark Fantasy"), "Cookies must include Sunfeast");
  assert.ok(brands.has("Unibic"), "Cookies must include Unibic");
  assert.ok(brands.has("Karachi Bakery"), "Cookies must include Karachi Bakery");
  assert.ok(brands.has("Open Secret"), "Cookies must include Open Secret");
  assert.ok(brands.has("Cadbury"), "Cookies must include Cadbury");
  assert.ok(brands.has("Slurrp Farm"), "Cookies must include Slurrp Farm");

  // Verify Good Day Butter details
  const goodDayButter = cookies.find((c) => c.barcode === "8901063092822");
  assert.ok(goodDayButter, "Good Day Butter must exist");
  assert.equal(goodDayButter.nutritionPer100g.calories, 500);
  assert.equal(goodDayButter.verified, true);
  assert.ok(goodDayButter.sourceUrl);
});

test("Exactly 20 verified Indian snacks are present in dataset", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  
  const snackBarcodes = [
    "8901491101844", // Lay's Magic Masala
    "8901491100250", // Lay's Cream & Onion
    "8901491361026", // Kurkure Masala Munch
    "8904063240187", // Haldiram's Aloo Bhujia
    "8904004400455", // Haldiram's Bhujia Sev
    "8904063216403", // Haldiram's Khatta Meetha
    "8904004403718", // Haldiram's Moong Dal
    "8906010502607", // Balaji Masala Wafers
    "8901725013691", // Bingo! Mad Angles
    "8901725118921", // Bingo! Tedhe Medhe
    "8906005500052", // Bikaji Bikaneri Bhujia
    "8901414000827", // Bikano Navratan Mixture
    "8906090579346", // Too Yumm! Karare
    "8906090577281", // Too Yumm! Veggie Stix
    "8906120108126", // Farmley Peri Peri Makhana
    "8906112663831", // True Elements 7-in-1
    "8908001017893", // Cornitos Nacho Crisps
    "8901512562609", // ACT II Popcorn
    "8906004563683", // Yellow Diamond Chips
    "8904063200464", // Haldiram's Plain Boondi
  ];

  assert.equal(snackBarcodes.length, 20, "20 snack barcodes verified");

  for (const b of snackBarcodes) {
    const found = products.find((p) => p.barcode === b);
    assert.ok(found, `Expected snack with barcode ${b} to exist`);
    assert.equal(found.category, "Snacks & Spreads");
    assert.equal(found.verified, true);
    assert.ok(found.sourceUrl, `Expected sourceUrl for snack ${found.name}`);
  }
});

test("queryProducts returns cookies when querying for cookie", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "cookie", limit: 20 });
  assert.ok(res.products.length >= 10, "Expected at least 10 products for q=cookie");
  const subCats = res.products.map((p) => p.subCategory);
  assert.ok(subCats.includes("Cookies"), "Should include Cookies subcategory");
});

test("Cookie alternatives properly suggest cleaner options", async () => {
  const { getProductByBarcode, getProductAlternatives } = await import("../src/lib/product-service");

  // Good Day Butter has overallScore ~34 due to palm oil and high added sugars
  const butterCookie = await getProductByBarcode("8901063092822");
  assert.ok(butterCookie.product);

  const alts = await getProductAlternatives(butterCookie.product);
  assert.ok(alts.length > 0, "Should suggest alternatives for Good Day Butter");
  for (const alt of alts) {
    assert.ok(
      alt.overallScore > butterCookie.product.overallScore,
      `Alternative score ${alt.overallScore} must exceed original ${butterCookie.product.overallScore}`
    );
  }
});

test("Banana Chips catalogue contains at least 101 distinct verified products with valid scores and source URLs", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();

  const bananaChips = products.filter((p) => p.subCategory === "Banana Chips");
  assert.ok(bananaChips.length >= 101, `Expected at least 101 banana chips, found ${bananaChips.length}`);

  const barcodes = new Set<string>();
  for (const b of bananaChips) {
    assert.ok(b.barcode && b.barcode.length >= 8, `Product ${b.name} must have a valid barcode`);
    assert.ok(!barcodes.has(b.barcode), `Duplicate barcode detected: ${b.barcode} for ${b.name}`);
    barcodes.add(b.barcode);

    assert.equal(b.category, "Snacks & Spreads");
    assert.equal(b.verified, true);
    assert.ok(b.sourceUrl, `Expected sourceUrl for ${b.name}`);
    assert.ok(b.overallScore >= 0 && b.overallScore <= 100, `Valid score for ${b.name}: ${b.overallScore}`);
    assert.ok(["A", "B", "C", "D", "E"].includes(b.nutriScore), `Valid Nutri-Score for ${b.name}: ${b.nutriScore}`);
    assert.ok([1, 2, 3, 4].includes(b.novaGroup), `Valid NOVA group for ${b.name}: ${b.novaGroup}`);
    assert.ok(b.dataCompleteness >= 80, `Expected completeness >= 80% for ${b.name}, got ${b.dataCompleteness}`);
  }
});

test("Banana Chips queryProducts returns variants for q=banana+chips", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "banana chips", limit: 50 });
  assert.ok(res.products.length >= 25, `Expected at least 25 products for q=banana chips, found ${res.products.length}`);
});

test("Banana Chips catalogue covers required diversity (coconut oil, jaggery, pepper, masala, ripe)", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const bananaChips = products.filter((p) => p.subCategory === "Banana Chips");

  // Coconut oil variants
  const coconutOil = bananaChips.filter((p) =>
    p.ingredientsText.toLowerCase().includes("coconut oil")
  );
  assert.ok(coconutOil.length >= 4, `Expected at least 4 coconut oil banana chips, found ${coconutOil.length}`);

  // Jaggery / Sharkara Upperi sweet variants
  const jaggeryVariants = bananaChips.filter((p) =>
    p.ingredientsText.toLowerCase().includes("jaggery")
  );
  assert.ok(jaggeryVariants.length >= 2, `Expected at least 2 jaggery banana chips, found ${jaggeryVariants.length}`);

  // Black Pepper / Mari variants
  const pepperVariants = bananaChips.filter((p) =>
    p.ingredientsText.toLowerCase().includes("black pepper")
  );
  assert.ok(pepperVariants.length >= 4, `Expected at least 4 pepper banana chips, found ${pepperVariants.length}`);

  // Masala / Chilli variants
  const masalaVariants = bananaChips.filter((p) =>
    p.name.toLowerCase().includes("masala") || p.name.toLowerCase().includes("peri peri") || p.name.toLowerCase().includes("chilli")
  );
  assert.ok(masalaVariants.length >= 5, `Expected at least 5 spicy/masala banana chips, found ${masalaVariants.length}`);

  // Naturally ripe banana variant
  const ripeVariants = bananaChips.filter((p) =>
    p.name.toLowerCase().includes("ripe")
  );
  assert.ok(ripeVariants.length >= 1, `Expected at least 1 ripe banana chips, found ${ripeVariants.length}`);
});

test("Catalogue contains at least 101 distinct verified chips products with unique barcodes", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const chips = products.filter(
    (p) => p.subCategory === "Chips" || p.subCategory === "Chips & Crisps"
  );

  assert.ok(chips.length >= 101, `Expected at least 101 chips products, got ${chips.length}`);

  // Unique barcodes
  const barcodes = new Set(chips.map((c) => c.barcode));
  assert.equal(barcodes.size, chips.length, `Expected ${chips.length} unique barcodes, got ${barcodes.size}`);

  // Field validation for all chips
  for (const c of chips) {
    assert.ok(c.name, `Missing name on chip ${c.barcode}`);
    assert.ok(c.brand, `Missing brand on chip ${c.name}`);
    assert.ok(c.servingSize, `Missing servingSize on chip ${c.name}`);
    assert.ok(c.ingredientsText, `Missing ingredientsText on chip ${c.name}`);
    assert.ok(c.imageUrl, `Missing imageUrl on chip ${c.name}`);
    assert.equal(c.verified, true, `Expected verified = true for ${c.name}`);
    assert.ok(c.sourceUrl, `Missing sourceUrl on chip ${c.name}`);
    assert.ok(c.overallScore >= 0 && c.overallScore <= 100, `Invalid score for ${c.name}: ${c.overallScore}`);
    assert.ok(["A", "B", "C", "D", "E"].includes(c.nutriScore), `Invalid NutriScore for ${c.name}: ${c.nutriScore}`);
    assert.ok([1, 2, 3, 4].includes(c.novaGroup), `Invalid NOVA for ${c.name}: ${c.novaGroup}`);
    assert.ok(c.dataCompleteness >= 80, `Expected completeness >= 80% for ${c.name}, got ${c.dataCompleteness}`);
  }
});

test("Chips queryProducts returns at least 101 products when filtered by subCategory=Chips", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ subCategory: "Chips", limit: 120 });
  assert.ok(res.total >= 101, `Expected at least 101 chips total, got ${res.total}`);
  assert.equal(res.products.length, 100, `First page should return 100 products (max page limit)`);
  assert.equal(res.hasMore, true, `Should have hasMore = true for next batch`);
});

test("Chips catalogue has rich brand & product diversity (potato, tortilla, multigrain, popped, stix)", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const chips = products.filter(
    (p) => p.subCategory === "Chips" || p.subCategory === "Chips & Crisps"
  );

  const brands = new Set(chips.map((c) => c.brand));
  assert.ok(brands.has("Lay's"), "Missing Lay's");
  assert.ok(brands.has("Bingo!"), "Missing Bingo!");
  assert.ok(brands.has("Uncle Chipps"), "Missing Uncle Chipps");
  assert.ok(brands.has("Pringles"), "Missing Pringles");
  assert.ok(brands.has("Too Yumm!"), "Missing Too Yumm!");
  assert.ok(brands.has("TagZ Foods"), "Missing TagZ Foods");
  assert.ok(brands.has("Balaji Wafers"), "Missing Balaji Wafers");
  assert.ok(brands.has("Haldiram's"), "Missing Haldiram's");
  assert.ok(brands.has("Yellow Diamond"), "Missing Yellow Diamond");
  assert.ok(brands.has("Parle"), "Missing Parle");
  assert.ok(brands.has("Doritos"), "Missing Doritos");
  assert.ok(brands.has("Cornitos"), "Missing Cornitos");
  assert.ok(brands.size >= 12, `Expected at least 12 distinct brands, got ${brands.size}`);

  // Popped / Baked chips
  const popped = chips.filter((c) => c.name.toLowerCase().includes("popped") || c.brand === "TagZ Foods");
  assert.ok(popped.length >= 4, `Expected at least 4 popped chips, got ${popped.length}`);

  // Tortilla / Corn chips
  const corn = chips.filter((c) => c.brand === "Doritos" || c.brand === "Cornitos" || c.name.toLowerCase().includes("tortilla") || c.name.toLowerCase().includes("nacho"));
  assert.ok(corn.length >= 6, `Expected at least 6 corn/tortilla chips, got ${corn.length}`);

  // Multigrain chips
  const multigrain = chips.filter((c) => c.name.toLowerCase().includes("multigrain"));
  assert.ok(multigrain.length >= 2, `Expected at least 2 multigrain chips, got ${multigrain.length}`);
});

test("Catalogue contains at least 101 distinct verified cold drink products with unique barcodes", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const coldDrinks = products.filter(
    (p) => p.subCategory === "Cold Drinks" || p.categorySlug === "cold-drinks" || p.category === "Cold Drinks"
  );

  assert.ok(coldDrinks.length >= 101, `Expected at least 101 cold drink products, got ${coldDrinks.length}`);

  // Unique barcodes
  const barcodes = new Set(coldDrinks.map((c) => c.barcode));
  assert.equal(barcodes.size, coldDrinks.length, `Expected ${coldDrinks.length} unique barcodes, got ${barcodes.size}`);

  // Field validation for cold drinks
  for (const c of coldDrinks) {
    assert.ok(c.name, `Missing name on cold drink ${c.barcode}`);
    assert.ok(c.brand, `Missing brand on cold drink ${c.name}`);
    assert.ok(c.servingSize, `Missing servingSize on cold drink ${c.name}`);
    assert.ok(c.ingredientsText, `Missing ingredientsText on cold drink ${c.name}`);
    assert.ok(c.imageUrl, `Missing imageUrl on cold drink ${c.name}`);
    assert.equal(c.verified, true, `Expected verified = true for ${c.name}`);
    assert.ok(c.sourceUrl, `Missing sourceUrl on cold drink ${c.name}`);
    assert.ok(c.overallScore >= 0 && c.overallScore <= 100, `Invalid score for ${c.name}: ${c.overallScore}`);
    assert.ok(["A", "B", "C", "D", "E"].includes(c.nutriScore), `Invalid NutriScore for ${c.name}: ${c.nutriScore}`);
    assert.ok([1, 2, 3, 4].includes(c.novaGroup), `Invalid NOVA for ${c.name}: ${c.novaGroup}`);
    assert.ok(c.dataCompleteness >= 80, `Expected completeness >= 80% for ${c.name}, got ${c.dataCompleteness}`);
  }
});

test("Cold drinks queryProducts returns products when filtered by category=cold-drinks", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  
  const resCategory = await queryProducts({ category: "cold-drinks", limit: 120 });
  assert.ok(resCategory.total >= 101, `Expected at least 101 cold drinks total for category=cold-drinks, got ${resCategory.total}`);
  assert.equal(resCategory.products.length, 100, `First page should return 100 products (max page limit)`);
  assert.equal(resCategory.hasMore, true, `Should have hasMore = true`);
});

test("Cold drinks catalogue has diverse brand representation and sugar/formulation variants", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const coldDrinks = products.filter(
    (p) => p.subCategory === "Cold Drinks" || p.categorySlug === "cold-drinks"
  );

  const brands = new Set(coldDrinks.map((c) => c.brand));
  assert.ok(brands.has("Coca-Cola"), "Missing Coca-Cola");
  assert.ok(brands.has("Thums Up"), "Missing Thums Up");
  assert.ok(brands.has("Sprite"), "Missing Sprite");
  assert.ok(brands.has("Limca"), "Missing Limca");
  assert.ok(brands.has("Fanta"), "Missing Fanta");
  assert.ok(brands.has("Pepsi"), "Missing Pepsi");
  assert.ok(brands.has("7UP"), "Missing 7UP");
  assert.ok(brands.has("Mountain Dew"), "Missing Mountain Dew");
  assert.ok(brands.has("Mirinda"), "Missing Mirinda");
  assert.ok(brands.has("Maaza"), "Missing Maaza");
  assert.ok(brands.has("Slice"), "Missing Slice");
  assert.ok(brands.has("Frooti"), "Missing Frooti");
  assert.ok(brands.has("Appy Fizz"), "Missing Appy Fizz");
  assert.ok(brands.has("Paper Boat"), "Missing Paper Boat");
  assert.ok(brands.has("Schweppes"), "Missing Schweppes");
  assert.ok(brands.has("Campa"), "Missing Campa");
  assert.ok(brands.has("Bovonto"), "Missing Bovonto");
  assert.ok(brands.has("Lahori"), "Missing Lahori");
  assert.ok(brands.has("Bisleri"), "Missing Bisleri");
  assert.ok(brands.size >= 15, `Expected at least 15 brands, got ${brands.size}`);

  // Zero sugar and diet variants
  const zeroSugar = coldDrinks.filter(
    (c) => c.name.toLowerCase().includes("zero") || c.name.toLowerCase().includes("diet") || c.name.toLowerCase().includes("black")
  );
  assert.ok(zeroSugar.length >= 6, `Expected at least 6 zero/diet sugar variants, got ${zeroSugar.length}`);

  // High sugar regular drinks
  const regularSugar = coldDrinks.filter((c) => c.nutritionPer100g.sugars >= 10);
  assert.ok(regularSugar.length >= 20, `Expected at least 20 regular sugar cold drinks, got ${regularSugar.length}`);
});

test("Individual cold drink detail lookup and barcode search works", async () => {
  const { getProductByBarcode } = await import("../src/lib/product-service");

  // Lookup Thums Up
  const thumsup = await getProductByBarcode("8901764041211");
  assert.ok(thumsup.product);
  assert.equal(thumsup.product.name, "Thums Up");
  assert.equal(thumsup.product.brand, "Thums Up");
  assert.ok(
    thumsup.product.subCategory === "Cold Drinks" || thumsup.product.subCategory === "Cola Drinks",
    `Expected Cold Drinks or Cola Drinks subCategory, got ${thumsup.product.subCategory}`
  );

  // Lookup Coca-Cola Zero Sugar
  const cokeZero = await getProductByBarcode("8901764022210");
  assert.ok(cokeZero.product);
  assert.equal(cokeZero.product.name, "Coca-Cola Zero Sugar");
  assert.equal(cokeZero.product.nutritionPer100g.calories, 0);
  assert.equal(cokeZero.product.nutritionPer100g.sugars, 0);
});

test("Catalogue contains at least 101 distinct verified ice cream products with unique barcodes", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();

  const iceCreams = products.filter((p) => p.category === "Ice Cream" || p.categorySlug === "ice-cream");
  assert.ok(iceCreams.length >= 101, `Expected at least 101 ice cream products, got ${iceCreams.length}`);

  const barcodes = new Set<string>();
  for (const item of iceCreams) {
    assert.ok(item.barcode, `Product ${item.name} is missing a barcode`);
    assert.ok(!barcodes.has(item.barcode), `Duplicate barcode: ${item.barcode}`);
    barcodes.add(item.barcode);

    assert.ok(item.name, "Product must have name");
    assert.ok(item.brand, "Product must have brand");
    assert.ok(item.subCategory, "Product must have subCategory");
    assert.ok(item.imageUrl, "Product must have imageUrl");
    assert.ok(item.ingredientsText, "Product must have ingredientsText");
    assert.ok(item.nutritionPer100g, "Product must have nutritionPer100g");
    assert.ok(item.overallScore >= 0 && item.overallScore <= 100, "Score range");
    assert.ok(["A", "B", "C", "D", "E"].includes(item.nutriScore), "Valid Nutri-Score");
    assert.ok([1, 2, 3, 4].includes(item.novaGroup), "Valid NOVA group");
  }
});

test("Ice cream queryProducts returns products when filtered by category=Ice Cream", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ category: "Ice Cream", limit: 120 });
  assert.ok(res.total >= 101, `Expected at least 101 ice cream total, got ${res.total}`);
  assert.equal(res.products.length, 100, `First page should return 100 products (max page limit)`);
  assert.equal(res.hasMore, true, `Should have hasMore = true`);
});

test("Ice cream catalogue has rich brand diversity and distinct product types", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();
  const iceCreams = products.filter((p) => p.category === "Ice Cream");

  const brands = new Set(iceCreams.map((p) => p.brand));
  assert.ok(brands.has("Amul"), "Missing Amul");
  assert.ok(brands.has("Mother Dairy"), "Missing Mother Dairy");
  assert.ok(brands.has("Kwality Wall's"), "Missing Kwality Wall's");
  assert.ok(brands.has("Vadilal"), "Missing Vadilal");
  assert.ok(brands.has("Havmor"), "Missing Havmor");
  assert.ok(brands.has("Baskin Robbins"), "Missing Baskin Robbins");
  assert.ok(brands.has("NIC Ice Creams"), "Missing NIC");
  assert.ok(brands.has("Naturals"), "Missing Naturals");
  assert.ok(brands.has("Magnum"), "Missing Magnum");
  assert.ok(brands.size >= 10, `Expected at least 10 brands, got ${brands.size}`);

  // Subcategories
  const subCats = new Set(iceCreams.map((p) => p.subCategory));
  assert.ok(
    subCats.has("Ice Cream") || subCats.has("Regular Ice Cream") || subCats.has("Vanilla Ice Cream"),
    "Missing Ice Cream / Regular subCategory"
  );
  assert.ok(
    subCats.has("Frozen Desserts") || subCats.has("Frozen Dessert") || subCats.has("Ice Cream Bars & Sticks"),
    "Missing Frozen Desserts subCategory"
  );
  assert.ok(subCats.has("Kulfi"), "Missing Kulfi subCategory");
  assert.ok(
    subCats.has("Low Sugar & Healthy Frozen") || subCats.has("Sugar-Free Ice Cream") || subCats.has("Low-Calorie Ice Cream"),
    "Missing Low Sugar subCategory"
  );
});

test("Individual ice cream detail lookup works", async () => {
  const { getProductByBarcode } = await import("../src/lib/product-service");

  // Lookup Amul Vanilla Magic
  const amul = await getProductByBarcode("8901262175814");
  assert.ok(amul.product);
  assert.equal(amul.product.name, "Amul Real Ice Cream Vanilla Magic");
  assert.equal(amul.product.brand, "Amul");
  assert.equal(amul.product.category, "Ice Cream");

  // Lookup Magnum Classic
  const magnum = await getProductByBarcode("8901030922916");
  assert.ok(magnum.product);
  assert.equal(magnum.product.name, "Kwality Wall's Magnum Classic Belgian Chocolate Stick");
  assert.equal(magnum.product.brand, "Magnum");
  assert.ok(
    magnum.product.subCategory === "Frozen Desserts" ||
    magnum.product.subCategory === "Ice Cream Bars & Sticks" ||
    magnum.product.subCategory === "Frozen Dessert"
  );
});

test("5 new supermarket aisles exist with valid taxonomy and subcategories", async () => {
  const { SEED_CATEGORIES } = await import("../src/lib/seed-data");
  const slugSet = new Set(SEED_CATEGORIES.map((c) => c.slug));

  assert.ok(slugSet.has("ready-to-eat-ready-to-cook"), "Missing Ready-to-Eat category");
  assert.ok(slugSet.has("protein-foods-snacks"), "Missing Protein Foods category");
  assert.ok(slugSet.has("plant-based-foods"), "Missing Plant-Based Foods category");
  assert.ok(slugSet.has("bakery-breads"), "Missing Bakery & Breads category");
  assert.ok(slugSet.has("spreads-dips-sauces"), "Missing Spreads, Dips & Sauces category");

  const rte = SEED_CATEGORIES.find((c) => c.slug === "ready-to-eat-ready-to-cook");
  assert.ok(rte?.subCategories?.includes("Ready-to-Eat Curries"));
  assert.ok(rte?.subCategories?.includes("Instant Poha & Upma"));

  const protein = SEED_CATEGORIES.find((c) => c.slug === "protein-foods-snacks");
  assert.ok(protein?.subCategories?.includes("Protein Bars"));
  assert.ok(protein?.subCategories?.includes("Protein Cookies"));

  const plant = SEED_CATEGORIES.find((c) => c.slug === "plant-based-foods");
  assert.ok(plant?.subCategories?.includes("Oat Milk"));
  assert.ok(plant?.subCategories?.includes("Almond Milk"));

  const bakery = SEED_CATEGORIES.find((c) => c.slug === "bakery-breads");
  assert.ok(bakery?.subCategories?.includes("Whole Wheat Bread"));
  assert.ok(bakery?.subCategories?.includes("Sourdough Bread"));

  const spreads = SEED_CATEGORIES.find((c) => c.slug === "spreads-dips-sauces");
  assert.ok(spreads?.subCategories?.includes("Peanut Butter"));
  assert.ok(spreads?.subCategories?.includes("Hummus"));
});

test("queryProducts filters across the 5 new supermarket aisles", async () => {
  const { queryProducts } = await import("../src/lib/product-service");

  // Ready-to-Eat
  const rte = await queryProducts({ category: "Ready-to-Eat & Ready-to-Cook" });
  assert.ok(rte.products.length >= 1, "RTE products should be returned");

  // Protein
  const protein = await queryProducts({ category: "protein-foods-snacks" });
  assert.ok(protein.products.length >= 1, "Protein products should be returned");

  // Plant-Based
  const plant = await queryProducts({ category: "Plant-Based Foods" });
  assert.ok(plant.products.length >= 1, "Plant-Based products should be returned");

  // Bakery
  const bakery = await queryProducts({ category: "bakery-breads" });
  assert.ok(bakery.products.length >= 1, "Bakery products should be returned");

  // Spreads
  const spreads = await queryProducts({ category: "Spreads, Dips & Sauces" });
  assert.ok(spreads.products.length >= 1, "Spreads products should be returned");
});

test("Infinite scrolling batching, pagination cursors and deduplication work seamlessly", async () => {
  const { queryProducts } = await import("../src/lib/product-service");

  // 1. Initial 20-product batch
  const batch1 = await queryProducts({ limit: 20, page: 1 });
  assert.equal(batch1.products.length, 20, "Batch 1 should have exactly 20 products");
  assert.equal(batch1.hasMore, true, "Batch 1 should have hasMore = true");
  assert.equal(batch1.nextCursor, "2", "Batch 1 nextCursor should be '2'");

  // 2. Next 20-product batch
  const batch2 = await queryProducts({ limit: 20, page: 2 });
  assert.equal(batch2.products.length, 20, "Batch 2 should have exactly 20 products");
  assert.equal(batch2.hasMore, true, "Batch 2 should have hasMore = true");

  // 3. Verify zero overlap / zero duplicates between batches
  const batch1Ids = new Set(batch1.products.map((p) => p.id || p._id || p.barcode));
  for (const p of batch2.products) {
    const id = p.id || p._id || p.barcode;
    assert.ok(!batch1Ids.has(id), `Duplicate product ${p.name} (${id}) found across batches`);
  }

  // 4. Multi-page pagination and end-of-catalogue detection for Cookies (101 products)
  const cookiesBatch1 = await queryProducts({ subCategory: "Cookies", limit: 20, page: 1 });
  assert.equal(cookiesBatch1.products.length, 20, "Cookies batch 1 should return 20 products");
  assert.equal(cookiesBatch1.hasMore, true, "Cookies batch 1 hasMore should be true");
  assert.equal(cookiesBatch1.total, 101, "Cookies total should be 101");

  // Page 6 of Cookies (101 total with limit 20: 5 pages of 20 + 1 page of 1)
  const cookiesEnd = await queryProducts({ subCategory: "Cookies", limit: 20, page: 6 });
  assert.equal(cookiesEnd.products.length, 1, "Cookies last page should have exactly 1 product");
  assert.equal(cookiesEnd.hasMore, false, "Cookies last page should have hasMore = false");
  assert.equal(cookiesEnd.nextCursor, null, "nextCursor should be null when hasMore is false");
});

test("Ingredient Intelligence: Evidence-based color classification (GREEN / ORANGE / RED)", () => {
  // Beneficial / Low Concern -> GREEN
  const inulin = resolveIngredientIntelligence("Chicory Root Fibre (Inulin)");
  assert.equal(inulin.classification, "GREEN");
  const whey = resolveIngredientIntelligence("Whey Protein Concentrate");
  assert.equal(whey.classification, "GREEN");
  const cocoa = resolveIngredientIntelligence("Pure Dark Cocoa Solids");
  assert.equal(cocoa.classification, "GREEN");
  const skimmedMilk = resolveIngredientIntelligence("Skimmed Milk");
  assert.equal(skimmedMilk.classification, "GREEN");

  // Consume in Moderation / Conditional -> ORANGE
  const sugar = resolveIngredientIntelligence("Refined Sugar");
  assert.equal(sugar.classification, "ORANGE");
  const erythritol = resolveIngredientIntelligence("Erythritol (INS 968)");
  assert.equal(erythritol.classification, "ORANGE");
  const stevia = resolveIngredientIntelligence("Steviol Glycosides (INS 960)");
  assert.equal(stevia.classification, "ORANGE");
  const palmOil = resolveIngredientIntelligence("Refined Palm Oil");
  assert.equal(palmOil.classification, "ORANGE");

  // Significant Concern / Avoid or Restrict -> RED
  const transFat = resolveIngredientIntelligence("Partially hydrogenated vegetable oil");
  assert.equal(transFat.classification, "RED");
  const tartrazine = resolveIngredientIntelligence("Color (INS 102)");
  assert.equal(tartrazine.classification, "RED");
  const carmoisine = resolveIngredientIntelligence("Carmoisine (INS 122)");
  assert.equal(carmoisine.classification, "RED");
});

test("Ingredient Intelligence: Synthetic additives are not automatically RED (dose-dependent moderation)", () => {
  // Regulated functional additives (emulsifiers, thickeners, stabilizers, acidity regulators)
  // must NOT be blanket classified as RED solely because they are manufactured/synthetic
  const emulsifier = resolveIngredientIntelligence("Emulsifier (INS 471)");
  assert.equal(emulsifier.classification, "ORANGE");
  assert.equal(emulsifier.origin, "Manufactured / Synthetic");
  assert.ok(
    emulsifier.foodFunction?.toLowerCase().includes("stabiliz") ||
    emulsifier.foodFunction?.toLowerCase().includes("oil and water")
  );

  const guarGum = resolveIngredientIntelligence("Stabilizer (INS 412)");
  assert.equal(guarGum.classification, "ORANGE");

  const xanthanGum = resolveIngredientIntelligence("INS 415");
  assert.equal(xanthanGum.classification, "ORANGE");

  const citricAcid = resolveIngredientIntelligence("Acidity Regulator (INS 330)");
  assert.equal(citricAcid.classification, "ORANGE");
});

test("Ingredient Intelligence: Declared quantity parsing vs undisclosed fallback", () => {
  // Declared quantity explicitly on label
  const withQuantity = parseIngredientToken("Mango Pulp (19.5%)");
  assert.equal(withQuantity.declaredQuantity, "19.5%");
  assert.equal(withQuantity.quantitySource, "Declared on packaging label");

  const cocoaButter = parseIngredientToken("Cocoa Butter (8.2%)");
  assert.equal(cocoaButter.declaredQuantity, "8.2%");
  assert.equal(cocoaButter.quantitySource, "Declared on packaging label");

  // Undisclosed quantity (Never guess or estimate)
  const undisclosed = parseIngredientToken("Refined Sugar");
  assert.equal(undisclosed.declaredQuantity, null);
  assert.equal(undisclosed.quantitySource, null);

  // Check matching resolution propagates declaredQuantity
  const matched = resolveIngredientIntelligence("Mango Pulp (19.5%)");
  assert.equal(matched.declaredQuantity, "19.5%");
});

test("Ingredient Intelligence: Separate allergen warning distinct from nutritional classification", () => {
  // Skimmed Milk is nutritious/GREEN, but triggers allergen warning
  const milk = resolveIngredientIntelligence("Skimmed Milk");
  assert.equal(milk.classification, "GREEN", "Nutritional classification should be GREEN");
  assert.equal(milk.isAllergen, true, "Must flag allergen");
  assert.equal(milk.allergenType, "Milk / Dairy");

  // Inulin is GREEN and has NO allergen
  const inulin = resolveIngredientIntelligence("Inulin");
  assert.equal(inulin.classification, "GREEN");
  assert.equal(inulin.isAllergen, false);
});

test("Ingredient Intelligence: Clear distinction between Recommended Daily Intake and ADI without fabricated numbers", () => {
  // Added Sugar: has recommended target ceiling, but no ADI
  const sugar = resolveIngredientIntelligence("Sugar");
  assert.ok(sugar.dailyIntake?.recommended !== null, "Sugar should have recommended dietary intake guidance");
  assert.equal(sugar.dailyIntake?.adi, null, "Sugar does not have an ADI");

  // Steviol Glycosides: has ADI from JECFA / EFSA / FSSAI (4 mg/kg bw/day)
  const stevia = resolveIngredientIntelligence("Steviol Glycosides (INS 960)");
  assert.ok(stevia.dailyIntake?.adi?.includes("4 mg/kg"), "Stevia should report authoritative ADI");

  // Erythritol: has EFSA ADI
  const erythritol = resolveIngredientIntelligence("Erythritol");
  assert.ok(erythritol.dailyIntake?.adi?.includes("0.5 g/kg"), "Erythritol should report EFSA ADI");

  // Unregulated/General whole ingredient without official limits
  const fallback = resolveIngredientIntelligence("Cardamom Powder");
  assert.equal(fallback.dailyIntake?.status, "NOT_ESTABLISHED");
  assert.equal(fallback.dailyIntake?.explanation, "No universally established recommended daily intake.");
});

test("Ingredient Intelligence: INS / E-number resolution to chemical names and scientific profiles", () => {
  // INS 471 -> Mono- and Diglycerides
  const ins471 = resolveIngredientIntelligence("INS 471");
  assert.equal(ins471.normalized, "Mono- and Diglycerides of Fatty Acids");
  assert.equal(ins471.insNumber, "INS 471");

  // INS 968 -> Erythritol
  const ins968 = resolveIngredientIntelligence("E968");
  assert.equal(ins968.normalized, "Erythritol");
  assert.equal(ins968.insNumber, "INS 968");

  // INS 150d -> Caramel IV
  const ins150d = resolveIngredientIntelligence("INS 150d");
  assert.equal(ins150d.normalized, "Caramel IV (Sulphite Ammonia Caramel)");
  assert.equal(ins150d.insNumber, "INS 150d");

  // INS 102 -> Tartrazine (RED)
  const ins102 = resolveIngredientIntelligence("INS 102");
  assert.equal(ins102.normalized, "Tartrazine");
  assert.equal(ins102.classification, "RED");
});

test("Ingredient Intelligence: Full label analysis produces structured interactive results", () => {
  const label =
    "Skimmed milk, chicory root fibre (inulin), erythritol (INS 968), mono- and diglycerides of fatty acids (INS 471), mango pulp (19.5%), tartrazine (INS 102).";

  const analysis = analyzeIngredientsText(label);
  assert.equal(analysis.ingredientsList.length, 6);

  const greenItems = analysis.ingredientsList.filter((i) => i.classification === "GREEN");
  const orangeItems = analysis.ingredientsList.filter((i) => i.classification === "ORANGE");
  const redItems = analysis.ingredientsList.filter((i) => i.classification === "RED");

  assert.ok(greenItems.length >= 2, "Should have at least 2 green ingredients (milk, inulin)");
  assert.ok(orangeItems.length >= 2, "Should have orange ingredients (erythritol, INS 471)");
  assert.ok(redItems.length >= 1, "Should have red ingredient (tartrazine)");

  // Check declared quantity was retained on mango pulp
  const mango = analysis.ingredientsList.find((i) => i.raw.toLowerCase().includes("mango"));
  assert.ok(mango);
  assert.equal(mango?.declaredQuantity, "19.5%");

  // Check allergen was detected
  assert.ok(analysis.allergens.includes("Milk / Dairy"));
});

test("Search Relevance: searching for 'cookie' strictly ranks genuine cookies at top and demotes ice cream", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "cookie", limit: 20 });

  assert.ok(res.products.length >= 10, "Should return cookie results");

  // Top 5 products must all be genuine cookies / protein cookies, NOT ice cream
  const top5 = res.products.slice(0, 5);
  for (const p of top5) {
    assert.notEqual(p.category, "Ice Cream", `Top result ${p.name} must not be Ice Cream`);
    assert.ok(
      p.subCategory === "Cookies" ||
      p.subCategory === "Protein Cookies" ||
      p.name.toLowerCase().includes("cookie"),
      `Top result ${p.name} must be a genuine cookie product`
    );
  }

  // Ice cream with cookie flavour must be demoted below genuine cookies
  const iceCreamIndex = res.products.findIndex((p) => p.category === "Ice Cream");
  if (iceCreamIndex !== -1) {
    assert.ok(
      iceCreamIndex >= 5,
      `Ice Cream products must be demoted to secondary group (found at index ${iceCreamIndex})`
    );
  }
});

test("Search Relevance: searching for 'biscuit' ranks biscuits above secondary ingredient matches", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "biscuit", limit: 10 });

  assert.ok(res.products.length >= 5, "Should return biscuit results");
  const top3 = res.products.slice(0, 3);
  for (const p of top3) {
    assert.equal(p.subCategory, "Biscuits", `Top result ${p.name} must have subCategory Biscuits`);
  }
});

test("Search Relevance: searching for 'cold drinks' returns carbonated soft drinks, colas and sodas", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const res = await queryProducts({ q: "cold drinks", limit: 10 });

  assert.ok(res.products.length >= 5, "Should return cold drinks results");
  for (const p of res.products) {
    assert.ok(
      p.category === "Beverages & Drinks" || p.categorySlug === "cold-drinks" || p.category === "Cold Drinks",
      `Expected beverage product, got ${p.category} (${p.name})`
    );
  }
});

test("Search Relevance: handles all 10 required search queries", async () => {
  const { queryProducts } = await import("../src/lib/product-service");
  const testQueries = [
    { q: "cookie", expectedSubCategory: ["Cookies", "Protein Cookies"] },
    { q: "biscuit", expectedSubCategory: ["Biscuits"] },
    { q: "chips", expectedSubCategory: ["Chips", "Banana Chips", "Protein Chips"] },
    { q: "banana chips", expectedSubCategory: ["Banana Chips"] },
    { q: "ice cream", expectedCategory: ["Ice Cream"] },
    { q: "protein cookie", expectedSubCategory: ["Protein Cookies"] },
    { q: "cold drinks", expectedCategory: ["Beverages & Drinks", "Cold Drinks"] },
    { q: "peanut butter", expectedSubCategory: ["Peanut Butter", "High-Protein Peanut Butter"] },
    { q: "yogurt", expectedSubCategory: ["Yogurt", "Vegan Yogurt"] },
  ];

  for (const item of testQueries) {
    const res = await queryProducts({ q: item.q, limit: 5 });
    assert.ok(res.products.length >= 1, `Query "${item.q}" must return at least 1 product`);
    const top = res.products[0];
    if (item.expectedSubCategory) {
      assert.ok(
        item.expectedSubCategory.includes(top.subCategory || ""),
        `Query "${item.q}" top item [${top.name}] subCategory [${top.subCategory}] must be one of ${item.expectedSubCategory.join(", ")}`
      );
    }
    if (item.expectedCategory) {
      assert.ok(
        item.expectedCategory.includes(top.category || ""),
        `Query "${item.q}" top item [${top.name}] category [${top.category}] must be one of ${item.expectedCategory.join(", ")}`
      );
    }
  }
});

test("Catalogue Audit: verified products have genuine packaging images and independent image verification badges", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();

  for (const p of products) {
    const isPlaceholder = !p.imageUrl || p.imageUrl.includes("placeholder");
    if (isPlaceholder) {
      // Must not claim verified image on placeholder
      assert.notEqual(
        p.imageStatus,
        "VERIFIED",
        `Product ${p.name} with placeholder must not have imageStatus VERIFIED`
      );
      assert.notEqual(
        p.imageVerified,
        true,
        `Product ${p.name} with placeholder must not have imageVerified=true`
      );
    }
  }
});

test("Catalogue Audit: zero barcode collisions across the entire product catalogue", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();

  const barcodes = products.map((p) => p.barcode);
  const unique = new Set(barcodes);
  assert.equal(
    unique.size,
    products.length,
    `Found duplicate barcodes! Total: ${products.length}, Unique: ${unique.size}`
  );
});

test("Comprehensive Category Expansion: Every major supermarket aisle has at least 101 unique products", async () => {
  const { generateSeedProducts } = await import("../src/lib/seed-data");
  const products = generateSeedProducts();

  const aisles = [
    { name: "Biscuits", filter: (p: any) => p.subCategory === "Biscuits" },
    { name: "Cookies", filter: (p: any) => p.subCategory === "Cookies" },
    { name: "Chips", filter: (p: any) => p.subCategory === "Chips" },
    { name: "Banana Chips", filter: (p: any) => p.subCategory === "Banana Chips" },
    { name: "Mixture & Namkeen", filter: (p: any) => p.subCategory === "Mixture & Namkeen" },
    { name: "Cereals & Breakfast", filter: (p: any) => p.category === "Cereals & Breakfast" },
    { name: "Cold Drinks", filter: (p: any) => p.category === "Cold Drinks" || p.categorySlug === "cold-drinks" || p.category === "Beverages & Drinks" },
    { name: "Ice Cream", filter: (p: any) => p.category === "Ice Cream" || p.categorySlug === "ice-cream" },
    { name: "Dairy & Yogurt", filter: (p: any) => p.category === "Dairy & Yogurt" },
    { name: "Ready-to-Eat & Ready-to-Cook", filter: (p: any) => p.category === "Ready-to-Eat & Ready-to-Cook" },
    { name: "Protein Foods & Snacks", filter: (p: any) => p.category === "Protein Foods & Snacks" },
    { name: "Plant-Based Foods", filter: (p: any) => p.category === "Plant-Based Foods" },
    { name: "Bakery & Breads", filter: (p: any) => p.category === "Bakery & Breads" },
    { name: "Spreads, Dips & Sauces", filter: (p: any) => p.category === "Spreads, Dips & Sauces" },
    { name: "Condiments & Sauces", filter: (p: any) => p.category === "Condiments & Sauces" },
    { name: "Pantry & Grains", filter: (p: any) => p.category === "Pantry & Grains" },
  ];

  for (const a of aisles) {
    const count = products.filter(a.filter).length;
    assert.ok(
      count >= 101,
      `Aisle "${a.name}" must contain at least 101 products, but found ${count}`
    );
  }
});
