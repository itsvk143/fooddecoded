import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

export interface CanonicalCategory {
  _id: string;
  name: string;
  slug: string;
  displayOrder: number;
  description: string;
  icon: string;
  subCategories: string[];
}

export const CANONICAL_19_CATEGORIES: CanonicalCategory[] = [
  {
    _id: "cat_chips_namkeen_savoury_snacks",
    name: "Chips, Namkeen & Savoury Snacks",
    slug: "chips-namkeen-savoury-snacks",
    displayOrder: 1,
    description: "Potato chips, banana chips, bhujia, namkeen, tortilla chips, extruded puffs and savoury crisps.",
    icon: "Cookie",
    subCategories: [
      "Potato Chips",
      "Banana Chips",
      "Namkeen & Bhujia",
      "Extruded Snacks & Puffs",
      "Tortilla & Corn Chips",
      "Savoury Crisps",
      "Papad & Fryums"
    ]
  },
  {
    _id: "cat_makhana_roasted_snacks",
    name: "Makhana & Roasted Snacks",
    slug: "makhana-roasted-snacks",
    displayOrder: 2,
    description: "Roasted makhana (foxnuts), roasted chana, roasted peanuts, popped diet snacks and healthy roasted mixes.",
    icon: "Flame",
    subCategories: [
      "Roasted Makhana",
      "Roasted Chana",
      "Roasted Seeds & Nuts Snacks",
      "Popped Diet Snacks",
      "Roasted Multigrain Snacks"
    ]
  },
  {
    _id: "cat_biscuits_cookies_crackers",
    name: "Biscuits, Cookies & Crackers",
    slug: "biscuits-cookies-crackers",
    displayOrder: 3,
    description: "Glucose biscuits, digestive biscuits, cookies, cream biscuits, crackers, salted biscuits and rusks.",
    icon: "Cookie",
    subCategories: [
      "Cookies",
      "Digestive & Marie Biscuits",
      "Cream Biscuits",
      "Glucose & Milk Biscuits",
      "Crackers & Salted Biscuits",
      "Rusks"
    ]
  },
  {
    _id: "cat_chocolates_candy_sweets",
    name: "Chocolates, Candy & Sweets",
    slug: "chocolates-candy-sweets",
    displayOrder: 4,
    description: "Dark chocolates, milk chocolates, white chocolates, traditional Indian sweets, chikki, candies, toffees and mints.",
    icon: "Candy",
    subCategories: [
      "Dark Chocolate",
      "Milk Chocolate",
      "White Chocolate",
      "Traditional Indian Sweets",
      "Chikki & Gajak",
      "Candies, Toffees & Mints",
      "Gummies & Jellies"
    ]
  },
  {
    _id: "cat_protein_bars_energy_bars_wafers",
    name: "Protein Bars, Energy Bars & Wafers",
    slug: "protein-bars-energy-bars-wafers",
    displayOrder: 5,
    description: "Whey protein bars, vegan protein bars, energy bars, granola bars, fruit & nut bars and protein wafers.",
    icon: "Zap",
    subCategories: [
      "Protein Bars",
      "Energy & Granola Bars",
      "Protein Wafers",
      "Fruit & Nut Bars"
    ]
  },
  {
    _id: "cat_breakfast_cereals_muesli_granola",
    name: "Breakfast Cereals, Muesli & Granola",
    slug: "breakfast-cereals-muesli-granola",
    displayOrder: 6,
    description: "Corn flakes, multigrain muesli, baked granola, kids' cereals and bran breakfast flakes.",
    icon: "Wheat",
    subCategories: [
      "Corn Flakes & Flakes",
      "Muesli",
      "Granola",
      "Kids' Cereals",
      "Bran & Multigrain Cereals"
    ]
  },
  {
    _id: "cat_oats_porridge",
    name: "Oats & Porridge",
    slug: "oats-porridge",
    displayOrder: 7,
    description: "Rolled oats, instant oats, steel-cut oats, savoury masala oats, dalia and wholesome breakfast porridge.",
    icon: "Coffee",
    subCategories: [
      "Rolled Oats",
      "Instant Oats",
      "Steel-Cut Oats",
      "Flavoured Masala Oats",
      "Porridge & Dalia"
    ]
  },
  {
    _id: "cat_bakery_breads",
    name: "Bakery & Breads",
    slug: "bakery-breads",
    displayOrder: 8,
    description: "Fresh breads, burger buns, pav, tea cakes, muffins, brownies, pizza bases and bakery pastries.",
    icon: "Sandwich",
    subCategories: [
      "Breads & Pav",
      "Cakes & Pastries",
      "Muffins & Cupcakes",
      "Buns & Pizza Bases",
      "Brownies"
    ]
  },
  {
    _id: "cat_noodles_pasta_vermicelli",
    name: "Noodles, Pasta & Vermicelli",
    slug: "noodles-pasta-vermicelli",
    displayOrder: 9,
    description: "Instant noodles, macaroni, durum wheat pasta, vermicelli (sewai), ramen and hakka noodles.",
    icon: "Soup",
    subCategories: [
      "Instant Noodles",
      "Pasta & Macaroni",
      "Vermicelli & Sewai",
      "Ramen & Asian Noodles",
      "Millet & Hakka Noodles"
    ]
  },
  {
    _id: "cat_ready_to_eat_meals_instant_foods",
    name: "Ready-to-Eat Meals & Instant Foods",
    slug: "ready-to-eat-meals-instant-foods",
    displayOrder: 10,
    description: "Heat-and-eat curries, packaged meal bowls, instant soups, instant poha, upma and frozen snacks/appetizers.",
    icon: "Utensils",
    subCategories: [
      "Instant Meals & Bowls",
      "Ready-to-Eat Curries & Rice",
      "Packaged Soups",
      "Frozen Snacks & Appetizers",
      "Poha & Upma Ready Meals"
    ]
  },
  {
    _id: "cat_ready_to_cook_mixes",
    name: "Ready-to-Cook Mixes",
    slug: "ready-to-cook-mixes",
    displayOrder: 11,
    description: "Instant dosa and idli batter, pancake mixes, gulab jamun mix, cake mixes, dhokla and snack cooking mixes.",
    icon: "ChefHat",
    subCategories: [
      "Dosa & Idli Batters/Mixes",
      "Pancake & Waffle Mixes",
      "Traditional Sweet Mixes",
      "Cake & Dessert Mixes",
      "Meal & Batter Mixes"
    ]
  },
  {
    _id: "cat_rice_grains_pulses_flours",
    name: "Rice, Grains, Pulses & Flours",
    slug: "rice-grains-pulses-flours",
    displayOrder: 12,
    description: "Whole wheat atta, basmati rice, millets, quinoa, unpolished dals, pulses and specialty flours.",
    icon: "Wheat",
    subCategories: [
      "Atta & Flours",
      "Rice & Basmati",
      "Millets & Ancient Grains",
      "Pulses & Dals",
      "Poha & Flattened Rice"
    ]
  },
  {
    _id: "cat_nuts_seeds_trail_mixes",
    name: "Nuts, Seeds & Trail Mixes",
    slug: "nuts-seeds-trail-mixes",
    displayOrder: 13,
    description: "California almonds, cashews, walnuts, chia seeds, pumpkin seeds, sunflower seeds, trail mixes and dried fruits.",
    icon: "Nut",
    subCategories: [
      "Almonds",
      "Cashews & Walnuts",
      "Raw & Roasted Seeds",
      "Trail Mixes",
      "Dry Fruits & Raisins",
      "Mixed Nuts"
    ]
  },
  {
    _id: "cat_nut_butters_spreads_dips",
    name: "Nut Butters, Spreads & Dips",
    slug: "nut-butters-spreads-dips",
    displayOrder: 14,
    description: "Peanut butter, almond butter, hazelnut cocoa spreads, fruit jams, preserves, hummus and savory dips.",
    icon: "Sparkles",
    subCategories: [
      "Peanut Butter",
      "Almond & Nut Butters",
      "Chocolate Spreads",
      "Fruit Jams & Preserves",
      "Hummus & Savoury Dips"
    ]
  },
  {
    _id: "cat_sauces_condiments_seasonings",
    name: "Sauces, Condiments & Seasonings",
    slug: "sauces-condiments-seasonings",
    displayOrder: 15,
    description: "Tomato ketchup, hot sauces, chutneys, mayonnaise, salad dressings, cooking pastes and herbs/seasonings.",
    icon: "Droplets",
    subCategories: [
      "Tomato Ketchup & Sauces",
      "Hot Sauces & Chutneys",
      "Salad Dressings",
      "Cooking Sauces & Pastes",
      "Seasonings, Herbs & Spices",
      "Vinegars & Mustards"
    ]
  },
  {
    _id: "cat_dairy_yogurt_dairy_alternatives",
    name: "Dairy, Yogurt & Dairy Alternatives",
    slug: "dairy-yogurt-dairy-alternatives",
    displayOrder: 16,
    description: "Fresh milk, paneer, curd, Greek yogurt, cheese, butter, desi ghee and fortified plant-based milks.",
    icon: "Milk",
    subCategories: [
      "Milk & Fortified Milk",
      "Curd & Yogurt",
      "Greek Yogurt",
      "Paneer & Tofu",
      "Cheese & Butter",
      "Ghee",
      "Plant-Based Milks"
    ]
  },
  {
    _id: "cat_beverages_drink_mixes",
    name: "Beverages & Drink Mixes",
    slug: "beverages-drink-mixes",
    displayOrder: 17,
    description: "Carbonated sodas, colas, fruit juices, iced teas, cold brews, energy drinks, coconut water and drink syrups.",
    icon: "CupSoda",
    subCategories: [
      "Carbonated Soft Drinks & Sodas",
      "Fruit Juices & Nectars",
      "Iced Teas & Cold Brews",
      "Energy & Sports Drinks",
      "Coconut Water",
      "Drink Mixes, Syrups & Squashes",
      "Tea & Coffee"
    ]
  },
  {
    _id: "cat_ice_cream_frozen_desserts",
    name: "Ice Cream & Frozen Desserts",
    slug: "ice-cream-frozen-desserts",
    displayOrder: 18,
    description: "Dairy ice cream tubs, ice cream sticks, cones, traditional kulfi, gelato, sorbet and frozen desserts.",
    icon: "IceCream",
    subCategories: [
      "Ice Cream Tubs & Tins",
      "Ice Cream Sticks & Bars",
      "Ice Cream Cones",
      "Kulfi",
      "Gelato & Sorbet",
      "Frozen Yogurt & Popsicles"
    ]
  },
  {
    _id: "cat_plant_based_foods_meat_alternatives",
    name: "Plant-Based Foods & Meat Alternatives",
    slug: "plant-based-foods-meat-alternatives",
    displayOrder: 19,
    description: "Plant-based meat, mock meats, soya chaap, vegan burgers, plant protein nuggets, tempeh and tofu cuts.",
    icon: "Leaf",
    subCategories: [
      "Plant-Based Patties & Burgers",
      "Plant-Based Sausages & Kebabs",
      "Plant-Based Mince & Keema",
      "Tofu & Tempeh Specialities"
    ]
  }
];

