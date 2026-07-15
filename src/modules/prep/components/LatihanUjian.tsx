"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Button, Card, Popover, TextArea, Input } from "@heroui/react";
import examPredictionsRaw from "@/scripts/ujian_bab10-12_prediksi.json";

// Definisi Interface Tipe Data untuk Type Safety
interface Question {
  id: string;
  script?: string;
  prompt?: string;
  sentence?: string;
  answer?: string | string[];
  sample_answer?: string | string[];
  statement?: string;
  context?: string;
}

interface DialogueItem {
  speaker: string;
  text: string;
  blank_answer?: string | string[] | null;
}

interface ConjugationItem {
  dictionary: string;
  nai_form?: string;
  ta_form?: string;
  nakatta_form?: string;
}

interface ExamSection {
  number: number;
  type: string;
  instruction: string;
  points_each: number;
  passage?: string;
  options?: Record<string, string>;
  questions?: Question[];
  dialogue?: DialogueItem[];
  items?: ConjugationItem[];
}

interface ExamVariation {
  id: string;
  predicted_most_likely: boolean;
  total_points: number;
  sections: ExamSection[];
}

const examPredictions = examPredictionsRaw as {
  meta: {
    title: string;
    source_basis: string;
    chapters_covered: string[];
    grammar_points: string[];
    recommended_variation: string;
    recommendation_reason: string;
  };
  variations: ExamVariation[];
};

interface LatihanUjianProps {
  onBackToMenu: () => void;
}

