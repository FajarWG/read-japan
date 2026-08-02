import { NextRequest, NextResponse } from "next/server";
import { getAdaptiveRecommendations } from "@/src/modules/adaptive/services/adaptiveService";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const recommendations = await getAdaptiveRecommendations(session?.id);
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error in GET /api/adaptive/recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
