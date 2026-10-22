import { IngredientMatchResult, RiskLevel, IngredientRecord } from "@/types";

interface KnownIngredientDefinition {
  normalized: string;
  aliases: string[];
  riskLevel: RiskLevel;
  category: string;
  description: string;
  healthConcerns: string[];
  isPalmOil?: boolean;
  isAddedSugar?: boolean;
  isAllergen?: boolean;
  allergenType?: string;
  regulatoryStatus: string;
}

export const KNOWN_INGREDIENTS: KnownIngredientDefinition[] = [
  // Harmful / Avoid Additives & Preservatives
  {
    normalized: "titanium dioxide",
    aliases: ["e171", "ci 77891", "food grade titanium dioxide"],
    riskLevel: "avoid",
    category: "color",
    description: "White pigment used to brighten foods. Contains nanoparticles that can accumulate in organs.",
    healthConcerns: ["Genotoxicity concern", "Banned as food additive in European Union (2022)"],
    regulatoryStatus: "Banned in EU; Permitted in USA (FDA)",
  },
  {
    normalized: "potassium bromate",
    aliases: ["e924", "bromated flour"],
    riskLevel: "avoid",
    category: "additive",
    description: "Oxidizing dough conditioner used in bread making.",
    healthConcerns: ["Classified as possible human carcinogen by IARC", "Kidney damage"],
    regulatoryStatus: "Banned in EU, UK, Canada, Brazil; Permitted in USA",
  },
  {
    normalized: "butylated hydroxyanisole",
    aliases: ["bha", "e320"],
    riskLevel: "avoid",
    category: "preservative",
    description: "Synthetic antioxidant used to prevent fats from going rancid.",
    healthConcerns: ["Reasonably anticipated to be a human carcinogen (NTP)", "Endocrine disruption"],
    regulatoryStatus: "Restricted in EU; Permitted in USA",
  },
  {
    normalized: "butylated hydroxytoluene",
    aliases: ["bht", "e321"],
    riskLevel: "caution",
    category: "preservative",
    description: "Synthetic antioxidant chemically related to BHA.",
    healthConcerns: ["Possible endocrine disruption", "Potential hyperactivity in children"],
    regulatoryStatus: "Restricted in EU; Permitted in USA",
  },
  {
    normalized: "sodium nitrite",
    aliases: ["e250", "sodium nitrate", "e251"],
    riskLevel: "caution",
    category: "preservative",
    description: "Curing agent used in bacon, hot dogs, and processed meats.",
    healthConcerns: ["Forms carcinogenic nitrosamines when cooked at high heat"],
    regulatoryStatus: "Strictly limited in EU and USA",
  },
  {
    normalized: "propylparaben",
    aliases: ["e216", "propyl p-hydroxybenzoate"],
    riskLevel: "avoid",
    category: "preservative",
    description: "Preservative used in tortillas, baked goods, and cosmetics.",
    healthConcerns: ["Endocrine disruptor affecting estrogen signaling and male fertility"],
    regulatoryStatus: "Banned from food in EU; Permitted in USA",
  },
  {
    normalized: "red 40",
    aliases: ["allura red ac", "e129", "fd&c red no. 40"],
    riskLevel: "caution",
    category: "color",
    description: "Petroleum-derived synthetic azo dye.",
    healthConcerns: ["Linked to hyperactivity in children", "EU warning label required"],
    regulatoryStatus: "Warning required in EU; Permitted in USA",
  },
  {
    normalized: "yellow 5",
    aliases: ["tartrazine", "e102", "fd&c yellow no. 5"],
    riskLevel: "caution",
    category: "color",
    description: "Synthetic yellow azo dye.",
    healthConcerns: ["Hyperactivity in sensitive children", "Allergic hives in aspirin-sensitive individuals"],
    regulatoryStatus: "Warning required in EU; Permitted in USA",
  },
  {
    normalized: "yellow 6",
    aliases: ["sunset yellow fcf", "e110", "fd&c yellow no. 6"],
    riskLevel: "caution",
    category: "color",
    description: "Synthetic petroleum dye.",
    healthConcerns: ["Behavioral issues in children", "Potential allergenicity"],
    regulatoryStatus: "Warning required in EU; Permitted in USA",
  },
  {
    normalized: "partially hydrogenated oil",
    aliases: ["partially hydrogenated soybean oil", "partially hydrogenated cottonseed oil", "trans fat"],
    riskLevel: "avoid",
    category: "fat_oil",
    description: "Industrial trans fats created by adding hydrogen to vegetable oil.",
    healthConcerns: ["Significantly increases LDL bad cholesterol", "Dramatically increases cardiovascular disease risk"],
    regulatoryStatus: "Banned from food supply in USA & EU",
  },

  // Palm Oil
  {
    normalized: "palm oil",
    aliases: ["fractionated palm oil", "palm kernel oil", "palmate", "sodium palmate", "elaeis guineensis oil", "palmitate"],
    riskLevel: "caution",
    category: "fat_oil",
    description: "High saturated fat vegetable oil. Major ecological driver of tropical deforestation.",
    healthConcerns: ["50% saturated palmitic acid", "Environmental and biodiversity impact"],
    isPalmOil: true,
    regulatoryStatus: "Permitted globally with labeling requirements",
  },

  // Added Sugars & High-Fructose Corn Syrup
  {
    normalized: "high fructose corn syrup",
    aliases: ["hfcs", "glucose-fructose syrup", "corn syrup", "isoglucose", "hfcs-55"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Liquid sweetener made from corn starch with concentrated fructose.",
    healthConcerns: ["Linked to non-alcoholic fatty liver disease", "Metabolic syndrome", "Obesity and insulin resistance"],
    isAddedSugar: true,
    regulatoryStatus: "Permitted globally",
  },
  {
    normalized: "cane sugar",
    aliases: ["sugar", "sucrose", "beet sugar", "brown sugar", "dextrose", "maltodextrin", "invert sugar", "fructose", "corn syrup solids", "evaporated cane juice"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Refined caloric simple carbohydrate.",
    healthConcerns: ["Dental caries", "High glycemic spike", "Inflammation when consumed in excess"],
    isAddedSugar: true,
    regulatoryStatus: "Permitted globally",
  },

  // Artificial / Non-Sugar Sweeteners
  {
    normalized: "aspartame",
    aliases: ["e951", "nutrasweet", "equal"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Intense artificial sweetener 200x sweeter than sucrose.",
    healthConcerns: ["Classified as possibly carcinogenic (Group 2B) by WHO IARC in 2023", "Must be avoided by people with PKU"],
    regulatoryStatus: "Permitted with daily intake limit (ADI: 40mg/kg)",
  },
  {
    normalized: "sucralose",
    aliases: ["e955", "splenda"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Chlorinated sugar molecule derivative that passes unabsorbed.",
    healthConcerns: ["May alter gut microbiome diversity", "Forms chloropropanols if heated to high cooking temperatures"],
    regulatoryStatus: "Permitted globally",
  },
  {
    normalized: "acesulfame potassium",
    aliases: ["acesulfame k", "ace-k", "e950"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Zero-calorie sweetener often blended with sucralose or aspartame.",
    healthConcerns: ["Contains methylene chloride derivative in synthesis", "Controversial animal toxicity studies"],
    regulatoryStatus: "Permitted globally",
  },

  // Common Allergens
  {
    normalized: "milk",
    aliases: ["whey", "casein", "sodium caseinate", "milkfat", "nonfat milk", "skim milk", "lactose", "butter"],
    riskLevel: "safe",
    category: "protein",
    description: "Bovine dairy products and milk protein fractions.",
    healthConcerns: ["Major allergen (dairy allergy)", "Lactose intolerance"],
    isAllergen: true,
    allergenType: "Milk / Dairy",
    regulatoryStatus: "Major food allergen requiring mandatory bold disclosure",
  },
  {
    normalized: "wheat",
    aliases: ["wheat flour", "durum wheat", "semolina", "gluten", "vital wheat gluten", "spelt"],
    riskLevel: "safe",
    category: "grain",
    description: "Cereal grain containing gluten protein.",
    healthConcerns: ["Celiac disease trigger", "Wheat allergy", "Gluten sensitivity"],
    isAllergen: true,
    allergenType: "Wheat / Gluten",
    regulatoryStatus: "Major food allergen requiring mandatory disclosure",
  },
  {
    normalized: "soybeans",
    aliases: ["soy", "soy lecithin", "isolated soy protein", "soybean oil", "soya"],
    riskLevel: "safe",
    category: "grain",
    description: "Legume widely used for oil, protein, and emulsifiers.",
    healthConcerns: ["Major allergen", "Often genetically modified"],
    isAllergen: true,
    allergenType: "Soy",
    regulatoryStatus: "Major food allergen requiring mandatory disclosure",
  },
  {
    normalized: "peanuts",
    aliases: ["peanut oil", "peanut butter", "groundnuts"],
    riskLevel: "safe",
    category: "protein",
    description: "Legume seed causing severe IgE-mediated anaphylactic reactions in sensitive individuals.",
    healthConcerns: ["Severe anaphylaxis risk in allergic individuals"],
    isAllergen: true,
    allergenType: "Peanuts",
    regulatoryStatus: "Major food allergen requiring mandatory disclosure",
  },
  {
    normalized: "almonds",
    aliases: ["walnuts", "cashews", "pecans", "hazelnuts", "pistachios", "tree nuts", "brazil nuts", "macadamia"],
    riskLevel: "safe",
    category: "protein",
    description: "Tree nuts associated with severe allergic reactions.",
    healthConcerns: ["Potentially life-threatening allergic reactions"],
    isAllergen: true,
    allergenType: "Tree Nuts",
    regulatoryStatus: "Major food allergen requiring mandatory disclosure",
  },

  // Safe / Wholesome Ingredients
  {
    normalized: "whole oats",
    aliases: ["rolled oats", "oat flour", "whole grain oats"],
    riskLevel: "safe",
    category: "grain",
    description: "Nutritious whole grain rich in soluble beta-glucan fiber.",
    healthConcerns: ["Aids in lowering LDL cholesterol and stabilizing blood glucose"],
    regulatoryStatus: "FDA authorized cardiovascular health claim",
  },
  {
    normalized: "extra virgin olive oil",
    aliases: ["olive oil", "evoo"],
    riskLevel: "safe",
    category: "fat_oil",
    description: "Cold-pressed monounsaturated oil rich in polyphenols and oleic acid.",
    healthConcerns: ["Cardioprotective", "Anti-inflammatory antioxidants"],
    regulatoryStatus: "Heart healthy food",
  },
  {
    normalized: "sea salt",
    aliases: ["salt", "sodium chloride"],
    riskLevel: "safe",
    category: "general",
    description: "Essential mineral for electrolyte balance and nerve transmission.",
    healthConcerns: ["Excessive intake increases risk of hypertension and stroke"],
    regulatoryStatus: "Dietary sodium limit recommended <2,300mg/day",
  },
];

/**
 * Clean and normalize individual ingredient text
 */
export function cleanIngredientString(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\[.*?\]|\(.*?\)/g, " ") // remove parenthesis contents like (preservative)
    .replace(/[0-9]+(\.[0-9]+)?%/g, "") // remove percentages
    .replace(/[*#†_]/g, "") // remove footnote asterisks
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split ingredient text by commas and semicolons while respecting nested parenthesis
 */
export function parseIngredientList(ingredientsText: string): string[] {
  if (!ingredientsText || typeof ingredientsText !== "string") return [];
  
  const tokens: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < ingredientsText.length; i++) {
    const char = ingredientsText[i];
    if (char === "(" || char === "[" || char === "{") parenDepth++;
    if (char === ")" || char === "]" || char === "}") parenDepth = Math.max(0, parenDepth - 1);

    if ((char === "," || char === ";" || char === "•") && parenDepth === 0) {
      if (current.trim()) tokens.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) tokens.push(current.trim());

  return tokens.filter((t) => t.length > 1);
}

/**
 * Match a raw ingredient token against known definitions and custom database records
 */
export function matchSingleIngredient(
  rawToken: string,
  customDbIngredients: IngredientRecord[] = []
): IngredientMatchResult {
  const cleaned = cleanIngredientString(rawToken);

  // 1. Check custom DB records first
  for (const item of customDbIngredients) {
    const targetNorm = item.normalizedName.toLowerCase();
    if (cleaned === targetNorm || cleaned.includes(targetNorm) || item.aliases?.some((a) => cleaned.includes(a.toLowerCase()))) {
      return {
        raw: rawToken,
        normalized: item.name,
        riskLevel: item.riskLevel,
        category: item.category,
        description: item.description,
        healthConcerns: item.healthConcerns,
        isPalmOil: item.isPalmOil,
        isAddedSugar: item.isAddedSugar,
        isAllergen: item.isAllergen,
        allergenType: item.allergenType,
        regulatoryStatus: item.regulatoryStatus,
      };
    }
  }

  // 2. Check built-in definitions
  for (const def of KNOWN_INGREDIENTS) {
    if (cleaned === def.normalized || cleaned.includes(def.normalized) || def.aliases.some((alias) => cleaned.includes(alias.toLowerCase()))) {
      return {
        raw: rawToken,
        normalized: def.normalized,
        riskLevel: def.riskLevel,
        category: def.category,
        description: def.description,
        healthConcerns: def.healthConcerns,
        isPalmOil: def.isPalmOil,
        isAddedSugar: def.isAddedSugar,
        isAllergen: def.isAllergen,
        allergenType: def.allergenType,
        regulatoryStatus: def.regulatoryStatus,
      };
    }
  }

  // 3. Fallback heuristic matching for additives & numbers (e.g. "E211", "artificial flavor")
  const eNumberMatch = cleaned.match(/\be[0-9]{3,4}[a-z]?\b/i);
  if (eNumberMatch) {
    return {
      raw: rawToken,
      normalized: eNumberMatch[0].toUpperCase(),
      riskLevel: "caution",
      category: "additive",
      description: `Identified food additive code (${eNumberMatch[0].toUpperCase()}).`,
      healthConcerns: ["Processed synthetic or chemical additive"],
      regulatoryStatus: "Regulated food additive",
    };
  }

  if (cleaned.includes("flavor") || cleaned.includes("flavour") || cleaned.includes("aroma")) {
    const isNatural = cleaned.includes("natural");
    return {
      raw: rawToken,
      normalized: isNatural ? "natural flavor" : "artificial flavor",
      riskLevel: isNatural ? "safe" : "caution",
      category: "additive",
      description: isNatural
        ? "Flavoring compounds derived from natural food sources."
        : "Synthetically compounded aroma chemicals designed to replicate taste.",
      healthConcerns: isNatural ? [] : ["Ultra-processed food marker; encourages overeating"],
      regulatoryStatus: "FDA GRAS",
    };
  }

  // Default wholesome/safe fallback
  return {
    raw: rawToken,
    normalized: cleaned || rawToken,
    riskLevel: "safe",
    category: "general",
    description: "Standard food ingredient.",
    regulatoryStatus: "General food use",
  };
}

/**
 * Process entire ingredients string into comprehensive match list with summary flags
 */
export function analyzeIngredientsText(
  ingredientsText: string,
  customDbIngredients: IngredientRecord[] = []
): {
  ingredientsList: IngredientMatchResult[];
  hasPalmOil: boolean;
  hasAddedSugar: boolean;
  hasArtificialAdditives: boolean;
  allergens: string[];
  ingredientAlerts: string[];
} {
  const tokens = parseIngredientList(ingredientsText);
  const matched = tokens.map((t) => matchSingleIngredient(t, customDbIngredients));

  let hasPalmOil = false;
  let hasAddedSugar = false;
  let hasArtificialAdditives = false;
  const allergens = new Set<string>();
  const alerts: string[] = [];

  for (const item of matched) {
    if (item.isPalmOil) {
      hasPalmOil = true;
      alerts.push("Contains Palm Oil (High Palmitic Sat Fat & Deforestation Risk)");
    }
    if (item.isAddedSugar) {
      hasAddedSugar = true;
    }
    if (item.riskLevel === "avoid" || item.riskLevel === "caution") {
      hasArtificialAdditives = true;
      if (item.riskLevel === "avoid") {
        alerts.push(`High Hazard Additive: ${item.normalized} (${item.regulatoryStatus || "Caution"})`);
      }
    }
    if (item.isAllergen && item.allergenType) {
      allergens.add(item.allergenType);
    }
  }

  if (hasAddedSugar) {
    alerts.push("Contains Added Caloric Sugars / Syrups");
  }

  return {
    ingredientsList: matched,
    hasPalmOil,
    hasAddedSugar,
    hasArtificialAdditives,
    allergens: Array.from(allergens),
    ingredientAlerts: Array.from(new Set(alerts)),
  };
}
