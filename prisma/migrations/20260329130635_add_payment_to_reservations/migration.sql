-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'RECEIPT_RECEIVED', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "paymentReceipt" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "receiptSentAt" TIMESTAMP(3);
