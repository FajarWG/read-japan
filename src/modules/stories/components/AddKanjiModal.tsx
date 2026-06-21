"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@heroui/react";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

export interface AddKanjiPrefill {
  kanji: string;
  hiragana?: string;
  meaningId?: string;
  meaningEn?: string;
  context?: string;
  chapter?: number;
  source?: "ai" | "db";
}

interface AddKanjiModalProps {
  open: boolean;
  prefill: AddKanjiPrefill | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Modal untuk admin menambah kanji ke dictionary.
 *
 * Dua mode input:
 * - 🤖 AI Gemini: auto-fill lewat /api/admin/kanji/suggest
 * - ✍️ Manual: ketik sendiri
 *
 * Save via /api/admin/kanji (POST). Setelah save, onSaved() dipanggil
 * agar parent bisa refresh story tokens / state.
 */
export function AddKanjiModal({
  open,
  prefill,
  onClose,
  onSaved,
}: AddKanjiModalProps) {
  const { t } = useLanguage();
  const [kanji, setKanji] = useState("");
  const [hiragana, setHiragana] = useState("");
  const [meaningId, setMeaningId] = useState("");
  const [meaningEn, setMeaningEn] = useState("");
  const [chapter, setChapter] = useState<string>("");
  const [aiBusy, startAi] = useTransition();
  const [saveBusy, startSave] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"ai" | "db" | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);

  // Sync prefill → state when modal opens
  // (controlled by parent: prefill is null when closed)
  if (!open || !prefill) return null;

  const handleAiSuggest = () => {
    setError(null);
    setAiSource(null);
    setAiNote(null);
    startAi(async () => {
      try {
        const res = await fetch("/api/admin/kanji/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kanji: prefill.kanji,
            context: prefill.context,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 429) {
            setError(
              `Rate limit AI tercapai. Coba lagi nanti atau isi manual.`,
            );
          } else {
            setError(data.error ?? "Gagal AI suggest");
          }
          return;
        }
        setHiragana(data.hiragana ?? "");
        setMeaningId(data.meaningId ?? "");
        setMeaningEn(data.meaningEn ?? "");
        if (data.chapter && !chapter) setChapter(String(data.chapter));
        setAiSource(data.source ?? "ai");
        if (data.source === "db") {
          setAiNote("✓ Kanji ini sudah ada di database — data di-prefill.");
        }
      } catch (err) {
        console.error("[AddKanjiModal] AI suggest:", err);
        setError("Gagal terhubung ke AI service");
      }
    });
  };

  const handleSave = () => {
    setError(null);
    if (!kanji.trim() || !hiragana.trim()) {
      setError("Kanji dan hiragana wajib diisi.");
      return;
    }
    startSave(async () => {
      try {
        const res = await fetch("/api/admin/kanji", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kanji: kanji.trim(),
            hiragana: hiragana.trim(),
            meaningId: meaningId.trim() || undefined,
            meaningEn: meaningEn.trim() || undefined,
            chapter: chapter ? Number(chapter) : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Gagal menyimpan");
          return;
        }
        onSaved();
        handleClose();
      } catch (err) {
        console.error("[AddKanjiModal] save:", err);
        setError("Gagal menyimpan kanji");
      }
    });
  };

  const handleClose = () => {
    setKanji("");
    setHiragana("");
    setMeaningId("");
    setMeaningEn("");
    setChapter("");
    setError(null);
    setAiSource(null);
    setAiNote(null);
    onClose();
  };

  // Initialize from prefill each time modal opens (controlled by key remount below)
  return (
    <InitFields
      key={`${prefill.kanji}-${open}`}
      prefill={prefill}
      onMount={(p) => {
        setKanji(p.kanji);
        if (p.hiragana) setHiragana(p.hiragana);
        if (p.meaningId) setMeaningId(p.meaningId);
        if (p.meaningEn) setMeaningEn(p.meaningEn);
        if (p.chapter) setChapter(String(p.chapter));
        if (p.source === "db") {
          setAiNote("✓ Kanji ini sudah ada di database.");
          setAiSource("db");
        }
      }}
    >
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">
                ➕ Tambah Kanji ke Dictionary
              </p>
              <p className="text-[10px] text-muted">
                {aiSource === "db"
                  ? "Data sudah ada di DB"
                  : aiSource === "ai"
                    ? "Diisi otomatis oleh AI"
                    : "Isi manual atau pakai AI Gemini"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-muted hover:text-foreground text-xl px-2"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3 p-5 max-h-[70vh] overflow-y-auto">
            {/* Kanji display + AI button */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 flex flex-col items-center gap-1 rounded-xl border-2 border-accent/30 bg-accent/5 px-4 py-3">
                <span className="font-jp text-4xl font-bold text-foreground leading-none">
                  {kanji || "?"}
                </span>
                <span className="text-[9px] text-muted uppercase tracking-wide">
                  kanji
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-xs text-muted">Cara baca &amp; arti:</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onPress={handleAiSuggest}
                  isDisabled={aiBusy || !kanji.trim()}
                  className="font-semibold cursor-pointer"
                >
                  {aiBusy ? "⏳ Meminta AI..." : "🤖 Auto-fill (Gemini)"}
                </Button>
                {aiNote && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {aiNote}
                  </p>
                )}
                {prefill.context && (
                  <p className="text-[10px] text-muted italic line-clamp-2 mt-1">
                    Konteks: &ldquo;{prefill.context}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Form fields */}
            <Field
              label="Hiragana *"
              placeholder="たべる"
              value={hiragana}
              onChange={setHiragana}
            />
            <Field
              label="Arti (English)"
              placeholder="to eat"
              value={meaningEn}
              onChange={setMeaningEn}
            />
            <Field
              label="Arti (Indonesia)"
              placeholder="makan"
              value={meaningId}
              onChange={setMeaningId}
            />
            <Field
              label="Bab (1-15, opsional)"
              placeholder="mis. 3"
              value={chapter}
              onChange={setChapter}
              type="number"
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-surface-muted/30">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onPress={handleClose}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onPress={handleSave}
              isDisabled={saveBusy || !kanji.trim() || !hiragana.trim()}
              className="font-bold cursor-pointer"
            >
              {saveBusy ? "..." : "💾 Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </InitFields>
  );
}

// ─────────────────────────────────────────────────────────
// InitFields — side-effect component to seed form state
// on mount. Re-keyed by parent so it remounts each open.
// ─────────────────────────────────────────────────────────

function InitFields({
  prefill,
  onMount,
  children,
}: {
  prefill: AddKanjiPrefill;
  onMount: (p: AddKanjiPrefill) => void;
  children: React.ReactNode;
}) {
  // Run once on mount; the parent re-keys this component each open so it remounts.
  useEffect(() => {
    onMount(prefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
