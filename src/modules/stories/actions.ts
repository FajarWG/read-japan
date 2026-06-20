"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface BatchStory {
  title: string;
  content: string;
  translation?: string;
  focus?: string;
  chapter?: number; // 1-15, null = legacy
  point?: number; // 1-3 (cerita ke-N dalam bab)
}

export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; count: number };

// ─────────────────────────────────────────
// Story management
// ─────────────────────────────────────────

export async function createStory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const translation =
    (formData.get("translation") as string)?.trim() || undefined;
  const focus = (formData.get("focus") as string)?.trim() || undefined;
  const chapterRaw = (formData.get("chapter") as string)?.trim();
  const pointRaw = (formData.get("point") as string)?.trim();
  const chapter = chapterRaw ? Number(chapterRaw) : null;
  const point = pointRaw ? Number(pointRaw) : null;

  if (
    chapter !== null &&
    (!Number.isInteger(chapter) || chapter < 1 || chapter > 15)
  ) {
    return { status: "error", message: "ERR_CHAPTER_INVALID" };
  }
  if (
    point !== null &&
    (!Number.isInteger(point) || point < 1 || point > 3)
  ) {
    return { status: "error", message: "ERR_POINT_INVALID" };
  }
  if ((chapter === null) !== (point === null)) {
    return { status: "error", message: "ERR_CHAPTER_POINT_PAIR" };
  }

  if (!title) return { status: "error", message: "ERR_TITLE_REQUIRED" };
  if (!content) return { status: "error", message: "ERR_CONTENT_REQUIRED" };

  const story = await prisma.story.create({
    data: {
      title,
      content,
      translation,
      focus,
      chapter,
      point,
    },
  });
  redirect(`/stories/read/${story.id}`);
}

export async function createManyStories(
  stories: BatchStory[],
): Promise<{ count: number }> {
  if (!Array.isArray(stories) || stories.length === 0)
    throw new Error("Data cerita tidak boleh kosong.");

  const results = await Promise.all(
    stories.map((s) => {
      const chapter =
        typeof s.chapter === "number" && Number.isInteger(s.chapter)
          ? s.chapter
          : null;
      const point =
        typeof s.point === "number" && Number.isInteger(s.point)
          ? s.point
          : null;
      if ((chapter === null) !== (point === null)) {
        throw new Error(
          `Cerita "${s.title}": chapter & point harus diisi bersamaan.`,
        );
      }
      return prisma.story.create({
        data: {
          title: s.title.trim(),
          content: s.content.trim(),
          translation: s.translation?.trim() || undefined,
          focus: s.focus?.trim() || undefined,
          chapter,
          point,
        },
      });
    }),
  );

  return { count: results.length };
}

// ─────────────────────────────────────────
// Reading progress
// ─────────────────────────────────────────

export async function recordStoryRead(storyId: number): Promise<void> {
  await prisma.story.update({
    where: { id: storyId },
    data: { totalReads: { increment: 1 } },
  });
  revalidatePath("/");
}

export async function recordClick(char: string): Promise<void> {
  const session = await getSession();
  if (!session) return; // guest: handled client-side via localStorage

  await prisma.learningProgress.upsert({
    where: { character_userId: { character: char, userId: session.id } },
    update: { clickCount: { increment: 1 } },
    create: { character: char, clickCount: 1, userId: session.id },
  });
  revalidatePath("/learn");
  revalidatePath("/stories");
  revalidatePath("/");
}

export async function recordKotobaLookup(progressKey: string): Promise<void> {
  await recordClick(progressKey);
}

export async function recordWrongReads(chars: string[]): Promise<void> {
  if (chars.length === 0) return;
  const session = await getSession();
  if (!session) return; // guest: handled client-side

  await Promise.all(
    chars.map((char) =>
      prisma.learningProgress.upsert({
        where: { character_userId: { character: char, userId: session.id } },
        update: { wrongCount: { increment: 1 } },
        create: {
          character: char,
          clickCount: 0,
          wrongCount: 1,
          userId: session.id,
        },
      }),
    ),
  );
  revalidatePath("/learn");
  revalidatePath("/stories");
  revalidatePath("/");
}

export async function recordPerfectRead(chars: string[]): Promise<void> {
  if (chars.length === 0) return;
  const session = await getSession();
  if (!session) return; // guest: handled client-side

  const records = await prisma.learningProgress.findMany({
    where: { character: { in: chars }, userId: session.id },
    select: { character: true, clickCount: true, wrongCount: true },
  });

  const updates = records
    .filter((r) => r.wrongCount > 0 || r.clickCount > 0)
    .map((r) => {
      if (r.wrongCount > 0) {
        return prisma.learningProgress.update({
          where: {
            character_userId: { character: r.character, userId: session.id },
          },
          data: { wrongCount: { decrement: 1 } },
        });
      }
      return prisma.learningProgress.update({
        where: {
          character_userId: { character: r.character, userId: session.id },
        },
        data: { clickCount: { decrement: 1 } },
      });
    });

  await Promise.all(updates);
  revalidatePath("/learn");
  revalidatePath("/stories");
  revalidatePath("/");
}

// ─────────────────────────────────────────
// KanjiDictionary — admin-managed vocab
// ─────────────────────────────────────────

export interface KanjiInput {
  kanji: string;
  hiragana: string;
  meaningId?: string;
  meaningEn?: string;
  chapter?: number;
  notes?: string;
}

export async function createKanji(
  input: KanjiInput,
): Promise<{ id: number }> {
  const kanji = input.kanji.trim();
  const hiragana = input.hiragana.trim();
  if (!kanji) throw new Error("Kanji wajib diisi.");
  if (!hiragana) throw new Error("Hiragana wajib diisi.");

  const result = await prisma.kanjiDictionary.upsert({
    where: { kanji_hiragana: { kanji, hiragana } },
    update: {
      meaningId: input.meaningId?.trim() || null,
      meaningEn: input.meaningEn?.trim() || null,
      chapter: input.chapter ?? null,
      notes: input.notes?.trim() || null,
    },
    create: {
      kanji,
      hiragana,
      meaningId: input.meaningId?.trim() || null,
      meaningEn: input.meaningEn?.trim() || null,
      chapter: input.chapter ?? null,
      notes: input.notes?.trim() || null,
    },
  });

  revalidatePath("/stories/admin/kanji");
  return { id: result.id };
}

export async function createManyKanji(
  inputs: KanjiInput[],
): Promise<{ count: number; failed: number }> {
  if (!Array.isArray(inputs) || inputs.length === 0)
    throw new Error("Data kanji tidak boleh kosong.");

  let count = 0;
  let failed = 0;
  for (const input of inputs) {
    try {
      await createKanji(input);
      count += 1;
    } catch (err) {
      failed += 1;
      console.error("[createManyKanji] gagal:", input, err);
    }
  }
  return { count, failed };
}

export async function deleteKanji(id: number): Promise<void> {
  await prisma.kanjiDictionary.delete({ where: { id } });
  revalidatePath("/stories/admin/kanji");
}
