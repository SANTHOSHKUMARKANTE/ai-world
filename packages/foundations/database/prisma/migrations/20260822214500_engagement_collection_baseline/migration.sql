-- P9-M02 Collections baseline.
-- Engagement owns Collection and Collection membership semantics.
-- resource_id remains a generic Resource reference and intentionally has no
-- ownership-transfer foreign key to a Resource-owning Platform table.

CREATE TABLE "engagement_collections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "engagement_collections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "engagement_collection_resources" (
    "collection_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "added_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engagement_collection_resources_pkey"
        PRIMARY KEY ("collection_id", "resource_id")
);

CREATE INDEX "engagement_collections_user_id_created_at_idx"
    ON "engagement_collections"("user_id", "created_at");

CREATE INDEX "engagement_collection_resources_collection_id_added_at_idx"
    ON "engagement_collection_resources"("collection_id", "added_at");

ALTER TABLE "engagement_collections"
    ADD CONSTRAINT "engagement_collections_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "engagement_collection_resources"
    ADD CONSTRAINT "engagement_collection_resources_collection_id_fkey"
    FOREIGN KEY ("collection_id") REFERENCES "engagement_collections"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
