"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

interface Bookmark {
  id: number;
  storyId: number;
  sentence: string;
  hiragana: string | null;
  translation: string | null;
  charIndex: number;
  length: number;
  note: string | null;
  createdAt: string;
  story: { id: number; title: string };
}

export default function BookmarksPage() {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks ?? []);
      }
    } catch (err) {
      console.error("[BookmarksPage] fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Hapus bookmark ini?")) return;
    startTransition(async () => {
      try {
        await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
        await fetchBookmarks();
      } catch (err) {
        console.error("[BookmarksPage] delete:", err);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                🔖 Bookmark
              </h1>
              <p className="text-xs text-muted">
                {bookmarks.length} cerita tersimpan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/stories"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                ← Stories
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          {loading ? (
            <p className="text-sm text-muted text-center py-12">Memuat…</p>
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-6xl opacity-20">📑</span>
              <p className="text-sm font-medium text-foreground">
                Belum ada bookmark
              </p>
              <p className="text-xs text-muted max-w-sm">
                Buka cerita dan klik tombol Bookmark untuk menyimpan di sini.
              </p>
              <Link
                href="/stories"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                📚 Pilih cerita
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bookmarks.map((b) => (
                <article
                  key={b.id}
                  className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <Link
                      href={`/stories/read/${b.storyId}`}
                      className="text-sm font-bold text-foreground hover:text-accent line-clamp-1"
                    >
                      {b.story.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id)}
                      className="shrink-0 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                      aria-label="Hapus bookmark"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                  <p className="font-jp text-base leading-relaxed text-foreground line-clamp-3">
                    {b.sentence}
                  </p>
                  {b.translation && (
                    <p className="text-xs text-muted mt-1.5 italic line-clamp-2">
                      {b.translation}
                    </p>
                  )}
                  <p className="text-[10px] text-muted mt-1.5">
                    Disimpan: {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
