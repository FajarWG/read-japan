import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/db";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.ankiSetting.upsert({
      where: { userId: session.id },
      update: {},
      create: {
        userId: session.id,
        dailyNewCardsLimit: 20,
        dailyReviewLimit: "unlimited",
        postMode: "card",
        studyDose: "normal",
        ankiMode: "srs",
        cardStyle: "quiz",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching Anki settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch Anki settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      dailyNewCardsLimit,
      dailyReviewLimit,
      postMode,
      studyDose,
      ankiMode,
      cardStyle,
    } = body;

    const dataToUpdate: any = {};
    if (typeof dailyNewCardsLimit === "number") {
      dataToUpdate.dailyNewCardsLimit = Math.max(5, Math.min(100, dailyNewCardsLimit));
    }
    if (typeof dailyReviewLimit === "string") {
      dataToUpdate.dailyReviewLimit = dailyReviewLimit;
    }
    if (postMode === "card" || postMode === "session") {
      dataToUpdate.postMode = postMode;
    }
    if (studyDose === "normal" || studyDose === "intensive") {
      dataToUpdate.studyDose = studyDose;
    }
    if (ankiMode === "srs" || ankiMode === "quick") {
      dataToUpdate.ankiMode = ankiMode;
    }
    if (cardStyle === "quiz" || cardStyle === "classic") {
      dataToUpdate.cardStyle = cardStyle;
    }

    const settings = await prisma.ankiSetting.upsert({
      where: { userId: session.id },
      update: dataToUpdate,
      create: {
        userId: session.id,
        dailyNewCardsLimit: dataToUpdate.dailyNewCardsLimit ?? 20,
        dailyReviewLimit: dataToUpdate.dailyReviewLimit ?? "unlimited",
        postMode: dataToUpdate.postMode ?? "card",
        studyDose: dataToUpdate.studyDose ?? "normal",
        ankiMode: dataToUpdate.ankiMode ?? "srs",
        cardStyle: dataToUpdate.cardStyle ?? "quiz",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating Anki settings:", error);
    return NextResponse.json(
      { error: "Failed to update Anki settings" },
      { status: 500 },
    );
  }
}
