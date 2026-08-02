"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { ExploreTarget } from "./ExploreDrawer";
import { cleanJMdictString } from "@/src/shared/lib/sanitize";

interface SearchResultItem {
  type: "vocab" | "kanji";
  query: string;
  title: string;
  subtext: string;
  meaning: string;
  jlpt: number | null;
}

interface ExploreSearchProps {
  onSelectTarget: (target: ExploreTarget) => void;
}

export const ExploreSearch: React.FC<ExploreSearchProps> = ({ onSelectTarget }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/explore/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search word or kanji (e.g. 学校, 学, がっこう)..."
          className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 rounded-xl border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all font-japanese"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto p-1.5 flex flex-col gap-1 backdrop-blur-xl">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-xs text-slate-500 dark:text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">
              No matching word or kanji found.
            </div>
          ) : (
            results.map((r, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectTarget({ type: r.type, query: r.query });
                  setQuery("");
                  setIsOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      r.type === "kanji"
                        ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {r.type === "kanji" ? "K" : "V"}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-japanese">
                        {r.title}
                      </span>
                      {r.subtext && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-japanese">
                          {r.subtext}
                        </span>
                      )}
                    </div>
                    {r.meaning && (
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                        {cleanJMdictString(r.meaning)}
                      </span>
                    )}
                  </div>
                </div>

                {r.jlpt && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md shrink-0">
                    N{r.jlpt}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
