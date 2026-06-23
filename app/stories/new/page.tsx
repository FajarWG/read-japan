"use client";

import { useActionState, useState, useTransition, useMemo } from "react";
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
} from "@/src/modules/stories/actions";
import { getDekiruChapters } from "@/src/modules/prep/lib/kotoba-lookup";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

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
    chapter: 1,
    point: 1,
  },
  {
    title: "東京の朝",
    content:
      "あさはやくおきました。でんしゃにのってとうきょうえきにいきます。まちはにぎやかです。",
    translation:
      "Saya bangun pagi-pagi. Saya naik kereta menuju Stasiun Tokyo. Kotanya sangat ramai.",
    focus: "あさ でんしゃ まち きました",
    chapter: 1,
    point: 2,
  },
  {
    title: "カフェにて",
    content:
      "コーヒーをのみながらほんをよんでいます。しずかなカフェがすきです。",
    translation:
      "Saya membaca buku sambil minum kopi. Saya suka kafe yang tenang.",
    focus: "カタカナ コーヒー カフェ のみがら よんでいます",
    chapter: 1,
    point: 3,
  },
];

// ─────────────────────────────────────────
// LLM Prompt untuk generate cerita Dekiru
// ─────────────────────────────────────────
const STORY_LLM_PROMPT = `Anda adalah penulis cerita pendek bahasa Jepang untuk pembelajar tingkat JLPT N5-N3.

### TUGAS:
Tulis 3 cerita pendek untuk BAB ${"{chapter}"} dari buku "Dekiru Nihongo" dengan judul "${"{chapterTitle}"}".

Setiap cerita harus:
1. Panjang 2-4 kalimat (40-80 karakter Jepang total)
2. Menggunakan vocabulary dari bab ${"{chapter}"}: ${"{vocabSummary}"}
3. Menampilkan 1 skenario berbeda (point 1, 2, 3 dari bab)
4. Menggunakan bentuk kanji yang sesuai dengan buku
5. Ada padanan per kalimat bahasa Indonesia yang natural

### FORMAT JSON:
[
  {
    "title": "Judul cerita Jepang (singkat, 4-10 karakter)",
    "content": "Kalimat 1。Kalimat 2。Kalimat 3。",
    "translation": "Terjemahan 1. Terjemahan 2. Terjemahan 3.",
    "focus": "kata1 kata2 kata3",
    "chapter": ${"{chapter}"},
    "point": 1
  },
  {
    "title": "...",
    "content": "...",
    "translation": "...",
    "focus": "...",
    "chapter": ${"{chapter}"},
    "point": 2
  },
  {
    "title": "...",
    "content": "...",
    "translation": "...",
    "focus": "...",
    "chapter": ${"{chapter}"},
    "point": 3
  }
]

### ATURAN:
1. Output HANYA JSON valid tanpa markdown wrapper.
2. Translation sentences DIPISAH dengan "." (titik).
3. Content sentences DIPISAH dengan "。" (Japanese full-width period).
4. Number of sentences content HARUS SAMA dengan translation.
5. Vocabulary focus: 4-8 kata utama yang muncul dalam cerita (dipisah spasi).
6. Judul pakai kanji jika memungkinkan.`;

