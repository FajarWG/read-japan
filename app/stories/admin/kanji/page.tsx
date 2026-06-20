import { redirect } from "next/navigation";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import AdminKanjiClient from "./AdminKanjiClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Kanji | Admin Nihongo Flow",
};

export default async function AdminKanjiPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/stories");

  const kanjiList = await prisma.kanjiDictionary.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return <AdminKanjiClient initialKanjiList={kanjiList} />;
}