import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { prisma } from "@/src/shared/lib/db";
import { getDekiruChapters } from "@/src/modules/prep/lib/kotoba-lookup";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { getSession } from "@/src/shared/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Nihongo Flow",
};

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 px-6 py-8 text-center max-w-md">
          <p className="text-2xl">🔒</p>
          <p className="mt-2 text-base font-semibold text-foreground">
            Akses ditolak
          </p>
          <p className="mt-1 text-sm text-muted">
            Hanya admin yang bisa mengakses halaman ini.
          </p>
          <Link
            href="/stories"
            className={buttonVariants({
              variant: "secondary",
              className: "mt-4",
            })}
          >
            ← Kembali
          </Link>
        </div>
      </div>
    );
  }

  const [storyCount, kanjiCount, chapters] = await Promise.all([
    prisma.story.count(),
    prisma.kanjiDictionary.count(),
    Promise.resolve(getDekiruChapters()),
  ]);

  const dekiruStoryCount = await prisma.story.count({
    where: { chapter: { not: null } },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground">
                🛠️ Admin Dashboard
              </h1>
              <p className="text-[10px] sm:text-xs text-muted">
                Kelola cerita & kanji Nihongo Flow
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/stories"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                ← Stories
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 py-8">
          {/* Stats row */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm">
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {storyCount}
              </p>
              <p className="mt-0.5 text-xs text-muted">total cerita</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                {dekiruStoryCount} Dekiru
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm">
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {chapters.length}
              </p>
              <p className="mt-0.5 text-xs text-muted">bab Dekiru</p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">
                {dekiruStoryCount === chapters.length * 3
                  ? "✓ semua lengkap"
                  : `${dekiruStoryCount}/${chapters.length * 3} cerita`}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm">
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {kanjiCount}
              </p>
              <p className="mt-0.5 text-xs text-muted">admin kanji</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                KanjiDictionary
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/stories/admin/kanji"
              className="group block rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/10 px-5 py-4 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    📚 Kelola Kanji
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Tambah kanji baru ke KanjiDictionary (otomatis clickable di
                    cerita)
                  </p>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/stories/new"
              className="group block rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/10 px-5 py-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    ✍️ Tambah Cerita
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Buat cerita baru + paste JSON batch + LLM prompt
                  </p>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  →
                </span>
              </div>
            </Link>
          </div>

          {/* Tips */}
          <div className="mt-6 rounded-2xl border border-border bg-surface-muted/50 px-5 py-4">
            <p className="text-xs font-semibold text-foreground">
              💡 Workflow yang disarankan:
            </p>
            <ol className="mt-2 space-y-1 text-[11px] text-muted leading-relaxed">
              <li>
                1. Buka cerita → klik kanji yang belum bisa diklik (artinya
                &quot;no lookup match&quot;)
              </li>
              <li>2. Catat kanji + cara baca + artinya</li>
              <li>
                3. Pergi ke{" "}
                <Link
                  href="/stories/admin/kanji"
                  className="text-amber-600 dark:text-amber-400 underline"
                >
                  Kelola Kanji
                </Link>{" "}
                untuk tambah ke KanjiDictionary (sekaligus copy prompt LLM
                untuk bulk-add)
              </li>
              <li>4. Kanji otomatis clickable di semua cerita setelah data masuk</li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}