"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import type { BunpouPattern } from "@/src/modules/bunpou/data/bunpouData";
import type { KakouMaterialSelection, KakouMaterials } from "../data/types";

interface KakouSidebarProps {
  materials: KakouMaterials;
  onSelectItem: (item: KakouMaterialSelection) => void;
}

export function KakouSidebar({ materials, onSelectItem }: KakouSidebarProps) {
  const [tab, setTab] = useState<"katsuyou" | "bunpou">("katsuyou");

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 shrink-0">
      <div className="sticky top-0 z-10 flex shrink-0 overflow-hidden rounded-xl border border-border/50 bg-background/95 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setTab("katsuyou")}
          className={`flex-1 px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
            tab === "katsuyou" ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          Katsuyou
        </button>
        <button
          type="button"
          onClick={() => setTab("bunpou")}
          className={`flex-1 px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
            tab === "bunpou" ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          Bunpou
        </button>
      </div>

      {tab === "katsuyou" ? (
        <KatsuyouPane
          materials={materials.katsuyou}
          onSelect={(formKey) => onSelectItem({ type: "KATSUYOU", id: formKey })}
        />
      ) : (
        <BunpouPane
          materials={materials.bunpou}
          onSelect={(patternId) => onSelectItem({ type: "BUNPOU", id: patternId })}
        />
      )}
    </div>
  );
}

function KatsuyouPane({
  materials,
  onSelect,
}: {
  materials: KakouMaterials["katsuyou"];
  onSelect: (formKey: string) => void;
}) {
  const groups = {
    basic: { title: "Basic Forms", items: materials.forms.filter((f) => f.level === "basic") },
    intermediate: { title: "Intermediate Forms", items: materials.forms.filter((f) => f.level === "intermediate") },
    advanced: { title: "Advanced Forms", items: materials.forms.filter((f) => f.level === "advanced") },
  };

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([level, group]) => (
        <div key={level} className="flex flex-col gap-1.5">
          <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted/80 select-none">
            {group.title}
          </h3>
          <div className="flex flex-col gap-1">
            {group.items.map((form) => {
              const isCompleted = materials.completedLessons.includes(form.key);
              const dueCount = materials.dueReviewsByForm[form.key] || 0;
              return (
                <button
                  key={form.key}
                  type="button"
                  onClick={() => onSelect(form.key)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/40 bg-surface/50 px-3 py-2 text-left text-xs font-semibold transition-all hover:border-border hover:bg-surface-muted"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-jp text-[10px] opacity-75">{form.jpName}</span>
                    <span className="truncate text-xs font-bold leading-snug">{form.labelEn}</span>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[9px] font-bold text-muted">
                      {form.jlpt}
                    </span>
                    {isCompleted && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        <Check className="h-2.5 w-2.5 stroke-[3px]" />
                      </span>
                    )}
                    {dueCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                        {dueCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BunpouPane({
  materials,
  onSelect,
}: {
  materials: KakouMaterials["bunpou"];
  onSelect: (patternId: string) => void;
}) {
  const [selectedChapter, setSelectedChapter] = useState<number>(materials.lessons[0]?.chapter ?? 1);
  const [query, setQuery] = useState("");

  const chapterStats = useMemo(() => {
    const stats: Record<number, { total: number; learned: number }> = {};
    materials.lessons.forEach((lesson) => {
      const total = lesson.patterns.length;
      const learned = lesson.patterns.filter((p) => materials.completedPatternIds.includes(p.id)).length;
      stats[lesson.chapter] = { total, learned };
    });
    return stats;
  }, [materials]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return materials.lessons.flatMap((lesson) =>
      lesson.patterns.filter(
        (p) =>
          p.pattern.toLowerCase().includes(q) ||
          p.descEn.toLowerCase().includes(q) ||
          p.descId.toLowerCase().includes(q),
      ),
    );
  }, [materials, query]);

  const activeLesson = materials.lessons.find((lesson) => lesson.chapter === selectedChapter);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search grammar patterns..."
          className="w-full rounded-lg border border-border/50 bg-background py-1.5 pl-7 pr-2 text-xs focus:border-accent/40 focus:outline-none"
        />
      </div>

      {searchResults ? (
        <div className="flex flex-col gap-1">
          {searchResults.length === 0 && (
            <p className="px-2 text-xs italic text-muted">No matches.</p>
          )}
          {searchResults.map((pattern) => (
            <PatternRow
              key={pattern.id}
              pattern={pattern}
              isLearned={materials.completedPatternIds.includes(pattern.id)}
              onClick={() => onSelect(pattern.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 overflow-x-auto pb-2 scrollbar-none md:flex-col md:overflow-x-visible md:pb-0">
            {materials.lessons.map((lesson) => {
              const stats = chapterStats[lesson.chapter] || { total: 0, learned: 0 };
              const isFinished = stats.total > 0 && stats.learned === stats.total;
              const isActive = lesson.chapter === selectedChapter;
              return (
                <button
                  key={lesson.chapter}
                  type="button"
                  onClick={() => setSelectedChapter(lesson.chapter)}
                  className={[
                    "flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
                    isActive
                      ? "border-accent/25 bg-accent/10 text-accent"
                      : "border-border/40 bg-surface/50 text-foreground/80 hover:border-border hover:bg-surface-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[10px] opacity-75">Chapter {lesson.chapter}</span>
                    <span className="truncate text-xs font-bold leading-snug">{lesson.titleEn}</span>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    <span
                      className={[
                        "rounded-md border px-1.5 py-0.5 text-[9px] font-bold",
                        isFinished
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border-border bg-background text-muted",
                      ].join(" ")}
                    >
                      {stats.learned}/{stats.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {activeLesson && (
            <div className="flex flex-col gap-1 border-t border-border/40 pt-2">
              {activeLesson.patterns.map((pattern) => (
                <PatternRow
                  key={pattern.id}
                  pattern={pattern}
                  isLearned={materials.completedPatternIds.includes(pattern.id)}
                  onClick={() => onSelect(pattern.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PatternRow({
  pattern,
  isLearned,
  onClick,
}: {
  pattern: BunpouPattern;
  isLearned: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-border/40 bg-surface/50 px-3 py-2 text-left text-xs font-semibold transition-all hover:border-border hover:bg-surface-muted"
    >
      <span className="truncate font-jp">{pattern.pattern}</span>
      <div className="ml-2 flex shrink-0 items-center gap-1.5">
        <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[9px] font-bold text-muted">
          {pattern.jlpt}
        </span>
        {isLearned && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            <Check className="h-2.5 w-2.5 stroke-[3px]" />
          </span>
        )}
      </div>
    </button>
  );
}
