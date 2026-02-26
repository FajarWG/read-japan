"use client";

import { ThemeToggle } from "@/src/components/ThemeToggle";
import { kanaMap } from "@/src/lib/kana-map";
import type { KanaEntry, KanaType } from "@/src/lib/kana-map";
import { Tabs } from "@heroui/react";

// ─────────────────────────────────────────
// Grouping helper
// ─────────────────────────────────────────

type KanaGroup = {
  label: string;
  entries: [string, KanaEntry][];
};

function groupKana(type: KanaType): KanaGroup[] {
  const all = Object.entries(kanaMap).filter(([, e]) => e.type === type);

  const base = all.filter(([, e]) => !e.origin);
  const modified = all.filter(
    ([, e]) =>
      e.origin &&
      !e.explanation?.includes("yoon") &&
      !e.explanation?.includes("combination"),
  );
  const combinations = all.filter(
    ([, e]) =>
      e.explanation?.includes("yoon") || e.explanation?.includes("combination"),
  );

  return [
    { label: "Dasar", entries: base },
    { label: "Dakuten & Handakuten", entries: modified },
    { label: "Kombinasi (Yōon)", entries: combinations },
  ].filter((g) => g.entries.length > 0);
}

const hiraganaGroups = groupKana("hiragana");
const katakanaGroups = groupKana("katakana");

// ─────────────────────────────────────────
// KanaCard
// ─────────────────────────────────────────

function KanaCard({ char, entry }: { char: string; entry: KanaEntry }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-2 py-3 text-center shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
      {/* Romaji */}
      <span className="text-[11px] font-bold leading-none text-indigo-500 dark:text-indigo-400">
        {entry.romaji}
      </span>
      {/* Character */}
      <span className="font-jp text-3xl leading-none text-foreground">
        {char}
      </span>
      {/* Origin indicator */}
      {entry.origin && (
        <span className="text-[9px] text-muted leading-none">
          {entry.origin}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// KanaSection
// ─────────────────────────────────────────

function KanaSection({ groups }: { groups: KanaGroup[] }) {
  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            {group.label}
            <span className="text-xs font-normal text-muted">
              ({group.entries.length})
            </span>
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
            {group.entries.map(([char, entry]) => (
              <KanaCard key={char} char={char} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────

export default function KanaPage() {
  const totalHiragana = Object.values(kanaMap).filter(
    (e) => e.type === "hiragana",
  ).length;
  const totalKatakana = Object.values(kanaMap).filter(
    (e) => e.type === "katakana",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-jp text-lg font-bold leading-tight text-foreground">
              Referensi Kana
            </h1>
            <p className="text-xs text-muted">
              {totalHiragana} hiragana · {totalKatakana} katakana
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Tabs className="w-full">
          <Tabs.ListContainer className="mb-6 sticky top-14.25 z-30 bg-background py-2">
            <Tabs.List
              aria-label="Pilih jenis kana"
              className={[
                "w-fit",
                "*:h-8 *:px-5 *:text-sm *:font-medium",
                "*:data-[selected=true]:text-accent-foreground",
              ].join(" ")}
            >
              <Tabs.Tab id="hiragana">
                ひ Hiragana ({totalHiragana})
                <Tabs.Indicator className="bg-accent" />
              </Tabs.Tab>
              <Tabs.Tab id="katakana">
                カ Katakana ({totalKatakana})
                <Tabs.Indicator className="bg-accent" />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id="hiragana">
            <KanaSection groups={hiraganaGroups} />
          </Tabs.Panel>

          <Tabs.Panel id="katakana">
            <KanaSection groups={katakanaGroups} />
          </Tabs.Panel>
        </Tabs>
      </main>
    </div>
  );
}
