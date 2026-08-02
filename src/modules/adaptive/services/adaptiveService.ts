import { prisma } from "@/src/shared/lib/db";

export interface SimilarKanjiItem {
  id: number;
  kanji: string;
  similarKanji: string;
  reason: string;
  difficulty: string;
}

export interface WeakKanjiItem {
  kanji: string;
  weakScore: number;
  confusionCount: number;
  interval: number;
  ease: number;
  repetitions: number;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

export async function getSimilarKanjiPairs(kanji: string): Promise<SimilarKanjiItem[]> {
  return await prisma.similarKanji.findMany({
    where: {
      OR: [
        { kanji },
        { similarKanji: kanji },
      ],
    },
  });
}

export async function recordUserConfusion(
  userId: number,
  expectedKanji: string,
  selectedKanji: string
) {
  if (expectedKanji === selectedKanji) return;

  return await prisma.userKanjiConfusion.upsert({
    where: {
      userId_expectedKanji_selectedKanji: {
        userId,
        expectedKanji,
        selectedKanji,
      },
    },
    update: {
      count: { increment: 1 },
      lastSeen: new Date(),
    },
    create: {
      userId,
      expectedKanji,
      selectedKanji,
      count: 1,
    },
  });
}

export async function calculateUserWeakKanji(userId: number): Promise<WeakKanjiItem[]> {
  const kanjiProgress = await prisma.kanjiProgress.findMany({
    where: { userId },
  });

  const confusions = await prisma.userKanjiConfusion.findMany({
    where: { userId },
  });

  const confusionMap = new Map<string, number>();
  for (const c of confusions) {
    confusionMap.set(c.expectedKanji, (confusionMap.get(c.expectedKanji) || 0) + c.count);
  }

  const weakList: WeakKanjiItem[] = [];

  for (const kp of kanjiProgress) {
    const confCount = confusionMap.get(kp.kanji) || 0;
    
    // Formula for Weak Score (0-100)
    // Ease penalty: (2.5 - ease) * 30
    // Repetition penalty: (3 - min(repetitions, 3)) * 15
    // Confusion penalty: min(confCount * 20, 40)
    const easePenalty = Math.max(0, (2.5 - kp.ease) * 30);
    const repPenalty = Math.max(0, (3 - Math.min(kp.repetitions, 3)) * 15);
    const confPenalty = Math.min(confCount * 20, 40);

    const weakScore = Math.min(100, Math.round(easePenalty + repPenalty + confPenalty));

    if (weakScore > 20 || confCount > 0) {
      const kanjiMeta = await prisma.kanji.findUnique({
        where: { literal: kp.kanji },
        select: { meanings: true, onyomi: true, kunyomi: true },
      });

      weakList.push({
        kanji: kp.kanji,
        weakScore,
        confusionCount: confCount,
        interval: kp.interval,
        ease: kp.ease,
        repetitions: kp.repetitions,
        meanings: kanjiMeta?.meanings ? (typeof kanjiMeta.meanings === "string" ? JSON.parse(kanjiMeta.meanings) : kanjiMeta.meanings) : [],
        onyomi: kanjiMeta?.onyomi ? (typeof kanjiMeta.onyomi === "string" ? JSON.parse(kanjiMeta.onyomi) : kanjiMeta.onyomi) : [],
        kunyomi: kanjiMeta?.kunyomi ? (typeof kanjiMeta.kunyomi === "string" ? JSON.parse(kanjiMeta.kunyomi) : kanjiMeta.kunyomi) : [],
      });
    }
  }

  return weakList.sort((a, b) => b.weakScore - a.weakScore);
}

export async function getAdaptiveRecommendations(userId?: number) {
  if (!userId) {
    // Fallback default recommendations
    return [
      { kanji: "未", reason: "Confused with 末", targetKanji: "末" },
      { kanji: "土", reason: "Confused with 士", targetKanji: "士" },
      { kanji: "待", reason: "Confused with 持", targetKanji: "持" },
    ];
  }

  const confusions = await prisma.userKanjiConfusion.findMany({
    where: { userId },
    orderBy: { count: "desc" },
    take: 5,
  });

  if (confusions.length === 0) {
    return [
      { kanji: "未", reason: "High difficulty similar pair", targetKanji: "末" },
      { kanji: "待", reason: "Radical similarity 彳 vs 扌", targetKanji: "持" },
    ];
  }

  return confusions.map((c) => ({
    kanji: c.expectedKanji,
    reason: `Mistaken ${c.count} times for ${c.selectedKanji}`,
    targetKanji: c.selectedKanji,
  }));
}
