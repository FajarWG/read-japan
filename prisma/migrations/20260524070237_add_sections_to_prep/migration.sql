-- AlterTable
ALTER TABLE "PrepData" ADD COLUMN     "sections" JSONB,
ALTER COLUMN "conversations" DROP NOT NULL;
