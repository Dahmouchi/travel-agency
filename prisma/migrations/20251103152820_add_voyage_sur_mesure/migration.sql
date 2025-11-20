-- CreateTable
CREATE TABLE "TravelRequest" (
    "id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "isFlexible" TEXT NOT NULL DEFAULT 'non',
    "departureCity" TEXT NOT NULL,
    "needsTransport" TEXT NOT NULL DEFAULT 'non',
    "needsFlight" TEXT NOT NULL DEFAULT 'non',
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "accommodationWishes" TEXT,
    "numberOfRooms" INTEGER NOT NULL,
    "accommodationCategory" TEXT NOT NULL DEFAULT 'Standard',
    "budget" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'France (+33)',
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelRequest_pkey" PRIMARY KEY ("id")
);
