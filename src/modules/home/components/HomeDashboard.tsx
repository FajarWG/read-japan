"use client";

import React from "react";
import Link from "next/link";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";

export function HomeDashboard() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const content = {
    en: {
      welcome: user ? `Welcome back, ${user.username}! ✨` : "Welcome to Nihongo Flow! 👋",
      subtitle: "Choose a feature below to start your Japanese learning journey.",
      features: [
        {
          id: "katsuyou",
          title: "Katsuyou (活用)",
          subtitle: "Verb Conjugation",
          desc: "Master Japanese verb conjugations with interactive guides, sentence examples, practice exercises, and a built-in SRS review system.",
          route: "/katsuyou",
          icon: "🔄",
          badge: "New",
          color: "border-indigo-500/20 hover:border-indigo-500/60 dark:hover:bg-indigo-950/10 hover:shadow-indigo-500/10",
          iconColor: "text-indigo-500",
        },
        {
          id: "prep",
          title: "Prep Sheet",
          subtitle: "Lesson Preparation",
          desc: "Prepare for lessons with dialogs, grammar explanations, vocabulary lists, and audio playbacks.",
          route: "/prep",
          icon: "💬",
          color: "border-emerald-500/20 hover:border-emerald-500/60 dark:hover:bg-emerald-950/10 hover:shadow-emerald-500/10",
          iconColor: "text-emerald-500",
        },
        {
          id: "anki",
          title: "Anki Cards",
          subtitle: "SRS Flashcards",
          desc: "Memorize vocabulary using spaced repetition cards. Filter by lesson chapters and review daily.",
          route: "/anki",
          icon: "🎴",
          color: "border-amber-500/20 hover:border-amber-500/60 dark:hover:bg-amber-950/10 hover:shadow-amber-500/10",
          iconColor: "text-amber-500",
        },
        {
          id: "kana",
          title: "Kana Reference",
          subtitle: "Hiragana & Katakana",
          desc: "Complete reference charts for Hiragana and Katakana, including Dakuten and Yoon combinations.",
          route: "/kana",
          icon: "🎌",
          color: "border-cyan-500/20 hover:border-cyan-500/60 dark:hover:bg-cyan-950/10 hover:shadow-cyan-500/10",
          iconColor: "text-cyan-500",
        },
        {
          id: "stories",
          title: "Short Stories",
          subtitle: "Reading Practice",
          desc: "Practice reading Japanese stories. Tap any character to show helper readings and build review cards.",
          route: "/stories",
          icon: "📖",
          color: "border-rose-500/20 hover:border-rose-500/60 dark:hover:bg-rose-950/10 hover:shadow-rose-500/10",
          iconColor: "text-rose-500",
        },
      ],
      footerDesc: "Nihongo Flow is an open-source platform designed to make Japanese learning accessible.",
    },
    id: {
      welcome: user ? `Selamat datang kembali, ${user.username}! ✨` : "Selamat Datang di Nihongo Flow! 👋",
      subtitle: "Pilih fitur di bawah ini untuk memulai perjalanan belajar bahasa Jepang Anda.",
      features: [
        {
          id: "katsuyou",
          title: "Katsuyou (活用)",
          subtitle: "Perubahan Kata Kerja",
          desc: "Kuasai konjugasi kata kerja Jepang dengan panduan interaktif, contoh kalimat, latihan kuis, dan sistem review SRS.",
          route: "/katsuyou",
          icon: "🔄",
          badge: "Baru",
          color: "border-indigo-500/20 hover:border-indigo-500/60 dark:hover:bg-indigo-950/10 hover:shadow-indigo-500/10",
          iconColor: "text-indigo-500",
        },
        {
          id: "prep",
          title: "Prep Sheet",
          subtitle: "Persiapan Pelajaran",
          desc: "Persiapkan materi belajar dengan dialog percakapan, tata bahasa, daftar kosakata, dan pemutar audio.",
          route: "/prep",
          icon: "💬",
          color: "border-emerald-500/20 hover:border-emerald-500/60 dark:hover:bg-emerald-950/10 hover:shadow-emerald-500/10",
          iconColor: "text-emerald-500",
        },
        {
          id: "anki",
          title: "Kartu Anki",
          subtitle: "SRS Flashcards",
          desc: "Hafalkan kosakata dengan metode kartu spaced repetition (SRS). Filter berdasarkan bab materi.",
          route: "/anki",
          icon: "🎴",
          color: "border-amber-500/20 hover:border-amber-500/60 dark:hover:bg-amber-950/10 hover:shadow-amber-500/10",
          iconColor: "text-amber-500",
        },
        {
          id: "kana",
          title: "Referensi Kana",
          subtitle: "Tabel Hiragana & Katakana",
          desc: "Tabel referensi lengkap Hiragana dan Katakana, dilengkapi kombinasi Dakuten dan Yoon.",
          route: "/kana",
          icon: "🎌",
          color: "border-cyan-500/20 hover:border-cyan-500/60 dark:hover:bg-cyan-950/10 hover:shadow-cyan-500/10",
          iconColor: "text-cyan-500",
        },
        {
          id: "stories",
          title: "Cerita Pendek",
          subtitle: "Latihan Membaca",
          desc: "Latihan membaca cerita bahasa Jepang. Ketuk huruf apa saja untuk bantuan cara baca dan simpan kata sulit.",
          route: "/stories",
          icon: "📖",
          color: "border-rose-500/20 hover:border-rose-500/60 dark:hover:bg-rose-950/10 hover:shadow-rose-500/10",
          iconColor: "text-rose-500",
        },
      ],
      footerDesc: "Nihongo Flow adalah platform open-source gratis untuk mempermudah belajar bahasa Jepang.",
    },
  }[lang];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header Dashboard */}
        <header className="border-b border-border backdrop-blur-md rounded-t-2xl pb-4 mb-6">
          <div className="flex items-center justify-between gap-4 px-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-jp leading-tight text-foreground select-none">
                ⛩️ Nihongo Flow
              </h1>
              <p className="text-xs text-muted mt-0.5">
                {t.brandDesc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 flex flex-col gap-6">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-accent/10 to-transparent p-5 rounded-2xl border border-accent/15">
            <h2 className="text-base font-bold text-foreground">
              {content.welcome}
            </h2>
            <p className="text-xs text-muted mt-1">
              {content.subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.features.map((feature) => (
              <Link
                key={feature.id}
                href={feature.route}
                id={`feature-card-${feature.id}`}
                className={[
                  "group relative overflow-hidden rounded-2xl border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[140px]",
                  feature.color,
                ].join(" ")}
              >
                <div>
                  {/* Title and Icon */}
                  <div className="flex items-start justify-between">
                    <span className="text-2xl select-none">{feature.icon}</span>
                    {feature.badge && (
                      <span className="rounded-full bg-accent text-white text-[9px] font-bold px-2 py-0.5 animate-pulse select-none">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block leading-none select-none">
                      {feature.subtitle}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-1 group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="mt-12 text-center text-[10px] text-muted px-4 select-none">
          <p>{content.footerDesc}</p>
        </footer>
      </div>
    </div>
  );
}
