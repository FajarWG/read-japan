import type { Metadata } from "next";

import { getKakouOverview } from "@/src/modules/kakou/actions/kakouActions";
import { KakouDashboard } from "@/src/modules/kakou/components/KakouDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kakou — Japanese Handwriting Practice (書こう)",
  description:
    "Get structured Japanese writing prompts for your paper notebook, save your progress, and optionally copy a review prompt for an external AI service.",
  alternates: {
    canonical: "/kakou",
  },
};

export default async function KakouPage() {
  const overview = await getKakouOverview();
  if (!overview) return null;

  return <KakouDashboard initialOverview={overview} />;
}
