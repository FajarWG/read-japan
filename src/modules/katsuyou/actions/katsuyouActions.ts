"use server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { mockVerbs } from "../data/verbs";

/**
 * Get overall progress statistics for Japanese Verb Conjugation (Katsuyou).
 */
export async function getKatsuyouStats() {
  const session = await getSession();
  if (!session) {
    return {
      completedLessons: [] as string[],
      dueReviewsCount: 0,
      dueReviewsByForm: {} as Record<string, number>,
      totalCardsCount: 0,
      practiceCount: 0,
    };
  }

  try {
    const userId = session.id;

    const [completedLessons, reviewStats, practiceCount] = await Promise.all([
      prisma.katsuyouLessonProgress.findMany({
        where: { userId, completed: true },
        select: { conjugationForm: true },
      }),
      prisma.katsuyouReviewCard.aggregate({
        where: { userId },
        _count: {
          id: true,
        },
      }),
      prisma.katsuyouPracticeAttempt.count({
        where: { userId },
      }),
    ]);

    const dueReviewsCount = await prisma.katsuyouReviewCard.count({
      where: {
        userId,
        nextReview: {
          lte: new Date(),
        },
      },
    });

    const dueReviewsByFormRaw = await prisma.katsuyouReviewCard.groupBy({
      by: ["conjugationForm"],
      where: {
        userId,
        nextReview: {
          lte: new Date(),
        },
      },
      _count: {
        id: true,
      },
    });

    const dueReviewsByForm = dueReviewsByFormRaw.reduce((acc: Record<string, number>, curr: { conjugationForm: string; _count: { id: number } }) => {
      acc[curr.conjugationForm] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      completedLessons: completedLessons.map((l: { conjugationForm: string }) => l.conjugationForm),
      dueReviewsCount,
      dueReviewsByForm,
      totalCardsCount: reviewStats._count.id,
      practiceCount,
    };
  } catch (error) {
    console.error("Error fetching Katsuyou stats:", error);
    return {
      completedLessons: [] as string[],
      dueReviewsCount: 0,
      dueReviewsByForm: {} as Record<string, number>,
      totalCardsCount: 0,
      practiceCount: 0,
    };
  }
}

/**
 * Mark a conjugation lesson form as completed.
 */
export async function completeLesson(conjugationForm: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    await prisma.katsuyouLessonProgress.upsert({
      where: {
        userId_conjugationForm: {
          userId,
          conjugationForm,
        },
      },
      create: {
        userId,
        conjugationForm,
        completed: true,
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to save progress" };
  }
}

/**
 * Retrieve active review cards for the user.
 * Automatically initializes 5 basic cards if the user's review list for this form is empty.
 */
export async function getReviewQueue(conjugationForm: string) {
  const session = await getSession();
  if (!session) return [];

  try {
    const userId = session.id;

    // Fetch existing due cards
    let dueCards = await prisma.katsuyouReviewCard.findMany({
      where: {
        userId,
        conjugationForm,
        nextReview: {
          lte: new Date(),
        },
      },
      orderBy: {
        nextReview: "asc",
      },
    });

    const totalCount = await prisma.katsuyouReviewCard.count({
      where: { userId, conjugationForm },
    });

    // Cold-start helper: Auto-populate 5 basic N5 verbs if queue/cards are empty
    if (totalCount === 0) {
      const basicVerbs = mockVerbs
        .filter((v) => v.jlpt === "N5")
        .slice(0, 5);

      const createdCards = [];
      for (const verb of basicVerbs) {
        const card = await prisma.katsuyouReviewCard.create({
          data: {
            userId,
            verbId: verb.id,
            conjugationForm,
            repetitions: 0,
            easeFactor: 2.5,
            interval: 0,
            nextReview: new Date(),
          },
        });
        createdCards.push(card);
      }
      dueCards = createdCards;
    }

    // Map database card record to mockVerbs to include vocabulary info
    return dueCards.map((card: any) => {
      const verbData = mockVerbs.find((v) => v.id === card.verbId);
      return {
        ...card,
        verb: verbData || null,
      };
    });
  } catch (error) {
    console.error("Error fetching review queue:", error);
    return [];
  }
}

/**
 * Add a new set of 5 random cards from mockVerbs (matching JLPT level if possible)
 * to the review queue for this conjugation form.
 */
export async function addCardsToReviewQueue(conjugationForm: string, jlptLevel?: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    // Find verbs not already present as review cards
    const existingCards = await prisma.katsuyouReviewCard.findMany({
      where: { userId, conjugationForm },
      select: { verbId: true },
    });

    const existingVerbIds = new Set(existingCards.map((c: { verbId: string }) => c.verbId));
    let availableVerbs = mockVerbs.filter((v) => !existingVerbIds.has(v.id));

    if (jlptLevel) {
      availableVerbs = availableVerbs.filter((v) => v.jlpt === jlptLevel);
    }

    // Grab 5 verbs
    const targetVerbs = availableVerbs.slice(0, 5);
    if (targetVerbs.length === 0) {
      return { success: false, error: "All available verbs are already in your queue." };
    }

    for (const verb of targetVerbs) {
      await prisma.katsuyouReviewCard.create({
        data: {
          userId,
          verbId: verb.id,
          conjugationForm,
          repetitions: 0,
          easeFactor: 2.5,
          interval: 0,
          nextReview: new Date(),
        },
      });
    }

    return { success: true, count: targetVerbs.length };
  } catch (error) {
    console.error("Error adding cards to queue:", error);
    return { success: false, error: "Failed to add verbs to reviews" };
  }
}

/**
 * Submit a review rating ('easy' | 'good' | 'hard') for a card.
 * Uses a modified SM-2 spaced repetition scheduler.
 */
export async function submitReview(cardId: number, rating: "easy" | "good" | "hard") {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    const card = await prisma.katsuyouReviewCard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== userId) {
      return { success: false, error: "Card not found" };
    }

    let repetitions = card.repetitions;
    let easeFactor = card.easeFactor;
    let interval = card.interval;

    if (rating === "hard") {
      repetitions = 0;
      interval = 1; // back to 1 day
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === "good") {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      // easeFactor remains the same
    } else if (rating === "easy") {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 2;
      } else if (repetitions === 2) {
        interval = 8;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor = Math.min(3.0, easeFactor + 0.15);
    }

    // Set nextReview
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    // Remove minutes/seconds to keep reviews structured by days
    nextReview.setHours(0, 0, 0, 0);

    const [updatedCard] = await Promise.all([
      prisma.katsuyouReviewCard.update({
        where: { id: cardId },
        data: {
          repetitions,
          easeFactor,
          interval,
          nextReview,
          lastReviewed: new Date(),
        },
      }),
      prisma.katsuyouReviewLog.create({
        data: {
          userId,
          verbId: card.verbId,
          conjugationForm: card.conjugationForm,
          rating,
          repetitions,
          easeFactor,
          interval,
        },
      }),
    ]);

    return { success: true, card: updatedCard };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to process review" };
  }
}

/**
 * Log a practice attempt.
 * Automatically adds the verb to the user's SRS review cards if answered correctly
 * and if it doesn't already exist in the database.
 */
export async function savePracticeAttempt(
  verbId: string,
  conjugationForm: string,
  exerciseType: string,
  isCorrect: boolean,
  userAnswer: string
) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const userId = session.id;

    // 1. Log practice attempt
    await prisma.katsuyouPracticeAttempt.create({
      data: {
        userId,
        verbId,
        conjugationForm,
        exerciseType,
        isCorrect,
        userAnswer,
      },
    });

    // 2. If correct, auto-activate verb into SRS reviews if not exists
    if (isCorrect) {
      const existing = await prisma.katsuyouReviewCard.findUnique({
        where: {
          userId_verbId_conjugationForm: {
            userId,
            verbId,
            conjugationForm,
          },
        },
      });

      if (!existing) {
        await prisma.katsuyouReviewCard.create({
          data: {
            userId,
            verbId,
            conjugationForm,
            repetitions: 0,
            easeFactor: 2.5,
            interval: 0,
            nextReview: new Date(),
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving practice attempt:", error);
    return { success: false, error: "Failed to save practice attempt" };
  }
}
