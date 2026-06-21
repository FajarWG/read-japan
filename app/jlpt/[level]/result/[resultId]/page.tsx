import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hasil JLPT — Nihongo Flow",
};

export default async function JlptResultPage({
  params,
}: {
  params: Promise<{ level: string; resultId: string }>;
}) {
  const { level, resultId } = await params;
  const session = await getSession();
  if (!session) return null;

  const attemptId = Number(resultId);
  if (Number.isNaN(attemptId)) notFound();

  const attempt = await prisma.jLPTAttempt.findUnique({
    where: { id: attemptId },
  });
  if (!attempt || attempt.userId !== session.id) notFound();

  const detail = attempt.detail as Array<{ questionId: number; chosen: string; correct: boolean }>;
  const pct = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;

  // Load all questions for explanations
  const questionIds = detail.map((d) => d.questionId);
  const questions = await prisma.jLPTQuestion.findMany({
    where: { id: { in: questionIds } },
  });
  const qMap = new Map(questions.map((q) => [q.id, q]));

  const passed = pct >= 80;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                🎯 Hasil JLPT {level}
              </h1>
              <p className="text-xs text-muted">
                Attempt #{attempt.id} · {new Date(attempt.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/jlpt"
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
              >
                ← JLPT
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 flex flex-col gap-5">
          {/* Score summary */}
          <div
            className={[
              "rounded-2xl border-2 px-6 py-8 text-center shadow-sm",
              passed
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20",
            ].join(" ")}
          >
            <p className="text-5xl mb-2">{passed ? "🎉" : "💪"}</p>
            <p className="text-2xl font-bold text-foreground">
              {attempt.score}/{attempt.total} ({pct}%)
            </p>
            <p className="text-sm font-semibold mt-1 text-foreground">
              {passed
                ? passed
                  ? "Lulus! 🎊"
                  : ""
                : "Belum lulus — minimal 80% untuk lulus"}
            </p>
            <p className="text-xs text-muted mt-2">
              Waktu: {Math.round(attempt.duration / 60)} menit {attempt.duration % 60} detik
            </p>
          </div>

          {/* Per-question breakdown */}
          <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-foreground">
              📋 Breakdown per soal
            </p>
            <div className="flex flex-col gap-2">
              {detail.map((d, i) => {
                const q = qMap.get(d.questionId);
                if (!q) return null;
                const correct = d.correct;
                const choices = q.choices as Array<{ id: string; text: string }>;
                const correctChoice = choices.find((c) => c.id === q.answer);
                const userChoice = choices.find((c) => c.id === d.chosen);
                return (
                  <details
                    key={d.questionId}
                    className={[
                      "rounded-xl border px-3 py-2",
                      correct
                        ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-800/40 dark:bg-emerald-950/10"
                        : "border-red-200 bg-red-50/40 dark:border-red-800/40 dark:bg-red-950/10",
                    ].join(" ")}
                  >
                    <summary className="cursor-pointer text-xs font-bold flex items-center gap-2">
                      <span>{correct ? "✓" : "✗"}</span>
                      <span className="text-muted">#{i + 1}</span>
                      <span className="font-jp text-foreground truncate">
                        {q.question}
                      </span>
                    </summary>
                    <div className="mt-2 text-xs space-y-1.5 pl-5">
                      <p>
                        <span className="font-bold">Jawaban Anda:</span>{" "}
                        <span className={correct ? "text-emerald-700" : "text-red-700"}>
                          {d.chosen.toUpperCase()}. {userChoice?.text ?? "(tidak dijawab)"}
                        </span>
                      </p>
                      {!correct && (
                        <p>
                          <span className="font-bold">Benar:</span>{" "}
                          <span className="text-emerald-700">
                            {q.answer.toUpperCase()}. {correctChoice?.text}
                          </span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-muted italic">{q.explanation}</p>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <Link
            href="/jlpt"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-sm font-bold text-center cursor-pointer"
          >
            🔄 Coba lagi
          </Link>
        </main>
      </div>
    </div>
  );
}
