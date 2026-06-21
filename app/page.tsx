import type { Metadata } from "next";

import { HomeContent } from "@/src/modules/stories/components/HomeContent";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";
import {
  getAllKotobaLookupMap,
  isKotobaProgressKey,
  getDekiruChapters,
} from "@/src/modules/prep/lib/kotoba-lookup";
import {
  getDashboardSummary,
  getProgressStats,
} from "@/src/modules/dashboard/lib/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nihongo Flow — Belajar Bahasa Jepang Interaktif",
  description:
    "Aplikasi web belajar bahasa Jepang gratis: kuasai konjugasi kata kerja (Kotoba Flex), latihan membaca Hiragana & Katakana melalui cerita pendek, Anki Flashcards, dan persiapan belajar (Prep Sheet).",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getSession();
  if (!session) return null;

  const [summary, progressStats, stories, records] = await Promise.all([
    getDashboardSummary(),
    getProgressStats(),
    prisma.story.findMany({
      orderBy: [{ totalReads: "asc" }, { createdAt: "desc" }],
    }),
    prisma.learningProgress.findMany({
      where: {
        userId: session.id,
        OR: [{ clickCount: { gt: 0 } }, { wrongCount: { gt: 0 } }],
      },
      orderBy: [{ wrongCount: "desc" }, { clickCount: "desc" }],
    }),
  ]);

  if (!summary || !progressStats) return null;

  const totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);
  const totalWrong = records.reduce((sum, r) => sum + r.wrongCount, 0);
  const totalDebt = totalClicks + totalWrong;
  const kotobaLookupMap = getAllKotobaLookupMap();

  const kanaProgress = records
    .filter((r) => !isKotobaProgressKey(r.character))
    .map((r) => ({
      character: r.character,
      clickCount: r.clickCount,
      wrongCount: r.wrongCount,
      info: kanaMap[r.character] ?? null,
    }));

  const kotobaProgress = records
    .filter((r) => isKotobaProgressKey(r.character))
    .map((r) => ({
      character: r.character,
      clickCount: r.clickCount,
      wrongCount: r.wrongCount,
      entry: kotobaLookupMap.get(r.character) ?? null,
    }))
    .filter(
      (r): r is typeof r & { entry: NonNullable<typeof r.entry> } =>
        r.entry !== null,
    );

  const hasWrong = kanaProgress.some((r) => r.wrongCount > 0);

  const dekiruChapters = getDekiruChapters();

  return (
    <HomeContent
      summary={summary}
      progressStats={progressStats}
      recommendedStories={stories.slice(0, 2)}
      stories={stories}
      dekiruChapters={dekiruChapters}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
      kanaProgress={kanaProgress}
      kotobaProgress={kotobaProgress}
      hasWrong={hasWrong}
    />
  );
}
