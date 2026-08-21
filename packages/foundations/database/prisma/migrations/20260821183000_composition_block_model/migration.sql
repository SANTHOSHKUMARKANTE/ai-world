-- CreateTable
CREATE TABLE "composition_blocks" (
    "id" UUID NOT NULL,
    "universe_key" VARCHAR(128) NOT NULL,
    "block_type" VARCHAR(128) NOT NULL,
    "text_content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "composition_blocks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "composition_blocks_supported_type_check"
        CHECK ("block_type" = 'composition.block.text'),
    CONSTRAINT "composition_blocks_text_content_check"
        CHECK (
            char_length("text_content") BETWEEN 1 AND 10000
            AND btrim("text_content") <> ''
            AND position(chr(0) IN "text_content") = 0
        )
);

-- CreateIndex
CREATE INDEX "composition_blocks_universe_key_idx"
ON "composition_blocks"("universe_key");
