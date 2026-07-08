"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

/**
 * Records that the user looked up a word/kanji token (e.g. tapping a token in
 * Prep). Increments `LearningProgress.clickCount`, which powers "words looked
 * up" style stats.
 *
 * Relocated from the (now-removed) stories module so Prep no longer depends on
 * deleted features. Intentionally decoupled from achievements.
 */
export async function recordKotobaLookup(progressKey: string): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error(
      "recordKotobaLookup: no session (middleware should have redirected to /login).",
    );
  }

  await prisma.learningProgress.upsert({
    where: {
      character_userId: { character: progressKey, userId: session.id },
    },
    update: { clickCount: { increment: 1 } },
    create: { character: progressKey, clickCount: 1, userId: session.id },
  });

  revalidatePath("/");
}
