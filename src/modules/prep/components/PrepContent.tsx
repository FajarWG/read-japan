"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button, Card, Popover, Tabs, Select, Label, ListBox, TextArea, Input, Spinner } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";
import { recordKotobaLookup } from "@/src/shared/actions/kotoba-progress";
import {
  buildKotobaAliasMap,
  createKotobaLookupEntry,
  type KotobaLookupEntry,
} from "@/src/modules/prep/lib/kotoba-lookup";
import { LatihanUjian } from "./LatihanUjian";


interface PrepContentProps {
  username?: string | null;
  role?: string | null;
}

interface ConversationItem {
  speaker: string;
  japanese: string;
  translation: string;
}

interface GrammarExample {
  japanese: string;
  translation: string;
}

interface GrammarItem {
  pattern: string;
  explanation: string;
  examples: GrammarExample[];
}

interface ExerciseItem {
  prompt: string;
  answer: string;
}

interface SectionItem {
  title: string;
  conversations: ConversationItem[];
  exercises: ExerciseItem[];
  grammar?: GrammarItem[];
}

interface PrepDataPayload {
  chapter: number;
  point: number;
  title: string;
  conversations?: ConversationItem[] | null;
  grammar: GrammarItem[];
  exercises?: ExerciseItem[] | null;
  sections?: SectionItem[] | null;
  audioFiles: string[];
}

interface KotobaVocabularyItem {
  kanji: string;
  hiragana: string;
  romaji?: string;
  translations?: Record<string, string>;
}

function KanjiLookupToken({
  text,
  entry,
  onLookup,
}: {
  text: string;
  entry: KotobaLookupEntry;
  onLookup: (progressKey: string) => Promise<void> | void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return;
        startTransition(async () => {
          try {
            await onLookup(entry.progressKey);
          } catch (error) {
            console.error("[PrepContent] gagal mencatat lookup kanji:", error);
          }
        });
      }}
    >
      <Popover.Trigger className="inline-flex">
        <button
          type="button"
          className={[
            "inline rounded px-0.5 font-jp text-inherit text-indigo-600 underline decoration-indigo-300 decoration-2 underline-offset-3 transition-colors",
            "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
            isPending ? "opacity-70" : "",
          ].join(" ")}
          aria-label={`${text} - ${entry.hiragana}`}
        >
          {text}
        </button>
      </Popover.Trigger>
      <Popover.Content className="max-w-64" placement="top">
        <Popover.Dialog>
          <div className="flex flex-col gap-2">
            <span className="font-jp text-xl font-bold text-foreground">
              {entry.display}
            </span>
            <span className="font-jp text-sm font-semibold text-indigo-500 dark:text-indigo-400">
              {entry.hiragana}
            </span>
            <p className="text-sm leading-relaxed text-muted">{entry.meaning}</p>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

const getPlaceholderJson = (chapter: number, point: number) => {
  return JSON.stringify({
    title: `Topik Pembahasan Bab ${chapter} Poin ${point}`,
    sections: [
      {
        title: "1. [Sub-pola, contoh: 〜ませんか]",
        conversations: [
          {
            speaker: "A",
            japanese: "今晩、一緒にご飯を食べませんか。",
            translation: "Malam ini, mau makan bersama?"
          },
          {
            speaker: "B",
            japanese: "いいですね。食べましょう。",
            translation: "Boleh, bagus juga. Ayo makan."
          }
        ],
        exercises: [
          {
            prompt: "① 今週の金曜日・映画",
            answer: "A：今週の金曜日、一緒に映画を見ませんか。 B：いいですね。見ましょう。"
          }
        ],
        grammar: [
          {
            pattern: "〜ませんか",
            explanation: "Digunakan untuk mengajak seseorang melakukan sesuatu secara sopan.",
            examples: [
              {
                japanese: "一緒にご飯を食べませんか。",
                translation: "Mau makan bersama?"
              }
            ]
          }
        ]
      }
    ]
  }, null, 2);
};

function RenderMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const renderedElements: React.ReactNode[] = [];

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={idx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-500 dark:text-indigo-400">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const flushTable = (key: number) => {
    if (tableHeaders.length === 0 && tableRows.length === 0) return null;
    const el = (
      <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full border-collapse text-left text-xs sm:text-sm text-foreground">
          <thead className="bg-slate-50 dark:bg-slate-900 font-semibold border-b border-border">
            <tr>
              {tableHeaders.map((h, i) => (
                <th key={i} className="px-3 py-2 border-r border-border last:border-r-0 whitespace-nowrap">
                  {parseInlineStyles(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tableRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 border-r border-border last:border-r-0">
                    {parseInlineStyles(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeaders = [];
    tableRows = [];
    inTable = false;
    return el;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|")) {
      inTable = true;
      const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every(c => c.match(/^:-*-?:?$/) || c.match(/^-+$/))) {
        continue;
      }
      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      const tableEl = flushTable(i);
      if (tableEl) renderedElements.push(tableEl);
    }

    if (line.startsWith("### ")) {
      renderedElements.push(
        <h4 key={i} className="text-sm sm:text-base font-bold text-indigo-500 font-jp mt-5 mb-2 border-b border-border pb-1">
          {parseInlineStyles(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      renderedElements.push(
        <h3 key={i} className="text-base sm:text-lg font-bold text-foreground font-jp mt-6 mb-3">
          {parseInlineStyles(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      renderedElements.push(
        <h2 key={i} className="text-lg sm:text-xl font-bold text-foreground font-jp mt-8 mb-4">
          {parseInlineStyles(line.slice(2))}
        </h2>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      renderedElements.push(
        <li key={i} className="ml-4 list-disc text-xs sm:text-sm text-foreground leading-relaxed my-1">
          {parseInlineStyles(line.slice(2))}
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      renderedElements.push(
        <li key={i} className="ml-4 list-decimal text-xs sm:text-sm text-foreground leading-relaxed my-1">
          {parseInlineStyles(match ? match[2] : line)}
        </li>
      );
    } else if (line.length > 0) {
      renderedElements.push(
        <p key={i} className="text-xs sm:text-sm text-foreground leading-relaxed my-2">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  if (inTable) {
    const tableEl = flushTable(lines.length);
    if (tableEl) renderedElements.push(tableEl);
  }

  return <div className="space-y-0.5">{renderedElements}</div>;
}

export function PrepContent({ username, role }: PrepContentProps) {
  const { lang, t } = useLanguage();

  // State pemilihan bab & poin & mode
  const [studyMode, setStudyMode] = useState<"biasa" | "ujian" | "latihan" | null>(null);
  const [chapter, setChapter] = useState<number>(1);
  const [point, setPoint] = useState<number>(1);
  const [examGroup, setExamGroup] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // State data materi tambahan
  const [generating, setGenerating] = useState<boolean>(false);
  const [examTitleInput, setExamTitleInput] = useState<string>("");

  // State data materi
  const [data, setData] = useState<PrepDataPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State untuk form upload/edit
  const [jsonInput, setJsonInput] = useState<string>("");
  const [selectedAudios, setSelectedAudios] = useState<string[]>([]);
  const [audioOptions, setAudioOptions] = useState<Record<string, string[]>>({});
  const [searchAudio, setSearchAudio] = useState<string>("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  // Real-time JSON validation
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonValid, setJsonValid] = useState<boolean>(false);

  // State opsi tebakan kosakata
  const [showAllHiragana, setShowAllHiragana] = useState<boolean>(true);
  const [showAllTranslation, setShowAllTranslation] = useState<boolean>(true);
  const [hiddenHiraganaCards, setHiddenHiraganaCards] = useState<Record<string, boolean>>({});
  const [hiddenTranslationCards, setHiddenTranslationCards] = useState<Record<string, boolean>>({});

  // Pemutar audio lokal di uploader
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false);

  // Tab belajar aktif (dialogue, grammar, vocabulary, exercises)
  const [activeTab, setActiveTab] = useState<string>("dialogue");

  // Salin prompt LLM
  const [copied, setCopied] = useState<boolean>(false);

  // State untuk latihan soal (exercises)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswerFor, setShowAnswerFor] = useState<Record<string, boolean>>({});
  // State untuk menampilkan terjemahan contoh percakapan
  const [showDialogTranslationFor, setShowDialogTranslationFor] = useState<Record<string, boolean>>({});

  // Ambil daftar file audio yang tersedia dari server
  useEffect(() => {
    async function fetchAudios() {
      try {
        const res = await fetch("/api/audio");
        if (res.ok) {
          const json = await res.json();
          setAudioOptions(json.folders || {});
          // Expand semua folder secara default
          const expansions: Record<string, boolean> = {};
          Object.keys(json.folders || {}).forEach((folder) => {
            expansions[folder] = true;
          });
          setExpandedFolders(expansions);
        }
      } catch (err) {
        console.error("Gagal memuat berkas audio:", err);
      }
    }
    fetchAudios();
  }, []);

  // Baca chapter & point sebelumnya dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const storedChapter = localStorage.getItem("rj-prep-chapter");
    const storedPoint = localStorage.getItem("rj-prep-point");
    const storedStudyMode = localStorage.getItem("rj-prep-studymode") as "biasa" | "ujian" | "latihan" | null;
    const storedExamGroup = localStorage.getItem("rj-prep-examgroup");
    if (storedChapter) {
      setChapter(Number(storedChapter));
    }
    if (storedPoint) {
      setPoint(Number(storedPoint));
    }
    if (storedStudyMode) {
      setStudyMode(storedStudyMode);
    }
    if (storedExamGroup) {
      setExamGroup(Number(storedExamGroup));
    }
    setIsLoaded(true);
  }, []);

  // Simpan chapter & point ke localStorage setiap kali ada perubahan setelah inisialisasi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("rj-prep-chapter", String(chapter));
      localStorage.setItem("rj-prep-point", String(point));
      if (studyMode) {
        localStorage.setItem("rj-prep-studymode", studyMode);
      }
      localStorage.setItem("rj-prep-examgroup", String(examGroup));
    }
  }, [chapter, point, studyMode, examGroup, isLoaded]);

  // Ambil data persiapan dari database saat chapter/point berubah
  useEffect(() => {
    if (!isLoaded) return;
    if (!studyMode) return;
    if (studyMode === "latihan") {
      setLoading(false);
      setData(null);
      return;
    }
    async function fetchPrepData() {
      setLoading(true);
      setIsEditing(false);
      setData(null);
      setUserAnswers({});
      setShowAnswerFor({});
      setShowDialogTranslationFor({});

      const queryChapter = studyMode === "ujian" ? examGroup : chapter;
      const queryPoint = studyMode === "ujian" ? 0 : point;

      try {
        const res = await fetch(`/api/prep?chapter=${queryChapter}&point=${queryPoint}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setData(json.data);
            setJsonInput("");
            setSelectedAudios(json.data.audioFiles || []);
          } else {
            setJsonInput("");
            setSelectedAudios([]);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data persiapan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrepData();
  }, [chapter, point, examGroup, studyMode, isLoaded]);

  // Validasi JSON secara real-time saat jsonInput berubah
  useEffect(() => {
    if (!jsonInput.trim()) {
      setJsonError("JSON tidak boleh kosong");
      setJsonValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title) {
        setJsonError("Field 'title' wajib ada di level root.");
        setJsonValid(false);
        return;
      }
      if (!parsed.conversations && !parsed.sections) {
        setJsonError("JSON wajib memiliki salah satu dari field 'conversations' atau 'sections' di level root.");
        setJsonValid(false);
        return;
      }

      if (parsed.conversations) {
        if (!Array.isArray(parsed.conversations)) {
          setJsonError("Field 'conversations' harus berupa array.");
          setJsonValid(false);
          return;
        }
        // Validasi item dalam conversation
        for (let i = 0; i < parsed.conversations.length; i++) {
          const item = parsed.conversations[i];
          if (!item.speaker || !item.japanese || !item.translation) {
            setJsonError(`Conversations item ke-${i + 1} harus memiliki 'speaker', 'japanese', dan 'translation'.`);
            setJsonValid(false);
            return;
          }
        }
      }

      if (parsed.sections) {
        if (!Array.isArray(parsed.sections)) {
          setJsonError("Field 'sections' harus berupa array.");
          setJsonValid(false);
          return;
        }
        for (let i = 0; i < parsed.sections.length; i++) {
          const sect = parsed.sections[i];
          if (!sect || typeof sect.title !== "string") {
            setJsonError(`Sections item ke-${i + 1} harus memiliki 'title' (string).`);
            setJsonValid(false);
            return;
          }
          if (!Array.isArray(sect.conversations)) {
            setJsonError(`Sections item ke-${i + 1} harus memiliki array 'conversations'.`);
            setJsonValid(false);
            return;
          }
          for (let j = 0; j < sect.conversations.length; j++) {
            const conv = sect.conversations[j];
            if (!conv || !conv.speaker || !conv.japanese || !conv.translation) {
              setJsonError(`Section ke-${i + 1} conversation item ke-${j + 1} harus memiliki 'speaker', 'japanese', dan 'translation'.`);
              setJsonValid(false);
              return;
            }
          }
          if (!Array.isArray(sect.exercises)) {
            setJsonError(`Sections item ke-${i + 1} harus memiliki array 'exercises'.`);
            setJsonValid(false);
            return;
          }
          for (let j = 0; j < sect.exercises.length; j++) {
            const ex = sect.exercises[j];
            if (!ex || typeof ex.prompt !== "string" || typeof ex.answer !== "string") {
              setJsonError(`Section ke-${i + 1} exercises item ke-${j + 1} harus memiliki 'prompt' (string) dan 'answer' (string).`);
              setJsonValid(false);
              return;
            }
          }
          if (sect.grammar !== undefined && sect.grammar !== null) {
            if (!Array.isArray(sect.grammar)) {
              setJsonError(`Section ke-${i + 1} field 'grammar' harus berupa array.`);
              setJsonValid(false);
              return;
            }
            for (let j = 0; j < sect.grammar.length; j++) {
              const item = sect.grammar[j];
              if (!item || !item.pattern || !item.explanation || !Array.isArray(item.examples)) {
                setJsonError(`Section ke-${i + 1} grammar item ke-${j + 1} harus memiliki 'pattern', 'explanation', dan 'examples' (array).`);
                setJsonValid(false);
                return;
              }
              for (let k = 0; k < item.examples.length; k++) {
                const ex = item.examples[k];
                if (!ex || !ex.japanese || !ex.translation) {
                  setJsonError(`Section ke-${i + 1} contoh grammar ke-${k + 1} pada pola '${item.pattern}' harus memiliki 'japanese' dan 'translation'.`);
                  setJsonValid(false);
                  return;
                }
              }
            }
          }
        }
      }

      if (parsed.grammar !== undefined && parsed.grammar !== null) {
        if (!Array.isArray(parsed.grammar)) {
          setJsonError("Field 'grammar' harus berupa array.");
          setJsonValid(false);
          return;
        }

        // Validasi item dalam grammar
        for (let i = 0; i < parsed.grammar.length; i++) {
          const item = parsed.grammar[i];
          if (!item.pattern || !item.explanation || !Array.isArray(item.examples)) {
            setJsonError(`Grammar item ke-${i + 1} harus memiliki 'pattern', 'explanation', dan 'examples' (array).`);
            setJsonValid(false);
            return;
          }
          for (let j = 0; j < item.examples.length; j++) {
            const ex = item.examples[j];
            if (!ex.japanese || !ex.translation) {
              setJsonError(`Contoh grammar ke-${j + 1} pada pola '${item.pattern}' harus memiliki 'japanese' dan 'translation'.`);
              setJsonValid(false);
              return;
            }
          }
        }
      }

      if (parsed.exercises !== undefined && parsed.exercises !== null) {
        if (!Array.isArray(parsed.exercises)) {
          setJsonError("Field 'exercises' harus berupa array.");
          setJsonValid(false);
          return;
        }
        for (let i = 0; i < parsed.exercises.length; i++) {
          const item = parsed.exercises[i];
          if (!item || typeof item.prompt !== "string" || typeof item.answer !== "string") {
            setJsonError(`Exercises item ke-${i + 1} harus memiliki 'prompt' (string) dan 'answer' (string).`);
            setJsonValid(false);
            return;
          }
        }
      }

      setJsonError(null);
      setJsonValid(true);
    } catch (e) {
      const err = e as Error;
      setJsonError(`JSON Syntax Error: ${err.message}`);
      setJsonValid(false);
    }
  }, [jsonInput]);

  // Dapatkan kosakata dari file helper lokal DekiruNihongoGroup.js
  const getVocabularyList = () => {
    // Cari chapter berdasarkan index (chapter - 1)
    const chapData = DekiruNihongoGroups[chapter - 1];
    if (!chapData) return [];
    
    // Poin 1 = section index 0, Poin 2 = section index 1, Poin 3 = section index 2
    const sectionIndex = point - 1;
    const sectData = chapData.sections[sectionIndex];
    if (!sectData) return [];
    
    return sectData.examples || [];
  };

  const vocabularyList = getVocabularyList() as KotobaVocabularyItem[];
  const kotobaAliasMap = useMemo(
    () => buildKotobaAliasMap(vocabularyList),
    [vocabularyList],
  );
  const sortedKotobaAliases = useMemo(
    () => Array.from(kotobaAliasMap.keys()).sort((a, b) => b.length - a.length),
    [kotobaAliasMap],
  );

  const handleKanjiLookup = async (progressKey: string) => {
    await recordKotobaLookup(progressKey);
  };

  const renderJapaneseWithLookup = (text: string, keyPrefix: string) => {
    const parts: React.ReactNode[] = [];
    let index = 0;

    while (index < text.length) {
      const matchedAlias = sortedKotobaAliases.find((alias) =>
        text.startsWith(alias, index),
      );

      if (!matchedAlias) {
        parts.push(<span key={`${keyPrefix}-${index}`}>{text[index]}</span>);
        index += 1;
        continue;
      }

      const entry = kotobaAliasMap.get(matchedAlias);
      if (!entry) {
        parts.push(<span key={`${keyPrefix}-${index}`}>{text[index]}</span>);
        index += 1;
        continue;
      }

      parts.push(
        <KanjiLookupToken
          key={`${keyPrefix}-${index}-${entry.progressKey}`}
          text={text.slice(index, index + matchedAlias.length)}
          entry={entry}
          onLookup={handleKanjiLookup}
        />,
      );
      index += matchedAlias.length;
    }

    return parts;
  };

  // Salin prompt untuk dikirim ke LLM
  const handleCopyPrompt = () => {
    const promptText = `Anda adalah asisten AI bahasa Jepang. Saya akan mengunggah gambar/foto halaman dari buku Dekiru Nihongo Bab ${chapter} Poin Pembahasan ${point}.
Tolong ekstrak materi pelajaran pada foto tersebut dan buatkan data JSON terstruktur sesuai format berikut.

### FORMAT JSON YANG HARUS DIHASILKAN:
{
  "title": "[Judul Poin Pembahasan Bab ${chapter} Poin ${point}, contoh: 第6課 ポイント1（〜ませんか／一緒に〜ませんか）]",
  "sections": [
    {
      "title": "[Nama Sub-topik / bagian, contoh: 1. 〜ませんか]",
      "conversations": [
        {
          "speaker": "[Nama pembicara, contoh: A atau B]",
          "japanese": "[Kalimat dalam Bahasa Jepang asli, gunakan kanji standar yang ada di buku]",
          "translation": "[Terjemahan kalimat ke Bahasa Indonesia yang alami]"
        }
      ],
      "exercises": [
        {
          "prompt": "[Soal latihan/cues untuk latihan membuat kalimat dari bagian ini, contoh: ① 今週の金曜日・映画]",
          "answer": "[Kunci jawaban lengkap berupa kalimat/percakapan utuh berdasarkan pola tata bahasa dan contoh percakapan bagian ini. Berikan semua opsi respons (misal opsi menerima dan menolak) jika dicontohkan di buku. Contoh: A：今週の金曜日、一緒に映画を見ませんか。 B：いいですね。makan bersama? / B：ああ、今週の金曜日ですか. すみません、今週の金曜日はちょっと……。]"
        }
      ],
      "grammar": [
        {
          "pattern": "[Pola tata bahasa yang dipelajari, contoh: 〜ませんか]",
          "explanation": "[Penjelasan tata bahasa dalam Bahasa Indonesia]",
          "examples": [
            {
              "japanese": "[Contoh kalimat menggunakan pola ini]",
              "translation": "[Terjemahan contoh kalimat]"
            }
          ]
        }
      ]
    }
  ]
}

### ATURAN UTAMA:
1. Pastikan output HANYA berupa JSON valid dan bersih tanpa dibungkus markdown tambahan di luar JSON.
2. Tulis terjemahan ke Bahasa Indonesia dengan tata bahasa yang alami dan akurat.
3. Gunakan Kanji asli dari buku Jepang tersebut.
4. Kelompokkan percakapan (conversations), latihan soal (exercises), dan penjelasan tata bahasa (grammar) ke dalam bagian masing-masing di dalam array 'sections' agar terikat satu sama lain sesuai layout buku.`;

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simpan data persiapan ke database
  const handleSaveData = async () => {
    if (!jsonValid) return;

    try {
      const parsed = JSON.parse(jsonInput);
      const payload: PrepDataPayload = {
        chapter,
        point,
        title: parsed.title,
        conversations: parsed.conversations || null,
        grammar: parsed.grammar,
        exercises: parsed.exercises || null,
        sections: parsed.sections || null,
        audioFiles: selectedAudios,
      };

      const res = await fetch("/api/prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data);
        setIsEditing(false);
        alert(t.prepSaveSuccess || "Materi berhasil disimpan!");
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error || t.prepSaveFailed || "Gagal menyimpan materi!";
        alert(`Gagal menyimpan: ${errMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert(t.prepSaveFailed || "Terjadi kesalahan!");
    }
  };

  // Copy exam prompt containing aggregated grammar & vocabulary data
  const handleCopyExamPrompt = async () => {
    // 1. Aggregasi data kosakata dari DekiruNihongoGroups
    let vocabText = "";
    for (let c = examGroup; c <= examGroup + 2; c++) {
      const chapData = DekiruNihongoGroups[c - 1];
      if (chapData && chapData.sections) {
        vocabText += `\n### Kosakata Bab ${c}:\n`;
        chapData.sections.forEach((sect: any) => {
          if (sect.examples) {
            sect.examples.slice(0, 30).forEach((item: any) => {
              const kanjiStr = item.kanji === "-" ? "" : ` (${item.kanji})`;
              const meaning = item.translations?.id || item.translations?.en || "Tidak ada terjemahan";
              vocabText += `- ${item.hiragana}${kanjiStr}: ${meaning}\n`;
            });
          }
        });
      }
    }

    // 2. Aggregasi tata bahasa dari DB (fetch 3 bab)
    let grammarText = "";
    try {
      const promises = [];
      for (let c = examGroup; c <= examGroup + 2; c++) {
        for (let p = 1; p <= 3; p++) {
          promises.push(
            fetch(`/api/prep?chapter=${c}&point=${p}`)
              .then((res) => (res.ok ? res.json() : null))
              .then((json) => json?.data)
              .catch(() => null)
          );
        }
      }
      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean);
      
      validResults.forEach((pd: any) => {
        grammarText += `\n### Bab ${pd.chapter} Poin ${pd.point}: ${pd.title}\n`;
        if (pd.sections) {
          pd.sections.forEach((sect: any) => {
            grammarText += `- Bagian: ${sect.title}\n`;
            if (sect.grammar) {
              sect.grammar.forEach((g: any) => {
                grammarText += `  * Pola: ${g.pattern}\n  * Penjelasan: ${g.explanation}\n`;
              });
            }
          });
        }
      });
    } catch (e) {
      console.error("Gagal memuat data tata bahasa untuk prompt:", e);
    }

    const promptText = `Anda adalah asisten AI bahasa Jepang. Tolong buatkan Rangkuman Ujian yang komprehensif untuk persiapan ujian Dekiru Nihongo Bab ${examGroup} sampai Bab ${examGroup + 2}.
Tulis tanggapan Anda seluruhnya dalam Bahasa Indonesia yang alami, rapi, dan mudah dipahami oleh pembelajar.
Format keluaran wajib berupa Markdown yang indah (gunakan judul, daftar poin, dan tabel).

## ACUAN MATERI TATA BAHASA & PERCAKAPAN:
${grammarText || "Tidak ada data tata bahasa khusus. Gunakan standar materi Dekiru Nihongo."}

## ACUAN DAFTAR KOSAKATA:
${vocabText || "Tidak ada data kosakata khusus. Gunakan standar kosakata Dekiru Nihongo."}

---

## FORMAT RANGKUMAN UJIAN YANG HARUS DIHASILKAN:
1. **Ringkasan Partikel & Tata Bahasa Penting**: Rangkum partikel dan pola tata bahasa kunci dari Bab ${examGroup} - ${examGroup + 2}. Jelaskan fungsinya dan berikan contoh kalimat bahasa Jepang beserta artinya.
2. **Ungkapan & Kalimat Kunci Percakapan**: Rangkum ungkapan praktis dan kalimat penting yang sering keluar dalam dialog sehari-hari di Bab ${examGroup} - ${examGroup + 2} beserta artinya.
3. **Daftar Kosakata Esensial**: Sajikan daftar kosakata paling penting dari ketiga bab ini yang wajib dihafal sebelum ujian (Jepang, bacaan hiragana, arti).`;

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate summary automatically with Gemini 3.5 Flash
  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/prep/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startChapter: examGroup }),
      });
      
      if (res.ok) {
        const result = await res.json();
        if (result.summary) {
          setJsonInput(result.summary);
          setExamTitleInput(`Rangkuman Ujian Bab ${examGroup}-${examGroup + 2}`);
          setIsEditing(true);
        } else {
          alert("Gagal men-generate rangkuman: Format tanggapan AI tidak sesuai.");
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`Gagal men-generate rangkuman: ${errJson.error || "Terjadi kesalahan pada server."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi saat men-generate rangkuman.");
    } finally {
      setGenerating(false);
    }
  };

  // Save exam summary to DB
  const handleSaveExamSummary = async () => {
    if (!jsonInput.trim()) {
      alert("Rangkuman tidak boleh kosong!");
      return;
    }
    const finalTitle = examTitleInput.trim() || `Rangkuman Ujian Bab ${examGroup}-${examGroup + 2}`;

    try {
      const payload = {
        chapter: examGroup,
        point: 0,
        title: finalTitle,
        sections: { summaryText: jsonInput }
      };

      const res = await fetch("/api/prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data);
        setIsEditing(false);
        alert("Rangkuman berhasil disimpan!");
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`Gagal menyimpan: ${errJson.error || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  // Start editing exam summary
  const startEditingExam = () => {
    setExamTitleInput(data?.title || `Rangkuman Ujian Bab ${examGroup}-${examGroup + 2}`);
    const sectionsObj = data?.sections as any;
    const existingMarkdown = sectionsObj?.summaryText || "";
    setJsonInput(existingMarkdown);
    setIsEditing(true);
  };

  // Putar/Pause audio preview di uploader
  const handleTogglePreviewAudio = (url: string) => {
    if (previewAudioUrl === url) {
      if (previewPlaying) {
        previewAudioRef.current?.pause();
        setPreviewPlaying(false);
      } else {
        previewAudioRef.current?.play();
        setPreviewPlaying(true);
      }
    } else {
      setPreviewAudioUrl(url);
      setPreviewPlaying(true);
      if (previewAudioRef.current) {
        previewAudioRef.current.src = url;
        previewAudioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = new Audio();
    previewAudioRef.current = audio;
    audio.onended = () => {
      setPreviewPlaying(false);
    };
    return () => {
      audio.pause();
    };
  }, []);

  // Filter berkas audio yang sedang dicari, dan sembunyikan yang sudah terpilih
  const getFilteredAudios = () => {
    const result: Record<string, string[]> = {};
    Object.entries(audioOptions).forEach(([folder, files]) => {
      const filtered = files.filter((file) => {
        // Jangan tampilkan jika sudah terpilih
        if (selectedAudios.includes(file)) return false;
        
        // Filter pencarian jika ada
        if (searchAudio.trim()) {
          return (
            file.toLowerCase().includes(searchAudio.toLowerCase()) ||
            folder.toLowerCase().includes(searchAudio.toLowerCase())
          );
        }
        return true;
      });
      
      if (filtered.length > 0) {
        result[folder] = filtered;
      }
    });
    return result;
  };

  const filteredAudios = getFilteredAudios();

  if (studyMode === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="flex w-full max-w-4xl flex-col gap-8 animate-page-enter">
          <header className="text-center">
            <h1 className="font-jp text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl animate-pulse">
              日本語フロー
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted">
              Pilih mode belajar untuk melanjutkan persiapan bahasa Jepang Anda
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card Belajar Biasa */}
            <Card
              onClick={() => setStudyMode("biasa")}
              className="group border border-border bg-surface p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-64 rounded-2xl"
            >
              <div className="flex flex-col gap-3">
                <span className="text-4xl">📖</span>
                <h2 className="font-jp text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                  Belajar Biasa
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  Pelajari tata bahasa, dialog percakapan, latihan soal, dan dengarkan audio per bab dan poin secara bertahap.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-full font-semibold bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors cursor-pointer rounded-xl"
                onClick={() => setStudyMode("biasa")}
              >
                Mulai Belajar
              </Button>
            </Card>

            {/* Card Ujian (Summary) */}
            <Card
              onClick={() => setStudyMode("ujian")}
              className="group border border-border bg-surface p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-64 rounded-2xl"
            >
              <div className="flex flex-col gap-3">
                <span className="text-4xl">📝</span>
                <h2 className="font-jp text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                  Rangkuman Ujian
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  Pelajari rangkuman materi gabungan per 3 bab. Ringkasan partikel, kosakata esensial, dan ungkapan kunci percakapan.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-full font-semibold bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors cursor-pointer rounded-xl"
                onClick={() => setStudyMode("ujian")}
              >
                Mulai Ujian
              </Button>
            </Card>

            {/* Card Latihan Ujian */}
            <Card
              onClick={() => setStudyMode("latihan")}
              className="group border border-border bg-surface p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-64 rounded-2xl"
            >
              <div className="flex flex-col gap-3">
                <span className="text-4xl">🎯</span>
                <h2 className="font-jp text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                  Latihan Ujian
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  Uji kemampuan Anda dengan latihan soal interaktif dari bab 10-12. Penilaian otomatis dan ulasan jawaban lengkap.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-full font-semibold bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors cursor-pointer rounded-xl"
                onClick={() => setStudyMode("latihan")}
              >
                Mulai Latihan
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground flex items-center gap-2 truncate">
                <span>日本語フロー</span>
                <span className="font-sans text-[10px] sm:text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  {studyMode === "biasa" ? "Prep" : studyMode === "ujian" ? "Ujian" : "Latihan Ujian"}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                className="text-xs font-semibold cursor-pointer border border-border bg-background rounded-xl"
                onClick={() => {
                  setStudyMode(null);
                  setIsEditing(false);
                }}
              >
                ← Menu Utama
              </Button>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Kontrol Seleksi Bab & Poin (Belajar Biasa) */}
        {studyMode === "biasa" && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            {/* Pemilih Bab */}
            <div className="flex flex-1 flex-col gap-1.5">
              <Select
                className="w-full"
                selectedKey={String(chapter)}
                onSelectionChange={(key) => {
                  if (key) setChapter(Number(key));
                }}
              >
                <Label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">{t.prepSelectChapter}</Label>
                <Select.Trigger className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px]">
                  <Select.Value className="truncate text-left" />
                  <Select.Indicator className="text-muted ml-2 font-xs">▼</Select.Indicator>
                </Select.Trigger>
                <Select.Popover className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50">
                  <ListBox>
                    {Array.from({ length: 15 }, (_, i) => {
                      const chapNum = String(i + 1);
                      const title = `Bab ${chapNum} — ${DekiruNihongoGroups[i]?.title || ""}`;
                      return (
                        <ListBox.Item key={chapNum} id={chapNum} textValue={title} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm">
                          {title}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      );
                    })}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Pemilih Poin */}
            <div className="flex flex-col gap-1.5 sm:w-60">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">
                {t.prepSelectPoint}
              </label>
              <Tabs
                selectedKey={String(point)}
                onSelectionChange={(key) => setPoint(Number(key))}
                variant="primary"
                className="w-full"
              >
                <Tabs.ListContainer>
                  <Tabs.List
                    aria-label={t.prepSelectPoint}
                    className={[
                      "w-full flex",
                      "*:h-8 *:px-3 *:text-xs *:font-semibold",
                      "*:data-[selected=true]:text-accent-foreground",
                    ].join(" ")}
                  >
                    {[1, 2, 3].map((p) => (
                      <Tabs.Tab key={p} id={String(p)} className="flex-1 text-center cursor-pointer">
                        Poin {p}
                        <Tabs.Indicator className="bg-accent" />
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
            </div>
          </div>
        )}

        {/* Kontrol Seleksi Bab Ujian (Ujian) */}
        {studyMode === "ujian" && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex flex-col gap-1.5">
              <Select
                className="w-full"
                selectedKey={String(examGroup)}
                onSelectionChange={(key) => {
                  if (key) setExamGroup(Number(key));
                }}
              >
                <Label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Pilih Bab Ujian (Rangkuman 3 Bab)</Label>
                <Select.Trigger className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px]">
                  <Select.Value className="truncate text-left" />
                  <Select.Indicator className="text-muted ml-2 font-xs">▼</Select.Indicator>
                </Select.Trigger>
                <Select.Popover className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50">
                  <ListBox>
                    {[
                      { id: "1", title: "Bab 1 - 3 — Rangkuman Ujian" },
                      { id: "4", title: "Bab 4 - 6 — Rangkuman Ujian" },
                      { id: "7", title: "Bab 7 - 9 — Rangkuman Ujian" },
                      { id: "10", title: "Bab 10 - 12 — Rangkuman Ujian" },
                      { id: "13", title: "Bab 13 - 15 — Rangkuman Ujian" }
                    ].map((g) => (
                      <ListBox.Item key={g.id} id={g.id} textValue={g.title} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm">
                        {g.title}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <Spinner size="lg" color="accent" />
            <p className="text-sm text-muted">Memuat data...</p>
          </div>
        ) : (
          <main className="mt-6">
            {studyMode === "biasa" && (
              <>
                {/* TAMPILAN JIKA MATERI BELUM ADA & BUKAN EDIT MODE */}
                {!data && !isEditing ? (
              <div className="flex flex-col items-center gap-6 py-16 text-center rounded-2xl border border-dashed border-border bg-surface/50 px-6">
                <span className="font-jp text-6xl select-none opacity-20">書</span>
                <div className="max-w-md flex flex-col gap-2">
                  <h3 className="font-bold text-foreground text-lg">
                    {t.prepNoDataTitle}
                  </h3>
                  <p className="text-sm text-muted">
                    {t.prepNoDataDesc}
                  </p>
                </div>
                
                {role && (
                  <Button
                    variant="primary"
                    className="font-semibold shadow-sm cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    + Unggah Data Poin Pembahasan
                  </Button>
                )}
              </div>
            ) : null}

            {/* EDIT / UPLOAD FORM */}
            {isEditing ? (
              <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-md font-bold text-foreground">
                    ⚙️ {t.prepEditData} (Bab {chapter} Poin {point}) — {username} ({role})
                  </h2>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="font-semibold text-red-500 hover:text-red-600 cursor-pointer"
                    onClick={() => setIsEditing(false)}
                  >
                    {t.cancel}
                  </Button>
                </div>

                {/* Tutorial Panduan Unggah */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-950/10 p-4">
                  <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                    📖 {t.prepUploadInstruction}
                  </h3>
                  <ol className="text-xs text-muted list-decimal pl-4 space-y-1.5">
                    <li>Foto halaman buku teks untuk <b>Bab {chapter} Poin {point}</b>.</li>
                    <li>Salin prompt di bawah ini untuk digunakan pada AI / LLM Vision (misalnya <i>Gemini</i>).</li>
                    <li>Kirimkan foto buku beserta prompt tersebut ke AI.</li>
                    <li>Salin hasil format JSON dari AI dan tempelkan pada kolom teks di bawah ini.</li>
                    <li>Pilih rekaman audio yang sesuai di bagian bawah halaman.</li>
                  </ol>
                </div>

                {/* Prompt AI Button */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground">
                    {t.prepLLMPromptTitle}
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1 shadow-xs border-none cursor-pointer"
                      onClick={handleCopyPrompt}
                    >
                      {copied ? `✓ ${t.prepPromptCopied}` : `📋 ${t.prepCopyPrompt}`}
                    </Button>
                  </div>
                </div>

                {/* Input Textarea JSON */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-2">
                      {t.prepPasteJsonLabel}
                      {jsonValid ? (
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full whitespace-nowrap">✓ JSON Valid</span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-semibold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full whitespace-nowrap">✗ Invalid / Kosong</span>
                      )}
                    </span>
                    <div className="flex gap-3">
                      {data && (
                        <button
                          type="button"
                          onClick={() => setJsonInput(JSON.stringify({
                            title: data.title,
                            conversations: data.conversations || undefined,
                            grammar: data.grammar,
                            exercises: data.exercises || undefined,
                            sections: data.sections || undefined
                          }, null, 2))}
                          className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          Muat Data Saat Ini
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setJsonInput(getPlaceholderJson(chapter, point))}
                        className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        Muat Template Contoh
                      </button>
                    </div>
                  </label>
                  <TextArea
                    value={jsonInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                    placeholder={getPlaceholderJson(chapter, point)}
                    rows={12}
                    variant="secondary"
                    className="font-mono text-xs bg-background border border-border rounded-xl p-2.5 resize-y leading-relaxed"
                  />
                  {jsonError && (
                    <p className="text-[11px] text-red-500 font-medium bg-red-50 dark:bg-red-950/10 p-2 rounded-lg border border-red-100 dark:border-red-950/30">
                      {jsonError}
                    </p>
                  )}
                </div>

                {/* Pemilih Audio Dinamis */}
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <label className="text-xs font-bold text-foreground">
                    🎵 {t.prepAudioSelectLabel}
                  </label>

                  {/* Audio Terpilih (Selected Audios) */}
                  {selectedAudios.length > 0 && (
                    <div className="flex flex-col gap-1.5 mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Audio Terpilih ({selectedAudios.length})
                      </span>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5 p-2 space-y-1.5 max-h-40 overflow-y-auto">
                        {selectedAudios.map((file) => {
                          const isPreviewingThis = previewAudioUrl === file;
                          return (
                            <div key={file} className="flex items-center justify-between gap-2 py-1 px-2 bg-surface rounded-lg border border-border shadow-xs">
                              <span className="text-[11px] font-medium text-foreground truncate block flex-1">
                                ✅ {file.split("/").pop()}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className={`h-5 min-w-10 px-1 text-[9px] font-bold cursor-pointer ${
                                    isPreviewingThis && previewPlaying
                                      ? "bg-red-500 text-white hover:bg-red-600"
                                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                                  }`}
                                  onClick={() => handleTogglePreviewAudio(file)}
                                >
                                  {isPreviewingThis && previewPlaying ? "Pause ⏸" : "Cek 🔊"}
                                </Button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedAudios(prev => prev.filter((a) => a !== file))}
                                  className="text-[10px] text-red-500 hover:text-red-600 font-bold px-2 py-0.5 cursor-pointer bg-transparent border-none"
                                >
                                  Hapus ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Cari berkas audio (contoh: DiscA_01)..."
                    value={searchAudio}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchAudio(e.target.value)}
                    className="w-full mb-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-hidden"
                  />
                  
                  {Object.keys(filteredAudios).length === 0 ? (
                    <p className="text-xs text-muted italic p-4 text-center rounded-xl bg-surface-muted border border-border">
                      {t.prepNoAudioAvailable}
                    </p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-surface-muted p-3 space-y-3">
                      {Object.entries(filteredAudios).map(([folder, files]) => (
                        <div key={folder} className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }))}
                            className="flex w-full items-center justify-between text-xs font-bold text-foreground border-b border-border pb-1 hover:text-indigo-500 transition-colors"
                          >
                            <span>📁 {folder} ({files.length} audio)</span>
                            <span>{expandedFolders[folder] ? "▼" : "▶"}</span>
                          </button>

                          {expandedFolders[folder] && (
                            <div className="pl-3 space-y-1">
                              {files.map((file) => {
                                const isChecked = selectedAudios.includes(file);
                                const isPreviewingThis = previewAudioUrl === file;
                                return (
                                  <div key={file} className="flex items-center justify-between gap-2 py-0.5 hover:bg-surface/50 rounded px-1 transition-colors">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedAudios(prev => prev.filter((a) => a !== file));
                                          } else {
                                            setSelectedAudios(prev => [...prev, file]);
                                          }
                                        }}
                                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                                      />
                                      <span className="text-[11px] text-foreground truncate block max-w-[200px] sm:max-w-[400px]">
                                        {file.split("/").pop()}
                                      </span>
                                    </label>

                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className={`h-6 min-w-12 px-1 text-[10px] font-bold cursor-pointer ${
                                        isPreviewingThis && previewPlaying
                                          ? "bg-red-500 text-white hover:bg-red-600"
                                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                                      }`}
                                      onClick={() => handleTogglePreviewAudio(file)}
                                    >
                                      {isPreviewingThis && previewPlaying ? "Pause ⏸" : "Cek 🔊"}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end border-t border-border pt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setIsEditing(false)}
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="font-semibold shadow-xs cursor-pointer"
                    onClick={handleSaveData}
                    isDisabled={!jsonValid}
                  >
                    {t.prepSaveData}
                  </Button>
                </div>
              </Card>
            ) : null}

            {/* PANEL BELAJAR JIKA DATA SUDAH TERSEDIA */}
            {data && !isEditing ? (
              <div className="flex flex-col gap-6">
                
                {/* Judul Materi Pelajaran */}
                <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                      Bab {chapter} Poin {point}
                    </span>
                    <h2 className="font-jp text-xl font-bold text-foreground mt-0.5">
                      {data.title}
                    </h2>
                  </div>

                  {role && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="font-semibold self-start sm:self-center shrink-0 cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Materi
                    </Button>
                  )}
                </div>

                {/* Tab Menu Belajar */}
                <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border pt-3 flex justify-center">
                  <div className="flex gap-6 flex-wrap justify-center">
                    {[
                      { id: "dialogue", label: t.prepTabMateri || "💬 Materi & Latihan" },
                      { id: "grammar", label: t.prepTabGrammar || "📚 Tata Bahasa" },
                      { id: "vocabulary", label: t.prepTabVocabulary || "📝 Kosakata (Kotoba)" },
                      { id: "audio", label: t.prepTabAudio || "🎵 Putar Audio" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                          "pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-200",
                          activeTab === tab.id
                            ? "border-accent text-accent"
                            : "border-transparent text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB KONTEN 1: MATERI & LATIHAN (CONVERSATIONS + EXERCISES) */}
                {activeTab === "dialogue" && (
                  <div className="flex flex-col gap-6">
                    
                    {/* 1. SECTIONS / SUB-TOPICS (CONVERSATIONS + EXERCISES) */}
                    {data.sections && data.sections.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {data.sections.map((sect, sectIdx) => (
                          <div key={sectIdx} className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
                            {/* Section Header */}
                            <div className="border-b border-border pb-3">
                              <h3 className="text-md font-bold text-indigo-500 font-jp">
                                {sect.title}
                              </h3>
                            </div>

                            {/* Section Contoh Percakapan (Dialogue) */}
                            {sect.conversations && sect.conversations.length > 0 && (
                              <div className="flex flex-col gap-4">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Example dialogue</h4>
                                <div className="space-y-4">
                                  {sect.conversations.map((conv, convIdx) => {
                                    const dialogKey = `sect-${sectIdx}-conv-${convIdx}`;
                                    const isTranslationVisible = !!showDialogTranslationFor[dialogKey];
                                    return (
                                      <div key={convIdx} className="flex gap-3 items-start">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 text-xs font-bold shrink-0 mt-0.5">
                                          {conv.speaker}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                          <span className="font-jp text-base text-foreground leading-relaxed">
                                            {renderJapaneseWithLookup(
                                              conv.japanese,
                                              `sect-${sectIdx}-conv-${convIdx}`,
                                            )}
                                          </span>
                                          {isTranslationVisible ? (
                                            <div className="text-sm text-foreground/70 flex items-center gap-1.5 mt-0.5 select-none">
                                              <span>{conv.translation}</span>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setShowDialogTranslationFor((prev) => ({
                                                    ...prev,
                                                    [dialogKey]: false,
                                                  }));
                                                }}
                                                className="text-[10px] font-semibold text-indigo-500 hover:underline ml-1 cursor-pointer"
                                              >
                                                (Hide)
                                              </button>
                                            </div>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setShowDialogTranslationFor((prev) => ({
                                                  ...prev,
                                                  [dialogKey]: true,
                                                }));
                                              }}
                                              className="self-start text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-500/5 hover:bg-indigo-500/10 px-2 py-0.5 rounded-md transition-all mt-1 cursor-pointer select-none"
                                            >
                                              Show translation
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Section Latihan Soal (Exercises) */}
                            {sect.exercises && sect.exercises.length > 0 && (
                              <div className="flex flex-col gap-3 pt-4 border-t border-dashed border-border mt-2">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">✍️ Latihan Soal</h4>
                                <div className="grid grid-cols-1 gap-3">
                                  {sect.exercises.map((ex, exIdx) => {
                                    const cardKey = `sect-${sectIdx}-ex-${exIdx}`;
                                    const isAnswerVisible = !!showAnswerFor[cardKey];
                                    return (
                                      <div key={exIdx} className="rounded-xl border border-border bg-surface-muted/30 p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-baseline gap-2">
                                          <span className="font-jp text-sm font-semibold text-foreground flex-1">
                                            {ex.prompt}
                                          </span>
                                          <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-semibold px-2 py-0.5 rounded-full shrink-0">
                                            Soal {exIdx + 1}
                                          </span>
                                        </div>

                                        <div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowAnswerFor((prev) => ({
                                                ...prev,
                                                [cardKey]: !prev[cardKey],
                                              }));
                                            }}
                                            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                          >
                                            {isAnswerVisible
                                              ? t.prepExerciseHideAnswer || "Sembunyikan Kunci Jawaban"
                                              : t.prepExerciseShowAnswer || "Tampilkan Kunci Jawaban"}
                                          </button>

                                          {isAnswerVisible && (
                                            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-all duration-300">
                                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                {t.prepExerciseCorrectAnswerLabel || "Kunci Jawaban (LLM):"}
                                              </span>
                                              <p className="font-jp text-sm text-foreground whitespace-pre-line leading-relaxed">
                                                {ex.answer}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Flat Legacy fallback */
                      <div className="flex flex-col gap-6">
                        {data.conversations && data.conversations.length > 0 && (
                          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-indigo-500 pb-2 border-b border-border">💬 Contoh Percakapan</h3>
                            <div className="space-y-4">
                              {data.conversations.map((conv, idx) => {
                                const dialogKey = `legacy-conv-${idx}`;
                                const isTranslationVisible = !!showDialogTranslationFor[dialogKey];
                                return (
                                  <div key={idx} className="flex gap-3 items-start">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 text-xs font-bold shrink-0 mt-0.5">
                                      {conv.speaker}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                      <span className="font-jp text-base text-foreground leading-relaxed">
                                        {renderJapaneseWithLookup(
                                          conv.japanese,
                                          `legacy-conv-${idx}`,
                                        )}
                                      </span>
                                      {isTranslationVisible ? (
                                        <div className="text-sm text-foreground/70 flex items-center gap-1.5 mt-0.5 select-none">
                                          <span>{conv.translation}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowDialogTranslationFor((prev) => ({
                                                ...prev,
                                                [dialogKey]: false,
                                              }));
                                            }}
                                            className="text-[10px] font-semibold text-indigo-500 hover:underline ml-1 cursor-pointer"
                                          >
                                            (Hide)
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowDialogTranslationFor((prev) => ({
                                              ...prev,
                                              [dialogKey]: true,
                                            }));
                                          }}
                                          className="self-start text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-500/5 hover:bg-indigo-500/10 px-2 py-0.5 rounded-md transition-all mt-1 cursor-pointer select-none"
                                        >
                                          Show translation
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {data.exercises && data.exercises.length > 0 && (
                          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-indigo-500 pb-2 border-b border-border">✍️ Latihan Soal</h3>
                            <div className="grid grid-cols-1 gap-3">
                              {data.exercises.map((ex, idx) => {
                                const cardKey = `legacy-ex-${idx}`;
                                const isAnswerVisible = !!showAnswerFor[cardKey];
                                return (
                                  <div key={idx} className="rounded-xl border border-border bg-surface-muted/30 p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-baseline gap-2">
                                      <span className="font-jp text-sm font-semibold text-foreground">
                                        {ex.prompt}
                                      </span>
                                      <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-semibold px-2 py-0.5 rounded-full shrink-0">
                                        Soal {idx + 1}
                                      </span>
                                    </div>

                                    <div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAnswerFor((prev) => ({
                                            ...prev,
                                            [cardKey]: !prev[cardKey],
                                          }));
                                        }}
                                        className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                      >
                                        {isAnswerVisible
                                          ? t.prepExerciseHideAnswer || "Sembunyikan Kunci Jawaban"
                                          : t.prepExerciseShowAnswer || "Tampilkan Kunci Jawaban"}
                                      </button>

                                      {isAnswerVisible && (
                                        <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-all duration-300">
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            {t.prepExerciseCorrectAnswerLabel || "Kunci Jawaban (LLM):"}
                                          </span>
                                          <p className="font-jp text-sm text-foreground whitespace-pre-line leading-relaxed">
                                            {ex.answer}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* TAB KONTEN 2: TATA BAHASA (GRAMMAR) */}
                {activeTab === "grammar" && (
                  <div className="flex flex-col gap-6">
                    {/* Section-level Grammar if available */}
                    {data.sections && data.sections.some(s => s.grammar && s.grammar.length > 0) && (
                      <div className="flex flex-col gap-6">
                        {data.sections.map((sect, sectIdx) => {
                          if (!sect.grammar || sect.grammar.length === 0) return null;
                          return (
                            <div key={sectIdx} className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                              <div className="border-b border-border pb-2">
                                <h3 className="text-md font-bold text-indigo-500 font-jp">
                                  {sect.title}
                                </h3>
                              </div>
                              <div className="flex flex-col gap-3">
                                {sect.grammar.map((gram, gramIdx) => {
                                  const grammarKey = `sect-${sectIdx}-gram-${gramIdx}`;
                                  const isGrammarVisible = showAnswerFor[grammarKey] ?? true;
                                  return (
                                    <div key={gramIdx} className="rounded-xl border border-border bg-surface-muted/30 p-4 flex flex-col gap-2">
                                      <div className="flex justify-between items-center">
                                        <h5 className="font-jp text-base font-bold text-indigo-500">
                                          {gram.pattern}
                                        </h5>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowAnswerFor((prev) => ({
                                              ...prev,
                                              [grammarKey]: !isGrammarVisible,
                                            }));
                                          }}
                                          className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                        >
                                          {isGrammarVisible ? "Hide ▲" : "Show ▼"}
                                        </button>
                                      </div>

                                      {isGrammarVisible && (
                                        <div className="mt-2.5 flex flex-col gap-3 transition-all duration-300">
                                          <p className="text-sm text-foreground leading-relaxed">
                                            {gram.explanation}
                                          </p>

                                          {gram.examples && gram.examples.length > 0 && (
                                            <div className="space-y-3 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                                              {gram.examples.map((ex, exIdx) => (
                                                <div key={exIdx} className="flex flex-col gap-0.5">
                                                  <span className="font-jp text-base text-foreground">
                                                    {renderJapaneseWithLookup(
                                                      ex.japanese,
                                                      `sect-${sectIdx}-gram-${gramIdx}-example-${exIdx}`,
                                                    )}
                                                  </span>
                                                  <span className="text-sm text-foreground/70">
                                                    {ex.translation}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Root-level Grammar (Legacy fallback / Root explanations) */}
                    {data.grammar && data.grammar.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <div className="border-b border-border pb-2">
                          <h3 className="text-md font-bold text-foreground">
                            📚 {t.prepGrammarTitle || "Penjelasan Tata Bahasa"}
                          </h3>
                        </div>

                        <div className="flex flex-col gap-4">
                          {data.grammar.map((gram, idx) => {
                            const grammarKey = `grammar-${idx}`;
                            const isGrammarVisible = showAnswerFor[grammarKey] ?? true;
                            return (
                              <Card key={idx} className="border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-lg font-bold text-indigo-500 font-jp">
                                    {gram.pattern}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowAnswerFor((prev) => ({
                                        ...prev,
                                        [grammarKey]: !isGrammarVisible,
                                      }));
                                    }}
                                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                  >
                                    {isGrammarVisible ? "Hide ▲" : "Show ▼"}
                                  </button>
                                </div>

                                {isGrammarVisible && (
                                  <div className="flex flex-col gap-3 border-t border-border pt-3 transition-all duration-300">
                                    <p className="text-sm text-foreground leading-relaxed">
                                      {gram.explanation}
                                    </p>

                                    {gram.examples && gram.examples.length > 0 && (
                                      <div className="space-y-3 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                                        {gram.examples.map((ex, exIdx) => (
                                          <div key={exIdx} className="flex flex-col gap-0.5">
                                            <span className="font-jp text-base text-foreground">
                                              {renderJapaneseWithLookup(
                                                ex.japanese,
                                                `grammar-${idx}-example-${exIdx}`,
                                              )}
                                            </span>
                                            <span className="text-sm text-foreground/70">
                                              {ex.translation}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* No grammar data message */}
                    {(!data.grammar || data.grammar.length === 0) && (!data.sections || !data.sections.some(s => s.grammar && s.grammar.length > 0)) && (
                      <p className="text-xs text-muted italic text-center p-8 border border-border rounded-xl">
                        No grammar notes for this chapter yet.
                      </p>
                    )}
                  </div>
                )}

                {/* TAB KONTEN 2: KOSAKATA (KOTOBA) */}
                {activeTab === "vocabulary" && (
                  <div className="flex flex-col gap-4">
                    {/* Control Options */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-border bg-surface-muted/30">
                      <span className="text-xs font-semibold text-muted">
                        {t.prepTogglesLabel || "Opsi Tebakan:"}
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground">
                          <input
                            type="checkbox"
                            checked={showAllHiragana}
                            onChange={() => {
                              setShowAllHiragana(!showAllHiragana);
                              setHiddenHiraganaCards({});
                            }}
                            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                          />
                          <span>{t.prepToggleHiragana || "Hiragana"}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground">
                          <input
                            type="checkbox"
                            checked={showAllTranslation}
                            onChange={() => {
                              setShowAllTranslation(!showAllTranslation);
                              setHiddenTranslationCards({});
                            }}
                            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                          />
                          <span>{t.prepToggleTranslation || "Arti"}</span>
                        </label>
                      </div>
                    </div>

                    {/* Word Grid */}
                    {vocabularyList.length === 0 ? (
                      <p className="text-xs text-muted italic text-center p-8 border border-border rounded-xl">
                        Tidak ada kosakata untuk bab ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vocabularyList.map((item, idx) => {
                          const cardId = `${idx}-${item.kanji}-${item.hiragana}`;
                          const isHiraganaHidden = !showAllHiragana && !hiddenHiraganaCards[cardId];
                          const isTranslationHidden = !showAllTranslation && !hiddenTranslationCards[cardId];
                          const lookupEntry = createKotobaLookupEntry(item);

                          return (
                            <Card
                              key={idx}
                              className="border border-border bg-surface p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-indigo-400 transition-colors"
                            >
                              <div className="flex justify-between items-baseline gap-2">
                                {lookupEntry ? (
                                  <KanjiLookupToken
                                    text={lookupEntry.display}
                                    entry={lookupEntry}
                                    onLookup={handleKanjiLookup}
                                  />
                                ) : (
                                  <span className="font-jp text-lg font-bold text-foreground">
                                    {item.kanji === "-" ? item.hiragana : item.kanji}
                                  </span>
                                )}

                                {/* Hiragana / Bacaan */}
                                {item.kanji !== "-" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setHiddenHiraganaCards(prev => ({
                                        ...prev,
                                        [cardId]: !prev[cardId]
                                      }));
                                    }}
                                    className={[
                                      "text-xs font-semibold px-2 py-0.5 rounded-sm transition-all duration-200",
                                      isHiraganaHidden
                                        ? "bg-slate-200 dark:bg-slate-800 text-transparent select-none cursor-pointer"
                                        : "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500"
                                    ].join(" ")}
                                  >
                                    {isHiraganaHidden ? "Klik bacaan" : item.hiragana}
                                  </button>
                                )}
                              </div>

                              {/* Arti terjemahan */}
                              <div className="border-t border-border pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHiddenTranslationCards(prev => ({
                                      ...prev,
                                      [cardId]: !prev[cardId]
                                    }));
                                  }}
                                  className={[
                                    "text-xs text-left w-full block transition-all duration-200 py-0.5 px-1 rounded-sm",
                                    isTranslationHidden
                                      ? "bg-slate-200 dark:bg-slate-800 text-transparent select-none cursor-pointer"
                                      : "text-muted"
                                  ].join(" ")}
                                >
                                  {isTranslationHidden
                                    ? "Klik arti kata"
                                    : item.translations?.id || item.translations?.en || "No meaning"
                                  }
                                </button>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB KONTEN 3: PUTAR AUDIO */}
                {activeTab === "audio" && (
                  <div className="flex flex-col gap-4">
                    {(!data.audioFiles || data.audioFiles.length === 0) ? (
                      <p className="text-xs text-muted italic text-center p-8 border border-border rounded-xl">
                        Tidak ada berkas audio yang diasosiasikan untuk bab ini.
                      </p>
                    ) : (
                      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                        <div className="border-b border-border pb-2">
                          <h3 className="text-md font-bold text-foreground">
                            🎵 Pemutar Audio Pembahasan
                          </h3>
                        </div>
                        <div className="flex flex-col gap-4">
                          {data.audioFiles.map((audioPath, idx) => (
                            <div key={audioPath} className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface-muted/30">
                              <span className="text-xs font-bold text-foreground">
                                Track {idx + 1} — {audioPath.split("/").pop()}
                              </span>
                              <audio
                                src={audioPath}
                                controls
                                className="w-full h-9 rounded-lg mt-1"
                                style={{ outline: "none" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : null}
              </>
            )}

            {studyMode === "ujian" && (
              <>
                {/* UJIAN: MATERI BELUM ADA */}
                {!data && !isEditing ? (
                  <div className="flex flex-col items-center gap-6 py-16 text-center rounded-2xl border border-dashed border-border bg-surface/50 px-6">
                    <span className="font-jp text-6xl select-none opacity-20">試</span>
                    <div className="max-w-md flex flex-col gap-2">
                      <h3 className="font-bold text-foreground text-lg">
                        Rangkuman Ujian Belum Tersedia
                      </h3>
                      <p className="text-sm text-muted">
                        Belum ada rangkuman ujian untuk Bab {examGroup} - {examGroup + 2} di database. Anda dapat men-generate otomatis dengan AI Gemini 3.5 Flash atau memasukkannya secara manual.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md mt-2">
                      {generating ? (
                        <Button variant="secondary" className="flex-1 font-semibold cursor-not-allowed bg-indigo-500/20 text-indigo-500 rounded-xl" isDisabled>
                          <Spinner size="sm" color="current" className="mr-2" /> Men-generate Rangkuman...
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="flex-1 font-semibold shadow-sm cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl"
                          onClick={handleGenerateSummary}
                        >
                          🤖 Generate Rangkuman (AI)
                        </Button>
                      )}

                      {role && (
                        <Button
                          variant="secondary"
                          className="flex-1 font-semibold shadow-sm cursor-pointer rounded-xl"
                          onClick={() => {
                            setExamTitleInput(`Rangkuman Ujian Bab ${examGroup}-${examGroup + 2}`);
                            setJsonInput("");
                            setIsEditing(true);
                          }}
                        >
                          ✍️ Tulis Manual
                        </Button>
                      )}
                    </div>

                    {/* AI Prompt Area */}
                    <div className="w-full max-w-lg mt-4 border border-border rounded-xl bg-surface p-4 text-left">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-foreground">
                          📋 Prompt AI Rangkuman Ujian (Termasuk 3 Bab Data)
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-[10px] h-6 px-2.5 font-bold bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer border-none rounded-lg"
                          onClick={handleCopyExamPrompt}
                        >
                          {copied ? "✓ Tersalin!" : "Salin Prompt"}
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        Salin prompt ini untuk dikirimkan secara manual ke ChatGPT, Claude, atau Gemini. Prompt ini berisi instruksi and data kosakata serta tata bahasa esensial dari bab {examGroup} sampai {examGroup + 2}.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* UJIAN: FORM EDIT */}
                {isEditing ? (
                  <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-md font-bold text-foreground">
                        ⚙️ Edit Rangkuman Ujian (Bab {examGroup} - {examGroup + 2}) — {username} ({role})
                      </h2>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="font-semibold text-red-500 hover:text-red-600 cursor-pointer rounded-xl"
                        onClick={() => setIsEditing(false)}
                      >
                        {t.cancel}
                      </Button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Judul Rangkuman
                      </Label>
                      <Input
                        value={examTitleInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamTitleInput(e.target.value)}
                        placeholder={`Rangkuman Ujian Bab ${examGroup}-${examGroup + 2}`}
                        variant="secondary"
                        className="font-sans text-xs bg-background border border-border rounded-xl p-2.5"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Konten Rangkuman (Format Markdown)
                      </Label>
                      <TextArea
                        value={jsonInput}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                        placeholder="Tulis rangkuman Anda di sini..."
                        rows={16}
                        variant="secondary"
                        className="font-mono text-xs bg-background border border-border rounded-xl p-2.5 resize-y leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 justify-end border-t border-border pt-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer rounded-xl"
                        onClick={() => setIsEditing(false)}
                      >
                        {t.cancel}
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="font-semibold shadow-xs cursor-pointer rounded-xl"
                        onClick={handleSaveExamSummary}
                        isDisabled={!jsonInput.trim()}
                      >
                        Simpan Rangkuman
                      </Button>
                    </div>
                  </Card>
                ) : null}

                {/* UJIAN: TAMPILAN MATERI JIKA DATA SUDAH TERSEDIA */}
                {data && !isEditing ? (
                  <div className="flex flex-col gap-6">
                    
                    {/* Judul Rangkuman */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                          Rangkuman Ujian Bab {examGroup} - {examGroup + 2}
                        </span>
                        <h2 className="font-jp text-xl font-bold text-foreground mt-0.5">
                          {data.title}
                        </h2>
                      </div>

                      {role && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="font-semibold self-start sm:self-center shrink-0 cursor-pointer rounded-xl"
                          onClick={startEditingExam}
                        >
                          ✏️ Edit Rangkuman
                        </Button>
                      )}
                    </div>

                    {/* Markdown Viewer */}
                    <Card className="border border-border bg-surface p-6 shadow-sm rounded-2xl">
                      <RenderMarkdown content={(data.sections as any)?.summaryText || ""} />
                    </Card>
                  </div>
                ) : null}
              </>
            )}

            {studyMode === "latihan" && (
              <LatihanUjian
                onBackToMenu={() => {
                  setStudyMode(null);
                  setIsEditing(false);
                }}
              />
            )}

          </main>
        )}

      </div>
    </div>
  );
}
