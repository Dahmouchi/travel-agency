/*
  Warnings:

  - The primary key for the `_CategoryTours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_HotelTours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_NatureTours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_TourDestinations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_TourServices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CategoryTours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_HotelTours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_NatureTours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_TourDestinations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_TourServices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CategoryTours" DROP CONSTRAINT "_CategoryTours_AB_pkey";

-- AlterTable
ALTER TABLE "_HotelTours" DROP CONSTRAINT "_HotelTours_AB_pkey";

-- AlterTable
ALTER TABLE "_NatureTours" DROP CONSTRAINT "_NatureTours_AB_pkey";

-- AlterTable
ALTER TABLE "_TourDestinations" DROP CONSTRAINT "_TourDestinations_AB_pkey";

-- AlterTable
ALTER TABLE "_TourServices" DROP CONSTRAINT "_TourServices_AB_pkey";

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_tourId_key" ON "Favorite"("userId", "tourId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTours_AB_unique" ON "_CategoryTours"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_HotelTours_AB_unique" ON "_HotelTours"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_NatureTours_AB_unique" ON "_NatureTours"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_TourDestinations_AB_unique" ON "_TourDestinations"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_TourServices_AB_unique" ON "_TourServices"("A", "B");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
