"use client";

import React, { useEffect, useState } from "react";
import { StrokeViewer } from "./StrokeViewer";
import { Loader2, Sparkles, BookOpen, Layers } from "lucide-react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { WordFamilyCard, WordFamilyItem } from "./WordFamilyCard";
import { ConfusionBanner } from "@/src/modules/adaptive/components/ConfusionBanner";
import { KanjiComparisonView } from "@/src/modules/adaptive/components/KanjiComparisonView";
import { ExploreSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { ErrorState } from "@/src/shared/components/ErrorState";

interface KanjiData {
  id: number | null;
  literal: string;
  unicode: string;
  strokeCount: number;
  grade: number | null;
  jlpt: number | null;
  frequency: number | null;
  userStatus?: ProgressStatus;
  usageCount?: number;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  radicals: string[];
  strokeSvgUrl: string;
}

interface KanjiExploreViewProps {
  literal: string;
  onSelectWord: (word: string) => void;
}

export const KanjiExploreView: React.FC<KanjiExploreViewProps> = ({
  literal,
  onSelectWord,
}) => {
  const [data, setData] = useState<{
    kanji: KanjiData;
    words: WordFamilyItem[];
    wordFamily?: {
      beginner: WordFamilyItem[];
      intermediate: WordFamilyItem[];
      advanced: WordFamilyItem[];
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comparisonState, setComparisonState] = useState<{ similarKanji: string; reason: string } | null>(null);

  useEffect(() => {
    async function fetchKanjiDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/explore/kanji/${encodeURIComponent(literal)}`);
        if (!res.ok) throw new Error("Failed to load kanji details");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchKanjiDetails();
  }, [literal]);

  if (loading) {
    return <ExploreSkeleton />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Kanji Load Error"
        message={`Could not load details for Kanji ${literal}.`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { kanji, words, wordFamily } = data;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Confusion Banner */}
      <ConfusionBanner
        kanji={kanji.literal}
        onOpenComparison={(similarKanji, reason) => setComparisonState({ similarKanji, reason })}
      />
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-blue-950/30 rounded-3xl border border-slate-800 shadow-xl">
        <StrokeViewer kanji={kanji.literal} unicode={kanji.unicode} strokeCount={kanji.strokeCount} />

        <div className="flex-1 text-center sm:text-left flex flex-col gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <h1 className="text-5xl font-black tracking-tight text-white font-japanese">
              {kanji.literal}
            </h1>
            {kanji.userStatus && <ProgressBadge status={kanji.userStatus} size="md" />}
            {kanji.jlpt && (
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                JLPT N{kanji.jlpt}
              </span>
            )}
            {kanji.grade && (
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Grade {kanji.grade}
              </span>
            )}
            {kanji.usageCount !== undefined && (
              <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                Used in {kanji.usageCount} Vocabularies
              </span>
            )}
          </div>

          <p className="text-lg font-medium text-slate-200 capitalize">
            {kanji.meanings.length > 0 ? kanji.meanings.join(", ") : "No meaning listed"}
          </p>

          {/* Readings */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            {kanji.onyomi.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[60px]">
                  Onyomi
                </span>
                {kanji.onyomi.map((on, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-lg">
                    {on}
                  </span>
                ))}
              </div>
            )}
            {kanji.kunyomi.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[60px]">
                  Kunyomi
                </span>
                {kanji.kunyomi.map((kun, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-lg">
                    {kun}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Word Family Categorized Section */}
      {wordFamily ? (
        <WordFamilyCard wordFamily={wordFamily} onSelectWord={onSelectWord} />
      ) : (
        /* Fallback Words List */
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-base px-1">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Words using {kanji.literal} ({words.length})</span>
          </div>

          {words.length === 0 ? (
            <p className="text-sm text-slate-500 italic px-1">No vocabulary entries found for this kanji.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {words.map((w) => {
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
                      {w.status && <ProgressBadge status={w.status} size="sm" />}
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
      )}

      {/* Comparison Modal */}
      {comparisonState && (
        <KanjiComparisonView
          kanjiA={kanji.literal}
          kanjiB={comparisonState.similarKanji}
          reason={comparisonState.reason}
          onClose={() => setComparisonState(null)}
        />
      )}
    </div>
  );
};

