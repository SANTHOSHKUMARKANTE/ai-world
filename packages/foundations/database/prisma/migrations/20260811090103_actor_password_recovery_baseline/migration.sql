-- CreateTable
CREATE TABLE "identity_password_recovery_challenges" (
    "id" UUID NOT NULL,
    "actor_email_id" UUID NOT NULL,
    "token_digest" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "consumed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_password_recovery_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_password_recovery_challenges_actor_email_id_key" ON "identity_password_recovery_challenges"("actor_email_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_password_recovery_challenges_token_digest_key" ON "identity_password_recovery_challenges"("token_digest");

-- CreateIndex
CREATE INDEX "identity_password_recovery_challenges_expires_at_idx" ON "identity_password_recovery_challenges"("expires_at");

-- AddForeignKey
ALTER TABLE "identity_password_recovery_challenges" ADD CONSTRAINT "identity_password_recovery_challenges_actor_email_id_fkey" FOREIGN KEY ("actor_email_id") REFERENCES "identity_actor_emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
