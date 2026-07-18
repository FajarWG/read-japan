import fs from "fs";
import path from "path";
import { prisma } from "../src/shared/lib/db";

type Example = { word: string; yomi: string; imi: string };

async function main() {
  const jsonPath = path.join(process.cwd(), "src/helper/kanji_tamago.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const chapters = JSON.parse(rawData);

  // Optional example-usage map: { [moji]: Example[] }, generated separately.
  const examplesPath = path.join(
    process.cwd(),
    "src/helper/kanji_tamago_examples.json",
  );
  let examplesMap: Record<string, Example[]> = {};
  if (fs.existsSync(examplesPath)) {
    try {
      examplesMap = JSON.parse(fs.readFileSync(examplesPath, "utf-8"));
    } catch (err) {
      console.warn("Could not parse kanji_tamago_examples.json, skipping:", err);
    }
  }
  const getExamples = (moji: string): Example[] | undefined => {
    const ex = examplesMap[moji];
    return ex && ex.length > 0 ? ex : undefined;
  };

  console.log("Starting Kanji Tamago import...");

  let count = 0;
  for (const chapter of chapters) {
    const ka = String(chapter.ka);
    const topic = chapter.topik;

    // teishutsu_kanji
    if (chapter.teishutsu_kanji && chapter.teishutsu_kanji.kanji) {
      for (const item of chapter.teishutsu_kanji.kanji) {
        await prisma.kanjiTamago.upsert({
          where: {
            chapter_category_moji: {
              chapter: ka,
              category: "teishutsu_kanji",
              moji: item.moji,
            },
          },
          update: {
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
          create: {
            chapter: ka,
            category: "teishutsu_kanji",
            moji: item.moji,
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
        });
        count++;
      }
    }

    // yomeru
    if (chapter.yomeru && chapter.yomeru.kata) {
      for (const item of chapter.yomeru.kata) {
        await prisma.kanjiTamago.upsert({
          where: {
            chapter_category_moji: {
              chapter: ka,
              category: "yomeru",
              moji: item.moji,
            },
          },
          update: {
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
          create: {
            chapter: ka,
            category: "yomeru",
            moji: item.moji,
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
        });
        count++;
      }
    }

    // mite_wakaru
    if (chapter.mite_wakaru && chapter.mite_wakaru.kata) {
      for (const item of chapter.mite_wakaru.kata) {
        await prisma.kanjiTamago.upsert({
          where: {
            chapter_category_moji: {
              chapter: ka,
              category: "mite_wakaru",
              moji: item.moji,
            },
          },
          update: {
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
          create: {
            chapter: ka,
            category: "mite_wakaru",
            moji: item.moji,
            topic,
            yomi: item.yomi,
            imi: item.imi,
            examples: getExamples(item.moji) ?? undefined,
          },
        });
        count++;
      }
    }
  }

  console.log(`Kanji Tamago import completed. Inserted/updated ${count} records!`);
}

main()
  .catch((err) => {
    console.error("Error during import:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
