import {
  IngredientRecord,
  IngredientMatchResult,
  IngredientClassification,
  IngredientDailyIntake,
  IngredientScientificSource,
} from "@/types";
import { getCollection } from "./mongodb";

export interface DetailedIngredientDefinition {
  name: string;
  normalizedName: string;
  aliases: string[];
  insNumber?: string | null;
  category: string;
  origin: "Natural" | "Extracted" | "Fermentation-derived" | "Manufactured / Synthetic" | "Mineral / Inorganic";
  classification: IngredientClassification;
  classificationReason: string;
  description: string;
  foodFunction: string;
  benefits: string[];
  risks: string[];
  dailyIntake: IngredientDailyIntake;
  precautions: string[];
  verdict: string;
  isAllergen?: boolean;
  allergenType?: string | null;
  evidenceLevel: "STRONG" | "MODERATE" | "PRELIMINARY";
  verificationStatus: "VERIFIED" | "NEEDS_REVIEW" | "UNVERIFIED";
  regulatoryStatus: string;
  sources: IngredientScientificSource[];
}

export const SCIENTIFIC_INGREDIENT_DATABASE: DetailedIngredientDefinition[] = [
  // ==========================================
  // 1. SWEETENERS & SUGAR REPLACERS
  // ==========================================
  {
    name: "Sugar (Sucrose)",
    normalizedName: "sugar",
    aliases: ["cane sugar", "beet sugar", "sucrose", "refined sugar", "table sugar", "white sugar", "crystal sugar"],
    insNumber: null,
    category: "Sweetener",
    origin: "Extracted",
    classification: "ORANGE",
    classificationReason: "Nutrient-poor caloric sweetener; excessive intake is strongly linked to dental caries, obesity, fatty liver, and type 2 diabetes.",
    description: "A disaccharide composed of glucose and fructose naturally extracted from sugarcane or sugar beets.",
    foodFunction: "Provides clean sweetness, enhances flavour, contributes to texture, mouthfeel, bulk, and aids preservation.",
    benefits: [
      "Provides rapidly available metabolic energy (4 kcal/g) for physical exertion.",
      "Improves palatability of nutrient-dense whole foods (e.g. yoghurt, oats).",
    ],
    risks: [
      "High intake promotes dental caries via oral bacteria fermentation.",
      "Calorie density without micronutrients contributes to unhealthy weight gain.",
      "High fructose load stimulates hepatic de novo lipogenesis, promoting non-alcoholic fatty liver disease (NAFLD).",
    ],
    dailyIntake: {
      recommended: "Keep free sugars below 10% of total energy intake (< 50g/day for a 2,000 kcal diet); a reduction to below 5% (< 25g/day) provides additional health benefits.",
      adi: null,
      maximum: "50 g/day (WHO conditional target: 25 g/day)",
      unit: "g/day",
      basis: "Per adult per day based on 2,000 kcal energy intake",
      status: "ESTABLISHED",
      explanation: "Established by the World Health Organization (WHO) Guideline on Sugars Intake for Adults and Children (2015). Free sugars include added monosaccharides and disaccharides plus sugars naturally present in honey, syrups, and fruit juices.",
    },
    precautions: [
      "Individuals with type 1 or type 2 diabetes must strictly monitor carbohydrate and free sugar intake.",
      "Children under 2 years of age should not consume added sugars.",
      "Individuals with non-alcoholic fatty liver disease (NAFLD) or hypertriglyceridemia should minimize intake.",
    ],
    verdict: "Consume in strict moderation. Prefer whole fruits and unrefined foods over foods with high free sugars.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "General food ingredient (FDA GRAS, FSSAI, EFSA)",
    sources: [
      {
        organization: "WHO",
        title: "Guideline: Sugars intake for adults and children",
        url: "https://www.who.int/publications/i/item/9789241549028",
        year: 2015,
        finding: "Strong recommendation to reduce intake of free sugars to less than 10% of total energy intake.",
      },
      {
        organization: "EFSA",
        title: "Tolerable upper intake level for dietary sugars",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/7074",
        year: 2022,
        finding: "Intake of added and free sugars should be as low as possible within the context of a nutritionally adequate diet.",
      },
    ],
  },
  {
    name: "Erythritol",
    normalizedName: "erythritol",
    aliases: ["ins 968", "ins968", "e968", "e 968"],
    insNumber: "INS 968",
    category: "Sweetener",
    origin: "Fermentation-derived",
    classification: "ORANGE",
    classificationReason: "Generally safe non-nutritive sweetener; requires moderation due to dose-dependent gastrointestinal tolerance limits and emerging vascular biomarker research.",
    description: "A four-carbon sugar alcohol (polyol) occurring naturally in small amounts in fruits, manufactured commercially by fermentation of glucose using non-pathogenic yeast.",
    foodFunction: "Provides 60–70% of the sweetness of sucrose with virtually zero calories (0.24 kcal/g) and clean mouthfeel without causing tooth decay.",
    benefits: [
      "Does not stimulate insulin secretion or elevate postprandial blood glucose.",
      "Non-cariogenic: oral bacteria cannot ferment it, preventing dental plaque acid formation.",
      "Approximately 90% is absorbed in the small intestine and excreted unchanged in urine, resulting in higher digestive tolerance than other polyols.",
    ],
    risks: [
      "High single acute doses (> 0.5–0.7 g/kg body weight) can trigger osmotic diarrhea, abdominal distension, bloating, and gas.",
      "Emerging observational studies suggest elevated circulating erythritol levels correlate with cardiovascular biomarkers; EFSA maintains active safety surveillance.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "ADI 'not specified' by JECFA; EFSA established a temporary safe threshold of 0.5 g/kg bw for acute gastrointestinal effects.",
      maximum: null,
      unit: "g/kg body weight",
      basis: "Per kg body weight",
      status: "NOT_ESTABLISHED",
      explanation: "No universally established recommended daily intake exists. Erythritol is not a nutrient. The Acceptable Daily Intake (ADI) is 'not specified' by JECFA, indicating low systemic toxicity at food use levels, with gastrointestinal tolerance serving as the limiting practical dose.",
    },
    precautions: [
      "Individuals with Irritable Bowel Syndrome (IBS) or sensitive digestive systems should introduce erythritol gradually.",
      "Young children have lower absolute fluid volumes and may experience laxative symptoms at lower total gram doses.",
    ],
    verdict: "A useful sugar substitute for blood glucose control, but consume in moderation. Avoid very large single servings to prevent digestive distress.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "MODERATE",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food additive (FSSAI, EFSA E 968, FDA GRAS GRN 000076)",
    sources: [
      {
        organization: "EFSA",
        title: "Re-evaluation of erythritol (E 968) as a food additive",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/8430",
        year: 2023,
        finding: "Current exposure estimates raise no safety concern for general population; single-dose intake > 0.5 g/kg bw may cause laxative effect.",
      },
      {
        organization: "JECFA",
        title: "Evaluation of certain food additives (Erythritol)",
        url: "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3093",
        year: 2000,
        finding: "ADI 'not specified' allocated based on low mammalian toxicity and minimal metabolic conversion.",
      },
    ],
  },
  {
    name: "Steviol Glycosides (Stevia Extract)",
    normalizedName: "steviol glycosides",
    aliases: ["stevia", "stevia extract", "ins 960", "ins960", "e960", "e 960", "rebaudioside a", "reb a"],
    insNumber: "INS 960",
    category: "Sweetener",
    origin: "Extracted",
    classification: "ORANGE",
    classificationReason: "Intense zero-calorie sweetener with authoritative safety clearance; consume in moderation within the established Acceptable Daily Intake (ADI).",
    description: "High-intensity sweet-tasting compounds extracted and purified from the leaves of the Stevia rebaudiana plant, primarily Rebaudioside A and Stevioside.",
    foodFunction: "Provides intense sweetness (200–350 times sweeter than sucrose) without calories, carbs, or glycemic response.",
    benefits: [
      "Zero calories and zero glycemic impact; does not elevate blood sugar.",
      "Non-cariogenic: does not promote tooth decay.",
      "Plant-derived origin with extensive toxicological safety evaluations.",
    ],
    risks: [
      "Can impart a lingering liquorice or bitter metallic aftertaste at higher concentrations.",
      "Excessive cumulative consumption exceeding ADI may theoretically stress metabolic elimination pathways, though toxicological safety margins are high.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 4 mg/kg body weight/day (expressed as steviol equivalents)",
      maximum: "4 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day (steviol equivalents)",
      status: "ESTABLISHED",
      explanation: "Established jointly by JECFA (2008) and EFSA (2010). For a 60 kg adult, 4 mg/kg bw corresponds to 240 mg steviol equivalents (~700 mg high-purity Reb-A) per day.",
    },
    precautions: [
      "Individuals with kidney disease or low blood pressure on anti-hypertensive medication should monitor overall consumption.",
      "Pregnant women should stick to high-purity commercial extracts (>95% purity) approved by food regulators.",
    ],
    verdict: "A well-studied, safe alternative to added sugar when consumed within established regulatory intake limits.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved high-intensity sweetener (FSSAI, EFSA E 960, FDA GRAS)",
    sources: [
      {
        organization: "JECFA",
        title: "Safety evaluation of certain food additives (Steviol glycosides)",
        url: "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3784",
        year: 2008,
        finding: "Established ADI of 0–4 mg/kg body weight for steviol glycosides as steviol equivalents.",
      },
      {
        organization: "EFSA",
        title: "Scientific Opinion on the safety of steviol glycosides for the proposed uses as a food additive",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/1537",
        year: 2010,
        finding: "Steviol glycosides are not carcinogenic, genotoxic, or associated with adverse reproductive effects at ADI.",
      },
    ],
  },
  {
    name: "Sucralose",
    normalizedName: "sucralose",
    aliases: ["ins 955", "ins955", "e955", "e 955", "splenda"],
    insNumber: "INS 955",
    category: "Sweetener",
    origin: "Manufactured / Synthetic",
    classification: "ORANGE",
    classificationReason: "Artificial intense sweetener permitted worldwide; consume in moderation within the Acceptable Daily Intake (ADI) while ongoing microbiome research continues.",
    description: "A chlorinated synthetic disaccharide produced by selective chlorination of sucrose, replacing three hydroxyl groups with chlorine atoms.",
    foodFunction: "Delivers non-caloric sweetness approximately 600 times sweeter than sucrose with high heat stability during pasteurization and baking.",
    benefits: [
      "Zero calories and does not contribute to dental caries.",
      "Heat-stable across wide pH and temperature ranges.",
    ],
    risks: [
      "Preliminary animal studies suggest potential alterations in gut microbiome composition at high exposure levels.",
      "Thermal degradation may occur at temperatures exceeding 120°C (248°F) in the presence of lipids.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 15 mg/kg body weight/day (EFSA / JECFA); 0 – 5 mg/kg bw/day (FDA)",
      maximum: "15 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "Established by JECFA and EFSA. For a 60 kg adult, 15 mg/kg bw equals 900 mg pure sucralose per day.",
    },
    precautions: [
      "Individuals with sensitive gut microbiomes or inflammatory bowel conditions should monitor intake.",
    ],
    verdict: "Safe at approved usage levels; prefer whole foods and consume artificially sweetened foods in moderation.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food additive (FDA, EFSA E 955, FSSAI)",
    sources: [
      {
        organization: "JECFA",
        title: "Toxicological evaluation of certain food additives (Sucralose)",
        url: "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3257",
        year: 1990,
        finding: "Established acceptable daily intake of 0-15 mg/kg bw.",
      },
    ],
  },

  // ==========================================
  // 2. DIETARY FIBRE & PREBIOTICS
  // ==========================================
  {
    name: "Chicory Root Fibre (Inulin)",
    normalizedName: "chicory root fibre",
    aliases: ["inulin", "chicory root extract", "chicory inulin", "fructo-oligosaccharides", "fos", "dietary fibre (inulin)"],
    insNumber: null,
    category: "Dietary Fibre",
    origin: "Extracted",
    classification: "GREEN",
    classificationReason: "Scientifically substantiated prebiotic soluble dietary fibre supporting bowel regularity and beneficial gut microflora.",
    description: "A natural polydisperse β(2,1) fructan storage carbohydrate extracted via hot water diffusion from the roots of the chicory plant (Cichorium intybus).",
    foodFunction: "Acts as a functional dietary prebiotic fibre, replaces fat and sugar by mimicking creamy mouthfeel, and improves calcium bioavailability.",
    benefits: [
      "Fermented by bifidobacteria in the colon, producing beneficial short-chain fatty acids (acetate, propionate, butyrate).",
      "Contributes to dietary fibre intake, supporting normal bowel function and stool frequency.",
      "Low caloric impact (~1.5–2 kcal/g) with zero glycemic spike.",
    ],
    risks: [
      "Being a fermentable oligosaccharide (FODMAP), rapid intake above 10–15 g/day can cause transient gas, abdominal bloating, and flatulence in sensitive individuals.",
    ],
    dailyIntake: {
      recommended: "Included within the total adult dietary fibre recommendation of 25–30 g/day (WHO / ICMR / EFSA). No specific isolate quota.",
      adi: null,
      maximum: "Gastrointestinal tolerance typically reaches discomfort above 20–30 g in a single serving.",
      unit: "g/day",
      basis: "Total dietary intake",
      status: "ESTABLISHED",
      explanation: "No separate isolated intake quota exists for inulin; it contributes toward the universal adult dietary fibre target of 25 to 30 grams per day.",
    },
    precautions: [
      "Individuals following a low-FODMAP diet for Irritable Bowel Syndrome (IBS) should limit inulin intake.",
    ],
    verdict: "A beneficial, health-promoting prebiotic fibre. Introduce gradually to allow colonic microflora to adapt without discomfort.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Recognized dietary fibre and food ingredient (EFSA health claim authorised, FDA, FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the substantiation of a health claim related to native chicory inulin and maintenance of normal defecation",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4251",
        year: 2015,
        finding: "Daily consumption of 12g native chicory inulin maintains normal defecation by increasing stool frequency.",
      },
    ],
  },

  // ==========================================
  // 3. DAIRY & PROTEIN INGREDIENTS
  // ==========================================
  {
    name: "Whey Protein",
    normalizedName: "whey protein",
    aliases: ["whey protein concentrate", "whey protein isolate", "whey solids", "demineralized whey"],
    insNumber: null,
    category: "Protein",
    origin: "Extracted",
    classification: "GREEN",
    classificationReason: "Complete high-biological-value protein rich in essential branched-chain amino acids (BCAAs), supporting muscle synthesis and recovery.",
    description: "The liquid dairy serum proteins separated from curds during cheese manufacturing, filtered and spray-dried into concentrated protein powder.",
    foodFunction: "Boosts protein content, enhances foaming, emulsification, water binding, and provides creamy texture in dairy, frozen desserts, and beverages.",
    benefits: [
      "Contains all 9 essential amino acids with exceptional leucine content for muscle protein synthesis (MPS).",
      "High bioavailability and rapid absorption kinetics (Protein Digestibility-Corrected Amino Acid Score PDCAAS = 1.0).",
      "Immunoglobulins and lactoferrin support normal immune barrier function.",
    ],
    risks: [
      "Contains lactose (in concentrate forms), which can provoke digestive distress in lactose-intolerant individuals.",
      "Excessive overall protein intake without adequate hydration can strain renal clearance in pre-existing kidney disease.",
    ],
    dailyIntake: {
      recommended: "0.8 to 1.2 g total dietary protein per kg body weight/day for sedentary adults; 1.4 to 2.0 g/kg bw/day for active individuals.",
      adi: null,
      maximum: "Up to 2.0–2.2 g protein/kg body weight/day is considered safe for healthy adults.",
      unit: "g/kg body weight/day",
      basis: "Total protein across all dietary sources",
      status: "ESTABLISHED",
      explanation: "Protein requirements depend on individual body weight, age, activity level, and clinical status. Whey protein is a food ingredient, not a medical drug.",
    },
    precautions: [
      "ALLERGEN: Contains cow's milk protein. Strictly contraindicated for individuals with IgE-mediated cow's milk allergy.",
      "Lactose-intolerant individuals should select whey protein isolate (WPI) rather than whey protein concentrate (WPC).",
    ],
    verdict: "An excellent quality protein source. Highly beneficial when used to meet daily dietary protein requirements.",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Standard food ingredient (FDA GRAS, FSSAI, EFSA)",
    sources: [
      {
        organization: "WHO / FAO",
        title: "Protein and amino acid requirements in human nutrition",
        url: "https://www.who.int/publications/i/item/9241209356",
        year: 2007,
        finding: "Whey protein provides high DIAAS and PDCAAS scores with optimal indispensable amino acid profiles.",
      },
    ],
  },
  {
    name: "Skimmed Milk",
    normalizedName: "skimmed milk",
    aliases: ["skim milk", "fat free milk", "pasteurized skimmed milk", "reconstituted skimmed milk"],
    insNumber: null,
    category: "Dairy",
    origin: "Natural",
    classification: "GREEN",
    classificationReason: "Wholesome nutrient-dense whole food providing bioavailable calcium, riboflavin, phosphorus, and high-quality milk protein with minimal saturated fat.",
    description: "Bovine milk from which virtually all butterfat has been removed by centrifugal separation (typically containing less than 0.5% milk fat).",
    foodFunction: "Provides dairy base, clean milk protein, natural sugars (lactose), calcium, and structured mouthfeel without heavy fat calories.",
    benefits: [
      "Rich source of bioavailable calcium supporting bone density and tooth enamel.",
      "Supplies high-quality casein and whey proteins with complete amino acid profiles.",
      "Naturally low in saturated fat and cholesterol.",
    ],
    risks: [
      "Contains natural milk sugar (lactose); triggers abdominal cramps and diarrhea in lactose-intolerant individuals.",
    ],
    dailyIntake: {
      recommended: "2 to 3 servings (approx. 400–500 ml) of dairy or fortified alternatives daily per ICMR-NIN / Dietary Guidelines for Indians.",
      adi: null,
      maximum: null,
      unit: "ml/day",
      basis: "General dietary guidelines",
      status: "ESTABLISHED",
      explanation: "Recommended as part of balanced food group guidelines. No toxic limit exists for normal food consumption in healthy non-allergic adults.",
    },
    precautions: [
      "ALLERGEN: Cow's milk is a major food allergen. Anyone with cow's milk allergy must strictly avoid.",
      "Lactose intolerance requires lactase enzyme supplementation or lactose-free dairy alternatives.",
    ],
    verdict: "Nutritious and wholesome staple food. Great source of calcium and protein for non-allergic consumers.",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Standard whole food dairy product (FSSAI, FDA, Codex)",
    sources: [
      {
        organization: "ICMR-NIN",
        title: "Dietary Guidelines for Indians",
        url: "https://www.nin.res.in",
        year: 2024,
        finding: "Recommends daily intake of milk and milk products for bone health and dietary protein adequacy.",
      },
    ],
  },
  {
    name: "Milk Solids",
    normalizedName: "milk solids",
    aliases: ["dairy solids", "skim milk powder", "whole milk powder", "smp", "dry milk solids"],
    insNumber: null,
    category: "Dairy",
    origin: "Extracted",
    classification: "GREEN",
    classificationReason: "Standard dehydrated dairy component containing concentrated milk protein, lactose, and minerals.",
    description: "The non-water components of bovine milk obtained by partial or complete evaporation of water from whole or skimmed milk.",
    foodFunction: "Standardizes total solids, adds body and creaminess, prevents ice crystal growth in ice creams, and enriches protein.",
    benefits: [
      "Concentrated source of calcium, phosphorus, and bioavailable casein and whey proteins.",
    ],
    risks: [
      "Contains lactose, causing digestive issues in lactose malabsorbers.",
    ],
    dailyIntake: {
      recommended: "Contributes toward daily dairy allowance.",
      adi: null,
      maximum: null,
      unit: null,
      basis: "Whole food dairy",
      status: "NOT_ESTABLISHED",
      explanation: "Regulated as a whole food ingredient; no isolated pharmacological limit.",
    },
    precautions: [
      "ALLERGEN: Contains milk. Contraindicated in cow's milk protein allergy.",
    ],
    verdict: "Safe, nutritious dairy ingredient widely used to give structure and nutrition to foods.",
    isAllergen: true,
    allergenType: "Milk / Dairy",
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Standard dairy ingredient (FSSAI, FDA, Codex)",
    sources: [
      {
        organization: "Codex Alimentarius",
        title: "Standard for Milk Powders and Cream Powder (CXS 207-1999)",
        url: "https://www.fao.org/fao-who-codexalimentarius",
        year: 1999,
        finding: "Internationally standardized dairy ingredient meeting rigorous microbiological and purity parameters.",
      },
    ],
  },

  // ==========================================
  // 4. EMULSIFIERS & STABILIZERS
  // ==========================================
  {
    name: "Mono- and Diglycerides of Fatty Acids",
    normalizedName: "mono- and diglycerides of fatty acids",
    aliases: ["ins 471", "ins471", "e471", "e 471", "glycerol monostearate", "gms", "emulsifier (ins 471)", "emulsifier 471"],
    insNumber: "INS 471",
    category: "Emulsifier",
    origin: "Manufactured / Synthetic",
    classification: "ORANGE",
    classificationReason: "Widely used food emulsifier with safe regulatory standing, but consume in moderation as part of processed food matrices.",
    description: "A mixture of glycerol molecules bonded with one or two fatty acids, produced by transesterification of edible vegetable oils or animal fats.",
    foodFunction: "Prevents separation of oil and water phases, stabilizes aerated foam, reduces melting rate in ice creams, and extends bread softness.",
    benefits: [
      "Enables smooth, stable emulsions preventing physical separation without synthetic chemical solvents.",
      "Digested and metabolized via normal dietary fat pathways into glycerol and fatty acids.",
    ],
    risks: [
      "Recent preclinical animal research has investigated potential interactions between high cumulative emulsifier exposure and the gut mucosal barrier; human clinical significance is actively being examined by EFSA.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "ADI 'not specified' by JECFA and EFSA due to low systemic toxicity.",
      maximum: null,
      unit: null,
      basis: "Metabolized as normal dietary fat",
      status: "NOT_SPECIFIED",
      explanation: "JECFA and EFSA have allocated an ADI of 'not specified' because mono- and diglycerides are natural intermediates of dietary lipid digestion.",
    },
    precautions: [
      "May be derived from animal fat or plant oil (palm/soy); strict vegetarians should verify source declaration.",
    ],
    verdict: "Generally safe within regulatory limits. Its presence indicates ultra-processed food formulation; focus on whole, minimally processed food.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "MODERATE",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food additive (EFSA E 471, FDA GRAS 21 CFR 184.1505, FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Re-evaluation of mono- and di-glycerides of fatty acids (E 471) as food additives",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/5045",
        year: 2017,
        finding: "EFSA concluded that there is no need for a numerical ADI and that the food additive E 471 is of no safety concern at the reported uses.",
      },
    ],
  },
  {
    name: "Guar Gum",
    normalizedName: "guar gum",
    aliases: ["ins 412", "ins412", "e412", "e 412", "guaran", "stabilizer (ins 412)"],
    insNumber: "INS 412",
    category: "Stabilizer",
    origin: "Extracted",
    classification: "ORANGE",
    classificationReason: "Naturally derived plant polysaccharide; safe at food additive concentrations, but excessive doses may trigger intestinal gas or loose stools.",
    description: "A natural galactomannan polysaccharide extracted from the ground endosperm of guar beans (Cyamopsis tetragonoloba).",
    foodFunction: "Acts as a cold-water thickening agent, retards ice crystal growth in frozen desserts, and improves mouthfeel and viscosity.",
    benefits: [
      "Acts as a soluble prebiotic dietary fibre, fermentable by beneficial colonic microflora.",
      "Helps blunt postprandial glucose surges by slowing gastric emptying rate.",
    ],
    risks: [
      "Excessive ingestion can cause mild flatulence, bloating, or loose stools due to rapid microbial fermentation.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "ADI 'not specified' (JECFA / EFSA)",
      maximum: null,
      unit: null,
      basis: "Food additive use",
      status: "NOT_SPECIFIED",
      explanation: "Allocated an ADI of 'not specified' by JECFA and EFSA based on high safety margins and low biological toxicity.",
    },
    precautions: [
      "Individuals with severe swallowing difficulties (dysphagia) or bowel obstruction should exercise caution with concentrated dry gum powders.",
    ],
    verdict: "A safe, plant-derived stabilizing hydrocolloid. Consume in moderation as part of balanced food items.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food additive (FSSAI, EFSA E 412, FDA GRAS)",
    sources: [
      {
        organization: "EFSA",
        title: "Re-evaluation of guar gum (E 412) as a food additive",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4728",
        year: 2017,
        finding: "No safety concern at reported food use levels; no need for a numerical ADI.",
      },
    ],
  },
  {
    name: "Xanthan Gum",
    normalizedName: "xanthan gum",
    aliases: ["ins 415", "ins415", "e415", "e 415", "stabilizer (ins 415)"],
    insNumber: "INS 415",
    category: "Stabilizer",
    origin: "Fermentation-derived",
    classification: "ORANGE",
    classificationReason: "Safe bacterial fermentation polysaccharide with broad regulatory clearance; requires moderation due to dose-dependent osmotic/laxative effects at high doses.",
    description: "A high-molecular-weight extracellular polysaccharide produced by pure culture aerobic fermentation of carbohydrates with the bacterium Xanthomonas campestris.",
    foodFunction: "Provides pseudoplastic (shear-thinning) viscosity, prevents ingredient sedimentation in drinks, and stabilizes gluten-free doughs and sauces.",
    benefits: [
      "Physiologically inert; passes through the human upper gastrointestinal tract without digestion.",
      "Crucial culinary stabilizer for gluten-free foods, giving elasticity and gas retention to gluten-free bakery products.",
    ],
    risks: [
      "Consuming very high doses (> 15 g/day) can exert a mild laxative effect, increasing stool volume and flatulence.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "ADI 'not specified' (JECFA / EFSA)",
      maximum: null,
      unit: null,
      basis: "Food additive use",
      status: "NOT_SPECIFIED",
      explanation: "Evaluated by EFSA and JECFA with an ADI of 'not specified', confirming negligible systemic toxicity at normal food consumption levels.",
    },
    precautions: [
      "Avoid feeding thickened infant foods with xanthan gum to premature infants due to rare historical necrotizing enterocolitis reports.",
    ],
    verdict: "Safe and effective stabilizing agent widely used in culinary science and gluten-free formulations.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food additive (FDA GRAS, EFSA E 415, FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Re-evaluation of xanthan gum (E 415) as a food additive",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4909",
        year: 2017,
        finding: "No safety concern for general population at current food uses; no need for a numerical ADI.",
      },
    ],
  },

  // ==========================================
  // 5. ACIDITY REGULATORS & PRESERVATIVES
  // ==========================================
  {
    name: "Citric Acid",
    normalizedName: "citric acid",
    aliases: ["ins 330", "ins330", "e330", "e 330", "acidity regulator (ins 330)", "acidulant 330"],
    insNumber: "INS 330",
    category: "Acidity Regulator",
    origin: "Fermentation-derived",
    classification: "ORANGE",
    classificationReason: "Natural organic intermediate with excellent safety profile; requires moderation primarily due to dental acid erosion risks when consumed in acidic drinks.",
    description: "A tricarboxylic organic acid naturally found in citrus fruits, produced commercially by aerobic fermentation of carbohydrate molasses using Aspergillus niger.",
    foodFunction: "Imparts a clean, tart citrus flavour, regulates pH to inhibit microbial growth, and acts as a synergist for antioxidants.",
    benefits: [
      "Fundamental intermediate in the cellular Krebs (Citric Acid) cycle of human aerobic cellular metabolism.",
      "Acts as a natural preservative by lowering pH, protecting food safety without harsh synthetic chemicals.",
    ],
    risks: [
      "Frequent, prolonged exposure to acidic beverages with high citric acid can soften and demineralize dental enamel, causing tooth wear.",
      "High concentrations can aggravate gastroesophageal reflux (GERD) in predisposed individuals.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "ADI 'not limited' (JECFA / EFSA)",
      maximum: null,
      unit: null,
      basis: "Cellular intermediary metabolite",
      status: "NOT_SPECIFIED",
      explanation: "JECFA and EFSA allocated an ADI of 'not limited' because citric acid is naturally synthesized in human cells as part of fundamental cellular respiration.",
    },
    precautions: [
      "Individuals with dental erosion, sensitive teeth, or active acid reflux / gastritis should rinse mouth with water after drinking acidic beverages.",
    ],
    verdict: "Completely safe internally; take basic dental precautions when consuming tart acidic beverages.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food acidulant (FDA GRAS, EFSA E 330, FSSAI)",
    sources: [
      {
        organization: "JECFA",
        title: "Toxicological evaluation of certain food additives (Citric acid)",
        url: "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1411",
        year: 1974,
        finding: "ADI 'not limited' allocated; normal cellular constituent completely metabolized.",
      },
    ],
  },
  {
    name: "Sodium Benzoate",
    normalizedName: "sodium benzoate",
    aliases: ["ins 211", "ins211", "e211", "e 211", "preservative (ins 211)", "benzoate of soda"],
    insNumber: "INS 211",
    category: "Preservative",
    origin: "Manufactured / Synthetic",
    classification: "ORANGE",
    classificationReason: "Antimicrobial preservative approved within strict regulatory limits; requires moderation due to potential benzene formation in the presence of ascorbic acid.",
    description: "The sodium salt of benzoic acid, widely used as an antifungal and antibacterial preservative in acidic foods and beverages.",
    foodFunction: "Inhibits growth of yeasts, moulds, and bacteria in acidic environments (pH < 4.5), extending shelf life and preventing foodborne spoilage.",
    benefits: [
      "Highly effective inhibitor of food spoilage organisms, protecting consumer safety against foodborne pathogens.",
      "Metabolized in the liver by conjugation with glycine to form hippuric acid, which is rapidly excreted in urine.",
    ],
    risks: [
      "In the presence of ascorbic acid (Vitamin C) and transition metals (Cu, Fe) under UV light or heat, trace amounts of benzene (a known carcinogen) can form; strict industrial quality standards control this.",
      "Historical Southampton study noted possible association with hyperactivity in susceptible children when paired with artificial food colours.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 5 mg/kg body weight/day (expressed as benzoic acid equivalent) [JECFA / EFSA]",
      maximum: "5 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "Established by JECFA and EFSA based on no-observed-adverse-effect levels (NOAEL) in multi-generation toxicity studies. For a 60 kg adult, this equals a maximum of 300 mg per day.",
    },
    precautions: [
      "Individuals with diagnosed asthma, chronic urticaria (hives), or aspirin sensitivity may experience pseudoallergic reactions to benzoates.",
    ],
    verdict: "Safe within strict legal maximum limits; minimize consumption of heavily preserved commercial beverages.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Regulated food preservative with strict maximum use limits (FSSAI, EFSA E 211, FDA GRAS)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the re-evaluation of benzoic acid (E 210) and sodium benzoate (E 211)",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4433",
        year: 2016,
        finding: "Re-established group ADI of 5 mg/kg bw/day for benzoic acid and its salts.",
      },
    ],
  },
  {
    name: "Potassium Sorbate",
    normalizedName: "potassium sorbate",
    aliases: ["ins 202", "ins202", "e202", "e 202", "preservative (ins 202)"],
    insNumber: "INS 202",
    category: "Preservative",
    origin: "Manufactured / Synthetic",
    classification: "ORANGE",
    classificationReason: "Well-tolerated antimicrobial preservative metabolized like dietary fatty acids; consume in moderation within the Acceptable Daily Intake (ADI).",
    description: "The potassium salt of sorbic acid, naturally related to polyunsaturated fatty acids found in mountain ash berries.",
    foodFunction: "Inhibits mould and yeast reproduction in cheeses, drinks, dips, and baked goods without altering flavour.",
    benefits: [
      "Metabolized and broken down via beta-oxidation in human cells into water and carbon dioxide, similar to normal dietary fatty acids.",
      "Less irritating to gastric mucosa than benzoates.",
    ],
    risks: [
      "Rare contact dermatitis or hypersensitivity reactions in atopic individuals.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 11 mg/kg body weight/day (expressed as sorbic acid) [EFSA, 2019]",
      maximum: "11 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "Established by EFSA following updated reproductive and developmental toxicity evaluations.",
    },
    precautions: [
      "Individuals with known preservative sensitivities should check ingredient labels.",
    ],
    verdict: "One of the safest common commercial food preservatives. Safe within established daily limits.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved preservative (EFSA E 202, FDA GRAS, FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Opinion on the follow-up of the re-evaluation of sorbic acid (E 200) and potassium sorbate (E 202)",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/5625",
        year: 2019,
        finding: "Established temporary group ADI of 11 mg/kg bw/day.",
      },
    ],
  },

  // ==========================================
  // 6. COLOURS & HAZARD ADDITIVES
  // ==========================================
  {
    name: "Caramel IV (Sulphite Ammonia Caramel)",
    normalizedName: "caramel iv",
    aliases: ["ins 150d", "ins150d", "e150d", "e 150d", "colour (ins 150d)", "colour 150d", "caramel colour"],
    insNumber: "INS 150d",
    category: "Color",
    origin: "Manufactured / Synthetic",
    classification: "ORANGE",
    classificationReason: "Widely used brown colouring in colas and sauces; contains manufacturing by-products (4-MEI) that are strictly regulated and monitored.",
    description: "A dark brown liquid or powder prepared by controlled heat treatment of carbohydrates in the presence of both sulphite and ammonium compounds.",
    foodFunction: "Imparts the characteristic deep amber to dark brown colour in colas, gravies, beers, and confectionery.",
    benefits: [
      "Provides stable, light-fast brown colour with negative electrical charge that prevents cloudiness in colas.",
    ],
    risks: [
      "Industrial thermal reaction produces 4-methylimidazole (4-MEI) as a trace by-product, which showed carcinogenic activity at very high doses in rodent bioassays. EFSA and FDA enforce strict maximum residual limits.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 300 mg/kg body weight/day (EFSA group ADI for caramel colours)",
      maximum: "300 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "EFSA established a group ADI of 300 mg/kg bw/day, which covers potential exposure to manufacturing impurities including 4-MEI.",
    },
    precautions: [
      "Individuals sensitive to sulphites should note that E 150d contains residual bound sulphites.",
    ],
    verdict: "Approved and safe within regulated residual 4-MEI limits, but an indicator of ultra-processed industrial colas and snacks.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Approved food colour with strict limits on 4-MEI (EFSA E 150d, FDA, FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the re-evaluation of caramel colours (E 150 a,b,c,d) as food additives",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/2004",
        year: 2011,
        finding: "Established group ADI of 300 mg/kg bw/day for caramel colours; anticipated 4-MEI intake is not of safety concern.",
      },
    ],
  },
  {
    name: "Tartrazine",
    normalizedName: "tartrazine",
    aliases: ["ins 102", "ins102", "e102", "e 102", "fd&c yellow no. 5", "yellow 5", "colour (ins 102)"],
    insNumber: "INS 102",
    category: "Color",
    origin: "Manufactured / Synthetic",
    classification: "RED",
    classificationReason: "Synthetic azo dye requiring statutory European warning label regarding child hyperactivity, with established risks of pseudoallergic reactions in aspirin-sensitive individuals.",
    description: "A synthetic petroleum-derived lemon-yellow azo dye used to colour beverages, snacks, sweets, and processed foods.",
    foodFunction: "Provides vivid, inexpensive yellow-to-orange colouration that remains stable under heat, acid, and light.",
    benefits: [
      "Purely cosmetic; provides no nutritional or health benefits.",
    ],
    risks: [
      "EU statutory requirement: Foods containing Tartrazine must carry the warning: 'May have an adverse effect on activity and attention in children'.",
      "Cross-reacts with aspirin, inducing asthma, hives, and rhinitis in sensitive atopic individuals.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 10 mg/kg body weight/day [EFSA / JECFA, re-evaluated 2016]",
      maximum: "10 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "Established by JECFA and revised upwards by EFSA in 2016 based on toxicological data, but mandatory child behavioural warnings remain in the EU.",
    },
    precautions: [
      "Children and individuals with ADHD should avoid synthetic food dyes.",
      "Individuals with asthma or aspirin intolerance should strictly avoid Tartrazine.",
    ],
    verdict: "Cosmetic synthetic dye with zero nutritional value. Best avoided or strictly minimized, especially by children.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Permitted with mandatory warning in EU (Regulation EC 1333/2008); Permitted in FDA and FSSAI",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the re-evaluation of Tartrazine (E 102)",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/1331",
        year: 2009,
        finding: "Confirmed cross-reactivity with aspirin and supported EU requirement for child behavioural advisory labeling.",
      },
    ],
  },
  {
    name: "Carmoisine (Azorubine)",
    normalizedName: "carmoisine",
    aliases: ["ins 122", "ins122", "e122", "e 122", "azorubine", "colour (ins 122)"],
    insNumber: "INS 122",
    category: "Color",
    origin: "Manufactured / Synthetic",
    classification: "RED",
    classificationReason: "Synthetic azo dye banned in the United States and Canada; requires child hyperactivity warning labels in the European Union.",
    description: "A synthetic disodium salt azo dye that produces a rich red to maroon colour in foods.",
    foodFunction: "Provides artificial red colouring in confectioneries, jellies, ice creams, and soft drinks.",
    benefits: [
      "Purely cosmetic; provides no nutritional benefit.",
    ],
    risks: [
      "Banned as a food additive in the USA (FDA) and Canada due to historical safety questions and lack of manufacturer petition.",
      "Subject to EU mandatory warning label regarding child attention and hyperactivity.",
      "Potential to provoke histamine release, exacerbating urticaria and asthma.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "0 – 4 mg/kg body weight/day [EFSA, 2009]",
      maximum: "4 mg/kg bw/day",
      unit: "mg/kg body weight/day",
      basis: "Per kg body weight per day",
      status: "ESTABLISHED",
      explanation: "EFSA reduced the ADI to 4 mg/kg bw/day in 2009. Prohibited from food use in the USA.",
    },
    precautions: [
      "Children, individuals with ADHD, asthma, or sensitivity to azo dyes should strictly avoid.",
    ],
    verdict: "Avoid where possible. Look for clean alternatives coloured naturally with beetroot, paprika, or fruit juices.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Banned in USA & Canada; Permitted with warning in EU (E 122); Permitted in India (FSSAI)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the re-evaluation of Azorubine/Carmoisine (E 122)",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/1332",
        year: 2009,
        finding: "EFSA lowered the ADI from 4 to 4 mg/kg bw/day and reaffirmed precautionary warning for children.",
      },
    ],
  },

  // ==========================================
  // 7. FATS & OILS
  // ==========================================
  {
    name: "Palm Oil",
    normalizedName: "palm oil",
    aliases: ["palmolein", "edible vegetable oil palmolein", "refined palmolein", "refined palm oil", "palm kernel oil", "fractionated palm oil"],
    insNumber: null,
    category: "Fat / Oil",
    origin: "Natural",
    classification: "ORANGE",
    classificationReason: "Contains high saturated fat (~50% palmitic acid) which raises LDL cholesterol; industrial high-heat refining produces processing contaminants (3-MCPD / GE).",
    description: "An edible vegetable oil naturally derived from the mesocarp of the fruit of the oil palm tree (Elaeis guineensis).",
    foodFunction: "Provides natural semi-solid structure, high oxidative frying stability, smooth texture, and long shelf life at low cost without partial hydrogenation.",
    benefits: [
      "Naturally free from industrial trans fatty acids.",
      "High thermal smoke point and oxidative stability for commercial frying.",
    ],
    risks: [
      "High in palmitic acid (C16:0), which elevates atherogenic low-density lipoprotein (LDL) cholesterol and apolipoprotein B.",
      "High-temperature deodorization during refining produces process contaminants (glycidyl fatty acid esters - GE, and 3-MCPD esters) classified as potentially genotoxic and nephrotoxic by EFSA.",
    ],
    dailyIntake: {
      recommended: "Limit total saturated fatty acid intake to less than 10% of total daily energy (WHO / AHA), equivalent to ~20g/day on a 2,000 kcal diet.",
      adi: null,
      maximum: "20 g/day of total saturated fats from all dietary sources combined.",
      unit: "g/day",
      basis: "Total saturated fat",
      status: "ESTABLISHED",
      explanation: "WHO and American Heart Association guidelines strongly recommend replacing saturated fats with polyunsaturated and monounsaturated vegetable oils.",
    },
    precautions: [
      "Individuals with dyslipidemia, elevated LDL cholesterol, or atherosclerotic cardiovascular disease should strictly restrict palm oil intake.",
    ],
    verdict: "Consume in moderation. Prefer unrefined oils rich in polyunsaturated and monounsaturated fatty acids (mustard, olive, sunflower).",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Standard food ingredient with EFSA / FSSAI limits on 3-MCPD and GE contaminants",
    sources: [
      {
        organization: "WHO",
        title: "Saturated fatty acid and trans-fatty acid intake for adults and children",
        url: "https://www.who.int/publications/i/item/9789240073630",
        year: 2023,
        finding: "Strong recommendation to reduce saturated fatty acid intake to ≤ 10% of total energy intake.",
      },
      {
        organization: "EFSA",
        title: "Risks for human health related to the presence of 3- and 2-monochloropropanediol (MCPD), and their fatty acid esters, and glycidyl fatty acid esters in food",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4426",
        year: 2016,
        finding: "Palm oil and palm fats had the highest levels of both 3-MCPD and glycidyl esters among vegetable oils.",
      },
    ],
  },
  {
    name: "Partially Hydrogenated Vegetable Oil (Trans Fat)",
    normalizedName: "partially hydrogenated vegetable oil",
    aliases: ["partially hydrogenated oil", "partially hydrogenated fat", "vanaspati", "margarine with trans fat", "industrial trans fat"],
    insNumber: null,
    category: "Fat / Oil",
    origin: "Manufactured / Synthetic",
    classification: "RED",
    classificationReason: "Strong, definitive scientific consensus: industrial trans fats elevate LDL, depress HDL, cause systemic endothelial inflammation, and significantly increase coronary heart disease risk.",
    description: "Vegetable oil subjected to chemical catalytic partial hydrogenation, converting natural cis-unsaturated double bonds into unnatural trans isomers.",
    foodFunction: "Historically used to create cheap, solid fats with long oxidative shelf life for commercial bakeries, biscuits, and frying.",
    benefits: [
      "None. Possesses zero nutritional benefit and is universally recognized as hazardous to cardiovascular health.",
    ],
    risks: [
      "Simultaneously elevates LDL cholesterol and lowers protective HDL cholesterol.",
      "Causes severe endothelial dysfunction and systemic vascular inflammation.",
      "Increases coronary heart disease mortality by 28% and all-cause mortality by 34% per 2% increase in energy intake (WHO).",
    ],
    dailyIntake: {
      recommended: "0% of daily calories (WHO target: < 1% of total energy, virtually zero)",
      adi: null,
      maximum: "0 g/day",
      unit: "g/day",
      basis: "Zero acceptable dietary intake",
      status: "ESTABLISHED",
      explanation: "WHO launched the global REPLACE initiative to eliminate industrially produced trans fats from the global food supply. Banned by US FDA (revocation of GRAS) and restricted to < 2% in fats in India (FSSAI).",
    },
    precautions: [
      "Everyone should strictly avoid any product containing partially hydrogenated fats.",
    ],
    verdict: "High cardiovascular hazard. Avoid completely. Check labels for 'partially hydrogenated' oils or vanaspati.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Banned / GRAS revoked in USA (FDA); Limit of max 2% trans fat in fats/oils in India (FSSAI); Banned in EU",
    sources: [
      {
        organization: "WHO",
        title: "Countdown to 2023: WHO report on global trans fat elimination",
        url: "https://www.who.int/publications/i/item/9789240067233",
        year: 2023,
        finding: "Industrial trans fats are responsible for up to 500,000 premature deaths from coronary heart disease each year.",
      },
    ],
  },

  // ==========================================
  // 8. WHOLE FOODS, FLAVOURS & COMMON STAPLES
  // ==========================================
  {
    name: "Pure Dark Cocoa Solids",
    normalizedName: "cocoa solids",
    aliases: ["cocoa", "cocoa powder", "cacao", "cacao solids", "dark cocoa", "defatted cocoa powder"],
    insNumber: null,
    category: "Whole Food / Antioxidant",
    origin: "Natural",
    classification: "GREEN",
    classificationReason: "Rich in beneficial flavan-3-ols (epicatechin), dietary fibre, and minerals (iron, magnesium) that support cardiovascular endothelium.",
    description: "The non-fat components of roasted and finely ground cacao beans (Theobroma cacao) remaining after the extraction of cocoa butter.",
    foodFunction: "Provides deep, natural chocolate flavour, rich colour, antioxidant protection, and structured mouthfeel.",
    benefits: [
      "High concentration of bioactive polyphenols (flavanols) that stimulate nitric oxide production and improve vascular elasticity.",
      "Good source of dietary iron, magnesium, copper, and dietary fibre.",
    ],
    risks: [
      "Contains naturally occurring theobromine and small amounts of caffeine, which may cause mild stimulation or reflux in sensitive individuals.",
    ],
    dailyIntake: {
      recommended: "200 mg of cocoa flavanols daily (approx. 2.5g high-flavanol cocoa powder or 10g dark chocolate) for cardiovascular benefit (EFSA health claim).",
      adi: null,
      maximum: null,
      unit: "mg flavanols/day",
      basis: "Cardiovascular health claim",
      status: "ESTABLISHED",
      explanation: "EFSA approved an authorized health claim confirming that 200 mg of cocoa flavanols daily helps maintain endothelium-dependent vasodilation, contributing to normal blood flow.",
    },
    precautions: [
      "Individuals sensitive to theobromine or caffeine should avoid high-cocoa foods close to bedtime.",
    ],
    verdict: "Wholesome, antioxidant-rich ingredient with proven vascular benefits when not diluted by excessive added sugars.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Standard food ingredient with authorized EFSA health claim",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the substantiation of a health claim related to cocoa flavanols and maintenance of normal endothelium-dependent vasodilation",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/2809",
        year: 2012,
        finding: "Cocoa flavanols maintain the elasticity of blood vessels, contributing to normal blood flow.",
      },
    ],
  },
  {
    name: "Iodised Salt (Sodium Chloride)",
    normalizedName: "iodised salt",
    aliases: ["salt", "table salt", "sodium chloride", "vacuum evaporated iodised salt", "edible common salt"],
    insNumber: null,
    category: "Mineral",
    origin: "Mineral / Inorganic",
    classification: "ORANGE",
    classificationReason: "Essential dietary electrolyte fortified with iodine to prevent goitre, but excessive sodium intake directly elevates blood pressure and stroke risk.",
    description: "Crystalline sodium chloride purified from seawater or rock salt deposits, fortified with potassium iodate to prevent iodine deficiency disorders.",
    foodFunction: "Enhances flavour perception, suppresses bitterness, regulates dough fermentation, controls water activity, and acts as an essential preservative.",
    benefits: [
      "Sodium is an essential mineral required for extracellular fluid volume, cellular osmotic balance, and nerve impulse transmission.",
      "Iodine fortification prevents goitre, endemic cretinism, and cognitive impairment in populations.",
    ],
    risks: [
      "Excessive sodium intake drives hypertension, arterial stiffening, and elevated risk of stroke and renal disease.",
    ],
    dailyIntake: {
      recommended: "Less than 2,000 mg sodium per day (equivalent to less than 5 g salt / 1 teaspoon) for adults (WHO).",
      adi: null,
      maximum: "2,000 mg sodium / day",
      unit: "mg sodium/day",
      basis: "Per adult per day",
      status: "ESTABLISHED",
      explanation: "Established by the WHO Guideline on Sodium Intake for Adults and Children (2012). Average global consumption is currently more than double the recommended maximum.",
    },
    precautions: [
      "Individuals with hypertension, chronic kidney disease, or congestive heart failure must strictly adhere to low-sodium limits.",
    ],
    verdict: "Essential in small physiological amounts; consume in moderation and watch for high hidden sodium in processed foods.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Essential fortified food mineral (WHO, FSSAI, FDA)",
    sources: [
      {
        organization: "WHO",
        title: "Guideline: Sodium intake for adults and children",
        url: "https://www.who.int/publications/i/item/9789241504836",
        year: 2012,
        finding: "Strong recommendation to reduce sodium intake to less than 2,000 mg/day (5 g/day salt) in adults.",
      },
    ],
  },
  {
    name: "Carbonated Water",
    normalizedName: "carbonated water",
    aliases: ["sparkling water", "soda water", "carbonated water (water, carbon dioxide)", "ins 290", "e290"],
    insNumber: "INS 290",
    category: "Beverage Base",
    origin: "Natural",
    classification: "GREEN",
    classificationReason: "Hydrating, calorie-free beverage base created by dissolving pure carbon dioxide in drinking water.",
    description: "Potable drinking water into which carbon dioxide gas (CO2) has been dissolved under pressure, forming mild carbonic acid (H2CO3).",
    foodFunction: "Provides effervescent fizz, crisp tactile sensation, and sensory refreshment in cold drinks and sodas.",
    benefits: [
      "Calorie-free hydration identical to still water for body fluid balance.",
      "May promote feelings of satiety and aid gastric swallowing sensation.",
    ],
    risks: [
      "Mildly acidic (pH 4.5–5.5) due to carbonic acid, but dental erosion risk is negligible compared to sugar- and citric-acid-sweetened colas.",
      "Can trigger temporary burping, gastric distension, or gas in people with reflux or irritable bowel.",
    ],
    dailyIntake: {
      recommended: "Contributes toward 2.0 to 2.5 litres total daily water intake.",
      adi: null,
      maximum: null,
      unit: "L/day",
      basis: "Hydration requirements",
      status: "NOT_ESTABLISHED",
      explanation: "Water is an essential nutrient; carbonated water is evaluated as a wholesome hydrating liquid.",
    },
    precautions: [
      "Individuals with severe gastroesophageal reflux (GERD) or active gastritis may prefer non-carbonated water.",
    ],
    verdict: "Excellent, refreshing hydrating choice. Much healthier than sugar-laden sodas.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "General food and beverage standard (Codex, FSSAI, FDA)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on Dietary Reference Values for water",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/1459",
        year: 2010,
        finding: "Adequate intake of water for adults is 2.0 L/day for females and 2.5 L/day for males.",
      },
    ],
  },
  {
    name: "Caffeine",
    normalizedName: "caffeine",
    aliases: ["natural caffeine", "anhydrous caffeine", "coffee extract"],
    insNumber: null,
    category: "Flavour / Stimulant",
    origin: "Extracted",
    classification: "ORANGE",
    classificationReason: "Central nervous system stimulant; safe in moderate doses, but excessive or rapid consumption causes tachycardia, sleep disturbances, and anxiety.",
    description: "A natural methylxanthine alkaloid naturally occurring in coffee beans, tea leaves, and kola nuts, or synthetically manufactured for beverages.",
    foodFunction: "Imparts characteristic bitter flavour notes in colas and functions as an ergogenic cognitive and physical stimulant in energy drinks.",
    benefits: [
      "Improves alertness, concentration, reaction time, and physical endurance performance.",
    ],
    risks: [
      "Excessive acute intake (> 400 mg/day in adults) can induce insomnia, nervousness, cardiac palpitations, muscle tremors, and anxiety.",
      "Crosses the placental barrier with prolonged clearance kinetics in pregnancy.",
    ],
    dailyIntake: {
      recommended: null,
      adi: "Up to 400 mg/day is safe for healthy adults (EFSA); single doses up to 200 mg.",
      maximum: "400 mg/day for adults; 200 mg/day for pregnant or lactating women.",
      unit: "mg/day",
      basis: "Per adult per day",
      status: "ESTABLISHED",
      explanation: "Established by the EFSA Comprehensive Scientific Opinion on the Safety of Caffeine (2015). For pregnant women, intake should not exceed 200 mg/day.",
    },
    precautions: [
      "Pregnant or breastfeeding women must limit total caffeine from all sources to < 200 mg/day.",
      "Children and adolescents should avoid energy drinks.",
      "Individuals with cardiac arrhythmias or severe anxiety should avoid concentrated caffeine.",
    ],
    verdict: "Moderate intake is safe for most healthy adults. Strictly avoid high-dose energy drinks if pregnant or sensitive.",
    isAllergen: false,
    allergenType: null,
    evidenceLevel: "STRONG",
    verificationStatus: "VERIFIED",
    regulatoryStatus: "Regulated food additive and beverage ingredient with strict maximum concentration limits in energy drinks (FSSAI, FDA, EFSA)",
    sources: [
      {
        organization: "EFSA",
        title: "Scientific Opinion on the safety of caffeine",
        url: "https://www.efsa.europa.eu/en/efsajournal/pub/4102",
        year: 2015,
        finding: "Single doses up to 200 mg and daily intakes up to 400 mg raise no safety concerns for healthy adults.",
      },
    ],
  },
];

