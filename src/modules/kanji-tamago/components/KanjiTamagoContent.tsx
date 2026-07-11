"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Save,
  Check,
  AlertTriangle,
  History,
  BookOpen,
  Volume2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button, Card, Chip, Modal, Popover, ListBox } from "@heroui/react";
import {
  HandwritingCanvas,
  CanvasStrokeTracer,
} from "@/src/shared/components/HandwritingCanvas";

interface KanjiItem {
  id: number;
  chapter: string;
  topic: string;
  category: "teishutsu_kanji" | "yomeru" | "mite_wakaru";
  moji: string;
  yomi: string;
  imi: string;
}

interface ProgressItem {
  kanjiId: number;
  dueDate: string;
  interval: number;
  repetitions: number;
  ease: number;
  mnemonic: string | null;
}

// Visual confusion pairs mapping for warning alerts
const CONFUSION_PAIRS: Record<string, string[]> = {
  未: ["末", "本", "木"],
  末: ["未", "本", "木"],
  士: ["土"],
  土: ["士"],
  木: ["本", "未", "末", "林", "森"],
  本: ["木", "体", "未", "末"],
  人: ["入", "八"],
  入: ["人", "八"],
  八: ["人", "入"],
  右: ["左", "石"],
  左: ["右", "在"],
  日: ["曰", "白", "目"],
  目: ["日", "自", "且"],
  自: ["目", "白"],
  白: ["百", "自", "日"],
  百: ["白", "石"],
  千: ["干", "チ"],
  万: ["方", "力"],
  方: ["万", "力"],
  大: ["犬", "太", "天"],
  太: ["大", "犬"],
  犬: ["大", "太"],
  中: ["口", "申"],
  口: ["中", "回"],
  四: ["西", "匹"],
  西: ["四", "両"],
  川: ["州", "三"],
  山: ["出"],
  力: ["刀", "万"],
  刀: ["力", "刃"],
  刃: ["刀", "力"],
  子: ["了", "予"],
  了: ["子", "予"],
  天: ["夫", "矢", "大"],
  夫: ["天", "失", "矢"],
  失: ["夫", "矢"],
  矢: ["天", "夫", "失"],
  先: ["失", "元"],
  元: ["先", "無"],
  月: ["用", "肉"],
  牛: ["午", "半"],
  午: ["牛", "年"],
  年: ["午", "手"],
  手: ["毛", "年"],
  毛: ["手"],
  分: ["公", "介"],
  今: ["令", "会"],
  令: ["今", "冷"],
  会: ["今", "合"],
  合: ["会", "台"],
  雨: ["両", "満"],
  両: ["雨", "両"],
  気: ["汽", "売"],
  石: ["Hal", "右", "百"],
  名: ["各", "多"],
  多: ["名", "タ"],
  小: ["少", "水"],
  少: ["小", "歩"],
  半: ["羊", "平"],
  羊: ["半", "美"],
  買: ["売", "貝"],
  売: ["買", "貝"],
  貝: ["買", "売"],
};

const isKanji = (char: string): boolean => {
  const code = char.codePointAt(0);
  if (!code) return false;
  return code >= 0x4e00 && code <= 0x9faf;
};

