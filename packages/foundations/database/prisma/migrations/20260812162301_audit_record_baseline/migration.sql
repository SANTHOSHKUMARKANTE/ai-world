-- CreateTable
CREATE TABLE "audit_records" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "action" VARCHAR(128) NOT NULL,
    "resource_type" VARCHAR(128) NOT NULL,
    "resource_id" UUID NOT NULL,
    "result" VARCHAR(128) NOT NULL,
    "context" JSONB,
    "recorded_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "audit_records_pkey" PRIMARY KEY ("id")
);
