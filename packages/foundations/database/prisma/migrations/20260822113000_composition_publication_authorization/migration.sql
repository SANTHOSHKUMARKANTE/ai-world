INSERT INTO "identity_permissions" (
    "id",
    "key",
    "description",
    "created_at",
    "updated_at"
)
VALUES
    (
        'ec612f63-ab5e-4e21-b2da-29beb0363e72',
        'composition.publish',
        'Publish a draft Composition Page.',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '1e880704-13fb-4340-ac7e-bf1ad6c3e7d2',
        'composition.archive',
        'Archive a published Composition Page.',
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
  AND permission_record."key" IN ('composition.publish', 'composition.archive')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
