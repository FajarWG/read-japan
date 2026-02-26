import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  buttonVariants,
  Separator,
} from "@heroui/react";

import { prisma } from "@/src/lib/db";
import { ThemeToggle } from "@/src/components/ThemeToggle";

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default async function Home() {
  const [stories, statsAgg] = await Promise.all([
    prisma.story.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.learningProgress.aggregate({
      _sum: { clickCount: true, wrongCount: true },
      _count: { _all: true },
    }),
  ]);

  const totalKana = statsAgg._count._all;
  const totalClicks = statsAgg._sum.clickCount ?? 0;
  const totalWrong = statsAgg._sum.wrongCount ?? 0;
  const totalDebt = totalClicks + totalWrong;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          {/* Brand */}
          <div>
            <h1 className="font-jp text-lg font-bold leading-tight text-foreground">
              読む日本語
              <span className="ml-2 font-sans text-sm font-normal text-muted">
                Read Japan
              </span>
            </h1>
            <p className="text-xs text-muted">
              Belajar Baca Hiragana &amp; Katakana
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/stories/new"
              className={buttonVariants({
                variant: "primary",
                size: "sm",
                className: "shrink-0",
              })}
            >
              + Tambah Cerita
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* ── Stats row ──────────────────────────────────────── */}
        {totalKana > 0 && (
          <div className="mb-7 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {totalKana}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">kana diklik</p>
            </div>
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
              <p className="mt-0.5 text-[11px] text-muted">total hutang</p>
            </div>
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
          </div>
        )}

        {/* Section heading */}
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Daftar Cerita
          </h2>
          <Chip variant="soft" size="sm" className="text-[11px] font-medium">
            {stories.length} cerita
          </Chip>
        </div>

        <Separator className="bg-border mb-6" />

        {/* Empty state */}
        {stories.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-28 text-center">
            <span className="font-jp select-none text-7xl opacity-20">本</span>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">Belum ada cerita</p>
              <p className="text-sm text-muted">
                Mulai dengan menambah cerita pertama untuk latihan membaca.
              </p>
            </div>
            <Link
              href="/stories/new"
              className={buttonVariants({ variant: "primary" })}
            >
              + Tambah Cerita Pertama
            </Link>
          </div>
        )}

        {/* Story list */}
        {stories.length > 0 && (
          <ul className="flex flex-col gap-3">
            {stories.map((story, i) => (
              <li key={story.id}>
                <Link
                  href={`/read/${story.id}`}
                  className="group block"
                  aria-label={`Baca cerita: ${story.title}`}
                >
                  <Card className="border border-border bg-surface shadow-none transition-all duration-150 hover:border-accent/50 hover:shadow-md rounded-xl">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-3">
                      {/* Left: number + title */}
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-muted">
                          #{i + 1}
                        </span>
                        <CardTitle className="font-jp text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                          {story.title}
                        </CardTitle>
                      </div>

                      {/* Right: badges */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <Chip
                          variant="soft"
                          size="sm"
                          className="text-[11px] font-medium"
                        >
                          ✍️ {countKana(story.content)} kana
                        </Chip>
                        <span className="text-[11px] text-muted whitespace-nowrap">
                          {formatDate(new Date(story.createdAt))}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-5">
                      {/* Content preview */}
                      <p className="font-jp line-clamp-2 text-sm leading-relaxed text-muted">
                        {story.content}
                      </p>

                      {/* "Baca" affordance */}
                      <p className="mt-3 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        Klik untuk membaca →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
