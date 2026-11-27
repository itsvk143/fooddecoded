"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Image as ImageIcon,
  HardDrive,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Lock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { usePwaCache } from "@/hooks/usePwaCache";

interface OfflineCacheAdminPanelProps {
  adminKey: string;
  onNotify?: (msg: string) => void;
}

interface ServerCachePolicy {
  topProductsPerCategory: number;
  lruProductLimit: number;
  thumbnailCacheLimit: number;
  syncThrottleHours: number;
  storageDbName: string;
  thumbnailCacheName: string;
}

export function OfflineCacheAdminPanel({ adminKey, onNotify }: OfflineCacheAdminPanelProps) {
  const {
    isOffline,
    isSyncing,
    connectionStatus,
    diagnostics,
    syncNow,
    clearCache,
    refreshDiagnostics,
  } = usePwaCache();

  const [isServerAuthorized, setIsServerAuthorized] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [serverPolicy, setServerPolicy] = useState<ServerCachePolicy | null>(null);
  const [actionLoading, setActionLoading] = useState<"resync" | "clear" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const headers: Record<string, string> = {};
        if (adminKey) headers["x-admin-key"] = adminKey;
        const res = await fetch("/api/admin/cache", {
          headers,
          cache: "no-store",
        });
        if (cancelled) return;
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (!cancelled) {
            setIsServerAuthorized(false);
            setAuthError(err.error || "Unauthorized administrator credentials.");
          }
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setIsServerAuthorized(Boolean(data.authorized));
        setServerPolicy(data.configuration || null);
        await refreshDiagnostics();
      } catch (e) {
        if (!cancelled) {
          setIsServerAuthorized(false);
          setAuthError((e as Error).message || "Failed to verify administrator cache access.");
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adminKey, refreshDiagnostics]);

  const handleAuthorizedSync = async () => {
    setActionLoading("resync");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminKey) headers["x-admin-key"] = adminKey;
      const res = await fetch("/api/admin/cache", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "resync" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify?.(`✗ Cache authorization failed: ${err.error || res.status}`);
        return;
      }

      await syncNow(true);
      onNotify?.("✓ Offline Cache Engine re-synced & verified with server.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAuthorizedClear = async () => {
    setActionLoading("clear");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminKey) headers["x-admin-key"] = adminKey;
      const res = await fetch("/api/admin/cache", {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "clear" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify?.(`✗ Cache authorization failed: ${err.error || res.status}`);
        return;
      }

      await clearCache();
      onNotify?.("✓ Local Offline Cache Engine storage cleared.");
    } finally {
      setActionLoading(null);
    }
  };

  if (authChecking) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-stone-500">
          Verifying administrator cache control permissions...
        </p>
      </div>
    );
  }

  if (!isServerAuthorized) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Administrator Access Required
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 max-w-md mx-auto">
          {authError || "Offline Cache Engine diagnostics and controls are restricted to authenticated administrators."}
        </p>
      </div>
    );
  }

  const usageMB = diagnostics
    ? (diagnostics.storageUsageBytes / (1024 * 1024)).toFixed(2)
    : "0.00";
  const quotaGB = diagnostics
    ? (diagnostics.storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)
    : "0.0";

  const formattedDate = diagnostics?.lastSyncedAt
    ? new Date(diagnostics.lastSyncedAt).toLocaleString([], {
        dateStyle: "short",
        timeStyle: "medium",
      })
    : "Not yet synced";

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Offline Cache Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Admin Only
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Persistent IndexedDB ({serverPolicy?.storageDbName || "fooddecode_cache_db"}) & Cache Storage ({serverPolicy?.thumbnailCacheName || "fooddecode-thumbnails-v1"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOffline
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="capitalize">{connectionStatus}</span>
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cached Products */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cached Products</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {diagnostics?.productCount ?? 0}
          </div>
          <span className="text-[11px] text-stone-500">
            across {diagnostics?.categoryCount ?? 0} categories (Top {serverPolicy?.topProductsPerCategory ?? 25} each, LRU cap {serverPolicy?.lruProductLimit ?? 1000})
          </span>
        </div>

        {/* Card 2: Packshot Images */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-teal-500" />
            <span>Cached Packshots</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {diagnostics?.imageCount ?? 0}
          </div>
          <span className="text-[11px] text-stone-500">
            in Cache Storage (LRU cap {serverPolicy?.thumbnailCacheLimit ?? 250})
          </span>
        </div>

        {/* Card 3: Storage Quota */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1.5">
            <HardDrive className="w-3.5 h-3.5 text-amber-500" />
            <span>Storage Used</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {usageMB} <span className="text-xs font-normal text-stone-500">MB</span>
          </div>
          <span className="text-[11px] text-stone-500">
            of ~{quotaGB} GB available ({diagnostics?.percentUsed ?? 0}% used)
          </span>
        </div>

        {/* Card 4: Persistent Status */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Persistence</span>
          </div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{diagnostics?.isPersistent ? "Protected" : "Standard"}</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-1">
            Safe from automatic browser eviction
          </span>
        </div>
      </div>

      {/* Sync Info Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Last verified: <strong>{formattedDate}</strong>
          </span>
        </div>
        {diagnostics?.catalogHash && (
          <span className="text-[11px] opacity-80 font-mono truncate max-w-xs">
            Hash: {diagnostics.catalogHash.replace(/\"/g, "")}
          </span>
        )}
      </div>

      {/* Authorized Admin Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          type="button"
          onClick={handleAuthorizedClear}
          disabled={actionLoading !== null}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{actionLoading === "clear" ? "Clearing..." : "Clear Offline Data"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshDiagnostics()}
            disabled={actionLoading !== null}
            className="px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Refresh Stats
          </button>

          <button
            type="button"
            onClick={handleAuthorizedSync}
            disabled={isSyncing || actionLoading !== null || isOffline}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 disabled:opacity-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing || actionLoading === "resync" ? "animate-spin" : ""}`} />
            <span>{isSyncing || actionLoading === "resync" ? "Syncing..." : "Re-sync Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
