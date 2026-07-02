import type { Metadata } from "next";
import { ITKotobaDashboard } from "@/src/modules/it-kotoba/components/ITKotobaDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IT Kotoba — IT/Developer Terms (ITの言葉)",
  description:
    "Memorize critical Japanese terminology for developers and IT professionals. Toggle furigana, customize layout columns, add custom words, and review using an Anki-style SRS system.",
  alternates: {
    canonical: "/it-kotoba",
  },
};

export default function ITKotobaPage() {
  return <ITKotobaDashboard />;
}
