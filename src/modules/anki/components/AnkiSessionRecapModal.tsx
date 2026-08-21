"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PartyPopper,
  Clock,
  Target,
  Layers,
  Repeat,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Compass,
  ArrowLeft,
  Search,
  BookOpen,
} from "lucide-react";
import { Modal, Button, Chip } from "@heroui/react";
import {
  AnkiRecapItem,
  AnkiSessionRecap,
  formatRecapDuration,
  ratingLabel,
  recapItemFinalRating,
  recapItemQuery,
  summarizeRecap,
} from "@/src/modules/anki/lib/sessionRecap";
import { VocabularyExploreView } from "@/src/modules/explore/components/VocabularyExploreView";
import { KanjiExploreView } from "@/src/modules/explore/components/KanjiExploreView";

export interface ExploreTarget {
  type: "vocab" | "kanji";
  query: string;
}

const RATING_TONE: Record<number, string> = {
  1: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  2: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  3: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  4: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

interface AnkiSessionRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recap: AnkiSessionRecap | null;
  onStudyAgain: () => void;
}

export function AnkiSessionRecapModal({
  isOpen,
  onClose,
  recap,
  onStudyAgain,
}: AnkiSessionRecapModalProps) {
  const summary = useMemo(
    () => (recap ? summarizeRecap(recap) : null),
    [recap],
  );

  // Selected explore target and navigation stack
  const [history, setHistory] = useState<ExploreTarget[]>([]);
  const [selectedWordQuery, setSelectedWordQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"list" | "explore">("list");

  // Inisialisasi item terpilih pertama kali
  useEffect(() => {
    if (isOpen && summary && summary.cardCount > 0) {
      // Prioritaskan kata yang struggled jika ada, jika tidak kata pertama
      const firstTarget =
        summary.struggled[0] || summary.solid[0] || recap?.items[0];
      if (firstTarget) {
        const query = recapItemQuery(firstTarget);
        setSelectedWordQuery(query);
        setHistory([{ type: "vocab", query }]);
      }
      setMobileTab("list");
    }
  }, [isOpen, summary, recap]);

  const currentTarget = history[history.length - 1] || {
    type: "vocab",
    query: selectedWordQuery,
  };

  const pushTarget = (target: ExploreTarget) => {
    setHistory((prev) => [...prev, target]);
    if (target.type === "vocab") {
      setSelectedWordQuery(target.query);
    }
    setMobileTab("explore");
  };

  const popTarget = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleSelectWord = (item: AnkiRecapItem) => {
    const query = recapItemQuery(item);
    setSelectedWordQuery(query);
    setHistory([{ type: "vocab", query }]);
    setMobileTab("explore");
  };

  const filteredStruggled = useMemo(() => {
    if (!summary) return [];
    if (!searchFilter.trim()) return summary.struggled;
    const q = searchFilter.toLowerCase();
    return summary.struggled.filter(
      (i) =>
        i.kanji.toLowerCase().includes(q) ||
        i.hiragana.toLowerCase().includes(q) ||
        i.translation.toLowerCase().includes(q),
    );
  }, [summary, searchFilter]);

  const filteredSolid = useMemo(() => {
    if (!summary) return [];
    if (!searchFilter.trim()) return summary.solid;
    const q = searchFilter.toLowerCase();
    return summary.solid.filter(
      (i) =>
        i.kanji.toLowerCase().includes(q) ||
        i.hiragana.toLowerCase().includes(q) ||
        i.translation.toLowerCase().includes(q),
    );
  }, [summary, searchFilter]);

  if (!recap || !summary) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container className="flex items-center justify-center min-h-screen w-screen p-2 sm:p-4">
          <Modal.Dialog className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <Modal.CloseTrigger />

            {/* HEADER MODAL */}
            <Modal.Header className="flex flex-col gap-3 border-b border-border/70 p-4 sm:p-5 bg-surface-muted/30 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <PartyPopper size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold leading-tight text-foreground flex items-center gap-2">
                      <span>Session Complete</span>
                      <Chip size="sm" variant="soft" color="accent" className="text-[10px] h-5">
                        {recap.mode === "quick" ? "Practice All" : "Adaptive FSRS"}
                      </Chip>
                    </h2>
                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {recap.deckLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS TILES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-surface p-2.5 shadow-2xs">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <Layers size={10} className="text-indigo-500" /> Cards
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground">
                    {summary.cardCount}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-surface p-2.5 shadow-2xs">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <Repeat size={10} className="text-amber-500" /> Reviews
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground">
                    {summary.totalReviews}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-surface p-2.5 shadow-2xs">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <Target size={10} className="text-emerald-500" /> First Try
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground">
                    {summary.firstTryAccuracy}%
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-surface p-2.5 shadow-2xs">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <Clock size={10} className="text-sky-500" /> Duration
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground">
                    {formatRecapDuration(summary.durationSeconds)}
                  </span>
                </div>
              </div>

              {/* MOBILE TAB TOGGLE (Screen < md) */}
              <div className="flex md:hidden rounded-xl bg-surface-muted p-1 border border-border">
                <button
                  type="button"
                  onClick={() => setMobileTab("list")}
                  className={[
                    "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all cursor-pointer",
                    mobileTab === "list"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  Word List ({summary.cardCount})
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("explore")}
                  className={[
                    "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1",
                    mobileTab === "explore"
                      ? "bg-surface text-foreground shadow-xs text-indigo-500"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <Compass size={12} /> Knowledge Navigation
                </button>
              </div>
            </Modal.Header>

            {/* BODY 2-COLUMN LAYOUT */}
            <Modal.Body className="p-0 flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row">
              {/* KOLOM KIRI: Word List */}
              <div
                className={[
                  "w-full md:w-5/12 border-r border-border flex flex-col min-h-0 bg-surface-muted/10",
                  mobileTab === "list" ? "flex" : "hidden md:flex",
                ].join(" ")}
              >
                {/* Search Bar */}
                <div className="p-3 border-b border-border/60 shrink-0">
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search studied words..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* List Scrollable */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 max-h-[460px] md:max-h-[500px]">
                  {/* Section Needs Work */}
                  {filteredStruggled.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle size={11} /> Needs Work ({filteredStruggled.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {filteredStruggled.map((item) => {
                          const query = recapItemQuery(item);
                          const isSelected = selectedWordQuery === query;
                          const finalRating = recapItemFinalRating(item);
                          const attempts = item.ratings.length;

                          return (
                            <button
                              key={item.cardKey}
                              type="button"
                              onClick={() => handleSelectWord(item)}
                              className={[
                                "group flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                                isSelected
                                  ? "border-indigo-500 bg-indigo-500/10 shadow-2xs"
                                  : "border-border/60 bg-surface hover:border-indigo-500/40 hover:bg-surface-muted/50",
                              ].join(" ")}
                            >
                              <div className="min-w-0 flex flex-col gap-0.5">
                                <span className="font-jp text-sm font-bold text-foreground truncate">
                                  {item.kanji !== "-" ? item.kanji : item.hiragana}
                                </span>
                                {item.kanji !== "-" && (
                                  <span className="font-jp text-[10px] text-indigo-500 font-semibold">
                                    〔{item.hiragana}〕
                                  </span>
                                )}
                                <span className="text-[10px] text-muted truncate max-w-[150px]">
                                  {item.translation}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="flex flex-col items-end gap-0.5">
                                  {finalRating !== null && (
                                    <span
                                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                                        RATING_TONE[finalRating] || "bg-slate-500/10 text-muted"
                                      }`}
                                    >
                                      {ratingLabel(finalRating, recap.mode)}
                                    </span>
                                  )}
                                  {attempts > 1 && (
                                    <span className="text-[8px] font-semibold text-muted">
                                      {attempts}× seen
                                    </span>
                                  )}
                                </div>
                                <ChevronRight
                                  size={13}
                                  className={[
                                    "transition-transform",
                                    isSelected
                                      ? "text-indigo-500 translate-x-0.5"
                                      : "text-muted/50 group-hover:text-foreground",
                                  ].join(" ")}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Section Solid */}
                  {filteredSolid.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Got It First Try ({filteredSolid.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {filteredSolid.map((item) => {
                          const query = recapItemQuery(item);
                          const isSelected = selectedWordQuery === query;
                          const finalRating = recapItemFinalRating(item);

                          return (
                            <button
                              key={item.cardKey}
                              type="button"
                              onClick={() => handleSelectWord(item)}
                              className={[
                                "group flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                                isSelected
                                  ? "border-indigo-500 bg-indigo-500/10 shadow-2xs"
                                  : "border-border/60 bg-surface hover:border-indigo-500/40 hover:bg-surface-muted/50",
                              ].join(" ")}
                            >
                              <div className="min-w-0 flex flex-col gap-0.5">
                                <span className="font-jp text-sm font-bold text-foreground truncate">
                                  {item.kanji !== "-" ? item.kanji : item.hiragana}
                                </span>
                                {item.kanji !== "-" && (
                                  <span className="font-jp text-[10px] text-indigo-500 font-semibold">
                                    〔{item.hiragana}〕
                                  </span>
                                )}
                                <span className="text-[10px] text-muted truncate max-w-[150px]">
                                  {item.translation}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {finalRating !== null && (
                                  <span
                                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                                      RATING_TONE[finalRating] || "bg-slate-500/10 text-muted"
                                    }`}
                                  >
                                    {ratingLabel(finalRating, recap.mode)}
                                  </span>
                                )}
                                <ChevronRight
                                  size={13}
                                  className={[
                                    "transition-transform",
                                    isSelected
                                      ? "text-indigo-500 translate-x-0.5"
                                      : "text-muted/50 group-hover:text-foreground",
                                  ].join(" ")}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {filteredStruggled.length === 0 && filteredSolid.length === 0 && (
                    <div className="text-center py-10 text-xs text-muted">
                      No matching words found.
                    </div>
                  )}
                </div>
              </div>

              {/* KOLOM KANAN: Knowledge Navigation */}
              <div
                className={[
                  "w-full md:w-7/12 flex flex-col min-h-0 bg-surface",
                  mobileTab === "explore" ? "flex" : "hidden md:flex",
                ].join(" ")}
              >
                {/* Knowledge Header Navbar */}
                <div className="p-3 px-4 border-b border-border flex items-center justify-between gap-3 bg-surface-muted/20 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {history.length > 1 ? (
                      <button
                        type="button"
                        onClick={popTarget}
                        className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-muted text-foreground transition-colors cursor-pointer shrink-0"
                        title="Back to previous word"
                      >
                        <ArrowLeft size={14} />
                      </button>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                        <Compass size={14} />
                      </div>
                    )}
                    <div className="min-w-0 flex flex-col">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">
                        Knowledge Navigation
                      </span>
                      <span className="font-jp text-sm font-bold text-foreground truncate">
                        {currentTarget.query}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-muted bg-surface-muted px-2 py-0.5 rounded-md border border-border">
                    {currentTarget.type === "kanji" ? "Kanji Explorer" : "Vocabulary Explorer"}
                  </span>
                </div>

                {/* Knowledge Content Area */}
                <div className="flex-1 overflow-y-auto p-4 max-h-[460px] md:max-h-[500px]">
                  {currentTarget.type === "vocab" ? (
                    <VocabularyExploreView
                      word={currentTarget.query}
                      onSelectKanji={(literal) =>
                        pushTarget({ type: "kanji", query: literal })
                      }
                      onSelectWord={(word) =>
                        pushTarget({ type: "vocab", query: word })
                      }
                    />
                  ) : (
                    <KanjiExploreView
                      literal={currentTarget.query}
                      onSelectWord={(word) =>
                        pushTarget({ type: "vocab", query: word })
                      }
                    />
                  )}
                </div>
              </div>
            </Modal.Body>

            {/* MODAL FOOTER */}
            <Modal.Footer className="border-t border-border p-3 sm:p-4 bg-surface-muted/30 flex items-center justify-between shrink-0">
              <Button
                variant="primary"
                size="sm"
                className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-4"
                onClick={onStudyAgain}
              >
                🔄 Study Again
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="font-semibold cursor-pointer border border-border"
                onClick={onClose}
              >
                Close & Return
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
