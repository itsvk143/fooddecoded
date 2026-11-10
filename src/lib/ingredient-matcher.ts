import { IngredientMatchResult, RiskLevel, IngredientRecord } from "@/types";
import { resolveIngredientIntelligence } from "./ingredient-service";

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
    aliases: ["fractionated palm oil", "palm kernel oil", "palmate", "sodium palmate", "elaeis guineensis oil", "palmitate", "palmolein", "refined palmolein", "refined palm oil", "palm olein"],
    riskLevel: "caution",
    category: "fat_oil",
    description: "High saturated fat vegetable oil. Major ecological driver of tropical deforestation.",
    healthConcerns: ["50% saturated palmitic acid", "Environmental and biodiversity impact"],
    isPalmOil: true,
    regulatoryStatus: "Permitted globally with labeling requirements",
  },

  // Added Sugars & Syrups
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
    aliases: ["sugar", "sucrose", "beet sugar", "brown sugar", "dextrose", "maltodextrin", "invert sugar", "fructose", "corn syrup solids", "evaporated cane juice", "invert syrup", "invert sugar syrup", "liquid glucose"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Refined caloric simple carbohydrate.",
    healthConcerns: ["Dental caries", "High glycemic spike", "Inflammation when consumed in excess"],
    isAddedSugar: true,
    regulatoryStatus: "Permitted globally",
  },
  {
    normalized: "jaggery",
    aliases: ["gur", "unrefined sugar"],
    riskLevel: "caution",
    category: "sweetener",
    description: "Traditional unrefined non-centrifugal sugar made from sugarcane juice.",
    healthConcerns: ["Caloric sweetener with minor mineral content; impacts blood sugar similar to sucrose"],
    isAddedSugar: true,
    regulatoryStatus: "Permitted globally",
  },

  // Biscuit Additives, Raising Agents & Preservatives
  {
    normalized: "sodium metabisulphite",
    aliases: ["ins 223", "e223", "sodium metabisulfite", "metabisulphite"],
    riskLevel: "caution",
    category: "preservative",
    description: "Preservative and dough conditioner releasing sulphur dioxide to relax gluten in biscuit dough.",
    healthConcerns: ["Can provoke acute bronchospasm and severe allergic reactions in asthmatics and sulphite-sensitive individuals"],
    isAllergen: true,
    allergenType: "Sulphites",
    regulatoryStatus: "Permitted with strict limits (FSSAI & Codex)",
  },
  {
    normalized: "ammonium bicarbonate",
    aliases: ["ins 503", "ins 503(ii)", "ins 503ii", "e503", "e503ii", "ammonium hydrogen carbonate", "bakers ammonia"],
    riskLevel: "safe",
    category: "additive",
    description: "Traditional leavening agent used in crackers and crisp biscuits; volatilizes completely into ammonia and CO2 during baking.",
    healthConcerns: ["Decomposes fully during high-temperature baking; safe for human consumption"],
    regulatoryStatus: "FDA GRAS / FSSAI Permitted",
  },
  {
    normalized: "sodium bicarbonate",
    aliases: ["ins 500", "ins 500(ii)", "ins 500ii", "e500", "e500ii", "baking soda", "sodium hydrogen carbonate"],
    riskLevel: "safe",
    category: "additive",
    description: "Common leavening agent that releases carbon dioxide gas upon heating to give biscuits aerated texture.",
    healthConcerns: ["Source of dietary sodium"],
    regulatoryStatus: "FDA GRAS / FSSAI Permitted",
  },
  {
    normalized: "disodium diphosphate",
    aliases: ["ins 450", "ins 450(i)", "ins 450i", "e450", "e450i", "sodium acid pyrophosphate"],
    riskLevel: "caution",
    category: "additive",
    description: "Acidic leavening agent used with baking soda for controlled gas release in biscuits.",
    healthConcerns: ["Excess dietary inorganic phosphates linked to vascular calcification and renal load"],
    regulatoryStatus: "Permitted food additive with maximum limits",
  },
  {
    normalized: "mono- and diglycerides of fatty acids",
    aliases: ["ins 471", "e471", "ins 472e", "e472e", "glycerol monostearate", "datem", "emulsifier 471", "emulsifier 472e"],
    riskLevel: "safe",
    category: "emulsifier",
    description: "Plant-derived food emulsifiers used to blend fats and water, improving dough machinability and biscuit crumb stability.",
    healthConcerns: ["Generally safe lipid derivative; may contain traces of trans fats if partially hydrogenated fats were used"],
    regulatoryStatus: "FDA GRAS / FSSAI Permitted",
  },
  {
    normalized: "polyglycerol polyricinoleate",
    aliases: ["ins 476", "e476", "pgpr"],
    riskLevel: "caution",
    category: "emulsifier",
    description: "Synthetic emulsifier made from glycerol and fatty acids (usually castor bean oil) to reduce chocolate viscosity.",
    healthConcerns: ["Allows reduction of cocoa butter with cheaper vegetable fats; potential laxative effect in large quantities"],
    regulatoryStatus: "Permitted within strict daily intake limits (ADI: 25 mg/kg bw)",
  },
  {
    normalized: "caramel color",
    aliases: ["ins 150a", "ins 150c", "ins 150d", "e150a", "e150c", "e150d", "caramel iv", "ammonia caramel"],
    riskLevel: "caution",
    category: "color",
    description: "Brown food coloring manufactured by heating carbohydrates with ammonia or sulphites.",
    healthConcerns: ["Classes III and IV may contain trace byproduct 4-MEI (4-methylimidazole), a potential carcinogen"],
    regulatoryStatus: "Permitted globally with 4-MEI impurity limits",
  },
  {
    normalized: "fructooligosaccharides",
    aliases: ["fos", "fructo-oligosaccharides", "oligofructose", "prebiotic fiber"],
    riskLevel: "safe",
    category: "general",
    description: "Short-chain nondigestible fructose polymers acting as prebiotic soluble dietary fiber.",
    healthConcerns: ["Stimulates beneficial bifidobacteria in colon; may cause mild gas or bloating if consumed in large doses"],
    regulatoryStatus: "FDA GRAS / FSSAI Approved prebiotic",
  },

  {
    normalized: "tertiary butylhydroquinone",
    aliases: ["tbhq", "ins 319", "e319", "antioxidant 319"],
    riskLevel: "caution",
    category: "preservative",
    description: "Synthetic aromatic organic compound used as an antioxidant to preserve fats and vegetable oils.",
    healthConcerns: ["Vision disturbances at high exposures", "Liver effects in animal studies; restricted daily intake"],
    regulatoryStatus: "Strictly limited to 200 ppm in oils (FDA & FSSAI)",
  },
  {
    normalized: "flavour enhancers",
    aliases: ["ins 627", "ins 631", "ins 635", "e627", "e631", "e635", "disodium inosinate", "disodium guanylate", "ribonucleotides"],
    riskLevel: "caution",
    category: "additive",
    description: "Synergistic umami flavor enhancers derived from fermentation or meat/fish extracts, boosting savory perception.",
    healthConcerns: ["May exacerbate gout due to purine breakdown into uric acid", "Marker of ultra-processed snacking foods"],
    regulatoryStatus: "FSSAI / FDA Approved with GMP limit",
  },
  {
    normalized: "silicon dioxide",
    aliases: ["ins 551", "e551", "anticaking agent"],
    riskLevel: "safe",
    category: "additive",
    description: "Anticaking agent used in spice mixtures and snack seasonings to prevent clumping.",
    healthConcerns: ["Poorly absorbed in gastrointestinal tract; excreted safely"],
    regulatoryStatus: "FDA GRAS / FSSAI Approved",
  },
  {
    normalized: "paprika oleoresin",
    aliases: ["ins 160c", "e160c", "paprika extract", "capsanthin"],
    riskLevel: "safe",
    category: "color",
    description: "Natural orange-red extract of the fruits of Capsicum annuum used for natural colouring.",
    healthConcerns: ["Natural plant-derived carotenoid"],
    regulatoryStatus: "Natural food colour permitted globally",
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
  {
    normalized: "sesame seeds",
    aliases: ["sesame", "til", "tila", "gingelly", "sesamum indicum"],
    riskLevel: "safe",
    category: "protein",
    description: "Oilseed and common severe allergen recognized under global labeling regulations.",
    healthConcerns: ["Severe anaphylaxis risk in allergic individuals"],
    isAllergen: true,
    allergenType: "Sesame",
    regulatoryStatus: "Major food allergen (FDA FASTER Act & FSSAI mandatory disclosure)",
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
  const result = resolveIngredientIntelligence(rawToken, customDbIngredients);

  const cleaned = cleanIngredientString(rawToken);
  const rawLower = rawToken.toLowerCase();

  // Enrich with KNOWN_INGREDIENTS hazard rules
  for (const def of KNOWN_INGREDIENTS) {
    if (
      cleaned === def.normalized ||
      cleaned.includes(def.normalized) ||
      rawLower.includes(def.normalized) ||
      def.aliases.some((a) => cleaned.includes(a.toLowerCase()) || rawLower.includes(a.toLowerCase()))
    ) {
      result.riskLevel = def.riskLevel;
      if (def.riskLevel === "avoid") {
        result.classification = "RED";
      } else if (def.riskLevel === "caution" && result.classification !== "RED") {
        result.classification = "ORANGE";
      }
      if (def.isPalmOil) result.isPalmOil = true;
      if (def.isAddedSugar) result.isAddedSugar = true;
      if (def.isAllergen) {
        result.isAllergen = true;
        result.allergenType = def.allergenType;
      }
      if (def.healthConcerns && def.healthConcerns.length > 0) {
        result.healthConcerns = Array.from(new Set([...(result.healthConcerns || []), ...def.healthConcerns]));
        result.risks = result.healthConcerns;
      }
      if (def.regulatoryStatus) result.regulatoryStatus = def.regulatoryStatus;
      break;
    }
  }

  return result;
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
