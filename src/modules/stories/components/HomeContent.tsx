"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants, Chip, Tabs } from "@heroui/react";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { StoryPickerModal } from "@/src/modules/stories/components/StoryPickerModal";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { logoutAction } from "@/src/modules/auth/actions";
import { getGuestStats, getGuestProgress } from "@/src/shared/lib/guest-progress";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";

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

export type ProgressRecord = {
  character: string;
  clickCount: number;
  wrongCount: number;
  info: (typeof kanaMap)[string] | null;
};

interface HomeContentProps {
  recommendedStories: StoryRow[];
  stories: StoryRow[];
  totalClicks: number;
  totalWrong: number;
  totalDebt: number;
  isGuest: boolean;
  enriched?: ProgressRecord[];
  hasWrong?: boolean;
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

// ─────────────────────────────────────────
// Helper
// ─────────────────────────────────────────

function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

// ─────────────────────────────────────────
// GuestStatsRow — reads from localStorage on client
// ─────────────────────────────────────────

function GuestStatsRow() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalWrong: 0,
    totalDebt: 0,
  });

  useEffect(() => {
    setStats(getGuestStats());
  }, []);

  if (stats.totalClicks === 0 && stats.totalWrong === 0) return null;

  return (
    <div className="mb-7 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center shadow-sm">
        <p className="text-2xl font-bold tabular-nums text-foreground">
          {stats.totalClicks}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">{t.totalClicks}</p>
      </div>
      <div
        className={[
          "rounded-xl border px-3 py-3 text-center shadow-sm",
          stats.totalWrong > 0
            ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
            : "border-border bg-surface",
        ].join(" ")}
      >
        <p
          className={[
            "text-2xl font-bold tabular-nums",
            stats.totalWrong > 0
              ? "text-red-600 dark:text-red-400"
              : "text-foreground",
          ].join(" ")}
        >
          {stats.totalWrong}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">{t.totalWrong}</p>
      </div>
      <div
        className={[
          "rounded-xl border px-3 py-3 text-center shadow-sm",
          stats.totalDebt > 0
            ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
            : "border-border bg-surface",
        ].join(" ")}
      >
        <p
          className={[
            "text-2xl font-bold tabular-nums",
            stats.totalDebt > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-foreground",
          ].join(" ")}
        >
          {stats.totalDebt}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">{t.clicksPlusWrong}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function HomeContent({
  recommendedStories,
  stories,
  totalClicks,
  totalWrong,
  totalDebt,
  isGuest,
  enriched: enrichedProp,
  hasWrong: hasWrongProp,
}: HomeContentProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [enriched, setEnriched] = useState<ProgressRecord[]>(enrichedProp ?? []);
  const [hasWrong, setHasWrong] = useState(hasWrongProp ?? false);

  useEffect(() => {
    if (!isGuest) return;
    const map = getGuestProgress();
    const records: ProgressRecord[] = Object.entries(map)
      .filter(([, v]) => v.clickCount > 0 || v.wrongCount > 0)
      .map(([char, v]) => ({
        character: char,
        clickCount: v.clickCount,
        wrongCount: v.wrongCount,
        info: kanaMap[char] ?? null,
      }))
      .sort(
        (a, b) => b.wrongCount - a.wrongCount || b.clickCount - a.clickCount,
      );

    setEnriched(records);
    setHasWrong(records.some((r) => r.wrongCount > 0));
  }, [isGuest]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            {/* Brand */}
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground truncate">
                日本語フロー
                <span className="ml-2 font-sans text-xs sm:text-sm font-normal text-muted">
                  Nihongo Flow
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">{t.brandDesc}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="px-4 py-8">
          {/* Guest warning banner */}
          {isGuest && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 px-4 py-3 flex flex-col gap-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                ⚠️ {t.authGuestModeTitle}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {t.authGuestModeDesc}{" "}
                <Link href="/login" className="underline font-medium">
                  {t.authLoginRecommended}
                </Link>
              </p>
            </div>
          )}

          {/* Stats row — DB stats for logged-in */}
          {!isGuest && totalClicks > 0 && (
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

          {/* Stats row — localStorage for guest */}
          {isGuest && <GuestStatsRow />}

            {/* Tabs for Stories and Progress */}
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
                          href={`/read/${story.id}`}
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

                {/* Pilih manual via modal */}
                {stories.length > 0 && (
                  <div className="flex justify-center -mt-2">
                    <StoryPickerModal stories={stories} />
                  </div>
                )}

                {/* Admin → Add Story (moved to bottom) */}
                {user?.role === "ADMIN" && (
                  <div className="mt-6 flex justify-center">
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
                {/* Empty state progres */}
                {enriched.length === 0 && (
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
                )}

                {enriched.length > 0 && (
                  <div className="flex flex-col gap-8 animate-in fade-in duration-200">
                    {/* Needs review section */}
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
                  </div>
                )}
              </Tabs.Panel>
            </Tabs>
        </main>
      </div>
    </div>
  );
}
