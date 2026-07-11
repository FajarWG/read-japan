import { redirect } from "next/navigation";
import { getSession } from "@/src/shared/lib/session";
import { KanjiTamagoContent } from "@/src/modules/kanji-tamago/components/KanjiTamagoContent";

export const dynamic = "force-dynamic";

export default async function KanjiTamagoPage() {
  const session = await getSession();

  // Proteksi rute: Hanya untuk user yang sudah login
  if (!session) {
    redirect("/login");
  }

  return <KanjiTamagoContent username={session.username} />;
}
