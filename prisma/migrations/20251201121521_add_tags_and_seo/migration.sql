/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tour` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "theme" TEXT;

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TourTags_AB_unique" ON "_TourTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TourTags_B_index" ON "_TourTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- AddForeignKey
ALTER TABLE "_TourTags" ADD CONSTRAINT "_TourTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourTags" ADD CONSTRAINT "_TourTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
