import { kanaMap, KanaEntry } from "@/src/modules/kana/lib/kana-map";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

/** Re-export KanaEntry sebagai KanaInfo agar lebih semantik di sisi konsumer */
export type KanaInfo = KanaEntry;

/**
 * Satu unit hasil parse.
 *
 * - `char`  : karakter / kluster asli dari teks input.
 * - `info`  : metadata dari kana-map (romaji, tipe, origin, dsb.).
 *             `undefined` jika karakter bukan kana yang dikenal
 *             (kanji, angka, tanda baca, huruf latin, dst.).
 */
export interface ParsedUnit {
  char: string;
  info?: KanaInfo;
}

// ─────────────────────────────────────────
// Konstanta: Small Kana yang bersifat "combining"
// ─────────────────────────────────────────

/**
 * Karakter kana kecil yang—jika muncul tepat setelah karakter kana penuh—
 * membentuk satu kluster suara (Yōon / kombinasi modern).
 *
 * Contoh:
 *   し + ゅ → しゅ (shu)
 *   キ + ュ → キュ (kyu)
 *   フ + ォ → フォ (fo)   ← kombinasi gairaigo
 *
 * TIDAK termasuk っ / ッ (small tsu) karena ia berdiri sendiri
 * sebagai penanda konsonan ganda, bukan penggabung.
 */
const COMBINING_SMALL_KANA = new Set<string>([
  // ── Hiragana small ya / yu / yo ──
  "ゃ", // U+3083
  "ゅ", // U+3085
  "ょ", // U+3087

  // ── Katakana small ya / yu / yo ──
  "ャ", // U+30E3
  "ュ", // U+30E5
  "ョ", // U+30E7

  // ── Hiragana small vowels (ぁ ぃ ぅ ぇ ぉ) ──
  "ぁ", // U+3041
  "ぃ", // U+3043
  "ぅ", // U+3045
  "ぇ", // U+3047
  "ぉ", // U+3049

  // ── Katakana small vowels (ァ ィ ゥ ェ ォ) ──
  // Dibutuhkan untuk kombinasi gairaigo: ファ フィ フェ フォ ティ ディ dst.
  "ァ", // U+30A1
  "ィ", // U+30A3
  "ゥ", // U+30A5
  "ェ", // U+30A7
  "ォ", // U+30A9

  // ── Small wa (jarang, tapi valid) ──
  "ゎ", // U+308E  hiragana
  "ヮ", // U+30EE  katakana
]);

// ─────────────────────────────────────────
// Helpers (internal)
// ─────────────────────────────────────────

/**
 * Kembalikan true jika `ch` adalah karakter hiragana atau katakana
 * (termasuk varian kecil dan extended).
 */
function isKanaCodePoint(ch: string): boolean {
  const cp = ch.codePointAt(0) ?? 0;
  // Hiragana block: U+3040–U+309F
  // Katakana block: U+30A0–U+30FF
  // Katakana Phonetic Extensions: U+31F0–U+31FF
  return (
    (cp >= 0x3040 && cp <= 0x309f) ||
    (cp >= 0x30a0 && cp <= 0x30ff) ||
    (cp >= 0x31f0 && cp <= 0x31ff)
  );
}

// ─────────────────────────────────────────
// Fungsi utama
// ─────────────────────────────────────────

/**
 * Parse string teks Jepang mentah menjadi array `ParsedUnit`.
 *
 * Algoritma:
 * 1. Iterasi setiap code-point (bukan `string[i]`) agar emoji/surrogate aman.
 * 2. Jika karakter saat ini adalah kana dan karakter berikutnya adalah
 *    small combining kana → gabungkan menjadi kluster 2-karakter.
 * 3. Cari kluster / karakter tunggal di `kanaMap`.
 * 4. Kanji, tanda baca, latin, angka → dimasukkan ke hasil tanpa `info`.
 *
 * @example
 * parseJapaneseText("じゅぎょう")
 * // [
 * //   { char: "じゅ", info: { romaji: "ju", type: "hiragana", origin: "じ", explanation: "yoon/combination" } },
 * //   { char: "ぎ",   info: { romaji: "gi", type: "hiragana", origin: "き", explanation: "dakuten" } },
 * //   { char: "ょ",   info: undefined },   ← small yo berdiri sendiri → tidak dikenal
 * //   { char: "う",   info: { romaji: "u",  type: "hiragana" } },
 * // ]
 *
 * @example
 * parseJapaneseText("東京タワー")
 * // [
 * //   { char: "東", info: undefined },
 * //   { char: "京", info: undefined },
 * //   { char: "タ", info: { romaji: "ta", type: "katakana" } },
 * //   { char: "ワ", info: { romaji: "wa", type: "katakana" } },
 * //   { char: "ー", info: undefined },   ← prolonged sound mark
 * // ]
 */
export function parseJapaneseText(text: string): ParsedUnit[] {
  // Array.from() untuk iterasi per code-point yang benar (handles surrogate pairs)
  const chars = Array.from(text);
  const result: ParsedUnit[] = [];
  let i = 0;

  while (i < chars.length) {
    const current = chars[i];
    const next = chars[i + 1];

    // ── Coba bentuk kluster 2-karakter ──────────────────────────────────────
    // Syarat:
    //   1. Ada karakter berikutnya
    //   2. Karakter berikutnya adalah combining small kana
    //   3. Karakter saat ini adalah kana (untuk menghindari gabungan aneh
    //      seperti "A" + "ゃ")
    if (
      next !== undefined &&
      COMBINING_SMALL_KANA.has(next) &&
      isKanaCodePoint(current)
    ) {
      const cluster = current + next;
      result.push({
        char: cluster,
        // Mungkin undefined jika kombinasi tidak ada di kanaMap
        // (kombinasi tidak standar tetap digabungkan sesuai spesifikasi)
        info: kanaMap[cluster],
      });
      i += 2;
      continue;
    }

    // ── Karakter tunggal ────────────────────────────────────────────────────
    result.push({
      char: current,
      info: kanaMap[current], // undefined untuk non-kana
    });
    i += 1;
  }

  return result;
}

// ─────────────────────────────────────────
// Utility helpers (publik)
// ─────────────────────────────────────────

/**
 * Kembalikan representasi romaji dari seluruh teks.
 * Karakter yang tidak dikenal dikembalikan apa adanya.
 *
 * @example
 * toRomaji("きょうはいいてんきですね")
 * // "kyouhaiitenki desu ne"  (spasi dipertahankan)
 */
export function toRomaji(text: string): string {
  return parseJapaneseText(text)
    .map((unit) => unit.info?.romaji ?? unit.char)
    .join("");
}

/**
 * Filter hanya unit yang memiliki `info` (karakter kana yang dikenal).
 * Berguna untuk fitur flashcard / latihan.
 */
export function extractKanaUnits(text: string): ParsedUnit[] {
  return parseJapaneseText(text).filter((unit) => unit.info !== undefined);
}

/**
 * Kembalikan true jika karakter / kluster ada di kanaMap.
 */
export function isKnownKana(char: string): boolean {
  return char in kanaMap;
}
