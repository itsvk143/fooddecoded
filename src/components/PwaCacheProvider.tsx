"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
import { WifiOff, Database, RefreshCw, X, ShieldCheck, HardDrive } from "lucide-react";
import { CacheDiagnosticsModal } from "./CacheDiagnosticsModal";

interface PwaCacheContextType {
  isOffline: boolean;
  isSyncing: boolean;
  diagnostics: CacheDiagnosticsReport | null;
  syncNow: (force?: boolean) => Promise<void>;
  clearCache: () => Promise<void>;
  openDiagnosticsModal: () => void;
  closeDiagnosticsModal: () => void;
}

const PwaCacheContext = createContext<PwaCacheContextType | null>(null);

export function PwaCacheProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<CacheDiagnosticsReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const refreshDiagnostics = useCallback(async () => {
    try {
      const diag = await getCacheDiagnostics();
      setDiagnostics(diag);
    } catch {}
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

    // 1. Initial offline state check
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      handleSync(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Setup background sync listeners
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
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("fooddecode:cache-synced", handleSyncedEvent);
    };
  }, [handleSync, refreshDiagnostics]);

  return (
    <PwaCacheContext.Provider
      value={{
        isOffline,
        isSyncing,
        diagnostics,
        syncNow: handleSync,
        clearCache: handleClear,
        openDiagnosticsModal: () => setIsModalOpen(true),
        closeDiagnosticsModal: () => setIsModalOpen(false),
      }}
    >
      {/* Sleek Non-Intrusive Offline Mode Banner */}
      {isOffline && (
        <div className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 shrink-0 text-stone-950" />
            <span className="truncate">
              <strong>Offline Mode:</strong> Browsing {diagnostics?.productCount || "468"}{" "}
              cached products & thumbnails across {diagnostics?.categoryCount || "19"} categories.
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ml-auto underline text-xs font-bold hover:text-white shrink-0 cursor-pointer"
            >
              Storage Status
            </button>
          </div>
        </div>
      )}

      {children}

      {/* Cache Diagnostics Inspection Modal */}
      {isModalOpen && (
        <CacheDiagnosticsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          diagnostics={diagnostics}
          isSyncing={isSyncing}
          onSyncNow={() => handleSync(true)}
          onClearCache={handleClear}
        />
      )}
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
