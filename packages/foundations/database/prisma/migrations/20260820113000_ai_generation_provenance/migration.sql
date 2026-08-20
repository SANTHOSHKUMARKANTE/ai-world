-- CreateTable
CREATE TABLE "ai_generation_provenance" (
    "generation_id" UUID NOT NULL,
    "task" VARCHAR(128) NOT NULL,
    "source_context" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generation_provenance_pkey" PRIMARY KEY ("generation_id")
);

-- AddForeignKey
ALTER TABLE "ai_generation_provenance" ADD CONSTRAINT "ai_generation_provenance_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "ai_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
