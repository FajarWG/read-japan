"use client";

import { useState, useTransition, useCallback } from "react";
import { Button } from "@heroui/react";

import type { KotobaLookupEntry } from "@/src/modules/prep/lib/kotoba-lookup";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { recordKotobaLookup } from "@/src/modules/stories/actions";

// ─────────────────────────────────────────
// VocabularyReview — Anki-style card flip untuk vocab di cerita
// ─────────────────────────────────────────

interface VocabularyReviewProps {
  vocabulary: Array<{
    entry: KotobaLookupEntry;
    surface: string;
    matchedChapter: number;
  }>;
  storyTitle: string;
  onExit: () => void;
}

export function VocabularyReview({
  vocabulary,
  storyTitle,
  onExit,
}: VocabularyReviewProps) {
  const { t } = useLanguage();

  const total = vocabulary.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const [, startTransition] = useTransition();

  const current = vocabulary[index];
  const progressPct = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

  const handleKnown = useCallback(async () => {
    if (!current) return;
    setKnown((prev) => new Set(prev).add(current.entry.progressKey));
    // Record click (positive) ke DB
    startTransition(async () => {
      try {
        await recordKotobaLookup(current.entry.progressKey);
      } catch (err) {
        console.error("[VocabularyReview] recordKotobaLookup gagal:", err);
      }
    });
    setFlipped(false);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [current, index, total]);

  const handleUnknown = useCallback(async () => {
    if (!current) return;
    setUnknown((prev) => new Set(prev).add(current.entry.progressKey));
    // Record as wrong / needs review
    startTransition(async () => {
      try {
        await recordKotobaLookup(current.entry.progressKey);
      } catch (err) {
        console.error("[VocabularyReview] recordKotobaLookup gagal:", err);
      }
    });
    setFlipped(false);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [current, index, total]);

  const handleSkip = useCallback(() => {
    setFlipped(false);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, total]);

  // ── Empty state ──
  if (total === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
        <p className="text-base font-semibold text-foreground">
          {t.vocabReviewEmpty}
        </p>
        <p className="mt-1 text-sm text-muted">{t.vocabReviewEmptyDesc}</p>
        <Button onPress={onExit} variant="secondary" className="mt-4">
          {t.back}
        </Button>
      </div>
    );
  }

  // ── Finished summary ──
  if (finished) {
    const knownCount = known.size;
    const unknownCount = unknown.size;
    const accuracy = Math.round((knownCount / total) * 100);

    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/20 px-6 py-8 text-center">
          <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
            🎉
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">
            {t.vocabReviewDone}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t.vocabReviewDoneDesc.replace("{n}", String(total))}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-emerald-200 dark:border-emerald-800/50">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {knownCount}
              </p>
              <p className="text-[11px] text-muted">{t.vocabReviewKnown}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-red-200 dark:border-red-800/50">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                {unknownCount}
              </p>
              <p className="text-[11px] text-muted">{t.vocabReviewUnknown}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-indigo-200 dark:border-indigo-800/50">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {accuracy}%
              </p>
              <p className="text-[11px] text-muted">{t.vocabReviewAccuracy}</p>
            </div>
          </div>
        </div>

        {/* Show unknown ones for review */}
        {unknown.size > 0 && (
          <div className="rounded-2xl border border-border bg-surface px-5 py-4">
            <p className="text-sm font-semibold text-foreground mb-3">
              📝 {t.vocabReviewNeedsPractice} ({unknown.size})
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {vocabulary
                .filter((v) => unknown.has(v.entry.progressKey))
                .map((v) => (
                  <div
                    key={v.entry.progressKey}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2"
                  >
                    <span className="font-jp text-lg font-semibold text-foreground">
                      {v.entry.kanji && v.entry.kanji !== "-"
                        ? v.entry.kanji
                        : v.entry.hiragana}
                    </span>
                    <span className="font-jp text-xs text-amber-700 dark:text-amber-400">
                      {v.entry.hiragana}
                    </span>
                    <span className="text-[11px] text-muted line-clamp-1">
                      {v.entry.meaning}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            onPress={() => {
              setIndex(0);
              setFlipped(false);
              setKnown(new Set());
              setUnknown(new Set());
              setFinished(false);
            }}
          >
            🔄 {t.vocabReviewAgain}
          </Button>
          <Button variant="primary" onPress={onExit}>
            ✅ {t.vocabReviewDone}
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted truncate">{storyTitle}</p>
          <p className="text-sm font-semibold text-foreground">
            🃏 {t.vocabReviewTitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onExit}
            className="rounded-md p-1 text-muted hover:bg-surface-muted hover:text-foreground"
            aria-label="Exit review"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Card flip */}
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="relative h-56 w-full [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-2xl"
        aria-label={flipped ? t.vocabReviewTapToFront : t.vocabReviewTapToBack}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-6 [backface-visibility:hidden]">
            <span className="font-jp text-5xl font-bold text-foreground">
              {current.entry.kanji && current.entry.kanji !== "-"
                ? current.entry.kanji
                : current.entry.hiragana}
            </span>
            <p className="mt-4 text-xs text-amber-700 dark:text-amber-400">
              👆 {t.vocabReviewTapToFlip}
            </p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <span className="font-jp text-2xl font-bold text-foreground">
              {current.entry.kanji && current.entry.kanji !== "-"
                ? current.entry.kanji
                : current.entry.hiragana}
            </span>
            <span className="mt-1 font-jp text-base font-semibold text-indigo-600 dark:text-indigo-400">
              {current.entry.hiragana}
            </span>
            <p className="mt-3 text-sm text-foreground text-center max-w-xs leading-relaxed">
              {current.entry.meaning}
            </p>
            <p className="mt-3 text-[10px] text-muted">
              {current.matchedChapter > 0
                ? `Bab ${current.matchedChapter}`
                : "Admin"}
            </p>
          </div>
        </div>
      </button>

      {/* Action buttons */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleUnknown}
            className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
          >
            <span>😵</span>
            <span>{t.vocabReviewBtnUnknown}</span>
          </button>
          <button
            type="button"
            onClick={handleKnown}
            className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center gap-2"
          >
            <span>✅</span>
            <span>{t.vocabReviewBtnKnown}</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            {t.vocabReviewSkip} →
          </button>
        </div>
      )}
    </div>
  );
}