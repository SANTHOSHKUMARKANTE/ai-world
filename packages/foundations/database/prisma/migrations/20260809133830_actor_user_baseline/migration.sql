-- CreateTable
CREATE TABLE "identity_actors" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_actor_id_key" ON "users"("actor_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