// In-memory lookup map for high-speed resolution
const INGREDIENT_LOOKUP = new Map<string, DetailedIngredientDefinition>();

// Build lookup map with normalized names, aliases, and INS codes
for (const item of SCIENTIFIC_INGREDIENT_DATABASE) {
  INGREDIENT_LOOKUP.set(item.normalizedName.toLowerCase(), item);
  for (const alias of item.aliases) {
    INGREDIENT_LOOKUP.set(alias.toLowerCase(), item);
  }
  if (item.insNumber) {
    INGREDIENT_LOOKUP.set(item.insNumber.toLowerCase().replace(/\s+/g, ""), item);
    INGREDIENT_LOOKUP.set(item.insNumber.toLowerCase(), item);
  }
}

/**
 * Clean and normalize an individual ingredient string, extracting declared quantities
 */
export function parseIngredientToken(rawToken: string): {
  cleanName: string;
  declaredQuantity: string | null;
  quantitySource: string | null;
  insNumber: string | null;
} {
  const trimmed = rawToken.trim();

  // 1. Extract declared percentage or quantity, e.g. "Mango Pulp (19.5%)", "Cocoa (55%)"
  const qtyMatch = trimmed.match(/\((\d+(?:\.\d+)?\s*(?:%|g|mg|ml))\)/i) ||
                   trimmed.match(/\b(\d+(?:\.\d+)?\s*(?:%|g|mg|ml))\b/i);
  const declaredQuantity = qtyMatch ? qtyMatch[1].trim() : null;
  const quantitySource = declaredQuantity ? "Declared on packaging label" : null;

  // 2. Extract INS / E number, e.g. "INS 471", "INS 500(ii)", "E471"
  const insMatch = trimmed.match(/\b(?:ins|e)\s*([0-9]{3,4}\s*(?:\([a-z0-9]+\)|[a-z]+)?)\b/i);
  const insNumber = insMatch ? `INS ${insMatch[1].replace(/\s+/g, "").toUpperCase()}` : null;

  // 3. Clean token for matching
  const cleanName = trimmed
    .replace(/\([^)]*\)/g, "") // remove parenthetical notes
    .replace(/[0-9\.\%]/g, "") // remove numbers & percentages
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return { cleanName, declaredQuantity, quantitySource, insNumber };
}

