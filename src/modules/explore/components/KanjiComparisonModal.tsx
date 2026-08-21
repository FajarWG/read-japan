"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, HelpCircle } from "lucide-react";
import { StrokeViewer } from "./StrokeViewer";
import { cleanJMdictString } from "@/src/shared/lib/sanitize";

interface KanjiInfo {
  literal: string;
  unicode: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
}

interface KanjiComparisonModalProps {
  kanjiA: string;
  kanjiB: string;
  reason?: string;
  onClose: () => void;
}

export const KanjiComparisonModal: React.FC<KanjiComparisonModalProps> = ({
  kanjiA,
  kanjiB,
  reason,
  onClose,
}) => {
  const [dataA, setDataA] = useState<KanjiInfo | null>(null);
  const [dataB, setDataB] = useState<KanjiInfo | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoth() {
      setLoading(true);
      try {
        const [resA, resB] = await Promise.all([
          fetch(`/api/explore/kanji/${encodeURIComponent(kanjiA)}`),
          fetch(`/api/explore/kanji/${encodeURIComponent(kanjiB)}`),
        ]);

        if (resA.ok) {
          const jsonA = await resA.json();
          setDataA(jsonA.kanji);
        }
        if (resB.ok) {
          const jsonB = await resB.json();
          setDataB(jsonB.kanji);
        }
      } catch (err) {
        console.error("Failed to load comparison data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBoth();
  }, [kanjiA, kanjiB]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-muted/30">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Kanji Comparison</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface hover:bg-surface-muted border border-border text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-foreground">
          {/* Side-by-side Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Kanji A */}
            <div className="flex flex-col items-center gap-3 p-4 bg-surface-muted/40 rounded-2xl border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Current Kanji
              </span>
              {dataA ? (
                <>
                  <StrokeViewer
                    kanji={dataA.literal}
                    unicode={dataA.unicode}
                    strokeCount={dataA.strokeCount}
                  />
                  <div className="text-center flex flex-col gap-0.5">
                    <h2 className="text-3xl font-black text-foreground font-jp">
                      {dataA.literal}
                    </h2>
                    <p className="text-xs font-semibold text-foreground capitalize line-clamp-1">
                      {dataA.meanings.map(cleanJMdictString).slice(0, 2).join(", ")}
                    </p>
                    <p className="text-[10px] text-muted font-jp line-clamp-1">
                      {dataA.onyomi.concat(dataA.kunyomi).slice(0, 2).join(" • ")}
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground font-jp">{kanjiA}</span>
              )}
            </div>

            {/* Kanji B */}
            <div className="flex flex-col items-center gap-3 p-4 bg-surface-muted/40 rounded-2xl border border-amber-500/20">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Similar Kanji
              </span>
              {dataB ? (
                <>
                  <StrokeViewer
                    kanji={dataB.literal}
                    unicode={dataB.unicode}
                    strokeCount={dataB.strokeCount}
                  />
                  <div className="text-center flex flex-col gap-0.5">
                    <h2 className="text-3xl font-black text-foreground font-jp">
                      {dataB.literal}
                    </h2>
                    <p className="text-xs font-semibold text-foreground capitalize line-clamp-1">
                      {dataB.meanings.map(cleanJMdictString).slice(0, 2).join(", ")}
                    </p>
                    <p className="text-[10px] text-muted font-jp line-clamp-1">
                      {dataB.onyomi.concat(dataB.kunyomi).slice(0, 2).join(" • ")}
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground font-jp">{kanjiB}</span>
              )}
            </div>
          </div>

          {/* Difference Explanation Banner */}
          {reason && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-foreground text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-wider">
                  Distinction / Note
                </span>
                <p className="font-medium text-foreground">{cleanJMdictString(reason)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
