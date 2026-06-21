"use client";

import Link from "next/link";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { DashboardSummary } from "@/src/modules/dashboard/lib/dashboard";

export interface DashboardStoryRow {
  id: number;
  title: string;
  content: string;
  totalReads: number;
}

interface ContinueHeroProps {
  summary: DashboardSummary;
  stories: DashboardStoryRow[];
  /** ID dari section progress (untuk anchor link "View progress"). */
  progressAnchor?: string;
}

function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

/**
 * Hero card di atas dashboard:
 * - Greeting + 🔥 streak chip + ⚡ today chip
 * - Primary CTA: lanjut cerita terakhir / Anki / cerita pertama
 * - Quick action chips: Anki due, bookmarks count, anchor ke progress
 */
export function ContinueHero({
  summary,
  stories,
  progressAnchor = "progress-section",
}: ContinueHeroProps) {
  const { t, lang } = useLanguage();

  const lastStory = summary.lastStory;
  const ankiDue = summary.ankiDueCount;
  const streak = summary.streakDays;
  const today = summary.todayActivityCount;

  const ctaTarget = lastStory
    ? `/stories/read/${lastStory.id}`
    : ankiDue > 0
      ? "/anki"
      : stories.length > 0
        ? `/stories/read/${stories[0].id}`
        : "/stories";

  const greetingText =
    today > 0
      ? t.dashboardWelcomeBack.replace("{name}", summary.user.username)
      : t.dashboardGreeting;

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{greetingText}</p>
        <div className="flex items-center gap-2 text-xs">
          {streak > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/40 px-2.5 py-1 font-bold text-orange-700 dark:text-orange-300"
              title={t.progressStreakMotivation}
            >
              🔥 {t.dashboardStreakDays.replace("{n}", String(streak))}
            </span>
          )}
          {today > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-1 font-medium text-indigo-700 dark:text-indigo-300">
              ⚡ {t.dashboardTodayActivity.replace("{n}", String(today))}
            </span>
          )}
        </div>
      </div>

      {lastStory || stories.length > 0 || ankiDue > 0 ? (
        <Link
          href={ctaTarget}
          className="group block"
          aria-label={t.dashboardContinue}
        >
          <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-linear-to-br from-accent/15 via-accent/5 to-transparent px-6 py-6 shadow-sm transition-all duration-200 hover:border-accent/60 hover:shadow-md">
            <span className="pointer-events-none absolute -right-4 -top-4 select-none text-8xl opacity-[0.06]">
              {lastStory ? "本" : ankiDue > 0 ? "🃏" : "本"}
            </span>
            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0 flex flex-col gap-1">
                <p className="text-xs font-medium text-accent uppercase tracking-wide">
                  {lastStory
                    ? t.dashboardContinueStory
                    : ankiDue > 0
                      ? t.dashboardJumpAnki
                      : t.dashboardPickStory}
                </p>
                <h2 className="font-jp text-xl font-bold text-foreground leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                  {lastStory
                    ? lastStory.title
                    : ankiDue > 0
                      ? t.dashboardAnkiDue.replace("{n}", String(ankiDue))
                      : stories[0]?.title ?? ""}
                </h2>
                {lastStory && (
                  <p className="font-jp text-sm text-muted line-clamp-1 mt-0.5">
                    {lastStory.content}
                  </p>
                )}
                {lastStory && (
                  <p className="mt-2 text-[11px] text-muted">
                    📖 {lastStory.totalReads}
                    {t.timesRead} · ✍️ {countKana(lastStory.content)} kana
                  </p>
                )}
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
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {ankiDue > 0 && (
          <Link
            href="/anki"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
          >
            🃏 {t.dashboardAnkiDue.replace("{n}", String(ankiDue))}
          </Link>
        )}
        {summary.bookmarksCount > 0 && (
          <Link
            href="/bookmarks"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors"
          >
            🔖 {t.dashboardBookmarks.replace("{n}", String(summary.bookmarksCount))}
          </Link>
        )}
        <a
          href={`#${progressAnchor}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          📊 {t.dashboardViewProgress}
        </a>
      </div>

      {today === 0 && streak === 0 && !lastStory && (
        <p className="text-xs text-muted italic">{t.dashboardNoActivity}</p>
      )}
      {lang && null}
    </div>
  );
}
