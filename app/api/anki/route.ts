import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

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
    const { cardKey, chapter, sectionIndex, rating } = body;

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
        userId_cardKey: {
          userId: session.id,
          cardKey,
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
      interval = 1; // Ulangi besok (atau taruh dalam antrean sesi sekarang)
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
      // ease tetap
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
        userId_cardKey: {
          userId: session.id,
          cardKey,
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
        chapter,
        sectionIndex,
        interval,
        ease,
        repetitions,
        dueDate,
      },
    });

    return NextResponse.json({ success: true, progress: updated });
  } catch (error) {
    console.error("Error saving Anki progress:", error);
    return NextResponse.json(
      { error: "Failed to save Anki progress" },
      { status: 500 }
    );
  }
}
