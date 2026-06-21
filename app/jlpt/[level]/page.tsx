import type { Metadata } from "next";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { redirect } from "next/navigation";
import { JlptTestClient } from "@/src/modules/jlpt/components/JlptTestClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "JLPT N5 Mock Test — Nihongo Flow",
};

export default async function JlptLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const session = await getSession();
  if (!session) redirect("/login");
  if (!["N5", "N4", "N3"].includes(level)) redirect("/jlpt");

  const rawQuestions = await prisma.jLPTQuestion.findMany({
    where: { level },
    orderBy: { id: "asc" },
    take: 20, // batasi 20 soal per test
  });

  if (rawQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/40 px-6 py-8 text-center max-w-md">
          <p className="text-lg font-bold text-foreground">
            Belum ada soal untuk level {level}
          </p>
          <p className="text-sm text-muted mt-2">
            Soal untuk level ini akan ditambahkan segera.
          </p>
        </div>
      </div>
    );
  }

  // Strip correct answer from client payload
  const questions = rawQuestions.map((q) => ({
    id: q.id,
    level: q.level,
    section: q.section,
    question: q.question,
    prompt: q.prompt,
    choices: q.choices as Array<{ id: string; text: string }>,
    answer: q.answer, // client tidak expose; untuk display nanti saja
    explanation: q.explanation,
  }));

  return <JlptTestClient level={level} questions={questions} />;
}
