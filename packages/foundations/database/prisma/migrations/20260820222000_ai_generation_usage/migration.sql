CREATE TABLE "ai_generation_usage" (
    "generation_id" UUID NOT NULL,
    "provider_latency_ms" INTEGER NOT NULL,
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "total_tokens" INTEGER,
    "failure_kind" VARCHAR(32),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generation_usage_pkey" PRIMARY KEY ("generation_id"),
    CONSTRAINT "ai_generation_usage_generation_id_fkey"
        FOREIGN KEY ("generation_id")
        REFERENCES "ai_generations"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT "ai_generation_usage_provider_latency_nonnegative"
        CHECK ("provider_latency_ms" >= 0),
    CONSTRAINT "ai_generation_usage_tokens_all_or_none"
        CHECK (
            ("input_tokens" IS NULL AND "output_tokens" IS NULL AND "total_tokens" IS NULL)
            OR
            ("input_tokens" IS NOT NULL AND "output_tokens" IS NOT NULL AND "total_tokens" IS NOT NULL)
        ),
    CONSTRAINT "ai_generation_usage_input_tokens_nonnegative"
        CHECK ("input_tokens" IS NULL OR "input_tokens" >= 0),
    CONSTRAINT "ai_generation_usage_output_tokens_nonnegative"
        CHECK ("output_tokens" IS NULL OR "output_tokens" >= 0),
    CONSTRAINT "ai_generation_usage_total_tokens_nonnegative"
        CHECK ("total_tokens" IS NULL OR "total_tokens" >= 0),
    CONSTRAINT "ai_generation_usage_failure_kind_supported"
        CHECK (
            "failure_kind" IS NULL
            OR "failure_kind" IN ('PROVIDER_ERROR', 'INVALID_OUTPUT')
        )
);
