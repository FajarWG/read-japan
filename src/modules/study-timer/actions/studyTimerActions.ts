"use server";

import { revalidatePath } from "next/cache";

import {
  elapsedSeconds,
  getStudyTimerOverviewForUser,
  toStudyTimerView,
} from "@/src/modules/study-timer/lib/timer";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export async function getStudyTimerOverview() {
  const auth = await getSession();
  if (!auth) return null;
  return getStudyTimerOverviewForUser(auth.id);
}

/**
 * Timer belajar manual — tidak terikat sesi Kakou.
 * Dipakai oleh FloatingStudyTimer yang tampil di semua halaman.
 */
export async function startManualStudyTimer() {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };

  const active = await prisma.studyTimerSession.findFirst({
    where: { userId: auth.id, activeKey: { not: null } },
  });

  // Sudah ada timer aktif — jangan buat sesi baru, cukup lanjutkan.
  if (active) {
    if (active.status === "PAUSED") {
      const resumed = await prisma.studyTimerSession.update({
        where: { id: active.id },
        data: { status: "RUNNING", lastStartedAt: new Date() },
      });
      return { success: true as const, timer: toStudyTimerView(resumed) };
    }
    return { success: true as const, timer: toStudyTimerView(active) };
  }

  const now = new Date();
  try {
    const created = await prisma.studyTimerSession.create({
      data: {
        userId: auth.id,
        source: "MANUAL",
        status: "RUNNING",
        activeKey: `user:${auth.id}`,
        lastStartedAt: now,
        startedAt: now,
      },
    });
    return { success: true as const, timer: toStudyTimerView(created, now) };
  } catch (error) {
    console.error("[studyTimer] failed to start manual timer:", error);
    return { success: false as const, error: "Could not start the study timer" };
  }
}

/**
 * Menutup sesi timer dan mengunci totalnya ke akumulasi harian.
 * Hanya untuk sesi MANUAL — sesi KAKOU diselesaikan dari halaman Kakou.
 */
export async function stopStudyTimer(timerId: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(timerId)) {
    return { success: false as const, error: "Invalid timer" };
  }

  const timer = await prisma.studyTimerSession.findFirst({
    where: { id: timerId, userId: auth.id, activeKey: { not: null } },
  });
  if (!timer) return { success: false as const, error: "Active timer not found" };
  if (timer.source !== "MANUAL") {
    return {
      success: false as const,
      error: "Finish this timer from the Kakou session",
    };
  }

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

  return {
    success: true as const,
    overview: await getStudyTimerOverviewForUser(auth.id),
  };
}

export async function startStudyTimer(kakouSessionId: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(kakouSessionId)) {
    return { success: false as const, error: "Invalid writing session" };
  }

  const kakouSession = await prisma.kakouSession.findFirst({
    where: { id: kakouSessionId, userId: auth.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (!kakouSession) {
    return { success: false as const, error: "Writing session not found" };
  }

  const active = await prisma.studyTimerSession.findFirst({
    where: { userId: auth.id, activeKey: { not: null } },
  });
  if (active) {
    if (active.kakouSessionId !== kakouSessionId) {
      return {
        success: false as const,
        error: "Another study timer is already active",
      };
    }
    if (active.status === "PAUSED") {
      const resumed = await prisma.studyTimerSession.update({
        where: { id: active.id },
        data: { status: "RUNNING", lastStartedAt: new Date() },
      });
      return { success: true as const, timer: toStudyTimerView(resumed) };
    }
    return { success: true as const, timer: toStudyTimerView(active) };
  }

  const previous = await prisma.studyTimerSession.findUnique({
    where: { kakouSessionId },
  });
  if (previous) {
    return {
      success: false as const,
      error: "This writing session already has a finished timer",
    };
  }

  const now = new Date();
  try {
    const created = await prisma.studyTimerSession.create({
      data: {
        userId: auth.id,
        kakouSessionId,
        source: "KAKOU",
        status: "RUNNING",
        activeKey: `user:${auth.id}`,
        lastStartedAt: now,
        startedAt: now,
      },
    });
    revalidatePath("/kakou");
    return { success: true as const, timer: toStudyTimerView(created, now) };
  } catch (error) {
    console.error("[studyTimer] failed to start:", error);
    return { success: false as const, error: "Could not start the study timer" };
  }
}

export async function pauseStudyTimer(timerId: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(timerId)) {
    return { success: false as const, error: "Invalid timer" };
  }

  const timer = await prisma.studyTimerSession.findFirst({
    where: {
      id: timerId,
      userId: auth.id,
      activeKey: { not: null },
      status: "RUNNING",
    },
  });
  if (!timer) return { success: false as const, error: "Running timer not found" };

  const now = new Date();
  const updated = await prisma.studyTimerSession.update({
    where: { id: timer.id },
    data: {
      status: "PAUSED",
      accumulatedSeconds: elapsedSeconds(timer, now),
      lastStartedAt: null,
    },
  });
  revalidatePath("/kakou");
  return { success: true as const, timer: toStudyTimerView(updated, now) };
}

export async function resumeStudyTimer(timerId: number) {
  const auth = await getSession();
  if (!auth) return { success: false as const, error: "Unauthorized" };
  if (!Number.isInteger(timerId)) {
    return { success: false as const, error: "Invalid timer" };
  }

  const timer = await prisma.studyTimerSession.findFirst({
    where: {
      id: timerId,
      userId: auth.id,
      activeKey: `user:${auth.id}`,
      status: "PAUSED",
    },
  });
  if (!timer) return { success: false as const, error: "Paused timer not found" };

  const now = new Date();
  const updated = await prisma.studyTimerSession.update({
    where: { id: timer.id },
    data: { status: "RUNNING", lastStartedAt: now },
  });
  revalidatePath("/kakou");
  return { success: true as const, timer: toStudyTimerView(updated, now) };
}
