-- CreateTable
CREATE TABLE "composition_page_items" (
    "page_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "item_kind" VARCHAR(32) NOT NULL,
    "block_id" UUID,
    "knowledge_resource_id" UUID,
    "asset_id" UUID,

    CONSTRAINT "composition_page_items_pkey" PRIMARY KEY ("page_id", "position"),
    CONSTRAINT "composition_page_items_position_check" CHECK ("position" >= 0),
    CONSTRAINT "composition_page_items_reference_shape_check" CHECK (
        (
            "item_kind" = 'BLOCK'
            AND "block_id" IS NOT NULL
            AND "knowledge_resource_id" IS NULL
            AND "asset_id" IS NULL
        )
        OR (
            "item_kind" = 'KNOWLEDGE_RESOURCE'
            AND "block_id" IS NULL
            AND "knowledge_resource_id" IS NOT NULL
            AND "asset_id" IS NULL
        )
        OR (
            "item_kind" = 'MEDIA_ASSET'
            AND "block_id" IS NULL
            AND "knowledge_resource_id" IS NULL
            AND "asset_id" IS NOT NULL
        )
    ),
    CONSTRAINT "composition_page_items_page_id_fkey"
        FOREIGN KEY ("page_id") REFERENCES "composition_pages"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "composition_page_items_block_id_fkey"
        FOREIGN KEY ("block_id") REFERENCES "composition_blocks"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "composition_page_items_knowledge_resource_id_fkey"
        FOREIGN KEY ("knowledge_resource_id") REFERENCES "knowledge_resources"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "composition_page_items_asset_id_fkey"
        FOREIGN KEY ("asset_id") REFERENCES "media_assets"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "composition_page_items_block_id_idx"
ON "composition_page_items"("block_id");

-- CreateIndex
CREATE INDEX "composition_page_items_knowledge_resource_id_idx"
ON "composition_page_items"("knowledge_resource_id");

-- CreateIndex
CREATE INDEX "composition_page_items_asset_id_idx"
ON "composition_page_items"("asset_id");
