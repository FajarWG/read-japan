import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";
import {
  kanaMap,
  type KanaEntry,
} from "@/src/modules/kana/lib/kana-map";

/** Re-export so server file can use it. */
export { kanaMap };
export type { KanaEntry };

const KANJI_LOOKUP_PREFIX = "kotoba:";
const KANJI_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff々]/;
const OPTIONAL_GROUP_PATTERN = /[（(]([^()（）]+)[）)]/;

// ─────────────────────────────────────────
// Small combining kana (untuk yōon / kombinasi)
// ─────────────────────────────────────────
const COMBINING_SMALL_KANA = new Set<string>([
  "ゃ", "ゅ", "ょ",
  "ャ", "ュ", "ョ",
  "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
  "ァ", "ィ", "ゥ", "ェ", "ォ",
  "ゎ", "ヮ",
]);

/** Public alias untuk file server-side (lihat kotoba-lookup-server.ts) */
export const COMBINING_SMALL_KANA_PUBLIC = COMBINING_SMALL_KANA;

function isKanaCodePoint(ch: string): boolean {
  const cp = ch.codePointAt(0) ?? 0;
  return (
    (cp >= 0x3040 && cp <= 0x309f) ||
    (cp >= 0x30a0 && cp <= 0x30ff) ||
    (cp >= 0x31f0 && cp <= 0x31ff)
  );
}

/** Public alias untuk file server-side */
export const isKanaCodePointPublic = isKanaCodePoint;

export interface KotobaSourceItem {
  kanji: string;
  hiragana: string;
  translations?: Record<string, string>;
}

export interface KotobaLookupEntry {
  progressKey: string;
  kanji: string;
  display: string;
  hiragana: string;
  meaning: string;
  aliases: string[];
}

export function hasKanji(text: string): boolean {
  return KANJI_PATTERN.test(text);
}

function normalizeLookupText(text: string): string {
  return text.replace(/\s+/g, "").trim();
}

/**
 * Strip footnote markers (e.g. "父※1" → "父", "お父さん※2" → "お父さん").
 * Footnote markers referensi seperti "※1", "※2" sering muncul di kanji Dekiru.
 */
function stripFootnoteMarkers(text: string): string {
  return text.replace(/※\d+/g, "");
}

/**
 * Kembalikan true jika string hanya berisi karakter Jepang yang valid
 * (Kanji CJK + Hiragana + Katakana + small kana + prolonged mark `ー`).
 *
 * Alias dengan `※`, brackets, koma, titik, latin, dll tidak dianggap cocok
 * untuk lookup berbasis substring (mereka adalah "kalimat contoh" / penanda).
 */
const VALID_JAPANESE_CHAR = /^[぀-ゟ゠-ヿ㐀-䶿一-鿿々ー]+$/;
function isValidJapaneseLookup(text: string): boolean {
  if (!text) return false;
  return VALID_JAPANESE_CHAR.test(text);
}

function expandOptionalGroups(text: string): string[] {
  const normalized = normalizeLookupText(text);
  if (!normalized) return [];

  const match = normalized.match(OPTIONAL_GROUP_PATTERN);
  if (!match || match.index === undefined) {
    return [normalized];
  }

  const start = match.index;
  const end = start + match[0].length;
  const before = normalized.slice(0, start);
  const inside = match[1];
  const after = normalized.slice(end);

  return Array.from(
    new Set([
      ...expandOptionalGroups(`${before}${inside}${after}`),
      ...expandOptionalGroups(`${before}${after}`),
    ]),
  );
}

export function getKotobaMeaning(
  translations: Record<string, string> | undefined,
): string {
  if (!translations) return "No meaning";
  return (
    translations.id ||
    translations.en ||
    Object.values(translations).find(Boolean) ||
    "No meaning"
  );
}

