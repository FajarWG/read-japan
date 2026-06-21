import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

interface PostBody {
  kanji?: string;
  hiragana?: string;
  meaningId?: string;
  meaningEn?: string;
  chapter?: number;
  notes?: string;
}

/**
 * POST /api/admin/kanji
 * Auth: ADMIN only
 *
 * Tambah (atau update) entry KanjiDictionary. Upsert by (kanji, hiragana)
 * untuk handle jika admin isi beberapa reading untuk kanji yang sama.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Hanya admin yang bisa menambah kanji." },
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
  const hiragana = (body.hiragana ?? "").trim();
  if (!kanji) {
    return NextResponse.json({ error: "kanji wajib diisi" }, { status: 400 });
  }
  if (!hiragana) {
    return NextResponse.json(
      { error: "hiragana wajib diisi" },
      { status: 400 },
    );
  }

  const result = await prisma.kanjiDictionary.upsert({
    where: { kanji_hiragana: { kanji, hiragana } },
    update: {
      meaningId: body.meaningId?.trim() || null,
      meaningEn: body.meaningEn?.trim() || null,
      chapter: typeof body.chapter === "number" ? body.chapter : null,
      notes: body.notes?.trim() || null,
    },
    create: {
      kanji,
      hiragana,
      meaningId: body.meaningId?.trim() || null,
      meaningEn: body.meaningEn?.trim() || null,
      chapter: typeof body.chapter === "number" ? body.chapter : null,
      notes: body.notes?.trim() || null,
    },
  });

  // Refresh halaman yang menampilkan kanji ini
  revalidatePath("/stories/admin/kanji");
  revalidatePath("/stories");
  revalidatePath("/stories/read");

  return NextResponse.json({ ok: true, id: result.id });
}
