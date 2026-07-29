"use client";

import React from "react";
import { Check } from "lucide-react";
import { CONJUGATION_FORMS } from "../data/conjugationForms";

export { CONJUGATION_FORMS } from "../data/conjugationForms";
export type { SidebarForm } from "../data/conjugationForms";

interface KatsuyouSidebarProps {
  selectedForm: string;
  onSelectForm: (key: string) => void;
  completedLessons: string[];
  dueReviewsByForm: Record<string, number>;
}

export function KatsuyouSidebar({
  selectedForm,
  onSelectForm,
  completedLessons,
  dueReviewsByForm,
}: KatsuyouSidebarProps) {
  const groups = {
    basic: {
      title: "Basic Forms",
      items: CONJUGATION_FORMS.filter((f) => f.level === "basic"),
    },
    intermediate: {
      title: "Intermediate Forms",
      items: CONJUGATION_FORMS.filter((f) => f.level === "intermediate"),
    },
    advanced: {
      title: "Advanced Forms",
      items: CONJUGATION_FORMS.filter((f) => f.level === "advanced"),
    },
  };

  return (
    <div className="w-full flex flex-col gap-6 md:w-64 shrink-0">
      {Object.entries(groups).map(([level, group]) => (
        <div key={level} className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-muted/80 uppercase tracking-wider px-2 select-none">
            {group.title}
          </h3>
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 scrollbar-none">
            {group.items.map((form) => {
              const isActive = selectedForm === form.key;
              const isCompleted = completedLessons.includes(form.key);
              const dueCount = dueReviewsByForm[form.key] || 0;

              return (
                <button
                  key={form.key}
                  onClick={() => onSelectForm(form.key)}
                  className={[
                    "flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer select-none transition-all duration-200 border",
                    isActive
                      ? "bg-accent/10 border-accent/25 text-accent shadow-xs"
                      : "bg-surface/50 border-border/40 hover:bg-surface-muted hover:border-border text-foreground/80 hover:text-foreground",
                  ].join(" ")}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-jp text-[10px] opacity-75 truncate">
                      {form.jpName}
                    </span>
                    <span className="text-sm font-bold truncate leading-snug">
                      {form.labelEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ml-2">
                    {/* JLPT Badge */}
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-background text-muted border border-border select-none">
                      {form.jlpt}
                    </span>

                    {/* Completion Icon */}
                    {isCompleted && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3px]" />
                      </span>
                    )}

                    {/* Due Badge */}
                    {dueCount > 0 && (
                      <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-[9px] font-black text-white shadow-xs">
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
