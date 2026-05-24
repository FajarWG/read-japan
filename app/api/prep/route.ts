import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chapter = parseInt(searchParams.get("chapter") ?? "");
  const point = parseInt(searchParams.get("point") ?? "");

  if (isNaN(chapter) || isNaN(point)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const data = await prisma.prepData.findUnique({
      where: {
        chapter_point: {
          chapter,
          point,
        },
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching prep data:", error);
    return NextResponse.json(
      { error: "Failed to fetch prep data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { chapter, point, title, conversations, grammar, audioFiles, exercises, sections } = body;

    const parsedChapter = parseInt(chapter);
    const parsedPoint = parseInt(point);

    if (
      isNaN(parsedChapter) ||
      isNaN(parsedPoint) ||
      !title ||
      !Array.isArray(grammar) ||
      !Array.isArray(audioFiles)
    ) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    if (!Array.isArray(conversations) && !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Harus menyertakan array 'conversations' atau 'sections'." },
        { status: 400 }
      );
    }

    if (conversations !== undefined && conversations !== null) {
      if (!Array.isArray(conversations)) {
        return NextResponse.json(
          { error: "Conversations harus berupa array." },
          { status: 400 }
        );
      }
      for (let i = 0; i < conversations.length; i++) {
        const item = conversations[i];
        if (!item || typeof item.speaker !== "string" || typeof item.japanese !== "string" || typeof item.translation !== "string") {
          return NextResponse.json(
            { error: `Conversations item pada indeks ${i} harus memiliki 'speaker', 'japanese', dan 'translation' berupa string.` },
            { status: 400 }
          );
        }
      }
    }

    if (exercises !== undefined && exercises !== null) {
      if (!Array.isArray(exercises)) {
        return NextResponse.json(
          { error: "Exercises harus berupa array." },
          { status: 400 }
        );
      }
      for (let i = 0; i < exercises.length; i++) {
        const item = exercises[i];
        if (!item || typeof item.prompt !== "string" || typeof item.answer !== "string") {
          return NextResponse.json(
            { error: `Exercises item pada indeks ${i} harus memiliki 'prompt' dan 'answer' berupa string.` },
            { status: 400 }
          );
        }
      }
    }

    if (sections !== undefined && sections !== null) {
      if (!Array.isArray(sections)) {
        return NextResponse.json(
          { error: "Sections harus berupa array." },
          { status: 400 }
        );
      }
      for (let i = 0; i < sections.length; i++) {
        const sect = sections[i];
        if (!sect || typeof sect.title !== "string") {
          return NextResponse.json(
            { error: `Section pada indeks ${i} wajib memiliki 'title' berupa string.` },
            { status: 400 }
          );
        }
        if (!Array.isArray(sect.conversations)) {
          return NextResponse.json(
            { error: `Section pada indeks ${i} wajib memiliki array 'conversations'.` },
            { status: 400 }
          );
        }
        for (let j = 0; j < sect.conversations.length; j++) {
          const conv = sect.conversations[j];
          if (!conv || typeof conv.speaker !== "string" || typeof conv.japanese !== "string" || typeof conv.translation !== "string") {
            return NextResponse.json(
              { error: `Section ${i} conversation item ${j} wajib memiliki 'speaker', 'japanese', dan 'translation' berupa string.` },
              { status: 400 }
            );
          }
        }
        if (!Array.isArray(sect.exercises)) {
          return NextResponse.json(
            { error: `Section pada indeks ${i} wajib memiliki array 'exercises'.` },
            { status: 400 }
          );
        }
        for (let j = 0; j < sect.exercises.length; j++) {
          const ex = sect.exercises[j];
          if (!ex || typeof ex.prompt !== "string" || typeof ex.answer !== "string") {
            return NextResponse.json(
              { error: `Section ${i} exercise item ${j} wajib memiliki 'prompt' dan 'answer' berupa string.` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Upsert PrepData
    const data = await prisma.prepData.upsert({
      where: {
        chapter_point: {
          chapter: parsedChapter,
          point: parsedPoint,
        },
      },
      update: {
        title,
        conversations: conversations ?? null,
        grammar,
        exercises: exercises ?? null,
        sections: sections ?? null,
        audioFiles,
      },
      create: {
        chapter: parsedChapter,
        point: parsedPoint,
        title,
        conversations: conversations ?? null,
        grammar,
        exercises: exercises ?? null,
        sections: sections ?? null,
        audioFiles,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving prep data:", error);
    return NextResponse.json(
      { error: "Failed to save prep data" },
      { status: 500 }
    );
  }
}
