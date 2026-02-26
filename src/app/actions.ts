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
      // lastSeen diupdate otomatis via @updatedAt di schema
    },
    create: {
      character: char,
      clickCount: 1,
    },
  });
}
