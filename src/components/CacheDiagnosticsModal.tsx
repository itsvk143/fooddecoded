"use client";

import React from "react";
import {
  X,
  Database,
  Image as ImageIcon,
  HardDrive,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { CacheDiagnosticsReport } from "@/lib/pwa-cache/indexed-db";

interface CacheDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics: CacheDiagnosticsReport | null;
  isSyncing: boolean;
  onSyncNow: () => void;
  onClearCache: () => void;
}

export function CacheDiagnosticsModal({
  isOpen,
  onClose,
  diagnostics,
  isSyncing,
  onSyncNow,
  onClearCache,
}: CacheDiagnosticsModalProps) {
  if (!isOpen) return null;

  const usageMB = diagnostics
    ? (diagnostics.storageUsageBytes / (1024 * 1024)).toFixed(2)
    : "0.00";
  const quotaGB = diagnostics
    ? (diagnostics.storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)
    : "0.0";

  const formattedDate = diagnostics?.lastSyncedAt
    ? new Date(diagnostics.lastSyncedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Not yet synced";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Offline Cache Engine
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Persistent IndexedDB & Cache Storage system
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Cached Products */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cached Products</span>
            </div>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {diagnostics?.productCount ?? 0}
            </div>
            <span className="text-[10px] text-stone-500">
              across {diagnostics?.categoryCount ?? 0} categories (Top 25 each)
            </span>
          </div>

          {/* Card 2: Packshot Images */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-teal-500" />
              <span>Cached Packshots</span>
            </div>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {diagnostics?.imageCount ?? 0}
            </div>
            <span className="text-[10px] text-stone-500">
              in Cache Storage (LRU cap 250)
            </span>
          </div>

          {/* Card 3: Storage Quota */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1">
              <HardDrive className="w-3.5 h-3.5 text-amber-500" />
              <span>Storage Used</span>
            </div>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {usageMB} <span className="text-xs font-normal text-stone-500">MB</span>
            </div>
            <span className="text-[10px] text-stone-500">
              of ~{quotaGB} GB available
            </span>
          </div>

          {/* Card 4: Persistent Status */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Persistence</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{diagnostics?.isPersistent ? "Protected" : "Standard"}</span>
            </div>
            <span className="text-[10px] text-stone-500">
              Safe from automatic eviction
            </span>
          </div>
        </div>

        {/* Sync Info Banner */}
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Last verified: <strong>{formattedDate}</strong>
            </span>
          </div>
          {diagnostics?.catalogHash && (
            <span className="text-[10px] opacity-75 font-mono truncate max-w-[120px]">
              {diagnostics.catalogHash.replace(/\"/g, "")}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClearCache}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Offline Data</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncNow}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 disabled:opacity-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Re-sync Now"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