export function classifyProduct(p: any): {
  category: string;
  categorySlug: string;
  mainCategory: string;
  primary_category_id: string;
  subCategory: string;
} {
  const name = (p.name || "").toLowerCase();
  const brand = (p.brand || "").toLowerCase();
  const sub = (p.subCategory || "").toLowerCase();
  const oldCat = (p.category || "").toLowerCase();

  // 1. Ice Cream & Frozen Desserts
  if (
    oldCat.includes("ice cream") ||
    sub.includes("ice cream") ||
    sub.includes("kulfi") ||
    sub.includes("gelato") ||
    sub.includes("sorbet") ||
    /\b(ice cream|kulfi|gelato|sorbet|popsicle|cornetto|magnum)\b/i.test(name)
  ) {
    let subCat = "Ice Cream";
    if (sub.includes("kulfi") || /\bkulfi\b/i.test(name)) subCat = "Kulfi";
    else if (sub.includes("cone") || /\b(cone|cornetto)\b/i.test(name)) subCat = "Ice Cream Cones";
    else if (sub.includes("stick") || sub.includes("bar") || /\b(stick|bar|magnum)\b/i.test(name)) subCat = "Ice Cream Sticks & Bars";
    else if (sub.includes("gelato") || /\b(gelato|sorbet)\b/i.test(name)) subCat = "Gelato & Sorbet";
    return {
      category: "Ice Cream & Frozen Desserts",
      categorySlug: "ice-cream-frozen-desserts",
      mainCategory: "Ice Cream & Frozen Desserts",
      primary_category_id: "cat_ice_cream_frozen_desserts",
      subCategory: subCat
    };
  }

  // 2. Chocolates, Candy & Sweets
  if (
    oldCat.includes("chocolates & sweets") ||
    oldCat === "chocolates" ||
    sub.includes("chocolate") ||
    sub.includes("sweet") ||
    sub.includes("mithai") ||
    sub.includes("chikki") ||
    sub.includes("candy") ||
    /\b(chocolate|chocolates|barfi|burfi|peda|pedha|kaju katli|soan papdi|gulab jamun|rasgulla|chikki|gajak|toffee|toffees|fudge|gummy|gummies|mints|meetha paan|laddoo|laddu|mysore pak|gond pak|halwa|praline|couverture|candy|candies)\b/i.test(name)
  ) {
    let subCat = "Milk Chocolate";
    if (
      sub.includes("traditional") ||
      sub.includes("mithai") ||
      /\b(barfi|burfi|peda|pedha|kaju katli|soan papdi|gulab jamun|rasgulla|laddoo|laddu|mysore pak|gond pak|halwa)\b/i.test(name)
    ) {
      subCat = "Traditional Indian Sweets";
    } else if (/\b(chikki|gajak)\b/i.test(name) || sub.includes("chikki")) {
      subCat = "Chikki & Gajak";
    } else if (sub.includes("dark chocolate") || /\bdark\b/i.test(name)) {
      subCat = "Dark Chocolate";
    } else if (sub.includes("white chocolate") || /\bwhite\b/i.test(name)) {
      subCat = "White Chocolate";
    } else if (sub.includes("candy") || sub.includes("toffee") || sub.includes("mint") || /\b(mint|mints|paan|candy|toffee|toffees)\b/i.test(name)) {
      subCat = "Candies, Toffees & Mints";
    } else if (sub.includes("gummy") || /\b(gummy|gummies|jellies|jelly)\b/i.test(name)) {
      subCat = "Gummies & Jellies";
    }
    return {
      category: "Chocolates, Candy & Sweets",
      categorySlug: "chocolates-candy-sweets",
      mainCategory: "Chocolates, Candy & Sweets",
      primary_category_id: "cat_chocolates_candy_sweets",
      subCategory: subCat
    };
  }

  // 3. Protein Bars, Energy Bars & Wafers
  if (
    oldCat.includes("clean-label bars") ||
    sub.includes("protein bar") ||
    sub.includes("energy bar") ||
    sub.includes("protein wafer") ||
    /\b(protein bar|energy bar|granola bar|protein wafer|protein wafers|wafer bar)\b/i.test(name) ||
    (oldCat.includes("protein") && /\b(bar|bars|wafer|wafers)\b/i.test(name) && !/\b(salad|mango)\b/i.test(name))
  ) {
    let subCat = "Protein Bars";
    if (/\bwafer\b/i.test(name) || sub.includes("wafer")) subCat = "Protein Wafers";
    else if (/\b(energy|granola)\b/i.test(name) || sub.includes("energy")) subCat = "Energy & Granola Bars";
    else if (/\b(fruit|date|nut bar)\b/i.test(name)) subCat = "Fruit & Nut Bars";
    return {
      category: "Protein Bars, Energy Bars & Wafers",
      categorySlug: "protein-bars-energy-bars-wafers",
      mainCategory: "Protein Bars, Energy Bars & Wafers",
      primary_category_id: "cat_protein_bars_energy_bars_wafers",
      subCategory: subCat
    };
  }

  // 4. Plant-Based Foods & Meat Alternatives
  const plantMeatTerms = /\b(chaap|nugget|nuggets|chik\'?n|mock meat|plant-based meat|tempeh|tofu|keema|patty|patties|vegan burger|sausage|sausages|vegan seekh|vegan kebab)\b/i;
  if (
    (oldCat.includes("plant-based") || brand === "blue tribe" || brand === "vezlay") &&
    plantMeatTerms.test(name)
  ) {
    let subCat = "Plant-Based Patties & Burgers";
    if (/\b(sausage|kebab|seekh)\b/i.test(name)) subCat = "Plant-Based Sausages & Kebabs";
    else if (/\b(mince|keema|bhurji)\b/i.test(name)) subCat = "Plant-Based Mince & Keema";
    else if (/\b(tofu|tempeh|chaap)\b/i.test(name)) subCat = "Tofu & Tempeh Specialities";
    return {
      category: "Plant-Based Foods & Meat Alternatives",
      categorySlug: "plant-based-foods-meat-alternatives",
      mainCategory: "Plant-Based Foods & Meat Alternatives",
      primary_category_id: "cat_plant_based_foods_meat_alternatives",
      subCategory: subCat
    };
  }

  // 5. Cold Drinks & Beverages -> Beverages & Drink Mixes
  if (
    oldCat === "cold drinks" ||
    oldCat === "beverages & drinks" ||
    sub.includes("cold drinks") ||
    sub.includes("soda") ||
    sub.includes("juice") ||
    sub.includes("cola") ||
    sub.includes("iced tea") ||
    sub.includes("cold brew") ||
    sub.includes("energy drinks") ||
    /\b(soda|sodas|juice|juices|cola|colas|thums up|pepsi|coca-cola|coke|sprite|limca|fanta|mirinda|ginger ale|energy drink|iced tea|cold brew|coconut water|squash|syrup|kombucha)\b/i.test(name) ||
    (/\b(tea|coffee)\b/i.test(name) && !sub.includes("biscuit") && !name.includes("rusk") && !name.includes("cake"))
  ) {
    let subCat = "Cold Drinks";
    if (sub.includes("juice") || /\b(juice|nectar)\b/i.test(name)) subCat = "Fruit Juices & Nectars";
    else if (sub.includes("tea") || /\b(iced tea|cold brew|coffee)\b/i.test(name)) subCat = "Iced Teas & Cold Brews";
    else if (sub.includes("energy") || /\b(energy drink|red bull|monster)\b/i.test(name)) subCat = "Energy & Sports Drinks";
    else if (sub.includes("coconut") || /\bcoconut water\b/i.test(name)) subCat = "Coconut Water";
    else if (sub.includes("mix") || /\b(squash|syrup|concentrate)\b/i.test(name)) subCat = "Drink Mixes, Syrups & Squashes";
    else if (/\b(tea bag|instant coffee|chai)\b/i.test(name)) subCat = "Tea & Coffee";
    return {
      category: "Beverages & Drink Mixes",
      categorySlug: "beverages-drink-mixes",
      mainCategory: "Beverages & Drink Mixes",
      primary_category_id: "cat_beverages_drink_mixes",
      subCategory: subCat
    };
  }

  // 6. Makhana & Roasted Snacks
  if (
    /\b(makhana|foxnut|foxnuts|roasted chana|popped diet)\b/i.test(name) ||
    sub.includes("makhana") ||
    sub.includes("roasted chana") ||
    (name.includes("roasted") && /\b(jowar|bajra|multigrain|diet)\b/i.test(name))
  ) {
    let subCat = "Roasted Makhana";
    if (/\bchana\b/i.test(name)) subCat = "Roasted Chana";
    else if (/\bseeds\b/i.test(name)) subCat = "Roasted Seeds & Nuts Snacks";
    else if (/\bpopped\b/i.test(name)) subCat = "Popped Diet Snacks";
    else if (!name.includes("makhana")) subCat = "Roasted Multigrain Snacks";
    return {
      category: "Makhana & Roasted Snacks",
      categorySlug: "makhana-roasted-snacks",
      mainCategory: "Makhana & Roasted Snacks",
      primary_category_id: "cat_makhana_roasted_snacks",
      subCategory: subCat
    };
  }

  // 7. Oats & Porridge
  if (/\b(oats|oatmeal|porridge|dalia)\b/i.test(name) || sub.includes("oats") || sub.includes("porridge")) {
    let subCat = "Instant Oats";
    if (/\brolled\b/i.test(name)) subCat = "Rolled Oats";
    else if (/\bsteel\b/i.test(name)) subCat = "Steel-Cut Oats";
    else if (/\b(masala|veggie|curry)\b/i.test(name)) subCat = "Flavoured Masala Oats";
    else if (/\b(dalia|porridge)\b/i.test(name)) subCat = "Porridge & Dalia";
    return {
      category: "Oats & Porridge",
      categorySlug: "oats-porridge",
      mainCategory: "Oats & Porridge",
      primary_category_id: "cat_oats_porridge",
      subCategory: subCat
    };
  }

  // 8. Breakfast Cereals, Muesli & Granola
  if (
    oldCat.includes("cereals") ||
    sub.includes("cereal") ||
    sub.includes("muesli") ||
    sub.includes("granola") ||
    sub.includes("flakes") ||
    /\b(muesli|granola|corn flakes|chocos|froot loops|cereal|cereals)\b/i.test(name)
  ) {
    let subCat = "Corn Flakes & Flakes";
    if (sub.includes("kids") || /\b(chocos|loops|stars)\b/i.test(name)) subCat = "Kids' Cereals";
    else if (sub.includes("muesli") || /\bmuesli\b/i.test(name)) subCat = "Muesli";
    else if (sub.includes("granola") || /\bgranola\b/i.test(name)) subCat = "Granola";
    else if (sub.includes("bran") || /\bbran\b/i.test(name)) subCat = "Bran & Multigrain Cereals";
    return {
      category: "Breakfast Cereals, Muesli & Granola",
      categorySlug: "breakfast-cereals-muesli-granola",
      mainCategory: "Breakfast Cereals, Muesli & Granola",
      primary_category_id: "cat_breakfast_cereals_muesli_granola",
      subCategory: subCat
    };
  }

  // 9. Biscuits, Cookies & Crackers
  if (
    sub.includes("biscuit") ||
    sub.includes("cookie") ||
    sub.includes("cracker") ||
    sub.includes("rusk") ||
    /\b(biscuit|biscuits|cookie|cookies|cracker|crackers|rusk|rusks|digestive|bourbon|oreo|monaco|parle-g|good day|krackjack|hide & seek|50-50)\b/i.test(name)
  ) {
    let subCat = "Biscuits";
    if (/\b(cookie|cookies)\b/i.test(name) || sub === "cookies") {
      subCat = "Cookies";
    } else if (sub.includes("cracker") || /\b(cracker|crackers|salted biscuit|monaco|50-50|krackjack)\b/i.test(name)) {
      subCat = "Crackers";
    } else if (sub.includes("rusk") || /\brusk\b/i.test(name)) {
      subCat = "Rusks";
    } else {
      subCat = "Biscuits";
    }
    return {
      category: "Biscuits, Cookies & Crackers",
      categorySlug: "biscuits-cookies-crackers",
      mainCategory: "Biscuits, Cookies & Crackers",
      primary_category_id: "cat_biscuits_cookies_crackers",
      subCategory: subCat
    };
  }

  // 10. Bakery & Breads
  if (
    oldCat.includes("bakery") ||
    sub.includes("bread") ||
    sub.includes("cake") ||
    sub.includes("muffin") ||
    sub.includes("bun") ||
    sub.includes("pav") ||
    sub.includes("croissant") ||
    sub.includes("brownie") ||
    /\b(bread|breads|cake|cakes|muffin|muffins|bun|buns|pav|brownie|brownies|croissant|pizza base|pastry|cupcake)\b/i.test(name)
  ) {
    let subCat = "Breads & Pav";
    if (sub.includes("cake") || /\b(cake|pastry)\b/i.test(name)) subCat = "Cakes & Pastries";
    else if (sub.includes("muffin") || /\b(muffin|cupcake)\b/i.test(name)) subCat = "Muffins & Cupcakes";
    else if (sub.includes("brownie") || /\bbrownie\b/i.test(name)) subCat = "Brownies";
    else if (sub.includes("bun") || sub.includes("pav") || /\b(bun|pav|pizza base)\b/i.test(name)) subCat = "Buns & Pizza Bases";
    return {
      category: "Bakery & Breads",
      categorySlug: "bakery-breads",
      mainCategory: "Bakery & Breads",
      primary_category_id: "cat_bakery_breads",
      subCategory: subCat
    };
  }

  // 11. Noodles, Pasta & Vermicelli
  if (
    sub.includes("noodle") ||
    sub.includes("pasta") ||
    sub.includes("vermicelli") ||
    sub.includes("macaroni") ||
    sub.includes("ramen") ||
    /\b(noodle|noodles|pasta|vermicelli|macaroni|ramen|spaghetti|penne|fusilli|chowmein|hakka|maggi|yippee|top ramen)\b/i.test(name)
  ) {
    let subCat = "Instant Noodles";
    if (sub.includes("pasta") || /\b(pasta|macaroni|penne|fusilli|spaghetti)\b/i.test(name)) {
      subCat = "Pasta & Macaroni";
    } else if (sub.includes("vermicelli") || /\b(vermicelli|sewai)\b/i.test(name)) {
      subCat = "Vermicelli & Sewai";
    } else if (sub.includes("ramen") || /\bramen\b/i.test(name)) {
      subCat = "Ramen & Asian Noodles";
    } else if (/\b(millet noodle|hakka)\b/i.test(name)) {
      subCat = "Millet & Hakka Noodles";
    }
    return {
      category: "Noodles, Pasta & Vermicelli",
      categorySlug: "noodles-pasta-vermicelli",
      mainCategory: "Noodles, Pasta & Vermicelli",
      primary_category_id: "cat_noodles_pasta_vermicelli",
      subCategory: subCat
    };
  }

  // 12. Ready-to-Cook Mixes
  if (
    sub.includes("batter") ||
    (sub.includes("mix") && /\b(mix|batter|dosa|idli|pancake|gulab jamun mix|cake mix|dhokla mix|vada mix)\b/i.test(name)) ||
    /\b(dosa batter|idli batter|pancake mix|waffle mix|gulab jamun mix|cake mix|dhokla mix)\b/i.test(name)
  ) {
    let subCat = "Dosa & Idli Batters/Mixes";
    if (/\b(pancake|waffle)\b/i.test(name)) subCat = "Pancake & Waffle Mixes";
    else if (/\b(jamun|kheer|halwa mix|sweet mix)\b/i.test(name)) subCat = "Traditional Sweet Mixes";
    else if (/\b(cake|brownie mix)\b/i.test(name)) subCat = "Cake & Dessert Mixes";
    else subCat = "Meal & Batter Mixes";
    return {
      category: "Ready-to-Cook Mixes",
      categorySlug: "ready-to-cook-mixes",
      mainCategory: "Ready-to-Cook Mixes",
      primary_category_id: "cat_ready_to_cook_mixes",
      subCategory: subCat
    };
  }

  // 13. Ready-to-Eat Meals & Instant Foods
  if (
    oldCat.includes("ready-to-eat") ||
    sub.includes("instant meals") ||
    sub.includes("curry") ||
    sub.includes("soup") ||
    sub.includes("meal bowl") ||
    sub.includes("frozen snack") ||
    /\b(falafel|kebab|kebabs|packaged soup|soup|instant soup|ready to eat|dal makhani|rajma|chana masala|biryani|samosa|paratha|spring roll)\b/i.test(name) ||
    (/\b(poha|upma)\b/i.test(name) && oldCat.includes("ready"))
  ) {
    let subCat = "Instant Meals & Bowls";
    if (/\bsoup\b/i.test(name) || sub.includes("soup")) subCat = "Packaged Soups";
    else if (/\b(falafel|kebab|tikki|patty|nuggets|samosa|paratha)\b/i.test(name) || sub.includes("frozen")) subCat = "Frozen Snacks & Appetizers";
    else if (/\b(curry|dal|rajma|chana masala|biryani)\b/i.test(name)) subCat = "Ready-to-Eat Curries & Rice";
    else if (/\b(poha|upma)\b/i.test(name)) subCat = "Poha & Upma Ready Meals";
    return {
      category: "Ready-to-Eat Meals & Instant Foods",
      categorySlug: "ready-to-eat-meals-instant-foods",
      mainCategory: "Ready-to-Eat Meals & Instant Foods",
      primary_category_id: "cat_ready_to_eat_meals_instant_foods",
      subCategory: subCat
    };
  }

  // 14. Nut Butters, Spreads & Dips
  if (
    /\b(peanut butter|almond butter|nut butter|butter spread|jam|hummus|salsa|dip|dips)\b/i.test(name) ||
    sub.includes("peanut butter") ||
    sub.includes("nut butter") ||
    sub.includes("jam") ||
    sub.includes("hummus") ||
    sub.includes("dip") ||
    (/\bspread\b/i.test(name) && !oldCat.includes("snack") && !/\b(cheese|butter)\b/i.test(name))
  ) {
    let subCat = "Peanut Butter";
    if (/\b(almond|cashew butter)\b/i.test(name)) subCat = "Almond & Nut Butters";
    else if (/\b(chocolate|hazelnut|nutella)\b/i.test(name)) subCat = "Chocolate Spreads";
    else if (/\b(jam|marmalade|preserve)\b/i.test(name)) subCat = "Fruit Jams & Preserves";
    else if (/\b(hummus|dip|salsa)\b/i.test(name)) subCat = "Hummus & Savoury Dips";
    return {
      category: "Nut Butters, Spreads & Dips",
      categorySlug: "nut-butters-spreads-dips",
      mainCategory: "Nut Butters, Spreads & Dips",
      primary_category_id: "cat_nut_butters_spreads_dips",
      subCategory: subCat
    };
  }

  // 15. Sauces, Condiments & Seasonings
  if (
    oldCat.includes("condiments") ||
    sub.includes("ketchup") ||
    sub.includes("sauce") ||
    sub.includes("mayo") ||
    sub.includes("chutney") ||
    sub.includes("seasoning") ||
    sub.includes("spice") ||
    sub.includes("dressing") ||
    /\b(ketchup|hot sauce|mayonnaise|chutney|mustard|vinegar|seasoning|oregano|peri peri|schezwan|dressing|vinaigrette)\b/i.test(name) ||
    (/\bsauce\b/i.test(name) && !sub.includes("pasta"))
  ) {
    let subCat = "Tomato Ketchup & Sauces";
    if (/\b(hot sauce|chili sauce|sriracha|chutney|schezwan)\b/i.test(name)) subCat = "Hot Sauces & Chutneys";
    else if (/\b(dressing|vinaigrette)\b/i.test(name)) subCat = "Salad Dressings";
    else if (/\b(seasoning|herb|spice|masala)\b/i.test(name)) subCat = "Seasonings, Herbs & Spices";
    else if (/\b(vinegar|mustard)\b/i.test(name)) subCat = "Vinegars & Mustards";
    else if (/\b(paste|puree|cooking sauce)\b/i.test(name)) subCat = "Cooking Sauces & Pastes";
    return {
      category: "Sauces, Condiments & Seasonings",
      categorySlug: "sauces-condiments-seasonings",
      mainCategory: "Sauces, Condiments & Seasonings",
      primary_category_id: "cat_sauces_condiments_seasonings",
      subCategory: subCat
    };
  }

  // 16. Nuts, Seeds & Trail Mixes
  if (
    oldCat.includes("dry fruits") ||
    sub.includes("nuts") ||
    sub.includes("seeds") ||
    sub.includes("trail mix") ||
    sub.includes("almond") ||
    sub.includes("cashew") ||
    sub.includes("walnut") ||
    sub.includes("raisin") ||
    /\b(almonds|almond|cashews|cashew|walnuts|walnut|chia|flax|pumpkin seed|sunflower seed|trail mix|dry fruit|raisins|raisin|pistachio|anjeer|dates)\b/i.test(name)
  ) {
    let subCat = "Mixed Nuts";
    if (/\balmond\b/i.test(name)) subCat = "Almonds";
    else if (/\b(cashew|walnut|pistachio)\b/i.test(name)) subCat = "Cashews & Walnuts";
    else if (/\bseed\b/i.test(name) || sub.includes("seed")) subCat = "Raw & Roasted Seeds";
    else if (/\btrail mix\b/i.test(name) || sub.includes("trail mix")) subCat = "Trail Mixes";
    else if (/\b(raisin|dates|anjeer|dry fruit)\b/i.test(name)) subCat = "Dry Fruits & Raisins";
    return {
      category: "Nuts, Seeds & Trail Mixes",
      categorySlug: "nuts-seeds-trail-mixes",
      mainCategory: "Nuts, Seeds & Trail Mixes",
      primary_category_id: "cat_nuts_seeds_trail_mixes",
      subCategory: subCat
    };
  }

  // 17. Dairy, Yogurt & Dairy Alternatives
  if (
    oldCat.includes("dairy") ||
    sub.includes("milk") ||
    sub.includes("yogurt") ||
    sub.includes("curd") ||
    sub.includes("paneer") ||
    sub.includes("cheese") ||
    sub.includes("ghee") ||
    sub.includes("butter") ||
    /\b(milk|yogurt|curd|dahi|paneer|cheese|ghee)\b/i.test(name) ||
    (/\bbutter\b/i.test(name) && !/\b(peanut|cookie)\b/i.test(name))
  ) {
    let subCat = "Milk & Fortified Milk";
    if (/\bgreek yogurt\b/i.test(name)) subCat = "Greek Yogurt";
    else if (/\b(yogurt|curd|dahi)\b/i.test(name)) subCat = "Curd & Yogurt";
    else if (/\bpaneer\b/i.test(name)) subCat = "Paneer & Tofu";
    else if (/\b(cheese|butter)\b/i.test(name) && !/\bghee\b/i.test(name)) subCat = "Cheese & Butter";
    else if (/\bghee\b/i.test(name)) subCat = "Ghee";
    else if (/\b(almond milk|oat milk|soy milk|coconut milk)\b/i.test(name)) subCat = "Plant-Based Milks";
    return {
      category: "Dairy, Yogurt & Dairy Alternatives",
      categorySlug: "dairy-yogurt-dairy-alternatives",
      mainCategory: "Dairy, Yogurt & Dairy Alternatives",
      primary_category_id: "cat_dairy_yogurt_dairy_alternatives",
      subCategory: subCat
    };
  }

  // 18. Rice, Grains, Pulses & Flours
  if (
    oldCat.includes("pantry") ||
    sub.includes("atta") ||
    sub.includes("rice") ||
    sub.includes("dal") ||
    sub.includes("pulse") ||
    sub.includes("flour") ||
    sub.includes("grain") ||
    sub.includes("millet") ||
    /\b(atta|rice|basmati|dal|besan|flour|quinoa|millet|suji|maida)\b/i.test(name) ||
    (/\bpoha\b/i.test(name) && !oldCat.includes("ready"))
  ) {
    let subCat = "Atta & Flours";
    if (/\b(rice|basmati)\b/i.test(name)) subCat = "Rice & Basmati";
    else if (/\b(millet|ragi|jowar|bajra)\b/i.test(name)) subCat = "Millets & Ancient Grains";
    else if (/\b(dal|pulse|chana|moong|rajma)\b/i.test(name)) subCat = "Pulses & Dals";
    else if (/\bpoha\b/i.test(name)) subCat = "Poha & Flattened Rice";
    return {
      category: "Rice, Grains, Pulses & Flours",
      categorySlug: "rice-grains-pulses-flours",
      mainCategory: "Rice, Grains, Pulses & Flours",
      primary_category_id: "cat_rice_grains_pulses_flours",
      subCategory: subCat
    };
  }

  // 19. Chips, Namkeen & Savoury Snacks (Default snacks fallback)
  let subCat = "Chips";
  if (sub.includes("banana chip") || /\b(banana chip|banana chips|tapioca chip|tapioca chips)\b/i.test(name)) subCat = "Banana Chips";
  else if (sub === "chips" || sub.includes("potato chip") || /\b(potato chip|potato chips|chips|nacho|nachos|tortilla)\b/i.test(name)) subCat = "Chips";
  else if (sub.includes("puff") || /\b(puff|puffs|stix|extruded)\b/i.test(name)) subCat = "Extruded Snacks & Puffs";
  else if (sub.includes("mixture") || sub.includes("namkeen") || /\b(mixture|namkeen|bhujia|sev|gathiya)\b/i.test(name)) subCat = "Mixture & Namkeen";
  else if (sub.includes("papad") || /\b(papad|fryum)\b/i.test(name)) subCat = "Papad & Fryums";
  else subCat = "Chips";

  return {
    category: "Chips, Namkeen & Savoury Snacks",
    categorySlug: "chips-namkeen-savoury-snacks",
    mainCategory: "Chips, Namkeen & Savoury Snacks",
    primary_category_id: "cat_chips_namkeen_savoury_snacks",
    subCategory: subCat
  };
}

async function run() {
  console.log("=== FOODDECODE 19-CATEGORY MASTER RECLASSIFIER & AUDITOR ===");

  const seedPath = path.resolve("src/lib/seed-data.ts");
  console.log("Loading seed data from:", seedPath);

  const { SEED_PRODUCTS } = await import("../src/lib/seed-data");
  console.log(`Loaded ${SEED_PRODUCTS.length} seed products.`);

  const auditLog: Array<{
    barcode: string;
    name: string;
    brand: string;
    oldCategory: string;
    newCategory: string;
    oldSubCategory: string;
    newSubCategory: string;
  }> = [];

  let reclassifiedCount = 0;
  let retainedCount = 0;
  const newDistribution: Record<string, number> = {};

  const updatedProducts = SEED_PRODUCTS.map((p: any) => {
    const classification = classifyProduct(p);

    const wasReclassified =
      p.category !== classification.category ||
      p.categorySlug !== classification.categorySlug ||
      p.subCategory !== classification.subCategory;

    if (wasReclassified) {
      reclassifiedCount++;
      auditLog.push({
        barcode: p.barcode,
        name: p.name,
        brand: p.brand,
        oldCategory: p.category,
        newCategory: classification.category,
        oldSubCategory: p.subCategory || "None",
        newSubCategory: classification.subCategory
      });
    } else {
      retainedCount++;
    }

    newDistribution[classification.category] = (newDistribution[classification.category] || 0) + 1;

    return {
      ...p,
      category: classification.category,
      categorySlug: classification.categorySlug,
      mainCategory: classification.mainCategory,
      primary_category_id: classification.primary_category_id,
      subCategory: classification.subCategory
    };
  });

  console.log(`Audit Summary:`);
  console.log(`- Total Audited: ${updatedProducts.length}`);
  console.log(`- Products Reclassified: ${reclassifiedCount}`);
  console.log(`- Products Retained: ${retainedCount}`);
  console.log("\nNew Category Distribution (19 Categories):");
  for (const cat of CANONICAL_19_CATEGORIES) {
    console.log(`- ${cat.name.padEnd(42)}: ${newDistribution[cat.name] || 0} products`);
  }

  // Update src/lib/seed-data.ts
  console.log("\nUpdating src/lib/seed-data.ts via exact slicing...");
  let seedFileContent = fs.readFileSync(seedPath, "utf8");

  // 1. Replace SEED_CATEGORIES
  const catStart = seedFileContent.indexOf("export const SEED_CATEGORIES: CategoryRecord[] = [");
  if (catStart === -1) {
    throw new Error("Could not find SEED_CATEGORIES start in seed-data.ts");
  }
  const catEnd = seedFileContent.indexOf("];", catStart) + 2;
  const seedCategoriesExport = `export const SEED_CATEGORIES: CategoryRecord[] = ${JSON.stringify(
    CANONICAL_19_CATEGORIES,
    null,
    2
  )};`;
  seedFileContent = seedFileContent.slice(0, catStart) + seedCategoriesExport + seedFileContent.slice(catEnd);

  // 2. Replace SEED_PRODUCTS
  const prodStart = seedFileContent.indexOf("export const SEED_PRODUCTS: any[] = [");
  if (prodStart === -1) {
    throw new Error("Could not find SEED_PRODUCTS start in seed-data.ts");
  }
  const prodEnd = seedFileContent.indexOf("export function generateSeedProducts(): ProductItem[] {", prodStart);
  if (prodEnd === -1) {
    throw new Error("Could not find generateSeedProducts in seed-data.ts");
  }
  const seedProductsExport = `export const SEED_PRODUCTS: any[] = ${JSON.stringify(
    updatedProducts,
    null,
    2
  )};\n\n`;

  seedFileContent = seedFileContent.slice(0, prodStart) + seedProductsExport + seedFileContent.slice(prodEnd);

  fs.writeFileSync(seedPath, seedFileContent, "utf8");
  console.log("Successfully wrote updated seed data to src/lib/seed-data.ts!");

  // Save audit log to JSON
  const auditPath = path.resolve("scripts/category_audit_report.json");
  fs.writeFileSync(
    auditPath,
    JSON.stringify(
      {
        totalAudited: updatedProducts.length,
        reclassifiedCount,
        retainedCount,
        categoryDistribution: newDistribution,
        auditLog: auditLog.slice(0, 1000)
      },
      null,
      2
    ),
    "utf8"
  );
  console.log("Saved audit report to scripts/category_audit_report.json");

  // 3. Update MongoDB Atlas if MONGODB_URI is available
  if (process.env.MONGODB_URI) {
    console.log("\nConnecting to MongoDB Atlas fooddecode database...");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("fooddecode");

    // Upsert categories
    console.log("Updating categories collection in MongoDB Atlas...");
    await db.collection("categories").deleteMany({});
    await db.collection("categories").insertMany(CANONICAL_19_CATEGORIES as any);
    console.log(`Inserted ${CANONICAL_19_CATEGORIES.length} canonical categories into MongoDB.`);

    // Bulk update products
    console.log("Updating products collection in MongoDB Atlas...");
    const bulkOps = updatedProducts.map((p) => ({
      updateOne: {
        filter: { barcode: p.barcode },
        update: {
          $set: {
            category: p.category,
            categorySlug: p.categorySlug,
            mainCategory: p.mainCategory,
            primary_category_id: p.primary_category_id,
            subCategory: p.subCategory,
            updatedAt: new Date().toISOString()
          }
        }
      }
    }));

    for (let i = 0; i < bulkOps.length; i += 1000) {
      const batch = bulkOps.slice(i, i + 1000);
      const res = await db.collection("products").bulkWrite(batch);
      console.log(`Batch ${Math.floor(i / 1000) + 1}: modified ${res.modifiedCount} products`);
    }

    // Update category productCount
    for (const cat of CANONICAL_19_CATEGORIES) {
      const count = await db.collection("products").countDocuments({ category: cat.name });
      await db.collection("categories").updateOne({ _id: cat._id as any }, { $set: { productCount: count } });
    }

    console.log("MongoDB Atlas updated successfully!");
    await client.close();
  }

  console.log("\nMaster migration completed successfully!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
