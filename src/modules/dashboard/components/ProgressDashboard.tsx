"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { ProgressStats, ChapterProgressItem } from "@/src/modules/dashboard/lib/dashboard";

// ─────────────────────────────────────────────────────────
// Activity bar chart — 7 hari terakhir (SVG, no external lib)
// ─────────────────────────────────────────────────────────

function ActivityChart({
  data,
}: {
  data: Array<{ date: string; count: number }>;
}) {
  const { t } = useLanguage();
  const max = Math.max(1, ...data.map((d) => d.count));
  const W = 320;
  const H = 120;
  const barW = W / data.length;
  const barInner = barW * 0.7;

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-foreground">
          📅 {t.progressLast7Days}
        </p>
        <p className="text-xs text-muted">
          {data.reduce((s, d) => s + d.count, 0)} {t.progressActivitiesUnit}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const h = Math.max(2, (d.count / max) * (H - 20));
          const x = i * barW + (barW - barInner) / 2;
          const y = H - h;
          const dayLabel = d.date.slice(8, 10); // dd
          const isToday = i === data.length - 1;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barInner}
                height={h}
                rx={3}
                className={
                  isToday
                    ? "fill-accent"
                    : d.count > 0
                      ? "fill-accent/40"
                      : "fill-border"
                }
              />
              {d.count > 0 && (
                <text
                  x={x + barInner / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-bold"
                >
                  {d.count}
                </text>
              )}
              <text
                x={x + barInner / 2}
                y={H - 2}
                textAnchor="middle"
                className="fill-muted text-[8px]"
              >
                {dayLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Streak card
// ─────────────────────────────────────────────────────────

function StreakCard({ days }: { days: number }) {
  const { t } = useLanguage();
  const motivation = days > 0 ? t.progressStreakMotivation : t.progressStreakBroken;

  return (
    <div className="rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 dark:border-orange-800/40 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-5 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{days > 0 ? "🔥" : "💤"}</span>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
            {t.progressStreakCard}
          </p>
          <p className="text-3xl font-bold tabular-nums text-orange-900 dark:text-orange-100">
            {days} <span className="text-base font-medium text-orange-700 dark:text-orange-300">{t.progressStreakDays}</span>
          </p>
          <p className="text-xs text-orange-700/80 dark:text-orange-300/80 mt-1">
            {motivation}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: number | string;
  sub?: string;
  accent?: "red" | "amber" | "emerald" | "indigo" | "default";
}) {
  const accentClass =
    accent === "red"
      ? "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20 text-red-700 dark:text-red-300"
      : accent === "amber"
        ? "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300"
        : accent === "emerald"
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
          : accent === "indigo"
            ? "border-indigo-200 bg-indigo-50 dark:border-indigo-800/40 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300"
            : "border-border bg-surface text-foreground";
  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${accentClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
        <span>{icon}</span>
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
    </div>
  );
}



// ─────────────────────────────────────────────────────────
// Chapter progress details
// ─────────────────────────────────────────────────────────

function ChapterProgressCard({ item }: { item: ChapterProgressItem }) {
  const prepDone = item.prepOpenedPoints === item.totalPrepPoints;
  const prepProgressText = `${item.prepOpenedPoints}/${item.totalPrepPoints}`;

  const storiesDone = item.totalStoriesCount > 0 && item.storiesReadCount === item.totalStoriesCount;
  const storiesProgressText = item.totalStoriesCount > 0 
    ? `${item.storiesReadCount}/${item.totalStoriesCount}`
    : "—";

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 shadow-xs flex flex-col justify-between gap-2 transition-all hover:border-accent/40">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="rounded-md bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 text-[9px] font-bold tabular-nums whitespace-nowrap">
            Bab {item.chapter}
          </span>
          <span className="font-jp text-xs font-semibold text-foreground truncate block" title={item.title}>
            {item.title}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
        {/* Prep */}
        <div className="flex flex-col items-center justify-center py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-slate-900/50">
          <span className="text-[8px] text-muted block mb-0.5 font-bold uppercase tracking-wider">Prep</span>
          <span className={[
            "font-semibold tabular-nums",
            prepDone ? "text-emerald-500" : item.prepOpenedPoints > 0 ? "text-indigo-500" : "text-muted"
          ].join(" ")}>
            {prepDone ? "✅" : prepProgressText}
          </span>
        </div>

        {/* Stories */}
        <div className="flex flex-col items-center justify-center py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-slate-900/50">
          <span className="text-[8px] text-muted block mb-0.5 font-bold uppercase tracking-wider">Cerita</span>
          <span className={[
            "font-semibold tabular-nums",
            storiesDone ? "text-emerald-500" : item.storiesReadCount > 0 ? "text-indigo-500" : "text-muted"
          ].join(" ")}>
            {storiesDone ? "✅" : storiesProgressText}
          </span>
        </div>

        {/* Anki */}
        <div className="flex flex-col items-center justify-center py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-slate-900/50">
          <span className="text-[8px] text-muted block mb-0.5 font-bold uppercase tracking-wider">Anki</span>
          <span className={[
            "font-semibold tabular-nums",
            item.ankiCardsCount > 0 ? "text-indigo-500 font-bold" : "text-muted"
          ].join(" ")}>
            🃏 {item.ankiCardsCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChapterProgressSection({ data }: { data: ChapterProgressItem[] }) {
  const { lang } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  // Filter out chapters with absolutely no progress to show first
  const activeChapters = data.filter(
    (item) => item.prepOpenedPoints > 0 || item.storiesReadCount > 0 || item.ankiCardsCount > 0
  );

  const chaptersToRender = showAll ? data : activeChapters.length > 0 ? activeChapters : data.slice(0, 3);

  const titleText = lang === "en" ? "Chapter Study Status" : "Progres Belajar per Bab";
  const descText = lang === "en" 
    ? "Track which chapters you have studied (Prep sheet opened, Stories read, Anki cards)."
    : "Lacak bab mana saja yang sudah Anda pelajari (Membuka Prep, Membaca Cerita, Kartu Anki).";

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          📚 {titleText}
        </p>
        <p className="text-[10px] text-muted mt-0.5">{descText}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {chaptersToRender.map((item) => (
          <ChapterProgressCard key={item.chapter} item={item} />
        ))}
      </div>

      {data.length > activeChapters.length && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-center text-xs font-semibold text-accent hover:underline cursor-pointer"
        >
          {showAll 
            ? (lang === "en" ? "Show Less" : "Sembunyikan bab belum dipelajari") 
            : (lang === "en" ? `Show All 15 Chapters` : `Tampilkan semua 15 Bab (termasuk yang belum dipelajari)`)}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

export function ProgressDashboard({ stats }: { stats: ProgressStats }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-5">
      {/* Streak + activity chart */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StreakCard days={stats.streakDays} />
        <ActivityChart data={stats.byDay} />
      </div>

      {/* Kana stats */}
      <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-foreground">
          ✍️ {t.progressKanaStats}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon="👁"
            label={t.progressKanaCorrect}
            value={stats.totalKanaClicks}
            accent="emerald"
          />
          <StatCard
            icon="✗"
            label={t.progressKanaWrong}
            value={stats.totalKanaWrong}
            accent={stats.totalKanaWrong > 0 ? "red" : "default"}
          />
          <StatCard
            icon="📊"
            label={t.totalWrong}
            value={`${stats.totalKanaClicks + stats.totalKanaWrong}`}
          />
        </div>
      </section>

      {/* Vocab + Anki stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">
            📖 {t.progressVocabTitle}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground tabular-nums">
              {stats.uniqueWordsLookedUp}
            </span>
            <span className="text-sm text-muted">{t.progressUniqueWords}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">
            🃏 {t.progressAnkiTitle}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {stats.ankiReviewed}
              </p>
              <p className="text-[11px] text-muted">{t.progressAnkiReviewed}</p>
            </div>
            <div>
              <p
                className={[
                  "text-2xl font-bold tabular-nums",
                  stats.ankiDueNow > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-foreground",
                ].join(" ")}
              >
                {stats.ankiDueNow}
              </p>
              <p className="text-[11px] text-muted">{t.progressAnkiDue}</p>
            </div>
          </div>
          {stats.ankiDueNow > 0 && (
            <Link
              href="/anki"
              className={buttonVariants({
                variant: "primary",
                size: "sm",
                className: "w-full mt-3 font-semibold cursor-pointer",
              })}
            >
              🃏 Mulai Review
            </Link>
          )}
        </section>
      </div>

      {/* Chapter Study Status */}
      {stats.chaptersProgress && <ChapterProgressSection data={stats.chaptersProgress} />}

      {/* Stories */}
      <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-foreground">
          📚 {t.progressStoriesTitle}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground tabular-nums">
            {stats.storiesRead}
          </span>
          <span className="text-sm text-muted">{t.progressStoriesRead}</span>
        </div>
      </section>

      {/* Weak words */}
      {stats.weakWords.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-foreground">
            ⚠️ {t.progressWeakWords}
          </p>
          <p className="mb-3 text-xs text-muted">{t.progressWeakWordsDesc}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {stats.weakWords.map((w) => (
              <div
                key={w.character}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20 px-2 py-2.5 text-center shadow-sm"
              >
                <span className="font-jp text-2xl font-semibold text-foreground leading-none">
                  {w.character}
                </span>
                {w.info && (
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                    {w.info.romaji}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 tabular-nums">
                  ✗ {w.wrongCount}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}


    </div>
  );
}
