import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Singleton Prisma Client.
 *
 * Pada development, Next.js melakukan hot-reload yang menyebabkan banyak
 * instance PrismaClient terbuat. Pola ini menyimpan satu instance di
 * `globalThis` agar tetap di-reuse antar reload.
 *
 * Strategi adapter:
 * - Jika DATABASE_URL_VPS指向 NeonDB (ada `neon.tech` di hostname)
 *   → pakai `PrismaNeonHttp` (HTTP-based, stateless — untuk serverless).
 * - Selainnya (VPS / PostgreSQL biasa)
 *   → pakai `PrismaPg` (node-postgres, untuk koneksi TCP langsung).
 *
 * Catatan: nama env `DATABASE_URL_VPS` (bukan `DATABASE_URL`) agar
 * tidak bentrok dengan konvensi Vercel/Next.js yang otomatis memetakan
 * `DATABASE_URL`. Dengan nama khusus ini, .env lokal punya kontrol eksplisit.
 *
 * Referensi: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isNeonUrl(url: string): boolean {
  return /neon\.tech|neon\.build/.test(url);
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL_VPS!;
  if (!connectionString) {
    throw new Error("DATABASE_URL_VPS is not set");
  }

  if (isNeonUrl(connectionString)) {
    const adapter = new PrismaNeonHttp(connectionString, {});
    return new PrismaClient({ adapter });
  }

  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}