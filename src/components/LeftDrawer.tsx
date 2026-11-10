"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Search,
  ScanLine,
  Scale,
  PlusCircle,
  ShieldAlert,
  ArrowRight,
  Flame,
  Droplets,
  Heart,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryMenuItem {
  name: string;
  href: string;
  icon?: string;
  imageSrc?: string;
  badge?: string;
  desc?: string;
}

export function LeftDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Ensure DOM is ready for React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Dynamic counts for all aisles
  const [coldDrinksCount, setColdDrinksCount] = useState<number | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSearch(window.location.search);
    }
  }, [pathname, isOpen]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, number> = {};
          for (const c of data) {
            if (typeof c.productCount === "number") {
              map[c.slug] = c.productCount;
              map[c.name] = c.productCount;
            }
          }
          setCategoryCounts(map);
        }
      })
      .catch(() => {});

    fetch("/api/products?category=cold-drinks&limit=1")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.total === "number") {
          setColdDrinksCount(data.total);
        }
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (typeof window === "undefined") return false;
    if (pathname !== "/products") return false;
    const qIndex = href.indexOf("?");
    if (qIndex === -1) return false;
    const targetQuery = href.slice(qIndex + 1);
    const targetParams = new URLSearchParams(targetQuery);
    const activeParams = new URLSearchParams(
      currentSearch || (typeof window !== "undefined" ? window.location.search : "")
    );

    for (const [key, val] of targetParams.entries()) {
      const activeVal = activeParams.get(key);
      if (!activeVal) return false;
      const cleanActive = activeVal.toLowerCase().replace(/\+/g, " ");
      const cleanTarget = val.toLowerCase().replace(/\+/g, " ");
      if (cleanActive !== cleanTarget) return false;
    }
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Requested snack categories with authentic photos
  const snackAisles: CategoryMenuItem[] = [
    {
      name: "Biscuit",
      href: "/products?subCategory=Biscuits",
      imageSrc: "/images/biscuit.jpg",
      desc: "Digestive, wheat & tea biscuits",
      badge: categoryCounts["Biscuits"] ? `${categoryCounts["Biscuits"]} items` : "101 items",
    },
    {
      name: "Cookies",
      href: "/products?subCategory=Cookies",
      imageSrc: "/images/cookie.jpg",
      desc: "Chocolate chunk, butter & oat cookies",
      badge: categoryCounts["Cookies"] ? `${categoryCounts["Cookies"]} items` : "101 items",
    },
    {
      name: "Chips",
      href: "/products?subCategory=Chips",
      imageSrc: "/images/chips_potato.jpg",
      desc: "Potato, corn, tortilla & popped chips",
      badge: categoryCounts["Chips"] ? `${categoryCounts["Chips"]} items` : "101 items",
    },
    {
      name: "Banana Chips",
      href: "/products?q=banana+chips",
      imageSrc: "/images/chips_banana.jpg",
      desc: "Crispy Kerala coconut oil chips",
      badge: (categoryCounts["Banana Chips"] ?? categoryCounts["banana-chips"]) ? `${categoryCounts["Banana Chips"] ?? categoryCounts["banana-chips"]} items` : "101 items",
    },
    {
      name: "Mixture",
      href: "/products?subCategory=Mixture+%26+Namkeen",
      imageSrc: "/images/namkeen_mixture.png",
      desc: "Spiced namkeen, sev & savoury mixes",
      badge: (categoryCounts["Mixture & Namkeen"] ?? categoryCounts["mixture-namkeen"]) ? `${categoryCounts["Mixture & Namkeen"] ?? categoryCounts["mixture-namkeen"]} items` : "101 items",
    },
    {
      name: "Snacks",
      href: "/products?category=Snacks+%26+Spreads",
      imageSrc: "/images/snacks.png",
      desc: "Healthy namkeen, chips & roasted bites",
      badge: categoryCounts["Snacks & Spreads"] ? `${categoryCounts["Snacks & Spreads"]} items` : undefined,
    },
    {
      name: "Breakfast",
      href: "/products?category=Cereals+%26+Breakfast",
      icon: "🥣",
      desc: "Rolled oats, granolas & flakes",
      badge: categoryCounts["Cereals & Breakfast"] ? `${categoryCounts["Cereals & Breakfast"]} items` : "101 items",
    },
  ];

  // Extended supermarket aisles
  const otherAisles: CategoryMenuItem[] = [
    {
      name: "Cold Drinks",
      href: "/products?category=cold-drinks",
      imageSrc: "/images/cold-drinks/coca-cola-classic.svg",
      desc: "Colas, sodas, fruit drinks & zero-sugar beverages",
      badge: (categoryCounts["Cold Drinks"] ?? coldDrinksCount) !== null && (categoryCounts["Cold Drinks"] ?? coldDrinksCount) !== undefined
        ? `${categoryCounts["Cold Drinks"] ?? coldDrinksCount} items`
        : "101 items",
    },
    {
      name: "Beverages & Drinks",
      href: "/products?category=Beverages+%26+Drinks",
      icon: "🥤",
      desc: "Plant milks, sparkling waters & juices",
      badge: categoryCounts["Beverages & Drinks"] !== undefined ? `${categoryCounts["Beverages & Drinks"]} items` : "101 items",
    },
    {
      name: "Dairy & Yogurt",
      href: "/products?category=Dairy+%26+Yogurt",
      icon: "🥛",
      desc: "Greek yogurt, soy milk & butter",
      badge: categoryCounts["Dairy & Yogurt"] !== undefined ? `${categoryCounts["Dairy & Yogurt"]} items` : "101 items",
    },
    {
      name: "Ice Cream",
      href: "/products?category=Ice+Cream",
      icon: "🍦",
      desc: "Frozen desserts, cones, kulfi, tubs & ice cream bars",
      badge: (categoryCounts["Ice Cream"] ?? categoryCounts["ice-cream"]) !== undefined
        ? `${categoryCounts["Ice Cream"] ?? categoryCounts["ice-cream"]} items`
        : "101 items",
    },
    {
      name: "Ready-to-Eat & Ready-to-Cook",
      href: "/products?category=Ready-to-Eat+%26+Ready-to-Cook",
      icon: "🍲",
      desc: "Convenient packaged meals, instant foods & ready-to-cook products",
      badge: (categoryCounts["Ready-to-Eat & Ready-to-Cook"] ?? categoryCounts["ready-to-eat-ready-to-cook"]) !== undefined
        ? `${categoryCounts["Ready-to-Eat & Ready-to-Cook"] ?? categoryCounts["ready-to-eat-ready-to-cook"]} items`
        : "101 items",
    },
    {
      name: "Protein Foods & Snacks",
      href: "/products?category=Protein+Foods+%26+Snacks",
      icon: "💪",
      desc: "Protein bars, cookies, shakes, crisps & high-protein foods",
      badge: (categoryCounts["Protein Foods & Snacks"] ?? categoryCounts["protein-foods-snacks"]) !== undefined
        ? `${categoryCounts["Protein Foods & Snacks"] ?? categoryCounts["protein-foods-snacks"]} items`
        : "101 items",
    },
    {
      name: "Plant-Based Foods",
      href: "/products?category=Plant-Based+Foods",
      icon: "🌱",
      desc: "Dairy alternatives, plant milks, vegan foods & plant-derived snacks",
      badge: (categoryCounts["Plant-Based Foods"] ?? categoryCounts["plant-based-foods"]) !== undefined
        ? `${categoryCounts["Plant-Based Foods"] ?? categoryCounts["plant-based-foods"]} items`
        : "101 items",
    },
    {
      name: "Bakery & Breads",
      href: "/products?category=Bakery+%26+Breads",
      icon: "🍞",
      desc: "Whole wheat breads, sourdough, buns, wraps & artisanal bakery",
      badge: (categoryCounts["Bakery & Breads"] ?? categoryCounts["bakery-breads"]) !== undefined
        ? `${categoryCounts["Bakery & Breads"] ?? categoryCounts["bakery-breads"]} items`
        : "101 items",
    },
    {
      name: "Spreads, Dips & Sauces",
      href: "/products?category=Spreads%2C+Dips+%26+Sauces",
      icon: "🍯",
      desc: "Nut butters, hummus, cheese spreads, mayonnaise, salsa & chutneys",
      badge: (categoryCounts["Spreads, Dips & Sauces"] ?? categoryCounts["spreads-dips-sauces"]) !== undefined
        ? `${categoryCounts["Spreads, Dips & Sauces"] ?? categoryCounts["spreads-dips-sauces"]} items`
        : "101 items",
    },
    {
      name: "Pantry & Grains",
      href: "/products?category=Pantry+%26+Grains",
      icon: "🌾",
      desc: "Whole wheat pasta, rice & pulses",
      badge: categoryCounts["Pantry & Grains"] !== undefined ? `${categoryCounts["Pantry & Grains"]} items` : "101 items",
    },
    {
      name: "Condiments & Sauces",
      href: "/products?category=Condiments+%26+Sauces",
      icon: "🥫",
      desc: "Tomato purées, dressings & dips",
      badge: categoryCounts["Condiments & Sauces"] !== undefined ? `${categoryCounts["Condiments & Sauces"]} items` : "101 items",
    },
    {
      name: "Chocolates & Sweets",
      href: "/products?category=Chocolates+%26+Sweets",
      icon: "🍫",
      desc: "Dark chocolate, cocoa spreads & treats",
      badge: (categoryCounts["Chocolates & Sweets"] ?? categoryCounts["chocolates-sweets"]) !== undefined
        ? `${categoryCounts["Chocolates & Sweets"] ?? categoryCounts["chocolates-sweets"]} items`
        : "101 items",
    },
  ];

  // Clean-label dietary shortcuts
  const healthShortcuts = [
    {
      name: "Palm Oil Free Only",
      href: "/products?hasPalmOil=false",
      color: "text-amber-500",
      icon: Droplets,
    },
    {
      name: "Nutri-Score Grade A",
      href: "/products?nutriScore=A",
      color: "text-emerald-500",
      icon: Heart,
    },
    {
      name: "Low Sugar (≤5g)",
      href: "/products?lowSugar=true",
      color: "text-orange-500",
      icon: Flame,
    },
    {
      name: "Verified Products Only",
      href: "/products?verifiedOnly=true",
      color: "text-teal-500",
      icon: Sparkles,
    },
  ];

  const filterMatches = (item: CategoryMenuItem) => {
    if (!filterText.trim()) return true;
    const term = filterText.toLowerCase();
    return item.name.toLowerCase().includes(term) || (item.desc && item.desc.toLowerCase().includes(term));
  };

  const filteredSnacks = snackAisles.filter(filterMatches);
  const filteredOthers = otherAisles.filter(filterMatches);

  return (
    <>
      {/* Left-Side Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Open Food Categories Menu"
        aria-label="Open food categories menu"
      >
        <Menu className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-800 dark:text-stone-100" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-950" />
      </button>

      {/* Portal to document.body so the drawer is never trapped inside <header>'s backdrop-filter containing block */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!isOpen}
          >
            {/* Dark Full-Screen Backdrop Overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${isOpen ? "opacity-100" : "opacity-0"}`}
            />

            {/* Slide-out Left Drawer Panel */}
            <aside
              className={`fixed inset-y-0 left-0 w-full sm:w-[400px] max-w-[85vw] h-[100dvh] bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-stone-900 dark:text-stone-50 leading-tight">
                      Food Aisles
                    </h2>
                    <span className="text-[11px] font-semibold text-stone-500 block">
                      Explore & decode food categories
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Filter Search inside Drawer */}
              <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filter aisles (biscuit, chips, mixture...)"
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {filterText && (
                    <button
                      type="button"
                      onClick={() => setFilterText("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Drawer Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 bg-white dark:bg-stone-950">
                {/* Section 1: Popular Snack Aisles */}
                {filteredSnacks.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 px-2">
                      <span>Featured Snacks & Biscuits</span>
                      <span className="text-stone-400 font-normal">{filteredSnacks.length} options</span>
                    </div>
                    <div className="space-y-1">
                      {filteredSnacks.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "group flex items-center justify-between p-2.5 rounded-xl transition-colors",
                              active
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 font-semibold"
                                : "hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.imageSrc ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shadow-xs group-hover:scale-110 transition-transform">
                                  <img
                                    src={item.imageSrc}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <span className="text-xl w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                                  {item.icon}
                                </span>
                              )}
                              <div className="min-w-0">
                                <span
                                  className={cn(
                                    "text-xs font-bold block truncate",
                                    active
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                  )}
                                >
                                  {item.name}
                                </span>
                                {item.desc && (
                                  <span className="text-[10px] text-stone-500 truncate block">
                                    {item.desc}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 2: Supermarket Aisles */}
                {filteredOthers.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
                      All Supermarket Aisles
                    </div>
                    <div className="space-y-1">
                      {filteredOthers.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "group flex items-center justify-between p-2.5 rounded-xl transition-colors",
                              active
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 font-semibold"
                                : "hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.imageSrc ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shadow-xs group-hover:scale-110 transition-transform">
                                  <img
                                    src={item.imageSrc}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <span className="text-xl w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                                  {item.icon}
                                </span>
                              )}
                              <div className="min-w-0">
                                <span
                                  className={cn(
                                    "text-xs font-bold block truncate",
                                    active
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                  )}
                                >
                                  {item.name}
                                </span>
                                {item.desc && (
                                  <span className="text-[10px] text-stone-500 truncate block">
                                    {item.desc}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 3: Clean-Label Health Filters */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
                    Dietary & Health Shortcuts
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {healthShortcuts.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.name}
                          href={s.href}
                          onClick={() => setIsOpen(false)}
                          className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/60 dark:border-stone-800 text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2 transition-colors"
                        >
                          <Icon className={cn("w-3.5 h-3.5 shrink-0", s.color)} />
                          <span className="truncate">{s.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Platform Navigation */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
                    Platform Tools
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/scan"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <ScanLine className="w-4 h-4 text-emerald-500" />
                      <span>Live Barcode Camera Scanner</span>
                    </Link>
                    <Link
                      href="/compare"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <Scale className="w-4 h-4 text-teal-500" />
                      <span>Side-by-Side Product Comparison</span>
                    </Link>
                    <Link
                      href="/submit"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <PlusCircle className="w-4 h-4 text-cyan-500" />
                      <span>Submit New Food Product</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Admin Control Dashboard</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-center shrink-0">
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View All Food Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
