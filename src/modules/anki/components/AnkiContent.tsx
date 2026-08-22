"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  MousePointerClick,
  Lightbulb,
  BookOpen,
  Flame,
  Volume2,
  ArrowLeft,
  Calendar,
  Search,
  Grid,
  List,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  AnkiRecapItem,
  AnkiSessionRecap,
  mergeRecapItem,
  saveSessionRecap,
} from "@/src/modules/anki/lib/sessionRecap";
import { AnkiSessionRecapModal } from "@/src/modules/anki/components/AnkiSessionRecapModal";
import {
  generateSmartDistractors,
  getQuizPrompt,
  getQuizAnswer,
  isCardValidForDirection,
  hasKanji,
  QuizDirection,
  VocabularyCardLike,
} from "@/src/modules/anki/lib/distractorEngine";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { HeaderStudyTimer } from "@/src/modules/study-timer/components/HeaderStudyTimer";
import { KANJI_N5 } from "@/src/helper/kanji-n5";
import { getFsrsPreviewIntervals } from "@/src/modules/anki/lib/fsrsEngine";

interface AnkiContentProps {
  username: string;
}

interface SRSProgress {
  cardKey: string;
  direction: string;
  dueDate: string;
  interval: number;
  repetitions: number;
  ease: number;
  stability?: number;
  difficulty?: number;
  state?: number;
  learningSteps?: number;
  reps?: number;
  lapses?: number;
  scheduledDays?: number;
  elapsedDays?: number;
  lastReview?: string | null;
}

interface VocabularyCard extends VocabularyCardLike {
  audio?: string | null;
  sentence?: string | null;
  sentenceTranslation?: string | null;
  sentenceAudio?: string | null;
  image?: string | null;
}

interface DekiruSection {
  title: string;
  examples?: Array<{
    kanji?: string;
    hiragana?: string;
    romaji?: string;
    translation?: string;
    audio?: string | null;
    sentence?: string | null;
    sentenceTranslation?: string | null;
    sentenceAudio?: string | null;
    image?: string | null;
  }>;
}

interface DekiruGroup {
  chapter: string;
  title: string;
  sections: DekiruSection[];
}

interface SessionCard extends VocabularyCard {
  quizDirection?: QuizDirection;
}

const QUIZ_DIRECTIONS: QuizDirection[] = [
  "kanji_to_reading",
  "kanji_to_meaning",
  "reading_to_meaning",
  "meaning_to_kanji",
];

function quizInstruction(direction: QuizDirection) {
  switch (direction) {
    case "kanji_to_reading":
      return "Choose the correct furigana";
    case "kanji_to_meaning":
    case "reading_to_meaning":
      return "Choose the correct meaning";
    case "meaning_to_kanji":
      return "Choose the correct kanji";
  }
}

function quizDirectionLabel(direction: QuizDirection, card?: VocabularyCardLike) {
  if (direction === "reading_to_meaning") {
    return card && !hasKanji(card) ? "Kana → Arti" : "Furigana → Arti";
  }
  switch (direction) {
    case "kanji_to_reading":
      return "Kanji → Furigana";
    case "kanji_to_meaning":
      return "Kanji → Arti";
    case "meaning_to_kanji":
      return "Arti → Kanji";
  }
}

