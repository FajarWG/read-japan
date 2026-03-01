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

  if (!title) return { status: "error", message: "ERR_TITLE_REQUIRED" };
  if (!content) return { status: "error", message: "ERR_CONTENT_REQUIRED" };

  const story = await prisma.story.create({
    data: { title, content, translation, focus },
  });
  redirect(`/read/${story.id}`);
}

export async function createManyStories(
  stories: BatchStory[],
): Promise<{ count: number }> {
  if (!Array.isArray(stories) || stories.length === 0)
    throw new Error("Data cerita tidak boleh kosong.");

  const results = await Promise.all(
    stories.map((s) =>
      prisma.story.create({
        data: {
          title: s.title.trim(),
          content: s.content.trim(),
          translation: s.translation?.trim() || undefined,
          focus: s.focus?.trim() || undefined,
        },
      }),
    ),
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
  revalidatePath("/");
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
  revalidatePath("/");
}
