INSERT INTO "identity_permissions" (
    "id",
    "key",
    "description",
    "created_at",
    "updated_at"
)
VALUES (
    '267c7c36-c9f4-4aca-9101-83bb61f133e2',
    'composition.preview',
    'View controlled previews of draft Page composition.',
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
  AND permission_record."key" = 'composition.preview'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
