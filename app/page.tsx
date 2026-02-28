import { prisma } from "@/src/lib/db";
import { HomeContent } from "@/src/components/HomeContent";

// Selalu render ulang setiap request agar data dari DB selalu fresh
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stories, statsAgg] = await Promise.all([
    prisma.story.findMany({
      orderBy: [{ totalReads: "asc" }, { createdAt: "desc" }],
    }),
    prisma.learningProgress.aggregate({
      _sum: { clickCount: true, wrongCount: true },
      _count: { _all: true },
    }),
  ]);

  const totalClicks = statsAgg._sum.clickCount ?? 0;
  const totalWrong = statsAgg._sum.wrongCount ?? 0;
  const totalDebt = totalClicks + totalWrong;

  return (
    <HomeContent
      stories={stories}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
    />
  );
}
