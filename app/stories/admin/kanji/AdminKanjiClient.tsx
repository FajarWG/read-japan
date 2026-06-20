"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TextField,
  Label,
  Input,
  TextArea,
  Chip,
} from "@heroui/react";

import {
  createKanji,
  createManyKanji,
  deleteKanji,
  type KanjiInput,
} from "@/src/modules/stories/actions";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

// ─────────────────────────────────────────
// Prompt LLM untuk generate kanji
// ─────────────────────────────────────────
const KANJI_LLM_PROMPT = `Anda adalah asisten AI bahasa Jepang. Tolong ekstrak daftar kosakata dari teks bahasa Jepang yang akan saya berikan.

### TUGAS:
Untuk SETIAP kanji / kata bahasa Jepang yang muncul (yang mungkin perlu diketahui pembelajar tingkat N5-N3), berikan:
1. **kanji** — bentuk kanji asli (atau "-" jika hanya kana)
2. **hiragana** — cara baca dalam hiragana
3. **meaningId** — terjemahan bahasa Indonesia (singkat, 1-5 kata)
4. **meaningEn** — terjemahan bahasa Inggris (singkat, 1-5 kata)
5. **chapter** — bab Dekiru Nihongo yang paling relevan (1-15), atau null jika tidak tahu

### FORMAT JSON YANG HARUS DIHASILKAN:
[
  {
    "kanji": "食べる",
    "hiragana": "たべる",
    "meaningId": "makan",
    "meaningEn": "to eat",
    "chapter": 8
  },
  {
    "kanji": "駅",
    "hiragana": "えき",
    "meaningId": "stasiun",
    "meaningEn": "station",
    "chapter": 4
  }
]

### ATURAN:
1. Output HANYA JSON valid tanpa markdown wrapper.
2. Skip particles (は、が、を、に、で、へ、から、まで、のと) kecuali jika termasuk vocabulary penting.
3. Hanya masukkan kata yang relevan untuk pembelajar (skip proper names jika terlalu spesifik).
4. Jangan duplikat entry yang sama.
5. Prioritaskan kata benda, kata kerja, dan kata sifat yang sering dipakai.

### TEKS JEPANG:
[PASTE TEKS DI SINI]`;

// ─────────────────────────────────────────
// Single form — tambah 1 kanji manual
// ─────────────────────────────────────────

function SingleKanjiForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useLanguage();
  const [kanji, setKanji] = useState("");
  const [hiragana, setHiragana] = useState("");
  const [meaningId, setMeaningId] = useState("");
  const [meaningEn, setMeaningEn] = useState("");
  const [chapter, setChapter] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    setSuccess(false);
    if (!kanji.trim() || !hiragana.trim()) {
      setError("Kanji dan Hiragana wajib diisi.");
      return;
    }
    startTransition(async () => {
      try {
        await createKanji({
          kanji: kanji.trim(),
          hiragana: hiragana.trim(),
          meaningId: meaningId.trim() || undefined,
          meaningEn: meaningEn.trim() || undefined,
          chapter: chapter ? Number(chapter) : undefined,
          notes: notes.trim() || undefined,
        });
        setSuccess(true);
        setKanji("");
        setHiragana("");
        setMeaningId("");
        setMeaningEn("");
        setChapter("");
        setNotes("");
        onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          ✅ Tersimpan!
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Kanji <span className="text-red-500">*</span>
          </Label>
          <Input
            variant="primary"
            value={kanji}
            onChange={(e) => setKanji(e.target.value)}
            placeholder="食べる"
            className="font-jp"
          />
        </TextField>
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Hiragana <span className="text-red-500">*</span>
          </Label>
          <Input
            variant="primary"
            value={hiragana}
            onChange={(e) => setHiragana(e.target.value)}
            placeholder="たべる"
            className="font-jp"
          />
        </TextField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Arti (ID) <span className="text-muted text-xs">opsional</span>
          </Label>
          <Input
            variant="primary"
            value={meaningId}
            onChange={(e) => setMeaningId(e.target.value)}
            placeholder="makan"
          />
        </TextField>
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Meaning (EN) <span className="text-muted text-xs">optional</span>
          </Label>
          <Input
            variant="primary"
            value={meaningEn}
            onChange={(e) => setMeaningEn(e.target.value)}
            placeholder="to eat"
          />
        </TextField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Bab Dekiru <span className="text-muted text-xs">1-15</span>
          </Label>
          <Input
            type="number"
            min={1}
            max={15}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            variant="primary"
            placeholder="8"
            inputMode="numeric"
          />
        </TextField>
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">
            Notes <span className="text-muted text-xs">optional</span>
          </Label>
          <Input
            variant="primary"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Verb group 2"
          />
        </TextField>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className={buttonVariants({
            variant: "primary",
            className: "min-w-32",
          })}
        >
          {isPending ? t.saving : "💾 Simpan"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Bulk form — paste JSON array
// ─────────────────────────────────────────

function BulkKanjiForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useLanguage();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [failedCount, setFailedCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPrompt, setShowPrompt] = useState(false);

  function handleSubmit() {
    setError(null);
    setSuccessCount(null);
    setFailedCount(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError("JSON tidak valid.");
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setError("JSON harus berupa array minimal 1 item.");
      return;
    }

    // Validate each item
    for (const [i, item] of (parsed as KanjiInput[]).entries()) {
      if (typeof item !== "object" || item === null) {
        setError(`Item ${i + 1}: harus object.`);
        return;
      }
      if (!item.kanji?.toString().trim() || !item.hiragana?.toString().trim()) {
        setError(`Item ${i + 1}: kanji & hiragana wajib diisi.`);
        return;
      }
    }

    startTransition(async () => {
      try {
        const result = await createManyKanji(parsed as KanjiInput[]);
        setSuccessCount(result.count);
        setFailedCount(result.failed);
        if (result.failed === 0) setJsonText("");
        onSuccess();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  function handleCopyPrompt() {
    navigator.clipboard.writeText(KANJI_LLM_PROMPT);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* LLM Prompt section */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            🤖 LLM Prompt — Generate JSON dari teks Jepang
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowPrompt((v) => !v)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline focus:outline-none"
            >
              {showPrompt ? "Sembunyikan" : "Lihat prompt"}
            </button>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline focus:outline-none"
            >
              📋 Copy
            </button>
          </div>
        </div>
        {showPrompt && (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-green-300 leading-relaxed font-mono max-h-96 overflow-y-auto">
            {KANJI_LLM_PROMPT}
          </pre>
        )}
        <p className="text-[11px] text-muted mt-2">
          💡 Kirim prompt ini ke ChatGPT / Claude / Gemini dengan teks Jepang
          yang ingin di-extract vocab-nya.
        </p>
      </div>

      {/* JSON textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">
          Paste JSON array di sini
          {jsonText.trim() && (
            <span className="ml-2 text-xs text-muted">
              ({jsonText.length} karakter)
            </span>
          )}
        </label>
        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
            setSuccessCount(null);
          }}
          rows={12}
          placeholder={`[\n  {\n    "kanji": "食べる",\n    "hiragana": "たべる",\n    "meaningId": "makan",\n    "meaningEn": "to eat",\n    "chapter": 8\n  }\n]`}
          spellCheck={false}
          className={[
            "w-full rounded-xl border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-foreground",
            "placeholder:text-muted resize-none outline-none transition-colors",
            "focus:border-accent focus:ring-2 focus:ring-accent-soft-hover",
            error ? "border-red-400 dark:border-red-600" : "border-border",
          ].join(" ")}
        />
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}
      {successCount !== null && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          ✅ Berhasil: {successCount}
          {failedCount !== null && failedCount > 0 && ` · Gagal: ${failedCount}`}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !jsonText.trim()}
          className={buttonVariants({
            variant: "primary",
            className: "min-w-32",
          })}
        >
          {isPending ? t.saving : "💾 Simpan semua"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// List existing kanji + delete
// ─────────────────────────────────────────

function KanjiList({
  kanjiList,
  onRefresh,
}: {
  kanjiList: Array<{
    id: number;
    kanji: string;
    hiragana: string;
    meaningId: string | null;
    meaningEn: string | null;
    chapter: number | null;
    createdAt: Date;
  }>;
  onRefresh: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");

  const filtered = kanjiList.filter((k) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      k.kanji.includes(filter) ||
      k.hiragana.includes(filter) ||
      (k.meaningId ?? "").toLowerCase().includes(q) ||
      (k.meaningEn ?? "").toLowerCase().includes(q)
    );
  });

  function handleDelete(id: number) {
    if (!confirm("Hapus kanji ini?")) return;
    startTransition(async () => {
      try {
        await deleteKanji(id);
        onRefresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal menghapus.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input
          variant="primary"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="🔍 Filter kanji / hiragana / arti..."
          className="flex-1"
        />
        <Chip size="sm" variant="soft" className="shrink-0">
          {filtered.length} / {kanjiList.length}
        </Chip>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface-muted/40 px-4 py-6 text-center">
            <p className="text-sm text-muted">
              {kanjiList.length === 0
                ? "Belum ada kanji di KanjiDictionary."
                : "Tidak ada hasil filter."}
            </p>
          </div>
        ) : (
          filtered.map((k) => (
            <div
              key={k.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-jp text-base font-semibold text-foreground">
                    {k.kanji}
                  </span>
                  <span className="font-jp text-xs text-amber-700 dark:text-amber-400">
                    {k.hiragana}
                  </span>
                  {k.chapter != null && (
                    <Chip
                      size="sm"
                      variant="soft"
                      className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-[9px] h-4 px-1.5"
                    >
                      Bab {k.chapter}
                    </Chip>
                  )}
                </div>
                {(k.meaningId || k.meaningEn) && (
                  <p className="text-[11px] text-muted line-clamp-1">
                    {k.meaningId && `🇮🇩 ${k.meaningId}`}
                    {k.meaningId && k.meaningEn && " · "}
                    {k.meaningEn && `🇬🇧 ${k.meaningEn}`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(k.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-700 dark:text-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                aria-label="Hapus"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main page
// ─────────────────────────────────────────

export default function AdminKanjiPage({
  initialKanjiList,
}: {
  initialKanjiList: Array<{
    id: number;
    kanji: string;
    hiragana: string;
    meaningId: string | null;
    meaningEn: string | null;
    chapter: number | null;
    createdAt: Date;
  }>;
}) {
  const { t } = useLanguage();
  const [kanjiList, setKanjiList] = useState(initialKanjiList);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function refresh() {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/kanji");
      if (res.ok) {
        const data = await res.json();
        setKanjiList(data);
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href="/stories/admin"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-muted",
                })}
              >
                ← Admin
              </Link>
              <span className="text-border">/</span>
              <span className="text-sm font-medium text-foreground truncate">
                📚 Kelola Kanji
              </span>
            </div>
            <SettingsDropdown />
          </div>
        </header>

        <main className="px-4 py-6">
          <Card className="border border-border bg-surface shadow-sm rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="text-lg font-bold text-foreground">
                📚 KanjiDictionary
              </CardTitle>
              <p className="text-xs text-muted mt-1">
                Kanji yang ditambahkan admin akan otomatis clickable di semua
                cerita (Lookup popover + vocabulary review). Tidak bergantung
                pada bab.
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Tabs variant="primary" className="w-full">
                <TabList className="mb-5">
                  <Tab id="single">➕ Single</Tab>
                  <Tab id="bulk">📦 Bulk (JSON)</Tab>
                  <Tab id="list">
                    📋 List ({kanjiList.length})
                    {isRefreshing && " ⟳"}
                  </Tab>
                </TabList>

                <TabPanel id="single">
                  <SingleKanjiForm onSuccess={refresh} />
                </TabPanel>

                <TabPanel id="bulk">
                  <BulkKanjiForm onSuccess={refresh} />
                </TabPanel>

                <TabPanel id="list">
                  <KanjiList kanjiList={kanjiList} onRefresh={refresh} />
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}