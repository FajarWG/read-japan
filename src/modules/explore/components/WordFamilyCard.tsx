"use client";

import React from "react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { cleanJMdictArray } from "@/src/shared/lib/sanitize";

export interface WordFamilyItem {
  id: number;
  kanji: string;
  reading: string;
  meanings: any[];
  jlpt: number | null;
  status?: ProgressStatus;
}

interface WordFamilyCardProps {
  title: string;
  words: WordFamilyItem[];
  levelBadge: "Beginner" | "Intermediate" | "Advanced";
  onSelectWord: (word: string) => void;
}

export const WordFamilyCard: React.FC<WordFamilyCardProps> = ({
  title,
  words,
  levelBadge,
  onSelectWord,
}) => {
  if (words.length === 0) return null;

  const badgeColors = {
    Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <div className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900 dark:text-white">{title}</span>
        <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full ${badgeColors[levelBadge]}`}>
          {levelBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {words.map((w) => {
          const glosses = cleanJMdictArray(w.meanings).join("; ");

          return (
            <button
              key={w.id}
              onClick={() => onSelectWord(w.kanji || w.reading)}
              className="flex flex-col gap-1 p-3.5 bg-white dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-left transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-japanese">
                    {w.kanji}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-japanese">
                    {w.reading}
                  </span>
                </div>
                {w.status && <ProgressBadge status={w.status} size="sm" />}
              </div>
              {glosses && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 group-hover:text-slate-800 dark:group-hover:text-slate-300">
                  {glosses}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
