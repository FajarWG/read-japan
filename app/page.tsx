import { prisma } from "@/src/shared/lib/db";
import { HomeContent } from "@/src/modules/stories/components/HomeContent";
import { getSession } from "@/src/shared/lib/session";

// Selalu render ulang setiap request agar data dari DB selalu fresh
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  const stories = await prisma.story.findMany({
    orderBy: [{ totalReads: "asc" }, { createdAt: "desc" }],
  });

  let totalClicks = 0;
  let totalWrong = 0;
  let totalDebt = 0;

  if (session) {
    const statsAgg = await prisma.learningProgress.aggregate({
      where: { userId: session.id },
      _sum: { clickCount: true, wrongCount: true },
    });
    totalClicks = statsAgg._sum.clickCount ?? 0;
    totalWrong = statsAgg._sum.wrongCount ?? 0;
    totalDebt = totalClicks + totalWrong;
  }

  return (
    <HomeContent
      stories={stories}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
      isGuest={!session}
    />
  );
}
