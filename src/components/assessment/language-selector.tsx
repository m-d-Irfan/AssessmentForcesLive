"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Search,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "./language-data";

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  className?: string;
}

export function LanguageSelector({
  currentLanguage,
  onSelectLanguage,
  className = "",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const categories = ["All", "Web & Fullstack", "Systems & Native", "Backend & Enterprise"];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const matchesCategory =
      activeCategory === "All" || lang.category === activeCategory;
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.shortTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.runtimeBadge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Sophisticated Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-mono select-none ${
          isOpen
            ? "bg-slate-900 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40"
            : "bg-[#0b101c] border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 shadow-xs"
        }`}
      >
        {/* Language Brand Monogram Badge */}
        <span
          className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] tracking-wider border transition-colors ${currentLanguage.badgeClass}`}
        >
          {currentLanguage.shortTag}
        </span>

        {/* Language Display Name */}
        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
          {currentLanguage.displayName}
        </span>

        {/* Runtime / Version Pill */}
        <span className="hidden sm:inline-flex items-center text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
          {currentLanguage.runtimeBadge}
        </span>

        {/* Animated Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      {/* Sophisticated Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-[#090d18]/95 backdrop-blur-2xl border border-slate-800/90 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages, runtimes, versions..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors font-sans ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60"
                  }`}
                >
                  {cat === "All" ? `All (${SUPPORTED_LANGUAGES.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No matching programming languages found.
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.id === currentLanguage.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(lang);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-blue-600/15 border border-blue-500/40 text-white"
                        : "hover:bg-slate-900/90 border border-transparent text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Monogram Badge */}
                      <span
                        className={`w-7 h-7 shrink-0 rounded flex items-center justify-center font-extrabold text-[11px] font-mono border ${lang.badgeClass}`}
                      >
                        {lang.shortTag}
                      </span>

                      {/* Name & Version */}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-100">
                            {lang.displayName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {lang.version}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {lang.runtimeBadge} • {lang.testFramework.split(" ")[0]}
                        </div>
                      </div>
                    </div>

                    {/* Active Checkmark or Arrow */}
                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono hidden group-hover:inline">
                          Select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer with runtime isolation note */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3 h-3 text-blue-400" />
              Isolated V8 / Linux Cgroups
            </span>
            <span className="text-emerald-400 font-semibold">10 Runtimes Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
