import type { Metadata } from "next";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { ProgressDashboard } from "@/src/modules/dashboard/components/ProgressDashboard";
import { getProgressStats } from "@/src/modules/dashboard/lib/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progres Belajar — Nihongo Flow",
  description: "Statistik dan analisis progres belajar bahasa Jepangmu.",
};

export default async function ProgressPage() {
  const stats = await getProgressStats();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground leading-tight truncate">
                📊 Progres Belajar
              </h1>
              <p className="text-xs text-muted">Pantau perjalanan belajarmu</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          {stats ? (
            <ProgressDashboard stats={stats} />
          ) : (
            <p className="text-sm text-muted">Tidak dapat memuat progres.</p>
          )}
        </main>
      </div>
    </div>
  );
}
