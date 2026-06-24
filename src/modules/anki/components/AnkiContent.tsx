"use client";

import { useEffect, useState, useMemo } from "react";
import { Button, Card, Chip, Popover, Modal, Label, ListBox } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";
import { KANJI_N5 } from "@/src/helper/kanji-n5";

interface AnkiContentProps {
  username: string;
}

interface SRSProgress {
  cardKey: string;
  dueDate: string;
  interval: number;
  repetitions: number;
  ease: number;
}

interface VocabularyCard {
  cardKey: string;
  chapter: string;
  sectionIndex: number;
  kanji: string;
  hiragana: string;
  romaji: string;
  translation: string;
}

export function AnkiContent({ username }: AnkiContentProps) {
  const { t, lang } = useLanguage();

  // Filter pilihan (multiple selection mode using Selection type from React Aria / HeroUI)
  const [filterChapters, setFilterChapters] = useState<any>(new Set<string>(["all"]));
  const [filterPoints, setFilterPoints] = useState<any>(new Set<string>(["all"]));

  // Handler untuk sinkronisasi multiselect: klik "all" mereset opsi lain, klik opsi lain menghapus "all"
  const handleChapterSelectionChange = (keys: any) => {
    if (keys === "all") {
      setFilterChapters(new Set(["all"]));
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterChapters(set);
    setFilterPoints(new Set(["all"])); // reset points ketika bab berubah
  };

  const handlePointSelectionChange = (keys: any) => {
    if (keys === "all") {
      setFilterPoints(new Set(["all"]));
      return;
    }
    const set = new Set(keys);
    if (set.has("all") && set.size > 1) {
      set.delete("all");
    }
    setFilterPoints(set);
  };

  // Dapatkan opsi poin yang tersedia berdasarkan bab yang dipilih
  const availablePointsOptions = useMemo(() => {
    const showAllChaps =
      filterChapters === "all" ||
      (filterChapters as Set<any>).has("all") ||
      (filterChapters as Set<any>).size === 0;

    if (showAllChaps || (filterChapters as Set<any>).size > 1) {
      return [
        { id: "1", title: "Poin 1" },
        { id: "2", title: "Poin 2" },
        { id: "3", title: "Poin 3" },
        { id: "4", title: "Poin 4 / もう一度聞こう" },
      ];
    }

    // Tampilkan sections spesifik jika hanya ada 1 bab yang dipilih
    const chapNumStr = Array.from(filterChapters as Set<any>)[0];
    const chapIdx = parseInt(chapNumStr) - 1;
    const chap = DekiruNihongoGroups[chapIdx];
    if (!chap) return [];

    return chap.sections.map((sect, sIdx) => ({
      id: String(sIdx + 1),
      title: `Poin ${sIdx + 1}: ${sect.title}`,
    }));
  }, [filterChapters]);

  // Selected chapters text helper for Select.Value
  const selectedChaptersText = useMemo(() => {
    const showAll =
      filterChapters === "all" ||
      (filterChapters as Set<any>).has("all") ||
      (filterChapters as Set<any>).size === 0;
    if (showAll) {
      return t.ankiAllChapters || "Semua Bab";
    }
    const sortedChaps = Array.from(filterChapters as Set<any>)
      .map(Number)
      .sort((a, b) => a - b);
    return sortedChaps.map((chap) => `Bab ${chap}`).join(", ");
  }, [filterChapters, t.ankiAllChapters]);

  // Selected points text helper for Select.Value
  const selectedPointsText = useMemo(() => {
    const showAll =
      filterPoints === "all" ||
      (filterPoints as Set<any>).has("all") ||
      (filterPoints as Set<any>).size === 0;
    if (showAll) {
      return t.ankiAllPoints || "Semua Poin";
    }
    const sortedPoints = Array.from(filterPoints as Set<any>)
      .map(Number)
      .sort((a, b) => a - b);

    return sortedPoints
      .map((ptId) => {
        const opt = availablePointsOptions.find((o) => o.id === String(ptId));
        return opt ? opt.title : `Poin ${ptId}`;
      })
      .join(", ");
  }, [filterPoints, availablePointsOptions, t.ankiAllPoints]);

  // Progres dari database
  const [progressMap, setProgressMap] = useState<Record<string, SRSProgress>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Sesi belajar saat ini
  const [sessionQueue, setSessionQueue] = useState<VocabularyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [ankiMode, setAnkiMode] = useState<"srs" | "quick">("srs");
  const [pendingReviews, setPendingReviews] = useState<
    Array<{ cardKey: string; chapter: string; sectionIndex: number; rating: number }>
  >([]);

  // Learned Kanji state (derived from vocabulary progress)
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  const [showReadings, setShowReadings] = useState<boolean>(false);

  // Reset showReadings state when selecting a new Kanji
  useEffect(() => {
    if (selectedKanji) {
      setShowReadings(false);
    }
  }, [selectedKanji]);

  // Ambil progres SRS pengguna saat pertama kali masuk
  useEffect(() => {
    async function fetchAnkiProgress() {
      try {
        const res = await fetch("/api/anki");
        if (res.ok) {
          const json = await res.json();
          const pMap: Record<string, SRSProgress> = {};
          (json.progress || []).forEach((item: SRSProgress) => {
            pMap[item.cardKey] = item;
          });
          setProgressMap(pMap);
        }
      } catch (err) {
        console.error("Gagal mengambil progres SRS:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnkiProgress();
  }, []);

  // Ekstrak semua kosakata yang cocok dengan filter
  const filteredVocabulary = useMemo(() => {
    const list: VocabularyCard[] = [];
    const showAllChaps =
      filterChapters === "all" ||
      (filterChapters as Set<any>).has("all") ||
      (filterChapters as Set<any>).size === 0;
    const showAllPts =
      filterPoints === "all" ||
      (filterPoints as Set<any>).has("all") ||
      (filterPoints as Set<any>).size === 0;

    DekiruNihongoGroups.forEach((chap, cIdx) => {
      const chapterNumber = cIdx + 1;
      if (!showAllChaps && !(filterChapters as Set<any>).has(String(chapterNumber))) {
        return;
      }

      chap.sections.forEach((sect, sIdx) => {
        const pointNumber = sIdx + 1;
        if (!showAllPts && !(filterPoints as Set<any>).has(String(pointNumber))) {
          return;
        }

        const examples = (sect.examples || []) as Array<{
          kanji: string;
          hiragana: string;
          romaji?: string;
          translations?: Record<string, string>;
        }>;
        examples.forEach((item) => {
          const cardKey = `Bab ${chap.chapter.replace("Bab ", "")}-${sIdx}-${item.kanji}-${item.hiragana}`;
          list.push({
            cardKey,
            chapter: chap.chapter,
            sectionIndex: sIdx,
            kanji: item.kanji,
            hiragana: item.hiragana,
            romaji: item.romaji || "",
            translation:
              item.translations?.id ||
              item.translations?.en ||
              "No translation",
          });
        });
      });
    });

    return list;
  }, [filterChapters, filterPoints]);

  // Klasifikasikan kartu menjadi: Due (Review) atau New (Baru)
  const cardStats = useMemo(() => {
    let due = 0;
    let newCards = 0;
    const now = new Date();

    filteredVocabulary.forEach((card) => {
      const prog = progressMap[card.cardKey];
      if (!prog) {
        newCards += 1;
      } else {
        const dueDate = new Date(prog.dueDate);
        if (dueDate <= now) {
          due += 1;
        }
      }
    });

    return { due, newCards };
  }, [filteredVocabulary, progressMap]);

  // Ekstrak karakter Kanji unik yang dipelajari dari kosakata (anki progress)
  const learnedVocabKanji = useMemo(() => {
    const kanjiMap = new Map<
      string,
      {
        character: string;
        vocabWords: Array<{
          word: string;
          reading: string;
          meaning: string;
          reps: number;
          interval: number;
        }>;
      }
    >();

    // Buat lookup untuk memetakan kanji-hiragana ke detail kosakata
    const vocabLookup = new Map<string, VocabularyCard>();
    filteredVocabulary.forEach((card) => {
      vocabLookup.set(`${card.kanji}-${card.hiragana}`, card);
    });

    Object.keys(progressMap).forEach((key) => {
      const parts = key.split("-");
      if (parts.length >= 4) {
        const kanjiWord = parts[2];
        const hiragana = parts[3];
        const progress = progressMap[key];

        if (kanjiWord !== "-") {
          const cardData = vocabLookup.get(`${kanjiWord}-${hiragana}`);
          const meaning = cardData ? cardData.translation : "No translation";

          for (let i = 0; i < kanjiWord.length; i++) {
            const char = kanjiWord[i];
            if (/[\u4e00-\u9faf]/.test(char)) {
              if (!kanjiMap.has(char)) {
                kanjiMap.set(char, { character: char, vocabWords: [] });
              }
              const kData = kanjiMap.get(char)!;
              if (!kData.vocabWords.some((w) => w.word === kanjiWord)) {
                kData.vocabWords.push({
                  word: kanjiWord,
                  reading: hiragana,
                  meaning,
                  reps: progress.repetitions,
                  interval: progress.interval,
                });
              }
            }
          }
        }
      }
    });

    return Array.from(kanjiMap.values());
  }, [progressMap, filteredVocabulary]);

  // Detail Kanji yang terpilih
  const selectedKanjiDetail = useMemo(() => {
    if (!selectedKanji) return null;
    return learnedVocabKanji.find((k) => k.character === selectedKanji) || null;
  }, [selectedKanji, learnedVocabKanji]);

  const kanjiDbInfo = useMemo(() => {
    if (!selectedKanji) return null;
    return KANJI_N5.find((k) => k.kanji === selectedKanji) || null;
  }, [selectedKanji]);

  // Mulai sesi belajar
  const startSession = (mode: "due" | "all" | "quick") => {
    let queue: VocabularyCard[] = [];

    if (mode === "quick") {
      // Quick mode: ambil semua kosakata terpilih
      queue = [...filteredVocabulary];
    } else {
      const now = new Date();
      if (mode === "due") {
        // Ambil yang jatuh tempo saja
        queue = filteredVocabulary.filter((card) => {
          const prog = progressMap[card.cardKey];
          if (!prog) return false; // Abaikan yang baru
          return new Date(prog.dueDate) <= now;
        });
      } else {
        // Campur: Ambil yang jatuh tempo dahulu, baru yang Baru (maksimal 20 kartu baru)
        const dueCards = filteredVocabulary.filter((card) => {
          const prog = progressMap[card.cardKey];
          return prog && new Date(prog.dueDate) <= now;
        });

        const newCards = filteredVocabulary
          .filter((card) => {
            return !progressMap[card.cardKey];
          })
          .slice(0, 20); // Batasi 20 kartu baru per sesi

        queue = [...dueCards, ...newCards];
      }
    }

    // Acak antrean agar lebih bervariasi
    queue.sort(() => Math.random() - 0.5);

    setSessionQueue(queue);
    setCurrentIndex(0);
    setFlipped(false);
    setReviewedCount(0);
    setSessionFinished(false);
    setPendingReviews([]);
  };

  // Kirim semua review yang tertunda ke API dalam satu batch
  const triggerSaveBatch = async (reviewsToSave: typeof pendingReviews) => {
    if (reviewsToSave.length === 0) return;
    try {
      const res = await fetch("/api/anki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewsToSave),
      });

      if (res.ok) {
        const json = await res.json();
        // Perbarui cache progress lokal dengan semua data baru
        setProgressMap((prev) => {
          const nextMap = { ...prev };
          (json.progress || []).forEach((item: SRSProgress) => {
            nextMap[item.cardKey] = item;
          });
          return nextMap;
        });
      }
    } catch (err) {
      console.error("Gagal menyimpan progres batch:", err);
    }
    setPendingReviews([]);
  };

  const handleCancelSession = async () => {
    await triggerSaveBatch(pendingReviews);
    setSessionQueue([]);
  };

  // Jawaban untuk Quick Memorization Mode (Sudah Tahu / Tidak Tahu)
  const handleQuickAnswer = async (knows: boolean) => {
    if (sessionQueue.length === 0) return;
    const currentCard = sessionQueue[currentIndex];

    // Reset flipped
    setFlipped(false);
    setReviewedCount((prev) => prev + 1);

    // Sudah Tahu -> rating 2 (Hard, bobot paling kecil untuk sukses)
    // Tidak Tahu -> rating 1 (Again, lupa)
    const rating = knows ? 2 : 1;
    const nextReviews = [
      ...pendingReviews.filter((r) => r.cardKey !== currentCard.cardKey),
      {
        cardKey: currentCard.cardKey,
        chapter: currentCard.chapter,
        sectionIndex: currentCard.sectionIndex,
        rating,
      },
    ];
    setPendingReviews(nextReviews);

    if (!knows) {
      // Tidak tahu: masukkan kartu ke akhir antrean sesi agar diulang terus
      const reQueueCard = { ...currentCard };
      setSessionQueue((prev) => [...prev, reQueueCard]);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Sudah tahu: lanjut ke kartu berikutnya (keluarkan dari sisa sesi)
      if (currentIndex + 1 >= sessionQueue.length) {
        setSessionFinished(true);
        await triggerSaveBatch(nextReviews);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  // Nilai kartu saat ini
  const handleRateCard = async (rating: number) => {
    if (sessionQueue.length === 0) return;
    const currentCard = sessionQueue[currentIndex];

    // Animasi balik kartu direset
    setFlipped(false);
    setReviewedCount((prev) => prev + 1);

    const nextReviews = [
      ...pendingReviews.filter((r) => r.cardKey !== currentCard.cardKey),
      {
        cardKey: currentCard.cardKey,
        chapter: currentCard.chapter,
        sectionIndex: currentCard.sectionIndex,
        rating,
      },
    ];
    setPendingReviews(nextReviews);

    // LOGIKA ANKI: Jika memilih "Again" (1), kartu akan dimasukkan kembali ke antrean akhir sesi
    if (rating === 1) {
      const reQueueCard = { ...currentCard };
      setSessionQueue((prev) => [...prev, reQueueCard]);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Pindah ke kartu berikutnya
      if (currentIndex + 1 >= sessionQueue.length) {
        setSessionFinished(true);
        await triggerSaveBatch(nextReviews);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const currentCard = sessionQueue[currentIndex];

  // Hitung progres bar sesi aktif
  const progressPercentage = useMemo(() => {
    if (sessionQueue.length === 0) return 0;
    return Math.round((currentIndex / sessionQueue.length) * 100);
  }, [currentIndex, sessionQueue]);

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
                  Anki
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">
                {t.ankiSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Modal>
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-surface hover:bg-surface-muted text-foreground cursor-pointer text-sm font-bold shrink-0"
                  title={t.ankiGuideTitle || "Panduan Penilaian SRS"}
                >
                  ❗
                </button>
                <Modal.Backdrop>
                  <Modal.Container>
                    <Modal.Dialog className="sm:max-w-lg">
                      <Modal.CloseTrigger />
                      <Modal.Header>
                        <Modal.Heading>
                          💡 {t.ankiGuideTitle || "Panduan Penilaian SRS"}
                        </Modal.Heading>
                      </Modal.Header>
                      <Modal.Body className="text-xs leading-relaxed flex flex-col gap-3">
                        <p className="text-muted mb-1">
                          {t.ankiGuideDesc ||
                            "Pelajari bagaimana pilihan spaced repetition memengaruhi interval kartu."}
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                            <span className="shrink-0 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                              Again
                            </span>
                            <span className="text-foreground">
                              {t.ankiGuideAgain ||
                                "Ulangi (Again): Lupa total. Repetisi direset ke 0, interval menjadi 1 hari, nilai ease berkurang."}
                            </span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                            <span className="shrink-0 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                              Hard
                            </span>
                            <span className="text-foreground">
                              {t.ankiGuideHard ||
                                "Susah (Hard): Ingat dengan sulit. Interval lebih pendek (1.2x), nilai ease berkurang sedikit."}
                            </span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                            <span className="shrink-0 bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                              Good
                            </span>
                            <span className="text-foreground">
                              {t.ankiGuideGood ||
                                "Biasa (Good): Ingat dengan wajar. Interval dikalikan nilai ease, nilai ease tetap."}
                            </span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                            <span className="shrink-0 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                              Easy
                            </span>
                            <span className="text-foreground">
                              {t.ankiGuideEasy ||
                                "Mudah (Easy): Ingat sangat cepat. Interval dikalikan nilai ease & bonus (1.3x), nilai ease bertambah."}
                            </span>
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button slot="close" variant="primary" size="sm" className="font-semibold cursor-pointer">
                          Tutup
                        </Button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </Modal.Container>
                </Modal.Backdrop>
              </Modal>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm text-muted">Memuat progres flashcard...</p>
          </div>
        ) : (
          <main className="mt-6">
            {/* TAMPILAN SELEKSI DECK / FILTER (Jika sesi belajar belum aktif) */}
            {sessionQueue.length === 0 || sessionFinished ? (
              <div className="flex flex-col gap-6">
                <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
                  {/* Switcher Mode Belajar */}
                  <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
                    <button
                      type="button"
                      onClick={() => setAnkiMode("srs")}
                      className={[
                        "flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        ankiMode === "srs"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      📅 Spaced Repetition (SRS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnkiMode("quick")}
                      className={[
                        "flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-all duration-200 cursor-pointer",
                        ankiMode === "quick"
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      ⚡ Menghafal Sekilas (Quick)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Filter Bab */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-muted block mb-1.5">{t.ankiFilterChapter || "Filter Bab"}</Label>
                      <Popover>
                        <Popover.Trigger>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted/50 focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px] text-left"
                          >
                            <span className="truncate">
                              {selectedChaptersText}
                            </span>
                            <span className="text-muted ml-2 text-xs">▼</span>
                          </button>
                        </Popover.Trigger>
                        <Popover.Content placement="bottom start" className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50">
                          <Popover.Dialog className="outline-none">
                            <ListBox selectionMode="multiple" selectedKeys={filterChapters} onSelectionChange={handleChapterSelectionChange}>
                              <ListBox.Item id="all" textValue={t.ankiAllChapters || "Semua Bab"} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none">
                                {t.ankiAllChapters || "Semua Bab"}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                              {Array.from({ length: 15 }, (_, i) => {
                                const chapNum = String(i + 1);
                                const title = `Bab ${chapNum} — ${DekiruNihongoGroups[i]?.title || ""}`;
                                return (
                                  <ListBox.Item key={chapNum} id={chapNum} textValue={title} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none">
                                    {title}
                                    <ListBox.ItemIndicator />
                                  </ListBox.Item>
                                );
                              })}
                            </ListBox>
                          </Popover.Dialog>
                        </Popover.Content>
                      </Popover>
                    </div>

                    {/* Filter Poin */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-muted block mb-1.5">{t.ankiFilterPoint || "Filter Poin"}</Label>
                      <Popover>
                        <Popover.Trigger>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted/50 focus:border-accent focus:outline-hidden cursor-pointer min-h-[38px] text-left"
                          >
                            <span className="truncate">
                              {selectedPointsText}
                            </span>
                            <span className="text-muted ml-2 text-xs">▼</span>
                          </button>
                        </Popover.Trigger>
                        <Popover.Content placement="bottom start" className="border border-border bg-surface p-1 shadow-lg rounded-xl min-w-[var(--trigger-width)] max-h-64 overflow-y-auto z-50">
                          <Popover.Dialog className="outline-none">
                            <ListBox selectionMode="multiple" selectedKeys={filterPoints} onSelectionChange={handlePointSelectionChange}>
                              <ListBox.Item id="all" textValue={t.ankiAllPoints || "Semua Poin"} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none">
                                {t.ankiAllPoints || "Semua Poin"}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                              {availablePointsOptions.map((opt) => (
                                <ListBox.Item key={opt.id} id={opt.id} textValue={opt.title} className="hover:bg-surface-muted/50 text-foreground cursor-pointer rounded-lg p-2 text-sm flex items-center justify-between outline-none">
                                  {opt.title}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Popover.Dialog>
                        </Popover.Content>
                      </Popover>
                    </div>
                  </div>

                  {ankiMode === "srs" ? (
                    <>
                      {/* Statistik Kartu Terfilter */}
                      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                        <div className="rounded-xl bg-surface-muted/50 p-3 text-center border border-border">
                          <p className="text-xs font-bold text-amber-500 tabular-nums">
                            {cardStats.due}
                          </p>
                          <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                            {t.ankiCardDue || "Jatuh Tempo"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-surface-muted/50 p-3 text-center border border-border">
                          <p className="text-xs font-bold text-indigo-500 tabular-nums">
                            {cardStats.newCards}
                          </p>
                          <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                            {t.ankiCardNew || "Baru"}
                          </p>
                        </div>
                      </div>

                      {/* Tombol Mulai Sesi SRS */}
                      <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-4">
                        <Button
                          variant="secondary"
                          className="font-semibold shadow-xs flex-1 text-white bg-amber-500 hover:bg-amber-600 border-none cursor-pointer"
                          onClick={() => startSession("due")}
                          isDisabled={cardStats.due === 0}
                        >
                          🚀 Review Kartu Jatuh Tempo ({cardStats.due})
                        </Button>
                        <Button
                          variant="primary"
                          className="font-semibold shadow-xs flex-1 cursor-pointer"
                          onClick={() => startSession("all")}
                          isDisabled={filteredVocabulary.length === 0}
                        >
                          ✨ Pelajari Campuran / Semua (
                          {Math.min(
                            filteredVocabulary.length,
                            cardStats.due + 20,
                          )}
                          )
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Statistik Quick Memorization */}
                      <div className="rounded-xl bg-surface-muted/50 p-4 text-center border border-border border-t pt-4">
                        <p className="text-xs font-bold text-indigo-500 tabular-nums">
                          {filteredVocabulary.length}
                        </p>
                        <p className="text-[10px] text-muted uppercase mt-0.5 font-bold tracking-wider">
                          Total Kosakata Bab/Poin Ini
                        </p>
                      </div>

                      {/* Tombol Mulai Sesi Quick */}
                      <div className="flex border-t border-border pt-4">
                        <Button
                          variant="primary"
                          className="font-bold shadow-xs w-full cursor-pointer py-5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                          onClick={() => startSession("quick")}
                          isDisabled={filteredVocabulary.length === 0}
                        >
                          ⚡ Mulai Menghafal Sekilas (
                          {filteredVocabulary.length} Kartu)
                        </Button>
                      </div>
                    </>
                  )}
                </Card>

                {/* List Kanji yang Sudah Dipelajari */}
                <Card className="border border-border bg-surface p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col gap-1 border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      🈶{" "}
                      {t.ankiLearnedKanjiTitle ||
                        "Daftar Kanji yang Dipelajari"}
                    </h3>
                    <p className="text-[10px] text-muted">
                      {t.ankiLearnedKanjiDesc ||
                        "Karakter kanji dari kosakata yang telah Anda pelajari."}
                    </p>
                  </div>

                  {/* List Grid Kanji */}
                  {learnedVocabKanji.length === 0 ? (
                    <p className="text-xs text-muted text-center py-6">
                      {t.ankiLearnedKanjiEmpty ||
                        "Belum ada kanji yang dipelajari. Mulai pelajari kosakata untuk melihatnya di sini!"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                      {learnedVocabKanji.map((k) => (
                        <button
                          key={k.character}
                          type="button"
                          onClick={() =>
                            setSelectedKanji(
                              selectedKanji === k.character
                                ? null
                                : k.character,
                            )
                          }
                          className={[
                            "rounded-xl border-2 px-2 py-3 text-center transition-all cursor-pointer font-jp text-xl font-bold leading-none",
                            selectedKanji === k.character
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
                              : "border-border bg-surface text-foreground hover:border-accent/50",
                          ].join(" ")}
                        >
                          {k.character}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              /* SESI BELAJAR AKTIF (FLASHCARD INTERAKTIF) */
              <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">
                {/* Progress bar */}
                <div className="w-full flex items-center justify-between gap-4 bg-surface border border-border rounded-xl p-3 shadow-xs">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Progres Sesi: {currentIndex} / {sessionQueue.length}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="font-semibold h-8 min-w-16"
                    onClick={handleCancelSession}
                  >
                    Batal
                  </Button>
                </div>

                {/* Info Card Saat Ini */}
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="soft" color="accent">
                    {currentCard.chapter}
                  </Chip>
                  <Chip size="sm" variant="soft" color="default">
                    Poin {currentCard.sectionIndex + 1}
                  </Chip>
                </div>

                {/* KARTU FLASHCARD DENGAN PERSPEKTIF CSS FLIP */}
                <div
                  className="relative w-full max-w-md h-64 [perspective:1000px] cursor-pointer"
                  onClick={() => setFlipped(!flipped)}
                >
                  <div
                    className={[
                      "relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d]",
                      flipped ? "[transform:rotateY(180deg)]" : "",
                    ].join(" ")}
                  >
                    {/* Sisi Depan (Front) */}
                    <div
                      className="absolute w-full h-full bg-surface border border-border rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-bold text-muted uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Depan
                      </span>
                      <h2 className="font-jp text-5xl font-bold leading-none text-foreground select-none">
                        {currentCard.kanji === "-"
                          ? currentCard.hiragana
                          : currentCard.kanji}
                      </h2>
                      <p className="mt-8 text-xs text-muted/60 animate-pulse select-none">
                        👆{" "}
                        {t.ankiFlipCard || "Ketuk kartu untuk melihat jawaban"}
                      </p>
                    </div>

                    {/* Sisi Belakang (Back) */}
                    <div
                      className="absolute w-full h-full [transform:rotateY(180deg)] bg-surface border border-border rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-bold text-muted uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 px-2 py-0.5 rounded-full">
                        Belakang
                      </span>

                      <div className="flex flex-col items-center text-center gap-2 select-none">
                        {/* Kanji jika ada */}
                        {currentCard.kanji !== "-" && (
                          <h3 className="font-jp text-2xl text-muted">
                            {currentCard.kanji}
                          </h3>
                        )}

                        {/* Hiragana */}
                        <h2 className="font-jp text-4xl font-bold text-foreground">
                          {currentCard.hiragana}
                        </h2>

                        {/* Romaji */}
                        {currentCard.romaji && (
                          <p className="text-xs font-semibold text-indigo-500 font-mono">
                            {currentCard.romaji}
                          </p>
                        )}

                        {/* Arti */}
                        <p className="mt-4 text-md font-medium text-foreground max-w-xs border-t border-border pt-3">
                          {currentCard.translation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRADING BUTTONS (Hanya muncul jika kartu sudah dibalik) */}
                <div className="w-full max-w-md flex flex-col gap-2">
                  {flipped &&
                    (ankiMode === "srs" ? (
                      <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Again */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(1);
                          }}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Again</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Lupa ❌
                          </span>
                        </button>

                        {/* Hard */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(2);
                          }}
                          className="flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Hard</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Susah ⚠️
                          </span>
                        </button>

                        {/* Good */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(3);
                          }}
                          className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Good</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Biasa ✓
                          </span>
                        </button>

                        {/* Easy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateCard(4);
                          }}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] font-bold">Easy</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Mudah 🌟
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Tidak Tahu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(false);
                          }}
                          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200"
                        >
                          <span>Tidak Tahu ❌</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Diulang lagi
                          </span>
                        </button>

                        {/* Sudah Tahu */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAnswer(true);
                          }}
                          className="flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-2 shadow-sm transition-colors cursor-pointer font-bold animate-in zoom-in duration-200"
                        >
                          <span>Sudah Tahu ✓</span>
                          <span className="text-[9px] opacity-75 mt-0.5">
                            Selesai
                          </span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Modal Detail Kanji */}
      <Modal isOpen={selectedKanji !== null} onOpenChange={(open) => { if (!open) setSelectedKanji(null); }}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header className="flex items-center justify-between gap-4">
                <Modal.Heading className="flex items-center gap-2">
                  🈶 Detail Kanji
                </Modal.Heading>
                <Button
                  size="sm"
                  variant="secondary"
                  className="font-semibold text-xs border border-border bg-surface hover:bg-surface-muted cursor-pointer shrink-0 py-1 h-7 min-w-0 px-2.5 rounded-lg"
                  onPress={() => setShowReadings(!showReadings)}
                >
                  {showReadings ? "👁️ Sembunyikan" : "👁️ Tampilkan"}
                </Button>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                {selectedKanji && selectedKanjiDetail && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border-2 border-indigo-500/30 bg-indigo-500/5 w-14 h-14 flex items-center justify-center">
                        <span className="font-jp text-3xl font-bold text-foreground">
                          {selectedKanji}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          Kanji "{selectedKanji}"
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          Ditemukan di {(selectedKanjiDetail as any).vocabWords.length} kosakata yang sedang dipelajari
                        </p>
                      </div>
                    </div>

                    {/* Informasi Kanji dari database static (jika ada) */}
                    {kanjiDbInfo && (
                      <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-surface-muted/35 text-xs animate-in fade-in duration-200">
                        <p className="font-semibold text-muted uppercase tracking-wider text-[9px] mb-1">
                          Informasi Kanji:
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                          <div>
                            <span className="text-muted font-medium block text-[10px]">Kunyomi (訓読み):</span>
                            <span className={[
                              "font-jp font-semibold text-foreground text-xs transition-all duration-200",
                              showReadings ? "" : "blur-sm select-none"
                            ].join(" ")}>
                              {kanjiDbInfo.kunyomi.join(", ") || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted font-medium block text-[10px]">Onyomi (音読み):</span>
                            <span className={[
                              "font-jp font-semibold text-foreground text-xs transition-all duration-200",
                              showReadings ? "" : "blur-sm select-none"
                            ].join(" ")}>
                              {kanjiDbInfo.onyomi || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-border/60 mt-1.5 pt-1.5">
                          <span className="text-muted font-medium block text-[10px]">Arti (Meaning):</span>
                          <span className="font-medium text-foreground text-xs">
                            {lang === "id" ? kanjiDbInfo.meaningId : kanjiDbInfo.meaningEn}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-1 max-h-[300px] overflow-y-auto pr-1">
                      <p className="font-semibold text-muted uppercase tracking-wider text-[9px]">
                        Kosakata Terkait:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {(selectedKanjiDetail as any).vocabWords.map((v: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-1 p-2.5 rounded-xl bg-surface-muted/50 border border-border"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-jp font-bold text-sm text-foreground">
                                    {v.word}
                                  </span>
                                  <span className={[
                                    "font-jp text-xs text-indigo-500 font-semibold transition-all duration-200",
                                    showReadings ? "" : "blur-sm select-none"
                                  ].join(" ")}>
                                    〔{v.reading}〕
                                  </span>
                                </div>
                                <span className="text-muted text-[10px]">
                                  {v.meaning}
                                </span>
                              </div>
                              <div className="flex shrink-0 gap-1 text-[8px] font-bold mt-1">
                                <span className="bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full">
                                  Rep: {v.reps}
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                                  Int: {v.interval} hari
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="primary" size="sm" className="font-semibold cursor-pointer">
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Modal Sesi Selesai */}
      <Modal isOpen={sessionFinished} onOpenChange={(open) => { if (!open) { setSessionQueue([]); setSessionFinished(false); } }}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />
              <Modal.Header className="flex flex-col items-center text-center pt-6">
                <span className="text-5xl mb-2">🎉</span>
                <Modal.Heading className="font-bold text-foreground text-xl">
                  {t.ankiFinishedTitle || "Sesi Selesai!"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col items-center text-center gap-4 py-4">
                <p className="text-sm text-muted">
                  {t.ankiFinishedDesc ||
                    "Kamu telah mereview semua kartu dalam sesi ini."}
                </p>
                <div className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                  Reviewed: {reviewedCount} Cards
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-center pb-6">
                <Button slot="close" variant="primary" className="w-full font-semibold cursor-pointer">
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
