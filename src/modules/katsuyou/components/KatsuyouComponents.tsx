"use client";

import React from "react";
import { AlertCircle, BookOpen, HelpCircle } from "lucide-react";

// ─────────────────────────────────────────
// Component: JLPTBadge
// ─────────────────────────────────────────
interface JLPTBadgeProps {
  level: "N5" | "N4" | "N3" | "N2" | "N1";
}

export function JLPTBadge({ level }: JLPTBadgeProps) {
  const styles = {
    N5: "bg-teal-500/10 border-teal-500/25 text-teal-600 dark:text-teal-400",
    N4: "bg-sky-500/10 border-sky-500/25 text-sky-600 dark:text-sky-400",
    N3: "bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400",
    N2: "bg-pink-500/10 border-pink-500/25 text-pink-600 dark:text-pink-400",
    N1: "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400",
  }[level];

  return (
    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-wide select-none ${styles}`}>
      {level}
    </span>
  );
}

// ─────────────────────────────────────────
// Component: VerbGroupBadge
// ─────────────────────────────────────────
interface VerbGroupBadgeProps {
  group: 1 | 2 | 3;
  lang?: "en" | "id";
}

export function VerbGroupBadge({ group, lang = "en" }: VerbGroupBadgeProps) {
  const info = {
    1: {
      text: lang === "en" ? "Group 1 (Godan)" : "Golongan 1 (Godan)",
      style: "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400",
    },
    2: {
      text: lang === "en" ? "Group 2 (Ichidan)" : "Golongan 2 (Ichidan)",
      style: "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400",
    },
    3: {
      text: lang === "en" ? "Group 3 (Irregular)" : "Golongan 3 (Irregular)",
      style: "bg-purple-500/10 border-purple-500/25 text-purple-600 dark:text-purple-400",
    },
  }[group];

  return (
    <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold select-none ${info.style}`}>
      {info.text}
    </span>
  );
}

// ─────────────────────────────────────────
// Component: GrammarBadge
// ─────────────────────────────────────────
interface GrammarBadgeProps {
  level: string;
}

export function GrammarBadge({ level }: GrammarBadgeProps) {
  return (
    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-muted/65 border border-border/40 text-muted select-none">
      {level}
    </span>
  );
}

// ─────────────────────────────────────────
// Component: MistakeCallout
// ─────────────────────────────────────────
interface MistakeCalloutProps {
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  examples: { bad: string; good: string; noteEn: string; noteId: string }[];
  lang: "en" | "id";
}

export function MistakeCallout({
  titleEn,
  titleId,
  descEn,
  descId,
  examples,
  lang,
}: MistakeCalloutProps) {
  return (
    <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.02] p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <h4 className="text-sm font-extrabold text-foreground leading-tight">
            ⚠️ {lang === "en" ? titleEn : titleId}
          </h4>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {lang === "en" ? descEn : descId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
        {examples.map((ex, idx) => (
          <div key={idx} className="rounded-xl bg-background border border-border/40 p-3.5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-red-500 line-through select-none">
                ❌ {ex.bad}
              </span>
              <span className="text-xs font-bold text-emerald-500 select-none">
                ✅ {ex.good}
              </span>
            </div>
            <p className="text-[10px] text-muted italic leading-relaxed border-t border-border/30 pt-1.5">
              {lang === "en" ? ex.noteEn : ex.noteId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Component: VerbCard
// ─────────────────────────────────────────
interface VerbCardProps {
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  indonesian: string;
  jlpt: string;
  group: 1 | 2 | 3;
  lang: "en" | "id";
}

export function VerbCard({
  kanji,
  kana,
  romaji,
  english,
  indonesian,
  jlpt,
  group,
  lang,
}: VerbCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs flex items-center justify-between gap-4">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted opacity-75 font-semibold leading-none mb-1 select-none">
          {kana} • {romaji}
        </span>
        <h3 className="text-lg font-bold font-jp text-foreground leading-none">
          {kanji}
        </h3>
        <p className="text-xs text-muted leading-tight mt-1.5 truncate">
          {lang === "en" ? english : indonesian}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <JLPTBadge level={jlpt as any} />
        <VerbGroupBadge group={group} lang={lang} />
      </div>
    </div>
  );
}
