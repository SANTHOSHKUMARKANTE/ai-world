-- CreateTable
CREATE TABLE "composition_pages" (
    "id" UUID NOT NULL,
    "universe_key" VARCHAR(128) NOT NULL,
    "route_path" VARCHAR(512) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "lifecycle" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "composition_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "composition_pages_universe_key_route_path_key"
ON "composition_pages"("universe_key", "route_path");
