import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progres Belajar — Nihongo Flow",
  description: "Statistik dan analisis progres belajar bahasa Jepangmu.",
};

/**
 * Konten halaman ini sudah dipindahkan ke halaman utama `/`.
 * (Lihat app/page.tsx → HomeDashboard.)
 * Redirect untuk backward compat (bookmark / link lama).
 */
export default function ProgressPage() {
  redirect("/");
}
