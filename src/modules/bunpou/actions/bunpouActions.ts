"use server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

/**
 * Fetch list of grammar pattern IDs completed by the current user.
 * "Completed" is set by Kakou's AI review closing the loop, not manually.
 */
export async function getBunpouProgress() {
  const session = await getSession();
  if (!session) return [];

  try {
    const userId = session.id;
    const progress = await prisma.bunpouProgress.findMany({
      where: { userId, completed: true },
      select: { patternId: true },
    });
    return progress.map((p) => p.patternId);
  } catch (error) {
    console.error("Error fetching Bunpou progress:", error);
    return [];
  }
}
