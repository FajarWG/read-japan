import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json({ folders: {} });
    }

    const folders = fs.readdirSync(audioDir);
    const result: Record<string, string[]> = {};

    for (const folder of folders) {
      const folderPath = path.join(audioDir, folder);
      const stat = fs.statSync(folderPath);
      
      // Pastikan itu adalah direktori
      if (stat.isDirectory()) {
        const files = fs.readdirSync(folderPath);
        const mp3s = files
          .filter((file) => file.toLowerCase().endsWith(".mp3"))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
        
        if (mp3s.length > 0) {
          result[folder] = mp3s.map((file) => `/audio/${folder}/${file}`);
        }
      }
    }

    return NextResponse.json({ folders: result });
  } catch (error) {
    console.error("Error reading audio files:", error);
    return NextResponse.json(
      { error: "Failed to read audio files" },
      { status: 500 }
    );
  }
}
