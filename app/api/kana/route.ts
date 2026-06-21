import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { applySrsRating, newSrsState, type SrsRating } from "@/src/shared/lib/srs";

export const dynamic = "force-dynamic";

interface PostBody {
  kana?: string;
  rating?: SrsRating;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const progress = await prisma.kanaProgress.findMany({
    where: { userId: session.id },
    select: { kana: true, ease: true, interval: true, repetitions: true, dueDate: true },
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
  const { kana, rating } = body;
  if (!kana || typeof kana !== "string") {
    return NextResponse.json({ error: "kana required" }, { status: 400 });
  }
  if (!rating || ![1, 2, 3, 4].includes(rating)) {
    return NextResponse.json({ error: "rating must be 1-4" }, { status: 400 });
  }

  const prev = await prisma.kanaProgress.findUnique({
    where: { userId_kana: { userId: session.id, kana } },
  });
  const next = prev
    ? applySrsRating(prev, rating)
    : applySrsRating(newSrsState(), rating);

  await prisma.kanaProgress.upsert({
    where: { userId_kana: { userId: session.id, kana } },
    update: {
      ease: next.ease,
      interval: next.interval,
      repetitions: next.repetitions,
      dueDate: next.dueDate,
    },
    create: {
      userId: session.id,
      kana,
      ease: next.ease,
      interval: next.interval,
      repetitions: next.repetitions,
      dueDate: next.dueDate,
    },
  });

  return NextResponse.json({ ok: true, next });
}
