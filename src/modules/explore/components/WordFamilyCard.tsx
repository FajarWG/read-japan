"use client";

import React, { useState } from "react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { Sparkles, Layers } from "lucide-react";

export interface WordFamilyItem {
  id: number;
  kanji: string;
  reading: string;
  meanings: any;
  jlpt: number | null;
  status: ProgressStatus;
}

interface WordFamilyCardProps {
  wordFamily: {
    beginner: WordFamilyItem[];
    intermediate: WordFamilyItem[];
    advanced: WordFamilyItem[];
  };
  onSelectWord: (word: string) => void;
}

export const WordFamilyCard: React.FC<WordFamilyCardProps> = ({
  wordFamily,
  onSelectWord,
}) => {
  const [activeTab, setActiveTab] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const categoryMap = {
    beginner: { label: "Beginner (N5-N4)", list: wordFamily.beginner, color: "text-emerald-400 border-emerald-500/30" },
    intermediate: { label: "Intermediate (N3-N2)", list: wordFamily.intermediate, color: "text-blue-400 border-blue-500/30" },
    advanced: { label: "Advanced (N1+)", list: wordFamily.advanced, color: "text-purple-400 border-purple-500/30" },
  };

  const currentCategory = categoryMap[activeTab];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-base">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Word Family</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
        {(["beginner", "intermediate", "advanced"] as const).map((tab) => {
          const count = wordFamily[tab].length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all text-center ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Word List for Active Tab */}
      {currentCategory.list.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          No {activeTab} level words recorded for this kanji.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentCategory.list.map((w) => {
            const glosses = Array.isArray(w.meanings)
              ? w.meanings.map((m: any) => (typeof m === "string" ? m : m.glosses?.join(", "))).filter(Boolean).join("; ")
              : "";

            return (
              <button
                key={w.id}
                onClick={() => onSelectWord(w.kanji || w.reading)}
                className="flex flex-col gap-1.5 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl text-left transition-all duration-200 group shadow-sm hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors font-japanese">
                      {w.kanji}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {w.reading}
                    </span>
                  </div>
                  <ProgressBadge status={w.status} size="sm" />
                </div>

                {glosses && (
                  <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-300">
                    {glosses}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
