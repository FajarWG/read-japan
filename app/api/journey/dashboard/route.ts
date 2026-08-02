import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import {
  getLastUserActivity,
  getUserTimeline,
  getCrossModuleRecommendations,
} from "@/src/modules/journey/services/journeyService";
import { prisma } from "@/src/shared/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.id;

    const [continueState, timeline, recommendations] = await Promise.all([
      getLastUserActivity(userId),
      getUserTimeline(userId),
      getCrossModuleRecommendations(userId),
    ]);

    let srsDueCount = 0;
    let weakKanjiCount = 0;

    if (userId) {
      const now = new Date();
      srsDueCount = await prisma.ankiProgress.count({
        where: { userId, dueDate: { lte: now } },
      });

      const confusions = await prisma.userKanjiConfusion.count({
        where: { userId },
      });
      weakKanjiCount = confusions;
    }

    return NextResponse.json({
      continueState,
      timeline,
      recommendations,
      stats: {
        srsDueCount,
        weakKanjiCount,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/journey/dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch journey dashboard details" },
      { status: 500 }
    );
  }
}