export function createKotobaLookupEntry(
  item: KotobaSourceItem,
): KotobaLookupEntry | null {
  const rawKanji = stripFootnoteMarkers(normalizeLookupText(item.kanji));
  if (!rawKanji || rawKanji === "-" || !hasKanji(rawKanji)) {
    return null;
  }

  const aliases = expandOptionalGroups(rawKanji)
    .filter(hasKanji)
    .filter(isValidJapaneseLookup);
  if (aliases.length === 0) return null;

  return {
    progressKey: `${KANJI_LOOKUP_PREFIX}${rawKanji}`,
    kanji: rawKanji,
    display: rawKanji,
    hiragana: item.hiragana,
    meaning: getKotobaMeaning(item.translations),
    aliases,
  };
}

export function buildKotobaAliasMap(
  items: KotobaSourceItem[],
): Map<string, KotobaLookupEntry> {
  const map = new Map<string, KotobaLookupEntry>();

  for (const item of items) {
    const entry = createKotobaLookupEntry(item);
    if (!entry) continue;

    for (const alias of entry.aliases) {
      const existing = map.get(alias);
      if (!existing || entry.kanji.length > existing.kanji.length) {
        map.set(alias, entry);
      }
    }
  }

  return map;
}

export function getAllKotobaLookupEntries(): KotobaLookupEntry[] {
  const deduped = new Map<string, KotobaLookupEntry>();

  for (const chapter of DekiruNihongoGroups as Array<{
    sections?: Array<{ examples?: KotobaSourceItem[] }>;
  }>) {
    for (const section of chapter.sections || []) {
      for (const item of section.examples || []) {
        const entry = createKotobaLookupEntry(item);
        if (entry && !deduped.has(entry.progressKey)) {
          deduped.set(entry.progressKey, entry);
        }
      }
    }
  }

  return Array.from(deduped.values());
}

export function getAllKotobaLookupMap(): Map<string, KotobaLookupEntry> {
  return new Map(
    getAllKotobaLookupEntries().map((entry) => [entry.progressKey, entry]),
  );
}

export function isKotobaProgressKey(key: string): boolean {
  return key.startsWith(KANJI_LOOKUP_PREFIX);
}

// ─────────────────────────────────────────
// Per-bab helpers (untuk section "Kotoba Dekiru")
// ─────────────────────────────────────────

export interface DekiruChapter {
  chapter: number; // 1-15
  chapterLabel: string; // e.g. "Bab １"
  title: string;
}

/**
 * Daftar 15 bab dari DekiruNihongoGroup, dinomori 1-15 sesuai urutan.
 */
export function getDekiruChapters(): DekiruChapter[] {
  return (DekiruNihongoGroups as Array<{ chapter: string; title: string }>).map(
    (g, i) => ({
      chapter: i + 1,
      chapterLabel: g.chapter,
      title: g.title,
    }),
  );
}

/**
 * Kembalikan seluruh lookup entries (alias-aware) untuk satu bab.
 */
export function getKotobaLookupEntriesForChapter(
  chapter: number,
): KotobaLookupEntry[] {
  const idx = chapter - 1;
  const group = (DekiruNihongoGroups as Array<{
    sections?: Array<{ examples?: KotobaSourceItem[] }>;
  }>)[idx];
  if (!group) return [];

  const deduped = new Map<string, KotobaLookupEntry>();
  for (const section of group.sections || []) {
    for (const item of section.examples || []) {
      const entry = createKotobaLookupEntry(item);
      if (entry && !deduped.has(entry.progressKey)) {
        deduped.set(entry.progressKey, entry);
      }
    }
  }
  return Array.from(deduped.values());
}

/**
 * Kembalikan lookup entries (beserta alias map) untuk satu bab.
 * Berguna untuk pencocokan substring ke teks cerita.
 */
