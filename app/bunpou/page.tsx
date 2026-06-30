import type { Metadata } from "next";
import { BunpouDashboard } from "@/src/modules/bunpou/components/BunpouDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bunpou — Japanese Grammar & Particles (文法)",
  description:
    "Master basic Japanese grammar patterns, particles, and adjectives from textbook Chapters 1 to 15 with search capabilities, furigana toggles, and client-side completion tracking.",
  alternates: {
    canonical: "/bunpou",
  },
};

export default function BunpouPage() {
  return <BunpouDashboard />;
}
