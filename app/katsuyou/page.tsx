import type { Metadata } from "next";
import { KatsuyouDashboard } from "@/src/modules/katsuyou/components/KatsuyouDashboard";
import { CONJUGATION_FORMS } from "@/src/modules/katsuyou/data/conjugationForms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katsuyou — Japanese Verb Conjugation (活用)",
  description:
    "Master Japanese verb conjugations (Godan, Ichidan, Irregular) through structured rules, natural examples, practice quizzes, and an independent database-backed Spaced Repetition System (SRS).",
  alternates: {
    canonical: "/katsuyou",
  },
};

export default async function KatsuyouPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  const params = await searchParams;
  const initialForm = CONJUGATION_FORMS.some((form) => form.key === params.form)
    ? params.form
    : "dictionary";

  return <KatsuyouDashboard initialForm={initialForm} />;
}
