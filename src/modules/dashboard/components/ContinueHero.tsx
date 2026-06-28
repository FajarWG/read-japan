"use client";

import Link from "next/link";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { DashboardSummary } from "@/src/modules/dashboard/lib/dashboard";

interface ContinueHeroProps {
  summary: DashboardSummary;
  /** ID dari section progress (untuk anchor link "View progress"). */
  progressAnchor?: string;
}

/**
 * Hero component di atas dashboard:
 * - Greeting + 🔥 streak chip + ⚡ today chip
 * - Grid of learning features not present in the bottom navbar
 * - Quick action chips: Anki due, bookmarks count, anchor ke progress
 */
export function ContinueHero({
  summary,
  progressAnchor = "progress-section",
}: ContinueHeroProps) {
  const { t, lang } = useLanguage();

  const ankiDue = summary.ankiDueCount;
  const streak = summary.streakDays;
  const today = summary.todayActivityCount;

  const greetingText =
    today > 0
      ? t.dashboardWelcomeBack.replace("{name}", summary.user.username)
      : t.dashboardGreeting;

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Header: Greeting & Status Chips */}
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

      {/* Grid of features not in bottom navbar */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
          ✨ {lang === "en" ? "More Features" : "Fitur Lainnya"}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* AI Chat */}
          <Link
            href="/chat"
            className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-indigo-400/50 hover:bg-indigo-50/5 dark:hover:bg-indigo-950/10 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform w-fit select-none">💬</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {lang === "en" ? "AI Chat Tutor" : "Tutor AI Chat"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                {lang === "en" ? "Practice conversation with Gemini AI." : "Latihan percakapan dengan AI Gemini."}
              </p>
            </div>
          </Link>

          {/* JLPT Mock Test */}
          <Link
            href="/jlpt"
            className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-amber-400/50 hover:bg-amber-50/5 dark:hover:bg-amber-950/10 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform w-fit select-none">🎯</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {lang === "en" ? "JLPT Mock Test" : "JLPT Mock Test"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                {lang === "en" ? "Practice mock exams for N5/N4/N3." : "Latihan ujian mock untuk N5/N4/N3."}
              </p>
            </div>
          </Link>

          {/* Katsuyou */}
          <Link
            href="/katsuyou"
            className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-emerald-400/50 hover:bg-emerald-50/5 dark:hover:bg-emerald-950/10 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform w-fit select-none">🔄</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Katsuyou (活用)
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                {lang === "en" ? "Verb conjugation practice & SRS." : "Latihan konjugasi kata kerja & SRS."}
              </p>
            </div>
          </Link>

          {/* Kanji Study */}
          <Link
            href="/kanji"
            className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-violet-400/50 hover:bg-violet-50/5 dark:hover:bg-violet-950/10 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform w-fit select-none">🈶</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {lang === "en" ? "Kanji List" : "Daftar Kanji"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                {lang === "en" ? "Search and study Japanese Kanji." : "Cari dan pelajari Kanji Jepang."}
              </p>
            </div>
          </Link>

          {/* Bookmarks */}
          <Link
            href="/bookmarks"
            className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-rose-400/50 hover:bg-rose-50/5 dark:hover:bg-rose-950/10 hover:shadow-md cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform w-fit select-none">🔖</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {lang === "en" ? "Bookmarks" : "Bookmark"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                {lang === "en" ? "Saved words and sentences." : "Kata dan kalimat yang disimpan."}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {ankiDue > 0 && (
          <Link
            href="/anki"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
          >
            🃏 {t.dashboardAnkiDue.replace("{n}", String(ankiDue))}
          </Link>
        )}
        {summary.bookmarksCount > 0 && (
          <Link
            href="/bookmarks"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            🔖 {t.dashboardBookmarks.replace("{n}", String(summary.bookmarksCount))}
          </Link>
        )}
        <a
          href={`#${progressAnchor}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer"
        >
          📊 {t.dashboardViewProgress}
        </a>
      </div>

      {today === 0 && streak === 0 && (
        <p className="text-xs text-muted italic">{t.dashboardNoActivity}</p>
      )}
    </div>
  );
}
