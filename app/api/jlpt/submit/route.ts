import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivityAndCheck } from "@/src/modules/achievements/lib/achievements";

export const dynamic = "force-dynamic";

interface PostBody {
  level?: string;
  answers?: Record<string, string>; // { questionId: choiceId }
  duration?: number; // detik
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { level, answers, duration } = body;
  if (!level || !answers) {
    return NextResponse.json({ error: "level, answers required" }, { status: 400 });
  }

  // Ambil question + answer
  const ids = Object.keys(answers).map(Number).filter((n) => !Number.isNaN(n));
  if (ids.length === 0) {
    return NextResponse.json({ error: "no answers" }, { status: 400 });
  }

  const questions = await prisma.jLPTQuestion.findMany({
    where: { id: { in: ids } },
  });

  let score = 0;
  const detail: Array<{ questionId: number; chosen: string; correct: boolean }> = [];
  for (const q of questions) {
    const chosen = answers[q.id];
    const correct = chosen === q.answer;
    detail.push({ questionId: q.id, chosen, correct });
    if (correct) score += 1;
  }

  const attempt = await prisma.jLPTAttempt.create({
    data: {
      userId: session.id,
      level,
      score,
      total: questions.length,
      duration: duration ?? 0,
      detail: detail as unknown as object,
    },
  });

  await logActivityAndCheck(session.id, "jlpt_mock", String(attempt.id), {
    level,
    score,
    total: questions.length,
  });

  return NextResponse.json({ ok: true, attemptId: attempt.id });
}
