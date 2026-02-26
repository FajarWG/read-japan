import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@/app/generated/prisma/client";

/**
 * Singleton Prisma Client.
 *
 * Pada development, Next.js melakukan hot-reload yang menyebabkan banyak
 * instance PrismaClient terbuat. Pola ini menyimpan satu instance di
 * `globalThis` agar tetap di-reuse antar reload.
 *
 * Prisma v7 + Next.js App Router (serverless): gunakan PrismaNeonHttp
 * (HTTP-based, stateless) bukan PrismaNeon (WebSocket) — koneksi WebSocket
 * tidak bertahan di environment serverless short-lived.
 *
 * Referensi: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeonHttp(connectionString, {});
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
