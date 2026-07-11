"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Chip,
  Popover,
  Modal,
  Label,
  ListBox,
} from "@heroui/react";
import {
  HelpCircle,
  Pencil,
  MousePointerClick,
  PartyPopper,
  Lightbulb,
  BookOpen,
  Flame,
  Volume2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { KANJI_N5 } from "@/src/helper/kanji-n5";
import { HandwritingCanvas } from "@/src/shared/components/HandwritingCanvas";

interface AnkiContentProps {
  username: string;
}

interface SRSProgress {
  cardKey: string;
  dueDate: string;
  interval: number;
  repetitions: number;
  ease: number;
}

interface VocabularyCard {
  cardKey: string;
  chapter: string;
  sectionIndex: number;
  kanji: string;
  hiragana: string;
  romaji: string;
  translation: string;
  audio?: string | null;
  sentence?: string | null;
  sentenceTranslation?: string | null;
  sentenceAudio?: string | null;
  image?: string | null;
}

export function AnkiContent({ username }: AnkiContentProps) {
  const { t, lang } = useLanguage();

  // Settings states defined at the top to resolve scope issues
  const [dekiruGroups, setDekiruGroups] = useState<any[]>([]);
  const [postMode, setPostMode] = useState<"session" | "card">("session");
  const [dailyNewCardsLimit, setDailyNewCardsLimit] = useState<number>(20);
  const [dailyReviewLimit, setDailyReviewLimit] = useState<string>("unlimited");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Filter pilihan (multiple selection mode using Selection type from React Aria / HeroUI)
  const [filterChapters, setFilterChapters] = useState<any>(
    new Set<string>(["all"]),
  );
  const [filterPoints, setFilterPoints] = useState<any>(
    new Set<string>(["all"]),
  );

  // Handler untuk sinkronisasi multiselect: klik "all" mereset opsi lain, klik opsi lain menghapus "all"
  const handleChapterSelectionChange = (keys: any) => {
    if (keys === "all") {
      setFilterChapters(new Set(["all"]));
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterChapters(set);
    setFilterPoints(new Set(["all"])); // reset points ketika bab berubah
  };

  const handlePointSelectionChange = (keys: any) => {
    if (keys === "all") {
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterPoints(set);
  };

  // Dapatkan opsi poin yang tersedia berdasarkan bab yang dipilih
  const availablePointsOptions = useMemo<
    Array<{ id: string; title: string }>
  >(() => {
    const showAllChaps =
      filterChapters === "all" ||
      !(filterChapters instanceof Set) ||
      filterChapters.has("all") ||
      filterChapters.size === 0;

    if (
      showAllChaps ||
      !(filterChapters instanceof Set) ||
      filterChapters.size > 1
    ) {
      return [
        { id: "1", title: "Point 1" },
        { id: "2", title: "Point 2" },
        { id: "3", title: "Point 3" },
        { id: "4", title: "Point 4 / もう一度聞こう" },
      ];
    }

    // Tampilkan sections spesifik jika hanya ada 1 bab yang dipilih
    const chapNumStr = Array.from(filterChapters)[0];
    const chapIdx = parseInt(chapNumStr as string) - 1;
    const chap = dekiruGroups[chapIdx];
    if (!chap) return [];

    return chap.sections.map((sect: any, sIdx: number) => ({
      id: String(sIdx + 1),
      title: `Point ${sIdx + 1}: ${sect.title}`,
    }));
  }, [filterChapters, dekiruGroups]);

  // Selected chapters text helper for Select.Value
  const selectedChaptersText = useMemo(() => {
    const showAll =
      filterChapters === "all" ||
      !(filterChapters instanceof Set) ||
      filterChapters.has("all") ||
      filterChapters.size === 0;
    if (showAll) {
      return t.ankiAllChapters || "Semua Bab";
    }
    const sortedChaps = Array.from(filterChapters)
      .map(Number)
      .sort((a, b) => a - b);
    return sortedChaps.map((chap) => `Chapter ${chap}`).join(", ");
  }, [filterChapters, t.ankiAllChapters]);

  // Selected points text helper for Select.Value
  const selectedPointsText = useMemo(() => {
    const showAll =
      filterPoints === "all" ||
      !(filterPoints instanceof Set) ||
      filterPoints.has("all") ||
      filterPoints.size === 0;
    if (showAll) {
      return t.ankiAllPoints || "Semua Poin";
    }
    const sortedPoints = Array.from(filterPoints)
      .map(Number)
      .sort((a, b) => a - b);

    return sortedPoints
      .map((ptId) => {
        const opt = availablePointsOptions.find(
          (o: any) => o.id === String(ptId),
        );
        return opt ? opt.title : `Poin ${ptId}`;
      })
      .join(", ");
  }, [filterPoints, availablePointsOptions, t.ankiAllPoints]);

  // Progres dari database
  const [progressMap, setProgressMap] = useState<Record<string, SRSProgress>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [deckType, setDeckType] = useState<"dekiru" | "custom" | null>(null);
  const [customCards, setCustomCards] = useState<VocabularyCard[]>([]);

  const playAudio = (filename: string) => {
    const audio = new Audio(`/anki-media/${filename}`);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  // Sesi belajar saat ini
  const [sessionQueue, setSessionQueue] = useState<VocabularyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [ankiMode, setAnkiMode] = useState<"srs" | "quick">("srs");
  const [reviewDirection, setReviewDirection] = useState<"normal" | "reverse">(
    "normal",
  );
  const [pendingReviews, setPendingReviews] = useState<
    Array<{
      cardKey: string;
      chapter: string;
      sectionIndex: number;
      rating: number;
    }>
  >([]);

  // Handwriting active recall state
  const [ankiWriteInput, setAnkiWriteInput] = useState("");
  const [ankiAnswerChecked, setAnkiAnswerChecked] = useState(false);
  const [ankiIsCorrect, setAnkiIsCorrect] = useState(false);
  const [ankiUsedHint, setAnkiUsedHint] = useState(false);
  const [isWritingActive, setIsWritingActive] = useState(false);

  const currentCard = sessionQueue[currentIndex];

  const checkAnkiAnswer = (written: string) => {
    const currentCard = sessionQueue[currentIndex];
    if (!currentCard) return;

    // In reverse mode, check against Kanji (if not "-"), otherwise check against Hiragana
    const targetText =
      reviewDirection === "reverse" && currentCard.kanji !== "-"
        ? currentCard.kanji
        : currentCard.hiragana;

    // Remove romaji parenthetical helpers from target if any
    const cleanTarget = targetText.replace(/\s*[\(（].*?[\)）]/g, "").trim();
    const cleanWritten = written.replace(/\s*[\(（].*?[\)）]/g, "").trim();

    const correct = cleanWritten === cleanTarget;
    setAnkiIsCorrect(correct);
    setAnkiAnswerChecked(true);

    if (correct) {
      // Flip card to show back
      setFlipped(true);

      // Auto-progress to next card after 1.2s delay ONLY in normal mode
      if (reviewDirection !== "reverse") {
        setTimeout(() => {
          if (ankiMode === "srs") {
            handleRateCard(ankiUsedHint ? 2 : 3);
          } else {
            handleQuickAnswer(true);
          }
        }, 1200);
      }
    }
  };

  // Learned Kanji state (derived from vocabulary progress)
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [showReadings, setShowReadings] = useState<boolean>(false);

  // Settings

  // Load settings from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("anki_post_mode");
    if (savedMode === "session" || savedMode === "card") {
      setPostMode(savedMode);
    }
    const savedNewLimit = localStorage.getItem("anki_daily_new_limit");
    if (savedNewLimit) {
      setDailyNewCardsLimit(Number(savedNewLimit));
    }
    const savedReviewLimit = localStorage.getItem("anki_daily_review_limit");
    if (savedReviewLimit) {
      setDailyReviewLimit(savedReviewLimit);
    }
    const savedDirection = localStorage.getItem("anki_review_direction");
    if (savedDirection === "normal" || savedDirection === "reverse") {
      setReviewDirection(savedDirection as "normal" | "reverse");
    }
  }, []);

  const handleReviewDirectionChange = (direction: "normal" | "reverse") => {
    setReviewDirection(direction);
    localStorage.setItem("anki_review_direction", direction);
  };

  const handlePostModeChange = (mode: "session" | "card") => {
    setPostMode(mode);
    localStorage.setItem("anki_post_mode", mode);
  };

  const handleNewCardsLimitChange = (limit: number) => {
    setDailyNewCardsLimit(limit);
    localStorage.setItem("anki_daily_new_limit", String(limit));
  };

  const handleReviewLimitChange = (limit: string) => {
    setDailyReviewLimit(limit);
    localStorage.setItem("anki_daily_review_limit", limit);
  };

  // Reset showReadings state when selecting a new Kanji
  useEffect(() => {
    if (selectedKanji) {
      setShowReadings(false);
    }
  }, [selectedKanji]);

  // Ambil progres SRS pengguna, kurikulum Dekiru Nihongo, dan dek kustom secara dinamis saat masuk
  useEffect(() => {
    async function initAnki() {
      try {
        // Fetch DekiruNihongoGroup, custom cards, and user progress in parallel
        const [mod, res, customRes] = await Promise.all([
          import("@/src/helper/DekiruNihongoGroup"),
          fetch("/api/anki"),
          fetch("/api/anki/custom-cards?deckName=JLPT N5-N4"),
        ]);

        setDekiruGroups(mod.DekiruNihongoGroups);

        if (res.ok) {
          const json = await res.json();
          const pMap: Record<string, SRSProgress> = {};
          (json.progress || []).forEach((item: SRSProgress) => {
            pMap[item.cardKey] = item;
          });
          setProgressMap(pMap);
        }

        if (customRes.ok) {
          const customData = await customRes.json();
          const mapped: VocabularyCard[] = (customData.cards || []).map(
            (card: any) => ({
              cardKey: `custom-${card.id}`,
              chapter: card.deckName,
              sectionIndex: 0,
              kanji: card.kanji,
              hiragana: card.hiragana,
              romaji: card.romaji || "",
              translation: card.translation,
              audio: card.audio,
              sentence: card.sentence,
              sentenceTranslation: card.sentenceTranslation,
              sentenceAudio: card.sentenceAudio,
              image: card.image,
            }),
          );
          setCustomCards(mapped);
        }
      } catch (err) {
        console.error("Gagal menginisialisasi Anki:", err);
      } finally {
        setLoading(false);
      }
    }

    initAnki();
  }, []);

  // Autoplay audio saat kartu dibalik ke belakang (deck kustom)
  useEffect(() => {
    if (flipped && currentCard && currentCard.audio && deckType === "custom") {
      playAudio(currentCard.audio);
    }
  }, [flipped, currentCard?.cardKey]);

  // Ekstrak semua kosakata yang cocok dengan filter
  const filteredVocabulary = useMemo(() => {
    const list: VocabularyCard[] = [];
    const showAllChaps =
      filterChapters === "all" ||
      !(filterChapters instanceof Set) ||
      filterChapters.has("all") ||
      filterChapters.size === 0;
    const showAllPts =
      filterPoints === "all" ||
      !(filterPoints instanceof Set) ||
      filterPoints.has("all") ||
      filterPoints.size === 0;

    dekiruGroups.forEach((chap: any, cIdx: number) => {
      const chapterNumber = cIdx + 1;
      if (
        !showAllChaps &&
        filterChapters instanceof Set &&
        !filterChapters.has(String(chapterNumber))
      ) {
        return;
      }

      chap.sections.forEach((sect: any, sIdx: number) => {
        const pointNumber = sIdx + 1;
        if (
          !showAllPts &&
          filterPoints instanceof Set &&
          !filterPoints.has(String(pointNumber))
        ) {
          return;
        }

        const examples = (sect.examples || []) as Array<{
          kanji: string;
          hiragana: string;
          romaji?: string;
          translations?: Record<string, string>;
        }>;
        examples.forEach((item) => {
          const cardKey = `Bab ${chap.chapter.replace("Bab ", "")}-${sIdx}-${item.kanji}-${item.hiragana}`;
          list.push({
            cardKey,
            chapter: chap.chapter,
            sectionIndex: sIdx,
            kanji: item.kanji,
            hiragana: item.hiragana,
            romaji: item.romaji || "",
            translation:
              item.translations?.id ||
              item.translations?.en ||
              "No translation",
          });
        });
      });
    });

    return list;
  }, [filterChapters, filterPoints, dekiruGroups]);

  // Swap vocabulary list depending on selected deck type
  const activeVocabularyList = useMemo(() => {
    return deckType === "dekiru" ? filteredVocabulary : customCards;
  }, [deckType, filteredVocabulary, customCards]);

  // Klasifikasikan kartu menjadi: Due (Review) atau New (Baru)
  const cardStats = useMemo(() => {
    let due = 0;
    let newCards = 0;
    const now = new Date();

    activeVocabularyList.forEach((card) => {
      const prog = progressMap[card.cardKey];
      if (!prog) {
        newCards += 1;
      } else {
        const dueDate = new Date(prog.dueDate);
        if (dueDate <= now) {
          due += 1;
        }
      }
    });

    return { due, newCards };
  }, [activeVocabularyList, progressMap]);

  // Ekstrak karakter Kanji unik yang dipelajari dari kosakata (anki progress)
  const learnedVocabKanji = useMemo(() => {
    const kanjiMap = new Map<
      string,
      {
        character: string;
        vocabWords: Array<{
          word: string;
          reading: string;
          meaning: string;
          reps: number;
          interval: number;
        }>;
      }
    >();

    // Buat lookup untuk memetakan kanji-hiragana ke detail kosakata
    const vocabLookup = new Map<string, VocabularyCard>();
    activeVocabularyList.forEach((card) => {
      vocabLookup.set(`${card.kanji}-${card.hiragana}`, card);
    });

    Object.keys(progressMap).forEach((key) => {
      const parts = key.split("-");
      if (parts.length >= 4) {
        const kanjiWord = parts[2];
        const hiragana = parts[3];
        const progress = progressMap[key];

        if (kanjiWord !== "-") {
          const cardData = vocabLookup.get(`${kanjiWord}-${hiragana}`);
          const meaning = cardData ? cardData.translation : "No translation";

          for (let i = 0; i < kanjiWord.length; i++) {
            const char = kanjiWord[i];
            if (/[\u4e00-\u9faf]/.test(char)) {
              if (!kanjiMap.has(char)) {
                kanjiMap.set(char, { character: char, vocabWords: [] });
              }
              const kData = kanjiMap.get(char)!;
              if (!kData.vocabWords.some((w) => w.word === kanjiWord)) {
                kData.vocabWords.push({
                  word: kanjiWord,
                  reading: hiragana,
                  meaning,
                  reps: progress.repetitions,
                  interval: progress.interval,
                });
              }
            }
          }
        }
      }
    });

    return Array.from(kanjiMap.values());
  }, [progressMap, activeVocabularyList]);

  // Detail Kanji yang terpilih
  const selectedKanjiDetail = useMemo(() => {
    if (!selectedKanji) return null;
    return learnedVocabKanji.find((k) => k.character === selectedKanji) || null;
  }, [selectedKanji, learnedVocabKanji]);

  const kanjiDbInfo = useMemo(() => {
    if (!selectedKanji) return null;
    return KANJI_N5.find((k) => k.kanji === selectedKanji) || null;
  }, [selectedKanji]);

  // Mulai sesi belajar
  const startSession = (mode: "due" | "all" | "quick") => {
    let queue: VocabularyCard[] = [];

    if (mode === "quick") {
      // Quick mode: ambil semua kosakata terpilih
      queue = [...activeVocabularyList];
    } else {
      const now = new Date();
      if (mode === "due") {
        // Ambil yang jatuh tempo saja
        let dueCards = activeVocabularyList.filter((card) => {
          const prog = progressMap[card.cardKey];
          if (!prog) return false; // Abaikan yang baru
          return new Date(prog.dueDate) <= now;
        });
        if (dailyReviewLimit !== "unlimited") {
          dueCards = dueCards.slice(0, Number(dailyReviewLimit));
        }
        queue = dueCards;
      } else {
        // Campur: Ambil yang jatuh tempo dahulu, baru yang Baru (maksimal limit kartu baru)
        let dueCards = activeVocabularyList.filter((card) => {
          const prog = progressMap[card.cardKey];
          return prog && new Date(prog.dueDate) <= now;
        });
        if (dailyReviewLimit !== "unlimited") {
          dueCards = dueCards.slice(0, Number(dailyReviewLimit));
        }

        const newCards = activeVocabularyList
          .filter((card) => {
            return !progressMap[card.cardKey];
          })
          .slice(0, dailyNewCardsLimit); // Batasi kartu baru per sesi berdasarkan konfigurasi

        queue = [...dueCards, ...newCards];
      }
    }

    // Acak antrean agar lebih bervariasi
    queue.sort(() => Math.random() - 0.5);

    setSessionQueue(queue);
    setCurrentIndex(0);
    setFlipped(false);
    setIsWritingActive(false);
    setReviewedCount(0);
    setSessionFinished(false);
    setPendingReviews([]);
  };

  // Kirim semua review yang tertunda ke API dalam satu batch
  const triggerSaveBatch = async (
    reviewsToSave: typeof pendingReviews,
    isFullBatch = true,
  ) => {
    if (reviewsToSave.length === 0) return;
    try {
      const res = await fetch("/api/anki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewsToSave),
      });

      if (res.ok) {
        const json = await res.json();
        // Perbarui cache progress lokal dengan semua data baru
        setProgressMap((prev) => {
          const nextMap = { ...prev };
          const progressList = Array.isArray(json.progress)
            ? json.progress
            : json.progress
              ? [json.progress]
              : [];
          progressList.forEach((item: SRSProgress) => {
            nextMap[item.cardKey] = item;
          });
          return nextMap;
        });
      }
    } catch (err) {
      console.error("Gagal menyimpan progres batch:", err);
    }
    if (isFullBatch) {
      setPendingReviews([]);
    }
  };

  const handleCancelSession = async () => {
    if (postMode === "session") {
      await triggerSaveBatch(pendingReviews);
    }
    setSessionQueue([]);
    setIsWritingActive(false);
  };

  // Jawaban untuk Quick Memorization Mode (Sudah Tahu / Tidak Tahu)
  const handleQuickAnswer = async (knows: boolean) => {
    if (sessionQueue.length === 0) return;
    const currentCard = sessionQueue[currentIndex];

    // Reset flipped and handwriting states
    setFlipped(false);
    setAnkiWriteInput("");
    setAnkiAnswerChecked(false);
    setAnkiIsCorrect(false);
    setAnkiUsedHint(false);
    setIsWritingActive(false);
    setReviewedCount((prev) => prev + 1);

    // Sudah Tahu -> rating 2 (Hard, bobot paling kecil untuk sukses)
    // Tidak Tahu -> rating 1 (Again, lupa)
    const rating = knows ? 2 : 1;
    const cardReview = {
      cardKey: currentCard.cardKey,
      chapter: currentCard.chapter,
      sectionIndex: currentCard.sectionIndex,
      rating,
    };

    if (postMode === "card") {
      await triggerSaveBatch([cardReview], false);
    } else {
      setPendingReviews((prev) => [
        ...prev.filter((r) => r.cardKey !== currentCard.cardKey),
        cardReview,
      ]);
    }

    if (!knows) {
      // Tidak tahu: masukkan kartu ke akhir antrean sesi agar diulang terus
      const reQueueCard = { ...currentCard };
      setSessionQueue((prev) => [...prev, reQueueCard]);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Sudah tahu: lanjut ke kartu berikutnya (keluarkan dari sisa sesi)
      if (currentIndex + 1 >= sessionQueue.length) {
        setSessionFinished(true);
        if (postMode === "session") {
          const nextReviews = [
            ...pendingReviews.filter((r) => r.cardKey !== currentCard.cardKey),
            cardReview,
          ];
          await triggerSaveBatch(nextReviews);
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  // Nilai kartu saat ini
  const handleRateCard = async (rating: number) => {
    if (sessionQueue.length === 0) return;
    const currentCard = sessionQueue[currentIndex];

    // Animasi balik kartu direset
    setFlipped(false);
    setAnkiWriteInput("");
    setAnkiAnswerChecked(false);
    setAnkiIsCorrect(false);
    setAnkiUsedHint(false);
    setIsWritingActive(false);
    setReviewedCount((prev) => prev + 1);

    const cardReview = {
      cardKey: currentCard.cardKey,
      chapter: currentCard.chapter,
      sectionIndex: currentCard.sectionIndex,
      rating,
    };

    if (postMode === "card") {
      await triggerSaveBatch([cardReview], false);
    } else {
      setPendingReviews((prev) => [
        ...prev.filter((r) => r.cardKey !== currentCard.cardKey),
        cardReview,
      ]);
    }

    // LOGIKA ANKI: Jika memilih "Again" (1), kartu akan dimasukkan kembali ke antrean akhir sesi
    if (rating === 1) {
      const reQueueCard = { ...currentCard };
      setSessionQueue((prev) => [...prev, reQueueCard]);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Pindah ke kartu berikutnya
      if (currentIndex + 1 >= sessionQueue.length) {
        setSessionFinished(true);
        if (postMode === "session") {
          const nextReviews = [
            ...pendingReviews.filter((r) => r.cardKey !== currentCard.cardKey),
            cardReview,
          ];
          await triggerSaveBatch(nextReviews);
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  // currentCard dideklarasikan di level teratas komponen

  // Hitung progres bar sesi aktif
  const progressPercentage = useMemo(() => {
    if (sessionQueue.length === 0) return 0;
    return Math.round((currentIndex / sessionQueue.length) * 100);
  }, [currentIndex, sessionQueue]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pt-6 pb-16">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground flex items-center gap-2 truncate">
                <span>日本語フロー</span>
                <span className="font-sans text-[10px] sm:text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  Anki
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">
                {t.ankiSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {deckType !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setDeckType(null);
                    setSessionQueue([]);
                    setSessionFinished(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-muted text-muted hover:text-foreground transition-colors cursor-pointer text-xs font-bold shrink-0 animate-in fade-in duration-200"
                  title="Change deck"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">Change Deck</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-surface hover:bg-surface-muted text-foreground cursor-pointer text-sm font-bold shrink-0"
                title={t.ankiGuideTitle || "SRS Grading Guide"}
              >
                <HelpCircle size={16} />
              </button>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <main className="mt-6 flex flex-col gap-6">
            {/* Main Selection Card Skeleton */}
            <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
              {/* Switcher Mode Belajar Skeleton */}
              <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                <div className="flex-1 h-8 rounded-lg bg-border/40 dark:bg-zinc-800/40 animate-pulse"></div>
                <div className="w-1"></div>
                <div className="flex-1 h-8 rounded-lg bg-border/40 dark:bg-zinc-800/40 animate-pulse"></div>
              </div>

              {/* Grid Filter Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-16 bg-border/40 dark:bg-zinc-800/40 rounded-sm animate-pulse mb-1.5"></div>
                  <div className="h-[38px] w-full bg-border/40 dark:bg-zinc-800/40 rounded-xl animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-16 bg-border/40 dark:bg-zinc-800/40 rounded-sm animate-pulse mb-1.5"></div>
                  <div className="h-[38px] w-full bg-border/40 dark:bg-zinc-800/40 rounded-xl animate-pulse"></div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="h-16 rounded-xl bg-surface-muted/50 border border-border flex flex-col items-center justify-center gap-1.5 p-3">
                  <div className="h-4 w-8 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                  <div className="h-2 w-16 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                </div>
                <div className="h-16 rounded-xl bg-surface-muted/50 border border-border flex flex-col items-center justify-center gap-1.5 p-3">
                  <div className="h-4 w-8 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                  <div className="h-2 w-12 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-row gap-3 border-t border-border pt-4">
                <div className="h-9 flex-1 bg-border/40 dark:bg-zinc-800/40 rounded-xl animate-pulse"></div>
                <div className="h-9 flex-1 bg-border/40 dark:bg-zinc-800/40 rounded-xl animate-pulse"></div>
              </div>
            </Card>

            {/* List Kanji Section Skeleton */}
            <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-border pb-3">
                <div className="h-4 w-48 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                <div className="h-2 w-72 bg-border/40 dark:bg-zinc-800/40 rounded-md mt-1 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 mt-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square min-h-[48px] rounded-xl border border-border bg-surface/50 animate-pulse flex items-center justify-center"
                  >
                    <div className="h-5 w-5 bg-border/30 dark:bg-zinc-800/30 rounded-md"></div>
                  </div>
                ))}
              </div>
            </Card>
          </main>
        ) : (
          <main className="mt-6">
            {/* TAMPILAN SELEKSI DECK / FILTER (Jika sesi belajar belum aktif) */}
            {sessionQueue.length === 0 || sessionFinished ? (
              deckType === null ? (
                <div className="flex flex-col gap-6">
                  {/* Layar Pemilihan Dek Pertama Kali */}
                  <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
                    <div className="text-center border-b border-border/50 pb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        Select Study Deck
                      </h2>
                      <p className="text-xs text-muted mt-1">
                        Choose a vocabulary deck to start your flashcard review
                        session.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Dekiru Nihongo Card */}
                      <div
                        onClick={() => setDeckType("dekiru")}
                        className="group flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-zinc-900/50 border border-border/60 hover:border-indigo-500 rounded-2xl cursor-pointer hover:scale-102 hover:shadow-md transition-all duration-300 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen size={24} />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                            Dekiru Nihongo N5
                          </h3>
                          <p className="text-[11px] text-muted mt-1.5 leading-normal">
                            Predefined curriculum vocabulary structured by
                            chapters and points (Chapters 1-15).
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full mt-2 font-bold pointer-events-none group-hover:bg-indigo-600 group-hover:text-white"
                        >
                          Select Deck
                        </Button>
                      </div>

                      {/* JLPT N5-N4 Card */}
                      <div
                        onClick={() => setDeckType("custom")}
                        className="group flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-zinc-900/50 border border-border/60 hover:border-indigo-500 rounded-2xl cursor-pointer hover:scale-102 hover:shadow-md transition-all duration-300 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 [animation-delay:100ms]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Flame size={24} />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                            JLPT N5-N4
                          </h3>
                          <p className="text-[11px] text-muted mt-1.5 leading-normal">
                            Kaishi 1.5k Indonesian deck with native
                            pronunciations, sentences, and illustrations.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full mt-2 font-bold pointer-events-none group-hover:bg-indigo-600 group-hover:text-white"
                        >
                          Select Deck
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
                    {/* Switcher Mode Belajar */}
                    <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                      <button
                        type="button"
                        onClick={() => setAnkiMode("srs")}
                        className={[
                          "flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                          ankiMode === "srs"
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        SRS Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnkiMode("quick")}
                        className={[
                          "flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                          ankiMode === "quick"
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        Quick Review
                      </button>
                    </div>

                    {/* Toggle Arah Review */}
                    <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-4">
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-xs font-bold text-foreground">
                          Reverse mode (write the kanji)
                        </Label>
                        <span className="text-[10px] text-muted leading-tight">
                          Show furigana and write the kanji to flip the card.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleReviewDirectionChange(
                            reviewDirection === "normal" ? "reverse" : "normal",
                          )
                        }
                        className={[
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          reviewDirection === "reverse"
                            ? "bg-indigo-600"
                            : "bg-slate-200 dark:bg-zinc-800",
                        ].join(" ")}
                        role="switch"
                        aria-checked={reviewDirection === "reverse"}
                      >
                        <span
                          className={[
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            reviewDirection === "reverse"
                              ? "translate-x-5"
                              : "translate-x-0",
                          ].join(" ")}
                        />
                      </button>
                    </div>

                    {deckType === "dekiru" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Filter Bab */}
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-semibold text-muted block mb-1.5">
                            {t.ankiFilterChapter || "Filter Bab"}
                          </Label>
                          <Popover>
                            <Popover.Trigger>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted/50 focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px] text-left"
                              >
                                <span className="truncate">
                                  {selectedChaptersText}
                                </span>
                                <span className="text-muted ml-2 text-xs">
                                  ▼
                                </span>
                              </button>
                            </Popover.Trigger>
                            <Popover.Content
                              placement="bottom start"
                              className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50"
                            >
                              <Popover.Dialog className="outline-none">
                                <ListBox
                                  selectionMode="multiple"
                                  selectedKeys={filterChapters}
                                  onSelectionChange={
                                    handleChapterSelectionChange
                                  }
                                >
                                  <ListBox.Item
                                    id="all"
                                    textValue={t.ankiAllChapters || "Semua Bab"}
                                    className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none"
                                  >
                                    {t.ankiAllChapters || "Semua Bab"}
                                    <ListBox.ItemIndicator />
                                  </ListBox.Item>
                                  {Array.from({ length: 15 }, (_, i) => {
                                    const chapNum = String(i + 1);
                                    const title = `Chapter ${chapNum} — ${dekiruGroups[i]?.title || ""}`;
                                    return (
                                      <ListBox.Item
                                        key={chapNum}
                                        id={chapNum}
                                        textValue={title}
                                        className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none"
                                      >
                                        {title}
                                        <ListBox.ItemIndicator />
                                      </ListBox.Item>
                                    );
                                  })}
                                </ListBox>
                              </Popover.Dialog>
                            </Popover.Content>
                          </Popover>
                        </div>

                        {/* Filter Poin */}
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-semibold text-muted block mb-1.5">
                            {t.ankiFilterPoint || "Filter Poin"}
                          </Label>
                          <Popover>
                            <Popover.Trigger>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted/50 focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px] text-left"
                              >
                                <span className="truncate">
                                  {selectedPointsText}
                                </span>
                                <span className="text-muted ml-2 text-xs">
                                  ▼
                                </span>
                              </button>
                            </Popover.Trigger>
                            <Popover.Content
                              placement="bottom start"
                              className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50"
                            >
                              <Popover.Dialog className="outline-none">
                                <ListBox
                                  selectionMode="multiple"
                                  selectedKeys={filterPoints}
                                  onSelectionChange={handlePointSelectionChange}
                                >
                                  <ListBox.Item
                                    id="all"
                                    textValue={t.ankiAllPoints || "Semua Poin"}
                                    className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none"
                                  >
                                    {t.ankiAllPoints || "Semua Poin"}
                                    <ListBox.ItemIndicator />
                                  </ListBox.Item>
                                  {availablePointsOptions.map((opt) => (
                                    <ListBox.Item
                                      key={opt.id}
                                      id={opt.id}
                                      textValue={opt.title}
                                      className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none"
                                    >
                                      {opt.title}
                                      <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                  ))}
                                </ListBox>
                              </Popover.Dialog>
                            </Popover.Content>
                          </Popover>
                        </div>
                      </div>
                    )}

                    {/* Inline settings removed (moved to settings modal) */}

                    {ankiMode === "srs" ? (
                      <>
                        {/* Statistik Kartu Terfilter */}
                        <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                          <div className="rounded-xl bg-surface-muted/50 p-3 text-center border border-border">
                            <p className="text-xs font-bold text-amber-500 tabular-nums">
                              {cardStats.due}
                            </p>
                            <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                              {t.ankiCardDue || "Jatuh Tempo"}
                            </p>
                          </div>
                          <div className="rounded-xl bg-surface-muted/50 p-3 text-center border border-border">
                            <p className="text-xs font-bold text-indigo-500 tabular-nums">
                              {cardStats.newCards}
                            </p>
                            <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                              {t.ankiCardNew || "Baru"}
                            </p>
                          </div>
                        </div>

                        {/* Tombol Mulai Sesi SRS */}
                        <div className="flex flex-row gap-3 border-t border-border pt-4">
                          <Button
                            variant="secondary"
                            className="font-semibold shadow-xs flex-1 text-white bg-amber-500 hover:bg-amber-600 border-none cursor-pointer text-xs sm:text-sm"
                            onClick={() => startSession("due")}
                            isDisabled={cardStats.due === 0}
                          >
                            Review ({cardStats.due})
                          </Button>
                          <Button
                            variant="primary"
                            className="font-semibold shadow-xs flex-1 cursor-pointer text-xs sm:text-sm"
                            onClick={() => startSession("all")}
                            isDisabled={activeVocabularyList.length === 0}
                          >
                            Learn (
                            {Math.min(
                              activeVocabularyList.length,
                              cardStats.due + 20,
                            )}
                            )
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Statistik Quick Memorization */}
                        <div className="rounded-xl bg-surface-muted/50 p-4 text-center border border-border border-t pt-4">
                          <p className="text-xs font-bold text-indigo-500 tabular-nums">
                            {activeVocabularyList.length}
                          </p>
                          <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                            Total words in this chapter/point
                          </p>
                        </div>

                        {/* Tombol Mulai Sesi Quick */}
                        <div className="flex border-t border-border pt-4">
                          <Button
                            variant="primary"
                            className="font-bold shadow-xs w-full cursor-pointer py-5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                            onClick={() => startSession("quick")}
                            isDisabled={activeVocabularyList.length === 0}
                          >
                            Start quick review ({activeVocabularyList.length}{" "}
                            cards)
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Button Pengaturan Anki */}
                    <div className="flex border-t border-border pt-4">
                      <Button
                        variant="secondary"
                        className="font-semibold shadow-xs w-full cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-foreground border border-border"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        Anki Session Settings
                      </Button>
                    </div>

                    {/* Credits (Custom Deck) */}
                    {deckType === "custom" && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-zinc-900/50 border border-border/60 rounded-xl flex flex-col gap-1 shadow-3xs animate-in fade-in duration-300 text-left">
                        <p className="text-[9px] text-muted font-extrabold uppercase tracking-widest">
                          Deck Credits
                        </p>
                        <p className="text-[11px] text-foreground/80 leading-normal">
                          Kaishi 1.5k Translated to Bahasa Indonesia by{" "}
                          <span className="text-indigo-500 font-semibold font-mono">
                            @nihonggowatabemasen
                          </span>
                        </p>
                        <a
                          href="https://ankiweb.net/shared/info/1512066033"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1 mt-0.5 font-bold self-start"
                        >
                          Source: AnkiWeb
                        </a>
                      </div>
                    )}
                  </Card>

                  {/* List Kanji yang Sudah Dipelajari */}
                  <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col gap-1 border-b border-border pb-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        {t.ankiLearnedKanjiTitle || "Learned Kanji List"}
                      </h3>
                      <p className="text-[10px] text-muted">
                        {t.ankiLearnedKanjiDesc ||
                          "Kanji characters from the vocabulary you have learned."}
                      </p>
                    </div>

                    {/* List Grid Kanji */}
                    {learnedVocabKanji.length === 0 ? (
                      <p className="text-xs text-muted text-center py-6">
                        {t.ankiLearnedKanjiEmpty ||
                          "No kanji learned yet. Start reviewing cards to see them here!"}
                      </p>
                    ) : (
                      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                        {learnedVocabKanji.map((k) => (
                          <button
                            key={k.character}
                            type="button"
                            onClick={() =>
                              setSelectedKanji(
                                selectedKanji === k.character
                                  ? null
                                  : k.character,
                              )
                            }
                            className={[
                              "rounded-xl border-2 px-2 py-3 text-center transition-all cursor-pointer font-jp text-xl font-bold leading-none",
                              selectedKanji === k.character
                                ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
                                : "border-border bg-surface text-foreground hover:border-accent/50",
                            ].join(" ")}
                          >
                            {k.character}
                          </button>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )
            ) : (
              /* SESI BELAJAR AKTIF (FLASHCARD INTERAKTIF) */
              <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">
                {/* Progress bar */}
                <div className="w-full flex items-center justify-between gap-4 bg-surface border border-border rounded-xl p-3 shadow-xs">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Progres Sesi: {currentIndex} / {sessionQueue.length}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="font-semibold h-8 min-w-16"
                    onClick={handleCancelSession}
                  >
                    Batal
                  </Button>
                </div>

                {/* Info Card Saat Ini */}
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="soft" color="accent">
                    {currentCard.chapter}
                  </Chip>
                  <Chip size="sm" variant="soft" color="default">
                    Poin {currentCard.sectionIndex + 1}
                  </Chip>
                </div>

                {/* KARTU FLASHCARD DENGAN PERSPEKTIF CSS FLIP */}
                <div
                  className={[
                    "relative w-full transition-all duration-300 [perspective:1000px]",
                    reviewDirection === "reverse" && isWritingActive && !flipped
                      ? "max-w-2xl h-auto min-h-64"
                      : deckType === "custom"
                        ? "max-w-2xl h-80 sm:h-96 md:h-[400px]"
                        : "max-w-2xl h-64",
                    reviewDirection === "normal" ? "cursor-pointer" : "",
                  ].join(" ")}
                  onClick={() =>
                    reviewDirection === "normal" && setFlipped(!flipped)
                  }
                >
                  <div
                    className={[
                      "relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d]",
                      flipped ? "[transform:rotateY(180deg)]" : "",
                    ].join(" ")}
                  >
                    {/* Sisi Depan (Front) */}
                    <div
                      className={[
                        reviewDirection === "reverse" &&
                        isWritingActive &&
                        !flipped
                          ? "relative w-full h-auto bg-surface border border-border rounded-2xl flex flex-col shadow-sm"
                          : "absolute w-full h-full bg-surface border border-border rounded-2xl flex flex-col items-center justify-center shadow-sm overflow-hidden",
                        reviewDirection === "reverse" && isWritingActive
                          ? "p-0"
                          : "p-6",
                      ].join(" ")}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {!isWritingActive && (
                        <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-bold text-muted uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full z-20">
                          Front
                        </span>
                      )}

                      {reviewDirection === "reverse" ? (
                        isWritingActive ? (
                          <div
                            className="w-full h-full flex flex-col justify-between p-4 pt-2.5 sm:p-5 sm:pt-3.5 select-none text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <h2 className="font-jp text-2xl sm:text-3xl font-extrabold text-indigo-500 leading-none">
                                  {currentCard.hiragana}
                                </h2>
                                <p className="text-xs font-semibold text-muted/80 leading-normal whitespace-pre-line">
                                  {currentCard.translation}
                                </p>
                              </div>
                              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase font-black shrink-0">
                                Write Kanji
                              </span>
                            </div>

                            {/* Canvas & Input Area */}
                            <div className="flex-1 flex flex-col justify-center my-2.5 min-h-0">
                              {ankiAnswerChecked && !ankiIsCorrect ? (
                                <div className="flex flex-col gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-500">
                                  <p className="font-extrabold uppercase text-[10px] tracking-wider">
                                    Incorrect!
                                  </p>
                                  <p className="font-semibold">
                                    Your drawing: "{ankiWriteInput.trim()}"
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAnkiAnswerChecked(false);
                                      setAnkiWriteInput("");
                                    }}
                                    className="w-full mt-1.5 py-1.5 bg-foreground text-background font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                                  >
                                    Try Again
                                  </button>
                                </div>
                              ) : ankiIsCorrect ? (
                                <div className="flex flex-col gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-500">
                                  <p className="font-extrabold uppercase text-[10px] tracking-wider">
                                    Spot on!
                                  </p>
                                  <p className="font-semibold">
                                    Correct! Select your score below.
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <HandwritingCanvas
                                    value={ankiWriteInput}
                                    onChange={setAnkiWriteInput}
                                    onSubmit={() =>
                                      checkAnkiAnswer(ankiWriteInput)
                                    }
                                    placeholder="Draw kanji here..."
                                    hintText={(currentCard.kanji !== "-"
                                      ? currentCard.kanji
                                      : currentCard.hiragana
                                    )
                                      .replace(/\s*[\(（].*?[\)）]/g, "")
                                      .trim()}
                                    onUseHint={() => setAnkiUsedHint(true)}
                                  />
                                  <div className="flex items-center gap-2 mt-1 z-20">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        checkAnkiAnswer(ankiWriteInput)
                                      }
                                      disabled={!ankiWriteInput.trim()}
                                      className="flex-1 text-xs font-extrabold py-2 bg-accent hover:bg-accent/90 active:scale-95 text-white rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-3xs"
                                    >
                                      Check Answer
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAnkiUsedHint(true);
                                        setFlipped(true);
                                      }}
                                      className="flex-1 text-xs font-bold py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-muted rounded-xl transition-all cursor-pointer"
                                    >
                                      Show Answer
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex flex-col items-center text-center justify-center w-full h-full gap-3 cursor-pointer hover:bg-surface-muted/10 transition-colors p-6 rounded-2xl"
                            onClick={() => setIsWritingActive(true)}
                          >
                            <h2 className="font-jp text-5xl font-bold leading-none text-indigo-500 select-none">
                              {currentCard.hiragana}
                            </h2>
                            <p className="text-sm font-medium text-muted/80 select-none max-w-xs whitespace-pre-line">
                              {currentCard.translation}
                            </p>

                            <div className="mt-8 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-200 shadow-3xs flex items-center gap-2 font-semibold text-xs">
                              <Pencil size={14} />
                              <span>Click to write the kanji...</span>
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <h2 className="font-jp text-5xl font-bold leading-none text-foreground select-none">
                            {currentCard.kanji === "-"
                              ? currentCard.hiragana
                              : currentCard.kanji}
                          </h2>
                          <p className="mt-8 text-xs text-muted/60 animate-pulse select-none inline-flex items-center gap-1.5">
                            <MousePointerClick size={13} />
                            {t.ankiFlipCard || "Tap card to reveal the answer"}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Sisi Belakang (Back) */}
                    <div
                      className="absolute w-full h-full [transform:rotateY(180deg)] bg-surface border border-border rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-bold text-muted uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 px-2 py-0.5 rounded-full">
                        Back
                      </span>

                      <div className="flex flex-col items-center text-center gap-2 select-none">
                        {reviewDirection === "reverse" ? (
                          <>
                            {/* Target Kanji atau Hiragana */}
                            <div className="flex items-center justify-center gap-2">
                              <h2 className="font-jp text-5xl font-bold leading-none text-foreground select-none">
                                {currentCard.kanji === "-"
                                  ? currentCard.hiragana
                                  : currentCard.kanji}
                              </h2>
                              {deckType === "custom" && currentCard.audio && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playAudio(currentCard.audio!);
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-indigo-500 transition-colors cursor-pointer shrink-0"
                                  title="Play pronunciation"
                                >
                                  <Volume2 size={16} />
                                </button>
                              )}
                            </div>

                            {/* Pembacaan / Hiragana */}
                            {currentCard.kanji !== "-" && (
                              <p className="text-sm font-bold text-muted/80 font-jp mt-2">
                                〔{currentCard.hiragana}〕
                              </p>
                            )}

                            {/* Romaji */}
                            {currentCard.romaji && (
                              <p className="text-xs font-semibold text-indigo-500 font-mono">
                                {currentCard.romaji}
                              </p>
                            )}

                            {/* Arti */}
                            <p className="mt-4 text-md font-medium text-foreground max-w-xs border-t border-border pt-3 whitespace-pre-line">
                              {currentCard.translation}
                            </p>
                          </>
                        ) : (
                          <>
                            {/* Kanji jika ada */}
                            {currentCard.kanji !== "-" && (
                              <h3 className="font-jp text-2xl text-muted">
                                {currentCard.kanji}
                              </h3>
                            )}

                            {/* Hiragana */}
                            <div className="flex items-center justify-center gap-2">
                              <h2 className="font-jp text-4xl font-bold text-foreground">
                                {currentCard.hiragana}
                              </h2>
                              {deckType === "custom" && currentCard.audio && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playAudio(currentCard.audio!);
                                  }}
                                  className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-indigo-500 transition-colors cursor-pointer shrink-0"
                                  title="Play pronunciation"
                                >
                                  <Volume2 size={16} />
                                </button>
                              )}
                            </div>

                            {/* Romaji */}
                            {currentCard.romaji && (
                              <p className="text-xs font-semibold text-indigo-500 font-mono">
                                {currentCard.romaji}
                              </p>
                            )}

                            {/* Arti */}
                            <p className="mt-4 text-md font-medium text-foreground max-w-xs border-t border-border pt-3 whitespace-pre-line">
                              {currentCard.translation}
                            </p>
                          </>
                        )}

                        {/* Audio & Image & Contoh Kalimat (Deck Kustom) */}
                        {deckType === "custom" && (
                          <div className="w-full flex flex-col items-center gap-2 select-none border-t border-border/50 mt-2.5 pt-2">
                            {/* Image */}
                            {currentCard.image && (
                              <div className="max-h-16 max-w-[120px] overflow-hidden rounded-md border border-border/30 shadow-3xs flex items-center justify-center my-0.5">
                                <img
                                  src={`/anki-media/${currentCard.image}`}
                                  alt="Card hint"
                                  className="max-h-16 object-contain select-none pointer-events-none"
                                />
                              </div>
                            )}

                            {/* Contoh Kalimat */}
                            {currentCard.sentence && (
                              <div className="text-center max-w-xl px-4 flex flex-col items-center gap-1.5 mt-2">
                                <div className="flex items-center justify-center gap-2.5">
                                  <p
                                    className="font-jp text-sm sm:text-base font-bold text-foreground leading-normal"
                                    dangerouslySetInnerHTML={{
                                      __html: currentCard.sentence,
                                    }}
                                  />
                                  {currentCard.sentenceAudio && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        playAudio(currentCard.sentenceAudio!);
                                      }}
                                      className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                                      title="Play sentence audio"
                                    >
                                      <Volume2 size={13} />
                                    </button>
                                  )}
                                </div>
                                {currentCard.sentenceTranslation && (
                                  <p className="text-xs sm:text-sm text-muted/80 leading-normal italic whitespace-pre-line">
                                    {currentCard.sentenceTranslation}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRADING BUTTONS (Hanya muncul jika kartu sudah dibalik) */}
                <div className="w-full max-w-2xl flex flex-col gap-2">
                  {flipped &&
                    (ankiMode === "srs" ? (
                      <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Again */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(1);
                          }}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Again</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Forgot
                          </span>
                        </button>

                        {/* Hard */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(2);
                          }}
                          className="flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Hard</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Difficult
                          </span>
                        </button>

                        {/* Good */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(3);
                          }}
                          className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Good</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Normal
                          </span>
                        </button>

                        {/* Easy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(4);
                          }}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Easy</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Very easy
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Tidak Tahu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(false);
                          }}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200"
                        >
                          <span>Don&apos;t know</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Repeat again
                          </span>
                        </button>

                        {/* Sudah Tahu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(true);
                          }}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200"
                        >
                          <span>Know it</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Done
                          </span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Modal Detail Kanji */}
      <Modal
        isOpen={selectedKanji !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKanji(null);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header className="flex items-center justify-between gap-4">
                <Modal.Heading className="flex items-center gap-2">
                  Kanji details
                </Modal.Heading>
                <Button
                  size="sm"
                  variant="secondary"
                  className="font-semibold text-xs border border-border bg-surface hover:bg-surface-muted cursor-pointer shrink-0 py-1 h-7 min-w-0 px-2.5 rounded-lg"
                  onPress={() => setShowReadings(!showReadings)}
                >
                  {showReadings ? "Hide" : "Show"}
                </Button>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                {selectedKanji && selectedKanjiDetail && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border-2 border-indigo-500/30 bg-indigo-500/5 w-14 h-14 flex items-center justify-center">
                        <span className="font-jp text-3xl font-bold text-foreground">
                          {selectedKanji}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          Kanji "{selectedKanji}"
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          Ditemukan di{" "}
                          {(selectedKanjiDetail as any).vocabWords.length}{" "}
                          kosakata yang sedang dipelajari
                        </p>
                      </div>
                    </div>

                    {/* Informasi Kanji dari database static (jika ada) */}
                    {kanjiDbInfo && (
                      <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-surface-muted/35 text-xs animate-in fade-in duration-200">
                        <p className="font-semibold text-muted uppercase tracking-wider text-[9px] mb-1">
                          Informasi Kanji:
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                          <div>
                            <span className="text-muted font-medium block text-[10px]">
                              Kunyomi (訓読み):
                            </span>
                            <span
                              className={[
                                "font-jp font-semibold text-foreground text-xs transition-all duration-200",
                                showReadings ? "" : "blur-sm select-none",
                              ].join(" ")}
                            >
                              {kanjiDbInfo.kunyomi.join(", ") || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted font-medium block text-[10px]">
                              Onyomi (音読み):
                            </span>
                            <span
                              className={[
                                "font-jp font-semibold text-foreground text-xs transition-all duration-200",
                                showReadings ? "" : "blur-sm select-none",
                              ].join(" ")}
                            >
                              {kanjiDbInfo.onyomi || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-border/60 mt-1.5 pt-1.5">
                          <span className="text-muted font-medium block text-[10px]">
                            Arti (Meaning):
                          </span>
                          <span className="font-medium text-foreground text-xs">
                            {lang === "id"
                              ? kanjiDbInfo.meaningId
                              : kanjiDbInfo.meaningEn}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-1 max-h-[300px] overflow-y-auto pr-1">
                      <p className="font-semibold text-muted uppercase tracking-wider text-[9px]">
                        Kosakata Terkait:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {(selectedKanjiDetail as any).vocabWords.map(
                          (v: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex flex-col gap-1 p-2.5 rounded-xl bg-surface-muted/50 border border-border"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-jp font-bold text-sm text-foreground">
                                      {v.word}
                                    </span>
                                    <span
                                      className={[
                                        "font-jp text-xs text-indigo-500 font-semibold transition-all duration-200",
                                        showReadings
                                          ? ""
                                          : "blur-sm select-none",
                                      ].join(" ")}
                                    >
                                      〔{v.reading}〕
                                    </span>
                                  </div>
                                  <span className="text-muted text-[10px]">
                                    {v.meaning}
                                  </span>
                                </div>
                                <div className="flex shrink-0 gap-1 text-[8px] font-bold mt-1">
                                  <span className="bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full">
                                    Rep: {v.reps}
                                  </span>
                                  <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                                    Int: {v.interval} hari
                                  </span>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  slot="close"
                  variant="primary"
                  size="sm"
                  className="font-semibold cursor-pointer"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Modal Sesi Selesai */}
      <Modal
        isOpen={sessionFinished}
        onOpenChange={(open) => {
          if (!open) {
            setSessionQueue([]);
            setSessionFinished(false);
          }
        }}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />
              <Modal.Header className="flex flex-col items-center text-center pt-6">
                <PartyPopper size={44} className="mb-2 text-accent" />
                <Modal.Heading className="font-bold text-foreground text-xl">
                  {t.ankiFinishedTitle || "Session complete"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col items-center text-center gap-4 py-4">
                <p className="text-sm text-muted">
                  {t.ankiFinishedDesc ||
                    "You have reviewed all the cards in this session."}
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
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Modal Pengaturan Anki */}
      <Modal
        isOpen={isSettingsOpen}
        onOpenChange={(open) => setIsSettingsOpen(open)}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Anki Session Settings</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4 text-xs">
                {/* Progress saving mode */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-muted block mb-1">
                    Progress saving mode
                  </Label>
                  <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                    <button
                      type="button"
                      onClick={() => handlePostModeChange("session")}
                      className={[
                        "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        postMode === "session"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      Save when session ends
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostModeChange("card")}
                      className={[
                        "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        postMode === "card"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      Save per card
                    </button>
                  </div>
                </div>

                {/* Daily New Cards Limit */}
                <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                  <Label className="text-xs font-semibold text-muted block mb-1">
                    Daily new cards limit
                  </Label>
                  <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                    {[10, 20, 30].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleNewCardsLimitChange(num)}
                        className={[
                          "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                          dailyNewCardsLimit === num
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Review Limit */}
                <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                  <Label className="text-xs font-semibold text-muted block mb-1">
                    Daily review limit
                  </Label>
                  <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                    {["50", "100", "unlimited"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleReviewLimitChange(val)}
                        className={[
                          "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                          dailyReviewLimit === val
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        {val === "unlimited" ? "Unlimited" : val}
                      </button>
                    ))}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  slot="close"
                  variant="primary"
                  size="sm"
                  className="font-semibold cursor-pointer"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Modal Panduan Penilaian SRS */}
      <Modal isOpen={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-lg">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="flex items-center gap-2">
                  <Lightbulb size={18} />{" "}
                  {t.ankiGuideTitle || "SRS Grading Guide"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-xs leading-relaxed flex flex-col gap-3">
                <p className="text-muted mb-1">
                  {t.ankiGuideDesc ||
                    "Learn how the spaced repetition options affect card intervals."}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                    <span className="shrink-0 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Again
                    </span>
                    <span className="text-foreground">
                      {t.ankiGuideAgain ||
                        "Again: Forgot completely. Repetition count resets to 0, interval resets to 1 day, ease value decreases."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <span className="shrink-0 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Hard
                    </span>
                    <span className="text-foreground">
                      {t.ankiGuideHard ||
                        "Hard: Recalled with difficulty. Interval grows slightly slower (1.2x), ease value decreases slightly."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                    <span className="shrink-0 bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Good
                    </span>
                    <span className="text-foreground">
                      {t.ankiGuideGood ||
                        "Good: Recalled correctly. Interval multiplied by ease value, ease value remains unchanged."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <span className="shrink-0 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Easy
                    </span>
                    <span className="text-foreground">
                      {t.ankiGuideEasy ||
                        "Easy: Recalled effortlessly. Interval multiplied by ease value and bonus (1.3x), ease value increases."}
                    </span>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  slot="close"
                  variant="primary"
                  size="sm"
                  className="font-semibold cursor-pointer"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
