"use client";

import Link from "next/link";
import { buttonVariants, Tabs } from "@heroui/react";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { StoryPickerModal } from "@/src/modules/stories/components/StoryPickerModal";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";
import {
  type KotobaLookupEntry,
  type DekiruChapter,
} from "@/src/modules/prep/lib/kotoba-lookup";
import type { DashboardSummary } from "@/src/modules/dashboard/lib/dashboard";

export interface StoryRow {
  id: number;
  title: string;
  content: string;
  focus: string | null;
  totalReads: number;
  createdAt: Date;
  chapter: number | null;
  point: number | null;
}

export type ProgressRecord = {
  character: string;
  clickCount: number;
  wrongCount: number;
  info: (typeof kanaMap)[string] | null;
};

export type KotobaProgressRecord = {
  character: string;
  clickCount: number;
  wrongCount: number;
  entry: KotobaLookupEntry;
};

interface HomeContentProps {
  summary: DashboardSummary;
  recommendedStories: StoryRow[];
  stories: StoryRow[];
  dekiruChapters: DekiruChapter[];
  totalClicks: number;
  totalWrong: number;
  totalDebt: number;
  kanaProgress?: ProgressRecord[];
  kotobaProgress?: KotobaProgressRecord[];
  hasWrong?: boolean;
}

function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

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
      <span className="font-jp text-3xl leading-none text-foreground font-semibold">
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

