"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseJapaneseText } from "@/src/lib/parser";
import type { ParsedUnit, KanaInfo } from "@/src/lib/parser";
import {
  recordClick,
  recordWrongReads,
  recordPerfectRead,
  recordStoryRead,
} from "@/src/app/actions";

type ReaderMode = "reading" | "review" | "result";

// ─────────────────────────────────────────────────────────────────────────────
// KanaPopover — kartu info (reading mode)
// ─────────────────────────────────────────────────────────────────────────────

interface KanaPopoverProps {
  info: KanaInfo;
  onStopPropagation: (e: React.MouseEvent) => void;
}

function KanaPopover({ info, onStopPropagation }: KanaPopoverProps) {
  return (
    <span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 flex flex-col items-center pointer-events-auto"
      onClick={onStopPropagation}
    >
      <span className="bg-gray-900 rounded-2xl shadow-2xl px-4 py-3 min-w-max flex flex-col items-center gap-1.5 text-white border border-white/10">
        <span className="text-2xl font-bold tracking-widest text-indigo-300 leading-none">
          {info.romaji}
        </span>
        <span
          className={[
            "text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full",
            info.type === "hiragana"
              ? "bg-emerald-600/80 text-emerald-100"
              : "bg-violet-600/80 text-violet-100",
          ].join(" ")}
        >
          {info.type}
        </span>
        {info.origin && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span>dari</span>
            <span className="text-yellow-300 font-bold text-base leading-none">
              {info.origin}
            </span>
          </span>
        )}
        {info.explanation && (
          <span className="text-[11px] text-gray-400 italic">
            {info.explanation}
          </span>
        )}
      </span>
      <span className="w-3 h-3 bg-gray-900 rotate-45 -mt-1.5 rounded-sm border-r border-b border-white/10" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KanaToken — satu huruf kana (reading mode)
// ─────────────────────────────────────────────────────────────────────────────

interface KanaTokenProps {
  unit: ParsedUnit;
  index: number;
  isActive: boolean;
  isPendingThis: boolean;
  onToggle: (index: number, unit: ParsedUnit, e: React.MouseEvent) => void;
}

function KanaToken({
  unit,
  index,
  isActive,
  isPendingThis,
  onToggle,
}: KanaTokenProps) {
  const info = unit.info!;
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-expanded={isActive}
        aria-label={`${unit.char} (${info.romaji})`}
        onClick={(e) => onToggle(index, unit, e)}
        className={[
          "relative cursor-pointer select-none rounded px-0.5",
          "transition-all duration-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
          isPendingThis && "opacity-60",
          isActive
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 text-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {unit.char}
        <span className="absolute bottom-0 left-0 right-0 h-px bg-indigo-400/60 rounded" />
      </button>
      {isActive && (
        <KanaPopover
          info={info}
          onStopPropagation={(e) => e.stopPropagation()}
        />
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReviewKanaToken — huruf kana dengan romaji di atas + bisa di-toggle (review mode)
// ─────────────────────────────────────────────────────────────────────────────

interface ReviewKanaTokenProps {
  unit: ParsedUnit;
  index: number;
  isWrong: boolean;
  onToggle: (index: number) => void;
}

function ReviewKanaToken({
  unit,
  index,
  isWrong,
  onToggle,
}: ReviewKanaTokenProps) {
  const info = unit.info!;
  return (
    <button
      type="button"
      onClick={() => onToggle(index)}
      title={isWrong ? "Klik untuk batalkan" : "Klik jika kamu salah membaca"}
      className={[
        "inline-flex flex-col items-center px-1 py-0.5 rounded-lg transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        isWrong
          ? "bg-red-100 ring-1 ring-red-300 dark:bg-red-900/50 dark:ring-red-700 focus-visible:ring-red-400"
          : "bg-emerald-50 dark:bg-emerald-900/20 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus-visible:ring-indigo-400",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Romaji di atas */}
      <span
        className={[
          "text-[10px] font-bold leading-none pb-0.5",
          isWrong
            ? "text-red-500 dark:text-red-400"
            : "text-indigo-500 dark:text-indigo-400",
        ].join(" ")}
      >
        {info.romaji}
      </span>
      {/* Kana di bawah */}
      <span
        className={[
          "text-3xl leading-tight font-jp",
          isWrong ? "text-red-600 dark:text-red-300" : "text-foreground",
        ].join(" ")}
      >
        {unit.char}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────// TranslationCard — arti cerita ditampilkan di review & result mode
// ───────────────────────────────────────────────────────────────────────────────

interface TranslationCardProps {
  content: string;
  translation: string;
}

function TranslationCard({ content, translation }: TranslationCardProps) {
  // Split Japanese by 。 (full-width period)
  const jpSentences = content
    .split("。")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s + "。");

  // Split Indonesian translation by .
  const idSentences = translation
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s + ".");

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/20 px-5 py-4">
      <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
        📝 Arti Cerita
      </p>
      <div className="flex flex-col gap-3">
        {jpSentences.map((jp, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <p className="font-jp text-sm leading-relaxed text-foreground">
              {jp}
            </p>
            {idSentences[i] && (
              <p className="text-sm leading-relaxed text-muted">
                {idSentences[i]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────// ResultView — tampilan hasil setelah submit
// ─────────────────────────────────────────────────────────────────────────────

interface ResultViewProps {
  units: ParsedUnit[];
  wrongIndices: Set<number>;
  countdown: number;
  onGoHome: () => void;
  storyContent: string;
  translation?: string;
}

function ResultView({
  units,
  wrongIndices,
  countdown,
  onGoHome,
  storyContent,
  translation,
}: ResultViewProps) {
  const kanaUnits = units.filter((u) => u.info);
  const totalKana = kanaUnits.length;
  const wrongCount = wrongIndices.size;
  const correctCount = totalKana - wrongCount;
  const score =
    totalKana > 0 ? Math.round((correctCount / totalKana) * 100) : 100;

  const emoji =
    score === 100
      ? "🎉"
      : score >= 80
        ? "😊"
        : score >= 60
          ? "🙂"
          : score >= 40
            ? "😅"
            : "💪";

  // Deduplicate wrong chars
  const wrongCharsMap = new Map<string, KanaInfo>();
  for (const idx of wrongIndices) {
    const unit = units[idx];
    if (unit?.info && !wrongCharsMap.has(unit.char)) {
      wrongCharsMap.set(unit.char, unit.info);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Score card */}
      <div className="rounded-2xl border border-border bg-surface-muted px-6 py-6 flex flex-col items-center gap-2 text-center">
        <span className="text-5xl leading-none">{emoji}</span>
        <div className="text-5xl font-bold text-foreground mt-1">{score}%</div>
        <p className="text-sm text-muted mt-0.5">
          <strong className="text-foreground">{correctCount}</strong> dari{" "}
          <strong className="text-foreground">{totalKana}</strong> kana dibaca
          benar
          {wrongCount > 0 && (
            <>
              {" "}
              ·{" "}
              <strong className="text-red-500 dark:text-red-400">
                {wrongCount} salah
              </strong>
            </>
          )}
        </p>
      </div>

      {/* Wrong chars detail */}
      {wrongCharsMap.size > 0 && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 px-5 py-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
            📚 Perlu dipelajari lagi:
          </p>
          <div className="flex flex-wrap gap-2">
            {[...wrongCharsMap.entries()].map(([char, info]) => (
              <div
                key={char}
                className="flex flex-col items-center px-3 py-2 rounded-xl bg-white dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 shadow-sm"
              >
                <span className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 leading-none pb-0.5">
                  {info.romaji}
                </span>
                <span className="text-2xl font-jp leading-snug">{char}</span>
                <span
                  className={[
                    "text-[9px] font-bold uppercase tracking-wide mt-1 px-1.5 py-0.5 rounded-full",
                    info.type === "hiragana"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                      : "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
                  ].join(" ")}
                >
                  {info.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Perfect score */}
      {wrongCount === 0 && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-4 text-center flex flex-col gap-1">
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            🌟 Luar biasa! Semua kana dibaca dengan benar!
          </p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-500">
            Hutang bacaan untuk kana di cerita ini dikurangi 1 ✓
          </p>
        </div>
      )}

      {/* Translation */}
      {translation && (
        <TranslationCard content={storyContent} translation={translation} />
      )}

      {/* Countdown + go home */}
      <div className="flex flex-col items-center gap-3 pt-1">
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted">
          Kembali ke beranda dalam{" "}
          <strong className="text-foreground tabular-nums">{countdown}</strong>
          s…
        </p>
        <button
          type="button"
          onClick={onGoHome}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <span>🏠</span>
          <span>Ke Beranda Sekarang</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reader — komponen utama
// ─────────────────────────────────────────────────────────────────────────────

interface ReaderProps {
  storyContent: string;
  translation?: string;
  storyId: number;
}

export default function Reader({
  storyContent,
  translation,
  storyId,
}: ReaderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ReaderMode>("reading");

  // Reading mode state
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Review mode state — Set of indices the user marked as wrong
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set());
  const [isSubmitting, startSubmitTransition] = useTransition();

  // Result mode: countdown to redirect
  const [countdown, setCountdown] = useState(5);

  const units = parseJapaneseText(storyContent);

  // Tutup popover saat klik di luar (reading mode saja)
  useEffect(() => {
    if (mode !== "reading" || activeIndex === null) return;
    const close = () => setActiveIndex(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [activeIndex, mode]);

  // Hitung mundur dan redirect ke beranda setelah result
  useEffect(() => {
    if (mode !== "result") return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (mode === "result" && countdown === 0) {
      router.push("/");
    }
  }, [countdown, mode, router]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleTogglePopover = useCallback(
    (index: number, unit: ParsedUnit, e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveIndex((prev) => (prev === index ? null : index));
      setPendingIndex(index);
      startTransition(async () => {
        try {
          await recordClick(unit.char);
        } catch (err) {
          console.error("[recordClick] gagal:", err);
        } finally {
          setPendingIndex(null);
        }
      });
    },
    [],
  );

  const handleToggleWrong = useCallback((index: number) => {
    setWrongIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleFinishReading = () => {
    setActiveIndex(null);
    setWrongIndices(new Set());
    setMode("review");
    startTransition(async () => {
      try {
        await recordStoryRead(storyId);
      } catch (err) {
        console.error("[recordStoryRead] gagal:", err);
      }
    });
  };

  const handleSubmitReview = () => {
    const wrongChars = [
      ...new Set(Array.from(wrongIndices).map((i) => units[i].char)),
    ];
    // Semua kana unik yang ada di cerita ini
    const allKanaChars = [
      ...new Set(units.filter((u) => u.info).map((u) => u.char)),
    ];
    startSubmitTransition(async () => {
      try {
        if (wrongChars.length === 0) {
          // Skor sempurna — bayar hutang untuk semua kana di cerita ini
          await recordPerfectRead(allKanaChars);
        } else {
          await recordWrongReads(wrongChars);
        }
      } catch (err) {
        console.error("[handleSubmitReview] gagal menyimpan:", err);
      } finally {
        setMode("result");
      }
    });
  };

  // ── RESULT MODE ────────────────────────────────────────────────────────────

  if (mode === "result") {
    return (
      <ResultView
        units={units}
        wrongIndices={wrongIndices}
        countdown={countdown}
        onGoHome={() => router.push("/")}
        storyContent={storyContent}
        translation={translation}
      />
    );
  }

  // ── REVIEW MODE ────────────────────────────────────────────────────────────

  if (mode === "review") {
    return (
      <div className="flex flex-col gap-5">
        {/* Teks + romaji, items-end agar huruf non-kana sejajar di bawah */}
        <div className="flex flex-wrap items-end gap-x-0.5 gap-y-2">
          {units.map((unit, index) => {
            if (!unit.info) {
              return (
                <span
                  key={index}
                  className="text-3xl text-foreground font-jp leading-tight pb-0.5"
                >
                  {unit.char}
                </span>
              );
            }
            return (
              <ReviewKanaToken
                key={index}
                unit={unit}
                index={index}
                isWrong={wrongIndices.has(index)}
                onToggle={handleToggleWrong}
              />
            );
          })}
        </div>

        {/* Translation */}
        {translation && (
          <TranslationCard content={storyContent} translation={translation} />
        )}

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <p className="text-sm text-muted">
            {wrongIndices.size > 0 ? (
              <span className="text-red-500 dark:text-red-400 font-medium">
                {wrongIndices.size} kana ditandai salah
              </span>
            ) : (
              <span>Belum ada yang ditandai — tap huruf yang salah baca</span>
            )}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMode("reading")}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              ← Kembali Membaca
            </button>
            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className={[
                "px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm",
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
              ].join(" ")}
            >
              {isSubmitting
                ? "Menyimpan…"
                : wrongIndices.size > 0
                  ? `Submit Hasil (${wrongIndices.size} salah)`
                  : "Submit — Semua Benar ✓"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READING MODE ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Teks cerita */}
      <p className="text-3xl leading-14 tracking-wider font-medium overflow-visible">
        {units.map((unit, index) => {
          if (!unit.info) {
            return (
              <span key={index} className="text-foreground">
                {unit.char}
              </span>
            );
          }
          return (
            <KanaToken
              key={index}
              unit={unit}
              index={index}
              isActive={activeIndex === index}
              isPendingThis={isPending && pendingIndex === index}
              onToggle={handleTogglePopover}
            />
          );
        })}
      </p>

      {/* Selesai membaca button */}
      <div className="flex justify-end pt-3 border-t border-border">
        <button
          type="button"
          onClick={handleFinishReading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <span>✅</span>
          <span>Selesai Membaca</span>
        </button>
      </div>
    </div>
  );
}
