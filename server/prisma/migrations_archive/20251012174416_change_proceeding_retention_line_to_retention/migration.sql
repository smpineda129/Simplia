/*
  Warnings:

  - You are about to drop the column `retention_line_id` on the `proceedings` table. All the data in the column will be lost.
  - Added the required column `retention_id` to the `proceedings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "proceedings" DROP CONSTRAINT "proceedings_retention_line_id_fkey";

-- AlterTable
ALTER TABLE "proceedings" DROP COLUMN "retention_line_id",
ADD COLUMN     "retention_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "proceedings" ADD CONSTRAINT "proceedings_retention_id_fkey" FOREIGN KEY ("retention_id") REFERENCES "retentions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
