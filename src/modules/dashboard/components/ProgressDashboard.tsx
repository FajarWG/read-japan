"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import {
  Flame,
  CalendarDays,
  Layers,
  RefreshCw,
  BookOpen,
  FileText,
  PencilLine,
  Clock3,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ProgressStats } from "@/src/modules/dashboard/lib/dashboard";
import { formatStudyTime } from "@/src/modules/study-timer/components/StudyTimerBar";

// ─────────────────────────────────────────────────────────
// 7-day activity chart (inline SVG, no external lib)
// ─────────────────────────────────────────────────────────

function ActivityChart({
  data,
}: {
  data: Array<{ date: string; count: number }>;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const W = 320;
  const H = 120;
  const barW = W / data.length;
  const barInner = barW * 0.7;
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarDays size={15} className="text-accent" /> Last 7 days
        </p>
        <p className="text-xs text-muted">{total} activities</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = Math.max(2, (d.count / max) * (H - 20));
          const x = i * barW + (barW - barInner) / 2;
          const y = H - h;
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
                  isToday ? "fill-accent" : d.count > 0 ? "fill-accent/40" : "fill-border"
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
                {d.date.slice(8, 10)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Actual study time — sourced from the persistent timer
// ─────────────────────────────────────────────────────────

function StudyTimeChart({ stats }: { stats: ProgressStats["kakou"] }) {
  const max = Math.max(1, ...stats.byDay.map((day) => day.seconds));

  return (
    <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock3 size={15} className="text-accent" /> Actual study time
          </p>
          <p className="mt-1 text-xs text-muted">Only active timer time is counted.</p>
        </div>
        <div className="flex gap-5 text-right">
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{formatStudyTime(stats.todaySeconds, false)}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted">today</p>
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{formatStudyTime(stats.weekSeconds, false)}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted">7 days</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid h-24 grid-cols-7 items-end gap-2">
        {stats.byDay.map((day, index) => {
          const height = Math.max(3, Math.round((day.seconds / max) * 68));
          const today = index === stats.byDay.length - 1;
          return (
            <div key={day.date} className="flex h-full flex-col items-center justify-end gap-1">
              <span className="text-[9px] font-semibold tabular-nums text-muted">
                {day.seconds > 0 ? formatStudyTime(day.seconds, false) : "0m"}
              </span>
              <span
                className={`w-full max-w-8 rounded-t-md ${today ? "bg-accent" : day.seconds > 0 ? "bg-accent/40" : "bg-border"}`}
                style={{ height }}
              />
              <span className="text-[9px] text-muted">{day.date.slice(8)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Streak card
// ─────────────────────────────────────────────────────────

function StreakCard({ days }: { days: number }) {
  const active = days > 0;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-5 shadow-sm">
      <span
        className={[
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
          active ? "bg-accent/12 text-accent" : "bg-surface-muted text-muted",
        ].join(" ")}
      >
        {active ? <Flame size={26} /> : <Moon size={26} />}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Current streak
        </p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {days} <span className="text-base font-medium text-muted">days</span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {active ? "Keep it going — study something today." : "Study today to start a streak."}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Metric card
// ─────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  title,
  primary,
  primaryLabel,
  secondary,
  secondaryLabel,
  highlightSecondary,
  href,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  primary: number | string;
  primaryLabel: string;
  secondary?: number | string;
  secondaryLabel?: string;
  highlightSecondary?: boolean;
  href: string;
  cta?: string;
}) {
  const secondaryNumber = typeof secondary === "number" ? secondary : 0;
  const showCta = cta && highlightSecondary && secondaryNumber > 0;
  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon size={15} className="text-accent" /> {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-2xl font-bold tabular-nums text-foreground">{primary}</p>
          <p className="text-[11px] text-muted">{primaryLabel}</p>
        </div>
        {secondaryLabel != null && (
          <div>
            <p
              className={[
                "text-2xl font-bold tabular-nums",
                highlightSecondary && secondaryNumber > 0
                  ? "text-accent"
                  : "text-foreground",
              ].join(" ")}
            >
              {secondary}
            </p>
            <p className="text-[11px] text-muted">{secondaryLabel}</p>
          </div>
        )}
      </div>
      {showCta && (
        <Link
          href={href}
          className={buttonVariants({
            variant: "primary",
            size: "sm",
            className: "mt-3 w-full font-semibold cursor-pointer",
          })}
        >
          {cta}
        </Link>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

export function ProgressDashboard({ stats }: { stats: ProgressStats }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StreakCard days={stats.streakDays} />
        <ActivityChart data={stats.byDay} />
      </div>

      <StudyTimeChart stats={stats.kakou} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricCard
          icon={Layers}
          title="Anki"
          primary={stats.anki.total}
          primaryLabel="cards in SRS"
          secondary={stats.anki.dueNow}
          secondaryLabel="due now"
          highlightSecondary
          href="/anki"
          cta="Start review"
        />
        <MetricCard
          icon={RefreshCw}
          title="Katsuyou"
          primary={stats.katsuyou.lessonsCompleted}
          primaryLabel="lessons done"
          secondary={stats.katsuyou.dueNow}
          secondaryLabel="cards due"
          highlightSecondary
          href="/katsuyou"
          cta="Start review"
        />
        <MetricCard
          icon={BookOpen}
          title="Bunpou"
          primary={stats.bunpou.patternsCompleted}
          primaryLabel="patterns done"
          href="/bunpou"
        />
        <MetricCard
          icon={FileText}
          title="Prep"
          primary={stats.prep.chaptersOpened}
          primaryLabel="chapters opened"
          href="/prep"
        />
        <MetricCard
          icon={PencilLine}
          title="Kakou"
          primary={formatStudyTime(stats.kakou.todaySeconds, false)}
          primaryLabel="studied today"
          secondary={formatStudyTime(stats.kakou.weekSeconds, false)}
          secondaryLabel="this week"
          href="/kakou"
        />
      </div>
    </div>
  );
}
