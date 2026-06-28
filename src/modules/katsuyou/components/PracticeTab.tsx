"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Check, X, ArrowRight, Play, Award, HelpCircle, AlertCircle } from "lucide-react";
import { mockVerbs, Verb } from "../data/verbs";
import { savePracticeAttempt } from "../actions/katsuyouActions";
import { VerbGroupBadge, JLPTBadge } from "./KatsuyouComponents";

interface PracticeTabProps {
  formKey: string;
  lang: "en" | "id";
  onProgressUpdate?: () => void;
}

interface Question {
  type: "A" | "B" | "C" | "D";
  verb: Verb;
  prompt: string;
  sentenceContext?: string;
  expectedAnswer: string;
  displayExpectedKana: string;
  choices?: string[];
  explanation: string;
}

// Sentence templates for Type C (Fill-in-the-blank) and Type D (Sentence transformation)
const SENTENCE_TEMPLATES: Record<string, { sentence: string; verbId: string; expected: string; kana: string; explanationEn: string; explanationId: string }[]> = {
  te: [
    { sentence: "ここに名前を（　　）ください。", verbId: "kaku", expected: "書いて", kana: "かいて", explanationEn: "Te-form + kudasai is used to make a polite request. 書く (kaku) changes to 書いて (kaite).", explanationId: "Bentuk Te + kudasai digunakan untuk membuat permohonan sopan. 書く (kaku) berubah menjadi 書いて (kaite)." },
    { sentence: "窓を（　　）もいいですか。", verbId: "akeru", expected: "開けて", kana: "あけて", explanationEn: "Te-form + mo ii desu ka is used to ask for permission. 開ける (akeru) changes to 開けて (akete).", explanationId: "Bentuk Te + mo ii desu ka digunakan untuk meminta izin. 開ける (akeru) berubah menjadi 開けて (akete)." },
    { sentence: "図書館で大きい声で（　　）はいけません。", verbId: "hanasu", expected: "話して", kana: "はなして", explanationEn: "Te-form + wa ikemasen is used to express prohibition. 話す (hanasu) changes to 話して (hanashite).", explanationId: "Bentuk Te + wa ikemasen digunakan untuk menyatakan larangan. 話す (hanasu) berubah menjadi 話して (hanashite)." },
    { sentence: "彼は今テレビを（　　）います。", verbId: "miru", expected: "見て", kana: "みて", explanationEn: "Te-form + imasu is used for continuous action. 見る (miru) changes to 見て (mite).", explanationId: "Bentuk Te + imasu digunakan untuk menyatakan aksi sedang berlangsung. 見る (miru) berubah menjadi 見て (mite)." }
  ],
  masu: [
    { sentence: "私たちは毎朝コーヒーを（　　）ます。", verbId: "nomu", expected: "飲み", kana: "のみ", explanationEn: "Masu stem of Godan verbs is formed by changing the final -u sound to -i. 飲む (nomu) changes to 飲み (nomi).", explanationId: "Stem Masu untuk kata kerja Godan dibentuk dengan mengubah vokal akhiran -u menjadi -i. 飲む (nomu) berubah menjadi 飲み (nomi)." },
    { sentence: "先生に手紙を（　　）ました。", verbId: "kaku", expected: "書き", kana: "かき", explanationEn: "Masu stem + mashita is used for polite past tense. 書く (kaku) changes to 書き (kaki).", explanationId: "Stem Masu + mashita digunakan untuk bentuk sopan lampau. 書く (kaku) berubah menjadi 書き (kaki)." }
  ],
  ta: [
    { sentence: "私は一度も日本へ（　　）ことがありません。", verbId: "iku", expected: "行った", kana: "いった", explanationEn: "Ta-form + koto ga arimasen is used to state you have never experienced doing something. 行く (iku) is an exception, changing to 行った (itta).", explanationId: "Bentuk Ta + koto ga arimasen digunakan untuk menyatakan tidak pernah berpengalaman melakukan sesuatu. 行く (iku) adalah pengecualian, berubah menjadi 行った (itta)." },
    { sentence: "風邪をひいた時は薬を（　　）ほうがいいです。", verbId: "nomu", expected: "飲んだ", kana: "のんだ", explanationEn: "Ta-form + hou ga ii is used for giving advice. 飲む (nomu) changes to 飲んだ (nonda).", explanationId: "Bentuk Ta + hou ga ii digunakan untuk memberikan saran. 飲む (nomu) berubah menjadi 飲んだ (nonda)." }
  ],
  nai: [
    { sentence: "無理を（　　）でください。", verbId: "suru", expected: "しないで", kana: "しないで", explanationEn: "Nai-form + de kudasai is a polite request not to do something. する (suru) changes to しない (shinai).", explanationId: "Bentuk Nai + de kudasai adalah permohonan sopan untuk tidak melakukan sesuatu. する (suru) berubah menjadi しない (shinai)." },
    { sentence: "明日は早く（　　）ければなりません。", verbId: "okiru", expected: "起きな", kana: "おきな", explanationEn: "Nai stem + kereba narimasen is used for obligation. 起きる (okiru) changes to 起きない (okinai), leaving stem 起きな (okina).", explanationId: "Stem Nai + kereba narimasen digunakan untuk menyatakan keharusan. 起きる (okiru) berubah menjadi 起きない (okinai), menyisakan stem 起きな (okina)." }
  ],
  potential: [
    { sentence: "日本語で自分の意見が（　　）ます。", verbId: "hanasu", expected: "話せ", kana: "はなせ", explanationEn: "Potential form expresses ability. 話す (hanasu) potential form is 話せる (hanaseru); stem is 話せ (hanase).", explanationId: "Bentuk potensial menyatakan kemampuan. Bentuk potensial dari 話す (hanasu) adalah 話せる (hanaseru); stem-nya adalah 話せ (hanase)." }
  ],
  volitional: [
    { sentence: "来年日本へ留学（　　）と思っています。", verbId: "suru", expected: "しよう", kana: "しよう", explanationEn: "Volitional form + to omotte imasu expresses plan or intention. する (suru) volitional is しよう (shiyou).", explanationId: "Bentuk Maksud + to omotte imasu menyatakan rencana. Bentuk maksud dari する (suru) adalah しよう (shiyou)." }
  ]
};

