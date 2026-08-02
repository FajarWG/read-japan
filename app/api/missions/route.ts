import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getTodayMissions } from "@/src/modules/goals/services/goalService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const missions = await getTodayMissions(session?.id);
    return NextResponse.json({ missions });
  } catch (error) {
    console.error("Error in GET /api/missions:", error);
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 });
  }
}
