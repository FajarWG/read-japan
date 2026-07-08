"use client";

import Link from "next/link";
import {
  Flame,
  Zap,
  Layers,
  BookOpen,
  RefreshCw,
  NotebookPen,
  FileText,
  type LucideIcon,
} from "lucide-react";

import type { DashboardSummary } from "@/src/modules/dashboard/lib/dashboard";

interface ContinueHeroProps {
  summary: DashboardSummary;
}

const FEATURES: Array<{
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}> = [
  { href: "/anki", icon: Layers, title: "Anki", desc: "SRS flashcards for vocabulary." },
  { href: "/bunpou", icon: BookOpen, title: "Bunpou (文法)", desc: "Grammar & particles reference." },
  { href: "/katsuyou", icon: RefreshCw, title: "Katsuyou (活用)", desc: "Verb conjugation practice & SRS." },
  { href: "/kotoba", icon: NotebookPen, title: "Kotoba (言葉)", desc: "Your vocabulary notebook." },
  { href: "/prep", icon: FileText, title: "Prep", desc: "Pre-class study & cheat sheets." },
];

/**
 * Home hero: greeting + status chips (streak / today / Anki due) followed by a
 * launcher grid of the surviving features.
 */
export function ContinueHero({ summary }: ContinueHeroProps) {
  const { ankiDueCount: ankiDue, streakDays: streak, todayActivityCount: today } = summary;

  const greeting =
    today > 0
      ? `Welcome back, ${summary.user.username}`
      : `Hi, ${summary.user.username}`;

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Greeting + status chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{greeting}</h2>
        <div className="flex items-center gap-2 text-xs">
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2.5 py-1 font-bold text-accent">
              <Flame size={13} /> {streak} day{streak === 1 ? "" : "s"}
            </span>
          )}
          {today > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 font-medium text-muted">
              <Zap size={13} /> {today} today
            </span>
          )}
          {ankiDue > 0 && (
            <Link
              href="/anki"
              className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              <Layers size={13} /> {ankiDue} due
            </Link>
          )}
        </div>
      </div>

      {/* Feature launcher */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEATURES.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all duration-150 hover:border-accent/50 hover:shadow-md cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-105">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-sm">
                {title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted sm:text-[11px]">
                {desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
