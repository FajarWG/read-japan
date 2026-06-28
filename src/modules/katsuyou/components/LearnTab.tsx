"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, CheckCircle, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { CONJUGATION_GUIDES } from "../data/conjugationGuides";
import { MistakeCallout, JLPTBadge } from "./KatsuyouComponents";
import { completeLesson } from "../actions/katsuyouActions";

interface LearnTabProps {
  formKey: string;
  isCompleted: boolean;
  onLessonCompleted: (formKey: string) => void;
  lang: "en" | "id";
}

export function LearnTab({
  formKey,
  isCompleted,
  onLessonCompleted,
  lang,
}: LearnTabProps) {
  const guide = CONJUGATION_GUIDES[formKey];
  const [isPending, startTransition] = useTransition();
  const [completedLocal, setCompletedLocal] = useState(isCompleted);

  // Sync state if formKey changes
  React.useEffect(() => {
    setCompletedLocal(isCompleted);
  }, [isCompleted, formKey]);

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted">
        <Info className="w-8 h-8 mb-2" />
        <p>{lang === "en" ? "No guide available for this form." : "Panduan tidak tersedia untuk bentuk ini."}</p>
      </div>
    );
  }

  const handleComplete = () => {
    startTransition(async () => {
      const res = await completeLesson(formKey);
      if (res.success) {
        setCompletedLocal(true);
        onLessonCompleted(formKey);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* ── Purpose Card ────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-accent">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider select-none">
            {lang === "en" ? "Purpose" : "Tujuan Penggunaan"}
          </h3>
        </div>
        <p className="text-base text-foreground leading-relaxed font-medium">
          {lang === "en" ? guide.purposeEn : guide.purposeId}
        </p>
      </section>

      {/* ── Conjugation Rules ───────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-muted uppercase tracking-wider px-2 select-none">
          {lang === "en" ? "Conjugation Rules" : "Aturan Perubahan kata kerja"}
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {/* Godan Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {lang === "en" ? "Group 1 (Godan / 五段)" : "Golongan 1 (Godan / 五段)"}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {lang === "en" ? guide.rules.group1.patternEn : guide.rules.group1.patternId}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{lang === "en" ? "Base Verb" : "Kata Kerja Dasar"}</th>
                    <th className="py-2 pr-4">{lang === "en" ? "Conjugation" : "Hasil Konjugasi"}</th>
                    <th className="py-2">{lang === "en" ? "Meaning" : "Arti"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group1.examples.map((ex, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30">
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">{ex.conj}</td>
                      <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ichidan Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                {lang === "en" ? "Group 2 (Ichidan / 一段)" : "Golongan 2 (Ichidan / 一段)"}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {lang === "en" ? guide.rules.group2.patternEn : guide.rules.group2.patternId}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{lang === "en" ? "Base Verb" : "Kata Kerja Dasar"}</th>
                    <th className="py-2 pr-4">{lang === "en" ? "Conjugation" : "Hasil Konjugasi"}</th>
                    <th className="py-2">{lang === "en" ? "Meaning" : "Arti"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group2.examples.map((ex, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30">
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">{ex.conj}</td>
                      <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Irregular Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                {lang === "en" ? "Group 3 (Irregular / 不規則)" : "Golongan 3 (Irregular / 不規則)"}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {lang === "en" ? guide.rules.group3.patternEn : guide.rules.group3.patternId}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{lang === "en" ? "Base Verb" : "Kata Kerja Dasar"}</th>
                    <th className="py-2 pr-4">{lang === "en" ? "Conjugation" : "Hasil Konjugasi"}</th>
                    <th className="py-2">{lang === "en" ? "Meaning" : "Arti"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group3.examples.map((ex, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30">
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                      <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">{ex.conj}</td>
                      <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Common Mistakes Callout ─────────────────────── */}
      {guide.mistake && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-muted uppercase tracking-wider px-2 select-none">
            {lang === "en" ? "Common Mistakes" : "Kesalahan Umum"}
          </h3>
          <MistakeCallout
            titleEn={guide.mistake.titleEn}
            titleId={guide.mistake.titleId}
            descEn={guide.mistake.descEn}
            descId={guide.mistake.descId}
            examples={guide.mistake.examples}
            lang={lang}
          />
        </section>
      )}

      {/* ── Related Grammar Patterns ────────────────────── */}
      {guide.grammarPatterns.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-muted uppercase tracking-wider px-2 select-none">
            {lang === "en" ? "Related Grammar Patterns" : "Pola Tata Bahasa Terkait"}
          </h3>
          <div className="flex flex-col gap-4">
            {guide.grammarPatterns.map((pat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold font-jp text-accent select-all">
                    {pat.pattern}
                  </span>
                  <JLPTBadge level={pat.jlpt} />
                </div>
                <p className="text-xs text-foreground leading-relaxed font-semibold">
                  {lang === "en" ? pat.descEn : pat.descId}
                </p>

                <div className="rounded-xl bg-background border border-border/40 p-4 mt-1 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted opacity-75 leading-none select-none">
                    {lang === "en" ? "Example Sentence:" : "Contoh Kalimat:"}
                  </span>
                  <p className="text-base font-bold font-jp text-foreground leading-snug">
                    {pat.exampleJp}
                  </p>
                  <p className="text-[10px] text-muted font-semibold leading-none select-none">
                    {pat.exampleKana}
                  </p>
                  <div className="flex flex-col gap-0.5 text-xs text-muted font-medium border-t border-border/30 pt-2 mt-1">
                    <p>🇺🇸 {pat.exampleEn}</p>
                    <p>🇮🇩 {pat.exampleId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Complete Action ──────────────────────────────── */}
      <section className="flex items-center justify-center pt-4 border-t border-border/40">
        {completedLocal ? (
          <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-sm select-none">
            <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
            {lang === "en" ? "Lesson Completed!" : "Pelajaran Selesai!"}
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg disabled:opacity-50 select-none cursor-pointer transition-all duration-200"
          >
            {isPending ? (
              <span>{lang === "en" ? "Saving..." : "Menyimpan..."}</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{lang === "en" ? "Mark Lesson as Completed" : "Tandai Pelajaran Selesai"}</span>
              </>
            )}
          </button>
        )}
      </section>
    </div>
  );
}
