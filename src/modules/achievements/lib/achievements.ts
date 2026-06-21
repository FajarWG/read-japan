/**
 * Achievement engine (Phase 6).
 *
 * Panggil `checkAchievements(userId, context)` setelah event pembelajaran
 * untuk melihat apakah ada achievement baru yang terbuka. Return list
 * achievement yang baru di-unlock (kosong jika tidak ada).
 */

import { prisma } from "@/src/shared/lib/db";

export interface UnlockedAchievement {
  id: number;
  code: string;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  icon: string;
}

interface MetricContext {
  type?: "story_read" | "anki_review" | "kana_practice" | "kanji_study" | "jlpt_mock" | "login" | "prep_open" | "chat_message" | "bookmark_created" | "sentence_mined" | "perfect_read";
  storyId?: number;
  rating?: number;
  correct?: boolean;
  level?: string;
  score?: number;
  total?: number;
}

/**
 * Cek & unlock achievement untuk user berdasarkan metric values.
 *
 * @param userId
 * @param context Optional context untuk early-exit (e.g. hanya cek 'streak_days' setelah login)
 * @returns Array of newly unlocked achievements
 */
export async function checkAchievements(
  userId: number,
  _context?: MetricContext,
): Promise<UnlockedAchievement[]> {
  // Compute current metric values
  const [
    storiesRead,
    perfectReadCount,
    vocabUniqueCount,
    kanaMasteredCount,
    bookmarkCount,
    minedCount,
    ankiReviewsCount,
    jlptAttempts,
  ] = await Promise.all([
    prisma.activityLog.count({
      where: { userId, type: "story_read" },
    }),
    prisma.activityLog.count({
      where: { userId, type: "perfect_read" },
    }),
    prisma.learningProgress.count({
      where: { userId, clickCount: { gt: 0 } },
    }),
    prisma.kanaProgress.count({
      where: { userId, repetitions: { gte: 3 }, interval: { gte: 21 } },
    }),
    prisma.bookmark.count({ where: { userId } }),
    prisma.activityLog.count({
      where: { userId, type: "sentence_mined" },
    }),
    prisma.activityLog.count({
      where: { userId, type: "anki_review" },
    }),
    prisma.jLPTAttempt.findMany({
      where: { userId },
      select: { level: true, score: true, total: true },
    }),
  ]);

  // Streak
  const streakDays = await computeStreak(userId);

  // Compose metric map
  const metrics: Record<string, number> = {
    stories_read: storiesRead,
    streak_days: streakDays,
    unique_words: vocabUniqueCount,
    kana_mastered: kanaMasteredCount,
    perfect_reads: perfectReadCount,
    bookmarks: bookmarkCount,
    sentences_mined: minedCount,
    anki_reviews: ankiReviewsCount,
    jlpt_n5_pct: bestJlptPct(jlptAttempts, "N5"),
  };

  // Load already-unlocked codes
  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  const unlockedCodes = new Set(existing.map((u) => u.achievement.code));

  // Evaluate each achievement
  const all = await prisma.achievement.findMany();
  const newlyUnlocked: UnlockedAchievement[] = [];

  for (const a of all) {
    if (unlockedCodes.has(a.code)) continue;
    if (!a.metric || a.threshold == null) continue;
    const value = metrics[a.metric] ?? 0;
    if (value >= a.threshold) {
      try {
        await prisma.userAchievement.create({
          data: { userId, achievementId: a.id },
        });
        newlyUnlocked.push({
          id: a.id,
          code: a.code,
          titleEn: a.titleEn,
          titleId: a.titleId,
          descEn: a.descEn,
          descId: a.descId,
          icon: a.icon,
        });
      } catch {
        // Unique constraint hit — already unlocked. Ignore.
      }
    }
  }

  return newlyUnlocked;
}

async function computeStreak(userId: number): Promise<number> {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 365,
  });
  if (logs.length === 0) return 0;
  const dateSet = new Set<string>();
  for (const log of logs) {
    const d = log.createdAt;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    dateSet.add(key);
  }
  const today = new Date();
  const todayKey = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayKey = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;
  let cursor: Date;
  if (dateSet.has(todayKey)) cursor = new Date(today);
  else if (dateSet.has(yesterdayKey)) cursor = new Date(yesterday);
  else return 0;
  let streak = 0;
  while (true) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}-${String(cursor.getUTCDate()).padStart(2, "0")}`;
    if (dateSet.has(key)) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else break;
  }
  return streak;
}

function bestJlptPct(
  attempts: Array<{ level: string; score: number; total: number }>,
  level: string,
): number {
  const filtered = attempts.filter((a) => a.level === level && a.total > 0);
  if (filtered.length === 0) return 0;
  return Math.round(
    Math.max(...filtered.map((a) => (a.score / a.total) * 100)),
  );
}

/**
 * Log activity dan cek achievements dalam satu call.
 * Return newly unlocked (untuk toast notification).
 */
export async function logActivityAndCheck(
  userId: number,
  type: MetricContext["type"],
  refId?: string,
  metadata?: Record<string, unknown>,
): Promise<UnlockedAchievement[]> {
  await prisma.activityLog.create({
    data: {
      userId,
      type: type ?? "login",
      refId,
      metadata: metadata ? (metadata as Record<string, string | number | boolean | null>) : undefined,
    },
  });
  return checkAchievements(userId, { type });
}