export function AnkiContent({ username }: AnkiContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckParam = searchParams.get("deck");

  // Settings states with cloud sync support
  const [dekiruGroups, setDekiruGroups] = useState<DekiruGroup[]>([]);
  const [postMode, setPostMode] = useState<"session" | "card">("card");
  const [dailyNewCardsLimit, setDailyNewCardsLimit] = useState<number>(20);
  const [dailyReviewLimit, setDailyReviewLimit] = useState<string>("unlimited");
  const [cardStyle, setCardStyle] = useState<"quiz" | "classic">("quiz");
  const [studyDose, setStudyDose] = useState<"normal" | "intensive">("normal");
  const [ankiMode, setAnkiMode] = useState<"srs" | "quick">("srs");

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Deck filter state
  const [filterChapters, setFilterChapters] = useState<Set<string> | "all">(
    new Set<string>(["all"]),
  );
  const [filterPoints, setFilterPoints] = useState<Set<string> | "all">(
    new Set<string>(["all"]),
  );

  const handleChapterSelectionChange = (keys: unknown) => {
    if (keys === "all") {
      setFilterChapters(new Set(["all"]));
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys as Iterable<string>);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterChapters(set);
    setFilterPoints(new Set(["all"]));
  };

  const handlePointSelectionChange = (keys: unknown) => {
    if (keys === "all") {
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys as Iterable<string>);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterPoints(set);
  };

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

    const chapNumStr = Array.from(filterChapters)[0];
    const chapIdx = parseInt(chapNumStr as string) - 1;
    const chap = dekiruGroups[chapIdx];
    if (!chap) return [];

    return chap.sections.map((sect, sIdx: number) => ({
      id: String(sIdx + 1),
      title: `Point ${sIdx + 1}: ${sect.title}`,
    }));
  }, [filterChapters, dekiruGroups]);

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
          (o) => o.id === String(ptId),
        );
        return opt ? opt.title : `Poin ${ptId}`;
      })
      .join(", ");
  }, [filterPoints, availablePointsOptions, t.ankiAllPoints]);

  // Database Progress Maps
  const [progressMap, setProgressMap] = useState<Record<string, SRSProgress>>(
    {},
  );
  const [directionProgressMap, setDirectionProgressMap] = useState<
    Record<string, SRSProgress>
  >({});

  const [loading, setLoading] = useState<boolean>(true);
  const [deckType, setDeckType] = useState<"dekiru" | "custom" | null>(() => {
    if (
      deckParam === "custom" ||
      deckParam === "n5-n4" ||
      deckParam === "jlpt"
    ) {
      return "custom";
    }
    return null;
  });

  useEffect(() => {
    if (
      deckParam === "custom" ||
      deckParam === "n5-n4" ||
      deckParam === "jlpt"
    ) {
      setDeckType("custom");
    }
  }, [deckParam]);

  const [customCards, setCustomCards] = useState<VocabularyCard[]>([]);

  const playAudio = (filename: string) => {
    const audio = new Audio(`/anki-media/${filename}`);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  // Study Session State
  const [sessionQueue, setSessionQueue] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [pendingStartMode, setPendingStartMode] = useState<
    "due" | "all" | "quick" | null
  >(null);

  const [pendingReviews, setPendingReviews] = useState<
    Array<{
      cardKey: string;
      chapter: string;
      sectionIndex: number;
      rating: number;
      direction: string;
      responseTimeMs?: number;
    }>
  >([]);

  const [gradingScore, setGradingScore] = useState<number | null>(null);
  const [cardStartedAt, setCardStartedAt] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(
    null,
  );
  const [autoRating, setAutoRating] = useState<number | null>(null);
  const [autoResponseTimeMs, setAutoResponseTimeMs] = useState<number | null>(
    null,
  );
  const [currentQuizDirection, setCurrentQuizDirection] =
    useState<QuizDirection>("kanji_to_reading");

  const [sessionRecap, setSessionRecap] = useState<AnkiRecapItem[]>([]);
  const [sessionStartedAt, setSessionStartedAt] = useState<number>(0);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState<boolean>(false);
  const [currentRecapData, setCurrentRecapData] =
    useState<AnkiSessionRecap | null>(null);

  const currentCard = sessionQueue[currentIndex];

  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [showReadings, setShowReadings] = useState<boolean>(false);
  const [isCreditsExpanded, setIsCreditsExpanded] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  // Review Queue List Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewTabFilter, setReviewTabFilter] = useState<"due" | "all">("due");
  const [reviewViewMode, setReviewViewMode] = useState<"kanji" | "cards">(
    "kanji",
  );
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>("");

  // Sync settings helper
  const syncSettingsToCloud = async (updates: Partial<{
    dailyNewCardsLimit: number;
    dailyReviewLimit: string;
    postMode: "session" | "card";
    studyDose: "normal" | "intensive";
    ankiMode: "srs" | "quick";
    cardStyle: "quiz" | "classic";
  }>) => {
    try {
      await fetch("/api/anki/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.warn("Failed to sync settings to cloud:", err);
    }
  };

  const handlePostModeChange = (mode: "session" | "card") => {
    setPostMode(mode);
    localStorage.setItem("anki_post_mode", mode);
    syncSettingsToCloud({ postMode: mode });
  };

  const handleNewCardsLimitChange = (limit: number) => {
    setDailyNewCardsLimit(limit);
    localStorage.setItem("anki_daily_new_limit", String(limit));
    syncSettingsToCloud({ dailyNewCardsLimit: limit });
  };

  const handleReviewLimitChange = (limit: string) => {
    setDailyReviewLimit(limit);
    localStorage.setItem("anki_daily_review_limit", limit);
    syncSettingsToCloud({ dailyReviewLimit: limit });
  };

  const handleCardStyleChange = (style: "quiz" | "classic") => {
    setCardStyle(style);
    localStorage.setItem("anki_card_style", style);
    syncSettingsToCloud({ cardStyle: style });
  };

  const handleStudyDoseChange = (dose: "normal" | "intensive") => {
    setStudyDose(dose);
    localStorage.setItem("anki_study_dose", dose);
    syncSettingsToCloud({ studyDose: dose });
  };

  // Reset showReadings state when selecting a new Kanji
  useEffect(() => {
    if (selectedKanji) {
      setShowReadings(false);
    }
  }, [selectedKanji]);

  // Load progress, curriculum, custom cards, and user settings on initial load
  useEffect(() => {
    async function initAnki() {
      try {
        const [mod, res, customRes, settingsRes] = await Promise.all([
          import("@/src/helper/DekiruNihongoGroup"),
          fetch("/api/anki"),
          fetch("/api/anki/custom-cards?deckName=JLPT N5-N4"),
          fetch("/api/anki/settings"),
        ]);

        setDekiruGroups(mod.DekiruNihongoGroups);

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            const s = settingsData.settings;
            if (s.dailyNewCardsLimit) setDailyNewCardsLimit(s.dailyNewCardsLimit);
            if (s.dailyReviewLimit) setDailyReviewLimit(s.dailyReviewLimit);
            if (s.postMode) setPostMode(s.postMode);
            if (s.studyDose) setStudyDose(s.studyDose);
            if (s.cardStyle) setCardStyle(s.cardStyle);
            if (s.ankiMode) setAnkiMode(s.ankiMode);
          }
        }

        if (res.ok) {
          const json = await res.json();
          const pMap: Record<string, SRSProgress> = {};
          const directionMap: Record<string, SRSProgress> = {};
          (json.progress || []).forEach((item: SRSProgress) => {
            directionMap[`${item.cardKey}:${item.direction}`] = item;
            if (item.direction === "kanji_to_reading") {
              pMap[item.cardKey] = item;
            }
          });
          setProgressMap(pMap);
          setDirectionProgressMap(directionMap);
        }

        if (customRes.ok) {
          const customData = await customRes.json();
          const mapped: VocabularyCard[] = (customData.cards || []).map(
            (card: {
              id: number;
              deckName: string;
              kanji: string;
              hiragana: string;
              romaji?: string;
              translation: string;
              audio?: string | null;
              sentence?: string | null;
              sentenceTranslation?: string | null;
              sentenceAudio?: string | null;
              image?: string | null;
            }) => ({
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

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentIndex]);

  useEffect(() => {
    if (currentCard) {
      setCardStartedAt(Date.now());
      setSelectedQuizAnswer(null);
      setAutoRating(null);
      setAutoResponseTimeMs(null);
    }
  }, [currentCard?.cardKey, currentIndex]);

const getActiveDirections = (dose: "normal" | "intensive"): QuizDirection[] => {
  return dose === "normal"
    ? ["kanji_to_reading", "kanji_to_meaning", "reading_to_meaning"]
    : QUIZ_DIRECTIONS;
};

// Direction candidates selection for each card appearance
  const activeDirections = useMemo(() => {
    return getActiveDirections(studyDose);
  }, [studyDose]);

  useEffect(() => {
    if (!currentCard) return;
    if (currentCard.quizDirection) {
      setCurrentQuizDirection(currentCard.quizDirection);
      return;
    }
    const now = Date.now();
    const candidates = activeDirections
      .filter((direction) => isCardValidForDirection(currentCard, direction))
      .sort((left, right) => {
        const leftProgress =
          directionProgressMap[`${currentCard.cardKey}:${left}`];
        const rightProgress =
          directionProgressMap[`${currentCard.cardKey}:${right}`];
        const leftDue =
          !leftProgress || new Date(leftProgress.dueDate).getTime() <= now;
        const rightDue =
          !rightProgress || new Date(rightProgress.dueDate).getTime() <= now;
        if (leftDue !== rightDue) return leftDue ? -1 : 1;
        return (
          (leftProgress?.repetitions ?? 0) - (rightProgress?.repetitions ?? 0)
        );
      });
    const defaultFallback: QuizDirection = hasKanji(currentCard)
      ? "kanji_to_reading"
      : "reading_to_meaning";
    setCurrentQuizDirection(candidates[0] ?? defaultFallback);
  }, [currentCard?.cardKey, currentIndex, directionProgressMap, activeDirections]);

  // Hide bottom navigation bar during active learning session
  useEffect(() => {
    const isSessionActive = sessionQueue.length > 0 && !sessionFinished;
    if (isSessionActive) {
      document.body.classList.add("hide-bottom-nav");
    } else {
      document.body.classList.remove("hide-bottom-nav");
    }

    return () => {
      document.body.classList.remove("hide-bottom-nav");
    };
  }, [sessionQueue.length, sessionFinished]);

  // Filtered vocabulary based on selected chapter and point
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

    dekiruGroups.forEach((chap, cIdx: number) => {
      const chapterNumber = cIdx + 1;
      if (
        !showAllChaps &&
        filterChapters instanceof Set &&
        !filterChapters.has(String(chapterNumber))
      ) {
        return;
      }

      chap.sections.forEach((sect, sIdx: number) => {
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

  const activeVocabularyList = useMemo(() => {
    return deckType === "dekiru" ? filteredVocabulary : customCards;
  }, [deckType, filteredVocabulary, customCards]);

  const cardHasDueDirection = useCallback(
    (
      card: VocabularyCard,
      now = new Date(),
      directions = activeDirections,
    ) =>
      directions.some((direction) => {
        if (!isCardValidForDirection(card, direction)) return false;
        const progress = directionProgressMap[`${card.cardKey}:${direction}`];
        return Boolean(progress && new Date(progress.dueDate) <= now);
      }),
    [directionProgressMap, activeDirections],
  );

  const cardHasLearningDirection = useCallback(
    (
      card: VocabularyCard,
      now = new Date(),
      directions = activeDirections,
    ) =>
      directions.some((direction) => {
        if (!isCardValidForDirection(card, direction)) return false;
        const progress = directionProgressMap[`${card.cardKey}:${direction}`];
        return Boolean(
          progress &&
            (progress.state === 1 || progress.state === 3) &&
            new Date(progress.dueDate) > now,
        );
      }),
    [directionProgressMap, activeDirections],
  );

  const cardHasNewDirection = useCallback(
    (card: VocabularyCard, directions = activeDirections) =>
      directions.some(
        (direction) =>
          isCardValidForDirection(card, direction) &&
          !directionProgressMap[`${card.cardKey}:${direction}`],
      ),
    [directionProgressMap, activeDirections],
  );

  // Live FSRS intervals preview for Again, Hard, Good, Easy buttons
  const intervalsPreview = useMemo(() => {
    if (!currentCard) {
      return { again: "1m", hard: "6m", good: "10m", easy: "4d" };
    }
    const progress =
      directionProgressMap[`${currentCard.cardKey}:${currentQuizDirection}`];
    return getFsrsPreviewIntervals(progress);
  }, [currentCard?.cardKey, currentQuizDirection, directionProgressMap]);

  // Smart Distractors generated using linguistic similarity & POS matching
  const quizOptions = useMemo(() => {
    if (!currentCard) return [];
    return generateSmartDistractors(
      currentCard,
      currentQuizDirection,
      activeVocabularyList,
    );
  }, [currentCard?.cardKey, activeVocabularyList, currentQuizDirection]);

  // Card stats: Due vs Learning vs New
  const cardStats = useMemo(() => {
    let due = 0;
    let learning = 0;
    let newCards = 0;
    const now = new Date();

    activeVocabularyList.forEach((card) => {
      if (cardHasDueDirection(card, now)) {
        due += 1;
      } else if (cardHasLearningDirection(card, now)) {
        learning += 1;
      } else if (cardHasNewDirection(card)) {
        newCards += 1;
      }
    });

    return { due, learning, newCards };
  }, [
    activeVocabularyList,
    cardHasDueDirection,
    cardHasLearningDirection,
    cardHasNewDirection,
  ]);

  // Kanji & Review Queue breakdown for review modal
  const reviewQueueKanji = useMemo(() => {
    const kanjiMap = new Map<
      string,
      {
        character: string;
        isDueNow: boolean;
        dueWordsCount: number;
        totalWordsCount: number;
        earliestDueDate: Date;
        vocabWords: Array<{
          cardKey: string;
          word: string;
          reading: string;
          meaning: string;
          chapter: string;
          sectionIndex: number;
          reps: number;
          interval: number;
          dueDate: Date;
          isDueNow: boolean;
        }>;
      }
    >();

    const now = new Date();

    activeVocabularyList.forEach((card) => {
      const prog =
        progressMap[card.cardKey] ||
        activeDirections
          .map((d) => directionProgressMap[`${card.cardKey}:${d}`])
          .find(Boolean);
      if (!prog) return;

      const dueDate = new Date(prog.dueDate);
      const isDueNow = dueDate <= now;
      const kanjiWord = card.kanji;
      const hiragana = card.hiragana;
      const meaning = card.translation;

      if (kanjiWord && kanjiWord !== "-") {
        for (let i = 0; i < kanjiWord.length; i++) {
          const char = kanjiWord[i];
          if (/[\u4e00-\u9faf]/.test(char)) {
            if (!kanjiMap.has(char)) {
              kanjiMap.set(char, {
                character: char,
                isDueNow: false,
                dueWordsCount: 0,
                totalWordsCount: 0,
                earliestDueDate: dueDate,
                vocabWords: [],
              });
            }
            const kData = kanjiMap.get(char)!;
            if (isDueNow) {
              kData.isDueNow = true;
              kData.dueWordsCount += 1;
            }
            kData.totalWordsCount += 1;
            if (dueDate < kData.earliestDueDate) {
              kData.earliestDueDate = dueDate;
            }

            if (!kData.vocabWords.some((w) => w.cardKey === card.cardKey)) {
              kData.vocabWords.push({
                cardKey: card.cardKey,
                word: kanjiWord,
                reading: hiragana,
                meaning,
                chapter: card.chapter,
                sectionIndex: card.sectionIndex,
                reps: prog.repetitions,
                interval: prog.interval,
                dueDate,
                isDueNow,
              });
            }
          }
        }
      }
    });

    return Array.from(kanjiMap.values());
  }, [progressMap, activeVocabularyList]);

  const reviewQueueCards = useMemo(() => {
    const now = new Date();
    return activeVocabularyList
      .flatMap((card) =>
        QUIZ_DIRECTIONS.flatMap((direction) => {
          const prog = directionProgressMap[`${card.cardKey}:${direction}`];
          if (!prog || !isCardValidForDirection(card, direction)) return [];
          const dueDate = new Date(prog.dueDate);
          return [
            {
              ...card,
              direction,
              dueDate,
              isDueNow: dueDate <= now,
              reps: prog.repetitions,
              interval: prog.interval,
              ease: prog.ease,
            },
          ];
        }),
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [activeVocabularyList, directionProgressMap]);

  const filteredReviewKanji = useMemo(() => {
    return reviewQueueKanji.filter((item) => {
      if (reviewTabFilter === "due" && !item.isDueNow) return false;

      if (reviewSearchQuery.trim() !== "") {
        const query = reviewSearchQuery.toLowerCase();
        const matchesKanji = item.character.includes(query);
        const matchesVocab = item.vocabWords.some(
          (v) =>
            v.word.toLowerCase().includes(query) ||
            v.reading.toLowerCase().includes(query) ||
            v.meaning.toLowerCase().includes(query),
        );
        return matchesKanji || matchesVocab;
      }

      return true;
    });
  }, [reviewQueueKanji, reviewTabFilter, reviewSearchQuery]);

  const filteredReviewCards = useMemo(() => {
    return reviewQueueCards.filter((card) => {
      if (reviewTabFilter === "due" && !card.isDueNow) return false;

      if (reviewSearchQuery.trim() !== "") {
        const query = reviewSearchQuery.toLowerCase();
        return (
          card.kanji.toLowerCase().includes(query) ||
          card.hiragana.toLowerCase().includes(query) ||
          card.translation.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [reviewQueueCards, reviewTabFilter, reviewSearchQuery]);

  const selectedKanjiDetail = useMemo(() => {
    if (!selectedKanji) return null;
    const fromReview = reviewQueueKanji.find(
      (k) => k.character === selectedKanji,
    );
    if (fromReview) {
      return {
        character: fromReview.character,
        vocabWords: fromReview.vocabWords.map((v) => ({
          word: v.word,
          reading: v.reading,
          meaning: v.meaning,
          reps: v.reps,
          interval: v.interval,
        })),
      };
    }
    return null;
  }, [selectedKanji, reviewQueueKanji]);

  const kanjiDbInfo = useMemo(() => {
    if (!selectedKanji) return null;
    return KANJI_N5.find((k) => k.kanji === selectedKanji) || null;
  }, [selectedKanji]);

  // Start study session
  const startSession = (
    mode: "due" | "all" | "quick",
    dose = studyDose,
  ) => {
    const directions = getActiveDirections(dose);
    let queue: VocabularyCard[] = [];

    if (mode === "quick") {
      queue = [...activeVocabularyList];
    } else {
      const now = new Date();
      if (mode === "due") {
        let dueCards = activeVocabularyList.filter((card) =>
          cardHasDueDirection(card, now, directions),
        );
        if (dailyReviewLimit !== "unlimited") {
          dueCards = dueCards.slice(0, Number(dailyReviewLimit));
        }
        queue = dueCards;
      } else {
        // Mode Learn: hanya kartu baru yang belum pernah dipelajari
        const newCards = activeVocabularyList
          .filter((card) => cardHasNewDirection(card, directions))
          .slice(0, dailyNewCardsLimit);

        queue = newCards;
      }
    }

    queue.sort(() => Math.random() - 0.5);

    setSessionQueue(queue);
    setCurrentIndex(0);
    setFlipped(false);
    setReviewedCount(0);
    setSessionFinished(false);
    setPendingReviews([]);
    setSessionRecap([]);
    setSessionStartedAt(Date.now());
  };

  const deckLabel = useMemo(() => {
    if (deckType === "dekiru") {
      return `Dekiru Nihongo · ${selectedChaptersText}`;
    }
    return customCards[0]?.chapter || "Custom Deck";
  }, [deckType, selectedChaptersText, customCards]);

  const finishSession = (
    recapItems: AnkiRecapItem[],
    totalReviews: number,
  ) => {
    const recapPayload: AnkiSessionRecap = {
      version: 1,
      mode: ankiMode,
      deckLabel,
      direction: "normal",
      startedAt: sessionStartedAt || Date.now(),
      endedAt: Date.now(),
      totalReviews,
      items: recapItems,
    };
    saveSessionRecap(recapPayload);
    setCurrentRecapData(recapPayload);
    setSessionFinished(true);
    setSessionQueue([]);
  };

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
        setProgressMap((prev) => {
          const nextMap = { ...prev };
          const progressList = Array.isArray(json.progress)
            ? json.progress
            : json.progress
              ? [json.progress]
              : [];
          progressList.forEach((item: SRSProgress) => {
            if (item.direction === "kanji_to_reading") {
              nextMap[item.cardKey] = item;
            }
          });
          return nextMap;
        });
        setDirectionProgressMap((prev) => {
          const nextMap = { ...prev };
          const progressList = Array.isArray(json.progress)
            ? json.progress
            : json.progress
              ? [json.progress]
              : [];
          progressList.forEach((item: SRSProgress) => {
            nextMap[`${item.cardKey}:${item.direction}`] = item;
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

  const handleEndSession = async () => {
    if (postMode === "session" && pendingReviews.length > 0) {
      await triggerSaveBatch(pendingReviews);
    }
    finishSession(sessionRecap, reviewedCount);
  };

  const handleQuickAnswer = async (knows: boolean) => {
    if (sessionQueue.length === 0 || gradingScore !== null) return;
    const currentCard = sessionQueue[currentIndex];

    const rating = knows ? 3 : 1;
    setGradingScore(rating);
    try {
      setFlipped(false);
      const nextReviewedCount = reviewedCount + 1;
      setReviewedCount(nextReviewedCount);
      const nextRecap = mergeRecapItem(sessionRecap, currentCard, rating);
      setSessionRecap(nextRecap);

      const cardReview = {
        cardKey: currentCard.cardKey,
        chapter: currentCard.chapter,
        sectionIndex: currentCard.sectionIndex,
        rating,
        direction: currentQuizDirection,
        responseTimeMs: autoResponseTimeMs ?? undefined,
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
        const reQueueCard = {
          ...currentCard,
          quizDirection: currentQuizDirection,
        };
        setSessionQueue((prev) => [...prev, reQueueCard]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        if (currentIndex + 1 >= sessionQueue.length) {
          if (postMode === "session") {
            const nextReviews = [
              ...pendingReviews.filter(
                (r) => r.cardKey !== currentCard.cardKey,
              ),
              cardReview,
            ];
            await triggerSaveBatch(nextReviews);
          }
          finishSession(nextRecap, nextReviewedCount);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } finally {
      setGradingScore(null);
    }
  };

  const handleRateCard = async (rating: number) => {
    if (sessionQueue.length === 0 || gradingScore !== null) return;
    const currentCard = sessionQueue[currentIndex];

    setGradingScore(rating);
    try {
      setFlipped(false);
      const nextReviewedCount = reviewedCount + 1;
      setReviewedCount(nextReviewedCount);
      const nextRecap = mergeRecapItem(sessionRecap, currentCard, rating);
      setSessionRecap(nextRecap);

      const elapsedMs = Math.max(0, Date.now() - cardStartedAt);

      const cardReview = {
        cardKey: currentCard.cardKey,
        chapter: currentCard.chapter,
        sectionIndex: currentCard.sectionIndex,
        rating,
        direction: currentQuizDirection,
        responseTimeMs: elapsedMs,
      };

      if (postMode === "card") {
        await triggerSaveBatch([cardReview], false);
      } else {
        setPendingReviews((prev) => [
          ...prev.filter((r) => r.cardKey !== currentCard.cardKey),
          cardReview,
        ]);
      }

      // FSRS / Anki rule: rating 1 (Again) requeues card to the end of session
      if (rating === 1) {
        const reQueueCard = {
          ...currentCard,
          quizDirection: currentQuizDirection,
        };
        setSessionQueue((prev) => [...prev, reQueueCard]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        if (currentIndex + 1 >= sessionQueue.length) {
          if (postMode === "session") {
            const nextReviews = [
              ...pendingReviews.filter(
                (r) => r.cardKey !== currentCard.cardKey,
              ),
              cardReview,
            ];
            await triggerSaveBatch(nextReviews);
          }
          finishSession(nextRecap, nextReviewedCount);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } finally {
      setGradingScore(null);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (!currentCard || selectedQuizAnswer || gradingScore !== null) return;

    const correct = answer === getQuizAnswer(currentCard, currentQuizDirection);
    const elapsedMs = Math.max(0, Date.now() - cardStartedAt);
    const priorRepetitions =
      directionProgressMap[`${currentCard.cardKey}:${currentQuizDirection}`]
        ?.repetitions ?? 0;

    const rating = !correct
      ? 1
      : priorRepetitions >= 3 && elapsedMs <= 4_000
        ? 4
        : elapsedMs >= 7_000
          ? 2
          : 3;

    setSelectedQuizAnswer(answer);
    setAutoRating(rating);
    setAutoResponseTimeMs(Math.round(elapsedMs));
    setFlipped(true);
  };

  const continueQuiz = useCallback(() => {
    if (autoRating === null || gradingScore !== null) return;
    if (ankiMode === "quick") {
      void handleQuickAnswer(autoRating !== 1);
    } else {
      void handleRateCard(autoRating);
    }
  }, [autoRating, gradingScore, ankiMode]);

  // Keyboard shortcut support (1, 2, 3, 4, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSessionActive =
        sessionQueue.length > 0 && !sessionFinished && currentCard;
      if (!isSessionActive || isSettingsOpen || isGuideOpen || isReviewModalOpen) {
        return;
      }

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (cardStyle === "classic") {
          if (!flipped) {
            setFlipped(true);
          } else if (ankiMode === "quick") {
            void handleQuickAnswer(true);
          } else {
            void handleRateCard(3); // Default Good
          }
        } else if (cardStyle === "quiz") {
          if (flipped && autoRating !== null) {
            continueQuiz();
          }
        }
      } else if (flipped && cardStyle === "classic" && ankiMode === "srs") {
        if (e.key === "1") {
          e.preventDefault();
          void handleRateCard(1);
        } else if (e.key === "2") {
          e.preventDefault();
          void handleRateCard(2);
        } else if (e.key === "3") {
          e.preventDefault();
          void handleRateCard(3);
        } else if (e.key === "4") {
          e.preventDefault();
          void handleRateCard(4);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    sessionQueue.length,
    sessionFinished,
    currentCard,
    flipped,
    cardStyle,
    ankiMode,
    autoRating,
    isSettingsOpen,
    isGuideOpen,
    isReviewModalOpen,
    continueQuiz,
  ]);

  const progressPercentage = useMemo(() => {
    if (sessionQueue.length === 0) return 0;
    return Math.round((currentIndex / sessionQueue.length) * 100);
  }, [currentIndex, sessionQueue]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background px-3 pt-3 pb-24 sm:px-4 sm:pt-6 sm:pb-16">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-sm sm:text-lg font-bold leading-tight text-foreground flex items-center gap-1.5 sm:gap-2 truncate">
                <span>日本語フロー</span>
                <span className="font-sans text-[9px] sm:text-xs bg-indigo-500/10 text-indigo-500 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  Anki · FSRS
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">
                {t.ankiSubtitle || "Spaced Repetition System Flashcards"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {deckType !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setDeckType(null);
                    setSessionQueue([]);
                    setSessionFinished(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-muted text-muted hover:text-foreground transition-colors cursor-pointer text-xs font-bold shrink-0 animate-in fade-in duration-200"
                  title="Change deck"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">Change Deck</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-border bg-surface hover:bg-surface-muted text-foreground cursor-pointer text-sm font-bold shrink-0"
                title="FSRS SRS Scoring Guide"
              >
                <HelpCircle size={15} />
              </button>
              {deckType !== null && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/anki/analytics?deck=${deckType}`)
                  }
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-border bg-surface hover:bg-surface-muted text-foreground cursor-pointer"
                  title="Anki analytics"
                >
                  <Calendar size={15} />
                </button>
              )}
              <HeaderStudyTimer />
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <main className="mt-4 sm:mt-6 flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <Card className="border border-border bg-surface p-4 sm:p-6 shadow-sm flex flex-col gap-6 rounded-2xl">
              <div className="text-center border-b border-border/50 pb-4 flex flex-col items-center gap-1.5">
                <div className="h-5 w-40 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
                <div className="h-3 w-72 bg-border/40 dark:bg-zinc-800/40 rounded-md animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-slate-50/50 dark:bg-zinc-900/20 border border-border/50 rounded-2xl gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-border/40 dark:bg-zinc-800/40"></div>
                  <div className="h-4 w-28 bg-border/40 dark:bg-zinc-800/40 rounded-md"></div>
                </div>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-slate-50/50 dark:bg-zinc-900/20 border border-border/50 rounded-2xl gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-border/40 dark:bg-zinc-800/40"></div>
                  <div className="h-4 w-24 bg-border/40 dark:bg-zinc-800/40 rounded-md"></div>
                </div>
              </div>
            </Card>
          </main>
        ) : (
          <main className="mt-4 sm:mt-6">
            {/* SELEKSI DECK / FILTER (Jika sesi belum aktif) */}
            {sessionQueue.length === 0 || sessionFinished ? (
              deckType === null ? (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <Card className="border border-border bg-surface p-4 sm:p-6 shadow-sm flex flex-col gap-4 sm:gap-6 rounded-2xl">
                    <div className="text-center border-b border-border/50 pb-3 sm:pb-4">
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        Select Study Deck
                      </h2>
                      <p className="text-[11px] sm:text-xs text-muted mt-1">
                        Choose a vocabulary deck to start your flashcard review
                        session with FSRS algorithm.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Dekiru Nihongo Card */}
                      <div
                        onClick={() => setDeckType("dekiru")}
                        className="group flex flex-col items-center text-center p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900/50 border border-border/60 hover:border-indigo-500 rounded-2xl cursor-pointer hover:scale-102 hover:shadow-md transition-all duration-300 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                            Dekiru Nihongo N5
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-muted mt-1 leading-normal">
                            Curriculum vocabulary structured by chapters and
                            points (Chapters 1-15).
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full mt-1.5 sm:mt-2 font-bold pointer-events-none group-hover:bg-indigo-600 group-hover:text-white text-xs"
                        >
                          Select Deck
                        </Button>
                      </div>

                      {/* JLPT N5-N4 Card */}
                      <div
                        onClick={() => setDeckType("custom")}
                        className="group flex flex-col items-center text-center p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900/50 border border-border/60 hover:border-indigo-500 rounded-2xl cursor-pointer hover:scale-102 hover:shadow-md transition-all duration-300 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 [animation-delay:100ms]"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Flame size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                            JLPT N5-N4
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-muted mt-1 leading-normal">
                            Kaishi 1.5k deck with native audio pronunciations,
                            sentences, and illustrations.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full mt-1.5 sm:mt-2 font-bold pointer-events-none group-hover:bg-indigo-600 group-hover:text-white text-xs"
                        >
                          Select Deck
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <Card className="border border-border bg-surface p-4 sm:p-6 shadow-sm flex flex-col gap-4 sm:gap-6 rounded-2xl">
                    {/* Switcher Mode Belajar: SRS vs Practice All */}
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
                        Adaptive Review (FSRS)
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
                        Practice All Cards
                      </button>
                    </div>

                    {/* Filter Bab & Poin untuk Dekiru */}
                    {deckType === "dekiru" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    textValue={
                                      t.ankiAllChapters || "Semua Bab"
                                    }
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

                    {/* Mode Belajar & Limit Stats */}
                    {ankiMode === "srs" ? (
                      <>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-border pt-4">
                          <div className="rounded-xl bg-surface-muted/50 p-2.5 sm:p-3 text-center border border-border">
                            <p className="text-xs sm:text-sm font-bold text-amber-500 tabular-nums">
                              {cardStats.due}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                              {t.ankiCardDue || "Due"}
                            </p>
                          </div>
                          <div className="rounded-xl bg-surface-muted/50 p-2.5 sm:p-3 text-center border border-border">
                            <p className="text-xs sm:text-sm font-bold text-orange-500 tabular-nums">
                              {cardStats.learning}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                              Learning
                            </p>
                          </div>
                          <div className="rounded-xl bg-surface-muted/50 p-2.5 sm:p-3 text-center border border-border">
                            <p className="text-xs sm:text-sm font-bold text-indigo-500 tabular-nums">
                              {cardStats.newCards}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                              {t.ankiCardNew || "New"}
                            </p>
                          </div>
                        </div>

                        {/* Tombol Mulai Sesi SRS */}
                        <div className="flex flex-col gap-2 border-t border-border pt-4">
                          <div className="flex flex-row gap-3">
                            <Button
                              variant="secondary"
                              className="font-semibold shadow-xs flex-1 text-white bg-amber-500 hover:bg-amber-600 border-none cursor-pointer text-xs sm:text-sm"
                              onClick={() => setPendingStartMode("due")}
                              isDisabled={cardStats.due === 0}
                            >
                              Review ({cardStats.due})
                            </Button>
                            <Button
                              variant="primary"
                              className="font-semibold shadow-xs flex-1 cursor-pointer text-xs sm:text-sm"
                              onClick={() => setPendingStartMode("all")}
                              isDisabled={cardStats.newCards === 0}
                            >
                              Learn ({Math.min(cardStats.newCards, dailyNewCardsLimit)})
                            </Button>
                          </div>
                          <Button
                            variant="secondary"
                            className="font-semibold shadow-xs w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer text-xs py-2"
                            onClick={() => setIsReviewModalOpen(true)}
                          >
                            <Eye size={14} />
                            {t.ankiViewReviewList || "Lihat List Review"} (
                            {cardStats.due})
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl bg-surface-muted/50 p-4 text-center border border-border border-t pt-4">
                          <p className="text-xs font-bold text-indigo-500 tabular-nums">
                            {activeVocabularyList.length}
                          </p>
                          <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                            Total words in this chapter/point
                          </p>
                        </div>

                        <div className="flex border-t border-border pt-4">
                          <Button
                            variant="primary"
                            className="font-bold shadow-xs w-full cursor-pointer py-5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                            onClick={() => setPendingStartMode("quick")}
                            isDisabled={activeVocabularyList.length === 0}
                          >
                            Practice all cards ({activeVocabularyList.length}{" "}
                            cards)
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Button Pengaturan Anki */}
                    <div className="flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
                      <Button
                        variant="secondary"
                        className="font-semibold shadow-xs flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-foreground border border-border"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        Anki Settings ({cardStyle === "quiz" ? "Quiz Mode" : "Classic Flashcard"})
                      </Button>
                    </div>

                    {/* Credits (Custom Deck) */}
                    {deckType === "custom" && (
                      <div className="mt-4 border border-border/60 rounded-xl overflow-hidden shadow-3xs transition-all duration-300">
                        <button
                          type="button"
                          onClick={() =>
                            setIsCreditsExpanded(!isCreditsExpanded)
                          }
                          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/30 hover:bg-slate-100 dark:hover:bg-zinc-900/50 transition-colors text-left select-none cursor-pointer"
                        >
                          <span className="text-[10px] text-muted font-extrabold uppercase tracking-widest">
                            Deck Credits
                          </span>
                          <span className="text-muted">
                            {isCreditsExpanded ? (
                              <ChevronUp size={12} strokeWidth={2.5} />
                            ) : (
                              <ChevronDown size={12} strokeWidth={2.5} />
                            )}
                          </span>
                        </button>
                        {isCreditsExpanded && (
                          <div className="p-3 pt-1 border-t border-border/40 bg-slate-50/50 dark:bg-zinc-900/10 flex flex-col gap-1.5 animate-in fade-in duration-200 text-left">
                            <p className="text-[11px] text-foreground/80 leading-normal mt-1">
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
                      </div>
                    )}
                  </Card>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/anki/analytics?deck=${deckType}`)
                    }
                    className="w-full rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 text-left transition-colors hover:bg-indigo-500/10"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Calendar size={18} className="text-indigo-500" /> Anki
                      Analytics & FSRS Progress
                    </span>
                    <span className="mt-1 block text-[10px] text-muted">
                      View scheduled kanji, review words, accuracy, and
                      forgetting curve stability.
                    </span>
                  </button>
                </div>
              )
            ) : (
              /* SESI BELAJAR AKTIF */
              <div className="flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in duration-200 w-full">
                {/* Progress bar */}
                <div className="w-full flex items-center justify-between gap-3 bg-surface border border-border rounded-xl p-2.5 sm:p-3 shadow-xs">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                        Progress: {currentIndex} / {sessionQueue.length}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-500">
                        {cardStyle === "quiz" ? "Quiz (Auto-Score)" : "Classic (Self-Rate)"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-indigo-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="font-semibold h-7 sm:h-8 min-w-16 sm:min-w-20 cursor-pointer text-xs"
                    onClick={handleEndSession}
                  >
                    {t.ankiEndSession || "End"}
                  </Button>
                </div>

                {/* Info Card Saat Ini */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  <Chip size="sm" variant="soft" color="accent" className="text-[10px] h-5 sm:h-6">
                    {currentCard.chapter}
                  </Chip>
                  <Chip size="sm" variant="soft" color="default" className="text-[10px] h-5 sm:h-6">
                    Point {currentCard.sectionIndex + 1}
                  </Chip>
                  <Chip size="sm" variant="soft" color="accent" className="text-[10px] h-5 sm:h-6">
                    {quizDirectionLabel(currentQuizDirection, currentCard)}
                  </Chip>
                </div>

                {/* KARTU FLASHCARD */}
                <div
                  className={[
                    "relative w-full bg-surface border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 flex flex-col cursor-pointer",
                    deckType === "custom"
                      ? "max-w-2xl h-auto min-h-72 sm:min-h-96 md:min-h-[400px]"
                      : "max-w-2xl min-h-56 sm:h-64",
                  ].join(" ")}
                  onClick={() => {
                    if (cardStyle === "classic") {
                      if (!flipped) setFlipped(true);
                    } else if (cardStyle === "quiz") {
                      if (flipped && selectedQuizAnswer && autoRating !== null) {
                        continueQuiz();
                      }
                    }
                  }}
                >
                  <div className="relative w-full flex-1 min-h-0 flex flex-col justify-between p-4 sm:p-6 select-none">
                    {/* Badge Question / Answer */}
                    <span className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4 text-[9px] sm:text-[10px] font-bold text-muted uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full z-20 transition-all duration-300">
                      {flipped ? "Answer" : "Question"}
                    </span>

                    {/* MAIN CONTENT CONTAINER */}
                    <div className="flex-1 flex flex-col justify-center items-center w-full h-full relative py-2">
                      {/* 1. Prompt Word Text */}
                      <div
                        className={[
                          "transition-all duration-500 ease-in-out flex items-center justify-center gap-2",
                          flipped
                            ? "absolute top-1 sm:top-4 scale-75 opacity-90"
                            : "scale-100 opacity-100",
                        ].join(" ")}
                      >
                        <h2 className="font-jp text-3xl sm:text-5xl font-extrabold text-foreground text-center">
                          {getQuizPrompt(currentCard, currentQuizDirection)}
                        </h2>
                        {flipped &&
                          deckType === "custom" &&
                          currentCard.audio && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(currentCard.audio!);
                              }}
                              className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-indigo-500 transition-all cursor-pointer shrink-0 animate-in fade-in duration-300"
                              title="Play pronunciation"
                            >
                              <Volume2 size={15} />
                            </button>
                          )}
                      </div>

                      {/* MULTIPLE CHOICE OPTIONS (Only in Quiz Mode when Front) */}
                      {!flipped && cardStyle === "quiz" && (
                        <div className="mt-4 sm:mt-6 w-full max-w-md flex flex-col items-center gap-2.5">
                          <p className="text-[11px] sm:text-xs font-semibold text-muted/70 tracking-wide text-center">
                            {quizInstruction(currentQuizDirection)}
                          </p>
                          <div className="grid w-full grid-cols-1 gap-2 px-1 sm:px-2 sm:grid-cols-2">
                            {quizOptions.map((option) => {
                              const isSelected = selectedQuizAnswer === option;
                              const isCorrect =
                                option ===
                                getQuizAnswer(currentCard, currentQuizDirection);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={selectedQuizAnswer !== null}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleQuizAnswer(option);
                                  }}
                                  className={[
                                    "rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 font-jp text-base sm:text-lg font-bold transition-colors disabled:cursor-default cursor-pointer",
                                    isSelected
                                      ? isCorrect
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : "border-rose-500 bg-rose-500 text-white"
                                      : "border-border bg-surface-muted/40 text-foreground hover:border-indigo-500 hover:bg-indigo-500/10",
                                  ].join(" ")}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. REVEALED CONTENT */}
                      <div
                        className={[
                          "w-full flex flex-col items-center text-center transition-all duration-500 ease-out",
                          flipped
                            ? "opacity-100 translate-y-0 pointer-events-auto mt-12 sm:mt-16"
                            : "opacity-0 translate-y-6 pointer-events-none absolute inset-0 flex items-center justify-center",
                        ].join(" ")}
                      >
                        {flipped && (
                          <div className="w-full flex flex-col items-center gap-2">
                            {cardStyle === "quiz" && selectedQuizAnswer && (
                              <span
                                className={[
                                  "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide",
                                  selectedQuizAnswer ===
                                  getQuizAnswer(
                                    currentCard,
                                    currentQuizDirection,
                                  )
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                                ].join(" ")}
                              >
                                {selectedQuizAnswer ===
                                getQuizAnswer(
                                  currentCard,
                                  currentQuizDirection,
                                )
                                  ? "Correct"
                                  : `Correct answer: ${getQuizAnswer(currentCard, currentQuizDirection)}`}
                              </span>
                            )}

                            {/* Hiragana reading */}
                            {currentCard.kanji !== "-" && (
                              <h3 className="font-jp text-xl sm:text-2xl text-indigo-500 font-bold">
                                {currentCard.hiragana}
                              </h3>
                            )}

                            {/* Romaji */}
                            {currentCard.romaji && (
                              <p className="text-xs font-semibold text-indigo-500 font-mono">
                                {currentCard.romaji}
                              </p>
                            )}

                            {/* Translation */}
                            <p className="mt-2 text-sm sm:text-base font-medium text-foreground max-w-md border-t border-border/50 pt-2.5 whitespace-pre-line leading-relaxed">
                              {currentCard.translation}
                            </p>

                            {/* Custom Deck Extra Media (Image & Sentences) */}
                            {deckType === "custom" && (
                              <div className="w-full flex flex-col items-center gap-2 mt-2 pt-2 border-t border-border/30">
                                {currentCard.image && (
                                  <div className="relative max-h-16 max-w-[120px] aspect-square rounded-md overflow-hidden border border-border/30 shadow-3xs flex items-center justify-center my-0.5 animate-in fade-in duration-300">
                                    {isImageLoading && (
                                      <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
                                        <div className="h-6 w-6 rounded bg-slate-200/50 dark:bg-zinc-700/50"></div>
                                      </div>
                                    )}
                                    <img
                                      src={`/anki-media/${currentCard.image}`}
                                      alt="Card hint"
                                      className={[
                                        "max-h-16 object-contain select-none pointer-events-none transition-opacity duration-300",
                                        isImageLoading
                                          ? "opacity-0"
                                          : "opacity-100",
                                      ].join(" ")}
                                      onLoad={() => setIsImageLoading(false)}
                                    />
                                  </div>
                                )}

                                {currentCard.sentence && (
                                  <div className="text-center max-w-xl px-4 flex flex-col items-center gap-1">
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
                                            playAudio(
                                              currentCard.sentenceAudio!,
                                            );
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
                        )}
                      </div>

                      {/* 3. FLIP HINT (Only for Classic Mode) */}
                      {!flipped && cardStyle === "classic" && (
                        <p className="absolute bottom-2 text-xs text-muted/50 animate-pulse select-none inline-flex items-center gap-1.5 transition-all duration-300">
                          <MousePointerClick size={13} />
                          Click card or press Space to show answer
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* GRADING BUTTONS (For Classic Mode & Quick Mode) */}
                <div className="w-full max-w-2xl flex flex-col gap-2">
                  {flipped && cardStyle === "classic" && (
                    ankiMode === "srs" ? (
                      <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Again */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(1);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span className="text-[11px] font-bold">
                            {gradingScore === 1 ? "Saving..." : "Again (1)"}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90 mt-0.5 tabular-nums">
                            {intervalsPreview.again}
                          </span>
                        </button>

                        {/* Hard */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(2);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span className="text-[11px] font-bold">
                            {gradingScore === 2 ? "Saving..." : "Hard (2)"}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90 mt-0.5 tabular-nums">
                            {intervalsPreview.hard}
                          </span>
                        </button>

                        {/* Good */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(3);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span className="text-[11px] font-bold">
                            {gradingScore === 3 ? "Saving..." : "Good (3)"}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90 mt-0.5 tabular-nums">
                            {intervalsPreview.good}
                          </span>
                        </button>

                        {/* Easy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(4);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span className="text-[11px] font-bold">
                            {gradingScore === 4 ? "Saving..." : "Easy (4)"}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90 mt-0.5 tabular-nums">
                            {intervalsPreview.easy}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(false);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span>
                            {gradingScore === 1 ? "Saving..." : "Don't know"}
                          </span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Repeat again
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(true);
                          }}
                          disabled={gradingScore !== null}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <span>
                            {gradingScore === 2 ? "Saving..." : "Know it"}
                          </span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Done
                          </span>
                        </button>
                      </div>
                    )
                  )}
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
                          Kanji &quot;{selectedKanji}&quot;
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          Ditemukan di{" "}
                          {selectedKanjiDetail.vocabWords.length}{" "}
                          kosakata yang sedang dipelajari
                        </p>
                      </div>
                    </div>

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
                        {selectedKanjiDetail.vocabWords.map(
                          (v, idx: number) => (
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

      {/* Modal Pilih Study Dose */}
      <Modal
        isOpen={pendingStartMode !== null}
        onOpenChange={(open) => !open && setPendingStartMode(null)}
      >
        <Modal.Backdrop className="flex items-center justify-center p-4">
          <Modal.Container className="flex items-center justify-center min-h-screen w-screen p-4">
            <Modal.Dialog className="sm:max-w-md w-full max-w-sm m-auto rounded-3xl">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Choose study dose</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-3 text-xs">
                <p className="text-muted">
                  Normal focuses on two core directions. Intensive practices all
                  four directions.
                </p>
                {(["normal", "intensive"] as const).map((dose) => (
                  <button
                    key={dose}
                    type="button"
                    onClick={() => {
                      handleStudyDoseChange(dose);
                      if (pendingStartMode)
                        startSession(pendingStartMode, dose);
                      setPendingStartMode(null);
                    }}
                    className={[
                      "rounded-xl border p-4 text-left transition-colors cursor-pointer",
                      dose === "normal"
                        ? "border-indigo-500/40 hover:bg-indigo-500/5"
                        : "border-amber-500/40 hover:bg-amber-500/5",
                    ].join(" ")}
                  >
                    <span className="block font-bold text-foreground">
                      {dose === "normal"
                        ? "Normal · Core directions"
                        : "Intensive · 4 directions"}
                    </span>
                    <span className="mt-1 block text-muted">
                      {dose === "normal"
                        ? "Kanji → Furigana/Arti, atau Kana → Arti"
                        : "Includes Furigana → Arti and Arti → Kanji"}
                    </span>
                  </button>
                ))}
              </Modal.Body>
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
          <Modal.Container className="flex items-center justify-center min-h-screen w-screen">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Anki Session Settings</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4 text-xs">
                {/* Card Style / Mode Belajar */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-muted block mb-1">
                    Card Style / Review Mode
                  </Label>
                  <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                    <button
                      type="button"
                      onClick={() => handleCardStyleChange("quiz")}
                      className={[
                        "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        cardStyle === "quiz"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      Multiple Choice (Quiz)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCardStyleChange("classic")}
                      className={[
                        "flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        cardStyle === "classic"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      Classic (Flip & Rate)
                    </button>
                  </div>
                  <p className="text-[10px] text-muted">
                    {cardStyle === "quiz"
                      ? "4 options with automatic scoring by response time."
                      : "Flip flashcard manually and self-rate (Again, Hard, Good, Easy)."}
                  </p>
                </div>

                {/* Progress saving mode */}
                <div className="flex flex-col gap-1.5 border-t border-border pt-3">
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

      {/* Modal Panduan Penilaian SRS FSRS */}
      <Modal isOpen={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <Modal.Backdrop>
          <Modal.Container className="flex items-center justify-center min-h-screen w-screen">
            <Modal.Dialog className="sm:max-w-lg">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="flex items-center gap-2">
                  <Lightbulb size={18} /> FSRS Spaced Repetition Guide
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-xs leading-relaxed flex flex-col gap-3">
                <p className="text-muted mb-1">
                  This app uses <strong>FSRS (Free Spaced Repetition Scheduler)</strong>,
                  which dynamically estimates memory stability and difficulty
                  without falling into &quot;Ease Hell&quot;.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                    <span className="shrink-0 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Again (1)
                    </span>
                    <span className="text-foreground">
                      Forgot the word. The card enters relearning and repeats in
                      this session.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <span className="shrink-0 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Hard (2)
                    </span>
                    <span className="text-foreground">
                      Remembered with effort. Interval increases moderately.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                    <span className="shrink-0 bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Good (3)
                    </span>
                    <span className="text-foreground">
                      Remembered naturally. Interval expands based on memory
                      stability.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <span className="shrink-0 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Easy (4)
                    </span>
                    <span className="text-foreground">
                      Instant recall. Receives an Easy stability bonus for longer
                      interval.
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

      {/* Modal Full List Kanji & Kosakata Review */}
      <Modal isOpen={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <Modal.Backdrop>
          <Modal.Container className="flex items-center justify-center min-h-screen w-screen p-4">
            <Modal.Dialog className="sm:max-w-2xl w-full">
              <Modal.CloseTrigger />
              <Modal.Header className="flex items-center justify-between">
                <Modal.Heading className="flex items-center gap-2">
                  <Calendar size={20} className="text-amber-500" />
                  {t.ankiReviewQueueTitle || "Kanji & Kosakata Akan Direview"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4 text-xs">
                <p className="text-muted">
                  {t.ankiReviewQueueDesc ||
                    "Daftar karakter Kanji dan kosakata yang terjadwal untuk diulangi (FSRS)."}
                </p>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-muted/40 p-3 rounded-xl border border-border">
                  <div className="flex rounded-lg bg-surface-muted p-1 border border-border">
                    <button
                      type="button"
                      onClick={() => setReviewTabFilter("due")}
                      className={[
                        "px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                        reviewTabFilter === "due"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {t.ankiDueNowTab || "Jatuh Tempo"} (
                      {reviewQueueKanji.filter((k) => k.isDueNow).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewTabFilter("all")}
                      className={[
                        "px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                        reviewTabFilter === "all"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {t.ankiAllScheduledTab || "Semua Terjadwal"} (
                      {reviewQueueKanji.length})
                    </button>
                  </div>

                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="text"
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                      placeholder={
                        t.ankiSearchPlaceholder ||
                        "Cari kanji, pembacaan, atau arti..."
                      }
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex rounded-lg bg-surface-muted p-1 border border-border shrink-0">
                    <button
                      type="button"
                      onClick={() => setReviewViewMode("kanji")}
                      className={[
                        "px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1",
                        reviewViewMode === "kanji"
                          ? "bg-surface text-foreground shadow-xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <Grid size={14} /> Grid Kanji
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewViewMode("cards")}
                      className={[
                        "px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1",
                        reviewViewMode === "cards"
                          ? "bg-surface text-foreground shadow-xs"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <List size={14} /> Daftar Kosakata
                    </button>
                  </div>
                </div>

                {/* Content */}
                {reviewViewMode === "kanji" ? (
                  filteredReviewKanji.length === 0 ? (
                    <div className="text-center py-10 text-muted">
                      {t.ankiReviewQueueEmpty ||
                        "Tidak ada kanji yang terjadwal untuk direview dalam pilihan ini."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[380px] overflow-y-auto p-1">
                      {filteredReviewKanji.map((k) => (
                        <button
                          key={k.character}
                          type="button"
                          onClick={() => {
                            setIsReviewModalOpen(false);
                            setSelectedKanji(k.character);
                          }}
                          className={[
                            "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer group",
                            k.isDueNow
                              ? "border-amber-500/60 bg-amber-500/10 hover:border-amber-500 hover:bg-amber-500/20 shadow-xs"
                              : "border-border bg-surface hover:border-indigo-500/50 hover:bg-indigo-500/5",
                          ].join(" ")}
                        >
                          {k.isDueNow && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                          )}
                          <span className="font-jp text-3xl font-bold text-foreground group-hover:scale-110 transition-transform">
                            {k.character}
                          </span>
                          <span className="text-[9px] font-medium text-muted mt-1 truncate max-w-full">
                            {k.isDueNow
                              ? `${k.dueWordsCount} Due`
                              : "Mendatang"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )
                ) : filteredReviewCards.length === 0 ? (
                  <div className="text-center py-10 text-muted">
                    {t.ankiReviewQueueEmpty ||
                      "Tidak ada kosakata yang terjadwal untuk direview."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto p-1">
                    {filteredReviewCards.map((card, idx) => (
                      <div
                        key={card.cardKey || idx}
                        className={[
                          "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all",
                          card.isDueNow
                            ? "border-amber-500/40 bg-amber-500/5"
                            : "border-border bg-surface-muted/20",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="font-jp text-2xl font-bold text-foreground px-2.5 py-1 bg-surface border border-border rounded-lg shrink-0">
                            {card.kanji}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-jp text-xs font-semibold text-indigo-500">
                                〔{card.hiragana}〕
                              </span>
                              <Chip
                                size="sm"
                                variant="soft"
                                color="default"
                                className="text-[9px] h-4"
                              >
                                {card.chapter}
                              </Chip>
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {card.translation}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {card.isDueNow ? (
                            <span className="px-2.5 py-1 rounded-full font-bold bg-amber-500 text-white flex items-center gap-1 text-[10px]">
                              <Clock size={12} /> Jatuh Tempo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full font-medium bg-slate-200 dark:bg-zinc-800 text-foreground flex items-center gap-1 text-[10px]">
                              <Calendar size={12} />{" "}
                              {card.dueDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="flex items-center justify-between">
                <Button
                  variant="primary"
                  size="sm"
                  className="font-semibold bg-amber-500 hover:bg-amber-600 text-white border-none cursor-pointer"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setPendingStartMode("due");
                  }}
                  isDisabled={cardStats.due === 0}
                >
                  Mulai Review ({cardStats.due})
                </Button>
                <Button
                  slot="close"
                  variant="secondary"
                  size="sm"
                  className="font-semibold cursor-pointer"
                >
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
