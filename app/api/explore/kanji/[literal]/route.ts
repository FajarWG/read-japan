import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

function calculateStatus(progress?: { interval: number; ease: number; repetitions: number } | null): "learned" | "learning" | "weak" | "new" {
  if (!progress) return "new";
  if (progress.ease < 2.0) return "weak";
  if (progress.interval >= 21 || progress.repetitions >= 3) return "learned";
  if (progress.repetitions > 0 || progress.interval > 0) return "learning";
  return "new";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ literal: string }> }
) {
  try {
    const session = await getSession();
    const { literal: rawLiteral } = await params;
    const literal = decodeURIComponent(rawLiteral).trim();

    if (!literal) {
      return NextResponse.json({ error: "Literal parameter is required" }, { status: 400 });
    }

    // 1. Fetch Kanji character from master table
    const kanji = await prisma.kanji.findUnique({
      where: { literal },
    });

    const unicodeHex = kanji
      ? kanji.unicode
      : literal.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");

    const strokeSvgUrl = `/kanjivg/${unicodeHex}.svg`;

    // 2. Fetch User Kanji SRS status
    let userKanjiStatus: "learned" | "learning" | "weak" | "new" = "new";
    let progressMap: Record<string, "learned" | "learning" | "weak" | "new"> = {};

    if (session?.id) {
      const kProg = await prisma.kanjiProgress.findUnique({
        where: { userId_kanji: { userId: session.id, kanji: literal } },
      });
      if (kProg) userKanjiStatus = calculateStatus(kProg);

      const userAnkiProgress = await prisma.ankiProgress.findMany({
        where: { userId: session.id },
        select: { cardKey: true, interval: true, ease: true, repetitions: true },
      });

      for (const rec of userAnkiProgress) {
        progressMap[rec.cardKey] = calculateStatus(rec);
      }
    }

    // 3. Fetch all vocabularies using this kanji via KanjiVocabulary junction table
    let words: Array<{ id: number; kanji: string; reading: string; meanings: any; jlpt: number | null; status: "learned" | "learning" | "weak" | "new" }> = [];
    let totalUsageCount = 0;

    if (kanji) {
      totalUsageCount = await prisma.kanjiVocabulary.count({
        where: { kanjiId: kanji.id },
      });

      const links = await prisma.kanjiVocabulary.findMany({
        where: { kanjiId: kanji.id },
        include: { vocabulary: true },
        take: 50,
      });

      words = links
        .filter((l) => l.vocabulary)
        .map((l) => ({
          id: l.vocabulary.id,
          kanji: l.vocabulary.kanji,
          reading: l.vocabulary.reading,
          meanings: typeof l.vocabulary.meanings === "string" ? JSON.parse(l.vocabulary.meanings) : l.vocabulary.meanings,
          jlpt: l.vocabulary.jlpt,
          status: progressMap[l.vocabulary.kanji] || "new",
        }));
    } else {
      const directVocab = await prisma.vocabulary.findMany({
        where: { kanji: { contains: literal } },
        take: 30,
      });
      totalUsageCount = directVocab.length;

      words = directVocab.map((v) => ({
        id: v.id,
        kanji: v.kanji,
        reading: v.reading,
        meanings: typeof v.meanings === "string" ? JSON.parse(v.meanings) : v.meanings,
        jlpt: v.jlpt,
        status: progressMap[v.kanji] || "new",
      }));
    }

    // 4. Group words into Word Family categories (Beginner, Intermediate, Advanced)
    const wordFamily = {
      beginner: words.filter((w) => w.jlpt === 5 || w.jlpt === 4),
      intermediate: words.filter((w) => w.jlpt === 3 || w.jlpt === 2),
      advanced: words.filter((w) => w.jlpt === 1 || !w.jlpt),
    };

    return NextResponse.json({
      kanji: {
        id: kanji?.id || null,
        literal,
        unicode: unicodeHex,
        strokeCount: kanji?.strokeCount || 1,
        grade: kanji?.grade || null,
        jlpt: kanji?.jlpt || null,
        frequency: kanji?.frequency || null,
        userStatus: userKanjiStatus,
        usageCount: totalUsageCount,
        meanings: kanji?.meanings ? (typeof kanji.meanings === "string" ? JSON.parse(kanji.meanings) : kanji.meanings) : [],
        onyomi: kanji?.onyomi ? (typeof kanji.onyomi === "string" ? JSON.parse(kanji.onyomi) : kanji.onyomi) : [],
        kunyomi: kanji?.kunyomi ? (typeof kanji.kunyomi === "string" ? JSON.parse(kanji.kunyomi) : kanji.kunyomi) : [],
        radicals: kanji?.radicals ? (typeof kanji.radicals === "string" ? JSON.parse(kanji.radicals) : kanji.radicals) : [],
        strokeSvgUrl,
      },
      words,
      wordFamily,
    });
  } catch (error) {
    console.error("Error in GET /api/explore/kanji/[literal]:", error);
    return NextResponse.json(
      { error: "Failed to fetch kanji explore details" },
      { status: 500 }
    );
  }
}