export function getKotobaAliasMapForChapter(
  chapter: number,
): {
  entries: KotobaLookupEntry[];
  aliasMap: Map<string, KotobaLookupEntry>;
} {
  const entries = getKotobaLookupEntriesForChapter(chapter);
  const aliasMap = new Map<string, KotobaLookupEntry>();
  for (const entry of entries) {
    for (const alias of entry.aliases) {
      const existing = aliasMap.get(alias);
      if (!existing || entry.kanji.length > existing.kanji.length) {
        aliasMap.set(alias, entry);
      }
    }
  }
  return { entries, aliasMap };
}

export interface MatchedKotoba {
  entry: KotobaLookupEntry;
  /** surface form yang ditemukan dalam teks (bisa alias) */
  surface: string;
  /** jumlah kemunculan dalam teks */
  count: number;
  /** posisi kemunculan pertama (char index) */
  firstIndex: number;
}

/**
 * Cari semua kosakata dari bab `chapter` yang muncul dalam `text`.
 * Strategi: scan teks dari kiri ke kanan, pada setiap posisi coba cocokkan
 * alias terpanjang dulu (longest-match).
 *
 * Return diurutkan berdasarkan `firstIndex` (urut kemunculan di cerita).
 */
export function matchKotobaInText(
  text: string,
  chapter: number,
): MatchedKotoba[] {
  const { entries, aliasMap } = getKotobaAliasMapForChapter(chapter);
  if (entries.length === 0) return [];

  const aliasLengths = Array.from(aliasMap.keys())
    .map((a) => a.length)
    .filter((n) => n > 0);
  if (aliasLengths.length === 0) return [];
  const maxLen = Math.max(...aliasLengths);

  const out = new Map<string, MatchedKotoba>(); // key: progressKey
  for (let i = 0; i < text.length; i++) {
    for (let len = maxLen; len >= 1; len--) {
      const slice = text.slice(i, i + len);
      if (slice.length < len) break;
      const hit = aliasMap.get(slice);
      if (!hit) continue;
      const existing = out.get(hit.progressKey);
      if (existing) {
        existing.count += 1;
      } else {
        out.set(hit.progressKey, {
          entry: hit,
          surface: slice,
          count: 1,
          firstIndex: i,
        });
      }
      i += len - 1; // skip matched length
      break;
    }
  }

  return Array.from(out.values()).sort((a, b) => a.firstIndex - b.firstIndex);
}

// ─────────────────────────────────────────
// Story parsing — kanji di cerita jadi clickable
// ─────────────────────────────────────────

export interface StoryKanaToken {
  type: "kana";
  char: string;
  info: KanaEntry;
}

export interface StoryKotobaToken {
  type: "kotoba";
  char: string;
  entry: KotobaLookupEntry;
  /** Bab tempat entry ini cocok (untuk display) */
  matchedChapter: number;
}

export interface StoryPlainToken {
  type: "plain";
  char: string;
}

export type StoryToken =
  | StoryKanaToken
  | StoryKotobaToken
  | StoryPlainToken;

interface AliasEntryWithChapter {
  entry: KotobaLookupEntry;
  chapter: number;
}

export type { AliasEntryWithChapter };

/**
 * Bangun alias map fallback dari SEMUA bab Dekiru + KanjiDictionary (admin).
 * Versi sync (client-side) — tidak include KanjiDictionary.
 */
function getGlobalKotobaAliasMapWithChapter(): Map<
  string,
  AliasEntryWithChapter
> {
  const map = new Map<string, AliasEntryWithChapter>();
  const chapters = DekiruNihongoGroups as Array<{
    sections?: Array<{ examples?: KotobaSourceItem[] }>;
  }>;
  for (let ci = 0; ci < chapters.length; ci++) {
    const group = chapters[ci];
    const chapter = ci + 1;
    const deduped = new Map<string, KotobaLookupEntry>();
    for (const section of group.sections || []) {
      for (const item of section.examples || []) {
        const entry = createKotobaLookupEntry(item);
        if (entry && !deduped.has(entry.progressKey)) {
          deduped.set(entry.progressKey, entry);
        }
      }
    }
    for (const entry of deduped.values()) {
      for (const alias of entry.aliases) {
        const existing = map.get(alias);
        if (!existing || entry.kanji.length > existing.entry.kanji.length) {
          map.set(alias, { entry, chapter });
        }
      }
    }
  }
  return map;
}

