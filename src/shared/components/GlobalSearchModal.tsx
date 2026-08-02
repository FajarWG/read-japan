"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Command, X, Loader2 } from "lucide-react";
import { ExploreDrawer, ExploreTarget } from "@/src/modules/explore/components/ExploreDrawer";

interface SearchItem {
  type: "vocab" | "kanji";
  query: string;
  title: string;
  subtext: string;
  meaning: string;
  jlpt: number | null;
}

export function openGlobalSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-global-search"));
  }
}

export const GlobalSearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [exploreTarget, setExploreTarget] = useState<ExploreTarget | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Listen for custom event OR Cmd+K / Ctrl+K hotkeys
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("open-global-search", handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-global-search", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/explore/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.results || []);
        }
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const selectResult = (item: SearchItem) => {
    setIsOpen(false);
    setExploreTarget({ type: item.type, query: item.query });
    setIsExploreOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/50">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search kanji, vocabulary, grammar (Cmd + K)..."
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm focus:outline-none font-japanese"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                <Command className="w-3 h-3" /> K
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results List */}
            <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  Searching across Nihongo Flow...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  {query.trim() ? "No matching entries found." : "Type a word or kanji to explore..."}
                </div>
              ) : (
                results.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectResult(r)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider ${
                          r.type === "kanji"
                            ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {r.type === "kanji" ? "K" : "V"}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-japanese">
                            {r.title}
                          </span>
                          {r.subtext && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-japanese">
                              {r.subtext}
                            </span>
                          )}
                        </div>
                        {r.meaning && (
                          <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {r.meaning}
                          </span>
                        )}
                      </div>
                    </div>

                    {r.jlpt && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg shrink-0">
                        N{r.jlpt}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explore Drawer */}
      <ExploreDrawer
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        initialTarget={exploreTarget}
      />
    </>
  );
};
