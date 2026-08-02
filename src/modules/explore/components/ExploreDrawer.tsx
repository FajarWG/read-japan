"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowLeft, Compass } from "lucide-react";
import { VocabularyExploreView } from "./VocabularyExploreView";
import { KanjiExploreView } from "./KanjiExploreView";
import { ExploreBreadcrumb } from "./ExploreBreadcrumb";
import { ExploreSearch } from "./ExploreSearch";

export interface ExploreTarget {
  type: "vocab" | "kanji";
  query: string;
}

interface ExploreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget: ExploreTarget | null;
}

export const ExploreDrawer: React.FC<ExploreDrawerProps> = ({
  isOpen,
  onClose,
  initialTarget,
}) => {
  const [history, setHistory] = useState<ExploreTarget[]>([]);

  useEffect(() => {
    if (isOpen && initialTarget) {
      setHistory([initialTarget]);
    } else if (!isOpen) {
      setHistory([]);
    }
  }, [isOpen, initialTarget]);

  if (!isOpen || history.length === 0) return null;

  const currentTarget = history[history.length - 1];

  const pushTarget = (target: ExploreTarget) => {
    setHistory((prev) => [...prev, target]);
  };

  const popTarget = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const jumpToHistoryIndex = (index: number) => {
    if (index >= 0 && index < history.length) {
      setHistory((prev) => prev.slice(0, index + 1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Content Panel */}
      <div className="relative w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header Navbar */}
        <div className="flex flex-col gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {history.length > 1 ? (
                <button
                  onClick={popTarget}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Compass className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Knowledge Navigation
                </span>
                <span className="text-base font-bold text-white font-japanese">
                  {currentTarget.query}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <ExploreSearch onSelectTarget={pushTarget} />

          {/* Breadcrumb Navigation Trail */}
          <ExploreBreadcrumb history={history} onSelectIndex={jumpToHistoryIndex} />
        </div>

        {/* Drawer Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-slate-800">
          {currentTarget.type === "vocab" ? (
            <VocabularyExploreView
              key={currentTarget.query}
              word={currentTarget.query}
              onSelectKanji={(literal) => pushTarget({ type: "kanji", query: literal })}
              onSelectWord={(word) => pushTarget({ type: "vocab", query: word })}
            />
          ) : (
            <KanjiExploreView
              key={currentTarget.query}
              literal={currentTarget.query}
              onSelectWord={(word) => pushTarget({ type: "vocab", query: word })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
