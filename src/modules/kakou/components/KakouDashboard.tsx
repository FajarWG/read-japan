"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { Modal } from "@heroui/react";
import {
  Award,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ExternalLink,
  History,
  Info,
  NotebookPen,
  PenLine,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";

import {
  abandonKakouSession,
  completeKakouSession,
  createKakouSession,
  saveKakouProgress,
  saveKakouAiFeedback,
} from "@/src/modules/kakou/actions/kakouActions";
import {
  KAKOU_MODE_LABELS,
  KAKOU_MODES,
  type KakouDifficulty,
  type KakouDuration,
  type KakouFeedback,
  type KakouLevel,
  type KakouMaterials,
  type KakouMaterialSelection,
  type KakouMode,
  type KakouOverview,
  type KakouPrompt,
  type KakouSessionView,
  type KakouSourceType,
} from "@/src/modules/kakou/data/types";
import { formatStudyTime } from "@/src/modules/study-timer/components/StudyTimerBar";
import { KakouSidebar } from "@/src/modules/kakou/components/KakouSidebar";
import { MaterialReferenceModal } from "@/src/modules/kakou/components/MaterialReferenceModal";

const KIND_LABELS: Record<KakouPrompt["kind"], string> = {
  JOURNAL: "Guided journal",
  COPY_CHANGE_CREATE: "Copy → Change → Create",
  GRAMMAR: "Grammar challenge",
  SENTENCE_BUILDER: "Sentence builder",
  CONJUGATION: "Conjugation drill",
};

const DIFFICULTY_OPTIONS: Array<{
  value: KakouDifficulty;
  label: string;
  note: string;
}> = [
  { value: "EASY", label: "Easy", note: "I wrote it smoothly" },
  { value: "OKAY", label: "Okay", note: "Some pauses or doubts" },
  { value: "DIFFICULT", label: "Difficult", note: "I need to review this" },
];

function buildTextReviewPrompt(session: KakouSessionView): string {
  const requirements = session.prompts
    .map(
      (item, index) =>
        `${index + 1}. ${KIND_LABELS[item.kind]}\nTugas: ${item.instruction}${
          item.pattern ? `\nPola target: ${item.pattern}` : ""
        }`,
    )
    .join("\n\n");

  return `Saya sedang belajar menulis bahasa Jepang secara mandiri. Tolong periksa tulisan saya sebagai guru bahasa Jepang yang teliti.

Level: JLPT ${session.level}
Latihan:
${requirements}

Tulisan saya:
[TULIS ATAU TEMPEL TULISAN BAHASA JEPANGMU DI SINI]

CRITICAL REQUIREMENT:
Kembalikan SELURUH hasil evaluasi HANYA dalam format JSON valid (di dalam kode blok \`\`\`json ... \`\`\`) tanpa teks tambahan di luar JSON.

Gunakan struktur JSON berikut:
\`\`\`json
{
  "score": 85,
  "overallFeedback": "Ringkasan apresiasi & ulasan umum singkat dalam bahasa Indonesia.",
  "sentences": [
    {
      "original": "kalimat asli user",
      "corrected": "koreksi minimum tata bahasa/partikel/ejaan agar benar",
      "improved": "versi yang lebih alami/natural bagi penutur asli",
      "meaning": "arti kalimat versi improved dalam bahasa indonesia",
      "explanation": "alasan singkat perbaikan tata bahasa/partikel",
      "suggestedKanji": [
        "わたし → 私 (JLPT N5)",
        "ともだち → 友達 (JLPT N5)"
      ]
    }
  ],
  "errorPatterns": [
    "pola kesalahan 1 yang perlu diperhatikan"
  ],
  "reviewPoints": [
    "saran latihan 1 yang perlu diperbaiki"
  ]
}
\`\`\`

Catatan Tambahan:
- Jika user masih menulis kata menggunakan Hiragana padahal kata tersebut lazim ditulis dengan Kanji sesuai level JLPT ini, berikan saran Kanji pada array "suggestedKanji" (contoh: ["たべます → 食べます (JLPT N5)", "とうきょう → 東京 (JLPT N5)"]).

Ketentuan Skor (0 - 100):
- 90-100: Sangat alami & tata bahasa tepat.
- 75-89: Baik dan mudah dipahami, ada 1-2 kesalahan kecil partikel/ejaan.
- 60-74: Ada kesalahan tata bahasa/partikel yang mengganggu pemahaman.
- <60: Banyak kesalahan mendasar.`;
}

function buildPhotoReviewPrompt(session: KakouSessionView): string {
  return `Saya mengunggah foto tulisan tangan bahasa Jepang untuk diperiksa. Level saya JLPT ${session.level}.

Konteks latihan:
${session.prompts
  .map(
    (item, index) =>
      `${index + 1}. ${item.instruction}${item.pattern ? ` (Target: ${item.pattern})` : ""}`,
  )
  .join("\n")}

CRITICAL REQUIREMENT:
1. Transkripsikan tulisan tangan pada foto secara akurat.
2. Periksa tata bahasa, partikel, ejaan, dan kealamian kalimat.
3. Jika tulisan masih menggunakan Hiragana untuk kata yang lazim memakai Kanji sesuai level JLPT ${session.level}, berikan saran Kanji pada array "suggestedKanji" (contoh: ["わたし → 私", "たべます → 食べます"]).
4. Kembalikan SELURUH hasil evaluasi HANYA dalam format JSON valid (di dalam kode blok \`\`\`json ... \`\`\`) tanpa teks tambahan di luar JSON.

Gunakan struktur JSON berikut:
\`\`\`json
{
  "score": 85,
  "overallFeedback": "Ringkasan evaluasi dalam bahasa Indonesia",
  "sentences": [
    {
      "original": "transkripsi persis dari foto tulisan tangan",
      "corrected": "koreksi minimum agar kalimat benar",
      "improved": "versi yang lebih alami/natural",
      "meaning": "arti dalam bahasa indonesia",
      "explanation": "penjelasan kesalahan partikel/kanji/tata bahasa",
      "suggestedKanji": [
        "わたし → 私 (JLPT N5)",
        "ともだち → 友達 (JLPT N5)"
      ]
    }
  ],
  "errorPatterns": [
    "pola kesalahan 1"
  ],
  "reviewPoints": [
    "hal yang perlu dilatih kembali"
  ]
}
\`\`\`

Ketentuan Skor (0 - 100):
- 90-100: Sangat alami, bentuk kanji/kana dan tata bahasa sangat baik.
- 75-89: Tulisan terbaca dan tata bahasa secara umum baik dengan 1-2 koreksi kecil.
- 60-74: Ada kesalahan partikel/kana yang mengganggu.
- <60: Banyak kesalahan atau karakter tidak terbaca [?].`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ScoreBadge({ score }: { score: number }) {
  let badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
  let Icon = Star;
  let label = "Sangat Baik";

  if (score >= 85) {
    badgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/30";
    Icon = Trophy;
    label = "Luar Biasa";
  } else if (score >= 70) {
    badgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    Icon = Award;
    label = "Bagus";
  } else {
    badgeStyle = "bg-blue-500/10 text-blue-600 border-blue-500/30";
    Icon = Info;
    label = "Perlu Latihan";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${badgeStyle}`}>
      <Icon size={14} />
      <span>{score}/100</span>
      <span className="text-[10px] opacity-80">({label})</span>
    </div>
  );
}

function ReviewDisplayCard({ feedback }: { feedback: KakouFeedback }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">AI Review & Score</p>
          <h3 className="text-lg font-bold text-foreground">Hasil Evaluasi Tulisan</h3>
        </div>
        <ScoreBadge score={feedback.score} />
      </div>

      {feedback.overallFeedback && (
        <div className="rounded-2xl bg-accent/5 border border-accent/20 p-4">
          <p className="text-xs font-bold text-accent mb-1">Catatan Evaluator</p>
          <p className="text-sm leading-relaxed text-foreground">{feedback.overallFeedback}</p>
        </div>
      )}

      {feedback.sentences && feedback.sentences.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Koreksi Per Kalimat</p>
          {feedback.sentences.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-background p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted">
                <span>Kalimat {idx + 1}</span>
              </div>
              <div className="grid gap-2">
                <div className="rounded-xl bg-surface p-3 border border-border">
                  <span className="text-[10px] font-bold uppercase text-muted block mb-0.5">Tulisan Asli</span>
                  <p className="font-jp text-sm text-foreground">{item.original}</p>
                </div>
                <div className="rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/20">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-0.5">Koreksi Standar</span>
                  <p className="font-jp text-sm text-emerald-700 dark:text-emerald-300 font-medium">{item.corrected}</p>
                </div>
                {item.improved && item.improved !== item.corrected && (
                  <div className="rounded-xl bg-blue-500/5 p-3 border border-blue-500/20">
                    <span className="text-[10px] font-bold uppercase text-blue-600 block mb-0.5">Versi Alami / Natural</span>
                    <p className="font-jp text-sm text-blue-700 dark:text-blue-300 font-medium">{item.improved}</p>
                  </div>
                )}
                {item.suggestedKanji && item.suggestedKanji.length > 0 && (
                  <div className="rounded-xl bg-purple-500/10 p-3 border border-purple-500/20">
                    <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block mb-1">
                      ✏️ Saran Kanji (dari Hiragana)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.suggestedKanji.map((kanji, kIdx) => (
                        <span key={kIdx} className="font-jp text-xs bg-background px-2.5 py-1 rounded-md border border-purple-500/30 text-foreground font-medium">
                          {kanji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.meaning && (
                  <p className="text-xs italic text-muted mt-1">Arti: "{item.meaning}"</p>
                )}
                {item.explanation && (
                  <p className="text-xs text-foreground bg-surface-muted p-2.5 rounded-lg border border-border">
                    💡 <strong>Penjelasan:</strong> {item.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback.errorPatterns && feedback.errorPatterns.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <p className="text-xs font-bold text-muted mb-2">⚠️ Pola Kesalahan Perlu Diperhatikan</p>
          <ul className="list-disc list-inside text-xs text-foreground space-y-1">
            {feedback.errorPatterns.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.reviewPoints && feedback.reviewPoints.length > 0 && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-bold text-accent mb-2">📌 Saran Latihan Selanjutnya</p>
          <ul className="list-disc list-inside text-xs text-foreground space-y-1">
            {feedback.reviewPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PromptCard({
  prompt,
  index,
  onOpenReference,
}: {
  prompt: KakouPrompt;
  index: number;
  onOpenReference?: (item: KakouMaterialSelection) => void;
}) {
  const [showReminder, setShowReminder] = useState(false);

  return (
    <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            Step {index + 1} · {KIND_LABELS[prompt.kind]}
          </p>
          <h2 className="text-xl font-bold text-foreground">{prompt.title}</h2>
        </div>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-muted">
          {prompt.level}
        </span>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
        <p className="font-jp text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          {prompt.japanese}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-foreground">{prompt.instruction}</p>
        {prompt.pattern && (
          <p className="mt-2 text-xs text-muted">
            Target pattern: <code className="rounded bg-surface-muted px-1.5 py-0.5 font-bold">{prompt.pattern}</code>
          </p>
        )}
        {prompt.hints && prompt.hints.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted">Hints:</span>
            {prompt.hints.map((hint) => (
              <span key={hint} className="rounded-lg bg-surface-muted px-2 py-1 font-jp text-xs text-muted">
                {hint}
              </span>
            ))}
          </div>
        )}
      </div>

      {prompt.reminder && (
        <div className="mt-5 border-t border-border/40 pt-4">
          <button
            type="button"
            onClick={() => setShowReminder((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-accent hover:underline"
          >
            <Info size={14} /> {showReminder ? "Hide reference" : "Show reference"}
          </button>
          {showReminder && (
            <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-surface-muted p-4">
              <p className="text-xs font-bold text-foreground">{prompt.reminder.title}</p>
              <p className="text-xs text-muted">{prompt.reminder.meaning}</p>
              {prompt.reminder.examples.length > 0 && (
                <div className="mt-1 flex flex-col gap-1">
                  {prompt.reminder.examples.map((ex, idx) => (
                    <p key={idx} className="font-jp text-xs text-foreground">
                      {ex.japanese}
                      {ex.meaning ? <span className="ml-2 font-sans text-muted">— {ex.meaning}</span> : null}
                    </p>
                  ))}
                </div>
              )}
              {prompt.reminder.commonMistakes && prompt.reminder.commonMistakes.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-xs text-muted">
                  {prompt.reminder.commonMistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              )}
              {prompt.source && onOpenReference && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenReference({
                      type: prompt.source!.type,
                      id: prompt.source!.id,
                    })
                  }
                  className="mt-1 inline-flex w-fit cursor-pointer items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  <ExternalLink size={12} /> View full guide
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Stats({ overview }: { overview: KakouOverview }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-xs text-muted">Completed</span>
        <p className="mt-1 text-2xl font-bold text-foreground">{overview.stats.completedSessions}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-xs text-muted">Today</span>
        <p className="mt-1 text-2xl font-bold text-accent">{formatStudyTime(overview.stats.todaySeconds, false)}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-xs text-muted">This week</span>
        <p className="mt-1 text-2xl font-bold text-foreground">{formatStudyTime(overview.stats.weekSeconds, false)}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-xs text-muted">Total writing time</span>
        <p className="mt-1 text-2xl font-bold text-foreground">{formatStudyTime(overview.stats.totalSeconds, false)}</p>
      </div>
    </div>
  );
}

function KakouLayout({
  materials,
  showSidebar,
  onToggleSidebar,
  sidebarItem,
  onSelectItem,
  onCloseModal,
  onLessonCompleted,
  onPatternToggled,
  children,
}: {
  materials: KakouMaterials;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  sidebarItem: KakouMaterialSelection | null;
  onSelectItem: (item: KakouMaterialSelection) => void;
  onCloseModal: () => void;
  onLessonCompleted: (formKey: string) => void;
  onPatternToggled: (patternId: string, learned: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={[
          "shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
          showSidebar ? "w-0 md:w-80 md:opacity-100" : "w-0 opacity-0",
        ].join(" ")}
      >
        <div className="hidden md:sticky md:top-0 md:block md:max-h-screen md:overflow-y-auto md:px-4 md:py-8 scrollbar-none">
          <KakouSidebar materials={materials} onSelectItem={onSelectItem} />
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleSidebar}
        className="relative hidden w-3.5 shrink-0 cursor-pointer items-center justify-center border-r border-border/30 transition-all duration-200 hover:bg-border/20 md:flex"
        title={showSidebar ? "Hide sidebar" : "Show sidebar"}
      >
        <div className="rounded-full border border-border bg-white p-1.5 shadow-xs dark:bg-surface">
          {showSidebar ? <ChevronLeft className="h-3.5 w-3.5 text-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-foreground" />}
        </div>
      </button>

      <div className="min-w-0 flex-1">{children}</div>

      <MaterialReferenceModal
        item={sidebarItem}
        completedLessons={materials.katsuyou.completedLessons}
        completedPatternIds={materials.bunpou.completedPatternIds}
        onClose={onCloseModal}
        onLessonCompleted={onLessonCompleted}
        onPatternToggled={onPatternToggled}
      />
    </div>
  );
}

export function KakouDashboard({
  initialOverview,
  initialSource,
  initialMaterials,
}: {
  initialOverview: KakouOverview;
  initialSource?: { type: KakouSourceType; id: string };
  initialMaterials: KakouMaterials;
}) {
  const [overview, setOverview] = useState(initialOverview);
  const [active, setActive] = useState(initialOverview.activeSession);
  const [mode, setMode] = useState<KakouMode>("DAILY_MIX");
  const [level, setLevel] = useState<KakouLevel>("N5");
  const [duration, setDuration] = useState<KakouDuration>(10);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<"text" | "photo" | null>(null);
  const [showJsonSubmit, setShowJsonSubmit] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState("");
  const [selectedHistorySession, setSelectedHistorySession] = useState<KakouSessionView | null>(null);
  const [isPending, startTransition] = useTransition();
  const [materials, setMaterials] = useState(initialMaterials);
  const [sidebarItem, setSidebarItem] = useState<KakouMaterialSelection | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleLessonCompleted = (formKey: string) => {
    setMaterials((prev) => ({
      ...prev,
      katsuyou: {
        ...prev.katsuyou,
        completedLessons: prev.katsuyou.completedLessons.includes(formKey)
          ? prev.katsuyou.completedLessons
          : [...prev.katsuyou.completedLessons, formKey],
      },
    }));
  };

  const handlePatternToggled = (patternId: string, learned: boolean) => {
    setMaterials((prev) => ({
      ...prev,
      bunpou: {
        ...prev.bunpou,
        completedPatternIds: learned
          ? prev.bunpou.completedPatternIds.includes(patternId)
            ? prev.bunpou.completedPatternIds
            : [...prev.bunpou.completedPatternIds, patternId]
          : prev.bunpou.completedPatternIds.filter((id) => id !== patternId),
      },
    }));
  };

  const startSession = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await createKakouSession({
        mode,
        level,
        durationMinutes: duration,
        sourceType: initialSource?.type,
        sourceId: initialSource?.id,
      });
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setActive(result.session);
      if (result.resumed) {
        setMessage("Your unfinished session has been restored.");
      }
    });
  };

  const markStepDone = () => {
    if (!active) return;
    setMessage(null);
    startTransition(async () => {
      const result = await saveKakouProgress(active.id, active.progress + 1);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setActive(result.session);
    });
  };

  const finishSession = (difficulty: KakouDifficulty) => {
    if (!active) return;
    setMessage(null);
    startTransition(async () => {
      const result = await completeKakouSession(active.id, difficulty);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setOverview(result.overview);
      setActive(result.overview.history.find(h => h.id === active.id) || null);
      setCopied(null);
      setMessage("Session saved. Nice work — your streak has been updated.");
    });
  };

  const abandonSession = () => {
    if (!active || !window.confirm("Abandon this session? Its partial progress will remain in your database history.")) return;
    setMessage(null);
    startTransition(async () => {
      const result = await abandonKakouSession(active.id);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setOverview(result.overview);
      setActive(null);
      setCopied(null);
    });
  };

  const copyPrompt = async (kind: "text" | "photo") => {
    if (!active) return;
    const text = kind === "text" ? buildTextReviewPrompt(active) : buildPhotoReviewPrompt(active);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setMessage("Clipboard access was blocked. Please allow clipboard permission and try again.");
    }
  };

  const handleJsonSubmit = () => {
    if (!active) return;
    setMessage(null);
    try {
      let jsonStr = rawJsonInput.trim();
      const codeblockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (codeblockMatch) {
        jsonStr = codeblockMatch[1].trim();
      } else {
        const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (braceMatch) jsonStr = braceMatch[0];
      }

      const parsed = JSON.parse(jsonStr) as KakouFeedback;
      if (typeof parsed.score !== "number" || !Array.isArray(parsed.sentences)) {
        setMessage("Format JSON tidak valid. Pastikan JSON memiliki field 'score' dan 'sentences'.");
        return;
      }

      startTransition(async () => {
        const res = await saveKakouAiFeedback({
          sessionId: active.id,
          score: parsed.score,
          feedbackJson: parsed,
        });
        if (res.success && res.overview) {
          setOverview(res.overview);
          const updatedActive = res.overview.history.find(h => h.id === active.id);
          if (updatedActive) setActive(updatedActive);
          setShowJsonSubmit(false);
          setRawJsonInput("");
          setMessage("Hasil AI Review berhasil disimpan dan dimasukkan ke histori!");
        } else if (res.error) {
          setMessage(res.error);
        }
      });
    } catch {
      setMessage("Gagal membaca JSON. Pastikan format JSON sudah benar dari AI.");
    }
  };

  if (active) {
    const total = active.prompts.length;
    const allDone = active.progress >= total;
    const currentPrompt = active.prompts[Math.min(active.progress, total - 1)];

    return (
      <KakouLayout
        materials={materials}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar((v) => !v)}
        sidebarItem={sidebarItem}
        onSelectItem={setSidebarItem}
        onCloseModal={() => setSidebarItem(null)}
        onLessonCompleted={handleLessonCompleted}
        onPatternToggled={handlePatternToggled}
      >
      <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="font-jp text-sm font-bold text-accent">書こう</p>
              <h1 className="text-xl font-bold text-foreground">Writing session</h1>
            </div>
            <button
              type="button"
              onClick={abandonSession}
              disabled={isPending}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
            >
              <X size={14} /> Abandon
            </button>
          </header>

          <section className="rounded-2xl border border-border bg-surface px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{KAKOU_MODE_LABELS[active.mode].title}</span>
              <span className="text-muted">{active.progress}/{total} steps · {active.durationMinutes} min</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${total === 0 ? 0 : (active.progress / total) * 100}%` }}
              />
            </div>
          </section>

          {message && (
            <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">{message}</p>
          )}

          {!allDone && currentPrompt && (
            <>
              <PromptCard prompt={currentPrompt} index={active.progress} onOpenReference={setSidebarItem} />
              <button
                type="button"
                onClick={markStepDone}
                disabled={isPending}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-white shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving…" : active.progress + 1 === total ? "I finished this step" : "Step done — continue"}
                {!isPending && <ChevronRight size={18} />}
              </button>
            </>
          )}

          {allDone && (
            <div className="flex flex-col gap-5">
              <section className="rounded-3xl border border-accent/25 bg-accent/5 p-5 sm:p-7">
                <BookOpenCheck size={28} className="mb-3 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Your notebook page is complete</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Review it yourself first. Copy the prompt below to ask an AI (ChatGPT/Claude/Gemini) to inspect your writing and return a JSON review response.
                </p>
              </section>

              {active.feedbackJson ? (
                <ReviewDisplayCard feedback={active.feedbackJson} />
              ) : (
                <section className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={20} />
                    <div>
                      <h3 className="font-bold text-foreground">External AI Review (Optional)</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        Copy the prompt below to ChatGPT/AI. When AI replies with JSON, paste the JSON back here to get score badges and sentence corrections saved to your history!
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 mb-4">
                    <button
                      type="button"
                      onClick={() => copyPrompt("text")}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-accent/50"
                    >
                      {copied === "text" ? <Check size={16} /> : <Clipboard size={16} />}
                      {copied === "text" ? "Copied Text Prompt" : "Copy text review prompt"}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyPrompt("photo")}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-accent/50"
                    >
                      {copied === "photo" ? <Check size={16} /> : <Clipboard size={16} />}
                      {copied === "photo" ? "Copied Photo Prompt" : "Copy photo review prompt"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowJsonSubmit(true)}
                    className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent/10 border border-accent/30 text-accent px-4 py-3 text-sm font-bold hover:bg-accent/20"
                  >
                    <Sparkles size={16} /> Submit AI Review JSON Response
                  </button>

                  {showJsonSubmit && (
                    <div className="mt-4 rounded-2xl border border-border bg-background p-4 flex flex-col gap-3">
                      <p className="text-xs font-bold text-foreground">Paste JSON Response From ChatGPT / AI:</p>
                      <textarea
                        rows={6}
                        value={rawJsonInput}
                        onChange={(e) => setRawJsonInput(e.target.value)}
                        placeholder={`Paste standard JSON or code block output from ChatGPT here...\nExample: {"score": 85, "sentences": [...]}`}
                        className="w-full rounded-xl border border-border bg-surface p-3 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowJsonSubmit(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleJsonSubmit}
                          disabled={isPending || !rawJsonInput.trim()}
                          className="rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-95 disabled:opacity-50"
                        >
                          {isPending ? "Saving..." : "Parse & Save Review"}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {active.status === "ACTIVE" && (
                <section className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                  <h3 className="font-bold text-foreground">How did this session feel?</h3>
                  <p className="mt-1 text-xs text-muted">Choose one to finish and add this session to your activity streak.</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => finishSession(option.value)}
                        disabled={isPending}
                        className="cursor-pointer rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-accent/50 hover:bg-accent/5 disabled:opacity-50"
                      >
                        <span className="block text-sm font-bold text-foreground">{option.label}</span>
                        <span className="mt-0.5 block text-[11px] text-muted">{option.note}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {active.status === "COMPLETED" && (
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-white shadow-sm hover:brightness-95"
                >
                  Return to Kakou Dashboard
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      </KakouLayout>
    );
  }

  return (
    <KakouLayout
      materials={materials}
      showSidebar={showSidebar}
      onToggleSidebar={() => setShowSidebar((v) => !v)}
      sidebarItem={sidebarItem}
      onSelectItem={setSidebarItem}
      onCloseModal={() => setSidebarItem(null)}
      onLessonCompleted={handleLessonCompleted}
      onPatternToggled={handlePatternToggled}
    >
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="flex w-full flex-col gap-6">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <NotebookPen size={24} />
            </span>
            <div>
              <p className="font-jp text-sm font-bold text-accent">書こう · Kakou</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">What should I write today?</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Pick a session, open your paper notebook, and follow the prompts. The exercise bank is static—no AI is used to generate your study material.
              </p>
            </div>
          </div>
        </header>

        {message && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">{message}</p>
        )}

        <Stats overview={overview} />

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <PenLine size={18} className="text-accent" />
            <h2 className="font-bold text-foreground">Start a writing session</h2>
          </div>

          {initialSource && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-4">
              <div>
                <p className="text-xs font-bold text-accent">Focused library practice</p>
                <p className="mt-1 text-sm text-muted">
                  This session will use the selected {initialSource.type === "BUNPOU" ? "Bunpou pattern" : "Katsuyou guide"}.
                </p>
              </div>
              <Link href="/kakou" className="shrink-0 text-xs font-bold text-muted hover:text-foreground">
                Clear
              </Link>
            </div>
          )}

          <div className={`${initialSource ? "hidden" : "grid"} gap-3 sm:grid-cols-2`}>
            {KAKOU_MODES.map((item) => {
              const selected = mode === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-background hover:border-accent/40"
                  } ${item === "DAILY_MIX" ? "sm:col-span-2" : ""}`}
                >
                  <span className="text-sm font-bold text-foreground">{KAKOU_MODE_LABELS[item].title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{KAKOU_MODE_LABELS[item].description}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <fieldset className={initialSource ? "hidden" : ""}>
              <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">JLPT level</legend>
              <div className="grid grid-cols-3 gap-2">
                {(["N5", "N4", "N3"] as KakouLevel[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLevel(item)}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-bold ${
                      level === item ? "border-accent bg-accent text-white" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Session length</legend>
              <div className="grid grid-cols-3 gap-2">
                {([5, 10, 20] as KakouDuration[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDuration(item)}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-bold ${
                      duration === item ? "border-accent bg-accent text-white" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {item} min
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button
            type="button"
            onClick={startSession}
            disabled={isPending}
            className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-bold text-white shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Preparing…" : initialSource ? "Practice this material" : "Open today’s notebook page"}
            {!isPending && <ChevronRight size={18} />}
          </button>
        </section>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-8">
        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><History size={18} className="text-accent" /> Recent sessions history</h2>
            <span className="text-xs text-muted">Last {overview.history.length}</span>
          </div>
          {overview.history.length === 0 ? (
            <div className="rounded-2xl bg-surface-muted p-5 text-center">
              <RotateCcw size={20} className="mx-auto mb-2 text-muted" />
              <p className="text-sm font-semibold text-foreground">No completed sessions yet</p>
              <p className="mt-1 text-xs text-muted">Completed writing sessions will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
              {overview.history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistorySession(item)}
                  className="flex cursor-pointer items-center justify-between gap-3 py-3 font-medium transition-colors hover:bg-surface-muted/50 px-2 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{KAKOU_MODE_LABELS[item.mode].title}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {formatDate(item.completedAt ?? item.startedAt)} · {item.level} · {item.prompts.length} steps
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {typeof item.score === "number" && (
                      <ScoreBadge score={item.score} />
                    )}
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-bold text-muted">
                      {item.difficulty ?? "DONE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>
      </div>

      {/* History Detail Modal via Hero UI */}
      <Modal isOpen={Boolean(selectedHistorySession)} onOpenChange={(open) => { if (!open) setSelectedHistorySession(null); }}>
        <Modal.Backdrop>
          <Modal.Container className="flex items-center justify-center min-h-screen w-screen p-4">
            <Modal.Dialog className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-3xl border border-border p-6 shadow-xl flex flex-col gap-4">
              <Modal.CloseTrigger />
              <Modal.Header className="pb-3 border-b border-border/20 flex flex-col">
                <p className="text-xs font-bold text-accent uppercase">Writing History Details</p>
                <Modal.Heading className="text-lg font-bold text-foreground">
                  {selectedHistorySession ? KAKOU_MODE_LABELS[selectedHistorySession.mode].title : ""} ({selectedHistorySession?.level})
                </Modal.Heading>
                {selectedHistorySession && (
                  <p className="text-xs text-muted mt-0.5">{formatDate(selectedHistorySession.completedAt ?? selectedHistorySession.startedAt)}</p>
                )}
              </Modal.Header>

              <Modal.Body className="py-4 flex flex-col gap-4">
                {selectedHistorySession && selectedHistorySession.score !== null && (
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
                    <span className="text-sm font-bold text-foreground">Score Evaluation</span>
                    <ScoreBadge score={selectedHistorySession.score} />
                  </div>
                )}

                {selectedHistorySession?.feedbackJson ? (
                  <ReviewDisplayCard feedback={selectedHistorySession.feedbackJson} />
                ) : (
                  <div className="rounded-2xl bg-surface-muted p-4 text-center text-xs text-muted">
                    Belum ada AI Review JSON yang disimpan untuk sesi ini.
                  </div>
                )}

                {selectedHistorySession && selectedHistorySession.prompts.length > 0 && (
                  <div className="flex flex-col gap-3 mt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Kartu Soal Sesi Ini</p>
                    {selectedHistorySession.prompts.map((p, idx) => (
                      <div key={idx} className="rounded-2xl border border-border bg-surface p-4 text-xs">
                        <span className="font-bold text-accent block mb-1">Step {idx + 1}: {p.title}</span>
                        <p className="font-jp text-sm font-medium text-foreground mb-1">{p.japanese}</p>
                        <p className="text-muted">{p.instruction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedHistorySession(null)}
                  className="rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-95 cursor-pointer"
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </main>
    </KakouLayout>
  );
}
