/*
  Warnings:

  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "GenderRole" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "id" SET DEFAULT generate_custom_id('EZ'::text, 1::smallint, 5::smallint);

-- AlterTable
ALTER TABLE "Traveler" ADD COLUMN     "gender" "GenderRole" NOT NULL DEFAULT 'MALE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "GenderRole" NOT NULL DEFAULT 'MALE',
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
