-- CreateTable
CREATE TABLE "ai_generations" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "provider" VARCHAR(64) NOT NULL,
    "model" VARCHAR(128),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generation_requests" (
    "generation_id" UUID NOT NULL,
    "input" TEXT NOT NULL,
    "instructions" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generation_requests_pkey" PRIMARY KEY ("generation_id")
);

-- CreateTable
CREATE TABLE "ai_generation_results" (
    "generation_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generation_results_pkey" PRIMARY KEY ("generation_id")
);

-- CreateIndex
CREATE INDEX "ai_generations_actor_id_idx" ON "ai_generations"("actor_id");

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generation_requests" ADD CONSTRAINT "ai_generation_requests_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "ai_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generation_results" ADD CONSTRAINT "ai_generation_results_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "ai_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
