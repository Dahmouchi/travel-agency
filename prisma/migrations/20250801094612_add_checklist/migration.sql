-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "descriptionCkecklist" TEXT,
ADD COLUMN     "showChecklist" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "titleCkecklist" TEXT;
