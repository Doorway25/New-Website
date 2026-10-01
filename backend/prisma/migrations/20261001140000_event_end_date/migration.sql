-- AlterTable
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);

-- Backfill: single-day events keep start = end
UPDATE "Event" SET "endDate" = "date" WHERE "endDate" IS NULL;
