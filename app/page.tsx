import type { Metadata } from "next";

import { HomeDashboard } from "@/src/modules/dashboard/components/HomeDashboard";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
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

  const [summary, progressStats, stories] = await Promise.all([
    getDashboardSummary(),
    getProgressStats(),
    prisma.story.findMany({
      orderBy: [{ totalReads: "asc" }, { createdAt: "desc" }],
      take: 2,
    }),
  ]);

  if (!summary || !progressStats) return null;

  return (
    <HomeDashboard
      summary={summary}
      progressStats={progressStats}
      recommendedStories={stories.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        totalReads: s.totalReads,
      }))}
    />
  );
}
