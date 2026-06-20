-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "chapter" INTEGER,
ADD COLUMN     "point" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Story_chapter_point_key" ON "Story"("chapter", "point");