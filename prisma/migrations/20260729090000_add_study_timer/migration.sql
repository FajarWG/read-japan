-- CreateTable
CREATE TABLE "StudyTimerSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kakouSessionId" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'KAKOU',
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "activeKey" TEXT,
    "accumulatedSeconds" INTEGER NOT NULL DEFAULT 0,
    "lastStartedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyTimerSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyTimerSession_kakouSessionId_key" ON "StudyTimerSession"("kakouSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyTimerSession_activeKey_key" ON "StudyTimerSession"("activeKey");

-- CreateIndex
CREATE INDEX "StudyTimerSession_userId_startedAt_idx" ON "StudyTimerSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "StudyTimerSession_userId_status_idx" ON "StudyTimerSession"("userId", "status");

-- AddForeignKey
ALTER TABLE "StudyTimerSession" ADD CONSTRAINT "StudyTimerSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyTimerSession" ADD CONSTRAINT "StudyTimerSession_kakouSessionId_fkey" FOREIGN KEY ("kakouSessionId") REFERENCES "KakouSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
