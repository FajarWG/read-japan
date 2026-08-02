"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, HelpCircle } from "lucide-react";
import { StrokeViewer } from "@/src/modules/explore/components/StrokeViewer";

interface KanjiInfo {
  literal: string;
  unicode: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
}

interface KanjiComparisonViewProps {
  kanjiA: string;
  kanjiB: string;
  reason?: string;
  onClose: () => void;
}

export const KanjiComparisonView: React.FC<KanjiComparisonViewProps> = ({
  kanjiA,
  kanjiB,
  reason,
  onClose,
}) => {
  const [dataA, setDataA] = useState<KanjiInfo | null>(null);
  const [dataB, setDataB] = useState<KanjiInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Kanji Difference Comparison</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Side-by-side Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Kanji A */}
            <div className="flex flex-col items-center gap-4 p-5 bg-slate-950/60 rounded-2xl border border-blue-500/20">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Target Kanji</span>
              {dataA ? (
                <>
                  <StrokeViewer kanji={dataA.literal} unicode={dataA.unicode} strokeCount={dataA.strokeCount} />
                  <div className="text-center flex flex-col gap-1">
                    <h2 className="text-4xl font-black text-white font-japanese">{dataA.literal}</h2>
                    <p className="text-xs font-semibold text-slate-300 capitalize">{dataA.meanings.slice(0, 2).join(", ")}</p>
                    <p className="text-[11px] text-slate-500">{dataA.onyomi.concat(dataA.kunyomi).slice(0, 2).join(" • ")}</p>
                  </div>
                </>
              ) : (
                <span className="text-3xl font-bold text-white font-japanese">{kanjiA}</span>
              )}
            </div>

            {/* Kanji B */}
            <div className="flex flex-col items-center gap-4 p-5 bg-slate-950/60 rounded-2xl border border-purple-500/20">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Confusing Kanji</span>
              {dataB ? (
                <>
                  <StrokeViewer kanji={dataB.literal} unicode={dataB.unicode} strokeCount={dataB.strokeCount} />
                  <div className="text-center flex flex-col gap-1">
                    <h2 className="text-4xl font-black text-white font-japanese">{dataB.literal}</h2>
                    <p className="text-xs font-semibold text-slate-300 capitalize">{dataB.meanings.slice(0, 2).join(", ")}</p>
                    <p className="text-[11px] text-slate-500">{dataB.onyomi.concat(dataB.kunyomi).slice(0, 2).join(" • ")}</p>
                  </div>
                </>
              ) : (
                <span className="text-3xl font-bold text-white font-japanese">{kanjiB}</span>
              )}
            </div>
          </div>

          {/* Difference Explanation Banner */}
          {reason && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-sm flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-amber-400 text-xs uppercase tracking-wider">Key Difference</span>
                <p className="font-medium text-slate-200">{reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
