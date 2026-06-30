"use server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Fetch list of grammar pattern IDs completed by the current user.
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

/**
 * Toggle the learned status of a grammar pattern.
 */
export async function toggleBunpouProgress(patternId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    // Check if it already exists
    const existing = await prisma.bunpouProgress.findUnique({
      where: {
        userId_patternId: {
          userId,
          patternId,
        },
      },
    });

    if (existing) {
      // Toggle off: delete progress
      await prisma.bunpouProgress.delete({
        where: {
          id: existing.id,
        },
      });
    } else {
      // Toggle on: create progress
      await prisma.bunpouProgress.create({
        data: {
          userId,
          patternId,
          completed: true,
        },
      });
    }

    revalidatePath("/bunpou");
    return { success: true };
  } catch (error) {
    console.error("Error toggling Bunpou progress:", error);
    return { success: false, error: "Failed to update progress" };
  }
}
