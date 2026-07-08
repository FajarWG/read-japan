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
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ProgressStats } from "@/src/modules/dashboard/lib/dashboard";

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
  primary: number;
  primaryLabel: string;
  secondary?: number;
  secondaryLabel?: string;
  highlightSecondary?: boolean;
  href: string;
  cta?: string;
}) {
  const showCta = cta && highlightSecondary && (secondary ?? 0) > 0;
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
                highlightSecondary && (secondary ?? 0) > 0
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
      </div>
    </div>
  );
}
