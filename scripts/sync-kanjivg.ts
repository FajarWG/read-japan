import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const KANJIVG_SOURCE_DIR = path.join(DATA_DIR, "kanjivg", "kanji");
const PUBLIC_KANJIVG_DIR = path.join(process.cwd(), "public", "kanjivg");

async function main() {
  let sourceDir = KANJIVG_SOURCE_DIR;
  if (!fs.existsSync(sourceDir)) {
    // Check fallback path if repo extracted directly
    const altPath = path.join(DATA_DIR, "kanjivg");
    if (fs.existsSync(altPath)) {
      sourceDir = altPath;
    } else {
      console.error(`KanjiVG directory not found at ${KANJIVG_SOURCE_DIR}. Please run download-datasets.ts first.`);
      process.exit(1);
    }
  }

  if (!fs.existsSync(PUBLIC_KANJIVG_DIR)) {
    fs.mkdirSync(PUBLIC_KANJIVG_DIR, { recursive: true });
  }

  console.log(`Syncing SVG files from ${sourceDir} to ${PUBLIC_KANJIVG_DIR}...`);

  const files = fs.readdirSync(sourceDir);
  let count = 0;

  for (const file of files) {
    if (file.endsWith(".svg")) {
      const srcFile = path.join(sourceDir, file);
      const destFile = path.join(PUBLIC_KANJIVG_DIR, file.toLowerCase());
      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  }

  console.log(`Successfully synced ${count} KanjiVG SVG stroke order files to /public/kanjivg/!`);
}

main().catch((err) => {
  console.error("Error syncing KanjiVG files:", err);
  process.exit(1);
});