export function PracticeTab({ formKey, lang, onProgressUpdate }: PracticeTabProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Generate a random question for the selected conjugation form
  const generateQuestion = (): Question => {
    // 1. Pick a random question type: A, B, C, D (Type C and D only if templates exist, else fallback to A or B)
    const availableTypes: ("A" | "B" | "C" | "D")[] = ["A", "B"];
    const templates = SENTENCE_TEMPLATES[formKey];
    if (templates && templates.length > 0) {
      availableTypes.push("C", "D");
    }

    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    // Pick a random verb
    const eligibleVerbs = mockVerbs.filter((v) => v.conjugations[formKey as keyof typeof v.conjugations]);
    const verb = eligibleVerbs[Math.floor(Math.random() * eligibleVerbs.length)];
    const conj = verb.conjugations[formKey as keyof typeof verb.conjugations];
    if (!conj) {
      throw new Error(`Conjugation form ${formKey} not found for verb ${verb.id}`);
    }

    if (type === "C" || type === "D") {
      // Pick template
      const matchedTemplates = templates.filter((t) => t.verbId === verb.id || mockVerbs.find(mv => mv.id === t.verbId)?.group === verb.group);
      const template = matchedTemplates.length > 0 
        ? matchedTemplates[Math.floor(Math.random() * matchedTemplates.length)]
        : templates[Math.floor(Math.random() * templates.length)];
      
      const templateVerb = mockVerbs.find(mv => mv.id === template.verbId) || verb;
      const targetConj = templateVerb.conjugations[formKey as keyof typeof templateVerb.conjugations];

      // Fill in correct target conjugation values
      let expected = template.expected;
      let kana = template.kana;
      
      // If template was generic, replace with current verb's conjugation parts
      if (template.verbId !== verb.id) {
        if (verb.group === 2) {
          const stemKanji = verb.kanji.slice(0, -1);
          const stemKana = verb.kana.slice(0, -1);
          const suffixKanji = template.expected.slice(templateVerb.kanji.slice(0, -1).length);
          const suffixKana = template.kana.slice(templateVerb.kana.slice(0, -1).length);
          expected = stemKanji + suffixKanji;
          kana = stemKana + suffixKana;
        } else {
          // Fallback to current verb's full conjugation form
          expected = conj.kanji;
          kana = conj.kana;
        }
      }

      if (type === "C") {
        return {
          type: "C",
          verb,
          prompt: lang === "en" 
            ? `Fill in the blank with the correct conjugation of '${verb.kanji}' (${verb.kana}):`
            : `Isi bagian yang kosong dengan konjugasi yang tepat untuk '${verb.kanji}' (${verb.kana}):`,
          sentenceContext: template.sentence.replace("（　　）", `（　${verb.kanji}　）`),
          expectedAnswer: expected,
          displayExpectedKana: kana,
          explanation: lang === "en" ? template.explanationEn : template.explanationId
        };
      } else {
        // Type D: Sentence transformation
        return {
          type: "D",
          verb,
          prompt: lang === "en"
            ? `Transform the verb in parentheses to the target conjugation form:`
            : `Ubah kata kerja di dalam kurung menjadi bentuk konjugasi yang diminta:`,
          sentenceContext: template.sentence.replace("（　　）", `[ ${verb.kanji} ]`),
          expectedAnswer: expected,
          displayExpectedKana: kana,
          explanation: lang === "en" ? template.explanationEn : template.explanationId
        };
      }
    }

    // Type A: Direct conjugation conversion
    if (type === "A") {
      const formLabels = {
        en: { masu: "Masu Form", te: "Te Form", ta: "Ta Form", nai: "Nai Form", potential: "Potential Form", volitional: "Volitional Form", imperative: "Imperative Form", prohibitive: "Prohibitive Form", passive: "Passive Form", causative: "Causative Form", causativePassive: "Causative Passive Form", ba: "Ba Form (Conditional)" },
        id: { masu: "Bentuk Masu", te: "Bentuk Te", ta: "Bentuk Ta", nai: "Bentuk Nai", potential: "Bentuk Potensial", volitional: "Bentuk Maksud", imperative: "Bentuk Perintah", prohibitive: "Bentuk Larangan", passive: "Bentuk Pasif", causative: "Bentuk Kausatif", causativePassive: "Bentuk Kausatif Pasif", ba: "Bentuk Ba (Pengandaian)" }
      }[lang];

      return {
        type: "A",
        verb,
        prompt: lang === "en"
          ? `Convert this verb into the ${formLabels[formKey as keyof typeof formLabels] || formKey}:`
          : `Ubah kata kerja ini menjadi ${formLabels[formKey as keyof typeof formLabels] || formKey}:`,
        expectedAnswer: conj.kanji,
        displayExpectedKana: conj.kana,
        explanation: lang === "en"
          ? `The conjugated form of '${verb.kanji}' is '${conj.kanji}' (${conj.kana}).`
          : `Bentuk perubahan dari '${verb.kanji}' adalah '${conj.kanji}' (${conj.kana}).`
      };
    }

    // Type B: Multiple Choice Quiz
    // Distractor generator
    const incorrectChoices = new Set<string>();
    
    // Distractor 1: another form of same verb
    const otherKeys = Object.keys(verb.conjugations).filter((k) => k !== formKey && k !== "dictionary");
    if (otherKeys.length > 0) {
      const wrongKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
      incorrectChoices.add(verb.conjugations[wrongKey as keyof typeof verb.conjugations]?.kanji || "");
    }

    // Distractor 2: programmatically build plausible fake (e.g. incorrect suffix)
    if (verb.group === 1) {
      incorrectChoices.add(verb.kanji.slice(0, -1) + "て");
      incorrectChoices.add(verb.kanji.slice(0, -1) + "た");
    } else {
      incorrectChoices.add(verb.kanji + "て");
      incorrectChoices.add(verb.kanji.slice(0, -1) + "たな");
    }

    // Distractor 3: conjugation of another verb of the same group
    const sameGroupVerbs = mockVerbs.filter((v) => v.group === verb.group && v.id !== verb.id);
    if (sameGroupVerbs.length > 0) {
      const anotherVerb = sameGroupVerbs[Math.floor(Math.random() * sameGroupVerbs.length)];
      incorrectChoices.add(anotherVerb.conjugations[formKey as keyof typeof anotherVerb.conjugations]?.kanji || "");
    }

    // fallback to ensure 3 incorrect choices
    const allFormConjs = mockVerbs.map(v => v.conjugations[formKey as keyof typeof v.conjugations]?.kanji || "");
    while (incorrectChoices.size < 3) {
      const randomConj = allFormConjs[Math.floor(Math.random() * allFormConjs.length)];
      if (randomConj !== conj.kanji) {
        incorrectChoices.add(randomConj);
      }
    }

    // Assemble choices
    const choicesList = Array.from(incorrectChoices).slice(0, 3);
    choicesList.push(conj.kanji);
    // Shuffle choices
    const choices = choicesList.sort(() => Math.random() - 0.5);

    return {
      type: "B",
      verb,
      prompt: lang === "en"
        ? `Select the correct conjugated form:`
        : `Pilih bentuk konjugasi yang tepat:`,
      expectedAnswer: conj.kanji,
      displayExpectedKana: conj.kana,
      choices,
      explanation: lang === "en"
        ? `The correct answer is '${conj.kanji}' (${conj.kana}).`
        : `Jawaban yang benar adalah '${conj.kanji}' (${conj.kana}).`
    };
  };

  const startSession = () => {
    setScore(0);
    setTotalAsked(0);
    setSessionActive(true);
    setCurrentQuestion(generateQuestion());
    setIsAnswered(false);
    setUserAnswer("");
    setSelectedChoice(null);
  };

  const handleChoiceClick = (choice: string) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    setUserAnswer(choice);
  };

  const handleSubmit = () => {
    if (isAnswered || !currentQuestion) return;

    const trimmedAnswer = userAnswer.trim();
    const correct = trimmedAnswer === currentQuestion.expectedAnswer || 
                    trimmedAnswer === currentQuestion.displayExpectedKana;

    setIsCorrect(correct);
    setIsAnswered(true);
    setTotalAsked((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Save attempt to DB via Server Action
    startTransition(async () => {
      await savePracticeAttempt(
        currentQuestion.verb.id,
        formKey,
        `type_${currentQuestion.type.toLowerCase()}`,
        correct,
        trimmedAnswer
      );
      if (correct && onProgressUpdate) {
        onProgressUpdate();
      }
    });
  };

  const handleNext = () => {
    setCurrentQuestion(generateQuestion());
    setIsAnswered(false);
    setUserAnswer("");
    setSelectedChoice(null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* ── Start Practice Screen ───────────────────────── */}
      {!sessionActive ? (
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs flex flex-col items-center justify-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shadow-xs">
            <Play className="w-8 h-8 fill-accent/10 ml-1" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-extrabold text-foreground leading-tight">
              {lang === "en" ? "Ready to practice?" : "Siap untuk latihan?"}
            </h3>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              {lang === "en"
                ? "Generate dynamic exercises. Practice conjugating verbs, sentence transformation, and fill-in-the-blank."
                : "Hasilkan latihan dinamis. Latih konjugasi kata kerja, transformasi kalimat, dan melengkapi bagian rumpang."}
            </p>
          </div>
          <button
            onClick={startSession}
            className="bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer select-none"
          >
            {lang === "en" ? "Start Practice Session" : "Mulai Sesi Latihan"}
          </button>
        </div>
      ) : (
        /* ── Active Practice Card ────────────────────────── */
        currentQuestion && (
          <div className="flex flex-col gap-6">
            {/* Session Stats Bar */}
            <div className="flex items-center justify-between border border-border/40 bg-surface/50 rounded-2xl px-5 py-3 shadow-2xs select-none">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {lang === "en" ? "Practice Session" : "Sesi Latihan"}
              </span>
              <div className="flex items-center gap-4 text-xs font-extrabold text-foreground">
                <span>🎯 {score} / {totalAsked}</span>
                <button
                  onClick={() => setSessionActive(false)}
                  className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {lang === "en" ? "End" : "Akhiri"}
                </button>
              </div>
            </div>

            {/* Main Question Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col gap-6">
              {/* Question Header & Verb Metadata */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-muted/80 uppercase tracking-wider">
                    {currentQuestion.prompt}
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold font-jp text-foreground leading-none">
                      {currentQuestion.verb.kanji}
                    </h3>
                    <span className="text-xs text-muted font-semibold mt-1">
                      ({currentQuestion.verb.kana})
                    </span>
                  </div>
                  <span className="text-xs text-muted leading-tight">
                    {lang === "en" ? currentQuestion.verb.english : currentQuestion.verb.indonesian}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <JLPTBadge level={currentQuestion.verb.jlpt} />
                  <VerbGroupBadge group={currentQuestion.verb.group} lang={lang} />
                </div>
              </div>

              {/* Context Block (for C & D) */}
              {currentQuestion.sentenceContext && (
                <div className="rounded-2xl bg-background border border-border/45 p-5 flex flex-col gap-1.5 shadow-2xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider select-none leading-none mb-1">
                    {lang === "en" ? "Context Sentence" : "Kalimat Konteks"}
                  </span>
                  <p className="text-lg font-bold font-jp text-foreground leading-snug">
                    {currentQuestion.sentenceContext}
                  </p>
                </div>
              )}

              {/* Answers Section */}
              <div className="flex flex-col gap-3">
                {currentQuestion.type === "B" && currentQuestion.choices ? (
                  /* Multiple Choice (Type B) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.choices.map((choice, i) => {
                      const isSelected = selectedChoice === choice;
                      let btnStyle = "bg-background border-border/40 hover:border-border hover:bg-surface-muted/30 text-foreground/80 hover:text-foreground";
                      if (isAnswered) {
                        if (choice === currentQuestion.expectedAnswer) {
                          btnStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-extrabold";
                        } else if (isSelected) {
                          btnStyle = "bg-red-500/10 border-red-500/30 text-red-500 line-through font-extrabold";
                        } else {
                          btnStyle = "bg-background border-border/20 text-muted opacity-60";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-accent/10 border-accent/40 text-accent font-extrabold";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleChoiceClick(choice)}
                          disabled={isAnswered}
                          className={[
                            "w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer select-none",
                            btnStyle,
                          ].join(" ")}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Text Input (Type A, C, D) */
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="answer-input" className="text-xs font-bold text-muted uppercase tracking-wider select-none">
                      {lang === "en" ? "Your Answer (Kanji or Kana)" : "Jawaban Anda (Kanji atau Kana)"}
                    </label>
                    <input
                      id="answer-input"
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isAnswered}
                      placeholder={lang === "en" ? "Type answer..." : "Ketik jawaban..."}
                      className={[
                        "w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-hidden",
                        isAnswered
                          ? isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-extrabold"
                            : "bg-red-500/10 border-red-500/30 text-red-500 font-extrabold line-through"
                          : "border-border bg-background text-foreground focus:border-accent focus:ring-1 focus:ring-accent",
                      ].join(" ")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isAnswered && userAnswer.trim()) {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Validation Action Button */}
              {!isAnswered ? (
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="w-full bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm py-3 rounded-xl shadow-md disabled:opacity-50 transition-all duration-200 cursor-pointer select-none"
                >
                  {lang === "en" ? "Submit Answer" : "Kirim Jawaban"}
                </button>
              ) : (
                /* Post-Answer Feedback Block */
                <div className="flex flex-col gap-4 border-t border-border/25 pt-5">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0 select-none">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 shrink-0 select-none">
                        <X className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <h4 className={`text-sm font-extrabold ${isCorrect ? "text-emerald-500" : "text-red-500"}`}>
                        {isCorrect 
                          ? lang === "en" ? "Correct!" : "Benar!"
                          : lang === "en" ? "Incorrect" : "Salah"}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                      {!isCorrect && (
                        <div className="text-xs font-bold text-foreground mt-1 select-all">
                          {lang === "en" ? "Expected:" : "Seharusnya:"}{" "}
                          <span className="font-jp text-sm text-accent underline underline-offset-4">
                            {currentQuestion.expectedAnswer}
                          </span>{" "}
                          ({currentQuestion.displayExpectedKana})
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-extrabold text-sm py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                  >
                    <span>{lang === "en" ? "Next Question" : "Pertanyaan Berikutnya"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
