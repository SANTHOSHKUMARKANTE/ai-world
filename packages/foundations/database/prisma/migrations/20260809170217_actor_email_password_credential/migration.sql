-- CreateTable
CREATE TABLE "identity_actor_emails" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "normalized_email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_actor_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_password_credentials" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_password_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_actor_emails_actor_id_key" ON "identity_actor_emails"("actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_actor_emails_normalized_email_key" ON "identity_actor_emails"("normalized_email");

-- CreateIndex
CREATE UNIQUE INDEX "identity_password_credentials_actor_id_key" ON "identity_password_credentials"("actor_id");

-- AddForeignKey
ALTER TABLE "identity_actor_emails" ADD CONSTRAINT "identity_actor_emails_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_password_credentials" ADD CONSTRAINT "identity_password_credentials_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
