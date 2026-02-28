import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumbs,
  BreadcrumbsItem,
  buttonVariants,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  Separator,
  Tooltip,
} from "@heroui/react";

import { prisma } from "@/src/lib/db";
import Reader from "@/src/components/Reader";
import { ThemeToggle } from "@/src/components/ThemeToggle";

// ─────────────────────────────────────────
// Metadata dinamis
// ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (isNaN(id)) return {};

  const story = await prisma.story.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: story?.title ?? "Cerita tidak ditemukan",
  };
}

// ─────────────────────────────────────────
// Helper: hitung jumlah karakter kana
// ─────────────────────────────────────────
function countKanaChars(text: string): number {
  const kanaRanges = /[\u3040-\u309f\u30a0-\u30ff]/g;
  return (text.match(kanaRanges) ?? []).length;
}

function estimateReadingTime(text: string): string {
  // ~300 karakter Jepang per menit untuk pelajar pemula
  const mins = Math.ceil(text.length / 300);
  return mins <= 1 ? "< 1 menit" : `${mins} menit`;
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (isNaN(id)) notFound();

  const story = await prisma.story.findUnique({ where: { id } });
  if (!story) notFound();

  const kanaCount = countKanaChars(story.content);
  const readingTime = estimateReadingTime(story.content);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          {/* Breadcrumb */}
          <Breadcrumbs className="text-sm">
            <BreadcrumbsItem>
              <Link
                href="/"
                className="text-muted hover:text-foreground transition-colors"
              >
                🏠 Beranda
              </Link>
            </BreadcrumbsItem>
            <BreadcrumbsItem>
              <span className="text-foreground font-medium line-clamp-1 max-w-45 sm:max-w-xs">
                {story.title}
              </span>
            </BreadcrumbsItem>
          </Breadcrumbs>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "shrink-0",
              })}
            >
              ← Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Story card */}
        <Card className="bg-surface border border-border shadow-sm rounded-2xl overflow-hidden">
          {/* Card header: judul + meta */}
          <CardHeader className="px-8 pt-8 pb-4 flex flex-col gap-3">
            {/* Judul + tooltip */}
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="font-jp text-3xl font-bold leading-snug text-foreground">
                {story.title}
              </CardTitle>
              <Tooltip delay={0}>
                <Tooltip.Trigger>
                  <button
                    type="button"
                    aria-label="Petunjuk membaca"
                    className="mt-1 flex items-center justify-center w-7 h-7 rounded-full text-muted hover:text-foreground hover:bg-surface-muted transition-colors shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className="max-w-72">
                  <div className="flex flex-col gap-2 py-0.5">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-semibold">📖 Mode Membaca</p>
                      <p className="text-xs text-muted">
                        Klik huruf kana (bergaris bawah) untuk melihat cara
                        bacanya. Setiap klik dicatat untuk melacak progres.
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-semibold">✅ Mode Review</p>
                      <p className="text-xs text-muted">
                        Setelah selesai membaca, tandai huruf yang salah dibaca.
                        Hasilnya tersimpan otomatis.
                      </p>
                    </div>
                  </div>
                </Tooltip.Content>
              </Tooltip>
            </div>

            {/* Deskripsi singkat + meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Chip
                variant="soft"
                size="sm"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-medium text-xs"
              >
                ✍️ {kanaCount} kana
              </Chip>
              <Chip
                variant="soft"
                size="sm"
                className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 font-medium text-xs"
              >
                ⏱️ {readingTime}
              </Chip>
              {story.focus && (
                <Chip
                  variant="soft"
                  size="sm"
                  className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 font-medium font-jp text-xs"
                >
                  🎯 {story.focus}
                </Chip>
              )}
            </div>
          </CardHeader>

          {/* Divider */}
          <div className="px-8">
            <Separator className="bg-border" />
          </div>

          {/* Card body: teks cerita */}
          <CardContent className="px-8 pt-6 pb-8">
            <article className="font-jp">
              <Reader
                storyContent={story.content}
                translation={story.translation ?? undefined}
                storyId={story.id}
              />
            </article>
          </CardContent>

          {/* Card footer: info story */}
          <div className="px-8">
            <Separator className="bg-border" />
          </div>
          <CardFooter className="px-8 py-5 flex items-center justify-between text-xs text-muted">
            <span>Story #{story.id}</span>
            <span>
              Dibuat{" "}
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(story.createdAt))}
            </span>
          </CardFooter>
        </Card>

        {/* ── Progress reminder ──────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-muted">
          Progres klikmu tersimpan otomatis di database ✨
        </p>
      </main>
    </div>
  );
}
