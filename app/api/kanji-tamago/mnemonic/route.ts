import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { kanjiId, mnemonic } = await request.json();

    if (!kanjiId) {
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

    // Save or update mnemonic
    const updated = await prisma.kanjiTamagoProgress.upsert({
      where: {
        userId_kanjiId: {
          userId: session.id,
          kanjiId,
        },
      },
      update: {
        mnemonic: mnemonic || null,
      },
      create: {
        userId: session.id,
        kanjiId,
        mnemonic: mnemonic || null,
        interval: 0,
        ease: 2.5,
        repetitions: 0,
        dueDate: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress: updated });
  } catch (error) {
    console.error("Error saving mnemonic story:", error);
    return NextResponse.json(
      { error: "Failed to save mnemonic story" },
      { status: 500 }
    );
  }
}
