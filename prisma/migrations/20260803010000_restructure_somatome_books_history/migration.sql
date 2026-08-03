-- DropForeignKey
ALTER TABLE "SomatomeAnswer" DROP CONSTRAINT "SomatomeAnswer_userId_fkey";
ALTER TABLE "SomatomeAnswer" DROP CONSTRAINT "SomatomeAnswer_questionId_fkey";

-- DropTable
DROP TABLE "SomatomeAnswer";

-- DropTable
DROP TABLE "SomatomeQuestion";

-- DropTable
DROP TABLE "SomatomeResource";

-- CreateTable
CREATE TABLE "SomatomeBook" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SomatomeBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SomatomeQuestion" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "mondai" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "correctAnswer" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SomatomeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SomatomeAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SomatomeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SomatomeQuestion_bookId_day_idx" ON "SomatomeQuestion"("bookId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "SomatomeQuestion_bookId_day_mondai_number_key" ON "SomatomeQuestion"("bookId", "day", "mondai", "number");

-- CreateIndex
CREATE INDEX "SomatomeAttempt_userId_bookId_day_idx" ON "SomatomeAttempt"("userId", "bookId", "day");

-- CreateIndex
CREATE INDEX "SomatomeAttempt_userId_createdAt_idx" ON "SomatomeAttempt"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "SomatomeQuestion" ADD CONSTRAINT "SomatomeQuestion_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "SomatomeBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SomatomeAttempt" ADD CONSTRAINT "SomatomeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SomatomeAttempt" ADD CONSTRAINT "SomatomeAttempt_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "SomatomeBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
