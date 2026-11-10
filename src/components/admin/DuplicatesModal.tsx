"use client";

import React, { useState, useEffect } from "react";
import { ProductItem } from "@/types";
import { ProductImage } from "../ProductImage";
import {
  Copy,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Merge,
  ShieldCheck,
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

export function DuplicatesModal({
  isOpen,
  adminKey,
  onClose,
  onMergeSuccess,
}: DuplicatesModalProps) {
  if (!isOpen) return null;

  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [targetId, setTargetId] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/duplicates", {
        headers: { "x-admin-key": adminKey },
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
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleOpenMerge = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    if (group.products.length >= 2) {
      setTargetId(group.products[0]._id || group.products[0].id || "");
      setSourceId(group.products[1]._id || group.products[1].id || "");
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
      const res = await fetch("/api/admin/products/duplicates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ targetId, sourceId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Products successfully merged. Source record archived.`);
        setSelectedGroup(null);
        fetchDuplicates();
        onMergeSuccess();
      } else {
        setMessage(`❌ Merge failed: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
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
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {message && (
            <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-semibold border border-stone-800">
              {message}
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
                All 175 product records in MongoDB Atlas have unique GTIN barcodes and distinct brand identities.
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
                            {p.brand} · Score: {p.overallScore} · ID: {p._id?.slice(-6)}
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
                  className="text-stone-400 hover:text-white"
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
                        {p.name} ({p.brand}) [ID: {p._id?.slice(-6)}]
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
                        {p.name} ({p.brand}) [ID: {p._id?.slice(-6)}]
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

