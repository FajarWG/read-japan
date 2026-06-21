"use client";

import {
  useState,
  useCallback,
  useTransition,
  useMemo,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { Popover } from "@heroui/react";
import { parseJapaneseText } from "@/src/shared/lib/parser";
import type { ParsedUnit, KanaInfo } from "@/src/shared/lib/parser";
import { parseStoryText } from "@/src/modules/prep/lib/kotoba-lookup";
import type { StoryToken } from "@/src/modules/prep/lib/kotoba-lookup";
import {
  KotobaToken,
  useKotobaClickRecorder,
} from "@/src/modules/stories/components/KotobaToken";
import { VocabularyReview } from "@/src/modules/stories/components/VocabularyReview";
import {
  AddKanjiModal,
  type AddKanjiPrefill,
} from "@/src/modules/stories/components/AddKanjiModal";
import {
  recordClick,
  recordWrongReads,
  recordPerfectRead,
  recordStoryRead,
} from "@/src/modules/stories/actions";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { AudioButton } from "@/src/shared/components/AudioButton";

type ReaderMode = "reading" | "review" | "result" | "vocabReview";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: extract context sentence around a click position
// ─────────────────────────────────────────────────────────────────────────────

const JP_SENTENCE_END = /[。!?！？\n]/g;

/** Ambil kalimat (diakhiri 。!? atau newline) yang mengandung charIndex. */
function getContextSentence(
  text: string,
  charIndex: number,
  length: number,
): string {
  if (!text) return "";
  // Cari akhir kalimat sebelumnya
  let start = 0;
  for (let i = charIndex - 1; i >= 0; i--) {
    if (JP_SENTENCE_END.test(text[i] ?? "")) {
      start = i + 1;
      break;
    }
  }
  // Cari akhir kalimat setelah charIndex+length
  let end = text.length;
  for (let i = charIndex + length; i < text.length; i++) {
    if (JP_SENTENCE_END.test(text[i] ?? "")) {
      end = i + 1;
      break;
    }
  }
  const slice = text.slice(start, end).trim();
  // Trim panjang jika terlalu panjang
  if (slice.length > 80) {
    const ellipsis = "…";
    const trimmed = slice.slice(0, 80).trim();
    return `${trimmed}${ellipsis}`;
  }
  return slice;
}

// ─────────────────────────────────────────────────────────────────────────────
// KanaToken — satu huruf kana (reading mode)
// ─────────────────────────────────────────────────────────────────────────────

interface KanaTokenProps {
  unit: ParsedUnit;
  fromLabel: string;
  /** Called when the popover opens — records a click (DB or localStorage) */
  onRecordOpen: (char: string) => void;
}

function KanaToken({ unit, fromLabel, onRecordOpen }: KanaTokenProps) {
  const [isPending, startClickTransition] = useTransition();
  const info = unit.info!;

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return;
        startClickTransition(async () => {
          try {
            await onRecordOpen(unit.char);
          } catch (err) {
            console.error("[KanaToken] recordOpen gagal:", err);
          }
        });
      }}
    >
      <Popover.Trigger className="inline-flex">
        <button
          type="button"
          aria-label={`${unit.char} (${info.romaji})`}
          className={[
            "relative cursor-pointer select-none rounded px-0.5",
            "transition-all duration-100",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
            isPending ? "opacity-60" : "",
            "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 text-foreground",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {unit.char}
          <span className="absolute bottom-0 left-0 right-0 h-px bg-indigo-400/60 rounded" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="max-w-52" placement="top">
        <Popover.Dialog>
          <Popover.Heading className="text-xl font-bold tracking-widest text-indigo-500 dark:text-indigo-300 text-center">
            {info.romaji}
          </Popover.Heading>
          <div className="mt-2 flex flex-col items-center gap-2">
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
              <span className="flex items-center gap-1 text-xs text-muted">
                <span>{fromLabel}</span>
                <span className="text-yellow-500 dark:text-yellow-300 font-bold text-base leading-none">
                  {info.origin}
                </span>
              </span>
            )}
            {info.explanation && (
              <span className="text-[11px] text-muted italic text-center">
                {info.explanation}
              </span>
            )}
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
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
          "text-xl md:text-3xl leading-tight font-jp",
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
  storyMeaning: string;
}

