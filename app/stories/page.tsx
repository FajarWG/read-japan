import type { Metadata } from "next";
import { prisma } from "@/src/shared/lib/db";
import {
  HomeContent,
  type KotobaProgressRecord,
} from "@/src/modules/stories/components/HomeContent";
import { getSession } from "@/src/shared/lib/session";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";
import {
  getAllKotobaLookupMap,
  isKotobaProgressKey,
} from "@/src/modules/prep/lib/kotoba-lookup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nihongo Flow — Cerita Pendek & Progres Belajar",
  description:
    "Baca cerita pendek bahasa Jepang, ketuk huruf untuk melihat cara baca, dan lacak progres belajarmu.",
};

export default async function StoriesPage() {
  const session = await getSession();

  const stories = await prisma.story.findMany({
    orderBy: [{ totalReads: "asc" }, { createdAt: "desc" }],
  });

  let records: any[] = [];
  let totalClicks = 0;
  let totalWrong = 0;
  let totalDebt = 0;
  const kotobaLookupMap = getAllKotobaLookupMap();

  if (session) {
    records = await prisma.learningProgress.findMany({
      where: {
        userId: session.id,
        OR: [{ clickCount: { gt: 0 } }, { wrongCount: { gt: 0 } }],
      },
      orderBy: [{ wrongCount: "desc" }, { clickCount: "desc" }],
    });

    totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);
    totalWrong = records.reduce((sum, r) => sum + r.wrongCount, 0);
    totalDebt = totalClicks + totalWrong;
  }

  const kanaProgress = records
    .filter((r) => !isKotobaProgressKey(r.character))
    .map((r) => ({
      character: r.character,
      clickCount: r.clickCount,
      wrongCount: r.wrongCount,
      info: kanaMap[r.character] ?? null,
    }));

  const kotobaProgress: KotobaProgressRecord[] = records
    .filter((r) => isKotobaProgressKey(r.character))
    .map((r) => ({
      character: r.character,
      clickCount: r.clickCount,
      wrongCount: r.wrongCount,
      entry: kotobaLookupMap.get(r.character) ?? null,
    }))
    .filter(
      (r): r is KotobaProgressRecord & { entry: NonNullable<typeof r.entry> } =>
        r.entry !== null,
    );

  const hasWrong = kanaProgress.some((r) => r.wrongCount > 0);

  return (
    <HomeContent
      recommendedStories={stories.slice(0, 2)}
      stories={stories}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
      isGuest={!session}
      kanaProgress={kanaProgress}
      kotobaProgress={kotobaProgress}
      hasWrong={hasWrong}
    />
  );
}
