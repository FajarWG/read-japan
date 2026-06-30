"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Check, 
  Search, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Award,
  Sparkles,
  Info
} from "lucide-react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { BUNPOU_DATA, BunpouLesson, BunpouPattern } from "../data/bunpouData";
import { getBunpouProgress, toggleBunpouProgress } from "../actions/bunpouActions";

export function BunpouDashboard() {
  const { lang } = useLanguage();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  
  // Progress State
  const [learnedPatterns, setLearnedPatterns] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Load progress from database on mount
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

  // Save progress to database when toggled (optimistic updates)
  const togglePatternLearned = (patternId: string) => {
    // Optimistic local state update
    setLearnedPatterns((prev) =>
      prev.includes(patternId)
        ? prev.filter((id) => id !== patternId)
        : [...prev, patternId]
    );

    startTransition(async () => {
      try {
        const res = await toggleBunpouProgress(patternId);
        if (!res.success) {
          // Revert on failure
          const progress = await getBunpouProgress();
          setLearnedPatterns(progress);
        }
      } catch (e) {
        console.error("Failed to toggle progress", e);
        // Revert on error
        const progress = await getBunpouProgress();
        setLearnedPatterns(progress);
      }
    });
  };

  // Translations
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
      romaji: "Romaji",
      chapterBadge: "Chapter",
      example: "Example Sentence:",
      allChapters: "All Chapters",
      chapterTitle: "Chapter",
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
      romaji: "Romaji",
      chapterBadge: "Bab",
      example: "Contoh Kalimat:",
      allChapters: "Semua Bab",
      chapterTitle: "Bab",
    }
  }[lang];

  // Calculate totals and statistics
  const totalPatternsCount = useMemo(() => {
    return BUNPOU_DATA.reduce((acc, lesson) => acc + lesson.patterns.length, 0);
  }, []);

  const completionPercentage = useMemo(() => {
    if (totalPatternsCount === 0) return 0;
    return Math.round((learnedPatterns.length / totalPatternsCount) * 100);
  }, [learnedPatterns, totalPatternsCount]);

  // Statistics per chapter
  const chapterStats = useMemo(() => {
    const stats: Record<number, { total: number; learned: number }> = {};
    BUNPOU_DATA.forEach((lesson) => {
      const total = lesson.patterns.length;
      const learned = lesson.patterns.filter((p) => learnedPatterns.includes(p.id)).length;
      stats[lesson.chapter] = { total, learned };
    });
    return stats;
  }, [learnedPatterns]);

  // Filtered patterns based on search query
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) {
      // If no search, return the active selected chapter
      return BUNPOU_DATA.filter((lesson) => lesson.chapter === selectedChapter);
    }

    const query = searchQuery.toLowerCase();
    return BUNPOU_DATA.map((lesson) => {
      const matchingPatterns = lesson.patterns.filter(
        (p) =>
          p.pattern.toLowerCase().includes(query) ||
          p.descEn.toLowerCase().includes(query) ||
          p.descId.toLowerCase().includes(query) ||
          p.exampleJp.toLowerCase().includes(query) ||
          p.exampleEn.toLowerCase().includes(query) ||
          p.exampleId.toLowerCase().includes(query)
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
                📚 {text.title}
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

          {/* Counts */}
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

              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className={[
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer",
                  showRomaji
                    ? "bg-accent/10 border-accent/25 text-accent shadow-3xs"
                    : "bg-background border-border/40 text-muted hover:text-foreground",
                ].join(" ")}
              >
                {showRomaji ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {text.romaji}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar (Chapter Navigation) - Hidden during search */}
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
                        {/* Counts badge */}
                        <span className={[
                          "px-1.5 py-0.5 rounded-md text-[9px] font-bold border",
                          isFinished
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-background border-border text-muted"
                        ].join(" ")}>
                          {stats.learned}/{stats.total}
                        </span>

                        {/* Completion check */}
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

          {/* Grammar Patterns Container */}
          <main className="flex-1 flex flex-col gap-6 w-full">
            {filteredLessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted border border-border/40 bg-surface/30 rounded-3xl shadow-2xs select-none">
                <Info className="w-8 h-8 mb-2 text-muted/75" />
                <p className="text-xs font-bold">{text.noResults}</p>
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div key={lesson.chapter} className="flex flex-col gap-4">
                  {/* Chapter Section Title */}
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2 select-none">
                    <span className="bg-accent/10 border border-accent/20 text-accent font-extrabold text-xs px-2.5 py-1 rounded-lg">
                      {text.chapterBadge} {lesson.chapter}
                    </span>
                    <h2 className="text-sm font-black text-muted uppercase tracking-wider">
                      {lang === "en" ? lesson.titleEn : lesson.titleId}
                    </h2>
                  </div>

                  {/* Patterns Cards Grid */}
                  <div className="flex flex-col gap-4">
                    {lesson.patterns.map((pat) => {
                      const isLearned = learnedPatterns.includes(pat.id);

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
                          {/* Top Card Row */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-base sm:text-lg font-black font-jp text-accent tracking-wide select-all leading-tight">
                                {pat.pattern}
                              </span>
                              <p className="text-xs font-semibold text-foreground/90 leading-relaxed mt-1">
                                {lang === "en" ? pat.descEn : pat.descId}
                              </p>
                            </div>

                            {/* Actions and Badges */}
                            <div className="flex items-center gap-2 shrink-0 select-none">
                              {/* JLPT Badge */}
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-background text-muted border border-border">
                                {pat.jlpt}
                              </span>

                              {/* Learned Button Checkbox */}
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

                          {/* Example Sentences Block */}
                          <div className="rounded-xl bg-background border border-border/40 p-4 mt-1.5 flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider leading-none select-none">
                              {text.example}
                            </span>
                            
                            {/* Furigana */}
                            {showFurigana && (
                              <span className="text-[10px] text-muted opacity-75 font-semibold leading-none select-none tracking-wide">
                                {pat.exampleKana}
                              </span>
                            )}
                            
                            {/* Japanese example sentence */}
                            <p className="text-base font-bold font-jp text-foreground leading-snug tracking-wide select-all">
                              {pat.exampleJp}
                            </p>

                            {/* Romaji */}
                            {showRomaji && (
                              <p className="text-xs text-muted/75 font-medium italic leading-none select-none border-t border-border/25 pt-1.5">
                                {pat.exampleEn.split(" ").length > 0 ? (
                                  // Simplified Romaji display, here we use English & ID translations below
                                  // Just basic spacing for aesthetics
                                  <span>&nbsp;</span>
                                ) : null}
                              </p>
                            )}

                            {/* Translations */}
                            <div className="flex flex-col gap-1 border-t border-border/25 pt-2.5 text-xs text-muted font-semibold leading-relaxed">
                              <p className="flex items-start gap-2">
                                <span className="shrink-0 text-[10px] select-none uppercase font-bold text-muted/50 mt-0.5">en</span>
                                <span>🇺🇸 {pat.exampleEn}</span>
                              </p>
                              <p className="flex items-start gap-2">
                                <span className="shrink-0 text-[10px] select-none uppercase font-bold text-muted/50 mt-0.5">id</span>
                                <span>🇮🇩 {pat.exampleId}</span>
                              </p>
                            </div>
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
