"use client";

import React, { useState } from "react";
import { Flashcard } from "./Flashcard";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { mockVerbs, VerbConjugations } from "../data/verbs";
import { HighlightedConjugation } from "./HighlightedConjugation";

interface RuleSectionProps {
  title: string;
  desc: string;
  group1Rules: { suffix: string; change: string; romajiChange: string; examples: { base: string; baseRomaji: string; conj: string; conjRomaji: string; meaning: string }[] }[];
  group2Rules: { suffix: string; change: string; romajiChange: string; examples: { base: string; baseRomaji: string; conj: string; conjRomaji: string; meaning: string }[] }[];
  group3Rules: { suffix: string; change: string; romajiChange: string; examples: { base: string; baseRomaji: string; conj: string; conjRomaji: string; meaning: string }[] }[];
  lang: string;
}

interface ExampleTextProps {
  baseWithParen: string;
  baseRomaji: string;
  formKey: keyof VerbConjugations;
  textType: "kanji" | "romaji";
  highlightClass?: string;
}

function ExampleText({ baseWithParen, baseRomaji, formKey, textType, highlightClass }: ExampleTextProps) {
  const kanjiBase = baseWithParen.split(" ")[0];
  const verb = mockVerbs.find((v) => v.romaji === baseRomaji || v.kanji === kanjiBase);

  if (!verb) {
    return <span>{textType === "kanji" ? kanjiBase : baseRomaji}</span>;
  }

  return (
    <HighlightedConjugation
      verb={verb}
      formKey={formKey}
      textType={textType}
      highlightClass={highlightClass}
    />
  );
}

