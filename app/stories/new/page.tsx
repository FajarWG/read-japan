"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabListContainer,
  TabList,
  Tab,
  TabPanel,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Separator,
  Chip,
} from "@heroui/react";

import {
  createStory,
  createManyStories,
  type ActionState,
  type BatchStory,
} from "@/src/app/stories/actions";
import { ThemeToggle } from "@/src/components/ThemeToggle";

// ─────────────────────────────────────────
// JSON template untuk ditampilkan ke user
// ─────────────────────────────────────────
const JSON_TEMPLATE: BatchStory[] = [
  {
    title: "はじめての日本語",
    content:
      "きょうはいいてんきですね。わたしはがくせいです。にほんごをべんきょうしています。",
    translation:
      "Hari ini cuacanya bagus ya. Saya adalah seorang siswa. Saya sedang belajar bahasa Jepang.",
    focus: "あいうえお のむは がく にほんご へ",
  },
  {
    title: "東京の朝",
    content:
      "あさはやくおきました。でんしゃにのってとうきょうえきにいきます。まちはにぎやかです。",
    translation:
      "Saya bangun pagi-pagi. Saya naik kereta menuju Stasiun Tokyo. Kotanya sangat ramai.",
    focus: "あさ でんしゃ まち きました",
  },
  {
    title: "カフェにて",
    content:
      "コーヒーをのみながらほんをよんでいます。しずかなカフェがすきです。",
    translation:
      "Saya membaca buku sambil minum kopi. Saya suka kafe yang tenang.",
    focus: "カタカナ コーヒー カフェ のみがら よんでいます",
  },
];

// ─────────────────────────────────────────
// SingleStoryForm — tab pertama
// ─────────────────────────────────────────
function SingleStoryForm() {
  const initialState: ActionState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(
    createStory,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Error banner */}
      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          ⚠️ {state.message}
        </div>
      )}

      {/* Title field */}
      <TextField name="title" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          Judul Cerita
        </Label>
        <Input
          variant="primary"
          fullWidth
          placeholder="Contoh: はじめての日本語"
          required
          autoFocus
          className="font-jp"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Content field */}
      <TextField name="content" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          Konten <span className="font-normal text-muted">(teks Jepang)</span>
        </Label>
        <TextArea
          variant="primary"
          fullWidth
          rows={8}
          placeholder={"きょうはいいてんきですね。\nわたしはがくせいです。"}
          required
          className="font-jp resize-none leading-relaxed"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Translation field */}
      <TextField name="translation" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          Arti{" "}
          <span className="font-normal text-muted">
            (terjemahan Indonesia, opsional) — pisahkan kalimat dengan titik (.)
          </span>
        </Label>
        <TextArea
          variant="primary"
          fullWidth
          rows={4}
          placeholder={
            "Hari ini cuacanya bagus ya.\nSaya adalah seorang siswa."
          }
          className="resize-none leading-relaxed"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Focus field */}
      <TextField name="focus" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          Fokus Huruf{" "}
          <span className="font-normal text-muted">
            (deskripsi singkat kana di cerita ini, opsional)
          </span>
        </Label>
        <Input
          variant="primary"
          fullWidth
          placeholder="Contoh: hiragana dasar あいうえお, katakana コーヒーカフェ"
          className="font-jp"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Batal
        </Link>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isPending}
          className="min-w-28"
        >
          {isPending ? "Menyimpan…" : "Simpan Cerita"}
        </Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────
