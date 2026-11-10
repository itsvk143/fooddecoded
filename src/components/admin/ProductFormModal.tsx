"use client";

import React, { useState, useEffect } from "react";
import { ProductItem, NutritionInfo } from "@/types";
import { ProductImage } from "../ProductImage";
import {
  Package,
  Layers,
  Image as ImageIcon,
  Tag,
  FileText,
  ShieldCheck,
  History,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface ProductFormModalProps {
  product: ProductItem | null; // null means Add New Product
  categories: Array<{ name: string; subCategories?: string[] }>;
  isOpen: boolean;
  adminKey: string;
  onClose: () => void;
  onSave: (savedProduct: Partial<ProductItem>) => Promise<void>;
}

export function ProductFormModal({
  product,
  categories,
  isOpen,
  adminKey,
  onClose,
  onSave,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  const isEditing = !!product;

  const [activeTab, setActiveTab] = useState<
    "basic" | "classification" | "images" | "nutrition" | "tags" | "verification" | "audit"
  >("basic");

  // Form Fields
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [barcode, setBarcode] = useState(product?.barcode || "");
  const [description, setDescription] = useState(product?.description || "");
  const [productType, setProductType] = useState(product?.productType || "");
  const [flavour, setFlavour] = useState(product?.flavour || "");
  const [packageSize, setPackageSize] = useState(product?.packageSize || "");
  const [packageUnit, setPackageUnit] = useState(product?.packageUnit || "g");
  const [manufacturer, setManufacturer] = useState(product?.manufacturer || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(product?.countryOfOrigin || "India");

  // Classification
  const [category, setCategory] = useState(product?.category || categories[0]?.name || "Snacks & Spreads");
  const [subCategory, setSubCategory] = useState(product?.subCategory || "");

  // Search Tags
  const [searchTags, setSearchTags] = useState<string[]>(product?.searchTags || []);
  const [tagInput, setTagInput] = useState("");

  // Images
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "/images/placeholder-product.svg");
  const [imageSourceUrl, setImageSourceUrl] = useState(product?.imageSourceUrl || "");
  const [imageStatus, setImageStatus] = useState<any>(product?.imageStatus || "MISSING");
  const [imageVerificationNote, setImageVerificationNote] = useState(product?.imageVerificationNote || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Ingredients & Nutrition
  const [ingredientsText, setIngredientsText] = useState(product?.ingredientsText || "");
  const [nutrition, setNutrition] = useState<NutritionInfo>(
    product?.nutritionPer100g || {
      calories: 0,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      carbohydrates: 0,
      sugars: 0,
      addedSugars: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
      salt: 0,
    }
  );

  // Verification & Status
  const [verified, setVerified] = useState(product?.verified ?? true);
  const [dataStatus, setDataStatus] = useState(product?.dataStatus || "verified");
  const [isArchived, setIsArchived] = useState(product?.isArchived ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCatObj = categories.find((c) => c.name === category);
  const availableSubCategories = selectedCatObj?.subCategories || [];

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const catObj = categories.find((c) => c.name === newCat);
    const subs = catObj?.subCategories || [];
    setSubCategory(subs[0] || "");
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !searchTags.includes(t)) {
      setSearchTags([...searchTags, t]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t: string) => {
    setSearchTags(searchTags.filter((tag) => tag !== t));
  };

  const handleNutritionChange = (field: keyof NutritionInfo, val: string) => {
    setNutrition({
      ...nutrition,
      [field]: parseFloat(val) || 0,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!barcode.trim()) {
      setUploadMessage("❌ Please enter a Barcode first to associate with the uploaded image.");
      return;
    }

    setUploadingImage(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("barcode", barcode.trim());
      formData.append("note", `Uploaded by Admin on ${new Date().toLocaleDateString()}`);

      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.imageUrl);
        setImageStatus("VERIFIED");
        setImageVerificationNote(data.note);
        setUploadMessage("✓ Packaging photograph uploaded and verified successfully.");
      } else {
        setUploadMessage(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setUploadMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !barcode.trim()) {
      setError("Product Name and Barcode are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: Partial<ProductItem> = {
        _id: product?._id,
        id: product?.id,
        name: name.trim(),
        brand: brand.trim() || "Independent",
        barcode: barcode.trim(),
        description: description.trim(),
        productType: productType.trim(),
        flavour: flavour.trim(),
        packageSize: packageSize.trim(),
        packageUnit: packageUnit.trim(),
        manufacturer: manufacturer.trim(),
        countryOfOrigin: countryOfOrigin.trim(),
        category,
        subCategory,
        searchTags,
        imageUrl,
        imageSourceUrl: imageSourceUrl.trim() || undefined,
        imageStatus,
        imageVerificationNote,
        imageVerifiedAt: imageStatus === "VERIFIED" ? new Date().toISOString() : undefined,
        ingredientsText,
        nutritionPer100g: nutrition,
        verified,
        dataStatus: dataStatus as any,
        isArchived,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-50">
                {isEditing ? `Edit: ${product.name}` : "Add New Food Product"}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? `Editing product record ID: ${product._id || product.barcode}`
                  : "Create a verified product in MongoDB Atlas catalogue"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 pt-3 border-b border-stone-100 dark:border-stone-800 overflow-x-auto text-xs">
          {[
            { id: "basic", label: "Basic Info", icon: Package },
            { id: "classification", label: "Classification", icon: Layers },
            { id: "tags", label: "Search Tags", icon: Tag },
            { id: "images", label: "Images", icon: ImageIcon },
            { id: "nutrition", label: "Ingredients & Nutrition", icon: FileText },
            { id: "verification", label: "Verification & Status", icon: ShieldCheck },
            ...(isEditing ? [{ id: "audit", label: "Audit History", icon: History }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl font-bold transition-colors border-b-2 cursor-pointer ${
                  active
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    placeholder="e.g. Britannia Good Day Butter Cookies"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    placeholder="e.g. Britannia"
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Barcode / GTIN *
                  </label>
                  <input
                    type="text"
                    required
                    value={barcode}
                    placeholder="e.g. 8901063092822"
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Product Type
                  </label>
                  <input
                    type="text"
                    value={productType}
                    placeholder="e.g. Cookie, Wafer, Chips, Soda"
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Flavour / Variant
                  </label>
                  <input
                    type="text"
                    value={flavour}
                    placeholder="e.g. Butter, Masala, Classic"
                    onChange={(e) => setFlavour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Package Size
                  </label>
                  <input
                    type="text"
                    value={packageSize}
                    placeholder="e.g. 100"
                    onChange={(e) => setPackageSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Unit
                  </label>
                  <select
                    value={packageUnit}
                    onChange={(e) => setPackageUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                  >
                    <option value="g">g (Grams)</option>
                    <option value="kg">kg (Kilograms)</option>
                    <option value="ml">ml (Milliliters)</option>
                    <option value="L">L (Liters)</option>
                    <option value="pcs">pieces</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    placeholder="e.g. Britannia Industries Ltd"
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={countryOfOrigin}
                    placeholder="e.g. India"
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  placeholder="Official marketing and packaging product description..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-normal"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLASSIFICATION */}
          {activeTab === "classification" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Hierarchical Taxonomy Preview
                </span>
                <div className="font-black text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <span>{category}</span>
                  <span className="text-emerald-500">→</span>
                  <span>{subCategory || "Unassigned"}</span>
                  {productType && (
                    <>
                      <span className="text-emerald-500">→</span>
                      <span className="text-stone-500">{productType}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                    Primary Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                    Subcategory *
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold text-xs"
                  >
                    {availableSubCategories.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    {subCategory && !availableSubCategories.includes(subCategory) && (
                      <option value={subCategory}>{subCategory} (Custom)</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEARCH TAGS */}
          {activeTab === "tags" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-1">
                  Search Keywords vs Classification
                </h4>
                <p className="text-stone-500 text-[11px]">
                  A product's category represents what it actually is (e.g. a Cookie). Search tags allow discovery when users search related terms (e.g. searching "Chocolate" will match this cookie without placing it into the Chocolate Bar aisle).
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add search keyword (e.g. Chocolate, Crunch, Snack)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {searchTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-stone-400 hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES */}
          {activeTab === "images" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                {/* Live Preview */}
                <div className="w-28 h-28 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2 flex items-center justify-center shrink-0">
                  <ProductImage
                    src={imageUrl}
                    alt={name || "Preview"}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    Product Image & Packaging Photograph
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Upload an authentic front-facing packaging photograph or provide an approved URL.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold text-xs cursor-pointer hover:bg-stone-800">
                      <Upload className="w-3.5 h-3.5" /> Upload Packshot File
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("/images/placeholder-product.svg");
                        setImageStatus("MISSING");
                        setImageVerificationNote("Reset to neutral placeholder");
                      }}
                      className="px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold"
                    >
                      Set to Placeholder
                    </button>
                  </div>

                  {uploadingImage && (
                    <span className="text-xs text-stone-400 block">Uploading & validating file...</span>
                  )}
                  {uploadMessage && (
                    <span className="text-xs font-semibold block">{uploadMessage}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Image Status
                  </label>
                  <select
                    value={imageStatus}
                    onChange={(e) => setImageStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                  >
                    <option value="VERIFIED">Verified Match</option>
                    <option value="MISSING">Missing / Placeholder</option>
                    <option value="UNCERTAIN">Unverified</option>
                    <option value="MISMATCH">Mismatch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Image Verification Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Checked against physical retail packaging carton (Oct 2026)"
                  value={imageVerificationNote}
                  onChange={(e) => setImageVerificationNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: INGREDIENTS & NUTRITION */}
          {activeTab === "nutrition" && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Ingredients Text (Full List)
                </label>
                <textarea
                  rows={4}
                  value={ingredientsText}
                  placeholder="Wheat flour, palm oil, sugar, cocoa solids, salt, baking soda..."
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs"
                />
              </div>

              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-2">
                  Nutrition Facts (per 100g / 100ml)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 block">Calories (kcal)</label>
                    <input
                      type="number"
                      value={nutrition.calories}
                      onChange={(e) => handleNutritionChange("calories", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Total Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.totalFat}
                      onChange={(e) => handleNutritionChange("totalFat", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Saturated Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.saturatedFat}
                      onChange={(e) => handleNutritionChange("saturatedFat", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Carbohydrates (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.carbohydrates}
                      onChange={(e) => handleNutritionChange("carbohydrates", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Sugars (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.sugars}
                      onChange={(e) => handleNutritionChange("sugars", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Fiber (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.fiber}
                      onChange={(e) => handleNutritionChange("fiber", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={nutrition.protein}
                      onChange={(e) => handleNutritionChange("protein", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block">Sodium (mg)</label>
                    <input
                      type="number"
                      value={nutrition.sodium}
                      onChange={(e) => handleNutritionChange("sodium", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 mt-2">
                  Scores (Nutri-Score, Nova Group, Overall FoodDecode Score) will be automatically recomputed based on updated values upon save.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: VERIFICATION & STATUS */}
          {activeTab === "verification" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block text-xs">
                      Product Data Verification
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Marks product data (ingredients & nutrition facts) as verified by administrator
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block text-xs">
                      Archive Status (Soft Delete)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Archived products are hidden from the public directory but preserved in MongoDB
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isArchived}
                    onChange={(e) => setIsArchived(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT HISTORY */}
          {activeTab === "audit" && isEditing && (
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                Product Modification History
              </h4>
              {product.auditHistory && product.auditHistory.length > 0 ? (
                <div className="space-y-2">
                  {product.auditHistory.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">{h.action}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px]">{h.details}</p>
                      <span className="text-[10px] text-stone-400">By: {h.performedBy}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 text-xs">No modification history recorded yet.</p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
            >
              {saving ? "Saving Product..." : isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

