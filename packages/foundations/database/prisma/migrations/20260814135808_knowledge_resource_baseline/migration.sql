-- CreateTable
CREATE TABLE "knowledge_resources" (
    "id" UUID NOT NULL,
    "universe_key" VARCHAR(128) NOT NULL,
    "resource_type" VARCHAR(128) NOT NULL,
    "lifecycle" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "knowledge_resources_pkey" PRIMARY KEY ("id")
);
