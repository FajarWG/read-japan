// Recap sesi Anki: dibuat saat sesi selesai, dibaca oleh halaman /anki/recap.
// Disimpan di sessionStorage agar tahan refresh tanpa perlu tabel baru.

export interface AnkiRecapItem {
  cardKey: string;
  kanji: string;
  hiragana: string;
  translation: string;
  /** Semua rating yang diberikan untuk kartu ini selama sesi (urut kronologis). */
  ratings: number[];
}

export interface AnkiSessionRecap {
  version: 1;
  mode: "srs" | "quick";
  deckLabel: string;
  direction: "normal" | "reverse";
  startedAt: number;
  endedAt: number;
  /** Jumlah penilaian, termasuk kartu yang diulang karena "Again". */
  totalReviews: number;
  items: AnkiRecapItem[];
}

export const ANKI_RECAP_STORAGE_KEY = "anki:last-session-recap";

/**
 * Rating 1 berarti "Again" (SRS) atau "Belum tahu" (quick mode). Kartu dianggap
 * masih lemah kalau pernah kena rating 1 di sesi ini.
 */
export function isStruggledItem(item: AnkiRecapItem): boolean {
  return item.ratings.includes(1);
}

export function recapItemAttempts(item: AnkiRecapItem): number {
  return item.ratings.length;
}

/** Rating terakhir menentukan bagaimana kartu ditinggalkan di akhir sesi. */
export function recapItemFinalRating(item: AnkiRecapItem): number | null {
  return item.ratings.length > 0 ? item.ratings[item.ratings.length - 1] : null;
}

export interface AnkiRecapSummary {
  cardCount: number;
  totalReviews: number;
  struggled: AnkiRecapItem[];
  solid: AnkiRecapItem[];
  /** Persentase kartu yang benar di percobaan pertama. */
  firstTryAccuracy: number;
  durationSeconds: number;
}

export function summarizeRecap(recap: AnkiSessionRecap): AnkiRecapSummary {
  const struggled: AnkiRecapItem[] = [];
  const solid: AnkiRecapItem[] = [];

  for (const item of recap.items) {
    if (isStruggledItem(item)) {
      struggled.push(item);
    } else {
      solid.push(item);
    }
  }

  // Yang paling sering nyangkut tampil duluan
  struggled.sort((a, b) => b.ratings.length - a.ratings.length);

  const firstTryCorrect = recap.items.filter(
    (item) => item.ratings.length > 0 && item.ratings[0] !== 1,
  ).length;

  return {
    cardCount: recap.items.length,
    totalReviews: recap.totalReviews,
    struggled,
    solid,
    firstTryAccuracy:
      recap.items.length === 0
        ? 0
        : Math.round((firstTryCorrect / recap.items.length) * 100),
    durationSeconds: Math.max(
      0,
      Math.round((recap.endedAt - recap.startedAt) / 1000),
    ),
  };
}

export function formatRecapDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/** Label rating untuk chip di recap. */
export function ratingLabel(rating: number, mode: "srs" | "quick"): string {
  if (mode === "quick") return rating === 1 ? "Didn't know" : "Knew it";
  switch (rating) {
    case 1:
      return "Again";
    case 2:
      return "Hard";
    case 3:
      return "Good";
    case 4:
      return "Easy";
    default:
      return `Rating ${rating}`;
  }
}

/**
 * Gabungkan satu penilaian ke daftar recap. Kartu yang diulang (Again) tidak
 * menghasilkan entri baru, hanya menambah rating pada entri yang sudah ada.
 */
export function mergeRecapItem(
  items: AnkiRecapItem[],
  card: {
    cardKey: string;
    kanji: string;
    hiragana: string;
    translation: string;
  },
  rating: number,
): AnkiRecapItem[] {
  const index = items.findIndex((item) => item.cardKey === card.cardKey);
  if (index === -1) {
    return [
      ...items,
      {
        cardKey: card.cardKey,
        kanji: card.kanji,
        hiragana: card.hiragana,
        translation: card.translation,
        ratings: [rating],
      },
    ];
  }
  const next = [...items];
  next[index] = {
    ...next[index],
    ratings: [...next[index].ratings, rating],
  };
  return next;
}

/** Kata yang dipakai untuk membuka Explore (kanji kalau ada, kalau tidak hiragana). */
export function recapItemQuery(item: AnkiRecapItem): string {
  return item.kanji && item.kanji !== "-" ? item.kanji : item.hiragana;
}

export function saveSessionRecap(recap: AnkiSessionRecap): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ANKI_RECAP_STORAGE_KEY, JSON.stringify(recap));
  } catch (err) {
    console.warn("Gagal menyimpan recap sesi:", err);
  }
}

export function loadSessionRecap(): AnkiSessionRecap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ANKI_RECAP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnkiSessionRecap;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("Gagal membaca recap sesi:", err);
    return null;
  }
}

export function clearSessionRecap(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ANKI_RECAP_STORAGE_KEY);
  } catch {
    // abaikan: storage tidak tersedia
  }
}
