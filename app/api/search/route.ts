import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { kanaMap } from "@/src/modules/kana/lib/kana-map";
import { DekiruNihongoGroups } from "@/src/helper/DekiruNihongoGroup";

export const dynamic = "force-dynamic";

interface SearchHit {
  type: "story" | "prep" | "kanji" | "vocab";
  id: string;
  title: string;
  snippet?: string;
  href: string;
}

/**
 * Cari kata/frasa di:
 * - KanjiDictionary (kanji/hiragana/meaning)
 * - PrepData (title + sections.conversations[].japanese)
 * - Story (title/content)
 * - Vocab dari DekiruNihongoGroups (examples[].kanji/hiragana/romaji)
 *
 * Mendukung romaji: input "taberu" → convert ke kana "たべる" via kanaMap,
 * lalu query ke semua field yang berisi kana.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 1) {
    return NextResponse.json({ hits: [] });
  }

  const hits: SearchHit[] = [];

  // Convert romaji → kana untuk query yang mengandung latin
  const hasLatin = /[a-zA-Z]/.test(q);
  const kanaVariants: string[] = [];
  if (hasLatin) {
    const lowered = q.toLowerCase().trim();
    // 1. Exact match romaji → kana
    for (const [kana, info] of Object.entries(kanaMap)) {
      if (info.romaji.toLowerCase() === lowered) {
        kanaVariants.push(kana);
        break;
      }
    }
    // 2. Prefix match romaji (mis. "tabe" → た, べ — 2-char prefix)
    if (kanaVariants.length === 0) {
      for (let i = Math.min(lowered.length, 5); i >= 1; i--) {
        const prefix = lowered.slice(0, i);
        for (const [kana, info] of Object.entries(kanaMap)) {
          if (info.romaji.toLowerCase() === prefix) {
            kanaVariants.push(kana);
            break;
          }
        }
        if (kanaVariants.length > 0) break;
      }
    }
  }

  const searchTerms = [q, ...kanaVariants].slice(0, 5);

  // KanjiDictionary
  for (const term of searchTerms) {
    const kanjiHits = await prisma.kanjiDictionary.findMany({
      where: {
        OR: [
          { kanji: { contains: term, mode: "insensitive" } },
          { hiragana: { contains: term, mode: "insensitive" } },
          { meaningId: { contains: term, mode: "insensitive" } },
          { meaningEn: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
    for (const k of kanjiHits) {
      hits.push({
        type: "kanji",
        id: `kanji-${k.id}`,
        title: `${k.kanji} (${k.hiragana})`,
        snippet: k.meaningId ?? k.meaningEn ?? undefined,
        href: "#",
      });
    }
  }

  // Stories
  for (const term of searchTerms) {
    const storyHits = await prisma.story.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { content: { contains: term, mode: "insensitive" } },
          { translation: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
    for (const s of storyHits) {
      const idx = s.content.toLowerCase().indexOf(term.toLowerCase());
      const snippet = idx >= 0
        ? s.content.slice(Math.max(0, idx - 20), idx + 40)
        : s.title;
      hits.push({
        type: "story",
        id: `story-${s.id}`,
        title: s.title,
        snippet,
        href: `/stories/read/${s.id}`,
      });
    }
  }

  // PrepData
  for (const term of searchTerms) {
    const prepHits = await prisma.prepData.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
    for (const p of prepHits) {
      hits.push({
        type: "prep",
        id: `prep-${p.id}`,
        title: `Bab ${p.chapter} Poin ${p.point} — ${p.title}`,
        href: `/prep?chapter=${p.chapter}&point=${p.point}`,
      });
    }
  }

  // Vocab dari DekiruNihongoGroups
  for (const group of DekiruNihongoGroups) {
    for (const section of group.sections) {
      for (const ex of section.examples) {
        const matchField = ([ex.kanji, ex.hiragana, ex.romaji, ex.translations.id, ex.translations.en] as Array<string | undefined>)
          .filter((v): v is string => typeof v === "string" && v.length > 0)
          .some((v) => v.toLowerCase().includes(q.toLowerCase()));
        if (!matchField) continue;
        hits.push({
          type: "vocab",
          id: `vocab-${group.chapter}-${section.title}-${ex.kanji}`,
          title: `${ex.kanji || ex.hiragana} (${ex.hiragana})`,
          snippet: `${group.title} > ${section.title} — ${ex.translations.id}`,
          href: `/prep?chapter=${group.chapter}&point=${group.sections.length > 1 ? 2 : 1}`,
        });
        if (hits.length >= 30) break;
      }
      if (hits.length >= 30) break;
    }
    if (hits.length >= 30) break;
  }

  // De-dupe by id
  const seen = new Set<string>();
  const deduped = hits.filter((h) => {
    if (seen.has(h.id)) return false;
    seen.add(h.id);
    return true;
  });

  return NextResponse.json({ hits: deduped.slice(0, 30), romajiHint: hasLatin ? kanaVariants : null });
}
