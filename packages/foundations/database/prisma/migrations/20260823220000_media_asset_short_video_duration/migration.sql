-- UXP-01D: add optional Media-owned duration metadata for bounded short-motion VIDEO.
-- Existing Assets remain valid with NULL duration metadata.

ALTER TABLE "media_assets"
  ADD COLUMN "duration_ms" INTEGER;

ALTER TABLE "media_assets"
  ADD CONSTRAINT "media_assets_duration_ms_positive_check"
  CHECK ("duration_ms" IS NULL OR "duration_ms" > 0);
