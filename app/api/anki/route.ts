import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivity } from "@/src/shared/lib/activity";
import { scheduleWithFSRS } from "@/src/modules/anki/lib/fsrsEngine";

export const dynamic = "force-dynamic";

const DIRECTIONS = new Set([
  "kanji_to_reading",
  "kanji_to_meaning",
  "reading_to_meaning",
  "meaning_to_kanji",
]);

function validDirection(value: unknown): value is string {
  return typeof value === "string" && DIRECTIONS.has(value);
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const progressList = await prisma.ankiProgress.findMany({
      where: { userId: session.id },
      select: {
        cardKey: true,
        direction: true,
        dueDate: true,
        interval: true,
        repetitions: true,
        ease: true,
        stability: true,
        difficulty: true,
        state: true,
        learningSteps: true,
        reps: true,
        lapses: true,
        scheduledDays: true,
        elapsedDays: true,
        lastReview: true,
      },
    });

    return NextResponse.json({ progress: progressList });
  } catch (error) {
    console.error("Error fetching Anki progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch Anki progress" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      // BATCH MODE
      const cardKeys = body.map((item: any) => item.cardKey);
      const existingRecords = await prisma.ankiProgress.findMany({
        where: {
          userId: session.id,
          cardKey: { in: cardKeys },
        },
      });
      const existingMap = new Map(
        existingRecords.map((r) => [`${r.cardKey}:${r.direction}`, r]),
      );

      const upserts = [];
      const reviewEvents: Array<{
        userId: number;
        cardKey: string;
        direction: string;
        rating: number;
        responseTimeMs?: number;
      }> = [];

      const now = new Date();

      for (const item of body) {
        const { cardKey, chapter, sectionIndex, rating } = item;
        const direction = validDirection(item.direction)
          ? item.direction
          : "kanji_to_reading";

        if (
          !cardKey ||
          !chapter ||
          typeof sectionIndex !== "number" ||
          typeof rating !== "number" ||
          rating < 1 ||
          rating > 4
        ) {
          continue; // skip invalid entries
        }

        const existing = existingMap.get(`${cardKey}:${direction}`);
        const fsrsResult = scheduleWithFSRS(existing, rating, now);

        upserts.push(
          prisma.ankiProgress.upsert({
            where: {
              userId_cardKey_direction: {
                userId: session.id,
                cardKey,
                direction,
              },
            },
            update: {
              interval: fsrsResult.scheduledDays,
              ease: existing?.ease ?? 2.5,
              repetitions: fsrsResult.reps,
              dueDate: fsrsResult.dueDate,
              stability: fsrsResult.stability,
              difficulty: fsrsResult.difficulty,
              elapsedDays: fsrsResult.card.elapsed_days,
              scheduledDays: fsrsResult.scheduledDays,
              reps: fsrsResult.reps,
              lapses: fsrsResult.lapses,
              state: fsrsResult.state,
              learningSteps: fsrsResult.learningSteps,
              lastReview: fsrsResult.lastReview,
            },
            create: {
              userId: session.id,
              cardKey,
              direction,
              chapter,
              sectionIndex,
              interval: fsrsResult.scheduledDays,
              ease: 2.5,
              repetitions: fsrsResult.reps,
              dueDate: fsrsResult.dueDate,
              stability: fsrsResult.stability,
              difficulty: fsrsResult.difficulty,
              elapsedDays: fsrsResult.card.elapsed_days,
              scheduledDays: fsrsResult.scheduledDays,
              reps: fsrsResult.reps,
              lapses: fsrsResult.lapses,
              state: fsrsResult.state,
              learningSteps: fsrsResult.learningSteps,
              lastReview: fsrsResult.lastReview,
            },
          }),
        );

        reviewEvents.push({
          userId: session.id,
          cardKey,
          direction,
          rating,
          responseTimeMs:
            typeof item.responseTimeMs === "number" && item.responseTimeMs >= 0
              ? Math.round(item.responseTimeMs)
              : undefined,
        });
      }

      const results = await prisma.$transaction(upserts);
      if (reviewEvents.length > 0) {
        await prisma.ankiReviewEvent.createMany({ data: reviewEvents });
      }
      if (results.length > 0) await logActivity(session.id, "anki_review");
      return NextResponse.json({ success: true, progress: results });
    } else {
      // SINGLE MODE
      const { cardKey, chapter, sectionIndex, rating } = body;
      const direction = validDirection(body.direction)
        ? body.direction
        : "kanji_to_reading";

      if (
        !cardKey ||
        !chapter ||
        typeof sectionIndex !== "number" ||
        typeof rating !== "number" ||
        rating < 1 ||
        rating > 4
      ) {
        return NextResponse.json(
          { error: "Invalid parameters" },
          { status: 400 },
        );
      }

      const existing = await prisma.ankiProgress.findUnique({
        where: {
          userId_cardKey_direction: {
            userId: session.id,
            cardKey,
            direction,
          },
        },
      });

      const now = new Date();
      const fsrsResult = scheduleWithFSRS(existing, rating, now);

      const updated = await prisma.ankiProgress.upsert({
        where: {
          userId_cardKey_direction: {
            userId: session.id,
            cardKey,
            direction,
          },
        },
        update: {
          interval: fsrsResult.scheduledDays,
          ease: existing?.ease ?? 2.5,
          repetitions: fsrsResult.reps,
          dueDate: fsrsResult.dueDate,
          stability: fsrsResult.stability,
          difficulty: fsrsResult.difficulty,
          elapsedDays: fsrsResult.card.elapsed_days,
          scheduledDays: fsrsResult.scheduledDays,
          reps: fsrsResult.reps,
          lapses: fsrsResult.lapses,
          state: fsrsResult.state,
          learningSteps: fsrsResult.learningSteps,
          lastReview: fsrsResult.lastReview,
        },
        create: {
          userId: session.id,
          cardKey,
          direction,
          chapter,
          sectionIndex,
          interval: fsrsResult.scheduledDays,
          ease: 2.5,
          repetitions: fsrsResult.reps,
          dueDate: fsrsResult.dueDate,
          stability: fsrsResult.stability,
          difficulty: fsrsResult.difficulty,
          elapsedDays: fsrsResult.card.elapsed_days,
          scheduledDays: fsrsResult.scheduledDays,
          reps: fsrsResult.reps,
          lapses: fsrsResult.lapses,
          state: fsrsResult.state,
          learningSteps: fsrsResult.learningSteps,
          lastReview: fsrsResult.lastReview,
        },
      });

      await logActivity(session.id, "anki_review", cardKey);
      await prisma.ankiReviewEvent.create({
        data: {
          userId: session.id,
          cardKey,
          direction,
          rating,
          responseTimeMs:
            typeof body.responseTimeMs === "number" && body.responseTimeMs >= 0
              ? Math.round(body.responseTimeMs)
              : null,
        },
      });

      return NextResponse.json({ success: true, progress: updated });
    }
  } catch (error) {
    console.error("Error saving Anki progress:", error);
    return NextResponse.json(
      { error: "Failed to save Anki progress" },
      { status: 500 },
    );
  }
}
