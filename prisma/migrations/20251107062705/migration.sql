-- AlterTable
ALTER TABLE "Attend" ADD COLUMN     "delete_reason" TEXT,
ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "adminId" TEXT;
