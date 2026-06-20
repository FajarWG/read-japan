"use client";

import { useMemo } from "react";
import { Chip } from "@heroui/react";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import {
  matchKotobaInText,
  type MatchedKotoba,
} from "@/src/modules/prep/lib/kotoba-lookup";

interface KotobaDekiruSectionProps {
  content: string;
  chapter: number | null;
  chapterLabel?: string;
}

// ─────────────────────────────────────────
// KotobaDekiruSection — vocabulary dari Dekiru Nihongo yang muncul di cerita
// ─────────────────────────────────────────

export function KotobaDekiruSection({
  content,
  chapter,
  chapterLabel,
}: KotobaDekiruSectionProps) {
  const { t } = useLanguage();

  const matches: MatchedKotoba[] = useMemo(() => {
    if (chapter == null) return [];
    return matchKotobaInText(content, chapter);
  }, [content, chapter]);

  if (chapter == null) return null;
  if (matches.length === 0) return null;

  return (
    <section
      aria-label="Kotoba Dekiru Nihongo"
      className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/10 px-5 py-5"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            📚 {t.kotobaDekiruTitle}
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            {chapterLabel ?? `${t.chapter} ${chapter}`} ·{" "}
            {matches.length} {t.kotobaDekiruWords}
          </p>
        </div>
        <Chip
          variant="soft"
          size="sm"
          className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] font-semibold shrink-0"
        >
          {t.kotobaDekiruBadge}
        </Chip>
      </div>

      {/* Vocabulary list */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {matches.map((m) => (
          <KotobaDekiruItem key={m.entry.progressKey} match={m} />
        ))}
      </div>
    </section>
  );
}

function KotobaDekiruItem({ match }: { match: MatchedKotoba }) {
  const { entry, count } = match;
  const displayKanji =
    entry.kanji && entry.kanji !== "-" ? entry.kanji : entry.hiragana;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 dark:border-amber-800/40 bg-white dark:bg-amber-950/30 px-3 py-2.5 shadow-sm">
      {/* Kanji / hiragana form */}
      <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
        <span className="font-jp text-base font-semibold text-foreground leading-tight truncate max-w-full">
          {displayKanji}
        </span>
        {entry.kanji &&
          entry.kanji !== "-" &&
          entry.kanji !== entry.hiragana && (
            <span className="font-jp text-[11px] text-amber-700 dark:text-amber-400 leading-none">
              {entry.hiragana}
            </span>
          )}
        <span className="text-[11px] leading-snug text-muted line-clamp-2">
          {entry.meaning}
        </span>
      </div>

      {/* Count badge */}
      {count > 1 && (
        <span className="shrink-0 mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-semibold px-1.5 py-0.5 tabular-nums">
          ×{count}
        </span>
      )}
    </div>
  );
}