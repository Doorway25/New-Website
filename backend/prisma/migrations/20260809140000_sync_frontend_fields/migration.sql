-- Align Branch + University fields with frontend content
ALTER TABLE "University" ADD COLUMN IF NOT EXISTS "studentLife" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "University" ADD COLUMN IF NOT EXISTS "accommodation" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "University" ADD COLUMN IF NOT EXISTS "campus" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Branch" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Branch" ADD COLUMN IF NOT EXISTS "details" TEXT[] DEFAULT ARRAY[]::TEXT[];
