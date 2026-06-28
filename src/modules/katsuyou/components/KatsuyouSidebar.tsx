"use client";

import React from "react";
import { Check } from "lucide-react";

export interface SidebarForm {
  key: string;
  labelEn: string;
  labelId: string;
  jpName: string;
  jlpt: string;
  level: "basic" | "intermediate" | "advanced";
}

export const CONJUGATION_FORMS: SidebarForm[] = [
  // Basic Forms
  { key: "dictionary", labelEn: "Dictionary Form", labelId: "Bentuk Kamus", jpName: "辞書形 (Jishokei)", jlpt: "N5", level: "basic" },
  { key: "masu", labelEn: "Masu Form", labelId: "Bentuk Masu", jpName: "ます形 (Masukei)", jlpt: "N5", level: "basic" },
  { key: "te", labelEn: "Te Form", labelId: "Bentuk Te", jpName: "て形 (Tekei)", jlpt: "N5+", level: "basic" },
  { key: "ta", labelEn: "Ta Form", labelId: "Bentuk Ta", jpName: "た形 (Takei)", jlpt: "N5+", level: "basic" },
  { key: "nai", labelEn: "Nai Form", labelId: "Bentuk Nai", jpName: "ない形 (Naikei)", jlpt: "N5+", level: "basic" },
  
  // Intermediate Forms
  { key: "potential", labelEn: "Potential Form", labelId: "Bentuk Potensial", jpName: "可能形 (Kanoukei)", jlpt: "N4", level: "intermediate" },
  { key: "volitional", labelEn: "Volitional Form", labelId: "Bentuk Maksud", jpName: "意向形 (Ikoukei)", jlpt: "N4", level: "intermediate" },
  { key: "imperative", labelEn: "Imperative Form", labelId: "Bentuk Perintah", jpName: "命令形 (Meireikei)", jlpt: "N4", level: "intermediate" },
  { key: "prohibitive", labelEn: "Prohibitive Form", labelId: "Bentuk Larangan", jpName: "禁止形 (Kinshikei)", jlpt: "N4", level: "intermediate" },
  
  // Advanced Forms
  { key: "passive", labelEn: "Passive Form", labelId: "Bentuk Pasif", jpName: "受身形 (Ukemikei)", jlpt: "N3", level: "advanced" },
  { key: "causative", labelEn: "Causative Form", labelId: "Bentuk Kausatif", jpName: "使役形 (Shiekikei)", jlpt: "N3", level: "advanced" },
  { key: "causativePassive", labelEn: "Causative Passive", labelId: "Kausatif Pasif", jpName: "使役受身形 (Shiekiukemikei)", jlpt: "N3", level: "advanced" },
  { key: "ba", labelEn: "Conditional (Ba Form)", labelId: "Pengandaian (Bentuk Ba)", jpName: "ば形 (Bakei)", jlpt: "N3", level: "advanced" },
];

interface KatsuyouSidebarProps {
  selectedForm: string;
  onSelectForm: (key: string) => void;
  completedLessons: string[];
  dueReviewsByForm: Record<string, number>;
  lang: "en" | "id";
}

export function KatsuyouSidebar({
  selectedForm,
  onSelectForm,
  completedLessons,
  dueReviewsByForm,
  lang,
}: KatsuyouSidebarProps) {
  const groups = {
    basic: {
      title: lang === "en" ? "Basic Forms" : "Bentuk Dasar",
      items: CONJUGATION_FORMS.filter((f) => f.level === "basic"),
    },
    intermediate: {
      title: lang === "en" ? "Intermediate Forms" : "Bentuk Menengah",
      items: CONJUGATION_FORMS.filter((f) => f.level === "intermediate"),
    },
    advanced: {
      title: lang === "en" ? "Advanced Forms" : "Bentuk Mahir",
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
                      {lang === "en" ? form.labelEn : form.labelId}
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
