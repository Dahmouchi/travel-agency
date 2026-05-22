/*
  Warnings:

  - The `status` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "status",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ReviewAI" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "rating" INTEGER,
    "sentiment" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewAI_reservationId_key" ON "ReviewAI"("reservationId");

-- AddForeignKey
ALTER TABLE "ReviewAI" ADD CONSTRAINT "ReviewAI_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
