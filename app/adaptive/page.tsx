"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Sparkles, Brain, ArrowRight, Loader2 } from "lucide-react";
import { ExploreDrawer, ExploreTarget } from "@/src/modules/explore/components/ExploreDrawer";

interface WeakKanji {
  kanji: string;
  weakScore: number;
  confusionCount: number;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

interface Recommendation {
  kanji: string;
  reason: string;
  targetKanji: string;
}

export default function AdaptiveDashboardPage() {
  const [weakKanji, setWeakKanji] = useState<WeakKanji[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [exploreTarget, setExploreTarget] = useState<ExploreTarget | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [weakRes, recRes] = await Promise.all([
          fetch("/api/adaptive/weak"),
          fetch("/api/adaptive/recommendations"),
        ]);

        if (weakRes.ok) {
          const json = await weakRes.json();
          setWeakKanji(json.weakKanji || []);
        }

        if (recRes.ok) {
          const json = await recRes.json();
          setRecommendations(json.recommendations || []);
        }
      } catch (err) {
        console.error("Failed to load adaptive dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const openExplore = (kanji: string) => {
    setExploreTarget({ type: "kanji", query: kanji });
    setIsExploreOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Adaptive Learning Engine
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Personalized weak kanji detection, confusion tracking, and study recommendations.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Analyzing your learning patterns...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Weak Kanji & Confusion Analysis */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Weak Kanji Section */}
              <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Weak Kanji Detector ({weakKanji.length})</span>
                  </div>
                  <span className="text-xs text-slate-500">Ranked by Weak Score</span>
                </div>

                {weakKanji.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                    🎉 Excellent! No high-weakness kanji detected in your recent reviews.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {weakKanji.map((wk, idx) => (
                      <button
                        key={idx}
                        onClick={() => openExplore(wk.kanji)}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/50 rounded-2xl transition-all text-left group shadow-sm cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors font-japanese">
                            {wk.kanji}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize">
                              {wk.meanings.slice(0, 2).join(", ")}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {wk.onyomi.concat(wk.kunyomi).slice(0, 2).join(" • ")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-1 text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-full">
                            Score {wk.weakScore}
                          </span>
                          {wk.confusionCount > 0 && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                              {wk.confusionCount} confusions
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Adaptive Recommendations */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>Recommended Next</span>
                </div>

                <div className="flex flex-col gap-3">
                  {recommendations.map((rec, idx) => (
                    <button
                      key={idx}
                      onClick={() => openExplore(rec.kanji)}
                      className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 rounded-2xl text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-slate-900 dark:text-white font-japanese group-hover:text-amber-600 dark:group-hover:text-amber-300">
                            {rec.kanji}
                          </span>
                          <span className="text-xs font-bold text-slate-400">vs</span>
                          <span className="text-xl font-bold text-slate-500 dark:text-slate-400 font-japanese">
                            {rec.targetKanji}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{rec.reason}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explore Drawer */}
      <ExploreDrawer
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        initialTarget={exploreTarget}
      />
    </div>
  );
}
