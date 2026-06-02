"use client";

import React, { useState } from "react";
import { mockVerbs, Verb } from "../data/verbs";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

export function VerbConjugator() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [jlptFilter, setJlptFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [showRomaji, setShowRomaji] = useState(true);
  const [showKana, setShowKana] = useState(true);

  // Filter verbs
  const filteredVerbs = mockVerbs.filter((verb) => {
    const matchesSearch =
      verb.kanji.toLowerCase().includes(search.toLowerCase()) ||
      verb.kana.toLowerCase().includes(search.toLowerCase()) ||
      verb.romaji.toLowerCase().includes(search.toLowerCase()) ||
      verb.english.toLowerCase().includes(search.toLowerCase()) ||
      verb.indonesian.toLowerCase().includes(search.toLowerCase());

    const matchesJlpt = jlptFilter === "all" || verb.jlpt === jlptFilter;
    const matchesGroup = groupFilter === "all" || verb.group.toString() === groupFilter;

    return matchesSearch && matchesJlpt && matchesGroup;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search Box */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="verb-search" className="text-xs font-bold text-muted uppercase tracking-wider">
              {lang === "en" ? "Search Verb" : "Cari Kata Kerja"}
            </label>
            <div className="relative">
              <input
                id="verb-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "en" ? "e.g., iku, taberu, 行く..." : "misal: iku, taberu, 行u..."}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground transition-all placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* JLPT Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jlpt-filter" className="text-xs font-bold text-muted uppercase tracking-wider">
              JLPT Level
            </label>
            <select
              id="jlpt-filter"
              value={jlptFilter}
              onChange={(e) => setJlptFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="all">{lang === "en" ? "All Levels" : "Semua Level"}</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
            </select>
          </div>

          {/* Group Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="group-filter" className="text-xs font-bold text-muted uppercase tracking-wider">
              {lang === "en" ? "Verb Group" : "Golongan Kata Kerja"}
            </label>
            <select
              id="group-filter"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="all">{lang === "en" ? "All Groups" : "Semua Golongan"}</option>
              <option value="1">{lang === "en" ? "Group 1 (Godan)" : "Golongan 1 (Godan)"}</option>
              <option value="2">{lang === "en" ? "Group 2 (Ichidan)" : "Golongan 2 (Ichidan)"}</option>
              <option value="3">{lang === "en" ? "Group 3 (Irregular)" : "Golongan 3 (Irregular)"}</option>
            </select>
          </div>
        </div>

        {/* Study Options */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs font-medium text-muted">
          <span className="font-semibold select-none">{lang === "en" ? "Display Options:" : "Opsi Tampilan:"}</span>
          <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={showKana}
              onChange={(e) => setShowKana(e.target.checked)}
              className="rounded-sm border-border text-accent focus:ring-accent accent-accent h-4 w-4 cursor-pointer"
            />
            {lang === "en" ? "Show Kana (Furigana)" : "Tampilkan Kana (Furigana)"}
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={showRomaji}
              onChange={(e) => setShowRomaji(e.target.checked)}
              className="rounded-sm border-border text-accent focus:ring-accent accent-accent h-4 w-4 cursor-pointer"
            />
            {lang === "en" ? "Show Romaji" : "Tampilkan Romaji"}
          </label>
        </div>
      </div>

      {/* Main Results View */}
      {filteredVerbs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-xs">
          <p className="text-sm text-muted">
            {lang === "en"
              ? "No verbs found matching your filters."
              : "Tidak ada kata kerja yang sesuai dengan filter Anda."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3.5 select-none">{lang === "en" ? "Verb Details" : "Detail Kata Kerja"}</th>
                  <th className="px-4 py-3.5 select-none">{lang === "en" ? "Dictionary Form" : "Bentuk Kamus"}</th>
                  <th className="px-4 py-3.5 select-none">Masu Form (~masu)</th>
                  <th className="px-4 py-3.5 select-none">Te Form (~te)</th>
                  <th className="px-4 py-3.5 select-none">Nai Form (~nai)</th>
                  <th className="px-4 py-3.5 select-none">Ta Form (~ta)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredVerbs.map((verb) => (
                  <tr key={verb.id} className="hover:bg-surface-muted/30 transition-colors group">
                    {/* Details Column */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground font-jp">{verb.kanji}</span>
                          <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                            {verb.jlpt}
                          </span>
                          <span className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 dark:text-amber-400">
                            Gr. {verb.group}
                          </span>
                        </div>
                        <span className="text-xs text-muted font-medium">
                          {lang === "en" ? verb.english : verb.indonesian}
                        </span>
                      </div>
                    </td>

                    {/* Conjugation Columns */}
                    <td className="px-4 py-3">
                      <ConjugationCell cell={verb.conjugations.dictionary} showKana={showKana} showRomaji={showRomaji} />
                    </td>
                    <td className="px-4 py-3">
                      <ConjugationCell cell={verb.conjugations.masu} showKana={showKana} showRomaji={showRomaji} />
                    </td>
                    <td className="px-4 py-3">
                      <ConjugationCell cell={verb.conjugations.te} showKana={showKana} showRomaji={showRomaji} isTe />
                    </td>
                    <td className="px-4 py-3">
                      <ConjugationCell cell={verb.conjugations.nai} showKana={showKana} showRomaji={showRomaji} isNai />
                    </td>
                    <td className="px-4 py-3">
                      <ConjugationCell cell={verb.conjugations.ta} showKana={showKana} showRomaji={showRomaji} isTa />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid/Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredVerbs.map((verb) => (
              <div
                key={verb.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-xs flex flex-col gap-3.5 hover:border-accent/40 transition-colors"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between border-b border-border/50 pb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-bold text-foreground font-jp">{verb.kanji}</h4>
                      <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                        {verb.jlpt}
                      </span>
                      <span className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 dark:text-amber-400">
                        G{verb.group}
                      </span>
                    </div>
                    <span className="text-xs text-muted mt-0.5">
                      {lang === "en" ? verb.english : verb.indonesian}
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-muted bg-surface-muted px-2 py-0.5 rounded-full border border-border/40 select-none">
                    {verb.subGroup === "exception" || verb.subGroup === "exception-ru"
                      ? (lang === "en" ? "Exception" : "Pengecualian")
                      : `${lang === "en" ? "Sub-end" : "Akhiran"}: -${verb.subGroup}`}
                  </div>
                </div>

                {/* Mobile Card Conjugations Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-muted text-[10px] uppercase select-none">
                      {lang === "en" ? "Dictionary" : "Kamus"}
                    </span>
                    <ConjugationCell cell={verb.conjugations.dictionary} showKana={showKana} showRomaji={showRomaji} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-muted text-[10px] uppercase select-none">Masu (~masu)</span>
                    <ConjugationCell cell={verb.conjugations.masu} showKana={showKana} showRomaji={showRomaji} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-muted text-[10px] uppercase select-none">Te Form (~te)</span>
                    <ConjugationCell cell={verb.conjugations.te} showKana={showKana} showRomaji={showRomaji} isTe />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-muted text-[10px] uppercase select-none">Nai Form (~nai)</span>
                    <ConjugationCell cell={verb.conjugations.nai} showKana={showKana} showRomaji={showRomaji} isNai />
                  </div>
                  <div className="flex flex-col gap-0.5 col-span-2">
                    <span className="font-bold text-muted text-[10px] uppercase select-none">Past (~ta)</span>
                    <ConjugationCell cell={verb.conjugations.ta} showKana={showKana} showRomaji={showRomaji} isTa />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Subcomponent for displaying conjugation cells
interface ConjugationCellProps {
  cell: { kanji: string; kana: string; romaji: string };
  showKana: boolean;
  showRomaji: boolean;
  isTe?: boolean;
  isNai?: boolean;
  isTa?: boolean;
}

function ConjugationCell({ cell, showKana, showRomaji, isTe, isNai, isTa }: ConjugationCellProps) {
  // Style markers differently depending on the type of conjugation for easier visual scan
  let highlightColor = "text-foreground";
  if (isTe) highlightColor = "text-indigo-600 dark:text-indigo-400 font-semibold";
  else if (isNai) highlightColor = "text-rose-600 dark:text-rose-400 font-semibold";
  else if (isTa) highlightColor = "text-amber-600 dark:text-amber-400 font-semibold";

  return (
    <div className="flex flex-col">
      <span className={`text-[14px] font-jp leading-tight ${highlightColor}`}>{cell.kanji}</span>
      {showKana && cell.kanji !== cell.kana && (
        <span className="text-[11px] text-muted leading-tight mt-0.5">{cell.kana}</span>
      )}
      {showRomaji && <span className="text-[10px] text-muted/80 leading-none mt-0.5 font-mono">{cell.romaji}</span>}
    </div>
  );
}
