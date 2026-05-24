import { redirect } from "next/navigation";
import { getSession } from "@/src/shared/lib/session";
import { AnkiContent } from "@/src/modules/anki/components/AnkiContent";

export const dynamic = "force-dynamic";

export default async function AnkiPage() {
  const session = await getSession();

  // Proteksi rute: Hanya untuk user yang sudah login
  if (!session) {
    redirect("/login");
  }

  return <AnkiContent username={session.username} />;
}
