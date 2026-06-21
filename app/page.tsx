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

  const [summary, progressStats] = await Promise.all([
    getDashboardSummary(),
    getProgressStats(),
  ]);

  if (!summary || !progressStats) return null;

  return (
    <HomeDashboard
      summary={summary}
      progressStats={progressStats}
    />
  );
}
