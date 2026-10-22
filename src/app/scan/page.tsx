import React from "react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ScanLine, ShieldCheck, Sparkles, Smartphone, Zap } from "lucide-react";

export const metadata = {
  title: "Barcode Scanner — FoodDecode",
  description: "Scan packaged food barcodes with your device camera for instant scientific ingredient analysis.",
};

export default function ScanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ScanLine className="w-3.5 h-3.5" /> Camera Scanner
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
          Scan Food Barcode
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Point your device camera at any food product barcode. Works on mobile phones and desktop webcams with zero app install required.
        </p>
      </div>

      {/* Camera & Manual Barcode Scanner Component */}
      <BarcodeScanner />

      {/* Feature Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
              Instant Recognition
            </span>
            <p>Decodes standard UPC, EAN-13, EAN-8, and Code-128 symbologies in real time.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <Smartphone className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
              Mobile-First Architecture
            </span>
            <p>Automatically selects your rear wide-angle environment camera on Android and iOS.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
              Private & Safe
            </span>
            <p>Camera frames are processed entirely on-device and never saved or transmitted to a server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
