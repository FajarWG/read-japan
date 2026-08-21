import { NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getLearningCalendarData } from "@/src/modules/goals/services/goalService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const calendar = await getLearningCalendarData(session?.id);
    return NextResponse.json({ calendar });
  } catch (error) {
    console.error("Error in GET /api/calendar:", error);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}
