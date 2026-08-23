-- UXP-01B: evolve the existing Knowledge-to-Media association in place.
-- Existing rows are preserved as deterministic legacy GALLERY/STILL placements.

ALTER TABLE "knowledge_resource_asset_references"
  ADD COLUMN "role" VARCHAR(32),
  ADD COLUMN "playback" VARCHAR(32),
  ADD COLUMN "position" INTEGER,
  ADD COLUMN "alt_text" TEXT,
  ADD COLUMN "caption" TEXT,
  ADD COLUMN "poster_asset_id" UUID;

WITH ranked AS (
  SELECT
    "knowledge_resource_id",
    "asset_id",
    (ROW_NUMBER() OVER (
      PARTITION BY "knowledge_resource_id"
      ORDER BY "asset_id"
    ) - 1)::INTEGER AS "position"
  FROM "knowledge_resource_asset_references"
)
UPDATE "knowledge_resource_asset_references" AS reference
SET
  "role" = 'GALLERY',
  "playback" = 'STILL',
  "position" = ranked."position"
FROM ranked
WHERE
  reference."knowledge_resource_id" = ranked."knowledge_resource_id"
  AND reference."asset_id" = ranked."asset_id";

ALTER TABLE "knowledge_resource_asset_references"
  ALTER COLUMN "role" SET NOT NULL,
  ALTER COLUMN "playback" SET NOT NULL,
  ALTER COLUMN "position" SET NOT NULL;

CREATE UNIQUE INDEX "knowledge_resource_asset_references_knowledge_resource_id_position_key"
  ON "knowledge_resource_asset_references"("knowledge_resource_id", "position");

CREATE INDEX "knowledge_resource_asset_references_poster_asset_id_idx"
  ON "knowledge_resource_asset_references"("poster_asset_id");

ALTER TABLE "knowledge_resource_asset_references"
  ADD CONSTRAINT "knowledge_resource_asset_references_poster_asset_id_fkey"
  FOREIGN KEY ("poster_asset_id")
  REFERENCES "media_assets"("id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
