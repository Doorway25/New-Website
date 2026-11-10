-- AlterTable: uploadable country flag image
ALTER TABLE "Country" ADD COLUMN IF NOT EXISTS "flagUrl" TEXT;

-- Flag code is optional when flagUrl is set (keep for fallback)
ALTER TABLE "Country" ALTER COLUMN "code" SET DEFAULT '';
UPDATE "Country" SET "code" = '' WHERE "code" IS NULL;
