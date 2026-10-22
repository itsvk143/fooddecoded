"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlusCircle, CheckCircle2, AlertCircle, Barcode, Send } from "lucide-react";
import { SEED_CATEGORIES } from "@/lib/seed-data";

function SubmitProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(SEED_CATEGORIES[0].name);
  const [ingredientsText, setIngredientsText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Nutrition Facts
  const [calories, setCalories] = useState<number | "">("");
  const [totalFat, setTotalFat] = useState<number | "">("");
  const [saturatedFat, setSaturatedFat] = useState<number | "">("");
  const [carbohydrates, setCarbohydrates] = useState<number | "">("");
  const [sugars, setSugars] = useState<number | "">("");
  const [fiber, setFiber] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [sodium, setSodium] = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const prefilledBarcode = searchParams.get("barcode");
    if (prefilledBarcode) {
      setBarcode(prefilledBarcode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/product-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          name,
          brand,
          category,
          ingredientsText,
          imageUrl,
          submittedBy,
          submitterEmail,
          notes,
          calories: calories || 0,
          totalFat: totalFat || 0,
          saturatedFat: saturatedFat || 0,
          carbohydrates: carbohydrates || 0,
          sugars: sugars || 0,
          fiber: fiber || 0,
          protein: protein || 0,
          sodium: sodium || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccessMessage(
        "Product submission received! Our editorial team will review the label and publish it to the catalogue."
      );
      setName("");
      setIngredientsText("");
      setImageUrl("");
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-3.5 h-3.5" /> Community Contribution
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">
          Submit Food Product
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Help build the world&apos;s most transparent ingredient intelligence platform. Enter label facts from any packaged food item.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-800 dark:text-rose-300 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
            1. Basic Product Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
                Barcode Number *
              </label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 016000275270"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Artisan Seeded Sourdough"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Acme Bakery"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
              >
                {SEED_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.example.com/product.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
            2. Ingredients List
          </h2>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
              Copy Full Ingredients as Printed on Package *
            </label>
            <textarea
              required
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Whole wheat flour, water, yeast, sea salt, extra virgin olive oil..."
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
            3. Nutrition Facts (per 100g)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Total Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={totalFat}
                onChange={(e) => setTotalFat(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Saturated Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={saturatedFat}
                onChange={(e) => setSaturatedFat(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Carbs (g)</label>
              <input
                type="number"
                step="0.1"
                value={carbohydrates}
                onChange={(e) => setCarbohydrates(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Sugars (g)</label>
              <input
                type="number"
                step="0.1"
                value={sugars}
                onChange={(e) => setSugars(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Fiber (g)</label>
              <input
                type="number"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-500 block mb-1">Sodium (mg)</label>
              <input
                type="number"
                value={sodium}
                onChange={(e) => setSodium(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Your Name / Nickname</label>
            <input
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="e.g. HealthyShopper"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Your Email (Optional)</label>
            <input
              type="email"
              value={submitterEmail}
              onChange={(e) => setSubmitterEmail(e.target.value)}
              placeholder="for notification when approved"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Submitting to Queue..." : "Submit Product for Verification"}
        </button>
      </form>
    </div>
  );
}

export default function SubmitProductPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
          Loading submission form...
        </div>
      }
    >
      <SubmitProductContent />
    </Suspense>
  );
}
