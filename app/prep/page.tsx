import { redirect } from "next/navigation";
import { getSession } from "@/src/shared/lib/session";
import { PrepContent } from "@/src/modules/prep/components/PrepContent";

export const dynamic = "force-dynamic";

export default async function PrepPage() {
  const session = await getSession();

  // Proteksi rute: Hanya untuk user yang sudah login
  if (!session) {
    redirect("/login");
  }

  return <PrepContent username={session.username} role={session.role} />;
}
