import { prisma } from "@/src/shared/lib/db";
import type {
  StudyTimerOverview,
  StudyTimerStatus,
  StudyTimerView,
} from "@/src/modules/study-timer/types";

import { HEARTBEAT_GRACE_MS } from "@/src/modules/study-timer/constants";

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

type TimerRecord = {
  id: number;
  kakouSessionId: number | null;
  source: string;
  status: string;
  accumulatedSeconds: number;
  lastStartedAt: Date | null;
  lastHeartbeatAt?: Date | null;
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
  // Jangan hitung lewat heartbeat terakhir + grace — sesi yang ditinggal
  // (tab ditutup / device tidur) tidak boleh terus menumpuk jam kosong.
  const reference = record.lastHeartbeatAt ?? record.lastStartedAt;
  const cappedNowMs = Math.min(
    now.getTime(),
    reference.getTime() + HEARTBEAT_GRACE_MS,
  );
  const runningSeconds = Math.max(
    0,
    Math.floor((cappedNowMs - record.lastStartedAt.getTime()) / 1000),
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
    lastHeartbeatAt: record.lastHeartbeatAt?.toISOString() ?? null,
    startedAt: record.startedAt.toISOString(),
    endedAt: record.endedAt?.toISOString() ?? null,
  };
}

function jstDayKey(date: Date): string {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
}

export function startOfJstDay(daysAgo = 0): Date {
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

  const [activeTimer, recentTimers, totalAggregate, allSessionDays] = await Promise.all([
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
    prisma.studyTimerSession.findMany({
      where: { userId },
      select: { startedAt: true },
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

  const totalSeconds =
    (totalAggregate._sum.accumulatedSeconds ?? 0) + Math.max(0, activeExtra);

  // Rata-rata dihitung per hari yang benar-benar ada sesi belajar,
  // bukan per hari kalender — supaya jeda panjang tidak menipiskan angka.
  const activeDays = new Set(
    allSessionDays.map((session) => jstDayKey(session.startedAt)),
  ).size;

  return {
    activeTimer: activeTimer ? toStudyTimerView(activeTimer, now) : null,
    stats: {
      todaySeconds,
      weekSeconds,
      totalSeconds,
      activeDays,
      avgSecondsPerActiveDay:
        activeDays === 0 ? 0 : Math.round(totalSeconds / activeDays),
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
