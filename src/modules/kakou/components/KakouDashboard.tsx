"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  ExternalLink,
  History,
  Info,
  NotebookPen,
  PenLine,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import {
  abandonKakouSession,
  completeKakouSession,
  createKakouSession,
  saveKakouProgress,
} from "@/src/modules/kakou/actions/kakouActions";
import {
  KAKOU_MODE_LABELS,
  KAKOU_MODES,
  type KakouDifficulty,
  type KakouDuration,
  type KakouLevel,
  type KakouMode,
  type KakouOverview,
  type KakouPrompt,
  type KakouSessionView,
  type KakouSourceType,
} from "@/src/modules/kakou/data/types";
import {
  formatStudyTime,
} from "@/src/modules/study-timer/components/StudyTimerBar";
import type { StudyTimerView } from "@/src/modules/study-timer/types";

const KIND_LABELS: Record<KakouPrompt["kind"], string> = {
  JOURNAL: "Guided journal",
  COPY_CHANGE_CREATE: "Copy → Change → Create",
  GRAMMAR: "Grammar challenge",
  SENTENCE_BUILDER: "Sentence builder",
  CONJUGATION: "Conjugation drill",
};

const DIFFICULTY_OPTIONS: Array<{
  value: KakouDifficulty;
  label: string;
  note: string;
}> = [
  { value: "EASY", label: "Easy", note: "I wrote it smoothly" },
  { value: "OKAY", label: "Okay", note: "Some pauses or doubts" },
  { value: "DIFFICULT", label: "Difficult", note: "I need to review this" },
];

function buildTextReviewPrompt(session: KakouSessionView): string {
  const requirements = session.prompts
    .map(
      (item, index) =>
        `${index + 1}. ${KIND_LABELS[item.kind]}\nTugas: ${item.instruction}${
          item.pattern ? `\nPola target: ${item.pattern}` : ""
        }`,
    )
    .join("\n\n");

  return `Saya sedang belajar menulis bahasa Jepang secara mandiri. Tolong periksa tulisan saya sebagai guru bahasa Jepang yang teliti.\n\nLevel: JLPT ${session.level}\nLatihan:\n${requirements}\n\nTulisan saya:\n[TYPE OR PASTE YOUR JAPANESE WRITING HERE]\n\nBerikan umpan balik dalam bahasa Indonesia dengan aturan berikut:\n1. Tampilkan setiap kalimat asli.\n2. Tampilkan versi yang benar tepat di bawahnya.\n3. Jelaskan kesalahan partikel, kosakata, ejaan, dan tata bahasa secara singkat.\n4. Jangan mengubah kalimat yang sudah benar.\n5. Pertahankan kosakata dan tata bahasa di sekitar level ${session.level}.\n6. Berikan satu versi yang lebih natural jika diperlukan.\n7. Akhiri dengan maksimal tiga hal yang perlu saya pelajari kembali.\n8. Jangan membuat nilai atau skor yang tidak objektif.`;
}

