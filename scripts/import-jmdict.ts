import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "../src/shared/lib/db";

const DATA_DIR = path.join(process.cwd(), "data");

function getJmdictPath(): string {
  const p1 = path.join(DATA_DIR, "JMdict_e.xml");
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(DATA_DIR, "JMdict_e");
  if (fs.existsSync(p2)) return p2;
  return p1;
}

function toArray<T>(item: T | T[] | undefined): T[] {
  if (item === undefined || item === null) return [];
  return Array.isArray(item) ? item : [item];
}

async function main() {
  const jmdictPath = getJmdictPath();
  if (!fs.existsSync(jmdictPath)) {
    console.error(`File not found: ${jmdictPath}. Please run download-datasets.ts first.`);
    process.exit(1);
  }

  console.log(`Reading ${jmdictPath}...`);
  const xmlContent = fs.readFileSync(jmdictPath, "utf-8");

  console.log("Parsing XML...");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: false,
  });

  const parsed = parser.parse(xmlContent);
  const entries = toArray(parsed?.JMdict?.entry);
  console.log(`Found ${entries.length} vocabulary entries in JMdict.`);

  const records = [];

  for (const entry of entries) {
    const entrySeq = Number(entry.ent_seq);
    if (!entrySeq) continue;

    const kElements = toArray(entry.k_ele);
    const rElements = toArray(entry.r_ele);

    const kanjiText = kElements.length > 0 && kElements[0]?.keb
      ? String(kElements[0].keb)
      : (rElements[0]?.reb ? String(rElements[0].reb) : "");

    const readingText = rElements.length > 0 && rElements[0]?.reb
      ? String(rElements[0].reb)
      : "";

    if (!kanjiText || !readingText) continue;

    const senses = toArray(entry.sense);
    const meaningsList: { pos: string[]; glosses: string[] }[] = [];

    for (const sense of senses) {
      const pos = toArray(sense.pos).map((p) => String(p));
      const glosses = toArray(sense.gloss)
        .map((g) => (typeof g === "object" ? g["#text"] : g))
        .filter(Boolean)
        .map((g) => String(g));

      if (glosses.length > 0) {
        meaningsList.push({ pos, glosses });
      }
    }

    records.push({
      entrySeq,
      kanji: kanjiText,
      reading: readingText,
      meanings: JSON.stringify(meaningsList),
      jlpt: null,
    });
  }

  console.log(`Prepared ${records.length} vocabulary records. Importing into PostgreSQL...`);

  const BATCH_SIZE = 1000;
  let importedCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    await prisma.vocabulary.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    importedCount += chunk.length;
    if (importedCount % 10000 === 0 || importedCount === records.length) {
      console.log(`Progress: ${importedCount} / ${records.length} vocabularies processed.`);
    }
  }

  console.log("JMdict import successfully completed!");
}

main()
  .catch((err) => {
    console.error("Error during JMdict import:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
