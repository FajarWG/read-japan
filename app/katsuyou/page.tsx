import type { Metadata } from "next";
import { KatsuyouDashboard } from "@/src/modules/katsuyou/components/KatsuyouDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katsuyou — Japanese Verb Conjugation (活用)",
  description:
    "Master Japanese verb conjugations (Godan, Ichidan, Irregular) through structured rules, natural examples, practice quizzes, and an independent database-backed Spaced Repetition System (SRS).",
  alternates: {
    canonical: "/katsuyou",
  },
};

export default function KatsuyouPage() {
  return <KatsuyouDashboard />;
}
