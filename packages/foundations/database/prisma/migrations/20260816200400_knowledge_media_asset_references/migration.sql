CREATE TABLE "knowledge_resource_asset_references" (
    "knowledge_resource_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,

    CONSTRAINT "knowledge_resource_asset_references_pkey"
        PRIMARY KEY ("knowledge_resource_id", "asset_id")
);

CREATE INDEX "knowledge_resource_asset_references_asset_id_idx"
    ON "knowledge_resource_asset_references"("asset_id");

ALTER TABLE "knowledge_resource_asset_references"
    ADD CONSTRAINT "knowledge_resource_asset_references_knowledge_resource_id_fkey"
    FOREIGN KEY ("knowledge_resource_id") REFERENCES "knowledge_resources"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "knowledge_resource_asset_references"
    ADD CONSTRAINT "knowledge_resource_asset_references_asset_id_fkey"
    FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
