-- Per-section Doorcast logos (hero / about / shorts / brand)
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "heroLogoUrl" TEXT;
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "brandLogoUrl" TEXT;
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "aboutLogoUrl" TEXT;
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "shortsLogoUrl" TEXT;
