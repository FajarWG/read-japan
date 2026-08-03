"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import {
  Plus,
  Trash2,
  Check,
  X,
  RotateCcw,
  Pencil,
  ArrowLeft,
  Key,
  CheckCircle2,
} from "lucide-react";
import {
  getSomatomeBookSummary,
  getSomatomeDayQuestions,
  getSomatomeDayQuestionsWithKeys,
  setSomatomeDayQuestionCount,
  updateSomatomeQuestionKeys,
  deleteSomatomeQuestion,
  prepareSomatomeSubmission,
  finalizeSomatomeAttempt,
  type SomatomeQuestionRef,
  type SomatomeQuestionDetail,
  type SomatomeBookSummary,
  type SomatomeMissingKey,
  type SomatomeAttemptResultItem,
} from "@/src/modules/somatome/actions/somatomeActions";
import { AnswerPicker } from "@/src/modules/somatome/components/AnswerPicker";

type Phase = "loading" | "dayList" | "editing" | "answering" | "keys" | "result";

export function QuizSession({ bookId }: { bookId: number }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [summary, setSummary] = useState<SomatomeBookSummary | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  // Form input for new day setup
  const [newDayNum, setNewDayNum] = useState<number>(1);
  const [newCount, setNewCount] = useState<number>(5);

  // Active day questions & answers
  const [questions, setQuestions] = useState<SomatomeQuestionRef[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [missingKeys, setMissingKeys] = useState<SomatomeMissingKey[]>([]);
  const [keyDrafts, setKeyDrafts] = useState<Record<number, number>>({});

  // Editing mode state
  const [editQuestions, setEditQuestions] = useState<SomatomeQuestionDetail[]>([]);
  const [editTotalInput, setEditTotalInput] = useState<number>(5);
  const [editKeysDraft, setEditKeysDraft] = useState<Record<number, number | null>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Result state
  const [result, setResult] = useState<{ score: number; total: number; detail: SomatomeAttemptResultItem[] } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  // Load summary of all days for this book
  const loadSummary = useCallback(async () => {
    setPhase("loading");
    const sum = await getSomatomeBookSummary(bookId);
    setSummary(sum);
    setNewDayNum(sum.nextRecommendedDay);
    setPhase("dayList");
  }, [bookId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Handler to set/add question count for a day
  async function handleSetDayQuestions() {
    if (newDayNum < 1 || newCount < 1) return;
    setSubmitting(true);
    await setSomatomeDayQuestionCount(bookId, newDayNum, newCount);
    setSubmitting(false);
    await loadSummary();
  }

  // Handler to start answering a day
  async function handleStartDay(day: number) {
    setActiveDay(day);
    setPhase("loading");
    const rows = await getSomatomeDayQuestions(bookId, day);
    setQuestions(rows);
    setAnswers({});
    setResult(null);
    setPhase("answering");
  }

  // Handler to start editing a day (total questions & answer keys)
  async function handleEditDay(day: number) {
    setActiveDay(day);
    setPhase("loading");
    const rows = await getSomatomeDayQuestionsWithKeys(bookId, day);
    setEditQuestions(rows);
    setEditTotalInput(rows.length || 5);
    const initialKeys: Record<number, number | null> = {};
    for (const q of rows) {
      initialKeys[q.id] = q.correctAnswer;
    }
    setEditKeysDraft(initialKeys);
    setPhase("editing");
  }

  // Save changes in editing mode
  async function handleSaveEditDay() {
    if (!activeDay) return;
    setSavingEdit(true);

    // 1. Update total count if changed
    if (editTotalInput !== editQuestions.length) {
      await setSomatomeDayQuestionCount(bookId, activeDay, editTotalInput);
    }

    // 2. Update answer keys
    const keysArray = Object.entries(editKeysDraft).map(([idStr, val]) => ({
      questionId: Number(idStr),
      correctAnswer: val,
    }));
    await updateSomatomeQuestionKeys(keysArray);

    setSavingEdit(false);
    await loadSummary();
  }

  async function handleDeleteSingleQuestion(id: number) {
    if (!window.confirm("Delete this question number from database?")) return;
    await deleteSomatomeQuestion(id);
    if (activeDay) {
      handleEditDay(activeDay);
    }
  }

  // Submit quiz answers
  async function handleSubmit() {
    if (!activeDay) return;
    setSubmitting(true);
    const answersArr = questions.map((q) => ({ questionId: q.id, userAnswer: answers[q.id] }));
    const { missingKeys: missing } = await prepareSomatomeSubmission(answersArr);

    if (missing.length > 0) {
      setMissingKeys(missing);
      setKeyDrafts({});
      setPhase("keys");
      setSubmitting(false);
      return;
    }

    const res = await finalizeSomatomeAttempt(bookId, activeDay, answersArr, []);
    setSubmitting(false);
    if (res.success) {
      setResult({ score: res.score!, total: res.total!, detail: res.detail! });
      setPhase("result");
    }
  }

  async function handleFinalizeWithKeys() {
    if (!activeDay) return;
    setSubmitting(true);
    const answersArr = questions.map((q) => ({ questionId: q.id, userAnswer: answers[q.id] }));
    const keysArr = missingKeys.map((m) => ({ questionId: m.questionId, correctAnswer: keyDrafts[m.questionId] }));
    const res = await finalizeSomatomeAttempt(bookId, activeDay, answersArr, keysArr);
    setSubmitting(false);
    if (res.success) {
      setResult({ score: res.score!, total: res.total!, detail: res.detail! });
      setPhase("result");
    }
  }

  if (phase === "loading") {
    return <p className="text-xs text-muted text-center py-10">Loading quiz questions...</p>;
  }

  // ── 1. DAY LIST VIEW ──
  if (phase === "dayList") {
    return (
      <div className="flex flex-col gap-4">
        {/* Form Add / Set New Day Questions */}
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Plus size={14} className="text-indigo-500" /> Configure / Add New Day
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1">
              <span className="text-xs text-muted font-semibold">Day:</span>
              <input
                type="number"
                min={1}
                value={newDayNum}
                onChange={(e) => setNewDayNum(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 text-xs text-center border border-border rounded-lg bg-background py-1.5 font-bold"
              />
            </div>
            <div className="flex-1 flex items-center gap-1">
              <span className="text-xs text-muted font-semibold">Questions:</span>
              <input
                type="number"
                min={1}
                value={newCount}
                onChange={(e) => setNewCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 text-xs text-center border border-border rounded-lg bg-background py-1.5 font-bold"
              />
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSetDayQuestions}
              isDisabled={submitting}
              className="cursor-pointer text-xs font-semibold shrink-0"
            >
              Save Day
            </Button>
          </div>
          <p className="text-[11px] text-muted">
            Auto-recommended: Day {summary?.nextRecommendedDay ?? 1} (based on previous days).
          </p>
        </div>

        {/* List of Created Days */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Select Practice Day ({summary?.days.length ?? 0} Days)
          </span>

          {(!summary || summary.days.length === 0) ? (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-2xl">
              <p className="text-xs text-muted">
                No Days configured yet. Use the form above to add your first Day!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {summary.days.map((d) => {
                const isPassed90 = d.bestPercentage != null && d.bestPercentage >= 90;
                return (
                  <div
                    key={d.day}
                    className={[
                      "flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all",
                      isPassed90
                        ? "border-emerald-500/60 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
                        : "border-border bg-surface hover:border-indigo-500/50",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">Day {d.day}</span>
                        {isPassed90 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] flex items-center gap-1">
                            <CheckCircle2 size={12} /> {d.bestPercentage}% Passed
                          </span>
                        )}
                        {d.bestPercentage != null && !isPassed90 && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-muted text-muted font-bold text-[10px]">
                            {d.bestPercentage}%
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted flex items-center gap-2">
                        <span>{d.questionCount} Questions</span>
                        <span>•</span>
                        <span className={d.keysCount === d.questionCount ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                          {d.keysCount}/{d.questionCount} Keys Saved
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditDay(d.day)}
                        className="p-2 rounded-xl border border-border hover:bg-surface-muted/50 text-muted hover:text-foreground cursor-pointer transition-colors"
                        title="Edit total questions & answer keys"
                      >
                        <Pencil size={14} />
                      </button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartDay(d.day)}
                        className="cursor-pointer text-xs font-bold rounded-xl"
                      >
                        Practice
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 2. EDITING MODE (EDIT TOTAL QUESTIONS & KEYS) ──
  if (phase === "editing" && activeDay) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <button
            type="button"
            onClick={loadSummary}
            className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Day List
          </button>
          <span className="text-sm font-extrabold text-foreground">Edit Day {activeDay}</span>
        </div>

        {/* Edit Total Questions */}
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
          <span className="text-xs font-bold text-foreground">Total Questions on Day {activeDay}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={editTotalInput}
              onChange={(e) => setEditTotalInput(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 text-xs text-center border border-border rounded-lg bg-background py-1.5 font-bold"
            />
            <span className="text-xs text-muted">questions</span>
          </div>
          <p className="text-[10px] text-muted">
            Reducing total questions removes excess question numbers. Increasing adds new questions.
          </p>
        </div>

        {/* Edit Answer Keys */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Key size={14} className="text-indigo-500" /> Answer Keys (1–4)
          </span>

          <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-1">
            {editQuestions.map((q) => (
              <div key={q.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-surface-muted/20">
                <span className="text-xs font-bold text-foreground">Question No. {q.number}</span>
                <div className="flex items-center gap-2">
                  <AnswerPicker
                    value={editKeysDraft[q.id] ?? null}
                    variant="key"
                    onChange={(v) => setEditKeysDraft((prev) => ({ ...prev, [q.id]: v }))}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSingleQuestion(q.id)}
                    className="text-muted hover:text-red-500 cursor-pointer p-1"
                    title="Delete this question number"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          variant="primary"
          onClick={handleSaveEditDay}
          isDisabled={savingEdit}
          className="cursor-pointer font-bold rounded-xl text-xs"
        >
          {savingEdit ? "Saving Changes..." : "Save Questions & Keys"}
        </Button>
      </div>
    );
  }

  // ── 3. ANSWERING MODE (PRACTICE DAY) ──
  if (phase === "answering" && activeDay) {
    const answeredCount = Object.keys(answers).length;
    const allAnswered = questions.length > 0 && answeredCount === questions.length;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 sticky top-0 z-10">
          <button
            type="button"
            onClick={loadSummary}
            className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft size={14} /> Day List
          </button>
          <span className="text-xs font-extrabold text-foreground">Day {activeDay}</span>
          <span className="text-xs font-semibold text-muted">
            Answered: {answeredCount}/{questions.length}
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-surface-muted/20">
              <span className="text-xs font-bold text-foreground">Question No. {q.number}</span>
              <AnswerPicker
                value={answers[q.id] ?? null}
                variant="mine"
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
              />
            </div>
          ))}
        </div>

        <Button
          size="lg"
          variant="primary"
          isDisabled={!allAnswered || submitting}
          onClick={handleSubmit}
          className="cursor-pointer font-bold rounded-xl text-xs"
        >
          {submitting ? "Grading..." : "Submit & Grade"}
        </Button>
      </div>
    );
  }

  // ── 4. KEYS INPUT MODE (MISSING KEYS BEFORE GRADING) ──
  if (phase === "keys" && activeDay) {
    const allKeysFilled = missingKeys.every((m) => keyDrafts[m.questionId] != null);
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          No answer key saved for {missingKeys.length} questions on Day {activeDay}. Please enter the answer keys from the PDF book. Keys will be saved permanently for future grading.
        </div>

        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
          {missingKeys.map((m) => (
            <div key={m.questionId} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-surface-muted/20">
              <span className="text-xs font-bold text-foreground">
                Question No. {m.number}
              </span>
              <AnswerPicker
                value={keyDrafts[m.questionId] ?? null}
                variant="key"
                onChange={(v) => setKeyDrafts((prev) => ({ ...prev, [m.questionId]: v }))}
              />
            </div>
          ))}
        </div>

        <Button
          size="lg"
          variant="primary"
          isDisabled={!allKeysFilled || submitting}
          onClick={handleFinalizeWithKeys}
          className="cursor-pointer font-bold rounded-xl text-xs"
        >
          {submitting ? "Grading..." : "Complete & View Results"}
        </Button>
      </div>
    );
  }

  // ── 5. RESULT MODE ──
  if (phase === "result" && result && activeDay) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">Day {activeDay} Results</span>
            <span className="text-[11px] text-muted">Completed</span>
          </div>
          <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {result.score}/{result.total}
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
          {result.detail.map((d) => (
            <div
              key={d.questionId}
              className={[
                "flex items-center justify-between gap-2 p-3 rounded-xl border text-xs",
                d.isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5",
              ].join(" ")}
            >
              <span className="font-bold text-foreground">No. {d.number}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted">Your Answer: {d.userAnswer}</span>
                {d.isCorrect ? (
                  <span className="flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <Check size={13} /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <X size={13} /> Key: {d.correctAnswer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadSummary}
            className="flex-1 cursor-pointer font-bold rounded-xl text-xs"
          >
            Day List
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleStartDay(activeDay)}
            className="flex-1 cursor-pointer font-bold rounded-xl flex items-center gap-1 justify-center text-xs"
          >
            <RotateCcw size={14} /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}


