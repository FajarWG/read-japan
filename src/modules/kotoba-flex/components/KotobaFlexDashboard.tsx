"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tabs } from "@heroui/react";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { VerbConjugator } from "./VerbConjugator";
import { ConjugationGuide } from "./ConjugationGuide";
import { PracticeQuiz } from "./PracticeQuiz";

export function KotobaFlexDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("conjugator");

  // Page level localization
  const content = {
    en: {
      title: "Kotoba Flex",
      subtitle: "Learn Japanese verb conjugations",
      tabConjugator: "Conjugator",
      tabGuide: "Step Guide",
      tabPractice: "Practice Quiz",
      backHome: "Back to Home",
    },
    id: {
      title: "Kotoba Flex",
      subtitle: "Pelajari konjugasi/perubahan kata kerja bahasa Jepang",
      tabConjugator: "Konjugator",
      tabGuide: "Panduan Aturan",
      tabPractice: "Latihan Kuis",
      backHome: "Kembali ke Beranda",
    },
  }[lang];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Navigation & Header */}
        <header className="border-b border-border backdrop-blur-md rounded-t-2xl mb-4">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1 select-none"
                >
                  ← {content.backHome}
                </Link>
              </div>
              <h1 className="text-xl font-bold font-jp leading-tight text-foreground flex items-center gap-2 mt-1">
                🇯🇵 {content.title}
              </h1>
              <p className="text-xs text-muted max-w-md">
                {content.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start mt-2">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Tab Selection */}
        <main className="px-4">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full mb-6"
          >
            <Tabs.ListContainer className="sticky top-0 z-30 bg-background py-2">
              <Tabs.List
                aria-label="Kotoba Flex Features"
                className={[
                  "w-fit",
                  "*:h-8 *:px-6 *:text-xs *:font-semibold",
                  "*:data-[selected=true]:text-accent-foreground",
                ].join(" ")}
              >
                <Tabs.Tab id="conjugator">
                  🔄 {content.tabConjugator}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab id="guide">
                  📖 {content.tabGuide}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab id="practice">
                  ✍️ {content.tabPractice}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="conjugator">
              <div className="page-enter">
                <VerbConjugator />
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="guide">
              <div className="page-enter">
                <ConjugationGuide />
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="practice">
              <div className="page-enter">
                <PracticeQuiz />
              </div>
            </Tabs.Panel>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
