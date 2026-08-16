-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "asset_type" VARCHAR(32) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "storage_reference" TEXT NOT NULL,
    "lifecycle" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
