"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import type { Prisma } from "@/app/generated/prisma/client";
import {
  buildFocusedKakouPrompt,
  buildKatsuyouPracticePrompt,
  findFirstIncompleteBunpouPattern,
  hydrateKakouPrompt,
} from "@/src/modules/kakou/data/reminders";
import {
  buildPhotoReviewPrompt,
  parseKakouFeedbackJson,
} from "@/src/modules/kakou/data/reviewPrompts";
import { getBunpouProgress } from "@/src/modules/bunpou/actions/bunpouActions";
import { CONJUGATION_FORMS } from "@/src/modules/katsuyou/data/conjugationForms";
import { mockVerbs } from "@/src/modules/katsuyou/data/verbs";
import { applySm2, ratingFromScore, type Sm2Rating } from "@/src/modules/katsuyou/lib/sm2";
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
import {
  AllModelsExhaustedError,
  callGeminiVision,
  RateLimitError,
} from "@/src/shared/lib/gemini-limiter";

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

function readFeedbackJson(value: unknown) {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.perPrompt)) {
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

const SESSION_ITEM_COUNTS: Record<KakouDuration, number> = { 5: 2, 10: 3, 20: 5 };

const JLPT_RANK: Record<string, number> = { N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 };

/** The "hardest" (lowest-rank) level among a session's prompts, for display. */
function sessionLevelFromPrompts(prompts: KakouPrompt[]): KakouLevel {
  let best: KakouLevel = "N5";
  let bestRank = JLPT_RANK.N5;
  for (const prompt of prompts) {
    const rank = JLPT_RANK[prompt.level] ?? JLPT_RANK.N5;
    if (rank < bestRank) {
      best = prompt.level;
      bestRank = rank;
    }
  }
  return best;
}

/**
 * Auto-sequenced session: due Katsuyou reviews first (they decay), then
 * alternates the next not-yet-started Katsuyou form and the next incomplete
 * Bunpou pattern to fill the remaining slots. Replaces the old random static
 * prompt bank + "sprinkle one due item" heuristic — every prompt this
 * produces has a reliable `source` (and Katsuyou prompts a `verbId`), so AI
 * review results can always be routed back to the right SRS card / pattern.
 */
async function buildSequentialSession(
  userId: number,
  durationMinutes: KakouDuration,
): Promise<KakouPrompt[]> {
  const itemCount = SESSION_ITEM_COUNTS[durationMinutes];
  const now = new Date();

  const [dueCards, practicedFormRows, bunpouCompletedIds] = await Promise.all([
    prisma.katsuyouReviewCard.findMany({
      where: { userId, nextReview: { lte: now } },
      orderBy: { nextReview: "asc" },
      take: itemCount,
    }),
    prisma.katsuyouReviewCard.findMany({
      where: { userId },
      select: { conjugationForm: true },
      distinct: ["conjugationForm"],
    }),
    getBunpouProgress(),
  ]);

  const practicedFormKeys = new Set(practicedFormRows.map((row) => row.conjugationForm));
  const remainingForms = CONJUGATION_FORMS.filter((form) => !practicedFormKeys.has(form.key));

  const prompts: KakouPrompt[] = [];
  for (const card of dueCards) {
    const prompt = buildKatsuyouPracticePrompt(card.conjugationForm, card.verbId);
    if (prompt) prompts.push(prompt);
  }

  let nextNewFormIndex = 0;
  const pickedBunpouIds = [...bunpouCompletedIds];
  let turn: "katsuyou" | "bunpou" = "katsuyou";
  let stuckRounds = 0;

  while (prompts.length < itemCount && stuckRounds < 2) {
    const before = prompts.length;

    if (turn === "katsuyou" && nextNewFormIndex < remainingForms.length) {
      const form = remainingForms[nextNewFormIndex];
      nextNewFormIndex += 1;
      const verb = mockVerbs[Math.floor(Math.random() * mockVerbs.length)];
      const prompt = buildKatsuyouPracticePrompt(form.key, verb.id);
      if (prompt) prompts.push(prompt);
    } else if (turn === "bunpou") {
      const patternId = findFirstIncompleteBunpouPattern(pickedBunpouIds);
      if (patternId) {
        const prompt = buildFocusedKakouPrompt("BUNPOU", patternId);
        if (prompt) {
          prompts.push(prompt);
          pickedBunpouIds.push(patternId);
        }
      }
    }

    stuckRounds = prompts.length === before ? stuckRounds + 1 : 0;
    turn = turn === "katsuyou" ? "bunpou" : "katsuyou";
  }

  return prompts;
}

export async function createKakouSession(input: {
  durationMinutes: number;
  sourceType?: string;
  sourceId?: string;
}) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };

  if (!isDuration(input.durationMinutes)) {
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

  const focusedPrompt =
    isSourceType(input.sourceType) && input.sourceId
      ? buildFocusedKakouPrompt(input.sourceType, input.sourceId)
      : null;
  if ((input.sourceType || input.sourceId) && !focusedPrompt) {
    return { success: false as const, error: "Library material was not found" };
  }

  const prompts = (
    focusedPrompt
      ? [focusedPrompt]
      : await buildSequentialSession(auth.id, input.durationMinutes)
  ).map(hydrateKakouPrompt);

  if (prompts.length === 0) {
    return {
      success: false as const,
      error: "You're all caught up — nothing due in Katsuyou or Bunpou right now.",
    };
  }

  const created = await prisma.kakouSession.create({
    data: {
      userId: auth.id,
      mode: "PRACTICE",
      level: sessionLevelFromPrompts(prompts),
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

  if (!target.feedbackJson) {
    const prompts = readPrompts(target.promptSnapshot).map(hydrateKakouPrompt);
    await applyCoarseDifficultyToProgress(auth.id, prompts, difficulty);
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

/**
 * Route a rating (from AI review score or self-rated session difficulty)
 * back to whatever the prompt's source was: SM-2 update on the matching
 * KatsuyouReviewCard (find-or-create, since a due queue only creates cards on
 * first practice), or a completed toggle on BunpouProgress.
 */
async function applyRatingToSource(
  userId: number,
  source: KakouPrompt["source"],
  rating: Sm2Rating,
  bunpouCompleted: boolean,
): Promise<void> {
  if (!source) return;

  if (source.type === "KATSUYOU" && source.verbId) {
    const card = await prisma.katsuyouReviewCard.upsert({
      where: {
        userId_verbId_conjugationForm: {
          userId,
          verbId: source.verbId,
          conjugationForm: source.id,
        },
      },
      create: { userId, verbId: source.verbId, conjugationForm: source.id },
      update: {},
    });
    const next = applySm2(card, rating);
    await prisma.katsuyouReviewCard.update({
      where: { id: card.id },
      data: { ...next, lastReviewed: new Date() },
    });
  } else if (source.type === "BUNPOU") {
    await prisma.bunpouProgress.upsert({
      where: { userId_patternId: { userId, patternId: source.id } },
      create: { userId, patternId: source.id, completed: bunpouCompleted },
      update: { completed: bunpouCompleted },
    });
  }
}

async function applyKakouReviewToProgress(
  userId: number,
  prompts: KakouPrompt[],
  feedback: import("../data/types").KakouFeedback,
): Promise<void> {
  for (const entry of feedback.perPrompt) {
    const prompt = prompts[entry.promptIndex - 1];
    if (!prompt) continue;
    await applyRatingToSource(userId, prompt.source, ratingFromScore(entry.score), entry.score >= 60);
  }
}

/**
 * Coarser fallback for sessions finished without ever running AI review:
 * the self-rated Easy/Okay/Difficult applies uniformly to every prompt's
 * source. Only called when a session has no feedbackJson yet — if AI review
 * is submitted for the same session later, that applies its own (more
 * precise) per-prompt update on top.
 */
async function applyCoarseDifficultyToProgress(
  userId: number,
  prompts: KakouPrompt[],
  difficulty: KakouDifficulty,
): Promise<void> {
  const rating: Sm2Rating = difficulty === "EASY" ? "easy" : difficulty === "OKAY" ? "good" : "hard";
  const bunpouCompleted = difficulty !== "DIFFICULT";
  for (const prompt of prompts) {
    await applyRatingToSource(userId, prompt.source, rating, bunpouCompleted);
  }
}

export async function saveKakouAiFeedback(input: {
  sessionId: number;
  feedbackJson: import("../data/types").KakouFeedback;
  userWriting?: string;
}) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (
    !Number.isInteger(input.sessionId) ||
    !Array.isArray(input.feedbackJson?.perPrompt) ||
    input.feedbackJson.perPrompt.length === 0
  ) {
    return { success: false as const, error: "Invalid feedback data" };
  }

  const record = await prisma.kakouSession.findFirst({
    where: { id: input.sessionId, userId: auth.id },
  });
  if (!record) return { success: false as const, error: "Session not found" };

  const averageScore =
    input.feedbackJson.perPrompt.reduce((sum, item) => sum + item.score, 0) /
    input.feedbackJson.perPrompt.length;
  const boundedScore = Math.max(0, Math.min(100, Math.round(averageScore)));

  await prisma.kakouSession.updateMany({
    where: { id: input.sessionId, userId: auth.id },
    data: {
      score: boundedScore,
      feedbackJson: input.feedbackJson as unknown as Prisma.InputJsonValue,
      ...(input.userWriting ? { userWriting: input.userWriting } : {}),
    },
  });

  const prompts = readPrompts(record.promptSnapshot).map(hydrateKakouPrompt);
  await applyKakouReviewToProgress(auth.id, prompts, input.feedbackJson);

  revalidatePath("/kakou");
  return { success: true as const, overview: await loadOverview(auth.id) };
}

const MAX_PHOTO_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * In-app AI review from an uploaded photo of handwriting. Normalizes the
 * upload (any format incl. HEIC, arbitrary size) to a resized JPEG server-side
 * via sharp, then sends it to Gemini vision. On rate-limit or any failure,
 * signals fallbackToManual so the client can fall back to the existing
 * copy-paste-into-external-AI flow instead of erroring out.
 */
export async function submitKakouPhotoReview(sessionId: number, formData: FormData) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };

  const file = formData.get("photo");
  if (!(file instanceof File)) {
    return { success: false as const, error: "No photo provided" };
  }
  if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
    return { success: false as const, error: "Photo is too large (max 8MB)." };
  }

  const record = await prisma.kakouSession.findFirst({
    where: { id: sessionId, userId: auth.id },
    include: { studyTimers: true },
  });
  if (!record) return { success: false as const, error: "Session not found" };
  const sessionView = toSessionView(record);

  let image: { base64: string; mimeType: string };
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const jpeg = await sharp(buffer)
      .rotate() // auto-orient from EXIF before stripping it
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
    image = { base64: jpeg.toString("base64"), mimeType: "image/jpeg" };
  } catch {
    return {
      success: false as const,
      error: "Couldn't read that photo. Try a different file, or use the manual flow below.",
      fallbackToManual: true as const,
    };
  }

  try {
    const prompt = buildPhotoReviewPrompt(sessionView);
    const result = await callGeminiVision(prompt, image);
    const parsed = parseKakouFeedbackJson(result.text);
    if (!parsed) {
      return {
        success: false as const,
        error: "AI response wasn't valid JSON. Try again, or use the manual flow below.",
        fallbackToManual: true as const,
      };
    }
    return saveKakouAiFeedback({ sessionId, feedbackJson: parsed });
  } catch (err) {
    if (err instanceof RateLimitError || err instanceof AllModelsExhaustedError) {
      return {
        success: false as const,
        error: "In-app AI review is at capacity right now (free tier limit). Use the manual copy-paste flow below instead.",
        fallbackToManual: true as const,
      };
    }
    return {
      success: false as const,
      error: "In-app AI review failed. Use the manual copy-paste flow below instead.",
      fallbackToManual: true as const,
    };
  }
}
