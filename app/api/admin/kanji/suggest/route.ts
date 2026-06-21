import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import {
  callGemini,
  RateLimitError,
  AllModelsExhaustedError,
  getQuotaStatus,
} from "@/src/shared/lib/gemini-limiter";

export const dynamic = "force-dynamic";

interface PostBody {
  kanji?: string;
  context?: string;
}

/**
 * POST /api/admin/kanji/suggest
 *
 * Body: { kanji: string, context?: string }
 * Auth: ADMIN only
 *
 * Panggil Gemini untuk generate reading + meaning berdasarkan kanji
 * dan (opsional) kalimat konteks. Return hiragana, meaning_id, meaning_en.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Hanya admin yang bisa menggunakan AI suggest." },
      { status: 403 },
    );
  }
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const kanji = (body.kanji ?? "").trim();
  const context = (body.context ?? "").trim();
  if (!kanji) {
    return NextResponse.json({ error: "kanji required" }, { status: 400 });
  }
  if (kanji.length > 8) {
    return NextResponse.json(
      { error: "kanji too long (max 8 chars)" },
      { status: 400 },
    );
  }

  // Cek apakah sudah ada di DB — kalau ada, return data existing
  const existing = await prisma.kanjiDictionary.findFirst({
    where: { kanji },
  });
  if (existing) {
    return NextResponse.json({
      source: "db",
      kanji: existing.kanji,
      hiragana: existing.hiragana,
      meaningId: existing.meaningId ?? "",
      meaningEn: existing.meaningEn ?? "",
      chapter: existing.chapter,
    });
  }

  // Prompt untuk Gemini
  const prompt = `You are a Japanese language expert. The user shows you a Japanese kanji "${kanji}"${context ? ` used in this context: "${context}"` : ""}.

Provide:
- Reading in hiragana (the most common reading for this kanji)
- Meaning in English (1-3 words, concise)
- Meaning in Indonesian (1-3 kata, ringkas)

Respond ONLY with valid JSON in this exact format (no markdown):
{"hiragana":"...","meaningEn":"...","meaningId":"..."}`;

  let reply: string;
  let modelUsed: string;
  try {
    const result = await callGemini(
      "You are a Japanese language expert assistant. Always respond in valid JSON when asked.",
      [],
      prompt,
    );
    reply = result.text;
    modelUsed = result.model;
  } catch (err) {
    if (err instanceof RateLimitError || err instanceof AllModelsExhaustedError) {
      return NextResponse.json(
        {
          error: err.message,
          quota: getQuotaStatus(),
        },
        { status: 429 },
      );
    }
    console.error("[kanji-suggest] gemini error:", err);
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  // Parse JSON dari reply (Gemini kadang wrap di ```json ... ```)
  let parsed: { hiragana?: string; meaningEn?: string; meaningId?: string };
  try {
    const cleaned = reply
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Gagal parse respons AI", raw: reply.slice(0, 200) },
      { status: 502 },
    );
  }

  if (!parsed.hiragana) {
    return NextResponse.json(
      { error: "AI tidak mengembalikan hiragana", raw: reply.slice(0, 200) },
      { status: 502 },
    );
  }

  return NextResponse.json({
    source: "ai",
    model: modelUsed,
    kanji,
    hiragana: parsed.hiragana,
    meaningEn: parsed.meaningEn ?? "",
    meaningId: parsed.meaningId ?? "",
  });
}
