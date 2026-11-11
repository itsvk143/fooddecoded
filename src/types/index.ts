export type RiskLevel = "safe" | "caution" | "avoid" | "unknown";
export type IngredientClassification = "GREEN" | "ORANGE" | "RED";

export interface IngredientDailyIntake {
  recommended?: string | null;
  adi?: string | null;
  maximum?: string | null;
  unit?: string | null;
  basis?: string | null;
  status: "ESTABLISHED" | "NOT_ESTABLISHED" | "NOT_SPECIFIED";
  explanation: string;
}

export interface IngredientScientificSource {
  organization: string;
  title: string;
  url: string;
  year?: number | string;
  finding?: string;
  verificationStatus?: "VERIFIED" | "REVIEWED";
}
export type NutriScoreGrade = "A" | "B" | "C" | "D" | "E";
export type NovaGroup = 1 | 2 | 3 | 4;

export interface NutritionInfo {
  calories: number; // kcal
  totalFat: number; // g
  fat?: number | null;
  saturatedFat: number; // g
  transFat?: number | null; // g
  carbohydrates: number; // g
  sugars: number; // g
  addedSugars?: number | null; // g
  fiber: number; // g
  protein: number; // g
  sodium: number; // mg
  salt: number; // g
}

export interface IngredientMatchResult {
  raw: string;
  normalized: string;
  riskLevel: RiskLevel;
  classification?: IngredientClassification;
  classificationReason?: string;
  insNumber?: string | null;
  category?: string | null;
  origin?: "Natural" | "Extracted" | "Fermentation-derived" | "Manufactured / Synthetic" | "Mineral / Inorganic" | string | null;
  description?: string | null;
  foodFunction?: string | null;
  benefits?: string[] | null;
  risks?: string[] | null;
  dailyIntake?: IngredientDailyIntake | null;
  precautions?: string[] | null;
  verdict?: string | null;
  declaredQuantity?: string | null;
  quantitySource?: string | null;
  healthConcerns?: string[] | null;
  isPalmOil?: boolean | null;
  isAddedSugar?: boolean | null;
  isAllergen?: boolean | null;
  allergenType?: string | null;
  regulatoryStatus?: string | null; // e.g. "FDA GRAS", "Banned in EU", "Restricted"
  evidenceLevel?: "STRONG" | "MODERATE" | "PRELIMINARY" | string | null;
  verificationStatus?: "VERIFIED" | "NEEDS_REVIEW" | "UNVERIFIED" | string | null;
  sources?: IngredientScientificSource[] | null;
}

export type ProductVerificationStatus =
  | "FULLY_VERIFIED"
  | "DATA_VERIFIED"
  | "IMAGE_VERIFIED"
  | "NEEDS_REVIEW"
  | "IMAGE_MISSING"
  | "IMAGE_MISMATCH";

export type ImageStatus =
  | "VERIFIED"
  | "IMAGE_VERIFIED"
  | "FULLY_VERIFIED"
  | "PLACEHOLDER"
  | "MISSING"
  | "IMAGE_MISSING"
  | "MISMATCH"
  | "IMAGE_MISMATCH"
  | "NEEDS_REVIEW"
  | "UNCERTAIN";

export interface ProductItem {
  _id?: string;
  id?: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  categorySlug?: string | null;
  subCategory?: string | null;
  servingSize?: string | null;
  imageUrl?: string | null;
  imageSourceUrl?: string | null;
  imageStatus?: ImageStatus | null;
  imageVerified?: boolean | null;
  imageVerifiedAt?: string | null;
  imageVerificationNote?: string | null;
  verificationStatus?: ProductVerificationStatus | null;
  ingredientsText: string;
  ingredientsList: IngredientMatchResult[];
  nutritionPer100g: NutritionInfo;
  
  // Computed Scores
  nutriScore: NutriScoreGrade;
  nutriScoreScore?: number | null; // raw calculation score
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
  verificationDate?: string | null;
  verifiedBy?: string | null;
  source: "openfoodfacts" | "manual" | "barcode_scan" | "admin" | "submission";
  sourceUrl?: string | null;
  isSample?: boolean;
  
  // Extended Catalogue & Management Fields
  productType?: string | null;
  flavour?: string | null;
  packageSize?: string | null;
  packageUnit?: string | null;
  manufacturer?: string | null;
  countryOfOrigin?: string | null;
  cocoaPercentage?: number | string | null;
  availability?: "VERIFIED_AVAILABLE" | "VERIFIED_DISCONTINUED" | "LIMITED_EDITION" | "IMPORTED_AVAILABILITY_UNCONFIRMED" | "PRODUCT_UNVERIFIED" | string | null;
  sourceCatalogue?: "Initial Catalogue" | "Additional Catalogue" | "Premium Worldwide Collection" | null;
  importReferenceNumber?: number | null;
  productId?: string | null;
  biscuitSection?: string | null;
  biscuitType?: string | null;
  cerealSection?: string | null;
  cerealType?: string | null;
  primaryIngredient?: string | null;
  targetAge?: string | null;
  dietarySuitability?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSugarFree?: boolean;
    isOrganic?: boolean;
  } | null;
  searchTags?: string[] | null;
  isArchived?: boolean;
  archivedAt?: string | null;
  dataStatus?: "verified" | "incomplete" | "under_review";
  description?: string | null;
  auditHistory?: Array<{
    action: string;
    timestamp: string;
    performedBy: string;
    details?: string;
    changes?: Record<string, { old: any; new: any }>;
  }>;
  
  createdAt: string;
  updatedAt: string;
}

export interface IngredientRecord {
  _id?: string;
  name: string;
  normalizedName: string;
  aliases: string[];
  insNumber?: string | null;
  category: "sweetener" | "preservative" | "color" | "emulsifier" | "fat_oil" | "grain" | "protein" | "additive" | "vitamin" | "dairy" | "stabilizer" | "acid" | "fiber" | "general" | string;
  riskLevel: RiskLevel;
  classification?: IngredientClassification;
  classificationReason?: string;
  origin?: "Natural" | "Extracted" | "Fermentation-derived" | "Manufactured / Synthetic" | "Mineral / Inorganic" | string;
  description: string;
  foodFunction?: string;
  benefits?: string[];
  risks?: string[];
  dailyIntake?: IngredientDailyIntake;
  precautions?: string[];
  verdict?: string;
  healthConcerns: string[];
  isPalmOil?: boolean;
  isAddedSugar?: boolean;
  isAllergen?: boolean;
  allergenType?: string;
  regulatoryStatus: string;
  evidenceLevel?: "STRONG" | "MODERATE" | "PRELIMINARY" | string;
  verificationStatus?: "VERIFIED" | "NEEDS_REVIEW" | "UNVERIFIED" | string;
  sources?: (IngredientScientificSource | string)[];
  createdAt?: string;
  updatedAt?: string;
  lastReviewedAt?: string;
}

export interface CategoryRecord {
  _id?: string;
  slug: string;
  name: string;
  icon?: string;
  description: string;
  parentCategory?: string;
  productCount?: number;
  subCategories?: string[];
  displayOrder?: number;
  isActive?: boolean;
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
  imageSourceUrl?: string;
  imageStatus?: "VERIFIED" | "PLACEHOLDER" | "MISMATCH" | "MISSING" | "UNCERTAIN";
  imageVerifiedAt?: string;
  imageVerificationNote?: string;
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
  entityType: "product" | "ingredient" | "rule" | "import" | "submission" | "category" | "brand";
  entityId?: string;
  performedBy: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
