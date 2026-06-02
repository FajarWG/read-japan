import type { Metadata } from "next";
import { HomeDashboard } from "@/src/modules/home/components/HomeDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nihongo Flow — Belajar Bahasa Jepang Interaktif",
  description:
    "Aplikasi web belajar bahasa Jepang gratis: kuasai konjugasi kata kerja (Kotoba Flex), latihan membaca Hiragana & Katakana melalui cerita pendek, Anki Flashcards, dan persiapan belajar (Prep Sheet).",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  return <HomeDashboard />;
}
