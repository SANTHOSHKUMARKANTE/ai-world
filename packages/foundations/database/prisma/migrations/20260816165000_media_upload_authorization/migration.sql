INSERT INTO "identity_permissions" (
    "id",
    "key",
    "description",
    "created_at",
    "updated_at"
)
VALUES (
    '978f6b7c-0e5b-4d58-8e57-5d95d4ca5c0f',
    'media.asset.upload',
    'Upload canonical Media Assets.',
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
  AND permission_record."key" = 'media.asset.upload'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
