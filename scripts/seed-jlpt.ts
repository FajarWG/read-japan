#!/usr/bin/env bun
/**
 * Seed JLPT question bank.
 *
 * Idempotent: hapus dulu semua question lalu insert ulang dari JSON.
 * Hanya N5 yang di-seed di sini; N4/N3 menyusul.
 *
 * Usage: bun scripts/seed-jlpt.ts
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL_VPS!;
if (!url) throw new Error("DATABASE_URL_VPS is not set");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

interface ChoiceSeed {
  id: string;
  text: string;
}

interface QuestionSeed {
  level: string;
  section: string;
  question: string;
  prompt?: string;
  choices: ChoiceSeed[];
  answer: string;
  explanation?: string;
}

async function main() {
  const filePath = join(process.cwd(), "prisma", "seeds", "jlpt-n5.json");
  const raw = readFileSync(filePath, "utf8");
  const questions = JSON.parse(raw) as QuestionSeed[];
  console.log(`📦 Loaded ${questions.length} JLPT N5 questions from ${filePath}`);

  // Hapus dulu N5 yang ada
  const deleted = await prisma.jLPTQuestion.deleteMany({
    where: { level: "N5" },
  });
  console.log(`🗑  Deleted ${deleted.count} existing N5 questions`);

  // Insert ulang
  let created = 0;
  for (const q of questions) {
    await prisma.jLPTQuestion.create({
      data: {
        level: q.level,
        section: q.section,
        question: q.question,
        prompt: q.prompt ?? null,
        choices: q.choices as unknown as object,
        answer: q.answer,
        explanation: q.explanation ?? null,
      },
    });
    created += 1;
  }

  console.log(`✓ Inserted ${created} N5 questions`);

  // Summary per section
  const counts = await prisma.jLPTQuestion.groupBy({
    by: ["section"],
    where: { level: "N5" },
    _count: { _all: true },
  });
  for (const c of counts) {
    console.log(`   ${c.section}: ${c._count._all}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ seed-jlpt failed:", err);
  process.exit(1);
});
