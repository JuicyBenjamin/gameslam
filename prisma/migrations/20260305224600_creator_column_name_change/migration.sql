/*
  Warnings:

  - You are about to drop the column `createdBy` on the `slam` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `slam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "slam" DROP CONSTRAINT "slam_createdBy_fkey";

-- AlterTable
ALTER TABLE "slam" DROP COLUMN "createdBy",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "slam" ADD CONSTRAINT "slam_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
