import type { Metadata } from "next";
import { PrepContent } from "@/src/modules/prep/components/PrepContent";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Read Japan — Prep & Cheat Sheet",
  description:
    "Aplikasi web gratis untuk latihan membaca Hiragana dan Katakana bahasa Jepang, dilengkapi materi persiapan pelajaran (Prep Sheet).",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getSession();

  return (
    <PrepContent
      username={session?.username ?? null}
      role={session?.role ?? null}
    />
  );
}
