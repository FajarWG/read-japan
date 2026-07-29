"use server";

import { revalidatePath } from "next/cache";

import type { Prisma } from "@/app/generated/prisma/client";
import { KAKOU_PROMPTS } from "@/src/modules/kakou/data/prompts";
import {
  KAKOU_DIFFICULTIES,
  KAKOU_DURATIONS,
  KAKOU_LEVELS,
  KAKOU_MODES,
  type KakouDifficulty,
  type KakouDuration,
  type KakouLevel,
  type KakouMode,
  type KakouOverview,
  type KakouPrompt,
  type KakouPromptKind,
  type KakouSessionView,
} from "@/src/modules/kakou/data/types";
import { logActivity } from "@/src/shared/lib/activity";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

type SessionRecord = {
  id: number;
  mode: string;
  level: string;
  durationMinutes: number;
  promptSnapshot: unknown;
  progress: number;
  status: string;
  difficulty: string | null;
  startedAt: Date;
  completedAt: Date | null;
};

function isMode(value: string): value is KakouMode {
  return (KAKOU_MODES as readonly string[]).includes(value);
}

function isLevel(value: string): value is KakouLevel {
  return (KAKOU_LEVELS as readonly string[]).includes(value);
}

function isDuration(value: number): value is KakouDuration {
  return (KAKOU_DURATIONS as readonly number[]).includes(value);
}

function isDifficulty(value: string): value is KakouDifficulty {
  return (KAKOU_DIFFICULTIES as readonly string[]).includes(value);
}

function readPrompts(value: unknown): KakouPrompt[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is KakouPrompt => {
    if (typeof item !== "object" || item === null) return false;
    const candidate = item as Partial<KakouPrompt>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.kind === "string" &&
      typeof candidate.level === "string" &&
      typeof candidate.title === "string" &&
      typeof candidate.japanese === "string" &&
      typeof candidate.instruction === "string"
    );
  });
}

function readPromptIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toSessionView(record: SessionRecord): KakouSessionView {
  return {
    id: record.id,
    mode: isMode(record.mode) ? record.mode : "DAILY_MIX",
    level: isLevel(record.level) ? record.level : "N5",
    durationMinutes: record.durationMinutes,
    prompts: readPrompts(record.promptSnapshot),
    progress: record.progress,
    status:
      record.status === "COMPLETED" || record.status === "ABANDONED"
        ? record.status
        : "ACTIVE",
    difficulty:
      record.difficulty && isDifficulty(record.difficulty)
        ? record.difficulty
        : null,
    startedAt: record.startedAt.toISOString(),
    completedAt: record.completedAt?.toISOString() ?? null,
  };
}

async function loadOverview(userId: number): Promise<KakouOverview> {
  const weekStart = new Date();
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);
  weekStart.setUTCHours(0, 0, 0, 0);

  const [activeSession, history, completedSessions, totalMinutes, thisWeek] =
    await Promise.all([
      prisma.kakouSession.findFirst({
        where: { userId, status: "ACTIVE" },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.kakouSession.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 8,
      }),
      prisma.kakouSession.count({
        where: { userId, status: "COMPLETED" },
      }),
      prisma.kakouSession.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { durationMinutes: true },
      }),
      prisma.kakouSession.count({
        where: {
          userId,
          status: "COMPLETED",
          completedAt: { gte: weekStart },
        },
      }),
    ]);

  return {
    activeSession: activeSession ? toSessionView(activeSession) : null,
    history: history.map(toSessionView),
    stats: {
      completedSessions,
      totalMinutes: totalMinutes._sum.durationMinutes ?? 0,
      thisWeek,
    },
  };
}

