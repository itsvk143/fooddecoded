import React from "react";
import Link from "next/link";
import { ScanLine, Heart, ShieldCheck, Database, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-100 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                <ScanLine className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-stone-900 dark:text-stone-50">
                Food<span className="text-emerald-500">Decode</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Decipher food labels with scientific precision. Detect harmful additives, ultra-processed Nova 4 ingredients, hidden palm oil, and high sodium in seconds.
            </p>
          </div>

          {/* Quick Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <li>
                <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Barcode Scanner
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Side-by-Side Compare
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Submit Food Product
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Methodology
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>Nutri-Score Algorithm (Santé Publique France)</li>
              <li>NOVA Food Classification (Monteiro et al.)</li>
              <li>UK Food Standards Agency (FSA Traffic Lights)</li>
              <li>European Food Safety Authority (EFSA) guidance</li>
              <li>Open Food Facts Public Food Database API</li>
            </ul>
          </div>

          {/* Architecture / Deployment Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Architecture
            </h4>
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>MongoDB Atlas Serverless Cluster</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>Next.js App Router on Vercel</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-cyan-500" />
                <span>Zero Server Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} FoodDecode Platform. Open Food Facts attribution under ODbL license.</p>
          <div className="flex items-center gap-1 text-stone-500">
            <span>Built for health transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
