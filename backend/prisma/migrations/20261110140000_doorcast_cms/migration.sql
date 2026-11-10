-- CreateTable
CREATE TABLE IF NOT EXISTS "DoorcastSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'main',
    "heroImageUrl" TEXT,
    "showHeroText" BOOLEAN NOT NULL DEFAULT false,
    "tagline" TEXT,
    "presentedBy" TEXT DEFAULT 'EDUCATION DOORWAY',
    "about" TEXT,
    "aboutImageUrl" TEXT,
    "shortsIntro" TEXT,
    "playlistUrl" TEXT,
    "episodesPlaylistId" TEXT,
    "shortsPlaylistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DoorcastSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DoorcastSetting_key_key" ON "DoorcastSetting"("key");

-- CreateTable
CREATE TABLE IF NOT EXISTS "DoorcastVideo" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "duration" TEXT,
    "imageUrl" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'episode',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DoorcastVideo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DoorcastVideo_youtubeId_key" ON "DoorcastVideo"("youtubeId");
CREATE INDEX IF NOT EXISTS "DoorcastVideo_kind_sortOrder_idx" ON "DoorcastVideo"("kind", "sortOrder");
