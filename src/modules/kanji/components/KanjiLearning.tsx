"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@heroui/react";

import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import type { SrsRating } from "@/src/shared/lib/srs";
import { KANJI_N5, type KanjiSeed } from "@/src/helper/kanji-n5";

// ─────────────────────────────────────────
// Kanji Learning (Phase 4)
// SRS via /api/kanji + stroke count + examples
// ─────────────────────────────────────────

interface SrsProgress {
  kanji: string;
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: string;
}

type Mode = "list" | "learn" | "review";

const REVIEW_SESSION_SIZE = 10;

function pickRandom<T>(arr: T[], n: number, exclude?: Set<T>): T[] {
  const filtered = exclude ? arr.filter((x) => !exclude.has(x)) : arr;
  const copy = [...filtered];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function buildChoiceOptions(
  correct: KanjiSeed,
  pool: KanjiSeed[],
  field: "meaningEn" | "meaningId",
): KanjiSeed[] {
  const distractors = pickRandom(
    pool.filter((k) => k.kanji !== correct.kanji),
    3,
  );
  return pickRandom([correct, ...distractors], 4);
}

export function KanjiLearning() {
  const { t, lang } = useLanguage();
  const [, startTransition] = useTransition();

  const [mode, setMode] = useState<Mode>("list");
  const [progress, setProgress] = useState<SrsProgress[]>([]);
  const [studyIdx, setStudyIdx] = useState(0);
  const [revealedStudy, setRevealedStudy] = useState(false);
  const [studyRating, setStudyRating] = useState<SrsRating | null>(null);

  const [reviewQueue, setReviewQueue] = useState<KanjiSeed[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewChoices, setReviewChoices] = useState<KanjiSeed[]>([]);
  const [reviewPicked, setReviewPicked] = useState<string | null>(null);
  const [reviewRevealed, setReviewRevealed] = useState(false);
  const [reviewScores, setReviewScores] = useState<Array<{ k: KanjiSeed; rating: SrsRating }>>([]);
  const [reviewFinished, setReviewFinished] = useState(false);

  const refreshProgress = async () => {
    try {
      const res = await fetch("/api/kanji");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress ?? []);
      }
    } catch (err) {
      console.error("[KanjiLearning] fetch:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshProgress();
  }, []);

  // Stats
  const learnedSet = useMemo(() => {
    const m = new Map<string, SrsProgress>();
    for (const p of progress) m.set(p.kanji, p);
    return m;
  }, [progress]);

  const dueCount = progress.filter((p) => new Date(p.dueDate) <= new Date()).length;
  const masteredCount = progress.filter((p) => p.repetitions >= 3 && p.interval >= 21).length;

  // ── Learn mode: walk through kanji satu per satu ──
  const startLearn = () => {
    // Mulai dari kanji yang belum pernah dipelajari
    const unlearned = KANJI_N5.filter((k) => !learnedSet.has(k.kanji));
    if (unlearned.length === 0) {
      // Semua sudah dipelajari → mulai dari awal
      setStudyIdx(0);
    } else {
      // Start dari urutan awal, scroll nanti
      setStudyIdx(0);
    }
    setRevealedStudy(false);
    setStudyRating(null);
    setMode("learn");
  };

  const currentStudy = KANJI_N5[studyIdx];
  const isEn = lang === "en";

  const handleStudyRate = (rating: SrsRating) => {
    if (!currentStudy) return;
    setStudyRating(rating);
    startTransition(async () => {
      try {
        await fetch("/api/kanji", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kanji: currentStudy.kanji, rating }),
        });
        await refreshProgress();
      } catch (err) {
        console.error("[KanjiLearning] rate:", err);
      }
    });
  };

  const handleStudyNext = () => {
    setRevealedStudy(false);
    setStudyRating(null);
    if (studyIdx + 1 >= KANJI_N5.length) {
      setMode("list");
    } else {
      setStudyIdx(studyIdx + 1);
    }
  };

  // ── Review mode ──
  const startReview = () => {
    // Ambil kanji yang SRS sudah ada (pernah dipelajari) + due
    const learned = KANJI_N5.filter((k) => learnedSet.has(k.kanji));
    if (learned.length === 0) {
      // Belum ada → mulai mode learn dulu
      alert("Belum ada kanji yang dipelajari. Mulai mode Belajar dulu.");
      return;
    }
    const due = learned.filter((k) => {
      const p = learnedSet.get(k.kanji);
      return p && new Date(p.dueDate) <= new Date();
    });
    const session = pickRandom(due, REVIEW_SESSION_SIZE);
    if (session.length === 0) {
      alert("Tidak ada kanji yang due. Coba lagi nanti.");
      return;
    }
    setReviewQueue(session);
    setReviewIdx(0);
    setReviewPicked(null);
    setReviewRevealed(false);
    setReviewScores([]);
    setReviewFinished(false);
    setReviewChoices(buildChoiceOptions(session[0], KANJI_N5, isEn ? "meaningEn" : "meaningId"));
    setMode("review");
  };

  const handleReviewChoose = (kanji: string) => {
    if (reviewRevealed) return;
    const current = reviewQueue[reviewIdx];
    if (!current) return;
    setReviewPicked(kanji);
    setReviewRevealed(true);
    const isCorrect = kanji === current.kanji;
    const rating: SrsRating = isCorrect ? 3 : 1;
    setReviewScores((prev) => [...prev, { k: current, rating }]);

    startTransition(async () => {
      try {
        await fetch("/api/kanji", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kanji: current.kanji, rating }),
        });
      } catch (err) {
        console.error("[KanjiLearning] review rate:", err);
      }
    });

    setTimeout(() => {
      if (reviewIdx + 1 >= reviewQueue.length) {
        setReviewFinished(true);
      } else {
        const nextIdx = reviewIdx + 1;
        const next = reviewQueue[nextIdx];
        setReviewIdx(nextIdx);
        setReviewPicked(null);
        setReviewRevealed(false);
        setReviewChoices(buildChoiceOptions(next, KANJI_N5, isEn ? "meaningEn" : "meaningId"));
      }
    }, 1200);
  };

  // ── Render ──

  if (mode === "learn" && currentStudy) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">Belajar {studyIdx + 1} / {KANJI_N5.length}</p>
          <button
            type="button"
            onClick={() => setMode("list")}
            className="text-xs text-muted hover:text-foreground"
          >
            ← Kembali ke daftar
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((studyIdx + 1) / KANJI_N5.length) * 100}%` }}
          />
        </div>

        {/* Big kanji display */}
        <div className="rounded-2xl border-2 border-accent/30 bg-linear-to-br from-accent/10 via-accent/5 to-transparent px-6 py-10 text-center">
          <p className="font-jp text-9xl font-bold text-foreground leading-none">{currentStudy.kanji}</p>
          <p className="text-xs text-muted mt-3">{currentStudy.strokes} goresan · JLPT {currentStudy.jlpt}</p>
        </div>

        {/* Details — shown after reveal */}
        {revealedStudy ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wide">On&apos;yomi (音読み)</p>
              <p className="font-jp text-xl font-bold text-foreground">
                {currentStudy.onyomi ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wide">Kun&apos;yomi (訓読み)</p>
              <p className="font-jp text-xl font-bold text-foreground">
                {currentStudy.kunyomi.length > 0 ? currentStudy.kunyomi.join(" · ") : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wide">Meaning</p>
              <p className="text-base font-semibold text-foreground">
                {isEn ? currentStudy.meaningEn : currentStudy.meaningId}
              </p>
            </div>
            {currentStudy.examples.length > 0 && (
              <div className="border-t border-border pt-3 mt-1">
                <p className="text-[10px] text-muted uppercase tracking-wide mb-2">Contoh kata</p>
                <div className="flex flex-col gap-2">
                  {currentStudy.examples.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex items-baseline gap-2">
                      <span className="font-jp text-base font-bold text-foreground">
                        {ex.word}
                      </span>
                      <span className="font-jp text-sm text-indigo-500 dark:text-indigo-400">
                        {ex.reading}
                      </span>
                      <span className="text-xs text-muted">
                        {isEn ? ex.meaningEn : ex.meaningId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onPress={() => setRevealedStudy(true)}
            className="font-bold cursor-pointer"
          >
            👁 Lihat detail
          </Button>
        )}

        {revealedStudy && studyRating === null && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-2 text-center">
              Seberapa hafal kamu?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {([
                { r: 1, label: "😵 Lupa", color: "border-red-300 bg-red-50 dark:bg-red-950/20 text-red-700" },
                { r: 2, label: "😟 Sulit", color: "border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-700" },
                { r: 3, label: "😊 Tahu", color: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700" },
                { r: 4, label: "🤩 Mudah", color: "border-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700" },
              ] as const).map((opt) => (
                <button
                  key={opt.r}
                  type="button"
                  onClick={() => handleStudyRate(opt.r)}
                  className={`rounded-xl border-2 ${opt.color} px-2 py-3 text-xs font-bold transition-all hover:scale-105 cursor-pointer`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {studyRating !== null && (
          <div className="text-center">
            <p className="text-sm text-muted mb-2">
              {studyRating === 1 ? "Akan diulang dalam 10 menit" : studyRating === 2 ? "1 hari" : studyRating === 3 ? "1 hari" : "Beberapa hari"}
            </p>
            <Button
              variant="primary"
              onPress={handleStudyNext}
              className="font-bold cursor-pointer"
            >
              {studyIdx + 1 >= KANJI_N5.length ? "✓ Selesai" : "Lanjut →"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (mode === "review" && !reviewFinished && reviewQueue.length > 0) {
    const current = reviewQueue[reviewIdx];
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Review {reviewIdx + 1} / {reviewQueue.length}</p>
          <p className="text-xs font-semibold">
            ✓ {reviewScores.filter((s) => s.rating >= 3).length} · ✗ {reviewScores.filter((s) => s.rating < 3).length}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((reviewIdx + (reviewRevealed ? 1 : 0)) / reviewQueue.length) * 100}%` }}
          />
        </div>
        <div className="rounded-2xl border-2 border-accent/30 bg-linear-to-br from-accent/10 via-accent/5 to-transparent px-6 py-10 text-center">
          <p className="text-xs text-muted uppercase tracking-wide mb-2">Pilih kanji untuk arti</p>
          <p className="text-2xl font-bold text-foreground mb-3">
            {isEn ? current.meaningEn : current.meaningId}
          </p>
          {current.onyomi && (
            <p className="text-xs text-muted">
              On: <span className="font-jp">{current.onyomi}</span>
              {current.kunyomi.length > 0 && <> · Kun: <span className="font-jp">{current.kunyomi[0]}</span></>}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {reviewChoices.map((c) => {
            const isCorrect = c.kanji === current.kanji;
            const isPicked = c.kanji === reviewPicked;
            return (
              <button
                key={c.kanji}
                type="button"
                disabled={reviewRevealed}
                onClick={() => handleReviewChoose(c.kanji)}
                className={[
                  "rounded-xl border-2 px-3 py-6 text-center transition-all",
                  "font-jp text-5xl font-bold",
                  reviewRevealed && isCorrect
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700"
                    : reviewRevealed && isPicked
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700"
                      : "border-border bg-surface text-foreground hover:border-accent/50",
                  reviewRevealed ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                {c.kanji}
              </button>
            );
          })}
        </div>
        {reviewRevealed && (
          <p className={[
            "text-center text-sm font-semibold",
            reviewPicked === current.kanji
              ? "text-emerald-600"
              : "text-red-600",
          ].join(" ")}>
            {reviewPicked === current.kanji ? "✓ Benar!" : `✗ Jawaban: ${current.kanji} = ${isEn ? current.meaningEn : current.meaningId}`}
          </p>
        )}
      </div>
    );
  }

  if (mode === "review" && reviewFinished) {
    const correct = reviewScores.filter((s) => s.rating >= 3).length;
    const accuracy = Math.round((correct / reviewScores.length) * 100);
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800/40 dark:bg-indigo-950/20 px-6 py-8 text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-base font-bold text-foreground">Review selesai!</p>
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-600 tabular-nums">{correct}</p>
              <p className="text-[11px] text-muted">Benar</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-red-200">
              <p className="text-2xl font-bold text-red-600 tabular-nums">{reviewScores.length - correct}</p>
              <p className="text-[11px] text-muted">Salah</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-indigo-950/30 px-3 py-3 border border-indigo-200">
              <p className="text-2xl font-bold text-indigo-600 tabular-nums">{accuracy}%</p>
              <p className="text-[11px] text-muted">Akurasi</p>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onPress={() => { refreshProgress(); setMode("list"); }}
          className="font-semibold cursor-pointer"
        >
          ← Kembali ke daftar
        </Button>
      </div>
    );
  }

  // ── List mode (default) ──
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800/40 dark:bg-indigo-950/20 px-5 py-4">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          📚 Kanji Learning (SRS)
        </p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 leading-relaxed">
          Belajar {KANJI_N5.length} kanji JLPT N5. Pilih mode di bawah.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white dark:bg-indigo-900/30 px-2.5 py-1 font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
            📖 {learnedSet.size}/{KANJI_N5.length} learned
          </span>
          <span className="rounded-full bg-white dark:bg-indigo-900/30 px-2.5 py-1 font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
            ⭐ {masteredCount} mastered
          </span>
          <span className="rounded-full bg-white dark:bg-indigo-900/30 px-2.5 py-1 font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
            🔁 {dueCount} due
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={startLearn}
          className="rounded-2xl border-2 border-accent/30 bg-surface px-5 py-5 text-left hover:border-accent/60 hover:bg-surface-muted transition-all cursor-pointer"
        >
          <p className="text-2xl">📖</p>
          <p className="text-base font-bold text-foreground mt-2">Mode Belajar</p>
          <p className="text-xs text-muted mt-1">Walk-through kanji satu per satu dengan detail lengkap</p>
        </button>
        <button
          type="button"
          onClick={startReview}
          disabled={dueCount === 0}
          className="rounded-2xl border-2 border-border bg-surface px-5 py-5 text-left hover:border-accent/60 hover:bg-surface-muted transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p className="text-2xl">🔁</p>
          <p className="text-base font-bold text-foreground mt-2">Review SRS</p>
          <p className="text-xs text-muted mt-1">
            {dueCount > 0 ? `${dueCount} kanji due — kuis arti` : "Tidak ada kanji yang due"}
          </p>
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Daftar Kanji ({KANJI_N5.length})
        </p>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {KANJI_N5.map((k) => {
            const prog = learnedSet.get(k.kanji);
            const isLearned = !!prog;
            const isMastered = prog && prog.repetitions >= 3 && prog.interval >= 21;
            return (
              <button
                key={k.kanji}
                type="button"
                onClick={() => {
                  setStudyIdx(KANJI_N5.findIndex((x) => x.kanji === k.kanji));
                  setRevealedStudy(false);
                  setStudyRating(null);
                  setMode("learn");
                }}
                className={[
                  "rounded-xl border-2 px-2 py-3 text-center transition-all cursor-pointer",
                  isMastered
                    ? "border-amber-300 bg-amber-50 dark:bg-amber-950/30"
                    : isLearned
                      ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-border bg-surface hover:border-accent/50",
                ].join(" ")}
              >
                <span className="font-jp text-2xl font-bold text-foreground leading-none">
                  {k.kanji}
                </span>
                {isMastered && <p className="text-[9px] text-amber-700 dark:text-amber-300 mt-0.5">⭐ mastered</p>}
                {isLearned && !isMastered && <p className="text-[9px] text-indigo-700 dark:text-indigo-300 mt-0.5">✓ learned</p>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