/**
 * Match a raw ingredient string against scientific intelligence database
 */
export function resolveIngredientIntelligence(
  rawToken: string,
  customDbIngredients: IngredientRecord[] = []
): IngredientMatchResult {
  const { cleanName, declaredQuantity, quantitySource, insNumber } = parseIngredientToken(rawToken);
  const rawLower = rawToken.toLowerCase();

  // 1. Check custom DB overrides first
  for (const custom of customDbIngredients) {
    const custNorm = custom.normalizedName.toLowerCase();
    const custAliases = (custom.aliases || []).map((a) => a.toLowerCase());
    if (
      cleanName === custNorm ||
      rawLower.includes(custNorm) ||
      custAliases.some((a) => cleanName === a || rawLower.includes(a))
    ) {
      const classification: IngredientClassification =
        custom.classification ||
        (custom.riskLevel === "avoid" ? "RED" : custom.riskLevel === "caution" ? "ORANGE" : "GREEN");

      return {
        raw: rawToken,
        normalized: custom.name || custom.normalizedName,
        riskLevel: custom.riskLevel,
        classification,
        classificationReason: custom.classificationReason || custom.description,
        insNumber: custom.insNumber || insNumber,
        category: custom.category,
        origin: custom.origin || "Manufactured / Synthetic",
        description: custom.description,
        foodFunction: custom.foodFunction || "Functional food component or additive.",
        benefits: custom.benefits || [],
        risks: custom.risks || custom.healthConcerns || [],
        dailyIntake: custom.dailyIntake || {
          recommended: null,
          adi: null,
          maximum: null,
          unit: null,
          basis: null,
          status: "NOT_ESTABLISHED",
          explanation: "No universally established recommended daily intake.",
        },
        precautions: custom.precautions || [],
        verdict: custom.verdict || "Configured in FoodDecode administrator database.",
        declaredQuantity,
        quantitySource,
        healthConcerns: custom.healthConcerns,
        isPalmOil: custom.isPalmOil,
        isAddedSugar: custom.isAddedSugar,
        isAllergen: custom.isAllergen,
        allergenType: custom.allergenType,
        regulatoryStatus: custom.regulatoryStatus,
        evidenceLevel: custom.evidenceLevel || "MODERATE",
        verificationStatus: custom.verificationStatus || "VERIFIED",
        sources: Array.isArray(custom.sources) && typeof custom.sources[0] === "object"
          ? (custom.sources as IngredientScientificSource[])
          : [],
      };
    }
  }

  // 2. Direct exact or alias lookup in Scientific Database
  let matched = INGREDIENT_LOOKUP.get(cleanName);

  // 3. INS number lookup if applicable
  if (!matched && insNumber) {
    const cleanIns = insNumber.toLowerCase().replace(/\s+/g, "");
    matched = INGREDIENT_LOOKUP.get(cleanIns) || INGREDIENT_LOOKUP.get(insNumber.toLowerCase());
  }

  // 4. Substring / fuzzy matching against scientific definitions
  if (!matched) {
    for (const def of SCIENTIFIC_INGREDIENT_DATABASE) {
      if (
        cleanName.includes(def.normalizedName) ||
        rawLower.includes(def.normalizedName) ||
        def.aliases.some((a) => cleanName.includes(a) || rawLower.includes(a))
      ) {
        matched = def;
        break;
      }
    }
  }

  // 5. If matched, construct full intelligence result
  if (matched) {
    const riskLevel =
      matched.classification === "RED" ? "avoid" : matched.classification === "ORANGE" ? "caution" : "safe";

    return {
      raw: rawToken,
      normalized: matched.name,
      riskLevel,
      classification: matched.classification,
      classificationReason: matched.classificationReason,
      insNumber: matched.insNumber || insNumber,
      category: matched.category,
      origin: matched.origin,
      description: matched.description,
      foodFunction: matched.foodFunction,
      benefits: matched.benefits,
      risks: matched.risks,
      dailyIntake: matched.dailyIntake,
      precautions: matched.precautions,
      verdict: matched.verdict,
      declaredQuantity,
      quantitySource,
      healthConcerns: matched.risks,
      isPalmOil: matched.normalizedName === "palm oil" || cleanName.includes("palm"),
      isAddedSugar: matched.normalizedName === "sugar" || cleanName.includes("sugar"),
      isAllergen: matched.isAllergen,
      allergenType: matched.allergenType,
      regulatoryStatus: matched.regulatoryStatus,
      evidenceLevel: matched.evidenceLevel,
      verificationStatus: matched.verificationStatus,
      sources: matched.sources,
    };
  }

  // 6. Fallback heuristic for uncatalogued ingredients
  const isAllergenMilk = rawLower.includes("milk") || rawLower.includes("dairy") || rawLower.includes("cream") || rawLower.includes("cheese");
  const isAllergenNut = rawLower.includes("almond") || rawLower.includes("peanut") || rawLower.includes("cashew") || rawLower.includes("walnut");
  const isAllergenWheat = rawLower.includes("wheat") || rawLower.includes("maida") || rawLower.includes("gluten");
  const isAllergenSoy = rawLower.includes("soy") || rawLower.includes("soya");

  const allergenType = isAllergenMilk ? "Milk / Dairy" : isAllergenNut ? "Tree Nuts / Peanuts" : isAllergenWheat ? "Wheat / Gluten" : isAllergenSoy ? "Soy" : null;
  const isAllergen = Boolean(allergenType);

  const isEOrIns = Boolean(insNumber) || /\b(?:e|ins)\s*[0-9]{3,4}\b/i.test(rawToken);

  return {
    raw: rawToken,
    normalized: cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : rawToken,
    riskLevel: isEOrIns ? "caution" : "safe",
    classification: isEOrIns ? "ORANGE" : "GREEN",
    classificationReason: isEOrIns
      ? "Food additive or processing aid; consume within approved regulatory limits."
      : "Standard food ingredient recognized as safe for human consumption.",
    insNumber: insNumber || null,
    category: isEOrIns ? "Additive" : "Whole Food / General",
    origin: isEOrIns ? "Manufactured / Synthetic" : "Natural",
    description: `Recognized food ingredient declared on packaging as "${rawToken}".`,
    foodFunction: isEOrIns ? "Used for technological stabilization, preservation, or texture." : "Provides flavour, bulk, or nutrition in food.",
    benefits: isEOrIns ? [] : ["Contributes to standard dietary intake."],
    risks: [],
    dailyIntake: {
      recommended: null,
      adi: null,
      maximum: null,
      unit: null,
      basis: null,
      status: "NOT_ESTABLISHED",
      explanation: "No universally established recommended daily intake.",
    },
    precautions: isAllergen ? [`Declared food allergen: ${allergenType}. Allergic individuals should strictly avoid.`] : [],
    verdict: isEOrIns
      ? "Standard regulated food additive. Consume in moderation as part of a varied diet."
      : "Standard food component. Consume as part of a balanced diet.",
    declaredQuantity,
    quantitySource,
    healthConcerns: [],
    isPalmOil: rawLower.includes("palm"),
    isAddedSugar: rawLower.includes("sugar") || rawLower.includes("syrup") || rawLower.includes("glucose"),
    isAllergen,
    allergenType,
    regulatoryStatus: "General food use",
    evidenceLevel: "PRELIMINARY",
    verificationStatus: "UNVERIFIED",
    sources: [],
  };
}

