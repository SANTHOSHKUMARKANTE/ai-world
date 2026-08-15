INSERT INTO "identity_roles" (
    "id",
    "key",
    "name",
    "created_at",
    "updated_at"
)
VALUES (
    '4f4c5e98-1b71-4a7f-8a95-7c1d6d4c9b01',
    'knowledge-editor',
    'Knowledge Editor',
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
VALUES
    (
        '9e7c6d5a-2b31-4f8e-9a47-6d1c5b3a2e10',
        'knowledge.resource.create',
        'Create canonical Knowledge Resources.',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '2c8a1e4d-6f53-4b9a-8d27-5e1c7a3b9f40',
        'knowledge.resource.update',
        'Update canonical Knowledge Resources.',
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
  AND permission_record."key" IN ('knowledge.resource.create', 'knowledge.resource.update')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
