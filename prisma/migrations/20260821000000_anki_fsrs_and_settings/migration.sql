-- Add FSRS fields to AnkiProgress
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "stability" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "elapsedDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "scheduledDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "reps" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "lapses" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "state" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "lastReview" TIMESTAMP(3);

-- Create AnkiSetting Table
CREATE TABLE IF NOT EXISTS "AnkiSetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dailyNewCardsLimit" INTEGER NOT NULL DEFAULT 20,
    "dailyReviewLimit" TEXT NOT NULL DEFAULT 'unlimited',
    "postMode" TEXT NOT NULL DEFAULT 'card',
    "studyDose" TEXT NOT NULL DEFAULT 'normal',
    "ankiMode" TEXT NOT NULL DEFAULT 'srs',
    "cardStyle" TEXT NOT NULL DEFAULT 'quiz',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnkiSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AnkiSetting_userId_key" ON "AnkiSetting"("userId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AnkiSetting_userId_fkey'
    ) THEN
        ALTER TABLE "AnkiSetting" ADD CONSTRAINT "AnkiSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
