import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";
import { logActivityAndCheck } from "@/src/modules/achievements/lib/achievements";

export const dynamic = "force-dynamic";

interface MineItem {
  kanji?: string | null;
  hiragana?: string;
  meaning?: string;
  surface: string;
}

interface PostBody {
  storyId?: number;
  items?: MineItem[];
}

/**
 * Tambah vocab hasil sentence mining ke deck Anki khusus ("Mined").
 * Setiap item disimpan sebagai AnkiProgress dengan chapter="Mined" dan
 * cardKey berbasis kanji+hiragana agar unik.
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
  if (!body.storyId || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "storyId, items[] required" }, { status: 400 });
  }

  let count = 0;
  for (const item of body.items) {
    if (!item.surface) continue;
    const kanji = item.kanji ?? "-";
    const hiragana = item.hiragana ?? item.surface;
    const cardKey = `Mined-${body.storyId}-${kanji}-${hiragana}`.slice(0, 191);
    try {
      await prisma.ankiProgress.upsert({
        where: { userId_cardKey: { userId: session.id, cardKey } },
        update: {},
        create: {
          userId: session.id,
          cardKey,
          chapter: "Mined",
          sectionIndex: 0,
          interval: 0,
          ease: 2.5,
          repetitions: 0,
          dueDate: new Date(),
        },
      });
      count += 1;
    } catch (err) {
      console.error("[mine] upsert:", err);
    }
  }

  // Log activity untuk achievement
  await logActivityAndCheck(session.id, "sentence_mined", String(body.storyId), {
    count,
  });

  return NextResponse.json({ ok: true, count });
}