// ─────────────────────────────────────────
// SingleStoryForm — tab pertama
// ─────────────────────────────────────────
function SingleStoryForm() {
  const { t } = useLanguage();
  const initialState: ActionState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(
    createStory,
    initialState,
  );
  const [chapter, setChapter] = useState("");
  const [point, setPoint] = useState("");

  const errorMessages: Record<string, string> = {
    ERR_TITLE_REQUIRED: t.titleRequired,
    ERR_CONTENT_REQUIRED: t.contentRequired,
    ERR_CHAPTER_INVALID: t.chapterInvalid,
    ERR_POINT_INVALID: t.pointInvalid,
    ERR_CHAPTER_POINT_PAIR: t.chapterPointPair,
  };
  const displayMessage =
    state.status === "error"
      ? (errorMessages[state.message] ?? state.message)
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Error banner */}
      {displayMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          ⚠️ {displayMessage}
        </div>
      )}

      {/* Title field */}
      <TextField name="title" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          {t.storyTitleLabel}
        </Label>
        <Input
          variant="primary"
          fullWidth
          placeholder="はじめての日本語"
          required
          autoFocus
          className="font-jp"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Content field */}
      <TextField name="content" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          {t.storyContentLabel}{" "}
          <span className="font-normal text-muted">{t.storyContentHint}</span>
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
          {t.storyTranslationLabel}{" "}
          <span className="font-normal text-muted">
            {t.storyTranslationHint}
          </span>
        </Label>
        <TextArea
          variant="primary"
          fullWidth
          rows={4}
          placeholder={"Today the weather is nice.\nI am a student."}
          className="resize-none leading-relaxed"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Focus field */}
      <TextField name="focus" fullWidth className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          {t.storyFocusLabel}{" "}
          <span className="font-normal text-muted">{t.storyFocusHint}</span>
        </Label>
        <Input
          variant="primary"
          fullWidth
          placeholder="あいうえお, コーヒー カフェ"
          className="font-jp"
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {/* Chapter & Point (Dekiru) */}
      <div className="grid grid-cols-2 gap-3">
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">
            {t.chapterLabel}{" "}
            <span className="font-normal text-muted">{t.optional}</span>
          </Label>
          <Input
            type="number"
            min={1}
            max={15}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            variant="primary"
            fullWidth
            placeholder="1-15"
            inputMode="numeric"
          />
        </TextField>
        <TextField className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">
            {t.pointLabel}{" "}
            <span className="font-normal text-muted">{t.optional}</span>
          </Label>
          <Input
            type="number"
            min={1}
            max={3}
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            variant="primary"
            fullWidth
            placeholder="1-3"
            inputMode="numeric"
            disabled={!chapter}
          />
        </TextField>
        {/* Hidden inputs submitted with form */}
        <input type="hidden" name="chapter" value={chapter} />
        <input type="hidden" name="point" value={point} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          {t.cancel}
        </Link>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isPending}
          className="min-w-28"
        >
          {isPending ? t.saving : t.saveStory}
        </Button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────
