import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivity } from "@/src/shared/lib/activity";

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
      },
    });

    return NextResponse.json({ progress: progressList });
  } catch (error) {
    console.error("Error fetching Anki progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch Anki progress" },
      { status: 500 }
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
        let ease = existing?.ease ?? 2.5;
        let repetitions = existing?.repetitions ?? 0;
        let interval = existing?.interval ?? 0;

        // Hitung berdasarkan algoritma SM-2
        if (rating === 1) {
          // Again
          repetitions = 0;
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        } else if (rating === 2) {
          // Hard
          repetitions += 1;
          interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.ceil(interval * 1.2);
          ease = Math.max(1.3, ease - 0.15);
        } else if (rating === 3) {
          // Good
          repetitions += 1;
          interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.ceil(interval * ease);
        } else {
          // Easy (4)
          repetitions += 1;
          interval = repetitions === 1 ? 4 : repetitions === 2 ? 10 : Math.ceil(interval * ease * 1.3);
          ease += 0.15;
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + interval);

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
              interval,
              ease,
              repetitions,
              dueDate,
            },
            create: {
              userId: session.id,
              cardKey,
              direction,
              chapter,
              sectionIndex,
              interval,
              ease,
              repetitions,
              dueDate,
            },
          })
        );
      }

      const results = await prisma.$transaction(upserts);
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
          { status: 400 }
        );
      }

      // Ambil data progres lama jika ada
      const existing = await prisma.ankiProgress.findUnique({
        where: {
          userId_cardKey_direction: {
            userId: session.id,
            cardKey,
            direction,
          },
        },
      });

      let ease = existing?.ease ?? 2.5;
      let repetitions = existing?.repetitions ?? 0;
      let interval = existing?.interval ?? 0;

      // Hitung berdasarkan algoritma SM-2
      if (rating === 1) {
        // Again
        repetitions = 0;
        interval = 1;
        ease = Math.max(1.3, ease - 0.2);
      } else if (rating === 2) {
        // Hard
        repetitions += 1;
        interval =
          repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.ceil(interval * 1.2);
        ease = Math.max(1.3, ease - 0.15);
      } else if (rating === 3) {
        // Good
        repetitions += 1;
        interval =
          repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.ceil(interval * ease);
      } else {
        // Easy (4)
        repetitions += 1;
        interval =
          repetitions === 1 ? 4 : repetitions === 2 ? 10 : Math.ceil(interval * ease * 1.3);
        ease += 0.15;
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + interval);

      // Simpan progres baru
      const updated = await prisma.ankiProgress.upsert({
        where: {
          userId_cardKey_direction: {
            userId: session.id,
            cardKey,
            direction,
          },
        },
        update: {
          interval,
          ease,
          repetitions,
          dueDate,
        },
        create: {
          userId: session.id,
          cardKey,
          direction,
          chapter,
          sectionIndex,
          interval,
          ease,
          repetitions,
          dueDate,
        },
      });

      await logActivity(session.id, "anki_review", cardKey);
      return NextResponse.json({ success: true, progress: updated });
    }
  } catch (error) {
    console.error("Error saving Anki progress:", error);
    return NextResponse.json(
      { error: "Failed to save Anki progress" },
      { status: 500 }
    );
  }
}
