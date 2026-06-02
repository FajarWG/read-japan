import type { Metadata } from "next";
import { PrepContent } from "@/src/modules/prep/components/PrepContent";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prep & Cheat Sheet | Nihongo Flow",
  description:
    "Persiapkan pelajaran bahasa Jepang Anda dengan dialog, tata bahasa, dan daftar kosakata (Prep Sheet).",
  alternates: {
    canonical: "/prep",
  },
};

export default async function PrepPage() {
  const session = await getSession();

  return (
    <PrepContent
      username={session?.username ?? null}
      role={session?.role ?? null}
    />
  );
}
