"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  getCacheDiagnostics,
  clearAllCache,
  CacheDiagnosticsReport,
} from "@/lib/pwa-cache/indexed-db";
import {
  initializePwaCache,
  setupBackgroundSyncListeners,
} from "@/lib/pwa-cache/sync-manager";
import { WifiOff } from "lucide-react";

export type PublicConnectionStatus = "online" | "offline" | "syncing" | "offline-ready";

interface PwaCacheContextType {
  isOffline: boolean;
  isSyncing: boolean;
  isOfflineReady: boolean;
  connectionStatus: PublicConnectionStatus;
  diagnostics: CacheDiagnosticsReport | null;
  syncNow: (force?: boolean) => Promise<void>;
  clearCache: () => Promise<void>;
  refreshDiagnostics: () => Promise<void>;
}

const PwaCacheContext = createContext<PwaCacheContextType | null>(null);

export function PwaCacheProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<CacheDiagnosticsReport | null>(null);

  const refreshDiagnostics = useCallback(async () => {
    try {
      const diag = await getCacheDiagnostics();
      setDiagnostics(diag);
    } catch {
      // Non-blocking fail-safe
    }
  }, []);

  const handleSync = useCallback(
    async (force: boolean = false) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      setIsSyncing(true);
      try {
        await initializePwaCache({ force });
        await refreshDiagnostics();
      } catch (e) {
        console.warn("[PwaCacheProvider] Sync error:", e);
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshDiagnostics]
  );

  const handleClear = useCallback(async () => {
    try {
      await clearAllCache();
      if ("caches" in window) {
        await caches.delete("fooddecode-thumbnails-v1");
        await caches.delete("fooddecode-api-v1");
      }
      await refreshDiagnostics();
    } catch (e) {
      console.warn("[PwaCacheProvider] Clear error:", e);
    }
  }, [refreshDiagnostics]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Sync initial offline state safely
    const initRaf = requestAnimationFrame(() => {
      setIsOffline(!navigator.onLine);
    });

    const handleOnline = () => {
      setIsOffline(false);
      handleSync(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Setup automatic background sync listeners
    setupBackgroundSyncListeners();

    // 3. Initial non-blocking cache initialization (waits 1.5s after mount)
    const timer = setTimeout(() => {
      handleSync(false);
    }, 1500);

    // 4. Listen to custom cache-synced events
    const handleSyncedEvent = () => {
      refreshDiagnostics();
    };
    window.addEventListener("fooddecode:cache-synced", handleSyncedEvent);

    return () => {
      cancelAnimationFrame(initRaf);
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("fooddecode:cache-synced", handleSyncedEvent);
    };
  }, [handleSync, refreshDiagnostics]);

  const isOfflineReady = Boolean(diagnostics && diagnostics.productCount > 0);

  const connectionStatus: PublicConnectionStatus = useMemo(() => {
    if (isOffline) return "offline";
    if (isSyncing) return "syncing";
    if (isOfflineReady) return "offline-ready";
    return "online";
  }, [isOffline, isSyncing, isOfflineReady]);

  return (
    <PwaCacheContext.Provider
      value={{
        isOffline,
        isSyncing,
        isOfflineReady,
        connectionStatus,
        diagnostics,
        syncNow: handleSync,
        clearCache: handleClear,
        refreshDiagnostics,
      }}
    >
      {/* Discreet Public Offline Mode Bar — no technical metrics or diagnostic controls */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-semibold shadow-sm flex items-center justify-center transition-all"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <WifiOff className="w-3.5 h-3.5 shrink-0 text-stone-950" />
            <span className="truncate">
              <strong>Offline Mode:</strong> Browsing cached content
            </span>
          </div>
        </div>
      )}

      {children}
    </PwaCacheContext.Provider>
  );
}

export function usePwaCache() {
  const context = useContext(PwaCacheContext);
  if (!context) {
    throw new Error("usePwaCache must be used within a PwaCacheProvider");
  }
  return context;
}
