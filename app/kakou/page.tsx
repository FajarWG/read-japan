import type { Metadata } from "next";

import { getKakouOverview } from "@/src/modules/kakou/actions/kakouActions";
import { getKakouMaterials } from "@/src/modules/kakou/actions/materialsActions";
import { KakouDashboard } from "@/src/modules/kakou/components/KakouDashboard";
import type { KakouSourceType } from "@/src/modules/kakou/data/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kakou — Japanese Handwriting Practice (書こう)",
  description:
    "Get structured Japanese writing prompts for your paper notebook, save your progress, and optionally copy a review prompt for an external AI service.",
  alternates: {
    canonical: "/kakou",
  },
};

export default async function KakouPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; sourceId?: string }>;
}) {
  const [overview, materials, params] = await Promise.all([
    getKakouOverview(),
    getKakouMaterials(),
    searchParams,
  ]);
  if (!overview) return null;

  const sourceType: KakouSourceType | undefined =
    params.source === "bunpou"
      ? "BUNPOU"
      : params.source === "katsuyou"
        ? "KATSUYOU"
        : undefined;
  const initialSource =
    sourceType && params.sourceId
      ? { type: sourceType, id: params.sourceId }
      : undefined;

  return (
    <KakouDashboard
      initialOverview={overview}
      initialSource={initialSource}
      initialMaterials={materials}
    />
  );
}
