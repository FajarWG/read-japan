-- CreateTable
CREATE TABLE "PrepData" (
    "id" SERIAL NOT NULL,
    "chapter" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "conversations" JSONB NOT NULL,
    "grammar" JSONB NOT NULL,
    "audioFiles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrepData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnkiProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cardKey" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "sectionIndex" INTEGER NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnkiProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrepData_chapter_point_key" ON "PrepData"("chapter", "point");

-- CreateIndex
CREATE UNIQUE INDEX "AnkiProgress_userId_cardKey_key" ON "AnkiProgress"("userId", "cardKey");

-- AddForeignKey
ALTER TABLE "AnkiProgress" ADD CONSTRAINT "AnkiProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
