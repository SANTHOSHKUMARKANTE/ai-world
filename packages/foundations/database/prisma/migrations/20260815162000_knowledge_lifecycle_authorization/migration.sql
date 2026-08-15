INSERT INTO "identity_permissions" (
    "id",
    "key",
    "description",
    "created_at",
    "updated_at"
)
VALUES
    (
        '1a32f4e7-8d6b-4c91-a5e2-7f3b9d6c4a10',
        'knowledge.resource.publish',
        'Publish canonical Knowledge Resources.',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '6c4e2a18-3f95-4b7d-9a21-5e8c1d3f7b40',
        'knowledge.resource.archive',
        'Archive canonical Knowledge Resources.',
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
WHERE role_record."key" IN ('administrator', 'knowledge-editor')
  AND permission_record."key" IN ('knowledge.resource.publish', 'knowledge.resource.archive')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