function TranslationCard({
  content,
  translation,
  storyMeaning,
}: TranslationCardProps) {
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
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/20 px-5 py-4">
      <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
        📝 {storyMeaning}
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
  onGoHome: () => void;
  storyContent: string;
  translation?: string;
  hasVocabulary: boolean;
  onStartVocabReview: () => void;
  storyId: number;
  vocabulary: Array<{
    entry: import("@/src/modules/prep/lib/kotoba-lookup").KotobaLookupEntry;
    surface: string;
    matchedChapter: number;
  }>;
  t: {
    resultOf: string;
    kanaReadCorrectly: string;
    wrong: string;
    needsStudy: string;
    perfectScore: string;
    debtReduced: string;
    goHomeNow: string;
    storyMeaning: string;
    vocabReviewTitle: string;
    vocabReviewCta: string;
    vocabCount: string;
  };
}

function ResultView({
  units,
  wrongIndices,
  onGoHome,
  storyContent,
  translation,
  hasVocabulary,
  onStartVocabReview,
  storyId,
  vocabulary,
  t,
}: ResultViewProps) {
  const kanaUnits = units.filter((u) => u.info);
  const totalKana = kanaUnits.length;
  const wrongCount = wrongIndices.size;
  const correctCount = totalKana - wrongCount;
  const score =
    totalKana > 0 ? Math.round((correctCount / totalKana) * 100) : 100;
  const [minedCount, setMinedCount] = useState<number | null>(null);
  const [mining, startMining] = useTransition();

  // Deduplicate wrong chars
  const wrongCharsMap = new Map<string, KanaInfo>();
  for (const idx of wrongIndices) {
    const unit = units[idx];
    if (unit?.info && !wrongCharsMap.has(unit.char)) {
      wrongCharsMap.set(unit.char, unit.info);
    }
  }

  const handleMineAll = () => {
    if (mining || minedCount !== null) return;
    startMining(async () => {
      try {
        const res = await fetch("/api/mine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyId,
            items: vocabulary.map((v) => ({
              kanji:
                v.entry.kanji && v.entry.kanji !== "-" ? v.entry.kanji : null,
              hiragana: v.entry.hiragana,
              meaning: v.entry.meaning,
              surface: v.surface,
            })),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setMinedCount(data.count ?? vocabulary.length);
        }
      } catch (err) {
        console.error("[Mine]", err);
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Wrong chars detail */}
      {wrongCharsMap.size > 0 && (
        <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 px-5 py-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
            📚 {t.needsStudy}
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
                <span className="text-xl font-jp leading-snug">{char}</span>
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
          <p className="text-sm text-muted mt-0.5 text-center">
            <strong className="text-foreground">{correctCount}</strong>{" "}
            {t.resultOf}{" "}
            <strong className="text-foreground">{totalKana}</strong>{" "}
            {t.kanaReadCorrectly}
            {wrongCount > 0 && (
              <>
                {" "}
                ·{" "}
                <strong className="text-red-500 dark:text-red-400">
                  {wrongCount} {t.wrong}
                </strong>
              </>
            )}
          </p>
        </div>
      )}

      {/* Perfect score */}
      {wrongCount === 0 && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-4 text-center flex flex-col gap-1">
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            🌟 {t.perfectScore}
          </p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-500">
            {t.debtReduced}
          </p>
        </div>
      )}

      {/* Memory Check CTA */}
      {hasVocabulary && (
        <button
          type="button"
          onClick={onStartVocabReview}
          className="w-full rounded-xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 px-5 py-4 text-left hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-950/40 dark:hover:to-amber-900/30 transition-colors group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                🃏 {t.vocabReviewTitle}
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                {t.vocabReviewCta.replace("{n}", t.vocabCount)}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Sentence Mining */}
      {hasVocabulary && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                ⛏️ Mine ke Anki (deck &ldquo;Mined&rdquo;)
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                {minedCount !== null
                  ? `✓ ${minedCount} kartu ditambahkan`
                  : `Tambah ${t.vocabCount} vocab dari cerita ini ke SRS`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleMineAll}
              disabled={mining || minedCount !== null}
              className="shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3 py-2 text-xs font-semibold transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {mining ? "..." : minedCount !== null ? "✓ Saved" : "⛏️ Mine"}
            </button>
          </div>
        </div>
      )}

      {/* Go home */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onGoHome}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <span>📚</span>
          <span>{t.goHomeNow}</span>
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
  chapter: number | null;
  storyTitle?: string;
  /** Pre-computed story tokens from server (includes KanjiDictionary). */
  precomputedTokens?: StoryToken[];
  adminModeActive?: boolean;
}

export default function Reader({
  storyContent,
  translation,
  storyId,
  chapter,
  storyTitle,
  precomputedTokens,
  adminModeActive = true,
}: ReaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [mode, setMode] = useState<ReaderMode>("reading");

  // AddKanji modal state (only used when isAdmin)
  const [addKanjiOpen, setAddKanjiOpen] = useState(false);
  const [addKanjiPrefill, setAddKanjiPrefill] =
    useState<AddKanjiPrefill | null>(null);

  // Track which kanji have been added in this session (for visual "✓" badge)
  const [addedKanji, setAddedKanji] = useState<Set<string>>(new Set());

  // Transition for recording story read
  const [, startRecordTransition] = useTransition();

  // Review mode state — Set of indices the user marked as wrong
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set());
  const [isSubmitting, startSubmitTransition] = useTransition();

  const units = parseJapaneseText(storyContent);
  // Story tokens: prefer server-precomputed (includes KanjiDictionary),
  // fallback to client-side parse if not provided.
  const storyTokens = useMemo<StoryToken[]>(
    () => precomputedTokens ?? parseStoryText(storyContent, chapter),
    [precomputedTokens, storyContent, chapter],
  );

  // Unique vocabulary list (untuk Anki-style review)
  const uniqueVocabulary = useMemo<
    Array<{
      entry: import("@/src/modules/prep/lib/kotoba-lookup").KotobaLookupEntry;
      surface: string;
      matchedChapter: number;
    }>
  >(() => {
    const seen = new Map<
      string,
      {
        entry: import("@/src/modules/prep/lib/kotoba-lookup").KotobaLookupEntry;
        surface: string;
        matchedChapter: number;
      }
    >();
    for (const token of storyTokens) {
      if (token.type !== "kotoba") continue;
      if (seen.has(token.entry.progressKey)) continue;
      seen.set(token.entry.progressKey, {
        entry: token.entry,
        surface: token.char,
        matchedChapter: token.matchedChapter,
      });
    }
    return Array.from(seen.values());
  }, [storyTokens]);

  // Kotoba click recorder (selalu catat ke DB)
  const handleKotobaClick = useKotobaClickRecorder();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleWrong = useCallback((index: number) => {
    setWrongIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  /**
   * Called when a kana token popover opens.
   * Selalu tercatat ke DB (semua user wajib login per middleware).
   */
  const handleKanaRecord = useCallback(async (char: string) => {
    await recordClick(char);
  }, []);

  const handleFinishReading = () => {
    setWrongIndices(new Set());
    setMode("review");
    // Always record story read to DB (global counter)
    startRecordTransition(async () => {
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

  // ── VOCAB REVIEW MODE ──────────────────────────────────────────────────────

  if (mode === "vocabReview") {
    return (
      <VocabularyReview
        storyTitle={storyTitle ?? ""}
        vocabulary={uniqueVocabulary}
        onExit={() => setMode("result")}
      />
    );
  }

  // ── RESULT MODE ────────────────────────────────────────────────────────────

  if (mode === "result") {
    return (
      <ResultView
        units={units}
        wrongIndices={wrongIndices}
        onGoHome={() => router.push("/stories")}
        storyContent={storyContent}
        translation={translation}
        hasVocabulary={uniqueVocabulary.length > 0}
        onStartVocabReview={() => setMode("vocabReview")}
        storyId={storyId}
        vocabulary={uniqueVocabulary}
        t={{
          resultOf: t.resultOf,
          kanaReadCorrectly: t.resultKanaRead,
          wrong: t.resultWrong,
          needsStudy: t.needsStudy,
          perfectScore: t.perfectScore,
          debtReduced: t.debtReduced,
          goHomeNow: t.goHomeNow,
          storyMeaning: t.storyMeaning,
          vocabReviewTitle: t.vocabReviewTitle,
          vocabReviewCta: t.vocabReviewCta,
          vocabCount: String(uniqueVocabulary.length),
        }}
      />
    );
  }

  // ── REVIEW MODE ────────────────────────────────────────────────────────────

  if (mode === "review") {
    // Kelompokkan units per kalimat (pisah di 。)
    const sentenceGroups: { units: ParsedUnit[]; startIndex: number }[] = [];
    let cur: ParsedUnit[] = [];
    let curStart = 0;
    for (let i = 0; i < units.length; i++) {
      cur.push(units[i]);
      if (units[i].char === "。") {
        sentenceGroups.push({ units: cur, startIndex: curStart });
        curStart = i + 1;
        cur = [];
      }
    }
    if (cur.length > 0)
      sentenceGroups.push({ units: cur, startIndex: curStart });

    const idSentences = translation
      ? translation
          .split(".")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return (
      <div className="flex flex-col gap-5">
        {/* Teks + romaji per kalimat, terjemahan langsung di bawahnya */}
        <div className="flex flex-col gap-4">
          {sentenceGroups.map((group, si) => (
            <div key={si} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-end gap-x-0.5 gap-y-2">
                {group.units.map((unit, localIdx) => {
                  const globalIndex = group.startIndex + localIdx;
                  if (!unit.info) {
                    return (
                      <span
                        key={globalIndex}
                        className="text-xl md:text-3xl text-foreground font-jp leading-tight pb-0.5"
                      >
                        {unit.char}
                      </span>
                    );
                  }
                  return (
                    <ReviewKanaToken
                      key={globalIndex}
                      unit={unit}
                      index={globalIndex}
                      isWrong={wrongIndices.has(globalIndex)}
                      onToggle={handleToggleWrong}
                    />
                  );
                })}
              </div>
              {idSentences[si] && (
                <p className="text-sm text-muted leading-relaxed pl-1">
                  {idSentences[si]}.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <p className="text-sm text-muted">
            {wrongIndices.size > 0 ? (
              <span className="text-red-500 dark:text-red-400 font-medium">
                {wrongIndices.size} {t.markedWrong}
              </span>
            ) : (
              <span>{t.noneMarked}</span>
            )}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMode("reading")}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              {t.backToReading}
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
                ? t.saving
                : wrongIndices.size > 0
                  ? t.submitWrong.replace("{n}", String(wrongIndices.size))
                  : t.submitPerfect}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READING MODE ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Audio bar — play whole story */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10 px-4 py-2.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            🔊 Dengarkan cerita
          </p>
          <p className="text-[10px] text-muted">Web Speech API · voice ja-JP</p>
        </div>
        <AudioButton
          text={storyContent}
          rate={0.85}
          variant="primary"
          label="▶ Putar cerita"
        />
      </div>

      {/* Teks cerita — kana + kanji + plain tokens */}
      <p className="text-xl md:text-3xl leading-14 tracking-wider font-medium overflow-visible">
        {storyTokens.map((token, index) => {
          if (token.type === "plain") {
            // Plain token: untuk ADMIN, render sebagai button klik untuk
            // menambah kanji ke KanjiDictionary jika mode admin aktif.
            if (isAdmin && adminModeActive) {
              const char = token.char;
              const isAdded = addedKanji.has(char);
              const context = getContextSentence(
                storyContent,
                token.charIndex,
                char.length,
              );
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setAddKanjiPrefill({
                      kanji: char,
                      context,
                      chapter: chapter ?? undefined,
                    });
                    setAddKanjiOpen(true);
                  }}
                  aria-label={`Tambah kanji ${char} ke dictionary`}
                  title={`Admin: klik untuk menambah ${char}`}
                  className={[
                    "inline cursor-pointer rounded px-0.5 transition-all duration-100",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    isAdded
                      ? "text-emerald-600 dark:text-emerald-400 underline decoration-emerald-400 decoration-1 underline-offset-4"
                      : "text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:underline decoration-blue-300 decoration-dotted decoration-1 underline-offset-4",
                  ].join(" ")}
                >
                  {char}
                </button>
              );
            }
            return (
              <span key={index} className="text-foreground">
                {token.char}
              </span>
            );
          }
          if (token.type === "kotoba") {
            return (
              <KotobaToken
                key={index}
                entry={token.entry}
                surface={token.char}
                onRecordOpen={handleKotobaClick}
              />
            );
          }
          // kana
          if (!token.info) {
            return (
              <span key={index} className="text-foreground">
                {token.char}
              </span>
            );
          }
          return (
            <KanaToken
              key={index}
              unit={{ char: token.char, info: token.info }}
              fromLabel={t.fromOrigin}
              onRecordOpen={handleKanaRecord}
            />
          );
        })}
      </p>

      {/* Selesai membaca button + bookmark */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
        <p className="text-xs text-muted">{t.readingTip}</p>
        <div className="flex items-center gap-2 shrink-0">
          <BookmarkButton
            storyId={storyId}
            storyContent={storyContent}
            translation={translation}
          />
          <button
            type="button"
            onClick={handleFinishReading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <span>✅</span>
            <span>{t.finishReading}</span>
          </button>
        </div>
      </div>

      {/* Modal Tambah Kanji (admin only) */}
      <AddKanjiModal
        open={addKanjiOpen}
        prefill={addKanjiPrefill}
        onClose={() => setAddKanjiOpen(false)}
        onSaved={() => {
          if (addKanjiPrefill) {
            setAddedKanji((prev) => {
              const next = new Set(prev);
              next.add(addKanjiPrefill.kanji);
              return next;
            });
            // Reload page agar precomputedTokens di-refresh dari server
            router.refresh();
          }
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────
// BookmarkButton — save entire story as one bookmark
// ─────────────────────────────────────────

function BookmarkButton({
  storyId,
  storyContent,
  translation,
}: {
  storyId: number;
  storyContent: string;
  translation?: string | null;
}) {
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/bookmarks?storyId=${storyId}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (
          (data.bookmarks as Array<{ charIndex: number }>).some(
            (b) => b.charIndex === 0,
          )
        ) {
          setSaved(true);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storyId]);

  const handleBookmark = () => {
    if (saved || pending) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyId,
            sentence: storyContent,
            translation: translation ?? undefined,
            charIndex: 0,
            length: storyContent.length,
          }),
        });
        if (res.ok) setSaved(true);
      } catch (err) {
        console.error("[BookmarkButton]", err);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={saved || pending}
      aria-label="Bookmark cerita"
      title={saved ? "Tersimpan" : "Bookmark cerita ini"}
      className={[
        "px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 border",
        saved
          ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50 cursor-default"
          : "bg-surface text-foreground border-border hover:bg-surface-muted",
      ].join(" ")}
    >
      <span>{saved ? "🔖" : "📑"}</span>
      <span className="hidden sm:inline">
        {saved ? "Tersimpan" : pending ? "..." : "Bookmark"}
      </span>
    </button>
  );
}