// BatchStoryForm — tab kedua
// ─────────────────────────────────────────
function BatchStoryForm() {
  const router = useRouter();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showTemplate, setShowTemplate] = useState(false);

  function handleSubmit() {
    setError(null);
    setSuccessCount(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError("JSON tidak valid. Periksa format dan tanda baca.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setError("JSON harus berupa array: [ {...}, {...} ]");
      return;
    }
    if (parsed.length === 0) {
      setError("Array tidak boleh kosong.");
      return;
    }
    for (const [i, item] of (parsed as BatchStory[]).entries()) {
      if (typeof item !== "object" || item === null) {
        setError(`Item ke-${i + 1}: harus berupa object.`);
        return;
      }
      if (!item.title?.trim()) {
        setError(`Item ke-${i + 1}: field 'title' wajib diisi.`);
        return;
      }
      if (!item.content?.trim()) {
        setError(`Item ke-${i + 1}: field 'content' wajib diisi.`);
        return;
      }
    }

    startTransition(async () => {
      try {
        const result = await createManyStories(parsed as BatchStory[]);
        setSuccessCount(result.count);
        setJsonText("");
        // Navigasi ke home setelah 1.5 detik
        setTimeout(() => router.push("/"), 1500);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan server.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Template section */}
      <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            📋 Format JSON yang diperlukan
          </p>
          <button
            type="button"
            onClick={() => setShowTemplate((v) => !v)}
            className="text-xs text-accent hover:underline focus:outline-none"
          >
            {showTemplate ? "Sembunyikan" : "Lihat template"}
          </button>
        </div>

        {showTemplate && (
          <div className="relative mt-3">
            <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-green-300 leading-relaxed font-mono">
              {JSON.stringify(JSON_TEMPLATE, null, 2)}
            </pre>
            {/* Copy button */}
            <button
              type="button"
              onClick={() => {
                setJsonText(JSON.stringify(JSON_TEMPLATE, null, 2));
                setShowTemplate(false);
              }}
              className="absolute right-3 top-3 rounded-md bg-white/10 px-2 py-1 text-[10px] text-white/80 hover:bg-white/20 transition-colors"
            >
              Pakai template ini
            </button>
          </div>
        )}

        {/* Schema description */}
        {!showTemplate && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              title
            </code>
            <span>string, wajib</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              content
            </code>
            <span>string, wajib</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              translation
            </code>
            <span>string, opsional</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              focus
            </code>
            <span>string, opsional</span>
          </div>
        )}
      </div>

      {/* JSON textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Tempel JSON di sini
          {jsonText.trim() && (
            <span className="ml-2 font-normal text-muted text-xs">
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
          placeholder={
            '[\n  {\n    "title": "はじめての日本語",\n    "content": "きょうはいいてんきですね。"\n  }\n]'
          }
          spellCheck={false}
          className={[
            "w-full rounded-xl border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-foreground",
            "placeholder:text-muted resize-none outline-none transition-colors",
            "focus:border-accent focus:ring-2 focus:ring-accent-soft-hover",
            error ? "border-red-400 dark:border-red-600" : "border-border",
          ].join(" ")}
        />
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}
      {successCount !== null && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          ✅ Berhasil menyimpan <strong>{successCount} cerita</strong>.
          Mengarahkan ke beranda…
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-xs text-muted">
          Maksimum tidak terbatas. Setiap item divalidasi sebelum disimpan.
        </p>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Batal
          </Link>
          <Button
            variant="primary"
            isDisabled={isPending || !jsonText.trim()}
            onPress={handleSubmit}
            className="min-w-32"
          >
            {isPending ? "Menyimpan…" : "Simpan Semua"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function NewStoryPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-2xl flex-col">
        {/* Header */}
        <header className="border-b border-border bg-surface/80 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-muted",
                })}
              >
                ← Beranda
              </Link>
              <span className="text-border">/</span>
              <span className="text-sm font-medium text-foreground">
                Tambah Cerita
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Chip variant="soft" size="sm" className="text-xs font-medium">
                Admin
              </Chip>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 py-8">
          <Card className="border border-border bg-surface shadow-sm rounded-2xl">
            <CardHeader className="px-8 pt-7 pb-4">
              <CardTitle className="text-xl font-bold text-foreground">
                Tambah Cerita Baru
              </CardTitle>
              <p className="mt-1 text-sm text-muted">
                Masukkan teks Jepang untuk latihan membaca. Kana akan dideteksi
                otomatis.
              </p>
            </CardHeader>

            <div className="px-8">
              <Separator className="bg-border" />
            </div>

            <CardContent className="px-8 py-6">
              {/* Tabs */}
              <Tabs variant="primary" className="w-full">
                <TabListContainer className="mb-6">
                  <TabList className="w-full sm:w-auto">
                    <Tab id="single">
                      ✏️ Satu Cerita
                      <Tabs.Indicator />
                    </Tab>
                    <Tab id="batch">
                      📦 Batch (JSON)
                      <Tabs.Indicator />
                    </Tab>
                  </TabList>
                </TabListContainer>

                {/* Tab: single */}
                <TabPanel id="single">
                  <SingleStoryForm />
                </TabPanel>

                {/* Tab: batch */}
                <TabPanel id="batch">
                  <BatchStoryForm />
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
