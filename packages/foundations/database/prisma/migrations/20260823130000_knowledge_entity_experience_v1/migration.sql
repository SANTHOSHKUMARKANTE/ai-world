CREATE TABLE "knowledge_resource_profiles" (
    "knowledge_resource_id" UUID NOT NULL,
    "route_key" VARCHAR(256) NOT NULL,
    "slug" VARCHAR(96) NOT NULL,
    "display_name" VARCHAR(160) NOT NULL,
    "summary" TEXT NOT NULL,
    "facts" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_resource_profiles_pkey" PRIMARY KEY ("knowledge_resource_id")
);

CREATE UNIQUE INDEX "knowledge_resource_profiles_route_key_key"
ON "knowledge_resource_profiles"("route_key");

CREATE INDEX "knowledge_resource_profiles_slug_idx"
ON "knowledge_resource_profiles"("slug");

ALTER TABLE "knowledge_resource_profiles"
ADD CONSTRAINT "knowledge_resource_profiles_knowledge_resource_id_fkey"
FOREIGN KEY ("knowledge_resource_id")
REFERENCES "knowledge_resources"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE TABLE "knowledge_resource_relations" (
    "source_resource_id" UUID NOT NULL,
    "target_resource_id" UUID NOT NULL,
    "section_key" VARCHAR(128) NOT NULL,
    "relationship_type" VARCHAR(128) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "knowledge_resource_relations_pkey"
    PRIMARY KEY ("source_resource_id", "relationship_type", "target_resource_id"),

    CONSTRAINT "knowledge_resource_relations_position_check"
    CHECK ("position" >= 0)
);

CREATE UNIQUE INDEX "knowledge_resource_relations_source_section_position_key"
ON "knowledge_resource_relations"("source_resource_id", "section_key", "position");

CREATE INDEX "knowledge_resource_relations_target_resource_id_idx"
ON "knowledge_resource_relations"("target_resource_id");

ALTER TABLE "knowledge_resource_relations"
ADD CONSTRAINT "knowledge_resource_relations_source_resource_id_fkey"
FOREIGN KEY ("source_resource_id")
REFERENCES "knowledge_resources"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "knowledge_resource_relations"
ADD CONSTRAINT "knowledge_resource_relations_target_resource_id_fkey"
FOREIGN KEY ("target_resource_id")
REFERENCES "knowledge_resources"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