function KotobaProgressCard({ record }: { record: KotobaProgressRecord }) {
  if (!record.entry) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface px-3 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-jp text-2xl leading-none text-foreground font-semibold">
          {record.entry.display}
        </span>
        <span className="text-[10px] text-muted tabular-nums">👁 {record.clickCount}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-jp text-xs font-semibold text-indigo-500 dark:text-indigo-400">
          {record.entry.hiragana}
        </span>
        <span className="text-[11px] leading-relaxed text-muted">
          {record.entry.meaning}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DekiruStoriesSection — cerita dikelompokkan per bab
// ─────────────────────────────────────────────────────────

function DekiruStoriesSection({
  stories,
  chapters,
}: {
  stories: StoryRow[];
  chapters: DekiruChapter[];
}) {
  const { t } = useLanguage();

  const grouped = new Map<number, StoryRow[]>();
  for (const story of stories) {
    if (story.chapter == null) continue;
    const list = grouped.get(story.chapter) ?? [];
    list.push(story);
    grouped.set(story.chapter, list);
  }
  for (const [, list] of grouped) list.sort((a, b) => (a.point ?? 0) - (b.point ?? 0));

  if (chapters.length === 0) return null;
  if (grouped.size === 0) return null;

  return (
    <div className="mb-8 mt-2">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            📚 {t.dekiruStoriesTitle}
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {t.dekiruStoriesDesc}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {chapters.map((ch) => {
          const list = grouped.get(ch.chapter);
          if (!list || list.length === 0) return null;
          return (
            <section key={ch.chapter}>
              <header className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:text-orange-300 tabular-nums">
                  {ch.chapterLabel}
                </span>
                <span className="font-jp text-sm font-semibold text-foreground truncate">
                  {ch.title}
                </span>
              </header>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/read/${story.id}`}
                    className="group flex flex-col gap-1.5 rounded-xl border border-orange-200/70 dark:border-orange-800/40 bg-orange-50/40 dark:bg-orange-950/20 px-3 py-2.5 shadow-sm transition-all duration-150 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-jp text-sm font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                        {story.title}
                      </span>
                      {story.point != null && (
                        <span className="shrink-0 text-[10px] font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                          #{story.point}
                        </span>
                      )}
                    </div>
                    <p className="font-jp text-[11px] text-muted line-clamp-1">
                      {story.content}
                    </p>
                    {story.focus && (
                      <p className="text-[10px] font-jp text-orange-700/80 dark:text-orange-400/80 line-clamp-1">
                        🎯 {story.focus}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Hero — Continue Learning card
// ─────────────────────────────────────────────────────────

function ContinueHero({
  summary,
  stories,
}: {
  summary: DashboardSummary;
  stories: StoryRow[];
}) {
  const { t, lang } = useLanguage();

  const lastStory = summary.lastStory;
  const ankiDue = summary.ankiDueCount;
  const streak = summary.streakDays;
  const today = summary.todayActivityCount;

  // Tentukan primary CTA berdasarkan data
  const ctaStory = lastStory ?? stories[0];
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
      {/* Greeting + streak row */}
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

      {/* Primary CTA */}
      {ctaStory ? (
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

      {/* Quick action chips */}
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
        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          📊 {t.dashboardViewProgress}
        </Link>
      </div>

      {/* Empty activity nudge */}
      {today === 0 && streak === 0 && !lastStory && (
        <p className="text-xs text-muted italic">{t.dashboardNoActivity}</p>
      )}
      {/* silence unused warning */}
      {lang && null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────

export function HomeContent({
  summary,
  recommendedStories,
  stories,
  dekiruChapters,
  totalClicks,
  totalWrong,
  totalDebt,
  kanaProgress: enriched = [],
  kotobaProgress: kotobaEnriched = [],
  hasWrong = false,
}: HomeContentProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

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
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">{t.brandDesc}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="px-4 py-6">
          {/* Smart Continue CTA */}
          <ContinueHero summary={summary} stories={stories} />

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

          <Tabs className="w-full mt-4" variant="primary">
            <Tabs.ListContainer className="sticky top-0 z-30 bg-background py-2">
              <Tabs.List
                aria-label="Pilih jenis"
                className={[
                  "w-fit",
                  "*:h-8 *:px-8 *:text-sm *:font-medium",
                  "*:data-[selected=true]:text-accent-foreground",
                ].join(" ")}
              >
                <Tabs.Tab id="stories">
                  {t.navStories}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab id="progress">
                  {t.navProgress}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="stories" className="pt-2">
              <DekiruStoriesSection stories={stories} chapters={dekiruChapters} />

              {/* Recommended stories list */}
              {recommendedStories.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {t.recommendedStories}
                    </p>
                    <p className="text-xs text-muted">{t.recommendedStoriesDesc}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {recommendedStories.map((story) => (
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
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-muted">
                              📖 {story.totalReads}
                              {t.timesRead}
                            </span>
                            <span className="text-[10px] text-muted">
                              ✍️ {countKana(story.content)} kana
                            </span>
                            {story.focus && (
                              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent max-w-[12ch] sm:max-w-none truncate">
                                {story.focus}
                              </span>
                            )}
                          </div>
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
                </div>
              )}

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
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/stories/new"
                      className={buttonVariants({ variant: "primary" })}
                    >
                      {t.addFirstStory}
                    </Link>
                  )}
                </div>
              )}

              {stories.length > 0 && (
                <div className="flex justify-center -mt-2 mb-4">
                  <StoryPickerModal stories={stories} />
                </div>
              )}

              {user?.role === "ADMIN" && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/stories/admin"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "md",
                      className: "font-semibold shadow-sm cursor-pointer",
                    })}
                  >
                    🛠️ Admin Dashboard
                  </Link>
                  <Link
                    href="/stories/new"
                    className={buttonVariants({
                      variant: "primary",
                      size: "md",
                      className: "font-semibold shadow-sm cursor-pointer",
                    })}
                  >
                    {t.addStory}
                  </Link>
                </div>
              )}
            </Tabs.Panel>

            <Tabs.Panel id="progress" className="pt-2">
              {enriched.length === 0 && kotobaEnriched.length === 0 ? (
                <div className="flex flex-col items-center gap-5 py-20 text-center animate-in fade-in duration-200">
                  <span className="font-jp select-none text-7xl opacity-20">
                    あ
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-foreground">
                      {t.noProgressTitle}
                    </p>
                    <p className="text-sm text-muted">{t.noProgressDesc}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8 animate-in fade-in duration-200">
                  {hasWrong && (
                    <section>
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

                  {enriched.length > 0 && (
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
                  )}

                  {kotobaEnriched.length > 0 && (
                    <section>
                      <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                        {t.kanjiLookedUp}
                        <span className="text-xs font-normal text-muted">
                          ({kotobaEnriched.length} kata)
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {kotobaEnriched.map((r) => (
                          <KotobaProgressCard key={r.character} record={r} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </Tabs.Panel>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
