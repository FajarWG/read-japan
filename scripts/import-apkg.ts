// @ts-ignore
import { Database } from "bun:sqlite";
import { prisma } from "../src/shared/lib/db";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function main() {
  const apkgPath = path.join(process.cwd(), "public/deck.apkg");
  const tempDir = path.join(process.cwd(), "public/temp_anki");
  const mediaDir = path.join(process.cwd(), "public/anki-media");

  console.log("Starting Anki .apkg import...");

  // 1. Ensure output folders exist
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // 2. Unzip .apkg to temp directory
  console.log("Extracting .apkg archive...");
  execSync(`unzip -o "${apkgPath}" -d "${tempDir}"`);

  const mediaJsonPath = path.join(tempDir, "media");
  const dbPath = path.join(tempDir, "collection.anki21");

  if (!fs.existsSync(mediaJsonPath)) {
    throw new Error("Could not find media mapping file in .apkg");
  }
  if (!fs.existsSync(dbPath)) {
    throw new Error("Could not find collection.anki21 database in .apkg");
  }

  // 3. Read media mapping JSON
  console.log("Reading media mapping...");
  const mediaJsonContent = fs.readFileSync(mediaJsonPath, "utf-8");
  const mediaMap = JSON.parse(mediaJsonContent) as Record<string, string>;

  // 4. Copy and rename media files
  console.log("Processing and copying media files...");
  let copiedCount = 0;
  for (const [key, originalName] of Object.entries(mediaMap)) {
    const srcFile = path.join(tempDir, key);
    const destFile = path.join(mediaDir, originalName);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      copiedCount++;
    }
  }
  console.log(`Successfully copied ${copiedCount} media files to public/anki-media/`);

  // 5. Open SQLite Database
  console.log("Opening SQLite collection database...");
  const sqliteDb = new Database(dbPath);

  // 6. Query and Parse notes
  console.log("Fetching notes from SQLite...");
  const notes = sqliteDb.query("SELECT id, flds FROM notes").all() as Array<{ id: number; flds: string }>;
  console.log(`Found ${notes.length} notes to process.`);

  // Regex helpers to clean up sounds and images
  const soundRegex = /\[sound:(.+?)\]/;
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;

  function extractSound(text: string): string | null {
    if (!text) return null;
    const match = soundRegex.exec(text);
    return match ? match[1] : null;
  }

  function extractImage(text: string): string | null {
    if (!text) return null;
    const match = imgRegex.exec(text);
    return match ? match[1] : null;
  }

  function cleanHtml(text: string): string {
    if (!text) return "";
    return text.replace(/\[sound:.+?\]/g, "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ").trim();
  }

  function cleanPlainHtml(text: string): string {
    if (!text) return "";
    return text.replace(/\[sound:.+?\]/g, "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ").replace(/<br\s*\/?>/gi, "\n").trim();
  }

  // 7. Clear existing custom cards under deck "JLPT N5-N4" before inserting to prevent duplicate keys
  const deckName = "JLPT N5-N4";
  console.log(`Clearing existing cards for deck: ${deckName} in PostgreSQL...`);
  await prisma.ankiCard.deleteMany({
    where: { deckName }
  });

  // 8. Insert into Prisma AnkiCard
  console.log("Inserting cards into database...");
  let insertedCount = 0;

  const cardDataList = [];

  for (const note of notes) {
    const fields = note.flds.split("\x1f");
    if (fields.length < 3) continue;

    const kanji = cleanPlainHtml(fields[0]);
    const hiragana = cleanPlainHtml(fields[1]);
    const translation = cleanPlainHtml(fields[2]);

    // Skip the dummy card warning & welcome card
    if (kanji.includes("Please update to the latest Anki version") || String(note.id) === "1708637439853") continue;

    // Field 4: Word Audio
    const audio = extractSound(fields[4]);

    // Field 5: Sentence example
    const sentence = cleanHtml(fields[5]);

    // Field 6: Sentence translation
    const sentenceTranslation = cleanPlainHtml(fields[6]);

    // Field 8: Sentence Audio
    const sentenceAudio = extractSound(fields[8]);

    // Field 13: Picture
    const image = extractImage(fields[13]);

    cardDataList.push({
      id: String(note.id),
      deckName,
      kanji,
      hiragana,
      translation,
      audio,
      sentence,
      sentenceTranslation,
      sentenceAudio,
      image
    });
  }

  // Insert in batches of 100 to prevent query parameter limits
  const batchSize = 100;
  for (let i = 0; i < cardDataList.length; i += batchSize) {
    const batch = cardDataList.slice(i, i + batchSize);
    await prisma.ankiCard.createMany({
      data: batch
    });
    insertedCount += batch.length;
    console.log(`Saved batch ${i / batchSize + 1}/${Math.ceil(cardDataList.length / batchSize)} (${insertedCount}/${cardDataList.length})`);
  }

  console.log(`Successfully imported ${insertedCount} Anki cards into database.`);

  // 9. Clean up temp folder
  console.log("Cleaning up temporary extraction files...");
  sqliteDb.close();
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log("Cleanup completed. Import finished successfully!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Import script failed:", err);
  process.exit(1);
});
