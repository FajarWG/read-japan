import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { applySrsRating, newSrsState, type SrsRating } from "@/src/shared/lib/srs";

export const dynamic = "force-dynamic";

interface PostBody {
  kanji?: string;
  rating?: SrsRating;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const progress = await prisma.kanjiProgress.findMany({
    where: { userId: session.id },
    select: { kanji: true, ease: true, interval: true, repetitions: true, dueDate: true },
  });
  return NextResponse.json({ progress });
}

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
  const { kanji, rating } = body;
  if (!kanji || typeof kanji !== "string") {
    return NextResponse.json({ error: "kanji required" }, { status: 400 });
  }
  if (!rating || ![1, 2, 3, 4].includes(rating)) {
    return NextResponse.json({ error: "rating must be 1-4" }, { status: 400 });
  }

  const prev = await prisma.kanjiProgress.findUnique({
    where: { userId_kanji: { userId: session.id, kanji } },
  });
  const next = prev
    ? applySrsRating(prev, rating)
    : applySrsRating(newSrsState(), rating);

  await prisma.kanjiProgress.upsert({
    where: { userId_kanji: { userId: session.id, kanji } },
    update: {
      ease: next.ease,
      interval: next.interval,
      repetitions: next.repetitions,
      dueDate: next.dueDate,
    },
    create: {
      userId: session.id,
      kanji,
      ease: next.ease,
      interval: next.interval,
      repetitions: next.repetitions,
      dueDate: next.dueDate,
    },
  });

  return NextResponse.json({ ok: true, next });
}