/**
 * Server-only helpers ada di file terpisah `kotoba-lookup-server.ts`.
 * Jangan import dari file ini di client components — gunakan
 * `dynamic import()` atau pindahkan logic ke server component.
 * @see ./kotoba-lookup-server.ts
 */

/**
 * Tokenisasi teks cerita menjadi array `StoryToken`:
 *   - `kana`  : unit kana (1-2 char dengan romaji)
 *   - `kotoba`: run karakter Jepang yang cocok dengan KotobaLookupEntry
 *   - `plain` : karakter lain (latin, angka, tanda baca)
 *
 * Prioritas pencocokan (longest-match wins):
 *   1. Alias map bab spesifik cerita (preferred)
 *   2. Alias map global (fallback untuk kanji dari bab lain)
 *   3. Kana + combining small kana
 *   4. Single character
 *
 * Catatan: untuk include KanjiDictionary (admin-added) gunakan versi async
 * `parseStoryTextAsync` di `./kotoba-lookup-server.ts` (server-only).
 */
export function parseStoryText(
  text: string,
  chapter: number | null,
): StoryToken[] {
  const result: StoryToken[] = [];

  // Build chapter-specific alias map
  const chapterAliasMap =
    chapter != null ? getKotobaAliasMapForChapter(chapter).aliasMap : new Map();
  // Build global alias map (fallback)
  const globalAliasMap = getGlobalKotobaAliasMapWithChapter();

  const chapterMaxLen = Math.max(
    0,
    ...Array.from(chapterAliasMap.keys()).map((k) => k.length),
  );
  const globalMaxLen = Math.max(
    0,
    ...Array.from(globalAliasMap.keys()).map((k) => k.length),
  );

  let i = 0;
  while (i < text.length) {
    const ch = text[i];

    // ── 1. Try chapter-specific kotoba (longest first) ──
    if (chapterMaxLen > 0) {
      let matched = false;
      for (let len = chapterMaxLen; len >= 1; len--) {
        if (i + len > text.length) continue;
        const slice = text.slice(i, i + len);
        const entry = chapterAliasMap.get(slice);
        if (entry) {
          result.push({
            type: "kotoba",
            char: slice,
            entry,
            matchedChapter: chapter!,
          });
          i += len;
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    // ── 2. Try global kotoba fallback (longest first) ──
    if (globalMaxLen > 0) {
      let matched = false;
      for (let len = globalMaxLen; len >= 1; len--) {
        if (i + len > text.length) continue;
        const slice = text.slice(i, i + len);
        const hit = globalAliasMap.get(slice);
        if (hit && (!chapter || hit.chapter !== chapter)) {
          // Only use global fallback if not in current chapter
          result.push({
            type: "kotoba",
            char: slice,
            entry: hit.entry,
            matchedChapter: hit.chapter,
          });
          i += len;
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    // ── 3. Kana dengan combining small kana ──
    const next = text[i + 1];
    if (
      next !== undefined &&
      COMBINING_SMALL_KANA.has(next) &&
      isKanaCodePoint(ch)
    ) {
      const cluster = ch + next;
      result.push({
        type: "kana",
        char: cluster,
        info: kanaMap[cluster] ?? kanaMap[ch],
      });
      i += 2;
      continue;
    }

    // ── 4. Single kana ──
    if (isKanaCodePoint(ch)) {
      result.push({ type: "kana", char: ch, info: kanaMap[ch] });
      i += 1;
      continue;
    }

    // ── 5. Plain char ──
    result.push({ type: "plain", char: ch });
    i += 1;
  }

  return result;
}
