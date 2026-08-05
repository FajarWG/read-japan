import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/src/shared/lib/session";
import { AnkiRecapContent } from "@/src/modules/anki/components/AnkiRecapContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Session Recap — Anki",
  description:
    "Review the words you just studied, see which ones need more work, and explore each of them in depth.",
};

export default async function AnkiRecapPage() {
  const session = await getSession();

  // Proteksi rute: Hanya untuk user yang sudah login
  if (!session) {
    redirect("/login");
  }

  return <AnkiRecapContent />;
}
