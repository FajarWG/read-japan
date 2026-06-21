import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import {
  callGemini,
  getQuotaStatus,
  logChatUsage,
  RateLimitError,
  AllModelsExhaustedError,
} from "@/src/shared/lib/gemini-limiter";

export const dynamic = "force-dynamic";

interface PostBody {
  message?: string;
  level?: "N5" | "N4" | "N3";
}

/**
 * POST /api/chat
 * Body: { message: string, level?: "N5" | "N4" | "N3" }
 *
 * Returns: { reply: string, model: string, quota: QuotaStatus[] }
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const level = body.level ?? "N5";
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }
  if (!["N5", "N4", "N3"].includes(level)) {
    return NextResponse.json({ error: "level must be N5/N4/N3" }, { status: 400 });
  }

  // Load last 10 messages as history
  const recent = await prisma.chatMessage.findMany({
    where: { userId: session.id, level },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const history = recent
    .reverse()
    .map((m) => ({ role: m.role as "user" | "model", parts: [{ text: m.content }] }));

  // System prompt per level
  const systemPrompt = makeSystemPrompt(level, session.username);

  let reply: string;
  let modelUsed: string;
  let tokens: number | undefined;
  try {
    const result = await callGemini(systemPrompt, history, message);
    reply = result.text;
    modelUsed = result.model;
    tokens = result.tokens;
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          kind: err.kind,
          model: err.model,
          quota: getQuotaStatus(),
        },
        { status: 429 },
      );
    }
    if (err instanceof AllModelsExhaustedError) {
      return NextResponse.json(
        {
          error: err.message,
          quota: getQuotaStatus(),
        },
        { status: 429 },
      );
    }
    console.error("[chat] gemini error:", err);
    return NextResponse.json(
      { error: "AI service error" },
      { status: 502 },
    );
  }

  // Save messages
  await prisma.chatMessage.create({
    data: { userId: session.id, role: "user", content: message, level },
  });
  await prisma.chatMessage.create({
    data: { userId: session.id, role: "model" as "user", content: reply, level, tokens },
  });
  await logChatUsage(session.id, modelUsed as "gemini-3.1-flash-lite" | "gemini-2.5-flash-lite", tokens);

  return NextResponse.json({
    reply,
    model: modelUsed,
    quota: getQuotaStatus(),
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    quota: getQuotaStatus(),
  });
}

function makeSystemPrompt(level: string, username: string): string {
  const levelDesc: Record<string, string> = {
    N5: "very basic (N5): simple present/past tense, basic particles (は、が、を、に、で、へ、と、から、まで、よ、ね), basic adjectives, daily vocabulary",
    N4: "elementary (N4): te-form, ~tai, ~toki, ~noni, basic keigo, casual vs polite",
    N3: "intermediate (N3): passive/causative, conditional forms, complex compound sentences, formal keigo (尊敬語/謙譲語)",
  };
  return `You are a friendly Japanese tutor for a learner at JLPT ${level} (${levelDesc[level] ?? levelDesc.N5}).

User name: ${username}

Rules:
- Respond PRIMARILY in simple Japanese appropriate for ${level}.
- Language Consistency: Determine the language of the user's query (Indonesian or English). If the user writes in Indonesian (or if the language is unclear), write all explanations, grammar corrections, and definitions in Indonesian. If the user writes in English, use English. Do NOT mix English and Indonesian in explanations.
- If learner makes a grammar/vocab mistake, gently correct them using the chosen explanation language.
- For new vocabulary, give: the word in kanji, hiragana, romaji, and meaning in the matching explanation language (Indonesian or English, not both).
- Use example sentences at the ${level} level.
- Keep replies under 200 words unless learner asks for detail.
- Encourage learner; celebrate progress.
- Never use kanji/grammar far above ${level} without explanation.`;
}
