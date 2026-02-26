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
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
  });

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
