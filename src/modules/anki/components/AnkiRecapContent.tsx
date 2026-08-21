"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Clock,
  Layers,
  Repeat,
  Target,
  AlertTriangle,
  CheckCircle2,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import { Card } from "@heroui/react";
import {
  ExploreDrawer,
  ExploreTarget,
} from "@/src/modules/explore/components/ExploreDrawer";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { HeaderStudyTimer } from "@/src/modules/study-timer/components/HeaderStudyTimer";
import {
  AnkiRecapItem,
  AnkiSessionRecap,
  formatRecapDuration,
  loadSessionRecap,
  ratingLabel,
  recapItemFinalRating,
  recapItemQuery,
  summarizeRecap,
} from "@/src/modules/anki/lib/sessionRecap";

const RATING_TONE: Record<number, string> = {
  1: "bg-rose-500/10 text-rose-500",
  2: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  3: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  4: "bg-sky-500/10 text-sky-600 dark:text-sky-500",
};

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function StatTile({ icon, label, value, hint }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-surface p-3">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted">
        {icon}
        {label}
      </span>
      <span className="text-xl font-black leading-none text-foreground">
        {value}
      </span>
      {hint && <span className="text-[10px] text-muted">{hint}</span>}
    </div>
  );
}

interface RecapRowProps {
  item: AnkiRecapItem;
  mode: "srs" | "quick";
  onExplore: (word: string) => void;
}

function RecapRow({ item, mode, onExplore }: RecapRowProps) {
  const finalRating = recapItemFinalRating(item);
  const attempts = item.ratings.length;

  return (
    <button
      type="button"
      onClick={() => onExplore(recapItemQuery(item))}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface px-4 py-3 text-left transition-colors hover:border-indigo-500/50 hover:bg-surface-muted cursor-pointer"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-jp text-lg font-bold leading-tight text-foreground">
          {item.kanji !== "-" ? item.kanji : item.hiragana}
        </span>
        {item.kanji !== "-" && (
          <span className="font-jp text-xs text-muted">{item.hiragana}</span>
        )}
        <span className="truncate text-xs text-muted">{item.translation}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-col items-end gap-1">
          {finalRating !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                RATING_TONE[finalRating] || "bg-slate-500/10 text-muted"
              }`}
            >
              {ratingLabel(finalRating, mode)}
            </span>
          )}
          {attempts > 1 && (
            <span className="text-[10px] font-semibold text-muted">
              {attempts}× seen
            </span>
          )}
        </div>
        <ChevronRight
          size={16}
          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
        />
      </div>
    </button>
  );
}

export function AnkiRecapContent() {
  const [recap, setRecap] = useState<AnkiSessionRecap | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [exploreTarget, setExploreTarget] = useState<ExploreTarget | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [showAllSolid, setShowAllSolid] = useState(false);

  useEffect(() => {
    setRecap(loadSessionRecap());
    setHydrated(true);
  }, []);

  const summary = useMemo(
    () => (recap ? summarizeRecap(recap) : null),
    [recap],
  );

  const openExplore = (word: string) => {
    setExploreTarget({ type: "vocab", query: word });
    setIsExploreOpen(true);
  };

  const solidVisible =
    summary && !showAllSolid ? summary.solid.slice(0, 6) : summary?.solid || [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pt-6 pb-16">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="rounded-t-2xl border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 truncate font-jp text-base font-bold leading-tight text-foreground sm:text-lg">
                <span>日本語フロー</span>
                <span className="whitespace-nowrap rounded-full bg-indigo-500/10 px-2 py-0.5 font-sans text-[10px] font-semibold text-indigo-500 sm:text-xs">
                  Session Recap
                </span>
              </h1>
              <p className="truncate text-[10px] text-muted sm:text-xs">
                Review what you just studied, then explore each word in depth.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/anki"
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Back to Anki</span>
              </Link>
              <HeaderStudyTimer />
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="mt-6 flex flex-col gap-6">
          {!hydrated ? (
            <Card className="flex flex-col gap-4 border border-border bg-surface p-6 shadow-sm">
              <div className="h-5 w-48 animate-pulse rounded-md bg-border/40" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl bg-border/30"
                  />
                ))}
              </div>
            </Card>
          ) : !recap || !summary || summary.cardCount === 0 ? (
            <Card className="flex flex-col items-center gap-4 border border-border bg-surface p-8 text-center shadow-sm">
              <Compass size={40} className="text-muted" />
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-foreground">
                  No recent session
                </h2>
                <p className="text-xs text-muted">
                  Finish an Anki session and its recap will show up here.
                </p>
              </div>
              <Link
                href="/anki"
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Start studying
              </Link>
            </Card>
          ) : (
            <>
              {/* Ringkasan sesi */}
              <Card className="flex flex-col gap-5 border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <PartyPopper size={22} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold leading-tight text-foreground">
                      Session complete
                    </h2>
                    <p className="truncate text-xs text-muted">
                      {recap.deckLabel} ·{" "}
                      {recap.mode === "quick"
                        ? "Quick memorization"
                        : "SRS review"}
                      {recap.direction === "reverse" ? " · Reversed" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatTile
                    icon={<Layers size={11} />}
                    label="Cards"
                    value={String(summary.cardCount)}
                    hint="distinct words"
                  />
                  <StatTile
                    icon={<Repeat size={11} />}
                    label="Reviews"
                    value={String(summary.totalReviews)}
                    hint="incl. repeats"
                  />
                  <StatTile
                    icon={<Target size={11} />}
                    label="First try"
                    value={`${summary.firstTryAccuracy}%`}
                    hint="correct at first sight"
                  />
                  <StatTile
                    icon={<Clock size={11} />}
                    label="Duration"
                    value={formatRecapDuration(summary.durationSeconds)}
                  />
                </div>
              </Card>

              {/* Kartu yang masih lemah */}
              {summary.struggled.length > 0 && (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-500">
                      <AlertTriangle size={13} />
                      Needs work ({summary.struggled.length})
                    </h3>
                    <span className="text-[10px] text-muted">
                      Tap a word to explore it
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {summary.struggled.map((item) => (
                      <RecapRow
                        key={item.cardKey}
                        item={item}
                        mode={recap.mode}
                        onExplore={openExplore}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Kartu yang sudah aman */}
              {summary.solid.length > 0 && (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-500">
                      <CheckCircle2 size={13} />
                      Got it first try ({summary.solid.length})
                    </h3>
                    {summary.solid.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setShowAllSolid((prev) => !prev)}
                        className="text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer"
                      >
                        {showAllSolid
                          ? "Show less"
                          : `Show all (${summary.solid.length})`}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {solidVisible.map((item) => (
                      <RecapRow
                        key={item.cardKey}
                        item={item}
                        mode={recap.mode}
                        onExplore={openExplore}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/anki"
                  className="flex flex-1 items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
                >
                  Study again
                </Link>
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                >
                  Back to home
                </Link>
              </div>
            </>
          )}
        </main>
      </div>

      <ExploreDrawer
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        initialTarget={exploreTarget}
      />
    </div>
  );
}
