"use client";

import React, { useEffect } from "react";
import { IngredientMatchResult } from "@/types";
import { cn } from "@/lib/utils";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Info,
  CheckCircle2,
  Scale,
  Sparkles,
  HelpCircle,
  AlertOctagon,
} from "lucide-react";

interface IngredientIntelligenceModalProps {
  ingredient: IngredientMatchResult;
  isOpen: boolean;
  onClose: () => void;
}

export function IngredientIntelligenceModal({
  ingredient,
  isOpen,
  onClose,
}: IngredientIntelligenceModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const classification = ingredient.classification || (
    ingredient.riskLevel === "avoid" ? "RED" : ingredient.riskLevel === "caution" ? "ORANGE" : "GREEN"
  );

  const isGreen = classification === "GREEN";
  const isOrange = classification === "ORANGE";
  const isRed = classification === "RED";

  const classificationBg = isGreen
    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
    : isOrange
    ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
    : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";

  const classificationLabel = isGreen
    ? "Generally Beneficial / Low Concern"
    : isOrange
    ? "Consume in Moderation / Conditional"
    : "Significant Concern / Avoid or Restrict";

  const daily = ingredient.dailyIntake;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/90 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                  classificationBg
                )}
              >
                {classification} · {classificationLabel}
              </span>

              {ingredient.insNumber && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {ingredient.insNumber}
                </span>
              )}

              {ingredient.category && (
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                  {ingredient.category}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 capitalize">
              {ingredient.normalized}
            </h2>

            {ingredient.raw && ingredient.raw.toLowerCase() !== ingredient.normalized.toLowerCase() && (
              <p className="text-xs text-stone-500 mt-0.5 font-mono">
                Declared on label as: &ldquo;{ingredient.raw}&rdquo;
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm leading-relaxed">
          {/* Allergen Warning Banner (Separate from health classification) */}
          {ingredient.isAllergen && (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-purple-900 dark:text-purple-200 block uppercase tracking-wide">
                  Allergen Advisory Notice
                </span>
                <p className="text-purple-800 dark:text-purple-300 font-medium">
                  Contains declared allergen:{" "}
                  <strong>{ingredient.allergenType || "Major Food Allergen"}</strong>.
                  Not suitable for individuals with confirmed hypersensitivity or allergy to this ingredient.
                </p>
              </div>
            </div>
          )}

          {/* Product Specific Quantity Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 flex items-start justify-between gap-4 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Product-Specific Quantity
              </span>
              {ingredient.declaredQuantity ? (
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {ingredient.declaredQuantity}
                  </span>
                  <span className="text-stone-500 font-medium">
                    ({ingredient.quantitySource || "Declared on manufacturer packaging"})
                  </span>
                </div>
              ) : (
                <p className="text-stone-600 dark:text-stone-400 font-medium">
                  Exact quantity not disclosed by manufacturer.
                </p>
              )}
            </div>

            {ingredient.origin && (
              <div className="text-right shrink-0">
                <span className="font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Ingredient Origin
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-semibold text-stone-700 dark:text-stone-300">
                  {ingredient.origin}
                </span>
              </div>
            )}
          </div>

          {/* Classification Reason */}
          {ingredient.classificationReason && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-stone-400" />
                Scientific Classification Rationale
              </h4>
              <p className="text-stone-800 dark:text-stone-200 bg-stone-50/60 dark:bg-stone-800/30 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800">
                {ingredient.classificationReason}
              </p>
            </div>
          )}

          {/* What is it? */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              What Is It?
            </h4>
            <p className="text-stone-700 dark:text-stone-300">
              {ingredient.description || "Recognized culinary or food industry ingredient."}
            </p>
          </div>

          {/* Why is it used in this product? */}
          {ingredient.foodFunction && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                Why Is It Used in This Product?
              </h4>
              <p className="text-stone-700 dark:text-stone-300">
                {ingredient.foodFunction}
              </p>
            </div>
          )}

          {/* Health Effects: Potential Benefits vs Potential Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Potential Benefits */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Potential Benefits
              </h4>
              {ingredient.benefits && ingredient.benefits.length > 0 ? (
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 pl-4 list-disc font-medium">
                  {ingredient.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  Used primarily for technological/sensory functions rather than direct nutritional contribution.
                </p>
              )}
            </div>

            {/* Potential Risks & Tolerability */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Potential Risks & Tolerability
              </h4>
              {ingredient.risks && ingredient.risks.length > 0 ? (
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 pl-4 list-disc font-medium">
                  {ingredient.risks.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  No adverse health effects established at normal dietary exposure levels.
                </p>
              )}
            </div>
          </div>

          {/* Recommended Daily Intake & Safety Limits */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-stone-400" />
              Recommended Daily Intake & Safety Limits
            </h4>

            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-stone-200 dark:divide-stone-800">
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  <tr className="bg-stone-50/50 dark:bg-stone-800/30">
                    <td className="px-4 py-2.5 font-bold text-stone-600 dark:text-stone-400 w-1/3">
                      Recommended Daily Intake
                    </td>
                    <td className="px-4 py-2.5 text-stone-800 dark:text-stone-200">
                      {daily?.recommended || "No universally established recommended daily intake."}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-stone-600 dark:text-stone-400">
                      Acceptable Daily Intake (ADI)
                    </td>
                    <td className="px-4 py-2.5 text-stone-800 dark:text-stone-200">
                      {daily?.adi || "Not applicable / Not allocated"}
                    </td>
                  </tr>
                  <tr className="bg-stone-50/50 dark:bg-stone-800/30">
                    <td className="px-4 py-2.5 font-bold text-stone-600 dark:text-stone-400">
                      Maximum Limit / Upper Limit
                    </td>
                    <td className="px-4 py-2.5 text-stone-800 dark:text-stone-200">
                      {daily?.maximum || "No authoritative maximum limit established"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {daily?.explanation && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                  <p>
                    <strong>Note:</strong> {daily.explanation}
                  </p>
                  <p className="mt-1 text-[10px] text-stone-400">
                    * An Acceptable Daily Intake (ADI) represents the maximum safe lifetime daily exposure ceiling, not a recommended intake target.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Who Should Exercise Caution? */}
          {ingredient.precautions && ingredient.precautions.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                Who Should Exercise Caution?
              </h4>
              <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300 pl-4 list-disc font-medium">
                {ingredient.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* FoodDecode Practical Verdict */}
          {ingredient.verdict && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> FoodDecode Verdict
              </span>
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
                {ingredient.verdict}
              </p>
            </div>
          )}

          {/* Scientific Sources & Citations */}
          {ingredient.sources && ingredient.sources.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Authoritative Scientific References (WHO, EFSA, FSSAI, JECFA, FDA)
              </h4>
              <div className="space-y-2">
                {ingredient.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {src.organization}
                        </span>
                        {src.year && (
                          <span className="text-[10px] text-stone-400 font-mono">({src.year})</span>
                        )}
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 font-medium">
                        {src.title}
                      </p>
                      {src.finding && (
                        <p className="text-[11px] text-stone-500 mt-1 italic">
                          &ldquo;{src.finding}&rdquo;
                        </p>
                      )}
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 shrink-0"
                        title="Open authoritative scientific document"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-stone-400">
            FoodDecode Evidence-Based Intelligence · Never medical advice
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientIntelligenceModal;

