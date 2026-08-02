import { NextRequest, NextResponse } from "next/server";
import { recordUserConfusion } from "@/src/modules/adaptive/services/adaptiveService";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { expectedKanji, selectedKanji } = body;

    if (!expectedKanji || !selectedKanji || expectedKanji === selectedKanji) {
      return NextResponse.json({ success: false });
    }

    await recordUserConfusion(session.id, expectedKanji, selectedKanji);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/adaptive/review-event:", error);
    return NextResponse.json({ error: "Failed to record review event" }, { status: 500 });
  }
}