export async function getKakouOverview(): Promise<KakouOverview | null> {
  const session = await getSession();
  if (!session) return null;
  return loadOverview(session.id);
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickPrompts(
  level: KakouLevel,
  mode: KakouMode,
  duration: KakouDuration,
  recentIds: Set<string>,
): KakouPrompt[] {
  const kindsByMode: Record<Exclude<KakouMode, "DAILY_MIX">, KakouPromptKind> = {
    GUIDED_JOURNAL: "JOURNAL",
    COPY_CHANGE_CREATE: "COPY_CHANGE_CREATE",
    GRAMMAR_CHALLENGE: "GRAMMAR",
    CONJUGATION_DRILL: "CONJUGATION",
  };

  const byLevel = KAKOU_PROMPTS.filter((item) => item.level === level);
  const available = (kind: KakouPromptKind) => {
    const matching = byLevel.filter((item) => item.kind === kind);
    const fresh = matching.filter((item) => !recentIds.has(item.id));
    return shuffled(fresh.length > 0 ? fresh : matching);
  };

  if (mode === "DAILY_MIX") {
    const kindOrder: KakouPromptKind[] = [
      "JOURNAL",
      "GRAMMAR",
      "SENTENCE_BUILDER",
      "CONJUGATION",
      "COPY_CHANGE_CREATE",
    ];
    const count = duration === 5 ? 2 : duration === 10 ? 3 : 5;
    return kindOrder.slice(0, count).flatMap((kind) => available(kind).slice(0, 1));
  }

  const count = duration === 5 ? 1 : duration === 10 ? 2 : 3;
  return available(kindsByMode[mode]).slice(0, count);
}

export async function createKakouSession(input: {
  mode: string;
  level: string;
  durationMinutes: number;
}) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };

  if (!isMode(input.mode) || !isLevel(input.level) || !isDuration(input.durationMinutes)) {
    return { success: false as const, error: "Invalid session settings" };
  }

  const current = await prisma.kakouSession.findFirst({
    where: { userId: auth.id, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
  });
  if (current) {
    return { success: true as const, session: toSessionView(current), resumed: true };
  }

  const recentSessions = await prisma.kakouSession.findMany({
    where: { userId: auth.id },
    select: { promptIds: true },
    orderBy: { startedAt: "desc" },
    take: 12,
  });
  const recentIds = new Set(
    recentSessions.flatMap((item) => readPromptIds(item.promptIds)),
  );
  const prompts = pickPrompts(
    input.level,
    input.mode,
    input.durationMinutes,
    recentIds,
  );

  if (prompts.length === 0) {
    return { success: false as const, error: "No prompts available for these settings" };
  }

  const created = await prisma.kakouSession.create({
    data: {
      userId: auth.id,
      mode: input.mode,
      level: input.level,
      durationMinutes: input.durationMinutes,
      promptIds: prompts.map((item) => item.id),
      promptSnapshot: prompts as unknown as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/kakou");
  return { success: true as const, session: toSessionView(created), resumed: false };
}

export async function saveKakouProgress(sessionId: number, progress: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(sessionId) || !Number.isInteger(progress) || progress < 0) {
    return { success: false as const, error: "Invalid progress" };
  }

  const target = await prisma.kakouSession.findFirst({
    where: { id: sessionId, userId: auth.id, status: "ACTIVE" },
  });
  if (!target) return { success: false as const, error: "Session not found" };

  const boundedProgress = Math.min(progress, readPrompts(target.promptSnapshot).length);
  const updated = await prisma.kakouSession.update({
    where: { id: target.id },
    data: { progress: boundedProgress },
  });

  revalidatePath("/kakou");
  return { success: true as const, session: toSessionView(updated) };
}

export async function completeKakouSession(
  sessionId: number,
  difficulty: string,
) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(sessionId) || !isDifficulty(difficulty)) {
    return { success: false as const, error: "Invalid completion data" };
  }

  const target = await prisma.kakouSession.findFirst({
    where: { id: sessionId, userId: auth.id, status: "ACTIVE" },
  });
  if (!target) return { success: false as const, error: "Session not found" };

  const promptCount = readPrompts(target.promptSnapshot).length;
  if (target.progress < promptCount) {
    return { success: false as const, error: "Complete every writing step first" };
  }

  const result = await prisma.kakouSession.updateMany({
    where: { id: target.id, userId: auth.id, status: "ACTIVE" },
    data: {
      status: "COMPLETED",
      difficulty,
      completedAt: new Date(),
    },
  });
  if (result.count === 0) {
    return { success: false as const, error: "Session was already completed" };
  }

  await logActivity(auth.id, "kakou_session", String(target.id));
  revalidatePath("/kakou");
  revalidatePath("/");
  return { success: true as const, overview: await loadOverview(auth.id) };
}

export async function abandonKakouSession(sessionId: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(sessionId)) {
    return { success: false as const, error: "Invalid session" };
  }

  const result = await prisma.kakouSession.updateMany({
    where: { id: sessionId, userId: auth.id, status: "ACTIVE" },
    data: { status: "ABANDONED" },
  });
  if (result.count === 0) {
    return { success: false as const, error: "Session not found" };
  }

  revalidatePath("/kakou");
  return { success: true as const, overview: await loadOverview(auth.id) };
}
