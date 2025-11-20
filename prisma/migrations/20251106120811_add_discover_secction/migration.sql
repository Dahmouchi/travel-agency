-- AlterTable
ALTER TABLE "Landing" ADD COLUMN     "discover" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "discoverSubtitle" TEXT,
ADD COLUMN     "discoverTitle" TEXT;
