-- CreateEnum
CREATE TYPE "TravelRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "TravelRequest" ADD COLUMN     "status" "TravelRequestStatus" NOT NULL DEFAULT 'PENDING';
