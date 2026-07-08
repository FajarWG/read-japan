"use client";

import React, { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  Search,
  Eye,
  EyeOff,
  Award,
  Sparkles,
  Info,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { BUNPOU_DATA, BunpouLesson, BunpouPattern, BunpouExample } from "../data/bunpouData";
import { HandwritingCanvas } from "@/src/shared/components/HandwritingCanvas";
import { 
  getBunpouProgress, 
  toggleBunpouProgress,
  getBunpouQuestions,
  generateBunpouQuestions
} from "../actions/bunpouActions";

interface Question {
  id: number;
  patternId: string;
  english: string;
  indonesian: string;
  sentenceJp: string;
  sentenceKana: string;
  words: string[];
}

/**
 * PracticeArea Sub-component for Sentence Scrambling exercises.
 */
function PracticeArea({ 
  patternId, 
  showFurigana, 
  lang 
}: { 
  patternId: string; 
  showFurigana: boolean; 
  lang: "en" | "id" 
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mode, setMode] = useState<"cards" | "typing">("cards");
  
  // Card mode state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledPool, setShuffledPool] = useState<string[]>([]);
  
  // Typing mode state
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  
  // Answer status
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isGenerating, startTransition] = useTransition();

  // Load questions from database or generate them if empty
  const loadQuestions = useCallback(async (forceGenerate = false) => {
    setLoading(true);
    try {
      let qList: Question[] = [];
      if (forceGenerate) {
        qList = await generateBunpouQuestions(patternId);
      } else {
        qList = await getBunpouQuestions(patternId);
      }
      setQuestions(qList);
      setCurrentIndex(0);
      resetQuestionState(qList[0]);
    } catch (e) {
      console.error("Failed to load questions", e);
    } finally {
      setLoading(false);
    }
  }, [patternId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Reset state for a new question
  const resetQuestionState = (q: Question | undefined) => {
    setSelectedWords([]);
    setTypedAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    if (q) {
      // Shuffle the words pool
      setShuffledPool([...q.words].sort(() => Math.random() - 0.5));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      resetQuestionState(questions[nextIndex]);
    } else {
      // Completed state
      setCurrentIndex(questions.length);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    resetQuestionState(questions[0]);
  };

  const handleCardClick = (word: string, index: number, isSelected: boolean) => {
    if (isAnswered) return;
    if (isSelected) {
      // Remove from selected, return to pool
      setSelectedWords((prev) => prev.filter((_, i) => i !== index));
      setShuffledPool((prev) => [...prev, word]);
    } else {
      // Add to selected, remove from pool
      setSelectedWords((prev) => [...prev, word]);
      setShuffledPool((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const checkAnswer = () => {
    const q = questions[currentIndex];
    if (!q) return;

    // Normalize strings for comparison (remove spaces, periods, commas, question marks)
    const clean = (str: string) => str.replace(/[\s\。\,\.\?？]/g, "");
    const userAnswer = mode === "cards" ? selectedWords.join("") : typedAnswer;
    
    const userClean = clean(userAnswer);
    const correctClean = clean(q.sentenceJp);

    const correct = userClean === correctClean;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleGenerateNew = () => {
    startTransition(async () => {
      await loadQuestions(true);
    });
  };

  const text = {
    en: {
      practiceTitle: "Sentence Practice",
      modeCards: "Cards",
      modeTyping: "Typing",
      hint: "Hint:",
      checkBtn: "Check Answer",
      nextBtn: "Next Question",
      correctText: "Correct! Well done.",
      incorrectText: "Incorrect. Try again or check the correct sentence below:",
      correctSentence: "Correct Sentence:",
      quizFinished: "Practice Completed!",
      quizScore: "Your Score:",
      retryQuiz: "Restart Practice",
      generateBtn: "Generate 10 New Questions (AI)",
      generating: "Generating questions with Gemini...",
      emptyPool: "Click cards to assemble sentence",
      placeholderTyping: "Type the complete Japanese sentence...",
      loading: "Loading questions...",
    },
    id: {
      practiceTitle: "Latihan Menyusun Kalimat",
      modeCards: "Kartu Kata",
      modeTyping: "Ketik Manual",
      hint: "Petunjuk:",
      checkBtn: "Periksa Jawaban",
      nextBtn: "Pertanyaan Selanjutnya",
      correctText: "Benar! Kerja bagus.",
      incorrectText: "Salah. Coba lagi atau lihat kalimat yang benar di bawah:",
      correctSentence: "Kalimat yang Benar:",
      quizFinished: "Latihan Selesai!",
      quizScore: "Skor Anda:",
      retryQuiz: "Ulangi Latihan",
      generateBtn: "Generate 10 Soal Baru (AI)",
      generating: "Membuat soal baru dengan Gemini...",
      emptyPool: "Klik kartu untuk menyusun kata",
      placeholderTyping: "Ketik kalimat bahasa Jepang lengkap...",
      loading: "Memuat soal...",
    }
  }[lang];

  if (loading || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-xs text-muted font-semibold gap-2 select-none">
        <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        <span>{isGenerating ? text.generating : text.loading}</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 border border-border/40 bg-background/50 rounded-xl">
        <p className="text-xs text-muted font-semibold text-center">
          {lang === "en" ? "No questions generated yet." : "Belum ada soal latihan untuk pola ini."}
        </p>
        <button
          onClick={handleGenerateNew}
          className="px-4 py-2 bg-accent text-white font-bold text-xs rounded-xl shadow-xs hover:bg-accent/90 transition-all cursor-pointer"
        >
          {text.generateBtn}
        </button>
      </div>
    );
  }

  // Finished state
  if (currentIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-2xl text-center">
        <h4 className="text-base font-black text-emerald-500">{text.quizFinished}</h4>
        <p className="text-xs font-bold text-foreground">
          {text.quizScore} <span className="text-lg font-black text-accent">{questions.length} / {questions.length}</span>
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
            onClick={handleResetQuiz}
            className="px-4 py-2 border border-border bg-surface text-foreground font-bold text-xs rounded-xl hover:bg-surface-muted transition-all cursor-pointer"
          >
            {text.retryQuiz}
          </button>
          <button
            onClick={handleGenerateNew}
            className="px-4 py-2 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-all cursor-pointer"
          >
            {text.generateBtn}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="flex flex-col gap-4 border border-border/40 bg-background/30 rounded-xl p-4 sm:p-5">
      {/* Exercise Header */}
      <div className="flex items-center justify-between border-b border-border/25 pb-2">
        <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">
          {text.practiceTitle} ({currentIndex + 1}/{questions.length})
        </span>
        
        {/* Toggle Mode */}
        <div className="flex rounded-lg border border-border/50 overflow-hidden bg-background">
          <button
            onClick={() => { setMode("cards"); resetQuestionState(q); }}
            className={`px-2.5 py-1 text-[10px] font-extrabold transition-all cursor-pointer ${mode === "cards" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"}`}
          >
            {text.modeCards}
          </button>
          <button
            onClick={() => { setMode("typing"); resetQuestionState(q); }}
            className={`px-2.5 py-1 text-[10px] font-extrabold transition-all cursor-pointer ${mode === "typing" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"}`}
          >
            {text.modeTyping}
          </button>
        </div>
      </div>

      {/* Translation hint */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-muted uppercase tracking-wider">{text.hint}</span>
        <p className="text-xs font-bold text-foreground leading-relaxed">
          {q.indonesian}
        </p>
      </div>

      {/* Correct answer reading (Furigana representation) displayed after validation */}
      {isAnswered && showFurigana && (
        <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wide mt-2">
          {q.sentenceKana}
        </span>
      )}

      {/* Input / Sorting area */}
      {mode === "cards" ? (
        <div className="flex flex-col gap-3">
          {/* Arrange Zone */}
          <div className="min-h-[52px] p-3 rounded-xl border border-dashed border-border/80 bg-background/50 flex flex-wrap gap-1.5 items-center">
            {selectedWords.length === 0 ? (
              <span className="text-[10px] font-semibold text-muted/65 italic select-none">{text.emptyPool}</span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCardClick(word, idx, true)}
                  disabled={isAnswered}
                  className="px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground font-jp font-bold text-xs shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Scrambled word pool */}
          {!isAnswered && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-border/30 bg-surface/50 justify-center">
              {shuffledPool.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCardClick(word, idx, false)}
                  className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground font-jp font-bold text-xs shadow-3xs hover:-translate-y-0.5 hover:border-accent hover:text-accent transition-all cursor-pointer"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Typing Mode */
        <HandwritingCanvas
          value={typedAnswer}
          onChange={setTypedAnswer}
          onSubmit={checkAnswer}
          placeholder={text.placeholderTyping}
        />
      )}

      {/* Answer evaluation response panel */}
      {isAnswered && (
        <div className={`p-4 rounded-xl border flex flex-col gap-1.5 text-xs font-bold leading-normal mt-2 ${isCorrect ? "bg-emerald-500/[0.03] border-emerald-500/25 text-emerald-600" : "bg-rose-500/[0.03] border-rose-500/25 text-rose-600"}`}>
          <p>{isCorrect ? text.correctText : text.incorrectText}</p>
          {!isCorrect && (
            <div className="mt-1 border-t border-border/25 pt-2 flex flex-col gap-1 text-foreground">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider">{text.correctSentence}</span>
              {showFurigana && (
                <span className="text-[10px] text-muted opacity-75 font-semibold leading-none">{q.sentenceKana}</span>
              )}
              <p className="text-sm font-bold font-jp text-foreground select-all leading-tight">{q.sentenceJp}</p>
            </div>
          )}
        </div>
      )}

      {/* Control panel buttons */}
      <div className="flex flex-wrap gap-2 items-center justify-between mt-2 select-none">
        <button
          onClick={handleGenerateNew}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-border bg-surface text-muted hover:text-foreground font-bold text-[10px] rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw size={12} /> {text.generateBtn}
        </button>

        <div className="flex gap-2">
          {!isAnswered ? (
            <button
              onClick={checkAnswer}
              disabled={mode === "cards" ? selectedWords.length === 0 : !typedAnswer.trim()}
              className="px-4 py-2 bg-accent text-white font-bold text-xs rounded-xl shadow-xs hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {text.checkBtn}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {text.nextBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Bunpou Dashboard.
 */
export function BunpouDashboard() {
  const { lang } = useLanguage();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  
  // Progress State
  const [learnedPatterns, setLearnedPatterns] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Active tab state per pattern ("examples" or "practice")
  const [activeTab, setActiveTab] = useState<Record<string, "examples" | "practice">>({});

  const getActiveTab = (patId: string) => activeTab[patId] || "examples";
  const setActiveTabForPattern = (patId: string, tab: "examples" | "practice") => {
    setActiveTab((prev) => ({ ...prev, [patId]: tab }));
  };

  // Load progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const progress = await getBunpouProgress();
        setLearnedPatterns(progress);
      } catch (e) {
        console.error("Failed to load progress from database", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadProgress();
  }, []);

  // Save progress (optimistic updates)
  const togglePatternLearned = (patternId: string) => {
    setLearnedPatterns((prev) =>
      prev.includes(patternId)
        ? prev.filter((id) => id !== patternId)
        : [...prev, patternId]
    );

    startTransition(async () => {
      try {
        const res = await toggleBunpouProgress(patternId);
        if (!res.success) {
          const progress = await getBunpouProgress();
          setLearnedPatterns(progress);
        }
      } catch (e) {
        console.error("Failed to toggle progress", e);
        const progress = await getBunpouProgress();
        setLearnedPatterns(progress);
      }
    });
  };

  const text = {
    en: {
      title: "Bunpou — Grammar & Particles",
      subtitle: "Study basic textbook structures, particles, adjectives, and expressions (Chapters 1–15).",
      backHome: "Back to Home",
      searchPlaceholder: "Search grammar patterns or keywords...",
      overallProgress: "Textbook Progress",
      learnedCount: "Patterns Learned",
      completed: "Completed",
      learned: "Learned",
      markLearned: "Mark as Learned",
      unmarkLearned: "Mark as Unlearned",
      noResults: "No grammar patterns found matching your search.",
      studyOptions: "Study Options",
      furigana: "Furigana",
      chapterBadge: "Chapter",
      allChapters: "All Chapters",
      chapterTitle: "Chapter",
      examplesTab: "Examples",
      practiceTab: "Practice",
    },
    id: {
      title: "Bunpou (文法)",
      subtitle: "Tata Bahasa & Partikel",
      backHome: "Kembali ke Beranda",
      searchPlaceholder: "Cari pola tata bahasa atau kata kunci...",
      overallProgress: "Progres Buku Pelajaran",
      learnedCount: "Pola Dipelajari",
      completed: "Selesai",
      learned: "Sudah Dipelajari",
      markLearned: "Tandai Sudah Dipelajari",
      unmarkLearned: "Hapus Tanda Dipelajari",
      noResults: "Tidak ada pola tata bahasa yang cocok dengan pencarian Anda.",
      studyOptions: "Opsi Belajar",
      furigana: "Furigana",
      chapterBadge: "Bab",
      allChapters: "Semua Bab",
      chapterTitle: "Bab",
      examplesTab: "Contoh Kalimat",
      practiceTab: "Latihan",
    }
  }[lang];

  // Calculate stats
  const totalPatternsCount = useMemo(() => {
    return BUNPOU_DATA.reduce((acc, lesson) => acc + lesson.patterns.length, 0);
  }, []);

  const completionPercentage = useMemo(() => {
    if (totalPatternsCount === 0) return 0;
    return Math.round((learnedPatterns.length / totalPatternsCount) * 100);
  }, [learnedPatterns, totalPatternsCount]);

  const chapterStats = useMemo(() => {
    const stats: Record<number, { total: number; learned: number }> = {};
    BUNPOU_DATA.forEach((lesson) => {
      const total = lesson.patterns.length;
      const learned = lesson.patterns.filter((p) => learnedPatterns.includes(p.id)).length;
      stats[lesson.chapter] = { total, learned };
    });
    return stats;
  }, [learnedPatterns]);

  // Filter lessons based on active chapter or search query
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) {
      return BUNPOU_DATA.filter((lesson) => lesson.chapter === selectedChapter);
    }

    const query = searchQuery.toLowerCase();
    return BUNPOU_DATA.map((lesson) => {
      const matchingPatterns = lesson.patterns.filter(
        (p) =>
          p.pattern.toLowerCase().includes(query) ||
          p.descEn.toLowerCase().includes(query) ||
          p.descId.toLowerCase().includes(query) ||
          (p.examples && p.examples.some((ex) =>
            ex.exampleJp.toLowerCase().includes(query) ||
            ex.exampleEn.toLowerCase().includes(query) ||
            ex.exampleId.toLowerCase().includes(query)
          ))
      );

      return {
        ...lesson,
        patterns: matchingPatterns,
      };
    }).filter((lesson) => lesson.patterns.length > 0);
  }, [selectedChapter, searchQuery]);

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-8 md:py-12 page-enter">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        {/* Header Section */}
        <header className="border-b border-border backdrop-blur-md rounded-t-2xl pb-4">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex flex-col gap-1 min-w-0">
              <Link
                href="/"
                className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1 select-none w-fit"
              >
                ← {text.backHome}
              </Link>
              <h1 className="text-xl sm:text-2xl font-black font-jp leading-tight text-foreground flex items-center gap-2 mt-1 truncate">
                <BookOpen size={22} className="text-accent shrink-0" /> {text.title}
              </h1>
              <p className="text-xs text-muted max-w-2xl leading-relaxed">
                {text.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start mt-2">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Stats Progress Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface/40 border border-border/40 rounded-3xl p-4 sm:p-5 shadow-2xs">
          {/* Progress Bar */}
          <div className="flex flex-col gap-2 col-span-1 sm:col-span-2 justify-center">
            <div className="flex items-center justify-between select-none">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {text.overallProgress}
              </span>
              <span className="text-xs font-black text-accent">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Learned Counts */}
          <div className="flex items-center gap-4 bg-surface/80 border border-border/30 rounded-2xl p-3 sm:px-4 shadow-3xs justify-between sm:justify-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent border border-accent/15">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider leading-none">
                {text.learnedCount}
              </span>
              <span className="text-lg font-black text-foreground mt-1 leading-none">
                {isLoaded ? learnedPatterns.length : "..."} <span className="text-xs font-semibold text-muted">/ {totalPatternsCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Search & Study Options Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center border border-border/40 bg-surface/50 rounded-2xl p-4 shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-muted/65"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted hover:text-foreground cursor-pointer select-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Study Toggles */}
          <div className="flex items-center gap-3 shrink-0 select-none">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {text.studyOptions}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFurigana(!showFurigana)}
                className={[
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer",
                  showFurigana
                    ? "bg-accent/10 border-accent/25 text-accent shadow-3xs"
                    : "bg-background border-border/40 text-muted hover:text-foreground",
                ].join(" ")}
              >
                {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {text.furigana}
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar - Chapter Navigation (hidden during search query) */}
          {!searchQuery.trim() && (
            <aside className="w-full flex flex-col gap-2 md:w-60 shrink-0 select-none">
              <h3 className="text-xs font-bold text-muted/80 uppercase tracking-wider px-2">
                {lang === "en" ? "Chapters" : "Daftar Bab"}
              </h3>
              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 scrollbar-none">
                {BUNPOU_DATA.map((lesson) => {
                  const isActive = selectedChapter === lesson.chapter;
                  const stats = chapterStats[lesson.chapter] || { total: 0, learned: 0 };
                  const isFinished = stats.total > 0 && stats.learned === stats.total;

                  return (
                    <button
                      key={lesson.chapter}
                      onClick={() => setSelectedChapter(lesson.chapter)}
                      className={[
                        "flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 border",
                        isActive
                          ? "bg-accent/10 border-accent/25 text-accent shadow-xs"
                          : "bg-surface/50 border-border/40 hover:bg-surface-muted hover:border-border text-foreground/80 hover:text-foreground",
                      ].join(" ")}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-jp text-[10px] opacity-75 truncate">
                          第 {lesson.chapter} 課
                        </span>
                        <span className="text-xs font-bold truncate leading-snug">
                          {text.chapterTitle} {lesson.chapter}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={[
                          "px-1.5 py-0.5 rounded-md text-[9px] font-bold border",
                          isFinished
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-background border-border text-muted"
                        ].join(" ")}>
                          {stats.learned}/{stats.total}
                        </span>

                        {isFinished && (
                          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white border border-emerald-600 shadow-3xs">
                            <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Grammar Patterns Details Panel */}
          <main className="flex-1 flex flex-col gap-6 w-full">
            {filteredLessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted border border-border/40 bg-surface/30 rounded-3xl shadow-2xs select-none">
                <Info className="w-8 h-8 mb-2 text-muted/75" />
                <p className="text-xs font-bold">{text.noResults}</p>
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div key={lesson.chapter} className="flex flex-col gap-4">
                  {/* Chapter Header Title */}
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2 select-none">
                    <span className="bg-accent/10 border border-accent/20 text-accent font-extrabold text-xs px-2.5 py-1 rounded-lg">
                      {text.chapterBadge} {lesson.chapter}
                    </span>
                    <h2 className="text-sm font-black text-muted uppercase tracking-wider">
                      {lang === "en" ? lesson.titleEn : lesson.titleId}
                    </h2>
                  </div>

                  {/* Pattern detail cards */}
                  <div className="flex flex-col gap-4">
                    {lesson.patterns.map((pat) => {
                      const isLearned = learnedPatterns.includes(pat.id);
                      const currentTab = getActiveTab(pat.id);

                      return (
                        <div
                          key={pat.id}
                          className={[
                            "relative overflow-hidden rounded-2xl border bg-surface p-5 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col gap-3 group",
                            isLearned
                              ? "border-emerald-500/25 dark:border-emerald-500/15 bg-gradient-to-r from-emerald-500/[0.02] to-transparent"
                              : "border-border/50",
                          ].join(" ")}
                        >
                          {/* Card Header Row */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-base sm:text-lg font-black font-jp text-accent tracking-wide select-all leading-tight">
                                {pat.pattern}
                              </span>
                              <p className="text-xs font-semibold text-foreground/90 leading-relaxed mt-1">
                                {lang === "en" ? pat.descEn : pat.descId}
                              </p>
                            </div>

                            {/* Badges and Actions */}
                            <div className="flex items-center gap-2 shrink-0 select-none">
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-background text-muted border border-border">
                                {pat.jlpt}
                              </span>

                              <button
                                onClick={() => togglePatternLearned(pat.id)}
                                title={isLearned ? text.unmarkLearned : text.markLearned}
                                className={[
                                  "flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-200 cursor-pointer",
                                  isLearned
                                    ? "bg-emerald-500 border-emerald-600 text-white shadow-3xs hover:scale-105 active:scale-95"
                                    : "bg-background border-border/80 text-muted hover:text-foreground hover:bg-surface-muted active:scale-95",
                                ].join(" ")}
                              >
                                <Check className={`w-4 h-4 stroke-[3px] transition-transform ${isLearned ? "scale-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-30"}`} />
                              </button>
                            </div>
                          </div>

                          {/* Tab Navigation (Examples / Practice) */}
                          <div className="flex border-b border-border/30 pb-1 gap-4 mt-1 select-none">
                            <button
                              onClick={() => setActiveTabForPattern(pat.id, "examples")}
                              className={`text-xs font-bold transition-all cursor-pointer relative pb-1.5 ${
                                currentTab === "examples"
                                  ? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
                                  : "text-muted hover:text-foreground"
                              }`}
                            >
                              {text.examplesTab}
                            </button>
                            <button
                              onClick={() => setActiveTabForPattern(pat.id, "practice")}
                              className={`text-xs font-bold transition-all cursor-pointer relative pb-1.5 ${
                                currentTab === "practice"
                                  ? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
                                  : "text-muted hover:text-foreground"
                              }`}
                            >
                              {text.practiceTab}
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="mt-2">
                            {currentTab === "examples" ? (
                              /* Render Examples (Exactly 3) */
                              <div className="rounded-xl bg-background border border-border/40 p-4 flex flex-col gap-4">
                                {pat.examples && pat.examples.length > 0 ? (
                                  pat.examples.map((example, idx) => (
                                    <div 
                                      key={idx} 
                                      className="flex flex-col gap-1.5 border-b border-border/25 pb-3.5 last:border-b-0 last:pb-0"
                                    >
                                      {/* Furigana Kana */}
                                      {showFurigana && (
                                        <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wide">
                                          {example.exampleKana}
                                        </span>
                                      )}
                                      
                                      {/* Japanese example sentence */}
                                      <p className="text-base font-bold font-jp text-foreground leading-snug tracking-wide select-all">
                                        {example.exampleJp}
                                      </p>

                                      {/* Meaning (Indonesian) */}
                                      <p className="text-sm text-foreground/70 font-medium leading-relaxed mt-0.5">
                                        {example.exampleId}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted/65 italic select-none">
                                    {lang === "en" ? "Generating examples..." : "Memuat contoh kalimat..."}
                                  </p>
                                )}
                              </div>
                            ) : (
                              /* Render Practice sentence scrambling exercises */
                              <PracticeArea 
                                patternId={pat.id} 
                                showFurigana={showFurigana} 
                                lang={lang as "en" | "id"} 
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
