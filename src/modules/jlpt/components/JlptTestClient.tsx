"use client";

import { useEffect, useState, useTransition, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";

interface Question {
  id: number;
  level: string;
  section: string;
  question: string;
  prompt: string | null;
  choices: Array<{ id: string; text: string }>;
  answer: string;
  explanation: string | null;
}

const TIME_PER_QUESTION_SEC = 60; // 60s per question (5 min for 5 questions)

export function JlptTestClient({
  level,
  questions,
}: {
  level: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions.length * TIME_PER_QUESTION_SEC);
  const [pending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const current = questions[index];

  const handleSubmit = () => {
    if (pending) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/jlpt/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level,
            answers,
            duration: questions.length * TIME_PER_QUESTION_SEC - timeLeft,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          router.push(`/jlpt/${level}/result/${data.attemptId}`);
        }
      } catch (err) {
        console.error("[JlptTestClient]", err);
      }
    });
  };

  // Auto-submit on time out
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                🎯 JLPT {level} Mock Test
              </h1>
              <p className="text-xs text-muted">
                {answeredCount}/{questions.length} soal dijawab
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={[
                  "rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums",
                  timeLeft < 30
                    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 animate-pulse"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
                ].join(" ")}
              >
                ⏱ {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 flex flex-col gap-5">
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          {current && (
            <article className="rounded-2xl border border-border bg-surface px-6 py-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase rounded-md bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5">
                  {current.section}
                </span>
                <span className="text-[10px] text-muted">
                  Soal {index + 1} dari {questions.length}
                </span>
              </div>
              <p className="font-jp text-lg leading-relaxed text-foreground mb-5">
                {current.question}
              </p>
              {current.prompt && (
                <p className="text-sm text-muted italic mb-5">{current.prompt}</p>
              )}
              <div className="flex flex-col gap-2">
                {current.choices.map((c) => {
                  const selected = answers[current.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: c.id }))}
                      className={[
                        "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer",
                        selected
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border bg-background hover:border-accent/50 text-foreground",
                      ].join(" ")}
                    >
                      <span className="font-jp inline-block mr-2 font-bold text-accent">
                        {c.id.toUpperCase()}.
                      </span>
                      {c.text}
                    </button>
                  );
                })}
              </div>
            </article>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-muted disabled:opacity-40 cursor-pointer"
            >
              ← Sebelumnya
            </button>
            {index < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold cursor-pointer"
              >
                Lanjut →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={pending}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold disabled:opacity-40 cursor-pointer"
              >
                {pending ? "..." : "✓ Submit"}
              </button>
            )}
          </div>

          {/* Question nav */}
          <div className="grid grid-cols-10 gap-1.5">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(i)}
                className={[
                  "rounded-md h-8 text-xs font-bold transition-colors cursor-pointer",
                  i === index
                    ? "bg-accent text-white"
                    : answers[q.id]
                      ? "bg-emerald-200 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                      : "bg-surface-muted text-muted hover:bg-surface",
                ].join(" ")}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