export function LatihanUjian({ onBackToMenu }: LatihanUjianProps) {
  const [selectedVarId, setSelectedVarId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Ambil variasi soal yang dipilih
  const variation = useMemo(() => {
    if (!selectedVarId) return null;
    return examPredictions.variations.find((v) => v.id === selectedVarId) || null;
  }, [selectedVarId]);

  // Hitung jumlah soal/blank yang sudah diisi vs total
  const statsTracker = useMemo(() => {
    if (!variation) return { filled: 0, total: 0 };

    let totalBlanks = 0;
    let filledBlanks = 0;

    variation.sections.forEach((section: ExamSection, secIdx: number) => {
      if (section.type === "listening" && section.questions) {
        section.questions.forEach((q: Question) => {
          totalBlanks++;
          const val = answers[`sec_${secIdx}_listening_${q.id}`];
          if (Array.isArray(val) ? val.length > 0 : val && val.trim() !== "") {
            filledBlanks++;
          }
        });
      } else if (section.type === "fill_particle_in_dialogue" && section.dialogue) {
        section.dialogue.forEach((dialogueItem: DialogueItem, diagIdx: number) => {
          if (!dialogueItem.blank_answer) return;
          const expectedAnswers = Array.isArray(dialogueItem.blank_answer)
            ? dialogueItem.blank_answer
            : [dialogueItem.blank_answer];
          expectedAnswers.forEach((_, blankIdx: number) => {
            totalBlanks++;
            const val = answers[`sec_${secIdx}_dialogue_${diagIdx}_blank_${blankIdx}`];
            if (val && val.trim() !== "") filledBlanks++;
          });
        });
      } else if (section.type === "conjugation_table" && section.items) {
        section.items.forEach((item: ConjugationItem, itemIdx: number) => {
          const formKeys = Object.keys(item).filter((k) => k !== "dictionary");
          formKeys.forEach((formKey: string) => {
            totalBlanks++;
            const val = answers[`sec_${secIdx}_conj_${itemIdx}_${formKey}`];
            if (val && val.trim() !== "") filledBlanks++;
          });
        });
      } else if (section.type === "grammar_transform" && section.questions) {
        section.questions.forEach((q: Question) => {
          const expectedAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
          expectedAnswers.forEach((_, blankIdx: number) => {
            totalBlanks++;
            const val = answers[`sec_${secIdx}_grammar_${q.id}_blank_${blankIdx}`];
            if (val && val.trim() !== "") filledBlanks++;
          });
        });
      } else if (section.type === "dialogue_completion" && section.questions) {
        section.questions.forEach((q: Question) => {
          const expectedAnswers = Array.isArray(q.sample_answer) ? q.sample_answer : [q.sample_answer];
          expectedAnswers.forEach((_, blankIdx: number) => {
            totalBlanks++;
            const val = answers[`sec_${secIdx}_completion_${q.id}_blank_${blankIdx}`];
            if (val && val.trim() !== "") filledBlanks++;
          });
        });
      } else if (section.type === "true_false_reading" && section.questions) {
        section.questions.forEach((q: Question) => {
          totalBlanks++;
          const val = answers[`sec_${secIdx}_tf_${q.id}`];
          if (val) filledBlanks++;
        });
      } else if (section.type === "short_essay" && section.questions) {
        section.questions.forEach((q: Question) => {
          totalBlanks++;
          const val = answers[`sec_${secIdx}_essay_${q.id}`];
          if (val && val.trim() !== "") filledBlanks++;
        });
      }
    });

    return { filled: filledBlanks, total: totalBlanks };
  }, [answers, variation]);

  // Fungsi helper untuk memeriksa kecocokan jawaban
  const checkAnswer = (userVal: any, expectedVal: any): boolean => {
    if (!userVal) return false;
    const cleanUser = String(userVal).toLowerCase().trim();

    if (Array.isArray(expectedVal)) {
      return expectedVal.some((v) => String(v).toLowerCase().trim() === cleanUser);
    }
    return String(expectedVal).toLowerCase().trim() === cleanUser;
  };

  // Hitung skor otomatis
  const examScore = useMemo(() => {
    if (!variation) return { earned: 0, total: 0, percentage: 0 };

    let totalMaxPoints = 0;
    let userEarnedPoints = 0;

    variation.sections.forEach((section: ExamSection, secIdx: number) => {
      if (section.type === "short_essay") return;

      const pointsEach = section.points_each || 1;

      if (section.type === "listening" && section.questions) {
        section.questions.forEach((q: Question) => {
          const key = `sec_${secIdx}_listening_${q.id}`;
          const val = answers[key];

          if (section.options) {
            const expected = q.answer;
            if (Array.isArray(expected)) {
              const userArr = Array.isArray(val) ? val : val ? [val] : [];
              const allMatch =
                expected.length === userArr.length &&
                expected.every((item) => userArr.includes(item));
              totalMaxPoints += pointsEach;
              if (allMatch) userEarnedPoints += pointsEach;
            } else {
              totalMaxPoints += pointsEach;
              if (val && checkAnswer(val, expected)) {
                userEarnedPoints += pointsEach;
              }
            }
          } else {
            totalMaxPoints += pointsEach;
            if (val && checkAnswer(val, q.answer)) {
              userEarnedPoints += pointsEach;
            }
          }
        });
      } else if (section.type === "fill_particle_in_dialogue" && section.dialogue) {
        section.dialogue.forEach((dialogueItem: DialogueItem, diagIdx: number) => {
          if (!dialogueItem.blank_answer) return;
          const expectedAnswers = Array.isArray(dialogueItem.blank_answer)
            ? dialogueItem.blank_answer
            : [dialogueItem.blank_answer];

          expectedAnswers.forEach((expected, blankIdx: number) => {
            const key = `sec_${secIdx}_dialogue_${diagIdx}_blank_${blankIdx}`;
            const val = answers[key] || "";
            totalMaxPoints += pointsEach;
            if (checkAnswer(val, expected)) {
              userEarnedPoints += pointsEach;
            }
          });
        });
      } else if (section.type === "conjugation_table" && section.items) {
        section.items.forEach((item: ConjugationItem, itemIdx: number) => {
          const formKeys = Object.keys(item).filter((k) => k !== "dictionary");
          formKeys.forEach((formKey: string) => {
            const key = `sec_${secIdx}_conj_${itemIdx}_${formKey}`;
            const val = answers[key] || "";
            const expected = item[formKey as keyof typeof item];
            totalMaxPoints += pointsEach;
            if (checkAnswer(val, expected)) {
              userEarnedPoints += pointsEach;
            }
          });
        });
      } else if (section.type === "grammar_transform" && section.questions) {
        section.questions.forEach((q: Question) => {
          const expectedAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
          expectedAnswers.forEach((expected, blankIdx: number) => {
            const key = `sec_${secIdx}_grammar_${q.id}_blank_${blankIdx}`;
            const val = answers[key] || "";
            totalMaxPoints += pointsEach;
            if (checkAnswer(val, expected)) {
              userEarnedPoints += pointsEach;
            }
          });
        });
      } else if (section.type === "dialogue_completion" && section.questions) {
        section.questions.forEach((q: Question) => {
          const expectedAnswers = Array.isArray(q.sample_answer) ? q.sample_answer : [q.sample_answer];
          expectedAnswers.forEach((expected, blankIdx: number) => {
            const key = `sec_${secIdx}_completion_${q.id}_blank_${blankIdx}`;
            const val = answers[key] || "";
            totalMaxPoints += pointsEach;
            if (checkAnswer(val, expected)) {
              userEarnedPoints += pointsEach;
            }
          });
        });
      } else if (section.type === "true_false_reading" && section.questions) {
        section.questions.forEach((q: Question) => {
          const key = `sec_${secIdx}_tf_${q.id}`;
          const val = answers[key] || "";
          totalMaxPoints += pointsEach;
          if (checkAnswer(val, q.answer)) {
            userEarnedPoints += pointsEach;
          }
        });
      }
    });

    const percentage = totalMaxPoints > 0 ? Math.round((userEarnedPoints / totalMaxPoints) * 100) : 0;
    return { earned: userEarnedPoints, total: totalMaxPoints, percentage };
  }, [answers, variation]);

  // Handle perubahan input jawaban
  const handleAnswerChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleBackToSelect = () => {
    if (statsTracker.filled > 0 && !isSubmitted) {
      if (!window.confirm("Progress latihan akan hilang jika Anda kembali. Lanjutkan?")) {
        return;
      }
    }
    setSelectedVarId(null);
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    const uncompleted = statsTracker.total - statsTracker.filled;
    let confirmMsg = "Apakah Anda yakin ingin mengumpulkan jawaban?";
    if (uncompleted > 0) {
      confirmMsg = `Masih ada ${uncompleted} kolom jawaban kosong. ${confirmMsg}`;
    }
    if (window.confirm(confirmMsg)) {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang latihan ini dari awal?")) {
      setAnswers({});
      setIsSubmitted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper parser grammar transform: Sembunyikan jawaban sesudah tanda panah
  const parseGrammarSentence = (sentence: string) => {
    return sentence.replace(/（\s*([^→\)]+?)→([^）\s]+?)\s*）/g, "（ $1 ）");
  };

  // Menu Pemilihan Variasi Soal (A/B/C)
  if (!selectedVarId || !variation) {
    return (
      <div className="flex flex-col gap-6 animate-page-enter">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              🎯 Latihan Ujian Bab 10-12
            </h2>
            <p className="text-xs text-muted mt-1">
              Pilih salah satu variasi soal prediksi untuk melatih kemampuan tata bahasa dan pemahaman bacaan Anda.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="text-xs font-semibold cursor-pointer border border-border bg-background rounded-xl shrink-0"
            onClick={onBackToMenu}
          >
            ← Menu Utama
          </Button>
        </div>

        {/* Variasi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examPredictions.variations.map((v: ExamVariation) => {
            const isRecommended = v.id === examPredictions.meta.recommended_variation;
            return (
              <Card
                key={v.id}
                onClick={() => setSelectedVarId(v.id)}
                className={[
                  "group border p-6 flex flex-col justify-between h-80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer",
                  isRecommended
                    ? "border-amber-400 bg-surface dark:border-amber-500/50 hover:border-amber-500"
                    : "border-border bg-surface hover:border-indigo-500"
                ].join(" ")}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl font-extrabold text-indigo-500 dark:text-indigo-400">
                      Variasi {v.id}
                    </span>
                    {v.predicted_most_likely && (
                      <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full shadow-xs animate-bounce">
                        ✨ Terpopuler / Paling Mungkin Keluar
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    Menyediakan total <b>{v.total_points} Poin</b> yang tersebar di <b>{v.sections.length} Bagian Ujian</b> yang bervariasi.
                  </p>

                  {/* Alasan Rekomendasi */}
                  {isRecommended && (
                    <div className="mt-2 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-2.5 rounded-xl flex items-start gap-1.5 leading-relaxed">
                      <span>💡</span>
                      <div>
                        <strong>Rekomendasi Ujian:</strong> {examPredictions.meta.recommendation_reason}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  {/* Tooltip detail/info */}
                  <Popover>
                    <Popover.Trigger>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-muted hover:text-foreground underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                      >
                        ℹ️ Rincian Soal
                      </button>
                    </Popover.Trigger>
                    <Popover.Content className="p-3 max-w-72 bg-surface border border-border shadow-lg rounded-xl z-50" placement="top">
                      <Popover.Dialog>
                        <div className="text-xs flex flex-col gap-2">
                          <strong className="text-foreground">Daftar Bagian (Variasi {v.id}):</strong>
                          <ul className="list-disc pl-4 space-y-1 text-muted">
                            {v.sections.map((sec: ExamSection) => (
                              <li key={sec.number}>
                                Bagian {sec.number}: {sec.type.replace(/_/g, " ")} ({sec.points_each} poin)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Popover.Dialog>
                    </Popover.Content>
                  </Popover>

                  <Button
                    variant="secondary"
                    className={[
                      "font-semibold transition-colors cursor-pointer rounded-xl text-xs py-2 px-4 border-none",
                      isRecommended
                        ? "bg-amber-50 text-white group-hover:bg-amber-600"
                        : "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white"
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVarId(v.id);
                    }}
                  >
                    Kerjakan Variasi {v.id}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Halaman Pengerjaan Soal (Variation is selected)
  return (
    <div className="flex flex-col gap-6 animate-page-enter">
      {/* Sticky Dashboard Panel */}
      <div className="sticky top-2 z-40 flex flex-col gap-3 rounded-2xl border border-border bg-surface/90 backdrop-blur-md p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-jp text-lg font-bold text-foreground">
              Latihan Ujian — Variasi {selectedVarId}
            </span>
            <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-semibold">
              Bab 10-12
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {!isSubmitted ? (
              <span>Terisi: {statsTracker.filled} dari {statsTracker.total} kolom jawaban</span>
            ) : (
              <span>Hasil Penilaian Ujian</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tampilan Hasil Skor */}
          {isSubmitted && (
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl mr-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Skor Akhir</span>
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {examScore.percentage}%
                </span>
              </div>
              <div className="h-8 w-[1px] bg-indigo-500/20" />
              <div className="text-xs text-muted">
                <b>{examScore.earned}</b> / {examScore.total} Poin otomatis
              </div>
            </div>
          )}

          <Button
            size="sm"
            variant="secondary"
            className="text-xs font-semibold cursor-pointer border border-border bg-background rounded-xl"
            onClick={handleBackToSelect}
          >
            ← Kembali
          </Button>

          {!isSubmitted ? (
            <Button
              size="sm"
              variant="primary"
              className="text-xs font-bold cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs border-none"
              onClick={handleSubmit}
            >
              Submit Jawaban
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              className="text-xs font-bold cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs border-none animate-pulse"
              onClick={handleReset}
            >
              Ulangi Latihan
            </Button>
          )}
        </div>
      </div>

      {/* Daftar Soal */}
      <div className="flex flex-col gap-6">
        {variation.sections.map((section: ExamSection, secIdx: number) => {
          return (
            <Card key={section.number} className="border border-border bg-surface p-6 shadow-xs rounded-2xl flex flex-col gap-4">
              {/* Header Bagian */}
              <div className="border-b border-border pb-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
                    Bagian {section.number} — {section.type.replace(/_/g, " ")}
                  </span>
                  <h3 className="font-jp text-base font-bold text-foreground mt-0.5">
                    {section.instruction}
                  </h3>
                </div>
                <span className="text-xs bg-slate-500/10 text-muted px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap">
                  {section.points_each} poin / {section.type === "fill_particle_in_dialogue" || section.type === "conjugation_table" ? "isian" : "soal"}
                </span>
              </div>

              {/* Soal: Listening */}
              {section.type === "listening" && section.questions && (
                <div className="flex flex-col gap-4">
                  {section.questions.map((q: Question) => {
                    const answerKey = `sec_${secIdx}_listening_${q.id}`;
                    const val = answers[answerKey];

                    // Teks Pengganti Audio (Script)
                    return (
                      <div key={q.id} className="flex flex-col gap-3 p-4 border border-border bg-surface-muted/30 rounded-2xl">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase">Script Pengganti Audio:</span>
                          <p className="font-jp text-sm leading-relaxed p-2.5 bg-background border border-border rounded-xl text-foreground">
                            {q.script}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            Soal: {q.prompt}
                          </span>

                          {/* Jika ada opsi pilihan ganda / checkbox (Variation C) */}
                          {section.options ? (
                            <div className="flex flex-col gap-2 mt-1">
                              {Object.entries(section.options).map(([optKey, optVal]: [string, string]) => {
                                const isArrayAns = Array.isArray(q.answer);
                                const isChecked = isArrayAns
                                  ? Array.isArray(val) && val.includes(optKey)
                                  : val === optKey;

                                const isExpected = isArrayAns
                                  ? (q.answer as string[]).includes(optKey)
                                  : q.answer === optKey;

                                return (
                                  <label
                                    key={optKey}
                                    className={[
                                      "flex items-center gap-2.5 p-2 rounded-lg border text-sm cursor-pointer transition-all",
                                      isSubmitted
                                        ? isExpected
                                          ? "border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-semibold"
                                          : isChecked
                                            ? "border-red-500 bg-red-500/5 text-red-700 dark:text-red-300"
                                            : "border-border text-muted"
                                        : isChecked
                                          ? "border-indigo-500 bg-indigo-500/5 text-indigo-600 font-medium"
                                          : "border-border hover:bg-surface-muted/50 text-foreground"
                                    ].join(" ")}
                                  >
                                    <input
                                      type={isArrayAns ? "checkbox" : "radio"}
                                      name={answerKey}
                                      checked={isChecked}
                                      disabled={isSubmitted}
                                      onChange={() => {
                                        if (isSubmitted) return;
                                        if (isArrayAns) {
                                          const prevArr = Array.isArray(val) ? val : val ? [val] : [];
                                          const newArr = prevArr.includes(optKey)
                                            ? prevArr.filter((k: string) => k !== optKey)
                                            : [...prevArr, optKey];
                                          handleAnswerChange(answerKey, newArr);
                                        } else {
                                          handleAnswerChange(answerKey, optKey);
                                        }
                                      }}
                                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                    />
                                    <span>
                                      ({optKey}) {optVal}
                                    </span>
                                  </label>
                                );
                              })}
                              {isSubmitted && (
                                <div className="text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                  ✓ Kunci Jawaban: {Array.isArray(q.answer) ? (q.answer as string[]).join(", ") : q.answer}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Teks Bebas input */
                            <div className="relative">
                              <Input
                                value={val || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  handleAnswerChange(answerKey, e.target.value)
                                }
                                disabled={isSubmitted}
                                placeholder="Ketik jawaban Anda..."
                                className={[
                                  "w-full sm:max-w-md text-sm",
                                  isSubmitted &&
                                    (checkAnswer(val, q.answer) ? "border-emerald-500" : "border-red-500")
                                ].join(" ")}
                              />
                              {isSubmitted && (
                                <div className="mt-1">
                                  {checkAnswer(val, q.answer) ? (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                      ✓ Benar
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                      ✗ Salah. Jawaban benar:{" "}
                                      <b className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                        {q.answer}
                                      </b>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Soal: Fill Particle in Dialogue */}
              {section.type === "fill_particle_in_dialogue" && section.dialogue && (
                <div className="flex flex-col gap-3.5 p-4 border border-border bg-surface-muted/20 rounded-2xl">
                  {section.dialogue.map((dialogueItem: DialogueItem, diagIdx: number) => {
                    const parts = dialogueItem.text.split(/（\s*(.*?)\s*）/g);

                    return (
                      <div key={diagIdx} className="flex gap-2 text-sm leading-relaxed items-start">
                        <span className="font-bold text-indigo-500 shrink-0 w-5">{dialogueItem.speaker}:</span>
                        <div className="flex flex-wrap gap-y-2 items-center">
                          {parts.map((part, idx) => {
                            if (idx % 2 === 0) {
                              return (
                                <span key={idx} className="font-jp text-base text-foreground leading-loose">
                                  {part}
                                </span>
                              );
                            } else {
                              const blankIdx = Math.floor(idx / 2);
                              const answerKey = `sec_${secIdx}_dialogue_${diagIdx}_blank_${blankIdx}`;
                              const val = answers[answerKey] || "";

                              const expectedList = Array.isArray(dialogueItem.blank_answer)
                                ? dialogueItem.blank_answer
                                : [dialogueItem.blank_answer];
                              const expected = expectedList[blankIdx] || "";
                              const isCorrect = checkAnswer(val, expected);

                              return (
                                <span key={idx} className="inline-flex flex-col items-center mx-1.5 relative select-none">
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleAnswerChange(answerKey, e.target.value)}
                                    disabled={isSubmitted}
                                    className={[
                                      "w-11 text-center font-jp font-extrabold border-b-2 text-base bg-transparent px-1 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all py-0.5",
                                      isSubmitted
                                        ? isCorrect
                                          ? "border-emerald-500 text-emerald-600 bg-emerald-500/10 rounded"
                                          : "border-red-500 text-red-600 bg-red-500/10 rounded"
                                        : "border-border text-foreground hover:border-muted"
                                    ].join(" ")}
                                    maxLength={8}
                                  />
                                  {isSubmitted && !isCorrect && (
                                    <span className="absolute -top-6 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 font-sans">
                                      {expected}
                                    </span>
                                  )}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Soal: Conjugation Table */}
              {section.type === "conjugation_table" && section.items && (
                <div className="overflow-x-auto rounded-xl border border-border bg-background">
                  <table className="w-full border-collapse text-left text-sm text-foreground">
                    <thead className="bg-slate-50 dark:bg-slate-900 font-semibold border-b border-border text-xs uppercase tracking-wider text-muted">
                      <tr>
                        <th className="px-4 py-3 border-r border-border">Kamus / Sopan</th>
                        {Object.keys(section.items[0])
                          .filter((k) => k !== "dictionary")
                          .map((colKey) => (
                            <th key={colKey} className="px-4 py-3 border-r border-border last:border-r-0">
                              {colKey === "nai_form"
                                ? "Nai-form (ナイ形)"
                                : colKey === "ta_form"
                                  ? "Ta-form (タ形)"
                                  : colKey === "nakatta_form"
                                    ? "Nakatta-form"
                                    : colKey}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {section.items.map((item: ConjugationItem, itemIdx: number) => {
                        const formKeys = Object.keys(item).filter((k) => k !== "dictionary");

                        return (
                          <tr key={itemIdx} className="hover:bg-surface-muted/20">
                            <td className="px-4 py-3 border-r border-border font-jp font-bold text-sm text-foreground whitespace-nowrap bg-slate-500/5">
                              {item.dictionary}
                            </td>
                            {formKeys.map((colKey: string) => {
                              const answerKey = `sec_${secIdx}_conj_${itemIdx}_${colKey}`;
                              const val = answers[answerKey] || "";
                              const expected = item[colKey as keyof ConjugationItem];
                              const isCorrect = checkAnswer(val, expected);

                              return (
                                <td key={colKey} className="px-4 py-3 border-r border-border last:border-r-0 min-w-[140px]">
                                  <div className="relative flex flex-col gap-1">
                                    <input
                                      type="text"
                                      value={val}
                                      onChange={(e) => handleAnswerChange(answerKey, e.target.value)}
                                      disabled={isSubmitted}
                                      className={[
                                        "w-full px-2 py-1 text-sm font-jp border bg-background rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                        isSubmitted
                                          ? isCorrect
                                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold"
                                            : "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300 font-bold"
                                          : "border-border hover:border-muted text-foreground"
                                      ].join(" ")}
                                    />
                                    {isSubmitted && !isCorrect && (
                                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                                        ✓ {expected}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Soal: Grammar Transform */}
              {section.type === "grammar_transform" && section.questions && (
                <div className="flex flex-col gap-4">
                  {section.questions.map((q: Question) => {
                    const expectedAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

                    return (
                      <div key={q.id} className="flex flex-col gap-2.5 p-3.5 border border-border bg-surface-muted/30 rounded-2xl">
                        <p className="font-jp text-base text-foreground leading-relaxed">
                          <span className="font-sans text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md mr-2 font-bold select-none">
                            {q.id}
                          </span>
                          {parseGrammarSentence(q.sentence || "")}
                        </p>
                        <div className="flex flex-wrap gap-4 items-center mt-1">
                          {expectedAnswers.map((expectedVal, blankIdx: number) => {
                            const answerKey = `sec_${secIdx}_grammar_${q.id}_blank_${blankIdx}`;
                            const val = answers[answerKey] || "";
                            const isCorrect = checkAnswer(val, expectedVal);

                            return (
                              <div key={blankIdx} className="flex items-center gap-2 min-w-[200px] flex-1 sm:flex-none">
                                {expectedAnswers.length > 1 && (
                                  <span className="text-xs text-muted font-bold">Kolom ({blankIdx + 1}):</span>
                                )}
                                <div className="relative flex-1">
                                  <Input
                                    value={val}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                      handleAnswerChange(answerKey, e.target.value)
                                    }
                                    disabled={isSubmitted}
                                    placeholder="Bentuk konjugasi..."
                                    className={[
                                      "w-full text-sm",
                                      isSubmitted && (isCorrect ? "border-emerald-500" : "border-red-500")
                                    ].join(" ")}
                                  />
                                  {isSubmitted && !isCorrect && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block font-bold ml-1">
                                      ✓ Jawaban benar: {expectedVal}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Soal: Dialogue Completion */}
              {section.type === "dialogue_completion" && section.questions && (
                <div className="flex flex-col gap-4">
                  {section.questions.map((q: Question) => {
                    const expectedAnswers = Array.isArray(q.sample_answer) ? q.sample_answer : [q.sample_answer];
                    const parts = (q.prompt || "").split(/（\s*(.*?)\s*）/g);

                    return (
                      <div key={q.id} className="flex flex-col gap-2.5 p-3.5 border border-border bg-surface-muted/30 rounded-2xl">
                        {q.context && (
                          <span className="text-xs text-muted italic bg-background/50 border border-border/50 px-2.5 py-1 rounded-xl self-start">
                            Konteks: {q.context}
                          </span>
                        )}

                        <div className="flex flex-wrap gap-y-2.5 items-center mt-1">
                          {parts.map((part, idx) => {
                            if (idx % 2 === 0) {
                              return (
                                <span key={idx} className="font-jp text-base text-foreground leading-loose">
                                  {part}
                                </span>
                              );
                            } else {
                              const blankIdx = Math.floor(idx / 2);
                              const answerKey = `sec_${secIdx}_completion_${q.id}_blank_${blankIdx}`;
                              const val = answers[answerKey] || "";
                              const expected = expectedAnswers[blankIdx] || "";
                              const isCorrect = checkAnswer(val, expected);

                              return (
                                <span key={idx} className="inline-flex flex-col mx-1.5 relative min-w-[200px] flex-1 sm:flex-none">
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleAnswerChange(answerKey, e.target.value)}
                                    disabled={isSubmitted}
                                    placeholder="Lengkapi kalimat..."
                                    className={[
                                      "px-3 py-1 text-sm font-jp border bg-background rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full",
                                      isSubmitted
                                        ? isCorrect
                                          ? "border-emerald-500 text-emerald-600 bg-emerald-500/10 rounded-xl"
                                          : "border-red-500 text-red-600 bg-red-500/10 rounded-xl"
                                        : "border-border text-foreground hover:border-muted"
                                    ].join(" ")}
                                  />
                                  {isSubmitted && !isCorrect && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block font-bold ml-1 leading-normal">
                                      ✓ Kunci: {expected}
                                    </span>
                                  )}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Soal: True / False Reading */}
              {section.type === "true_false_reading" && (
                <div className="flex flex-col gap-4">
                  {section.passage && (
                    <div className="p-4 border border-border bg-surface-muted/30 rounded-2xl">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">
                        Teks Bacaan (Passage):
                      </span>
                      <p className="font-jp text-base leading-loose text-foreground">
                        {section.passage}
                      </p>
                    </div>
                  )}

                  {section.questions && (
                    <div className="flex flex-col gap-2.5">
                      {section.questions.map((q: Question) => {
                        const answerKey = `sec_${secIdx}_tf_${q.id}`;
                        const val = answers[answerKey] || "";
                        const isCorrect = checkAnswer(val, q.answer);

                        return (
                          <div
                            key={q.id}
                            className="flex items-center justify-between p-3.5 border border-border bg-surface-muted/10 rounded-2xl gap-4 flex-col sm:flex-row"
                          >
                            <span className="font-jp text-sm text-foreground">{q.statement}</span>
                            <div className="flex gap-2 shrink-0">
                              {["◯", "✕"].map((opt) => {
                                const isSelected = val === opt;
                                let btnStyle = "border-border bg-background text-muted hover:border-indigo-500";

                                if (isSelected) {
                                  if (isSubmitted) {
                                    btnStyle = isCorrect
                                      ? "bg-emerald-500 text-white border-emerald-500 font-extrabold"
                                      : "bg-red-500 text-white border-red-500 font-extrabold";
                                  } else {
                                    btnStyle = "bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-sm";
                                  }
                                } else if (isSubmitted && opt === q.answer) {
                                  btnStyle = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500 border-dashed border-2 animate-pulse font-extrabold";
                                }

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleAnswerChange(answerKey, opt)}
                                    disabled={isSubmitted}
                                    className={[
                                      "w-10 h-10 flex items-center justify-center font-bold text-lg border-2 rounded-xl transition-all cursor-pointer select-none",
                                      btnStyle
                                    ].join(" ")}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Soal: Short Essay */}
              {section.type === "short_essay" && section.questions && (
                <div className="flex flex-col gap-4">
                  {section.questions.map((q: Question) => {
                    const answerKey = `sec_${secIdx}_essay_${q.id}`;
                    const val = answers[answerKey] || "";

                    return (
                      <div key={q.id} className="flex flex-col gap-3 p-4 border border-border bg-surface-muted/30 rounded-2xl">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-jp text-sm font-bold text-foreground">
                            {q.prompt}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full select-none shrink-0">
                            ✍️ Dinilai Manual
                          </span>
                        </div>

                        <TextArea
                          value={val}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleAnswerChange(answerKey, e.target.value)
                          }
                          disabled={isSubmitted}
                          placeholder="Tulis tanggapan bebas Anda dalam bahasa Jepang di sini..."
                          className="w-full text-sm font-jp"
                          rows={3}
                        />

                        {isSubmitted && (
                          <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span>⚠️</span>
                            <span>
                              Jawaban Anda disimpan. Bagian esai tidak memiliki kunci jawaban mutlak dan harus dievaluasi secara manual oleh guru untuk memverifikasi ketepatan tata bahasa.
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Button Submit / Ulangi di Bawah */}
      <div className="flex justify-center items-center gap-4 py-8">
        {!isSubmitted ? (
          <Button
            size="lg"
            variant="primary"
            className="font-extrabold px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-none cursor-pointer"
            onClick={handleSubmit}
          >
            Submit Ujian
          </Button>
        ) : (
          <Button
            size="lg"
            variant="primary"
            className="font-extrabold px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md border-none cursor-pointer animate-pulse"
            onClick={handleReset}
          >
            Ulangi Latihan Ujian
          </Button>
        )}
      </div>
    </div>
  );
}
