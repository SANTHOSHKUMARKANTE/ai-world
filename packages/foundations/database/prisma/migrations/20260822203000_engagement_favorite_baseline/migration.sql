-- CreateTable
CREATE TABLE "engagement_favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engagement_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "engagement_favorites_user_id_resource_id_key"
ON "engagement_favorites"("user_id", "resource_id");

-- CreateIndex
CREATE INDEX "engagement_favorites_user_id_created_at_idx"
ON "engagement_favorites"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "engagement_favorites"
ADD CONSTRAINT "engagement_favorites_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
