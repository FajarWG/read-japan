import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivity } from "@/src/shared/lib/activity";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const kanjiList = await prisma.kanjiTamago.findMany({
      orderBy: [
        { chapter: "asc" },
        { category: "asc" },
        { id: "asc" },
      ],
    });

    const progressList = await prisma.kanjiTamagoProgress.findMany({
      where: { userId: session.id },
      select: {
        kanjiId: true,
        dueDate: true,
        interval: true,
        repetitions: true,
        ease: true,
        mnemonic: true,
      },
    });

    return NextResponse.json({ kanjiList, progressList });
  } catch (error) {
    console.error("Error fetching Kanji Tamago data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Kanji Tamago data" },
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
    const { kanjiId, rating } = await request.json();

    if (!kanjiId || !rating || rating < 1 || rating > 4) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const targetKanji = await prisma.kanjiTamago.findUnique({
      where: { id: kanjiId },
    });

    if (!targetKanji) {
      return NextResponse.json(
        { error: "Kanji not found" },
        { status: 404 }
      );
    }

    // Get existing progress
    const existing = await prisma.kanjiTamagoProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId: session.id,
          kanjiId,
        },
      },
    });

    let ease = existing?.ease ?? 2.5;
    let repetitions = existing?.repetitions ?? 0;
    let interval = existing?.interval ?? 0;

    // Calculate new SM-2 values
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

    // Save progress
    const updated = await prisma.kanjiTamagoProgress.upsert({
      where: {
        userId_kanjiId: {
          userId: session.id,
          kanjiId,
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
        kanjiId,
        interval,
        ease,
        repetitions,
        dueDate,
      },
    });

    await logActivity(session.id, "anki_review", targetKanji.moji);

    return NextResponse.json({ success: true, progress: updated });
  } catch (error) {
    console.error("Error updating Kanji Tamago progress:", error);
    return NextResponse.json(
      { error: "Failed to update Kanji Tamago progress" },
      { status: 500 }
    );
  }
}
