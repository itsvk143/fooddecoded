"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Search, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface BarcodeScannerProps {
  onScanSuccess?: (barcode: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const router = useRouter();
  const [manualCode, setManualCode] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const scannerRef = useRef<any>(null);

  const DEMO_BARCODES = [
    { label: "🥣 Cheerios Cereal", code: "016000275270" },
    { label: "🥛 Oatly Oat Milk", code: "7394376616532" },
    { label: "🍫 Nutella Spread", code: "8000500179864" },
    { label: "🥤 Coca-Cola", code: "049000028904" },
    { label: "🧀 Doritos Chips", code: "028400043809" },
    { label: "🥣 Froot Loops", code: "038000391187" },
  ];

  const handleLookup = (code: string) => {
    const clean = code.trim().replace(/[^0-9]/g, "");
    if (!clean) return;

    setIsSearching(true);
    if (onScanSuccess) {
      onScanSuccess(clean);
    } else {
      router.push(`/products/barcode/${clean}`);
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    setCameraActive(true);

    try {
      // Dynamic import to ensure purely client-side evaluation
      const { Html5Qrcode } = await import("html5-qrcode");

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 180 },
          aspectRatio: 1.333,
        },
        (decodedText) => {
          // Success callback
          console.log("[Scanner] Barcode recognized:", decodedText);
          stopScanner();
          handleLookup(decodedText);
        },
        (error) => {
          // Frame scanner parse error (normal while searching for barcode)
        }
      );
    } catch (err) {
      console.warn("[Scanner] Camera activation failed:", err);
      setCameraError(
        "Camera access was denied or is unavailable on this device. Please use manual entry below or click a sample barcode to test."
      );
      setCameraActive(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.warn("Failed to stop scanner cleanly:", e);
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Camera Viewport / Activation Area */}
      <div className="relative bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 p-6 text-center text-white min-h-[320px] flex flex-col items-center justify-center">
        <div id="reader" className="w-full max-w-md mx-auto overflow-hidden rounded-2xl" />

        {!cameraActive && (
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold">Live Camera Barcode Scanner</h3>
              <p className="text-xs text-stone-400 mt-1">
                Scan UPC, EAN-13, EAN-8 barcodes on any food package for instant breakdown.
              </p>
            </div>

            <button
              type="button"
              onClick={startScanner}
              disabled={isSearching}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" /> Start Camera Scanner
            </button>
          </div>
        )}

        {cameraActive && (
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Align barcode within camera frame
            </span>
            <button
              type="button"
              onClick={stopScanner}
              className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs hover:bg-stone-700"
            >
              Cancel
            </button>
          </div>
        )}

        {cameraError && (
          <div className="mt-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* Manual Barcode Input Fallback */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
        <label
          htmlFor="manual-barcode-input"
          className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider block mb-2"
        >
          Or Enter Barcode Manually
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(manualCode);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="manual-barcode-input"
              type="text"
              pattern="[0-9]*"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. 016000275270 (UPC/EAN)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
            />
          </div>
          <button
            type="submit"
            disabled={!manualCode.trim() || isSearching}
            className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Decode"}
          </button>
        </form>
      </div>

      {/* Quick Try Demo Barcodes */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Try Sample Barcodes:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_BARCODES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleLookup(item.code)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-2xs cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
