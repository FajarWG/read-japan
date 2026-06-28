"use client";

import React, { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { Tabs } from "@heroui/react";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { KatsuyouSidebar, CONJUGATION_FORMS } from "./KatsuyouSidebar";
import { LearnTab } from "./LearnTab";
import { ExamplesTab } from "./ExamplesTab";
import { PracticeTab } from "./PracticeTab";
import { ReviewTab } from "./ReviewTab";
import { getKatsuyouStats } from "../actions/katsuyouActions";
import {
  RefreshCw,
  BookOpen,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function KatsuyouDashboard() {
  const { lang } = useLanguage();
  const [selectedForm, setSelectedForm] = useState<string>("dictionary");
  const [activeTab, setActiveTab] = useState<string>("learn");

  // Stats State
  const [stats, setStats] = useState<{
    completedLessons: string[];
    dueReviewsCount: number;
    dueReviewsByForm: Record<string, number>;
    totalCardsCount: number;
    practiceCount: number;
  }>({
    completedLessons: [],
    dueReviewsCount: 0,
    dueReviewsByForm: {},
    totalCardsCount: 0,
    practiceCount: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch stats from DB
  const loadStats = async () => {
    try {
      const s = await getKatsuyouStats();
      setStats(s);
    } catch (e) {
      console.error("Error loading stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLessonCompleted = (formKey: string) => {
    // Optimistic local update, then load from server
    setStats((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(formKey)
        ? prev.completedLessons
        : [...prev.completedLessons, formKey],
    }));
    loadStats();
  };

  const handleProgressUpdate = () => {
    loadStats();
  };

  const text = {
    en: {
      title: "Katsuyou — Verb Conjugation",
      subtitle:
        "Master Japanese verb structures with interactive guides, quizzes, and spaced repetition.",
      backHome: "Back to Home",
      tabLearn: "Learn",
      tabExamples: "Examples",
      tabPractice: "Practice",
      tabReview: "Review",
      progress: "Overall Completion",
      loading: "Loading profile progress...",
      statsDue: "Reviews Due",
      statsTotal: "Cards Learned",
      statsPractice: "Practices Logged",
    },
    id: {
      title: "Katsuyou — Konjugasi Kata Kerja",
      subtitle:
        "Kuasai perubahan kata kerja Jepang dengan panduan interaktif, latihan kuis, dan SRS.",
      backHome: "Kembali ke Beranda",
      tabLearn: "Pelajari",
      tabExamples: "Contoh",
      tabPractice: "Latihan",
      tabReview: "Review",
      progress: "Progres Selesai",
      loading: "Memuat progres profil...",
      statsDue: "Review Mengantre",
      statsTotal: "Kosakata Dipelajari",
      statsPractice: "Latihan Selesai",
    },
  }[lang];

  // Calculate completion percentage
  const totalLessons = CONJUGATION_FORMS.length;
  const completedCount = stats.completedLessons.length;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-8 md:py-12">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        {/* ── Navigation & Header ────────────────────────── */}
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
                🇯🇵 {text.title}
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

        {/* ── Stats Overview Dashboard ───────────────────── */}
        {loadingStats ? (
          <div className="flex items-center gap-2 text-xs font-bold text-muted select-none">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
            <span>{text.loading}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface/40 border border-border/40 rounded-3xl p-4 sm:p-5 shadow-2xs">
            {/* Completion Rate */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                {text.progress}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-foreground">
                  {completionPercentage}%
                </span>
                <span className="text-xs font-bold text-muted select-none">
                  ({completedCount}/{totalLessons})
                </span>
              </div>
              <div className="w-full bg-border/45 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Reviews Due */}
            <div className="flex flex-col gap-1 border-l border-border/25 pl-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                {text.statsDue}
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${stats.dueReviewsCount > 0 ? "text-red-500 animate-pulse" : "text-foreground"}`}
              >
                {stats.dueReviewsCount}
              </span>
            </div>

            {/* Total Cards */}
            <div className="flex flex-col gap-1 border-l border-border/25 pl-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                {text.statsTotal}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {stats.totalCardsCount}
              </span>
            </div>

            {/* Practice Count */}
            <div className="flex flex-col gap-1 border-l border-border/25 pl-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                {text.statsPractice}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {stats.practiceCount}
              </span>
            </div>
          </div>
        )}

        {/* ── Main Layout: Sidebar & Content Panel ───────── */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Sidebar (Conjugation forms selection) */}
          <KatsuyouSidebar
            selectedForm={selectedForm}
            onSelectForm={(key) => {
              setSelectedForm(key);
              // Maintain current active tab or fallback
            }}
            completedLessons={stats.completedLessons}
            dueReviewsByForm={stats.dueReviewsByForm}
            lang={lang}
          />

          {/* Right Column: 4-Tab Dashboard Content */}
          <main className="flex-1 min-w-0">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="w-full mb-4"
            >
              <Tabs.ListContainer className="sticky top-0 z-30 bg-background/95 backdrop-blur-md py-2 border-b border-border/40 mb-2">
                <Tabs.List
                  aria-label="Katsuyou Learning Tabs"
                  className={[
                    "w-fit",
                    "*:h-8 *:px-5 *:text-xs *:font-bold",
                    "*:data-[selected=true]:text-white",
                  ].join(" ")}
                >
                  <Tabs.Tab id="learn">
                    {text.tabLearn}
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                  <Tabs.Tab id="examples">
                    {text.tabExamples}
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                  <Tabs.Tab id="practice">
                    {text.tabPractice}
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                  <Tabs.Tab id="review">
                    {text.tabReview}
                    {stats.dueReviewsByForm[selectedForm] > 0 && (
                      <span className="ml-1 px-1 bg-red-500 text-[8px] text-white rounded-full font-black animate-bounce">
                        {stats.dueReviewsByForm[selectedForm]}
                      </span>
                    )}
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              {/* 📖 Learn Tab */}
              <Tabs.Panel id="learn">
                <div className="page-enter">
                  <LearnTab
                    formKey={selectedForm}
                    isCompleted={stats.completedLessons.includes(selectedForm)}
                    onLessonCompleted={handleLessonCompleted}
                    lang={lang}
                  />
                </div>
              </Tabs.Panel>

              {/* 📝 Examples Tab */}
              <Tabs.Panel id="examples">
                <div className="page-enter">
                  <ExamplesTab formKey={selectedForm} lang={lang} />
                </div>
              </Tabs.Panel>

              {/* 🎯 Practice Tab */}
              <Tabs.Panel id="practice">
                <div className="page-enter">
                  <PracticeTab
                    formKey={selectedForm}
                    lang={lang}
                    onProgressUpdate={handleProgressUpdate}
                  />
                </div>
              </Tabs.Panel>

              {/* 🔄 Review Tab */}
              <Tabs.Panel id="review">
                <div className="page-enter">
                  <ReviewTab
                    formKey={selectedForm}
                    lang={lang}
                    onProgressUpdate={handleProgressUpdate}
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
