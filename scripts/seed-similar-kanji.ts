import { prisma } from "../src/shared/lib/db";

const SIMILAR_PAIRS = [
  { kanji: "未", similarKanji: "末", reason: "Top stroke length: 未 has a shorter top stroke, 末 has a longer top stroke.", difficulty: "Easy" },
  { kanji: "土", similarKanji: "士", reason: "Bottom vs top line length: 土 (earth) has a longer bottom line, 士 (samurai) has a longer top line.", difficulty: "Easy" },
  { kanji: "人", similarKanji: "入", reason: "Stroke angle & overlap: 人 (person) left stroke overlaps top, 入 (enter) right stroke overlaps top.", difficulty: "Easy" },
  { kanji: "日", similarKanji: "曰", reason: "Height ratio: 日 (sun/day) is tall and narrow, 曰 (say) is wider and shorter.", difficulty: "Medium" },
  { kanji: "千", similarKanji: "干", reason: "First stroke: 千 (thousand) starts with a slanted top stroke, 干 (dry) starts with a flat horizontal stroke.", difficulty: "Easy" },
  { kanji: "待", similarKanji: "持", reason: "Left radical: 待 (wait) uses 彳 (step radical), 持 (hold) uses 扌 (hand radical).", difficulty: "Medium" },
  { kanji: "特", similarKanji: "持", reason: "Left radical: 特 (special) uses 牜 (cow radical), 持 (hold) uses 扌 (hand radical).", difficulty: "Medium" },
  { kanji: "右", similarKanji: "左", reason: "First stroke & radical: 右 (right) starts with 𠂇 and 口 below, 左 (left) starts with 𠂇 and 工 below.", difficulty: "Easy" },
  { kanji: "王", similarKanji: "玉", reason: "Dot mark: 玉 (ball/jewel) has a small dot in the lower-right area.", difficulty: "Easy" },
  { kanji: "木", similarKanji: "本", reason: "Cross stroke: 本 (book/origin) has a short horizontal stroke near the bottom of 木 (tree).", difficulty: "Easy" },
  { kanji: "白", similarKanji: "百", reason: "Top stroke: 百 (hundred) has a top horizontal stroke above 白 (white).", difficulty: "Easy" },
  { kanji: "大", similarKanji: "犬", reason: "Dot mark: 犬 (dog) has a dot at the top-right of 大 (big).", difficulty: "Easy" },
  { kanji: "微", similarKanji: "徵", reason: "Center element complexity.", difficulty: "Hard" },
];

async function main() {
  console.log("Seeding SimilarKanji database...");
  let seeded = 0;

  for (const pair of SIMILAR_PAIRS) {
    // Seed both directions (A -> B and B -> A)
    await prisma.similarKanji.upsert({
      where: { kanji_similarKanji: { kanji: pair.kanji, similarKanji: pair.similarKanji } },
      update: { reason: pair.reason, difficulty: pair.difficulty },
      create: { kanji: pair.kanji, similarKanji: pair.similarKanji, reason: pair.reason, difficulty: pair.difficulty },
    });

    await prisma.similarKanji.upsert({
      where: { kanji_similarKanji: { kanji: pair.similarKanji, similarKanji: pair.kanji } },
      update: { reason: pair.reason, difficulty: pair.difficulty },
      create: { kanji: pair.similarKanji, similarKanji: pair.kanji, reason: pair.reason, difficulty: pair.difficulty },
    });

    seeded += 2;
  }

  console.log(`Successfully seeded ${seeded} similar kanji pairs!`);
}

main()
  .catch((err) => {
    console.error("Error seeding similar kanji:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
