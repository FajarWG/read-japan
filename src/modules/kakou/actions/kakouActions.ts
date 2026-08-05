"use server";

import { revalidatePath } from "next/cache";

import type { Prisma } from "@/app/generated/prisma/client";
import { KAKOU_PROMPTS } from "@/src/modules/kakou/data/prompts";
import {
  buildFocusedKakouPrompt,
  findFirstIncompleteBunpouPattern,
  hydrateKakouPrompt,
} from "@/src/modules/kakou/data/reminders";
import { getKatsuyouStats } from "@/src/modules/katsuyou/actions/katsuyouActions";
import { getBunpouProgress } from "@/src/modules/bunpou/actions/bunpouActions";
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
  type KakouSourceType,
} from "@/src/modules/kakou/data/types";
import {
  elapsedSeconds,
  finishTimerForKakou,
  getStudyTimerOverviewForUser,
} from "@/src/modules/study-timer/lib/timer";
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
  score?: number | null;
  feedbackJson?: unknown;
  userWriting?: string | null;
  startedAt: Date;
  completedAt: Date | null;
  studyTimers?: Array<{
    accumulatedSeconds: number;
    status: string;
    lastStartedAt: Date | null;
  }>;
};

function isMode(value: string): value is KakouMode {
  return (KAKOU_MODES as readonly string[]).includes(value);
}

function isLevel(value: string): value is KakouLevel {
  return (KAKOU_LEVELS as readonly string[]).includes(value);
}

function isSourceType(value: string | undefined): value is KakouSourceType {
  return value === "BUNPOU" || value === "KATSUYOU";
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

function readFeedbackJson(value: unknown) {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.score !== "number" || !Array.isArray(candidate.sentences)) {
    return null;
  }
  return candidate as unknown as import("../data/types").KakouFeedback;
}

function toSessionView(record: SessionRecord): KakouSessionView {
  return {
    id: record.id,
    mode: isMode(record.mode) ? record.mode : "DAILY_MIX",
    level: isLevel(record.level) ? record.level : "N5",
    durationMinutes: record.durationMinutes,
    prompts: readPrompts(record.promptSnapshot).map(hydrateKakouPrompt),
    progress: record.progress,
    status:
      record.status === "COMPLETED" || record.status === "ABANDONED"
        ? record.status
        : "ACTIVE",
    difficulty:
      record.difficulty && isDifficulty(record.difficulty)
        ? record.difficulty
        : null,
    score: typeof record.score === "number" ? record.score : null,
    feedbackJson: readFeedbackJson(record.feedbackJson),
    userWriting: typeof record.userWriting === "string" ? record.userWriting : null,
    startedAt: record.startedAt.toISOString(),
    completedAt: record.completedAt?.toISOString() ?? null,
    actualSeconds: record.studyTimers?.reduce(
      (total, timer) => total + elapsedSeconds({
        id: 0,
        kakouSessionId: record.id,
        source: "KAKOU",
        accumulatedSeconds: timer.accumulatedSeconds,
        status: timer.status,
        lastStartedAt: timer.lastStartedAt,
        startedAt: record.startedAt,
        endedAt: record.completedAt,
      }),
      0,
    ) ?? 0,
  };
}

