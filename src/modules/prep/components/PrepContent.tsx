"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button, Card, Popover, Tabs } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";
import { recordKotobaLookup } from "@/src/modules/stories/actions";
import {
  buildKotobaAliasMap,
  createKotobaLookupEntry,
  type KotobaLookupEntry,
} from "@/src/modules/prep/lib/kotoba-lookup";

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

export function PrepContent({ username, role }: PrepContentProps) {
  const { lang, t } = useLanguage();

  // State pemilihan bab & poin
  const [chapter, setChapter] = useState<number>(1);
  const [point, setPoint] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
    if (storedChapter) {
      setChapter(Number(storedChapter));
    }
    if (storedPoint) {
      setPoint(Number(storedPoint));
    }
    setIsLoaded(true);
  }, []);

  // Simpan chapter & point ke localStorage setiap kali ada perubahan setelah inisialisasi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("rj-prep-chapter", String(chapter));
      localStorage.setItem("rj-prep-point", String(point));
    }
  }, [chapter, point, isLoaded]);

  // Ambil data persiapan dari database saat chapter/point berubah
  useEffect(() => {
    if (!isLoaded) return;
    async function fetchPrepData() {
      setLoading(true);
      setIsEditing(false);
      setData(null);
      setUserAnswers({});
      setShowAnswerFor({});
      setShowDialogTranslationFor({});
      try {
        const res = await fetch(`/api/prep?chapter=${chapter}&point=${point}`);
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
  }, [chapter, point, isLoaded]);

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
                  Prep
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Kontrol Seleksi Bab & Poin */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Pemilih Bab */}
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">
              {t.prepSelectChapter}
            </label>
            <select
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden"
            >
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Bab {i + 1} — {DekiruNihongoGroups[i]?.title || ""}
                </option>
              ))}
            </select>
          </div>

          {/* Pemilih Poin */}
          <div className="flex flex-col gap-1.5 sm:w-60">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">
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

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm text-muted">Memuat data persiapan...</p>
          </div>
        ) : (
          <main className="mt-6">
            
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
                  <textarea
                    value={jsonInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                    placeholder={getPlaceholderJson(chapter, point)}
                    rows={12}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-hidden"
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
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">💬 Contoh Percakapan</h4>
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
                                            <div className="text-xs text-muted flex items-center gap-1.5 mt-0.5 select-none">
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
                                                {lang === "en" ? "(Hide)" : "(Sembunyikan)"}
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
                                              {lang === "en" ? "🔍 Show Translation" : "🔍 Lihat Arti"}
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
                                        <div className="text-xs text-muted flex items-center gap-1.5 mt-0.5 select-none">
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
                                            {lang === "en" ? "(Hide)" : "(Sembunyikan)"}
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
                                          {lang === "en" ? "🔍 Show Translation" : "🔍 Lihat Arti"}
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
                                  const isGrammarVisible = !!showAnswerFor[grammarKey];
                                  return (
                                    <div key={gramIdx} className="rounded-xl border border-border bg-surface-muted/30 p-4 flex flex-col gap-2">
                                      <div className="flex justify-between items-center">
                                        <h5 className="font-jp text-sm font-bold text-indigo-500">
                                          {gram.pattern}
                                        </h5>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowAnswerFor((prev) => ({
                                              ...prev,
                                              [grammarKey]: !prev[grammarKey],
                                            }));
                                          }}
                                          className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                        >
                                          {isGrammarVisible ? "Sembunyikan Pola ▲" : "Tampilkan Pola ▼"}
                                        </button>
                                      </div>

                                      {isGrammarVisible && (
                                        <div className="mt-2.5 flex flex-col gap-2 transition-all duration-300">
                                          <p className="text-xs text-foreground leading-relaxed">
                                            {gram.explanation}
                                          </p>

                                          {gram.examples && gram.examples.length > 0 && (
                                            <div className="space-y-2 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                                              {gram.examples.map((ex, exIdx) => (
                                                <div key={exIdx} className="flex flex-col gap-0.5">
                                                  <span className="font-jp text-xs text-foreground">
                                                    {renderJapaneseWithLookup(
                                                      ex.japanese,
                                                      `sect-${sectIdx}-gram-${gramIdx}-example-${exIdx}`,
                                                    )}
                                                  </span>
                                                  <span className="text-[10px] text-muted">
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
                            const isGrammarVisible = !!showAnswerFor[grammarKey];
                            return (
                              <Card key={idx} className="border border-border bg-surface p-5 shadow-xs flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-md font-bold text-indigo-500 font-jp">
                                    {gram.pattern}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowAnswerFor((prev) => ({
                                        ...prev,
                                        [grammarKey]: !prev[grammarKey],
                                      }));
                                    }}
                                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                  >
                                    {isGrammarVisible ? "Sembunyikan Tata Bahasa ▲" : "Tampilkan Tata Bahasa ▼"}
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
                                            <span className="font-jp text-sm text-foreground">
                                              {renderJapaneseWithLookup(
                                                ex.japanese,
                                                `grammar-${idx}-example-${exIdx}`,
                                              )}
                                            </span>
                                            <span className="text-xs text-muted">
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
                        Tidak ada penjelasan tata bahasa untuk bab ini.
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

          </main>
        )}

      </div>
    </div>
  );
}
