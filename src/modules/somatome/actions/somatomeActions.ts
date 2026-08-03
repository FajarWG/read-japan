"use server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivity } from "@/src/shared/lib/activity";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────
// Books
// ─────────────────────────────────────────────────────────

export interface SomatomeBookInfo {
  id: number;
  name: string;
  pdfUrl: string;
  audioUrl: string | null;
}

export async function getSomatomeBooks(): Promise<SomatomeBookInfo[]> {
  const books = await prisma.somatomeBook.findMany({ orderBy: { createdAt: "asc" } });
  return books.map((b) => ({ id: b.id, name: b.name, pdfUrl: b.pdfUrl, audioUrl: b.audioUrl }));
}

export async function createSomatomeBook(name: string, pdfUrl: string, audioUrl?: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  if (!name.trim() || !pdfUrl.trim()) return { success: false, error: "Nama dan link PDF wajib diisi" };

  try {
    const book = await prisma.somatomeBook.create({
      data: { name: name.trim(), pdfUrl: pdfUrl.trim(), audioUrl: audioUrl?.trim() || null },
    });
    revalidatePath("/somatome");
    return { success: true, id: book.id };
  } catch (error) {
    console.error("Error creating Somatome book:", error);
    return { success: false, error: "Failed to create book" };
  }
}

export async function updateSomatomeBook(
  id: number,
  data: { name?: string; pdfUrl?: string; audioUrl?: string | null },
) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.somatomeBook.update({ where: { id }, data });
    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error updating Somatome book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteSomatomeBook(id: number) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.somatomeBook.delete({ where: { id } });
    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Somatome book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

// ─────────────────────────────────────────────────────────
// Question setup & Summary
// ─────────────────────────────────────────────────────────

export interface SomatomeQuestionRef {
  id: number;
  mondai: string;
  number: number;
}

export interface SomatomeQuestionDetail {
  id: number;
  mondai: string;
  number: number;
  correctAnswer: number | null;
}

export interface SomatomeDaySummary {
  day: number;
  questionCount: number;
  keysCount: number;
  bestPercentage: number | null;
  latestPercentage: number | null;
}

export interface SomatomeBookSummary {
  days: SomatomeDaySummary[];
  nextRecommendedDay: number;
}

export async function getSomatomeBookSummary(bookId: number): Promise<SomatomeBookSummary> {
  const session = await getSession();

  const questions = await prisma.somatomeQuestion.findMany({
    where: { bookId },
    select: { day: true, id: true, correctAnswer: true },
  });

  const attempts = session
    ? await prisma.somatomeAttempt.findMany({
        where: { userId: session.id, bookId },
        orderBy: { createdAt: "desc" },
        select: { day: true, score: true, total: true },
      })
    : [];

  const attemptsByDay = new Map<number, { best: number; latest: number }>();
  for (const att of attempts) {
    if (att.total <= 0) continue;
    const pct = Math.round((att.score / att.total) * 100);
    const existing = attemptsByDay.get(att.day);
    if (!existing) {
      attemptsByDay.set(att.day, { best: pct, latest: pct });
    } else {
      if (pct > existing.best) existing.best = pct;
      attemptsByDay.set(att.day, existing);
    }
  }

  const dayMap = new Map<number, { questionCount: number; keysCount: number }>();
  let maxDay = 0;

  for (const q of questions) {
    if (q.day > maxDay) maxDay = q.day;
    const current = dayMap.get(q.day) ?? { questionCount: 0, keysCount: 0 };
    current.questionCount += 1;
    if (q.correctAnswer != null) current.keysCount += 1;
    dayMap.set(q.day, current);
  }

  const days: SomatomeDaySummary[] = Array.from(dayMap.entries())
    .map(([day, val]) => {
      const att = attemptsByDay.get(day);
      return {
        day,
        ...val,
        bestPercentage: att ? att.best : null,
        latestPercentage: att ? att.latest : null,
      };
    })
    .sort((a, b) => a.day - b.day);

  return {
    days,
    nextRecommendedDay: maxDay > 0 ? maxDay + 1 : 1,
  };
}

export async function getSomatomeDayQuestions(
  bookId: number,
  day: number,
): Promise<SomatomeQuestionRef[]> {
  const questions = await prisma.somatomeQuestion.findMany({
    where: { bookId, day },
    orderBy: [{ number: "asc" }],
    select: { id: true, mondai: true, number: true },
  });
  return questions;
}

export async function getSomatomeDayQuestionsWithKeys(
  bookId: number,
  day: number,
): Promise<SomatomeQuestionDetail[]> {
  const questions = await prisma.somatomeQuestion.findMany({
    where: { bookId, day },
    orderBy: [{ number: "asc" }],
    select: { id: true, mondai: true, number: true, correctAnswer: true },
  });
  return questions;
}

/**
 * Set total question count for a Day.
 * Adds missing question numbers if increased, removes excess questions if decreased.
 */
