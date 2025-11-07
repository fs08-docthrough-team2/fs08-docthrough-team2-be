-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "attend_id" TEXT;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_attend_id_fkey" FOREIGN KEY ("attend_id") REFERENCES "Attend"("attend_id") ON DELETE SET NULL ON UPDATE CASCADE;
