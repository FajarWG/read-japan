"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Eye, RefreshCw, Plus, CheckCircle2, Check, X, PenTool, RotateCcw } from "lucide-react";
import { getReviewQueue, submitReview, addCardsToReviewQueue } from "../actions/katsuyouActions";
import { VerbGroupBadge, JLPTBadge } from "./KatsuyouComponents";
import { HandwritingCanvas } from "@/src/shared/components/HandwritingCanvas";

interface ReviewTabProps {
  formKey: string;
  onProgressUpdate?: () => void;
}

// Normalize a Japanese answer for lenient comparison (strip spaces & parentheticals)
const normalizeAnswer = (s: string) =>
  s.replace(/\s*[\(（].*?[\)）]/g, "").replace(/\s+/g, "").trim();

export function ReviewTab({ formKey, onProgressUpdate }: ReviewTabProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active-recall mode: user types/draws the answer before revealing
  const [recallMode, setRecallMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [checkedRecall, setCheckedRecall] = useState(false);
  const [recallCorrect, setRecallCorrect] = useState(false);

  // Fetch reviews due
  const fetchQueue = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await getReviewQueue(formKey);
      setCards(res);
      setCurrentIndex(0);
      resetCardState();
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to load review queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]);

  const resetCardState = () => {
    setShowAnswer(false);
    setTypedAnswer("");
    setCheckedRecall(false);
    setRecallCorrect(false);
  };

  // Activate more verbs
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

  const getExpected = (card: any) =>
    card?.verb?.conjugations?.[formKey as keyof typeof card.verb.conjugations];

  const handleCheckRecall = () => {
    const card = cards[currentIndex];
    const expected = getExpected(card);
    if (!expected) return;
    const answer = normalizeAnswer(typedAnswer);
    const correct =
      answer === normalizeAnswer(expected.kanji) ||
      answer === normalizeAnswer(expected.kana);
    setRecallCorrect(correct);
    setCheckedRecall(true);
    setShowAnswer(true);
  };

  // Submit card rating
  const handleRating = async (rating: "easy" | "good" | "hard") => {
    if (isPending || cards.length === 0) return;
    const card = cards[currentIndex];

    startTransition(async () => {
      const res = await submitReview(card.id, rating);
      if (res.success) {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          resetCardState();
        } else {
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
          Loading SRS Queue...
        </span>
      </div>
    );
  }

  const hasCards = cards.length > 0;
  const currentCard = hasCards ? cards[currentIndex] : null;
  const expected = currentCard ? getExpected(currentCard) : null;

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
              All caught up!
            </h3>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              You have no reviews due for this conjugation form. Introduce new
              cards or practice to add more.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs border-t border-border/40 pt-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none mb-1">
              Add Verbs to Review Queue
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(["N5", "N4", "N3", "N2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleAddCards(lvl)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-1.5 bg-background hover:bg-surface-muted border border-border/50 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-foreground/80 hover:text-foreground active:scale-95 transition-all select-none disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lvl} Verbs</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleAddCards()}
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white border border-accent/25 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer active:scale-95 transition-all select-none disabled:opacity-50 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 5 Random Verbs</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Active Review Study Card ────────────────────── */
        currentCard && (
          <div className="flex flex-col gap-6">
            {/* Queue Progress Bar + Mode Toggle */}
            <div className="flex items-center justify-between border border-border/40 bg-surface/50 rounded-2xl px-5 py-3 shadow-2xs select-none">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  SRS Queue
                </span>
                {/* Recall/Flip mode toggle */}
                <div className="flex items-center rounded-lg border border-border/50 overflow-hidden text-[10px] font-bold">
                  <button
                    onClick={() => {
                      setRecallMode(false);
                      resetCardState();
                    }}
                    className={[
                      "flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer",
                      !recallMode ? "bg-accent text-white" : "text-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <Eye className="w-3 h-3" /> Flip
                  </button>
                  <button
                    onClick={() => {
                      setRecallMode(true);
                      resetCardState();
                    }}
                    className={[
                      "flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer",
                      recallMode ? "bg-accent text-white" : "text-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    <PenTool className="w-3 h-3" /> Type
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-extrabold text-foreground">
                <span>🗂️ {currentIndex + 1} / {cards.length}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 font-bold border border-red-500/25">
                  {cards.length - currentIndex} left
                </span>
              </div>
            </div>

            {/* SRS Card */}
            <div className="rounded-3xl border border-border bg-surface p-8 shadow-xs flex flex-col gap-6 items-center text-center relative overflow-hidden min-h-[300px] justify-between">
              {/* Card Metadata */}
              <div className="flex items-center justify-between w-full border-b border-border/35 pb-4">
                <JLPTBadge level={currentCard.verb?.jlpt || "N5"} />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                  Target: <span className="text-accent underline underline-offset-4">{formKey} form</span>
                </span>
                {currentCard.verb && <VerbGroupBadge group={currentCard.verb.group} />}
              </div>

              {/* Front Side: Question */}
              <div className="flex flex-col gap-3 my-auto w-full">
                <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wider">
                  {currentCard.verb?.kana}
                </span>
                <h3 className="text-3xl font-extrabold font-jp text-foreground leading-none tracking-wide">
                  {currentCard.verb?.kanji}
                </h3>
                <span className="text-sm font-semibold text-muted max-w-xs mx-auto mt-2 leading-snug">
                  {currentCard.verb?.indonesian}
                </span>

                {/* Recall input (Type mode, before checking) */}
                {recallMode && !checkedRecall && (
                  <div className="mt-6 w-full max-w-md mx-auto flex flex-col gap-2">
                    <HandwritingCanvas
                      value={typedAnswer}
                      onChange={setTypedAnswer}
                      onSubmit={handleCheckRecall}
                      placeholder="Type or draw the conjugated form..."
                      language="ja"
                    />
                  </div>
                )}

                {/* Recall correctness banner */}
                {recallMode && checkedRecall && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {recallCorrect ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-500">
                        <Check className="w-4 h-4 stroke-[3px]" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-black text-red-500">
                        <X className="w-4 h-4 stroke-[3px]" /> You wrote: {normalizeAnswer(typedAnswer) || "—"}
                      </span>
                    )}
                  </div>
                )}

                {/* Back Side: Answer (Conditional) */}
                {showAnswer && expected && (
                  <div className="mt-6 pt-6 border-t border-border/30 flex flex-col gap-2 items-center animate-fade-in">
                    <span className="text-[10px] text-accent opacity-75 font-bold uppercase tracking-wider leading-none select-none">
                      Conjugated Form
                    </span>
                    <h4 className="text-3xl font-black font-jp text-accent leading-none select-all tracking-wide mt-1.5">
                      {expected.kanji}
                    </h4>
                    <span className="text-xs text-muted font-bold tracking-wider mt-1 select-none">
                      ({expected.kana})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-6 border-t border-border/35 flex justify-center">
                {!showAnswer ? (
                  recallMode ? (
                    <button
                      onClick={handleCheckRecall}
                      disabled={!typedAnswer.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm py-3 rounded-2xl shadow-md cursor-pointer select-none transition-all duration-200 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Check Answer</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm py-3 rounded-2xl shadow-md cursor-pointer select-none transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Reveal Answer</span>
                    </button>
                  )
                ) : (
                  /* Easy / Good / Hard rating buttons */
                  <div className="grid grid-cols-3 gap-2.5 w-full">
                    <button
                      onClick={() => handleRating("hard")}
                      disabled={isPending}
                      className="bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => handleRating("good")}
                      disabled={isPending}
                      className="bg-sky-500/10 hover:bg-sky-500/15 text-sky-500 border border-sky-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => handleRating("easy")}
                      disabled={isPending}
                      className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 py-3 rounded-2xl text-xs font-black select-none cursor-pointer hover:shadow-sm active:scale-95 disabled:opacity-50 transition-all duration-200"
                    >
                      Easy
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
