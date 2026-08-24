-- UXP-02A: deepen the existing generic Knowledge Entity profile.
-- Existing rows remain valid: nullable scalar fields plus an ordered empty-array default.
ALTER TABLE "knowledge_resource_profiles"
  ADD COLUMN "native_name" VARCHAR(160),
  ADD COLUMN "alternate_names" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "overview" TEXT;
