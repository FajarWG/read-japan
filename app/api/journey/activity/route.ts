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
    const { type, refId, metadata } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const log = await prisma.activityLog.create({
      data: {
        userId: session.id,
        type,
        refId: refId ? String(refId) : null,
        metadata: metadata || undefined,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Error in POST /api/journey/activity:", error);
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
