-- AlterTable
ALTER TABLE "user" ADD COLUMN     "itchId" INTEGER,
ADD COLUMN     "itchUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_itchId_key" ON "user"("itchId");

-- CreateIndex
CREATE UNIQUE INDEX "user_itchUsername_key" ON "user"("itchUsername");

