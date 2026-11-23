"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  count?: number;
}

interface SearchableComboboxProps {
  label: string;
  placeholder?: string;
  value: string;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export function SearchableCombobox({
  label,
  placeholder = "Search...",
  value,
  options,
  onChange,
  allLabel = "All",
  className,
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase().trim();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(term) || opt.value.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const displayLabel = value === "All" || !value ? allLabel : (selectedOption?.label || value);
  const isSelected = value !== "All" && Boolean(value);

  return (
    <div ref={containerRef} className={cn("relative w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
          {label}
        </label>
        {isSelected && (
          <button
            type="button"
            onClick={() => {
              onChange("All");
              setIsOpen(false);
            }}
            className="text-[10px] text-stone-400 hover:text-rose-500 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border text-sm transition-all text-left bg-stone-50 dark:bg-stone-800/80 cursor-pointer",
            isSelected
              ? "border-emerald-500/60 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-500/5 dark:bg-emerald-500/10"
              : "border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-stone-300 dark:hover:border-stone-600",
            isOpen && "ring-2 ring-emerald-500/30 border-emerald-500"
          )}
        >
          <span className="truncate block flex-1">
            {displayLabel}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {isSelected && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("All");
                  setIsOpen(false);
                }}
                className="p-0.5 hover:text-rose-500 rounded-full transition-colors text-stone-400"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-stone-400 transition-transform duration-200",
                isOpen && "rotate-180 text-emerald-500"
              )}
            />
          </div>
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input inside popover */}
            <div className="p-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 text-xs">
              {/* "All" Option */}
              <button
                type="button"
                onClick={() => {
                  onChange("All");
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer",
                  !isSelected
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                )}
              >
                <span>{allLabel}</span>
                {!isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </button>

              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-stone-400">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer",
                        active
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      )}
                    >
                      <span className="truncate pr-2">{opt.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {opt.count !== undefined && (
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                              active
                                ? "bg-emerald-500 text-stone-950 font-bold"
                                : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                            )}
                          >
                            {opt.count.toLocaleString()}
                          </span>
                        )}
                        {active && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
