import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // 1. Search Vocabularies
    const vocabMatches = await prisma.vocabulary.findMany({
      where: {
        OR: [
          { kanji: { contains: query } },
          { reading: { contains: query } },
        ],
      },
      take: 10,
    });

    // 2. Search Kanji
    const kanjiMatches = await prisma.kanji.findMany({
      where: {
        OR: [
          { literal: query },
        ],
      },
      take: 5,
    });

    const results = [
      ...kanjiMatches.map((k) => {
        const onyomi = typeof k.onyomi === "string" ? JSON.parse(k.onyomi) : (k.onyomi || []);
        const meanings = typeof k.meanings === "string" ? JSON.parse(k.meanings) : (k.meanings || []);
        return {
          type: "kanji" as const,
          query: k.literal,
          title: k.literal,
          subtext: Array.isArray(onyomi) ? onyomi.slice(0, 2).join(", ") : "",
          meaning: Array.isArray(meanings) ? meanings.slice(0, 2).join(", ") : "",
          jlpt: k.jlpt,
        };
      }),
      ...vocabMatches.map((v) => {
        const meanings = typeof v.meanings === "string" ? JSON.parse(v.meanings) : (v.meanings || []);
        const firstMeaning = Array.isArray(meanings) && meanings[0]
          ? (typeof meanings[0] === "string" ? meanings[0] : meanings[0].glosses?.join(", "))
          : "";

        return {
          type: "vocab" as const,
          query: v.kanji || v.reading,
          title: v.kanji,
          subtext: v.reading,
          meaning: firstMeaning || "",
          jlpt: v.jlpt,
        };
      }),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in GET /api/explore/search:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
