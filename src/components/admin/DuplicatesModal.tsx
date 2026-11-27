"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProductItem } from "@/types";
import { ProductImage } from "../ProductImage";
import {
  Copy,
  X,
  CheckCircle2,
  Merge,
  Sparkles,
  Layers,
} from "lucide-react";

interface DuplicateGroup {
  reason: "Exact Barcode" | "Brand and Product Name Match";
  key: string;
  products: ProductItem[];
}

interface DuplicatesModalProps {
  isOpen: boolean;
  adminKey: string;
  onClose: () => void;
  onMergeSuccess: () => void;
}

function rankCandidate(p: ProductItem): number {
  let rank = 0;
  if (p.verified) rank += 35;
  if (
    p.imageStatus === "VERIFIED" ||
    p.imageStatus === "IMAGE_VERIFIED" ||
    p.imageStatus === "FULLY_VERIFIED"
  ) {
    rank += 30;
  }
  if (p.imageUrl && !p.imageUrl.includes("placeholder")) rank += 50;
  if (p.barcode) rank += 20;
  rank += (p.overallScore ?? 0) / 10;
  rank += (p.dataCompleteness ?? 0) / 10;
  if (p.ingredientsText) rank += Math.min(20, p.ingredientsText.length / 20);
  return rank;
}

