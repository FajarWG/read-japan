import { prisma } from "../src/shared/lib/db";

async function main() {
  console.log("Fetching all Kanji from database...");
  const kanjiList = await prisma.kanji.findMany({
    select: { id: true, literal: true },
  });

  console.log(`Found ${kanjiList.length} kanji characters. Building relations with vocabulary...`);

  let totalRelations = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < kanjiList.length; i += BATCH_SIZE) {
    const chunk = kanjiList.slice(i, i + BATCH_SIZE);
    const relationsToInsert: { kanjiId: number; vocabularyId: number }[] = [];

    for (const k of chunk) {
      const matchingVocabs = await prisma.vocabulary.findMany({
        where: {
          kanji: {
            contains: k.literal,
          },
        },
        select: { id: true },
        take: 50, // limit per kanji for performance & relevance
      });

      for (const v of matchingVocabs) {
        relationsToInsert.push({
          kanjiId: k.id,
          vocabularyId: v.id,
        });
      }
    }

    if (relationsToInsert.length > 0) {
      await prisma.kanjiVocabulary.createMany({
        data: relationsToInsert,
        skipDuplicates: true,
      });
      totalRelations += relationsToInsert.length;
    }

    if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= kanjiList.length) {
      console.log(`Progress: processed ${Math.min(i + BATCH_SIZE, kanjiList.length)} / ${kanjiList.length} kanji (${totalRelations} relations created).`);
    }
  }

  console.log(`Successfully built ${totalRelations} Kanji <-> Vocabulary relations!`);
}

main()
  .catch((err) => {
    console.error("Error building kanji relations:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
