"use client";

import React, { useState, useMemo } from "react";
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
  X,
  RotateCcw,
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
import { ExploreBreadcrumb } from "@/src/modules/explore/components/ExploreBreadcrumb";

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

  const defaultTarget = useMemo<ExploreTarget | null>(() => {
    if (!summary || summary.cardCount === 0) return null;
    const firstTarget =
      summary.struggled[0] || summary.solid[0] || recap?.items[0];
    if (!firstTarget) return null;
    const query = recapItemQuery(firstTarget);
    return query ? { type: "vocab", query } : null;
  }, [summary, recap]);

  const [prevRecapKey, setPrevRecapKey] = useState<string | null>(null);
  const [history, setHistory] = useState<ExploreTarget[]>(() =>
    defaultTarget ? [defaultTarget] : [],
  );
  const [selectedWordQuery, setSelectedWordQuery] = useState<string>(
    () => defaultTarget?.query || "",
  );
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeTabFilter, setActiveTabFilter] = useState<
    "all" | "struggled" | "solid"
  >("all");
  const [mobileTab, setMobileTab] = useState<"list" | "explore">("list");

  const recapKey =
    recap && isOpen ? `${recap.startedAt}-${recap.items.length}` : null;

  if (isOpen && recapKey && recapKey !== prevRecapKey) {
    setPrevRecapKey(recapKey);
    setHistory(defaultTarget ? [defaultTarget] : []);
    setSelectedWordQuery(defaultTarget?.query || "");
    setMobileTab("list");
    setSearchFilter("");
    setActiveTabFilter("all");
  }

  const currentTarget: ExploreTarget =
    history[history.length - 1] ||
    defaultTarget || {
      type: "vocab",
      query: selectedWordQuery || "",
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
      setHistory((prev) => {
        const next = prev.slice(0, -1);
        const last = next[next.length - 1];
        if (last && last.type === "vocab") {
          setSelectedWordQuery(last.query);
        }
        return next;
      });
    }
  };

  const jumpToHistoryIndex = (index: number) => {
    if (index >= 0 && index < history.length) {
      const target = history[index];
      setHistory((prev) => prev.slice(0, index + 1));
      if (target.type === "vocab") {
        setSelectedWordQuery(target.query);
      }
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
          <Modal.Dialog className="w-full max-w-5xl h-[90vh] max-h-[92vh] flex flex-col rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <Modal.CloseTrigger />

            <Modal.Header className="flex flex-col gap-3 border-b border-border/70 p-4 sm:p-5 bg-surface-muted/30 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <PartyPopper size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold leading-tight text-foreground flex items-center gap-2">
                      <span>Session Complete</span>
                      <Chip
                        size="sm"
                        variant="soft"
                        color="accent"
                        className="text-[10px] h-5"
                      >
                        {recap.mode === "quick"
                          ? "Practice All"
                          : "Adaptive FSRS"}
                      </Chip>
                    </h2>
                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {recap.deckLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    <Target size={10} className="text-emerald-500" /> Accuracy
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

              <div className="flex md:hidden rounded-xl bg-surface-muted p-1 border border-border">
                <button
                  type="button"
                  onClick={() => setMobileTab("list")}
                  className={[
                    "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all cursor-pointer",
                    mobileTab === "list"
                      ? "bg-surface text-foreground shadow-2xs font-bold"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  Word List ({summary.cardCount})
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("explore")}
                  className={[
                    "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                    mobileTab === "explore"
                      ? "bg-surface text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <Compass size={13} />
                  <span>Knowledge Navigation</span>
                </button>
              </div>
            </Modal.Header>

            <Modal.Body className="p-0 flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row">
              <div
                className={[
                  "w-full md:w-[42%] lg:w-[38%] border-r border-border flex flex-col min-h-0 bg-surface-muted/20",
                  mobileTab === "list" ? "flex" : "hidden md:flex",
                ].join(" ")}
              >
                <div className="p-2.5 border-b border-border/60 shrink-0">
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
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 p-2 px-2.5 border-b border-border/60 bg-surface/50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTabFilter("all")}
                    className={[
                      "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer",
                      activeTabFilter === "all"
                        ? "bg-surface text-foreground shadow-2xs border border-border"
                        : "text-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    All ({summary.cardCount})
                  </button>

                  {summary.struggled.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTabFilter("struggled")}
                      className={[
                        "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                        activeTabFilter === "struggled"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-2xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <AlertTriangle size={10} />
                      <span>Needs Work ({summary.struggled.length})</span>
                    </button>
                  )}

                  {summary.solid.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTabFilter("solid")}
                      className={[
                        "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                        activeTabFilter === "solid"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <CheckCircle2 size={10} />
                      <span>Mastered ({summary.solid.length})</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-3">
                  {(activeTabFilter === "all" ||
                    activeTabFilter === "struggled") &&
                    filteredStruggled.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle size={11} /> Needs Work (
                            {filteredStruggled.length})
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
                                  "group relative flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                                  isSelected
                                    ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 shadow-2xs ring-1 ring-indigo-500/40"
                                    : "border-border/60 bg-surface hover:border-indigo-500/40 hover:bg-surface-muted/60",
                                ].join(" ")}
                              >
                                {isSelected && (
                                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                                )}
                                <div className="min-w-0 flex flex-col gap-0.5 pl-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-jp text-sm font-bold text-foreground truncate">
                                      {item.kanji !== "-"
                                        ? item.kanji
                                        : item.hiragana}
                                    </span>
                                    {item.kanji !== "-" && (
                                      <span className="font-jp text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold truncate">
                                        〔{item.hiragana}〕
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-muted truncate max-w-[170px]">
                                    {item.translation}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex flex-col items-end gap-0.5">
                                    {finalRating !== null && (
                                      <span
                                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                                          RATING_TONE[finalRating] ||
                                          "bg-slate-500/10 text-muted"
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

                  {(activeTabFilter === "all" || activeTabFilter === "solid") &&
                    filteredSolid.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-0.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Mastered (
                            {filteredSolid.length})
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
                                  "group relative flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                                  isSelected
                                    ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 shadow-2xs ring-1 ring-indigo-500/40"
                                    : "border-border/60 bg-surface hover:border-indigo-500/40 hover:bg-surface-muted/60",
                                ].join(" ")}
                              >
                                {isSelected && (
                                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                                )}
                                <div className="min-w-0 flex flex-col gap-0.5 pl-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-jp text-sm font-bold text-foreground truncate">
                                      {item.kanji !== "-"
                                        ? item.kanji
                                        : item.hiragana}
                                    </span>
                                    {item.kanji !== "-" && (
                                      <span className="font-jp text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold truncate">
                                        〔{item.hiragana}〕
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-muted truncate max-w-[170px]">
                                    {item.translation}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {finalRating !== null && (
                                    <span
                                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                                        RATING_TONE[finalRating] ||
                                        "bg-slate-500/10 text-muted"
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

                  {filteredStruggled.length === 0 &&
                    filteredSolid.length === 0 && (
                      <div className="text-center py-12 text-xs text-muted">
                        No matching words found.
                      </div>
                    )}
                </div>
              </div>

              <div
                className={[
                  "w-full md:w-[58%] lg:w-[62%] flex flex-col min-h-0 bg-surface",
                  mobileTab === "explore" ? "flex" : "hidden md:flex",
                ].join(" ")}
              >
                <div className="p-3 px-4 border-b border-border flex flex-col gap-2 bg-surface-muted/20 shrink-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {history.length > 1 ? (
                        <button
                          type="button"
                          onClick={popTarget}
                          className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-muted text-foreground transition-colors cursor-pointer shrink-0"
                          title="Back to previous target"
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
                          {currentTarget.query || "No word selected"}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-muted bg-surface-muted px-2 py-0.5 rounded-md border border-border shrink-0">
                      {currentTarget.type === "kanji"
                        ? "Kanji Explorer"
                        : "Vocabulary Explorer"}
                    </span>
                  </div>

                  {history.length > 1 && (
                    <div className="pt-1 border-t border-border/50">
                      <ExploreBreadcrumb
                        history={history}
                        onSelectIndex={jumpToHistoryIndex}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {currentTarget.query ? (
                    currentTarget.type === "vocab" ? (
                      <VocabularyExploreView
                        key={`vocab-${currentTarget.query}`}
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
                        key={`kanji-${currentTarget.query}`}
                        literal={currentTarget.query}
                        onSelectWord={(word) =>
                          pushTarget({ type: "vocab", query: word })
                        }
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-muted gap-2">
                      <Compass size={32} className="opacity-30" />
                      <span className="text-xs font-medium">
                        Select a word from the left list to explore
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-t border-border p-3 sm:p-4 bg-surface-muted/30 flex items-center justify-between shrink-0">
              <Button
                variant="primary"
                size="sm"
                className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-4"
                onClick={onStudyAgain}
              >
                <RotateCcw size={14} className="mr-1 inline" /> Study Again
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
