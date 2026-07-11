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
  const deckName = searchParams.get("deckName") || "JLPT N5-N4";

  try {
    const cards = await prisma.ankiCard.findMany({
      where: { deckName },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching custom Anki cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom cards" },
      { status: 500 }
    );
  }
}
