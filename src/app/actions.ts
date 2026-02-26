"use server";

import { prisma } from "@/src/lib/db";

/**
 * Server Action: recordStoryRead
 *
 * Dipanggil saat user klik "Selesai Membaca".
 * Menambah totalReads pada story yang bersangkutan.
 */
export async function recordStoryRead(storyId: number): Promise<void> {
  await prisma.story.update({
    where: { id: storyId },
    data: { totalReads: { increment: 1 } },
  });
}

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

/**
 * Server Action: recordPerfectRead
 *
 * Dipanggil saat user selesai membaca cerita tanpa salah (skor 100%).
 * Untuk setiap kana di cerita yang punya "hutang" (wrongCount/clickCount > 0),
 * kurangi 1: wrongCount diprioritaskan, lalu baru clickCount.
 * Ini mekanisme "pembayaran hutang" bacaan.
 *
 * @param chars - Array karakter unik kana yang muncul di cerita
 */
export async function recordPerfectRead(chars: string[]): Promise<void> {
  if (chars.length === 0) return;

  const records = await prisma.learningProgress.findMany({
    where: { character: { in: chars } },
    select: { character: true, clickCount: true, wrongCount: true },
  });

  const updates = records
    .filter((r) => r.wrongCount > 0 || r.clickCount > 0)
    .map((r) => {
      if (r.wrongCount > 0) {
        return prisma.learningProgress.update({
          where: { character: r.character },
          data: { wrongCount: { decrement: 1 } },
        });
      }
      return prisma.learningProgress.update({
        where: { character: r.character },
        data: { clickCount: { decrement: 1 } },
      });
    });

  await Promise.all(updates);
}
