import { prisma } from "@/src/shared/lib/db";
import type {
  StudyTimerOverview,
  StudyTimerStatus,
  StudyTimerView,
} from "@/src/modules/study-timer/types";

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

type TimerRecord = {
  id: number;
  kakouSessionId: number | null;
  source: string;
  status: string;
  accumulatedSeconds: number;
  lastStartedAt: Date | null;
  startedAt: Date;
  endedAt: Date | null;
};

function timerStatus(value: string): StudyTimerStatus {
  if (value === "PAUSED" || value === "COMPLETED") return value;
  return "RUNNING";
}

export function elapsedSeconds(record: TimerRecord, now = new Date()): number {
  if (record.status !== "RUNNING" || !record.lastStartedAt) {
    return Math.max(0, record.accumulatedSeconds);
  }
  const runningSeconds = Math.max(
    0,
    Math.floor((now.getTime() - record.lastStartedAt.getTime()) / 1000),
  );
  return Math.max(0, record.accumulatedSeconds + runningSeconds);
}

export function toStudyTimerView(
  record: TimerRecord,
  now = new Date(),
): StudyTimerView {
  return {
    id: record.id,
    kakouSessionId: record.kakouSessionId,
    source: record.source,
    status: timerStatus(record.status),
    accumulatedSeconds: record.accumulatedSeconds,
    elapsedSeconds: elapsedSeconds(record, now),
    lastStartedAt: record.lastStartedAt?.toISOString() ?? null,
    startedAt: record.startedAt.toISOString(),
    endedAt: record.endedAt?.toISOString() ?? null,
  };
}

function jstDayKey(date: Date): string {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
}

function startOfJstDay(daysAgo = 0): Date {
  const shifted = new Date(Date.now() + JST_OFFSET_MS);
  const startUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate() - daysAgo,
  );
  return new Date(startUtc - JST_OFFSET_MS);
}

export async function getStudyTimerOverviewForUser(
  userId: number,
): Promise<StudyTimerOverview> {
  const now = new Date();
  const todayStart = startOfJstDay();
  const weekStart = startOfJstDay(6);

  const [activeTimer, recentTimers, totalAggregate] = await Promise.all([
    prisma.studyTimerSession.findFirst({
      where: { userId, activeKey: { not: null } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.studyTimerSession.findMany({
      where: { userId, startedAt: { gte: weekStart } },
      orderBy: { startedAt: "asc" },
    }),
    prisma.studyTimerSession.aggregate({
      where: { userId },
      _sum: { accumulatedSeconds: true },
    }),
  ]);

  const daySeconds = new Map<string, number>();
  for (let daysAgo = 6; daysAgo >= 0; daysAgo -= 1) {
    daySeconds.set(jstDayKey(startOfJstDay(daysAgo)), 0);
  }

  for (const timer of recentTimers) {
    const key = jstDayKey(timer.startedAt);
    if (!daySeconds.has(key)) continue;
    const seconds = elapsedSeconds(timer, now);
    daySeconds.set(key, (daySeconds.get(key) ?? 0) + seconds);
  }

  const activeExtra = activeTimer
    ? elapsedSeconds(activeTimer, now) - activeTimer.accumulatedSeconds
    : 0;
  const todaySeconds = recentTimers
    .filter((timer) => timer.startedAt >= todayStart)
    .reduce((total, timer) => total + elapsedSeconds(timer, now), 0);
  const weekSeconds = Array.from(daySeconds.values()).reduce(
    (total, seconds) => total + seconds,
    0,
  );

  return {
    activeTimer: activeTimer ? toStudyTimerView(activeTimer, now) : null,
    stats: {
      todaySeconds,
      weekSeconds,
      totalSeconds:
        (totalAggregate._sum.accumulatedSeconds ?? 0) + Math.max(0, activeExtra),
      byDay: Array.from(daySeconds.entries()).map(([date, seconds]) => ({
        date,
        seconds,
      })),
    },
  };
}

export async function finishTimerForKakou(
  userId: number,
  kakouSessionId: number,
): Promise<void> {
  const timer = await prisma.studyTimerSession.findFirst({
    where: {
      userId,
      kakouSessionId,
      activeKey: { not: null },
    },
  });
  if (!timer) return;

  const now = new Date();
  await prisma.studyTimerSession.update({
    where: { id: timer.id },
    data: {
      accumulatedSeconds: elapsedSeconds(timer, now),
      lastStartedAt: null,
      activeKey: null,
      status: "COMPLETED",
      endedAt: now,
    },
  });
}
