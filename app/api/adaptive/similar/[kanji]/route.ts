import { NextRequest, NextResponse } from "next/server";
import { getSimilarKanjiPairs } from "@/src/modules/adaptive/services/adaptiveService";
import { getSession } from "@/src/shared/lib/session";
import { prisma } from "@/src/shared/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kanji: string }> }
) {
  try {
    const session = await getSession();
    const { kanji: rawKanji } = await params;
    const kanji = decodeURIComponent(rawKanji).trim();

    if (!kanji) {
      return NextResponse.json({ error: "Kanji parameter required" }, { status: 400 });
    }

    const pairs = await getSimilarKanjiPairs(kanji);

    // Fetch user confusion history for this kanji
    let userConfusions: Array<{ selectedKanji: string; count: number }> = [];
    if (session?.id) {
      const confs = await prisma.userKanjiConfusion.findMany({
        where: { userId: session.id, expectedKanji: kanji },
        select: { selectedKanji: true, count: true },
      });
      userConfusions = confs;
    }

    return NextResponse.json({
      kanji,
      similarPairs: pairs,
      userConfusions,
    });
  } catch (error) {
    console.error("Error in GET /api/adaptive/similar/[kanji]:", error);
    return NextResponse.json({ error: "Failed to fetch similar kanji" }, { status: 500 });
  }
}
