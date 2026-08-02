import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";
import { getLastUserActivity } from "@/src/modules/journey/services/journeyService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const continueState = await getLastUserActivity(session?.id);
    return NextResponse.json({ continueState });
  } catch (error) {
    console.error("Error in GET /api/journey/continue:", error);
    return NextResponse.json({ error: "Failed to fetch continue state" }, { status: 500 });
  }
}
