import { prisma } from "@/src/shared/lib/db";

/**
 * Activity types recorded for streak / dashboard stats. Kept small on purpose —
 * only the features that survived the app slim-down.
 */
export type ActivityType =
  | "anki_review"
  | "katsuyou_review"
  | "bunpou_study"
  | "kotoba_review"
  | "prep_open"
  | "login";

/**
 * Records a single learning event. Fire-and-forget friendly: failures are
 * swallowed and logged, since activity logging must never break the action it
 * decorates. At most one row per call — callers should log once per session of
 * work, not once per card.
 */
export async function logActivity(
  userId: number,
  type: ActivityType,
  refId?: string,
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: { userId, type, refId: refId ?? null },
    });
  } catch (error) {
    console.error(`[logActivity] failed to record ${type}:`, error);
  }
}
