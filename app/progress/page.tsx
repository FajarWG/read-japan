import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progres Belajar — Nihongo Flow",
  description: "Statistik dan analisis progres belajar bahasa Jepangmu.",
};

/**
 * Konten halaman ini sudah dipindahkan ke halaman utama `/`
 * (lihat app/page.tsx dan HomeContent di src/modules/stories).
 * Redirect untuk backward compatibility (bookmark / link lama).
 */
export default function ProgressPage() {
  redirect("/");
}
