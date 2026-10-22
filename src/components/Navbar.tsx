"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ScanLine,
  Search,
  Sparkles,
  Layers,
  PlusCircle,
  ShieldAlert,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LeftDrawer } from "./LeftDrawer";

interface QuickSearchResult {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  overallScore: number;
  imageUrl?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuickSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (e) {
        console.warn("Navbar search error", e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { href: "/products", label: "Directory", icon: Layers },
    { href: "/scan", label: "Scanner", icon: ScanLine },
    { href: "/compare", label: "Compare", icon: Sparkles },
    { href: "/submit", label: "Submit", icon: PlusCircle },
    { href: "/admin", label: "Admin", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Hamburger Drawer + Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <LeftDrawer />
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Food<span className="text-emerald-500">Decode</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-wider text-stone-500 -mt-1">
                Ingredient Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Global Instant Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Search products, brands, or barcode..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 py-1.5 border-b border-stone-100 dark:border-stone-800">
                Products Match
              </div>
              <div className="divide-y divide-stone-100 dark:divide-stone-800/60 max-h-72 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold text-stone-400">IMG</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-stone-500 truncate block">
                        {item.brand} · Barcode: {item.barcode}
                      </span>
                    </div>
                    <div className="text-xs font-black px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 shrink-0">
                      {item.overallScore}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-2 border-t border-stone-100 dark:border-stone-800 text-center">
                <Link
                  href={`/products?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setShowDropdown(false)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  View all results for &ldquo;{searchQuery}&rdquo; <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/scan"
            className="p-2 rounded-xl bg-emerald-500 text-stone-950 font-bold"
            title="Scan Barcode"
          >
            <ScanLine className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-bold text-sm"
                >
                  <Icon className="w-4 h-4 text-emerald-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
