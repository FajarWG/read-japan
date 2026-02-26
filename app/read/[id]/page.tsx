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
} from "@heroui/react";

import { prisma } from "@/src/lib/db";
import Reader from "@/src/components/Reader";

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

          {/* Back button */}
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
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Story card */}
        <Card className="bg-surface border border-border shadow-sm rounded-2xl overflow-hidden">
          {/* Card header: judul + meta */}
          <CardHeader className="px-8 pt-8 pb-4 flex flex-col gap-3">
            {/* Judul */}
            <CardTitle className="font-jp text-3xl font-bold leading-snug text-foreground">
              {story.title}
            </CardTitle>

            {/* Deskripsi singkat + meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Chip
                variant="soft"
                size="sm"
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium text-xs"
              >
                📖 Cerita Pendek
              </Chip>
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
            </div>
          </CardHeader>

          {/* Divider */}
          <div className="px-8">
            <Separator className="bg-border" />
          </div>

          {/* Tip bar */}
          <div className="mx-8 mt-5 rounded-xl bg-surface-muted border border-border px-4 py-3 text-sm text-muted flex items-start gap-2">
            <span className="text-lg leading-none mt-0.5">💡</span>
            <p>
              Klik pada{" "}
              <span className="underline underline-offset-2 decoration-indigo-400 font-medium text-foreground">
                huruf kana
              </span>{" "}
              untuk melihat cara bacanya (romaji) dan penjelasan modifikasinya.
              Setiap klik dicatat untuk membantu lacak progres belajarmu.
            </p>
          </div>

          {/* Card body: teks cerita */}
          <CardContent className="px-8 pt-6 pb-8">
            <article className="font-jp">
              <Reader storyContent={story.content} />
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
