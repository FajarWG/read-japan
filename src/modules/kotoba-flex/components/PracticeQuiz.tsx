"use client";

import React, { useState, useEffect, useRef } from "react";
import { mockVerbs, Verb } from "../data/verbs";
import { Flashcard } from "./Flashcard";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

type ConjugationType = "masu" | "te" | "nai" | "ta";

interface QuizQuestion {
  verb: Verb;
  targetForm: ConjugationType;
  options: string[]; // For multiple choice, in Romaji or Kana/Kanji
  correctAnswer: { kanji: string; kana: string; romaji: string };
}

export function PracticeQuiz() {
  const { lang } = useLanguage();

  // Settings
  const [jlptFilter, setJlptFilter] = useState<string>("all");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [inputMode, setInputMode] = useState<"choice" | "text">("choice");

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Score State
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);

  // Input ref for text input auto-focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize first question
  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jlptFilter, formFilter]);

  // Handle focus when switching to text mode
  useEffect(() => {
    if (inputMode === "text" && !isSubmitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode, currentQuestion, isSubmitted]);

  // Generate random question
  function generateQuestion() {
    // 1. Filter verbs based on JLPT settings
    const availableVerbs = mockVerbs.filter(
      (v) => jlptFilter === "all" || v.jlpt === jlptFilter
    );

    if (availableVerbs.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    // 2. Select a random verb
    const randomVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];

    // 3. Select target form
    const forms: ConjugationType[] = ["masu", "te", "nai", "ta"];
    const targetForm =
      formFilter === "all"
        ? forms[Math.floor(Math.random() * forms.length)]
        : (formFilter as ConjugationType);

    const correctAnswer = randomVerb.conjugations[targetForm];

    // 4. Generate options for multiple choice
    // Grab some wrong answers from other verbs of the same form
    const wrongAnswers: string[] = [];
    const allVerbsWithConjugations = mockVerbs.filter((v) => v.id !== randomVerb.id);

    // Shuffle and pick 3 wrong answers
    const shuffledVerbs = [...allVerbsWithConjugations].sort(() => 0.5 - Math.random());
    for (const v of shuffledVerbs) {
      const wrongConjugation = v.conjugations[targetForm].kanji;
      if (!wrongAnswers.includes(wrongConjugation) && wrongConjugation !== correctAnswer.kanji) {
        wrongAnswers.push(wrongConjugation);
      }
      if (wrongAnswers.length >= 3) break;
    }

    // Fallbacks if not enough verbs
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(correctAnswer.kanji + "る");
    }

    // Mix in the correct answer and shuffle
    const options = [correctAnswer.kanji, ...wrongAnswers].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      verb: randomVerb,
      targetForm,
      options,
      correctAnswer,
    });

    // Reset interaction states
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsFlipped(false);
  }

  // Submit user answer
  const handleSubmitAnswer = (answer: string) => {
    if (isSubmitted || !currentQuestion) return;

    const correct = currentQuestion.correctAnswer;
    const cleanAnswer = answer.trim().toLowerCase();

    // Check matches for Kanji, Kana or Romaji
    const isAnswerCorrect =
      cleanAnswer === correct.kanji.toLowerCase() ||
      cleanAnswer === correct.kana.toLowerCase() ||
      cleanAnswer === correct.romaji.toLowerCase();

    setUserAnswer(answer);
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);

    // Update stats
    setTotalQuestions((prev) => prev + 1);
    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Trigger 3D Flashcard Flip automatically after a minor delay
    setTimeout(() => {
      setIsFlipped(true);
    }, 200);
  };

  // Reset Score
  const handleResetScore = () => {
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    generateQuestion();
  };

  // Form Label Helper
  const getFormLabel = (form: ConjugationType) => {
    switch (form) {
      case "masu":
        return "Masu-form (~ます)";
      case "te":
        return "Te-form (~て)";
      case "nai":
        return "Nai-form (~ない)";
      case "ta":
        return "Ta-form (~た)";
    }
  };

  // Explanation Helper for Conjugation Rule
  const getConjugationExplanation = (verb: Verb, form: ConjugationType) => {
    const isGr1 = verb.group === 1;
    const isGr2 = verb.group === 2;
    const isGr3 = verb.group === 3;

    if (form === "te" || form === "ta") {
      const suffix = form === "te" ? "te/de" : "ta/da";
      if (isGr3) {
        return lang === "en"
          ? `${verb.kanji} is a Group 3 irregular verb. Its ${form}-form must be memorized.`
          : `${verb.kanji} adalah kata kerja irregular Golongan 3. Bentuk ${form}-nya harus dihafalkan.`;
      }
      if (isGr2) {
        return lang === "en"
          ? `${verb.kanji} is a Group 2 (Ichidan) verb. Drop the ending -ru and add -${suffix}.`
          : `${verb.kanji} adalah kata kerja Golongan 2 (Ichidan). Cukup buang akhiran -ru lalu tambahkan -${suffix}.`;
      }
      if (verb.subGroup === "exception") {
        return lang === "en"
          ? `${verb.kanji} (iku) is a Group 1 exception. Its ${form}-form changes to ${verb.conjugations[form].kanji}.`
          : `${verb.kanji} (iku) adalah pengecualian Golongan 1. Bentuk ${form}-nya berubah menjadi ${verb.conjugations[form].kanji}.`;
      }
      if (verb.subGroup === "exception-ru") {
        return lang === "en"
          ? `${verb.kanji} (kaeru) looks like a Group 2 verb but is actually a Group 1 exception. Ends in -ru so it changes to -tte/-tta.`
          : `${verb.kanji} (kaeru) terlihat seperti Golongan 2 tetapi sebenarnya pengecualian Golongan 1. Berakhiran -ru sehingga berubah menjadi -tte/-tta.`;
      }

      // Group 1 sub groups
      const endings = {
        u: "う (u) → って/った (tte/tta)",
        tsu: "つ (tsu) → って/った (tte/tta)",
        ru: "る (ru) → って/った (tte/tta)",
        mu: "む (mu) → んで/んだ (nde/nda)",
        bu: "ぶ (bu) → んで/んだ (nde/nda)",
        nu: "ぬ (nu) → んで/んだ (nde/nda)",
        ku: "く (ku) → いて/いた (ite/ita)",
        gu: "ぐ (gu) → いで/いだ (ide/ida)",
        su: "す (su) → して/した (shite/shita)",
      }[verb.subGroup || ""];

      return lang === "en"
        ? `${verb.kanji} is a Group 1 verb. Sub-group end: ${endings || verb.subGroup}.`
        : `${verb.kanji} adalah kata kerja Golongan 1. Perubahan akhiran: ${endings || verb.subGroup}.`;
    }

    if (form === "masu") {
      if (isGr3) return lang === "en" ? "Irregular Group 3. Memorize form." : "Irregular Golongan 3. Wajib dihafalkan.";
      if (isGr2) return lang === "en" ? "Group 2. Drop -ru, add -masu." : "Golongan 2. Hilangkan -ru, tambahkan -masu.";
      return lang === "en"
        ? `Group 1. Change the last u-row hiragana to i-row, and add -masu (e.g. ${verb.romaji} → ${verb.conjugations.masu.romaji}).`
        : `Golongan 1. Ubah hiragana baris -u terakhir ke baris -i, lalu tambahkan -masu (contoh: ${verb.romaji} → ${verb.conjugations.masu.romaji}).`;
    }

    if (form === "nai") {
      if (isGr3) return lang === "en" ? "Irregular Group 3. Memorize form." : "Irregular Golongan 3. Wajib dihafalkan.";
      if (isGr2) return lang === "en" ? "Group 2. Drop -ru, add -nai." : "Golongan 2. Hilangkan -ru, tambahkan -nai.";
      if (verb.subGroup === "u") {
        return lang === "en"
          ? `Group 1 ending in -u. Change -u to -wa (not -a) and add -nai (e.g. kau → kawanai).`
          : `Golongan 1 berakhiran -u. Ubah huruf -u terakhir menjadi -wa (bukan -a) lalu tambahkan -nai (contoh: kau → kawanai).`;
      }
      return lang === "en"
        ? `Group 1. Change the last u-row hiragana to a-row, and add -nai.`
        : `Golongan 1. Ubah hiragana baris -u terakhir ke baris -a, lalu tambahkan -nai.`;
    }

    return "";
  };

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Quiz Configuration Panel */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* JLPT Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-muted uppercase tracking-wider select-none">
              JLPT Range
            </span>
            <select
              value={jlptFilter}
              onChange={(e) => setJlptFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="all">{lang === "en" ? "All Levels (N5 - N3)" : "Semua Level (N5 - N3)"}</option>
              <option value="N5">N5 Only</option>
              <option value="N4">N4 Only</option>
              <option value="N3">N3 Only</option>
            </select>
          </div>

          {/* Form Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-muted uppercase tracking-wider select-none">
              {lang === "en" ? "Target Form" : "Bentuk Target"}
            </span>
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value="all">{lang === "en" ? "Random Form" : "Semua Bentuk (Acak)"}</option>
              <option value="te">Te-form (~て)</option>
              <option value="ta">Ta-form (~た)</option>
              <option value="masu">Masu-form (~ます)</option>
              <option value="nai">Nai-form (~ない)</option>
            </select>
          </div>

          {/* Input Mode Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-muted uppercase tracking-wider select-none">
              {lang === "en" ? "Input Mode" : "Metode Kuis"}
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-background border border-border p-1">
              <button
                onClick={() => setInputMode("choice")}
                className={[
                  "py-1 text-xs font-bold rounded-lg cursor-pointer transition-all",
                  inputMode === "choice"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {lang === "en" ? "Choice" : "Pilgan"}
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={[
                  "py-1 text-xs font-bold rounded-lg cursor-pointer transition-all",
                  inputMode === "text"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-muted hover:text-foreground",
                ].join(" ")}
              >
                {lang === "en" ? "Type Answer" : "Ketik"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-xs flex justify-between items-center text-xs">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-muted font-semibold uppercase text-[10px] select-none">
              {lang === "en" ? "Score" : "Skor"}
            </span>
            <span className="text-base font-bold text-foreground">
              {score} <span className="text-xs text-muted">/ {totalQuestions}</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted font-semibold uppercase text-[10px] select-none">
              {lang === "en" ? "Accuracy" : "Akurasi"}
            </span>
            <span className="text-base font-bold text-foreground">
              {accuracy}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak >= 3 && (
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 select-none">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-amber-500">{streak} Streak</span>
            </div>
          )}
          <button
            onClick={handleResetScore}
            className="text-[10px] font-bold text-muted hover:text-red-500 px-2 py-1 rounded-md border border-border/80 hover:border-red-500/30 bg-background transition-colors cursor-pointer"
          >
            {lang === "en" ? "Reset Stats" : "Reset Skor"}
          </button>
        </div>
      </div>

      {/* Main Flashcard Quiz Panel */}
      {currentQuestion ? (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Reusable 3D Flashcard showing question / result */}
          <div className="w-full h-80 max-w-xl">
            <Flashcard
              isFlippedExternal={isFlipped}
              onFlipChange={(flipped) => {
                // Only allow flip back manually if it is submitted
                if (isSubmitted) setIsFlipped(flipped);
              }}
              frontContent={
                <div className="w-full h-full rounded-2xl border border-border bg-surface p-6 shadow-md flex flex-col justify-between transition-colors">
                  {/* Top Header */}
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted select-none">
                      {lang === "en" ? "Practice Conjugation" : "Latihan Perubahan"}
                    </span>
                    <div className="flex gap-1">
                      <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold text-accent select-none">
                        {currentQuestion.verb.jlpt}
                      </span>
                      <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 select-none">
                        Gr. {currentQuestion.verb.group}
                      </span>
                    </div>
                  </div>

                  {/* Main Question Body */}
                  <div className="flex flex-col items-center justify-center my-auto py-4 text-center">
                    <span className="text-xs text-muted mb-1 select-none">
                      {lang === "en" ? "Conjugate this verb:" : "Ubah kata kerja berikut:"}
                    </span>
                    <h2 className="text-3xl font-bold text-foreground font-jp mb-1">
                      {currentQuestion.verb.kanji}
                    </h2>
                    <span className="text-sm font-semibold text-indigo-500 font-mono">
                      {currentQuestion.verb.romaji} ({lang === "en" ? currentQuestion.verb.english : currentQuestion.verb.indonesian})
                    </span>

                    <div className="mt-4 px-4 py-2 bg-accent/5 dark:bg-accent/10 border border-accent/20 rounded-xl">
                      <span className="text-xs font-bold text-foreground select-none">
                        {lang === "en" ? "Target Form:" : "Bentuk Target:"}{" "}
                      </span>
                      <span className="text-xs font-bold text-accent font-jp">
                        {getFormLabel(currentQuestion.targetForm)}
                      </span>
                    </div>
                  </div>

                  {/* Footer hint */}
                  <div className="text-center text-[10px] text-muted select-none">
                    {lang === "en"
                      ? "Submit answer below to flip card!"
                      : "Jawab di bawah untuk membalik kartu!"}
                  </div>
                </div>
              }
              backContent={
                <div
                  className={[
                    "w-full h-full rounded-2xl border p-6 shadow-md flex flex-col justify-between transition-colors",
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-50/5 dark:bg-emerald-950/10"
                      : "border-rose-500/30 bg-rose-50/5 dark:bg-rose-950/10",
                  ].join(" ")}
                >
                  {/* Result Header */}
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span
                      className={[
                        "text-[10px] uppercase font-bold tracking-wider select-none",
                        isCorrect ? "text-emerald-500" : "text-rose-500",
                      ].join(" ")}
                    >
                      {isCorrect
                        ? (lang === "en" ? "CORRECT! 🎉" : "BENAR! 🎉")
                        : (lang === "en" ? "INCORRECT ❌" : "SALAH ❌")}
                    </span>
                    <span className="text-[9px] text-muted select-none">
                      {lang === "en" ? "Click card to see question" : "Klik kartu untuk lihat soal"}
                    </span>
                  </div>

                  {/* Correct Answer Details */}
                  <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
                    <span className="text-xs text-muted mb-0.5 select-none">
                      {lang === "en" ? "Correct Answer:" : "Jawaban Benar:"}
                    </span>
                    <h2 className="text-2xl font-bold text-foreground font-jp mb-1">
                      {currentQuestion.correctAnswer.kanji}
                    </h2>
                    <span className="text-xs text-muted font-mono leading-none">
                      {currentQuestion.correctAnswer.kana} · {currentQuestion.correctAnswer.romaji}
                    </span>

                    {/* Short grammar rule explanation */}
                    <p className="mt-3 px-3 py-2.5 bg-background border border-border/50 text-[11px] text-muted leading-relaxed rounded-xl max-w-sm">
                      <span className="font-bold text-foreground block mb-0.5 select-none">
                        💡 {lang === "en" ? "Grammar Explanation:" : "Penjelasan Aturan:"}
                      </span>
                      {getConjugationExplanation(currentQuestion.verb, currentQuestion.targetForm)}
                    </p>
                  </div>

                  {/* Action button to continue */}
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid flipping the card again
                        generateQuestion();
                      }}
                      className="w-full max-w-xs py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer select-none"
                    >
                      {lang === "en" ? "Next Question →" : "Pertanyaan Selanjutnya →"}
                    </button>
                  </div>
                </div>
              }
              className="h-full w-full"
            />
          </div>

          {/* Interactive Answer Input Controls (Only visible before submission) */}
          <div className="w-full max-w-xl mt-2">
            {!isSubmitted ? (
              inputMode === "choice" ? (
                /* Multiple Choice Options */
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmitAnswer(opt)}
                      className="py-3 px-4 border border-border bg-surface hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 rounded-2xl text-xs font-bold font-jp text-foreground transition-all cursor-pointer shadow-2xs text-center"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                /* Text Input Fields */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (userAnswer.trim()) handleSubmitAnswer(userAnswer);
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Type answer in Romaji/Hiragana (e.g., itte)..."
                        : "Ketik jawaban dalam Romaji/Hiragana (contoh: itte)..."
                    }
                    className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-xs text-foreground placeholder:text-muted/60 font-mono transition-all focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className="px-5 bg-accent hover:bg-accent/90 disabled:bg-accent/40 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-xs"
                  >
                    {lang === "en" ? "Submit" : "Kirim"}
                  </button>
                </form>
              )
            ) : (
              /* Submission feedback (Success/Failure status) */
              <div className="text-center">
                <span
                  className={[
                    "text-xs font-bold select-none",
                    isCorrect ? "text-emerald-500" : "text-rose-500",
                  ].join(" ")}
                >
                  {isCorrect
                    ? (lang === "en"
                        ? `Correct! The card flipped to show the rule.`
                        : `Benar! Kartu di balik untuk menampilkan aturan.`)
                    : (lang === "en"
                        ? `Incorrect. Your answer was "${userAnswer}". Click card to review.`
                        : `Salah. Jawabanmu adalah "${userAnswer}". Klik kartu untuk review.`)}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-xs">
          <p className="text-sm text-muted">
            {lang === "en"
              ? "No verbs available. Check your filters!"
              : "Tidak ada kata kerja tersedia. Periksa kembali filter Anda!"}
          </p>
        </div>
      )}
    </div>
  );
}
