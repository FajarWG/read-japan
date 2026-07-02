"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { Modal } from "@heroui/react";
import { DEFAULT_IT_TERMS, ITTerm } from "../data/terms";
import {
  ArrowLeft,
  Plus,
  Eye,
  EyeOff,
  Search,
  Brain,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

function generateUniqueId(): string {
  return `custom-${Date.now()}`;
}

export function ITKotobaDashboard() {
  const router = useRouter();
  const { lang } = useLanguage();

  // ── States ─────────────────────────────────────────────────────────────────
  const [terms, setTerms] = useState<ITTerm[]>(DEFAULT_IT_TERMS);
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [cardsPerRow, setCardsPerRow] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTermIndex, setSelectedTermIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteryMap, setMasteryMap] = useState<Record<string, "again" | "hard" | "good" | "easy">>({});
  const [filterMastery, setFilterMastery] = useState<string>("all");

  // Add Custom Term Modal State
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newKanji, setNewKanji] = useState<string>("");
  const [newHiragana, setNewHiragana] = useState<string>("");
  const [newRomaji, setNewRomaji] = useState<string>("");
  const [newTranslationId, setNewTranslationId] = useState<string>("");
  const [newTranslationEn, setNewTranslationEn] = useState<string>("");
  const [newExampleJp, setNewExampleJp] = useState<string>("");
  const [newExampleKana, setNewExampleKana] = useState<string>("");
  const [newExampleTranslationId, setNewExampleTranslationId] = useState<string>("");
  const [newExampleTranslationEn, setNewExampleTranslationEn] = useState<string>("");
  const [addError, setAddError] = useState<string>("");

  // AI Import States
  const [addMode, setAddMode] = useState<"manual" | "ai">("manual");
  const [aiKeyword, setAiKeyword] = useState<string>("");
  const [aiJsonText, setAiJsonText] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // ── Translations ───────────────────────────────────────────────────────────
  const text = {
    en: {
      title: "IT Kotoba (IT/Developer Terms)",
      subtitle: "Memorize critical Japanese terminology for developers & IT professionals.",
      backBtn: "Back",
      searchPlaceholder: "Search by kanji, reading, or meaning...",
      furiganaBtn: "Furigana",
      columnsLabel: "Cols per row:",
      addBtn: "Add Kotoba",
      customBadge: "Custom",
      all: "All Terms",
      learning: "Learning / Review",
      mastered: "Mastered",
      unlearned: "New / Unlearned",
      noTerms: "No vocabulary terms found matching your query.",
      studyMode: "Anki Study Mode",
      showAnswer: "Show Answer",
      howWell: "How well did you know this word?",
      ratingAgain: "Again",
      ratingHard: "Hard",
      ratingGood: "Good",
      ratingEasy: "Easy",
      next: "Next",
      prev: "Prev",
      close: "Close",
      masteryStatus: "Mastery:",
      addModalTitle: "Add New IT Vocabulary",
      kanjiLabel: "Kanji / Katakana (e.g., 開発) *",
      hiraganaLabel: "Furigana / Reading in Hiragana *",
      romajiLabel: "Romaji",
      transIdLabel: "Meaning (Indonesian) *",
      transEnLabel: "Meaning (English)",
      exJpLabel: "Example Sentence (Japanese)",
      exKanaLabel: "Example Furigana",
      exTransIdLabel: "Example Meaning (Indonesian)",
      exTransEnLabel: "Example Meaning (English)",
      submitBtn: "Add Word",
      cancelBtn: "Cancel",
      requiredFields: "Fields marked with * are required.",
      deleteConfirm: "Are you sure you want to delete this custom term?",
      addModeManual: "Manual Input",
      addModeAI: "AI Assistant (Prompt)",
      aiLabel: "Keyword / Word to generate (e.g. CI/CD)",
      aiPromptLabel: "Copy this prompt for the AI:",
      aiJsonLabel: "Paste JSON result here:",
      copyBtn: "Copy Prompt",
      copiedBtn: "Copied!",
      processBtn: "Process & Fill Form",
      invalidJson: "Invalid JSON format. Please verify the copied output from AI.",
    },
    id: {
      title: "IT Kotoba (Istilah IT/Developer)",
      subtitle: "Hafalkan istilah-istilah bahasa Jepang penting untuk developer & praktisi IT.",
      backBtn: "Kembali",
      searchPlaceholder: "Cari berdasarkan kanji, cara baca, atau arti...",
      furiganaBtn: "Furigana",
      columnsLabel: "Card per baris:",
      addBtn: "Tambah Kotoba",
      customBadge: "Kustom",
      all: "Semua Istilah",
      learning: "Sedang Dipelajari",
      mastered: "Sangat Kuasai",
      unlearned: "Baru / Belum Hafal",
      noTerms: "Tidak ada kosakata yang cocok dengan pencarian Anda.",
      studyMode: "Mode Belajar Anki",
      showAnswer: "Tampilkan Jawaban",
      howWell: "Seberapa baik Anda tahu kata ini?",
      ratingAgain: "Ulangi",
      ratingHard: "Sulit",
      ratingGood: "Bagus",
      ratingEasy: "Mudah",
      next: "Selanjutnya",
      prev: "Sebelumnya",
      close: "Tutup",
      masteryStatus: "Penguasaan:",
      addModalTitle: "Tambah Kosakata IT Baru",
      kanjiLabel: "Kanji / Katakana (misal: 開発) *",
      hiraganaLabel: "Furigana / Cara Baca Hiragana *",
      romajiLabel: "Romaji",
      transIdLabel: "Arti (Bahasa Indonesia) *",
      transEnLabel: "Arti (Bahasa Inggris)",
      exJpLabel: "Contoh Kalimat (Jepang)",
      exKanaLabel: "Furigana Contoh Kalimat",
      exTransIdLabel: "Arti Contoh (Bahasa Indonesia)",
      exTransEnLabel: "Arti Contoh (Bahasa Inggris)",
      submitBtn: "Tambah Kata",
      cancelBtn: "Batal",
      requiredFields: "Kolom bertanda * wajib diisi.",
      deleteConfirm: "Apakah Anda yakin ingin menghapus kosakata kustom ini?",
      addModeManual: "Input Manual",
      addModeAI: "Asisten AI (Prompt)",
      aiLabel: "Kata Kunci / Kata yang ingin dibuat (misal: CI/CD)",
      aiPromptLabel: "Salin prompt ini ke AI:",
      aiJsonLabel: "Tempel JSON hasil AI di sini:",
      copyBtn: "Salin Prompt",
      copiedBtn: "Tersalin!",
      processBtn: "Proses & Isi Form",
      invalidJson: "Format JSON tidak valid. Pastikan Anda menyalin seluruh output dari AI.",
    },
  }[lang === "id" ? "id" : "en"];

  // ── Load Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Load custom terms from localStorage
    const savedCustom = localStorage.getItem("it_kotoba_custom");
    let customList: ITTerm[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (e) {
        console.error("Error parsing custom terms", e);
      }
    }

    // Load mastery from localStorage
    const savedMastery = localStorage.getItem("it_kotoba_mastery");
    if (savedMastery) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMasteryMap(JSON.parse(savedMastery));
      } catch (e) {
        console.error("Error parsing mastery map", e);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTerms([...DEFAULT_IT_TERMS, ...customList]);
  }, []);

  // ── Save Progress ──────────────────────────────────────────────────────────
  const handleRating = (termId: string, rating: "again" | "hard" | "good" | "easy") => {
    const updatedMastery = { ...masteryMap, [termId]: rating };
    setMasteryMap(updatedMastery);
    localStorage.setItem("it_kotoba_mastery", JSON.stringify(updatedMastery));

    // After rating, auto progress to the next card after a small delay to make it smooth, or if it is the last card
    if (selectedTermIndex !== null) {
      setTimeout(() => {
        if (selectedTermIndex < filteredTerms.length - 1) {
          setSelectedTermIndex(selectedTermIndex + 1);
          setIsFlipped(false);
        } else {
          // Finished the deck / reached end of current filter list
          setSelectedTermIndex(null);
          setIsFlipped(false);
        }
      }, 500);
    }
  };

  // ── Delete Custom Term ─────────────────────────────────────────────────────
  const handleDeleteCustomTerm = (e: React.MouseEvent, termId: string) => {
    e.stopPropagation();
    if (!window.confirm(text.deleteConfirm)) return;

    const savedCustom = localStorage.getItem("it_kotoba_custom");
    if (savedCustom) {
      try {
        const customList: ITTerm[] = JSON.parse(savedCustom);
        const filtered = customList.filter((t) => t.id !== termId);
        localStorage.setItem("it_kotoba_custom", JSON.stringify(filtered));

        // Update active terms state
        setTerms([...DEFAULT_IT_TERMS, ...filtered]);

        // Remove mastery entry
        const updatedMastery = { ...masteryMap };
        delete updatedMastery[termId];
        setMasteryMap(updatedMastery);
        localStorage.setItem("it_kotoba_mastery", JSON.stringify(updatedMastery));
      } catch (err) {
        console.error("Error deleting custom term", err);
      }
    }
  };

  // ── Add Custom Term ────────────────────────────────────────────────────────
  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!newKanji.trim() || !newHiragana.trim() || !newTranslationId.trim()) {
      setAddError(lang === "id" ? "Mohon isi semua kolom wajib (*)" : "Please fill in all required fields (*)");
      return;
    }

    const newTerm: ITTerm = {
      id: generateUniqueId(),
      kanji: newKanji.trim(),
      hiragana: newHiragana.trim(),
      romaji: newRomaji.trim() || undefined || "",
      translationId: newTranslationId.trim(),
      translationEn: newTranslationEn.trim() || newTranslationId.trim(),
      exampleJp: newExampleJp.trim() || "",
      exampleKana: newExampleKana.trim() || "",
      exampleTranslationId: newExampleTranslationId.trim() || "",
      exampleTranslationEn: newExampleTranslationEn.trim() || "",
      isCustom: true,
    };

    const savedCustom = localStorage.getItem("it_kotoba_custom");
    let customList: ITTerm[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (err) {
        console.error(err);
      }
    }

    const updatedCustom = [...customList, newTerm];
    localStorage.setItem("it_kotoba_custom", JSON.stringify(updatedCustom));
    setTerms([...DEFAULT_IT_TERMS, ...updatedCustom]);

    handleCloseAddModal(false);
  };

  // Reset all states when modal is closed
  const handleCloseAddModal = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) {
      setNewKanji("");
      setNewHiragana("");
      setNewRomaji("");
      setNewTranslationId("");
      setNewTranslationEn("");
      setNewExampleJp("");
      setNewExampleKana("");
      setNewExampleTranslationId("");
      setNewExampleTranslationEn("");
      setAddError("");
      setAddMode("manual");
      setAiKeyword("");
      setAiJsonText("");
    }
  };

  // Copy Prompt to clipboard
  const handleCopyPrompt = () => {
    const promptText = `Tolong buatkan detail istilah IT Jepang untuk kata: "${aiKeyword || "[kata yang Anda inginkan]"}" dalam format JSON. Ikuti struktur di bawah ini:
{
  "kanji": "[Tuliskan Kanji/Katakana untuk kata tersebut]",
  "hiragana": "[Tuliskan Furigana/Cara baca kata dalam Hiragana saja]",
  "translationId": "[Tuliskan arti kata dalam Bahasa Indonesia]",
  "translationEn": "[Tuliskan arti kata dalam Bahasa Inggris]",
  "exampleJp": "[Tuliskan contoh kalimat Jepang yang menggunakan kata tersebut]",
  "exampleKana": "[Tuliskan Furigana/Cara baca kalimat contoh dalam Hiragana saja]",
  "exampleTranslationId": "[Tuliskan arti kalimat contoh dalam Bahasa Indonesia]",
  "exampleTranslationEn": "[Tuliskan arti kalimat contoh dalam Bahasa Inggris]"
}
Keluarkan HANYA JSON tersebut tanpa penjelasan tambahan atau tanda kutip markdown block.`;

    navigator.clipboard.writeText(promptText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Process AI Json paste
  const handleProcessAiJson = () => {
    try {
      let cleanJson = aiJsonText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(json)?\n?/, "");
        cleanJson = cleanJson.replace(/```$/, "");
        cleanJson = cleanJson.trim();
      }

      const parsed = JSON.parse(cleanJson);
      
      if (parsed.kanji) setNewKanji(parsed.kanji);
      if (parsed.hiragana) setNewHiragana(parsed.hiragana);
      if (parsed.translationId) setNewTranslationId(parsed.translationId);
      if (parsed.translationEn) setNewTranslationEn(parsed.translationEn || "");
      if (parsed.exampleJp) setNewExampleJp(parsed.exampleJp || "");
      if (parsed.exampleKana) setNewExampleKana(parsed.exampleKana || "");
      if (parsed.exampleTranslationId) setNewExampleTranslationId(parsed.exampleTranslationId || "");
      if (parsed.exampleTranslationEn) setNewExampleTranslationEn(parsed.exampleTranslationEn || "");
      
      setAddError("");
      setAddMode("manual"); // Switch back to manual review tab
      setAiJsonText(""); // Clear input
      setAiKeyword("");
    } catch (e) {
      setAddError(text.invalidJson);
    }
  };

  // ── Filtered Terms ─────────────────────────────────────────────────────────
  const filteredTerms = terms.filter((term) => {
    // 1. Mastery Filter
    const mastery = masteryMap[term.id];
    if (filterMastery === "unlearned" && mastery) return false;
    if (filterMastery === "learning" && (mastery === "easy" || !mastery)) return false;
    if (filterMastery === "mastered" && mastery !== "easy" && mastery !== "good") return false;

    // 2. Search Query Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchKanji = term.kanji.toLowerCase().includes(q);
    const matchHiragana = term.hiragana.toLowerCase().includes(q);
    const matchRomaji = term.romaji.toLowerCase().includes(q);
    const matchTransId = term.translationId.toLowerCase().includes(q);
    const matchTransEn = term.translationEn.toLowerCase().includes(q);

    return matchKanji || matchHiragana || matchRomaji || matchTransId || matchTransEn;
  });

  // Handle click on card: Open modal zoomed
  const handleCardClick = (index: number) => {
    setSelectedTermIndex(index);
    setIsFlipped(false);
  };

  const currentTerm = selectedTermIndex !== null ? filteredTerms[selectedTermIndex] : null;

  // Responsive grid class helper based on user input cardsPerRow
  const gridColsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  }[cardsPerRow as 2 | 3 | 4 | 5 | 6] || "md:grid-cols-5";

  // Kanji size helper based on cardsPerRow (fewer cols = larger cards = larger kanji)
  const getKanjiSizeClass = (cols: number) => {
    if (cols === 2) return "text-4xl sm:text-5xl font-black";
    if (cols === 3) return "text-3xl sm:text-4xl font-extrabold";
    return "text-2xl sm:text-3xl font-extrabold"; // cols === 4 (max columns)
  };

  // Mastery badge class helper
  const getMasteryColor = (termId: string) => {
    const val = masteryMap[termId];
    if (val === "easy") return "bg-blue-500/10 border-blue-500/30 text-blue-500";
    if (val === "good") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
    if (val === "hard") return "bg-amber-500/10 border-amber-500/30 text-amber-500";
    if (val === "again") return "bg-rose-500/10 border-rose-500/30 text-rose-500";
    return "bg-slate-500/10 border-slate-500/20 text-muted";
  };

  const getMasteryLabel = (termId: string) => {
    const val = masteryMap[termId];
    if (val === "easy") return text.ratingEasy;
    if (val === "good") return text.ratingGood;
    if (val === "hard") return text.ratingHard;
    if (val === "again") return text.ratingAgain;
    return lang === "id" ? "Baru" : "New";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-8 relative">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
        
        {/* Header Section */}
        <header className="border-b border-border/60 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-surface hover:bg-muted text-foreground transition-all duration-200 cursor-pointer"
                title={text.backBtn}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-jp text-foreground flex items-center gap-2">
                  <Brain className="w-6 h-6 text-accent animate-pulse" /> {text.title}
                </h1>
                <p className="text-xs text-muted mt-1 max-w-xl">
                  {text.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Add Custom Word Button */}
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-accent hover:bg-accent/90 text-white shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                {text.addBtn}
              </button>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Toolbar & Filter Bar */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface border border-border/40 p-4 rounded-2xl select-none">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/65" />
            <input
              type="text"
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-10 text-xs font-semibold text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-muted/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mastery Category Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: text.all },
              { id: "unlearned", label: text.unlearned },
              { id: "learning", label: text.learning },
              { id: "mastered", label: text.mastered },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMastery(f.id)}
                className={[
                  "px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer",
                  filterMastery === f.id
                    ? "bg-accent/10 border-accent/25 text-accent"
                    : "bg-background border-border/30 text-muted hover:text-foreground",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Settings / View Toggles */}
          <div className="flex items-center gap-4 border-t border-border/20 pt-3 md:border-none md:pt-0">
            {/* Furigana Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowFurigana(!showFurigana)}
                className={[
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer",
                  showFurigana
                    ? "bg-accent/10 border-accent/25 text-accent"
                    : "bg-background border-border/30 text-muted hover:text-foreground",
                ].join(" ")}
              >
                {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {text.furiganaBtn}
              </button>
            </div>

            {/* Dynamic Grid Column Count Control */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {text.columnsLabel}
              </span>
              <div className="flex items-center bg-background border border-border/40 rounded-xl p-0.5">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCardsPerRow(num)}
                    className={[
                      "w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                      cardsPerRow === num
                        ? "bg-surface text-accent shadow-xs border border-border/30 font-extrabold"
                        : "text-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid View */}
        <main className="min-h-[400px]">
          {filteredTerms.length > 0 ? (
            <div className={["grid grid-cols-2 sm:grid-cols-3 gap-4", gridColsClass].join(" ")}>
              {filteredTerms.map((term, index) => {
                const isCustom = !!term.isCustom;
                return (
                  <div
                    key={term.id}
                    onClick={() => handleCardClick(index)}
                    className={[
                      "group relative overflow-hidden rounded-2xl border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[140px] cursor-pointer",
                      masteryMap[term.id] 
                        ? "border-accent/10 hover:border-accent/40" 
                        : "border-border/40 hover:border-border/80",
                    ].join(" ")}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2 select-none">
                        <span className={["px-2 py-0.5 rounded-md text-[9px] font-bold border", getMasteryColor(term.id)].join(" ")}>
                          {getMasteryLabel(term.id)}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {isCustom && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                              {text.customBadge}
                            </span>
                          )}
                          
                          {isCustom && (
                            <button
                              onClick={(e) => handleDeleteCustomTerm(e, term.id)}
                              className="text-muted hover:text-rose-500 p-1 rounded-md hover:bg-rose-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Word Render */}
                      <div className="text-center py-2 flex flex-col items-center justify-center min-h-[70px]">
                        <span className={[getKanjiSizeClass(cardsPerRow), "font-jp text-foreground tracking-wide block"].join(" ")}>
                          {term.kanji}
                        </span>
                        {showFurigana && (
                          <span className="text-[11px] text-muted/70 mt-1.5 select-none font-semibold font-jp block">
                            {term.hiragana}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick translation meaning */}
                    <div className="mt-3 border-t border-border/20 pt-2 text-center select-all">
                      <p className="text-xs font-semibold text-foreground/80 line-clamp-2">
                        {lang === "id" ? term.translationId : term.translationEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center select-none bg-surface border border-border/30 rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-muted/40 mb-3" />
              <p className="text-sm font-semibold text-muted">
                {text.noTerms}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ── CARD ZOOM MODAL (ANKI STUDY MODE) ─────────────────────────────────── */}
      <Modal
        isOpen={selectedTermIndex !== null && currentTerm !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTermIndex(null);
            setIsFlipped(false);
          }
        }}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header className="flex items-center justify-between gap-4 select-none pb-3 border-b border-border/20">
              <Modal.Heading className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
                <Brain className="w-4 h-4 text-accent" />
                {text.studyMode} ({selectedTermIndex !== null ? selectedTermIndex + 1 : 0}/{filteredTerms.length})
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col justify-center py-4 min-h-[250px]">
              {currentTerm && (
                <>
                  {/* Question Side (Kanji) */}
                  <div className="text-center select-all">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-muted/45 block mb-1">
                      KOTOBA
                    </span>
                    <h2 className="text-5xl sm:text-6xl font-black font-jp text-foreground tracking-wide">
                      {currentTerm.kanji}
                    </h2>
                    
                    {/* Conditionally visible on Flip */}
                    {isFlipped && (
                      <div className="mt-2 animate-fade-in select-all">
                        <p className="text-lg sm:text-xl font-bold text-accent font-jp">
                          【{currentTerm.hiragana}】
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Flipped Answer Details */}
                  {isFlipped ? (
                    <div className="mt-8 pt-6 border-t border-dashed border-border/40 text-center select-all animate-fade-in">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted/45 block mb-1.5">
                        MEANING / ARTI
                      </span>
                      <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        {lang === "id" ? currentTerm.translationId : currentTerm.translationEn}
                      </p>

                      {/* Render Example sentence if it exists */}
                      {currentTerm.exampleJp && (
                        <div className="mt-6 bg-background/50 border border-border/30 rounded-2xl p-4 text-left">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted/45 block mb-2">
                            CONTOH / EXAMPLE
                          </span>
                          <ruby className="text-lg sm:text-xl font-bold font-jp text-foreground leading-relaxed tracking-wide block">
                            {currentTerm.exampleJp}
                            <rt className="text-xs sm:text-sm text-muted/80 font-semibold leading-none pt-1.5 font-jp block">
                              {currentTerm.exampleKana}
                            </rt>
                          </ruby>
                          <p className="text-xs sm:text-sm text-muted/85 font-medium leading-normal mt-2.5">
                            {lang === "id" ? currentTerm.exampleTranslationId : currentTerm.exampleTranslationEn}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Unflipped: Show Answer Button */
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() => setIsFlipped(true)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        {text.showAnswer}
                      </button>
                    </div>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="flex flex-col gap-4 select-none mt-2 border-t border-border/20 pt-4">
              {currentTerm && isFlipped && (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-center text-[10px] font-extrabold text-muted uppercase tracking-wider">
                    {text.howWell}
                  </p>
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {/* Again */}
                    <button
                      onClick={() => handleRating(currentTerm.id, "again")}
                      className="py-2.5 rounded-xl border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-500 font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      {text.ratingAgain}
                    </button>
                    {/* Hard */}
                    <button
                      onClick={() => handleRating(currentTerm.id, "hard")}
                      className="py-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500 hover:text-white text-amber-500 font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      {text.ratingHard}
                    </button>
                    {/* Good */}
                    <button
                      onClick={() => handleRating(currentTerm.id, "good")}
                      className="py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white text-emerald-500 font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      {text.ratingGood}
                    </button>
                    {/* Easy */}
                    <button
                      onClick={() => handleRating(currentTerm.id, "easy")}
                      className="py-2.5 rounded-xl border border-blue-500/25 bg-blue-500/5 hover:bg-blue-500 hover:text-white text-blue-500 font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      {text.ratingEasy}
                    </button>
                  </div>
                </div>
              )}

              {/* Prev / Next navigation row */}
              {currentTerm && (
                <div className="flex items-center justify-between text-xs font-semibold text-muted w-full">
                  <button
                    onClick={() => {
                      if (selectedTermIndex !== null && selectedTermIndex > 0) {
                        setSelectedTermIndex(selectedTermIndex - 1);
                        setIsFlipped(false);
                      }
                    }}
                    disabled={selectedTermIndex === 0}
                    className="flex items-center gap-1 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-muted"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {text.prev}
                  </button>

                  <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-border/25">
                    <span className="text-muted">{text.masteryStatus}</span>
                    <span className={["px-2 py-0.5 rounded-md text-[9px] font-bold border", getMasteryColor(currentTerm.id)].join(" ")}>
                      {getMasteryLabel(currentTerm.id)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedTermIndex !== null && selectedTermIndex < filteredTerms.length - 1) {
                        setSelectedTermIndex(selectedTermIndex + 1);
                        setIsFlipped(false);
                      }
                    }}
                    disabled={selectedTermIndex === filteredTerms.length - 1}
                    className="flex items-center gap-1 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-muted"
                  >
                    {text.next}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* ── ADD NEW KOTOBA MODAL ──────────────────────────────────────────────── */}
      <Modal isOpen={isAddOpen} onOpenChange={handleCloseAddModal}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header className="pb-3 border-b border-border/20">
              <Modal.Heading className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                {text.addModalTitle}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="py-4">
              {/* Tab Selector for Manual vs AI Import */}
              <div className="flex border-b border-border/30 mb-4 pb-0.5 select-none">
                <button
                  type="button"
                  onClick={() => setAddMode("manual")}
                  className={[
                    "flex-1 py-2 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer text-center",
                    addMode === "manual"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  ].join(" ")}
                >
                  {text.addModeManual}
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode("ai")}
                  className={[
                    "flex-1 py-2 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5",
                    addMode === "ai"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  ].join(" ")}
                >
                  <Brain className="w-3.5 h-3.5" />
                  {text.addModeAI}
                </button>
              </div>

              {addMode === "ai" ? (
                /* ── AI IMPORT TAB ────────────────────────────────────────── */
                <div className="flex flex-col gap-4 text-xs font-semibold text-foreground/80">
                  {/* Step 1: Keyword Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ai-keyword">{text.aiLabel}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="ai-keyword"
                        value={aiKeyword}
                        onChange={(e) => setAiKeyword(e.target.value)}
                        placeholder="e.g., CI/CD, AWS, デプロイ"
                        className="flex-1 bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        disabled={!aiKeyword.trim()}
                        className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white font-bold transition-all text-xs disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copySuccess ? text.copiedBtn : text.copyBtn}
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Prompt View (Dynamic preview) */}
                  <div className="bg-muted/40 border border-border/30 rounded-xl p-3 flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold text-muted uppercase tracking-wide">
                      {text.aiPromptLabel}
                    </span>
                    <pre className="text-[10px] text-muted overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed select-all max-h-[140px] overflow-y-auto bg-background/50 p-2 rounded-lg border border-border/10">
{`Tolong buatkan detail istilah IT Jepang untuk kata: "${aiKeyword || "[kata yang Anda inginkan]"}" dalam format JSON. Ikuti struktur di bawah ini:
{
  "kanji": "[Tuliskan Kanji/Katakana untuk kata tersebut]",
  "hiragana": "[Tuliskan Furigana/Cara baca kata dalam Hiragana saja]",
  "translationId": "[Tuliskan arti kata dalam Bahasa Indonesia]",
  "translationEn": "[Tuliskan arti kata dalam Bahasa Inggris]",
  "exampleJp": "[Tuliskan contoh kalimat Jepang yang menggunakan kata tersebut]",
  "exampleKana": "[Tuliskan Furigana/Cara baca kalimat contoh dalam Hiragana saja]",
  "exampleTranslationId": "[Tuliskan arti kalimat contoh dalam Bahasa Indonesia]",
  "exampleTranslationEn": "[Tuliskan arti kalimat contoh dalam Bahasa Inggris]"
}
Keluarkan HANYA JSON tersebut tanpa penjelasan tambahan atau tanda kutip markdown block.`}
                    </pre>
                  </div>

                  {/* Step 3: Paste area */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ai-json">{text.aiJsonLabel}</label>
                    <textarea
                      id="ai-json"
                      rows={5}
                      value={aiJsonText}
                      onChange={(e) => setAiJsonText(e.target.value)}
                      placeholder='{ "kanji": "...", "hiragana": "...", ... }'
                      className="bg-background border border-border/50 rounded-xl py-2 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-mono"
                    />
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={handleProcessAiJson}
                    disabled={!aiJsonText.trim()}
                    className="w-full py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 font-bold shadow-sm transition-colors cursor-pointer text-xs disabled:opacity-30 disabled:pointer-events-none mt-1"
                  >
                    {text.processBtn}
                  </button>
                </div>
              ) : (
                /* ── MANUAL INPUT TAB ───────────────────────────────────────── */
                <form onSubmit={handleAddTerm} id="add-term-form" className="flex flex-col gap-4 text-xs font-semibold text-foreground/80">
                  {addError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl">
                      {addError}
                    </div>
                  )}

                  {/* Kanji & Hiragana */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="input-kanji">{text.kanjiLabel}</label>
                      <input
                        type="text"
                        id="input-kanji"
                        value={newKanji}
                        onChange={(e) => setNewKanji(e.target.value)}
                        placeholder="e.g., 設計"
                        className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="input-hiragana">{text.hiraganaLabel}</label>
                      <input
                        type="text"
                        id="input-hiragana"
                        value={newHiragana}
                        onChange={(e) => setNewHiragana(e.target.value)}
                        placeholder="e.g., せっけい"
                        className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="input-trans-id">{text.transIdLabel}</label>
                      <input
                        type="text"
                        id="input-trans-id"
                        value={newTranslationId}
                        onChange={(e) => setNewTranslationId(e.target.value)}
                        placeholder="e.g., Desain Sistem"
                        className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="input-trans-en">{text.transEnLabel}</label>
                      <input
                        type="text"
                        id="input-trans-en"
                        value={newTranslationEn}
                        onChange={(e) => setNewTranslationEn(e.target.value)}
                        placeholder="e.g., System Design"
                        className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Example Sentences */}
                  <div className="border-t border-border/20 pt-4 mt-2 flex flex-col gap-3">
                    <h4 className="font-bold text-accent select-none">
                      {lang === "id" ? "Contoh Kalimat (Opsional)" : "Example Sentence (Optional)"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-ex-jp">{text.exJpLabel}</label>
                        <input
                          type="text"
                          id="input-ex-jp"
                          value={newExampleJp}
                          onChange={(e) => setNewExampleJp(e.target.value)}
                          placeholder="e.g., データベースの設計を見直します。"
                          className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold font-jp"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-ex-kana">{text.exKanaLabel}</label>
                        <input
                          type="text"
                          id="input-ex-kana"
                          value={newExampleKana}
                          onChange={(e) => setNewExampleKana(e.target.value)}
                          placeholder="e.g., でーたべーすの せっけいを みなおします。"
                          className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold font-jp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-ex-trans-id">{text.exTransIdLabel}</label>
                        <input
                          type="text"
                          id="input-ex-trans-id"
                          value={newExampleTranslationId}
                          onChange={(e) => setNewExampleTranslationId(e.target.value)}
                          placeholder="e.g., Meninjau kembali desain database."
                          className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-ex-trans-en">{text.exTransEnLabel}</label>
                        <input
                          type="text"
                          id="input-ex-trans-en"
                          value={newExampleTranslationEn}
                          onChange={(e) => setNewExampleTranslationEn(e.target.value)}
                          placeholder="e.g., Reviewing the database design."
                          className="bg-background border border-border/50 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-accent text-xs text-foreground placeholder:text-muted/40 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted leading-none mt-1">
                    {text.requiredFields}
                  </div>
                </form>
              )}
            </Modal.Body>
            <Modal.Footer className="border-t border-border/20 pt-4 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => handleCloseAddModal(false)}
                className="px-4 py-2.5 rounded-xl border border-border/50 text-muted hover:text-foreground hover:bg-muted font-bold transition-colors cursor-pointer text-xs"
              >
                {text.cancelBtn}
              </button>
              {addMode === "manual" && (
                <button
                  type="submit"
                  form="add-term-form"
                  className="px-5 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 font-bold shadow-sm transition-colors cursor-pointer text-xs"
                >
                  {text.submitBtn}
                </button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
        </Modal.Backdrop>
      </Modal>

    </div>
  );
}
