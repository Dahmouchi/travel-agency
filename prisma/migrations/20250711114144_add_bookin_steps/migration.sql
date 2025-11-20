-- AlterTable
ALTER TABLE "Landing" ADD COLUMN     "internationalTitle" TEXT,
ADD COLUMN     "nationalTitle" TEXT;

-- CreateTable
CREATE TABLE "BookingSteps" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "orderIndex" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingSteps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingSteps" ADD CONSTRAINT "BookingSteps_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
