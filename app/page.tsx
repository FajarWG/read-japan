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
  title: "Nihongo Flow — Japanese Study Suite",
  description:
    "Track your daily study and jump into Anki, Bunpou, Katsuyou, Prep, and Kotoba — a focused Japanese learning app with an English interface and Indonesian meanings.",
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
