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
import { cleanJMdictArray, cleanJMdictString } from "@/src/shared/lib/sanitize";

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

  const cleanedMeanings = kanji.meanings.map(cleanJMdictString).filter(Boolean);

  return (
    <div className="flex flex-col gap-6 py-2 text-slate-900 dark:text-slate-100">
      {/* Confusion Banner */}
      <ConfusionBanner
        kanji={kanji.literal}
        onOpenComparison={(similarKanji, reason) => setComparisonState({ similarKanji, reason })}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-blue-950/30 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <StrokeViewer kanji={kanji.literal} unicode={kanji.unicode} strokeCount={kanji.strokeCount} />

        <div className="flex-1 text-center sm:text-left flex flex-col gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-japanese">
              {kanji.literal}
            </h1>
            {kanji.userStatus && <ProgressBadge status={kanji.userStatus} size="md" />}
            {kanji.jlpt && (
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                JLPT N{kanji.jlpt}
              </span>
            )}
            {kanji.grade && (
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full">
                Grade {kanji.grade}
              </span>
            )}
            {kanji.usageCount !== undefined && (
              <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">
                Used in {kanji.usageCount} Vocabularies
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
            {cleanedMeanings.length > 0 ? cleanedMeanings.join(", ") : "No meaning listed"}
          </p>

          {/* Readings */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            {kanji.onyomi.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[60px]">
                  Onyomi
                </span>
                {kanji.onyomi.map((on, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-lg">
                    {on}
                  </span>
                ))}
              </div>
            )}
            {kanji.kunyomi.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[60px]">
                  Kunyomi
                </span>
                {kanji.kunyomi.map((kun, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-lg">
                    {kun}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Word Family Grouped Section */}
      {wordFamily ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-semibold text-base px-1">
            <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Word Family Categorized</span>
          </div>

          <WordFamilyCard
            title="Beginner Vocabulary (N5 - N4)"
            words={wordFamily.beginner}
            levelBadge="Beginner"
            onSelectWord={onSelectWord}
          />
          <WordFamilyCard
            title="Intermediate Vocabulary (N3)"
            words={wordFamily.intermediate}
            levelBadge="Intermediate"
            onSelectWord={onSelectWord}
          />
          <WordFamilyCard
            title="Advanced Vocabulary (N2 - N1)"
            words={wordFamily.advanced}
            levelBadge="Advanced"
            onSelectWord={onSelectWord}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-semibold text-base px-1">
            <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Vocabulary Using {kanji.literal} ({words.length})</span>
          </div>

          {words.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/60">
              No vocabulary linked to this kanji yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {words.map((w) => {
                const glosses = cleanJMdictArray(w.meanings).join("; ");

                return (
                  <button
                    key={w.id}
                    onClick={() => onSelectWord(w.kanji || w.reading)}
                    className="flex flex-col gap-1.5 p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 rounded-2xl text-left transition-all duration-200 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-japanese">
                          {w.kanji}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
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
