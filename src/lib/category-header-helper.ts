export function getCategoryHeaderInfo(
  category?: string,
  subCategory?: string,
  totalCount?: number
): { title: string; description: string } {
  const catParam = (category || "").toLowerCase();
  const subParam = (subCategory || "").toLowerCase();

  const isNoodlesReadyToEat =
    catParam === "noodles-ready-to-eat" ||
    catParam === "noodles & ready-to-eat" ||
    catParam === "noodles, pasta & vermicelli" ||
    catParam.includes("noodle") ||
    catParam.includes("pasta") ||
    subParam.includes("noodle") ||
    subParam.includes("pasta") ||
    subParam.includes("ramyun");

  const isColdDrinks =
    catParam === "cold-drinks" ||
    catParam === "cold drinks";

  const isChips =
    catParam === "chips" ||
    catParam.includes("chips") ||
    catParam.includes("savoury") ||
    catParam.includes("namkeen") ||
    subParam === "chips";

  const isIceCream =
    catParam === "ice-cream" ||
    catParam === "ice cream" ||
    catParam.includes("ice cream") ||
    catParam.includes("frozen");

  const isReadyToEat =
    catParam.includes("ready-to-eat") ||
    catParam.includes("ready-to-cook");

  const isProtein =
    catParam.includes("protein") ||
    catParam.includes("energy bars");

  const isPlantBased =
    catParam.includes("plant-based");

  const isBakery =
    catParam.includes("bakery") ||
    catParam.includes("breads");

  const isSpreads =
    catParam.includes("spreads") ||
    catParam.includes("nut butters") ||
    catParam.includes("dips");

  const isChocolates =
    catParam.includes("chocolate") ||
    catParam.includes("sweets") ||
    catParam.includes("candy");

  const isBeverages =
    catParam.includes("beverage") ||
    catParam.includes("drink");

  const isHealthyBars =
    catParam.includes("clean-label bars");

  const isDryFruits =
    catParam.includes("dry fruits") ||
    catParam.includes("nuts, seeds");

  const isWholesomeBreakfast =
    catParam.includes("breakfast") ||
    catParam.includes("muesli") ||
    catParam.includes("oats");

  const isBakedChipsMakhana =
    catParam.includes("makhana");

  const isBiscuits =
    catParam.includes("biscuit") ||
    catParam.includes("cookies") ||
    catParam.includes("crackers");

  const title = subCategory
    ? subCategory
    : isNoodlesReadyToEat
    ? "Explore Noodles & Ready-to-Eat"
    : isHealthyBars
    ? "Explore Protein & Clean-Label Bars / Wafers"
    : isDryFruits
    ? "Explore Dry Fruits, Nuts, Seeds & Trail Mixes"
    : isWholesomeBreakfast
    ? "Explore Wholesome Breakfast, Oats & Nut Butters"
    : isBakedChipsMakhana
    ? "Explore Makhana & Roasted Snacks"
    : isColdDrinks
    ? "Explore Cold Drinks"
    : isChips
    ? "Explore Chips, Namkeen & Savoury Snacks"
    : isBiscuits
    ? "Explore Biscuits, Cookies & Crackers"
    : isIceCream
    ? "Explore Ice Cream & Frozen Desserts"
    : isReadyToEat
    ? "Explore Ready-to-Eat & Ready-to-Cook"
    : isProtein
    ? "Explore Protein Foods & Snacks"
    : isPlantBased
    ? "Explore Plant-Based Foods"
    : isBakery
    ? "Explore Bakery & Breads"
    : isSpreads
    ? "Explore Spreads, Dips & Sauces"
    : isChocolates
    ? "Explore Chocolates, Candy & Sweets"
    : isBeverages
    ? "Explore Beverages & Drinks"
    : category && category !== "All"
    ? `Explore ${category}`
    : "Explore Food Products";

  const countStr = totalCount !== undefined ? `${totalCount.toLocaleString()} ` : "";

  const description = isNoodlesReadyToEat
    ? `Compare instant noodles, air-dried ramyun, MSG, palm oil, sodium levels, heat & eat curries, and breakfast mixes across ${countStr}products.`
    : isHealthyBars
    ? `Compare clean protein sources, whey isolate, date-sweetened recipes, and zero-chemical formulations across ${countStr}verified protein bars and wafers.`
    : isDryFruits
    ? `Inspect raw versus dry-roasted nuts, antioxidant seeds, omega-3 blends, and unpreserved dried fruits across ${countStr}pantry staples.`
    : isWholesomeBreakfast
    ? `Compare rolled oats, steel-cut oats, fiber-rich muesli, granola, and stone-ground nut butters across ${countStr}nutritious breakfast options.`
    : isBakedChipsMakhana
    ? `Explore roasted fox nuts, baked jowar puffs, roasted seeds, and palm-oil-free unjunked Indian namkeen across ${countStr}guilt-free snacks.`
    : isColdDrinks
    ? `Compare ingredients, sugar content, additives, nutritional facts, and ultra-processing levels across ${countStr}cold drinks.`
    : isChips
    ? `Compare ingredients, palm oil status, sodium levels, and processing across ${countStr}potato chips, bhujia, tortilla chips and savoury snacks.`
    : isBiscuits
    ? `Compare digestive biscuits, cookies, cream biscuits, crackers, sodium and palm oil content across ${countStr}verified products.`
    : isIceCream
    ? `Compare ingredients, dairy fat, sugar content, additives, Nutri-Score, and ultra-processing levels across ${countStr}verified ice creams & frozen desserts.`
    : isReadyToEat
    ? `Compare ingredients, sodium, additives, and nutritional facts across ${countStr}instant meals, curries, poha, cup noodles, parathas, mixes and soups.`
    : isProtein
    ? `Compare protein sources, BCAAs, sugars, sweeteners, and processing levels across ${countStr}verified protein bars, cookies, chips, shakes, cereals and peanut butters.`
    : isPlantBased
    ? `Compare plant milks, fortification (B12, D, Calcium), vegan yogurts, dairy-free ice creams, and plant-based spreads across ${countStr}products.`
    : isBakery
    ? `Inspect whole wheat percentage, refined maida status, preservatives, and nutritional profiles across ${countStr}breads, sourdough, buns, wraps and bakery goods.`
    : isSpreads
    ? `Compare healthy fats, palm oil status, added sugars, and sodium levels across ${countStr}peanut butters, almond butters, hummus, mayonnaise, cheese spreads, salsas and chutneys.`
    : isChocolates
    ? `Compare cocoa solids, sugar content, palm oil status, additives, and nutritional facts across ${countStr}dark chocolates, truffles, Indian sweets, chikki and confections.`
    : isBeverages
    ? `Compare real fruit juice percentage, added sugar, artificial sweeteners, and nutrition across ${countStr}juices, sparkling waters, plant drinks, iced teas and cold brews.`
    : `Instant directory of ${countStr}packaged food products with ingredient safety, Nutri-Score, and NOVA ratings.`;

  return { title, description };
}
