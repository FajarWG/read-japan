-- Kakou redesign: drop the manual "mark lesson as read" table and the dead
-- sentence-scramble question bank. KatsuyouReviewCard / BunpouProgress are
-- kept (repurposed as the single Kakou-driven progress source) but their
-- existing rows are wiped separately, per explicit user confirmation.

-- DropForeignKey
ALTER TABLE "KatsuyouLessonProgress" DROP CONSTRAINT "KatsuyouLessonProgress_userId_fkey";

-- DropTable
DROP TABLE "BunpouQuestion";

-- DropTable
DROP TABLE "KatsuyouLessonProgress";
