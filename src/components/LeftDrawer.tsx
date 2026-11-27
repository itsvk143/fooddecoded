"use client";

import React, { useState, useEffect, useTransition, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  RefreshCw,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();

  const handleNavigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setPendingHref(href);

    const qIndex = href.indexOf("?");
    if (qIndex !== -1) {
      const targetQuery = href.slice(qIndex + 1);
      const targetParams = new URLSearchParams(targetQuery);
      const cat = targetParams.get("category") || "All";
      const sub = targetParams.get("subCategory") || "";

      // Immediately set current search state so active navigation item highlights instantly (0ms)
      setCurrentSearch("?" + targetQuery);

      // Dispatch synchronous category change event for instant 0ms switching on ProductsExplorer
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("fooddecode:category-change", {
            detail: {
              category: cat,
              subCategory: sub,
              q: targetParams.get("q") || "",
              fromDrawer: true,
            },
          })
        );
      }
    }

    startTransition(() => {
      router.push(href);
      setIsOpen(false);
    });
  };

  // Close drawer and reset pending state when route changes
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsOpen(false);
      setPendingHref(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Dynamic counts for all aisles
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [currentSearch, setCurrentSearch] = useState("");
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSearch(window.location.search);
    }
  }, [pathname, isOpen]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/categories", { signal: controller.signal })
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

    return () => controller.abort();
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
      href: "/products?category=Biscuits%2C+Cookies+%26+Crackers&subCategory=Glucose+%26+Milk+Biscuits",
      imageSrc: "/images/biscuit.jpg",
      desc: "Digestive, wheat & tea biscuits",
      badge: categoryCounts["Biscuits, Cookies & Crackers"] ? `${categoryCounts["Biscuits, Cookies & Crackers"]} items` : "585 items",
    },
    {
      name: "Cookies",
      href: "/products?category=Biscuits%2C+Cookies+%26+Crackers&subCategory=Cookies",
      imageSrc: "/images/cookie.jpg",
      desc: "Chocolate chunk, butter & oat cookies",
      badge: categoryCounts["Biscuits, Cookies & Crackers"] ? `${categoryCounts["Biscuits, Cookies & Crackers"]} items` : "585 items",
    },
    {
      name: "Chips",
      href: "/products?category=Chips%2C+Namkeen+%26+Savoury+Snacks&subCategory=Potato+Chips",
      imageSrc: "/images/chips_potato.jpg",
      desc: "Potato, corn, tortilla & popped chips",
      badge: categoryCounts["Chips, Namkeen & Savoury Snacks"] ? `${categoryCounts["Chips, Namkeen & Savoury Snacks"]} items` : "542 items",
    },
    {
      name: "Banana Chips",
      href: "/products?q=banana+chips",
      imageSrc: "/images/chips_banana.jpg",
      desc: "Crispy Kerala coconut oil chips",
      badge: categoryCounts["Chips, Namkeen & Savoury Snacks"] ? `${categoryCounts["Chips, Namkeen & Savoury Snacks"]} items` : "101 items",
    },
    {
      name: "Mixture",
      href: "/products?category=Chips%2C+Namkeen+%26+Savoury+Snacks&subCategory=Namkeen+%26+Bhujia",
      imageSrc: "/images/namkeen_mixture.png",
      desc: "Spiced namkeen, sev & savoury mixes",
      badge: categoryCounts["Chips, Namkeen & Savoury Snacks"] ? `${categoryCounts["Chips, Namkeen & Savoury Snacks"]} items` : "542 items",
    },
  ];

  // The 19 Canonical Supermarket Food Aisles
  const otherAisles: CategoryMenuItem[] = [
    {
      name: "Chips, Namkeen & Savoury Snacks",
      href: "/products?category=Chips%2C+Namkeen+%26+Savoury+Snacks",
      icon: "🍿",
      desc: "Potato chips, banana chips, bhujia, tortilla chips & puffs",
      badge: categoryCounts["Chips, Namkeen & Savoury Snacks"] ? `${categoryCounts["Chips, Namkeen & Savoury Snacks"]} items` : "542 items",
    },
    {
      name: "Makhana & Roasted Snacks",
      href: "/products?category=Makhana+%26+Roasted+Snacks",
      icon: "🔥",
      desc: "Roasted makhana, roasted chana & diet snacks",
      badge: categoryCounts["Makhana & Roasted Snacks"] ? `${categoryCounts["Makhana & Roasted Snacks"]} items` : "50 items",
    },
    {
      name: "Biscuits, Cookies & Crackers",
      href: "/products?category=Biscuits%2C+Cookies+%26+Crackers",
      icon: "🍪",
      desc: "Digestive biscuits, cookies, cream biscuits, crackers & rusks",
      badge: categoryCounts["Biscuits, Cookies & Crackers"] ? `${categoryCounts["Biscuits, Cookies & Crackers"]} items` : "585 items",
    },
    {
      name: "Chocolates, Candy & Sweets",
      href: "/products?category=Chocolates%2C+Candy+%26+Sweets",
      icon: "🍫",
      desc: "Dark chocolate, traditional Indian mithai, chikki & candies",
      badge: categoryCounts["Chocolates, Candy & Sweets"] ? `${categoryCounts["Chocolates, Candy & Sweets"]} items` : "596 items",
    },
    {
      name: "Protein Bars, Energy Bars & Wafers",
      href: "/products?category=Protein+Bars%2C+Energy+Bars+%26+Wafers",
      icon: "⚡",
      desc: "Whey & vegan protein bars, energy bars & protein wafers",
      badge: categoryCounts["Protein Bars, Energy Bars & Wafers"] ? `${categoryCounts["Protein Bars, Energy Bars & Wafers"]} items` : "126 items",
    },
    {
      name: "Breakfast Cereals, Muesli & Granola",
      href: "/products?category=Breakfast+Cereals%2C+Muesli+%26+Granola",
      icon: "🥣",
      desc: "Corn flakes, multigrain muesli, granola & kids' cereals",
      badge: categoryCounts["Breakfast Cereals, Muesli & Granola"] ? `${categoryCounts["Breakfast Cereals, Muesli & Granola"]} items` : "261 items",
    },
    {
      name: "Oats & Porridge",
      href: "/products?category=Oats+%26+Porridge",
      icon: "🌾",
      desc: "Rolled oats, instant oats, steel-cut oats, masala oats & dalia",
      badge: categoryCounts["Oats & Porridge"] ? `${categoryCounts["Oats & Porridge"]} items` : "75 items",
    },
    {
      name: "Bakery & Breads",
      href: "/products?category=Bakery+%26+Breads",
      icon: "🍞",
      desc: "Whole wheat breads, burger buns, pav, cakes & muffins",
      badge: categoryCounts["Bakery & Breads"] ? `${categoryCounts["Bakery & Breads"]} items` : "106 items",
    },
    {
      name: "Noodles, Pasta & Vermicelli",
      href: "/products?category=Noodles%2C+Pasta+%26+Vermicelli",
      icon: "🍜",
      desc: "Instant noodles, durum wheat pasta, vermicelli, ramen & macaroni",
      badge: categoryCounts["Noodles, Pasta & Vermicelli"] ? `${categoryCounts["Noodles, Pasta & Vermicelli"]} items` : "286 items",
    },
    {
      name: "Ready-to-Eat Meals & Instant Foods",
      href: "/products?category=Ready-to-Eat+Meals+%26+Instant+Foods",
      icon: "🍲",
      desc: "Heat & eat curries, packaged soups, instant meals & frozen snacks",
      badge: categoryCounts["Ready-to-Eat Meals & Instant Foods"] ? `${categoryCounts["Ready-to-Eat Meals & Instant Foods"]} items` : "160 items",
    },
    {
      name: "Ready-to-Cook Mixes",
      href: "/products?category=Ready-to-Cook+Mixes",
      icon: "👩‍🍳",
      desc: "Dosa/idli batter, pancake mixes, gulab jamun mix & cake mixes",
      badge: categoryCounts["Ready-to-Cook Mixes"] ? `${categoryCounts["Ready-to-Cook Mixes"]} items` : "44 items",
    },
    {
      name: "Rice, Grains, Pulses & Flours",
      href: "/products?category=Rice%2C+Grains%2C+Pulses+%26+Flours",
      icon: "🌾",
      desc: "Whole wheat atta, basmati rice, millets, pulses, dals & poha",
      badge: categoryCounts["Rice, Grains, Pulses & Flours"] ? `${categoryCounts["Rice, Grains, Pulses & Flours"]} items` : "47 items",
    },
    {
      name: "Nuts, Seeds & Trail Mixes",
      href: "/products?category=Nuts%2C+Seeds+%26+Trail+Mixes",
      icon: "🥜",
      desc: "Almonds, cashews, walnuts, chia seeds, pumpkin seeds & trail mixes",
      badge: categoryCounts["Nuts, Seeds & Trail Mixes"] ? `${categoryCounts["Nuts, Seeds & Trail Mixes"]} items` : "98 items",
    },
    {
      name: "Nut Butters, Spreads & Dips",
      href: "/products?category=Nut+Butters%2C+Spreads+%26+Dips",
      icon: "🍯",
      desc: "Peanut butter, almond butter, hazelnut spreads, jams & hummus",
      badge: categoryCounts["Nut Butters, Spreads & Dips"] ? `${categoryCounts["Nut Butters, Spreads & Dips"]} items` : "161 items",
    },
    {
      name: "Sauces, Condiments & Seasonings",
      href: "/products?category=Sauces%2C+Condiments+%26+Seasonings",
      icon: "🥫",
      desc: "Tomato ketchup, hot sauces, chutneys, mayonnaise & seasonings",
      badge: categoryCounts["Sauces, Condiments & Seasonings"] ? `${categoryCounts["Sauces, Condiments & Seasonings"]} items` : "140 items",
    },
    {
      name: "Dairy, Yogurt & Dairy Alternatives",
      href: "/products?category=Dairy%2C+Yogurt+%26+Dairy+Alternatives",
      icon: "🥛",
      desc: "Milk, Greek yogurt, curd, paneer, cheese, butter, ghee & plant milks",
      badge: categoryCounts["Dairy, Yogurt & Dairy Alternatives"] ? `${categoryCounts["Dairy, Yogurt & Dairy Alternatives"]} items` : "231 items",
    },
    {
      name: "Beverages & Drink Mixes",
      href: "/products?category=Beverages+%26+Drink+Mixes",
      icon: "🥤",
      desc: "Cold drinks, colas, fruit juices, iced teas, energy drinks & syrups",
      badge: categoryCounts["Beverages & Drink Mixes"] ? `${categoryCounts["Beverages & Drink Mixes"]} items` : "761 items",
    },
    {
      name: "Ice Cream & Frozen Desserts",
      href: "/products?category=Ice+Cream+%26+Frozen+Desserts",
      icon: "🍦",
      desc: "Ice cream tubs, ice cream bars, kulfi, cones, gelato & sorbet",
      badge: categoryCounts["Ice Cream & Frozen Desserts"] ? `${categoryCounts["Ice Cream & Frozen Desserts"]} items` : "619 items",
    },
    {
      name: "Plant-Based Foods & Meat Alternatives",
      href: "/products?category=Plant-Based+Foods+%26+Meat+Alternatives",
      icon: "🌱",
      desc: "Plant-based meat, mock meats, soya chaap, vegan burgers & tofu",
      badge: categoryCounts["Plant-Based Foods & Meat Alternatives"] ? `${categoryCounts["Plant-Based Foods & Meat Alternatives"]} items` : "18 items",
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
                        const isThisPending = isPending && pendingHref === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            prefetch={true}
                            onClick={(e) => handleNavigate(e, item.href)}
                            onMouseEnter={() => router.prefetch(item.href)}
                            onTouchStart={() => router.prefetch(item.href)}
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
                              {isThisPending ? (
                                <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                              ) : (
                                <>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                      {item.badge}
                                    </span>
                                  )}
                                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                                </>
                              )}
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
                        const isThisPending = isPending && pendingHref === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            prefetch={true}
                            onClick={(e) => handleNavigate(e, item.href)}
                            onMouseEnter={() => router.prefetch(item.href)}
                            onTouchStart={() => router.prefetch(item.href)}
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
                              {isThisPending ? (
                                <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                              ) : (
                                <>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                      {item.badge}
                                    </span>
                                  )}
                                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                                </>
                              )}
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
                      const isThisPending = isPending && pendingHref === s.href;
                      return (
                        <Link
                          key={s.name}
                          href={s.href}
                          prefetch={true}
                          onClick={(e) => handleNavigate(e, s.href)}
                          onMouseEnter={() => router.prefetch(s.href)}
                          onTouchStart={() => router.prefetch(s.href)}
                          className={cn(
                            "p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-colors",
                            isThisPending
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                              : "bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200/60 dark:border-stone-800 text-stone-800 dark:text-stone-200"
                          )}
                        >
                          {isThisPending ? (
                            <RefreshCw className="w-3.5 h-3.5 shrink-0 text-emerald-500 animate-spin" />
                          ) : (
                            <Icon className={cn("w-3.5 h-3.5 shrink-0", s.color)} />
                          )}
                          <span className="truncate">{s.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Platform Navigation */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
                    Account & Community
                  </div>
                  {isAuthenticated && user ? (
                    <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        openLoginModal();
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer mb-3"
                    >
                      <LogIn className="w-4 h-4 text-emerald-500" />
                      <span>Sign in with Google</span>
                    </button>
                  )}

                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
                    Platform Tools
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/scan"
                      prefetch={true}
                      onClick={(e) => handleNavigate(e, "/scan")}
                      onMouseEnter={() => router.prefetch("/scan")}
                      onTouchStart={() => router.prefetch("/scan")}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <ScanLine className="w-4 h-4 text-emerald-500" />
                      <span>Live Barcode Camera Scanner</span>
                    </Link>
                    <Link
                      href="/compare"
                      prefetch={true}
                      onClick={(e) => handleNavigate(e, "/compare")}
                      onMouseEnter={() => router.prefetch("/compare")}
                      onTouchStart={() => router.prefetch("/compare")}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <Scale className="w-4 h-4 text-teal-500" />
                      <span>Side-by-Side Product Comparison</span>
                    </Link>
                    <Link
                      href="/submit"
                      prefetch={true}
                      onClick={(e) => handleNavigate(e, "/submit")}
                      onMouseEnter={() => router.prefetch("/submit")}
                      onTouchStart={() => router.prefetch("/submit")}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <PlusCircle className="w-4 h-4 text-cyan-500" />
                      <span>Submit New Food Product</span>
                    </Link>
                    <Link
                      href="/admin"
                      prefetch={true}
                      onClick={(e) => handleNavigate(e, "/admin")}
                      onMouseEnter={() => router.prefetch("/admin")}
                      onTouchStart={() => router.prefetch("/admin")}
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
                  prefetch={true}
                  onClick={(e) => handleNavigate(e, "/products")}
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