/**
 * Seed or update scientific ingredient definitions into MongoDB Atlas
 */
export async function seedScientificIngredientsToDb(): Promise<{ upserted: number; modified: number }> {
  const col = await getCollection<IngredientRecord>("ingredients");
  if (!col) return { upserted: 0, modified: 0 };

  let upserted = 0;
  let modified = 0;

  for (const def of SCIENTIFIC_INGREDIENT_DATABASE) {
    const record: IngredientRecord = {
      name: def.name,
      normalizedName: def.normalizedName,
      aliases: def.aliases,
      insNumber: def.insNumber,
      category: def.category,
      origin: def.origin,
      classification: def.classification,
      classificationReason: def.classificationReason,
      description: def.description,
      foodFunction: def.foodFunction,
      benefits: def.benefits,
      risks: def.risks,
      dailyIntake: def.dailyIntake,
      precautions: def.precautions,
      verdict: def.verdict,
      healthConcerns: def.risks,
      riskLevel: def.classification === "RED" ? "avoid" : def.classification === "ORANGE" ? "caution" : "safe",
      isPalmOil: def.normalizedName === "palm oil",
      isAddedSugar: def.normalizedName === "sugar",
      isAllergen: def.isAllergen,
      allergenType: def.allergenType || undefined,
      regulatoryStatus: def.regulatoryStatus,
      evidenceLevel: def.evidenceLevel,
      verificationStatus: def.verificationStatus,
      sources: def.sources,
      updatedAt: new Date().toISOString(),
    };

    const res = await col.updateOne(
      { normalizedName: def.normalizedName },
      { $set: record },
      { upsert: true }
    );

    if (res.upsertedCount > 0) upserted++;
    else if (res.modifiedCount > 0) modified++;
  }

  return { upserted, modified };
}
