"use client";

import React, { useState, useTransition } from "react";
import { Check, X, ArrowRight, Play, AlertCircle } from "lucide-react";
import { mockVerbs, Verb } from "../data/verbs";
import { savePracticeAttempt } from "../actions/katsuyouActions";
import { VerbGroupBadge, JLPTBadge } from "./KatsuyouComponents";
import { HandwritingCanvas } from "@/src/shared/components/HandwritingCanvas";

interface PracticeTabProps {
  formKey: string;
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

// Human-readable form labels
const FORM_LABELS: Record<string, string> = {
  masu: "Masu form",
  te: "Te form",
  ta: "Ta form",
  nai: "Nai form",
  potential: "Potential form",
  volitional: "Volitional form",
  imperative: "Imperative form",
  prohibitive: "Prohibitive form",
  passive: "Passive form",
  causative: "Causative form",
  causativePassive: "Causative-passive form",
  ba: "Ba (conditional) form",
  dictionary: "Dictionary form",
};

// Fill-in-the-blank / transformation templates. Each template's expected answer is
// authored for ITS OWN verb (template.verbId), so the sentence and answer always match.
const SENTENCE_TEMPLATES: Record<
  string,
  { sentence: string; verbId: string; expected: string; kana: string; explanationEn: string }[]
> = {
  te: [
    { sentence: "ここに名前を（　　）ください。", verbId: "kaku", expected: "書いて", kana: "かいて", explanationEn: "Te-form + kudasai makes a polite request. 書く (kaku) → 書いて (kaite)." },
    { sentence: "窓を（　　）もいいですか。", verbId: "akeru", expected: "開けて", kana: "あけて", explanationEn: "Te-form + mo ii desu ka asks for permission. 開ける (akeru) → 開けて (akete)." },
    { sentence: "図書館で大きい声で（　　）はいけません。", verbId: "hanasu", expected: "話して", kana: "はなして", explanationEn: "Te-form + wa ikemasen expresses prohibition. 話す (hanasu) → 話して (hanashite)." },
    { sentence: "彼は今テレビを（　　）います。", verbId: "miru", expected: "見て", kana: "みて", explanationEn: "Te-form + imasu marks a continuous action. 見る (miru) → 見て (mite)." },
  ],
  masu: [
    { sentence: "私たちは毎朝コーヒーを（　　）ます。", verbId: "nomu", expected: "飲み", kana: "のみ", explanationEn: "The masu stem of a Godan verb changes the final -u to -i. 飲む (nomu) → 飲み (nomi)." },
    { sentence: "先生に手紙を（　　）ました。", verbId: "kaku", expected: "書き", kana: "かき", explanationEn: "Masu stem + mashita is the polite past. 書く (kaku) → 書き (kaki)." },
  ],
  ta: [
    { sentence: "私は一度も日本へ（　　）ことがありません。", verbId: "iku", expected: "行った", kana: "いった", explanationEn: "Ta-form + koto ga arimasen states you have never done something. 行く (iku) is irregular → 行った (itta)." },
    { sentence: "風邪をひいた時は薬を（　　）ほうがいいです。", verbId: "nomu", expected: "飲んだ", kana: "のんだ", explanationEn: "Ta-form + hou ga ii gives advice. 飲む (nomu) → 飲んだ (nonda)." },
  ],
  nai: [
    { sentence: "無理を（　　）ください。", verbId: "suru", expected: "しないで", kana: "しないで", explanationEn: "Nai-form + de kudasai is a polite request NOT to do something. する (suru) → しない (shinai) → しないで." },
  ],
  potential: [
    { sentence: "日本語で自分の意見が（　　）ます。", verbId: "hanasu", expected: "話せ", kana: "はなせ", explanationEn: "Potential form expresses ability. 話す (hanasu) → 話せる (hanaseru); the masu stem is 話せ (hanase)." },
  ],
  volitional: [
    { sentence: "来年日本へ留学（　　）と思っています。", verbId: "suru", expected: "しよう", kana: "しよう", explanationEn: "Volitional + to omotte imasu expresses intention. する (suru) → しよう (shiyou)." },
  ],
};

// Lenient normalization for answer comparison (strip spaces & parentheticals)
const normalizeAnswer = (s: string) =>
  s.replace(/\s*[\(（].*?[\)）]/g, "").replace(/\s+/g, "").trim();

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export function PracticeTab({ formKey, onProgressUpdate }: PracticeTabProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [noData, setNoData] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [, startTransition] = useTransition();

  const label = FORM_LABELS[formKey] || formKey;

  // Generate a random question for the selected conjugation form.
  const generateQuestion = (): Question | null => {
    const eligibleVerbs = mockVerbs.filter(
      (v) => v.conjugations[formKey as keyof typeof v.conjugations]?.kanji,
    );
    if (eligibleVerbs.length === 0) return null;

    const templates = SENTENCE_TEMPLATES[formKey];
    const availableTypes: ("A" | "B" | "C" | "D")[] = ["A", "B"];
    if (templates && templates.length > 0) availableTypes.push("C", "D");
    const type = pick(availableTypes);

    // Type C / D: use the template's OWN verb so the sentence and answer always match.
    if ((type === "C" || type === "D") && templates && templates.length > 0) {
      const template = pick(templates);
      const verb =
        mockVerbs.find((v) => v.id === template.verbId) || pick(eligibleVerbs);

      if (type === "C") {
        return {
          type: "C",
          verb,
          prompt: `Fill in the blank with the correct form of '${verb.kanji}' (${verb.kana}):`,
          sentenceContext: template.sentence, // keep the （　　） blank
          expectedAnswer: template.expected,
          displayExpectedKana: template.kana,
          explanation: template.explanationEn,
        };
      }
      return {
        type: "D",
        verb,
        prompt: `Transform the bracketed verb into the ${label}:`,
        sentenceContext: template.sentence.replace("（　　）", `[ ${verb.kanji} ]`),
        expectedAnswer: template.expected,
        displayExpectedKana: template.kana,
        explanation: template.explanationEn,
      };
    }

    const verb = pick(eligibleVerbs);
    const conj = verb.conjugations[formKey as keyof typeof verb.conjugations]!;

    if (type === "A") {
      return {
        type: "A",
        verb,
        prompt: `Convert this verb into the ${label}:`,
        expectedAnswer: conj.kanji,
        displayExpectedKana: conj.kana,
        explanation: `The ${label} of '${verb.kanji}' is '${conj.kanji}' (${conj.kana}).`,
      };
    }

    // Type B: multiple choice with guaranteed non-empty, unique distractors.
    const answer = conj.kanji;
    const distractors = new Set<string>();

    // Distractor source 1: other conjugation forms of the same verb.
    for (const k of Object.keys(verb.conjugations)) {
      if (k === formKey || k === "dictionary") continue;
      const c = verb.conjugations[k as keyof typeof verb.conjugations]?.kanji;
      if (c && c !== answer) distractors.add(c);
      if (distractors.size >= 2) break;
    }

    // Distractor source 2: the same form from other verbs.
    for (const v of shuffle(eligibleVerbs)) {
      if (distractors.size >= 3) break;
      if (v.id === verb.id) continue;
      const c = v.conjugations[formKey as keyof typeof v.conjugations]?.kanji;
      if (c && c !== answer) distractors.add(c);
    }

    const choices = shuffle([answer, ...Array.from(distractors).slice(0, 3)]);

    return {
      type: "B",
      verb,
      prompt: "Select the correct conjugated form:",
      expectedAnswer: answer,
      displayExpectedKana: conj.kana,
      choices,
      explanation: `The correct answer is '${answer}' (${conj.kana}).`,
    };
  };

  const startSession = () => {
    const q = generateQuestion();
    if (!q) {
      setNoData(true);
      return;
    }
    setNoData(false);
    setScore(0);
    setTotalAsked(0);
    setSessionActive(true);
    setCurrentQuestion(q);
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

    const answer = normalizeAnswer(userAnswer);
    const correct =
      answer === normalizeAnswer(currentQuestion.expectedAnswer) ||
      answer === normalizeAnswer(currentQuestion.displayExpectedKana);

    setIsCorrect(correct);
    setIsAnswered(true);
    setTotalAsked((prev) => prev + 1);
    if (correct) setScore((prev) => prev + 1);

    startTransition(async () => {
      await savePracticeAttempt(
        currentQuestion.verb.id,
        formKey,
        `type_${currentQuestion.type.toLowerCase()}`,
        correct,
        userAnswer.trim(),
      );
      if (correct && onProgressUpdate) onProgressUpdate();
    });
  };

  const handleNext = () => {
    const q = generateQuestion();
    if (!q) {
      setNoData(true);
      setSessionActive(false);
      return;
    }
    setCurrentQuestion(q);
    setIsAnswered(false);
    setUserAnswer("");
    setSelectedChoice(null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* ── Start Practice Screen ───────────────────────── */}
      {!sessionActive ? (
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs flex flex-col items-center justify-center text-center gap-6">
          {noData ? (
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <AlertCircle className="w-5 h-5" />
              No exercises available for this form yet.
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shadow-xs">
                <Play className="w-8 h-8 fill-accent/10 ml-1" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-extrabold text-foreground leading-tight">
                  Ready to practice?
                </h3>
                <p className="text-xs text-muted max-w-sm leading-relaxed">
                  Generate dynamic exercises. Practice conjugating verbs,
                  sentence transformation, and fill-in-the-blank.
                </p>
              </div>
              <button
                onClick={startSession}
                className="bg-accent hover:bg-accent/90 active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer select-none"
              >
                Start Practice Session
              </button>
            </>
          )}
        </div>
      ) : (
        /* ── Active Practice Card ────────────────────────── */
        currentQuestion && (
          <div className="flex flex-col gap-6">
            {/* Session Stats Bar */}
            <div className="flex items-center justify-between border border-border/40 bg-surface/50 rounded-2xl px-5 py-3 shadow-2xs select-none">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Practice Session
              </span>
              <div className="flex items-center gap-4 text-xs font-extrabold text-foreground">
                <span>🎯 {score} / {totalAsked}</span>
                <button
                  onClick={() => setSessionActive(false)}
                  className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  End
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
                    {currentQuestion.verb.indonesian}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <JLPTBadge level={currentQuestion.verb.jlpt} />
                  <VerbGroupBadge group={currentQuestion.verb.group} />
                </div>
              </div>

              {/* Context Block (for C & D) */}
              {currentQuestion.sentenceContext && (
                <div className="rounded-2xl bg-background border border-border/45 p-5 flex flex-col gap-1.5 shadow-2xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider select-none leading-none mb-1">
                    Context Sentence
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
                      let btnStyle =
                        "bg-background border-border/40 hover:border-border hover:bg-surface-muted/30 text-foreground/80 hover:text-foreground";
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
                            "w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer select-none font-jp",
                            btnStyle,
                          ].join(" ")}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Text/Handwriting Input (Type A, C, D) */
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider select-none">
                      Your Answer
                    </label>
                    {isAnswered ? (
                      <input
                        type="text"
                        value={userAnswer}
                        disabled
                        className={[
                          "w-full rounded-xl border px-4 py-3 text-sm font-jp transition-all focus:outline-hidden",
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-extrabold"
                            : "bg-red-500/10 border-red-500/30 text-red-500 font-extrabold line-through",
                        ].join(" ")}
                      />
                    ) : (
                      <HandwritingCanvas
                        value={userAnswer}
                        onChange={setUserAnswer}
                        onSubmit={handleSubmit}
                        placeholder="Type or draw answer..."
                        language="ja"
                      />
                    )}
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
                  Submit Answer
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
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                      {!isCorrect && (
                        <div className="text-xs font-bold text-foreground mt-1 select-all">
                          Expected:{" "}
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
                    <span>Next Question</span>
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
