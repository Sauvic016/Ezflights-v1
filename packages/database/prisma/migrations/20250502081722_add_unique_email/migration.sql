/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "id" SET DEFAULT generate_custom_id('EZ'::text, 1::smallint, 5::smallint);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
