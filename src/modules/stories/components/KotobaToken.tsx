"use client";

import { useTransition } from "react";
import { Popover } from "@heroui/react";

import type { KotobaLookupEntry } from "@/src/modules/prep/lib/kotoba-lookup";
import { recordKotobaLookup } from "@/src/modules/stories/actions";

// ─────────────────────────────────────────
// KotobaToken — kanji / kata dalam cerita yang bisa diklik
// untuk melihat cara baca + artinya. Klik otomatis tercatat ke progress.
// ─────────────────────────────────────────

interface KotobaTokenProps {
  entry: KotobaLookupEntry;
  /** Teks surface yang muncul di cerita (bisa berbeda dari kanji form) */
  surface: string;
  /** Called when the popover opens — records a click to DB */
  onRecordOpen: (progressKey: string) => void;
}

export function KotobaToken({ entry, surface, onRecordOpen }: KotobaTokenProps) {
  const [isPending, startClickTransition] = useTransition();

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return;
        startClickTransition(async () => {
          try {
            await onRecordOpen(entry.progressKey);
          } catch (err) {
            console.error("[KotobaToken] recordOpen gagal:", err);
          }
        });
      }}
    >
      <Popover.Trigger className="inline-flex">
        <button
          type="button"
          aria-label={`${surface} (${entry.hiragana})`}
          className={[
            "relative cursor-pointer select-none rounded px-0.5",
            "transition-all duration-100",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1",
            isPending ? "opacity-70" : "",
            "text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30",
            "underline decoration-amber-300/70 decoration-1 underline-offset-4",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {surface}
        </button>
      </Popover.Trigger>
      <Popover.Content className="max-w-64" placement="top">
        <Popover.Dialog>
          <div className="flex flex-col gap-2">
            <span className="font-jp text-xl font-bold text-foreground">
              {entry.display}
            </span>
            <span className="font-jp text-sm font-semibold text-amber-600 dark:text-amber-400">
              {entry.hiragana}
            </span>
            <p className="text-sm leading-relaxed text-muted">
              {entry.meaning}
            </p>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

// ─────────────────────────────────────────
// Hook untuk handler klik kotoba (DB).
// Setelah Phase 1, semua user wajib login → selalu catat ke server.
// ─────────────────────────────────────────

export function useKotobaClickRecorder() {
  return async (progressKey: string): Promise<void> => {
    await recordKotobaLookup(progressKey);
  };
}