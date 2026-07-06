"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Info, PenTool } from "lucide-react";
import { CONJUGATION_EXAMPLES } from "../data/conjugationExamples";
import { HandwritingPracticeWidget } from "@/src/shared/components/HandwritingPracticeWidget";

interface ExamplesTabProps {
  formKey: string;
  lang: "en" | "id";
}

export function ExamplesTab({ formKey, lang }: ExamplesTabProps) {
  const sentences = CONJUGATION_EXAMPLES[formKey] || [];
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);

  if (sentences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted">
        <Info className="w-8 h-8 mb-2" />
        <p>{lang === "en" ? "No examples available for this form." : "Contoh kalimat tidak tersedia untuk bentuk ini."}</p>
      </div>
    );
  }

  const renderJapaneseWithHighlight = (text: string, highlight: string) => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(highlight);
    return (
      <span className="font-jp text-base sm:text-lg font-medium text-foreground tracking-wide leading-relaxed">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="bg-accent/10 border-b-2 border-accent text-accent font-extrabold px-1 rounded-xs select-all shadow-2xs">
                {highlight}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* ── Display Options Bar ─────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border border-border/40 bg-surface/50 rounded-2xl p-4 shadow-2xs select-none">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">
          {lang === "en" ? "Study Options" : "Opsi Belajar"}
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer",
              showFurigana
                ? "bg-accent/10 border-accent/25 text-accent"
                : "bg-background border-border/40 text-muted hover:text-foreground",
            ].join(" ")}
          >
            {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {lang === "en" ? "Furigana" : "Furigana"}
          </button>

          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer",
              showRomaji
                ? "bg-accent/10 border-accent/25 text-accent"
                : "bg-background border-border/40 text-muted hover:text-foreground",
            ].join(" ")}
          >
            {showRomaji ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {lang === "en" ? "Romaji" : "Romaji"}
          </button>
        </div>
      </div>

      {/* ── Example Cards List ──────────────────────────── */}
      <div className="flex flex-col gap-4">
        {sentences.map((sen, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-surface p-5 shadow-2xs hover:shadow-xs transition-shadow duration-200 flex flex-col gap-3"
          >
            {/* Furigana */}
            {showFurigana && (
              <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wide">
                {sen.furigana}
              </span>
            )}

            {/* Japanese Sentence & Write Action */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                {renderJapaneseWithHighlight(sen.japanese, sen.highlight)}
              </div>
              <button
                onClick={() => setActivePracticeIndex(activePracticeIndex === idx ? null : idx)}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 shadow-3xs hover:scale-105 active:scale-95",
                  activePracticeIndex === idx
                    ? "bg-accent/15 border-accent/25 text-accent font-extrabold"
                    : "bg-background border-border/40 text-muted hover:text-foreground"
                ].join(" ")}
                title={lang === "en" ? "Practice writing conjugation" : "Latih menulis konjugasi"}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "Practice" : "Tulis"}</span>
              </button>
            </div>

            {/* Romaji */}
            {showRomaji && (
              <span className="text-xs text-muted/80 font-medium italic leading-none border-t border-border/25 pt-2 select-none">
                {sen.romaji}
              </span>
            )}

            {/* Translations */}
            <div className="flex flex-col gap-1 border-t border-border/25 pt-3.5 text-xs text-muted font-semibold leading-relaxed">
              <p className="flex items-start gap-2.5">
                <span className="shrink-0 text-[10px] select-none uppercase font-bold text-muted/60 mt-0.5">en</span>
                <span>🇺🇸 {sen.english}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="shrink-0 text-[10px] select-none uppercase font-bold text-muted/60 mt-0.5">id</span>
                <span>🇮🇩 {sen.indonesian}</span>
              </p>
            </div>

            {/* Handwriting practice widget drawer */}
            {activePracticeIndex === idx && (
              <div className="border-t border-border/25 pt-4 mt-1">
                <HandwritingPracticeWidget
                  expected={sen.japanese}
                  lang={lang}
                  onClose={() => setActivePracticeIndex(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
