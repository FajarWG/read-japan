/**
 * Server-only helpers untuk kotoba-lookup.
 * File ini BOLEH meng-import `prisma` karena hanya dipakai dari
 * server components / server actions.
 *
 * Untuk fungsi-fungsi client-safe, lihat `./kotoba-lookup.ts`.
 */

import { prisma } from "@/src/shared/lib/db";
import {
  createKotobaLookupEntry,
  type KotobaSourceItem,
  type KotobaLookupEntry,
  getKotobaAliasMapForChapter,
  type AliasEntryWithChapter,
  type StoryToken,
  kanaMap,
  COMBINING_SMALL_KANA_PUBLIC,
  isKanaCodePointPublic,
} from "./kotoba-lookup";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";

/**
 * Async version yang juga include KanjiDictionary dari database.
 * Dipakai di server components agar admin-added kanji juga bisa diklik.
 */
export async function parseStoryTextAsync(
  text: string,
  chapter: number | null,
): Promise<StoryToken[]> {
  const result: StoryToken[] = [];

  const chapterAliasMap =
    chapter != null ? getKotobaAliasMapForChapter(chapter).aliasMap : new Map();
  const globalAliasMap = await getGlobalKotobaAliasMapWithChapterAsync();

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

    // 1. Chapter-specific
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

    // 2. Global (Dekiru + KanjiDictionary)
    if (globalMaxLen > 0) {
      let matched = false;
      for (let len = globalMaxLen; len >= 1; len--) {
        if (i + len > text.length) continue;
        const slice = text.slice(i, i + len);
        const hit = globalAliasMap.get(slice);
        if (hit && (!chapter || hit.chapter !== chapter)) {
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

    const next = text[i + 1];
    if (
      next !== undefined &&
      COMBINING_SMALL_KANA_PUBLIC.has(next) &&
      isKanaCodePointPublic(ch)
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

    if (isKanaCodePointPublic(ch)) {
      result.push({ type: "kana", char: ch, info: kanaMap[ch] });
      i += 1;
      continue;
    }

    result.push({ type: "plain", char: ch, charIndex: i });
    i += 1;
  }

  return result;
}

/**
 * Async version yang include KanjiDictionary (admin-added).
 * Hanya dipakai di server-side.
 */
export async function getGlobalKotobaAliasMapWithChapterAsync(): Promise<
  Map<string, AliasEntryWithChapter>
> {
  // Start with sync global map (DekiruNihongoGroup only)
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

  // Add KanjiDictionary entries (admin-added)
  try {
    const adminEntries = await prisma.kanjiDictionary.findMany();
    for (const item of adminEntries) {
      const synthetic = createKotobaLookupEntry({
        kanji: item.kanji,
        hiragana: item.hiragana,
        translations: {
          id: item.meaningId ?? "",
          en: item.meaningEn ?? "",
        },
      });
      if (!synthetic) continue;
      const chapter = item.chapter ?? 0;
      for (const alias of synthetic.aliases) {
        if (!map.has(alias)) {
          map.set(alias, { entry: synthetic, chapter });
        }
      }
    }
  } catch (err) {
    console.error("[kotoba-lookup-server] Gagal load KanjiDictionary:", err);
  }

  return map;
}