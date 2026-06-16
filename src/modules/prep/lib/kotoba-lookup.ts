import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";

const KANJI_LOOKUP_PREFIX = "kotoba:";
const KANJI_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff々]/;
const OPTIONAL_GROUP_PATTERN = /[（(]([^()（）]+)[）)]/;

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
  const rawKanji = normalizeLookupText(item.kanji);
  if (!rawKanji || rawKanji === "-" || !hasKanji(rawKanji)) {
    return null;
  }

  const aliases = expandOptionalGroups(rawKanji).filter(hasKanji);
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
