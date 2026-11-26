"use client";

import React, { useEffect } from "react";
import {
  X,
  Download,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  ScanLine,
  Check,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canPromptNative: boolean;
  isIOS: boolean;
}

export function InstallAppModal({
  isOpen,
  onClose,
  onInstall,
  canPromptNative,
  isIOS,
}: InstallAppModalProps) {
  // Prevent body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Header with Logo & Brand */}
        <div className="flex items-center gap-4 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
            <ScanLine className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2
                id="pwa-install-title"
                className="text-lg font-black tracking-tight text-stone-900 dark:text-stone-50"
              >
                Food<span className="text-emerald-500">Decode</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Official Web App
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-500">
              Ingredient Intelligence & Scanner
            </p>
          </div>
        </div>

        {/* Modal Main Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Install FoodDecode
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Get faster access to FoodDecode directly from your home screen. Explore
            food products, ingredients, and nutritional information with a convenient
            app-like experience.
          </p>
        </div>

        {/* App Highlights */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 dark:border-stone-800">
          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <Zap className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
              0ms Filtering
            </div>
            <div className="text-[9px] text-stone-500">Instant Sync</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <ScanLine className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
              Full Screen
            </div>
            <div className="text-[9px] text-stone-500">Camera Scanner</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <Smartphone className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
              Native Feel
            </div>
            <div className="text-[9px] text-stone-500">Home Screen</div>
          </div>
        </div>

        {/* Platform-Specific Installation Steps */}
        {isIOS ? (
          /* iOS Safari Step-by-Step Guide */
          <div className="space-y-3 pt-1">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>Installation Steps for Safari on iOS</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1.5 flex-wrap">
                  <span>Tap the</span>
                  <span className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-stone-100 px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <Share className="w-3.5 h-3.5 text-blue-500" /> Share
                  </span>
                  <span>icon in Safari&apos;s bottom bar</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1.5 flex-wrap">
                  <span>Scroll down and select</span>
                  <span className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-stone-100 px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-500" /> Add to Home Screen
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300">
                  <span>Tap </span>
                  <strong className="text-stone-900 dark:text-stone-100 font-bold">
                    &ldquo;Add&rdquo;
                  </strong>
                  <span> in the top-right corner to finish</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Got it, let&apos;s do it
            </button>
          </div>
        ) : canPromptNative ? (
          /* Android / Chrome / Edge Native Prompt Ready */
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onInstall}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install FoodDecode Now</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        ) : (
          /* Desktop / Browser without active deferred prompt */
          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                Install from your browser
              </span>
              Look for the <strong>Install</strong> icon (
              <Download className="w-3.5 h-3.5 inline text-emerald-500" />) in your browser&apos;s
              URL address bar, or click your browser menu (<strong>⋮</strong> or <strong>…</strong>)
              and choose <strong>&ldquo;Install FoodDecode&rdquo;</strong>.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
