-- CreateTable
CREATE TABLE "KanjiDictionary" (
    "id" SERIAL NOT NULL,
    "kanji" TEXT NOT NULL,
    "hiragana" TEXT NOT NULL,
    "meaningId" TEXT,
    "meaningEn" TEXT,
    "chapter" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KanjiDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KanjiDictionary_kanji_hiragana_key" ON "KanjiDictionary"("kanji", "hiragana");