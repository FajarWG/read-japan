import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.ankiReviewEvent.findMany({
    where: { userId: session.id, createdAt: { gte: since } },
    select: { direction: true, rating: true, responseTimeMs: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const scheduled = await prisma.ankiProgress.findMany({
    where: { userId: session.id },
    select: { cardKey: true, direction: true, dueDate: true, repetitions: true },
    orderBy: { dueDate: "asc" },
  });
  const customIds = scheduled
    .filter((item) => item.cardKey.startsWith("custom-"))
    .map((item) => item.cardKey.slice("custom-".length));
  const customCards = customIds.length
    ? await prisma.ankiCard.findMany({ where: { id: { in: customIds } }, select: { id: true, kanji: true, hiragana: true, translation: true } })
    : [];
  return NextResponse.json({ events, scheduled, customCards });
}
