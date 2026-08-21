"use client";

import React from "react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { cleanJMdictArray } from "@/src/shared/lib/sanitize";

export interface WordFamilyItem {
  id: number;
  kanji: string;
  reading: string;
  meanings: unknown[];
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
    Beginner:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Intermediate:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    Advanced:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <div className="flex flex-col gap-2 p-3.5 bg-surface rounded-2xl border border-border shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">{title}</span>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${badgeColors[levelBadge]}`}
        >
          {levelBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map((w) => {
          const glosses = cleanJMdictArray(w.meanings).join("; ");

          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onSelectWord(w.kanji || w.reading)}
              className="flex flex-col gap-0.5 p-2.5 bg-surface-muted/60 hover:bg-surface-muted border border-border hover:border-indigo-500/40 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors font-jp truncate">
                    {w.kanji}
                  </span>
                  <span className="text-[10px] text-muted font-jp truncate">
                    {w.reading}
                  </span>
                </div>
                {w.status && <ProgressBadge status={w.status} size="sm" />}
              </div>
              {glosses && (
                <p className="text-[10px] text-muted line-clamp-1 group-hover:text-foreground">
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

