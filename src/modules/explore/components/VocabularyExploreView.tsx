"use client";

import React, { useEffect, useState, useRef } from "react";
import { Volume2, Loader2, Sparkles, BookOpen, Layers, Bookmark } from "lucide-react";
import { ProgressBadge, ProgressStatus } from "./ProgressBadge";

interface KanjiGridItem {
  id: number;
  literal: string;
  unicode: string;
  strokeCount: number;
  grade: number | null;
  jlpt: number | null;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

interface RelatedWordItem {
  id: number;
  kanji: string;
  reading: string;
  meanings: any[];
  status?: ProgressStatus;
}

interface VocabularyExploreData {
  queryWord: string;
  userStatus?: ProgressStatus;
  vocabulary: {
    id: number | null;
    entrySeq: number | null;
    kanji: string;
    reading: string;
    meanings: any[];
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

  useEffect(() => {
    async function fetchVocabDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/explore/vocabulary/${encodeURIComponent(word)}`);
        if (!res.ok) throw new Error("Failed to load vocabulary details");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchVocabDetails();
  }, [word]);

  const playAudio = (audioFile: string) => {
    if (!audioFile) return;
    const url = audioFile.startsWith("/") ? audioFile : `/anki-media/${audioFile}`;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAudio(true);
    audio.play().catch((err) => console.warn("Audio play failed:", err));
    audio.onended = () => setPlayingAudio(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm font-medium">Exploring Word "{word}"...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-rose-400 bg-rose-950/30 rounded-2xl border border-rose-900/50 my-4">
        Failed to load vocabulary details.
      </div>
    );
  }

  const { vocabulary, ankiData, kanjiGrid, relatedWords, userStatus } = data;

  // Format meanings
  const formatMeaningList = (meanings: any[]) => {
    if (!Array.isArray(meanings) || meanings.length === 0) return ["No English meaning available."];
    return meanings.map((m) => {
      if (typeof m === "string") return m;
      if (m.glosses && Array.isArray(m.glosses)) {
        const posText = m.pos && m.pos.length > 0 ? `(${m.pos.join(", ")}) ` : "";
        return `${posText}${m.glosses.join("; ")}`;
      }
      return JSON.stringify(m);
    });
  };

  const meaningLines = formatMeaningList(vocabulary.meanings);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-slate-900 via-slate-900/80 to-blue-950/40 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 tracking-wide font-japanese">
                {vocabulary.reading}
              </span>
              {userStatus && <ProgressBadge status={userStatus} size="sm" />}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-japanese">
              {vocabulary.kanji}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {ankiData?.audio && (
              <button
                onClick={() => playAudio(ankiData.audio!)}
                className={`p-3 rounded-2xl border transition-all duration-200 ${
                  playingAudio
                    ? "bg-blue-500 text-white border-blue-400 scale-105 shadow-lg shadow-blue-500/30"
                    : "bg-slate-800/80 hover:bg-blue-600/30 text-blue-400 border-slate-700 hover:border-blue-500/50"
                }`}
                title="Play pronunciation"
              >
                <Volume2 className={`w-6 h-6 ${playingAudio ? "animate-pulse" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Primary Meanings */}
        <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-800/80">
          {meaningLines.map((line, i) => (
            <p key={i} className="text-base sm:text-lg font-medium text-slate-200">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Kanji Breakdown Section */}
      {kanjiGrid.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-base">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Kanji Breakdown ({kanjiGrid.length})</span>
            </div>
            <span className="text-xs text-slate-400">Click a kanji to explore</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {kanjiGrid.map((k) => (
              <button
                key={k.id}
                onClick={() => onSelectKanji(k.literal)}
                className="flex items-center gap-3 p-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all duration-200 group text-left shadow-sm hover:shadow-blue-500/10"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 text-2xl font-black text-white group-hover:text-blue-400 transition-colors font-japanese">
                  {k.literal}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {k.meanings.slice(0, 2).join(", ")}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {k.onyomi.concat(k.kunyomi).slice(0, 2).join(" • ")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example Sentence Section */}
      {ankiData?.sentence && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-base px-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Example Sentence</span>
          </div>

          <div className="flex flex-col gap-2 p-5 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-sm relative">
            <p className="text-lg font-bold text-slate-100 font-japanese leading-relaxed">
              {ankiData.sentence}
            </p>
            {ankiData.sentenceTranslation && (
              <p className="text-sm font-medium text-slate-400">
                {ankiData.sentenceTranslation}
              </p>
            )}
            {ankiData.sentenceAudio && (
              <button
                onClick={() => playAudio(ankiData.sentenceAudio!)}
                className="self-start mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-blue-600/20 text-blue-400 border border-slate-700 hover:border-blue-500/40 rounded-xl transition-all"
              >
                <Volume2 className="w-4 h-4" />
                Listen Sentence
              </button>
            )}
          </div>
        </div>
      )}

      {/* Related Words Section */}
      {relatedWords.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-base px-1">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Related Words ({relatedWords.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedWords.map((rw) => {
              const glosses = Array.isArray(rw.meanings)
                ? rw.meanings.map((m: any) => (typeof m === "string" ? m : m.glosses?.join(", "))).filter(Boolean).join("; ")
                : "";

              return (
                <button
                  key={rw.id}
                  onClick={() => onSelectWord(rw.kanji || rw.reading)}
                  className="flex flex-col gap-1 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl text-left transition-all duration-200 group shadow-sm hover:shadow-purple-500/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition-colors font-japanese">
                        {rw.kanji}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {rw.reading}
                      </span>
                    </div>
                    {rw.status && <ProgressBadge status={rw.status} size="sm" />}
                  </div>
                  {glosses && (
                    <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-300">
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