// BatchStoryForm — tab kedua
// ─────────────────────────────────────────
function BatchStoryForm({
  chapters,
}: {
  chapters: Array<{ chapter: number; chapterLabel: string; title: string }>;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showTemplate, setShowTemplate] = useState(false);
  const [showLlmPrompt, setShowLlmPrompt] = useState(false);
  const [llmChapter, setLlmChapter] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  function buildLlmPrompt(): string {
    const ch = chapters[llmChapter - 1];
    if (!ch) return STORY_LLM_PROMPT;
    // Get vocab summary from JSON template (only first 8 items)
    const vocab = JSON_TEMPLATE.flatMap((s) => (s.focus ?? "").split(" ")).slice(0, 8);
    const vocabSummary = vocab.length > 0 ? vocab.join(", ") : "(lihat bab)";
    return STORY_LLM_PROMPT.replace("{chapter}", String(llmChapter))
      .replace("{chapterTitle}", ch.title)
      .replace("{vocabSummary}", vocabSummary)
      .replace("{chapter}", String(llmChapter));
  }

  function handleCopyLlmPrompt() {
    navigator.clipboard.writeText(buildLlmPrompt());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  }

  function handleSubmit() {
    setError(null);
    setSuccessCount(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError(t.jsonInvalid);
      return;
    }

    if (!Array.isArray(parsed)) {
      setError(t.jsonNotArray);
      return;
    }
    if (parsed.length === 0) {
      setError(t.jsonEmpty);
      return;
    }
    for (const [i, item] of (parsed as BatchStory[]).entries()) {
      if (typeof item !== "object" || item === null) {
        setError(t.jsonBadItem.replace("{n}", String(i + 1)));
        return;
      }
      if (!item.title?.trim()) {
        setError(t.jsonMissingTitle.replace("{n}", String(i + 1)));
        return;
      }
      if (!item.content?.trim()) {
        setError(t.jsonMissingContent.replace("{n}", String(i + 1)));
        return;
      }
    }

    startTransition(async () => {
      try {
        const result = await createManyStories(parsed as BatchStory[]);
        setSuccessCount(result.count);
        setJsonText("");
        setTimeout(() => router.push("/"), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.serverError);
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* LLM Prompt section */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            🤖 Generate 3 cerita dengan LLM
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowLlmPrompt((v) => !v)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline focus:outline-none"
            >
              {showLlmPrompt ? "Sembunyikan" : "Lihat prompt"}
            </button>
          </div>
        </div>
        {showLlmPrompt && (
          <div className="mt-3 flex flex-col gap-3">
            {/* Chapter selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Bab:</label>
              <select
                value={llmChapter}
                onChange={(e) => setLlmChapter(Number(e.target.value))}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-sm focus:outline-none focus:border-amber-400"
              >
                {chapters.map((ch) => (
                  <option key={ch.chapter} value={ch.chapter}>
                    {ch.chapterLabel} — {ch.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCopyLlmPrompt}
                className="ml-auto rounded-md bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs font-semibold transition-colors"
              >
                {copiedPrompt ? "✓ Tersalin!" : "📋 Copy Prompt"}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-green-300 leading-relaxed font-mono max-h-72 overflow-y-auto">
              {buildLlmPrompt()}
            </pre>
            <p className="text-[11px] text-muted">
              Kirim ke ChatGPT / Claude → paste hasilnya di textarea di bawah
            </p>
          </div>
        )}
      </div>

      {/* Template section */}
      <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">{t.batchFormat}</p>
          <button
            type="button"
            onClick={() => setShowTemplate((v) => !v)}
            className="text-xs text-accent hover:underline focus:outline-none"
          >
            {showTemplate ? t.hideTemplate : t.showTemplate}
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
              {t.useTemplate}
            </button>
          </div>
        )}

        {/* Schema description */}
        {!showTemplate && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              title
            </code>
            <span>string, {t.required}</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              content
            </code>
            <span>string, {t.required}</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              translation
            </code>
            <span>string, {t.optional}</span>
            <span className="text-border">·</span>
            <code className="rounded bg-surface px-1.5 py-0.5 border border-border">
              focus
            </code>
            <span>string, {t.optional}</span>
          </div>
        )}
      </div>

      {/* JSON textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          {t.pasteJson}
          {jsonText.trim() && (
            <span className="ml-2 font-normal text-muted text-xs">
              ({jsonText.length} karakter)
            </span>
          )}
        </label>
        <TextArea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
            setSuccessCount(null);
          }}
          rows={12}
          placeholder={
            '[\n  {\n    "title": "はじめての日本語",\n    "content": "きょうはいいてんきですね。",\n    "translation": "Today the weather is nice.",\n    "focus": "あいうえお"\n  }\n]'
          }
          variant="primary"
          fullWidth
          className="font-mono text-sm leading-relaxed text-foreground"
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
          ✅{" "}
          <strong>{t.batchSuccess.replace("{n}", String(successCount))}</strong>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-xs text-muted">{t.jsonMaxItems}</p>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {t.cancel}
          </Link>
          <Button
            variant="primary"
            isDisabled={isPending || !jsonText.trim()}
            onPress={handleSubmit}
            className="min-w-32"
          >
            {isPending ? t.saving : t.saveAll}
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
  const { t } = useLanguage();
  const chapters = useMemo(() => getDekiruChapters(), []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-2xl flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href="/stories/admin"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-muted shrink-0",
                })}
              >
                ← Admin
              </Link>
              <span className="text-border">/</span>
              <span className="text-sm font-medium text-foreground truncate">
                {t.newStoryNavLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SettingsDropdown />
              <Chip variant="soft" size="sm" className="text-xs font-medium">
                {t.admin}
              </Chip>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 py-8">
          <Card className="border border-border bg-surface shadow-sm rounded-2xl">
            <CardHeader className="px-8 pt-7 pb-4">
              <CardTitle className="text-xl font-bold text-foreground">
                {t.addNewStoryTitle}
              </CardTitle>
              <p className="mt-1 text-sm text-muted">{t.addNewStoryDesc}</p>
            </CardHeader>

            <div className="px-8">
              <Separator className="bg-border" />
            </div>

            <CardContent className="px-8 py-6">
              <Tabs variant="primary" className="w-full">
                <TabListContainer className="mb-6">
                  <TabList className="w-full sm:w-auto">
                    <Tab id="single" className="whitespace-nowrap">
                      {t.singleTabLabel}
                      <Tabs.Indicator />
                    </Tab>
                    <Tab id="batch" className="whitespace-nowrap">
                      {t.batchTabLabel}
                      <Tabs.Indicator />
                    </Tab>
                  </TabList>
                </TabListContainer>

                <TabPanel id="single">
                  <SingleStoryForm />
                </TabPanel>

                <TabPanel id="batch">
                  <BatchStoryForm chapters={chapters} />
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
