import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

interface PostBody {
  storyId?: number;
  charIndex?: number;
  length?: number;
  color?: string;
  note?: string;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const storyIdRaw = searchParams.get("storyId");
  const storyId = storyIdRaw ? Number(storyIdRaw) : undefined;
  const highlights = await prisma.highlight.findMany({
    where: {
      userId: session.id,
      ...(storyId ? { storyId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ highlights });
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
  if (!body.storyId || typeof body.charIndex !== "number") {
    return NextResponse.json({ error: "storyId, charIndex required" }, { status: 400 });
  }
  const highlight = await prisma.highlight.create({
    data: {
      userId: session.id,
      storyId: body.storyId,
      charIndex: body.charIndex,
      length: body.length ?? 1,
      color: body.color ?? "yellow",
      note: body.note,
    },
  });
  return NextResponse.json({ ok: true, highlight });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const idRaw = searchParams.get("id");
  if (!idRaw) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const id = Number(idRaw);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  await prisma.highlight.deleteMany({
    where: { id, userId: session.id },
  });
  return NextResponse.json({ ok: true });
}
