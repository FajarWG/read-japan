import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { prisma } from "@/src/shared/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { missionId, completed } = body;

    if (!missionId) {
      return NextResponse.json({ error: "Mission ID is required" }, { status: 400 });
    }

    const existingMission = await prisma.dailyMission.findUnique({
      where: { id: Number(missionId) },
    });

    if (!existingMission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const isCompleted = Boolean(completed);
    const updated = await prisma.dailyMission.update({
      where: { id: Number(missionId) },
      data: {
        completed: isCompleted,
        currentCount: isCompleted ? existingMission.targetCount : 0,
      },
    });

    return NextResponse.json({ success: true, mission: updated });
  } catch (error) {
    console.error("Error in POST /api/missions/complete:", error);
    return NextResponse.json({ error: "Failed to update mission" }, { status: 500 });
  }
}