export function DuplicatesModal({
  isOpen,
  adminKey,
  onClose,
  onMergeSuccess,
}: DuplicatesModalProps) {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [batchMerging, setBatchMerging] = useState(false);
  const [showBatchPreview, setShowBatchPreview] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [targetId, setTargetId] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const fetchDuplicates = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (adminKey) headers["x-admin-key"] = adminKey;
      const res = await fetch("/api/admin/products/duplicates", {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setDuplicates(data.duplicates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const headers: Record<string, string> = {};
        if (adminKey) headers["x-admin-key"] = adminKey;
        const res = await fetch("/api/admin/products/duplicates", {
          headers,
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled && res.ok) {
          setDuplicates(data.duplicates || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, adminKey]);

  if (!isOpen) return null;

  const handleOpenMerge = (group: DuplicateGroup) => {
    setShowBatchPreview(false);
    setSelectedGroup(group);
    if (group.products.length >= 2) {
      const sorted = [...group.products].sort((a, b) => rankCandidate(b) - rankCandidate(a));
      setTargetId(sorted[0]._id || sorted[0].id || "");
      setSourceId(sorted[1]._id || sorted[1].id || "");
    }
    setMessage(null);
  };

  const handleExecuteMerge = async () => {
    if (!targetId || !sourceId) return;
    if (targetId === sourceId) {
      setMessage("❌ Primary target product and duplicate source product cannot be the same.");
      return;
    }

    setMerging(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminKey) headers["x-admin-key"] = adminKey;

      const res = await fetch("/api/admin/products/duplicates", {
        method: "POST",
        headers,
        body: JSON.stringify({ targetId, sourceId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✓ Products successfully merged. Source record archived.");
        setSelectedGroup(null);
        await fetchDuplicates();
        onMergeSuccess();
      } else {
        setMessage(`❌ Merge failed: ${data.error}`);
      }
    } catch (err: unknown) {
      setMessage(`❌ ${err instanceof Error ? err.message : "Merge failed"}`);
    } finally {
      setMerging(false);
    }
  };

  const handleExecuteMergeAll = async () => {
    if (duplicates.length === 0) return;

    setBatchMerging(true);
    setMessage(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminKey) headers["x-admin-key"] = adminKey;

      const res = await fetch("/api/admin/products/duplicates", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "merge_all" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `✓ Compare & Merge All complete: merged ${data.mergedSourcesCount} duplicate records across ${data.mergedGroupsCount} collision groups.`
        );
        setShowBatchPreview(false);
        setSelectedGroup(null);
        await fetchDuplicates();
        onMergeSuccess();
      } else {
        setMessage(`❌ Batch merge failed: ${data.error}`);
      }
    } catch (err: unknown) {
      setMessage(`❌ ${err instanceof Error ? err.message : "Batch merge failed"}`);
    } finally {
      setBatchMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900 dark:text-stone-50">
                Duplicate Product Detection & Controlled Merge
              </h3>
              <p className="text-xs text-stone-500">
                Identify collision candidates by barcode, brand, and normalized title
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {duplicates.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedGroup(null);
                  setShowBatchPreview((prev) => !prev);
                }}
                disabled={batchMerging}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare & Merge All ({duplicates.length})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl cursor-pointer"
              aria-label="Close duplicate modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {message && (
            <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-semibold border border-stone-800">
              {message}
            </div>
          )}

          {/* Batch Compare & Merge All Confirmation Panel */}
          {showBatchPreview && duplicates.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-emerald-500/20">
                <div>
                  <h4 className="font-black text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Batch Compare & Merge Preview ({duplicates.length} Groups)
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                    For each collision group, the highest-completeness record (verified image, barcode, score & ingredients) is preserved as Primary Target, all missing fields are backfilled, and duplicate source records are archived.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBatchPreview(false)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {duplicates.map((grp, i) => {
                  const sorted = [...grp.products].sort((a, b) => rankCandidate(b) - rankCandidate(a));
                  const primary = sorted[0];
                  const sources = sorted.slice(1);
                  return (
                    <div
                      key={`${grp.key}-${i}`}
                      className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 dark:text-stone-100 block truncate">
                          Keep: {primary?.name}{" "}
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            [ID: {(primary?._id || primary?.id || "").slice(-6)}]
                          </span>
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {grp.reason} · Backfill & archive{" "}
                          {sources.map((s) => `[${(s._id || s.id || "").slice(-6)}]`).join(", ")}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shrink-0 self-start sm:self-center">
                        Score: {primary?.overallScore ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowBatchPreview(false)}
                  disabled={batchMerging}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteMergeAll}
                  disabled={batchMerging}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {batchMerging
                    ? "Merging All Duplicates..."
                    : `Confirm & Merge All (${duplicates.length} Groups)`}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-stone-400">
              Scanning MongoDB catalogue for barcode and brand-name collisions...
            </div>
          ) : duplicates.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Clean Catalogue: No Duplicates Detected
              </h4>
              <p className="text-stone-500 max-w-md mx-auto text-xs">
                All active product records in MongoDB Atlas have unique GTIN barcodes and distinct brand identities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicates.map((grp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                        {grp.reason}
                      </span>
                      <span className="font-mono text-stone-500 text-[11px]">{grp.key}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenMerge(grp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs cursor-pointer"
                    >
                      <Merge className="w-3.5 h-3.5" /> Compare & Merge
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {grp.products.map((p) => (
                      <div
                        key={p._id || p.id}
                        className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 p-1 flex items-center justify-center shrink-0">
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-stone-800 dark:text-stone-200 block truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {p.brand} · Score: {p.overallScore ?? "—"} · ID: {(p._id || p.id || "").slice(-6)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Merge Comparison View Modal Dialog */}
          {selectedGroup && (
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/80 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
                <h4 className="font-black text-sm text-emerald-400 flex items-center gap-2">
                  <Merge className="w-4 h-4" /> Controlled Product Merge
                </h4>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Target */}
                <div>
                  <label className="font-bold text-stone-300 block mb-1">
                    Primary Target Product (Preserves this record & ID)
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-900 font-semibold text-xs"
                  >
                    {selectedGroup.products.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name} ({p.brand}) [ID: {(p._id || p.id || "").slice(-6)}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Source */}
                <div>
                  <label className="font-bold text-stone-300 block mb-1">
                    Duplicate Source Product (Will be merged and archived)
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-700 bg-stone-900 font-semibold text-xs"
                  >
                    {selectedGroup.products.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name} ({p.brand}) [ID: {(p._id || p.id || "").slice(-6)}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-400">
                  Data from source will backfill any empty fields in target. Source record is soft-archived with pointer.
                </span>
                <button
                  type="button"
                  onClick={handleExecuteMerge}
                  disabled={merging}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  {merging ? "Merging..." : "Confirm & Execute Merge"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
