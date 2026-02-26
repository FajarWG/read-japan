import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { prisma } from "@/src/lib/db";
import { kanaMap } from "@/src/lib/kana-map";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Progres Belajar",
};

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default async function LearnPage() {
  const records = await prisma.learningProgress.findMany({
    where: {
      OR: [{ clickCount: { gt: 0 } }, { wrongCount: { gt: 0 } }],
    },
    orderBy: [{ wrongCount: "desc" }, { clickCount: "desc" }],
  });

  // Enrich dengan data romaji dari kanaMap
  const enriched = records.map((r) => ({
    ...r,
    info: kanaMap[r.character] ?? null,
  }));

  const totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);
  const totalWrong = records.reduce((sum, r) => sum + r.wrongCount, 0);
  const totalDebt = totalClicks + totalWrong;
  const hasWrong = enriched.some((r) => r.wrongCount > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Progres Belajar
            </h1>
            <p className="text-xs text-muted">Kana yang pernah kamu jelajahi</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Empty state */}
        {enriched.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-28 text-center">
            <span className="font-jp select-none text-7xl opacity-20">あ</span>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">Belum ada progres</p>
              <p className="text-sm text-muted">
                Mulai membaca cerita dan klik huruf kana untuk melacak
                progresmu.
              </p>
            </div>
            <Link href="/" className={buttonVariants({ variant: "primary" })}>
              Ke Daftar Cerita
            </Link>
          </div>
        )}

        {enriched.length > 0 && (
          <>
            {/* Summary */}
            <div className="mb-7 grid grid-cols-3 gap-3">
              {/* Total Klik */}
              <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {totalClicks}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">total klik</p>
              </div>

              {/* Total Salah */}
              <div
                className={[
                  "rounded-xl border px-3 py-3 text-center shadow-sm",
                  totalWrong > 0
                    ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                    : "border-border bg-surface",
                ].join(" ")}
              >
                <p
                  className={[
                    "text-2xl font-bold tabular-nums",
                    totalWrong > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {totalWrong}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">total salah</p>
              </div>

              {/* Klik + Salah */}
              <div
                className={[
                  "rounded-xl border px-3 py-3 text-center shadow-sm",
                  totalDebt > 0
                    ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
                    : "border-border bg-surface",
                ].join(" ")}
              >
                <p
                  className={[
                    "text-2xl font-bold tabular-nums",
                    totalDebt > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {totalDebt}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">klik + salah</p>
              </div>
            </div>

            {/* Section: Perlu dipelajari lagi */}
            {hasWrong && (
              <section className="mb-8">
                <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="text-red-500">⚠️</span> Perlu Dipelajari Lagi
                  <span className="text-xs font-normal text-muted">
                    ({enriched.filter((r) => r.wrongCount > 0).length} huruf)
                  </span>
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {enriched
                    .filter((r) => r.wrongCount > 0)
                    .map((r) => (
                      <KanaProgressCard key={r.character} record={r} />
                    ))}
                </div>
              </section>
            )}

            {/* Section: Semua yang dipelajari */}
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                📖 Kana yang di contek
                <span className="text-xs font-normal text-muted">
                  ({enriched.length} huruf)
                </span>
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {enriched.map((r) => (
                  <KanaProgressCard key={r.character} record={r} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────
// KanaProgressCard
// ─────────────────────────────────────────

type ProgressRecord = {
  character: string;
  clickCount: number;
  wrongCount: number;
  info: (typeof kanaMap)[string] | null;
};

function KanaProgressCard({ record }: { record: ProgressRecord }) {
  const { character, clickCount, wrongCount, info } = record;
  const isWrong = wrongCount > 0;

  return (
    <div
      className={[
        "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center shadow-sm",
        isWrong
          ? "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/20"
          : "border-border bg-surface",
      ].join(" ")}
    >
      {/* Romaji */}
      {info && (
        <span
          className={[
            "text-[11px] font-bold leading-none",
            isWrong
              ? "text-red-500 dark:text-red-400"
              : "text-indigo-500 dark:text-indigo-400",
          ].join(" ")}
        >
          {info.romaji}
        </span>
      )}

      {/* Character */}
      <span className="font-jp text-3xl leading-none text-foreground">
        {character}
      </span>

      {/* Type badge */}
      {info && (
        <span
          className={[
            "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            info.type === "hiragana"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
          ].join(" ")}
        >
          {info.type === "hiragana" ? "hira" : "kata"}
        </span>
      )}

      {/* Counts — tampilkan hutang total per karakter */}
      <div className="flex flex-col items-center gap-0.5 mt-0.5">
        {/* Detail breakdown */}
        <div className="flex flex-wrap justify-center gap-1">
          {clickCount > 0 && (
            <span className="text-[9px] text-muted">👁 {clickCount}</span>
          )}
          {wrongCount > 0 && (
            <span className="text-[9px] text-red-500 dark:text-red-400 font-semibold">
              ✗ {wrongCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
