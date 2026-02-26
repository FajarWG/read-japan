"use server";

import { prisma } from "@/src/lib/db";

/**
 * Server Action: recordClick
 *
 * Dipanggil saat user mengklik huruf kana di Reader.
 * Melakukan upsert ke tabel LearningProgress:
 *   - Jika huruf belum ada → buat baru dengan clickCount = 1
 *   - Jika sudah ada       → tambah clickCount + 1, update lastSeen
 *
 * @param char - Karakter / kluster kana (contoh: 'じゅ', 'ア', 'は')
 */
export async function recordClick(char: string): Promise<void> {
  await prisma.learningProgress.upsert({
    where: { character: char },
    update: {
      clickCount: { increment: 1 },
    },
    create: {
      character: char,
      clickCount: 1,
    },
  });
}

/**
 * Server Action: recordWrongReads
 *
 * Dipanggil setelah user submit hasil review.
 * Menambah wrongCount untuk setiap huruf yang ditandai salah dibaca.
 *
 * @param chars - Array karakter unik yang ditandai salah (contoh: ['か', 'ゅ'])
 */
export async function recordWrongReads(chars: string[]): Promise<void> {
  if (chars.length === 0) return;
  await Promise.all(
    chars.map((char) =>
      prisma.learningProgress.upsert({
        where: { character: char },
        update: {
          wrongCount: { increment: 1 },
        },
        create: {
          character: char,
          clickCount: 0,
          wrongCount: 1,
        },
      }),
    ),
  );
}
