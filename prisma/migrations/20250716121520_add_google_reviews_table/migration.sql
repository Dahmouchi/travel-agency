-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorUrl" TEXT,
    "profilePhotoUrl" TEXT,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "time" TIMESTAMP(3) NOT NULL,
    "language" TEXT,
    "originalText" TEXT,
    "responseText" TEXT,
    "responseTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoogleReview_rating_idx" ON "GoogleReview"("rating");

-- CreateIndex
CREATE INDEX "GoogleReview_time_idx" ON "GoogleReview"("time");
