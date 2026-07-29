-- CreateTable
CREATE TABLE "KakouSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "promptIds" JSONB NOT NULL,
    "promptSnapshot" JSONB NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "difficulty" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KakouSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KakouSession_userId_status_updatedAt_idx" ON "KakouSession"("userId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "KakouSession_userId_completedAt_idx" ON "KakouSession"("userId", "completedAt");

-- AddForeignKey
ALTER TABLE "KakouSession" ADD CONSTRAINT "KakouSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
