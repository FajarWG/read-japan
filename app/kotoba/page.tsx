import type { Metadata } from "next";
import { KotobaDashboard } from "@/src/modules/kotoba/components/KotobaDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kotoba — Vocabulary Notebook (言葉)",
  description:
    "Your personal Japanese vocabulary notebook. Jot down new words you come across, add readings and meanings, then memorize them with an Anki-style SRS.",
  alternates: {
    canonical: "/kotoba",
  },
};

export default function KotobaPage() {
  return <KotobaDashboard />;
}
