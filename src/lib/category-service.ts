import { ObjectId } from "mongodb";
import { getCollection } from "./mongodb";
import { CategoryRecord, ProductItem } from "@/types";
import { SEED_CATEGORIES } from "./seed-data";
import { logAuditEvent } from "./audit";

export interface ExtendedCategoryRecord extends CategoryRecord {
  id?: string;
  subCategories?: string[];
  displayOrder?: number;
  isActive?: boolean;
  productCount?: number;
}

// In-memory fallback
let inMemoryCategories: ExtendedCategoryRecord[] = SEED_CATEGORIES.map((c, i) => ({
  ...c,
  displayOrder: i + 1,
  isActive: true,
  subCategories: [],
}));

export async function getAllCategoriesWithCounts(): Promise<ExtendedCategoryRecord[]> {
  const catCol = await getCollection<ExtendedCategoryRecord>("categories");
  const prodCol = await getCollection<ProductItem>("products");

  let categories: ExtendedCategoryRecord[] = [];

  if (catCol) {
    const dbCats = await catCol.find({}).sort({ displayOrder: 1, name: 1 }).toArray();
    categories = dbCats.map((c) => ({
      ...c,
      _id: c._id?.toString(),
      id: c._id?.toString(),
    }));
  } else {
    categories = [...inMemoryCategories];
  }

  // Calculate actual product count per category and collect distinct subcategories from products
  if (prodCol) {
    const counts = await prodCol
      .aggregate<{ _id: string; count: number; subCategories: string[] }>([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            subCategories: { $addToSet: "$subCategory" },
          },
        },
      ])
      .toArray();

    const countMap = new Map(counts.map((c) => [c._id, c]));

    categories = categories.map((cat) => {
      const match = countMap.get(cat.name);
      const dynamicSubs = match ? match.subCategories.filter(Boolean) : [];
      const existingSubs = cat.subCategories || [];
      const mergedSubs = Array.from(new Set([...existingSubs, ...dynamicSubs])).sort();

      return {
        ...cat,
        productCount: match ? match.count : 0,
        subCategories: mergedSubs,
      };
    });
  }

  return categories;
}

export async function addCategory(
  category: {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    subCategories?: string[];
    displayOrder?: number;
  },
  performedBy: string = "Admin"
): Promise<ExtendedCategoryRecord> {
  const catCol = await getCollection<ExtendedCategoryRecord>("categories");
  const slug =
    category.slug ||
    category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newCat: ExtendedCategoryRecord = {
    name: category.name.trim(),
    slug,
    description: category.description || "",
    icon: category.icon || "📦",
    subCategories: (category.subCategories || []).map((s) => s.trim()).filter(Boolean),
    displayOrder: category.displayOrder || 10,
    isActive: true,
  };

  if (catCol) {
    const res = await catCol.insertOne(newCat as any);
    newCat._id = res.insertedId.toString();
    newCat.id = newCat._id;
  } else {
    newCat._id = `cat_${Date.now()}`;
    newCat.id = newCat._id;
    inMemoryCategories.push(newCat);
  }

  await logAuditEvent({
    action: "ADMIN_ADD_CATEGORY",
    entityType: "category",
    entityId: newCat.slug,
    performedBy,
    details: `Created new category: ${newCat.name}`,
  });

  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<ExtendedCategoryRecord>,
  performedBy: string = "Admin"
): Promise<ExtendedCategoryRecord | null> {
  const catCol = await getCollection<ExtendedCategoryRecord>("categories");

  if (catCol) {
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { slug: id };
    await catCol.updateOne(query, { $set: updates });
    const updated = await catCol.findOne(query);
    if (!updated) return null;

    await logAuditEvent({
      action: "ADMIN_UPDATE_CATEGORY",
      entityType: "category",
      entityId: id,
      performedBy,
      details: `Updated category ${updated.name}`,
    });

    return { ...updated, _id: updated._id?.toString(), id: updated._id?.toString() };
  }

  const idx = inMemoryCategories.findIndex((c) => c._id === id || c.slug === id);
  if (idx >= 0) {
    inMemoryCategories[idx] = { ...inMemoryCategories[idx], ...updates };
    return inMemoryCategories[idx];
  }
  return null;
}

export async function deleteCategory(
  id: string,
  performedBy: string = "Admin"
): Promise<{ success: boolean; error?: string; productCount?: number }> {
  const catCol = await getCollection<ExtendedCategoryRecord>("categories");
  const prodCol = await getCollection<ProductItem>("products");

  let catName = "";
  if (catCol) {
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { slug: id };
    const cat = await catCol.findOne(query);
    if (cat) catName = cat.name;
  } else {
    const cat = inMemoryCategories.find((c) => c._id === id || c.slug === id);
    if (cat) catName = cat.name;
  }

  if (!catName) {
    return { success: false, error: "Category not found." };
  }

  // Check if products exist in this category
  if (prodCol) {
    const productCount = await prodCol.countDocuments({ category: catName });
    if (productCount > 0) {
      return {
        success: false,
        productCount,
        error: `Cannot delete category "${catName}" because it contains ${productCount} active products. Please reassign or migrate those products before deleting.`,
      };
    }
  }

  if (catCol) {
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { slug: id };
    await catCol.deleteOne(query);
  } else {
    inMemoryCategories = inMemoryCategories.filter((c) => c._id !== id && c.slug !== id);
  }

  await logAuditEvent({
    action: "ADMIN_DELETE_CATEGORY",
    entityType: "category",
    entityId: id,
    performedBy,
    details: `Deleted category ${catName}`,
  });

  return { success: true };
}
