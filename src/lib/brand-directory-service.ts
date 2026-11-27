import { Collection, Filter } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { getInMemoryProducts } from "@/lib/product-service";
import { ProductItem } from "@/types";

export interface BrandVariantCount {
  name: string;
  count: number;
}

export interface BrandDirectoryEntry {
  normalizedBrand: string;
  displayName: string;
  variants: BrandVariantCount[];
  hasCaseOrWhitespaceVariants: boolean;
  totalProducts: number;
  activeProducts: number;
  archivedProducts: number;
  categories: string[];
  missingImages: number;
  verifiedImages: number;
  incompleteProducts: number;
  dataCompleteness: number;
}

export interface BrandAnalytics {
  totalUniqueBrands: number;
  totalProductsInDatabase: number;
  totalProductsMappedToBrands: number;
  brandsWith1Product: number;
  brandsWith2To5Products: number;
  brandsWith6To10Products: number;
  brandsWithOver10Products: number;
  unbrandedProductsCount: number;
  highestProductBrand: { name: string; count: number } | null;
  lowestProductBrand: { name: string; count: number } | null;
}

export interface BrandDuplicateSpellingGroup {
  canonicalKey: string;
  brands: Array<{
    normalizedBrand: string;
    displayName: string;
    count: number;
    variants: string[];
  }>;
  totalAffectedProducts: number;
  reason: string;
}

export interface BrandIntegrityProductIssue {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  issueType: "missing_brand" | "incorrect_brand" | "multi_brand";
  reason: string;
}

export interface BrandIntegritySummary {
  duplicateSpellingGroups: BrandDuplicateSpellingGroup[];
  variantCaseSpellingCount: number;
  missingBrandCount: number;
  missingBrandSamples: BrandIntegrityProductIssue[];
  incorrectBrandCount: number;
  incorrectBrandSamples: BrandIntegrityProductIssue[];
  multiBrandCount: number;
  multiBrandSamples: BrandIntegrityProductIssue[];
}

