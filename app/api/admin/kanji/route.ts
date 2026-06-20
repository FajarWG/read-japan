import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kanjiList = await prisma.kanjiDictionary.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json(kanjiList);
}