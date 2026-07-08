/**
 * Server-only helpers for the Home dashboard (`/`).
 *
 * After the app slim-down the dashboard reflects only the surviving features:
 * Anki, Katsuyou, Bunpou and Prep. (Kotoba lives in localStorage, so it isn't
 * summarised here.) Used from server components only — never from the client.
 */

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface DashboardSummary {
  user: { id: number; username: string };
  streakDays: number;
  todayActivityCount: number;
  ankiDueCount: number;
}

export interface ProgressStats {
  streakDays: number;
  todayActivityCount: number;
  byDay: Array<{ date: string; count: number }>; // last 7 days
  anki: { total: number; dueNow: number };
  katsuyou: { cards: number; dueNow: number; lessonsCompleted: number };
  bunpou: { patternsCompleted: number };
  prep: { chaptersOpened: number };
}

// ─────────────────────────────────────────────────────────
// Date helpers (UTC day-keys)
// ─────────────────────────────────────────────────────────

function dayKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────
// Streak — consecutive days with any activity
// ─────────────────────────────────────────────────────────

export async function computeStreakDays(userId: number): Promise<number> {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 365,
  });

  if (logs.length === 0) return 0;

  const dateSet = new Set<string>(logs.map((l) => dayKey(l.createdAt)));

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  let cursor: Date;
  if (dateSet.has(dayKey(today))) {
    cursor = new Date(today);
  } else if (dateSet.has(dayKey(yesterday))) {
    cursor = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;
  while (dateSet.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

// ─────────────────────────────────────────────────────────
// Compact summary for the Home hero
// ─────────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const session = await getSession();
  if (!session) return null;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [streakDays, ankiDueCount, todayActivityCount] = await Promise.all([
    computeStreakDays(session.id),
    prisma.ankiProgress.count({
      where: { userId: session.id, dueDate: { lte: new Date() } },
    }),
    prisma.activityLog.count({
      where: { userId: session.id, createdAt: { gte: todayStart } },
    }),
  ]);

  return {
    user: { id: session.id, username: session.username },
    streakDays,
    todayActivityCount,
    ankiDueCount,
  };
}

// ─────────────────────────────────────────────────────────
// Full stats for the dashboard body
// ─────────────────────────────────────────────────────────

export async function getProgressStats(): Promise<ProgressStats | null> {
  const session = await getSession();
  if (!session) return null;

  const now = new Date();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const [
    streakDays,
    todayActivityCount,
    recentLogs,
    ankiTotal,
    ankiDue,
    katsuyouCards,
    katsuyouDue,
    katsuyouLessons,
    bunpouPatterns,
    prepLogs,
  ] = await Promise.all([
    computeStreakDays(session.id),
    prisma.activityLog.count({
      where: { userId: session.id, createdAt: { gte: todayStart } },
    }),
    prisma.activityLog.findMany({
      where: { userId: session.id, createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.ankiProgress.count({ where: { userId: session.id } }),
    prisma.ankiProgress.count({
      where: { userId: session.id, dueDate: { lte: now } },
    }),
    prisma.katsuyouReviewCard.count({ where: { userId: session.id } }),
    prisma.katsuyouReviewCard.count({
      where: { userId: session.id, nextReview: { lte: now } },
    }),
    prisma.katsuyouLessonProgress.count({
      where: { userId: session.id, completed: true },
    }),
    prisma.bunpouProgress.count({
      where: { userId: session.id, completed: true },
    }),
    prisma.activityLog.findMany({
      where: { userId: session.id, type: "prep_open" },
      select: { refId: true },
    }),
  ]);

  // 7-day activity chart
  const dayCounts = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setUTCDate(d.getUTCDate() + i);
    dayCounts.set(dayKey(d), 0);
  }
  for (const log of recentLogs) {
    const key = dayKey(log.createdAt);
    if (dayCounts.has(key)) dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }
  const byDay = Array.from(dayCounts.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Distinct chapters where any Prep point was opened (refId = "chapter-point")
  const chaptersOpened = new Set<number>();
  for (const log of prepLogs) {
    const chapter = Number(log.refId?.split("-")[0]);
    if (!Number.isNaN(chapter)) chaptersOpened.add(chapter);
  }

  return {
    streakDays,
    todayActivityCount,
    byDay,
    anki: { total: ankiTotal, dueNow: ankiDue },
    katsuyou: {
      cards: katsuyouCards,
      dueNow: katsuyouDue,
      lessonsCompleted: katsuyouLessons,
    },
    bunpou: { patternsCompleted: bunpouPatterns },
    prep: { chaptersOpened: chaptersOpened.size },
  };
}
