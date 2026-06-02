import type { Metadata } from "next";
import { KotobaFlexDashboard } from "@/src/modules/kotoba-flex/components/KotobaFlexDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kotoba Flex — Japanese Verb Conjugation (Doushi)",
  description:
    "Learn Japanese verb conjugations across JLPT levels (N5 to N3) with automatic generators, rules guide, and flashcard quizzes.",
  alternates: {
    canonical: "/kotoba-flex",
  },
};

export default function KotobaFlexPage() {
  return <KotobaFlexDashboard />;
}
