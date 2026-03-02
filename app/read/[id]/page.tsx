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
    select: { title: true, content: true },
  });

  if (!story) return {};

  const preview = story.content.slice(0, 100).replace(/\n/g, " ");

  return {
    title: story.title,
    description: `Baca dan latihan kana dari cerita "${story.title}". ${preview}…`,
    openGraph: {
      title: `${story.title} | Read Japan`,
      description: `Latihan membaca kana dari cerita: ${story.title}`,
      type: "article",
      url: `/read/${id}`,
    },
    alternates: {
      canonical: `/read/${id}`,
    },
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
