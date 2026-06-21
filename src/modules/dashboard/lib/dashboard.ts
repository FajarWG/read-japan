/**
 * Server-only helpers untuk dashboard Home + /progress.
 *
 * Dipakai dari server components / server actions.
 * Tidak boleh dipakai dari client components.
 */

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

// ─────────────────────────────────────────────────────────
// Tipe data
// ─────────────────────────────────────────────────────────

export interface DashboardSummary {
  user: { id: number; username: string };
  streakDays: number;
  todayActivityCount: number;
  totalKanaClicks: number;
  totalKanaWrong: number;
  uniqueWordsLookedUp: number;
  lastStory?: {
    id: number;
    title: string;
    content: string;
    totalReads: number;
    lastReadAt: Date;
  } | null;
  ankiDueCount: number;
  bookmarksCount: number;
}

export interface ProgressStats {
  streakDays: number;
  totalKanaClicks: number;
  totalKanaWrong: number;
  uniqueWordsLookedUp: number;
  storiesRead: number;
  ankiReviewed: number;
  ankiDueNow: number;
  byDay: Array<{ date: string; count: number }>; // 7 hari terakhir
  byChapter: Array<{ chapter: number; count: number }>;
  weakWords: Array<{
    character: string;
    wrongCount: number;
    clickCount: number;
    info: { romaji: string } | null;
  }>;
  achievements: {
    unlocked: Array<{
      id: number;
      code: string;
      titleEn: string;
      titleId: string;
      descEn: string;
      descId: string;
      icon: string;
      unlockedAt: Date;
    }>;
    locked: Array<{
      id: number;
      code: string;
      titleEn: string;
      titleId: string;
      descEn: string;
      descId: string;
      icon: string;
    }>;
  };
}

// ─────────────────────────────────────────────────────────
// Streak — hitung hari berturut-turut dari ActivityLog
// ─────────────────────────────────────────────────────────

/**
 * Hitung streak dari ActivityLog. Mengembalikan jumlah hari berturut-turut
 * (termasuk hari ini jika ada aktivitas hari ini).
 *
 * Definisi "hari" = hari lokal dalam timezone server (UTC, sesuaikan bila perlu).
 */
