/*
  Warnings:

  - A unique constraint covering the columns `[challenge_no]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChallengeStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ChallengeStatus" ADD VALUE 'REJECTED';
ALTER TYPE "ChallengeStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "ChallengeStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "challenge_no" SERIAL NOT NULL,
ADD COLUMN     "isApprove" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_challenge_no_key" ON "Challenge"("challenge_no");
