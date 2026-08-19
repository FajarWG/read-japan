CREATE TABLE "AnkiReviewEvent" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "cardKey" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "responseTimeMs" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnkiReviewEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AnkiReviewEvent_userId_cardKey_direction_createdAt_idx" ON "AnkiReviewEvent"("userId", "cardKey", "direction", "createdAt");
ALTER TABLE "AnkiReviewEvent" ADD CONSTRAINT "AnkiReviewEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
