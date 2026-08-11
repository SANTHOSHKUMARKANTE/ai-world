-- CreateTable
CREATE TABLE "identity_roles" (
    "id" UUID NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_permissions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "identity_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_actor_roles" (
    "actor_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_actor_roles_pkey" PRIMARY KEY ("actor_id","role_id")
);

-- CreateTable
CREATE TABLE "identity_role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "granted_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_roles_key_key" ON "identity_roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "identity_permissions_key_key" ON "identity_permissions"("key");

-- CreateIndex
CREATE INDEX "identity_actor_roles_role_id_idx" ON "identity_actor_roles"("role_id");

-- CreateIndex
CREATE INDEX "identity_role_permissions_permission_id_idx" ON "identity_role_permissions"("permission_id");

-- AddForeignKey
ALTER TABLE "identity_actor_roles" ADD CONSTRAINT "identity_actor_roles_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "identity_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_actor_roles" ADD CONSTRAINT "identity_actor_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_role_permissions" ADD CONSTRAINT "identity_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_role_permissions" ADD CONSTRAINT "identity_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "identity_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
