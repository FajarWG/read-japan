"use client";

import { useMemo, useState } from "react";
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
// (Collapsed by default — user harus tap untuk expand)
// ─────────────────────────────────────────

export function KotobaDekiruSection({
  content,
  chapter,
  chapterLabel,
}: KotobaDekiruSectionProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const matches: MatchedKotoba[] = useMemo(() => {
    if (chapter == null) return [];
    return matchKotobaInText(content, chapter);
  }, [content, chapter]);

  if (chapter == null) return null;
  if (matches.length === 0) return null;

  return (
    <section
      aria-label="Kotoba Dekiru Nihongo"
      className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/10 px-5 py-4"
    >
      {/* Header — clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 rounded-md"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            📚 {t.kotobaDekiruTitle}
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            {chapterLabel ?? `${t.chapter} ${chapter}`} ·{" "}
            {matches.length} {t.kotobaDekiruWords}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Chip
            variant="soft"
            size="sm"
            className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] font-semibold"
          >
            {t.kotobaDekiruBadge}
          </Chip>
          {/* Chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 text-amber-700 dark:text-amber-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {matches.map((m) => (
            <KotobaDekiruItem key={m.entry.progressKey} match={m} />
          ))}
        </div>
      )}
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