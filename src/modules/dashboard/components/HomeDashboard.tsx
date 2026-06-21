"use client";

import Link from "next/link";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { ProgressDashboard } from "@/src/modules/dashboard/components/ProgressDashboard";
import { ContinueHero } from "@/src/modules/dashboard/components/ContinueHero";
import type {
  DashboardSummary,
  ProgressStats,
} from "@/src/modules/dashboard/lib/dashboard";

interface HomeDashboardProps {
  summary: DashboardSummary;
  progressStats: ProgressStats;
  recommendedStories: Array<{
    id: number;
    title: string;
    content: string;
    totalReads: number;
  }>;
}

/**
 * Halaman utama `/` (Phase 9 — move dari /progress).
 *
 * Section:
 * 1. Header (brand + SettingsDropdown)
 * 2. ContinueHero (greeting + streak + Continue CTA + quick action chips)
 * 3. Rekomendasi cerita (top 2) — quick links
 * 4. ProgressDashboard (full) — stats, chart, achievements, weak words, etc.
 */
export function HomeDashboard({
  summary,
  progressStats,
  recommendedStories,
}: HomeDashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground truncate">
                日本語フロー
                <span className="ml-2 font-sans text-xs sm:text-sm font-normal text-muted">
                  Nihongo Flow
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">
                {t.brandDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/stories"
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted transition-colors"
              >
                📚 {t.navStories}
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="px-4 py-6">
          {/* Continue Hero */}
          <ContinueHero
            summary={summary}
            stories={recommendedStories}
            progressAnchor="progress-section"
          />

          {/* Rekomendasi cerita — quick links */}
          {recommendedStories.length > 0 && (
            <section className="mb-6">
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-sm font-semibold text-foreground">
                  📖 {t.recommendedStories}
                </p>
                <Link
                  href="/stories"
                  className="text-xs text-muted hover:text-accent transition-colors"
                >
                  {t.recommendedStoriesDesc} →
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {recommendedStories.slice(0, 2).map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/read/${story.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm transition-all duration-150 hover:border-accent/50 hover:bg-surface-muted hover:shadow-md"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="font-jp text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                        {story.title}
                      </p>
                      <p className="font-jp text-xs text-muted line-clamp-1">
                        {story.content}
                      </p>
                      <span className="text-[10px] text-muted mt-0.5">
                        📖 {story.totalReads}{t.timesRead}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 shrink-0 text-muted group-hover:text-accent transition-colors"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Full Progress Dashboard */}
          <section id="progress-section" className="scroll-mt-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
              📊 {t.progressTitle}
            </h2>
            <ProgressDashboard stats={progressStats} />
          </section>
        </main>
      </div>
    </div>
  );
}
