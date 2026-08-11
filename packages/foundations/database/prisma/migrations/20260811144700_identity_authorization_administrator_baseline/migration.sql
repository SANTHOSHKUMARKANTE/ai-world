INSERT INTO "identity_roles" (
    "id",
    "key",
    "name",
    "created_at",
    "updated_at"
)
VALUES (
    '3dba1f0a-5f7f-4c5e-8d9b-74c3649dba9c',
    'administrator',
    'Administrator',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("key") DO UPDATE
SET
    "name" = EXCLUDED."name",
    "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "identity_permissions" (
    "id",
    "key",
    "description",
    "created_at",
    "updated_at"
)
VALUES (
    '88c4bc0f-17d7-41d8-8a19-59865b5be5df',
    'identity.authorization.manage',
    'Manage Identity and Access authorization assignments.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("key") DO UPDATE
SET
    "description" = EXCLUDED."description",
    "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "identity_role_permissions" (
    "role_id",
    "permission_id"
)
SELECT
    role_record."id",
    permission_record."id"
FROM "identity_roles" AS role_record
CROSS JOIN "identity_permissions" AS permission_record
WHERE role_record."key" = 'administrator'
  AND permission_record."key" = 'identity.authorization.manage'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;