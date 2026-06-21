"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@heroui/react";

import { kanaMap, type KanaEntry } from "@/src/modules/kana/lib/kana-map";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { SrsRating } from "@/src/shared/lib/srs";

// ─────────────────────────────────────────
// Kana Practice Mode (Phase 4)
// Quiz: romaji↔kana, audio (Web Speech TTS), SRS via /api/kana
// ─────────────────────────────────────────

type QuizMode = "romaji_to_kana" | "kana_to_romaji" | "audio";
type KanaKind = "hiragana" | "katakana" | "both";

interface QuizQuestion {
  id: string;
  /** Karakter kana yang diuji */
  kana: string;
  /** Romaji (jawaban benar) */
  romaji: string;
  kind: "hiragana" | "katakana";
}

interface SrsProgress {
  kana: string;
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: string;
}

const SESSION_SIZE = 10;

function pickRandom<T>(arr: T[], n: number, exclude?: Set<T>): T[] {
  const filtered = exclude ? arr.filter((x) => !exclude.has(x)) : arr;
  const copy = [...filtered];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function classifyKana(ch: string): "hiragana" | "katakana" | null {
  const code = ch.charCodeAt(0);
  if (code >= 0x3040 && code <= 0x309f) return "hiragana";
  if (code >= 0x30a0 && code <= 0x30ff) return "katakana";
  return null;
}

function makeQuestions(
  pool: Array<{ info: KanaEntry; ch: string; kind: "hiragana" | "katakana" }>,
  _mode: QuizMode,
): QuizQuestion[] {
  const shuffled = pickRandom(pool, SESSION_SIZE);
  return shuffled.map((e) => ({
    id: `${e.kind}-${e.ch}-${Math.random().toString(36).slice(2, 6)}`,
    kana: e.ch,
    romaji: e.info.romaji,
    kind: e.kind,
  }));
}

function buildChoices(
  correctRomaji: string,
  pool: Array<{ info: KanaEntry; ch: string }>,
  correctKana: string,
  mode: QuizMode,
): string[] {
  const distractorPool = pickRandom(pool, 20);
  const distractors: string[] = [];
  for (const d of distractorPool) {
    if (mode === "romaji_to_kana" || mode === "audio") {
      if (d.info.romaji === correctRomaji) continue;
      if (distractors.includes(d.info.romaji)) continue;
      distractors.push(d.info.romaji);
    } else {
      if (d.ch === correctKana) continue;
      if (distractors.includes(d.ch)) continue;
      distractors.push(d.ch);
    }
    if (distractors.length === 3) break;
  }
  const correct = mode === "kana_to_romaji" ? correctRomaji : correctKana;
  const all = [correct, ...distractors];
  return pickRandom(all, all.length);
}

function speakJa(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export function KanaPractice() {
  const [, startTransition] = useTransition();

  const [mode, setMode] = useState<QuizMode>("romaji_to_kana");
  const [kanaKind, setKanaKind] = useState<KanaKind>("hiragana");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<Array<{ q: QuizQuestion; rating: SrsRating }>>([]);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<SrsProgress[]>([]);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceAvailable(voices.some((v) => v.lang.startsWith("ja")));
    };
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
  }, []);

  const pool = useMemo(() => {
    return Object.entries(kanaMap)
      .map(([ch, info]) => ({ ch, info, kind: classifyKana(ch) }))
      .filter(
        (
          x,
        ): x is {
          ch: string;
          info: KanaEntry;
          kind: "hiragana" | "katakana";
        } =>
          x.kind !== null &&
          (kanaKind === "both" || x.kind === kanaKind),
      );
  }, [kanaKind]);

  const refreshProgress = async () => {
    try {
      const res = await fetch("/api/kana");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress ?? []);
      }
    } catch (err) {
      console.error("[KanaPractice] fetch progress:", err);
    }
  };

  const startSession = (newMode: QuizMode, newKind: KanaKind) => {
    const poolForKind = Object.entries(kanaMap)
      .map(([ch, info]) => ({ ch, info, kind: classifyKana(ch) }))
      .filter(
        (
          x,
        ): x is {
          ch: string;
          info: KanaEntry;
          kind: "hiragana" | "katakana";
        } =>
          x.kind !== null && (newKind === "both" || x.kind === newKind),
      );
    if (poolForKind.length < 4) {
      alert("Kana pool tidak cukup untuk quiz.");
      return;
    }
    const qs = makeQuestions(poolForKind, newMode);
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScores([]);
    setFinished(false);
    if (qs.length > 0) {
      const correct =
        newMode === "kana_to_romaji" ? qs[0].romaji : qs[0].kana;
      setChoices(
        buildChoices(
          qs[0].romaji,
          poolForKind.map((p) => ({ info: p.info, ch: p.ch })),
          qs[0].kana,
          newMode,
        ),
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshProgress();
  }, []);

  const currentQ = questions[index];

  const handleChoose = (choice: string) => {
    if (revealed || !currentQ) return;
    setSelected(choice);
    setRevealed(true);
    const correctAnswer = mode === "kana_to_romaji" ? currentQ.romaji : currentQ.kana;
    const isCorrect = choice === correctAnswer;
    const rating: SrsRating = isCorrect ? 3 : 1;
    setScores((prev) => [...prev, { q: currentQ, rating }]);

    startTransition(async () => {
      try {
        await fetch("/api/kana", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kana: currentQ.kana, rating }),
        });
      } catch (err) {
        console.error("[KanaPractice] rate failed:", err);
      }
    });

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        const nextIdx = index + 1;
        const nextQ = questions[nextIdx];
        setIndex(nextIdx);
        setSelected(null);
        setRevealed(false);
        setChoices(
          buildChoices(
            nextQ.romaji,
            pool.map((p) => ({ info: p.info, ch: p.ch })),
            nextQ.kana,
            mode,
          ),
        );
      }
    }, 1200);
  };

  const playAudio = (kana: string) => {
    speakJa(kana);
  };

  const totalCorrect = scores.filter((s) => s.rating >= 3).length;
  const accuracy =
    scores.length > 0 ? Math.round((totalCorrect / scores.length) * 100) : 0;
  const dueCount = progress.filter((p) => new Date(p.dueDate) <= new Date()).length;
  const totalLearned = progress.filter((p) => p.repetitions > 0).length;

  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800/40 dark:bg-indigo-950/20 px-5 py-4">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            🎴 Kana Practice (SRS)
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 leading-relaxed">
            Latih kana dengan spaced repetition. Setiap sesi 10 soal.
            {voiceAvailable ? " Mode audio tersedia." : " Mode audio butuh voice ja-JP di browser."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white dark:bg-indigo-900/30 px-2.5 py-1 font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
              ✓ {totalLearned} dipelajari
            </span>
            <span className="rounded-full bg-white dark:bg-indigo-900/30 px-2.5 py-1 font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
              🔁 {dueCount} due
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Tipe Kana</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "hiragana", label: "Hiragana", icon: "あ" },
              { key: "katakana", label: "Katakana", icon: "ア" },
              { key: "both", label: "両方", icon: "字" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setKanaKind(opt.key)}
                className={[
                  "rounded-xl border-2 px-3 py-3 text-center transition-all",
                  kanaKind === opt.key
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface text-muted hover:border-accent/50",
                ].join(" ")}
              >
                <span className="font-jp text-2xl block leading-none">{opt.icon}</span>
                <span className="text-[11px] font-semibold mt-1 block">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Mode Quiz</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => { setMode("romaji_to_kana"); }}
              className="rounded-xl border-2 border-border bg-surface px-3 py-3 text-left hover:border-accent/50 transition-colors"
            >
              <p className="text-sm font-bold text-foreground">Romaji → Kana</p>
              <p className="text-[11px] text-muted mt-0.5">Lihat romaji, pilih kana yang cocok</p>
            </button>
            <button
              type="button"
              onClick={() => { setMode("kana_to_romaji"); }}
              className="rounded-xl border-2 border-border bg-surface px-3 py-3 text-left hover:border-accent/50 transition-colors"
            >
              <p className="text-sm font-bold text-foreground">Kana → Romaji</p>
              <p className="text-[11px] text-muted mt-0.5">Lihat kana, pilih romaji yang cocok</p>
            </button>
            <button
              type="button"
              onClick={() => { setMode("audio"); }}
              disabled={!voiceAvailable}
              className="rounded-xl border-2 border-border bg-surface px-3 py-3 text-left hover:border-accent/50 transition-colors disabled:opacity-50"
            >
              <p className="text-sm font-bold text-foreground">🔊 Audio</p>
              <p className="text-[11px] text-muted mt-0.5">
                {voiceAvailable ? "Dengar suara, pilih kana" : "Voice ja-JP tidak tersedia."}
              </p>
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onPress={() => startSession(mode, kanaKind)}
          className="font-bold cursor-pointer"
        >
          ▶ Mulai Sesi ({SESSION_SIZE} soal)
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800/40 dark:bg-indigo-950/20 px-6 py-8 text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-base font-bold text-foreground">Sesi selesai!</p>
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-emerald-200 dark:border-emerald-800/50">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{totalCorrect}</p>
              <p className="text-[11px] text-muted">Benar</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-red-200 dark:border-red-800/50">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">{scores.length - totalCorrect}</p>
              <p className="text-[11px] text-muted">Salah</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-indigo-200 dark:border-indigo-800/50">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{accuracy}%</p>
              <p className="text-[11px] text-muted">Akurasi</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {scores.map((s, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-3 rounded-xl border px-3 py-2",
                s.rating >= 3
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                  : "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20",
              ].join(" ")}
            >
              <span className="font-jp text-2xl font-bold text-foreground">{s.q.kana}</span>
              <span className="text-sm text-muted">{s.q.romaji}</span>
              <span className="ml-auto text-[10px] font-bold">
                {s.rating >= 3 ? "✓" : "✗"}
              </span>
            </div>
          ))}
        </div>
        <Button
          variant="primary"
          onPress={() => { refreshProgress(); startSession(mode, kanaKind); }}
          className="font-semibold cursor-pointer"
        >
          🔄 Sesi baru
        </Button>
        <Button
          variant="secondary"
          onPress={() => { setQuestions([]); }}
          className="font-semibold cursor-pointer"
        >
          ← Kembali
        </Button>
      </div>
    );
  }

  if (!currentQ) return null;
  const correctAnswer = mode === "kana_to_romaji" ? currentQ.romaji : currentQ.kana;
  const isAudioMode = mode === "audio";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Soal {index + 1} / {questions.length}
        </p>
        <p className="text-xs font-semibold text-foreground">
          ✓ {scores.filter((s) => s.rating >= 3).length} · ✗ {scores.filter((s) => s.rating < 3).length}
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border-2 border-accent/30 bg-linear-to-br from-accent/10 via-accent/5 to-transparent px-6 py-10 text-center">
        {isAudioMode ? (
          <button
            type="button"
            onClick={() => playAudio(currentQ.kana)}
            className="mx-auto flex flex-col items-center gap-2 group"
          >
            <span className="text-6xl group-hover:scale-110 transition-transform">🔊</span>
            <span className="text-xs text-muted">Putar ulang</span>
          </button>
        ) : mode === "romaji_to_kana" ? (
          <>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Romaji</p>
            <p className="font-jp text-5xl font-bold text-foreground">{currentQ.romaji}</p>
          </>
        ) : (
          <>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Kana</p>
            <p className="font-jp text-7xl font-bold text-foreground">{currentQ.kana}</p>
            <p className="text-[10px] text-muted mt-2">{currentQ.kind}</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {choices.map((c) => {
          const isCorrect = c === correctAnswer;
          const isPicked = c === selected;
          const showState = revealed;
          return (
            <button
              key={c}
              type="button"
              disabled={revealed}
              onClick={() => handleChoose(c)}
              className={[
                "rounded-xl border-2 px-3 py-4 text-center transition-all",
                "font-jp text-3xl font-bold",
                showState && isCorrect
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                  : showState && isPicked
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                    : "border-border bg-surface text-foreground hover:border-accent/50",
                revealed ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className={[
          "text-center text-sm font-semibold",
          selected === correctAnswer
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400",
        ].join(" ")}>
          {selected === correctAnswer ? "✓ Benar!" : `✗ Jawaban: ${correctAnswer}`}
        </p>
      )}
    </div>
  );
}