function buildPhotoReviewPrompt(session: KakouSessionView): string {
  return `Saya akan mengunggah foto latihan tulisan tangan bahasa Jepang. Level saya JLPT ${session.level}.\n\nTolong lakukan hal berikut:\n1. Transkripsikan tulisan pada foto tanpa menambah isi.\n2. Tandai karakter yang tidak dapat dibaca dengan [?], jangan menebak.\n3. Periksa bentuk kana/kanji, ejaan, partikel, kosakata, dan tata bahasa.\n4. Untuk setiap kalimat hasil transkripsi, tampilkan tulisan asli, versi yang benar, dan satu versi improved yang lebih natural. Versi improved harus berasal dari maksud kalimat asli, mempertahankan maknanya, dan tidak boleh menambahkan fakta baru.\n5. Jelaskan koreksi dalam bahasa Indonesia secara singkat.\n6. Pertahankan kalimat yang sudah benar; jika sudah natural, katakan bahwa tidak perlu diubah.\n7. Pertahankan kosakata dan tata bahasa di sekitar level ${session.level}.\n8. Jangan menilai kualitas artistik tulisan.\n9. Akhiri dengan maksimal tiga hal yang perlu saya latih kembali.\n\nGunakan format jawaban berikut untuk Bagian 1:\n\nBAGIAN 1 — TRANSKRIPSI DAN PERBAIKAN\n\nKalimat 1\n- Tulisan asli: [transkripsi persis dari foto]\n- Versi benar: [koreksi minimum agar kalimat benar]\n- Versi improved: [kalimat yang lebih natural dan baik, tetap dengan maksud yang sama]\n- Arti Indonesia: [arti versi improved]\n- Penjelasan: [alasan perubahan secara singkat]\n\nUlangi format tersebut untuk setiap kalimat. Jika maksud tulisan tidak dapat dipastikan, jangan membuat versi improved berdasarkan tebakan; jelaskan bagian yang perlu dikonfirmasi.\n\nSetelah Bagian 1, tampilkan:\n\nBAGIAN 2 — POLA KESALAHAN\n- Ringkas pola kesalahan yang berulang.\n\nBAGIAN 3 — SARAN LATIHAN\n- Berikan maksimal tiga hal yang perlu saya latih kembali.\n\nKonteks latihan:\n${session.prompts
    .map(
      (item, index) =>
        `${index + 1}. ${item.instruction}${item.pattern ? ` (Target: ${item.pattern})` : ""}`,
    )
    .join("\n")}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function PromptCard({ prompt, index }: { prompt: KakouPrompt; index: number }) {
  const [showReminder, setShowReminder] = useState(false);

  return (
    <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            Step {index + 1} · {KIND_LABELS[prompt.kind]}
          </p>
          <h2 className="text-xl font-bold text-foreground">{prompt.title}</h2>
        </div>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-muted">
          {prompt.level}
        </span>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
        <p className="font-jp text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          {prompt.japanese}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">Write in your notebook</p>
        <p className="mt-1.5 leading-relaxed text-foreground">{prompt.instruction}</p>
      </div>

      {prompt.reminder && (
        <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          <button
            type="button"
            onClick={() => setShowReminder((value) => !value)}
            aria-expanded={showReminder}
            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-muted/50"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Info size={16} className="text-accent" />
              Need a reminder?
            </span>
            <ChevronDown
              size={16}
              className={`text-muted transition-transform ${showReminder ? "rotate-180" : ""}`}
            />
          </button>

          {showReminder && (
            <div className="border-t border-border px-4 py-4">
              <div className="flex items-start gap-3">
                <BookOpen size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-jp font-bold text-foreground">{prompt.reminder.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{prompt.reminder.meaning}</p>
                </div>
              </div>

              {prompt.reminder.structures.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Structure</p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {prompt.reminder.structures.map((structure) => (
                      <code key={structure} className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-foreground">
                        {structure}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {prompt.reminder.examples.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Examples</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {prompt.reminder.examples.map((example, exampleIndex) => (
                      <div key={`${example.japanese}-${exampleIndex}`} className="rounded-xl border border-border p-3">
                        <p className="font-jp text-sm font-semibold text-foreground">{example.japanese}</p>
                        {example.reading && <p className="font-jp mt-1 text-[11px] text-muted">{example.reading}</p>}
                        {example.meaning && <p className="mt-1 text-xs text-muted">{example.meaning}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {prompt.reminder.commonMistakes && prompt.reminder.commonMistakes.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Watch out
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted">
                    {prompt.reminder.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
                  </ul>
                </div>
              )}

              {prompt.reminder.source && (
                <Link
                  href={prompt.reminder.source.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  {prompt.reminder.source.label} <ExternalLink size={12} />
                </Link>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  );
}

function Stats({ overview }: { overview: KakouOverview }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <Trophy size={16} className="mb-2 text-accent" />
        <p className="text-xl font-bold tabular-nums text-foreground">{overview.stats.completedSessions}</p>
        <p className="text-[10px] text-muted sm:text-xs">sessions done</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <PenLine size={16} className="mb-2 text-accent" />
        <p className="text-lg font-bold tabular-nums text-foreground">{formatStudyTime(overview.stats.todaySeconds, false)}</p>
        <p className="text-[10px] text-muted sm:text-xs">studied today</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <Sparkles size={16} className="mb-2 text-accent" />
        <p className="text-lg font-bold tabular-nums text-foreground">{formatStudyTime(overview.stats.weekSeconds, false)}</p>
        <p className="text-[10px] text-muted sm:text-xs">this week</p>
      </div>
    </div>
  );
}

export function KakouDashboard({
  initialOverview,
  initialSource,
}: {
  initialOverview: KakouOverview;
  initialSource?: { type: KakouSourceType; id: string };
}) {
  const [overview, setOverview] = useState(initialOverview);
  const [active, setActive] = useState(initialOverview.activeSession);
  const [mode, setMode] = useState<KakouMode>("DAILY_MIX");
  const [level, setLevel] = useState<KakouLevel>("N5");
  const [duration, setDuration] = useState<KakouDuration>(10);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<"text" | "photo" | null>(null);
  const [isPending, startTransition] = useTransition();

  const startSession = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await createKakouSession({
        mode,
        level,
        durationMinutes: duration,
        sourceType: initialSource?.type,
        sourceId: initialSource?.id,
      });
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setActive(result.session);
      if (result.resumed) {
        setMessage("Your unfinished session has been restored.");
      }
    });
  };

  const markStepDone = () => {
    if (!active) return;
    setMessage(null);
    startTransition(async () => {
      const result = await saveKakouProgress(active.id, active.progress + 1);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setActive(result.session);
    });
  };

  const finishSession = (difficulty: KakouDifficulty) => {
    if (!active) return;
    setMessage(null);
    startTransition(async () => {
      const result = await completeKakouSession(active.id, difficulty);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setOverview(result.overview);
      setActive(null);
      setCopied(null);
      setMessage("Session saved. Nice work — your streak has been updated.");
    });
  };

  const abandonSession = () => {
    if (!active || !window.confirm("Abandon this session? Its partial progress will remain in your database history.")) return;
    setMessage(null);
    startTransition(async () => {
      const result = await abandonKakouSession(active.id);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setOverview(result.overview);
      setActive(null);
      setCopied(null);
    });
  };

  const copyPrompt = async (kind: "text" | "photo") => {
    if (!active) return;
    const text = kind === "text" ? buildTextReviewPrompt(active) : buildPhotoReviewPrompt(active);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setMessage("Clipboard access was blocked. Please allow clipboard permission and try again.");
    }
  };

  if (active) {
    const total = active.prompts.length;
    const allDone = active.progress >= total;
    const currentPrompt = active.prompts[Math.min(active.progress, total - 1)];

    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="font-jp text-sm font-bold text-accent">書こう</p>
              <h1 className="text-xl font-bold text-foreground">Writing session</h1>
            </div>
            <button
              type="button"
              onClick={abandonSession}
              disabled={isPending}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
            >
              <X size={14} /> Abandon
            </button>
          </header>

          <section className="rounded-2xl border border-border bg-surface px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{KAKOU_MODE_LABELS[active.mode].title}</span>
              <span className="text-muted">{active.progress}/{total} steps · {active.durationMinutes} min</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${total === 0 ? 0 : (active.progress / total) * 100}%` }}
              />
            </div>
          </section>

          {message && (
            <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">{message}</p>
          )}

          {!allDone && currentPrompt && (
            <>
              <PromptCard prompt={currentPrompt} index={active.progress} />
              <button
                type="button"
                onClick={markStepDone}
                disabled={isPending}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-white shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving…" : active.progress + 1 === total ? "I finished this step" : "Step done — continue"}
                {!isPending && <ChevronRight size={18} />}
              </button>
            </>
          )}

          {allDone && (
            <div className="flex flex-col gap-5">
              <section className="rounded-3xl border border-accent/25 bg-accent/5 p-5 sm:p-7">
                <BookOpenCheck size={28} className="mb-3 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Your notebook page is complete</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Review it yourself first. If you want outside feedback, copy one of the prompts below and submit it to an AI service of your choice.
                </p>
              </section>

              <section className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                <div className="mb-4 flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={20} />
                  <div>
                    <h3 className="font-bold text-foreground">Optional external review</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      Nihongo Flow does not upload your writing or photo and does not call an AI API. Copying only places a reusable instruction on your clipboard.
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => copyPrompt("text")}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-accent/50"
                  >
                    {copied === "text" ? <Check size={16} /> : <Clipboard size={16} />}
                    {copied === "text" ? "Copied" : "Copy text review prompt"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyPrompt("photo")}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-accent/50"
                  >
                    {copied === "photo" ? <Check size={16} /> : <Clipboard size={16} />}
                    {copied === "photo" ? "Copied" : "Copy photo review prompt"}
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                <h3 className="font-bold text-foreground">How did this session feel?</h3>
                <p className="mt-1 text-xs text-muted">Choose one to finish and add this session to your activity streak.</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => finishSession(option.value)}
                      disabled={isPending}
                      className="cursor-pointer rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-accent/50 hover:bg-accent/5 disabled:opacity-50"
                    >
                      <span className="block text-sm font-bold text-foreground">{option.label}</span>
                      <span className="mt-0.5 block text-[11px] text-muted">{option.note}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <NotebookPen size={24} />
            </span>
            <div>
              <p className="font-jp text-sm font-bold text-accent">書こう · Kakou</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">What should I write today?</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Pick a session, open your paper notebook, and follow the prompts. The exercise bank is static—no AI is used to generate your study material.
              </p>
            </div>
          </div>
        </header>

        {message && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">{message}</p>
        )}

        <Stats overview={overview} />

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <PenLine size={18} className="text-accent" />
            <h2 className="font-bold text-foreground">Start a writing session</h2>
          </div>

          {initialSource && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-4">
              <div>
                <p className="text-xs font-bold text-accent">Focused library practice</p>
                <p className="mt-1 text-sm text-muted">
                  This session will use the selected {initialSource.type === "BUNPOU" ? "Bunpou pattern" : "Katsuyou guide"}.
                </p>
              </div>
              <Link href="/kakou" className="shrink-0 text-xs font-bold text-muted hover:text-foreground">
                Clear
              </Link>
            </div>
          )}

          <div className={`${initialSource ? "hidden" : "grid"} gap-3 sm:grid-cols-2`}>
            {KAKOU_MODES.map((item) => {
              const selected = mode === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-background hover:border-accent/40"
                  } ${item === "DAILY_MIX" ? "sm:col-span-2" : ""}`}
                >
                  <span className="text-sm font-bold text-foreground">{KAKOU_MODE_LABELS[item].title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{KAKOU_MODE_LABELS[item].description}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <fieldset className={initialSource ? "hidden" : ""}>
              <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">JLPT level</legend>
              <div className="grid grid-cols-3 gap-2">
                {(["N5", "N4", "N3"] as KakouLevel[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLevel(item)}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-bold ${
                      level === item ? "border-accent bg-accent text-white" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Session length</legend>
              <div className="grid grid-cols-3 gap-2">
                {([5, 10, 20] as KakouDuration[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDuration(item)}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-bold ${
                      duration === item ? "border-accent bg-accent text-white" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {item} min
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button
            type="button"
            onClick={startSession}
            disabled={isPending}
            className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-white shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Preparing…" : initialSource ? "Practice this material" : "Open today’s notebook page"}
            {!isPending && <ChevronRight size={18} />}
          </button>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><History size={18} className="text-accent" /> Recent sessions</h2>
            <span className="text-xs text-muted">Last {overview.history.length}</span>
          </div>
          {overview.history.length === 0 ? (
            <div className="rounded-2xl bg-surface-muted p-5 text-center">
              <RotateCcw size={20} className="mx-auto mb-2 text-muted" />
              <p className="text-sm font-semibold text-foreground">No completed sessions yet</p>
              <p className="mt-1 text-xs text-muted">Completed writing sessions will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {overview.history.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{KAKOU_MODE_LABELS[item.mode].title}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {formatDate(item.completedAt ?? item.startedAt)} · {item.level} · {item.actualSeconds > 0 ? formatStudyTime(item.actualSeconds, false) : "timer off"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-bold text-muted">
                    {item.difficulty ?? "DONE"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
