"use client";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { ProgressDashboard } from "@/src/modules/dashboard/components/ProgressDashboard";
import { ContinueHero } from "@/src/modules/dashboard/components/ContinueHero";
import { DailyTracker } from "@/src/modules/dashboard/components/DailyTracker";
import type {
  DashboardSummary,
  ProgressStats,
} from "@/src/modules/dashboard/lib/dashboard";

interface HomeDashboardProps {
  summary: DashboardSummary;
  progressStats: ProgressStats;
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
export function HomeDashboard({ summary, progressStats }: HomeDashboardProps) {
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
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="px-4 py-6">
          {/* Continue Hero */}
          <ContinueHero summary={summary} />

          {/* Daily study tracker */}
          <section className="mb-6">
            <DailyTracker />
          </section>

          {/* Full Progress Dashboard */}
          <section id="progress-section" className="scroll-mt-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
              Your progress
            </h2>
            <ProgressDashboard stats={progressStats} />
          </section>
        </main>
      </div>
    </div>
  );
}
