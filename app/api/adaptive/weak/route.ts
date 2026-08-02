import { NextRequest, NextResponse } from "next/server";
import { calculateUserWeakKanji } from "@/src/modules/adaptive/services/adaptiveService";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weakKanji = await calculateUserWeakKanji(session.id);
    return NextResponse.json({ weakKanji });
  } catch (error) {
    console.error("Error in GET /api/adaptive/weak:", error);
    return NextResponse.json({ error: "Failed to fetch weak kanji" }, { status: 500 });
  }
}
