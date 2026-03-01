import type { Metadata } from "next";
import { prisma } from "@/src/shared/lib/db";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";
import { LearnContent } from "@/src/modules/learn/components/LearnContent";

export const metadata: Metadata = { title: "Learning Progress" };

// Selalu render ulang setiap request
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const records = await prisma.learningProgress.findMany({
    where: { OR: [{ clickCount: { gt: 0 } }, { wrongCount: { gt: 0 } }] },
    orderBy: [{ wrongCount: "desc" }, { clickCount: "desc" }],
  });

  const enriched = records.map((r) => ({
    ...r,
    info: kanaMap[r.character] ?? null,
  }));

  const totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);
  const totalWrong = records.reduce((sum, r) => sum + r.wrongCount, 0);
  const totalDebt = totalClicks + totalWrong;
  const hasWrong = enriched.some((r) => r.wrongCount > 0);

  return (
    <LearnContent
      enriched={enriched}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
      hasWrong={hasWrong}
    />
  );
}
