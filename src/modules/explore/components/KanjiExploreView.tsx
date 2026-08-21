"use client";

import React, { useEffect, useState } from "react";
import { StrokeViewer } from "./StrokeViewer";
import { BookOpen, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { WordFamilyCard, WordFamilyItem } from "./WordFamilyCard";
import { KanjiComparisonModal } from "./KanjiComparisonModal";
import { ExploreSkeleton } from "@/src/shared/components/LoadingSkeleton";
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

interface SimilarKanjiEntry {
  kanji: string;
  similarKanji: string;
  reason: string;
  difficulty?: string;
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
    similarKanji?: SimilarKanjiEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comparisonState, setComparisonState] = useState<{
    similarKanji: string;
    reason: string;
  } | null>(null);

  const cleanLiteral = (literal || "").replace(/<[^>]*>/g, "").trim();

  const fetchKanjiDetails = async () => {
    if (!cleanLiteral) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/explore/kanji/${encodeURIComponent(cleanLiteral)}`,
      );
      if (!res.ok) throw new Error("Failed to load kanji details");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!cleanLiteral) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/explore/kanji/${encodeURIComponent(cleanLiteral)}`,
        );
        if (!res.ok) throw new Error("Failed to load kanji details");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An error occurred",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [cleanLiteral]);

  if (!cleanLiteral) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted gap-2 text-center">
        <BookOpen className="w-8 h-8 opacity-40 text-muted" />
        <span className="text-xs font-medium">Select a kanji to explore</span>
      </div>
    );
  }

  if (loading) {
    return <ExploreSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-rose-500/10 rounded-2xl border border-rose-500/30 my-4 gap-3">
        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
          {error || `Could not load details for Kanji "${cleanLiteral}".`}
        </p>
        <button
          type="button"
          onClick={fetchKanjiDetails}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-foreground hover:bg-surface-muted border border-border rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  const { kanji, words, wordFamily, similarKanji } = data;
  const cleanedMeanings = kanji.meanings.map(cleanJMdictString).filter(Boolean);

  const primarySimilar =
    similarKanji && similarKanji.length > 0 ? similarKanji[0] : null;
  const otherKanji = primarySimilar
    ? primarySimilar.kanji === kanji.literal
      ? primarySimilar.similarKanji
      : primarySimilar.kanji
    : null;

  return (
    <div className="flex flex-col gap-4 py-1 text-foreground">
      {/* Similar / Confusion Warning Banner */}
      {primarySimilar && otherKanji && (
        <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-foreground shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Easily Confused
              </span>
              <span className="text-xs font-medium text-foreground">
                Often confused with{" "}
                <strong className="text-amber-600 dark:text-amber-400 font-jp text-sm">
                  {otherKanji}
                </strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setComparisonState({
                similarKanji: otherKanji,
                reason: primarySimilar.reason,
              })
            }
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all cursor-pointer shrink-0"
          >
            <span>Compare</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header Card: Stroke Viewer + Kanji Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 bg-surface-muted/40 rounded-2xl border border-border/80 shadow-2xs">
        <div className="shrink-0">
          <StrokeViewer
            kanji={kanji.literal}
            unicode={kanji.unicode}
            strokeCount={kanji.strokeCount}
          />
        </div>

        <div className="flex-1 text-center sm:text-left flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-jp">
              {kanji.literal}
            </h1>
            {kanji.userStatus && (
              <ProgressBadge status={kanji.userStatus} size="sm" />
            )}
            {kanji.jlpt && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                JLPT N{kanji.jlpt}
              </span>
            )}
            {kanji.grade && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full">
                Grade {kanji.grade}
              </span>
            )}
            {kanji.usageCount !== undefined && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">
                {kanji.usageCount} Vocabularies
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-foreground capitalize">
            {cleanedMeanings.length > 0
              ? cleanedMeanings.join(", ")
              : "No meaning listed"}
          </p>

          {/* Readings */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
            {kanji.onyomi.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider min-w-[50px]">
                  Onyomi
                </span>
                {kanji.onyomi.map((on, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md font-jp"
                  >
                    {on}
                  </span>
                ))}
              </div>
            )}
            {kanji.kunyomi.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider min-w-[50px]">
                  Kunyomi
                </span>
                {kanji.kunyomi.map((kun, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-md font-jp"
                  >
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Vocabulary Using {kanji.literal} ({words.length})</span>
          </div>

          {words.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted bg-surface rounded-xl border border-border">
              No vocabulary linked to this kanji yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {words.map((w) => {
                const glosses = cleanJMdictArray(w.meanings).join("; ");

                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onSelectWord(w.kanji || w.reading)}
                    className="flex flex-col gap-0.5 p-2.5 bg-surface hover:bg-surface-muted border border-border hover:border-indigo-500/40 rounded-xl text-left transition-all group shadow-2xs cursor-pointer"
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
          )}
        </div>
      )}

      {/* Comparison Modal */}
      {comparisonState && (
        <KanjiComparisonModal
          kanjiA={kanji.literal}
          kanjiB={comparisonState.similarKanji}
          reason={comparisonState.reason}
          onClose={() => setComparisonState(null)}
        />
      )}
    </div>
  );
};


