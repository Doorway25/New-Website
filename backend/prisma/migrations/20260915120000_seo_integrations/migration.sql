-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "googleTagManagerId" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "googleSiteVerification" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "facebookPixelId" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "bingSiteVerification" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "microsoftClarityId" TEXT;
