"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

interface SearchHit {
  type: "story" | "prep" | "kanji" | "vocab";
  id: string;
  title: string;
  snippet?: string;
  href: string;
}

interface SearchResponse {
  hits: SearchHit[];
  romajiHint?: string[] | null;
}

const TYPE_LABEL: Record<SearchHit["type"], { label: string; color: string }> = {
  story: { label: "📖 Story", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300" },
  prep: { label: "📚 Prep", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300" },
  kanji: { label: "🈶 Kanji", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  vocab: { label: "📝 Vocab", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
};

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [hint, setHint] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setQ("");
      setHits([]);
      setHint(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || q.length < 1) {
      setHits([]);
      setHint(null);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = (await res.json()) as SearchResponse;
          setHits(data.hits ?? []);
          setHint(data.romajiHint ?? null);
        }
      } catch (err) {
        console.error("[SearchOverlay] fetch:", err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q, open]);

  const handleClose = () => {
    startTransition(() => onClose());
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8"
      onClick={handleClose}
    >
      <div
        className="mt-12 w-full max-w-2xl rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kata, kanji, atau romaji (mis. 'taberu')"
            autoFocus
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="text-muted hover:text-foreground text-xl px-2"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Romaji hint */}
        {hint && hint.length > 0 && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 border-b border-border text-xs text-indigo-700 dark:text-indigo-300">
            💡 Romaji <strong>{q}</strong> → kana: {hint.map((h) => (
              <span key={h} className="font-jp font-bold mx-1">{h}</span>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading && q.length > 0 && (
            <p className="text-sm text-muted text-center py-8">Mencari…</p>
          )}
          {!loading && q.length > 0 && hits.length === 0 && (
            <p className="text-sm text-muted text-center py-8">
              Tidak ada hasil untuk &ldquo;<strong>{q}</strong>&rdquo;
            </p>
          )}
          {q.length === 0 && (
            <div className="text-sm text-muted text-center py-8 space-y-1">
              <p>Ketik untuk mencari di Story, Prep, Kanji, dan Vocab.</p>
              <p className="text-xs">Romaji didukung — coba &ldquo;taberu&rdquo;, &ldquo;kimasu&rdquo;, dll.</p>
            </div>
          )}
          {hits.map((hit) => {
            const lbl = TYPE_LABEL[hit.type];
            return (
              <Link
                key={hit.id}
                href={hit.href}
                onClick={handleClose}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-muted transition-colors"
              >
                <span className={`shrink-0 text-[10px] font-bold uppercase rounded-md px-1.5 py-0.5 ${lbl.color}`}>
                  {lbl.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-jp text-base font-bold text-foreground line-clamp-1">
                    {hit.title}
                  </p>
                  {hit.snippet && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">
                      {hit.snippet}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