export function KanjiTamagoContent({ username }: { username: string }) {
  const router = useRouter();
  const canvasRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);

  // Navigation state: 'dashboard' | 'session'
  const [viewMode, setViewMode] = useState<"dashboard" | "session">(
    "dashboard",
  );

  // Filters
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Active Session Queue
  const [sessionQueue, setSessionQueue] = useState<KanjiItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  // Practice inputs
  const [drawInput, setDrawInput] = useState<string>("");
  const [isDrawCorrect, setIsDrawCorrect] = useState<boolean>(false);
  const [hasCheckedDraw, setHasCheckedDraw] = useState<boolean>(false);
  const [isMnemonicSaving, setIsMnemonicSaving] = useState<boolean>(false);
  const [userMnemonic, setUserMnemonic] = useState<string>("");
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [currentCandidates, setCurrentCandidates] = useState<string[]>([]);
  const [gradingScore, setGradingScore] = useState<number | null>(null);
  const [incorrectCard, setIncorrectCard] = useState<KanjiItem | null>(null);
  const [isRecognizingDraw, setIsRecognizingDraw] = useState<boolean>(false);

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showAlert = (title: string, message: string) => {
    setAlertModal({ isOpen: true, title, message });
  };

  // Accordion lists
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kanji-tamago");
      if (res.ok) {
        const data = await res.json();
        setKanjiList(data.kanjiList || []);
        setProgressList(data.progressList || []);
      }
    } catch (err) {
      console.error("Error loading Kanji Tamago records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hide BottomNav class hook
  useEffect(() => {
    const isSessionActive = viewMode === "session" && !sessionFinished;
    if (isSessionActive) {
      document.body.classList.add("hide-bottom-nav");
    } else {
      document.body.classList.remove("hide-bottom-nav");
    }
    return () => {
      document.body.classList.remove("hide-bottom-nav");
    };
  }, [viewMode, sessionFinished]);

  // Derived state:  // Unique chapters in the kanjiList - sorted Chapter 1 to end
  const chapters = Array.from(new Set(kanjiList.map((k) => k.chapter))).sort(
    (a, b) => {
      const aNum = parseInt(a, 10);
      const bNum = parseInt(b, 10);
      const aIsNaN = isNaN(aNum);
      const bIsNaN = isNaN(bNum);
      if (!aIsNaN && !bIsNaN) {
        return aNum - bNum;
      }
      if (!aIsNaN && bIsNaN) {
        return -1;
      }
      if (aIsNaN && !bIsNaN) {
        return 1;
      }
      return a.localeCompare(b);
    },
  );

  // Filtered lists for dashboard list
  const filteredKanji = kanjiList.filter((k) => {
    const chMatch = selectedChapter === "All" || k.chapter === selectedChapter;
    const catMatch =
      selectedCategory === "All" || k.category === selectedCategory;
    return chMatch && catMatch;
  });

  // Unique chapters in the filtered list - sorted Chapter 1 to end
  const filteredChapters = Array.from(
    new Set(filteredKanji.map((k) => k.chapter)),
  ).sort((a, b) => {
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    const aIsNaN = isNaN(aNum);
    const bIsNaN = isNaN(bNum);
    if (!aIsNaN && !bIsNaN) {
      return aNum - bNum;
    }
    if (!aIsNaN && bIsNaN) {
      return -1;
    }
    if (aIsNaN && !bIsNaN) {
      return 1;
    }
    return a.localeCompare(b);
  });

  // Grouped cards for list view
  const getKanjiByChapter = (chapter: string) => {
    return filteredKanji.filter((k) => k.chapter === chapter);
  };

  // Get progress properties helper
  const getProgress = (kanjiId: number) => {
    return progressList.find((p) => p.kanjiId === kanjiId);
  };

  // Compute stats
  const now = new Date();
  const dueList = kanjiList.filter((k) => {
    const prog = getProgress(k.id);
    if (!prog) return true; // new card is due
    return new Date(prog.dueDate) <= now;
  });

  const teishutsuDue = dueList.filter(
    (k) => k.category === "teishutsu_kanji",
  ).length;
  const otherDue = dueList.length - teishutsuDue;

  // Initialize practice queue
  const startSession = (
    mode: "srs" | "quick" | "chapter",
    chapterOverride?: string,
  ) => {
    let pool = [...kanjiList];

    if (mode === "chapter" && chapterOverride) {
      pool = pool.filter((k) => k.chapter === chapterOverride);
    } else {
      // Filter by selected chapter if not "All"
      if (selectedChapter !== "All") {
        pool = pool.filter((k) => k.chapter === selectedChapter);
      }

      // Filter by selected category if not "All"
      if (selectedCategory !== "All") {
        pool = pool.filter((k) => k.category === selectedCategory);
      }
    }

    if (mode === "srs") {
      // Filter for due items
      const today = new Date();
      pool = pool.filter((k) => {
        const prog = getProgress(k.id);
        if (!prog) return true; // new
        return new Date(prog.dueDate) <= today;
      });
    }

    if (pool.length === 0) {
      showAlert(
        "No Cards Found",
        "No cards due or matching your filters in this study session.",
      );
      return;
    }

    // Shuffle
    pool.sort(() => Math.random() - 0.5);

    setSessionQueue(pool);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
    setReviewedCount(0);
    resetPracticeInputs(pool[0]);
    setViewMode("session");
  };

  const resetPracticeInputs = (card: KanjiItem) => {
    setDrawInput("");
    setIsDrawCorrect(false);
    setHasCheckedDraw(false);
    setCurrentCandidates([]);

    // Load custom mnemonic story
    const prog = getProgress(card.id);
    setUserMnemonic(prog?.mnemonic || "");
  };

  const handleNextCard = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < sessionQueue.length) {
      setCurrentIndex(nextIdx);
      setIsFlipped(false);
      resetPracticeInputs(sessionQueue[nextIdx]);
    } else {
      setSessionFinished(true);
    }
  };

  const checkDrawAnswer = async () => {
    if (
      !sessionQueue[currentIndex] ||
      gradingScore !== null ||
      isRecognizingDraw
    )
      return;
    const card = sessionQueue[currentIndex];

    // Force recognition if there are pending strokes
    let activeCandidates = currentCandidates;
    if (canvasRef.current) {
      activeCandidates = await canvasRef.current.forceRecognizeIfNeeded();
    }

    // Clean target moji and input from parentheses/whitespace
    const cleanStr = (s: string) => s.replace(/\s*[\(（].*?[\)）]/g, "").trim();
    const cleanTarget = cleanStr(card.moji);

    let currentInput = drawInput;
    // Auto-commit top candidate if user hasn't explicitly confirmed
    if (!currentInput && activeCandidates.length > 0) {
      currentInput = activeCandidates[0];
      setDrawInput(currentInput);
    }

    const cleanInput = cleanStr(currentInput);

    const isMatch = cleanTarget === cleanInput;
    setIsDrawCorrect(isMatch);
    setHasCheckedDraw(true);
    if (isMatch) {
      setIsFlipped(true); // Flip on correct answer
    } else {
      // Show the incorrect drawing help modal instead of immediately saving
      setIncorrectCard(card);
    }
  };

  const handleIncorrectProceed = async () => {
    if (!incorrectCard) return;
    setIncorrectCard(null);
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    await gradeCard(1);
  };

  const gradeCard = async (rating: number) => {
    const card = sessionQueue[currentIndex];
    if (!card || gradingScore !== null) return;

    setGradingScore(rating);
    try {
      const res = await fetch("/api/kanji-tamago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanjiId: card.id, rating }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local progress list
        setProgressList((prev) => {
          const filtered = prev.filter((p) => p.kanjiId !== card.id);
          return [
            ...filtered,
            {
              kanjiId: card.id,
              dueDate: data.progress.dueDate,
              interval: data.progress.interval,
              repetitions: data.progress.repetitions,
              ease: data.progress.ease,
              mnemonic: data.progress.mnemonic,
            },
          ];
        });
        setReviewedCount((c) => c + 1);
        handleNextCard();
      } else {
        showAlert("Save Error", "Failed to save practice progress.");
      }
    } catch (err) {
      console.error("Error saving grading review:", err);
      showAlert(
        "Save Error",
        "A network error occurred while saving progress.",
      );
    } finally {
      setGradingScore(null);
    }
  };

  const saveMnemonic = async () => {
    const card = sessionQueue[currentIndex];
    if (!card) return;

    setIsMnemonicSaving(true);
    try {
      const res = await fetch("/api/kanji-tamago/mnemonic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanjiId: card.id, mnemonic: userMnemonic }),
      });

      if (res.ok) {
        // Update local state
        setProgressList((prev) => {
          return prev.map((p) => {
            if (p.kanjiId === card.id) {
              return { ...p, mnemonic: userMnemonic || null };
            }
            return p;
          });
        });
        showAlert("Story Saved", "Memory story saved successfully!");
      }
    } catch (err) {
      console.error("Error saving memory story:", err);
    } finally {
      setIsMnemonicSaving(false);
    }
  };

  const currentCard = sessionQueue[currentIndex];
  const kanjiCharsInWord = currentCard
    ? Array.from(currentCard.moji).filter(isKanji)
    : [];

  const confusionKanji = currentCard
    ? CONFUSION_PAIRS[currentCard.moji] ||
      CONFUSION_PAIRS[currentCard.moji[0]] ||
      null
    : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="animate-spin text-accent" size={24} />
            <h2 className="text-sm font-bold tracking-wide uppercase text-muted">
              Loading Kanji Tamago...
            </h2>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="h-28 w-full rounded-2xl bg-surface-muted animate-pulse border border-border/30"></div>
            <div className="h-44 w-full rounded-2xl bg-surface-muted animate-pulse border border-border/30"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-2xl flex-col">
        {/* ── LANDING VIEW ──────────────────────────────── */}
        {viewMode === "dashboard" && (
          <div className="flex flex-col gap-5 page-enter">
            {/* Header */}
            <header className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-surface text-muted transition hover:bg-surface-muted hover:text-foreground cursor-pointer"
              >
                <ArrowLeft size={15} />
              </Link>
              <div>
                <h1 className="font-jp text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
                  漢字たまご
                  <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    Kanji Tamago
                  </span>
                </h1>
                <p className="text-xs text-muted">
                  Interactive spaced repetition kanji writing and recognition
                  practice.
                </p>
              </div>
            </header>

            {/* SRS Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-border/40 bg-surface shadow-3xs p-4 flex flex-col gap-1.5 justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent/80">
                  Write Required (Teishutsu)
                </span>
                <div>
                  <h3 className="text-3xl font-black text-foreground">
                    {teishutsuDue}
                  </h3>
                  <p className="text-[10px] text-muted">
                    Kanji cards due to write today.
                  </p>
                </div>
              </Card>

              <Card className="border border-border/40 bg-surface shadow-3xs p-4 flex flex-col gap-1.5 justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">
                  Read & Recognize Only
                </span>
                <div>
                  <h3 className="text-3xl font-bold text-foreground/80">
                    {otherDue}
                  </h3>
                  <p className="text-[10px] text-muted">
                    Reading/recognition cards due today.
                  </p>
                </div>
              </Card>
            </div>

            {/* Filter Selections */}
            <div className="flex flex-wrap items-end gap-3 bg-surface p-3.5 rounded-2xl border border-border/30">
              <div className="flex flex-col gap-1 shrink-0">
                <label className="text-[10px] font-bold text-muted uppercase">
                  Chapter
                </label>
                <Popover>
                  <Popover.Trigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-44 justify-between bg-surface-muted border border-border/50 rounded-xl text-left text-xs font-semibold cursor-pointer"
                    >
                      <span>
                        {selectedChapter === "All"
                          ? "All Chapters"
                          : selectedChapter.startsWith("漢字")
                            ? selectedChapter
                            : `Chapter ${selectedChapter}`}
                      </span>
                      <span className="text-[10px] text-muted">▼</span>
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content
                    placement="bottom start"
                    className="border border-border bg-surface p-1 shadow-lg rounded-xl w-44 max-h-64 overflow-y-auto z-50"
                  >
                    <Popover.Dialog className="outline-none">
                      <ListBox
                        selectionMode="single"
                        selectedKeys={new Set([selectedChapter])}
                        onSelectionChange={(keys) => {
                          const val = Array.from(keys)[0] as string;
                          if (val) {
                            setSelectedChapter(val);
                            setExpandedChapter(null);
                          }
                        }}
                      >
                        <ListBox.Item
                          id="All"
                          textValue="All Chapters"
                          className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-xs flex items-center justify-between outline-none"
                        >
                          All Chapters
                        </ListBox.Item>
                        {chapters.map((ch) => (
                          <ListBox.Item
                            key={ch}
                            id={ch}
                            textValue={
                              ch.startsWith("漢字") ? ch : `Chapter ${ch}`
                            }
                            className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-xs flex items-center justify-between outline-none"
                          >
                            {ch.startsWith("漢字") ? ch : `Chapter ${ch}`}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Popover.Dialog>
                  </Popover.Content>
                </Popover>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <label className="text-[10px] font-bold text-muted uppercase">
                  Category
                </label>
                <Popover>
                  <Popover.Trigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-44 justify-between bg-surface-muted border border-border/50 rounded-xl text-left text-xs font-semibold cursor-pointer"
                    >
                      <span>
                        {selectedCategory === "All"
                          ? "All Categories"
                          : selectedCategory === "teishutsu_kanji"
                            ? "Teishutsu Kanji"
                            : selectedCategory === "yomeru"
                              ? "Yomeru"
                              : "Mite Wakaru"}
                      </span>
                      <span className="text-[10px] text-muted">▼</span>
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content
                    placement="bottom start"
                    className="border border-border bg-surface shadow-lg rounded-xl w-44 max-h-64 overflow-y-auto z-50"
                  >
                    <Popover.Dialog className="outline-none">
                      <ListBox
                        selectionMode="single"
                        selectedKeys={new Set([selectedCategory])}
                        onSelectionChange={(keys) => {
                          const val = Array.from(keys)[0] as string;
                          if (val) {
                            setSelectedCategory(val);
                            setExpandedChapter(null);
                          }
                        }}
                      >
                        <ListBox.Item
                          id="All"
                          textValue="All Categories"
                          className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg text-xs flex items-center justify-between outline-none"
                        >
                          All Categories
                        </ListBox.Item>
                        <ListBox.Item
                          id="teishutsu_kanji"
                          textValue="Teishutsu Kanji"
                          className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg text-xs flex items-center justify-between outline-none"
                        >
                          Teishutsu Kanji
                        </ListBox.Item>
                        <ListBox.Item
                          id="yomeru"
                          textValue="Yomeru"
                          className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg text-xs flex items-center justify-between outline-none"
                        >
                          Yomeru
                        </ListBox.Item>
                        <ListBox.Item
                          id="mite_wakaru"
                          textValue="Mite Wakaru"
                          className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg text-xs flex items-center justify-between outline-none"
                        >
                          Mite Wakaru
                        </ListBox.Item>
                      </ListBox>
                    </Popover.Dialog>
                  </Popover.Content>
                </Popover>
              </div>

              <div className="flex items-end gap-2 ml-auto pt-4 sm:pt-0">
                <Button
                  onPress={() => startSession("srs")}
                  variant="primary"
                  size="sm"
                  className="font-bold cursor-pointer"
                >
                  SRS Review (
                  {
                    dueList.filter((k) => {
                      const chMatch =
                        selectedChapter === "All" ||
                        k.chapter === selectedChapter;
                      const catMatch =
                        selectedCategory === "All" ||
                        k.category === selectedCategory;
                      return chMatch && catMatch;
                    }).length
                  }
                  )
                </Button>
                <Button
                  onPress={() => startSession("quick")}
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-surface-muted font-semibold cursor-pointer"
                >
                  Quick Study
                </Button>
              </div>
            </div>

            {/* Kanji Accordion Listings */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={13} />
                Kanji Study List
              </h2>

              <div className="flex flex-col gap-2">
                {filteredChapters.map((ch) => {
                  const chKanjiList = getKanjiByChapter(ch);
                  const isExpanded = expandedChapter === ch;
                  const chapterLabel = ch.startsWith("漢字")
                    ? ch
                    : `Chapter ${ch}`;

                  return (
                    <Card
                      key={ch}
                      className="border border-border/30 bg-surface shadow-3xs overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedChapter(isExpanded ? null : ch)
                        }
                        className={[
                          "flex items-center justify-between px-4 py-3.5 w-full text-left font-semibold text-sm hover:bg-surface-muted transition cursor-pointer",
                          isExpanded ? "rounded-t-2xl" : "rounded-2xl",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-foreground">
                            {chapterLabel}
                          </span>
                          <span className="text-xs font-normal text-muted truncate max-w-[200px] sm:max-w-md">
                            — {chKanjiList[0]?.topic}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            variant="soft"
                            color="default"
                            className="font-bold bg-muted/10 text-muted"
                          >
                            {chKanjiList.length} items
                          </Chip>
                          {isExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border/25 bg-surface-muted/30 px-4 py-3 flex flex-col gap-3">
                          {/* Study chapter header action panel */}
                          <div className="flex items-center justify-between gap-4 border-b border-border/15 pb-2">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                              Chapter Study Panel
                            </span>
                            <Button
                              onPress={() => startSession("chapter", ch)}
                              variant="primary"
                              size="sm"
                              className="font-bold cursor-pointer"
                            >
                              Study Chapter{" "}
                              {ch.startsWith("漢字") ? "Radical" : ch}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chKanjiList.map((item) => {
                              const prog = getProgress(item.id);
                              const studied = prog && prog.repetitions > 0;

                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border/20 text-xs shadow-4xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-jp text-lg font-black text-foreground shrink-0 select-all">
                                      {item.moji}
                                    </span>
                                    <div className="min-w-0 leading-tight">
                                      <p className="font-bold text-foreground truncate">
                                        {item.yomi}
                                      </p>
                                      <p className="text-[10px] text-muted truncate">
                                        {item.imi}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <Chip
                                      size="sm"
                                      variant="soft"
                                      color={
                                        item.category === "teishutsu_kanji"
                                          ? "danger"
                                          : item.category === "yomeru"
                                            ? "success"
                                            : "accent"
                                      }
                                      className="font-semibold"
                                    >
                                      {item.category === "teishutsu_kanji"
                                        ? "Write"
                                        : item.category === "yomeru"
                                          ? "Read"
                                          : "Recognize"}
                                    </Chip>
                                    {studied && (
                                      <span title="Studied">
                                        <History
                                          size={13}
                                          className="text-emerald-500"
                                        />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}

                {filteredChapters.length === 0 && (
                  <div className="p-8 text-center bg-surface border border-border/30 rounded-2xl text-muted text-xs">
                    No kanji records matching the current filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SESSION PRACTICE VIEW ─────────────────────── */}
        {viewMode === "session" && currentCard && (
          <div className="flex flex-col gap-4 page-enter">
            {/* Header: Progress bar */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewMode("dashboard")}
                className="text-xs font-semibold text-muted hover:text-foreground flex items-center gap-1 transition cursor-pointer"
              >
                <ArrowLeft size={13} />
                Cancel Session
              </button>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Practice Mode ({currentIndex + 1}/{sessionQueue.length})
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / sessionQueue.length) * 100}%`,
                }}
              />
            </div>

            {/* Main Flashcard Container */}
            <Card className="border border-border/30 bg-surface shadow-2xs relative min-h-[300px] flex flex-col justify-between overflow-hidden p-6">
              {/* Category indicator badge */}
              <div className="absolute top-4 left-6">
                <Chip
                  size="sm"
                  variant="soft"
                  color={
                    currentCard.category === "teishutsu_kanji"
                      ? "danger"
                      : currentCard.category === "yomeru"
                        ? "success"
                        : "accent"
                  }
                  className="font-bold uppercase tracking-wider text-[9px]"
                >
                  {currentCard.category === "teishutsu_kanji"
                    ? "Write Required"
                    : currentCard.category === "yomeru"
                      ? "Read Only"
                      : "Recognize Only"}
                </Chip>
              </div>

              {/* Sub-Chapter Indicator */}
              <div className="absolute top-4 right-6 text-right leading-none">
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider">
                  Chapter {currentCard.chapter}
                </p>
                <p className="text-[8px] text-muted/60 font-semibold truncate max-w-[120px]">
                  {currentCard.topic}
                </p>
              </div>

              {/* Card Center: Unified writing/flipping card */}
              <div className="my-auto py-6 flex flex-col items-center w-full">
                {/* A. WRITE REQUIRED MODE (TEISHUTSU KANJI) */}
                {currentCard.category === "teishutsu_kanji" ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Meaning / Reading prompt */}
                    <div className="text-center flex flex-col gap-1 select-none">
                      <h3 className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        Draw the Kanji for:
                      </h3>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground leading-normal">
                        {currentCard.imi}
                      </h2>
                      <p className="text-xs font-semibold text-muted font-jp mt-0.5">
                        Reading: {currentCard.yomi}
                      </p>
                    </div>

                    {/* Handwriting Canvas */}
                    <div className="w-full max-w-lg sm:max-w-xl">
                      {isDrawCorrect ? (
                        <div className="h-44 w-full rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/5 flex flex-col items-center justify-center gap-2 select-none animate-in fade-in duration-300">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Check size={20} />
                          </div>
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Excellent! Draw matches the Kanji "
                            {currentCard.moji}"
                          </p>
                          <h1 className="font-jp text-5xl font-black text-foreground mt-1 select-all">
                            {currentCard.moji}
                          </h1>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <HandwritingCanvas
                            ref={canvasRef}
                            value={drawInput}
                            onChange={(val) => {
                              setDrawInput(val);
                            }}
                            onSubmit={checkDrawAnswer}
                            placeholder="Draw kanji here..."
                            hintText={currentCard.moji}
                            hideKeyboardMode={true}
                            onCandidatesChange={setCurrentCandidates}
                            onRecognizingChange={setIsRecognizingDraw}
                          />
                          <div className="flex justify-end mt-1 z-20">
                            <Button
                              onPress={checkDrawAnswer}
                              isDisabled={
                                gradingScore !== null || isRecognizingDraw
                              }
                              variant="primary"
                              size="sm"
                              className="font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {gradingScore !== null
                                ? "Saving..."
                                : isRecognizingDraw
                                  ? "Analyzing..."
                                  : "Check Draw"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* B. READ / RECOGNIZE ONLY MODE (ANKI MORPH FLIP) */
                  <div className="w-full flex flex-col items-center">
                    {/* Morph word text */}
                    <div
                      className={[
                        "transition-all duration-500 ease-in-out flex items-center justify-center",
                        isFlipped
                          ? "absolute top-4 scale-75 opacity-90"
                          : "scale-100 opacity-100 py-6",
                      ].join(" ")}
                    >
                      <h2 className="font-jp text-4xl sm:text-5xl font-extrabold text-foreground text-center select-all">
                        {currentCard.moji}
                      </h2>
                    </div>

                    {/* Revealed Content (Slides up) */}
                    <div
                      className={[
                        "w-full flex flex-col items-center text-center transition-all duration-500 ease-out",
                        isFlipped
                          ? "opacity-100 translate-y-0 mt-8"
                          : "opacity-0 translate-y-6 pointer-events-none absolute inset-0 flex items-center justify-center",
                      ].join(" ")}
                    >
                      {isFlipped && (
                        <div className="w-full flex flex-col items-center gap-1.5">
                          <h3 className="font-jp text-lg sm:text-xl text-indigo-500 font-bold">
                            {currentCard.yomi}
                          </h3>
                          <p className="mt-1 text-sm sm:text-base font-semibold text-foreground max-w-sm border-t border-border/50 pt-2 whitespace-pre-line leading-relaxed">
                            {currentCard.imi}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Flip Trigger Area */}
                    {!isFlipped && (
                      <button
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="mt-6 w-full max-w-xs py-3 border border-dashed border-border/60 hover:border-accent/40 rounded-xl text-xs font-semibold text-muted hover:text-accent transition cursor-pointer"
                      >
                        Tap card to reveal answer
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Card Footer: Grading buttons */}
              {isFlipped && (
                <div className="border-t border-border/40 pt-4 flex items-center justify-center gap-2 sm:gap-3 select-none animate-in slide-in-from-bottom duration-300">
                  <button
                    type="button"
                    onClick={() => gradeCard(1)}
                    disabled={gradingScore !== null}
                    className="flex flex-col items-center flex-1 py-1 sm:py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs font-bold">
                      {gradingScore === 1 ? "Saving..." : "Again"}
                    </span>
                    <span className="text-[8px] text-rose-500/80 font-medium">
                      1d
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => gradeCard(2)}
                    disabled={gradingScore !== null}
                    className="flex flex-col items-center flex-1 py-1 sm:py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs font-bold">
                      {gradingScore === 2 ? "Saving..." : "Hard"}
                    </span>
                    <span className="text-[8px] text-amber-500/80 font-medium">
                      1.2x
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => gradeCard(3)}
                    disabled={gradingScore !== null}
                    className="flex flex-col items-center flex-1 py-1 sm:py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs font-bold">
                      {gradingScore === 3 ? "Saving..." : "Good"}
                    </span>
                    <span className="text-[8px] text-indigo-500/80 font-medium">
                      ease
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => gradeCard(4)}
                    disabled={gradingScore !== null}
                    className="flex flex-col items-center flex-1 py-1 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs font-bold">
                      {gradingScore === 4 ? "Saving..." : "Easy"}
                    </span>
                    <span className="text-[8px] text-emerald-500/80 font-medium">
                      bonus
                    </span>
                  </button>
                </div>
              )}

              {/* Card Footer: Mnemonic & Confusion warnings when flipped */}
              {isFlipped && (
                <div className="w-full flex flex-col gap-3 my-2 border-t border-border/20 pt-3 animate-in fade-in duration-300">
                  {/* Confusion Pairs Alert */}
                  {confusionKanji && (
                    <div className="rounded-xl border border-amber-500/25 bg-amber-50/10 dark:bg-amber-950/5 p-2.5 flex gap-2 items-start text-left select-none">
                      <AlertTriangle
                        size={14}
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Confusion Warning
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex flex-col items-center">
                            <span className="font-jp text-2xl font-black text-accent">
                              {currentCard.moji[0]}
                            </span>
                            <span className="text-[8px] font-bold text-muted">
                              Current
                            </span>
                          </div>
                          {confusionKanji.map((other, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                            >
                              <span className="font-jp text-2xl font-bold text-muted/75">
                                {other}
                              </span>
                              <span className="text-[8px] font-medium text-muted/55">
                                Similar
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mnemonic Story Textarea */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[9px] font-bold text-muted uppercase tracking-wider">
                        Memory Story (Mnemonic)
                      </span>
                      <button
                        type="button"
                        onClick={saveMnemonic}
                        disabled={isMnemonicSaving}
                        className="text-[10px] font-bold text-accent hover:text-accent-foreground flex items-center gap-1 bg-accent/8 hover:bg-accent px-2 py-1 rounded-full transition disabled:opacity-40 cursor-pointer"
                      >
                        <Save size={10} />
                        {isMnemonicSaving ? "Saving..." : "Save Story"}
                      </button>
                    </div>
                    <textarea
                      value={userMnemonic}
                      onChange={(e) => setUserMnemonic(e.target.value)}
                      placeholder="E.g. 休 (rest) = 人 (person) leaning on 木 (tree)."
                      className="w-full h-12 rounded-xl border border-border/40 bg-surface-muted/50 p-2 text-[11px] text-foreground focus:outline-hidden focus:border-accent/40 placeholder:text-muted/50"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── SESSION COMPLETE MODAL ───────────────────── */}
        <Modal
          isOpen={sessionFinished}
          onOpenChange={(open) => {
            if (!open) {
              setSessionQueue([]);
              setSessionFinished(false);
              setViewMode("dashboard");
              fetchData(); // reload progress stats
            }
          }}
        >
          <Modal.Backdrop>
            <Modal.Container className="flex items-center justify-center min-h-screen w-screen">
              <Modal.Dialog className="sm:max-w-[360px]">
                <Modal.CloseTrigger />
                <Modal.Header className="flex flex-col items-center text-center pt-6">
                  <Sparkles size={44} className="mb-2 text-accent" />
                  <Modal.Heading className="font-bold text-foreground text-xl">
                    Kanji Tamago Done!
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body className="flex flex-col items-center text-center gap-4 py-4">
                  <p className="text-xs text-muted leading-relaxed">
                    You have finished reviewing all selected Kanji Tamago cards.
                    Keep it up to lock them into long-term memory!
                  </p>
                  <div className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                    Reviewed: {reviewedCount} Cards
                  </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-center pb-6">
                  <Button
                    slot="close"
                    variant="primary"
                    className="w-full font-semibold cursor-pointer"
                  >
                    Back to Dashboard
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

        {/* Alert Modal (Replaces browser alert) */}
        <Modal
          isOpen={alertModal.isOpen}
          onOpenChange={(open) =>
            setAlertModal((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <Modal.Backdrop>
            <Modal.Container className="flex items-center justify-center min-h-screen w-screen animate-in fade-in duration-200">
              <Modal.Dialog className="sm:max-w-[360px]">
                <Modal.CloseTrigger />
                <Modal.Header className="flex flex-col items-center text-center pt-6">
                  <AlertCircle size={36} className="text-accent mb-2" />
                  <Modal.Heading className="font-bold text-foreground text-lg">
                    {alertModal.title}
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body className="text-center py-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {alertModal.message}
                  </p>
                </Modal.Body>
                <Modal.Footer className="flex justify-center pb-6">
                  <Button
                    slot="close"
                    variant="primary"
                    className="w-full font-semibold cursor-pointer"
                  >
                    OK
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

        {/* Incorrect Drawing Help Modal */}
        <Modal
          isOpen={incorrectCard !== null}
          onOpenChange={(open) => {
            if (!open) {
              handleIncorrectProceed();
            }
          }}
        >
          <Modal.Backdrop>
            <Modal.Container className="flex items-center justify-center min-h-screen w-screen animate-in fade-in duration-200">
              <Modal.Dialog className="sm:max-w-[360px] p-6 flex flex-col items-center text-center">
                <Modal.CloseTrigger />
                <h3 className="text-base font-extrabold text-rose-500 mb-1 flex items-center gap-1.5 justify-center">
                  <AlertCircle size={18} />
                  Incorrect Drawing / Answer
                </h3>
                <p className="text-xs text-muted mb-4">
                  Here is the correct stroke order. Watch the animation:
                </p>

                {/* Animated Kanji VG Stroke Order Tracer */}
                <div className="w-40 h-40 bg-surface-muted border border-border/40 rounded-2xl flex items-center justify-center relative overflow-hidden mb-5 select-none shadow-3xs">
                  {incorrectCard && (
                    <CanvasStrokeTracer
                      char={incorrectCard.moji}
                      className="w-32 h-32 text-accent pointer-events-auto cursor-pointer [&_svg]:w-full [&_svg]:h-full [&_path]:stroke-[6px] [&_path]:stroke-accent [&_path]:fill-none"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 text-[8px] font-bold text-muted/60 uppercase">
                    Click Kanji to Replay
                  </span>
                </div>

                <div className="flex flex-col gap-1 w-full text-left bg-surface-muted/50 border border-border/20 p-3 rounded-2xl mb-5">
                  <span className="text-[9px] font-extrabold text-muted uppercase">
                    Meaning / Readings
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-jp text-2xl font-black text-foreground">
                      {incorrectCard?.moji}
                    </span>
                    <span className="text-xs font-bold text-accent">
                      {incorrectCard?.yomi}
                    </span>
                  </div>
                  <span className="text-xs text-foreground/80 font-medium mt-1">
                    {incorrectCard?.topic}
                  </span>
                </div>

                <Button
                  onPress={handleIncorrectProceed}
                  variant="primary"
                  className="w-full font-bold cursor-pointer"
                >
                  Got It (Next)
                </Button>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}
