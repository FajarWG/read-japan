import type { Metadata } from "next";
import { SomatomeContent } from "@/src/modules/somatome/components/SomatomeContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Somatome N4 | Nihongo Flow",
  description: "Baca PDF Somatome N4 (Kanji-Vocabulary & Grammar-Reading-Listening) sambil mengerjakan dan memvalidasi soal per Day.",
  alternates: {
    canonical: "/somatome",
  },
};

export default function SomatomePage() {
  return <SomatomeContent />;
}
