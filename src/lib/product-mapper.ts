import { SlimProductItem } from "@/types";

/**
 * Pure, universal mapper that transforms any database doc or ProductItem
 * into a lightweight SlimProductItem. Zero Node.js dependencies.
 */
export function mapToSlimProduct(p: any): SlimProductItem {
  const prodId = p.id || (p._id ? p._id.toString() : p.barcode);
  const protein = p.nutritionPer100g?.protein ?? p.proteinPer100g ?? 0;
  const sugar = p.nutritionPer100g?.sugars ?? p.nutritionPer100g?.sugar ?? p.sugarPer100g ?? 0;
  const sodium = p.nutritionPer100g?.sodium ?? p.sodiumPer100g ?? 0;
  const hasPalmOil = p.hasPalmOil === true;
  const isVerified = p.verified === true;

  return {
    _id: prodId,
    id: prodId,
    barcode: p.barcode,
    name: p.name,
    brand: p.brand,
    category: p.category,
    categorySlug: p.categorySlug || null,
    subCategory: p.subCategory || null,
    overallScore: p.overallScore ?? 50,
    score: p.overallScore ?? 50,
    scoreLabel: p.scoreLabel || "Moderate",
    nutriScore: p.nutriScore || "C",
    novaGroup: p.novaGroup || 3,
    proteinPer100g: Number(protein) || 0,
    sugarPer100g: Number(sugar) || 0,
    sodiumPer100g: Number(sodium) || 0,
    isPalmOilFree: !hasPalmOil,
    hasPalmOil,
    hasAddedSugar: p.hasAddedSugar === true,
    hasHighSodium: p.hasHighSodium === true,
    hasArtificialAdditives: p.hasArtificialAdditives === true,
    isVerified,
    verified: isVerified,
    imageStatus: p.imageStatus || null,
    imageVerified: p.imageVerified ?? null,
    imageUrl: p.imageUrl || "/images/placeholder-product.svg",
    createdAt: p.createdAt || new Date().toISOString(),
    availability: p.availability || null,
    countryOfOrigin: p.countryOfOrigin || null,
    cocoaPercentage: p.cocoaPercentage != null ? Number(p.cocoaPercentage) : null,
  };
}
