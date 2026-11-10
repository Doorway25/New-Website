-- Separate Presented-by brand logo for Shorts section (Banner uses brandLogoUrl)
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "shortsBrandLogoUrl" TEXT;
