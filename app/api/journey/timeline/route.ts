import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getUserTimeline } from "@/src/modules/journey/services/journeyService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const timeline = await getUserTimeline(session?.id);
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Error in GET /api/journey/timeline:", error);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}
