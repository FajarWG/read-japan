"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, CheckCircle, CheckCircle2, ChevronRight, Info, PenTool, X } from "lucide-react";
import { CONJUGATION_GUIDES } from "../data/conjugationGuides";
import { MistakeCallout, JLPTBadge } from "./KatsuyouComponents";
import { completeLesson } from "../actions/katsuyouActions";
import { HandwritingPracticeWidget } from "@/src/shared/components/HandwritingPracticeWidget";

interface LearnTabProps {
  formKey: string;
  isCompleted: boolean;
  onLessonCompleted: (formKey: string) => void;
}

export function LearnTab({
  formKey,
  isCompleted,
  onLessonCompleted,
}: LearnTabProps) {
  const guide = CONJUGATION_GUIDES[formKey];
  const [isPending, startTransition] = useTransition();
  const [completedLocal, setCompletedLocal] = useState(isCompleted);
  const [activePractice, setActivePractice] = useState<{ group: number; index: number } | null>(null);
  const [activeGrammarPractice, setActiveGrammarPractice] = useState<number | null>(null);

  // Sync state if formKey changes
  React.useEffect(() => {
    setCompletedLocal(isCompleted);
  }, [isCompleted, formKey]);

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted">
        <Info className="w-8 h-8 mb-2" />
        <p>{"No guide available for this form."}</p>
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
            Purpose
          </h3>
        </div>
        <p className="text-base text-foreground leading-relaxed font-medium">
          {guide.purposeEn}
        </p>
      </section>

      {/* ── Conjugation Rules ───────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-muted uppercase tracking-wider px-2 select-none">
          Conjugation Rules
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {/* Godan Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                Group 1 (Godan / 五段)
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {guide.rules.group1.patternEn}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{"Base Verb"}</th>
                    <th className="py-2 pr-4">{"Conjugation"}</th>
                    <th className="py-2">{"Meaning"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group1.examples.flatMap((ex, i) => {
                    const isPracticing = activePractice?.group === 1 && activePractice?.index === i;
                    return [
                      <tr key={`row-1-${i}`} className="hover:bg-surface-muted/30">
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">
                          <div className="flex items-center gap-2">
                            <span>{ex.conj}</span>
                            <button
                              onClick={() => setActivePractice(isPracticing ? null : { group: 1, index: i })}
                              className="p-1 text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors cursor-pointer"
                              title="Practice writing"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                      </tr>,
                      isPracticing && (
                        <tr key={`practice-1-${i}`} className="bg-surface-muted/10">
                          <td colSpan={3} className="p-3 border-t border-b border-border/30">
                            <HandwritingPracticeWidget
                              expected={ex.conj}
                              onClose={() => setActivePractice(null)}
                              className="max-w-md mx-auto"
                            />
                          </td>
                        </tr>
                      )
                    ].filter(Boolean);
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ichidan Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                Group 2 (Ichidan / 一段)
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {guide.rules.group2.patternEn}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{"Base Verb"}</th>
                    <th className="py-2 pr-4">{"Conjugation"}</th>
                    <th className="py-2">{"Meaning"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group2.examples.flatMap((ex, i) => {
                    const isPracticing = activePractice?.group === 2 && activePractice?.index === i;
                    return [
                      <tr key={`row-2-${i}`} className="hover:bg-surface-muted/30">
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">
                          <div className="flex items-center gap-2">
                            <span>{ex.conj}</span>
                            <button
                              onClick={() => setActivePractice(isPracticing ? null : { group: 2, index: i })}
                              className="p-1 text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors cursor-pointer"
                              title="Practice writing"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                      </tr>,
                      isPracticing && (
                        <tr key={`practice-2-${i}`} className="bg-surface-muted/10">
                          <td colSpan={3} className="p-3 border-t border-b border-border/30">
                            <HandwritingPracticeWidget
                              expected={ex.conj}
                              onClose={() => setActivePractice(null)}
                              className="max-w-md mx-auto"
                            />
                          </td>
                        </tr>
                      )
                    ].filter(Boolean);
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Irregular Rules */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                Group 3 (Irregular / 不規則)
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              {guide.rules.group3.patternEn}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-border/45 text-muted select-none font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4">{"Base Verb"}</th>
                    <th className="py-2 pr-4">{"Conjugation"}</th>
                    <th className="py-2">{"Meaning"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {guide.rules.group3.examples.flatMap((ex, i) => {
                    const isPracticing = activePractice?.group === 3 && activePractice?.index === i;
                    return [
                      <tr key={`row-3-${i}`} className="hover:bg-surface-muted/30">
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-foreground">{ex.base}</td>
                        <td className="py-2.5 pr-4 font-bold font-jp text-sm text-accent">
                          <div className="flex items-center gap-2">
                            <span>{ex.conj}</span>
                            <button
                              onClick={() => setActivePractice(isPracticing ? null : { group: 3, index: i })}
                              className="p-1 text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors cursor-pointer"
                              title="Practice writing"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted text-xs font-semibold">{ex.romaji}</td>
                      </tr>,
                      isPracticing && (
                        <tr key={`practice-3-${i}`} className="bg-surface-muted/10">
                          <td colSpan={3} className="p-3 border-t border-b border-border/30">
                            <HandwritingPracticeWidget
                              expected={ex.conj}
                              onClose={() => setActivePractice(null)}
                              className="max-w-md mx-auto"
                            />
                          </td>
                        </tr>
                      )
                    ].filter(Boolean);
                  })}
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
            Common Mistakes
          </h3>
          <MistakeCallout
            titleEn={guide.mistake.titleEn}
            descEn={guide.mistake.descEn}
            examples={guide.mistake.examples}
          />
        </section>
      )}

      {/* ── Related Grammar Patterns ────────────────────── */}
      {guide.grammarPatterns.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-muted uppercase tracking-wider px-2 select-none">
            Related Grammar Patterns
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
                  {pat.descEn}
                </p>

                <div className="rounded-xl bg-background border border-border/40 p-4 mt-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-muted opacity-75 leading-none select-none">
                      Example Sentence:
                    </span>
                    <button
                      onClick={() => setActiveGrammarPractice(activeGrammarPractice === idx ? null : idx)}
                      className={[
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:scale-105 active:scale-95 shadow-3xs",
                        activeGrammarPractice === idx
                          ? "bg-accent/15 border-accent/25 text-accent font-extrabold"
                          : "bg-surface border border-border/40 text-muted hover:text-foreground"
                      ].join(" ")}
                      title="Practice writing sentence"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{"Practice"}</span>
                    </button>
                  </div>
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

                  {activeGrammarPractice === idx && (
                    <div className="border-t border-border/30 pt-4 mt-2">
                      <HandwritingPracticeWidget
                        expected={pat.exampleJp}
                        onClose={() => setActiveGrammarPractice(null)}
                      />
                    </div>
                  )}
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
            Lesson Completed!
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg disabled:opacity-50 select-none cursor-pointer transition-all duration-200"
          >
            {isPending ? (
              <span>{"Saving..."}</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{"Mark Lesson as Completed"}</span>
              </>
            )}
          </button>
        )}
      </section>
    </div>
  );
}