export interface BrandDirectoryQueryOptions {
  q?: string;
  productCountRange?: "all" | "1" | "2-5" | "6-10" | "10+";
  category?: string;
  hasIncomplete?: boolean;
  hasMissingImages?: boolean;
  sortBy?: "count_desc" | "count_asc" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

export interface BrandDirectoryResponse {
  brands: BrandDirectoryEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  analytics: BrandAnalytics;
  integrity: BrandIntegritySummary;
  availableCategories: string[];
  source: "mongodb_aggregation" | "in_memory_fallback";
}

export interface BrandProductRow {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  imageUrl: string;
  imageStatus: string;
  isMissingImage: boolean;
  barcode: string;
  ingredientsStatus: "Complete" | "Missing";
  nutritionStatus: "Complete" | "Incomplete" | "Missing";
  productDataStatus: "verified" | "incomplete" | "under_review";
  dataCompleteness: number;
}

export interface BrandProductsResponse {
  brand: string;
  displayName: string;
  products: BrandProductRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RawBrandBucket {
  _id: {
    isMissingBrand: boolean;
    rawBrand: string;
  };
  count: number;
  activeProducts: number;
  archivedProducts: number;
  categories: string[];
  missingImages: number;
  verifiedImages: number;
  incompleteProducts: number;
  completenessSum: number;
}

const PLACEHOLDER_BRAND_REGEX =
  /^(unknown|independent|generic|unbranded|n\/a|na|none|null|undefined|test|sample|other|misc|[0-9]+|.{1})$/i;

// Known legitimate ampersand brand names so we do not falsely flag them as multi-brand
const KNOWN_AMPERSAND_BRANDS = new Set([
  "ben & jerry's",
  "ben & jerrys",
  "johnson & johnson",
  "procter & gamble",
  "p&g",
  "m&m's",
  "m&ms",
  "l&t",
  "h&m",
  "marks & spencer",
  "m&s",
  "tata & sons",
  "arm & hammer",
  "baskin & robbins",
  "seagram & sons",
  "pernod & ricard",
]);

/**
 * Normalize brand string for grouping while preserving original capitalization elsewhere.
 * Trims whitespace, collapses repeated internal whitespace, normalizes smart apostrophes, and lowercases.
 */
export function normalizeBrandKey(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Canonical alphanumeric comparison key for detecting suspected spelling duplicates
 * (e.g., "Lay's" vs "Lays", "Haldiram's" vs "Haldiram", "Nestle" vs "Nestlé").
 */
export function canonicalBrandSpellingKey(raw: string): string {
  const alnum = normalizeBrandKey(raw)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  return alnum.length >= 5 ? alnum.replace(/s$/, "") : alnum;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds a case/whitespace/apostrophe-flexible anchored MongoDB regex from a normalized brand key
 * so querying by normalized brand matches all capitalization and whitespace variants cleanly.
 */
function buildBrandMatchRegex(normalizedBrand: string): RegExp {
  const parts = normalizedBrand.split(" ").map((token) => {
    const escaped = escapeRegExp(token).replace(/'/g, "['\\u2018\\u2019\\u02BC]");
    return escaped;
  });
  return new RegExp(`^\\s*${parts.join("\\s+")}\\s*$`, "i");
}

function isProductMissingImage(p: Partial<ProductItem>): boolean {
  return (
    !p.imageUrl ||
    p.imageUrl.includes("placeholder") ||
    p.imageStatus === "MISSING" ||
    p.imageStatus === "IMAGE_MISSING"
  );
}

function isProductIncomplete(p: Partial<ProductItem>): boolean {
  return (
    (p.dataCompleteness ?? 100) < 60 ||
    !p.barcode ||
    !String(p.barcode).trim() ||
    !p.ingredientsText ||
    !String(p.ingredientsText).trim()
  );
}

export function computeBrandProductStatuses(p: ProductItem): BrandProductRow {
  const missingImg = isProductMissingImage(p);
  const hasIngredients = Boolean(p.ingredientsText && p.ingredientsText.trim().length > 3);
  const ingredientsStatus: "Complete" | "Missing" = hasIngredients ? "Complete" : "Missing";

  const n = p.nutritionPer100g;
  const nutritionFieldCount = n
    ? [n.calories, n.totalFat, n.carbohydrates, n.sugars, n.protein, n.sodium, n.fiber].filter(
        (v) => typeof v === "number" && !Number.isNaN(v) && v >= 0
      ).length
    : 0;
  const hasNonZeroNutrition = n
    ? (n.calories ?? 0) > 0 ||
      (n.totalFat ?? 0) > 0 ||
      (n.carbohydrates ?? 0) > 0 ||
      (n.protein ?? 0) > 0 ||
      (n.sodium ?? 0) > 0
    : false;
  const nutritionStatus: "Complete" | "Incomplete" | "Missing" =
    nutritionFieldCount >= 5 && hasNonZeroNutrition
      ? "Complete"
      : nutritionFieldCount > 0
      ? "Incomplete"
      : "Missing";

  let productDataStatus: "verified" | "incomplete" | "under_review" = p.dataStatus || "incomplete";
  if (!p.dataStatus) {
    if (p.verified && !isProductIncomplete(p) && nutritionStatus === "Complete") {
      productDataStatus = "verified";
    } else if (isProductIncomplete(p)) {
      productDataStatus = "incomplete";
    } else {
      productDataStatus = "under_review";
    }
  }

  return {
    id: String(p.id || p._id || p.barcode),
    _id: p._id ? String(p._id) : undefined,
    name: p.name || "Unnamed Product",
    brand: p.brand || "",
    category: p.category || "Uncategorized",
    subCategory: p.subCategory || "—",
    imageUrl: p.imageUrl || "/images/placeholder-product.svg",
    imageStatus: p.imageStatus || (missingImg ? "MISSING" : "UNCERTAIN"),
    isMissingImage: missingImg,
    barcode: p.barcode || "—",
    ingredientsStatus,
    nutritionStatus,
    productDataStatus,
    dataCompleteness: p.dataCompleteness ?? (isProductIncomplete(p) ? 45 : 85),
  };
}

function mergeRawBrandBuckets(buckets: RawBrandBucket[]): {
  entries: BrandDirectoryEntry[];
  unbrandedCount: number;
  totalProductsInDb: number;
} {
  let unbrandedCount = 0;
  let totalProductsInDb = 0;

  interface MutableBrandAcc {
    normalizedBrand: string;
    variantMap: Map<string, number>;
    totalProducts: number;
    activeProducts: number;
    archivedProducts: number;
    categorySet: Set<string>;
    missingImages: number;
    verifiedImages: number;
    incompleteProducts: number;
    completenessSum: number;
  }

  const accMap = new Map<string, MutableBrandAcc>();

  for (const b of buckets) {
    totalProductsInDb += b.count;
    const rawTrimmed = (b._id.rawBrand || "").trim();
    const norm = normalizeBrandKey(rawTrimmed);

    if (b._id.isMissingBrand || !norm) {
      unbrandedCount += b.count;
      continue;
    }

    let acc = accMap.get(norm);
    if (!acc) {
      acc = {
        normalizedBrand: norm,
        variantMap: new Map<string, number>(),
        totalProducts: 0,
        activeProducts: 0,
        archivedProducts: 0,
        categorySet: new Set<string>(),
        missingImages: 0,
        verifiedImages: 0,
        incompleteProducts: 0,
        completenessSum: 0,
      };
      accMap.set(norm, acc);
    }

    acc.variantMap.set(rawTrimmed, (acc.variantMap.get(rawTrimmed) || 0) + b.count);
    acc.totalProducts += b.count;
    acc.activeProducts += b.activeProducts;
    acc.archivedProducts += b.archivedProducts;
    for (const c of b.categories || []) {
      if (c && c.trim()) acc.categorySet.add(c.trim());
    }
    acc.missingImages += b.missingImages;
    acc.verifiedImages += b.verifiedImages;
    acc.incompleteProducts += b.incompleteProducts;
    acc.completenessSum += b.completenessSum;
  }

  const entries: BrandDirectoryEntry[] = [];
  for (const acc of accMap.values()) {
    const variants: BrandVariantCount[] = Array.from(acc.variantMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const displayName = variants[0]?.name || acc.normalizedBrand;
    const avgCompleteness =
      acc.totalProducts > 0 ? Math.round(acc.completenessSum / acc.totalProducts) : 100;

    entries.push({
      normalizedBrand: acc.normalizedBrand,
      displayName,
      variants,
      hasCaseOrWhitespaceVariants: variants.length > 1,
      totalProducts: acc.totalProducts,
      activeProducts: acc.activeProducts,
      archivedProducts: acc.archivedProducts,
      categories: Array.from(acc.categorySet).sort((a, b) => a.localeCompare(b)),
      missingImages: acc.missingImages,
      verifiedImages: acc.verifiedImages,
      incompleteProducts: acc.incompleteProducts,
      dataCompleteness: avgCompleteness,
    });
  }

  return { entries, unbrandedCount, totalProductsInDb };
}

async function aggregateBucketsFromMongo(col: Collection<ProductItem>): Promise<RawBrandBucket[]> {
  const pipeline = [
    {
      $project: {
        brand: 1,
        category: 1,
        isArchived: 1,
        imageUrl: 1,
        imageStatus: 1,
        barcode: 1,
        ingredientsText: 1,
        dataCompleteness: 1,
      },
    },
    {
      $addFields: {
        rawTrimmedBrand: {
          $trim: {
            input: { $toString: { $ifNull: ["$brand", ""] } },
          },
        },
      },
    },
    {
      $addFields: {
        isMissingBrand: { $eq: [{ $strLenCP: "$rawTrimmedBrand" }, 0] },
        missingImg: {
          $cond: [
            {
              $or: [
                { $eq: [{ $ifNull: ["$imageUrl", ""] }, ""] },
                { $regexMatch: { input: { $ifNull: ["$imageUrl", ""] }, regex: "placeholder", options: "i" } },
                { $in: [{ $ifNull: ["$imageStatus", ""] }, ["MISSING", "IMAGE_MISSING"]] },
              ],
            },
            1,
            0,
          ],
        },
        verifiedImg: {
          $cond: [
            {
              $and: [
                { $eq: [{ $ifNull: ["$imageStatus", ""] }, "VERIFIED"] },
                { $ne: [{ $ifNull: ["$imageUrl", ""] }, ""] },
                {
                  $not: [
                    { $regexMatch: { input: { $ifNull: ["$imageUrl", ""] }, regex: "placeholder", options: "i" } },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
        incompleteProd: {
          $cond: [
            {
              $or: [
                { $lt: [{ $ifNull: ["$dataCompleteness", 100] }, 60] },
                { $eq: [{ $trim: { input: { $toString: { $ifNull: ["$barcode", ""] } } } }, ""] },
                { $eq: [{ $trim: { input: { $toString: { $ifNull: ["$ingredientsText", ""] } } } }, ""] },
              ],
            },
            1,
            0,
          ],
        },
        completenessVal: { $ifNull: ["$dataCompleteness", 100] },
      },
    },
    {
      $group: {
        _id: {
          isMissingBrand: "$isMissingBrand",
          rawBrand: "$rawTrimmedBrand",
        },
        count: { $sum: 1 },
        activeProducts: { $sum: { $cond: [{ $ne: ["$isArchived", true] }, 1, 0] } },
        archivedProducts: { $sum: { $cond: [{ $eq: ["$isArchived", true] }, 1, 0] } },
        categories: { $addToSet: { $ifNull: ["$category", "Uncategorized"] } },
        missingImages: { $sum: "$missingImg" },
        verifiedImages: { $sum: "$verifiedImg" },
        incompleteProducts: { $sum: "$incompleteProd" },
        completenessSum: { $sum: "$completenessVal" },
      },
    },
  ];

  return (await col.aggregate<RawBrandBucket>(pipeline).toArray()) || [];
}

function buildBucketsFromInMemory(products: ProductItem[]): RawBrandBucket[] {
  const bucketMap = new Map<string, RawBrandBucket & { catSet: Set<string> }>();

  for (const p of products) {
    const rawTrimmed = typeof p.brand === "string" ? p.brand.trim() : "";
    const isMissingBrand = rawTrimmed.length === 0;
    const bucketKey = `${isMissingBrand ? "1" : "0"}::${rawTrimmed}`;

    let bucket = bucketMap.get(bucketKey);
    if (!bucket) {
      bucket = {
        _id: { isMissingBrand, rawBrand: rawTrimmed },
        count: 0,
        activeProducts: 0,
        archivedProducts: 0,
        categories: [],
        catSet: new Set<string>(),
        missingImages: 0,
        verifiedImages: 0,
        incompleteProducts: 0,
        completenessSum: 0,
      };
      bucketMap.set(bucketKey, bucket);
    }

    bucket.count += 1;
    if (p.isArchived !== true) bucket.activeProducts += 1;
    else bucket.archivedProducts += 1;

    bucket.catSet.add(p.category || "Uncategorized");
    if (isProductMissingImage(p)) bucket.missingImages += 1;
    else if (p.imageStatus === "VERIFIED") bucket.verifiedImages += 1;
    if (isProductIncomplete(p)) bucket.incompleteProducts += 1;
    bucket.completenessSum += p.dataCompleteness ?? 100;
  }

  return Array.from(bucketMap.values()).map(({ catSet, ...rest }) => ({
    ...rest,
    categories: Array.from(catSet),
  }));
}

function detectMultiBrandReason(brandRaw: string, knownBrandKeys: Set<string>): string | null {
  const norm = normalizeBrandKey(brandRaw);
  if (!norm || KNOWN_AMPERSAND_BRANDS.has(norm)) return null;

  if (/[,;/|]/.test(brandRaw)) {
    const parts = brandRaw
      .split(/[,;/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      return `Contains multi-brand delimiter (${parts.join(" + ")})`;
    }
  }

  if (/\s+&\s+/.test(brandRaw)) {
    const parts = brandRaw.split(/\s+&\s+/).map((s) => normalizeBrandKey(s));
    const knownMatches = parts.filter((part) => knownBrandKeys.has(part));
    if (knownMatches.length >= 2) {
      return `Combines multiple known brands via "&" (${parts.join(" & ")})`;
    }
  }

  return null;
}

function detectDuplicateSpellingGroups(entries: BrandDirectoryEntry[]): BrandDuplicateSpellingGroup[] {
  const canonicalGroups = new Map<string, BrandDirectoryEntry[]>();

  for (const entry of entries) {
    const canonical = canonicalBrandSpellingKey(entry.displayName);
    if (!canonical || canonical.length < 3) continue;
    const list = canonicalGroups.get(canonical) || [];
    list.push(entry);
    canonicalGroups.set(canonical, list);
  }

  const groups: BrandDuplicateSpellingGroup[] = [];

  for (const [canonicalKey, brandList] of canonicalGroups.entries()) {
    if (brandList.length > 1) {
      const sorted = [...brandList].sort((a, b) => b.totalProducts - a.totalProducts);
      groups.push({
        canonicalKey,
        brands: sorted.map((b) => ({
          normalizedBrand: b.normalizedBrand,
          displayName: b.displayName,
          count: b.totalProducts,
          variants: b.variants.map((v) => v.name),
        })),
        totalAffectedProducts: sorted.reduce((sum, b) => sum + b.totalProducts, 0),
        reason: "Differing punctuation, diacritics, spacing, or possessive spelling",
      });
    }
  }

  // Also flag single normalized brands that contain >1 capitalization/whitespace spelling variant
  for (const entry of entries) {
    if (entry.variants.length > 1) {
      const canonicalKey = canonicalBrandSpellingKey(entry.displayName);
      const alreadyReported = groups.some((g) => g.canonicalKey === canonicalKey);
      if (!alreadyReported) {
        groups.push({
          canonicalKey: `variant:${entry.normalizedBrand}`,
          brands: entry.variants.map((v) => ({
            normalizedBrand: entry.normalizedBrand,
            displayName: v.name,
            count: v.count,
            variants: [v.name],
          })),
          totalAffectedProducts: entry.totalProducts,
          reason: "Capitalization or extra whitespace variations across products",
        });
      }
    }
  }

  return groups.sort((a, b) => b.totalAffectedProducts - a.totalAffectedProducts);
}

async function computeBrandIntegrity(
  col: Collection<ProductItem> | null,
  entries: BrandDirectoryEntry[],
  unbrandedCount: number
): Promise<BrandIntegritySummary> {
  const duplicateSpellingGroups = detectDuplicateSpellingGroups(entries);
  const variantCaseSpellingCount = entries.filter((e) => e.variants.length > 1).length;
  const knownBrandKeys = new Set(entries.map((e) => e.normalizedBrand));

  let missingBrandSamples: BrandIntegrityProductIssue[] = [];
  let incorrectBrandSamples: BrandIntegrityProductIssue[] = [];
  let multiBrandSamples: BrandIntegrityProductIssue[] = [];
  let incorrectBrandCount = 0;
  let multiBrandCount = 0;

  if (col) {
    const missingBrandFilter = {
      $or: [{ brand: null }, { brand: "" }, { brand: { $regex: "^\\s*$" } }],
    } as unknown as Filter<ProductItem>;

    const [missingDocs, incorrectDocs, multiCandidateDocs] = await Promise.all([
      col
        .find(missingBrandFilter)
        .project({ _id: 1, id: 1, barcode: 1, name: 1, brand: 1, category: 1, subCategory: 1 })
        .limit(25)
        .toArray(),
      col
        .find({
          brand: {
            $regex:
              "^(unknown|independent|generic|unbranded|n/?a|none|null|undefined|test|sample|other|misc|[0-9]+|.{1})$",
            $options: "i",
          },
        })
        .project({ _id: 1, id: 1, barcode: 1, name: 1, brand: 1, category: 1, subCategory: 1 })
        .limit(50)
        .toArray(),
      col
        .find({ brand: { $regex: "(,|/|;|\\||\\s+&\\s+)" } })
        .project({ _id: 1, id: 1, barcode: 1, name: 1, brand: 1, category: 1, subCategory: 1 })
        .limit(100)
        .toArray(),
    ]);

    incorrectBrandCount = await col.countDocuments({
      brand: {
        $regex:
          "^(unknown|independent|generic|unbranded|n/?a|none|null|undefined|test|sample|other|misc|[0-9]+|.{1})$",
        $options: "i",
      },
    });

    missingBrandSamples = missingDocs.map((d) => ({
      id: String(d.id || d._id || d.barcode),
      barcode: String(d.barcode || "—"),
      name: String(d.name || "Unnamed Product"),
      brand: String(d.brand || ""),
      category: String(d.category || "Uncategorized"),
      subCategory: String(d.subCategory || "—"),
      issueType: "missing_brand",
      reason: "Brand field is empty or null",
    }));

    incorrectBrandSamples = incorrectDocs.slice(0, 25).map((d) => ({
      id: String(d.id || d._id || d.barcode),
      barcode: String(d.barcode || "—"),
      name: String(d.name || "Unnamed Product"),
      brand: String(d.brand || ""),
      category: String(d.category || "Uncategorized"),
      subCategory: String(d.subCategory || "—"),
      issueType: "incorrect_brand",
      reason: `Placeholder or non-brand identifier "${String(d.brand || "")}"`,
    }));

    const multiFlagged: BrandIntegrityProductIssue[] = [];
    for (const d of multiCandidateDocs) {
      const reason = detectMultiBrandReason(String(d.brand || ""), knownBrandKeys);
      if (reason) {
        multiFlagged.push({
          id: String(d.id || d._id || d.barcode),
          barcode: String(d.barcode || "—"),
          name: String(d.name || "Unnamed Product"),
          brand: String(d.brand || ""),
          category: String(d.category || "Uncategorized"),
          subCategory: String(d.subCategory || "—"),
          issueType: "multi_brand",
          reason,
        });
      }
    }
    multiBrandCount = multiFlagged.length;
    multiBrandSamples = multiFlagged.slice(0, 25);
  } else {
    const all = getInMemoryProducts();
    for (const p of all) {
      const trimmed = typeof p.brand === "string" ? p.brand.trim() : "";
      if (!trimmed) {
        if (missingBrandSamples.length < 25) {
          missingBrandSamples.push({
            id: String(p.id || p._id || p.barcode),
            barcode: p.barcode || "—",
            name: p.name || "Unnamed Product",
            brand: p.brand || "",
            category: p.category || "Uncategorized",
            subCategory: p.subCategory || "—",
            issueType: "missing_brand",
            reason: "Brand field is empty or null",
          });
        }
        continue;
      }

      if (PLACEHOLDER_BRAND_REGEX.test(trimmed)) {
        incorrectBrandCount += 1;
        if (incorrectBrandSamples.length < 25) {
          incorrectBrandSamples.push({
            id: String(p.id || p._id || p.barcode),
            barcode: p.barcode || "—",
            name: p.name || "Unnamed Product",
            brand: p.brand || "",
            category: p.category || "Uncategorized",
            subCategory: p.subCategory || "—",
            issueType: "incorrect_brand",
            reason: `Placeholder or non-brand identifier "${trimmed}"`,
          });
        }
      }

      const multiReason = detectMultiBrandReason(trimmed, knownBrandKeys);
      if (multiReason) {
        multiBrandCount += 1;
        if (multiBrandSamples.length < 25) {
          multiBrandSamples.push({
            id: String(p.id || p._id || p.barcode),
            barcode: p.barcode || "—",
            name: p.name || "Unnamed Product",
            brand: p.brand || "",
            category: p.category || "Uncategorized",
            subCategory: p.subCategory || "—",
            issueType: "multi_brand",
            reason: multiReason,
          });
        }
      }
    }
  }

  return {
    duplicateSpellingGroups,
    variantCaseSpellingCount,
    missingBrandCount: unbrandedCount,
    missingBrandSamples,
    incorrectBrandCount,
    incorrectBrandSamples,
    multiBrandCount,
    multiBrandSamples,
  };
}

/**
 * Computes complete Brand Directory, Analytics, and Data Integrity dynamically using
 * MongoDB aggregation pipelines (or in-memory fallback when MongoDB is not connected).
 */
export async function getCompleteBrandDirectory(
  options: BrandDirectoryQueryOptions = {}
): Promise<BrandDirectoryResponse> {
  const col = await getCollection<ProductItem>("products");

  let buckets: RawBrandBucket[];
  let source: "mongodb_aggregation" | "in_memory_fallback";

  if (col) {
    buckets = await aggregateBucketsFromMongo(col);
    source = "mongodb_aggregation";
  } else {
    const all = getInMemoryProducts();
    buckets = buildBucketsFromInMemory(all);
    source = "in_memory_fallback";
  }

  const { entries, unbrandedCount, totalProductsInDb } = mergeRawBrandBuckets(buckets);

  // Compute global Brand Analytics across ALL brands (before table search/filters)
  const totalUniqueBrands = entries.length;
  const totalProductsMappedToBrands = entries.reduce((sum, b) => sum + b.totalProducts, 0);
  const brandsWith1Product = entries.filter((b) => b.totalProducts === 1).length;
  const brandsWith2To5Products = entries.filter((b) => b.totalProducts >= 2 && b.totalProducts <= 5).length;
  const brandsWith6To10Products = entries.filter((b) => b.totalProducts >= 6 && b.totalProducts <= 10).length;
  const brandsWithOver10Products = entries.filter((b) => b.totalProducts > 10).length;

  const byCountDesc = [...entries].sort(
    (a, b) => b.totalProducts - a.totalProducts || a.displayName.localeCompare(b.displayName)
  );
  const byCountAsc = [...entries].sort(
    (a, b) => a.totalProducts - b.totalProducts || a.displayName.localeCompare(b.displayName)
  );

  const analytics: BrandAnalytics = {
    totalUniqueBrands,
    totalProductsInDatabase: totalProductsInDb,
    totalProductsMappedToBrands,
    brandsWith1Product,
    brandsWith2To5Products,
    brandsWith6To10Products,
    brandsWithOver10Products,
    unbrandedProductsCount: unbrandedCount,
    highestProductBrand: byCountDesc[0]
      ? { name: byCountDesc[0].displayName, count: byCountDesc[0].totalProducts }
      : null,
    lowestProductBrand: byCountAsc[0]
      ? { name: byCountAsc[0].displayName, count: byCountAsc[0].totalProducts }
      : null,
  };

  // Distinct category options sorted alphabetically
  const catSet = new Set<string>();
  for (const e of entries) {
    for (const c of e.categories) catSet.add(c);
  }
  const availableCategories = Array.from(catSet).sort((a, b) => a.localeCompare(b));

  // Filter directory
  const qNorm = normalizeBrandKey(options.q || "");
  const filtered = entries.filter((b) => {
    if (qNorm) {
      const matchesDisplay = b.normalizedBrand.includes(qNorm) || b.displayName.toLowerCase().includes(qNorm);
      const matchesVariant = b.variants.some((v) => v.name.toLowerCase().includes(qNorm));
      if (!matchesDisplay && !matchesVariant) return false;
    }

    if (options.productCountRange && options.productCountRange !== "all") {
      if (options.productCountRange === "1" && b.totalProducts !== 1) return false;
      if (options.productCountRange === "2-5" && (b.totalProducts < 2 || b.totalProducts > 5)) return false;
      if (options.productCountRange === "6-10" && (b.totalProducts < 6 || b.totalProducts > 10)) return false;
      if (options.productCountRange === "10+" && b.totalProducts <= 10) return false;
    }

    if (options.category && options.category !== "All") {
      if (!b.categories.includes(options.category)) return false;
    }

    if (options.hasIncomplete && b.incompleteProducts <= 0) return false;
    if (options.hasMissingImages && b.missingImages <= 0) return false;

    return true;
  });

  // Sort directory (default: Highest product count first)
  const sortBy = options.sortBy || "count_desc";
  filtered.sort((a, b) => {
    if (sortBy === "count_asc") {
      return a.totalProducts - b.totalProducts || a.displayName.localeCompare(b.displayName);
    }
    if (sortBy === "name_asc") {
      return a.displayName.localeCompare(b.displayName);
    }
    if (sortBy === "name_desc") {
      return b.displayName.localeCompare(a.displayName);
    }
    // count_desc default
    return b.totalProducts - a.totalProducts || a.displayName.localeCompare(b.displayName);
  });

  const total = filtered.length;
  const page = Math.max(1, Number(options.page) || 1);
  const limit = options.limit === 0 ? Math.max(1, total) : Math.max(1, Number(options.limit) || 25);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paginatedBrands = options.limit === 0 ? filtered : filtered.slice(start, start + limit);

  const integrity = await computeBrandIntegrity(col, entries, unbrandedCount);

  return {
    brands: paginatedBrands,
    total,
    page: safePage,
    limit,
    totalPages,
    analytics,
    integrity,
    availableCategories,
    source,
  };
}

/**
 * Fetches paginated products for a specific normalized brand (or "__UNBRANDED__") directly from MongoDB.
 */
export async function getProductsByBrand(options: {
  brand: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<BrandProductsResponse> {
  const rawParam = options.brand || "";
  const isUnbranded = rawParam === "__UNBRANDED__";
  const normalizedTarget = normalizeBrandKey(rawParam);
  const q = (options.q || "").trim();
  const page = Math.max(1, Number(options.page) || 1);
  const limit = options.limit === 0 ? 0 : Math.max(1, Number(options.limit) || 25);

  const col = await getCollection<ProductItem>("products");

  if (col) {
    const brandClause: Record<string, unknown> = isUnbranded
      ? { $or: [{ brand: null }, { brand: "" }, { brand: { $regex: "^\\s*$" } }] }
      : { brand: { $regex: buildBrandMatchRegex(normalizedTarget) } };

    const mongoFilter: Record<string, unknown> = q
      ? {
          $and: [
            brandClause,
            {
              $or: [
                { name: { $regex: escapeRegExp(q), $options: "i" } },
                { barcode: { $regex: escapeRegExp(q), $options: "i" } },
                { category: { $regex: escapeRegExp(q), $options: "i" } },
                { subCategory: { $regex: escapeRegExp(q), $options: "i" } },
              ],
            },
          ],
        }
      : brandClause;

    const total = await col.countDocuments(mongoFilter);
    const totalPages = limit === 0 ? 1 : Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const skip = limit === 0 ? 0 : (safePage - 1) * limit;

    let cursor = col
      .find(mongoFilter)
      .project({
        _id: 1,
        id: 1,
        name: 1,
        brand: 1,
        category: 1,
        subCategory: 1,
        imageUrl: 1,
        imageStatus: 1,
        barcode: 1,
        ingredientsText: 1,
        nutritionPer100g: 1,
        dataStatus: 1,
        dataCompleteness: 1,
        verified: 1,
        overallScore: 1,
      })
      .sort({ overallScore: -1, name: 1 })
      .skip(skip);

    if (limit > 0) {
      cursor = cursor.limit(limit);
    }

    const docs = (await cursor.toArray()) as unknown as ProductItem[];
    const rows = docs.map(computeBrandProductStatuses);
    const displayName = isUnbranded
      ? "Unbranded / Missing Brand"
      : rows[0]?.brand?.trim() || rawParam;

    return {
      brand: isUnbranded ? "__UNBRANDED__" : normalizedTarget,
      displayName,
      products: rows,
      total,
      page: safePage,
      limit: limit === 0 ? total : limit,
      totalPages,
    };
  }

  // In-memory fallback
  const all = getInMemoryProducts();
  const matchingBrand = all.filter((p) => {
    const norm = normalizeBrandKey(p.brand);
    return isUnbranded ? norm === "" : norm === normalizedTarget;
  });

  const filtered = q
    ? matchingBrand.filter((p) => {
        const ql = q.toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(ql) ||
          (p.barcode || "").toLowerCase().includes(ql) ||
          (p.category || "").toLowerCase().includes(ql) ||
          (p.subCategory || "").toLowerCase().includes(ql)
        );
      })
    : matchingBrand;

  filtered.sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0) || a.name.localeCompare(b.name));

  const total = filtered.length;
  const totalPages = limit === 0 ? 1 : Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = limit === 0 ? 0 : (safePage - 1) * limit;
  const sliced = limit === 0 ? filtered : filtered.slice(start, start + limit);
  const rows = sliced.map(computeBrandProductStatuses);

  return {
    brand: isUnbranded ? "__UNBRANDED__" : normalizedTarget,
    displayName: isUnbranded ? "Unbranded / Missing Brand" : rows[0]?.brand?.trim() || rawParam,
    products: rows,
    total,
    page: safePage,
    limit: limit === 0 ? total : limit,
    totalPages,
  };
}

function escapeCsvCell(val: unknown): string {
  if (val === undefined || val === null) return '""';
  return `"${String(val).replace(/"/g, '""')}"`;
}

/**
 * Generates complete CSV exports without truncation:
 * - "brands": every unique brand + metrics
 * - "brand_products": every product for the selected brand
 * - "mapping": every brand-to-product mapping across the database
 */
export async function generateBrandCsvExport(params: {
  type: "brands" | "brand_products" | "mapping";
  brand?: string;
}): Promise<{ csv: string; filename: string; rowCount: number }> {
  if (params.type === "brands") {
    const dir = await getCompleteBrandDirectory({ limit: 0, sortBy: "count_desc" });
    const headers = [
      "S.No.",
      "Brand Name",
      "Normalized Brand Key",
      "Spelling Variants",
      "Total Products",
      "Active Products",
      "Archived Products",
      "Categories",
      "Missing Images",
      "Verified Images",
      "Incomplete Products",
      "Data Completeness (%)",
    ];
    const lines = [
      headers.map(escapeCsvCell).join(","),
      ...dir.brands.map((b, idx) =>
        [
          idx + 1,
          b.displayName,
          b.normalizedBrand,
          b.variants.map((v) => `${v.name} (${v.count})`).join("; "),
          b.totalProducts,
          b.activeProducts,
          b.archivedProducts,
          b.categories.join("; "),
          b.missingImages,
          b.verifiedImages,
          b.incompleteProducts,
          b.dataCompleteness,
        ]
          .map(escapeCsvCell)
          .join(",")
      ),
    ];
    return {
      csv: lines.join("\n"),
      filename: `fooddecode-all-brands-${new Date().toISOString().split("T")[0]}.csv`,
      rowCount: dir.brands.length,
    };
  }

  if (params.type === "brand_products") {
    const result = await getProductsByBrand({ brand: params.brand || "", limit: 0 });
    const headers = [
      "S.No.",
      "Product ID",
      "Product Name",
      "Brand",
      "Category",
      "Subcategory",
      "Barcode",
      "Image URL",
      "Image Status",
      "Ingredients Status",
      "Nutritional Information Status",
      "Product Data Status",
      "Data Completeness (%)",
    ];
    const lines = [
      headers.map(escapeCsvCell).join(","),
      ...result.products.map((p, idx) =>
        [
          idx + 1,
          p.id,
          p.name,
          p.brand || "Unbranded",
          p.category,
          p.subCategory,
          p.barcode,
          p.imageUrl,
          p.isMissingImage ? "Missing" : p.imageStatus,
          p.ingredientsStatus,
          p.nutritionStatus,
          p.productDataStatus,
          p.dataCompleteness,
        ]
          .map(escapeCsvCell)
          .join(",")
      ),
    ];
    const safeSlug = (result.brand || "unbranded").replace(/[^a-z0-9-_]/gi, "-");
    return {
      csv: lines.join("\n"),
      filename: `fooddecode-brand-${safeSlug}-products-${new Date().toISOString().split("T")[0]}.csv`,
      rowCount: result.products.length,
    };
  }

  // Full brand-product mapping CSV across the entire product catalogue
  const col = await getCollection<ProductItem>("products");
  const allDocs: ProductItem[] = col
    ? ((await col
        .find({})
        .project({
          _id: 1,
          id: 1,
          name: 1,
          brand: 1,
          category: 1,
          subCategory: 1,
          barcode: 1,
          imageUrl: 1,
          imageStatus: 1,
          ingredientsText: 1,
          nutritionPer100g: 1,
          dataStatus: 1,
          dataCompleteness: 1,
          verified: 1,
        })
        .sort({ brand: 1, name: 1 })
        .toArray()) as unknown as ProductItem[])
    : [...getInMemoryProducts()].sort((a, b) => (a.brand || "").localeCompare(b.brand || "") || a.name.localeCompare(b.name));

  const headers = [
    "Normalized Brand Key",
    "Brand Name",
    "Product ID",
    "Barcode",
    "Product Name",
    "Category",
    "Subcategory",
    "Image Status",
    "Ingredients Status",
    "Nutritional Information Status",
    "Product Data Status",
    "Data Completeness (%)",
  ];

  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...allDocs.map((doc) => {
      const row = computeBrandProductStatuses(doc);
      const norm = normalizeBrandKey(doc.brand) || "__UNBRANDED__";
      return [
        norm,
        row.brand || "Unbranded",
        row.id,
        row.barcode,
        row.name,
        row.category,
        row.subCategory,
        row.isMissingImage ? "Missing" : row.imageStatus,
        row.ingredientsStatus,
        row.nutritionStatus,
        row.productDataStatus,
        row.dataCompleteness,
      ]
        .map(escapeCsvCell)
        .join(",");
    }),
  ];

  return {
    csv: lines.join("\n"),
    filename: `fooddecode-brand-product-mapping-${new Date().toISOString().split("T")[0]}.csv`,
    rowCount: allDocs.length,
  };
}
