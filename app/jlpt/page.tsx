import type { Metadata } from "next";
import Link from "next/link";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "JLPT Mock Test — Nihongo Flow",
  description: "Latihan soal JLPT N5/N4/N3 dengan timer dan skor.",
};

export default async function JlptIndexPage() {
  const session = await getSession();
  if (!session) return null;

  // Count soal per level
  const levels = ["N5", "N4", "N3"] as const;
  const counts = await Promise.all(
    levels.map((lvl) =>
      prisma.jLPTQuestion.count({ where: { level: lvl } }),
    ),
  );

  // History attempts
  const attempts = await prisma.jLPTAttempt.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                🎯 JLPT Mock Test
              </h1>
              <p className="text-xs text-muted">
                Pilih level dan mulai latihan soal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
              >
                ← Home
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 flex flex-col gap-5">
          {/* Level cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {levels.map((lvl, i) => (
              <Link
                key={lvl}
                href={`/jlpt/${lvl}`}
                className={[
                  "rounded-2xl border-2 px-5 py-5 text-left transition-all hover:shadow-md cursor-pointer",
                  counts[i] > 0
                    ? "border-accent/30 bg-surface hover:border-accent/60"
                    : "border-border bg-surface opacity-50 cursor-not-allowed",
                ].join(" ")}
              >
                <p className="text-3xl font-bold text-foreground">{lvl}</p>
                <p className="text-xs text-muted mt-1">
                  {counts[i] > 0 ? `${counts[i]} soal tersedia` : "Belum ada soal"}
                </p>
                <p className="text-[10px] text-muted mt-0.5">
                  ~{Math.max(1, Math.ceil(counts[i] / 10)) * 5} menit
                </p>
              </Link>
            ))}
          </div>

          {/* History */}
          {attempts.length > 0 && (
            <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-foreground">
                📊 Riwayat attempt
              </p>
              <div className="flex flex-col gap-2">
                {attempts.map((a) => {
                  const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted/30 px-3 py-2 text-xs"
                    >
                      <span className="font-bold text-foreground tabular-nums">{a.level}</span>
                      <span className="text-muted">{a.score}/{a.total}</span>
                      <span
                        className={[
                          "font-bold tabular-nums",
                          pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-500",
                        ].join(" ")}
                      >
                        {pct}%
                      </span>
                      <span className="ml-auto text-muted">
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