async function loadOverview(userId: number): Promise<KakouOverview> {
  const [activeSession, history, completedSessions, timer] = await Promise.all([
    prisma.kakouSession.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { studyTimers: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.kakouSession.findMany({
      where: { userId, status: "COMPLETED" },
      include: { studyTimers: true },
      orderBy: { completedAt: "desc" },
      take: 8,
    }),
    prisma.kakouSession.count({
      where: { userId, status: "COMPLETED" },
    }),
    getStudyTimerOverviewForUser(userId),
  ]);

  return {
    activeSession: activeSession ? toSessionView(activeSession) : null,
    history: history.map(toSessionView),
    timer,
    stats: {
      completedSessions,
      todaySeconds: timer.stats.todaySeconds,
      weekSeconds: timer.stats.weekSeconds,
      totalSeconds: timer.stats.totalSeconds,
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
  sourceType?: string;
  sourceId?: string;
}) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };

  if (!isMode(input.mode) || !isLevel(input.level) || !isDuration(input.durationMinutes)) {
    return { success: false as const, error: "Invalid session settings" };
  }
  if (
    (input.sourceType || input.sourceId) &&
    (!isSourceType(input.sourceType) || !input.sourceId)
  ) {
    return { success: false as const, error: "Invalid library material" };
  }

  const current = await prisma.kakouSession.findFirst({
    where: { userId: auth.id, status: "ACTIVE" },
    include: { studyTimers: true },
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

  const focusedPrompt =
    isSourceType(input.sourceType) && input.sourceId
      ? buildFocusedKakouPrompt(input.sourceType, input.sourceId)
      : null;
  if ((input.sourceType || input.sourceId) && !focusedPrompt) {
    return { success: false as const, error: "Library material was not found" };
  }

  const effectiveMode: KakouMode = focusedPrompt
    ? focusedPrompt.kind === "GRAMMAR"
      ? "GRAMMAR_CHALLENGE"
      : "CONJUGATION_DRILL"
    : input.mode;
  const effectiveLevel = focusedPrompt?.level ?? input.level;

  const basePrompts = focusedPrompt
    ? [focusedPrompt]
    : pickPrompts(effectiveLevel, effectiveMode, input.durationMinutes, recentIds);

  // Heuristic: sprinkle one real due/weak item from Katsuyou or Bunpou into Daily
  // Mix sessions when available, instead of only ever picking from the static
  // prompt bank. Not full SRS-driven prioritization — that's a later milestone.
  let dueMaterialPrompt: KakouPrompt | null = null;
  if (!focusedPrompt && effectiveMode === "DAILY_MIX") {
    const [katsuyouStats, bunpouCompletedIds] = await Promise.all([
      getKatsuyouStats(),
      getBunpouProgress(),
    ]);
    const dueFormKey = Object.keys(katsuyouStats.dueReviewsByForm)[0];
    dueMaterialPrompt = dueFormKey
      ? buildFocusedKakouPrompt("KATSUYOU", dueFormKey)
      : (() => {
          const incompletePatternId = findFirstIncompleteBunpouPattern(bunpouCompletedIds);
          return incompletePatternId ? buildFocusedKakouPrompt("BUNPOU", incompletePatternId) : null;
        })();
  }

  const prompts = (
    dueMaterialPrompt && basePrompts.length > 0
      ? [dueMaterialPrompt, ...basePrompts.slice(1)]
      : dueMaterialPrompt
        ? [dueMaterialPrompt]
        : basePrompts
  ).map(hydrateKakouPrompt);

  if (prompts.length === 0) {
    return { success: false as const, error: "No prompts available for these settings" };
  }

  const created = await prisma.kakouSession.create({
    data: {
      userId: auth.id,
      mode: effectiveMode,
      level: effectiveLevel,
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

  await finishTimerForKakou(auth.id, target.id);
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

  await finishTimerForKakou(auth.id, sessionId);
  revalidatePath("/kakou");
  return { success: true as const, overview: await loadOverview(auth.id) };
}

export async function saveKakouAiFeedback(input: {
  sessionId: number;
  score: number;
  feedbackJson: unknown;
  userWriting?: string;
}) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(input.sessionId) || typeof input.score !== "number") {
    return { success: false as const, error: "Invalid feedback data" };
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(input.score)));

  await prisma.kakouSession.updateMany({
    where: { id: input.sessionId, userId: auth.id },
    data: {
      score: boundedScore,
      feedbackJson: input.feedbackJson as Prisma.InputJsonValue,
      ...(input.userWriting ? { userWriting: input.userWriting } : {}),
    },
  });

  revalidatePath("/kakou");
  return { success: true as const, overview: await loadOverview(auth.id) };
}
