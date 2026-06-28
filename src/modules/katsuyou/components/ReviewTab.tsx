"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Info, HelpCircle, Eye, RefreshCw, Award, Plus, CheckCircle2 } from "lucide-react";
import { getReviewQueue, submitReview, addCardsToReviewQueue } from "../actions/katsuyouActions";
import { VerbGroupBadge, JLPTBadge } from "./KatsuyouComponents";

interface ReviewTabProps {
  formKey: string;
  lang: "en" | "id";
  onProgressUpdate?: () => void;
}

export function ReviewTab({ formKey, lang, onProgressUpdate }: ReviewTabProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch reviews due
  const fetchQueue = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await getReviewQueue(formKey);
      setCards(res);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (e) {
      console.error(e);
      setErrorMessage(lang === "en" ? "Failed to load review queue." : "Gagal memuat antrean review.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [formKey]);

  // Activate 5 more verbs
  const handleAddCards = async (jlptLevel?: string) => {
    startTransition(async () => {
      const res = await addCardsToReviewQueue(formKey, jlptLevel);
      if (res.success) {
        setErrorMessage(null);
        await fetchQueue();
        if (onProgressUpdate) onProgressUpdate();
      } else {
        setErrorMessage(res.error || "An error occurred");
      }
    });
  };

  // Submit card rating
  const handleRating = async (rating: "easy" | "good" | "hard") => {
    if (isPending || cards.length === 0) return;
    const card = cards[currentIndex];

    startTransition(async () => {
      const res = await submitReview(card.id, rating);
      if (res.success) {
        // Move to next card
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setShowAnswer(false);
        } else {
          // Finished queue
          setCards([]);
          if (onProgressUpdate) onProgressUpdate();
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-accent" />
        <span className="text-xs font-bold uppercase tracking-wider select-none">
          {lang === "en" ? "Loading SRS Queue..." : "Memuat Antrean SRS..."}
        </span>
      </div>
    );
  }

  const hasCards = cards.length > 0;
  const currentCard = hasCards ? cards[currentIndex] : null;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Error Callout */}
      {errorMessage && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/25 p-4 text-xs font-semibold text-red-500 select-none">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* ── Empty Queue Screen ──────────────────────────── */}
      {!hasCards ? (
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs flex flex-col items-center justify-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shadow-xs select-none">
            <CheckCircle2 className="w-8 h-8 fill-emerald-500/10" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-extrabold text-foreground leading-tight">
              {lang === "en" ? "All caught up!" : "Semua bersih!"}
            </h3>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              {lang === "en"
                ? "You have no reviews due for this conjugation form. Introduce new cards or practice to add more."
                : "Anda tidak memiliki antrean review untuk bentuk ini. Tambahkan kartu baru atau latihan untuk mengantrekan lebih banyak."}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs border-t border-border/40 pt-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none mb-1">
              {lang === "en" ? "Add Verbs to Review Queue" : "Tambahkan Kata Kerja ke Antrean"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddCards("N5")}
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 bg-background hover:bg-surface-muted border border-border/50 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-foreground/80 hover:text-foreground active:scale-95 transition-all select-none disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>N5 Verbs</span>
              </button>
              <button
                onClick={() => handleAddCards("N4")}
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 bg-background hover:bg-surface-muted border border-border/50 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-foreground/80 hover:text-foreground active:scale-95 transition-all select-none disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>N4 Verbs</span>
              </button>
            </div>
            <button
              onClick={() => handleAddCards()}
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white border border-accent/25 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer active:scale-95 transition-all select-none disabled:opacity-50 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === "en" ? "Add 5 Random Verbs" : "Tambah 5 Kata Kerja"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Active Review Study Card ────────────────────── */
        currentCard && (
          <div className="flex flex-col gap-6">
            {/* Queue Progress Bar */}
            <div className="flex items-center justify-between border border-border/40 bg-surface/50 rounded-2xl px-5 py-3 shadow-2xs select-none">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {lang === "en" ? "SRS Review Queue" : "Antrean Review SRS"}
              </span>
              <div className="flex items-center gap-3 text-xs font-extrabold text-foreground">
                <span>🗂️ {currentIndex + 1} / {cards.length}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold border border-red-500/25">
                  {cards.length - currentIndex} left
                </span>
              </div>
            </div>

            {/* SRS Flip Card */}
            <div className="rounded-3xl border border-border bg-surface p-8 shadow-xs flex flex-col gap-6 items-center text-center relative overflow-hidden min-h-[300px] justify-between">
              {/* Card Metadata */}
              <div className="flex items-center justify-between w-full border-b border-border/35 pb-4">
                <JLPTBadge level={currentCard.verb?.jlpt || "N5"} />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                  {lang === "en" ? "Target:" : "Target:"} <span className="text-accent underline underline-offset-4">{formKey} form</span>
                </span>
                {currentCard.verb && <VerbGroupBadge group={currentCard.verb.group} lang={lang} />}
              </div>

              {/* Front Side: Question */}
              <div className="flex flex-col gap-3 my-auto">
                <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wider">
                  {currentCard.verb?.kana}
                </span>
                <h3 className="text-3xl font-extrabold font-jp text-foreground leading-none tracking-wide">
                  {currentCard.verb?.kanji}
                </h3>
                <span className="text-sm font-semibold text-muted max-w-xs mt-2 leading-snug">
                  {lang === "en" ? currentCard.verb?.english : currentCard.verb?.indonesian}
                </span>

                {/* Back Side: Answer (Conditional) */}
                {showAnswer && currentCard.verb && (
                  <div className="mt-8 pt-6 border-t border-border/30 flex flex-col gap-2 items-center animate-fade-in">
                    <span className="text-[10px] text-accent opacity-75 font-bold uppercase tracking-wider leading-none select-none">
                      {lang === "en" ? "Conjugated Form" : "Bentuk Konjugasi"}
                    </span>
                    <h4 className="text-3xl font-black font-jp text-accent leading-none select-all tracking-wide mt-1.5">
                      {currentCard.verb.conjugations[formKey as keyof typeof currentCard.verb.conjugations]?.kanji}
                    </h4>
                    <span className="text-xs text-muted font-bold tracking-wider mt-1 select-none">
                      ({currentCard.verb.conjugations[formKey as keyof typeof currentCard.verb.conjugations]?.kana})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-6 border-t border-border/35 flex justify-center">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm py-3 rounded-2xl shadow-md cursor-pointer select-none transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{lang === "en" ? "Reveal Answer" : "Tampilkan Jawaban"}</span>
                  </button>
                ) : (
                  /* Easy / Good / Hard rating buttons */
                  <div className="grid grid-cols-3 gap-2.5 w-full">
                    <button
                      onClick={() => handleRating("hard")}
                      disabled={isPending}
                      className="bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      {lang === "en" ? "Hard" : "Sulit"}
                    </button>
                    <button
                      onClick={() => handleRating("good")}
                      disabled={isPending}
                      className="bg-sky-500/10 hover:bg-sky-500/15 text-sky-500 border border-sky-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      {lang === "en" ? "Good" : "Sedang"}
                    </button>
                    <button
                      onClick={() => handleRating("easy")}
                      disabled={isPending}
                      className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      {lang === "en" ? "Easy" : "Mudah"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
