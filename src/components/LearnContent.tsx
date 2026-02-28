"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { kanaMap } from "@/src/lib/kana-map";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { LanguageToggle } from "@/src/components/LanguageToggle";
import { useLanguage } from "@/src/components/LanguageProvider";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type ProgressRecord = {
  character: string;
  clickCount: number;
  wrongCount: number;
  info: (typeof kanaMap)[string] | null;
};

interface LearnContentProps {
  enriched: ProgressRecord[];
  totalClicks: number;
  totalWrong: number;
  totalDebt: number;
  hasWrong: boolean;
}

// ─────────────────────────────────────────
// KanaProgressCard
// ─────────────────────────────────────────

function KanaProgressCard({ record }: { record: ProgressRecord }) {
  const { character, clickCount, wrongCount, info } = record;
  const isWrong = wrongCount > 0;

  return (
    <div
      className={[
        "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center shadow-sm",
        isWrong
          ? "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/20"
          : "border-border bg-surface",
      ].join(" ")}
    >
      {info && (
        <span
          className={[
            "text-[11px] font-bold leading-none",
            isWrong
              ? "text-red-500 dark:text-red-400"
              : "text-indigo-500 dark:text-indigo-400",
          ].join(" ")}
        >
          {info.romaji}
        </span>
      )}
      <span className="font-jp text-3xl leading-none text-foreground">
        {character}
      </span>
      <div className="flex flex-col items-center gap-0.5">
        {wrongCount > 0 && (
          <span className="text-[10px] font-semibold text-red-500 dark:text-red-400 tabular-nums">
            ✗ {wrongCount}
          </span>
        )}
        <span className="text-[10px] text-muted tabular-nums">
          👁 {clickCount}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function LearnContent({
  enriched,
  totalClicks,
  totalWrong,
  totalDebt,
  hasWrong,
}: LearnContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="border-b border-border bg-surface/80 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {t.learnTitle}
              </h1>
              <p className="text-xs text-muted">{t.learnSubtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-4 py-8">
          {/* Empty state */}
          {enriched.length === 0 && (
            <div className="flex flex-col items-center gap-5 py-28 text-center">
              <span className="font-jp select-none text-7xl opacity-20">
                あ
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-foreground">
                  {t.noProgressTitle}
                </p>
                <p className="text-sm text-muted">{t.noProgressDesc}</p>
              </div>
              <Link href="/" className={buttonVariants({ variant: "primary" })}>
                {t.goToStories}
              </Link>
            </div>
          )}

          {enriched.length > 0 && (
            <>
              {/* Summary */}
              <div className="mb-7 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center shadow-sm">
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {totalClicks}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {t.totalClicks}
                  </p>
                </div>

                <div
                  className={[
                    "rounded-xl border px-3 py-3 text-center shadow-sm",
                    totalWrong > 0
                      ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                      : "border-border bg-surface",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-2xl font-bold tabular-nums",
                      totalWrong > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {totalWrong}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {t.totalWrong}
                  </p>
                </div>

                <div
                  className={[
                    "rounded-xl border px-3 py-3 text-center shadow-sm",
                    totalDebt > 0
                      ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
                      : "border-border bg-surface",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-2xl font-bold tabular-nums",
                      totalDebt > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {totalDebt}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {t.clicksPlusWrong}
                  </p>
                </div>
              </div>

              {/* Needs review section */}
              {hasWrong && (
                <section className="mb-8">
                  <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    {t.needsReview}
                    <span className="text-xs font-normal text-muted">
                      ({enriched.filter((r) => r.wrongCount > 0).length}{" "}
                      {t.characters})
                    </span>
                  </h2>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {enriched
                      .filter((r) => r.wrongCount > 0)
                      .map((r) => (
                        <KanaProgressCard key={r.character} record={r} />
                      ))}
                  </div>
                </section>
              )}

              {/* All looked up */}
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                  {t.allLookedUp}
                  <span className="text-xs font-normal text-muted">
                    ({enriched.length} {t.characters})
                  </span>
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {enriched.map((r) => (
                    <KanaProgressCard key={r.character} record={r} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