export function ConjugationGuide() {
  const { lang } = useLanguage();
  const [activeForm, setActiveForm] = useState<"te" | "masu" | "nai" | "ta">("te");

  // Data for TE FORM
  const teFormRules: RuleSectionProps = {
    title: "Te-form (~て)",
    desc: lang === "en" 
      ? "Te-form is used for connecting sentences, making requests (~てください), and expressing ongoing actions (~ています)."
      : "Bentuk Te (~te) digunakan untuk menghubungkan kalimat, membuat permohonan (~te kudasai), dan menyatakan aksi yang sedang berlangsung (~te imasu).",
    lang,
    group1Rules: [
      {
        suffix: "う (u) / つ (tsu) / る (ru)",
        change: "→ って (tte)",
        romajiChange: "u/tsu/ru → tte",
        examples: [
          { base: "買う (kau)", baseRomaji: "kau", conj: "買って (katte)", conjRomaji: "katte", meaning: lang === "en" ? "buy" : "membeli" },
          { base: "待つ (matsu)", baseRomaji: "matsu", conj: "待って (matte)", conjRomaji: "matte", meaning: lang === "en" ? "wait" : "menunggu" },
          { base: "帰る (kaeru)", baseRomaji: "kaeru", conj: "帰って (kaette)", conjRomaji: "kaette", meaning: lang === "en" ? "return" : "pulang" },
        ],
      },
      {
        suffix: "む (mu) / ぶ (bu) / ぬ (nu)",
        change: "→ んで (nde)",
        romajiChange: "mu/bu/nu → nde",
        examples: [
          { base: "読む (yomu)", baseRomaji: "yomu", conj: "読んで (yonde)", conjRomaji: "yonde", meaning: lang === "en" ? "read" : "membaca" },
          { base: "呼ぶ (yobu)", baseRomaji: "yobu", conj: "呼んで (yonde)", conjRomaji: "yonde", meaning: lang === "en" ? "call" : "memanggil" },
          { base: "死ぬ (shinu)", baseRomaji: "shinu", conj: "死んで (shinde)", conjRomaji: "shinde", meaning: lang === "en" ? "die" : "mati" },
        ],
      },
      {
        suffix: "く (ku)",
        change: "→ いて (ite)",
        romajiChange: "ku → itte / ite",
        examples: [
          { base: "書く (kaku)", baseRomaji: "kaku", conj: "書いて (kaite)", conjRomaji: "kaite", meaning: lang === "en" ? "write" : "menulis" },
        ],
      },
      {
        suffix: "ぐ (gu)",
        change: "→ いで (ide)",
        romajiChange: "gu → ide",
        examples: [
          { base: "泳ぐ (oyogu)", baseRomaji: "oyogu", conj: "泳いで (oyoide)", conjRomaji: "oyoide", meaning: lang === "en" ? "swim" : "berenang" },
        ],
      },
      {
        suffix: "す (su)",
        change: "→ して (shite)",
        romajiChange: "su → shite",
        examples: [
          { base: "話す (hanasu)", baseRomaji: "hanasu", conj: "話して (hanashite)", conjRomaji: "hanashite", meaning: lang === "en" ? "speak" : "berbicara" },
        ],
      },
      {
        suffix: "⚠️ Pengecualian / Exception",
        change: "行く (iku) → 行って (itte)",
        romajiChange: "iku → itte",
        examples: [
          { base: "行く (iku)", baseRomaji: "iku", conj: "行って (itte)", conjRomaji: "itte", meaning: lang === "en" ? "go" : "pergi" },
        ],
      },
    ],
    group2Rules: [
      {
        suffix: "る (ru)",
        change: "→ て (te)",
        romajiChange: "drop -ru, add -te",
        examples: [
          { base: "食べる (taberu)", baseRomaji: "taberu", conj: "食べて (tabete)", conjRomaji: "tabete", meaning: lang === "en" ? "eat" : "makan" },
          { base: "見る (miru)", baseRomaji: "miru", conj: "見て (mite)", conjRomaji: "mite", meaning: lang === "en" ? "see" : "melihat" },
        ],
      },
    ],
    group3Rules: [
      {
        suffix: "する (suru)",
        change: "→ して (shite)",
        romajiChange: "suru → shite",
        examples: [
          { base: "する (suru)", baseRomaji: "suru", conj: "して (shite)", conjRomaji: "shite", meaning: lang === "en" ? "do" : "melakukan" },
        ],
      },
      {
        suffix: "くる (kuru)",
        change: "→ きて (kite)",
        romajiChange: "kuru → kite",
        examples: [
          { base: "来る (kuru)", baseRomaji: "kuru", conj: "来て (kite)", conjRomaji: "kite", meaning: lang === "en" ? "come" : "datang" },
        ],
      },
    ],
  };

  // Data for TA FORM
  const taFormRules: RuleSectionProps = {
    title: "Ta-form (~た)",
    desc: lang === "en"
      ? "Ta-form is the informal past tense form, equivalent to the English simple past or present perfect."
      : "Bentuk Ta (~ta) adalah bentuk masa lampau informal (past tense) dalam bahasa Jepang.",
    lang,
    group1Rules: [
      {
        suffix: "う (u) / つ (tsu) / る (ru)",
        change: "→ った (tta)",
        romajiChange: "u/tsu/ru → tta",
        examples: [
          { base: "買う (kau)", baseRomaji: "kau", conj: "買った (katta)", conjRomaji: "katta", meaning: lang === "en" ? "bought" : "telah membeli" },
          { base: "帰る (kaeru)", baseRomaji: "kaeru", conj: "帰った (kaetta)", conjRomaji: "kaetta", meaning: lang === "en" ? "returned" : "telah pulang" },
        ],
      },
      {
        suffix: "む (mu) / ぶ (bu) / ぬ (nu)",
        change: "→ んだ (nda)",
        romajiChange: "mu/bu/nu → nda",
        examples: [
          { base: "読む (yomu)", baseRomaji: "yomu", conj: "読んだ (yonda)", conjRomaji: "yonda", meaning: lang === "en" ? "read (past)" : "telah membaca" },
        ],
      },
      {
        suffix: "く (ku)",
        change: "→ いた (ita)",
        romajiChange: "ku → ita",
        examples: [
          { base: "書く (kaku)", baseRomaji: "kaku", conj: "書いた (kaita)", conjRomaji: "kaita", meaning: lang === "en" ? "wrote" : "telah menulis" },
        ],
      },
      {
        suffix: "ぐ (gu)",
        change: "→ いだ (ida)",
        romajiChange: "gu → ida",
        examples: [
          { base: "泳ぐ (oyogu)", baseRomaji: "oyogu", conj: "泳いだ (oyoida)", conjRomaji: "oyoida", meaning: lang === "en" ? "swam" : "telah berenang" },
        ],
      },
      {
        suffix: "す (su)",
        change: "→ した (shita)",
        romajiChange: "su → shita",
        examples: [
          { base: "話す (hanasu)", baseRomaji: "hanasu", conj: "話した (hanashita)", conjRomaji: "hanashita", meaning: lang === "en" ? "spoke" : "telah berbicara" },
        ],
      },
      {
        suffix: "⚠️ Pengecualian / Exception",
        change: "行く (iku) → 行った (itta)",
        romajiChange: "iku → itta",
        examples: [
          { base: "行く (iku)", baseRomaji: "iku", conj: "行った (itta)", conjRomaji: "itta", meaning: lang === "en" ? "went" : "telah pergi" },
        ],
      },
    ],
    group2Rules: [
      {
        suffix: "る (ru)",
        change: "→ た (ta)",
        romajiChange: "drop -ru, add -ta",
        examples: [
          { base: "食べる (taberu)", baseRomaji: "taberu", conj: "食べた (tabeta)", conjRomaji: "tabeta", meaning: lang === "en" ? "ate" : "telah makan" },
        ],
      },
    ],
    group3Rules: [
      {
        suffix: "する (suru)",
        change: "→ した (shita)",
        romajiChange: "suru → shita",
        examples: [
          { base: "する (suru)", baseRomaji: "suru", conj: "した (shita)", conjRomaji: "shita", meaning: lang === "en" ? "did" : "telah melakukan" },
        ],
      },
      {
        suffix: "くる (kuru)",
        change: "→ きた (kita)",
        romajiChange: "kuru → kita",
        examples: [
          { base: "来る (kuru)", baseRomaji: "kuru", conj: "来た (kita)", conjRomaji: "kita", meaning: lang === "en" ? "came" : "telah datang" },
        ],
      },
    ],
  };

  // Data for MASU FORM
  const masuFormRules: RuleSectionProps = {
    title: "Masu-form (~ます)",
    desc: lang === "en"
      ? "Masu-form is the polite present-tense verb form. It is the base for polite Japanese conversation."
      : "Bentuk Masu (~masu) adalah bentuk kata kerja sopan (polite form) yang digunakan dalam percakapan sehari-hari.",
    lang,
    group1Rules: [
      {
        suffix: "Akhiran Hiragana u-row (う, つ, る, む, ぶ, ぬ, く, ぐ, す)",
        change: "Ubah ke i-row (い, ち, り, み, び, に, き, ぎ, し) + ます",
        romajiChange: "u-row ending → i-row ending + masu",
        examples: [
          { base: "買う (kau)", baseRomaji: "kau", conj: "買います (kaimasu)", conjRomaji: "kaimasu", meaning: lang === "en" ? "buy (polite)" : "membeli (sopan)" },
          { base: "待つ (matsu)", baseRomaji: "matsu", conj: "待ちます (machimasu)", conjRomaji: "machimasu", meaning: lang === "en" ? "wait (polite)" : "menunggu (sopan)" },
          { base: "読む (yomu)", baseRomaji: "yomu", conj: "読みます (yomimasu)", conjRomaji: "yomimasu", meaning: lang === "en" ? "read (polite)" : "membaca (sopan)" },
        ],
      },
    ],
    group2Rules: [
      {
        suffix: "る (ru)",
        change: "→ ます (masu)",
        romajiChange: "drop -ru, add -masu",
        examples: [
          { base: "食べる (taberu)", baseRomaji: "taberu", conj: "食べます (tabemasu)", conjRomaji: "tabemasu", meaning: lang === "en" ? "eat (polite)" : "makan (sopan)" },
        ],
      },
    ],
    group3Rules: [
      {
        suffix: "する (suru)",
        change: "→ します (shimasu)",
        romajiChange: "suru → shimasu",
        examples: [
          { base: "する (suru)", baseRomaji: "suru", conj: "します (shimasu)", conjRomaji: "shimasu", meaning: lang === "en" ? "do (polite)" : "melakukan (sopan)" },
        ],
      },
      {
        suffix: "くる (kuru)",
        change: "→ きます (kimasu)",
        romajiChange: "kuru → kimasu",
        examples: [
          { base: "来る (kuru)", baseRomaji: "kuru", conj: "来ます (きます - kimasu)", conjRomaji: "kimasu", meaning: lang === "en" ? "come (polite)" : "datang (sopan)" },
        ],
      },
    ],
  };

  // Data for NAI FORM
  const naiFormRules: RuleSectionProps = {
    title: "Nai-form (~ない)",
    desc: lang === "en"
      ? "Nai-form is the casual negative form, used to say 'does not' or 'will not' do something."
      : "Bentuk Nai (~nai) adalah bentuk negatif informal, digunakan untuk menyatakan 'tidak melakukan' sesuatu.",
    lang,
    group1Rules: [
      {
        suffix: "Akhiran Hiragana u-row (う*, つ, る, む, ぶ, ぬ, く, ぐ, す)",
        change: "Ubah ke a-row (わ*, た, ら, ま, ば, な, か, が, さ) + ない",
        romajiChange: "u-row ending → a-row ending + nai (*u becomes wa)",
        examples: [
          { base: "買う (kau)", baseRomaji: "kau", conj: "買わない (kawanai)", conjRomaji: "kawanai", meaning: lang === "en" ? "not buy" : "tidak membeli" },
          { base: "待つ (matsu)", baseRomaji: "matsu", conj: "待たない (matanai)", conjRomaji: "matanai", meaning: lang === "en" ? "not wait" : "tidak menunggu" },
          { base: "話す (hanasu)", baseRomaji: "hanasu", conj: "話さない (hanasanai)", conjRomaji: "hanasanai", meaning: lang === "en" ? "not speak" : "tidak berbicara" },
        ],
      },
    ],
    group2Rules: [
      {
        suffix: "る (ru)",
        change: "→ ない (nai)",
        romajiChange: "drop -ru, add -nai",
        examples: [
          { base: "食べる (taberu)", baseRomaji: "taberu", conj: "食べない (tabenai)", conjRomaji: "tabenai", meaning: lang === "en" ? "not eat" : "tidak makan" },
        ],
      },
    ],
    group3Rules: [
      {
        suffix: "する (suru)",
        change: "→ しない (shinai)",
        romajiChange: "suru → shinai",
        examples: [
          { base: "する (suru)", baseRomaji: "suru", conj: "しない (shinai)", conjRomaji: "shinai", meaning: lang === "en" ? "not do" : "tidak melakukan" },
        ],
      },
      {
        suffix: "くる (kuru)",
        change: "→ こない (konai)",
        romajiChange: "kuru → konai",
        examples: [
          { base: "来る (kuru)", baseRomaji: "kuru", conj: "来ない (こない - konai)", conjRomaji: "konai", meaning: lang === "en" ? "not come" : "tidak datang" },
        ],
      },
    ],
  };

  const getActiveRules = () => {
    switch (activeForm) {
      case "masu":
        return masuFormRules;
      case "nai":
        return naiFormRules;
      case "ta":
        return taFormRules;
      case "te":
      default:
        return teFormRules;
    }
  };

  const rulesData = getActiveRules();

  const exampleHighlightClass = {
    te: "text-indigo-600 dark:text-indigo-400 font-bold",
    ta: "text-amber-600 dark:text-amber-400 font-bold",
    nai: "text-rose-600 dark:text-rose-400 font-bold",
    masu: "text-emerald-600 dark:text-emerald-400 font-bold",
  }[activeForm] || "text-indigo-600 dark:text-indigo-400 font-bold";

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-navigation for conjugation forms */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin select-none">
        {(["te", "ta", "masu", "nai"] as const).map((form) => {
          const isActive = activeForm === form;
          const label = {
            te: "Te-form (~て)",
            ta: "Ta-form (~た)",
            masu: "Masu-form (~ます)",
            nai: "Nai-form (~ない)",
          }[form];

          return (
            <button
              key={form}
              onClick={() => setActiveForm(form)}
              className={[
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border",
                isActive
                  ? "bg-accent border-accent text-white shadow-xs"
                  : "bg-surface border-border text-muted hover:text-foreground hover:border-accent/40",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Guide Header Box */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-2">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          💡 {rulesData.title}
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          {rulesData.desc}
        </p>
      </div>

      {/* Group Explanations */}
      <div className="grid grid-cols-1 gap-6">
        {/* GROUP 1 CARD (The trickiest!) */}
        <section className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="border-b border-border bg-surface-muted/40 px-5 py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {lang === "en" ? "Group 1 (Godan)" : "Golongan 1 (Godan)"}
              </h4>
              <p className="text-[10px] text-muted font-medium mt-0.5">
                {lang === "en" 
                  ? "Consonant stem verbs. Conjugation changes based on the final hiragana character."
                  : "Kata kerja berakhiran konsonan. Perubahan bentuk tergantung huruf hiragana terakhir."}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-sm uppercase tracking-wider select-none">
              {lang === "en" ? "Ending Rules" : "Aturan Akhiran"}
            </span>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {rulesData.group1Rules.map((rule, idx) => (
              <div key={idx} className="flex flex-col gap-3 border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground font-jp bg-surface-muted border border-border/80 px-2 py-0.5 rounded-lg select-none">
                      {rule.suffix}
                    </span>
                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                      {rule.change}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted/80 bg-background/50 px-2 py-0.5 rounded-md border border-border/20 self-start sm:self-auto select-none">
                    {rule.romajiChange}
                  </span>
                </div>

                {/* Flip Cards Grid for Examples */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                  {rule.examples.map((example, eIdx) => (
                    <div key={eIdx} className="h-28 w-full">
                      <Flashcard
                        frontContent={
                          <div className="w-full h-full rounded-xl border border-border bg-background hover:border-accent/40 p-3.5 flex flex-col justify-between shadow-xs transition-colors">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted select-none">
                                {lang === "en" ? "Dictionary" : "Bentuk Kamus"}
                              </span>
                              <span className="text-[10px] text-accent font-semibold animate-pulse select-none">
                                {lang === "en" ? "Tap to Conjugate" : "Ketuk untuk Ubah"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold font-jp text-foreground">
                                <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey="dictionary" textType="kanji" highlightClass="text-accent/80 font-bold" />
                              </span>
                              <span className="text-[10px] text-muted font-mono">
                                <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey="dictionary" textType="romaji" highlightClass="text-indigo-600 dark:text-indigo-400 font-bold" />
                              </span>
                            </div>
                          </div>
                        }
                        backContent={
                          <div className="w-full h-full rounded-xl border border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10 hover:border-accent/40 p-3.5 flex flex-col justify-between shadow-xs transition-colors">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 dark:text-indigo-400 select-none">
                                {rulesData.title}
                              </span>
                              <span className="text-[9px] text-muted select-none">
                                {example.meaning}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold font-jp text-indigo-600 dark:text-indigo-400">
                                <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey={activeForm} textType="kanji" highlightClass={exampleHighlightClass} />
                              </span>
                              <span className="text-[10px] text-muted font-mono">
                                <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey={activeForm} textType="romaji" highlightClass={exampleHighlightClass} />
                              </span>
                            </div>
                          </div>
                        }
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GROUP 2 & 3 GRIDS (Lighter Rules) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GROUP 2 */}
          <section className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="border-b border-border bg-surface-muted/40 px-5 py-3.5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {lang === "en" ? "Group 2 (Ichidan)" : "Golongan 2 (Ichidan)"}
                </h4>
                <p className="text-[10px] text-muted font-medium mt-0.5">
                  {lang === "en" ? "Ends in -iru or -eru. Simple rule." : "Berakhiran -iru atau -eru. Aturan sederhana."}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-sm uppercase tracking-wider select-none">
                Ichidan
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {rulesData.group2Rules.map((rule, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground font-jp bg-surface-muted border border-border/80 px-2 py-0.5 rounded-lg select-none">
                        {rule.suffix}
                      </span>
                      <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                        {rule.change}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {rule.examples.map((example, eIdx) => (
                      <div key={eIdx} className="h-28 w-full">
                        <Flashcard
                          className="h-full w-full"
                          frontContent={
                            <div className="w-full h-full rounded-xl border border-border bg-background p-3.5 flex flex-col justify-between shadow-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted select-none">
                                  {lang === "en" ? "Dictionary" : "Kamus"}
                                </span>
                                <span className="text-[10px] text-accent font-semibold select-none">
                                  {lang === "en" ? "Tap" : "Ketuk"}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-base font-bold font-jp text-foreground">
                                  <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey="dictionary" textType="kanji" highlightClass="text-accent/80 font-bold" />
                                </span>
                                <span className="text-[10px] text-muted font-mono">
                                  <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey="dictionary" textType="romaji" highlightClass="text-indigo-600 dark:text-indigo-400 font-bold" />
                                </span>
                              </div>
                            </div>
                          }
                          backContent={
                            <div className="w-full h-full rounded-xl border border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10 p-3.5 flex flex-col justify-between shadow-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 dark:text-indigo-400 select-none">
                                  {rulesData.title}
                                </span>
                                <span className="text-[9px] text-muted select-none">
                                  {example.meaning}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-base font-bold font-jp text-indigo-600 dark:text-indigo-400">
                                  <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey={activeForm} textType="kanji" highlightClass={exampleHighlightClass} />
                                </span>
                                <span className="text-[10px] text-muted font-mono">
                                  <ExampleText baseWithParen={example.base} baseRomaji={example.baseRomaji} formKey={activeForm} textType="romaji" highlightClass={exampleHighlightClass} />
                                </span>
                              </div>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GROUP 3 */}
          <section className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="border-b border-border bg-surface-muted/40 px-5 py-3.5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {lang === "en" ? "Group 3 (Irregular)" : "Golongan 3 (Irregular)"}
                </h4>
                <p className="text-[10px] text-muted font-medium mt-0.5">
                  {lang === "en" ? "Irregular verbs. Must be memorized." : "Kata kerja tidak beraturan. Wajib dihafalkan."}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-sm uppercase tracking-wider select-none">
                Irregular
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3">
                {rulesData.group3Rules.map((rule, idx) => (
                  <div key={idx} className="flex flex-col gap-3 bg-background/30 border border-border/60 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground font-jp">{rule.suffix}</span>
                      <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">{rule.change}</span>
                    </div>

                    <div className="h-28 w-full mt-1">
                      <Flashcard
                        className="h-full w-full"
                        frontContent={
                          <div className="w-full h-full rounded-xl border border-border bg-background p-3.5 flex flex-col justify-between shadow-xs">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted select-none">
                                {lang === "en" ? "Dictionary" : "Kamus"}
                              </span>
                              <span className="text-[10px] text-accent font-semibold select-none">
                                {lang === "en" ? "Tap" : "Ketuk"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold font-jp text-foreground">
                                <ExampleText baseWithParen={rule.examples[0].base} baseRomaji={rule.examples[0].baseRomaji} formKey="dictionary" textType="kanji" highlightClass="text-accent/80 font-bold" />
                              </span>
                              <span className="text-[10px] text-muted font-mono">
                                <ExampleText baseWithParen={rule.examples[0].base} baseRomaji={rule.examples[0].baseRomaji} formKey="dictionary" textType="romaji" highlightClass="text-indigo-600 dark:text-indigo-400 font-bold" />
                              </span>
                            </div>
                          </div>
                        }
                        backContent={
                          <div className="w-full h-full rounded-xl border border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10 p-3.5 flex flex-col justify-between shadow-xs">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 dark:text-indigo-400 select-none">
                                {rulesData.title}
                              </span>
                              <span className="text-[9px] text-muted select-none">
                                {rule.examples[0].meaning}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold font-jp text-indigo-600 dark:text-indigo-400">
                                <ExampleText baseWithParen={rule.examples[0].base} baseRomaji={rule.examples[0].baseRomaji} formKey={activeForm} textType="kanji" highlightClass={exampleHighlightClass} />
                              </span>
                              <span className="text-[10px] text-muted font-mono">
                                <ExampleText baseWithParen={rule.examples[0].base} baseRomaji={rule.examples[0].baseRomaji} formKey={activeForm} textType="romaji" highlightClass={exampleHighlightClass} />
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
