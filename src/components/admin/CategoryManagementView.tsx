"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  ArrowUpDown,
  Tag,
} from "lucide-react";

interface CategoryRecordItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  subCategories?: string[];
  productCount?: number;
  displayOrder?: number;
}

interface CategoryManagementViewProps {
  categories: CategoryRecordItem[];
  adminKey: string;
  onRefresh: () => void;
}

export function CategoryManagementView({
  categories,
  adminKey,
  onRefresh,
}: CategoryManagementViewProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryRecordItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📦");
  const [subCategoriesStr, setSubCategoriesStr] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(10);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openCreate = () => {
    setName("");
    setDescription("");
    setIcon("📦");
    setSubCategoriesStr("");
    setDisplayOrder((categories.length + 1) * 10);
    setEditingCategory(null);
    setIsCreating(true);
    setMessage(null);
  };

  const openEdit = (cat: CategoryRecordItem) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setIcon(cat.icon || "📦");
    setSubCategoriesStr((cat.subCategories || []).join(", "));
    setDisplayOrder(cat.displayOrder || 10);
    setEditingCategory(cat);
    setIsCreating(false);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage(null);

    const subCategories = subCategoriesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const isNew = !editingCategory;
      const url = "/api/admin/categories";
      const method = isNew ? "POST" : "PUT";
      const body = {
        id: editingCategory?._id || editingCategory?.id,
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim() || "📦",
        subCategories,
        displayOrder,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Category "${name}" ${isNew ? "created" : "updated"} successfully.`);
        setIsCreating(false);
        setEditingCategory(null);
        onRefresh();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat: CategoryRecordItem) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${cat.name}"? This action is protected if products exist.`
      )
    )
      return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(cat._id || cat.slug)}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Category "${cat.name}" deleted.`);
        onRefresh();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Delete error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <h3 className="font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" /> Category & Subcategory Management
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage primary food aisles, subcategories, ordering, and product assignments
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-semibold text-xs border border-stone-800 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Create / Edit Form Drawer/Card */}
      {(isCreating || editingCategory) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-emerald-500/50 shadow-md space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">
              {isCreating ? "Create New Primary Category" : `Edit Category: ${editingCategory?.name}`}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingCategory(null);
              }}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full text-center text-lg py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                placeholder="e.g. Snacks & Spreads"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 10)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              placeholder="e.g. Granolas, rolled oats, flakes, and breakfast mixes."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Subcategories (Comma separated)
            </label>
            <textarea
              rows={2}
              value={subCategoriesStr}
              placeholder="e.g. Biscuits, Cookies, Chips, Banana Chips, Namkeen"
              onChange={(e) => setSubCategoriesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Subcategories will be available in hierarchical product assignment dropdowns.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl shadow-md cursor-pointer"
            >
              {loading ? "Saving..." : isCreating ? "Create Category" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.slug}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{cat.icon || "📦"}</span>
                <div>
                  <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">{cat.slug}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {cat.productCount || 0} products
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-stone-400 hover:text-emerald-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {cat.description && (
              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                {cat.description}
              </p>
            )}

            {/* Subcategories Tags */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Subcategories ({cat.subCategories?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {cat.subCategories && cat.subCategories.length > 0 ? (
                  cat.subCategories.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-stone-400 italic">No subcategories defined</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

