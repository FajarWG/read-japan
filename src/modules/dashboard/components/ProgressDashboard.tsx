"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { ProgressStats } from "@/src/modules/dashboard/lib/dashboard";

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
// Achievements grid
// ─────────────────────────────────────────────────────────

function AchievementsGrid({
  unlocked,
  locked,
}: {
  unlocked: ProgressStats["achievements"]["unlocked"];
  locked: ProgressStats["achievements"]["locked"];
}) {
  const { t, lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-foreground">
          🏆 {t.progressAchievementsTitle}
        </p>
        <p className="text-xs text-muted">
          {unlocked.length} {t.progressAchievementsUnlocked} ·{" "}
          {locked.length} {t.progressAchievementsLocked}
        </p>
      </div>
      {unlocked.length === 0 && locked.length === 0 ? (
        <p className="text-sm text-muted italic py-4 text-center">
          {t.progressAchievementsNone}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {unlocked.map((a) => (
            <div
              key={`u-${a.id}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 px-3 py-3 text-center shadow-sm"
              title={isEn ? a.descEn : a.descId}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-xs font-bold text-foreground leading-tight">
                {isEn ? a.titleEn : a.titleId}
              </p>
            </div>
          ))}
          {locked.map((a) => (
            <div
              key={`l-${a.id}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-muted/50 px-3 py-3 text-center opacity-50"
              title={isEn ? a.descEn : a.descId}
            >
              <span className="text-2xl grayscale">{a.icon}</span>
              <p className="text-xs font-medium text-muted leading-tight">
                🔒 {isEn ? a.titleEn : a.titleId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Anki chapter breakdown
// ─────────────────────────────────────────────────────────

function AnkiByChapter({
  data,
}: {
  data: Array<{ chapter: number; count: number }>;
}) {
  const { t } = useLanguage();
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-foreground">
        📚 {t.progressAnkiChapterBreakdown}
      </p>
      <div className="flex flex-col gap-1.5">
        {data.map((d) => {
          const pct = Math.round((d.count / max) * 100);
          return (
            <div key={d.chapter} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-xs font-bold text-muted tabular-nums">
                Bab {d.chapter}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-accent/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-bold text-foreground tabular-nums">
                {d.count}
              </span>
            </div>
          );
        })}
      </div>
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

      {/* Anki by chapter */}
      <AnkiByChapter data={stats.byChapter} />

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

      {/* Achievements */}
      <AchievementsGrid
        unlocked={stats.achievements.unlocked}
        locked={stats.achievements.locked}
      />
    </div>
  );
}
