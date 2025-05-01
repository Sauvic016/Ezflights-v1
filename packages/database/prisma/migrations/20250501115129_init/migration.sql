-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "id" SET DEFAULT generate_custom_id('EZ'::text, 1::smallint, 5::smallint);
