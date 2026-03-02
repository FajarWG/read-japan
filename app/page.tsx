import type { Metadata } from "next";
import { prisma } from "@/src/shared/lib/db";
import { HomeContent } from "@/src/modules/stories/components/HomeContent";
import { getSession } from "@/src/shared/lib/session";

// Selalu render ulang setiap request agar data dari DB selalu fresh
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Read Japan — Belajar Baca Hiragana & Katakana",
  description:
    "Aplikasi web gratis untuk latihan membaca Hiragana dan Katakana bahasa Jepang. Baca cerita pendek, klik huruf untuk melihat cara bacanya, dan lacak progres belajarmu.",
  alternates: {
    canonical: "/",
  },
};

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
      recommendedStories={stories.slice(0, 3)}
      stories={stories}
      totalClicks={totalClicks}
      totalWrong={totalWrong}
      totalDebt={totalDebt}
      isGuest={!session}
    />
  );
}
