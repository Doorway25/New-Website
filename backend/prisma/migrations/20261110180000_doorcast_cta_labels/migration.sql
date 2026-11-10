-- Doorcast button / badge labels (CMS-editable)
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "watchNowLabel" TEXT;
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "playAllLabel" TEXT;
ALTER TABLE "DoorcastSetting" ADD COLUMN IF NOT EXISTS "moreStoriesLabel" TEXT;
