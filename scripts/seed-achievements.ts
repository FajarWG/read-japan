#!/usr/bin/env bun
/**
 * Seed default achievements.
 *
 * Idempotent: pakai `code` sebagai natural key. Jalankan ulang aman.
 *
 * Usage:
 *   bun scripts/seed-achievements.ts
 */

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL_VPS!;
if (!url) throw new Error("DATABASE_URL_VPS is not set");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

interface AchievementSeed {
  code: string;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  icon: string;
  threshold?: number;
  metric?: string;
}

const ACHIEVEMENTS: AchievementSeed[] = [
  {
    code: "first_story",
    titleEn: "First Story",
    titleId: "Cerita Pertama",
    descEn: "Read your first story",
    descId: "Membaca cerita pertamamu",
    icon: "📖",
    threshold: 1,
    metric: "stories_read",
  },
  {
    code: "story_collector",
    titleEn: "Story Collector",
    titleId: "Kolektor Cerita",
    descEn: "Read 10 stories",
    descId: "Membaca 10 cerita",
    icon: "📚",
    threshold: 10,
    metric: "stories_read",
  },
  {
    code: "streak_3",
    titleEn: "3-Day Streak",
    titleId: "Streak 3 Hari",
    descEn: "Study 3 days in a row",
    descId: "Belajar 3 hari berturut-turut",
    icon: "🔥",
    threshold: 3,
    metric: "streak_days",
  },
  {
    code: "streak_7",
    titleEn: "7-Day Streak",
    titleId: "Streak 7 Hari",
    descEn: "Study 7 days in a row",
    descId: "Belajar 7 hari berturut-turut",
    icon: "🔥",
    threshold: 7,
    metric: "streak_days",
  },
  {
    code: "streak_30",
    titleEn: "30-Day Streak",
    titleId: "Streak 30 Hari",
    descEn: "Study 30 days in a row",
    descId: "Belajar 30 hari berturut-turut",
    icon: "🔥",
    threshold: 30,
    metric: "streak_days",
  },
  {
    code: "vocab_50",
    titleEn: "Vocab Beginner",
    titleId: "Pemula Kosakata",
    descEn: "Look up 50 unique words",
    descId: "Mencari 50 kata unik",
    icon: "📝",
    threshold: 50,
    metric: "unique_words",
  },
  {
    code: "vocab_200",
    titleEn: "Vocab Master",
    titleId: "Master Kosakata",
    descEn: "Look up 200 unique words",
    descId: "Mencari 200 kata unik",
    icon: "📝",
    threshold: 200,
    metric: "unique_words",
  },
  {
    code: "kana_master",
    titleEn: "Kana Master",
    titleId: "Master Kana",
    descEn: "Master all basic kana through SRS",
    descId: "Menguasai semua kana dasar lewat SRS",
    icon: "あ",
    threshold: 46,
    metric: "kana_mastered",
  },
  {
    code: "perfect_read",
    titleEn: "Perfect Read",
    titleId: "Baca Sempurna",
    descEn: "Complete a story with zero mistakes",
    descId: "Menyelesaikan cerita tanpa kesalahan",
    icon: "⭐",
    threshold: 1,
    metric: "perfect_reads",
  },
  {
    code: "jlpt_n5",
    titleEn: "JLPT N5 Pass",
    titleId: "Lulus JLPT N5",
    descEn: "Score 80%+ on a JLPT N5 mock test",
    descId: "Mendapat skor 80%+ di mock test JLPT N5",
    icon: "🎯",
    threshold: 80,
    metric: "jlpt_n5_pct",
  },
  {
    code: "sentence_miner",
    titleEn: "Sentence Miner",
    titleId: "Penambang Kalimat",
    descEn: "Mine 25 sentences from stories",
    descId: "Menambang 25 kalimat dari cerita",
    icon: "⛏️",
    threshold: 25,
    metric: "sentences_mined",
  },
  {
    code: "bookworm",
    titleEn: "Bookworm",
    titleId: "Kutu Buku",
    descEn: "Create 10 bookmarks",
    descId: "Membuat 10 bookmark",
    icon: "🔖",
    threshold: 10,
    metric: "bookmarks",
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const a of ACHIEVEMENTS) {
    const result = await prisma.achievement.upsert({
      where: { code: a.code },
      update: {
        titleEn: a.titleEn,
        titleId: a.titleId,
        descEn: a.descEn,
        descId: a.descId,
        icon: a.icon,
        threshold: a.threshold ?? null,
        metric: a.metric ?? null,
      },
      create: a,
    });
    if (result.id) {
      // upsert doesn't tell us created vs updated; just count
      created += 1;
    }
  }

  const total = await prisma.achievement.count();
  console.log(`✓ ${ACHIEVEMENTS.length} achievement seeds processed`);
  console.log(`  Total achievements in DB: ${total}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ seed-achievements failed:", err);
  process.exit(1);
});
