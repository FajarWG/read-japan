import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getUserActiveGoal, getTodayMissions } from "@/src/modules/goals/services/goalService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const [goal, missions] = await Promise.all([
      getUserActiveGoal(session?.id),
      getTodayMissions(session?.id),
    ]);

    return NextResponse.json({
      goal,
      missions,
    });
  } catch (error) {
    console.error("Error in GET /api/planner/today:", error);
    return NextResponse.json({ error: "Failed to fetch today planner" }, { status: 500 });
  }
}
