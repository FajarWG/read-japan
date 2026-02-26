"use server";

import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";

export interface BatchStory {
  title: string;
  content: string;
}

export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; count: number };

// ─────────────────────────────────────────
// createStory — buat satu cerita, lalu redirect ke halaman baca
// ─────────────────────────────────────────
export async function createStory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title) return { status: "error", message: "Judul wajib diisi." };
  if (!content) return { status: "error", message: "Konten wajib diisi." };

  const story = await prisma.story.create({ data: { title, content } });
  redirect(`/read/${story.id}`);
}

// ─────────────────────────────────────────
// createManyStories — batch insert dari JSON
// ─────────────────────────────────────────
export async function createManyStories(
  stories: BatchStory[],
): Promise<{ count: number }> {
  if (!Array.isArray(stories) || stories.length === 0)
    throw new Error("Data cerita tidak boleh kosong.");

  for (const [i, s] of stories.entries()) {
    if (!s.title?.trim())
      throw new Error(`Item ke-${i + 1}: field 'title' wajib diisi.`);
    if (!s.content?.trim())
      throw new Error(`Item ke-${i + 1}: field 'content' wajib diisi.`);
  }

  const result = await prisma.story.createMany({
    data: stories.map((s) => ({
      title: s.title.trim(),
      content: s.content.trim(),
    })),
  });

  return { count: result.count };
}
