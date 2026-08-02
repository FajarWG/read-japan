"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface ConfusionBannerProps {
  kanji: string;
  onOpenComparison: (similarKanji: string, reason: string) => void;
}

export const ConfusionBanner: React.FC<ConfusionBannerProps> = ({
  kanji,
  onOpenComparison,
}) => {
  const [similarPair, setSimilarPair] = useState<{ similarKanji: string; reason: string } | null>(null);

  useEffect(() => {
    async function checkSimilar() {
      try {
        const res = await fetch(`/api/adaptive/similar/${encodeURIComponent(kanji)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.similarPairs && json.similarPairs.length > 0) {
            const first = json.similarPairs[0];
            const other = first.kanji === kanji ? first.similarKanji : first.kanji;
            setSimilarPair({ similarKanji: other, reason: first.reason });
          }
        }
      } catch (err) {
        console.error("Failed to check similar kanji:", err);
      }
    }

    checkSimilar();
  }, [kanji]);

  if (!similarPair) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-800 dark:text-amber-300 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Often Confused
          </span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Confused with <strong className="text-amber-600 dark:text-amber-300 font-japanese text-base">{similarPair.similarKanji}</strong>
          </span>
        </div>
      </div>

      <button
        onClick={() => onOpenComparison(similarPair.similarKanji, similarPair.reason)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
      >
        <span>Compare</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