export async function computeStreakDays(userId: number): Promise<number> {
  // Ambil distinct dates dari activity log, diurut desc.
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 365, // cukup untuk streak sampai 1 tahun
  });

  if (logs.length === 0) return 0;

  // Set of unique dates (YYYY-MM-DD UTC)
  const dateSet = new Set<string>();
  for (const log of logs) {
    const d = log.createdAt;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    dateSet.add(key);
  }

  const dates = Array.from(dateSet).sort().reverse(); // desc

  // Streak harus dimulai dari hari ini atau kemarin
  const today = new Date();
  const todayKey = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayKey = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;

  let cursor: Date;
  if (dateSet.has(todayKey)) {
    cursor = new Date(today);
  } else if (dateSet.has(yesterdayKey)) {
    cursor = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}-${String(cursor.getUTCDate()).padStart(2, "0")}`;
    if (dateSet.has(key)) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ─────────────────────────────────────────────────────────
// Dashboard summary untuk Home (/)
// ─────────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const session = await getSession();
  if (!session) return null;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [
    streakDays,
    kanaAgg,
    lastStoryLog,
    ankiDue,
    bookmarksCount,
    uniqueWords,
    todayActivityCount,
  ] = await Promise.all([
    computeStreakDays(session.id),
    prisma.learningProgress.aggregate({
      where: { userId: session.id },
      _sum: { clickCount: true, wrongCount: true },
    }),
    prisma.activityLog.findFirst({
      where: { userId: session.id, type: "story_read" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ankiProgress.count({
      where: { userId: session.id, dueDate: { lte: new Date() } },
    }),
    prisma.bookmark.count({ where: { userId: session.id } }),
    prisma.learningProgress.count({
      where: { userId: session.id, clickCount: { gt: 0 } },
    }),
    prisma.activityLog.count({
      where: { userId: session.id, createdAt: { gte: todayStart } },
    }),
  ]);

  // Last story detail
  let lastStory: DashboardSummary["lastStory"] = null;
  if (lastStoryLog?.refId) {
    const storyId = Number(lastStoryLog.refId);
    if (!Number.isNaN(storyId)) {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        select: {
          id: true,
          title: true,
          content: true,
          totalReads: true,
        },
      });
      if (story) {
        lastStory = { ...story, lastReadAt: lastStoryLog.createdAt };
      }
    }
  }

  return {
    user: { id: session.id, username: session.username },
    streakDays,
    todayActivityCount,
    totalKanaClicks: kanaAgg._sum.clickCount ?? 0,
    totalKanaWrong: kanaAgg._sum.wrongCount ?? 0,
    uniqueWordsLookedUp: uniqueWords,
    lastStory,
    ankiDueCount: ankiDue,
    bookmarksCount,
  };
}

// ─────────────────────────────────────────────────────────
// Full progress stats untuk /progress
// ─────────────────────────────────────────────────────────

export async function getProgressStats(): Promise<ProgressStats | null> {
  const session = await getSession();
  if (!session) return null;

  const [streakDays, kanaAgg, storyReadCount, ankiAgg, dueNow] =
    await Promise.all([
      computeStreakDays(session.id),
      prisma.learningProgress.aggregate({
        where: { userId: session.id },
        _sum: { clickCount: true, wrongCount: true },
      }),
      prisma.activityLog.count({
        where: { userId: session.id, type: "story_read" },
      }),
      prisma.ankiProgress.count({ where: { userId: session.id } }),
      prisma.ankiProgress.count({
        where: { userId: session.id, dueDate: { lte: new Date() } },
      }),
    ]);

  // By day — 7 hari terakhir, group by date
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const recentLogs = await prisma.activityLog.findMany({
    where: { userId: session.id, createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  const dayCounts = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setUTCDate(d.getUTCDate() + i);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    dayCounts.set(key, 0);
  }
  for (const log of recentLogs) {
    const d = log.createdAt;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    if (dayCounts.has(key)) dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }
  const byDay = Array.from(dayCounts.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // By chapter — ambil dari AnkiProgress per chapter
  const chapterGroups = await prisma.ankiProgress.groupBy({
    by: ["chapter"],
    where: { userId: session.id },
    _count: { _all: true },
  });
  const byChapter = chapterGroups
    .map((g) => ({
      chapter: Number(g.chapter.replace(/\D/g, "")) || 0,
      count: g._count._all,
    }))
    .filter((g) => g.chapter > 0)
    .sort((a, b) => a.chapter - b.chapter);

  // Weak words — top wrongCount, exclude kotoba: prefix
  const weakRecords = await prisma.learningProgress.findMany({
    where: {
      userId: session.id,
      wrongCount: { gt: 0 },
      // exclude kotoba: prefix (those are vocab, not kana)
      NOT: { character: { startsWith: "kotoba:" } },
    },
    orderBy: [{ wrongCount: "desc" }, { clickCount: "desc" }],
    take: 20,
  });

  // Lazy import untuk hindari circular — kanaMap adalah pure module
  const { kanaMap } = await import("@/src/modules/kana/lib/kana-map");
  const weakWords = weakRecords.map((r) => ({
    character: r.character,
    wrongCount: r.wrongCount,
    clickCount: r.clickCount,
    info: kanaMap[r.character]
      ? { romaji: kanaMap[r.character].romaji }
      : null,
  }));

  // Achievements
  const [allAchievements, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { id: "asc" } }),
    prisma.userAchievement.findMany({
      where: { userId: session.id },
      include: { achievement: true },
    }),
  ]);

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
  const achievements = {
    unlocked: unlocked.map((u) => ({
      id: u.achievement.id,
      code: u.achievement.code,
      titleEn: u.achievement.titleEn,
      titleId: u.achievement.titleId,
      descEn: u.achievement.descEn,
      descId: u.achievement.descId,
      icon: u.achievement.icon,
      unlockedAt: u.unlockedAt,
    })),
    locked: allAchievements
      .filter((a) => !unlockedIds.has(a.id))
      .map((a) => ({
        id: a.id,
        code: a.code,
        titleEn: a.titleEn,
        titleId: a.titleId,
        descEn: a.descEn,
        descId: a.descId,
        icon: a.icon,
      })),
  };

  return {
    streakDays,
    totalKanaClicks: kanaAgg._sum.clickCount ?? 0,
    totalKanaWrong: kanaAgg._sum.wrongCount ?? 0,
    uniqueWordsLookedUp: await prisma.learningProgress.count({
      where: { userId: session.id, clickCount: { gt: 0 } },
    }),
    storiesRead: storyReadCount,
    ankiReviewed: ankiAgg,
    ankiDueNow: dueNow,
    byDay,
    byChapter,
    weakWords,
    achievements,
  };
}
