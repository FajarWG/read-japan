import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getUserActiveGoal } from "@/src/modules/goals/services/goalService";
import { prisma } from "@/src/shared/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const goal = await getUserActiveGoal(session?.id);
    return NextResponse.json({ goal });
  } catch (error) {
    console.error("Error in GET /api/goals:", error);
    return NextResponse.json({ error: "Failed to fetch active goal" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, targetLevel, durationDays, examDate } = body;

    const days = Number(durationDays) || 90;
    const targetDate = examDate ? new Date(examDate) : new Date(Date.now() + days * 86400000);

    // Deactivate previous active goals
    await prisma.goal.updateMany({
      where: { userId: session.id, status: "ACTIVE" },
      data: { status: "PAUSED" },
    });

    const newGoal = await prisma.goal.create({
      data: {
        userId: session.id,
        type: type || "JLPT_N4",
        targetLevel: targetLevel || "N4",
        targetDate,
        examDate: examDate ? new Date(examDate) : targetDate,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, goal: newGoal });
  } catch (error) {
    console.error("Error in POST /api/goals:", error);
    return NextResponse.json({ error: "Failed to save target goal" }, { status: 500 });
  }
}
