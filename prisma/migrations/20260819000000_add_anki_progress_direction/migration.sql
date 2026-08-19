-- Progress is tracked independently for each recall direction.
ALTER TABLE "AnkiProgress"
ADD COLUMN "direction" TEXT NOT NULL DEFAULT 'kanji_to_reading';

DROP INDEX "AnkiProgress_userId_cardKey_key";

CREATE UNIQUE INDEX "AnkiProgress_userId_cardKey_direction_key"
ON "AnkiProgress"("userId", "cardKey", "direction");
