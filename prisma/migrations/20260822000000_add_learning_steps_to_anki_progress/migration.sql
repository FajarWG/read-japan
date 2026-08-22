-- Add learningSteps field to AnkiProgress
ALTER TABLE "AnkiProgress" ADD COLUMN IF NOT EXISTS "learningSteps" INTEGER NOT NULL DEFAULT 0;