export async function setSomatomeDayQuestionCount(
  bookId: number,
  day: number,
  count: number,
) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  if (day < 1 || count < 1) return { success: false, error: "Data tidak valid" };

  try {
    const existing = await prisma.somatomeQuestion.findMany({
      where: { bookId, day },
      select: { id: true, number: true },
      orderBy: { number: "asc" },
    });

    const existingCount = existing.length;

    if (count > existingCount) {
      const existingNumbers = new Set(existing.map((q) => q.number));
      const toCreate = [];
      for (let n = 1; n <= count; n++) {
        if (!existingNumbers.has(n)) {
          toCreate.push({ bookId, day, mondai: `Day ${day}`, number: n });
        }
      }
      if (toCreate.length > 0) {
        await prisma.somatomeQuestion.createMany({ data: toCreate });
      }
    } else if (count < existingCount) {
      await prisma.somatomeQuestion.deleteMany({
        where: { bookId, day, number: { gt: count } },
      });
    }

    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error setting Somatome day question count:", error);
    return { success: false, error: "Gagal mengatur jumlah soal" };
  }
}

export async function setSomatomeMondaiCount(
  bookId: number,
  day: number,
  mondai: string,
  count: number,
) {
  return setSomatomeDayQuestionCount(bookId, day, count);
}

export async function updateSomatomeQuestionKeys(
  keys: { questionId: number; correctAnswer: number | null }[],
) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await Promise.all(
      keys.map((k) =>
        prisma.somatomeQuestion.update({
          where: { id: k.questionId },
          data: { correctAnswer: k.correctAnswer },
        }),
      ),
    );
    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error updating Somatome keys:", error);
    return { success: false, error: "Gagal memperbarui kunci jawaban" };
  }
}

export async function deleteSomatomeQuestion(questionId: number) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.somatomeQuestion.delete({ where: { id: questionId } });
    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Somatome question:", error);
    return { success: false, error: "Failed to delete question" };
  }
}

// ─────────────────────────────────────────────────────────
// Submit flow: answer blind -> submit -> fill missing keys if any -> grade
// ─────────────────────────────────────────────────────────

export interface SomatomeMissingKey {
  questionId: number;
  mondai: string;
  number: number;
}

export interface SomatomeAnswerInput {
  questionId: number;
  userAnswer: number;
}

/**
 * Dry-run check: which of the submitted questions don't have a stored
 * answer key yet. No writes happen here.
 */
export async function prepareSomatomeSubmission(
  answers: SomatomeAnswerInput[],
): Promise<{ missingKeys: SomatomeMissingKey[] }> {
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.somatomeQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, mondai: true, number: true, correctAnswer: true },
  });

  const missingKeys = questions
    .filter((q) => q.correctAnswer == null)
    .map((q) => ({ questionId: q.id, mondai: q.mondai, number: q.number }));

  return { missingKeys };
}

export interface SomatomeAttemptResultItem {
  questionId: number;
  mondai: string;
  number: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

/**
 * Finalize a session: persist any newly-provided answer keys, grade every
 * submitted answer, and save the attempt as a history row.
 */
export async function finalizeSomatomeAttempt(
  bookId: number,
  day: number,
  answers: SomatomeAnswerInput[],
  keys: { questionId: number; correctAnswer: number }[],
) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // Persist newly-supplied keys
    if (keys.length > 0) {
      await Promise.all(
        keys.map((k) =>
          prisma.somatomeQuestion.update({
            where: { id: k.questionId },
            data: { correctAnswer: k.correctAnswer },
          }),
        ),
      );
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await prisma.somatomeQuestion.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, mondai: true, number: true, correctAnswer: true },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));

    const detail: SomatomeAttemptResultItem[] = [];
    for (const a of answers) {
      const q = byId.get(a.questionId);
      if (!q || q.correctAnswer == null) continue; // still missing a key — skip grading
      detail.push({
        questionId: a.questionId,
        mondai: q.mondai,
        number: q.number,
        userAnswer: a.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: a.userAnswer === q.correctAnswer,
      });
    }
    detail.sort((a, b) => a.number - b.number);

    const score = detail.filter((d) => d.isCorrect).length;
    const total = detail.length;

    const attempt = await prisma.somatomeAttempt.create({
      data: { userId: session.id, bookId, day, score, total, detail: detail as unknown as object },
    });

    await logActivity(session.id, "somatome_answer", `${bookId}-day${day}`);
    revalidatePath("/somatome");

    return { success: true, attemptId: attempt.id, score, total, detail };
  } catch (error) {
    console.error("Error finalizing Somatome attempt:", error);
    return { success: false, error: "Failed to save attempt" };
  }
}

// ─────────────────────────────────────────────────────────
// History
// ─────────────────────────────────────────────────────────

export interface SomatomeHistoryEntry {
  id: number;
  bookId: number;
  bookName: string;
  day: number;
  score: number;
  total: number;
  detail: SomatomeAttemptResultItem[];
  createdAt: string;
}

export async function getSomatomeHistory(bookId?: number): Promise<SomatomeHistoryEntry[]> {
  const session = await getSession();
  if (!session) return [];

  const attempts = await prisma.somatomeAttempt.findMany({
    where: { userId: session.id, ...(bookId ? { bookId } : {}) },
    orderBy: { createdAt: "desc" },
    include: { book: { select: { name: true } } },
    take: 100,
  });

  return attempts.map((a) => ({
    id: a.id,
    bookId: a.bookId,
    bookName: a.book.name,
    day: a.day,
    score: a.score,
    total: a.total,
    detail: a.detail as unknown as SomatomeAttemptResultItem[],
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function resetAllSomatomeData() {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.somatomeAttempt.deleteMany({});
    await prisma.somatomeQuestion.deleteMany({});
    revalidatePath("/somatome");
    return { success: true };
  } catch (error) {
    console.error("Error resetting Somatome test data:", error);
    return { success: false, error: "Failed to reset test data" };
  }
}


