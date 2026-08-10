-- CreateTable
CREATE TABLE "identity_sessions" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "token_digest" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_sessions_token_digest_key" ON "identity_sessions"("token_digest");

-- CreateIndex
CREATE INDEX "identity_sessions_actor_id_idx" ON "identity_sessions"("actor_id");

-- CreateIndex
CREATE INDEX "identity_sessions_expires_at_idx" ON "identity_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "identity_sessions" ADD CONSTRAINT "identity_sessions_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
