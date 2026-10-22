export type RiskLevel = "safe" | "caution" | "avoid" | "unknown";
export type NutriScoreGrade = "A" | "B" | "C" | "D" | "E";
export type NovaGroup = 1 | 2 | 3 | 4;

export interface NutritionInfo {
  calories: number; // kcal
  totalFat: number; // g
  saturatedFat: number; // g
  transFat?: number; // g
  carbohydrates: number; // g
  sugars: number; // g
  addedSugars?: number; // g
  fiber: number; // g
  protein: number; // g
  sodium: number; // mg
  salt: number; // g
}

export interface IngredientMatchResult {
  raw: string;
  normalized: string;
  riskLevel: RiskLevel;
  category?: string;
  description?: string;
  healthConcerns?: string[];
  isPalmOil?: boolean;
  isAddedSugar?: boolean;
  isAllergen?: boolean;
  allergenType?: string;
  regulatoryStatus?: string; // e.g. "FDA GRAS", "Banned in EU", "Restricted"
}

export interface ProductItem {
  _id?: string;
  id?: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  servingSize?: string;
  imageUrl?: string;
  ingredientsText: string;
  ingredientsList: IngredientMatchResult[];
  nutritionPer100g: NutritionInfo;
  
  // Computed Scores
  nutriScore: NutriScoreGrade;
  nutriScoreScore?: number; // raw calculation score
  novaGroup: NovaGroup;
  overallScore: number; // 0 - 100
  scoreLabel: "Excellent" | "Good" | "Moderate" | "Poor" | "Bad";
  
  // Flags & Alerts
  hasPalmOil: boolean;
  hasAddedSugar: boolean;
  hasHighSodium: boolean;
  hasHighSaturatedFat: boolean;
  hasArtificialAdditives: boolean;
  isUltraProcessed: boolean;
  allergens: string[];
  ingredientAlerts: string[];
  
  // Metadata & Verification
  dataCompleteness: number; // 0 - 100%
  verified: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  source: "openfoodfacts" | "manual" | "barcode_scan" | "admin" | "submission";
  sourceUrl?: string;
  isSample?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface IngredientRecord {
  _id?: string;
  name: string;
  normalizedName: string;
  aliases: string[];
  category: "sweetener" | "preservative" | "color" | "emulsifier" | "fat_oil" | "grain" | "protein" | "additive" | "vitamin" | "general";
  riskLevel: RiskLevel;
  description: string;
  healthConcerns: string[];
  isPalmOil?: boolean;
  isAddedSugar?: boolean;
  isAllergen?: boolean;
  allergenType?: string;
  regulatoryStatus: string;
  sources?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRecord {
  _id?: string;
  slug: string;
  name: string;
  icon?: string;
  description: string;
  parentCategory?: string;
  productCount?: number;
}

export interface BrandRecord {
  _id?: string;
  slug: string;
  name: string;
  country?: string;
  productCount?: number;
  logoUrl?: string;
  website?: string;
}

export interface AnalysisRule {
  _id?: string;
  version: number;
  name: string;
  category: string; // "general" or specific category
  rules: {
    sugarWeight: number; // penalty factor
    satFatWeight: number;
    sodiumWeight: number;
    additiveWeight: number;
    fiberBonus: number;
    proteinBonus: number;
    novaPenalties: Record<NovaGroup, number>;
  };
  isActive: boolean;
  updatedAt: string;
}

export interface ProductSubmission {
  _id?: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  ingredientsText: string;
  nutritionFacts: Partial<NutritionInfo>;
  submittedBy?: string;
  submitterEmail?: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ImportJob {
  _id?: string;
  source: "openfoodfacts" | "csv_upload" | "json_upload" | "barcode_single";
  type: "bulk" | "single";
  status: "pending" | "processing" | "completed" | "failed";
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  errors?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id?: string;
  action: string;
  entityType: "product" | "ingredient" | "rule" | "import" | "submission";
  entityId?: string;
  performedBy: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
