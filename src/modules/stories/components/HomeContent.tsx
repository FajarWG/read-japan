"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { ThemeToggle } from "@/src/modules/theme/components/ThemeToggle";
import { LanguageToggle } from "@/src/modules/language/components/LanguageToggle";
import { StoryPickerModal } from "@/src/modules/stories/components/StoryPickerModal";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface StoryRow {
  id: number;
  title: string;
  content: string;
  focus: string | null;
  totalReads: number;
  createdAt: Date;
}

interface HomeContentProps {
  stories: StoryRow[];
  totalClicks: number;
  totalWrong: number;
  totalDebt: number;
}

// ─────────────────────────────────────────
// Helper
// ─────────────────────────────────────────

function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function HomeContent({
  stories,
  totalClicks,
  totalWrong,
  totalDebt,
}: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            {/* Brand */}
            <div>
              <h1 className="font-jp text-lg font-bold leading-tight text-foreground">
                読む日本語
                <span className="ml-2 font-sans text-sm font-normal text-muted">
                  Read Japan
                </span>
              </h1>
              <p className="text-xs text-muted">{t.brandDesc}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Link
                href="/stories/new"
                className={buttonVariants({
                  variant: "primary",
                  size: "sm",
                  className: "shrink-0",
                })}
              >
                {t.addStory}
              </Link>
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="px-4 py-8">
          {/* Stats row */}
          {totalClicks > 0 && (
            <div className="mb-7 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {totalClicks}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">{t.totalClicks}</p>
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
                <p className="mt-0.5 text-[11px] text-muted">{t.totalWrong}</p>
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
          )}

          {/* Start Reading CTA */}
          {stories.length > 0 && (
            <div className="mb-8">
              <Link
                href={`/read/${stories[0].id}`}
                className="group block"
                aria-label={`${t.continueReading}: ${stories[0].title}`}
              >
                <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-linear-to-br from-accent/10 via-accent/5 to-transparent px-6 py-6 shadow-sm transition-all duration-200 hover:border-accent/60 hover:shadow-md">
                  <span className="pointer-events-none absolute -right-4 -top-4 select-none text-8xl opacity-[0.06]">
                    本
                  </span>
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="min-w-0 flex flex-col gap-1">
                      <p className="text-xs font-medium text-accent uppercase tracking-wide">
                        {t.continueReading}
                      </p>
                      <h2 className="font-jp text-xl font-bold text-foreground leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                        {stories[0].title}
                      </h2>
                      <p className="font-jp text-sm text-muted line-clamp-1 mt-0.5">
                        {stories[0].content}
                      </p>
                      <p className="mt-2 text-[11px] text-muted">
                        📖 {stories[0].totalReads}
                        {t.timesRead} · ✍️ {countKana(stories[0].content)}{" "}
                        {t.navKana === "Kana" ? "kana" : "kana"}
                      </p>
                    </div>
                    <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Empty state */}
          {stories.length === 0 && (
            <div className="flex flex-col items-center gap-5 py-28 text-center">
              <span className="font-jp select-none text-7xl opacity-20">
                本
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-foreground">
                  {t.noStoriesTitle}
                </p>
                <p className="text-sm text-muted">{t.noStoriesDesc}</p>
              </div>
              <Link
                href="/stories/new"
                className={buttonVariants({ variant: "primary" })}
              >
                {t.addFirstStory}
              </Link>
            </div>
          )}

          {/* Pilih manual via modal */}
          {stories.length > 0 && (
            <div className="flex justify-center">
              <StoryPickerModal stories={stories} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
