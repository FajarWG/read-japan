-- CreateTable
CREATE TABLE "SomatomeResource" (
    "id" SERIAL NOT NULL,
    "book" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "audioUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SomatomeResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SomatomeQuestion" (
    "id" SERIAL NOT NULL,
    "book" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "mondai" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "correctAnswer" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SomatomeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SomatomeAnswer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SomatomeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SomatomeResource_book_key" ON "SomatomeResource"("book");

-- CreateIndex
CREATE INDEX "SomatomeQuestion_book_day_idx" ON "SomatomeQuestion"("book", "day");

-- CreateIndex
CREATE UNIQUE INDEX "SomatomeQuestion_book_day_mondai_number_key" ON "SomatomeQuestion"("book", "day", "mondai", "number");

-- CreateIndex
CREATE UNIQUE INDEX "SomatomeAnswer_userId_questionId_key" ON "SomatomeAnswer"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "SomatomeAnswer" ADD CONSTRAINT "SomatomeAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SomatomeAnswer" ADD CONSTRAINT "SomatomeAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SomatomeQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
