#!/usr/bin/env bun
/**
 * Seed 45 cerita Dekiru Nihongo (3 cerita × 15 bab) ke database.
 *
 * Usage:
 *   bun scripts/seed-dekiru-stories.ts
 *
 * - Upsert by (chapter, point): kalau sudah ada, di-skip.
 * - Aman dijalankan berulang kali.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client";

interface BatchStory {
  title: string;
  content: string;
  translation?: string;
  focus?: string;
  chapter?: number;
  point?: number;
}

async function main() {
  const filePath = join(process.cwd(), "scripts", "dekiru-stories.json");
  const stories = JSON.parse(readFileSync(filePath, "utf8")) as BatchStory[];

  console.log(`📦 Loaded ${stories.length} stories from ${filePath}`);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {});
  const prisma = new PrismaClient({ adapter });

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const s of stories) {
    if (typeof s.chapter !== "number" || typeof s.point !== "number") {
      console.warn(`⚠️  Skipping "${s.title}": missing chapter/point`);
      failed += 1;
      continue;
    }

    try {
      const existing = await prisma.story.findUnique({
        where: { chapter_point: { chapter: s.chapter, point: s.point } },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      await prisma.story.create({
        data: {
          title: s.title.trim(),
          content: s.content.trim(),
          translation: s.translation?.trim() || undefined,
          focus: s.focus?.trim() || undefined,
          chapter: s.chapter,
          point: s.point,
        },
      });
      created += 1;
      console.log(`✅ Ch${s.chapter}.P${s.point}: ${s.title}`);
    } catch (err) {
      failed += 1;
      console.error(
        `❌ Failed to seed "${s.title}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log("\n── Summary ──");
  console.log(`  Created:  ${created}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Failed:   ${failed}`);
  console.log(`  Total:    ${stories.length}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});