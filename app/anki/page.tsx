import { Suspense } from "react";
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

  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-muted">Loading Anki Flashcards...</div>}>
      <AnkiContent username={session.username} />
    </Suspense>
  );
}
