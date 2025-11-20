/*
  Warnings:

  - Made the column `orderIndex` on table `BookingSteps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `BookingSteps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `BookingSteps` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookingSteps" ALTER COLUMN "orderIndex" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Landing" ADD COLUMN     "thisMountTitle" TEXT;
