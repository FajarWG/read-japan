import { NextResponse } from "next/server";
import { getSession } from "@/src/shared/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Return API key to client for direct WebSocket auth
  // In production, use ephemeral tokens instead
  return NextResponse.json({ apiKey });
}
