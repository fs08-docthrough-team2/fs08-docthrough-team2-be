/*
  Warnings:

  - A unique constraint covering the columns `[challenge_no]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "challenge_no" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_challenge_no_key" ON "Challenge"("challenge_no");
