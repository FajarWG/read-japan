import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "../src/shared/lib/db";

const DATA_DIR = path.join(process.cwd(), "data");
const KANJIDIC_PATH = path.join(DATA_DIR, "kanjidic2.xml");

function toArray<T>(item: T | T[] | undefined): T[] {
  if (item === undefined || item === null) return [];
  return Array.isArray(item) ? item : [item];
}

async function main() {
  if (!fs.existsSync(KANJIDIC_PATH)) {
    console.error(`File not found: ${KANJIDIC_PATH}. Please run download-datasets.ts first.`);
    process.exit(1);
  }

  console.log("Reading kanjidic2.xml...");
  const xmlContent = fs.readFileSync(KANJIDIC_PATH, "utf-8");

  console.log("Parsing XML...");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xmlContent);
  const characters = toArray(parsed?.kanjidic2?.character);
  console.log(`Found ${characters.length} kanji characters in KANJIDIC2.`);

  const records = [];

  for (const char of characters) {
    const literal = char.literal;
    if (!literal) continue;

    // Unicode codepoint (UCS)
    let unicodeHex = "";
    const codepoints = toArray(char.codepoint?.cp_value);
    for (const cp of codepoints) {
      if (typeof cp === "object" && cp["@_cp_type"] === "ucs") {
        unicodeHex = String(cp["#text"]).toLowerCase().padStart(5, "0");
        break;
      } else if (typeof cp === "string" || typeof cp === "number") {
        unicodeHex = String(cp).toLowerCase().padStart(5, "0");
      }
    }
    if (!unicodeHex) {
      unicodeHex = literal.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");
    }

    // Misc data
    const misc = char.misc || {};
    const strokeCount = Array.isArray(misc.stroke_count)
      ? Number(misc.stroke_count[0])
      : Number(misc.stroke_count || 0);
    const grade = misc.grade ? Number(misc.grade) : null;
    const jlpt = misc.jlpt ? Number(misc.jlpt) : null;
    const frequency = misc.freq ? Number(misc.freq) : null;

    // Readings & Meanings
    const rmGroups = toArray(char.reading_meaning?.rmgroup);
    const meanings: string[] = [];
    const onyomi: string[] = [];
    const kunyomi: string[] = [];

    for (const rm of rmGroups) {
      const readingList = toArray(rm.reading);
      for (const r of readingList) {
        if (typeof r === "object") {
          const type = r["@_r_type"];
          const val = r["#text"];
          if (type === "ja_on" && val) onyomi.push(val);
          if (type === "ja_kun" && val) kunyomi.push(val);
        }
      }

      const meaningList = toArray(rm.meaning);
      for (const m of meaningList) {
        if (typeof m === "string") {
          meanings.push(m);
        } else if (typeof m === "object" && !m["@_m_lang"]) {
          // Default language (English)
          if (m["#text"]) meanings.push(m["#text"]);
        }
      }
    }

    records.push({
      literal,
      unicode: unicodeHex,
      strokeCount: strokeCount || 1,
      grade,
      jlpt,
      frequency,
      meanings: JSON.stringify(meanings),
      onyomi: JSON.stringify(onyomi),
      kunyomi: JSON.stringify(kunyomi),
      radicals: JSON.stringify([]),
    });
  }

  console.log(`Prepared ${records.length} records. Importing into PostgreSQL in batches...`);

  // Batch insert (chunk size 500)
  const BATCH_SIZE = 500;
  let importedCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    await prisma.kanji.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    importedCount += chunk.length;
    console.log(`Progress: ${importedCount} / ${records.length} kanji processed.`);
  }

  console.log("KANJIDIC2 import successfully completed!");
}

main()
  .catch((err) => {
    console.error("Error during KANJIDIC2 import:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
