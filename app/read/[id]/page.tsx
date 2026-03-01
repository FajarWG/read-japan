import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/src/shared/lib/db";
import { ReadPageContent } from "@/src/modules/read/components/ReadPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (isNaN(id)) return {};

  const story = await prisma.story.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: story?.title ?? "Story not found",
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (isNaN(id)) notFound();

  const story = await prisma.story.findUnique({ where: { id } });
  if (!story) notFound();

  return <ReadPageContent story={story} />;
}
