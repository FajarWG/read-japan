"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Volume2,
  Loader2,
  Sparkles,
  BookOpen,
  Layers,
  Brain,
  AlertTriangle,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";
import { cleanJMdictArray, cleanJMdictString } from "@/src/shared/lib/sanitize";

interface KanjiGridItem {
  id: number;
  literal: string;
  unicode: string;
  strokeCount: number;
  grade: number | null;
  jlpt: number | null;
  status?: ProgressStatus;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

interface SrsSnapshot {
  interval: number;
  ease: number;
  repetitions: number;
  dueDate: string | null;
  status: ProgressStatus;
}

interface SimilarKanjiItem {
  kanji: string;
  similarKanji: string;
  reason: string;
  difficulty: string;
}

interface MnemonicItem {
  moji: string;
  yomi: string;
  imi: string;
  mnemonic: string | null;
  examples: Array<{ word: string; yomi: string; imi: string }>;
}

interface RelatedWordItem {
  id: number;
  kanji: string;
  reading: string;
  meanings: unknown[];
  jlpt: number | null;
  status?: ProgressStatus;
}

interface VocabularyExploreData {
  queryWord: string;
  userStatus?: ProgressStatus;
  srs?: SrsSnapshot | null;
  similarKanji?: SimilarKanjiItem[];
  mnemonics?: MnemonicItem[];
  vocabulary: {
    id: number | null;
    entrySeq: number | null;
    kanji: string;
    reading: string;
    meanings: unknown[];
    jlpt: number | null;
  };
  ankiData: {
    audio: string | null;
    sentence: string | null;
    sentenceTranslation: string | null;
    sentenceAudio: string | null;
    image: string | null;
  } | null;
  kanjiGrid: KanjiGridItem[];
  relatedWords: RelatedWordItem[];
}

interface VocabularyExploreViewProps {
  word: string;
  onSelectKanji: (literal: string) => void;
  onSelectWord: (word: string) => void;
}

export const VocabularyExploreView: React.FC<VocabularyExploreViewProps> = ({
  word,
  onSelectKanji,
  onSelectWord,
}) => {
  const [data, setData] = useState<VocabularyExploreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanQuery = (word || "").replace(/<[^>]*>/g, "").trim();

  const fetchVocabDetails = async () => {
    if (!cleanQuery) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/explore/vocabulary/${encodeURIComponent(cleanQuery)}`,
      );
      if (!res.ok) throw new Error("Failed to load vocabulary details");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!cleanQuery) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/explore/vocabulary/${encodeURIComponent(cleanQuery)}`,
        );
        if (!res.ok) throw new Error("Failed to load vocabulary details");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An error occurred",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [cleanQuery]);

  const playAudio = (audioFile: string) => {
    if (!audioFile) return;
    const url = audioFile.startsWith("/")
      ? audioFile
      : `/anki-media/${audioFile}`;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAudio(true);
    audio.play().catch((err) => console.warn("Audio play failed:", err));
    audio.onended = () => setPlayingAudio(false);
  };

  if (!cleanQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted gap-2 text-center">
        <BookOpen className="w-8 h-8 opacity-40 text-muted" />
        <span className="text-xs font-medium">Select a word from the list to explore</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
        <span className="text-xs font-semibold">
          Exploring &ldquo;{cleanQuery}&rdquo;...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-rose-500/10 rounded-2xl border border-rose-500/30 my-4 gap-3">
        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
          {error || "Failed to load vocabulary details."}
        </p>
        <button
          type="button"
          onClick={fetchVocabDetails}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-foreground hover:bg-surface-muted border border-border rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  const {
    vocabulary,
    ankiData,
    kanjiGrid,
    relatedWords,
    userStatus,
    srs,
    similarKanji = [],
    mnemonics = [],
  } = data;

  // Format and clean meanings
  const meaningLines = cleanJMdictArray(vocabulary.meanings);

  // Sisa hari sampai review berikutnya
  const daysUntilDue = (() => {
    if (!srs?.dueDate) return null;
    const diffMs = new Date(srs.dueDate).getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  })();

  const dueLabel =
    daysUntilDue === null
      ? "—"
      : daysUntilDue <= 0
        ? "Due now"
        : daysUntilDue === 1
          ? "Tomorrow"
          : `In ${daysUntilDue}d`;

  const hasMemoryHooks = mnemonics.some(
    (m) => m.mnemonic || m.examples.length > 0,
  );

  return (
    <div className="flex flex-col gap-4 py-1 text-foreground">
      {/* Header Card: Japanese Word & Core Meaning */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 bg-surface-muted/40 rounded-2xl border border-border/80 shadow-2xs relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            {vocabulary.reading && vocabulary.reading !== vocabulary.kanji && (
              <span className="text-xs font-bold font-jp text-indigo-500 dark:text-indigo-400 tracking-wide">
                {vocabulary.reading}
              </span>
            )}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-jp">
                {vocabulary.kanji}
              </h1>
              {userStatus && <ProgressBadge status={userStatus} size="sm" />}
              {vocabulary.jlpt && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                  JLPT N{vocabulary.jlpt}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {ankiData?.audio && (
              <button
                type="button"
                onClick={() => playAudio(ankiData.audio!)}
                className={[
                  "p-2.5 rounded-xl border transition-all cursor-pointer",
                  playingAudio
                    ? "bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20"
                    : "bg-surface hover:bg-surface-muted text-indigo-600 dark:text-indigo-400 border-border shadow-2xs",
                ].join(" ")}
                title="Play pronunciation"
              >
                <Volume2
                  className={`w-4 h-4 ${playingAudio ? "animate-pulse" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Primary Meanings */}
        <div className="pt-2 border-t border-border/60">
          {meaningLines.length > 0 ? (
            <div className="flex flex-col gap-1">
              {meaningLines.slice(0, 3).map((line, i) => (
                <p
                  key={i}
                  className="text-xs sm:text-sm font-semibold text-foreground leading-snug"
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">
              No English / Indonesian translation available.
            </p>
          )}
        </div>
      </div>

      {/* Your Memory (SRS snapshot) */}
      {srs && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <Brain className="w-3.5 h-3.5 text-emerald-500" />
            <span>Your Memory</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Next review", value: dueLabel },
              { label: "Interval", value: `${srs.interval}d` },
              { label: "Reviews", value: String(srs.repetitions) },
              { label: "Ease", value: srs.ease.toFixed(2) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-0.5 p-2 rounded-xl bg-surface border border-border shadow-2xs"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
                <span className="text-sm font-black text-foreground">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Hook (Anki card image) */}
      {ankiData?.image && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>Visual Hook</span>
          </div>
          <div className="flex justify-center p-3 bg-surface border border-border rounded-2xl shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/anki-media/${ankiData.image}`}
              alt={vocabulary.kanji}
              className="max-h-40 w-auto rounded-xl object-contain"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Kanji Breakdown Section */}
      {kanjiGrid.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Kanji Breakdown ({kanjiGrid.length})</span>
            </div>
            <span className="text-[10px] text-muted">Tap to explore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {kanjiGrid.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => onSelectKanji(k.literal)}
                className="group flex items-center gap-3 p-2.5 bg-surface hover:bg-surface-muted border border-border hover:border-indigo-500/40 rounded-xl transition-all text-left shadow-2xs cursor-pointer"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-surface-muted group-hover:bg-indigo-500/10 rounded-xl border border-border group-hover:border-indigo-500/30 text-xl font-black text-foreground group-hover:text-indigo-500 transition-colors font-jp">
                  {k.literal}
                </div>
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="text-xs font-bold text-foreground truncate group-hover:text-indigo-500 transition-colors">
                    {cleanJMdictString(k.meanings.slice(0, 2).join(", "))}
                  </span>
                  <span className="text-[10px] text-muted truncate font-jp">
                    {k.onyomi.concat(k.kunyomi).slice(0, 2).join(" • ")}
                  </span>
                  <div className="flex flex-wrap items-center gap-1 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded-md bg-surface-muted text-[8px] font-bold text-muted border border-border/60">
                      {k.strokeCount}画
                    </span>
                    {k.jlpt && (
                      <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-[8px] font-bold text-indigo-500">
                        N{k.jlpt}
                      </span>
                    )}
                    {k.status && k.status !== "new" && (
                      <ProgressBadge status={k.status} size="sm" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example Sentence Section */}
      {ankiData?.sentence && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Example Sentence</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 bg-surface border border-border rounded-2xl shadow-2xs">
            <p className="text-sm sm:text-base font-bold text-foreground font-jp leading-relaxed">
              {cleanJMdictString(ankiData.sentence)}
            </p>
            {ankiData.sentenceTranslation && (
              <p className="text-xs font-medium text-muted">
                {cleanJMdictString(ankiData.sentenceTranslation)}
              </p>
            )}
            {ankiData.sentenceAudio && (
              <button
                type="button"
                onClick={() => playAudio(ankiData.sentenceAudio!)}
                className="self-start mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-surface-muted hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-border rounded-lg transition-all cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen sentence</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Memory Hooks (Mnemonics) */}
      {hasMemoryHooks && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <Brain className="w-3.5 h-3.5 text-teal-500" />
            <span>Memory Hooks</span>
          </div>

          <div className="flex flex-col gap-2">
            {mnemonics
              .filter((m) => m.mnemonic || m.examples.length > 0)
              .map((m) => (
                <div
                  key={m.moji}
                  className="flex flex-col gap-2 p-3 bg-surface border border-border rounded-xl shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-surface-muted border border-border rounded-lg text-lg font-black font-jp text-foreground">
                      {m.moji}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">
                        {m.imi}
                      </span>
                      <span className="text-[10px] text-muted font-jp truncate">
                        {m.yomi}
                      </span>
                    </div>
                  </div>

                  {m.mnemonic && (
                    <p className="text-xs leading-relaxed text-foreground/90 border-l-2 border-teal-500/60 pl-2.5 italic">
                      {m.mnemonic}
                    </p>
                  )}

                  {m.examples.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.examples.map((ex, i) => (
                        <button
                          key={`${m.moji}-${i}`}
                          type="button"
                          onClick={() => onSelectWord(ex.word)}
                          className="flex items-center gap-1.5 px-2 py-1 bg-surface-muted hover:bg-teal-500/10 border border-border hover:border-teal-500/30 rounded-lg text-left transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-bold font-jp text-foreground">
                            {ex.word}
                          </span>
                          <span className="text-[9px] text-muted">
                            {ex.yomi} · {ex.imi}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Easily Confused */}
      {similarKanji.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Easily Confused</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {similarKanji.map((s) => (
              <button
                key={`${s.kanji}-${s.similarKanji}`}
                type="button"
                onClick={() => onSelectKanji(s.similarKanji)}
                className="flex items-start gap-2.5 p-3 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xl font-black font-jp text-foreground">
                    {s.kanji}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                    vs
                  </span>
                  <span className="text-xl font-black font-jp text-amber-600 dark:text-amber-400">
                    {s.similarKanji}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-foreground leading-snug">
                    {s.reason}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 mt-0.5">
                    {s.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related Words Section */}
      {relatedWords.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Related Compound Words ({relatedWords.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {relatedWords.map((rw) => {
              const glosses = cleanJMdictArray(rw.meanings).join("; ");

              return (
                <button
                  key={rw.id}
                  type="button"
                  onClick={() => onSelectWord(rw.kanji || rw.reading)}
                  className="flex flex-col gap-0.5 p-2.5 bg-surface hover:bg-surface-muted border border-border hover:border-purple-500/40 rounded-xl text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-jp truncate">
                        {rw.kanji}
                      </span>
                      <span className="text-[10px] text-muted font-jp truncate">
                        {rw.reading}
                      </span>
                    </div>
                    {rw.status && <ProgressBadge status={rw.status} size="sm" />}
                  </div>
                  {glosses && (
                    <p className="text-[10px] text-muted line-clamp-1 group-hover:text-foreground">
                      {glosses}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

