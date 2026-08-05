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
  { params }: { params: Promise<{ word: string }> }
) {
  try {
    const session = await getSession();
    const { word: rawWord } = await params;
    const word = decodeURIComponent(rawWord).trim();

    if (!word) {
      return NextResponse.json({ error: "Word parameter is required" }, { status: 400 });
    }

    // 1. Fetch Vocabulary from JMdict master table
    const vocab = await prisma.vocabulary.findFirst({
      where: {
        OR: [
          { kanji: word },
          { reading: word },
        ],
      },
    });

    // 2. Fetch extra audio / sentence from AnkiCard table if available
    const ankiCard = await prisma.ankiCard.findFirst({
      where: {
        OR: [
          { kanji: word },
          { hiragana: word },
        ],
      },
      select: {
        id: true,
        audio: true,
        sentence: true,
        sentenceTranslation: true,
        sentenceAudio: true,
        image: true,
      },
    });

    // 3. User progress status calculation
    let userProgressStatus: "learned" | "learning" | "weak" | "new" = "new";
    let progressMap: Record<string, "learned" | "learning" | "weak" | "new"> = {};
    // Detail SRS kata ini, dipakai untuk panel "Your memory" di Explore
    let srs: {
      interval: number;
      ease: number;
      repetitions: number;
      dueDate: string | null;
      status: "learned" | "learning" | "weak" | "new";
    } | null = null;

    if (session?.id) {
      const userProgressRecords = await prisma.ankiProgress.findMany({
        where: { userId: session.id },
        select: {
          cardKey: true,
          interval: true,
          ease: true,
          repetitions: true,
          dueDate: true,
        },
      });

      for (const rec of userProgressRecords) {
        const status = calculateStatus(rec);
        progressMap[rec.cardKey] = status;
        // Key matching: custom-{id} or cardKey containing kanji
        const isThisWord =
          (ankiCard && rec.cardKey === `custom-${ankiCard.id}`) ||
          rec.cardKey.includes(word);
        if (isThisWord) {
          userProgressStatus = status;
          srs = {
            interval: rec.interval,
            ease: rec.ease,
            repetitions: rec.repetitions,
            dueDate: rec.dueDate ? new Date(rec.dueDate).toISOString() : null,
            status,
          };
        }
      }
    }

    // 4. Extract Kanji characters from the word
    const kanjiChars = Array.from(new Set(word.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g) || []));
    
    const kanjiGridRaw = await prisma.kanji.findMany({
      where: {
        literal: { in: kanjiChars },
      },
      select: {
        id: true,
        literal: true,
        unicode: true,
        strokeCount: true,
        grade: true,
        jlpt: true,
        meanings: true,
        onyomi: true,
        kunyomi: true,
      },
    });

    // Kanji Progress for current user
    let kanjiProgressMap: Record<string, "learned" | "learning" | "weak" | "new"> = {};
    if (session?.id && kanjiChars.length > 0) {
      const kProg = await prisma.kanjiProgress.findMany({
        where: { userId: session.id, kanji: { in: kanjiChars } },
      });
      for (const kp of kProg) {
        kanjiProgressMap[kp.kanji] = calculateStatus(kp);
      }
    }

    // 5. Fetch & Rank Related Words
    let relatedWords: Array<{
      id: number;
      kanji: string;
      reading: string;
      meanings: any;
      jlpt: number | null;
      status: "learned" | "learning" | "weak" | "new";
      rankScore: number;
    }> = [];

    if (kanjiGridRaw.length > 0) {
      const kanjiIds = kanjiGridRaw.map((k) => k.id);
      const links = await prisma.kanjiVocabulary.findMany({
        where: {
          kanjiId: { in: kanjiIds },
        },
        include: {
          vocabulary: true,
        },
        take: 30,
      });

      const vocabMap = new Map<number, any>();
      for (const link of links) {
        if (link.vocabulary && link.vocabulary.kanji !== word && !vocabMap.has(link.vocabulary.id)) {
          const rw = link.vocabulary;
          const status = progressMap[rw.kanji] || "new";

          // Calculate ranking score:
          // Status score: learned = 30, learning = 20, weak = 25, new = 10
          // JLPT score: N5 = 50, N4 = 40, N3 = 30, N2 = 20, N1 = 10, null = 5
          let statusScore = status === "learned" ? 30 : status === "learning" ? 20 : status === "weak" ? 25 : 10;
          let jlptScore = rw.jlpt === 5 ? 50 : rw.jlpt === 4 ? 40 : rw.jlpt === 3 ? 30 : rw.jlpt === 2 ? 20 : rw.jlpt === 1 ? 10 : 5;
          let rankScore = statusScore + jlptScore;

          vocabMap.set(rw.id, {
            id: rw.id,
            kanji: rw.kanji,
            reading: rw.reading,
            meanings: typeof rw.meanings === "string" ? JSON.parse(rw.meanings) : rw.meanings,
            jlpt: rw.jlpt,
            status,
            rankScore,
          });
        }
      }

      relatedWords = Array.from(vocabMap.values())
        .sort((a, b) => b.rankScore - a.rankScore)
        .slice(0, 10);
    }

    // 6. Kanji yang mudah tertukar dengan komponen kata ini (bahan waspada saat menghafal)
    let similarKanji: Array<{
      kanji: string;
      similarKanji: string;
      reason: string;
      difficulty: string;
    }> = [];

    if (kanjiChars.length > 0) {
      const similarRows = await prisma.similarKanji.findMany({
        where: { kanji: { in: kanjiChars } },
        select: {
          kanji: true,
          similarKanji: true,
          reason: true,
          difficulty: true,
        },
        take: 8,
      });
      similarKanji = similarRows;
    }

    // 7. Mnemonic buatan user + contoh pemakaian dari Kanji Tamago
    let mnemonics: Array<{
      moji: string;
      yomi: string;
      imi: string;
      mnemonic: string | null;
      examples: Array<{ word: string; yomi: string; imi: string }>;
    }> = [];

    if (kanjiChars.length > 0) {
      const tamagoEntries = await prisma.kanjiTamago.findMany({
        where: { moji: { in: kanjiChars } },
        select: {
          id: true,
          moji: true,
          yomi: true,
          imi: true,
          examples: true,
        },
      });

      let mnemonicByKanjiId: Record<number, string | null> = {};
      if (session?.id && tamagoEntries.length > 0) {
        const tamagoProgress = await prisma.kanjiTamagoProgress.findMany({
          where: {
            userId: session.id,
            kanjiId: { in: tamagoEntries.map((e: { id: number }) => e.id) },
          },
          select: { kanjiId: true, mnemonic: true },
        });
        for (const p of tamagoProgress) {
          mnemonicByKanjiId[p.kanjiId] = p.mnemonic;
        }
      }

      const seenMoji = new Set<string>();
      for (const entry of tamagoEntries) {
        if (seenMoji.has(entry.moji)) continue;
        seenMoji.add(entry.moji);
        const rawExamples =
          typeof entry.examples === "string"
            ? JSON.parse(entry.examples)
            : entry.examples;
        mnemonics.push({
          moji: entry.moji,
          yomi: entry.yomi,
          imi: entry.imi,
          mnemonic: mnemonicByKanjiId[entry.id] ?? null,
          examples: Array.isArray(rawExamples) ? rawExamples.slice(0, 4) : [],
        });
      }
    }

    return NextResponse.json({
      queryWord: word,
      userStatus: userProgressStatus,
      srs,
      similarKanji,
      mnemonics,
      vocabulary: vocab ? {
        id: vocab.id,
        entrySeq: vocab.entrySeq,
        kanji: vocab.kanji,
        reading: vocab.reading,
        meanings: typeof vocab.meanings === "string" ? JSON.parse(vocab.meanings) : vocab.meanings,
        jlpt: vocab.jlpt,
      } : {
        id: null,
        entrySeq: null,
        kanji: word,
        reading: word,
        meanings: [],
        jlpt: null,
      },
      ankiData: ankiCard || null,
      kanjiGrid: kanjiGridRaw.map((k) => ({
        ...k,
        status: kanjiProgressMap[k.literal] || "new",
        meanings: typeof k.meanings === "string" ? JSON.parse(k.meanings) : k.meanings,
        onyomi: typeof k.onyomi === "string" ? JSON.parse(k.onyomi) : k.onyomi,
        kunyomi: typeof k.kunyomi === "string" ? JSON.parse(k.kunyomi) : k.kunyomi,
      })),
      relatedWords,
    });
  } catch (error) {
    console.error("Error in GET /api/explore/vocabulary/[word]:", error);
    return NextResponse.json(
      { error: "Failed to fetch vocabulary explore details" },
      { status: 500 }
    );
  }
}
