"use client";

import { useState, useEffect, useCallback } from "react";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global variable so deferred prompt isn't lost during component re-mounts
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    try {
      localStorage.setItem("fooddecode_pwa_installed", "true");
    } catch {}
    notifyListeners();
  });
}

export function usePwaInstall() {
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Register service worker on supported environments
    if (
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" || window.location.hostname === "localhost")
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // Detect standalone mode (already installed & running as PWA)
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    let isLocallyInstalled = false;
    try {
      isLocallyInstalled = localStorage.getItem("fooddecode_pwa_installed") === "true";
    } catch {}

    if (isStandaloneMode || isLocallyInstalled) {
      setIsInstalled(true);
    }

    // Detect iOS devices (iPhone, iPad, iPod)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Sync with global prompt state
    const handleChange = () => {
      setDeferredPrompt(globalDeferredPrompt);
      try {
        if (localStorage.getItem("fooddecode_pwa_installed") === "true") {
          setIsInstalled(true);
        }
      } catch {}
    };

    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          try {
            localStorage.setItem("fooddecode_pwa_installed", "true");
          } catch {}
        }
      } catch (err) {
        console.warn("[PWA] Installation prompt error:", err);
      } finally {
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        setIsModalOpen(false);
        notifyListeners();
      }
    } else {
      // If native deferred prompt is not directly available (e.g. iOS or manual browser install)
      openModal();
    }
  }, [deferredPrompt, openModal]);

  return {
    isMounted,
    isInstalled,
    isIOS,
    canPromptNative: Boolean(deferredPrompt),
    isModalOpen,
    openModal,
    closeModal,
    installApp,
  };
}
